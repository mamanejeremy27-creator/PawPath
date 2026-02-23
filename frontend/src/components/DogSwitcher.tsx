import { useApp } from "../context/AppContext.jsx";
import PhotoImg from "./PhotoImg.jsx";
import { cn } from "../lib/cn";

export default function DogSwitcher() {
  const { dogs, activeDogId, switchDog, dogCount, setShowAddDog, T } = useApp();
  const dogEntries = Object.entries(dogs);

  if (dogEntries.length === 0) return null;

  return (
    <div className="flex gap-2 px-5 pt-3 overflow-x-auto">
      {dogEntries.map(([id, dog]: [string, any]) => {
        const isActive = id === activeDogId;
        return (
          <button
            key={id}
            onClick={() => !isActive && switchDog(id)}
            className={cn(
              "py-2 px-4 rounded-full text-[13px] font-bold",
              "flex items-center gap-1.5 whitespace-nowrap shrink-0",
              isActive
                ? "border-2 border-training bg-training/10 text-training cursor-default"
                : "border border-border bg-surface text-text cursor-pointer"
            )}
          >
            {dog.profile?.photo ? (
              <PhotoImg
                key={`${id}-${dog.profile.photo}`}
                src={dog.profile.photo}
                alt=""
                style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
            ) : (
              <span className="text-[14px]">{"\uD83D\uDC3E"}</span>
            )}
            {dog.profile?.name || "Dog"}
            {isActive && (
              <span className="text-[9px] opacity-70">{"\u2713"}</span>
            )}
          </button>
        );
      })}

      {dogCount < 2 && (
        <button
          onClick={() => setShowAddDog(true)}
          className="py-2 px-4 rounded-full border border-dashed border-muted bg-transparent text-muted text-[13px] font-semibold cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          + {T("addDog")}
        </button>
      )}
    </div>
  );
}
