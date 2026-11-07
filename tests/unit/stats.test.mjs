// Medals and the numbers of the games played (js/stats.js). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MEDALS, medalIcon, medalCounts, newMedal, newStats, recordGame } from '../../js/stats.js';

test('a togt won on Let, Normal and Svær gives bronze, silver and gold, counted by the hardest win', () => {
  assert.deepEqual(medalCounts({ italy: 'novice', alexander: 'hard', vikings: 'novice', england: 'medium' }), { hard: 1, medium: 1, novice: 2 });
  assert.deepEqual(medalCounts({}), { hard: 0, medium: 0, novice: 0 });
  for (const m of MEDALS) assert.match(medalIcon(m), /^<svg/);
});

test('a medal is new only when the togt is won on a harder level than before', () => {
  assert.equal(newMedal(undefined, 'novice'), 'novice');
  assert.equal(newMedal('novice', 'medium'), 'medium');
  assert.equal(newMedal('medium', 'medium'), null);
  assert.equal(newMedal('hard', 'novice'), null);
});

test('the numbers count games, wins, streaks, conquests and the fastest win on each map', () => {
  let t = newStats();
  t = recordGame(t, { won: true, map: 'italy', rounds: 7, taken: 12 });
  t = recordGame(t, { won: true, map: 'italy', rounds: 5, taken: 9 });
  t = recordGame(t, { won: false, map: 'world', rounds: 9, taken: 4 });
  t = recordGame(t, { won: true, map: 'italy', rounds: 8, taken: 10 });
  assert.deepEqual(t, { played: 4, won: 3, taken: 35, streak: 1, best: 2, fastest: { italy: 5 } });
  // old saves without numbers start from nothing
  assert.equal(recordGame(undefined, { won: false, map: 'world', rounds: 3 }).played, 1);
});
