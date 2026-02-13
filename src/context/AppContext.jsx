import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { TRAINING_PROGRAMS } from "../data/programs.js";
import { BADGE_DEFS, checkBadgeCondition } from "../data/badges.js";
import { DAILY_MESSAGES } from "../data/messages.js";
import { GEAR_TIPS } from "../data/gear.js";
import { t, isRTL } from "../i18n/index.js";
import { getTranslatedPrograms, getTranslatedGear, getTranslatedMessages, getTranslatedBadges } from "../i18n/content/index.js";
import { calculateFreshness, getNextInterval, getFreshnessLabel, getFreshnessColor } from "../utils/freshness.js";
import { calculateLifeStage, getNextStageInfo, getAllStages } from "../utils/lifeStage.js";
import { CHALLENGES, getActiveChallenge, getChallengeDay, getWeekNumber, getWeekStartDate } from "../data/challenges.js";
import { DEFAULT_STREAKS, DEFAULT_APP_SETTINGS, STREAK_MILESTONES, THEMES, AVATAR_ACCESSORIES, getNextMilestone, getMilestoneProgress, getStreakFire } from "../data/streakRewards.js";
import { EXERCISE_PREREQUISITES } from "../data/exercisePrerequisites.js";
import { useAuth } from "../hooks/useAuth.js";
import { loadUserData, migrateLocalToSupabase } from "../lib/syncEngine.js";
import {
  createDog as dbCreateDog, updateDog as dbUpdateDog, deleteDog as dbDeleteDog,
  updateDogProgress, saveCompletedExercise, createJournalEntry,
  saveBadge, updateSkillFreshness, updateChallengeProgress,
  saveStreakHistory, updateUserSettings, saveUnlockedReward,
  saveFeedback, deleteAllUserData,
} from "../lib/database.js";

export const DIFFICULTY_CONFIG = {
  incompleteThreshold: 3,
  lowRatingThreshold: 2,
  shortDurationThreshold: 3,
  suggestionCooldownDays: 7,
  minTotalSessions: 5,
};

const STORAGE_KEY = "pawpath_v3";
const FEEDBACK_KEY = "pawpath_feedback";
const FEEDBACK_PROMPT_KEY = "pawpath_lastFeedbackPrompt";

const AppContext = createContext(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

const DEFAULT_DOG_STATE = {
  profile: null,
  completedExercises: [],
  completedLevels: [],
  totalXP: 0,
  currentStreak: 0,
  lastTrainDate: null,
  totalSessions: 0,
  earnedBadges: [],
  journal: [],
  skillFreshness: {},
  totalReviews: 0,
  lastKnownStage: null,
  challenges: { active: null, history: [], stats: { totalCompleted: 0, currentStreak: 0, bestStreak: 0 } },
  streaks: null,
  difficultyTracking: { exercises: {} },
};

export function AppProvider({ children }) {
  // ─── Auth ───
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;
  const supabaseIdMapRef = useRef({});
  const getSupaId = (localId) => supabaseIdMapRef.current[localId];

  // ─── Multi-Dog Persisted State ───
  const [dogs, setDogs] = useState({});
  const [activeDogId, setActiveDogId] = useState(null);
  const [lang, setLang] = useState("en");
  const [reminders, setReminders] = useState({ enabled: false, times: ["09:00", "18:00"], notifPermission: "default" });

  // ─── Feedback State ───
  const [feedback, setFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFeedbackAdmin, setShowFeedbackAdmin] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);

  // ─── Navigation State ───
  const [screen, setScreen] = useState("splash");
  const [selProgram, setSelProgram] = useState(null);
  const [selLevel, setSelLevel] = useState(null);
  const [selExercise, setSelExercise] = useState(null);

  // ─── UI State ───
  const [loaded, setLoaded] = useState(false);
  const [todayExercises, setTodayExercises] = useState(0);
  const [newBadge, setNewBadge] = useState(null);
  const [xpAnim, setXpAnim] = useState(null);
  const [showGear, setShowGear] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [journalForm, setJournalForm] = useState({ note: "", rating: 3, mood: "happy", photos: [] });
  const [pendingComplete, setPendingComplete] = useState(null);
  const [journalTab, setJournalTab] = useState("entries");
  const [stageTransition, setStageTransition] = useState(null);
  const [showAddDog, setShowAddDog] = useState(false);
  const [challengeCelebration, setChallengeCelebration] = useState(null);
  const [challengeDayToast, setChallengeDayToast] = useState(null);
  const [moodCheck, setMoodCheck] = useState(null); // { exId, lvlId, progId } — shown after completion

  // ─── Streak & Theme State ───
  const [appSettings, setAppSettings] = useState({ ...DEFAULT_APP_SETTINGS });
  const [milestoneUnlock, setMilestoneUnlock] = useState(null);
  const [streakFreezeNotif, setStreakFreezeNotif] = useState(null);
  const [streakBrokenModal, setStreakBrokenModal] = useState(null);

  const reminderCheckRef = useRef(null);
  const streakCheckRef = useRef(false);
  const settingsSyncSkipRef = useRef(true); // Skip first sync after load

  // ─── Load from localStorage (helper) ───
  const loadFromLocalStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);

        if (d.dogs) {
          const migratedDogs = {};
          for (const [id, dog] of Object.entries(d.dogs)) {
            migratedDogs[id] = { ...DEFAULT_DOG_STATE, ...dog };
          }
          setDogs(migratedDogs);
          setActiveDogId(d.activeDogId || Object.keys(d.dogs)[0]);
          if (d.lang) setLang(d.lang);
          if (d.reminders) setReminders(d.reminders);
          if (d.appSettings) setAppSettings({ ...DEFAULT_APP_SETTINGS, ...d.appSettings });
          setScreen("home");
          return d;
        } else if (d.dogProfile) {
          let sf = d.skillFreshness || {};
          if (!d.skillFreshness && d.completedExercises && d.completedExercises.length > 0) {
            d.completedExercises.forEach(exId => {
              let lastDate = d.lastTrainDate || new Date().toDateString();
              if (d.journal) {
                const entries = d.journal.filter(j => j.exerciseId === exId);
                if (entries.length > 0) lastDate = entries[entries.length - 1].date;
              }
              sf[exId] = { lastCompleted: new Date(lastDate).toISOString(), interval: 3, completions: 1 };
            });
          }

          const migrated = {
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
            streaks: { ...DEFAULT_STREAKS, current: d.currentStreak || 0, best: d.currentStreak || 0, lastTrainingDate: d.lastTrainDate ? new Date(d.lastTrainDate).toISOString() : null, totalTrainingDays: d.totalSessions || 0 },
          };
          setDogs({ dog_1: migrated });
          setActiveDogId("dog_1");
          if (d.lang) setLang(d.lang);
          if (d.reminders) setReminders(d.reminders);
          setScreen("home");
          return { dogs: { dog_1: migrated }, activeDogId: "dog_1", lang: d.lang, reminders: d.reminders };
        }
      }
    } catch (e) { /* ignore */ }
    return null;
  }, []);

  // ─── Load: branch on auth state (waits for auth to resolve) ───
  useEffect(() => {
    if (authLoading) return; // Wait for auth to resolve before deciding load strategy

    let cancelled = false;
    // Reset refs so new data triggers fresh checks
    streakCheckRef.current = false;
    settingsSyncSkipRef.current = true;

    async function loadFromSupabase() {
      const result = await loadUserData();
      if (cancelled) return;

      if (result.data && Object.keys(result.data.dogs).length > 0) {
        // Supabase has data — use it
        const d = result.data;
        const migratedDogs = {};
        for (const [id, dog] of Object.entries(d.dogs)) {
          migratedDogs[id] = { ...DEFAULT_DOG_STATE, ...dog };
        }
        setDogs(migratedDogs);
        setActiveDogId(d.activeDogId);
        if (d.lang) setLang(d.lang);
        if (d.reminders) setReminders(d.reminders);
        if (d.appSettings) setAppSettings(prev => ({ ...prev, ...d.appSettings }));
        supabaseIdMapRef.current = d.idMap;
        setScreen("home");
      } else {
        // Supabase empty — check localStorage for migration
        const localData = loadFromLocalStorage();
        if (localData && localData.dogs && Object.keys(localData.dogs).length > 0) {
          // Migrate localStorage to Supabase
          const migrateResult = await migrateLocalToSupabase(localData);
          if (!cancelled && migrateResult.idMap) {
            supabaseIdMapRef.current = migrateResult.idMap;
          }
          // State already set by loadFromLocalStorage
        }
        // If no local data either, stay on splash (default)
      }
    }

    if (isAuthenticated) {
      setLoaded(false); // Hide children during Supabase load
      loadFromSupabase().finally(() => {
        if (!cancelled) {
          try {
            const rawFeedback = localStorage.getItem(FEEDBACK_KEY);
            if (rawFeedback) setFeedback(JSON.parse(rawFeedback));
          } catch (e) { /* ignore */ }
          setLoaded(true);
        }
      });
    } else {
      loadFromLocalStorage();
      try {
        const rawFeedback = localStorage.getItem(FEEDBACK_KEY);
        if (rawFeedback) setFeedback(JSON.parse(rawFeedback));
      } catch (e) { /* ignore */ }
      setLoaded(true);
    }

    return () => { cancelled = true; };
  }, [isAuthenticated, authLoading, loadFromLocalStorage]);

  // ─── Save to localStorage ───
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ dogs, activeDogId, lang, reminders, appSettings }));
    } catch (e) { /* ignore */ }
  }, [dogs, activeDogId, lang, reminders, appSettings, loaded]);

  // ─── Sync settings to Supabase (debounced, skips initial load) ───
  useEffect(() => {
    if (!loaded || !isAuthenticated) return;
    if (settingsSyncSkipRef.current) {
      settingsSyncSkipRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      updateUserSettings({
        lang,
        reminders,
        activeTheme: appSettings.activeTheme,
        unlockedThemes: appSettings.unlockedThemes,
        activeAccessories: appSettings.activeAccessories,
        unlockedAccessories: appSettings.unlockedAccessories,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [lang, reminders, appSettings, loaded, isAuthenticated]);

  // ─── Save Feedback ───
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
    } catch (e) { /* ignore */ }
  }, [feedback, loaded]);

  // ─── Batch update helper for active dog ───
  const updateDogFields = useCallback((updates) => {
    setDogs(prev => {
      const dog = prev[activeDogId];
      if (!dog) return prev;
      const newDog = { ...dog };
      for (const [field, updater] of Object.entries(updates)) {
        newDog[field] = typeof updater === "function" ? updater(newDog[field]) : updater;
      }
      return { ...prev, [activeDogId]: newDog };
    });
  }, [activeDogId]);

  // ─── Derive per-dog values from active dog ───
  const activeDog = dogs[activeDogId] || null;
  const dogProfile = activeDog?.profile || null;
  const completedExercises = activeDog?.completedExercises || [];
  const completedLevels = activeDog?.completedLevels || [];
  const totalXP = activeDog?.totalXP || 0;
  const currentStreak = activeDog?.currentStreak || 0;
  const lastTrainDate = activeDog?.lastTrainDate || null;
  const totalSessions = activeDog?.totalSessions || 0;
  const earnedBadges = activeDog?.earnedBadges || [];
  const journal = activeDog?.journal || [];
  const skillFreshness = activeDog?.skillFreshness || {};
  const totalReviews = activeDog?.totalReviews || 0;
  const difficultyTracking = activeDog?.difficultyTracking || { exercises: {} };

  // ─── Multi-Dog Management ───
  const dogCount = Object.keys(dogs).length;

  const addDog = useCallback((profile) => {
    const dogIds = Object.keys(dogs);
    if (dogIds.length >= 2) return null;
    const newId = !dogs.dog_1 ? "dog_1" : "dog_2";
    const newDog = { ...DEFAULT_DOG_STATE, profile };
    setDogs(prev => ({ ...prev, [newId]: newDog }));
    setActiveDogId(newId);
    setShowAddDog(false);
    if (isAuthenticated) {
      dbCreateDog({ name: profile.name, breed: profile.breed || null, birthday: profile.birthday || null, weight: profile.weight || null, avatar: profile.avatar || null })
        .then(res => { if (res.data) supabaseIdMapRef.current[newId] = res.data.id; });
    }
    return newId;
  }, [dogs, isAuthenticated]);

  const removeDog = useCallback((dogId) => {
    const dogIds = Object.keys(dogs);
    if (dogIds.length <= 1) return;
    if (isAuthenticated) {
      const supaId = getSupaId(dogId);
      if (supaId) {
        dbDeleteDog(supaId);
        delete supabaseIdMapRef.current[dogId];
      }
    }
    setDogs(prev => {
      const next = { ...prev };
      delete next[dogId];
      return next;
    });
    if (dogId === activeDogId) {
      const remaining = dogIds.filter(id => id !== dogId);
      setActiveDogId(remaining[0]);
    }
  }, [dogs, activeDogId, isAuthenticated]);

  const switchDog = useCallback((dogId) => {
    if (dogs[dogId]) {
      setActiveDogId(dogId);
      setTodayExercises(0);
    }
  }, [dogs]);

  const setDogProfile = useCallback((profile) => {
    const dogIds = Object.keys(dogs);
    const dbPayload = { name: profile.name, breed: profile.breed || null, birthday: profile.birthday || null, weight: profile.weight || null, avatar: profile.avatar || null };
    if (dogIds.length === 0 || !activeDogId || !dogs[activeDogId]) {
      // First dog — create it
      const newId = dogIds.length === 0 ? "dog_1" : (!dogs.dog_1 ? "dog_1" : "dog_2");
      const newDog = { ...DEFAULT_DOG_STATE, profile };
      setDogs(prev => ({ ...prev, [newId]: newDog }));
      setActiveDogId(newId);
      if (isAuthenticated) {
        dbCreateDog(dbPayload).then(res => { if (res.data) supabaseIdMapRef.current[newId] = res.data.id; });
      }
    } else {
      // Update existing dog's profile
      updateDogFields({ profile });
      if (isAuthenticated) {
        const supaId = getSupaId(activeDogId);
        if (supaId) dbUpdateDog(supaId, dbPayload);
      }
    }
  }, [dogs, activeDogId, updateDogFields, isAuthenticated]);

  // ─── Player Level ───
  const playerLevel = useMemo(() => {
    const lvls = [
      { level: 1, title: "Beginner", min: 0, next: 100 },
      { level: 2, title: "Apprentice", min: 100, next: 300 },
      { level: 3, title: "Handler", min: 300, next: 600 },
      { level: 4, title: "Trainer", min: 600, next: 1000 },
      { level: 5, title: "Expert", min: 1000, next: 1500 },
      { level: 6, title: "Pro", min: 1500, next: 2500 },
      { level: 7, title: "Master", min: 2500, next: null },
    ];
    for (let i = lvls.length - 1; i >= 0; i--) if (totalXP >= lvls[i].min) return lvls[i];
    return lvls[0];
  }, [totalXP]);

  const xpProgress = playerLevel.next ? ((totalXP - playerLevel.min) / (playerLevel.next - playerLevel.min)) * 100 : 100;

  // ─── Translated Content ───
  const programs = useMemo(() => getTranslatedPrograms(TRAINING_PROGRAMS, lang), [lang]);
  const gear = useMemo(() => getTranslatedGear(GEAR_TIPS, lang), [lang]);
  const messages = useMemo(() => getTranslatedMessages(DAILY_MESSAGES, lang), [lang]);
  const badges = useMemo(() => getTranslatedBadges(BADGE_DEFS, lang), [lang]);

  // ─── Skill Health Data ───
  const skillHealthData = useMemo(() => {
    const entries = Object.entries(skillFreshness);
    if (entries.length === 0) return [];
    const result = [];
    for (const [exId, data] of entries) {
      const score = calculateFreshness(data.lastCompleted, data.interval);
      let exercise = null, program = null, level = null;
      for (const p of programs) {
        for (const l of p.levels) {
          const ex = l.exercises.find(e => e.id === exId);
          if (ex) { exercise = ex; program = p; level = l; break; }
        }
        if (exercise) break;
      }
      if (!exercise) continue;
      result.push({ exerciseId: exId, freshness: score, label: getFreshnessLabel(score), color: getFreshnessColor(score), exercise, program, level });
    }
    result.sort((a, b) => a.freshness - b.freshness);
    return result;
  }, [skillFreshness, programs]);

  const allSkillsFresh = useMemo(() => {
    return skillHealthData.length > 0 && skillHealthData.every(s => s.label === "fresh");
  }, [skillHealthData]);

  // ─── Life Stage ───
  const lifeStageData = useMemo(() => {
    if (!dogProfile?.birthday || !dogProfile?.breed) return null;
    const current = calculateLifeStage(dogProfile.birthday, dogProfile.breed);
    if (!current) return null;
    const next = getNextStageInfo(dogProfile.birthday, dogProfile.breed);
    const allStages = getAllStages(dogProfile.breed);
    return { ...current, next, allStages };
  }, [dogProfile]);

  // Detect stage transitions
  const lastKnownStage = activeDog?.lastKnownStage || null;
  useEffect(() => {
    if (!lifeStageData || !activeDogId) return;
    if (lastKnownStage && lastKnownStage !== lifeStageData.stage) {
      setStageTransition(lifeStageData);
    }
    if (lastKnownStage !== lifeStageData.stage) {
      updateDogFields({ lastKnownStage: lifeStageData.stage });
    }
  }, [lifeStageData, lastKnownStage, activeDogId, updateDogFields]);

  // ─── Weekly Challenges ───
  const challengeState = activeDog?.challenges || { active: null, history: [], stats: { totalCompleted: 0, currentStreak: 0, bestStreak: 0 } };

  // Sync challenge: auto-start new week, archive previous
  useEffect(() => {
    if (!activeDogId || !dogs[activeDogId]) return;
    const now = new Date();
    const weekNum = getWeekNumber(now);
    const challenge = getActiveChallenge(now);
    const cs = dogs[activeDogId].challenges || { active: null, history: [], stats: { totalCompleted: 0, currentStreak: 0, bestStreak: 0 } };

    if (cs.active && cs.active.weekNumber !== weekNum) {
      // Week changed — archive old challenge
      const old = cs.active;
      const daysCompleted = old.completedDays.length;
      const fullComplete = daysCompleted === 7;
      const partial = daysCompleted >= 5;
      const chDef = CHALLENGES.find(c => c.id === old.challengeId);
      let xpEarned = 0;
      if (fullComplete) xpEarned = chDef?.bonusXP || 200;
      else if (partial) xpEarned = Math.round((chDef?.bonusXP || 200) * 0.75);
      else xpEarned = daysCompleted * 25;

      const entry = {
        challengeId: old.challengeId,
        weekNumber: old.weekNumber,
        completedDays: old.completedDays,
        completedAt: now.toISOString(),
        badgeEarned: (fullComplete && chDef) ? chDef.badgeId : null,
        xpEarned,
        fullComplete,
      };

      const newHistory = [...cs.history, entry];
      const newTotal = cs.stats.totalCompleted + (partial || fullComplete ? 1 : 0);
      const newCurrentStreak = (partial || fullComplete) ? cs.stats.currentStreak + 1 : 0;
      const newBestStreak = Math.max(cs.stats.bestStreak, newCurrentStreak);

      const newChallenges = {
        active: { challengeId: challenge.id, weekNumber: weekNum, startDate: getWeekStartDate(now), completedDays: [] },
        history: newHistory,
        stats: { totalCompleted: newTotal, currentStreak: newCurrentStreak, bestStreak: newBestStreak },
      };
      updateDogFields({ challenges: newChallenges, totalXP: prev => prev + xpEarned });
      if (isAuthenticated) {
        const supaId = getSupaId(activeDogId);
        if (supaId) {
          updateChallengeProgress(supaId, newChallenges);
          updateDogProgress(supaId, { total_xp: (dogs[activeDogId].totalXP || 0) + xpEarned });
        }
      }
    } else if (!cs.active) {
      // First time — init challenge
      const newChallenges = { ...cs, active: { challengeId: challenge.id, weekNumber: weekNum, startDate: getWeekStartDate(now), completedDays: [] } };
      updateDogFields({ challenges: newChallenges });
      if (isAuthenticated) {
        const supaId = getSupaId(activeDogId);
        if (supaId) updateChallengeProgress(supaId, newChallenges);
      }
    }
  }, [activeDogId, dogs, updateDogFields, isAuthenticated]);

  // ─── Streak Break Detection (runs on app load / dog switch) ───
  useEffect(() => {
    if (!loaded || !activeDogId || !dogs[activeDogId]) return;
    if (streakCheckRef.current === activeDogId) return;
    streakCheckRef.current = activeDogId;

    const dog = dogs[activeDogId];
    const streaks = dog.streaks || { ...DEFAULT_STREAKS };
    if (!streaks.lastTrainingDate || streaks.current === 0) return;

    const last = new Date(streaks.lastTrainingDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
    const daysSince = Math.floor((today - lastDay) / 86400000);

    if (daysSince <= 1) return; // Same day or yesterday — streak is fine

    if (daysSince === 2 && streaks.freezes && streaks.freezes.available > 0) {
      // Missed exactly 1 day, freeze available — auto-use
      const updatedStreaks = {
        ...streaks,
        freezes: {
          ...streaks.freezes,
          available: streaks.freezes.available - 1,
          totalUsed: streaks.freezes.totalUsed + 1,
          lastUsedDate: now.toISOString(),
        },
      };
      updateDogFields({ streaks: updatedStreaks });
      if (isAuthenticated) {
        const supaId = getSupaId(activeDogId);
        if (supaId) saveStreakHistory(supaId, updatedStreaks);
      }
      setStreakFreezeNotif(true);
      setTimeout(() => setStreakFreezeNotif(null), 4000);
    } else {
      // Streak broken
      const bestStreak = Math.max(streaks.best || 0, streaks.current || 0);
      const brokenStreaks = {
        ...streaks,
        current: 0,
        best: bestStreak,
        startDate: null,
        recovery: { active: false, daysCompleted: 0, startDate: null },
        history: [...(streaks.history || []), {
          streak: streaks.current,
          startDate: streaks.startDate,
          endDate: streaks.lastTrainingDate,
          brokenDate: now.toISOString(),
        }],
      };
      updateDogFields({ streaks: brokenStreaks, currentStreak: 0 });
      if (isAuthenticated) {
        const supaId = getSupaId(activeDogId);
        if (supaId) saveStreakHistory(supaId, brokenStreaks);
      }
      setStreakBrokenModal({ previous: streaks.current, best: bestStreak });
    }
  }, [loaded, activeDogId, isAuthenticated]);

  // Compute active challenge data for UI
  const challengeData = useMemo(() => {
    const now = new Date();
    const challenge = getActiveChallenge(now);
    const todayDay = getChallengeDay(now);
    const active = challengeState.active;
    const completedDays = active?.completedDays || [];
    const todayCompleted = completedDays.includes(todayDay);
    const todayTask = challenge.days.find(d => d.day === todayDay);
    const daysRemaining = 7 - todayDay;
    const nextWeekChallenge = CHALLENGES[(getWeekNumber(now) + 1) % CHALLENGES.length];

    return {
      challenge,
      todayDay,
      todayTask,
      completedDays,
      todayCompleted,
      daysRemaining,
      progress: completedDays.length,
      nextWeekChallenge,
    };
  }, [challengeState]);

  // Complete a challenge day
  const completeChallengeDay = useCallback((dayNum) => {
    if (!activeDogId || !dogs[activeDogId]) return;
    const cs = dogs[activeDogId].challenges;
    if (!cs?.active) return;
    if (cs.active.completedDays.includes(dayNum)) return;

    const newDays = [...cs.active.completedDays, dayNum];
    const newChallenges = { ...cs, active: { ...cs.active, completedDays: newDays } };
    updateDogFields({ challenges: newChallenges });
    if (isAuthenticated) {
      const supaId = getSupaId(activeDogId);
      if (supaId) updateChallengeProgress(supaId, newChallenges);
    }

    // Toast
    const remaining = 7 - newDays.length;
    setChallengeDayToast({ day: dayNum, remaining });
    setTimeout(() => setChallengeDayToast(null), 3000);

    // Check if all 7 days completed → celebration
    if (newDays.length === 7) {
      const chDef = CHALLENGES.find(c => c.id === cs.active.challengeId);
      setTimeout(() => {
        setChallengeCelebration({
          challenge: chDef,
          xp: chDef?.bonusXP || 200,
          badgeId: chDef?.badgeId,
        });
      }, 500);
    }
  }, [activeDogId, dogs, updateDogFields, isAuthenticated]);

  // ─── Streak Computed Data ───
  const streakData = useMemo(() => {
    const streaks = activeDog?.streaks || { ...DEFAULT_STREAKS };
    const current = streaks.current || 0;
    const best = streaks.best || 0;
    const fire = getStreakFire(current);
    const nextMilestone = getNextMilestone(current);
    const progress = getMilestoneProgress(current);
    const freezesAvailable = streaks.freezes?.available || 0;
    const totalTrainingDays = streaks.totalTrainingDays || 0;
    const freezesUsed = streaks.freezes?.totalUsed || 0;
    const unlockedMilestones = streaks.milestones?.unlocked || [];
    const recovery = streaks.recovery || { active: false, daysCompleted: 0, startDate: null };

    return { current, best, fire, nextMilestone, progress, freezesAvailable, totalTrainingDays, freezesUsed, unlockedMilestones, recovery };
  }, [activeDog]);

  // ─── Active Theme ───
  const activeTheme = useMemo(() => {
    return THEMES[appSettings.activeTheme] || THEMES.default;
  }, [appSettings.activeTheme]);

  // ─── Theme / Accessory Functions ───
  const setActiveTheme = useCallback((themeId) => {
    if (!appSettings.unlockedThemes.includes(themeId)) return;
    setAppSettings(prev => ({ ...prev, activeTheme: themeId }));
  }, [appSettings.unlockedThemes]);

  const toggleAccessory = useCallback((accId) => {
    if (!appSettings.unlockedAccessories.includes(accId)) return;
    setAppSettings(prev => ({
      ...prev,
      activeAccessories: prev.activeAccessories.includes(accId)
        ? prev.activeAccessories.filter(id => id !== accId)
        : [...prev.activeAccessories, accId],
    }));
  }, [appSettings.unlockedAccessories]);

  // ─── Start Recovery Challenge ───
  const startRecovery = useCallback(() => {
    if (!activeDogId || !dogs[activeDogId]) return;
    const streaks = dogs[activeDogId].streaks || { ...DEFAULT_STREAKS };
    const updatedStreaks = { ...streaks, recovery: { active: true, daysCompleted: 0, startDate: new Date().toISOString() } };
    updateDogFields({ streaks: updatedStreaks });
    if (isAuthenticated) {
      const supaId = getSupaId(activeDogId);
      if (supaId) saveStreakHistory(supaId, updatedStreaks);
    }
    setStreakBrokenModal(null);
  }, [activeDogId, dogs, updateDogFields, isAuthenticated]);

  // ─── Difficulty Tracking ───
  const isExerciseStruggling = useCallback((exId) => {
    if (totalSessions < DIFFICULTY_CONFIG.minTotalSessions) return false;
    const data = difficultyTracking.exercises?.[exId];
    if (!data) return false;
    if (data.dismissed && data.lastSuggestionDate) {
      const daysSince = Math.floor((Date.now() - new Date(data.lastSuggestionDate).getTime()) / 86400000);
      if (daysSince < DIFFICULTY_CONFIG.suggestionCooldownDays) return false;
    }
    return (
      (data.incompleteCount || 0) >= DIFFICULTY_CONFIG.incompleteThreshold ||
      (data.lowRatingCount || 0) >= DIFFICULTY_CONFIG.lowRatingThreshold ||
      (data.shortSessionCount || 0) >= DIFFICULTY_CONFIG.shortDurationThreshold
    );
  }, [totalSessions, difficultyTracking]);

  const updateDifficultyTracking = useCallback((exId, field, value) => {
    updateDogFields({
      difficultyTracking: prev => {
        const exercises = { ...(prev?.exercises || {}) };
        exercises[exId] = { ...(exercises[exId] || { incompleteCount: 0, lowRatingCount: 0, shortSessionCount: 0, lastSuggestionDate: null, dismissed: false, totalAttempts: 0 }), [field]: value };
        return { exercises };
      },
    });
  }, [updateDogFields]);

  const incrementDifficultyField = useCallback((exId, field) => {
    updateDogFields({
      difficultyTracking: prev => {
        const exercises = { ...(prev?.exercises || {}) };
        const current = exercises[exId] || { incompleteCount: 0, lowRatingCount: 0, shortSessionCount: 0, lastSuggestionDate: null, dismissed: false, totalAttempts: 0 };
        exercises[exId] = { ...current, [field]: (current[field] || 0) + 1 };
        return { exercises };
      },
    });
  }, [updateDogFields]);

  const dismissDifficultySuggestion = useCallback((exId) => {
    updateDogFields({
      difficultyTracking: prev => {
        const exercises = { ...(prev?.exercises || {}) };
        const current = exercises[exId] || {};
        exercises[exId] = { ...current, dismissed: true, lastSuggestionDate: new Date().toISOString() };
        return { exercises };
      },
    });
  }, [updateDogFields]);

  const recordMoodCheck = useCallback((exId, mood) => {
    // mood: "nailed" | "getting" | "tricky"
    if (mood === "tricky") {
      incrementDifficultyField(exId, "lowRatingCount");
    }
    // Auto-clear: track consecutive successes
    if (mood === "nailed") {
      updateDogFields({
        difficultyTracking: prev => {
          const exercises = { ...(prev?.exercises || {}) };
          const current = exercises[exId] || {};
          const streak = (current.successStreak || 0) + 1;
          if (streak >= 3) {
            // Reset struggle counters
            exercises[exId] = { ...current, incompleteCount: 0, lowRatingCount: 0, shortSessionCount: 0, dismissed: false, successStreak: 0 };
          } else {
            exercises[exId] = { ...current, successStreak: streak };
          }
          return { exercises };
        },
      });
    } else {
      updateDogFields({
        difficultyTracking: prev => {
          const exercises = { ...(prev?.exercises || {}) };
          const current = exercises[exId] || {};
          exercises[exId] = { ...current, successStreak: 0 };
          return { exercises };
        },
      });
    }
    setMoodCheck(null);
  }, [incrementDifficultyField, updateDogFields]);

  // ─── Sync difficulty tracking to Supabase (debounced) ───
  useEffect(() => {
    if (!loaded || !isAuthenticated || !activeDogId) return;
    const supaId = getSupaId(activeDogId);
    if (!supaId) return;
    const timer = setTimeout(() => {
      updateDogProgress(supaId, { difficulty_tracking: difficultyTracking });
    }, 2000);
    return () => clearTimeout(timer);
  }, [difficultyTracking, loaded, isAuthenticated, activeDogId]);

  // ─── Daily Plan ───
  const dailyPlan = useMemo(() => {
    const plan = [];
    const currentStage = lifeStageData?.stage;
    const matchesStage = (ex) => !currentStage || !ex.lifeStages || ex.lifeStages.includes(currentStage);

    const stale = skillHealthData.filter(s => s.label === "stale" && matchesStage(s.exercise));
    for (const s of stale) {
      if (plan.length >= 2) break;
      plan.push({ exercise: s.exercise, level: s.level, program: s.program, reason: "needsReview", freshness: s.freshness });
    }

    if (plan.length < 3) {
      for (const prog of programs) {
        if (playerLevel.level < prog.unlockLevel) continue;
        for (const level of prog.levels) {
          const prevIdx = prog.levels.indexOf(level);
          if (prevIdx > 0 && !prog.levels[prevIdx - 1].exercises.every(e => completedExercises.includes(e.id))) continue;
          for (const ex of level.exercises) {
            if (!completedExercises.includes(ex.id) && matchesStage(ex) && plan.length < 3) {
              plan.push({ exercise: ex, level, program: prog, reason: "continueProgress" });
            }
          }
          if (plan.length >= 3) break;
        }
        if (plan.length >= 3) break;
      }
    }

    if (plan.length < 3) {
      const fading = skillHealthData.filter(s => s.label === "fading" && matchesStage(s.exercise) && !plan.some(p => p.exercise.id === s.exerciseId));
      for (const s of fading) {
        if (plan.length >= 3) break;
        plan.push({ exercise: s.exercise, level: s.level, program: s.program, reason: "reviewReinforce", freshness: s.freshness });
      }
    }

    if (plan.length === 0) {
      const doneExercises = [];
      programs.forEach(p => p.levels.forEach(l => l.exercises.forEach(e => {
        if (completedExercises.includes(e.id)) doneExercises.push({ exercise: e, level: l, program: p, reason: "reviewReinforce" });
      })));
      const shuffled = doneExercises.sort(() => 0.5 - Math.random());
      plan.push(...shuffled.slice(0, 3));
    }
    return plan;
  }, [completedExercises, playerLevel.level, programs, skillHealthData, lifeStageData]);

  // ─── Daily Message ───
  const dailyMsg = useMemo(() => {
    const idx = new Date().getDate() % messages.length;
    return messages[idx];
  }, [messages]);

  // ─── Badge Checking ───
  useEffect(() => {
    if (!activeDogId || !dogs[activeDogId]) return;
    const dog = dogs[activeDogId];
    const today = new Date().toDateString();
    const photoCount = dog.journal.reduce((c, e) => c + (e.photos ? e.photos.length : 0), 0);
    const bothDogsTrainedToday = dogCount >= 2 && Object.values(dogs).every(d => d.lastTrainDate === today);
    const streaksObj = dog.streaks || {};
    const state = {
      totalSessions: dog.totalSessions,
      currentStreak: dog.currentStreak,
      completedExercises: dog.completedExercises,
      completedLevels: dog.completedLevels,
      totalXP: dog.totalXP,
      todayExercises,
      journal: dog.journal,
      totalReviews: dog.totalReviews,
      allSkillsFresh,
      programs: TRAINING_PROGRAMS,
      playerLevel: playerLevel.level,
      dogCount,
      bothDogsTrainedToday,
      photoCount,
      challengeHistory: dog.challenges?.history || [],
      challengeStats: dog.challenges?.stats || { totalCompleted: 0, currentStreak: 0, bestStreak: 0 },
      streakBest: streaksObj.best || dog.currentStreak || 0,
      streakRecovered: streaksObj.recoveredOnce === true,
      streakFreezesUsed: streaksObj.freezes?.totalUsed || 0,
    };
    badges.forEach(b => {
      if (!dog.earnedBadges.includes(b.id) && checkBadgeCondition(b.id, state)) {
        setDogs(prev => {
          const d = prev[activeDogId];
          if (!d || d.earnedBadges.includes(b.id)) return prev;
          return { ...prev, [activeDogId]: { ...d, earnedBadges: [...d.earnedBadges, b.id] } };
        });
        if (isAuthenticated) {
          const supaId = getSupaId(activeDogId);
          if (supaId) saveBadge(supaId, b.id);
        }
        setNewBadge(b);
        setTimeout(() => setNewBadge(null), 3500);
      }
    });
  }, [dogs, activeDogId, todayExercises, badges, allSkillsFresh, isAuthenticated]);

  // ─── Reminder Check ───
  useEffect(() => {
    if (!reminders.enabled) return;
    const check = () => {
      const now = new Date();
      const hm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      if (reminders.times.includes(hm) && now.getSeconds() < 2) {
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          try { new Notification("\uD83D\uDC3E PawPath", { body: `Time to train${dogProfile ? ` with ${dogProfile.name}` : ""}! Your streak is ${currentStreak} days.` }); } catch (e) { /* ignore */ }
        }
      }
    };
    reminderCheckRef.current = setInterval(check, 1000);
    return () => clearInterval(reminderCheckRef.current);
  }, [reminders, dogProfile, currentStreak]);

  // ─── Navigation ───
  const nav = useCallback((s, o = {}) => {
    if (o.program !== undefined) setSelProgram(o.program);
    if (o.level !== undefined) setSelLevel(o.level);
    if (o.exercise !== undefined) setSelExercise(o.exercise);
    setScreen(s);
  }, []);

  // ─── Exercise Completion ───
  const triggerComplete = useCallback((exId, lvlId, progId) => {
    const isReview = completedExercises.includes(exId);
    setPendingComplete({ exId, lvlId, progId, isReview });
    setJournalForm({ note: "", rating: 3, mood: "happy", photos: [] });
    setShowJournalEntry(true);
  }, [completedExercises]);

  const finalizeComplete = useCallback((skipJournal) => {
    if (!pendingComplete || !dogs[activeDogId]) return;
    const { exId, lvlId, progId, isReview } = pendingComplete;
    const currentDog = dogs[activeDogId];

    const updates = {};

    if (!isReview) {
      updates.completedExercises = prev => [...prev, exId];
    } else {
      updates.totalReviews = prev => prev + 1;
    }

    updates.totalSessions = prev => prev + 1;
    setTodayExercises(prev => prev + 1);

    const today = new Date().toDateString();
    const streaks = currentDog.streaks || { ...DEFAULT_STREAKS };
    let milestoneXp = 0;
    let isNewDay = false;

    if (currentDog.lastTrainDate !== today) {
      isNewDay = true;
      const y = new Date(); y.setDate(y.getDate() - 1);
      const isConsecutive = currentDog.lastTrainDate === y.toDateString();
      const newCurrent = isConsecutive ? (streaks.current || currentDog.currentStreak || 0) + 1 : 1;
      const newBest = Math.max(streaks.best || 0, newCurrent);
      updates.currentStreak = newCurrent;
      updates.lastTrainDate = today;

      const updatedStreaks = {
        ...streaks,
        current: newCurrent,
        best: newBest,
        lastTrainingDate: new Date().toISOString(),
        totalTrainingDays: (streaks.totalTrainingDays || 0) + 1,
        startDate: isConsecutive ? (streaks.startDate || new Date().toISOString()) : new Date().toISOString(),
        freezes: { ...(streaks.freezes || DEFAULT_STREAKS.freezes) },
        milestones: { ...(streaks.milestones || DEFAULT_STREAKS.milestones) },
        recovery: { ...(streaks.recovery || DEFAULT_STREAKS.recovery) },
        history: streaks.history || [],
      };

      // Recovery tracking
      if (updatedStreaks.recovery.active) {
        const newRecoveryDays = updatedStreaks.recovery.daysCompleted + 1;
        if (newRecoveryDays >= 3) {
          updatedStreaks.recovery = { active: false, daysCompleted: 0, startDate: null };
          updatedStreaks.recoveredOnce = true;
        } else {
          updatedStreaks.recovery = { ...updatedStreaks.recovery, daysCompleted: newRecoveryDays };
        }
      }

      // Check milestones
      const unlockedIds = updatedStreaks.milestones.unlocked || [];
      const milestone = STREAK_MILESTONES.find(m => newCurrent >= m.days && !unlockedIds.includes(m.rewardId));
      if (milestone) {
        updatedStreaks.milestones = {
          unlocked: [...unlockedIds, milestone.rewardId],
          claimedRewards: [...(updatedStreaks.milestones.claimedRewards || []), milestone.rewardId],
        };
        milestoneXp = milestone.xpBonus || 0;

        // Award freeze at 14, 30, 60 days
        if (milestone.freezeReward && updatedStreaks.freezes.available < (updatedStreaks.freezes.maxFreezes || 3)) {
          updatedStreaks.freezes = {
            ...updatedStreaks.freezes,
            available: Math.min(updatedStreaks.freezes.available + 1, updatedStreaks.freezes.maxFreezes || 3),
            totalEarned: (updatedStreaks.freezes.totalEarned || 0) + 1,
          };
        }

        // Unlock theme/accessory rewards
        if (milestone.reward === "theme") {
          const themeId = milestone.rewardId.replace("theme-", "");
          setAppSettings(prev => ({
            ...prev,
            unlockedThemes: prev.unlockedThemes.includes(themeId) ? prev.unlockedThemes : [...prev.unlockedThemes, themeId],
          }));
        } else if (milestone.reward === "avatar") {
          setAppSettings(prev => ({
            ...prev,
            unlockedAccessories: prev.unlockedAccessories.includes(milestone.rewardId) ? prev.unlockedAccessories : [...prev.unlockedAccessories, milestone.rewardId],
          }));
        }

        // Trigger celebration
        setTimeout(() => setMilestoneUnlock(milestone), 500);
      }

      updates.streaks = updatedStreaks;
    } else {
      // Same day — still update streaks.lastTrainingDate
      updates.streaks = { ...streaks, lastTrainingDate: new Date().toISOString() };
    }

    const baseProg = TRAINING_PROGRAMS.find(p => p.id === progId);
    const baseLvl = baseProg.levels.find(l => l.id === lvlId);
    const baseXp = Math.round(baseLvl.xpReward / baseLvl.exercises.length);
    const xp = isReview ? Math.round(baseXp * 0.3) : baseXp;
    const totalXpGain = xp + milestoneXp;
    updates.totalXP = prev => prev + totalXpGain;
    setXpAnim(totalXpGain);
    setTimeout(() => setXpAnim(null), 2000);

    if (!isReview && baseLvl.exercises.every(e => e.id === exId || currentDog.completedExercises.includes(e.id))) {
      if (!currentDog.completedLevels.includes(lvlId)) {
        updates.completedLevels = prev => [...prev, lvlId];
      }
    }

    // Update skill freshness
    const prevData = currentDog.skillFreshness[exId] || { interval: 3, completions: 0 };
    const newInterval = getNextInterval(prevData.interval, journalForm.rating);
    updates.skillFreshness = prev => ({
      ...prev,
      [exId]: { lastCompleted: new Date().toISOString(), interval: newInterval, completions: (prevData.completions || 0) + 1 },
    });

    // Journal entry
    const hasContent = journalForm.note.trim() || (journalForm.photos && journalForm.photos.length > 0);
    if (!skipJournal && hasContent) {
      const tProg = programs.find(p => p.id === progId);
      const tLvl = tProg.levels.find(l => l.id === lvlId);
      const ex = tLvl.exercises.find(e => e.id === exId);
      updates.journal = prev => [...prev, {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        exerciseId: exId,
        exerciseName: ex?.name || "Unknown",
        programName: tProg.name,
        programEmoji: tProg.emoji,
        note: journalForm.note,
        rating: journalForm.rating,
        mood: journalForm.mood,
        ...(journalForm.photos.length > 0 && { photos: journalForm.photos }),
      }];
    }

    // Apply all dog updates in one batch
    updateDogFields(updates);

    // ─── Supabase sync for finalizeComplete ───
    if (isAuthenticated) {
      const supaId = getSupaId(activeDogId);
      if (supaId) {
        const supaPromises = [];
        // Save completed exercise
        supaPromises.push(saveCompletedExercise(supaId, exId, lvlId, progId, xp, isReview));
        // Update dog progress (pre-compute final values)
        const newTotalXP = (currentDog.totalXP || 0) + totalXpGain;
        const newTotalSessions = (currentDog.totalSessions || 0) + 1;
        const newTotalReviews = isReview ? (currentDog.totalReviews || 0) + 1 : (currentDog.totalReviews || 0);
        const newCompletedLevels = updates.completedLevels
          ? [...(currentDog.completedLevels || []), lvlId]
          : (currentDog.completedLevels || []);
        supaPromises.push(updateDogProgress(supaId, {
          total_xp: newTotalXP,
          total_sessions: newTotalSessions,
          total_reviews: newTotalReviews,
          completed_levels: newCompletedLevels,
          difficulty_tracking: currentDog.difficultyTracking || { exercises: {} },
        }));
        // Skill freshness
        const newFreshnessData = { lastCompleted: new Date().toISOString(), interval: newInterval, completions: (prevData.completions || 0) + 1 };
        supaPromises.push(updateSkillFreshness(supaId, exId, newFreshnessData));
        // Streak history
        if (updates.streaks) {
          supaPromises.push(saveStreakHistory(supaId, updates.streaks));
        }
        // Journal entry
        if (!skipJournal && hasContent) {
          const tProg2 = programs.find(p => p.id === progId);
          const tLvl2 = tProg2.levels.find(l => l.id === lvlId);
          const ex2 = tLvl2.exercises.find(e => e.id === exId);
          supaPromises.push(createJournalEntry(supaId, {
            exercise_id: exId,
            exercise_name: ex2?.name || "Unknown",
            program_name: tProg2.name,
            program_emoji: tProg2.emoji,
            note: journalForm.note,
            rating: journalForm.rating,
            mood: journalForm.mood,
            photos: journalForm.photos || [],
          }));
        }
        // Milestone reward unlock
        if (milestoneXp > 0) {
          const ms = STREAK_MILESTONES.find(m => milestoneXp === (m.xpBonus || 0));
          if (ms) supaPromises.push(saveUnlockedReward(ms.rewardId, ms.reward || "milestone"));
        }
        Promise.allSettled(supaPromises);
      }
    }

    // Auto-complete challenge day if exercise matches
    const now = new Date();
    const todayDay = getChallengeDay(now);
    const activeChallenge = getActiveChallenge(now);
    const todayTask = activeChallenge.days.find(d => d.day === todayDay);
    if (todayTask && todayTask.exerciseId === exId) {
      completeChallengeDay(todayDay);
    }

    // Feedback prompt (every 5th new exercise, max once per week)
    if (!isReview) {
      const newTotal = currentDog.completedExercises.length + 1;
      if (newTotal % 5 === 0) {
        try {
          const lastPrompt = localStorage.getItem(FEEDBACK_PROMPT_KEY);
          const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          if (!lastPrompt || Number(lastPrompt) < oneWeekAgo) {
            localStorage.setItem(FEEDBACK_PROMPT_KEY, Date.now().toString());
            setTimeout(() => setShowFeedbackPrompt(true), 2500);
          }
        } catch (e) { /* ignore */ }
      }
    }

    // Show mood check after completion (only if user has 5+ sessions)
    if (currentDog.totalSessions >= DIFFICULTY_CONFIG.minTotalSessions - 1) {
      setMoodCheck({ exId, lvlId: lvlId, progId });
    }

    setPendingComplete(null);
    setShowJournalEntry(false);
  }, [pendingComplete, dogs, activeDogId, journalForm, programs, updateDogFields, completeChallengeDay, isAuthenticated]);

  // ─── Notification Permission ───
  const requestNotifPermission = useCallback(async () => {
    if (typeof Notification !== "undefined") {
      const perm = await Notification.requestPermission();
      setReminders(r => ({ ...r, notifPermission: perm }));
    }
  }, []);

  // ─── Submit Feedback ───
  const submitFeedback = useCallback((entry) => {
    setFeedback(prev => [...prev, entry]);
    if (isAuthenticated) saveFeedback(entry);
  }, [isAuthenticated]);

  // ─── Reset ───
  const resetAllData = useCallback(() => {
    if (isAuthenticated) {
      deleteAllUserData();
      supabaseIdMapRef.current = {};
    }
    setDogs({});
    setActiveDogId(null);
    setScreen("splash");
  }, [isAuthenticated]);

  // ─── Translation helper ───
  const T = useCallback((key) => t(lang, key), [lang]);
  const rtl = isRTL(lang);

  const value = {
    // Per-dog state (derived from active dog)
    dogProfile, setDogProfile,
    completedExercises, completedLevels,
    totalXP, currentStreak, lastTrainDate,
    totalSessions, earnedBadges, journal,
    skillFreshness, totalReviews,

    // Shared state
    reminders, setReminders,
    lang, setLang,

    // Multi-dog
    dogs, activeDogId, dogCount,
    addDog, removeDog, switchDog,
    showAddDog, setShowAddDog,

    // Navigation
    screen, setScreen, nav,
    selProgram, setSelProgram,
    selLevel, setSelLevel,
    selExercise, setSelExercise,

    // UI
    loaded, todayExercises,
    newBadge, xpAnim,
    showGear, setShowGear,
    showReminders, setShowReminders,
    showJournalEntry, setShowJournalEntry,
    journalForm, setJournalForm,
    pendingComplete,
    journalTab, setJournalTab,

    // Translated content
    programs, gear, messages, badges,

    // Computed
    playerLevel, xpProgress,
    dailyPlan, dailyMsg,
    skillHealthData, allSkillsFresh,
    lifeStageData, stageTransition, setStageTransition,
    challengeData, challengeState, completeChallengeDay,
    challengeCelebration, setChallengeCelebration,
    challengeDayToast,

    // Streak & Theme
    streakData, activeTheme, appSettings,
    setActiveTheme, toggleAccessory, startRecovery,
    milestoneUnlock, setMilestoneUnlock,
    streakFreezeNotif, setStreakFreezeNotif,
    streakBrokenModal, setStreakBrokenModal,
    THEMES, AVATAR_ACCESSORIES, STREAK_MILESTONES,

    // Actions
    triggerComplete, finalizeComplete,
    requestNotifPermission, resetAllData,

    // Feedback
    feedback, showFeedback, setShowFeedback,
    showFeedbackAdmin, setShowFeedbackAdmin,
    showFeedbackPrompt, setShowFeedbackPrompt,
    submitFeedback,

    // Difficulty tracking
    difficultyTracking, isExerciseStruggling, updateDifficultyTracking,
    incrementDifficultyField, dismissDifficultySuggestion,
    recordMoodCheck, moodCheck, setMoodCheck,
    EXERCISE_PREREQUISITES,

    // Auth
    isAuthenticated,

    // i18n
    T, rtl,
  };

  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0A0A0C" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#22C55E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
