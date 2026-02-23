import { useApp } from "../context/AppContext.jsx";
import { Home, Dumbbell, BookOpen, Award, User } from "lucide-react";
import { cn } from "../lib/cn";

export default function BottomNav({ active }) {
  const { setScreen, setSelProgram, setSelLevel, setSelExercise, T } = useApp();

  const items = [
    { id: "home",    Icon: Home,     label: T("home")    },
    { id: "train",   Icon: Dumbbell, label: T("train")   },
    { id: "journal", Icon: BookOpen, label: T("journal") },
    { id: "badges",  Icon: Award,    label: T("badges")  },
    { id: "profile", Icon: User,     label: T("profile") },
  ];

  return (
    <div className="fixed bottom-4 inset-x-0 z-[100] px-4 flex justify-center pointer-events-none">
      <div className="flex max-w-[440px] w-full bg-surface brut-border brut-shadow rounded-3xl pointer-events-auto overflow-hidden">
        {items.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setScreen(item.id);
                if (item.id === "home") {
                  setSelProgram(null);
                  setSelLevel(null);
                  setSelExercise(null);
                }
              }}
              className={cn(
                "flex-1 flex flex-col items-center py-3 gap-1 bg-transparent border-none cursor-pointer hover:bg-black/5 transition-colors",
                isActive ? "text-black bg-black/10" : "text-muted"
              )}
            >
              <item.Icon size={24} strokeWidth={isActive ? 3 : 2} className={isActive ? "text-black" : "text-muted"} />
              <span className={cn("text-[10px] font-black uppercase tracking-wide", isActive ? "text-black" : "text-muted")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
