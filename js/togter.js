// Togter: the campaigns, history's great wars played one after another, oldest first. Winning one
// opens the next and puts its map into Frit spil (the free game). Plain data and rules, no DOM;
// js/app.js saves the progress and shows it. The texts (year, story, what really happened) are in
// the language tables (js/lang/*.js, togter).

// map: the map's id (js/maps/index.js); opponents: how many computer players; home: the region you
// start with, where history began; goal: the regions to hold, what history's winner took (plusOne:
// and any one more); bonus: the share of start armies you get extra; art: the togt's picture, behind
// the year card, small in the list and over the end of a won togt (assets/togter, see LICENSES.md); a
// togt without one shows its map (assets/maps). The opponents keep secret missions,
// so it is a race.
//
// Measured with npm run togt-balance (a hard bot for the player, 400 games): Let 91–100%, Normal
// 50–63%, Svær 19–42%. Svær is meant for players who beat Normal easily.
export const TOGTER = [
  { map: 'italy', opponents: 2, home: 'la', goal: ['la', 'sa', 'mg', 'um'], bonus: 0.5, art: 'assets/togter/italy.jpg' },
  { map: 'alexander', opponents: 2, home: 'hl', goal: ['la', 'me', 'pe'], art: 'assets/togter/alexander.jpg' },
  { map: 'vikings', opponents: 2, home: 'dk', goal: ['dk', 'br', 'no'], bonus: 0.2, art: 'assets/togter/vikings.jpg' },
  { map: 'england', opponents: 3, home: 'nm', goal: ['wx', 'me', 'ea'] },
  { map: 'japan', opponents: 3, home: 'to', goal: ['to', 'ks', 'ki'], bonus: 0.5 },
  { map: 'napoleon', opponents: 3, home: 'fr', goal: ['fr', 'os', 'pr'], bonus: 0.6 },
  { map: 'world', opponents: 3, goal: ['eu'], plusOne: true, bonus: 0.4 },
];

// A togt's start for a game on the prepared map: you (seat) get the home region's territories and
// the goal as your mission. As newGame's home and goals (js/engine.js).
export function togtStart(map, togt, seat, players) {
  const region = (id) => map.regions.findIndex((r) => r.id === id);
  const home = Array(players).fill(null);
  const goals = Array(players).fill(null);
  if (togt.home) home[seat] = [...map.regions[region(togt.home)].members];
  goals[seat] = { type: 'regions', regions: togt.goal.map(region), ...(togt.plusOne ? { plusOne: true } : {}) };
  return { home, goals };
}

// The free game always has the world. Someone who played before there were togter has every map.
const ALWAYS_FREE = ['world'];

// What the player has done: welcomed (has seen the welcome), veteran (played before togter came),
// won: { map: level } (the hardest level won on), lost: { map: losses since the last win }.
export const newProgress = (veteran = false) => ({ welcomed: false, veteran, won: {}, lost: {} });

// A togt can be played once the one before it is won.
export const isOpen = (progress, i) => i === 0 || !!progress.won[TOGTER[i - 1].map];

export const nextTogt = (map) => TOGTER[TOGTER.findIndex((t) => t.map === map) + 1] ?? null;

export const freeMaps = (progress, all) => all.filter((id) => progress.veteran || ALWAYS_FREE.includes(id) || progress.won[id]);

const RANK = { novice: 0, medium: 1, hard: 2 };

// A finished togt: a win keeps the hardest level won on and clears the losses; a loss counts.
export function record(progress, map, won, level) {
  const p = { ...progress, won: { ...progress.won }, lost: { ...progress.lost } };
  if (won) {
    if (!(RANK[p.won[map]] >= RANK[level])) p.won[map] = level;
    delete p.lost[map];
  } else p.lost[map] = (p.lost[map] ?? 0) + 1;
  return p;
}

// After two lost tries, the game offers the togt again with easy opponents.
export const offerEasy = (progress, map, level) => level !== 'novice' && (progress.lost[map] ?? 0) >= 2;
