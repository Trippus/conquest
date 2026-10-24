// The prototype board: draws the map from its data, turns taps into engine actions and lets the
// bots play their turns. Deliberately plain; the real look comes later (see DESIGN.md).
//
// The saved game is the setup plus the list of actions, replayed on load, exactly like a
// replay or (later) an online game. Debug hook: window.__conquest.

import * as G from './engine.js';
import { botAction } from './ai.js';
import { TEST_MAP } from './maps/test.js';
import { MODERN } from './rules/modern.js';

const KEY = 'conquest.v1';
// Placeholder player colours; the real ones are design item 4.
const COLORS = ['#d24c48', '#3a74c9', '#3f9a4a', '#d98b1c', '#8b4cb8', '#14918f'];
const REGION_COLORS = ['#c9a96e', '#8fb37f', '#cf8f6d', '#929bc9', '#b98fb0', '#7fb3b1'];
const DELAY = { normal: 650, fast: 140 };

const map = G.prepareMap(TEST_MAP);
const rules = MODERN;
const $ = (id) => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';

let game = null; // { setup, seats: ['human' | 'bot'], speed, actions }
let s = null; // the current state
let sel = { from: -1, to: -1, n: 0 }; // what the player has tapped
let botTimer = 0;

// The engine answers in English; the player reads Danish.
const DANISH = {
  'trade a card set first': 'Du har for mange kort. Byt et sæt først.',
  'not your territory': 'Det område er ikke dit.',
  'place all armies first': 'Placér alle nye hære først.',
  'an attack needs at least 2 armies': 'Der skal være mindst 2 hære for at angribe.',
  'not connected': 'Hærene kan kun flytte gennem dine egne områder.',
};

/* ---------- game flow ---------- */

function startGame(seats, speed, seed = (Math.random() * 2 ** 31) | 0) {
  const humans = seats.filter((x) => x === 'human').length;
  const players = seats.map((x, i) => (x === 'bot' ? `Computer ${i + 1}` : humans === 1 ? 'Dig' : `Spiller ${i + 1}`));
  game = { setup: { players, seed }, seats, speed, actions: [] };
  s = G.newGame(map, rules, game.setup);
  clearSel();
  save();
  render();
  schedule();
}

function act(a) {
  const r = G.apply(map, rules, s, a);
  if (!r.ok) {
    hint(DANISH[r.error] ?? r.error);
    return false;
  }
  s = r.state;
  game.actions.push(a);
  save();
  if (r.events.some((e) => e.type === 'turn' || e.type === 'win')) clearSel();
  if (s.phase === 'occupy') sel.n = s.armies[s.occupy.from] - 1; // all in, unless the player says less
  showEvents(r.events);
  render();
  schedule();
  return true;
}

const isBot = () => game.seats[s.current] === 'bot';

// Bots play one action at a time, with a pause so you can follow them.
function schedule() {
  clearTimeout(botTimer);
  if (s.phase === 'over' || !isBot()) return;
  botTimer = setTimeout(() => act(botAction(map, rules, s)), DELAY[game.speed]);
}

function clearSel() {
  sel = { from: -1, to: -1, n: 0 };
}

/* ---------- saving ---------- */

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(game));
  } catch {}
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (!saved) return false;
    s = G.replay(map, rules, saved.setup, saved.actions);
    game = saved;
    return true;
  } catch {
    return false;
  }
}

/* ---------- taps ---------- */

function tap(t) {
  if (s.phase === 'over' || isBot()) return;
  const p = s.current;
  const mine = s.owner[t] === p;
  if (s.phase === 'reinforce') {
    if (!mine) return hint('Placér hærene på dine egne områder.');
    sel.from = t;
    act({ type: 'place', t, n: 1 });
    flash(t);
  } else if (s.phase === 'attack') {
    if (mine) {
      if (s.armies[t] < 2) return hint('Der skal være mindst 2 hære for at angribe herfra.');
      sel = { from: t, to: -1, n: 0 };
    } else if (sel.from >= 0 && map.territories[sel.from].adj.includes(t)) {
      sel.to = t;
    } else {
      return hint(sel.from >= 0 ? 'Vælg en nabo, der ikke er din.' : 'Vælg først et af dine egne områder at angribe fra.');
    }
    render();
  } else if (s.phase === 'fortify') {
    if (!mine) return hint('Du kan kun flytte mellem dine egne områder.');
    if (sel.from >= 0 && t !== sel.from && G.fortifyTargets(map, rules, s, sel.from).includes(t)) {
      sel.to = t;
      sel.n = s.armies[sel.from] - 1;
    } else if (s.armies[t] > 1) {
      sel = { from: t, to: -1, n: 0 };
    } else {
      return hint('Der skal blive mindst 1 hær tilbage. Vælg et område med flere hære.');
    }
    render();
  }
}

/* ---------- drawing the board ---------- */

const el = (tag, attrs = {}, parent) => {
  const e = document.createElementNS(svgNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
};

// The fixed parts (land, links, region names) once; the territories are updated on each render.
function drawBoard() {
  const svg = $('board');
  svg.replaceChildren();
  const T = map.territories;
  map.regions.forEach((r, i) => {
    const pts = r.members.map((t) => `${T[t].x},${T[t].y}`).join(' ');
    el('polygon', { points: pts, class: 'region-land', fill: REGION_COLORS[i], stroke: REGION_COLORS[i], 'stroke-width': 17 }, svg);
  });
  T.forEach((a, i) => {
    for (const j of a.adj) {
      if (j < i) continue;
      const b = T[j];
      const sea = a.region !== b.region && Math.hypot(a.x - b.x, a.y - b.y) > 35;
      el('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: sea ? 'link sea' : 'link' }, svg);
    }
  });
  map.regions.forEach((r) => {
    const cx = r.members.reduce((n, t) => n + T[t].x, 0) / r.members.length;
    const cy = r.members.reduce((n, t) => n + T[t].y, 0) / r.members.length;
    const label = el('text', { x: cx + (50 - cx) * 0.42, y: cy + (50 - cy) * 0.42, class: 'region-label' }, svg);
    label.textContent = `${r.name} +${r.bonus}`;
  });
  T.forEach((t, i) => {
    const g = el('g', { class: 'terr', 'data-t': i, transform: `translate(${t.x} ${t.y})` }, svg);
    el('circle', { r: 7.4, class: 'ring' }, g);
    el('circle', { r: 6, class: 'body' }, g);
    el('text', { class: 'count' }, g);
    el('text', { y: 9.6, class: 'name' }, g).textContent = t.name;
    g.addEventListener('click', () => tap(i));
  });
}

function render() {
  const p = s.current;
  const targets = new Set();
  if (!isBot() && sel.from >= 0) {
    if (s.phase === 'attack') G.attackTargets(map, s, sel.from).forEach((t) => targets.add(t));
    if (s.phase === 'fortify') G.fortifyTargets(map, rules, s, sel.from).forEach((t) => targets.add(t));
  }
  const occ = s.occupy;
  document.querySelectorAll('.terr').forEach((g) => {
    const t = +g.dataset.t;
    g.querySelector('.body').setAttribute('fill', COLORS[s.owner[t]]);
    g.querySelector('.count').textContent = s.armies[t];
    g.classList.toggle('selected', t === sel.from || (occ && t === occ.from));
    g.classList.toggle('target', targets.has(t) && t !== sel.to);
    g.classList.toggle('chosen', t === sel.to || (occ && t === occ.to));
  });

  $('players').replaceChildren(
    ...s.players.map((pl, i) => {
      const li = document.createElement('li');
      li.className = (i === p && s.phase !== 'over' ? 'current ' : '') + (pl.alive ? '' : 'out');
      const land = G.owned(s, i).length;
      li.innerHTML = `<span class="dot" style="background:${COLORS[i]}"></span>${pl.name}
        <span class="stats">${land} omr. · ${pl.cards.length} kort</span>`;
      return li;
    }),
  );
  renderBar();
}

function renderBar() {
  const p = s.current;
  const name = s.players[p].name;
  const buttons = [];
  const button = (label, fn, opts = {}) => {
    const b = document.createElement('button');
    b.textContent = label;
    if (opts.primary) b.className = 'primary';
    b.disabled = !!opts.disabled;
    b.addEventListener('click', fn);
    buttons.push(b);
  };
  let phase = '';
  let text = '';
  let stepper = null; // [min, max] when the amount stepper is shown

  if (s.phase === 'over') {
    phase = 'Spillet er slut';
    text = `${s.players[s.winner].name} har vundet.`;
    button('Nyt spil', openNewGame, { primary: true });
  } else if (isBot()) {
    phase = `Runde ${s.round} · ${PHASE_NAMES[s.phase]}`;
    text = `${name} tænker …`;
  } else if (s.phase === 'reinforce') {
    phase = `Runde ${s.round} · Forstærk`;
    const hand = s.players[p].cards;
    const set = G.findSet(map, hand);
    if (hand.length >= rules.maxHand) text = `Du har ${hand.length} kort. Byt et sæt, før du placerer hære.`;
    else if (s.reserve) text = `Du har ${s.reserve} ${s.reserve === 1 ? 'ny hær' : 'nye hære'}. Tryk på dine områder for at placere dem.`;
    else text = 'Alle hære er placeret.';
    if (set) button(`Byt kort (+${G.tradeValue(rules, s.trades)})`, () => act({ type: 'trade', cards: set }));
    if (s.reserve && sel.from >= 0 && s.owner[sel.from] === p && hand.length < rules.maxHand) {
      button(`Resten på ${map.territories[sel.from].name}`, () => act({ type: 'place', t: sel.from, n: s.reserve }));
    }
    button('Til angreb', () => act({ type: 'end' }), { primary: true, disabled: s.reserve > 0 || hand.length >= rules.maxHand });
  } else if (s.phase === 'attack') {
    phase = `Runde ${s.round} · Angrib`;
    if (sel.from < 0) text = 'Vælg et af dine områder at angribe fra, eller gå videre.';
    else if (sel.to < 0) text = `Angrib fra ${map.territories[sel.from].name}: vælg en nabo.`;
    else text = `${map.territories[sel.from].name} (${s.armies[sel.from]}) mod ${map.territories[sel.to].name} (${s.armies[sel.to]}).`;
    if (sel.to >= 0) {
      button('Angrib', () => act({ type: 'attack', from: sel.from, to: sel.to }), { primary: true });
      button('Kæmp til enden', () => act({ type: 'blitz', from: sel.from, to: sel.to }));
    }
    button('Færdig med at angribe', () => act({ type: 'end' }));
  } else if (s.phase === 'occupy') {
    phase = `Runde ${s.round} · Erobret`;
    const { from, to } = s.occupy;
    text = `${map.territories[to].name} er din. Hvor mange ekstra hære skal med ind fra ${map.territories[from].name}?`;
    stepper = [0, s.armies[from] - 1];
    button('Flyt ind', () => act({ type: 'occupy', n: sel.n }), { primary: true });
  } else if (s.phase === 'fortify') {
    phase = `Runde ${s.round} · Flyt`;
    if (sel.from < 0) text = 'Du må flytte hære én gang mellem dine egne områder. Vælg hvorfra.';
    else if (sel.to < 0) text = `Flyt fra ${map.territories[sel.from].name}: vælg hvortil.`;
    else {
      text = `Flyt fra ${map.territories[sel.from].name} til ${map.territories[sel.to].name}.`;
      stepper = [1, s.armies[sel.from] - 1];
      button('Flyt', () => act({ type: 'fortify', from: sel.from, to: sel.to, n: sel.n }), { primary: true });
    }
    button('Afslut tur', () => act({ type: 'end' }));
  }

  $('phase').textContent = phase;
  $('hint').textContent = text;
  $('actions').replaceChildren(...buttons);
  $('stepper').hidden = !stepper;
  if (stepper) {
    const [lo, hi] = stepper;
    if (sel.n < lo || sel.n > hi) sel.n = hi;
    $('amount').value = sel.n;
    $('minus').disabled = sel.n <= lo;
    $('plus').disabled = sel.n >= hi;
    $('minus').onclick = () => ((sel.n = Math.max(lo, sel.n - 1)), renderBar());
    $('plus').onclick = () => ((sel.n = Math.min(hi, sel.n + 1)), renderBar());
  }
}

const PHASE_NAMES = { reinforce: 'Forstærker', attack: 'Angriber', occupy: 'Angriber', fortify: 'Flytter' };

const hint = (text) => ($('hint').textContent = text);

function flash(t) {
  const g = document.querySelector(`.terr[data-t="${t}"]`);
  g?.classList.remove('flash');
  void g?.getBBox();
  g?.classList.add('flash');
}

/* ---------- what happened: dice and messages ---------- */

let diceTimer = 0;
function showEvents(events) {
  const rolls = events.filter((e) => e.type === 'roll');
  const out = events.find((e) => e.type === 'eliminate');
  if (rolls.length) showDice(rolls, events.find((e) => e.type === 'conquer'), out);
  for (const e of events) {
    if (e.type === 'win') openGameOver();
    if (e.type === 'place' || e.type === 'move') flash(e.to ?? e.t);
  }
}

// The last roll's dice, and the totals when a blitz rolled several times.
function showDice(rolls, conquest, out) {
  const last = rolls.at(-1);
  const pa = s.owner[last.from];
  const pd = conquest ? conquest.loser : s.owner[last.to];
  const lostA = rolls.reduce((n, r) => n + r.lostA, 0);
  const lostD = rolls.reduce((n, r) => n + r.lostD, 0);
  const dice = (list, color, lost) =>
    list.map((v, i) => `<span class="die${lost(i) ? ' lost' : ''}" style="background:${color}">${v}</span>`).join('');
  const pairs = Math.min(last.a.length, last.d.length);
  const box = $('dice');
  box.innerHTML = `
    <div class="dice-row">${dice(last.a, COLORS[pa], (i) => i < pairs && last.a[i] <= last.d[i])}</div>
    <div class="dice-row">${dice(last.d, COLORS[pd], (i) => i < pairs && last.a[i] > last.d[i])}</div>
    <div>${rolls.length > 1 ? `${rolls.length} slag · ` : ''}angriber −${lostA}, forsvarer −${lostD}</div>
    ${conquest ? `<div><b>${map.territories[conquest.to].name} er erobret!</b></div>` : ''}
    ${out ? `<div><b>${s.players[out.p].name} er slået ud.</b></div>` : ''}`;
  box.hidden = false;
  clearTimeout(diceTimer);
  diceTimer = setTimeout(() => (box.hidden = true), isBot() ? DELAY[game.speed] * 1.6 : 1800);
}

/* ---------- dialogs ---------- */

function openNewGame() {
  const seats = $('seats');
  const current = game?.seats ?? ['human', 'bot', 'bot'];
  seats.replaceChildren(
    ...COLORS.map((c, i) => {
      const row = document.createElement('label');
      row.className = 'row';
      const value = current[i] ?? 'none';
      row.innerHTML = `<span class="dot" style="background:${c}"></span><span>Plads ${i + 1}</span>
        <select data-seat="${i}">
          <option value="human">Menneske</option>
          <option value="bot">Computer</option>
          ${i >= 2 ? '<option value="none">Ingen</option>' : ''}
        </select>`;
      row.querySelector('select').value = value;
      return row;
    }),
  );
  $('speed').value = game?.speed ?? 'normal';
  $('cancel-new').hidden = !game || s.phase === 'over';
  $('new-game').showModal();
}

$('new-game').addEventListener('close', () => {
  if ($('new-game').returnValue !== 'start') return;
  const seats = [...document.querySelectorAll('[data-seat]')].map((x) => x.value).filter((v) => v !== 'none');
  startGame(seats, $('speed').value);
});
// Without a game there is nothing to go back to: Escape must not leave an empty board.
$('new-game').addEventListener('cancel', (e) => !game && e.preventDefault());

function openGameOver() {
  const w = s.players[s.winner];
  const you = game.seats[s.winner] === 'human';
  $('over-title').textContent = you ? 'Tillykke!' : 'Spillet er slut';
  $('over-text').textContent = you ? `${w.name} har erobret hele kortet på ${s.round} runder.` : `${w.name} har erobret hele kortet.`;
  setTimeout(() => $('game-over').showModal(), 900);
}
$('game-over').addEventListener('close', () => openNewGame());
$('menu-btn').addEventListener('click', openNewGame);

/* ---------- start ---------- */

drawBoard();
if (load()) {
  if (s.phase === 'occupy') sel.n = s.armies[s.occupy.from] - 1;
  render();
  schedule();
} else {
  // An empty board under the dialog until the first game starts.
  s = G.newGame(map, rules, { players: ['', ''], seed: 1 });
  game = null;
  document.querySelectorAll('.terr').forEach((g) => g.querySelector('.body').setAttribute('fill', 'var(--line)'));
  openNewGame();
}

window.__conquest = {
  get state() { return s; },
  get game() { return game; },
  map,
  rules,
  act,
  tap,
  start: startGame,
};
