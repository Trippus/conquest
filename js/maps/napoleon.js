// Napoleonskrigene, 1805–1812: from Austerlitz to Moscow Napoleon makes himself master of Europe,
// against Britain at sea, Austria, Prussia and Russia on land. The map shows North Africa, the
// Ottoman Empire and the steppe round it. 33 territories in 9 regions, drawn as a hex grid (see
// hex.js for what each part means). The coastlines are real (tools/make-grid.mjs); land outside the
// campaign is '#', drawn as unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '............................................nnnnhhhhhhhhhhhhhhhhh.....SSSSSSSSSS################...#################',
  '........................................n.nnnnnhhhhhhhhhhhhhhhhh.....SSSSSSSSSSS####################################',
  '.........................................nnnnnnnhhhhhhhhhhhhhh......SSSSSSSSSSSSS###################################',
  '........................................nnnnnnnhhhhhhhhhhhhh......SSSSSSSSSSSSSSS###################################',
  '......................................nnnnnnnnnnhhhhhhhhhhhh......SSSSSSSSSSSSSSS###################################',
  '....................................nnnnnnnnnnnhhhhhhhhhhhh......SSSSSSSSSSSSSSSS###################################',
  '...................................nnnnnnnnnnnnnhhhhhhhhhhh.......SSSSSSSSSSSSSSSS##################################',
  '.................................nnnnnnnnnnnnnnnhhhhhhhhhh........SSSSSSSSSSSSSSSS##################################',
  '..................................nnnnnnnnnnnnnnnhhhhhhhhh.........SSSSSSSSSSSSSSSSS################################',
  '..................................nnnnnnnnnnnnnnnhhhhhhhh.........SSSSSSSSSSSSSSSSSSS###############################',
  '..................................nnnnnnnnnnnnnnnnhhhhhhhh.........SSSSSSSSSSSSSSSSSSSS#############################',
  '.................................nnnnnnnnnnnnnnnnnhhhhhhhh........SSSSSSSSSSSSSSSSSSSSSSS###########################',
  '..................................nnnnnnnnnnnnnnnnhhhhhhhhh.......SSSSSSSSSSSSSSSSSSSSSSSSS#########################',
  '....................#.............nnnnnnnnnnnnnnnhhhhhhhhhhh.......SSSSSSSS.....SSSSSSSSSSSS########################',
  '...................................nnnnnnnnnnnnnnnhhhhhhhhhhh.......S.SSS..........SSSSSSSSSSS######################',
  '...................................nnnnnnnnnnnnnnhhhhhhhhhhhh...................SSSSSSSSSSSSSS######################',
  '..................................nnnnnnnnnnnnnnnhhhhhhhhhhhh............SSSS...SSSSSSSSSSSSSSS#####################',
  '...................................nnnnnnnnn.nnhhhhhhhhhhhhh..........ggSSSSSSSSSSSSSSSSSSSSSSS#####################',
  '.................#.................nnnnnnnn...nhhhhhhhhhhhh.........g..ggggggSSSSSSSSSSSSSSSSSSmmm##################',
  '..................................nnnnnnnn....hhhhhhhhhhh.............gggggggSSSSSSSSSSSSSSSSSmmmm##################',
  '...........e..eeee..................nnnnn.....hhhhhhhhhhh..........ggg.gggggggSSSSSSSSSSSSSSSmmmmmmm################',
  '.........ee..eee....................nnn.......hhhhhhhhhhh..........g....ggggggSSSSSSSSSSSSSSmmmmmmmmm###############',
  '.............eee...............................hhhhhhhhhh....#..........gggggggSSSSSSSSSSSSSmmmmmmmmmm##############',
  '..........e.eeeeeeee.......................c...hhhhhhhhh...hh......gg...gggggggSSSSSSSSSSSSmmmmmmmmmmmm#############',
  '...........e.eeeeeee.......................cc...hhhhhhhhh...h.....gggg..ggggggggSSSSSSSSsssmmmmmmmmmmmmm############',
  '........e...eeeeeee.....................cccc....hhhhhhhh..........gggggggggggggggSSssssssssmmmmmmmmmmmmm############',
  '............eeeeeee.....................cccc.....hhhhhhhh.........ggggggggggggggggssssssssssmmmmmmmmmmmmm###########',
  '...........e.eeeee......................ccccc....hhhhhh..........kgggggggggggggggsssssssssssmmmmmmmmmmmm############',
  '.............eeeee......................cccc.....hhhh.............kkgggggggggggggsssssssssssmmmmmmmmmmmmm###########',
  '...........ee.eeeee.....................ccccc.cc.hhh.............kkkgggggggggggggsssssssssssmmmmmmmmmmmm############',
  '.............eeeeeee....................ccc...ccc.hh..............kkkggggggggggggssssssssssssmmmmmmmmmmmm###########',
  '..............eeeeee.....................cccc.cc..................kkkggggggggggggssssssssssssmmmmmmmmmmmm###########',
  '.......uuuuu..eeeeeee....................cc..c.c..................kkkkgggggggggggssssssssssssmmmmmmmmmmmm###########',
  '......uuuuuu.e..eeeee....................cc..cc...........kk...kkkkkkkggggggggggsssssssssssssmmmmmmmmmmmm###########',
  '.......uuuuuu....eeeeOO..................KKK......E......kkkk..kkkkkkkgggggggggggsssssssssssssmmmmmmmmmmm###########',
  '...uuuuuuuuu..#..eOOOOO..................KKKK..EEE....kkkkkkkkkkkkkkkkggggggggggsssssssssssssmmmmmmmmmmm############',
  '....uuuuuuu.......OOOOOO.................KKKKEEEEEEEEkkkkkkkkkkkkkkkkkkggggggggggsssssssssssssmmmmmmmmmm############',
  '....uuuuuuu......OOOOOOO..............K.KKKKKEEEEEEEEkkkkkkkkkkkkkkkkkggggggggggssssssssssssssmmmmmmmmm#############',
  '....uuuuuuuu......OOOOOO...........AAAKKKKKKKKEEEEEEEEkkkkkkkkkkkkkkkkkggggggggggssssssssssssssmmmmmmm##############',
  '.....uuuuuu....OOOOOOOOO..........AAAAKKKKKKKKEEEEEEEEkkkkkkWWWWWWWWWWWWggggggggssssssssssssssmmmmmmm###############',
  '.....uuuuuuu....OOOOOOOOOOO......AAAAAKKKKKKKKdEEEEEEEEEkkkkWWWWWWWWWWWWWgggggggvvvssssssssssssmmmmmm###############',
  '....uuuuuuu....OOOOOOOOOOOO.....AAAAAAKKKKKKKddEEEEEEEEEEkkWWWWWWWWWWWWWWgggggvvvvvvvvvssssssssmmmmm################',
  '...uuuuuuuu....OOOOOOOOOOOO......AAAAAAKKKKKKddddEEEEEEEEEEWWWWWWWWWWWWWWWWggvvvvvvvvvvvvvvsssssmmm#################',
  '...uuuuu.....OOOOOOOOOOOOO.....AAAAAAAAKKKKKddddEEEEEEEEEEWWWWWWWWWWWWWWWWWvvvvvvvvvvvvvvvvvvvv#####################',
  '....uuu........OOOOOOOOOOO......AAAAAAAKKKKKKddddEEEEEEEEEEWWWWWWWWWWWWWWWWvvvvvvvvvvvvvvvvvvvv#####################',
  '..................OOOOOOO......AAAAAAAKKKKKKKddddEdEEEEEEEEWWWWWWWWWWWWWWWWvvvvvvvvvvvvvvvvvvv######################',
  '...............OOOOOOOOOOO...AAAAAAAAAKKKKKKKKdddddddEEEEEEWWWWWWWWWWWWWWWWvvvvvvvvvvvvvvvvvvv######################',
  '..............OOOOOOOOOO...PPAAAAAAAAKKKKKKKKddddddddGGGGGGWWWWWWWWWWWWWWWvvvvvvvvvvvvvvvvvvv#######################',
  '..............OOO..........PPPAAAAAAAAKKKKKKKKdddddddGGGGGGGWWWWWWWWWWWWWWvvvvvvvvvvvvvvvvvvv#######################',
  '.............O............PPPPAAAAAAAKKKKKKKKKdddddGGGGGGGGGWWWWWWWWWWWWWWvvvvvvvvvvvvvvvvvv########################',
  '..........................PPPPPAAAAAAAKKKKKKKKKdddGGGGGGGGGGGWWWWWWWWWWWWWvvvvvvvvvvvvvvvvvvv#######################',
  '........................PPPPPPPAAAAAAKKKKKKKKUUUGGGGGGGGGGGGVHHHWWWWWWWWHHvvvvvvvvvvvvvvvvvv########################',
  '....................BB..PPPPPPPPAAAAAAKKKKKUUUUUUGGGGGGGGGVVVHHHHHHHHHHHHHHvvvvvvvvvvvvvvvvv########################',
  '....................BBPPPPPPPPPPPAAAAKKKKUUUUUUUUGGGGGGGVVVVHHHHHHHHHHHHHHHvvvvvvvvvvvvvvvv#########################',
  '.....................BBPPPPPPPPPPPPAAAKKUUUUUUUUUUGGGGVVVVVVHHHHHHHHHHHHHHHHvvvvvvvvvvvvvv##########################',
  '..............BBBBBBBBBPPPPPPPPPPPPPAUUUUUUUUUUUUUGGVVVVVVVVHHHHHHHHHHHHHHHHHvvvvvvvvvvv############################',
  '...............BBBBBBBBBPPPPPPPPPPPPPLUUUUUUUUUUUUUVVVVVVVVVHHHHHHHHHHHHHHHHHH#vvvvvvv##############################',
  '..............BBBBBBBBBBPPPPPPPPPPPLLLUUUUUUUUUUUUUVVVVVVVVHHHHHHHHHHHHHHHHHH#####v#################################',
  '.................BBBBBBBPPPPPPPPPPLLLLLUUUUUUUUUUUUVVVVVVVVHHHHHHHHHHHHHHHHHH#######################################',
  '..................BBBBBBPPPPPPPLLLLLLLIIIUUUUUUUUUVVVVVVVVHHHHHHHHHHHHHHHHHH########################################',
  '....................BBBBBPPPPPLLLLLLLLIIIIIUUUUUUUUVVVVVVVVHHHHHHHHHHHHHHHHHH########################.##############',
  '...................BBBBBBPPPLLLLLLLLLLIIIIIIUUUUUIVVVVVVVVHHHHHHHHHHHHHHHHHH######################...###############',
  '....................BBBBBBBLLLLLLLLLLLIIIIIIIIIIIIIVVVVVVHHHHHHHHHHHHHHHHHHH###########.#######....#################',
  '.....................BBBBBBLLLLLLLLLLLIIIIIIIIIIIIVVVVVHHHHHHHHHHHHHHHHHHHH#########...######......#################',
  '......................BBBBBLLLLLLLLLLLIIIIIIIIIIIIIVVVVVHHHHHHHHHHHHHHHHHHH#########.......##.......################',
  '.....................BBBBBBLLLLLLLLLLIIIIIIIIIIIIIVVVVVHHHHHHHHHHHHHHHHHHH#########.......###......#################',
  '......................BBBBBBLLLLLLLLLLIIIIIIIIIII..VVVVVHHHHHHHHHHHHHHHHH##########......#####.....#################',
  '.....................BBBBBBBLLLLLLLLLIIIIIIIIIII..VVVVVVHHHHHHHHHHHHHHH###########.......###########################',
  '.....................BBBBBBBLLLLLLLLLLIIIIIIIIIII..VVVVVHHHHHHHHH###HH#############........###....##################',
  '.....................BBBBBBBLLLLLMMMMMIIIIIIIIII.....VVVHHHHHHHH#################.........##......##################',
  '.....................BBBBBBBBMMMMMMMMMMII.IIIIII......VVHHHHH####################...................################',
  '.....................BBBBBBBMMMMMMMMMMMI...IIIII......VV########################.....................###############',
  '.....................BBBBBBBMMMMMMMMMMMM....IIIIRR.....##########################.....................##############',
  '.......DDDDDD.......BBBBBBBbMMM.MMMMM.......RRRRRR.....#########################......................##############',
  '......lDDDDDDDDDDDDBBBBBBbbbbMM....MM........RRRRRR.......######################........................############',
  '.....llDDDDDDDDDDDDBBBBbbbbbbM..............RRRRRRR......######################..........................###########',
  '......llDDDDDDDDDDDDBbbbbbbbbb............M...RRRRRR........###################...........................##########',
  '......llDDDDDDDDDDDDbbbbbbbbbb...........M...RRRRRRR........##################............................##########',
  '......llllDDDDDDDDDDbbbbbbbbbb...........MM....RRRRRR.........#################............................#########',
  '......llllDDDDDDDDDDbbbbbbbbbb...........M.....RRRRRNNNN......#################..........####.............##########',
  '......lllllDDDDDDDDDDbbbbbbbb............M.......RRNNNNN.......#################........########...........#########',
  '......lllllDDDDDDDDDDbbbbbbb.....................RNNNNNN......###################.....###########........###########',
  '.......lllllDDDDDDDDDDbbbb................#.........NNNNNN.....##################.#################..##.############',
  '......lllllDDDDDDDDDDbbbb...............###.........NNNNNNN...#########.#..###....##################################',
  '......llllllDDDDDDDDDDbbb...............###...........NNNNNN..#########...#....#.###################################',
  '......lllllDDDDDDDDDDDbb................###..........NNNN..N..######..#.....########################################',
  '......lllllDDDDDDDDDDDDb.................##............NN......######.......########################################',
  '.....llllllDDDDDDDDDDDD.....##..........###............N.......######......#########################################',
  '.....lllllllDDDDDDDDDDD..................##.............NN......######.......#######################################',
  '.....lllllllDDDDDDDDDDD...#.............#..............NN.......#####......#.#######################################',
  '.....lllllllCCCDDDDDDDDD................................p........####.#......#######################################',
  '.....lllllCCCCCCCDDDDDD................................p.........######......#######################################',
  '......llllCCCCCCCCCDDDD...............................pp........#..#.###...#########################################',
  '......lllCCCCCCCCCCCCD..........................pppppp............###.#.#....#######################################',
  '......lllCCCCCCCCCCCCC...........................ppppp............####........######################################',
  '......lCCCCCCCCCCCCC..............................ppp.............####.......#######################################',
  '......lCC.CCCCCCCCCC......................##.......ppp.............##...#.#...######################################',
  '...........CCCCCCCC............##..##########.......p...............#........#.#####.###############################',
  '...........CCCC.............#################.......................##............###..#####....####################',
  '...........CC...........####################......................................##....###....#####################',
  '........................#####################..................................................#####################',
  '............#.........#######################..................................................#####################',
  '............##.......#########################.........................#...................#...#####################',
  '...........#######..#########################...........................####............###....#####################',
  '...........##################################...........................................###....#####################',
  '...........#################################...................................................#####################',
  '...........#################################...................................................#####################',
  '..........#################################...................................................######################',
];

// The lands of the age, so no region shares its name with one of its territories.
export const REGIONS = {
  fr: 'Frankrig',
  ib: 'Iberien',
  it: 'Italien',
  rh: 'Rhinforbundet',
  pr: 'Preussen',
  os: 'Østrig',
  ru: 'Rusland',
  br: 'Britannien',
  no: 'Norden',
};

// letter: [id, name, region]. Capitals and the great cities of the wars.
export const TERRITORIES = {
  P: ['paris', 'Paris', 'fr'],
  A: ['amsterdam', 'Amsterdam', 'fr'],
  L: ['lyon', 'Lyon', 'fr'],
  B: ['bordeaux', 'Bordeaux', 'fr'],
  M: ['marseille', 'Marseille', 'fr'],
  D: ['madrid', 'Madrid', 'ib'],
  l: ['lissabon', 'Lissabon', 'ib'],
  C: ['cadiz', 'Cádiz', 'ib'],
  b: ['barcelona', 'Barcelona', 'ib'],
  I: ['milano', 'Milano', 'it'],
  R: ['rom', 'Rom', 'it'],
  N: ['napoli', 'Napoli', 'it'],
  p: ['palermo', 'Palermo', 'it'],
  K: ['kassel', 'Kassel', 'rh'],
  U: ['muenchen', 'München', 'rh'],
  d: ['dresden', 'Dresden', 'rh'],
  E: ['berlin', 'Berlin', 'pr'],
  k: ['koenigsberg', 'Königsberg', 'pr'],
  W: ['warszawa', 'Warszawa', 'pr'],
  V: ['wien', 'Wien', 'os'],
  G: ['prag', 'Prag', 'os'],
  H: ['buda', 'Buda', 'os'],
  S: ['petersborg', 'Sankt Petersborg', 'ru'],
  g: ['riga', 'Riga', 'ru'],
  s: ['smolensk', 'Smolensk', 'ru'],
  m: ['moskva', 'Moskva', 'ru'],
  v: ['kiev', 'Kiev', 'ru'],
  O: ['london', 'London', 'br'],
  e: ['edinburgh', 'Edinburgh', 'br'],
  u: ['dublin', 'Dublin', 'br'],
  c: ['koebenhavn', 'København', 'no'],
  n: ['christiania', 'Christiania', 'no'],
  h: ['stockholm', 'Stockholm', 'no'],
};

export const TERRAIN = {
  I: 'mountains', // the Alps
  U: 'mountains',
  b: 'mountains', // the Pyrenees
  n: 'mountains',
  e: 'mountains', // the Highlands
  S: 'spruce',
  g: 'spruce',
  h: 'spruce',
  s: 'forest',
  m: 'forest',
  K: 'oak',
  G: 'oak',
};

export const SEA = [
  ['O', 'A'], // over the North Sea
  ['O', 'l'], // Wellington's way to the Peninsula
  ['O', 'u'], // over the Irish Sea
  ['e', 'n'], // over the North Sea to Norway
  ['c', 'h'], // over the Øresund
  ['c', 'k'], // over the Baltic
];

// Region missions: about 8–9 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['fr', 'ib'] },
  { type: 'regions', regions: ['fr', 'it'] },
  { type: 'regions', regions: ['it', 'os'], plusOne: true },
  { type: 'regions', regions: ['rh', 'pr', 'os'] },
  { type: 'regions', regions: ['ru', 'pr'] },
  { type: 'regions', regions: ['br', 'fr'] },
  { type: 'regions', regions: ['no', 'ru'] },
];

// Where the region names and the compass go. A name may sit on unexplored land.
export const REGION_PLACES = { fr: [28, 100], ib: [48, 146], it: [82, 130], rh: [62, 52], pr: [99, 44], os: [115, 96], ru: [183, 65], br: [12, 73], no: [46, 22] };
export const COMPASS = [159, 112, 1.3];
export const SHIP = 'lineship'; // a ship of the line, two decks of guns, as at Trafalgar
export const LANDMARKS = [[156, 132, 'Det Osmanniske Rige'], [49, 157, 'Nordafrika'], [170, 89, 'Stepperne']];

// Rules that differ from the modern rules on this map, measured with npm run balance -- napoleon:
// seats 53/47, 37/31/32 and 24/24/27/26 with 2, 3 and 4 players; easy computer players start with 35%
// fewer armies, so a medium bot standing in for a player wins 100%/89% against two/three of them. Five
// regions of three give quick bonuses, so Napoleon aims at 85–90% against three, as Italy does.
export const RULES = { laterSeatArmies: { 2: 7, 3: 1, 4: 1, 5: 0, 6: 0 }, noviceHandicap: 0.35 };

// The flavour of the age: the computer players' names and what the winner becomes.
export const RULERS = ['Wellington', 'Kutusov', 'Ærkehertug Karl', 'Blücher', 'Nelson', 'Zar Alexander'];
export const TITLE = 'Emperor of Europe';

// The names in English, where they differ (see inLanguage in index.js).
export const EN = {
  name: 'The Napoleonic Wars',
  REGIONS: { fr: 'France', ib: 'Iberia', it: 'Italy', rh: 'Confederation of the Rhine', pr: 'Prussia', os: 'Austria', ru: 'Russia', br: 'Britain', no: 'Scandinavia' },
  TERRITORIES: {
    lissabon: 'Lisbon', milano: 'Milan', rom: 'Rome', napoli: 'Naples', muenchen: 'Munich', warszawa: 'Warsaw',
    wien: 'Vienna', prag: 'Prague', petersborg: 'Saint Petersburg', moskva: 'Moscow', koebenhavn: 'Copenhagen',
  },
  LANDMARKS: { 'Det Osmanniske Rige': 'The Ottoman Empire', Nordafrika: 'North Africa', Stepperne: 'The Steppe' },
  RULERS: ['Wellington', 'Kutuzov', 'Archduke Charles', 'Blücher', 'Nelson', 'Tsar Alexander'],
};

export const NAPOLEON_GRID = hexMap({
  id: 'napoleon',
  name: 'Napoleonskrigene',
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
export const NAPOLEON = NAPOLEON_GRID.MAP;
