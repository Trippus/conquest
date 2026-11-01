// Japans samling (js/maps/japan.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as E from '../../js/maps/japan.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...E.RULES };

test('the Japan map is valid: 30 territories in 9 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(E.JAPAN), []);
  assert.equal(Object.keys(E.JAPAN.territories).length, 30);
  assert.equal(Object.keys(E.JAPAN.regions).length, 9);
  const used = new Set(E.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(E.TERRITORIES).sort());
  assert.ok(E.GRID.every((row) => row.length === E.GRID[0].length), 'all rows equally long');
});

test('over the water: Shimonoseki, the Bungo channel, the Inland Sea and past Awaji to Osaka', () => {
  const t = E.JAPAN.territories;
  assert.ok(t.hakata.adj.includes('yamaguchi'));
  assert.ok(t.funai.adj.includes('matsuyama'));
  assert.ok(t.matsuyama.adj.includes('hiroshima'));
  assert.ok(t.tokushima.adj.includes('osaka'));
  assert.ok(mapShapes(E.JAPAN_GRID).sea.every((r) => !r.wraps));
});

test("Hida is Gifu's, so the Kinai, the mountains and Hokuriku meet at Gifu", () => {
  const t = E.JAPAN.territories;
  for (const id of ['kyoto', 'kanazawa', 'ichijodani', 'matsumoto', 'kiyosu']) assert.ok(t.gifu.adj.includes(id), id);
  assert.deepEqual(t.morioka.adj, ['sendai']);
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(E.JAPAN.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(E.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Japan map', () => {
  const map = G.prepareMap(E.JAPAN);
  assert.equal(map.missions.length, E.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
