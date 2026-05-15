# SlideForge (Slidebuilder-v2)

Browserbasiertes Tool, das Inhalte in das Design einer hochgeladenen PowerPoint-Vorlage rendert statt ein generisches Foliendesign darüberzustülpen.

## Start

```bash
npm install
npm run dev
```

Danach läuft die App lokal unter `http://localhost:5173`. Es gibt kein Backend; Parsing, Mapping und Rendering passieren im Browser.

## App verwenden

SlideForge ist für den praktischen Ablauf gebaut: PowerPoint-Master hochladen, eine passende React-Slide auswählen, sie in die echte Placeholder-Geometrie der Vorlage einpassen und das Ergebnis als Bild exportieren.

1. **PPTX-Vorlage hochladen**: Lade eine `.pptx` per Drag & Drop oder Dateidialog hoch. SlideForge liest Master, Layouts, Placeholder, Farben und Schriften lokal im Browser aus.
2. **Master und Layout wählen**: Wähle im rechten Panel unter `PPTX-Struktur` die aktive Vorlage, den Folienmaster und das Layout.
3. **Projekt oder Repo-Folie wählen**: Wähle unter `Projekt & Folien` einen Projekt- oder Repo-Ordner und lade eine vorhandene Slide oder eine zentrale Vorlage.
4. **Bereiche und Inhalte prüfen**: Ordne CodeSlide-Slots den PowerPoint-Bereichen zu, blende unnötige Placeholder aus und markiere Inhalte oder Elemente gezielt auf der Folie.
5. **Prompt nutzen und exportieren**: Kopiere Feedback als Kontext-Prompt für Claude, Copilot oder Codex. Nach der Umsetzung exportierst du die sichtbare Folie über `Als PNG exportieren`.

Hochgeladene Vorlagen, Projektmetadaten und Brand Guides werden lokal im Browser gespeichert. Ein echter Projektordner wird nur verknüpft, wenn der Browser den Dateisystemzugriff unterstützt und du die Berechtigung erteilst.

## Export

Der sichtbare Export in der App ist aktuell PNG. Der Button `Als PNG exportieren` rendert die aktive Folie in hoher Auflösung aus der aktuellen Canvas-Ansicht. Ein vollständiger PPTX-Re-Export ist nicht der primäre UI-Flow dieser Version.

## Mit KI-Agenten arbeiten

Die App erzeugt Kontext-Prompts mit Master, Layout, Theme-Variablen, Placeholder-Geometrie, markierten Elementen und deinem Kommentar. Diese Prompts sind für Claude, GitHub Copilot oder OpenAI Codex gedacht und sollen CodeSlide-Änderungen im Repo präzise anstoßen.

### Claude Code

**Was tippst du:** `/create-slide <Brief>` oder eine direkte Arbeitsanweisung im Repo.

**Was passiert:** Claude lädt den Template-Kontext, lockt den Brief und arbeitet die Rollenfolge aus `docs/roles/` ab. Bei Fehlern läuft der definierte Loop-back-Pfad.

### GitHub Copilot

**Was tippst du:** den Prompt `/create-slide` oder den aus SlideForge kopierten Kontext im Copilot-Chat.

**Was passiert:** Copilot nutzt die Chatmodes und Prompts unter `.github/`, liest aber dieselben kanonischen Specs wie die anderen Plattformen.

### OpenAI Codex

**Was tippst du:** eine Anweisung wie `Befolge docs/skills/create-slide.md für diesen Brief: ...`.

**Was passiert:** Codex liest `AGENTS.md`, `docs/skills/*.md` und `docs/roles/*.md` direkt und setzt Änderungen im Repo um.

## Professionelle Folien erstellen

SlideForge ist kein allgemeines Design-Tool. Das Ziel ist enger: Inhalte sollen innerhalb der visuellen Identität des hochgeladenen PowerPoint-Masters entstehen. Farben, Typografie, Seitenverhältnis und Placeholder-Geometrie kommen aus der Vorlage. Neue Slides müssen sich so verhalten, als wären sie für genau diese Masterfolie entworfen worden.

Für Agenten-gestützte Slide-Erstellung gilt deshalb das Arbeitsmodell einer Präsentations-Agentur: 6 Rollen, 4 Phasen, klare Qualitätsgates.

### Die 6 Rollen

| Rolle | Aufgabe |
|---|---|
| Project Manager | Lockt den Brief, verwaltet den Prozess, zieht bei Unklarheit oder Loop 3 die Reißleine. |
| Content Strategist | Formt aus dem Brief eine belastbare Narrative mit Action Title, SCQA und MECE-Logik. |
| Visual Designer | Wählt die passende CodeSlide, mapped Slots und hält kognitive Last sowie Placeholder-Fit im Griff. |
| Illustrator | Sorgt für Fokuspunkt, visuelle Metapher und eine nicht-generische Bildsprache. |
| Brand Guardian | Erzwingt den Theme Contract: nur `var(--slide-*)`, keine harten Farben, keine festen Pixelmaße. |
| QA Manager | Prüft die 7-Punkt-QA-Matrix und entscheidet `approve`, `loop_back` oder `escalate`. |

### Die 4 Phasen

1. **Intake & Briefing**: Ziel, Publikum, Kernaussage und technischer Kontext werden geklärt.
2. **Concept & Storyboard**: Aussage, Action Title, Slide-Typ, Template und Slot-Mapping werden festgelegt.
3. **Design & Production**: Visuelle Dramaturgie, Theme Contract, Brand Guide und Placeholder-Fit werden geprüft.
4. **QA & Delivery**: Die 7-Punkt-QA-Matrix entscheidet über Freigabe, Loop-back oder Eskalation.

### Methoden

- **Pyramid Principle**: Antwort zuerst, Begründung danach.
- **MECE**: Argumente dürfen sich nicht überlappen und müssen die Aussage gemeinsam tragen.
- **SCQA**: Situation, Komplikation, Frage, Antwort als Kontext-Gerüst für erklärungsbedürftige Slides.
- **Action Titles**: Überschriften sind Aussagen, keine Themenetiketten.
- **Duarte-Kontrast**: "Was ist" gegen "was sein könnte" setzen, wenn narrative Spannung nötig ist.
- **QA-Matrix**: Alignment, Farbkonsistenz, Datenkorrektheit, Placeholder-Fit, technische Präzision, Markenkonformität und "so what".

## Folienmaster und Brand Guide

Neue Folienmaster kommen durch Upload einer weiteren `.pptx` in die App. Theme, Layouts und Placeholder werden automatisch aus der Datei extrahiert. Der Bereich `Brand Guide` im rechten Panel speichert zusätzliche Markenregeln pro Vorlage und Master, damit KI-Agenten nicht nur die PowerPoint-Farben, sondern auch die gewünschte Markeninterpretation kennen.

## Weiterlesen

- `AGENTS.md` für den vollständigen Theme Contract, das Slot-System und den teamweiten Prozess.
- `docs/skills/create-slide.md` für die kanonische Orchestrierung.
- `docs/roles/*.md` für die einzelnen Rollen-Specs.
- `docs/slide-patterns.md` für freigegebene dichte Folienmuster und Anti-Patterns.
