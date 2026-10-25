# Rulers of the Map – World Conquest

Et turbaseret strategispil om at erobre verden, fra **Trippus Games**. Forstærk, angrib med terninger,
flyt tropper, og få krigslykke: en ★ for hver tur med en erobring, som du indløser til ekstra hære, når du vil (★ +2, ★★ +5, ★★★ +9). Man vinder ved at erobre hele verden eller, i den kortere udgave,
ved først at klare sin hemmelige mission (to kontinenter, et antal områder eller at slå en bestemt spiller ud). Først en nutidig udgave, senere historiske æraer på samme motor.
Hvad der skal designes og besluttes står i [`DESIGN.md`](DESIGN.md).

## Kør
```
npm start          # http://localhost:5183 (også over Wi-Fi)
npm test           # unit-tests af reglerne og bot-spil
npm run sim        # 200 bot-spil: sejre pr. bot og pr. plads, længde
npm run sim -- 1000 normal,easy,easy large   # 1000 spil, én normal mod to lette, på det store testkort (eller world)
npm run sim -- 800 normal,normal,normal world mission   # med hemmelige missioner
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
| `js/app.js` | Brugerfladen: startskærm, tryk → handlinger, bots spiller, terninger, lyd, gem/indlæs. `window.__conquest` er debug-hooket |
| `js/audio.js` | Syntetiserede lyde (terninger, laksegl, horn, kort), ingen lydfiler |
| `js/map-art.js` | Kortsymboler i blæk: bjerge, skove, klitter, bølger, skibe, kompasrose, placeret ud fra gitteret |
| `js/emblems.js` | Spillernes emblemer, lavet af `tools/make-emblems.mjs` fra `assets/emblems` (se `LICENSES.md`) |
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
er færdige. Næste: det rigtige kort og grafikken (milepæl 4), se `DESIGN.md`. Gemmes i `localStorage` under `conquest.v3` som opsætning + handlinger (v1: testkortet, v2: verden med 30 områder).

Balance: den, der starter, har en fordel (uden udligning vinder spiller 1 ca. 73 % af 2-mandsspillene på
verdenskortet). Derfor starter senere pladser med flere hære (`laterSeatArmies`: +6 ved 2 spillere, +1 pr. plads
ved 3–6). Målt med bot-spil: 54/46 ved 2 spillere, ca. 25 % pr. plads ved 4.

Den normale bot vinder 1,3–1,4 gange sin rimelige andel mod lette bots på det store testkort (2–6 spillere).
På det lille testkort er forskellen mindre: spillene er så korte, at startopstillingen og terningerne bestemmer mest.

Ingen licens: alle rettigheder forbeholdes.

Verdenskortet har 40 områder. Med 4 normale bots varer et missionsspil ca. 17 runder og "erobr verden" ca. 27.
Hver missionstype vinder 18–30 % af gangene (rimelig andel 25 %).
