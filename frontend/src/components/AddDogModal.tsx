import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { DOG_BREEDS } from "../data/breeds.js";
import { cn } from "../lib/cn";

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
  const sectionLabel = (text) => (
    <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{text}</div>
  );

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center [animation:fadeIn_0.3s_ease]"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-surface rounded-[28px] p-8 max-w-[380px] w-[90%] max-h-[90vh] overflow-y-auto border border-border"
      >
        <h2 className="font-display text-2xl font-extrabold mb-1 text-text">{T("addDog")}</h2>
        <p className="text-[13px] text-muted mb-6">{T("addSecondDog")}</p>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            {sectionLabel(T("dogName"))}
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g., Max"
              className="bg-bg border border-border-2 rounded-2xl px-4 py-3.5 w-full text-[15px] text-text outline-none focus:border-training/50 transition-colors"
            />
          </div>

          {/* Breed */}
          <div className="relative">
            {sectionLabel(T("breed"))}
            <input
              value={form.breed}
              onChange={e => handleBreedInput(e.target.value)}
              onFocus={() => form.breed && setShowBreeds(true)}
              placeholder={T("breedPlaceholder")}
              className={cn(
                "bg-bg border rounded-2xl px-4 py-3.5 w-full text-[15px] text-text outline-none transition-colors",
                showBreeds ? "border-training" : "border-border-2"
              )}
            />
            {showBreeds && breedSug.length > 0 && (
              <div className="absolute top-full start-0 end-0 bg-surface-2 border border-border-2 rounded-2xl mt-1 z-50 max-h-[180px] overflow-y-auto shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                {breedSug.map(b => (
                  <button
                    key={b}
                    onClick={() => { setForm(p => ({ ...p, breed: b })); setShowBreeds(false); }}
                    className={cn(
                      "block w-full px-4 py-3 text-[14px] bg-transparent border-none border-b border-border text-text cursor-pointer",
                      rtl ? "text-end" : "text-start"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Age */}
          <div>
            {sectionLabel(T("age"))}
            <select
              value={form.age}
              onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
              className={cn(
                "bg-bg border border-border-2 rounded-2xl px-4 py-3.5 w-full text-[15px] outline-none appearance-none",
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

          {/* Birthday (optional) */}
          <div>
            {sectionLabel(`${T("birthday")} (${T("optional")})`)}
            <input
              type="date"
              value={form.birthday}
              onChange={e => setForm(p => ({ ...p, birthday: e.target.value }))}
              max={new Date().toISOString().split("T")[0]}
              className={cn(
                "bg-bg border border-border-2 rounded-2xl px-4 py-3.5 w-full text-[15px] outline-none [color-scheme:dark]",
                form.birthday ? "text-text" : "text-muted"
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 mt-2">
            <button
              onClick={handleClose}
              className="flex-1 py-3.5 text-[14px] font-semibold bg-transparent text-muted border border-border rounded-full cursor-pointer"
            >
              {T("back")}
            </button>
            <button
              disabled={!ready}
              onClick={handleAdd}
              className={cn(
                "flex-[2] py-3.5 text-[14px] font-bold rounded-full border-none",
                ready ? "bg-training text-black cursor-pointer" : "bg-surface-2 text-muted cursor-default"
              )}
            >
              {T("addDog")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
