// The Viking map (js/maps/vikings.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as V from '../../js/maps/vikings.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...V.RULES };

test('the Viking map is valid: 25 territories in 7 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(V.VIKINGS), []);
  assert.equal(Object.keys(V.VIKINGS.territories).length, 25);
  assert.equal(Object.keys(V.VIKINGS.regions).length, 7);
  const used = new Set(V.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(V.TERRITORIES).sort());
  assert.ok(V.GRID.every((row) => row.length === V.GRID[0].length), 'all rows equally long');
});

test('the islands are reached by sea only, and the edges do not meet', () => {
  const t = V.VIKINGS.territories;
  assert.deepEqual(t.groenland.adj, ['island']);
  assert.deepEqual(t.gotland.adj.sort(), ['goetaland', 'kurland', 'uppland']);
  assert.ok(t.jylland.adj.includes('northumbria'), 'over the North Sea');
  assert.ok(!t.wessex.adj.includes('frisland'));
  assert.ok(mapShapes(V.VIKINGS_GRID).sea.every((r) => !r.wraps));
});

test('land outside the game is drawn but not played', () => {
  assert.ok(V.GRID.join('').includes('#'));
  for (const t of Object.values(V.VIKINGS.territories)) assert.ok(t.adj.every((n) => V.VIKINGS.territories[n]), t.name);
  const shapes = mapShapes(V.VIKINGS_GRID);
  assert.ok(shapes.outlines['#'] && shapes.shore && shapes.frontier);
  // Jylland and Frisland are kept apart by unexplored Holstein: they meet only by sea.
  assert.ok(V.SEA.some(([a, b]) => a === 'f' && b === 'j'));
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(V.VIKINGS.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(V.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Viking map', () => {
  const map = G.prepareMap(V.VIKINGS);
  assert.equal(map.missions.length, V.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
