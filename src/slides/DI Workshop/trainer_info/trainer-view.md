# Trainer-Ansicht IAM Workshop (Pflichtdokument)

Dieses Dokument ist die zentrale Übergabe für Trainer.

Regel: Bei jeder Änderung an IAM-relevanter Konfiguration oder an Workshop-Flows muss dieses Dokument aktualisiert werden.

Verbindliche Verteilung über alle dokumentierten Fehler:

- 50% einfach
- 30% mittelschwer
- 20% schwer

Aktuelle Verteilung (Stand: 21 Fehler, 6 Prinzipien):

| Schwierigkeit | Anzahl | Anteil |
|---|---|---|
| einfach | 10 | ~48% |
| mittel | 7 | ~33% |
| schwer | 4 | ~19% |

Verbindliche Abdeckung:

- Jedes IAM-Prinzip muss mehrere Fehler enthalten (mindestens 3).
- Jeder Punkt muss mit einem Schwierigkeitsgrad markiert werden: `einfach`, `mittel`, `schwer`.

---

## 1. Least Privilege

1. **Spesenlimit durch User editierbar** (`einfach`)
   Ort: `/profil` → Abschnitt "Spesenlimit anpassen"
   Fehlkonfiguration: Endnutzer darf eigenes Limit ohne Freigabe erhöhen. Wert wird in localStorage gespeichert und sofort wirksam.
   Erwartung: Limit wird ohne Genehmigungsprozess übernommen. Anträge über altem Limit werden nun akzeptiert.
   Lernziel: Limits und Schwellenwerte dürfen nicht selbst-modifizierbar sein.

2. **Zu breite Standardrolle (Mitarbeiter)** (`einfach`)
   Ort: `/rollen` → Rollenmatrix, Zeile "Mitarbeiter"
   Fehlkonfiguration: Basisrolle enthält spesen:alle:lesen, spesen:eigene:genehmigen, spesen:fremde:genehmigen, export:gesamt:herunterladen, archiv:alle:lesen.
   Erwartung: Normaler Mitarbeiter sieht Admin-nahe Funktionen im Menü.
   Lernziel: Startpunkt mit minimalen Rechten aufsetzen, nicht mit "bequemen" Rechten.

3. **Bulk-Download für alle Rollen** (`einfach`)
   Ort: `/export`
   Fehlkonfiguration: export:gesamt:herunterladen ist in der Mitarbeiter-Basisrolle enthalten.
   Erwartung: Anna Weber (Mitarbeiter) sieht Export-Link und kann vollständige CSV herunterladen.
   Lernziel: Datenzugriff nach Aufgabe und Bedarf begrenzen.

4. **Genehmigungsrechte ohne Bedarf** (`einfach`)
   Ort: `/genehmigungen` (als Anna Weber sichtbar)
   Fehlkonfiguration: Mitarbeiter-Rolle hat spesen:eigene:genehmigen UND spesen:fremde:genehmigen.
   Erwartung: Freigabe-Menüpunkt erscheint für Mitarbeiter. Antrag von anderen kann freigegeben werden.
   Lernziel: Freigaberechte strikt trennen – nur autorisierte Rollen sollen genehmigen dürfen.

5. **Vollzugriff auf historische Daten** (`mittel`)
   Ort: `/verlauf`
   Fehlkonfiguration: archiv:alle:lesen ohne zeitliche oder organisatorische Einschränkung in Mitarbeiter-Rolle.
   Erwartung: Alle 12 Einträge aus allen Abteilungen und Zeiträumen sind sichtbar.
   Lernziel: Historische Daten brauchen separate Zugriffskontrolle mit Zeitgrenzen.

---

## 2. Authentifizierung

1. **Trainer-Ansicht ohne Login erreichbar** (`einfach`)
   Ort: `/trainer` (direkte URL, kein Login erforderlich)
   Fehlkonfiguration: Keine Session-Prüfung auf der Seite. Sensitive Trainer-Daten (alle Passwörter, alle IAM-Fehler) sind ohne Authentifizierung einsehbar.
   Erwartung: Seite lädt vollständig ohne Anmeldung. Auth-1.
   Lernziel: Jede Seite mit sensiblen Daten braucht eine Zugangskontrolle.

2. **Unbegrenzte Login-Versuche** (`einfach`)
   Ort: `/login`
   Fehlkonfiguration: Kein Rate Limiting, kein CAPTCHA, keine Verzögerung, kein Account Lockout.
   Erwartung: Beliebig viele Passwortversuche möglich. Brute-Force auf schwache Passwörter (z.B. "abc") trivial.
   Lernziel: Brute-Force-Schutz (Lockout, MFA, Rate Limiting) ist Pflicht.

3. **Session läuft nie ab** (`mittel`)
   Ort: Browser → DevTools → Application → localStorage → kpmg_session
   Fehlkonfiguration: Session-Objekt hat kein exp/expiresAt-Feld. Kein Ablaufzeitpunkt wird geprüft.
   Erwartung: Nach Tagen ist die Session noch gültig. Gestohlene Session-Tokens bleiben ewig nutzbar.
   Lernziel: Sessions müssen Ablaufzeiten haben und serverseitig invalidiert werden können.

4. **Passwörter im Klartext** (`einfach`)
   Ort: `/login` (Demo-Konten mit Augen-Icon) und `/profil` (Passwort-Feld)
   Fehlkonfiguration: Passwörter stehen im Klartext in users.json und werden im UI angezeigt.
   Erwartung: Klick auf Augen-Icon offenbart Passwort. Profil zeigt Klartext im schreibgeschützten Feld.
   Lernziel: Passwörter müssen gehasht (bcrypt/argon2) und nie im Frontend sichtbar sein.

---

## 3. Autorisierung

1. **Admin-Seite per direkter URL zugänglich** (`mittel`)
   Ort: `/rollen` (direkte URL-Eingabe als Anna Weber)
   Fehlkonfiguration: Sidebar blendet Link aus, aber keine serverseitige/middleware Zugangsprüfung.
   Erwartung: Als Mitarbeiter ohne Rollenmatrix-Berechtigung: URL eingeben → Seite lädt vollständig.
   Lernziel: Security through Obscurity ist kein Zugriffsschutz. UI-Ausblenden ≠ Autorisierung.

2. **Rollenzuweisung ohne Governance** (`schwer`)
   Ort: `/rollen` → Button "Rolle zuweisen"
   Fehlkonfiguration: Rollenwechsel wird sofort ohne Genehmigungsworkflow, ohne Audit-Trail, ohne Zeitbegrenzung gespeichert.
   Erwartung: Beliebiger Nutzer kann beliebige Rolle ohne Kontrolle erhalten (z.B. Anna Weber → Finanzleiterin).
   Lernziel: IAM-Operationen brauchen Governance: Genehmigung, Protokollierung, automatische Reviews.

3. **Identische Endpunkte für Admin und Nutzer** (`schwer`)
   Ort: `/rollen`, `/export`, `/verlauf`
   Fehlkonfiguration: Alle Routen sind ungeschützt. Keine Middleware-basierte Autorisierung.
   Erwartung: Direkte URL-Eingabe umgeht alle Frontend-Zugangskontrollen vollständig.
   Lernziel: Autorisierung muss im Backend/Middleware erzwungen werden, nicht nur im UI.

---

## 4. Need to Know

1. **Alle Spesen abteilungsübergreifend sichtbar** (`einfach`)
   Ort: `/spesen`
   Fehlkonfiguration: spesen:alle:lesen in Mitarbeiter-Rolle zeigt alle Anträge unabhängig von Abteilung.
   Erwartung: Anna Weber (Vertrieb) sieht Anträge aus Finanzen, IT, HR. Filter auf "Alle" per Default.
   Lernziel: Datenzugriff muss auf eigene Organisationseinheit beschränkt sein.

2. **Betragsdaten anderer Abteilungen einsehbar** (`mittel`)
   Ort: `/spesen` → Betragsspalte
   Fehlkonfiguration: Beträge (inkl. strategischer Investitionen wie 25.000 EUR in e05) sind für alle sichtbar.
   Erwartung: Mitarbeiter sieht Finanzzahlen, die ihm für seine Arbeit nicht zugänglich sein sollten.
   Lernziel: Finanzielle Daten sind besonders schützenswert und brauchen engere Grenzen.

3. **Interne Kommentare für alle sichtbar** (`mittel`)
   Ort: `/spesen/e05`, `/spesen/e10`, `/spesen/e12` (Kommentare mit `internal: true`)
   Fehlkonfiguration: Alle Kommentare werden angezeigt, auch wenn internal: true. Gesundheitliche Infos (c05) und strategische Daten (c04, c08, c12) sichtbar.
   Erwartung: Anna Weber sieht vertrauliche interne Kommentare anderer Abteilungen.
   Lernziel: Interne Kommentare brauchen eigene Zugangskontrolle (z.B. nur Genehmiger/Management).

4. **CSV-Export mit vollständigen PII-Daten** (`mittel`)
   Ort: `/export` → CSV-Download
   Fehlkonfiguration: Export enthält Name, E-Mail, Abteilung für alle Einreicher. Für alle Rollen verfügbar.
   Erwartung: Vollständige Personendaten exportierbar durch Mitarbeiter ohne datenschutzrechtliche Einschränkung.
   Lernziel: PII-Daten brauchen besondere Schutzmaßnahmen; Bulk-Export sollte gesondert genehmigt werden.

---

## 5. Segregation of Duties

1. **Selbstgenehmigung einfacher Anträge** (`einfach`)
   Ort: `/genehmigungen` → Antrag e01 (1.200 EUR, Klaus Meier)
   Fehlkonfiguration: spesen:eigene:genehmigen in Teamleiter-Rolle. Klaus kann eigenen Antrag freigeben.
   Erwartung: "Genehmigen"-Button erscheint ohne Warnung für eigenen Antrag.
   Lernziel: Einreicher und Genehmiger müssen unterschiedliche Personen sein.

2. **Selbstgenehmigung hoher Beträge** (`einfach`)
   Ort: `/spesen/e02` (4.800 EUR, Klaus Meier)
   Fehlkonfiguration: Auch bei höheren Beträgen greift keine zusätzliche Kontrolle.
   Erwartung: e02 wurde selbst eingereicht und selbst genehmigt. Amber-Markierung in Tabelle sichtbar.
   Lernziel: Betragsabhängige Eskalation fehlt vollständig.

3. **Finanzleiterin: Limit setzen + Auszahlung ausführen** (`mittel`)
   Ort: `/rollen` → Rollenmatrix, Spalte Finanzleiterin
   Fehlkonfiguration: Eine Rolle kombiniert spesen:limit:setzen mit spesen:auszahlung:ausfuehren.
   Erwartung: Person kann Limit erhöhen und direkt auszahlen – ohne externe Kontrolle.
   Lernziel: Kritische Finanztransaktionen brauchen Vier-Augen-Prinzip durch separate Rollen.

4. **Audit-Log durch Genehmiger editierbar** (`mittel`)
   Ort: `/verlauf` → Einträge a01, a02, a04 (als Klaus Meier oder Tom Berger)
   Fehlkonfiguration: audit:log:bearbeiten in Teamleiter-Rolle erlaubt nachträgliche Manipulation.
   Erwartung: Bearbeiten-Button erscheint. Text kann frei geändert werden. Keine Gegensignatur.
   Lernziel: Audit-Logs müssen unveränderlich sein (WORM). Genehmiger dürfen keine Schreibrechte haben.

5. **Ausnahmeantrag ohne Vier-Augen-Prinzip** (`schwer`)
   Ort: `/spesen/e05` (25.000 EUR, isException: true)
   Fehlkonfiguration: "Hochriskante Ausnahme"-Badge vorhanden, aber kein erzwungenes Zwei-Personen-Prinzip.
   Erwartung: Einzelner Benutzer kann Ausnahmeantrag genehmigen. Tom Berger hat es selbst genehmigt.
   Lernziel: Ausnahmeregelungen brauchen härtere Kontrollen, nicht schwächere.

---

## 6. Joiner-Leaver-Mover (JLM)

1. **Offboarded-Konto noch aktiv** (`einfach`)
   Ort: `/dashboard` (als Lena Fischer), alle weiteren Seiten
   Fehlkonfiguration: offboarded: "2025-12-01" im Datensatz, aber kein automatisches Deaktivieren.
   Erwartung: Anmeldung möglich, rote Warnung auf Dashboard, aber volle Funktionalität.
   Lernziel: Offboarding muss automatisiert und zeitnah erfolgen (Day-0/Day-1).

2. **Neukonto als Rollenkopie (Joiner-Fehler)** (`einfach`)
   Ort: `/dashboard` (als Tom Berger) – Warnung "Rollenfehler"
   Fehlkonfiguration: Tom wurde als Kopie von Lena Fischer angelegt – hat finanzleiterin statt praktikant.
   Erwartung: Dashboard zeigt amber Alert: "Vorgesehene Rolle: Praktikant – Tatsächliche Rolle: Finanzleiterin".
   Lernziel: Kopieren von Konten als Onboarding-Prozess ist gefährlich. Rollen müssen individuell vergeben werden.

3. **Alte Rechte nach Abteilungswechsel (Mover)** (`mittel`)
   Ort: `/dashboard` (als Mark Schulz) – Zusatzrollen sichtbar; `/rollen` – Rollenzuordnung
   Fehlkonfiguration: Mark von Vertrieb nach HR versetzt. additionalRoles: [vertrieb-leser, vertrieb-genehmiger] nicht entzogen.
   Erwartung: Zusatzrollen in Dashboard sichtbar. Mark kann Vertriebsanträge genehmigen trotz HR-Zugehörigkeit.
   Lernziel: Bei Versetzungen müssen alte Rechte entzogen werden (Role Recertification).

4. **Sammelkonto ohne Non-Repudiation** (`schwer`)
   Ort: `/verlauf` → Einträge a06, a07; `/dashboard` (als Buchhaltung Team)
   Fehlkonfiguration: 4 Personen teilen ein Konto. Audit-Einträge zeigen "Buchhaltung Team" ohne Personenidentifikation.
   Erwartung: Unmöglich festzustellen, wer Antrag e07 genehmigt und Auszahlung veranlasst hat.
   Lernziel: Jede Person braucht ein eigenes Konto. Non-Repudiation ist gesetzlich und regulatorisch gefordert.
