// Roms samling af Italien, around 300–250 BC: Rome against the Samnites, the Greek cities of the
// south, the Gauls of the Po valley and Carthage over the sea. 23 territories in 8 regions, drawn as a
// hex grid (see hex.js for what each part means). The coastlines are real (tools/make-grid.mjs);
// land outside the campaign is '#', drawn as unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '###################################################',
  '###################################################',
  '#####################V#############################',
  '####################VV#############################',
  '###########MM#######VVVV###########################',
  '##########MMMMM####VVVVVV##########################',
  '##########MMMMMMM#VVVVVVVV#########################',
  '#########MMMMMMMMMVVVVVVV...#######################',
  '#########MMMMMMMMMnVVVVV....#######################',
  '#######GGMMMMMMMMnnnVVV.....##.####################',
  '#######GGGGGMMMMMnnnnnVV.....#.####################',
  '######GGGGGGGMMMnnnnnnn.........###################',
  '#######GGGGGGGGGnnnnnnnn........###################',
  '######GGGGGGGGGnnnnnnnn.........###################',
  '######GGGGG....Gnnnnnnnn.........##################',
  '#####GGGGG......nnnnnnnnU........##################',
  '######GGG........EEEEEEUUP.........################',
  '#####G...........EEEEEEUUPP........################',
  '#####G............EEEEEUUUPP..........#############',
  '.###G.............EEEEUUUPPP.........#.############',
  '..................EEEEUUUUPPP...........###########',
  '..................EEEUUUUUPPP............##########',
  '............kkk.....EEUUUbbbPP.............########',
  '...........kkk......EUUUbbbbbb..............#######',
  '............kkk.......RRRbbbbbS...............#####',
  '...........kkk........RRRRbbbSSS..............#####',
  '............kk..........RRRbbSSSSSSAA..........####',
  '............kk..........RRRbSSSSSSA............####',
  '..........................RRCCSSSSAA...........####',
  '.............d..............CCCCSAAAAA.........####',
  '..........d..dd..............CCCCAAAAAAT.......####',
  '..........ddddd...............CCCAAAAATTT......####',
  '...........ddddd................CLLLLLTTTT.....####',
  '...........dddd.................LLLLLL..TTT....####',
  '...........dddd..................LLLLL....TT...####',
  '...........dddd...................LLL.....T.....###',
  '...........dddd....................LLL..........###',
  '...........dddd....................BBB...........##',
  '...........dddd.....................BBBB..........#',
  '...........dd.......................BBB...........#',
  '...........dd.......................BBBB...........',
  '....................................B..............',
  '....................................BB.............',
  '...................................BB.............#',
  '.................................sBBB.............#',
  '........................yypppppssssB...............',
  '........................yypppppsss.................',
  '........................yyppppsss..................',
  '...........................ppssss..................',
  '.............KKK............sssss..................',
  '....N..NN...KKKKK..K..........ssss.................',
  '..NNNNNNNNNNKKKKK.K............ss..................',
  'NNNNNNNNNNNNKKKKKKK................................',
  'NNNNNNNNNNNNKKKKKK.................................',
  '##NNNNNNNNNNNKKKKK.................................',
  '##NNNNNNNNNNKKzzzz.................................',
  '####NNNNNNNN#zzzzzz................................',
  '#####NNNNN###zzzzzz................................',
  '#######NN#####zzzzzz...............................',
  '##############zzzzz................................',
  '###############zzz#................................',
  '###############z##.................................',
  '##################.................................',
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
export const REGION_PLACES = { la: [42.55, 46.5], sa: [60.1, 34], mg: [77.4, 64.5], gc: [60, 11.5], um: [34.6, 42], si: [49.15, 65.5], sk: [16, 32.5], ka: [17.15, 91.5] };
export const COMPASS = [12, 60, 1.3];
export const SHIP = 'longship';
export const LANDMARKS = [[7.8, 7, 'Gallien'], [74.6, 22, 'Illyrien']];

// Rules that differ from the modern rules on this map, measured with npm run balance -- italy:
// seats 49/51, 34/29/37 and 24/26/24/26 with 2, 3 and 4 players; easy computer players start with 40%
// fewer armies, so a medium bot standing in for a player wins 97%/79% against two/three of them
// (93%/70% with 30%).
export const RULES = { laterSeatArmies: { 2: 7, 3: 2, 4: 1, 5: 0, 6: 0 }, noviceHandicap: 0.4 };

// The flavour of the age: the computer players' names and what the winner becomes.
export const RULERS = ['Hannibal Barkas', 'Pyrrhus af Epirus', 'Hieron af Syrakus', 'Brennus', 'Hamilkar Barkas', 'Gaius Pontius'];
export const TITLE = 'Ruler of Rome';

export const ITALY_GRID = hexMap({
  id: 'italy',
  name: 'Roms samling af Italien',
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
export const ITALY = ITALY_GRID.MAP;
