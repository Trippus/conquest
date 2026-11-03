// Konstantinopel (js/maps/constantinople.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as K from '../../js/maps/constantinople.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...K.RULES };
const t = K.CONSTANTINOPLE.territories;
const road = (...ids) => ids.slice(1).every((id, i) => t[ids[i]].adj.includes(id));

// Whether two territories touch on the grid, not only over the sea.
const touch = (a, b) =>
  K.GRID.some((line, r) => [...line].some((x, c) => x === a && K.CONSTANTINOPLE_GRID.hexNeighbours(r, c).some(([nr, nc]) => K.GRID[nr]?.[nc] === b)));

test('the Konstantinopel map is valid: 34 territories in 10 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(K.CONSTANTINOPLE), []);
  assert.equal(Object.keys(K.CONSTANTINOPLE.territories).length, 34);
  assert.equal(Object.keys(K.CONSTANTINOPLE.regions).length, 10);
  const used = new Set(K.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(K.TERRITORIES).sort());
  assert.ok(K.GRID.every((row) => row.length === K.GRID[0].length), 'all rows equally long');
});

test('Europe and Asia meet only over the Bosporus and the Dardanelles', () => {
  assert.equal(mapShapes(K.CONSTANTINOPLE_GRID).sea.length, 2);
  for (const [a, b] of [['K', 'B'], ['G', 'B']]) assert.ok(!touch(a, b), `${a} and ${b} touch by land`);
  const europe = new Set(['tr', 'bu', 'gr', 'sr', 'da', 'hu', 'wl']);
  const crossings = Object.entries(t).flatMap(([id, x]) => x.adj.filter((n) => europe.has(x.region) !== europe.has(t[n].region)).map((n) => [id, n].sort().join('–')));
  assert.deepEqual([...new Set(crossings)].sort(), ['bursa–gallipoli', 'bursa–konstantinopel']);
});

test("the roads of the war: Hunyadi's march from Buda by Belgrad to Varna, and Mehmed's to the Morea", () => {
  assert.ok(road('buda', 'belgrad', 'smederevo', 'targoviste', 'varna'));
  assert.ok(road('adrianopel', 'thessaloniki', 'athen', 'mistra'));
});

test('the rivers and the cannon are drawn inside the map', () => {
  const inside = ([x, y]) => x >= 0 && x <= K.CONSTANTINOPLE_GRID.WIDTH && y >= 0 && y <= K.CONSTANTINOPLE_GRID.HEIGHT;
  assert.equal(K.RIVERS.length, 2);
  assert.ok([...K.RIVERS.flat(), ...K.SIGHTS].every(inside));
  assert.deepEqual(K.SIGHTS.map((s) => s[2]), ['cannon']);
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(K.CONSTANTINOPLE.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(K.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Konstantinopel map', () => {
  const map = G.prepareMap(K.CONSTANTINOPLE);
  assert.equal(map.missions.length, K.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
