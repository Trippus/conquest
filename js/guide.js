// The first game's guide: one short note at a time over the bar, following what the player does, so
// the game teaches itself by being played. It reads the game; all it keeps is whether the goal is read.
// The player sits first in this game (js/app.js), so the first round's first turn is theirs. The words
// are in the language files, under guide. The one note that is read rather than done, the goal, is
// put away with its button; seen remembers that (game.guide in js/app.js).
import * as G from './engine.js';

const YOU = 0;

const hasFoe = (map, s, t) => map.territories[t].adj.some((n) => s.owner[n] !== YOU);

// The goal first, when it is land: the territories still missing are marked.
function goal(map, s) {
  const m = s.players[YOU].mission;
  if (m?.type === 'regions') return { id: 'goal', ok: true, button: 'mission', marks: m.regions.flatMap((r) => map.regions[r].members).filter((t) => s.owner[t] !== YOU) };
  if (m?.type === 'eliminate') return { id: 'target', ok: true, button: 'mission', marks: G.owned(s, m.target) };
  return null;
}

// Which note fits now: { id, button: the button to point at, marks: the territories to tap or take,
// ok: the note has a button to put it away }.
export function guideNote(map, s, sel, actions, seen = {}) {
  if (s.phase === 'over' || !s.players[YOU].alive) return null;
  if (s.current !== YOU) return { id: 'wait' };
  if (s.round > 1) return s.players[YOU].stars ? { id: 'lastStar', button: 'cash' } : { id: 'last', button: 'mission' };
  if (s.phase === 'reinforce') {
    if (!s.reserve) return { id: 'toAttack', button: 'toAttack' };
    if (actions.length) return { id: 'placeRest', button: 'rest' };
    if (!seen.goal && goal(map, s)) return goal(map, s);
    return { id: 'place', marks: G.owned(s, YOU).filter((t) => hasFoe(map, s, t)) };
  }
  if (s.phase === 'occupy') return { id: 'occupy', button: 'moveIn' };
  if (s.phase === 'fortify') return { id: 'fortify', button: 'endTurn' };
  if (sel.to >= 0) {
    const attacked = actions.some((a) => a.type === 'attack' || a.type === 'blitz');
    return attacked ? { id: 'rollAgain', button: 'blitz' } : { id: 'roll', button: 'attack' };
  }
  if (s.conquered) return { id: 'goOn', button: 'endAttack' };
  if (sel.from >= 0) return { id: 'attackTo' };
  return { id: 'attackFrom', marks: G.owned(s, YOU).filter((t) => s.armies[t] > 1 && hasFoe(map, s, t)) };
}

// The guide has done its job once the player's second turn is under way, or the game is over.
export const guideDone = (s) => s.phase === 'over' || (s.round > 1 && s.current === YOU && s.phase !== 'reinforce');
