// Etiopien (js/maps/ethiopia.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as E from '../../js/maps/ethiopia.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...E.RULES };
const t = E.ETHIOPIA.territories;
const road = (...ids) => ids.slice(1).every((id, i) => t[ids[i]].adj.includes(id));

// Whether two territories touch on the grid, not only over the sea.
const touch = (a, b) =>
  E.GRID.some((line, r) => [...line].some((x, c) => x === a && E.ETHIOPIA_GRID.hexNeighbours(r, c).some(([nr, nc]) => E.GRID[nr]?.[nc] === b)));

test('the Etiopien map is valid: 34 territories in 10 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(E.ETHIOPIA), []);
  assert.equal(Object.keys(E.ETHIOPIA.territories).length, 34);
  assert.equal(Object.keys(E.ETHIOPIA.regions).length, 10);
  const used = new Set(E.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(E.TERRITORIES).sort());
  assert.ok(E.GRID.every((row) => row.length === E.GRID[0].length), 'all rows equally long');
});

test('one sea route, over the Gulf of Aden: Aden is reached from Africa only by sea', () => {
  assert.equal(mapShapes(E.ETHIOPIA_GRID).sea.length, 1);
  assert.ok(!touch('n', 'e'), 'Aden and Berbera touch by land');
  assert.deepEqual(t.aden.adj, ['berbera']);
});

test("Menelik's march from Addis Abeba to Adwa", () => {
  assert.ok(road('addisabeba', 'wollo', 'ambaalagi', 'mekele', 'adwa'));
});

test('the rivers, the march, the caravans and the sights are drawn inside the map', () => {
  const inside = ([x, y]) => x >= 0 && x <= E.ETHIOPIA_GRID.WIDTH && y >= 0 && y <= E.ETHIOPIA_GRID.HEIGHT;
  assert.equal(E.RIVERS.length, 7);
  assert.equal(E.ROADS.length, 1);
  assert.equal(E.CARAVANS.length, 2);
  assert.ok([...E.RIVERS.flat(), ...E.ROADS.flat(), ...E.CARAVANS, ...E.SIGHTS].every(inside));
  assert.deepEqual(E.SIGHTS.map((s) => s[2]), ['obelisk', 'dhow']);
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(E.ETHIOPIA.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(E.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Etiopien map', () => {
  const map = G.prepareMap(E.ETHIOPIA);
  assert.equal(map.missions.length, E.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
