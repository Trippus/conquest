// Alexander den Store, 334–323 BC: from Macedonia over the Hellespont, through Asia Minor, the Levant
// and Egypt, into the Persian empire and on to Bactria and the Indus. The map shows Italy, Libya,
// the steppe and Arabia round it so you can see where it lies. 26 territories in 8 regions, drawn
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
  '#####....########################...................###############......##################################################',
  '######....#######################....................##############......##################################################',
  '.######....#.###################.......................############.......#################################################',
  '.######.......##################........................###########.........###############################################',
  '..######.......#########PBBBBBBB.........................###########........###############################################',
  '...#####........###PPPPPPBBBBBBB.........g..g...........############........#.#############################################',
  '....#######......###PPPPPPBBBBBBB.......ggggggg..........#############......#..#########################mm#################',
  '......#####......##PPPPPPBBBBBBBBBB...ggggggggg#.......###############..........####################mmmmmm#################',
  '........######...###PPPPPP...BB....rggggggggggg########################......#..#################mmmmmmmmmm################',
  '........####.#..###PPP.PP....BBB.rrrggggggggggg#########################....##################mmmmmmmmmmmmm################',
  '..........##..#...##PPP......BBrrrrrgggggggggggt#######################......#################mmmmmmmmmmmmmm###############',
  '..........##.....##PPPP.....Brrrrrrrgggggggggttt######################.......################mmmmmmmmmmmmmmm###############',
  '...........##......#PAA.....rrrrrrrrrggggggggtttt#####################........k##############mmmmmmmmmmmmmmmm##############',
  '..........#........SAAAA......rrrrrrhggggggtttttt####################.........kk##########iiimmmmmmmmmmmmmmm###############',
  '..........##........SAAAA....rrrrrrhhhggggtttttttt####################.........kk#iiiiiiiiiiiimmmmmmmmmmmmmmm##############',
  '....######..........SSAAAA....rrrhhhhhgggtttttttttt#####aaaaaa#####kk.........kkiiiiiiiiiiiiiixxxxxxxxxxxxxxxX#############',
  '.....####............SSA.......rhhhhhhhgtttttttttttDD##aaaaaaaaaaaakkk.........kkiiiiiiiiiiiiiixxxxxxxxxxxxxxXX############',
  '......###...........SSS..A.....hhhhhhhhtttttttttttDDDDaaaaaaaaaaaakkkkkk......kkiiiiiiiiiiiiiiixxxxxxxxxxxxxXXX############',
  '##.#....#.............S.........hhhhh.hhtttttt.ttDDDDDDaaaaaaaaaaakkkkkkkk...kkkkiiiiiiiiiiiiiiixxxxxxxxxxxxXXXXX##########',
  '#.................................hh...tttt...ttDDDDDDDaaaaaaaaaakkkkkkkkkkkkkkkiiiiiiiiiiiiiiiixxxxxxxxxxxXXXXX###########',
  '#..............................................tDDDDDDDaaaaaaaaaaakkkkkkkkkkkkkkkiiiiiiiiiiiiiiiixxxxxxxxxxXXXXXX##########',
  '#.............................................TDDDDDDDDaaaaaaaaaakkkkkkkkkkkkkkkiiiiiiiiiiiiiiiixxxxxxxxxxXXXXXXX##########',
  '##.......................SSSS............TT....TDDDDDDDDaaaaaaaaakkkkkkkkkkkkkkkkiiiiiiiiiiiiiiiixxxxxxxxxXXXXXXXX#########',
  '#.......................................TT....TDDDDDDDDDaaaaaaaakkkkkkkkkkkkkkkkiiiiiiiiiiiiiiiiixxxxxxxxXXXXXXXXX#########',
  '#.............................................TTDDDDDDDDaaaaabbbbkkkkkkkkkkkkkkkpiiiiiiiiiiiiiiiiixxxxxxXXXXXXXXXXX########',
  '.............................................TTTDDDDDD##bbbbbbbbbkkkkkkkkkkkkkppppiiiiiiiiiiiiiiiixxxxxXXXXXXXXXXXX########',
  '##............................................TTTDDDD####bbbbbbbbbzzkkkkkkkkkkpppppiiiiiiiiiiiiiiiixxxxXXXXXXXXXXXHH#######',
  '##...........................................TTTTDD######bbbbbbbbzzzzzzzzkkkpppppppiiiiiiiiiiiiiiiixxxXXXXXXXXXXXHHHHH#####',
  '#######..............#.......................TTTTT#######bbbbbbbbzzzzzzzzzzzppppppppiiiiiiiiiiiiiiixxxXXXXXXXXXXHHHHHHHH###',
  '#########.........#####.....................GGTTT########bbbbbbbbzzzzzzzzzzpppppppppiiiiiiiiiiiiiiixxXXXXXXXXXHHHHHHHHHHHH#',
  '##########........########w.................GGGGG#########bbbbbbuuzzzzzzzzzpppppppppppiiiiiiiiiiiiiixXXXXXXXXXHHHHHHHHHHH##',
  '#########........########ww................GGGGG#########bbbbbbuuuzzzzzzzzppppppppppppiiiiiiiiiiiiiiXXXXXXXXHHHHHHHHHHH####',
  '############......#######wwwwwww....MMMM...GGGGGG#########bbbbuuuuuuzzzzzzpppppppppppppiiiiiiiiiiiiiLXXXXXXHHHHHHHHHHHH####',
  '##############...########wwwwwwwMMMMMMMMGGGGGGGGG#########bbbuuuuuuuzzzzzppppppppppppppiiiiiiiiiLLLLLXXXXHHHHHHHHHHHH######',
  '################.########wwwwwwwMMMMMMMMMGGGGGGGG###########uuuuuuuuuzzzzppppppppppppppppiiiiiLLLLLLLLLXXHHHHHHHHHHHH######',
  '########################wwwwwwwwMMMMMMMMMGGGGGGGG###########uuuuuuuuu...pppppppppppppppppiLLLLLLLLLLLLLLHHHHHHHHHHH########',
  '########################wwwwwwwwwMMMMMMM.MGGGGGGGG###########uuuuuuu.....ppppppppppppppppLLLLLLLLLLLLLLLLLHHHHHHHHH########',
  '#######################wwwwwwwwwMMMMMMMM.MGGGGGGG############uuuuuuu....ppppppppppppppppLLLLLLLLLLLLLLLLLLLHHHHHH##########',
  '########################wwwwwwwwwMMMMMMMM.GGGGGGG#############uuuuuuu.....ppppppppppppppLLLLLLLLLLLLLLLLLLLLHHHHH##########',
  '########################wwwwwwwwwMMMMMMMM.G.GGGG##############uuuuuuu....pppppppppppppppLLLLLLLLLLLLLLLLLLLLLHH############',
  '#########################wwwwwwwwMMMMMMMee.e.eGG###############uuuuuuu....ppppppppppppppLLLLLLLLLLLLLLLLLLLLLLL############',
  '#########################wwwwwwwwMMMMeeeee...eee#####################.......pppppppppppLLLLLLLLLLLLLLLLLLLLLLLL############',
  '##########################wwwwwwwwMeeeeeeee...ee#######################......ppppppppp#LLLLLLLLLLLLLLLLLLLLLLLL############',
  '##########################wwwwwwweeeeeeeee....ee#######################.......ppp...###LLLLLLLLLLLLLLLLLLLLLLL#############',
  '###########################wwwww##eeeeeeeee....e########################.............####LLLLLLLLLLLLLLLLLLLLLL############',
  '############################ww#####eeeeeeee....########################..#........#.#####LLLLLLLLLLLLLLLLLLLLL#############',
  '####################################eeeeeeee....########################.#........#...####LLLLLLLLLLLLLLLLLLLL#############',
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
];

// Region missions: about 7–9 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['hl', 'la'] },
  { type: 'regions', regions: ['le', 'eg'], plusOne: true },
  { type: 'regions', regions: ['me', 'pe'], plusOne: true },
  { type: 'regions', regions: ['pe', 'ba', 'in'] },
  { type: 'regions', regions: ['eg', 'me', 'pe'] },
  { type: 'regions', regions: ['hl', 'le'], plusOne: true },
  { type: 'regions', regions: ['la', 'le'], plusOne: true },
];

// Where the region names and the compass go. A name may sit on unexplored land.
export const REGION_PLACES = { hl: [46.55, 45], la: [61.25, 48], le: [70.15, 56.5], eg: [55.1, 87], me: [96.35, 73.5], pe: [128, 78], ba: [166.15, 25], in: [200.55, 76.5] };
export const COMPASS = [175, 100, 1.4]; // in the Arabian Sea
export const SHIP = 'galley';
export const LANDMARKS = [[18.7, 27, 'Italien'], [29.5, 18, 'Illyrien'], [71.5, 6, 'Skythien'], [107, 20.5, 'Kaukasus'], [98, 32, 'Armenien'], [155.5, 23.5, 'Chorasmien'], [208, 48, 'Himalaya'], [108.8, 87, 'Arabien'], [25, 76, 'Libyen'], [35.8, 61, 'Kyrenaika'], [65.3, 100, 'Nubien']];

// Rules that differ from the modern rules on this map, measured with npm run balance -- alexander:
// seats 52/48, 34/33/33 and 25/28/21/27 with 2, 3 and 4 players; easy computer players start with 40%
// fewer armies, so a medium bot standing in for a player wins 98%/88% against two/three of them, as on
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
