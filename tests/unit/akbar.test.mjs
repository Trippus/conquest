// Akbar den Store (js/maps/akbar.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as K from '../../js/maps/akbar.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...K.RULES };
const t = K.AKBAR.territories;
const road = (...ids) => ids.slice(1).every((id, i) => t[ids[i]].adj.includes(id));

test('the Akbar den Store map is valid: 36 territories in 10 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(K.AKBAR), []);
  assert.equal(Object.keys(K.AKBAR.territories).length, 36);
  assert.equal(Object.keys(K.AKBAR.regions).length, 10);
  const used = new Set(K.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(K.TERRITORIES).sort());
  assert.ok(K.GRID.every((row) => row.length === K.GRID[0].length), 'all rows equally long');
});

test('India hangs together by land; the one sea route goes over the Palk Strait to Ceylon', () => {
  assert.equal(mapShapes(K.AKBAR_GRID).sea.length, 1);
  assert.deepEqual(t.kotte.adj, ['madurai']);
});

test("Akbar's road: from Kabul over the Khyber to Lahore and Delhi, and on to Gujarat", () => {
  assert.ok(road('kabulby', 'peshawar', 'lahore', 'delhi', 'agra'));
  assert.ok(road('amber', 'chittor', 'ahmedabad'));
  assert.ok(road('goa', 'bijapur') && road('goa', 'hampi'), 'Portuguese Goa sits between Bijapur and Vijayanagara');
});

test('the rivers and the elephant are drawn inside the map', () => {
  const inside = ([x, y]) => x >= 0 && x <= K.AKBAR_GRID.WIDTH && y >= 0 && y <= K.AKBAR_GRID.HEIGHT;
  assert.equal(K.RIVERS.length, 6);
  assert.ok([...K.RIVERS.flat(), ...K.SIGHTS].every(inside));
  assert.deepEqual(K.SIGHTS.map((s) => s[2]), ['elephant']);
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(K.AKBAR.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(K.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Akbar den Store map', () => {
  const map = G.prepareMap(K.AKBAR);
  assert.equal(map.missions.length, K.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
