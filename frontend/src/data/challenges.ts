// Weekly Challenge definitions — 12 challenges = 12 weeks of unique content
// Exercise IDs verified against programs.js

export const CHALLENGES = [
  {
    id: "recall-week",
    name: "Recall Master Week",
    nameHe: "\u05E9\u05D1\u05D5\u05E2 \u05E9\u05DC\u05D9\u05D8\u05D4 \u05D1\u05D7\u05D6\u05E8\u05D4",
    icon: "Megaphone",
    description: "7 days to bulletproof your dog's recall",
    descriptionHe: "7 \u05D9\u05DE\u05D9\u05DD \u05DC\u05D7\u05D9\u05D6\u05D5\u05E7 \u05D4\u05D7\u05D6\u05E8\u05D4 \u05E9\u05DC \u05D4\u05DB\u05DC\u05D1 \u05E9\u05DC\u05DA",
    color: "#4ECDC4",
    bonusXP: 200,
    badgeId: "challenge-recall-master",
    days: [
      { day: 1, exerciseId: "o1a", task: "Practice Name Recognition 10 times", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05D6\u05D9\u05D4\u05D5\u05D9 \u05E9\u05DD 10 \u05E4\u05E2\u05DE\u05D9\u05DD" },
      { day: 2, exerciseId: "o1b", task: "Work on Come command indoors", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05E4\u05E7\u05D5\u05D3\u05EA \u05D1\u05D5\u05D0 \u05D1\u05EA\u05D5\u05DA \u05D4\u05D1\u05D9\u05EA" },
      { day: 3, exerciseId: "o1c", task: "Add distance to your recall", taskHe: "\u05D4\u05D5\u05E1\u05E3 \u05DE\u05E8\u05D7\u05E7 \u05DC\u05D7\u05D6\u05E8\u05D4 \u05E9\u05DC\u05DA" },
      { day: 4, exerciseId: "o2a", task: "Practice recall with mild distractions", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05D7\u05D6\u05E8\u05D4 \u05E2\u05DD \u05D4\u05E1\u05D7\u05D5\u05EA \u05E7\u05DC\u05D5\u05EA" },
      { day: 5, exerciseId: "o2b", task: "Try recall in a new room or area", taskHe: "\u05E0\u05E1\u05D4 \u05D7\u05D6\u05E8\u05D4 \u05D1\u05D7\u05D3\u05E8 \u05D0\u05D5 \u05D0\u05D6\u05D5\u05E8 \u05D7\u05D3\u05E9" },
      { day: 6, exerciseId: "o2c", task: "Chain recall with sit and stay", taskHe: "\u05E9\u05E8\u05E9\u05E8 \u05D7\u05D6\u05E8\u05D4 \u05E2\u05DD \u05E9\u05D1 \u05D5\u05D4\u05D9\u05E9\u05D0\u05E8" },
      { day: 7, exerciseId: "o1a", task: "Final test: recall from across the house", taskHe: "\u05DE\u05D1\u05D7\u05DF \u05E1\u05D5\u05E4\u05D9: \u05D7\u05D6\u05E8\u05D4 \u05DE\u05E7\u05E6\u05D4 \u05D4\u05D1\u05D9\u05EA" }
    ]
  },
  {
    id: "patience-week",
    name: "Patience & Impulse Control",
    nameHe: "\u05E9\u05D1\u05D5\u05E2 \u05E1\u05D1\u05DC\u05E0\u05D5\u05EA \u05D5\u05E9\u05DC\u05D9\u05D8\u05D4 \u05E2\u05E6\u05DE\u05D9\u05EA",
    icon: "Timer",
    description: "Teach your dog to think before acting",
    descriptionHe: "\u05DC\u05DE\u05D3 \u05D0\u05EA \u05D4\u05DB\u05DC\u05D1 \u05E9\u05DC\u05DA \u05DC\u05D7\u05E9\u05D5\u05D1 \u05DC\u05E4\u05E0\u05D9 \u05E9\u05D4\u05D5\u05D0 \u05E4\u05D5\u05E2\u05DC",
    color: "#FF6B6B",
    bonusXP: 200,
    badgeId: "challenge-patience-guru",
    days: [
      { day: 1, exerciseId: "o1b", task: "Hold a Sit for 30 seconds", taskHe: "\u05D4\u05D7\u05D6\u05E7 \u05D9\u05E9\u05D9\u05D1\u05D4 \u05DC\u05DE\u05E9\u05DA 30 \u05E9\u05E0\u05D9\u05D5\u05EA" },
      { day: 2, exerciseId: "o1c", task: "Practice Wait at doorways", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05D4\u05DE\u05EA\u05E0\u05D4 \u05DC\u05D9\u05D3 \u05D3\u05DC\u05EA\u05D5\u05EA" },
      { day: 3, exerciseId: "o2a", task: "Leave It with treats on the floor", taskHe: "\u05E2\u05D6\u05D5\u05D1 \u05D0\u05EA \u05D6\u05D4 \u05E2\u05DD \u05D7\u05D8\u05D9\u05E4\u05D9\u05DD \u05E2\u05DC \u05D4\u05E8\u05E6\u05E4\u05D4" },
      { day: 4, exerciseId: "o2b", task: "Stay while you walk away 10 steps", taskHe: "\u05D4\u05D9\u05E9\u05D0\u05E8 \u05D1\u05D6\u05DE\u05DF \u05E9\u05D0\u05EA\u05D4 \u05DE\u05EA\u05E8\u05D7\u05E7 10 \u05E6\u05E2\u05D3\u05D9\u05DD" },
      { day: 5, exerciseId: "o2c", task: "Wait before eating meals", taskHe: "\u05D4\u05DE\u05EA\u05DF \u05DC\u05E4\u05E0\u05D9 \u05D0\u05DB\u05D9\u05DC\u05EA \u05D0\u05E8\u05D5\u05D7\u05D5\u05EA" },
      { day: 6, exerciseId: "o1b", task: "Hold a Down-Stay for 1 minute", taskHe: "\u05D4\u05D7\u05D6\u05E7 \u05E9\u05DB\u05D9\u05D1\u05D4-\u05D4\u05D9\u05E9\u05D0\u05E8 \u05DC\u05D3\u05E7\u05D4" },
      { day: 7, exerciseId: "o2a", task: "Leave It with a toy bouncing nearby", taskHe: "\u05E2\u05D6\u05D5\u05D1 \u05D0\u05EA \u05D6\u05D4 \u05E2\u05DD \u05E6\u05E2\u05E6\u05D5\u05E2 \u05E7\u05D5\u05E4\u05E5 \u05D1\u05E7\u05E8\u05D1\u05EA \u05DE\u05E7\u05D5\u05DD" }
    ]
  },
  {
    id: "trick-week",
    name: "Trick Star Week",
    nameHe: "\u05E9\u05D1\u05D5\u05E2 \u05DB\u05D5\u05DB\u05D1 \u05D4\u05D8\u05E8\u05D9\u05E7\u05D9\u05DD",
    icon: "Wand2",
    description: "Learn a new trick every day!",
    descriptionHe: "!\u05DC\u05DE\u05D3 \u05D8\u05E8\u05D9\u05E7 \u05D7\u05D3\u05E9 \u05DB\u05DC \u05D9\u05D5\u05DD",
    color: "#F7DC6F",
    bonusXP: 250,
    badgeId: "challenge-trick-star",
    days: [
      { day: 1, exerciseId: "t1a", task: "Teach Shake/Paw", taskHe: "\u05DC\u05DE\u05D3 \u05DC\u05EA\u05EA \u05D9\u05D3" },
      { day: 2, exerciseId: "t1b", task: "Work on Spin", taskHe: "\u05E2\u05D1\u05D5\u05D3 \u05E2\u05DC \u05E1\u05D9\u05D1\u05D5\u05D1" },
      { day: 3, exerciseId: "t2a", task: "Practice Roll Over", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05D4\u05EA\u05D2\u05DC\u05D2\u05DC\u05D5\u05EA" },
      { day: 4, exerciseId: "t2b", task: "Try Play Dead", taskHe: "\u05E0\u05E1\u05D4 \u05DC\u05E9\u05D7\u05E7 \u05DE\u05EA" },
      { day: 5, exerciseId: "t1c", task: "Learn High Five", taskHe: "\u05DC\u05DE\u05D3 \u05D4\u05D9\u05D9 \u05E4\u05D9\u05D9\u05D1" },
      { day: 6, exerciseId: "t2c", task: "Work on Crawl", taskHe: "\u05E2\u05D1\u05D5\u05D3 \u05E2\u05DC \u05D6\u05D7\u05D9\u05DC\u05D4" },
      { day: 7, exerciseId: "t1a", task: "Show off! Chain 3 tricks in a row", taskHe: "!\u05D4\u05D5\u05E4\u05E2\u05D4! \u05E9\u05E8\u05E9\u05E8 3 \u05D8\u05E8\u05D9\u05E7\u05D9\u05DD \u05D1\u05E8\u05E6\u05E3" }
    ]
  },
  {
    id: "leash-week",
    name: "Loose Leash Week",
    nameHe: "\u05E9\u05D1\u05D5\u05E2 \u05E8\u05E6\u05D5\u05E2\u05D4 \u05E8\u05D5\u05E4\u05E4\u05EA",
    icon: "PawPrint",
    description: "Transform your walks in 7 days",
    descriptionHe: "\u05E9\u05E0\u05D4 \u05D0\u05EA \u05D4\u05D4\u05DC\u05D9\u05DB\u05D5\u05EA \u05E9\u05DC\u05DA \u05D1-7 \u05D9\u05DE\u05D9\u05DD",
    color: "#82E0AA",
    bonusXP: 200,
    badgeId: "challenge-leash-pro",
    days: [
      { day: 1, exerciseId: "lr1a", task: "Practice leash pressure indoors", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05DC\u05D7\u05E5 \u05E8\u05E6\u05D5\u05E2\u05D4 \u05D1\u05EA\u05D5\u05DA \u05D4\u05D1\u05D9\u05EA" },
      { day: 2, exerciseId: "lr1b", task: "Walk 50 steps without pulling", taskHe: "\u05D4\u05DC\u05DA 50 \u05E6\u05E2\u05D3\u05D9\u05DD \u05D1\u05DC\u05D9 \u05DE\u05E9\u05D9\u05DB\u05D4" },
      { day: 3, exerciseId: "lr1c", task: "Change direction 10 times on a walk", taskHe: "\u05E9\u05E0\u05D4 \u05DB\u05D9\u05D5\u05D5\u05DF 10 \u05E4\u05E2\u05DE\u05D9\u05DD \u05D1\u05D4\u05DC\u05D9\u05DB\u05D4" },
      { day: 4, exerciseId: "lr2a", task: "Walk past a mild distraction", taskHe: "\u05D4\u05DC\u05DA \u05DC\u05D9\u05D3 \u05D4\u05E1\u05D7\u05D4 \u05E7\u05DC\u05D4" },
      { day: 5, exerciseId: "lr2b", task: "Practice auto-sit at crosswalks", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05D9\u05E9\u05D9\u05D1\u05D4 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA \u05D1\u05DE\u05E2\u05D1\u05E8\u05D9 \u05D7\u05E6\u05D9\u05D4" },
      { day: 6, exerciseId: "lr2c", task: "15-minute structured walk", taskHe: "\u05D4\u05DC\u05D9\u05DB\u05D4 \u05DE\u05D5\u05D1\u05E0\u05D9\u05EA \u05E9\u05DC 15 \u05D3\u05E7\u05D5\u05EA" },
      { day: 7, exerciseId: "lr1a", task: "Full walk with zero corrections needed", taskHe: "\u05D4\u05DC\u05D9\u05DB\u05D4 \u05DE\u05DC\u05D0\u05D4 \u05D1\u05DC\u05D9 \u05EA\u05D9\u05E7\u05D5\u05E0\u05D9\u05DD" }
    ]
  },
  {
    id: "puppy-basics-week",
    name: "Puppy Bootcamp",
    nameHe: "\u05DE\u05D7\u05E0\u05D4 \u05D0\u05D9\u05DE\u05D5\u05E0\u05D9\u05DD \u05DC\u05D2\u05D5\u05E8\u05D9\u05DD",
    icon: "PawPrint",
    description: "The essential puppy starter challenge",
    descriptionHe: "\u05D0\u05EA\u05D2\u05E8 \u05D4\u05D2\u05D5\u05E8\u05D9\u05DD \u05D4\u05D1\u05E1\u05D9\u05E1\u05D9",
    color: "#AED6F1",
    bonusXP: 200,
    badgeId: "challenge-puppy-grad",
    days: [
      { day: 1, exerciseId: "f1a", task: "Name recognition \u2014 15 reps today", taskHe: "\u05D6\u05D9\u05D4\u05D5\u05D9 \u05E9\u05DD \u2014 15 \u05D7\u05D6\u05E8\u05D5\u05EA \u05D4\u05D9\u05D5\u05DD" },
      { day: 2, exerciseId: "f1b", task: "Lure your puppy into a Sit", taskHe: "\u05E4\u05EA\u05D4 \u05D0\u05EA \u05D4\u05D2\u05D5\u05E8 \u05DC\u05D9\u05E9\u05D9\u05D1\u05D4" },
      { day: 3, exerciseId: "f1c", task: "Capture a Down position", taskHe: "\u05EA\u05E4\u05D5\u05E1 \u05EA\u05E0\u05D5\u05D7\u05EA \u05E9\u05DB\u05D9\u05D1\u05D4" },
      { day: 4, exerciseId: "f2a", task: "Practice Touch (nose to hand)", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05DE\u05D2\u05E2 (\u05D0\u05E3 \u05DC\u05D9\u05D3)" },
      { day: 5, exerciseId: "f2b", task: "Work on Gentle (soft mouth)", taskHe: "\u05E2\u05D1\u05D5\u05D3 \u05E2\u05DC \u05E2\u05D3\u05D9\u05E0\u05D5\u05EA (\u05E4\u05D4 \u05E8\u05DA)" },
      { day: 6, exerciseId: "f2c", task: "Build focus with eye contact game", taskHe: "\u05D1\u05E0\u05D4 \u05DE\u05D9\u05E7\u05D5\u05D3 \u05E2\u05DD \u05DE\u05E9\u05D7\u05E7 \u05E7\u05E9\u05E8 \u05E2\u05D9\u05DF" },
      { day: 7, exerciseId: "f1a", task: "Chain: Name \u2192 Sit \u2192 Touch \u2192 Treat!", taskHe: "!\u05E9\u05E8\u05E9\u05E8\u05EA: \u05E9\u05DD \u2190 \u05E9\u05D1 \u2190 \u05DE\u05D2\u05E2 \u2190 \u05D7\u05D8\u05D9\u05E3" }
    ]
  },
  {
    id: "socialization-week",
    name: "Socialization Sprint",
    nameHe: "\u05E1\u05E4\u05E8\u05D9\u05E0\u05D8 \u05D7\u05D9\u05D1\u05E8\u05D5\u05EA",
    icon: "Users",
    description: "Expose your dog to new experiences safely",
    descriptionHe: "\u05D7\u05E9\u05D5\u05E3 \u05D0\u05EA \u05D4\u05DB\u05DC\u05D1 \u05E9\u05DC\u05DA \u05DC\u05D7\u05D5\u05D5\u05D9\u05D5\u05EA \u05D7\u05D3\u05E9\u05D5\u05EA \u05D1\u05D1\u05D8\u05D7\u05D4",
    color: "#D7BDE2",
    bonusXP: 200,
    badgeId: "challenge-social-butterfly",
    days: [
      { day: 1, exerciseId: "sc1a", task: "Introduce 3 new surfaces to walk on", taskHe: "\u05D4\u05DB\u05E8 3 \u05DE\u05E9\u05D8\u05D7\u05D9\u05DD \u05D7\u05D3\u05E9\u05D9\u05DD \u05DC\u05DC\u05DB\u05EA \u05E2\u05DC\u05D9\u05D4\u05DD" },
      { day: 2, exerciseId: "sc2a", task: "Practice calm greetings with a person", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05D1\u05E8\u05DB\u05D4 \u05E8\u05D2\u05D5\u05E2\u05D4 \u05E2\u05DD \u05D0\u05D3\u05DD" },
      { day: 3, exerciseId: "sc1b", task: "Play sounds at low volume during meals", taskHe: "\u05E0\u05D2\u05DF \u05E6\u05DC\u05D9\u05DC\u05D9\u05DD \u05D1\u05E2\u05D5\u05E6\u05DE\u05D4 \u05E0\u05DE\u05D5\u05DB\u05D4 \u05D1\u05D6\u05DE\u05DF \u05D0\u05E8\u05D5\u05D7\u05D5\u05EA" },
      { day: 4, exerciseId: "sc2c", task: "Watch dogs from a distance calmly", taskHe: "\u05E6\u05E4\u05D4 \u05D1\u05DB\u05DC\u05D1\u05D9\u05DD \u05DE\u05DE\u05E8\u05D7\u05E7 \u05D1\u05E8\u05D5\u05D2\u05E2" },
      { day: 5, exerciseId: "sc2b", task: "Visit a new environment for 10 min", taskHe: "\u05D1\u05E7\u05E8 \u05D1\u05E1\u05D1\u05D9\u05D1\u05D4 \u05D7\u05D3\u05E9\u05D4 \u05DC-10 \u05D3\u05E7\u05D5\u05EA" },
      { day: 6, exerciseId: "sc1c", task: "Practice being handled (paws, ears, mouth)", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05DE\u05D2\u05E2 (\u05DB\u05E4\u05D5\u05EA, \u05D0\u05D5\u05D6\u05E0\u05D9\u05D9\u05DD, \u05E4\u05D4)" },
      { day: 7, exerciseId: "sc1a", task: "Adventure walk: 3 new experiences in one outing", taskHe: "\u05D4\u05DC\u05D9\u05DB\u05EA \u05D4\u05E8\u05E4\u05EA\u05E7\u05D5\u05EA: 3 \u05D7\u05D5\u05D5\u05D9\u05D5\u05EA \u05D7\u05D3\u05E9\u05D5\u05EA \u05D1\u05D9\u05E6\u05D9\u05D0\u05D4 \u05D0\u05D7\u05EA" }
    ]
  },
  {
    id: "fitness-week",
    name: "Canine Fitness Week",
    nameHe: "\u05E9\u05D1\u05D5\u05E2 \u05DB\u05D5\u05E9\u05E8 \u05DC\u05DB\u05DC\u05D1\u05D9\u05DD",
    icon: "Dumbbell",
    description: "Build your dog's body and mind",
    descriptionHe: "\u05D1\u05E0\u05D4 \u05D0\u05EA \u05D4\u05D2\u05D5\u05E3 \u05D5\u05D4\u05E0\u05E4\u05E9 \u05E9\u05DC \u05D4\u05DB\u05DC\u05D1 \u05E9\u05DC\u05DA",
    color: "#F1948A",
    bonusXP: 200,
    badgeId: "challenge-fitness-champ",
    days: [
      { day: 1, exerciseId: "fit1a", task: "Balance work on a pillow or cushion", taskHe: "\u05E2\u05D1\u05D5\u05D3\u05EA \u05E9\u05D9\u05D5\u05D5\u05D9 \u05DE\u05E9\u05E7\u05DC \u05E2\u05DC \u05DB\u05E8\u05D9\u05EA" },
      { day: 2, exerciseId: "fit1c", task: "5 minutes of structured play", taskHe: "5 \u05D3\u05E7\u05D5\u05EA \u05E9\u05DC \u05DE\u05E9\u05D7\u05E7 \u05DE\u05D5\u05D1\u05E0\u05D4" },
      { day: 3, exerciseId: "fit1c", task: "Weave between your legs 10 times", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05E9\u05DE\u05D9\u05E0\u05D9\u05D5\u05EA \u05D1\u05D9\u05DF \u05D4\u05E8\u05D2\u05DC\u05D9\u05D9\u05DD 10 \u05E4\u05E2\u05DE\u05D9\u05DD" },
      { day: 4, exerciseId: "fit1b", task: "Body awareness: walk backward 5 steps", taskHe: "\u05DE\u05D5\u05D3\u05E2\u05D5\u05EA \u05D2\u05D5\u05E3: \u05DC\u05DA \u05D0\u05D7\u05D5\u05E8\u05D4 5 \u05E6\u05E2\u05D3\u05D9\u05DD" },
      { day: 5, exerciseId: "fit1a", task: "Paw targeting on different surfaces", taskHe: "\u05DE\u05D9\u05E7\u05D5\u05D3 \u05DB\u05E4\u05D5\u05EA \u05E2\u05DC \u05DE\u05E9\u05D8\u05D7\u05D9\u05DD \u05E9\u05D5\u05E0\u05D9\u05DD" },
      { day: 6, exerciseId: "fit1b", task: "Back up: teach your dog to walk backward", taskHe: "\u05D0\u05D7\u05D5\u05E8\u05D4: \u05DC\u05DE\u05D3 \u05D0\u05EA \u05D4\u05DB\u05DC\u05D1 \u05DC\u05DC\u05DB\u05EA \u05DC\u05D0\u05D7\u05D5\u05E8" },
      { day: 7, exerciseId: "fit1a", task: "Obstacle course at home with household items", taskHe: "\u05DE\u05E1\u05DC\u05D5\u05DC \u05DE\u05DB\u05E9\u05D5\u05DC\u05D9\u05DD \u05D1\u05D1\u05D9\u05EA \u05E2\u05DD \u05D7\u05E4\u05E6\u05D9 \u05D1\u05D9\u05EA" }
    ]
  },
  {
    id: "crate-week",
    name: "Crate Comfort Week",
    nameHe: "\u05E9\u05D1\u05D5\u05E2 \u05E0\u05D5\u05D7\u05D5\u05EA \u05D1\u05DB\u05DC\u05D5\u05D1",
    icon: "House",
    description: "Make the crate your dog's favorite place",
    descriptionHe: "\u05D4\u05E4\u05D5\u05DA \u05D0\u05EA \u05D4\u05DB\u05DC\u05D5\u05D1 \u05DC\u05DE\u05E7\u05D5\u05DD \u05D4\u05D0\u05D4\u05D5\u05D1 \u05E2\u05DC \u05D4\u05DB\u05DC\u05D1 \u05E9\u05DC\u05DA",
    color: "#85C1E9",
    bonusXP: 200,
    badgeId: "challenge-crate-lover",
    days: [
      { day: 1, exerciseId: "cr1a", task: "Toss treats into the crate 20 times", taskHe: "\u05D6\u05E8\u05D5\u05E7 \u05D7\u05D8\u05D9\u05E4\u05D9\u05DD \u05DC\u05DB\u05DC\u05D5\u05D1 20 \u05E4\u05E2\u05DE\u05D9\u05DD" },
      { day: 2, exerciseId: "cr1b", task: "Feed a meal inside the crate", taskHe: "\u05D4\u05D0\u05DB\u05DC \u05D0\u05E8\u05D5\u05D7\u05D4 \u05D1\u05EA\u05D5\u05DA \u05D4\u05DB\u05DC\u05D5\u05D1" },
      { day: 3, exerciseId: "cr1c", task: "Close the door for 30 seconds while feeding", taskHe: "\u05E1\u05D2\u05D5\u05E8 \u05D0\u05EA \u05D4\u05D3\u05DC\u05EA \u05DC-30 \u05E9\u05E0\u05D9\u05D5\u05EA \u05D1\u05D6\u05DE\u05DF \u05D4\u05D0\u05DB\u05DC\u05D4" },
      { day: 4, exerciseId: "cr2a", task: "Crate rest while you sit nearby for 5 min", taskHe: "\u05DE\u05E0\u05D5\u05D7\u05D4 \u05D1\u05DB\u05DC\u05D5\u05D1 \u05D1\u05D6\u05DE\u05DF \u05E9\u05D0\u05EA\u05D4 \u05D9\u05D5\u05E9\u05D1 \u05E7\u05E8\u05D5\u05D1 \u05DC-5 \u05D3\u05E7\u05D5\u05EA" },
      { day: 5, exerciseId: "cr2b", task: "Leave the room for 1 minute with dog in crate", taskHe: "\u05E2\u05D6\u05D5\u05D1 \u05D0\u05EA \u05D4\u05D7\u05D3\u05E8 \u05DC\u05D3\u05E7\u05D4 \u05E2\u05DD \u05D4\u05DB\u05DC\u05D1 \u05D1\u05DB\u05DC\u05D5\u05D1" },
      { day: 6, exerciseId: "cr2c", task: "Give a Kong in the crate and walk away", taskHe: "\u05EA\u05DF \u05E7\u05D5\u05E0\u05D2 \u05D1\u05DB\u05DC\u05D5\u05D1 \u05D5\u05DC\u05DA" },
      { day: 7, exerciseId: "cr1a", task: "Dog chooses to rest in crate with door open", taskHe: "\u05D4\u05DB\u05DC\u05D1 \u05D1\u05D5\u05D7\u05E8 \u05DC\u05E0\u05D5\u05D7 \u05D1\u05DB\u05DC\u05D5\u05D1 \u05E2\u05DD \u05D3\u05DC\u05EA \u05E4\u05EA\u05D5\u05D7\u05D4" }
    ]
  },
  {
    id: "behavior-week",
    name: "Behavior Fix Week",
    nameHe: "\u05E9\u05D1\u05D5\u05E2 \u05EA\u05D9\u05E7\u05D5\u05DF \u05D4\u05EA\u05E0\u05D4\u05D2\u05D5\u05EA",
    icon: "Puzzle",
    description: "Tackle common behavior problems",
    descriptionHe: "\u05D4\u05EA\u05DE\u05D5\u05D3\u05D3 \u05E2\u05DD \u05D1\u05E2\u05D9\u05D5\u05EA \u05D4\u05EA\u05E0\u05D4\u05D2\u05D5\u05EA \u05E0\u05E4\u05D5\u05E6\u05D5\u05EA",
    color: "#F0B27A",
    bonusXP: 250,
    badgeId: "challenge-behavior-boss",
    days: [
      { day: 1, exerciseId: "b1a", task: "Practice 'Go to your place' 10 times", taskHe: "\u05EA\u05E8\u05D2\u05DC '\u05DC\u05DA \u05DC\u05DE\u05E7\u05D5\u05DD \u05E9\u05DC\u05DA' 10 \u05E4\u05E2\u05DE\u05D9\u05DD" },
      { day: 2, exerciseId: "b1b", task: "Redirect jumping with an alternative behavior", taskHe: "\u05D4\u05E4\u05E0\u05D4 \u05E7\u05E4\u05D9\u05E6\u05D4 \u05DC\u05D4\u05EA\u05E0\u05D4\u05D2\u05D5\u05EA \u05D7\u05DC\u05D5\u05E4\u05D9\u05EA" },
      { day: 3, exerciseId: "b1c", task: "Ignore barking, reward quiet \u2014 5 reps", taskHe: "\u05D4\u05EA\u05E2\u05DC\u05DD \u05DE\u05E0\u05D1\u05D9\u05D7\u05D5\u05EA, \u05EA\u05D2\u05DE\u05DC \u05E9\u05E7\u05D8 \u2014 5 \u05D7\u05D6\u05E8\u05D5\u05EA" },
      { day: 4, exerciseId: "b2a", task: "Leave It with food on the counter", taskHe: "\u05E2\u05D6\u05D5\u05D1 \u05D0\u05EA \u05D6\u05D4 \u05E2\u05DD \u05D0\u05D5\u05DB\u05DC \u05E2\u05DC \u05D4\u05E9\u05D9\u05E9" },
      { day: 5, exerciseId: "b2b", task: "Practice calm door greetings", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05D1\u05E8\u05DB\u05EA \u05D3\u05DC\u05EA \u05E8\u05D2\u05D5\u05E2\u05D4" },
      { day: 6, exerciseId: "b2c", task: "Settle on a mat during dinner", taskHe: "\u05D4\u05EA\u05D9\u05D9\u05E9\u05D1\u05D5\u05EA \u05E2\u05DC \u05DE\u05D6\u05E8\u05DF \u05D1\u05D6\u05DE\u05DF \u05D0\u05E8\u05D5\u05D7\u05EA \u05E2\u05E8\u05D1" },
      { day: 7, exerciseId: "b1a", task: "Full evening routine with zero problem behaviors", taskHe: "\u05E9\u05D2\u05E8\u05EA \u05E2\u05E8\u05D1 \u05DE\u05DC\u05D0\u05D4 \u05D1\u05DC\u05D9 \u05D1\u05E2\u05D9\u05D5\u05EA \u05D4\u05EA\u05E0\u05D4\u05D2\u05D5\u05EA" }
    ]
  },
  {
    id: "potty-week",
    name: "Potty Pro Week",
    nameHe: "\u05E9\u05D1\u05D5\u05E2 \u05DE\u05E7\u05E6\u05D5\u05E2\u05DF \u05E9\u05D9\u05E8\u05D5\u05EA\u05D9\u05DD",
    icon: "Droplets",
    description: "Nail potty training once and for all",
    descriptionHe: "\u05E9\u05DC\u05D5\u05D8 \u05D1\u05D0\u05D9\u05DE\u05D5\u05DF \u05E9\u05D9\u05E8\u05D5\u05EA\u05D9\u05DD \u05D0\u05D7\u05EA \u05D5\u05DC\u05EA\u05DE\u05D9\u05D3",
    color: "#A3E4D7",
    bonusXP: 200,
    badgeId: "challenge-potty-pro",
    days: [
      { day: 1, exerciseId: "pt1a", task: "Set a potty schedule \u2014 every 2 hours today", taskHe: "\u05E7\u05D1\u05E2 \u05DC\u05D5\u05D7 \u05D6\u05DE\u05E0\u05D9\u05DD \u2014 \u05DB\u05DC \u05E9\u05E2\u05EA\u05D9\u05D9\u05DD \u05D4\u05D9\u05D5\u05DD" },
      { day: 2, exerciseId: "pt1b", task: "Reward immediately after outdoor potty 5 times", taskHe: "\u05EA\u05D2\u05DE\u05DC \u05DE\u05D9\u05D3 \u05D0\u05D7\u05E8\u05D9 \u05E6\u05E8\u05DB\u05D9\u05DD \u05D1\u05D7\u05D5\u05E5 5 \u05E4\u05E2\u05DE\u05D9\u05DD" },
      { day: 3, exerciseId: "pt1c", task: "Learn your dog's 'I need to go' signals", taskHe: "\u05DC\u05DE\u05D3 \u05D0\u05EA \u05D4\u05E1\u05D9\u05DE\u05E0\u05D9\u05DD \u05E9\u05DC '\u05D0\u05E0\u05D9 \u05E6\u05E8\u05D9\u05DA \u05DC\u05E6\u05D0\u05EA'" },
      { day: 4, exerciseId: "pt2a", task: "Zero accidents today \u2014 supervise constantly", taskHe: "\u05D0\u05E4\u05E1 \u05EA\u05D0\u05D5\u05E0\u05D5\u05EA \u05D4\u05D9\u05D5\u05DD \u2014 \u05E4\u05E7\u05D7 \u05DB\u05DC \u05D4\u05D6\u05DE\u05DF" },
      { day: 5, exerciseId: "pt2b", task: "Extend time between potty breaks by 30 min", taskHe: "\u05D4\u05D0\u05E8\u05DA \u05D6\u05DE\u05DF \u05D1\u05D9\u05DF \u05D4\u05E4\u05E1\u05E7\u05D5\u05EA \u05D1-30 \u05D3\u05E7\u05D5\u05EA" },
      { day: 6, exerciseId: "pt2c", task: "Practice potty on command with a cue word", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05E9\u05D9\u05E8\u05D5\u05EA\u05D9\u05DD \u05D1\u05E4\u05E7\u05D5\u05D3\u05D4 \u05E2\u05DD \u05DE\u05D9\u05DC\u05EA \u05E8\u05DE\u05D6" },
      { day: 7, exerciseId: "pt1a", task: "Full day with scheduled breaks and zero accidents", taskHe: "\u05D9\u05D5\u05DD \u05E9\u05DC\u05DD \u05E2\u05DD \u05D4\u05E4\u05E1\u05E7\u05D5\u05EA \u05DE\u05EA\u05D5\u05DB\u05E0\u05E0\u05D5\u05EA \u05D5\u05D0\u05E4\u05E1 \u05EA\u05D0\u05D5\u05E0\u05D5\u05EA" }
    ]
  },
  {
    id: "focus-week",
    name: "Focus & Attention Week",
    nameHe: "\u05E9\u05D1\u05D5\u05E2 \u05E8\u05D9\u05DB\u05D5\u05D6 \u05D5\u05EA\u05E9\u05D5\u05DE\u05EA \u05DC\u05D1",
    icon: "Crosshair",
    description: "Build an unbreakable bond of attention",
    descriptionHe: "\u05D1\u05E0\u05D4 \u05E7\u05E9\u05E8 \u05D1\u05DC\u05EA\u05D9 \u05E9\u05D1\u05D9\u05E8 \u05E9\u05DC \u05EA\u05E9\u05D5\u05DE\u05EA \u05DC\u05D1",
    color: "#C39BD3",
    bonusXP: 200,
    badgeId: "challenge-laser-focus",
    days: [
      { day: 1, exerciseId: "f1c", task: "Eye contact game \u2014 20 reps", taskHe: "\u05DE\u05E9\u05D7\u05E7 \u05E7\u05E9\u05E8 \u05E2\u05D9\u05DF \u2014 20 \u05D7\u05D6\u05E8\u05D5\u05EA" },
      { day: 2, exerciseId: "f2c", task: "Watch Me for 10 seconds duration", taskHe: "\u05D4\u05E1\u05EA\u05DB\u05DC \u05E2\u05DC\u05D9\u05D9 \u05DC\u05DE\u05E9\u05DA 10 \u05E9\u05E0\u05D9\u05D5\u05EA" },
      { day: 3, exerciseId: "o1a", task: "Name response from another room", taskHe: "\u05EA\u05D2\u05D5\u05D1\u05D4 \u05DC\u05E9\u05DD \u05DE\u05D7\u05D3\u05E8 \u05D0\u05D7\u05E8" },
      { day: 4, exerciseId: "f2c", task: "Watch Me with treats on the floor", taskHe: "\u05D4\u05E1\u05EA\u05DB\u05DC \u05E2\u05DC\u05D9\u05D9 \u05E2\u05DD \u05D7\u05D8\u05D9\u05E4\u05D9\u05DD \u05E2\u05DC \u05D4\u05E8\u05E6\u05E4\u05D4" },
      { day: 5, exerciseId: "o3c", task: "Practice check-ins on a walk (voluntary look)", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05E6'\u05E7-\u05D0\u05D9\u05DF \u05D1\u05D4\u05DC\u05D9\u05DB\u05D4 (\u05DE\u05E1\u05EA\u05DB\u05DC \u05E2\u05DC\u05D9\u05DA \u05DE\u05E8\u05E6\u05D5\u05DF)" },
      { day: 6, exerciseId: "f1c", task: "Focus through distractions \u2014 TV on, toys around", taskHe: "\u05DE\u05D9\u05E7\u05D5\u05D3 \u05D3\u05E8\u05DA \u05D4\u05E1\u05D7\u05D5\u05EA \u2014 \u05D8\u05DC\u05D5\u05D5\u05D9\u05D6\u05D9\u05D4 \u05D3\u05DC\u05D5\u05E7\u05D4, \u05E6\u05E2\u05E6\u05D5\u05E2\u05D9\u05DD \u05E1\u05D1\u05D9\u05D1" },
      { day: 7, exerciseId: "o1a", task: "30-second sustained eye contact challenge", taskHe: "\u05D0\u05EA\u05D2\u05E8 \u05E7\u05E9\u05E8 \u05E2\u05D9\u05DF \u05E9\u05DC 30 \u05E9\u05E0\u05D9\u05D5\u05EA" }
    ]
  },
  {
    id: "adventure-week",
    name: "Adventure Week",
    nameHe: "\u05E9\u05D1\u05D5\u05E2 \u05D4\u05E8\u05E4\u05EA\u05E7\u05D5\u05EA",
    icon: "Globe",
    description: "Take your training to new places",
    descriptionHe: "\u05E7\u05D7 \u05D0\u05EA \u05D4\u05D0\u05D9\u05DE\u05D5\u05DF \u05E9\u05DC\u05DA \u05DC\u05DE\u05E7\u05D5\u05DE\u05D5\u05EA \u05D7\u05D3\u05E9\u05D9\u05DD",
    color: "#FAD7A0",
    bonusXP: 250,
    badgeId: "challenge-adventurer",
    days: [
      { day: 1, exerciseId: "o1b", task: "Practice Sit in the front yard", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05E9\u05D1 \u05D1\u05D7\u05E6\u05E8 \u05D4\u05E7\u05D3\u05DE\u05D9\u05EA" },
      { day: 2, exerciseId: "o1c", task: "Down-Stay at a cafe or bench", taskHe: "\u05E9\u05DB\u05D9\u05D1\u05D4-\u05D4\u05D9\u05E9\u05D0\u05E8 \u05D1\u05D1\u05D9\u05EA \u05E7\u05E4\u05D4 \u05D0\u05D5 \u05E1\u05E4\u05E1\u05DC" },
      { day: 3, exerciseId: "o2a", task: "Recall at the park (on long leash)", taskHe: "\u05D7\u05D6\u05E8\u05D4 \u05D1\u05E4\u05D0\u05E8\u05E7 (\u05E2\u05DC \u05E8\u05E6\u05D5\u05E2\u05D4 \u05D0\u05E8\u05D5\u05DB\u05D4)" },
      { day: 4, exerciseId: "sc2b", task: "Walk through a pet store calmly", taskHe: "\u05D4\u05DC\u05DA \u05D1\u05D7\u05E0\u05D5\u05EA \u05D7\u05D9\u05D5\u05EA \u05D1\u05E8\u05D5\u05D2\u05E2" },
      { day: 5, exerciseId: "lr2c", task: "Structured walk in a busy area", taskHe: "\u05D4\u05DC\u05D9\u05DB\u05D4 \u05DE\u05D5\u05D1\u05E0\u05D9\u05EA \u05D1\u05D0\u05D6\u05D5\u05E8 \u05E2\u05DE\u05D5\u05E1" },
      { day: 6, exerciseId: "o2b", task: "Practice all basic commands at a friend's house", taskHe: "\u05EA\u05E8\u05D2\u05DC \u05D0\u05EA \u05DB\u05DC \u05D4\u05E4\u05E7\u05D5\u05D3\u05D5\u05EA \u05D4\u05D1\u05E1\u05D9\u05E1\u05D9\u05D5\u05EA \u05D1\u05D1\u05D9\u05EA \u05E9\u05DC \u05D7\u05D1\u05E8" },
      { day: 7, exerciseId: "o2c", task: "Full adventure: 3 locations, 3 commands each", taskHe: "\u05D4\u05E8\u05E4\u05EA\u05E7\u05D4 \u05DE\u05DC\u05D0\u05D4: 3 \u05DE\u05E7\u05D5\u05DE\u05D5\u05EA, 3 \u05E4\u05E7\u05D5\u05D3\u05D5\u05EA \u05D1\u05DB\u05DC \u05D0\u05D7\u05D3" }
    ]
  }
];

// ISO week number
export function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Get current challenge based on week number
export function getActiveChallenge(date = new Date()) {
  const week = getWeekNumber(date);
  return CHALLENGES[week % CHALLENGES.length];
}

// Get today's day number (Monday=1, Sunday=7)
export function getChallengeDay(date = new Date()) {
  const day = date.getDay(); // 0=Sun, 1=Mon...6=Sat
  return day === 0 ? 7 : day;
}

// Get start date of the current ISO week (Monday)
export function getWeekStartDate(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
}
