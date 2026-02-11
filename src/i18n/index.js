import en from './en.js';
import he from './he.js';

const translations = { en, he };

export function t(lang, key) {
  return translations[lang]?.[key] || translations.en[key] || key;
}

export function isRTL(lang) {
  return lang === "he";
}
