/**
 * Annual Recap — compute year-in-review stats from existing localStorage data.
 */

export function computeRecap({ journal, completedExercises, completedLevels, earnedBadges, totalXP, totalSessions, currentStreak, totalReviews, dogProfile, programs }) {
  if (!journal || journal.length === 0) return null;

  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEntries = journal.filter(e => new Date(e.date) >= yearStart);

  if (yearEntries.length === 0) return null;

  // Slide 1: Total sessions this year
  const sessionsThisYear = yearEntries.length;

  // Slide 2: XP earned (estimate from proportion of journal entries)
  const totalJournal = journal.length;
  const xpThisYear = totalJournal > 0 ? Math.round((sessionsThisYear / totalJournal) * totalXP) : 0;

  // Slide 3: Badges earned (we don't have dates, so show total)
  const badgesCount = earnedBadges.length;

  // Slide 4: Best streak
  const dates = [...new Set(yearEntries.map(e => new Date(e.date).toDateString()))].sort((a, b) => new Date(a) - new Date(b));
  let streak = 1, bestStreak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i]) - new Date(dates[i - 1])) / (1000 * 60 * 60 * 24);
    if (diff === 1) { streak++; bestStreak = Math.max(bestStreak, streak); }
    else streak = 1;
  }
  if (dates.length <= 1) bestStreak = dates.length;

  // Slide 5: Top program (most sessions)
  const progCounts = {};
  yearEntries.forEach(e => {
    const key = e.programName || "Unknown";
    progCounts[key] = (progCounts[key] || 0) + 1;
  });
  const topProgramName = Object.entries(progCounts).sort((a, b) => b[1] - a[1])[0];
  let topProgram = null;
  if (topProgramName && programs) {
    const found = programs.find(p => p.name === topProgramName[0]);
    topProgram = {
      name: topProgramName[0],
      sessions: topProgramName[1],
      emoji: found?.emoji || "\uD83D\uDC3E",
    };
  }

  // Slide 6: Exercises mastered
  const exercisesMastered = completedExercises.length;

  // Slide 7: Reviews done
  const reviewsThisYear = totalReviews;

  // Slide 8: Overall - active months, avg rating
  const activeMonths = new Set(yearEntries.map(e => {
    const d = new Date(e.date);
    return `${d.getFullYear()}-${d.getMonth()}`;
  })).size;

  const ratings = yearEntries.filter(e => e.rating).map(e => e.rating);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;

  // Moods
  const moodCounts = {};
  yearEntries.forEach(e => {
    if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  return {
    year: now.getFullYear(),
    dogName: dogProfile?.name || "",
    dogBreed: dogProfile?.breed || "",
    slides: [
      { id: "sessions", value: sessionsThisYear, emoji: "\uD83C\uDFAF", color: "#22C55E" },
      { id: "xp", value: xpThisYear, emoji: "\u26A1", color: "#F59E0B" },
      { id: "badges", value: badgesCount, emoji: "\uD83C\uDFC5", color: "#8B5CF6" },
      { id: "streak", value: bestStreak, emoji: "\uD83D\uDD25", color: "#EF4444" },
      { id: "topProgram", value: topProgram, emoji: topProgram?.emoji || "\uD83D\uDC3E", color: "#3B82F6" },
      { id: "exercises", value: exercisesMastered, emoji: "\u2705", color: "#10B981" },
      { id: "reviews", value: reviewsThisYear, emoji: "\uD83D\uDD04", color: "#06B6D4" },
      { id: "summary", value: { activeMonths, avgRating, topMood: topMood?.[0], sessionsThisYear }, emoji: "\uD83C\uDF1F", color: "#22C55E" },
    ],
  };
}

/**
 * Check if user has enough data for a recap (at least 5 sessions this year).
 */
export function hasRecapData(journal) {
  if (!journal || journal.length < 5) return false;
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const yearEntries = journal.filter(e => new Date(e.date) >= yearStart);
  return yearEntries.length >= 5;
}

/**
 * Generate a shareable recap summary card.
 */
export function generateRecapCard(recap) {
  const W = 1080, H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#0A0A0C");
  grad.addColorStop(0.5, "#131316");
  grad.addColorStop(1, "#0A0A0C");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Decorative circles
  ctx.fillStyle = "rgba(34,197,94,0.03)";
  ctx.beginPath();
  ctx.arc(W * 0.8, H * 0.15, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(139,92,246,0.03)";
  ctx.beginPath();
  ctx.arc(W * 0.2, H * 0.75, 250, 0, Math.PI * 2);
  ctx.fill();

  // Title
  ctx.textAlign = "center";
  ctx.font = "bold 32px 'DM Sans', sans-serif";
  ctx.fillStyle = "#22C55E";
  ctx.fillText(`${recap.year} YEAR IN REVIEW`, W / 2, 100);

  // Dog name
  ctx.font = "bold 56px 'Playfair Display', serif";
  ctx.fillStyle = "#F5F5F7";
  ctx.fillText(recap.dogName, W / 2, 180);

  // Stats grid (2 columns, 4 rows)
  const stats = [
    { label: "Sessions", value: recap.slides[0].value, emoji: "\uD83C\uDFAF" },
    { label: "XP Earned", value: recap.slides[1].value.toLocaleString(), emoji: "\u26A1" },
    { label: "Badges", value: recap.slides[2].value, emoji: "\uD83C\uDFC5" },
    { label: "Best Streak", value: `${recap.slides[3].value}d`, emoji: "\uD83D\uDD25" },
    { label: "Skills", value: recap.slides[5].value, emoji: "\u2705" },
    { label: "Reviews", value: recap.slides[6].value, emoji: "\uD83D\uDD04" },
  ];

  const colW = 440, startX = (W - colW * 2 - 40) / 2, startY = 280;
  stats.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = startX + col * (colW + 40);
    const y = startY + row * 200;

    // Card background
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.beginPath();
    ctx.roundRect(x, y, colW, 170, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Emoji
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillText(s.emoji, x + colW / 2, y + 60);

    // Value
    ctx.font = "bold 44px 'DM Sans', sans-serif";
    ctx.fillStyle = "#F5F5F7";
    ctx.fillText(String(s.value), x + colW / 2, y + 115);

    // Label
    ctx.font = "20px 'DM Sans', sans-serif";
    ctx.fillStyle = "#71717A";
    ctx.fillText(s.label, x + colW / 2, y + 150);
  });

  // Top program
  if (recap.slides[4].value) {
    const py = startY + 620;
    ctx.fillStyle = "rgba(59,130,246,0.08)";
    ctx.beginPath();
    ctx.roundRect(startX, py, W - startX * 2, 100, 24);
    ctx.fill();
    ctx.font = "bold 28px 'DM Sans', sans-serif";
    ctx.fillStyle = "#F5F5F7";
    ctx.textAlign = "center";
    ctx.fillText(`${recap.slides[4].value.emoji} Top Program: ${recap.slides[4].value.name}`, W / 2, py + 60);
  }

  // Branding
  ctx.font = "bold 24px 'DM Sans', sans-serif";
  ctx.fillStyle = "#22C55E";
  ctx.textAlign = "center";
  ctx.fillText("\uD83D\uDC3E PawPath", W / 2, H - 60);
  ctx.font = "18px 'DM Sans', sans-serif";
  ctx.fillStyle = "#71717A";
  ctx.fillText("Year in Review", W / 2, H - 30);

  return canvas;
}
