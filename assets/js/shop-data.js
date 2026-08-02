/* ==========================================================================
   WiNKATO – Produktdaten
   --------------------------------------------------------------------------
   EINZIGE Quelle für Preise, Varianten und Stripe-Links.
   Preise stehen hier genau einmal und werden überall im HTML daraus gerendert.
   Wenn ein Preis sich ändert: hier ändern UND im Stripe-Dashboard – sonst
   zeigt die Seite etwas anderes an, als am Ende abgebucht wird.

   preis = Bruttopreis in Euro-Cent (ganzzahlig, keine Rundungsfehler).
   ========================================================================== */

window.WINKATO_PRODUCTS = {
  /* ------------------------------------------------- WiNKATO Originale */
  "eichsfeld-lied": {
    name: "Eichsfeld-Relief mit Eichsfeldlied",
    kategorie: "WiNKATO Original",
    personalisierbar: false,
    varianten: [
      { id: "eichsfeld-lied-wandaufhaenger", label: "Mit Wandaufhänger", preis: 14300, stripe: "https://buy.stripe.com/8x29AS5R390e12W2ri3Ru0n" },
      { id: "eichsfeld-lied-standfuss", label: "Mit Standfuß aus Eiche", preis: 15900, stripe: "https://buy.stripe.com/9B67sK6V7b8m3b46Hy3Ru0f" },
      { id: "eichsfeld-lied-staffelei", label: "Mit Staffelei aus Eiche", preis: 16700, stripe: "https://buy.stripe.com/5kQ7sKbbna4ih1U1ne3Ru0g" }
    ]
  },

  deutschland: {
    name: "Deutschland-Relief 2.5D",
    kategorie: "WiNKATO Original",
    personalisierbar: false,
    varianten: [
      { id: "deutschland-2-5d", label: "2.5D Premium", preis: 20700, stripe: "https://buy.stripe.com/3cIbJ093fa4ih1U1ne3Ru0o" },
      { id: "deutschland-rahmen", label: "Mit Rahmen & Pigmentierung", preis: 23900, stripe: "https://buy.stripe.com/7sY00i3IVfoC6ngea03Ru0i" }
    ]
  },

  "eichsfeld-karte": {
    name: "Eichsfeld-Landkarte",
    kategorie: "WiNKATO Original",
    personalisierbar: false,
    varianten: [
      { id: "eichsfeld-karte-wand", label: "Wandversion (eingelassener Aufhänger)", preis: 15100, stripe: "https://buy.stripe.com/7sYeVc2ER1xM6ngc1S3Ru0j" },
      { id: "eichsfeld-karte-standfuss", label: "Mit Standfuß aus Eiche", preis: 15900, stripe: "https://buy.stripe.com/bJecN46V790e9zsfe43Ru0k" },
      { id: "eichsfeld-karte-staffelei", label: "Mit Staffelei aus Eiche", preis: 17500, stripe: "https://buy.stripe.com/6oU4gy93fb8mbHA6Hy3Ru0l" }
    ]
  },

  eichsfeldadler: {
    name: "Eichsfeldadler",
    kategorie: "WiNKATO Premium",
    personalisierbar: false,
    varianten: [
      { id: "eichsfeldadler-standard", label: "Standard", note: "ohne Sockel-Gravur", preis: 31900, stripe: "https://buy.stripe.com/fZu3cu1AN4JY12W9TK3Ru0p" },
      { id: "eichsfeldadler-premium", label: "Premium", note: 'mit Gravur „Landkreis Eichsfeld" im Sockel', preis: 31900, stripe: "https://buy.stripe.com/6oU9AS6V7b8mdPI9TK3Ru0m" }
    ]
  },

  /* ---------------------------------------------- Personalisierte Geschenke */
  brettchen: {
    name: "Individuelles Brettchen",
    kategorie: "Personalisiert",
    personalisierbar: true,
    varianten: [
      { id: "brettchen", label: "1 Stück", preis: 3900, stripe: "https://buy.stripe.com/aFa8wO0wJ3FU6ng0ja3Ru0s" }
    ],
    /* Mengenrabatte laufen bewusst über eine Anfrage – dafür gibt es keine
       fertigen Stripe-Links, und bei Sets stimmt man die Gravuren eh ab. */
    staffel: [
      { menge: 4, preis: 9900 },
      { menge: 6, preis: 14900 },
      { menge: 10, preis: 19900 }
    ]
  },

  pizzabrett: {
    name: 'Pizzabrett „La Famiglia"',
    kategorie: "Personalisiert",
    personalisierbar: true,
    varianten: [
      { id: "pizzabrett", label: "Pizzabrett mit Wunschgravur", preis: 6900, stripe: "https://buy.stripe.com/fZu9AS7Zb6S6h1Ufe43Ru0r" }
    ]
  },

  schneidebrett: {
    name: "Schneidebrett in Schweineform",
    kategorie: "Personalisiert",
    personalisierbar: true,
    varianten: [
      { id: "schneidebrett", label: "Schneidebrett mit Wunschgravur", preis: 6400, stripe: "https://buy.stripe.com/cNibJ0frD4JY4f8ea03Ru0q" }
    ]
  },

  hirsch: {
    name: "Hirsch-Wanddeko",
    kategorie: "Personalisiert",
    personalisierbar: true,
    varianten: [
      { id: "hirsch", label: "Hirsch-Wanddeko mit Wunschgravur", preis: 10900, stripe: "https://buy.stripe.com/28EbJ0frD90e3b41ne3Ru0e" }
    ]
  }
};

/* Web3Forms-Key – identisch mit dem Kontaktformular.
   Der Key ist bewusst öffentlich, er nimmt nur Formulare entgegen. */
window.WINKATO_FORM_KEY = "f6ae32e0-1616-4e57-936d-9212a201fc39";
