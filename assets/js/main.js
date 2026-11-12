/* ==========================================================================
   main.js – alles Interaktive der Seite
   --------------------------------------------------------------------------
   Inhalt:
     1. Einstellungen (Akzentfarben, Navigation)       <- hier anpassen
     2. Kopf- und Fußzeile (werden auf jeder Seite gleich eingesetzt)
     3. Sprache (DE / EN) mit lang/de.json und lang/en.json
     4. Farbmodus (hell / dunkel) und Akzentfarbe
     5. Mobiles Menü, Kopfzeile beim Scrollen
     6. Einblenden beim Scrollen, Zeitleiste
     7. Uhrzeit in Wien
     8. Projektfilter
     9. Kontaktformular (Formspree)
   ========================================================================== */
(function () {
  "use strict";

  /* 1. EINSTELLUNGEN ----------------------------------------------------- */

  // Akzentfarben für die Auswahl in der Fußzeile.
  // "value" muss zu [data-accent="…"] in assets/css/style.css passen.
  var ACCENTS = [
    { value: "terra",  key: "accent.terra",  label: "Terrakotta" },
    { value: "olive",  key: "accent.olive",  label: "Olivgrün" },
    { value: "petrol", key: "accent.petrol", label: "Petrol" },
    { value: "plum",   key: "accent.plum",   label: "Pflaume" }
  ];

  // Hauptnavigation: Seite (data-page im <body>), Datei, Übersetzungsschlüssel, deutscher Text
  var NAV = [
    { page: "ueber-mich", href: "ueber-mich.html", key: "nav.about",    label: "Über mich" },
    { page: "projekte",   href: "projekte.html",   key: "nav.projects", label: "Projekte" },
    { page: "werdegang",  href: "werdegang.html",  key: "nav.cv",       label: "Werdegang" },
    { page: "kontakt",    href: "kontakt.html",    key: "nav.contact",  label: "Kontakt" }
  ];

  var html = document.documentElement;
  // Relativer Pfad zum Hauptordner ("" auf Hauptseiten, "../" in Unterordnern).
  var ROOT = html.getAttribute("data-root") || "";
  var PAGE = document.body.getAttribute("data-page") || "";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* privater Modus o. ä. */ }
  }


  /* 2. KOPF- UND FUSSZEILE ------------------------------------------------ */

  var ICONS = {
    moon: '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>',
    sun: '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>'
  };

  function renderHeader() {
    var el = document.getElementById("site-header");
    if (!el) return;
    var links = NAV.map(function (item) {
      var current = PAGE === item.page ? ' aria-current="page"' : "";
      return '<li><a href="' + ROOT + item.href + '"' + current + ' data-i18n="' + item.key + '">' + item.label + "</a></li>";
    }).join("");

    el.className = "site-header";
    el.innerHTML =
      '<div class="container header-inner">' +
        '<a class="logo" href="' + ROOT + 'index.html" aria-label="Felix Werthner – Startseite" data-i18n-attr="aria-label:header.homeLabel">Felix Werthner<span class="logo-dot" aria-hidden="true"></span></a>' +
        '<nav class="main-nav" id="main-nav" aria-label="Hauptnavigation" data-i18n-attr="aria-label:header.navLabel"><ul>' + links + "</ul></nav>" +
        '<div class="header-tools">' +
          '<button class="tool-btn lang-btn" type="button" id="lang-toggle" aria-label="Sprache wechseln / Change language"><span lang="de">DE</span>/<span lang="en">EN</span></button>' +
          '<button class="tool-btn theme-btn" type="button" id="theme-toggle" aria-label="Hell oder dunkel umschalten" data-i18n-attr="aria-label:header.theme">' + ICONS.moon + ICONS.sun + "</button>" +
          '<button class="tool-btn menu-btn" type="button" id="menu-toggle" aria-expanded="false" aria-controls="main-nav">' + ICONS.menu + '<span data-i18n="header.menu">Menü</span></button>' +
        "</div>" +
      "</div>";
  }

  function renderFooter() {
    var el = document.getElementById("site-footer");
    if (!el) return;
    var swatches = ACCENTS.map(function (a) {
      return '<button type="button" class="accent-swatch" data-accent-value="' + a.value + '" aria-pressed="false" aria-label="' + a.label + '" title="' + a.label + '" data-i18n-attr="aria-label:' + a.key + ';title:' + a.key + '"></button>';
    }).join("");

    el.className = "site-footer";
    el.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="stack" style="gap:.6rem">' +
            '<span class="footer-name">Felix Werthner</span>' +
            '<p data-i18n="footer.tagline">Webseiten, die sich warm anfühlen und gut funktionieren.</p>' +
            '<p><span data-i18n="footer.timeLabel">In Wien ist es gerade</span> <time class="vienna-time" id="vienna-time">--:--</time>.</p>' +
          "</div>" +
          "<div>" +
            '<span class="footer-label" data-i18n="footer.pages">Seiten</span>' +
            "<ul>" +
              '<li><a href="' + ROOT + 'index.html" data-i18n="nav.home">Start</a></li>' +
              NAV.map(function (item) { return '<li><a href="' + ROOT + item.href + '" data-i18n="' + item.key + '">' + item.label + "</a></li>"; }).join("") +
            "</ul>" +
          "</div>" +
          "<div>" +
            '<span class="footer-label" id="accent-label" data-i18n="footer.accent">Lieblingsfarbe wählen</span>' +
            '<div class="accent-picker" role="group" aria-labelledby="accent-label">' + swatches + "</div>" +
            '<p style="margin-top:.8rem" data-i18n="footer.accentHint">Die Seite merkt sich deine Wahl, nur in deinem Browser.</p>' +
          "</div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          '<span>© <span id="year"></span> Felix Werthner</span>' +
          '<span><a href="' + ROOT + 'impressum.html" data-i18n="nav.imprint">Impressum</a> · <a href="' + ROOT + 'datenschutz.html" data-i18n="nav.privacy">Datenschutz</a></span>' +
        "</div>" +
      "</div>";

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  renderHeader();
  renderFooter();


  /* 3. SPRACHE ------------------------------------------------------------ */

  var dict = {};           // aktuell geladene Texte
  var cache = {};          // bereits geladene Sprachdateien

  // Text zu einem Schlüssel holen (mit Ersatztext, falls er fehlt)
  function t(key, fallback) {
    return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : fallback;
  }

  function loadLang(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch(ROOT + "lang/" + lang + ".json", { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(function (data) { cache[lang] = data; return data; });
  }

  // Alle Texte der Seite in der gewählten Sprache einsetzen
  function applyTranslations(data) {
    dict = data;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = data[el.getAttribute("data-i18n")];
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = data[el.getAttribute("data-i18n-html")];
      if (typeof v === "string") el.innerHTML = v;
    });
    // Format: data-i18n-attr="attribut:schluessel;attribut2:schluessel2"
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        var v = data[(parts[1] || "").trim()];
        if (parts[0] && typeof v === "string") el.setAttribute(parts[0].trim(), v);
      });
    });
    // Hinweis "deutsche Fassung ist maßgeblich" nur zeigen, wenn er Text hat (Englisch)
    document.querySelectorAll('[data-i18n="legal.enNotice"]').forEach(function (el) {
      el.hidden = !el.textContent.trim();
    });
  }

  function setLang(lang, save) {
    html.setAttribute("data-lang", lang);
    html.setAttribute("lang", lang);
    if (save) store("fw-lang", lang);
    updateLangButton(lang);
    return loadLang(lang)
      .then(applyTranslations)
      .catch(function (err) {
        // Passiert z. B., wenn die Seite direkt als Datei (file://) geöffnet wird.
        console.warn("Übersetzung konnte nicht geladen werden:", err);
      })
      .then(function () {
        html.classList.remove("i18n-loading");
        updateClock();
        updateFilterStatus();
      });
  }

  function updateLangButton(lang) {
    var btn = document.getElementById("lang-toggle");
    if (!btn) return;
    btn.querySelectorAll("span").forEach(function (s) {
      s.setAttribute("aria-current", s.getAttribute("lang") === lang ? "true" : "false");
    });
  }

  var langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      setLang(html.getAttribute("data-lang") === "de" ? "en" : "de", true);
    });
  }


  /* 4. FARBMODUS & AKZENTFARBE ------------------------------------------- */

  function isDark() {
    var set = html.getAttribute("data-theme");
    if (set) return set === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    var syncThemeBtn = function () { themeBtn.setAttribute("aria-pressed", isDark() ? "true" : "false"); };
    syncThemeBtn();
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      html.setAttribute("data-theme", next);
      store("fw-theme", next);
      syncThemeBtn();
    });
  }

  function setAccent(value, save) {
    if (value === "terra") html.removeAttribute("data-accent");
    else html.setAttribute("data-accent", value);
    if (save) store("fw-accent", value);
    document.querySelectorAll(".accent-swatch").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-accent-value") === value ? "true" : "false");
    });
  }
  setAccent(html.getAttribute("data-accent") || "terra", false);
  document.querySelectorAll(".accent-swatch").forEach(function (b) {
    b.addEventListener("click", function () { setAccent(b.getAttribute("data-accent-value"), true); });
  });


  /* 5. MENÜ & KOPFZEILE -------------------------------------------------- */

  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.getElementById("main-nav");
  if (menuBtn && nav) {
    var closeMenu = function () {
      nav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    };
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { closeMenu(); menuBtn.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 832) closeMenu(); });
  }

  var header = document.getElementById("site-header");
  function onScrollHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();


  /* 6. EINBLENDEN & ZEITLEISTE ------------------------------------------- */

  var reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Die farbige Linie der Zeitleiste wächst mit dem Scrollen mit.
  var timeline = document.querySelector(".timeline");
  if (timeline && !reduceMotion) {
    var ticking = false;
    var drawTimeline = function () {
      var rect = timeline.getBoundingClientRect();
      var start = window.innerHeight * 0.7;
      var progress = (start - rect.top) / rect.height;
      progress = Math.max(0, Math.min(1, progress));
      timeline.style.setProperty("--progress", progress.toFixed(3));
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(drawTimeline); }
    }, { passive: true });
    window.addEventListener("resize", drawTimeline);
    drawTimeline();
  }


  /* 7. UHRZEIT IN WIEN ---------------------------------------------------- */

  function updateClock() {
    var el = document.getElementById("vienna-time");
    if (!el) return;
    var now = new Date();
    var lang = html.getAttribute("data-lang") === "en" ? "en-GB" : "de-AT";
    try {
      el.textContent = new Intl.DateTimeFormat(lang, {
        hour: "2-digit", minute: "2-digit", timeZone: "Europe/Vienna"
      }).format(now);
      el.setAttribute("datetime", now.toISOString());
    } catch (e) { el.textContent = ""; }
  }
  updateClock();
  setInterval(updateClock, 30000);


  /* 8. PROJEKTFILTER ------------------------------------------------------ */

  var filterBtns = document.querySelectorAll("[data-filter]");
  var cards = document.querySelectorAll("[data-category]");
  var currentFilter = "alle";

  function updateFilterStatus() {
    var status = document.getElementById("filter-status");
    if (!status) return;
    var count = 0;
    cards.forEach(function (c) { if (!c.hidden) count++; });
    status.textContent = t("projects.filterStatus", "{n} Projekte sichtbar").replace("{n}", count);
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentFilter = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      cards.forEach(function (card) {
        var cats = card.getAttribute("data-category").split(" ");
        card.hidden = !(currentFilter === "alle" || cats.indexOf(currentFilter) !== -1);
        if (!card.hidden) card.classList.add("is-visible");
      });
      updateFilterStatus();
    });
  });


  /* 9. KONTAKTFORMULAR --------------------------------------------------- */
  // Die Formspree-ID steht in kontakt.html im action-Attribut des Formulars.

  var form = document.getElementById("contact-form");
  if (form) {
    var statusBox = document.getElementById("form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    var showStatus = function (state, text) {
      statusBox.setAttribute("data-state", state);
      statusBox.textContent = text;
      statusBox.focus();
    };

    var setError = function (field, message) {
      var wrap = field.closest(".field, .check-wrap");
      var out = wrap && wrap.querySelector(".field-error");
      if (message) {
        if (wrap) wrap.setAttribute("data-invalid", "");
        field.setAttribute("aria-invalid", "true");
      } else {
        if (wrap) wrap.removeAttribute("data-invalid");
        field.removeAttribute("aria-invalid");
      }
      if (out) out.textContent = message || "";
    };

    var validate = function (field) {
      var v = field.type === "checkbox" ? field.checked : field.value.trim();
      if (field.required && !v) {
        setError(field, field.type === "checkbox"
          ? t("contact.err.consent", "Bitte bestätige, dass du die Datenschutzerklärung gelesen hast.")
          : t("contact.err.required", "Bitte fülle dieses Feld aus."));
        return false;
      }
      if (field.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        setError(field, t("contact.err.email", "Diese E-Mail-Adresse sieht nicht ganz richtig aus."));
        return false;
      }
      setError(field, "");
      return true;
    };

    var fields = form.querySelectorAll("input[required], textarea[required], input[type=email]");
    fields.forEach(function (f) {
      f.addEventListener("blur", function () { if (f.value || f.type === "checkbox") validate(f); });
      f.addEventListener("input", function () { if (f.getAttribute("aria-invalid")) validate(f); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var firstInvalid = null;
      fields.forEach(function (f) { if (!validate(f) && !firstInvalid) firstInvalid = f; });
      if (firstInvalid) { firstInvalid.focus(); return; }

      // Honeypot ausgefüllt? Dann ist es sehr wahrscheinlich ein Bot.
      var hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) { form.reset(); showStatus("success", t("contact.success", "Danke für deine Nachricht!")); return; }

      // Noch keine Formspree-ID eingetragen?
      if (form.action.indexOf("PLATZHALTER") !== -1 || form.action.indexOf("%5BPLATZHALTER") !== -1) {
        showStatus("error", t("contact.notConfigured", "Das Formular ist noch nicht eingerichtet. Schreib mir bitte direkt per E-Mail."));
        return;
      }

      submitBtn.disabled = true;
      showStatus("info", t("contact.sending", "Wird gesendet …"));

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        showStatus("success", t("contact.success", "Danke für deine Nachricht! Ich melde mich so bald wie möglich bei dir."));
      }).catch(function () {
        showStatus("error", t("contact.error", "Das hat leider nicht geklappt. Bitte versuch es später noch einmal oder schreib mir direkt per E-Mail."));
      }).then(function () {
        submitBtn.disabled = false;
      });
    });
  }


  /* START ---------------------------------------------------------------- */
  // Texte immer aus der Sprachdatei laden, damit Änderungen in lang/*.json
  // auch für Deutsch sofort sichtbar sind.
  setLang(html.getAttribute("data-lang") || "de", false);
})();
