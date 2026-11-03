// The grid for Etiopien (js/maps/ethiopia.js), drawn by tools/make-grid.mjs.

// The window: all of Africa, so the continent is plain to see, and Arabia over the Red Sea. The
// campaign is the Horn of Africa and the Nile, from Alexandria to Kismayo and Aden; the rest is
// unexplored.
export const LAT_TOP = 37.82;
export const LAT_STEP = 0.26;
export const ROWS = 280;
export const LON_WEST = -18;
export const LON_EAST = 53.5;
export const SQUASH_AT = 12;

// Territory centres [lat, lon, letter], several for the large ones; '#' marks land outside the campaign.
export const CENTRES = [
  // Shewa: Addis Abeba, Ankober down to the Awash, Gurage with Sidamo and the lakes
  [9.0, 38.75, 'A'], [9.9, 38.6, 'A'], [8.5, 39.3, 'A'],
  [9.8, 39.7, 'N'], [9.2, 40.5, 'N'], [10.3, 40.3, 'N'],
  [8.0, 38.0, 'G'], [7.0, 38.5, 'G'], [5.4, 38.6, 'G'],
  // Amhara: Gondar with Wolkait, Gojjam with Agaw, Wollo with the west of the Danakil
  [12.6, 37.5, 'D'], [13.3, 36.8, 'D'], [13.2, 38.0, 'D'],
  [10.6, 37.6, 'J'], [11.3, 36.4, 'J'],
  [11.2, 39.5, 'W'], [11.6, 40.8, 'W'],
  // Tigray: Adwa with Aksum and Shire, Mekele, Amba Alagi
  [14.2, 38.9, 'T'], [14.0, 37.3, 'T'],
  [13.5, 39.5, 'M'], [13.8, 40.4, 'M'],
  [12.6, 39.5, 'L'], [12.7, 40.5, 'L'],
  // Eritrea: Massawa, Asmara, Keren with the Sahel and Barka, Assab with the Danakil
  [15.6, 39.5, 'S'], [14.8, 40.2, 'S'], [16.8, 38.7, 'S'],
  [15.1, 38.9, 'R'], [14.75, 39.1, 'R'], [15.4, 38.6, 'R'],
  [16.0, 37.6, 'K'], [17.2, 38.0, 'K'], [15.4, 36.9, 'K'],
  [13.0, 42.6, 'Z'], [13.7, 41.1, 'Z'],
  // Sudan: Omdurman with Berber and the Gezira, Kassala with Gedaref and Gallabat, El Obeid in
  // Kordofan, Dongola to the Egyptian frontier, Suakin on the Red Sea
  [15.6, 32.5, 'O'], [17.0, 33.7, 'O'], [13.5, 33.3, 'O'], [11.6, 34.0, 'O'],
  [15.4, 36.3, 'Q'], [13.6, 35.6, 'Q'],
  [13.2, 30.2, 'E'], [11.3, 30.0, 'E'], [15.0, 29.0, 'E'],
  [19.2, 30.4, 'g'], [21.0, 30.8, 'g'], [20.5, 27.5, 'g'],
  [19.1, 37.3, 'U'], [20.8, 36.2, 'U'],
  // Egypt: Cairo with Sinai, Alexandria with the western desert, Aswan with Upper Egypt and the oases
  [30.0, 31.3, 'C'], [29.4, 33.8, 'C'], [28.0, 30.8, 'C'],
  [30.9, 29.6, 'X'], [29.0, 26.5, 'X'], [27.5, 28.8, 'X'],
  [24.5, 32.8, 'a'], [26.5, 32.0, 'a'], [25.2, 29.5, 'a'], [26.5, 33.6, 'a'], [23.0, 32.0, 'a'],
  // Kaffa: Jimma, Bonga down to the Omo, Welega with Benishangul
  [7.8, 37.0, 'j'], [8.5, 37.0, 'j'],
  [7.2, 36.0, 'b'], [6.0, 35.8, 'b'], [5.0, 36.3, 'b'],
  [9.1, 36.3, 'w'], [10.4, 35.3, 'w'], [8.3, 34.8, 'w'],
  // Ogaden: Harar with Chercher, Arsi and Bale, Jijiga with the Haud, Gode on the Shebelle
  [9.3, 42.0, 'H'], [8.6, 40.8, 'H'], [7.2, 40.3, 'H'],
  [9.3, 43.2, 'i'], [8.2, 44.4, 'i'], [7.3, 45.8, 'i'],
  [5.9, 43.6, 'o'], [4.5, 42.0, 'o'], [6.8, 42.3, 'o'],
  // The Somali coast: Aden, Djibouti, Zeila with Hargeisa, Berbera to the east
  [12.95, 45.0, 'n'], [13.9, 46.8, 'n'],
  [11.8, 42.7, 'y'], [11.4, 42.1, 'y'],
  [10.8, 43.5, 'z'], [10.0, 44.5, 'z'],
  [10.2, 45.6, 'e'], [10.5, 47.5, 'e'],
  // Benadir: Obbia with the Majeerteen, Mogadishu, Kismayo on the Juba
  [5.3, 48.0, 'B'], [8.5, 49.2, 'B'], [10.6, 50.2, 'B'],
  [2.4, 45.0, 'm'], [3.8, 44.0, 'm'],
  [-0.3, 42.4, 'k'], [1.5, 41.8, 'k'],
  // Unexplored: North and West Africa and the Sahara, Libya, Darfur, the south of the Sudan, East,
  // Central and Southern Africa, Madagascar, Arabia and Yemen, and the corners of Europe and Asia.
  [35.5, -5.5, '#'], [33, -6, '#'], [30, -8, '#'], [26, -12, '#'], [22, -14, '#'], [18, -15, '#'], [14.5, -15, '#'], [11.5, -14, '#'],
  [9, -11, '#'], [7, -8.5, '#'], [6, -5, '#'], [6.5, -1.5, '#'], [7.5, 2, '#'], [6, 6, '#'], [4, 9.5, '#'], [6, 12, '#'],
  [9.5, 13, '#'], [12, 9, '#'], [12, 5, '#'], [12, 1, '#'], [12.5, -3, '#'], [13, -7, '#'], [14.5, -11, '#'], [17, -11, '#'],
  [16.5, -6, '#'], [17, -1, '#'], [17, 3.5, '#'], [17, 8, '#'], [16.5, 13, '#'], [14, 17, '#'], [13, 21, '#'], [16.5, 20, '#'],
  [20, 15, '#'], [20, 18.5, '#'], [21, 22, '#'], [24, 9, '#'], [24, 13, '#'], [24, 17, '#'], [25, 21, '#'], [21.5, 1, '#'],
  [21, 5, '#'], [24, -1, '#'], [24, -5, '#'], [21, -9, '#'], [27.5, -3, '#'], [27.5, 2, '#'], [27.5, 7, '#'], [28, 12, '#'],
  [28, 16.5, '#'], [30.5, 20, '#'], [27.5, 21, '#'], [32, 13, '#'], [32.5, 21.5, '#'], [34.5, 9.5, '#'], [36, 3, '#'],
  [36.5, 10, '#'], [33, 3, '#'], [35, -1, '#'], [31.5, 23.5, '#'], [27, 23.5, '#'], [23.5, 23.8, '#'],
  [20.5, 24.5, '#'], [17, 24.5, '#'], [14, 25.5, '#'], [11.5, 26.5, '#'], [9, 25, '#'], [9.5, 28.5, '#'], [7.5, 30.5, '#'],
  [9.5, 32.2, '#'], [7.0, 33.8, '#'], [5, 32, '#'], [4.5, 29, '#'], [4.5, 34.5, '#'],
  [3.5, 21, '#'], [3.5, 15.5, '#'], [0.5, 11, '#'], [-1.5, 15, '#'], [-0.5, 20, '#'], [1, 25, '#'], [-3.5, 25, '#'], [2, 29.5, '#'],
  [0.5, 32.5, '#'], [-1, 30.5, '#'], [3, 33, '#'], [4, 35.6, '#'], [2.5, 37.5, '#'], [1, 36, '#'], [-0.5, 37.5, '#'], [-2, 38, '#'],
  [-3.5, 39, '#'], [0.5, 39.5, '#'], [2.6, 40.2, '#'], [-1.8, 40.3, '#'], [-4, 34, '#'], [-4, 30, '#'], [-7.5, 31, '#'], [-10, 34, '#'],
  [-6.5, 35, '#'], [-8, 39, '#'], [-6.5, 13.5, '#'], [-11, 17, '#'], [-12, 23, '#'], [-11, 28, '#'], [-14, 33, '#'], [-13, 38.5, '#'],
  [-16, 16, '#'], [-17, 24, '#'], [-18.5, 30, '#'], [-18.5, 35.5, '#'], [-22, 16.5, '#'], [-23, 22, '#'], [-22, 28.5, '#'],
  [-24, 33.5, '#'], [-27.5, 18, '#'], [-28, 24, '#'], [-28.5, 29.5, '#'], [-32, 20, '#'], [-32, 26, '#'], [-19, 46.5, '#'],
  [-23, 45, '#'], [-15, 49, '#'],
  [33.5, 36.5, '#'], [35.5, 40, '#'], [35, 46, '#'], [33, 50, '#'], [29, 39, '#'], [27, 44.5, '#'], [24.5, 39, '#'], [22, 46, '#'],
  [20, 41.5, '#'], [18, 49, '#'], [22.5, 51.5, '#'], [31, 35.2, '#'], [14.5, 43.8, '#'], [13.35, 43.55, '#'], [15.6, 44.2, '#'], [16.9, 43.5, '#'],
  [15.3, 46.2, '#'], [15.6, 48.5, '#'], [16.5, 51.0, '#'], [18.5, 46, '#'],
  [37.3, -4.5, '#'], [37.4, 14.2, '#'], [37.5, 22.0, '#'], [35.2, 24.8, '#'], [37, 28, '#'], [37, 33.5, '#'], [35.0, 33.2, '#'],
];
export const FORCE_LAND = [];

// Lakes, open water: Tana, where the Blue Nile begins, and Rudolf (Turkana) in the south; far off,
// Victoria, Tanganyika and Malawi.
const lake = [];
for (let lat = 11.5; lat <= 12.4; lat += 0.05) {
  for (let lon = 36.9; lon <= 37.7; lon += 0.05) if (((lat - 11.95) / 0.4) ** 2 + ((lon - 37.3) / 0.33) ** 2 <= 1) lake.push([lat, lon]);
}
for (let lat = -2.5; lat <= 0.5; lat += 0.1) {
  for (let lon = 31.5; lon <= 34.5; lon += 0.1) if (((lat + 1) / 1.3) ** 2 + ((lon - 33) / 1.5) ** 2 <= 1) lake.push([lat, lon]);
}
const along = (from, to, half) => {
  const out = [];
  for (let k = 0; k <= 1; k += 0.02) for (let w = -half; w <= half; w += 0.1) out.push([from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k + w]);
  return out;
};
export const FORCE_SEA = [...lake, ...along([4.5, 36.05], [2.5, 36.5], 0.2), ...along([-3.3, 29.3], [-8.8, 31.0], 0.25), ...along([-9.5, 34.0], [-14.4, 35.3], 0.3),
  // Bab el-Mandeb stays open, so Aden is reached from Africa only by sea
  ...along([12.1, 43.4], [13.1, 43.4], 0.2)];

// The Dahlak islands join Massawa; Socotra, Madagascar and the islands of the Mediterranean are
// unexplored.
export const ISLAND = 30;
export const ISLAND_REACH = 10;

// Drawn on the map, not played: the rivers [lat, lon] from source to mouth (the Blue Nile first),
// Menelik's march to Adwa, the salt caravans from the Danakil, and the obelisk at Aksum and a dhow on
// the Red Sea.
export const RIVERS = [
  // the Blue Nile, from Lake Tana round Gojjam to Khartoum
  [[11.6, 37.4], [11.0, 37.95], [10.4, 38.2], [9.9, 37.8], [10.0, 36.6], [10.7, 35.3], [11.8, 34.4], [13.5, 33.6], [15.6, 32.5]],
  // the White Nile and the Nile, to the sea
  [[0.3, 33.2], [1.5, 32.2], [3.6, 31.7], [6.5, 31.5], [9.5, 30.5], [12.0, 32.7], [15.6, 32.5], [17.7, 33.9], [19.5, 33.3],
    [18.5, 31.8], [19.2, 30.5], [21.8, 31.3], [24.1, 32.9], [26.2, 32.7], [28.0, 30.8], [30.0, 31.2], [31.5, 31.0]],
  // the Atbara
  [[12.7, 37.2], [13.8, 36.6], [14.3, 36.1], [15.6, 35.6], [16.6, 34.5], [17.7, 33.95]],
  // the Genale and the Juba, to the sea at Kismayo
  [[6.0, 39.8], [5.0, 41.0], [4.2, 42.05], [3.0, 42.5], [1.5, 42.4], [0.5, 42.6], [-0.3, 42.6]],
  // the Omo, to Lake Rudolf
  [[8.6, 37.4], [7.6, 37.2], [6.8, 36.8], [6.0, 36.2], [5.2, 36.0], [4.6, 36.0]],
];
export const ROADS = [
  // Menelik's march: Addis Abeba, Wollo, Amba Alagi, Mekele, Adwa
  [[9.03, 38.74], [9.7, 39.4], [10.6, 39.65], [11.1, 39.6], [11.9, 39.55], [12.6, 39.55], [13.5, 39.47], [13.9, 39.2], [14.17, 38.9]],
];
export const CARAVANS = [[14.0, 40.3], [12.6, 41.0]];
export const SIGHTS = [[14.13, 38.72, 'obelisk'], [18.0, 39.8, 'dhow']];
