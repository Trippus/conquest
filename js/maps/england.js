// Kampen om England, 1066: the year three men fought for the English crown. 26 territories in 8
// regions, drawn as a hex grid (see hex.js for what each part means).
//
// Harald Hårderåde came from Norway, Harold Godwinson held England, and Vilhelm of Normandy crossed
// the Channel. The coastlines are real (tools/make-grid.mjs draws the grid from Natural Earth);
// land outside the campaign is '#', drawn as unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '.........................................##########',
  '.........................................##########',
  '.........................................#.########',
  '...................O.......................########',
  '....................O.....................#########',
  '..................OO......................########.',
  '...........H...HOOOO.......................#######.',
  '..........H...HHHHO.........................#####..',
  '..........HH..HHHH.................................',
  '.............HHHHH.................................',
  '.........H...HHHHHHHHHH............................',
  '..........HH.HHHHHHHHHH............................',
  '.........H..HHHHHHHHHHH............................',
  '........H..H.HHHHHHHHl...........................#.',
  '.............HHHHHHHll...........................##',
  '...........HH.HHHHlll...........................#.#',
  '............S.SSSSll.............................##',
  '.............SSSSlll............................###',
  '..............S.SSll.l...........................##',
  '...........S.S.SSSllll..........................###',
  '..............S.SSllllBB.........................##',
  '...............SSSlllBB..........................##',
  '........UU.U...SSSSllBBB..........................#',
  '......UUUUUU..SSSSCCCBBB..........................#',
  '......UUUUUUU..SSC.CCCBBB.........................#',
  '......UUUUUUU.....CCCCBBY.........................#',
  '......UUUUUUUU.....CCCCYYYY.......................#',
  '..UUUUUUUUUUU......CCCYYYYY.......................#',
  '..mUUUUUUDDD.........CYYYYY........................',
  '...mmDDDDDDD........MMYYYYL......................##',
  '...mmmDDDDDD........MMMYYYLL..................#####',
  '..mmmmDDDDDD....g..MMMMMLLLL..............#########',
  '.....mmDDDDDD....ggMMMMMLLLLL.............#########',
  '....mmmmDDDD....gggMMMMMMLLL.............##########',
  '....mmmmmDDD......ggpMMMMMLLNNNN........###########',
  '..mmmmmmmDDD.....gpppMMMMMLNNNNN.......############',
  '...mmmmmmmmD......ppphMMMMMeuuuu........###########',
  '.mmmmmmmmm......ddpphhhMMMeeuuuu.......############',
  '..mmmmmmm......ddddphhhhhMeeeeuu......#############',
  '.mmmmm........dddddhhhhhheeeee........#############',
  '...mmm...........dddhhhWWWeeee........f############',
  '....................WWWWWsssk........fff###########',
  '.................cc.cWWWWsssskkk...ffffff##########',
  '................ccccWWWWWssskk...ffffff############',
  '................cccccWWW..s.s...fffffff############',
  '...............cccc............fffffff#############',
  '...............cccc.............ffffff#############',
  '.............cc................fffff###############',
  '...............................n###################',
  '.............................nn####################',
  '.......................nn...nnn####################',
  '.......................nn...nnn####################',
  '......................n.nnnnnnn####################',
  '.......................nnnnnnn#####################',
  '...................b....nnnnnnn####################',
  '................bbbb.bbnnnnnnn#####################',
  '................bbbbbbbbnnnnn######################',
  '................bbbbbbbbnnn########################',
  '................bbbbbbbbbn#########################',
  '..................bbbbbbb##########################',
  '.....................bbbb##########################',
  '.....................bbb###########################',
  '......................bbb##########################',
];

export const REGIONS = {
  wx: 'Wessex',
  me: 'Mercia',
  ea: 'East Anglia',
  nb: 'Northumbria',
  wa: 'Wales',
  sc: 'Skotland',
  ir: 'Irland',
  nm: 'Normandiet',
};

// letter: [id, name, region]
export const TERRITORIES = {
  W: ['winchester', 'Winchester', 'wx'],
  s: ['sussex', 'Sussex', 'wx'],
  k: ['kent', 'Kent', 'wx'],
  c: ['cornwall', 'Cornwall', 'wx'],
  M: ['tamworth', 'Tamworth', 'me'],
  h: ['hwicce', 'Hwicce', 'me'],
  L: ['lindsey', 'Lindsey', 'me'],
  N: ['norfolk', 'Norfolk', 'ea'],
  u: ['suffolk', 'Suffolk', 'ea'],
  e: ['essex', 'Essex', 'ea'],
  Y: ['york', 'York', 'nb'],
  B: ['bernicia', 'Bernicia', 'nb'],
  C: ['cumbria', 'Cumbria', 'nb'],
  g: ['gwynedd', 'Gwynedd', 'wa'],
  p: ['powys', 'Powys', 'wa'],
  d: ['deheubarth', 'Deheubarth', 'wa'],
  l: ['lothian', 'Lothian', 'sc'],
  S: ['strathclyde', 'Strathclyde', 'sc'],
  H: ['hoejlandet', 'Højlandet', 'sc'],
  O: ['orkney', 'Orkney', 'sc'],
  D: ['dublin', 'Dublin', 'ir'],
  m: ['munster', 'Munster', 'ir'],
  U: ['ulster', 'Ulster', 'ir'],
  n: ['rouen', 'Rouen', 'nm'],
  b: ['bretagne', 'Bretagne', 'nm'],
  f: ['flandern', 'Flandern', 'nm'],
};

export const TERRAIN = {
  H: 'mountains', // the Highlands
  g: 'mountains', // Snowdonia
  p: 'mountains',
  C: 'mountains', // the fells
  h: 'forest',
  M: 'forest',
  b: 'forest',
};

export const SEA = [
  ['s', 'n'], // Vilhelm's crossing to Pevensey
  ['W', 'n'],
  ['k', 'f'], // over the Strait of Dover
  ['c', 'b'], // Cornwall to Brittany
  ['D', 'g'], // Dublin to Anglesey
  ['m', 'd'], // over St George's Channel
  ['U', 'S'], // the North Channel
  ['U', 'C'], // past Man
];

// Crowded East Anglia: these seals keep their cell, with their names out to sea.
export const PLACES = { N: [34, 29, 'right'], u: [37, 29, 'right'] };

// Region missions: about 7–10 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['wx', 'me'], plusOne: true },
  { type: 'regions', regions: ['wx', 'nm'], plusOne: true },
  { type: 'regions', regions: ['sc', 'ir'], plusOne: true },
  { type: 'regions', regions: ['nb', 'sc'], plusOne: true },
  { type: 'regions', regions: ['ea', 'me', 'wa'] },
  { type: 'regions', regions: ['nb', 'ir', 'wa'] },
  { type: 'regions', regions: ['wx', 'ea', 'nm'] },
];

// Where the region names and the compass go. A name may sit on unexplored land.
export const REGION_PLACES = { wx: [42.55, 70.5], me: [55.05, 44.5], ea: [60.3, 49], nb: [51.8, 34], wa: [22.5, 63], sc: [42.65, 13], ir: [12.55, 31], nm: [31, 79] };
export const COMPASS = [13, 80, 1.4];
export const SHIP = 'longship';
export const LANDMARKS = [[81.4, 5.5, 'Norge'], [77.9, 58, 'Det Tyske Rige'], [70.2, 84, 'Frankernes Rige']];

// Rules that differ from the modern rules on this map. Later seats get extra start armies, measured
// with hard bots and missions (900 games each): 2 players 50/50 with +7 (55/45 with +6); 3 players
// 33/33/35 with +2; 4 players 26/24/24/26 with +1 (28/26/24/23 without).
// Easy computer players start with 35% fewer armies: on this small map, where every territory has
// many neighbours, a medium bot standing in for a player otherwise wins only 84%/58% against
// two/three of them; with 35% 98%/82%, about as on the other maps.
export const RULES = { laterSeatArmies: { 2: 7, 3: 2, 4: 1, 5: 0, 6: 0 }, noviceHandicap: 0.35 };

// The flavour of the age: the computer players' names and what the winner becomes.
export const RULERS = ['Vilhelm Erobreren', 'Harold Godwinson', 'Harald Hårderåde', 'Edgar Ætheling', 'Malcolm af Skotland', 'Svend Estridsen'];
export const TITLE = 'King of England';

export const ENGLAND_GRID = hexMap({
  id: 'england',
  name: 'Kampen om England',
  GRID,
  REGIONS,
  TERRITORIES,
  TERRAIN,
  PLACES,
  SEA,
  MISSIONS,
  REGION_PLACES,
  COMPASS,
  SHIP,
  LANDMARKS,
  RULES,
  RULERS,
  TITLE,
});
export const ENGLAND = ENGLAND_GRID.MAP;
