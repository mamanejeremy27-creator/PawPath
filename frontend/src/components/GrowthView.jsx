import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import PhotoImg from "./PhotoImg.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", rL: 24 };

export default function GrowthView() {
  const { journal, lang, T } = useApp();

  const monthlyPhotos = useMemo(() => {
    const byMonth = {};
    // Walk journal in order to get first photo per month
    for (const entry of journal) {
      if (!entry.photos || entry.photos.length === 0) continue;
      const d = new Date(entry.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!byMonth[key]) {
        byMonth[key] = {
          key,
          photo: entry.photos[0],
          label: d.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", year: "numeric" }),
          exerciseName: entry.exerciseName,
          programEmoji: entry.programEmoji,
        };
      }
    }
    return Object.values(byMonth).sort((a, b) => a.key.localeCompare(b.key));
  }, [journal, lang]);

  if (monthlyPhotos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 40px", color: C.t3 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
        <p style={{ fontSize: 15, lineHeight: 1.6 }}>{T("noEntries")}</p>
      </div>
    );
  }

  // Then vs Now comparison
  const first = monthlyPhotos[0];
  const last = monthlyPhotos[monthlyPhotos.length - 1];
  const showComparison = monthlyPhotos.length >= 2;

  return (
    <div style={{ padding: "0 20px" }}>
      {/* Then vs Now */}
      {showComparison && (
        <div style={{ marginBottom: 24, padding: "18px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.acc, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>{T("thenVsNow")}</div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <PhotoImg src={first.photo} style={{ width: "100%", aspectRatio: "1", borderRadius: 14, objectFit: "cover" }} />
              <div style={{ fontSize: 11, color: C.t3, marginTop: 6, fontWeight: 600 }}>{first.label}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: C.t3, fontSize: 20 }}>→</div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <PhotoImg src={last.photo} style={{ width: "100%", aspectRatio: "1", borderRadius: 14, objectFit: "cover" }} />
              <div style={{ fontSize: 11, color: C.t3, marginTop: 6, fontWeight: 600 }}>{last.label}</div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {monthlyPhotos.map(m => (
          <div key={m.key} style={{ background: C.s1, borderRadius: 14, border: `1px solid ${C.b1}`, overflow: "hidden" }}>
            <PhotoImg src={m.photo} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
            <div style={{ padding: "8px 10px" }}>
              <div style={{ fontSize: 10, color: C.t3, fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: C.t2, marginTop: 2 }}>{m.programEmoji} {m.exerciseName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
