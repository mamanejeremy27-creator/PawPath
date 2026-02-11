# PawPath — Feedback System Specification

## Overview
Add a full in-app feedback system so users can report bugs, suggest features, rate the app, and share their training experience. Store everything in localStorage and provide an admin view.

## Features Required

### 1. Feedback Button (always visible)
- Small floating button in the bottom-right corner (above the nav bar)
- Icon: 💬 or a speech bubble
- Tapping opens the feedback modal
- Should NOT interfere with navigation or exercise views

### 2. Feedback Modal (bottom sheet)
A bottom-sheet modal with the following fields:

#### Feedback Type (required, single select)
- 🐛 Bug Report — "Something isn't working"
- 💡 Feature Request — "I wish the app could..."
- ⭐ App Rating — "How am I doing?"
- 📝 General Feedback — "I want to say something"

#### Rating (shown for App Rating type, 1-5 stars)
- Star rating component similar to the journal rating

#### Details (required, textarea)
- Placeholder changes based on type:
  - Bug: "What happened? What did you expect to happen?"
  - Feature: "What would you like the app to do?"
  - Rating: "What do you like? What could be better?"
  - General: "Share your thoughts..."

#### Contact (optional)
- Email or phone field
- Placeholder: "Optional — if you'd like us to follow up"

#### Screenshot context (auto-captured)
- Auto-save which screen they were on when they opened feedback
- Auto-save their dog profile (name, breed)
- Auto-save their current level/XP/streak

#### Submit button
- "Send Feedback" with the green accent color
- Show a thank-you confirmation after submission with animation
- Auto-close after 2 seconds

### 3. Data Structure
Each feedback entry should contain:
```javascript
{
  id: "unique-id",
  type: "bug" | "feature" | "rating" | "general",
  rating: 1-5 (only for rating type),
  message: "user's feedback text",
  contact: "optional email/phone",
  context: {
    screen: "home" | "exercise" | "journal" | etc,
    dogName: "Luna",
    dogBreed: "Golden Retriever",
    playerLevel: 3,
    totalXP: 450,
    currentStreak: 5,
    totalExercises: 12,
    language: "en" | "he"
  },
  timestamp: "ISO date string",
  status: "new" // for future admin use
}
```

### 4. Storage
- Save to localStorage under key `pawpath_feedback`
- Array of feedback objects
- Also persist to the main pawpath storage

### 5. Admin/Dev View (hidden)
- Accessible by tapping the app version number 5 times on the Profile screen
- Shows all feedback entries in a scrollable list
- Filter by type (all / bugs / features / ratings / general)
- Shows timestamp, type badge, message preview, context info
- Option to export as JSON (copy to clipboard)
- This is temporary until a real backend is added

### 6. Post-Session Prompt
- After completing every 5th exercise, show a gentle prompt:
  "Enjoying PawPath? We'd love your feedback!"
  [Rate the App] [Maybe Later]
- Don't show this more than once per week
- Track `lastFeedbackPrompt` date in storage

### 7. Translations
Add Hebrew translations for all feedback UI text:
- "Send Feedback" → "שלח משוב"
- "Bug Report" → "דיווח על באג"
- "Feature Request" → "בקשת פיצ'ר"
- "App Rating" → "דירוג האפליקציה"
- "General Feedback" → "משוב כללי"
- "What happened?" → "?מה קרה"
- "Send" → "שלח"
- "Thank you for your feedback!" → "!תודה על המשוב שלך"
- "Enjoying PawPath?" → "?נהנים מ-PawPath"
- "Rate the App" → "דרגו את האפליקציה"
- "Maybe Later" → "אולי אחר כך"

### 8. Design
- Follow existing design system: dark theme, DM Sans font, green accent
- Bottom sheet modal with backdrop blur (same as journal modal and reminders)
- Type selection as tappable cards with emoji + label
- Smooth animations consistent with rest of app
- Confirmation should feel rewarding (similar to badge unlock animation)
