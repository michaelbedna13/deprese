/*
 * OBSAH GALERIE – Začarovaný kruh
 * ------------------------------------------------------------
 * Tady upravuješ všechno, co návštěvník vidí a čte. Kód (app.js) neřeš.
 *
 * Úhly (angle): 0 = dveře, po směru hodinových ručiček (90 = vpravo, 180 = naproti dveřím).
 * type: "main" = hlavní plakát, "triplet" = plakát v trojici
 * image: volitelné, např. "posters/01-nemam-se-rad.jpg" (poměr 5:7 u hlavních, 5:7 u trojic)
 *
 * Texty jsou zatím PRACOVNÍ (z našeho konceptu). Finální napíše autor.
 */
window.GALLERY = {
  intro: {
    title: "Začarovaný kruh",
    lines: [
      "Tahle místnost zobrazuje depresi.",
      "Rozhlížej se tažením myši nebo prstu, nebo šipkami. Na co namíříš, to se rozsvítí. Kliknutím otevřeš detail.",
      "Kdykoli můžeš odejít. Vpravo nahoře je vždycky odkaz na pomoc."
    ],
    enter: "Vstoupit"
  },

  posters: [
    // ---- nad dveřmi
    { id: "nemam-se-rad", type: "main", angle: 0, aboveDoor: true, number: 1,
      title: "Nemám se rád", line: "Pozorovatel, který soudí místo toho, aby měl rád." },

    // ---- trojice JÁ
    { id: "ego", type: "triplet", angle: 29, number: 2, group: "Já",
      title: "Ego", line: "Vězení vlastní hlavy. Ne pýcha." },
    { id: "sebelitost", type: "triplet", angle: 45, number: 3, group: "Já",
      title: "Sebelítost", line: "Soucit se sebou, který se zasekl." },
    { id: "stud", type: "triplet", angle: 61, number: 4, group: "Já",
      title: "Stud", line: "Blízcí znají schránku, ne mě." },

    // ---- vpravo
    { id: "zvykova-energie", type: "main", angle: 90, number: 5,
      title: "Zvyková energie", line: "Naučená trasa, která tě táhne dokola." },

    // ---- trojice MECHANISMUS
    { id: "autopilot", type: "triplet", angle: 119, number: 6, group: "Mechanismus",
      title: "Autopilot", line: "Funguješ, ale nežiješ." },
    { id: "cas", type: "triplet", angle: 135, number: 7, group: "Mechanismus",
      title: "Čas", line: "Stojí a utíká zároveň." },
    { id: "ztracena-duse", type: "triplet", angle: 151, number: 8, group: "Mechanismus",
      title: "Ztracená duše", line: "Ztráta spojení se sebou a se smyslem." },

    // ---- naproti dveřím
    { id: "sebevrazda", type: "main", angle: 180, number: 9,
      title: "Sebevražda", line: "Vyčerpání zúží vidění. Chceš konec bolesti, ne konec života.",
      help: true },

    // ---- trojice DRUZÍ
    { id: "empatie", type: "triplet", angle: 209, number: 10, group: "Druzí",
      title: "Empatie", line: "Cítíš druhé a chráníš je před sebou." },
    { id: "maska", type: "triplet", angle: 225, number: 11, group: "Druzí",
      title: "Maska", line: "Nejméně bolestivá varianta. Ale drahá." },
    { id: "telo", type: "triplet", angle: 241, number: 12, group: "Druzí",
      title: "Tělo", line: "Výkon jako upřímné zrcadlo. Tělo nelže." },

    // ---- vlevo
    { id: "osamelost", type: "main", angle: 270, number: 13,
      title: "Osamělost", line: "Lidi jsou tady. Spojení ne." }
  ],

  /* Nástěnka s menšími tématy (připíchnuté karty) */
  board: {
    angle: 315,
    title: "Nástěnka",
    cards: [
      { title: "Inteligence", text: "Vidím vzorce. Nemůžu je dokázat ani změnit." },
      { title: "…", text: "Místo pro další myšlenku." },
      { title: "…", text: "Místo pro další myšlenku." },
      { title: "…", text: "Místo pro další myšlenku." },
      { title: "…", text: "Místo pro další myšlenku." }
    ]
  },

  /* Světlo nahoře – podívej se vzhůru */
  light: {
    title: "Smysl",
    lines: [
      "Opak závislosti není abstinence, ale smysl.",
      "Tahle galerie vznikla, protože když tvořím něco užitečného, deprese ustoupí stranou. Je to způsob, jak se pochopit. A možná pomůže i někomu dalšímu."
    ]
  },

  /* Dveře – za zády na začátku. Otevřou se po obejití kruhu. */
  door: {
    closedText: "Dveře jsou zavřené. Zatím.",
    loopText: "Jedno kolo. Něco za tebou se pohnulo.",
    beyond: [
      "Shora je to vidět.",
      "Je to kruh. Celou dobu.",
      "A ze všech těch obrazů je jen jeden pozorovatel."
    ],
    back: "Místnost je stejná. Pohled ne."
  },

  help: {
    title: "Potřebuješ pomoc hned?",
    lines: [
      "Linka první psychické pomoci: <a href=\"tel:116123\">116 123</a> (nonstop, zdarma)",
      "Linka bezpečí (do 26 let): <a href=\"tel:116111\">116 111</a>",
      "Záchranná služba: <a href=\"tel:155\">155</a> · Tísňová linka: <a href=\"tel:112\">112</a>",
      "Pokud máš myšlenky na to, že by bylo lepší nežít, nejsi v tom sám ani sama. Ozvi se jim."
    ]
  }
};
