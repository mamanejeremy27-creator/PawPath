import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { saveMedication, getMedications, deleteMedication } from "../lib/healthTracker.js";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };
const LS_KEY = "pawpath_medications";

const FREQ_OPTIONS = [
  { value: "daily", labelKey: "healthFreqDaily" },
  { value: "twice_daily", labelKey: "healthFreqTwiceDaily" },
  { value: "weekly", labelKey: "healthFreqWeekly" },
  { value: "as_needed", labelKey: "healthFreqAsNeeded" },
];

export default function MedicationTracker() {
  const { nav, T, lang, isAuthenticated, activeDogId } = useApp();
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "daily", start_date: new Date().toISOString().split("T")[0], end_date: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      let data = [];
      if (isAuthenticated) {
        const res = await getMedications(activeDogId);
        if (!res.error && res.data) data = res.data;
      }
      try {
        const local = JSON.parse(localStorage.getItem(LS_KEY) || "[]").filter(x => x.dogId === activeDogId);
        const ids = new Set(data.map(x => x.id));
        for (const x of local) if (!ids.has(x.id)) data.push(x);
      } catch { /* silent */ }
      data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      if (!cancelled) { setMeds(data); setLoading(false); }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, activeDogId]);

  const now = new Date();
  const active = meds.filter(m => !m.end_date || new Date(m.end_date) >= now);
  const completed = meds.filter(m => m.end_date && new Date(m.end_date) < now);

  const handleAdd = async () => {
    if (!form.name || !form.start_date) return;
    setSaving(true);

    const entry = { name: form.name, dosage: form.dosage, frequency: form.frequency, start_date: form.start_date, end_date: form.end_date || null, notes: form.notes };
    let saved = null;

    if (isAuthenticated) {
      const res = await saveMedication(activeDogId, entry);
      if (!res.error) saved = res.data;
    }

    if (!saved) {
      saved = { id: `local_${Date.now()}`, ...entry, dogId: activeDogId, created_at: new Date().toISOString() };
      try {
        const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
        all.push(saved);
        localStorage.setItem(LS_KEY, JSON.stringify(all));
      } catch { /* silent */ }
    }

    setMeds(prev => [saved, ...prev]);
    setForm({ name: "", dosage: "", frequency: "daily", start_date: new Date().toISOString().split("T")[0], end_date: "", notes: "" });
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (isAuthenticated && !String(id).startsWith("local_")) {
      await deleteMedication(id);
    }
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      localStorage.setItem(LS_KEY, JSON.stringify(all.filter(x => x.id !== id)));
    } catch { /* silent */ }
    setMeds(prev => prev.filter(m => m.id !== id));
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric" }) : "";
  const freqLabel = (freq) => {
    const opt = FREQ_OPTIONS.find(o => o.value === freq);
    return opt ? T(opt.labelKey) : freq || "";
  };

  const MedCard = ({ m, i }) => {
    const isActive = !m.end_date || new Date(m.end_date) >= now;
    return (
      <div key={m.id || i} style={{ padding: "14px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: isActive ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${isActive ? "rgba(139,92,246,0.15)" : C.b1}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>💊</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{m.name}</span>
            <span style={{ padding: "2px 10px", borderRadius: 10, background: isActive ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)", color: isActive ? C.acc : C.t3, fontSize: 11, fontWeight: 700 }}>
              {isActive ? T("healthActive") : T("healthCompleted")}
            </span>
          </div>
          <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>
            {m.dosage && <span>{m.dosage} · </span>}
            {freqLabel(m.frequency)}
          </div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
            {formatDate(m.start_date)}{m.end_date ? ` — ${formatDate(m.end_date)}` : ""}
          </div>
          {m.notes && <div style={{ fontSize: 12, color: C.t2, marginTop: 4 }}>{m.notes}</div>}
        </div>
        <button onClick={() => handleDelete(m.id)} style={{ background: "none", border: "none", color: C.t3, cursor: "pointer", fontSize: 16, padding: 4 }}>✕</button>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => nav("healthDashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.t3, padding: 4 }}>
            {"\u2190"}
          </button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 2px", color: C.t1 }}>{T("healthMedications")}</h1>
            <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{meds.length} {lang === "he" ? "תרופות" : "medications"}</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          padding: "10px 18px", borderRadius: 50,
          background: C.acc, color: "#000", border: "none",
          fontWeight: 800, fontSize: 13, cursor: "pointer",
        }}>+ {T("healthAddMedication")}</button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        </div>
      )}

      {/* Empty */}
      {!loading && meds.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💊</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{T("healthNoMedications")}</div>
        </div>
      )}

      {/* Active Medications */}
      {!loading && active.length > 0 && (
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>{T("healthActiveMeds")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {active.map((m, i) => <MedCard key={m.id || i} m={m} i={i} />)}
          </div>
        </div>
      )}

      {/* Completed Medications */}
      {!loading && completed.length > 0 && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>{T("healthCompletedMeds")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {completed.map((m, i) => <MedCard key={m.id || i} m={m} i={i} />)}
          </div>
        </div>
      )}

      {/* Slide-up Form */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 480, background: C.s1, borderRadius: "24px 24px 0 0", padding: "28px 24px 36px", animation: "slideUp 0.3s ease", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, margin: 0, color: C.t1 }}>{T("healthAddMedication")}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: C.b1, border: "none", color: C.t3, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthMedName")}</div>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder={T("healthMedName")}
                style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthDosage")}</div>
                <input type="text" value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))}
                  placeholder={T("healthDosage")}
                  style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthFrequency")}</div>
                <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                  style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", boxSizing: "border-box", appearance: "none" }}>
                  {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{T(o.labelKey)}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthStartDate")}</div>
                <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                  style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthEndDate")}</div>
                <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                  style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthNotes")}</div>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder={T("healthNotesPlaceholder")} rows={2}
                style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", resize: "none", boxSizing: "border-box" }} />
            </div>

            <button onClick={handleAdd} disabled={saving || !form.name}
              style={{ width: "100%", padding: "18px", fontSize: 16, fontWeight: 800, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", opacity: saving || !form.name ? 0.5 : 1 }}>
              {saving ? T("saving") : T("healthSave")}
            </button>
          </div>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
