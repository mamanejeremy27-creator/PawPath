# PawPath Phase 3A — Build 2: Training Streaks with Unlockable Rewards

## Overview

Upgrade the existing streak system from a simple counter into a full reward loop. Users unlock app themes, avatar accessories, exclusive badges, and special content by maintaining training streaks. Streak freezes, recovery challenges, and visual flair make the system feel alive.

---

## Current State

PawPath already tracks basic streaks (consecutive days of training). This build extends that with:
- Milestone rewards at specific streak lengths
- Streak freeze mechanic (earn the right to skip a day)
- Visual streak counter with animations
- Streak recovery when broken
- Unlockable app themes and avatar items

---

## Streak Milestones & Rewards

Create a new file: `src/data/streakRewards.js`

```javascript
export const STREAK_MILESTONES = [
  {
    days: 3,
    reward: "badge",
    rewardId: "streak-3-days",
    name: "3-Day Spark",
    nameHe: "ניצוץ של 3 ימים",
    description: "Train 3 days in a row",
    descriptionHe: "התאמן 3 ימים ברצף",
    emoji: "✨",
    xpBonus: 50
  },
  {
    days: 7,
    reward: "theme",
    rewardId: "theme-ocean",
    name: "Ocean Theme",
    nameHe: "ערכת נושא אוקיינוס",
    description: "Unlock the Ocean color theme",
    descriptionHe: "פתח את ערכת הנושא אוקיינוס",
    emoji: "🌊",
    xpBonus: 100,
    themeData: {
      id: "ocean",
      name: "Ocean",
      nameHe: "אוקיינוס",
      primary: "#0077B6",
      accent: "#00B4D8",
      surface: "#1B2838",
      surfaceHover: "#223344",
      gradient: "linear-gradient(135deg, #0077B6, #00B4D8)"
    }
  },
  {
    days: 14,
    reward: "badge",
    rewardId: "streak-14-days",
    name: "2-Week Warrior",
    nameHe: "לוחם שבועיים",
    description: "Train 14 days in a row",
    descriptionHe: "התאמן 14 ימים ברצף",
    emoji: "⚔️",
    xpBonus: 150,
    freezeReward: true  // earns a streak freeze
  },
  {
    days: 21,
    reward: "theme",
    rewardId: "theme-sunset",
    name: "Sunset Theme",
    nameHe: "ערכת נושא שקיעה",
    description: "Unlock the Sunset color theme",
    descriptionHe: "פתח את ערכת הנושא שקיעה",
    emoji: "🌅",
    xpBonus: 200,
    themeData: {
      id: "sunset",
      name: "Sunset",
      nameHe: "שקיעה",
      primary: "#FF6B35",
      accent: "#FFB347",
      surface: "#2D1B2E",
      surfaceHover: "#3A2340",
      gradient: "linear-gradient(135deg, #FF6B35, #FFB347)"
    }
  },
  {
    days: 30,
    reward: "avatar",
    rewardId: "avatar-crown",
    name: "Training Crown",
    nameHe: "כתר אימונים",
    description: "Unlock a crown accessory for your dog's avatar",
    descriptionHe: "פתח אביזר כתר לאווטאר של הכלב שלך",
    emoji: "👑",
    xpBonus: 300,
    freezeReward: true
  },
  {
    days: 45,
    reward: "theme",
    rewardId: "theme-forest",
    name: "Forest Theme",
    nameHe: "ערכת נושא יער",
    description: "Unlock the Forest color theme",
    descriptionHe: "פתח את ערכת הנושא יער",
    emoji: "🌲",
    xpBonus: 350,
    themeData: {
      id: "forest",
      name: "Forest",
      nameHe: "יער",
      primary: "#2D6A4F",
      accent: "#52B788",
      surface: "#1B2E1F",
      surfaceHover: "#243828",
      gradient: "linear-gradient(135deg, #2D6A4F, #52B788)"
    }
  },
  {
    days: 60,
    reward: "avatar",
    rewardId: "avatar-cape",
    name: "Super Pup Cape",
    nameHe: "גלימת סופר גור",
    description: "Unlock a superhero cape for your dog's avatar",
    descriptionHe: "פתח גלימת גיבור על לאווטאר של הכלב שלך",
    emoji: "🦸",
    xpBonus: 400,
    freezeReward: true
  },
  {
    days: 90,
    reward: "theme",
    rewardId: "theme-galaxy",
    name: "Galaxy Theme",
    nameHe: "ערכת נושא גלקסיה",
    description: "Unlock the Galaxy color theme",
    descriptionHe: "פתח את ערכת הנושא גלקסיה",
    emoji: "🌌",
    xpBonus: 500,
    themeData: {
      id: "galaxy",
      name: "Galaxy",
      nameHe: "גלקסיה",
      primary: "#7B2D8E",
      accent: "#BB86FC",
      surface: "#1A1A2E",
      surfaceHover: "#242445",
      gradient: "linear-gradient(135deg, #7B2D8E, #BB86FC)"
    }
  },
  {
    days: 120,
    reward: "avatar",
    rewardId: "avatar-sunglasses",
    name: "Cool Shades",
    nameHe: "משקפי שמש מגניבות",
    description: "Unlock sunglasses for your dog's avatar",
    descriptionHe: "פתח משקפי שמש לאווטאר של הכלב שלך",
    emoji: "😎",
    xpBonus: 600
  },
  {
    days: 180,
    reward: "theme",
    rewardId: "theme-aurora",
    name: "Aurora Theme",
    nameHe: "ערכת נושא זוהר צפוני",
    description: "Unlock the Aurora color theme — the ultimate streak reward",
    descriptionHe: "פתח את ערכת הנושא זוהר צפוני — הפרס האולטימטיבי",
    emoji: "🌈",
    xpBonus: 1000,
    themeData: {
      id: "aurora",
      name: "Aurora",
      nameHe: "זוהר צפוני",
      primary: "#06D6A0",
      accent: "#118AB2",
      surface: "#0B1622",
      surfaceHover: "#132233",
      gradient: "linear-gradient(135deg, #06D6A0, #118AB2, #7B2D8E)"
    }
  },
  {
    days: 365,
    reward: "badge",
    rewardId: "streak-365-days",
    name: "Legendary Trainer",
    nameHe: "מאמן אגדי",
    description: "Train every single day for a year",
    descriptionHe: "התאמן כל יום במשך שנה",
    emoji: "🏆",
    xpBonus: 5000
  }
];

export const STREAK_BADGES = [
  { id: "streak-3-days", name: "3-Day Spark", nameHe: "ניצוץ של 3 ימים", emoji: "✨", description: "3-day training streak", descriptionHe: "רצף אימונים של 3 ימים", category: "streak" },
  { id: "streak-7-days", name: "Week Warrior", nameHe: "לוחם שבוע", emoji: "🌊", description: "7-day training streak", descriptionHe: "רצף אימונים של 7 ימים", category: "streak" },
  { id: "streak-14-days", name: "2-Week Warrior", nameHe: "לוחם שבועיים", emoji: "⚔️", description: "14-day training streak", descriptionHe: "רצף אימונים של 14 ימים", category: "streak" },
  { id: "streak-30-days", name: "Monthly Master", nameHe: "אלוף חודשי", emoji: "👑", description: "30-day training streak", descriptionHe: "רצף אימונים של 30 ימים", category: "streak" },
  { id: "streak-60-days", name: "Unstoppable", nameHe: "בלתי ניתן לעצירה", emoji: "🦸", description: "60-day training streak", descriptionHe: "רצף אימונים של 60 ימים", category: "streak" },
  { id: "streak-90-days", name: "Quarter Champion", nameHe: "אלוף הרבעון", emoji: "🌌", description: "90-day training streak", descriptionHe: "רצף אימונים של 90 ימים", category: "streak" },
  { id: "streak-180-days", name: "Half-Year Hero", nameHe: "גיבור חצי שנה", emoji: "🌈", description: "180-day training streak", descriptionHe: "רצף אימונים של 180 ימים", category: "streak" },
  { id: "streak-365-days", name: "Legendary Trainer", nameHe: "מאמן אגדי", emoji: "🏆", description: "365-day training streak", descriptionHe: "רצף אימונים של 365 ימים", category: "streak" },
  { id: "streak-recovered", name: "Comeback Kid", nameHe: "מלך החזרות", emoji: "💪", description: "Recovered a broken streak", descriptionHe: "שחזרת רצף שבור", category: "streak" },
  { id: "streak-freeze-used", name: "Ice Save", nameHe: "הצלת קרח", emoji: "🧊", description: "Used a streak freeze to save your streak", descriptionHe: "השתמשת בהקפאת רצף להצלת הרצף שלך", category: "streak" },
];
```

---

## Streak Freeze Mechanic

### How It Works
- Users **earn** streak freezes at specific milestones (14, 30, 60 days)
- A freeze lets you skip **1 day** without breaking your streak
- Maximum of **3 freezes** stored at any time
- Freezes are used **automatically** — if you miss a day and have a freeze, the streak is preserved
- When a freeze is used, show a notification: "🧊 Streak Freeze used! Your streak is safe."
- Each freeze can only be used once

### Storage
```javascript
streakFreezes: {
  available: 2,     // freezes available to use
  maxFreezes: 3,    // cap
  totalEarned: 4,   // lifetime freezes earned
  totalUsed: 2,     // lifetime freezes used
  lastUsedDate: "2026-02-10"
}
```

---

## App Themes System

### How It Works
- Default theme = current PawPath dark theme (always available)
- Unlocked themes appear in a new "Themes" section in Profile → Settings
- User can switch between unlocked themes at any time
- Theme changes the app's accent colors, surface colors, and gradients
- Theme is stored per-account (not per-dog)

### Theme Structure
Each theme overrides specific CSS custom properties or color constants:

```javascript
const THEMES = {
  default: {
    id: "default",
    name: "PawPath Classic",
    nameHe: "PawPath קלאסי",
    primary: "#4ECDC4",   // the existing green
    accent: "#45B7AA",
    surface: "#1E1E2E",
    surfaceHover: "#2A2A3C",
    gradient: "linear-gradient(135deg, #4ECDC4, #45B7AA)",
    locked: false
  },
  // ... unlocked themes from streakRewards.js
};
```

### Theme Selector UI
In Profile → new "Themes" / "ערכות נושא" section:
- Grid of theme cards (2 per row)
- Each card shows: color preview swatch, theme name, emoji
- Locked themes show: lock icon, "Unlock at X-day streak" text
- Tapping an unlocked theme applies it immediately
- Active theme has a checkmark

---

## Dog Avatar Accessories

### How It Works
- Each dog gets a simple avatar display (emoji-based or illustrated circle)
- Unlocked accessories appear around/on the avatar
- Accessories are togglable — user chooses which to display
- Avatar shows on: Home screen header, Profile, Milestone Cards

### Accessories
```javascript
const AVATAR_ACCESSORIES = [
  {
    id: "avatar-crown",
    name: "Training Crown",
    nameHe: "כתר אימונים",
    emoji: "👑",
    position: "top",    // renders above the dog emoji/avatar
    unlockedAt: 30      // streak days required
  },
  {
    id: "avatar-cape",
    name: "Super Pup Cape",
    nameHe: "גלימת סופר גור",
    emoji: "🦸",
    position: "back",
    unlockedAt: 60
  },
  {
    id: "avatar-sunglasses",
    name: "Cool Shades",
    nameHe: "משקפי שמש",
    emoji: "😎",
    position: "face",
    unlockedAt: 120
  }
];
```

### Avatar Display Component
Create `src/components/DogAvatar.jsx`:
- Shows the dog's life-stage emoji (🐶 puppy, 🐕 adult, etc.)
- Overlays active accessories as positioned emoji around the base avatar
- Size variants: small (Home header), medium (Profile), large (Milestone Cards)
- Smooth animation when a new accessory is unlocked

---

## UI Components

### 1. Streak Counter on Home Screen (Enhanced)

Replace the existing simple streak number with an animated streak widget:

```
┌──────────────────────────┐
│  🔥 12 Day Streak        │
│  ━━━━━━━━━━━━━░░░  →18   │
│  🧊 2 freezes available   │
│  Next: Sunset Theme (21)  │
└──────────────────────────┘
```

- **Fire emoji** scales with streak length: 🔥 (1-6), 🔥🔥 (7-13), 🔥🔥🔥 (14-29), 💥🔥🔥🔥 (30+)
- **Progress bar** shows progress toward next milestone
- **Freeze count** shown as small ice emoji row: 🧊🧊 (2 available)
- **Next reward preview** shows what you'll unlock next
- Tap to expand into full Streak Detail view
- **Pulse animation** on the fire emoji when streak is active today
- **Shake animation** when streak is about to break (last 2 hours of the day without training)

### 2. Streak Detail View
New component: `src/components/StreakView.jsx`

```
┌─────────────────────────────────────────┐
│  ← Back                                 │
│                                         │
│        🔥🔥🔥                            │
│     30 Day Streak                       │
│   Your best: 45 days                    │
│                                         │
│  ┌─ MILESTONES ───────────────────────┐ │
│  │ ✅  3 days — 3-Day Spark     ✨   │ │
│  │ ✅  7 days — Ocean Theme     🌊   │ │
│  │ ✅ 14 days — 2-Week Warrior  ⚔️   │ │
│  │ ✅ 21 days — Sunset Theme    🌅   │ │
│  │ ✅ 30 days — Training Crown  👑   │ │
│  │ 🔓 45 days — Forest Theme    🌲   │ │
│  │ 🔒 60 days — Super Pup Cape  🦸   │ │
│  │ 🔒 90 days — Galaxy Theme    🌌   │ │
│  │ 🔒120 days — Cool Shades     😎   │ │
│  │ 🔒180 days — Aurora Theme    🌈   │ │
│  │ 🔒365 days — Legendary       🏆   │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ STREAK FREEZES ──────────────────┐ │
│  │  🧊🧊⬜  2/3 available            │ │
│  │  Next freeze at 60-day streak     │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ STATS ───────────────────────────┐ │
│  │  Current: 30 days                 │ │
│  │  Best: 45 days                    │ │
│  │  Total training days: 128         │ │
│  │  Freezes used: 2                  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

- Milestone list shows unlocked (✅), next to unlock (🔓 with progress), and locked (🔒)
- Next milestone has a mini progress bar
- Each unlocked milestone is tappable to preview the reward (theme preview, badge detail, avatar accessory preview)

### 3. Streak Broken Screen
When a streak breaks (missed a day, no freeze available):

```
┌─────────────────────────────────────────┐
│                                         │
│           😢                            │
│     Streak Broken                       │
│   You had a 23-day streak               │
│                                         │
│   Don't worry — every champion          │
│   gets back up!                         │
│                                         │
│   ┌─────────────────────────────┐       │
│   │  🔄 Recovery Challenge       │       │
│   │  Train 3 days in a row to    │       │
│   │  earn the Comeback Kid badge │       │
│   │  [Start Recovery →]          │       │
│   └─────────────────────────────┘       │
│                                         │
│   Your unlocked rewards are safe!       │
│   Themes and accessories stay yours.    │
│                                         │
└─────────────────────────────────────────┘
```

- Encouraging, never punishing tone
- **Recovery Challenge**: Train 3 consecutive days to earn the "Comeback Kid" badge
- All previously unlocked rewards (themes, accessories, badges) are **permanent** — they don't go away when the streak breaks
- The streak counter resets to 0 but all progress toward milestone badges is preserved in history

### 4. Milestone Unlock Celebration
When user hits a streak milestone:
- Full-screen celebration animation (confetti, glow effect)
- Show the reward prominently (theme preview, badge, or accessory)
- "Equip Now" / "Preview" button for themes and accessories
- XP bonus animation
- If a freeze is earned: "🧊 You earned a Streak Freeze!" notification

### 5. Theme Selector in Profile
Add under Profile → Settings:

```
┌─ THEMES ─────────────────────────────┐
│                                       │
│  ┌──────────┐  ┌──────────┐          │
│  │ ✅ Classic│  │  🌊 Ocean │          │
│  │  🟢🟢🟢  │  │  🔵🔵🔵  │          │
│  └──────────┘  └──────────┘          │
│  ┌──────────┐  ┌──────────┐          │
│  │ 🌅 Sunset│  │ 🔒 Forest │          │
│  │  🟠🟠🟠  │  │  45 days  │          │
│  └──────────┘  └──────────┘          │
│                                       │
└───────────────────────────────────────┘
```

---

## Data Storage (localStorage)

Extend the dog's data object:

```javascript
streaks: {
  current: 30,
  best: 45,
  lastTrainingDate: "2026-02-13",
  totalTrainingDays: 128,
  startDate: "2026-01-14",   // when current streak started

  // Freezes
  freezes: {
    available: 2,
    maxFreezes: 3,
    totalEarned: 4,
    totalUsed: 2,
    lastUsedDate: "2026-02-10"
  },

  // Milestone tracking
  milestones: {
    unlocked: ["streak-3-days", "streak-7-days", "streak-14-days", "streak-30-days"],
    claimedRewards: ["theme-ocean", "theme-sunset", "avatar-crown"]
  },

  // Recovery
  recovery: {
    active: false,
    daysCompleted: 0,
    startDate: null
  },

  // History
  history: [
    { startDate: "2025-12-01", endDate: "2025-12-23", length: 23, brokenReason: "missed" },
    { startDate: "2026-01-14", endDate: null, length: 30, active: true }
  ]
}

// App-level (not per-dog):
appSettings: {
  activeTheme: "ocean",      // currently applied theme ID
  unlockedThemes: ["default", "ocean", "sunset"],
  activeAccessories: ["avatar-crown"],  // currently displayed accessories
  unlockedAccessories: ["avatar-crown"]
}
```

---

## Logic Rules

1. **Streak continues** if user completes at least 1 exercise today. Check is based on `lastTrainingDate`.
2. **Streak break detection** runs on app open: if `lastTrainingDate` is more than 1 day ago AND no freeze available → streak broken.
3. **Auto-freeze**: if `lastTrainingDate` is exactly 1 day ago (yesterday was missed) AND freeze available → use freeze automatically, show notification.
4. **Freeze earned** at milestones 14, 30, 60 days. Cannot exceed `maxFreezes` (3).
5. **Milestone check** runs after each exercise completion: if `current` streak >= milestone threshold AND milestone not yet unlocked → trigger unlock celebration.
6. **Theme application**: When user selects a theme, update the app's color constants/CSS variables. The theme must persist across app restarts (stored in localStorage).
7. **Recovery challenge**: After a streak break, user can opt into recovery. Complete 3 consecutive days → earn "Comeback Kid" badge. Recovery state resets if they miss a day during recovery.
8. **Rewards are permanent**: Unlocked themes, accessories, and badges are never lost, even when a streak breaks.
9. **Streak counter display** updates in real-time on the Home screen.

---

## Hebrew Translations

Add all translations to the Hebrew language file:

- "Day Streak" → "ימי רצף"
- "freezes available" → "הקפאות זמינות"
- "Next reward" → "הפרס הבא"
- "Streak Broken" → "הרצף נשבר"
- "Recovery Challenge" → "אתגר התאוששות"
- "Start Recovery" → "התחל התאוששות"
- "Don't worry — every champion gets back up!" → "!אל דאגה — כל אלוף קם מחדש"
- "Your unlocked rewards are safe!" → "!הפרסים שפתחת בטוחים"
- "Themes" → "ערכות נושא"
- "Accessories" → "אביזרים"
- "Equip" → "הצמד"
- "Unequip" → "הסר"
- "Preview" → "תצוגה מקדימה"
- "Locked" → "נעול"
- "Unlock at X-day streak" → "נפתח ברצף של X ימים"
- "Current Streak" → "רצף נוכחי"
- "Best Streak" → "הרצף הטוב ביותר"
- "Total Training Days" → "סה״כ ימי אימון"
- "Freezes Used" → "הקפאות שנוצלו"
- "Streak Freeze used! Your streak is safe." → ".הקפאת רצף נוצלה! הרצף שלך בטוח"
- "Milestone Unlocked!" → "!אבן דרך נפתחה"
- "Comeback Kid" → "מלך החזרות"
- "Train 3 days in a row to recover" → "התאמן 3 ימים ברצף להתאוששות"
- "PawPath Classic" → "PawPath קלאסי"
- "Ocean" → "אוקיינוס"
- "Sunset" → "שקיעה"
- "Forest" → "יער"
- "Galaxy" → "גלקסיה"
- "Aurora" → "זוהר צפוני"
- "Training Crown" → "כתר אימונים"
- "Super Pup Cape" → "גלימת סופר גור"
- "Cool Shades" → "משקפי שמש מגניבות"

---

## Design Guidelines

- Follow the existing PawPath dark theme as the base
- Theme switching should feel instant — no page reload, just color swap via CSS variables or React context
- The streak counter fire animation should use CSS keyframes (pulse/glow)
- Locked milestone items should have a subtle blur/opacity reduction
- Theme preview cards should show a mini color palette (3 colored circles)
- Avatar accessories should be positioned with CSS (absolute positioning over the base avatar)
- All animations consistent with existing app feel
- RTL support for all Hebrew text
- Streak broken screen should feel supportive, not discouraging — warm colors, encouraging language

---

## Navigation

- Home screen → tap streak counter → StreakView (full milestone list)
- StreakView → tap unlocked milestone → reward preview
- Profile → Themes section → ThemeSelector
- Profile → Avatar section → AccessorySelector
- On streak break (app open) → StreakBrokenScreen → optional recovery
- On milestone unlock (after exercise) → celebration overlay → continue

---

## Claude Code Prompt

Drop this file into your PawPath project folder, then paste this into Claude Code:

```
Read phase3a-build2-streak-rewards.md and implement the Training Streaks with Unlockable Rewards system exactly as specified. This includes:

1. Create src/data/streakRewards.js with all milestone definitions, badges, themes, and accessories
2. Add 10 new streak badges to src/data/badges.js
3. Upgrade the existing streak counter on Home screen with animated fire emoji, progress bar, freeze count, and next reward preview
4. Create src/components/StreakView.jsx (full streak detail screen with milestones, freezes, stats)
5. Create src/components/StreakBrokenScreen.jsx (encouraging recovery screen)
6. Create src/components/DogAvatar.jsx (avatar with unlockable accessories)
7. Create src/components/ThemeSelector.jsx (theme grid in Profile)
8. Implement theme system: store themes as CSS variables or React context, allow instant switching without reload. Default theme = current PawPath colors. Unlocked themes override accent/surface colors.
9. Implement streak freeze logic: auto-use on missed day, earn at milestones (14, 30, 60 days), max 3 stored
10. Implement streak break detection on app open + recovery challenge (3 consecutive days)
11. Add milestone unlock celebration overlay (confetti/glow animation)
12. Wire up streak data to localStorage per-dog (streaks object) and app-level (appSettings for themes)
13. Add all Hebrew translations
14. Add Themes and Avatar sections to Profile page

Match existing dark theme as the "Classic" default. Full RTL support for Hebrew. All animations smooth and consistent with existing app.
```

Then push:
```
git add .
git commit -m "Phase 3A: Training Streaks with Unlockable Rewards"
git push
```
