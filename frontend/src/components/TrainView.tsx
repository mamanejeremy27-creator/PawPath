import { useApp } from "../context/AppContext.jsx";
import { matchBreed } from "../data/breedTraits.js";
import { Lock, ChevronRight, Trophy } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import SkillHealth from "./SkillHealth.jsx";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };

export default function TrainView() {
  const { dogProfile, playerLevel, completedExercises, nav, T, programs } = useApp();
  const breedData = matchBreed(dogProfile?.breed);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <SkillHealth />

      {/* Programs */}
      <div style={{ padding: "24px 20px 8px" }}><h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: C.t1 }}>{T("programs")}</h2></div>
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {programs.map((prog, idx) => {
          const unlocked = playerLevel.level >= prog.unlockLevel;
          const tot = prog.levels.reduce((a, l) => a + l.exercises.length, 0);
          const dn = prog.levels.reduce((a, l) => a + l.exercises.filter(e => completedExercises.includes(e.id)).length, 0);
          const pct = tot > 0 ? Math.round((dn / tot) * 100) : 0;
          return (
            <button key={prog.id} onClick={() => unlocked && nav("program", { program: prog })}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, cursor: unlocked ? "pointer" : "default", opacity: unlocked ? 1 : 0.4, color: C.t1, textAlign: "start", width: "100%", animation: `fadeIn 0.3s ease ${idx * 0.04}s both` }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: prog.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{unlocked ? <Icon name={prog.icon} size={22} color="#fff" /> : <Lock size={22} color="#71717A" />}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{prog.name}</div>
                <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{unlocked ? `${dn}/${tot} ${T("exercises")}` : `${T("unlockAt")} ${prog.unlockLevel}`}</div>
                {unlocked && breedData && breedData.priorityPrograms.includes(prog.id) && (
                  <div style={{ marginTop: 4, display: "inline-block", padding: "2px 8px", borderRadius: 6, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", fontSize: 11, color: C.acc, fontWeight: 600 }}>{T("recommendedForBreed")}</div>
                )}
                {unlocked && dn > 0 && <div style={{ height: 3, background: C.b1, borderRadius: 10, overflow: "hidden", marginTop: 8 }}><div style={{ height: "100%", width: `${pct}%`, background: prog.gradient, borderRadius: 10 }} /></div>}
              </div>
              <ChevronRight size={16} color={C.t3} />
            </button>
          );
        })}
      </div>

      {/* Leaderboard Entry */}
      <div style={{ padding: "12px 20px 0" }}>
        <button
          onClick={() => nav("leaderboard")}
          style={{
            width: "100%", padding: "16px 20px", boxSizing: "border-box",
            background: "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(245,158,11,0.06))",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: C.rL, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 14,
            color: C.t1, textAlign: "start",
          }}
        >
          <Trophy size={28} color="#FFD700" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{T("leaderboard")}</div>
            <div style={{ fontSize: 12, color: "#FFD700", fontWeight: 600, marginTop: 2 }}>{T("leaderboardSubtitle")}</div>
          </div>
          <ChevronRight size={16} color={C.t3} />
        </button>
      </div>

      <BottomNav active="train" />
    </div>
  );
}
