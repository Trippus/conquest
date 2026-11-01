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

**Tidstypisk som udgangspunkt:** skibe, modstandernes navne, vinderens titel, terræn og navne på steder
følger perioden og stedet. Findes der ikke et tidstypisk skib i spillet, tegner vi et nyt (galejen til
Rom, et atakebune til Japan) i stedet for at låne et fra en anden tid.

## 2. Udkast til inddeling (Claude → Martin godkender)

En tabel med regioner og deres områder, som i chatten, før der tegnes noget. Husk:

- Et område må ikke hedde det samme som sin region ("Wessex: Wessex, Sussex …" forvirrer). Brug fx en
  hovedby (Winchester, Tamworth, Rouen).
- 2–6 områder pr. region. Regioner med få veje ind bliver mest værd.
- Tjek udkastet mod Martins faste punkter (se trin 6), før det vises: intet land i felttoget uden et
  område (fx et bjergland, der ikke står i tabellen), ingen sejlruter "via" en ø, og vis hvad der
  ligger rundt om.

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
- Tegn vinduet bredt fra starten: nabokontinenter og -lande med, som uudforsket land med navne.
- Et `#`-midtpunkt tager alt land, det er nærmest, også inde i felttoget. Ser man et hul eller en kile
  af uudforsket land mellem områderne, er det oftest et `#`-midtpunkt, der skal flyttes eller fjernes.
- Et område, der får land på den anden side af et stræde eller en bugt (Sinai under Theben), får et
  ekstra midtpunkt til den rigtige ejer.

## 4. Kortfilen (Claude)

Kopiér `js/maps/england.js` til `js/maps/<kort>.js` og ret: regioner, områder, `TERRAIN`, søveje
(`SEA`), missioner, `RULERS`, `TITLE`, `SHIP`, `LANDMARKS` (navne på uudforsket land). Tilføj kortet i
`js/maps/index.js`, så kommer det med i appen, simulatoren og værktøjerne.

Terræn (`TERRAIN`) følger sted og tid: `spruce` (gran) mod nord, `oak` (eg, også regnskov) mod syd,
`forest` (blandet) imellem, `mountains` og `desert` (klitter og en palme ind imellem).

Spillet findes også på engelsk. Giv derfor kortet engelske navne i `EN` (kortets navn, regioner,
områder, `LANDMARKS` og `RULERS`), og send dem med som `NAMES: { en: EN }`. Kun de navne, der er
anderledes på engelsk; resten bruger de danske. `TITLE` er allerede engelsk. `npm test` tjekker, at
de engelske navne hører til noget på kortet.

## 5. Kortrapport (Claude)

`npm run map-report -- <kort>` viser hvert område med størrelse og naboer, regionsbonusser, advarsler
(søveje mellem områder der allerede rører hinanden, områder uden naboer, meget små områder) og et forslag
til hvor regionsnavnene kan stå (`REGION_PLACES`).

## 6. Se det (Claude, så Martin)

Skærmbilleder af hele kortet og på en telefonbredde. Ret navne, der står oven i hinanden (`PLACES` for
områdernes navne, `REGION_PLACES` for regionernes). Derefter ser Martin kortet på telefonen og retter
inddelingen: det er her de fleste ændringer kommer, og man går tilbage til trin 3.

**Martins faste punkter**, gennemgået på et billede af hele kortet i fuld størrelse, før han ser det:

1. **Kontekst:** nok af kontinenterne rundt om til at se, hvor felttoget ligger, med navne på det
   uudforskede land.
2. **Sejlruter er til at angribe ad:** fra fastland til fastland, aldrig til en lille ø. Kun hvor de
   giver en ny vej; ingen rute mellem områder, der allerede grænser op til hinanden, og ingen der ser ud
   til at gå inden for samme område.
3. **Landet hænger sammen:** ingen huller, kiler eller trekanter af uudforsket land inde i felttoget, og
   intet område med stykker på den forkerte side af et stræde eller en bugt.
4. **Øer:** man skal kunne se, hvem en ø hører til. Ellers gøres den uudforsket.

## 7. Balance (Claude)

`npm run balance -- <kort>` måler tre ting med computerspil:

1. **Pladser:** vinder alle pladser lige ofte med 2, 3 og 4 spillere? Ellers ret
   `RULES.laterSeatArmies` (ekstra starthære til senere pladser).
2. **Missioner:** hver mission skal vinde 15–40 % af gangene. Ret ellers missionerne.
3. **Let:** en Normal-computer (som stand-in for en spiller) skal vinde 90 %+ mod 2 Let og 75–82 % mod
   3. Ret `RULES.noviceHandicap` (hvor mange færre starthære Let får på dette kort).

   Undtagelse: et kort med mange små regioner (2–3 områder) giver hurtige bonusser, så modstandernes hære
   vokser hurtigt, mere end målingen viser. Italien var for svært med 79 % og blev rigtigt med 88 %. Mål
   sådan et kort til 85–90 % mod 3.

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

Tages op, når der er flere togter at se dem i sammenhæng med:

- Oplåsning og togter i rækkefølge (et kort åbner det næste), og om verdenskortet skal være det sidste.
- Om hvert togt skal have en historie: en kort indledning til perioden (fx "Det er 1066. Kong Edvard
  er død, og tre mænd gør krav på tronen …"), og måske en afslutning, når man vinder.
