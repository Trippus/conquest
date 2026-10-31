// Kampen om England (js/maps/england.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as E from '../../js/maps/england.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...E.RULES };

test('the England map is valid: 26 territories in 8 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(E.ENGLAND), []);
  assert.equal(Object.keys(E.ENGLAND.territories).length, 26);
  assert.equal(Object.keys(E.ENGLAND.regions).length, 8);
  const used = new Set(E.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(E.TERRITORIES).sort());
  assert.ok(E.GRID.every((row) => row.length === E.GRID[0].length), 'all rows equally long');
});

test('Wales keeps to Wales, and Normandy is reached over the Channel', () => {
  const t = E.ENGLAND.territories;
  assert.ok(!t.gwynedd.adj.includes('york') && !t.deheubarth.adj.includes('cornwall'));
  assert.ok(t.sussex.adj.includes('rouen'), 'Vilhelm lands at Pevensey');
  assert.ok(t.kent.adj.includes('flandern'));
  assert.ok(mapShapes(E.ENGLAND_GRID).sea.every((r) => !r.wraps));
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(E.ENGLAND.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(E.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the England map', () => {
  const map = G.prepareMap(E.ENGLAND);
  assert.equal(map.missions.length, E.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});

test('two players never get a hold-territories-with-armies mission', () => {
  const map = G.prepareMap(E.ENGLAND);
  assert.ok(!G.missionPool(map, 2).some((m) => m.type === 'territories' && m.armies > 1));
  const three = G.missionPool(map, 3).find((m) => m.type === 'territories' && m.armies > 1);
  assert.ok(three.count > Math.ceil(26 / 3), 'more than a player starts with');
});

test('easy computer players can start with fewer armies (handicap), and the game still replays', () => {
  const map = G.prepareMap(E.ENGLAND);
  const total = (s, p) => s.armies.reduce((n, a, t) => n + (s.owner[t] === p ? a : 0), 0);
  const plain = G.newGame(map, rules, { players: ['A', 'B', 'C'], seed: 5 });
  const setup = { players: ['A', 'B', 'C'], seed: 5, handicap: [0, -6, -6] };
  const weaker = G.newGame(map, rules, setup);
  assert.equal(total(weaker, 0), total(plain, 0));
  assert.equal(total(weaker, 1), total(plain, 1) - 6);
  const { state, actions } = playBots(map, rules, setup, ['hard', 'novice', 'novice']);
  assert.deepEqual(G.replay(map, rules, setup, actions), state);
});
