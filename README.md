# Conquest (arbejdstitel)

Et turbaseret strategispil om at erobre verden, fra **Trippus Games**. Forstærk, angrib med terninger,
flyt tropper, og saml kort til ekstra hære. Først en nutidig udgave, senere historiske æraer på samme motor.
Hvad der skal designes og besluttes står i [`DESIGN.md`](DESIGN.md).

## Kør
```
npm start          # http://localhost:5183 (også over Wi-Fi)
npm test           # unit-tests af reglerne og bot-spil
npm run sim        # 200 bot-spil: sejre pr. bot og pr. plads, længde
npm run sim -- 1000 normal,easy,easy large   # 1000 spil, én normal mod to lette, på det store testkort (eller world)
npm run design-shots                          # stilprøverne som PNG (kræver npm start)
```

## Opbygning
| Fil | Hvad |
|---|---|
| `js/engine.js` | Reglerne (ren logik, intet DOM): kort, turfaser, kamp, kort-sæt, gem/genspil, `view()` til online |
| `js/ai.js` | Computerspillere: "let" og "normal" (vægtene står i `TUNING`) og `playBots()` |
| `js/odds.js` | Præcise chancer for et terningslag og for "kæmp til enden" |
| `js/maps/*.js` | Kort som data: territorier, naboer, regioner og bonus. `test.js` er et lille testkort (12), `test-large.js` et stort (30) til simulationer, `world.js` verdenskortet (udkast) |
| `js/map-shapes.js` | Gør sekskantgitteret til tegnbare former: udjævnede omrids, grænser, kyst, havruter |
| `design/` | Stilprøver til kortet (`stilproever.html`, `stil-*.png`) |
| `js/rules/*.js` | Regelsæt som data: starthære, terninger, kort-bytte, rundegrænse |
| `js/app.js` | Brugerfladen: tryk → handlinger, bots spiller, terninger, gem/indlæs. `window.__conquest` er debug-hooket |
| `js/board.js` | Verdenskortet i papirkort-stil: farver, laksegl med hære, markeringer, træk og zoom (knib, hjul, +/−) |
| `tools/simulate.mjs` | Mange bot-spil til balance |

## Et spil er en liste af handlinger
Et spil er en opsætning (kort, regelsæt, spillere, seed) plus de handlinger, spillerne har lavet.
`apply()` tjekker en handling og giver den næste tilstand og nogle hændelser, som brugerfladen kan animere.
Terningerne kommer fra en seeded generator i tilstanden, så `replay()` altid giver præcis det samme spil.
Det bruges til at gemme, til fejlrapporter og senere til online-spil, hvor en server holder tilstanden
og kun viser hver spiller `view(state, spiller)`.

## Status
Milepæl 1 (regelmotor og tests), 2 (spilbar prototype mod computeren og flere på samme telefon) og 3 (normal bot)
er færdige. Næste: det rigtige kort og grafikken (milepæl 4), se `DESIGN.md`. Gemmes i `localStorage` under `conquest.v2` som opsætning + handlinger (v1 var spil på testkortet).

Kendt til balancen: på testkortet vinder spiller 1 ca. 70 % af 2-mandsspillene (32 % ved 4 spillere).
Det skal justeres, når det rigtige kort findes, fx færre forstærkninger i første runde.

Den normale bot vinder 1,3–1,4 gange sin rimelige andel mod lette bots på det store testkort (2–6 spillere).
På det lille testkort er forskellen mindre: spillene er så korte, at startopstillingen og terningerne bestemmer mest.

Ingen licens: alle rettigheder forbeholdes.
