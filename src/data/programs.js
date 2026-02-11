export const TRAINING_PROGRAMS = [
  {
    id: "foundations", name: "Puppy Foundations", emoji: "\uD83D\uDC3E",
    description: "Essential skills every puppy needs. Build trust, focus, and the basics that everything else is built on.",
    color: "#22C55E", gradient: "linear-gradient(135deg, #22C55E, #16A34A)",
    unlockLevel: 0, difficulty: "Beginner", duration: "2\u20134 weeks",
    levels: [
      { id: "f1", name: "First Steps", xpReward: 50, description: "The absolute basics \u2014 your first week together.",
        exercises: [
          { id: "f1a", name: "Name Recognition", duration: 300, difficulty: 1, description: "Teach your dog to look at you when you say their name. This is the gateway to all communication.", steps: ["Say your dog's name once in a clear, happy tone.", "The moment they look at you, mark it with 'Yes!' or a clicker.", "Immediately give a small treat.", "Wait 10-15 seconds, then repeat.", "Practice 10 reps per session, 2-3 sessions per day.", "Once reliable indoors, practice in the yard with mild distractions.", "Final test: say their name when they're sniffing something \u2014 do they look?"], tips: "Don't repeat the name if they don't respond \u2014 wait and try again. You want the name to mean 'good things happen when I look at you.'", gear: ["clicker", "high_value_treats"] },
          { id: "f1b", name: "Sit", duration: 300, difficulty: 1, description: "The foundation of all obedience \u2014 a reliable sit on cue.", steps: ["Hold a treat close to your dog's nose.", "Slowly move the treat up and slightly back over their head.", "As their head follows the treat, their bottom will naturally lower.", "The moment their butt touches the ground, mark with 'Yes!' and treat.", "Repeat 10 times per session.", "Once consistent, add the word 'Sit' just before the hand motion.", "Gradually fade the treat lure to just the hand signal."], tips: "Never push your dog's butt down. Let them figure it out \u2014 that builds problem-solving skills.", gear: ["clicker", "high_value_treats", "treat_pouch"] },
          { id: "f1c", name: "Eye Contact Game", duration: 180, difficulty: 1, description: "Build focus and connection with a simple eye contact exercise.", steps: ["Hold a treat in your closed fist at your side.", "Wait silently \u2014 your dog will sniff, paw, and eventually look at your face.", "Mark 'Yes!' and reward the instant they make eye contact.", "Repeat. They'll start offering eye contact faster each time.", "Gradually increase the duration of eye contact before marking.", "Add a cue like 'Watch me' once reliable.", "Practice during walks when nothing exciting is happening."], tips: "Start with even a split-second glance \u2014 reward generously early on.", gear: ["clicker", "high_value_treats"] },
        ]
      },
      { id: "f2", name: "Building Focus", xpReward: 75, description: "Build duration and impulse control.",
        exercises: [
          { id: "f2a", name: "Stay \u2014 Introduction", duration: 300, difficulty: 2, description: "Teach your dog to hold position for a short duration.", steps: ["Ask your dog to sit.", "Hold your palm out flat and say 'Stay.'", "Wait 2 seconds, then mark 'Yes!' and treat.", "Gradually increase to 5 seconds, then 10, then 15.", "Add a single step back, then return and reward.", "If they break position, calmly reset with no frustration.", "Always return TO your dog to reward."], tips: "If they break 3 times in a row, make it easier. They should succeed 80% of the time.", gear: ["clicker", "high_value_treats", "treat_pouch"] },
          { id: "f2b", name: "Leave It \u2014 Basics", duration: 300, difficulty: 2, description: "Impulse control \u2014 your dog learns ignoring something GETS them something better.", steps: ["Place a treat in your closed fist and present it.", "They'll sniff, paw, lick \u2014 wait them out.", "The moment they back away or look at you, mark 'Yes!'", "Give them a DIFFERENT, better treat from your other hand.", "Repeat until they immediately disengage from the closed fist.", "Upgrade: place treat on the floor covered by your hand.", "Then try with the treat visible but uncovered."], tips: "The golden rule: they NEVER get the thing you asked them to leave. Always reward with something different and better.", gear: ["clicker", "high_value_treats"] },
          { id: "f2c", name: "Touch \u2014 Hand Target", duration: 300, difficulty: 1, description: "Your dog learns to boop your palm with their nose \u2014 incredibly versatile.", steps: ["Hold your flat palm a few inches from your dog's nose.", "Most dogs will naturally investigate \u2014 mark when nose touches palm.", "Treat immediately after the mark.", "Move your hand to different positions.", "Mark each successful nose-to-palm touch.", "Add the cue 'Touch' once reliable.", "Use it to move your dog into positions, onto scales at the vet, through scary doorways."], tips: "This becomes your Swiss Army knife skill. Anxious dog? Touch. Need to redirect? Touch.", gear: ["clicker", "high_value_treats"] },
        ]
      },
      { id: "f3", name: "World Ready", xpReward: 100, description: "Take everything outdoors. Your dog meets the real world.",
        exercises: [
          { id: "f3a", name: "Recall \u2014 Come", duration: 600, difficulty: 3, description: "The most important skill. A solid recall can literally save their life.", steps: ["Start indoors in a boring room.", "Say your dog's name + 'Come!' in an excited voice.", "When they come, throw a MASSIVE party \u2014 jackpot treats.", "Practice in different rooms.", "Move to the yard on a long line.", "Let them explore, then call \u2014 big reward.", "NEVER call your dog for something they don't enjoy."], tips: "Make coming to you the BEST thing that happens all day. Every. Single. Time.", gear: ["clicker", "high_value_treats", "long_line", "whistle"] },
          { id: "f3b", name: "Loose Leash Walking", duration: 600, difficulty: 3, description: "Walk together like partners, not a dog sled team.", steps: ["Stand still with your dog on leash. Wait for slackness.", "The moment there's slack + they look at you, mark and treat.", "Take 2-3 steps. If leash stays loose, mark and treat.", "If the leash goes tight, STOP. Become a tree.", "Wait for slack \u2014 mark and treat.", "Gradually increase steps between rewards.", "Practice in your driveway first, then quiet streets."], tips: "This takes the longest. Short, frequent sessions (5-10 min) beat long frustrating walks.", gear: ["harness", "clicker", "high_value_treats", "treat_pouch"] },
          { id: "f3c", name: "Place / Go to Bed", duration: 300, difficulty: 2, description: "Go to a specific spot and chill. A daily life management tool.", steps: ["Place a mat or bed on the floor.", "Lure your dog onto it with a treat.", "Mark and reward when all four paws are on.", "Shape for a down position.", "Add short duration \u2014 5s, 10s, 30s.", "Add the cue 'Place' or 'Go to bed.'", "Practice in different locations."], tips: "This becomes your go-to for doorbell rings, dinnertime, guests visiting, caf\u00e9 outings.", gear: ["clicker", "high_value_treats", "mat_bed"] },
        ]
      }
    ]
  },
  {
    id: "obedience", name: "Core Obedience", emoji: "\uD83C\uDFAF",
    description: "Make your basics bulletproof. Real-world reliability with distance, distractions, and duration.",
    color: "#3B82F6", gradient: "linear-gradient(135deg, #3B82F6, #2563EB)",
    unlockLevel: 2, difficulty: "Intermediate", duration: "3\u20136 weeks",
    levels: [
      { id: "o1", name: "Reliable Basics", xpReward: 100, description: "Proof your commands against the real world.",
        exercises: [
          { id: "o1a", name: "Sit at Distance", duration: 420, difficulty: 2, description: "Reliable sit even when you're across the room \u2014 or the park.", steps: ["Ask for a sit from 1 step away.", "Mark and return to your dog to reward.", "Gradually increase to 3, 5, then 10 steps.", "Practice in different rooms and locations.", "Move to outdoor environments.", "Add mild distractions once distance is solid.", "Final test: sit from 20 feet away at the park."], tips: "The 3 D's: Distance, Duration, Distraction. Only increase ONE at a time.", gear: ["clicker", "high_value_treats", "treat_pouch"] },
          { id: "o1b", name: "Down from Standing", duration: 420, difficulty: 2, description: "Down from standing is harder but much more useful in real life.", steps: ["With your dog standing, hold a treat at their nose.", "Slowly lure their nose straight down to the floor.", "Draw the treat slightly toward you along the ground.", "Mark the moment elbows and belly touch the floor.", "Treat generously.", "Practice until the hand signal alone works.", "Add the verbal cue 'Down.'"], tips: "If your dog struggles, reward intermediate steps \u2014 nose dipping, one elbow down. Shape gradually.", gear: ["clicker", "high_value_treats"] },
          { id: "o1c", name: "Stay vs. Distractions", duration: 600, difficulty: 3, description: "A stay that only works in your living room isn't really a stay.", steps: ["Ask for a stay in an easy spot.", "Introduce mild distractions: drop a toy.", "Mark and reward heavily for holding.", "Have someone walk past.", "Bounce a ball. Open the fridge. Ring the doorbell.", "Gradually decrease distance from distractions.", "Practice near the front door, in the yard, on walks."], tips: "If they break 2 times in a row, you've made it too hard too fast. Drop back.", gear: ["clicker", "high_value_treats", "mat_bed"] },
        ]
      },
      { id: "o2", name: "Public Manners", xpReward: 125, description: "Caf\u00e9s, streets, visitors, and other dogs.",
        exercises: [
          { id: "o2a", name: "Polite Greetings", duration: 600, difficulty: 3, description: "No jumping on people \u2014 calm behavior = attention, jumping = nothing.", steps: ["Recruit a helper your dog likes.", "Have the person approach.", "If calm (four paws on floor), the person pets.", "If they jump, the person turns away and ignores.", "After 5 seconds ignoring, try again.", "Repeat \u2014 pattern clicks fast.", "Practice with different people."], tips: "This requires buy-in from everyone. One person rewarding jumping undermines weeks of training.", gear: ["clicker", "high_value_treats", "treat_pouch"] },
          { id: "o2b", name: "Caf\u00e9 Settle", duration: 900, difficulty: 3, description: "Your dog relaxes at your feet while you enjoy a coffee.", steps: ["Bring your mat to a quiet outdoor spot first.", "Ask for 'Place' and reward calm behavior every 30s.", "Increase time between treats: 1 min, 2 min, 5 min.", "Move to a quiet caf\u00e9 patio.", "Bring a Kong or chew for settling help.", "Practice at progressively busier locations.", "Goal: 30 minutes of relaxed settling."], tips: "Walk 30+ minutes before caf\u00e9 practice. Bring an amazing chew. Go at off-peak hours first.", gear: ["mat_bed", "treat_pouch", "high_value_treats", "treat_mat"] },
          { id: "o2c", name: "Walk Past Distractions", duration: 600, difficulty: 3, description: "Stay focused on you when the world is exciting.", steps: ["Practice 'Watch me' on a quiet street.", "When distraction approaches, increase treat value.", "Reward for choosing you over the distraction.", "Use 'Let\u2019s go!' to redirect and move past.", "Start at large distance, gradually decrease.", "Practice with different types of distractions.", "Goal: walk past another dog at 10 feet without pulling."], tips: "Distance is your best friend. If your dog can't handle 30 feet, don't try 10.", gear: ["harness", "clicker", "high_value_treats", "treat_pouch"] },
        ]
      },
      { id: "o3", name: "Off-Leash Foundations", xpReward: 150, description: "Working toward the holy grail: trust without a leash.",
        exercises: [
          { id: "o3a", name: "Long Line Recall", duration: 900, difficulty: 4, description: "Build recall reliability with a 15-30 ft training lead.", steps: ["Attach long line in a safe, enclosed area.", "Let your dog explore freely.", "When engaged with something, call 'Come!'", "If they come immediately \u2014 MASSIVE reward party.", "If they hesitate, gentle line pressure + encouragement.", "Never yank. Guide gently, reward on arrival.", "Practice in parks, fields, beaches."], tips: "Never go off-leash until 95%+ reliable on the long line in multiple environments.", gear: ["long_line", "high_value_treats", "treat_pouch", "whistle"] },
          { id: "o3b", name: "Emergency Stop", duration: 600, difficulty: 4, description: "Stop your dog in their tracks from a distance. This is insurance.", steps: ["Start with your dog walking toward you.", "Say 'STOP' or 'WAIT' firmly + raised palm.", "Mark and reward any hesitation or stopping.", "Practice from 5 feet, then 10, then 20.", "Harder: practice when moving AWAY from you.", "Use long line as backup.", "Proof near (safe) roads."], tips: "This could save your dog's life near a road. Practice it seriously.", gear: ["long_line", "high_value_treats", "clicker"] },
          { id: "o3c", name: "Voluntary Check-Ins", duration: 600, difficulty: 2, description: "Your dog naturally glances at you during off-leash time.", steps: ["During long-line time in a safe area, just wait.", "Don't call. Don't say anything.", "Every voluntary look at you, mark and reward.", "They'll check in more frequently.", "Reward intermittently.", "Builds a habit of 'keeping tabs.'", "Goal: check-in every 30-60 seconds."], tips: "One of the most underrated skills in dog training.", gear: ["long_line", "high_value_treats", "treat_pouch"] },
        ]
      }
    ]
  },
  {
    id: "tricks", name: "Trick Training", emoji: "\u2728",
    description: "Fun tricks that build your bond and impress everyone at the park.",
    color: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    unlockLevel: 3, difficulty: "Intermediate", duration: "Ongoing",
    levels: [
      { id: "t1", name: "Party Tricks", xpReward: 75, description: "Simple crowd-pleasers.",
        exercises: [
          { id: "t1a", name: "Shake / Paw", duration: 300, difficulty: 1, description: "The classic \u2014 a gateway to high-five, wave, and more.", steps: ["Ask for a sit.", "Hold treat in closed fist near their chest.", "Most dogs will paw at your hand \u2014 mark it!", "Catch their paw gently and treat.", "Repeat until they offer without the fist.", "Add the cue 'Shake' or 'Paw.'", "Teach both paws."], tips: "If they don't paw naturally, try tickling behind their front leg gently.", gear: ["clicker", "high_value_treats"] },
          { id: "t1b", name: "Spin", duration: 300, difficulty: 1, description: "A full 360\u00b0 turn. Simple and dogs love it.", steps: ["Hold treat at nose level.", "Lure in a circle slowly.", "Mark and reward the full rotation.", "Repeat 5-8 times per session.", "Reduce lure to hand signal.", "Add 'Spin' for one direction, 'Twirl' for other.", "Speed it up."], tips: "Teach both directions for balanced flexibility. Great warm-up.", gear: ["clicker", "high_value_treats"] },
          { id: "t1c", name: "High Five", duration: 300, difficulty: 1, description: "Level up from shake into a crowd-pleaser.", steps: ["If they know 'Shake,' hold palm up higher.", "Angle palm to face them.", "When they touch your palm \u2014 mark and treat.", "Gradually raise your hand higher.", "Add 'High five!' with enthusiasm.", "Practice with both paws.", "Chain: Sit \u2192 High Five \u2192 Spin!"], tips: "Great for photos and makes strangers smile.", gear: ["clicker", "high_value_treats"] },
        ]
      },
      { id: "t2", name: "Show Stoppers", xpReward: 100, description: "Tricks that get real reactions.",
        exercises: [
          { id: "t2a", name: "Roll Over", duration: 600, difficulty: 2, description: "A real show-stopper.", steps: ["Start in a down position.", "Lure treat toward their shoulder blade.", "As head turns, body starts to lean.", "Continue luring over their back.", "May take several sessions for a full roll.", "Chain the full motion.", "Add 'Roll over!' with circular hand signal."], tips: "Do this on carpet or grass. Some dogs feel vulnerable \u2014 build trust first.", gear: ["clicker", "high_value_treats"] },
          { id: "t2b", name: "Play Dead", duration: 600, difficulty: 3, description: "'Bang!' \u2014 point your finger gun and they flop over.", steps: ["From a down, lure nose to hip to shift onto side.", "Mark and reward for lying on side.", "Shape for head going down flat.", "Add a 3-second hold.", "Build up to dramatic 'flop' from standing.", "Add cue: point finger and say 'Bang!'", "Encourage dramatic flair."], tips: "Reward small progressions: lean \u2192 side \u2192 head down \u2192 hold.", gear: ["clicker", "high_value_treats"] },
          { id: "t2c", name: "Crawl", duration: 600, difficulty: 3, description: "Army crawl across the floor.", steps: ["Start in a down position.", "Hold treat RIGHT at nose level on ground.", "Slowly drag forward \u2014 mark any forward motion.", "If they stand, reset to down, try smaller distance.", "Use your leg as a low barrier.", "Gradually increase distance.", "Add 'Crawl' once reliable."], tips: "Builds core strength and body awareness. Keep sessions very short.", gear: ["clicker", "high_value_treats"] },
        ]
      }
    ]
  },
  {
    id: "behavior", name: "Behavior Solutions", emoji: "\uD83E\uDDE9",
    description: "Solve the common problems. Jumping, barking, pulling \u2014 there's a training solution for each.",
    color: "#8B5CF6", gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    unlockLevel: 1, difficulty: "All Levels", duration: "Ongoing",
    levels: [
      { id: "b1", name: "Impulse Control", xpReward: 100, description: "Most 'bad behavior' is just a lack of impulse control.",
        exercises: [
          { id: "b1a", name: "Wait for Food", duration: 300, difficulty: 2, description: "No more lunging at the food bowl.", steps: ["Prepare food bowl.", "Hold at chest height. Start lowering slowly.", "If dog moves toward it, raise bowl back up.", "Only lower when they're still.", "Place bowl down. If they move, pick it up.", "Release with 'OK!'", "They learn: stillness = food. Movement = food leaves."], tips: "Do this at every meal. Within a week, they'll sit and wait automatically.", gear: ["clicker"] },
          { id: "b1b", name: "Door Manners", duration: 300, difficulty: 2, description: "No bolting through doorways. Wait until released.", steps: ["Approach any door on leash.", "Reach for handle.", "If dog surges forward, remove hand from handle.", "Wait for them to settle, reach again.", "Only open when calm.", "Open slowly \u2014 if they move, close it.", "Release with 'OK!' or 'Free!'"], tips: "Safety skill: a dog that waits at doors won't bolt into traffic.", gear: ["clicker", "high_value_treats"] },
          { id: "b1c", name: "Calm on Cue", duration: 600, difficulty: 2, description: "Teach your dog to actively choose calmness.", steps: ["Watch for natural calm lying down moments.", "Walk over and place a treat between their paws.", "Do this for a full week \u2014 capturing calm.", "Start adding cue: 'Settle' or 'Easy.'", "Ask for 'Settle' after play or excitement.", "Reward with calm praise and slow treats.", "Build duration: 1 min \u2192 5 min \u2192 15 min."], tips: "You're rewarding a MOOD, not a behavior. Dogs that know how to choose calm are 'well-behaved.'", gear: ["clicker", "high_value_treats", "mat_bed", "treat_mat"] },
        ]
      },
      { id: "b2", name: "Problem Solving", xpReward: 125, description: "Direct solutions for maddening behaviors.",
        exercises: [
          { id: "b2a", name: "Stop the Jumping", duration: 600, difficulty: 2, description: "Replace jumping with something better.", steps: ["Decide replacement: sit, four-on-floor, or grab toy.", "When jumping starts, turn away. No eye contact.", "Wait 3 seconds, turn back, ask for replacement.", "When they do it \u2014 explosive reward.", "Set up practice with helpers.", "Be 100% consistent. Every person. Every time.", "2-3 weeks of consistency = dramatic decrease."], tips: "Even negative attention ('No! Down!') rewards jumping. Zero results for jumping, everything for the alternative.", gear: ["clicker", "high_value_treats", "treat_pouch"] },
          { id: "b2b", name: "Quiet on Cue", duration: 600, difficulty: 3, description: "Teach 'Quiet' as a skill \u2014 not by yelling.", steps: ["Wait for barking (or trigger it).", "Let them bark 2-3 times. Say 'Thank you.'", "Hold a treat right at their nose.", "When barking stops to sniff \u2014 mark 'Yes!' and treat.", "Add 'Quiet' before presenting treat.", "Increase silence duration before treating.", "Practice with real triggers."], tips: "Never yell at barking. Your dog thinks you're joining in.", gear: ["clicker", "high_value_treats"] },
          { id: "b2c", name: "Drop It \u2014 Reliable", duration: 600, difficulty: 3, description: "Release anything from their mouth, happily.", steps: ["Start during play with low-value toy.", "Offer high-value treat at their nose.", "When they open mouth \u2014 mark 'Yes!' and treat.", "Immediately give the toy BACK.", "Repeat 10 times per session.", "Gradually increase item value.", "Add 'Drop it' once trade is reliable."], tips: "Always trade UP. If 'drop it' means losing something fun, they'll run from you.", gear: ["clicker", "high_value_treats", "puzzle_toy"] },
        ]
      }
    ]
  },
  {
    id: "fitness", name: "Canine Fitness", emoji: "\uD83D\uDCAA",
    description: "Physical conditioning for a healthy, strong, injury-resistant dog.",
    color: "#EF4444", gradient: "linear-gradient(135deg, #EF4444, #DC2626)",
    unlockLevel: 4, difficulty: "Intermediate", duration: "Ongoing",
    levels: [
      { id: "fit1", name: "Body Awareness", xpReward: 100, description: "Most dogs don't know they have a back end. These exercises fix that.",
        exercises: [
          { id: "fit1a", name: "Paw Targeting", duration: 300, difficulty: 2, description: "Deliberate paw placement on different surfaces.", steps: ["Place a book or low platform on floor.", "Lure dog toward it. Mark any paw contact.", "Shape for two front paws on platform.", "Then work toward all four paws.", "Vary surfaces: towel, wobble cushion, yoga mat.", "Try a balance disc for advanced work.", "Practice stepping on/off slowly."], tips: "Builds proprioception \u2014 foundational for injury prevention.", gear: ["clicker", "high_value_treats", "target_stick"] },
          { id: "fit1b", name: "Backup", duration: 300, difficulty: 2, description: "Walk backwards on cue. Builds rear-end awareness.", steps: ["Stand facing dog in a narrow hallway.", "Step toward them slowly.", "Mark and reward ANY backward movement.", "Build to 3 steps, then 5, then 10.", "Move to open spaces.", "Add 'Back' or 'Beep beep.'", "Try backing around corners for advanced work."], tips: "Strengthens rear legs, builds body awareness, helps prevent cruciate injuries.", gear: ["clicker", "high_value_treats"] },
          { id: "fit1c", name: "Figure 8 Weave", duration: 420, difficulty: 2, description: "Weave between your legs in a figure-8 pattern.", steps: ["Stand with feet wider than shoulder width.", "Lure through legs from front to back on one side.", "Mark and reward on the other side.", "Lure through the other leg.", "Link into a flowing figure 8.", "Reduce lure to hand signal.", "Speed up as they get comfortable."], tips: "Great warm-up before physical activity. Go slow \u2014 it's a genuine workout.", gear: ["clicker", "high_value_treats"] },
        ]
      }
    ]
  }
];
