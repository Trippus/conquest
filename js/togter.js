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
  { map: 'threekingdoms', opponents: 3, home: 'zy', goal: ['sh', 'jz', 'jd'], bonus: 0.8, art: 'assets/togter/threekingdoms.jpg' },
  { map: 'vikings', opponents: 2, home: 'dk', goal: ['dk', 'br', 'no'], bonus: 0.2, art: 'assets/togter/vikings.jpg' },
  { map: 'england', opponents: 3, home: 'nm', goal: ['wx', 'me', 'ea'], art: 'assets/togter/england.jpg' },
  { map: 'genghis', opponents: 3, home: 'mo', goal: ['xx', 'hb', 'tx'], bonus: 0.65, art: 'assets/togter/genghis.jpg' },
  { map: 'inka', opponents: 3, home: 'hd', goal: ['ch', 'co', 'cm'], bonus: 0.5, art: 'assets/togter/inka.jpg' },
  { map: 'constantinople', opponents: 3, home: 'an', goal: ['tr', 'gr', 'sr'], bonus: 0.5, art: 'assets/togter/constantinople.jpg' },
  { map: 'songhai', opponents: 3, home: 'so', goal: ['nb', 'nd'], plusOne: true, bonus: 0.6 },
  { map: 'akbar', opponents: 3, home: 'pj', goal: ['hi', 'rj', 'gu'], bonus: 0.6 },
  { map: 'japan', opponents: 3, home: 'to', goal: ['to', 'ks', 'ki'], bonus: 0.5 },
  { map: 'napoleon', opponents: 3, home: 'fr', goal: ['fr', 'os', 'pr'], bonus: 0.6 },
  { map: 'liberation', opponents: 3, home: 've', goal: ['ng', 'qu', 'pe'], bonus: 0.45, art: 'assets/togter/liberation.jpg' },
  { map: 'west', opponents: 3, home: 'mi', goal: ['tx', 'ca', 'or'], bonus: 0.3, art: 'assets/togter/west.jpg' },
  { map: 'ethiopia', opponents: 3, home: 'sh', goal: ['ti', 'kf', 'og'], bonus: 0.55 },
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

// The free game always has the world. Someone who played before there were togter keeps the maps
// there were then (1 November 2026); the maps that came with the togter are won like everyone else's.
const ALWAYS_FREE = ['world'];
const VETERAN_MAPS = ['italy', 'alexander', 'vikings', 'england', 'japan', 'napoleon', 'world'];

// What the player has done: welcomed (has seen the welcome), veteran (played before togter came),
// won: { map: level } (the hardest level won on), lost: { map: losses since the last win }.
export const newProgress = (veteran = false) => ({ welcomed: false, veteran, won: {}, lost: {} });

// A togt can be played once the one before it is won. A togt that came later and was put in before
// one already won is open too, so no one is locked out of what they had reached.
export const isOpen = (progress, i) => i === 0 || TOGTER.slice(i - 1).some((t) => progress.won[t.map]);

// The open togter not yet won. Togter added earlier in history than one already won are among them.
const ahead = (progress) => TOGTER.filter((t, i) => !progress.won[t.map] && isOpen(progress, i));
// The one togt that is next: the earliest of them.
export const upNext = (progress) => ahead(progress)[0] ?? null;
// After this togt: the first still to be won later in history, or else the earliest before it.
export const nextTogt = (progress, map) => {
  const here = TOGTER.findIndex((t) => t.map === map);
  const left = ahead(progress);
  return left.find((t) => TOGTER.indexOf(t) > here) ?? left[0] ?? null;
};

export const freeMaps = (progress, all) => all.filter((id) => (progress.veteran && VETERAN_MAPS.includes(id)) || ALWAYS_FREE.includes(id) || progress.won[id]);

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
