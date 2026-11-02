// Songhai, 1468: Sunni Ali takes Timbuktu from the Tuareg and makes Songhai the great power of West
// Africa, against old Mali, the Mossi kings and the Tuareg of the Sahara, between the salt of the
// desert and the gold of the south. The map shows Morocco, Fezzan, the Pepper Coast and Cameroon round
// it, and the Niger, the river everything turns on. 30 territories in 10 regions, drawn as a hex grid
// (see hex.js for what each part means). The coastlines are real (tools/make-grid.mjs); land outside
// the campaign is '#', drawn as unexplored.

import { hexMap } from './hex.js';

export const GRID = [
  '.........................######################################################################################',
  '........................#######################################################################################',
  '.............#..........#######################################################################################',
  '............#.........#########################################################################################',
  '.....#......#........##########################################################################################',
  '...##......#.......############################################################################################',
  '.......#........###############################################################################################',
  '...............################################################################################################',
  '...............################################################################################################',
  '..............#################################################################################################',
  '..............#################################################################################################',
  '.............##################################################################################################',
  '............###################################################################################################',
  '...........#######################XXX##########################################################################',
  '...........######################XXXXXXXX######################################################################',
  '..........######################XXXXXXXXXXXX###################################################################',
  '..........#####################XXXXXXXXXXXXXXXXX###############################################################',
  '..........###################XXXXXXXXXXXXXXXXXXXXX#############################################################',
  '..........###################XXXXXXXXXXXXXXXXXXXXXXXX##########################################################',
  '.........####################XXXXXXXXXXXXXXXXXXXXXXXX##########################################################',
  '........######################XXXXXXXXXXXXXXXXXXXXXXXX#########################################################',
  '.......#######################XXXXXXXXXXXXXXXXXXXXXXXX#########################################################',
  '.......########################XXXXXXXXXXXXXXXXXXXXXXXX########################################################',
  '......########################XXXXXXXXXXXXXXXXXXXXXXXXEEEEEE###################################################',
  '......#########################XXXXXXXXXXXXXXXXXXXXXXXEEEEEEE##################################################',
  '.....##########################XXXXXXXXXXXXXXXXXXXXXXEEEEEEEEE#################################################',
  '.....###########################XXXXXXXXXXXXXXXXXXXAAAEEEEEEEEE################################################',
  '.....###########################XXXXXXXXXXXXXXXXXAAAAEEEEEEEEEEE###############################################',
  '....#############################XXXXXXXXXXXXXXXAAAAAAEEEEEEEEEEE##############################################',
  '...##############################XXXXXXXXXXXXXAAAAAAAEEEEEEEEEEEEE#############################################',
  '...###############################XXXXXXXXXXXAAAAAAAAAEEEEEEEEEEEEE############################################',
  '...###############################XXXXXXXXXAAAAAAAAAAEEEEEEEEEEEEEEE###########################################',
  '...################################XXXXXXAAAAAAAAAAAAEEEEEEEEEEEEEEEE##########################################',
  '..#################################XXXXAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEE#########ZZZZ############################',
  '....################################XXAAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEE#######ZZZZZZZZ#########################',
  '.....###############################AAAAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEE###ZZZZZZZZZZZZ########################',
  '......##############################AAAAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEZZZZZZZZZZZZZZ#######################',
  '.....#############################WWAAAAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEZZZZZZZZZZZZZZZ#######################',
  '.....##########################WWWWWWAAAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEZZZZZZZZZZZZZZZZ######################',
  '....########################WWWWWWWWWAAAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEZZZZZZZZZZZZZZZZZ######################',
  '......FFF################WWWWWWWWWWWWAAAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEZZZZZZZZZZZZZZZZZ#####################',
  '.....FFFFFFFFF########WWWWWWWWWWWWWWWAAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEZZZZZZZZZZZZZZZZZZ#####################',
  '......FFFFFFFFFFFFFFWWWWWWWWWWWWWWWWWWAAAAAAAAAAAAAAAEEEEEEEEEEEEEEEEEEEZZZZZZZZZZZZZZZZZZZ##################mm',
  '......FFFFFFFFFFFFFFWWWWWWWWWWWWWWWWWWAAAAAAAAAABBBBGGGEEEEEEEEEEEEEEEEZZZZZZZZZZZZZZZZZZZZZ##############mmmmm',
  '......CFFFFFFFFFFFFFFWWWWWWWWWWWWWWWWWWAAAABBBBBBBBBBGGGGGGGEEEEEEEEEEEEZZZZZZZZZZZZZZZZZZZZZ############mmmmmm',
  '......FFFFFFFFFFFFFFFWWWWWWWWWWWWWWWWWWBBBBBBBBBBBBBGGGGGGGGGGGGEEEEEEEZZZZZZZZZZZZZZZZZZZZZZ#########mmmmmmmmm',
  '......CFFFFFFFFFFFFFFWWWWWWWWWWWWWWWWWWBBBBBBBBBBBBBBGGGGGGGGGGGGGGGEEEZZZZZZZZZZZZZZZZZZZZZZZ#######mmmmmmmmmm',
  '.....CCFFFFFFFFFFFFFFWWWWWWWWWWWWWWWWWBBBBBBBBBBBBBBGGGGGGGGGGGGGGGGGGZZZZZZZZZZZZZZZZZZZZZZZZ####mmmmmmmmmmmmm',
  '.....CCCFFFFFFFFFFFFFFWWWWWWWWWWWWWWWWWBBBBBBBBBBBBBBGGGGGGGGGGGGGGGGGGZZZZZZZZZZZZZZZZZZZZZZZZ##mmmmmmmmmmmmmm',
  '.....CCCFFFFFFFFFFFFFFWWWWWWWWWWWWWWWWBBBBBBBBBBBBBBHGGGGGGGGGGGGGGGGGTZZZZZZZZZZZZZZZZZZZZZZZZmmmmmmmmmmmmmmmm',
  '.....CCCFFFFFFFFFFFFFFWWWWWWWWWWWWWWWWBBBBBBBBBBBBBBHHHGGGGGGGGGGGGGGTTTZZZZZZZZZZZZZZZZZZZZZZnmmmmmmmmmmmmmmmm',
  '....CCCCFFFFFFFFFFFFFFWWWWWWWWWWWWWWWJJBBBBBBBBBBBBHHHHGGGGGGGGGGGGTTTTTZZZZZZZZZZZZZZZZZZZZZnnmmmmmmmmmmmmmmmm',
  '.....CCCCFFFFFFFFFFFFFMMWWWWWWWWWWWWJJJJJBBBBBBBBBBHHHHHGGGGGGGGGGTTTTTTTZZZZZZZZZZZZZZZZZZZnnnnmmmmmmmmmmmmmmm',
  '....CCCCCFFFFFFFFFFFMMMMMWWWWWWWWWWJJJJJJJBBBBBBBBHHHHHHGGGGGGGTTTTTTTTTQQQQZZZZZZZZZZZZZZZnnnnnmmmmmmmmmmmmmmm',
  '....CCCCCCFFFFFFFFFFMMMMMMMWWWWWWSSJJJJJJJJbbbbbbbHHHHHHHHGGGGTTTTTTTTTTTQQQQQQQZZZZZZZZZZnnnnnnnmmmmmmmmmmmmmm',
  '...CCCCCCFFFFFFFFFMMMMMMMMMMWWSSSSSJJJJJJJJbbbbbbbHHHHHHHHGGTTTTTTTTTTTTQQQQQQQQQQQZZZZZnnnnnnnnnmmmmmmmmmmmmmm',
  '...CCCCCCLFFFFFFFFMMMMMMMMMMMSSSSSSSJJJJJJJJbbbbbbHHHHHHHHHTTTTTTTTTTTTTQQQQQQQQQQQQQQQQnnnnnnnnnnmmmmmmmmmmmmm',
  '..CCCCCLLLLFFFFFMMMMMMMMMMMMSSSSSSSSJJJJJJJJbbbbbbHHHHHHHHTTTTTTTTTTTTTTQQQQQQQQQQQQQQQnnnnnnnnnnnmmmmmmmmmmmmm',
  '...CCLLLLLLLLFFFMMMMMMMMMMMMMSSSSSSSSJJJJJJJbbbbbbYYHHHHHHTTTTTTTTTTTTTTQQQQQQQQQQQQQQQQnnnnnnnnnnnmmmmmmmmmmmm',
  '...LLLLLLLLLLFMMMMMMMMMMMMMMSSSSSSSSSJJJJJJJbbbbbYYYYHHHHTTTTTTTTTTTTTTTQQQQQQQQQQQQQQQnnnnnnnnnnnnmm...mmmmmmm',
  '....LLLLLLLLLLMMMMMMMMMMMMMMMSSSSSSSSSJJJJJJJbbbbYYYYYYHHHTTTTTTTTTTTTTTQQQQQQQQQQQQQQQRnnnnnnnnnnnnm.....mmmmm',
  '....LLLLLLLLLkMMMMMMMMMMMMMMSSSSSSSSSSJJJJJJJbbbYYYYYYYYHTTTTTTTTTTTTTDDQQQQQQQQQQQQQQRRnnnnnnnnnnnn......mmmmm',
  '.....LLLLLLLkkkMMMMMMMMMMMMMSSSSSSSSSSSJJJJJJbbYYYYYYYYYOOTTTTTTTTTTTDDDDQQQQQQQQQQQQRRRRnnnnnnnnnnn.......mmm#',
  '...LLLLLLLkkkkkMMMMMMMMMMMMMSSSSSSSSSSSJJJJJJbYYYYYYYYOOOOTTTTTTTTTDDDDDDQQQQQQQQQQQRRRRRnnnnnnnnnnn......#####',
  '....LLLLkkkkkkkkMMMMMMMMMMMNNSSSSSSSSSSSJJJJJJYYYYYYYOOOOOKTTTTTTTDDDDDDDDQQQQQQQQQQRRRRRRnnnnnnnnnn......#####',
  '...LLLkkkkkkkkkkMMMMMMMMMMNNNSSSSSSSSSSSJJJJJYYYYYYOOOOOOKKKKTTTDDDDDDDDDQQQQQQQQQQRRRRRRRnnnnnnnnnn.....######',
  '....LkkkkkkkkkkkMMMMMMMMMNNNNNNSSSSSSSSSJJJJJYYYYYOOOOOOOKKKKKKTDDDDDDDDDDQQQQQQQQQRRRRRRRRnnnnnnnnnnn#########',
  '.....kkkkkkkkkkkMMMMMMMMNNNNNNNSSSSSSSSSJJJJJYYYOOOOOOOOKKKKKKKDDDDDDDDDDDQQQQQQQQRRRRRRRRRnnnnnnnnnn##########',
  '.......kkkkkkkkkkMMMMMMMNNNNNNNNNSSSSSSSSJJJJYYOOOOOOOOOOKKKKKKKDDDDDDDDDDDQQQQQQQRRRRRRRRRRnnnnnnnnn##########',
  '........kkkkkkkkkMMMMMNNNNNNNNNNNSSSSSSSSJJJYOOOOOOOOOOOKKKKKKKDDDDDDDDDDDDQQQUUURRRRRRRRRRnnnnnnnn############',
  '........kkkkkkkkkkMMMMNNNNNNNNNNNNSSSSSSSSJJJOOOOOOOOOOOKKKKKKKKDDDDDDDDDDDDUUUUUUURRRRRRRRRnnnnnnn############',
  '........kkkkkkkkkkMMNNNNNNNNNNNNNNNSSSSSSSJJOOOOOOOOOOOKKKKKKKKDDDDDDDDDDDDUUUUUUUUURRRRRRRRnnnnn##############',
  '...........kkkkkk####NNNNNNNNNNNNNNNSSSSSSSJOOOOOOOOOOOKKKKKKKKKDDDDDDDDDDDUUUUUUUUUURRRRRRRRnnnn##############',
  '..........kkkkk######NNNNNNNNNNNNNNNNSSSSSgggOOOOOOOOOKKKKKKKKKKDDDDDDDDDDUUUUUUUUUUUURRRRRRRnn################',
  '...........kkk########NNNNNNNNNNNNNNNNSSSSgggggggOOOOOKKKKKKKKKKDDDDDDDDDDDUUUUUUUUUUUURRRRRR##################',
  '............##########NNNNNNNNNNNNNNNNSSggggggggggggOKKKKKKKKKKKDDDDDDDDDiUUUUUUUUUUUUUURRR####################',
  '..............#########NNNNNNNNNNNNNNNNNggggggggggggggKKKKKKKKKKDDDDDDDiiiiUUUUUUUUUUUUUURR####################',
  '..............#########NNNNNNNNNNNNNNNNgggggggggggggggKKKKKKKKKKDDDiiiiiiiiUUUUUUUUUUUUUU######################',
  '...............##########NNNNNNNNNNNNN#gggggggggggggggggKKKKKKKKKiiiiiiiiiiiUUUUUUUUUUUUU######################',
  '...............##############NNNNNNN###gggggggggggggggggKKKKKKKiiiiiiiiiiiiiiUUUUUUUUUUU#######################',
  '...............#########################ggggggggggggggggggKKKKKiiiiiiiiiiiiiiiUUUUUUUUUU#######################',
  '...............#########################ggggggggggggggggggKKKKiiiiiiiiiiiiiiiiUUUUUUUUU########################',
  '................#########################gggggggggggggggggggKKiiiiiiiiiiiiiiiieeUUUUUUU########################',
  '................#########################gggggggggggggggggggiiiiiiiiiiiiiiiiieeeeeUUUU#########################',
  '..................########################gggggggggggggggggggiiiiiiiiiiiiiiiieeeeeeeeU#########################',
  '.................#########################ggggggggggggggggggiiiiiiiiiiiiiiieeeeeeeeee##########################',
  '....................#######################ggggggggggggggggggiiiiiiiiiiiiiieeeeeeeeee##########################',
  '....................#######################gggggggggggggggggiiiiiiiiiiiiiieeeeeeeeeee##########################',
  '......................######################gggggggggggggggggiiiiiiiiiiiieeeeeeeeeeee##########################',
  '.......................#####################ggggggggggggggggiiiii......ieeeeeeeeeeee###########################',
  '.........................####################ggggggggggggggggi...........eeeeeeeeeee###########################',
  '.........................####################ggggggggggggggg.............eeeeeeeeeee###########################',
  '...........................###################ggggggggggg..................eeeeeeeee###########################',
  '...........................###################ggggggggg...................eeeeeeeee############################',
  '............................###########.........ggggg......................eeeeeeeee###########################',
  '.............................#######..............g........................eeeeeeee############################',
  '................................###.........................................eeeee.e...#########################',
  '......................................................................................#########################',
];

// The lands of the 1460s, so no region shares its name with one of its territories.
export const REGIONS = {
  so: 'Songhai',
  nb: 'Nigerbuen',
  nd: 'Nigerdeltaet',
  mo: 'Mossi',
  ma: 'Mali',
  jo: 'Jolof',
  sa: 'Sahara',
  ha: 'Hausalandet',
  bo: 'Bornu',
  gu: 'Guineakysten',
};

// letter: [id, name, region]. Royal towns, caravan towns, salt and gold.
export const TERRITORIES = {
  G: ['gao', 'Gao', 'so'],
  T: ['tillaberi', 'Tillabéri', 'so'],
  D: ['dendi', 'Dendi', 'so'],
  B: ['timbuktu', 'Timbuktu', 'nb'],
  A: ['arawan', 'Arawan', 'nb'],
  H: ['hombori', 'Hombori', 'nb'],
  J: ['jenne', 'Jenné', 'nd'],
  S: ['segou', 'Ségou', 'nd'],
  b: ['bandiagara', 'Bandiagara', 'nd'],
  Y: ['yatenga', 'Yatenga', 'mo'],
  O: ['ouagadougou', 'Ouagadougou', 'mo'],
  K: ['tenkodogo', 'Tenkodogo', 'mo'],
  N: ['niani', 'Niani', 'ma'],
  M: ['bambuk', 'Bambuk', 'ma'],
  k: ['kaabu', 'Kaabu', 'ma'],
  C: ['kayor', 'Kayor', 'jo'],
  F: ['futatoro', 'Futa Toro', 'jo'],
  L: ['saloum', 'Saloum', 'jo'],
  X: ['taghaza', 'Taghaza', 'sa'],
  W: ['walata', 'Walata', 'sa'],
  E: ['tadmekka', 'Tadmekka', 'sa'],
  Z: ['agadez', 'Agadez', 'sa'],
  Q: ['katsina', 'Katsina', 'ha'],
  R: ['kano', 'Kano', 'ha'],
  U: ['zaria', 'Zaria', 'ha'],
  n: ['ngazargamu', 'Ngazargamu', 'bo'],
  m: ['kanem', 'Kanem', 'bo'],
  g: ['begho', 'Begho', 'gu'],
  i: ['ife', 'Ife', 'gu'],
  e: ['benin', 'Benin', 'gu'],
};

export const TERRAIN = {
  X: 'desert', // the Sahara
  A: 'desert',
  E: 'desert',
  W: 'desert',
  B: 'desert',
  G: 'desert',
  m: 'desert',
  Z: 'mountains', // the Aïr
  H: 'mountains', // the Hombori mountains
  b: 'mountains', // the cliffs of Bandiagara
  T: 'savanna',
  D: 'savanna',
  S: 'savanna',
  Y: 'savanna',
  O: 'savanna',
  K: 'savanna',
  N: 'savanna',
  M: 'savanna',
  F: 'savanna',
  C: 'savanna',
  L: 'savanna',
  Q: 'savanna',
  R: 'savanna',
  U: 'savanna',
  n: 'savanna',
  k: 'oak', // the rainforest
  g: 'oak',
  i: 'oak',
  e: 'oak',
};

// No sea routes: Songhai went by river and desert.
export const SEA = [];

// Drawn, not played: the Niger (first, with the boats), the Bani, the Benue, the Senegal and the
// Gambia, and the salt caravans (tools/grids/songhai.mjs, in map units).
export const RIVERS = [[[41.04,118.12],[44.92,111.19],[48.8,105.42],[53.24,100.81],[55.46,98.21],[60.45,96.19],[65.16,93.6],[69.88,91],[73.76,88.69],[76.81,87.25],[77.09,83.5],[78.75,79.46],[81.52,75.42],[85.4,74.56],[91.5,74.56],[97.61,73.4],[99.27,76],[99.82,77.44],[102.6,81.19],[104.81,85.23],[107.86,89.27],[111.47,93.31],[113.13,96.19],[116.46,100.23],[118.96,102.83],[122.01,108.31],[125.33,113.5],[126.61,118.4],[131.71,120.71],[135.32,121.58],[137.2,126.19],[137.26,130.81],[137.42,135.71],[135.87,140.62],[133.65,145.81]],[[61,107.73],[66.55,101.96],[72.65,94.46],[74.87,90.42],[76.81,87.25]],[[174.14,117.54],[168.87,117.83],[154.17,122.73],[147.18,126.6],[137.2,126.19]],[[37.16,108.88],[41.04,100.81],[39.93,91.58],[36.38,87.83],[30.78,85.23],[26.34,80.9],[22.74,77.73],[16.86,75.13],[13.86,76],[8.32,78.88]],[[30.5,97.92],[26.06,95.04],[21.07,92.44],[13.86,93.31],[7.76,93.6]]];
export const RIVER_BOATS = 2;
export const CARAVANS = [[74.31,50.04],[44.37,63.88],[125.33,61.58]];

// Region missions: about 8–9 territories each; the small ones need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['nb', 'nd', 'so'] },
  { type: 'regions', regions: ['ma', 'jo', 'nd'] },
  { type: 'regions', regions: ['sa', 'nb'], plusOne: true },
  { type: 'regions', regions: ['ha', 'bo', 'so'] },
  { type: 'regions', regions: ['mo', 'gu', 'so'] },
  { type: 'regions', regions: ['ma', 'mo'], plusOne: true },
  { type: 'regions', regions: ['ha', 'gu', 'nd'] },
];

// Where the region names and the compass go. A name may sit on unexplored land.
export const REGION_PLACES = { so: [113, 85], nb: [84.1, 70], nd: [66.75, 86.5], mo: [93.4, 101.5], ma: [35.35, 102], jo: [17.4, 82], sa: [98.45, 57], ha: [138.5, 87.6], bo: [172.4, 86.5], gu: [114.75, 130.5] };
export const COMPASS = [20, 140, 1.3];
export const SHIP = 'caravel'; // the Portuguese, sailing down the coast in the 1460s
export const OCEANS = [[45, 2], [72, 6], [94, 40]];
export const LANDMARKS = [[55.5, 7.3, 'Marokko'], [166.4, 24.1, 'Fezzan'], [47.1, 130.8, 'Peberkysten'], [163.6, 133.7, 'Kamerun'], [179.2, 95, 'Tchadsøen']];

// Rules that differ from the modern rules on this map.
export const RULES = { laterSeatArmies: { 2: 7, 3: 2, 4: 1, 5: 0, 6: 0 }, noviceHandicap: 0.3 };

// The flavour of the age: the computer players' names and what the winner becomes.
export const RULERS = ['Mansa Mahmud', 'Nasere', 'Akil ag Malwal', 'Ewuare', 'Ali Gaji', 'Muhammad Rumfa'];
export const TITLE = 'Ruler of the Niger';

// The names in English, where they differ (see inLanguage in index.js).
export const EN = {
  name: 'Songhai',
  REGIONS: { nb: 'The Niger Bend', nd: 'The Inland Delta', ha: 'Hausaland', gu: 'The Guinea Coast' },
  TERRITORIES: {},
  LANDMARKS: { Marokko: 'Morocco', Peberkysten: 'The Pepper Coast', Kamerun: 'Cameroon', Tchadsøen: 'Lake Chad' },
};

export const SONGHAI_GRID = hexMap({
  id: 'songhai',
  name: 'Songhai',
  GRID,
  REGIONS,
  TERRITORIES,
  TERRAIN,
  SEA,
  RIVERS,
  RIVER_BOATS,
  CARAVANS,
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
export const SONGHAI = SONGHAI_GRID.MAP;
