// Decorations for the paper map, drawn in ink like an old atlas: mountains, forests and dunes on
// the land, waves and a few ships at sea, and a compass rose. Pure SVG strings, no DOM. Everything
// is placed from the hex grid, so it always sits on the right land, and kept out of the boxes the
// board passes in (seals, names, region names), so it never hides what you play with.

const INK = '#4a3726';

// A compass rose like an old chart's: a ring with a scale, four long points and four short ones,
// half dark and half light so they look raised, and the four quarters: north, east, south, west
// in the player's language ('NØSV' in Danish).
function compassRose(quarters) {
  const at = (deg, r) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  };
  const point = (deg, len, w) =>
    `<path d="M0 0L${at(deg, len)}L${at(deg - 90, w)}Z" fill="${INK}"/><path d="M0 0L${at(deg, len)}L${at(deg + 90, w)}Z" fill="#f6ecd4"/>`;
  const ticks = Array.from({ length: 64 }, (_, i) => `M${at(i * 5.625, 3.55)}L${at(i * 5.625, i % 8 ? 3.75 : 3.95)}`).join('');
  const letters = [...quarters].map((l, i) => [l, i * 90])
    .map(([l, deg]) => {
      const [x, y] = at(deg, 4.75).split(' ');
      return `<text x="${x}" y="${(+y + 0.4).toFixed(2)}">${l}</text>`;
    })
    .join('');
  return `<g stroke="${INK}" stroke-width=".06">
      <circle r="4" fill="#efe1c0" fill-opacity=".55"/><circle r="3.55" fill="none"/><circle r="2.2" fill="none" stroke-dasharray=".12 .12"/>
      <path d="${ticks}" fill="none"/>
      ${[45, 135, 225, 315].map((d) => point(d, 2.6, 0.42)).join('')}
      ${[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((d) => point(d, 1.7, 0.22)).join('')}
      ${[0, 90, 180, 270].map((d) => point(d, 4.15, 0.62)).join('')}
      <circle r=".3" fill="#a3261b"/>
    </g>
    <g fill="${INK}" font-family="Georgia, serif" font-weight="700" font-size="1.05" text-anchor="middle">${letters}</g>`;
}

// The drawings, in map units (a hex is about 1.7 wide). Used with <use href="#…">.
export const artDefs = (quarters = 'NØSV') => `
  <g id="art-mountain" stroke="${INK}" stroke-width=".07" stroke-linejoin="round">
    <path d="M-.85.38L-.25-.55L.04-.18L.34-.45L.92.38Z" fill="#efe1c0"/>
    <path d="M-.25-.55L.04-.18L-.06.38H-.2Z M.34-.45L.92.38H.42Z" fill="#a8916a" stroke="none"/>
    <path d="M-.25-.55L-.44-.25L-.35-.29L-.27-.2L-.17-.29L-.08-.33Z" fill="#fbf6ea" stroke-width=".04"/>
    <path d="M-.85.38L-.25-.55L.04-.18L.34-.45L.92.38Z" fill="none"/>
  </g>
  <g id="art-peak" stroke="${INK}" stroke-width=".07" stroke-linejoin="round">
    <path d="M-.8.38L0-.6L.8.38Z" fill="#efe1c0"/>
    <path d="M0-.6L.8.38H.06Z" fill="#a8916a" stroke="none"/>
    <path d="M0-.6L-.24-.3L-.12-.34L-.02-.25L.09-.34L.24-.3Z" fill="#fbf6ea" stroke-width=".04"/>
    <path d="M-.8.38L0-.6L.8.38Z" fill="none"/>
  </g>
  <g id="art-spruce" stroke="${INK}" stroke-width=".05" stroke-linejoin="round">
    <path d="M0 .5V.3" fill="none" stroke-width=".08"/>
    <path d="M0-.62L.2-.32H.1L.3-.04H.15L.38.3H-.38L-.15-.04H-.3L-.1-.32H-.2Z" fill="#7d8b58"/>
    <path d="M0-.62L.2-.32H.1L.3-.04H.15L.38.3H0Z" fill="#2f3a1e" fill-opacity=".35" stroke="none"/>
  </g>
  <g id="art-oak" stroke="${INK}" stroke-width=".05">
    <path d="M-.07.5L-.04.05H.05L.08.5Z" fill="#6b4a32"/>
    <g fill="#94a066"><circle cx="-.2" cy="-.1" r=".22"/><circle cx=".2" cy="-.12" r=".23"/><circle cx="0" cy="-.32" r=".24"/><circle cx=".02" cy=".02" r=".2"/></g>
    <path d="M.3-.28A.23.23 0 0 1 .2.11A.2.2 0 0 1-.02.22Q.25.05.3-.28Z" fill="#2f3a1e" fill-opacity=".35" stroke="none"/>
  </g>
  <g id="art-spruce-wood"><use href="#art-spruce" transform="translate(-.38 -.12) scale(.8)"/><use href="#art-spruce" transform="translate(.36 -.08) scale(.85)"/><use href="#art-spruce" transform="translate(0 .08)"/></g>
  <g id="art-oak-wood"><use href="#art-oak" transform="translate(-.32 -.1) scale(.85)"/><use href="#art-oak" transform="translate(.3 .02) scale(.95)"/></g>
  <g id="art-mixed-wood"><use href="#art-oak" transform="translate(-.3 -.08) scale(.9)"/><use href="#art-spruce" transform="translate(.32 0)"/></g>
  <g id="art-dunes" stroke="${INK}" stroke-width=".05" stroke-linejoin="round">
    <path d="M-.2.05C0-.2.2-.32.38-.3C.55-.28.7-.1.85.1Z" fill="#ead6a2"/>
    <path d="M.38-.3C.55-.28.7-.1.85.1H.45C.48-.06.45-.2.38-.3Z" fill="#c8a565" stroke="none"/>
    <path d="M-.85.38C-.55-.02-.3-.2-.05-.18C.2-.16.42.05.62.38Z" fill="#ead6a2"/>
    <path d="M-.05-.18C.2-.16.42.05.62.38H.12C.15.12.07-.06-.05-.18Z" fill="#c8a565" stroke="none"/>
    <path d="M-.85.38C-.55-.02-.3-.2-.05-.18C.2-.16.42.05.62.38" fill="none"/>
  </g>
  <g id="art-palm" stroke="${INK}" stroke-width=".045" stroke-linejoin="round">
    <path d="M-.6.42C-.3.2.3.2.6.42Z" fill="#ead6a2"/>
    <path d="M-.06.32Q.06-.05-.08-.42L.04-.42Q.18-.05.06.32Z" fill="#8a6a4a"/>
    <g fill="#7d8b58">
      <path d="M-.02-.42Q-.4-.72-.72-.36Q-.6-.38-.5-.32Q-.3-.5-.02-.42Z"/><path d="M-.02-.42Q.36-.72.7-.34Q.58-.37.48-.3Q.28-.5-.02-.42Z"/>
      <path d="M-.02-.42Q-.3-.86-.62-.72Q-.5-.66-.46-.58Q-.25-.66-.02-.42Z"/><path d="M-.02-.42Q.24-.88.58-.76Q.46-.68.42-.6Q.2-.66-.02-.42Z"/>
      <path d="M-.02-.42Q-.08-.9.06-.92Q.08-.7-.02-.42Z"/>
    </g>
  </g>
  <path id="art-wave" d="M-.6 0q.3-.24.6 0t.6 0" fill="none" stroke="${INK}" stroke-width=".05" stroke-linecap="round"/>
  <g id="art-ship" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-1.35-.2H-.85V.12H1.15Q1.05.62.62.72H-.9Q-1.25.55-1.35-.2Z" fill="#8a6a4a"/>
    <path d="M-1.28.3H1.02M-1.3-.02H-.85" fill="none" opacity=".7"/>
    <path d="M1.12.1L1.75-.32" fill="none"/>
    <path d="M-.55.1V-1.45M.1.1V-1.95M.7.1V-1.35" fill="none"/>
    <path d="M-.95-1.3Q-.55-1.18-.15-1.3L-.2-.85Q-.55-.72-.9-.85Z M-.92-.72Q-.55-.6-.18-.72L-.22-.25Q-.55-.14-.88-.25Z" fill="#f6ecd4"/>
    <path d="M-.32-1.8Q.1-1.66.52-1.8L.48-1.3Q.1-1.16-.28-1.3Z M-.36-1.16Q.1-1.02.56-1.16L.52-.6Q.1-.46-.32-.6Z M-.3-.48Q.1-.38.5-.48L.47-.1Q.1-.02-.27-.1Z" fill="#f6ecd4"/>
    <path d="M.38-1.2Q.7-1.1 1.02-1.2L.98-.75Q.7-.65.42-.75Z M.4-.62Q.7-.52 1-.62L.97-.2Q.7-.12.43-.2Z" fill="#f6ecd4"/>
    <path d="M.75.08L1.6-.28L.85-1.05Z" fill="#f6ecd4"/>
    <path d="M.1-1.95l.42.1-.42.1z" fill="#a3261b"/>
    <path d="M-1.5.9q.3-.15.6 0t.6 0M.35.9q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-longship" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-.62-1.62H.62V-.5Q0-.38-.62-.5Z" fill="#f6ecd4"/>
    <path d="M-.38-1.62V-.44M-.12-1.62V-.4M.12-1.62V-.4M.38-1.62V-.44" stroke="#a3261b" stroke-width=".14"/>
    <path d="M-.62-1.62H.62V-.5Q0-.38-.62-.5Z" fill="none"/>
    <path d="M0-.38V-1.9M-.75-1.62H.75" fill="none"/>
    <path d="M-1.55-.75Q-1.85-.1-1.1.25Q0 .62 1.1.25Q1.85-.1 1.55-.75Q1.4-.55 1.15-.3Q0-.05-1.15-.3Q-1.4-.55-1.55-.75Z" fill="#8a6a4a"/>
    <path d="M1.55-.75q.28-.18.22-.48q-.18.02-.3.16q.02-.2-.12-.28q-.05.28.2.6Z" fill="#8a6a4a"/>
    <path d="M-1.55-.75q-.3-.1-.3-.38q.15-.12.3.05" fill="none"/>
    <g fill="#a3261b"><circle cx="-.9" cy="-.18" r=".14"/><circle cx="-.3" cy="-.1" r=".14"/><circle cx=".3" cy="-.1" r=".14"/><circle cx=".9" cy="-.18" r=".14"/></g>
    <g fill="#f6ecd4"><circle cx="-.6" cy="-.13" r=".14"/><circle cx="0" cy="-.09" r=".14"/><circle cx=".6" cy="-.13" r=".14"/></g>
    <path d="M-.8.3L-1.05.75M-.3.42L-.45.85M.3.42L.45.85M.8.3L1.05.75" fill="none" opacity=".8"/>
    <path d="M-1.6.95q.3-.15.6 0t.6 0M.4.95q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-galley" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-.55-1.5H.55V-.55Q0-.45-.55-.55Z" fill="#f6ecd4"/>
    <path d="M-.18-1.5V-.5M.18-1.5V-.5" stroke="#a3261b" stroke-width=".16"/>
    <path d="M-.55-1.5H.55V-.55Q0-.45-.55-.55Z" fill="none"/>
    <path d="M0-.45V-1.75M-.65-1.5H.65" fill="none"/>
    <path d="M-1.6-.55Q-1.75-.25-1.35-.05H1.3L1.85.1L1.3.18Q1.5-.15 1.45-.45Q.2-.25-1.6-.55Z" fill="#8a6a4a"/>
    <path d="M-1.6-.55q-.12-.45.18-.6q-.02.25.12.35" fill="none"/>
    <path d="M-1.25-.18H1.25" fill="none" opacity=".6"/>
    <circle cx="1.12" cy="-.28" r=".07" fill="${INK}" stroke="none"/>
    <path d="M-1.1.02L-1.35.6M-.7.05L-.9.65M-.3.07L-.45.68M.1.07L-.02.68M.5.06L.42.66M.9.04L.86.62" fill="none" opacity=".85"/>
    <path d="M-1.6.85q.3-.15.6 0t.6 0M.3.85q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-atakebune" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M1.25-1.05V-1.75" fill="none"/>
    <path d="M1.25-1.75H1.6V-1.3H1.25" fill="#a3261b"/>
    <path d="M-.4-1.05V-1.45H.35V-1.05Z" fill="#f6ecd4"/>
    <path d="M-.62-1.4Q-.05-1.5.55-1.4Q.2-1.6-.05-1.78Q-.3-1.6-.62-1.4Z" fill="#3b2f2a"/>
    <path d="M-1.45-.45V-1H1.4V-.45Z" fill="#8a6a4a"/>
    <path d="M-1.62-.98Q0-1.12 1.58-.98Q0-1.02-1.62-.98Z" fill="#3b2f2a"/>
    <path d="M-1.2-.78h.2M-.7-.78h.2M-.2-.78h.2M.3-.78h.2M.8-.78h.2" fill="none" stroke-width=".1"/>
    <path d="M-1.75-.5Q-1.7-.05-1.45.08H1.45Q1.75-.1 1.85-.6L1.5-.45H-1.5Z" fill="#6b4a32"/>
    <path d="M-1.3-.2H1.35" fill="none" opacity=".6"/>
    <path d="M-1.1.05L-1.3.6M-.6.07L-.75.65M-.1.08L-.2.68M.4.08L.32.66M.9.06L.86.62" fill="none" opacity=".85"/>
    <path d="M-1.6.85q.3-.15.6 0t.6 0M.3.85q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-lineship" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M1.15-.3L1.85-.68M.72-.32L1.72-.62L.74-1.25Z" fill="#f6ecd4"/>
    <path d="M-.75-.3V-1.75M0-.3V-2.05M.68-.3V-1.6" fill="none"/>
    <path d="M-1.12-1.62Q-.75-1.5-.38-1.62L-.42-1.15Q-.75-1.04-1.08-1.15Z M-1.1-1.02Q-.75-.9-.4-1.02L-.44-.5Q-.75-.4-1.06-.5Z" fill="#f6ecd4"/>
    <path d="M-.4-1.92Q0-1.8.4-1.92L.36-1.42Q0-1.3-.36-1.42Z M-.42-1.3Q0-1.18.42-1.3L.38-.72Q0-.6-.38-.72Z" fill="#f6ecd4"/>
    <path d="M.36-1.5Q.68-1.4 1-1.5L.97-1.02Q.68-.94.39-1.02Z M.38-.92Q.68-.82.98-.92L.95-.48Q.68-.4.41-.48Z" fill="#f6ecd4"/>
    <path d="M0-2.05h.34v.08H0Z" fill="#2a4f8a" stroke="none"/><path d="M0-1.97h.34v.08H0Z" fill="#f6ecd4" stroke="none"/><path d="M0-1.89h.34v.08H0Z" fill="#a3261b" stroke="none"/>
    <path d="M-1.6-.55H-1.05V-.3H1.2L1.15.15Q1-.6.6.68H-1.1Q-1.5.5-1.6-.55Z" fill="#3b2f2a"/>
    <path d="M-1.48-.12H1.17M-1.42.25H1.08" fill="none" stroke="#d9b45a" stroke-width=".13"/>
    <path d="M-1.2-.17h.1v.1h-.1zM-.85-.17h.1v.1h-.1zM-.5-.17h.1v.1h-.1zM-.15-.17h.1v.1h-.1zM.2-.17h.1v.1h-.1zM.55-.17h.1v.1h-.1zM.9-.17h.1v.1h-.1zM-1.1.2h.1v.1h-.1zM-.75.2h.1v.1h-.1zM-.4.2h.1v.1h-.1zM-.05.2h.1v.1h-.1zM.3.2h.1v.1h-.1zM.65.2h.1v.1h-.1z" fill="${INK}" stroke="none"/>
    <path d="M-1.55.95q.3-.15.6 0t.6 0M.3.95q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-sidewheeler" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <g fill="#cdbfa6" stroke="none" opacity=".85"><circle cx="-.05" cy="-2" r=".2"/><circle cx="-.42" cy="-2.12" r=".24"/><circle cx="-.85" cy="-2.08" r=".2"/></g>
    <path d="M-.9-.3V-1.85M.95-.3V-1.65M1.2-.3L1.85-.62" fill="none"/>
    <path d="M-1.22-1.6Q-.9-1.5-.58-1.6L-.62-1.15Q-.9-1.06-1.18-1.15Z M-1.2-1.02Q-.9-.92-.6-1.02L-.63-.6Q-.9-.52-1.17-.6Z" fill="#f6ecd4"/>
    <path d="M.68-1.42Q.95-1.33 1.22-1.42L1.19-1.02Q.95-.94.71-1.02Z M.69-.9Q.95-.82 1.21-.9L1.18-.52Q.95-.45.72-.52Z" fill="#f6ecd4"/>
    <path d="M1.2-.32L1.75-.6L1.12-.98Z" fill="#f6ecd4"/>
    <path d="M-.9-1.85h.38v.22h-.38Z" fill="#f6ecd4"/><path d="M-.9-1.78h.38M-.9-1.69h.38" fill="none" stroke="#a3261b" stroke-width=".04"/><path d="M-.9-1.85h.16v.12h-.16Z" fill="#2a4f8a" stroke="none"/>
    <path d="M-.1-.62V-1.82H.2V-.62Z" fill="#3b2f2a"/><path d="M-.1-1.82H.2V-1.68H-.1Z" fill="#a3261b"/>
    <path d="M-1.7-.42H1.25L1.85-.6Q1.65.2 1.05.55H-1.2Q-1.6.3-1.7-.42Z" fill="#3b2f2a"/>
    <path d="M-1.6-.08H1.55" fill="none" stroke="#d9b45a" stroke-width=".11"/>
    <path d="M-1.25.18h.1v.1h-.1zM-.95.18h.1v.1h-.1zM.75.18h.1v.1h-.1zM1.05.18h.1v.1h-.1z" fill="${INK}" stroke="none"/>
    <path d="M-.6-.25A.6.6 0 0 1 .6-.25V.3H-.6Z" fill="#8a6a4a"/>
    <path d="M0-.25L0-.8M0-.25L-.42-.67M0-.25L.42-.67M0-.25L-.58-.4M0-.25L.58-.4" fill="none" opacity=".7"/>
    <path d="M-1.55.95q.3-.15.6 0t.6 0M.3.95q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-baobab" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-.14-.22L-.42-.46M-.06-.24L-.08-.54M.08-.24L.4-.48" fill="none" stroke-width=".07"/>
    <g fill="#94a066"><ellipse cx="-.44" cy="-.5" rx=".2" ry=".11"/><ellipse cx="-.06" cy="-.58" rx=".22" ry=".12"/><ellipse cx=".4" cy="-.52" rx=".2" ry=".11"/></g>
    <path d="M-.26.48Q-.36.08-.16-.24H.14Q.34.08.26.48Z" fill="#8a6a4a"/>
    <path d="M.14-.24Q.34.08.26.48H.06Q.14.08.04-.24Z" fill="#3b2f2a" fill-opacity=".3" stroke="none"/>
  </g>
  <g id="art-acacia" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M0 .48V-.02L-.3-.3M0-.02L.26-.32M0-.06V-.3" fill="none" stroke-width=".07"/>
    <path d="M-.66-.3Q-.52-.54 0-.56Q.52-.54.66-.3Q.3-.22 0-.24Q-.3-.22-.66-.3Z" fill="#94a066"/>
    <path d="M-.4.48H.42" fill="none" opacity=".5"/>
  </g>
  <g id="art-camel" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-.36.02L-.4.46M-.24.04L-.22.46M.12.04L.1.46M.24.02L.3.46" fill="none" stroke-width=".06"/>
    <path d="M-.5-.1Q-.45-.45-.2-.42Q-.05-.64.1-.42Q.25-.4.3-.2L.44-.46Q.5-.6.62-.58L.7-.5L.56-.44L.42-.12Q.4.06.25.06H-.4Q-.56.03-.5-.1Z" fill="#c8a565"/>
    <path d="M-.5-.08q-.12.06-.1.22" fill="none"/>
  </g>
  <g id="art-caravan">
    <use href="#art-camel" transform="translate(-1.3 .08)"/><use href="#art-camel" transform="translate(0 0)"/><use href="#art-camel" transform="translate(1.3 -.08)"/>
    <g stroke="${INK}" stroke-width=".04" fill="#f6ecd4"><path d="M-1.6-.62h.34v.2h-.34ZM-1.26-.62h.34v.2h-.34ZM-.3-.7h.34v.2h-.34ZM.04-.7h.34v.2h-.34Z"/></g>
    <g stroke="${INK}" stroke-width=".05" stroke-linejoin="round"><path d="M1.12-.72Q1.2-1.12 1.36-1.12Q1.52-1.12 1.56-.72Z" fill="#2a4f8a"/><circle cx="1.36" cy="-1.2" r=".1" fill="#2a4f8a"/></g>
  </g>
  <g id="art-pirogue" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M.3.04L.62-.95" fill="none" stroke-width=".06"/>
    <path d="M.12.02L.16-.36M.16-.3L.42-.5" fill="none" stroke-width=".07"/>
    <circle cx=".17" cy="-.46" r=".09" fill="#3b2f2a"/>
    <path d="M-1.05-.06Q0 .26 1.05-.06Q.92.22 0 .26Q-.92.22-1.05-.06Z" fill="#6b4a32"/>
  </g>
  <g id="art-caravel" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-.6-.3V-1.6M.3-.3V-2M1.05-.3V-1.35M1.35-.35L1.85-.75" fill="none"/>
    <path d="M-.15-.55L-1.25-1.62L-1.15-.5Z M1-.55L-.4-2.05L-.2-.5Z M1.6-.55L.6-1.45L.7-.5Z" fill="#f6ecd4"/>
    <path d="M.2-1.3V-.85M0-1.08H.4M-.95-.95V-.65M-1.08-.8H-.82" fill="none" stroke="#a3261b" stroke-width=".1"/>
    <path d="M-1.5-.62H-1.05V-.35H1.3L1.75-.55Q1.55.2 1 .5H-1.1Q-1.5.25-1.5-.62Z" fill="#8a6a4a"/>
    <path d="M-1.4-.05H1.4" fill="none" opacity=".6"/>
    <path d="M-1.55.85q.3-.15.6 0t.6 0M.3.85q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-balsa" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-.35-.2L.15-2.05M.65-.2L.15-2.05" fill="none" stroke-width=".06"/>
    <path d="M-.75-1.85H1.05L.9-.5H-.6Z" fill="#f6ecd4"/>
    <path d="M-.8-1.85H1.1M-.65-.5H.95" fill="none" stroke-width=".07"/>
    <path d="M.95-.2V-.55L1.15-.7L1.35-.55V-.2Z" fill="#c8a565"/>
    <path d="M-1.55-.2H1.6L1.42.2H-1.38Z" fill="#b08a5a"/>
    <path d="M-1.45-.07H1.52M-1.42.07H1.47" fill="none" opacity=".5"/>
    <path d="M-1.55.55q.3-.15.6 0t.6 0M.3.55q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-llama" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-.42-.06Q-.44-.3-.16-.3H.22Q.32-.32.34-.46V-.84Q.34-.94.44-.94H.5L.53-1.06L.58-.94Q.7-.9.68-.8L.58-.79V-.42Q.58-.08.32 0L.33.3H.24L.19.02H-.2L-.24.3H-.33L-.34 0Q-.42-.02-.42-.06Z" fill="#efe4cc"/>
    <path d="M-.24-.44H.12V-.3H-.24Z" fill="#a3261b"/>
  </g>
  <g id="art-llamas">
    <use href="#art-llama" transform="translate(-1.1 .05)"/><use href="#art-llama" transform="translate(0 0)"/><use href="#art-llama" transform="translate(1.1 -.05)"/>
    <g stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
      <path d="M-1.98-.2V.3M-1.82-.2V.3M-1.6-.5L-1.5.3" fill="none"/>
      <path d="M-2.14-.18L-1.9-.72L-1.66-.18Z" fill="#c98a12"/>
      <circle cx="-1.9" cy="-.84" r=".1" fill="#3b2f2a"/>
    </g>
  </g>
  <g id="art-reedboat" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M.1-.1V-1.1M.1-1.05L.75-.25H.1" fill="none" stroke-width=".06"/>
    <path d="M.15-1L.7-.3H.15Z" fill="#d8c48e"/>
    <path d="M-1.2-.6Q-1.05.12 0 .16Q1.05.12 1.2-.6Q1-.12 0-.1Q-1-.12-1.2-.6Z" fill="#c8a565"/>
    <path d="M-.8-.05V.1M-.4 0V.15M.4 0V.15M.8-.05V.1" fill="none" opacity=".6"/>
    <path d="M-1.1.45q.3-.12.6 0t.6 0M.2.45q.3-.12.6 0t.6 0" fill="none" opacity=".5"/>
  </g>
  <g id="art-frigate" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M1.2-.32L1.9-.66M.72-.34L1.75-.64L.76-1.2Z" fill="#f6ecd4"/>
    <path d="M-.85-.32V-1.65M-.05-.32V-1.95M.65-.32V-1.5" fill="none"/>
    <path d="M-1.15-1.52Q-.85-1.42-.55-1.52L-.58-1.1Q-.85-1.02-1.12-1.1Z M-1.13-.98Q-.85-.88-.57-.98L-.6-.55Q-.85-.47-1.1-.55Z" fill="#f6ecd4"/>
    <path d="M-.4-1.82Q-.05-1.72.3-1.82L.27-1.36Q-.05-1.26-.37-1.36Z M-.42-1.24Q-.05-1.14.32-1.24L.29-.7Q-.05-.6-.39-.7Z" fill="#f6ecd4"/>
    <path d="M.38-1.4Q.65-1.32.92-1.4L.89-1Q.65-.93.41-1Z M.39-.9Q.65-.82.91-.9L.88-.5Q.65-.43.42-.5Z" fill="#f6ecd4"/>
    <path d="M-.05-1.95h.36v.08h-.36Z" fill="#f6ecd4" stroke="none"/><path d="M-.05-1.87h.36v.08h-.36Z" fill="#a3261b" stroke="none"/><path d="M-.05-1.95h.12v.08h-.12Z" fill="#2a4f8a" stroke="none"/>
    <path d="M-1.6-.5H-1.1V-.32H1.25L1.85-.6Q1.6.15 1.05.45H-1.15Q-1.52.28-1.6-.5Z" fill="#3b2f2a"/>
    <path d="M-1.52-.08H1.5" fill="none" stroke="#d9b45a" stroke-width=".13"/>
    <path d="M-1.15-.13h.1v.1h-.1zM-.8-.13h.1v.1h-.1zM-.45-.13h.1v.1h-.1zM-.1-.13h.1v.1h-.1zM.25-.13h.1v.1h-.1zM.6-.13h.1v.1h-.1zM.95-.13h.1v.1h-.1z" fill="${INK}" stroke="none"/>
    <path d="M-1.55.85q.3-.15.6 0t.6 0M.3.85q.3-.15.6 0t.6 0" fill="none" opacity=".6"/>
  </g>
  <g id="art-horse" stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
    <path d="M-.36 0L-.44.45M-.22.02L-.16.45M.2.02L.14.45M.32 0L.42.45" fill="none" stroke-width=".07"/>
    <path d="M-.48-.08Q-.62 0-.66.3" fill="none" stroke-width=".08"/>
    <path d="M-.5-.12Q-.5-.32-.3-.34H.2Q.32-.36.38-.5L.52-.74Q.6-.82.68-.76L.86-.52Q.88-.44.8-.42L.64-.48L.5-.2Q.44.04.28.06H-.36Q-.5.04-.5-.12Z" fill="#8a6a4a"/>
    <path d="M.38-.5L.5-.74" fill="none" stroke-width=".08"/>
  </g>
  <g id="art-llanero">
    <use href="#art-horse"/>
    <g stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
      <path d="M-.62.22L.62-1.6" fill="none"/>
      <path d="M.56-1.5L.86-1.44L.6-1.34Z" fill="#a3261b"/>
      <path d="M.02-.36L.1-.06" fill="none" stroke-width=".07"/>
      <path d="M-.14-.34Q-.14-.64-.02-.72Q.12-.66.12-.34Z" fill="#f6ecd4"/>
      <circle cx="-.01" cy="-.82" r=".09" fill="#3b2f2a"/>
      <path d="M-.1-.89Q-.1-1.02-.01-1.02Q.08-1.02.08-.89Z" fill="#d8c48e"/>
      <path d="M-.24-.88Q-.01-.96.22-.88Q-.01-.83-.24-.88Z" fill="#d8c48e"/>
    </g>
  </g>
  <g id="art-gaucho">
    <use href="#art-horse"/>
    <g stroke="${INK}" stroke-width=".05" stroke-linejoin="round" stroke-linecap="round">
      <path d="M.02-.36L.1-.06" fill="none" stroke-width=".07"/>
      <path d="M.1-.6L.36-1.05" fill="none" stroke-width=".06"/>
      <path d="M-.2-.3L-.02-.72L.18-.3Z" fill="#a3261b"/>
      <circle cx="-.01" cy="-.82" r=".09" fill="#3b2f2a"/>
      <path d="M-.09-.89V-1H.07V-.89Z" fill="${INK}"/>
      <path d="M-.22-.89H.2" fill="none" stroke-width=".07"/>
      <path d="M.36-1.05L.2-1.3M.36-1.05L.56-1.25M.36-1.05L.4-1.36" fill="none" stroke-width=".03"/>
      <g fill="#8a6a4a"><circle cx=".2" cy="-1.3" r=".06"/><circle cx=".56" cy="-1.25" r=".06"/><circle cx=".4" cy="-1.36" r=".06"/></g>
    </g>
  </g>
  <g id="art-compass">${compassRose(quarters)}</g>`;

// A fixed "random" number for a cell, so the map looks the same every time.
const hash = (row, col, salt = 0) => {
  let h = Math.imul(row * 374761393 + col * 668265263 + salt * 2246822519, 3266489917);
  h ^= h >>> 15;
  return (Math.imul(h, 2246822519) ^ (h >>> 13)) >>> 0;
};

// keepClear: boxes { x0, y0, x1, y1 } in map units where nothing may be drawn.
// seaLines: [[x1, y1, x2, y2]] sea routes the waves keep away from.
// compass: [x, y] for the compass rose, or [x, y, size] (1.1 when left out), or null.
export function mapArt(grid, { keepClear = [], seaLines = [], compass = null } = {}) {
  const { GRID, TERRAIN = {}, hexCenter, hexNeighbours, cellAt } = grid;
  const taken = [...keepClear]; // grows with the ships and the compass, so waves keep off them
  const free = (x, y, r) => taken.every((b) => x + r < b.x0 || x - r > b.x1 || y + r < b.y0 || y - r > b.y1);
  const take = (x, y, r) => taken.push({ x0: x - r, y0: y - r, x1: x + r, y1: y + r });
  const offRoutes = (x, y) =>
    seaLines.every(([x1, y1, x2, y2]) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1)));
      return Math.hypot(x - x1 - t * dx, y - y1 - t * dy) > 1.3;
    });

  // How far each sea cell is from land, in cells.
  const rows = GRID.length;
  const cols = GRID[0].length;
  const dist = GRID.map((line) => [...line].map((c) => (c === '.' ? Infinity : 0)));
  let edge = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (dist[r][c] === 0) edge.push([r, c]);
  for (let d = 1; edge.length; d++) {
    const next = [];
    for (const [r, c] of edge) {
      for (const [nr, nc] of hexNeighbours(r, c)) {
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || dist[nr][nc] !== Infinity) continue;
        dist[nr][nc] = d;
        next.push([nr, nc]);
      }
    }
    edge = next;
  }

  const use = (id, x, y, scale = 1) => `<use href="#art-${id}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale})"/>`;
  const ship = (x, y) => use(grid.SHIP ?? 'ship', x, y, 1.5);
  const jitter = (h, shift) => (((h >>> shift) % 100) / 100 - 0.5) * 0.5;
  const DENSITY = { mountains: 3, forest: 4, spruce: 4, oak: 4, desert: 3, savanna: 5 }; // one cell in this many gets a drawing
  // Each kind has a few drawings, chosen by the cell: ranges and single peaks; spruce in the north, oak
  // (and the broadleaf of the rainforest) in the south, and between them forest, the three mixed; dunes,
  // now and then a palm; on the savanna acacias and now and then a baobab.
  const ART = {
    mountains: ['mountain', 'mountain', 'peak'],
    spruce: ['spruce-wood'],
    oak: ['oak-wood'],
    forest: ['spruce-wood', 'oak-wood', 'mixed-wood'],
    desert: ['dunes', 'dunes', 'dunes', 'palm'],
    savanna: ['acacia', 'acacia', 'baobab'],
  };
  let land = '';
  let sea = '';
  let deco = ''; // the ships and the compass: drawn stronger than the waves
  if (compass) {
    const size = compass[2] ?? 1.1;
    deco += use('compass', compass[0], compass[1], size);
    take(compass[0], compass[1], 5.3 * size);
  }
  // Ships sail beside the longest sea routes (not those round the back of the map), a little to
  // one side of the dashed line, on open sea. grid.SHIP names the kind ('ship', 'longship', 'galley', 'atakebune',
  // 'lineship', 'frigate', 'sidewheeler', 'caravel' or 'balsa'), grid.SHIP_COUNT how many (3).
  const seaCell = (x, y) => {
    const r = Math.round((y - 1) / 1.5);
    const c = Math.round((x - Math.sqrt(3) / 2) / Math.sqrt(3) - 0.5 * (r & 1));
    return (dist[r]?.[c] ?? 0) >= 1;
  };
  const openSea = (x, y) => {
    const r = Math.round((y - 1) / 1.5);
    const c = Math.round((x - Math.sqrt(3) / 2) / Math.sqrt(3) - 0.5 * (r & 1));
    return (dist[r]?.[c] ?? 0) >= 2; // two cells from any coast
  };
  const routes = seaLines
    .map(([x1, y1, x2, y2]) => ({ x1, y1, x2, y2, len: Math.hypot(x2 - x1, y2 - y1) }))
    .filter((l) => l.len > 6 && l.len < cols)
    .sort((p, q) => q.len - p.len);
  let ships = grid.SHIP_COUNT ?? 3;
  for (const { x1, y1, x2, y2, len } of routes) {
    if (!ships) break;
    const [nx, ny] = [-(y2 - y1) / len, (x2 - x1) / len]; // across the route
    spot: for (const along of [0.5, 0.4, 0.6, 0.3, 0.7]) {
      for (const side of [2.4, -2.4, 3.2, -3.2]) {
        const x = x1 + (x2 - x1) * along + nx * side;
        const y = y1 + (y2 - y1) * along + ny * side;
        // The whole ship on open water, with a hex to spare (a cell's coast runs up to a hex from its
        // middle): bow, stern, mast top and keel, not only its middle.
        const afloat =
          openSea(x, y) && [[-3.7, 0], [3.7, 0], [0, -3.2], [0, 1.8], [-3, -1.6], [3, -1.6], [-3, .9], [3, .9]].every(([dx, dy]) => seaCell(x + dx, y + dy));
        if (!afloat || !free(x, y, 2.4)) continue;
        deco += ship(x, y);
        take(x, y, 2.6);
        ships--;
        break spot;
      }
    }
  }
  // Too few long routes (the world's are short or go round the back): the rest sail the open ocean,
  // the free cell nearest to where they should be ([row, col], grid.OCEANS).
  for (const [row, col] of grid.OCEANS ?? []) {
    if (!ships) break;
    let best = null;
    for (let r = Math.max(0, row - 4); r <= Math.min(rows - 1, row + 4); r++) {
      for (let c = Math.max(0, col - 6); c <= Math.min(cols - 1, col + 6); c++) {
        if (dist[r][c] < 2) continue;
        const [x, y] = hexCenter(r, c);
        const d = Math.hypot(r - row, c - col);
        if (free(x, y, 2.6) && offRoutes(x, y) && (!best || d < best.d)) best = { x, y, d };
      }
    }
    if (best) {
      deco += ship(best.x, best.y);
      take(best.x, best.y, 2.6);
      ships--;
    }
  }
  // Rivers (grid.RIVERS, lines of [x, y] from source to mouth) run as smooth curves; on the first, a
  // few boats (grid.RIVER_BOATS) where it runs more or less east–west. Roads (grid.ROADS) run the same
  // way, dashed. Caravans (grid.CARAVAN: camels, or llamas) walk near grid.CARAVANS ([x, y]). The
  // forests and dunes keep off them all.
  const rivers = (grid.RIVERS ?? []).map(smooth).join('');
  const roads = (grid.ROADS ?? []).map(smooth).join('');
  const along = (line, step) =>
    line.slice(1).flatMap(([x2, y2], i) => {
      const [x1, y1] = line[i];
      const k = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / step));
      return Array.from({ length: k }, (_, j) => [x1 + ((x2 - x1) * j) / k, y1 + ((y2 - y1) * j) / k, Math.atan2(y2 - y1, x2 - x1)]);
    });
  const onLand = (x, y) => {
    const r = Math.round((y - 1) / 1.5);
    const c = Math.round((x - Math.sqrt(3) / 2) / Math.sqrt(3) - 0.5 * (r & 1));
    return dist[r]?.[c] === 0;
  };
  let boats = grid.RIVER_BOATS ?? 0;
  const niger = grid.RIVERS?.[0] ? along(grid.RIVERS[0], 0.5) : [];
  const afloat = [];
  for (const share of [0.45, 0.25, 0.65, 0.85]) {
    if (!boats) break;
    // the nearest good spot to this share of the river: flat, on land, free, and apart from the others
    const at = Math.floor(share * niger.length);
    const spot = [...niger.keys()]
      .sort((i, j) => Math.abs(i - at) - Math.abs(j - at))
      .map((i) => niger[i])
      .find(([x, y, a]) => Math.abs(Math.sin(a)) < 0.45 && onLand(x, y) && free(x, y, 1.4) && afloat.every(([u, v]) => Math.hypot(x - u, y - v) > 15));
    if (!spot) continue;
    const [x, y, a] = spot;
    afloat.push(spot);
    const deg = ((((a * 180) / Math.PI + 90) % 180) + 180) % 180 - 90; // along the river, never upside down
    land += `<use href="#art-pirogue" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${deg.toFixed(0)}) scale(1.35)"/>`;
    take(x, y, 1.5);
    boats--;
  }
  for (const [x0, y0] of grid.CARAVANS ?? []) {
    let best = null;
    for (let dy = -4; dy <= 4; dy += 0.75) {
      for (let dx = -6; dx <= 6; dx += 0.75) {
        const [x, y] = [x0 + dx, y0 + dy];
        const ok = [[-2.2, 0], [2.2, 0], [0, -1.4], [0, 0.8]].every(([ex, ey]) => onLand(x + ex, y + ey));
        if (ok && free(x, y, 2.2) && (!best || Math.hypot(dx, dy) < best.d)) best = { x, y, d: Math.hypot(dx, dy) };
      }
    }
    if (!best) continue;
    land += use(grid.CARAVAN ?? 'caravan', best.x, best.y, 1.1);
    take(best.x, best.y, 2.4);
  }
  // Sights (grid.SIGHTS, [x, y, art]) go where they are put: a reed boat on a lake, a rider on the plains.
  for (const [x, y, kind] of grid.SIGHTS ?? []) {
    // On land over the territory's colour, as the caravans; on water with the ships.
    if (onLand(x, y)) land += use(kind, x, y, 1.2);
    else deco += use(kind, x, y, 1.2);
    take(x, y, 1.6);
  }
  for (const line of [...(grid.RIVERS ?? []), ...(grid.ROADS ?? [])]) for (const [x, y] of along(line, 0.5)) take(x, y, 0.35);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const [cx, cy] = hexCenter(r, c);
      const h = hash(r, c);
      const kind = TERRAIN[cellAt(r, c)];
      if (kind) {
        const x = cx + jitter(h, 3);
        const y = cy + jitter(h, 9);
        // Not on the coast either: the ink coastline stays clean.
        const coast = hexNeighbours(r, c).some(([nr, nc]) => cellAt(nr, nc) === '.');
        if (h % DENSITY[kind] === 0 && !coast && free(x, y, 0.9)) land += use(ART[kind][(h >>> 17) % ART[kind].length], x, y, 0.9 + (h % 3) * 0.1);
      } else if (dist[r][c] >= 2 && h % 6 === 0) {
        const x = cx + jitter(h, 4);
        const y = cy + jitter(h, 8);
        if (free(x, y, 0.8) && offRoutes(x, y)) sea += use('wave', x, y, 0.9 + (h % 3) * 0.15);
      }
    }
  }

  return { land, sea, deco, rivers, roads };
}

// A line through the points, smoothed (Catmull-Rom as cubic curves), as an SVG path.
function smooth(p) {
  const f = (v) => v.toFixed(2);
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const [a, b, c, e] = [p[i - 1] ?? p[i], p[i], p[i + 1], p[i + 2] ?? p[i + 1]];
    d += `C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`;
  }
  return d;
}
