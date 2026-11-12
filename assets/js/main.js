/* ==========================================================================
   WiNKATO – Interaktion
   Navigation · Galerien · Lightbox · Kauf-Dialog · Formulare
   Kein Framework, keine externen Abhängigkeiten.
   ========================================================================== */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const euro = (cents) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);

  /* ------------------------------------------------------- Navigation */

  const initNav = () => {
    const toggle = $(".nav-toggle");
    const nav = $("#hauptnavigation");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.dataset.open = String(open);
      document.body.classList.toggle("no-scroll", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Nach Klick auf einen Link schließen (wichtig bei Anker-Links auf derselben Seite)
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Beim Wechsel auf Desktop-Breite den mobilen Zustand zurücksetzen
    const mq = window.matchMedia("(min-width: 901px)");
    mq.addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });
  };

  /* --------------------------------------------------------- Galerien */

  const initGalleries = () => {
    $$("[data-gallery]").forEach((gallery) => {
      const slides = $$(".gallery__slide", gallery);
      if (slides.length < 2) return;

      const dotsWrap = $(".gallery__dots", gallery);
      let index = slides.findIndex((s) => s.hasAttribute("data-active"));
      if (index < 0) index = 0;

      const dots = slides.map((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gallery__dot";
        dot.setAttribute("aria-label", `Bild ${i + 1} von ${slides.length}`);
        dot.addEventListener("click", () => show(i));
        dotsWrap?.appendChild(dot);
        return dot;
      });

      function show(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach((slide, i) => {
          slide.toggleAttribute("data-active", i === index);
          // Erst beim Anzeigen laden – spart Bandbreite bei 4 Bildern pro Karte
          if (i === index && slide.dataset.src) {
            slide.src = slide.dataset.src;
            delete slide.dataset.src;
          }
        });
        dots.forEach((dot, i) => dot.toggleAttribute("data-active", i === index));
      }

      $(".gallery__btn--prev", gallery)?.addEventListener("click", () => show(index - 1));
      $(".gallery__btn--next", gallery)?.addEventListener("click", () => show(index + 1));

      // Wischen auf dem Handy
      let startX = null;
      gallery.addEventListener("pointerdown", (e) => { startX = e.clientX; });
      gallery.addEventListener("pointerup", (e) => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 45) show(dx < 0 ? index + 1 : index - 1);
        startX = null;
      });

      show(index);
    });
  };

  /* -------------------------------------------------------- Lightbox */

  const initLightbox = () => {
    const box = $("#lightbox");
    if (!box) return;
    const img = $("img", box);
    let lastFocus = null;
    let bilder = [];   // [{ src, fallback, alt }]
    let nr = 0;

    // Bild-Quellen der Galerie in Vollansicht (-640.webp -> -1280.webp)
    const gross = (url) => url.replace(/-640\.webp(\?.*)?$/, "-1280.webp");

    // Pfeile und Zähler einmalig ergänzen
    const prev = document.createElement("button");
    prev.type = "button"; prev.className = "lightbox__nav lightbox__nav--prev";
    prev.setAttribute("aria-label", "Vorheriges Bild"); prev.innerHTML = "&#8249;";
    const next = document.createElement("button");
    next.type = "button"; next.className = "lightbox__nav lightbox__nav--next";
    next.setAttribute("aria-label", "Nächstes Bild"); next.innerHTML = "&#8250;";
    const zaehler = document.createElement("p");
    zaehler.className = "lightbox__count"; zaehler.setAttribute("aria-live", "polite");
    box.append(prev, next, zaehler);

    const zeige = (i) => {
      nr = (i + bilder.length) % bilder.length;
      const b = bilder[nr];
      img.onerror = () => { if (b.fallback && img.src !== b.fallback) img.src = b.fallback; };
      img.src = b.src;
      img.alt = b.alt;
      const mehrere = bilder.length > 1;
      prev.hidden = next.hidden = zaehler.hidden = !mehrere;
      zaehler.textContent = `${nr + 1} / ${bilder.length}`;
    };

    const open = (liste, start, trigger) => {
      bilder = liste;
      lastFocus = trigger;
      zeige(start);
      box.hidden = false;
      document.body.classList.add("no-scroll");
      $(".lightbox__close", box).focus();
    };

    const close = () => {
      box.hidden = true;
      img.src = "";
      document.body.classList.remove("no-scroll");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    // Wischen in der Vollansicht
    let startX = null;
    box.addEventListener("pointerdown", (e) => { startX = e.clientX; });
    box.addEventListener("pointerup", (e) => {
      if (startX === null || bilder.length < 2) { startX = null; return; }
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) { box.dataset.gewischt = "1"; zeige(nr + (dx < 0 ? 1 : -1)); }
    });

    // Galerie-Bilder: Wischen in der Karte darf keine Vollansicht auslösen
    let galerieStart = null;
    document.addEventListener("pointerdown", (e) => { galerieStart = e.clientX; }, true);

    document.addEventListener("click", (e) => {
      if (!box.hidden) {
        if (box.dataset.gewischt) { delete box.dataset.gewischt; return; }
        const pfeil = e.target.closest(".lightbox__nav");
        if (pfeil) { zeige(nr + (pfeil.classList.contains("lightbox__nav--next") ? 1 : -1)); return; }
        if (e.target.closest("#lightbox")) close();
        return;
      }

      const folie = e.target.closest(".gallery__slide");
      if (folie) {
        if (galerieStart !== null && Math.abs(e.clientX - galerieStart) > 12) return; // war ein Wisch
        const galerie = folie.closest("[data-gallery]");
        const slides = galerie ? $$(".gallery__slide", galerie) : [folie];
        const liste = slides.map((sl) => {
          const klein = sl.dataset.src || sl.currentSrc || sl.src;
          return { src: gross(klein), fallback: klein, alt: sl.alt };
        });
        // Die Bilder liegen übereinander: gemeint ist immer das gerade sichtbare
        const aktiv = slides.findIndex((sl) => sl.hasAttribute("data-active"));
        open(liste, Math.max(0, aktiv >= 0 ? aktiv : slides.indexOf(folie)), folie);
        return;
      }

      const trigger = e.target.closest("[data-lightbox]");
      if (trigger) {
        open([{ src: trigger.dataset.lightbox, fallback: "", alt: trigger.dataset.lightboxAlt || "" }], 0, trigger);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight" && bilder.length > 1) zeige(nr + 1);
      else if (e.key === "ArrowLeft" && bilder.length > 1) zeige(nr - 1);
    });
  };

  /* ------------------------------------------------------ Kauf-Dialog */

  const modal = {
    el: null,
    panel: null,
    lastFocus: null,

    open(html) {
      this.el = $("#kaufdialog");
      this.panel = $(".modal__panel", this.el);
      this.lastFocus = document.activeElement;
      this.panel.innerHTML = html;
      this.el.hidden = false;
      document.body.classList.add("no-scroll");
      // Fokus auf das erste sinnvolle Element setzen
      ($("input:not([type=hidden]), button, textarea", this.panel) || this.panel).focus();
    },

    close() {
      if (!this.el || this.el.hidden) return;
      this.el.hidden = true;
      this.panel.innerHTML = "";
      document.body.classList.remove("no-scroll");
      this.lastFocus?.focus();
    }
  };

  const closeBtn = () =>
    '<button type="button" class="modal__close" data-modal-close aria-label="Dialog schließen">&times;</button>';

  const variantRow = (v, checked) => `
    <label class="option">
      <input type="radio" name="variante" value="${v.id}" data-preis="${v.preis}"${checked ? " checked" : ""}>
      <span>
        <span class="option__name">${v.label}</span>
        ${v.note ? `<span class="option__note">${v.note}</span>` : ""}
      </span>
      <span class="option__price">${euro(v.preis)}</span>
    </label>`;

  /** Kurze, gut vorlesbare Referenz – taucht in Stripe und in der Gravur-Mail auf. */
  const makeRef = () => {
    const chars = "ACDEFGHJKLMNPQRTUVWXY3456789";
    let out = "";
    for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return `WK-${out}`;
  };

  const openBuyDialog = (key) => {
    const product = window.WINKATO_PRODUCTS?.[key];
    if (!product) return;

    const variants = product.varianten;
    const personal = product.personalisierbar;

    const personalFields = `
      <div class="field">
        <label for="gravur">Deine Wunschgravur <span aria-hidden="true">*</span></label>
        <span class="hint" id="gravur-hint">Genau so, wie es später im Holz stehen soll – Groß-/Kleinschreibung inklusive.</span>
        <textarea id="gravur" name="gravur" required aria-describedby="gravur-hint"
                  placeholder="z.&nbsp;B. Familie Müller · seit 2014"></textarea>
      </div>
      <div class="field">
        <label for="kundenmail">Deine E-Mail-Adresse <span aria-hidden="true">*</span></label>
        <span class="hint" id="mail-hint">Damit ich deine Gravur der Zahlung zuordnen kann.</span>
        <input type="email" id="kundenmail" name="email" required aria-describedby="mail-hint"
               autocomplete="email" placeholder="name@beispiel.de">
      </div>`;

    modal.open(`
      ${closeBtn()}
      <h2>${product.name}</h2>
      <p class="modal__sub">${personal ? "Gravur festlegen und direkt bestellen" : "Ausführung wählen und direkt bestellen"}</p>

      <form id="kaufform" novalidate>
        ${variants.length > 1
          ? `<fieldset style="border:0;padding:0;margin:0 0 .5rem">
               <legend class="field"><label>Ausführung wählen</label></legend>
               ${variants.map((v, i) => variantRow(v, i === 0)).join("")}
             </fieldset>`
          : `<input type="hidden" name="variante" value="${variants[0].id}" data-preis="${variants[0].preis}">`}

        ${personal ? personalFields : ""}

        <div class="total">
          <span class="total__label">Gesamtpreis<br><small>inkl. Versand in Deutschland</small></span>
          <span class="total__value" id="summe">${euro(variants[0].preis)}</span>
        </div>

        <p class="legal-note">
          Kleinunternehmer gemäß §&nbsp;19 UStG – es wird keine Umsatzsteuer ausgewiesen.
          Lieferzeit 2–3 Wochen, da jedes Stück einzeln gefertigt wird.
          ${personal
            ? 'Bei individuell gravierten Anfertigungen besteht nach §&nbsp;312g Abs.&nbsp;2 Nr.&nbsp;1 BGB kein Widerrufsrecht.'
            : 'Es gilt das gesetzliche <a href="widerruf.html">Widerrufsrecht</a>.'}
        </p>

        <p class="form__status" id="kaufstatus" data-state="error" hidden></p>
        <button type="submit" class="btn btn--primary btn--block">Weiter zur sicheren Bezahlung</button>
        <p class="legal-note" style="margin:.9rem 0 0;text-align:center">
          Bezahlung über Stripe · Karte, PayPal, Klarna
        </p>
      </form>`);

    const form = $("#kaufform");
    const summe = $("#summe");
    const status = $("#kaufstatus");

    const selected = () => form.querySelector('[name="variante"]:checked') || form.querySelector('[name="variante"]');

    form.addEventListener("change", () => {
      summe.textContent = euro(Number(selected().dataset.preis));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const variant = variants.find((v) => v.id === selected().value);
      if (!variant) return;

      const btn = $("button[type=submit]", form);
      status.hidden = true;

      if (!personal) {
        window.location.href = variant.stripe;
        return;
      }

      const gravur = $("#gravur", form).value.trim();
      const email = $("#kundenmail", form).value.trim();

      if (!gravur || !email) {
        status.textContent = "Bitte Gravur und E-Mail-Adresse ausfüllen.";
        status.dataset.state = "error";
        status.hidden = false;
        return;
      }

      btn.disabled = true;
      btn.textContent = "Gravur wird übermittelt …";

      const ref = makeRef();

      // Die Gravur geht per Formular-Mail raus, BEVOR zu Stripe weitergeleitet wird.
      // Stripe selbst transportiert den Text nicht – die Referenz verbindet beides.
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: window.WINKATO_FORM_KEY,
            subject: `Gravur ${ref} – ${product.name}`,
            from_name: "WiNKATO Bestellung",
            Bestellreferenz: ref,
            Produkt: product.name,
            Ausführung: variant.label,
            Preis: euro(variant.preis),
            Wunschgravur: gravur,
            "E-Mail des Kunden": email
          })
        });
        if (!res.ok) throw new Error(String(res.status));
      } catch {
        btn.disabled = false;
        btn.textContent = "Weiter zur sicheren Bezahlung";
        status.innerHTML =
          `Die Gravur konnte nicht übermittelt werden. Bitte schick sie kurz an ` +
          `<a href="mailto:einzigartig@winkato.de">einzigartig@winkato.de</a> – oder versuch es nochmal.`;
        status.dataset.state = "error";
        status.hidden = false;
        return;
      }

      // Referenz und E-Mail an Stripe übergeben, damit Zahlung und Gravur zusammenfinden
      const url = new URL(variant.stripe);
      url.searchParams.set("prefilled_email", email);
      url.searchParams.set("client_reference_id", ref);
      sessionStorage.setItem("winkato-ref", ref);
      window.location.href = url.toString();
    });
  };

  const initBuyDialog = () => {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-buy]");
      if (trigger) {
        e.preventDefault();
        openBuyDialog(trigger.dataset.buy);
        return;
      }
      if (e.target.closest("[data-modal-close]") || e.target.id === "kaufdialog") modal.close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") modal.close();
    });
  };

  /* -------------------------------------------------- Preise ins HTML */

  /** Schreibt „ab“-Preise aus den Produktdaten in die Karten – kein doppelt gepflegter Preis. */
  const initPrices = () => {
    $$("[data-price-from]").forEach((el) => {
      const product = window.WINKATO_PRODUCTS?.[el.dataset.priceFrom];
      if (!product) return;
      const min = Math.min(...product.varianten.map((v) => v.preis));
      el.textContent = euro(min);
    });
  };

  /* ------------------------------------------------- Kontaktformular */

  const initContactForm = () => {
    const form = $("#kontaktformular");
    if (!form) return;
    const status = $("#kontaktstatus", form.parentElement) || $("#kontaktstatus");

    // Vorbelegung über ?thema=... in der URL, z. B. von "Anfrage stellen"-Buttons auf den Themenseiten
    const gewuenschtesThema = new URLSearchParams(location.search).get("thema");
    if (gewuenschtesThema) {
      const select = $("#thema", form);
      const treffer = select && [...select.options].find((o) => o.value === gewuenschtesThema);
      if (treffer) treffer.selected = true;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = $("button[type=submit]", form);
      const original = btn.textContent;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      btn.disabled = true;
      btn.textContent = "Wird gesendet …";
      status.hidden = true;

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form)
        });
        if (!res.ok) throw new Error(String(res.status));
        window.location.href = "danke.html";
      } catch {
        btn.disabled = false;
        btn.textContent = original;
        status.innerHTML =
          `Da ist leider etwas schiefgelaufen. Schreib mir gern direkt an ` +
          `<a href="mailto:einzigartig@winkato.de">einzigartig@winkato.de</a>.`;
        status.dataset.state = "error";
        status.hidden = false;
      }
    });
  };

  /* ------------------------------------------ Videos beim Hinscrollen */

  /** Stumme Loops spielen nur, solange sie sichtbar sind – und gar nicht bei reduzierter Bewegung. */
  const initSichtbarVideos = () => {
    const videos = $$("video[data-abspielen-sichtbar]");
    if (!videos.length || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const beobachter = new IntersectionObserver((eintraege) => {
      eintraege.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) target.play().catch(() => {});
        else target.pause();
      });
    }, { threshold: 0.35 });
    videos.forEach((video) => beobachter.observe(video));
  };

  const weniger_bewegung = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Header: Schatten nach dem ersten Scrollen + feine Lesefortschritts-Linie. */
  const initHeader = () => {
    const header = $(".header");
    if (!header) return;
    let geplant = false;
    const aktualisieren = () => {
      geplant = false;
      const y = window.scrollY;
      header.classList.toggle("header--gescrollt", y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header.style.setProperty("--lesefortschritt", max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    };
    window.addEventListener("scroll", () => {
      if (!geplant) { geplant = true; requestAnimationFrame(aktualisieren); }
    }, { passive: true });
    aktualisieren();
  };

  /** Startseite: der Anlass in der Kopfzeile wechselt ruhig durchs Jahr. */
  const initAnlass = () => {
    const box = $("[data-anlass]");
    if (!box || weniger_bewegung()) return;
    const woerter = $$(".anlass__wort", box);
    if (woerter.length < 2) return;
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      const alt = woerter[i];
      i = (i + 1) % woerter.length;
      alt.classList.remove("is-aktiv");
      alt.classList.add("is-weg");
      woerter[i].classList.remove("is-weg");
      woerter[i].classList.add("is-aktiv");
      setTimeout(() => alt.classList.remove("is-weg"), 600);
    }, 2600);
  };

  /** Inhalte unterhalb des ersten Bildschirms blenden beim Scrollen sanft ein. */
  const initEinblenden = () => {
    if (!("IntersectionObserver" in window) || weniger_bewegung()) return;
    const kandidaten = $$("main .section-head, main .card, main .quote, main .step, main .media, main .faq, main .cta-box")
      .filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.95);
    if (!kandidaten.length) return;
    document.documentElement.classList.add("js-einblenden");
    const beobachter = new IntersectionObserver((eintraege) => {
      eintraege.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add("ist-sichtbar");
        beobachter.unobserve(target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    kandidaten.forEach((el) => {
      el.setAttribute("data-einblenden", "");
      // Geschwister im selben Raster leicht versetzt
      const geschwister = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.transitionDelay = `${Math.min(geschwister, 4) * 70}ms`;
      beobachter.observe(el);
    });
  };

  /* ------------------------------------------------------------ Start */

  const init = () => {
    initNav();
    initHeader();
    initAnlass();
    initEinblenden();
    initGalleries();
    initLightbox();
    initBuyDialog();
    initPrices();
    initContactForm();
    initSichtbarVideos();
    document.documentElement.dataset.js = "on";
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
