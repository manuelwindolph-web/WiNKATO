# winkato.de

Statische Website für WiNKATO – Familienwappen, Vereinswappen und Unikate aus massiver Eiche.

Reines HTML, CSS und JavaScript. **Kein Build-Schritt, keine Abhängigkeiten.**
Was im Repo liegt, ist exakt das, was im Browser läuft – hochladen und fertig.

---

## ⚠️ Zuerst erledigen: die vier Stripe-Einstellungen

Die Website ist fertig. Der Checkout ist es erst, wenn diese vier Punkte im
[Stripe-Dashboard](https://dashboard.stripe.com/) gemacht sind. Ohne sie gehen
weiterhin Bestellungen verloren oder springen Kunden ab.

### 1. Kontoname auf „WiNKATO" ändern

Aktuell heißt die Zahlseite **„Wandel mit Stil"**. Wer auf „Jetzt kaufen" klickt,
landet bei einer Firma, die er nicht kennt – das sieht aus wie ein Betrugsversuch
und ist der wahrscheinlichste Grund für Kaufabbrüche.

→ *Einstellungen → Unternehmen → Öffentliche Angaben → **Öffentlicher Name*** auf `WiNKATO` setzen.

### 2. Lieferadresse erfassen aktivieren

Die Zahlungslinks fragen derzeit **nur die E-Mail-Adresse** ab. Keinen Namen, keine Adresse.
Nach einer Zahlung weißt du nicht, wohin das Paket soll.

→ Jeden Payment Link öffnen → *Optionen* → **Lieferadresse erfassen** aktivieren (Land: Deutschland).

### 3. Preise gegenprüfen

Auf der alten Seite standen an drei Stellen unterschiedliche Preise für dasselbe Produkt.
Ich habe alle Preise in eine einzige Datei gelegt: [`assets/js/shop-data.js`](assets/js/shop-data.js).
Was dort steht, zeigt die Website an. Was Stripe abbucht, steht im Dashboard – **beides muss übereinstimmen.**

Direkt in Stripe geprüft und bestätigt:

| Produkt | Website | Stripe | |
|---|---|---|---|
| Eichsfeld-Relief (Wandaufhänger) | 143,00 € | 143,00 € | ✅ geprüft |
| Pizzabrett | 69,00 € | 69,00 € | ✅ geprüft |
| Schneidebrett | 64,00 € | 64,00 € | ✅ geprüft |

Die übrigen elf Links konnte ich nicht mehr automatisiert auslesen. Bitte einmal durchgehen:

| Produkt | Website sagt | Stripe sagt |
|---|---|---|
| Eichsfeld-Relief mit Standfuß | 159,00 € | ☐ |
| Eichsfeld-Relief mit Staffelei | 167,00 € | ☐ |
| Deutschland-Relief 2.5D | 207,00 € | ☐ |
| Deutschland-Relief mit Rahmen | 239,00 € | ☐ |
| Eichsfeld-Karte Wandversion | 151,00 € | ☐ |
| Eichsfeld-Karte mit Standfuß | 159,00 € | ☐ |
| Eichsfeld-Karte mit Staffelei | 175,00 € | ☐ |
| Eichsfeldadler Standard | 319,00 € | ☐ |
| Eichsfeldadler Premium | 319,00 € | ☐ |
| **Brettchen** | **39,00 €** | ☐ ← hier stand früher auch 29,90 € |
| Hirsch-Wanddeko | 109,00 € | ☐ |

Weicht etwas ab: Preis in `shop-data.js` korrigieren **oder** in Stripe – Hauptsache, beide sind gleich.

### 4. Testkauf machen

Einmal komplett durchklicken: Produkt → Gravur eingeben → bezahlen (echte Karte, danach in
Stripe erstatten). Prüfen, ob die Gravur-Mail ankommt und die Referenz in Stripe auftaucht.

---

## Wie die Gravur jetzt bei dir ankommt

Auf der alten Seite wurde der Gravurtext nur im Browser gespeichert und dann verworfen –
die Meldung „wird automatisch übermittelt" stimmte nicht. Jetzt läuft es so:

1. Kunde gibt Gravurtext und E-Mail ein.
2. Die Seite vergibt eine Referenz, z. B. `WK-K4P7M`.
3. **Bevor** weitergeleitet wird, geht eine Mail an `einzigartig@winkato.de` mit Produkt,
   Ausführung, Preis, Gravurtext, Kunden-E-Mail und Referenz.
4. Erst danach geht es zu Stripe – die Referenz wird als `client_reference_id` mitgegeben
   und erscheint im Stripe-Dashboard bei der Zahlung.

So gehört zu jeder Zahlung eine Mail mit demselben Kürzel. Geht die Mail nicht raus,
sieht der Kunde einen Fehler und wird **nicht** zur Zahlung weitergeleitet.

---

## Aufbau

```
index.html               Startseite
familienwappen.html      Familienwappen (Hauptgeldseite)
vereinswappen.html       Vereins- und Gemeindewappen
eichsfeld-unikate.html   WiNKATO Originale, direkt bestellbar
geschenke.html           Personalisierte Geschenke, direkt bestellbar
ueber-mich.html          Über Manuel
kontakt.html             Kontaktformular
danke.html               Nach dem Absenden (noindex)
404.html                 Fehlerseite
impressum.html · datenschutz.html · agb.html · widerruf.html

assets/css/main.css      Gesamtes Design (Farben und Schriften ganz oben)
assets/css/fonts.css     Schrifteinbindung
assets/fonts/            Inter + Playfair Display, selbst gehostet
assets/js/shop-data.js   ← PREISE UND STRIPE-LINKS (einzige Quelle)
assets/js/main.js        Navigation, Galerien, Kaufdialog, Formular
assets/img/              Alle Bilder als WebP in 640 px und 1280 px
assets/video/            Werkstattvideo (komprimiert) + Standbild

.htaccess                Weiterleitungen, Caching, Sicherheit (Apache-Hoster)
vercel.json              Dasselbe für Vercel
robots.txt · sitemap.xml
_originale/              Originalfotos, per .gitignore ausgeschlossen
```

---

## Häufige Änderungen

**Preis ändern** → `assets/js/shop-data.js`, Betrag in Cent (`6900` = 69,00 €).
Anschließend denselben Preis in Stripe setzen.

**Zwischenspeicher** → CSS und JavaScript (also auch die Preise) prüft der
Browser bei jedem Besuch kurz auf Änderungen, sie gelten sofort. Bilder,
Schriften und Videos bleiben ein Jahr gespeichert: Wer eine solche Datei unter
gleichem Namen ersetzt, hängt im HTML ein neues `?v=Datum` an den Pfad
(wie bei `wappen-prozess.mp4?v=20261008`).

**Neues Produkt** → in `shop-data.js` ergänzen, dann eine Produktkarte in
`eichsfeld-unikate.html` oder `geschenke.html` kopieren und anpassen.
Der Button braucht nur `data-buy="produkt-id"`.

**Text ändern** → direkt in der jeweiligen HTML-Datei.

**Farben oder Schriftgrößen** → `assets/css/main.css`, ganz oben im Block `:root`.

**Navigation ändern** → steht in jeder HTML-Datei einmal (Suchen & Ersetzen über alle Dateien).

**Neue Seite** → bestehende Seite kopieren, dann `<title>`, `description`,
`<link rel="canonical">`, die `og:`-Angaben und den Inhalt anpassen –
und die Seite in `sitemap.xml` eintragen.

**Neue Bilder** → als WebP in zwei Größen nach `assets/img/` legen,
Namensschema `motiv-640.webp` und `motiv-1280.webp`.

---

## Veröffentlichen

```bash
git init
git add .
git commit -m "Website neu aufgesetzt"
git branch -M main
git remote add origin https://github.com/DEIN-KONTO/winkato.git
git push -u origin main
```

Danach je nach Hosting:

- **Klassischer Webhoster:** alle Dateien außer `_originale/` per FTP ins Web-Verzeichnis.
  `.htaccess` unbedingt mit hochladen (versteckte Dateien im FTP-Programm einblenden).
- **Vercel:** Repository verbinden, kein Framework, kein Build-Command,
  Output-Verzeichnis leer lassen. `vercel.json` wird automatisch genutzt.

### Wenn die Domain ohne `www` laufen soll

Alles ist auf `https://www.winkato.de` eingestellt. Für die Variante ohne `www`:

```bash
grep -rl "www.winkato.de" . --include="*.html" --include="*.xml" --include="*.txt" \
  | xargs sed -i 's|https://www\.winkato\.de|https://winkato.de|g'
```

Zusätzlich in `.htaccess` den www-Block auskommentieren und den Block darunter aktivieren.

---

## Nach dem Livegang

1. **Google Search Console** einrichten, Property anlegen, `sitemap.xml` einreichen.
   Erst danach weiß Google überhaupt, dass es die neuen Unterseiten gibt.
2. **Google Unternehmensprofil** anlegen. Für einen Handwerksbetrieb im Eichsfeld ist das
   der wirksamste kostenlose Kanal – und aktuell existiert keines.
3. **Statistik einbauen.** Ohne Zahlen lässt sich nicht unterscheiden, ob zu wenige Besucher
   kommen oder zu wenige davon kaufen. [Plausible](https://plausible.io) läuft ohne Cookie-Banner;
   ein Skript-Tag im `<head>` genügt.
4. **Rechtstexte prüfen lassen.** Die vorhandenen Texte wurden übernommen und nur neu gestaltet,
   inhaltlich nicht geprüft. Drei Punkte lohnen einen Blick:
   - im Impressum steht seit Längerem „Telefon folgt in Kürze"
   - ~~Verweis auf die EU-Streitschlichtungsplattform~~ entfernt: die Plattform wurde am 20.07.2025 abgeschaltet
   - beim Kauf personalisierter Ware muss der Ausschluss des Widerrufsrechts vor der Bestellung
     deutlich werden – im Kaufdialog steht der Hinweis jetzt, sollte aber juristisch abgesegnet sein

---

## Was technisch drinsteckt

- Eigene Unterseite je Geschäftsfeld statt einer einzigen Seite – Voraussetzung dafür,
  überhaupt für verschiedene Suchbegriffe ranken zu können
- Pro Seite eigener Title, eigene Description, Canonical, Open-Graph-Bild
- Strukturierte Daten: `LocalBusiness`, `Service`, `Product`, `FAQPage`, `BreadcrumbList`
- `robots.txt` und `sitemap.xml` (beide fehlten vorher)
- Weiterleitungen, damit die Seite nur unter **einer** Adresse erreichbar ist
- Alle Bilder als WebP in zwei Größen, `loading="lazy"`, feste `width`/`height` gegen Layoutsprünge
- Galeriebilder werden erst geladen, wenn man sie durchblättert
- Schriften selbst gehostet – keine Verbindung zu Google-Servern (DSGVO)
- Videodatei von 4,4 MB auf 0,6 MB reduziert
- Mobiles Menü mit Burger-Button (vorher gab es auf dem Handy gar keine Navigation)
- Tastaturbedienbar, Skip-Link, ARIA-Auszeichnungen, `prefers-reduced-motion`
- Datenschutz-Checkbox am Kontaktformular
