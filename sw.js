// Every file is asked for anew each time (a quick "not modified" when nothing has changed), so after an
// update a phone never mixes the new page with scripts or styles it kept, which GitHub Pages lets it do
// for ten minutes. What it gets is marked to be asked for again, or the browser's memory would keep it
// past this. Offline, the last files it fetched. The music, fetched in pieces, goes past.
addEventListener('install', () => skipWaiting());
addEventListener('activate', (e) => e.waitUntil(clients.claim()));
addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin || r.headers.has('range')) return;
  e.respondWith(fetch(r, { cache: 'no-cache' }).then(askAgain, () => fetch(r, { cache: 'force-cache' })));
});
function askAgain(res) {
  if (res.type !== 'basic') return res;
  const headers = new Headers(res.headers);
  headers.set('cache-control', 'no-cache');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}
