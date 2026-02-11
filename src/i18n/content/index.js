import programsHe from "./programs.he.js";
import gearHe from "./gear.he.js";
import messagesHe from "./messages.he.js";
import badgesHe from "./badges.he.js";

export function getTranslatedPrograms(programs, lang) {
  if (lang !== "he") return programs;
  return programs.map(prog => {
    const pt = programsHe.programs[prog.id] || {};
    return {
      ...prog,
      name: pt.name || prog.name,
      description: pt.description || prog.description,
      difficulty: pt.difficulty || prog.difficulty,
      duration: pt.duration || prog.duration,
      levels: prog.levels.map(lv => {
        const lt = programsHe.levels[lv.id] || {};
        return {
          ...lv,
          name: lt.name || lv.name,
          description: lt.description || lv.description,
          exercises: lv.exercises.map(ex => {
            const et = programsHe.exercises[ex.id] || {};
            return {
              ...ex,
              name: et.name || ex.name,
              description: et.description || ex.description,
              steps: et.steps || ex.steps,
              tips: et.tips || ex.tips,
            };
          }),
        };
      }),
    };
  });
}

export function getTranslatedGear(gear, lang) {
  if (lang !== "he") return gear;
  return gear.map(g => {
    const gt = gearHe[g.id] || {};
    return {
      ...g,
      name: gt.name || g.name,
      description: gt.description || g.description,
      tip: gt.tip || g.tip,
    };
  });
}

export function getTranslatedMessages(messages, lang) {
  if (lang !== "he") return messages;
  return messagesHe;
}

export function getTranslatedBadges(badges, lang) {
  if (lang !== "he") return badges;
  return badges.map(b => {
    const bt = badgesHe[b.id] || {};
    return {
      ...b,
      name: bt.name || b.name,
      desc: bt.desc || b.desc,
    };
  });
}
