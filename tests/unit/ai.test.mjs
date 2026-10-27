// Bot games: bots must only choose allowed actions, finish their games, and a game must replay
// exactly from its setup and actions (the base for saving and online play). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import { playBots, LEVELS } from '../../js/ai.js';
import { TEST_MAP } from '../../js/maps/test.js';
import { TEST_LARGE } from '../../js/maps/test-large.js';
import { MODERN } from '../../js/rules/modern.js';

const map = G.prepareMap(TEST_MAP);
const large = G.prepareMap(TEST_LARGE);
const names = ['A', 'B', 'C', 'D', 'E', 'F'];

test('the large test map is valid', () => {
  assert.deepEqual(G.validateMap(TEST_LARGE), []);
  assert.equal(large.territories.length, 30);
});

test('bots of every level finish games with 2–6 players', () => {
  for (const level of LEVELS) {
    for (let n = 2; n <= 6; n++) {
      for (let seed = 1; seed <= 10; seed++) {
        const { state } = playBots(map, MODERN, { players: names.slice(0, n), seed }, Array(n).fill(level));
        assert.equal(state.phase, 'over', `${level}, ${n} players, seed ${seed}`);
        assert.ok(state.owner.every((o) => o === state.winner));
      }
    }
  }
});

test('mixed bots finish games on the large map', () => {
  for (let seed = 1; seed <= 5; seed++) {
    const { state } = playBots(large, MODERN, { players: names.slice(0, 4), seed }, ['hard', 'medium', 'novice', 'medium']);
    assert.equal(state.phase, 'over');
  }
});

// The games are seeded, so this is the same 300 games every time. The hard bot wins about 1.3
// times its fair share; the test only asks for clearly more than fair.
test('the hard bot beats medium bots more often than its fair share', () => {
  let wins = 0;
  const games = 300;
  for (let g = 0; g < games; g++) {
    const seat = g % 3;
    const levels = ['medium', 'medium', 'medium'];
    levels[seat] = 'hard';
    const { state } = playBots(large, { ...MODERN, maxRounds: 150 }, { players: names.slice(0, 3), seed: 900 + g }, levels);
    if (state.winner === seat) wins++;
  }
  assert.ok(wins / games > 0.4, `hard won ${wins} of ${games} (fair share is a third)`);
});

test('a game replays exactly from its setup and actions', () => {
  const setup = { players: names.slice(0, 4), seed: 2026 };
  const { state, actions } = playBots(map, MODERN, setup);
  const again = G.replay(map, MODERN, setup, JSON.parse(JSON.stringify(actions)));
  assert.deepEqual(again, state);
});

test('a saved game continues as if it was never saved', () => {
  const setup = { players: names.slice(0, 3), seed: 11 };
  const { state, actions } = playBots(map, MODERN, setup);
  const half = G.replay(map, MODERN, setup, actions.slice(0, actions.length >> 1));
  let s = JSON.parse(JSON.stringify(half));
  for (const a of actions.slice(actions.length >> 1)) s = G.apply(map, MODERN, s, a).state;
  assert.deepEqual(s, state);
});
