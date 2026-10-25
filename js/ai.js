// Computer players. botAction() picks the next action for whoever's turn it is. Bots roll no dice
// of their own, so a bot game is an ordinary list of actions and replays like any other game.
//
// Two levels:
// - easy: greedy and short-sighted. Stacks all new armies on the front territory facing the best
//   target, attacks while it clearly outnumbers a neighbour, and moves its largest stack from behind
//   the lines to the most threatened front.
// - normal: picks a region to take and builds up next to it, guards the regions it holds, attacks
//   when the exact odds are good and the prize is worth it (finishing a region, breaking someone
//   else's, knocking a player out for their cards, the turn's card), and spreads armies by threat.

import * as G from './engine.js';
import { winChance } from './odds.js';

export const LEVELS = ['easy', 'normal'];

const enemies = (map, s, t) => G.attackTargets(map, s, t);
// How much of a region player p holds (0–1).
const share = (map, s, p, r) => map.regions[r].members.filter((t) => s.owner[t] === p).length / map.regions[r].members.length;
const regionOf = (map, t) => map.territories[t].region;
// Enemy armies that could attack t (each enemy territory keeps one army at home).
const pressure = (map, s, t) => enemies(map, s, t).reduce((n, e) => n + s.armies[e] - 1, 0);

export function botAction(map, rules, s, level = 'easy') {
  const p = s.current;
  const bot = BOTS[level] ?? BOTS.easy;
  if (s.phase === 'reinforce') return bot.reinforce(map, rules, s, p);
  if (s.phase === 'attack') return bot.attack(map, rules, s, p);
  if (s.phase === 'occupy') return bot.occupy(map, s);
  if (s.phase === 'fortify') return bot.fortify(map, rules, s, p);
  return null;
}

/* ---------- easy ---------- */

const EASY = {
  reinforce(map, rules, s, p) {
    if (s.players[p].stars && rules.luck !== 'cards') return { type: 'luck' };
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
  },

  attack(map, rules, s, p) {
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
  },

  // Everything moves forward when the old territory is now safe; half when both face enemies.
  occupy(map, s) {
    const { from, to } = s.occupy;
    const max = s.armies[from] - 1;
    if (!enemies(map, s, to).length) return { type: 'occupy', n: 0 };
    return { type: 'occupy', n: enemies(map, s, from).length ? Math.floor(max / 2) : max };
  },

  fortify(map, rules, s, p) {
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
  },
};

/* ---------- normal ---------- */

// The region worth going for: a good bonus for little fighting, and somewhere to attack it from.
// A region the bot's mission asks for counts three times as much (with "one more of your choice",
// every other region counts a bit more too).
function targetRegion(map, s, p) {
  const m = s.mode === 'mission' ? s.players[p].mission : null;
  const wanted = (i) => (m?.type !== 'regions' ? 1 : m.regions.includes(i) ? 3 : m.plusOne ? 1.5 : 1);
  let best = -1;
  let bestScore = -Infinity;
  map.regions.forEach((r, i) => {
    if (r.members.every((t) => s.owner[t] === p)) return;
    const theirs = r.members.filter((t) => s.owner[t] !== p);
    const reachable = theirs.some((t) => map.territories[t].adj.some((n) => s.owner[n] === p));
    if (!reachable) return;
    const cost = theirs.reduce((n, t) => n + s.armies[t], 0) + theirs.length;
    const score = ((r.bonus + 1) / cost + share(map, s, p, i) * 0.5) * wanted(i);
    if (score > bestScore) (bestScore = score), (best = i);
  });
  return best;
}

// Own territories on the edge of a region p holds completely, and how short they are of matching
// the enemies next to them.
function guardNeeds(map, s, p) {
  const needs = [];
  for (const r of map.regions) {
    if (!r.members.every((t) => s.owner[t] === p)) continue;
    for (const t of r.members) {
      const short = pressure(map, s, t) - s.armies[t] + 1;
      if (short > 0) needs.push({ t, short });
    }
  }
  return needs.sort((a, b) => b.short - a.short);
}

// Weights for the normal bot, kept together so experiments can change them. Chosen by bot games
// against easy bots on the large test map (1500 games per setting, seats rotated): with these the
// normal bot wins 1.27–1.43 times its fair share with 2–6 players. A lost stack costs a lot,
// because in games with more players a third player profits from every failed attack.
export const TUNING = {
  minChance: 0.45, // never blitz with worse odds than this
  cardPrize: 2, // the turn's first conquest earns a card
  lossCost: 4, // what a lost blitz costs, plus lossPerArmy for every army in the stack
  lossPerArmy: 0.4,
};

// What taking territory e is worth to p: a little always, more for the turn's card, for the
// target region, for finishing a region, breaking someone else's or knocking a player out.
function prize(map, s, p, e, target) {
  const q = s.owner[e];
  const r = regionOf(map, e);
  const members = map.regions[r].members;
  let value = 1;
  if (!s.conquered) value += TUNING.cardPrize;
  if (r === target) value += 2;
  if (members.every((m) => m === e || s.owner[m] === p)) value += 3 * map.regions[r].bonus;
  if (members.every((m) => s.owner[m] === q)) value += 2 * map.regions[r].bonus;
  if (G.owned(s, q).length === 1) value += 4 + 2 * s.players[q].cards.length;
  // A mission to knock out q: every territory of q is worth more, the last one most.
  const m = s.mode === 'mission' ? s.players[p].mission : null;
  if (m?.type === 'eliminate' && m.target === q) value += G.owned(s, q).length === 1 ? 20 : 3;
  if (m?.type === 'territories') value += 1;
  return value;
}

const NORMAL = {
  reinforce(map, rules, s, p) {
    const stars = s.players[p].stars;
    if (stars && rules.luck !== 'cards' && (stars >= G.STARS || G.owned(s, p).length <= 6)) return { type: 'luck' };
    const set = G.bestSet(map, s, p);
    if (set) return { type: 'trade', cards: set };
    if (!s.reserve) return { type: 'end' };

    // Guard held regions first, with at most half of the new armies.
    const [need] = guardNeeds(map, s, p);
    if (need && s.reserve > 1) return { type: 'place', t: need.t, n: Math.min(need.short, Math.ceil(s.reserve / 2)) };

    // Then put the rest where it gives the best attack: chance of taking a neighbour, with all the
    // new armies added, times what taking it is worth.
    const target = targetRegion(map, s, p);
    let best = -1;
    let bestScore = -Infinity;
    for (const t of G.owned(s, p)) {
      for (const e of enemies(map, s, t)) {
        const score = winChance(rules, s.armies[t] + s.reserve - 1, s.armies[e]) * prize(map, s, p, e, target);
        if (score > bestScore) (bestScore = score), (best = t);
      }
    }
    return { type: 'place', t: best, n: s.reserve };
  },

  attack(map, rules, s, p) {
    const target = targetRegion(map, s, p);
    let best = null;
    let bestScore = 0;
    for (const t of G.owned(s, p)) {
      if (s.armies[t] < 2) continue;
      for (const e of enemies(map, s, t)) {
        const chance = winChance(rules, s.armies[t] - 1, s.armies[e]);
        // A lost blitz costs the whole stack and leaves the territory open.
        const score = chance * prize(map, s, p, e, target) - (1 - chance) * (TUNING.lossCost + s.armies[t] * TUNING.lossPerArmy);
        if (chance >= TUNING.minChance && score > bestScore) (bestScore = score), (best = { type: 'blitz', from: t, to: e });
      }
    }
    return best ?? { type: 'end' };
  },

  // Split the armies by how much enemy strength each side faces, with a lean forward so the
  // attack can go on from the new territory.
  occupy(map, s) {
    const { from, to } = s.occupy;
    const max = s.armies[from] - 1;
    const back = pressure(map, s, from);
    const front = pressure(map, s, to) * 1.5 + (enemies(map, s, to).length ? 2 : 0);
    if (!front) return { type: 'occupy', n: 0 };
    if (!back) return { type: 'occupy', n: max };
    return { type: 'occupy', n: Math.round((max * front) / (front + back)) };
  },

  // Move spare armies to the territory that is most short of matching its neighbours: first from
  // behind the lines, otherwise the surplus of a quiet front.
  fortify(map, rules, s, p) {
    const mine = G.owned(s, p).filter((t) => s.armies[t] > 1);
    const spare = (t) => (enemies(map, s, t).length ? s.armies[t] - 1 - pressure(map, s, t) : s.armies[t] - 1);
    const sources = mine.filter((t) => spare(t) >= 2 || (!enemies(map, s, t).length && spare(t) >= 1)).sort((a, b) => spare(b) - spare(a));
    for (const from of sources) {
      let best = -1;
      let worst = 0;
      for (const to of G.fortifyTargets(map, rules, s, from)) {
        if (!enemies(map, s, to).length) continue;
        const short = pressure(map, s, to) - s.armies[to];
        if (short > worst || (best < 0 && !enemies(map, s, from).length)) (worst = short), (best = to);
      }
      if (best >= 0) return { type: 'fortify', from, to: best, n: Math.min(s.armies[from] - 1, spare(from)) };
    }
    return { type: 'end' };
  },
};

// By level. Exported so experiments can mix the parts of different bots.
export const BOTS = { easy: EASY, normal: NORMAL };

// Plays a game with bots in every seat (levels: one per seat, default easy). Returns the final
// state and the actions, which replay() turns back into the same game.
export function playBots(map, rules, setup, levels = [], maxActions = 20000) {
  let s = G.newGame(map, rules, setup);
  const actions = [];
  while (s.phase !== 'over' && actions.length < maxActions) {
    const a = botAction(map, rules, s, levels[s.current]);
    const r = G.apply(map, rules, s, a);
    if (!r.ok) throw new Error(`bot chose a bad action ${JSON.stringify(a)}: ${r.error}`);
    actions.push(a);
    s = r.state;
  }
  return { state: s, actions };
}
