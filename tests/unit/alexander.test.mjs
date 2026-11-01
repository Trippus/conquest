// Alexander den Store (js/maps/alexander.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as E from '../../js/maps/alexander.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...E.RULES };

test('the Alexander map is valid: 26 territories in 8 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(E.ALEXANDER), []);
  assert.equal(Object.keys(E.ALEXANDER.territories).length, 26);
  assert.equal(Object.keys(E.ALEXANDER.regions).length, 8);
  const used = new Set(E.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(E.TERRITORIES).sort());
  assert.ok(E.GRID.every((row) => row.length === E.GRID[0].length), 'all rows equally long');
});

test('the road east: over the Hellespont, through Persia to Bactria, and back by sea from the Indus', () => {
  const t = E.ALEXANDER.territories;
  assert.ok(t.byzantion.adj.includes('sardes'));
  assert.ok(t.ekbatana.adj.includes('areia'));
  assert.ok(t.baktra.adj.includes('taxila'));
  assert.ok(t.patala.adj.includes('persepolis') && t.athen.adj.includes('sardes'));
  assert.deepEqual(t.siwa.adj.sort(), ['memfis', 'theben']);
  assert.ok(mapShapes(E.ALEXANDER_GRID).sea.every((r) => !r.wraps));
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(E.ALEXANDER.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(E.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Alexander map', () => {
  const map = G.prepareMap(E.ALEXANDER);
  assert.equal(map.missions.length, E.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
