# SlideForge (Slidebuilder-v2)

Browserbasiertes Tool, das Inhalte in das Design einer hochgeladenen PowerPoint-Vorlage rendert statt ein generisches Foliendesign darüberzustülpen.

## Start

```bash
npm install
npm run dev
```

Danach läuft die App lokal unter `http://localhost:5173`. Es gibt kein Backend; Parsing, Mapping und Rendering passieren im Browser.

## UI-Verwendung

1. Eine `.pptx` per Drag & Drop oder Dateidialog hochladen.
2. Einen Folienmaster und das passende Layout auswählen.
3. Inhalte im rechten Panel bearbeiten oder einer React-basierten CodeSlide zuordnen.
4. Auf die Folie klicken, einen Kommentar schreiben und den erzeugten Kontext an Claude, Copilot oder Codex weitergeben.
5. Die fertige Folie als PNG exportieren oder zurück in den PPTX-Flow geben.

## Wie erstellt man professionelle Folien?

SlideForge ist nicht als allgemeines Design-Tool gedacht. Das Ziel ist enger und anspruchsvoller: Inhalte sollen innerhalb der visuellen Identität des hochgeladenen PowerPoint-Masters entstehen. Farben, Typografie, Seitenverhältnis und Placeholder-Geometrie kommen aus der Vorlage. Neue Slides müssen sich so verhalten, als wären sie für genau diese Masterfolie entworfen worden.

Damit das nicht in eine lose "schreib mir mal eine schöne Folie"-Pipeline abrutscht, folgt das Projekt dem Arbeitsmodell einer Präsentations-Agentur. Ein 6-Rollen-Team arbeitet in 4 Phasen. Die Rollen sind keine dekorativen Labels, sondern klar getrennte Qualitätsgates: Brief schärfen, Message festlegen, Template wählen, visuelle Dramaturgie prüfen, Brand-Konformität erzwingen und erst dann final freigeben.

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

1. **Intake & Briefing**: Der Project Manager prüft, ob Ziel, Publikum, Kernaussage und technischer Kontext aus dem Brief ableitbar sind. Im Fast Path lockt er den Brief still im Hintergrund. Bei Unklarheit stellt er maximal drei gezielte Rückfragen.
2. **Concept & Storyboard**: Der Content Strategist formuliert die Aussage der Folie. Danach wählt der Visual Designer die passende CodeSlide und übersetzt die Narrative in konkrete Slots, Hierarchie und Layout-Entscheidungen.
3. **Design & Production**: Der Illustrator prüft, ob die Folie visuell trägt oder nur korrekt angeordnete Boxen zeigt. Anschließend scannt der Brand Guardian die Änderung gegen den Theme Contract. Zusätzlich ist ein mechanischer Fit-Check gegen die reale PPTX-Placeholder-Geometrie Pflicht.
4. **QA & Delivery**: Der QA Manager liest Brief und Ergebnis noch einmal gegen die 7-Punkt-QA-Matrix. Maximal drei End-to-End-Loops sind erlaubt. Danach wird nicht weitergedreht, sondern eskaliert.

### Methoden

- **Pyramid Principle**: Antwort zuerst, Begründung danach.
- **MECE**: Argumente dürfen sich nicht überlappen und müssen die Aussage gemeinsam tragen.
- **SCQA**: Situation, Komplikation, Frage, Antwort als Kontext-Gerüst für erklärungsbedürftige Slides.
- **Action Titles**: Überschriften sind Aussagen, keine Themenetiketten.
- **Duarte-Kontrast**: "Was ist" gegen "was sein könnte" setzen, wenn narrative Spannung nötig ist.
- **QA-Matrix**: Alignment, Farbkonsistenz, Datenkorrektheit, Placeholder-Fit, technische Präzision, Markenkonformität und "so what".

## Pro Plattform

### Claude Code

**Was tippst Du:** `/create-slide <Brief>` oder eine direkte Arbeitsanweisung im Repo.  
**Was passiert:** Claude lädt zuerst den Template-Kontext, lässt den Project Manager den Brief locken und arbeitet dann die Rollenfolge `project-manager → content-strategist → visual-designer → illustrator → brand-guardian → qa-manager` ab. Bei Fehlern läuft der definierte Loop-back-Pfad, nicht ein improvisierter Retry.  
**Wo liegen die Files:** Rollenadapter in `.claude/agents/`, Skills in `.claude/skills/`, der nutzerseitige Einstieg in `.claude/commands/create-slide.md`.

### GitHub Copilot

**Was tippst Du:** den Prompt `/create-slide` oder eine Aufgabenstellung im Copilot-Chat.  
**Was passiert:** Copilot arbeitet dieselbe kanonische Orchestrierung ab, aber als Chatmode-Wechsel statt Subagent-Dispatch. Die Rollen lesen dieselben kanonischen Specs unter `docs/roles/` und dieselbe Orchestrator-Logik unter `docs/skills/create-slide.md`.  
**Wo liegen die Files:** Chatmodes in `.github/chatmodes/`, ausführbare Prompts in `.github/prompts/`, projektspezifische Leitplanken in `.github/copilot-instructions.md`.

### OpenAI Codex

**Was tippst Du:** eine Anweisung wie „Befolge `docs/skills/create-slide.md` für diesen Brief: …“.  
**Was passiert:** Codex nutzt keine Adapter-Schicht, sondern liest `AGENTS.md`, `docs/skills/*.md` und `docs/roles/*.md` direkt. Dadurch bleibt die Prozesslogik identisch, auch wenn die Ausführung inline in einer Session statt in getrennten Chatmodes oder Subagents läuft.  
**Wo liegen die Files:** Der Einstieg sitzt in `AGENTS.md`, die Orchestrierung in `docs/skills/create-slide.md`, die Rollen in `docs/roles/`.

## Folienmaster hinzufügen

Neue Folienmaster kommen durch Upload einer weiteren `.pptx` in die App. Theme, Layouts und Placeholder werden automatisch aus der Datei extrahiert.

## Weiterlesen

- `AGENTS.md` für den vollständigen Theme Contract, das Slot-System und den teamweiten Prozess.
- `docs/skills/create-slide.md` für die kanonische Orchestrierung.
- `docs/roles/*.md` für die einzelnen Rollen-Specs.
- `docs/slide-patterns.md` für freigegebene dichte Folienmuster und Anti-Patterns.
