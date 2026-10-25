# Design: hvad der skal besluttes og tegnes

Motoren og AI'en bygges uden design. Prototypen bruger cirkler, streger og standardfarver.
Denne liste er det, **du** skal tage stilling til eller tegne. Rækkefølgen er den, det bliver brug for.

Claude laver et udkast til det meste, som du retter i. Du behøver ikke starte fra en tom side.

## Allerede besluttet
- **Kort:** den rigtige verden, stiliseret (som originalen). Egne, neutrale spil-regioner og ingen nutidige landegrænser.
- **Én app**, hvor æraerne (moderne, Rom, vikinger …) er indhold, man kan låse op. Kort og regler er data.
- **Multiplayer kommer:** asynkront først ("din tur" + notifikation). Motoren er bygget som en log af handlinger.
- **Repo:** offentligt, ingen licens (alle rettigheder forbeholdes). Kodenavn `conquest`.
- **Aldrig** "Risk" i navn, tekster, søgeord eller grafik. Ingen infanteri/kavaleri/kanon-symboler.

## Før prototypen er spilbar (milepæl 2)
Intet. Prototypen er bevidst grim.

## Når reglerne er afprøvet (milepæl 4: rigtigt kort og grafik)
| # | Hvad | Du beslutter / tegner | Claude leverer |
|---|---|---|---|
| 1 | **Kortstil** | Udtrykket: papirkort, flat/low-poly, neon, brætspil … Gerne 2–3 billeder til inspiration | ✅ **Valgt: B, gammelt papirkort** (24/10-2026). Bygget ind i spillet (`js/board.js`). Stilprøverne ligger stadig i `design/` |
| 2 | **Territorie-inddeling** | Hvor grænserne går, og hvad de ca. 24–30 territorier og 5–6 regioner hedder | ✅ Udkast 2: 40 territorier i 6 regioner (8/5/7/6/10/4) i `js/maps/world.js` (bogstaver i et sekskantgitter, så det er let at rette). Egen inddeling, tegnet i hånden, ingen fremmede kortdata |
| 3 | **Havruter og regionsbonus** | Hvilke forbindelser over vand, der skal findes | ✅ Udkast: 8 havruter, bonus ud fra antal indgange. Bot-spil: retfærdigt ved 2–4 spillere |
| 4 | **Spillerfarver** | 6 farver, der kan skelnes af farveblinde, plus et symbol eller mønster pr. spiller | ✅ Delvist: hver spiller har et emblem i seglet (løve, ørn, galeon, tårn, ulv, krone, fra game-icons.net). Farverne er ikke farveblind-tjekket endnu |
| 5 | **Hærvisning** | Tal i en cirkel, små figurer eller faner? Hvordan ser 1, 12 og 87 ud? | Prototype af 2 varianter |
| 6 | ~~Kortsymboler~~ | Bortfaldet: krigslykke er nu stjerner, der indløses til hære. Kortene findes stadig i motoren (`luck: 'cards'`) | – |

## Når det skal føles rigtigt (milepæl 5: feel og polish)
| # | Hvad | Du beslutter |
|---|---|---|
| 7 | **Mobil-layout** | Hvor fasebjælke, knapper og korthånd ligger, og zoom/panorering på kortet |
| 8 | **Kampen** | Hvordan terninger og "blitz" vises: hurtigt og tydeligt eller dramatisk |
| 9 | **Lyd og musik** | Stemningen: moderne militær, hyggeligt brætspil eller noget tredje |
| 10 | **Tekster og tone** | Tutorial og knaptekster (på dansk). Hvor "krigerisk" må sproget være? |
| 11 | **Balance-playtest** | Spil mod bots og andre: er det sjovt, og er nogen regioner for stærke? |

## Før butikken (trin 04)
| # | Hvad | Du beslutter |
|---|---|---|
| 12 | **Navn** | ✅ **Valgt: Rulers of the Map – World Conquest** (25/10-2026). Websøgning: intet spil eller app med navnet. Mangler: varemærketjek på EUIPO og dkpto.dk (klasse 9 og 41) |
| 13 | **Logo og app-ikon** | Ikonets motiv, der skal kunne ses i 48 px |
| 14 | **Feature graphic og skærmbilleder** | Hvilke situationer i spillet, der viser det bedst |

## Senere: historiske æraer
For hver æra: kortets inddeling og navne for perioden, stilen på hære og symboler, og en
regel-twist eller to (fx flåder i vikingetiden). Kystlinjerne genbruges.
