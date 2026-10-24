// A larger abstract map (30 territories), close to the size of the real map, for bot and balance
// simulations until the real map exists. Built by code instead of written out: six regions of five
// territories in a ring, each region a ring with one shortcut, neighbouring regions linked, plus two
// sea routes across. A region's bonus is how many of its territories border another region.
// It has no positions, so it is not meant for the board.

function build() {
  const regions = {};
  const territories = {};
  const R = 6;
  const K = 5;
  for (let r = 0; r < R; r++) {
    regions[`r${r}`] = { name: `Region ${r + 1}`, bonus: 0 };
    for (let k = 0; k < K; k++) territories[`t${r}_${k}`] = { name: `${r + 1}.${k + 1}`, region: `r${r}`, adj: [] };
  }
  const link = (a, b) => {
    territories[a].adj.push(b);
    territories[b].adj.push(a);
  };
  for (let r = 0; r < R; r++) {
    for (let k = 0; k < K; k++) link(`t${r}_${k}`, `t${r}_${(k + 1) % K}`);
    link(`t${r}_0`, `t${r}_2`);
    link(`t${r}_3`, `t${(r + 1) % R}_0`);
  }
  link('t0_4', 't3_4');
  link('t1_4', 't4_1');
  for (const [id, region] of Object.entries(regions)) {
    const own = Object.values(territories).filter((t) => t.region === id);
    region.bonus = own.filter((t) => t.adj.some((n) => territories[n].region !== id)).length;
  }
  return { id: 'test-large', name: 'Stort testkort', regions, territories };
}

export const TEST_LARGE = build();
