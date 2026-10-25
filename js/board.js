// The game board in the old paper-map style (DESIGN.md item 1, choice B): parchment, ink coasts,
// a colour wash for each owner and wax-seal counters with the armies. Built once from a hex-grid
// map (see js/maps/world.js); update() then only changes colours, numbers and highlights.
//
// The map is three times wider than tall, so on a phone it is shown zoomed in: drag to move,
// pinch or the +/− buttons to zoom (mouse wheel on a computer). A tap that did not move is a tap
// on a territory and goes to onTap(territory index).

import { mapShapes } from './map-shapes.js';

// Ink-friendly player colours: red, blue, green, ochre, purple, teal. Design item 4 will settle
// them (colour-blind check, symbols).
export const PLAYER_COLORS = ['#a3261b', '#1f5fa8', '#3f7a26', '#c98a12', '#6b3f8f', '#1d7f7a'];

const NS = 'http://www.w3.org/2000/svg';
const INK = '#4a3726';
const LAND = '#f4e8cc';
// Region names sit in the sea next to their land (map units, see design/styles.js).
const REGION_PLACES = { na: [10, 19], sa: [22, 33], eu: [57.5, 5], af: [55, 30], as: [84, 27], oc: [119, 30] };
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
export function createBoard(svg, grid, map, { onTap, insets = () => ({ top: 0, bottom: 0 }) }) {
  const shapes = mapShapes(grid);
  const letterOf = Object.fromEntries(Object.entries(grid.TERRITORIES).map(([l, [id]]) => [id, l]));
  const T = map.territories;
  const W = grid.WIDTH;
  const H = grid.HEIGHT;

  /* ---------- drawing, once ---------- */

  const sea = shapes.sea
    .map(({ p, q, wraps }) =>
      wraps
        ? `M${n(p[0])} ${n(p[1])}L${n(q[0] - W)} ${n(q[1])}M${n(q[0])} ${n(q[1])}L${n(p[0] + W)} ${n(p[1])}`
        : `M${n(p[0])} ${n(p[1])}L${n(q[0])} ${n(q[1])}`,
    )
    .join('');
  const outline = (i) => shapes.outlines[letterOf[T[i].id]];
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
      <filter id="paper" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="3"/>
        <feColorMatrix values="0 0 0 0 .45  0 0 0 0 .33  0 0 0 0 .18  0 0 0 .22 0"/>
      </filter>
      <filter id="ink"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="8" result="t"/>
        <feDisplacementMap in="SourceGraphic" in2="t" scale=".35"/></filter>
    </defs>
    <rect x="${n(-W)}" y="${n(-H)}" width="${n(3 * W)}" height="${n(3 * H)}" fill="#ead9b5"/>
    <rect x="${n(-W)}" y="${n(-H)}" width="${n(3 * W)}" height="${n(3 * H)}" filter="url(#paper)"/>
    <g fill="none" stroke="#6b8a8a" stroke-linejoin="round">
      <path d="${shapes.coast}" stroke-width="2.4" opacity=".08"/>
      <path d="${shapes.coast}" stroke-width="1.5" opacity=".12"/>
      <path d="${shapes.coast}" stroke-width=".8" opacity=".18"/></g>
    <path d="${sea}" fill="none" stroke="${INK}" stroke-width=".16" stroke-dasharray=".1 .45" stroke-linecap="round"/>
    <g class="lands">${T.map((t, i) => `<path class="land" data-t="${i}" d="${outline(i)}" fill="${LAND}"/>`).join('')}</g>
    <g class="washes">${T.map((t, i) => `<path data-t="${i}" d="${outline(i)}" opacity=".4"/>`).join('')}</g>
    <g fill="none" stroke="${INK}" stroke-linejoin="round" filter="url(#ink)" pointer-events="none">
      <path d="${shapes.borders}" stroke-width=".13" stroke-dasharray=".45 .3"/>
      <path d="${shapes.regions}" stroke-width=".24"/>
      <path d="${shapes.coast}" stroke-width=".26"/></g>
    <g class="marks" pointer-events="none">${T.map((t, i) => `<path class="mark" data-t="${i}" d="${outline(i)}"/>`).join('')}</g>
    <g class="region-names" pointer-events="none">${map.regions
      .map((r) => `<text x="${REGION_PLACES[r.id][0]}" y="${REGION_PLACES[r.id][1]}">${r.name} +${r.bonus}</text>`)
      .join('')}</g>
    <g class="seals">${T.map(
      (t, i) => `<g class="seal" data-t="${i}" transform="translate(${n(t.x)} ${n(t.y)})">
        <circle r="1.35" class="wax"/><circle r="1.08" class="rim"/>
        <text class="count" dy=".4"></text><text class="name" ${NAME_AT[grid.WORLD.territories[t.id]?.label ?? 'below']}>${t.name}</text></g>`,
    ).join('')}</g>
    <g class="mirrors">${mirrors
      .map(
        ({ t, xy }) => `<g class="mirror" data-t="${t}" transform="translate(${n(xy[0])} ${n(xy[1])})">
        <circle r="1.6" class="ring"/><circle r="1.15" class="wax"/><circle r=".92" class="rim"/>
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
  function update(s, { selected = new Set(), targets = new Set(), chosen = new Set() } = {}, colors = null) {
    T.forEach((t, i) => {
      const color = PLAYER_COLORS[colors?.[s.owner[i]] ?? s.owner[i]] ?? 'transparent';
      washes[i].setAttribute('fill', color);
      seals[i].querySelector('.wax').setAttribute('fill', s.owner[i] >= 0 ? color : '#b9a98a');
      seals[i].querySelector('.count').textContent = s.owner[i] >= 0 ? s.armies[i] : '';
      marks[i].setAttribute('class', `mark${selected.has(i) ? ' selected' : chosen.has(i) ? ' chosen' : targets.has(i) ? ' target' : ''}`);
    });
    mirrorSeals.forEach((g) => {
      const i = +g.dataset.t;
      g.querySelector('.wax').setAttribute('fill', seals[i].querySelector('.wax').getAttribute('fill'));
      g.querySelector('.count').textContent = seals[i].querySelector('.count').textContent;
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
    view = { x: clamp(x, -pad - side, W - w + pad + side), y: clamp(y, -top * k - pad, H - h + bottom * k + pad), w, h };
    svg.setAttribute('viewBox', `${n(view.x)} ${n(view.y)} ${n(view.w)} ${n(view.h)}`);
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
  // closest together, so names and numbers are readable; the rest is a drag away.
  function focus(list) {
    const b = box();
    if (!list?.length || b.width > 1.6 * b.height) return setView(0, 0, maxW());
    const near = (i) => list.filter((j) => Math.hypot(T[i].x - T[j].x, T[i].y - T[j].y) < 16).length;
    const centre = list.reduce((best, i) => (near(i) > near(best) ? i : best));
    const { top, bottom } = insets();
    const w = Math.min(36, (H * b.width) / (b.height - top - bottom)); // close, but the map fills the free height
    centreOn(T[centre].x, T[centre].y, w);
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
    const to = { ...view };
    setView(from.x, from.y, from.w);
    cancelAnimationFrame(glide);
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / 380);
      const e = 1 - (1 - p) ** 3;
      setView(from.x + (to.x - from.x) * e, from.y + (to.y - from.y) * e, view.w);
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
      const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-t]');
      if (hit && svg.contains(hit)) onTap(+hit.dataset.t);
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

  return { update, flash, focus, reveal, zoomIn: () => zoom(1.4), zoomOut: () => zoom(1 / 1.4), get view() { return view; } };
}
