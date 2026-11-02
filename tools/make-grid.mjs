// Draws a map's hex grid from real coastlines and prints it, to paste into js/maps/<map>.js. The
// window, the territory centres and the islands are in tools/grids/<map>.mjs. Each land cell goes to
// the nearest territory centre on the same piece of land; land near an "unknown" centre ('#'), and
// land with no centre of its own, becomes '#': land outside the campaign, drawn as unexplored.
//
// Coastlines: Natural Earth 1:50m land (public domain), from the world-atlas package:
//   curl -L -o land-50m.json https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json
// Run: node tools/make-grid.mjs <map> path/to/land-50m.json   (map: vikings, england, …)
import { readFileSync } from 'node:fs';
import { hexCenter, hexNeighbours } from '../js/maps/hex.js';

const { LAT_TOP, LAT_STEP, ROWS, LON_WEST, LON_EAST, SQUASH_AT, CENTRES, FORCE_LAND = [], FORCE_SEA = [], ISLAND = 3, ISLAND_REACH = 6, RIVERS = [], ROADS = [], CARAVANS = [], SIGHTS = [] } =
  await import(`./grids/${process.argv[2]}.mjs`);
const SQUASH = Math.cos((SQUASH_AT * Math.PI) / 180);
const UNIT = LAT_STEP / 1.5; // degrees per map unit (a row is 1.5 units)
const COLS = Math.ceil(((LON_EAST - LON_WEST) * SQUASH) / UNIT / Math.sqrt(3));

/* ---------- the land polygons ---------- */

const topo = JSON.parse(readFileSync(process.argv[3], 'utf8'));
const { scale, translate } = topo.transform;
const arcs = topo.arcs.map((arc) => {
  let x = 0;
  let y = 0;
  return arc.map(([dx, dy]) => [(x += dx) * scale[0] + translate[0], (y += dy) * scale[1] + translate[1]]);
});
const ring = (ids) =>
  ids.flatMap((i) => {
    const a = i < 0 ? [...arcs[~i]].reverse() : arcs[i];
    return a.slice(0, -1);
  });
// A ring over the date line (Eurasia reaches past 180° in Chukotka) is unfolded, so its edges do
// not cut across the whole world.
const unfold = (r) => {
  const crosses = r.some(([a], i) => Math.abs(a - r[(i + 1) % r.length][0]) > 180);
  if (!crosses) return r;
  const east = r.reduce((n, [a]) => n + a, 0) > 0;
  return r.map(([a, b]) => [east && a < -100 ? a + 360 : !east && a > 100 ? a - 360 : a, b]);
};
const rings = topo.objects.land.geometries
  .flatMap((g) => (g.type === 'Polygon' ? [g.arcs] : g.arcs))
  .flatMap((poly) => poly.map((r) => unfold(ring(r))))
  .filter((r) => r.some(([lon, lat]) => lat > LAT_TOP - ROWS * LAT_STEP - 2 && lat < LAT_TOP + 2 && lon > LON_WEST - 30 && lon < LON_EAST + 10));

function isLand(lat, lon) {
  let inside = false;
  for (const r of rings) {
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i];
      const [xj, yj] = r[j];
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}

/* ---------- the grid ---------- */

// Map units to latitude and longitude, and back.
const toGeo = ([x, y]) => [LAT_TOP - (y - 1) * UNIT, LON_WEST + (x * UNIT) / SQUASH];
const toMap = (lat, lon) => [((lon - LON_WEST) * SQUASH) / UNIT, (LAT_TOP - lat) / UNIT + 1];
const landAt = isLand;
const near = (lat, lon, list) => list.some(([a, b]) => Math.abs(a - lat) < LAT_STEP / 2 && Math.abs(b - lon) < (UNIT * Math.sqrt(3)) / SQUASH / 2);

const land = [];
for (let row = 0; row < ROWS; row++) {
  land.push([]);
  for (let col = 0; col < COLS; col++) {
    const [x, y] = hexCenter(row, col);
    // The cell is land when its centre is, or most of a ring of points around it.
    const pts = [[x, y], ...[0, 1, 2, 3, 4, 5].map((i) => [x + 0.55 * Math.cos((i * Math.PI) / 3), y + 0.55 * Math.sin((i * Math.PI) / 3)])];
    const hits = pts.filter((p) => landAt(...toGeo(p))).length;
    const [lat, lon] = toGeo([x, y]);
    let l = landAt(lat, lon) || hits >= 4;
    if (near(lat, lon, FORCE_LAND)) l = true;
    if (near(lat, lon, FORCE_SEA)) l = false;
    land[row].push(l);
  }
}

// Pieces of land, so a centre only takes cells it can walk to.
const piece = land.map((r) => r.map(() => -1));
let pieces = 0;
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (!land[r][c] || piece[r][c] >= 0) continue;
    const stack = [[r, c]];
    piece[r][c] = pieces;
    while (stack.length) {
      const [a, b] = stack.pop();
      for (const [na, nb] of hexNeighbours(a, b)) {
        if (land[na]?.[nb] && piece[na][nb] < 0) (piece[na][nb] = pieces), stack.push([na, nb]);
      }
    }
    pieces++;
  }
}

const centres = CENTRES.map(([lat, lon, letter]) => {
  const [x, y] = toMap(lat, lon);
  let best = null;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (!land[r][c]) continue;
      const [cx, cy] = hexCenter(r, c);
      const d = Math.hypot(cx - x, cy - y);
      if (!best || d < best.d) best = { d, r, c };
    }
  return { letter, x, y, piece: piece[best.r][best.c] };
});

// A small island with no centre of its own joins the nearest territory close by.
const size = Array(pieces).fill(0);
land.forEach((line, r) => line.forEach((isL, c) => isL && size[piece[r][c]]++));

const grid = land.map((line, r) =>
  line
    .map((isL, c) => {
      if (!isL) return '.';
      const [x, y] = hexCenter(r, c);
      const own = centres.some((k) => k.piece === piece[r][c]);
      let best = null;
      for (const k of centres) {
        if (own ? k.piece !== piece[r][c] : size[piece[r][c]] > ISLAND) continue;
        const d = Math.hypot(k.x - x, k.y - y);
        if (!best || d < best.d) best = { d, letter: k.letter };
      }
      return best && (own || best.d < ISLAND_REACH) ? best.letter : '#';
    })
    .join(''),
);
console.log(`// ${ROWS} rows × ${COLS} columns`);
for (const line of grid) console.log(`  '${line}',`);

// Rivers, roads, caravans and sights, drawn but not played, in map units for the map file.
const units = ([lat, lon]) => toMap(lat, lon).map((v) => +v.toFixed(2));
if (RIVERS.length) console.log(`export const RIVERS = ${JSON.stringify(RIVERS.map((r) => r.map(units)))};`);
if (ROADS.length) console.log(`export const ROADS = ${JSON.stringify(ROADS.map((r) => r.map(units)))};`);
if (CARAVANS.length) console.log(`export const CARAVANS = ${JSON.stringify(CARAVANS.map(units))};`);
if (SIGHTS.length) console.log(`export const SIGHTS = ${JSON.stringify(SIGHTS.map(([lat, lon, kind]) => [...units([lat, lon]), kind]))};`);
