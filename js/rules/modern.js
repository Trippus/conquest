// The modern ruleset: close to the classic board game, tightened for 15–25 minute games on a phone.
// Every number the engine uses lives here, so a historical era can change them without new code.

export const MODERN = {
  id: 'modern',
  // Start armies per player = ceil(territories × this / players). 42 territories, 3 players → 35.
  startArmiesPerTerritory: 2.5,
  minReinforce: 3,
  territoriesPerArmy: 3, // one army per this many territories held
  attackDice: 3,
  defendDice: 2,
  // Armies for the 1st, 2nd, … card trade. After the last, every trade gives the last value (a cap,
  // so late games do not explode).
  tradeValues: [4, 6, 8, 10, 12, 15],
  tradeTerritoryBonus: 2, // extra armies on a traded card's territory when you hold it
  maxHand: 5, // with this many cards you must trade before placing
  wildCards: 2,
  fortify: 'connected', // 'connected' (through your own territories) or 'adjacent'
  // Moving first is worth a lot (with 2 players the first wins about 73% of bot games on the
  // world map). Each later player starts with this many more armies than the one before, by number
  // of players; measured with bot games so every seat wins about as often.
  laterSeatArmies: { 2: 6, 3: 1, 4: 1, 5: 1, 6: 1 },
  peaceRounds: 0, // rounds at the start without attacks (measured: helps little)
  maxRounds: 0, // 0: play until one player holds the world; otherwise most territories wins after this round
};
