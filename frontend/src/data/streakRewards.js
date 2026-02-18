// Streak milestone definitions with rewards

export const STREAK_MILESTONES = [
  { days: 3, reward: "badge", rewardId: "streak-3-days", name: "3-Day Spark", nameHe: "\u05E0\u05D9\u05E6\u05D5\u05E5 \u05E9\u05DC 3 \u05D9\u05DE\u05D9\u05DD", description: "Train 3 days in a row", descriptionHe: "\u05D4\u05EA\u05D0\u05DE\u05DF 3 \u05D9\u05DE\u05D9\u05DD \u05D1\u05E8\u05E6\u05E3", emoji: "\u2728", xpBonus: 50 },
  { days: 7, reward: "theme", rewardId: "theme-ocean", name: "Ocean Theme", nameHe: "\u05E2\u05E8\u05DB\u05EA \u05E0\u05D5\u05E9\u05D0 \u05D0\u05D5\u05E7\u05D9\u05D9\u05E0\u05D5\u05E1", description: "Unlock the Ocean color theme", descriptionHe: "\u05E4\u05EA\u05D7 \u05D0\u05EA \u05E2\u05E8\u05DB\u05EA \u05D4\u05E0\u05D5\u05E9\u05D0 \u05D0\u05D5\u05E7\u05D9\u05D9\u05E0\u05D5\u05E1", emoji: "\uD83C\uDF0A", xpBonus: 100 },
  { days: 14, reward: "badge", rewardId: "streak-14-days", name: "2-Week Warrior", nameHe: "\u05DC\u05D5\u05D7\u05DD \u05E9\u05D1\u05D5\u05E2\u05D9\u05D9\u05DD", description: "Train 14 days in a row", descriptionHe: "\u05D4\u05EA\u05D0\u05DE\u05DF 14 \u05D9\u05DE\u05D9\u05DD \u05D1\u05E8\u05E6\u05E3", emoji: "\u2694\uFE0F", xpBonus: 150, freezeReward: true },
  { days: 21, reward: "theme", rewardId: "theme-sunset", name: "Sunset Theme", nameHe: "\u05E2\u05E8\u05DB\u05EA \u05E0\u05D5\u05E9\u05D0 \u05E9\u05E7\u05D9\u05E2\u05D4", description: "Unlock the Sunset color theme", descriptionHe: "\u05E4\u05EA\u05D7 \u05D0\u05EA \u05E2\u05E8\u05DB\u05EA \u05D4\u05E0\u05D5\u05E9\u05D0 \u05E9\u05E7\u05D9\u05E2\u05D4", emoji: "\uD83C\uDF05", xpBonus: 200 },
  { days: 30, reward: "avatar", rewardId: "avatar-crown", name: "Training Crown", nameHe: "\u05DB\u05EA\u05E8 \u05D0\u05D9\u05DE\u05D5\u05E0\u05D9\u05DD", description: "Unlock a crown accessory for your dog's avatar", descriptionHe: "\u05E4\u05EA\u05D7 \u05D0\u05D1\u05D9\u05D6\u05E8 \u05DB\u05EA\u05E8 \u05DC\u05D0\u05D5\u05D5\u05D8\u05D0\u05E8 \u05E9\u05DC \u05D4\u05DB\u05DC\u05D1 \u05E9\u05DC\u05DA", emoji: "\uD83D\uDC51", xpBonus: 300, freezeReward: true },
  { days: 45, reward: "theme", rewardId: "theme-forest", name: "Forest Theme", nameHe: "\u05E2\u05E8\u05DB\u05EA \u05E0\u05D5\u05E9\u05D0 \u05D9\u05E2\u05E8", description: "Unlock the Forest color theme", descriptionHe: "\u05E4\u05EA\u05D7 \u05D0\u05EA \u05E2\u05E8\u05DB\u05EA \u05D4\u05E0\u05D5\u05E9\u05D0 \u05D9\u05E2\u05E8", emoji: "\uD83C\uDF32", xpBonus: 350 },
  { days: 60, reward: "avatar", rewardId: "avatar-cape", name: "Super Pup Cape", nameHe: "\u05D2\u05DC\u05D9\u05DE\u05EA \u05E1\u05D5\u05E4\u05E8 \u05D2\u05D5\u05E8", description: "Unlock a superhero cape for your dog's avatar", descriptionHe: "\u05E4\u05EA\u05D7 \u05D2\u05DC\u05D9\u05DE\u05EA \u05D2\u05D9\u05D1\u05D5\u05E8 \u05E2\u05DC \u05DC\u05D0\u05D5\u05D5\u05D8\u05D0\u05E8 \u05E9\u05DC \u05D4\u05DB\u05DC\u05D1 \u05E9\u05DC\u05DA", emoji: "\uD83E\uDDB8", xpBonus: 400, freezeReward: true },
  { days: 90, reward: "theme", rewardId: "theme-galaxy", name: "Galaxy Theme", nameHe: "\u05E2\u05E8\u05DB\u05EA \u05E0\u05D5\u05E9\u05D0 \u05D2\u05DC\u05E7\u05E1\u05D9\u05D4", description: "Unlock the Galaxy color theme", descriptionHe: "\u05E4\u05EA\u05D7 \u05D0\u05EA \u05E2\u05E8\u05DB\u05EA \u05D4\u05E0\u05D5\u05E9\u05D0 \u05D2\u05DC\u05E7\u05E1\u05D9\u05D4", emoji: "\uD83C\uDF0C", xpBonus: 500 },
  { days: 120, reward: "avatar", rewardId: "avatar-sunglasses", name: "Cool Shades", nameHe: "\u05DE\u05E9\u05E7\u05E4\u05D9 \u05E9\u05DE\u05E9 \u05DE\u05D2\u05E0\u05D9\u05D1\u05D5\u05EA", description: "Unlock sunglasses for your dog's avatar", descriptionHe: "\u05E4\u05EA\u05D7 \u05DE\u05E9\u05E7\u05E4\u05D9 \u05E9\u05DE\u05E9 \u05DC\u05D0\u05D5\u05D5\u05D8\u05D0\u05E8 \u05E9\u05DC \u05D4\u05DB\u05DC\u05D1 \u05E9\u05DC\u05DA", emoji: "\uD83D\uDE0E", xpBonus: 600 },
  { days: 180, reward: "theme", rewardId: "theme-aurora", name: "Aurora Theme", nameHe: "\u05E2\u05E8\u05DB\u05EA \u05E0\u05D5\u05E9\u05D0 \u05D6\u05D5\u05D4\u05E8 \u05E6\u05E4\u05D5\u05E0\u05D9", description: "Unlock the Aurora color theme", descriptionHe: "\u05E4\u05EA\u05D7 \u05D0\u05EA \u05E2\u05E8\u05DB\u05EA \u05D4\u05E0\u05D5\u05E9\u05D0 \u05D6\u05D5\u05D4\u05E8 \u05E6\u05E4\u05D5\u05E0\u05D9", emoji: "\uD83C\uDF08", xpBonus: 1000 },
  { days: 365, reward: "badge", rewardId: "streak-365-days", name: "Legendary Trainer", nameHe: "\u05DE\u05D0\u05DE\u05DF \u05D0\u05D2\u05D3\u05D9", description: "Train every single day for a year", descriptionHe: "\u05D4\u05EA\u05D0\u05DE\u05DF \u05DB\u05DC \u05D9\u05D5\u05DD \u05D1\u05DE\u05E9\u05DA \u05E9\u05E0\u05D4", emoji: "\uD83C\uDFC6", xpBonus: 5000 },
];

export const THEMES = {
  default: {
    id: "default",
    name: "PawPath Classic",
    nameHe: "PawPath \u05E7\u05DC\u05D0\u05E1\u05D9",
    accent: "#22C55E",
    surface: "#131316",
    surfaceHover: "#1C1C20",
    gradient: "linear-gradient(135deg, #22C55E, #4ADE80)",
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    nameHe: "\u05D0\u05D5\u05E7\u05D9\u05D9\u05E0\u05D5\u05E1",
    accent: "#00B4D8",
    surface: "#1B2838",
    surfaceHover: "#223344",
    gradient: "linear-gradient(135deg, #0077B6, #00B4D8)",
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    nameHe: "\u05E9\u05E7\u05D9\u05E2\u05D4",
    accent: "#FFB347",
    surface: "#2D1B2E",
    surfaceHover: "#3A2340",
    gradient: "linear-gradient(135deg, #FF6B35, #FFB347)",
  },
  forest: {
    id: "forest",
    name: "Forest",
    nameHe: "\u05D9\u05E2\u05E8",
    accent: "#52B788",
    surface: "#1B2E1F",
    surfaceHover: "#243828",
    gradient: "linear-gradient(135deg, #2D6A4F, #52B788)",
  },
  galaxy: {
    id: "galaxy",
    name: "Galaxy",
    nameHe: "\u05D2\u05DC\u05E7\u05E1\u05D9\u05D4",
    accent: "#BB86FC",
    surface: "#1A1A2E",
    surfaceHover: "#242445",
    gradient: "linear-gradient(135deg, #7B2D8E, #BB86FC)",
  },
  aurora: {
    id: "aurora",
    name: "Aurora",
    nameHe: "\u05D6\u05D5\u05D4\u05E8 \u05E6\u05E4\u05D5\u05E0\u05D9",
    accent: "#06D6A0",
    surface: "#0B1622",
    surfaceHover: "#132233",
    gradient: "linear-gradient(135deg, #06D6A0, #118AB2)",
  },
};

export const AVATAR_ACCESSORIES = [
  { id: "avatar-crown", name: "Training Crown", nameHe: "\u05DB\u05EA\u05E8 \u05D0\u05D9\u05DE\u05D5\u05E0\u05D9\u05DD", emoji: "\uD83D\uDC51", position: "top", unlockedAt: 30 },
  { id: "avatar-cape", name: "Super Pup Cape", nameHe: "\u05D2\u05DC\u05D9\u05DE\u05EA \u05E1\u05D5\u05E4\u05E8 \u05D2\u05D5\u05E8", emoji: "\uD83E\uDDB8", position: "back", unlockedAt: 60 },
  { id: "avatar-sunglasses", name: "Cool Shades", nameHe: "\u05DE\u05E9\u05E7\u05E4\u05D9 \u05E9\u05DE\u05E9", emoji: "\uD83D\uDE0E", position: "face", unlockedAt: 120 },
];

// Get fire emoji based on streak length
export function getStreakFire(streak) {
  if (streak >= 30) return "\uD83D\uDCA5\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25";
  if (streak >= 14) return "\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25";
  if (streak >= 7) return "\uD83D\uDD25\uD83D\uDD25";
  return "\uD83D\uDD25";
}

// Get next milestone for a given streak
export function getNextMilestone(currentStreak) {
  return STREAK_MILESTONES.find(m => m.days > currentStreak) || null;
}

// Get progress toward next milestone (0-1)
export function getMilestoneProgress(currentStreak) {
  const next = getNextMilestone(currentStreak);
  if (!next) return 1;
  const prev = [...STREAK_MILESTONES].reverse().find(m => m.days <= currentStreak);
  const start = prev ? prev.days : 0;
  return (currentStreak - start) / (next.days - start);
}

export const DEFAULT_STREAKS = {
  current: 0,
  best: 0,
  lastTrainingDate: null,
  totalTrainingDays: 0,
  startDate: null,
  freezes: { available: 0, maxFreezes: 3, totalEarned: 0, totalUsed: 0, lastUsedDate: null },
  milestones: { unlocked: [], claimedRewards: [] },
  recovery: { active: false, daysCompleted: 0, startDate: null },
  history: [],
};

export const DEFAULT_APP_SETTINGS = {
  activeTheme: "default",
  unlockedThemes: ["default"],
  activeAccessories: [],
  unlockedAccessories: [],
  leaderboardOptIn: true,
};
