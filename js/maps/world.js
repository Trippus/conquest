// The modern world map, second draft: 40 territories in 6 regions, drawn as a hex grid.
//
// GRID is the map itself, one letter per hex, '.' is sea. Each column is 5° of longitude
// (column 0 = 170° W, so the Pacific is at the edges) and each row 5° of latitude (row 0 = 80° N).
// Odd rows sit half a hex to the right. To move a border, change letters; to add an island,
// put letters in the sea. Territories that touch on the grid are neighbours; SEA lists the
// crossings over water. A territory may be in more than one piece (Japan, Madagascar, New Zealand).
//
// The division is our own and neutral: geographic areas, not today's countries.
//
// Region bonus: how many of the region's territories can be attacked from outside, plus one per
// three territories, minus one (at least 2). Few ways in and many territories is worth more.
// Bot games tune it later (npm run sim -- 1000 hard,hard,hard world).

import { hexMap } from './hex.js';

export const GRID = [
  '................bbbbb.ggggggggg.........................................',
  '..........bbbbbbbbbbbgggggggggg......................rrrrn..............',
  '.aaaaaabbbbbbbbbqqqq...ggggggg.......sssseeeeerrrrrrrrrrrnnnnnnnnnnnnnn.',
  '.aaaaabbbbbbbbbbq..qqq..ggg.........ssssseeeeerrrrrrrrrrrnnnnnnnnnnnnnn.',
  '..aaaabbbbbbbbbb...qqq...g.........sssssseeeeerrrrrrrrrrrnnnnnnn..n.....',
  '......vvvvbbhhhh...qqq..........ii.ls..eeeeeeerrrrrrrrrrrnnnn.n...n.....',
  '........vvvvhhhhoooooo...........iwwllleeeeeecccccccBBBBBBkknnnn........',
  '........vvvvhhhhoooooo...........wwwuuuu..ee.ccccccccBBBBBkkk.JJ........',
  '........vvvvhhhhoooo............jjj.uuuuMMMM.ccccckkkkkkkkkk..J.........',
  '..........vvhhhhooo.............NNNNN...MMMMMMcccddkkkkkkkkk.JJ.........',
  '...........mmmhhooo............NNNNNNLLLLMMMMMddddddkkkkkkk.............',
  '............mmmm..o............NNNNNNLLLLRRRRR.ddddddkkkkkk.............',
  '.............mmmmm.............NNNNNNLLLLLRRRR..dddd.tttt...............',
  '...............mmm............WWWWWWWWEEEEERR...ddd..tttt..zz...........',
  '.................mmKKKKK......WWWWWWWWCCEEEE.....dd..tttt..zz...........',
  '...................KKKKKKK......WWWWCCCCCEEE..........tt.zzz............',
  '..................DDAAAAAAA.........CCCCCEEE.........zzz.zzzz...........',
  '..................DDAAAAAAHH........CCCCCEE............zzzz..GGGG.......',
  '..................DDDAAAAHHH........CCCCEEE...................y.........',
  '..................DDDAAAHHHH........SSSSSS..S............xxxyyyy........',
  '...................DDPPHHHH.........SSSSSS..S...........xxxxyyyyy.......',
  '....................DPPPHH...........SSSS...S...........xxxxyyyyy.......',
  '....................DPPPP............SSSS...............xxxxyyyyy.......',
  '....................DPPP..............SS.................xx..yyyy.......',
  '....................DPP........................................y.....y..',
  '....................DP..............................................y...',
  '....................DP..................................................',
];

export const REGIONS = {
  na: 'Nordamerika',
  sa: 'Sydamerika',
  eu: 'Europa',
  af: 'Afrika',
  as: 'Asien',
  oc: 'Oceanien',
};

// letter: [id, name, region]
export const TERRITORIES = {
  a: ['alaska', 'Alaska', 'na'],
  b: ['nordcanada', 'Nordcanada', 'na'],
  q: ['oestcanada', 'Østcanada', 'na'],
  g: ['groenland', 'Grønland', 'na'],
  v: ['vestkysten', 'Vestkysten', 'na'],
  h: ['praerien', 'Prærien', 'na'],
  o: ['oestkysten', 'Østkysten', 'na'],
  m: ['mellemamerika', 'Mellemamerika', 'na'],
  K: ['caribien', 'Caribien-kysten', 'sa'],
  D: ['andes', 'Andes', 'sa'],
  A: ['amazonas', 'Amazonas', 'sa'],
  H: ['hoejlandet', 'Højlandet', 'sa'],
  P: ['pampas', 'Pampas', 'sa'],
  i: ['britiske-oeer', 'Britiske Øer', 'eu'],
  s: ['skandinavien', 'Skandinavien', 'eu'],
  j: ['iberien', 'Iberien', 'eu'],
  w: ['vesteuropa', 'Vesteuropa', 'eu'],
  l: ['centraleuropa', 'Centraleuropa', 'eu'],
  e: ['oesteuropa', 'Østeuropa', 'eu'],
  u: ['sydeuropa', 'Sydeuropa', 'eu'],
  N: ['maghreb', 'Maghreb', 'af'],
  L: ['nilen', 'Nilen', 'af'],
  W: ['vestafrika', 'Vestafrika', 'af'],
  C: ['centralafrika', 'Centralafrika', 'af'],
  E: ['afrikas-horn', 'Afrikas Horn', 'af'],
  S: ['sydlige-afrika', 'Det sydlige Afrika', 'af'],
  M: ['mellemoesten', 'Mellemøsten', 'as'],
  R: ['arabien', 'Arabien', 'as'],
  c: ['centralasien', 'Centralasien', 'as'],
  r: ['vestsibirien', 'Vestsibirien', 'as'],
  n: ['oestsibirien', 'Østsibirien', 'as'],
  B: ['steppen', 'Steppen', 'as'],
  d: ['sydasien', 'Sydasien', 'as'],
  k: ['oestasien', 'Østasien', 'as'],
  t: ['sydoestasien', 'Sydøstasien', 'as'],
  J: ['japan', 'Japan', 'as'],
  z: ['sundaoeerne', 'Sundaøerne', 'oc'],
  G: ['ny-guinea', 'Ny Guinea', 'oc'],
  x: ['vestaustralien', 'Vestaustralien', 'oc'],
  y: ['oestaustralien', 'Østaustralien', 'oc'],
};

// What the map draws in each territory (js/map-art.js): ink mountains, forests or dunes.
export const TERRAIN = {
  v: 'mountains', // the Rockies
  D: 'mountains', // the Andes
  l: 'mountains', // the Alps
  c: 'mountains', // the Pamirs and Tian Shan
  J: 'mountains',
  b: 'spruce', // the northern forests
  q: 'forest',
  s: 'spruce',
  r: 'spruce', // the taiga
  n: 'spruce',
  A: 'oak', // the rainforests
  C: 'oak',
  z: 'oak',
  N: 'desert', // the Sahara
  L: 'desert',
  R: 'desert',
  x: 'desert', // the outback
};

// Where crowded territories put their seal and name: letter: [row, column, name side], side
// 'below', 'above', 'left' or 'right'. The rest use the cell closest to the middle of the
// territory, with the name below.
export const PLACES = {
  i: [5, 32, 'above'],
  j: [8, 32, 'left'],
  w: [7, 34, 'below'],
  l: [6, 37, 'above'],
  s: [2, 38, 'below'],
  u: [8, 38, 'below'],
  K: [14, 21, 'above'],
};

// Region missions for mission games (the engine adds "hold territories" and "knock out a player").
// Each asks for about 12–16 territories; the small pairs need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['as', 'sa'] },
  { type: 'regions', regions: ['as', 'af'] },
  { type: 'regions', regions: ['na', 'af'] },
  { type: 'regions', regions: ['na', 'eu'] },
  { type: 'regions', regions: ['eu', 'sa'], plusOne: true },
  { type: 'regions', regions: ['eu', 'oc'], plusOne: true },
];

// Crossings over water, drawn as dashed lines: [from, to].
export const SEA = [
  ['a', 'n'], // Beringstrædet
  ['g', 'i'], // over Island
  ['i', 's'], // Nordsøen
  ['H', 'W'], // Sydatlanten
  ['z', 'x'], // Timorhavet
  ['z', 'G'], // Molukkerne
  ['J', 'k'], // Koreastrædet
  ['q', 'g'], // Davisstrædet
];

// Where the region names and the compass go, in map units.
export const REGION_PLACES = { na: [10, 19], sa: [22, 33], eu: [57.5, 5], af: [55, 30], as: [84, 27], oc: [119, 30] };
export const COMPASS = [91, 35.5]; // in the open sea between Africa and Australia
// The world's sea routes are short, so most ships sail the great oceans: [row, column].
export const OCEANS = [[17, 5], [9, 68], [13, 26]];

// The names in English, where they differ (see inLanguage in index.js).
export const EN = {
  name: 'The World',
  REGIONS: { na: 'North America', sa: 'South America', eu: 'Europe', af: 'Africa', as: 'Asia', oc: 'Oceania' },
  TERRITORIES: {
    nordcanada: 'North Canada', oestcanada: 'East Canada', groenland: 'Greenland', vestkysten: 'West Coast', praerien: 'Prairies',
    oestkysten: 'East Coast', mellemamerika: 'Central America', caribien: 'Caribbean Coast', amazonas: 'Amazon', hoejlandet: 'Highlands',
    'britiske-oeer': 'British Isles', skandinavien: 'Scandinavia', iberien: 'Iberia', vesteuropa: 'West Europe',
    centraleuropa: 'Central Europe', oesteuropa: 'East Europe', sydeuropa: 'Southern Europe', nilen: 'The Nile',
    vestafrika: 'West Africa', centralafrika: 'Central Africa', 'afrikas-horn': 'Horn of Africa', 'sydlige-afrika': 'Southern Africa',
    mellemoesten: 'Middle East', arabien: 'Arabia', centralasien: 'Central Asia', vestsibirien: 'West Siberia', oestsibirien: 'East Siberia',
    steppen: 'The Steppe', sydasien: 'South Asia', oestasien: 'East Asia', sydoestasien: 'Southeast Asia', sundaoeerne: 'Sunda Islands',
    'ny-guinea': 'New Guinea', vestaustralien: 'West Australia', oestaustralien: 'East Australia',
  },
};

export const WORLD_GRID = hexMap({ id: 'world', name: 'Verden', GRID, REGIONS, TERRITORIES, TERRAIN, PLACES, MISSIONS, SEA, REGION_PLACES, COMPASS, OCEANS, SHIP_COUNT: 4, WRAPS: true, TITLE: 'Ruler of the World', NAMES: { en: EN } });
export const { hexCenter, hexCorners, hexNeighbours, cellAt, WIDTH, HEIGHT, WRAPS } = WORLD_GRID;
export const WORLD = WORLD_GRID.MAP;
