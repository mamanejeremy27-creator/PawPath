import { useApp } from "../context/AppContext.jsx";
import { cn } from "../lib/cn";

function Toggle({ on, onToggle, disabled }: { on: any; onToggle: () => any; disabled?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "w-11 h-6 rounded-full border-none relative transition-colors flex-shrink-0",
        on ? "bg-training" : "bg-white/10",
        disabled ? "opacity-40 cursor-default" : "cursor-pointer"
      )}
    >
      <div
        className="w-[18px] h-[18px] rounded-full bg-white absolute top-[3px] transition-[left] duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
        style={{ left: on ? 23 : 3 }}
      />
    </button>
  );
}

export default function NotificationPreferences() {
  const { reminders, setReminders, requestNotifPermission, T } = useApp();

  const smart = reminders.smart || { streakReminder: true, spacedRepDue: true, challengeIncomplete: true, buddyNudge: false, communityActivity: false };
  const quietHours = reminders.quietHours || { start: "22:00", end: "07:00", enabled: false };
  const maxPerDay = reminders.maxPerDay ?? 5;
  const notifPermission = reminders.notifPermission || (typeof Notification !== "undefined" ? Notification.permission : "default");
  const needsPermission = notifPermission !== "granted";

  const setSmart = (key, val) => setReminders(r => ({ ...r, smart: { ...r.smart, [key]: val } }));
  const setQuietHours = (updates) => setReminders(r => ({ ...r, quietHours: { ...r.quietHours, ...updates } }));

  const toggleRows = [
    { key: "streakReminder", label: T("notifStreak"), sub: T("notifStreakSub") },
    { key: "spacedRepDue", label: T("notifSpacedRep"), sub: T("notifSpacedRepSub") },
    { key: "challengeIncomplete", label: T("notifChallenge"), sub: T("notifChallengeSub") },
    { key: "buddyNudge", label: T("notifBuddy"), sub: T("notifBuddySub"), disabled: true },
    { key: "communityActivity", label: T("notifCommunity"), sub: T("notifCommunitySub"), disabled: true },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-base font-bold text-text mb-4">{T("notifPreferences")}</h3>

      {/* Permission warning */}
      {needsPermission && (
        <div className="px-[18px] py-3.5 mb-3 bg-[rgba(234,179,8,0.06)] border border-[rgba(234,179,8,0.15)] rounded-2xl flex items-center justify-between gap-3">
          <span className="text-[13px] text-[#EAB308] leading-relaxed">{T("notifWarning")}</span>
          <button
            onClick={async () => {
              const perm = await requestNotifPermission();
              setReminders(r => ({ ...r, notifPermission: perm }));
            }}
            className="px-3.5 py-1.5 text-[12px] font-bold bg-[rgba(234,179,8,0.12)] text-[#EAB308] border border-[rgba(234,179,8,0.25)] rounded-full cursor-pointer whitespace-nowrap"
          >
            {T("enableNow")}
          </button>
        </div>
      )}

      {/* Toggle rows */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {toggleRows.map((row, i) => (
          <div
            key={row.key}
            className={cn(
              "px-[18px] py-4 flex items-center justify-between gap-3.5",
              i < toggleRows.length - 1 ? "border-b border-border" : "",
              row.disabled ? "opacity-45" : ""
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-text">{row.label}</div>
              <div className="text-[12px] text-muted mt-0.5">{row.sub}</div>
            </div>
            <Toggle
              on={!!smart[row.key]}
              onToggle={() => setSmart(row.key, !smart[row.key])}
              disabled={!!row.disabled}
            />
          </div>
        ))}
      </div>

      {/* Quiet Hours */}
      <div className={cn(
        "mt-3.5 bg-surface rounded-2xl border border-border overflow-hidden"
      )}>
        <div className={cn(
          "px-[18px] py-4 flex items-center justify-between gap-3.5",
          quietHours.enabled ? "border-b border-border" : ""
        )}>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-text">{T("quietHours")}</div>
            <div className="text-[12px] text-muted mt-0.5">{T("quietHoursSub")}</div>
          </div>
          <Toggle on={quietHours.enabled} onToggle={() => setQuietHours({ enabled: !quietHours.enabled })} />
        </div>
        {quietHours.enabled && (
          <div className="px-[18px] py-3.5 flex items-center gap-2.5">
            <input
              type="time"
              value={quietHours.start}
              onChange={e => setQuietHours({ start: e.target.value })}
              className="flex-1 px-2.5 py-2 text-[14px] bg-white/[0.04] text-text border border-border rounded-[10px] outline-none"
            />
            <span className="text-[13px] text-muted">{T("to")}</span>
            <input
              type="time"
              value={quietHours.end}
              onChange={e => setQuietHours({ end: e.target.value })}
              className="flex-1 px-2.5 py-2 text-[14px] bg-white/[0.04] text-text border border-border rounded-[10px] outline-none"
            />
          </div>
        )}
      </div>

      {/* Max per day */}
      <div className="mt-3.5 px-[18px] py-4 bg-surface rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[14px] font-semibold text-text">{T("maxNotifPerDay")}</span>
          <span className="text-[14px] font-bold text-training">{maxPerDay}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={maxPerDay}
          onChange={e => setReminders(r => ({ ...r, maxPerDay: Number(e.target.value) }))}
          className="w-full accent-training"
        />
        <div className="flex justify-between text-[11px] text-muted mt-1">
          <span>1</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
