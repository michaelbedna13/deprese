/*
 * OBSAH GALERIE
 * ------------------------------------------------------------
 * Tady upravuješ všechno, co návštěvník čte. Kód (app.js) neřeš.
 *
 * Plakáty:
 *   angle   – kde na stěně visí (0–360 stupňů, 0 = před tebou na začátku)
 *   title   – nadpis na plakátu
 *   tagline – krátký text pod nadpisem (vidět už ze dálky)
 *   text    – delší text po kliknutí (každý řádek pole = odstavec)
 *   image   – volitelné: cesta k obrázku, např. "posters/unava.jpg"
 *             (pokud je vyplněno, zobrazí se obrázek místo typografie)
 *   loops   – volitelné: jak se tagline mění po každém obejití kruhu
 *
 * Všechny texty níže jsou jen NÁVRHY / zástupné texty – přepiš je svými.
 */
window.GALLERY = {
  intro: {
    title: "Začarovaný kruh",
    lines: [
      "Tahle místnost zobrazuje depresi.",
      "Rozhlížej se tažením myši nebo prstu, šipkami na klávesnici. Na věci můžeš kliknout.",
      "Kdykoli můžeš odejít. Vpravo nahoře je vždycky odkaz na pomoc."
    ],
    enter: "Vstoupit"
  },

  posters: [
    {
      angle: 0,
      title: "Únava",
      tagline: "Spal jsem deset hodin. Jsem unavený z toho, že existuju.",
      text: [
        "Tohle není únava, kterou spraví víkend.",
        "Je to únava, která sedí v kostech už ráno, ještě než otevřeš oči. Vyčistit si zuby je projekt. Odpovědět na zprávu je projekt."
      ],
      loops: [
        "Spal jsem deset hodin. Pořád nic.",
        "Spal jsem. Nespal jsem. Je to jedno."
      ]
    },
    {
      angle: 40,
      title: "Nic",
      tagline: "Věci, které mě bavily, jsou pořád tady. Já ne.",
      text: [
        "Anhedonie. Ztráta schopnosti mít radost.",
        "Není to smutek. Smutek je aspoň něco. Tohle je šedá místnost, kde i oblíbená písnička zní jako zvuk z vedlejšího bytu."
      ]
    },
    {
      angle: 80,
      title: "Maska",
      tagline: "„Jo, v pohodě, a ty?“",
      text: [
        "Nejvíc energie nespotřebuje deprese samotná, ale její skrývání.",
        "Úsměv v práci. Vtip u oběda. A doma pak ležíš v bundě na zemi v předsíni, protože do pokoje už to nejde."
      ],
      loops: ["„Jo, dobrý.“", "„Jo.“"]
    },
    {
      angle: 120,
      title: "Mlha",
      tagline: "Čtu tu větu potřetí.",
      text: [
        "Deprese bere i myšlení. Soustředění, paměť, rozhodování.",
        "Vybrat si v obchodě mezi dvěma jogurty může skončit tím, že odejdeš bez ničeho."
      ]
    },
    {
      angle: 160,
      title: "Vina",
      tagline: "Ostatní to mají horší. Nemám právo se takhle cítit.",
      text: [
        "Deprese ti nejen vezme sílu, ale ještě tě obviní, že ji nemáš.",
        "Je to nemoc. Ne povahová vada, ne lenost, ne nevděk."
      ]
    },
    {
      angle: 215,
      title: "Ráno",
      tagline: "Nejtěžší část dne trvá od otevření očí do postavení se na nohy.",
      text: [
        "Někdy to trvá deset minut. Někdy do odpoledne.",
        "Ležíš a víš přesně, co by se mělo udělat. Tělo neposlouchá."
      ]
    },
    {
      angle: 255,
      title: "Mezi lidmi",
      tagline: "Nejsamotnější jsem v místnosti plné přátel.",
      text: [
        "Slyšíš je, smiješ se ve správných chvílích. A mezi tebou a nimi je sklo.",
        "Nikdo za to nemůže. Ani ty."
      ]
    },
    {
      angle: 295,
      title: "Myšlenky",
      tagline: "Některé myšlenky nechceš mít. Přesto přicházejí.",
      text: [
        "Deprese umí přesvědčit, že by bylo lepší nebýt. Je to symptom nemoci, ne pravda o tobě ani o světě.",
        "Pokud tyhle myšlenky máš, řekni o nich někomu. Linka první psychické pomoci 116 123 je tu nonstop."
      ]
    },
    {
      angle: 335,
      title: "„Zkus se usmát“",
      tagline: "Dobře míněné rady, které bolí.",
      text: [
        "„Jdi víc ven.“ „Mysli pozitivně.“ „Ostatní to mají horší.“",
        "Lepší než rada je obyčejně být nablízku. „Jsem tady.“ stačí."
      ]
    }
  ],

  /* Poznámky na kulatém stole uprostřed. angle = kde na stole leží. */
  notes: [
    { angle: 10,  text: "dnes:\n☑ vstát\n☐ sprcha\n☐ nákup\n☐ zavolat mámě\n☐ odpovědět Petře" },
    { angle: 55,  text: "Zítra už to bude lepší.\n\n(psáno před 3 měsíci)" },
    { angle: 100, text: "Napsal jsem ti dlouhou zprávu.\nPak jsem ji smazal." },
    { angle: 150, text: "Lék: 1× ráno.\nVydržet aspoň 4–6 týdnů, než začne působit.\nNEVYSAZOVAT NÁHLE." },
    { angle: 200, text: "Věci, které kdysi pomohly:\n– procházka v dešti\n– Jirka\n– hudba nahlas\n\n(zkusit aspoň jednu)" },
    { angle: 250, text: "Proč nejsem šťastný?\nMám všechno.\n\n(Protože deprese se neptá, co máš.)" },
    { angle: 300, text: "Termín u psychiatra: za 7 týdnů.\nVydržet." },
    { angle: 340, text: "Kdo sem přišel a pozná se v tom —\nnejsi v tom sám.\nAni sama." }
  ],

  /* Skryté drobnosti – nízko na stěně, u podlahy. Najde je, kdo se dívá dolů. */
  whispers: [
    { angle: 25,  text: "kolikáté kolo už" },
    { angle: 140, text: "zítra" },
    { angle: 230, text: "není to tvoje vina" },
    { angle: 310, text: "ještě jednou" }
  ],

  /* Šepot, který se objeví po každém obejití celého kruhu. */
  loopMessages: [
    "Jedno kolo.",
    "Zase tady.",
    "Plakáty jsou stejné. Nebo nejsou?",
    "Kruh se nezvětšuje. Jen ty se zmenšuješ.",
    "Kolikáté kolo?"
  ],

  /*
   * DVEŘE – únik.
   * Každá návštěva bere další položku z "visits" (poslední se opakuje).
   * inside   – věty, které se postupně objeví při pohledu shora
   * back     – věta po návratu do místnosti
   * seconds  – jak dlouho nadhled trvá
   * clarity  – 1 = ostrý pohled, 0 = rozmazaný
   */
  door: {
    angle: 185,
    label: "Únik",
    visits: [
      {
        inside: [
          "Na chvíli je ticho.",
          "Poprvé po dlouhé době vidíš místnost shora.",
          "Je to kruh. Celou dobu je to kruh.",
          "Odsud vypadá menší, než se zdálo zevnitř."
        ],
        back: "Dveře se zavřely. Místnost je stejná. Ale teď víš, jak vypadá shora.",
        seconds: 16,
        clarity: 1
      },
      {
        inside: [
          "Dveře jdou ztuha.",
          "Výhled je kratší. Méně ostrý.",
          "Hledáš to, co bylo vidět minule."
        ],
        back: "Po návratu je místnost o kousek tmavší.",
        seconds: 9,
        clarity: 0.6
      },
      {
        inside: [
          "Za dveřmi je skoro tma.",
          "Únik se stal další místností v kruhu."
        ],
        back: "Nadhled ti nedaly dveře. Ten už máš v sobě.",
        seconds: 6,
        clarity: 0.25
      }
    ]
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
