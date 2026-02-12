/**
 * Generate a milestone card image using HTML Canvas.
 * Card dimensions: 1080 x 1350 px (4:5 Instagram ratio).
 * Returns a PNG data URL.
 */

const W = 1080;
const H = 1350;

// Color palette matching the app's dark theme
const COLORS = {
  bg: "#0A0A0C",
  surface: "#131316",
  border: "rgba(255,255,255,0.06)",
  accent: "#22C55E",
  accentGlow: "rgba(34,197,94,0.15)",
  text: "#F5F5F7",
  textMuted: "#A1A1AA",
  textDim: "#71717A",
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawStatBox(ctx, x, y, w, h, value, label, emoji) {
  // Background
  roundRect(ctx, x, y, w, h, 24);
  ctx.fillStyle = COLORS.surface;
  ctx.fill();
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Emoji
  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.text;
  ctx.fillText(emoji, x + w / 2, y + 60);

  // Value
  ctx.font = "bold 64px 'DM Sans', sans-serif";
  ctx.fillStyle = COLORS.text;
  ctx.fillText(String(value), x + w / 2, y + 135);

  // Label
  ctx.font = "600 28px 'DM Sans', sans-serif";
  ctx.fillStyle = COLORS.textDim;
  ctx.fillText(label, x + w / 2, y + 175);
}

export function generateMilestoneCard({ monthLabel, dogName, stats, labels }) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle gradient overlay at top
  const grad = ctx.createLinearGradient(0, 0, 0, 400);
  grad.addColorStop(0, "rgba(34,197,94,0.08)");
  grad.addColorStop(1, "rgba(34,197,94,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 400);

  // PawPath logo/brand
  ctx.textAlign = "center";
  ctx.font = "bold 32px 'DM Sans', sans-serif";
  ctx.fillStyle = COLORS.accent;
  ctx.fillText("\uD83D\uDC3E PawPath", W / 2, 80);

  // Month label
  ctx.font = "300 36px 'DM Sans', sans-serif";
  ctx.fillStyle = COLORS.textMuted;
  ctx.fillText(monthLabel, W / 2, 130);

  // Dog name + title
  ctx.font = "bold 72px 'Playfair Display', serif";
  ctx.fillStyle = COLORS.text;
  ctx.fillText(dogName || "My Dog", W / 2, 230);

  ctx.font = "600 36px 'DM Sans', sans-serif";
  ctx.fillStyle = COLORS.accent;
  ctx.fillText(labels.trainingReport || "Training Report", W / 2, 285);

  // Divider line
  const divY = 330;
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, divY);
  ctx.lineTo(W - 100, divY);
  ctx.stroke();

  // Stats grid — 2 columns, 3 rows
  const statItems = [
    { value: stats.sessions, label: labels.sessionsThisMonth || "Sessions", emoji: "\uD83C\uDFAF" },
    { value: stats.xp, label: labels.xpEarned || "XP Earned", emoji: "\u26A1" },
    { value: stats.newExercises, label: labels.exercisesLearned || "New Skills", emoji: "\uD83C\uDF1F" },
    { value: stats.bestStreak, label: labels.bestStreak || "Best Streak", emoji: "\uD83D\uDD25" },
    { value: stats.reviews, label: labels.reviewsDone || "Reviews", emoji: "\uD83D\uDD04" },
    { value: stats.avgRating, label: labels.avgRating || "Avg Rating", emoji: "\u2B50" },
  ];

  const boxW = 440;
  const boxH = 200;
  const gapX = 40;
  const gapY = 30;
  const startX = (W - boxW * 2 - gapX) / 2;
  const startY = 380;

  statItems.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = startX + col * (boxW + gapX);
    const y = startY + row * (boxH + gapY);
    drawStatBox(ctx, x, y, boxW, boxH, item.value, item.label, item.emoji);
  });

  // Bottom motivational area
  const bottomY = startY + 3 * (boxH + gapY) + 20;

  // Progress bar
  const barX = 100;
  const barW = W - 200;
  const barH = 16;
  roundRect(ctx, barX, bottomY, barW, barH, 8);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fill();

  const pct = Math.min(stats.sessions / 30, 1); // Cap at 30 sessions/month
  if (pct > 0) {
    roundRect(ctx, barX, bottomY, barW * pct, barH, 8);
    const barGrad = ctx.createLinearGradient(barX, 0, barX + barW * pct, 0);
    barGrad.addColorStop(0, "#22C55E");
    barGrad.addColorStop(1, "#4ADE80");
    ctx.fillStyle = barGrad;
    ctx.fill();
  }

  ctx.font = "500 28px 'DM Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.textMuted;
  ctx.fillText(`${stats.sessions} ${labels.sessionsThisMonth || "sessions"} ${labels.monthlyProgress || "this month"}`, W / 2, bottomY + 60);

  // Footer branding
  ctx.font = "400 24px 'DM Sans', sans-serif";
  ctx.fillStyle = COLORS.textDim;
  ctx.fillText("pawpath.app \u00B7 Train smarter \u00B7 Bond deeper", W / 2, H - 50);

  return canvas.toDataURL("image/png");
}

export async function shareCard(dataUrl, monthLabel) {
  // Convert data URL to blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], `pawpath-${monthLabel.replace(/\s+/g, "-").toLowerCase()}.png`, { type: "image/png" });

  // Try Web Share API first
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: `PawPath - ${monthLabel}` });
      return true;
    } catch (e) {
      if (e.name === "AbortError") return false;
    }
  }

  // Fallback: download
  downloadCard(dataUrl, monthLabel);
  return true;
}

export function downloadCard(dataUrl, monthLabel) {
  const link = document.createElement("a");
  link.download = `pawpath-${monthLabel.replace(/\s+/g, "-").toLowerCase()}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
