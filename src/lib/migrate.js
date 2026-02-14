import { supabase } from "./supabase.js";
import {
  createDog, updateDogProgress,
  saveCompletedExercise, createJournalEntry,
  saveBadge, updateSkillFreshness,
  updateChallengeProgress, saveStreakHistory,
  updateUserSettings, saveUnlockedReward,
} from "./database.js";
import { uploadPhoto } from "./storage.js";

const STORAGE_KEY = "pawpath_v3";
const FEEDBACK_KEY = "pawpath_feedback";
const FEEDBACK_PROMPT_KEY = "pawpath_lastFeedbackPrompt";

const DEFAULT_STREAKS = {
  current: 0, best: 0, lastTrainingDate: null, totalTrainingDays: 0,
  startDate: null,
  freezes: { available: 0, maxFreezes: 3, totalUsed: 0, totalEarned: 0, lastUsedDate: null },
  milestones: { unlocked: [], claimedRewards: [] },
  recovery: { active: false, daysCompleted: 0, startDate: null },
  history: [], recoveredOnce: false,
};

// ── Check if localStorage has training data worth migrating ──
export function hasLocalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const d = JSON.parse(raw);
    // v6 nested format
    if (d.dogs && Object.keys(d.dogs).length > 0) {
      return Object.values(d.dogs).some(dog => dog.profile);
    }
    // v5 flat format
    if (d.dogProfile) return true;
    return false;
  } catch {
    return false;
  }
}

// ── Read and normalize localStorage data into v6 format ──
function readLocalData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const d = JSON.parse(raw);

  // v6 nested format — already has `dogs` object
  if (d.dogs && Object.keys(d.dogs).length > 0) {
    return {
      dogs: d.dogs,
      activeDogId: d.activeDogId || Object.keys(d.dogs)[0],
      lang: d.lang || "en",
      reminders: d.reminders || null,
      appSettings: d.appSettings || null,
    };
  }

  // v5 flat format — single dog at top level
  if (d.dogProfile) {
    let sf = d.skillFreshness || {};
    if (!d.skillFreshness && d.completedExercises?.length > 0) {
      d.completedExercises.forEach(exId => {
        let lastDate = d.lastTrainDate || new Date().toDateString();
        if (d.journal) {
          const entries = d.journal.filter(j => j.exerciseId === exId);
          if (entries.length > 0) lastDate = entries[entries.length - 1].date;
        }
        sf[exId] = { lastCompleted: new Date(lastDate).toISOString(), interval: 3, completions: 1 };
      });
    }

    const dog = {
      profile: d.dogProfile,
      completedExercises: d.completedExercises || [],
      completedLevels: d.completedLevels || [],
      totalXP: d.totalXP || 0,
      currentStreak: d.currentStreak || 0,
      lastTrainDate: d.lastTrainDate || null,
      totalSessions: d.totalSessions || 0,
      earnedBadges: d.earnedBadges || [],
      journal: d.journal || [],
      skillFreshness: sf,
      totalReviews: d.totalReviews || 0,
      lastKnownStage: d.lastKnownStage || null,
      challenges: d.challenges || null,
      streaks: d.streaks || {
        ...DEFAULT_STREAKS,
        current: d.currentStreak || 0,
        best: d.currentStreak || 0,
        lastTrainingDate: d.lastTrainDate ? new Date(d.lastTrainDate).toISOString() : null,
        totalTrainingDays: d.totalSessions || 0,
      },
      difficultyTracking: d.difficultyTracking || { exercises: {} },
    };

    return {
      dogs: { dog_1: dog },
      activeDogId: "dog_1",
      lang: d.lang || "en",
      reminders: d.reminders || null,
      appSettings: d.appSettings || null,
    };
  }

  return null;
}

// ── Convert a base64 data URL to a Blob ──
function base64ToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

// ── Upload base64 journal photos to Supabase Storage ──
// Returns a new array with storage paths replacing base64 strings.
async function migratePhotos(userId, dogId, photos) {
  if (!photos || photos.length === 0) return [];
  const migrated = [];
  for (const photo of photos) {
    if (typeof photo === "string" && photo.startsWith("data:")) {
      try {
        const blob = base64ToBlob(photo);
        const path = await uploadPhoto(userId, dogId, blob);
        migrated.push(path);
      } catch {
        // Skip failed photo rather than failing entire migration
        console.warn("migrate: failed to upload photo, skipping");
      }
    } else {
      // Already a URL or storage path — keep as-is
      migrated.push(photo);
    }
  }
  return migrated;
}

// ── Main migration function ─────────────────────────────────
// Reads localStorage, normalizes v5/v6, uploads everything to
// Supabase (including photos → Storage), clears localStorage on
// success, keeps it intact on failure.
//
// Returns { idMap, localState, error }
//   idMap      – { dog_1: supabaseUUID, ... }
//   localState – normalized data (photos updated to storage paths)
//   error      – null on success, string on failure
export async function migrateLocalData() {
  const localState = readLocalData();
  if (!localState) return { idMap: {}, localState: null, error: "No local data found" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { idMap: {}, localState, error: "Not authenticated" };
  const userId = user.id;

  try {
    const idMap = {};
    const dogEntries = Object.entries(localState.dogs);

    for (const [localId, dog] of dogEntries) {
      if (!dog.profile) continue;

      const createRes = await createDog({
        name: dog.profile.name,
        breed: dog.profile.breed || null,
        birthday: dog.profile.birthday || null,
        weight: dog.profile.weight || null,
        avatar: dog.profile.avatar || null,
      });
      if (createRes.error || !createRes.data) {
        console.warn("migrate: failed to create dog", localId, createRes.error);
        continue;
      }

      const supaId = createRes.data.id;
      idMap[localId] = supaId;

      // Upload photos first (sequential to avoid overwhelming storage API),
      // then batch the rest in parallel.
      for (const entry of (dog.journal || [])) {
        if (entry.photos && entry.photos.length > 0) {
          entry.photos = await migratePhotos(userId, supaId, entry.photos);
        }
      }

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

      // Journal entries (photos already migrated above)
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
    const rewardPromises = [];
    for (const themeId of (localState.appSettings?.unlockedThemes || [])) {
      if (themeId !== "default") rewardPromises.push(saveUnlockedReward(themeId, "theme"));
    }
    for (const accId of (localState.appSettings?.unlockedAccessories || [])) {
      rewardPromises.push(saveUnlockedReward(accId, "accessory"));
    }
    if (rewardPromises.length > 0) await Promise.allSettled(rewardPromises);

    // Success — clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FEEDBACK_KEY);
    localStorage.removeItem(FEEDBACK_PROMPT_KEY);

    return { idMap, localState, error: null };
  } catch (e) {
    // Failure — keep localStorage intact
    return { idMap: {}, localState, error: e.message || String(e) };
  }
}
