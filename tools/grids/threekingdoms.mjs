// The grid for De tre kongeriger (js/maps/threekingdoms.js), drawn by tools/make-grid.mjs.

// The window: China of the Han from the Gobi to the Gulf of Tonkin, with the steppe, the Tibetan
// plateau, the north of Korea, Japan and the north of Indochina round it as unexplored land.
export const LAT_TOP = 47;
export const LAT_STEP = 0.2;
export const ROWS = 156;
export const LON_WEST = 88;
export const LON_EAST = 146;
export const SQUASH_AT = 32;

// Territory centres [lat, lon, letter], several for the large ones; '#' marks land outside the campaign.
export const CENTRES = [
  // Zhongyuan: Luoyang, Xuchang with Runan, Ye with Wei commandery, Chenliu with Yan province
  [34.6, 112.4, 'L'],
  [33.9, 113.8, 'X'], [33.0, 114.6, 'X'],
  [36.3, 114.4, 'Y'], [37.4, 115.3, 'Y'],
  [35.0, 115.5, 'C'], [35.7, 116.6, 'C'],
  // Guanzhong: Chang'an, Tianshui with Longxi, Wuwei down the Hexi corridor to Dunhuang
  [34.3, 108.9, 'A'], [35.4, 109.5, 'A'], [36.6, 109.5, 'A'],
  [34.6, 105.7, 'T'], [35.5, 104.3, 'T'],
  [37.9, 102.6, 'W'], [39.0, 100.4, 'W'], [39.7, 98.5, 'W'], [40.1, 95.0, 'W'],
  // Hebei: Ji (You province), Zhongshan with Bohai, Taiyuan (Bing province) with Shangdang and Yanmen
  [39.9, 116.4, 'J'], [40.5, 118.4, 'J'],
  [38.5, 115.0, 'Z'], [38.0, 116.8, 'Z'],
  [37.9, 112.5, 'B'], [36.4, 112.2, 'B'], [39.4, 112.6, 'B'],
  // Shandong (Qing and Xu): Linzi with Donglai, Langya, Xiapi with Guangling
  [36.8, 118.3, 'Q'], [37.3, 120.6, 'Q'],
  [35.6, 118.8, 'G'],
  [34.3, 117.9, 'P'], [33.3, 119.2, 'P'],
  // Liaodong: Xiangping with the peninsula, Liaoxi, Lelang with Daifang in Korea, and Samhan, the
  // chiefdoms of the south that paid Daifang tribute
  [41.3, 123.2, 'S'], [39.6, 122.1, 'S'],
  [41.3, 120.6, 'R'],
  [39.0, 125.7, 'U'], [38.2, 126.4, 'U'],
  [35.8, 127.4, 'M'], [36.8, 127.2, 'M'], [35.3, 128.7, 'M'],
  // Shu: Chengdu, Hanzhong with Yinping, Jiangzhou with Ba and Baidi
  [30.7, 104.1, 'D'], [31.5, 103.1, 'D'],
  [33.1, 107.0, 'H'], [32.7, 105.4, 'H'],
  [29.6, 106.5, 'K'], [31.0, 108.6, 'K'],
  // Nanzhong: Jianning with Yuexi, Yongchang, Zangke
  [25.0, 103.0, 'N'], [24.0, 104.0, 'N'], [27.6, 102.3, 'N'],
  [25.1, 99.2, 'O'], [24.3, 100.6, 'O'],
  [26.5, 106.7, 'E'], [25.4, 107.6, 'E'],
  // Jingzhou: Xiangyang with Shangyong, Jiangling with Wuling, Changsha, Lingling with Guiyang
  [32.0, 112.1, 'V'], [32.4, 110.4, 'V'],
  [30.3, 112.2, 'I'], [29.0, 111.0, 'I'], [30.5, 114.3, 'I'], // Jiangxia, on the Yangzi
  [28.2, 112.9, 'c'], [27.0, 113.6, 'c'],
  [26.2, 111.6, 'l'], [25.8, 113.0, 'l'],
  // Jiangdong: Jianye with Lujiang, Wujun, Kuaiji down to Jian'an, Yuzhang
  [32.0, 118.8, 'j'], [31.6, 117.2, 'j'], [30.8, 116.4, 'j'],
  [31.3, 120.6, 'w'],
  [30.0, 120.6, 'k'], [28.5, 120.0, 'k'], [26.1, 119.3, 'k'],
  [28.7, 115.9, 'y'], [27.0, 115.0, 'y'], [29.6, 116.9, 'y'],
  // Lingnan: Panyu, Cangwu with Yulin and Hepu, Jiaozhi with Jiuzhen
  [23.1, 113.3, 'p'], [23.2, 116.0, 'p'],
  [23.5, 111.3, 'g'], [22.8, 108.4, 'g'], [24.4, 110.0, 'g'],
  [21.0, 105.8, 'z'], [19.8, 105.6, 'z'],
  // Unexplored: the steppe of the Xianbei, the Ordos, Manchuria, Goguryeo and
  // Japan; the Western Regions and the plateau of the Qiang; Burma, Laos and the south of Vietnam;
  // Hainan and Taiwan.
  [44.5, 105, '#'], [45, 112, '#'], [46, 120, '#'], [43, 96, '#'], [42.6, 116.5, '#'], [41.6, 108.5, '#'], [39.6, 107.6, '#'],
  [42.2, 101.5, '#'], [42.3, 92.5, '#'], [44.5, 125, '#'], [46, 131, '#'], [43.5, 129, '#'], [41.6, 126.6, '#'], [43.2, 122.5, '#'],
  [39, 90, '#'], [36.5, 92, '#'], [36.2, 98.3, '#'], [33.5, 96.5, '#'], [31, 92, '#'], [29, 90, '#'], [31.6, 100.6, '#'], [28.6, 98.6, '#'],
  [34.4, 101.5, '#'],
  [22.5, 97, '#'], [20, 99.5, '#'], [17.5, 98, '#'], [22.2, 102.4, '#'], [19.3, 102.8, '#'], [17, 104.6, '#'], [16.5, 107, '#'],
  [19.2, 109.7, '#'], [23.7, 121, '#'],
  [41.2, 99.5, '#'], [40.3, 104, '#'], [41.6, 95.5, '#'], [37.6, 97.6, '#'], [38.6, 93.8, '#'], [41.0, 112.6, '#'], [40.3, 110.0, '#'],
];
export const FORCE_LAND = [];
export const FORCE_SEA = [];

// Small islands join the territory nearest them; Hainan, Taiwan, Jeju and Japan are unexplored.
export const ISLAND = 30;
export const ISLAND_REACH = 10;

// Drawn on the map, not played: the rivers [lat, lon] from source to mouth, and a piece of the Great
// Wall north of Taiyuan.
export const RIVERS = [
  // the Yangzi, from the mountains past Chengdu's south, the Three Gorges and the Red Cliffs to the sea
  [[27.4, 99.6], [26.3, 101.6], [27.6, 103.3], [28.8, 104.6], [29.6, 106.5], [30.8, 108.4], [31.0, 110.2], [30.3, 112.2], [29.4, 113.2],
    [30.5, 114.3], [29.8, 116.0], [30.6, 117.4], [32.0, 118.7], [31.8, 120.0], [31.6, 121.3]],
  // the Yellow River, round the Ordos and out by its Han course into the Bohai
  [[34.6, 100.6], [36.0, 103.8], [37.5, 105.2], [39.4, 106.7], [40.6, 108.0], [40.3, 111.0], [38.6, 110.6], [35.6, 110.4],
    [34.7, 110.4], [34.8, 113.0], [35.3, 115.0], [36.3, 116.4], [37.4, 117.6], [37.9, 118.6]],
  // the Han, from Hanzhong past Xiangyang to the Yangzi
  [[33.1, 106.6], [32.8, 108.9], [32.6, 110.6], [32.0, 112.1], [31.2, 112.6], [30.6, 114.2]],
  // the Huai
  [[32.5, 113.4], [32.4, 115.5], [32.9, 117.4], [33.5, 118.8], [34.0, 120.1]],
];
export const SIGHTS = [[40.15, 113.3, 'wall']];
