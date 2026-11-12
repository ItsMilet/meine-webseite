# Meine Webseite

Persönliche Webseite von Felix Werthner: wer ich bin, mein Werdegang, meine Projekte und ein Weg zum Kontakt.

- Live: https://itsmilet.github.io/meine-webseite/
- Technik: reines HTML, CSS und JavaScript. Kein Framework, kein Build-Schritt, keine Cookies, kein Tracking.
- Alle noch zu ersetzenden Inhalte stehen in [`PLATZHALTER.md`](PLATZHALTER.md).

## Ordner

| Pfad | Inhalt |
|---|---|
| `*.html` | die Seiten (Start, Über mich, Projekte, Werdegang, Kontakt, Impressum, Datenschutz, 404) |
| `projekte/projekt-vorlage.html` | Vorlage für eine Projekt-Detailseite |
| `lang/de.json`, `lang/en.json` | **alle Texte** auf Deutsch und Englisch |
| `assets/css/style.css` | Gestaltung, Farben, Schriften |
| `assets/js/early.js` | setzt Farbmodus, Akzentfarbe und Sprache, bevor die Seite erscheint |
| `assets/js/main.js` | Kopf- und Fußzeile, Sprache, Hell/Dunkel, Animationen, Filter, Formular |
| `assets/fonts/` | selbst gehostete Schriften (Fraunces, Source Sans 3, Caveat) |
| `assets/img/` | Bilder, Favicon, Vorschaubild für soziale Netzwerke (`og-bild.png`) |
| `assets/docs/` | Lebenslauf als PDF |

## Seite lokal ansehen

Die Texte werden aus `lang/*.json` geladen. Das klappt nicht, wenn du eine HTML-Datei per Doppelklick öffnest (`file://`), dann siehst du nur die deutschen Grundtexte. Starte stattdessen einen kleinen Server im Ordner, zum Beispiel:

```bash
npx serve .
```

oder in VS Code mit der Erweiterung „Live Server“.

## Texte ändern

1. Öffne `lang/de.json` (Deutsch) und `lang/en.json` (Englisch).
2. Suche den Text, den du ändern willst, und ersetze ihn. Der Schlüssel links (z. B. `"home.hero.lead"`) bleibt gleich.
3. Ändere immer beide Sprachen.

Gut zu wissen:

- Im HTML steht der deutsche Text noch einmal. Er dient nur Suchmaschinen und Browsern ohne JavaScript. Wenn du einen Text änderst, passe ihn am besten auch dort an (Suche nach dem Schlüssel, z. B. `data-i18n="home.hero.lead"`).
- Manche Texte enthalten HTML, etwa `<em>…</em>` für das farbige, kursive Wort in Überschriften. Das steht bei Schlüsseln, die im HTML mit `data-i18n-html` markiert sind.
- Navigation und Fußzeile stehen in `assets/js/main.js` (Abschnitt 1 und 2). Die Texte dafür kommen ebenfalls aus den JSON-Dateien (`nav.…`, `footer.…`).
- Neue Projekte: in `projekte.html` eine Projektkarte (`<li class="project-card">`) kopieren. Für die Detailseite `projekte/projekt-vorlage.html` kopieren und umbenennen. Die Anleitung steht oben in den Dateien.
- Neue Station im Werdegang: in `werdegang.html` ein `<li class="timeline-item">` kopieren.
- Für neue Texte einen neuen Schlüssel ausdenken, im HTML als `data-i18n="mein.schluessel"` eintragen und in beiden JSON-Dateien ergänzen.

## Farben ändern

Alle Farben stehen ganz oben in `assets/css/style.css` im Abschnitt **2. FARBEN & DESIGN-VARIABLEN**:

- `:root { … }` enthält die hellen Farben (`--paper` Hintergrund, `--ink` Text, `--sand` Flächen, `--line` Linien, `--muted` Nebentext).
- Die dunklen Farben stehen zweimal darunter (einmal für die Systemeinstellung, einmal für den Schalter). Ändere immer beide Blöcke gleich.
- Akzentfarben haben eine helle (`-l`) und eine dunkle (`-d`) Variante, z. B. `--terra-l` und `--terra-d`. Achte auf genug Kontrast: die helle Variante muss auf Creme gut lesbar sein, die dunkle auf Anthrazit.

**Neue Akzentfarbe für die Auswahl in der Fußzeile:**

1. In `style.css` zwei Variablen anlegen, z. B. `--ocker-l: #8A5A12; --ocker-d: #E2B266;`
2. Darunter eine Zeile wie bei den anderen ergänzen: `[data-accent="ocker"] { --accent-l: var(--ocker-l); --accent-d: var(--ocker-d); }`
3. Bei `.accent-swatch[data-accent-value="…"]` eine Zeile für die Farbe des Knopfes ergänzen.
4. In `assets/js/main.js` in der Liste `ACCENTS` einen Eintrag hinzufügen und in beiden JSON-Dateien den Namen (`accent.ocker`).

Die Standardfarbe ist Terrakotta. Sie gilt, solange ein Besucher nichts anderes wählt.

## Bilder ändern

Bildplatzhalter sind gestaltete Flächen mit der Beschriftung, welches Bild in welcher Größe dort hingehört. Direkt darüber steht jeweils ein Kommentar `<!-- BILD ERSETZEN: … -->`.

1. Bild verkleinern (z. B. auf die angegebene Größe) und als `.jpg` oder `.webp` in `assets/img/` speichern.
2. Den ganzen `<div class="ph-img" …>…</div>` durch ein Bild ersetzen:

   ```html
   <img src="assets/img/felix-portrait.jpg" alt="Felix Werthner lacht in die Kamera" width="1200" height="1500" loading="lazy">
   ```

   Auf der Startseite beim ersten Bild `loading="lazy"` weglassen, damit es sofort lädt.
   In `projekte/` beginnt der Pfad mit `../`, also `../assets/img/…`.
3. Einen kurzen, beschreibenden Alt-Text schreiben (wichtig für Menschen mit Screenreadern).

Weitere Bilder:

- `assets/img/og-bild.png` (1200 × 630 px): Vorschaubild, wenn jemand den Link teilt.
- `assets/img/favicon.svg` und `apple-touch-icon.png`: Symbol im Browser-Tab und auf dem Handy.
- `assets/docs/lebenslauf-felix-werthner.pdf`: einfach durch deinen echten Lebenslauf mit gleichem Namen ersetzen.

## Formspree-ID eintragen (Kontaktformular)

1. Auf https://formspree.io ein kostenloses Konto anlegen und ein neues Formular erstellen.
2. Formspree zeigt eine Adresse wie `https://formspree.io/f/abcdwxyz`. Der letzte Teil (`abcdwxyz`) ist deine ID.
3. In `kontakt.html` nach `FORMSPREE-ID HIER EINTRAGEN` suchen und im `action`-Attribut `[PLATZHALTER: Formspree-ID]` durch deine ID ersetzen:

   ```html
   <form id="contact-form" class="form" action="https://formspree.io/f/abcdwxyz" method="POST" novalidate>
   ```

4. Einmal eine Testnachricht schicken und bei Formspree bestätigen.

Solange keine ID eingetragen ist, zeigt das Formular einen freundlichen Hinweis und verschickt nichts. Spam-Schutz läuft über ein unsichtbares Feld (`_gotcha`), das Formspree automatisch erkennt.

## Veröffentlichen

Die Seite läuft über GitHub Pages aus dem Zweig `main`. Jede Änderung, die nach `main` gepusht wird, ist nach ein bis zwei Minuten online.

Alle Links und Pfade sind relativ, damit die Seite im Unterordner `/meine-webseite/` funktioniert. Neue Links bitte auch relativ schreiben (`kontakt.html`, nicht `/kontakt.html`).

Hinweise zu Suchmaschinen: `sitemap.xml` listet alle Seiten (bei neuen Seiten ergänzen). `robots.txt` wirkt erst, wenn die Seite einmal unter einer eigenen Domain läuft; im Unterordner von GitHub Pages lesen Suchmaschinen sie nicht.
