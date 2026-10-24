// The modern world map, second draft: 40 territories in 6 regions, drawn as a hex grid.
//
// GRID is the map itself, one letter per hex, '.' is sea. Each column is 5° of longitude
// (column 0 = 170° W, so the Pacific is at the edges) and each row 5° of latitude (row 0 = 80° N).
// Odd rows sit half a hex to the right. To move a border, change letters; to add an island,
// put letters in the sea. Territories that touch on the grid are neighbours; SEA lists the
// crossings over water. A territory may be in more than one piece (Japan, Madagascar, New Zealand).
//
// The division is our own and neutral: geographic areas, not today's countries.
//
// Region bonus: how many of the region's territories can be attacked from outside, plus one per
// three territories, minus one (at least 2). Few ways in and many territories is worth more.
// Bot games tune it later (npm run sim -- 1000 normal,normal,normal world).

export const GRID = [
  '................bbbbb.ggggggggg.........................................',
  '..........bbbbbbbbbbbgggggggggg......................rrrrn..............',
  '.aaaaaabbbbbbbbbqqqq...ggggggg.......sssseeeeerrrrrrrrrrrnnnnnnnnnnnnnn.',
  '.aaaaabbbbbbbbbbq..qqq..ggg.........ssssseeeeerrrrrrrrrrrnnnnnnnnnnnnnn.',
  '..aaaabbbbbbbbbb...qqq...g.........sssssseeeeerrrrrrrrrrrnnnnnnn..n.....',
  '......vvvvbbhhhh...qqq..........ii.ls..eeeeeeerrrrrrrrrrrnnnn.n...n.....',
  '........vvvvhhhhoooooo...........iwwllleeeeeecccccccBBBBBBkknnnn........',
  '........vvvvhhhhoooooo...........wwwuuuu..ee.ccccccccBBBBBkkk.JJ........',
  '........vvvvhhhhoooo............jjj.uuuuMMMM.ccccckkkkkkkkkk..J.........',
  '..........vvhhhhooo.............NNNNN...MMMMMMcccddkkkkkkkkk.JJ.........',
  '...........mmmhhooo............NNNNNNLLLLMMMMMddddddkkkkkkk.............',
  '............mmmm..o............NNNNNNLLLLRRRRR.ddddddkkkkkk.............',
  '.............mmmmm.............NNNNNNLLLLLRRRR..dddd.tttt...............',
  '...............mmm............WWWWWWWWEEEEERR...ddd..tttt..zz...........',
  '.................mmKKKKK......WWWWWWWWCCEEEE.....dd..tttt..zz...........',
  '...................KKKKKKK......WWWWCCCCCEEE..........tt.zzz............',
  '..................DDAAAAAAA.........CCCCCEEE.........zzz.zzzz...........',
  '..................DDAAAAAAHH........CCCCCEE............zzzz..GGGG.......',
  '..................DDDAAAAHHH........CCCCEEE...................y.........',
  '..................DDDAAAHHHH........SSSSSS..S............xxxyyyy........',
  '...................DDPPHHHH.........SSSSSS..S...........xxxxyyyyy.......',
  '....................DPPPHH...........SSSS...S...........xxxxyyyyy.......',
  '....................DPPPP............SSSS...............xxxxyyyyy.......',
  '....................DPPP..............SS.................xx..yyyy.......',
  '....................DPP........................................y.....y..',
  '....................DP..............................................y...',
  '....................DP..................................................',
];

export const REGIONS = {
  na: 'Nordamerika',
  sa: 'Sydamerika',
  eu: 'Europa',
  af: 'Afrika',
  as: 'Asien',
  oc: 'Oceanien',
};

// letter: [id, name, region]
export const TERRITORIES = {
  a: ['alaska', 'Alaska', 'na'],
  b: ['nordcanada', 'Nordcanada', 'na'],
  q: ['oestcanada', 'Østcanada', 'na'],
  g: ['groenland', 'Grønland', 'na'],
  v: ['vestkysten', 'Vestkysten', 'na'],
  h: ['praerien', 'Prærien', 'na'],
  o: ['oestkysten', 'Østkysten', 'na'],
  m: ['mellemamerika', 'Mellemamerika', 'na'],
  K: ['caribien', 'Caribien-kysten', 'sa'],
  D: ['andes', 'Andes', 'sa'],
  A: ['amazonas', 'Amazonas', 'sa'],
  H: ['hoejlandet', 'Højlandet', 'sa'],
  P: ['pampas', 'Pampas', 'sa'],
  i: ['britiske-oeer', 'Britiske Øer', 'eu'],
  s: ['skandinavien', 'Skandinavien', 'eu'],
  j: ['iberien', 'Iberien', 'eu'],
  w: ['vesteuropa', 'Vesteuropa', 'eu'],
  l: ['centraleuropa', 'Centraleuropa', 'eu'],
  e: ['oesteuropa', 'Østeuropa', 'eu'],
  u: ['sydeuropa', 'Sydeuropa', 'eu'],
  N: ['maghreb', 'Maghreb', 'af'],
  L: ['nilen', 'Nilen', 'af'],
  W: ['vestafrika', 'Vestafrika', 'af'],
  C: ['centralafrika', 'Centralafrika', 'af'],
  E: ['afrikas-horn', 'Afrikas Horn', 'af'],
  S: ['sydlige-afrika', 'Det sydlige Afrika', 'af'],
  M: ['mellemoesten', 'Mellemøsten', 'as'],
  R: ['arabien', 'Arabien', 'as'],
  c: ['centralasien', 'Centralasien', 'as'],
  r: ['vestsibirien', 'Vestsibirien', 'as'],
  n: ['oestsibirien', 'Østsibirien', 'as'],
  B: ['steppen', 'Steppen', 'as'],
  d: ['sydasien', 'Sydasien', 'as'],
  k: ['oestasien', 'Østasien', 'as'],
  t: ['sydoestasien', 'Sydøstasien', 'as'],
  J: ['japan', 'Japan', 'as'],
  z: ['sundaoeerne', 'Sundaøerne', 'oc'],
  G: ['ny-guinea', 'Ny Guinea', 'oc'],
  x: ['vestaustralien', 'Vestaustralien', 'oc'],
  y: ['oestaustralien', 'Østaustralien', 'oc'],
};

// Where crowded territories put their seal and name: letter: [row, column, name side], side
// 'below', 'above', 'left' or 'right'. The rest use the cell closest to the middle of the
// territory, with the name below.
export const PLACES = {
  i: [5, 32, 'above'],
  j: [8, 32, 'left'],
  w: [7, 34, 'below'],
  l: [6, 37, 'above'],
  s: [2, 38, 'below'],
  u: [8, 38, 'below'],
  K: [14, 21, 'above'],
};

// Region missions for mission games (the engine adds "hold territories" and "knock out a player").
// Each asks for about 12–16 territories; the small pairs need one more region of your choice.
export const MISSIONS = [
  { type: 'regions', regions: ['as', 'sa'] },
  { type: 'regions', regions: ['as', 'af'] },
  { type: 'regions', regions: ['na', 'af'] },
  { type: 'regions', regions: ['na', 'eu'] },
  { type: 'regions', regions: ['eu', 'sa'], plusOne: true },
  { type: 'regions', regions: ['eu', 'oc'], plusOne: true },
];

// Crossings over water, drawn as dashed lines: [from, to].
export const SEA = [
  ['a', 'n'], // Beringstrædet
  ['g', 'i'], // over Island
  ['i', 's'], // Nordsøen
  ['H', 'W'], // Sydatlanten
  ['z', 'x'], // Timorhavet
  ['z', 'G'], // Molukkerne
  ['J', 'k'], // Koreastrædet
  ['q', 'g'], // Davisstrædet
];

/* ---------- geometry ---------- */

const ROOT3 = Math.sqrt(3);
// Centre of a hex with side 1. Odd rows are shifted half a hex to the right.
export const hexCenter = (row, col) => [ROOT3 * (col + 0.5 * (row & 1)) + ROOT3 / 2, 1.5 * row + 1];
export const WIDTH = ROOT3 * (GRID[0].length + 0.5);
export const HEIGHT = 1.5 * GRID.length + 0.5;

// Corners of a pointy-top hex, clockwise from the top.
export function hexCorners(row, col) {
  const [x, y] = hexCenter(row, col);
  return [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [x + Math.cos(a), y + Math.sin(a)];
  });
}

// The six neighbouring cells in GRID (odd-row offset layout), in the same order as the hex edges:
// edge i runs from corner i to corner i + 1.
export function hexNeighbours(row, col) {
  const odd = row & 1;
  return [
    [row - 1, col + odd], // up right
    [row, col + 1], // right
    [row + 1, col + odd], // down right
    [row + 1, col - 1 + odd], // down left
    [row, col - 1], // left
    [row - 1, col - 1 + odd], // up left
  ];
}

export const cellAt = (row, col) => GRID[row]?.[col] ?? '.';

/* ---------- the map definition ---------- */

function build() {
  const adj = Object.fromEntries(Object.keys(TERRITORIES).map((l) => [l, new Set()]));
  const cells = Object.fromEntries(Object.keys(TERRITORIES).map((l) => [l, []]));
  GRID.forEach((line, row) => {
    [...line].forEach((l, col) => {
      if (l === '.') return;
      if (!TERRITORIES[l]) throw new Error(`unknown letter ${l} at row ${row}, column ${col}`);
      cells[l].push([row, col]);
      for (const [r, c] of hexNeighbours(row, col)) {
        const n = cellAt(r, c);
        if (n !== '.' && n !== l) adj[l].add(n);
      }
    });
  });
  for (const [a, b] of SEA) adj[a].add(b), adj[b].add(a);

  const territories = {};
  for (const [l, [id, name, region]] of Object.entries(TERRITORIES)) {
    // The label goes on the territory's own cell closest to the middle of all its cells.
    const pts = cells[l].map(([r, c]) => hexCenter(r, c));
    const mx = pts.reduce((n, p) => n + p[0], 0) / pts.length;
    const my = pts.reduce((n, p) => n + p[1], 0) / pts.length;
    const [x, y] = PLACES[l]
      ? hexCenter(PLACES[l][0], PLACES[l][1])
      : pts.reduce((best, p) => (Math.hypot(p[0] - mx, p[1] - my) < Math.hypot(best[0] - mx, best[1] - my) ? p : best));
    const label = PLACES[l]?.[2] ?? 'below';
    territories[id] = { name, region, adj: [...adj[l]].map((n) => TERRITORIES[n][0]), x, y, label, letter: l };
  }

  const regions = {};
  for (const [r, name] of Object.entries(REGIONS)) {
    const own = Object.values(territories).filter((t) => t.region === r);
    const entries = own.filter((t) => t.adj.some((n) => territories[n].region !== r)).length;
    regions[r] = { name, bonus: Math.max(2, entries + Math.floor(own.length / 3) - 1) };
  }
  return { id: 'world', name: 'Verden', regions, territories, missions: MISSIONS };
}

export const WORLD = build();
