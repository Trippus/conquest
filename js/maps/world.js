// The modern world map, first draft: 30 territories in 6 regions, drawn as a hex grid.
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
  '..........bbbbbbbbbbbgggggggggg......................rrrrr..............',
  '.aaaaaabbbbbbbbbbbbb...ggggggg.......sssseeeeerrrrrrrrrrrrrrrrfffffffff.',
  '.aaaaabbbbbbbbbbb..bbb..ggg.........ssssseeeeerrrrrrrrrrrrrrrrfffffffff.',
  '..aaaabbbbbbbbbb...bbb...g.........sssssseeeeerrrrrrrrrrrrrrrrff..f.....',
  '......vvvvbbbbbb...ooo..........ii.ws..eeeeeeerrrrrrrrrrrrrrr.f...f.....',
  '........vvvvvvoooooooo...........iwwwweeeeeeecccccccrrrrkkkkffff........',
  '........vvvvvooooooooo...........wwwuuuu..ee.cccccccckkkkkkkk.ff........',
  '........vvvvvooooooo............www.uuuuMMMM.ccccckkkkkkkkkk..f.........',
  '..........vvvoooooo.............NNNNN...MMMMMMcccddkkkkkkkkk.ff.........',
  '...........mmmooooo............NNNNNNNNNNMMMMMddddddkkkkkkk.............',
  '............mmmm..o............NNNNNNNNNNMMMMM.ddddddkkkkkk.............',
  '.............mmmmm.............NNNNNNNNNEEMMMM..dddd.tttt...............',
  '...............mmm............WWWWWWWWEEEEEMM...ddd..tttt..zz...........',
  '.................mmDDAAA......WWWWWWWWCCEEEE.....dd..tttt..zz...........',
  '...................DDAAAAA......WWWWCCCCCEEE..........tt.zzz............',
  '..................DDAAAAAAA.........CCCCCEEE.........zzz.zzzz...........',
  '..................DDAAAAAAHH........CCCCCEE............zzzz..zzzz.......',
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
  b: ['arktis', 'Arktis', 'na'],
  g: ['groenland', 'Grønland', 'na'],
  v: ['vestkysten', 'Vestkysten', 'na'],
  o: ['oestkysten', 'Østkysten', 'na'],
  m: ['mellemamerika', 'Mellemamerika', 'na'],
  D: ['andes', 'Andes', 'sa'],
  A: ['amazonas', 'Amazonas', 'sa'],
  H: ['hoejlandet', 'Højlandet', 'sa'],
  P: ['pampas', 'Pampas', 'sa'],
  i: ['britiske-oeer', 'Britiske Øer', 'eu'],
  s: ['skandinavien', 'Skandinavien', 'eu'],
  w: ['vesteuropa', 'Vesteuropa', 'eu'],
  e: ['oesteuropa', 'Østeuropa', 'eu'],
  u: ['sydeuropa', 'Sydeuropa', 'eu'],
  N: ['nordafrika', 'Nordafrika', 'af'],
  W: ['vestafrika', 'Vestafrika', 'af'],
  C: ['centralafrika', 'Centralafrika', 'af'],
  E: ['oestafrika', 'Østafrika', 'af'],
  S: ['sydlige-afrika', 'Det sydlige Afrika', 'af'],
  M: ['mellemoesten', 'Mellemøsten', 'as'],
  c: ['centralasien', 'Centralasien', 'as'],
  r: ['sibirien', 'Sibirien', 'as'],
  f: ['fjernoesten', 'Fjernøsten', 'as'],
  d: ['sydasien', 'Sydasien', 'as'],
  k: ['oestasien', 'Østasien', 'as'],
  t: ['sydoestasien', 'Sydøstasien', 'as'],
  z: ['sundaoeerne', 'Sundaøerne', 'oc'],
  x: ['vestaustralien', 'Vestaustralien', 'oc'],
  y: ['oestaustralien', 'Østaustralien', 'oc'],
};

// Crossings over water, drawn as dashed lines: [from, to].
export const SEA = [
  ['a', 'f'], // Beringstrædet
  ['g', 'i'], // over Island
  ['i', 's'], // Nordsøen
  ['H', 'W'], // Sydatlanten
  ['z', 'x'], // Timorhavet
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
    const [x, y] = pts.reduce((best, p) => (Math.hypot(p[0] - mx, p[1] - my) < Math.hypot(best[0] - mx, best[1] - my) ? p : best));
    territories[id] = { name, region, adj: [...adj[l]].map((n) => TERRITORIES[n][0]), x, y, letter: l };
  }

  const regions = {};
  for (const [r, name] of Object.entries(REGIONS)) {
    const own = Object.values(territories).filter((t) => t.region === r);
    const entries = own.filter((t) => t.adj.some((n) => territories[n].region !== r)).length;
    regions[r] = { name, bonus: Math.max(2, entries + Math.floor(own.length / 3) - 1) };
  }
  return { id: 'world', name: 'Verden', regions, territories };
}

export const WORLD = build();
