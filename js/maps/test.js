// A small abstract map for building and testing the rules: four regions of three territories in a
// ring, plus one sea route across the middle. The real world map replaces it later; the format
// stays the same. x and y (0–100) are only for the prototype board.
//
// North and South have three ways in (two land borders and the sea route), East and West two,
// so North and South give a bigger bonus.

export const TEST_MAP = {
  id: 'test',
  name: 'Testkort',
  regions: {
    north: { name: 'Nord', bonus: 3 },
    east: { name: 'Øst', bonus: 2 },
    south: { name: 'Syd', bonus: 3 },
    west: { name: 'Vest', bonus: 2 },
  },
  territories: {
    n1: { name: 'Nord 1', region: 'north', x: 30, y: 15, adj: ['n2', 'n3', 'w3'] },
    n2: { name: 'Nord 2', region: 'north', x: 50, y: 10, adj: ['n1', 'n3', 's2'] },
    n3: { name: 'Nord 3', region: 'north', x: 70, y: 15, adj: ['n1', 'n2', 'e1'] },
    e1: { name: 'Øst 1', region: 'east', x: 85, y: 35, adj: ['e2', 'e3', 'n3'] },
    e2: { name: 'Øst 2', region: 'east', x: 92, y: 50, adj: ['e1', 'e3'] },
    e3: { name: 'Øst 3', region: 'east', x: 85, y: 65, adj: ['e1', 'e2', 's1'] },
    s1: { name: 'Syd 1', region: 'south', x: 70, y: 85, adj: ['s2', 's3', 'e3'] },
    s2: { name: 'Syd 2', region: 'south', x: 50, y: 90, adj: ['s1', 's3', 'n2'] },
    s3: { name: 'Syd 3', region: 'south', x: 30, y: 85, adj: ['s1', 's2', 'w1'] },
    w1: { name: 'Vest 1', region: 'west', x: 15, y: 65, adj: ['w2', 'w3', 's3'] },
    w2: { name: 'Vest 2', region: 'west', x: 8, y: 50, adj: ['w1', 'w3'] },
    w3: { name: 'Vest 3', region: 'west', x: 15, y: 35, adj: ['w1', 'w2', 'n1'] },
  },
};
