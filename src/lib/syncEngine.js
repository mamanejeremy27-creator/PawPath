import {
  getDogs, createDog, updateDogProgress, getDogProgress,
  getCompletedExercises, saveCompletedExercise,
  getJournalEntries, createJournalEntry,
  getEarnedBadges, saveBadge,
  getSkillFreshness, updateSkillFreshness,
  getChallengeProgress, updateChallengeProgress,
  getStreakHistory, saveStreakHistory,
  getUserSettings, updateUserSettings,
  getUnlockedRewards, saveUnlockedReward,
} from "./database.js";

const DEFAULT_STREAKS = {
  current: 0, best: 0, lastTrainingDate: null, totalTrainingDays: 0,
  startDate: null, freezes: { available: 0, maxFreezes: 3, totalUsed: 0, totalEarned: 0, lastUsedDate: null },
  milestones: { unlocked: [], claimedRewards: [] },
  recovery: { active: false, daysCompleted: 0, startDate: null },
  history: [], recoveredOnce: false,
};

// ── Reconstruct a single dog's state from Supabase rows ──
function reconstructDogState(dog, progress, exercises, journalRows, badgeRows, freshnessRows, challengeRow, streakRow) {
  // Only non-review completions count as "completed", and deduplicate
  const completedExercises = [...new Set(
    exercises.filter(r => !r.is_review).map(r => r.exercise_id)
  )];
  // Journal: DB returns newest-first, but app stores oldest-first
  const journal = journalRows.map(r => ({
    id: r.id,
    date: r.created_at,
    exerciseId: r.exercise_id,
    exerciseName: r.exercise_name,
    programName: r.program_name,
    programEmoji: r.program_emoji,
    note: r.note || "",
    rating: r.rating ?? 3,
    mood: r.mood || "happy",
    ...(r.photos && r.photos.length > 0 && { photos: r.photos }),
  })).reverse();
  const earnedBadges = badgeRows.map(r => r.badge_id);
  const skillFreshness = {};
  for (const r of freshnessRows) {
    skillFreshness[r.exercise_id] = {
      lastCompleted: r.last_completed,
      interval: r.interval_days,
      completions: r.completions,
    };
  }

  const challenges = challengeRow
    ? { active: challengeRow.active_challenge, history: challengeRow.history || [], stats: challengeRow.stats || { totalCompleted: 0, currentStreak: 0, bestStreak: 0 } }
    : { active: null, history: [], stats: { totalCompleted: 0, currentStreak: 0, bestStreak: 0 } };

  const streaks = streakRow
    ? {
        current: streakRow.current ?? 0,
        best: streakRow.best ?? 0,
        lastTrainingDate: streakRow.last_training_date,
        totalTrainingDays: streakRow.total_training_days ?? 0,
        startDate: streakRow.start_date,
        freezes: streakRow.freezes || DEFAULT_STREAKS.freezes,
        milestones: streakRow.milestones || DEFAULT_STREAKS.milestones,
        recovery: streakRow.recovery || DEFAULT_STREAKS.recovery,
        history: streakRow.history || [],
        recoveredOnce: streakRow.recovered_once ?? false,
      }
    : { ...DEFAULT_STREAKS };

  // Compute completedLevels from exercises (progress row may have it)
  const completedLevels = progress?.completed_levels || [];

  return {
    profile: {
      name: dog.name,
      breed: dog.breed,
      birthday: dog.birthday,
      weight: dog.weight,
      avatar: dog.avatar,
      ...(dog.extra_profile && typeof dog.extra_profile === "object" ? dog.extra_profile : {}),
    },
    completedExercises,
    completedLevels,
    totalXP: progress?.total_xp ?? 0,
    currentStreak: streaks.current,
    lastTrainDate: streaks.lastTrainingDate ? new Date(streaks.lastTrainingDate).toDateString() : null,
    totalSessions: progress?.total_sessions ?? 0,
    earnedBadges,
    journal,
    skillFreshness,
    totalReviews: progress?.total_reviews ?? 0,
    lastKnownStage: progress?.last_known_stage ?? null,
    challenges,
    streaks,
    difficultyTracking: progress?.difficulty_tracking ?? { exercises: {} },
  };
}

// ── Load all user data from Supabase → AppContext shape ──
export async function loadUserData() {
  try {
    const dogsResult = await getDogs();
    if (dogsResult.error || !dogsResult.data) return { data: null, error: dogsResult.error };
    const dogRows = dogsResult.data;
    if (dogRows.length === 0) return { data: { dogs: {}, activeDogId: null, lang: "en", reminders: null, appSettings: null, idMap: {} }, error: null };

    const idMap = {};
    const dogs = {};

    // Fetch per-dog data in parallel
    const dogPromises = dogRows.map(async (dog, idx) => {
      const localId = `dog_${idx + 1}`;
      idMap[localId] = dog.id;

      const [progressRes, exercisesRes, journalRes, badgesRes, freshnessRes, challengeRes, streakRes] = await Promise.all([
        getDogProgress(dog.id),
        getCompletedExercises(dog.id),
        getJournalEntries(dog.id),
        getEarnedBadges(dog.id),
        getSkillFreshness(dog.id),
        getChallengeProgress(dog.id),
        getStreakHistory(dog.id),
      ]);

      dogs[localId] = reconstructDogState(
        dog,
        progressRes.data,
        exercisesRes.data || [],
        journalRes.data || [],
        badgesRes.data || [],
        freshnessRes.data || [],
        challengeRes.data,
        streakRes.data,
      );
    });

    await Promise.all(dogPromises);

    // Fetch user-level settings
    const [settingsRes, rewardsRes] = await Promise.all([
      getUserSettings(),
      getUnlockedRewards(),
    ]);

    const settings = settingsRes.data;
    const rewards = rewardsRes.data || [];

    const appSettings = settings ? {
      activeTheme: settings.active_theme || "default",
      unlockedThemes: settings.unlocked_themes || ["default"],
      activeAccessories: settings.active_accessories || [],
      unlockedAccessories: settings.unlocked_accessories || [],
    } : null;

    // Figure out which local ID was the active dog (default to first)
    const activeDogId = Object.keys(dogs)[0] || null;

    return {
      data: {
        dogs,
        activeDogId,
        lang: settings?.lang || "en",
        reminders: settings?.reminders || null,
        appSettings,
        idMap,
      },
      error: null,
    };
  } catch (e) {
    return { data: null, error: e.message || String(e) };
  }
}

// ── Migrate localStorage data to Supabase (first login) ──
export async function migrateLocalToSupabase(localState) {
  try {
    const idMap = {};
    const dogEntries = Object.entries(localState.dogs || {});

    for (const [localId, dog] of dogEntries) {
      if (!dog.profile) continue;

      const dogPayload = {
        name: dog.profile.name,
        breed: dog.profile.breed || null,
        birthday: dog.profile.birthday || null,
        weight: dog.profile.weight || null,
        avatar: dog.profile.avatar || null,
      };

      const createRes = await createDog(dogPayload);
      if (createRes.error || !createRes.data) {
        console.warn("migrateLocalToSupabase: failed to create dog", localId, createRes.error);
        continue;
      }

      const supaId = createRes.data.id;
      idMap[localId] = supaId;

      // Parallel writes for this dog's data
      const promises = [];

      // Dog progress
      promises.push(updateDogProgress(supaId, {
        total_xp: dog.totalXP || 0,
        total_sessions: dog.totalSessions || 0,
        total_reviews: dog.totalReviews || 0,
        completed_levels: dog.completedLevels || [],
        last_known_stage: dog.lastKnownStage || null,
        difficulty_tracking: dog.difficultyTracking || { exercises: {} },
      }));

      // Completed exercises
      for (const exId of (dog.completedExercises || [])) {
        promises.push(saveCompletedExercise(supaId, exId, null, null, 0, false));
      }

      // Journal entries
      for (const entry of (dog.journal || [])) {
        promises.push(createJournalEntry(supaId, {
          exercise_id: entry.exerciseId,
          exercise_name: entry.exerciseName,
          program_name: entry.programName,
          program_emoji: entry.programEmoji,
          note: entry.note || "",
          rating: entry.rating ?? 3,
          mood: entry.mood || "happy",
          photos: entry.photos || [],
          created_at: entry.date || new Date().toISOString(),
        }));
      }

      // Earned badges
      for (const badgeId of (dog.earnedBadges || [])) {
        promises.push(saveBadge(supaId, badgeId));
      }

      // Skill freshness
      for (const [exId, data] of Object.entries(dog.skillFreshness || {})) {
        promises.push(updateSkillFreshness(supaId, exId, data));
      }

      // Challenge progress
      if (dog.challenges) {
        promises.push(updateChallengeProgress(supaId, dog.challenges));
      }

      // Streak history
      if (dog.streaks) {
        promises.push(saveStreakHistory(supaId, dog.streaks));
      }

      await Promise.allSettled(promises);
    }

    // User settings
    await updateUserSettings({
      lang: localState.lang || "en",
      reminders: localState.reminders || null,
      activeTheme: localState.appSettings?.activeTheme || "default",
      unlockedThemes: localState.appSettings?.unlockedThemes || ["default"],
      activeAccessories: localState.appSettings?.activeAccessories || [],
      unlockedAccessories: localState.appSettings?.unlockedAccessories || [],
    });

    // Unlocked rewards
    const unlockedThemes = localState.appSettings?.unlockedThemes || [];
    const unlockedAccessories = localState.appSettings?.unlockedAccessories || [];
    const rewardPromises = [];
    for (const themeId of unlockedThemes) {
      if (themeId !== "default") rewardPromises.push(saveUnlockedReward(themeId, "theme"));
    }
    for (const accId of unlockedAccessories) {
      rewardPromises.push(saveUnlockedReward(accId, "accessory"));
    }
    if (rewardPromises.length > 0) await Promise.allSettled(rewardPromises);

    return { idMap, error: null };
  } catch (e) {
    return { idMap: {}, error: e.message || String(e) };
  }
}

// ── Save full dog snapshot (used after complex mutations like finalizeComplete) ──
export async function saveDogSnapshot(supaId, dog, appSettings) {
  const promises = [];

  promises.push(updateDogProgress(supaId, {
    total_xp: dog.totalXP || 0,
    total_sessions: dog.totalSessions || 0,
    total_reviews: dog.totalReviews || 0,
    completed_levels: dog.completedLevels || [],
    last_known_stage: dog.lastKnownStage || null,
    difficulty_tracking: dog.difficultyTracking || { exercises: {} },
  }));

  if (dog.streaks) {
    promises.push(saveStreakHistory(supaId, dog.streaks));
  }

  if (dog.challenges) {
    promises.push(updateChallengeProgress(supaId, dog.challenges));
  }

  await Promise.allSettled(promises);
}
