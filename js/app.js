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
import { Sound } from './audio.js';

// Saves only replay on the map they were played on: v1 was the test map, v2 the 30-territory world.
const KEY = 'conquest.v3';
const DELAY = { normal: 650, fast: 140 };
const SETTINGS = 'conquest.settings';
const DEFAULTS = { opponents: 2, level: 'normal', mode: 'mission', humans: 1, speed: 'normal', sound: true };
// The computer opponents. Made-up commanders, so the table has someone to play against.
const OPPONENTS = ['Grevinde Holm', 'Oberst Vind', 'Admiral Storm', 'Generalinde Ravn', 'Major Falk', 'Hertug Ulv'];

const map = G.prepareMap(WORLD.WORLD);
const rules = MODERN;
const $ = (id) => document.getElementById(id);
const board = createBoard($('board'), WORLD, map, {
  onTap: (t) => tap(t),
  // The players at the top and the turn panel at the bottom cover the map.
  insets: () => ({ top: $('hud').getBoundingClientRect().bottom, bottom: innerHeight - $('bar').getBoundingClientRect().top }),
});

let game = null; // { setup, seats: ['human' | 'easy' | 'normal'], colors, speed, actions }
let s = null; // the current state
let sel = { from: -1, to: -1, n: 0 }; // what the player has tapped
let botTimer = 0;

// The engine answers in English; the player reads Danish.
const DANISH = {
  'not your territory': 'Det område er ikke dit.',
  'place all armies first': 'Placér alle nye hære først.',
  'an attack needs at least 2 armies': 'Der skal være mindst 2 hære for at angribe.',
  'not connected': 'Hærene kan kun flytte gennem dine egne områder.',
};

/* ---------- game flow ---------- */

// A player's colour: the humans have the first colours (you are always red), the opponents the
// next, whatever order the turns come in.
const colorOf = (p) => COLORS[game?.colors?.[p] ?? p];

function loadSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SETTINGS)) };
  } catch {
    return { ...DEFAULTS };
  }
}
function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS, JSON.stringify(settings));
  } catch {}
}

// A new game from the settings: who plays, then the turn order is drawn.
function startFromSettings(settings = loadSettings()) {
  const people = Array.from({ length: settings.humans }, (_, i) => ({
    kind: 'human',
    name: settings.humans === 1 ? 'Dig' : `Spiller ${i + 1}`,
    color: i,
  }));
  const names = [...OPPONENTS].sort(() => Math.random() - 0.5);
  const bots = Array.from({ length: settings.opponents }, (_, i) => ({ kind: settings.level, name: names[i], color: settings.humans + i }));
  startGame([...people, ...bots].sort(() => Math.random() - 0.5), settings.speed, settings.mode);
}

// order: [{ kind: 'human' | 'easy' | 'normal', name, color }] in turn order.
function startGame(order, speed, mode = 'mission', seed = (Math.random() * 2 ** 31) | 0) {
  const humans = order.filter((x) => x.kind === 'human').length;
  $('intro').hidden = true;
  game = {
    setup: { players: order.map((x) => x.name), seed, mode },
    seats: order.map((x) => x.kind),
    colors: order.map((x) => x.color),
    speed,
    actions: [],
  };
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
  if (s.phase === 'attack') {
    // After a conquest the old target is yours: carry on from the new land if it can attack, else
    // from where you were. A start left with one army cannot attack any more.
    const canAttack = (t) => t >= 0 && s.owner[t] === s.current && s.armies[t] > 1 && G.attackTargets(map, s, t).length > 0;
    if (sel.to >= 0 && s.owner[sel.to] === s.current) sel = { from: canAttack(sel.to) ? sel.to : canAttack(sel.from) ? sel.from : -1, to: -1, n: 0 };
    if (sel.from >= 0 && !canAttack(sel.from)) sel = { from: -1, to: -1, n: 0 };
  }
  // Once every human is out, there is nobody to watch: the rest is played at once.
  if (s.phase !== 'over' && game.seats.includes('human') && game.seats.every((x, p) => x !== 'human' || !s.players[p].alive)) {
    const out = r.events.find((e) => e.type === 'eliminate');
    if (out) flash(r.events.find((e) => e.type === 'conquer')?.to ?? 0, 'conquer');
    if (out) Sound.play('lost', { delay: 0.35 });
    finishWithoutYou();
    return true;
  }
  showEvents(r.events);
  render();
  schedule();
  return true;
}

// Plays the bots' game to its end without pauses, sounds or animation, then shows the standings.
function finishWithoutYou() {
  clearTimeout(botTimer);
  for (let i = 0; i < 20000 && s.phase !== 'over'; i++) {
    const a = botAction(map, rules, s, level(game.seats[s.current]));
    const r = G.apply(map, rules, s, a);
    if (!r.ok) break;
    s = r.state;
    game.actions.push(a);
  }
  save();
  clearSel();
  render();
  openGameOver();
}

const isBot = () => game.seats[s.current] !== 'human';
// Games saved before there were levels say 'bot': those were easy bots.
const level = (seat) => (seat === 'bot' ? 'easy' : seat);

// Bots play one action at a time, with a pause so you can follow them.
function schedule() {
  clearTimeout(botTimer);
  if (s.phase === 'over' || !isBot() || !$('intro').hidden) return;
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
  // While choosing how many move in, the seals already show the split being chosen.
  const shownState = occ && !isBot() ? { ...s, armies: s.armies.map((n, t) => (t === occ.to ? n + sel.n : t === occ.from ? n - sel.n : n)) } : s;
  board.update(
    shownState,
    {
      selected: new Set([sel.from, occ?.from].filter((t) => t >= 0)),
      chosen: new Set([sel.to, occ?.to].filter((t) => t >= 0)),
      targets,
    },
    game.colors,
  );

  $('players').replaceChildren(
    ...s.players.map((pl, i) => {
      const li = document.createElement('li');
      li.className = (i === p && s.phase !== 'over' ? 'current ' : '') + (pl.alive ? '' : 'out');
      const land = G.owned(s, i).length;
      li.title = `${pl.name}: ${land} områder, ${pl.stars} ★ krigslykke`;
      li.innerHTML = `<span class="dot" style="background:${colorOf(i)}"></span>${pl.name}
        <span class="stats">${land} · ${starsText(pl.stars)}</span>`;
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
    b.className = [opts.primary && 'primary', opts.wide && 'wide'].filter(Boolean).join(' ');
    b.disabled = !!opts.disabled;
    b.addEventListener('click', fn);
    buttons.push(b);
  };
  let phase = '';
  let text = '';
  let stepper = null; // [min, max] when the amount stepper is shown
  let shown = 0; // added to the number the stepper shows (moving in: the armies already there)
  let reserve = -1; // armies left to place, shown big while reinforcing

  if (s.phase === 'over') {
    phase = 'Spillet er slut';
    text = `${s.players[s.winner].name} har vundet.`;
    button('Til start', showIntro);
    button('Spil igen', () => startFromSettings(), { primary: true });
  } else if (isBot()) {
    phase = `Runde ${s.round} · ${PHASE_NAMES[s.phase]}`;
    text = `${name} tænker …`;
  } else if (s.phase === 'reinforce') {
    phase = `Runde ${s.round} · Forstærk`;
    reserve = s.reserve;
    const lucky = lastLuck?.p === p && lastLuck.round === s.round ? ` (heraf ${lastLuck.armies} fra krigslykke)` : '';
    if (s.reserve) text = `Tryk på dine områder for at placere hærene${lucky}.`;
    else text = 'Alle hære er placeret.';
    const stars = s.players[p].stars;
    if (stars) {
      text += ` Du har ${starCount(stars)}: indløs dem nu for ${armies(worth(stars))}, eller spar op (${starCount(stars + 1)} giver ${armies(worth(stars + 1))}).`;
      button(`Indløs ${starCount(stars)} (+${armies(worth(stars))})`, () => act({ type: 'luck' }), { wide: true });
    }
    if (s.reserve && sel.from >= 0 && s.owner[sel.from] === p) {
      button(`Resten på ${map.territories[sel.from].name}`, () => act({ type: 'place', t: sel.from, n: s.reserve }));
    }
    button('Til angreb', () => act({ type: 'end' }), { primary: true, disabled: s.reserve > 0 });
  } else if (s.phase === 'attack') {
    phase = `Runde ${s.round} · Angrib`;
    if (sel.from < 0) {
      text = 'Vælg et af dine områder at angribe fra, eller gå videre.';
      if (!s.conquered) text += ' Erobrer du mindst ét område i denne tur, får du en ★ krigslykke.';
    } else if (sel.to < 0) text = `Angrib fra ${map.territories[sel.from].name}: vælg en nabo.`;
    else text = `${map.territories[sel.from].name} (${s.armies[sel.from]}) mod ${map.territories[sel.to].name} (${s.armies[sel.to]}).`;
    if (sel.to >= 0) {
      button('Angrib', () => act({ type: 'attack', from: sel.from, to: sel.to }), { primary: true });
      button('Kæmp til enden', () => act({ type: 'blitz', from: sel.from, to: sel.to }));
    }
    button('Færdig med at angribe', () => act({ type: 'end' }));
  } else if (s.phase === 'occupy') {
    phase = `Runde ${s.round} · Erobret`;
    const { from, to } = s.occupy;
    // The stepper shows how many stand in the new land; the old one keeps the rest.
    text = `${map.territories[to].name} er din. Hvor mange hære skal stå der? ${map.territories[from].name} beholder ${s.armies[from] - sel.n}.`;
    stepper = [0, s.armies[from] - 1];
    shown = s.armies[to];
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
  $('reserve').hidden = reserve < 0;
  if (reserve >= 0) {
    const was = $('reserve').querySelector('b').textContent;
    $('reserve').querySelector('b').textContent = reserve;
    $('reserve').querySelector('span').textContent = reserve === 1 ? 'hær at placere' : 'hære at placere';
    if (was !== String(reserve)) {
      $('reserve').classList.remove('bump');
      void $('reserve').offsetWidth;
      $('reserve').classList.add('bump');
    }
  }
  $('hint').textContent = text;
  $('actions').replaceChildren(...buttons);
  $('stepper').hidden = !stepper;
  if (stepper) {
    const [lo, hi] = stepper;
    if (sel.n < lo || sel.n > hi) sel.n = hi;
    $('amount').value = sel.n + shown;
    $('minus').disabled = sel.n <= lo;
    $('plus').disabled = sel.n >= hi;
    $('minus').onclick = () => ((sel.n = Math.max(lo, sel.n - 1)), render());
    $('plus').onclick = () => ((sel.n = Math.min(hi, sel.n + 1)), render());
  }
}

const PHASE_NAMES = { reinforce: 'Forstærker', attack: 'Angriber', occupy: 'Angriber', fortify: 'Flytter' };

const hint = (text) => ($('hint').textContent = text);

// Messages are shown one after another, each for a few seconds.
const toasts = [];
let toastTimer = 0;
function toast(text) {
  toasts.push(text);
  if (toasts.length === 1) showToast();
  // Something new is waiting: the message showing now gives way soon, so news never lags behind.
  else if (toasts.length === 2) {
    clearTimeout(toastTimer);
    toastTimer = setTimeout(nextToast, 1200);
  }
}
function nextToast() {
  toasts.shift();
  if (toasts.length) showToast();
  else $('toast').hidden = true;
}
function showToast() {
  $('toast').textContent = toasts[0];
  $('toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(nextToast, toasts.length > 1 ? 1600 : 3400);
}

const flash = (t, kind) => board.flash(t, kind);

/* ---------- what happened: dice and messages ---------- */

let diceTimer = 0;
function showEvents(events) {
  const rolls = events.filter((e) => e.type === 'roll');
  const out = events.find((e) => e.type === 'eliminate');
  if (rolls.length) showDice(rolls, events.find((e) => e.type === 'conquer'), out);
  const human = (p) => game.seats[p] === 'human';
  // What concerns you is heard; battles between the opponents only as faint dice.
  const yours = (...ps) => ps.some((p) => p >= 0 && human(p));
  const quiet = (p) => (human(p) ? 1 : 0.3);
  if (rolls.length) Sound.play('dice', { vol: yours(rolls[0].p, s.owner[rolls[0].to], events.find((e) => e.type === 'conquer')?.loser ?? -1) ? 1 : 0.25 });
  for (const e of events) {
    if (e.type === 'win') {
      openGameOver();
      if (human(e.p)) Sound.play('victory', { delay: 0.5 });
      else if (game.seats.some((x, p) => x === 'human' && s.players[p].alive)) Sound.play('defeat', { delay: 0.5, vol: 0.6 });
    }
    if (e.type === 'place') Sound.play('place', { vol: quiet(e.p) * 0.8 });
    if ((e.type === 'conquer' || e.type === 'move') && human(e.p)) board.reveal(e.to);
    if (e.type === 'conquer') {
      flash(e.to, 'conquer');
      if (human(e.p)) Sound.play('conquer', { delay: 0.35 });
      else if (human(e.loser)) Sound.play('lost', { delay: 0.35 });
    }
    if (e.type === 'star' && human(e.p)) Sound.play('card');
    if (e.type === 'luck') Sound.play('trade', { vol: human(e.p) ? 1 : 0.4 });
    if (e.type === 'turn' && human(e.p)) Sound.play('turn', { delay: 0.2 });
    luckNews(e);
    if (e.type === 'place' || e.type === 'move') flash(e.to ?? e.t, 'stamp');
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
    <div class="dice-row">${dice(last.a, colorOf(pa), (i) => i < pairs && last.a[i] <= last.d[i])}</div>
    <div class="dice-row">${dice(last.d, colorOf(pd), (i) => i < pairs && last.a[i] > last.d[i])}</div>
    <div>${rolls.length > 1 ? `${rolls.length} slag · ` : ''}angriber −${lostA}, forsvarer −${lostD}</div>
    ${conquest ? `<div><b>${map.territories[conquest.to].name} er erobret!</b></div>` : ''}
    ${out ? `<div><b>${s.players[out.p].name} er slået ud.</b></div>` : ''}`;
  box.hidden = false;
  const faces = [...box.querySelectorAll('.die')];
  const real = faces.map((d) => d.textContent);
  box.classList.add('rolling');
  const spin = setInterval(() => faces.forEach((d) => (d.textContent = 1 + Math.floor(Math.random() * 6))), 60);
  setTimeout(() => {
    clearInterval(spin);
    faces.forEach((d, i) => (d.textContent = real[i]));
    box.classList.remove('rolling');
  }, 380);
  clearTimeout(diceTimer);
  diceTimer = setTimeout(() => (box.hidden = true), isBot() ? Math.max(700, DELAY[game.speed] * 1.6) : 2000);
}

/* ---------- dialogs ---------- */

// The new game dialog: a summary of the last setup and Start. The choices sit folded away under
// "Skift opsætning", since most of the time you just want another game like the last one.
let draft = loadSettings();
const CHOICES = {
  opponents: () => {
    const least = draft.humans > 1 ? 0 : 1;
    return Array.from({ length: 6 - draft.humans - least + 1 }, (_, i) => [least + i, String(least + i)]);
  },
  level: () => [['easy', 'Let'], ['normal', 'Normal']],
  mode: () => [['mission', 'Hemmelig mission'], ['world', 'Hele verden']],
  humans: () => [[1, 'Kun mig'], [2, '2'], [3, '3']],
  speed: () => [['normal', 'Roligt'], ['fast', 'Hurtigt']],
};

function summary(x) {
  const them = x.opponents ? `${x.opponents} ${x.opponents === 1 ? 'modstander' : 'modstandere'} (${x.level === 'easy' ? 'lette' : 'normale'})` : '';
  const who = x.humans === 1 ? `Dig mod ${them}` : `${x.humans} spillere på denne telefon${them ? ` mod ${them}` : ''}`;
  return `${who} · ${x.mode === 'mission' ? 'hemmelig mission' : 'erobr hele verden'}`;
}

function renderSetup() {
  $('setup-summary').textContent = summary(draft);
  document.querySelectorAll('.pills').forEach((box) => {
    const name = box.dataset.name;
    box.replaceChildren(
      ...CHOICES[name]().map(([value, label]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = label;
        b.setAttribute('aria-pressed', String(draft[name] === value));
        b.addEventListener('click', () => {
          draft[name] = value;
          // Keep the table between 2 and 6 players.
          draft.opponents = Math.max(draft.humans > 1 ? 0 : 1, Math.min(6 - draft.humans, draft.opponents));
          renderSetup();
        });
        return b;
      }),
    );
  });
}

function openNewGame(change = false) {
  draft = loadSettings();
  renderSetup();
  $('setup-details').open = change;
  $('cancel-new').hidden = false;
  $('new-game').showModal();
}

$('new-game').addEventListener('close', () => {
  if ($('new-game').returnValue !== 'start') return;
  saveSettings({ ...draft, sound: Sound.enabled });
  startFromSettings(draft);
});


function openGameOver() {
  const w = s.players[s.winner];
  const you = game.seats[s.winner] === 'human';
  $('over-title').textContent = you ? 'Tillykke!' : 'Spillet er slut';
  const how = {
    world: `${w.name} har erobret hele kortet i runde ${s.round}.`,
    mission: `${w.name} klarede sin mission i runde ${s.round}:<br><i>${missionText(w.mission)}</i>`,
    rounds: `${w.name} havde flest områder, da runderne slap op.`,
  }[s.won];
  const place = G.standings(s);
  const rows = place.map((p, i) => {
    const pl = s.players[p];
    const fate = p === s.winner ? 'vandt' : pl.alive ? `${G.owned(s, p).length} ${G.owned(s, p).length === 1 ? 'område' : 'områder'}` : `slået ud i runde ${pl.outRound}`;
    const mission = s.mode === 'mission' && p !== s.winner ? `<small>${missionText(pl.mission)}</small>` : '';
    return `<li class="${game.seats[p] === 'human' ? 'you' : ''}"><span class="place">${i + 1}.</span>
      <span class="dot" style="background:${colorOf(p)}"></span><span class="who">${pl.name}<small>${fate}</small>${mission}</span></li>`;
  });
  const me = place.findIndex((p) => game.seats[p] === 'human');
  const mine = me >= 0 && game.seats.filter((x) => x === 'human').length === 1 ? `<p class="your-place">Du blev nr. ${me + 1} af ${place.length}.</p>` : '';
  $('over-text').innerHTML = `${how}${mine}<ol class="standings">${rows.join('')}</ol>`;
  setTimeout(() => $('game-over').open || $('game-over').showModal(), 900);
}
$('game-over').addEventListener('close', () => {
  if ($('game-over').returnValue === 'again') startFromSettings();
  else if ($('game-over').returnValue === 'home') showIntro();
});

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

/* ---------- war luck ---------- */

// Stars as ★★☆: filled for the ones you have, empty up to three; beyond three as ★★★+2.
// Beyond three, the number: ★ 5. ("+" is only ever used for armies.)
const starsText = (n) => (n > G.STARS ? `★ ${n}` : '★'.repeat(n) + '☆'.repeat(G.STARS - n));
// In sentences: "1 ★", "4 ★"; and armies with their word: "5 hære".
const starCount = (n) => `${n} ★`;
const armies = (n) => `${n} ${n === 1 ? 'hær' : 'hære'}`;
const worth = (n) => G.starValue(rules, n);
// Your stars can be cashed in now: your turn, reinforcing.
const canCash = (p) => p === s.current && s.phase === 'reinforce' && s.players[p].stars > 0 && !isBot();
let lastLuck = null; // { p, round, armies }: war luck at the start of this turn, for the hint

// A message for everything that happens with war luck, so it is never a mystery.
function luckNews(e) {
  const you = (p) => game.seats[p] === 'human';
  const solo = game.seats.filter((x) => x === 'human').length === 1;
  const name = (p) => (solo && you(p) ? 'Du' : s.players[p].name);
  if (e.type === 'star' && you(e.p)) {
    toast(`★ for at erobre! ${name(e.p)} har nu ${starCount(e.stars)}, som er ${armies(worth(e.stars))} værd. Indløs dem, når du forstærker, eller spar op.`);
  }
  if (e.type === 'luck') {
    lastLuck = { p: e.p, round: s.round, armies: e.armies };
    toast(you(e.p) ? `Krigslykke! ${starCount(e.stars)} blev til ${armies(e.armies)} mere at placere.` : `${s.players[e.p].name} indløste ${starCount(e.stars)} til ${armies(e.armies)}.`);
  }
  if (e.type === 'eliminate' && e.stars > 0) {
    toast(`${name(e.by)} slog ${s.players[e.p].name} ud og ${solo && you(e.by) ? 'fik' : 'overtog'} ${e.stars === 1 ? 'deres ★' : `deres ${e.stars} ★`}.`);
  }
}

function openLuck() {
  const p = viewer();
  if (p < 0) return;
  const stars = s.players[p].stars;
  $('luck-who').textContent = s.players.filter((_, i) => game.seats[i] === 'human').length > 1 ? s.players[p].name : '';
  $('luck-stars').textContent = starsText(stars);
  $('luck-text').textContent = !stars
    ? 'Du har ingen ★ endnu.'
    : `Du har ${starCount(stars)}. De er ${armies(worth(stars))} værd nu, og ${armies(worth(stars + 1))}, hvis du sparer én mere op.`;
  $('ladder').innerHTML =
    [1, 2, 3].map((n) => `<span class="${Math.min(stars, G.STARS) === n ? 'next' : ''}">${starCount(n)} = ${armies(worth(n))}</span>`).join('') +
    `<span class="${stars > G.STARS ? 'next' : ''}">hver ★ mere = ${armies(rules.extraStar)} mere</span>`;
  $('cash-btn').hidden = !canCash(p);
  $('cash-btn').textContent = `Indløs (+${armies(worth(stars))})`;
  $('luck-dialog').showModal();
}
$('luck-dialog').addEventListener('close', () => $('luck-dialog').returnValue === 'luck' && act({ type: 'luck' }));

function renderHudButtons() {
  const p = viewer();
  $('mission-btn').hidden = p < 0 || s.phase === 'over' || s.mode !== 'mission' || !s.players[p]?.mission;
  $('luck-btn').hidden = p < 0 || s.phase === 'over';
  if (p < 0) return;
  // The button shows your stars, and glows when three are ready to become armies.
  $('luck-btn').textContent = `Krigslykke ${starsText(s.players[p].stars)}`;
  $('luck-btn').classList.toggle('ready', canCash(p));
}
$('mission-btn').addEventListener('click', openMission);
$('luck-btn').addEventListener('click', openLuck);
$('home-btn').addEventListener('click', showIntro);

/* ---------- start screen ---------- */

// The start screen is the menu: continue, a new game like the last one, change the setup, the
// rules and the sound. The game behind it waits.
function showIntro() {
  clearTimeout(botTimer);
  const going = game && s.phase !== 'over';
  $('intro-continue').hidden = !going;
  $('intro-new').classList.toggle('primary', !going);
  $('intro-summary').textContent = summary(loadSettings());
  soundLabel();
  $('intro').hidden = false;
}
function hideIntro() {
  $('intro').hidden = true;
  schedule();
}
function soundLabel() {
  $('sound-btn').textContent = Sound.enabled ? 'Lyd: til' : 'Lyd: fra';
}
$('intro-continue').addEventListener('click', hideIntro);
$('intro-new').addEventListener('click', () => startFromSettings());
$('intro-change').addEventListener('click', () => openNewGame(true));
$('intro-rules-btn').addEventListener('click', () => ($('intro-rules').hidden = !$('intro-rules').hidden));
$('sound-btn').addEventListener('click', () => {
  Sound.enabled = !Sound.enabled;
  saveSettings({ ...loadSettings(), sound: Sound.enabled });
  soundLabel();
  Sound.play('place');
});
// Audio may only start from a tap.
document.addEventListener('pointerdown', () => Sound.unlock(), { capture: true });
Sound.enabled = loadSettings().sound !== false;

// The zoom buttons sit just above the turn panel, whatever its height.
new ResizeObserver(() => document.documentElement.style.setProperty('--bar-h', `${$('bar').offsetHeight}px`)).observe($('bar'));

/* ---------- start ---------- */

$('zoom-in').addEventListener('click', board.zoomIn);
$('zoom-out').addEventListener('click', board.zoomOut);

if (load()) {
  if (s.phase === 'occupy') sel.n = s.armies[s.occupy.from] - 1;
  render();
  focusOnPlayer();
} else {
  // An empty map behind the start screen until the first game starts.
  s = G.newGame(map, rules, { players: ['', ''], seed: 1 });
  game = null;
  board.update({ ...s, owner: s.owner.map(() => -1) });
  board.focus(null);
}
showIntro();

window.__conquest = {
  get state() { return s; },
  get game() { return game; },
  map,
  rules,
  board,
  act,
  tap,
  // start(['human', 'normal', …], speed, mode, seed): a game with these seats in this order.
  start: (seats, speed = 'fast', mode = 'mission', seed) =>
    startGame(seats.map((kind, i) => ({ kind, name: kind === 'human' ? 'Dig' : OPPONENTS[i], color: i })), speed, mode, seed),
  startFromSettings,
  showIntro,
  openLuck,
  openMission,
};
