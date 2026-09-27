# Adventní kalendář 2026 – generátor listingů

Statický web pro jednotné HTML popisy 24 prosincových geocachingových eventů v Prostějově a okolí. Funguje přímo v prohlížeči, bez backendu a bez závislostí.

## GitHub Pages

1. Nahrajte soubory `index.html`, `styles.css`, `app.js` a adresář `assets` do kořene repozitáře.
2. V repozitáři otevřete **Settings → Pages → Build and deployment** a vyberte **Deploy from a branch**, větev `main`, složku `/ (root)`.
3. Po zveřejnění otevřete adresu uvedenou v sekci Pages.

## Logo v listingu

Soubor `assets/advent-logo.svg` je zdroj jednoduchého vektorového loga. Soubor `assets/advent-logo.png` je jeho PNG export. Všechny vygenerované listingy již automaticky používají společné logo nahrané na Geocaching.com na adrese `https://img.geocaching.com:443/ef71c548-22cf-4746-b453-a1d710d75905.png`.

## Použití

Každý owner vyplní údaje, zkopíruje název do pole názvu eventu a HTML do **zdrojového kódu** pole popisu. Datum, čas a souřadnice je nutné nastavit i v samostatných polích při zakládání eventu. Výsledný vzhled je potřeba ověřit na Geocaching.com, jehož editor může HTML upravit.

HTML používá tabulky, inline barvy a základní značky bez skriptů. Vložený text se escapuje; prázdné nepovinné sekce se vynechají. Formulář neodesílá žádné údaje na server.
