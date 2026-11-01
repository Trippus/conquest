// Maps drawn as letters on a hex grid. hexMap() takes a map's data and returns it with its
// geometry and MAP, the definition the engine plays on. Every map file (world.js, vikings.js)
// is just data:
//
//   id, name      the map's id and name ('world', 'Verden')
//   GRID          one letter per hex, '.' is sea, '#' land outside the game (drawn as unexplored).
//                 Odd rows sit half a hex to the right. Territories
//                 that touch on the grid are neighbours; a territory may be in several pieces.
//   REGIONS       region id: name
//   TERRITORIES   letter: [id, name, region id]
//   SEA           crossings over water, drawn as dashed lines: [letter, letter]
//   TERRAIN       letter: 'mountains' | 'forest' | 'desert', what the map art draws there
//   PLACES        letter: [row, column, name side], where a crowded territory puts its seal; side is
//                 'below', 'above', 'left' or 'right'. The rest use the cell closest to their middle.
//   MISSIONS      region missions for mission games
//   REGION_PLACES region id: [x, y], where the region's name is written, in map units
//   COMPASS       [x, y] or [x, y, size], the compass rose, in open sea
//   BONUS         optional region id: bonus, instead of the bonus worked out from the map
//   WRAPS         true when the left and right edges meet (the world: the Pacific is at both edges)
//   RULES         optional rules that differ from the game's rules on this map
//   LANDMARKS     optional names on unexplored land: [[x, y, name]], in map units
//   SHIP          optional: the kind of ship by the sea routes ('ship', 'longship', 'galley', 'atakebune'); SHIP_COUNT how many;
//                 OCEANS, [row, column] in open sea for the ships the routes have no room for
//   RULERS, TITLE optional flavour: the computer players' names, and what the winner becomes
//   NAMES         optional names in other languages: { en: { name, REGIONS, TERRITORIES, LANDMARKS, RULERS } },
//                 only those that differ (see inLanguage in index.js)
//
// Region bonus, unless BONUS says otherwise: how many of the region's territories can be attacked
// from outside, plus one per three territories, minus one (at least 2). Few ways in and many
// territories is worth more.

const ROOT3 = Math.sqrt(3);

// Centre of a hex with side 1.
export const hexCenter = (row, col) => [ROOT3 * (col + 0.5 * (row & 1)) + ROOT3 / 2, 1.5 * row + 1];

// Corners of a pointy-top hex, clockwise from the top.
export function hexCorners(row, col) {
  const [x, y] = hexCenter(row, col);
  return [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [x + Math.cos(a), y + Math.sin(a)];
  });
}

// The six neighbouring cells (odd-row offset layout), in the same order as the hex edges:
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

export function hexMap(def) {
  const { GRID, REGIONS, TERRITORIES, SEA = [], PLACES = {}, MISSIONS = [], BONUS = {} } = def;
  const cellAt = (row, col) => GRID[row]?.[col] ?? '.';
  const grid = {
    TERRAIN: {},
    WRAPS: false,
    ...def,
    SEA,
    PLACES,
    hexCenter,
    hexCorners,
    hexNeighbours,
    cellAt,
    WIDTH: ROOT3 * (GRID[0].length + 0.5),
    HEIGHT: 1.5 * GRID.length + 0.5,
  };

  const adj = Object.fromEntries(Object.keys(TERRITORIES).map((l) => [l, new Set()]));
  const cells = Object.fromEntries(Object.keys(TERRITORIES).map((l) => [l, []]));
  GRID.forEach((line, row) => {
    [...line].forEach((l, col) => {
      if (l === '.' || l === '#') return;
      if (!TERRITORIES[l]) throw new Error(`${def.id}: unknown letter ${l} at row ${row}, column ${col}`);
      cells[l].push([row, col]);
      for (const [r, c] of hexNeighbours(row, col)) {
        const n = cellAt(r, c);
        if (n !== '.' && n !== '#' && n !== l) adj[l].add(n);
      }
    });
  });
  for (const [a, b] of SEA) adj[a].add(b), adj[b].add(a);

  const territories = {};
  for (const [l, [id, name, region]] of Object.entries(TERRITORIES)) {
    if (!cells[l].length) throw new Error(`${def.id}: ${name} has no cells on the grid`);
    // The seal goes on the territory's own cell closest to the middle of all its cells.
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
    regions[r] = { name, bonus: BONUS[r] ?? Math.max(2, entries + Math.floor(own.length / 3) - 1) };
  }
  grid.MAP = { id: def.id, name: def.name, regions, territories, missions: MISSIONS };
  return grid;
}
