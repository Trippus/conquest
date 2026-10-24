// Rules for Conquest. Pure functions, no DOM, so they run in the browser, in Node, in tests and
// later on a game server.
//
// A map is a graph: territories, which of them border each other (sea routes are just borders)
// and regions that give extra armies to whoever holds all of their territories. A ruleset holds
// the numbers (start armies, dice, card trades). Both are plain data, so a new era is a new map
// and ruleset, not new code.
//
// A turn has three phases. Reinforce: trade card sets and place new armies. Attack: roll dice
// against a neighbour; after a conquest, move armies in (the occupy step). Fortify: one move
// between two of your territories that are connected through your own land. Taking at least one
// territory in a turn earns a card at the end of it. Whoever holds every territory wins.
//
// A game is a setup (map, ruleset, players, seed) plus a list of actions. apply() checks an
// action and returns the next state and what happened (events for the UI to animate). The dice
// come from a seeded generator kept in the state, so replaying the same actions always gives the
// same game. That is what makes saving, replays and online play possible: a server keeps the
// state, applies the actions players send and shows each player only view(state, player).
//
// Territories, regions and players are numbers (indexes), so states are small and cheap to copy.

/* ---------- random ---------- */

// mulberry32. Its state lives in the game state (s.rng), so a saved game rolls the same dice.
export function random(s) {
  s.rng = (s.rng + 0x6d2b79f5) | 0;
  let t = s.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const die = (s) => 1 + Math.floor(random(s) * 6);
function shuffle(s, arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random(s) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ---------- maps ---------- */

// Lists what is wrong with a map definition (empty when it is fine): unknown regions or
// neighbours, borders that only go one way, empty regions, territories that cannot be reached.
export function validateMap(def) {
  const problems = [];
  const ids = Object.keys(def.territories);
  for (const [id, t] of Object.entries(def.territories)) {
    if (!def.regions[t.region]) problems.push(`${id}: unknown region ${t.region}`);
    for (const n of t.adj) {
      if (n === id) problems.push(`${id}: borders itself`);
      else if (!def.territories[n]) problems.push(`${id}: unknown neighbour ${n}`);
      else if (!def.territories[n].adj.includes(id)) problems.push(`${id}–${n}: border only goes one way`);
    }
  }
  for (const r of Object.keys(def.regions)) {
    if (!ids.some((id) => def.territories[id].region === r)) problems.push(`region ${r} is empty`);
  }
  if (ids.length) {
    const seen = new Set([ids[0]]);
    const queue = [ids[0]];
    while (queue.length) {
      for (const n of def.territories[queue.pop()].adj) {
        if (def.territories[n] && !seen.has(n)) seen.add(n), queue.push(n);
      }
    }
    const lost = ids.filter((id) => !seen.has(id));
    if (lost.length) problems.push(`cannot be reached: ${lost.join(', ')}`);
  }
  return problems;
}

// Turns a map definition (ids and names) into the form the engine uses (indexes).
export function prepareMap(def) {
  const problems = validateMap(def);
  if (problems.length) throw new Error(`Map ${def.id}: ${problems.join('; ')}`);
  const ids = Object.keys(def.territories);
  const rids = Object.keys(def.regions);
  const at = Object.fromEntries(ids.map((id, i) => [id, i]));
  const territories = ids.map((id) => {
    const t = def.territories[id];
    return { id, name: t.name, region: rids.indexOf(t.region), adj: t.adj.map((n) => at[n]), x: t.x, y: t.y };
  });
  const regions = rids.map((id, r) => ({
    id,
    name: def.regions[id].name,
    bonus: def.regions[id].bonus,
    members: territories.flatMap((t, i) => (t.region === r ? [i] : [])),
  }));
  return { id: def.id, name: def.name, territories, regions, at };
}

/* ---------- cards ---------- */

// The deck has one card per territory, with symbols 0, 1, 2 in turn, plus the ruleset's wild
// cards. A set is three of a kind or one of each; a wild card stands in for any symbol.
export const WILD = 3;
export const cardSymbol = (map, c) => (c < map.territories.length ? c % 3 : WILD);
export const cardTerritory = (map, c) => (c < map.territories.length ? c : -1);

export function isSet(map, cards) {
  if (cards.length !== 3 || new Set(cards).size !== 3) return false;
  const symbols = cards.map((c) => cardSymbol(map, c)).filter((x) => x !== WILD);
  const kinds = new Set(symbols).size;
  return symbols.length < 3 || kinds === 1 || kinds === 3;
}

// The first set in a hand, or null. Five cards always hold a set.
export function findSet(map, hand) {
  for (let i = 0; i < hand.length; i++) {
    for (let j = i + 1; j < hand.length; j++) {
      for (let k = j + 1; k < hand.length; k++) {
        const set = [hand[i], hand[j], hand[k]];
        if (isSet(map, set)) return set;
      }
    }
  }
  return null;
}

export const tradeValue = (rules, trades) => rules.tradeValues[Math.min(trades, rules.tradeValues.length - 1)];

/* ---------- questions about a state ---------- */

export const owned = (s, p) => s.owner.flatMap((o, t) => (o === p ? [t] : []));
// Extra start armies for each later seat (rules.laterSeatArmies: a number, or one per player count).
export const seatArmies = (rules, players) => {
  const extra = rules.laterSeatArmies ?? 0;
  return typeof extra === 'number' ? extra : extra[players] ?? 0;
};
export const startArmies = (rules, territories, players) => Math.ceil((territories * rules.startArmiesPerTerritory) / players);

// New armies at the start of p's turn: one per territoriesPerArmy territories (at least
// minReinforce), plus the bonus of every region p holds completely.
export function reinforcements(map, rules, s, p) {
  let n = Math.max(rules.minReinforce, Math.floor(owned(s, p).length / rules.territoriesPerArmy));
  for (const r of map.regions) if (r.members.every((t) => s.owner[t] === p)) n += r.bonus;
  return n;
}

// In the ruleset's peace rounds nobody attacks: the turn goes straight from reinforce to fortify.
export const peace = (rules, s) => s.round <= (rules.peaceRounds ?? 0);

export const attackTargets = (map, s, from) => map.territories[from].adj.filter((t) => s.owner[t] !== s.owner[from]);

// Where armies on `from` may move when fortifying.
export function fortifyTargets(map, rules, s, from) {
  const p = s.owner[from];
  if (rules.fortify === 'adjacent') return map.territories[from].adj.filter((t) => s.owner[t] === p);
  const seen = new Set([from]);
  const queue = [from];
  while (queue.length) {
    for (const t of map.territories[queue.pop()].adj) {
      if (s.owner[t] === p && !seen.has(t)) seen.add(t), queue.push(t);
    }
  }
  seen.delete(from);
  return [...seen];
}

/* ---------- a new game ---------- */

// players: names, in turn order. Territories are dealt at random (the last players get the spare
// ones, since the first player moves first), each gets one army, and the rest of every player's
// start armies are spread at random over their own territories. Moving first is an advantage, so
// each later player gets seatArmies() more armies than the one before.
export function newGame(map, rules, { players, seed = 1 }) {
  const n = players.length;
  if (n < 2 || n > 6) throw new Error('A game needs 2–6 players');
  const T = map.territories.length;
  const s = {
    rng: seed | 0,
    players: players.map((name) => ({ name, alive: true, cards: [] })),
    owner: Array(T).fill(-1),
    armies: Array(T).fill(0),
    current: 0,
    round: 1,
    phase: 'reinforce', // reinforce → attack (⇄ occupy) → fortify → next player; 'over' at the end
    reserve: 0, // armies left to place this turn
    conquered: false, // took a territory this turn, so a card is drawn at the end of it
    occupy: null, // { from, to } while armies may be moved into a conquered territory
    deck: [],
    discard: [],
    trades: 0, // card sets traded so far by anyone; sets the value of the next trade
    winner: -1,
  };
  shuffle(s, [...Array(T).keys()]).forEach((t, i) => {
    s.owner[t] = n - 1 - (i % n);
    s.armies[t] = 1;
  });
  const start = startArmies(rules, T, n);
  for (let p = 0; p < n; p++) {
    const own = owned(s, p);
    const mine = start + p * seatArmies(rules, n);
    for (let k = own.length; k < mine; k++) s.armies[own[Math.floor(random(s) * own.length)]]++;
  }
  s.deck = shuffle(s, [...Array(T + rules.wildCards).keys()]);
  s.reserve = reinforcements(map, rules, s, 0);
  return s;
}

/* ---------- actions ---------- */
// { type: 'trade', cards: [c, c, c] }       reinforce: swap a set for armies
// { type: 'place', t, n }                   reinforce: put n (default 1) new armies on t
// { type: 'attack', from, to, dice }        attack: one roll (dice defaults to as many as allowed)
// { type: 'blitz', from, to }               attack: roll until t is taken or from has 1 army left
// { type: 'occupy', n }                     occupy: move n more armies into the conquered territory
// { type: 'fortify', from, to, n }          fortify: move n armies; ends the turn
// { type: 'end' }                           end the current phase (in fortify: end the turn)
//
// Actions always belong to the player whose turn it is (s.current). A server checks who sent one.

// Why the action is not allowed right now, or null when it is.
export function check(map, rules, s, a) {
  const p = s.current;
  const T = map.territories.length;
  const mine = (t) => Number.isInteger(t) && t >= 0 && t < T && s.owner[t] === p;
  const within = (n, lo, hi) => Number.isInteger(n) && n >= lo && n <= hi;
  const hand = s.players[p].cards;
  if (s.phase === 'over') return 'the game is over';
  switch (a?.type) {
    case 'trade':
      if (s.phase !== 'reinforce') return 'cards are traded while reinforcing';
      if (!Array.isArray(a.cards) || !a.cards.every((c) => hand.includes(c))) return 'not your cards';
      if (!isSet(map, a.cards)) return 'not a set';
      return null;
    case 'place':
      if (s.phase !== 'reinforce') return 'armies are placed while reinforcing';
      if (hand.length >= rules.maxHand) return 'trade a card set first';
      if (!mine(a.t)) return 'not your territory';
      if (!within(a.n ?? 1, 1, s.reserve)) return 'not that many armies to place';
      return null;
    case 'attack':
    case 'blitz':
      if (s.phase !== 'attack') return 'not attacking now';
      if (peace(rules, s)) return 'no attacks in the first rounds';
      if (!mine(a.from)) return 'attack from your own territory';
      if (!map.territories[a.from].adj.includes(a.to)) return 'not a neighbour';
      if (s.owner[a.to] === p) return 'that territory is yours';
      if (s.armies[a.from] < 2) return 'an attack needs at least 2 armies';
      if (a.type === 'attack' && a.dice !== undefined && !within(a.dice, 1, rules.attackDice)) return 'wrong number of dice';
      return null;
    case 'occupy':
      if (s.phase !== 'occupy') return 'nothing to move into';
      if (!within(a.n, 0, s.armies[s.occupy.from] - 1)) return 'cannot move that many';
      return null;
    case 'fortify':
      if (s.phase !== 'fortify') return 'not fortifying now';
      if (!mine(a.from) || !mine(a.to) || a.from === a.to) return 'move between two of your territories';
      if (!within(a.n, 1, s.armies[a.from] - 1)) return 'cannot move that many';
      if (!fortifyTargets(map, rules, s, a.from).includes(a.to)) return 'not connected';
      return null;
    case 'end':
      if (s.phase === 'occupy') return 'move armies in first';
      if (s.phase === 'reinforce' && hand.length >= rules.maxHand) return 'trade a card set first';
      if (s.phase === 'reinforce' && s.reserve > 0) return 'place all armies first';
      return null;
    default:
      return 'unknown action';
  }
}

// { ok: true, state, events } with a new state (the old one is untouched), or { ok: false, error }.
export function apply(map, rules, state, action) {
  const error = check(map, rules, state, action);
  if (error) return { ok: false, error };
  const s = structuredClone(state);
  const events = [];
  DO[action.type](map, rules, s, action, events);
  return { ok: true, state: s, events };
}

// Plays a whole game from its setup and actions. Throws at the first action that is not allowed.
export function replay(map, rules, setup, actions) {
  let s = newGame(map, rules, setup);
  actions.forEach((a, i) => {
    const r = apply(map, rules, s, a);
    if (!r.ok) throw new Error(`action ${i} (${a.type}): ${r.error}`);
    s = r.state;
  });
  return s;
}

// What player p may see: other players' cards, the deck order and the dice generator are hidden.
export function view(state, p) {
  const s = structuredClone(state);
  s.players.forEach((pl, i) => i !== p && (pl.cards = pl.cards.map(() => null)));
  s.deck = s.deck.map(() => null);
  s.rng = 0;
  return s;
}

const DO = {
  trade(map, rules, s, a, ev) {
    const p = s.current;
    const armies = tradeValue(rules, s.trades++);
    s.players[p].cards = s.players[p].cards.filter((c) => !a.cards.includes(c));
    s.discard.push(...a.cards);
    s.reserve += armies;
    const bonus = a.cards.map((c) => cardTerritory(map, c)).find((t) => t >= 0 && s.owner[t] === p) ?? -1;
    if (bonus >= 0) s.armies[bonus] += rules.tradeTerritoryBonus;
    ev.push({ type: 'trade', p, cards: a.cards, armies, bonus });
  },
  place(map, rules, s, a, ev) {
    const n = a.n ?? 1;
    s.armies[a.t] += n;
    s.reserve -= n;
    ev.push({ type: 'place', p: s.current, t: a.t, n });
  },
  attack(map, rules, s, a, ev) {
    roll(map, rules, s, a.from, a.to, a.dice ?? rules.attackDice, ev);
  },
  blitz(map, rules, s, a, ev) {
    while (s.armies[a.from] > 1 && s.owner[a.to] !== s.current) roll(map, rules, s, a.from, a.to, rules.attackDice, ev);
  },
  occupy(map, rules, s, a, ev) {
    const { from, to } = s.occupy;
    s.armies[from] -= a.n;
    s.armies[to] += a.n;
    s.occupy = null;
    s.phase = 'attack';
    ev.push({ type: 'move', p: s.current, from, to, n: a.n });
  },
  fortify(map, rules, s, a, ev) {
    s.armies[a.from] -= a.n;
    s.armies[a.to] += a.n;
    ev.push({ type: 'move', p: s.current, from: a.from, to: a.to, n: a.n });
    endTurn(map, rules, s, ev);
  },
  end(map, rules, s, a, ev) {
    if (s.phase === 'reinforce') s.phase = peace(rules, s) ? 'fortify' : 'attack';
    else if (s.phase === 'attack') s.phase = 'fortify';
    else return endTurn(map, rules, s, ev);
    ev.push({ type: 'phase', p: s.current, phase: s.phase });
  },
};

// One roll. Highest dice are compared pair by pair; the defender wins ties. A conquest moves the
// attacking dice's armies in at once (they cannot have been lost: the defender lost every pair).
function roll(map, rules, s, from, to, dice, ev) {
  const p = s.current;
  const q = s.owner[to];
  const na = Math.min(dice, s.armies[from] - 1);
  const nd = Math.min(rules.defendDice, s.armies[to]);
  const a = Array.from({ length: na }, () => die(s)).sort((x, y) => y - x);
  const d = Array.from({ length: nd }, () => die(s)).sort((x, y) => y - x);
  let lostA = 0;
  let lostD = 0;
  for (let i = 0; i < Math.min(na, nd); i++) a[i] > d[i] ? lostD++ : lostA++;
  s.armies[from] -= lostA;
  s.armies[to] -= lostD;
  ev.push({ type: 'roll', p, from, to, a, d, lostA, lostD });
  if (s.armies[to] > 0) return;

  s.owner[to] = p;
  s.armies[to] = na;
  s.armies[from] -= na;
  s.conquered = true;
  ev.push({ type: 'conquer', p, from, to, loser: q });
  if (!s.owner.includes(q)) {
    s.players[q].alive = false;
    s.players[p].cards.push(...s.players[q].cards);
    s.players[q].cards = [];
    ev.push({ type: 'eliminate', p: q, by: p });
  }
  if (s.owner.every((o) => o === p)) return finish(s, p, ev);
  if (s.armies[from] > 1) {
    s.phase = 'occupy';
    s.occupy = { from, to };
  }
}

// Draws the earned card, passes the turn to the next living player and gives them their armies.
// With a round limit, the game ends after the last round: most territories wins, then most armies.
function endTurn(map, rules, s, ev) {
  const p = s.current;
  if (s.conquered) {
    if (!s.deck.length) s.deck = shuffle(s, s.discard.splice(0));
    if (s.deck.length) {
      const card = s.deck.pop();
      s.players[p].cards.push(card);
      ev.push({ type: 'card', p, card });
    }
  }
  let q = p;
  do q = (q + 1) % s.players.length;
  while (!s.players[q].alive);
  if (q <= p) {
    s.round++;
    if (rules.maxRounds && s.round > rules.maxRounds) return finish(s, leader(s), ev);
  }
  s.current = q;
  s.phase = 'reinforce';
  s.conquered = false;
  s.reserve = reinforcements(map, rules, s, q);
  ev.push({ type: 'turn', p: q, round: s.round, reserve: s.reserve });
}

function leader(s) {
  const score = (p) => owned(s, p).length * 10000 + owned(s, p).reduce((n, t) => n + s.armies[t], 0);
  return s.players.reduce((best, pl, p) => (pl.alive && score(p) > score(best) ? p : best), s.current);
}

function finish(s, p, ev) {
  s.phase = 'over';
  s.winner = p;
  s.occupy = null;
  ev.push({ type: 'win', p });
}
