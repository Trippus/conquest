// Djengis Khan (js/maps/genghis.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as K from '../../js/maps/genghis.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...K.RULES };
const t = K.GENGHIS.territories;
const road = (...ids) => ids.slice(1).every((id, i) => t[ids[i]].adj.includes(id));

test('the Djengis Khan map is valid: 35 territories in 10 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(K.GENGHIS), []);
  assert.equal(Object.keys(K.GENGHIS.territories).length, 35);
  assert.equal(Object.keys(K.GENGHIS.regions).length, 10);
  const used = new Set(K.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(K.TERRITORIES).sort());
  assert.ok(K.GRID.every((row) => row.length === K.GRID[0].length), 'all rows equally long');
});

test('one sea route, over the Bohai strait; the rest is ridden', () => {
  assert.equal(mapShapes(K.GENGHIS_GRID).sea.length, 1);
  assert.ok(t.liaoyang.adj.includes('jinan'));
});

test('the roads of the conquests: to Zhongdu past the Tangut, and west along the Silk Road to Samarkand', () => {
  assert.ok(road('onon', 'datong', 'zhongdu'));
  assert.ok(road('karakorum', 'xingqing', 'changan'));
  assert.ok(road('khovd', 'beshbalik', 'kucha', 'kashgar', 'samarkand', 'bukhara'));
  assert.ok(road('almalik', 'taraz', 'otrar', 'urgench'));
});

test('the yurts, the caravan and the archer are drawn inside the map, and no rivers', () => {
  const inside = ([x, y]) => x >= 0 && x <= K.GENGHIS_GRID.WIDTH && y >= 0 && y <= K.GENGHIS_GRID.HEIGHT;
  assert.equal(K.RIVERS.length, 0);
  assert.ok([...K.CARAVANS, ...K.SIGHTS].every(inside));
  assert.deepEqual(K.SIGHTS.map((s) => s[2]), ['caravan', 'archer']);
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(K.GENGHIS.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(K.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Djengis Khan map', () => {
  const map = G.prepareMap(K.GENGHIS);
  assert.equal(map.missions.length, K.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
