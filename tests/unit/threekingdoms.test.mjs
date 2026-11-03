// De tre kongeriger (js/maps/threekingdoms.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as K from '../../js/maps/threekingdoms.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...K.RULES };
const t = K.THREEKINGDOMS.territories;
const road = (...ids) => ids.slice(1).every((id, i) => t[ids[i]].adj.includes(id));

// Whether two territories touch on the grid, not only over the sea.
const touch = (a, b) =>
  K.GRID.some((line, r) => [...line].some((x, c) => x === a && K.THREEKINGDOMS_GRID.hexNeighbours(r, c).some(([nr, nc]) => K.GRID[nr]?.[nc] === b)));

test('the De tre kongeriger map is valid: 33 territories in 10 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(K.THREEKINGDOMS), []);
  assert.equal(Object.keys(K.THREEKINGDOMS.territories).length, 33);
  assert.equal(Object.keys(K.THREEKINGDOMS.regions).length, 10);
  const used = new Set(K.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(K.TERRITORIES).sort());
  assert.ok(K.GRID.every((row) => row.length === K.GRID[0].length), 'all rows equally long');
});

test('one sea route, over the Bohai strait from Linzi to Liaodong', () => {
  assert.equal(mapShapes(K.THREEKINGDOMS_GRID).sea.length, 1);
  assert.ok(!touch('Q', 'S'), 'Linzi and Xiangping touch by land');
  assert.ok(t.linzi.adj.includes('xiangping'));
});

test('the roads of the war: Luoyang to Chengdu over the passes, and down the Yangzi to Jianye', () => {
  assert.ok(road('luoyang', 'changan', 'hanzhong', 'chengdu'));
  assert.ok(road('jiangzhou', 'jiangling', 'yuzhang', 'jianye'));
  assert.ok(road('wuwei', 'tianshui', 'changan'), 'the Hexi corridor runs to Guanzhong');
});

test('the rivers and the wall are drawn inside the map', () => {
  const inside = ([x, y]) => x >= 0 && x <= K.THREEKINGDOMS_GRID.WIDTH && y >= 0 && y <= K.THREEKINGDOMS_GRID.HEIGHT;
  assert.equal(K.RIVERS.length, 4);
  assert.ok([...K.RIVERS.flat(), ...K.SIGHTS].every(inside));
  assert.deepEqual(K.SIGHTS.map((s) => s[2]), ['wall']);
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(K.THREEKINGDOMS.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(K.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the De tre kongeriger map', () => {
  const map = G.prepareMap(K.THREEKINGDOMS);
  assert.equal(map.missions.length, K.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
