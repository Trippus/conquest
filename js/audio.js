// The sounds are synthesized with Web Audio, so there are no files for them; the music is one recorded
// track. Sound.unlock() on the first tap (iOS only starts audio from a user gesture), Sound.play(name),
// then Music.play() and Music.pause().
let ctx = null;
let master = null;
let noise = null;

export const Sound = {
  enabled: true,

  unlock() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.8;
        master.connect(ctx.destination);
        const len = Math.floor(ctx.sampleRate * 0.6);
        noise = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = noise.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch {
      /* no audio: the game works fine without it */
    }
  },

  play(name, opt = {}) {
    if (!this.enabled || !ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime + (opt.delay || 0);
    const vol = opt.vol ?? 1;
    switch (name) {
      case 'place':
        // a wax seal pressed onto paper
        burst(t, 420, 1.2, 0.07, 0.3 * vol);
        tone(t, 140, 0.12, 0.12 * vol, 'sine', 90);
        break;
      case 'dice':
        // dice rattling in a cup and landing on the table
        for (let i = 0; i < 7; i++) burst(t + i * 0.035 + Math.random() * 0.02, 2200 + Math.random() * 1800, 3, 0.03, 0.12 * vol);
        for (let i = 0; i < 3; i++) burst(t + 0.3 + i * 0.06, 1400 + Math.random() * 600, 2.5, 0.05, 0.18 * vol);
        break;
      case 'conquer':
        // two soft notes on a brass horn
        [0, 7].forEach((s, i) => horn(t + i * 0.1, 293.66 * 2 ** (s / 12), i ? 0.22 : 0.1, 0.055 * vol));
        break;
      case 'lost':
        // a dull drum: the territory is gone
        tone(t, 110, 0.4, 0.22 * vol, 'sine', 55);
        burst(t, 200, 0.8, 0.15, 0.2 * vol);
        break;
      case 'card':
        // a card slid off the deck
        sweep(t, 900, 3500, 0.16, 0.14 * vol);
        break;
      case 'trade':
        // three cards laid down, then the new armies
        [0, 0.09, 0.18].forEach((d) => burst(t + d, 2600, 2, 0.04, 0.13 * vol));
        [0, 4, 7].forEach((s, i) => tone(t + 0.28 + i * 0.06, 440 * 2 ** (s / 12), 0.35, 0.07 * vol, 'triangle'));
        break;
      case 'turn':
        // two drum taps: your turn
        tone(t, 150, 0.18, 0.18 * vol, 'sine', 90);
        tone(t + 0.16, 150, 0.22, 0.2 * vol, 'sine', 80);
        break;
      case 'victory':
        [0, 4, 7, 12].forEach((s, i) => horn(t + i * 0.13, 293.66 * 2 ** (s / 12), i === 3 ? 0.6 : 0.14, 0.08 * vol));
        break;
      case 'defeat':
        [7, 5, 3, 0].forEach((s, i) => horn(t + i * 0.22, 220 * 2 ** (s / 12), 0.35, 0.08 * vol));
        break;
    }
  },
};

// The theme (assets/music/theme.mp3, see LICENSES.md), quietly under everything. The track starts at
// full strength and fades out over its last seconds, so near the end the other of two copies starts
// from the beginning and fades in over the fade-out. It goes through Web Audio, since iOS ignores an
// audio element's own volume.
const THEME = 'assets/music/theme.mp3';
const MUSIC_VOLUME = 0.3; // the track is loud; this puts it under the sounds
const OVERLAP = 4; // seconds of fade-out at the track's end
let music = null; // { out, decks: [{ el, gain }], at: the deck playing, on }

export const Music = {
  enabled: true,

  // From a tap, after Sound.unlock(). Does nothing while it plays.
  play() {
    if (!this.enabled || !ctx || document.hidden) return;
    try {
      music ??= setUpMusic();
      if (music.on) return;
      music.on = true;
      ramp(music.out, MUSIC_VOLUME, 2);
      music.decks[music.at].el.play().catch(() => (music.on = false));
    } catch {
      /* no music: the game works fine without it */
    }
  },

  pause() {
    if (!music?.on) return;
    music.on = false;
    ramp(music.out, 0, 0.5);
    setTimeout(() => !music.on && music.decks.forEach((d) => d.el.pause()), 550);
  },
};

function setUpMusic() {
  const out = ctx.createGain();
  out.gain.value = 0;
  out.connect(ctx.destination);
  const decks = [0, 1].map(() => {
    const el = new Audio(THEME);
    el.preload = 'auto';
    const gain = ctx.createGain();
    ctx.createMediaElementSource(el).connect(gain).connect(out);
    el.addEventListener('timeupdate', () => nearEnd(el));
    return { el, gain };
  });
  return { out, decks, at: 0, on: false };
}

// The playing copy is in its fade-out: the other one starts over and fades in.
function nearEnd(el) {
  if (!music.on || el !== music.decks[music.at].el || !(el.duration - el.currentTime < OVERLAP)) return;
  music.at = 1 - music.at;
  const next = music.decks[music.at];
  ramp(next.gain, 1, OVERLAP - 1, 0);
  next.el.currentTime = 0;
  next.el.play().catch(() => {});
}

function ramp(node, to, secs, from = node.gain.value) {
  const g = node.gain;
  g.cancelScheduledValues(ctx.currentTime);
  g.setValueAtTime(from, ctx.currentTime);
  g.linearRampToValueAtTime(to, ctx.currentTime + secs);
}

function burst(t, freq, q, dur, gain) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t, Math.random() * 0.4, dur + 0.02);
}

// Noise whose pitch slides: paper, cards.
function sweep(t, from, to, dur, gain) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 1.5;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t, Math.random() * 0.3, dur + 0.02);
}

function tone(t, freq, dur, gain, type, endFreq) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

// A soft brass-like note: a sawtooth through a low-pass filter that opens as it sounds.
function horn(t, freq, dur, gain) {
  const o = ctx.createOscillator();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(freq, t);
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.setValueAtTime(freq * 1.5, t);
  f.frequency.linearRampToValueAtTime(freq * 4, t + 0.06);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.04);
  g.gain.setValueAtTime(gain, t + Math.max(0.05, dur - 0.08));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.08);
  o.connect(f).connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.15);
}
