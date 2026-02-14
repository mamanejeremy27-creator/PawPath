import { useApp } from "../context/AppContext.jsx";

const C = { bg: "#0A0A0C", acc: "#22C55E", t3: "#71717A" };

export default function BottomNav({ active }) {
  const { setScreen, setSelProgram, setSelLevel, setSelExercise, T } = useApp();

  const items = [
    { id: "home", icon: "🏠", label: T("home") },
    { id: "journal", icon: "📝", label: T("journal") },
    { id: "badges", icon: "🏅", label: T("badges") },
    { id: "leaderboard", icon: "🏆", label: T("leaderboard") },
    { id: "profile", icon: "👤", label: T("profile") },
  ];

  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, display: "flex", justifyContent: "space-around", padding: "8px 0 26px", background: `linear-gradient(to top, ${C.bg} 60%, transparent)`, backdropFilter: "blur(24px)", zIndex: 100 }}>
      {items.map(item => (
        <button key={item.id} onClick={() => { setScreen(item.id); if (item.id === "home") { setSelProgram(null); setSelLevel(null); setSelExercise(null); } }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: active === item.id ? C.acc : C.t3 }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
