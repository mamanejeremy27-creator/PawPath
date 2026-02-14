import { supabase } from "./supabase.js";

// ── Helpers ──────────────────────────────────────────
function ok(data) { return { data, error: null }; }
function fail(error) { return { data: null, error: error?.message ?? String(error) }; }

async function getUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ── Common Vaccines ──────────────────────────────────
export const COMMON_VACCINES = [
  { id: "rabies", name: { en: "Rabies", he: "כלבת" } },
  { id: "dhpp", name: { en: "DHPP", he: "משושה" } },
  { id: "bordetella", name: { en: "Bordetella", he: "בורדטלה" } },
  { id: "leptospirosis", name: { en: "Leptospirosis", he: "לפטוספירוזיס" } },
  { id: "lyme", name: { en: "Lyme", he: "ליים" } },
];

// ── Breed Weight Ranges ──────────────────────────────
export function getBreedWeightRange(size) {
  switch (size) {
    case "small": return { min: 3, max: 10 };
    case "medium": return { min: 10, max: 25 };
    case "large": return { min: 25, max: 45 };
    case "giant": return { min: 35, max: 70 };
    default: return null;
  }
}

// ══════════════════════════════════════════════════════
//  WEIGHT LOGS
// ══════════════════════════════════════════════════════

export async function saveWeightLog(dogId, data) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { data: row, error } = await supabase
      .from("weight_logs")
      .insert({
        user_id: userId,
        dog_id: dogId,
        weight_kg: data.weight_kg,
        date: data.date,
        notes: data.notes || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return fail(error);
    return ok(row);
  } catch (e) { return fail(e); }
}

export async function getWeightLogs(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { data, error } = await supabase
      .from("weight_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("dog_id", dogId)
      .order("date", { ascending: false });

    if (error) return fail(error);
    return ok(data || []);
  } catch (e) { return fail(e); }
}

export async function deleteWeightLog(id) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { error } = await supabase
      .from("weight_logs")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return fail(error);
    return ok(true);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  VACCINATIONS
// ══════════════════════════════════════════════════════

export async function saveVaccination(dogId, data) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { data: row, error } = await supabase
      .from("vaccinations")
      .insert({
        user_id: userId,
        dog_id: dogId,
        vaccine_name: data.vaccine_name,
        date_given: data.date_given,
        next_due: data.next_due || null,
        vet_name: data.vet_name || null,
        notes: data.notes || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return fail(error);
    return ok(row);
  } catch (e) { return fail(e); }
}

export async function getVaccinations(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { data, error } = await supabase
      .from("vaccinations")
      .select("*")
      .eq("user_id", userId)
      .eq("dog_id", dogId)
      .order("date_given", { ascending: false });

    if (error) return fail(error);
    return ok(data || []);
  } catch (e) { return fail(e); }
}

export async function deleteVaccination(id) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { error } = await supabase
      .from("vaccinations")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return fail(error);
    return ok(true);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  VET VISITS
// ══════════════════════════════════════════════════════

export async function saveVetVisit(dogId, data) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { data: row, error } = await supabase
      .from("vet_visits")
      .insert({
        user_id: userId,
        dog_id: dogId,
        date: data.date,
        reason: data.reason || null,
        vet_name: data.vet_name || null,
        diagnosis: data.diagnosis || null,
        treatment: data.treatment || null,
        cost: data.cost || null,
        notes: data.notes || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return fail(error);
    return ok(row);
  } catch (e) { return fail(e); }
}

export async function getVetVisits(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { data, error } = await supabase
      .from("vet_visits")
      .select("*")
      .eq("user_id", userId)
      .eq("dog_id", dogId)
      .order("date", { ascending: false });

    if (error) return fail(error);
    return ok(data || []);
  } catch (e) { return fail(e); }
}

export async function deleteVetVisit(id) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { error } = await supabase
      .from("vet_visits")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return fail(error);
    return ok(true);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  MEDICATIONS
// ══════════════════════════════════════════════════════

export async function saveMedication(dogId, data) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { data: row, error } = await supabase
      .from("medications")
      .insert({
        user_id: userId,
        dog_id: dogId,
        name: data.name,
        dosage: data.dosage || null,
        frequency: data.frequency || null,
        start_date: data.start_date,
        end_date: data.end_date || null,
        reminder_time: data.reminder_time || null,
        notes: data.notes || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return fail(error);
    return ok(row);
  } catch (e) { return fail(e); }
}

export async function getMedications(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { data, error } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", userId)
      .eq("dog_id", dogId)
      .order("start_date", { ascending: false });

    if (error) return fail(error);
    return ok(data || []);
  } catch (e) { return fail(e); }
}

export async function deleteMedication(id) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { error } = await supabase
      .from("medications")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return fail(error);
    return ok(true);
  } catch (e) { return fail(e); }
}
