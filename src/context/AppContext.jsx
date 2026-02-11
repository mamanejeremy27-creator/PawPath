import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { TRAINING_PROGRAMS } from "../data/programs.js";
import { BADGE_DEFS, checkBadgeCondition } from "../data/badges.js";
import { DAILY_MESSAGES } from "../data/messages.js";
import { GEAR_TIPS } from "../data/gear.js";
import { t, isRTL } from "../i18n/index.js";
import { getTranslatedPrograms, getTranslatedGear, getTranslatedMessages, getTranslatedBadges } from "../i18n/content/index.js";

const STORAGE_KEY = "pawpath_v3";
const FEEDBACK_KEY = "pawpath_feedback";
const FEEDBACK_PROMPT_KEY = "pawpath_lastFeedbackPrompt";

const AppContext = createContext(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }) {
  // ─── Persisted State ───
  const [dogProfile, setDogProfile] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastTrainDate, setLastTrainDate] = useState(null);
  const [totalSessions, setTotalSessions] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [journal, setJournal] = useState([]);
  const [reminders, setReminders] = useState({ enabled: false, times: ["09:00", "18:00"], notifPermission: "default" });
  const [lang, setLang] = useState("en");

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
  const [journalForm, setJournalForm] = useState({ note: "", rating: 3, mood: "happy" });
  const [pendingComplete, setPendingComplete] = useState(null);

  const reminderCheckRef = useRef(null);

  // ─── Load from localStorage ───
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.dogProfile) { setDogProfile(d.dogProfile); setScreen("home"); }
        if (d.completedExercises) setCompletedExercises(d.completedExercises);
        if (d.completedLevels) setCompletedLevels(d.completedLevels);
        if (d.totalXP) setTotalXP(d.totalXP);
        if (d.currentStreak) setCurrentStreak(d.currentStreak);
        if (d.lastTrainDate) setLastTrainDate(d.lastTrainDate);
        if (d.totalSessions) setTotalSessions(d.totalSessions);
        if (d.earnedBadges) setEarnedBadges(d.earnedBadges);
        if (d.journal) setJournal(d.journal);
        if (d.reminders) setReminders(d.reminders);
        if (d.lang) setLang(d.lang);
      }
    } catch (e) { /* ignore */ }
    // Load feedback from separate localStorage key
    try {
      const rawFeedback = localStorage.getItem(FEEDBACK_KEY);
      if (rawFeedback) setFeedback(JSON.parse(rawFeedback));
    } catch (e) { /* ignore */ }
    setLoaded(true);
  }, []);

  // ─── Save to localStorage ───
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        dogProfile, completedExercises, completedLevels, totalXP,
        currentStreak, lastTrainDate, totalSessions, earnedBadges,
        journal, reminders, lang,
      }));
    } catch (e) { /* ignore */ }
  }, [dogProfile, completedExercises, completedLevels, totalXP, currentStreak, lastTrainDate, totalSessions, earnedBadges, journal, reminders, lang, loaded]);

  // ─── Save Feedback to localStorage ───
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
    } catch (e) { /* ignore */ }
  }, [feedback, loaded]);

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

  // ─── Daily Plan ───
  const dailyPlan = useMemo(() => {
    const plan = [];
    for (const prog of programs) {
      if (playerLevel.level < prog.unlockLevel) continue;
      for (const level of prog.levels) {
        const prevIdx = prog.levels.indexOf(level);
        if (prevIdx > 0 && !prog.levels[prevIdx - 1].exercises.every(e => completedExercises.includes(e.id))) continue;
        for (const ex of level.exercises) {
          if (!completedExercises.includes(ex.id) && plan.length < 3) {
            plan.push({ exercise: ex, level, program: prog, reason: "Continue progress" });
          }
        }
        if (plan.length >= 3) break;
      }
      if (plan.length >= 3) break;
    }
    if (plan.length === 0) {
      const doneExercises = [];
      programs.forEach(p => p.levels.forEach(l => l.exercises.forEach(e => {
        if (completedExercises.includes(e.id)) doneExercises.push({ exercise: e, level: l, program: p, reason: "Review & reinforce" });
      })));
      const shuffled = doneExercises.sort(() => 0.5 - Math.random());
      plan.push(...shuffled.slice(0, 3));
    }
    return plan;
  }, [completedExercises, playerLevel.level, programs]);

  // ─── Daily Message ───
  const dailyMsg = useMemo(() => {
    const idx = new Date().getDate() % messages.length;
    return messages[idx];
  }, [messages]);

  // ─── Badge Checking ───
  useEffect(() => {
    const state = { totalSessions, currentStreak, completedExercises, completedLevels, totalXP, todayExercises, journal };
    badges.forEach(b => {
      if (!earnedBadges.includes(b.id) && checkBadgeCondition(b.id, state)) {
        setEarnedBadges(prev => [...prev, b.id]);
        setNewBadge(b);
        setTimeout(() => setNewBadge(null), 3500);
      }
    });
  }, [completedExercises, totalXP, currentStreak, totalSessions, todayExercises, journal, earnedBadges, badges]);

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
    if (completedExercises.includes(exId)) return;
    setPendingComplete({ exId, lvlId, progId });
    setJournalForm({ note: "", rating: 3, mood: "happy" });
    setShowJournalEntry(true);
  }, [completedExercises]);

  const finalizeComplete = useCallback((skipJournal) => {
    if (!pendingComplete) return;
    const { exId, lvlId, progId } = pendingComplete;
    setCompletedExercises(prev => [...prev, exId]);
    setTotalSessions(prev => prev + 1);
    setTodayExercises(prev => prev + 1);

    const today = new Date().toDateString();
    if (lastTrainDate !== today) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      setCurrentStreak(prev => lastTrainDate === y.toDateString() ? prev + 1 : 1);
      setLastTrainDate(today);
    }

    const baseProg = TRAINING_PROGRAMS.find(p => p.id === progId);
    const baseLvl = baseProg.levels.find(l => l.id === lvlId);
    const xp = Math.round(baseLvl.xpReward / baseLvl.exercises.length);
    setTotalXP(prev => prev + xp);
    setXpAnim(xp);
    setTimeout(() => setXpAnim(null), 2000);

    if (baseLvl.exercises.every(e => e.id === exId || completedExercises.includes(e.id))) {
      if (!completedLevels.includes(lvlId)) setCompletedLevels(prev => [...prev, lvlId]);
    }

    if (!skipJournal && journalForm.note.trim()) {
      const tProg = programs.find(p => p.id === progId);
      const tLvl = tProg.levels.find(l => l.id === lvlId);
      const ex = tLvl.exercises.find(e => e.id === exId);
      setJournal(prev => [...prev, {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        exerciseId: exId,
        exerciseName: ex?.name || "Unknown",
        programName: tProg.name,
        programEmoji: tProg.emoji,
        note: journalForm.note,
        rating: journalForm.rating,
        mood: journalForm.mood,
      }]);
    }

    // Check if we should show feedback prompt (every 5th exercise, max once per week)
    const newTotal = completedExercises.length + 1; // +1 for the one being completed now
    if (newTotal % 5 === 0) {
      try {
        const lastPrompt = localStorage.getItem(FEEDBACK_PROMPT_KEY);
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (!lastPrompt || Number(lastPrompt) < oneWeekAgo) {
          localStorage.setItem(FEEDBACK_PROMPT_KEY, Date.now().toString());
          setTimeout(() => setShowFeedbackPrompt(true), 2500); // slight delay after completion animations
        }
      } catch (e) { /* ignore */ }
    }

    setPendingComplete(null);
    setShowJournalEntry(false);
  }, [pendingComplete, lastTrainDate, completedExercises, completedLevels, journalForm, programs]);

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
  }, []);

  // ─── Reset ───
  const resetAllData = useCallback(() => {
    setDogProfile(null);
    setCompletedExercises([]);
    setCompletedLevels([]);
    setTotalXP(0);
    setCurrentStreak(0);
    setTotalSessions(0);
    setEarnedBadges([]);
    setJournal([]);
    setScreen("splash");
  }, []);

  // ─── Translation helper ───
  const T = useCallback((key) => t(lang, key), [lang]);
  const rtl = isRTL(lang);

  const value = {
    // Persisted state
    dogProfile, setDogProfile,
    completedExercises, completedLevels,
    totalXP, currentStreak, lastTrainDate,
    totalSessions, earnedBadges, journal,
    reminders, setReminders,
    lang, setLang,

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

    // Translated content
    programs, gear, messages, badges,

    // Computed
    playerLevel, xpProgress,
    dailyPlan, dailyMsg,

    // Actions
    triggerComplete, finalizeComplete,
    requestNotifPermission, resetAllData,

    // Feedback
    feedback, showFeedback, setShowFeedback,
    showFeedbackAdmin, setShowFeedbackAdmin,
    showFeedbackPrompt, setShowFeedbackPrompt,
    submitFeedback,

    // i18n
    T, rtl,
  };

  return <AppContext.Provider value={value}>{loaded ? children : null}</AppContext.Provider>;
}
