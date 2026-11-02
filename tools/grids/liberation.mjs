// The grid for Befrielsen (js/maps/liberation.js), drawn by tools/make-grid.mjs.

// The window: all of South America, so the continent is plain to see, from Panama, Jamaica and Haiti
// to Tierra del Fuego. The whole continent is in the game; only Central America, the islands, the
// Guianas and the south beyond the frontier (Araucanía, the Pampas, Patagonia) are unexplored.
export const LAT_TOP = 20.5;
export const LAT_STEP = 0.3;
export const ROWS = 256;
export const LON_WEST = -82;
export const LON_EAST = -34;
export const SQUASH_AT = -20;

// Territory centres [lat, lon, letter], several for the large ones; '#' marks land outside the campaign.
export const CENTRES = [
  // Venezuela: Caracas, Maracaibo with Coro and Mérida, the llanos of Barinas and Apure, and Angostura
  // with Guayana and the coast of Cumaná
  [10.2, -67.2, 'C'], [9.6, -65.6, 'C'],
  [10.2, -71.2, 'M'], [11.2, -69.8, 'M'], [8.6, -71.2, 'M'],
  [7.8, -69.3, 'B'], [7.2, -67.2, 'B'],
  [7.0, -63.5, 'A'], [9.9, -63.8, 'A'], [4.5, -63.5, 'A'], [3.2, -66.0, 'A'],
  // New Granada: Cartagena and Santa Marta, Santa Fe with Antioquia and Tunja, the llanos of
  // Casanare, and Popayán with Pasto and the Chocó
  [9.8, -75.0, 'K'], [10.5, -73.8, 'K'], [8.6, -76.3, 'K'],
  [5.0, -74.2, 'F'], [6.4, -75.4, 'F'], [6.2, -73.0, 'F'],
  [5.0, -71.2, 'N'], [3.0, -72.0, 'N'], [1.0, -70.5, 'N'],
  [2.2, -76.6, 'P'], [5.5, -76.8, 'P'], [1.2, -77.3, 'P'], [0.6, -74.5, 'P'],
  // Quito
  [-0.2, -78.4, 'Q'], [-0.8, -77.0, 'Q'],
  [-1.8, -80.0, 'G'], [-0.5, -80.0, 'G'],
  [-3.0, -79.0, 'E'], [-3.2, -77.5, 'E'],
  // Peru: Trujillo with Piura, Chachapoyas and Mainas; Lima with Tarma; Cusco with Huamanga; Arequipa
  // with Arica and Tarapacá
  [-7.8, -78.6, 'T'], [-5.5, -80.3, 'T'], [-6.0, -77.3, 'T'], [-4.8, -74.5, 'T'],
  [-11.6, -76.8, 'L'], [-10.2, -75.8, 'L'], [-9.0, -74.8, 'L'],
  [-13.5, -72.2, 'U'], [-13.3, -74.3, 'U'], [-12.0, -70.5, 'U'],
  [-16.4, -71.6, 'R'], [-17.8, -70.5, 'R'], [-19.8, -69.6, 'R'],
  // Upper Peru: La Paz, Potosí with the coast of Atacama, Santa Cruz with Moxos and Chiquitos
  [-16.3, -68.2, 'Z'], [-14.0, -68.3, 'Z'],
  [-19.7, -65.8, 'O'], [-21.5, -65.6, 'O'], [-22.6, -68.5, 'O'],
  [-17.8, -63.2, 'S'], [-14.5, -65.0, 'S'], [-17.0, -61.0, 'S'], [-11.5, -65.5, 'S'],
  // Chile, to the Biobío
  [-29.9, -71.0, 'Y'], [-27.3, -70.2, 'Y'], [-25.5, -70.2, 'Y'],
  [-33.4, -70.9, 'H'], [-34.8, -71.2, 'H'],
  [-36.8, -72.4, 'V'],
  // The River Plate: Tucumán with Salta and Córdoba, Mendoza with Cuyo, Buenos Aires with Santa Fe
  [-26.8, -65.3, 'W'], [-24.5, -65.4, 'W'], [-30.8, -64.2, 'W'], [-28.4, -64.8, 'W'], [-27.0, -67.0, 'W'],
  [-32.9, -68.5, 'D'], [-31.0, -68.6, 'D'], [-33.5, -66.3, 'D'],
  [-34.8, -59.0, 'X'], [-32.8, -61.0, 'X'], [-35.2, -57.6, 'X'],
  // The river lands: Paraguay, Corrientes with Entre Ríos, the delta and the missions, the Banda Oriental
  // with Colonia, so the River Plate lies between Buenos Aires and Montevideo
  [-25.5, -57.0, 'J'], [-23.0, -57.0, 'J'], [-21.5, -60.5, 'J'],
  [-28.2, -58.2, 'I'], [-31.2, -59.2, 'I'], [-27.0, -55.2, 'I'], [-33.4, -58.8, 'I'],
  [-34.0, -56.0, 'm'], [-32.0, -56.5, 'm'], [-34.2, -57.6, 'm'],
  // Brazil: Rio de Janeiro with Espírito Santo, São Paulo with Paraná and Santa Catarina, Minas Gerais
  // with Goiás, Rio Grande; São Paulo reaches the south of Mato Grosso
  [-22.6, -43.3, 'r'], [-20.0, -41.0, 'r'],
  [-23.3, -47.0, 's'], [-26.0, -50.0, 's'], [-27.5, -49.5, 's'], [-21.5, -52.5, 's'], [-20.0, -55.0, 's'],
  [-19.2, -44.5, 'g'], [-16.0, -49.0, 'g'], [-12.5, -48.5, 'g'],
  [-30.0, -52.5, 'e'], [-29.0, -55.5, 'e'],
  // Northern Brazil: Bahia, Pernambuco with Ceará, Piauí and Maranhão, Pará with Marajó, Amapá, the
  // Rio Negro, the Madeira and the north of Mato Grosso
  [-12.5, -40.5, 'b'], [-14.5, -43.5, 'b'],
  [-8.0, -37.0, 'p'], [-5.5, -39.5, 'p'], [-6.5, -42.5, 'p'], [-4.0, -44.5, 'p'],
  [-2.5, -51.0, 'a'], [-1.0, -49.5, 'a'], [1.0, -51.5, 'a'], [-4.0, -60.0, 'a'], [-7.0, -55.0, 'a'], [-9.5, -61.0, 'a'],
  [-11.5, -58.0, 'a'], [-6.5, -68.0, 'a'],
  // Unexplored: Central America and the islands, the Guianas, Araucanía, the Pampas and Patagonia.
  [9.0, -80.0, '#'], [8.5, -81.5, '#'], [10.0, -83.5, '#'], [8.6, -78.2, '#'],
  [18.1, -77.3, '#'], [19.0, -72.5, '#'], [18.8, -70.2, '#'], [18.2, -66.5, '#'], [20.3, -76.0, '#'], [10.4, -61.3, '#'],
  [11.2, -60.7, '#'],
  [6.5, -58.5, '#'], [4.5, -58.8, '#'], [2.8, -59.3, '#'], [4.5, -56.0, '#'], [3.0, -56.0, '#'], [4.2, -53.2, '#'], [3.0, -53.2, '#'],
  [-38.8, -72.5, '#'], [-40.5, -72.8, '#'], [-42.6, -73.9, '#'], [-44, -72, '#'], [-46.5, -72, '#'], [-49, -73, '#'],
  [-51.5, -72.5, '#'], [-53.8, -71, '#'], [-54.3, -68, '#'], [-42, -68, '#'], [-44.5, -68.5, '#'], [-47, -68.5, '#'],
  [-49.5, -69.5, '#'], [-40.5, -64.5, '#'], [-38.5, -68.5, '#'], [-36.8, -69.0, '#'], [-37.0, -64.5, '#'], [-37.3, -60.5, '#'],
  [-38.5, -62.5, '#'], [-51.7, -59, '#'],
];
// Margarita, the patriots' island off Cumaná, too small for the grid but drawn so it shows: it belongs
// to Angostura.
export const FORCE_LAND = [[11.15, -63.95], [11.15, -64.3]];

// Lake Titicaca: open water between Arequipa and La Paz, lying north-west to south-east.
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

// Drawn on the map, not played: the rivers [lat, lon] from source to mouth (the Orinoco first, where
// the patriots' boats go), and the two great marches over the Andes, San Martín's in 1817 and
// Bolívar's in 1819, and where the llanero and the gaucho ride.
export const RIVERS = [
  // the Orinoco, past Angostura
  [[2.3, -63.4], [3.2, -65.5], [4.0, -67.7], [6.1, -67.5], [7.6, -66.4], [7.9, -65.0], [8.13, -63.55], [8.3, -62.7], [8.6, -61.5],
    [8.6, -60.5]],
  // the Magdalena
  [[1.9, -76.3], [3.0, -75.3], [4.3, -74.8], [5.5, -74.6], [7.1, -73.9], [8.6, -74.0], [9.2, -74.75], [10.2, -74.8], [11.0, -74.85]],
  // the Marañón and the Amazon, to the Atlantic
  [[-10.2, -76.6], [-8.6, -77.3], [-6.6, -78.0], [-5.0, -78.3], [-4.5, -77.0], [-4.5, -74.5], [-3.7, -73.2], [-4.2, -70.0],
    [-3.5, -65.0], [-3.1, -60.0], [-2.4, -55.0], [-1.9, -52.5], [-0.5, -50.5], [0.0, -49.5]],
  // the Paraguay and the Paraná to the River Plate
  [[-16.0, -57.7], [-19.0, -57.6], [-22.0, -57.9], [-25.3, -57.6], [-27.3, -58.6]],
  [[-20.0, -51.0], [-23.5, -54.0], [-27.3, -56.0], [-27.5, -58.5], [-31.6, -60.7], [-33.8, -59.5], [-34.5, -58.3]],
  // the Uruguay
  [[-27.5, -51.5], [-27.2, -53.8], [-28.5, -55.6], [-30.2, -57.6], [-32.3, -58.1], [-34.0, -58.4]],
  // the São Francisco
  [[-20.3, -46.4], [-17.2, -44.8], [-15.5, -44.4], [-12.9, -43.3], [-9.4, -40.5], [-9.4, -38.2], [-10.5, -36.4]],
];
export const ROADS = [
  // San Martín: Mendoza, Uspallata, over the pass of Los Patos to Chacabuco and Santiago
  [[-32.9, -68.85], [-32.6, -69.35], [-32.45, -70.0], [-32.75, -70.7], [-33.05, -70.68], [-33.45, -70.65]],
  // Bolívar: Angostura, over the llanos to Casanare, over the Páramo de Pisba to Boyacá and Santa Fe
  [[8.13, -63.55], [8.0, -65.5], [8.05, -67.3], [7.6, -69.2], [7.24, -70.73], [6.46, -71.73], [5.72, -71.99], [5.85, -72.5],
    [5.75, -73.08], [5.45, -73.42], [4.6, -74.08]],
];
export const SIGHTS = [[8.7, -68.4, 'llanero'], [-37.0, -62.5, 'gaucho']];
