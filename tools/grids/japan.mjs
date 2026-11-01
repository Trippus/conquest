// The grid for Japans samling (js/maps/japan.js), drawn by tools/make-grid.mjs.

// The window: Japan from Kyushu to the north of Honshu, with Korea, Manchuria, Ezo and Tanegashima
// round it.
export const LAT_TOP = 44;
export const LAT_STEP = 0.15;
export const ROWS = 94;
export const LON_WEST = 124;
export const LON_EAST = 146;
export const SQUASH_AT = 36;

// Territory centres [lat, lon, letter]; '#' marks land outside the campaign.
export const CENTRES = [
  // Kyushu
  [33.6, 130.5, 'H'], [33.1, 131.5, 'F'], [32.6, 130.8, 'K'], [31.7, 130.6, 'S'],
  [32.85, 129.95, 'H'], // Hizen and Nagasaki, Hakata's side of the Ariake bay
  [32.4, 130.15, 'K'], // Amakusa, Kumamoto's island
  // Shikoku
  [33.8, 132.8, 'm'], [33.4, 133.6, 'k'], [34.0, 134.3, 't'],
  [34.4, 134.85, 't'], // Awaji belongs to Tokushima
  // Chugoku
  [34.2, 131.5, 'Y'], [34.5, 132.6, 'h'], [35.3, 133.0, 'z'], [34.8, 133.9, 'o'],
  // Kinai
  [35.2, 135.8, 'Q'], [34.65, 135.35, 'O'], [34.4, 135.95, 'N'], [33.9, 135.5, 'W'],
  // Tokaido
  [35.2, 136.85, 'q'], [34.9, 137.4, 'A'], [35.0, 138.4, 'U'],
  // Koshin
  [35.6, 136.9, 'G'], [36.1, 137.2, 'G'], // Mino and Hida
  [35.7, 138.6, 'J'], [36.3, 138.2, 'M'],
  // Hokuriku
  [35.95, 136.3, 'I'], [36.6, 136.7, 'Z'], [37.3, 138.4, 'E'],
  // Kanto
  [35.3, 139.15, 'D'], [35.75, 139.75, 'X'], [36.4, 140.3, 'T'],
  // Tohoku
  [37.5, 139.9, 'a'], [38.3, 140.9, 's'], [39.7, 141.1, 'r'],
  // Unexplored: Ezo, Oki, Gotō, Tsushima and Korea, Manchuria and the Russian coast, the China coast, the Ryukyu
  // islands.
  [43.0, 142.5, '#'], [42.0, 140.4, '#'], [44.5, 142.0, '#'], [43.5, 145.0, '#'],
  [36.2, 133.2, '#'], [32.75, 128.8, '#'], [34.4, 129.3, '#'], [37.5, 127.0, '#'], [35.5, 128.5, '#'], [39.0, 126.5, '#'], [41.0, 129.0, '#'], [36.0, 126.8, '#'],
  [43.0, 125.0, '#'], [44.5, 130.5, '#'], [44.0, 134.5, '#'], [41.0, 123.0, '#'],
  [31.0, 121.0, '#'], [28.5, 120.5, '#'], [34.5, 120.5, '#'], [37.0, 121.5, '#'],
  [26.5, 127.9, '#'], [28.3, 129.4, '#'],
];
export const FORCE_LAND = [];
export const FORCE_SEA = [];

// Sado, Oki, Iki and the small islands join the territory nearest them.
export const ISLAND = 30;
export const ISLAND_REACH = 10;
