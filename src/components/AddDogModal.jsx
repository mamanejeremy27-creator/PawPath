import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { DOG_BREEDS } from "../data/breeds.js";

const C = { bg: "#0A0A0C", s1: "#131316", s2: "#1A1A1F", b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)", t1: "#F5F5F7", t3: "#71717A", t4: "#52525B", acc: "#22C55E", r: 16 };

export default function AddDogModal() {
  const { showAddDog, setShowAddDog, addDog, dogCount, T, rtl } = useApp();
  const [form, setForm] = useState({ name: "", breed: "", age: "", birthday: "" });
  const [breedSug, setBreedSug] = useState([]);
  const [showBreeds, setShowBreeds] = useState(false);

  if (!showAddDog) return null;
  if (dogCount >= 2) return null;

  const handleBreedInput = (val) => {
    setForm(p => ({ ...p, breed: val }));
    if (val.length >= 1) {
      const l = val.toLowerCase();
      setBreedSug(DOG_BREEDS.filter(b => b.toLowerCase().includes(l)).slice(0, 8));
      setShowBreeds(true);
    } else { setBreedSug([]); setShowBreeds(false); }
  };

  const handleAdd = () => {
    if (!form.name || !form.breed || !form.age) return;
    addDog(form);
    setForm({ name: "", breed: "", age: "", birthday: "" });
  };

  const handleClose = () => {
    setShowAddDog(false);
    setForm({ name: "", breed: "", age: "", birthday: "" });
    setBreedSug([]);
    setShowBreeds(false);
  };

  const ready = form.name && form.breed && form.age;
  const sectionLabel = (text) => <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{text}</div>;

  return (
    <div onClick={handleClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.3s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.s1, borderRadius: 28, padding: "32px 24px", maxWidth: 380, width: "90%", maxHeight: "90vh", overflowY: "auto", border: `1px solid ${C.b1}` }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: C.t1 }}>{T("addDog")}</h2>
        <p style={{ fontSize: 13, color: C.t3, margin: "0 0 24px" }}>{T("addSecondDog")}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name */}
          <div>
            {sectionLabel(T("dogName"))}
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Max" style={{ width: "100%", padding: "14px 16px", fontSize: 15, background: C.bg, border: `1px solid ${C.b2}`, borderRadius: C.r, color: C.t1, outline: "none" }} />
          </div>

          {/* Breed */}
          <div style={{ position: "relative" }}>
            {sectionLabel(T("breed"))}
            <input value={form.breed} onChange={e => handleBreedInput(e.target.value)} onFocus={() => form.breed && setShowBreeds(true)} placeholder={T("breedPlaceholder")} style={{ width: "100%", padding: "14px 16px", fontSize: 15, background: C.bg, border: `1px solid ${showBreeds ? C.acc : C.b2}`, borderRadius: C.r, color: C.t1, outline: "none", transition: "border 0.2s" }} />
            {showBreeds && breedSug.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.s2, border: `1px solid ${C.b2}`, borderRadius: C.r, marginTop: 4, zIndex: 50, maxHeight: 180, overflowY: "auto", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
                {breedSug.map(b => (
                  <button key={b} onClick={() => { setForm(p => ({ ...p, breed: b })); setShowBreeds(false); }} style={{ display: "block", width: "100%", padding: "12px 16px", fontSize: 14, background: "none", border: "none", borderBottom: `1px solid ${C.b1}`, color: C.t1, textAlign: rtl ? "right" : "left", cursor: "pointer" }}>
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Age */}
          <div>
            {sectionLabel(T("age"))}
            <select value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} style={{ width: "100%", padding: "14px 16px", fontSize: 15, background: C.bg, border: `1px solid ${C.b2}`, borderRadius: C.r, color: form.age ? C.t1 : C.t4, outline: "none", appearance: "none" }}>
              <option value="">{T("selectAge")}</option>
              <option value="Puppy (under 6mo)">{T("agePuppy")}</option>
              <option value="Young (6\u201312mo)">{T("ageYoung")}</option>
              <option value="Adolescent (1\u20132yr)">{T("ageAdolescent")}</option>
              <option value="Adult (2\u20137yr)">{T("ageAdult")}</option>
              <option value="Senior (7+yr)">{T("ageSenior")}</option>
            </select>
          </div>

          {/* Birthday (optional) */}
          <div>
            {sectionLabel(`${T("birthday")} (${T("optional")})`)}
            <input type="date" value={form.birthday} onChange={e => setForm(p => ({ ...p, birthday: e.target.value }))} max={new Date().toISOString().split("T")[0]} style={{ width: "100%", padding: "14px 16px", fontSize: 15, background: C.bg, border: `1px solid ${C.b2}`, borderRadius: C.r, color: form.birthday ? C.t1 : C.t4, outline: "none", colorScheme: "dark" }} />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={handleClose} style={{ flex: 1, padding: "14px", fontSize: 14, fontWeight: 600, background: "transparent", color: C.t3, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
              {T("back")}
            </button>
            <button disabled={!ready} onClick={handleAdd} style={{ flex: 2, padding: "14px", fontSize: 14, fontWeight: 700, background: ready ? C.acc : C.s2, color: ready ? "#000" : C.t3, border: "none", borderRadius: 50, cursor: ready ? "pointer" : "default" }}>
              {T("addDog")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
