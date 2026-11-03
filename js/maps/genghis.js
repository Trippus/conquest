// Djengis Khan, 1206: Temüjin has united the tribes of the steppe and been proclaimed Genghis Khan.
// South and west of him lie the Tangut kingdom of Xi Xia, the Jurchen Jin in northern China, the Kara
// Khitai and the Uyghur oases of the Tarim, and the sultan of Khwarazm in Transoxiana and Khorasan.
// The map shows Asia from the Black Sea to Japan, with the Kipchak steppe, Persia, Arabia, India,
// Tibet, Song China, Korea and Siberia round it, the Aral Sea and Lake Baikal, yurts on their carts, a
// caravan on the Silk Road and a mounted archer. 35 territories in 10 regions, drawn as a hex grid (see hex.js for what each part
// means). The coastlines are real (tools/make-grid.mjs); land outside the campaign is '#', drawn as
// unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '##########################################################################################################################################################################################################################.....................',
  '#########################################################################################################################################################################################################################......................',
  '#########################################################################################################################################################################################################################......................',
  '#######################################################################################################################################################################################################################........................',
  '##########################################################################################################################################################...##########################################################........................',
  '#########################################################################################################################Y###############################...#########################################################..........................',
  '########################################################################################################################YYY##############################...########################################################...........................',
  '######################################################################################################################YYYYY##############################...######################################################.....#.......................',
  '####################################################################################################################YYYYYYY##############################...########################################################.#.........................',
  '##################################################################################################################YYYYYYYYY############################....###########################################################............#............',
  '#################################################################################################################YYYYYYYYYYYY###########################...###########################################################.#..###..................',
  '###############################################################################################################YYYYYYYYYYYYYY#########################....#############################################################..#####....#............',
  '##############################################################################################################YYYYYYYYYYYYYYYYY#######################...######################################################################..###...........',
  '###########################################################################################################YYYYYYYYYYYYYYYYYYYY######################...#######################################################################.####...........',
  '########################################################################################################IIYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY###########....########################################################################.###...........',
  '####################################################################################################IIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY##########...#########################################################################.###............',
  '####################################################################################################IIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYKKKKKKKK....##########################################################################.###...........',
  '##################################################################################################IIIIIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYKKKKKK....KK#########################################################################.###............',
  '##################################################################################################IIIIIIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYYYYKKKKK....KKKK########################################################################..###...........',
  '#################################################################################################IIIIIIIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYYKKKKKKKKKKKKKK########################################################################...###...........',
  '################################################################################################IIIIIIIIIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYYKKKKKKKKKKKKKKK##########################################N############################....###..........',
  '###############################################################################################IIIIIIIIIIIIIIIYYYYYYYYYYYYYYYYYYYYYYYYYKKKKKKKKKKKKKKKK######################################NNNNNN###########################...###...........',
  '###############################################################################################IIIIIIIIIIIIIIIVVVVVVVYYYYYYYYYYYYYYYYYYKKKKKKKKKKKKKKKKK#######################EE############NNNNNNN##########################...####..........',
  '#############################################################################################IIIIIIIIIIIIIIIIIVVVVVVVVYYYYYYVVYYYYYYYKKKKKKKKKKKKKKKKKK#####OOOOOOOOO#######EEEEE###########NNNNNNNNN########################N...####..........',
  '#############################################################################################IIIIIIIIIIIIIIIIIVVVVVVVVVVYVVVVVVVYYYYYKKKKKKKKKKKKKKKKKKKOOOOOOOOOOOOOE#####EEEEEEE##########NNNNNNNNNNN#################NNNNNN....####.........',
  '#############################################################################################IIIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVYYYYKKKKKKKKKKKKKKKKKKKOOOOOOOOOOOOOEEEEEEEEEEEEEE##########NNNNNNNNNNN###########NNNNNNNNNNNN...#####.........',
  '##############################################################################################IIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVYYKKKKKKKKKKKKKKKKKKKOOOOOOOOOOOOOOEEEEEEEEEEEEEE########NNNNNNNNNNNNNN###NNNNNNNNNNNNNNNNNN...###...........',
  '#############################################################################################IIIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEE######NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN....##............',
  '##############################################################################################IIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEE####NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN....##............',
  '##############################################################################################IIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKKOOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEE##NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.....#.............',
  '###############################################################################################IIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKKOOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN...................',
  '###########################################################o##################################LIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN......#.............',
  '#########################################################oooo###############################LLLLIIIIIIIIIIIIIIIVVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKOOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN......##............',
  '##..###################################################ooooo####################TTT#######LLLLLLIIIIIIIIIIIIIISSVVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEEEQNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.......##............',
  '...##########################......##################oooooooo##################....TT###LLLLLLLLLIIIIIIIIIIIIIISSSVVVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEEEQQNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.......###...........',
  '.#########################........#################ooooooooooo################TT......L...LLLLLLLIIIIIIIIIIIIISSSSSSVVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEEEQQQNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.......##.............',
  '...#######################.........############.....oooooooooooo##############TTTTTTT....LLLLLLLLLIIIIIIIIIIIISSSSSSSVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKOOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEEQQQQQNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN........#.............',
  '.#######################..........############......oooooooooooo############TTTTTTTTTTLLLLLLLLLLLLIIIIIIIIIIISSSSSSSSVVVVVVVVVVVVVVVVVVKKKKKKKKKKKKOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEEQQQQQQQNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.......................',
  '.#######################..........############.......ooooooooooooo#####oTTTTTTTTTTTTTTLLLLLLLLLLLLLIIIIIIIIIISSSSSSSSSVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKOOOOOOOOOOOOOOEEEEEEEEEEEEEEEEQQQQQQQQQNNNNNNNNNNNNNNNNNNNNNNNNNNNN........................',
  '######################........##############u........oooooooooooooooooooTTTTTTTTTTTTLLLLLLLLLLLLLLLIIIIIIIIISSSSSSSSSSVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKOOOOOOOOOOOOOEEEEEEEEEEEEEEEEQQQQQQQQQQNNNNNNNNNNNNNNNNNNNNNNNNNNN..........#............##',
  '######################......#.###########uuuuu.......oooooooooooooooooooTTTTTTTTTTTTLLLLLLLLLLLLLLLLIIIIIIIISSSSSSSSSSVVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKOOOOOOOOOOOOOEEEEEEEEEEEQQQQQQQQQQQQQQNNNNNNNNNNNNNNNNNNNNNNNNNNN...........#...........#.',
  '.####################.........########uuuuuuu........oooooooooooooooooooTTTTTTTTTTTLLLLLLLLLLLLLLLLLIIIIIISSSSSSSSSSSSVVVVVVVVVVVVVVVVKKKKKKKKKKKKKKKOOOOOOOOOOOOOEEEEEEEEEEQQQQQQQQQQQQQQQNNNNNNNNNNNNNNNNNNNNNNNNNN...........###............',
  '...##################.......#######uuuuuuuuuuu.......ooooooooooooooooooooTTTTTTTTTTLLLLLLLLLLLLLLLLLLIIIIISSSSSSSSSSSSSSSSSSSVVVVVVVVVKKKKKKKKKKKKKKKKOOOOOOOOOOOOEEEEEEEEEEQQQQQQQQQQQQQQQQJNNNNNNNNNNNNNNNNNNNNNNN.............###......#....',
  '....##################.......###uuuuuuuuuuuuuu......oooooooooooooooooooooTTTTTTTBBLLLLLLLLLLLLLLLLLLLIIIISSSSSSSSSSSSSSSSSSSSVVVVVVVVZKKKKKKKKKKKKKKKOOOOOOOOOOOOOEEEEEEEEEQQQQQQQQQQQQQQQQJJJNNNNNNNNNNNNNNNNNNNNN.............#####..#.......',
  '.....#################........##uuuuuuuuuuuuuuu.....oooooooooooooooooooooTTTTTTTBBBLLLLLLLLLLLLLLLLLLCCCSSSSSSSSSSSSSSSSSSSSSSDDDVVVZZZZKKKKKKKKKKKKKKOOOOOOOOOOOOOREEEEEEEQQQQQQQQQQQQQQQQJJJJJJNNNNNNNNNNNNNNNNNN.............########...#...',
  '......################........##uuuuuuuuuuuuuuuuuuuuuoobboooooooooooooooTTTTTTTBBBBBLLLLLLLLLLLLLLLCCCCCSSSSSSSSSSSSSSSSSSSSSDDDDDDZZZZZZKKKKKKKKKKKKOOOOOOOOOOOOORRRRRRRRQQQQQQQQQQQQQQQQJJJJJJJNNNNNNNNNNNNNNNNN.............#########.......',
  '.......################........#uuuuuuuuuuuuuuuuuuuuuubbbbbbooooooooooooTTTTTTBBBBBBBBBBBBLLLLLLLLCCCCCCCCSSSSSSSSSSSSSSSSSSSDDDDDDDZZZZZZZKKKKKKKKKKKOOOOOOOOOOORRRRRRRRRRQQQQQQQQQQQQQQQQJJJJJJJNNNNNNNNNNNNNNN.............#.#########......',
  '........##############.........#uuuuuuuuuuuuuuuuuuuuuubbbbbbbboooooooooTTTTTTBBBBBBBBBBBBBLLLLLLCCCCCCCCCCSSSSSSSSSSSSSSSSSSDDDDDDDZZZZZZZZKKKKKKKKKKOOOOOOOOOOORRRRRRRRRRRQQQQQQQQQQQQQQQJJJJJJJNNNNNNNNN..NNN..............########..........',
  '..........#############...........uuuuuuuuuuuuuuuuuuuuubbbbbbbbooooooooTTTTTTTBBBBBB.....BBBLLLLCCCCCCCCCCCSSSSSSSSSSSSSSSSSDDDDDDDDZZZZZZZZKKKKKKKXXXOOOOOOOOORRRRRRRRRRRRPQQQQQQQQQQQQQQJJJJJJJJNNNNNNN....................########..........',
  '.........##############..........uuuuuuuuuuuuuuuuuuuuubbbbbbbbboooooooTTTTTTTBBBBBBB....BBBBLLCCCCCCCCCCCCCSSSSSSSSSSSSSSSSDDDDDDDDZZZZZZZZZKKKKKXXXXXOOOOOOORRRRRRRRRRRRRPPQQQQQQQQQQJJJJJJJJJJJJNNNNNN....................#.....##...........',
  '..........##############.........u..uuuuuuuuuuuuuuuuuubbbbbbbbbboooooooTTTTTTTBBBBBBBBBBBBBGGCCCCCCCCCCCCCCCSSSSSSSSSSSSSSSDDDDDDDDDZZZZZZZZZKKXXXXXXXXXOOOOORRRRRRRRRRRRRPPPQQQQQQQQJJJJJJJJJJJJJ###NNN.....................##................',
  '..........###############...........uuuuuuuuuuuuuuuuubbbbbbbbbboooooossTTsssssBBBBBBBBBBBGGGGCCCCCCCCCCCCCCCCSSSSSSSSSSSSSDDDDDDDDDZZZZZZZZZZXXXXXXXXXXXOOORRRRRRRRRRRRRRPPPPQQQQQQQJJJJJJJJJJJJ#######......................#.................',
  '.........#################...........uuuuuuuuuuuuuuuubbbbbbbbbbbooosssssssssssBBBBBBBBBBGGGGGGCCCCCCCCCCCCCCCCCCSSSSSSSSSSDDDDDDDDDZZZZZZZZZZZXXXXXXXXXXXXORRRRRRRRRRRRRRPPPPPQQQQQQQJJJJJJJJJJ########........................#...............',
  '#......###################...........uuuuuuuuuuuuuuuubbbbbbbbbbsssssssssssssssBBBBBBBBGGGGGGGGCCCCCCCCCCCCCCCCCCCCHHSSSDDDDDDDDDDDZZZZZZZZZZZXXXXXXXXXXXXXXRRRRRRRRRRRRRPPPPPPQQQQQQJJJJJJJJJ#########.......................#.................',
  '###########################.......uu.uuuuuuuuuuuuuuuubbbbbbbbbsssssssssssssssssBBBBBBBGGGGGGGGGCCCCCCCCCCCCCCCCCCCHHHHDDDDDDDDDDDDZZZZZZZZZZWWWXXXXXXXXXXXXXRRRRRRRRRRRRPPPPPPPQQQQQ..JJJJJJJ##########......................###...............',
  '############################.....#uuuuuuuuuuuuuuuuuubbbbbbbbbsssssssssssssssssBBBBBBBGGGGGGGGGGCCCCCCCCCCCCCCCCCCCHHHHDDDDDDDDDDZZZZZZZZZZZWWWWXXXXXXXXXXXXXRRRRRRRRRRRPPPPPPPQQQQQ...JJJJJJ#########.......................####...............',
  '###########################.......#uuuuuuuuuuuuuuuummbbbbbbbbbsssssssssssssssssBBGGGGGGGGGGGGGGCCCCCCCCCCCCCCCCCCCHHHHHDDDDDDDDDZZZZZZZZZZWWWWWWXXXXXXXXXXXXXRRRRRRRRRRPPPPPPPPQQQQ...JJJJJJJ########........................####..............',
  '##########################.........#uuuuuuuuuuuuummmmbbbbbbbbssssssssssssssssssGGGGGGGGGGGGGGGGCCCCCCCCCCCCCCCCCCHHHHHHDDDDDDDDZZZZZZZZZZZWWWWWWXXXXXXXXXXXXXUUURRRRRRPPPPPPPPPPP....JJJJJJJ######..........................#####..............',
  '##########################.........##uuuuuuuuuuummmmmmmbbbbbbbsssssssssssssssssGGGGGGGGGGGGGGGGHHHHHHHHHHHHHCCCCCHHHHHHDDDDDDDDDZZZZZZZZZZZWWWWWWWXXXXXXXXXXXUUUURRRRRRPPPPPPPPPP....JJJ.....#####...........................####..............',
  '##########################.........##ppuuuuuuummmmmmmmmbbbbbbsssssssssssssssssGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHCCCCHHHHHHHDDDDDDDDZZZZZZZZZZZWWWWWWWXXXXXXXXXXXUUUUURRRRRAPPPPPPPPP.....J.......#####..........................#####..............',
  '##########################..........#ppppuuummmmmmmmmmmbbbbbbsssssssssslllllllGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHCCCHHHHHHHDDDDDDDDDZZZZZZZZZZZWWWWWWXXXXXXXXXXXUUUUUUURAAAAAAAPP........J.......######..........................####..............',
  '#########################...........#pppppmmmmmmmmmmmmmbbbbbbsssssssslllllllllGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHCCHHHHHHHDDDDDDDDDDZZZZZZZZZZWWWWWWXXXXXXXXXXXUUUUUUUUAAAAAAAAP.................######.........................####...............',
  '#########################...........#ppppppmmmmmmmmmmmmmmbbbbssssssslllllllllllGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHHDDDDDDDDDDZZZZZZZZZWWWWWWWXXXXXXXXXXUUUUUUUUUAAAAAAAAP................#######........................####...............',
  '#########################...........#pppppppmmmmmmmmmmmmmbbbsssssssllllllllllllGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHDDDDDDDDDDDZZZZZZZZWWWWWWWXXXXXXXXXXUUUUUUUUUUAAAAAAAAPPP.............########.......................###.................',
  '##########################..........##pppppppmmmmmmmmmmmmmmlllllssllllllllllllllGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHDDDDD######ZZZZZZZWWWWWWWWXXXXXXXXXnnUUUUUUUUAAAAAAAAAMPM...M...........######.....................#####................',
  '##########################..........#ppppppppmmmmmmmmmmmmmllllllllllllllllllllllGGGGGGGGHHHHHHHHHHHHH##HHHHHHHHHHHHHHH############ZZZZZZWWWWWWWWWXXXXXXXXnnnnUUUUUUUAAAAAAMMMMM...MMM...........#####.................#...#####................',
  '#############################.......##ppppppppppmmmmmmmmmmhlllllllllllllllllllllGGGGGGGGHHHHHHHHHHHHH####HHHHH#########################ZWWWWWWWWWWWXXXXXXnnnnnnUUUUUAAAAAAMMMMMM..MMMMMM.........#####................#..######................',
  '#############################......###pppppppppppmmmmmmmmhhllllllllllllllllllll#GGGGGGGHHHHHHHHHHHH#######HHH###########################WWWWWWWWWWWXXXXXnnnnnnUUUUUUAAAAAAMMMMMMMMMMM.M........#######...............#.#######.................',
  '######################################pppppppppppppmmmmmhhhhllllllllllll############GGGHHHHHHHHHHH########################################WWWWWWWWWnnnXXnnnnnnnUUUUUUAAAAAMMMMMMMMMM............######................########.................',
  '######################################pppppppppppppmmmhhhhhhlllllllllll################HHHHHHHHH##########################################WWWWWWWWWnnnnnnnnnnnUUUUUUUAAAAMMMMMMMMMM.............######..............##########.................',
  '######################################ppppppppppppppmhhhhhhhhllllllllll#################HHHHHHHH###########################################WWWWWWWWnnnnnnnnnnnUUUUUUUFAAAMMMMMMMMMM.............#######.............##########.................',
  '######################################ppppppppppppphhhhhhhhhhlllllllll##################HHHHHHHH##########################################WWWWWWWWnnnnnnnnnnnnUUUUUUFFFFAMMMMMMMM...............######..............##########.................',
  '#######################################pppppppppppphhhhhhhhhhhlllllllll####################################################################WWWWWWWnnnnnnnnnnnnFFFFFFFFFFFFMMMMMMM...............######.......#################.................',
  '######################################pppppppppppphhhhhhhhhhhhllllllll######################################################################WWWWWnnnnnnnnnnnnFFFFFFFFFFFFFFMMMMM...............######.......###############.#..................',
  '########################################pppppppppphhhhhhhhhhhhh###############################################################################WWWnnnnnnnnnnnnnFFFFFFFFFFFFFFFMMM................###.#.......##########.##.#....................',
  '########################################ppppppppphhhhhhhhhhhhh#################################################################################nnnnnnnnnnnnnnFFFFFFFFFFFFFFFFFFMM..............#..........#####..#.###.........................',
  '#########################################ppppppppphhhhhhhhhhhh#################################################################################nnnnnnnnnnnnnnnFFFFFFFFFFFFFFFFFFFM#......................###...##..##..........................',
  '#########################################pppppppphhhhhhhhhhhh##################################################################################nnnnnnnnnnnnnnnFFFFFFFFFFFFFFFFFF##......................#..#.####.##...........................',
  '##########################################ppppppphhhhhhhhhhhhh##################################################################################nnnnnnnnnnnnnnFFFFFFFFFFFFFFFFFF###.....................##...####..#...........................',
  '###########################################ppppp#hhhhhhhhhhh###################################################################################nnnnnnnn#nnnn###FF####FFFFFFFFFF####............#......#####.##.................................',
  '############################################ppp####hhhhhhhhh####################################################################################nnnnn####nn###########FFFFFFFFF#####.................#.#####.#.................................',
  '####################################################hhhhhhh####################################################################################nnn####################FFFF###F#####.................#..####....................................',
  '#####################################################hhhhhh#############################################################################################################F############....................##....................................',
  '#####################################################hhhh############################################################################################################################..................###.....................................',
  '#######################################################hh#############################################################################################################################..................###....................................',
  '#######################################################h##############################################################################################################################...................#.....................................',
  '######################################################################################################################################################################################...................#.....................................',
  '######################################################################################################################################################################################.........................................................',
  '####################################################################################################################################################################################...........................................................',
  '###################################################################################################################################################################################............................................................',
  '#########################...##########################################################################################################################################################.........................................................',
  '########################....##########################################################################################################################################################.........................................................',
  '#######################......#########################################################################################################################################################.........................................................',
  '#######################......########################################################################################################################################################..........................................................',
  '########################......########################################################################################################################################################.........................................................',
  '########################......#######################################################################################################################################################..........................................................',
  '#########################......#####################################################################################################################################################...........................................................',
  '#########################......####################################################################################################################################################............................................................',
  '##########################.......##################################################################################################################################################............................................................',
  '##########################.......##################################################################################################################################################............................................................',
  '###########################........######..########################################################################################################################################............................................................',
  '############################........##.#...#######################################################################################################################################.............................................................',
  '############################...............#######################################################################################################################################.............................................................',
  '#############################...........#..######################################################################################################################################..............................................................',
  '############################..#..........#..#####################################################################################################################################..............................................................',
  '############################.##........##.....###################################################################################################################################..............................................................',
  '#############################.#........###..........###.........################################################################################################################.....#.........................................................',
  '###############################.......###......................################################################################################################################.....##.........................................................',
  '.##############################.......####.......................##############################################################################################################.....##.........................................................',
  '.##############################...#..#####.......................############################################################################################################......##....#.....................................................',
  '...#############################.##########......................############################################################################################################......###.........................................................',
  '...##########################################.....................##########################################################################################################......###..........................................................',
  '....###########################################.....................#######################################################################################################.......###..........................................................',
  '...############################################.....................######################################################################################################........##...........................................................',
  '....############################################.......................##################################################################################################.........###..........................................................',
  '....############################################......................#############################################..###############################################.#............##...........................................................',
  '....#############################################....................##############################################...##############################################...............#...........................................................',
  '....############################################.....................######.######################################...#############################################.............................................................................',
  '.....###########################################......................######.###############################..........###################################..#####...............................................................................',
  '....###########################################.......................#####.###############################...........#################################.....##.................................................................................',
  '.....##########################################........................###...##############################...........#################################.....#..................................................................................',
  '.....#########################################..............................###############################...........###############################.......#..................................................................................',
  '......#######################################................................##############################............##############################.......##.................................................................................',
  '.......#####################################................................##############################..............############################.........#.................................................................................',
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

// Drawn, not played: the yurt carts, a caravan and an archer (tools/grids/genghis.mjs, in map units).
// No rivers: on a map this size they drew as loose lines.
export const RIVERS = [];
export const CARAVANS = [[269.39,54],[300.23,53],[238.55,56]];
export const SIGHTS = [[178.35,88,"caravan"],[266.05,63,"archer"]];
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
export const REGION_PLACES = { mo: [271.7, 32.5], nm: [186.6, 16], kk: [146.3, 47.5], tm: [178.5, 103.5], xx: [229.6, 103.5], ma: [337.3, 82.5], hb: [318.0, 94.5], hn: [281.5, 123], tx: [80.4, 58], kh: [116.2, 115.5] };
export const COMPASS = [364, 161, 2.6];
export const SHIP = 'junk'; // a Jin river and coast junk with battened sails
export const OCEANS = [[72, 185], [62, 215], [100, 220], [46, 25]];
export const LANDMARKS = [[215.5, 8.5, 'Sibirien'], [92.9, 38.5, 'Kiptjak-steppen'], [37.2, 16, 'Rus'], [29, 76, 'Georgien'], [26, 121, 'Abbasiderne'], [37.2, 161, 'Arabien'], [63.2, 126, 'Persien'], [109.6, 123.5, 'Ghuriderne'], [152.4, 161, 'Indien'], [189.5, 123.5, 'Tibet'], [237.8, 161, 'Dali'], [289.8, 148.5, 'Song-riget'], [336.3, 98.5, 'Korea'], [377.2, 103.5, 'Japan']];

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
  LANDMARKS: { Abbasiderne: 'The Abbasids', Arabien: 'Arabia', Sibirien: 'Siberia', 'Kiptjak-steppen': 'The Kipchak Steppe', Rus: 'Rus’', Georgien: 'Georgia', Persien: 'Persia', Ghuriderne: 'The Ghurids', Indien: 'India', 'Song-riget': 'Song China' },
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
