# Začarovaný kruh

Kulatá galerie o depresi. Webová „hra“ v prohlížeči: sedíš u kruhového stolu uprostřed kulaté místnosti, kolem tebe prázdné židle, na stole poznámky, na stěnách plakáty. A jedny dveře.

Je to umělecké dílo pro dva druhy návštěvníků:
- pro ty, kdo depresi nemají, aby ji mohli aspoň trochu nacítit,
- pro ty, kdo ji mají, aby věděli, že tu nejsou sami.

## Jak to funguje

- **Černá kulatá místnost**, inspirovaná malovaným světlem a atmosférou animovaných seriálů typu Arcane.
- **Rozhlížení:** tažení myší/prstem, kolečko myši, šipky (Shift = rychleji). Tab prochází plakáty, dveře a nástěnku.
- **Na co namíříš, to se rozsvítí** (kužel světla, prach). Klik/ťuknutí = detail.
- **13 plakátů:** 4 hlavní (po 90°) + 3 trojice (Já, Mechanismus, Druzí). Čtvrtá čtvrtina je **nástěnka** s menšími tématy.
- **Dveře** za zády na začátku, nad nimi plakát *Nemám se rád*. Otevřou se po obejití kruhu a vedou k **nadhledu** (pohled shora).
- **Světlo nahoře** (podívej se vzhůru) = *Smysl*.
- **Pomoc:** tlačítko „Potřebuješ pomoc?“ je vždy vpravo nahoře.

## Jak upravovat obsah

Všechny texty jsou v souboru **`content.js`**. Kód není potřeba měnit.

- Každý plakát má v `posters` svůj blok: název, krátký text, úhel na stěně.
- Vlastní grafiku nahraješ do složky `posters/` a doplníš `image: "posters/nazev.jpg"`. Poměr stran 5 : 7 (např. 1500 × 2100 px).
- Karty na nástěnce jsou v `board.cards`, světlo nahoře v `light`, dveře v `door`.

Texty v `content.js` jsou zatím jen **návrhy**. Přepiš je svými.

## Spuštění

Stačí otevřít `index.html` v prohlížeči. Nic se neinstaluje.

## Zveřejnění (GitHub Pages)

1. V repozitáři na GitHubu: **Settings → Pages**
2. *Source:* „Deploy from a branch“, vyber větev (např. `main`) a složku `/ (root)`
3. Za chvíli bude galerie na `https://<uživatel>.github.io/deprese/`

## Struktura

```
index.html   – kostra stránky
style.css    – vzhled
app.js       – 3D místnost, míření a světlo, dveře, zvuk
content.js   – VŠECHNY TEXTY (tady tvoříš)
posters/     – (volitelně) obrázky plakátů
```
