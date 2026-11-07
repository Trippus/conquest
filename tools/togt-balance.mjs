// Measures the togter (js/togter.js): how often a player who knows the game reaches the togt's goal,
// starting at home, against the togt's opponents on each level. A hard bot stands in for the player,
// since it plays for its mission as a player plays for the goal. The opponents get the same start
// armies as in the app (Let's are in the togt's easy, more on Svær) and secret missions.
//
// Aim (a campaign should be won more often than a free game): Let 85%+, Normal 50–65%, Svær
// 20–45%. Tune with the togt's goal, opponents, bonus or easy (js/togter.js).
//
// Run: npm run togt-balance -- [map] [games=300] [level=novice] [handicap=0.1] [goal=la,sa,mg] [plus=1] [opp=2]
//   level: only this level; handicap: another share of start armies the player goes without
//   (negative: gets more); goal, plus and opp: another goal, "and one more", or number of opponents.
//   None of it changes a file.
import * as G from '../js/engine.js';
import { playBots } from '../js/ai.js';
import { MAPS, rulesFor } from '../js/maps/index.js';
import { MODERN } from '../js/rules/modern.js';
import { TOGTER, togtArmies, togtStart } from '../js/togter.js';

const args = process.argv.slice(2);
const only = args.find((a) => MAPS[a]);
const opts = Object.fromEntries(args.filter((a) => !MAPS[a]).map((a) => (a.includes('=') ? a.split('=') : ['games', a])));
const games = Number(opts.games ?? 300);
const pct = (x) => `${Math.round(100 * x)}%`;

for (const listed of TOGTER.filter((t) => !only || t.map === only)) {
  const togt = { ...listed };
  if (opts.goal) togt.goal = opts.goal.split(',');
  if (opts.plus) togt.plusOne = opts.plus === '1';
  if (opts.opp) togt.opponents = Number(opts.opp);
  const grid = MAPS[togt.map];
  const rules = { ...rulesFor(grid, MODERN), maxRounds: 150 };
  const map = G.prepareMap(grid.MAP);
  const n = togt.opponents + 1;
  const start = G.startArmies(rules, map.territories.length, n);
  const row = [];
  for (const level of opts.level ? [opts.level] : ['novice', 'medium', 'hard']) {
    const { bonus, novice, guard } = togtArmies(togt, level, rules.noviceHandicap);
    const mine = opts.handicap ? -Number(opts.handicap) : bonus;
    let wins = 0;
    let rounds = 0;
    for (let g = 0; g < games; g++) {
      const seat = g % n;
      const levels = Array(n).fill(level);
      levels[seat] = 'hard';
      const extra = { novice: -novice, hard: rules.hardBonus };
      const handicap = levels.map((l, p) => Math.round(start * (p === seat ? mine : extra[l] ?? 0)));
      const setup = { players: [...'ABCDEF'].slice(0, n), seed: 4000 + g, mode: 'mission', handicap, ...togtStart(map, togt, seat, n, guard) };
      const r = playBots(map, rules, setup, levels);
      if (r.state.winner === seat) wins++;
      rounds += r.state.round;
    }
    row.push(`${level.padEnd(6)} ${pct(wins / games).padStart(4)} (${(rounds / games).toFixed(1)} rounds)`);
  }
  console.log(`${grid.name.padEnd(26)} ${row.join('   ')}`);
}
