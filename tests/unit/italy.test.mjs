// Roms samling af Italien (js/maps/italy.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as E from '../../js/maps/italy.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...E.RULES };

test('the Italy map is valid: 23 territories in 8 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(E.ITALY), []);
  assert.equal(Object.keys(E.ITALY.territories).length, 23);
  assert.equal(Object.keys(E.ITALY.regions).length, 8);
  const used = new Set(E.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(E.TERRITORIES).sort());
  assert.ok(E.GRID.every((row) => row.length === E.GRID[0].length), 'all rows equally long');
});

test('the islands are reached by sea, and Sicily by land over Messina', () => {
  const t = E.ITALY.territories;
  assert.ok(t.syrakus.adj.includes('bruttium'));
  assert.deepEqual(t.korsika.adj.sort(), ['etrurien', 'ligurien', 'sardinien']);
  assert.ok(t.lilybaeum.adj.includes('karthago') && t.sardinien.adj.includes('rom'));
  assert.ok(mapShapes(E.ITALY_GRID).sea.every((r) => !r.wraps));
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(E.ITALY.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(E.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Italy map', () => {
  const map = G.prepareMap(E.ITALY);
  assert.equal(map.missions.length, E.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
