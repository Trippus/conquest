// Bot games: bots must only choose allowed actions, finish their games, and a game must replay
// exactly from its setup and actions (the base for saving and online play). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../../js/engine.js';
import { playBots } from '../../js/ai.js';
import { TEST_MAP } from '../../js/maps/test.js';
import { MODERN } from '../../js/rules/modern.js';

const map = G.prepareMap(TEST_MAP);
const names = ['A', 'B', 'C', 'D', 'E', 'F'];

test('bots finish games with 2–6 players', () => {
  for (let n = 2; n <= 6; n++) {
    for (let seed = 1; seed <= 10; seed++) {
      const { state } = playBots(map, MODERN, { players: names.slice(0, n), seed });
      assert.equal(state.phase, 'over', `${n} players, seed ${seed}`);
      assert.ok(state.owner.every((o) => o === state.winner));
    }
  }
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
