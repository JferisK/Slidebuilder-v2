import * as React from "react";
import { KeyRound } from "lucide-react";
import type { CodeSlide } from "../types";
import {
  DenseBulletRow,
  DenseEditorialCard,
  EditorialLeadBand,
  PALETTE,
  StandardTitle,
  mix,
} from "./_shared";

const GOALS = [
  {
    key: "task",
    title: "Nur fuer die Aufgabe",
    text: "Rechte gelten nur fuer die klar benannte, fachlich noetige Aktion.",
    tone: "primary",
  },
  {
    key: "time",
    title: "Nur fuer den Zeitraum",
    text: "Erhoehte Rechte werden nur kurz aktiviert und verfallen danach wieder.",
    tone: "trust",
  },
  {
    key: "approval",
    title: "Mit Freigabe und Protokoll",
    text: "Kritische Erhoehungen brauchen Begruendung, Freigabe und sichtbare Kontrollspuren.",
    tone: "signal",
  },
  {
    key: "remove",
    title: "Mit Ruecknahme nach Nutzung",
    text: "Nach Abschluss wird der Sonderzugriff sofort entzogen und nicht zum Normalzustand.",
    tone: "risk",
  },
] as const;

const ACTIONS = [
  {
    key: "roles",
    title: "Rollen aendern",
    text: "Wer Rollen vergibt oder erweitert, verschiebt direkt den Handlungsspielraum anderer Identitaeten.",
    tone: "primary",
  },
  {
    key: "exceptions",
    title: "Ausnahmen freigeben",
    text: "Sonderfaelle hebeln Standardkontrollen aus und sind deshalb besonders missbrauchsrelevant.",
    tone: "risk",
  },
  {
    key: "payments",
    title: "Auszahlungen ausloesen",
    text: "Finanzwirksame Aktionen kombinieren hohe Wirkung mit geringem Fehlertoleranzraum.",
    tone: "trust",
  },
  {
    key: "exports",
    title: "Grosse Datenmengen exportieren",
    text: "Bulk-Exporte machen aus einem einzelnen Zugriff schnell ein Vertraulichkeits- und Schadensproblem.",
    tone: "signal",
  },
] as const;

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Vertiefung"
    title="Was ist Privileged Access Management?"
  />
);

const BodySlot: React.FC = () => (
  <div
    className="grid h-full grid-rows-[auto_1fr] gap-3"
    style={{ fontFamily: PALETTE.body }}
  >
    <EditorialLeadBand
      tone="deep"
      density="compact"
      className="text-[12px] leading-[1.22]"
    >
      Privileged Access Management fokussiert auf besonders maechtige Konten,
      Rollen und Aktionen. Gerade weil ihr Missbrauch Regeln, Geldfluesse und
      Sicherheitsgrenzen direkt verschieben kann, duerfen solche Rechte nicht
      als Dauerzustand bereitliegen.
    </EditorialLeadBand>

    <div className="grid min-h-0 grid-cols-[1.04fr_0.96fr] gap-3">
        <DenseEditorialCard
          tone="risk"
          density="compact"
          className="min-h-0 flex flex-col gap-3"
        >
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{
                background: mix(PALETTE.risk, PALETTE.bg, 16),
                color: PALETTE.risk,
              }}
            >
              <KeyRound size={18} />
            </div>
            <div>
              <div
                className="text-[18px] font-semibold leading-[1.05]"
                style={{ color: PALETTE.risk, fontFamily: PALETTE.heading }}
              >
                Dauerhafte Privilegien sind Generalschluessel, die immer
                herumliegen.
              </div>
              <div
                className="mt-2 text-[11px] leading-snug"
                style={{ color: PALETTE.text }}
              >
                Je laenger solche Rechte offen liegen, desto leichter lassen
                sich kritische Schritte ohne echten Anlass und ohne wirksame
                Kontrolle ausfuehren.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[0.92fr_1.08fr] gap-3">
            <div
              className="rounded-[16px] p-3"
              style={{
                background: mix(PALETTE.risk, PALETTE.bg, 12),
                border: `1px solid ${mix(PALETTE.risk, "transparent", 26)}`,
              }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.14em]"
                style={{ color: PALETTE.risk }}
              >
                Standing privilege
              </div>
              <div
                className="mt-1 text-[12px] font-semibold leading-tight"
                style={{ color: PALETTE.risk, fontFamily: PALETTE.heading }}
              >
                Liegt bereit
              </div>
              <div
                className="mt-1 text-[10px] leading-snug"
                style={{ color: PALETTE.text }}
              >
                Das Recht ist schon da, obwohl die heikle Aktion vielleicht nie
                anfaellt.
              </div>
            </div>

            <div
              className="rounded-[16px] p-3"
              style={{
                background: mix(PALETTE.trust, PALETTE.bg, 12),
                border: `1px solid ${mix(PALETTE.trust, "transparent", 26)}`,
              }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.14em]"
                style={{ color: PALETTE.trust }}
              >
                JIT-Zugriff
              </div>
              <div
                className="mt-1 text-[12px] font-semibold leading-tight"
                style={{ color: PALETTE.trust, fontFamily: PALETTE.heading }}
              >
                Wird gezielt erzeugt
              </div>
              <div
                className="mt-1 text-[10px] leading-snug"
                style={{ color: PALETTE.text }}
              >
                Nur fuer Aufgabe und Zeitraum, danach wieder entzogen.
              </div>
            </div>
          </div>

          <div
            className="pt-1 text-[10px] uppercase tracking-[0.16em]"
            style={{ color: PALETTE.primary }}
          >
            Besser ist
          </div>
          <div className="mt-1 flex min-h-0 flex-col">
            {GOALS.map((goal, index) => (
              <DenseBulletRow
                key={goal.key}
                tone={goal.tone}
                style={
                  index === GOALS.length - 1
                    ? { borderBottom: "none" }
                    : undefined
                }
              >
                <span
                  style={{
                    color: PALETTE.primary,
                    fontFamily: PALETTE.heading,
                  }}
                >
                  {goal.title}.
                </span>{" "}
                {goal.text}
              </DenseBulletRow>
            ))}
          </div>
        </DenseEditorialCard>

      <DenseEditorialCard
        tone="signal"
        density="compact"
        className="min-h-0 flex flex-col"
      >
        <div
          className="text-[10px] uppercase tracking-[0.16em]"
          style={{ color: PALETTE.signal }}
        >
          Typische privilegierte Aktionen
        </div>
        <div
          className="mt-1 text-[11px] leading-snug"
          style={{ color: PALETTE.muted }}
        >
          Diese Eingriffe sind ein Sonderfall, weil sie Regeln, Geldfluesse
          oder Sichtbarkeit direkt veraendern koennen.
        </div>
        <div className="mt-2 flex min-h-0 flex-col">
          {ACTIONS.map((action, index) => (
            <DenseBulletRow
              key={action.key}
              tone={action.tone}
              style={
                index === ACTIONS.length - 1
                  ? { borderBottom: "none" }
                  : undefined
              }
            >
              <span
                style={{
                  color:
                    action.tone === "trust"
                      ? PALETTE.trust
                      : action.tone === "risk"
                        ? PALETTE.risk
                        : action.tone === "signal"
                          ? PALETTE.signal
                          : PALETTE.primary,
                  fontFamily: PALETTE.heading,
                }}
              >
                {action.title}.
              </span>{" "}
              {action.text}
            </DenseBulletRow>
          ))}
        </div>
      </DenseEditorialCard>
    </div>
  </div>
);

const PrivilegedAccessManagementSlide: CodeSlide = {
  id: "diw-22-privileged-access-management",
  name: "22 · Was ist Privileged Access Management?",
  description:
    "Vertiefungsfolie zu privilegierten Konten, kontrollierter Rechtevergabe und typischen Hochrisiko-Aktionen.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default PrivilegedAccessManagementSlide;
