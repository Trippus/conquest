// Every map the game can be played on, in the order the setup shows them. A new map is added here
// and nowhere else; the app, the simulator and the map tools all read this list (docs/nyt-kort.md).
import { VIKINGS_GRID } from './vikings.js';
import { ENGLAND_GRID } from './england.js';
import { WORLD_GRID } from './world.js';

export const MAPS = { vikings: VIKINGS_GRID, england: ENGLAND_GRID, world: WORLD_GRID };

// A map's rules: the game's rules with the map's own changes (seat compensation, handicap for Let).
export const rulesFor = (grid, base) => ({ ...base, ...grid.RULES });
