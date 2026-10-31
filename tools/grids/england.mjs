// The grid for Kampen om England (js/maps/england.js), drawn by tools/make-grid.mjs.

// The window: from Orkney down to Brittany, from the west of Ireland to Jutland and the tip of Norway.
export const LAT_TOP = 59.6;
export const LAT_STEP = 0.2;
export const ROWS = 63;
export const LON_WEST = -11;
export const LON_EAST = 9;
export const SQUASH_AT = 54;

// Territory centres [lat, lon, letter]; '#' marks land outside the campaign.
export const CENTRES = [
  // Wessex
  [51.2, -1.8, 'W'], [50.95, -0.3, 's'], [51.2, 0.9, 'k'], [50.4, -4.8, 'c'], [50.8, -3.8, 'c'],
  // Mercia
  [52.6, -1.6, 'M'], [53.3, -2.6, 'M'], [52.0, -2.3, 'h'], [53.3, -0.4, 'L'],
  // East Anglia
  [52.7, 1.0, 'N'], [52.2, 1.0, 'u'], [51.8, 0.5, 'e'],
  // Northumbria
  [54.0, -1.2, 'Y'], [55.2, -1.9, 'B'], [54.5, -3.0, 'C'],
  // Wales
  [52.9, -3.9, 'g'], [52.4, -3.3, 'p'], [51.9, -4.2, 'd'],
  // Scotland
  [55.8, -3.0, 'l'], [55.6, -4.6, 'S'], [57.3, -4.5, 'H'], [59.0, -3.0, 'O'],
  // Ireland
  [53.4, -6.5, 'D'], [52.3, -8.5, 'm'], [54.7, -6.8, 'U'],
  // Normandy and its neighbours
  [49.1, -0.3, 'n'], [48.2, -3.0, 'b'], [50.9, 3.3, 'f'],
  // Unexplored: the rest of France, the Low Countries, Germany and Jutland (Norway is an island here).
  [47.6, 1.0, '#'], [48.7, 2.4, '#'], [49.6, 3.8, '#'], [50.2, 5.0, '#'], [52.3, 5.5, '#'], [51.5, 7.5, '#'],
  [56.0, 9.0, '#'],
];
export const FORCE_LAND = [[59.0, -3.0]];
export const FORCE_SEA = [];

// The Hebrides, Man, Wight and the Channel Islands join the territory nearest them.
export const ISLAND = 60;
export const ISLAND_REACH = 25;
