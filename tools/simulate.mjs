// Plays many bot games and prints how they went: wins per seat, length, round-limit endings.
// Used for balance: a seat or region that wins far too often shows up here.
// Run: npm run sim -- [games=200] [players=4]
import * as G from '../js/engine.js';
import { playBots } from '../js/ai.js';
import { TEST_MAP } from '../js/maps/test.js';
import { MODERN } from '../js/rules/modern.js';

const games = +(process.argv[2] ?? 200);
const players = +(process.argv[3] ?? 4);
const map = G.prepareMap(TEST_MAP);
const rules = { ...MODERN, maxRounds: 100 };

const wins = Array(players).fill(0);
let rounds = 0;
let actions = 0;
let limited = 0;
const started = Date.now();
for (let seed = 1; seed <= games; seed++) {
  const r = playBots(map, rules, { players: [...'ABCDEF'].slice(0, players), seed });
  wins[r.state.winner]++;
  rounds += r.state.round;
  actions += r.actions.length;
  if (!r.state.owner.every((o) => o === r.state.winner)) limited++;
}
const pct = (n) => `${((100 * n) / games).toFixed(0)}%`;
console.log(`${games} games, ${players} players on ${map.name} (${Date.now() - started} ms)`);
console.log(`wins per seat: ${wins.map((w, p) => `${p + 1}: ${pct(w)}`).join('  ')}`);
console.log(`average: ${(rounds / games).toFixed(1)} rounds, ${(actions / games).toFixed(0)} actions`);
console.log(`ended by the round limit: ${pct(limited)}`);
