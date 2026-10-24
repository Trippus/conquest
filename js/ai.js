// Computer players. botAction() picks the next action for whoever's turn it is. Bots roll no dice
// of their own, so a bot game is an ordinary list of actions and replays like any other game.
//
// This is the "easy" bot: greedy and short-sighted. It trades cards as soon as it can, stacks all
// new armies on the front territory facing the best target, attacks while it clearly outnumbers a
// neighbour, and in fortify moves its largest stack from behind the lines to the most threatened
// front.

import * as G from './engine.js';

const enemies = (map, s, t) => G.attackTargets(map, s, t);
// How much of a region player p holds (0–1).
const share = (map, s, p, r) => map.regions[r].members.filter((t) => s.owner[t] === p).length / map.regions[r].members.length;
const regionOf = (map, t) => map.territories[t].region;

export function botAction(map, rules, s) {
  const p = s.current;
  if (s.phase === 'reinforce') return reinforce(map, rules, s, p);
  if (s.phase === 'attack') return attack(map, rules, s, p);
  if (s.phase === 'occupy') return occupy(map, s);
  if (s.phase === 'fortify') return fortify(map, rules, s, p);
  return null;
}

function reinforce(map, rules, s, p) {
  const set = G.findSet(map, s.players[p].cards);
  if (set) return { type: 'trade', cards: set };
  if (!s.reserve) return { type: 'end' };
  let best = -1;
  let bestScore = -Infinity;
  for (const t of G.owned(s, p)) {
    for (const e of enemies(map, s, t)) {
      const score = share(map, s, p, regionOf(map, e)) * 4 - s.armies[e] * 0.5 + s.armies[t] * 0.1;
      if (score > bestScore) (bestScore = score), (best = t);
    }
  }
  return { type: 'place', t: best, n: s.reserve };
}

function attack(map, rules, s, p) {
  let best = null;
  let bestScore = -Infinity;
  for (const t of G.owned(s, p)) {
    if (s.armies[t] < 3) continue;
    for (const e of enemies(map, s, t)) {
      const margin = s.armies[t] - s.armies[e];
      if (margin < 2) continue;
      const score = margin + share(map, s, p, regionOf(map, e)) * 3;
      if (score > bestScore) (bestScore = score), (best = { type: 'blitz', from: t, to: e });
    }
  }
  return best ?? { type: 'end' };
}

// Everything moves forward when the old territory is now safe; half when both face enemies.
function occupy(map, s) {
  const { from, to } = s.occupy;
  const max = s.armies[from] - 1;
  if (!enemies(map, s, to).length) return { type: 'occupy', n: 0 };
  return { type: 'occupy', n: enemies(map, s, from).length ? Math.floor(max / 2) : max };
}

function fortify(map, rules, s, p) {
  const inner = G.owned(s, p)
    .filter((t) => s.armies[t] > 1 && !enemies(map, s, t).length)
    .sort((a, b) => s.armies[b] - s.armies[a]);
  for (const from of inner) {
    let best = -1;
    let worst = -Infinity;
    for (const to of G.fortifyTargets(map, rules, s, from)) {
      const near = enemies(map, s, to);
      if (!near.length) continue;
      const threat = near.reduce((n, e) => n + s.armies[e], 0) - s.armies[to];
      if (threat > worst) (worst = threat), (best = to);
    }
    if (best >= 0) return { type: 'fortify', from, to: best, n: s.armies[from] - 1 };
  }
  return { type: 'end' };
}

// Plays a game with bots in every seat. Returns the final state and the actions, which replay()
// turns back into the same game.
export function playBots(map, rules, setup, maxActions = 20000) {
  let s = G.newGame(map, rules, setup);
  const actions = [];
  while (s.phase !== 'over' && actions.length < maxActions) {
    const a = botAction(map, rules, s);
    const r = G.apply(map, rules, s, a);
    if (!r.ok) throw new Error(`bot chose a bad action ${JSON.stringify(a)}: ${r.error}`);
    actions.push(a);
    s = r.state;
  }
  return { state: s, actions };
}
