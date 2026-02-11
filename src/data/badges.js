export const BADGE_DEFS = [
  { id: "first_session", name: "First Steps", emoji: "\uD83D\uDC63", desc: "Complete your first training session" },
  { id: "streak_3", name: "On a Roll", emoji: "\uD83D\uDD25", desc: "3-day training streak" },
  { id: "streak_7", name: "Dedicated", emoji: "\u2B50", desc: "7-day training streak" },
  { id: "streak_14", name: "Unstoppable", emoji: "\uD83C\uDFC6", desc: "14-day training streak" },
  { id: "streak_30", name: "Legendary", emoji: "\uD83D\uDC51", desc: "30-day training streak" },
  { id: "exercises_5", name: "Getting Started", emoji: "\uD83C\uDF31", desc: "Complete 5 exercises" },
  { id: "exercises_25", name: "Progressing", emoji: "\uD83D\uDCC8", desc: "Complete 25 exercises" },
  { id: "level_complete", name: "Level Up", emoji: "\uD83C\uDFAF", desc: "Complete your first level" },
  { id: "xp_500", name: "XP Hunter", emoji: "\u26A1", desc: "Earn 500 XP" },
  { id: "xp_1000", name: "Power Player", emoji: "\uD83D\uDE80", desc: "Earn 1000 XP" },
  { id: "sessions_10", name: "Routine Builder", emoji: "\uD83D\uDCC5", desc: "10 training sessions" },
  { id: "quick_learner", name: "Quick Learner", emoji: "\uD83E\uDDE0", desc: "3 exercises in one day" },
  { id: "journal_5", name: "Reflective", emoji: "\uD83D\uDCDD", desc: "Write 5 journal entries" },
  { id: "journal_20", name: "Chronicler", emoji: "\uD83D\uDCD6", desc: "Write 20 journal entries" },
];

export function checkBadgeCondition(badgeId, state) {
  const { totalSessions, currentStreak, completedExercises, completedLevels, totalXP, todayExercises, journal } = state;
  switch (badgeId) {
    case "first_session": return totalSessions >= 1;
    case "streak_3": return currentStreak >= 3;
    case "streak_7": return currentStreak >= 7;
    case "streak_14": return currentStreak >= 14;
    case "streak_30": return currentStreak >= 30;
    case "exercises_5": return completedExercises.length >= 5;
    case "exercises_25": return completedExercises.length >= 25;
    case "level_complete": return completedLevels.length >= 1;
    case "xp_500": return totalXP >= 500;
    case "xp_1000": return totalXP >= 1000;
    case "sessions_10": return totalSessions >= 10;
    case "quick_learner": return todayExercises >= 3;
    case "journal_5": return journal.length >= 5;
    case "journal_20": return journal.length >= 20;
    default: return false;
  }
}
