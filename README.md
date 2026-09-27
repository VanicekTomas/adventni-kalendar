# Adventní kalendář 2026 – generátor listingů

Statický web pro jednotné HTML popisy 24 prosincových geocachingových eventů v Prostějově a okolí. Funguje přímo v prohlížeči, bez backendu a bez závislostí.

## Použití

Každý owner vyplní údaje, zkopíruje název do pole názvu eventu a HTML do **zdrojového kódu** pole popisu. Datum, čas a souřadnice je nutné nastavit i v samostatných polích při zakládání eventu. Výsledný vzhled je potřeba ověřit na Geocaching.com, jehož editor může HTML upravit.

HTML používá tabulky s atributy `bgcolor` a `cellpadding`, značky `font` a běžné odstavce bez skriptů. Tyto prvky mají v editoru Geocaching.com menší riziko úpravy vzhledu než složitější CSS. Text na webu i v listingu používá Verdanu s náhradními fonty Geneva a sans-serif. Zlaté linie tvoří úzké barevné tabulky, protože barva značky `<hr>` se v listingu nezachovala. Bílý pás pod zelenou tabulkou odděluje popis od dalších částí stránky. Náhled na webu je orientační; konečnou podobu vždy ověřte v editoru Geocaching.com. Vložený text se escapuje; prázdné nepovinné sekce se vynechají. Formulář neodesílá žádné údaje na server.
