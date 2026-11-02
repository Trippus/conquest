// Smudges made-up lettering off an AI picture, so it looks like ink worn off the parchment: each box is
// blurred, with soft edges. The picture is overwritten. A box is x,y,w,h in the picture's pixels.
// npm run smudge -- assets/togter/vikings.jpg 446,290,152,33 652,612,138,42
import { readFileSync, writeFileSync } from 'node:fs';
import { withEdge } from './edge.mjs';

const [file, ...args] = process.argv.slice(2);
const boxes = args.map((a) => a.split(',').map(Number));
if (!file || !boxes.length || boxes.some((b) => b.length !== 4 || b.some(Number.isNaN))) {
  console.error('npm run smudge -- <picture.jpg> x,y,w,h [x,y,w,h …]');
  process.exit(1);
}
const picture = readFileSync(file).toString('base64');
await withEdge(async (page) => {
  await page.open('about:blank', { width: 400, height: 300, deviceScaleFactor: 1, mobile: false });
  const data = await page.eval(`
    const img = new Image();
    img.src = 'data:image/jpeg;base64,${picture}';
    await img.decode();
    const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
    const out = canvas(img.naturalWidth, img.naturalHeight), o = out.getContext('2d');
    o.drawImage(img, 0, 0);
    const soft = canvas(out.width, out.height), s = soft.getContext('2d');
    s.filter = 'blur(9px)';
    s.drawImage(img, 0, 0);
    const f = 14; // how far the smudge fades out round its box
    for (const [x, y, w, h] of ${JSON.stringify(boxes)}) {
      const piece = canvas(w + 4 * f, h + 4 * f), p = piece.getContext('2d');
      p.drawImage(soft, x - 2 * f, y - 2 * f, piece.width, piece.height, 0, 0, piece.width, piece.height);
      const mask = canvas(piece.width, piece.height), m = mask.getContext('2d');
      m.filter = 'blur(' + f / 2 + 'px)';
      m.fillRect(1.5 * f, 1.5 * f, w + f, h + f);
      p.globalCompositeOperation = 'destination-in';
      p.drawImage(mask, 0, 0);
      o.drawImage(piece, x - 2 * f, y - 2 * f);
    }
    return out.toDataURL('image/jpeg', 0.8).split(',')[1];`);
  writeFileSync(file, Buffer.from(data, 'base64'));
});
console.log(`${file}: ${boxes.length} smudged`);
