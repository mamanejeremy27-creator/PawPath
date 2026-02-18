import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };
const LS_KEY = "pawpath_vaccinations";

const COMMON_VACCINES = [
  { id: "rabies", name: { en: "Rabies", he: "כלבת" } },
  { id: "dhpp", name: { en: "DHPP", he: "DHPP" } },
  { id: "bordetella", name: { en: "Bordetella", he: "בורדטלה" } },
  { id: "leptospirosis", name: { en: "Leptospirosis", he: "לפטוספירוזיס" } },
  { id: "lyme", name: { en: "Lyme", he: "ליים" } },
  { id: "canine_influenza", name: { en: "Canine Influenza", he: "שפעת כלבים" } },
];

function vaccineStatus(nextDue) {
  if (!nextDue) return { key: "recorded", color: C.t3, bg: "rgba(255,255,255,0.05)" };
  const diff = (new Date(nextDue) - new Date()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return { key: "overdue", color: "#EF4444", bg: "rgba(239,68,68,0.1)" };
  if (diff <= 30) return { key: "dueSoon", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
  return { key: "upToDate", color: "#22C55E", bg: "rgba(34,197,94,0.1)" };
}

const statusLabel = (T, key) => {
  const map = { recorded: "healthRecorded", overdue: "healthOverdue", dueSoon: "healthDueSoon", upToDate: "healthUpToDate" };
  return T(map[key] || key);
};

export default function VaccinationTracker() {
  const { nav, T, lang, isAuthenticated, activeDogId } = useApp();
  const [vacc, setVacc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vaccine_name: "", date_given: new Date().toISOString().split("T")[0], next_due: "", vet_name: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      let data = [];
      if (isAuthenticated) {
        try {
          data = await api.getVaccinations(activeDogId) || [];
        } catch { /* silent */ }
      }
      try {
        const local = JSON.parse(localStorage.getItem(LS_KEY) || "[]").filter(x => x.dogId === activeDogId);
        const ids = new Set(data.map(x => x.id));
        for (const x of local) if (!ids.has(x.id)) data.push(x);
      } catch { /* silent */ }
      data.sort((a, b) => new Date(b.date_given) - new Date(a.date_given));
      if (!cancelled) { setVacc(data); setLoading(false); }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, activeDogId]);

  const handleAdd = async () => {
    if (!form.vaccine_name || !form.date_given) return;
    setSaving(true);

    const entry = { vaccine_name: form.vaccine_name, date_given: form.date_given, next_due: form.next_due || null, vet_name: form.vet_name || null, notes: form.notes || null };
    let saved = null;

    if (isAuthenticated) {
      try {
        saved = await api.addVaccination(activeDogId, entry);
      } catch { /* silent */ }
    }

    if (!saved) {
      saved = { id: `local_${Date.now()}`, ...entry, dogId: activeDogId, created_at: new Date().toISOString() };
      try {
        const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
        all.push(saved);
        localStorage.setItem(LS_KEY, JSON.stringify(all));
      } catch { /* silent */ }
    }

    setVacc(prev => [saved, ...prev]);
    setForm({ vaccine_name: "", date_given: new Date().toISOString().split("T")[0], next_due: "", vet_name: "", notes: "" });
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (isAuthenticated && !String(id).startsWith("local_")) {
      try { await api.deleteVaccination(id); } catch { /* silent */ }
    }
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      localStorage.setItem(LS_KEY, JSON.stringify(all.filter(x => x.id !== id)));
    } catch { /* silent */ }
    setVacc(prev => prev.filter(v => v.id !== id));
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  // Status summary
  const counts = vacc.reduce((a, v) => {
    const s = vaccineStatus(v.next_due);
    a[s.key] = (a[s.key] || 0) + 1;
    return a;
  }, {});

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => nav("healthDashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.t3, padding: 4 }}>
            {"\u2190"}
          </button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 2px", color: C.t1 }}>{T("healthVaccinations")}</h1>
            <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{vacc.length} {lang === "he" ? "רשומות" : "records"}</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          padding: "10px 18px", borderRadius: 50,
          background: C.acc, color: "#000", border: "none",
          fontWeight: 800, fontSize: 13, cursor: "pointer",
        }}>+ {T("healthAddVaccination")}</button>
      </div>

      {/* Status Summary */}
      {vacc.length > 0 && (
        <div style={{ display: "flex", gap: 8, padding: "16px 20px 0", flexWrap: "wrap" }}>
          {counts.upToDate > 0 && <div style={{ padding: "8px 14px", borderRadius: 20, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.acc }}>{counts.upToDate}</span>
            <span style={{ fontSize: 12, color: C.acc, fontWeight: 600, marginLeft: 6 }}>{T("healthUpToDate")}</span>
          </div>}
          {counts.dueSoon > 0 && <div style={{ padding: "8px 14px", borderRadius: 20, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B" }}>{counts.dueSoon}</span>
            <span style={{ fontSize: 12, color: "#F59E0B", fontWeight: 600, marginLeft: 6 }}>{T("healthDueSoon")}</span>
          </div>}
          {counts.overdue > 0 && <div style={{ padding: "8px 14px", borderRadius: 20, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#EF4444" }}>{counts.overdue}</span>
            <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 600, marginLeft: 6 }}>{T("healthOverdue")}</span>
          </div>}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        </div>
      )}

      {/* Empty */}
      {!loading && vacc.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💉</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{T("healthNoVaccinations")}</div>
        </div>
      )}

      {/* Vaccine List */}
      {!loading && vacc.length > 0 && (
        <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          {vacc.map((v, i) => {
            const st = vaccineStatus(v.next_due);
            return (
              <div key={v.id || i} style={{ padding: "14px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{v.vaccine_name}</span>
                      <span style={{ padding: "2px 10px", borderRadius: 10, background: st.bg, color: st.color, fontSize: 11, fontWeight: 700 }}>{statusLabel(T, st.key)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.t3, marginTop: 4 }}>
                      {T("healthDateGiven")}: {formatDate(v.date_given)}
                      {v.next_due && <span> · {T("healthNextDue")}: {formatDate(v.next_due)}</span>}
                    </div>
                    {v.vet_name && <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{T("healthVetName")}: {v.vet_name}</div>}
                    {v.notes && <div style={{ fontSize: 12, color: C.t2, marginTop: 2 }}>{v.notes}</div>}
                  </div>
                  <button onClick={() => handleDelete(v.id)} style={{ background: "none", border: "none", color: C.t3, cursor: "pointer", fontSize: 16, padding: 4 }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-up Form */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 480, background: C.s1, borderRadius: "24px 24px 0 0", padding: "28px 24px 36px", animation: "slideUp 0.3s ease", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, margin: 0, color: C.t1 }}>{T("healthAddVaccination")}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: C.b1, border: "none", color: C.t3, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthVaccineName")}</div>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <input
                type="text" value={form.vaccine_name}
                onChange={e => { setForm(f => ({ ...f, vaccine_name: e.target.value })); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={T("healthVaccineName")}
                style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", boxSizing: "border-box" }}
              />
              {showSuggestions && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, background: C.s1, border: `1px solid ${C.b1}`, borderRadius: C.r, marginTop: 4, overflow: "hidden" }}>
                  {COMMON_VACCINES.filter(v => !form.vaccine_name || v.name[lang === "he" ? "he" : "en"].toLowerCase().includes(form.vaccine_name.toLowerCase())).map(v => (
                    <button key={v.id} onClick={() => { setForm(f => ({ ...f, vaccine_name: v.name[lang === "he" ? "he" : "en"] })); setShowSuggestions(false); }}
                      style={{ width: "100%", padding: "10px 14px", background: "transparent", border: "none", borderBottom: `1px solid ${C.b1}`, color: C.t1, fontSize: 14, cursor: "pointer", textAlign: "start" }}>
                      {v.name[lang === "he" ? "he" : "en"]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthDateGiven")}</div>
                <input type="date" value={form.date_given} onChange={e => setForm(f => ({ ...f, date_given: e.target.value }))}
                  style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthNextDue")}</div>
                <input type="date" value={form.next_due} onChange={e => setForm(f => ({ ...f, next_due: e.target.value }))}
                  style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthVetName")}</div>
            <input type="text" value={form.vet_name} onChange={e => setForm(f => ({ ...f, vet_name: e.target.value }))}
              placeholder={T("healthVetName")}
              style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", marginBottom: 14, boxSizing: "border-box" }} />

            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthNotes")}</div>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder={T("healthNotesPlaceholder")} rows={2}
              style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", resize: "none", marginBottom: 16, boxSizing: "border-box" }} />

            <button onClick={handleAdd} disabled={saving || !form.vaccine_name}
              style={{ width: "100%", padding: "18px", fontSize: 16, fontWeight: 800, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", opacity: saving || !form.vaccine_name ? 0.5 : 1 }}>
              {saving ? T("saving") : T("healthSave")}
            </button>
          </div>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
