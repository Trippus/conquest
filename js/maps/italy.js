// Roms samling af Italien, around 300–250 BC: Rome against the Samnites, the Greek cities of the
// south, the Gauls of the Po valley and Carthage over the sea. The map shows the whole Mediterranean
// so you can see where Italy lies; Ptolemaic Egypt, a great power then, is named but not played. 23 territories in 8 regions, drawn as a
// hex grid (see hex.js for what each part means). The coastlines are real (tools/make-grid.mjs);
// land outside the campaign is '#', drawn as unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '.######################################################################################',
  '.######################################################################################',
  '#######################################################################################',
  '#######################################################################################',
  '#######################################################################################',
  '#######################################################################################',
  '#######################################################################################',
  '#######################################################################################',
  '#######################################################################################',
  '#######################################################################################',
  '.##################################V##################################################.',
  '..########################MM######VVV################################################..',
  '..########################MMMM####VVVVV##############################################..',
  '..#######################MMMMMMMVVVVVVV############################################....',
  '..#######################MMMMMMMMVVVVV...##########################################....',
  '..######################GMMMMMMMnnVVV...##.#######################################.....',
  '..######################GGGGMMMMnnnnVV...#.########################################....',
  '..#####################GGGGGGMMnnnnnn.....######################################.......',
  '..#####################GGGGGGGGnnnnnn.......#####################################......',
  '.######################GGGG..GGnnnnnn.......####################################.......',
  '..#####################GGGG.....nnnnnn.......###################################.......',
  '.#####################GG........EEEEUUP.......#################################........',
  '.##############.######G.........EEEEEUUPP.......################################.......',
  '##############.....###..........EEEEUUUPP........#############################.........',
  '#############....................EEEUUUPP..........###########################.........',
  '#############....................EEUUUUPP...........##########################.........',
  '##############..............kk....EUUUbbbb...........########################..........',
  '#############..............kkk.....RRRbbbbS...........#######################..........',
  '##############..............kk.......RRbbbSS...........#######################.........',
  '############................k........RRRbSSSSSA.........######################.........',
  '###########...........................RRRCSSSSA.........#######################........',
  '##########..............................CCCSSAAA........########################.......',
  '########....................dd............CCCAAAAT......######################..#######',
  '#######...................dddd............CCCAAATTT....#############.....###......#####',
  '#######....................dddd.............CLLLLTTTT...############.............######',
  '######.....................ddd..............LLLLT..TT...########.##......##############',
  '#####..........#...........dddd...............LLL...T....#######..#.......#############',
  '####........##.............ddd................LL........########.........##############',
  '####........##.............ddd.................BBB........########.......#.############',
  '####.......................ddd.................BB.........########......##.############',
  '#####......................dd..................BBB..........#####.........#############',
  '#####...#......................................B...........######.#........############',
  '#####..........................................BB...........#########....##.###########',
  '###..........................................BB...........#...#.###.....#.#############',
  '###...................................yppppsssB..............#######........###########',
  '###..................................yypppsss...............#####..#......#.###########',
  '#......................................yppsss.................#####....#....###########',
  '.............................KK.........pssss................####............##########',
  '........................N...KKKK...........ss.................###...........#..########',
  '............######.NNNNNNNNNKKKKK..........s...................##............##.#####..',
  '........###########NNNNNNNNNKKKKK................................#...............####..',
  '......#############NNNNNNNNNKKKK.............................................#....#....',
  '......###############NNNNNNNNKzzz......................................................',
  '...##################NNNNNN#zzzzz......................................................',
  '..#####################NNN###zzzzz.................................#...................',
  '.############################zzzzz................................######...............',
  '##############################zzz#....................................##...............',
  '#################################......................................................',
  '#################################......................................................',
  '###############################........................................................',
  '################################.......................................................',
  '################################.......................................................',
  '##################################.....................................................',
  '##################################.....................................................',
  '#####################################..................................................',
  '#########################################...................####.......................',
  '###########################################................#######.....................',
  '#############################################............########......................',
  '#############################################............#############.................',
  '#############################################............#############.................',
  '##############################################...........##################..........##',
  '###############################################..........####################......####',
  '###################################################.......######################...####',
  '####################################################.....##############################',
  '######################################################...##############################',
  '#######################################################################################',
];

export const REGIONS = {
  la: 'Latium',
  sa: 'Samnium',
  mg: 'Magna Graecia',
  gc: 'Gallia Cisalpina',
  um: 'Umbrien',
  si: 'Sicilien',
  sk: 'Sardinien og Korsika',
  ka: 'Afrika', // Rome's name for the land round Carthage
};

// letter: [id, name, region]
export const TERRITORIES = {
  R: ['rom', 'Rom', 'la'],
  E: ['etrurien', 'Etrurien', 'la'],
  C: ['campanien', 'Campanien', 'la'],
  S: ['bovianum', 'Bovianum', 'sa'],
  A: ['apulien', 'Apulien', 'sa'],
  P: ['picenum', 'Picenum', 'sa'],
  T: ['tarentum', 'Tarentum', 'mg'],
  L: ['lucanien', 'Lucanien', 'mg'],
  B: ['bruttium', 'Bruttium', 'mg'],
  M: ['mediolanum', 'Mediolanum', 'gc'],
  V: ['venetien', 'Venetien', 'gc'],
  G: ['ligurien', 'Ligurien', 'gc'],
  n: ['bononia', 'Bononia', 'gc'],
  U: ['spoletium', 'Spoletium', 'um'],
  b: ['sabinerland', 'Sabinerland', 'um'],
  s: ['syrakus', 'Syrakus', 'si'],
  p: ['panormus', 'Panormus', 'si'],
  y: ['lilybaeum', 'Lilybaeum', 'si'],
  d: ['sardinien', 'Sardinien', 'sk'],
  k: ['korsika', 'Korsika', 'sk'],
  K: ['karthago', 'Karthago', 'ka'],
  N: ['numidien', 'Numidien', 'ka'],
  z: ['byzacium', 'Byzacium', 'ka'],
};

export const TERRAIN = {
  M: 'mountains', // the Alps
  V: 'mountains',
  S: 'mountains', // the Apennines
  b: 'mountains',
  E: 'forest',
  k: 'forest',
  N: 'desert',
  z: 'desert',
};

export const SEA = [
  ['y', 'K'], // from Lilybaeum to Carthage
  ['d', 'K'],
  ['d', 'k'], // over the Strait of Bonifacio
  ['k', 'E'], // past Elba
  ['k', 'G'],
  ['d', 'R'], // over the Tyrrhenian Sea to Ostia
];

// Crowded seals: Rome and the Sabines, Lilybaeum and Panormus keep their names apart.
export const PLACES = { R: [29, 38, 'below'], b: [26, 40, 'below'], y: [45, 37, 'left'], p: [44, 40, 'above'] };

// Region missions: about 7–9 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['la', 'sa'], plusOne: true },
  { type: 'regions', regions: ['mg', 'si', 'ka'] },
  { type: 'regions', regions: ['gc', 'um'], plusOne: true },
  { type: 'regions', regions: ['ka', 'si', 'sk'] },
  { type: 'regions', regions: ['la', 'mg', 'um'] },
  { type: 'regions', regions: ['gc', 'sk'], plusOne: true },
  { type: 'regions', regions: ['sa', 'mg', 'si'] },
];

// Where the region names and the compass go. A name may sit on unexplored land.
export const REGION_PLACES = { la: [63.55, 49.5], sa: [80.1, 38.5], mg: [97.9, 57], gc: [54.05, 14.5], um: [73.1, 29.5], si: [71.15, 64], sk: [47.25, 47], ka: [44.55, 85.5] };
export const COMPASS = [95, 88, 1.6]; // in the Ionian Sea
export const SHIP = 'galley'; // with oars, a ram at the bow and a striped square sail
export const LANDMARKS = [[22.6, 16, 'Gallien'], [6.8, 52, 'Iberien'], [63.4, 6, 'Germanien'], [92.8, 31, 'Illyrien'], [108.7, 61, 'Grækenland'], [90.6, 106, 'Libyen'], [138, 110, 'Egypten · Alexandria']];

// Rules that differ from the modern rules on this map, measured with npm run balance -- italy:
// seats 49/51, 34/29/37 and 24/26/24/26 with 2, 3 and 4 players; easy computer players start with 50%
// fewer armies, so a medium bot standing in for a player wins 100%/88% against two/three of them,
// above the aim: with 40% (95%/79%) Martin was overrun early, as the map is small and games short.
export const RULES = { laterSeatArmies: { 2: 7, 3: 2, 4: 1, 5: 0, 6: 0 }, noviceHandicap: 0.5 };

// The flavour of the age: the computer players' names and what the winner becomes.
export const RULERS = ['Hannibal Barkas', 'Pyrrhus af Epirus', 'Hieron af Syrakus', 'Brennus', 'Hamilkar Barkas', 'Gaius Pontius'];
export const TITLE = 'Ruler of Rome';

// The names in English, where they differ (see inLanguage in index.js).
export const EN = {
  name: 'Rome Unites Italy',
  REGIONS: { um: 'Umbria', si: 'Sicily', sk: 'Sardinia and Corsica', ka: 'Africa' },
  TERRITORIES: {
    rom: 'Rome', etrurien: 'Etruria', campanien: 'Campania', apulien: 'Apulia', lucanien: 'Lucania', venetien: 'Venetia',
    ligurien: 'Liguria', sabinerland: 'Sabine Land', syrakus: 'Syracuse', sardinien: 'Sardinia', korsika: 'Corsica',
    karthago: 'Carthage', numidien: 'Numidia',
  },
  LANDMARKS: { Gallien: 'Gaul', Iberien: 'Iberia', Germanien: 'Germania', Illyrien: 'Illyria', Grækenland: 'Greece', Libyen: 'Libya', 'Egypten · Alexandria': 'Egypt · Alexandria' },
  RULERS: ['Hannibal Barca', 'Pyrrhus of Epirus', 'Hiero of Syracuse', 'Brennus', 'Hamilcar Barca', 'Gaius Pontius'],
};

export const ITALY_GRID = hexMap({
  id: 'italy',
  name: 'Roms samling af Italien',
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
  NAMES: { en: EN },
});
export const ITALY = ITALY_GRID.MAP;
