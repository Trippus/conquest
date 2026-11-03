// Djengis Khan, 1206: Temüjin has united the tribes of the steppe and been proclaimed Genghis Khan.
// South and west of him lie the Tangut kingdom of Xi Xia, the Jurchen Jin in northern China, the Kara
// Khitai and the Uyghur oases of the Tarim, and the sultan of Khwarazm in Transoxiana and Khorasan.
// The map shows Asia from the Caspian to Korea, with the Kipchak steppe, Persia, India, Tibet, Song
// China and Siberia round it, the Orkhon, the Kerulen, the Yellow River, the Tarim, the Amu Darya and
// the Syr Darya, the Aral Sea and Lake Baikal, yurts on their carts, a caravan on the Silk Road and a
// mounted archer. 35 territories in 10 regions, drawn as a hex grid (see hex.js for what each part
// means). The coastlines are real (tools/make-grid.mjs); land outside the campaign is '#', drawn as
// unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '#############################################################################################################################################################################################',
  '#############################################################################################################################################################################################',
  '#############################################################################################################################################################################################',
  '#############################################################################################################################################################################################',
  '###########################################################################################################################################...###############################################',
  '##########################################################################################################Y###############################...################################################',
  '#########################################################################################################YYY##############################...################################################',
  '#######################################################################################################YYYYY#############################....################################################',
  '#####################################################################################################YYYYYYY##############################...################################################',
  '###################################################################################################YYYYYYYYY############################....#################################################',
  '##################################################################################################YYYYYYYYYYYY###########################...#################################################',
  '################################################################################################YYYYYYYYYYYYYY#########################....##################################################',
  '###############################################################################################YYYYYYYYYYYYYYYYY#######################...###################################################',
  '############################################################################################YYYYYYYYYYYYYYYYYYYY######################...####################################################',
  '#########################################################################################IIYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY###########....####################################################',
  '#####################################################################################IIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY#########....######################################################',
  '#####################################################################################IIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYKKKKKKKK....######################################################',
  '###################################################################################IIIIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYKKKKKK....KK######################################################',
  '###################################################################################IIIIIIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYYYYKKKKK....KKKK#####################################################',
  '##################################################################################IIIIIIIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYYKKKKKKKKKKKKKK######################################################',
  '#################################################################################IIIIIIIIIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYKKKKKKKKKKKKKKK##########################################N##########',
  '################################################################################IIIIIIIIIIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYKKKKKKKKKKKKKKKK######################################NNNNNN#########',
  '################################################################################IIIIIIIIIIIIIIIVVVVVVVYYYYYYYYYYYYYYYYYYKKKKKKKKKKKKKKKKK#######################EE############NNNNNNN########',
  '##############################################################################IIIIIIIIIIIIIIIIIVVVVVVVVYYYYYYVVYYYYYYYKKKKKKKKKKKKKKKKKK#####OOOOOOOOO#######EEEEE###########NNNNNNNNN#######',
  '##############################################################################IIIIIIIIIIIIIIIIIVVVVVVVVVVYVVVVVVVYYYYYKKKKKKKKKKKKKKKKKKKOOOOOOOOOOOOOE#####EEEEEEE##########NNNNNNNNNNN#####',
  '##############################################################################IIIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVYYYYKKKKKKKKKKKKKKKKKKKOOOOOOOOOOOOOEEEEEEEEEEEEEE##########NNNNNNNNNNN#####',
  '###############################################################################IIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVYYKKKKKKKKKKKKKKKKKKKOOOOOOOOOOOOOOEEEEEEEEEEEEEE########NNNNNNNNNNNNNN###',
  '##############################################################################IIIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEE######NNNNNNNNNNNNNNNNNNN',
  '###############################################################################IIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEE####NNNNNNNNNNNNNNNNNNNN',
  '###############################################################################IIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKKOOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEE##NNNNNNNNNNNNNNNNNNNNNN',
  '################################################################################IIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKKOOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNNNNN',
  '############################################o#################################LLIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNNNNN',
  '##########################################oooo###############################LLLLIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKOOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNNNNN',
  '########################################ooooo####################TTT#######LLLLLLIIIIIIIIIIIIIISVVVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEEEQNNNNNNNNNNNNNNNNNNNNNN',
  '##############......##################oooooooo##################....TT###LLLLLLLLLIIIIIIIIIIIIIISSSVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEEEQQNNNNNNNNNNNNNNNNNNNNN',
  '###########........#################ooooooooooo################TT......L...LLLLLLLIIIIIIIIIIIIISSSSSSVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEEEQQQNNNNNNNNNNNNNNNNNNNNN',
  '###########.........############.....oooooooooooo##############TTTTTTT....LLLLLLLLLIIIIIIIIIIIISSSSSSSVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEEQQQQQNNNNNNNNNNNNNNNNNNN',
  '##########.........############......oooooooooooo############TTTTTTTTTTLLLLLLLLLLLLIIIIIIIIIIISSSSSSSSVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEQQQQQQQNNNNNNNNNNNNNNNNNNN',
  '#########..........############.......ooooooooooooo#####oTTTTTTTTTTTTTTLLLLLLLLLLLLLIIIIIIIIIISSSSSSSSSVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEQQQQQQQQQNNNNNNNNNNNNNNNNN',
  '#######........##############u........ooooooooooooooooooTTTTTTTTTTTTTLLLLLLLLLLLLLLLIIIIIIIIISSSSSSSSSVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKOOOOOOOOOOOOOEEEEEEEEEEEEEEEEQQQQQQQQQQNNNNNNNNNNNNNNNNN',
  '#######......#.###########uuuuu.......oooooooooooooooooooTTTTTTTTTTTTLLLLLLLLLLLLLLLLIIIIIIIISSSSSSSSSSVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKOOOOOOOOOOOOOEEEEEEEEEEEQQQQQQQQQQQQQQNNNNNNNNNNNNNNNNN',
  '######.........########uuuuuuu........oooooooooooooooooooTTTTTTTTTTTLLLLLLLLLLLLLLLLLIIIIIISSSSSSSSSSSSVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKOOOOOOOOOOOOOEEEEEEEEEEQQQQQQQQQQQQQQQNNNNNNNNNNNNNNNNN',
  '######.......#######uuuuuuuuuuu.......ooooooooooooooooooooTTTTTTTTTTLLLLLLLLLLLLLLLLLLIIIIISSSSSSSSSSSSSSSSSSSVVVVVVVVVKKKKKKKKKKKKKKKKOOOOOOOOOOOOEEEEEEEEEEQQQQQQQQQQQQQQQQJNNNNNNNNNNNNNNN',
  '#######.......###uuuuuuuuuuuuuu......oooooooooooooooooooooTTTTTTTBBLLLLLLLLLLLLLLLLLLLIIIISSSSSSSSSSSSSSSSSSSSVVVVVVVVZKKKKKKKKKKKKKKKOOOOOOOOOOOOOEEEEEEEEEQQQQQQQQQQQQQQQQJJJNNNNNNNNNNNNNN',
  '#######........##uuuuuuuuuuuuuuu.....oooooooooooooooooooooTTTTTTTBBBLLLLLLLLLLLLLLLLLLCCCSSSSSSSSSSSSSSSSSSSSSSDDDVVVZZZZKKKKKKKKKKKKKKOOOOOOOOOOOOOREEEEEEEQQQQQQQQQQQQQQQQJJJJJJNNNNNNNNNNN',
  '#######........##uuuuuuuuuuuuuuuuuuuuuoobboooooooooooooooTTTTTTTBBBBBLLLLLLLLLLLLLLLCCCCCSSSSSSSSSSSSSSSSSSSSSDDDDDDZZZZZZKKKKKKKKKKKKOOOOOOOOOOOORRRRRRRRRQQQQQQQQQQQQQQQQJJJJJJJNNNNNNNNNNN',
  '########........#uuuuuuuuuuuuuuuuuuuuuubbbbbbooooooooooooTTTTTTBBBBBBBBBBBBLLLLLLLLCCCCCCCCSSSSSSSSSSSSSSSSSSSDDDDDDDZZZZZZZKKKKKKKKKKKOOOOOOOOOOORRRRRRRRRRQQQQQQQQQQQQQQQQJJJJJJJNNNNNNNNNN',
  '#######.........#uuuuuuuuuuuuuuuuuuuuuubbbbbbbboooooooooTTTTTTBBBBBBBBBBBBBLLLLLLCCCCCCCCCCSSSSSSSSSSSSSSSSSSDDDDDDDZZZZZZZZKKKKKKKKKKOOOOOOOOOOORRRRRRRRRRRQQQQQQQQQQQQQQQJJJJJJJNNNNNNNNN..',
  '########...........uuuuuuuuuuuuuuuuuuuuubbbbbbbbooooooooTTTTTTTBBBBBB.....BBBLLLLCCCCCCCCCCCSSSSSSSSSSSSSSSSSDDDDDDDDZZZZZZZZKKKKKKKXXXOOOOOOOOORRRRRRRRRRRRPQQQQQQQQQQQQQQJJJJJJJJNNNNNNN...',
  '########..........uuuuuuuuuuuuuuuuuuuuubbbbbbbbboooooooTTTTTTTBBBBBBB....BBBBLLCCCCCCCCCCCCCSSSSSSSSSSSSSSSSDDDDDDDDZZZZZZZZZKKKKKXXXXXOOOOOOORRRRRRRRRRRRRPPQQQQQQQQQQJJJJJJJJJJJJNNNNNN....',
  '#########.........u..uuuuuuuuuuuuuuuuuubbbbbbbbbboooooooTTTTTTTBBBBBBBBBBBBBGGCCCCCCCCCCCCCCCSSSSSSSSSSSSSSSDDDDDDDDDZZZZZZZZZKKXXXXXXXXXOOOOORRRRRRRRRRRRRPPPQQQQQQQQJJJJJJJJJJJJJ###NNN....',
  '##########...........uuuuuuuuuuuuuuuuubbbbbbbbbboooooossTTsssssBBBBBBBBBBBGGGGCCCCCCCCCCCCCCCCSSSSSSSSSSSSSDDDDDDDDDZZZZZZZZZZXXXXXXXXXXXOOORRRRRRRRRRRRRRPPPPQQQQQQQJJJJJJJJJJJJ######......',
  '###########...........uuuuuuuuuuuuuuuubbbbbbbbbbbooosssssssssssBBBBBBBBBBGGGGGGCCCCCCCCCCCCCCCCCCSSSSSSSSSSDDDDDDDDDZZZZZZZZZZZXXXXXXXXXXXXORRRRRRRRRRRRRRPPPPPQQQQQQQJJJJJJJJJJ########.....',
  '###########...........uuuuuuuuuuuuuuuubbbbbbbbbbsssssssssssssssBBBBBBBBGGGGGGGGCCCCCCCCCCCCCCCCCCCCHHSSSDDDDDDDDDDDZZZZZZZZZZZXXXXXXXXXXXXXXRRRRRRRRRRRRRPPPPPPQQQQQQJJJJJJJJJ#########......',
  '############.......uu.uuuuuuuuuuuuuuuubbbbbbbbbsssssssssssssssssBBBBBBBGGGGGGGGGCCCCCCCCCCCCCCCCCCCHHHHDDDDDDDDDDDDZZZZZZZZZZWWWXXXXXXXXXXXXXRRRRRRRRRRRRPPPPPPPQQQQQ..JJJJJJJ##########.....',
  '#############.....#uuuuuuuuuuuuuuuuuubbbbbbbbbsssssssssssssssssBBBBBBBGGGGGGGGGGCCCCCCCCCCCCCCCCCCCHHHHDDDDDDDDDDZZZZZZZZZZZWWWWXXXXXXXXXXXXXRRRRRRRRRRRPPPPPPPQQQQQ...JJJJJJ#########.......',
  '############.......#uuuuuuuuuuuuuuuummbbbbbbbbbsssssssssssssssssBBGGGGGGGGGGGGGGCCCCCCCCCCCCCCCCCCCHHHHHDDDDDDDDDZZZZZZZZZZWWWWWWXXXXXXXXXXXXXRRRRRRRRRRPPPPPPPPQQQQ...JJJJJJJ########.......',
  '###########.........#uuuuuuuuuuuuummmmbbbbbbbbsssssssssssssssssGGGGGGGGGGGGGGGGGCCCCCCCCCCCCCCCCCCHHHHHHDDDDDDDDZZZZZZZZZZZWWWWWWXXXXXXXXXXXXXUUURRRRRRPPPPPPPPPPP....JJJJJJJ######..........',
  '###########.........##uuuuuuuuuuummmmmmmbbbbbbssssssssssssssssssGGGGGGGGGGGGGGGGHHHHHHCHHHHHHCCCCCHHHHHHDDDDDDDDDZZZZZZZZZZWWWWWWWWXXXXXXXXXXXUUUURRRRRRPPPPPPPPPP....JJJ.....#####..........',
  '###########.........##ppuuuuuuummmmmmmmmbbbbbbsssssssssssssssssGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHCCCCHHHHHHHDDDDDDDDZZZZZZZZZZZWWWWWWWXXXXXXXXXXXUUUUURRRRRAPPPPPPPPP.....J.......#####..........',
  '###########..........#ppppuuummmmmmmmmmmbbbbbbsssssssssslllllllGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHCCCHHHHHHHDDDDDDDDDZZZZZZZZZZZWWWWWWXXXXXXXXXXXUUUUUUURAAAAAAAPP........J.......######.........',
  '##########...........#pppppmmmmmmmmmmmmmbbbbbbsssssssslllllllllGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHCCHHHHHHHDDDDDDDDDDZZZZZZZZZZWWWWWWXXXXXXXXXXXUUUUUUUUAAAAAAAAP.................######.........',
  '##########...........#ppppppmmmmmmmmmmmmmmbbbbssssssslllllllllllGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHDDDDDDDDDDZZZZZZZZZWWWWWWWXXXXXXXXXXUUUUUUUUUAAAAAAAAP................#######........',
  '##########...........#pppppppmmmmmmmmmmmmmbbbsssssssllllllllllllGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHDDDDDDDDDDZZZZZZZZZWWWWWWWXXXXXXXXXXUUUUUUUUUUAAAAAAAAPPP.............########........',
  '###########..........##pppppppmmmmmmmmmmmmmmlllllssllllllllllllllGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHDDDDD######ZZZZZZZWWWWWWWWXXXXXXXXXnnUUUUUUUUAAAAAAAAAMPM...M.........#.######.......',
  '###########..........#ppppppppmmmmmmmmmmmmmllllllllllllllllllllllGGGGGGGGHHHHHHHHHHHHH##HHHHHHHHHHHHHHH############ZZZZZZWWWWWWWWWXXXXXXXXnnnnUUUUUUUAAAAAAMMMMM...MMM...........#####.......',
  '##############.......##ppppppppppmmmmmmmmmmhlllllllllllllllllllllGGGGGGGGHHHHHHHHHHHH#####HHHHH#########################ZWWWWWWWWWWWXXXXXXnnnnnnUUUUUAAAAAAMMMMMM..MMMMMM.........#####......',
  '##############......###pppppppppppmmmmmmmmhhllllllllllllllllllll#GGGGGGGHHHHHHHHHHHH#######HHH###########################WWWWWWWWWWWXXXXXnnnnnnUUUUUUAAAAAAMMMMMMMMMMM.M........#######......',
  '#######################pppppppppppppmmmmmhhhhllllllllllll############GGGHHHHHHHHHHH########################################WWWWWWWWWnnnXXnnnnnnnUUUUUUAAAAAMMMMMMMMMM............######......',
  '#######################pppppppppppppmmmhhhhhhlllllllllll################HHHHHHHHH##########################################WWWWWWWWnnnnnnnnnnnnUUUUUUUAAAAMMMMMMMMMM.............######......',
  '#######################ppppppppppppppmhhhhhhhhllllllllll#################HHHHHHHH###########################################WWWWWWWWnnnnnnnnnnnUUUUUUUFAAAMMMMMMMMMM.............#######.....',
  '#######################ppppppppppppphhhhhhhhhhlllllllll##################HHHHHHHH##########################################WWWWWWWWnnnnnnnnnnnnUUUUUUFFFFAMMMMMMMM...............######......',
  '########################pppppppppppphhhhhhhhhhhlllllllll####################################################################WWWWWWWnnnnnnnnnnnnFFFFFFFFFFFFMMMMMMM...............######......',
  '#######################pppppppppppphhhhhhhhhhhhllllllll######################################################################WWWWWnnnnnnnnnnnnFFFFFFFFFFFFFFMMMMM...............######.......',
  '#########################pppppppppphhhhhhhhhhhhh###############################################################################WWWnnnnnnnnnnnnnFFFFFFFFFFFFFFFMMM................###.#.......',
  '#########################ppppppppphhhhhhhhhhhhh#################################################################################nnnnnnnnnnnnnnFFFFFFFFFFFFFFFFFFMM..............#..........##',
  '##########################ppppppppphhhhhhhhhhhh#################################################################################nnnnnnnnnnnnnnnFFFFFFFFFFFFFFFFFFFM#......................###',
  '##########################pppppppphhhhhhhhhhhh##################################################################################nnnnnnnnnnnnnnnFFFFFFFFFFFFFFFFFF##......................#..#',
  '###########################ppppppphhhhhhhhhhhhh##################################################################################nnnnnnnnnnnnnnFFFFFFFFFFFFFFFFFF###.....................##..',
  '############################ppppp#hhhhhhhhhhh###################################################################################nnnnnnnn#nnnn###FF####FFFFFFFFFF####............#......#####.',
  '#############################pp#####hhhhhhhhh####################################################################################nnnnn####nn###########FFFFFFFFF#####.................#.#####',
  '#####################################hhhhhhh####################################################################################nnn####################FFFF###F#####.................#..####.',
  '######################################hhhhhh#############################################################################################################F############..................#.##.',
  '######################################hhhh############################################################################################################################..................###..',
  '########################################hh#############################################################################################################################..................###.',
  '########################################h##############################################################################################################################...................#..',
  '#######################################################################################################################################################################...................#..',
  '######################################################################################################################################################################.......................',
  '#####################################################################################################################################################################........................',
  '####################################################################################################################################################################.........................',
  '##########...##########################################################################################################################################################......................',
  '#########....##########################################################################################################################################################......................',
  '########......#########################################################################################################################################################......................',
  '########......########################################################################################################################################################.......................',
  '#########......########################################################################################################################################################......................',
  '#########......#######################################################################################################################################################.......................',
  '##########......#####################################################################################################################################################........................',
];

// The lands of 1206; no region shares its name with one of its territories.
export const REGIONS = {
  mo: 'Mongoliet',
  nm: 'Naiman',
  kk: 'Kara Khitai',
  tm: 'Tarim',
  xx: 'Xi Xia',
  ma: 'Manchuriet',
  hb: 'Hebei',
  hn: 'Henan',
  tx: 'Transoxanien',
  kh: 'Khorasan',
};

// letter: [id, name, region]. Camps, capitals and oasis cities.
export const TERRITORIES = {
  O: ['onon', 'Onon', 'mo'],
  E: ['kerulen', 'Kerulen', 'mo'],
  K: ['karakorum', 'Karakorum', 'mo'],
  V: ['khovd', 'Khovd', 'nm'],
  I: ['irtysh', 'Irtysj', 'nm'],
  Y: ['yenisei', 'Jenisej', 'nm'],
  B: ['balasagun', 'Balasagun', 'kk'],
  L: ['almalik', 'Almalik', 'kk'],
  T: ['taraz', 'Taraz', 'kk'],
  S: ['beshbalik', 'Beshbalik', 'tm'],
  C: ['kucha', 'Kucha', 'tm'],
  G: ['kashgar', 'Kashgar', 'tm'],
  H: ['khotan', 'Khotan', 'tm'],
  X: ['xingqing', 'Xingqing', 'xx'],
  W: ['liangzhou', 'Liangzhou', 'xx'],
  Z: ['ganzhou', 'Ganzhou', 'xx'],
  D: ['shazhou', 'Shazhou', 'xx'],
  N: ['huining', 'Huining', 'ma'],
  J: ['liaoyang', 'Liaoyang', 'ma'],
  Q: ['daning', 'Daning', 'ma'],
  P: ['zhongdu', 'Zhongdu', 'hb'],
  R: ['datong', 'Datong', 'hb'],
  U: ['taiyuan', 'Taiyuan', 'hb'],
  A: ['zhending', 'Zhending', 'hb'],
  F: ['kaifeng', 'Kaifeng', 'hn'],
  M: ['jinan', 'Jinan', 'hn'],
  n: ['changan', 'Chang’an', 'hn'],
  u: ['urgench', 'Urgench', 'tx'],
  b: ['bukhara', 'Bukhara', 'tx'],
  s: ['samarkand', 'Samarkand', 'tx'],
  o: ['otrar', 'Otrar', 'tx'],
  m: ['merv', 'Merv', 'kh'],
  p: ['nishapur', 'Nishapur', 'kh'],
  h: ['herat', 'Herat', 'kh'],
  l: ['balkh', 'Balkh', 'kh'],
};

export const TERRAIN = {
  O: 'steppe', // the grass of the steppe, from Mongolia to the Syr Darya
  E: 'steppe',
  K: 'steppe',
  I: 'steppe',
  L: 'steppe',
  T: 'steppe',
  Q: 'steppe',
  R: 'steppe',
  o: 'steppe',
  W: 'steppe',
  Y: 'spruce', // the taiga of the Kirghiz and the forests of the Jurchen
  N: 'spruce',
  V: 'mountains', // the Altai, the Tian Shan, the Hindu Kush and the hills of Shanxi and Persia
  B: 'mountains',
  U: 'mountains',
  s: 'mountains',
  p: 'mountains',
  h: 'mountains',
  l: 'mountains',
  n: 'mountains',
  S: 'desert', // the Taklamakan, the Gobi of the Tangut, the Karakum and the Kyzylkum
  C: 'desert',
  G: 'desert',
  H: 'desert',
  X: 'desert',
  Z: 'desert',
  D: 'desert',
  u: 'desert',
  b: 'desert',
  m: 'desert',
  J: 'forest', // the farmland of northern China
  P: 'forest',
  A: 'forest',
  F: 'forest',
  M: 'forest',
};

export const SEA = [
  ['J', 'M'], // Liaoyang to Shandong over the Bohai strait
];

// Drawn, not played: the Orkhon, the Kerulen, the Yellow River, the Tarim, the Amu Darya and the Syr
// Darya, the yurt carts, a caravan and an archer (tools/grids/genghis.mjs, in map units).
export const RIVERS = [[[214.77,52],[218.48,50],[221.09,43.5],[231.12,37],[232.23,31.5],[231.49,25]],[[240.78,44.5],[247.84,49.5],[260.1,47],[267.53,44],[272.36,41.5]],[[210.31,113],[222.2,106],[227.4,98.5],[232.98,89],[237.81,83],[248.95,84.5],[247.47,93],[246.72,108],[246.72,112.5],[256.38,112],[261.96,111.5],[271.99,114.5],[278.68,117],[283.14,116]],[[123.73,94],[135.62,83.5],[148.63,81],[157.92,82],[169.07,84.5]],[[105.9,101],[89.18,100],[86.58,100],[78.77,97],[72.83,90.5],[66.88,83],[61.68,78.5],[57.97,73.5],[55.74,68]],[[106.27,82],[95.12,84.5],[92.15,81.5],[90.29,71.75],[79.89,62],[68.74,57],[64.65,56]]];
export const CARAVANS = [[230.37,48],[193.22,53],[260.1,57]];
export const SIGHTS = [[152.34,88,"caravan"],[232.23,64.5,"archer"]];
export const CARAVAN = 'gers';

// Region missions: about 7–9 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['mo', 'nm'], plusOne: true },
  { type: 'regions', regions: ['xx', 'tm'] },
  { type: 'regions', regions: ['hb', 'hn'], plusOne: true },
  { type: 'regions', regions: ['ma', 'hb'], plusOne: true },
  { type: 'regions', regions: ['tx', 'kh'] },
  { type: 'regions', regions: ['kk', 'tx'], plusOne: true },
  { type: 'regions', regions: ['tm', 'nm'], plusOne: true },
  { type: 'regions', regions: ['xx', 'hn'] },
];

// Where the region names and the compass go. A name may sit on unexplored land.
export const REGION_PLACES = { mo: [245.7, 32.5], nm: [160.55, 16], kk: [120.3, 47.5], tm: [152.5, 103.5], xx: [203.55, 103.5], ma: [311.25, 82.5], hb: [292, 94.5], hn: [255.5, 123], tx: [54.35, 58], kh: [90.15, 115.5] };
export const COMPASS = [300, 135, 2.2];
export const SHIP = 'junk'; // a Jin river and coast junk with battened sails
export const OCEANS = [[72, 170], [80, 172], [46, 10]];
export const LANDMARKS = [[189.5, 8.5, 'Sibirien'], [66.9, 38.5, 'Kiptjak-steppen'], [22.3, 16, 'Rus'], [10, 76, 'Georgien'], [33.4, 121, 'Persien'], [83.6, 123.5, 'Ghuriderne'], [120.8, 138.5, 'Indien'], [163.5, 123.5, 'Tibet'], [240, 136, 'Song-riget'], [310.3, 98.5, 'Korea']];

// Rules that differ from the modern rules on this map, measured with npm run balance -- genghis: seats
// 51/49, 35/31/34 and 27/28/20/25 with 2, 3 and 4 players; easy computer players start with 10% fewer
// armies, so a medium bot standing in for a player wins 96%/83% against two/three of them.
export const RULES = { laterSeatArmies: { 2: 7, 3: 2, 4: 1, 5: 0, 6: 0 }, noviceHandicap: 0.1 };

// The flavour of the age: the computer players' names and what the winner becomes.
export const RULERS = ['Kejser Zhangzong', 'Li Anquan', 'Muhammad II', 'Kuchlug', 'Yelü Zhilugu', 'Jalal ad-Din'];
export const TITLE = 'Khan of Khans';

// The names in English, where they differ (see inLanguage in index.js).
export const EN = {
  name: 'Genghis Khan',
  REGIONS: { mo: 'Mongolia', ma: 'Manchuria', tx: 'Transoxiana' },
  TERRITORIES: { irtysh: 'Irtysh', yenisei: 'Yenisei' },
  LANDMARKS: { Sibirien: 'Siberia', 'Kiptjak-steppen': 'The Kipchak Steppe', Rus: 'Rus’', Georgien: 'Georgia', Persien: 'Persia', Ghuriderne: 'The Ghurids', Indien: 'India', 'Song-riget': 'Song China' },
  RULERS: ['Emperor Zhangzong', 'Li Anquan', 'Muhammad II', 'Kuchlug', 'Yelü Zhilugu', 'Jalal ad-Din'],
};

export const GENGHIS_GRID = hexMap({
  id: 'genghis',
  name: 'Djengis Khan',
  GRID,
  REGIONS,
  TERRITORIES,
  TERRAIN,
  SEA,
  RIVERS,
  CARAVANS,
  CARAVAN,
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
export const GENGHIS = GENGHIS_GRID.MAP;
