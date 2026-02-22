import { useApp } from "../context/AppContext.jsx";
import { Home, Users, BookOpen, Award, User } from "lucide-react";

const C = { bg: "#0A0A0C", acc: "#22C55E", t3: "#71717A" };

export default function BottomNav({ active }) {
  const { setScreen, setSelProgram, setSelLevel, setSelExercise, T } = useApp();

  const items = [
    { id: "home", Icon: Home, label: T("home") },
    { id: "community", Icon: Users, label: T("community") },
    { id: "journal", Icon: BookOpen, label: T("journal") },
    { id: "badges", Icon: Award, label: T("badges") },
    { id: "profile", Icon: User, label: T("profile") },
  ];

  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, display: "flex", justifyContent: "space-around", padding: "8px 0 26px", background: `linear-gradient(to top, ${C.bg} 60%, transparent)`, backdropFilter: "blur(24px)", zIndex: 100 }}>
      {items.map(item => (
        <button key={item.id} onClick={() => { setScreen(item.id); if (item.id === "home") { setSelProgram(null); setSelLevel(null); setSelExercise(null); } }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: active === item.id ? C.acc : C.t3 }}>
          <item.Icon size={20} strokeWidth={active === item.id ? 2.5 : 1.5} />
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
