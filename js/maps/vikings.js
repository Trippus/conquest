// Vikingetogtet: the North in the Viking age, 31 territories in 8 regions, drawn as a hex grid
// (see hex.js for what each part means).
//
// The Vikings sailed, so there are many sea routes: west over Orkney, the Faroes and Iceland to
// Greenland (Vesterleden), east over Gotland to Kurland and up the Neva to Gardarike (Østerleden).
// The coastlines are real (tools/make-viking-grid.mjs draws the grid from Natural Earth); land
// outside the campaign is '#', drawn as unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '#####################...........................................................',
  'G####################...........................................................',
  'GG#################.##.............................................h............',
  'GG###############...##........................................hhhhhhhh..........',
  'GGG###################........................................hhhhhhhh..........',
  'GGGG###############.......................................hhhhhhhhhhh###........',
  'GGGGG##############.....................................h.hhhhhhhhhhhh######....',
  'GGGGG###########.......................................hhhhhhhhhhhFFF########...',
  'GGGGGG#######...........................................hhhhhhhFFFFFFF#########.',
  'GGGGGG#####............................................hhhhhhhFFFFFFFF#########.',
  'GGGGGGGG###............................................hhhhhhhFFFFFFFFF#########',
  'GGGGGGGG##............................................hhhhhhhFFFFFFFFFF#..#####.',
  'GGGGGGGGG...........III.IIIII.........................thhhhhhFFFFFFFFFF###......',
  'GGGGG..............I.IIIIIIII........................ttthhhhFF...FFFFF###.....##',
  'GGGGG................IIIIIIIII.......................ttttthhhF...FFFFF####..#..#',
  'GGGGG................IIIIIII........................tttttthhF...FFFFF#####..####',
  'GGGGG................IIIIII........................tttttttuuF...FFFFF#######.###',
  'GGGG....................I........................ttttttttuuu..FFFFFFF###########',
  'GGGG.............................................ttttttttuu...FFFFFFFF##########',
  'GGG............................................vvttttttuuu...FFFFFFFFF##########',
  'GGGG...............................x...........vvvtttttuuu....FFFFFFFFF#########',
  'GGG................................x..........vvvvvwttuuu.....FFFFFFFFZZZ#######',
  'GGG............................................vvvvwwwuuuu....FFFFFFFFZZZZ######',
  'GG............................................vvvvwwwwuuuu....FFFFF.ZZZZZZ######',
  '.GG............................................vvvwwwwwuuuuu...F.....ZZZZZZ#####',
  '...............................................vvwwwwwwuuuu.....ee.eZZZZZZZ#####',
  '.......................................O........vww.wwgguuu.....eeeeeZZZZZZZ####',
  '.....................................OO........vww..wgggg.....eeeeeeZZZZZZZZ####',
  '.....................................SS..............ggggg....K..eeeeZZZZZZZ####',
  '....................................SSSS.............gggg.l...K.eeeeZZZZZZ######',
  '.....................................SSS...........j..ggg.....KKKKeeeZZZZ#######',
  '....................................SSS..........jjj..kkk....KKKK####ZZZ########',
  '.....................................SSS..........jj..k.......KKK###############',
  '....................................SSNN.........jjoo.k......pp#################',
  '...................................RR.NNN.........j..o........pp################',
  '..................................RRR.NNN.........H......Pp.ppp#################',
  '.................................RRRR..NNN........HHHHP.PPPpppp#################',
  '................................RRRR...MME......ffHHHHPPPP##p###################',
  '..................................RRR.MMMME....ffffHH##P########################',
  '.................................RRR..MMMEE...ffff##############################',
  '.................................RR...MMMEEE..Lff###############################',
  '......................................WWWEE..LLL################################',
  '......................................WWWWW.LLLL################################',
  '.....................................WW....LLLL#################################',
  '...........................................nLLL#################################',
  '........................................n.nn####################################',
  '.........................................nnn####################################',
  '.....................................BBBBnnn####################################',
  '......................................BBBBn#####################################',
  '.......................................BB#######################################',
  '........................................BB###################################.##',
  '........................................##############################.###..####',
  '.........................................#############################...#...###',
  '.........................................############.###############...##..####',
  '.........................................#############..#############....##.####',
  '.........................................############..#############.........###',
  '.........................................#########.###..#############.........##',
  '..................................###.#.########...###...###########..........##',
  '..................................###########.......###...##########............',
  '..................................###########.......###....########.............',
  '..................................###########.....#..###....########............',
  '..................................##########.........###....########...####.....',
  '..................................#########.......#....###..########.########.##',
  '..................................########.......##....###..####..#.############',
  '..................................########........#.........###..###############',
  '.................................########........##.....#...###...##############',
  '..................................########...............#...##....#############',
  '.................................#########..............#....##...##############',
  '..................................########....................##...#############',
  '..................................######.....................##....#############',
  '....................................####..........##..........#.....############',
  '....................................#......#########................##.##..#####',
];

export const REGIONS = {
  dk: 'Danmark',
  no: 'Norge',
  sv: 'Svealand',
  oe: 'Østerleden',
  br: 'Britannien',
  ve: 'Vesterleden',
  fr: 'Frankerriget',
  vn: 'Vendland',
};

// letter: [id, name, region]
export const TERRITORIES = {
  j: ['jylland', 'Jylland', 'dk'],
  o: ['oeerne', 'Øerne', 'dk'],
  k: ['skaane', 'Skåne', 'dk'],
  v: ['vestlandet', 'Vestlandet', 'no'],
  w: ['viken', 'Viken', 'no'],
  t: ['troendelag', 'Trøndelag', 'no'],
  h: ['haalogaland', 'Hålogaland', 'no'],
  u: ['uppland', 'Uppland', 'sv'],
  g: ['goetaland', 'Götaland', 'sv'],
  l: ['gotland', 'Gotland', 'sv'],
  F: ['finland', 'Finland', 'oe'],
  K: ['kurland', 'Kurland', 'oe'],
  e: ['estland', 'Estland', 'oe'],
  Z: ['gardarike', 'Gardarike', 'oe'],
  S: ['skotland', 'Skotland', 'br'],
  N: ['northumbria', 'Northumbria', 'br'],
  M: ['mercia', 'Mercia', 'br'],
  E: ['east-anglia', 'East Anglia', 'br'],
  W: ['wessex', 'Wessex', 'br'],
  R: ['irland', 'Irland', 've'],
  O: ['orkney', 'Orkney', 've'],
  x: ['faeroeerne', 'Færøerne', 've'],
  I: ['island', 'Island', 've'],
  G: ['groenland', 'Grønland', 've'],
  f: ['frisland', 'Frisland', 'fr'],
  L: ['flandern', 'Flandern', 'fr'],
  n: ['normandiet', 'Normandiet', 'fr'],
  B: ['bretagne', 'Bretagne', 'fr'],
  H: ['holsten', 'Holsten', 'vn'],
  P: ['pommern', 'Pommern', 'vn'],
  p: ['proejsen', 'Prøjsen', 'vn'],
};

export const TERRAIN = {
  v: 'mountains', // the fjords
  h: 'mountains',
  t: 'forest',
  u: 'forest',
  g: 'forest',
  F: 'forest',
  Z: 'forest',
  S: 'mountains', // the Highlands
};

export const SEA = [
  ['G', 'I'], // Grønlandshavet
  ['I', 'x'],
  ['x', 'O'],
  ['x', 'v'],
  ['O', 'v'],
  ['R', 'M'], // Det Irske Hav
  ['W', 'n'], // Kanalen
  ['f', 'E'], // over Nordsøen
  ['L', 'E'], // over the Strait of Dover
  ['B', 'W'], // Brittany to Cornwall
  ['j', 'N'],
  ['j', 'w'], // Skagerrak
  ['o', 'k'], // Øresund
  ['o', 'H'], // Femern Bælt
  ['k', 'P'], // over Bornholm
  ['g', 'l'],
  ['u', 'l'],
  ['l', 'K'],
  ['l', 'p'],
];


// Region missions: about 9–12 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['br', 'dk'], plusOne: true },
  { type: 'regions', regions: ['no', 've'] },
  { type: 'regions', regions: ['sv', 'oe'], plusOne: true },
  { type: 'regions', regions: ['br', 'fr'] },
  { type: 'regions', regions: ['no', 'sv'], plusOne: true },
  { type: 'regions', regions: ['vn', 'dk', 'oe'] },
  { type: 'regions', regions: ['fr', 'vn', 'dk'] },
];

// Where the region names, the compass and the ships go. A name may sit on unexplored land.
export const REGION_PLACES = { dk: [80, 44.5], no: [85, 22], sv: [104, 51], oe: [121.25, 51], br: [55.25, 64.5], ve: [49.3, 32.5], fr: [84.35, 75], vn: [99, 60] };
export const COMPASS = [27, 70, 1.7];
export const SHIPS = [[42, 18], [9, 42], [24, 12]]; // [row, column] they sail near
export const SHIP = 'longship';
// The Norse called the empty parts of Greenland Óbyggðir: the unsettled lands.
export const LANDMARKS = [[27, 8, 'Ubygderne']];

// Rules that differ from the modern rules on this map. Later seats get extra start armies; on a
// small map moving first is worth more than on the world. Measured with hard bots and missions
// (900 games each): 2 players 54/46 with +7 and 45/55 with +9; 3 players 32/33/35 with +2;
// 4 players 27/25/23/25 without help.
export const RULES = { laterSeatArmies: { 2: 8, 3: 2, 4: 0, 5: 0, 6: 0 } };

// The flavour of the age: the computer players' names and what the winner becomes.
export const RULERS = ['Jarl Ragnar', 'Dronning Gunhild', 'Erik Blodøkse', 'Harald Hårderåde', 'Skjoldmø Lagertha', 'Knud den Store'];
export const TITLE = 'Ruler of the North';

export const VIKINGS_GRID = hexMap({
  id: 'vikings',
  name: 'Vikingetogtet',
  GRID,
  REGIONS,
  TERRITORIES,
  TERRAIN,
  SEA,
  MISSIONS,
  REGION_PLACES,
  COMPASS,
  SHIPS,
  SHIP,
  LANDMARKS,
  RULES,
  RULERS,
  TITLE,
});
export const VIKINGS = VIKINGS_GRID.MAP;
