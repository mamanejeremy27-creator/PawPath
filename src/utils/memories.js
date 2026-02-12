/**
 * On This Day Memories — date-based lookups across journal, badges, milestones.
 * Throttled to max 3-4 memories per week per dog.
 */

const MEMORY_THROTTLE_KEY = "pawpath_memory_shown";
const MAX_PER_WEEK = 3;
const MIN_AGE_DAYS = 7; // memories must be at least 7 days old

function daysBetween(a, b) {
  return Math.floor(Math.abs(new Date(a) - new Date(b)) / (1000 * 60 * 60 * 24));
}

function sameMonthDay(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getWeekKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.floor(((now - start) / (1000 * 60 * 60 * 24) + start.getDay()) / 7);
  return `${now.getFullYear()}-W${week}`;
}

/**
 * Check throttle — have we shown enough memories this week?
 */
function canShowMemory(dogId) {
  try {
    const raw = localStorage.getItem(MEMORY_THROTTLE_KEY);
    if (!raw) return true;
    const data = JSON.parse(raw);
    const weekKey = getWeekKey();
    const dogData = data[dogId];
    if (!dogData || dogData.week !== weekKey) return true;
    return (dogData.count || 0) < MAX_PER_WEEK;
  } catch {
    return true;
  }
}

/**
 * Record that we showed a memory for this dog.
 */
export function recordMemoryShown(dogId) {
  try {
    const raw = localStorage.getItem(MEMORY_THROTTLE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const weekKey = getWeekKey();
    const dogData = data[dogId];
    if (!dogData || dogData.week !== weekKey) {
      data[dogId] = { week: weekKey, count: 1, lastShown: new Date().toISOString() };
    } else {
      data[dogId].count = (data[dogId].count || 0) + 1;
      data[dogId].lastShown = new Date().toISOString();
    }
    localStorage.setItem(MEMORY_THROTTLE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

/**
 * Find "On This Day" journal entries — same month+day from past periods.
 */
function findOnThisDayEntries(journal) {
  const today = new Date();
  return journal.filter(entry => {
    const entryDate = new Date(entry.date);
    if (sameMonthDay(entry.date, today) && entryDate.getFullYear() !== today.getFullYear()) return true;
    if (sameMonthDay(entry.date, today) && daysBetween(entry.date, today) >= 30) return true;
    return false;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Find training anniversary memories.
 */
function findAnniversaryMemory(journal, dogProfile) {
  if (!journal || journal.length === 0) return null;
  const sorted = [...journal].sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstDate = new Date(sorted[0].date);
  const today = new Date();
  const daysSince = daysBetween(firstDate, today);

  // Monthly anniversaries (1mo, 3mo, 6mo, 12mo)
  const milestones = [30, 90, 180, 365, 730];
  for (const ms of milestones) {
    if (daysSince >= ms && daysSince <= ms + 2) {
      const months = Math.round(ms / 30);
      const label = ms >= 365 ? `${Math.floor(ms / 365)} year` : `${months} month`;
      return {
        type: "anniversary",
        emoji: ms >= 365 ? "\uD83C\uDF82" : "\uD83C\uDF89",
        title: label,
        daysSince,
        firstDate: firstDate.toISOString(),
        dogName: dogProfile?.name || "",
      };
    }
  }
  return null;
}

/**
 * Find "throwback" memory — a notable past session (high rating, first of a program, etc).
 */
function findThrowbackMemory(journal) {
  if (!journal || journal.length < 3) return null;
  const today = new Date();
  const oldEntries = journal.filter(e => daysBetween(e.date, today) >= MIN_AGE_DAYS);
  if (oldEntries.length === 0) return null;

  // Prefer high-rated sessions
  const highRated = oldEntries.filter(e => e.rating >= 4);
  const pool = highRated.length > 0 ? highRated : oldEntries;

  // Pick one semi-randomly but consistently per day
  const dayIndex = today.getDate() + today.getMonth() * 31;
  return pool[dayIndex % pool.length] || null;
}

/**
 * Main entry point — get today's memory (if any) for the active dog.
 * Returns null if throttled or no memory available.
 */
export function getTodaysMemory(journal, dogProfile, dogId) {
  if (!journal || journal.length === 0) return null;
  if (!canShowMemory(dogId)) return null;

  // Priority 1: On This Day
  const onThisDay = findOnThisDayEntries(journal);
  if (onThisDay.length > 0) {
    const entry = onThisDay[0];
    const d = new Date(entry.date);
    return {
      type: "onThisDay",
      emoji: entry.programEmoji || "\uD83D\uDCF8",
      title: entry.exerciseName || "",
      subtitle: entry.programName || "",
      date: entry.date,
      timeAgo: daysBetween(entry.date, new Date()),
      note: entry.note || "",
      rating: entry.rating,
      mood: entry.mood,
      year: d.getFullYear(),
      entry,
    };
  }

  // Priority 2: Training anniversary
  const anniversary = findAnniversaryMemory(journal, dogProfile);
  if (anniversary) return anniversary;

  // Priority 3: Throwback (only if enough history)
  if (journal.length >= 5) {
    const throwback = findThrowbackMemory(journal);
    if (throwback) {
      return {
        type: "throwback",
        emoji: throwback.programEmoji || "\u2728",
        title: throwback.exerciseName || "",
        subtitle: throwback.programName || "",
        date: throwback.date,
        timeAgo: daysBetween(throwback.date, new Date()),
        note: throwback.note || "",
        rating: throwback.rating,
        mood: throwback.mood,
        entry: throwback,
      };
    }
  }

  return null;
}

/**
 * Generate a shareable memory card on canvas.
 */
export function generateMemoryCard(memory, dogName) {
  const W = 1080, H = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#0A0A0C");
  grad.addColorStop(1, "#131316");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Decorative border
  ctx.strokeStyle = "rgba(34,197,94,0.2)";
  ctx.lineWidth = 3;
  ctx.roundRect(40, 40, W - 80, H - 80, 32);
  ctx.stroke();

  // Emoji
  ctx.font = "120px serif";
  ctx.textAlign = "center";
  ctx.fillText(memory.emoji || "\uD83D\uDCF8", W / 2, 240);

  // Title label
  ctx.font = "bold 28px 'DM Sans', sans-serif";
  ctx.fillStyle = "#22C55E";
  const label = memory.type === "onThisDay" ? "ON THIS DAY"
    : memory.type === "anniversary" ? "TRAINING ANNIVERSARY"
    : "THROWBACK";
  ctx.fillText(label, W / 2, 330);

  // Dog name
  ctx.font = "bold 48px 'Playfair Display', serif";
  ctx.fillStyle = "#F5F5F7";
  ctx.fillText(dogName || "", W / 2, 420);

  // Memory title
  ctx.font = "bold 36px 'DM Sans', sans-serif";
  ctx.fillStyle = "#F5F5F7";
  ctx.fillText(memory.title || "", W / 2, 510);

  // Subtitle
  if (memory.subtitle) {
    ctx.font = "24px 'DM Sans', sans-serif";
    ctx.fillStyle = "#71717A";
    ctx.fillText(memory.subtitle, W / 2, 560);
  }

  // Note (wrap text)
  if (memory.note) {
    ctx.font = "24px 'DM Sans', sans-serif";
    ctx.fillStyle = "#A1A1AA";
    const words = memory.note.split(" ");
    let line = "", y = 640;
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > W - 200) {
        ctx.fillText(line.trim(), W / 2, y);
        line = word + " ";
        y += 36;
        if (y > 780) break;
      } else {
        line = test;
      }
    }
    if (line.trim()) ctx.fillText(line.trim(), W / 2, y);
  }

  // Rating stars
  if (memory.rating) {
    ctx.font = "36px serif";
    const stars = "\u2B50".repeat(memory.rating) + "\u2606".repeat(5 - memory.rating);
    ctx.fillText(stars, W / 2, 860);
  }

  // Date
  if (memory.date) {
    ctx.font = "22px 'DM Sans', sans-serif";
    ctx.fillStyle = "#71717A";
    const d = new Date(memory.date);
    ctx.fillText(d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), W / 2, 930);
  }

  // Branding
  ctx.font = "bold 22px 'DM Sans', sans-serif";
  ctx.fillStyle = "#22C55E";
  ctx.fillText("\uD83D\uDC3E PawPath", W / 2, H - 70);

  return canvas;
}

export function shareMemoryCard(canvas, memory) {
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], "pawpath-memory.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "PawPath Memory" });
      } catch { /* cancelled */ }
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pawpath-memory.png";
      a.click();
      URL.revokeObjectURL(url);
    }
  }, "image/png");
}
