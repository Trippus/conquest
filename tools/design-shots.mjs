// Photographs the style samples in design/stilproever.html as PNGs (design/stil-a.png …), one map
// per picture at full width. Needs the dev server: npm start, then npm run design-shots.
import { writeFileSync } from 'node:fs';
import { withEdge } from './edge.mjs';

const width = 2000;
await withEdge(async (page) => {
  await page.open('http://localhost:5183/design/stilproever.html', { width, height: 800, deviceScaleFactor: 1, mobile: false });
  for (const id of ['a', 'b', 'c']) {
    const height = await page.eval(`
      await new Promise((r) => setTimeout(r, 300));
      const svg = document.getElementById('${id}').querySelector('svg').cloneNode(true);
      document.body.replaceChildren(svg);
      document.body.style.margin = '0';
      Object.assign(svg.style, { display: 'block', width: '${width}px', height: 'auto', minWidth: '0', borderRadius: '0' });
      return Math.ceil(svg.getBoundingClientRect().height);`);
    await page.cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    writeFileSync(`design/stil-${id}.png`, await page.shot());
    await page.open('http://localhost:5183/design/stilproever.html', { width, height: 800, deviceScaleFactor: 1, mobile: false });
  }
  if (page.errors.length) throw new Error(page.errors.join('\n'));
});
console.log('design/stil-a.png, stil-b.png, stil-c.png');
