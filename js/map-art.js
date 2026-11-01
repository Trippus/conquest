// Decorations for the paper map, drawn in ink like an old atlas: mountains, forests and dunes on
// the land, waves and a few ships at sea, and a compass rose. Pure SVG strings, no DOM. Everything
// is placed from the hex grid, so it always sits on the right land, and kept out of the boxes the
// board passes in (seals, names, region names), so it never hides what you play with.

const INK = '#4a3726';

// A compass rose like an old chart's: a ring with a scale, four long points and four short ones,
// half dark and half light so they look raised, and the four quarters: north, east, south, west
// in the player's language ('NØSV' in Danish).
function compassRose(quarters) {
  const at = (deg, r) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  };
  const point = (deg, len, w) =>
    `<path d="M0 0L${at(deg, len)}L${at(deg - 90, w)}Z" fill="${INK}"/><path d="M0 0L${at(deg, len)}L${at(deg + 90, w)}Z" fill="#f6ecd4"/>`;
  const ticks = Array.from({ length: 64 }, (_, i) => `M${at(i * 5.625, 3.55)}L${at(i * 5.625, i % 8 ? 3.75 : 3.95)}`).join('');
  const letters = [...quarters].map((l, i) => [l, i * 90])
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
export const artDefs = (quarters = 'NØSV') => `
  <g id="art-mountain" stroke="${INK}" stroke-width=".07" stroke-linejoin="round">
    <path d="M-.85.38L-.25-.55L.04-.18L.34-.45L.92.38Z" fill="#efe1c0"/>
    <path d="M-.25-.55L.04-.18L-.06.38H-.2Z M.34-.45L.92.38H.42Z" fill="#a8916a" stroke="none"/>
    <path d="M-.25-.55L-.44-.25L-.35-.29L-.27-.2L-.17-.29L-.08-.33Z" fill="#fbf6ea" stroke-width=".04"/>
    <path d="M-.85.38L-.25-.55L.04-.18L.34-.45L.92.38Z" fill="none"/>
  </g>
  <g id="art-peak" stroke="${INK}" stroke-width=".07" stroke-linejoin="round">
    <path d="M-.8.38L0-.6L.8.38Z" fill="#efe1c0"/>
    <path d="M0-.6L.8.38H.06Z" fill="#a8916a" stroke="none"/>
    <path d="M0-.6L-.24-.3L-.12-.34L-.02-.25L.09-.34L.24-.3Z" fill="#fbf6ea" stroke-width=".04"/>
    <path d="M-.8.38L0-.6L.8.38Z" fill="none"/>
  </g>
  <g id="art-spruce" stroke="${INK}" stroke-width=".05" stroke-linejoin="round">
    <path d="M0 .5V.3" fill="none" stroke-width=".08"/>
    <path d="M0-.62L.2-.32H.1L.3-.04H.15L.38.3H-.38L-.15-.04H-.3L-.1-.32H-.2Z" fill="#7d8b58"/>
    <path d="M0-.62L.2-.32H.1L.3-.04H.15L.38.3H0Z" fill="#2f3a1e" fill-opacity=".35" stroke="none"/>
  </g>
  <g id="art-oak" stroke="${INK}" stroke-width=".05">
    <path d="M-.07.5L-.04.05H.05L.08.5Z" fill="#6b4a32"/>
    <g fill="#94a066"><circle cx="-.2" cy="-.1" r=".22"/><circle cx=".2" cy="-.12" r=".23"/><circle cx="0" cy="-.32" r=".24"/><circle cx=".02" cy=".02" r=".2"/></g>
    <path d="M.3-.28A.23.23 0 0 1 .2.11A.2.2 0 0 1-.02.22Q.25.05.3-.28Z" fill="#2f3a1e" fill-opacity=".35" stroke="none"/>
  </g>
  <g id="art-spruce-wood"><use href="#art-spruce" transform="translate(-.38 -.12) scale(.8)"/><use href="#art-spruce" transform="translate(.36 -.08) scale(.85)"/><use href="#art-spruce" transform="translate(0 .08)"/></g>
  <g id="art-oak-wood"><use href="#art-oak" transform="translate(-.32 -.1) scale(.85)"/><use href="#art-oak" transform="translate(.3 .02) scale(.95)"/></g>
  <g id="art-mixed-wood"><use href="#art-oak" transform="translate(-.3 -.08) scale(.9)"/><use href="#art-spruce" transform="translate(.32 0)"/></g>
  <g id="art-dunes" stroke="${INK}" stroke-width=".05" stroke-linejoin="round">
    <path d="M-.2.05C0-.2.2-.32.38-.3C.55-.28.7-.1.85.1Z" fill="#ead6a2"/>
    <path d="M.38-.3C.55-.28.7-.1.85.1H.45C.48-.06.45-.2.38-.3Z" fill="#c8a565" stroke="none"/>
    <path d="M-.85.38C-.55-.02-.3-.2-.05-.18C.2-.16.42.05.62.38Z" fill="#ead6a2"/>
    <path d="M-.05-.18C.2-.16.42.05.62.38H.12C.15.12.07-.06-.05-.18Z" fill="#c8a565" stroke="none"/>
    <path d="M-.85.38C-.55-.02-.3-.2-.05-.18C.2-.16.42.05.62.38" fill="none"/>
  </g>
  <g id="art-palm" stroke="${INK}" stroke-width=".045" stroke-linejoin="round">
    <path d="M-.6.42C-.3.2.3.2.6.42Z" fill="#ead6a2"/>
    <path d="M-.06.32Q.06-.05-.08-.42L.04-.42Q.18-.05.06.32Z" fill="#8a6a4a"/>
    <g fill="#7d8b58">
      <path d="M-.02-.42Q-.4-.72-.72-.36Q-.6-.38-.5-.32Q-.3-.5-.02-.42Z"/><path d="M-.02-.42Q.36-.72.7-.34Q.58-.37.48-.3Q.28-.5-.02-.42Z"/>
      <path d="M-.02-.42Q-.3-.86-.62-.72Q-.5-.66-.46-.58Q-.25-.66-.02-.42Z"/><path d="M-.02-.42Q.24-.88.58-.76Q.46-.68.42-.6Q.2-.66-.02-.42Z"/>
      <path d="M-.02-.42Q-.08-.9.06-.92Q.08-.7-.02-.42Z"/>
    </g>
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
  <g id="art-galley" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-.55-1.5H.55V-.55Q0-.45-.55-.55Z" fill="#f6ecd4"/>
    <path d="M-.18-1.5V-.5M.18-1.5V-.5" stroke="#a3261b" stroke-width=".16"/>
    <path d="M-.55-1.5H.55V-.55Q0-.45-.55-.55Z" fill="none"/>
    <path d="M0-.45V-1.75M-.65-1.5H.65" fill="none"/>
    <path d="M-1.6-.55Q-1.75-.25-1.35-.05H1.3L1.85.1L1.3.18Q1.5-.15 1.45-.45Q.2-.25-1.6-.55Z" fill="#8a6a4a"/>
    <path d="M-1.6-.55q-.12-.45.18-.6q-.02.25.12.35" fill="none"/>
    <path d="M-1.25-.18H1.25" fill="none" opacity=".6"/>
    <circle cx="1.12" cy="-.28" r=".07" fill="${INK}" stroke="none"/>
    <path d="M-1.1.02L-1.35.6M-.7.05L-.9.65M-.3.07L-.45.68M.1.07L-.02.68M.5.06L.42.66M.9.04L.86.62" fill="none" opacity=".85"/>
    <path d="M-1.6.85q.3-.15.6 0t.6 0M.3.85q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-atakebune" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M1.25-1.05V-1.75" fill="none"/>
    <path d="M1.25-1.75H1.6V-1.3H1.25" fill="#a3261b"/>
    <path d="M-.4-1.05V-1.45H.35V-1.05Z" fill="#f6ecd4"/>
    <path d="M-.62-1.4Q-.05-1.5.55-1.4Q.2-1.6-.05-1.78Q-.3-1.6-.62-1.4Z" fill="#3b2f2a"/>
    <path d="M-1.45-.45V-1H1.4V-.45Z" fill="#8a6a4a"/>
    <path d="M-1.62-.98Q0-1.12 1.58-.98Q0-1.02-1.62-.98Z" fill="#3b2f2a"/>
    <path d="M-1.2-.78h.2M-.7-.78h.2M-.2-.78h.2M.3-.78h.2M.8-.78h.2" fill="none" stroke-width=".1"/>
    <path d="M-1.75-.5Q-1.7-.05-1.45.08H1.45Q1.75-.1 1.85-.6L1.5-.45H-1.5Z" fill="#6b4a32"/>
    <path d="M-1.3-.2H1.35" fill="none" opacity=".6"/>
    <path d="M-1.1.05L-1.3.6M-.6.07L-.75.65M-.1.08L-.2.68M.4.08L.32.66M.9.06L.86.62" fill="none" opacity=".85"/>
    <path d="M-1.6.85q.3-.15.6 0t.6 0M.3.85q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-lineship" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M1.15-.3L1.85-.68M.72-.32L1.72-.62L.74-1.25Z" fill="#f6ecd4"/>
    <path d="M-.75-.3V-1.75M0-.3V-2.05M.68-.3V-1.6" fill="none"/>
    <path d="M-1.12-1.62Q-.75-1.5-.38-1.62L-.42-1.15Q-.75-1.04-1.08-1.15Z M-1.1-1.02Q-.75-.9-.4-1.02L-.44-.5Q-.75-.4-1.06-.5Z" fill="#f6ecd4"/>
    <path d="M-.4-1.92Q0-1.8.4-1.92L.36-1.42Q0-1.3-.36-1.42Z M-.42-1.3Q0-1.18.42-1.3L.38-.72Q0-.6-.38-.72Z" fill="#f6ecd4"/>
    <path d="M.36-1.5Q.68-1.4 1-1.5L.97-1.02Q.68-.94.39-1.02Z M.38-.92Q.68-.82.98-.92L.95-.48Q.68-.4.41-.48Z" fill="#f6ecd4"/>
    <path d="M0-2.05h.34v.08H0Z" fill="#2a4f8a" stroke="none"/><path d="M0-1.97h.34v.08H0Z" fill="#f6ecd4" stroke="none"/><path d="M0-1.89h.34v.08H0Z" fill="#a3261b" stroke="none"/>
    <path d="M-1.6-.55H-1.05V-.3H1.2L1.15.15Q1-.6.6.68H-1.1Q-1.5.5-1.6-.55Z" fill="#3b2f2a"/>
    <path d="M-1.48-.12H1.17M-1.42.25H1.08" fill="none" stroke="#d9b45a" stroke-width=".13"/>
    <path d="M-1.2-.17h.1v.1h-.1zM-.85-.17h.1v.1h-.1zM-.5-.17h.1v.1h-.1zM-.15-.17h.1v.1h-.1zM.2-.17h.1v.1h-.1zM.55-.17h.1v.1h-.1zM.9-.17h.1v.1h-.1zM-1.1.2h.1v.1h-.1zM-.75.2h.1v.1h-.1zM-.4.2h.1v.1h-.1zM-.05.2h.1v.1h-.1zM.3.2h.1v.1h-.1zM.65.2h.1v.1h-.1z" fill="${INK}" stroke="none"/>
    <path d="M-1.55.95q.3-.15.6 0t.6 0M.3.95q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-compass">${compassRose(quarters)}</g>`;

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
  const ship = (x, y) => use(grid.SHIP ?? 'ship', x, y, 1.5);
  const jitter = (h, shift) => (((h >>> shift) % 100) / 100 - 0.5) * 0.5;
  const DENSITY = { mountains: 3, forest: 4, spruce: 4, oak: 4, desert: 3 }; // one cell in this many gets a drawing
  // Each kind has a few drawings, chosen by the cell: ranges and single peaks; spruce in the north, oak
  // (and the broadleaf of the rainforest) in the south, and between them forest, the three mixed; dunes,
  // now and then a palm.
  const ART = {
    mountains: ['mountain', 'mountain', 'peak'],
    spruce: ['spruce-wood'],
    oak: ['oak-wood'],
    forest: ['spruce-wood', 'oak-wood', 'mixed-wood'],
    desert: ['dunes', 'dunes', 'dunes', 'palm'],
  };
  let land = '';
  let sea = '';
  let deco = ''; // the ships and the compass: drawn stronger than the waves
  if (compass) {
    const size = compass[2] ?? 1.1;
    deco += use('compass', compass[0], compass[1], size);
    take(compass[0], compass[1], 5.3 * size);
  }
  // Ships sail beside the longest sea routes (not those round the back of the map), a little to
  // one side of the dashed line, on open sea. grid.SHIP names the kind ('ship', 'longship', 'galley', 'atakebune' or 'lineship'),
  // grid.SHIP_COUNT how many (3).
  const seaCell = (x, y) => {
    const r = Math.round((y - 1) / 1.5);
    const c = Math.round((x - Math.sqrt(3) / 2) / Math.sqrt(3) - 0.5 * (r & 1));
    return (dist[r]?.[c] ?? 0) >= 1;
  };
  const openSea = (x, y) => {
    const r = Math.round((y - 1) / 1.5);
    const c = Math.round((x - Math.sqrt(3) / 2) / Math.sqrt(3) - 0.5 * (r & 1));
    return (dist[r]?.[c] ?? 0) >= 2; // two cells from any coast
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
        // The whole ship on open water, with a hex to spare (a cell's coast runs up to a hex from its
        // middle): bow, stern, mast top and keel, not only its middle.
        const afloat =
          openSea(x, y) && [[-3.7, 0], [3.7, 0], [0, -3.2], [0, 1.8], [-3, -1.6], [3, -1.6], [-3, .9], [3, .9]].every(([dx, dy]) => seaCell(x + dx, y + dy));
        if (!afloat || !free(x, y, 2.4)) continue;
        deco += ship(x, y);
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
      deco += ship(best.x, best.y);
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
        if (h % DENSITY[kind] === 0 && !coast && free(x, y, 0.9)) land += use(ART[kind][(h >>> 17) % ART[kind].length], x, y, 0.9 + (h % 3) * 0.1);
      } else if (dist[r][c] >= 2 && h % 6 === 0) {
        const x = cx + jitter(h, 4);
        const y = cy + jitter(h, 8);
        if (free(x, y, 0.8) && offRoutes(x, y)) sea += use('wave', x, y, 0.9 + (h % 3) * 0.15);
      }
    }
  }

  return { land, sea, deco };
}
