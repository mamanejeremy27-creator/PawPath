// Spell out Hebrew numbers as words to avoid ElevenLabs mispronunciation.
// "6" → "שש" gets read as "שס" by the model, so we send the word directly.
const HE_NUMS: Record<number, string> = {
  1: 'אחת', 2: 'שתיים', 3: 'שלוש', 4: 'ארבע', 5: 'חמש',
  6: 'שֵׁשׁ', 7: 'שֶׁבַע', 8: 'שמונה', 9: 'תֵּשַׁע', 10: 'עֶשֶׂר',
  11: 'אחת עשרה', 12: 'שתים עשרה', 13: 'שלוש עשרה', 14: 'ארבע עשרה',
  15: 'חמש עשרה', 16: 'שש עשרה', 17: 'שבע עשרה', 18: 'שמונה עשרה',
  19: 'תשע עשרה', 20: 'עשרים', 30: 'שלושים', 60: 'שישים', 90: 'תשעים',
};

function heNum(n: number): string {
  if (HE_NUMS[n]) return HE_NUMS[n];
  if (n > 20 && n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const ones = n % 10;
    const tensWord = HE_NUMS[tens] ?? `${tens}`;
    return ones ? `${tensWord} ו${HE_NUMS[ones] ?? ones}` : tensWord;
  }
  return String(n);
}

export const VOICE_SCRIPTS = {
  en: {
    startExercise: (name, totalSteps) => {
      const intros = [
        `Let's practice ${name}. There are ${totalSteps} steps. Let's begin.`,
        `Time to work on ${name}. We've got ${totalSteps} steps ahead. Ready? Let's go.`,
        `Alright, let's do ${name} together. ${totalSteps} steps total. Here we go.`,
      ];
      return intros[Math.floor(Math.random() * intros.length)];
    },
    nextStep: (num, total) =>
      `Step number ${num}, of ${total}.`,
    holdFor: (seconds) =>
      `Hold for ${seconds} seconds.`,
    countdown: (n) => `${n}`,
    release: "And release. Good job.",
    encouragement: [
      "Great work. Keep it up.",
      "You're doing amazing.",
      "Your dog is learning so much.",
      "Excellent. Stay patient and consistent.",
      "Perfect technique.",
      "Well done. Your bond is growing stronger.",
      "Nice work. Keep going.",
      "That's the way to do it.",
    ],
    exerciseComplete: "Exercise complete! Great session. You and your dog did wonderful.",
    paused: "Paused. Take your time. Press play when you're ready.",
    tipIntro: "Here's a pro tip.",
    repeatStep: "Let's try that step again.",
    almostThere: "Almost there...",
  },
  he: {
    startExercise: (name, totalSteps) => {
      const n = heNum(totalSteps);
      const intros = [
        `בואו נתרגל ${name}. יש ${n} שלבים. מתחילים.`,
        `הגיע הזמן לעבוד על ${name}. ${n} שלבים לפנינו. קדימה.`,
        `יאללה, בואו נעשה ${name} ביחד. ${n} שלבים בסך הכל. נתחיל.`,
      ];
      return intros[Math.floor(Math.random() * intros.length)];
    },
    nextStep: (num, total) =>
      `שלב ${heNum(num)} מתוך ${heNum(total)}.`,
    holdFor: (seconds) =>
      `החזיקו למשך ${heNum(seconds)} שניות.`,
    countdown: (n) => `${n}`,
    release: "שחררו. כל הכבוד.",
    encouragement: [
      "עבודה מצוינת. המשיכו ככה.",
      "אתם מדהימים.",
      "הכלב שלכם לומד המון.",
      "מעולה. תהיו סבלניים ועקביים.",
      "טכניקה מושלמת.",
      "יפה מאוד. הקשר ביניכם מתחזק.",
      "עבודה יפה. ממשיכים.",
      "בדיוק ככה צריך.",
    ],
    exerciseComplete: "התרגיל הושלם! אימון נהדר. אתם והכלב שלכם עשיתם עבודה מעולה.",
    paused: "מושהה. קחו את הזמן. לחצו המשך כשמוכנים.",
    tipIntro: "הנה טיפ מקצועי.",
    repeatStep: "בואו ננסה את השלב הזה שוב.",
    almostThere: "כמעט שם...",
  },
};

// Detect a timed hold from step text (returns seconds or null)
export function detectTimer(text) {
  // English: "hold for 5 seconds", "wait 10 seconds", "stay for 3 sec", "count to 5"
  const secMatch = text.match(/(\d+)\s*(?:second|sec)/i);
  if (secMatch) return parseInt(secMatch[1], 10);
  const countMatch = text.match(/count\s+to\s+(\d+)/i);
  if (countMatch) return parseInt(countMatch[1], 10);
  // Hebrew: "5 שניות", "ספרו עד 5"
  const heSecMatch = text.match(/(\d+)\s*(?:שניות|שנייה)/);
  if (heSecMatch) return parseInt(heSecMatch[1], 10);
  const heCountMatch = text.match(/ספרו\s+עד\s+(\d+)/);
  if (heCountMatch) return parseInt(heCountMatch[1], 10);
  return null;
}
