// Plays many bot games and prints how they went: wins per seat and per bot, length, round-limit
// endings. Used for balance (a seat or region that wins far too often shows up here) and to check
// that a stronger bot really is stronger.
//
// Run: npm run sim -- [games=200] [bots=medium,medium,medium,medium] [map=test|large|world] [mode=world|mission]
//   npm run sim -- 400 hard,medium,medium,medium large   one hard bot against three medium ones, 30 territories
// The bots move one seat on each game, so no bot always gets the first move.
import * as G from '../js/engine.js';
import { playBots, LEVELS } from '../js/ai.js';
import { TEST_MAP } from '../js/maps/test.js';
import { TEST_LARGE } from '../js/maps/test-large.js';
import { WORLD } from '../js/maps/world.js';
import { MODERN } from '../js/rules/modern.js';

const games = +(process.argv[2] ?? 200);
const bots = (process.argv[3] ?? 'medium,medium,medium,medium').split(',');
if (bots.length < 2 || bots.some((b) => !LEVELS.includes(b))) {
  console.error(`bots: 2–6 of ${LEVELS.join(', ')}, separated by commas`);
  process.exit(1);
}
const n = bots.length;
const MAPS = { test: TEST_MAP, large: TEST_LARGE, world: WORLD };
const map = G.prepareMap(MAPS[process.argv[4] ?? 'test']);
const rules = { ...MODERN, maxRounds: 150 };

const seatWins = Array(n).fill(0);
const botWins = Array(n).fill(0); // by bot (its place in the list), whatever seat it had
let rounds = 0;
let actions = 0;
let limited = 0;
const hows = {};
const started = Date.now();
for (let g = 0; g < games; g++) {
  const seatOf = (b) => (b + g) % n;
  const levels = Array(n);
  bots.forEach((level, b) => (levels[seatOf(b)] = level));
  const r = playBots(map, rules, { players: [...'ABCDEF'].slice(0, n), seed: g + 1, mode: process.argv[5] ?? 'world' }, levels);
  seatWins[r.state.winner]++;
  botWins[bots.findIndex((_, b) => seatOf(b) === r.state.winner)]++;
  rounds += r.state.round;
  actions += r.actions.length;
  if (r.state.won === 'rounds') limited++;
  hows[r.state.won] = (hows[r.state.won] ?? 0) + 1;
}
const pct = (x) => `${((100 * x) / games).toFixed(0)}%`;
console.log(`${games} games, ${n} players on ${map.name} (${Date.now() - started} ms)`);
console.log(`wins per bot:  ${bots.map((b, i) => `${b}: ${pct(botWins[i])}`).join('  ')}  (fair share ${pct(games / n)})`);
console.log(`wins per seat: ${seatWins.map((w, p) => `${p + 1}: ${pct(w)}`).join('  ')}`);
console.log(`average: ${(rounds / games).toFixed(1)} rounds, ${(actions / games).toFixed(0)} actions`);
console.log(`ended by the round limit: ${pct(limited)}`);
console.log(`won by: ${Object.entries(hows).map(([h, k]) => `${h} ${pct(k)}`).join('  ')}`);
