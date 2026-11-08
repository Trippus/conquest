// The game board in the old paper-map style (DESIGN.md item 1, choice B): parchment, ink coasts,
// a colour wash for each owner and wax-seal counters with the armies. Built once from a hex-grid
// map (see js/maps/world.js); update() then only changes colours, numbers and highlights.
//
// The map is three times wider than tall, so on a phone it is shown zoomed in: drag to move,
// pinch or the +/− buttons to zoom (mouse wheel on a computer). A tap that did not move is a tap
// on a territory and goes to onTap(territory index).

import { mapShapes, regionShapes } from './map-shapes.js';
import { mapArt, artDefs } from './map-art.js';
import { EMBLEMS } from './emblems.js';

// Ink-friendly player colours: red, blue, green, ochre, purple, teal. Design item 4 will settle
// them (colour-blind check, symbols).
// The players' colours. "clear" is for colour-blind players: red and green, blue and purple look
// alike to many of them, so this set differs in lightness as well (checked by simulating the three
// kinds of colour blindness; every pair stays at least 23 apart in CIELAB, the normal set falls to 8).
export const PALETTES = {
  normal: ['#a3261b', '#1f5fa8', '#3f7a26', '#c98a12', '#6b3f8f', '#1d7f7a'],
  clear: ['#981600', '#003f9a', '#008146', '#d49020', '#cc3c92', '#4a4540'],
};
export const PLAYER_COLORS = [...PALETTES.normal];
// Changes the colours in place: everything reading PLAYER_COLORS draws with the new ones.
export function usePalette(name) {
  PLAYER_COLORS.splice(0, PLAYER_COLORS.length, ...(PALETTES[name] ?? PALETTES.normal));
  document.body.classList.toggle('clear-colors', name === 'clear');
}
// Each colour has an emblem too (js/emblems.js: lion, eagle, galleon, tower, wolf, crown), so the
// players can be told apart without seeing colour. A small SVG of colour i for lists and dialogs:
export const sealIcon = (i) =>
  `<svg class="seal-icon" viewBox="-1.35 -1.35 2.7 2.7" aria-hidden="true"><circle r="1.3" fill="${PLAYER_COLORS[i]}" stroke="#2b1d12" stroke-width=".1"/>` +
  `<svg x="-1" y="-1" width="2" height="2" viewBox="0 0 512 512"><path d="${EMBLEMS[i]}" fill="#f4e8cc" opacity=".9"/></svg></svg>`;

const NS = 'http://www.w3.org/2000/svg';
const INK = '#4a3726';
const LAND = '#f4e8cc';
const TAP_SLOP = 8; // px a finger may move and still count as a tap

const n = (v) => +v.toFixed(2);
// Where a territory's name goes relative to its seal.
const NAME_AT = {
  below: 'dy="2.45"',
  above: 'dy="-1.75"',
  left: 'x="-1.6" dy=".35" text-anchor="end"',
  right: 'x="1.6" dy=".35" text-anchor="start"',
};

// insets(): how many pixels at the top and bottom of the screen are covered by panels, so the map
// can be moved out from under them and is centred in what is left.
// onRegion(r): a region's name was tapped. quarters: the compass rose's N, E, S, W in the player's language.
export function createBoard(svg, grid, map, { onTap, onRegion = () => {}, insets = () => ({ top: 0, bottom: 0 }), quarters }) {
  const shapes = mapShapes(grid);
  const regionOutlines = regionShapes(grid);
  const letterOf = Object.fromEntries(Object.entries(grid.TERRITORIES).map(([l, [id]]) => [id, l]));
  const T = map.territories;
  const W = grid.WIDTH;
  const H = grid.HEIGHT;
  // Region names sit in the sea next to their land (map units).
  const { REGION_PLACES, COMPASS, LANDMARKS = [] } = grid;

  /* ---------- drawing, once ---------- */

  const sea = shapes.sea
    .map(({ p, q, wraps }) =>
      wraps
        ? `M${n(p[0])} ${n(p[1])}L${n(q[0] - W)} ${n(q[1])}M${n(q[0])} ${n(q[1])}L${n(p[0] + W)} ${n(p[1])}`
        : `M${n(p[0])} ${n(p[1])}L${n(q[0])} ${n(q[1])}`,
    )
    .join('');
  const outline = (i) => shapes.outlines[letterOf[T[i].id]];
  const unexplored = shapes.outlines['#'] ?? '';
  // Parallel lines 1.1 apart at 40° over the whole map, for the unexplored land's hatching.
  const hatching = () => {
    const a = (40 * Math.PI) / 180;
    const [nx, ny] = [Math.cos(a), Math.sin(a)]; // across the lines
    const [tx, ty] = [-ny, nx]; // along them
    const reach = W + H;
    let d = '';
    for (let c = -reach; c <= reach; c += 1.1) {
      const [x, y] = [W / 2 + nx * c, H / 2 + ny * c];
      d += `M${n(x - tx * reach)} ${n(y - ty * reach)}L${n(x + tx * reach)} ${n(y + ty * reach)}`;
    }
    return d;
  };
  // Map art keeps out of every seal, name and region name.
  const clear = (x, y, w, h) => ({ x0: x - w, y0: y - h, x1: x + w, y1: y + h });
  const nameBox = (t) => {
    const half = t.name.length * 0.27 + 0.3;
    const side = grid.MAP.territories[t.id]?.label ?? 'below';
    if (side === 'above') return clear(t.x, t.y - 2, half, 0.8);
    if (side === 'left') return clear(t.x - 1.6 - half, t.y, half, 0.8);
    if (side === 'right') return clear(t.x + 1.6 + half, t.y, half, 0.8);
    return clear(t.x, t.y + 2.2, half, 0.8);
  };
  const art = mapArt(grid, {
    keepClear: [
      ...T.map((t) => clear(t.x, t.y, 1.6, 1.6)),
      ...T.map(nameBox),
      ...map.regions.map((r) => clear(REGION_PLACES[r.id][0], REGION_PLACES[r.id][1] - 0.5, (r.name.length + 3) * 0.55, 1.1)),
      ...LANDMARKS.map(([x, y, name]) => clear(x, y - 0.5, name.length * 0.55, 1.1)),
    ],
    seaLines: shapes.sea.map(({ p, q }) => [p[0], p[1], q[0], q[1]]),
    compass: COMPASS,
  });
  // Sea routes over the edge of the map (Alaska–Østsibirien) end in a mirror seal: the territory on
  // the far side, shown at this edge with its colour and armies, and tappable like the real one.
  const indexOf = (letter) => map.at[grid.TERRITORIES[letter][0]];
  const mirrors = shapes.sea
    .filter((r) => r.wraps)
    .flatMap(({ from, to, p, q }) => {
      const shift = (a, b) => (a[0] < b[0] ? -W : W); // where b's mirror lies, seen from a
      const at = (a, b) => [(a[0] + b[0] + shift(a, b)) / 2, (a[1] + b[1]) / 2];
      return [
        { t: indexOf(to), xy: at(p, q) },
        { t: indexOf(from), xy: at(q, p) },
      ];
    });
  svg.setAttribute('viewBox', `0 0 ${n(W)} ${n(H)}`);
  svg.innerHTML = `
    <defs>
      <pattern id="paper" patternUnits="userSpaceOnUse" width="22" height="22">
        <image href="assets/paper.jpg" width="22" height="22" preserveAspectRatio="none"/>
      </pattern>
      ${EMBLEMS.map((d, i) => `<symbol id="emblem-${i}" viewBox="0 0 512 512"><path d="${d}"/></symbol>`).join('')}
      ${artDefs(quarters)}
      <clipPath id="unexplored"><path d="${unexplored}" clip-rule="evenodd"/></clipPath>
      <filter id="ink"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="8" result="t"/>
        <feDisplacementMap in="SourceGraphic" in2="t" scale=".35"/></filter>
    </defs>
    <rect x="${n(-W)}" y="${n(-H)}" width="${n(3 * W)}" height="${n(3 * H)}" fill="#ead9b5"/>

    <g fill="none" stroke="#6b8a8a" stroke-linejoin="round">
      <path d="${shapes.coast}" stroke-width="2.4" opacity=".08"/>
      <path d="${shapes.coast}" stroke-width="1.5" opacity=".12"/>
      <path d="${shapes.coast}" stroke-width=".8" opacity=".18"/></g>
    <g class="art waves" pointer-events="none" opacity=".5">${art.sea}</g>
    <g class="art deco" pointer-events="none" opacity=".85">${art.deco}</g>
    <path d="${sea}" fill="none" stroke="${INK}" stroke-width=".16" stroke-dasharray=".1 .45" stroke-linecap="round"/>
    <!-- Land outside the game: fine hatching, like the unexplored parts of an old map. The lines are
         drawn once and clipped to the land; an SVG pattern is redrawn on every zoom and flickers. -->
    <path class="unexplored" d="${unexplored}"/>
    <path class="hatch" d="${unexplored ? hatching() : ''}" clip-path="url(#unexplored)"/>
    <g class="lands">${T.map((t, i) => `<path class="land" data-t="${i}" d="${outline(i)}" fill="${LAND}"/>`).join('')}</g>
    <g class="washes">${T.map((t, i) => `<path data-t="${i}" d="${outline(i)}" opacity=".4"/>`).join('')}</g>
    <!-- Each region has a band along its outline, like the hand-coloured borders of an old map. Not
         clipped to the region: clipping is redrawn on every zoom and makes the land flicker. -->
    <g class="region-bands" pointer-events="none">${map.regions
      .map((r, i) => `<path data-region="${i}" d="${regionOutlines[r.id]}"/>`)
      .join('')}</g>
    <!-- Rivers are shapes that widen downstream (map-art.js, riverShapes); roads are dashed lines. -->
    <g class="rivers" pointer-events="none">
      <path d="${art.rivers.halo}" fill="#a9c4bf" opacity=".55"/>
      <path d="${art.rivers.line}" fill="#5f8580"/>
      <path d="${art.roads}" fill="none" stroke="#7a5236" stroke-width=".3" stroke-dasharray="1 .7" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/></g>
    <g class="art" pointer-events="none" opacity=".9">${art.land}</g>
    <!-- Crumpled paper over land and sea alike (CC0 texture, see LICENSES.md). Not blended
         (multiply): blending made every redraw costlier, and the land flickered while zooming. -->
    <rect x="${n(-W)}" y="${n(-H)}" width="${n(3 * W)}" height="${n(3 * H)}" class="paper" fill="url(#paper)" pointer-events="none" opacity=".18"/>
    <g class="ink" fill="none" stroke="${INK}" stroke-linejoin="round" filter="url(#ink)" pointer-events="none">
      <path d="${shapes.borders}" stroke-width=".13" stroke-dasharray=".45 .3"/>
      <path d="${shapes.regions}" stroke-width=".24"/>
      <path d="${shapes.coast}" stroke-width=".26"/>
      <path d="${shapes.frontier}" stroke-width=".2"/>
      <path d="${shapes.shore}" stroke-width=".18" opacity=".6"/></g>
    <g class="marks" pointer-events="none">${T.map((t, i) => `<path class="mark" data-t="${i}" d="${outline(i)}"/>`).join('')}</g>
    <g class="region-names">${map.regions
      .map((r, i) => `<text data-region="${i}" x="${REGION_PLACES[r.id][0]}" y="${REGION_PLACES[r.id][1]}">${r.name} +${r.bonus}</text>`)
      .join('')}${LANDMARKS.map(([x, y, name]) => `<text class="landmark" x="${x}" y="${y}">${name}</text>`).join('')}</g>
    <g class="seals">${T.map(
      (t, i) => `<g class="seal" data-t="${i}" transform="translate(${n(t.x)} ${n(t.y)})">
        <circle r="1.35" class="wax"/><use class="emblem" x="-1.08" y="-1.08" width="2.16" height="2.16"/><circle r="1.08" class="rim"/>
        <text class="count" dy=".4"></text><text class="name" ${NAME_AT[grid.MAP.territories[t.id]?.label ?? 'below']}>${t.name}</text></g>`,
    ).join('')}</g>
    <g class="mirrors">${mirrors
      .map(
        ({ t, xy }) => `<g class="mirror" data-t="${t}" transform="translate(${n(xy[0])} ${n(xy[1])})">
        <circle r="1.6" class="ring"/><circle r="1.15" class="wax"/><use class="emblem" x="-.92" y="-.92" width="1.84" height="1.84"/><circle r=".92" class="rim"/>
        <text class="count" dy=".38"></text><text class="name" dy="2.2">${T[t].name}</text></g>`,
      )
      .join('')}</g>`;

  const washes = [...svg.querySelectorAll('.washes path')];
  const marks = [...svg.querySelectorAll('.mark')];
  const seals = [...svg.querySelectorAll('.seal')];
  const mirrorSeals = [...svg.querySelectorAll('.mirror')];

  /* ---------- state ---------- */

  // marks: { selected: Set, targets: Set, chosen: Set }. colors: each player's colour (an index
  // into PLAYER_COLORS), when it is not simply their seat number.
  // Sets an attribute or text only when it changes: every change makes the phone redraw.
  const set = (el, name, value) => {
    if (value === null) {
      if (el.hasAttribute(name)) el.removeAttribute(name);
    } else if (el.getAttribute(name) !== value) el.setAttribute(name, value);
  };
  const text = (el, value) => {
    if (el.textContent !== value) el.textContent = value;
  };

  function update(s, { selected = new Set(), targets = new Set(), chosen = new Set() } = {}, colors = null) {
    T.forEach((t, i) => {
      const look = colors?.[s.owner[i]] ?? s.owner[i]; // colour and emblem number
      const color = PLAYER_COLORS[look] ?? 'transparent';
      set(seals[i].querySelector('.emblem'), 'href', look >= 0 ? `#emblem-${look}` : null);
      set(washes[i], 'fill', color);
      set(seals[i].querySelector('.wax'), 'fill', s.owner[i] >= 0 ? color : '#b9a98a');
      text(seals[i].querySelector('.count'), s.owner[i] >= 0 ? String(s.armies[i]) : '');
      set(marks[i], 'class', `mark${selected.has(i) ? ' selected' : chosen.has(i) ? ' chosen' : targets.has(i) ? ' target' : ''}`);
    });
    mirrorSeals.forEach((g) => {
      const i = +g.dataset.t;
      g.querySelector('.wax').setAttribute('fill', seals[i].querySelector('.wax').getAttribute('fill'));
      g.querySelector('.count').textContent = seals[i].querySelector('.count').textContent;
      const emblem = seals[i].querySelector('.emblem').getAttribute('href');
      if (emblem) g.querySelector('.emblem').setAttribute('href', emblem);
      else g.querySelector('.emblem').removeAttribute('href');
      g.setAttribute('class', `mirror${selected.has(i) ? ' selected' : chosen.has(i) ? ' chosen' : targets.has(i) ? ' target' : ''}`);
    });
  }

  // kind: 'stamp' when armies are placed or moved, 'conquer' when the territory changes hands.
  function flash(i, kind = 'stamp') {
    const seal = seals[i];
    seal.classList.remove('stamp', 'conquer');
    washes[i].classList.remove('conquer');
    void seal.getBBox();
    seal.classList.add(kind);
    if (kind === 'conquer') washes[i].classList.add('conquer');
  }

  /* ---------- pan and zoom ---------- */

  let view = { x: 0, y: 0, w: W, h: H };
  const box = () => svg.getBoundingClientRect();
  const minW = 22;
  // Zoomed all the way out the whole map fits, with a little paper round it.
  const maxW = () => {
    const b = box();
    return Math.max(W, (H * b.width) / b.height) * 1.04;
  };

  function setView(x, y, w) {
    const b = box();
    if (!b.width || !b.height) return;
    w = Math.min(maxW(), Math.max(minW, w));
    const h = (w * b.height) / b.width;
    // Stay near the map: every edge can come a little way into view, and the top and bottom can
    // be pulled clear of the panels that cover them. A map smaller than the view sits in the middle.
    const k = w / b.width; // map units per pixel
    const pad = 24 * k;
    const { top, bottom } = insets();
    const clamp = (v, lo, hi) => (lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v)));
    const side = 3; // room beyond the left and right edge for the mirror seals
    show({ x: clamp(x, -pad - side, W - w + pad + side), y: clamp(y, -top * k - pad, H - h + bottom * k + pad), w, h });
  }
  function show(v) {
    view = v;
    svg.setAttribute('viewBox', `${n(v.x)} ${n(v.y)} ${n(v.w)} ${n(v.h)}`);
  }
  // Zoom by `factor` (> 1 zooms in) keeping the map point under (px, py) in place.
  function zoomAt(factor, px, py) {
    const b = box();
    const mx = view.x + ((px - b.left) / b.width) * view.w;
    const my = view.y + ((py - b.top) / b.height) * view.h;
    const w = Math.min(maxW(), Math.max(minW, view.w / factor));
    const h = (w * b.height) / b.width;
    setView(mx - ((px - b.left) / b.width) * w, my - ((py - b.top) / b.height) * h, w);
  }
  // On a wide screen: the whole map. On a phone: zoomed in to where the given territories lie
  // closest together, so names and numbers are readable; the rest is a drag away. glide: the time
  // in ms to glide there from where the map is now (a togt begins with it).
  function focus(list, { glide: ms = 0 } = {}) {
    const from = { ...view };
    const b = box();
    if (!list?.length || b.width > 1.6 * b.height) setView(0, 0, maxW());
    else {
      const near = (i) => list.filter((j) => Math.hypot(T[i].x - T[j].x, T[i].y - T[j].y) < 16).length;
      const centre = list.reduce((best, i) => (near(i) > near(best) ? i : best));
      const { top, bottom } = insets();
      const w = Math.min(36, (H * b.width) / (b.height - top - bottom)); // close, but the map fills the free height
      centreOn(T[centre].x, T[centre].y, w);
    }
    if (ms) glideFrom(from, ms, (p) => (p < 0.5 ? 4 * p ** 3 : 1 - (2 - 2 * p) ** 3 / 2));
  }

  // Puts map point (x, y) in the middle of the part of the screen the panels leave free.
  function centreOn(x, y, w = view.w) {
    const b = box();
    const { top, bottom } = insets();
    const k = w / b.width;
    setView(x - w / 2, y - (top + (b.height - top - bottom) / 2) * k, w);
  }

  // Glides the map so territory i is in view (used to follow the troops); nothing if it already is.
  let glide = 0;
  function reveal(i) {
    const b = box();
    const { top, bottom } = insets();
    const k = view.w / b.width;
    const t = T[i];
    const margin = 3;
    const inside =
      t.x > view.x + margin && t.x < view.x + view.w - margin && t.y > view.y + top * k + margin && t.y < view.y + view.h - bottom * k - margin;
    if (inside) return;
    const from = { ...view };
    centreOn(t.x, t.y);
    glideFrom(from, 380, (p) => 1 - (1 - p) ** 3);
  }

  // Glides from an earlier view to the view now set, in ms, with the easing ease(0..1). Both ends are
  // views setView allowed, so the way between is not held back at the map's edges: that held the map
  // still for a moment halfway through the zoom at the start of a togt, and it seemed to stutter.
  function glideFrom(from, ms, ease) {
    const to = { ...view };
    show(from);
    cancelAnimationFrame(glide);
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / ms);
      const e = ease(p);
      const at = (k) => from[k] + (to[k] - from[k]) * e;
      show({ x: at('x'), y: at('y'), w: at('w'), h: at('h') });
      if (p < 1) glide = requestAnimationFrame(step);
    };
    glide = requestAnimationFrame(step);
  }

  const pointers = new Map();
  let moved = 0;
  let pinch = null;
  svg.addEventListener('pointerdown', (e) => {
    cancelAnimationFrame(glide); // a finger on the map stops it gliding
    svg.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size === 1) moved = 0;
    if (pointers.size === 2) {
      const [a, c] = [...pointers.values()];
      pinch = Math.hypot(a[0] - c[0], a[1] - c[1]);
      moved = Infinity; // two fingers never tap
    }
  });
  svg.addEventListener('pointermove', (e) => {
    const last = pointers.get(e.pointerId);
    if (!last) return;
    const now = [e.clientX, e.clientY];
    pointers.set(e.pointerId, now);
    if (pointers.size === 1) {
      const b = box();
      const dx = now[0] - last[0];
      const dy = now[1] - last[1];
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > TAP_SLOP) setView(view.x - (dx / b.width) * view.w, view.y - (dy / b.height) * view.h, view.w);
    } else if (pointers.size === 2 && pinch) {
      const [a, c] = [...pointers.values()];
      const d = Math.hypot(a[0] - c[0], a[1] - c[1]);
      zoomAt(d / pinch, (a[0] + c[0]) / 2, (a[1] + c[1]) / 2);
      pinch = d;
    }
  });
  const release = (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (e.type === 'pointerup' && !pointers.size && moved <= TAP_SLOP) {
      // The pointer is captured by the svg, so find what is under it by position.
      const under = document.elementFromPoint(e.clientX, e.clientY);
      const hit = under?.closest('[data-t]');
      const region = under?.closest('[data-region]');
      if (hit && svg.contains(hit)) onTap(+hit.dataset.t);
      else if (region && svg.contains(region)) onRegion(+region.dataset.region);
    }
  };
  svg.addEventListener('pointerup', release);
  svg.addEventListener('pointercancel', release);
  svg.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY);
    },
    { passive: false },
  );
  // Keep the zoom when the screen turns or the window is resized.
  new ResizeObserver(() => setView(view.x, view.y, view.w)).observe(svg);

  const zoom = (factor) => {
    const b = box();
    zoomAt(factor, b.left + b.width / 2, b.top + b.height / 2);
  };

  // Lights up region r's band for a moment.
  const bands = [...svg.querySelectorAll('.region-bands path')];
  let lit = 0;
  function showRegion(r) {
    bands.forEach((b, i) => b.classList.toggle('lit', i === r));
    clearTimeout(lit);
    lit = setTimeout(() => bands[r].classList.remove('lit'), 3000);
  }

  return { update, flash, focus, reveal, showRegion, zoomIn: () => zoom(1.4), zoomOut: () => zoom(1 / 1.4), get view() { return view; } };
}
