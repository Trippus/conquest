// The grid for Kampen om Vesten (js/maps/west.js), drawn by tools/make-grid.mjs.

// The window: North America from the Pacific to beyond the Mississippi, from British North America
// down to the middle of Mexico.
export const LAT_TOP = 51;
export const LAT_STEP = 0.28;
export const ROWS = 102;
export const LON_WEST = -127;
export const LON_EAST = -84.5;
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
];
export const FORCE_LAND = [];

// Points every tenth of a degree from a to b.
const line = ([lat1, lon1], [lat2, lon2]) => {
  const n = Math.ceil(Math.max(Math.abs(lat2 - lat1), Math.abs(lon2 - lon1)) / 0.1);
  return Array.from({ length: n + 1 }, (_, i) => [lat1 + ((lat2 - lat1) * i) / n, lon1 + ((lon2 - lon1) * i) / n]);
};
// The straits round Vancouver Island stay open, so the island is British North America's, not Fort
// Vancouver's.
export const FORCE_SEA = [
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
