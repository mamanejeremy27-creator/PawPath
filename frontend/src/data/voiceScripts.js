export const VOICE_SCRIPTS = {
  en: {
    startExercise: (name, totalSteps) =>
      `Let's practice ${name}. There are ${totalSteps} steps. Let's begin.`,
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
  },
  he: {
    startExercise: (name, totalSteps) =>
      `\u05D1\u05D5\u05D0\u05D5 \u05E0\u05EA\u05E8\u05D2\u05DC ${name}. \u05D9\u05E9 ${totalSteps} \u05E9\u05DC\u05D1\u05D9\u05DD. \u05D1\u05D5\u05D0\u05D5 \u05E0\u05EA\u05D7\u05D9\u05DC.`,
    nextStep: (num, total) =>
      `\u05E9\u05DC\u05D1 ${num} \u05DE\u05EA\u05D5\u05DA ${total}.`,
    holdFor: (seconds) =>
      `\u05D4\u05D7\u05D6\u05D9\u05E7\u05D5 \u05DC\u05DE\u05E9\u05DA ${seconds} \u05E9\u05E0\u05D9\u05D5\u05EA.`,
    countdown: (n) => `${n}`,
    release: "\u05E9\u05D7\u05E8\u05E8\u05D5. \u05DB\u05DC \u05D4\u05DB\u05D1\u05D5\u05D3.",
    encouragement: [
      "\u05E2\u05D1\u05D5\u05D3\u05D4 \u05DE\u05E6\u05D5\u05D9\u05E0\u05EA. \u05D4\u05DE\u05E9\u05D9\u05DB\u05D5 \u05DB\u05DA.",
      "\u05D0\u05EA\u05DD \u05DE\u05D3\u05D4\u05D9\u05DE\u05D9\u05DD.",
      "\u05D4\u05DB\u05DC\u05D1 \u05E9\u05DC\u05DB\u05DD \u05DC\u05D5\u05DE\u05D3 \u05DB\u05DC \u05DB\u05DA \u05D4\u05E8\u05D1\u05D4.",
      "\u05DE\u05E2\u05D5\u05DC\u05D4. \u05D4\u05D9\u05D5 \u05E1\u05D1\u05DC\u05E0\u05D9\u05D9\u05DD \u05D5\u05E2\u05E7\u05D1\u05D9\u05D9\u05DD.",
      "\u05D8\u05DB\u05E0\u05D9\u05E7\u05D4 \u05DE\u05D5\u05E9\u05DC\u05DE\u05EA.",
      "\u05D9\u05E4\u05D4 \u05DE\u05D0\u05D5\u05D3. \u05D4\u05E7\u05E9\u05E8 \u05D1\u05D9\u05E0\u05D9\u05DB\u05DD \u05DE\u05EA\u05D7\u05D6\u05E7.",
      "\u05E2\u05D1\u05D5\u05D3\u05D4 \u05D9\u05E4\u05D4. \u05D4\u05DE\u05E9\u05D9\u05DB\u05D5.",
      "\u05DB\u05DA \u05D1\u05D3\u05D9\u05D5\u05E7 \u05E6\u05E8\u05D9\u05DA.",
    ],
    exerciseComplete: "\u05D4\u05EA\u05E8\u05D2\u05D9\u05DC \u05D4\u05D5\u05E9\u05DC\u05DD! \u05D0\u05D9\u05DE\u05D5\u05DF \u05E0\u05D4\u05D3\u05E8. \u05D0\u05EA\u05DD \u05D5\u05D4\u05DB\u05DC\u05D1 \u05E9\u05DC\u05DB\u05DD \u05E2\u05E9\u05D9\u05EA\u05DD \u05E2\u05D1\u05D5\u05D3\u05D4 \u05E0\u05E4\u05DC\u05D0\u05D4.",
    paused: "\u05DE\u05D5\u05E9\u05D4\u05D4. \u05E7\u05D7\u05D5 \u05D0\u05EA \u05D4\u05D6\u05DE\u05DF. \u05DC\u05D7\u05E6\u05D5 \u05E2\u05DC \u05D4\u05DE\u05E9\u05DA \u05DB\u05E9\u05EA\u05D4\u05D9\u05D5 \u05DE\u05D5\u05DB\u05E0\u05D9\u05DD.",
    tipIntro: "\u05D4\u05E0\u05D4 \u05D8\u05D9\u05E4 \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9.",
    repeatStep: "\u05D1\u05D5\u05D0\u05D5 \u05E0\u05E0\u05E1\u05D4 \u05D0\u05EA \u05D4\u05E9\u05DC\u05D1 \u05D4\u05D6\u05D4 \u05E9\u05D5\u05D1.",
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
  const heSecMatch = text.match(/(\d+)\s*(?:\u05E9\u05E0\u05D9\u05D5\u05EA|\u05E9\u05E0\u05D9\u05D9\u05D4)/);
  if (heSecMatch) return parseInt(heSecMatch[1], 10);
  const heCountMatch = text.match(/\u05E1\u05E4\u05E8\u05D5\s+\u05E2\u05D3\s+(\d+)/);
  if (heCountMatch) return parseInt(heCountMatch[1], 10);
  return null;
}
