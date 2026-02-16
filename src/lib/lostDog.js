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

// ── localStorage cache (write-through only) ──────────
const LS_REPORTS = "pawpath_lost_dog_reports";
const LS_SIGHTINGS = "pawpath_lost_dog_sightings";

function setLocalReports(reports) {
  localStorage.setItem(LS_REPORTS, JSON.stringify(reports));
}
function setLocalSightings(sightings) {
  localStorage.setItem(LS_SIGHTINGS, JSON.stringify(sightings));
}

/**
 * Clear all stale lost dog data from localStorage.
 * Call on app init to ensure Supabase is the single source of truth.
 */
export function clearStaleLostDogData() {
  localStorage.removeItem(LS_REPORTS);
  localStorage.removeItem(LS_SIGHTINGS);
  console.log("[LostDog] Cleared stale localStorage cache");
}

// ══════════════════════════════════════════════════════
//  REPORT LOST DOG
// ══════════════════════════════════════════════════════

export async function reportLostDog(dogId, data) {
  const shareToken = generateToken();

  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");

    const { data: row, error } = await supabase
      .from("lost_dog_reports")
      .insert({
        user_id: userId,
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
      })
      .select()
      .single();

    if (error) throw error;

    console.log("[LostDog] Report saved to Supabase:", row.id);
    return ok(row);
  } catch (e) {
    console.error("[LostDog] Failed to insert report:", e);
    return fail(e);
  }
}

// ══════════════════════════════════════════════════════
//  GET ACTIVE LOST DOGS NEARBY
// ══════════════════════════════════════════════════════

export async function getActiveLostDogs(lat, lng, radiusKm = 15) {
  try {
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

    return ok(nearby);
  } catch (e) {
    console.error("[LostDog] Failed to fetch active reports:", e);
    return ok([]);
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
    return ok(data || []);
  } catch (e) {
    console.error("[LostDog] Failed to fetch my reports:", e);
    return ok([]);
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
  } catch (e) {
    console.error("[LostDog] Failed to fetch report:", reportId, e);
    return fail("Report not found");
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
  } catch (e) {
    console.error("[LostDog] Failed to fetch report by token:", shareToken, e);
    return fail("Report not found");
  }
}

// ══════════════════════════════════════════════════════
//  SIGHTINGS
// ══════════════════════════════════════════════════════

export async function reportSighting(reportId, sightingData) {
  try {
    const userId = await getUserId();

    const { data, error } = await supabase
      .from("lost_dog_sightings")
      .insert({
        report_id: reportId,
        user_id: userId,
        lat: sightingData.lat,
        lng: sightingData.lng,
        notes: sightingData.notes || null,
        photo: sightingData.photo || null,
        reporter_name: sightingData.reporterName || "Anonymous",
      })
      .select()
      .single();

    if (error) throw error;

    // Update report's updated_at
    await supabase
      .from("lost_dog_reports")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", reportId);

    console.log("[LostDog] Sighting saved to Supabase:", data.id);
    return ok(data);
  } catch (e) {
    console.error("[LostDog] Failed to insert sighting:", e);
    return fail(e);
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
    return ok(data || []);
  } catch (e) {
    console.error("[LostDog] Failed to fetch sightings:", e);
    return ok([]);
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

    console.log("[LostDog] Report marked as found:", reportId);
    window.dispatchEvent(new CustomEvent("pawpath-lost-dog-updated", { detail: { reportId, status: "found" } }));
    return ok(data);
  } catch (e) {
    console.error("[LostDog] Failed to mark as found:", reportId, e);
    // Still dispatch event to clear UI even if Supabase update failed
    window.dispatchEvent(new CustomEvent("pawpath-lost-dog-updated", { detail: { reportId, status: "found" } }));
    return fail(e);
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

    console.log("[LostDog] Report cancelled:", reportId);
    window.dispatchEvent(new CustomEvent("pawpath-lost-dog-updated", { detail: { reportId, status: "cancelled" } }));
    return ok(data);
  } catch (e) {
    console.error("[LostDog] Failed to cancel report:", reportId, e);
    window.dispatchEvent(new CustomEvent("pawpath-lost-dog-updated", { detail: { reportId, status: "cancelled" } }));
    return fail(e);
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
