// Decorations for the paper map, drawn in ink like an old atlas: mountains, forests and dunes on
// the land, waves and a few ships at sea, and a compass rose. Pure SVG strings, no DOM. Everything
// is placed from the hex grid, so it always sits on the right land, and kept out of the boxes the
// board passes in (seals, names, region names), so it never hides what you play with.

const INK = '#4a3726';

// A compass rose like an old chart's: a ring with a scale, four long points and four short ones,
// half dark and half light so they look raised, and the four quarters written in Danish.
function compassRose() {
  const at = (deg, r) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  };
  const point = (deg, len, w) =>
    `<path d="M0 0L${at(deg, len)}L${at(deg - 90, w)}Z" fill="${INK}"/><path d="M0 0L${at(deg, len)}L${at(deg + 90, w)}Z" fill="#f6ecd4"/>`;
  const ticks = Array.from({ length: 64 }, (_, i) => `M${at(i * 5.625, 3.55)}L${at(i * 5.625, i % 8 ? 3.75 : 3.95)}`).join('');
  const letters = [['N', 0], ['Ø', 90], ['S', 180], ['V', 270]]
    .map(([l, deg]) => {
      const [x, y] = at(deg, 4.75).split(' ');
      return `<text x="${x}" y="${(+y + 0.4).toFixed(2)}">${l}</text>`;
    })
    .join('');
  return `<g stroke="${INK}" stroke-width=".06">
      <circle r="4" fill="#efe1c0" fill-opacity=".55"/><circle r="3.55" fill="none"/><circle r="2.2" fill="none" stroke-dasharray=".12 .12"/>
      <path d="${ticks}" fill="none"/>
      ${[45, 135, 225, 315].map((d) => point(d, 2.6, 0.42)).join('')}
      ${[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((d) => point(d, 1.7, 0.22)).join('')}
      ${[0, 90, 180, 270].map((d) => point(d, 4.15, 0.62)).join('')}
      <circle r=".3" fill="#a3261b"/>
    </g>
    <g fill="${INK}" font-family="Georgia, serif" font-weight="700" font-size="1.05" text-anchor="middle">${letters}</g>`;
}

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
  <g id="art-ship" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-1.35-.2H-.85V.12H1.15Q1.05.62.62.72H-.9Q-1.25.55-1.35-.2Z" fill="#8a6a4a"/>
    <path d="M-1.28.3H1.02M-1.3-.02H-.85" fill="none" opacity=".7"/>
    <path d="M1.12.1L1.75-.32" fill="none"/>
    <path d="M-.55.1V-1.45M.1.1V-1.95M.7.1V-1.35" fill="none"/>
    <path d="M-.95-1.3Q-.55-1.18-.15-1.3L-.2-.85Q-.55-.72-.9-.85Z M-.92-.72Q-.55-.6-.18-.72L-.22-.25Q-.55-.14-.88-.25Z" fill="#f6ecd4"/>
    <path d="M-.32-1.8Q.1-1.66.52-1.8L.48-1.3Q.1-1.16-.28-1.3Z M-.36-1.16Q.1-1.02.56-1.16L.52-.6Q.1-.46-.32-.6Z M-.3-.48Q.1-.38.5-.48L.47-.1Q.1-.02-.27-.1Z" fill="#f6ecd4"/>
    <path d="M.38-1.2Q.7-1.1 1.02-1.2L.98-.75Q.7-.65.42-.75Z M.4-.62Q.7-.52 1-.62L.97-.2Q.7-.12.43-.2Z" fill="#f6ecd4"/>
    <path d="M.75.08L1.6-.28L.85-1.05Z" fill="#f6ecd4"/>
    <path d="M.1-1.95l.42.1-.42.1z" fill="#a3261b"/>
    <path d="M-1.5.9q.3-.15.6 0t.6 0M.35.9q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-longship" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-.62-1.62H.62V-.5Q0-.38-.62-.5Z" fill="#f6ecd4"/>
    <path d="M-.38-1.62V-.44M-.12-1.62V-.4M.12-1.62V-.4M.38-1.62V-.44" stroke="#a3261b" stroke-width=".14"/>
    <path d="M-.62-1.62H.62V-.5Q0-.38-.62-.5Z" fill="none"/>
    <path d="M0-.38V-1.9M-.75-1.62H.75" fill="none"/>
    <path d="M-1.55-.75Q-1.85-.1-1.1.25Q0 .62 1.1.25Q1.85-.1 1.55-.75Q1.4-.55 1.15-.3Q0-.05-1.15-.3Q-1.4-.55-1.55-.75Z" fill="#8a6a4a"/>
    <path d="M1.55-.75q.28-.18.22-.48q-.18.02-.3.16q.02-.2-.12-.28q-.05.28.2.6Z" fill="#8a6a4a"/>
    <path d="M-1.55-.75q-.3-.1-.3-.38q.15-.12.3.05" fill="none"/>
    <g fill="#a3261b"><circle cx="-.9" cy="-.18" r=".14"/><circle cx="-.3" cy="-.1" r=".14"/><circle cx=".3" cy="-.1" r=".14"/><circle cx=".9" cy="-.18" r=".14"/></g>
    <g fill="#f6ecd4"><circle cx="-.6" cy="-.13" r=".14"/><circle cx="0" cy="-.09" r=".14"/><circle cx=".6" cy="-.13" r=".14"/></g>
    <path d="M-.8.3L-1.05.75M-.3.42L-.45.85M.3.42L.45.85M.8.3L1.05.75" fill="none" opacity=".8"/>
    <path d="M-1.6.95q.3-.15.6 0t.6 0M.4.95q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-compass">${compassRose()}</g>`;

// A fixed "random" number for a cell, so the map looks the same every time.
const hash = (row, col, salt = 0) => {
  let h = Math.imul(row * 374761393 + col * 668265263 + salt * 2246822519, 3266489917);
  h ^= h >>> 15;
  return (Math.imul(h, 2246822519) ^ (h >>> 13)) >>> 0;
};

// keepClear: boxes { x0, y0, x1, y1 } in map units where nothing may be drawn.
// seaLines: [[x1, y1, x2, y2]] sea routes the waves keep away from.
// compass: [x, y] for the compass rose, or [x, y, size] (1.1 when left out), or null.
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
  let deco = ''; // the ships and the compass: drawn stronger than the waves
  if (compass) {
    const size = compass[2] ?? 1.1;
    deco += use('compass', compass[0], compass[1], size);
    take(compass[0], compass[1], 5.3 * size);
  }
  // Ships sail beside the longest sea routes (not those round the back of the map), a little to
  // one side of the dashed line, on open sea. grid.SHIP names the kind ('ship' or 'longship'),
  // grid.SHIP_COUNT how many (3).
  const seaCell = (x, y) => {
    const r = Math.round((y - 1) / 1.5);
    const c = Math.round((x - Math.sqrt(3) / 2) / Math.sqrt(3) - 0.5 * (r & 1));
    return (dist[r]?.[c] ?? 0) >= 1;
  };
  const routes = seaLines
    .map(([x1, y1, x2, y2]) => ({ x1, y1, x2, y2, len: Math.hypot(x2 - x1, y2 - y1) }))
    .filter((l) => l.len > 6 && l.len < cols)
    .sort((p, q) => q.len - p.len);
  let ships = grid.SHIP_COUNT ?? 3;
  for (const { x1, y1, x2, y2, len } of routes) {
    if (!ships) break;
    const [nx, ny] = [-(y2 - y1) / len, (x2 - x1) / len]; // across the route
    spot: for (const along of [0.5, 0.4, 0.6, 0.3, 0.7]) {
      for (const side of [2.4, -2.4, 3.2, -3.2]) {
        const x = x1 + (x2 - x1) * along + nx * side;
        const y = y1 + (y2 - y1) * along + ny * side;
        if (!seaCell(x, y) || !free(x, y, 2.4)) continue;
        deco += use(grid.SHIP ?? 'ship', x, y, 1.5);
        take(x, y, 2.6);
        ships--;
        break spot;
      }
    }
  }
  // Too few long routes (the world's are short or go round the back): the rest sail the open ocean,
  // the free cell nearest to where they should be ([row, col], grid.OCEANS).
  for (const [row, col] of grid.OCEANS ?? []) {
    if (!ships) break;
    let best = null;
    for (let r = Math.max(0, row - 4); r <= Math.min(rows - 1, row + 4); r++) {
      for (let c = Math.max(0, col - 6); c <= Math.min(cols - 1, col + 6); c++) {
        if (dist[r][c] < 2) continue;
        const [x, y] = hexCenter(r, c);
        const d = Math.hypot(r - row, c - col);
        if (free(x, y, 2.6) && offRoutes(x, y) && (!best || d < best.d)) best = { x, y, d };
      }
    }
    if (best) {
      deco += use(grid.SHIP ?? 'ship', best.x, best.y, 1.5);
      take(best.x, best.y, 2.6);
      ships--;
    }
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

  return { land, sea, deco };
}
