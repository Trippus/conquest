// The grid for Alexander den Store (js/maps/alexander.js), drawn by tools/make-grid.mjs.

// The window: from Greece to the Indus, from the Danube and the steppe down to Upper Egypt and the
// Arabian Sea.
export const LAT_TOP = 45;
export const LAT_STEP = 0.4;
export const ROWS = 56;
export const LON_WEST = 18;
export const LON_EAST = 76;
export const SQUASH_AT = 34;

// Territory centres [lat, lon, letter]; '#' marks land outside the campaign.
export const CENTRES = [
  // Hellas
  [40.8, 22.3, 'P'], [38.3, 23.3, 'A'], [37.2, 22.2, 'S'], [41.4, 26.5, 'B'],
  // Asia Minor
  [38.9, 28.2, 'r'], [37.2, 29.2, 'h'], [39.7, 32.8, 'g'], [37.4, 35.0, 't'],
  // The Levant
  [33.9, 35.7, 'T'], [34.8, 38.2, 'D'], [31.2, 34.6, 'G'],
  // Egypt
  [30.0, 31.0, 'M'], [29.2, 25.5, 'w'], [25.7, 32.6, 'e'],
  // Mesopotamia
  [32.6, 44.3, 'b'], [36.2, 43.8, 'a'], [30.8, 46.2, 'u'],
  // Persis
  [32.2, 48.5, 'z'], [29.9, 53.0, 'p'], [34.8, 48.5, 'k'],
  // Bactria
  [36.7, 66.9, 'x'], [39.6, 67.0, 'm'], [35.0, 60.5, 'i'],
  // India
  [34.2, 71.2, 'X'], [31.4, 73.6, 'H'], [25.4, 68.4, 'L'],
  // Unexplored: the Balkans and Italy, the steppe, Armenia and the Caucasus, the Syrian and Arabian
  // deserts, Libya, Nubia, the Lut desert, the Himalaya and India beyond the Indus.
  [43.8, 22.0, '#'], [43.8, 26.5, '#'], [40.5, 18.5, '#'], [44.5, 33.0, '#'], [44.0, 40.0, '#'],
  [40.6, 40.0, '#'], [40.0, 44.5, '#'], [41.5, 47.0, '#'], [43.0, 60.0, '#'], [43.0, 66.0, '#'], [41.8, 72.0, '#'],
  [32.0, 39.8, '#'], [28.5, 41.5, '#'], [25.0, 46.0, '#'], [24.0, 40.0, '#'], [23.5, 53.0, '#'], [23.0, 57.5, '#'],
  [30.8, 21.5, '#'], [27.0, 22.0, '#'], [23.5, 30.0, '#'], [23.4, 34.0, '#'],
  [31.2, 58.8, '#'],
  [35.8, 76.0, '#'], [29.0, 76.0, '#'], [24.0, 73.5, '#'],
];
export const FORCE_LAND = [];
export const FORCE_SEA = [];

// Crete, Cyprus, Rhodes and the Aegean islands join the territory nearest them.
export const ISLAND = 40;
export const ISLAND_REACH = 14;
