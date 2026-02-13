// Smart Difficulty Adjustment — Exercise Prerequisite Map
// Maps each exercise to its prerequisites (simpler exercises that build foundation skills)
// and tips for when a dog is struggling.
//
// IDs match src/data/programs.js exactly.

export const EXERCISE_PREREQUISITES = {
  // =============================================
  // PUPPY FOUNDATIONS (foundations)
  // =============================================

  // Level 1 — First Steps (no prerequisites, these ARE the foundations)
  "f1a": { prerequisites: [], tips: null },  // Name Recognition
  "f1b": { prerequisites: [], tips: null },  // Sit
  "f1c": { prerequisites: [], tips: null },  // Eye Contact Game

  // Level 2 — Building Focus
  "f2a": {  // Stay — Introduction
    prerequisites: ["f1b"],  // Needs a solid sit to hold position
    tips: {
      en: "If your dog breaks the stay immediately, you're asking for too much too fast. Start with 2-second stays and build up slowly. They should succeed 80% of the time.",
      he: "אם הכלב שובר את ההישארות מיד, אתה מבקש יותר מדי מהר מדי. התחל עם הישארות של 2 שניות והתקדם לאט. הם צריכים להצליח 80% מהזמן."
    }
  },
  "f2b": {  // Leave It — Basics
    prerequisites: ["f1b", "f1c"],  // Sit (impulse control) + Eye Contact (focus)
    tips: {
      en: "Start with a treat in your closed fist. Only open when the dog looks away. The key is rewarding the decision NOT to grab.",
      he: "התחל עם חטיף ביד סגורה. פתח רק כשהכלב מסתכל הצידה. המפתח הוא לתגמל את ההחלטה לא לתפוס."
    }
  },
  "f2c": {  // Touch — Hand Target
    prerequisites: ["f1a"],  // Needs name recognition for engagement
    tips: {
      en: "If your dog won't touch your hand, try rubbing a treat on your palm first. Start with your hand just 2 inches from their nose.",
      he: "אם הכלב לא נוגע ביד שלך, נסה לשפשף חטיף על כף היד. התחל עם היד רק 5 ס\"מ מהאף שלו."
    }
  },

  // Level 3 — World Ready
  "f3a": {  // Recall — Come
    prerequisites: ["f1a", "f1c"],  // Name recognition + eye contact/focus
    tips: {
      en: "Never call your dog to you for something unpleasant. Make every recall a party! Start on a long leash indoors.",
      he: "לעולם אל תקרא לכלב אליך למשהו לא נעים. הפוך כל חזרה למסיבה! התחל על רצועה ארוכה בתוך הבית."
    }
  },
  "f3b": {  // Loose Leash Walking
    prerequisites: ["f1c", "f2c"],  // Eye contact (focus on handler) + Touch (following a lure)
    tips: {
      en: "Stop every single time the leash goes tight. Wait for slack, then continue. Short, frequent sessions (5-10 min) beat long frustrating walks.",
      he: "עצור כל פעם שהרצועה נמתחת. חכה לרפיון, ואז המשך. אימונים קצרים ותכופים (5-10 דקות) עדיפים על הליכות ארוכות ומתסכלות."
    }
  },
  "f3c": {  // Place / Go to Bed
    prerequisites: ["f1b", "f2a"],  // Sit + Stay Introduction (for holding position on mat)
    tips: {
      en: "Start by rewarding any interaction with the mat — stepping on it, looking at it. Build up to lying down on it before adding 'stay'.",
      he: "התחל בתגמול כל אינטראקציה עם המזרן — דריכה עליו, הסתכלות עליו. בנה עד שכיבה עליו לפני שמוסיפים 'הישאר'."
    }
  },

  // =============================================
  // POTTY TRAINING (potty)
  // =============================================

  // Level 1 — The Basics
  "pt1a": { prerequisites: [], tips: null },  // Set Up a Schedule — foundational
  "pt1b": {  // The Potty Cue
    prerequisites: ["pt1a"],  // Need a schedule first so you're outside at the right times
    tips: {
      en: "Say the cue word WHILE they're going, not before. After 2 weeks of pairing, they'll learn to go on cue.",
      he: "אמור את מילת הפקודה בזמן שהם עושים, לא לפני. אחרי שבועיים של שיוך, הם ילמדו לעשות בפקודה."
    }
  },
  "pt1c": {  // Supervision & Management
    prerequisites: ["pt1a"],  // Need schedule established first
    tips: {
      en: "If you can't watch the puppy, crate them or tether them to you. Every accident that happens unsupervised is a missed training opportunity.",
      he: "אם אתה לא יכול לפקח על הגור, שים אותו בכלוב או קשור אותו אליך. כל תאונה שקורית ללא פיקוח היא הזדמנות אימון שהוחמצה."
    }
  },

  // Level 2 — Building Reliability
  "pt2a": {  // Door Signal Training
    prerequisites: ["pt1a", "pt1c"],  // Schedule + supervision fundamentals
    tips: {
      en: "Touch their paw to the bell before every potty trip. If they abuse the bell for fun, make bell trips boring — straight to the potty spot, 3 minutes max.",
      he: "גע בכף שלהם בפעמון לפני כל יציאה לצרכים. אם הם משתמשים בפעמון לכיף, הפוך את היציאות למשעממות — ישר למקום הצרכים, 3 דקות מקסימום."
    }
  },
  "pt2b": {  // Handling Accidents
    prerequisites: ["pt1a"],  // Need basics of schedule to understand what went wrong
    tips: {
      en: "Never punish accidents. If caught in the act, calmly interrupt and take outside. If found later, just clean silently. Use enzymatic cleaner to remove scent.",
      he: "לעולם אל תעניש על תאונות. אם תפסת בזמן, הפרע ברוגע והוצא החוצה. אם מצאת אחר כך, פשוט נקה בשקט. השתמש בחומר ניקוי אנזימטי."
    }
  },
  "pt2c": {  // Expanding Freedom
    prerequisites: ["pt1c", "pt2a"],  // Supervision skills + door signals established
    tips: {
      en: "Only expand to a new room after 2 weeks accident-free in the current one. If accidents happen, go back to the previous level for a week.",
      he: "הרחב לחדר חדש רק אחרי שבועיים ללא תאונות בחדר הנוכחי. אם קורות תאונות, חזור לרמה הקודמת לשבוע."
    }
  },

  // =============================================
  // CRATE TRAINING (crate)
  // =============================================

  // Level 1 — Introduction
  "cr1a": { prerequisites: [], tips: null },  // Crate = Treats — foundational
  "cr1b": {  // Meals in the Crate
    prerequisites: ["cr1a"],  // Need positive crate association first
    tips: {
      en: "Feed every meal inside the crate. Start with the bowl at the entrance, gradually move it deeper over days.",
      he: "האכל כל ארוחה בתוך הכלוב. התחל עם הקערה בכניסה, הזז אותה פנימה בהדרגה על פני ימים."
    }
  },
  "cr1c": {  // Crate Cue
    prerequisites: ["cr1a"],  // Need positive association before adding a verbal cue
    tips: {
      en: "The crate cue should be the happiest word your dog knows. Say it with enthusiasm, reward generously. If they dread it, you've moved too fast.",
      he: "פקודת הכלוב צריכה להיות המילה הכי שמחה שהכלב מכיר. אמור אותה בהתלהבות, תגמל בנדיבות. אם הם פוחדים ממנה, התקדמת מהר מדי."
    }
  },

  // Level 2 — Duration & Alone Time
  "cr2a": {  // Closed Door — Short Duration
    prerequisites: ["cr1b", "cr1c"],  // Meals in crate + cue established
    tips: {
      en: "Close the door only while they're eating at first. Open before they finish. Gradually extend to staying closed 30 seconds after finishing.",
      he: "סגור את הדלת רק בזמן שהם אוכלים בהתחלה. פתח לפני שהם מסיימים. הארך בהדרגה לסגירה של 30 שניות אחרי שסיימו."
    }
  },
  "cr2b": {  // Leaving the Room
    prerequisites: ["cr2a"],  // Need closed door comfort first
    tips: {
      en: "Leave for 1 minute, return calmly. Gradually extend. If whining starts, wait for 3 seconds of silence before returning.",
      he: "עזוב לדקה, חזור ברוגע. הארך בהדרגה. אם מתחילה יללה, חכה ל-3 שניות של שקט לפני שחוזרים."
    }
  },
  "cr2c": {  // Real-World Crating
    prerequisites: ["cr2a", "cr2b"],  // Duration + leaving the room
    tips: {
      en: "Exercise your dog well before crating for real absences. A frozen Kong when you leave. Keep departures boring — no emotional goodbyes.",
      he: "האמן את הכלב היטב לפני כליאה ליציאות אמיתיות. קונג קפוא כשאתה יוצא. שמור על יציאות משעממות — בלי פרידות רגשיות."
    }
  },

  // =============================================
  // PUPPY SOCIALIZATION (social)
  // =============================================

  // Level 1 — Sounds & Surfaces
  "sc1a": { prerequisites: [], tips: null },  // Surface Exploration — foundational
  "sc1b": { prerequisites: [], tips: null },  // Sound Desensitization — foundational
  "sc1c": { prerequisites: [], tips: null },  // Handling & Touch — foundational

  // Level 2 — People & Places
  "sc2a": {  // People Variety
    prerequisites: ["sc1c", "f1b"],  // Handling comfort + Sit (for calm greetings)
    tips: {
      en: "Let your puppy CHOOSE to approach. Never force interactions. If they're timid, have the person toss treats on the ground instead of hand-feeding.",
      he: "תן לגור לבחור להתקרב. לעולם אל תכריח אינטראקציות. אם הם ביישנים, בקש מהאדם לזרוק חטיפים על הרצפה במקום להאכיל מהיד."
    }
  },
  "sc2b": {  // New Environments
    prerequisites: ["sc1a", "sc1b"],  // Surface comfort + sound comfort
    tips: {
      en: "Keep first visits short (10 min). Let your puppy observe from a safe distance. Bring high-value treats. Leave before they get overwhelmed.",
      he: "שמור על ביקורים ראשונים קצרים (10 דקות). תן לגור להתבונן ממרחק בטוח. הבא חטיפים איכותיים. עזוב לפני שהם מוצפים."
    }
  },
  "sc2c": {  // Dog-to-Dog Introduction
    prerequisites: ["sc2a", "f1c"],  // People variety (social confidence) + Eye Contact (focus)
    tips: {
      en: "Meet on neutral territory. Let dogs sniff briefly (3-5 seconds), then redirect. Controlled, positive introductions beat chaotic dog parks every time.",
      he: "היפגשו בשטח ניטרלי. תנו לכלבים להריח בקצרה (3-5 שניות), ואז הפנה. הכרויות מבוקרות וחיוביות עדיפות על גני כלבים כאוטיים."
    }
  },

  // =============================================
  // BEHAVIOR SOLUTIONS (behavior)
  // =============================================

  // Level 1 — Impulse Control
  "b1a": {  // Wait for Food
    prerequisites: ["f1b"],  // Needs sit
    tips: {
      en: "If your dog lunges at the bowl, raise it back up immediately. Only lower when they're completely still. They learn: stillness = food.",
      he: "אם הכלב מזנק לקערה, הרם אותה בחזרה מיד. הורד רק כשהם לגמרי שקטים. הם לומדים: שקט = אוכל."
    }
  },
  "b1b": {  // Door Manners
    prerequisites: ["f1b", "f2a"],  // Sit + Stay Introduction
    tips: {
      en: "Practice with the door first — open it 1 inch. If dog moves, close it. Only open wider when they hold their stay. The door opening is the reward.",
      he: "תרגל עם הדלת קודם — פתח אותה סנטימטר אחד. אם הכלב זז, סגור. פתח רחב יותר רק כשהם מחזיקים הישארות. פתיחת הדלת היא התגמול."
    }
  },
  "b1c": {  // Calm on Cue
    prerequisites: ["f1b", "f1c"],  // Sit + Eye Contact (capturing calm needs focus)
    tips: {
      en: "You're rewarding a MOOD, not a behavior. Catch your dog being naturally calm — walk over and place a treat between their paws. Do this for a full week.",
      he: "אתה מתגמל מצב רוח, לא התנהגות. תפוס את הכלב כשהוא רגוע באופן טבעי — לך ושים חטיף בין הכפות. עשה זאת שבוע שלם."
    }
  },

  // Level 2 — Problem Solving
  "b2a": {  // Stop the Jumping
    prerequisites: ["f1b", "b1a"],  // Sit (the alternative behavior) + Wait for Food (impulse control)
    tips: {
      en: "The fix isn't punishing the jump — it's rewarding the alternative. Ask for a Sit before any greeting. No attention until all four paws are on the ground.",
      he: "התיקון הוא לא להעניש את הקפיצה — אלא לתגמל את החלופה. בקש שב לפני כל ברכה. בלי תשומת לב עד שכל ארבע הכפות על הרצפה."
    }
  },
  "b2b": {  // Quiet on Cue
    prerequisites: ["f1a", "f1c"],  // Name Recognition + Eye Contact (attention and focus)
    tips: {
      en: "Don't yell 'quiet' — that sounds like barking to your dog. Wait for a pause in barking, mark it, and reward. Teach 'quiet' from silence, not during an explosion.",
      he: "אל תצעק 'שקט' — זה נשמע כמו נביחה לכלב שלך. חכה להפסקה בנביחות, סמן ותגמל. למד 'שקט' מתוך שקט, לא במהלך פיצוץ."
    }
  },
  "b2c": {  // Drop It — Reliable
    prerequisites: ["f2b"],  // Leave It Basics (same impulse control concept)
    tips: {
      en: "Always trade UP — offer something better than what they have. If 'drop it' means losing something fun, they'll run from you instead.",
      he: "תמיד החלף למעלה — הצע משהו טוב יותר ממה שיש להם. אם 'שחרר' אומר לאבד משהו כיפי, הם יברחו ממך במקום."
    }
  },

  // =============================================
  // CORE OBEDIENCE (obedience)
  // =============================================

  // Level 1 — Reliable Basics
  "o1a": {  // Sit at Distance
    prerequisites: ["f1b", "f2a"],  // Solid sit + Stay concept
    tips: {
      en: "The 3 D's: Distance, Duration, Distraction — only increase ONE at a time. If they break at 10 steps, go back to 5 and build up slowly.",
      he: "3 ה-D: מרחק, משך, הסחה — הגדל רק אחד בכל פעם. אם הם שוברים ב-10 צעדים, חזור ל-5 והתקדם לאט."
    }
  },
  "o1b": {  // Down from Standing
    prerequisites: ["f1b"],  // Needs basic sit to understand positions
    tips: {
      en: "If your dog struggles going from standing to down, reward intermediate steps — nose dipping, one elbow down. Shape gradually, don't lure too fast.",
      he: "אם הכלב מתקשה לעבור מעמידה לשכיבה, תגמל שלבי ביניים — הורדת אף, מרפק אחד למטה. עצב בהדרגה, אל תפתה מהר מדי."
    }
  },
  "o1c": {  // Stay vs. Distractions
    prerequisites: ["f2a", "o1a"],  // Stay Introduction + Sit at Distance
    tips: {
      en: "If they break 2 times in a row, the distraction is too hard. Drop back to an easier one and build up. They should succeed 80% of the time.",
      he: "אם הם שוברים פעמיים ברציפות, ההסחה קשה מדי. חזור לאחת קלה יותר והתקדם. הם צריכים להצליח 80% מהזמן."
    }
  },

  // Level 2 — Public Manners
  "o2a": {  // Polite Greetings
    prerequisites: ["f1b", "b1a"],  // Sit + impulse control (Wait for Food)
    tips: {
      en: "Everyone must be consistent. One person rewarding jumping undermines weeks of training. If calm: pet. If jumping: person turns away. No exceptions.",
      he: "כולם חייבים להיות עקביים. אדם אחד שמתגמל קפיצות מערער שבועות של אימון. אם רגוע: ליטוף. אם קופץ: האדם מסתובב. בלי חריגות."
    }
  },
  "o2b": {  // Café Settle
    prerequisites: ["f3c", "o1c"],  // Place/Go to Bed + Stay vs. Distractions
    tips: {
      en: "Walk 30+ minutes before café practice. Bring an amazing chew. Go at off-peak hours first. Start with 5 minutes, build to 30.",
      he: "טייל 30+ דקות לפני תרגול בית קפה. הבא ללעוס מדהים. לך בשעות שקטות קודם. התחל עם 5 דקות, בנה עד 30."
    }
  },
  "o2c": {  // Walk Past Distractions
    prerequisites: ["f3b", "f1c"],  // Loose Leash Walking + Eye Contact (focus on handler)
    tips: {
      en: "Distance is your best friend. If your dog can't handle 30 feet from a distraction, don't try 10. Start far and close the gap gradually over days.",
      he: "מרחק הוא החבר הכי טוב שלך. אם הכלב לא יכול להתמודד ב-10 מטר מהסחה, אל תנסה ב-3. התחל רחוק וצמצם את הפער בהדרגה."
    }
  },

  // Level 3 — Off-Leash Foundations
  "o3a": {  // Long Line Recall
    prerequisites: ["f3a", "o1c"],  // Recall — Come + Stay vs. Distractions
    tips: {
      en: "Never go off-leash until 95%+ reliable on the long line in multiple environments. Make every recall a massive reward party.",
      he: "לעולם אל תשחרר מהרצועה עד שמעל 95% אמינות ברצועה ארוכה בסביבות מרובות. הפוך כל חזרה למסיבת תגמול עצומה."
    }
  },
  "o3b": {  // Emergency Stop
    prerequisites: ["f2a", "o1a"],  // Stay concept + Sit at Distance
    tips: {
      en: "This could save your dog's life near a road. Practice it seriously — start from 5 feet, then 10, then 20. Use a long line as backup.",
      he: "זה יכול להציל את חיי הכלב ליד כביש. תרגל ברצינות — התחל מ-1.5 מטר, אז 3, אז 6. השתמש ברצועה ארוכה כגיבוי."
    }
  },
  "o3c": {  // Voluntary Check-Ins
    prerequisites: ["f1c", "f3a"],  // Eye Contact Game + Recall foundation
    tips: {
      en: "Don't call or say anything. Just wait and reward every voluntary look at you. They'll check in more and more frequently.",
      he: "אל תקרא או תאמר כלום. פשוט חכה ותגמל כל מבט מרצון לעברך. הם יבדקו אותך בתדירות הולכת וגוברת."
    }
  },

  // =============================================
  // TRICK TRAINING (tricks)
  // =============================================

  // Level 1 — Party Tricks
  "t1a": {  // Shake / Paw
    prerequisites: ["f1b"],  // Sit (starting position)
    tips: {
      en: "If your dog won't lift their paw, try tickling the back of their leg gently. Capture any paw movement and reward.",
      he: "אם הכלב לא מרים את הכף, נסה לדגדג בעדינות את גב הרגל. תפוס כל תנועת כף ותגמל."
    }
  },
  "t1b": {  // Spin
    prerequisites: ["f2c"],  // Touch — Hand Target (lure following skill)
    tips: {
      en: "Use a treat to lure a full circle. If your dog stops halfway, reward half-circles first, then gradually lure the full spin.",
      he: "השתמש בחטיף לפיתוי סיבוב מלא. אם הכלב עוצר באמצע, תגמל חצי סיבובים קודם, ואז פתה סיבוב מלא בהדרגה."
    }
  },
  "t1c": {  // High Five
    prerequisites: ["t1a"],  // Shake / Paw (this builds directly on it)
    tips: {
      en: "If they know Shake, just angle your palm to face them and hold it higher. Mark when their paw hits your palm. Build height gradually.",
      he: "אם הם מכירים לחיצת יד, פשוט הטה את כף היד שלך לכיוונם והחזק גבוה יותר. סמן כשהכף שלהם פוגעת בכף ידך. בנה גובה בהדרגה."
    }
  },

  // Level 2 — Show Stoppers
  "t2a": {  // Roll Over
    prerequisites: ["o1b", "t1b"],  // Down from Standing + Spin (body awareness)
    tips: {
      en: "Start from a Down. Lure the nose toward the shoulder — the body follows. Some dogs need this broken into 3 stages. Do it on carpet or grass.",
      he: "התחל משכיבה. פתה את האף לכיוון הכתף — הגוף עוקב. חלק מהכלבים צריכים לחלק את זה ל-3 שלבים. עשה על שטיח או דשא."
    }
  },
  "t2b": {  // Play Dead
    prerequisites: ["o1b", "t2a"],  // Down from Standing + Roll Over (extension of roll over)
    tips: {
      en: "This is an extension of Roll Over — stop at the 'on side' position. Reward for stillness, not movement. Add a dramatic 'Bang!' cue.",
      he: "זהו הרחבה של התגלגלות — עצור בתנוחת 'על הצד'. תגמל על שקט, לא על תנועה. הוסף פקודת 'באנג!' דרמטית."
    }
  },
  "t2c": {  // Crawl
    prerequisites: ["o1b", "f2a"],  // Down from Standing + Stay Introduction (hold down while moving)
    tips: {
      en: "Start in a Down. Lure the nose forward along the ground very slowly. If they stand up, you're luring too fast or too high.",
      he: "התחל משכיבה. פתה את האף קדימה לאורך הרצפה לאט מאוד. אם הם קמים, אתה מפתה מהר מדי או גבוה מדי."
    }
  },

  // =============================================
  // LEASH REACTIVITY (reactivity)
  // =============================================

  // Level 1 — Foundation Skills
  "lr1a": {  // Engage-Disengage Game
    prerequisites: ["f1a", "f1c"],  // Name Recognition + Eye Contact (focus on handler)
    tips: {
      en: "Find the distance where your dog notices a trigger but doesn't react. That's your starting point. If they explode, you're too close. Move further away.",
      he: "מצא את המרחק שבו הכלב שם לב לגירוי אבל לא מגיב. זו נקודת ההתחלה. אם הם מתפוצצים, אתה קרוב מדי. התרחק."
    }
  },
  "lr1b": {  // Emergency U-Turn
    prerequisites: ["f1a", "f2c"],  // Name Recognition + Touch (for following handler)
    tips: {
      en: "Practice 'Let's go!' at home first with no triggers. Turn 180° and reward them for following. This is your escape plan, not retreat — it prevents bad rehearsals.",
      he: "תרגל 'בוא נלך!' בבית קודם בלי גירויים. הסתובב 180° ותגמל על עקיבה. זו תוכנית בריחה, לא נסיגה — זה מונע חזרות גרועות."
    }
  },
  "lr1c": {  // Find Your Threshold
    prerequisites: ["lr1a"],  // Engage-Disengage (need to understand the concept)
    tips: {
      en: "Your threshold might be 50 feet or 200 feet. No judgment. Start embarrassingly far away. The mistake most people make is training too close.",
      he: "הסף שלך יכול להיות 15 מטר או 60 מטר. בלי שיפוטיות. התחל ממרחק מביך. הטעות הנפוצה ביותר היא לאמן קרוב מדי."
    }
  },

  // Level 2 — Real World Practice
  "lr2a": {  // Parallel Walking
    prerequisites: ["lr1a", "lr1b"],  // Engage-Disengage + U-Turn (core skills)
    tips: {
      en: "Walk in the same direction as the other dog, not toward each other. Parallel is less confrontational. Start on opposite sides of a wide street.",
      he: "הלכו באותו כיוון כמו הכלב האחר, לא זה לקראת זה. מקבילי פחות עימותי. התחילו מצדדים מנוגדים של רחוב רחב."
    }
  },
  "lr2b": {  // Trigger Stacking Awareness
    prerequisites: ["lr1a", "lr1c"],  // Engage-Disengage + Threshold awareness
    tips: {
      en: "Stress accumulates. Your dog might handle one trigger but not three in a row. After a stressful encounter, give decompression time: sniffing, slow walking, space.",
      he: "לחץ מצטבר. הכלב יכול להתמודד עם גירוי אחד אבל לא שלושה ברצף. אחרי מפגש מלחיץ, תן זמן דה-קומפרסיה: הרחה, הליכה איטית, מרחב."
    }
  },
  "lr2c": {  // Decompression Walks
    prerequisites: [],  // No prereqs — this is stress relief, any dog can benefit
    tips: {
      en: "Let your dog SNIFF. Don't rush, don't direct. Just follow on a long line. Sniffing lowers cortisol. Aim for 2-3 decompression walks per week between training sessions.",
      he: "תן לכלב להריח. אל תמהר, אל תכוון. פשוט עקוב על רצועה ארוכה. הרחה מורידה קורטיזול. כוון ל-2-3 הליכות דה-קומפרסיה בשבוע בין אימונים."
    }
  },

  // =============================================
  // CANINE FITNESS (fitness)
  // =============================================

  // Level 1 — Body Awareness
  "fit1a": {  // Paw Targeting
    prerequisites: ["f1b"],  // Sit (body awareness and impulse control)
    tips: {
      en: "Start with a flat book on the floor. Lure your dog to step on it. Reward any paw contact. Gradually upgrade to wobble surfaces.",
      he: "התחל עם ספר שטוח על הרצפה. פתה את הכלב לדרוך עליו. תגמל כל מגע כף. שדרג בהדרגה למשטחים מתנדנדים."
    }
  },
  "fit1b": {  // Backup
    prerequisites: ["f1b", "f2c"],  // Sit + Touch (body awareness + rear-end awareness)
    tips: {
      en: "Stand facing your dog. Step toward them slowly. Most dogs will naturally step back. Mark and reward any backward movement.",
      he: "עמוד מול הכלב. צעד לעברו לאט. רוב הכלבים יצעדו אחורה באופן טבעי. סמן ותגמל כל תנועה אחורה."
    }
  },
  "fit1c": {  // Figure 8 Weave
    prerequisites: ["f2c"],  // Touch — Hand Target (lure following)
    tips: {
      en: "Stand with legs wide. Lure your dog through in a figure-8. Start slow — this is a genuine workout that builds body awareness and flexibility.",
      he: "עמוד עם רגליים רחוקות. פתה את הכלב לעבור בשמינייה. התחל לאט — זה אימון אמיתי שבונה מודעות גוף וגמישות."
    }
  },
};
