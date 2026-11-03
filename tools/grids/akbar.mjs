// The grid for Akbar den Store (js/maps/akbar.js), drawn by tools/make-grid.mjs.

// The window: India from the Hindu Kush to Ceylon, with Persia, the Gulf and Oman, Central Asia, Tibet
// and Burma round it as unexplored land.
export const LAT_TOP = 40;
export const LAT_STEP = 0.2;
export const ROWS = 171;
export const LON_WEST = 50;
export const LON_EAST = 100;
export const SQUASH_AT = 22;

// Territory centres [lat, lon, letter], several for the large ones; '#' marks land outside the campaign.
export const CENTRES = [
  // Kabul: Kabul, Kandahar, Peshawar
  [34.5, 69.2, 'K'], [35.3, 68.4, 'K'],
  [31.6, 65.7, 'Q'], [32.6, 67.4, 'Q'],
  [34.0, 71.6, 'P'], [33.2, 71.0, 'P'],
  // Punjab: Lahore, Multan, Srinagar with Kashmir
  [31.5, 74.3, 'L'], [32.4, 74.0, 'L'],
  [30.2, 71.5, 'M'], [29.2, 71.0, 'M'],
  [34.1, 74.8, 'S'], [33.4, 75.5, 'S'],
  // Hindustan: Delhi with Panipat and Sirhind, Agra with Gwalior, Lucknow with Rohilkhand, Prayag
  // with Jaunpur and Kalinjar
  [28.6, 77.2, 'D'], [30.0, 76.6, 'D'],
  [27.2, 78.0, 'A'], [26.2, 78.2, 'A'],
  [26.8, 80.9, 'U'], [28.4, 79.4, 'U'],
  [25.4, 81.8, 'Y'], [25.7, 82.7, 'Y'], [24.9, 80.5, 'Y'],
  // Rajputana: Chittor with Mewar, Amber with Ranthambore, Jodhpur (Marwar), Bikaner with Jaisalmer
  [24.9, 74.6, 'C'], [24.6, 73.7, 'C'],
  [26.9, 75.8, 'B'], [26.0, 76.5, 'B'],
  [26.3, 73.0, 'J'], [25.3, 72.3, 'J'],
  [28.0, 73.3, 'R'], [26.9, 70.9, 'R'],
  // Sindh: Thatta, Bhakkar
  [24.7, 67.9, 'T'], [25.4, 68.4, 'T'],
  [27.7, 68.9, 'H'], [28.6, 68.2, 'H'],
  // Gujarat: Ahmedabad with Patan, Surat with Baroda, Junagadh with Saurashtra and Kutch
  [23.0, 72.6, 'G'], [24.0, 72.4, 'G'],
  [21.2, 72.8, 'V'], [22.3, 73.2, 'V'],
  [21.5, 70.5, 'N'], [22.3, 70.8, 'N'], [23.3, 69.7, 'N'],
  // Malwa: Mandu with Ujjain, Raisen, Garha in Gondwana
  [22.4, 75.4, 'm'], [23.2, 75.8, 'm'],
  [23.3, 77.8, 'r'], [24.6, 77.7, 'r'],
  [23.2, 79.9, 'g'], [22.0, 80.5, 'g'], [22.2, 82.5, 'g'], [20.3, 82.0, 'g'],
  // Bengal and Bihar: Patna, Gaur, Sonargaon, Cuttack in Orissa
  [25.6, 85.1, 'p'], [24.8, 84.2, 'p'],
  [24.9, 88.1, 'o'], [26.0, 88.8, 'o'],
  [23.6, 90.6, 's'], [24.8, 90.4, 's'],
  [20.5, 85.9, 'c'], [21.8, 86.5, 'c'],
  // The Deccan: Burhanpur with Khandesh and Berar, Ahmadnagar, Bidar, Golconda, Bijapur
  [21.3, 76.2, 'b'], [21.2, 77.6, 'b'],
  [19.1, 74.7, 'a'], [18.5, 73.9, 'a'], [19.5, 73.2, 'a'],
  [17.9, 77.5, 'd'], [19.2, 77.3, 'd'],
  [17.4, 78.4, 'q'], [17.0, 80.5, 'q'], [18.5, 79.5, 'q'],
  [16.8, 75.7, 'j'], [17.5, 74.0, 'j'],
  // Vijayanagara: Hampi with Mysore, Goa, Chandragiri, Madurai
  [15.3, 76.5, 'h'], [14.2, 75.9, 'h'], [12.8, 76.4, 'h'],
  [15.45, 73.9, 'x'],
  [13.6, 79.3, 'n'], [12.8, 79.7, 'n'], [15.0, 79.5, 'n'],
  [9.9, 78.1, 'z'], [11.0, 77.0, 'z'], [10.5, 76.3, 'z'],
  // Kotte, the kingdom of Ceylon, with Jaffna in the north
  [6.9, 79.9, 'k'], [7.8, 80.7, 'k'], [9.3, 80.4, 'k'],
  // Unexplored: Persia, Baluchistan, Central Asia, the mountains from Gilgit to Bhutan with Nepal and
  // Tibet, Assam, Arakan and Burma, and Ceylon.
  [36, 62, '#'], [33, 62, '#'], [29.5, 61.5, '#'], [26, 62, '#'], [27.5, 64.5, '#'], [29.8, 66.8, '#'], [26.3, 65.5, '#'],
  [37.3, 66, '#'], [37, 70.5, '#'], [36.8, 73.5, '#'], [36, 74.8, '#'], [34.2, 77.5, '#'], [33, 79.5, '#'], [32.3, 77.4, '#'],
  [30.6, 79.4, '#'], [29.6, 81.8, '#'], [28.4, 83.5, '#'], [27.7, 85.5, '#'], [27.4, 87.5, '#'], [31, 82, '#'], [31, 86, '#'],
  [30, 91, '#'], [33, 85, '#'], [27.3, 90.5, '#'], [26.3, 92.5, '#'], [27.3, 94.8, '#'], [23.8, 91.6, '#'], [21.8, 92.3, '#'],
  [19.5, 94, '#'], [22, 95.5, '#'], [25, 95.3, '#'], [18, 95.5, '#'], [16.5, 97, '#'],
  [36, 54, '#'], [33, 55, '#'], [30, 54, '#'], [27.5, 56, '#'], [33.5, 51, '#'], [30, 50.5, '#'], [23, 57, '#'], [39, 64, '#'], [39.5, 69, '#'],
  [38.5, 73, '#'], [37.5, 78, '#'], [36, 82, '#'], [38.5, 84, '#'], [36.5, 90, '#'], [37, 94, '#'], [34, 92, '#'], [35, 97, '#'], [31, 97, '#'],
  [28, 97.5, '#'], [23, 98.5, '#'], [20, 98.5, '#'], [16, 98.5, '#'], [13, 99, '#'], [10, 98.8, '#'],
];
export const FORCE_LAND = [];
export const FORCE_SEA = [];

// Small islands join the territory nearest them; the Maldives and the Andamans are unexplored.
export const ISLAND = 30;
export const ISLAND_REACH = 10;

// Drawn on the map, not played: the rivers [lat, lon] from source to mouth (the Ganges first), and an
// elephant on the field of Panipat.
export const RIVERS = [
  // the Ganges
  [[30.0, 78.2], [28.2, 78.5], [27.0, 79.9], [25.4, 81.8], [25.3, 83.0], [25.6, 85.1], [25.3, 87.2], [24.5, 88.3], [23.4, 89.5], [22.6, 90.4]],
  // the Yamuna, past Delhi and Agra to Prayag
  [[30.5, 77.6], [28.6, 77.25], [27.2, 78.05], [26.4, 79.5], [25.4, 81.8]],
  // the Indus
  [[34.6, 72.9], [33.9, 72.2], [32.5, 71.5], [30.5, 70.8], [28.4, 69.7], [27.7, 68.9], [25.4, 68.4], [24.2, 67.5]],
  // the Narmada
  [[22.7, 81.8], [23.1, 79.9], [22.7, 77.7], [22.2, 75.6], [21.9, 73.8], [21.7, 72.7]],
  // the Godavari
  [[19.9, 73.8], [19.1, 76.0], [18.9, 79.3], [17.8, 81.2], [16.6, 82.2]],
  // the Krishna
  [[17.9, 73.7], [16.6, 74.9], [16.2, 77.3], [16.5, 80.1], [15.9, 81.0]],
];
export const SIGHTS = [[29.95, 76.25, 'elephant']];
