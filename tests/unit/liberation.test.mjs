// Befrielsen (js/maps/liberation.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as E from '../../js/maps/liberation.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...E.RULES };
const t = E.LIBERATION.territories;
const road = (...ids) => ids.slice(1).every((id, i) => t[ids[i]].adj.includes(id));

// Whether two territories touch on the grid, not only over the sea.
const touch = (a, b) =>
  E.GRID.some((line, r) => [...line].some((x, c) => x === a && E.LIBERATION_GRID.hexNeighbours(r, c).some(([nr, nc]) => E.GRID[nr]?.[nc] === b)));

test('the Befrielsen map is valid: 34 territories in 10 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(E.LIBERATION), []);
  assert.equal(Object.keys(E.LIBERATION.territories).length, 34);
  assert.equal(Object.keys(E.LIBERATION.regions).length, 10);
  const used = new Set(E.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(E.TERRITORIES).sort());
  assert.ok(E.GRID.every((row) => row.length === E.GRID[0].length), 'all rows equally long');
});

test('two sea routes, each a new way to attack: Santiago–Lima and over the River Plate', () => {
  assert.equal(mapShapes(E.LIBERATION_GRID).sea.length, 2);
  for (const [a, b] of E.SEA) assert.ok(!touch(a, b), `${a}–${b} touch by land`);
  assert.ok(t.santiago.adj.includes('lima'));
  assert.ok(t.buenosaires.adj.includes('montevideo'));
});

test('the marches: Bolívar from Angostura to Santa Fe, San Martín from Mendoza to Santiago', () => {
  assert.ok(road('angostura', 'barinas', 'casanare', 'santafe'), 'Bolívar, 1819');
  assert.ok(road('mendoza', 'santiago'), 'San Martín, 1817');
});

test('the rivers, the marches and the riders are drawn inside the map', () => {
  const inside = ([x, y]) => x >= 0 && x <= E.LIBERATION_GRID.WIDTH && y >= 0 && y <= E.LIBERATION_GRID.HEIGHT;
  assert.equal(E.RIVERS.length, 7);
  assert.equal(E.ROADS.length, 2);
  assert.ok([...E.RIVERS.flat(), ...E.ROADS.flat(), ...E.SIGHTS].every(inside));
  assert.deepEqual(E.SIGHTS.map((s) => s[2]), ['llanero', 'gaucho']);
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(E.LIBERATION.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(E.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Befrielsen map', () => {
  const map = G.prepareMap(E.LIBERATION);
  assert.equal(map.missions.length, E.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
