// The app's icon: a red wax seal with the crown, on the dark of the start screen. Writes
// assets/icon.svg (the browser tab, with rounded corners) and tools/icon-full.svg (filling the square,
// for the home screen, which cuts it to the phone's own shape; the seal keeps inside the safe circle).
// The crown is the sixth player emblem (js/emblems.js, game-icons.net, CC BY 3.0, LICENSES.md).
// Run: node tools/make-icons.mjs. The PNGs of manifest.webmanifest come from tools/icon-full.svg:
// a 512 × 512 screenshot of it with the dev server running (msedge --headless --window-size=512,512
// --screenshot=assets/icon-512.png http://localhost:5183/tools/icon-full.svg), scaled to 192 and 180.
import { writeFileSync } from 'node:fs';
import { EMBLEMS } from '../js/emblems.js';

const CROWN = EMBLEMS[5];
const BACK = '#1a1007';

// radius: the seal's radius in a 512 box; round: corner radius of the back (0: it fills the square,
// for icons the phone cuts to its own shape).
function icon(radius, round) {
  const crown = radius * 1.2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${round}" fill="${BACK}"/>
  <circle cx="256" cy="256" r="${radius}" fill="#a3261b" stroke="#5e130c" stroke-width="${radius * 0.07}"/>
  <circle cx="256" cy="256" r="${radius * 0.84}" fill="none" stroke="#e8c27a" stroke-opacity=".55" stroke-width="${radius * 0.03}"/>
  <svg x="${256 - crown / 2}" y="${256 - crown / 2 - radius * 0.03}" width="${crown}" height="${crown}" viewBox="0 0 512 512"><path d="${CROWN}" fill="#f0cf86"/></svg>
</svg>
`;
}

writeFileSync('assets/icon.svg', icon(220, 104));
writeFileSync('tools/icon-full.svg', icon(176, 0));
console.log('assets/icon.svg, tools/icon-full.svg');
