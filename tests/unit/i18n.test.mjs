// The languages (js/i18n.js, js/lang/*.js) and the maps' names in English. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DA } from '../../js/lang/da.js';
import { EN } from '../../js/lang/en.js';
import { pickLanguage, stringsFor } from '../../js/i18n.js';
import { MAPS, inLanguage } from '../../js/maps/index.js';

test('Danish and English have the same texts, of the same kind', () => {
  assert.deepEqual(Object.keys(EN).sort(), Object.keys(DA).sort());
  for (const k of Object.keys(DA)) assert.equal(typeof EN[k], typeof DA[k], k);
  for (const k of ['errors', 'levels', 'modes', 'speeds', 'themes', 'phases', 'phaseNames', 'modeShort', 'togter']) {
    assert.deepEqual(Object.keys(EN[k]).sort(), Object.keys(DA[k]).sort(), k);
  }
  assert.equal(EN.opponents.length, DA.opponents.length);
});

test('a saved language wins; else Danish only for a Danish browser', () => {
  assert.equal(pickLanguage('da'), 'da');
  assert.equal(pickLanguage('en'), 'en');
  assert.equal(stringsFor('en').lang, 'en');
});

test('every map has an English name, and its English names are for things it has', () => {
  for (const grid of Object.values(MAPS)) {
    const names = grid.NAMES?.en;
    assert.ok(names?.name, grid.id);
    for (const id of Object.keys(names.REGIONS ?? {})) assert.ok(grid.MAP.regions[id], `${grid.id}: region ${id}`);
    for (const id of Object.keys(names.TERRITORIES ?? {})) assert.ok(grid.MAP.territories[id], `${grid.id}: ${id}`);
    for (const n of Object.keys(names.LANDMARKS ?? {})) assert.ok(grid.LANDMARKS.some((l) => l[2] === n), `${grid.id}: ${n}`);
    if (names.RULERS) assert.equal(names.RULERS.length, grid.RULERS.length, grid.id);
    const en = inLanguage(grid, 'en');
    assert.equal(en.MAP.name, names.name);
    assert.deepEqual(Object.keys(en.MAP.territories), Object.keys(grid.MAP.territories));
    assert.equal(inLanguage(grid, 'da'), grid);
  }
});
