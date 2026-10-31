// Vikingetogtet: the North in the Viking age, 25 territories in 7 regions, drawn as a hex grid
// (see hex.js for what each part means). Not to scale: Greenland and Gardarike are pulled in close.
//
// The Vikings sailed, so there are many sea routes: west over Orkney, the Faroes and Iceland to
// Greenland (Vesterleden), east over Gotland and Åland to Kurland and Finland (Østerleden).

import { hexMap } from './hex.js';

export const GRID = [
  'GGGGG...........................hhhhhhh.................',
  'GGGGGG.........................hhhhhhhhh................',
  'GGGGGG........................hhhhhhhhhhh...............',
  'GGGGG.........................hhhhhhhhhhhFFFFF..........',
  'GGGG.....IIIII...............hhhhhhh....FFFFFFF.........',
  'GGG.....IIIIII.............ttttttt.....FFFFFFFF.........',
  'GG.......IIII.............ttttttt......FFFFFFFFZZZZZZZ..',
  '..........................ttttttt.......FFFFFFZZZZZZZZ..',
  '................xx.....vvvtttttt.........FFFF.ZZZZZZZZZ.',
  '................xx.....vvvvtttttuuuuuu........ZZZZZZZZZ.',
  '...................OO..vvvvvwww..uuuuuu.......ZZZZZZZZZ.',
  '...................OO..vvvvvwwww..uuuuu........ZZZZZZZZ.',
  '........................vvvvwwwwggggg..........ZZZZZZZZ.',
  '..............SSSS...........wwwgggggg.........ZZZZZZZZ.',
  '.............SSSSSS.............gggggg.........ZZZZZZZZ.',
  '.............SSSSS...............gggg..l...KKKKZZZZZZZ..',
  '..............SSSS.........jjj...kkk...ll.KKKKKZZZZZZ...',
  '..............SSSS.........jjj....kkk......KKKKZZZZZZ...',
  '........RRR...NNNN.........jjj.oo..........KKK..........',
  '........RRRR...NNNN........jjj.oo.......................',
  '........RRRR..MMMEE.......jjjj..........................',
  '........RRR..MMMMEEE.....ffff...........................',
  '.............WWWWWW.....fffff...........................',
  '............WWWWWW....fffff.............................',
  '...................nnnnn................................',
  '...................nnnn.................................',
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
  ['O', 'S'],
  ['O', 'v'],
  ['R', 'S'],
  ['R', 'M'], // Det Irske Hav
  ['W', 'n'], // Kanalen
  ['f', 'E'], // over Nordsøen
  ['j', 'N'],
  ['j', 'w'], // Skagerrak
  ['j', 'o'], // Lillebælt
  ['o', 'k'], // Øresund
  ['g', 'l'],
  ['u', 'l'],
  ['l', 'K'],
  ['u', 'F'], // over Ålandshavet
];

// Britain is small: its names go where there is room.
export const PLACES = {
  N: [18, 16, 'right'],
  M: [21, 14, 'left'],
  E: [21, 18, 'right'],
};

// Region missions: about 9–11 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['br', 'dk'], plusOne: true },
  { type: 'regions', regions: ['no', 've'] },
  { type: 'regions', regions: ['sv', 'oe', 'dk'] },
  { type: 'regions', regions: ['br', 'fr', 'dk'] },
  { type: 'regions', regions: ['no', 'sv'], plusOne: true },
  { type: 'regions', regions: ['ve', 'br'] },
];

export const REGION_PLACES = { dk: [40, 25], no: [34.6, 10], sv: [74.4, 19], oe: [67.5, 31], br: [12, 22.5], ve: [13.8, 14.5], fr: [57, 37.5] };
export const COMPASS = [84.8, 35.5];

// The flavour of the age: the computer players' names and what the winner becomes.
// Rules that differ from the modern rules on this map. Later seats get extra start armies; on a
// small map moving first is worth more than on the world. Measured with hard bots and missions
// (900 games each): 2 players 54/46 with +6 and 44/56 with +8; 3 players 34/31/36 with +2;
// 4 players even without help.
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
  PLACES,
  SEA,
  MISSIONS,
  REGION_PLACES,
  COMPASS,
  RULES,
  RULERS,
  TITLE,
});
export const VIKINGS = VIKINGS_GRID.MAP;
