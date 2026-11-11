// The game screen: the map (js/board.js draws it), turns taps into engine actions and lets the
// bots play their turns.
//
// The saved game is the setup plus the list of actions, replayed on load, exactly like a
// replay or (later) an online game. Debug hook: window.__conquest.

import * as G from './engine.js';
import { botAction } from './ai.js';
import { MAPS, rulesFor, inLanguage } from './maps/index.js';
import { MODERN } from './rules/modern.js';
import { createBoard, PLAYER_COLORS as COLORS, sealIcon, usePalette } from './board.js';
import { mapShapes, regionShapes } from './map-shapes.js';
import { Sound, Music } from './audio.js';
import { openHowTo } from './how-to.js';
import { guideNote, guideDone } from './guide.js';
import { LANGUAGES, pickLanguage, stringsFor, translatePage } from './i18n.js';
import { MEDALS, medalIcon, medalCounts, newMedal, newStats, recordGame } from './stats.js';
import { TOGTER, newProgress, isOpen, upNext, nextTogt, freeMaps, record, offerEasy, togtArmies, togtStart } from './togter.js';

// Saves only replay on the map they were played on: v1 was the test map, v2 the 30-territory world.
const KEY = 'conquest.v3';
const DELAY = { normal: 650, fast: 140 };
const SETTINGS = 'conquest.settings';
const PROGRESS = 'conquest.progress';
// people: the players at this device, each with a name (empty: a default) and a coat of arms
// (colour and emblem number); opponents: how many computer players; togtLevel: the opponents'
// level in the togter (the free game has its own); togtGoal: 'history' (the togt's goal) or 'all'
// (conquer the whole map), chosen on the togt's card.
const DEFAULTS = { people: [{ name: '', look: 0 }], opponents: 2, level: 'medium', mode: 'mission', map: 'world', speed: 'normal', sound: true, music: true, theme: 'dark', togtLevel: 'novice', togtGoal: 'history' };
const NAME_LENGTH = 14;
// Every text in the chosen language (js/i18n.js). The computer opponents are made-up commanders
// (L.opponents), so the table has someone to play against; a map from another age has its own (RULERS).
let L = stringsFor(pickLanguage(savedLanguage()));
// A map with its names in the chosen language.
const mapIn = (id) => inLanguage(MAPS[id] ?? MAPS.world, L.lang);

// The maps are listed in js/maps/index.js. A saved game names its map; older saves were all played
// on the world.
let rules = MODERN; // the game's rules, with the map's own changes
const $ = (id) => document.getElementById(id);
// A test switch for finding what makes a phone flicker: ?plain=paper,ink,bands,sea leaves those out.
document.documentElement.dataset.plain = new URLSearchParams(location.search).get('plain')?.replaceAll(',', ' ') ?? '';
let grid = null; // the map's drawing data (js/maps/hex.js)
let map = null; // the map the engine plays on
let board = null;

// Draws a map. The board is made anew on a fresh copy of the <svg>, so the old one's listeners go too.
function useMap(id, again = false) {
  if (grid?.id === id && !again) return;
  grid = mapIn(id);
  map = G.prepareMap(grid.MAP);
  rules = rulesFor(grid, MODERN);
  const svg = $('board').cloneNode(false);
  $('board').replaceWith(svg);
  board = createBoard(svg, grid, map, {
    onTap: (t) => tap(t),
    onRegion: (r) => showRegion(r),
    quarters: L.compass,
    // The players at the top and the turn panel at the bottom cover the map.
    insets: () => ({ top: $('hud').getBoundingClientRect().bottom, bottom: innerHeight - $('bar').getBoundingClientRect().top }),
  });
}

let game = null; // { map, setup, seats: ['human' | 'novice' | 'medium' | 'hard'], colors, speed, actions }
let s = null; // the current state
let sel = { from: -1, to: -1, n: 0 }; // what the player has tapped
let botTimer = 0;

/* ---------- game flow ---------- */

// A player's colour: alone you pick your own coat of arms; several people at the phone have the
// first ones. The opponents take the rest, whatever order the turns come in.
const lookOf = (p) => game?.colors?.[p] ?? p; // colour and emblem number
const colorOf = (p) => COLORS[lookOf(p)];
// With one person at the phone the texts speak to them: "Du"/"You" as subject, "dig"/"you" as object.
const soloYou = (p) => game.seats[p] === 'human' && game.seats.filter((x) => x === 'human').length === 1;
const subject = (p) => (soloYou(p) ? L.youSubject : s.players[p].name);
const object = (p) => (soloYou(p) ? L.youObject : s.players[p].name);

const personName = (x, i) => x.people[i].name.trim() || (x.people.length === 1 ? L.you : L.player(i + 1));

// The levels had other names before there were three: 'bot' and 'easy' are today's medium,
// 'normal' is today's hard.
const OLD_LEVELS = { bot: 'medium', easy: 'medium', normal: 'hard' };
const level = (seat) => OLD_LEVELS[seat] ?? seat;

// Settings saved before every player had a name and a coat of arms said how many people played,
// and the name and coat of arms of the one person.
function oldPeople(x) {
  if (x.humans > 1) return Array.from({ length: x.humans }, (_, i) => ({ name: '', look: i }));
  return [{ name: x.name ?? '', look: x.look ?? 0 }];
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS)) ?? {};
    const { humans, name, look, ...x } = { ...DEFAULTS, ...saved };
    return { ...x, people: saved.people ?? oldPeople(saved), level: level(x.level), map: isFree(x.map) ? x.map : DEFAULTS.map };
  } catch {
    return structuredClone(DEFAULTS); // a copy: the setup dialog changes the people in place
  }
}
// The language is read before the rest of the settings can be (loadSettings needs what comes after).
function savedLanguage() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS))?.lang;
  } catch {
    return undefined;
  }
}
function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS, JSON.stringify(settings));
  } catch {}
}

// The togter won and lost (js/togter.js). Someone with settings or a game saved from before there
// were togter is a veteran: the maps there were then stay open in the free game.
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS));
    if (saved) return { ...newProgress(), ...saved };
    return newProgress(!!(localStorage.getItem(SETTINGS) || localStorage.getItem(KEY)));
  } catch {
    return newProgress();
  }
}
function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS, JSON.stringify(progress));
  } catch {}
}
let progress = loadProgress();
saveProgress(progress); // so a veteran is known as one after the first game saves settings too

// The numbers of the games finished by one person against the computer (js/stats.js).
const STATS = 'conquest.stats';
function loadStats() {
  try {
    return { ...newStats(), ...JSON.parse(localStorage.getItem(STATS)) };
  } catch {
    return newStats();
  }
}
let stats = loadStats();
function countGame() {
  if (game.statted) return;
  stats = recordGame(stats, { won: game.seats[s.winner] === 'human', map: game.map, rounds: s.round, taken: game.taken ?? 0 });
  try {
    localStorage.setItem(STATS, JSON.stringify(stats));
  } catch {}
  game.statted = true;
  save();
}
// A map in the free game: open, or still to be won in the togter.
function isFree(id) {
  return freeMaps(progress, Object.keys(MAPS)).includes(id);
}
const togtOf = (id) => TOGTER.find((t) => t.map === id);
const togtText = (id) => L.togter[id];

// A fair shuffle. Sorting by a random comparison is not: it left the first player (you) first or
// last far more often than in the middle.
function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A new game from the settings: who plays, then the turn order is drawn.
function startFromSettings(settings = loadSettings(), { intro = true } = {}) {
  const people = settings.people.map((x, i) => ({ kind: 'human', name: personName(settings, i), color: x.look }));
  const free = COLORS.map((_, i) => i).filter((i) => !settings.people.some((x) => x.look === i));
  const names = shuffled(mapIn(settings.map).RULERS ?? L.opponents);
  const bots = Array.from({ length: settings.opponents }, (_, i) => ({ kind: settings.level, name: names[i], color: free[i] }));
  const guide = people.length === 1 && newcomer();
  const order = guide ? [people[0], ...shuffled(bots)] : shuffled([...people, ...bots]);
  startGame(order, 'normal', settings.mode, undefined, settings.map, { quiet: intro, guide });
  if (intro) showDeal();
}

// A togt: the one person at the phone against the togt's opponents, on the togter's level, starting
// at home with history's goal (js/togter.js). With intro, the year and the story come first
// (showChapter), also on a retry: the story is part of the togt.
function startTogt(id, { intro = true } = {}) {
  const settings = loadSettings();
  const person = settings.people[0];
  const togt = togtOf(id);
  const names = shuffled(mapIn(id).RULERS ?? L.opponents);
  const free = COLORS.map((_, i) => i).filter((i) => i !== person.look);
  const you = { kind: 'human', name: person.name.trim() || L.you, color: person.look };
  const bots = Array.from({ length: togt.opponents }, (_, i) => ({ kind: settings.togtLevel, name: names[i], color: free[i] }));
  const guide = newcomer();
  const order = guide ? [you, ...shuffled(bots)] : shuffled([you, ...bots]);
  useMap(id);
  const { bonus, novice, guard } = togtArmies(togt, settings.togtLevel, rules.noviceHandicap);
  const start = togtStart(map, togt, order.indexOf(you), order.length, guard);
  const mode = settings.togtGoal === 'all' ? 'world' : 'mission';
  startGame(order, 'normal', mode, undefined, id, { togt: id, quiet: intro, guide, ...start, bonus, novice });
  if (intro) showChapter(id);
}

// order: [{ kind: 'human' | 'novice' | 'medium' | 'hard', name, color }] in turn order.
// togt: the togt this game is (js/togter.js), with the start at home, the goals, the guard and the
// bonus for the person playing it, and how much weaker the easy computer players start; quiet: the game waits, showing the whole map, while the story is told;
// guide: the first game, with notes on what to do (js/guide.js).
function startGame(order, speed, mode = 'mission', seed = (Math.random() * 2 ** 31) | 0, mapId = 'world', { togt, quiet = false, home, goals, guard, bonus = 0, novice, guide = false } = {}) {
  const humans = order.filter((x) => x.kind === 'human').length;
  $('intro').hidden = true;
  stepAway();
  useMap(mapId);
  // Easy computer players start weaker, by how much the map's rules say; hard ones start stronger.
  const start = G.startArmies(rules, map.territories.length, order.length);
  const extra = { novice: -(novice ?? rules.noviceHandicap), hard: rules.hardBonus, human: bonus };
  const handicap = order.map((x) => Math.round(start * (extra[x.kind] ?? 0)));
  game = {
    map: grid.id,
    setup: { players: order.map((x) => x.name), seed, mode, handicap, ...(home ? { home, goals } : {}), ...(guard ? { guard } : {}) },
    seats: order.map((x) => x.kind),
    colors: order.map((x) => x.color),
    speed,
    actions: [],
    // told: the opening card has been read (or skipped); until then, continuing shows it again
    ...(togt ? { togt } : {}),
    ...(guide ? { guide: {} } : {}),
    ...(quiet ? { told: false } : {}),
  };
  s = G.newGame(map, rules, game.setup);
  clearSel();
  // Nothing from the last game lingers: its messages and dice.
  toasts.length = 0;
  $('toast').hidden = true;
  $('dice').hidden = true;
  save();
  render();
  if (quiet) return board.focus(null);
  focusOnPlayer();
  if (mode === 'mission' && humans === 1) openMission();
  else schedule();
}

/* ---------- a togt begins ---------- */

// The year, the war and the story come in one after another; a tap hurries the rest along. "To
// battle" lets the map come into view, glides to your lands and shows your mission.
function showChapter(id) {
  const i = TOGTER.findIndex((t) => t.map === id);
  const text = togtText(id);
  $('ch-step').textContent = L.chapterStep(i + 1, TOGTER.length);
  $('ch-year').textContent = text.year;
  $('ch-title').textContent = mapIn(id).name;
  $('ch-story').textContent = text.story;
  $('ch-goal-h').textContent = L.yourGoal;
  tellGoal(id);
  cardButtons(L.toBattle);
  openCard(togtOf(id).art, '');
}
// A free game begins the same way, with the map's year and story; the goal says who you are this time:
// the lands the deal gave you, your place in the turn, who is against you and your mission. Several
// people play at one phone or tablet like at a board; each reads their secret mission with the
// Mission button in their own turn, so it says only that there is one.
function showDeal() {
  const id = grid.id;
  const humans = game.seats.flatMap((x, i) => (x === 'human' ? [i] : []));
  const foes = andList(game.seats.flatMap((x, i) => (x === 'human' ? [] : [s.players[i].name])));
  $('ch-step').textContent = L.freeGame;
  $('ch-year').textContent = togtText(id)?.year ?? '';
  $('ch-title').textContent = mapIn(id).name;
  $('ch-story').textContent = togtText(id)?.story ?? '';
  const all = s.mode === 'world' ? `<br><b>${L.conquerAll}</b>` : '';
  if (humans.length === 1) {
    const p = humans[0];
    const most = map.regions.map((r) => [r.members.filter((t) => s.owner[t] === p).length, r.name]).sort((a, b) => b[0] - a[0])[0][1];
    $('ch-goal-h').textContent = L.yourGoal;
    $('ch-goal').innerHTML = `${who(p)} ${L.dealYou(G.owned(s, p).length, most, p + 1, foes)}${all || `<br><b>${L.yourMission}</b> ${missionText(s.players[p].mission)}`}`;
  } else {
    $('ch-goal-h').textContent = L.ourGoal;
    $('ch-goal').innerHTML = `${humans.map(who).join(' ')}${foes ? ` ${L.dealFoes(foes)}` : ''}${all || `<br>${L.secretEach}`}`;
  }
  cardButtons(L.toBattle);
  openCard(pictureOf(id), 'deal');
}
const who = (p) => `<span class="ch-who">${sealIcon(lookOf(p))}<b>${s.players[p].name}</b></span>`;
// The card's way on, and below it the standings and an easier try when the game is over.
function cardButtons(go, { standings = false, easy = false } = {}) {
  $('ch-go').textContent = go;
  $('ch-standings').hidden = !standings;
  $('ch-easy').hidden = !easy;
}
// What begins the game: a togt's year card, or a free game's.
const showOpening = () => (game.togt ? showChapter(game.togt) : showDeal());
// Every game ends as it began: its picture out of the dark, Victory or Defeat where the year was. A
// win tells what really happened in history, a loss who won. The standings are a tap away; the button
// goes on to the next togt or game, whose picture comes up over this one (a break for an ad would go between).
function showEnding(e) {
  const id = grid.id;
  const i = TOGTER.findIndex((t) => t.map === id);
  $('ch-step').textContent = game.togt ? (e.won ? L.chapterWon : L.chapterLost)(i + 1, TOGTER.length) : L.freeGame;
  $('ch-year').textContent = e.won ? L.victory : L.defeat;
  $('ch-title').textContent = mapIn(id).name;
  $('ch-story').textContent = e.won ? togtText(id)?.epilogue ?? e.how : e.how;
  $('ch-goal').textContent = (e.won ? (game.togt ? e.news : [e.how]) : [e.place]).join(' ');
  cardButtons(afterGame()?.label ?? L.toStart, { standings: true, easy: e.easy });
  openCard(game.togt ? togtOf(id).art : pictureOf(id), 'ending');
  // A togt won on a harder level than before gives its medal.
  const medal = e.won && e.medal;
  $('ch-medal').hidden = !medal;
  if (medal) $('ch-medal').innerHTML = `${medalIcon(medal)}<span><b>${L.medalWon[medal]}</b> ${L.medalNext[medal]}</span>`;
}
function openCard(art, kind) {
  showChapterArt(art);
  $('ch-medal').hidden = true;
  const box = $('chapter');
  // Shown anew, so the words come in again one by one, also when the card was already up.
  const fromEnd = box.classList.contains('turning');
  box.hidden = true;
  void box.offsetWidth;
  box.classList.remove('ending', 'deal', 'leave', 'turning');
  box.classList.toggle('from-end', fromEnd);
  if (!fromEnd) box.style.removeProperty('--picture');
  if (kind) box.classList.add(kind);
  box.hidden = false;
  document.body.classList.add('telling'); // the players and the turn panel wait out of sight
  $('ch-go').focus({ preventScroll: true });
}
// The goal under the story: history's, or the whole map. Choosing deals the same game again in the
// other mode, so the map stays the same; the choice is kept for the next togter.
function tellGoal(id) {
  const all = s.mode === 'world';
  pills($('ch-mode'), Object.entries(L.togtGoals), all ? 'all' : 'history', (goal) => {
    saveSettings({ ...loadSettings(), togtGoal: goal });
    game.setup.mode = goal === 'all' ? 'world' : 'mission';
    s = G.newGame(map, rules, game.setup);
    save();
    render();
    tellGoal(id);
  });
  const home = togtOf(id).home && map.regions.find((r) => r.id === togtOf(id).home).name;
  const goal = all ? `<b>${L.conquerAll}</b>` : `<b>${togtText(id).goal}</b> ${goalText(s.players[game.seats.indexOf('human')].mission)}`;
  $('ch-goal').innerHTML = `${goal}${home ? ` ${L.startsIn(home)}` : ''}`;
}
// The togt's picture behind the card. With one, the card is dark all through (the game's map does not
// show), and the picture comes up out of the dark; it is fetched early, while the togter are listed
// (preloadArt). The card is the same without one.
function showChapterArt(src) {
  const art = $('ch-art');
  $('chapter').classList.toggle('has-art', !!src);
  if (src && art.dataset.src === src) return;
  art.classList.remove('shown');
  art.dataset.src = src ?? '';
  if (!src) return (art.style.backgroundImage = '');
  preloadArt(src).then(() => {
    if (art.dataset.src !== src) return;
    art.style.backgroundImage = `url("${src}")`;
    art.classList.add('shown');
  });
}
const artLoads = new Map(); // src → when it has loaded (or failed)
function preloadArt(src) {
  if (src && !artLoads.has(src)) {
    artLoads.set(src, new Promise((done) => Object.assign(new Image(), { onload: done, onerror: done, src })));
  }
  return artLoads.get(src);
}
$('chapter').addEventListener('click', (e) => {
  if (e.target.closest('#ch-go')) return;
  // What is still to come plays out ten times as fast, without a jump; the picture's slow drift and
  // the candles keep their pace.
  for (const a of $('chapter').getAnimations({ subtree: true })) {
    if (a.effect.getTiming().iterations !== Infinity) a.playbackRate = 10;
  }
});
$('ch-home').addEventListener('click', openMenu);
$('ch-standings').addEventListener('click', () => $('game-over').showModal());
// On from the end card: its words go out, then the pause for an ad, and the next card's picture
// comes up over the end card's own.
function onFromEnd(value) {
  const box = $('chapter');
  // a full address: in a CSS variable a relative one would be read from the style sheet's folder
  const src = $('ch-art').dataset.src;
  box.style.setProperty('--picture', src ? `url("${new URL(src, location.href)}")` : 'none');
  box.classList.add('turning');
  setTimeout(() => adBreak(() => goOn(value)), 600);
}

// The pause for an ad after a finished game, before what comes next: once a game, after every togt
// but the first (the one that teaches the game) and every free game. A stand-in for now, a light
// screen counting down with a way to skip, to feel how it plays before the Android app shows real
// ads (memory: togter-plan). The music rests meanwhile, as it would for an ad.
const AD_SECONDS = 8;
function adBreak(then) {
  if (!game || game.adShown || game.togt === TOGTER[0].map) return then();
  game.adShown = true;
  const box = $('ad-break');
  const playing = Music.enabled;
  Music.pause();
  let left = AD_SECONDS;
  let timer = 0;
  const tick = () => {
    $('ad-count').textContent = L.adCount(left);
    if (left-- <= 0) done();
  };
  const done = () => {
    clearInterval(timer);
    $('ad-skip').onclick = null;
    box.classList.add('out');
    if (playing) Music.play();
    then();
    setTimeout(() => {
      box.hidden = true;
      box.classList.remove('out');
    }, 350);
  };
  box.style.setProperty('--secs', `${AD_SECONDS}s`);
  // the bar runs anew each time
  $('ad-time').style.animation = 'none';
  void $('ad-time').offsetWidth;
  $('ad-time').style.animation = '';
  box.hidden = false;
  tick();
  timer = setInterval(tick, 1000);
  $('ad-skip').onclick = done;
  $('ad-skip').focus({ preventScroll: true });
}
$('ch-easy').addEventListener('click', () => onFromEnd('easy'));
$('ch-go').addEventListener('click', () => {
  const box = $('chapter');
  if (box.classList.contains('ending')) {
    const next = afterGame()?.value;
    return next ? onFromEnd(next) : adBreak(() => goOn('home'));
  }
  game.told = true;
  save();
  box.classList.add('leave');
  setTimeout(() => {
    box.hidden = true;
    document.body.classList.remove('telling');
    const glide = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1500;
    const you = game.seats.indexOf('human');
    board.focus(G.owned(s, you), { glide });
    // The goal was told on the card; the game begins when the map is there.
    setTimeout(schedule, glide + 150);
  }, 450);
});

// Start zoomed in on the (first) human player's territories, or the whole map when only bots play.
function focusOnPlayer() {
  const you = game.seats.indexOf('human');
  board.focus(you >= 0 ? G.owned(s, you) : null);
}

function act(a) {
  const r = G.apply(map, rules, s, a);
  if (!r.ok) {
    hint(L.errors[r.error] ?? r.error);
    return false;
  }
  s = r.state;
  game.actions.push(a);
  const taken = r.events.filter((e) => e.type === 'conquer' && game.seats[e.p] === 'human').length;
  if (taken) game.taken = (game.taken ?? 0) + taken;
  save();
  if (game.guide && guideDone(s)) endGuide();
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

// Bots play one action at a time, with a pause so you can follow them.
function schedule() {
  clearTimeout(botTimer);
  if (s.phase === 'over' || !isBot() || !$('intro').hidden || !$('chapter').hidden || $('game-menu').open) return;
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
    useMap(saved.map ?? 'world');
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
    if (!mine) return hint(L.placeOwn);
    sel.from = t;
    act({ type: 'place', t, n: 1 });
  } else if (s.phase === 'attack') {
    if (mine) {
      if (s.armies[t] < 2) return hint(L.attackNeeds2);
      sel = { from: t, to: -1, n: 0 };
    } else if (sel.from >= 0 && map.territories[sel.from].adj.includes(t)) {
      sel.to = t;
    } else {
      return hint(sel.from >= 0 ? L.pickEnemy : L.pickOwnFirst);
    }
    render();
  } else if (s.phase === 'fortify') {
    if (!mine) return hint(L.moveOwnOnly);
    if (t === sel.from) {
      clearSel(); // tapping the start territory again lets you pick another
    } else if (sel.from >= 0 && G.fortifyTargets(map, rules, s, sel.from).includes(t)) {
      sel.to = t;
      sel.n = s.armies[sel.from] - 1;
    } else if (s.armies[t] > 1) {
      sel = { from: t, to: -1, n: 0 };
    } else {
      return hint(L.leaveOne);
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
  const note = game.guide ? guideNote(map, s, sel, game.actions, game.guide) : null;
  note?.marks?.forEach((t) => targets.add(t));
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

  // With four players or more, two to a row, so the names take less of the map.
  $('players').classList.toggle('many', s.players.length > 3);
  $('players').replaceChildren(
    ...s.players.map((pl, i) => {
      const li = document.createElement('li');
      li.className = (i === p && s.phase !== 'over' ? 'current ' : '') + (pl.alive ? '' : 'out');
      const land = G.owned(s, i).length;
      li.title = L.playerTitle(pl.name, land, pl.stars);
      li.innerHTML = `${sealIcon(lookOf(i))}<span class="name">${pl.name}</span>
        <span class="stats">${land} · ${starsText(pl.stars)}</span>`;
      return li;
    }),
  );
  renderBar(note);
  renderHudButtons();
}

function renderBar(note) {
  const p = s.current;
  const name = s.players[p].name;
  const buttons = [];
  const button = (label, fn, opts = {}) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.className = [opts.primary && 'primary', opts.wide && 'wide'].filter(Boolean).join(' ');
    b.disabled = !!opts.disabled;
    if (opts.key) b.dataset.key = opts.key;
    b.addEventListener('click', fn);
    buttons.push(b);
  };
  let phase = '';
  let text = '';
  let stepper = null; // [min, max] when the amount stepper is shown
  let shown = 0; // added to the number the stepper shows (moving in: the armies already there)
  let reserve = -1; // armies left to place, shown big while reinforcing
  const turn = `${L.round(s.round)} · ${L.phases[s.phase]}`;
  const names = (t) => map.territories[t].name;

  if (s.phase === 'over') {
    phase = L.gameOver;
    text = L.won(subject(s.winner), soloYou(s.winner));
    button(L.toStart, showIntro);
    const after = afterGame();
    if (after) button(after.label, () => adBreak(() => goOn(after.value)), { primary: true });
  } else if (isBot()) {
    phase = `${L.round(s.round)} · ${L.phaseNames[s.phase]}`;
    text = L.thinking(name);
  } else if (s.phase === 'reinforce') {
    phase = turn;
    reserve = s.reserve;
    const lucky = lastLuck?.p === p && lastLuck.round === s.round ? L.fromLuck(lastLuck.armies) : '';
    if (s.reserve) text = L.tapToPlace(lucky);
    else text = L.allPlaced;
    const stars = s.players[p].stars;
    if (stars) {
      text += L.starsOffer(starCount(stars), armies(worth(stars)), starCount(stars + 1), armies(worth(stars + 1)));
      button(L.cashStars(starCount(stars), armies(worth(stars))), () => act({ type: 'luck' }), { wide: true, key: 'cash' });
    }
    if (s.reserve && sel.from >= 0 && s.owner[sel.from] === p) {
      button(L.restOn(names(sel.from)), () => act({ type: 'place', t: sel.from, n: s.reserve }), { key: 'rest' });
    }
    button(L.toAttack, () => act({ type: 'end' }), { primary: true, disabled: s.reserve > 0, key: 'toAttack' });
  } else if (s.phase === 'attack') {
    phase = turn;
    if (sel.from < 0) {
      text = L.attackPick;
      if (!s.conquered) text += L.attackStar;
    } else if (sel.to < 0) text = L.attackFrom(names(sel.from));
    else text = L.versus(names(sel.from), s.armies[sel.from], names(sel.to), s.armies[sel.to]);
    if (sel.to >= 0) {
      button(L.attack, () => act({ type: 'attack', from: sel.from, to: sel.to }), { primary: true, key: 'attack' });
      button(L.blitz, () => act({ type: 'blitz', from: sel.from, to: sel.to }), { key: 'blitz' });
    }
    button(L.endAttack, () => act({ type: 'end' }), { key: 'endAttack' });
  } else if (s.phase === 'occupy') {
    phase = turn;
    const { from, to } = s.occupy;
    // The stepper shows how many stand in the new land; the old one keeps the rest.
    text = L.occupy(names(to), names(from), s.armies[from] - sel.n);
    stepper = [0, s.armies[from] - 1];
    shown = s.armies[to];
    button(L.moveIn, () => act({ type: 'occupy', n: sel.n }), { primary: true, key: 'moveIn' });
  } else if (s.phase === 'fortify') {
    phase = turn;
    if (sel.from < 0) text = L.fortifyPick;
    else if (sel.to < 0) text = L.fortifyFrom(names(sel.from));
    else {
      text = L.fortifyTo(names(sel.from), names(sel.to));
      stepper = [1, s.armies[sel.from] - 1];
      button(L.move, () => act({ type: 'fortify', from: sel.from, to: sel.to, n: sel.n }), { primary: true });
    }
    if (sel.from >= 0) button(L.otherStart, () => (clearSel(), render()));
    button(L.endTurn, () => act({ type: 'end' }), { key: 'endTurn' });
  }

  $('phase').textContent = phase;
  $('reserve').hidden = reserve < 0;
  if (reserve >= 0) {
    const was = $('reserve').querySelector('b').textContent;
    $('reserve').querySelector('b').textContent = reserve;
    $('reserve').querySelector('span').textContent = L.reserve(reserve);
    if (was !== String(reserve)) {
      $('reserve').classList.remove('bump');
      void $('reserve').offsetWidth;
      $('reserve').classList.add('bump');
    }
  }
  $('undo').hidden = !canUndo();
  $('hint').textContent = note ? '' : text;
  $('actions').replaceChildren(...buttons);
  renderGuide(note);
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

const hint = (text) => ($('hint').textContent = text);

// An army placed on the wrong territory can be taken back, one at a time, while the turn's armies are
// still being placed: the game is played again from the start without the last placing.
const canUndo = () => s.phase === 'reinforce' && !isBot() && game.actions.at(-1)?.type === 'place';
$('undo').addEventListener('click', () => {
  if (!canUndo()) return;
  game.actions.pop();
  s = G.replay(map, rules, game.setup, game.actions);
  save();
  render();
});

/* ---------- the first game's guide ---------- */

// Someone new: nothing won, and the guide not yet seen through (or waved away).
const newcomer = () => !progress.guided && !progress.veteran && !Object.keys(progress.won).length;

function renderGuide(note) {
  const box = $('guide');
  box.hidden = !note;
  document.querySelector('#bar .pulse')?.classList.remove('pulse');
  if (!note) return;
  const m = s.mode === 'mission' ? s.players[s.current].mission : null;
  const button = isGoal(s.current) ? L.goalButton : L.mission;
  $('guide-text').innerHTML = L.guide[note.id]
    .replace('{goal}', m ? L.guideGoal(button) : '')
    .replace('{button}', button)
    .replace('{regions}', m?.type === 'regions' ? andList(m.regions.map((r) => map.regions[r].name)) : '')
    .replace('{name}', m?.type === 'eliminate' ? s.players[m.target].name : '');
  guideOk.hidden = !note.ok;
  $('guide-text').append(' ', guideOk);
  if (box.dataset.id !== note.id) {
    box.dataset.id = note.id;
    box.classList.remove('show');
    void box.offsetWidth;
    box.classList.add('show');
  }
  if (note.button) document.querySelector(`#bar [data-key="${note.button}"]`)?.classList.add('pulse');
}
function endGuide() {
  delete game.guide;
  save();
  progress = { ...progress, guided: true };
  saveProgress(progress);
}
// The button that puts the goal away stands at the end of the note's words.
const guideOk = $('guide-ok');
guideOk.addEventListener('click', () => {
  game.guide = { ...game.guide, goal: true };
  save();
  render();
});
$('guide-skip').addEventListener('click', () => {
  endGuide();
  render();
});

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

// A region's name was tapped: light it up and say what it is made of and who holds it.
function showRegion(r) {
  const region = map.regions[r];
  const n = region.members.length;
  const names = region.members.map((t) => map.territories[t].name);
  let text = L.regionText(region.name, andList(names), n, region.bonus);
  if (game) {
    const held = s.players
      .map((_, p) => [p, region.members.filter((t) => s.owner[t] === p).length])
      .filter(([, k]) => k)
      .sort((a, b) => b[1] - a[1]);
    text += held.length === 1 ? ` ${L.holdsAll(subject(held[0][0]), soloYou(held[0][0]))}` : ` ${held.map(([p, k]) => L.holds(subject(p), soloYou(p), k)).join(', ')}.`;
  }
  board.showRegion(r);
  toasts.length = 0; // the newest tap wins
  toast(text);
}

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
    <div>${rolls.length > 1 ? L.rolls(rolls.length) : ''}${L.losses(lostA, lostD)}</div>
    ${conquest ? `<div><b>${L.conquered(map.territories[conquest.to].name)}</b></div>` : ''}
    ${out ? `<div><b>${L.out(subject(out.p), soloYou(out.p))}</b></div>` : ''}`;
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
// "Change setup", since most of the time you just want another game like the last one.
let draft = loadSettings();
let lookOpen = 0; // whose coat-of-arms picker is open (-1: none)
const MAX_PLAYERS = 6;
// The table holds 2 to 6 players; one person alone needs at least one computer player.
const fewestBots = () => (draft.people.length > 1 ? 0 : 1);
const fitBots = () => (draft.opponents = Math.max(fewestBots(), Math.min(MAX_PLAYERS - draft.people.length, draft.opponents)));
const CHOICES = {
  opponents: () =>
    Array.from({ length: MAX_PLAYERS - draft.people.length - fewestBots() + 1 }, (_, i) => [fewestBots() + i, String(fewestBots() + i)]),
  level: () => Object.entries(L.levels),
  // A map still to be won in the togter is shown locked.
  // the world first, the free game's own map; then the rest through history
  map: () => ['world', ...Object.keys(MAPS).filter((id) => id !== 'world')].map((id) => [id, mapIn(id).name, !isFree(id)]),
  mode: () => Object.entries(L.modes),
};

const andList = (list) => (list.length > 1 ? `${list.slice(0, -1).join(', ')} ${L.and} ${list.at(-1)}` : list[0]);

// Who plays at this device, for the folded list of them.
const peopleNames = (x) => andList(x.people.map((_, i) => personName(x, i)));

// The free game as it stands, under its button: the map and who is in it.
function summary(x) {
  return [mapIn(x.map).name, ...(x.people.length > 1 ? [peopleNames(x)] : []), ...(x.opponents ? [L.bots(x.opponents)] : [])].join(' · ');
}

// One row per person: their coat of arms (tap to change it), their name, and × to remove them.
// The picker under a row shows the coats of arms; those someone else has are greyed out.
function renderPeople() {
  const rows = draft.people.flatMap((person, i) => {
    const li = document.createElement('li');
    li.className = 'person';
    const look = document.createElement('button');
    look.type = 'button';
    look.className = 'person-look';
    look.innerHTML = sealIcon(person.look);
    look.setAttribute('aria-label', L.changeArms);
    look.setAttribute('aria-expanded', String(lookOpen === i));
    look.addEventListener('click', () => {
      lookOpen = lookOpen === i ? -1 : i;
      renderSetup();
    });
    const input = document.createElement('input');
    Object.assign(input, { type: 'text', value: person.name, maxLength: NAME_LENGTH, spellcheck: false, enterKeyHint: 'done' });
    input.placeholder = draft.people.length === 1 ? L.you : L.player(i + 1);
    input.setAttribute('aria-label', L.nameOf(i + 1));
    input.addEventListener('input', () => {
      person.name = input.value;
      $('people-names').textContent = peopleNames(draft);
    });
    // Enter closes the keyboard instead of pressing the dialog's first button (Back).
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        input.blur();
      }
    });
    li.append(look, input);
    if (draft.people.length > 1) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'person-remove';
      remove.textContent = '×';
      remove.setAttribute('aria-label', L.remove(personName(draft, i)));
      remove.addEventListener('click', () => {
        draft.people.splice(i, 1);
        lookOpen = -1;
        fitBots();
        renderSetup();
      });
      li.append(remove);
    }
    if (lookOpen !== i) return [li];
    const picker = document.createElement('li');
    picker.className = 'looks';
    picker.append(
      ...COLORS.map((_, k) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.innerHTML = sealIcon(k);
        b.setAttribute('aria-label', L.arms(k + 1));
        b.setAttribute('aria-pressed', String(person.look === k));
        b.disabled = draft.people.some((other) => other !== person && other.look === k);
        b.addEventListener('click', () => {
          person.look = k;
          lookOpen = -1;
          renderSetup();
        });
        return b;
      }),
    );
    return [li, picker];
  });
  $('people').replaceChildren(...rows);
  $('add-person').hidden = draft.people.length >= MAX_PLAYERS;
}

$('add-person').addEventListener('click', () => {
  draft.people.push({ name: '', look: COLORS.findIndex((_, k) => !draft.people.some((x) => x.look === k)) });
  lookOpen = -1;
  fitBots();
  renderSetup();
  [...$('people').querySelectorAll('input')].at(-1).focus();
});

function renderSetup() {
  $('people-names').textContent = peopleNames(draft);
  renderPeople();
  $('bot-fields').hidden = !draft.opponents;
  document.querySelectorAll('#new-game .pills').forEach((box) => {
    const name = box.dataset.name;
    box.replaceChildren(
      ...CHOICES[name]().map(([value, label, locked]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = locked ? `🔒 ${label}` : label;
        b.disabled = !!locked;
        // The maps show their togt's picture, or a small picture of themselves (tools/map-shots.mjs).
        if (name === 'map') {
          const picture = document.createElement('span');
          picture.className = 'map-picture';
          picture.innerHTML = thumbImg(value);
          b.prepend(picture);
        }
        b.setAttribute('aria-pressed', String(draft[name] === value));
        b.addEventListener('click', () => {
          draft[name] = value;
          fitBots();
          renderSetup();
        });
        return b;
      }),
    );
  });
  $('locked-note').hidden = Object.keys(MAPS).every(isFree);
}

function openNewGame() {
  draft = loadSettings();
  lookOpen = -1;
  renderSetup();
  $('people-fold').open = false;
  $('cancel-new').hidden = false;
  $('new-game').showModal();
}

$('new-game').addEventListener('close', () => {
  if ($('new-game').returnValue !== 'start') return;
  draft.people.forEach((x) => (x.name = x.name.trim().slice(0, NAME_LENGTH)));
  saveSettings({ ...loadSettings(), ...draft, sound: Sound.enabled });
  replaceGame(() => startFromSettings(draft));
});

// A new game takes the place of the one going on, so first ask, when there is one.
let replacing = null;
function replaceGame(start) {
  if (!game || s.phase === 'over') return start();
  replacing = start;
  $('replace-dialog').returnValue = '';
  $('replace-dialog').showModal();
}
$('replace-dialog').addEventListener('close', () => {
  const start = replacing;
  replacing = null;
  if ($('replace-dialog').returnValue === 'new') start();
});


function openGameOver() {
  const w = s.players[s.winner];
  const how = {
    world: () => L.wonWorld(subject(s.winner), soloYou(s.winner), s.round),
    mission: () =>
      isGoal(s.winner) ? L.wonGoal(s.round, goalText(w.mission)) : L.wonMission(subject(s.winner), soloYou(s.winner), s.round, missionText(w.mission, soloYou(s.winner))),
    rounds: () => L.wonRounds(subject(s.winner), soloYou(s.winner)),
  }[s.won]();
  // The winner, big: their coat of arms, their name and the title they have won (or a name: "den Store").
  const title = grid.EPITHET ? `<b>${w.name} ${grid.EPITHET}</b>` : `<b>${w.name}</b><span>${grid.TITLE ?? 'Ruler of the Map'}</span>`;
  $('over-ruler').innerHTML = `${sealIcon(lookOf(s.winner))}${title}`;
  const place = G.standings(s);
  const rows = place.map((p, i) => {
    const pl = s.players[p];
    const fate = p === s.winner ? L.winner : pl.alive ? L.territories(G.owned(s, p).length) : L.outIn(pl.outRound);
    const mission = s.mode === 'mission' && p !== s.winner ? `<small>${isGoal(p) ? goalText(pl.mission) : missionText(pl.mission, soloYou(p))}</small>` : '';
    return `<li class="${game.seats[p] === 'human' ? 'you' : ''}"><span class="place">${i + 1}.</span>
      ${sealIcon(lookOf(p))}<span class="who">${pl.name}<small>${fate}</small>${mission}</span></li>`;
  });
  const me = place.findIndex((p) => game.seats[p] === 'human');
  const mine = me >= 0 && game.seats.filter((x) => x === 'human').length === 1 ? `<p class="your-place">${L.yourPlace(me + 1, place.length)}</p>` : '';
  $('over-text').innerHTML = `<p>${how}</p>${mine}<ol class="standings">${rows.join('')}</ol>`;
  // People at the phone get the end card; a game of computer players only ends in the standings.
  const people = game.seats.filter((x) => x === 'human').length;
  if (people === 1) countGame();
  const togt = game.togt ? togtOver() : { news: [] };
  ending = people ? { won: game.seats[s.winner] === 'human', how, place: me >= 0 && people === 1 ? L.yourPlace(me + 1, place.length) : '', ...togt } : null;
  const after = afterGame();
  $('over-again').hidden = !after;
  if (after) Object.assign($('over-again'), { value: after.value, textContent: after.label });
  setTimeout(() => {
    if ($('game-over').open || !$('chapter').hidden) return;
    if (ending) return showEnding(ending);
    // The bar says the same with the same buttons; it waits until the winner screen is closed.
    $('bar').hidden = true;
    $('game-over').showModal();
  }, 900);
}
$('game-over').addEventListener('close', () => {
  $('bar').hidden = false;
  const value = $('game-over').returnValue;
  if (value) adBreak(() => goOn(value));
});

// What the end card says (showEnding), while it is the game shown.
let ending = null;
// A finished togt is counted once (the game remembers it has been); a win tells what it opened, a loss
// offers easier opponents after two lost tries.
function togtOver() {
  const won = game.seats[s.winner] === 'human';
  const level = game.seats.find((x) => x !== 'human');
  const wasFree = freeMaps(progress, Object.keys(MAPS)).includes(game.togt);
  if (!game.counted) {
    game.medal = won ? newMedal(progress.won[game.togt], level) : null;
    progress = record(progress, game.togt, won, level);
    saveProgress(progress);
    game.counted = true;
    save();
  }
  if (!won) return { news: [], easy: offerEasy(progress, game.togt, level) };
  const medal = game.medal;
  const next = nextTogt(progress, game.togt);
  preloadArt(next?.art);
  const news = [
    !wasFree && L.newFreeMap(mapIn(game.togt).name),
    next ? L.nextUp(togtText(next.map).year, mapIn(next.map).name) : L.allTogterWon,
  ].filter(Boolean);
  return { news, medal };
}

// What comes after a finished game: a togt won goes on to the next, a togt lost is tried again, a
// free game is played again with the same setup. Nothing after the last togt.
function afterGame() {
  if (!game.togt) return { value: 'again', label: L.playAgain };
  if (game.seats[s.winner] !== 'human') return { value: 'again', label: L.tryAgain };
  return nextTogt(progress, game.togt) ? { value: 'next', label: L.nextTogt } : null;
}
function goOn(value) {
  if (value === 'home') home();
  else if (value === 'next') startTogt(nextTogt(progress, game.togt).map);
  else if (value === 'again') game.togt ? startTogt(game.togt) : startFromSettings();
  else if (value === 'easy') {
    saveSettings({ ...loadSettings(), togtLevel: 'novice' });
    startTogt(game.togt);
  }
}

/* ---------- missions and cards ---------- */

// Whose mission and cards the buttons show: the player whose turn it is, or else the one human.
function viewer() {
  if (!game) return -1;
  if (game.seats[s.current] === 'human') return s.current;
  const humans = game.seats.flatMap((x, i) => (x === 'human' ? [i] : []));
  return humans.length === 1 ? humans[0] : -1;
}

const regionNames = (list) => andList(list.map((r) => map.regions[r].name));
// In a togt the person playing has history's goal instead of a secret mission (js/togter.js).
const isGoal = (p) => !!game?.togt && game.seats[p] === 'human';
const goalText = (m) => L.goalRegions(regionNames(m.regions), m.plusOne);

// yours: the text speaks to you; otherwise it describes someone else's mission.
function missionText(m, yours = true) {
  if (!m) return '';
  if (m.type === 'regions') return L.missionRegions(regionNames(m.regions), m.plusOne);
  if (m.type === 'territories') return m.armies > 1 ? L.missionArmies(m.count, m.armies) : L.missionHold(m.count);
  const instead = G.fallback(map).count;
  return (yours ? L.missionYours : L.missionTheirs)(object(m.target), instead);
}

function missionProgress(p) {
  const m = s.players[p].mission;
  if (m.type === 'regions') {
    const parts = m.regions.map((r) => {
      const have = map.regions[r].members.filter((t) => s.owner[t] === p).length;
      return L.regionProgress(map.regions[r].name, have, map.regions[r].members.length);
    });
    if (m.plusOne) {
      const extra = map.regions.filter((_, r) => !m.regions.includes(r) && G.holdsRegion(map, s, p, r)).map((r) => r.name);
      parts.push(extra.length ? L.oneMore(extra.join(', ')) : L.oneMoreNot);
    }
    return parts.join(' · ');
  }
  if (m.type === 'territories') {
    const have = s.owner.filter((o, t) => o === p && s.armies[t] >= m.armies).length;
    return L.youHave(have, m.count);
  }
  const left = G.owned(s, m.target).length;
  return left ? L.left(subject(m.target), soloYou(m.target), left) : L.out(subject(m.target), soloYou(m.target));
}

function openMission() {
  const p = viewer();
  if (p < 0 || !s.players[p].mission) return;
  $('mission-who').textContent = s.players.filter((_, i) => game.seats[i] === 'human').length > 1 ? s.players[p].name : '';
  const goal = isGoal(p);
  $('mission-title').textContent = goal ? L.yourGoal : L.yourMission;
  $('mission-text').textContent = goal ? `${togtText(game.togt).goal} ${goalText(s.players[p].mission)}` : missionText(s.players[p].mission);
  $('mission-progress').textContent = missionProgress(p);
  $('mission-map').innerHTML = missionMap(p);
  $('mission-note').textContent = goal ? L.goalNote : L.missionSecret;
  $('mission-dialog').showModal();
}
// The mission on a small map: the regions to hold, outlined, with your territories in them in your
// colour and the ones still missing hatched; or the player to knock out, in their colour. Your other
// territories are there in a paler colour. Holding a number of territories has no map. The map is
// framed on the goal, so its hatching can be seen on a phone; a tap shows the whole land and back.
let shapesFor = null; // the outlines of the map in play, traced once
function missionMap(p) {
  const m = s.players[p].mission;
  if (m.type === 'territories') return '';
  if (shapesFor?.id !== grid.id) shapesFor = { id: grid.id, land: mapShapes(grid).outlines, regions: regionShapes(grid) };
  const { land, regions } = shapesFor;
  const goal = new Set(m.type === 'regions' ? m.regions.flatMap((r) => map.regions[r].members) : G.owned(s, m.target));
  const yours = COLORS[game.colors[p]];
  const fill = (t) => {
    if (!goal.has(t)) return s.owner[t] === p ? `fill="${yours}" fill-opacity=".45"` : 'fill="var(--rest)"';
    return `fill="${m.type === 'eliminate' ? COLORS[game.colors[m.target]] : s.owner[t] === p ? yours : 'url(#missing)'}"`;
  };
  const shape = (d, attrs) => `<path d="${d}" vector-effect="non-scaling-stroke" ${attrs}/>`;
  const territories = map.territories.map((t, i) => shape(land[grid.MAP.territories[t.id].letter], fill(i))).join('');
  const outlined = m.type === 'regions' ? m.regions.map((r) => shape(regions[map.regions[r].id], 'fill="none" stroke-width="2.2"')).join('') : '';
  const key = m.type === 'regions' ? `<p class="mission-key"><i style="background:${yours}"></i>${L.keyYours}<i class="missing"></i>${L.keyMissing}</p>` : '';
  const whole = `0 0 ${grid.WIDTH} ${grid.HEIGHT}`;
  const near = frame([...goal].map((t) => land[grid.MAP.territories[map.territories[t].id].letter]));
  return `<svg viewBox="${near ?? whole}" data-near="${near ?? ''}" data-whole="${whole}"${near ? ' class="framed"' : ''} aria-hidden="true">
    <pattern id="missing" width="1.2" height="1.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.2" height="1.2" fill="#f6ecd4"/><path d="M0 0V1.2" stroke="#4a3622" stroke-width=".5"/></pattern>
    ${land['#'] ? shape(land['#'], 'fill="var(--rest)" opacity=".4"') : ''}
    <g stroke="#5b4630" stroke-width=".6" stroke-linejoin="round">${territories}</g>
    <g stroke="#2a1d10" stroke-linejoin="round">${outlined}</g></svg>${key}`;
}
// The box around the goal's outlines, with room around it and not too narrow for the dialog; none
// when that is most of the map anyway.
function frame(outlines) {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const d of outlines) {
    for (const [, x, y] of d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)) {
      x0 = Math.min(x0, +x);
      x1 = Math.max(x1, +x);
      y0 = Math.min(y0, +y);
      y1 = Math.max(y1, +y);
    }
  }
  const pad = Math.max(x1 - x0, y1 - y0) * 0.15 + 2;
  let [w, h] = [x1 - x0 + 2 * pad, y1 - y0 + 2 * pad];
  [w, h] = [Math.max(w, h * 1.2), Math.max(h, w / 1.8)];
  if (w * h > grid.WIDTH * grid.HEIGHT * 0.6) return null;
  w = Math.min(w, grid.WIDTH);
  h = Math.min(h, grid.HEIGHT);
  const x = Math.min(Math.max((x0 + x1 - w) / 2, 0), grid.WIDTH - w);
  const y = Math.min(Math.max((y0 + y1 - h) / 2, 0), grid.HEIGHT - h);
  return [x, y, w, h].map((v) => +v.toFixed(2)).join(' ');
}
$('mission-map').addEventListener('click', () => {
  const svg = $('mission-map').querySelector('svg');
  if (!svg?.dataset.near) return;
  const near = svg.getAttribute('viewBox') === svg.dataset.near;
  svg.setAttribute('viewBox', near ? svg.dataset.whole : svg.dataset.near);
});
// The game waits while the mission is shown at the start.
$('mission-dialog').addEventListener('close', () => schedule());

/* ---------- war luck ---------- */

// Stars as ★★☆: filled for the ones you have, empty up to three; beyond three as ★★★+2.
// Beyond three, the number: ★ 5. ("+" is only ever used for armies.)
const starsText = (n) => (n > G.STARS ? `★ ${n}` : '★'.repeat(n) + '☆'.repeat(G.STARS - n));
// In sentences: "1 ★", "4 ★"; and armies with their word: "5 hære", "5 armies".
const starCount = (n) => `${n} ★`;
const armies = (n) => L.armies(n);
const worth = (n) => G.starValue(rules, n);
// Your stars can be cashed in now: your turn, reinforcing.
const canCash = (p) => p === s.current && s.phase === 'reinforce' && s.players[p].stars > 0 && !isBot();
let lastLuck = null; // { p, round, armies }: war luck at the start of this turn, for the hint

// A message for everything that happens with war luck, so it is never a mystery.
function luckNews(e) {
  const you = (p) => game.seats[p] === 'human';
  if (e.type === 'star' && you(e.p)) {
    toast(L.starNews(subject(e.p), soloYou(e.p), starCount(e.stars), armies(worth(e.stars))));
  }
  if (e.type === 'luck') {
    lastLuck = { p: e.p, round: s.round, armies: e.armies };
    toast(you(e.p) ? L.luckYours(starCount(e.stars), armies(e.armies)) : L.luckTheirs(s.players[e.p].name, starCount(e.stars), armies(e.armies)));
  }
  if (e.type === 'eliminate' && e.stars > 0) {
    toast(L.takesStars(subject(e.by), soloYou(e.by), object(e.p), soloYou(e.p), e.stars));
  }
}

function openLuck() {
  const p = viewer();
  if (p < 0) return;
  const stars = s.players[p].stars;
  $('luck-who').textContent = s.players.filter((_, i) => game.seats[i] === 'human').length > 1 ? s.players[p].name : '';
  $('luck-stars').textContent = starsText(stars);
  $('luck-text').textContent = !stars
    ? L.noStars
    : L.haveStars(starCount(stars), armies(worth(stars)), armies(worth(stars + 1)));
  $('ladder').innerHTML =
    [1, 2, 3].map((n) => `<span class="${Math.min(stars, G.STARS) === n ? 'next' : ''}">${starCount(n)} = ${armies(worth(n))}</span>`).join('') +
    `<span class="${stars > G.STARS ? 'next' : ''}">${L.eachMore(armies(rules.extraStar))}</span>`;
  $('cash-btn').hidden = !canCash(p);
  $('cash-btn').textContent = L.cashArmies(armies(worth(stars)));
  $('luck-dialog').showModal();
}
$('luck-dialog').addEventListener('close', () => $('luck-dialog').returnValue === 'luck' && act({ type: 'luck' }));

function renderHudButtons() {
  const p = viewer();
  $('mission-btn').hidden = p < 0 || s.phase === 'over' || s.mode !== 'mission' || !s.players[p]?.mission;
  $('mission-btn').textContent = p >= 0 && isGoal(p) ? L.goalButton : L.mission;
  $('luck-btn').hidden = p < 0 || s.phase === 'over';
  if (p < 0) return;
  // The button shows your stars, and glows when three are ready to become armies.
  $('luck-btn').textContent = L.luckButton(starsText(s.players[p].stars));
  $('luck-btn').classList.toggle('ready', canCash(p));
}
$('mission-btn').addEventListener('click', openMission);
$('luck-btn').addEventListener('click', openLuck);
$('home-btn').addEventListener('click', openMenu);

/* ---------- start screen ---------- */

// The start screen is the menu: continue, the togter, a free game like the last one, change the
// setup, the rules and the settings. The game behind it waits. The very first time it welcomes
// you instead.
function showIntro() {
  clearTimeout(botTimer);
  const going = game && s.phase !== 'over';
  $('welcome').hidden = progress.welcomed;
  $('menu').hidden = !progress.welcomed;
  $('intro').classList.toggle('first', !progress.welcomed);
  if (!progress.welcomed) return showWelcome();
  $('intro-continue').hidden = !going;
  // With no game going, the togter come first until every one is won.
  const won = TOGTER.filter((t) => progress.won[t.map]).length;
  const next = upNext(progress);
  $('intro-togter').classList.toggle('primary', !going && !!next);
  $('intro-new').classList.toggle('primary', !going && !next);
  // Over the buttons: the togter won and their medals; nothing yet for someone who has won none.
  const counts = medalCounts(progress.won);
  $('intro-progress').hidden = !won;
  $('intro-progress').innerHTML = `<span>${L.togterWon(won, TOGTER.length)}</span>${MEDALS.filter((m) => counts[m])
    .map((m) => `<span class="medal-count">${medalIcon(m)}${counts[m]}</span>`).join('')}`;
  $('togt-summary').textContent = next ? L.togtUpNext(togtText(next.map).year, mapIn(next.map).name) : L.togtAllWon;
  $('intro-summary').textContent = summary(loadSettings());
  if (going) $('continue-summary').textContent = `${mapIn(game.map).name} · ${L.round(s.round)}`;
  $('intro').hidden = false;
  // The picture of the game you are in or played last, else of the next togt.
  showIntroArt(togtOf(game?.map)?.art ?? next?.art ?? pictureOf('world'));
  preloadThumbs();
}

// The start screen's picture. A new one comes up over the old, so nothing goes dark between them.
function showIntroArt(src) {
  const box = $('intro-art');
  if (box.dataset.src === src) return;
  box.dataset.src = src;
  preloadArt(src).then(() => {
    if (box.dataset.src !== src) return;
    while (box.children.length > 1) box.firstChild.remove();
    const picture = document.createElement('div');
    picture.style.backgroundImage = `url("${src}")`;
    box.append(picture);
  });
}

/* ---------- welcome ---------- */

// Cards to swipe through (index.html): what the game is, the two ways to play, a turn, and last your
// name, coat of arms and level, and how to begin. They are the first person's in the free game's setup
// too. Each card's words come in the first time it is shown.
const slides = [...document.querySelectorAll('.slide')];
let slide = 0;
$('slide-dots').replaceChildren(...slides.map(() => document.createElement('i')));
function onSlide(i) {
  slide = i;
  [...$('slide-dots').children].forEach((dot, k) => dot.classList.toggle('on', k === i));
  $('slide-next').hidden = $('slide-skip').hidden = i === slides.length - 1;
  slides[i].classList.add('seen');
  showIntroArt(slides[i].dataset.art);
}
const toSlide = (i) => $('slides').scrollTo({ left: i * $('slides').clientWidth, behavior: 'smooth' });
$('slides').addEventListener('scroll', () => {
  const i = Math.round($('slides').scrollLeft / $('slides').clientWidth);
  if (i !== slide) onSlide(i);
}, { passive: true });
$('slide-next').addEventListener('click', () => toSlide(slide + 1));
// Skipping fades the cards out and in again on the last one, without passing the ones between.
$('slide-skip').addEventListener('click', () => {
  $('slides').classList.add('jump');
  setTimeout(() => {
    $('slides').scrollTo({ left: (slides.length - 1) * $('slides').clientWidth, behavior: 'instant' });
    $('slides').classList.remove('jump');
  }, 180);
});
// The other language, in the corner of the welcome: one tap and every word changes.
const otherLanguage = () => Object.keys(LANGUAGES).find((lang) => lang !== L.lang);
$('welcome-lang').addEventListener('click', () => pickLanguageNow(otherLanguage()));
function showWelcome() {
  $('welcome-input').value = loadSettings().people[0].name;
  $('welcome-input').placeholder = L.yourName;
  renderWelcomeChoices();
  $('intro').hidden = false;
  $('slides').scrollLeft = 0;
  onSlide(0);
}
function renderWelcomeChoices() {
  $('welcome-lang').lastChild.textContent = LANGUAGES[otherLanguage()];
  const settings = loadSettings();
  const person = settings.people[0];
  $('welcome-looks').replaceChildren(
    ...COLORS.map((_, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = sealIcon(k);
      b.setAttribute('aria-label', L.arms(k + 1));
      b.setAttribute('aria-pressed', String(person.look === k));
      b.addEventListener('click', () => {
        setPerson({ look: k });
        renderWelcomeChoices();
      });
      return b;
    }),
  );
  pills($('welcome-level'), Object.entries(L.levels), settings.togtLevel, (level) => {
    saveSettings({ ...loadSettings(), togtLevel: level, level });
    renderWelcomeChoices();
  });
}
// Changes the first person at the phone and saves it.
function setPerson(change) {
  const settings = loadSettings();
  settings.people[0] = { ...settings.people[0], ...change };
  saveSettings(settings);
}
$('welcome-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    $('welcome-input').blur();
  }
});
function welcomed() {
  setPerson({ name: $('welcome-input').value.trim().slice(0, NAME_LENGTH) });
  progress = { ...progress, welcomed: true };
  saveProgress(progress);
  showIntro();
}
$('choose-togter').addEventListener('click', () => {
  welcomed();
  startTogt(TOGTER[0].map);
});
$('choose-free').addEventListener('click', () => {
  welcomed();
  openNewGame();
});

/* ---------- the togter ---------- */

// The togter as a line of years, oldest first: won, the next one, or locked until the one before is
// won. The opponents' level is chosen here, once for all of them.
// A togt's picture (togter.js, art), or for a togt without one, its map (tools/map-shots.mjs).
function pictureOf(id) {
  return togtOf(id)?.art ?? `assets/maps/${id}.jpg`;
}
// The same, small, for the lists: sixteen full pictures at once are more than a phone keeps while
// scrolling (tools/make-thumbs.ps1).
function thumbOf(id) {
  return togtOf(id)?.art?.replace('assets/togter/', 'assets/togter/small/') ?? `assets/maps/${id}.jpg`;
}
// As a picture that is unpacked before it is drawn, so a list scrolled quickly shows no empty frames
// while the phone gets to it; fetched early, while the start screen is up (preloadThumbs).
const thumbImg = (id) => `<img src="${thumbOf(id)}" alt="" decoding="sync" draggable="false">`;
let thumbsLoaded = false;
function preloadThumbs() {
  if (thumbsLoaded) return;
  thumbsLoaded = true;
  const load = () => Object.keys(MAPS).forEach((id) => preloadArt(thumbOf(id)));
  'requestIdleCallback' in window ? requestIdleCallback(load, { timeout: 2000 }) : setTimeout(load, 500);
}
function openTogter() {
  renderTogter();
  $('togter').showModal();
}
function renderTogter() {
  const settings = loadSettings();
  pills($('togt-level'), Object.entries(L.levels), settings.togtLevel, (lvl) => {
    saveSettings({ ...loadSettings(), togtLevel: lvl });
    renderTogter();
  });
  const next = upNext(progress);
  $('togt-list').replaceChildren(
    ...TOGTER.map((t, i) => {
      const open = isOpen(progress, i);
      const won = progress.won[t.map];
      if (open) preloadArt(t.art);
      const li = document.createElement('li');
      li.className = won ? `won ${won}` : t === next ? 'next' : open ? '' : 'locked';
      const b = document.createElement('button');
      b.type = 'button';
      b.disabled = !open;
      const text = togtText(t.map);
      const state = won ? `${medalIcon(won)}${L.togtWon(L.levels[won])}` : t === next ? L.togtNext : open ? L.togtOpen : `🔒 ${L.togtLocked}`;
      b.innerHTML = `<span class="togt-thumb">${thumbImg(t.map)}</span>
        <span class="togt-body"><span class="togt-year">${text.year}</span><b>${mapIn(t.map).name}</b><small>${text.teaser}</small><small class="togt-state">${state}</small></span>`;
      b.addEventListener('click', () => {
        $('togter').close();
        replaceGame(() => startTogt(t.map));
      });
      li.append(b);
      return li;
    }),
  );
}
$('intro-togter').addEventListener('click', openTogter);

// The medals and the numbers. Medals come from the togter won; the numbers from the games finished.
function openStats() {
  const counts = medalCounts(progress.won);
  $('stats-medals').innerHTML = MEDALS.map((m) => `<div class="${counts[m] ? '' : 'none'}">${medalIcon(m)}<b>${counts[m]}</b><span>${L.medals[m]}</span></div>`).join('');
  const won = TOGTER.filter((t) => progress.won[t.map]).length;
  const rows = [
    [L.statPlayed, stats.played],
    [L.statWon, `${stats.won} (${L.percent(stats.played ? Math.round((100 * stats.won) / stats.played) : 0)})`],
    [L.statStreak, L.streakText(stats.streak, stats.best)],
    [L.statTaken, stats.taken],
    [L.togterTitle, L.togtProgress(won, TOGTER.length)],
  ];
  $('stats-numbers').innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
  const fastest = Object.entries(stats.fastest).filter(([id]) => MAPS[id]).sort((a, b) => a[1] - b[1]);
  $('stats-fastest').innerHTML = fastest.map(([id, n]) => `<li><span>${mapIn(id).name}</span><b>${L.inRounds(n)}</b></li>`).join('');
  $('stats-numbers').hidden = !stats.played;
  $('stats-empty').hidden = !!stats.played;
  $('stats-fastest-h').hidden = $('stats-fastest').hidden = !fastest.length;
  $('stats').showModal();
}
$('stats-btn').addEventListener('click', openStats);
// The title is two lines that never wrap: shrink it when a line is wider than the card, which
// happens on narrow phones and with large text.
let titleWidth = 0;
function fitTitle(force) {
  const h = $('intro-title');
  if (h.clientWidth === titleWidth && force !== true) return; // shrinking changes the height, not the width
  titleWidth = h.clientWidth;
  h.style.fontSize = '';
  const widest = Math.max(...[...h.children].map((line) => line.scrollWidth));
  if (widest > h.clientWidth) h.style.fontSize = `${Math.floor(parseFloat(getComputedStyle(h).fontSize) * h.clientWidth / widest)}px`;
}
new ResizeObserver(fitTitle).observe($('intro-title'));
document.fonts.ready.then(() => fitTitle(true));
function hideIntro() {
  $('intro').hidden = true;
  stepAway();
  if (game?.told === false) return showOpening();
  schedule();
}

// Up to the start screen: the menu, and the phone's back button. A togt's year card that was left
// waits there; Continue brings it back.
function goHome() {
  if (!$('chapter').hidden) {
    $('chapter').hidden = true;
    document.body.classList.remove('telling');
  }
  showIntro();
}
// Leaving the start screen leaves a step in the history, so the back button comes up to it instead of
// leaving the page; on the start screen, back leaves as on any page. The menu takes that step back.
function stepAway() {
  if (!history.state?.away) history.pushState({ away: true }, '');
}
function home() {
  if (!history.state?.away) return goHome();
  history.back();
  // Chrome skips a history step made without a tap, and in the installed app there is no page behind
  // it to go back to, so back may do nothing: then go home here and mark the step as home.
  setTimeout(() => {
    if (!$('intro').hidden) return;
    history.replaceState(null, '');
    goHome();
  }, 400);
}
addEventListener('popstate', () => {
  // A browser that takes back to close a dialog by going back: close it, and stay in the game.
  const open = [...document.querySelectorAll('dialog[open]')].at(-1);
  if (open) {
    open.close('');
    if (game && $('intro').hidden) stepAway();
    return;
  }
  if ($('intro').hidden) goHome();
});
$('intro-continue').addEventListener('click', hideIntro);
$('intro-new').addEventListener('click', () => openNewGame());

/* ---------- settings: sound, light or dark, and language ---------- */

// Dark is the game's own look; 'auto' follows the phone's light or dark setting.
function applyTheme(theme) {
  if (theme === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="color-scheme"]').content = theme === 'auto' ? 'light dark' : theme;
}

function pills(box, options, current, pick) {
  box.replaceChildren(
    ...options.map(([value, label]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.setAttribute('aria-pressed', String(value === current));
      b.addEventListener('click', () => pick(value));
      return b;
    }),
  );
}

// Sound and music, in the settings and in the game's menu.
function soundPills(sound, music, again) {
  pills(sound, [[true, L.on], [false, L.off]], Sound.enabled, (on) => {
    Sound.enabled = on;
    saveSettings({ ...loadSettings(), sound: on });
    if (on) Sound.play('place');
    again();
  });
  pills(music, [[true, L.on], [false, L.off]], Music.enabled, (on) => {
    Music.enabled = on;
    saveSettings({ ...loadSettings(), music: on });
    if (on) Music.play();
    else Music.pause();
    again();
  });
}

function renderSettings() {
  const x = loadSettings();
  soundPills($('sound-pills'), $('music-pills'), renderSettings);
  pills($('theme-pills'), Object.entries(L.themes), x.theme, (theme) => {
    saveSettings({ ...loadSettings(), theme });
    applyTheme(theme);
    renderSettings();
  });
  pills($('palette-pills'), Object.entries(L.palettes), x.palette ?? 'normal', (palette) => {
    saveSettings({ ...loadSettings(), palette });
    usePalette(palette);
    if (game) render();
    renderSettings();
  });
  langPills($('lang-pills'), renderSettings);
}

// The language, saved and used at once; in the settings, in the game's menu and on the welcome.
function pickLanguageNow(lang) {
  saveSettings({ ...loadSettings(), lang });
  useLanguage(lang);
}
function langPills(box, again) {
  pills(box, Object.entries(LANGUAGES), L.lang, (lang) => {
    pickLanguageNow(lang);
    again();
  });
}

// Every text changes at once: the page, the map's names (drawn anew) and the game's panels.
function useLanguage(lang) {
  L = stringsFor(lang);
  translatePage(L);
  fitTitle(true);
  useMap(grid.id, true);
  if (game) {
    render();
    focusOnPlayer();
  } else showEmptyMap();
  if (!$('intro').hidden && progress.welcomed) showIntro();
  if (!$('intro').hidden && !progress.welcomed) {
    $('welcome-input').placeholder = L.yourName;
    renderWelcomeChoices();
  }
  if ($('togter').open) renderTogter();
  if (!$('chapter').hidden && game) {
    const card = $('chapter').classList;
    card.contains('ending') ? showEnding(ending) : showOpening();
  }
}
/* ---------- the menu in the game, and how to play ---------- */

// The same menu in the corner of the start screen and of the game; on the start screen it has no way home.
function renderMenu() {
  $('menu-home').hidden = !$('intro').hidden;
  soundPills($('menu-sound'), $('menu-music'), renderMenu);
  langPills($('menu-lang'), renderMenu);
}
function openMenu() {
  clearTimeout(botTimer);
  renderMenu();
  $('game-menu').returnValue = '';
  $('game-menu').showModal();
}
$('game-menu').addEventListener('close', () => {
  if ($('game-menu').returnValue === 'home') home();
  else schedule();
});
$('menu-how-to').addEventListener('click', openHowTo);
$('how-to-btn').addEventListener('click', openHowTo);
$('intro-menu').addEventListener('click', openMenu);

$('settings-btn').addEventListener('click', () => {
  renderSettings();
  $('settings').showModal();
});
applyTheme(loadSettings().theme);
usePalette(loadSettings().palette);
// Audio may only start from a tap. The music rests while the game is out of sight.
document.addEventListener(
  'pointerdown',
  () => {
    Sound.unlock();
    Music.play();
  },
  { capture: true },
);
document.addEventListener('visibilitychange', () => (document.hidden ? Music.pause() : Music.play()));
Sound.enabled = loadSettings().sound !== false;
Music.enabled = loadSettings().music !== false;
// After an update, the newest files all together (sw.js).
navigator.serviceWorker?.register('sw.js').catch(() => {});

// The zoom buttons sit just above the turn panel, whatever its height.
new ResizeObserver(() => document.documentElement.style.setProperty('--bar-h', `${$('bar').offsetHeight}px`)).observe($('bar'));

/* ---------- start ---------- */

$('zoom-in').addEventListener('click', () => board.zoomIn());
$('zoom-out').addEventListener('click', () => board.zoomOut());

// An empty map behind the start screen until the first game starts.
function showEmptyMap() {
  s = G.newGame(map, rules, { players: ['', ''], seed: 1 });
  game = null;
  board.update({ ...s, owner: s.owner.map(() => -1) });
  board.focus(null);
}

translatePage(L);
if (load()) {
  if (s.phase === 'occupy') sel.n = s.armies[s.occupy.from] - 1;
  render();
  focusOnPlayer();
} else {
  useMap(loadSettings().map);
  showEmptyMap();
}
showIntro();

window.__conquest = {
  get state() { return s; },
  get game() { return game; },
  get map() { return map; },
  get rules() { return rules; },
  get board() { return board; },
  act,
  tap,
  // start(['human', 'hard', …], speed, mode, seed, map): a game with these seats in this order.
  start: (seats, speed = 'fast', mode = 'mission', seed, mapId = 'world') =>
    startGame(seats.map((kind, i) => ({ kind, name: kind === 'human' ? L.you : L.opponents[i], color: i })), speed, mode, seed, mapId),
  useLanguage,
  startFromSettings,
  startTogt,
  get progress() { return progress; },
  showIntro,
  openLuck,
  openMission,
};
