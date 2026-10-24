// Battle odds in js/odds.js against the known values for this dice game. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rollOutcomes, winChance } from '../../js/odds.js';
import { MODERN } from '../../js/rules/modern.js';

const near = (actual, expected, msg) => assert.ok(Math.abs(actual - expected) < 0.0005, `${msg}: ${actual} ≠ ${expected}`);
const chances = (na, nd) => Object.fromEntries(rollOutcomes(na, nd).map(([lostA, , p]) => [lostA, p]));

test('one roll: the published chances', () => {
  const r32 = chances(3, 2);
  near(r32[0], 2890 / 7776, '3 v 2, defender loses 2');
  near(r32[1], 2611 / 7776, '3 v 2, one each');
  near(r32[2], 2275 / 7776, '3 v 2, attacker loses 2');
  near(chances(1, 1)[0], 15 / 36, '1 v 1, attacker wins');
  near(chances(2, 1)[0], 125 / 216, '2 v 1, attacker wins');
  near(chances(3, 1)[0], 855 / 1296, '3 v 1, attacker wins');
});

test('the chances of every roll add up to 1', () => {
  for (let na = 1; na <= 3; na++) {
    for (let nd = 1; nd <= 2; nd++) {
      near(rollOutcomes(na, nd).reduce((n, [, , p]) => n + p, 0), 1, `${na} v ${nd}`);
    }
  }
});

test('blitz: no attackers never wins, no defenders always does, more attackers win more often', () => {
  assert.equal(winChance(MODERN, 0, 3), 0);
  assert.equal(winChance(MODERN, 3, 0), 1);
  near(winChance(MODERN, 1, 1), 15 / 36, 'one against one');
  for (let d = 1; d <= 10; d++) {
    for (let a = 1; a < 20; a++) assert.ok(winChance(MODERN, a + 1, d) > winChance(MODERN, a, d));
  }
  assert.ok(winChance(MODERN, 10, 10) > 0.5, 'the attacker has the edge in long battles');
});
