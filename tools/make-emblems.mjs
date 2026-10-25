// Turns the emblem SVGs in assets/emblems (from game-icons.net, see LICENSES.md) into
// js/emblems.js: one path per emblem, in the players' order, without the icons' black square.
// Run after changing the emblems: node tools/make-emblems.mjs
import { readFileSync, writeFileSync } from 'node:fs';

// Player i has colour i (js/board.js PLAYER_COLORS) and emblem i.
const ORDER = ['lion', 'eagle-emblem', 'galleon', 'stone-tower', 'wolf-head', 'crown'];

const paths = ORDER.map((name) => {
  const svg = readFileSync(`assets/emblems/${name}.svg`, 'utf8');
  if (/script|on\w+=|href/i.test(svg)) throw new Error(`${name}.svg has more than shapes`);
  const shapes = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]).filter((d) => d !== 'M0 0h512v512H0z');
  if (shapes.length !== 1) throw new Error(`${name}.svg: expected one shape, found ${shapes.length}`);
  return shapes[0];
});

writeFileSync(
  'js/emblems.js',
  `// Player emblems, made by tools/make-emblems.mjs from assets/emblems. Icons by Lorc,
// game-icons.net, CC BY 3.0 (see LICENSES.md). Each is one path in a 512 × 512 box.
export const EMBLEM_NAMES = ${JSON.stringify(ORDER)};
export const EMBLEMS = [
${paths.map((d) => `  '${d}',`).join('\n')}
];
`,
);
console.log(`js/emblems.js: ${paths.length} emblems`);
