# Začarovaný kruh

Kulatá galerie o depresi. Webová „hra“ v prohlížeči: sedíš u kruhového stolu uprostřed kulaté místnosti, kolem tebe prázdné židle, na stole poznámky, na stěnách plakáty. A jedny dveře.

Je to umělecké dílo pro dva druhy návštěvníků:
- pro ty, kdo depresi nemají, aby ji mohli aspoň trochu nacítit,
- pro ty, kdo ji mají, aby věděli, že tu nejsou sami.

## Jak to funguje

- **Rozhlížení:** tažení myší/prstem, kolečko myši, šipky (Shift = rychleji). Tab prochází plakáty, poznámky a dveře.
- **Plakáty:** po kliknutí se otevře delší text.
- **Poznámky na stole:** podívej se dolů.
- **Šepoty:** drobné nápisy nízko na stěně u podlahy, pro ty, kdo hledají.
- **Kruh:** po každém obejití celé místnosti se ozve šepot, místnost ztmavne a některé plakáty změní text.
- **Dveře (Únik):** přelet nad místnost, tedy doslovný *nadhled*. Poprvé ostrý a dlouhý, po návratu zůstane kolem dveří světlo. Každý další průchod je kratší, mlhavější a místnost po návratu ztmavne.
- **Pomoc:** tlačítko „Potřebuješ pomoc?“ je vždy vpravo nahoře.
- **Zvuk:** volitelný, syntetizovaný přímo v prohlížeči (hluboký dron a tikání hodin).

## Jak upravovat obsah

Všechny texty jsou v souboru **`content.js`**. Kód není potřeba měnit.

- Plakát přidáš zkopírováním jednoho bloku v `posters` a změnou `angle` (kde na stěně visí, 0–360°).
- Vlastní grafiku plakátu nahraješ do složky `posters/` a doplníš `image: "posters/nazev.jpg"`. Doporučený poměr je 380 × 540 (např. 1140 × 1620 px).
- Dveře mají v `door.visits` jednotlivé návštěvy: texty, délku a ostrost.

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
app.js       – 3D místnost, ovládání, kruh, dveře, zvuk
content.js   – VŠECHNY TEXTY (tady tvoříš)
posters/     – (volitelně) obrázky plakátů
```
