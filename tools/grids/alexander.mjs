// The grid for Alexander den Store (js/maps/alexander.js), drawn by tools/make-grid.mjs.

// The window: from southern Italy and Libya to beyond the Indus, from the Danube and the steppe
// down to Nubia and the Arabian Sea, so you can see where the campaign lies in Europe, Africa and
// Asia.
export const LAT_TOP = 48;
export const LAT_STEP = 0.4;
export const ROWS = 72;
export const LON_WEST = 10;
export const LON_EAST = 78;
export const SQUASH_AT = 34;

// Territory centres [lat, lon, letter]; '#' marks land outside the campaign.
export const CENTRES = [
  // Hellas
  [40.8, 22.3, 'P'], [38.3, 23.3, 'A'], [37.2, 22.2, 'S'], [41.4, 26.5, 'B'],
  [35.25, 24.8, 'S'], // Crete belongs to Sparta, all of it
  // Asia Minor
  [38.9, 28.2, 'r'], [37.2, 29.2, 'h'], [39.7, 32.8, 'g'], [37.4, 35.0, 't'],
  // The Levant
  [33.9, 35.7, 'T'], [34.8, 38.2, 'D'], [31.2, 34.6, 'G'],
  // Egypt
  [30.0, 31.0, 'M'], [29.2, 25.5, 'w'], [25.7, 32.6, 'e'],
  // Mesopotamia
  [32.6, 44.3, 'b'], [36.2, 43.8, 'a'], [30.8, 46.2, 'u'],
  // Persis
  [32.2, 48.5, 'z'], [29.9, 54.0, 'p'], [34.8, 49.0, 'k'],
  // Bactria
  [36.7, 66.9, 'x'], [39.6, 67.0, 'm'], [34.6, 61.0, 'i'],
  // India
  [34.2, 71.2, 'X'], [31.4, 73.6, 'H'], [25.4, 68.4, 'L'],
  [26.3, 63.8, 'L'], // and Patala reaches west over the Gedrosian desert
  // Unexplored, close round the campaign: the Balkans, the steppe, Armenia and the Caucasus, the
  // Syrian and Arabian deserts, Libya, Nubia, the Himalaya and India beyond the Indus.
  [43.8, 22.0, '#'], [43.8, 26.5, '#'], [40.8, 19.6, '#'], [44.5, 33.0, '#'], [44.0, 40.0, '#'],
  [40.6, 40.0, '#'], [40.0, 44.5, '#'], [41.5, 47.0, '#'], [43.0, 60.0, '#'], [43.0, 66.0, '#'], [41.8, 72.0, '#'],
  [32.0, 39.8, '#'], [28.5, 41.5, '#'], [25.0, 46.0, '#'], [24.0, 40.0, '#'], [23.5, 53.0, '#'], [23.0, 57.5, '#'],
  [30.8, 21.5, '#'], [27.0, 22.0, '#'], [23.5, 30.0, '#'], [23.4, 34.0, '#'],
  [35.8, 76.0, '#'], [29.0, 76.0, '#'], [24.0, 73.5, '#'],
  // and further out: Italy and Sicily, the Danube, the Pontic and Caspian steppe, Libya, Nubia,
  // southern Arabia and India.
  [41.0, 15.5, '#'], [44.5, 11.5, '#'], [37.5, 14.2, '#'], [46.0, 15.0, '#'], [46.5, 20.0, '#'], [47.0, 25.0, '#'],
  [46.5, 30.5, '#'], [47.0, 36.0, '#'], [45.0, 34.0, '#'], [43.0, 44.0, '#'], [46.0, 45.0, '#'], [46.5, 52.0, '#'],
  [46.5, 60.0, '#'], [46.5, 68.0, '#'], [46.0, 76.0, '#'], [38.0, 76.0, '#'], [32.5, 13.0, '#'], [27.5, 15.0, '#'],
  [32.3, 21.0, '#'], [22.0, 15.0, '#'], [22.5, 24.0, '#'], [21.0, 31.0, '#'], [21.0, 36.5, '#'], [21.0, 44.0, '#'],
  [21.0, 50.0, '#'], [21.5, 56.0, '#'], [21.5, 72.0, '#'], [21.5, 77.0, '#'], [26.0, 77.5, '#'],
];
export const FORCE_LAND = [];
export const FORCE_SEA = [];

// Crete, Cyprus, Rhodes and the Aegean islands join the territory nearest them.
export const ISLAND = 40;
export const ISLAND_REACH = 14;
