import { useApp } from "../context/AppContext.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", r: 16 };
const sectionLabel = (text) => <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{text}</div>;

export default function JournalModal() {
  const { showJournalEntry, journalForm, setJournalForm, finalizeComplete, T } = useApp();
  if (!showJournalEntry) return null;

  const moods = [
    { id: "struggling", emoji: "😟", label: T("moodStruggling") },
    { id: "okay", emoji: "😐", label: T("moodOkay") },
    { id: "happy", emoji: "🙂", label: T("moodGood") },
    { id: "great", emoji: "😊", label: T("moodGreat") },
    { id: "amazing", emoji: "🤩", label: T("moodAmazing") },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 480, background: C.s1, borderRadius: "24px 24px 0 0", padding: "28px 24px 36px", animation: "slideUp 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, margin: 0, color: C.t1 }}>{T("sessionNotes")}</h3>
          <button onClick={() => finalizeComplete(true)} style={{ background: C.b1, border: "none", color: C.t3, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {sectionLabel(T("howDidItGo"))}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setJournalForm(f => ({ ...f, rating: n }))}
              style={{ flex: 1, padding: "10px 0", background: journalForm.rating >= n ? "rgba(34,197,94,0.12)" : C.b1, border: `1px solid ${journalForm.rating >= n ? "rgba(34,197,94,0.3)" : "transparent"}`, borderRadius: 10, cursor: "pointer", fontSize: 20, transition: "all 0.15s" }}>
              {n <= journalForm.rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>

        {sectionLabel(T("dogMood"))}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {moods.map(m => (
            <button key={m.id} onClick={() => setJournalForm(f => ({ ...f, mood: m.id }))}
              style={{ flex: 1, padding: "10px 4px", background: journalForm.mood === m.id ? "rgba(34,197,94,0.1)" : C.b1, border: `1px solid ${journalForm.mood === m.id ? "rgba(34,197,94,0.25)" : "transparent"}`, borderRadius: 10, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
              <div style={{ fontSize: 22 }}>{m.emoji}</div>
              <div style={{ fontSize: 10, color: C.t3, marginTop: 2, fontWeight: 600 }}>{m.label}</div>
            </button>
          ))}
        </div>

        {sectionLabel(T("notesOptional"))}
        <textarea value={journalForm.note} onChange={e => setJournalForm(f => ({ ...f, note: e.target.value }))}
          placeholder={T("notesPlaceholder")} rows={3}
          style={{ width: "100%", padding: "14px 16px", fontSize: 14, background: C.bg, border: `1px solid ${C.b2}`, borderRadius: C.r, color: C.t1, outline: "none", lineHeight: 1.6, resize: "none" }} />

        <button onClick={() => finalizeComplete(false)}
          style={{ width: "100%", padding: "18px", marginTop: 20, fontSize: 16, fontWeight: 800, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", boxShadow: "0 8px 32px rgba(34,197,94,0.25)" }}>
          {T("saveComplete")}
        </button>
      </div>
    </div>
  );
}
