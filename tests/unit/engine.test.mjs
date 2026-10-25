// Unit tests for the rules in js/engine.js. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import { TEST_MAP } from '../../js/maps/test.js';
import { MODERN } from '../../js/rules/modern.js';

const map = G.prepareMap(TEST_MAP);
const CARDS = { ...MODERN, luck: 'cards' }; // the classic cards instead of war-luck stars
const at = (id) => map.at[id];

// A game whose board is set by hand: owners written as a string in map order
// (n1 n2 n3 e1 e2 e3 s1 s2 s3 w1 w2 w3), armies as a list, then whatever else the test needs.
function board(owners, armies, extra = {}, rules = MODERN) {
  const s = G.newGame(map, rules, { players: ['A', 'B', 'C'].slice(0, Math.max(...owners) + 1), seed: 7 });
  s.owner = [...owners].map(Number);
  s.armies = armies;
  s.reserve = G.reinforcements(map, rules, s, 0);
  return Object.assign(s, extra);
}
// Applies actions and fails if one is not allowed. Returns the last state and all events.
function play(s, actions, rules = MODERN) {
  const events = [];
  for (const a of actions) {
    const r = G.apply(map, rules, s, a);
    assert.ok(r.ok, `${JSON.stringify(a)}: ${r.error}`);
    s = r.state;
    events.push(...r.events);
  }
  return { s, events };
}
const refuse = (s, a, rules = MODERN) => G.apply(map, rules, s, a).error;

test('the test map is valid', () => {
  assert.deepEqual(G.validateMap(TEST_MAP), []);
  assert.equal(map.territories.length, 12);
  assert.deepEqual(map.regions.map((r) => r.members.length), [3, 3, 3, 3]);
});

test('validateMap finds one-way borders, unknown names and unreachable territories', () => {
  const bad = {
    id: 'bad',
    regions: { r: { name: 'R', bonus: 1 }, empty: { name: 'E', bonus: 1 } },
    territories: {
      a: { region: 'r', adj: ['b'] },
      b: { region: 'r', adj: ['x'] },
      c: { region: 'nowhere', adj: [] },
    },
  };
  const problems = G.validateMap(bad).join('\n');
  assert.match(problems, /a–b: border only goes one way/);
  assert.match(problems, /unknown neighbour x/);
  assert.match(problems, /unknown region nowhere/);
  assert.match(problems, /region empty is empty/);
  assert.match(problems, /cannot be reached: c/);
  assert.throws(() => G.prepareMap(bad));
});

test('a new game deals every territory and the right number of armies', () => {
  for (const n of [2, 3, 4]) {
    const players = ['A', 'B', 'C', 'D'].slice(0, n);
    const s = G.newGame(map, MODERN, { players, seed: 3 });
    assert.ok(s.owner.every((o) => o >= 0 && o < n));
    assert.ok(s.armies.every((a) => a >= 1));
    const start = G.startArmies(MODERN, 12, n);
    for (let p = 0; p < n; p++) {
      assert.equal(G.owned(s, p).reduce((sum, t) => sum + s.armies[t], 0), start + p * G.seatArmies(MODERN, n));
    }
    assert.equal(s.deck.length, 12 + MODERN.wildCards);
    assert.equal(s.phase, 'reinforce');
  }
  assert.throws(() => G.newGame(map, MODERN, { players: ['A'] }));
});

test('later seats start with more armies, by number of players', () => {
  const total = (s, p) => G.owned(s, p).reduce((sum, t) => sum + s.armies[t], 0);
  const two = G.newGame(map, MODERN, { players: ['A', 'B'], seed: 4 });
  assert.equal(total(two, 1) - total(two, 0), MODERN.laterSeatArmies[2]);
  const flat = { ...MODERN, laterSeatArmies: 2 };
  const three = G.newGame(map, flat, { players: ['A', 'B', 'C'], seed: 4 });
  assert.deepEqual([1, 2].map((p) => total(three, p) - total(three, 0)), [2, 4]);
  const none = { ...MODERN, laterSeatArmies: 0 };
  const even = G.newGame(map, none, { players: ['A', 'B'], seed: 4 });
  assert.equal(total(even, 0), total(even, 1));
});

test('in peace rounds the turn skips the attack phase', () => {
  const rules = { ...MODERN, peaceRounds: 1 };
  const s = board('000111000111', Array(12).fill(2), { reserve: 0 }, rules);
  assert.equal(refuse({ ...s, phase: 'attack' }, { type: 'attack', from: 0, to: at('w3') }, rules), 'no attacks in the first rounds');
  const { s: t } = play(s, [{ type: 'end' }], rules);
  assert.equal(t.phase, 'fortify');
  const later = play({ ...s, round: 2 }, [{ type: 'end' }], rules).s;
  assert.equal(later.phase, 'attack');
});

test('the same seed gives the same game, another seed another', () => {
  const a = G.newGame(map, MODERN, { players: ['A', 'B'], seed: 42 });
  assert.deepEqual(G.newGame(map, MODERN, { players: ['A', 'B'], seed: 42 }), a);
  assert.notDeepEqual(G.newGame(map, MODERN, { players: ['A', 'B'], seed: 43 }), a);
});

test('reinforcements: at least 3, one per 3 territories, plus held regions', () => {
  // A holds North (bonus 3) and 9 territories in all; B holds West.
  const s = board('000000000111', Array(12).fill(1));
  assert.equal(G.reinforcements(map, MODERN, s, 0), 3 + 3 + 2 + 3);
  assert.equal(G.reinforcements(map, MODERN, s, 1), 3 + 2);
  // Nothing whole and few territories still gives 3.
  const t = board('010101010101', Array(12).fill(1));
  assert.equal(G.reinforcements(map, MODERN, t, 0), 3);
});

test('card sets: three alike, one of each, or with a wild card', () => {
  // Card c is territory c with symbol c % 3; 12 and 13 are wild.
  assert.ok(G.isSet(map, [0, 3, 6]));
  assert.ok(G.isSet(map, [0, 1, 2]));
  assert.ok(!G.isSet(map, [0, 3, 1]));
  assert.ok(G.isSet(map, [0, 3, 12]));
  assert.ok(G.isSet(map, [12, 13, 5]));
  assert.ok(!G.isSet(map, [0, 0, 3]));
  assert.deepEqual(G.findSet(map, [0, 3, 1, 4]), null);
  assert.ok(G.findSet(map, [0, 3, 1, 4, 7]));
});

test('trade values rise and then stay at the cap', () => {
  assert.deepEqual([0, 1, 2, 5, 6, 20].map((n) => G.tradeValue(MODERN, n)), [4, 6, 8, 15, 15, 15]);
});

test('trading a set gives armies, and 2 more on a traded territory you hold', () => {
  const s = board('000111000111', Array(12).fill(1), {}, CARDS);
  s.players[0].cards = [0, 3, 6, 1]; // n1, e1 (not A's), s1 (A's), all symbol 0
  const reserve = s.reserve;
  const { s: t, events } = play(s, [{ type: 'trade', cards: [0, 3, 6] }], CARDS);
  assert.equal(t.reserve, reserve + 4);
  assert.equal(t.armies[at('n1')], 3);
  assert.deepEqual(t.players[0].cards, [1]);
  assert.equal(t.trades, 1);
  assert.equal(events[0].bonus, at('n1'));
  assert.equal(refuse(t, { type: 'trade', cards: [0, 3, 6] }, CARDS), 'not your cards');
  assert.equal(refuse(s, { type: 'trade', cards: [0, 3, 6] }), 'this game has no cards');
});

test('with 5 cards you must trade before placing or ending', () => {
  const s = board('000111000111', Array(12).fill(1));
  s.players[0].cards = [0, 1, 3, 4, 7];
  assert.equal(refuse(s, { type: 'place', t: 0 }), 'trade a card set first');
  assert.equal(refuse(s, { type: 'end' }), 'trade a card set first');
});

test('placing armies: only on your own territory, and all of them before attacking', () => {
  const s = board('000111000111', Array(12).fill(1));
  assert.equal(s.reserve, 3 + 3 + 3); // minimum, plus North and South
  assert.equal(refuse(s, { type: 'place', t: at('e1') }), 'not your territory');
  assert.equal(refuse(s, { type: 'place', t: 0, n: 10 }), 'not that many armies to place');
  const { s: t } = play(s, [{ type: 'place', t: 0, n: 8 }]);
  assert.equal(refuse(t, { type: 'end' }), 'place all armies first');
  assert.equal(refuse(t, { type: 'attack', from: 0, to: 1 }), 'not attacking now');
  const { s: u } = play(t, [{ type: 'place', t: 0 }, { type: 'end' }]);
  assert.equal(u.phase, 'attack');
  assert.equal(u.armies[0], 10);
});

test('attacks must go from your own territory with 2+ armies to an enemy neighbour', () => {
  const s = board('000111000111', [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], { phase: 'attack', reserve: 0 });
  assert.equal(refuse(s, { type: 'attack', from: at('n1'), to: at('n2') }), 'that territory is yours');
  assert.equal(refuse(s, { type: 'attack', from: at('n1'), to: at('e1') }), 'not a neighbour');
  assert.equal(refuse(s, { type: 'attack', from: at('n3'), to: at('e1') }), 'an attack needs at least 2 armies');
  assert.equal(refuse(s, { type: 'attack', from: at('e1'), to: at('n3') }), 'attack from your own territory');
  assert.equal(refuse(s, { type: 'attack', from: at('n1'), to: at('w3'), dice: 4 }), 'wrong number of dice');
});

test('a roll compares the highest dice pair by pair, ties to the defender', () => {
  const s = board('000111000111', [10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5], { phase: 'attack', reserve: 0 });
  for (let seed = 1; seed < 40; seed++) {
    s.rng = seed;
    const { events } = play(s, [{ type: 'attack', from: at('n1'), to: at('w3') }]);
    const [r] = events;
    assert.equal(r.a.length, 3);
    assert.equal(r.d.length, 2);
    let lostD = 0;
    for (let i = 0; i < 2; i++) lostD += r.a[i] > r.d[i] ? 1 : 0;
    assert.equal(r.lostD, lostD);
    assert.equal(r.lostA + r.lostD, 2);
  }
});

test('a conquest moves the dice in, then lets you move more; the card comes at the end of the turn (cards)', () => {
  // A attacks a lone army on w3 until it falls.
  const s = board('000111000111', [10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], { phase: 'attack', reserve: 0 });
  const { s: t, events } = play(s, [{ type: 'blitz', from: at('n1'), to: at('w3') }]);
  const win = events.find((e) => e.type === 'conquer');
  assert.equal(win.loser, 1);
  assert.equal(t.owner[at('w3')], 0);
  assert.equal(t.phase, 'occupy');
  assert.equal(t.armies[at('n1')] + t.armies[at('w3')], 10 - events.reduce((n, e) => n + (e.lostA ?? 0), 0));
  assert.equal(refuse(t, { type: 'end' }), 'move armies in first');
  assert.equal(refuse(t, { type: 'occupy', n: t.armies[at('n1')] }), 'cannot move that many');
  const before = t.armies[at('w3')];
  const { s: u } = play(t, [{ type: 'occupy', n: 1 }, { type: 'end' }, { type: 'end' }], CARDS);
  assert.equal(u.armies[at('w3')], before + 1);
  assert.equal(u.players[0].cards.length, 1);
  assert.equal(u.current, 1);
  assert.equal(u.phase, 'reinforce');
});

test('no card without a conquest', () => {
  const s = board('000111000111', Array(12).fill(1), { phase: 'attack', reserve: 0 });
  const { s: t, events } = play(s, [{ type: 'end' }, { type: 'end' }]);
  assert.equal(t.players[0].cards.length, 0);
  assert.ok(!events.some((e) => e.type === 'card'));
});

test('taking the last territory knocks a player out and hands over their cards', () => {
  // C holds only w2, with one army; A attacks from w1 with plenty.
  const s = board('000111000020', [1, 1, 1, 1, 1, 1, 1, 1, 1, 30, 1, 1], { phase: 'attack', reserve: 0 });
  s.players[2].cards = [4, 5];
  const { s: t, events } = play(s, [{ type: 'blitz', from: at('w1'), to: at('w2') }]);
  assert.ok(events.some((e) => e.type === 'eliminate' && e.p === 2));
  assert.equal(t.players[2].alive, false);
  assert.deepEqual(t.players[0].cards, [4, 5]);
});

test('turns skip players who are out, and the round counts up', () => {
  const s = board('000111000020', [1, 1, 1, 1, 1, 1, 1, 1, 1, 30, 1, 1], { phase: 'attack', reserve: 0 });
  let { s: t } = play(s, [{ type: 'blitz', from: at('w1'), to: at('w2') }]);
  if (t.phase === 'occupy') t = play(t, [{ type: 'occupy', n: 0 }]).s;
  t = play(t, [{ type: 'end' }, { type: 'end' }]).s;
  assert.equal(t.current, 1);
  const reserve = t.reserve;
  t = play(t, [{ type: 'place', t: at('e1'), n: reserve }, { type: 'end' }, { type: 'end' }, { type: 'end' }]).s;
  assert.equal(t.current, 0);
  assert.equal(t.round, 2);
});

test('taking the whole world wins', () => {
  const s = board('000000000001', [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], { phase: 'attack', reserve: 0 });
  s.armies[at('n1')] = 40;
  const { s: t, events } = play(s, [{ type: 'blitz', from: at('n1'), to: at('w3') }]);
  assert.equal(t.phase, 'over');
  assert.equal(t.winner, 0);
  assert.deepEqual(events.at(-1), { type: 'win', p: 0, how: 'world' });
  assert.equal(refuse(t, { type: 'end' }), 'the game is over');
});

test('fortify moves through your own territories only, and ends the turn', () => {
  // A: n1 n2 n3 and e1 e2 e3 (connected through n3–e1) and w1 (cut off).
  const s = board('000000111011', [6, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1], { phase: 'fortify', reserve: 0 });
  assert.deepEqual(G.fortifyTargets(map, MODERN, s, at('n1')).sort((a, b) => a - b), [1, 2, 3, 4, 5]);
  assert.equal(refuse(s, { type: 'fortify', from: at('n1'), to: at('w1'), n: 1 }), 'not connected');
  assert.equal(refuse(s, { type: 'fortify', from: at('n1'), to: at('e2'), n: 6 }), 'cannot move that many');
  const { s: t } = play(s, [{ type: 'fortify', from: at('n1'), to: at('e2'), n: 5 }]);
  assert.equal(t.armies[at('e2')], 6);
  assert.equal(t.current, 1);
  // With 'adjacent' only neighbours count.
  const adjacent = { ...MODERN, fortify: 'adjacent' };
  assert.deepEqual(G.fortifyTargets(map, adjacent, s, at('n1')).sort((a, b) => a - b), [1, 2]);
});

test('with a round limit, most territories wins when the rounds run out', () => {
  const rules = { ...MODERN, maxRounds: 1 };
  const s = board('000000011111', Array(12).fill(1), { phase: 'fortify', reserve: 0, current: 1 }, rules);
  const { s: t } = play(s, [{ type: 'end' }], rules);
  assert.equal(t.phase, 'over');
  assert.equal(t.winner, 0);
});

test('view hides other hands, the deck and the dice', () => {
  const s = G.newGame(map, MODERN, { players: ['A', 'B'], seed: 5 });
  s.players[0].cards = [1, 2];
  s.players[1].cards = [3];
  const v = G.view(s, 0);
  assert.deepEqual(v.players[0].cards, [1, 2]);
  assert.deepEqual(v.players[1].cards, [null]);
  assert.ok(v.deck.every((c) => c === null));
  assert.equal(v.rng, 0);
  assert.equal(s.players[1].cards[0], 3, 'the real state is untouched');
});

test('apply never changes the state it is given', () => {
  const s = G.newGame(map, MODERN, { players: ['A', 'B'], seed: 9 });
  const copy = structuredClone(s);
  G.apply(map, MODERN, s, { type: 'place', t: G.owned(s, 0)[0], n: 1 });
  assert.deepEqual(s, copy);
});

/* ---------- missions ---------- */

test('a mission game deals every player a mission, never to knock out themselves', () => {
  for (let seed = 1; seed <= 50; seed++) {
    const s = G.newGame(map, MODERN, { players: ['A', 'B', 'C'], seed, mode: 'mission' });
    s.players.forEach((pl, p) => {
      assert.ok(pl.mission, 'has a mission');
      assert.ok(!(pl.mission.type === 'eliminate' && pl.mission.target === p), 'not itself');
    });
  }
  assert.equal(G.newGame(map, MODERN, { players: ['A', 'B'], seed: 1 }).players[0].mission, undefined, 'none in world games');
});

test('missions: holding regions, holding territories', () => {
  const s = board('000000000111', Array(12).fill(1));
  const north = map.regions.findIndex((r) => r.id === 'north');
  const east = map.regions.findIndex((r) => r.id === 'east');
  const west = map.regions.findIndex((r) => r.id === 'west');
  s.players[0].mission = { type: 'regions', regions: [north, east] };
  assert.ok(G.missionDone(map, s, 0));
  s.players[0].mission = { type: 'regions', regions: [north, west] };
  assert.ok(!G.missionDone(map, s, 0));
  s.players[0].mission = { type: 'regions', regions: [north, east], plusOne: true };
  assert.ok(G.missionDone(map, s, 0), 'South is the one more');
  s.players[0].mission = { type: 'territories', count: 9, armies: 1 };
  assert.ok(G.missionDone(map, s, 0));
  s.players[0].mission = { type: 'territories', count: 9, armies: 2 };
  assert.ok(!G.missionDone(map, s, 0), 'needs 2 armies in each');
});

test('completing a mission on your turn wins at once', () => {
  const s = board('000000000001', [10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], { phase: 'attack', reserve: 0, mode: 'mission' });
  s.players[0].mission = { type: 'territories', count: 12, armies: 1 };
  s.players[1].mission = { type: 'territories', count: 12, armies: 1 };
  const { s: t, events } = play(s, [{ type: 'blitz', from: at('n1'), to: at('w3') }]);
  assert.equal(t.phase, 'over');
  assert.ok(events.some((e) => e.type === 'win' && e.p === 0));
  // Placing armies can complete a "2 armies each" mission too.
  const u = board('000000000111', Array(12).fill(1), { mode: 'mission', reserve: 3 });
  u.armies = u.armies.map((a, i) => (i < 8 ? 2 : 1));
  u.players[0].mission = { type: 'territories', count: 9, armies: 2 };
  const { s: v, events: ev } = play(u, [{ type: 'place', t: 8, n: 1 }]);
  assert.equal(v.phase, 'over');
  assert.equal(ev.at(-1).how, 'mission');
});

test('knock-out missions: done when you do it, holding territories when someone else does', () => {
  // C holds only w2. A (attacking) has to knock out C; B also had to: B gets the fallback.
  const s = board('000111000020', [1, 1, 1, 1, 1, 1, 1, 1, 1, 30, 1, 1], { phase: 'attack', reserve: 0, mode: 'mission' });
  s.players[0].mission = { type: 'eliminate', target: 2 };
  s.players[1].mission = { type: 'eliminate', target: 2 };
  s.players[2].mission = { type: 'territories', count: 12, armies: 1 };
  const { s: t } = play(s, [{ type: 'blitz', from: at('w1'), to: at('w2') }]);
  assert.equal(t.winner, 0);
  assert.equal(t.won, 'mission');
  assert.deepEqual(t.players[1].mission, G.fallback(map));
});

test('view hides the other players\' missions', () => {
  const s = G.newGame(map, MODERN, { players: ['A', 'B'], seed: 3, mode: 'mission' });
  const v = G.view(s, 0);
  assert.ok(v.players[0].mission);
  assert.equal(v.players[1].mission, null);
});

test('standings: the winner, then those still in by territories, then the knocked out, last out first', () => {
  // A knocks out C, then later B; A wins.
  const s = board('000111000020', [1, 1, 1, 1, 1, 1, 1, 1, 1, 30, 1, 1], { phase: 'attack', reserve: 0 });
  const { s: t } = play(s, [{ type: 'blitz', from: at('w1'), to: at('w2') }]);
  assert.equal(t.players[2].alive, false);
  assert.equal(t.players[2].outOrder, 1);
  assert.equal(t.players[2].outRound, 1);
  assert.deepEqual(G.standings(t), [0, 1, 2], 'no winner yet: A has more territories than B');
  const done = { ...structuredClone(t), winner: 1, phase: 'over' };
  assert.deepEqual(G.standings(done), [1, 0, 2]);
});

/* ---------- war-luck stars ---------- */

test('a conquest earns a star at the end of the turn, none without', () => {
  const s = board('000111000111', [10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], { phase: 'attack', reserve: 0 });
  let { s: t, events } = play(s, [{ type: 'blitz', from: at('n1'), to: at('w3') }]);
  if (t.phase === 'occupy') t = play(t, [{ type: 'occupy', n: 0 }]).s;
  ({ s: t, events } = play(t, [{ type: 'end' }, { type: 'end' }]));
  assert.equal(t.players[0].stars, 1);
  assert.deepEqual(events.find((e) => e.type === 'star'), { type: 'star', p: 0, stars: 1 });
  assert.equal(t.players[0].cards.length, 0, 'no cards in a stars game');
  const quiet = board('000111000111', Array(12).fill(1), { phase: 'attack', reserve: 0 });
  assert.equal(play(quiet, [{ type: 'end' }, { type: 'end' }]).s.players[0].stars, 0);
});

test('three stars become extra armies at the start of the turn, each time worth more', () => {
  const s = board('000111000111', Array(12).fill(1), { phase: 'fortify', reserve: 0 });
  s.players[1].stars = 3;
  const { s: t, events } = play(s, [{ type: 'end' }]);
  assert.equal(t.current, 1);
  assert.equal(t.players[1].stars, 0);
  assert.equal(t.reserve, G.reinforcements(map, MODERN, t, 1) + 4);
  assert.deepEqual(events.at(-1), { type: 'luck', p: 1, armies: 4 });
  assert.equal(t.trades, 1);
  // Two stars wait for the third.
  const u = board('000111000111', Array(12).fill(1), { phase: 'fortify', reserve: 0, trades: 1 });
  u.players[1].stars = 2;
  const v = play(u, [{ type: 'end' }]).s;
  assert.equal(v.players[1].stars, 2);
  assert.equal(v.reserve, G.reinforcements(map, MODERN, v, 1));
});

test('knocking a player out takes their stars', () => {
  const s = board('000111000020', [1, 1, 1, 1, 1, 1, 1, 1, 1, 30, 1, 1], { phase: 'attack', reserve: 0 });
  s.players[2].stars = 2;
  const { s: t, events } = play(s, [{ type: 'blitz', from: at('w1'), to: at('w2') }]);
  assert.equal(t.players[0].stars, 2);
  assert.equal(t.players[2].stars, 0);
  assert.equal(events.find((e) => e.type === 'eliminate').stars, 2);
});

test('a conquest moves one army in by itself; with occupyMin dice, as many as attacked', () => {
  const s = board('000111000111', [10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], { phase: 'attack', reserve: 0 });
  for (let seed = 1; seed < 20; seed++) {
    const one = play({ ...s, rng: seed }, [{ type: 'attack', from: at('n1'), to: at('w3') }]).s;
    if (one.owner[at('w3')] === 0) assert.equal(one.armies[at('w3')], 1);
    const dice = { ...MODERN, occupyMin: 'dice' };
    const three = play({ ...s, rng: seed }, [{ type: 'attack', from: at('n1'), to: at('w3') }], dice).s;
    if (three.owner[at('w3')] === 0) assert.equal(three.armies[at('w3')], 3);
  }
});
