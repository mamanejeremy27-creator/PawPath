import type { ChallengeDefinition } from '../../../entities';

export const CHALLENGES_SEED: Partial<ChallengeDefinition>[] = [
  {
    id: "recall-week",
    name: "Recall Master Week",
    emoji: "\uD83D\uDCE3",
    description: "7 days to bulletproof your dog's recall",
    color: "#4ECDC4",
    bonusXP: 200,
    badgeId: "challenge-recall-master",
    days: [
      { day: 1, exerciseId: "o1a", task: "Practice Name Recognition 10 times" },
      { day: 2, exerciseId: "o1b", task: "Work on Come command indoors" },
      { day: 3, exerciseId: "o1c", task: "Add distance to your recall" },
      { day: 4, exerciseId: "o2a", task: "Practice recall with mild distractions" },
      { day: 5, exerciseId: "o2b", task: "Try recall in a new room or area" },
      { day: 6, exerciseId: "o2c", task: "Chain recall with sit and stay" },
      { day: 7, exerciseId: "o1a", task: "Final test: recall from across the house" }
    ]
  },
  {
    id: "patience-week",
    name: "Patience & Impulse Control",
    emoji: "\uD83E\uDDD8",
    description: "Teach your dog to think before acting",
    color: "#FF6B6B",
    bonusXP: 200,
    badgeId: "challenge-patience-guru",
    days: [
      { day: 1, exerciseId: "o1b", task: "Hold a Sit for 30 seconds" },
      { day: 2, exerciseId: "o1c", task: "Practice Wait at doorways" },
      { day: 3, exerciseId: "o2a", task: "Leave It with treats on the floor" },
      { day: 4, exerciseId: "o2b", task: "Stay while you walk away 10 steps" },
      { day: 5, exerciseId: "o2c", task: "Wait before eating meals" },
      { day: 6, exerciseId: "o1b", task: "Hold a Down-Stay for 1 minute" },
      { day: 7, exerciseId: "o2a", task: "Leave It with a toy bouncing nearby" }
    ]
  },
  {
    id: "trick-week",
    name: "Trick Star Week",
    emoji: "\uD83C\uDFAA",
    description: "Learn a new trick every day!",
    color: "#F7DC6F",
    bonusXP: 250,
    badgeId: "challenge-trick-star",
    days: [
      { day: 1, exerciseId: "t1a", task: "Teach Shake/Paw" },
      { day: 2, exerciseId: "t1b", task: "Work on Spin" },
      { day: 3, exerciseId: "t2a", task: "Practice Roll Over" },
      { day: 4, exerciseId: "t2b", task: "Try Play Dead" },
      { day: 5, exerciseId: "t1c", task: "Learn High Five" },
      { day: 6, exerciseId: "t2c", task: "Work on Crawl" },
      { day: 7, exerciseId: "t1a", task: "Show off! Chain 3 tricks in a row" }
    ]
  },
  {
    id: "leash-week",
    name: "Loose Leash Week",
    emoji: "\uD83E\uDDAE",
    description: "Transform your walks in 7 days",
    color: "#82E0AA",
    bonusXP: 200,
    badgeId: "challenge-leash-pro",
    days: [
      { day: 1, exerciseId: "lr1a", task: "Practice leash pressure indoors" },
      { day: 2, exerciseId: "lr1b", task: "Walk 50 steps without pulling" },
      { day: 3, exerciseId: "lr1c", task: "Change direction 10 times on a walk" },
      { day: 4, exerciseId: "lr2a", task: "Walk past a mild distraction" },
      { day: 5, exerciseId: "lr2b", task: "Practice auto-sit at crosswalks" },
      { day: 6, exerciseId: "lr2c", task: "15-minute structured walk" },
      { day: 7, exerciseId: "lr1a", task: "Full walk with zero corrections needed" }
    ]
  },
  {
    id: "puppy-basics-week",
    name: "Puppy Bootcamp",
    emoji: "\uD83D\uDC36",
    description: "The essential puppy starter challenge",
    color: "#AED6F1",
    bonusXP: 200,
    badgeId: "challenge-puppy-grad",
    days: [
      { day: 1, exerciseId: "f1a", task: "Name recognition \u2014 15 reps today" },
      { day: 2, exerciseId: "f1b", task: "Lure your puppy into a Sit" },
      { day: 3, exerciseId: "f1c", task: "Capture a Down position" },
      { day: 4, exerciseId: "f2a", task: "Practice Touch (nose to hand)" },
      { day: 5, exerciseId: "f2b", task: "Work on Gentle (soft mouth)" },
      { day: 6, exerciseId: "f2c", task: "Build focus with eye contact game" },
      { day: 7, exerciseId: "f1a", task: "Chain: Name \u2192 Sit \u2192 Touch \u2192 Treat!" }
    ]
  },
  {
    id: "socialization-week",
    name: "Socialization Sprint",
    emoji: "\uD83D\uDC15\u200D\uD83E\uDDBA",
    description: "Expose your dog to new experiences safely",
    color: "#D7BDE2",
    bonusXP: 200,
    badgeId: "challenge-social-butterfly",
    days: [
      { day: 1, exerciseId: "sc1a", task: "Introduce 3 new surfaces to walk on" },
      { day: 2, exerciseId: "sc2a", task: "Practice calm greetings with a person" },
      { day: 3, exerciseId: "sc1b", task: "Play sounds at low volume during meals" },
      { day: 4, exerciseId: "sc2c", task: "Watch dogs from a distance calmly" },
      { day: 5, exerciseId: "sc2b", task: "Visit a new environment for 10 min" },
      { day: 6, exerciseId: "sc1c", task: "Practice being handled (paws, ears, mouth)" },
      { day: 7, exerciseId: "sc1a", task: "Adventure walk: 3 new experiences in one outing" }
    ]
  },
  {
    id: "fitness-week",
    name: "Canine Fitness Week",
    emoji: "\uD83C\uDFCB\uFE0F",
    description: "Build your dog's body and mind",
    color: "#F1948A",
    bonusXP: 200,
    badgeId: "challenge-fitness-champ",
    days: [
      { day: 1, exerciseId: "fit1a", task: "Balance work on a pillow or cushion" },
      { day: 2, exerciseId: "fit1c", task: "5 minutes of structured play" },
      { day: 3, exerciseId: "fit1c", task: "Weave between your legs 10 times" },
      { day: 4, exerciseId: "fit1b", task: "Body awareness: walk backward 5 steps" },
      { day: 5, exerciseId: "fit1a", task: "Paw targeting on different surfaces" },
      { day: 6, exerciseId: "fit1b", task: "Back up: teach your dog to walk backward" },
      { day: 7, exerciseId: "fit1a", task: "Obstacle course at home with household items" }
    ]
  },
  {
    id: "crate-week",
    name: "Crate Comfort Week",
    emoji: "\uD83C\uDFE0",
    description: "Make the crate your dog's favorite place",
    color: "#85C1E9",
    bonusXP: 200,
    badgeId: "challenge-crate-lover",
    days: [
      { day: 1, exerciseId: "cr1a", task: "Toss treats into the crate 20 times" },
      { day: 2, exerciseId: "cr1b", task: "Feed a meal inside the crate" },
      { day: 3, exerciseId: "cr1c", task: "Close the door for 30 seconds while feeding" },
      { day: 4, exerciseId: "cr2a", task: "Crate rest while you sit nearby for 5 min" },
      { day: 5, exerciseId: "cr2b", task: "Leave the room for 1 minute with dog in crate" },
      { day: 6, exerciseId: "cr2c", task: "Give a Kong in the crate and walk away" },
      { day: 7, exerciseId: "cr1a", task: "Dog chooses to rest in crate with door open" }
    ]
  },
  {
    id: "behavior-week",
    name: "Behavior Fix Week",
    emoji: "\uD83E\uDDE9",
    description: "Tackle common behavior problems",
    color: "#F0B27A",
    bonusXP: 250,
    badgeId: "challenge-behavior-boss",
    days: [
      { day: 1, exerciseId: "b1a", task: "Practice 'Go to your place' 10 times" },
      { day: 2, exerciseId: "b1b", task: "Redirect jumping with an alternative behavior" },
      { day: 3, exerciseId: "b1c", task: "Ignore barking, reward quiet \u2014 5 reps" },
      { day: 4, exerciseId: "b2a", task: "Leave It with food on the counter" },
      { day: 5, exerciseId: "b2b", task: "Practice calm door greetings" },
      { day: 6, exerciseId: "b2c", task: "Settle on a mat during dinner" },
      { day: 7, exerciseId: "b1a", task: "Full evening routine with zero problem behaviors" }
    ]
  },
  {
    id: "potty-week",
    name: "Potty Pro Week",
    emoji: "\uD83D\uDEBD",
    description: "Nail potty training once and for all",
    color: "#A3E4D7",
    bonusXP: 200,
    badgeId: "challenge-potty-pro",
    days: [
      { day: 1, exerciseId: "pt1a", task: "Set a potty schedule \u2014 every 2 hours today" },
      { day: 2, exerciseId: "pt1b", task: "Reward immediately after outdoor potty 5 times" },
      { day: 3, exerciseId: "pt1c", task: "Learn your dog's 'I need to go' signals" },
      { day: 4, exerciseId: "pt2a", task: "Zero accidents today \u2014 supervise constantly" },
      { day: 5, exerciseId: "pt2b", task: "Extend time between potty breaks by 30 min" },
      { day: 6, exerciseId: "pt2c", task: "Practice potty on command with a cue word" },
      { day: 7, exerciseId: "pt1a", task: "Full day with scheduled breaks and zero accidents" }
    ]
  },
  {
    id: "focus-week",
    name: "Focus & Attention Week",
    emoji: "\uD83C\uDFAF",
    description: "Build an unbreakable bond of attention",
    color: "#C39BD3",
    bonusXP: 200,
    badgeId: "challenge-laser-focus",
    days: [
      { day: 1, exerciseId: "f1c", task: "Eye contact game \u2014 20 reps" },
      { day: 2, exerciseId: "f2c", task: "Watch Me for 10 seconds duration" },
      { day: 3, exerciseId: "o1a", task: "Name response from another room" },
      { day: 4, exerciseId: "f2c", task: "Watch Me with treats on the floor" },
      { day: 5, exerciseId: "o3c", task: "Practice check-ins on a walk (voluntary look)" },
      { day: 6, exerciseId: "f1c", task: "Focus through distractions \u2014 TV on, toys around" },
      { day: 7, exerciseId: "o1a", task: "30-second sustained eye contact challenge" }
    ]
  },
  {
    id: "adventure-week",
    name: "Adventure Week",
    emoji: "\uD83C\uDF0D",
    description: "Take your training to new places",
    color: "#FAD7A0",
    bonusXP: 250,
    badgeId: "challenge-adventurer",
    days: [
      { day: 1, exerciseId: "o1b", task: "Practice Sit in the front yard" },
      { day: 2, exerciseId: "o1c", task: "Down-Stay at a cafe or bench" },
      { day: 3, exerciseId: "o2a", task: "Recall at the park (on long leash)" },
      { day: 4, exerciseId: "sc2b", task: "Walk through a pet store calmly" },
      { day: 5, exerciseId: "lr2c", task: "Structured walk in a busy area" },
      { day: 6, exerciseId: "o2b", task: "Practice all basic commands at a friend's house" },
      { day: 7, exerciseId: "o2c", task: "Full adventure: 3 locations, 3 commands each" }
    ]
  }
];
