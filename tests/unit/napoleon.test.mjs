// Napoleonskrigene (js/maps/napoleon.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as E from '../../js/maps/napoleon.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...E.RULES };

test('the Napoleon map is valid: 33 territories in 9 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(E.NAPOLEON), []);
  assert.equal(Object.keys(E.NAPOLEON.territories).length, 33);
  assert.equal(Object.keys(E.NAPOLEON.regions).length, 9);
  const used = new Set(E.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(E.TERRITORIES).sort());
  assert.ok(E.GRID.every((row) => row.length === E.GRID[0].length), 'all rows equally long');
});

test('over the water: the North Sea, the Irish Sea, the Bay of Biscay, the Øresund and the Baltic', () => {
  const t = E.NAPOLEON.territories;
  assert.ok(t.london.adj.includes('amsterdam') && t.london.adj.includes('lissabon') && t.london.adj.includes('dublin'));
  assert.ok(t.edinburgh.adj.includes('christiania'));
  assert.ok(t.koebenhavn.adj.includes('stockholm') && t.koebenhavn.adj.includes('koenigsberg'));
  assert.deepEqual(t.dublin.adj, ['london']);
  assert.ok(mapShapes(E.NAPOLEON_GRID).sea.every((r) => !r.wraps));
});

test('the land roads: over the Pyrenees, through the Alps, and on to Moscow', () => {
  const t = E.NAPOLEON.territories;
  assert.ok(t.barcelona.adj.includes('marseille') && t.bordeaux.adj.includes('madrid'));
  assert.ok(t.milano.adj.includes('lyon') && t.milano.adj.includes('wien'));
  assert.ok(t.smolensk.adj.includes('moskva') && t.riga.adj.includes('koenigsberg'));
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(E.NAPOLEON.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(E.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Napoleon map', () => {
  const map = G.prepareMap(E.NAPOLEON);
  assert.equal(map.missions.length, E.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
