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
    <div className="fixed bottom-0 inset-x-0 bg-bg/80 backdrop-blur-md border-t border-border z-[100]">
      <div className="flex max-w-[480px] mx-auto pb-6">
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
                "flex-1 flex flex-col items-center py-3 gap-1 bg-transparent border-none cursor-pointer",
                isActive ? "text-training" : "text-muted"
              )}
            >
              <item.Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-training" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
