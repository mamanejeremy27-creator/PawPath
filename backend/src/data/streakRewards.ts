export const STREAK_MILESTONES = [
  { days: 3, reward: "badge", rewardId: "streak-3-days", name: "3-Day Spark", emoji: "\u2728", xpBonus: 50 },
  { days: 7, reward: "theme", rewardId: "theme-ocean", name: "Ocean Theme", emoji: "\uD83C\uDF0A", xpBonus: 100 },
  { days: 14, reward: "badge", rewardId: "streak-14-days", name: "2-Week Warrior", emoji: "\u2694\uFE0F", xpBonus: 150, freezeReward: true },
  { days: 21, reward: "theme", rewardId: "theme-sunset", name: "Sunset Theme", emoji: "\uD83C\uDF05", xpBonus: 200 },
  { days: 30, reward: "avatar", rewardId: "avatar-crown", name: "Training Crown", emoji: "\uD83D\uDC51", xpBonus: 300, freezeReward: true },
  { days: 45, reward: "theme", rewardId: "theme-forest", name: "Forest Theme", emoji: "\uD83C\uDF32", xpBonus: 350 },
  { days: 60, reward: "avatar", rewardId: "avatar-cape", name: "Super Pup Cape", emoji: "\uD83E\uDDB8", xpBonus: 400, freezeReward: true },
  { days: 90, reward: "theme", rewardId: "theme-galaxy", name: "Galaxy Theme", emoji: "\uD83C\uDF0C", xpBonus: 500 },
  { days: 120, reward: "avatar", rewardId: "avatar-sunglasses", name: "Cool Shades", emoji: "\uD83D\uDE0E", xpBonus: 600 },
  { days: 180, reward: "theme", rewardId: "theme-aurora", name: "Aurora Theme", emoji: "\uD83C\uDF08", xpBonus: 1000 },
  { days: 365, reward: "badge", rewardId: "streak-365-days", name: "Legendary Trainer", emoji: "\uD83C\uDFC6", xpBonus: 5000 },
] as const;
