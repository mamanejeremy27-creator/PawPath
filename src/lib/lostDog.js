import { supabase } from "./supabase.js";
import { haversine } from "./walkTracker.js";

// ── Helpers ──────────────────────────────────────────
function ok(data) { return { data, error: null }; }
function fail(error) { return { data: null, error: error?.message ?? String(error) }; }

async function getUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Generate a random 12-char share token */
function generateToken() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let token = "";
  for (let i = 0; i < 12; i++) token += chars[Math.floor(Math.random() * chars.length)];
  return token;
}

// ── localStorage keys ────────────────────────────────
const LS_REPORTS = "pawpath_lost_dog_reports";
const LS_SIGHTINGS = "pawpath_lost_dog_sightings";

function getLocalReports() {
  try { return JSON.parse(localStorage.getItem(LS_REPORTS) || "[]"); } catch { return []; }
}
function setLocalReports(reports) {
  localStorage.setItem(LS_REPORTS, JSON.stringify(reports));
}
function getLocalSightings() {
  try { return JSON.parse(localStorage.getItem(LS_SIGHTINGS) || "[]"); } catch { return []; }
}
function setLocalSightings(sightings) {
  localStorage.setItem(LS_SIGHTINGS, JSON.stringify(sightings));
}

// ══════════════════════════════════════════════════════
//  REPORT LOST DOG
// ══════════════════════════════════════════════════════

export async function reportLostDog(dogId, data) {
  const shareToken = generateToken();
  const report = {
    id: crypto.randomUUID ? crypto.randomUUID() : `local_${Date.now()}`,
    dog_id: dogId,
    dog_name: data.dogName,
    dog_breed: data.dogBreed,
    dog_photo: data.dogPhoto || null,
    last_lat: data.lastLat,
    last_lng: data.lastLng,
    last_location_name: data.lastLocationName || null,
    contact_name: data.contactName,
    contact_phone: data.contactPhone,
    description: data.description || null,
    search_radius_km: data.searchRadiusKm || 10,
    share_token: shareToken,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");

    const { data: row, error } = await supabase
      .from("lost_dog_reports")
      .insert({ ...report, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    // Also save locally for offline access
    const local = getLocalReports();
    local.push(row);
    setLocalReports(local);

    return ok(row);
  } catch (e) {
    // Fallback to localStorage
    const local = getLocalReports();
    local.push(report);
    setLocalReports(local);
    return ok(report);
  }
}

// ══════════════════════════════════════════════════════
//  GET ACTIVE LOST DOGS NEARBY
// ══════════════════════════════════════════════════════

export async function getActiveLostDogs(lat, lng, radiusKm = 15) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("lost_dog_reports")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Filter by distance client-side
    const nearby = (data || []).filter(r => {
      if (!r.last_lat || !r.last_lng) return false;
      const dist = haversine(lat, lng, r.last_lat, r.last_lng);
      r._distance = dist;
      return dist <= radiusKm;
    }).sort((a, b) => a._distance - b._distance);

    // Merge with local reports
    const local = getLocalReports().filter(r => r.status === "active");
    const ids = new Set(nearby.map(r => r.id));
    for (const lr of local) {
      if (!ids.has(lr.id) && lr.last_lat && lr.last_lng) {
        const dist = haversine(lat, lng, lr.last_lat, lr.last_lng);
        if (dist <= radiusKm) {
          lr._distance = dist;
          nearby.push(lr);
        }
      }
    }

    return ok(nearby);
  } catch (e) {
    // Fallback to localStorage only
    const local = getLocalReports().filter(r => r.status === "active");
    const nearby = local.filter(r => {
      if (!r.last_lat || !r.last_lng) return false;
      const dist = haversine(lat, lng, r.last_lat, r.last_lng);
      r._distance = dist;
      return dist <= radiusKm;
    });
    return ok(nearby);
  }
}

// ══════════════════════════════════════════════════════
//  GET MY REPORTS
// ══════════════════════════════════════════════════════

export async function getMyReports() {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("lost_dog_reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Merge localStorage
    const local = getLocalReports();
    const ids = new Set((data || []).map(r => r.id));
    const merged = [...(data || [])];
    for (const lr of local) {
      if (!ids.has(lr.id)) merged.push(lr);
    }
    return ok(merged);
  } catch {
    return ok(getLocalReports());
  }
}

// ══════════════════════════════════════════════════════
//  GET SINGLE REPORT
// ══════════════════════════════════════════════════════

export async function getReport(reportId) {
  try {
    const { data, error } = await supabase
      .from("lost_dog_reports")
      .select("*")
      .eq("id", reportId)
      .single();
    if (error) throw error;
    return ok(data);
  } catch {
    const local = getLocalReports().find(r => r.id === reportId);
    return local ? ok(local) : fail("Report not found");
  }
}

export async function getReportByToken(shareToken) {
  try {
    const { data, error } = await supabase
      .from("lost_dog_reports")
      .select("*")
      .eq("share_token", shareToken)
      .single();
    if (error) throw error;
    return ok(data);
  } catch {
    const local = getLocalReports().find(r => r.share_token === shareToken);
    return local ? ok(local) : fail("Report not found");
  }
}

// ══════════════════════════════════════════════════════
//  SIGHTINGS
// ══════════════════════════════════════════════════════

export async function reportSighting(reportId, sightingData) {
  const sighting = {
    id: crypto.randomUUID ? crypto.randomUUID() : `local_${Date.now()}`,
    report_id: reportId,
    lat: sightingData.lat,
    lng: sightingData.lng,
    notes: sightingData.notes || null,
    photo: sightingData.photo || null,
    reporter_name: sightingData.reporterName || "Anonymous",
    created_at: new Date().toISOString(),
  };

  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("lost_dog_sightings")
      .insert({ ...sighting, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    // Update report's updated_at
    await supabase
      .from("lost_dog_reports")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", reportId);

    const local = getLocalSightings();
    local.push(data);
    setLocalSightings(local);
    return ok(data);
  } catch {
    const local = getLocalSightings();
    local.push(sighting);
    setLocalSightings(local);
    return ok(sighting);
  }
}

export async function getSightings(reportId) {
  try {
    const { data, error } = await supabase
      .from("lost_dog_sightings")
      .select("*")
      .eq("report_id", reportId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const local = getLocalSightings().filter(s => s.report_id === reportId);
    const ids = new Set((data || []).map(s => s.id));
    const merged = [...(data || [])];
    for (const ls of local) {
      if (!ids.has(ls.id)) merged.push(ls);
    }
    return ok(merged);
  } catch {
    return ok(getLocalSightings().filter(s => s.report_id === reportId));
  }
}

// ══════════════════════════════════════════════════════
//  STATUS UPDATES
// ══════════════════════════════════════════════════════

export async function markAsFound(reportId) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("lost_dog_reports")
      .update({ status: "found", updated_at: new Date().toISOString() })
      .eq("id", reportId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    // Update local
    const local = getLocalReports();
    const idx = local.findIndex(r => r.id === reportId);
    if (idx >= 0) local[idx].status = "found";
    setLocalReports(local);

    window.dispatchEvent(new CustomEvent("pawpath-lost-dog-updated", { detail: { reportId, status: "found" } }));
    return ok(data);
  } catch {
    const local = getLocalReports();
    const idx = local.findIndex(r => r.id === reportId);
    if (idx >= 0) { local[idx].status = "found"; setLocalReports(local); }
    window.dispatchEvent(new CustomEvent("pawpath-lost-dog-updated", { detail: { reportId, status: "found" } }));
    return ok({ id: reportId, status: "found" });
  }
}

export async function cancelReport(reportId) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("lost_dog_reports")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", reportId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    const local = getLocalReports();
    const idx = local.findIndex(r => r.id === reportId);
    if (idx >= 0) local[idx].status = "cancelled";
    setLocalReports(local);

    window.dispatchEvent(new CustomEvent("pawpath-lost-dog-updated", { detail: { reportId, status: "cancelled" } }));
    return ok(data);
  } catch {
    const local = getLocalReports();
    const idx = local.findIndex(r => r.id === reportId);
    if (idx >= 0) { local[idx].status = "cancelled"; setLocalReports(local); }
    window.dispatchEvent(new CustomEvent("pawpath-lost-dog-updated", { detail: { reportId, status: "cancelled" } }));
    return ok({ id: reportId, status: "cancelled" });
  }
}

// ══════════════════════════════════════════════════════
//  SHARE URL HELPERS
// ══════════════════════════════════════════════════════

export function getShareUrl(shareToken) {
  return `${window.location.origin}/lost/${shareToken}`;
}

export function getShareText(report, lang = "en") {
  const name = report.dog_name || "Dog";
  const breed = report.dog_breed || "";
  const url = getShareUrl(report.share_token);
  if (lang === "he") {
    return `🚨 כלב אבוד! ${name}${breed ? ` (${breed})` : ""} נראה לאחרונה באזור. אם ראיתם אותו, אנא דווחו: ${url}`;
  }
  return `🚨 LOST DOG! ${name}${breed ? ` (${breed})` : ""} was last seen in the area. If you spot them, please report: ${url}`;
}
