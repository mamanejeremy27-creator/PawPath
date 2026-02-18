import type { TrainingProgram } from '../../../entities';

export const PROGRAMS_SEED: Partial<TrainingProgram>[] = [
  {
    id: "foundations", name: "Puppy Foundations", emoji: "\uD83D\uDC3E",
    description: "Essential skills every puppy needs. Build trust, focus, and the basics that everything else is built on.",
    color: "#22C55E", gradient: "linear-gradient(135deg, #22C55E, #16A34A)",
    unlockLevel: 0, difficulty: "Beginner", duration: "2-4 weeks",
    levels: [
      { id: "f1", name: "First Steps", xpReward: 50, description: "The absolute basics \u2014 your first week together.",
        exercises: [
          { id: "f1a", name: "Name Recognition", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Teach your dog to look at you when you say their name.", steps: ["Say your dog's name once in a clear, happy tone.", "The moment they look at you, mark it with 'Yes!' or a clicker.", "Immediately give a small treat.", "Wait 10-15 seconds, then repeat.", "Practice 10 reps per session, 2-3 sessions per day.", "Once reliable indoors, practice in the yard with mild distractions.", "Final test: say their name when they're sniffing something \u2014 do they look?"], tips: "Don't repeat the name if they don't respond.", gear: ["clicker", "high_value_treats"] },
          { id: "f1b", name: "Sit", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "The foundation of all obedience.", steps: ["Hold a treat close to your dog's nose.", "Slowly move the treat up and slightly back over their head.", "As their head follows the treat, their bottom will naturally lower.", "The moment their butt touches the ground, mark with 'Yes!' and treat.", "Repeat 10 times per session.", "Once consistent, add the word 'Sit' just before the hand motion.", "Gradually fade the treat lure to just the hand signal."], tips: "Never push your dog's butt down.", gear: ["clicker", "high_value_treats", "treat_pouch"] },
          { id: "f1c", name: "Eye Contact Game", duration: 180, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Build focus and connection with a simple eye contact exercise.", steps: ["Hold a treat in your closed fist at your side.", "Wait silently.", "Mark 'Yes!' and reward the instant they make eye contact.", "Repeat.", "Gradually increase the duration of eye contact before marking.", "Add a cue like 'Watch me' once reliable.", "Practice during walks."], tips: "Start with even a split-second glance.", gear: ["clicker", "high_value_treats"] },
        ]
      },
      { id: "f2", name: "Building Focus", xpReward: 75, description: "Build duration and impulse control.",
        exercises: [
          { id: "f2a", name: "Stay \u2014 Introduction", duration: 300, difficulty: 2, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Teach your dog to hold position for a short duration.", steps: ["Ask your dog to sit.", "Hold your palm out flat and say 'Stay.'", "Wait 2 seconds, then mark 'Yes!' and treat.", "Gradually increase to 5 seconds, then 10, then 15.", "Add a single step back, then return and reward.", "If they break position, calmly reset.", "Always return TO your dog to reward."], tips: "If they break 3 times in a row, make it easier.", gear: ["clicker", "high_value_treats", "treat_pouch"] },
          { id: "f2b", name: "Leave It \u2014 Basics", duration: 300, difficulty: 2, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Impulse control \u2014 your dog learns ignoring something GETS them something better.", steps: ["Place a treat in your closed fist and present it.", "Wait them out.", "The moment they back away or look at you, mark 'Yes!'", "Give them a DIFFERENT, better treat from your other hand.", "Repeat until they immediately disengage.", "Upgrade: place treat on the floor covered by your hand.", "Then try with the treat visible but uncovered."], tips: "They NEVER get the thing you asked them to leave.", gear: ["clicker", "high_value_treats"] },
          { id: "f2c", name: "Touch \u2014 Hand Target", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Your dog learns to boop your palm with their nose.", steps: ["Hold your flat palm a few inches from your dog's nose.", "Most dogs will naturally investigate \u2014 mark when nose touches palm.", "Treat immediately after the mark.", "Move your hand to different positions.", "Mark each successful nose-to-palm touch.", "Add the cue 'Touch' once reliable.", "Use it to move your dog into positions."], tips: "This becomes your Swiss Army knife skill.", gear: ["clicker", "high_value_treats"] },
        ]
      },
      { id: "f3", name: "World Ready", xpReward: 100, description: "Take everything outdoors.",
        exercises: [
          { id: "f3a", name: "Recall \u2014 Come", duration: 600, difficulty: 3, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "The most important skill.", steps: ["Start indoors in a boring room.", "Say your dog's name + 'Come!' in an excited voice.", "When they come, throw a MASSIVE party.", "Practice in different rooms.", "Move to the yard on a long line.", "Let them explore, then call.", "NEVER call your dog for something they don't enjoy."], tips: "Make coming to you the BEST thing that happens all day.", gear: ["clicker", "high_value_treats", "long_line", "whistle"] },
          { id: "f3b", name: "Loose Leash Walking", duration: 600, difficulty: 3, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Walk together like partners.", steps: ["Stand still with your dog on leash. Wait for slackness.", "The moment there's slack + they look at you, mark and treat.", "Take 2-3 steps. If leash stays loose, mark and treat.", "If the leash goes tight, STOP.", "Wait for slack \u2014 mark and treat.", "Gradually increase steps between rewards.", "Practice in your driveway first."], tips: "Short, frequent sessions beat long frustrating walks.", gear: ["harness", "clicker", "high_value_treats", "treat_pouch"] },
          { id: "f3c", name: "Place / Go to Bed", duration: 300, difficulty: 2, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Go to a specific spot and chill.", steps: ["Place a mat or bed on the floor.", "Lure your dog onto it with a treat.", "Mark and reward when all four paws are on.", "Shape for a down position.", "Add short duration.", "Add the cue 'Place' or 'Go to bed.'", "Practice in different locations."], tips: "This becomes your go-to for doorbell rings, dinnertime, guests.", gear: ["clicker", "high_value_treats", "mat_bed"] },
        ]
      }
    ]
  },
  {
    id: "potty", name: "Potty Training", emoji: "\uD83D\uDEBD",
    description: "Housebreaking done right.",
    color: "#06B6D4", gradient: "linear-gradient(135deg, #06B6D4, #0891B2)",
    unlockLevel: 0, difficulty: "Beginner", duration: "2-6 weeks",
    levels: [
      { id: "pt1", name: "The Basics", xpReward: 75, description: "Set up for success.",
        exercises: [
          { id: "pt1a", name: "Set Up a Schedule", duration: 600, difficulty: 1, lifeStages: ["puppy", "adolescent"], description: "Dogs thrive on routine.", steps: ["Take your dog out first thing in the morning.", "Take them out after every meal.", "Take them out after every nap, play session, and training session.", "Take them out every 1-2 hours for puppies.", "Take them out last thing before bed.", "Always go to the SAME spot outside.", "Keep a written log for the first week."], tips: "Puppies can hold it roughly 1 hour per month of age.", gear: ["treat_pouch", "high_value_treats"] },
          { id: "pt1b", name: "The Potty Cue", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent"], description: "Teach your dog to go on command.", steps: ["Choose a cue phrase.", "Take your dog to their potty spot on leash.", "Stand still and be boring.", "The MOMENT they start to go, say your cue phrase quietly.", "When they finish, mark with 'Yes!' and give a HIGH-value treat.", "Throw a little praise party.", "Repeat at every single outdoor bathroom trip for 2+ weeks."], tips: "Don't say the cue BEFORE they go.", gear: ["high_value_treats", "treat_pouch"] },
          { id: "pt1c", name: "Supervision & Management", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent"], description: "Every accident is a missed supervision opportunity.", steps: ["If you can't watch your dog, they should be in a crate or pen.", "When your dog is loose, they should be within eyesight.", "Use baby gates to limit access to one room.", "Watch for pre-potty signals.", "If you see ANY signal, immediately take them outside.", "Tether your dog to you with a leash indoors if needed.", "Gradually expand their house freedom."], tips: "Management isn't lazy \u2014 it's smart training.", gear: ["mat_bed"] },
        ]
      },
      { id: "pt2", name: "Building Reliability", xpReward: 100, description: "Move from constant supervision to trusted freedom.",
        exercises: [
          { id: "pt2a", name: "Door Signal Training", duration: 300, difficulty: 2, lifeStages: ["puppy", "adolescent", "adult"], description: "Teach your dog to tell YOU when they need to go outside.", steps: ["Hang a bell or button near the door.", "Every time YOU take your dog out, touch their paw to the bell.", "Mark and treat when the bell rings, then immediately open the door.", "Your dog will start associating bell = door opens = outside.", "When they nose or paw the bell on their own, immediately go out.", "Reward ONLY if they actually potty outside after ringing.", "Be patient \u2014 most dogs figure this out in 1-2 weeks."], tips: "Make bell trips boring if they abuse it.", gear: ["clicker", "high_value_treats"] },
          { id: "pt2b", name: "Handling Accidents", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent"], description: "How you respond determines whether accidents keep happening.", steps: ["If you CATCH them: calmly interrupt with 'Oops!'", "Immediately take them outside.", "If they finish outside, reward as usual.", "If you find an accident AFTER the fact: do nothing.", "NEVER punish or rub their nose in it.", "Use an enzymatic cleaner.", "Ask yourself: 'What did I miss?'"], tips: "Punishment is the single biggest potty training mistake.", gear: [] },
          { id: "pt2c", name: "Expanding Freedom", duration: 600, difficulty: 2, lifeStages: ["puppy", "adolescent"], description: "Graduate from constant supervision to trusted house freedom.", steps: ["Track how many days since the last accident.", "After 2 weeks accident-free, open access to an adjacent room.", "Keep supervising in the new room.", "After 2 more accident-free weeks, open the next room.", "If accidents happen, go back to the previous level.", "Most dogs achieve full house freedom in 4-8 weeks.", "Keep the potty schedule even as freedom expands."], tips: "Slow and steady wins this race.", gear: [] },
        ]
      }
    ]
  },
  {
    id: "crate", name: "Crate Training", emoji: "\uD83C\uDFE0",
    description: "Make the crate your dog's favorite place.",
    color: "#F472B6", gradient: "linear-gradient(135deg, #F472B6, #EC4899)",
    unlockLevel: 0, difficulty: "Beginner", duration: "1-3 weeks",
    levels: [
      { id: "cr1", name: "Introduction", xpReward: 75, description: "Your dog discovers the crate is magical.",
        exercises: [
          { id: "cr1a", name: "Crate = Treats", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult"], description: "The crate becomes a treat dispensary.", steps: ["Place the crate with the door OPEN and secured.", "Scatter high-value treats around the outside.", "Place some just inside the door.", "Place some deeper inside.", "Walk away and let your dog discover them.", "Refill the treats throughout the day.", "Do this for 2-3 days."], tips: "Never push or force your dog into the crate.", gear: ["high_value_treats", "treat_mat"] },
          { id: "cr1b", name: "Meals in the Crate", duration: 600, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult"], description: "Feed every meal inside the crate.", steps: ["Place food bowl at the front of the crate. Door stays open.", "Each meal, move the bowl slightly further back.", "Within a few days, the bowl should be at the back.", "Your dog should be walking fully inside to eat.", "Feed a stuffed Kong inside the crate too.", "After 3-4 days, gently close the door WHILE they eat.", "Open the door the moment they finish eating."], tips: "If your dog won't eat inside, you've moved too fast.", gear: ["treat_mat", "puzzle_toy"] },
          { id: "cr1c", name: "Crate Cue", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult"], description: "Add a verbal cue so your dog goes to the crate happily.", steps: ["Toss a treat into the crate. When your dog goes in, mark 'Yes!'", "Give 2-3 MORE treats through the crate wall.", "Let them come out on their own.", "Repeat 10 times per session.", "Add your cue BEFORE the toss: 'Crate!' or 'Kennel!'", "Gradually fade the treat toss.", "Always reward AFTER they go in."], tips: "The crate cue should be the happiest word your dog knows.", gear: ["clicker", "high_value_treats"] },
        ]
      },
      { id: "cr2", name: "Duration & Alone Time", xpReward: 100, description: "Build from seconds to hours.",
        exercises: [
          { id: "cr2a", name: "Closed Door \u2014 Short Duration", duration: 600, difficulty: 2, lifeStages: ["puppy", "adolescent", "adult"], description: "The door closes, but good things keep happening.", steps: ["Ask your dog to go to their crate. Give a Kong.", "Close the door. Sit right next to the crate.", "After 30 seconds, open the door calmly.", "Repeat, gradually increasing.", "If your dog whines, wait for ANY pause before opening.", "If distress escalates, shorten the time.", "Practice 3-5 times per day."], tips: "Think of it like building a muscle.", gear: ["puzzle_toy", "treat_mat"] },
          { id: "cr2b", name: "Leaving the Room", duration: 600, difficulty: 2, lifeStages: ["puppy", "adolescent", "adult"], description: "Your dog stays calm while you're out of sight.", steps: ["With your dog settled, stand up and take one step away.", "Return immediately and drop a treat.", "Gradually increase steps.", "Pop back in and reward calm behavior.", "Build to 1 minute out of sight, then 5, then 10.", "Mix up durations randomly.", "Don't always make it longer."], tips: "Randomize your departures.", gear: ["puzzle_toy", "treat_mat"] },
          { id: "cr2c", name: "Real-World Crating", duration: 900, difficulty: 3, lifeStages: ["puppy", "adolescent", "adult"], description: "Your dog handles being crated while you're actually gone.", steps: ["Exercise your dog well before crating.", "Give a frozen Kong when you leave.", "Keep departures boring.", "Start with short real absences.", "Return calmly.", "Wait for calm before opening the door.", "For nighttime: crate near your bed initially."], tips: "Maximum crate time: puppies under 6 months \u2014 3-4 hours. Adults \u2014 6-8 hours.", gear: ["puzzle_toy", "treat_mat", "mat_bed"] },
        ]
      }
    ]
  },
  {
    id: "social", name: "Puppy Socialization", emoji: "\uD83D\uDC15\u200D\uD83E\uDDBA",
    description: "Expose your puppy to the world safely.",
    color: "#10B981", gradient: "linear-gradient(135deg, #10B981, #059669)",
    unlockLevel: 0, difficulty: "Beginner", duration: "8-16 weeks of age (critical period)",
    levels: [
      { id: "sc1", name: "Sounds & Surfaces", xpReward: 75, description: "Your puppy discovers the world is interesting.",
        exercises: [
          { id: "sc1a", name: "Surface Exploration", duration: 600, difficulty: 1, lifeStages: ["puppy", "adolescent"], description: "Confident dogs walk on anything.", steps: ["Gather different surfaces.", "Lay them flat on the floor.", "Let your puppy investigate at their own pace.", "When they step on a new surface, mark and treat.", "If they hesitate, place treats ON the surface.", "Add new surfaces every few days.", "Goal: confident on any surface."], tips: "The socialization window closes around 14-16 weeks.", gear: ["clicker", "high_value_treats"] },
          { id: "sc1b", name: "Sound Desensitization", duration: 600, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult"], description: "Teach your puppy that loud sounds mean good things.", steps: ["Find sound playlists online.", "Play at VERY low volume while eating.", "Gradually increase the volume over days.", "Watch body language.", "Pair specific sounds with high-value treats.", "Practice with real household sounds too.", "Never flood with scary sounds."], tips: "Always start quiet and build up.", gear: ["high_value_treats", "treat_pouch"] },
          { id: "sc1c", name: "Handling & Touch", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Prepare for vet visits, grooming, nail trims.", steps: ["Gently touch their paws. Mark and treat.", "Touch their ears. Mark and treat.", "Lift their lip. Mark and treat.", "Touch tail, belly, between toes.", "Hold each paw for 3 seconds. Build to 10.", "Touch nail clippers WITHOUT clipping.", "Have friends do the same exercises."], tips: "Your vet and groomer will thank you forever.", gear: ["clicker", "high_value_treats"] },
        ]
      },
      { id: "sc2", name: "People & Places", xpReward: 100, description: "Meet the world: different people, places, and environments.",
        exercises: [
          { id: "sc2a", name: "People Variety", duration: 600, difficulty: 2, lifeStages: ["puppy", "adolescent"], description: "Meet people who look, sound, and move differently.", steps: ["Make a checklist of different types of people.", "Aim to check off as many as possible.", "Let your puppy CHOOSE to approach.", "Have the person toss treats on the ground.", "Watch body language.", "Keep interactions short: 30-60 seconds.", "Give processing time after each interaction."], tips: "Prioritize your puppy's comfort.", gear: ["high_value_treats", "treat_pouch"] },
          { id: "sc2b", name: "New Environments", duration: 900, difficulty: 2, lifeStages: ["puppy", "adolescent", "adult"], description: "Take your puppy to new places with low pressure.", steps: ["Start with quiet environments.", "Bring LOTS of high-value treats.", "Let your puppy observe from a distance first.", "Sit on a bench and let them watch.", "Gradually move to busier spots.", "Keep early outings SHORT: 10-15 minutes.", "End every outing on a positive note."], tips: "Carry your puppy in busy areas if not fully vaccinated.", gear: ["high_value_treats", "treat_pouch", "harness"] },
          { id: "sc2c", name: "Dog-to-Dog Introduction", duration: 600, difficulty: 3, lifeStages: ["puppy", "adolescent", "adult"], description: "Meeting other dogs safely.", steps: ["Find a friend with a calm, friendly adult dog.", "Meet on neutral territory.", "Let the dogs see each other from 20+ feet away.", "Gradually allow closer approach.", "Interrupt and redirect after a few seconds.", "If both are loose and wiggly, allow supervised play.", "ALWAYS end on a good note."], tips: "Dog parks are NOT socialization.", gear: ["high_value_treats", "treat_pouch", "long_line"] },
        ]
      }
    ]
  },
  {
    id: "behavior", name: "Behavior Solutions", emoji: "\uD83E\uDDE9",
    description: "Solve the common problems.",
    color: "#8B5CF6", gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    unlockLevel: 1, difficulty: "All Levels", duration: "Ongoing",
    levels: [
      { id: "b1", name: "Impulse Control", xpReward: 100, description: "Most 'bad behavior' is just a lack of impulse control.",
        exercises: [
          { id: "b1a", name: "Wait for Food", duration: 300, difficulty: 2, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "No more lunging at the food bowl.", steps: ["Prepare food bowl.", "Hold at chest height. Start lowering slowly.", "If dog moves toward it, raise bowl back up.", "Only lower when they're still.", "Place bowl down. If they move, pick it up.", "Release with 'OK!'", "They learn: stillness = food."], tips: "Do this at every meal.", gear: ["clicker"] },
          { id: "b1b", name: "Door Manners", duration: 300, difficulty: 2, lifeStages: ["adolescent", "adult", "mature", "senior"], description: "No bolting through doorways.", steps: ["Approach any door on leash.", "Reach for handle.", "If dog surges forward, remove hand.", "Wait for them to settle, reach again.", "Only open when calm.", "Open slowly \u2014 if they move, close it.", "Release with 'OK!' or 'Free!'"], tips: "Safety skill: prevents bolting into traffic.", gear: ["clicker", "high_value_treats"] },
          { id: "b1c", name: "Calm on Cue", duration: 600, difficulty: 2, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Teach your dog to actively choose calmness.", steps: ["Watch for natural calm lying down moments.", "Walk over and place a treat between their paws.", "Do this for a full week.", "Start adding cue: 'Settle' or 'Easy.'", "Ask for 'Settle' after play or excitement.", "Reward with calm praise and slow treats.", "Build duration."], tips: "You're rewarding a MOOD, not a behavior.", gear: ["clicker", "high_value_treats", "mat_bed", "treat_mat"] },
        ]
      },
      { id: "b2", name: "Problem Solving", xpReward: 125, description: "Direct solutions for maddening behaviors.",
        exercises: [
          { id: "b2a", name: "Stop the Jumping", duration: 600, difficulty: 2, lifeStages: ["puppy", "adolescent", "adult"], description: "Replace jumping with something better.", steps: ["Decide replacement behavior.", "When jumping starts, turn away.", "Wait 3 seconds, turn back, ask for replacement.", "When they do it \u2014 explosive reward.", "Set up practice with helpers.", "Be 100% consistent.", "2-3 weeks of consistency = dramatic decrease."], tips: "Even negative attention rewards jumping.", gear: ["clicker", "high_value_treats", "treat_pouch"] },
          { id: "b2b", name: "Quiet on Cue", duration: 600, difficulty: 3, lifeStages: ["adolescent", "adult", "mature"], description: "Teach 'Quiet' as a skill.", steps: ["Wait for barking.", "Let them bark 2-3 times. Say 'Thank you.'", "Hold a treat right at their nose.", "When barking stops to sniff \u2014 mark and treat.", "Add 'Quiet' before presenting treat.", "Increase silence duration.", "Practice with real triggers."], tips: "Never yell at barking.", gear: ["clicker", "high_value_treats"] },
          { id: "b2c", name: "Drop It \u2014 Reliable", duration: 600, difficulty: 3, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Release anything from their mouth, happily.", steps: ["Start during play with low-value toy.", "Offer high-value treat at their nose.", "When they open mouth \u2014 mark and treat.", "Immediately give the toy BACK.", "Repeat 10 times per session.", "Gradually increase item value.", "Add 'Drop it' once trade is reliable."], tips: "Always trade UP.", gear: ["clicker", "high_value_treats", "puzzle_toy"] },
        ]
      }
    ]
  },
  {
    id: "obedience", name: "Core Obedience", emoji: "\uD83C\uDF93",
    description: "Make your basics bulletproof.",
    color: "#3B82F6", gradient: "linear-gradient(135deg, #3B82F6, #2563EB)",
    unlockLevel: 2, difficulty: "Intermediate", duration: "3-6 weeks",
    levels: [
      { id: "o1", name: "Reliable Basics", xpReward: 100, description: "Proof your commands against the real world.",
        exercises: [
          { id: "o1a", name: "Sit at Distance", duration: 420, difficulty: 2, lifeStages: ["adolescent", "adult", "mature"], description: "Reliable sit even across the room.", steps: ["Ask for a sit from 1 step away.", "Mark and return to reward.", "Gradually increase distance.", "Practice in different rooms.", "Move outdoors.", "Add mild distractions.", "Final test: sit from 20 feet away."], tips: "Only increase ONE D at a time.", gear: ["clicker", "high_value_treats", "treat_pouch"] },
          { id: "o1b", name: "Down from Standing", duration: 420, difficulty: 2, lifeStages: ["adolescent", "adult", "mature"], description: "Down from standing is harder but more useful.", steps: ["Hold a treat at their nose.", "Slowly lure their nose straight down.", "Draw the treat slightly toward you.", "Mark the moment elbows and belly touch.", "Treat generously.", "Practice until hand signal alone works.", "Add the verbal cue 'Down.'"], tips: "Reward intermediate steps.", gear: ["clicker", "high_value_treats"] },
          { id: "o1c", name: "Stay vs. Distractions", duration: 600, difficulty: 3, lifeStages: ["adolescent", "adult", "mature"], description: "A stay that works in the real world.", steps: ["Ask for a stay in an easy spot.", "Introduce mild distractions.", "Mark and reward heavily.", "Have someone walk past.", "Bounce a ball. Open the fridge.", "Gradually decrease distance from distractions.", "Practice near the front door."], tips: "If they break 2 times, you've made it too hard.", gear: ["clicker", "high_value_treats", "mat_bed"] },
        ]
      },
      { id: "o2", name: "Public Manners", xpReward: 125, description: "Caf\u00e9s, streets, visitors, and other dogs.",
        exercises: [
          { id: "o2a", name: "Polite Greetings", duration: 600, difficulty: 3, lifeStages: ["adolescent", "adult", "mature"], description: "Calm behavior = attention, jumping = nothing.", steps: ["Recruit a helper.", "Have the person approach.", "If calm, the person pets.", "If they jump, the person turns away.", "After 5 seconds ignoring, try again.", "Repeat.", "Practice with different people."], tips: "Requires buy-in from everyone.", gear: ["clicker", "high_value_treats", "treat_pouch"] },
          { id: "o2b", name: "Caf\u00e9 Settle", duration: 900, difficulty: 3, lifeStages: ["adult", "mature", "senior"], description: "Your dog relaxes at your feet at a caf\u00e9.", steps: ["Bring your mat to a quiet outdoor spot.", "Ask for 'Place' and reward calm behavior.", "Increase time between treats.", "Move to a quiet caf\u00e9 patio.", "Bring a Kong.", "Practice at progressively busier locations.", "Goal: 30 minutes of relaxed settling."], tips: "Walk 30+ minutes before caf\u00e9 practice.", gear: ["mat_bed", "treat_pouch", "high_value_treats", "treat_mat"] },
          { id: "o2c", name: "Walk Past Distractions", duration: 600, difficulty: 3, lifeStages: ["adolescent", "adult", "mature"], description: "Stay focused when the world is exciting.", steps: ["Practice 'Watch me' on a quiet street.", "When distraction approaches, increase treat value.", "Reward for choosing you.", "Use 'Let's go!' to redirect.", "Start at large distance.", "Practice with different distractions.", "Goal: walk past another dog at 10 feet."], tips: "Distance is your best friend.", gear: ["harness", "clicker", "high_value_treats", "treat_pouch"] },
        ]
      },
      { id: "o3", name: "Off-Leash Foundations", xpReward: 150, description: "Working toward trust without a leash.",
        exercises: [
          { id: "o3a", name: "Long Line Recall", duration: 900, difficulty: 4, lifeStages: ["adolescent", "adult"], description: "Build recall reliability with a long training lead.", steps: ["Attach long line in a safe, enclosed area.", "Let your dog explore freely.", "When engaged, call 'Come!'", "If they come immediately \u2014 MASSIVE reward.", "If they hesitate, gentle line pressure.", "Never yank.", "Practice in parks, fields, beaches."], tips: "Never go off-leash until 95%+ reliable on the long line.", gear: ["long_line", "high_value_treats", "treat_pouch", "whistle"] },
          { id: "o3b", name: "Emergency Stop", duration: 600, difficulty: 4, lifeStages: ["adolescent", "adult", "mature"], description: "Stop your dog in their tracks from a distance.", steps: ["Start with your dog walking toward you.", "Say 'STOP' firmly + raised palm.", "Mark and reward any hesitation.", "Practice from 5 feet, then 10, then 20.", "Practice when moving AWAY from you.", "Use long line as backup.", "Proof near (safe) roads."], tips: "This could save your dog's life.", gear: ["long_line", "high_value_treats", "clicker"] },
          { id: "o3c", name: "Voluntary Check-Ins", duration: 600, difficulty: 2, lifeStages: ["adolescent", "adult", "mature"], description: "Your dog naturally glances at you during off-leash time.", steps: ["During long-line time, just wait.", "Don't call. Don't say anything.", "Every voluntary look at you, mark and reward.", "They'll check in more frequently.", "Reward intermittently.", "Builds a habit of 'keeping tabs.'", "Goal: check-in every 30-60 seconds."], tips: "One of the most underrated skills.", gear: ["long_line", "high_value_treats", "treat_pouch"] },
        ]
      }
    ]
  },
  {
    id: "tricks", name: "Trick Training", emoji: "\uD83C\uDFAA",
    description: "Fun tricks that build your bond.",
    color: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
    unlockLevel: 3, difficulty: "Intermediate", duration: "Ongoing",
    levels: [
      { id: "t1", name: "Party Tricks", xpReward: 75, description: "Simple crowd-pleasers.",
        exercises: [
          { id: "t1a", name: "Shake / Paw", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "The classic.", steps: ["Ask for a sit.", "Hold treat in closed fist near their chest.", "Most dogs will paw at your hand.", "Catch their paw gently and treat.", "Repeat until they offer without the fist.", "Add the cue 'Shake' or 'Paw.'", "Teach both paws."], tips: "If they don't paw naturally, tickle behind their front leg.", gear: ["clicker", "high_value_treats"] },
          { id: "t1b", name: "Spin", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult", "mature"], description: "A full 360\u00b0 turn.", steps: ["Hold treat at nose level.", "Lure in a circle slowly.", "Mark and reward the full rotation.", "Repeat 5-8 times per session.", "Reduce lure to hand signal.", "Add 'Spin' for one direction, 'Twirl' for other.", "Speed it up."], tips: "Teach both directions for balanced flexibility.", gear: ["clicker", "high_value_treats"] },
          { id: "t1c", name: "High Five", duration: 300, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Level up from shake.", steps: ["If they know 'Shake,' hold palm up higher.", "Angle palm to face them.", "When they touch your palm \u2014 mark and treat.", "Gradually raise your hand higher.", "Add 'High five!'", "Practice with both paws.", "Chain: Sit \u2192 High Five \u2192 Spin!"], tips: "Great for photos.", gear: ["clicker", "high_value_treats"] },
        ]
      },
      { id: "t2", name: "Show Stoppers", xpReward: 100, description: "Tricks that get real reactions.",
        exercises: [
          { id: "t2a", name: "Roll Over", duration: 600, difficulty: 2, lifeStages: ["adolescent", "adult"], description: "A real show-stopper.", steps: ["Start in a down position.", "Lure treat toward their shoulder blade.", "As head turns, body starts to lean.", "Continue luring over their back.", "May take several sessions.", "Chain the full motion.", "Add 'Roll over!' with circular hand signal."], tips: "Do this on carpet or grass.", gear: ["clicker", "high_value_treats"] },
          { id: "t2b", name: "Play Dead", duration: 600, difficulty: 3, lifeStages: ["adolescent", "adult", "mature"], description: "'Bang!' \u2014 point your finger gun and they flop.", steps: ["From a down, lure nose to hip to shift onto side.", "Mark and reward for lying on side.", "Shape for head going down flat.", "Add a 3-second hold.", "Build up to dramatic 'flop' from standing.", "Add cue: point finger and say 'Bang!'", "Encourage dramatic flair."], tips: "Reward small progressions.", gear: ["clicker", "high_value_treats"] },
          { id: "t2c", name: "Crawl", duration: 600, difficulty: 3, lifeStages: ["adolescent", "adult"], description: "Army crawl across the floor.", steps: ["Start in a down position.", "Hold treat RIGHT at nose level on ground.", "Slowly drag forward \u2014 mark any forward motion.", "If they stand, reset to down.", "Use your leg as a low barrier.", "Gradually increase distance.", "Add 'Crawl' once reliable."], tips: "Builds core strength and body awareness.", gear: ["clicker", "high_value_treats"] },
        ]
      }
    ]
  },
  {
    id: "reactivity", name: "Leash Reactivity", emoji: "\uD83E\uDDAE",
    description: "Your dog barks, lunges, or loses their mind on leash. There's a fix.",
    color: "#F97316", gradient: "linear-gradient(135deg, #F97316, #EA580C)",
    unlockLevel: 2, difficulty: "Intermediate-Advanced", duration: "4-12 weeks",
    levels: [
      { id: "lr1", name: "Foundation Skills", xpReward: 100, description: "Foundation skills before working on reactivity directly.",
        exercises: [
          { id: "lr1a", name: "Engage-Disengage Game", duration: 600, difficulty: 2, lifeStages: ["adolescent", "adult", "mature"], description: "The core reactivity exercise.", steps: ["Find your dog's threshold.", "Level 1: mark when dog looks at trigger, treat.", "Repeat 10+ times.", "Level 2: wait for dog to look back at you on their own.", "If your dog reacts, you're too close.", "Practice 3-5 minute sessions.", "Gradually decrease distance over WEEKS."], tips: "This is the single most effective reactivity exercise.", gear: ["high_value_treats", "treat_pouch", "harness"] },
          { id: "lr1b", name: "Emergency U-Turn", duration: 300, difficulty: 2, lifeStages: ["adolescent", "adult", "mature", "senior"], description: "When a trigger appears too close, you need an escape plan.", steps: ["Say 'Let's go!' in a happy voice and turn 180\u00b0.", "Lure them with a treat as you turn.", "Practice until 'Let's go!' gets an immediate follow.", "Practice on quiet walks.", "Practice near mild distractions.", "Goal: instant turn and follow at any moment.", "Use this BEFORE your dog reacts."], tips: "This isn't retreat \u2014 it's smart management.", gear: ["high_value_treats", "treat_pouch", "harness"] },
          { id: "lr1c", name: "Find Your Threshold", duration: 900, difficulty: 2, lifeStages: ["adolescent", "adult", "mature"], description: "Every reactive dog has a threshold distance. Finding it is step one.", steps: ["Go where triggers are visible but distant.", "Start FAR away. 100+ feet.", "Watch your dog. Can they take treats?", "Move 10 feet closer. Check again.", "Keep closing until you see tension signs.", "That's your threshold. Back up 10-15 feet.", "Write down your threshold distance."], tips: "Your threshold might be 50 feet or 200 feet. No judgment.", gear: ["high_value_treats", "treat_pouch", "harness", "long_line"] },
        ]
      },
      { id: "lr2", name: "Real World Practice", xpReward: 150, description: "Take the foundation skills into real-world scenarios.",
        exercises: [
          { id: "lr2a", name: "Parallel Walking", duration: 900, difficulty: 3, lifeStages: ["adolescent", "adult", "mature"], description: "Walk in the same direction as another dog, at a safe distance.", steps: ["Find a training partner.", "Walk in the SAME direction, parallel.", "Mark and treat calm behavior.", "Gradually decrease the distance.", "If either dog reacts, increase distance.", "Goal: walking parallel at 15-20 feet.", "This teaches that other dogs nearby = calm."], tips: "Leave head-on approaches for last.", gear: ["high_value_treats", "treat_pouch", "harness"] },
          { id: "lr2b", name: "Trigger Stacking Awareness", duration: 600, difficulty: 3, lifeStages: ["adolescent", "adult", "mature"], description: "Learn to read stress signals and prevent trigger stacking.", steps: ["Learn early stress signals.", "Track stressors on your walk.", "Understand that stress accumulates.", "After any stressful encounter, give decompression time.", "If you've had 2-3 triggers, shorten the walk.", "Keep a walk diary for one week.", "Use this data to plan better routes."], tips: "Stress accumulates.", gear: ["high_value_treats", "treat_pouch", "harness"] },
          { id: "lr2c", name: "Decompression Walks", duration: 900, difficulty: 1, lifeStages: ["puppy", "adolescent", "adult", "mature", "senior"], description: "Not every walk is training. Decompression walks lower overall stress.", steps: ["Find a quiet, low-traffic area.", "Use a long line for safety and freedom.", "Let your dog SNIFF. Don't rush them.", "Sniffing lowers cortisol.", "Walk slowly. No agenda.", "Aim for 2-3 decompression walks per week.", "Track behavior differences."], tips: "Decompression walks are necessary, not luxury.", gear: ["long_line", "harness"] },
        ]
      }
    ]
  },
  {
    id: "fitness", name: "Canine Fitness", emoji: "\uD83C\uDFCB\uFE0F",
    description: "Physical conditioning for a healthy, strong dog.",
    color: "#EF4444", gradient: "linear-gradient(135deg, #EF4444, #DC2626)",
    unlockLevel: 4, difficulty: "Intermediate", duration: "Ongoing",
    levels: [
      { id: "fit1", name: "Body Awareness", xpReward: 100, description: "Most dogs don't know they have a back end.",
        exercises: [
          { id: "fit1a", name: "Paw Targeting", duration: 300, difficulty: 2, lifeStages: ["adolescent", "adult", "mature"], description: "Deliberate paw placement on different surfaces.", steps: ["Place a book or low platform on floor.", "Lure dog toward it. Mark any paw contact.", "Shape for two front paws on platform.", "Then work toward all four paws.", "Vary surfaces.", "Try a balance disc for advanced work.", "Practice stepping on/off slowly."], tips: "Builds proprioception.", gear: ["clicker", "high_value_treats", "target_stick"] },
          { id: "fit1b", name: "Backup", duration: 300, difficulty: 2, lifeStages: ["adolescent", "adult", "mature"], description: "Walk backwards on cue.", steps: ["Stand facing dog in a narrow hallway.", "Step toward them slowly.", "Mark and reward ANY backward movement.", "Build to 3 steps, then 5, then 10.", "Move to open spaces.", "Add 'Back' or 'Beep beep.'", "Try backing around corners."], tips: "Strengthens rear legs, builds body awareness.", gear: ["clicker", "high_value_treats"] },
          { id: "fit1c", name: "Figure 8 Weave", duration: 420, difficulty: 2, lifeStages: ["adolescent", "adult", "mature"], description: "Weave between your legs in a figure-8 pattern.", steps: ["Stand with feet wider than shoulder width.", "Lure through legs from front to back.", "Mark and reward on the other side.", "Lure through the other leg.", "Link into a flowing figure 8.", "Reduce lure to hand signal.", "Speed up as they get comfortable."], tips: "Great warm-up before physical activity.", gear: ["clicker", "high_value_treats"] },
        ]
      }
    ]
  }
];
