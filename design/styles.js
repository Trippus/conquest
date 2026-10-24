// Style samples for the world map (DESIGN.md item 1): the same map and the same game, drawn three
// ways. Only for choosing a direction; the game will use one of them.
import * as W from '../js/maps/world.js';
import { mapShapes } from '../js/map-shapes.js';
import * as G from '../js/engine.js';
import { botAction } from '../js/ai.js';
import { MODERN } from '../js/rules/modern.js';

const map = G.prepareMap(W.WORLD);
const shapes = mapShapes(W);

// A game played by normal bots into its third round, stopped as the first player starts to
// attack, so the samples show a real situation with a freshly built stack.
let s = G.newGame(map, MODERN, { players: ['A', 'B', 'C', 'D'], seed: 24 });
while (s.round < 3 || s.current !== 0 || s.phase !== 'attack') s = G.apply(map, MODERN, s, botAction(map, MODERN, s, 'normal')).state;

const letters = Object.keys(W.TERRITORIES);
const ownerOf = (l) => s.owner[map.at[W.TERRITORIES[l][0]]];
const armiesOf = (l) => s.armies[map.at[W.TERRITORIES[l][0]]];
const placeOf = (l) => {
  const t = W.WORLD.territories[W.TERRITORIES[l][0]];
  return [t.x, t.y];
};
const n = (v) => +v.toFixed(2);

// Region names sit in the sea next to their land (hand-placed, in map units).
const REGION_PLACES = { na: [10, 19], sa: [22, 33], eu: [57.5, 5], af: [55, 30], as: [84, 27], oc: [119, 30] };
const regionLabels = (cls) =>
  Object.entries(W.REGIONS)
    .map(([r, name]) => `<text x="${REGION_PLACES[r][0]}" y="${REGION_PLACES[r][1]}" class="${cls}">${name}</text>`)
    .join('');

function seaLines(stroke) {
  return shapes.sea
    .map(({ p, q, wraps }) =>
      wraps
        ? `<path d="M${n(p[0])} ${n(p[1])}L${n(q[0] - W.WIDTH)} ${n(q[1])}M${n(q[0])} ${n(q[1])}L${n(p[0] + W.WIDTH)} ${n(p[1])}" ${stroke}/>`
        : `<path d="M${n(p[0])} ${n(p[1])}L${n(q[0])} ${n(q[1])}" ${stroke}/>`,
    )
    .join('');
}

const svg = (body, bg) =>
  `<svg viewBox="0 0 ${n(W.WIDTH)} ${n(W.HEIGHT)}" xmlns="http://www.w3.org/2000/svg" style="background:${bg}">${body}</svg>`;

/* ---------- A: board game ---------- */

function boardGame() {
  const color = ['#d9503f', '#3a78c8', '#3f9b55', '#e09a26'];
  const light = ['#f1b2a7', '#a8c5ea', '#a9d6b4', '#f3d397'];
  const land = letters.map((l) => `<path d="${shapes.outlines[l]}" fill="${light[ownerOf(l)]}"/>`).join('');
  const regions = regionLabels('a-region');
  const pieces = letters
    .map((l) => {
      const [x, y] = placeOf(l);
      return `<g transform="translate(${n(x)} ${n(y)})">
        <circle r="1.25" fill="${color[ownerOf(l)]}" stroke="#fff" stroke-width=".25"/>
        <text class="a-count" dy=".42">${armiesOf(l)}</text>
        <text class="a-name" dy="2.25">${W.TERRITORIES[l][1]}</text></g>`;
    })
    .join('');
  return svg(
    `<defs><pattern id="waves" width="3" height="1.6" patternUnits="userSpaceOnUse">
      <path d="M0 .8q.75-.5 1.5 0t1.5 0" fill="none" stroke="#a9cbd7" stroke-width=".08"/></pattern></defs>
    <rect width="100%" height="100%" fill="url(#waves)"/>
    <path d="${shapes.coast}" fill="none" stroke="#e8f3f6" stroke-width="1.3" stroke-linejoin="round" opacity=".9"/>
    ${seaLines('fill="none" stroke="#4d6f7c" stroke-width=".16" stroke-dasharray=".6 .45"')}
    ${land}
    <path d="${shapes.borders}" fill="none" stroke="#fff" stroke-width=".22" stroke-linejoin="round"/>
    <path d="${shapes.regions}" fill="none" stroke="#5c4a3d" stroke-width=".3" stroke-linejoin="round" opacity=".7"/>
    <path d="${shapes.coast}" fill="none" stroke="#4d6f7c" stroke-width=".22" stroke-linejoin="round"/>
    ${regions}${pieces}`,
    '#c4dde6',
  );
}

/* ---------- B: old paper map ---------- */

function paperMap() {
  const ink = '#4a3726';
  const color = ['#a3261b', '#1f5fa8', '#3f7a26', '#c98a12'];
  const wash = letters.map((l) => `<path d="${shapes.outlines[l]}" fill="${color[ownerOf(l)]}" opacity=".4" filter="url(#wash)"/>`).join('');
  const regions = regionLabels('b-region');
  const pieces = letters
    .map((l) => {
      const [x, y] = placeOf(l);
      const c = color[ownerOf(l)];
      return `<g transform="translate(${n(x)} ${n(y)})">
        <circle r="1.2" fill="${c}" stroke="#2b1d12" stroke-width=".12"/>
        <circle r=".95" fill="none" stroke="#f3e6c8" stroke-width=".07" opacity=".7"/>
        <text class="b-count" dy=".38">${armiesOf(l)}</text>
        <text class="b-name" dy="2.2">${W.TERRITORIES[l][1]}</text></g>`;
    })
    .join('');
  const compass = `<g transform="translate(91 35.5)" stroke="${ink}" stroke-width=".08">
    <circle r="2.6" fill="none"/><circle r="2.3" fill="none" stroke-dasharray=".15 .15"/>
    <path d="M0-3.4L.5-.5L0 0L-.5-.5Z" fill="${ink}"/><path d="M0 3.4L.5 .5L0 0L-.5 .5Z" fill="#f3e6c8"/>
    <path d="M-3.4 0L-.5-.5L0 0L-.5 .5Z" fill="#f3e6c8"/><path d="M3.4 0L.5-.5L0 0L.5 .5Z" fill="${ink}"/>
    <text y="-3.8" class="b-n" stroke="none">N</text></g>`;
  return svg(
    `<defs>
      <filter id="paper" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="3"/>
        <feColorMatrix values="0 0 0 0 .45  0 0 0 0 .33  0 0 0 0 .18  0 0 0 .22 0"/>
      </filter>
      <filter id="ink"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="8" result="t"/>
        <feDisplacementMap in="SourceGraphic" in2="t" scale=".35"/></filter>
      <filter id="wash"><feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="2" seed="5" result="t"/>
        <feDisplacementMap in="SourceGraphic" in2="t" scale=".9"/></filter>
    </defs>
    <rect width="100%" height="100%" filter="url(#paper)"/>
    <g fill="none" stroke="#6b8a8a" stroke-linejoin="round">
      <path d="${shapes.coast}" stroke-width="2.4" opacity=".08"/>
      <path d="${shapes.coast}" stroke-width="1.5" opacity=".12"/>
      <path d="${shapes.coast}" stroke-width=".8" opacity=".18"/></g>
    ${seaLines(`fill="none" stroke="${ink}" stroke-width=".13" stroke-dasharray=".1 .4" stroke-linecap="round"`)}
    ${letters.map((l) => `<path d="${shapes.outlines[l]}" fill="#f4e8cc"/>`).join('')}
    ${wash}
    <g fill="none" stroke="${ink}" stroke-linejoin="round" filter="url(#ink)">
      <path d="${shapes.borders}" stroke-width=".11" stroke-dasharray=".45 .3"/>
      <path d="${shapes.regions}" stroke-width=".2"/>
      <path d="${shapes.coast}" stroke-width=".24"/></g>
    ${compass}${regions}${pieces}
    <rect x=".6" y=".6" width="${n(W.WIDTH - 1.2)}" height="${n(W.HEIGHT - 1.2)}" fill="none" stroke="${ink}" stroke-width=".25"/>
    <rect x="1" y="1" width="${n(W.WIDTH - 2)}" height="${n(W.HEIGHT - 2)}" fill="none" stroke="${ink}" stroke-width=".08"/>`,
    '#ead9b5',
  );
}

/* ---------- C: tactical screen ---------- */

function tactical() {
  const color = ['#ff4d5e', '#3da5ff', '#3ddc84', '#ffb84d'];
  const hex = (row, col, scale) => {
    const [cx, cy] = W.hexCenter(row, col);
    return W.hexCorners(row, col)
      .map(([x, y]) => `${n(cx + (x - cx) * scale)},${n(cy + (y - cy) * scale)}`)
      .join(' ');
  };
  let grid = '';
  let tiles = '';
  W.GRID.forEach((line, row) =>
    [...line].forEach((l, col) => {
      if (l === '.') grid += `<polygon points="${hex(row, col, 0.9)}"/>`;
      else tiles += `<polygon points="${hex(row, col, 0.86)}" fill="${color[ownerOf(l)]}"/>`;
    }),
  );
  const pieces = letters
    .map((l) => {
      const [x, y] = placeOf(l);
      const c = color[ownerOf(l)];
      return `<g transform="translate(${n(x)} ${n(y)})">
        <rect x="-1.35" y="-.8" width="2.7" height="1.6" rx=".3" fill="#0b1420" stroke="${c}" stroke-width=".16"/>
        <text class="c-count" dy=".4" fill="${c}">${armiesOf(l)}</text>
        <text class="c-name" dy="2">${W.TERRITORIES[l][1].toUpperCase()}</text></g>`;
    })
    .join('');
  return svg(
    `<defs><filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation=".35" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <g fill="none" stroke="#14243a" stroke-width=".06">${grid}</g>
    <g opacity=".42">${tiles}</g>
    ${seaLines('fill="none" stroke="#3fd0ff" stroke-width=".12" stroke-dasharray=".5 .4" opacity=".6"')}
    <path d="${shapes.borders}" fill="none" stroke="#0b1420" stroke-width=".3"/>
    <path d="${shapes.regions}" fill="none" stroke="#9fb3c8" stroke-width=".14" stroke-dasharray=".7 .3" opacity=".8"/>
    <path d="${shapes.coast}" fill="none" stroke="#3fd0ff" stroke-width=".14" filter="url(#glow)"/>
    ${pieces}`,
    '#0b1420',
  );
}

/* ---------- the division, as a table ---------- */

function division() {
  const rows = Object.entries(W.REGIONS).map(([r, name]) => {
    const own = letters.filter((l) => W.TERRITORIES[l][2] === r);
    return `<tr><th>${name}</th><td>${W.WORLD.regions[r].bonus}</td><td>${own.map((l) => W.TERRITORIES[l][1]).join(', ')}</td></tr>`;
  });
  const sea = W.SEA.map(([a, b]) => `${W.TERRITORIES[a][1]} – ${W.TERRITORIES[b][1]}`).join(' · ');
  return `<table><thead><tr><th>Region</th><th>Bonus</th><th>Territorier</th></tr></thead><tbody>${rows.join('')}</tbody></table>
    <p class="note"><b>Havruter:</b> ${sea}</p>`;
}

document.getElementById('a').innerHTML = boardGame();
document.getElementById('b').innerHTML = paperMap();
document.getElementById('c').innerHTML = tactical();
document.getElementById('division').innerHTML = division();
