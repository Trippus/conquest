// Vikingetogtet: the North in the Viking age, 25 territories in 7 regions, drawn as a hex grid
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
  'GG#################.##............#................................#............',
  'GG###############...##........................................hhhh####..........',
  'GGG###################........................................hhhh####..........',
  'GGGG###############.......................................hhhhhhh#######........',
  'GGGGG##############.....................................h.hhhhhhhh##########....',
  'GGGGG###########.......................................hhhhhhhhhh############...',
  'GGGGGG#######...........................................hhhhhhhhhh#############.',
  'GGGGGG#####............................................hhhhhhhhhh##############.',
  'GGGGGGGG###............................................hhhhhhhhhhh##############',
  'GGGGGGGG##............................................hhhhhhhhhhFF######..#####.',
  'GGGGGGGGG...........III.IIIII.........................thhhhhhhhFFFF#######......',
  'GGGGG..............I.IIIIIIII........................ttthhhhhF...FF######.....##',
  'GGGGG................IIIIIIIII.......................ttttthhhF...FFF######..#..#',
  'GGGGG................IIIIIII........................tttttthFF...FFFF######..####',
  'GGGGG................IIIIII........................tttttttuuF...FFFFF#######.###',
  'GGGG....................I........................ttttttttuuu..FFFFFFF###########',
  'GGGG.............................................ttttttttuu...FFFFFFFF##########',
  'GGG............................................vvttttttuuu...FFFFFFFFF##########',
  'GGGG...............................x...........vvvtttttuuu....FFFFFFFFF#########',
  'GGG................................x..........vvvvvwttuuu.....FFFFFFFFZZZ#######',
  'GGG............................................vvvvwwwuuuu....FFFFFFFZZZZZ######',
  'GG......................................O.....vvvvwwwwuuuu....#####.ZZZZZZ######',
  '.GG............................................vvvwwwwwuuuuu...#.....ZZZZZZ#####',
  '...............................................vvwwwwwwuuuu.....##.#ZZZZZZZ#####',
  '.......................................O........vww.wwgguuu.....#####ZZZZZZZ####',
  '.....................................OO........vww..wgggg.....######ZZZZZZZZ####',
  '.....................................SS..............ggggg....K..####ZZZZZZZ####',
  '....................................SSSS.............gggg.l...K.####ZZZZZZ######',
  '.....................................SSS...........j..ggg.....KKKK###ZZZZ#######',
  '....................................SSS..........jjj..kkk....KKKK###ZZZZ########',
  '.....................................SSS..........jj..k.......K#################',
  '....................................SSNN.........jjoo.k......###################',
  '...................................RR.NNN.........j..o........##################',
  '..................................RRR.NNN.........#......##.####################',
  '.................................RRRR..NNN........#####.########################',
  '................................RRRR...MME......ff##############################',
  '..................................RRR.MMMME....fff##############################',
  '.................................RRR..MMMEE...ffff##############################',
  '.................................RR...MMMEEE..##fff#############################',
  '......................................WWWEE..###################################',
  '......................................WWWWW.####################################',
  '.....................................WW....#####################################',
  '...........................................nn###################################',
  '........................................n.nnn###################################',
  '.........................................nnnnn##################################',
  '.....................................###nnnn####################################',
  '......................................###nn#####################################',
  '.......................................#########################################',
  '........................................#####################################.##',
  '........................................##############################.###..####',
];

export const REGIONS = {
  dk: 'Danmark',
  no: 'Norge',
  sv: 'Svealand',
  oe: 'Østerleden',
  br: 'Britannien',
  ve: 'Vesterleden',
  fr: 'Frankerriget',
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
  n: ['normandiet', 'Normandiet', 'fr'],
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
  ['f', 'j'], // along the Frisian coast
  ['f', 'n'], // along the Flemish coast
  ['j', 'N'],
  ['j', 'w'], // Skagerrak
  ['o', 'k'], // Øresund
  ['g', 'l'],
  ['u', 'l'],
  ['l', 'K'],
  ['K', 'Z'], // into the Gulf of Finland and up the Neva
];


// Region missions: about 9–11 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['br', 'dk'], plusOne: true },
  { type: 'regions', regions: ['no', 've'] },
  { type: 'regions', regions: ['sv', 'oe', 'dk'] },
  { type: 'regions', regions: ['br', 'fr', 'dk'] },
  { type: 'regions', regions: ['no', 'sv'], plusOne: true },
  { type: 'regions', regions: ['ve', 'br'] },
];

// Where the region names, the compass and the ships go. A name may sit on unexplored land.
export const REGION_PLACES = { dk: [99, 57], no: [85.5, 23.5], sv: [107.15, 42], oe: [123, 57], br: [44, 54], ve: [47.3, 33.5], fr: [80, 75.5] };
export const COMPASS = [27, 70];
export const SHIPS = [[42, 18], [9, 42], [24, 12]]; // [row, column] they sail near

// The flavour of the age: the computer players' names and what the winner becomes.
// Rules that differ from the modern rules on this map. Later seats get extra start armies; on a
// small map moving first is worth more than on the world. Measured with hard bots and missions
// (900 games each): 2 players 50/50 with +7 (57/43 with +5, 43/57 with +9); 3 players 33/31/36
// with +2; 4 players 27/25/25/23 without help.
export const RULES = { laterSeatArmies: { 2: 7, 3: 2, 4: 0, 5: 0, 6: 0 } };

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
  RULES,
  RULERS,
  TITLE,
});
export const VIKINGS = VIKINGS_GRID.MAP;
