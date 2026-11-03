// The grid for Konstantinopel (js/maps/constantinople.js), drawn by tools/make-grid.mjs.

// The window: the Balkans, Anatolia and the Black Sea, with Italy, Central Europe, the steppe, the
// Caucasus, Syria and the islands round them as unexplored land.
export const LAT_TOP = 49;
export const LAT_STEP = 0.12;
export const ROWS = 140;
export const LON_WEST = 12;
export const LON_EAST = 46;
export const SQUASH_AT = 41;

// Territory centres [lat, lon, letter], several for the large ones; '#' marks land outside the campaign.
export const CENTRES = [
  // Thrace: Konstantinopel, Adrianopel with Philippopolis, Gallipoli
  [41.1, 28.65, 'K'], [41.3, 28.2, 'K'],
  [41.7, 26.6, 'E'], [42.15, 24.75, 'E'],
  [40.4, 26.35, 'G'], [40.9, 26.4, 'G'],
  // Anatolia: Bursa with the Troad, Smyrna, Ankara, Kütahya
  [40.2, 29.1, 'B'], [40.0, 27.2, 'B'], [40.7, 30.4, 'B'], [40.95, 29.45, 'B'], // Üsküdar, over the Bosporus
  [38.4, 27.1, 'S'], [37.8, 27.9, 'S'],
  [39.9, 32.9, 'A'], [40.6, 33.6, 'A'],
  [39.4, 30.0, 'U'], [38.6, 30.6, 'U'],
  // Karaman: Konya, Antalya, Kayseri
  [37.9, 32.5, 'Y'], [37.3, 33.5, 'Y'],
  [36.9, 30.7, 'N'], [36.6, 32.0, 'N'],
  [38.7, 35.5, 'R'], [39.3, 36.5, 'R'],
  // Pontus: Trapezunt, Sinop, Amasya
  [41.0, 39.7, 'T'], [40.8, 41.5, 'T'], [40.6, 38.4, 'T'],
  [42.0, 35.15, 'P'], [41.4, 34.0, 'P'],
  [40.65, 35.8, 'M'], [40.0, 37.8, 'M'],
  // Bulgaria: Tarnovo, Sofia, Varna
  [43.08, 25.6, 'V'], [43.4, 24.6, 'V'],
  [42.7, 23.3, 'O'], [43.0, 22.6, 'O'],
  [43.2, 27.9, 'W'], [42.5, 27.4, 'W'], [43.7, 28.4, 'W'],
  // Greece: Thessaloniki, Arta in Epirus, Athens, Mistra in the Morea
  [40.6, 22.9, 'H'], [41.0, 24.2, 'H'], [40.3, 22.3, 'H'],
  [39.2, 21.0, 'I'], [39.6, 20.3, 'I'],
  [37.98, 23.7, 'D'], [38.5, 22.6, 'D'], [39.4, 22.4, 'D'],
  [37.1, 22.4, 'X'], [37.6, 21.8, 'X'],
  // Serbia: Smederevo, Novo Brdo, Skopje
  [44.66, 20.93, 'Q'], [43.9, 21.0, 'Q'],
  [42.6, 21.4, 'J'], [43.2, 20.4, 'J'],
  [42.0, 21.4, 'k'], [41.5, 22.2, 'k'],
  // Dalmatia: Zara, Bobovac in Bosnia, Ragusa, Kruja in Albania
  [44.1, 15.23, 'Z'], [44.8, 15.8, 'Z'],
  [44.1, 17.9, 'b'], [44.6, 17.1, 'b'],
  [42.65, 18.1, 'g'], [43.2, 17.6, 'g'], [42.4, 19.2, 'g'],
  [41.5, 19.8, 'c'], [40.8, 20.0, 'c'],
  // Hungary: Buda, Belgrad, Temesvár, Zagreb
  [47.5, 19.04, 'u'], [48.2, 20.5, 'u'], [46.6, 18.6, 'u'], [47.9, 17.6, 'u'],
  [44.8, 20.45, 'l'], [45.3, 19.8, 'l'],
  [45.75, 21.23, 't'], [46.6, 21.0, 't'], [47.3, 21.9, 't'],
  [45.8, 16.0, 'z'], [46.3, 16.9, 'z'], [45.3, 14.9, 'z'],
  // Wallachia: Târgoviște, Suceava in Moldavia, Hermannstadt in Transylvania
  [44.93, 25.45, 'w'], [44.4, 26.4, 'w'], [44.3, 24.0, 'w'],
  [47.65, 26.26, 's'], [46.6, 27.2, 's'], [45.8, 28.3, 's'],
  [45.8, 24.15, 'h'], [46.8, 23.6, 'h'], [46.4, 25.2, 'h'],
  // Unexplored: Italy, Sicily and the Alps, Austria, Bohemia and Poland, the steppe and the Crimea, the
  // Caucasus and Georgia, Armenia, the Mamluks' Syria with Cilicia, and Crete, Cyprus and Libya.
  [43, 12.5, '#'], [41.5, 14.5, '#'], [40.5, 16.5, '#'], [39, 16.5, '#'], [45.5, 12.3, '#'], [37.5, 14.2, '#'], [46.6, 13, '#'],
  [48, 15, '#'], [48.7, 13, '#'], [48.8, 17.4, '#'], [48.8, 22.5, '#'], [48.5, 25.5, '#'], [48.3, 28.5, '#'], [47.4, 30.5, '#'],
  [46.8, 33.5, '#'], [48, 36.5, '#'], [47, 40, '#'], [45, 34, '#'], [45, 38.5, '#'], [44, 41.5, '#'], [42.3, 43.5, '#'],
  [41.5, 45.5, '#'], [40, 44, '#'], [39.2, 41.5, '#'], [38, 42.5, '#'], [37.8, 39.6, '#'], [36.2, 37.2, '#'], [37.1, 35.4, '#'],
  [35, 36.5, '#'], [33.5, 36.3, '#'], [34.2, 38.8, '#'], [33.2, 43, '#'], [35.2, 24.9, '#'], [35.1, 33.4, '#'], [32.8, 21.8, '#'],
  [32.6, 13.5, '#'],
];
export const FORCE_LAND = [];

// The Bosporus and the Dardanelles stay open, so Europe and Asia meet only over the water.
const along = (from, to, half) => {
  const out = [];
  for (let k = 0; k <= 1; k += 0.02) for (let w = -half; w <= half; w += 0.03) out.push([from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k + w]);
  return out;
};
export const FORCE_SEA = [...along([41.25, 29.12], [40.98, 29.0], 0.14), ...along([40.5, 27.0], [40.0, 26.15], 0.12)];

// The islands near the coasts join the territory nearest them; Crete, Cyprus, Sicily and the small
// islands far out are unexplored.
export const ISLAND = 30;
export const ISLAND_REACH = 8;

// Drawn on the map, not played: the Danube (from Vienna to the sea) and the Maritsa, and Mehmed's
// great cannon before the walls of Konstantinopel.
export const RIVERS = [
  [[48.2, 16.4], [47.8, 18.0], [47.5, 19.05], [46.1, 18.9], [45.25, 19.85], [44.8, 20.45], [44.65, 21.4], [44.6, 22.6], [43.9, 24.3],
    [43.7, 25.3], [44.1, 27.3], [45.4, 28.2], [45.2, 29.6]],
  [[42.3, 23.6], [42.15, 24.75], [41.7, 26.55], [41.2, 26.3], [40.75, 26.05]],
];
export const SIGHTS = [[41.3, 28.0, 'cannon']];
