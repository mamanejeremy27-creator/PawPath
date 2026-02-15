import { useState, useRef } from "react";
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
import { setLeaderboardOptIn } from "../lib/leaderboard.js";
import NotificationPreferences from "./NotificationPreferences.jsx";
import { uploadProfilePhoto } from "../lib/storage.js";
import { compressPhotoToBlob, compressPhoto } from "../utils/photoCompressor.js";

const C = { bg: "#0A0A0C", s1: "#131316", s2: "#1A1A1F", b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)", t1: "#F5F5F7", t3: "#71717A", t4: "#52525B", acc: "#22C55E", danger: "#EF4444", r: 16 };

export default function Profile() {
  const { dogProfile, setDogProfile, totalXP, currentStreak, completedExercises, completedLevels, earnedBadges, totalSessions, journal, playerLevel, resetAllData, T, badges, setShowFeedbackAdmin, dogs, activeDogId, switchDog, removeDog, dogCount, setShowAddDog, nav, challengeState, lang, appSettings, setAppSettings, toggleAccessory, AVATAR_ACCESSORIES, streakData, isAuthenticated, getSupaId, rtl } = useApp();
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
      // Try Supabase upload first
      const blob = await compressPhotoToBlob(file);
      const path = await uploadProfilePhoto(activeDogId, blob);
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
    <button onClick={() => startEdit(field)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, fontSize: 14, color: C.t3, opacity: 0.7 }}>
      {"\u270F\uFE0F"}
    </button>
  );

  const dogEntries = Object.entries(dogs);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10000, padding: "10px 24px", background: C.acc, color: "#000", fontSize: 14, fontWeight: 700, borderRadius: 50, boxShadow: "0 4px 20px rgba(34,197,94,0.4)", animation: "fadeIn 0.3s ease" }}>
          {toast}
        </div>
      )}

      <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoSelect} />

      <div style={{ textAlign: "center", padding: "40px 20px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: 20, insetInlineEnd: 20 }}>
          <LanguageToggle />
        </div>

        {/* Tappable avatar for photo upload */}
        <div onClick={() => photoRef.current?.click()} style={{ cursor: "pointer", display: "inline-block", position: "relative" }}>
          <DogAvatar key={activeDogId} size="large" dogId={activeDogId} />
          <div style={{ position: "absolute", bottom: -2, right: -2, width: 28, height: 28, borderRadius: "50%", background: C.acc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            {"\uD83D\uDCF7"}
          </div>
        </div>
        <div style={{ fontSize: 11, color: C.t3, marginTop: 6 }}>{T("tapToChangePhoto")}</div>

        {/* Editable name */}
        {editing === "name" ? (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <input autoFocus value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => e.key === "Enter" && saveField("name", editName.trim())} style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Playfair Display', serif", background: C.s1, border: `1px solid ${C.acc}`, borderRadius: 12, color: C.t1, padding: "8px 14px", textAlign: "center", outline: "none", width: 200 }} />
            <button onClick={() => saveField("name", editName.trim())} style={{ padding: "8px 16px", background: C.acc, color: "#000", border: "none", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{"\u2713"}</button>
            <button onClick={() => setEditing(null)} style={{ padding: "8px 12px", background: "transparent", color: C.t3, border: `1px solid ${C.b1}`, borderRadius: 20, fontSize: 13, cursor: "pointer" }}>{"\u2717"}</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: 0, color: C.t1 }}>{dogProfile?.name}</h2>
            {pencil("name")}
          </div>
        )}

        {/* Editable breed + age */}
        {editing === "breed" ? (
          <div style={{ marginTop: 8, position: "relative", maxWidth: 280, margin: "8px auto 0" }}>
            <input autoFocus value={editBreed} onChange={e => handleBreedInput(e.target.value)} onKeyDown={e => e.key === "Enter" && saveField("breed", editBreed.trim())} style={{ width: "100%", fontSize: 14, background: C.s1, border: `1px solid ${C.acc}`, borderRadius: 12, color: C.t1, padding: "10px 14px", textAlign: "center", outline: "none" }} placeholder={T("breedPlaceholder")} />
            {showBreeds && breedSug.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.s2, border: `1px solid ${C.b2}`, borderRadius: C.r, marginTop: 4, zIndex: 50, maxHeight: 220, overflowY: "auto", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
                {breedSug.map(b => {
                  const hasProfile = !!matchBreed(b);
                  return (
                    <button key={b} onClick={() => { saveField("breed", b); }} style={{ display: "block", width: "100%", padding: "13px 20px", fontSize: 15, background: "none", border: "none", borderBottom: `1px solid ${C.b1}`, color: C.t1, textAlign: rtl ? "right" : "left", cursor: "pointer" }}>
                      {hasProfile ? "\uD83D\uDC36 " : b.toLowerCase().includes("mix") ? "\uD83D\uDC15\u200D\uD83E\uDDBA " : ""}{b}
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
              <button onClick={() => saveField("breed", editBreed.trim())} style={{ padding: "6px 16px", background: C.acc, color: "#000", border: "none", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{"\u2713"}</button>
              <button onClick={() => { setEditing(null); setShowBreeds(false); }} style={{ padding: "6px 12px", background: "transparent", color: C.t3, border: `1px solid ${C.b1}`, borderRadius: 20, fontSize: 12, cursor: "pointer" }}>{"\u2717"}</button>
            </div>
          </div>
        ) : editing === "age" ? (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <select autoFocus value={editAge} onChange={e => saveField("age", e.target.value)} style={{ fontSize: 14, background: C.s1, border: `1px solid ${C.acc}`, borderRadius: 12, color: C.t1, padding: "10px 14px", outline: "none", appearance: "none" }}>
              <option value="">{T("selectAge")}</option>
              {ageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={() => setEditing(null)} style={{ padding: "6px 12px", background: "transparent", color: C.t3, border: `1px solid ${C.b1}`, borderRadius: 20, fontSize: 12, cursor: "pointer" }}>{"\u2717"}</button>
          </div>
        ) : editing === "birthday" ? (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <input autoFocus type="date" value={editBirthday} onChange={e => saveField("birthday", e.target.value)} style={{ fontSize: 14, background: C.s1, border: `1px solid ${C.acc}`, borderRadius: 12, color: C.t1, padding: "10px 14px", outline: "none" }} />
            <button onClick={() => setEditing(null)} style={{ padding: "6px 12px", background: "transparent", color: C.t3, border: `1px solid ${C.b1}`, borderRadius: 20, fontSize: 12, cursor: "pointer" }}>{"\u2717"}</button>
          </div>
        ) : (
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, color: C.t3 }}>{dogProfile?.breed}</span>
            {pencil("breed")}
            <span style={{ fontSize: 14, color: C.t3 }}>{" · "}</span>
            <span style={{ fontSize: 14, color: C.t3 }}>{dogProfile?.age}</span>
            {pencil("age")}
            {dogProfile?.birthday && (
              <>
                <span style={{ fontSize: 14, color: C.t3 }}>{" · "}</span>
                <span style={{ fontSize: 14, color: C.t3 }}>{dogProfile.birthday}</span>
              </>
            )}
            {pencil("birthday")}
          </div>
        )}

        <div style={{ marginTop: 12, display: "inline-block", padding: "8px 22px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 24, color: C.acc, fontSize: 14, fontWeight: 700 }}>{T("level")} {playerLevel.level} — {playerLevel.title}</div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Stats */}
        {[
          [T("totalXP"), `${totalXP} ${T("xp")}`],
          [T("streak"), `${currentStreak} ${T("dayStreak")} \uD83D\uDD25`],
          [T("exercises"), completedExercises.length],
          [T("levels"), completedLevels.length],
          [T("badges"), `${earnedBadges.length}/${badges.length}`],
          [T("sessions"), totalSessions],
          [T("journalEntries"), journal.length],
        ].map(([l, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${C.b1}` }}>
            <span style={{ fontSize: 15, color: C.t3 }}>{l}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{v}</span>
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
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("breedProfile")}</h3>
              <div style={{ padding: "18px 20px", background: C.s1, borderRadius: 16, border: `1px solid ${C.b1}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 22 }}>{"\uD83D\uDC36"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{breedData.name[lang] || breedData.name.en}</div>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 8, background: "rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 600, color: C.t3 }}>{sizeLabel}</span>
                </div>
                {traitKeys.map(key => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: C.t3, width: 90, flexShrink: 0, textAlign: lang === "he" ? "right" : "left" }}>{traitLabels[key]}</span>
                    <div style={{ flex: 1, display: "flex", gap: 4 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} style={{ flex: 1, height: 6, borderRadius: 3, background: n <= breedData.traits[key] ? C.acc : C.b1, transition: "background 0.3s" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: C.t3, width: 16, textAlign: "center" }}>{breedData.traits[key]}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(34,197,94,0.04)", borderRadius: 12, border: "1px solid rgba(34,197,94,0.08)" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.acc, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{T("breedTips")}</div>
                  <p style={{ fontSize: 13, color: C.t3, margin: 0, lineHeight: 1.6 }}>{breedTipText}</p>
                </div>
                <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {breedData.priorityPrograms.map(pid => (
                    <span key={pid} style={{ padding: "3px 10px", borderRadius: 8, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", fontSize: 11, fontWeight: 600, color: C.acc }}>{pid}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* My Dogs section */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("myDogs")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {dogEntries.map(([id, dog]) => {
              const isActive = id === activeDogId;
              return (
                <div key={id} style={{ padding: "16px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${isActive ? "rgba(34,197,94,0.3)" : C.b1}`, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flexShrink: 0 }}>
                    <DogAvatar size="small" photo={dog.profile?.photo} dogId={id} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{dog.profile?.name}</div>
                    <div style={{ fontSize: 12, color: C.t3 }}>
                      {dog.profile?.breed}
                      {isActive && <span style={{ color: C.acc, marginInlineStart: 8, fontWeight: 600 }}>{T("activeDog")}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {!isActive && (
                      <button onClick={() => switchDog(id)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, background: "rgba(34,197,94,0.1)", color: C.acc, border: "none", borderRadius: 20, cursor: "pointer" }}>
                        {T("switchDog")}
                      </button>
                    )}
                    {dogCount > 1 && (
                      <button onClick={() => setConfirmRemove(id)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, background: "rgba(239,68,68,0.08)", color: C.danger, border: "none", borderRadius: 20, cursor: "pointer" }}>
                        {T("removeDog")}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {dogCount < 2 && (
              <button onClick={() => setShowAddDog(true)} style={{ padding: "16px", background: "transparent", border: `1px dashed ${C.t3}`, borderRadius: C.r, color: C.t3, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                + {T("addDog")}
              </button>
            )}
          </div>
        </div>

        {/* Challenge History */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("challengeHistory")}</h3>
          {challengeState.history.length > 0 ? (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{challengeState.stats.totalCompleted}</div>
                  <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("completed")}</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{challengeState.stats.currentStreak}</div>
                  <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("weeks")}</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{challengeState.stats.bestStreak}</div>
                  <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("challengeBestStreak")}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {challengeState.history.slice().reverse().map((h, i) => {
                  const chDef = CHALLENGES.find(c => c.id === h.challengeId);
                  return (
                    <div key={i} style={{ padding: "12px 16px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 20 }}>{chDef?.emoji || "\uD83C\uDFC6"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{lang === "he" ? chDef?.nameHe : chDef?.name}</div>
                        <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
                          {h.completedDays.length}/7 {T("challengeDay")}s · {h.fullComplete ? T("fullCompletion") : T("partialCompletion")} · +{h.xpEarned} XP
                        </div>
                      </div>
                      {h.fullComplete && <span style={{ fontSize: 14 }}>{"\u2705"}</span>}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p style={{ fontSize: 13, color: C.t3, lineHeight: 1.6 }}>{T("noChallengesYet")}</p>
          )}
        </div>

        {/* Diagnostic History */}
        {(() => {
          const diagHistory = getDiagnosticHistory();
          if (diagHistory.length === 0) return null;
          return (
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("diagHistory")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {diagHistory.slice(0, 10).map((h, i) => {
                  const cat = DIAGNOSTIC_CATEGORIES.find(c => c.id === h.categoryId);
                  if (!cat) return null;
                  return (
                    <div key={i} style={{ padding: "12px 16px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{cat.name[lang] || cat.name.en}</div>
                        <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
                          {new Date(h.date).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric" })}
                          {h.dogName ? ` · ${h.dogName}` : ""}
                          {` · ${h.exerciseCount} ${T("exercises")}`}
                        </div>
                      </div>
                      <button onClick={() => nav("diagnostic")} style={{ padding: "4px 12px", fontSize: 11, fontWeight: 600, background: "rgba(34,197,94,0.08)", color: C.acc, border: "none", borderRadius: 16, cursor: "pointer" }}>
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
        <div style={{ marginTop: 32 }}>
          <button onClick={() => nav("healthDashboard")}
            style={{ width: "100%", padding: "16px 20px", background: "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(239,68,68,0.06))", border: "1px solid rgba(236,72,153,0.2)", borderRadius: C.r, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, color: C.t1, textAlign: "start" }}>
            <span style={{ fontSize: 24 }}>{"❤️"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{T("healthDashboard")}</div>
              <div style={{ fontSize: 12, color: "#EC4899", fontWeight: 600, marginTop: 2 }}>{T("healthDashboardSub")}</div>
            </div>
            <span style={{ color: C.t3, fontSize: 18 }}>{"\u203A"}</span>
          </button>
        </div>

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Avatar Accessories */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("accessories")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {AVATAR_ACCESSORIES.map(acc => {
              const isUnlocked = appSettings.unlockedAccessories.includes(acc.id);
              const isActive = appSettings.activeAccessories.includes(acc.id);
              return (
                <div key={acc.id} style={{ padding: "14px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${isActive ? "rgba(34,197,94,0.3)" : C.b1}`, display: "flex", alignItems: "center", gap: 14, opacity: isUnlocked ? 1 : 0.4 }}>
                  <span style={{ fontSize: 28 }}>{acc.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isUnlocked ? C.t1 : C.t3 }}>{lang === "he" ? (acc.nameHe || acc.name) : acc.name}</div>
                    {!isUnlocked && (
                      <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{T("unlockAtStreak").replace("{days}", acc.unlockedAt)}</div>
                    )}
                  </div>
                  {isUnlocked && (
                    <button onClick={() => toggleAccessory(acc.id)} style={{ padding: "6px 16px", fontSize: 12, fontWeight: 600, background: isActive ? "rgba(34,197,94,0.1)" : "transparent", color: isActive ? C.acc : C.t3, border: `1px solid ${isActive ? "rgba(34,197,94,0.2)" : C.b1}`, borderRadius: 20, cursor: "pointer" }}>
                      {isActive ? T("unequip") : T("equip")}
                    </button>
                  )}
                  {!isUnlocked && <span style={{ fontSize: 16 }}>{"\uD83D\uDD12"}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Opt-In */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("leaderboard")}</h3>
          <div style={{ padding: "16px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, color: C.t1, fontWeight: 600 }}>{T("lbOptIn")}</span>
            <button onClick={() => {
              const newVal = !(appSettings.leaderboardOptIn !== false);
              setAppSettings(prev => ({ ...prev, leaderboardOptIn: newVal }));
              if (isAuthenticated) {
                const supaId = getSupaId(activeDogId);
                if (supaId) setLeaderboardOptIn(supaId, newVal);
              }
            }}
              style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: (appSettings.leaderboardOptIn !== false) ? C.acc : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.2s" }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 3, left: (appSettings.leaderboardOptIn !== false) ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
            </button>
          </div>
        </div>

        {/* Smart Notifications */}
        <NotificationPreferences />

        <div style={{ marginTop: 32 }}>
          <button onClick={() => hasEnoughForRecap && nav("annualRecap")}
            style={{ width: "100%", padding: "16px", fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(139,92,246,0.08))", color: hasEnoughForRecap ? C.acc : C.t3, border: `1px solid rgba(34,197,94,0.2)`, borderRadius: C.r, cursor: hasEnoughForRecap ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: hasEnoughForRecap ? 1 : 0.7 }}>
            {"\uD83C\uDF1F"} {T("viewRecap")}
          </button>
          {!hasEnoughForRecap && (
            <p style={{ fontSize: 12, color: C.t3, textAlign: "center", margin: "8px 0 0", lineHeight: 1.5 }}>{T("keepTrainingRecap")}</p>
          )}
        </div>

        <button onClick={async () => { setSigningOut(true); await signOut(); }}
          style={{ marginTop: 16, width: "100%", padding: "14px", fontSize: 14, fontWeight: 600, background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: C.r, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {signingOut ? T("signingOut") : T("signOut")}
        </button>

        <button onClick={resetAllData}
          style={{ marginTop: 10, width: "100%", padding: "14px", fontSize: 14, fontWeight: 600, background: "rgba(239,68,68,0.08)", color: C.danger, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: C.r, cursor: "pointer" }}>{T("resetAllData")}</button>
        <div
          onClick={handleVersionTap}
          style={{ textAlign: "center", marginTop: 24, padding: "12px 0", fontSize: 12, color: C.t3, cursor: "default", userSelect: "none" }}
        >
          v2.0.0
        </div>
      </div>

      {/* Confirm remove modal */}
      {confirmRemove && (
        <div onClick={() => setConfirmRemove(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.s1, borderRadius: 24, padding: "28px 24px", maxWidth: 320, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u26A0\uFE0F"}</div>
            <p style={{ fontSize: 15, color: C.t1, margin: "0 0 20px", lineHeight: 1.6 }}>
              {T("confirmRemoveDog").replace("{name}", dogs[confirmRemove]?.profile?.name || "")}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmRemove(null)} style={{ flex: 1, padding: "12px", fontSize: 14, fontWeight: 600, background: "transparent", color: C.t3, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
                {T("back")}
              </button>
              <button onClick={() => { removeDog(confirmRemove); setConfirmRemove(null); }} style={{ flex: 1, padding: "12px", fontSize: 14, fontWeight: 700, background: C.danger, color: "#fff", border: "none", borderRadius: 50, cursor: "pointer" }}>
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
