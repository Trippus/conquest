// Inkariget (js/maps/inka.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import * as E from '../../js/maps/inka.js';
import { mapShapes } from '../../js/map-shapes.js';
import { playBots } from '../../js/ai.js';
import { MODERN } from '../../js/rules/modern.js';

const rules = { ...MODERN, ...E.RULES };

test('the Inka map is valid: 33 territories in 10 regions, every letter on the grid', () => {
  assert.deepEqual(G.validateMap(E.INKA), []);
  assert.equal(Object.keys(E.INKA.territories).length, 33);
  assert.equal(Object.keys(E.INKA.regions).length, 10);
  const used = new Set(E.GRID.join('').replace(/[.#]/g, ''));
  assert.deepEqual([...used].sort(), Object.keys(E.TERRITORIES).sort());
  assert.ok(E.GRID.every((row) => row.length === E.GRID[0].length), 'all rows equally long');
});

test('all by land: no sea routes, and round Lake Titicaca', () => {
  assert.deepEqual(E.SEA, []);
  assert.deepEqual(mapShapes(E.INKA_GRID).sea, []);
  const t = E.INKA.territories;
  assert.ok(['hatuncolla', 'chucuito', 'tiwanaku'].every((id, i, all) => t[id].adj.includes(all[(i + 1) % 3])));
});

test('the Inca road: from Caranqui over Cusco to Aconcagua', () => {
  const t = E.INKA.territories;
  const road = (...ids) => ids.slice(1).every((id, i) => t[ids[i]].adj.includes(id));
  assert.ok(road('caranqui', 'tumebamba', 'chachapoyas', 'cajamarca', 'huamachuco', 'huanuco', 'tarma', 'jauja', 'huamanga', 'andahuaylas', 'cusco'), 'the north');
  assert.ok(road('cusco', 'hatuncolla', 'tiwanaku', 'cochabamba', 'porco', 'atacama', 'copiapo', 'aconcagua'), 'the south');
});

test('the rivers, the road, the llamas and the reed boat are drawn inside the map', () => {
  const inside = ([x, y]) => x >= 0 && x <= E.INKA_GRID.WIDTH && y >= 0 && y <= E.INKA_GRID.HEIGHT;
  assert.equal(E.RIVERS.length, 4);
  assert.ok([...E.RIVERS.flat(), ...E.ROADS.flat(), ...E.CARAVANS, ...E.SIGHTS].every(inside));
});

test('every region has a name place and a bonus of at least 2', () => {
  for (const [id, r] of Object.entries(E.INKA.regions)) {
    assert.ok(r.bonus >= 2, r.name);
    assert.ok(E.REGION_PLACES[id], r.name);
  }
});

test('bots finish mission and conquest games on the Inka map', () => {
  const map = G.prepareMap(E.INKA);
  assert.equal(map.missions.length, E.MISSIONS.length);
  for (let seed = 1; seed <= 3; seed++) {
    for (const mode of ['mission', 'world']) {
      const { state } = playBots(map, rules, { players: ['A', 'B', 'C', 'D'], seed, mode }, ['hard', 'medium', 'novice', 'hard']);
      assert.equal(state.phase, 'over');
    }
  }
});
