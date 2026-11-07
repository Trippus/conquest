// The togter (js/togter.js): their order, what opens what, and what a win or a loss counts. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import * as G from '../../js/engine.js';
import { MAPS, rulesFor } from '../../js/maps/index.js';
import { MODERN } from '../../js/rules/modern.js';
import { TOGTER, newProgress, isOpen, upNext, nextTogt, freeMaps, record, offerEasy, togtArmies, togtStart } from '../../js/togter.js';
import { DA } from '../../js/lang/da.js';
import { EN } from '../../js/lang/en.js';

test('every togt picture is there, and every map has its small picture (npm run map-shots)', () => {
  for (const t of TOGTER) if (t.art) assert.ok(existsSync(new URL(`../../${t.art}`, import.meta.url)), t.art);
  // and its small copy for the lists (tools/make-thumbs.ps1)
  for (const t of TOGTER) if (t.art) assert.ok(existsSync(new URL(`../../${t.art.replace('togter/', 'togter/small/')}`, import.meta.url)), `small ${t.art}`);
  for (const id of Object.keys(MAPS)) assert.ok(existsSync(new URL(`../../assets/maps/${id}.jpg`, import.meta.url)), id);
});

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
  assert.equal(nextTogt(p, 'italy').map, 'alexander');
});

test('one togt is next, also with togter added earlier in history than one won', () => {
  let p = newProgress();
  for (const map of ['italy', 'alexander', 'vikings', 'england', 'japan', 'napoleon']) p = record(p, map, true, 'medium');
  // Open and not won: Tre kongeriger, Djengis Khan, Inkariget ... and Befrielsen, after Napoleon.
  assert.equal(upNext(p).map, 'threekingdoms');
  assert.equal(nextTogt(p, 'threekingdoms').map, 'genghis');
  // Playing an old one again goes on to what is still to be won, not to the one after it.
  assert.equal(nextTogt(p, 'italy').map, 'threekingdoms');
  assert.equal(nextTogt(p, 'napoleon').map, 'liberation');
});

test('when the last togt is won, the holes before it come next; then there is nothing', () => {
  let p = newProgress();
  for (const t of TOGTER) p = record(p, t.map, true, 'medium');
  assert.equal(nextTogt(p, 'world'), null);
  delete p.won.japan;
  assert.equal(nextTogt(p, 'world').map, 'japan');
  assert.equal(upNext(p).map, 'japan');
});

test('a togt put in before one already won is open, and so is the one won', () => {
  const p = record(newProgress(), 'japan', true, 'medium');
  const at = (map) => TOGTER.findIndex((t) => t.map === map);
  assert.ok(isOpen(p, at('songhai')));
  assert.ok(isOpen(p, at('japan')));
  assert.ok(isOpen(p, at('napoleon')));
  assert.ok(!isOpen(p, at('west')));
});

test('a veteran keeps the maps from before the togter, but begins the togter from the start', () => {
  const p = newProgress(true);
  assert.deepEqual(freeMaps(p, Object.keys(MAPS)).sort(), ['alexander', 'england', 'italy', 'japan', 'napoleon', 'vikings', 'world']);
  assert.ok(freeMaps({ ...p, won: { akbar: 'novice' } }, Object.keys(MAPS)).includes('akbar'));
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

test('Let has its own armies; the other levels keep the togt\'s', () => {
  const italy = TOGTER[0];
  assert.deepEqual(togtArmies(italy, 'novice', 0.5), { bonus: italy.easy.bonus, novice: 0, guard: italy.easy.guard });
  assert.deepEqual(togtArmies(italy, 'medium', 0.5), { bonus: italy.bonus, novice: 0.5, guard: 0 });
  const world = TOGTER.at(-1);
  assert.equal(world.easy, undefined);
  assert.deepEqual(togtArmies(world, 'novice', 0), { bonus: world.bonus, novice: 0, guard: 0 });
});

test('a guard stands on the goal\'s territories that the player does not start with', () => {
  const grid = MAPS.italy;
  const map = G.prepareMap(grid.MAP);
  const rules = rulesFor(grid, MODERN);
  const togt = TOGTER[0];
  const setup = { players: ['A', 'B', 'C'], seed: 5, mode: 'mission' };
  const plain = G.newGame(map, rules, { ...setup, ...togtStart(map, togt, 1, 3) });
  const guarded = G.newGame(map, rules, { ...setup, ...togtStart(map, togt, 1, 3, 2) });
  const goal = new Set(togt.goal.flatMap((id) => map.regions.find((r) => r.id === id).members));
  map.territories.forEach((_, t) => {
    const extra = goal.has(t) && plain.owner[t] !== 1 ? 2 : 0;
    assert.equal(guarded.armies[t], plain.armies[t] + extra);
  });
  assert.ok(guarded.armies.reduce((a, b) => a + b) > plain.armies.reduce((a, b) => a + b));
});
