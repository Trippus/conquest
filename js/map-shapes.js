// Turns a hex-grid map (see js/maps/hex.js) into shapes to draw: each territory's outline, the
// borders between territories (marked when they also divide two regions), the coastline and the
// sea routes. Land outside the game ('#') gets an outline of its own (outlines['#']), a fainter
// coast (shore) and a line where the game's land ends (frontier). Pure geometry, no DOM.
//
// The outlines are smoothed so coasts are not saw-toothed: every corner where only two boundary
// lines meet is pulled towards its two neighbours a few times, while corners where three meet stay
// put. Neighbouring territories share the same corners, so their outlines still fit exactly.

const key = ([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`;

// grid: the map's hex module (GRID, TERRITORIES, SEA, hexCorners, hexNeighbours, cellAt, hexCenter).
export function mapShapes(grid, { smooth = 4 } = {}) {
  const { GRID, TERRITORIES, SEA, hexCorners, hexNeighbours, cellAt, hexCenter } = grid;
  const pos = new Map(); // corner key → [x, y]
  const links = new Map(); // corner key → keys it shares a boundary line with
  const next = {}; // letter → Map(corner key → next corner key), walking the outline clockwise
  const lines = new Map(); // 'kind:a:b' → [[from, to], …] boundary pieces to draw
  const link = (a, b) => {
    if (!links.has(a)) links.set(a, new Set());
    if (!links.has(b)) links.set(b, new Set());
    links.get(a).add(b);
    links.get(b).add(a);
  };
  const regionOf = (l) => TERRITORIES[l][2];
  const OUT = '#'; // land outside the game

  GRID.forEach((line, row) => {
    [...line].forEach((l, col) => {
      if (l === '.') return;
      next[l] ??= new Map();
      const corners = hexCorners(row, col);
      const around = hexNeighbours(row, col);
      for (let i = 0; i < 6; i++) {
        const n = cellAt(...around[i]);
        if (n === l) continue;
        const a = key(corners[i]);
        const b = key(corners[(i + 1) % 6]);
        pos.set(a, corners[i]);
        pos.set(b, corners[(i + 1) % 6]);
        link(a, b);
        // A list: where a territory touches itself at one corner, two outline edges start there.
        if (!next[l].has(a)) next[l].set(a, []);
        next[l].get(a).push(b);
        if (n !== '.' && n < l) continue; // a border between two territories is drawn once
        const kind =
          n === '.' ? (l === OUT ? 'shore' : 'coast') : l === OUT || n === OUT ? 'frontier' : regionOf(n) === regionOf(l) ? 'border' : 'region';
        const id = `${kind}:${[l, n].sort().join('')}`;
        if (!lines.has(id)) lines.set(id, []);
        lines.get(id).push([a, b]);
      }
    });
  });

  for (let k = 0; k < smooth; k++) {
    const moved = new Map();
    for (const [p, ns] of links) {
      if (ns.size !== 2) continue;
      const [a, b] = [...ns].map((n) => pos.get(n));
      const [x, y] = pos.get(p);
      moved.set(p, [x / 2 + (a[0] + b[0]) / 4, y / 2 + (a[1] + b[1]) / 4]);
    }
    for (const [p, xy] of moved) pos.set(p, xy);
  }
  const pt = (k) => pos.get(k).map((v) => +v.toFixed(3)).join(' ');

  // Each territory: all its outline loops in one path (Japan, Madagascar … have several).
  const outlines = {};
  for (const [l, steps] of Object.entries(next)) {
    const left = new Map([...steps].map(([a, tos]) => [a, [...tos]]));
    const take = (a) => {
      const tos = left.get(a);
      const to = tos.pop();
      if (!tos.length) left.delete(a);
      return to;
    };
    let d = '';
    while (left.size) {
      const [start] = left.keys();
      let at = start;
      d += `M${pt(at)}`;
      do {
        at = take(at);
        if (at !== start) d += `L${pt(at)}`;
      } while (at !== start && left.has(at));
      d += 'Z';
    }
    outlines[l] = d;
  }

  // Boundary pieces chained into as few polylines as possible, so dashes run on smoothly.
  const paths = { coast: [], border: [], region: [], shore: [], frontier: [] };
  for (const [id, pieces] of lines) {
    const [kind] = id.split(':');
    const from = new Map();
    const hasEnd = new Set();
    for (const [a, b] of pieces) {
      if (!from.has(a)) from.set(a, []);
      from.get(a).push(b);
      hasEnd.add(b);
    }
    const used = new Set();
    const chain = (start) => {
      let d = `M${pt(start)}`;
      let at = start;
      for (;;) {
        const to = (from.get(at) ?? []).find((b) => !used.has(`${at}>${b}`));
        if (!to) break;
        used.add(`${at}>${to}`);
        d += `L${pt(to)}`;
        at = to;
      }
      return d;
    };
    // Start where a line begins (not continued from elsewhere), then pick up closed loops.
    let d = '';
    for (const [a] of pieces) if (!hasEnd.has(a)) d += chain(a);
    for (const [a, b] of pieces) if (!used.has(`${a}>${b}`)) d += chain(a);
    paths[kind].push(d);
  }

  // Sea routes: a straight dashed line between the two closest cells of the territories, on each
  // one's largest piece of land, so a route never ends on a speck of an island off the coast.
  const cellsOf = (l) => {
    const seen = new Set();
    let best = [];
    GRID.forEach((line, row) =>
      [...line].forEach((c, col) => {
        if (c !== l || seen.has(`${row},${col}`)) return;
        const piece = [];
        const stack = [[row, col]];
        seen.add(`${row},${col}`);
        while (stack.length) {
          const [r, k] = stack.pop();
          piece.push(hexCenter(r, k));
          for (const [nr, nk] of hexNeighbours(r, k)) {
            if (cellAt(nr, nk) === l && !seen.has(`${nr},${nk}`)) seen.add(`${nr},${nk}`), stack.push([nr, nk]);
          }
        }
        if (piece.length > best.length) best = piece;
      }),
    );
    return best;
  };
  const sea = SEA.map(([a, b]) => {
    let best = null;
    for (const p of cellsOf(a)) {
      for (const q of cellsOf(b)) {
        // On a map whose edges meet (the world: Alaska–Far East) the short way may be round the back.
        const dx = Math.abs(p[0] - q[0]);
        const d = Math.hypot(grid.WRAPS ? Math.min(dx, grid.WIDTH - dx) : dx, p[1] - q[1]);
        if (!best || d < best.d) best = { d, p, q };
      }
    }
    return { from: a, to: b, ...best, wraps: !!grid.WRAPS && Math.abs(best.p[0] - best.q[0]) > grid.WIDTH / 2 };
  });

  return {
    outlines,
    coast: paths.coast.join(''),
    borders: paths.border.join(''),
    regions: paths.region.join(''),
    shore: paths.shore.join(''),
    frontier: paths.frontier.join(''),
    sea,
  };
}

// The outline of each region as one shape: the same tracing, on a grid where every territory's
// letter is replaced by its region's. Returns { regionId: path }.
export function regionShapes(grid, options) {
  const ids = [...new Set(Object.values(grid.TERRITORIES).map(([, , r]) => r))];
  const code = Object.fromEntries(ids.map((r, i) => [r, String.fromCharCode(0x100 + i)]));
  const letter = Object.fromEntries(Object.entries(grid.TERRITORIES).map(([l, [, , r]]) => [l, code[r]]));
  const GRID = grid.GRID.map((line) => [...line].map((c) => letter[c] ?? c).join(''));
  const TERRITORIES = Object.fromEntries(ids.map((r) => [code[r], [r, r, r]]));
  const cellAt = (row, col) => GRID[row]?.[col] ?? '.';
  const { outlines } = mapShapes({ ...grid, GRID, TERRITORIES, SEA: [], cellAt }, options);
  return Object.fromEntries(ids.map((r) => [r, outlines[code[r]]]));
}
