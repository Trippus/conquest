# Conquest (arbejdstitel)

Et turbaseret strategispil om at erobre verden, fra **Trippus Games**. Forstærk, angrib med terninger,
flyt tropper, og saml kort til ekstra hære. Først en nutidig udgave, senere historiske æraer på samme motor.
Hvad der skal designes og besluttes står i [`DESIGN.md`](DESIGN.md).

## Kør
```
npm start          # http://localhost:5183 (også over Wi-Fi)
npm test           # unit-tests af reglerne og bot-spil
npm run sim        # 200 bot-spil: sejre pr. plads, længde (npm run sim -- 500 3 = 500 spil, 3 spillere)
```

## Opbygning
| Fil | Hvad |
|---|---|
| `js/engine.js` | Reglerne (ren logik, intet DOM): kort, turfaser, kamp, kort-sæt, gem/genspil, `view()` til online |
| `js/ai.js` | Computerspillere ("let" bot) og `playBots()` |
| `js/maps/*.js` | Kort som data: territorier, naboer, regioner og bonus. `test.js` er et lille testkort |
| `js/rules/*.js` | Regelsæt som data: starthære, terninger, kort-bytte, rundegrænse |
| `js/app.js` | Prototype-brugerfladen: tegner kortet ud fra data, tryk → handlinger, bots spiller, gem/indlæs. `window.__conquest` er debug-hooket |
| `tools/simulate.mjs` | Mange bot-spil til balance |

## Et spil er en liste af handlinger
Et spil er en opsætning (kort, regelsæt, spillere, seed) plus de handlinger, spillerne har lavet.
`apply()` tjekker en handling og giver den næste tilstand og nogle hændelser, som brugerfladen kan animere.
Terningerne kommer fra en seeded generator i tilstanden, så `replay()` altid giver præcis det samme spil.
Det bruges til at gemme, til fejlrapporter og senere til online-spil, hvor en server holder tilstanden
og kun viser hver spiller `view(state, spiller)`.

## Status
Milepæl 1 (regelmotor og tests) og 2 (spilbar prototype mod computeren og flere på samme telefon) er færdige.
Næste: en "normal" bot (milepæl 3). Gemmes i `localStorage` under `conquest.v1` som opsætning + handlinger.

Kendt til balancen: på testkortet vinder spiller 1 ca. 70 % af 2-mandsspillene (32 % ved 4 spillere).
Det skal justeres, når det rigtige kort findes, fx færre forstærkninger i første runde.

Ingen licens: alle rettigheder forbeholdes.
