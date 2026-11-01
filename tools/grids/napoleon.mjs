// The grid for Napoleonskrigene (js/maps/napoleon.js), drawn by tools/make-grid.mjs.

// The window: Europe from Portugal and Ireland to beyond Moscow, from the coast of North Africa and
// Asia Minor up to the middle of Norway and Finland.
export const LAT_TOP = 64;
export const LAT_STEP = 0.28;
export const ROWS = 108;
export const LON_WEST = -12;
export const LON_EAST = 46;
export const SQUASH_AT = 50;

// Territory centres [lat, lon, letter]; '#' marks land outside the campaign.
export const CENTRES = [
  // France
  [48.85, 2.35, 'P'], [52.2, 5.3, 'A'], [50.8, 4.3, 'A'], [45.8, 4.9, 'L'], [44.8, -0.6, 'B'],
  [47.8, -2.5, 'B'], // Brittany and the Loire, Bordeaux's side
  [49.8, 2.2, 'P'], // Picardy to Paris: a border that bends
  [43.6, 5.4, 'M'], [42.1, 9.1, 'M'], // Provence and Corsica, Napoleon's island
  // Iberia
  [40.4, -3.7, 'D'], [42.6, -5.5, 'D'], [39.0, -8.5, 'l'], [41.2, -8.2, 'l'], [37.3, -5.6, 'C'], [41.6, 1.5, 'b'],
  // Italy
  [45.5, 9.2, 'I'], [45.4, 12.0, 'I'], [42.3, 12.6, 'R'], [40.8, 15.0, 'N'], [37.6, 14.0, 'p'],
  // The Confederation of the Rhine
  [51.0, 9.5, 'K'], [53.2, 9.5, 'K'], [48.3, 11.5, 'U'], [51.0, 13.5, 'd'],
  // Prussia
  [52.6, 13.4, 'E'], [54.0, 12.6, 'E'], // and the coast at Rostock
  [51.8, 14.3, 'E'], [51.75, 13.2, 'E'], [51.7, 12.1, 'd'], // Lusatia to Berlin, Leipzig to Dresden: a border that bends
  [54.3, 16.5, 'k'], // Pomerania to Danzig, Königsberg's coast
  [54.5, 21.0, 'k'], [52.2, 21.0, 'W'],
  // Austria
  [48.0, 16.0, 'V'], [49.8, 14.8, 'G'], [47.3, 19.5, 'H'], [46.5, 23.5, 'H'],
  [45.2, 14.6, 'V'], // Istria and Fiume, Vienna's way to the sea
  [45.3, 17.8, 'H'], // Slavonia, Buda's down to the Sava
  // Russia
  [59.5, 30.5, 'S'], [61.5, 25.5, 'S'], // and Finland, Russian from 1809
  [56.9, 24.5, 'g'], [55.2, 25.5, 'g'], [58.4, 22.6, 'g'], [54.8, 32.0, 's'], [55.8, 37.6, 'm'], [50.4, 30.5, 'v'],
  // Britain
  [52.0, -1.0, 'O'], [56.5, -4.0, 'e'], [57.6, -7.0, 'e'], [53.2, -7.5, 'u'],
  // Scandinavia
  [56.0, 9.3, 'c'], [55.5, 11.8, 'c'], [60.5, 9.5, 'n'], [58.5, 7.8, 'n'], [62.5, 8.0, 'n'],
  [59.5, 16.5, 'h'], [57.5, 14.0, 'h'], [62.5, 16.0, 'h'], [56.7, 16.6, 'h'], [55.8, 13.6, 'h'], // and Öland and Skåne
  // Unexplored: North Africa, Sardinia, the Ottoman Empire and the Balkans, the steppe and the Volga,
  // the Russian north.
  [34.5, -5.0, '#'], [35.5, 0.0, '#'], [36.0, 4.0, '#'], [36.0, 9.5, '#'],
  [40.0, 9.0, '#'],
  [43.4, 18.2, '#'], [43.2, 21.6, '#'], [44.5, 25.5, '#'], [42.5, 25.0, '#'], [41.0, 22.0, '#'], [39.0, 22.0, '#'],
  [39.5, 30.0, '#'], [38.0, 35.0, '#'], [41.0, 29.0, '#'],
  [45.6, 28.6, '#'], [46.5, 33.0, '#'], [45.0, 34.0, '#'], [48.5, 38.0, '#'], [47.5, 43.0, '#'], [44.0, 42.0, '#'],
  [52.5, 43.5, '#'], [56.0, 44.0, '#'], [59.5, 42.0, '#'], [62.5, 38.0, '#'], [63.0, 33.0, '#'],
];
export const FORCE_LAND = [];
// Bornholm, a speck under the route from København to Königsberg, is left out.
export const FORCE_SEA = [
  [54.95, 14.60], [54.95, 14.80], [54.95, 15.00], [54.95, 15.20], [55.09, 14.60],
  [55.09, 14.80], [55.09, 15.00], [55.09, 15.20], [55.23, 14.60], [55.23, 14.80],
  [55.23, 15.00], [55.23, 15.20],
];

// Corsica, Sicily, the Balearics, Gotland and the Danish islands join the territory nearest them.
export const ISLAND = 30;
export const ISLAND_REACH = 10;
