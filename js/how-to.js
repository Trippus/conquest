// How to play: a booklet (index.html) whose small scenes look like bits of the map. Each plays over
// and over while it is in view: what a tap does, how the dice are read, when a region pays. With
// reduced motion each stands still at its end. The words are in the language files; the scenes have
// none, but for the name of a region.
import { PLAYER_COLORS } from './board.js';
import { EMBLEMS } from './emblems.js';

const RED = 0;
const BLUE = 1;

// Bits of land: two neighbours, three in a row, and two across the water.
const LEFT = 'M14 26C52 12 104 16 150 24C160 58 150 96 158 128C112 140 58 136 20 126C8 92 10 58 14 26Z';
const RIGHT = 'M150 24C190 14 258 12 306 28C316 62 312 100 304 128C256 140 204 138 158 128C150 96 160 58 150 24Z';
const FIRST = 'M10 30C36 16 76 14 108 24C114 58 106 98 112 126C78 138 40 136 14 124C4 94 6 60 10 30Z';
const MIDDLE = 'M108 24C140 14 176 14 212 24C204 58 216 98 208 126C176 138 142 138 112 126C106 98 114 58 108 24Z';
const LAST = 'M212 24C244 12 286 14 310 30C316 62 314 96 306 124C280 136 240 138 208 126C216 98 204 58 212 24Z';
const ALL_THREE = 'M10 30C36 16 76 14 108 24C140 14 176 14 212 24C244 12 286 14 310 30C316 62 314 96 306 124C280 136 240 138 208 126C176 138 142 138 112 126C78 138 40 136 14 124C4 94 6 60 10 30Z';
const ISLE = 'M16 26C50 12 90 14 116 26C124 52 118 84 112 100C80 112 44 108 20 96C10 72 12 46 16 26Z';
const ISLE_2 = 'M204 26C236 10 280 12 304 28C312 54 308 84 300 98C270 112 232 108 208 98C198 72 200 48 204 26Z';

const land = (id, d) => `<path class="land" d="${d}"/><path class="wash" data-wash="${id}" d="${d}"/>`;
const seal = (id, x, y) => `<g class="seal" data-seal="${id}" transform="translate(${x} ${y})">
  <circle class="wax" r="19"/><svg class="emblem" x="-15" y="-15" width="30" height="30" viewBox="0 0 512 512"><path/></svg>
  <circle class="rim" r="15"/><text class="count" dy="6.5"></text></g>`;

// A scene's picture and what can be done with it.
function stage(box, height, art, calm) {
  box.innerHTML = `<svg viewBox="0 0 320 ${height}" aria-hidden="true">${art}</svg>`;
  const svg = box.firstChild;
  const sealOf = (id) => svg.querySelector(`[data-seal="${id}"]`);
  const again = (el, name) => {
    el.classList.remove(name);
    void el.getBBox();
    el.classList.add(name);
  };
  return {
    svg,
    // A territory's owner and armies, without a fuss.
    set(id, look, n) {
      svg.querySelector(`[data-wash="${id}"]`).style.fill = PLAYER_COLORS[look];
      const s = sealOf(id);
      s.querySelector('.wax').style.fill = PLAYER_COLORS[look];
      s.querySelector('.emblem path').setAttribute('d', EMBLEMS[look]);
      s.querySelector('.count').textContent = n;
    },
    count(id, n) {
      sealOf(id).querySelector('.count').textContent = n;
      again(sealOf(id), 'stamp');
    },
    take(id, look, n) {
      this.set(id, look, n);
      again(sealOf(id), 'stamp');
      again(svg.querySelector(`[data-wash="${id}"]`), 'flood');
    },
    // A finger on the map.
    tap(x, y) {
      if (calm) return;
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('class', 'tap');
      ring.setAttribute('cx', x);
      ring.setAttribute('cy', y);
      ring.setAttribute('r', 26);
      ring.addEventListener('animationend', () => ring.remove());
      svg.append(ring);
    },
    show(selector, on = true) {
      svg.querySelectorAll(selector).forEach((el) => el.classList.toggle('on', on));
    },
  };
}

/* ---------- the scenes: each builds its picture and returns its steps, [time to stay, what happens] ---------- */

// Three new armies, one tap at a time.
function reinforce(box, calm) {
  const dots = [0, 1, 2].map((i) => `<circle class="dot" data-dot="${i}" cx="${140 + i * 20}" cy="154" r="7" fill="${PLAYER_COLORS[RED]}"/>`).join('');
  const st = stage(box, 170, `${land('a', LEFT)}${land('b', RIGHT)}${seal('a', 84, 76)}${seal('b', 232, 76)}${dots}`, calm);
  const place = (id, x, n, dot) => {
    st.tap(x, 76);
    st.count(id, n);
    st.show(`[data-dot="${dot}"]`);
  };
  return [
    [900, () => (st.set('a', RED, 4), st.set('b', RED, 2), st.show('.dot', false))],
    [800, () => place('a', 84, 5, 0)],
    [800, () => place('a', 84, 6, 1)],
    [2000, () => place('b', 232, 3, 2)],
  ];
}

// Pick a territory and a neighbour, then two rolls: one even, one that takes the land.
function attack(box, calm) {
  const row = (name, y, look) => [0, 1, 2].map((i) => `<g class="die" data-die="${name}${i}" transform="translate(${112 + i * 34} ${y})">
    <g class="face"><rect width="28" height="28" rx="6" fill="${PLAYER_COLORS[look]}"/><text x="14" y="20.5"></text></g></g>`).join('');
  const st = stage(box, 214, `${land('a', LEFT)}${land('b', RIGHT)}
    <path class="aim" d="${RIGHT}"/><circle class="pick" cx="84" cy="76" r="24"/>
    <path class="arrow" d="M112 76H196M186 66l12 10-12 10"/>
    ${seal('a', 84, 76)}${seal('b', 232, 76)}${row('a', 148, RED)}${row('d', 180, BLUE)}`, calm);
  const faces = (name, values, lost) => [0, 1, 2].forEach((i) => {
    const die = st.svg.querySelector(`[data-die="${name}${i}"]`);
    die.classList.toggle('on', i < values.length);
    die.classList.toggle('lost', lost(i));
    die.querySelector('text').textContent = values[i] ?? '';
  });
  const dice = (a, d) => {
    const pairs = Math.min(a.length, d.length);
    st.svg.classList.remove('rolling');
    faces('a', a, (i) => i < pairs && a[i] <= d[i]);
    faces('d', d, (i) => i < pairs && a[i] > d[i]);
  };
  const tumble = (na, nd) => {
    const some = (n) => Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 6));
    faces('a', some(na), () => false);
    faces('d', some(nd), () => false);
    st.svg.classList.add('rolling');
  };
  return [
    [800, () => {
      st.set('a', RED, 6);
      st.set('b', BLUE, 2);
      st.show('.pick, .aim, .arrow, .die', false);
    }],
    [900, () => (st.tap(84, 76), st.show('.pick'))],
    [1000, () => (st.tap(232, 76), st.show('.aim, .arrow'))],
    [550, () => tumble(3, 2)],
    [2200, () => {
      dice([6, 3, 1], [5, 3]);
      st.count('a', 5);
      st.count('b', 1);
    }],
    [550, () => tumble(3, 1)],
    [1200, () => {
      dice([5, 4, 2], [3]);
      st.show('.aim, .arrow, .pick', false);
      st.take('b', RED, 1);
      st.count('a', 4);
    }],
    [2600, () => {
      st.count('a', 2);
      st.count('b', 3);
    }],
  ];
}

// From the back to the front, through your own land.
function move(box, calm) {
  const st = stage(box, 150, `${land('a', FIRST)}${land('b', MIDDLE)}${land('c', LAST)}
    <path class="aim" d="${LAST}"/><circle class="pick" cx="60" cy="78" r="24"/>
    <path class="arrow" d="M78 58C120 26 200 26 240 58M232 44l9 15-16 2"/>
    ${seal('a', 60, 78)}${seal('b', 160, 78)}${seal('c', 260, 78)}`, calm);
  return [
    [900, () => {
      st.set('a', RED, 7);
      st.set('b', RED, 1);
      st.set('c', RED, 2);
      st.show('.pick, .aim, .arrow', false);
    }],
    [800, () => (st.tap(60, 78), st.show('.pick'))],
    [1000, () => (st.tap(260, 78), st.show('.aim, .arrow'))],
    [2200, () => {
      st.count('a', 3);
      st.count('c', 6);
      st.show('.pick, .aim, .arrow', false);
    }],
  ];
}

// The last territory of a region falls, and the region pays.
function region(box, calm) {
  const st = stage(box, 176, `<text class="region-name" x="160" y="24">Latium +3</text>
    <g transform="translate(0 28)"><path class="band" d="${ALL_THREE}"/>${land('a', FIRST)}${land('b', MIDDLE)}${land('c', LAST)}
    ${seal('a', 60, 78)}${seal('b', 160, 78)}${seal('c', 260, 78)}</g>`, calm);
  return [
    [1000, () => {
      st.set('a', RED, 3);
      st.set('b', RED, 4);
      st.set('c', BLUE, 1);
      st.show('.band, .region-name', false);
    }],
    [800, () => {
      st.tap(260, 106);
      st.take('c', RED, 2);
      st.count('b', 2);
    }],
    [2800, () => st.show('.band, .region-name')],
  ];
}

// Saved stars are worth more and more.
function luck(box, calm) {
  const stars = [0, 1, 2].map((i) => `<text class="star" data-star="${i}" x="${64 + i * 52}" y="70">★</text>`).join('');
  const st = stage(box, 104, `<path class="land" d="M14 16C80 6 240 6 306 16C314 40 314 66 306 90C240 100 80 100 14 90C6 66 6 40 14 16Z"/>
    <path class="wash" data-wash="a" d="M14 16C80 6 240 6 306 16C314 40 314 66 306 90C240 100 80 100 14 90C6 66 6 40 14 16Z"/>${stars}${seal('a', 256, 53)}`, calm);
  const star = (i, armies) => {
    st.show(`[data-star="${i}"]`);
    st.count('a', armies);
  };
  return [
    [600, () => {
      st.set('a', RED, '');
      st.show('.star', false);
    }],
    [1300, () => star(0, '+2')],
    [1300, () => star(1, '+5')],
    [2400, () => star(2, '+9')],
  ];
}

// Two lands with a dotted line between them. It stands still.
function sea(box, calm) {
  const st = stage(box, 124, `${land('a', ISLE)}${land('b', ISLE_2)}<path class="route" d="M90 60H230"/>${seal('a', 68, 60)}${seal('b', 252, 60)}`, calm);
  return [[0, () => (st.set('a', RED, 4), st.set('b', BLUE, 3))]];
}

const SCENES = { reinforce, attack, move, region, luck, sea };

/* ---------- playing them ---------- */

const playing = [];
const watcher = new IntersectionObserver((seen) => {
  for (const { target, isIntersecting } of seen) {
    const scene = playing.find((x) => x.box === target);
    clearTimeout(scene.timer);
    if (isIntersecting) {
      scene.i = 0;
      nextStep(scene);
    }
  }
}, { threshold: 0.6 });

function nextStep(scene) {
  const [stay, step] = scene.steps[scene.i];
  step();
  scene.i = (scene.i + 1) % scene.steps.length;
  scene.timer = setTimeout(() => nextStep(scene), stay);
}

let built = false;
function buildScenes() {
  built = true;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (const box of document.querySelectorAll('[data-scene]')) {
    const steps = SCENES[box.dataset.scene](box, calm);
    if (calm) steps.forEach(([, step]) => step());
    else steps[0][1]();
    if (!calm && steps.length > 1) {
      playing.push({ box, steps, i: 0, timer: 0 });
      watcher.observe(box);
    }
  }
}

export function openHowTo() {
  const page = document.getElementById('how-to');
  if (!built) buildScenes();
  page.showModal();
  page.querySelector('form').scrollTop = 0;
}
