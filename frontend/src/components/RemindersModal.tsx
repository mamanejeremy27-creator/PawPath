import { useApp } from "../context/AppContext.jsx";
import { X, Clock } from "lucide-react";
import { cn } from "../lib/cn";

const sectionLabel = (text) => (
  <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{text}</div>
);

export default function RemindersModal() {
  const { showReminders, setShowReminders, reminders, setReminders, requestNotifPermission, T } = useApp();
  if (!showReminders) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-xl flex items-end justify-center">
      <div className="w-full max-w-[480px] bg-surface rounded-t-3xl px-6 pt-7 pb-9 [animation:slideUp_0.3s_ease]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-[22px] font-extrabold m-0 text-text">{T("trainingReminders")}</h3>
          <button
            onClick={() => setShowReminders(false)}
            className="bg-white/[0.06] border-none text-muted w-9 h-9 rounded-[10px] cursor-pointer flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Enable toggle row */}
        <div className="flex justify-between items-center py-4 border-b border-border mb-5">
          <div>
            <div className="text-[15px] font-bold text-text">{T("enableReminders")}</div>
            <div className="text-[12px] text-muted mt-0.5">{T("getNotified")}</div>
          </div>
          <button
            onClick={() => {
              if (!reminders.enabled && typeof Notification !== "undefined" && Notification.permission !== "granted") requestNotifPermission();
              setReminders(r => ({ ...r, enabled: !r.enabled }));
            }}
            className={cn(
              "w-[52px] h-[30px] rounded-full border-none cursor-pointer relative transition-colors",
              reminders.enabled ? "bg-training" : "bg-surface-2"
            )}
          >
            <div
              className="w-6 h-6 rounded-full bg-white absolute top-[3px] transition-[left] duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
              style={{ left: reminders.enabled ? 25 : 3 }}
            />
          </button>
        </div>

        {reminders.enabled && (
          <>
            {sectionLabel(T("reminderTimes"))}
            <div className="flex flex-col gap-2.5 mb-5">
              {reminders.times.map((time, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <Clock size={20} className="text-xp" />
                  <input
                    type="time"
                    value={time}
                    onChange={e => { const nt = [...reminders.times]; nt[idx] = e.target.value; setReminders(r => ({ ...r, times: nt })); }}
                    className="flex-1 px-4 py-3 text-base bg-bg border border-border-2 rounded-2xl text-text outline-none"
                  />
                  {reminders.times.length > 1 && (
                    <button
                      onClick={() => setReminders(r => ({ ...r, times: r.times.filter((_, i) => i !== idx) }))}
                      className="w-9 h-9 rounded-[10px] bg-danger/10 border-none text-danger cursor-pointer flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {reminders.times.length < 4 && (
              <button
                onClick={() => setReminders(r => ({ ...r, times: [...r.times, "12:00"] }))}
                className="w-full py-3 bg-white/[0.06] border-none rounded-2xl text-training text-[14px] font-semibold cursor-pointer mb-4"
              >
                {T("addAnother")}
              </button>
            )}
            {typeof Notification !== "undefined" && Notification.permission !== "granted" && (
              <div className="px-4 py-3.5 bg-xp/[0.08] rounded-2xl border border-xp/[0.15] mb-4">
                <p className="text-[13px] text-xp m-0 leading-relaxed">
                  {T("notifWarning")}{" "}
                  <button
                    onClick={requestNotifPermission}
                    className="bg-none border-none text-training font-bold cursor-pointer underline text-[13px] p-0"
                  >
                    {T("enableNow")}
                  </button>
                </p>
              </div>
            )}
          </>
        )}

        <button
          onClick={() => setShowReminders(false)}
          className="w-full py-4 text-[15px] font-bold bg-training text-black border-none rounded-full cursor-pointer"
        >
          {T("save")}
        </button>
      </div>
    </div>
  );
}
