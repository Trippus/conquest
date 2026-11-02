// The grid for Inkariget (js/maps/inka.js), drawn by tools/make-grid.mjs.

// The window: all of South America, so the continent is plain to see, from Panama and the Caribbean
// to Tierra del Fuego. The campaign is the strip along the Andes; the rest is unexplored.
export const LAT_TOP = 13;
export const LAT_STEP = 0.22;
export const ROWS = 314;
export const LON_WEST = -82;
export const LON_EAST = -34;
export const SQUASH_AT = -20;

// Territory centres [lat, lon, letter]; '#' marks land outside the campaign.
export const CENTRES = [
  // Quitu
  [-0.2, -78.3, 'Q'], [-2.7, -78.9, 'T'], [-1.2, -80.2, 'M'],
  // Chimú
  [-4.3, -80.3, 'B'], [-6.4, -79.6, 'L'], [-8.0, -78.9, 'C'], [-9.6, -78.0, 'S'],
  // The northern highlands
  [-6.9, -78.4, 'J'], [-8.4, -77.4, 'H'], [-5.9, -77.6, 'Y'],
  // Wanka
  [-9.6, -76.2, 'N'], [-10.9, -76.0, 'R'], [-12.2, -75.2, 'X'],
  // The desert coast
  [-12.0, -76.8, 'K'], [-13.4, -76.0, 'I'], [-14.8, -75.0, 'Z'],
  // Chanka
  [-12.8, -74.3, 'G'], [-14.3, -74.0, 'V'], [-13.9, -73.2, 'A'],
  // The Sacred Valley
  [-14.0, -71.8, 'U'], [-12.9, -72.7, 'm'], [-12.8, -71.0, 'p'],
  // Collao, round Lake Titicaca
  [-15.0, -70.2, 'h'], [-16.2, -69.9, 'c'], [-16.8, -68.5, 't'], [-16.2, -71.8, 'a'],
  // Charcas
  [-18.8, -64.8, 's'], [-20.8, -66.4, 'o'], [-17.4, -66.2, 'b'],
  // Chile, with the Andes on the far side
  [-18.8, -69.8, 'r'], [-22.8, -68.4, 'e'], [-27.4, -69.6, 'k'], [-32.0, -70.0, 'g'],
  // Unexplored: Central America, the north, the Amazon, Brazil, the Chaco, the Pampas, Patagonia.
  [8.5, -80, '#'], [11, -74, '#'], [6, -75, '#'], [3, -76.5, '#'], [4.5, -73.5, '#'], [8, -71, '#'], [9, -64, '#'],
  [5.5, -60, '#'], [3, -53, '#'], [-1.5, -74.5, '#'], [-4.5, -71, '#'], [-6.5, -74, '#'], [-9.5, -72.5, '#'], [-11.5, -68.5, '#'],
  [-14.5, -65.5, '#'], [-17.5, -61, '#'], [-22.5, -62.5, '#'], [-26.5, -64.5, '#'], [-32, -64.5, '#'], [-36, -62, '#'],
  [-38.5, -72.5, '#'], [-44, -70, '#'], [-50, -70, '#'], [-54, -68, '#'], [-3, -65, '#'], [-3, -55, '#'], [-5, -45, '#'],
  [-8, -38, '#'], [-10, -50, '#'], [-13, -42, '#'], [-16, -56, '#'], [-20, -48, '#'], [-24, -52, '#'], [-29, -55, '#'],
  [-31, -58, '#'],
];
export const FORCE_LAND = [];

// Lake Titicaca: open water between Hatun Colla, Chucuito and Tiwanaku, lying north-west to south-east.
const lake = [];
for (let lat = -17; lat <= -14.8; lat += 0.1) {
  for (let lon = -70.4; lon <= -68.3; lon += 0.1) {
    const [u, v] = [(lat + 15.85) * 0.75 + (lon + 69.35) * 0.66, (lon + 69.35) * 0.75 - (lat + 15.85) * 0.66];
    if ((u / 0.95) ** 2 + (v / 0.42) ** 2 <= 1) lake.push([lat, lon]);
  }
}
export const FORCE_SEA = lake;

export const ISLAND = 30;
export const ISLAND_REACH = 8;

// Drawn on the map, not played: the rivers [lat, lon] from source to mouth (the Amazon first), the
// Inca road through the mountains, where the llama trains walk, and a reed boat on Lake Titicaca.
export const RIVERS = [
  // the Marañón and the Amazon, to the Atlantic
  [[-10.2, -76.6], [-8.6, -77.3], [-6.6, -78.0], [-5.0, -78.3], [-4.5, -77.0], [-4.5, -74.5], [-3.7, -73.2], [-4.2, -70.0],
    [-3.5, -65.0], [-3.1, -60.0], [-2.4, -55.0], [-1.9, -52.5], [-0.5, -50.5], [0.0, -49.5]],
  // the Urubamba past Machu Picchu, and the Ucayali
  [[-14.2, -71.3], [-13.3, -72.1], [-13.15, -72.6], [-11.6, -73.0], [-10.0, -74.0], [-8.4, -74.5], [-6.5, -75.0], [-4.5, -74.5]],
  // the Paraná to the River Plate
  [[-20.0, -51.0], [-23.5, -54.0], [-27.3, -56.0], [-27.5, -58.5], [-31.6, -60.7], [-33.8, -59.5], [-34.5, -58.3], [-35.0, -57.0]],
  // the Orinoco
  [[2.5, -66.0], [6.0, -67.5], [7.9, -66.3], [8.6, -62.5], [8.6, -61.0]],
];
export const ROADS = [
  [[0.3, -78.2], [-0.2, -78.5], [-2.9, -79.0], [-5.0, -79.4], [-7.2, -78.5], [-7.8, -78.0], [-9.9, -76.8], [-11.8, -75.5],
    [-13.65, -73.95], [-13.5, -71.97], [-15.2, -70.3], [-15.9, -70.0], [-16.6, -69.1], [-17.6, -68.0], [-18.3, -67.2],
    [-19.6, -66.4], [-21.4, -66.6], [-22.9, -68.2], [-25.5, -69.5], [-27.4, -70.2], [-30.0, -70.8], [-33.4, -70.6]],
];
export const CARAVANS = [[-9.0, -77.4], [-19.2, -66.9], [-25.4, -69.2]];
export const SIGHTS = [[-15.8, -69.35, 'reedboat']];
