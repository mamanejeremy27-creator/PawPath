// PawPath — New Training Programs
// Hand this file to Claude Code to add to the app
// These follow the exact same data structure as existing programs

export const NEW_PROGRAMS = [
  {
    id: "potty",
    name: "Potty Training",
    emoji: "🏠",
    description: "Housebreaking done right. A structured, no-punishment approach to teaching your dog where and when to go.",
    color: "#06B6D4",
    gradient: "linear-gradient(135deg, #06B6D4, #0891B2)",
    unlockLevel: 0,
    difficulty: "Beginner",
    duration: "2–6 weeks",
    levels: [
      {
        id: "pt1",
        name: "The Basics",
        xpReward: 75,
        description: "Set up for success — schedules, management, and the foundation of clean habits.",
        exercises: [
          {
            id: "pt1a",
            name: "Set Up a Schedule",
            duration: 600,
            difficulty: 1,
            description: "Dogs thrive on routine. A predictable schedule is 80% of potty training — it prevents accidents before they happen.",
            steps: [
              "Take your dog out first thing in the morning — within 5 minutes of waking up.",
              "Take them out after every meal, within 15-20 minutes of eating.",
              "Take them out after every nap, play session, and training session.",
              "Take them out every 1-2 hours for puppies, every 3-4 hours for adults.",
              "Take them out last thing before bed.",
              "Always go to the SAME spot outside — the scent triggers the behavior.",
              "Keep a written log for the first week: time, location, success or accident. You'll see patterns."
            ],
            tips: "Puppies can hold it roughly 1 hour per month of age. A 3-month-old puppy needs to go out every 3 hours maximum. Don't expect more than that — it's biology, not disobedience.",
            gear: ["treat_pouch", "high_value_treats"]
          },
          {
            id: "pt1b",
            name: "The Potty Cue",
            duration: 300,
            difficulty: 1,
            description: "Teach your dog to go on command. Yes, really — this is one of the most useful things you'll ever teach.",
            steps: [
              "Choose a cue phrase: 'Go potty,' 'Do your business,' 'Hurry up' — anything you're comfortable saying in public.",
              "Take your dog to their potty spot on leash.",
              "Stand still and be boring. Don't play, don't talk, just wait.",
              "The MOMENT they start to go, say your cue phrase quietly.",
              "When they finish, mark with 'Yes!' and give a HIGH-value treat immediately.",
              "Throw a little praise party — 'Good potty!' with genuine enthusiasm.",
              "Repeat at every single outdoor bathroom trip for 2+ weeks."
            ],
            tips: "Don't say the cue BEFORE they go — that teaches them the word means 'stand around outside.' Say it WHILE they're going, so they associate the word with the action. After 2 weeks, you can start saying it before and they'll understand.",
            gear: ["high_value_treats", "treat_pouch"]
          },
          {
            id: "pt1c",
            name: "Supervision & Management",
            duration: 300,
            difficulty: 1,
            description: "Every accident is a missed supervision opportunity. Learn to manage your space so accidents can't happen.",
            steps: [
              "Rule #1: If you can't watch your dog, they should be in a crate or pen. Period.",
              "When your dog is loose in the house, they should be within eyesight at all times.",
              "Use baby gates to limit access to one room at a time.",
              "Watch for pre-potty signals: sniffing the ground, circling, whining, heading toward the door.",
              "If you see ANY signal, immediately and calmly take them outside. Don't wait.",
              "Tether your dog to you with a leash indoors if needed — this keeps them close and visible.",
              "Gradually expand their house freedom as they prove reliable — one room at a time over weeks."
            ],
            tips: "Think of it like this: every successful outdoor potty builds the right habit. Every indoor accident builds the wrong one. Your job is to make sure the right habit gets all the practice. Management isn't lazy — it's smart training.",
            gear: ["mat_bed"]
          }
        ]
      },
      {
        id: "pt2",
        name: "Building Reliability",
        xpReward: 100,
        description: "Move from constant supervision to trusted freedom. Your dog starts choosing the right spot on their own.",
        exercises: [
          {
            id: "pt2a",
            name: "Door Signal Training",
            duration: 300,
            difficulty: 2,
            description: "Teach your dog to tell YOU when they need to go outside. This is the holy grail of potty training.",
            steps: [
              "Hang a bell or button near the door you use for potty trips.",
              "Every time YOU take your dog out for potty, touch their paw to the bell/button first.",
              "Mark and treat when the bell rings, then immediately open the door.",
              "Your dog will start associating bell = door opens = outside.",
              "When they nose or paw the bell on their own — even accidentally — immediately go out.",
              "Reward ONLY if they actually potty outside after ringing (not just for a fun trip).",
              "Be patient — most dogs figure this out in 1-2 weeks."
            ],
            tips: "Some dogs abuse the bell to go outside and play. If this happens, make bell trips boring — straight to the potty spot, 3 minutes max, then back inside. Save fun outdoor time for separate trips.",
            gear: ["clicker", "high_value_treats"]
          },
          {
            id: "pt2b",
            name: "Handling Accidents",
            duration: 300,
            difficulty: 1,
            description: "Accidents happen. How you respond determines whether they keep happening or stop.",
            steps: [
              "If you CATCH them in the act: calmly interrupt with 'Oops!' or a clap. No yelling.",
              "Immediately take them outside to their potty spot.",
              "If they finish outside, reward as usual. Big party.",
              "If you find an accident AFTER the fact: do nothing. Clean it up silently.",
              "NEVER punish, rub their nose in it, or scold. This teaches them to hide, not to hold it.",
              "Use an enzymatic cleaner (not regular cleaner) to fully remove the scent. Dogs return to spots that smell like previous accidents.",
              "Ask yourself: 'What did I miss?' An accident means the schedule or supervision needs adjusting."
            ],
            tips: "Punishment for accidents is the single biggest potty training mistake. It doesn't teach the dog where to go — it teaches them that YOU are scary when they have to go. They'll start hiding behind the couch to pee instead of going in front of you outside. Always, always respond calmly.",
            gear: []
          },
          {
            id: "pt2c",
            name: "Expanding Freedom",
            duration: 600,
            difficulty: 2,
            description: "Graduate from constant supervision to trusted house freedom — one room at a time.",
            steps: [
              "Track how many days since the last accident in each room.",
              "After 2 weeks accident-free in one room, open access to an adjacent room.",
              "Keep supervising in the new room — treat it like starting over.",
              "After 2 more accident-free weeks, open the next room.",
              "If accidents happen in the new space, go back to the previous level for a week.",
              "Most dogs achieve full house freedom in 4-8 weeks of this process.",
              "Keep the potty schedule even as freedom expands — routine is still key."
            ],
            tips: "This is where most people rush and get frustrated. Giving full house access too early is the #1 cause of potty training regression. Trust the process — slow and steady wins this race.",
            gear: []
          }
        ]
      }
    ]
  },
  {
    id: "crate",
    name: "Crate Training",
    emoji: "🏡",
    description: "Make the crate your dog's favorite place. A safe space they choose to go to, not a punishment.",
    color: "#F472B6",
    gradient: "linear-gradient(135deg, #F472B6, #EC4899)",
    unlockLevel: 0,
    difficulty: "Beginner",
    duration: "1–3 weeks",
    levels: [
      {
        id: "cr1",
        name: "Introduction",
        xpReward: 75,
        description: "Your dog discovers the crate is a magical place where amazing things happen.",
        exercises: [
          {
            id: "cr1a",
            name: "Crate = Treats",
            duration: 300,
            difficulty: 1,
            description: "The crate becomes a treat dispensary. Your dog learns that approaching and entering the crate is the best decision they can make.",
            steps: [
              "Place the crate in a common area with the door OPEN and secured so it can't swing shut.",
              "Scatter high-value treats around the outside of the crate.",
              "Place some just inside the door.",
              "Place some deeper inside.",
              "Walk away and let your dog discover them at their own pace. No pressure.",
              "Refill the treats several times throughout the day without making a fuss.",
              "Do this for 2-3 days. The crate should become a treasure chest they check regularly."
            ],
            tips: "Never push, lure aggressively, or force your dog into the crate. The entire point is that THEY choose to go in. Forcing creates negative associations that are very hard to undo.",
            gear: ["high_value_treats", "treat_mat"]
          },
          {
            id: "cr1b",
            name: "Meals in the Crate",
            duration: 600,
            difficulty: 1,
            description: "Feed every meal inside the crate. Food is the ultimate positive association.",
            steps: [
              "Place your dog's food bowl at the front of the crate. Door stays open.",
              "Each meal, move the bowl slightly further back.",
              "Within a few days, the bowl should be at the back of the crate.",
              "Your dog should be walking fully inside to eat. Still door open.",
              "Feed a stuffed Kong or lick mat inside the crate for bonus positive associations.",
              "After 3-4 days of comfortable eating inside, gently close the door WHILE they eat.",
              "Open the door the moment they finish eating. Don't wait."
            ],
            tips: "If your dog won't eat inside the crate, you've moved too fast. Back up to wherever they were comfortable and stay there for a few more days. There's no rush.",
            gear: ["treat_mat", "puzzle_toy"]
          },
          {
            id: "cr1c",
            name: "Crate Cue",
            duration: 300,
            difficulty: 1,
            description: "Add a verbal cue so your dog goes to the crate on command — happily.",
            steps: [
              "Toss a treat into the crate. When your dog goes in, mark 'Yes!'",
              "Give 2-3 MORE treats through the crate wall while they're inside.",
              "Let them come out on their own. Don't close the door yet.",
              "Repeat 10 times per session.",
              "Once they're charging in reliably, add your cue BEFORE the toss: 'Crate!' or 'Kennel!'",
              "Gradually fade the treat toss — just point and give the cue.",
              "Always reward AFTER they go in. The crate always pays."
            ],
            tips: "The crate cue should be the happiest word your dog knows. Say it with enthusiasm, reward generously. If it ever becomes a word they dread, you've made it too associated with being left alone too soon.",
            gear: ["clicker", "high_value_treats"]
          }
        ]
      },
      {
        id: "cr2",
        name: "Duration & Alone Time",
        xpReward: 100,
        description: "Build from seconds to hours. Your dog learns to relax and settle in their crate.",
        exercises: [
          {
            id: "cr2a",
            name: "Closed Door — Short Duration",
            duration: 600,
            difficulty: 2,
            description: "The door closes, but good things keep happening. Build duration in tiny increments.",
            steps: [
              "Ask your dog to go to their crate. Give a Kong or long-lasting chew.",
              "Close the door. Sit right next to the crate.",
              "After 30 seconds, open the door calmly. No fanfare.",
              "Repeat, gradually increasing: 1 minute, 2 minutes, 5 minutes.",
              "If your dog whines, wait for ANY pause in whining before opening. Don't reward the whine.",
              "If distress escalates, you've gone too long. Shorten the time and build back up.",
              "Practice 3-5 times per day at varying durations."
            ],
            tips: "The biggest mistake is going from 0 to 30 minutes on day one. Think of it like building a muscle — tiny increments, lots of reps. 30 seconds done 20 times is better than 10 minutes done once.",
            gear: ["puzzle_toy", "treat_mat"]
          },
          {
            id: "cr2b",
            name: "Leaving the Room",
            duration: 600,
            difficulty: 2,
            description: "Your dog stays calm in the crate while you're out of sight. This is the bridge to real alone time.",
            steps: [
              "With your dog settled in the crate with a chew, stand up and take one step away.",
              "Return immediately and drop a treat through the crate.",
              "Gradually increase: 2 steps, 5 steps, walk to the doorway, step out of sight.",
              "Pop back in and reward calm behavior.",
              "If they're quiet out of sight for 10 seconds, mark and reward.",
              "Build to 1 minute out of sight, then 5, then 10.",
              "Mix up durations randomly — don't always make it longer. Short ones build confidence."
            ],
            tips: "Randomize your departures. If you always increase the time, your dog learns 'it keeps getting worse.' If you mix short and long, they learn 'this could be over any second' and relax.",
            gear: ["puzzle_toy", "treat_mat"]
          },
          {
            id: "cr2c",
            name: "Real-World Crating",
            duration: 900,
            difficulty: 3,
            description: "Your dog handles being crated while you're actually gone — errands, work, nighttime.",
            steps: [
              "Before crating for real absences, exercise your dog well. A tired dog settles easier.",
              "Give a frozen Kong or long-lasting chew when you leave.",
              "Keep departures boring. No emotional goodbyes — just crate, treat, leave.",
              "Start with short real absences: 15 minutes, 30 minutes, 1 hour.",
              "Return calmly. Don't rush to the crate with excitement.",
              "Wait for your dog to be calm before opening the door.",
              "For nighttime: crate near your bed initially, gradually move if desired."
            ],
            tips: "Maximum crate time guidelines: puppies under 6 months — 3-4 hours max. Adult dogs — 6-8 hours max. Nobody — dog or human — should be confined longer than that. If your schedule requires longer, arrange a midday walk or dog walker.",
            gear: ["puzzle_toy", "treat_mat", "mat_bed"]
          }
        ]
      }
    ]
  },
  {
    id: "social",
    name: "Puppy Socialization",
    emoji: "🐕‍🦺",
    description: "Expose your puppy to the world safely. Build confidence, not fear. The window is short — start now.",
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
    unlockLevel: 0,
    difficulty: "Beginner",
    duration: "8–16 weeks of age (critical period)",
    levels: [
      {
        id: "sc1",
        name: "Sounds & Surfaces",
        xpReward: 75,
        description: "Your puppy discovers that the world is full of interesting (not scary) things.",
        exercises: [
          {
            id: "sc1a",
            name: "Surface Exploration",
            duration: 600,
            difficulty: 1,
            description: "Confident dogs walk on anything. Fearful dogs avoid new textures. Start building surface confidence now.",
            steps: [
              "Gather different surfaces: a towel, bubble wrap, a cookie sheet, cardboard, a yoga mat, a trash bag.",
              "Lay them flat on the floor in a room your puppy knows.",
              "Let your puppy investigate at their own pace. Don't force them onto anything.",
              "When they step on a new surface, mark 'Yes!' and treat generously.",
              "If they hesitate, place treats ON the surface and let them figure it out.",
              "Add new surfaces every few days: metal grate, wet grass, gravel, sand.",
              "Goal: your puppy walks confidently on any surface without hesitation."
            ],
            tips: "The socialization window closes around 14-16 weeks. Every positive experience now pays dividends for YEARS. A puppy who walks on bubble wrap at 10 weeks won't be afraid of weird floors as an adult.",
            gear: ["clicker", "high_value_treats"]
          },
          {
            id: "sc1b",
            name: "Sound Desensitization",
            duration: 600,
            difficulty: 1,
            description: "Thunderstorms, fireworks, traffic, vacuum cleaners — teach your puppy that loud sounds mean good things.",
            steps: [
              "Find sound playlists online: 'puppy socialization sounds' or 'dog desensitization audio.'",
              "Play the sounds at VERY low volume while your puppy eats or plays.",
              "Gradually increase the volume over days — never jump to loud.",
              "Watch your puppy's body language. Ears back, tail tucked, freezing = too loud.",
              "Pair specific sounds with high-value treats: thunder sound → treat party.",
              "Practice with real household sounds too: vacuum (far away first), blender, doorbell.",
              "If your puppy shows fear, don't comfort excessively — act normal, offer treats, move further from the sound."
            ],
            tips: "Never flood your puppy with scary sounds 'to get them used to it.' That creates phobias, not confidence. Always start quiet and build up. The puppy sets the pace.",
            gear: ["high_value_treats", "treat_pouch"]
          },
          {
            id: "sc1c",
            name: "Handling & Touch",
            duration: 300,
            difficulty: 1,
            description: "Prepare your puppy for vet visits, grooming, nail trims, and being handled by strangers.",
            steps: [
              "With your puppy relaxed, gently touch their paws. Mark and treat.",
              "Touch their ears. Mark and treat.",
              "Lift their lip and look at their teeth. Mark and treat.",
              "Touch their tail, belly, between toes. Mark and treat each one.",
              "Practice holding each paw for 3 seconds. Build to 10 seconds.",
              "Touch nail clippers to their nails WITHOUT clipping. Mark and treat.",
              "Have friends and family do the same handling exercises. Different hands = confidence."
            ],
            tips: "Your vet and groomer will thank you forever. A dog that's comfortable being handled is a dog that gets better medical care, less stressful grooming, and a happier life overall.",
            gear: ["clicker", "high_value_treats"]
          }
        ]
      },
      {
        id: "sc2",
        name: "People & Places",
        xpReward: 100,
        description: "Meet the world: different people, places, and environments. Quality over quantity.",
        exercises: [
          {
            id: "sc2a",
            name: "People Variety",
            duration: 600,
            difficulty: 2,
            description: "Your puppy needs to meet people who look, sound, and move differently. Variety builds confidence.",
            steps: [
              "Make a checklist: men, women, children, elderly, people with hats, sunglasses, beards, wheelchairs, umbrellas.",
              "Aim to check off as many as possible over the next few weeks.",
              "Let your puppy CHOOSE to approach. Never force interactions.",
              "Have the person toss treats on the ground (not hand-feed if puppy is timid).",
              "Watch body language: loose wiggly body = happy. Frozen, tucked, hiding = overwhelmed.",
              "Keep interactions short: 30-60 seconds. Quality over quantity.",
              "After each positive interaction, give your puppy a break. Processing time matters."
            ],
            tips: "The goal isn't to have your puppy meet 100 people. It's to have 20 POSITIVE experiences with different types of people. One scary interaction can undo ten good ones. Always prioritize your puppy's comfort.",
            gear: ["high_value_treats", "treat_pouch"]
          },
          {
            id: "sc2b",
            name: "New Environments",
            duration: 900,
            difficulty: 2,
            description: "Take your puppy to new places — but make every outing a positive, low-pressure experience.",
            steps: [
              "Start with quiet environments: a friend's house, a quiet park, an empty parking lot.",
              "Bring LOTS of high-value treats. Every new place should rain treats.",
              "Let your puppy observe from a distance first. Don't rush them into the action.",
              "Sit on a bench and let them watch the world go by. Treat for calm observation.",
              "Gradually move to busier spots: outdoor café, pet store, farmer's market.",
              "Keep early outings SHORT: 10-15 minutes max. Leave before they get overwhelmed.",
              "End every outing on a positive note — if they're getting stressed, leave and treat on the way out."
            ],
            tips: "Carry your puppy in busy areas if they're not fully vaccinated yet — they still get the exposure without the health risk. Ask your vet about safe socialization before final vaccines are complete.",
            gear: ["high_value_treats", "treat_pouch", "harness"]
          },
          {
            id: "sc2c",
            name: "Dog-to-Dog Introduction",
            duration: 600,
            difficulty: 3,
            description: "Meeting other dogs safely. Not every dog needs to be friends — but every dog needs to be neutral.",
            steps: [
              "Find a friend with a calm, vaccinated, puppy-friendly adult dog.",
              "Meet on neutral territory (not anyone's home or yard).",
              "Let the dogs see each other from 20+ feet away first. Treat both dogs.",
              "Gradually allow closer approach. Let them sniff briefly (3-5 seconds).",
              "Interrupt and redirect after a few seconds. Sniffing is enough.",
              "If both are loose and wiggly, allow supervised play in short bursts (30 seconds on, break, repeat).",
              "ALWAYS end on a good note. Better to stop too early than too late."
            ],
            tips: "Dog parks are NOT socialization. They're uncontrolled chaos where one bad experience can create lifelong fear. Controlled, positive introductions with known friendly dogs are what build confidence. Quality, not quantity.",
            gear: ["high_value_treats", "treat_pouch", "long_line"]
          }
        ]
      }
    ]
  },
  {
    id: "reactivity",
    name: "Leash Reactivity",
    emoji: "🔗",
    description: "Your dog barks, lunges, or loses their mind on leash at other dogs or people. There's a systematic fix.",
    color: "#F97316",
    gradient: "linear-gradient(135deg, #F97316, #EA580C)",
    unlockLevel: 2,
    difficulty: "Intermediate–Advanced",
    duration: "4–12 weeks",
    levels: [
      {
        id: "lr1",
        name: "Foundation Skills",
        xpReward: 100,
        description: "Before working on reactivity directly, your dog needs some foundation skills to fall back on.",
        exercises: [
          {
            id: "lr1a",
            name: "Engage-Disengage Game",
            duration: 600,
            difficulty: 2,
            description: "The core reactivity exercise. Your dog learns: see trigger → look at you → get rewarded. This rewires the emotional response.",
            steps: [
              "Find your dog's threshold: the distance where they notice a trigger but DON'T react. This is your starting point.",
              "Level 1 (Engage): The moment your dog looks at the trigger, mark 'Yes!' and treat. You're rewarding noticing without reacting.",
              "Repeat 10+ times at this distance. Your dog should start looking at the trigger and then looking at you expectantly.",
              "Level 2 (Disengage): Now wait for your dog to look at the trigger AND THEN look back at you on their own. Mark and treat the look back.",
              "If your dog reacts (barks, lunges), you're too close. Increase distance and try again.",
              "Practice 3-5 minute sessions, 3-5 times per week.",
              "Gradually decrease distance over WEEKS, not days. Inches, not feet."
            ],
            tips: "This is the single most effective reactivity exercise in modern dog training. It works because you're changing the EMOTIONAL response, not just suppressing the behavior. Your dog goes from 'I see a dog and feel scared/angry' to 'I see a dog and good things happen.' That emotional shift is everything.",
            gear: ["high_value_treats", "treat_pouch", "harness"]
          },
          {
            id: "lr1b",
            name: "Emergency U-Turn",
            duration: 300,
            difficulty: 2,
            description: "When a trigger appears too close too fast, you need an escape plan. The U-turn is your emergency exit.",
            steps: [
              "At home with no distractions, say 'Let's go!' in a happy voice and turn 180° away from your dog.",
              "Lure them with a treat as you turn. Mark and reward when they follow.",
              "Practice until 'Let's go!' gets an immediate turn and follow — no lure needed.",
              "Practice on quiet walks with no triggers present.",
              "Practice near mild distractions (a squirrel, a person far away).",
              "The goal: you can say 'Let's go!' at any moment and your dog spins and follows you away.",
              "Use this BEFORE your dog reacts. Don't wait for the explosion — prevent it."
            ],
            tips: "This isn't retreat — it's smart management. You're not 'giving in' by turning around. You're preventing a rehearsal of reactive behavior. Every time your dog practices reacting, the habit gets stronger. Every time you prevent it, you win.",
            gear: ["high_value_treats", "treat_pouch", "harness"]
          },
          {
            id: "lr1c",
            name: "Find Your Threshold",
            duration: 900,
            difficulty: 2,
            description: "Every reactive dog has a threshold distance — where they notice but don't explode. Finding it is step one.",
            steps: [
              "Go to a place where triggers (dogs/people) are visible but at a distance: a park bench, across a parking lot.",
              "Start FAR away. Like, embarrassingly far. 100+ feet.",
              "Watch your dog. Can they see the trigger and still take treats? Still look at you? That's under threshold.",
              "Move 10 feet closer. Check again. Still taking treats? Still responsive? Good.",
              "Keep closing distance until you see the FIRST signs of tension: ears forward, body stiffening, fixating.",
              "That's your threshold distance. Back up 10-15 feet. THIS is where you train.",
              "Write down your threshold distance. You'll track this over weeks — it should shrink."
            ],
            tips: "Your threshold might be 50 feet or 200 feet. There's no judgment. It is what it is. The mistake most people make is training too close because they're embarrassed. Your dog doesn't care about embarrassment — they need you to respect their limits.",
            gear: ["high_value_treats", "treat_pouch", "harness", "long_line"]
          }
        ]
      },
      {
        id: "lr2",
        name: "Real World Practice",
        xpReward: 150,
        description: "Take the foundation skills into real-world scenarios. Controlled exposure with strategic retreats.",
        exercises: [
          {
            id: "lr2a",
            name: "Parallel Walking",
            duration: 900,
            difficulty: 3,
            description: "Walk in the same direction as another dog, at a safe distance. This is less confrontational than approaching head-on.",
            steps: [
              "Find a training partner with a calm dog. Start on opposite sides of a wide street or path.",
              "Both handlers walk in the SAME direction, parallel to each other.",
              "Mark and treat your dog for calm behavior: walking, looking at you, not reacting.",
              "Gradually decrease the distance between you over multiple sessions.",
              "If either dog reacts, increase distance immediately.",
              "Goal: walking parallel at 15-20 feet with calm behavior from both dogs.",
              "This teaches your dog: other dogs walking nearby = treats and calm. Not a threat."
            ],
            tips: "Head-on approaches are the hardest scenario for reactive dogs. Start with parallel walking, then try curved approaches, then perpendicular crossings. Leave head-on for last — and even then, cross to the other side of the street when possible.",
            gear: ["high_value_treats", "treat_pouch", "harness"]
          },
          {
            id: "lr2b",
            name: "Trigger Stacking Awareness",
            duration: 600,
            difficulty: 3,
            description: "Learn to read your dog's stress signals and prevent trigger stacking — where multiple small stressors add up to an explosion.",
            steps: [
              "Learn your dog's early stress signals: lip licking, yawning, whale eye, tense mouth, shake-offs.",
              "Track stressors on your walk: loud truck (stress +1), saw a dog far away (stress +1), child running (+1).",
              "Understand that stress accumulates. Your dog might handle one trigger but not three in a row.",
              "After any stressful encounter, give your dog decompression time: sniffing, slow walking, space.",
              "If you've had 2-3 triggers on a walk, shorten the walk or choose a quieter route home.",
              "Keep a walk diary for one week noting: triggers encountered, dog's reactions, your responses.",
              "Use this data to plan better routes, times, and strategies."
            ],
            tips: "The classic scenario: your dog was fine seeing a dog at the park, fine hearing a skateboard, fine with a jogger — then EXPLODES at a dog across the street. The owner says 'that came out of nowhere!' But it didn't. Each stressor raised the baseline until there was no room left. Learn to count the stressors.",
            gear: ["high_value_treats", "treat_pouch", "harness"]
          },
          {
            id: "lr2c",
            name: "Decompression Walks",
            duration: 900,
            difficulty: 1,
            description: "Not every walk is training. Decompression walks lower your dog's overall stress — making training sessions more effective.",
            steps: [
              "Find a quiet, low-traffic area: a field, quiet trail, or empty park early in the morning.",
              "Use a long line (15-30 ft) for safety and freedom.",
              "Let your dog SNIFF. Don't rush them. Don't direct them. Just follow.",
              "Sniffing lowers cortisol (stress hormone) in dogs. It's literally medicine.",
              "Walk slowly. No agenda. This is your dog's time.",
              "Aim for 2-3 decompression walks per week between training sessions.",
              "Track your dog's behavior on training days after decompression walks vs. without. You'll see a difference."
            ],
            tips: "Decompression walks are not luxury — they're necessary. A chronically stressed dog can't learn. It's like trying to study for an exam while someone is yelling at you. Lower the baseline stress first, then train. The results will surprise you.",
            gear: ["long_line", "harness"]
          }
        ]
      }
    ]
  }
];
