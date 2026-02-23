import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { TRAINING_PROGRAMS } from "../data/programs.js";
import { BADGE_DEFS } from "../data/badges.js";
import { DAILY_MESSAGES } from "../data/messages.js";
import { GEAR_TIPS } from "../data/gear.js";
import { t, isRTL } from "../i18n/index.js";
import { getTranslatedPrograms, getTranslatedGear, getTranslatedMessages, getTranslatedBadges } from "../i18n/content/index.js";
import { calculateLifeStage, getNextStageInfo, getAllStages } from "../utils/lifeStage.js";
import { CHALLENGES, getActiveChallenge, getChallengeDay, getWeekNumber } from "../data/challenges.js";
import { DEFAULT_STREAKS, DEFAULT_APP_SETTINGS, STREAK_MILESTONES, THEMES, AVATAR_ACCESSORIES, getNextMilestone, getMilestoneProgress, getStreakFire } from "../data/streakRewards.js";
import { EXERCISE_PREREQUISITES } from "../data/exercisePrerequisites.js";
import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";
import { useSkillHealth } from "../hooks/useSkillHealth.js";
import { useChallengeSync } from "../hooks/useChallengeSync.js";
import { useStreakBreakDetection } from "../hooks/useStreakBreakDetection.js";
import { useChallengeData } from "../hooks/useChallengeData.js";
import { useDifficultyTracking } from "../hooks/useDifficultyTracking.js";
import { useDailyPlan } from "../hooks/useDailyPlan.js";
import { useReminderCheck } from "../hooks/useReminderCheck.js";

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

const AppContext = createContext<any>(null);

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
  const { user, loading: authLoading, signOut } = useAuth();
  const isAuthenticated = !!user;
  const idMapRef = useRef({});
  const addingDogRef = useRef(false);
  const getDogBackendId = (localId) => idMapRef.current[localId];

  // ─── Multi-Dog Persisted State ───
  const [dogs, setDogs] = useState<Record<string, any>>({});
  const [activeDogId, setActiveDogId] = useState(null);
  const [lang, setLang] = useState("en");
  const [reminders, setReminders] = useState({
    enabled: false, times: ["09:00", "18:00"], notifPermission: "default",
    smart: { streakReminder: true, spacedRepDue: true, challengeIncomplete: true, buddyNudge: false, communityActivity: false },
    quietHours: { start: "22:00", end: "07:00", enabled: false },
    maxPerDay: 5, notifsSentToday: 0, lastNotifDate: null,
  });

  // ─── Feedback State ───
  const [feedback, setFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFeedbackAdmin, setShowFeedbackAdmin] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);

  // ─── Navigation State ───
  const [screen, setScreen] = useState("splash");
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [selProgram, setSelProgram] = useState(null);
  const [selLevel, setSelLevel] = useState(null);
  const [selExercise, setSelExercise] = useState(null);
  const [selEmergency, setSelEmergency] = useState(null);
  const [walkData, setWalkData] = useState(null);
  const [walkSavedToast, setWalkSavedToast] = useState(false);

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
            migratedDogs[id] = { ...DEFAULT_DOG_STATE, ...(dog as Record<string, unknown>) };
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

    async function loadFromBackend() {
      try {
        // Load dogs + progress from backend API
        const dogsData = await api.getDogs();
        if (cancelled) return;

        if (Array.isArray(dogsData) && dogsData.length > 0) {
          const idMap = {};
          const dogsMap = {};
          for (const d of dogsData) {
            idMap[d.id] = d.id;  // identity: backend UUID → backend UUID
            dogsMap[d.id] = { ...DEFAULT_DOG_STATE, profile: d };
          }
          // Load progress for each dog
          const progressList = await Promise.all(dogsData.map(d => api.getProgress(d.id).catch(() => null)));
          progressList.forEach((p, i) => {
            if (p && dogsData[i]) {
              const dogId = dogsData[i].id;
              dogsMap[dogId] = {
                ...dogsMap[dogId],
                completedExercises: p.completedExercises || [],
                completedLevels: p.completedLevels || [],
                totalXP: p.totalXP || 0,
                currentStreak: p.currentStreak || 0,
                lastTrainDate: p.lastTrainDate || null,
                totalSessions: p.totalSessions || 0,
                totalReviews: p.totalReviews || 0,
                earnedBadges: p.earnedBadges || [],
                journal: p.journal || [],
                skillFreshness: p.skillFreshness || {},
                streaks: p.streakData || null,
              };
            }
          });
          // Load settings
          let settings = null;
          try { settings = await api.getSettings(); } catch { /* no settings yet */ }
          idMapRef.current = idMap;
          setDogs(dogsMap);
          setActiveDogId(dogsData[0].id);
          if (settings?.lang) setLang(settings.lang);
          if (settings?.reminders) setReminders(settings.reminders);
          if (settings) setAppSettings(prev => ({
            ...prev,
            activeTheme: settings.activeTheme || "default",
            unlockedThemes: settings.unlockedThemes || ["default"],
            activeAccessories: settings.activeAccessories || [],
            unlockedAccessories: settings.unlockedAccessories || [],
            leaderboardOptIn: settings.leaderboardOptIn,
          }));
          setScreen("home");
        }
      } catch (e) {
        console.error('Failed to load from backend:', e.message);
      }
    }

    if (isAuthenticated) {
      setLoaded(false);
      loadFromBackend().finally(() => {
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

  // ─── Sync settings to backend (debounced, skips initial load) ───
  useEffect(() => {
    if (!loaded || !isAuthenticated) return;
    if (settingsSyncSkipRef.current) {
      settingsSyncSkipRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      api.updateSettings({
        lang,
        reminders,
        activeTheme: appSettings.activeTheme,
        unlockedThemes: appSettings.unlockedThemes,
        activeAccessories: appSettings.activeAccessories,
        unlockedAccessories: appSettings.unlockedAccessories,
        leaderboardOptIn: appSettings.leaderboardOptIn,
      }).catch(() => {});
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
    if (addingDogRef.current) return null;
    const dogIds = Object.keys(dogs);
    if (dogIds.length >= 2) return null;
    addingDogRef.current = true;
    const newId = !dogs.dog_1 ? "dog_1" : "dog_2";
    const newDog = { ...DEFAULT_DOG_STATE, profile };
    setDogs(prev => ({ ...prev, [newId]: newDog }));
    setActiveDogId(newId);
    setShowAddDog(false);
    if (isAuthenticated) {
      api.createDog({ name: profile.name, breed: profile.breed || null, birthday: profile.birthday || null, weight: profile.weight || null, avatar: profile.avatar || null })
        .then(data => {
          if (data) {
            idMapRef.current[newId] = data.id;
            if (data.newBadges?.length > 0) {
              const badgeDef = BADGE_DEFS.find(b => b.id === data.newBadges[0]);
              if (badgeDef) { setNewBadge(badgeDef); setTimeout(() => setNewBadge(null), 4000); }
            }
          }
        })
        .catch(err => console.error('Failed to create dog:', err.message))
        .finally(() => { addingDogRef.current = false; });
    } else {
      addingDogRef.current = false;
    }
    return newId;
  }, [dogs, isAuthenticated]);

  const removeDog = useCallback((dogId) => {
    const dogIds = Object.keys(dogs);
    if (dogIds.length <= 1) return;
    if (isAuthenticated) {
      const backendDogId = getDogBackendId(dogId);
      if (backendDogId) {
        api.deleteDog(backendDogId).catch(err => console.error('Failed to delete dog:', err.message));
        delete idMapRef.current[dogId];
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
        api.createDog(dbPayload)
          .then(data => {
            if (data) {
              idMapRef.current[newId] = data.id;
              if (data.newBadges?.length > 0) {
                const badgeDef = BADGE_DEFS.find(b => b.id === data.newBadges[0]);
                if (badgeDef) { setNewBadge(badgeDef); setTimeout(() => setNewBadge(null), 4000); }
              }
            }
          })
          .catch(err => console.error('Failed to create dog:', err.message));
      }
    } else {
      // Update existing dog's profile
      updateDogFields({ profile });
      if (isAuthenticated) {
        const backendDogId = getDogBackendId(activeDogId);
        if (backendDogId) api.updateDog(backendDogId, dbPayload).catch(err => console.error('Failed to update dog:', err.message));
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
  const { skillHealthData, allSkillsFresh } = useSkillHealth(skillFreshness, programs);

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

  // ─── Weekly Challenge Sync ───
  useChallengeSync(activeDogId, dogs, updateDogFields);

  // ─── Streak Break Detection ───
  useStreakBreakDetection(loaded, activeDogId, dogs, updateDogFields, streakCheckRef, setStreakFreezeNotif, setStreakBrokenModal);

  // ─── Challenge Data ───
  const challengeData = useChallengeData(challengeState);

  // Complete a challenge day
  const completeChallengeDay = useCallback((dayNum) => {
    if (!activeDogId || !dogs[activeDogId]) return;
    const cs = dogs[activeDogId].challenges;
    if (!cs?.active) return;
    if (cs.active.completedDays.includes(dayNum)) return;

    const newDays = [...cs.active.completedDays, dayNum];
    const newChallenges = { ...cs, active: { ...cs.active, completedDays: newDays } };
    updateDogFields({ challenges: newChallenges });

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
    setStreakBrokenModal(null);
  }, [activeDogId, dogs, updateDogFields, isAuthenticated]);

  // ─── Difficulty Tracking ───
  const { isExerciseStruggling, updateDifficultyTracking, incrementDifficultyField, dismissDifficultySuggestion, recordMoodCheck } = useDifficultyTracking(totalSessions, difficultyTracking, updateDogFields, setMoodCheck);

  // ─── Daily Plan ───
  const dailyPlan = useDailyPlan(completedExercises, playerLevel, programs, skillHealthData, lifeStageData);

  // ─── Daily Message ───
  const dailyMsg = useMemo(() => {
    const idx = new Date().getDate() % messages.length;
    return messages[idx];
  }, [messages]);

  // Badge checking is now handled server-side via the training API

  // ─── Reminder Check ───
  useReminderCheck(reminders, setReminders, dogProfile, currentStreak, activeDog, todayExercises);

  // ─── Navigation ───
  const nav = useCallback((s, o: Record<string, any> = {}) => {
    if (o.program !== undefined) setSelProgram(o.program);
    if (o.level !== undefined) setSelLevel(o.level);
    if (o.exercise !== undefined) setSelExercise(o.exercise);
    if (o.emergency !== undefined) setSelEmergency(o.emergency);
    if (o.walkData !== undefined) setWalkData(o.walkData);
    setWalkSavedToast(!!o.walkSavedToast);
    setScreenParams(o);
    setScreen(s);
  }, []);

  // ─── Exercise Completion ───
  const triggerComplete = useCallback((exId, lvlId, progId) => {
    const isReview = completedExercises.includes(exId);
    setPendingComplete({ exId, lvlId, progId, isReview });
    setJournalForm({ note: "", rating: 3, mood: "happy", photos: [] });
    setShowJournalEntry(true);
  }, [completedExercises]);

  const finalizeComplete = useCallback(async (skipJournal) => {
    if (!pendingComplete || !dogs[activeDogId]) return;
    const { exId, lvlId, progId, isReview } = pendingComplete;
    const currentDog = dogs[activeDogId];

    // Prepare journal data
    const hasContent = journalForm.note.trim() || (journalForm.photos && journalForm.photos.length > 0);
    const journalData = (!skipJournal && hasContent) ? {
      note: journalForm.note,
      rating: journalForm.rating,
      mood: journalForm.mood,
      photos: journalForm.photos || [],
    } : undefined;

    try {
      const backendDogId = getDogBackendId(activeDogId) || activeDogId;
      const result = await api.completeExercise({
        dogId: backendDogId,
        exerciseId: exId,
        levelId: lvlId,
        programId: progId,
        journal: journalData,
      });

      // XP animation
      setXpAnim(result.xpGained);
      setTimeout(() => setXpAnim(null), 2000);

      // Milestone celebration
      if (result.milestoneUnlock) {
        setTimeout(() => setMilestoneUnlock(result.milestoneUnlock), 500);
      }

      // Badge notifications
      if (result.newBadges && result.newBadges.length > 0) {
        const badgeDef = badges.find(b => b.id === result.newBadges[0]);
        if (badgeDef) {
          setNewBadge(badgeDef);
          setTimeout(() => setNewBadge(null), 4000);
        }
      }

      // Challenge day toast
      if (result.challengeDayDone) {
        const now = new Date();
        const activeChallenge = getActiveChallenge(now);
        const todayDay = getChallengeDay(now);
        if (activeChallenge) {
          setChallengeDayToast({ day: todayDay, remaining: 7 - todayDay });
          setTimeout(() => setChallengeDayToast(null), 3000);
        }
      }

      // Apply updates to dog state
      setDogs(prev => ({
        ...prev,
        [activeDogId]: {
          ...prev[activeDogId],
          completedExercises: result.completedExercises,
          completedLevels: result.completedLevels,
          totalXP: result.totalXP,
          currentStreak: result.newStreak,
          totalSessions: result.totalSessions,
          totalReviews: result.totalReviews,
          lastTrainDate: new Date().toDateString(),
        },
      }));

      setTodayExercises(prev => prev + 1);

    } catch (err) {
      console.error('Exercise completion failed:', err.message);
      // Fallback: still dismiss the modal
    }

    // Show mood check after completion
    if (currentDog.totalSessions >= DIFFICULTY_CONFIG.minTotalSessions - 1) {
      setMoodCheck({ exId, lvlId, progId });
    }

    setPendingComplete(null);
    setShowJournalEntry(false);
  }, [pendingComplete, dogs, activeDogId, journalForm, badges]);

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
    if (isAuthenticated) api.submitFeedback(entry).catch(() => {});
  }, [isAuthenticated]);

  // ─── Reset ───
  const resetAllData = useCallback(() => {
    if (isAuthenticated) {
      // Backend will handle cascading deletes when dogs are deleted
      idMapRef.current = {};
    }
    localStorage.removeItem(STORAGE_KEY);
    setDogs({});
    setActiveDogId(null);
    setScreen("splash");
    // Sign out so the auth gate in App.jsx forces re-authentication
    signOut();
  }, [isAuthenticated, signOut]);

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
    screen, setScreen, nav, screenParams,
    selProgram, setSelProgram,
    selLevel, setSelLevel,
    selExercise, setSelExercise,
    selEmergency,
    walkData,
    walkSavedToast,

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
    streakData, activeTheme, appSettings, setAppSettings,
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
    getDogBackendId,

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
