// The grid for Djengis Khan (js/maps/genghis.js), drawn by tools/make-grid.mjs.

// The window: Asia from the Black Sea to Japan and from Siberia down to the Tropic, with the Kipchak
// steppe, Persia, Arabia, India, Tibet, Song China, Korea and Japan round it as unexplored land.
export const LAT_TOP = 57;
export const LAT_STEP = 0.3;
export const ROWS = 124;
export const LON_WEST = 37;
export const LON_EAST = 148;
export const SQUASH_AT = 42;

// Territory centres [lat, lon, letter], several for the large ones; '#' marks land outside the campaign.
export const CENTRES = [
  // Mongolia: Onon with the eastern Gobi, Kerulen with the Tatar lands, Karakorum with the western Gobi
  [48.8, 110.8, 'O'], [47.0, 108.5, 'O'], [45.0, 110.0, 'O'], [43.3, 109.5, 'O'],
  [47.4, 115.5, 'E'], [48.8, 118.5, 'E'], [45.6, 115.0, 'E'], [46.5, 119.5, 'E'],
  [47.2, 102.8, 'K'], [49.2, 100.5, 'K'], [50.3, 104.5, 'K'], [45.0, 103.0, 'K'], [43.6, 104.0, 'K'],
  // Naiman: Khovd, the Black Irtysh, the Yenisei of the Kirghiz
  [48.0, 91.6, 'V'], [46.3, 93.5, 'V'], [46.2, 97.0, 'V'], [48.5, 95.5, 'V'],
  [47.8, 85.5, 'I'], [49.6, 84.0, 'I'], [46.5, 86.0, 'I'],
  [51.7, 94.4, 'Y'], [53.3, 91.5, 'Y'], [50.8, 98.0, 'Y'],
  // Kara Khitai: Balasagun, Almalik with the Ili, Taraz
  [42.8, 75.3, 'B'], [42.3, 77.5, 'B'], [41.2, 75.5, 'B'],
  [43.9, 81.0, 'L'], [45.3, 79.5, 'L'], [44.2, 77.2, 'L'],
  [42.9, 71.4, 'T'], [44.3, 72.5, 'T'], [45.5, 75.0, 'T'],
  // Tarim: Beshbalik with Turfan and Hami, Kucha, Kashgar, Khotan
  [44.0, 89.2, 'S'], [42.9, 89.2, 'S'], [42.8, 93.0, 'S'], [45.2, 90.0, 'S'],
  [41.7, 83.0, 'C'], [41.0, 86.0, 'C'], [40.0, 88.5, 'C'],
  [39.5, 76.0, 'G'], [40.6, 79.0, 'G'], [38.4, 77.3, 'G'],
  [37.1, 79.9, 'H'], [38.0, 83.0, 'H'], [38.6, 86.5, 'H'], [39.2, 90.5, 'H'],
  // Xi Xia: Xingqing with the Ordos, Liangzhou, Ganzhou, Shazhou
  [38.5, 106.2, 'X'], [39.5, 108.5, 'X'], [37.6, 107.2, 'X'], [41.0, 105.5, 'X'],
  [37.9, 102.6, 'W'], [36.5, 103.8, 'W'], [39.3, 103.0, 'W'],
  [38.9, 100.4, 'Z'], [40.0, 98.5, 'Z'], [41.6, 100.5, 'Z'],
  [40.1, 94.7, 'D'], [41.5, 96.3, 'D'], [39.0, 94.5, 'D'],
  // Manchuria: Huining with the Amur forests, Liaoyang, Daning with the Khingan
  [45.5, 126.9, 'N'], [47.5, 124.0, 'N'], [44.0, 129.0, 'N'], [46.5, 131.0, 'N'], [49.0, 127.5, 'N'],
  [41.3, 123.2, 'J'], [42.6, 125.3, 'J'], [40.2, 122.5, 'J'],
  [41.6, 119.2, 'Q'], [43.6, 119.4, 'Q'], [45.5, 121.5, 'Q'], [43.6, 122.5, 'Q'],
  // Hebei: Zhongdu, Datong with the Ongud lands, Taiyuan, Zhending
  [39.9, 116.4, 'P'], [39.1, 117.5, 'P'], [40.8, 117.0, 'P'],
  [40.1, 113.3, 'R'], [41.3, 111.8, 'R'], [41.8, 114.5, 'R'],
  [37.9, 112.5, 'U'], [36.3, 112.3, 'U'], [38.7, 111.0, 'U'],
  [38.1, 114.5, 'A'], [37.0, 115.5, 'A'], [38.5, 116.3, 'A'],
  // Henan: Kaifeng with the Huai, Jinan with Shandong, Chang'an with Shaanxi
  [34.8, 114.3, 'F'], [33.6, 115.5, 'F'], [34.0, 117.5, 'F'], [34.6, 112.4, 'F'],
  [36.7, 117.0, 'M'], [36.6, 119.8, 'M'], [37.3, 121.5, 'M'], [35.5, 118.5, 'M'],
  [34.3, 108.9, 'n'], [35.6, 107.0, 'n'], [33.8, 106.4, 'n'], [36.6, 109.5, 'n'],
  // Transoxiana: Urgench, Bukhara, Samarkand with Fergana, Otrar on the Syr Darya
  [42.0, 59.8, 'u'], [41.4, 60.6, 'u'], [43.2, 57.5, 'u'], [40.5, 58.5, 'u'],
  [39.77, 64.4, 'b'], [40.8, 63.0, 'b'], [41.8, 64.6, 'b'],
  [39.65, 66.96, 's'], [40.3, 69.5, 's'], [40.6, 71.8, 's'], [38.8, 67.5, 's'],
  [42.85, 68.3, 'o'], [44.6, 65.8, 'o'], [45.6, 63.0, 'o'], [43.6, 70.0, 'o'],
  // Khorasan: Merv, Nishapur, Herat, Balkh
  [37.6, 61.8, 'm'], [39.0, 61.0, 'm'], [38.2, 59.5, 'm'],
  [36.2, 58.8, 'p'], [35.0, 58.3, 'p'], [36.8, 56.6, 'p'],
  [34.35, 62.2, 'h'], [33.2, 63.0, 'h'], [35.4, 63.8, 'h'],
  [36.75, 66.9, 'l'], [37.4, 69.2, 'l'], [36.0, 68.6, 'l'], [37.8, 71.3, 'l'],
  // Unexplored: the Kipchak steppe and Rus', the Caucasus, Persia and Baghdad, the Ghurids and
  // India, Tibet, Song China, Korea and Japan, and Siberia.
  [54, 48, '#'], [51, 47, '#'], [53, 55, '#'], [49, 52, '#'], [47, 56, '#'], [50, 59, '#'], [48.3, 61.5, '#'], [52, 64, '#'],
  [49.5, 67.5, '#'], [47.3, 68.5, '#'], [52, 72, '#'], [49.3, 72, '#'], [47.5, 72.5, '#'], [50.5, 77, '#'], [48.5, 77.5, '#'],
  [54.5, 62, '#'], [55, 72, '#'], [55, 82, '#'], [52.5, 80, '#'], [55.5, 90, '#'], [55, 98, '#'], [54.5, 104, '#'], [55.5, 112, '#'],
  [53, 113, '#'], [51.5, 117, '#'], [54.5, 122, '#'], [53, 126, '#'], [51.5, 130, '#'], [50, 122, '#'], [51.5, 110.5, '#'],
  [42.3, 44.8, '#'], [41, 47.5, '#'], [38.5, 46.5, '#'], [36, 49, '#'], [33, 46, '#'], [31, 48, '#'], [34, 51, '#'],
  [33, 54.5, '#'], [30, 53, '#'], [29.5, 57.5, '#'], [31.5, 60.5, '#'], [36.4, 53, '#'],
  [34, 68.5, '#'], [31.5, 65.5, '#'], [29.5, 63, '#'], [32.2, 69, '#'], [35.6, 71.6, '#'],
  [30.5, 72, '#'], [29, 76, '#'], [28.8, 80, '#'], [32, 75, '#'],
  [34.6, 76.6, '#'], [34, 80, '#'], [32.5, 84, '#'], [30, 88, '#'], [32, 92, '#'], [29.5, 95.5, '#'], [33.5, 96.5, '#'],
  [35.6, 90, '#'], [36.6, 95, '#'], [35.5, 99.5, '#'], [33.5, 101.5, '#'], [30.5, 99.5, '#'], [36.3, 84.5, '#'],
  [32, 110.5, '#'], [32.3, 113.5, '#'], [31.5, 117, '#'], [32.6, 120.2, '#'], [30.5, 105.5, '#'], [29, 109, '#'], [29, 114, '#'],
  [29.5, 119.5, '#'], [28.8, 103, '#'], [32.3, 107, '#'],
  [39, 39, '#'], [41, 41, '#'], [37.5, 42, '#'], [34.5, 40, '#'], [32, 44, '#'], [29, 47, '#'], [26, 44, '#'], [23, 48, '#'],
  [21, 54, '#'], [22.5, 58, '#'], [27, 56, '#'], [27.5, 61, '#'], [26, 65, '#'], [26, 69, '#'], [24, 72.5, '#'], [27, 74, '#'],
  [22.5, 76, '#'], [25, 80, '#'], [22, 81, '#'], [25.5, 85, '#'], [22.5, 87, '#'], [26, 89, '#'], [26, 92, '#'], [22, 94, '#'],
  [25, 97, '#'], [21, 97, '#'], [25, 101, '#'], [22.5, 101, '#'], [24, 104, '#'], [21.5, 105, '#'], [26.5, 107, '#'], [24, 108, '#'],
  [22, 108.5, '#'], [26.5, 111, '#'], [23.5, 112, '#'], [26, 114.5, '#'], [24, 116, '#'], [26.5, 118.5, '#'], [20, 110, '#'], [23.7, 121, '#'],
  [40.4, 127.2, '#'], [38.5, 126.5, '#'], [36.5, 127.6, '#'], [35.2, 128.6, '#'], [33, 130.8, '#'], [34.2, 131.6, '#'],
];
export const FORCE_LAND = [];

// The lakes, inland water the coastlines leave out: the Aral Sea as it was, Lake Baikal, Lake
// Balkhash and the Issyk-Kul.
const lake = [];
const oval = (lat0, lon0, a, b) => {
  for (let lat = lat0 - a; lat <= lat0 + a; lat += 0.1) {
    for (let lon = lon0 - b; lon <= lon0 + b; lon += 0.1) if (((lat - lat0) / a) ** 2 + ((lon - lon0) / b) ** 2 <= 1) lake.push([lat, lon]);
  }
};
const along = (points, half) => {
  for (let i = 1; i < points.length; i++) {
    const [from, to] = [points[i - 1], points[i]];
    for (let k = 0; k <= 1; k += 0.05) for (let w = -half; w <= half; w += 0.1) lake.push([from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k + w]);
  }
};
oval(45.0, 60.0, 1.3, 1.6);
oval(42.45, 77.25, 0.25, 0.9);
along([[51.55, 104.2], [52.0, 105.6], [52.9, 107.0], [53.8, 108.2], [54.8, 109.0], [55.7, 109.4]], 0.4);
along([[46.8, 74.2], [46.5, 76.0], [46.3, 77.5], [46.4, 79.0]], 0.3);
export const FORCE_SEA = lake;

// Small islands join the territory nearest them.
export const ISLAND = 20;
export const ISLAND_REACH = 8;

// Drawn on the map, not played: yurts on their carts on the steppe, a camel caravan on the Silk Road
// and a mounted archer. No rivers: on a map this size they drew as loose lines.
export const RIVERS = [];
export const CARAVANS = [[46.4, 109.5], [46.6, 117.8], [46.0, 101.2]];
export const SIGHTS = [[39.6, 85.0, 'caravan'], [44.6, 108.6, 'archer']];
