// Every map the game can be played on, in the order the setup shows them (oldest first, as in the
// togter, js/togter.js). A new map is added here and nowhere else; the app, the simulator and the
// map tools all read this list (docs/nyt-kort.md).
import { VIKINGS_GRID } from './vikings.js';
import { ENGLAND_GRID } from './england.js';
import { ITALY_GRID } from './italy.js';
import { ALEXANDER_GRID } from './alexander.js';
import { JAPAN_GRID } from './japan.js';
import { NAPOLEON_GRID } from './napoleon.js';
import { WORLD_GRID } from './world.js';

export const MAPS = { italy: ITALY_GRID, alexander: ALEXANDER_GRID, vikings: VIKINGS_GRID, england: ENGLAND_GRID, japan: JAPAN_GRID, napoleon: NAPOLEON_GRID, world: WORLD_GRID };

// A map's rules: the game's rules with the map's own changes (seat compensation, handicap for Let).
export const rulesFor = (grid, base) => ({ ...base, ...grid.RULES });

// A map with its names in another language. A map file gives them as NAMES: { en: { name,
// REGIONS: { id: name }, TERRITORIES: { id: name }, LANDMARKS: { name: name }, RULERS: [...] } },
// only the names that differ; the rest keep the map's own (Danish) names.
export function inLanguage(grid, lang) {
  const names = grid.NAMES?.[lang];
  if (!names) return grid;
  const rename = (list, own = {}) => Object.fromEntries(Object.entries(list).map(([id, x]) => [id, { ...x, name: own[id] ?? x.name }]));
  const name = names.name ?? grid.name;
  return {
    ...grid,
    name,
    MAP: { ...grid.MAP, name, regions: rename(grid.MAP.regions, names.REGIONS), territories: rename(grid.MAP.territories, names.TERRITORIES) },
    LANDMARKS: grid.LANDMARKS?.map(([x, y, n]) => [x, y, names.LANDMARKS?.[n] ?? n]),
    RULERS: names.RULERS ?? grid.RULERS,
  };
}
