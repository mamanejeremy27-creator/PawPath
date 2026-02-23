import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { DOG_BREEDS } from "../data/breeds.js";
import { matchBreed } from "../data/breedTraits.js";
import { MeshBackground } from "./ui/MeshBackground";
import { cn } from "../lib/cn";

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

  const sectionLabel = (text) => (
    <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{text}</div>
  );
  const ready = form.name && form.breed && form.age;

  return (
    <div className="relative min-h-screen bg-bg">
      <MeshBackground />
      <div className="relative z-10 min-h-screen px-6 pt-12 pb-10 [animation:fadeIn_0.4s_ease]">
        <p className="text-[13px] text-training font-bold tracking-[3px] uppercase mb-2">{T("step1")}</p>
        <h1 className="font-display text-[32px] font-extrabold text-text m-0">{T("aboutYourDog")}</h1>
        <p className="text-[15px] text-muted mt-2">{T("customizeJourney")}</p>
        <div className="mt-9 flex flex-col gap-5">
          <div>
            {sectionLabel(T("dogName"))}
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g., Luna"
              className="bg-surface-2 border border-border-2 rounded-2xl px-4 py-4 w-full text-text text-base outline-none focus:border-training/50 transition-colors"
            />
          </div>
          <div className="relative">
            {sectionLabel(T("breed"))}
            <input
              value={form.breed}
              onChange={e => handleBreedInput(e.target.value)}
              onFocus={() => form.breed && setShowBreeds(true)}
              placeholder={T("breedPlaceholder")}
              className={cn(
                "bg-surface-2 border rounded-2xl px-4 py-4 w-full text-text text-base outline-none transition-colors",
                showBreeds ? "border-training" : "border-border-2"
              )}
            />
            {showBreeds && breedSug.length > 0 && (
              <div className="absolute top-full start-0 end-0 bg-surface-2 border border-border-2 rounded-2xl mt-1 z-50 max-h-[220px] overflow-y-auto shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                {breedSug.map(b => {
                  const hasProfile = !!matchBreed(b);
                  return (
                    <button
                      key={b}
                      onClick={() => { setForm(p => ({ ...p, breed: b })); setShowBreeds(false); }}
                      className={cn(
                        "block w-full px-5 py-3 text-[15px] bg-transparent border-none border-b border-border text-text cursor-pointer",
                        rtl ? "text-end" : "text-start"
                      )}
                    >
                      {hasProfile ? "🐶 " : b.toLowerCase().includes("mix") ? "🐕‍🦺 " : ""}{b}
                    </button>
                  );
                })}
              </div>
            )}
            {form.breed && !showBreeds && matchBreed(form.breed) && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-training" />
                <span className="text-[12px] text-training font-semibold">{T("breedProfileAvailable")}</span>
              </div>
            )}
          </div>
          <div>
            {sectionLabel(T("age"))}
            <select
              value={form.age}
              onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
              className={cn(
                "bg-surface-2 border border-border-2 rounded-2xl px-4 py-4 w-full text-base outline-none appearance-none",
                form.age ? "text-text" : "text-muted"
              )}
            >
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
            <p className="text-[13px] text-muted -mt-1 mb-2.5">{T("whenBorn").replace("{name}", form.name || T("dogName"))}</p>
            <input
              type="date"
              value={form.birthday}
              onChange={e => setForm(p => ({ ...p, birthday: e.target.value }))}
              max={new Date().toISOString().split("T")[0]}
              className={cn(
                "bg-surface-2 border border-border-2 rounded-2xl px-4 py-4 w-full text-base outline-none [color-scheme:dark]",
                form.birthday ? "text-text" : "text-muted"
              )}
            />
          </div>
          <button
            disabled={!ready}
            onClick={() => { setDogProfile(form); setScreen("home"); }}
            className={cn(
              "mt-3 py-[18px] text-base font-bold rounded-full border-none cursor-pointer transition-all",
              ready
                ? "bg-training text-black shadow-[0_8px_32px_rgba(34,197,94,0.25)]"
                : "bg-surface-2 text-muted cursor-default"
            )}
          >
            {T("beginTraining")}
          </button>
        </div>
      </div>
    </div>
  );
}
