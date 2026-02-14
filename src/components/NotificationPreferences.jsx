import { useApp } from "../context/AppContext.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", r: 16 };

function Toggle({ on, onToggle, disabled }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: disabled ? "default" : "pointer",
        background: on ? C.acc : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.2s",
        opacity: disabled ? 0.4 : 1, flexShrink: 0,
      }}
    >
      <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 3, left: on ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
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
    <div style={{ marginTop: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.t1, margin: "0 0 16px" }}>{T("notifPreferences")}</h3>

      {/* Permission warning */}
      {needsPermission && (
        <div style={{
          padding: "14px 18px", marginBottom: 12, background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.15)",
          borderRadius: C.r, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <span style={{ fontSize: 13, color: "#EAB308", lineHeight: 1.5 }}>{T("notifWarning")}</span>
          <button
            onClick={async () => {
              const perm = await requestNotifPermission();
              setReminders(r => ({ ...r, notifPermission: perm }));
            }}
            style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, background: "rgba(234,179,8,0.12)", color: "#EAB308", border: "1px solid rgba(234,179,8,0.25)", borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {T("enableNow")}
          </button>
        </div>
      )}

      {/* Toggle rows */}
      <div style={{ background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, overflow: "hidden" }}>
        {toggleRows.map((row, i) => (
          <div key={row.key} style={{
            padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
            borderBottom: i < toggleRows.length - 1 ? `1px solid ${C.b1}` : "none",
            opacity: row.disabled ? 0.45 : 1,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{row.label}</div>
              <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{row.sub}</div>
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
      <div style={{ marginTop: 14, background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, overflow: "hidden" }}>
        <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, borderBottom: quietHours.enabled ? `1px solid ${C.b1}` : "none" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{T("quietHours")}</div>
            <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{T("quietHoursSub")}</div>
          </div>
          <Toggle on={quietHours.enabled} onToggle={() => setQuietHours({ enabled: !quietHours.enabled })} />
        </div>
        {quietHours.enabled && (
          <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="time"
              value={quietHours.start}
              onChange={e => setQuietHours({ start: e.target.value })}
              style={{
                flex: 1, padding: "8px 10px", fontSize: 14, background: "rgba(255,255,255,0.04)", color: C.t1,
                border: `1px solid ${C.b1}`, borderRadius: 10, outline: "none",
              }}
            />
            <span style={{ fontSize: 13, color: C.t3 }}>{T("to")}</span>
            <input
              type="time"
              value={quietHours.end}
              onChange={e => setQuietHours({ end: e.target.value })}
              style={{
                flex: 1, padding: "8px 10px", fontSize: 14, background: "rgba(255,255,255,0.04)", color: C.t1,
                border: `1px solid ${C.b1}`, borderRadius: 10, outline: "none",
              }}
            />
          </div>
        )}
      </div>

      {/* Max per day */}
      <div style={{ marginTop: 14, padding: "16px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{T("maxNotifPerDay")}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.acc }}>{maxPerDay}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={maxPerDay}
          onChange={e => setReminders(r => ({ ...r, maxPerDay: Number(e.target.value) }))}
          style={{ width: "100%", accentColor: C.acc }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.t3, marginTop: 4 }}>
          <span>1</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
