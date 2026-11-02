// Songhai (js/maps/songhai.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as E from '../../js/maps/songhai.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...E.RULES };

test('the Songhai map is valid: 30 territories in 10 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(E.SONGHAI), []);
  assert.equal(Object.keys(E.SONGHAI.territories).length, 30);
  assert.equal(Object.keys(E.SONGHAI.regions).length, 10);
  const used = new Set(E.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(E.TERRITORIES).sort());
  assert.ok(E.GRID.every((row) => row.length === E.GRID[0].length), 'all rows equally long');
});

test('all by land: no sea routes, and round Lake Chad from Bornu to Kanem', () => {
  assert.deepEqual(E.SEA, []);
  assert.deepEqual(mapShapes(E.SONGHAI_GRID).sea, []);
  assert.ok(E.SONGHAI.territories.ngazargamu.adj.includes('kanem'));
});

test('down the Niger, and the salt road from Taghaza to Timbuktu', () => {
  const t = E.SONGHAI.territories;
  const road = (...ids) => ids.slice(1).every((id, i) => t[ids[i]].adj.includes(id));
  assert.ok(road('niani', 'segou', 'jenne', 'timbuktu', 'gao', 'tillaberi', 'dendi', 'ife', 'benin'), 'the Niger');
  assert.ok(road('taghaza', 'arawan', 'timbuktu'), 'the salt road');
});

test('the rivers and caravans are drawn inside the map', () => {
  const inside = ([x, y]) => x >= 0 && x <= E.SONGHAI_GRID.WIDTH && y >= 0 && y <= E.SONGHAI_GRID.HEIGHT;
  assert.equal(E.RIVERS.length, 5);
  assert.ok(E.RIVERS.flat().every(inside));
  assert.ok(E.CARAVANS.every(inside));
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(E.SONGHAI.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(E.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Songhai map', () => {
  const map = G.prepareMap(E.SONGHAI);
  assert.equal(map.missions.length, E.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
