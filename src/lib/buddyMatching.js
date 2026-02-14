import { supabase } from "./supabase.js";

// ── Helpers ──────────────────────────────────────────
function ok(data) { return { data, error: null }; }
function fail(error) { return { data: null, error: error?.message ?? String(error) }; }

async function getUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

async function getOwnerName() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "";
  const meta = user.user_metadata || {};
  return meta.full_name || meta.name || (user.email ? user.email.split("@")[0] : "");
}

const MAX_BUDDIES = 3;

// ══════════════════════════════════════════════════════
//  FIND POTENTIAL BUDDIES
// ══════════════════════════════════════════════════════

/**
 * Find potential buddy matches by querying leaderboard_entries
 * (which has dog_name, breed, streak, total_xp, weekly_xp).
 * Ranks by similarity to the current user's dog.
 */
export async function findPotentialBuddies(myProfile, limit = 20) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    // Fetch candidates from leaderboard (opt-in users with recent activity)
    const { data: candidates, error } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .eq("opt_in", true)
      .neq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) return fail(error);
    if (!candidates || candidates.length === 0) return ok([]);

    // Get existing buddy pairs to exclude
    const { data: existingPairs } = await supabase
      .from("buddy_pairs")
      .select("user_a, user_b")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .in("status", ["active", "pending"]);

    const excludeIds = new Set();
    excludeIds.add(userId);
    if (existingPairs) {
      for (const p of existingPairs) {
        excludeIds.add(p.user_a);
        excludeIds.add(p.user_b);
      }
    }

    // Score and rank candidates
    const myBreed = (myProfile?.breed || "").toLowerCase();
    const myAge = (myProfile?.age || "").toLowerCase();

    const scored = candidates
      .filter(c => !excludeIds.has(c.user_id))
      .map(c => {
        let score = 0;
        // Breed match (40 points)
        const cBreed = (c.breed || "").toLowerCase();
        if (cBreed && myBreed && cBreed === myBreed) score += 40;
        else if (cBreed && myBreed && (cBreed.includes(myBreed.split(" ")[0]) || myBreed.includes(cBreed.split(" ")[0]))) score += 20;

        // Active user bonus (30 points for weekly activity)
        if (c.weekly_xp > 0) score += 15;
        if (c.weekly_xp >= 50) score += 15;

        // Streak similarity (20 points)
        if (c.current_streak > 0) score += 10;
        if (c.current_streak >= 3) score += 10;

        // Has some training done (10 points)
        if (c.total_xp > 50) score += 10;

        return {
          userId: c.user_id,
          dogId: c.dog_id,
          dogName: c.dog_name || "Dog",
          ownerName: c.owner_name || "",
          breed: c.breed || "",
          currentStreak: c.current_streak || 0,
          totalXP: c.total_xp || 0,
          weeklyXP: c.weekly_xp || 0,
          score: Math.min(score, 100),
          updatedAt: c.updated_at,
        };
      })
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return ok(scored);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  BUDDY PAIRS
// ══════════════════════════════════════════════════════

export async function sendBuddyRequest(toUserId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    // Check max buddies
    const { data: activePairs } = await supabase
      .from("buddy_pairs")
      .select("id")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .eq("status", "active");

    if (activePairs && activePairs.length >= MAX_BUDDIES) {
      return fail("Maximum buddies reached");
    }

    const ownerName = await getOwnerName();

    const { data, error } = await supabase
      .from("buddy_pairs")
      .insert({
        user_a: userId,
        user_b: toUserId,
        user_a_name: ownerName,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function acceptBuddyRequest(pairId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    // Check max buddies before accepting
    const { data: activePairs } = await supabase
      .from("buddy_pairs")
      .select("id")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .eq("status", "active");

    if (activePairs && activePairs.length >= MAX_BUDDIES) {
      return fail("Maximum buddies reached");
    }

    const { data, error } = await supabase
      .from("buddy_pairs")
      .update({ status: "active", accepted_at: new Date().toISOString() })
      .eq("id", pairId)
      .eq("user_b", userId)
      .select()
      .single();

    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function declineBuddyRequest(pairId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { data, error } = await supabase
      .from("buddy_pairs")
      .update({ status: "declined" })
      .eq("id", pairId)
      .eq("user_b", userId)
      .select()
      .single();

    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function endBuddyPair(pairId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { data, error } = await supabase
      .from("buddy_pairs")
      .update({ status: "ended", ended_at: new Date().toISOString() })
      .eq("id", pairId)
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .select()
      .single();

    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function getBuddyPairs(userId) {
  try {
    if (!userId) {
      userId = await getUserId();
      if (!userId) return fail("Not authenticated");
    }

    const { data, error } = await supabase
      .from("buddy_pairs")
      .select("*")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .in("status", ["active", "pending"])
      .order("created_at", { ascending: false });

    if (error) return fail(error);
    return ok(data || []);
  } catch (e) { return fail(e); }
}

/**
 * Get the leaderboard entry for a given user (to show their stats)
 */
export async function getBuddyStats(buddyUserId) {
  try {
    const { data, error } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .eq("user_id", buddyUserId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  NUDGES
// ══════════════════════════════════════════════════════

export async function sendNudge(toUserId, message) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const ownerName = await getOwnerName();

    const { data, error } = await supabase
      .from("buddy_nudges")
      .insert({
        from_user: userId,
        to_user: toUserId,
        from_name: ownerName,
        message: message || "",
        read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function getNudges() {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { data, error } = await supabase
      .from("buddy_nudges")
      .select("*")
      .eq("to_user", userId)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return fail(error);
    return ok(data || []);
  } catch (e) { return fail(e); }
}

export async function markNudgeRead(nudgeId) {
  try {
    const { error } = await supabase
      .from("buddy_nudges")
      .update({ read: true })
      .eq("id", nudgeId);

    if (error) return fail(error);
    return ok(true);
  } catch (e) { return fail(e); }
}

export async function markAllNudgesRead() {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");

    const { error } = await supabase
      .from("buddy_nudges")
      .update({ read: true })
      .eq("to_user", userId)
      .eq("read", false);

    if (error) return fail(error);
    return ok(true);
  } catch (e) { return fail(e); }
}
