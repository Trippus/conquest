// Alexander den Store, 334–323 BC: from Macedonia over the Hellespont, through Asia Minor, the Levant
// and Egypt, into the Persian empire and on to Bactria and the Indus. The map shows Italy, Libya,
// the steppe and Arabia round it so you can see where it lies. 31 territories in 8 regions, drawn
// as a hex grid (see hex.js for what each part means). The coastlines are real
// (tools/make-grid.mjs); land outside the campaign is '#', drawn as unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '###########################################################################################################################',
  '###########################################################################################################################',
  '###########################################################################################################################',
  '################################################...#####################.....##############################################',
  '#####################################...######....####################.......##############################################',
  '####################################......##......###################........##############################################',
  '#####.#############################......####.....#################..........##############################################',
  '####..#.###########################......##########################.......#################################################',
  '####....###########################.......##.....#################........#################################################',
  '####.....########################.........#.......################......###################################################',
  '#####....########################...................###############......##################CCC#############################',
  '######....#######################....................##############......####CC###########CCCC#############################',
  '.######....#.###################.......................############.......CCCCCC#########CCCCCC############################',
  '.######.......##################........................###########.........CCCCC#######CCCCCCC############################',
  '..######.......#########PBBBBBBB.........................RRR########........CCCCCC#####CCCCCCCC############################',
  '...#####........###PPPPPPBBBBBBB.........g..g...........RRRRRR######........C.CCCCC###CCCCCCCCC############################',
  '....#######......###PPPPPPBBBBBBB.......gggggRR..........RRRRRR####RRR......C..CCCCC#CCCCCCCCCCC########mm#################',
  '......#####......##PPPPPPBBBBBBBBBB...gggggggRRR.......RRRRRRRR#RRRRRR..........CCCCCCCCCCCCCCCC####mmmmmm#################',
  '........######...###PPPPPP...BB....rggggggggggRRRRRRRRRRRRRRRRRRRRRRRRR......C..CCCCCCCCCCCCCCCC#mmmmmmmmmm################',
  '........####.#..###PPP.PP....BBB.rrrggggggggggRRRRRRRRRRRRRRRRRRRRRRRRRR....CCCCCCCCCCCCCCCCCCCCmmmmmmmmmmm################',
  '..........##..#...##PPP......BBrrrrrggggggggggRRRRRRRRRRRRRRRRRRRRRRRRR......CCCCCCCCCCCCCCCCCCCmmmmmmmmmmmm###############',
  '..........##.....##PPPP.....BrrrrrrrgggggggggtRRRRRRRRRRRRRRRRRRRRRRRR.......CCCCCCCCCCCCCCCCCCmmmmmmmmmmmmm###############',
  '...........##......#PAA.....rrrrrrrrrggggggggtttRRRRRRRRRRRRRRRRRRRRRR........CCCCCCCCCCCCCCCCCmmmmmmmmmmmmmm##############',
  '..........#........SAAAA......rrrrrrhggggggtttttRRRRRRRRRRRRRRRRRRRRR.........CCCCCCCCCCCCCCCCmmmmmmmmmmmmmm###############',
  '..........##........SAAAA....rrrrrrhhhggggttttttttRRRRRRRRRRRRRRRRRRRR.........CCCCCCCCCCCCCCCCmmmmmmmmmmmmmm##############',
  '....######..........SSAAAA....rrrhhhhhgggttttttttttRRRRRRRRRaaaaaRRRR.........CCCCCCCCCiiiiiiixxxxxxxxxxxxxxxX#############',
  '.....####............SSA.......rhhhhhhhgtttttttttttDDDaaaaaaaaaaaaakkk.........CCCCCCiiiiiiiiiixxxxxxxxxxxxxxXX############',
  '......###...........SSS..A.....hhhhhhhhtttttttttttDDDDaaaaaaaaaaaakkkkkk......CCCCCCiiiiiiiiiiixxxxxxxxxxxxxXXX############',
  '##.#....#.............S.........hhhhh.hhtttttt.ttDDDDDDaaaaaaaaaaakkkkkkkk...CCCCCCiiiiiiiiiiiiixxxxxxxxxxxxXXXXX##########',
  '#.................................hh...tttt...ttDDDDDDDaaaaaaaaaakkkkkkkkkkkkkCCCCiiiiiiiiiiiiiixxxxxxxxxxxXXXXX###########',
  '#..............................................tDDDDDDDaaaaaaaaaaakkkkkkkkkkkkkkCCiiiiiiiiiiiiiiixxxxxxxxxxXXXXXX##########',
  '#.............................................TDDDDDDDDaaaaaaaaaakkkkkkkkkkkkkkkiiiiiiiiiiiiiiiixxxxxxxxxxXXXXXXX##########',
  '##.......................cccc............TT....TDDDDDDDDaaaaaaaaakkkkkkkkkkkkkkkkiiiiiiiiiiiiiiiixxxxxxxxxXXXXXXXX#########',
  '#.......................................TT....TDDDDDDDDDaaaaaaaakkkkkkkkkkkkkkkkiiiiiiiiiiiiiiiiixxxxxxxxXXXXXXXXX#########',
  '#.............................................TTDDDDDDDDaaaaabbbbkkkkkkkkkkkkkkkpiiiiiiiiiiiiiiiiixxxxxxXXXXXXXXXXX########',
  '.............................................TTTDDDDDDDDbbbbbbbbbkkkkkkkkkkkkkppppiiiiiiiiiiiiiiiixxxxxXXXXXXXXXXXX########',
  '##............................................TTTDDDDDDDbbbbbbbbbbzzkkkkkkkkkkpppppiiiiiiiiiiiiiiiixxxxXXXXXXXXXXXHH#######',
  '##...........................................TTTTDDDDDDbbbbbbbbbbzzzzzzzzkkkpppppppiiiiiiiiiiiiiiiixxxXXXXXXXXXXXHHHHH#####',
  '#######..............y.......................TTTTTDDDnnnbbbbbbbbbzzzzzzzzzzzppppppppiiiiiiiiiiiiiiixxxXXXXXXXXXXHHHHHHHH###',
  '#########.........yyyyy.....................GGTTTnnnnnnnbbbbbbbbbzzzzzzzzzzpppppppppiiiiiiiiiiiiiiixxXXXXXXXXXHHHHHHHHHHHH#',
  '##########........yyyyyyyyy.................GGGGGnnnnnnnnbbbbbbbuuzzzzzzzzzpppppppppppiiiiiiiiiiiiiixXXXXXXXXXHHHHHHHHHHH##',
  '#########........yyyyyyyyyw................GGGGGnnnnnnnnbbbbbbbuuuzzzzzzzzppppppppppppiiiiiiiiiiiiiiXXXXXXXXHHHHHHHHHHH####',
  '############......yyyyyyyywwwwww....MMMM...GGGGGnnnnnnnnnbbbbbuuuuuuzzzzzzppppppppppppppiiiiiiiiiiiiLXXXXXXHHHHHHHHHHHH####',
  '##############...yyyyyyywwwwwwwwMMMMMMMMGGGGGGGGnnnnnnnnnbbbbuuuuuuuzzzzzppppppppppppppppiiiiiiiLLLLLXXXXHHHHHHHHHHHH######',
  '################.##yyyyywwwwwwwwMMMMMMMMMGGGGGGGnnnnnnnnnnbbuuuuuuuuuzzzzpppppppppppppppppppiiLLLLLLLLLXXHHHHHHHHHHHH######',
  '####################yyywwwwwwwwwMMMMMMMMGGGGGGGnnnnnnnnnn##uuuuuuuuuu...ppppppppppppppppppppLLLLLLLLLLLLHHHHHHHHHHH########',
  '#######################wwwwwwwwwwMMMMMMM.GGGGGGGnnnnnnnnn####uuuuuuu.....pppppppppppppppppppLLLLLLLLLLLLLLHHHHHHHHH########',
  '######################wwwwwwwwwwMMMMMMMM.GGGGGGGnnnnnnn######uuuuuuu....ppppppppppppppppppppLLLLLLLLLLLLLLLHHHHHH##########',
  '#######################wwwwwwwwwwMMMMMMMM.GGGGGGnnnnnnn#######uuuuuuu.....ppppppppppppppppppLLLLLLLLLLLLLLLLHHHHH##########',
  '#######################wwwwwwwwwwMMMMMMMM.G.GGGGnnnnn##########uuuuuu....ppppppppppppppppppLLLLLLLLLLLLLLLLLLHH############',
  '#######################wwwwwwwwwwMMMMMMMMM.G.GGGGnnnn###########uuuuuu....pppppppppppppppppLLLLLLLLLLLLLLLLLLLL############',
  '#######################wwwwwwwwwwMMMMMMMMM...GGGGnn##################.......ppp#pppppppppppLLLLLLLLLLLLLLLLLLLL############',
  '#######################wwwwwwwwwwwMMMMMMMMM...GGGGn####################......p####pppppppppLLLLLLLLLLLLLLLLLLLL############',
  '#######################wwwwwwwwwweeeeeeeee....GGG######################.......###...ppppppLLLLLLLLLLLLLLLLLLLL#############',
  '########################wwwwwwww##eeeeeeeee....G########################.............ppppppLLLLLLLLLLLLLLLLLLLL############',
  '########################wwwwww#####eeeeeeee....########################..#........#.##ppppLLLLLLLLLLLLLLLLLLLL#############',
  '####################################eeeeeeee....########################.#........#...##ppLLLLLLLLLLLLLLLLLLLL#############',
  '####################################eeeeeeee....########################.#.......##........LLL.......LLLLLLLL##############',
  '######################################eeeee##....#########################......###...................LLLLLLL##############',
  '######################################eee####....#########################.....####...................LLLLLLL##############',
  '##############################################.....########################.#########..................LLLLLL##############',
  '#############################################......####################################.................LLLL###############',
  '##############################################......####################################.................LL################',
  '##############################################.....#####################################..................#.###############',
  '###############################################.....#####################################..................################',
  '################################################....#####################################.................#####.###########',
  '################################################....#####################################..................################',
  '################################################....###################################....................####.###########',
  '#################################################....##################################......................#...##########',
  '################################################.....#################################..........................###########',
  '#################################################......###############################...........................##########',
  '################################################.......##############################...........................###########',
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
  c: ['kreta', 'Kreta', 'hl'],
  r: ['sardes', 'Sardes', 'la'],
  h: ['halikarnassos', 'Halikarnassos', 'la'],
  g: ['gordion', 'Gordion', 'la'],
  t: ['tarsos', 'Tarsos', 'la'],
  R: ['armenien', 'Armenien', 'la'],
  T: ['tyros', 'Tyros', 'le'],
  D: ['damaskus', 'Damaskus', 'le'],
  G: ['gaza', 'Gaza', 'le'],
  n: ['nabataea', 'Nabatæa', 'le'],
  M: ['memfis', 'Memfis', 'eg'],
  w: ['siwa', 'Siwa', 'eg'],
  e: ['theben', 'Theben', 'eg'],
  y: ['kyrenaika', 'Kyrenaika', 'eg'],
  b: ['babylon', 'Babylon', 'me'],
  a: ['arbela', 'Arbela', 'me'],
  u: ['uruk', 'Uruk', 'me'],
  z: ['susa', 'Susa', 'pe'],
  p: ['persepolis', 'Persepolis', 'pe'],
  k: ['ekbatana', 'Ekbatana', 'pe'],
  x: ['baktra', 'Baktra', 'ba'],
  m: ['marakanda', 'Marakanda', 'ba'],
  i: ['areia', 'Areia', 'ba'],
  C: ['chorasmien', 'Chorasmien', 'ba'],
  X: ['taxila', 'Taxila', 'in'],
  H: ['hydaspes', 'Hydaspes', 'in'],
  L: ['patala', 'Patala', 'in'],
};

export const TERRAIN = {
  k: 'mountains', // the Zagros
  X: 'mountains', // the Hindu Kush
  g: 'mountains', // the Anatolian highlands
  R: 'mountains', // the Armenian highlands
  P: 'forest',
  w: 'desert', // the oasis of Ammon in the Libyan desert
  e: 'desert',
  L: 'desert', // the Gedrosian desert
  i: 'desert',
  n: 'desert', // the Arabian desert, crossed by the Nabataeans' caravans
  C: 'desert', // the Karakum
};

export const SEA = [
  ['A', 'r'], // over the Aegean
  ['S', 'c'], // to Crete
  ['c', 'h'], // from Crete to Rhodes and Caria
  ['c', 'y'], // from Crete to Cyrene
  ['R', 'C'], // over the Caspian Sea
];

// Region missions: about 7–9 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['hl', 'la'] },
  { type: 'regions', regions: ['le', 'eg'], plusOne: true },
  { type: 'regions', regions: ['le', 'me', 'pe'] },
  { type: 'regions', regions: ['pe', 'ba', 'in'] },
  { type: 'regions', regions: ['eg', 'me', 'pe'] },
  { type: 'regions', regions: ['hl', 'le'], plusOne: true },
  { type: 'regions', regions: ['la', 'le'], plusOne: true },
];

// Where the region names and the compass go. A name may sit on unexplored land.
export const REGION_PLACES = { hl: [46.55, 45], la: [61.25, 48], le: [70.15, 56.5], eg: [55.1, 87], me: [101, 84], pe: [122, 77], ba: [166.15, 25], in: [200.55, 76.5] };
export const COMPASS = [175, 100, 1.4]; // in the Arabian Sea
export const SHIP = 'galley';
export const LANDMARKS = [[18.7, 27, 'Italien'], [29.5, 18, 'Illyrien'], [71.5, 6, 'Skythien'], [107, 20.5, 'Kaukasus'], [208, 48, 'Himalaya'], [112, 96, 'Arabien'], [25, 76, 'Libyen'], [65.3, 100, 'Nubien']];

// Rules that differ from the modern rules on this map, measured with npm run balance -- alexander:
// seats 53/47, 30/36/35 and 28/25/24/23 with 2, 3 and 4 players; easy computer players start with 35%
// fewer armies, so a medium bot standing in for a player wins 100%/88% against two/three of them, as on
// Italy, which Martin found right.
export const RULES = { laterSeatArmies: { 2: 7, 3: 1, 4: 0, 5: 0, 6: 0 }, noviceHandicap: 0.35 };

// The flavour of the age: the computer players' names and what the winner becomes.
export const RULERS = ['Dareios III', 'Memnon af Rhodos', 'Bessos', 'Spitamenes', 'Poros', 'Demosthenes'];
export const TITLE = 'King of Asia';

// The names in English, where they differ (see inLanguage in index.js).
export const EN = {
  name: 'Alexander the Great',
  REGIONS: { la: 'Asia Minor', le: 'The Levant', eg: 'Egypt', me: 'Mesopotamia', ba: 'Bactria', in: 'India' },
  TERRITORIES: {
    athen: 'Athens', kreta: 'Crete', halikarnassos: 'Halicarnassus', gordion: 'Gordium', tarsos: 'Tarsus', armenien: 'Armenia',
    tyros: 'Tyre', damaskus: 'Damascus', nabataea: 'Nabataea', memfis: 'Memphis', theben: 'Thebes', kyrenaika: 'Cyrenaica',
    ekbatana: 'Ecbatana', baktra: 'Bactra', chorasmien: 'Chorasmia',
  },
  LANDMARKS: { Italien: 'Italy', Illyrien: 'Illyria', Skythien: 'Scythia', Kaukasus: 'Caucasus', Arabien: 'Arabia', Libyen: 'Libya', Nubien: 'Nubia' },
  RULERS: ['Darius III', 'Memnon of Rhodes', 'Bessus', 'Spitamenes', 'Porus', 'Demosthenes'],
};

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
  NAMES: { en: EN },
});
export const ALEXANDER = ALEXANDER_GRID.MAP;
