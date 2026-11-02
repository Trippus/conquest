// The grid for Kampen om Vesten (js/maps/west.js), drawn by tools/make-grid.mjs.

// The window: North America from the Pacific to the Atlantic, from Hudson Bay down to Guatemala, so
// the continent is plain to see. The campaign is the West; the rest is unexplored. (The window grew by
// an even number of rows and whole columns, so the campaign's cells stayed the same.)
export const LAT_TOP = 62.2;
export const LAT_STEP = 0.28;
export const ROWS = 172;
export const LON_WEST = -135.09668;
export const LON_EAST = -52;
export const SQUASH_AT = 37;

// Territory centres [lat, lon, letter]; '#' marks land outside the campaign.
export const CENTRES = [
  // The Mississippi: the States' western edge
  [39.0, -91.4, 'L'], [41.8, -91.6, 'L'], // and eastern Iowa
  [38.6, -94.6, 'I'],
  [35.0, -93.3, 'F'], [35.5, -95.8, 'F'], // Arkansas and the Indian Territory
  [30.4, -91.4, 'N'], [32.4, -92.4, 'N'],
  // Texas
  [32.0, -97.4, 'A'], [28.4, -98.8, 'S'], [30.6, -95.0, 'G'],
  // Comancheria
  [34.0, -102.0, 'l'], [35.4, -98.6, 'w'], [30.6, -102.6, 'p'],
  // The prairie
  [43.0, -105.6, 'R'], [41.6, -99.0, 'P'], [38.4, -102.4, 'B'],
  // Northern Mexico
  [25.0, -98.6, 'M'], [26.6, -101.6, 'X'], [28.6, -106.0, 'C'],
  // New Mexico
  [36.0, -105.6, 'T'], [32.4, -106.8, 'E'], [35.8, -111.0, 'K'],
  // Sonora: La Paz has Baja California's length
  [32.4, -111.4, 'U'], [28.8, -110.0, 'Y'],
  [29.8, -112.3, 'Y'], // the coast up the gulf, Guaymas's side
  [24.4, -110.8, 'Z'], [26.4, -112.2, 'Z'], [28.3, -113.6, 'Z'], [29.6, -114.7, 'Z'],
  // California
  [32.8, -116.3, 'D'], [31.3, -115.9, 'D'], [34.6, -117.6, 'O'], [36.6, -120.4, 'Q'], [39.8, -121.6, 'H'],
  // The Great Basin
  [43.5, -113.5, 'h'], [39.8, -111.8, 's'], [39.5, -117.0, 'n'],
  // Oregon
  [47.0, -122.8, 'V'], [43.8, -122.8, 'W'], [44.8, -118.8, 'a'], [47.8, -117.4, 'c'],
  // Unexplored: British North America and Vancouver Island, the northern plains, the old States east
  // of the Mississippi, Mexico to the south.
  [51.0, -122.5, '#'], [51.0, -117.5, '#'], [51.0, -112.0, '#'], [51.0, -106.0, '#'], [51.0, -100.0, '#'],
  [51.0, -94.0, '#'], [51.0, -89.0, '#'], [49.8, -125.5, '#'],
  [47.5, -111.0, '#'], [47.5, -106.5, '#'], [46.2, -101.0, '#'], [46.5, -97.0, '#'], [45.5, -93.0, '#'], [44.5, -89.5, '#'],
  [41.5, -88.3, '#'], [38.5, -88.3, '#'], [35.5, -88.3, '#'], [32.5, -88.4, '#'], [30.9, -87.8, '#'],
  [40.0, -85.5, '#'], [36.5, -85.5, '#'], [33.0, -85.5, '#'], [30.5, -85.5, '#'],
  [22.8, -98.7, '#'], [23.0, -101.5, '#'], [24.3, -104.5, '#'], [25.6, -108.0, '#'], [23.0, -105.8, '#'],
  // The rest of the continent: the north, Canada and the east, southern Mexico and the islands.
  [56, -131, '#'], [58, -124, '#'], [57, -116, '#'], [57, -108, '#'], [57, -100, '#'], [57, -92, '#'], [53, -87, '#'], [51.5, -80, '#'],
  [56, -76, '#'], [58, -70, '#'], [53, -72, '#'], [54, -63, '#'], [49, -72, '#'], [47.5, -67, '#'], [48.6, -56, '#'], [46.5, -61.5, '#'],
  [45, -64.5, '#'], [60, -134, '#'], [53.2, -132.1, '#'], [46.2, -84.5, '#'], [43.5, -84.5, '#'], [44.5, -78, '#'], [43, -75, '#'],
  [44.5, -70, '#'], [42, -72, '#'], [40.5, -76.5, '#'], [38.5, -77.5, '#'], [35.8, -79, '#'], [33.5, -81.5, '#'], [31, -83.5, '#'],
  [28.5, -81.6, '#'], [26, -80.8, '#'], [20.5, -100, '#'], [19.5, -103.5, '#'], [18.5, -97.5, '#'], [17, -99.5, '#'], [17, -94.5, '#'],
  [16.5, -91.5, '#'], [19.5, -89, '#'], [21, -88.5, '#'], [15, -90.5, '#'], [14.5, -87.5, '#'], [14.5, -84.5, '#'], [22.3, -80, '#'],
  [21, -76.5, '#'], [19, -71.5, '#'], [18.1, -77.3, '#'], [18.2, -66.5, '#'], [24.4, -77.9, '#'],
];
export const FORCE_LAND = [];

// Lakes, thick lines of [lat, lon] with half their width in degrees: the Great Lakes and Lake Winnipeg.
const lake = (from, to, half) => {
  const out = [];
  const [lo, hi] = [Math.min(from[0], to[0]) - half, Math.max(from[0], to[0]) + half];
  const [w, e] = [Math.min(from[1], to[1]) - half * 1.6, Math.max(from[1], to[1]) + half * 1.6];
  for (let lat = lo; lat <= hi; lat += 0.08) {
    for (let lon = w; lon <= e; lon += 0.08) {
      const k = Math.cos((lat * Math.PI) / 180);
      const [px, py, ax, ay, bx, by] = [lon * k, lat, from[1] * k, from[0], to[1] * k, to[0]];
      const t = Math.max(0, Math.min(1, ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)));
      if (Math.hypot(px - ax - t * (bx - ax), py - ay - t * (by - ay)) <= half) out.push([lat, lon]);
    }
  }
  return out;
};
const LAKES = [
  ...lake([46.8, -91.8], [47.5, -88.5], 0.7), ...lake([47.5, -88.5], [46.6, -84.8], 0.7), // Superior
  ...lake([41.8, -87.3], [45.5, -86.5], 0.55), // Michigan
  ...lake([43.3, -82.3], [45.9, -83.5], 0.6), ...lake([44.6, -80.5], [45.9, -81.2], 0.35), // Huron
  ...lake([41.7, -83.2], [42.7, -79.2], 0.3), // Erie
  ...lake([43.4, -79.6], [43.9, -76.4], 0.3), // Ontario
  ...lake([50.5, -96.8], [53.6, -98.6], 0.3), // Winnipeg
];

// Points every tenth of a degree from a to b.
const line = ([lat1, lon1], [lat2, lon2]) => {
  const n = Math.ceil(Math.max(Math.abs(lat2 - lat1), Math.abs(lon2 - lon1)) / 0.1);
  return Array.from({ length: n + 1 }, (_, i) => [lat1 + ((lat2 - lat1) * i) / n, lon1 + ((lon2 - lon1) * i) / n]);
};
// The straits round Vancouver Island stay open, so the island is British North America's, not Fort
// Vancouver's.
export const FORCE_SEA = [
  ...LAKES,
  ...line([48.3, -124.7], [48.3, -123.2]), // the Strait of Juan de Fuca
  ...line([48.3, -123.15], [48.85, -123.15]), // Haro Strait
  ...line([49.0, -123.4], [50.4, -125.4]), // the Strait of Georgia
  [48.76, -123.56], [48.48, -123.76], [48.48, -123.36], // and Victoria's corner, which would come loose
  // Specks far out, which no one could tell the owner of: San Miguel, Cedros, the Chandeleur Islands.
  [33.92, -120.13], [28.32, -115.27], [29.16, -89.15],
];

// Galveston Island, the Channel Islands and the islands of the gulfs join the territory nearest them.
export const ISLAND = 30;
export const ISLAND_REACH = 14;

// Drawn on the map, not played: the great rivers [lat, lon] from source to mouth.
export const RIVERS = [
  // the Mississippi, the Missouri and the Ohio
  [[47.2, -95.2], [45.0, -93.3], [43.0, -91.2], [41.5, -90.6], [39.0, -90.4], [37.0, -89.2], [35.0, -90.1], [33.0, -91.1], [31.0, -91.6],
    [30.0, -90.6], [29.0, -89.3]],
  [[45.9, -111.5], [47.8, -106.5], [47.8, -103.0], [46.8, -100.8], [44.4, -100.4], [42.8, -97.4], [41.3, -96.0], [39.1, -94.6], [38.8, -90.1]],
  [[40.4, -80.0], [39.0, -84.5], [38.2, -85.8], [37.0, -89.2]],
  // the Rio Grande, the Colorado and the Columbia
  [[37.8, -107.0], [35.7, -106.2], [32.3, -106.8], [29.6, -104.4], [29.8, -101.4], [26.5, -99.0], [25.95, -97.15]],
  [[40.2, -105.8], [39.0, -108.5], [38.2, -109.9], [36.9, -111.5], [36.1, -112.1], [36.0, -114.5], [34.5, -114.4], [32.7, -114.7], [31.8, -114.8]],
  [[50.5, -116.0], [49.0, -117.6], [46.1, -118.9], [45.7, -121.0], [46.2, -123.9]],
  // the St. Lawrence
  [[43.9, -76.3], [45.5, -73.6], [46.8, -71.2], [48.5, -69.0], [49.5, -67.0]],
];
