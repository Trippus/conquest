// The game screen: the world map (js/board.js draws it), turns taps into engine actions and lets
// the bots play their turns.
//
// The saved game is the setup plus the list of actions, replayed on load, exactly like a
// replay or (later) an online game. Debug hook: window.__conquest.

import * as G from './engine.js';
import { botAction } from './ai.js';
import * as WORLD from './maps/world.js';
import { MODERN } from './rules/modern.js';
import { createBoard, PLAYER_COLORS as COLORS } from './board.js';

// v1 saves were games on the 12-territory test map; they cannot be replayed on the world map.
const KEY = 'conquest.v2';
const DELAY = { normal: 650, fast: 140 };

const map = G.prepareMap(WORLD.WORLD);
const rules = MODERN;
const $ = (id) => document.getElementById(id);
const board = createBoard($('board'), WORLD, map, { onTap: (t) => tap(t) });

let game = null; // { setup, seats: ['human' | 'easy' | 'normal'], speed, actions }
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

function startGame(seats, speed, mode = 'mission', seed = (Math.random() * 2 ** 31) | 0) {
  const humans = seats.filter((x) => x === 'human').length;
  const players = seats.map((x, i) => (x !== 'human' ? `Computer ${i + 1}` : humans === 1 ? 'Dig' : `Spiller ${i + 1}`));
  game = { setup: { players, seed, mode }, seats, speed, actions: [] };
  s = G.newGame(map, rules, game.setup);
  clearSel();
  save();
  render();
  focusOnPlayer();
  if (mode === 'mission' && humans === 1) openMission();
  else schedule();
}

// Start zoomed in on the (first) human player's territories, or the whole map when only bots play.
function focusOnPlayer() {
  const you = game.seats.indexOf('human');
  board.focus(you >= 0 ? G.owned(s, you) : null);
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
  // A new phase starts with nothing chosen. The one exception: the territory the armies were just
  // placed on stays chosen for the attack, if it can attack.
  if (r.events.some((e) => e.type === 'phase')) {
    const keep = s.phase === 'attack' && sel.from >= 0 && s.armies[sel.from] > 1 && G.attackTargets(map, s, sel.from).length;
    sel = { from: keep ? sel.from : -1, to: -1, n: 0 };
  }
  if (s.phase === 'occupy') sel.n = s.armies[s.occupy.from] - 1; // all in, unless the player says less
  showEvents(r.events);
  render();
  schedule();
  return true;
}

const isBot = () => game.seats[s.current] !== 'human';
// Games saved before there were levels say 'bot': those were easy bots.
const level = (seat) => (seat === 'bot' ? 'easy' : seat);

// Bots play one action at a time, with a pause so you can follow them.
function schedule() {
  clearTimeout(botTimer);
  if (s.phase === 'over' || !isBot()) return;
  botTimer = setTimeout(() => act(botAction(map, rules, s, level(game.seats[s.current]))), DELAY[game.speed]);
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
    if (t === sel.from) {
      clearSel(); // tapping the start territory again lets you pick another
    } else if (sel.from >= 0 && G.fortifyTargets(map, rules, s, sel.from).includes(t)) {
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

/* ---------- drawing ---------- */

function render() {
  const p = s.current;
  const targets = new Set();
  if (!isBot() && sel.from >= 0) {
    if (s.phase === 'attack') G.attackTargets(map, s, sel.from).forEach((t) => targets.add(t));
    if (s.phase === 'fortify') G.fortifyTargets(map, rules, s, sel.from).forEach((t) => targets.add(t));
  }
  const occ = s.occupy;
  board.update(s, {
    selected: new Set([sel.from, occ?.from].filter((t) => t >= 0)),
    chosen: new Set([sel.to, occ?.to].filter((t) => t >= 0)),
    targets,
  });

  $('players').replaceChildren(
    ...s.players.map((pl, i) => {
      const li = document.createElement('li');
      li.className = (i === p && s.phase !== 'over' ? 'current ' : '') + (pl.alive ? '' : 'out');
      const land = G.owned(s, i).length;
      li.title = `${pl.name}: ${land} områder, ${pl.cards.length} kort`;
      li.innerHTML = `<span class="dot" style="background:${COLORS[i]}"></span>${pl.name}
        <span class="stats">${land} · ${pl.cards.length} kort</span>`;
      return li;
    }),
  );
  renderBar();
  renderHudButtons();
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
    const set = G.bestSet(map, s, p);
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
    if (sel.from >= 0) button('Vælg andet startområde', () => (clearSel(), render()));
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

const flash = (t) => board.flash(t);

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
  const current = (game?.seats ?? ['human', 'normal', 'normal']).map(level);
  seats.replaceChildren(
    ...COLORS.map((c, i) => {
      const row = document.createElement('label');
      row.className = 'row';
      const value = current[i] ?? 'none';
      row.innerHTML = `<span class="dot" style="background:${c}"></span><span>Plads ${i + 1}</span>
        <select data-seat="${i}">
          <option value="human">Menneske</option>
          <option value="easy">Computer, let</option>
          <option value="normal">Computer, normal</option>
          ${i >= 2 ? '<option value="none">Ingen</option>' : ''}
        </select>`;
      row.querySelector('select').value = value;
      return row;
    }),
  );
  seats.querySelectorAll('select').forEach((x) => x.addEventListener('change', seatNote));
  seatNote();
  $('speed').value = game?.speed ?? 'normal';
  $('mode').value = game?.setup.mode ?? 'mission';
  $('cancel-new').hidden = !game || s.phase === 'over';
  $('new-game').showModal();
}

// Tells why later seats start with more armies (the ruleset's laterSeatArmies).
function seatNote() {
  const n = [...document.querySelectorAll('[data-seat]')].filter((x) => x.value !== 'none').length;
  const extra = G.seatArmies(rules, n);
  $('seat-note').textContent = !extra
    ? ''
    : n === 2
      ? `Plads 1 begynder. Til gengæld starter plads 2 med ${extra} ekstra hære.`
      : `Plads 1 begynder. Til gengæld får hver plads efter den ${extra} ${extra === 1 ? 'hær' : 'hære'} mere fra start end pladsen før.`;
}

$('new-game').addEventListener('close', () => {
  if ($('new-game').returnValue !== 'start') return;
  const seats = [...document.querySelectorAll('[data-seat]')].map((x) => x.value).filter((v) => v !== 'none');
  startGame(seats, $('speed').value, $('mode').value);
});
// Without a game there is nothing to go back to: Escape must not leave an empty board.
$('new-game').addEventListener('cancel', (e) => !game && e.preventDefault());

function openGameOver() {
  const w = s.players[s.winner];
  const you = game.seats[s.winner] === 'human';
  $('over-title').textContent = you ? 'Tillykke!' : 'Spillet er slut';
  const how = {
    world: `${w.name} har erobret hele kortet i runde ${s.round}.`,
    mission: `${w.name} klarede sin mission i runde ${s.round}:<br><i>${missionText(w.mission)}</i>`,
    rounds: `${w.name} havde flest områder, da runderne slap op.`,
  }[s.won];
  const others = s.mode === 'mission' ? s.players.filter((pl, i) => i !== s.winner).map((pl) => `${pl.name}: ${missionText(pl.mission)}`) : [];
  $('over-text').innerHTML = `${how}${others.length ? `<br><br><b>De andres missioner</b><br>${others.join('<br>')}` : ''}`;
  setTimeout(() => $('game-over').showModal(), 900);
}

/* ---------- missions and cards ---------- */

// Whose mission and cards the buttons show: the player whose turn it is, or else the one human.
function viewer() {
  if (!game) return -1;
  if (game.seats[s.current] === 'human') return s.current;
  const humans = game.seats.flatMap((x, i) => (x === 'human' ? [i] : []));
  return humans.length === 1 ? humans[0] : -1;
}

const regionNames = (list) => list.map((r) => map.regions[r].name).join(' og ');

function missionText(m) {
  if (!m) return '';
  if (m.type === 'regions') return `Erobr ${regionNames(m.regions)}${m.plusOne ? ', og ét kontinent mere efter eget valg' : ''}.`;
  if (m.type === 'territories') return m.armies > 1 ? `Hold ${m.count} områder med mindst ${m.armies} hære i hvert.` : `Hold ${m.count} områder på én gang.`;
  return `Slå ${s.players[m.target].name} ud. Gør en anden det før dig, skal du i stedet holde ${G.fallback(map).count} områder.`;
}

function missionProgress(p) {
  const m = s.players[p].mission;
  if (m.type === 'regions') {
    const parts = m.regions.map((r) => {
      const have = map.regions[r].members.filter((t) => s.owner[t] === p).length;
      return `${map.regions[r].name}: ${have} af ${map.regions[r].members.length}`;
    });
    if (m.plusOne) {
      const extra = map.regions.filter((_, r) => !m.regions.includes(r) && G.holdsRegion(map, s, p, r)).map((r) => r.name);
      parts.push(extra.length ? `Ét mere: ${extra.join(', ')} ✓` : 'Ét kontinent mere: ikke endnu');
    }
    return parts.join(' · ');
  }
  if (m.type === 'territories') {
    const have = s.owner.filter((o, t) => o === p && s.armies[t] >= m.armies).length;
    return `Du har ${have} af ${m.count}.`;
  }
  const left = G.owned(s, m.target).length;
  return left ? `${s.players[m.target].name} har ${left} områder tilbage.` : `${s.players[m.target].name} er slået ud.`;
}

function openMission() {
  const p = viewer();
  if (p < 0 || !s.players[p].mission) return;
  $('mission-who').textContent = s.players.filter((_, i) => game.seats[i] === 'human').length > 1 ? s.players[p].name : '';
  $('mission-text').textContent = missionText(s.players[p].mission);
  $('mission-progress').textContent = missionProgress(p);
  $('mission-dialog').showModal();
}
// The game waits while the mission is shown at the start.
$('mission-dialog').addEventListener('close', () => schedule());

const SYMBOLS = ['★', '◆', '●', '✱']; // placeholders until design item 6

function openCards() {
  const p = viewer();
  if (p < 0) return;
  const hand = s.players[p].cards;
  const set = G.bestSet(map, s, p) ?? [];
  $('cards-who').textContent = s.players.filter((_, i) => game.seats[i] === 'human').length > 1 ? s.players[p].name : '';
  $('hand').innerHTML = hand.length
    ? hand
        .map((c) => {
          const t = G.cardTerritory(map, c);
          const mine = t >= 0 && s.owner[t] === p;
          return `<div class="card${mine ? ' mine' : ''}${set.includes(c) ? ' in-set' : ''}">
            <span class="sym">${SYMBOLS[G.cardSymbol(map, c)]}</span><span>${t >= 0 ? map.territories[t].name : 'Joker'}</span></div>`;
        })
        .join('')
    : '<p class="empty">Ingen kort endnu.</p>';
  const value = G.tradeValue(rules, s.trades);
  const canTrade = set.length && p === s.current && s.phase === 'reinforce';
  $('cards-text').innerHTML = `Næste sæt giver <b>${value} hære</b>.${
    set.length ? (canTrade ? ' Du har et sæt (løftet op).' : ' Du har et sæt, som du kan bytte, når du forstærker.') : ''
  }`;
  $('trade-btn').hidden = !canTrade;
  $('cards-dialog').showModal();
}
$('cards-dialog').addEventListener('close', () => {
  if ($('cards-dialog').returnValue !== 'trade') return;
  const set = G.bestSet(map, s, s.current);
  if (set) act({ type: 'trade', cards: set });
});

function renderHudButtons() {
  const p = viewer();
  $('mission-btn').hidden = p < 0 || s.mode !== 'mission' || !s.players[p]?.mission;
  $('cards-btn').hidden = p < 0;
  if (p >= 0) $('cards-btn').textContent = `Kort (${s.players[p].cards.length})`;
}
$('mission-btn').addEventListener('click', openMission);
$('cards-btn').addEventListener('click', openCards);
$('game-over').addEventListener('close', () => openNewGame());
$('menu-btn').addEventListener('click', openNewGame);

/* ---------- start ---------- */

$('zoom-in').addEventListener('click', board.zoomIn);
$('zoom-out').addEventListener('click', board.zoomOut);

if (load()) {
  if (s.phase === 'occupy') sel.n = s.armies[s.occupy.from] - 1;
  render();
  focusOnPlayer();
  schedule();
} else {
  // An empty map under the dialog until the first game starts.
  s = G.newGame(map, rules, { players: ['', ''], seed: 1 });
  game = null;
  board.update({ ...s, owner: s.owner.map(() => -1) });
  board.focus(null);
  openNewGame();
}

window.__conquest = {
  get state() { return s; },
  get game() { return game; },
  map,
  rules,
  board,
  act,
  tap,
  start: startGame,
  openCards,
  openMission,
};
