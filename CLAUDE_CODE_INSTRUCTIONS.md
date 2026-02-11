# Claude Code Instructions — Content Expansion + Feedback System

## Task 1: Add 4 New Training Programs

I have a file called `new-programs.js` that contains 4 complete training programs:

1. **Potty Training** (🏠) — 2 levels, 6 exercises, unlocks at level 0
2. **Crate Training** (🏡) — 2 levels, 6 exercises, unlocks at level 0
3. **Puppy Socialization** (🐕‍🦺) — 2 levels, 6 exercises, unlocks at level 0
4. **Leash Reactivity** (🔗) — 2 levels, 6 exercises, unlocks at level 2

### What to do:
1. Read `new-programs.js` and merge these 4 programs into the existing `src/data/programs.js` file
2. Follow the exact same data structure as existing programs
3. Make sure the programs show up on the home screen and are navigable
4. Create Hebrew translations for ALL content in these new programs (exercise names, descriptions, all steps, all tips, level names, program descriptions) and add them to the Hebrew translation files
5. Verify the build passes with no errors

### Program order on home screen should be:
1. Puppy Foundations (existing)
2. Potty Training (NEW)
3. Crate Training (NEW)  
4. Puppy Socialization (NEW)
5. Behavior Solutions (existing)
6. Core Obedience (existing)
7. Trick Training (existing)
8. Leash Reactivity (NEW)
9. Canine Fitness (existing)

---

## Task 2: Add Full Feedback System

Read `FEEDBACK_SPEC.md` for the complete specification. In summary:

1. Add a floating feedback button (💬) above the bottom nav
2. Create a feedback modal (bottom sheet) with: type selection, rating, text input, optional contact
3. Auto-capture context (current screen, dog profile, level, XP)
4. Store feedback in localStorage
5. Add a hidden admin view (tap version number 5x on Profile screen) to view all feedback
6. Add a post-session prompt every 5th exercise
7. Translate all feedback UI to Hebrew
8. Follow existing design system

---

## After completing both tasks:
1. Run `npm run build` to verify no errors
2. Test that all 9 programs show correctly
3. Test that the feedback button and modal work
4. Test language toggle works with new content
