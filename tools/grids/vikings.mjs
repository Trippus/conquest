// The grid for Vikingetogtet (js/maps/vikings.js), drawn by tools/make-grid.mjs.

// The window: from LAT_TOP down ROWS rows of LAT_STEP degrees, and from LON_WEST to LON_EAST.
// Longitude is shortened by cos(SQUASH_AT) so the land keeps its shape.
export const LAT_TOP = 72;
export const LAT_STEP = 0.5;
export const ROWS = 72; // down to the Mediterranean
export const LON_WEST = -46;
export const LON_EAST = 41;
export const SQUASH_AT = 58;

// Territory centres [lat, lon, letter]; '#' marks land outside the campaign.
export const CENTRES = [
  [62, -45, 'G'], [70, -27, '#'], [64.9, -18.5, 'I'], [62.05, -6.9, 'x'], [59.0, -3.0, 'O'], [53.3, -8, 'R'],
  [57.0, -4.3, 'S'], [54.8, -1.8, 'N'], [52.6, -2.4, 'M'], [52.4, 0.8, 'E'], [51.0, -2.0, 'W'],
  [49.1, 0.3, 'n'], [53.2, 6.8, 'f'], [51.0, 3.9, 'L'], [48.2, -3.0, 'B'],
  [56.2, 9.1, 'j'], [55.4, 11.7, 'o'], [55.9, 13.7, 'k'],
  [54.0, 10.8, 'H'], [54.0, 15.5, 'P'], [54.6, 20.8, 'p'],
  [60.8, 6.2, 'v'], [59.6, 10.6, 'w'], [63.4, 10.8, 't'], [68.5, 17.5, 'h'],
  [60.4, 16.8, 'u'], [57.6, 14.2, 'g'], [57.5, 18.5, 'l'],
  [61.4, 25.2, 'F'], [66.6, 26.5, 'F'], [70.2, 25.0, 'h'], [56.9, 22.4, 'K'], [58.6, 25.6, 'e'], [58.8, 32.0, 'Z'],
  // Unexplored: inland behind the southern coast, Russia beyond Gardarike, and Europe down to the
  // Mediterranean.
  [47.0, 2.5, '#'], [48.7, 4.0, '#'], [50.0, 7.5, '#'], [51.6, 10.0, '#'], [52.0, 13.0, '#'], [52.3, 16.5, '#'],
  [52.3, 20.0, '#'], [53.3, 23.5, '#'], [55.0, 26.5, '#'], [53.5, 29.5, '#'], [55.5, 36.5, '#'], [61.5, 39.0, '#'],
  [64.5, 35.0, '#'], [68.6, 35.0, '#'], [47.5, 10, '#'], [45, 0, '#'], [44, 5, '#'], [43, -4, '#'], [40, -4, '#'],
  [38, -5, '#'], [44, 11, '#'], [41, 15, '#'], [45, 20, '#'], [42, 24, '#'], [39, 22, '#'], [47, 15, '#'],
  [47, 24, '#'], [50, 30, '#'], [45, 30, '#'], [48, 36, '#'], [39, 35, '#'],
];
// Small islands the grid would miss, and the narrow Øresund it would close. Shetland stays out:
// a speck of Orkney far out at sea only confused the sea routes.
export const FORCE_LAND = [[62.05, -6.9], [59.0, -3.0], [57.4, 18.5], [57.75, 18.8]];
export const FORCE_SEA = [[55.6, 12.75], [56.0, 12.65], [55.3, 12.85], [60.3, -1.3], [60.6, -1.2], [60.0, -1.3], [71.0, -8.4], [70.9, -8.0]];

// A piece of land with no centre of its own and at most ISLAND cells (Bornholm) joins the nearest
// territory within ISLAND_REACH map units; bigger ones are unexplored.
export const ISLAND = 3;
export const ISLAND_REACH = 6;
