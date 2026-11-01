// Alexander den Store, 334–323 BC: from Macedonia over the Hellespont, through Asia Minor, the Levant
// and Egypt, into the Persian empire and on to Bactria and the Indus. 26 territories in 8 regions,
// drawn as a hex grid (see hex.js for what each part means). The coastlines are real
// (tools/make-grid.mjs); land outside the campaign is '#', drawn as unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '#####################.......###...##################.....#.##############################################',
  '###################........##......################.......###############################################',
  '###################..................###############.......##############################################',
  '###################...................##############.......##############################################',
  '##################......................#############.......#############################################',
  '#################........................############.......#############################################',
  '#################.........................############........###########################################',
  '.###PPPPPPPBBBBBB.........................############.......############################################',
  '...PPPPPPPPBBBBBBB........ggggg............############.......#..########################################',
  '..PPPPPPPPPBBBBBBB......gggggggg.........##############..........######################mmmm##############',
  '...PPPPPPPPPBBBBBB.Brrggggggggggg###.##.################..........##################mmmmmmmm#############',
  '..PPPPPPPP.B...B...rrggggggggggg########################......##################mmmmmmmmmmmm#############',
  '#..PPPPP.......BBrrrrrggggggggggg########################.....##################mmmmmmmmmmmmm############',
  '...PPPPP......Brrrrrrrgggggggggtt#######################.......################mmmmmmmmmmmmmm############',
  '....PPPPA.......rrrrrrgggggggggttt######################.......################mmmmmmmmmmmmmmm###########',
  '.....AAAA.....rrrrrrrrgggggggtttttt####################.........###########iiimmmmmmmmmmmmmmmm###########',
  '.....SAAAAA.....rrrrrrhggggggttttttt###################.........kiiiiiiiiiiiiiiimmmmmmmmmmmmmmm##########',
  '......S.AA.....rrrrhhhhggggttttttttt######aaa########kk.........kiiiiiiiiiiiiiiixxxxmmmmmmmmmmm##########',
  '......SSA.A.A...rrhhhhhhhgttttttttttt####aaaaaaaaaa##kkk........kiiiiiiiiiiiiiiiixxxxxxxxxxxxxxXX########',
  '......SS........hhhhhhhhhtttttttttttDDDDaaaaaaaaaaaakkkkk.......kiiiiiiiiiiiiiiixxxxxxxxxxxxxxXXX########',
  '.......SS....A....hhhhhhhttttttttttDDDDDaaaaaaaaaaaakkkkkk.......iiiiiiiiiiiiiiiixxxxxxxxxxxxxXXXX#######',
  '.......SS..........hhh..htttt...ttDDDDDDaaaaaaaaaaakkkkkkkkkkkkkkiiiiiiiiiiiiiiiixxxxxxxxxxxxXXXXX#######',
  '..........................tt....ttDDDDDDDaaaaaaaaaakkkkkkkkkkkkkkiiiiiiiiiiiiiiiiixxxxxxxxxxxXXXXXX######',
  '...............................tDDDDDDDDDaaaaaaaaakkkkkkkkkkkkkkkiiiiiiiiiiiiiiiiixxxxxxxxxxXXXXXXX######',
  '..........S.S...............T...TDDDDDDDDaaaaaaaaakkkkkkkkkkkkkkkiiiiiiiiiiiiiiiiixxxxxxxxxxXXXXXXX######',
  '............S............TTT....TDDDDDDDDaaaaaaaaakkkkkkkkkkkkkkkiiiiiiiiiiiiiiiiixxxxxxxxXXXXXXXXX######',
  '................................TTDDDDDDDDaaaaaaaakkkkkkkkkkkkkkkpiiiiiiiiiiiiiiiiixxxxxxxXXXXXXXXXX#####',
  '...............................TTTDDDDDDD#bbbbbbbbkkkkkkkkkkkkkkp###iiiiiiiiiiiiiiixxxxxxXXXXXXXXXXX#####',
  '...............................TTTTDDDDD###bbbbbbbbkkkkkkkkkkkkppp#####iiiiiiiiiiiixxxxxxXXXXXXXXXXXX####',
  '..............................TTTTDDD#####bbbbbbbbbzzzzzzzzzzppppp#######iiiiiiiiiixxxxxXXXXXXXXXXXHHH###',
  '...............................TTTTD#######bbbbbbbbzzzzzzzzzzpppppp########iiiiiiiiixxxxXXXXXXXXXXHHHHHHH',
  '....#####.....................TTTTT########bbbbbbbbzzzzzzzzzpppppp###########iiiiiiixxxXXXXXXXXXXHHHHHHHH',
  '....######....................GGGTT########bbbbbbbuuzzzzzzzzppppppp#############iiiiixxXXXXXXXXXHHHHHHHHH',
  '...########w.................GGGGG#########bbbbbbuuuzzzzzzzpppppppp###############iixxXXXXXXXXHHHHHHHHHHH',
  '....#######wwwww......MMM....GGGGGG########bbbbbuuuuuzzzzzzppppppppp#################XXXXXXXXHHHHHHHHHHHH',
  '...#######wwwwwwwMM.MMMMMMGGGGGGGG#########bbbbuuuuuuzzzzzppppppppp##################XXXXXXXHHHHHHHHHHHH#',
  '#..#######wwwwwwwwMMMMMMMMMGGGGGGGG##########buuuuuuuuzzzzpppppppppp#################LXXXXXHHHHHHHHHHHH##',
  '##########wwwwwwwwMMMMMMMMGGGGGGGGG##########uuuuuuuuuz.zppppppppppp################LLLLLHHHHHHHHHHHH####',
  '##########wwwwwwwwMMMMMMMMMGGGGGGGG###########uuuuuuuu....pppppppppp################LLLLLLLHHHHHHHHHH####',
  '#########wwwwwwwwwMMMMMMMMMGGGGGGGG###########uuuuuuu.....pppppppppp###############LLLLLLLLLHHHHHHH######',
  '#########wwwwwwwwwwMMMMMMM.MGGGGGGG############uuuuuuu.....pppppppppp##############LLLLLLLLLLHHHHHH######',
  '#########wwwwwwwwwMMMMMMMM.MGGGGGG#############uuuuuuu.....pppppppppp#############LLLLLLLLLLLLHHH########',
  '##########wwwwwwwwwMMMMMMMM.eeGGGG##############uuuuuuu.....ppppppppp#############LLLLLLLLLLLLLLH########',
  '##########wwwwwwwwwMMMMMeee.e..eG######################......pppppppp############LLLLLLLLLLLLLLL#########',
  '###########wwwwwwwwMMMeeeeee....ee######################......pppppppp##########LLLLLLLLLLLLLLLLL########',
  '############wwwwwwweeeeeeeee....ee######################.......ppppp.##########LLLLLLLLLLLLLLLLL#########',
  '#############wwwww#eeeeeeeeee....e#######################.............#########LLLLLLLLLLLLLLLLL#########',
  '#############wwww###eeeeeeeee....########################.............#########LLLLLLLLLLLLLLLLL#########',
  '##############ww#####eeeeeeeee....########################.#........#..#########LLLLLLLLLLLLLLLL#########',
  '######################eeeeeee.....##########################.......#.......####LLLLLL..LLLLLLLL##########',
  '#######################eeeeee#.....#########################......###..................LLLLLLLL##########',
  '#######################eeee###....#########################......####...................LLLLLL###########',
  '#########################e#####.....#########################....#####...................LLLLLL##########',
  '###############################.....###################################..................LLLLL###########',
  '###############################......####################################..................LLL###########',
  '###############################......####################################..................LL############',
];

export const REGIONS = {
  hl: 'Hellas',
  la: 'Lilleasien',
  le: 'Levanten',
  eg: 'Egypten',
  me: 'Mesopotamien',
  pe: 'Persis',
  ba: 'Baktrien',
  in: 'Indien',
};

// letter: [id, name, region]
export const TERRITORIES = {
  P: ['pella', 'Pella', 'hl'],
  A: ['athen', 'Athen', 'hl'],
  S: ['sparta', 'Sparta', 'hl'],
  B: ['byzantion', 'Byzantion', 'hl'],
  r: ['sardes', 'Sardes', 'la'],
  h: ['halikarnassos', 'Halikarnassos', 'la'],
  g: ['gordion', 'Gordion', 'la'],
  t: ['tarsos', 'Tarsos', 'la'],
  T: ['tyros', 'Tyros', 'le'],
  D: ['damaskus', 'Damaskus', 'le'],
  G: ['gaza', 'Gaza', 'le'],
  M: ['memfis', 'Memfis', 'eg'],
  w: ['siwa', 'Siwa', 'eg'],
  e: ['theben', 'Theben', 'eg'],
  b: ['babylon', 'Babylon', 'me'],
  a: ['arbela', 'Arbela', 'me'],
  u: ['uruk', 'Uruk', 'me'],
  z: ['susa', 'Susa', 'pe'],
  p: ['persepolis', 'Persepolis', 'pe'],
  k: ['ekbatana', 'Ekbatana', 'pe'],
  x: ['baktra', 'Baktra', 'ba'],
  m: ['marakanda', 'Marakanda', 'ba'],
  i: ['areia', 'Areia', 'ba'],
  X: ['taxila', 'Taxila', 'in'],
  H: ['hydaspes', 'Hydaspes', 'in'],
  L: ['patala', 'Patala', 'in'],
};

export const TERRAIN = {
  k: 'mountains', // the Zagros
  X: 'mountains', // the Hindu Kush
  g: 'mountains', // the Anatolian highlands
  P: 'forest',
  w: 'desert', // the oasis of Ammon in the Libyan desert
  e: 'desert',
  L: 'desert', // the Gedrosian desert
  i: 'desert',
};

export const SEA = [
  ['A', 'r'], // over the Aegean
  ['S', 'h'], // from Crete to Rhodes
  ['L', 'p'], // Nearchus' voyage from the Indus to the Persian Gulf
];

// Region missions: about 7–9 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['hl', 'la'] },
  { type: 'regions', regions: ['le', 'eg'], plusOne: true },
  { type: 'regions', regions: ['me', 'pe'], plusOne: true },
  { type: 'regions', regions: ['ba', 'in'], plusOne: true },
  { type: 'regions', regions: ['eg', 'me', 'pe'] },
  { type: 'regions', regions: ['hl', 'le'], plusOne: true },
  { type: 'regions', regions: ['pe', 'ba'], plusOne: true },
];

// Where the region names and the compass go. A name may sit on unexplored land.
export const REGION_PLACES = { hl: [17.05, 8.5], la: [35.25, 36], le: [45.15, 43], eg: [31.6, 76.5], me: [71.35, 63], pe: [100.05, 67.5], ba: [137.65, 14.5], in: [175.55, 64.5] };
export const COMPASS = [140, 80, 1.4]; // in the Arabian Sea
export const SHIP = 'galley';
export const LANDMARKS = [[10, 3, 'Illyrien'], [130, 5, 'Skythien'], [72, 17, 'Armenien'], [85, 75, 'Arabien'], [8, 70, 'Libyen']];

// Rules that differ from the modern rules on this map, measured with npm run balance -- alexander:
// seats 48/52, 32/35/32 and 25/27/24/24 with 2, 3 and 4 players; easy computer players start with 40%
// fewer armies, so a medium bot standing in for a player wins 99%/89% against two/three of them, as on
// Italy, which Martin found right (85% with 30%).
export const RULES = { laterSeatArmies: { 2: 7, 3: 2, 4: 1, 5: 0, 6: 0 }, noviceHandicap: 0.4 };

// The flavour of the age: the computer players' names and what the winner becomes.
export const RULERS = ['Dareios III', 'Memnon af Rhodos', 'Bessos', 'Spitamenes', 'Poros', 'Demosthenes'];
export const TITLE = 'King of Asia';

export const ALEXANDER_GRID = hexMap({
  id: 'alexander',
  name: 'Alexander den Store',
  GRID,
  REGIONS,
  TERRITORIES,
  TERRAIN,
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
export const ALEXANDER = ALEXANDER_GRID.MAP;
