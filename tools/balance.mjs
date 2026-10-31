// Measures a map's balance with bot games, the three checks every new map gets (docs/nyt-kort.md):
//
//   1. Seats: with 2, 3 and 4 hard bots, does every seat win about its fair share? If the first
//      seats win too often, raise RULES.laterSeatArmies for that player count, and the other way.
//   2. Missions: how often each mission wins with 3 and 4 players. Aim for 15–40%.
//   3. Let: how often a medium bot, standing in for a player who knows the game, beats two and three
//      easy (novice) bots. Aim for about 90%+ and 75–82%; tune RULES.noviceHandicap.
//
// Run: npm run balance -- <map> [games=600] [seats=2:7,3:2,4:1] [handicap=0.35]
//   seats and handicap try other values than the map's RULES without changing the file.
import * as G from '../js/engine.js';
import { playBots } from '../js/ai.js';
import { MAPS, rulesFor } from '../js/maps/index.js';
import { MODERN } from '../js/rules/modern.js';

const [id, ...rest] = process.argv.slice(2);
const grid = MAPS[id];
if (!grid) {
  console.error(`map: one of ${Object.keys(MAPS).join(', ')}`);
  process.exit(1);
}
const opts = Object.fromEntries(rest.map((a) => (a.includes('=') ? a.split('=') : ['games', a])));
const games = Number(opts.games ?? 600);
const rules = { ...rulesFor(grid, MODERN), maxRounds: 150 };
if (opts.seats) rules.laterSeatArmies = { ...rules.laterSeatArmies, ...Object.fromEntries(opts.seats.split(',').map((p) => p.split(':').map(Number))) };
if (opts.handicap) rules.noviceHandicap = Number(opts.handicap);
const map = G.prepareMap(grid.MAP);
const names = [...'ABCDEF'];
const pct = (x, of) => `${Math.round((100 * x) / of)}%`;

console.log(`${grid.name}, ${games} games each. Seat compensation ${JSON.stringify(rules.laterSeatArmies)}, Let handicap ${rules.noviceHandicap}\n`);

console.log('1. Seats (hard bots, missions): wins per seat');
for (const n of [2, 3, 4]) {
  const wins = Array(n).fill(0);
  let rounds = 0;
  for (let g = 0; g < games; g++) {
    const r = playBots(map, rules, { players: names.slice(0, n), seed: 7000 + g, mode: 'mission' }, Array(n).fill('hard'));
    wins[r.state.winner]++;
    rounds += r.state.round;
  }
  const off = wins.some((w) => Math.abs(w / games - 1 / n) > 0.06);
  console.log(`   ${n} players: ${wins.map((w) => pct(w, games)).join(' ')}   (fair ${pct(1, n)}, ${(rounds / games).toFixed(1)} rounds)${off ? '   ← uneven' : ''}`);
}

console.log('\n2. Missions (hard bots): how often each wins when dealt');
const label = (m) =>
  m.type === 'regions'
    ? m.regions.map((r) => map.regions[r].name).join('+') + (m.plusOne ? '+1' : '')
    : m.type === 'territories'
      ? `hold ${m.count}${m.armies > 1 ? ' with 2' : ''}`
      : 'knock out';
for (const n of [3, 4]) {
  const dealt = {};
  const won = {};
  for (let g = 0; g < games; g++) {
    const setup = { players: names.slice(0, n), seed: 9000 + g, mode: 'mission' };
    const first = G.newGame(map, rules, setup);
    first.players.forEach((p) => (dealt[label(p.mission)] = (dealt[label(p.mission)] ?? 0) + 1));
    const r = playBots(map, rules, setup, Array(n).fill('hard'));
    if (r.state.won === 'mission') {
      const k = label(first.players[r.state.winner].mission);
      won[k] = (won[k] ?? 0) + 1;
    }
  }
  console.log(`   ${n} players (fair ${pct(1, n)}):`);
  for (const k of Object.keys(dealt).sort()) {
    const rate = (won[k] ?? 0) / dealt[k];
    console.log(`     ${k.padEnd(36)} ${pct(won[k] ?? 0, dealt[k]).padStart(4)}${rate < 0.12 || rate > 0.45 ? '   ← out of range' : ''}`);
  }
}

console.log('\n3. Let: a medium bot against easy ones');
for (const n of [3, 4]) {
  const start = G.startArmies(rules, map.territories.length, n);
  let wins = 0;
  for (let g = 0; g < games; g++) {
    const levels = Array(n).fill('novice');
    const seat = g % n;
    levels[seat] = 'medium';
    const handicap = levels.map((l) => (l === 'novice' ? -Math.round(start * rules.noviceHandicap) : 0));
    if (playBots(map, rules, { players: names.slice(0, n), seed: 3000 + g, mode: 'mission', handicap }, levels).state.winner === seat) wins++;
  }
  const aim = n === 3 ? [0.9, 1] : [0.75, 0.82];
  const rate = wins / games;
  console.log(`   against ${n - 1}: ${pct(wins, games)}   (aim ${pct(aim[0], 1)}${n === 3 ? '+' : `–${pct(aim[1], 1)}`})${rate < aim[0] - 0.03 ? '   ← too hard' : n === 4 && rate > aim[1] + 0.05 ? '   ← too easy' : ''}`);
}
