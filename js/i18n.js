// The languages the game speaks. Each has a table of every text the player sees (js/lang/*.js);
// the maps give their own names in other languages (NAMES in a map file, see js/maps/index.js).
// Danish is the game's first language: a text missing from a table is shown in Danish.

import { DA } from './lang/da.js';
import { EN } from './lang/en.js';

// Each language named in itself, for the choice in the settings.
export const LANGUAGES = { da: 'Dansk', en: 'English' };
const TABLES = { da: DA, en: EN };

// The saved choice, or else the browser's language: Danish for Danish, English for the rest.
export function pickLanguage(saved) {
  if (TABLES[saved]) return saved;
  const asked = (globalThis.navigator?.languages ?? [globalThis.navigator?.language ?? '']).map((l) => l.toLowerCase());
  return asked.some((l) => l === 'da' || l.startsWith('da-')) ? 'da' : 'en';
}

export const stringsFor = (lang) => ({ ...DA, ...TABLES[lang] });

// The page's own texts in index.html: data-t sets an element's text, data-html its markup and
// data-label its aria-label, each from the key it names.
export function translatePage(L, root = document) {
  root.documentElement.lang = L.lang;
  for (const el of root.querySelectorAll('[data-t]')) el.textContent = L[el.dataset.t];
  for (const el of root.querySelectorAll('[data-html]')) el.innerHTML = L[el.dataset.html];
  for (const el of root.querySelectorAll('[data-label]')) el.setAttribute('aria-label', L[el.dataset.label]);
}
