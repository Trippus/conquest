// The first game's guide (js/guide.js): which note a game calls for. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import { guideDone, guideNote } from '../../js/guide.js';
import { MAPS, rulesFor } from '../../js/maps/index.js';
import { MODERN } from '../../js/rules/modern.js';

const grid = MAPS.world;
const rules = rulesFor(grid, MODERN);
const map = G.prepareMap(grid.MAP);
const NOTHING = { from: -1, to: -1, n: 0 };

// A game with an action log, and a way to play it on.
function game(seed = 3) {
  const g = { s: G.newGame(map, rules, { players: ['You', 'B', 'C'], seed }), actions: [] };
  g.act = (a) => {
    const r = G.apply(map, rules, g.s, a);
    assert.ok(r.ok, r.error);
    g.s = r.state;
    g.actions.push(a);
  };
  g.note = (sel = NOTHING) => guideNote(map, g.s, sel, g.actions);
  return g;
}
// The player's strongest border against a neighbour.
function front(s) {
  const from = G.owned(s, 0).filter((t) => G.attackTargets(map, s, t).length).sort((a, b) => s.armies[b] - s.armies[a])[0];
  return { from, to: G.attackTargets(map, s, from)[0] };
}

test('placing: first where, then the rest, then on to the attack', () => {
  const g = game();
  const first = g.note();
  assert.equal(first.id, 'place');
  assert.ok(first.marks.length, 'marks the borders');
  assert.ok(first.marks.every((t) => g.s.owner[t] === 0 && map.territories[t].adj.some((n) => g.s.owner[n] !== 0)));
  g.act({ type: 'place', t: first.marks[0], n: 1 });
  if (g.s.reserve) {
    assert.equal(g.note().id, 'placeRest');
    g.act({ type: 'place', t: first.marks[0], n: g.s.reserve });
  }
  assert.deepEqual(g.note(), { id: 'toAttack', button: 'toAttack' });
});

test('attacking: from where, at whom, the dice, and after that fight on', () => {
  const g = game();
  const t = g.note().marks[0];
  g.act({ type: 'place', t, n: g.s.reserve });
  g.act({ type: 'end' });
  const start = g.note();
  assert.equal(start.id, 'attackFrom');
  assert.ok(start.marks.every((x) => g.s.armies[x] > 1), 'only where an attack can start');
  const { from, to } = front(g.s);
  assert.equal(g.note({ from, to: -1, n: 0 }).id, 'attackTo');
  assert.equal(g.note({ from, to, n: 0 }).id, 'roll');
  g.act({ type: 'attack', from, to });
  if (g.s.phase === 'occupy') assert.equal(g.note().id, 'occupy');
  else assert.equal(g.note({ from, to, n: 0 }).id, 'rollAgain');
});

test('a taken territory, the end of the turn and the opponents', () => {
  const g = game();
  g.act({ type: 'place', t: g.note().marks[0], n: g.s.reserve });
  g.act({ type: 'end' });
  const { from, to } = front(g.s);
  for (let i = 0; g.s.phase === 'attack' && !g.s.conquered && i < 50 && g.s.armies[from] > 1; i++) g.act({ type: 'blitz', from, to });
  if (g.s.phase === 'occupy') {
    g.act({ type: 'occupy', n: 1 });
    assert.deepEqual(g.note(), { id: 'goOn', button: 'endAttack' });
  }
  g.act({ type: 'end' });
  assert.equal(g.note().id, 'fortify');
  g.act({ type: 'end' });
  assert.deepEqual(g.note(), { id: 'wait' });
  assert.equal(guideDone(g.s), false);
});

test('it is done when the second turn is under way or the game is over', () => {
  const g = game();
  g.s = { ...g.s, round: 2, current: 0, phase: 'reinforce', reserve: 3 };
  assert.ok(['last', 'lastStar'].includes(g.note().id));
  assert.equal(guideDone(g.s), false);
  assert.equal(guideDone({ ...g.s, phase: 'attack' }), true);
  assert.equal(guideDone({ ...g.s, current: 1, phase: 'over' }), true);
  assert.equal(guideNote(map, { ...g.s, phase: 'over' }, NOTHING, []), null);
});

test('a game with a goal starts with it, the missing territories marked, until it is put away', () => {
  const s = G.newGame(map, rules, { players: ['You', 'B', 'C'], seed: 4, mode: 'mission', goals: [{ type: 'regions', regions: [0, 1] }, null, null] });
  const first = guideNote(map, s, NOTHING, []);
  assert.equal(first.id, 'goal');
  assert.ok(first.ok);
  const goal = [0, 1].flatMap((r) => map.regions[r].members);
  assert.deepEqual(first.marks, goal.filter((t) => s.owner[t] !== 0));
  assert.equal(guideNote(map, s, NOTHING, [], { goal: true }).id, 'place');
  assert.equal(guideNote(map, s, NOTHING, [{ type: 'place' }]).id, 'placeRest', 'playing on puts it away too');
});
