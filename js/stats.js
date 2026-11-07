// Medals and the player's numbers. A togt won on Let gives bronze, on Normal silver, on Svær gold
// (the hardest level won is kept in the progress, js/togter.js). The numbers count the games finished
// by one person against the computer: free games and togter alike. js/app.js saves them and shows them.

export const MEDALS = ['hard', 'medium', 'novice']; // gold, silver, bronze: the order they are shown in

// Each medal's metal: light face, dark edge.
const METAL = { novice: ['#dc9a62', '#8a4f24'], medium: ['#e9edf1', '#8f979f'], hard: ['#f4d27c', '#a8781f'] };

// A five-pointed star in the middle of the medal.
const STAR = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 ? 1.6 : 3.8;
  const a = (Math.PI / 5) * i - Math.PI / 2;
  return `${(12 + r * Math.cos(a)).toFixed(2)},${(21.5 + r * Math.sin(a)).toFixed(2)}`;
}).join(' ');

// The medal for a level: a red ribbon and a disc with a star.
export function medalIcon(level, cls = 'medal') {
  const [face, edge] = METAL[level];
  return `<svg class="${cls}" viewBox="0 0 24 32" aria-hidden="true">
    <polygon points="3,0 9.5,0 15,13 8.5,13" fill="#8e1f16"/><polygon points="21,0 14.5,0 9,13 15.5,13" fill="#b3291d"/>
    <circle cx="12" cy="21.5" r="9.6" fill="${face}" stroke="${edge}" stroke-width="1.6"/>
    <circle cx="12" cy="21.5" r="6.6" fill="none" stroke="${edge}" stroke-width=".8" opacity=".7"/>
    <polygon points="${STAR}" fill="${edge}"/>
  </svg>`;
}

// How many togter are won at each level: { hard, medium, novice }.
export function medalCounts(won) {
  const counts = { hard: 0, medium: 0, novice: 0 };
  for (const level of Object.values(won ?? {})) if (level in counts) counts[level]++;
  return counts;
}

// A medal is new when the togt is won on a harder level than before.
const RANK = { novice: 0, medium: 1, hard: 2 };
export const newMedal = (before, level) => (before === undefined || RANK[level] > RANK[before] ? level : null);

// played and won: games; taken: territories conquered; streak: wins in a row now, best: the most ever;
// fastest: { map: the fewest rounds a win on it has taken }.
export const newStats = () => ({ played: 0, won: 0, taken: 0, streak: 0, best: 0, fastest: {} });

export function recordGame(stats, { won, map, rounds, taken = 0 }) {
  const t = { ...newStats(), ...stats };
  t.fastest = { ...t.fastest };
  t.played++;
  t.taken += taken;
  if (won) {
    t.won++;
    t.streak++;
    t.best = Math.max(t.best, t.streak);
    if (!(t.fastest[map] <= rounds)) t.fastest[map] = rounds;
  } else t.streak = 0;
  return t;
}
