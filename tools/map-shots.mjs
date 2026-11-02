// Photographs every map, empty and whole, as a small picture (assets/maps/<map>.jpg): the free
// game's map choice shows them, and a togt without a picture of its own (togter.js, art) shows its
// map. Needs the dev server: npm start, then npm run map-shots. Run it again when a map changes.
import { mkdirSync, writeFileSync } from 'node:fs';
import { withEdge, sleep } from './edge.mjs';
import { MAPS } from '../js/maps/index.js';

const view = { width: 480, height: 300, deviceScaleFactor: 1.5, mobile: false };
mkdirSync('assets/maps', { recursive: true });
await withEdge(async (page) => {
  for (const id of Object.keys(MAPS)) {
    await page.open('http://localhost:5183/', view);
    await page.eval(`localStorage.clear(); localStorage.setItem('conquest.settings', JSON.stringify({ map: '${id}' }))`);
    await page.open('http://localhost:5183/', view);
    // Only the map, without its seals and names (specks this small): the panels move off the
    // screen, so the map has all of it.
    await page.eval(`for (const id of ['intro', 'zoom', 'toast', 'dice']) document.getElementById(id).hidden = true;
      for (const [id, y] of [['hud', -200], ['bar', 200]]) Object.assign(document.getElementById(id).style, { transform: 'translateY(' + y + '%)', visibility: 'hidden' });
      for (const g of document.querySelectorAll('#board .seals, #board .mirrors, #board .region-names')) g.style.display = 'none';
      await document.fonts.ready;
      window.__conquest.board.focus(null);`);
    await sleep(400);
    const { data } = await page.cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 78 });
    writeFileSync(`assets/maps/${id}.jpg`, Buffer.from(data, 'base64'));
  }
  if (page.errors.length) throw new Error(page.errors.join('\n'));
});
console.log(Object.keys(MAPS).map((id) => `assets/maps/${id}.jpg`).join(', '));
