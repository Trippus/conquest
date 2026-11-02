// The grid for Songhai (js/maps/songhai.js), drawn by tools/make-grid.mjs.

// The window: West Africa from the Atlantic to beyond Lake Chad, from the south of Morocco down to
// the Gulf of Guinea.
export const LAT_TOP = 29.5;
export const LAT_STEP = 0.26;
export const ROWS = 98;
export const LON_WEST = -18;
export const LON_EAST = 16.5;
export const SQUASH_AT = 16;

// Territory centres [lat, lon, letter]; '#' marks land outside the campaign.
export const CENTRES = [
  // Songhai
  [16.6, 0.4, 'G'], [14.0, 1.8, 'T'], [11.6, 3.4, 'D'],
  // The bend of the Niger
  [16.6, -3.3, 'B'], [19.8, -3.8, 'A'], [15.2, -1.2, 'H'],
  // The inland delta
  [14.0, -4.9, 'J'], [13.0, -7.0, 'S'], [14.5, -3.3, 'b'],
  // The Mossi
  [13.4, -2.1, 'Y'], [12.1, -1.3, 'O'], [11.2, 0.4, 'K'],
  // Mali
  [11.0, -9.0, 'N'], [13.5, -11.3, 'M'], [12.0, -14.8, 'k'],
  // Jolof
  [15.3, -16.4, 'C'], [16.2, -13.8, 'F'], [13.8, -15.8, 'L'],
  // The Sahara
  [23.0, -5.5, 'X'], [17.8, -8.5, 'W'], [19.5, 1.0, 'E'], [17.5, 8.0, 'Z'],
  // Hausaland
  [13.2, 7.0, 'Q'], [11.8, 9.0, 'R'], [10.2, 7.6, 'U'],
  // Bornu
  [13.0, 11.6, 'n'], [14.8, 15.0, 'm'],
  // The Guinea coast
  [8.0, -2.5, 'g'], [7.8, 4.5, 'i'], [6.3, 6.2, 'e'],
  // Unexplored: Morocco and the Sahara to the north, Fezzan and Kawar, the Pepper Coast, Cameroon.
  [28.5, -10.0, '#'], [28.5, -4.0, '#'], [27.5, 2.0, '#'], [27.5, 8.0, '#'], [27.5, 14.0, '#'],
  [24.5, -14.0, '#'], [21.5, -13.0, '#'], [21.0, -9.5, '#'], [24.0, 5.0, '#'], [23.5, 10.5, '#'], [20.5, 12.5, '#'],
  [8.5, -12.5, '#'], [7.0, -9.5, '#'], [6.0, -6.5, '#'],
  [5.5, 10.5, '#'], [8.0, 12.0, '#'], [10.0, 14.5, '#'], [11.5, 16.0, '#'],
];
export const FORCE_LAND = [];

// Lake Chad, as large as it was in the 1400s: open water between Bornu and Kanem.
const lake = [];
for (let lat = 12.4; lat <= 14.2; lat += 0.1) {
  for (let lon = 13.3; lon <= 15.3; lon += 0.1) if (((lat - 13.3) / 0.85) ** 2 + ((lon - 14.3) / 0.95) ** 2 <= 1) lake.push([lat, lon]);
}
export const FORCE_SEA = lake;

// The Bissagos Islands join Kaabu; the Canaries, out by Morocco, are unexplored.
export const ISLAND = 30;
export const ISLAND_REACH = 10;

// Drawn on the map, not played: the rivers [lat, lon] from source to mouth, and where the camel
// caravans walk.
export const RIVERS = [
  // the Niger, from the Guinea highlands past Ségou, Timbuktu and Gao to the sea
  [[9.2, -10.6], [10.4, -9.9], [11.4, -9.2], [12.2, -8.4], [12.65, -8.0], [13.0, -7.1], [13.45, -6.25], [13.9, -5.4], [14.3, -4.7],
    [14.55, -4.15], [15.2, -4.1], [15.9, -3.8], [16.6, -3.3], [16.75, -2.6], [16.75, -1.5], [16.95, -0.4], [16.5, -0.1], [16.25, 0.0],
    [15.6, 0.5], [14.9, 0.9], [14.2, 1.45], [13.5, 2.1], [13.0, 2.4], [12.3, 3.0], [11.85, 3.45], [10.9, 4.0], [10.0, 4.6],
    [9.15, 4.83], [8.75, 5.75], [8.6, 6.4], [7.8, 6.74], [7.0, 6.75], [6.15, 6.78], [5.3, 6.5], [4.4, 6.1]],
  // the Bani, past Jenné to the Niger at Mopti
  [[11.0, -7.0], [12.0, -6.0], [13.3, -4.9], [14.0, -4.5], [14.55, -4.15]],
  // the Benue, to the Niger at Lokoja
  [[9.3, 13.4], [9.25, 12.45], [8.4, 9.8], [7.73, 8.54], [7.8, 6.74]],
  // the Senegal and the Gambia, to the Atlantic
  [[10.8, -11.3], [12.2, -10.6], [13.8, -10.8], [14.45, -11.44], [14.9, -12.45], [15.65, -13.25], [16.2, -13.9], [16.65, -14.96],
    [16.5, -15.5], [16.0, -16.5]],
  [[12.7, -12.5], [13.2, -13.3], [13.65, -14.2], [13.5, -15.5], [13.45, -16.6]],
];
export const CARAVANS = [[21.0, -4.6], [18.6, -10.0], [19.0, 4.6]];
