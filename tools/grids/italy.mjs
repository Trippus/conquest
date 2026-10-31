// The grid for Roms samling af Italien (js/maps/italy.js), drawn by tools/make-grid.mjs.

// The window: the whole Mediterranean, from Gaul and the Alps down to the Sahara, from Spain to
// Egypt, so you can see where Italy lies. The campaign itself is Italy, its islands and Carthage.
export const LAT_TOP = 49;
export const LAT_STEP = 0.25;
export const ROWS = 76;
export const LON_WEST = -2;
export const LON_EAST = 31;
export const SQUASH_AT = 41;

// Territory centres [lat, lon, letter]; '#' marks land outside the campaign.
export const CENTRES = [
  // Latium
  [41.9, 12.6, 'R'], [43.2, 11.2, 'E'], [40.9, 14.4, 'C'],
  // Samnium
  [41.7, 14.8, 'S'], [41.1, 16.0, 'A'], [43.1, 13.6, 'P'],
  // Magna Graecia
  [40.4, 17.4, 'T'], [40.3, 15.9, 'L'], [39.0, 16.4, 'B'],
  // Gallia Cisalpina
  [45.5, 9.2, 'M'], [45.6, 12.0, 'V'], [44.3, 8.5, 'G'], [44.6, 11.2, 'n'],
  // Umbria
  [42.9, 12.4, 'U'], [42.3, 13.1, 'b'],
  // Sicily
  [37.1, 14.9, 's'], [38.0, 13.4, 'p'], [37.8, 12.6, 'y'],
  // Sardinia and Corsica
  [40.0, 9.0, 'd'], [42.1, 9.1, 'k'],
  // Carthage
  [36.8, 10.1, 'K'], [36.4, 7.4, 'N'], [35.4, 10.4, 'z'],
  // Unexplored, close round the campaign: Gaul, the Alps, Illyria, and Africa beyond Carthage.
  [45.0, 5.6, '#'], [46.5, 7.0, '#'], [46.6, 9.8, '#'], [46.7, 13.0, '#'], [45.9, 14.2, '#'], [44.5, 15.8, '#'],
  [42.6, 19.0, '#'], [39.8, 20.4, '#'], [34.7, 8.6, '#'], [34.8, 6.0, '#'], [34.6, 10.8, '#'], [36.0, 3.5, '#'],
  [33.6, 10.5, '#'], [32.5, 13.0, '#'],
  // and further out: Spain, Gaul to the north, Germania, the Balkans, Greece, Asia Minor, Libya, Egypt.
  [40.0, -1.0, '#'], [38.5, -1.0, '#'], [46.5, 2.0, '#'], [48.0, 5.0, '#'], [44.0, 0.5, '#'], [43.5, 3.5, '#'],
  [48.3, 9.5, '#'], [48.3, 13.5, '#'], [47.5, 17.0, '#'], [46.0, 18.5, '#'], [44.0, 20.5, '#'], [42.0, 22.5, '#'],
  [41.5, 26.0, '#'], [43.5, 27.0, '#'], [39.0, 22.0, '#'], [37.5, 22.5, '#'], [39.0, 29.0, '#'], [38.0, 27.0, '#'],
  [34.0, 1.0, '#'], [33.5, 4.5, '#'], [32.0, 7.5, '#'], [31.0, 17.0, '#'], [31.0, 22.0, '#'], [30.5, 27.0, '#'],
  [30.5, 30.5, '#'],
];
export const FORCE_LAND = [];
// Elba, Capraia and the other islets off Etruria stay out: specks of Corsica far from it only
// confused the sea routes (as Shetland did on the England map).
export const FORCE_SEA = [[42.78, 10.25], [43.05, 9.84], [42.36, 10.92], [42.59, 10.1], [43.43, 9.9], [43.0, 9.44]];

// Elba, Malta and the small islands join the territory nearest them.
export const ISLAND = 30;
export const ISLAND_REACH = 20;
