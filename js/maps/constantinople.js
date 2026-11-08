// Konstantinopel, 1453: the young sultan Mehmed II, from Bursa, against the last of Byzantium, Hungary
// under Hunyadi, Wallachia, Serbia, the princes of Albania and Bosnia, and Karaman in Anatolia. The map
// shows the Balkans, Anatolia and the Black Sea with Italy, the steppe, the Caucasus and Syria round
// them, the Danube and the Maritsa, and Mehmed's great cannon before the walls. 34 territories in 10
// regions, drawn as a hex grid (see hex.js for what each part means). The coastlines are real
// (tools/make-grid.mjs); land outside the campaign is '#', drawn as unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '#######################################uuuuuuuuuuu########################################################################################################################################',
  '######################################uuuuuuuuuuuu########################################################################################################################################',
  '######################################uuuuuuuuuuuuu#######################################################################################################################################',
  '#####################################uuuuuuuuuuuuuu#######################################################################################################################################',
  '#####################################uuuuuuuuuuuuuuu############################ss########################################################################################################',
  '################################uuuuuuuuuuuuuuuuuuuu###########################sss########################################################################################################',
  '###########################uuuuuuuuuuuuuuuuuuuuuuuuu##########################sssss#######################################################################################################',
  '#######################uuuuuuuuuuuuuuuuuuuuuuuuuuuuu########################sssssss#######################################################################################################',
  '#######################uuuuuuuuuuuuuuuuuuuuuuuuuuuuutttt########h##########sssssssss######################################################################################################',
  '#######################uuuuuuuuuuuuuuuuuuuuuuuuuuuuttttttt####hhhh#######ssssssssss#######################################################################################################',
  '#######################uuuuuuuuuuuuuuuuuuuuuuuuuuuttttttttttthhhhhh######sssssssssss######################################################################################################',
  '#######################uuuuuuuuuuuuuuuuuuuuuuuuuuttttttttttthhhhhhhh###sssssssssssss######################################################################################################',
  '#######################uuuuuuuuuuuuuuuuuuuuuuuuuuttttttttttthhhhhhhhh#sssssssssssssss#####################################################################################################',
  '#######################uuuuuuuuuuuuuuuuuuuuuuuuuttttttttttthhhhhhhhhhhssssssssssssssss####################################################################################################',
  '#######################zuuuuuuuuuuuuuuuuuuuuutttttttttttttthhhhhhhhhhhhsssssssssssssssss##################################################################################################',
  '#####################zzzzzuuuuuuuuuuuuuuuuuutttttttttttttthhhhhhhhhhhhhhsssssssssssssssss#######################################################.#..######################################',
  '#####################zzzzzzzzuuuuuuuuuuuuuuuttttttttttttttthhhhhhhhhhhhhhhsssssssssssssssss#################################################.........#####################################',
  '###################zzzzzzzzzzzuuuuuuuuuuuuuttttttttttttttthhhhhhhhhhhhhhhhhsssssssssssssssss##############################################........########################################',
  '##################zzzzzzzzzzzzzuuuuuuuuuuuuttttttttttttttthhhhhhhhhhhhhhhhhhhssssssssssssssss###########################################........##########################################',
  '###############zzzzzzzzzzzzzzzuuuuuuuuuuuuttttttttttttttthhhhhhhhhhhhhhhhhhhhssssssssssssssss#######################################..#.........##########################################',
  '###############zzzzzzzzzzzzzzzzuuuuuuuuuuuttttttttttttttthhhhhhhhhhhhhhhhhhhhssssssssssssssssss#########......####################..........##############################################',
  '##############zzzzzzzzzzzzzzzzzuuuuuuuuuuutttttttttttttthhhhhhhhhhhhhhhhhhhhhssssssssssssssssss#######.....#####################............##############################################',
  '#############zzzzzzzzzzzzzzzzzzuuuuuuuuuuuttttttttttttttthhhhhhhhhhhhhhhhhhhhsssssssssssssssssss######.......#################................############################################',
  '############zzzzzzzzzzzzzzzzzzzuuuuuuuuuuutttttttttttttthhhhhhhhhhhhhhhhhhhhhssssssssssssssssssss####.....#..################..................###########################################',
  '############zzzzzzzzzzzzzzzzzzzzuuuuuuuuulllttttttttttttthhhhhhhhhhhhhhhhhhhhhssssssssssssssssssss###..........##...########.#..................##########################################',
  '##########zzzzzzzzzzzzzzzzzzzzzzuuuuuuulllllttttttttttttthhhhhhhhhhhhhhhhhhhhsssssssssssssssssssss##.................#######..................############################################',
  '##########zzzzzzzzzzzzzzzzzzzzzzuuuuuulllllllttttttttttttthhhhhhhhhhhhhhhhhhhhsssssssssssssssssssss..................########................#############################################',
  '#########zzzzzzzzzzzzzzzzzzzzzzzuuuuullllllllttttttttttttthhhhhhhhhhhhhhhhhhhwsssssssssssssssssss..................##########...............##############################################',
  '######....zzzzzzzzzzzzzzzzzzzzzzzuuulllllllllltttttttttttthhhhhhhhhhhhhwwwwwwwwsssssssssssssssss..................############..............##############################################',
  '###.....zzzzzzzzzzzzzzzzzzzzzzzzuulllllllllllltttttttttttthhhhhhhhhhhhwwwwwwwwwwssssssssssssssss................##############.............###############################################',
  '#.......#zzzzzzzzzzzzzzzzzzbbbbbbblllllllllllllttttttttttthhhhhhhhhhhhwwwwwwwwwwwsssssssssssssss................###############....###.#....##############################################',
  '#.......zzzz.zzzzzzZZZzzzbbbbbbbbblllllllllllllltttttttttthhhhhhhhhhhwwwwwwwwwwwwwssssssssssssss..................###################..###################################################',
  '##.......zzz...zzzzZZZZZZbbbbbbbbbbllllllllllllllQQttttttthhhhhhhhhhwwwwwwwwwwwwwwwsssssssssssss.....................################.####################################################',
  '##.......zz.zzzzzzZZZZZZbbbbbbbbbbblllllllllllllQQQQQQQttwwwwwwwwwhwwwwwwwwwwwwwwwwwssssssssssss.....................##########..###....##################################################',
  '###.......z.....zzZZZZZZZbbbbbbbbbbbllllllllllllQQQQQQQQQwwwwwwwwwwwwwwwwwwwwwwwwwwwwsssssss.sss......................########............################################################',
  '#...........z.zzZZZZZZZZbbbbbbbbbbbblllllllllllQQQQQQQQQQwwwwwwwwwwwwwwwwwwwwwwwwwwwwsssssss.s.......................######...............################################################',
  '#............#..ZZZZZZZZbbbbbbbbbbbbbllllllllllQQQQQQQQQQwwwwwwwwwwwwwwwwwwwwwwwwwwwwwWWWWWW.........................#####.................#.#############################################',
  '#..............ZZZZZZZZZbbbbbbbbbbbbbbllllllllQQQQQQQQQQQwwwwwwwwwwwwwwwwwwwwwwwwwwwwWWWWWW.........................#####....................#############################################',
  '##..............ZZZZZZZZbbbbbbbbbbbbbbbllllllllQQQQQQQQQQwwwwwwwwwwwwwwwwwwwwwwwwwwwwWWWWWW...........................##......................############################################',
  '#.................ZZZZZbbbbbbbbbbbbbbbblllllllQQQQQQQQQQwwwwwwwwwwwwwwwwwwwwwwwwwwwwWWWWWW.......................................................#########################################',
  '##...............ZZZZZZZbbbbbbbbbbbbbbbblllllQQQQQQQQQQQQwwwwwwwwwwwwwwwwwwwwwwwwwwwWWWWWWW.......................................................########################################',
  '###..............ZZZZZZbbbbbbbbbbbbbbbbblllQQQQQQQQQQQQQOwwwwwwwwwwwwwVVwwwwwwwwwwwWWWWWWW.........................................................#######################################',
  '####..............ZZZZZZbbbbbbbbbbbbbbbbJJJQQQQQQQQQQQQQOOOwwwwwwwwwwVVVVwwwwwwwwwwwWWWWWWW.........................................................######################################',
  '#####..............ZZZZbbbbbbbbbbbbbbbbJJJJJQQQQQQQQQQQOOOOwwwwwwwVVVVVVVVwwwwwwwwWWWWWWWW...........................................................#####################################',
  '#######..............ZZZgggggbbbbbbbbbbJJJJJJQQQQQQQQQQOOOOOOwwwwVVVVVVVVVVVVwwwwwWWWWWWWW............................................................####################################',
  '########.............ZZgggggggggbbbbbbJJJJJJJJQQQQQQQQOOOOOOOwwVVVVVVVVVVVVVVVwwWWWWWWWWWW............................................................####################################',
  '#########................gggggggggggbbJJJJJJJJJJQQQQQQOOOOOOOOOVVVVVVVVVVVVVVVVVWWWWWWWWWW..............................................................##################################',
  '#########...............g.ggggggggggggJJJJJJJJJJJQQQOOOOOOOOOOOVVVVVVVVVVVVVVVVVWWWWWWW..................................................................#################################',
  '##########..................ggggggggggggJJJJJJJJJJJJJOOOOOOOOOOOVVVVVVVVVVVVVVVVWWWWWWW...................................................................################################',
  '#########.................ggggggggggggggJJJJJJJJJJJJJOOOOOOOOOOOVVVVVVVVVVVVVVVWWWWWWW.....................................................................###############################',
  '##########..................g.gggggggggggJJJJJJJJJJJJJOOOOOOOOOOOVVVVVVVVVVVVVVVWWWWWWW.......................................................................############################',
  '##########...................ggggggggggggJJJJJJJJJJJJJOOOOOOOOOOOVVVVVVVVVVVVVVWWWWWWW........................................................................############################',
  '###########...................g.gggggggggggJJJJJJJJJJJJOOOOOOOOOOOOVEEVVVVVVVVVWWWWWWWW.........................................................................##########################',
  '###########......................ggggggggggJJJJJJJJJJJOOOOOOOOOOOOEEEEEVVVVVVVWWWWWWW...........................................................................##########################',
  '############.......................gggggggggJJJJJJJJJJJOOOOOOOOOOOEEEEEEEVVVVVWWWWWWW............................................................................#########################',
  '############........................gggggggggJJJJJJJJJJOOOOOOOOOOEEEEEEEEEVVEEWWWWWWW............................................................................#########################',
  '##############.......................ggggggggkkkkkkkkkkkOOOOOOOOOEEEEEEEEEEEEEEEWWWWWW...........................................................................#########################',
  '##############........................gggggcckkkkkkkkkkkkOOOOOOOEEEEEEEEEEEEEEEEEWWWWW...........................................................................#########################',
  '################.......................gggcccckkkkkkkkkkkkkOOOOOEEEEEEEEEEEEEEEEEEWWWWW......................................P....................................T#######################',
  '##################.###.................gcccccckkkkkkkkkkkkkkOOOEEEEEEEEEEEEEEEEEEEEWWWK...........................PPPPPPPPPPP.....................................T#######################',
  '.######################..................cccccckkkkkkkkkkkkkkkOEEEEEEEEEEEEEEEEEEEEEEKK.........................PPPPPPPPPPPPPP....................................TT######################',
  '..###################....................cccccckkkkkkkkkkkkkkkHHHEEEEEEEEEEEEEEEEEEEKKK.......................PPPPPPPPPPPPPPPPP..PP..............................TTTT#####################',
  '...##################....................cccccckkkkkkkkkkkkkkkHHHHHHEEEEEEEEEEEEEEEEKKKK.....................PPPPPPPPPPPPPPPPPPPPPP..............................TTTTT####################',
  '....#################...................ccccccckkkkkkkkkkkkkkHHHHHHHHHEEEEEEEEEEEEEKKKKKK..................BBAPPPPPPPPPPPPPPPPPPPPM.............................TTTTTT####################',
  '.....###################.................ccccccckkkkkkkkkkkkkHHHHHHHHHHHHGGGGGEEEEEKKKKKKKK...............BBBAAAAPPPPPPPPPPPPPPPMMMM..MM.......................TTTTTTTTT##################',
  '.........################...............ccccccccckkkkkkkkkkHHHHHHHHHHHHHGGGGGGGGGGEKKKKKKKK...B..........BBBBAAAAAPPPPPPPPPPPMMMMMMMMMMM.....................TTTTTTTTTTT##################',
  '..........#################..............ccccccccckkkkkkkkHHHHHHHHHHHHHHGGGGGGGGGGGKKKKKKKK...BBBBBBBBBBBBBBBAAAAAAAAPPPPPPPPMMMMMMMMMMMMTTT........TT......TTTTTTTTTTTTT#################',
  '..........##################............cccccccccckkkkkkHHHHHHHHHHHHHH.HGGGGGGGGGGGK.........BBBBBBBBBBBBBBBBAAAAAAAAAAPPPPPMMMMMMMMMMMMTTTTTT...TTTTTTT.TTTTTTTTTTTTTTTT#################',
  '...........###################..........ccccccccccHHHHHHHHHHHHHHHHH.........GGGGGGGG..........BBBBBBBBBBBBBBBAAAAAAAAAAAAAPPMMMMMMMMMMMMMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT#################',
  '.............##################.........ccccccccccHHHHHHHHHHHHHH....H.......GGGGGGG.............BBBBBBBBBBBBAAAAAAAAAAAAAAAMMMMMMMMMMMMMMMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##################',
  '................#################.......ccccccccccHHHHHHHHHHHHHH................GG..........BBBBBBBBBBBBBBBBAAAAAAAAAAAAAAAAMMMMMMMMMMMMMMMTTTTTTTTTTTTTTTTTTTTTTTTTTTTT##################',
  '................###########.#####.......cccccccccHHHHHHHHH.HHHHH.........G...........BB.....BBBBBBBBBBBBBBBAAAAAAAAAAAAAAAAMMMMMMMMMMMMMMMMMTTTTTTTTTTTTTTTTTTTTTTTTTTT###################',
  '................##########...#####c.....cccccccccHHHHHHHHH..HHHH.#............G...BB..BBBBBBBBBBBBBBBBBBBBBAAAAAAAAAAAAAAAAAMMMMMMMMMMMMMMMMMMTTTTTTTTTTTTTTTTTTTTTTTTT###################',
  '................#########.......##c.....cccccIIIIHHHHHHHH....H.H.................BBBBBBBBBBBBBBBBBBBBBBBBBAAAAAAAAAAAAAAAAAMMMMMMMMMMMMMMMMMMMTTTTTTTTTTTTTTTTTTTTTTTT####################',
  '.................########.......##c.......IIIIIIIIHHHHHHHH......H...............BBBBBBBBBBBBBBBBBBBBBBBBBBAAAAAAAAAAAAAAAAAAMMMMMMMMMMRMMMMMMMMMTTTTTTTTTTTTTTTTTTTTTTT###################',
  '....................#####.......##c.......IIIIIIIIHHHHHHH.....#.H......##.....BBBBBBBBBBBBBBBBBBBUUUBBBBBBAAAAAAAAAAAAAAAAAMMMMMMMMRRRRMMMMMMMMMMTTTTTTTTT################################',
  '....................#####.........I........IIIIIIIIIHHHHHHH............##....BBBBBBBBBBBBBBBBBBBUUUUUUUUBBAAAAAAAAAAAAAAAAAAMMMMMMRRRRRRMMMMMMMMMMTTTTTTTT################################',
  '....................####.................IIIIIIIIIIIDDDDDDD..................BBBBBBBBBBBBBBBBBBUUUUUUUUUUAAAAAAAAAAAAAAAAAAMMMMRRRRRRRRRMMMMMMMMMMMTTTTT##################################',
  '.....................####.................I.IIIIIIIIDDDDDDD..................BBBBBBBBBBBBBBBBBUUUUUUUUUUUUAAAAAAAAAAAAAAAAARRRRRRRRRRRRRRMMMMMMMMMMMTTT###################################',
  '.....................#####................I.IIIIIIIIDDDDDDDD................BB...BBBBBBBBBBBBUUUUUUUUUUUUUAAAAAAAAAAAAAAARRRRRRRRRRRRRRRRMMMMMMMMMMMMT####################################',
  '......................######.................IIIIIIIIDDDDDDDD....................BBBBBBBBBBBUUUUUUUUUUUUUUUAAAAAAAAAAAAAARRRRRRRRRRRRRRRRRMMMMMMMMMMMM####################################',
  '......................#####..................IIIIIIIDDDDDDD.D..............###..BBBBBBBBBBBUUUUUUUUUUUUUUUUAAAAAAAAAAAAARRRRRRRRRRRRRRRRRRMMMMMMMMMMM#####################################',
  '......................######...................IIIIIIDDDDDD..D.#............###..SSSSSSSSBUUUUUUUUUUUUUUUUUUAAAAAAAAAAAARRRRRRRRRRRRRRRRRRRRMMMMMMMM######################################',
  '......................######...................IIIIIIDDDDDD..................##.SSSSSSSSSUUUUUUUUUUUUUUUUUUUAAAAAAAAAAARRRRRRRRRRRRRRRRRRRRRMMMMMMM#######################################',
  '.......................####.....................I.IIIDDDDDD.DD....................SSSSSSSSUUUUUUUUUUUUUUUUUUUYYYAAAAAAARRRRRRRRRRRRRRRRRRRRRRMMMMM########################################',
  '......................###.....................IIIIIIIDDDDD...D...................SSSSSSSSSUUUUUUUUUUUUUUUUUUYYYYYYYYYARRRRRRRRRRRRRRRRRRRRRRRMMM##########################################',
  '.....................####........................IIIIDDDDDDDD.DDD...............SSSSSSSSSSSSUUUUUUUUUUUUUUUUYYYYYYYYYYYRRRRRRRRRRRRRRRRRRRRRRRM###########################################',
  '.....................###.........................IIIDDDDDDDDD..DDD.........S..S.SSSSSSSSSSSSUUUUUUUUUUUUUUUYYYYYYYYYYYYRRRRRRRRRRRRRRRRRRRRRR#############################################',
  '.....................####........................IIIDDDDDDDDDDDDDD..........S..S..SSSSSSSSSSSUUUUUUUUUUUUUUYYYYYYYYYYYYYRRRRRRRRRRRRRRRRRRRRR#############################################',
  '....................###......................#.......D....DDDDDD.D..........SSSSSSSSSSSSSSSSSUUUUUUUUUUUUUYYYYYYYYYYYYYYRRRRRRRRRRRRRRRRRRRR##############################################',
  '.................##.###......................###...X.XDD....DDDDD.D.........S..SSSSSSSSSSSSSSSUUUUUUUUUUUUYYYYYYYYYYYYYYYRRRRRRRRRRRRRRRRRRR##############################################',
  '...#.###......####.###............................XXXXXDD...DDDDD.DD............SSSSSSSSSSSSSSUUUUUUUUUUUYYYYYYYYYYYYYYYYYRRRRRRRRRRRRRRRRR###############################################',
  '...###############..##............................XXXXXXXDDDD.DDDD...#.............SSSSSSSSSSSSUUUUUUUUUUYYYYYYYYYYYYYYYYYYRRRRRRRRRRRRRRRR###############################################',
  '..###############.............................##.XXXXXXXXDDD....D....#.............SSSSSSSSSSSUUUUUUUUUUUYYYYYYYYYYYYYYYYY##############RR################################################',
  '...##############...............................#..XXXXXXXXDD....D....#........###.SSSSSSSSSSSSUUNNNNNNNNYYYYYYYYYYYYYYYYYY###############################################################',
  '...##############..................................XXXXXXXXDD.....D....#....#.....SSSSSSSSSSSSNNNNNNNNNNNYYYYYYYYYYYYYYYYY################################################################',
  '......###########...................................XXXXXXX.XDD....................SSSSSSSSSSSSNNNNNNNNNNNYYYYYYYYYYYYYYYYY###############################################################',
  '.......#########....................................XXXXXX..X......................SSSSSSSSSSSNNNNNNNNNNNNNYYYYYYYYYYYYYYY################################################################',
  '.........#########..................................XXXXXXX.........................SSSSSSSSSSNNNNNNNNNNNNNNNNNYYYYYYYYYYY################################################################',
  '..........#######...................................XXXXXXX........#...#...........SSSSSSSSSSNNNNNNNNNNNNNNNNNNNYYYYYYYYYY################################################################',
  '.............#####...................................X.XXXXX.............#.......#......SSSSSNNNNNNNNNNNNNNNNNNNNYYYYYYYYY################################################################',
  '.............####...................................XX.XXXXX...............#......#....SSSSSNNNNNNNNNNNNNNNNNNNNNYYYYYYYY#########.#######################################################',
  '..............###.......................................XX.X............#........#...SSSS.SSNNNNNNNNN.....NNNNNNNNYYYYYYYY#..####...######################################################',
  '........................................................X..X................................NNNNNNNNN......NNNNNNNYYYYYYY.....##...#######################################################',
  '............................................................X................................NNNNNNNN........NNNNNNYYYYYY..........#######################################################',
  '.......................................................................................#.....NNNNNNN.........NNNNNNYYYYY..........########################################################',
  '...........................................................#..........................##......NNNNN.N.........NNNNNNYYY...........########################################################',
  '...........................................................#.........................##........................NNNNNY.............########################################################',
  '............#.........................................................................#...........................................########################################################',
  '............#........................................................................#............................................########################################################',
  '..................................................................................................................................########################################################',
  '.................................................................................................................................#########################################################',
  '...............................................................#..................#......................................#.......#########################################################',
  '..............................................................####.....................................................#..........########################################################',
  '...............................................................##########.#.......................................######..........########################################################',
  '..................................................................########..#....................................######...........########################################################',
  '.....................................................................#########.................................#########..........########################################################',
  '.....................................................................##.......................................########............########################################################',
  '...............................................................................................................######.............########################################################',
  '...............................................................................................................#####..............########################################################',
  '..................................................................................................................#................#######################################################',
  '..................................................................................................................................########################################################',
  '.................................................................................................................................#########################################################',
  '................................................................................................................................##########################################################',
  '.................................................................................................................................#########################################################',
  '................................................................................................................................##########################################################',
  '................................................................................................................................##########################################################',
  '...............................................................................................................................###########################################################',
  '...............................................................................................................................###########################################################',
  '...............................................................................................................................###########################################################',
  '...............................................................................................................................###########################################################',
  '..............................................................................................................................############################################################',
  '..............................................................................................................................############################################################',
  '.............................................................................................................................#############################################################',
  '#...................................................#.........................................................................############################################################',
  '########...........................................######....................................................................#############################################################',
  '############....................................############.................................................................#############################################################',
  '#############.................................##############................................................................##############################################################',
  '################..............................###############................................................................#############################################################',
  '#################...........................################................................................................##############################################################',
];

// The lands of 1453; no region shares its name with one of its territories.
export const REGIONS = {
  tr: 'Thrakien',
  an: 'Anatolien',
  ka: 'Karaman',
  pt: 'Pontus',
  bu: 'Bulgarien',
  gr: 'Grækenland',
  sr: 'Serbien',
  da: 'Dalmatien',
  hu: 'Ungarn',
  wl: 'Valakiet',
};

// letter: [id, name, region]. Capitals, fortresses and ports.
export const TERRITORIES = {
  K: ['konstantinopel', 'Konstantinopel', 'tr'],
  E: ['adrianopel', 'Adrianopel', 'tr'],
  G: ['gallipoli', 'Gallipoli', 'tr'],
  B: ['bursa', 'Bursa', 'an'],
  S: ['smyrna', 'Smyrna', 'an'],
  A: ['ankara', 'Ankara', 'an'],
  U: ['kutahya', 'Kütahya', 'an'],
  Y: ['konya', 'Konya', 'ka'],
  N: ['antalya', 'Antalya', 'ka'],
  R: ['kayseri', 'Kayseri', 'ka'],
  T: ['trapezunt', 'Trapezunt', 'pt'],
  P: ['sinop', 'Sinop', 'pt'],
  M: ['amasya', 'Amasya', 'pt'],
  V: ['tarnovo', 'Tarnovo', 'bu'],
  O: ['sofia', 'Sofia', 'bu'],
  W: ['varna', 'Varna', 'bu'],
  H: ['thessaloniki', 'Thessaloniki', 'gr'],
  I: ['arta', 'Arta', 'gr'],
  D: ['athen', 'Athen', 'gr'],
  X: ['mistra', 'Mistra', 'gr'],
  Q: ['smederevo', 'Smederevo', 'sr'],
  J: ['novobrdo', 'Novo Brdo', 'sr'],
  k: ['skopje', 'Skopje', 'sr'],
  Z: ['zara', 'Zara', 'da'],
  b: ['bobovac', 'Bobovac', 'da'],
  g: ['ragusa', 'Ragusa', 'da'],
  c: ['kruja', 'Kruja', 'da'],
  u: ['buda', 'Buda', 'hu'],
  l: ['belgrad', 'Belgrad', 'hu'],
  t: ['temesvar', 'Temesvár', 'hu'],
  z: ['zagreb', 'Zagreb', 'hu'],
  w: ['targoviste', 'Târgoviște', 'wl'],
  s: ['suceava', 'Suceava', 'wl'],
  h: ['hermannstadt', 'Hermannstadt', 'wl'],
};

export const TERRAIN = {
  K: 'oak', // the warm coasts of the Aegean and the Marmara
  G: 'oak',
  S: 'oak',
  N: 'oak',
  D: 'oak',
  X: 'oak',
  I: 'oak',
  g: 'oak',
  Z: 'oak',
  E: 'forest', // the lowlands and the Danube plain
  B: 'forest',
  W: 'forest',
  V: 'forest',
  H: 'forest',
  Q: 'forest',
  l: 'forest',
  t: 'forest',
  u: 'forest',
  z: 'forest',
  w: 'forest',
  s: 'forest',
  A: 'savanna', // the dry plateau of Anatolia
  Y: 'savanna',
  U: 'savanna',
  R: 'mountains', // the mountains of the Balkans, the Carpathians and the Pontus
  T: 'mountains',
  M: 'mountains',
  O: 'mountains',
  J: 'mountains',
  k: 'mountains',
  b: 'mountains',
  c: 'mountains',
  P: 'spruce',
  h: 'spruce',
};

export const SEA = [
  ['K', 'B'], // over the Bosporus
  ['G', 'B'], // over the Dardanelles
];

// Drawn, not played: the Danube and the Maritsa, and the great cannon (tools/grids/constantinople.mjs,
// in map units).
export const RIVERS = [[[31,6.5],[41.51,11],[56.6,16],[66.51,19.75],[65.09,37.25],[74.06,47.88],[79.72,53.5],[88.68,55.38],[100,56],[116.04,64.75],[125.47,67.25],[144.34,62.25],[152.83,46],[166.04,48.5]],[[109.43,84.75],[120.28,86.63],[129,89],[134.2,91.8],[135.6,95.5],[134.3,100.2],[132.55,104.13]]];
export const SIGHTS = [[150.94,97.25,"cannon"]];

// Region missions: about 7–9 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['tr', 'bu'], plusOne: true },
  { type: 'regions', regions: ['an', 'ka'] },
  { type: 'regions', regions: ['pt', 'ka'], plusOne: true },
  { type: 'regions', regions: ['gr', 'da'] },
  { type: 'regions', regions: ['hu', 'wl'] },
  { type: 'regions', regions: ['sr', 'hu'], plusOne: true },
  { type: 'regions', regions: ['gr', 'sr'], plusOne: true },
  { type: 'regions', regions: ['wl', 'bu'], plusOne: true },
];

// Where the region names and the compass go. A name may sit on unexplored land.
export const REGION_PLACES = { tr: [130.15, 108], an: [173.7, 97], ka: [220.1, 147], pt: [243.05, 97], bu: [157.2, 82.5], gr: [113.75, 118], sr: [93.4, 67.3], da: [52.2, 84], hu: [57.55, 5.5], wl: [122.15, 11.5] };
export const COMPASS = [61, 182, 2.4];
export const SHIP = 'kadirga'; // an Ottoman war galley with lateen sails
export const OCEANS = [[50, 114], [96, 71], [96, 35]];
export const LANDMARKS = [[26.4, 91, 'Italien'], [23.6, 9.8, 'Østrig'], [103.8, 4.8, 'Polen'], [209, 48.5, 'Krim'], [217, 17, 'Den Gyldne Horde'], [300, 86, 'Georgien'], [240.6, 169.8, 'Mamelukkerne'], [121.7, 172.9, 'Kreta'], [201, 174.8, 'Cypern'], [278, 132, 'Ak Koyunlu']];

// Rules that differ from the modern rules on this map, measured with npm run balance -- constantinople:
// seats 54/46, 36/31/33 and 25/25/26/24 with 2, 3 and 4 players; easy computer players start with 20%
// fewer armies, so a medium bot standing in for a player wins 98%/85% against two/three of them (many
// small regions: aim 85–90%).
export const RULES = { laterSeatArmies: { 2: 7, 3: 2, 4: 1, 5: 0, 6: 0 }, noviceHandicap: 0.2 };

// The flavour of the age: the computer players' names and what the winner becomes.
export const RULERS = ['Konstantin XI', 'János Hunyadi', 'Vlad Drăculea', 'Skanderbeg', 'Ibrahim af Karaman', 'Đurađ Branković'];
export const TITLE = 'Caesar of Rome';

// The names in English, where they differ (see inLanguage in index.js).
export const EN = {
  name: 'Constantinople',
  REGIONS: { tr: 'Thrace', an: 'Anatolia', bu: 'Bulgaria', gr: 'Greece', sr: 'Serbia', da: 'Dalmatia', hu: 'Hungary', wl: 'Wallachia' },
  TERRITORIES: { konstantinopel: 'Constantinople', adrianopel: 'Adrianople', trapezunt: 'Trebizond', athen: 'Athens', belgrad: 'Belgrade' },
  LANDMARKS: { Italien: 'Italy', Østrig: 'Austria', Polen: 'Poland', Krim: 'Crimea', 'Den Gyldne Horde': 'The Golden Horde', Georgien: 'Georgia',
    Mamelukkerne: 'The Mamluks', Kreta: 'Crete', Cypern: 'Cyprus' },
  RULERS: ['Constantine XI', 'John Hunyadi', 'Vlad Dracula', 'Skanderbeg', 'Ibrahim of Karaman', 'Đurađ Branković'],
};

export const CONSTANTINOPLE_GRID = hexMap({
  id: 'constantinople',
  name: 'Konstantinopel',
  GRID,
  REGIONS,
  TERRITORIES,
  TERRAIN,
  SEA,
  RIVERS,
  SIGHTS,
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
export const CONSTANTINOPLE = CONSTANTINOPLE_GRID.MAP;
