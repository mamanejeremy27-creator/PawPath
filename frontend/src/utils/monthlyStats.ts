/**
 * Gather per-month training stats from app state.
 * Returns an array of month objects sorted newest first.
 */

function getMonthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(key, lang) {
  const [year, month] = key.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "long", year: "numeric" });
}

export function gatherMonthlyStats({ journal, completedExercises, totalXP, currentStreak, totalSessions, totalReviews, lang }) {
  if (!journal || journal.length === 0) return [];

  // Group journal entries by month
  const months = {};
  journal.forEach(entry => {
    const key = getMonthKey(entry.date);
    if (!months[key]) {
      months[key] = {
        key,
        label: getMonthLabel(key, lang),
        sessions: 0,
        xp: 0,
        newExercises: [],
        reviews: 0,
        ratings: [],
        moods: [],
        bestStreak: 0,
        entries: [],
      };
    }
    const m = months[key] as any;
    m.sessions++;
    m.entries.push(entry);
    if (entry.rating) m.ratings.push(entry.rating);
    if (entry.mood) m.moods.push(entry.mood);
  });

  // Calculate new exercises per month (first journal entry for each exercise)
  const exerciseFirstSeen = {};
  journal.forEach(entry => {
    const key = getMonthKey(entry.date);
    if (!exerciseFirstSeen[entry.exerciseId]) {
      exerciseFirstSeen[entry.exerciseId] = key;
    }
  });

  Object.entries(exerciseFirstSeen).forEach(([exId, monthKey]) => {
    if (months[monthKey as string]) {
      (months[monthKey as string] as any).newExercises.push(exId);
    }
  });

  // Estimate XP per month from sessions (proportional)
  const totalJournalSessions = journal.length;
  if (totalJournalSessions > 0) {
    Object.values(months).forEach(m => {
      (m as any).xp = Math.round(((m as any).sessions / totalJournalSessions) * totalXP);
    });
  }

  // Calculate streak info per month (consecutive days with entries)
  Object.values(months).forEach(m => {
    const mm = m as any;
    const dates = [...new Set(mm.entries.map((e: any) => new Date(e.date).toDateString()))].sort((a, b) => new Date(a as string).getTime() - new Date(b as string).getTime());
    let streak = 1, best = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = (new Date(dates[i] as string).getTime() - new Date(dates[i - 1] as string).getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) { streak++; best = Math.max(best, streak); }
      else streak = 1;
    }
    mm.bestStreak = dates.length > 0 ? best : 0;
  });

  // Estimate reviews per month
  const reviewEntries = journal.filter((e, i) => {
    // An entry is a review if the exercise appeared in an earlier entry
    return journal.findIndex(j => j.exerciseId === e.exerciseId) < i;
  });
  reviewEntries.forEach(entry => {
    const key = getMonthKey(entry.date);
    if (months[key]) (months[key] as any).reviews++;
  });

  // Calculate average rating per month
  Object.values(months).forEach(m => {
    const mm = m as any;
    mm.avgRating = mm.ratings.length > 0 ? (mm.ratings.reduce((a: number, b: number) => a + b, 0) / mm.ratings.length).toFixed(1) : 0;
  });

  // Sort newest first
  return Object.values(months).sort((a, b) => (b as any).key.localeCompare((a as any).key));
}

export function getCurrentMonthKey() {
  return getMonthKey(new Date());
}

export function hasCurrentMonthData(journal) {
  if (!journal || journal.length === 0) return false;
  const current = getCurrentMonthKey();
  return journal.some(e => getMonthKey(e.date) === current);
}

export function getPreviousMonthKey() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return getMonthKey(d);
}

export function hasPreviousMonthReport(journal) {
  if (!journal || journal.length === 0) return false;
  const prev = getPreviousMonthKey();
  return journal.some(e => getMonthKey(e.date) === prev);
}
