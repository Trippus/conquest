# Sådan laver vi et nyt kort (togt)

Opskriften, vi fandt frem til med Vikingetogtet og Kampen om England. Et kort er ren data: et gitter af
bogstaver, en liste over områder og regioner, søveje, missioner og lidt periodepræg. Regler, computer-
spillere og skærme er de samme for alle kort.

**Hvem gør hvad:** Martin bestemmer periode, område og inddeling og ser kortet igennem på telefonen.
Claude tegner, måler og retter.

## 1. Idé (Martin)

- Periode og område, fx "Roms samling af Italien".
- Omtrent hvor mange områder: 20–30 giver et spil på 10–20 minutter på en telefon.
- Om der er noget, der skal se særligt ud: skibe, navne på modstandere, vinderens titel.

## 2. Udkast til inddeling (Claude → Martin godkender)

En tabel med regioner og deres områder, som i chatten, før der tegnes noget. Husk:

- Et område må ikke hedde det samme som sin region ("Wessex: Wessex, Sussex …" forvirrer). Brug fx en
  hovedby (Winchester, Tamworth, Rouen).
- 2–6 områder pr. region. Regioner med få veje ind bliver mest værd.

## 3. Gitter fra rigtige kystlinjer (Claude)

1. Hent kystlinjerne én gang (Natural Earth, public domain, kun til værktøjet, ikke i spillet):
   `curl -L -o land-50m.json https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json`
2. Skriv `tools/grids/<kort>.mjs`: vinduet (bredde- og længdegrader, `LAT_STEP` = hvor fint), et
   midtpunkt pr. område, og `#`-midtpunkter for land uden for togtet (det bliver tegnet som uudforsket).
3. Kør `node tools/make-grid.mjs <kort> land-50m.json` og sæt rækkerne ind i kortfilen.

Erfaringer:

- Et område, der breder sig for langt (Wales op til Liverpool), får et ekstra midtpunkt til naboen.
- Små øer uden eget midtpunkt hører til nærmeste område (`ISLAND`, `ISLAND_REACH`). En lille ø langt ude
  (Shetland under Orkney) forvirrer søvejene: tag den hellere ud med `FORCE_SEA`.
- Smalle stræder (Øresund) lukker i gitteret: hold dem åbne med `FORCE_SEA`.

## 4. Kortfilen (Claude)

Kopiér `js/maps/england.js` til `js/maps/<kort>.js` og ret: regioner, områder, `TERRAIN`, søveje
(`SEA`), missioner, `RULERS`, `TITLE`, `SHIP`, `LANDMARKS` (navne på uudforsket land). Tilføj kortet i
`js/maps/index.js`, så kommer det med i appen, simulatoren og værktøjerne.

## 5. Kortrapport (Claude)

`npm run map-report -- <kort>` viser hvert område med størrelse og naboer, regionsbonusser, advarsler
(søveje mellem områder der allerede rører hinanden, områder uden naboer, meget små områder) og et forslag
til hvor regionsnavnene kan stå (`REGION_PLACES`).

## 6. Se det (Claude, så Martin)

Skærmbilleder af hele kortet og på en telefonbredde. Ret navne, der står oven i hinanden (`PLACES` for
områdernes navne, `REGION_PLACES` for regionernes). Derefter ser Martin kortet på telefonen og retter
inddelingen: det er her de fleste ændringer kommer, og man går tilbage til trin 3.

## 7. Balance (Claude)

`npm run balance -- <kort>` måler tre ting med computerspil:

1. **Pladser:** vinder alle pladser lige ofte med 2, 3 og 4 spillere? Ellers ret
   `RULES.laterSeatArmies` (ekstra starthære til senere pladser).
2. **Missioner:** hver mission skal vinde 15–40 % af gangene. Ret ellers missionerne.
3. **Let:** en Normal-computer (som stand-in for en spiller) skal vinde 90 %+ mod 2 Let og 75–82 % mod
   3. Ret `RULES.noviceHandicap` (hvor mange færre starthære Let får på dette kort).

Andre værdier kan prøves uden at ændre filen: `npm run balance -- <kort> seats=2:7,3:2 handicap=0.3`.

## 8. Tests (Claude)

Kopiér `tests/unit/england.test.mjs`: kortet er gyldigt, de vigtige naboskaber og søveje findes,
regionerne har navn og bonus, og computerne kan spille det færdigt. `npm test` skal være grønt.

## 9. På en rigtig telefon (Martin)

Testtelefonen er en OnePlus 12 med Chrome. Zoom og træk på kortet, spil et par runder. Ting der flimrer
eller hakker, kan findes med testlinket `?plain=paper,ink,bands,sea`, som slår effekter fra én ad gangen.
Hold igen med tunge effekter på store kort: lag der bevæger sig over hele kortet, blandede lag, klipning og
mønstre gav flimmer.

## 10. Udgiv (Claude)

Commit og push; GitHub Pages har det oppe efter et par minutter. Martin prøver det på telefonen.

## Ikke besluttet endnu

Oplåsning og togter i rækkefølge (et kort åbner det næste), og om verdenskortet skal være det sidste.
