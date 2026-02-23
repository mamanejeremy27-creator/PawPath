import { useState, useRef } from "react";
import { Camera, Pencil, Dog, Heart, AlertTriangle, Lock, CheckCircle2, Sparkles } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { CHALLENGES } from "../data/challenges.js";
import { DIAGNOSTIC_CATEGORIES } from "../data/diagnostic.js";
import { getDiagnosticHistory } from "./DiagnosticFlow.jsx";
import { matchBreed, getTraitLabels } from "../data/breedTraits.js";
import { DOG_BREEDS } from "../data/breeds.js";
import DogAvatar from "./DogAvatar.jsx";
import ThemeSelector from "./ThemeSelector.jsx";
import BottomNav from "./BottomNav.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import { api } from "../lib/api.js";
import NotificationPreferences from "./NotificationPreferences.jsx";
import { compressPhotoToBlob, compressPhoto } from "../utils/photoCompressor.js";
import { cn } from "../lib/cn";

export default function Profile() {
  const { dogProfile, setDogProfile, totalXP, currentStreak, completedExercises, completedLevels, earnedBadges, totalSessions, journal, playerLevel, resetAllData, T, badges, setShowFeedbackAdmin, dogs, activeDogId, switchDog, removeDog, dogCount, setShowAddDog, nav, challengeState, lang, appSettings, setAppSettings, toggleAccessory, AVATAR_ACCESSORIES, streakData, isAuthenticated, rtl } = useApp();
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const uniqueActiveDays = new Set(journal.map(e => new Date(e.date).toDateString())).size;
  const hasEnoughForRecap = uniqueActiveDays >= 30;
  const [tapCount, setTapCount] = useState(0);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const tapTimer = useRef(null);

  // Editable fields state
  const [editing, setEditing] = useState(null); // "name" | "breed" | "age" | "birthday" | null
  const [editName, setEditName] = useState("");
  const [editBreed, setEditBreed] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editBirthday, setEditBirthday] = useState("");
  const [breedSug, setBreedSug] = useState([]);
  const [showBreeds, setShowBreeds] = useState(false);
  const [toast, setToast] = useState(null);
  const photoRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const startEdit = (field) => {
    setEditing(field);
    setShowBreeds(false);
    if (field === "name") setEditName(dogProfile?.name || "");
    if (field === "breed") { setEditBreed(dogProfile?.breed || ""); setBreedSug([]); }
    if (field === "age") setEditAge(dogProfile?.age || "");
    if (field === "birthday") setEditBirthday(dogProfile?.birthday || "");
  };

  const saveField = (field, value) => {
    if (!value && field === "name") return;
    const updated = { ...dogProfile, [field]: value };
    setDogProfile(updated);
    setEditing(null);
    setShowBreeds(false);
    showToast(T("profileUpdated"));
  };

  const handleBreedInput = (val) => {
    setEditBreed(val);
    if (val.length >= 1) {
      const l = val.toLowerCase();
      setBreedSug(DOG_BREEDS.filter(b => b.toLowerCase().includes(l)).slice(0, 8));
      setShowBreeds(true);
    } else { setBreedSug([]); setShowBreeds(false); }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // Upload to backend
      const blob = await compressPhotoToBlob(file);
      const path = await api.uploadDogPhoto(activeDogId, blob);
      setDogProfile({ ...dogProfile, photo: path });
      showToast(T("profileUpdated"));
    } catch {
      // Fallback to base64 stored in profile
      try {
        const base64 = await compressPhoto(file);
        setDogProfile({ ...dogProfile, photo: base64 });
        showToast(T("profileUpdated"));
      } catch { /* silent fail */ }
    }
  };

  const handleVersionTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    clearTimeout(tapTimer.current);
    if (newCount >= 5) {
      setTapCount(0);
      setShowFeedbackAdmin(true);
    } else {
      tapTimer.current = setTimeout(() => setTapCount(0), 2000);
    }
  };

  const ageOptions = [
    { value: "Puppy (under 6mo)", label: T("agePuppy") },
    { value: "Young (6-12mo)", label: T("ageYoung") },
    { value: "Adolescent (1-2yr)", label: T("ageAdolescent") },
    { value: "Adult (2-7yr)", label: T("ageAdult") },
    { value: "Senior (7+yr)", label: T("ageSenior") },
  ];

  const pencil = (field) => (
    <button
      onClick={() => startEdit(field)}
      className="bg-transparent border-0 cursor-pointer p-1 text-muted opacity-70 inline-flex items-center"
    >
      <Pencil size={14} />
    </button>
  );

  const dogEntries = Object.entries(dogs);

  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] px-6 py-2.5 bg-training text-black text-sm font-bold rounded-full shadow-[0_4px_20px_rgba(34,197,94,0.4)] animate-[fadeIn_0.3s_ease]">
          {toast}
        </div>
      )}

      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />

      <div className="text-center px-5 pt-10 pb-6 relative">
        <div className="absolute top-5 end-5">
          <LanguageToggle />
        </div>

        {/* Tappable avatar for photo upload */}
        <div onClick={() => photoRef.current?.click()} className="cursor-pointer inline-block relative">
          <DogAvatar key={activeDogId} size="large" dogId={activeDogId} />
          <div className="absolute -bottom-0.5 -end-0.5 w-7 h-7 rounded-full bg-training flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.3)] text-black">
            <Camera size={14} />
          </div>
        </div>
        <div className="text-[11px] text-muted mt-1.5">{T("tapToChangePhoto")}</div>

        {/* Editable name */}
        {editing === "name" ? (
          <div className="mt-3 flex items-center justify-center gap-2">
            <input
              autoFocus
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveField("name", editName.trim())}
              className="text-[22px] font-black font-display bg-surface border border-training rounded-xl text-text px-3.5 py-2 text-center outline-none w-[200px]"
            />
            <button
              onClick={() => saveField("name", editName.trim())}
              className="px-4 py-2 bg-training text-black border-0 rounded-full text-[13px] font-bold cursor-pointer"
            >
              ✓
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-3 py-2 bg-transparent text-muted border border-border rounded-full text-[13px] cursor-pointer"
            >
              ✗
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <h2 className="font-display text-[28px] font-black m-0 text-text">{dogProfile?.name}</h2>
            {pencil("name")}
          </div>
        )}

        {/* Editable breed + age */}
        {editing === "breed" ? (
          <div className="mt-2 relative max-w-[280px] mx-auto">
            <input
              autoFocus
              value={editBreed}
              onChange={e => handleBreedInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveField("breed", editBreed.trim())}
              className="w-full text-sm bg-surface border border-training rounded-xl text-text px-3.5 py-2.5 text-center outline-none"
              placeholder={T("breedPlaceholder")}
            />
            {showBreeds && breedSug.length > 0 && (
              <div className="absolute top-full start-0 end-0 bg-surface-2 border border-border-2 rounded-2xl mt-1 z-50 max-h-[220px] overflow-y-auto shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                {breedSug.map(b => {
                  const hasProfile = !!matchBreed(b);
                  return (
                    <button
                      key={b}
                      onClick={() => { saveField("breed", b); }}
                      className="block w-full px-5 py-3.5 text-[15px] bg-transparent border-0 border-b border-border text-text text-start cursor-pointer"
                    >
                      {hasProfile ? <Dog size={14} className="inline align-middle me-1" /> : null}{b}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={() => saveField("breed", editBreed.trim())}
                className="px-4 py-1.5 bg-training text-black border-0 rounded-full text-xs font-bold cursor-pointer"
              >
                ✓
              </button>
              <button
                onClick={() => { setEditing(null); setShowBreeds(false); }}
                className="px-3 py-1.5 bg-transparent text-muted border border-border rounded-full text-xs cursor-pointer"
              >
                ✗
              </button>
            </div>
          </div>
        ) : editing === "age" ? (
          <div className="mt-2 flex items-center justify-center gap-2">
            <select
              autoFocus
              value={editAge}
              onChange={e => saveField("age", e.target.value)}
              className="text-sm bg-surface border border-training rounded-xl text-text px-3.5 py-2.5 outline-none appearance-none"
            >
              <option value="">{T("selectAge")}</option>
              {ageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              onClick={() => setEditing(null)}
              className="px-3 py-1.5 bg-transparent text-muted border border-border rounded-full text-xs cursor-pointer"
            >
              ✗
            </button>
          </div>
        ) : editing === "birthday" ? (
          <div className="mt-2 flex items-center justify-center gap-2">
            <input
              autoFocus
              type="date"
              value={editBirthday}
              onChange={e => saveField("birthday", e.target.value)}
              className="text-sm bg-surface border border-training rounded-xl text-text px-3.5 py-2.5 outline-none"
            />
            <button
              onClick={() => setEditing(null)}
              className="px-3 py-1.5 bg-transparent text-muted border border-border rounded-full text-xs cursor-pointer"
            >
              ✗
            </button>
          </div>
        ) : (
          <div className="mt-1 flex items-center justify-center gap-1 flex-wrap">
            <span className="text-sm text-muted">{dogProfile?.breed}</span>
            {pencil("breed")}
            <span className="text-sm text-muted"> · </span>
            <span className="text-sm text-muted">{dogProfile?.age}</span>
            {pencil("age")}
            {dogProfile?.birthday && (
              <>
                <span className="text-sm text-muted"> · </span>
                <span className="text-sm text-muted">{dogProfile.birthday}</span>
              </>
            )}
            {pencil("birthday")}
          </div>
        )}

        <div className="mt-3 inline-block px-[22px] py-2 bg-training/10 border border-training/20 rounded-full text-training text-sm font-bold">
          {T("level")} {playerLevel.level} — {playerLevel.title}
        </div>
      </div>

      <div className="px-5">
        {/* Stats */}
        {[
          [T("totalXP"), `${totalXP} ${T("xp")}`],
          [T("streak"), currentStreak + " " + T("dayStreak")],
          [T("exercises"), completedExercises.length],
          [T("levels"), completedLevels.length],
          [T("badges"), `${earnedBadges.length}/${badges.length}`],
          [T("sessions"), totalSessions],
          [T("journalEntries"), journal.length],
        ].map(([l, v], i) => (
          <div key={i} className="flex justify-between py-4 border-b border-border">
            <span className="text-[15px] text-muted">{l}</span>
            <span className="text-[15px] font-bold text-text">{v}</span>
          </div>
        ))}

        {/* Breed Profile */}
        {(() => {
          const breedData = matchBreed(dogProfile?.breed);
          if (!breedData) return null;
          const traitLabels = getTraitLabels(lang);
          const traitKeys = ["energy", "trainability", "stubbornness", "sociability", "preyDrive", "sensitivity", "barkTendency"];
          const sizeLabel = breedData.size === "small" ? T("sizeSmall") : breedData.size === "large" ? T("sizeLarge") : T("sizeMedium");
          const breedTipText = breedData.breedTips[lang] || breedData.breedTips.en;
          return (
            <div className="mt-8">
              <h3 className="text-base font-bold text-text m-0 mb-4">{T("breedProfile")}</h3>
              <div className="px-5 py-[18px] bg-surface rounded-2xl border border-border">
                <div className="flex items-center gap-2.5 mb-4">
                  <Dog size={22} className="text-training" />
                  <div className="flex-1">
                    <div className="text-[15px] font-bold text-text">{breedData.name[lang] || breedData.name.en}</div>
                  </div>
                  <span className="px-2.5 py-[3px] rounded-lg bg-border text-[11px] font-semibold text-muted">{sizeLabel}</span>
                </div>
                {traitKeys.map(key => (
                  <div key={key} className="flex items-center gap-2.5 mb-2">
                    <span className="text-xs text-muted w-[90px] flex-shrink-0 text-start">{traitLabels[key]}</span>
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div
                          key={n}
                          className="flex-1 h-1.5 rounded-[3px] transition-[background] duration-300"
                          style={{ background: n <= breedData.traits[key] ? "#22C55E" : "rgba(255,255,255,0.06)" }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted w-4 text-center">{breedData.traits[key]}</span>
                  </div>
                ))}
                <div className="mt-3.5 px-3.5 py-3 bg-training/[0.04] rounded-xl border border-training/[0.08]">
                  <div className="text-[11px] font-bold text-training uppercase tracking-[1px] mb-1.5">{T("breedTips")}</div>
                  <p className="text-[13px] text-muted m-0 leading-relaxed">{breedTipText}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {breedData.priorityPrograms.map(pid => (
                    <span key={pid} className="px-2.5 py-[3px] rounded-lg bg-training/[0.08] border border-training/15 text-[11px] font-semibold text-training">{pid}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* My Dogs section */}
        <div className="mt-8">
          <h3 className="text-base font-bold text-text m-0 mb-4">{T("myDogs")}</h3>
          <div className="flex flex-col gap-2.5">
            {dogEntries.map(([id, dog]) => {
              const d = dog as any;
              const isActive = id === activeDogId;
              return (
                <div
                  key={id}
                  className={cn(
                    "px-[18px] py-4 bg-surface rounded-2xl border flex items-center gap-3",
                    isActive ? "border-training/30" : "border-border"
                  )}
                >
                  <div className="flex-shrink-0">
                    <DogAvatar size="small" photo={d.profile?.photo} dogId={id} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-text">{d.profile?.name}</div>
                    <div className="text-xs text-muted">
                      {d.profile?.breed}
                      {isActive && <span className="text-training ms-2 font-semibold">{T("activeDog")}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {!isActive && (
                      <button
                        onClick={() => switchDog(id)}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-training/10 text-training border-0 rounded-full cursor-pointer"
                      >
                        {T("switchDog")}
                      </button>
                    )}
                    {isActive && (
                      <button
                        onClick={() => nav("reportLostDog")}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-danger/[0.08] text-danger border-0 rounded-full cursor-pointer inline-flex items-center gap-1"
                      >
                        <AlertTriangle size={12} /> {T("lostEmergency")}
                      </button>
                    )}
                    {dogCount > 1 && (
                      <button
                        onClick={() => setConfirmRemove(id)}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-danger/[0.08] text-danger border-0 rounded-full cursor-pointer"
                      >
                        {T("removeDog")}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {dogCount < 2 && (
              <button
                onClick={() => setShowAddDog(true)}
                className="py-4 bg-transparent border border-dashed border-muted rounded-2xl text-muted text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              >
                + {T("addDog")}
              </button>
            )}
          </div>
        </div>

        {/* Challenge History */}
        <div className="mt-8">
          <h3 className="text-base font-bold text-text m-0 mb-4">{T("challengeHistory")}</h3>
          {challengeState.history.length > 0 ? (
            <>
              <div className="flex gap-2.5 mb-3.5">
                {[
                  [challengeState.stats.totalCompleted, T("completed")],
                  [challengeState.stats.currentStreak, T("weeks")],
                  [challengeState.stats.bestStreak, T("challengeBestStreak")],
                ].map(([val, lbl], i) => (
                  <div key={i} className="flex-1 text-center py-3 px-1.5 bg-surface rounded-2xl border border-border">
                    <div className="text-xl font-black text-text">{val}</div>
                    <div className="text-[10px] text-muted uppercase tracking-[1px] font-semibold">{lbl}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                {challengeState.history.slice().reverse().map((h, i) => {
                  const chDef = CHALLENGES.find(c => c.id === h.challengeId);
                  return (
                    <div key={i} className="px-4 py-3 bg-surface rounded-2xl border border-border flex items-center gap-3">
                      <Icon name={(chDef?.icon || "Trophy") as any} size={20} className="text-text" />
                      <div className="flex-1">
                        <div className="text-[13px] font-bold text-text">{lang === "he" ? chDef?.nameHe : chDef?.name}</div>
                        <div className="text-[11px] text-muted mt-0.5">
                          {h.completedDays.length}/7 {T("challengeDay")}s · {h.fullComplete ? T("fullCompletion") : T("partialCompletion")} · +{h.xpEarned} XP
                        </div>
                      </div>
                      {h.fullComplete && <CheckCircle2 size={14} className="text-training" />}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-[13px] text-muted leading-relaxed">{T("noChallengesYet")}</p>
          )}
        </div>

        {/* Diagnostic History */}
        {(() => {
          const diagHistory = getDiagnosticHistory();
          if (diagHistory.length === 0) return null;
          return (
            <div className="mt-8">
              <h3 className="text-base font-bold text-text m-0 mb-4">{T("diagHistory")}</h3>
              <div className="flex flex-col gap-1.5">
                {diagHistory.slice(0, 10).map((h, i) => {
                  const cat = DIAGNOSTIC_CATEGORIES.find(c => c.id === h.categoryId);
                  if (!cat) return null;
                  return (
                    <div key={i} className="px-4 py-3 bg-surface rounded-2xl border border-border flex items-center gap-3">
                      <span className="text-xl">{(cat as any).emoji}</span>
                      <div className="flex-1">
                        <div className="text-[13px] font-bold text-text">{cat.name[lang] || cat.name.en}</div>
                        <div className="text-[11px] text-muted mt-0.5">
                          {new Date(h.date).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric" })}
                          {h.dogName ? ` · ${h.dogName}` : ""}
                          {` · ${h.exerciseCount} ${T("exercises")}`}
                        </div>
                      </div>
                      <button
                        onClick={() => nav("diagnostic")}
                        className="px-3 py-1 text-[11px] font-semibold bg-training/[0.08] text-training border-0 rounded-2xl cursor-pointer"
                      >
                        {T("diagRetake")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Vet & Health */}
        <div className="mt-8">
          <button
            onClick={() => nav("healthDashboard")}
            className="w-full px-5 py-4 bg-[linear-gradient(135deg,rgba(236,72,153,0.08),rgba(239,68,68,0.06))] border border-[rgba(236,72,153,0.2)] rounded-2xl cursor-pointer flex items-center gap-3.5 text-text text-start"
          >
            <Heart size={24} color="#EC4899" fill="#EC4899" />
            <div className="flex-1">
              <div className="text-sm font-bold text-text">{T("healthDashboard")}</div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: "#EC4899" }}>{T("healthDashboardSub")}</div>
            </div>
            <Icon name="ChevronRight" size={18} className="text-muted" />
          </button>
        </div>

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Avatar Accessories */}
        <div className="mt-8">
          <h3 className="text-base font-bold text-text m-0 mb-4">{T("accessories")}</h3>
          <div className="flex flex-col gap-2">
            {AVATAR_ACCESSORIES.map(acc => {
              const isUnlocked = appSettings.unlockedAccessories.includes(acc.id);
              const isActive = appSettings.activeAccessories.includes(acc.id);
              return (
                <div
                  key={acc.id}
                  className={cn(
                    "px-[18px] py-3.5 bg-surface rounded-2xl border flex items-center gap-3.5",
                    isActive ? "border-training/30" : "border-border",
                    !isUnlocked && "opacity-40"
                  )}
                >
                  <span className="text-[28px]">{acc.emoji}</span>
                  <div className="flex-1">
                    <div className={cn("text-sm font-bold", isUnlocked ? "text-text" : "text-muted")}>
                      {lang === "he" ? (acc.nameHe || acc.name) : acc.name}
                    </div>
                    {!isUnlocked && (
                      <div className="text-[11px] text-muted mt-0.5">
                        {T("unlockAtStreak").replace("{days}", acc.unlockedAt)}
                      </div>
                    )}
                  </div>
                  {isUnlocked && (
                    <button
                      onClick={() => toggleAccessory(acc.id)}
                      className={cn(
                        "px-4 py-1.5 text-xs font-semibold border rounded-full cursor-pointer",
                        isActive
                          ? "bg-training/10 text-training border-training/20"
                          : "bg-transparent text-muted border-border"
                      )}
                    >
                      {isActive ? T("unequip") : T("equip")}
                    </button>
                  )}
                  {!isUnlocked && <Lock size={16} className="text-muted" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Opt-In */}
        <div className="mt-8">
          <h3 className="text-base font-bold text-text m-0 mb-4">{T("leaderboard")}</h3>
          <div className="px-[18px] py-4 bg-surface rounded-2xl border border-border flex items-center justify-between">
            <span className="text-sm text-text font-semibold">{T("lbOptIn")}</span>
            <button
              onClick={() => {
                const newVal = !(appSettings.leaderboardOptIn !== false);
                setAppSettings(prev => ({ ...prev, leaderboardOptIn: newVal }));
                if (isAuthenticated) {
                  api.updateSettings({ leaderboardOptIn: newVal }).catch(() => {});
                }
              }}
              className="w-11 h-6 rounded-full border-0 cursor-pointer relative transition-[background] duration-200"
              style={{ background: (appSettings.leaderboardOptIn !== false) ? "#22C55E" : "rgba(255,255,255,0.1)" }}
            >
              <div
                className="w-[18px] h-[18px] rounded-full bg-white absolute top-[3px] transition-[left] duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                style={{ left: (appSettings.leaderboardOptIn !== false) ? 23 : 3 }}
              />
            </button>
          </div>
        </div>

        {/* Smart Notifications */}
        <NotificationPreferences />

        <div className="mt-8">
          <button
            onClick={() => hasEnoughForRecap && nav("annualRecap")}
            className={cn(
              "w-full py-4 text-sm font-bold bg-[linear-gradient(135deg,rgba(34,197,94,0.1),rgba(139,92,246,0.08))] border border-training/20 rounded-2xl flex items-center justify-center gap-2",
              hasEnoughForRecap ? "text-training cursor-pointer opacity-100" : "text-muted cursor-default opacity-70"
            )}
          >
            <Sparkles size={16} /> {T("viewRecap")}
          </button>
          {!hasEnoughForRecap && (
            <p className="text-xs text-muted text-center mt-2 mb-0 leading-relaxed">{T("keepTrainingRecap")}</p>
          )}
        </div>

        <button
          onClick={async () => { setSigningOut(true); await signOut(); }}
          className="mt-4 w-full py-3.5 text-sm font-semibold bg-surface text-text border border-border rounded-2xl cursor-pointer flex items-center justify-center gap-2"
        >
          {signingOut ? T("signingOut") : T("signOut")}
        </button>

        <button
          onClick={resetAllData}
          className="mt-2.5 w-full py-3.5 text-sm font-semibold bg-danger/[0.08] text-danger border border-danger/20 rounded-2xl cursor-pointer"
        >
          {T("resetAllData")}
        </button>

        <div
          onClick={handleVersionTap}
          className="text-center mt-6 py-3 text-xs text-muted cursor-default select-none"
        >
          v2.0.0
        </div>
      </div>

      {/* Confirm remove modal */}
      {confirmRemove && (
        <div
          onClick={() => setConfirmRemove(null)}
          className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-surface rounded-3xl px-6 py-7 max-w-[320px] w-[90%] text-center"
          >
            <div className="mb-3 flex justify-center"><AlertTriangle size={40} color="#F59E0B" /></div>
            <p className="text-[15px] text-text m-0 mb-5 leading-relaxed">
              {T("confirmRemoveDog").replace("{name}", dogs[confirmRemove]?.profile?.name || "")}
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 py-3 text-sm font-semibold bg-transparent text-muted border border-border rounded-full cursor-pointer"
              >
                {T("back")}
              </button>
              <button
                onClick={() => { removeDog(confirmRemove); setConfirmRemove(null); }}
                className="flex-1 py-3 text-sm font-bold bg-danger text-white border-0 rounded-full cursor-pointer"
              >
                {T("removeDog")}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="profile" />
    </div>
  );
}
