// Diagnostic Quiz — 9 issue categories with follow-up questions and exercise recommendations.
// All exercise IDs verified against src/data/programs.js (57 exercises, 9 programs).

export const DIAGNOSTIC_CATEGORIES = [
  // ═══════════════════════════════════════════
  // 1. PULLING ON LEASH
  // ═══════════════════════════════════════════
  {
    id: "pulling",
    emoji: "🐕",
    name: { en: "Pulling on Leash", he: "משיכה ברצועה" },
    description: {
      en: "Your dog drags you on walks or lunges ahead constantly.",
      he: "הכלב גורר אותך בהליכות או מזנק קדימה כל הזמן.",
    },
    followUps: [
      {
        id: "pull_severity",
        question: { en: "How bad is the pulling?", he: "כמה חזקה המשיכה?" },
        options: [
          { id: "mild", label: { en: "Pulls ahead but manageable", he: "מושך קדימה אבל ניתן לשליטה" } },
          { id: "strong", label: { en: "Constant pulling, hard to hold", he: "משיכה מתמדת, קשה להחזיק" } },
          { id: "reactive", label: { en: "Lunges at dogs, people, or squirrels", he: "מזנק לכלבים, אנשים או חתולים" } },
        ],
      },
      {
        id: "pull_when",
        question: { en: "When is it worst?", he: "מתי זה הכי גרוע?" },
        options: [
          { id: "always", label: { en: "From the moment we leave the house", he: "מהרגע שיוצאים מהבית" } },
          { id: "triggers", label: { en: "Only near other dogs or distractions", he: "רק ליד כלבים אחרים או הסחות" } },
          { id: "excited", label: { en: "When excited (new places, smells)", he: "כשמתרגש (מקומות חדשים, ריחות)" } },
        ],
      },
    ],
    recommendedProgram: "foundations",
    exercises: [
      { id: "f1c", reason: { en: "Builds focus on you instead of distractions", he: "בונה מיקוד עליך במקום על הסחות" } },
      { id: "f3b", reason: { en: "Teaches walking without pulling", he: "מלמד הליכה בלי משיכה" } },
      { id: "f2c", reason: { en: "Hand targeting keeps attention on you", he: "מיקוד על היד שומר על תשומת הלב עליך" } },
      { id: "lr1b", reason: { en: "Emergency escape when they lock onto something", he: "בריחת חירום כשהם ננעלים על משהו" } },
      { id: "lr1a", reason: { en: "Teaches looking at triggers calmly", he: "מלמד להסתכל על גירויים ברוגע" } },
    ],
    conditionalExercises: {
      "pull_severity:reactive": [
        { id: "lr1c", reason: { en: "Find the distance where your dog can stay calm", he: "מצא את המרחק שבו הכלב יכול להישאר רגוע" } },
        { id: "lr2a", reason: { en: "Walk parallel to triggers safely", he: "הלך במקביל לגירויים בבטחה" } },
      ],
    },
    timeEstimate: { en: "2-4 weeks of daily practice", he: "2-4 שבועות של תרגול יומי" },
    quickTips: [
      { en: "Stop moving every time the leash goes tight. Wait for slack, then walk.", he: "עצור כל פעם שהרצועה נמתחת. חכה לרפיון, ואז המשך." },
      { en: "Use a front-clip harness — it redirects pulling toward you.", he: "השתמש ברתמה קדמית — היא מפנה את המשיכה לכיוונך." },
      { en: "Keep sessions short (5-10 min). Quality beats distance.", he: "שמור על אימונים קצרים (5-10 דקות). איכות עדיפה על מרחק." },
    ],
  },

  // ═══════════════════════════════════════════
  // 2. WON'T COME WHEN CALLED
  // ═══════════════════════════════════════════
  {
    id: "recall",
    emoji: "📢",
    name: { en: "Won't Come When Called", he: "לא בא כשקוראים" },
    description: {
      en: "Your dog ignores you or runs the other way when you call.",
      he: "הכלב מתעלם ממך או רץ לכיוון ההפוך כשקוראים לו.",
    },
    followUps: [
      {
        id: "recall_where",
        question: { en: "Where does recall fail?", he: "איפה החזרה נכשלת?" },
        options: [
          { id: "everywhere", label: { en: "Everywhere, even at home", he: "בכל מקום, גם בבית" } },
          { id: "outside", label: { en: "Fine indoors, ignores me outside", he: "בסדר בבית, מתעלם בחוץ" } },
          { id: "distractions", label: { en: "Only when distracted (dogs, squirrels)", he: "רק כשיש הסחות (כלבים, חתולים)" } },
        ],
      },
      {
        id: "recall_response",
        question: { en: "What happens when you call?", he: "מה קורה כשאתה קורא?" },
        options: [
          { id: "ignores", label: { en: "Completely ignores me", he: "מתעלם לגמרי" } },
          { id: "looks", label: { en: "Looks at me but doesn't come", he: "מסתכל עליי אבל לא בא" } },
          { id: "runs", label: { en: "Runs away — thinks it's a game", he: "בורח — חושב שזה משחק" } },
        ],
      },
    ],
    recommendedProgram: "foundations",
    exercises: [
      { id: "f1a", reason: { en: "Your dog must know their name first", he: "הכלב חייב להכיר את שמו קודם" } },
      { id: "f1c", reason: { en: "Builds the habit of looking at you", he: "בונה את ההרגל להסתכל עליך" } },
      { id: "f3a", reason: { en: "The core recall exercise — start on a long leash", he: "תרגיל החזרה המרכזי — התחל על רצועה ארוכה" } },
      { id: "o3a", reason: { en: "Advanced recall with distance on a long line", he: "חזרה מתקדמת עם מרחק על רצועה ארוכה" } },
      { id: "o3c", reason: { en: "Teaches your dog to check in with you voluntarily", he: "מלמד את הכלב לבדוק אותך מרצון" } },
    ],
    conditionalExercises: {
      "recall_where:everywhere": [
        { id: "f2c", reason: { en: "Hand target builds engagement from scratch", he: "מיקוד יד בונה מעורבות מאפס" } },
      ],
    },
    timeEstimate: { en: "3-6 weeks of consistent practice", he: "3-6 שבועות של תרגול עקבי" },
    quickTips: [
      { en: "Never call your dog to you for something unpleasant (bath, leaving park).", he: "לעולם אל תקרא לכלב אליך למשהו לא נעים (אמבטיה, עזיבת פארק)." },
      { en: "Make every recall a party — highest value treats, excited voice.", he: "הפוך כל חזרה למסיבה — חטיפים הכי טובים, קול נלהב." },
      { en: "Never chase your dog. Run the OTHER direction — they'll chase you.", he: "לעולם אל תרדוף אחרי הכלב. רוץ לכיוון ההפוך — הם ירדפו אחריך." },
    ],
  },

  // ═══════════════════════════════════════════
  // 3. JUMPING ON PEOPLE
  // ═══════════════════════════════════════════
  {
    id: "jumping",
    emoji: "🦘",
    name: { en: "Jumping on People", he: "קפיצה על אנשים" },
    description: {
      en: "Your dog jumps up on you, guests, or strangers to greet them.",
      he: "הכלב קופץ עליך, על אורחים או על זרים כדי לברך אותם.",
    },
    followUps: [
      {
        id: "jump_who",
        question: { en: "Who does your dog jump on?", he: "על מי הכלב קופץ?" },
        options: [
          { id: "everyone", label: { en: "Everyone — family, guests, strangers", he: "כולם — משפחה, אורחים, זרים" } },
          { id: "guests", label: { en: "Mostly guests and new people", he: "בעיקר אורחים ואנשים חדשים" } },
          { id: "owner", label: { en: "Mainly on me when I come home", he: "בעיקר עליי כשאני חוזר הביתה" } },
        ],
      },
      {
        id: "jump_size",
        question: { en: "How big is your dog?", he: "כמה גדול הכלב?" },
        options: [
          { id: "small", label: { en: "Small (under 25 lbs / 12 kg)", he: "קטן (מתחת ל-12 ק\"ג)" } },
          { id: "medium", label: { en: "Medium (25-55 lbs / 12-25 kg)", he: "בינוני (12-25 ק\"ג)" } },
          { id: "large", label: { en: "Large (over 55 lbs / 25 kg)", he: "גדול (מעל 25 ק\"ג)" } },
        ],
      },
    ],
    recommendedProgram: "behavior",
    exercises: [
      { id: "f1b", reason: { en: "Sit is the alternative behavior to jumping", he: "שב הוא ההתנהגות החלופית לקפיצה" } },
      { id: "b2a", reason: { en: "Directly addresses jumping with real solutions", he: "מטפל ישירות בקפיצות עם פתרונות אמיתיים" } },
      { id: "b1a", reason: { en: "Teaches impulse control around exciting things", he: "מלמד שליטה עצמית סביב דברים מרגשים" } },
      { id: "o2a", reason: { en: "Polite greeting protocol for meeting people", he: "פרוטוקול ברכה מנומסת לפגישת אנשים" } },
      { id: "b1c", reason: { en: "Learn to be calm on cue during greetings", he: "ללמוד להיות רגוע בפקודה במהלך ברכות" } },
    ],
    conditionalExercises: {},
    timeEstimate: { en: "1-3 weeks with consistent rules", he: "1-3 שבועות עם כללים עקביים" },
    quickTips: [
      { en: "Turn your back and cross your arms when they jump. Zero attention until four paws on the floor.", he: "הפנה את הגב וחבק ידיים כשהם קופצים. אפס תשומת לב עד שארבע כפות על הרצפה." },
      { en: "Ask every person to wait for a sit before petting. Consistency is everything.", he: "בקש מכל אדם לחכות לשב לפני ליטוף. עקביות היא הכל." },
      { en: "Keep a leash on indoors when guests arrive for easy management.", he: "שמור רצועה בבית כשאורחים מגיעים לניהול קל." },
    ],
  },

  // ═══════════════════════════════════════════
  // 4. EXCESSIVE BARKING
  // ═══════════════════════════════════════════
  {
    id: "barking",
    emoji: "🔊",
    name: { en: "Excessive Barking", he: "נביחות מוגזמות" },
    description: {
      en: "Your dog barks at everything — doorbell, noises, people passing, or for attention.",
      he: "הכלב נובח על הכל — פעמון, רעשים, אנשים שעוברים, או לתשומת לב.",
    },
    followUps: [
      {
        id: "bark_trigger",
        question: { en: "What triggers the barking?", he: "מה מפעיל את הנביחות?" },
        options: [
          { id: "doorbell", label: { en: "Doorbell, knocking, or visitors", he: "פעמון, דפיקות או אורחים" } },
          { id: "outside", label: { en: "Things outside (people, dogs, cars)", he: "דברים בחוץ (אנשים, כלבים, מכוניות)" } },
          { id: "attention", label: { en: "Barks at me for attention or food", he: "נובח עליי לתשומת לב או אוכל" } },
          { id: "alone", label: { en: "Barks when left alone", he: "נובח כשנשאר לבד" } },
        ],
      },
      {
        id: "bark_intensity",
        question: { en: "How intense is it?", he: "כמה אינטנסיבי?" },
        options: [
          { id: "brief", label: { en: "A few barks, then settles", he: "כמה נביחות, ואז נרגע" } },
          { id: "extended", label: { en: "Goes on for minutes, hard to stop", he: "נמשך דקות, קשה לעצור" } },
          { id: "frantic", label: { en: "Frantic, non-stop, sometimes with spinning", he: "מטורף, בלי הפסקה, לפעמים עם סיבוב" } },
        ],
      },
    ],
    recommendedProgram: "behavior",
    exercises: [
      { id: "b2b", reason: { en: "Teaches 'quiet' on cue properly", he: "מלמד 'שקט' בפקודה כמו שצריך" } },
      { id: "f1c", reason: { en: "Redirects focus from trigger to you", he: "מפנה מיקוד מהגירוי אליך" } },
      { id: "b1c", reason: { en: "Teaches calm as a default state", he: "מלמד רוגע כמצב ברירת מחדל" } },
      { id: "f3c", reason: { en: "Go to bed gives them a job during triggers", he: "לך למיטה נותן להם משימה בזמן גירויים" } },
      { id: "f2b", reason: { en: "Impulse control helps resist reacting", he: "שליטה עצמית עוזרת להתנגד לתגובה" } },
    ],
    conditionalExercises: {
      "bark_trigger:alone": [
        { id: "cr2a", reason: { en: "Build comfort with closed doors", he: "בנה נוחות עם דלתות סגורות" } },
        { id: "cr2b", reason: { en: "Practice being alone gradually", he: "תרגל להיות לבד בהדרגה" } },
      ],
      "bark_trigger:outside": [
        { id: "lr1a", reason: { en: "Engage-disengage teaches calm observation", he: "אנגייג'-דיסאנגייג' מלמד תצפית רגועה" } },
      ],
    },
    timeEstimate: { en: "2-6 weeks depending on the trigger", he: "2-6 שבועות בהתאם לגירוי" },
    quickTips: [
      { en: "Never yell 'quiet' — to your dog, you're just barking along with them.", he: "לעולם אל תצעק 'שקט' — לכלב שלך, אתה פשוט נובח איתם." },
      { en: "Reward silence. Catch them being quiet near a trigger and treat immediately.", he: "תגמל שתיקה. תפוס אותם שקטים ליד גירוי ותגמל מיד." },
      { en: "Block the view if they bark at things outside the window. Out of sight, out of mind.", he: "חסום את הנוף אם הם נובחים על דברים מחוץ לחלון. מחוץ לעין, מחוץ ללב." },
    ],
  },

  // ═══════════════════════════════════════════
  // 5. POTTY ACCIDENTS
  // ═══════════════════════════════════════════
  {
    id: "potty",
    emoji: "💧",
    name: { en: "Potty Accidents", he: "תאונות צרכים" },
    description: {
      en: "Your dog has accidents inside the house or isn't fully housetrained.",
      he: "הכלב עושה צרכים בבית או לא מאומן לחלוטין.",
    },
    followUps: [
      {
        id: "potty_age",
        question: { en: "How old is your dog?", he: "בן כמה הכלב?" },
        options: [
          { id: "puppy", label: { en: "Under 6 months", he: "מתחת ל-6 חודשים" } },
          { id: "young", label: { en: "6-12 months", he: "6-12 חודשים" } },
          { id: "adult", label: { en: "Over 1 year", he: "מעל שנה" } },
        ],
      },
      {
        id: "potty_pattern",
        question: { en: "What's the pattern?", he: "מה הדפוס?" },
        options: [
          { id: "random", label: { en: "Seems random, no pattern", he: "נראה אקראי, בלי דפוס" } },
          { id: "specific", label: { en: "Always in the same spot", he: "תמיד באותו מקום" } },
          { id: "excitement", label: { en: "When excited, scared, or during play", he: "כשמתרגש, נפחד, או במהלך משחק" } },
          { id: "alone", label: { en: "Only when left alone", he: "רק כשנשאר לבד" } },
        ],
      },
    ],
    recommendedProgram: "potty",
    exercises: [
      { id: "pt1a", reason: { en: "A consistent schedule prevents 80% of accidents", he: "לוח זמנים עקבי מונע 80% מהתאונות" } },
      { id: "pt1b", reason: { en: "Teach a potty cue so they go on command", he: "למד מילת פקודה כדי שיעשו בפקודה" } },
      { id: "pt1c", reason: { en: "Supervision prevents practice of bad habits", he: "פיקוח מונע תרגול של הרגלים רעים" } },
      { id: "pt2b", reason: { en: "How to handle accidents without setbacks", he: "איך לטפל בתאונות בלי נסיגות" } },
      { id: "pt2a", reason: { en: "Teach them to signal when they need to go", he: "למד אותם לאותת כשצריכים לצאת" } },
    ],
    conditionalExercises: {
      "potty_pattern:alone": [
        { id: "cr1a", reason: { en: "Crate training prevents unsupervised accidents", he: "אימון כלוב מונע תאונות ללא פיקוח" } },
        { id: "cr2a", reason: { en: "Build comfort alone to reduce anxiety accidents", he: "בנה נוחות לבד כדי להפחית תאונות חרדה" } },
      ],
    },
    timeEstimate: { en: "2-8 weeks depending on age and consistency", he: "2-8 שבועות בהתאם לגיל ועקביות" },
    quickTips: [
      { en: "Take them out after every meal, nap, play session, and every 2 hours.", he: "הוציאו אותם אחרי כל ארוחה, תנומה, משחק, וכל שעתיים." },
      { en: "Use enzymatic cleaner on accident spots — regular cleaners leave scent traces.", he: "השתמש בחומר ניקוי אנזימטי — מנקים רגילים משאירים עקבות ריח." },
      { en: "Never punish accidents. Clean quietly, adjust the schedule.", he: "לעולם אל תעניש על תאונות. נקה בשקט, התאם את לוח הזמנים." },
    ],
  },

  // ═══════════════════════════════════════════
  // 6. SEPARATION ANXIETY / BEING ALONE
  // ═══════════════════════════════════════════
  {
    id: "separation",
    emoji: "😰",
    name: { en: "Can't Be Left Alone", he: "לא יכול להישאר לבד" },
    description: {
      en: "Your dog panics, destroys things, barks, or has accidents when left alone.",
      he: "הכלב נכנס לפאניקה, הורס דברים, נובח או עושה צרכים כשנשאר לבד.",
    },
    followUps: [
      {
        id: "sep_symptoms",
        question: { en: "What happens when you leave?", he: "מה קורה כשאתה עוזב?" },
        options: [
          { id: "barking", label: { en: "Barking or howling non-stop", he: "נביחות או יללות בלי הפסקה" } },
          { id: "destructive", label: { en: "Destroys furniture, doors, or items", he: "הורס רהיטים, דלתות או חפצים" } },
          { id: "pacing", label: { en: "Pacing, drooling, or panting", he: "הליכה חסרת מנוח, ריור או התנשפות" } },
          { id: "potty", label: { en: "Has potty accidents (housetrained otherwise)", he: "עושה צרכים (מאומן בדרך כלל)" } },
        ],
      },
      {
        id: "sep_duration",
        question: { en: "How long can they be alone?", he: "כמה זמן יכולים להישאר לבד?" },
        options: [
          { id: "zero", label: { en: "Can't even leave the room", he: "לא יכול אפילו לעזוב את החדר" } },
          { id: "minutes", label: { en: "A few minutes, then it starts", he: "כמה דקות, ואז זה מתחיל" } },
          { id: "hour", label: { en: "About an hour, then breaks down", he: "בערך שעה, ואז קורס" } },
        ],
      },
    ],
    recommendedProgram: "crate",
    exercises: [
      { id: "cr1a", reason: { en: "Create a positive safe space", he: "צור מרחב בטוח וחיובי" } },
      { id: "cr1b", reason: { en: "Associate the crate with good things", he: "שייך את הכלוב לדברים טובים" } },
      { id: "cr2a", reason: { en: "Practice being in a closed space calmly", he: "תרגל להיות במרחב סגור ברוגע" } },
      { id: "cr2b", reason: { en: "Build tolerance to you leaving the room", he: "בנה סבילות לעזיבתך את החדר" } },
      { id: "f3c", reason: { en: "Place training builds independence and calm", he: "אימון מקום בונה עצמאות ורוגע" } },
      { id: "b1c", reason: { en: "Calm on cue helps manage pre-departure anxiety", he: "רוגע בפקודה עוזר לנהל חרדת פרידה" } },
    ],
    conditionalExercises: {
      "sep_duration:zero": [
        { id: "cr1c", reason: { en: "Start with the crate cue — make it the happiest word", he: "התחל עם פקודת הכלוב — הפוך אותה למילה הכי שמחה" } },
      ],
    },
    timeEstimate: { en: "4-12 weeks (go very slowly)", he: "4-12 שבועות (התקדם לאט מאוד)" },
    quickTips: [
      { en: "Never make departures emotional. Leave calmly — no long goodbyes.", he: "לעולם אל תהפוך יציאות לרגשיות. עזוב ברוגע — בלי פרידות ארוכות." },
      { en: "Practice leaving for 1 second, then 5, then 30. Build duration very slowly.", he: "תרגל עזיבה לשנייה, אז 5, אז 30. בנה משך לאט מאוד." },
      { en: "A frozen Kong or lick mat when you leave gives them a positive association.", he: "קונג קפוא או מזרן ליקוק כשאתה עוזב נותן אסוציאציה חיובית." },
    ],
  },

  // ═══════════════════════════════════════════
  // 7. REACTIVITY TO DOGS OR PEOPLE
  // ═══════════════════════════════════════════
  {
    id: "reactivity",
    emoji: "⚡",
    name: { en: "Reactive to Dogs or People", he: "תגובתיות לכלבים או אנשים" },
    description: {
      en: "Your dog lunges, barks, or growls at other dogs or people on walks.",
      he: "הכלב מזנק, נובח או נוהם לכלבים אחרים או אנשים בהליכות.",
    },
    followUps: [
      {
        id: "react_target",
        question: { en: "What triggers the reaction?", he: "מה מפעיל את התגובה?" },
        options: [
          { id: "dogs", label: { en: "Other dogs", he: "כלבים אחרים" } },
          { id: "people", label: { en: "Strangers or specific people", he: "זרים או אנשים מסוימים" } },
          { id: "both", label: { en: "Both dogs and people", he: "גם כלבים וגם אנשים" } },
        ],
      },
      {
        id: "react_type",
        question: { en: "What does the reaction look like?", he: "איך נראית התגובה?" },
        options: [
          { id: "frustrated", label: { en: "Pulling and barking — wants to get closer", he: "מושך ונובח — רוצה להתקרב" } },
          { id: "fearful", label: { en: "Barking and backing away — seems scared", he: "נובח ונסוג — נראה מפוחד" } },
          { id: "aggressive", label: { en: "Growling, lunging, hackles up", he: "נהימה, זינוק, שערות זקופות" } },
        ],
      },
    ],
    recommendedProgram: "reactivity",
    exercises: [
      { id: "lr1a", reason: { en: "Core tool: look at the trigger, look at me, get a treat", he: "כלי מרכזי: הסתכל על הגירוי, הסתכל עליי, קבל חטיף" } },
      { id: "lr1b", reason: { en: "Your escape plan when things get too close", he: "תוכנית הבריחה שלך כשדברים מתקרבים מדי" } },
      { id: "lr1c", reason: { en: "Find exactly where your dog can stay calm", he: "מצא בדיוק איפה הכלב יכול להישאר רגוע" } },
      { id: "lr2a", reason: { en: "Walk in the same direction, not toward triggers", he: "הלך באותו כיוון, לא לעבר גירויים" } },
      { id: "lr2b", reason: { en: "Understand how stress accumulates in your dog", he: "הבן איך לחץ מצטבר אצל הכלב" } },
      { id: "lr2c", reason: { en: "Decompression walks lower stress hormones", he: "הליכות דה-קומפרסיה מורידות הורמוני לחץ" } },
    ],
    conditionalExercises: {
      "react_type:fearful": [
        { id: "sc1a", reason: { en: "Rebuild confidence with surface exploration", he: "בנה מחדש ביטחון עם חקירת משטחים" } },
        { id: "sc2b", reason: { en: "Gradual exposure to new environments", he: "חשיפה הדרגתית לסביבות חדשות" } },
      ],
    },
    timeEstimate: { en: "4-12 weeks (ongoing maintenance)", he: "4-12 שבועות (תחזוקה מתמשכת)" },
    quickTips: [
      { en: "Distance is your best tool. If your dog reacts, you're too close.", he: "מרחק הוא הכלי הכי טוב שלך. אם הכלב מגיב, אתה קרוב מדי." },
      { en: "Cross the street, turn around, or hide behind a car. Avoid triggers while training.", he: "חצה את הרחוב, הסתובב, או התחבא מאחורי מכונית. הימנע מגירויים בזמן אימון." },
      { en: "After a reactive incident, give 24-48 hours of calm decompression.", he: "אחרי אירוע תגובתי, תן 24-48 שעות של דה-קומפרסיה רגועה." },
    ],
  },

  // ═══════════════════════════════════════════
  // 8. IGNORES COMMANDS / WON'T LISTEN
  // ═══════════════════════════════════════════
  {
    id: "focus",
    emoji: "🙉",
    name: { en: "Ignores Commands", he: "מתעלם מפקודות" },
    description: {
      en: "Your dog knows the commands but doesn't listen, especially with distractions.",
      he: "הכלב מכיר את הפקודות אבל לא מקשיב, במיוחד עם הסחות.",
    },
    followUps: [
      {
        id: "focus_when",
        question: { en: "When does your dog listen?", he: "מתי הכלב מקשיב?" },
        options: [
          { id: "treats", label: { en: "Only when I have treats visible", he: "רק כשיש חטיפים גלויים" } },
          { id: "home", label: { en: "At home but not outside", he: "בבית אבל לא בחוץ" } },
          { id: "never", label: { en: "Barely listens anywhere", he: "כמעט לא מקשיב בכלל" } },
        ],
      },
      {
        id: "focus_trained",
        question: { en: "How was the training done?", he: "איך נעשה האימון?" },
        options: [
          { id: "self", label: { en: "I trained at home myself", he: "אימנתי בבית בעצמי" } },
          { id: "class", label: { en: "Went to a group class", he: "הלכתי לשיעור קבוצתי" } },
          { id: "minimal", label: { en: "Not much formal training", he: "לא הרבה אימון פורמלי" } },
        ],
      },
    ],
    recommendedProgram: "obedience",
    exercises: [
      { id: "f1c", reason: { en: "Rebuild the foundation: attention on you", he: "בנה מחדש את הבסיס: תשומת לב עליך" } },
      { id: "f1a", reason: { en: "Make sure name recognition is solid", he: "וודא שזיהוי השם חזק" } },
      { id: "o1a", reason: { en: "Practice commands at increasing distance", he: "תרגל פקודות במרחק הולך וגדל" } },
      { id: "o1c", reason: { en: "Build reliability around real-world distractions", he: "בנה אמינות סביב הסחות מהעולם האמיתי" } },
      { id: "f2a", reason: { en: "Stay teaches impulse control and patience", he: "הישאר מלמד שליטה עצמית וסבלנות" } },
    ],
    conditionalExercises: {
      "focus_when:never": [
        { id: "f2c", reason: { en: "Start from scratch with hand targeting", he: "התחל מאפס עם מיקוד על היד" } },
        { id: "f1b", reason: { en: "Rebuild sit with high-value rewards", he: "בנה מחדש שב עם תגמולים איכותיים" } },
      ],
    },
    timeEstimate: { en: "2-4 weeks of focused practice", he: "2-4 שבועות של תרגול ממוקד" },
    quickTips: [
      { en: "Say the command ONCE. Repeating teaches them to ignore the first time.", he: "אמור את הפקודה פעם אחת. חזרה מלמדת אותם להתעלם מהפעם הראשונה." },
      { en: "Increase difficulty gradually: quiet room → backyard → park → busy street.", he: "הגדל קושי בהדרגה: חדר שקט ← חצר ← פארק ← רחוב סואן." },
      { en: "Fade treats by rewarding unpredictably — sometimes treat, sometimes just praise.", he: "הפחת חטיפים בתגמול לא צפוי — לפעמים חטיף, לפעמים רק שבח." },
    ],
  },

  // ═══════════════════════════════════════════
  // 9. FEARFUL / ANXIOUS BEHAVIOR
  // ═══════════════════════════════════════════
  {
    id: "fearful",
    emoji: "🫣",
    name: { en: "Fearful or Anxious", he: "מפוחד או חרד" },
    description: {
      en: "Your dog is scared of noises, new people, new places, or specific situations.",
      he: "הכלב מפחד מרעשים, אנשים חדשים, מקומות חדשים, או מצבים מסוימים.",
    },
    followUps: [
      {
        id: "fear_trigger",
        question: { en: "What scares your dog most?", he: "ממה הכלב הכי מפחד?" },
        options: [
          { id: "sounds", label: { en: "Loud sounds (thunder, fireworks, traffic)", he: "רעשים חזקים (רעמים, זיקוקים, תנועה)" } },
          { id: "people", label: { en: "New or unfamiliar people", he: "אנשים חדשים או לא מוכרים" } },
          { id: "places", label: { en: "New environments or surfaces", he: "סביבות או משטחים חדשים" } },
          { id: "handling", label: { en: "Being touched, groomed, or examined", he: "מגע, טיפוח או בדיקה" } },
        ],
      },
      {
        id: "fear_response",
        question: { en: "How does your dog react?", he: "איך הכלב מגיב?" },
        options: [
          { id: "freeze", label: { en: "Freezes or tries to hide", he: "קופא או מנסה להתחבא" } },
          { id: "flee", label: { en: "Tries to run away or escape", he: "מנסה לברוח" } },
          { id: "shake", label: { en: "Trembling, panting, won't eat", he: "רועד, מתנשף, לא אוכל" } },
        ],
      },
    ],
    recommendedProgram: "social",
    exercises: [
      { id: "sc1a", reason: { en: "Build confidence through safe surface exploration", he: "בנה ביטחון דרך חקירת משטחים בטוחה" } },
      { id: "sc1b", reason: { en: "Gradual sound exposure at safe volumes", he: "חשיפה הדרגתית לצלילים בעוצמות בטוחות" } },
      { id: "sc1c", reason: { en: "Gentle handling builds trust", he: "מגע עדין בונה אמון" } },
      { id: "sc2b", reason: { en: "Introduce new places at the dog's pace", he: "הכר מקומות חדשים בקצב של הכלב" } },
      { id: "f2c", reason: { en: "Touch targeting gives them something to focus on", he: "מיקוד מגע נותן להם משהו להתמקד בו" } },
    ],
    conditionalExercises: {
      "fear_trigger:people": [
        { id: "sc2a", reason: { en: "Controlled exposure to different people", he: "חשיפה מבוקרת לאנשים שונים" } },
      ],
      "fear_trigger:handling": [
        { id: "sc1c", reason: { en: "Desensitize to touch gradually with high rewards", he: "הרגל למגע בהדרגה עם תגמולים גבוהים" } },
      ],
      "fear_trigger:sounds": [
        { id: "sc1b", reason: { en: "Sound desensitization is the core skill here", he: "הרגלה לצלילים הוא הכישור המרכזי כאן" } },
      ],
    },
    timeEstimate: { en: "4-16 weeks (patience is key)", he: "4-16 שבועות (סבלנות היא המפתח)" },
    quickTips: [
      { en: "Never force your dog to face their fears. Let them choose to approach at their pace.", he: "לעולם אל תכריח את הכלב להתמודד עם הפחדים. תן לו לבחור להתקרב בקצב שלו." },
      { en: "Create distance from scary things. Far enough that they notice but don't panic.", he: "צור מרחק מדברים מפחידים. רחוק מספיק שישימו לב אבל לא ייכנסו לפאניקה." },
      { en: "Pair scary things with amazing treats. Sound = chicken. Person = cheese.", he: "שייך דברים מפחידים עם חטיפים מדהימים. צליל = עוף. אדם = גבינה." },
    ],
  },
];

// Helper: get exercises for a category based on follow-up answers
export function getDiagnosticExercises(categoryId, answers = {}) {
  const cat = DIAGNOSTIC_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return [];

  const base = [...cat.exercises];

  // Add conditional exercises based on answers
  for (const [condition, exercises] of Object.entries(cat.conditionalExercises || {})) {
    const [questionId, answerId] = condition.split(":");
    if (answers[questionId] === answerId) {
      for (const ex of exercises) {
        if (!base.some(b => b.id === ex.id)) {
          base.push(ex);
        }
      }
    }
  }

  return base;
}

// Helper: get category by ID
export function getDiagnosticCategory(categoryId) {
  return DIAGNOSTIC_CATEGORIES.find(c => c.id === categoryId) || null;
}
