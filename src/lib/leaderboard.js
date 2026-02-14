import { supabase } from "./supabase.js";

// ── Helpers ──────────────────────────────────────────
function ok(data) { return { data, error: null }; }
function fail(error) { return { data: null, error: error?.message ?? String(error) }; }

async function getUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Returns current week's Monday as YYYY-MM-DD */
export function getMonday() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday = 1
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday.toISOString().slice(0, 10);
}

/** Gets display name from authenticated user */
async function getOwnerName() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "";
  const meta = user.user_metadata || {};
  return meta.full_name || meta.name || (user.email ? user.email.split("@")[0] : "");
}

// ── Leaderboard CRUD ─────────────────────────────────

export async function updateLeaderboardEntry(dogId, { dogName, breed, totalXp, weeklyXpGain, currentStreak }) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const ownerName = await getOwnerName();
    const monday = getMonday();

    // Fetch existing entry
    const { data: existing } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .eq("user_id", userId)
      .eq("dog_id", dogId)
      .single();

    let weeklyXp = weeklyXpGain;
    if (existing) {
      if (existing.week_start === monday) {
        // Same week — accumulate
        weeklyXp = (existing.weekly_xp || 0) + weeklyXpGain;
      }
      // else: stale week — reset to weeklyXpGain (already set)
    }

    const { data, error } = await supabase
      .from("leaderboard_entries")
      .upsert({
        user_id: userId,
        dog_id: dogId,
        dog_name: dogName || "",
        owner_name: ownerName,
        breed: breed || "",
        total_xp: totalXp,
        weekly_xp: weeklyXp,
        week_start: monday,
        current_streak: currentStreak || 0,
        opt_in: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,dog_id" })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function getWeeklyLeaderboard(limit = 20) {
  try {
    const monday = getMonday();
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .eq("week_start", monday)
      .eq("opt_in", true)
      .order("weekly_xp", { ascending: false })
      .limit(limit);
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function getAllTimeLeaderboard(limit = 20) {
  try {
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .eq("opt_in", true)
      .order("total_xp", { ascending: false })
      .limit(limit);
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function getBreedLeaderboard(breed, limit = 20) {
  try {
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .eq("breed", breed)
      .eq("opt_in", true)
      .order("total_xp", { ascending: false })
      .limit(limit);
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function setLeaderboardOptIn(dogId, optIn) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .update({ opt_in: optIn, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("dog_id", dogId)
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function getUserEntry(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .eq("user_id", userId)
      .eq("dog_id", dogId)
      .single();
    if (error && error.code !== "PGRST116") return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}
