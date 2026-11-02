// Kampen om Vesten (js/maps/west.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as E from '../../js/maps/west.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...E.RULES };

test('the West map is valid: 33 territories in 10 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(E.WEST), []);
  assert.equal(Object.keys(E.WEST.territories).length, 33);
  assert.equal(Object.keys(E.WEST.regions).length, 10);
  const used = new Set(E.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(E.TERRITORIES).sort());
  assert.ok(E.GRID.every((row) => row.length === E.GRID[0].length), 'all rows equally long');
});

test('over the water: the Gulf to the Rio Grande and the Gulf of California', () => {
  const t = E.WEST.territories;
  assert.ok(t.neworleans.adj.includes('matamoros'));
  assert.deepEqual(t.lapaz.adj.sort(), ['guaymas', 'sandiego']);
  assert.ok(mapShapes(E.WEST_GRID).sea.every((r) => !r.wraps));
});

test('the trails: to Oregon, to Santa Fe and on to California, and Taylor to the Rio Grande', () => {
  const t = E.WEST.territories;
  const road = (...ids) => ids.slice(1).every((id, i) => t[ids[i]].adj.includes(id));
  assert.ok(road('independence', 'platte', 'laramie', 'forthall', 'wallawalla', 'vancouver'), 'the Oregon Trail');
  assert.ok(road('independence', 'bentsfort', 'santafe', 'grandcanyon', 'sandiego'), 'the Santa Fe Trail and Kearny');
  assert.ok(road('austin', 'sanantonio', 'matamoros', 'saltillo'), 'Taylor');
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(E.WEST.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(E.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the West map', () => {
  const map = G.prepareMap(E.WEST);
  assert.equal(map.missions.length, E.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
