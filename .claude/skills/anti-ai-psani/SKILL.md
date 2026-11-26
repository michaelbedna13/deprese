---
name: anti-ai-psani
description: Psaní a revize českých textů tak, aby nezněly jako generované umělou inteligencí ("AI slop"). Použij vždy, když uživatel chce text "polidštit", odstranit AI styl, zkontrolovat, jestli text nezní uměle, učesat vlastní text bez ztráty hlasu, nebo když píšeš texty, které budou číst lidé jako umělecké dílo, osobní výpověď, článek, popisek, plakát či web. Platí i pro texty o duševním zdraví a depresi (galerie Začarovaný kruh). Triggers also on English requests like "remove AI slop", "make this sound human", "anti-AI writing", "de-AI this text".
---

# Anti-AI psaní

Texty generované AI mají rozpoznatelný rukopis. Nejde o jednotlivé chyby, ale o **hustotu opakovaných vzorců**: stejné rétorické figury, uhlazené pointy, prázdná slova, stejně dlouhé věty. Čtenář to pozná dřív, než to umí pojmenovat, a přestane textu věřit. U osobních a uměleckých textů je to fatální: text o bolesti, který zní jako šablona, bolest nepřenese.

Cíl není „oklamat detektor“. Cíl je text, za kterým je vidět konkrétní člověk, konkrétní zkušenost a konkrétní věci.

## Nejdřív urči režim

**A) Revize cizího textu (typicky autorova vlastního).**
Autorův hlas je cennější než hladkost. Zasahuj co nejméně. Opravuj jen to, co je opravdu vzorec, ne to, co je jen jiný styl, než bys psal ty. Neuhlazuj neobratnosti, které nesou osobnost (krátké úsečné věty, opakování z emoce, hovorová slova, gramaticky nedokonalé ale živé formulace). Nikdy neměň význam, fakta ani rejstřík. Když si nejsi jistý, navrhni, nepřepisuj.

**B) Psaní nového textu.**
Napiš text, pak udělej revizní průchod podle kontrolního seznamu níže. Teprve potom ho odevzdej.

**C) Kontrola.**
Uživatel chce jen vědět, kde text zní uměle. Vrať seznam nálezů s doslovnými citacemi a krátkým důvodem. Nic nepřepisuj, pokud o to nepožádá.

Když režim z požadavku není jasný a jde o autorův vlastní text, zvol A.

## Co hlídat

Úplný katalog vzorců s příklady je v `references/vzorce.md`. Přečti ho při první revizi v konverzaci. Nejčastější a nejškodlivější:

1. **„Není to X, ale Y“** a jeho varianty („nejde o X, jde o Y“, „nejen X, ale i Y“, „X? Ne. Y.“). AI tímhle obratem vyrábí falešnou hloubku. Jednou za dlouhý text je v pořádku. Dvakrát na stránku už je to podpis.
2. **Trojice.** Tři přídavná jména, tři podstatná jména, tři krátké věty za sebou. Lidé píšou ve dvojicích, čtveřicích, nebo jednotlivě.
3. **Uhlazená pointa na konci odstavce.** Aforismus, poučení, „a to je možná to nejdůležitější“. Zkus poslední větu odstavce smazat. Pokud text nic neztratí, smaž ji.
4. **Dvojtečka nebo pomlčka před odhalením.** „A pak přišlo to nejhorší: ticho.“ Dramatická pauza vyrobená interpunkcí.
5. **Prázdná slova a fráze.** „V dnešní době“, „hraje klíčovou roli“, „nedílná součást“, „cesta“, „prostor pro“, „ponořit se do“, „rezonovat“, „autentický“, „transformace“, „hluboce“, „skutečně“, „zkrátka“, „závěrem lze říci“.
6. **Abstraktní místo konkrétního.** „Pocit prázdnoty“ místo „dvacet minut sedím na posteli s jednou ponožkou v ruce“. Konkrétní detail je to jediné, co AI nemá, protože nic nezažila.
7. **Stejný rytmus.** Věty podobné délky, odstavce podobné délky, každá sekce stejně postavená. Střídej. Krátká věta. Pak delší, která se rozvine a nechá čtenáře chvíli dýchat.
8. **Struktura místo prózy.** Nadpisy, odrážky a tučné písmo tam, kde by člověk prostě napsal odstavec. Formátování ber jako nástroj, ne jako výchozí stav.
9. **Tón asistenta.** Ujišťování, nadšení, servilní úvody, shrnutí na konci, opakování zadání, alibistické „do jisté míry“ u všeho.

## Texty o depresi a duševním zdraví

Tady AI styl škodí nejvíc, protože z bolesti dělá kýč.

- **Žádné útěšné fráze:** „na konci tunelu je světlo“, „všechno se děje z nějakého důvodu“, „buď silný“, „nejsi sám“ jako mechanická koncovka. Útěcha funguje, jen když je konkrétní a zasloužená.
- **Jedna metafora a dotáhnout ji.** AI vrší tmu, světlo, vlny, bouři a propast do jednoho odstavce. Člověk si vybere jeden obraz a drží ho.
- **Terapeutický žargon jen tam, kde je potřeba.** „Zpracovat trauma“, „nastavit hranice“, „pracovat na sobě“ znějí jako z brožury.
- **Neromantizuj bolest** a nedělej z ní estetiku.
- **Sebevražda:** nikdy metody ani detaily způsobu. Ukazuj bolest i to, co pomohlo nebo drží. Kontakt na pomoc (v ČR Linka první psychické pomoci 116 123) patří tam, kde se téma otevírá.
- **Nevymýšlej zkušenost za autora.** Když chybí konkrétní detail, zeptej se na něj nebo nech prázdné místo. Vymyšlený detail je horší než žádný.

## Revizní průchod (kontrolní seznam)

Projdi text těmito kroky v tomto pořadí:

1. **Spočítej** obraty „není…ale“, trojice, dvojtečky a pomlčky před pointou. Nech nanejvýš jeden z každého druhu, a to jen tam, kde opravdu nese význam.
2. **Test poslední věty:** u každého odstavce zkus smazat poslední větu.
3. **Test frází:** projdi text proti seznamu v `references/vzorce.md` a vyhoď nebo nahraď prázdná slova konkrétními.
4. **Test konkrétnosti:** najdi tři nejabstraktnější věty a zkus je nahradit scénou, předmětem, časem, místem, tělem. Když konkrétní detail neznáš, nevymýšlej ho.
5. **Test rytmu:** přečti text nahlas (v duchu). Kde zní jako litanie stejně dlouhých vět, rozbij to.
6. **Test formátování:** smazal bys nadpisy a odrážky, kdyby to psal člověk do dopisu?
7. **Test pravdy:** je v textu tvrzení, citát nebo údaj, který nemáš ověřený? Označ ho nebo odstraň.

## Nepřestřel

Proti-AI karikatura je taky špatně: text rozsekaný na samé krátké věty, schválně „ležérní“ hovorovost, zakázaná interpunkce. Pomlčka, trojice nebo pointa nejsou zakázané. Problém je, když se opakují jako tik. Měř hustotu, ne výskyt.

## Výstup

- **Režim A:** vrať upravený text. Pod něj krátký seznam (3–7 bodů), co jsi změnil a proč. Když jsi něco jen navrhl, odliš to.
- **Režim B:** vrať hotový text. Komentář jen pokud o něj uživatel stojí.
- **Režim C:** vrať seznam nálezů ve tvaru: citace → vzorec → návrh. Seřaď od nejvážnějšího.

Odpovídej v jazyce uživatele. Vysvětlení piš stejně jako text: konkrétně, bez frází.
