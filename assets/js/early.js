/* ==========================================================================
   early.js – läuft sofort im <head>, BEVOR die Seite gezeichnet wird.
   Setzt gespeicherten Farbmodus, Akzentfarbe und Sprache, damit nichts
   kurz falsch aufblitzt. Keine Cookies, nur localStorage im Browser.
   ========================================================================== */
(function () {
  var html = document.documentElement;
  html.classList.add("js");

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // Farbmodus: nur setzen, wenn der Besucher selbst gewählt hat.
  // Sonst gilt automatisch die Systemeinstellung (prefers-color-scheme).
  var theme = read("fw-theme");
  if (theme === "light" || theme === "dark") html.setAttribute("data-theme", theme);

  // Akzentfarbe
  var accent = read("fw-accent");
  if (accent) html.setAttribute("data-accent", accent);

  // Sprache: gespeicherte Wahl, sonst Browsersprache (Deutsch -> de, sonst en)
  var lang = read("fw-lang");
  if (lang !== "de" && lang !== "en") {
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "de";
    lang = /^de\b/i.test(nav) ? "de" : "en";
  }
  html.setAttribute("data-lang", lang);

  // Die Seiten sind auf Deutsch geschrieben. Für Englisch kurz ausblenden,
  // bis main.js die Übersetzung eingesetzt hat (spätestens nach 1,5 s zeigen).
  if (lang !== "de") {
    html.classList.add("i18n-loading");
    setTimeout(function () { html.classList.remove("i18n-loading"); }, 1500);
  }
})();
