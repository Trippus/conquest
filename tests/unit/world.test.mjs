// The world map (js/maps/world.js) and the shapes drawn from it (js/map-shapes.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as W from '../../js/maps/world.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

test('the world map is valid: 40 territories in 6 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(W.WORLD), []);
  assert.equal(Object.keys(W.WORLD.territories).length, 40);
  assert.equal(Object.keys(W.WORLD.regions).length, 6);
  const used = new Set(W.GRID.join('').replace(/\./g, ''));
  assert.deepEqual([...used].sort(), Object.keys(W.TERRITORIES).sort());
  assert.ok(W.GRID.every((row) => row.length === W.GRID[0].length), 'all rows equally long');
});

test('sea routes connect what the grid cannot', () => {
  const t = W.WORLD.territories;
  assert.ok(t.alaska.adj.includes('oestsibirien'));
  assert.ok(t.japan.adj.includes('oestasien'));
  assert.ok(t.hoejlandet.adj.includes('vestafrika'));
  assert.ok(!t.alaska.adj.includes('groenland'));
});

test('hand-placed seals sit on their own territory', () => {
  for (const [l, [row, col]] of Object.entries(W.PLACES)) assert.equal(W.cellAt(row, col), l, l);
});

test('every region bonus is at least 2', () => {
  for (const r of Object.values(W.WORLD.regions)) assert.ok(r.bonus >= 2, r.name);
});

test('shapes: one outline per territory, plus coast, borders and sea routes', () => {
  const s = mapShapes(W);
  assert.deepEqual(Object.keys(s.outlines).sort(), Object.keys(W.TERRITORIES).sort());
  for (const d of Object.values(s.outlines)) assert.match(d, /^M[\d. ]+(L[\d. ]+)+Z/);
  assert.ok(s.coast.length && s.borders.length && s.regions.length);
  assert.equal(s.sea.length, W.SEA.length);
  assert.ok(s.sea.find((r) => r.from === 'a').wraps, 'Alaska–Far East goes round the back of the map');
});

test('normal bots finish games on the world map', () => {
  const map = G.prepareMap(W.WORLD);
  for (let seed = 1; seed <= 3; seed++) {
    const { state } = playBots(map, MODERN, { players: ['A', 'B', 'C', 'D'], seed }, Array(4).fill('hard'));
    assert.equal(state.phase, 'over');
  }
});

test('the world map\'s region missions name real regions, and mission games end', () => {
  const map = G.prepareMap(W.WORLD);
  assert.equal(map.missions.length, W.MISSIONS.length);
  for (const m of map.missions) assert.ok(m.regions.every((r) => r >= 0 && r < map.regions.length));
  for (let seed = 1; seed <= 3; seed++) {
    const { state } = playBots(map, MODERN, { players: ['A', 'B', 'C'], seed, mode: 'mission' }, Array(3).fill('hard'));
    assert.equal(state.phase, 'over');
  }
});
