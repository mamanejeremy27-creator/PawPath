import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { DOG_BREEDS } from "../data/breeds.js";
import { matchBreed } from "../data/breedTraits.js";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)", t1: "#F5F5F7", t3: "#71717A", t4: "#52525B", s2: "#1A1A1F", acc: "#22C55E", r: 16 };

export default function Onboarding() {
  const { setDogProfile, setScreen, T, rtl } = useApp();
  const [form, setForm] = useState({ name: "", breed: "", age: "", birthday: "" });
  const [breedSug, setBreedSug] = useState([]);
  const [showBreeds, setShowBreeds] = useState(false);

  const handleBreedInput = (val) => {
    setForm(p => ({ ...p, breed: val }));
    if (val.length >= 1) {
      const l = val.toLowerCase();
      setBreedSug(DOG_BREEDS.filter(b => b.toLowerCase().includes(l)).slice(0, 8));
      setShowBreeds(true);
    } else { setBreedSug([]); setShowBreeds(false); }
  };

  const sectionLabel = (text) => <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{text}</div>;
  const ready = form.name && form.breed && form.age;

  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px 40px", background: C.bg, animation: "fadeIn 0.4s ease" }}>
      <p style={{ fontSize: 13, color: C.acc, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", margin: "0 0 8px" }}>{T("step1")}</p>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, margin: 0, color: C.t1 }}>{T("aboutYourDog")}</h1>
      <p style={{ fontSize: 15, color: C.t3, marginTop: 8 }}>{T("customizeJourney")}</p>
      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          {sectionLabel(T("dogName"))}
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Luna" style={{ width: "100%", padding: "16px 20px", fontSize: 16, background: C.s1, border: `1px solid ${C.b2}`, borderRadius: C.r, color: C.t1, outline: "none" }} />
        </div>
        <div style={{ position: "relative" }}>
          {sectionLabel(T("breed"))}
          <input value={form.breed} onChange={e => handleBreedInput(e.target.value)} onFocus={() => form.breed && setShowBreeds(true)} placeholder={T("breedPlaceholder")} style={{ width: "100%", padding: "16px 20px", fontSize: 16, background: C.s1, border: `1px solid ${showBreeds ? C.acc : C.b2}`, borderRadius: C.r, color: C.t1, outline: "none", transition: "border 0.2s" }} />
          {showBreeds && breedSug.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.s2, border: `1px solid ${C.b2}`, borderRadius: C.r, marginTop: 4, zIndex: 50, maxHeight: 220, overflowY: "auto", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
              {breedSug.map(b => {
                const hasProfile = !!matchBreed(b);
                return (
                  <button key={b} onClick={() => { setForm(p => ({ ...p, breed: b })); setShowBreeds(false); }} style={{ display: "block", width: "100%", padding: "13px 20px", fontSize: 15, background: "none", border: "none", borderBottom: `1px solid ${C.b1}`, color: C.t1, textAlign: rtl ? "right" : "left", cursor: "pointer" }}>
                    {hasProfile ? "\uD83D\uDC36 " : b.toLowerCase().includes("mix") ? "\uD83D\uDC15\u200D\uD83E\uDDBA " : ""}{b}
                  </button>
                );
              })}
            </div>
          )}
          {form.breed && !showBreeds && matchBreed(form.breed) && (
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.acc }} />
              <span style={{ fontSize: 12, color: C.acc, fontWeight: 600 }}>{T("breedProfileAvailable")}</span>
            </div>
          )}
        </div>
        <div>
          {sectionLabel(T("age"))}
          <select value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} style={{ width: "100%", padding: "16px 20px", fontSize: 16, background: C.s1, border: `1px solid ${C.b2}`, borderRadius: C.r, color: form.age ? C.t1 : C.t4, outline: "none", appearance: "none" }}>
            <option value="">{T("selectAge")}</option>
            <option value="Puppy (under 6mo)">{T("agePuppy")}</option>
            <option value="Young (6-12mo)">{T("ageYoung")}</option>
            <option value="Adolescent (1-2yr)">{T("ageAdolescent")}</option>
            <option value="Adult (2-7yr)">{T("ageAdult")}</option>
            <option value="Senior (7+yr)">{T("ageSenior")}</option>
          </select>
        </div>
        <div>
          {sectionLabel(`${T("birthday")} (${T("optional")})`)}
          <p style={{ fontSize: 13, color: C.t3, margin: "-4px 0 10px" }}>{T("whenBorn").replace("{name}", form.name || T("dogName"))}</p>
          <input type="date" value={form.birthday} onChange={e => setForm(p => ({ ...p, birthday: e.target.value }))} max={new Date().toISOString().split("T")[0]} style={{ width: "100%", padding: "16px 20px", fontSize: 16, background: C.s1, border: `1px solid ${C.b2}`, borderRadius: C.r, color: form.birthday ? C.t1 : C.t4, outline: "none", colorScheme: "dark" }} />
        </div>
        <button disabled={!ready} onClick={() => { setDogProfile(form); setScreen("home"); }}
          style={{ marginTop: 12, padding: "18px", fontSize: 16, fontWeight: 700, background: ready ? C.acc : C.s2, color: ready ? "#000" : C.t3, border: "none", borderRadius: 50, cursor: ready ? "pointer" : "default", boxShadow: ready ? "0 8px 32px rgba(34,197,94,0.25)" : "none" }}>
          {T("beginTraining")}
        </button>
      </div>
    </div>
  );
}
