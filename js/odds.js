// Exact battle odds, for the bots (and later for showing the player their chances).
//
// One roll: every combination of dice is counted once, so the chances are exact. A blitz is then
// a chain of rolls, and winChance() adds up every way it can end.

const rolls = new Map();

// [lost by attacker, lost by defender, chance] for one roll with na against nd dice.
export function rollOutcomes(na, nd) {
  const key = `${na}:${nd}`;
  if (!rolls.has(key)) {
    const total = 6 ** (na + nd);
    const pairs = Math.min(na, nd);
    const count = Array(pairs + 1).fill(0);
    for (let i = 0; i < total; i++) {
      let x = i;
      const a = [];
      const d = [];
      for (let k = 0; k < na; k++) a.push(x % 6), (x = Math.floor(x / 6));
      for (let k = 0; k < nd; k++) d.push(x % 6), (x = Math.floor(x / 6));
      a.sort((p, q) => q - p);
      d.sort((p, q) => q - p);
      let lostA = 0;
      for (let k = 0; k < pairs; k++) if (a[k] <= d[k]) lostA++;
      count[lostA]++;
    }
    rolls.set(key, count.flatMap((n, lostA) => (n ? [[lostA, pairs - lostA, n / total]] : [])));
  }
  return rolls.get(key);
}

const blitz = new Map();

// Chance that a blitz takes the territory: `a` armies can attack (the territory's armies minus the
// one that must stay), `d` defend.
export function winChance(rules, a, d) {
  if (d <= 0) return 1;
  if (a <= 0) return 0;
  const key = `${rules.attackDice}${rules.defendDice}:${a}:${d}`;
  let p = blitz.get(key);
  if (p === undefined) {
    p = 0;
    for (const [lostA, lostD, q] of rollOutcomes(Math.min(rules.attackDice, a), Math.min(rules.defendDice, d))) {
      p += q * winChance(rules, a - lostA, d - lostD);
    }
    blitz.set(key, p);
  }
  return p;
}
