import { supabase } from "./supabase.js";

// ── Helper: get current user ID ──────────────────────
async function getUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function ok(data) { return { data, error: null }; }
function fail(error) { return { data: null, error: error?.message ?? String(error) }; }

// ══════════════════════════════════════════════════════
//  DOGS
// ══════════════════════════════════════════════════════

export async function getDogs() {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("dogs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function createDog(dog) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("dogs")
      .insert({ user_id: userId, ...dog })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function updateDog(dogId, updates) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("dogs")
      .update(updates)
      .eq("id", dogId)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  DOG PROGRESS
// ══════════════════════════════════════════════════════

export async function getDogProgress(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("dog_progress")
      .select("*")
      .eq("dog_id", dogId)
      .eq("user_id", userId)
      .single();
    if (error && error.code !== "PGRST116") return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function updateDogProgress(dogId, updates) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("dog_progress")
      .upsert({ dog_id: dogId, user_id: userId, ...updates, updated_at: new Date().toISOString() }, { onConflict: "dog_id,user_id" })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  COMPLETED EXERCISES
// ══════════════════════════════════════════════════════

export async function getCompletedExercises(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("completed_exercises")
      .select("*")
      .eq("dog_id", dogId)
      .eq("user_id", userId)
      .order("completed_at", { ascending: true });
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function saveCompletedExercise(dogId, exerciseId, levelId, programId, xpEarned, isReview) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("completed_exercises")
      .insert({
        user_id: userId,
        dog_id: dogId,
        exercise_id: exerciseId,
        level_id: levelId,
        program_id: programId,
        xp_earned: xpEarned,
        is_review: isReview,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  JOURNAL ENTRIES
// ══════════════════════════════════════════════════════

export async function getJournalEntries(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("dog_id", dogId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function createJournalEntry(dogId, entry) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("journal_entries")
      .insert({ user_id: userId, dog_id: dogId, ...entry })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function updateJournalEntry(entryId, updates) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("journal_entries")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", entryId)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function deleteJournalEntry(entryId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", entryId)
      .eq("user_id", userId);
    if (error) return fail(error);
    return ok(true);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  EARNED BADGES
// ══════════════════════════════════════════════════════

export async function getEarnedBadges(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("earned_badges")
      .select("*")
      .eq("dog_id", dogId)
      .eq("user_id", userId)
      .order("earned_at", { ascending: true });
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function saveBadge(dogId, badgeId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("earned_badges")
      .insert({
        user_id: userId,
        dog_id: dogId,
        badge_id: badgeId,
        earned_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  SKILL FRESHNESS
// ══════════════════════════════════════════════════════

export async function getSkillFreshness(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("skill_freshness")
      .select("*")
      .eq("dog_id", dogId)
      .eq("user_id", userId);
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function updateSkillFreshness(dogId, exerciseId, freshnessData) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("skill_freshness")
      .upsert({
        user_id: userId,
        dog_id: dogId,
        exercise_id: exerciseId,
        last_completed: freshnessData.lastCompleted,
        interval_days: freshnessData.interval,
        completions: freshnessData.completions,
        updated_at: new Date().toISOString(),
      }, { onConflict: "dog_id,exercise_id" })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  CHALLENGE PROGRESS
// ══════════════════════════════════════════════════════

export async function getChallengeProgress(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("challenge_progress")
      .select("*")
      .eq("dog_id", dogId)
      .eq("user_id", userId)
      .single();
    if (error && error.code !== "PGRST116") return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function updateChallengeProgress(dogId, challengeData) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("challenge_progress")
      .upsert({
        user_id: userId,
        dog_id: dogId,
        active_challenge: challengeData.active,
        history: challengeData.history,
        stats: challengeData.stats,
        updated_at: new Date().toISOString(),
      }, { onConflict: "dog_id,user_id" })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  STREAK HISTORY
// ══════════════════════════════════════════════════════

export async function getStreakHistory(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("streak_history")
      .select("*")
      .eq("dog_id", dogId)
      .eq("user_id", userId)
      .single();
    if (error && error.code !== "PGRST116") return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function saveStreakHistory(dogId, streakData) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("streak_history")
      .upsert({
        user_id: userId,
        dog_id: dogId,
        current: streakData.current,
        best: streakData.best,
        last_training_date: streakData.lastTrainingDate,
        total_training_days: streakData.totalTrainingDays,
        start_date: streakData.startDate,
        freezes: streakData.freezes,
        milestones: streakData.milestones,
        recovery: streakData.recovery,
        history: streakData.history,
        recovered_once: streakData.recoveredOnce ?? false,
        updated_at: new Date().toISOString(),
      }, { onConflict: "dog_id,user_id" })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  UNLOCKED REWARDS
// ══════════════════════════════════════════════════════

export async function getUnlockedRewards() {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("unlocked_rewards")
      .select("*")
      .eq("user_id", userId);
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function saveUnlockedReward(rewardId, rewardType) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("unlocked_rewards")
      .upsert({
        user_id: userId,
        reward_id: rewardId,
        reward_type: rewardType,
        unlocked_at: new Date().toISOString(),
      }, { onConflict: "user_id,reward_id" })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  USER SETTINGS
// ══════════════════════════════════════════════════════

export async function getUserSettings() {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error && error.code !== "PGRST116") return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function updateUserSettings(settings) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: userId,
        lang: settings.lang,
        reminders: settings.reminders,
        active_theme: settings.activeTheme,
        unlocked_themes: settings.unlockedThemes,
        active_accessories: settings.activeAccessories,
        unlocked_accessories: settings.unlockedAccessories,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  DELETE HELPERS
// ══════════════════════════════════════════════════════

export async function deleteDog(dogId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { error } = await supabase
      .from("dogs")
      .delete()
      .eq("id", dogId)
      .eq("user_id", userId);
    if (error) return fail(error);
    return ok(true);
  } catch (e) { return fail(e); }
}

export async function deleteAllUserData() {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const tables = [
      "completed_exercises", "journal_entries", "earned_badges",
      "skill_freshness", "challenge_progress", "streak_history",
      "dog_progress", "unlocked_rewards", "user_settings", "feedback", "dogs",
    ];
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().eq("user_id", userId);
      if (error) console.warn(`deleteAllUserData: failed on ${table}`, error.message);
    }
    return ok(true);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  FEEDBACK
// ══════════════════════════════════════════════════════

export async function saveFeedback(entry) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { data, error } = await supabase
      .from("feedback")
      .insert({
        user_id: userId,
        type: entry.type,
        message: entry.message,
        rating: entry.rating ?? null,
        contact: entry.contact ?? null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}
