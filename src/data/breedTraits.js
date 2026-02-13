// 20 popular breeds + mixed + unknown
// Trait scores: 1 (low) – 5 (high)
// priorityPrograms: ordered list of recommended program IDs
// exerciseTips: breed-specific advice keyed by real exercise ID

export const BREED_TRAITS = [
  // ── 1. Golden Retriever ──────────────────────────────
  {
    id: "golden_retriever",
    name: { en: "Golden Retriever", he: "גולדן רטריבר" },
    aliases: ["golden", "goldie", "golden retriever", "golden ret"],
    size: "large",
    traits: {
      energy: 4, trainability: 5, stubbornness: 1,
      sociability: 5, preyDrive: 3, sensitivity: 3, barkTendency: 2,
    },
    priorityPrograms: ["foundations", "obedience", "tricks", "fitness"],
    breedTips: {
      en: "Golden Retrievers are eager to please and incredibly food-motivated — training is a joy. Watch for mouthiness in puppyhood (they're retrievers!) and redirect to appropriate chew toys. They mature slowly; expect puppy-like behavior until age 2-3. Their soft temperament means harsh corrections backfire — keep it positive.",
      he: "גולדן רטריברים להוטים לרצות ומונעים מאוד ממזון — אימון הוא הנאה. שימו לב לנטייה ללעוס בגיל גור (הם רטריברים!) והפנו לצעצועי לעיסה מתאימים. הם מתבגרים לאט; צפו להתנהגות גורית עד גיל 2-3. הטמפרמנט הרך שלהם אומר שתיקונים חריפים לא עובדים — שמרו על חיוביות.",
    },
    exerciseTips: {
      f3a: { en: "Goldens have strong recall instincts — they WANT to come back. Use their food drive to make recall the best thing ever. Off-leash reliability comes naturally with consistent practice.", he: "לגולדנים יש אינסטינקט חזרה חזק — הם רוצים לחזור. השתמשו בדחף המזון שלהם כדי להפוך החזרה לדבר הכי טוב. אמינות ללא רצועה מגיעה בטבעיות עם תרגול עקבי." },
      f2b: { en: "Goldens are food-obsessed — 'Leave It' is critical. Start early and use high-value trades. Their impulse control improves a lot with age.", he: "גולדנים אובססיביים לאוכל — 'עזוב' הוא קריטי. התחילו מוקדם והשתמשו בהחלפות בעלות ערך גבוה. שליטת הדחפים שלהם משתפרת עם הגיל." },
      b2c: { en: "Retrievers carry EVERYTHING in their mouths. Make 'Drop It' a game, not a battle. Always trade up — they'll learn that releasing = something better.", he: "רטריברים נושאים הכל בפה. הפכו 'שחרר' למשחק, לא לקרב. תמיד החליפו למעלה — הם ילמדו ששחרור = משהו יותר טוב." },
      fit1c: { en: "Goldens are natural athletes — figure 8 weaves are great for their coordination. Watch for hip strain in older Goldens; go slow on hard surfaces.", he: "גולדנים הם ספורטאים טבעיים — שמיניות מעולות לקואורדינציה שלהם. שימו לב למתח בירכיים אצל גולדנים מבוגרים; לכו לאט על משטחים קשים." },
    },
  },

  // ── 2. Labrador Retriever ────────────────────────────
  {
    id: "labrador_retriever",
    name: { en: "Labrador Retriever", he: "לברדור רטריבר" },
    aliases: ["lab", "labrador", "labrador retriever", "lab retriever", "labbie"],
    size: "large",
    traits: {
      energy: 5, trainability: 5, stubbornness: 1,
      sociability: 5, preyDrive: 3, sensitivity: 2, barkTendency: 2,
    },
    priorityPrograms: ["foundations", "obedience", "fitness", "tricks"],
    breedTips: {
      en: "Labs are the ultimate food-motivated breed. Use it! Their energy level stays high for years — plan for serious daily exercise. They're built to retrieve, so games of fetch double as training. Watch for counter-surfing and garbage raiding — 'Leave It' is your best friend.",
      he: "לברדורים הם הגזע הכי מונע ממזון. השתמשו בזה! רמת האנרגיה שלהם נשארת גבוהה שנים — תכננו פעילות גופנית רצינית יומית. הם נבנו לאפורט, אז משחקי הבאה משמשים גם כאימון. שימו לב לגניבות מהשיש ומהפח — 'עזוב' הוא החבר הכי טוב שלכם.",
    },
    exerciseTips: {
      f2b: { en: "Labs will eat ANYTHING. 'Leave It' isn't optional — it's a safety skill. Start with boring items and work up to food on the counter. Use their food drive as the reward.", he: "לברדורים יאכלו הכל. 'עזוב' זה לא אופציונלי — זה מיומנות בטיחות. התחילו עם פריטים משעממים ועלו עד אוכל על השיש. השתמשו בדחף המזון שלהם כפרס." },
      f3a: { en: "Labs recall well once trained but their nose can distract them. Use a whistle recall — it carries further and cuts through distractions better than your voice.", he: "לברדורים חוזרים טוב אחרי אימון אבל האף שלהם יכול להסיח אותם. השתמשו בשריקה להחזרה — היא נשמעת רחוק יותר וחותכת הסחות טוב יותר מהקול." },
      b2c: { en: "Labs mouth everything as puppies. 'Drop It' saves you from vet visits. Always trade for something better — never chase them for the item.", he: "לברדורים שמים הכל בפה כגורים. 'שחרר' חוסך ביקורי וטרינר. תמיד החליפו למשהו יותר טוב — לעולם אל תרדפו אחריהם בשביל הפריט." },
      fit1a: { en: "Labs are prone to joint issues. Paw targeting on unstable surfaces builds proprioception and protects joints long-term. Start young, keep sessions short.", he: "לברדורים נוטים לבעיות מפרקים. מיקוד כפות על משטחים לא יציבים בונה פרופריוספציה ומגן על מפרקים לטווח ארוך. התחילו צעירים, שמרו אימונים קצרים." },
    },
  },

  // ── 3. German Shepherd ───────────────────────────────
  {
    id: "german_shepherd",
    name: { en: "German Shepherd", he: "רועה גרמני" },
    aliases: ["german shepherd", "gsd", "alsatian", "german shepherd dog", "shepherd"],
    size: "large",
    traits: {
      energy: 4, trainability: 5, stubbornness: 2,
      sociability: 3, preyDrive: 4, sensitivity: 4, barkTendency: 3,
    },
    priorityPrograms: ["foundations", "obedience", "reactivity", "fitness"],
    breedTips: {
      en: "German Shepherds bond deeply with their handler and thrive on structured training. They can develop reactivity if under-socialized — prioritize early exposure. Their intelligence means they get bored fast; keep sessions short and varied. They're sensitive to handler stress — stay calm and confident.",
      he: "רועים גרמניים יוצרים קשר עמוק עם המאלף ומשגשגים באימון מובנה. הם עלולים לפתח ריאקטיביות אם לא עברו חברות מספקת — תעדפו חשיפה מוקדמת. האינטליגנציה שלהם אומרת שהם משתעממים מהר; שמרו אימונים קצרים ומגוונים. הם רגישים ללחץ של המאלף — הישארו רגועים ובטוחים.",
    },
    exerciseTips: {
      f1c: { en: "GSDs excel at eye contact once bonded. Use this as your foundation — a GSD watching you is a GSD ready to work. Build duration; they can hold a gaze for ages.", he: "רועים גרמניים מצטיינים בקשר עין אחרי יצירת קשר. השתמשו בזה כבסיס — רועה גרמני שמסתכל עליכם מוכן לעבוד. בנו משך; הם יכולים להחזיק מבט לנצח." },
      lr1a: { en: "GSDs can be reactive to unfamiliar dogs. Start engage-disengage early, even if they seem fine now. Their protective instinct kicks in around 8-12 months. Prevention is much easier than rehab.", he: "רועים גרמניים יכולים להיות ריאקטיביים לכלבים לא מוכרים. התחילו משחק מעורבות-התנתקות מוקדם, גם אם הם נראים בסדר עכשיו. האינסטינקט ההגנתי שלהם מתעורר בגיל 8-12 חודשים. מניעה קלה הרבה יותר משיקום." },
      o3a: { en: "GSDs want to work with you — long line recall builds on this natural desire. Their prey drive means you need to proof recall around squirrels and cats specifically.", he: "רועים גרמניים רוצים לעבוד איתכם — החזרה ברצועה ארוכה בונה על הרצון הטבעי. דחף הטרף שלהם אומר שצריך לתרגל החזרה ליד סנאים וחתולים במיוחד." },
      b1c: { en: "Teaching a GSD an 'off switch' is essential. They can go from 0 to 100 fast. 'Calm on Cue' gives them permission to relax — they need it.", he: "ללמד רועה גרמני 'כפתור כיבוי' זה חיוני. הם יכולים לעבור מ-0 ל-100 מהר. 'רגוע לפי פקודה' נותן להם רשות להירגע — הם צריכים את זה." },
    },
  },

  // ── 4. French Bulldog ────────────────────────────────
  {
    id: "french_bulldog",
    name: { en: "French Bulldog", he: "בולדוג צרפתי" },
    aliases: ["french bulldog", "frenchie", "french bull"],
    size: "small",
    traits: {
      energy: 2, trainability: 3, stubbornness: 4,
      sociability: 4, preyDrive: 1, sensitivity: 3, barkTendency: 2,
    },
    priorityPrograms: ["foundations", "crate", "behavior", "social"],
    breedTips: {
      en: "Frenchies are charming and stubborn in equal measure. Keep training sessions under 5 minutes — they overheat easily and lose focus. Never train in heat. They're food-motivated but can be willful; make every exercise feel like a game. Their flat face means NO intense cardio or fitness exercises.",
      he: "פרנצ'ים מקסימים ועקשנים באותה מידה. שמרו אימונים מתחת ל-5 דקות — הם מתחממים בקלות ומאבדים ריכוז. לעולם אל תאמנו בחום. הם מונעים ממזון אבל יכולים להיות עקשנים; הפכו כל תרגיל למשחק. הפנים השטוחות שלהם אומרות שאין אירובי אינטנסיבי או תרגילי כושר.",
    },
    exerciseTips: {
      fit1a: { en: "CAUTION: Frenchies are brachycephalic. Skip any fitness exercise that raises breathing rate significantly. Paw targeting is fine — keep it slow and watch for heavy panting.", he: "זהירות: פרנצ'ים הם ברכיצפליים. דלגו על תרגילי כושר שמעלים קצב נשימה משמעותית. מיקוד כפות בסדר — לכו לאט ושימו לב לנשימה כבדה." },
      f2a: { en: "Frenchies actually enjoy 'Stay' — it's low effort! Use their love of lounging to your advantage. Build duration in calm, cool environments.", he: "פרנצ'ים בעצם נהנים מ'הישאר' — זה מאמץ נמוך! השתמשו באהבת המנוחה שלהם לטובתכם. בנו משך בסביבות רגועות וקרירות." },
      f3b: { en: "Frenchies pull HARD despite their size. A front-clip harness is essential. Keep walks short (15-20 min) especially in warm weather — overheating is dangerous for flat-faced breeds.", he: "פרנצ'ים מושכים חזק למרות הגודל. רתמה עם קליפ קדמי חיונית. שמרו טיולים קצרים (15-20 דק') במיוחד במזג אוויר חם — התחממות יתר מסוכנת לגזעים שטוחי פנים." },
      b2a: { en: "Frenchies are natural jumpers for attention. Redirect to a sit — they're compact enough that people can easily pet them at ground level.", he: "פרנצ'ים קופצים טבעית לתשומת לב. הפנו לישיבה — הם קומפקטיים מספיק שאנשים יכולים ללטף אותם בגובה הקרקע." },
    },
  },

  // ── 5. Poodle (Standard/Mini) ────────────────────────
  {
    id: "poodle",
    name: { en: "Poodle", he: "פודל" },
    aliases: ["poodle", "standard poodle", "miniature poodle", "mini poodle", "toy poodle"],
    size: "medium",
    traits: {
      energy: 4, trainability: 5, stubbornness: 1,
      sociability: 4, preyDrive: 3, sensitivity: 4, barkTendency: 3,
    },
    priorityPrograms: ["obedience", "tricks", "foundations", "fitness"],
    breedTips: {
      en: "Poodles are among the smartest breeds — they learn fast but also learn bad habits fast. They need mental stimulation as much as physical. Trick training is perfect for their intelligence. They can be sensitive; use a gentle, upbeat approach. Vary exercises frequently to prevent boredom.",
      he: "פודלים הם מהגזעים החכמים ביותר — הם לומדים מהר אבל גם לומדים הרגלים רעים מהר. הם צריכים גירוי מנטלי כמו פיזי. אימון טריקים מושלם לאינטליגנציה שלהם. הם יכולים להיות רגישים; השתמשו בגישה עדינה ואנרגטית. שנו תרגילים לעיתים קרובות למנוע שעמום.",
    },
    exerciseTips: {
      t2b: { en: "Poodles nail 'Play Dead' faster than most breeds. Their body awareness is excellent. Add dramatic flair — they seem to enjoy the performance aspect.", he: "פודלים שולטים ב'מת' מהר יותר מרוב הגזעים. מודעות הגוף שלהם מצוינת. הוסיפו דרמטיות — נראה שהם נהנים מהצד המופעי." },
      o1c: { en: "Poodles can hold stays well once they understand the game. The challenge is their alertness — they notice everything. Proof against sounds and movement specifically.", he: "פודלים יכולים להחזיק הישאר טוב ברגע שהם מבינים. האתגר הוא העירנות שלהם — הם שמים לב להכל. תרגלו נגד קולות ותנועה במיוחד." },
      f2c: { en: "Poodles master 'Touch' quickly and love the interaction. Use it as a redirect for their sometimes nervous energy — it gives them a job.", he: "פודלים שולטים ב'גע' מהר ואוהבים את האינטראקציה. השתמשו בזה כהפניה לאנרגיה העצבנית שלהם לפעמים — זה נותן להם תפקיד." },
      t1b: { en: "Poodles spin naturally and gracefully. Teach both directions and chain into longer sequences — they thrive on complex trick chains.", he: "פודלים מסתובבים בטבעיות וחן. למדו שני כיוונים ושרשרו לרצפים ארוכים יותר — הם משגשגים בשרשראות טריקים מורכבות." },
    },
  },

  // ── 6. Bulldog (English) ─────────────────────────────
  {
    id: "bulldog",
    name: { en: "Bulldog", he: "בולדוג" },
    aliases: ["bulldog", "english bulldog", "british bulldog"],
    size: "medium",
    traits: {
      energy: 1, trainability: 2, stubbornness: 5,
      sociability: 4, preyDrive: 1, sensitivity: 2, barkTendency: 2,
    },
    priorityPrograms: ["foundations", "crate", "behavior", "social"],
    breedTips: {
      en: "Bulldogs wrote the book on stubbornness. Short sessions (3-5 min) with high-value rewards are the only way. They overheat dangerously fast — never train in warm weather. They're not dumb, they're just selective about what's worth their effort. Find what motivates YOUR bulldog and use it relentlessly.",
      he: "בולדוגים כתבו את הספר על עקשנות. אימונים קצרים (3-5 דק') עם פרסים בעלי ערך גבוה הם הדרך היחידה. הם מתחממים בצורה מסוכנת — לעולם אל תאמנו במזג אוויר חם. הם לא טיפשים, הם פשוט סלקטיביים לגבי מה שווה את המאמץ. מצאו מה מניע את הבולדוג שלכם והשתמשו בזה ללא הפסקה.",
    },
    exerciseTips: {
      fit1a: { en: "CAUTION: Bulldogs are brachycephalic. Any fitness exercise must be done in cool conditions, with rest breaks every 1-2 minutes. Stop immediately if you see heavy panting.", he: "זהירות: בולדוגים הם ברכיצפליים. כל תרגיל כושר חייב להיעשות בתנאים קרירים, עם הפסקות כל 1-2 דקות. עצרו מיד אם רואים נשימה כבדה." },
      f2a: { en: "Good news: Bulldogs actually like staying still. Build on their natural inclination to lounge. 'Stay' may be their best skill.", he: "חדשות טובות: בולדוגים בעצם אוהבים לעמוד במקום. בנו על הנטייה הטבעית שלהם למנוחה. 'הישאר' עשוי להיות המיומנות הטובה שלהם." },
      b1a: { en: "Bulldogs are food-driven but stubborn about waiting. Start with very short waits (2 seconds) and use EXTREMELY high-value food. Patience is key — they'll get there.", he: "בולדוגים מונעים ממזון אבל עקשנים לגבי המתנה. התחילו עם המתנות קצרות מאוד (2 שניות) והשתמשו באוכל בעל ערך גבוה מאוד. סבלנות היא המפתח — הם יגיעו לשם." },
      f3c: { en: "Bulldogs love 'Place' — it's basically permission to lie down somewhere comfy. They master this quickly. Use a padded mat for their joints.", he: "בולדוגים אוהבים 'מקום' — זה בעצם רשות לשכב במקום נוח. הם שולטים בזה מהר. השתמשו במזרן מרופד למפרקים שלהם." },
    },
  },

  // ── 7. Beagle ────────────────────────────────────────
  {
    id: "beagle",
    name: { en: "Beagle", he: "ביגל" },
    aliases: ["beagle"],
    size: "medium",
    traits: {
      energy: 4, trainability: 2, stubbornness: 4,
      sociability: 5, preyDrive: 5, sensitivity: 2, barkTendency: 5,
    },
    priorityPrograms: ["foundations", "behavior", "obedience", "reactivity"],
    breedTips: {
      en: "Beagles follow their nose above all else. Recall is your biggest challenge — never trust off-leash in unfenced areas. Use food rewards (they're food-obsessed) and keep sessions exciting. Their baying/barking needs management early. Accept that sniffing IS their exercise — incorporate it into training with 'Go Sniff' breaks.",
      he: "ביגלים עוקבים אחרי האף מעל הכל. החזרה היא האתגר הגדול — לעולם אל תסמכו ללא רצועה באזורים לא מגודרים. השתמשו בפרסי אוכל (הם אובססיביים לאוכל) ושמרו אימונים מרגשים. הנביחה/יללה שלהם צריכה ניהול מוקדם. קבלו שהרחה זה הפעילות שלהם — שלבו אותה באימון עם הפסקות 'לך תריח'.",
    },
    exerciseTips: {
      f3a: { en: "Beagle recall is the hardest challenge in dog training. Their nose overrides their brain. Use a whistle, jackpot with REAL meat, and never chase them. A long line is mandatory in unfenced areas — possibly forever.", he: "החזרת ביגל היא האתגר הקשה באימון כלבים. האף שלהם עוקף את המוח. השתמשו בשריקה, פרס ג'קפוט עם בשר אמיתי, ולעולם אל תרדפו. רצועה ארוכה חובה באזורים לא מגודרים — אולי לתמיד." },
      f2b: { en: "Beagles will eat anything that smells interesting — which is everything. 'Leave It' is a lifelong skill. Use real meat as the trade-up reward; kibble won't cut it against a scent trail.", he: "ביגלים יאכלו כל דבר שמריח מעניין — שזה הכל. 'עזוב' זו מיומנות לכל החיים. השתמשו בבשר אמיתי כפרס החלפה; אוכל יבש לא יתחרה בעקבות ריח." },
      lr2c: { en: "Decompression walks are MAGIC for Beagles. Let them sniff on a long line — it satisfies their deepest instinct and lowers stress dramatically. This should be most of their walks.", he: "טיולי שחרור לחץ הם קסם לביגלים. תנו להם להריח על רצועה ארוכה — זה מספק את האינסטינקט העמוק שלהם ומוריד לחץ דרמטית. זה צריך להיות רוב הטיולים." },
      b2b: { en: "Beagles bark, bay, and howl — it's in their DNA. You won't eliminate it, but you can teach 'Quiet' as a cue. Reward silent moments heavily. Accept that some barking is just being a Beagle.", he: "ביגלים נובחים, מילללים ויורדים — זה בDNA. לא תבטלו את זה, אבל תוכלו ללמד 'שקט' כפקודה. תגמלו רגעי שקט בכבדות. קבלו שקצת נביחות זה פשוט להיות ביגל." },
    },
  },

  // ── 8. Rottweiler ────────────────────────────────────
  {
    id: "rottweiler",
    name: { en: "Rottweiler", he: "רוטוויילר" },
    aliases: ["rottweiler", "rottie", "rott"],
    size: "large",
    traits: {
      energy: 3, trainability: 4, stubbornness: 3,
      sociability: 3, preyDrive: 3, sensitivity: 3, barkTendency: 2,
    },
    priorityPrograms: ["foundations", "obedience", "social", "reactivity"],
    breedTips: {
      en: "Rottweilers are powerful, loyal, and highly trainable — but need a confident, consistent handler. Early socialization is critical; they can become wary of strangers. They respond best to calm, firm leadership and positive reinforcement. Their size means manners training (no jumping, loose leash) is non-negotiable. A well-trained Rottie is one of the best dogs on earth.",
      he: "רוטוויילרים חזקים, נאמנים ומאוד ניתנים לאימון — אבל צריכים מאלף בטוח ועקבי. חברות מוקדמת קריטית; הם יכולים להיות חשדנים כלפי זרים. הם מגיבים הכי טוב למנהיגות רגועה, עקבית וחיזוק חיובי. הגודל שלהם אומר שאימון נימוסים (בלי קפיצות, רצועה רפויה) אינו ניתן למשא ומתן. רוטי מאומן טוב הוא אחד הכלבים הטובים בעולם.",
    },
    exerciseTips: {
      o2a: { en: "A 100lb Rottie jumping on grandma is a serious problem. Start polite greetings early and be 100% consistent. Their natural calm makes this achievable with practice.", he: "רוטוויילר של 45 קג שקופץ על סבתא זו בעיה רצינית. התחילו ברכות מנומסות מוקדם והיו עקביים ב-100%. הרוגע הטבעי שלהם הופך את זה לבר השגה עם תרגול." },
      b1b: { en: "Door manners are essential for large guarding breeds. A Rottie that bolts through doors is a liability. They usually learn this quickly — they want to please.", he: "נימוסי דלת חיוניים לגזעים גדולים של שמירה. רוטוויילר שפורץ דרך דלתות הוא סיכון. הם בדרך כלל לומדים מהר — הם רוצים לרצות." },
      lr1a: { en: "Rottweilers can develop dog-selectivity with age. Start engage-disengage before any reactivity appears. Their handler focus makes this exercise very effective for them.", he: "רוטוויילרים יכולים לפתח סלקטיביות כלפי כלבים עם הגיל. התחילו מעורבות-התנתקות לפני שמופיעה ריאקטיביות. המיקוד שלהם במאלף הופך תרגיל זה ליעיל מאוד." },
      f1c: { en: "Rottweilers are naturally handler-focused. Eye contact builds your bond and their impulse control simultaneously. They often offer extended eye contact naturally.", he: "רוטוויילרים ממוקדים במאלף באופן טבעי. קשר עין בונה את הקשר שלכם ואת שליטת הדחפים בו-זמנית. הם לעיתים קרובות מציעים קשר עין ממושך באופן טבעי." },
    },
  },

  // ── 9. Dachshund ─────────────────────────────────────
  {
    id: "dachshund",
    name: { en: "Dachshund", he: "תחש" },
    aliases: ["dachshund", "doxie", "wiener dog", "sausage dog", "doxen"],
    size: "small",
    traits: {
      energy: 3, trainability: 2, stubbornness: 5,
      sociability: 3, preyDrive: 4, sensitivity: 3, barkTendency: 4,
    },
    priorityPrograms: ["foundations", "behavior", "crate", "social"],
    breedTips: {
      en: "Dachshunds are tenacious, independent, and will train YOU if you let them. Short sessions with high-value food are essential. NEVER let them jump on/off furniture — their long spine is at risk. They bark at everything; start 'Quiet' training early. They're loyal to their person and sometimes snappy with strangers — socialize well.",
      he: "תחשים עקשנים, עצמאיים וילמדו אתכם אם תתנו להם. אימונים קצרים עם אוכל בעל ערך גבוה חיוניים. לעולם אל תתנו להם לקפוץ מ/על רהיטים — עמוד השדרה הארוך שלהם בסיכון. הם נובחים על הכל; התחילו אימון 'שקט' מוקדם. הם נאמנים לאדם שלהם ולפעמים נושכניים עם זרים — חברו היטב.",
    },
    exerciseTips: {
      fit1b: { en: "Backup exercise is excellent for Dachshunds — it strengthens their rear end and builds spinal awareness. Go very slowly and avoid slippery surfaces to protect their back.", he: "תרגיל אחורה מצוין לתחשים — הוא מחזק את החלק האחורי ובונה מודעות לעמוד השדרה. לכו לאט מאוד והימנעו ממשטחים חלקים להגנה על הגב." },
      b2b: { en: "Dachshunds were bred to bark underground to alert hunters. Their bark is deep and persistent. 'Quiet' training works but requires extreme patience and consistency.", he: "תחשים גודלו לנבוח מתחת לאדמה כדי להתריע לציידים. הנביחה שלהם עמוקה ומתמשכת. אימון 'שקט' עובד אבל דורש סבלנות וקביעות קיצוניים." },
      f3b: { en: "Dachshunds pull surprisingly hard for their size. Use a harness (NEVER a collar that strains their neck/spine). Keep walks moderate length — their short legs tire faster.", he: "תחשים מושכים בחוזקה מפתיע לגודלם. השתמשו ברתמה (לעולם לא קולר שמעמיס על הצוואר/שדרה). שמרו טיולים באורך מתון — הרגליים הקצרות שלהם מתעייפות מהר." },
      b2a: { en: "IMPORTANT: Never encourage jumping in Dachshunds. Their long spine makes them highly prone to IVDD (disc disease). Teach 'four on the floor' and provide ramps for furniture.", he: "חשוב: לעולם אל תעודדו קפיצה אצל תחשים. עמוד השדרה הארוך שלהם הופך אותם לנוטים מאוד ל-IVDD (מחלת דיסק). למדו 'ארבע על הרצפה' וספקו רמפות לרהיטים." },
    },
  },

  // ── 10. Yorkshire Terrier ────────────────────────────
  {
    id: "yorkshire_terrier",
    name: { en: "Yorkshire Terrier", he: "יורקשייר טרייר" },
    aliases: ["yorkshire terrier", "yorkie", "york", "yorkshire"],
    size: "small",
    traits: {
      energy: 3, trainability: 3, stubbornness: 4,
      sociability: 3, preyDrive: 3, sensitivity: 3, barkTendency: 5,
    },
    priorityPrograms: ["foundations", "behavior", "social", "crate"],
    breedTips: {
      en: "Yorkies are terriers — feisty, independent, and convinced they're a big dog. Don't let their size excuse bad behavior; train them like a real dog. Barking is their #1 issue. They can be nippy with children and strangers if not socialized. Potty training is notoriously slow for small breeds — patience and consistency.",
      he: "יורקים הם טריירים — להוטים, עצמאיים ומשוכנעים שהם כלב גדול. אל תתנו לגודלם להצדיק התנהגות רעה; אמנו אותם כמו כלב אמיתי. נביחה היא בעיה מספר 1. הם יכולים לנשוך ילדים וזרים אם לא חוברו. אימון נקיון איטי מפורסם לגזעים קטנים — סבלנות ועקביות.",
    },
    exerciseTips: {
      sc1c: { en: "Start handling exercises early — Yorkies need regular grooming and many develop handling sensitivity. Make nail trims, brushing, and ear cleaning positive from puppyhood.", he: "התחילו תרגילי מגע מוקדם — יורקים צריכים טיפוח קבוע ורבים מפתחים רגישות למגע. הפכו גזירת ציפורניים, צחצוח ואוזניים לחיוביים מגיל גור." },
      b2b: { en: "Yorkies bark at everything — doorbells, leaves, their own reflection. Start 'Quiet' training from day one. Reward silence heavily. Manage triggers (block window access) while training.", he: "יורקים נובחים על הכל — פעמוני דלת, עלים, ההשתקפות שלהם. התחילו אימון 'שקט' מיום ראשון. תגמלו שקט בכבדות. נהלו טריגרים (חסמו גישה לחלון) בזמן אימון." },
      f2b: { en: "Yorkies have terrier prey drive — they'll grab and guard small items. 'Leave It' prevents resource guarding. Use AMAZING treats as the trade.", he: "ליורקים יש דחף טרף של טרייר — הם יתפסו וישמרו פריטים קטנים. 'עזוב' מונע שמירת משאבים. השתמשו בחטיפים מדהימים כהחלפה." },
      b1c: { en: "Teaching Yorkies to settle is possible — despite their terrier energy. Capture calm moments frequently. A calm Yorkie is a well-exercised Yorkie.", he: "ללמד יורקים להירגע אפשרי — למרות אנרגיית הטרייר. תפסו רגעי רוגע לעיתים קרובות. יורקי רגוע הוא יורקי שהתאמן מספיק." },
    },
  },

  // ── 11. Boxer ─────────────────────────────────────────
  {
    id: "boxer",
    name: { en: "Boxer", he: "בוקסר" },
    aliases: ["boxer"],
    size: "large",
    traits: {
      energy: 5, trainability: 3, stubbornness: 3,
      sociability: 4, preyDrive: 3, sensitivity: 3, barkTendency: 2,
    },
    priorityPrograms: ["behavior", "obedience", "foundations", "fitness"],
    breedTips: {
      en: "Boxers are the class clowns of the dog world — boundless energy, goofy, and perpetual puppies. They mature very slowly (expect puppy behavior until 3+). Jumping is their signature issue. They need serious exercise to be trainable. Their enthusiasm can overwhelm people; channel it into trick training and structured play.",
      he: "בוקסרים הם הליצנים של עולם הכלבים — אנרגיה בלתי נגמרת, מצחיקים ותמיד גורים. הם מתבגרים לאט מאוד (צפו להתנהגות גורית עד 3+). קפיצה היא הבעיה המזוהה שלהם. הם צריכים פעילות רצינית כדי להיות ניתנים לאימון. ההתלהבות שלהם יכולה להציף אנשים; תעלו אותה לאימון טריקים ומשחק מובנה.",
    },
    exerciseTips: {
      b2a: { en: "Boxers are CHAMPION jumpers. This is THE exercise for your breed. Be ultra-consistent — every person, every time. It takes longer for Boxers because jumping is so self-rewarding for them.", he: "בוקסרים הם אלופי הקפיצה. זה התרגיל עבור הגזע שלכם. היו עקביים מאוד — כל אדם, כל פעם. לוקח יותר זמן לבוקסרים כי קפיצה מתגמלת מאוד בעצמה." },
      b1c: { en: "Teaching a Boxer an 'off switch' is essential for your sanity. They CAN learn to settle — but only after adequate physical exercise. Walk/run FIRST, then practice calm.", he: "ללמד בוקסר 'כפתור כיבוי' חיוני לשפיות שלכם. הם יכולים ללמוד להירגע — אבל רק אחרי פעילות גופנית מספקת. הליכה/ריצה קודם, אז תרגלו רוגע." },
      fit1c: { en: "Boxers take to figure 8 weaves enthusiastically — maybe too enthusiastically. Start slow and reward controlled movement, not speed.", he: "בוקסרים לוקחים שמיניות בהתלהבות — אולי יותר מדי. התחילו לאט ותגמלו תנועה מבוקרת, לא מהירות." },
      o2a: { en: "Polite greetings are crucial for Boxers — their size + energy + jumping = knocked-over guests. Practice with MANY different people. Consistency from everyone is the key.", he: "ברכות מנומסות קריטיות לבוקסרים — הגודל + אנרגיה + קפיצה = אורחים על הרצפה. תרגלו עם הרבה אנשים שונים. עקביות מכולם היא המפתח." },
    },
  },

  // ── 12. Siberian Husky ───────────────────────────────
  {
    id: "siberian_husky",
    name: { en: "Siberian Husky", he: "האסקי סיבירי" },
    aliases: ["husky", "siberian husky", "siberian", "sibe"],
    size: "large",
    traits: {
      energy: 5, trainability: 2, stubbornness: 5,
      sociability: 4, preyDrive: 5, sensitivity: 2, barkTendency: 4,
    },
    priorityPrograms: ["foundations", "behavior", "obedience", "reactivity"],
    breedTips: {
      en: "Huskies are independent, athletic, and will challenge every rule you set. They were bred to run — OFF-LEASH IS NEVER SAFE in unfenced areas. Their prey drive is extreme. Training must be fun and high-value; they decide whether you're worth listening to. Accept that perfect obedience isn't the Husky way. Aim for good enough and keep them exercised.",
      he: "האסקים עצמאיים, אתלטיים ויאתגרו כל כלל שתקבעו. הם גודלו לרוץ — ללא רצועה זה לעולם לא בטוח באזורים לא מגודרים. דחף הטרף שלהם קיצוני. אימון חייב להיות כיפי ובעל ערך גבוה; הם מחליטים אם שווה להקשיב לכם. קבלו שציות מושלם זה לא דרך ההאסקי. כוונו ל'מספיק טוב' ושמרו אותם פעילים.",
    },
    exerciseTips: {
      f3a: { en: "Husky recall is a lifelong struggle. Many experienced trainers never trust Huskies off-leash. Use enclosed areas, long lines, and accept that this breed has limits. Prey drive overrides training.", he: "החזרת האסקי היא מאבק לכל החיים. מאמנים מנוסים רבים לעולם לא סומכים על האסקים ללא רצועה. השתמשו באזורים מגודרים, רצועות ארוכות, וקבלו שלגזע הזה יש מגבלות." },
      f2b: { en: "Huskies will ignore 'Leave It' if the prey drive kicks in. Build a strong foundation indoors first. Use the highest-value food you can find. Outdoors, management (leash) matters more than training alone.", he: "האסקים יתעלמו מ'עזוב' אם דחף הטרף נכנס. בנו בסיס חזק בתוך הבית קודם. השתמשו באוכל בעל הערך הגבוה ביותר. בחוץ, ניהול (רצועה) חשוב יותר מאימון בלבד." },
      lr2c: { en: "Huskies NEED decompression walks — they were bred to cover ground. Long line in safe areas. Let them run and sniff. A tired Husky is a trainable Husky.", he: "האסקים צריכים טיולי שחרור — הם גודלו לכסות מרחקים. רצועה ארוכה באזורים בטוחים. תנו להם לרוץ ולהריח. האסקי עייף הוא האסקי שניתן לאמן." },
      b2b: { en: "Huskies howl more than bark. 'Quiet' training helps but they're vocal by nature. Choose your battles — eliminate nuisance barking but accept some vocalization.", he: "האסקים מילללים יותר מנובחים. אימון 'שקט' עוזר אבל הם קוליים מטבעם. בחרו את הקרבות — בטלו נביחה מציקה אבל קבלו קצת קוליות." },
    },
  },

  // ── 13. Cavalier King Charles Spaniel ─────────────────
  {
    id: "cavalier",
    name: { en: "Cavalier King Charles Spaniel", he: "קבלייר קינג צ'ארלס ספניאל" },
    aliases: ["cavalier", "cavalier king charles", "ckcs", "king charles", "cav"],
    size: "small",
    traits: {
      energy: 2, trainability: 4, stubbornness: 1,
      sociability: 5, preyDrive: 2, sensitivity: 5, barkTendency: 2,
    },
    priorityPrograms: ["foundations", "social", "crate", "behavior"],
    breedTips: {
      en: "Cavaliers are velcro dogs — sweet, sensitive, and desperate to please. They respond to gentle positive training beautifully. Harsh corrections will shut them down completely. Watch for separation anxiety; crate training early is essential. They're social butterflies but fragile — supervise with larger dogs.",
      he: "קבלירים הם כלבי סקוטש — מתוקים, רגישים ונואשים לרצות. הם מגיבים לאימון חיובי עדין בצורה יפה. תיקונים חריפים יסגרו אותם לחלוטין. שימו לב לחרדת נטישה; אימון כלוב מוקדם חיוני. הם חברותיים אבל שבירים — פקחו ליד כלבים גדולים.",
    },
    exerciseTips: {
      sc1b: { en: "Cavaliers can be sound-sensitive. Start sound desensitization early and go VERY slowly. Their sensitive nature means one bad experience with a loud sound can create lasting fear.", he: "קבלירים יכולים להיות רגישים לקולות. התחילו הרגלה לקולות מוקדם ולכו לאט מאוד. הטבע הרגיש שלהם אומר שחוויה אחת רעה עם קול חזק יכולה ליצור פחד מתמשך." },
      b1c: { en: "Cavaliers are natural settlers — they LOVE lap time. 'Calm on Cue' is usually one of their easiest skills. Use it to build confidence when they're anxious.", he: "קבלירים הם נחי באופן טבעי — הם אוהבים זמן חיק. 'רגוע לפי פקודה' הוא בדרך כלל מהמיומנויות הקלות שלהם. השתמשו בזה לבניית ביטחון כשהם חרדים." },
      f3c: { en: "Cavaliers master 'Place' quickly and find it comforting. A designated bed becomes their safe space. Great for managing their tendency to follow you everywhere.", he: "קבלירים שולטים ב'מקום' מהר ומוצאים בזה נוחות. מיטה מיועדת הופכת למרחב בטוח. מעולה לניהול הנטייה שלהם ללכת אחריכם לכל מקום." },
      cr2c: { en: "Cavaliers are prone to separation anxiety. Crate training done RIGHT (slowly, positively) is your best insurance. Rush it and you'll make the anxiety worse.", he: "קבלירים נוטים לחרדת נטישה. אימון כלוב שנעשה נכון (לאט, חיובי) הוא הביטוח הטוב שלכם. מהרו ותחמירו את החרדה." },
    },
  },

  // ── 14. Border Collie ────────────────────────────────
  {
    id: "border_collie",
    name: { en: "Border Collie", he: "בורדר קולי" },
    aliases: ["border collie", "border", "collie", "bc"],
    size: "medium",
    traits: {
      energy: 5, trainability: 5, stubbornness: 2,
      sociability: 3, preyDrive: 4, sensitivity: 4, barkTendency: 3,
    },
    priorityPrograms: ["obedience", "tricks", "reactivity", "fitness"],
    breedTips: {
      en: "Border Collies are the Einsteins of dogs — they need a JOB or they'll create one (usually destroying something). Mental stimulation matters more than physical exercise. They can develop reactivity and OCD-like behaviors (shadow chasing, light fixation) if under-stimulated. Training should be complex and challenging — they get bored with repetition.",
      he: "בורדר קולים הם האיינשטיינים של הכלבים — הם צריכים עבודה או שיצרו אחת (בדרך כלל להרוס משהו). גירוי מנטלי חשוב יותר מפעילות גופנית. הם יכולים לפתח ריאקטיביות והתנהגויות דמויות OCD (רדיפת צללים, קיבעון אור) אם לא מגורים מספיק. אימון צריך להיות מורכב ומאתגר — הם משתעממים מחזרות.",
    },
    exerciseTips: {
      lr1a: { en: "Border Collies can develop frustration-based reactivity on leash — they want to herd everything. Start engage-disengage early. Their intelligence means they learn the pattern quickly once you start.", he: "בורדר קולים יכולים לפתח ריאקטיביות מתסכלת ברצועה — הם רוצים לרעות הכל. התחילו מעורבות-התנתקות מוקדם. האינטליגנציה שלהם אומרת שהם לומדים את הדפוס מהר ברגע שמתחילים." },
      o3c: { en: "Border Collies are naturals at voluntary check-ins — their herding instinct means keeping track of their handler. Reward it and it becomes rock-solid.", he: "בורדר קולים טבעיים בצ'ק-אין וולונטרי — אינסטינקט הרעייה שלהם אומר מעקב אחר המאלף. תגמלו את זה ויהפוך לאמין לחלוטין." },
      fit1c: { en: "Border Collies learn figure 8 weaves in minutes. Challenge them: add speed, add distractions, chain with other tricks. They need complexity.", he: "בורדר קולים לומדים שמיניות בדקות. אתגרו אותם: הוסיפו מהירות, הסחות, שרשרו עם טריקים אחרים. הם צריכים מורכבות." },
      t2c: { en: "Crawl is great for Border Collies — it builds body awareness and provides the kind of focused challenge they crave. Add distance quickly; they'll master form fast.", he: "זחילה מעולה לבורדר קולים — בונה מודעות גוף ומספקת את סוג האתגר הממוקד שהם משתוקקים אליו. הוסיפו מרחק מהר; הם ישלטו בטכניקה מהר." },
    },
  },

  // ── 15. Australian Shepherd ──────────────────────────
  {
    id: "australian_shepherd",
    name: { en: "Australian Shepherd", he: "רועה אוסטרלי" },
    aliases: ["australian shepherd", "aussie", "aussie shepherd", "australian"],
    size: "medium",
    traits: {
      energy: 5, trainability: 5, stubbornness: 2,
      sociability: 3, preyDrive: 4, sensitivity: 4, barkTendency: 3,
    },
    priorityPrograms: ["obedience", "tricks", "reactivity", "fitness"],
    breedTips: {
      en: "Aussies are velcro herding dogs — intensely bonded, athletic, and always watching. Like Border Collies, they need jobs. They can develop herding behaviors toward children and other pets (nipping heels). Early socialization prevents wariness. Teach them an 'off switch' — otherwise they never stop working.",
      he: "אוסטרלים הם כלבי רעייה צמודים — קשורים מאוד, אתלטיים ותמיד צופים. כמו בורדר קולים, הם צריכים עבודות. הם יכולים לפתח התנהגויות רעייה כלפי ילדים וחיות אחרות (נשיכת עקבים). חברות מוקדמת מונעת חשדנות. למדו אותם 'כפתור כיבוי' — אחרת הם לעולם לא מפסיקים לעבוד.",
    },
    exerciseTips: {
      lr1a: { en: "Aussies share the Border Collie tendency toward frustration reactivity. They want to control movement around them. Engage-disengage helps them learn to observe without managing.", he: "אוסטרלים חולקים את נטיית הבורדר קולי לריאקטיביות מתסכלת. הם רוצים לשלוט בתנועה סביבם. מעורבות-התנתקות עוזרת להם ללמוד לצפות בלי לנהל." },
      o3a: { en: "Aussies have excellent recall potential — their handler focus is strong. Long line work builds reliability fast. Proof against herding triggers (joggers, bikes, kids running).", he: "לאוסטרלים יש פוטנציאל החזרה מצוין — המיקוד שלהם במאלף חזק. עבודת רצועה ארוכה בונה אמינות מהר. תרגלו נגד טריגרים של רעייה (רצים, אופניים, ילדים רצים)." },
      b1c: { en: "The most important skill for an Aussie. They're 'always on' and need explicit permission to relax. Without this, they develop anxiety and compulsive behaviors.", he: "המיומנות הכי חשובה לאוסטרלי. הם 'תמיד דלוקים' וצריכים רשות מפורשת להירגע. בלי זה, הם מפתחים חרדה והתנהגויות כפייתיות." },
      fit1a: { en: "Aussies are athletic and take to paw targeting naturally. Use unstable surfaces to challenge them — they need physical AND mental engagement.", he: "אוסטרלים אתלטיים ולוקחים מיקוד כפות בטבעיות. השתמשו במשטחים לא יציבים לאתגר אותם — הם צריכים מעורבות פיזית וגם מנטלית." },
    },
  },

  // ── 16. Shih Tzu ─────────────────────────────────────
  {
    id: "shih_tzu",
    name: { en: "Shih Tzu", he: "שיצו" },
    aliases: ["shih tzu", "shitzu", "shi tzu", "shih-tzu"],
    size: "small",
    traits: {
      energy: 2, trainability: 3, stubbornness: 4,
      sociability: 4, preyDrive: 1, sensitivity: 3, barkTendency: 3,
    },
    priorityPrograms: ["foundations", "potty", "crate", "social"],
    breedTips: {
      en: "Shih Tzus were bred to be companions — they're affectionate, sometimes stubborn, and surprisingly confident. Potty training is typically slow for this breed; be patient and consistent. They need regular grooming, so handling exercises are essential. Keep training sessions short and treat-heavy. They respond to cheerful tones.",
      he: "שיצו גודלו להיות מלווים — הם חיבביים, לפעמים עקשנים ובטוחים בעצמם באופן מפתיע. אימון נקיון בדרך כלל איטי לגזע הזה; היו סבלניים ועקביים. הם צריכים טיפוח קבוע, אז תרגילי מגע חיוניים. שמרו אימונים קצרים ועשירים בחטיפים. הם מגיבים לטונים עליזים.",
    },
    exerciseTips: {
      pt1a: { en: "Shih Tzus have small bladders and potty training is notoriously slow. Stick to a strict schedule, take them out more often than you think necessary, and celebrate outdoor success like you won the lottery.", he: "לשיצו שלפוחית קטנה ואימון נקיון איטי מפורסם. הצמדו ללוח זמנים קפדני, הוציאו אותם לעיתים קרובות יותר ממה שאתם חושבים, וחגגו הצלחה בחוץ כאילו זכיתם בלוטו." },
      sc1c: { en: "Shih Tzus need regular grooming their entire lives. Make handling exercises a priority from puppyhood — touch paws, ears, face, and practice with brushing tools. Your groomer will love you.", he: "שיצו צריכים טיפוח קבוע כל החיים. הפכו תרגילי מגע לעדיפות מגיל גור — געו בכפות, אוזניים, פנים, ותרגלו עם כלי צחצוח. המטפח שלכם יאהב אתכם." },
      f2c: { en: "Shih Tzus respond well to 'Touch' — it's interactive and reward-heavy. Use it as a confidence builder and a redirect when they're being stubborn about other commands.", he: "שיצו מגיבים טוב ל'גע' — זה אינטראקטיבי ועשיר בתגמולים. השתמשו בזה לבניית ביטחון והפניה כשהם עקשנים לגבי פקודות אחרות." },
      b1c: { en: "Shih Tzus are lap dogs at heart. 'Calm on Cue' plays to their natural strength. They settle easily once they learn it's rewarded.", he: "שיצו הם כלבי חיק בלב. 'רגוע לפי פקודה' משחק לחוזק הטבעי שלהם. הם נרגעים בקלות ברגע שהם לומדים שזה מתוגמל." },
    },
  },

  // ── 17. Chihuahua ─────────────────────────────────────
  {
    id: "chihuahua",
    name: { en: "Chihuahua", he: "צ'יוואווה" },
    aliases: ["chihuahua", "chi"],
    size: "small",
    traits: {
      energy: 3, trainability: 3, stubbornness: 4,
      sociability: 2, preyDrive: 2, sensitivity: 4, barkTendency: 5,
    },
    priorityPrograms: ["social", "behavior", "foundations", "crate"],
    breedTips: {
      en: "Chihuahuas are often under-trained because of their size — this creates the 'angry Chihuahua' stereotype. Socialize EXTENSIVELY as a puppy. They bond to one person and can be fearful or aggressive toward others. Barking and fear reactivity are the main challenges. Treat them like a real dog — carry them less, train them more.",
      he: "צ'יוואוות לעיתים קרובות לא מאומנות בגלל הגודל — זה יוצר את הסטריאוטיפ של 'צ'יוואווה כועסת'. חברו באופן נרחב כגור. הם נקשרים לאדם אחד ויכולים להיות פחדנים או תוקפנים כלפי אחרים. נביחה וריאקטיביות מפחד הם האתגרים העיקריים. התייחסו אליהם כמו כלב אמיתי — נשאו אותם פחות, אמנו יותר.",
    },
    exerciseTips: {
      sc2a: { en: "Socialization is THE priority for Chihuahuas. They must meet many different people positively as puppies. Under-socialized Chihuahuas become fear-biters. Let them approach on their own terms — never force.", he: "חברות היא העדיפות מספר 1 לצ'יוואוות. הם חייבים לפגוש אנשים רבים ושונים בחיוביות כגורים. צ'יוואוות שלא חוברו הופכות לנושכי פחד. תנו להם לגשת בקצב שלהם — לעולם אל תכריחו." },
      lr1b: { en: "Emergency U-turns are essential for reactive Chihuahuas. Their small size means triggers loom large from their perspective. Create distance quickly and cheerfully.", he: "סיבובי חירום חיוניים לצ'יוואוות ריאקטיביות. הגודל הקטן שלהן אומר שטריגרים נראים ענקיים מהפרספקטיבה שלהן. צרו מרחק מהר ובשמחה." },
      b2b: { en: "Chihuahuas are the barkiest breed. Start 'Quiet' training immediately and manage their environment (block window views, reduce triggers). Reward silence relentlessly.", he: "צ'יוואוות הן הגזע הכי נבחני. התחילו אימון 'שקט' מיד ונהלו את הסביבה (חסמו מבט מחלונות, הפחיתו טריגרים). תגמלו שקט ללא הפסקה." },
      sc1b: { en: "Chihuahuas startle easily at sounds. Start sound desensitization at a whisper-quiet level and increase over WEEKS. Their small size means vibrations feel more intense to them.", he: "צ'יוואוות נבהלות בקלות מקולות. התחילו הרגלה לקולות ברמה שקטה מאוד והעלו במשך שבועות. הגודל הקטן שלהן אומר שרעידות מרגישות חזקות יותר." },
    },
  },

  // ── 18. Doberman Pinscher ─────────────────────────────
  {
    id: "doberman",
    name: { en: "Doberman Pinscher", he: "דוברמן פינשר" },
    aliases: ["doberman", "doberman pinscher", "dobie", "dobe"],
    size: "large",
    traits: {
      energy: 4, trainability: 5, stubbornness: 2,
      sociability: 3, preyDrive: 3, sensitivity: 4, barkTendency: 2,
    },
    priorityPrograms: ["obedience", "foundations", "social", "fitness"],
    breedTips: {
      en: "Dobermans are athletic, intelligent, and deeply loyal. They thrive on structure and excel in obedience. Like GSDs, early socialization prevents wariness. They're sensitive dogs who respond to handler emotion — stay confident and calm. They learn fast and need progressive challenges. A well-trained Doberman is impressively disciplined.",
      he: "דוברמנים אתלטיים, חכמים ונאמנים מאוד. הם משגשגים על מבנה ומצטיינים בציות. כמו רועים גרמניים, חברות מוקדמת מונעת חשדנות. הם כלבים רגישים שמגיבים לרגשות המאלף — הישארו בטוחים ורגועים. הם לומדים מהר וצריכים אתגרים מתקדמים. דוברמן מאומן היטב הוא ממושמע להפליא.",
    },
    exerciseTips: {
      o1c: { en: "Dobermans excel at 'Stay vs. Distractions' — their handler focus and natural discipline make this one of their strongest skills. Push the difficulty; they can handle it.", he: "דוברמנים מצטיינים ב'הישאר מול הסחות' — המיקוד במאלף והמשמעת הטבעית הופכים את זה למיומנות החזקה שלהם. דחפו את הקושי; הם יכולים." },
      b1b: { en: "Door manners come naturally to well-trained Dobermans. Their self-control is impressive once channeled. Teach early and they'll wait at every doorway reliably.", he: "נימוסי דלת באים בטבעיות לדוברמנים מאומנים. שליטה עצמית שלהם מרשימה ברגע שמתועלת. למדו מוקדם והם יחכו בכל פתח בצורה אמינה." },
      lr1a: { en: "Dobermans can be selective about other dogs. Engage-disengage keeps their natural wariness in check. Their intelligence means fast progress when the protocol is consistent.", he: "דוברמנים יכולים להיות סלקטיביים לגבי כלבים אחרים. מעורבות-התנתקות שומרת על החשדנות הטבעית שלהם. האינטליגנציה אומרת התקדמות מהירה כשהפרוטוקול עקבי." },
      o3b: { en: "Dobermans are one of the best breeds for emergency stop training. Their handler focus and impulse control make this achievable faster than most breeds.", he: "דוברמנים הם מהגזעים הטובים לאימון עצירת חירום. המיקוד במאלף ושליטת הדחפים הופכים את זה לבר-השגה מהר יותר מרוב הגזעים." },
    },
  },

  // ── 19. Cocker Spaniel ───────────────────────────────
  {
    id: "cocker_spaniel",
    name: { en: "Cocker Spaniel", he: "קוקר ספניאל" },
    aliases: ["cocker spaniel", "cocker", "american cocker", "english cocker"],
    size: "medium",
    traits: {
      energy: 3, trainability: 4, stubbornness: 2,
      sociability: 4, preyDrive: 3, sensitivity: 4, barkTendency: 3,
    },
    priorityPrograms: ["foundations", "social", "obedience", "behavior"],
    breedTips: {
      en: "Cockers are happy, eager, and sensitive — the perfect training partner for positive reinforcement. They can develop resource guarding; prevent it early with trading games. Their long ears and coat need regular grooming — start handling exercises immediately. They can be soft and shut down with harsh methods. Keep it fun and upbeat.",
      he: "קוקרים שמחים, להוטים ורגישים — שותף האימון המושלם לחיזוק חיובי. הם יכולים לפתח שמירת משאבים; מנעו מוקדם עם משחקי החלפה. האוזניים הארוכות והפרווה צריכות טיפוח קבוע — התחילו תרגילי מגע מיד. הם יכולים להיות רכים ולהיסגר עם שיטות חריפות. שמרו על כיף ואנרגיה.",
    },
    exerciseTips: {
      f3a: { en: "Cockers have decent recall but can get distracted by scents (they're spaniels!). Use an excited, happy recall voice. Their desire to please helps — make coming back the best part of the walk.", he: "לקוקרים יש החזרה סבירה אבל יכולים להיות מוסחים מריחות (הם ספניאלים!). השתמשו בקול החזרה נלהב ושמח. הרצון לרצות עוזר — הפכו חזרה לחלק הכי טוב בטיול." },
      f2b: { en: "Cockers can be prone to resource guarding. 'Leave It' and 'Drop It' should be practiced daily with positive trades. Never forcefully take things from a Cocker's mouth.", he: "קוקרים יכולים להיות נוטים לשמירת משאבים. 'עזוב' ו'שחרר' צריכים להיות מתורגלים יומית עם החלפות חיוביות. לעולם אל תיקחו דברים בכוח מפה של קוקר." },
      sc1c: { en: "Start handling exercises from day one — Cockers need ear cleaning, extensive grooming, and nail trims throughout their lives. Make every handling session a treat party.", he: "התחילו תרגילי מגע מיום ראשון — קוקרים צריכים ניקוי אוזניים, טיפוח נרחב וגזירת ציפורניים כל חייהם. הפכו כל מפגש מגע למסיבת חטיפים." },
      b1c: { en: "Cockers learn 'Calm on Cue' well — they're naturally moderate-energy dogs. Use their sensitivity to your advantage: calm energy from you breeds calm behavior in them.", he: "קוקרים לומדים 'רגוע לפי פקודה' טוב — הם כלבים עם אנרגיה מתונה טבעית. השתמשו ברגישות שלהם לטובתכם: אנרגיה רגועה מכם מולידה התנהגות רגועה בהם." },
    },
  },

  // ── 20. Jack Russell Terrier ─────────────────────────
  {
    id: "jack_russell",
    name: { en: "Jack Russell Terrier", he: "ג'ק ראסל טרייר" },
    aliases: ["jack russell", "jack russell terrier", "jrt", "jack", "parson russell", "parsons"],
    size: "small",
    traits: {
      energy: 5, trainability: 3, stubbornness: 4,
      sociability: 3, preyDrive: 5, sensitivity: 2, barkTendency: 4,
    },
    priorityPrograms: ["behavior", "foundations", "obedience", "tricks"],
    breedTips: {
      en: "Jack Russells pack enormous energy and drive into a small body. They're not a beginner breed despite their size. Prey drive is extreme — they'll chase anything that moves. They're smart but independent; make training more interesting than squirrels. They need physical AND mental exhaustion daily or they'll destroy your house creatively.",
      he: "ג'ק ראסלים דוחסים אנרגיה ודחף אדירים בגוף קטן. הם לא גזע למתחילים למרות הגודל. דחף הטרף קיצוני — הם ירדפו כל דבר שזז. הם חכמים אבל עצמאיים; הפכו אימון למעניין יותר מסנאים. הם צריכים מיצוי פיזי וגם מנטלי יומי או שיהרסו את הבית בצורה יצירתית.",
    },
    exerciseTips: {
      f2b: { en: "Jack Russells have INTENSE prey drive. 'Leave It' must be ironclad. Start with low-value items and build up gradually. Use real meat as rewards — you're competing with hardwired hunting instincts.", he: "לג'ק ראסלים יש דחף טרף אינטנסיבי. 'עזוב' חייב להיות חסין. התחילו עם פריטים בעלי ערך נמוך ובנו בהדרגה. השתמשו בבשר אמיתי כפרס — אתם מתחרים באינסטינקטים של ציד." },
      f3a: { en: "Jack Russell recall is challenging — their independence and prey drive make off-leash risky. Use a long line in unfenced areas. Build recall with HIGH-value rewards and make coming back more exciting than the chase.", he: "החזרת ג'ק ראסל מאתגרת — העצמאות ודחף הטרף הופכים חופש מרצועה למסוכן. השתמשו ברצועה ארוכה באזורים לא מגודרים. בנו החזרה עם פרסים בערך גבוה מאוד." },
      b2b: { en: "JRTs bark with conviction. They were bred to alert underground. 'Quiet' training works but requires extreme consistency. Redirect their energy to tricks or puzzle toys when barking starts.", he: "ג'ק ראסלים נובחים עם שכנוע. הם גודלו להתריע מתחת לאדמה. אימון 'שקט' עובד אבל דורש עקביות קיצונית. הפנו אנרגיה לטריקים או צעצועי חידה כשנביחה מתחילה." },
      fit1c: { en: "JRTs are incredible athletes for their size. Figure 8 weaves channel their energy productively. Add speed and complexity — they thrive on fast-paced physical challenges.", he: "ג'ק ראסלים הם ספורטאים מדהימים לגודלם. שמיניות מעלות אנרגיה בצורה פרודוקטיבית. הוסיפו מהירות ומורכבות — הם משגשגים באתגרים פיזיים מהירים." },
    },
  },

  // ── 21. Mixed Breed ──────────────────────────────────
  {
    id: "mixed",
    name: { en: "Mixed Breed", he: "מעורב" },
    aliases: ["mixed", "mixed breed", "mutt", "crossbreed", "cross", "mix", "mongrel", "rescue", "shelter dog"],
    size: "medium",
    traits: {
      energy: 3, trainability: 3, stubbornness: 3,
      sociability: 3, preyDrive: 3, sensitivity: 3, barkTendency: 3,
    },
    priorityPrograms: ["foundations", "behavior", "obedience", "social"],
    breedTips: {
      en: "Mixed breeds are wonderfully unpredictable — observe YOUR dog, not breed stereotypes. Watch what motivates them (food, toys, play?) and build training around that. Mixed breeds from shelters may have unknown history; go slow with new experiences and watch body language carefully. Many mixes are incredibly resilient and adaptable trainers.",
      he: "כלבים מעורבים הם נפלא בלתי צפויים — התבוננו בכלב שלכם, לא בסטריאוטיפים. שימו לב מה מניע אותם (אוכל, צעצועים, משחק?) ובנו אימון סביב זה. כלבים מעורבים ממקלטים עשויים להיות עם היסטוריה לא ידועה; לכו לאט עם חוויות חדשות ושימו לב לשפת גוף. מיקסים רבים הם מאמנים עמידים ומסתגלים להפליא.",
    },
    exerciseTips: {
      f1a: { en: "Name recognition is your starting point — it builds the bond. For shelter dogs, this might be learning a NEW name. Use high-value treats and a happy tone. Keep sessions positive.", he: "זיהוי שם הוא נקודת ההתחלה — בונה את הקשר. לכלבי מקלט, זה עשוי להיות שם חדש. השתמשו בחטיפים בעלי ערך גבוה וטון שמח. שמרו אימונים חיוביים." },
      f2c: { en: "Touch is great for shy or nervous mixed breeds — it gives them a clear, rewarding task. Use it as a confidence builder during new experiences.", he: "גע מעולה לכלבים מעורבים ביישנים או עצבניים — נותן להם משימה ברורה ומתגמלת. השתמשו כבונה ביטחון בחוויות חדשות." },
      f3b: { en: "Mixed breeds vary hugely in leash behavior. Observe your dog's natural tendencies: do they pull, lag, or react? Tailor your approach. A front-clip harness helps most pullers regardless of breed.", he: "כלבים מעורבים משתנים מאוד בהתנהגות ברצועה. התבוננו בנטיות הטבעיות: הם מושכים, נגררים, או מגיבים? התאימו את הגישה. רתמה עם קליפ קדמי עוזרת לרוב המושכים." },
      b1c: { en: "Every dog benefits from 'Calm on Cue.' For mixed breeds with unknown history, this skill builds security and trust. Capture calm moments often — especially in new environments.", he: "כל כלב נהנה מ'רגוע לפי פקודה'. לכלבים מעורבים עם היסטוריה לא ידועה, מיומנות זו בונה ביטחון ואמון. תפסו רגעי רוגע לעיתים קרובות — במיוחד בסביבות חדשות." },
    },
  },

  // ── 22. Unknown / Not Listed ─────────────────────────
  {
    id: "unknown",
    name: { en: "Unknown / Other", he: "לא ידוע / אחר" },
    aliases: ["unknown", "other", "not sure", "don't know", "idk"],
    size: "medium",
    traits: {
      energy: 3, trainability: 3, stubbornness: 3,
      sociability: 3, preyDrive: 3, sensitivity: 3, barkTendency: 3,
    },
    priorityPrograms: ["foundations", "behavior", "social", "obedience"],
    breedTips: {
      en: "Every dog is an individual! Start with foundation skills and observe what comes naturally. Watch what motivates your dog: food, toys, or praise? Note where they struggle and where they excel. Adjust training difficulty based on their response, not breed expectations. The best training plan is the one tailored to your specific dog.",
      he: "כל כלב הוא אינדיבידואל! התחילו עם מיומנויות בסיס וצפו מה בא בטבעיות. שימו לב מה מניע את הכלב: אוכל, צעצועים, או שבחים? שימו לב איפה הם מתקשים ואיפה מצטיינים. התאימו קושי אימון לפי התגובה שלהם, לא ציפיות גזע. תוכנית האימון הטובה ביותר היא זו שמותאמת לכלב הספציפי שלכם.",
    },
    exerciseTips: {
      f1a: { en: "Start here — name recognition is universal. It tells you a lot about your dog: how food-motivated they are, how focused they can be, and how they respond to positive reinforcement.", he: "התחילו כאן — זיהוי שם הוא אוניברסלי. זה מגלה הרבה על הכלב: כמה הם מונעים ממזון, כמה הם ממוקדים, ואיך הם מגיבים לחיזוק חיובי." },
      f1b: { en: "Sit is your diagnostic tool. How fast they learn it tells you about trainability. How long they hold it tells you about impulse control. Use this to plan your training path.", he: "ישיבה היא הכלי האבחוני שלכם. כמה מהר הם לומדים מגלה על יכולת אימון. כמה זמן מחזיקים מגלה על שליטת דחפים. השתמשו בזה לתכנון נתיב האימון." },
      f2c: { en: "Touch is one of the most versatile foundation skills. It works for any dog of any breed, size, or temperament. Use it as a redirect, confidence builder, and bonding exercise.", he: "גע הוא מהמיומנויות הבסיסיות הרב-תכליתיות ביותר. עובד לכל כלב מכל גזע, גודל או טמפרמנט. השתמשו כהפניה, בונה ביטחון ותרגיל קשר." },
      f3b: { en: "Leash walking reveals a lot about your dog's personality. Do they pull (high energy/drive), lag (nervous/cautious), or react (frustrated/fearful)? Adjust your approach accordingly.", he: "הליכה ברצועה חושפת הרבה על אישיות הכלב. הם מושכים (אנרגיה/דחף גבוה), נגררים (עצבניים/זהירים), או מגיבים (מתוסכלים/פחדנים)? התאימו גישה בהתאם." },
    },
  },
];

// ── Helper: match user's breed input to a breed profile ──────
export function matchBreed(input) {
  if (!input) return null;
  const q = input.toLowerCase().trim();
  if (!q) return null;

  // Exact alias match first
  for (const breed of BREED_TRAITS) {
    if (breed.aliases.some(a => a === q)) return breed;
  }

  // Partial match (input contained in alias or alias contained in input)
  for (const breed of BREED_TRAITS) {
    if (breed.aliases.some(a => q.includes(a) || a.includes(q))) return breed;
  }

  // Word-level match (any alias word appears in input)
  for (const breed of BREED_TRAITS) {
    for (const alias of breed.aliases) {
      const aliasWords = alias.split(/\s+/);
      if (aliasWords.some(w => w.length > 2 && q.includes(w))) return breed;
    }
  }

  // Fallback: "mix" in input → mixed breed
  if (q.includes("mix")) {
    return BREED_TRAITS.find(b => b.id === "mixed");
  }

  return null;
}

// ── Helper: get breed-specific tip for an exercise ───────────
export function getBreedExerciseTip(breedId, exerciseId, lang = "en") {
  const breed = BREED_TRAITS.find(b => b.id === breedId);
  if (!breed || !breed.exerciseTips[exerciseId]) return null;
  return breed.exerciseTips[exerciseId][lang] || breed.exerciseTips[exerciseId].en;
}

// ── Helper: get breed general tips ───────────────────────────
export function getBreedTips(breedId, lang = "en") {
  const breed = BREED_TRAITS.find(b => b.id === breedId);
  if (!breed) return null;
  return breed.breedTips[lang] || breed.breedTips.en;
}

// ── Helper: get priority programs for a breed ────────────────
export function getBreedPriorityPrograms(breedId) {
  const breed = BREED_TRAITS.find(b => b.id === breedId);
  return breed ? breed.priorityPrograms : ["foundations", "behavior", "social", "obedience"];
}

// ── Helper: get trait summary text ───────────────────────────
const TRAIT_LABELS = {
  energy:        { en: "Energy Level",   he: "רמת אנרגיה" },
  trainability:  { en: "Trainability",   he: "יכולת אימון" },
  stubbornness:  { en: "Independence",   he: "עצמאות" },
  sociability:   { en: "Sociability",    he: "חברותיות" },
  preyDrive:     { en: "Prey Drive",     he: "דחף טרף" },
  sensitivity:   { en: "Sensitivity",    he: "רגישות" },
  barkTendency:  { en: "Bark Tendency",  he: "נטיית נביחה" },
};

export function getTraitLabels(lang = "en") {
  const labels = {};
  for (const [key, val] of Object.entries(TRAIT_LABELS)) {
    labels[key] = val[lang] || val.en;
  }
  return labels;
}
