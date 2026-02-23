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
      `Step ${num} of ${total}.`,
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
      const intros = [
        `בואו נתרגל ${name}. יש ${totalSteps} שלבים. מתחילים.`,
        `הגיע הזמן לעבוד על ${name}. ${totalSteps} שלבים לפנינו. קדימה.`,
        `יאללה, בואו נעשה ${name} ביחד. ${totalSteps} שלבים בסך הכל. נתחיל.`,
      ];
      return intros[Math.floor(Math.random() * intros.length)];
    },
    nextStep: (num, total) =>
      `שלב ${num} מתוך ${total}.`,
    holdFor: (seconds) =>
      `החזיקו למשך ${seconds} שניות.`,
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
