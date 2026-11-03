// Photographs every map, empty and whole and tinted by region, as a small picture
// (assets/maps/<map>.jpg): the free game's map choice shows them for maps whose togt has no picture
// of its own (togter.js, art), and so does the togt. Needs the dev server: npm start, then npm run
// map-shots. Run it again when a map changes.
import { mkdirSync, writeFileSync } from 'node:fs';
import { withEdge, sleep } from './edge.mjs';
import { MAPS } from '../js/maps/index.js';

const view = { width: 480, height: 300, deviceScaleFactor: 1.5, mobile: false };
mkdirSync('assets/maps', { recursive: true });
await withEdge(async (page) => {
  for (const id of Object.keys(MAPS)) {
    await page.open('http://localhost:5183/', view);
    await page.eval(`localStorage.clear(); localStorage.setItem('conquest.settings', JSON.stringify({ map: '${id}' })); localStorage.setItem('conquest.progress', JSON.stringify({ welcomed: true, won: Object.fromEntries(${JSON.stringify(Object.keys(MAPS))}.map((m) => [m, 'hard'])) }))`);
    await page.open('http://localhost:5183/', view);
    // Only the map, without its seals and names (specks this small): the panels move off the
    // screen, so the map has all of it.
    await page.eval(`for (const id of ['intro', 'zoom', 'toast', 'dice']) document.getElementById(id).hidden = true;
      for (const [id, y] of [['hud', -200], ['bar', 200]]) Object.assign(document.getElementById(id).style, { transform: 'translateY(' + y + '%)', visibility: 'hidden' });
      for (const g of document.querySelectorAll('#board .seals, #board .mirrors, #board .region-names')) g.style.display = 'none';
      // Each region in a soft colour of its own, as on an old hand-tinted map.
      const tints = ['#c9875a', '#8da05f', '#6f95b5', '#c9a545', '#a8789f', '#5fa093', '#c46e62', '#9a8a52', '#7d82b8', '#b58a5c'];
      const { territories } = window.__conquest.map;
      document.querySelectorAll('#board .washes path').forEach((p, i) => { p.setAttribute('fill', tints[territories[i].region % tints.length]); p.setAttribute('opacity', '.5'); });
      await document.fonts.ready;
      window.__conquest.board.focus(null);`);
    await sleep(400);
    const { data } = await page.cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 78 });
    writeFileSync(`assets/maps/${id}.jpg`, Buffer.from(data, 'base64'));
  }
  if (page.errors.length) throw new Error(page.errors.join('\n'));
});
console.log(Object.keys(MAPS).map((id) => `assets/maps/${id}.jpg`).join(', '));
