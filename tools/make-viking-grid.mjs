// Draws the Viking map's hex grid from real coastlines and prints it, to paste into
// js/maps/vikings.js. Each land cell goes to the nearest territory centre on the same piece of land;
// land with no centre of its own, and land near an "unknown" centre, becomes '#': land outside the
// campaign, drawn as unexplored.
//
// Coastlines: Natural Earth 1:50m land (public domain), from the world-atlas package:
//   curl -L -o land-50m.json https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json
// Run: node tools/make-viking-grid.mjs path/to/land-50m.json
import { readFileSync } from 'node:fs';
import { hexCenter, hexNeighbours } from '../js/maps/hex.js';

// The window and the projection. A row is LAT_STEP degrees of latitude; across, longitude is
// shortened by cos(58°) so the North looks right. Greenland can be moved GREENLAND_SHIFT degrees
// east, so the map is not mostly empty ocean (0: where it is; more moves it into Iceland's way).
const LAT_TOP = 72;
const LAT_STEP = 0.5;
const ROWS = 72; // down to the Mediterranean
const LON_WEST = -46;
const LON_EAST = 41;
const SQUASH = Math.cos((58 * Math.PI) / 180);
const GREENLAND_SHIFT = 0;
const UNIT = LAT_STEP / 1.5; // degrees per map unit (a row is 1.5 units)
const COLS = Math.ceil(((LON_EAST - LON_WEST) * SQUASH) / UNIT / Math.sqrt(3));
const isGreenland = (lat, lon) => lon < -26 || (lon < -19 && lat > 66.7);

// Territory centres [lat, lon, letter]; '#' marks land outside the campaign.
const CENTRES = [
  [64, -42, 'G'], [64.9, -18.5, 'I'], [62.05, -6.9, 'x'], [59.0, -3.0, 'O'], [53.3, -8, 'R'],
  [57.0, -4.3, 'S'], [54.8, -1.8, 'N'], [52.6, -2.4, 'M'], [52.4, 0.8, 'E'], [51.0, -2.0, 'W'],
  [49.1, 0.3, 'n'], [53.2, 6.8, 'f'], [51.0, 3.9, 'L'], [48.2, -3.0, 'B'],
  [56.2, 9.1, 'j'], [55.4, 11.7, 'o'], [55.9, 13.7, 'k'],
  [54.0, 10.8, 'H'], [54.0, 15.5, 'P'], [54.6, 20.8, 'p'],
  [60.8, 6.2, 'v'], [59.6, 10.6, 'w'], [63.4, 10.8, 't'], [68.5, 17.5, 'h'],
  [60.4, 16.8, 'u'], [57.6, 14.2, 'g'], [57.5, 18.5, 'l'],
  [61.4, 25.2, 'F'], [56.9, 22.4, 'K'], [58.6, 25.6, 'e'], [58.8, 32.0, 'Z'],
  // Unexplored: inland behind the southern coast, Russia beyond Gardarike, and Europe down to the
  // Mediterranean.
  [47.0, 2.5, '#'], [48.7, 4.0, '#'], [50.0, 7.5, '#'], [51.6, 10.0, '#'], [52.0, 13.0, '#'], [52.3, 16.5, '#'],
  [52.3, 20.0, '#'], [53.3, 23.5, '#'], [55.0, 26.5, '#'], [53.5, 29.5, '#'], [55.5, 36.5, '#'], [61.5, 39.0, '#'],
  [64.5, 33.5, '#'], [68.0, 34.0, '#'], [47.5, 10, '#'], [45, 0, '#'], [44, 5, '#'], [43, -4, '#'], [40, -4, '#'],
  [38, -5, '#'], [44, 11, '#'], [41, 15, '#'], [45, 20, '#'], [42, 24, '#'], [39, 22, '#'], [47, 15, '#'],
  [47, 24, '#'], [50, 30, '#'], [45, 30, '#'], [48, 36, '#'], [39, 35, '#'],
];
// Small islands the grid would miss, and the narrow Øresund it would close. Shetland stays out:
// a speck of Orkney far out at sea only confused the sea routes.
const FORCE_LAND = [[62.05, -6.9], [59.0, -3.0], [57.4, 18.5], [57.75, 18.8]];
const FORCE_SEA = [[55.6, 12.75], [56.0, 12.65], [55.3, 12.85], [60.3, -1.3], [60.6, -1.2], [60.0, -1.3], [71.0, -8.4], [70.9, -8.0]];

/* ---------- the land polygons ---------- */

const topo = JSON.parse(readFileSync(process.argv[2], 'utf8'));
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
  .filter((r) => r.some(([lon, lat]) => lat > 40 && lat < 80 && lon > -75 && lon < 50));

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
const landAt = (lat, lon) => {
  if (isGreenland(lat, lon - GREENLAND_SHIFT)) return isLand(lat, lon - GREENLAND_SHIFT);
  return !isGreenland(lat, lon) && isLand(lat, lon);
};
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
  const shift = letter === 'G' ? GREENLAND_SHIFT : 0;
  const [x, y] = toMap(lat, lon + shift);
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

// A small island with no centre of its own (Shetland, Bornholm) joins the nearest territory close by.
const size = Array(pieces).fill(0);
land.forEach((line, r) => line.forEach((isL, c) => isL && size[piece[r][c]]++));
const ISLAND = 3; // cells
const ISLAND_REACH = 6; // map units

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
