// Emergency First Aid Quick Reference — offline-ready, bilingual EN/HE

export const SEVERITY_ORDER = ["critical", "moderate", "low"];

export const EMERGENCY_GUIDES = [
  // ── CRITICAL ──
  {
    id: "choking",
    emoji: "😰",
    severity: "critical",
    name: { en: "Choking", he: "חנק" },
    description: {
      en: "Dog is gagging, pawing at mouth, or unable to breathe. Requires immediate action.",
      he: "הכלב משתעל בחוזקה, מגרד את הפה או לא מצליח לנשום. דורש פעולה מיידית.",
    },
    steps: [
      { en: "Stay calm. Restrain the dog gently — a panicking dog may bite.", he: "הישארו רגועים. החזיקו את הכלב בעדינות — כלב בפאניקה עלול לנשוך." },
      { en: "Open the mouth and look for the object. If visible, try to remove it with your fingers or pliers.", he: "פתחו את הפה וחפשו את החפץ. אם נראה, נסו להוציא אותו עם אצבעות או מלקחיים." },
      { en: "For small dogs: hold upside down by the hind legs and shake gently.", he: "לכלבים קטנים: החזיקו הפוך מהרגליים האחוריות ונערו בעדינות." },
      { en: "For large dogs: perform the Heimlich maneuver — place fist below the rib cage and push up and forward firmly.", he: "לכלבים גדולים: בצעו תמרון היימליך — הניחו אגרוף מתחת לכלוב הצלעות ולחצו למעלה וקדימה בחוזקה." },
      { en: "If the dog loses consciousness, perform CPR and rush to the vet.", he: "אם הכלב מאבד הכרה, בצעו החייאה ומהרו לוטרינר." },
    ],
    warning: {
      en: "Do NOT push the object deeper. If you can't remove it within 1-2 minutes, drive to the emergency vet immediately.",
      he: "אל תדחפו את החפץ פנימה. אם לא מצליחים להוציא תוך 1-2 דקות, סעו לוטרינר חירום מיד.",
    },
  },
  {
    id: "heatstroke",
    emoji: "🌡️",
    severity: "critical",
    name: { en: "Heatstroke", he: "מכת חום" },
    description: {
      en: "Heavy panting, drooling, bright red tongue, vomiting, or collapse. Can be fatal within minutes.",
      he: "נשיפות כבדות, ריור, לשון אדומה בוהקת, הקאות או קריסה. עלול להיות קטלני תוך דקות.",
    },
    steps: [
      { en: "Move the dog to shade or air conditioning immediately.", he: "העבירו את הכלב לצל או למיזוג אוויר מיד." },
      { en: "Apply cool (NOT ice-cold) water to the neck, armpits, and groin.", he: "מרחו מים קרירים (לא קרח) על הצוואר, בתי השחי והמפשעות." },
      { en: "Place wet towels on the dog, replacing them every few minutes (warm towels trap heat).", he: "הניחו מגבות רטובות על הכלב, החליפו כל כמה דקות (מגבות חמות כולאות חום)." },
      { en: "Offer small amounts of cool water to drink. Do not force.", he: "הציעו כמויות קטנות של מים קרירים לשתייה. אל תכריחו." },
      { en: "Take rectal temperature if possible. Stop cooling at 39.4°C (103°F).", he: "מדדו חום רקטלי אם אפשר. הפסיקו לקרר ב-39.4°C." },
      { en: "Transport to vet immediately, even if the dog seems to recover.", he: "הסיעו לוטרינר מיד, גם אם הכלב נראה מתאושש." },
    ],
    warning: {
      en: "Never use ice or ice-cold water — it causes blood vessels to constrict and traps heat inside. Brachycephalic breeds (bulldogs, pugs) are at higher risk.",
      he: "לעולם אל תשתמשו בקרח או מים קפואים — זה גורם לכיווץ כלי דם וכולא חום בפנים. גזעים ברכיצפליים (בולדוגים, פאגים) בסיכון גבוה יותר.",
    },
  },
  {
    id: "poisoning",
    emoji: "☠️",
    severity: "critical",
    name: { en: "Poisoning", he: "הרעלה" },
    description: {
      en: "Vomiting, diarrhea, drooling, seizures, or lethargy after eating something toxic.",
      he: "הקאות, שלשול, ריור, פרכוסים או עייפות לאחר אכילת משהו רעיל.",
    },
    steps: [
      { en: "Identify the substance if possible. Save the packaging or take a photo.", he: "זהו את החומר אם אפשר. שמרו את האריזה או צלמו." },
      { en: "Call the poison control hotline or your vet immediately.", he: "התקשרו למוקד הרעלות או לוטרינר מיד." },
      { en: "Do NOT induce vomiting unless specifically told to by a vet.", he: "אל תגרמו להקאה אלא אם הוטרינר הורה לכם במפורש." },
      { en: "Keep the dog calm and still. Monitor breathing.", he: "שמרו על הכלב רגוע ושקט. עקבו אחר הנשימה." },
      { en: "Transport to the vet with the substance/packaging.", he: "הסיעו לוטרינר עם החומר/האריזה." },
    ],
    warning: {
      en: "Common household toxins: chocolate, xylitol (sugar-free gum), grapes/raisins, onions, garlic, rat poison, antifreeze, certain plants.",
      he: "רעלים ביתיים נפוצים: שוקולד, קסיליטול (מסטיק ללא סוכר), ענבים/צימוקים, בצל, שום, רעל עכברים, נוזל קירור, צמחים מסוימים.",
    },
  },
  {
    id: "bloat",
    emoji: "🫧",
    severity: "critical",
    name: { en: "Bloat (GDV)", he: "נפיחות קיבה (GDV)" },
    description: {
      en: "Swollen abdomen, restlessness, unproductive retching, drooling. Life-threatening — stomach may twist.",
      he: "בטן נפוחה, חוסר מנוחה, ניסיונות הקאה ללא תוצאה, ריור. מסכן חיים — הקיבה עלולה להתהפך.",
    },
    steps: [
      { en: "Do NOT wait. This is the most time-critical emergency.", he: "אל תחכו. זו חירום הכי רגיש לזמן." },
      { en: "Do not give food or water.", he: "אל תיתנו אוכל או מים." },
      { en: "Do not attempt to relieve the gas yourself.", he: "אל תנסו לשחרר את הגז בעצמכם." },
      { en: "Drive to the nearest emergency vet immediately.", he: "סעו לוטרינר חירום הקרוב מיד." },
      { en: "Call ahead so they can prepare for surgery.", he: "התקשרו מראש כדי שיוכלו להתכונן לניתוח." },
    ],
    warning: {
      en: "Bloat can kill within hours. Deep-chested breeds (Great Danes, German Shepherds, Standard Poodles) are most at risk. Avoid exercise 1 hour after meals.",
      he: "נפיחות יכולה להרוג תוך שעות. גזעים עם חזה עמוק (דני ענק, רועה גרמני, פודל סטנדרטי) בסיכון הגבוה ביותר. הימנעו מפעילות שעה אחרי ארוחות.",
    },
  },

  // ── MODERATE ──
  {
    id: "seizures",
    emoji: "⚡",
    severity: "moderate",
    name: { en: "Seizures", he: "פרכוסים" },
    description: {
      en: "Uncontrolled shaking, loss of consciousness, paddling legs, drooling.",
      he: "רעד בלתי נשלט, אובדן הכרה, תנועות רגליים, ריור.",
    },
    steps: [
      { en: "Do NOT restrain the dog or put anything in its mouth.", he: "אל תחזיקו את הכלב ואל תכניסו שום דבר לפה." },
      { en: "Move nearby objects to prevent injury.", he: "הזיזו חפצים קרובים למניעת פציעה." },
      { en: "Time the seizure. If over 5 minutes, it's an emergency.", he: "מדדו את זמן הפרכוס. אם מעל 5 דקות, זו חירום." },
      { en: "Keep the room quiet and dark.", he: "שמרו על החדר שקט וחשוך." },
      { en: "After the seizure, comfort the dog gently and call your vet.", he: "אחרי הפרכוס, הרגיעו את הכלב בעדינות והתקשרו לוטרינר." },
    ],
    warning: {
      en: "A single short seizure (<2 min) is usually not immediately life-threatening but always warrants a vet visit. Multiple seizures or one lasting >5 min is an emergency.",
      he: "פרכוס קצר בודד (פחות מ-2 דקות) בדרך כלל לא מסכן חיים מיידית אבל תמיד דורש ביקור וטרינר. פרכוסים מרובים או אחד שנמשך מעל 5 דקות הוא חירום.",
    },
  },
  {
    id: "snake_bite",
    emoji: "🐍",
    severity: "moderate",
    name: { en: "Snake Bite", he: "נשיכת נחש" },
    description: {
      en: "Sudden pain, swelling, fang marks, weakness. Common in Israel during warm months.",
      he: "כאב פתאומי, נפיחות, סימני ניבים, חולשה. נפוץ בישראל בחודשים החמים.",
    },
    steps: [
      { en: "Keep the dog calm and still. Carry if possible — movement spreads venom.", he: "שמרו על הכלב רגוע ושקט. נשאו אם אפשר — תנועה מפיצה ארס." },
      { en: "Do NOT suck the venom, apply a tourniquet, or cut the wound.", he: "אל תמצצו את הארס, אל תניחו חוסם עורקים, ואל תחתכו את הפצע." },
      { en: "If safe, photograph the snake for identification.", he: "אם בטוח, צלמו את הנחש לזיהוי." },
      { en: "Remove collar and tight items — swelling will increase.", he: "הסירו צווארון ופריטים צמודים — הנפיחות תגדל." },
      { en: "Transport to vet immediately for antivenom.", he: "הסיעו לוטרינר מיד לקבלת נגד ארס." },
    ],
    warning: {
      en: "In Israel, the Palestine viper (צפע ארצישראלי) is the most dangerous. Time is critical — get to a vet within 1-2 hours.",
      he: "בישראל, הצפע הארצישראלי הוא המסוכן ביותר. הזמן קריטי — הגיעו לוטרינר תוך 1-2 שעות.",
    },
  },
  {
    id: "cuts",
    emoji: "🩸",
    severity: "moderate",
    name: { en: "Cuts & Bleeding", he: "חתכים ודימום" },
    description: {
      en: "Open wound with active bleeding from cut, scrape, or puncture.",
      he: "פצע פתוח עם דימום פעיל מחתך, שריטה או ניקור.",
    },
    steps: [
      { en: "Apply direct pressure with a clean cloth for 5-10 minutes.", he: "הפעילו לחץ ישיר עם בד נקי למשך 5-10 דקות." },
      { en: "Do not remove the cloth — add more layers if needed.", he: "אל תסירו את הבד — הוסיפו שכבות אם צריך." },
      { en: "Once bleeding slows, gently clean with warm water.", he: "כשהדימום מאט, נקו בעדינות עם מים פושרים." },
      { en: "Apply pet-safe antiseptic (NOT hydrogen peroxide).", he: "מרחו חומר חיטוי בטוח לחיות מחמד (לא מי חמצן)." },
      { en: "Bandage loosely. Check toes for swelling (too tight).", he: "חבשו ברפיון. בדקו אצבעות לנפיחות (חבישה הדוקה מדי)." },
      { en: "See a vet for deep wounds, punctures, or if bleeding won't stop.", he: "פנו לוטרינר לפצעים עמוקים, ניקורים, או אם הדימום לא נעצר." },
    ],
    warning: {
      en: "Arterial bleeding (bright red, spurting) is an emergency — maintain pressure and go to the vet immediately.",
      he: "דימום עורקי (אדום בהיר, פורץ) הוא חירום — שמרו על לחץ וסעו לוטרינר מיד.",
    },
  },
  {
    id: "broken_bone",
    emoji: "🦴",
    severity: "moderate",
    name: { en: "Broken Bone", he: "שבר בעצם" },
    description: {
      en: "Limping, swelling, inability to bear weight, visible deformity, crying in pain.",
      he: "צליעה, נפיחות, חוסר יכולת לעמוד, עיוות נראה, בכי מכאב.",
    },
    steps: [
      { en: "Do NOT attempt to set the bone or apply a splint.", he: "אל תנסו ליישר את העצם או להניח סד." },
      { en: "Keep the dog as still as possible.", he: "שמרו על הכלב שקט ככל האפשר." },
      { en: "If the dog is small, place on a flat board or in a box for transport.", he: "אם הכלב קטן, הניחו על לוח שטוח או בקופסה להסעה." },
      { en: "Cover open fractures with a clean cloth without pressing.", he: "כסו שברים פתוחים עם בד נקי בלי ללחוץ." },
      { en: "Transport to the vet carefully, minimizing movement.", he: "הסיעו לוטרינר בזהירות, תוך מזעור תנועה." },
    ],
    warning: {
      en: "A muzzle may be needed — even gentle dogs may bite when in severe pain. Use a soft cloth or bandage as an improvised muzzle.",
      he: "ייתכן שיהיה צורך בזמם — גם כלבים עדינים עלולים לנשוך בכאב חזק. השתמשו בבד רך או תחבושת כזמם מאולתר.",
    },
  },
  {
    id: "eye_injury",
    emoji: "👁️",
    severity: "moderate",
    name: { en: "Eye Injury", he: "פציעת עין" },
    description: {
      en: "Squinting, tearing, redness, swelling, visible foreign object, or pawing at the eye.",
      he: "צמצום עיניים, דמעות, אדמומיות, נפיחות, חפץ זר נראה, או גירוד בעין.",
    },
    steps: [
      { en: "Prevent the dog from rubbing the eye (use an e-collar if available).", he: "מנעו מהכלב לשפשף את העין (השתמשו בצווארון אליזבתני אם זמין)." },
      { en: "For chemicals: flush the eye with clean water for 10-15 minutes.", he: "לחומרים כימיים: שטפו את העין עם מים נקיים 10-15 דקות." },
      { en: "Do NOT attempt to remove embedded objects.", he: "אל תנסו להוציא חפצים תקועים." },
      { en: "Do not apply eye drops unless prescribed by a vet.", he: "אל תטפטפו טיפות עיניים אלא אם הוטרינר רשם." },
      { en: "Cover the eye gently with a damp cloth if the dog allows.", he: "כסו את העין בעדינות עם בד לח אם הכלב מרשה." },
      { en: "See a vet as soon as possible.", he: "פנו לוטרינר בהקדם האפשרי." },
    ],
    warning: {
      en: "Eye injuries can worsen rapidly. Even minor scratches can lead to ulcers. Always see a vet within 24 hours.",
      he: "פציעות עין יכולות להחמיר מהר. גם שריטות קלות יכולות להוביל לכיבים. תמיד פנו לוטרינר תוך 24 שעות.",
    },
  },

  // ── LOW ──
  {
    id: "tick_bite",
    emoji: "🪲",
    severity: "low",
    name: { en: "Tick Bite", he: "עקיצת קרציה" },
    description: {
      en: "Found a tick attached to your dog's skin. Common in Israel year-round.",
      he: "נמצאה קרציה מחוברת לעור הכלב. נפוץ בישראל כל השנה.",
    },
    steps: [
      { en: "Use fine-tipped tweezers or a tick removal tool.", he: "השתמשו במלקחיים דקים או כלי להסרת קרציות." },
      { en: "Grasp the tick as close to the skin as possible.", he: "אחזו בקרציה כמה שיותר קרוב לעור." },
      { en: "Pull straight up with steady, even pressure. Do not twist or jerk.", he: "משכו ישר למעלה בלחץ יציב ואחיד. אל תסובבו או תנתקו בחדות." },
      { en: "Clean the area with antiseptic.", he: "נקו את האזור בחומר חיטוי." },
      { en: "Save the tick in a sealed bag — the vet may want to test it.", he: "שמרו את הקרציה בשקית סגורה — הוטרינר עשוי לרצות לבדוק אותה." },
      { en: "Monitor for lethargy, fever, or loss of appetite over the next 2 weeks.", he: "עקבו אחר עייפות, חום או אובדן תיאבון במשך השבועיים הבאים." },
    ],
    warning: {
      en: "Do NOT use alcohol, petroleum jelly, or heat to remove a tick. These methods can cause the tick to release more toxins.",
      he: "אל תשתמשו באלכוהול, וזלין או חום להסרת קרציה. שיטות אלו עלולות לגרום לקרציה לשחרר יותר רעלנים.",
    },
  },
];

export const COMMON_TOXINS = [
  { name: { en: "Chocolate", he: "שוקולד" }, emoji: "🍫", severity: "high", note: { en: "Dark chocolate is most toxic. 20g/kg can be fatal.", he: "שוקולד מריר הכי רעיל. 20 גרם/ק\"ג יכול להיות קטלני." } },
  { name: { en: "Xylitol (sugar-free gum)", he: "קסיליטול (מסטיק ללא סוכר)" }, emoji: "🍬", severity: "critical", note: { en: "Even small amounts cause rapid insulin release and liver failure.", he: "גם כמויות קטנות גורמות לשחרור אינסולין מהיר ואי ספיקת כבד." } },
  { name: { en: "Grapes & Raisins", he: "ענבים וצימוקים" }, emoji: "🍇", severity: "high", note: { en: "Can cause kidney failure. Any amount is dangerous.", he: "יכולים לגרום לאי ספיקת כליות. כל כמות מסוכנת." } },
  { name: { en: "Onions & Garlic", he: "בצל ושום" }, emoji: "🧅", severity: "moderate", note: { en: "Damages red blood cells. Garlic is 5x more toxic than onion.", he: "פוגע בתאי דם אדומים. שום רעיל פי 5 מבצל." } },
  { name: { en: "Rat Poison", he: "רעל עכברים" }, emoji: "🐀", severity: "critical", note: { en: "Causes internal bleeding. Symptoms may be delayed 2-5 days.", he: "גורם לדימום פנימי. תסמינים עלולים להתעכב 2-5 ימים." } },
  { name: { en: "Antifreeze", he: "נוזל קירור" }, emoji: "🧪", severity: "critical", note: { en: "Tastes sweet to dogs. Even 1 tablespoon can be fatal.", he: "טעם מתוק לכלבים. אפילו כף אחת יכולה להיות קטלנית." } },
  { name: { en: "Ibuprofen / Paracetamol", he: "איבופרופן / פרצטמול" }, emoji: "💊", severity: "high", note: { en: "Human painkillers are toxic to dogs. Never give without vet guidance.", he: "משככי כאבים לבני אדם רעילים לכלבים. לעולם אל תיתנו ללא הנחיית וטרינר." } },
  { name: { en: "Macadamia Nuts", he: "אגוזי מקדמיה" }, emoji: "🥜", severity: "moderate", note: { en: "Causes weakness, vomiting, tremors. Usually resolves in 48 hours.", he: "גורם לחולשה, הקאות, רעידות. בדרך כלל חולף תוך 48 שעות." } },
];

export const ISRAEL_SNAKES = [
  {
    name: { en: "Palestine Viper (צפע ארצישראלי)", he: "צפע ארצישראלי" },
    description: { en: "Israel's most dangerous snake. Triangular head, zigzag pattern. Found throughout Israel, especially near rocks and vegetation.", he: "הנחש המסוכן ביותר בישראל. ראש משולש, דוגמת זיגזג. נמצא בכל רחבי ישראל, בעיקר ליד סלעים וצמחייה." },
    emoji: "🐍",
  },
  {
    name: { en: "Desert Horned Viper (צפע חרטומי)", he: "צפע חרטומי" },
    description: { en: "Found in the Negev and Arava. Small horns above the eyes. Nocturnal, hides in sand.", he: "נמצא בנגב ובערבה. קרניים קטנות מעל העיניים. לילי, מתחבא בחול." },
    emoji: "🏜️",
  },
  {
    name: { en: "Black Desert Cobra (עכן שחור)", he: "עכן שחור" },
    description: { en: "Found in southern Israel. Black, raises hood when threatened. Rare but serious.", he: "נמצא בדרום ישראל. שחור, מרים ברדס כשמאוים. נדיר אך רציני." },
    emoji: "🖤",
  },
];

export const VET_DIRECTORY = [
  {
    region: { en: "Tel Aviv & Central", he: "תל אביב והמרכז" },
    vets: [
      { name: { en: "The Veterinary Hospital (HaVet)", he: "בית החולים הווטרינרי (הווט)" }, phone: "03-6044444", hours: { en: "24/7 Emergency", he: "חירום 24/7" } },
      { name: { en: "Beit Dolittle Emergency", he: "בית דוליטל חירום" }, phone: "03-5441441", hours: { en: "24/7 Emergency", he: "חירום 24/7" } },
    ],
  },
  {
    region: { en: "Jerusalem", he: "ירושלים" },
    vets: [
      { name: { en: "Animal Emergency Center Jerusalem", he: "מרכז חירום לבעלי חיים ירושלים" }, phone: "02-6433611", hours: { en: "24/7 Emergency", he: "חירום 24/7" } },
    ],
  },
  {
    region: { en: "Haifa & North", he: "חיפה והצפון" },
    vets: [
      { name: { en: "Haifa Emergency Vet Clinic", he: "מרפאת חירום וטרינרית חיפה" }, phone: "04-8341834", hours: { en: "24/7 Emergency", he: "חירום 24/7" } },
    ],
  },
  {
    region: { en: "South (Negev)", he: "דרום (נגב)" },
    vets: [
      { name: { en: "Be'er Sheva Emergency Vet", he: "וטרינר חירום באר שבע" }, phone: "08-6275999", hours: { en: "Evenings & weekends", he: "ערבים וסופי שבוע" } },
    ],
  },
  {
    region: { en: "Sharon & Coast", he: "השרון וחוף" },
    vets: [
      { name: { en: "Herzliya Vet Emergency", he: "חירום וטרינרי הרצליה" }, phone: "09-9506070", hours: { en: "24/7 Emergency", he: "חירום 24/7" } },
    ],
  },
];

export const POISON_CONTROL = {
  name: { en: "Israel Poison Information Center", he: "המרכז לידע על הרעלות" },
  phone: "04-8541900",
  emergency: { en: "Magen David Adom", he: "מגן דוד אדום" },
  emergencyPhone: "101",
};
