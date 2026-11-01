// The togter (js/togter.js): their order, what opens what, and what a win or a loss counts. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TOGTER, newProgress, isOpen, nextTogt, freeMaps, record, offerEasy } from '../../js/togter.js';
import { MAPS } from '../../js/maps/index.js';
import { DA } from '../../js/lang/da.js';
import { EN } from '../../js/lang/en.js';

test('every togt is a map, once, with its texts in both languages', () => {
  assert.equal(new Set(TOGTER.map((t) => t.map)).size, TOGTER.length);
  for (const t of TOGTER) {
    assert.ok(MAPS[t.map], t.map);
    assert.ok(t.opponents >= 1 && t.opponents <= 5, t.map);
    for (const L of [DA, EN]) for (const k of ['year', 'teaser', 'story', 'goal', 'epilogue']) assert.ok(L.togter[t.map]?.[k], `${L.lang} ${t.map} ${k}`);
  }
  assert.deepEqual(Object.keys(DA.togter).sort(), TOGTER.map((t) => t.map).sort());
});

test('only the first togt is open at first; a win opens the next and its map', () => {
  const all = Object.keys(MAPS);
  let p = newProgress();
  assert.deepEqual(TOGTER.map((_, i) => isOpen(p, i)), TOGTER.map((_, i) => i === 0));
  assert.deepEqual(freeMaps(p, all), ['world']);
  p = record(p, 'italy', true, 'medium');
  assert.ok(isOpen(p, 1));
  assert.ok(!isOpen(p, 2));
  assert.ok(freeMaps(p, all).includes('italy'));
  assert.equal(nextTogt('italy').map, 'alexander');
  assert.equal(nextTogt('world'), null);
});

test('a veteran has every map in the free game, but begins the togter from the start', () => {
  const p = newProgress(true);
  assert.deepEqual(freeMaps(p, Object.keys(MAPS)), Object.keys(MAPS));
  assert.ok(!isOpen(p, 1));
});

test('a win keeps the hardest level; two losses offer easy opponents, a win clears them', () => {
  let p = record(newProgress(), 'italy', true, 'hard');
  p = record(p, 'italy', true, 'novice');
  assert.equal(p.won.italy, 'hard');
  p = record(p, 'alexander', false, 'medium');
  assert.ok(!offerEasy(p, 'alexander', 'medium'));
  p = record(p, 'alexander', false, 'medium');
  assert.ok(offerEasy(p, 'alexander', 'medium'));
  assert.ok(!offerEasy(p, 'alexander', 'novice'));
  p = record(p, 'alexander', true, 'medium');
  assert.equal(p.lost.alexander, undefined);
});
