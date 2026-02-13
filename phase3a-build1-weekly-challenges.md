# PawPath Phase 3A — Build 1: Weekly Challenges & Themed Events

## Overview

Add a rotating weekly challenge system that gives users a reason to open the app every day. Each challenge is a themed week with daily tasks tied to existing exercises. Completion earns exclusive badges and bonus XP.

---

## How It Works

### Challenge Structure
- Each challenge runs for **7 days** (Monday → Sunday)
- A new challenge auto-starts every week
- Each day has **1 daily task** tied to a specific exercise from an existing program
- Users must complete that day's exercise to check it off
- Completing all 7 days earns an **exclusive challenge badge** + **bonus XP**
- Missing a day doesn't disqualify — users can still earn a "Partial" badge for 5+/7

### Challenge Rotation
Challenges cycle through a predefined list. The app determines which challenge is active based on the current week number of the year (so all users see the same challenge at the same time — no backend needed).

```javascript
const currentWeek = getWeekNumber(new Date());
const activeChallenge = CHALLENGES[currentWeek % CHALLENGES.length];
```

---

## Challenge Data

Create a new file: `src/data/challenges.js`

### Challenge Definitions (12 challenges = 12 weeks of unique content)

```javascript
export const CHALLENGES = [
  {
    id: "recall-week",
    name: "Recall Master Week",
    nameHe: "שבוע שליטה בחזרה",
    emoji: "📣",
    description: "7 days to bulletproof your dog's recall",
    descriptionHe: "7 ימים לחיזוק החזרה של הכלב שלך",
    color: "#4ECDC4",
    bonusXP: 200,
    badgeId: "challenge-recall-master",
    days: [
      { day: 1, exerciseId: "o1a", task: "Practice Name Recognition 10 times", taskHe: "תרגל זיהוי שם 10 פעמים" },
      { day: 2, exerciseId: "o1b", task: "Work on Come command indoors", taskHe: "תרגל פקודת בוא בתוך הבית" },
      { day: 3, exerciseId: "o1c", task: "Add distance to your recall", taskHe: "הוסף מרחק לחזרה שלך" },
      { day: 4, exerciseId: "o2a", task: "Practice recall with mild distractions", taskHe: "תרגל חזרה עם הסחות קלות" },
      { day: 5, exerciseId: "o2b", task: "Try recall in a new room or area", taskHe: "נסה חזרה בחדר או אזור חדש" },
      { day: 6, exerciseId: "o2c", task: "Chain recall with sit and stay", taskHe: "שרשר חזרה עם שב והישאר" },
      { day: 7, exerciseId: "o1a", task: "Final test: recall from across the house", taskHe: "מבחן סופי: חזרה מקצה הבית" }
    ]
  },
  {
    id: "patience-week",
    name: "Patience & Impulse Control",
    nameHe: "שבוע סבלנות ושליטה עצמית",
    emoji: "🧘",
    description: "Teach your dog to think before acting",
    descriptionHe: "למד את הכלב שלך לחשוב לפני שהוא פועל",
    color: "#FF6B6B",
    bonusXP: 200,
    badgeId: "challenge-patience-guru",
    days: [
      { day: 1, exerciseId: "o1b", task: "Hold a Sit for 30 seconds", taskHe: "החזק ישיבה למשך 30 שניות" },
      { day: 2, exerciseId: "o1c", task: "Practice Wait at doorways", taskHe: "תרגל המתנה ליד דלתות" },
      { day: 3, exerciseId: "o2a", task: "Leave It with treats on the floor", taskHe: "עזוב את זה עם חטיפים על הרצפה" },
      { day: 4, exerciseId: "o2b", task: "Stay while you walk away 10 steps", taskHe: "הישאר בזמן שאתה מתרחק 10 צעדים" },
      { day: 5, exerciseId: "o2c", task: "Wait before eating meals", taskHe: "המתן לפני אכילת ארוחות" },
      { day: 6, exerciseId: "o1b", task: "Hold a Down-Stay for 1 minute", taskHe: "החזק שכיבה-הישאר לדקה" },
      { day: 7, exerciseId: "o2a", task: "Leave It with a toy bouncing nearby", taskHe: "עזוב את זה עם צעצוע קופץ בקרבת מקום" }
    ]
  },
  {
    id: "trick-week",
    name: "Trick Star Week",
    nameHe: "שבוע כוכב הטריקים",
    emoji: "🎪",
    description: "Learn a new trick every day!",
    descriptionHe: "!למד טריק חדש כל יום",
    color: "#F7DC6F",
    bonusXP: 250,
    badgeId: "challenge-trick-star",
    days: [
      { day: 1, exerciseId: "t1a", task: "Teach Shake/Paw", taskHe: "למד לתת יד" },
      { day: 2, exerciseId: "t1b", task: "Work on Spin", taskHe: "עבוד על סיבוב" },
      { day: 3, exerciseId: "t1c", task: "Practice Roll Over", taskHe: "תרגל התגלגלות" },
      { day: 4, exerciseId: "t2a", task: "Try Play Dead", taskHe: "נסה לשחק מת" },
      { day: 5, exerciseId: "t2b", task: "Learn Take a Bow", taskHe: "למד קידה" },
      { day: 6, exerciseId: "t2c", task: "Work on Crawl", taskHe: "עבוד על זחילה" },
      { day: 7, exerciseId: "t1a", task: "Show off! Chain 3 tricks in a row", taskHe: "!הופעה! שרשר 3 טריקים ברצף" }
    ]
  },
  {
    id: "leash-week",
    name: "Loose Leash Week",
    nameHe: "שבוע רצועה רופפת",
    emoji: "🦮",
    description: "Transform your walks in 7 days",
    descriptionHe: "שנה את ההליכות שלך ב-7 ימים",
    color: "#82E0AA",
    bonusXP: 200,
    badgeId: "challenge-leash-pro",
    days: [
      { day: 1, exerciseId: "lr1a", task: "Practice leash pressure indoors", taskHe: "תרגל לחץ רצועה בתוך הבית" },
      { day: 2, exerciseId: "lr1b", task: "Walk 50 steps without pulling", taskHe: "הלך 50 צעדים בלי משיכה" },
      { day: 3, exerciseId: "lr1c", task: "Change direction 10 times on a walk", taskHe: "שנה כיוון 10 פעמים בהליכה" },
      { day: 4, exerciseId: "lr2a", task: "Walk past a mild distraction", taskHe: "הלך ליד הסחה קלה" },
      { day: 5, exerciseId: "lr2b", task: "Practice auto-sit at crosswalks", taskHe: "תרגל ישיבה אוטומטית במעברי חציה" },
      { day: 6, exerciseId: "lr2c", task: "15-minute structured walk", taskHe: "הליכה מובנית של 15 דקות" },
      { day: 7, exerciseId: "lr1a", task: "Full walk with zero corrections needed", taskHe: "הליכה מלאה בלי תיקונים" }
    ]
  },
  {
    id: "puppy-basics-week",
    name: "Puppy Bootcamp",
    nameHe: "מחנה אימונים לגורים",
    emoji: "🐶",
    description: "The essential puppy starter challenge",
    descriptionHe: "אתגר הגורים הבסיסי",
    color: "#AED6F1",
    bonusXP: 200,
    badgeId: "challenge-puppy-grad",
    days: [
      { day: 1, exerciseId: "f1a", task: "Name recognition — 15 reps today", taskHe: "זיהוי שם — 15 חזרות היום" },
      { day: 2, exerciseId: "f1b", task: "Lure your puppy into a Sit", taskHe: "פתה את הגור לישיבה" },
      { day: 3, exerciseId: "f1c", task: "Capture a Down position", taskHe: "תפוס תנוחת שכיבה" },
      { day: 4, exerciseId: "f2a", task: "Practice Touch (nose to hand)", taskHe: "תרגל מגע (אף ליד)" },
      { day: 5, exerciseId: "f2b", task: "Work on Gentle (soft mouth)", taskHe: "עבוד על עדינות (פה רך)" },
      { day: 6, exerciseId: "f2c", task: "Build focus with eye contact game", taskHe: "בנה מיקוד עם משחק קשר עין" },
      { day: 7, exerciseId: "f1a", task: "Chain: Name → Sit → Touch → Treat!", taskHe: "!שרשרת: שם ← שב ← מגע ← חטיף" }
    ]
  },
  {
    id: "socialization-week",
    name: "Socialization Sprint",
    nameHe: "ספרינט חיברות",
    emoji: "🐕‍🦺",
    description: "Expose your dog to new experiences safely",
    descriptionHe: "חשוף את הכלב שלך לחוויות חדשות בבטחה",
    color: "#D7BDE2",
    bonusXP: 200,
    badgeId: "challenge-social-butterfly",
    days: [
      { day: 1, exerciseId: "s1a", task: "Introduce 3 new surfaces to walk on", taskHe: "הכר 3 משטחים חדשים ללכת עליהם" },
      { day: 2, exerciseId: "s1b", task: "Practice calm greetings with a person", taskHe: "תרגל ברכה רגועה עם אדם" },
      { day: 3, exerciseId: "s1c", task: "Play sounds at low volume during meals", taskHe: "נגן צלילים בעוצמה נמוכה בזמן ארוחות" },
      { day: 4, exerciseId: "s2a", task: "Watch dogs from a distance calmly", taskHe: "צפה בכלבים ממרחק ברוגע" },
      { day: 5, exerciseId: "s2b", task: "Visit a new environment for 10 min", taskHe: "בקר בסביבה חדשה ל-10 דקות" },
      { day: 6, exerciseId: "s2c", task: "Practice being handled (paws, ears, mouth)", taskHe: "תרגל מגע (כפות, אוזניים, פה)" },
      { day: 7, exerciseId: "s1a", task: "Adventure walk: 3 new experiences in one outing", taskHe: "הליכת הרפתקאות: 3 חוויות חדשות ביציאה אחת" }
    ]
  },
  {
    id: "fitness-week",
    name: "Canine Fitness Week",
    nameHe: "שבוע כושר לכלבים",
    emoji: "🏋️",
    description: "Build your dog's body and mind",
    descriptionHe: "בנה את הגוף והנפש של הכלב שלך",
    color: "#F1948A",
    bonusXP: 200,
    badgeId: "challenge-fitness-champ",
    days: [
      { day: 1, exerciseId: "cf1a", task: "Balance work on a pillow or cushion", taskHe: "עבודת שיווי משקל על כרית" },
      { day: 2, exerciseId: "cf1b", task: "5 minutes of structured play", taskHe: "5 דקות של משחק מובנה" },
      { day: 3, exerciseId: "cf1c", task: "Weave between your legs 10 times", taskHe: "תרגל שמיניות בין הרגליים 10 פעמים" },
      { day: 4, exerciseId: "cf2a", task: "Stair work: up and down 5 times slowly", taskHe: "עבודת מדרגות: למעלה ולמטה 5 פעמים לאט" },
      { day: 5, exerciseId: "cf2b", task: "Tug with rules (drop on command)", taskHe: "משיכת חבל עם כללים (שחרור בפקודה)" },
      { day: 6, exerciseId: "cf2c", task: "Back up: teach your dog to walk backward", taskHe: "אחורה: למד את הכלב ללכת לאחור" },
      { day: 7, exerciseId: "cf1a", task: "Obstacle course at home with household items", taskHe: "מסלול מכשולים בבית עם חפצי בית" }
    ]
  },
  {
    id: "crate-week",
    name: "Crate Comfort Week",
    nameHe: "שבוע נוחות בכלוב",
    emoji: "🏠",
    description: "Make the crate your dog's favorite place",
    descriptionHe: "הפוך את הכלוב למקום האהוב על הכלב שלך",
    color: "#85C1E9",
    bonusXP: 200,
    badgeId: "challenge-crate-lover",
    days: [
      { day: 1, exerciseId: "cr1a", task: "Toss treats into the crate 20 times", taskHe: "זרוק חטיפים לכלוב 20 פעמים" },
      { day: 2, exerciseId: "cr1b", task: "Feed a meal inside the crate", taskHe: "האכל ארוחה בתוך הכלוב" },
      { day: 3, exerciseId: "cr1c", task: "Close the door for 30 seconds while feeding", taskHe: "סגור את הדלת ל-30 שניות בזמן האכלה" },
      { day: 4, exerciseId: "cr2a", task: "Crate rest while you sit nearby for 5 min", taskHe: "מנוחה בכלוב בזמן שאתה יושב קרוב ל-5 דקות" },
      { day: 5, exerciseId: "cr2b", task: "Leave the room for 1 minute with dog in crate", taskHe: "עזוב את החדר לדקה עם הכלב בכלוב" },
      { day: 6, exerciseId: "cr2c", task: "Give a Kong in the crate and walk away", taskHe: "תן קונג בכלוב ולך" },
      { day: 7, exerciseId: "cr1a", task: "Dog chooses to rest in crate with door open", taskHe: "הכלב בוחר לנוח בכלוב עם דלת פתוחה" }
    ]
  },
  {
    id: "behavior-week",
    name: "Behavior Fix Week",
    nameHe: "שבוע תיקון התנהגות",
    emoji: "🧩",
    description: "Tackle common behavior problems",
    descriptionHe: "התמודד עם בעיות התנהגות נפוצות",
    color: "#F0B27A",
    bonusXP: 250,
    badgeId: "challenge-behavior-boss",
    days: [
      { day: 1, exerciseId: "b1a", task: "Practice 'Go to your place' 10 times", taskHe: "תרגל 'לך למקום שלך' 10 פעמים" },
      { day: 2, exerciseId: "b1b", task: "Redirect jumping with an alternative behavior", taskHe: "הפנה קפיצה להתנהגות חלופית" },
      { day: 3, exerciseId: "b1c", task: "Ignore barking, reward quiet — 5 reps", taskHe: "התעלם מנביחות, תגמל שקט — 5 חזרות" },
      { day: 4, exerciseId: "b2a", task: "Leave It with food on the counter", taskHe: "עזוב את זה עם אוכל על השיש" },
      { day: 5, exerciseId: "b2b", task: "Practice calm door greetings", taskHe: "תרגל ברכת דלת רגועה" },
      { day: 6, exerciseId: "b2c", task: "Settle on a mat during dinner", taskHe: "התיישבות על מזרן בזמן ארוחת ערב" },
      { day: 7, exerciseId: "b1a", task: "Full evening routine with zero problem behaviors", taskHe: "שגרת ערב מלאה בלי בעיות התנהגות" }
    ]
  },
  {
    id: "potty-week",
    name: "Potty Pro Week",
    nameHe: "שבוע מקצוען שירותים",
    emoji: "🚽",
    description: "Nail potty training once and for all",
    descriptionHe: "שלוט באימון שירותים אחת ולתמיד",
    color: "#A3E4D7",
    bonusXP: 200,
    badgeId: "challenge-potty-pro",
    days: [
      { day: 1, exerciseId: "pt1a", task: "Set a potty schedule — every 2 hours today", taskHe: "קבע לוח זמנים — כל שעתיים היום" },
      { day: 2, exerciseId: "pt1b", task: "Reward immediately after outdoor potty 5 times", taskHe: "תגמל מיד אחרי צרכים בחוץ 5 פעמים" },
      { day: 3, exerciseId: "pt1c", task: "Learn your dog's 'I need to go' signals", taskHe: "למד את הסימנים של 'אני צריך לצאת'" },
      { day: 4, exerciseId: "pt2a", task: "Zero accidents today — supervise constantly", taskHe: "אפס תאונות היום — פקח כל הזמן" },
      { day: 5, exerciseId: "pt2b", task: "Extend time between potty breaks by 30 min", taskHe: "הארך זמן בין הפסקות ב-30 דקות" },
      { day: 6, exerciseId: "pt2c", task: "Practice potty on command with a cue word", taskHe: "תרגל שירותים בפקודה עם מילת רמז" },
      { day: 7, exerciseId: "pt1a", task: "Full day with scheduled breaks and zero accidents", taskHe: "יום שלם עם הפסקות מתוכננות ואפס תאונות" }
    ]
  },
  {
    id: "focus-week",
    name: "Focus & Attention Week",
    nameHe: "שבוע ריכוז ותשומת לב",
    emoji: "🎯",
    description: "Build an unbreakable bond of attention",
    descriptionHe: "בנה קשר בלתי שביר של תשומת לב",
    color: "#C39BD3",
    bonusXP: 200,
    badgeId: "challenge-laser-focus",
    days: [
      { day: 1, exerciseId: "f1a", task: "Eye contact game — 20 reps", taskHe: "משחק קשר עין — 20 חזרות" },
      { day: 2, exerciseId: "f2c", task: "Watch Me for 10 seconds duration", taskHe: "הסתכל עליי למשך 10 שניות" },
      { day: 3, exerciseId: "o1a", task: "Name response from another room", taskHe: "תגובה לשם מחדר אחר" },
      { day: 4, exerciseId: "f2c", task: "Watch Me with treats on the floor", taskHe: "הסתכל עליי עם חטיפים על הרצפה" },
      { day: 5, exerciseId: "o1b", task: "Practice check-ins on a walk (look at you voluntarily)", taskHe: "תרגל צ'ק-אין בהליכה (מסתכל עליך מרצון)" },
      { day: 6, exerciseId: "f1a", task: "Focus through distractions — TV on, toys around", taskHe: "מיקוד דרך הסחות — טלוויזיה דלוקה, צעצועים סביב" },
      { day: 7, exerciseId: "o1a", task: "30-second sustained eye contact challenge", taskHe: "אתגר קשר עין של 30 שניות" }
    ]
  },
  {
    id: "adventure-week",
    name: "Adventure Week",
    nameHe: "שבוע הרפתקאות",
    emoji: "🌍",
    description: "Take your training to new places",
    descriptionHe: "קח את האימון שלך למקומות חדשים",
    color: "#FAD7A0",
    bonusXP: 250,
    badgeId: "challenge-adventurer",
    days: [
      { day: 1, exerciseId: "o1b", task: "Practice Sit in the front yard", taskHe: "תרגל שב בחצר הקדמית" },
      { day: 2, exerciseId: "o1c", task: "Down-Stay at a cafe or bench", taskHe: "שכיבה-הישאר בבית קפה או ספסל" },
      { day: 3, exerciseId: "o2a", task: "Recall at the park (on long leash)", taskHe: "חזרה בפארק (על רצועה ארוכה)" },
      { day: 4, exerciseId: "s2b", task: "Walk through a pet store calmly", taskHe: "הלך בחנות חיות ברוגע" },
      { day: 5, exerciseId: "lr2c", task: "Structured walk in a busy area", taskHe: "הליכה מובנית באזור עמוס" },
      { day: 6, exerciseId: "o2b", task: "Practice all basic commands at a friend's house", taskHe: "תרגל את כל הפקודות הבסיסיות בבית של חבר" },
      { day: 7, exerciseId: "o2c", task: "Full adventure: 3 locations, 3 commands each", taskHe: "הרפתקה מלאה: 3 מקומות, 3 פקודות בכל אחד" }
    ]
  }
];
```

**Important:** The exercise IDs above reference exercises from your existing programs. Claude Code should verify these IDs exist in `src/data/programs.js`. If any don't match, map them to the closest existing exercise. The daily task text is what matters — the exercise ID just links to the relevant exercise page for instructions.

---

## New Badges for Challenges

Add these to `src/data/badges.js`:

```javascript
// Challenge Badges — one per challenge type
{ id: "challenge-recall-master", name: "Recall Master", nameHe: "אלוף החזרה", emoji: "📣", description: "Completed Recall Master Week", descriptionHe: "השלמת שבוע שליטה בחזרה", category: "challenge" },
{ id: "challenge-patience-guru", name: "Patience Guru", nameHe: "גורו הסבלנות", emoji: "🧘", description: "Completed Patience & Impulse Control Week", descriptionHe: "השלמת שבוע סבלנות ושליטה עצמית", category: "challenge" },
{ id: "challenge-trick-star", name: "Trick Star", nameHe: "כוכב הטריקים", emoji: "🎪", description: "Completed Trick Star Week", descriptionHe: "השלמת שבוע כוכב הטריקים", category: "challenge" },
{ id: "challenge-leash-pro", name: "Leash Pro", nameHe: "מקצוען רצועה", emoji: "🦮", description: "Completed Loose Leash Week", descriptionHe: "השלמת שבוע רצועה רופפת", category: "challenge" },
{ id: "challenge-puppy-grad", name: "Puppy Graduate", nameHe: "בוגר גורים", emoji: "🐶", description: "Completed Puppy Bootcamp", descriptionHe: "השלמת מחנה אימונים לגורים", category: "challenge" },
{ id: "challenge-social-butterfly", name: "Social Butterfly", nameHe: "פרפר חברתי", emoji: "🐕‍🦺", description: "Completed Socialization Sprint", descriptionHe: "השלמת ספרינט חיברות", category: "challenge" },
{ id: "challenge-fitness-champ", name: "Fitness Champ", nameHe: "אלוף כושר", emoji: "🏋️", description: "Completed Canine Fitness Week", descriptionHe: "השלמת שבוע כושר לכלבים", category: "challenge" },
{ id: "challenge-crate-lover", name: "Crate Lover", nameHe: "אוהב הכלוב", emoji: "🏠", description: "Completed Crate Comfort Week", descriptionHe: "השלמת שבוע נוחות בכלוב", category: "challenge" },
{ id: "challenge-behavior-boss", name: "Behavior Boss", nameHe: "בוס התנהגות", emoji: "🧩", description: "Completed Behavior Fix Week", descriptionHe: "השלמת שבוע תיקון התנהגות", category: "challenge" },
{ id: "challenge-potty-pro", name: "Potty Pro", nameHe: "מקצוען שירותים", emoji: "🚽", description: "Completed Potty Pro Week", descriptionHe: "השלמת שבוע מקצוען שירותים", category: "challenge" },
{ id: "challenge-laser-focus", name: "Laser Focus", nameHe: "מיקוד לייזר", emoji: "🎯", description: "Completed Focus & Attention Week", descriptionHe: "השלמת שבוע ריכוז ותשומת לב", category: "challenge" },
{ id: "challenge-adventurer", name: "Adventurer", nameHe: "הרפתקן", emoji: "🌍", description: "Completed Adventure Week", descriptionHe: "השלמת שבוע הרפתקאות", category: "challenge" },

// Meta badges
{ id: "challenge-first-complete", name: "First Challenge!", nameHe: "!אתגר ראשון", emoji: "🏆", description: "Completed your first weekly challenge", descriptionHe: "השלמת את האתגר השבועי הראשון שלך", category: "challenge" },
{ id: "challenge-5-complete", name: "Challenge Veteran", nameHe: "ותיק אתגרים", emoji: "⭐", description: "Completed 5 weekly challenges", descriptionHe: "השלמת 5 אתגרים שבועיים", category: "challenge" },
{ id: "challenge-streak-3", name: "3 Weeks Strong", nameHe: "3 שבועות חזק", emoji: "🔥", description: "Completed 3 challenges in a row", descriptionHe: "השלמת 3 אתגרים ברצף", category: "challenge" },
{ id: "challenge-partial-hero", name: "Almost There!", nameHe: "!כמעט שם", emoji: "💪", description: "Completed 5+ days of a challenge", descriptionHe: "השלמת 5+ ימים של אתגר", category: "challenge" },
```

---

## UI Components to Build

### 1. Challenge Banner on Home Screen
Location: Below the daily tip, above the programs list.

```
┌─────────────────────────────────────────┐
│  🎪 THIS WEEK: Trick Star Week         │
│  ━━━━━━━━━━━━━━━━━━━━━━━ 3/7           │
│  Day 4: Try Play Dead                   │
│  [Start Today's Challenge →]            │
└─────────────────────────────────────────┘
```

- Shows the active challenge name, emoji, and progress (X/7 days)
- Shows today's task description
- Tap to navigate to the full challenge view
- Progress bar fills as days are completed
- Visually distinct from other home screen elements (use the challenge's color as accent)

### 2. Challenge View (Full Screen)
New component: `src/components/ChallengeView.jsx`

```
┌─────────────────────────────────────────┐
│  ← Back                                 │
│                                         │
│  🎪 Trick Star Week                     │
│  "Learn a new trick every day!"         │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━ 3/7           │
│  🏆 Reward: Trick Star badge + 250 XP   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ✅ Day 1: Teach Shake/Paw      │    │
│  │ ✅ Day 2: Work on Spin         │    │
│  │ ✅ Day 3: Practice Roll Over   │    │
│  │ 🔵 Day 4: Try Play Dead  [GO] │    │
│  │ ⚪ Day 5: Learn Take a Bow     │    │
│  │ ⚪ Day 6: Work on Crawl        │    │
│  │ ⚪ Day 7: Chain 3 tricks!      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ⏳ 3 days remaining                    │
└─────────────────────────────────────────┘
```

- Each day shows: status icon (✅ done / 🔵 today / ⚪ upcoming / ❌ missed), task description, and a [GO] button for today's task
- [GO] navigates to the exercise page for that day's exercise
- Past days that weren't completed show as ❌ but don't block progress
- Today's day is highlighted/expanded
- Show days remaining and bonus XP reward

### 3. Challenge Completion Celebration
When user completes all 7 days (or 5+ for partial):
- Full-screen celebration animation (similar to badge unlock)
- Show badge earned + XP gained
- "Share" button (same as milestone cards)
- "Next Week's Challenge: [preview]" teaser

### 4. Challenge History
Add a "Challenges" tab or section in Profile:
- List of completed challenges with badges
- Current streak (consecutive weeks completed)
- Stats: total challenges completed, current streak, best streak

---

## Data Storage (localStorage)

Add to the dog's data object:

```javascript
challenges: {
  // Track progress for current challenge
  active: {
    challengeId: "trick-week",
    weekNumber: 7,
    startDate: "2026-02-10",
    completedDays: [1, 2, 3],  // day numbers completed
  },
  // History of completed challenges
  history: [
    {
      challengeId: "recall-week",
      weekNumber: 5,
      completedDays: [1, 2, 3, 4, 5, 6, 7],
      completedAt: "2026-02-02",
      badgeEarned: "challenge-recall-master",
      xpEarned: 200,
      fullComplete: true  // all 7 days
    }
  ],
  // Stats
  stats: {
    totalCompleted: 3,
    currentStreak: 2,
    bestStreak: 2
  }
}
```

---

## Logic Rules

1. **Which challenge is active:** `CHALLENGES[getWeekNumber(today) % CHALLENGES.length]`
2. **Which day is today:** Day = dayOfWeek where Monday=1, Sunday=7
3. **Can complete a day:** Only today's day can be completed. Past days cannot be retroactively completed.
4. **Completing a day:** When user completes the associated exercise, automatically mark the challenge day as done. Also: mark the day done when user taps a "Complete" button on the challenge day itself (some tasks like "zero accidents today" can't be tracked by exercise completion alone).
5. **Challenge completion:** When day 7 passes (or Sunday midnight), evaluate: 7/7 = full badge + full XP, 5-6/7 = partial badge + 75% XP, <5/7 = no badge but XP for each day completed (25 XP per day)
6. **New week:** On Monday, auto-start next challenge. Archive the previous one to history.
7. **Week calculation helper:**

```javascript
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}
```

---

## Hebrew Translations

Add all translations to the Hebrew language file. Key translations:

- "This Week's Challenge" → "האתגר השבועי"
- "Day" → "יום"
- "days remaining" → "ימים נותרו"
- "Challenge Complete!" → "!האתגר הושלם"
- "Start Today's Challenge" → "התחל את אתגר היום"
- "Completed" → "הושלם"
- "Missed" → "פספס"
- "Today" → "היום"
- "Upcoming" → "קרוב"
- "Challenge History" → "היסטוריית אתגרים"
- "Current Streak" → "רצף נוכחי"
- "Best Streak" → "הרצף הטוב ביותר"
- "weeks" → "שבועות"
- "Partial Completion" → "השלמה חלקית"
- "Full Completion" → "השלמה מלאה"
- "Bonus XP" → "XP בונוס"

---

## Design Guidelines

- Follow the existing PawPath dark theme exactly
- Use the challenge's `color` field as the accent color for that challenge's UI
- Cards should have the same border radius, padding, and surface colors as existing components
- Progress bar style should match the existing program progress bars
- Animations should be smooth and consistent with existing app feel
- The challenge banner on Home should feel prominent but not overwhelming — it's a feature, not an ad
- RTL support for all Hebrew text

---

## Navigation

- Home screen → tap challenge banner → ChallengeView
- ChallengeView → tap [GO] on today's day → ExerciseView (with that exercise)
- After completing an exercise that matches today's challenge day → auto-mark challenge day as complete → show a small toast/notification: "Challenge Day 4 ✅ — 3 more to go!"
- Profile → Challenge History section

---

## Claude Code Prompt

Drop this file into your PawPath project folder, then paste this into Claude Code:

```
Read phase3a-build1-weekly-challenges.md and implement the Weekly Challenges system exactly as specified. This includes:

1. Create src/data/challenges.js with all 12 challenge definitions
2. Add 16 new challenge badges to src/data/badges.js  
3. Create src/components/ChallengeView.jsx (full challenge screen)
4. Add Challenge Banner component to the Home screen (below daily tip, above programs)
5. Add challenge progress tracking to localStorage (per-dog, under challenges key)
6. Wire up challenge day completion — both via exercise completion AND manual "complete" button
7. Add challenge celebration screen when a challenge is fully completed
8. Add Challenge History section to Profile page
9. Add all Hebrew translations
10. Verify all exercise IDs in challenge days exist in programs.js — fix any that don't match
11. Test: the current week should show a challenge on Home, tapping it should open ChallengeView, completing today's task should update progress

Match existing dark theme, animations, and component patterns. Full RTL support for Hebrew.
```

Then push:
```
git add .
git commit -m "Phase 3A: Weekly Challenges & Themed Events"
git push
```
