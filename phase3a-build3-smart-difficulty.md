# PawPath Phase 3A — Build 3: Smart Difficulty Adjustment

## Overview

Detect when a dog is struggling with an exercise and automatically suggest easier prerequisites. The system tracks repeated incomplete sessions, low ratings, and short session durations to identify difficulty. When triggered, it surfaces a helpful, encouraging suggestion — never punishing.

---

## How It Works

### Struggle Detection

The system monitors three signals per exercise per dog:

1. **Incomplete sessions** — User starts an exercise but doesn't mark it complete (backs out early)
2. **Low ratings** — If the app tracks session ratings, a rating of 1-2 out of 5
3. **Short duration** — Session completed in under 30% of the suggested duration (rushed through without real practice)

### Trigger Thresholds

```javascript
export const DIFFICULTY_CONFIG = {
  // How many signals before we suggest help
  incompleteThreshold: 3,    // 3 incomplete attempts on same exercise
  lowRatingThreshold: 2,     // 2 sessions rated 1-2 stars
  shortDurationThreshold: 3, // 3 sessions under 30% of suggested time

  // Cooldown: don't show another suggestion for this exercise for X days
  suggestionCooldownDays: 7,

  // Don't show suggestions for the first X sessions ever (let user get comfortable)
  minTotalSessions: 5,
};
```

### What Happens When Triggered

1. A gentle **"Need Help?" card** appears on the exercise page
2. The card suggests 1-2 **prerequisite exercises** that build the foundation skills
3. Optionally suggests **tips specific to the struggle** (e.g., "Try shorter distances first")
4. The suggestion is **dismissible** — user can say "I'm fine, thanks"
5. If dismissed, don't show again for that exercise for 7 days

---

## Exercise Prerequisite Map

Create a new file: `src/data/exercisePrerequisites.js`

This maps each exercise to its prerequisites — the simpler exercises that build the skills needed.

```javascript
export const EXERCISE_PREREQUISITES = {
  // === PUPPY FOUNDATIONS ===
  // Level 1 exercises have no prerequisites (they ARE the foundations)
  "f1a": { prerequisites: [], tips: null },  // Name Recognition
  "f1b": { prerequisites: [], tips: null },  // Sit
  "f1c": { prerequisites: [], tips: null },  // Down

  // Level 2 builds on Level 1
  "f2a": {  // Touch
    prerequisites: ["f1a"],  // Needs name recognition first
    tips: {
      en: "If your dog won't touch your hand, try rubbing a treat on your palm first. Start with your hand just 2 inches from their nose.",
      he: "אם הכלב לא נוגע ביד שלך, נסה לשפשף חטיף על כף היד. התחל עם היד רק 5 ס\"מ מהאף שלו."
    }
  },
  "f2b": {  // Gentle / Soft Mouth
    prerequisites: ["f1b"],  // Needs basic sit (impulse control)
    tips: {
      en: "If your dog is mouthy, freeze completely when teeth touch skin. Only reward when they use a soft mouth.",
      he: "אם הכלב נושך, קפא לגמרי כשהשיניים נוגעות בעור. תגמל רק כשהוא משתמש בפה רך."
    }
  },
  "f2c": {  // Focus / Eye Contact
    prerequisites: ["f1a"],  // Needs name recognition
    tips: {
      en: "Start in a boring room with zero distractions. Hold a treat by your eye to lure their gaze, then mark and reward.",
      he: "התחל בחדר משעמם בלי הסחות. החזק חטיף ליד העין שלך כדי למשוך את המבט, ואז סמן ותגמל."
    }
  },

  // === CORE OBEDIENCE ===
  "o1a": {  // Come / Recall basics
    prerequisites: ["f1a", "f2c"],  // Name recognition + focus
    tips: {
      en: "Never call your dog to you for something unpleasant. Make every recall a party! Start on a long leash indoors.",
      he: "לעולם אל תקרא לכלב אליך למשהו לא נעים. הפוך כל חזרה למסיבה! התחל על רצועה ארוכה בתוך הבית."
    }
  },
  "o1b": {  // Sit-Stay
    prerequisites: ["f1b"],  // Needs solid sit
    tips: {
      en: "If your dog breaks the stay immediately, you're asking for too much too fast. Start with 2-second stays and build up slowly.",
      he: "אם הכלב שובר את ההישארות מיד, אתה מבקש יותר מדי מהר מדי. התחל עם הישארות של 2 שניות והתקדם לאט."
    }
  },
  "o1c": {  // Down-Stay
    prerequisites: ["f1c", "o1b"],  // Needs down + sit-stay concept
    tips: {
      en: "Down-Stay is harder than Sit-Stay because dogs feel more vulnerable lying down. Build confidence with short durations and stay close.",
      he: "שכיבה-הישאר קשה יותר משב-הישאר כי כלבים מרגישים פגיעים יותר בשכיבה. בנה ביטחון עם משכים קצרים והישאר קרוב."
    }
  },
  "o2a": {  // Leave It
    prerequisites: ["f1b", "f2c"],  // Sit + focus (impulse control)
    tips: {
      en: "Start with a treat in your closed fist. Only open when the dog looks away. The key is rewarding the decision NOT to grab.",
      he: "התחל עם חטיף ביד סגורה. פתח רק כשהכלב מסתכל הצידה. המפתח הוא לתגמל את ההחלטה לא לתפוס."
    }
  },
  "o2b": {  // Stay with Distance
    prerequisites: ["o1b", "o1c"],  // Sit-stay + down-stay
    tips: {
      en: "Add distance in tiny increments — one step at a time. If your dog breaks, you moved too far too fast. Go back to the last successful distance.",
      he: "הוסף מרחק בתוספות זעירות — צעד אחד בכל פעם. אם הכלב שובר, התרחקת יותר מדי מהר. חזור למרחק המוצלח האחרון."
    }
  },
  "o2c": {  // Chain Commands
    prerequisites: ["o1a", "o1b", "o2a"],  // Recall + stay + leave it
    tips: {
      en: "Only chain commands your dog knows individually at 80%+ success rate. If chaining fails, go back and strengthen the weakest individual command.",
      he: "שרשר רק פקודות שהכלב מכיר בנפרד בשיעור הצלחה של 80%+. אם השרשור נכשל, חזור וחזק את הפקודה הבודדת החלשה ביותר."
    }
  },

  // === TRICK TRAINING ===
  "t1a": {  // Shake / Paw
    prerequisites: ["f1b"],  // Sit
    tips: {
      en: "If your dog won't lift their paw, try tickling the back of their leg gently. Capture any paw movement and reward.",
      he: "אם הכלב לא מרים את הכף, נסה לדגדג בעדינות את גב הרגל. תפוס כל תנועת כף ותגמל."
    }
  },
  "t1b": {  // Spin
    prerequisites: ["f2a"],  // Touch (lure following)
    tips: {
      en: "Use a treat to lure a full circle. If your dog stops halfway, reward half-circles first, then gradually lure the full spin.",
      he: "השתמש בחטיף לפיתוי סיבוב מלא. אם הכלב עוצר באמצע, תגמל חצי סיבובים קודם, ואז פתה סיבוב מלא בהדרגה."
    }
  },
  "t1c": {  // Roll Over
    prerequisites: ["f1c", "t1b"],  // Down + spin (body awareness)
    tips: {
      en: "Start from a Down. Lure the nose toward the shoulder — the body follows. Some dogs need this broken into 3 stages.",
      he: "התחל משכיבה. פתה את האף לכיוון הכתף — הגוף עוקב. חלק מהכלבים צריכים לחלק את זה ל-3 שלבים."
    }
  },
  "t2a": {  // Play Dead
    prerequisites: ["f1c", "t1c"],  // Down + roll over
    tips: {
      en: "This is an extension of Roll Over — stop at the 'on side' position. Reward for stillness, not movement.",
      he: "זהו הרחבה של התגלגלות — עצור בתנוחת 'על הצד'. תגמל על שקט, לא על תנועה."
    }
  },
  "t2b": {  // Take a Bow
    prerequisites: ["f1c"],  // Down (partial)
    tips: {
      en: "The trick is getting the front down without the back following. Hold a treat under their chin and use your arm under their belly to keep the rear up.",
      he: "הטריק הוא להוריד את החזית בלי שהאחוריים עוקבים. החזק חטיף מתחת לסנטר והשתמש ביד מתחת לבטן כדי לשמור על האחוריים למעלה."
    }
  },
  "t2c": {  // Crawl
    prerequisites: ["f1c", "o1c"],  // Down + down-stay
    tips: {
      en: "Start in a Down. Lure the nose forward along the ground very slowly. If they stand up, you're luring too fast or too high.",
      he: "התחל משכיבה. פתה את האף קדימה לאורך הרצפה לאט מאוד. אם הם קמים, אתה מפתה מהר מדי או גבוה מדי."
    }
  },

  // === BEHAVIOR SOLUTIONS ===
  "b1a": {  // Go to Place
    prerequisites: ["f1c", "o1b"],  // Down + stay
    tips: {
      en: "Start by rewarding any interaction with the mat — stepping on it, looking at it. Build up to lying down on it before adding 'stay'.",
      he: "התחל בתגמול כל אינטראקציה עם המזרן — דריכה עליו, הסתכלות עליו. בנה עד שכיבה עליו לפני שמוסיפים 'הישאר'."
    }
  },
  "b1b": {  // No Jumping
    prerequisites: ["f1b", "o2a"],  // Sit + leave it (impulse control)
    tips: {
      en: "The fix isn't punishing the jump — it's rewarding the alternative. Ask for a Sit before any greeting. No attention until all four paws are on the ground.",
      he: "התיקון הוא לא להעניש את הקפיצה — אלא לתגמל את החלופה. בקש שב לפני כל ברכה. בלי תשומת לב עד שכל ארבע הכפות על הרצפה."
    }
  },
  "b1c": {  // Quiet (no barking)
    prerequisites: ["f1a", "f2c"],  // Name recognition + focus
    tips: {
      en: "Don't yell 'quiet' — that sounds like barking to your dog. Instead, wait for a pause in barking, mark it, and reward. Teach a 'quiet' cue from silence.",
      he: "אל תצעק 'שקט' — זה נשמע כמו נביחה לכלב שלך. במקום זאת, חכה להפסקה בנביחות, סמן ותגמל. למד פקודת 'שקט' מתוך שקט."
    }
  },
  "b2a": {  // Counter Surfing / Leave It Advanced
    prerequisites: ["o2a", "b1a"],  // Leave it + go to place
    tips: {
      en: "Management first: don't leave food unattended on counters while training. Teach a strong 'Leave It' at a distance, then add the counter scenario.",
      he: "ניהול קודם: אל תשאיר אוכל ללא השגחה על השיש בזמן אימון. למד 'עזוב את זה' חזק ממרחק, ואז הוסף את תרחיש השיש."
    }
  },
  "b2b": {  // Door Manners
    prerequisites: ["o1b", "o2a"],  // Stay + leave it
    tips: {
      en: "Practice with the door first — open it 1 inch. If dog moves, close it. Only open wider when they hold their stay. The door opening is the reward.",
      he: "תרגל עם הדלת קודם — פתח אותה סנטימטר אחד. אם הכלב זז, סגור. פתח רחב יותר רק כשהם מחזיקים הישארות. פתיחת הדלת היא התגמול."
    }
  },
  "b2c": {  // Settle on Mat
    prerequisites: ["b1a", "o1c"],  // Go to place + down-stay
    tips: {
      en: "This is 'Go to Place' + duration. Start during calm moments, not exciting ones. Build up to settling during dinner over multiple sessions.",
      he: "זה 'לך למקום' + משך זמן. התחל ברגעים רגועים, לא מרגשים. בנה עד להתיישבות בזמן ארוחת ערב על פני מספר אימונים."
    }
  },

  // === LEASH REACTIVITY ===
  "lr1a": {  // Leash Pressure
    prerequisites: ["f1a", "f2c"],  // Name recognition + focus
    tips: {
      en: "Teach your dog that leash pressure means 'come toward me, not pull away.' Start indoors with zero distractions.",
      he: "למד את הכלב שלחץ רצועה אומר 'בוא לכיווני, לא תמשוך הצידה.' התחל בתוך הבית בלי הסחות."
    }
  },
  "lr1b": {  // Loose Leash Walking Basics
    prerequisites: ["lr1a", "f2c"],  // Leash pressure + focus
    tips: {
      en: "Stop every single time the leash goes tight. Wait for slack, then continue. It's tedious but this IS the training.",
      he: "עצור כל פעם שהרצועה נמתחת. חכה לרפיון, ואז המשך. זה מייגע אבל זה הוא האימון."
    }
  },
  "lr1c": {  // Direction Changes
    prerequisites: ["lr1a"],
    tips: {
      en: "Change direction BEFORE the leash goes tight. Make it a game — be unpredictable so your dog learns to watch you.",
      he: "שנה כיוון לפני שהרצועה נמתחת. הפוך את זה למשחק — היה בלתי צפוי כדי שהכלב ילמד לעקוב אחריך."
    }
  },
  "lr2a": {  // Walking Past Distractions
    prerequisites: ["lr1b", "o2a"],  // Loose leash + leave it
    tips: {
      en: "Increase distance from the distraction. If your dog reacts at 10 feet, practice at 20 feet first. Gradually close the gap over days.",
      he: "הגדל מרחק מההסחה. אם הכלב מגיב מ-3 מטר, תרגל מ-6 מטר קודם. צמצם את הפער בהדרגה על פני ימים."
    }
  },
  "lr2b": {  // Auto-Sit at Stops
    prerequisites: ["f1b", "lr1b"],  // Sit + loose leash
    tips: {
      en: "Every time you stop, wait silently. When your dog sits (they will), mark and reward. Never ask for the sit — let them offer it.",
      he: "כל פעם שאתה עוצר, חכה בשקט. כשהכלב יושב (הוא ישב), סמן ותגמל. לעולם אל תבקש את הישיבה — תן לו להציע אותה."
    }
  },
  "lr2c": {  // Structured Walk
    prerequisites: ["lr1b", "lr2a", "lr2b"],  // All leash skills
    tips: {
      en: "A structured walk combines everything: loose leash, auto-sits at stops, ignoring distractions. Keep it to 15 minutes max at first.",
      he: "הליכה מובנית משלבת הכל: רצועה רופפת, ישיבה אוטומטית בעצירות, התעלמות מהסחות. הגבל ל-15 דקות מקסימום בהתחלה."
    }
  },

  // === POTTY TRAINING ===
  "pt1a": {  // Schedule Setting
    prerequisites: [],
    tips: {
      en: "Puppies need to go out: after waking, after eating, after playing, and every 2 hours in between. Set phone alarms.",
      he: "גורים צריכים לצאת: אחרי שהתעוררו, אחרי אכילה, אחרי משחק, וכל שעתיים ביניהם. קבע התראות בטלפון."
    }
  },
  "pt1b": {  // Reward Timing
    prerequisites: ["pt1a"],
    tips: {
      en: "The treat must happen OUTSIDE, immediately after they finish. Not when they come back inside — that rewards coming inside, not pottying outside.",
      he: "החטיף חייב להינתן בחוץ, מיד אחרי שסיימו. לא כשחוזרים פנימה — זה מתגמל חזרה פנימה, לא עשיית צרכים בחוץ."
    }
  },
  "pt1c": {  // Reading Signals
    prerequisites: ["pt1a"],
    tips: {
      en: "Common signals: circling, sniffing the ground intensely, going to the door, whining, squatting. Learn YOUR dog's specific tells.",
      he: "סימנים נפוצים: סיבוב, הרחה אינטנסיבית של הרצפה, הליכה לדלת, יללה, כריעה. למד את הסימנים הספציפיים של הכלב שלך."
    }
  },
  "pt2a": {  // Supervision
    prerequisites: ["pt1a", "pt1c"],
    tips: {
      en: "If you can't watch the puppy, crate them or tether them to you. Every accident that happens unsupervised is a missed training opportunity.",
      he: "אם אתה לא יכול לפקח על הגור, שים אותו בכלוב או קשור אותו אליך. כל תאונה שקורה ללא פיקוח היא הזדמנות אימון שהוחמצה."
    }
  },
  "pt2b": {  // Extending Time
    prerequisites: ["pt2a"],
    tips: {
      en: "Only extend time between breaks after 3+ accident-free days at the current interval. Add 30 minutes at a time.",
      he: "הארך זמן בין הפסקות רק אחרי 3+ ימים ללא תאונות במרווח הנוכחי. הוסף 30 דקות בכל פעם."
    }
  },
  "pt2c": {  // Potty on Command
    prerequisites: ["pt1b"],
    tips: {
      en: "Pick a cue word ('go potty', 'hurry up') and say it WHILE they're going, not before. After weeks of pairing, they'll learn to go on cue.",
      he: "בחר מילת פקודה ('עשה צרכים', 'מהר') ואמור אותה בזמן שהם עושים, לא לפני. אחרי שבועות של שיוך, הם ילמדו לעשות בפקודה."
    }
  },

  // === CRATE TRAINING ===
  "cr1a": {  // Crate Introduction
    prerequisites: [],
    tips: {
      en: "Never force your dog into the crate. Toss high-value treats in and let them choose to enter. Make it the best place in the house.",
      he: "לעולם אל תכריח את הכלב להיכנס לכלוב. זרוק חטיפים איכותיים פנימה ותן להם לבחור להיכנס. הפוך אותו למקום הכי טוב בבית."
    }
  },
  "cr1b": {  // Meals in Crate
    prerequisites: ["cr1a"],
    tips: {
      en: "Feed every meal inside the crate. Start with the bowl at the entrance, gradually move it deeper over days.",
      he: "האכל כל ארוחה בתוך הכלוב. התחל עם הקערה בכניסה, הזז אותה פנימה בהדרגה על פני ימים."
    }
  },
  "cr1c": {  // Door Closed Short
    prerequisites: ["cr1b"],
    tips: {
      en: "Close the door only while they're eating. Open it before they finish at first. Gradually extend to staying closed 30 seconds after finishing.",
      he: "סגור את הדלת רק בזמן שהם אוכלים. פתח אותה לפני שהם מסיימים בהתחלה. הארך בהדרגה לסגירה של 30 שניות אחרי שסיימו."
    }
  },
  "cr2a": {  // Crate Rest Nearby
    prerequisites: ["cr1c"],
    tips: {
      en: "Sit next to the crate and read or scroll your phone. Your calm presence teaches them the crate is a rest place, not isolation.",
      he: "שב ליד הכלוב וקרא או גלול בטלפון. הנוכחות הרגועה שלך מלמדת אותם שהכלוב הוא מקום מנוחה, לא בידוד."
    }
  },
  "cr2b": {  // Brief Absence
    prerequisites: ["cr2a"],
    tips: {
      en: "Leave for 1 minute, return calmly (don't make a fuss). Gradually extend. If whining starts, wait for 3 seconds of silence before returning.",
      he: "עזוב לדקה, חזור ברוגע (בלי לעשות עניין). הארך בהדרגה. אם מתחילה יללה, חכה ל-3 שניות של שקט לפני שחוזרים."
    }
  },
  "cr2c": {  // Kong in Crate
    prerequisites: ["cr2a"],
    tips: {
      en: "A frozen Kong filled with peanut butter or wet food is the ultimate crate activity. It builds positive crate association while keeping them busy.",
      he: "קונג קפוא מלא בחמאת בוטנים או מזון רטוב הוא הפעילות האולטימטיבית בכלוב. זה בונה אסוציאציה חיובית ושומר אותם עסוקים."
    }
  },

  // === PUPPY SOCIALIZATION ===
  "s1a": {  // Surface Exposure
    prerequisites: [],
    tips: {
      en: "Let your puppy explore at their own pace. Never force them onto a surface — reward any voluntary interaction, even a sniff.",
      he: "תן לגור לחקור בקצב שלו. לעולם אל תכריח אותו על משטח — תגמל כל אינטראקציה מרצון, אפילו הרחה."
    }
  },
  "s1b": {  // Calm Greetings
    prerequisites: ["f1b"],  // Sit
    tips: {
      en: "Ask the person to approach only when your puppy is calm. If the puppy gets excited, the person walks away. Calm = people come closer.",
      he: "בקש מהאדם להתקרב רק כשהגור רגוע. אם הגור מתרגש, האדם הולך. רגוע = אנשים מתקרבים."
    }
  },
  "s1c": {  // Sound Desensitization
    prerequisites: [],
    tips: {
      en: "Play sounds (thunder, fireworks, traffic) at very low volume during meals. Gradually increase volume over weeks. Never start loud.",
      he: "נגן צלילים (רעמים, זיקוקים, תנועה) בעוצמה נמוכה מאוד בזמן ארוחות. הגבר בהדרגה על פני שבועות. לעולם אל תתחיל חזק."
    }
  },
  "s2a": {  // Dog Observation
    prerequisites: ["s1a", "f2c"],  // Surface comfort + focus
    tips: {
      en: "Watch dogs from a comfortable distance where your puppy notices them but isn't overwhelmed. Reward calm observation with treats.",
      he: "צפו בכלבים ממרחק נוח שבו הגור שם לב אליהם אבל לא מוצף. תגמל צפייה רגועה בחטיפים."
    }
  },
  "s2b": {  // New Environments
    prerequisites: ["s1a", "s1c"],
    tips: {
      en: "Keep first visits short (10 min). Let your puppy observe from a safe distance. Bring high-value treats. Leave before they get overwhelmed.",
      he: "שמור על ביקורים ראשונים קצרים (10 דקות). תן לגור להתבונן ממרחק בטוח. הבא חטיפים איכותיים. עזוב לפני שהם מוצפים."
    }
  },
  "s2c": {  // Handling
    prerequisites: [],
    tips: {
      en: "Touch paws, ears, mouth gently for 1-2 seconds, then treat. Build up duration slowly. This prepares them for vet visits and grooming.",
      he: "גע בכפות, אוזניים, פה בעדינות למשך 1-2 שניות, ואז חטיף. בנה משך זמן לאט. זה מכין אותם לביקורי וטרינר וטיפוח."
    }
  },

  // === CANINE FITNESS ===
  "cf1a": {  // Balance Work
    prerequisites: ["f1b"],  // Sit (body awareness)
    tips: {
      en: "Start with a flat pillow on the floor. Lure your dog to step on it. Reward any paw contact. Gradually upgrade to wobble surfaces.",
      he: "התחל עם כרית שטוחה על הרצפה. פתה את הכלב לדרוך עליה. תגמל כל מגע כף. שדרג בהדרגה למשטחים מתנדנדים."
    }
  },
  "cf1b": {  // Structured Play
    prerequisites: [],
    tips: {
      en: "Play with rules: sit before throwing the ball, drop it to get another throw. This builds impulse control while exercising.",
      he: "משחק עם כללים: שב לפני זריקת הכדור, שחרר כדי לקבל זריקה נוספת. זה בונה שליטה עצמית תוך כדי פעילות גופנית."
    }
  },
  "cf1c": {  // Weaving
    prerequisites: ["f2a"],  // Touch (lure following)
    tips: {
      en: "Stand with legs wide. Lure your dog through in a figure-8. Start slow — this builds body awareness and flexibility.",
      he: "עמוד עם רגליים רחוקות. פתה את הכלב לעבור בשמינייה. התחל לאט — זה בונה מודעות גוף וגמישות."
    }
  },
  "cf2a": {  // Stair Work
    prerequisites: ["cf1a"],  // Balance
    tips: {
      en: "Go slow! This is about controlled movement, not speed. One step at a time, treat at each step. Skip this for puppies under 6 months.",
      he: "לך לאט! מדובר בתנועה מבוקרת, לא מהירות. מדרגה אחת בכל פעם, חטיף בכל מדרגה. דלג על זה לגורים מתחת ל-6 חודשים."
    }
  },
  "cf2b": {  // Tug with Rules
    prerequisites: ["o2a"],  // Leave it (drop on command)
    tips: {
      en: "Rules: you start the game, you end the game. 'Drop it' ends the round. No teeth on hands — game stops immediately if it happens.",
      he: "כללים: אתה מתחיל את המשחק, אתה מסיים. 'שחרר' מסיים את הסיבוב. בלי שיניים על ידיים — המשחק נעצר מיד אם זה קורה."
    }
  },
  "cf2c": {  // Back Up
    prerequisites: ["f1b", "f2a"],  // Sit + touch
    tips: {
      en: "Stand facing your dog. Step toward them slowly. Most dogs will naturally step back. Mark and reward any backward movement.",
      he: "עמוד מול הכלב. צעד לעברו לאט. רוב הכלבים יצעדו אחורה באופן טבעי. סמן ותגמל כל תנועה אחורה."
    }
  }
};
```

---

## Struggle Tracking Data

Add to the dog's localStorage data (or Supabase later):

```javascript
difficultyTracking: {
  // Per exercise tracking
  exercises: {
    "o1b": {
      incompleteCount: 3,     // times started but not completed
      lowRatingCount: 1,      // times rated 1-2 stars
      shortSessionCount: 2,   // times completed in <30% of suggested duration
      lastSuggestionDate: "2026-02-10",  // when we last showed a suggestion
      dismissed: false,       // user dismissed the help card
      totalAttempts: 8,       // total times this exercise was started
    }
  }
}
```

---

## UI Components

### 1. Struggle Detection Card (on Exercise Page)

When thresholds are met, show this card above the exercise instructions:

```
┌─────────────────────────────────────────┐
│  💡 Need a hand with Sit-Stay?          │
│                                         │
│  This one can be tricky! Try            │
│  strengthening these skills first:      │
│                                         │
│  ┌──────────────────────────────┐       │
│  │ 🐾 Sit (Puppy Foundations)   │ [GO]  │
│  │    Build a solid sit first   │       │
│  └──────────────────────────────┘       │
│                                         │
│  💬 Tip: If your dog breaks the stay    │
│  immediately, you're asking for too     │
│  much too fast. Start with 2-second     │
│  stays and build up slowly.             │
│                                         │
│  [Got it, thanks!]  [Show exercises]    │
└─────────────────────────────────────────┘
```

- Card appears with a smooth slide-down animation
- "Got it, thanks!" dismisses for 7 days
- "Show exercises" navigates to the prerequisite exercise
- [GO] button on each prerequisite takes you directly to that exercise
- Card uses a warm, helpful color (soft yellow/amber accent) — not red/warning
- Tone is always encouraging: "This one can be tricky!" not "You're struggling"

### 2. Prerequisite Progress Indicator

On the suggestion card, show if the user has already completed the prerequisite:

```
┌──────────────────────────────────┐
│ ✅ Sit (Puppy Foundations)       │  Already done!
│ ⚪ Focus (Puppy Foundations)     │ [GO] Recommended
└──────────────────────────────────┘
```

If all prerequisites are completed, change the message:
```
"You've mastered the prerequisites! Sometimes it just takes 
more repetitions. Try shorter sessions — 3 minutes is plenty."
```

### 3. Smart Daily Plan Integration

When the difficulty system detects a struggle, the Daily Plan can:
- Move the struggling exercise down in priority
- Add its prerequisites higher in the plan
- Show a subtle label: "Foundation skill for Sit-Stay" next to the prerequisite

### 4. Session Tracking Enhancement

After completing an exercise, if the difficulty system is tracking it:
- Show a quick mood check: "How did that go?" with 3 options:
  - 😊 "Nailed it!"
  - 😐 "Getting there"
  - 😕 "Still tricky"
- This feeds into the struggle detection (😕 = low rating equivalent)
- Simple, fast, non-intrusive — single tap

---

## Logic Rules

1. **Only activate after user has completed 5+ total sessions** across all exercises. Don't overwhelm new users.
2. **Struggle is per-exercise, per-dog.** Dog 1 struggling with Sit-Stay doesn't affect Dog 2.
3. **Suggestion triggers** when ANY threshold is met:
   - `incompleteCount >= 3` OR
   - `lowRatingCount >= 2` OR
   - `shortSessionCount >= 3`
4. **Cooldown:** After dismissing, don't show again for 7 days for that exercise.
5. **Auto-clear:** If the user successfully completes the exercise 3 times in a row after a suggestion, reset the struggle counters.
6. **Track incomplete sessions:** When a user opens an exercise and navigates away without completing → increment `incompleteCount`. But only if they were on the exercise page for >10 seconds (ignore accidental taps).
7. **Prerequisites chain:** If exercise A's prerequisite B also has prerequisites, only suggest B (one level deep). Don't overwhelm with a full skill tree.
8. **No nagging:** Maximum 1 suggestion visible at a time across the whole app. If multiple exercises are flagged, prioritize the one the user attempted most recently.

---

## Hebrew Translations

```javascript
// Difficulty system translations
needAHand: "?צריך עזרה עם",
thisOneCanBeTricky: "!זה יכול להיות מאתגר",
tryTheseFirst: ":נסה לחזק את הכישורים האלה קודם",
gotItThanks: "!הבנתי, תודה",
showExercises: "הצג תרגילים",
alreadyDone: "!כבר בוצע",
recommended: "מומלץ",
tipLabel: "טיפ",
howDidThatGo: "?איך זה הלך",
nailedIt: "!מסמר",
gettingThere: "בדרך",
stillTricky: "עדיין מאתגר",
youveMasteredPrereqs: "שלטת בתרגילים המקדימים! לפעמים זה פשוט דורש יותר חזרות. נסה אימונים קצרים יותר — 3 דקות זה מספיק.",
foundationSkillFor: "כישור בסיס ל",
smartSuggestion: "הצעה חכמה",
```

---

## Design Guidelines

- Suggestion card uses warm amber/yellow tones — NOT red or warning colors
- Tone is always supportive and encouraging
- Card should feel like a helpful coach, not an error message
- Smooth slide-down animation when the card appears
- Prerequisite exercise cards match the program's color scheme
- The mood check (How did that go?) should be minimal — 3 emoji buttons, single tap, no modal
- RTL support for all Hebrew text
- Follows existing PawPath dark theme

---

## Claude Code Prompt

Drop this file into your PawPath project folder, then paste this into Claude Code:

```
Read phase3a-build3-smart-difficulty.md and implement the Smart Difficulty Adjustment system. This includes:

1. Create src/data/exercisePrerequisites.js with the full prerequisite map for all exercises across all 9 programs. Each entry has prerequisites (array of exercise IDs) and tips (en + he). Verify all exercise IDs exist in programs.js.

2. Add difficulty tracking to the dog's data in localStorage — under difficultyTracking.exercises, track per-exercise: incompleteCount, lowRatingCount, shortSessionCount, lastSuggestionDate, dismissed, totalAttempts.

3. Create src/components/DifficultyCard.jsx — the "Need a hand?" suggestion card that shows on exercise pages when thresholds are met. Shows prerequisite exercises with [GO] buttons, tips, and a dismiss button. Warm amber/yellow styling, encouraging tone.

4. Add session tracking: when a user opens an exercise and leaves without completing (after 10+ seconds), increment incompleteCount. After completing an exercise, show a quick "How did that go?" mood check (3 emoji buttons: nailed it / getting there / still tricky).

5. Integrate with Daily Plan: when a struggle is detected, add prerequisite exercises higher in the daily plan with a "Foundation skill for [exercise]" label.

6. Logic: only activate after 5+ total sessions, 7-day cooldown after dismiss, auto-clear after 3 consecutive successful completions, max 1 suggestion visible at a time.

7. Add all Hebrew translations.

Match existing dark theme. Full RTL support. Encouraging tone throughout — never punishing.
```

Then push:
```
git add .
git commit -m "Phase 3A: Smart Difficulty Adjustment"
git push
```
