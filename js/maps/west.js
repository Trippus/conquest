// Kampen om Vesten, 1846: the United States go to war with Mexico for Texas, New Mexico and
// California, cross the plains of the Comanche and settle Oregon with Britain. The map shows British
// North America, the northern plains, the eastern States and Mexico round it. 33 territories in 10
// regions, drawn as a hex grid (see hex.js for what each part means). The coastlines are real
// (tools/make-grid.mjs); land outside the campaign is '#', drawn as unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '#########################################################################################################',
  '.########################################################################################################',
  '###..####################################################################################################',
  '###..####################################################################################################',
  '#####..##################################################################################################',
  '.####..##################################################################################################',
  '..#####...#######cccccccccccccc##########################################################################',
  '...####..#######ccccccccccccccc##########################################################################',
  '.....###...VVVVVcccccccccccccccc#########################################################################',
  '......#...VVVVVVccccccccccccccc##########################################################################',
  '...........VVVVVVccccccccccccccc#########################################################################',
  '.....VVVVVVVVVVVccccccccccccccc##########################################################################',
  '......VVVVVVVVVVVccccccccccccccc#########################################################################',
  '......VVVVVVVVVVVcccccccccccccc##########################################################################',
  '.......VVVVVVVVVVccccccccccccccc#########################################################################',
  '.......VVVVVVVVVVcccccccccccccc##########################################################################',
  '........VVVVVVVVVaaaccccccccccc##########################################################################',
  '.......VVVVVVVVVaaaaaaccccccccc##########################################################################',
  '........VVVVVVVaaaaaaaaaaccccchhhh#######################################################################',
  '.......VVVVVVVaaaaaaaaaaaaachhhhhhh######################################################################',
  '........VVVVVVaaaaaaaaaaaaaahhhhhhhhh##################R#################################################',
  '.......WWWWWWWaaaaaaaaaaaaahhhhhhhhhhh###########RRRRRRRR################################################',
  '.......WWWWWWWWaaaaaaaaaaaahhhhhhhhhhhhhh####RRRRRRRRRRRRR###############################################',
  '.......WWWWWWWWaaaaaaaaaaaahhhhhhhhhhhhhhh#RRRRRRRRRRRRRRR###############################################',
  '.......WWWWWWWWaaaaaaaaaaaahhhhhhhhhhhhhhhhRRRRRRRRRRRRRRRR##############################################',
  '.......WWWWWWWWaaaaaaaaaaahhhhhhhhhhhhhhhhhRRRRRRRRRRRRRRRRR#######PPPPP#################################',
  '.......WWWWWWWWWaaaaaaaaaahhhhhhhhhhhhhhhhhRRRRRRRRRRRRRRRRRR####PPPPPPPPPP###########L##################',
  '......WWWWWWWWWWaaaaaaaaaahhhhhhhhhhhhhhhhhRRRRRRRRRRRRRRRRRR#PPPPPPPPPPPPPP#######LLLLL#################',
  '......WWWWWWWWWWaaaaaaaaaahhhhhhhhhhhhhhhhhRRRRRRRRRRRRRRRRRRRPPPPPPPPPPPPPPPP###LLLLLLLLL###############',
  '......WWWWWWWWWWaaaaaaaaahhhhhhhhhhhhhhhhhhRRRRRRRRRRRRRRRRRRPPPPPPPPPPPPPPPPPLLLLLLLLLLLLL##############',
  '......WWWWWWWWWWWaaaaaaaahhhhhhhhhhhhhhhhhhRRRRRRRRRRRRRRRRRRPPPPPPPPPPPPPPPPPLLLLLLLLLLLLLL#############',
  '......WWWWWWWWWWWaaaaaaanhhhhhhhhhhhhhhhhssRRRRRRRRRRRRRRRRRRPPPPPPPPPPPPPPPPPLLLLLLLLLLLLL##############',
  '.......WWWWWWWWHHHHaannnnnnhhhhhhhhhhhhsssssRRRRRRRRRRRRRRRRRPPPPPPPPPPPPPPPPPLLLLLLLLLLLLLL#############',
  '......WWWWWHHHHHHHHnnnnnnnnhhhhhhhhhssssssssRRRRRRRRRRRRRRRRPPPPPPPPPPPPPPPPPPLLLLLLLLLLLLL##############',
  '.......WHHHHHHHHHHHnnnnnnnnnnhhhhhsssssssssssRRRRRRRRRRRRRRRPPPPPPPPPPPPPPPPPPLLLLLLLLLLLLL##############',
  '.......HHHHHHHHHHHHnnnnnnnnnnnhssssssssssssssRRRRRRRRRRRRRRBPPPPPPPPPPPPPPPPPIILLLLLLLLLLLL##############',
  '.......HHHHHHHHHHHHnnnnnnnnnnnnsssssssssssssssRRRRRRRRRRRRBBBBPPPPPPPPPPPPPPPIIIILLLLLLLLLL##############',
  '......HHHHHHHHHHHHHnnnnnnnnnnnssssssssssssssssRRRRRRRRRRBBBBBBPPPPPPPPPPPPPPIIIIILLLLLLLLLL##############',
  '.......HHHHHHHHHHHHnnnnnnnnnnnnssssssssssssssssRRRRRRRRBBBBBBBBBPPPPPPPPPPPIIIIIIIILLLLLLLL##############',
  '.......HHHHHHHHHHHHnnnnnnnnnnnnssssssssssssssssRRRRRRBBBBBBBBBBBPPPPPPPPPPIIIIIIIIILLLLLLLLL#############',
  '........HHHHHHHHHHHnnnnnnnnnnnnsssssssssssssssssRRRRBBBBBBBBBBBBBBPPPPPPPPIIIIIIIIIILLLLLLLL#############',
  '.......HHHHHHHHHHHnnnnnnnnnnnnnsssssssssssssssssRRBBBBBBBBBBBBBBBBPPPPPPPIIIIIIIIIILLLLLLLLL#############',
  '........HHHHHHHHHHHnnnnnnnnnnnnsssssssssssssssssTTTBBBBBBBBBBBBBBBBBPPPPIIIIIIIIIIIILLLLLLLL#############',
  '........HHHHHHHHHHnnnnnnnnnnnnnssssssssssssssssTTTTBBBBBBBBBBBBBBBBBPPPIIIIIIIIIIIILLLLLLLL##############',
  '.........HHHHHHHHHHnnnnnnnnnnnnssssssssssssssssTTTTTTBBBBBBBBBBBBBBBBBPIIIIIIIIIIIIILLLLLLLL#############',
  '.........HHHHHHHQQQnnnnnnnnnnnnsssssssssssssssTTTTTTTBBBBBBBBBBBBBBBBBIIIIIIIIIIIIIILLLLLLL##############',
  '..........HHHHQQQQQQnnnnnnnnnnnssssssssssssssKTTTTTTTTBBBBBBBBBBBBBBBwwwIIIIIIIIIIIILLLLLLL##############',
  '...........QQQQQQQQQQnnnnnnnnnnssssssssKKKKKKTTTTTTTTTBBBBBBBBBBBBBBwwwwIIIIIIIIIIIILLLLLLL##############',
  '...........QQQQQQQQQQQnnnnnnnnnnssKKKKKKKKKKKKTTTTTTTTTTBBBBBBBBBBBwwwwwwIIIIIIIIIIIILLLLLL##############',
  '...........QQQQQQQQQQQQnnnnnnnnKKKKKKKKKKKKKKTTTTTTTTTTTBBBBBBBBBBwwwwwwwFFFIIIIIIIILLLLLL###############',
  '............QQQQQQQQQQQQOOnnnnnKKKKKKKKKKKKKKKTTTTTTTTTTTBBBBBBBBBwwwwwwwFFFFFFIIIIIFFLLLLL##############',
  '............QQQQQQQQQQOOOOOOOOKKKKKKKKKKKKKKKKTTTTTTTTTTTTBBBBBBwwwwwwwwwFFFFFFFFFFFFFFLL################',
  '.............QQQQQQQQQOOOOOOOOKKKKKKKKKKKKKKKKTTTTTTTTTTTTTBBBBBwwwwwwwwwFFFFFFFFFFFFFFFF################',
  '.............QQQQQQQQOOOOOOOOOKKKKKKKKKKKKKKKKTTTTTTTTTTTTTllllwwwwwwwwwwFFFFFFFFFFFFFFFF################',
  '..............QQQQQQQOOOOOOOOOOKKKKKKKKKKKKKKKTTTTTTTTTTTTTlllllwwwwwwwwwwFFFFFFFFFFFFFFF################',
  '..............QQQQQOOOOOOOOOOOOKKKKKKKKKKKKKKKTTTTTTTTTTTTllllllwwwwwwwwwFFFFFFFFFFFFFFFF################',
  '...............QQQQOOOOOOOOOOOOKKKKKKKKKKKKKKKTTTTTTTTTTTTlllllllwwwwwwwwwFFFFFFFFFFFFFFF################',
  '...............QQQOOOOOOOOOOOOOKKKKKKKKKKKKKKKTTTTTTTTTTTllllllllwwwwwwwwFFFFFFFFFFFFFFFF################',
  '................QOOOOOOOOOOOOOODKKKKKKKKKKKKKKTTTTTTTTTTTlllllllllwwwwwwwwFFFFFFFFFFFFFFFF###############',
  '................OOOOOOOOOOOOODDDKKKKKKKKKKKKKEEETTTTTTTTllllllllllwwwwwwwFFFFFFFFFFFFFFFF################',
  '...................OOOOOOOOODDDDDUUUKKKKKKKKKEEEEEETTTTTlllllllllllwwwwwwwFFFFFFFFFFFFFFFF###############',
  '.....................OOOOODDDDDDUUUUUUUUUUUUEEEEEEEEEElllllllllllllwwwwwwFFFFFFFFFFFFFNNNN###############',
  '......................OOODDDDDDDDUUUUUUUUUUUEEEEEEEEEEElllllllllllllwwwAAAAAFFFFFFFFNNNNNN###############',
  '.......................DDDDDDDDDUUUUUUUUUUUUEEEEEEEEEEElllllllllllllAAAAAAAAAAFFNNNNNNNNNN###############',
  '........................DDDDDDDDDUUUUUUUUUUUEEEEEEEEEEEEllllllllllllAAAAAAAAAAANNNNNNNNNNN###############',
  '........................DDDDDDDDUUUUUUUUUUUUEEEEEEEEEEEElllllllllllAAAAAAAAAAAANNNNNNNNNNN###############',
  '........................DDDDDDDDUUUUUUUUUUUUEEEEEEEEEEEEEllllllllllAAAAAAAAAAAAGNNNNNNNNNN###############',
  '........................DDDDDDDDUUUUUUUUUUUUEEEEEEEEEEEEppppppllllAAAAAAAAAAAAGGNNNNNNNNNN###############',
  '.........................DDDDDDDDUUUUUUUUUUUEEEEEEEEEEEEppppppppppAAAAAAAAAAAAGGGNNNNNNNNN###############',
  '.........................DDDDDDDDUUUUUUUUUUUEEEEEEEEEEEpppppppppppAAAAAAAAAAGGGGGNNNNNNNNNN##############',
  '..........................DDDD...YUUUUUUUUUUEEEEEEEEEEEppppppppppppAAAAAAAAAGGGGGGGNNNNNNNNN#############',
  '..........................DDD.....YYYUUUUUUUEEEEEEEEEEppppppppppppAAAAAAAAAGGGGGGGGNNNNNNNNN#############',
  '...........................DDD....YYYYYYUUUYYEEEEEEEEEpppppppppppppAAAAAAAAGGGGGGGGGNNNNNNNN#############',
  '...........................DDZ....YYYYYYYYYYYYEEEEECCppppppppppppppAAAAAAAGGGGGGGGGNNNNNNNNN#############',
  '............................ZZZ....YYYYYYYYYYYYCCCCCCCCppppppppppppSSSSAAAGGGGGGGGGNNNNNNNNNN........####',
  '...........................ZZZ.....YYYYYYYYYYYYCCCCCCCCpppppppppppSSSSSSSGGGGGGGGGGNNNNNNNNN..........###',
  '............................ZZZZ....YYYYYYYYYYYCCCCCCCCCpppppppppSSSSSSSSSGGGGGGGG..NN.NNNNN...........#.',
  '.............................ZZZ....YYYYYYYYYYYCCCCCCCCCppppppppSSSSSSSSSSGGGGG.........NNNN.............',
  '..............................ZZZ...YYYYYYYYYYYCCCCCCCCCCpppppppSSSSSSSSSSSGGGG..........N...............',
  '..............................ZZZ..YYYYYYYYYYYCCCCCCCCCCCppppppSSSSSSSSSSSSGGG...........................',
  '................................ZZ....YYYYYYYYYCCCCCCCCCCCppppXSSSSSSSSSSSS.G............................',
  '...............................ZZZ....YYYYYYYYCCCCCCCCCCCCXXXXXXSSSSSSSSSS...............................',
  '................................ZZZ....YYYYYYYYCCCCCCCCCCCXXXXXXXSSSSSSSSS...............................',
  '.............................ZZZZZZ.....YYYYYYCCCCCCCCCCCXXXXXXXXSSSSSSSS................................',
  '...............................ZZZZZ.....YYYYY#CCCCCCCCCCXXXXXXXXXSSSSSSS................................',
  '...............................ZZZZZ.....YYY####CCCCCCCCXXXXXXXXXXSSSSSS.................................',
  '.................................ZZZZ.....Y#######CCCCCCXXXXXXXXXXXXSSSSS................................',
  '..................................ZZZZ.....#########CCCXXXXXXXXXXXXXMMMMM................................',
  '...................................ZZZ......############XXXXXXXXXXXXMMMMMM...............................',
  '....................................ZZ.....##############XXXXXXXXXXMMMMMM................................',
  '.....................................ZZ....###############XXXXXXXXMMMMMMMM...............................',
  '....................................ZZZ.....##############XXXXXXXMMMMMMMM................................',
  '.....................................ZZZ......##############XXXXXMMMMMMMM................................',
  '....................................ZZZZ......##############XXXXMMMMMMMM.................................',
  '.....................................ZZZ.......##################MMMMMMMM................................',
  '......................................ZZ........#################MMMMMMM.................................',
  '.......................................ZZZ.......#################MMMMMM.................................',
  '........................................ZZ.......#######################.................................',
  '.........................................ZZ.......######################.................................',
  '.........................................ZZ.......######################.................................',
  '..........................................Z........#####################.................................',
  '....................................................####################.................................',
];

// The lands of 1846, so no region shares its name with one of its territories.
export const REGIONS = {
  mi: 'Mississippi',
  tx: 'Texas',
  ca: 'Californien',
  or: 'Oregon',
  pr: 'Prærien',
  co: 'Comancheria',
  nm: 'Ny Mexico',
  so: 'Sonora',
  nx: 'Nordmexico',
  gb: 'Det Store Bassin',
};

// letter: [id, name, region]. Towns, forts and the trails' landmarks of the 1840s.
export const TERRITORIES = {
  L: ['saintlouis', 'Saint Louis', 'mi'],
  I: ['independence', 'Independence', 'mi'],
  F: ['fortsmith', 'Fort Smith', 'mi'],
  N: ['neworleans', 'New Orleans', 'mi'],
  A: ['austin', 'Austin', 'tx'],
  S: ['sanantonio', 'San Antonio', 'tx'],
  G: ['galveston', 'Galveston', 'tx'],
  D: ['sandiego', 'San Diego', 'ca'],
  O: ['losangeles', 'Los Angeles', 'ca'],
  Q: ['monterey', 'Monterey', 'ca'],
  H: ['sutter', 'Sutters Fort', 'ca'],
  V: ['vancouver', 'Fort Vancouver', 'or'],
  W: ['willamette', 'Willamette', 'or'],
  a: ['wallawalla', 'Fort Walla Walla', 'or'],
  c: ['colvile', 'Fort Colvile', 'or'],
  R: ['laramie', 'Fort Laramie', 'pr'],
  P: ['platte', 'Platte', 'pr'],
  B: ['bentsfort', "Bent's Fort", 'pr'],
  l: ['llano', 'Llano Estacado', 'co'],
  w: ['wichita', 'Wichitabjergene', 'co'],
  p: ['pecos', 'Pecos', 'co'],
  T: ['santafe', 'Santa Fe', 'nm'],
  E: ['elpaso', 'El Paso', 'nm'],
  K: ['grandcanyon', 'Grand Canyon', 'nm'],
  U: ['tucson', 'Tucson', 'so'],
  Y: ['guaymas', 'Guaymas', 'so'],
  Z: ['lapaz', 'La Paz', 'so'],
  M: ['matamoros', 'Matamoros', 'nx'],
  X: ['saltillo', 'Saltillo', 'nx'],
  C: ['chihuahua', 'Chihuahua', 'nx'],
  h: ['forthall', 'Fort Hall', 'gb'],
  s: ['saltlake', 'Saltsøen', 'gb'],
  n: ['humboldt', 'Humboldt', 'gb'],
};

export const TERRAIN = {
  V: 'spruce', // the forests of the Pacific Northwest
  W: 'spruce',
  c: 'spruce',
  H: 'mountains', // the Sierra Nevada
  h: 'mountains', // the Rockies
  R: 'mountains',
  s: 'mountains',
  T: 'mountains',
  X: 'mountains', // the Sierra Madre
  n: 'desert',
  U: 'desert',
  Y: 'desert',
  Z: 'desert',
  C: 'desert',
  E: 'desert',
  p: 'desert',
  L: 'forest',
  F: 'forest',
  G: 'forest',
  N: 'oak', // live oaks and bayous
};

export const SEA = [
  ['N', 'M'], // over the Gulf, the army's way to the Rio Grande
  ['Y', 'Z'], // over the Gulf of California
];

// Region missions: about 8–9 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['ca', 'or'] },
  { type: 'regions', regions: ['tx', 'co', 'nx'] },
  { type: 'regions', regions: ['nm', 'so', 'nx'] },
  { type: 'regions', regions: ['mi', 'tx'], plusOne: true },
  { type: 'regions', regions: ['pr', 'gb', 'or'] },
  { type: 'regions', regions: ['ca', 'so'], plusOne: true },
  { type: 'regions', regions: ['mi', 'pr'], plusOne: true },
];

// Where the region names and the compass go. A name may sit on unexplored land.
export const REGION_PLACES = { mi: [143.8, 38], tx: [135.5, 133.5], ca: [14, 85], or: [30, 8.5], pr: [109.6, 35], co: [105.3, 104.6], nm: [86.9, 93.75], so: [78.4, 135.8], nx: [103.75, 144], gb: [73.5, 27.5] };
export const COMPASS = [20, 140, 1.3];
export const SHIP = 'sidewheeler'; // a paddle steamer with masts, as the Mississippi off Veracruz in 1847
export const OCEANS = [[50, 4], [86, 20]];
export const LANDMARKS = [[72.7, 5.3], [72.7, 19.7], [115.5, 27.8], [170, 76], [102.7, 149.4]].map(([x, y], i) =>
  [x, y, ['Britisk Nordamerika', 'Blackfoot-landet', 'Siouxernes land', 'De østlige stater', 'Mexico'][i]]);

// Rules that differ from the modern rules on this map, measured with npm run balance -- west: seats
// 54/46, 36/30/34 and 26/22/26/27 with 2, 3 and 4 players; easy computer players start with 30% fewer
// armies, so a medium bot standing in for a player wins 99%/89% against two/three of them. Ten regions
// of three and four give quick bonuses, so the West aims at 85–90% against three, as Italy does.
export const RULES = { laterSeatArmies: { 2: 7, 3: 2, 4: 2, 5: 0, 6: 0 }, noviceHandicap: 0.3 };

// The flavour of the age: the computer players' names and what the winner becomes.
export const RULERS = ['Santa Anna', 'Buffalo Hump', 'James Douglas', 'Pío Pico', 'Manuel Armijo', 'Old Owl'];
export const TITLE = 'Ruler of the West';

// The names in English, where they differ (see inLanguage in index.js).
export const EN = {
  name: 'The Battle for the West',
  REGIONS: { ca: 'California', pr: 'The Prairie', nm: 'New Mexico', nx: 'Northern Mexico', gb: 'The Great Basin' },
  TERRITORIES: { sutter: "Sutter's Fort", wichita: 'Wichita Mountains', saltlake: 'Great Salt Lake' },
  LANDMARKS: { 'Britisk Nordamerika': 'British North America', 'Blackfoot-landet': 'Blackfoot Country', 'Siouxernes land': 'Sioux Country', 'De østlige stater': 'The Eastern States' },
};

export const WEST_GRID = hexMap({
  id: 'west',
  name: 'Kampen om Vesten',
  GRID,
  REGIONS,
  TERRITORIES,
  TERRAIN,
  SEA,
  MISSIONS,
  REGION_PLACES,
  COMPASS,
  SHIP,
  OCEANS,
  LANDMARKS,
  RULES,
  RULERS,
  TITLE,
  NAMES: { en: EN },
});
export const WEST = WEST_GRID.MAP;
