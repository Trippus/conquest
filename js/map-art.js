// Decorations for the paper map, drawn in ink like an old atlas: mountains, forests and dunes on
// the land, waves and a few ships at sea, and a compass rose. Pure SVG strings, no DOM. Everything
// is placed from the hex grid, so it always sits on the right land, and kept out of the boxes the
// board passes in (seals, names, region names), so it never hides what you play with.

const INK = '#4a3726';

// The drawings, in map units (a hex is about 1.7 wide). Used with <use href="#…">.
export const ART_DEFS = `
  <g id="art-mountain">
    <path d="M-.8 .35L-.22-.55L.02-.2L.3-.5L.85.35Z" fill="#efe1c0" stroke="${INK}" stroke-width=".07" stroke-linejoin="round"/>
    <path d="M-.22-.55L-.12.3M.3-.5L.38.3" fill="none" stroke="${INK}" stroke-width=".04" opacity=".55"/>
  </g>
  <g id="art-forest" fill="#e9dcb8" stroke="${INK}" stroke-width=".055">
    <path d="M-.32.32V.05M.28.3V.02M0 .42V.18" fill="none"/>
    <circle cx="-.32" cy="-.08" r=".24"/><circle cx=".28" cy="-.12" r=".26"/><circle cx="0" cy=".05" r=".22"/>
  </g>
  <g id="art-desert" fill="none" stroke="${INK}" stroke-width=".05" stroke-linecap="round">
    <path d="M-.7.15q.35-.35.7 0M.05.3q.3-.28.6 0"/>
    <path d="M-.25-.25h.01M.35-.1h.01M-.5-.05h.01" stroke-width=".09"/>
  </g>
  <path id="art-wave" d="M-.6 0q.3-.24.6 0t.6 0" fill="none" stroke="${INK}" stroke-width=".05" stroke-linecap="round"/>
  <g id="art-ship" stroke="${INK}" stroke-width=".06" stroke-linejoin="round">
    <path d="M-.8 .05h1.6l-.35 .38h-.9z" fill="#8a6a4a"/>
    <path d="M0 .05V-1.15" fill="none"/>
    <path d="M.06-1.05Q.75-.6 .06-.1Z" fill="#f6ecd4"/>
    <path d="M-.06-.9Q-.55-.55-.06-.2Z" fill="#f6ecd4"/>
    <path d="M0-1.15l.35.1-.35.1" fill="#a3261b"/>
  </g>
  <g id="art-compass" stroke="${INK}" stroke-width=".08">
    <circle r="2.6" fill="none"/><circle r="2.3" fill="none" stroke-dasharray=".15 .15"/>
    <path d="M0-3.4L.5-.5L0 0L-.5-.5Z" fill="${INK}"/><path d="M0 3.4L.5 .5L0 0L-.5 .5Z" fill="#f6ecd4"/>
    <path d="M-3.4 0L-.5-.5L0 0L-.5 .5Z" fill="#f6ecd4"/><path d="M3.4 0L.5-.5L0 0L.5 .5Z" fill="${INK}"/>
    <text y="-3.8" stroke="none" fill="${INK}" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="1">N</text>
  </g>`;

// A fixed "random" number for a cell, so the map looks the same every time.
const hash = (row, col, salt = 0) => {
  let h = Math.imul(row * 374761393 + col * 668265263 + salt * 2246822519, 3266489917);
  h ^= h >>> 15;
  return (Math.imul(h, 2246822519) ^ (h >>> 13)) >>> 0;
};

// keepClear: boxes { x0, y0, x1, y1 } in map units where nothing may be drawn.
// seaLines: [[x1, y1, x2, y2]] sea routes the waves keep away from.
// compass: [x, y] for the compass rose, or null.
export function mapArt(grid, { keepClear = [], seaLines = [], compass = null } = {}) {
  const { GRID, TERRAIN = {}, hexCenter, hexNeighbours, cellAt } = grid;
  const taken = [...keepClear]; // grows with the ships and the compass, so waves keep off them
  const free = (x, y, r) => taken.every((b) => x + r < b.x0 || x - r > b.x1 || y + r < b.y0 || y - r > b.y1);
  const take = (x, y, r) => taken.push({ x0: x - r, y0: y - r, x1: x + r, y1: y + r });
  const offRoutes = (x, y) =>
    seaLines.every(([x1, y1, x2, y2]) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1)));
      return Math.hypot(x - x1 - t * dx, y - y1 - t * dy) > 1.3;
    });

  // How far each sea cell is from land, in cells.
  const rows = GRID.length;
  const cols = GRID[0].length;
  const dist = GRID.map((line) => [...line].map((c) => (c === '.' ? Infinity : 0)));
  let edge = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (dist[r][c] === 0) edge.push([r, c]);
  for (let d = 1; edge.length; d++) {
    const next = [];
    for (const [r, c] of edge) {
      for (const [nr, nc] of hexNeighbours(r, c)) {
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || dist[nr][nc] !== Infinity) continue;
        dist[nr][nc] = d;
        next.push([nr, nc]);
      }
    }
    edge = next;
  }

  const use = (id, x, y, scale = 1) => `<use href="#art-${id}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale})"/>`;
  const jitter = (h, shift) => (((h >>> shift) % 100) / 100 - 0.5) * 0.5;
  const DENSITY = { mountains: 2, forest: 2, desert: 3 }; // one cell in this many gets a drawing
  const ART = { mountains: 'mountain', forest: 'forest', desert: 'desert' };
  let land = '';
  let sea = '';
  // A ship in each great ocean: the free open-sea cell nearest to where it should sail.
  for (const [row, col] of [[13, 26], [17, 5], [21, 47], [9, 68]]) {
    let best = null;
    for (let r = Math.max(0, row - 4); r <= Math.min(rows - 1, row + 4); r++) {
      for (let c = Math.max(0, col - 6); c <= Math.min(cols - 1, col + 6); c++) {
        if (dist[r][c] < 2) continue;
        const [x, y] = hexCenter(r, c);
        const d = Math.hypot(r - row, c - col);
        if (free(x, y, 1.6) && offRoutes(x, y) && (!best || d < best.d)) best = { x, y, d };
      }
    }
    if (best) {
      sea += use('ship', best.x, best.y, 1.2);
      take(best.x, best.y, 1.6);
    }
  }
  if (compass) {
    sea += use('compass', compass[0], compass[1], 0.9);
    take(compass[0], compass[1], 3.6);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const [cx, cy] = hexCenter(r, c);
      const h = hash(r, c);
      const kind = TERRAIN[cellAt(r, c)];
      if (kind) {
        const x = cx + jitter(h, 3);
        const y = cy + jitter(h, 9);
        // Not on the coast either: the ink coastline stays clean.
        const coast = hexNeighbours(r, c).some(([nr, nc]) => cellAt(nr, nc) === '.');
        if (h % DENSITY[kind] === 0 && !coast && free(x, y, 0.9)) land += use(ART[kind], x, y, 0.9 + (h % 3) * 0.1);
      } else if (dist[r][c] >= 2 && h % 6 === 0) {
        const x = cx + jitter(h, 4);
        const y = cy + jitter(h, 8);
        if (free(x, y, 0.8) && offRoutes(x, y)) sea += use('wave', x, y, 0.9 + (h % 3) * 0.15);
      }
    }
  }

  return { land, sea };
}
