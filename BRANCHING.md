# Branching-Strategie

Diese Doku beschreibt, wie Branches in diesem Repo gefuehrt werden. Ziel:
keine verwaisten Branches mehr, klare Naming-Konvention, eindeutige Quelle der
Wahrheit. Gilt fuer alle Beitragenden — auch fuer Claude-Sessions, die
automatisch Branches anlegen.

## TL;DR

- `main` ist die einzige langlebige Linie. Immer baubar, immer deployable.
- Alle Aenderungen passieren in kurzlebigen Topic-Branches.
- Naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `exp/<slug>`, `claude/<slug>`.
- Squash-Merge in `main`, danach Branch sofort loeschen (remote + lokal).
- Branches > 1 Woche: rebase auf `main` oder verwerfen.

## Trunk-basiert, kurzlebig

Wir arbeiten **trunk-basiert**. Das heisst:

- `main` ist der Trunk. Releases entstehen aus `main`.
- Topic-Branches sind klein und kurzlebig (Stunden bis maximal Tage).
- Kein `develop`-Branch, kein `release/*`, kein GitFlow — das ist fuer ein
  Solo- + Claude-Setup overkill.

## Naming-Konvention

| Prefix | Wofuer | Beispiel |
|---|---|---|
| `feat/` | Neues Feature | `feat/master-themes` |
| `fix/` | Bugfix | `fix/per-master-theme-parsing` |
| `chore/` | Refactor, Deps, CI, Aufraeumen | `chore/cleanup-branches` |
| `exp/` | Experiment, wird oft verworfen | `exp/canvas-zoom` |
| `claude/` | Von Claude angelegter Task | `claude/master-themes-copilot-drawer` |

**Slug-Regeln:**

- kebab-case (`master-themes`, nicht `MasterThemes` oder `master_themes`)
- max ~4 Worte, beschreibend
- **kein zufaelliges Hash-Suffix** wie `-AyBf0`, `-PSDxq`, `-y2M1J`. Solche
  Suffixe entstehen, wenn Claude Code on the Web Branches in der Cloud anlegt;
  lokal sind sie unnoetig und verschmutzen die Branch-Liste.

## Lifecycle eines Topic-Branches

1. **Anlegen:** immer von aktuellem `main`:
   ```bash
   git fetch origin
   git checkout -b feat/<slug> origin/main
   ```

2. **Arbeiten:** committen, pushen, iterieren. Bei laengerer Laufzeit
   regelmaessig auf `main` rebasen:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

3. **Mergen:** ueber PR, **Squash-Merge** in `main`. Eine PR = ein
   semantischer Commit. Die PR-Beschreibung wird die Commit-Message.

4. **Loeschen:** sofort nach Merge — remote und lokal:
   ```bash
   git push origin --delete feat/<slug>
   git branch -d feat/<slug>
   ```
   Wenn der Branch verworfen statt gemerged wird: gleicher Befehl, mit `-D`
   statt `-d` lokal.

## Was nicht passieren darf

- **Topic-Branches stapeln:** kein Branch baut auf einem anderen Topic-Branch
  auf. Immer von `main`. Wenn Branch A schon im Review ist und du Idee B
  brauchst die auf A aufbaut, mach A erst fertig (mergen) oder rebase B
  spaeter auf den gemergten Stand von A.
- **Verwaiste Branches:** ein Branch, der seit > 30 Tagen weder gemerged noch
  rebased wurde, ist Schrott und wird geloescht.
- **Direktpush auf `main`:** nur in Notfaellen (z.B. CI-Pipeline fixen).
  Normalfall ist PR.
- **Force-Push auf `main`:** nie.

## Routine-Cleanup (alle ~14 Tage)

```bash
# Remote-Tracking-Refs auf den aktuellen Stand bringen
git fetch --all --prune

# Lokale Branches loeschen, deren Remote bereits weg ist
git branch -vv | awk '/: gone]/{print $1}' | xargs -r -n1 git branch -D

# Liste der lokalen Branches pruefen
git branch -vv
```

Optional: `git for-each-ref --sort=-committerdate refs/heads/` zeigt lokale
Branches nach letzter Aktivitaet sortiert — alles oben ist relevant, alles
unten potentiell veraltet.

## Konvention fuer Claude-Sessions

Wenn Claude in diesem Repo arbeitet:

1. Pro Aufgabe einen `claude/<slug>`-Branch von `origin/main` anlegen.
2. Aenderungen committen + pushen.
3. **Keine Iterationen auf alten `claude/...`-Branches stapeln.** Wenn die
   Aufgabe sich aendert, neuer Branch von `main`. Alte Branches werden
   geloescht, sobald sie obsolet sind.
4. Nach Squash-Merge in `main` durch den User: Branch wird geloescht.

## Schutz auf `main` (empfohlen)

Auf GitHub fuer den `main`-Branch einrichten:

- Require pull request before merging
- Require status checks to pass (sobald CI eingerichtet ist)
- Restrict force-pushes

## Aktuelle Snapshot (Stand: Cleanup)

Nach dem Aufraeumen leben nur:

- `main` — Trunk
- `claude/master-themes-and-copilot-drawer` — laufende Arbeit (Per-Master
  Themes, MasterPicker, Copilot-Drawer, `data-selectable`)

Alles andere wurde geloescht.
