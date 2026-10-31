// Checks a map before it is played: every territory's size and neighbours, the region bonuses, sea
// routes that are not needed (the two already touch by land), and where the region names could go.
// Read it next to a screenshot: borders that are wrong show up here first (docs/nyt-kort.md).
//
// Run: npm run map-report -- <map>      (a map in js/maps/index.js, e.g. england)
import { MAPS } from '../js/maps/index.js';

const id = process.argv[2];
const grid = MAPS[id];
if (!grid) {
  console.error(`map: one of ${Object.keys(MAPS).join(', ')}`);
  process.exit(1);
}
const { GRID, TERRITORIES, SEA, MAP, hexNeighbours, cellAt } = grid;
const T = MAP.territories;
const name = (tid) => T[tid].name;
const cells = (l) => GRID.join('').split(l).length - 1;
const touches = (a, b) =>
  GRID.some((line, r) => [...line].some((c, col) => c === a && hexNeighbours(r, col).some(([nr, nc]) => cellAt(nr, nc) === b)));
const bySea = new Set(SEA.map(([a, b]) => [TERRITORIES[a][0], TERRITORIES[b][0]].sort().join('|')));
const sea = (a, b) => bySea.has([a, b].sort().join('|'));

console.log(`${grid.name}: ${Object.keys(T).length} territories in ${Object.keys(MAP.regions).length} regions, ${GRID[0].length} × ${GRID.length} cells\n`);
for (const [rid, region] of Object.entries(MAP.regions)) {
  const own = Object.entries(T).filter(([, t]) => t.region === rid);
  console.log(`${region.name} +${region.bonus}`);
  for (const [tid, t] of own) {
    const land = t.adj.filter((n) => !sea(tid, n)).map(name);
    const water = t.adj.filter((n) => sea(tid, n)).map(name);
    console.log(`  ${t.name.padEnd(13)} ${String(cells(t.letter)).padStart(3)} cells   land: ${land.join(', ') || '-'}${water.length ? `   sea: ${water.join(', ')}` : ''}`);
  }
}

const warnings = [];
for (const [a, b] of SEA) if (touches(a, b)) warnings.push(`sea route ${TERRITORIES[a][1]}–${TERRITORIES[b][1]}: they already touch by land`);
for (const t of Object.values(T)) if (!t.adj.length) warnings.push(`${t.name} has no neighbours`);
for (const t of Object.values(T)) if (cells(t.letter) < 3) warnings.push(`${t.name} is only ${cells(t.letter)} cell(s): the seal will cover it`);
for (const rid of Object.keys(MAP.regions)) if (!grid.REGION_PLACES?.[rid]) warnings.push(`no REGION_PLACES for ${MAP.regions[rid].name}`);
console.log(warnings.length ? `\nWatch out:\n  ${warnings.join('\n  ')}` : '\nNo warnings.');

// Region names: the place nearest the region's middle where the whole name sits on sea or
// unexplored land, two cells from any territory. A start; move them by hand where they crowd.
const dist = GRID.map((line) => [...line].map((c) => (c === '.' || c === '#' ? Infinity : 0)));
let edge = [];
GRID.forEach((line, r) => [...line].forEach((c, col) => dist[r][col] === 0 && edge.push([r, col])));
for (let d = 1; edge.length; d++) {
  const next = [];
  for (const [r, c] of edge) for (const [a, b] of hexNeighbours(r, c)) if (dist[a]?.[b] === Infinity) (dist[a][b] = d), next.push([a, b]);
  edge = next;
}
const free = (x, y) => {
  const r = Math.round((y - 1) / 1.5);
  const c = Math.round((x - Math.sqrt(3) / 2) / Math.sqrt(3) - 0.5 * (r & 1));
  return (dist[r]?.[c] ?? 0) >= 2;
};
const taken = [];
const places = {};
for (const [rid, region] of Object.entries(MAP.regions)) {
  const own = Object.values(T).filter((t) => t.region === rid);
  const mx = own.reduce((n, t) => n + t.x, 0) / own.length;
  const my = own.reduce((n, t) => n + t.y, 0) / own.length;
  const half = (region.name.length + 3) * 0.55 + 0.6;
  let best = null;
  for (let y = 2; y < grid.HEIGHT - 2; y += 0.5) {
    for (let x = half + 1; x < grid.WIDTH - half - 1; x += 0.5) {
      if (![-half, -half / 2, 0, half / 2, half].every((dx) => free(x + dx, y) && free(x + dx, y - 0.8) && free(x + dx, y + 0.5))) continue;
      if (taken.some((b) => Math.abs(b.x - x) < b.half + half && Math.abs(b.y - y) < 2.5)) continue;
      const d = Math.hypot(x - mx, y - my);
      if (!best || d < best.d) best = { d, x, y };
    }
  }
  if (best) {
    taken.push({ x: best.x, y: best.y, half });
    places[rid] = [best.x, best.y];
  }
}
console.log(`\nSuggested REGION_PLACES (map ${grid.WIDTH.toFixed(1)} × ${grid.HEIGHT.toFixed(1)} units):`);
console.log(`  ${JSON.stringify(places).replace(/"(\w+)":/g, '$1: ').replace(/,(?=\S)/g, ', ')}`);
