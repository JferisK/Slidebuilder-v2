import * as React from "react";
import type { CodeSlide } from "../types";
import {
  DenseEditorialCard,
  DenseStatementStrip,
  EditorialLeadBand,
  PALETTE,
  StandardTitle,
  SurfacePanel,
  SectionLead,
  mix,
} from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Operating Model für neue Identitäten"
    title="AI Agents und nicht-menschliche Identitäten"
    tags={[
      { label: "Machine Identities", tone: "signal" },
      { label: "Scoped Access", tone: "trust" },
    ]}
  />
);

const IdentityTile: React.FC<{
  title: string;
  text: string;
  tone: "primary" | "trust" | "signal" | "deep";
}> = ({ title, text, tone }) => {
  const color =
    tone === "trust"
      ? PALETTE.trust
      : tone === "signal"
        ? PALETTE.signal
        : tone === "deep"
          ? PALETTE.deep
          : PALETTE.primary;

  return (
    <div
      style={{
        borderRadius: 18,
        padding: "10px 11px",
        background: mix(color, PALETTE.bg, 10),
        border: `1px solid ${mix(color, "transparent", 26)}`,
        display: "grid",
        gap: 4,
      }}
    >
      <div
        style={{
          color,
          fontSize: 10,
          lineHeight: 1.1,
          fontFamily: PALETTE.heading,
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: PALETTE.text,
          fontSize: 10,
          lineHeight: 1.18,
          fontFamily: PALETTE.body,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const ControlStrip: React.FC<{
  step: string;
  title: string;
  text: string;
  tone: "primary" | "trust" | "signal" | "deep";
}> = ({ step, title, text, tone }) => {
  const color =
    tone === "trust"
      ? PALETTE.trust
      : tone === "signal"
        ? PALETTE.signal
        : tone === "deep"
          ? PALETTE.deep
          : PALETTE.primary;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "46px 1fr",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 16,
        background: mix(color, PALETTE.bg, 10),
        border: `1px solid ${mix(color, "transparent", 26)}`,
      }}
    >
      <div
        style={{
          height: 28,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          background: mix(color, PALETTE.bg, 16),
          fontSize: 14,
          lineHeight: 1,
          fontFamily: PALETTE.heading,
        }}
      >
        {step}
      </div>
      <div style={{ display: "grid", gap: 3 }}>
        <div
          style={{
            color,
            fontSize: 13,
            lineHeight: 1.08,
            fontFamily: PALETTE.heading,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: PALETTE.text,
            fontSize: 10,
            lineHeight: 1.18,
            fontFamily: PALETTE.body,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

const BodySlot: React.FC = () => (
  <div
    style={{
      height: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      gap: 8,
      padding: "1.1%",
      borderRadius: 18,
      background: `linear-gradient(180deg, ${mix(PALETTE.bg, PALETTE.secondary, 93)}, ${mix(
        PALETTE.signal,
        PALETTE.bg,
        5,
      )})`,
      border: `1px solid ${mix(PALETTE.primary, "transparent", 18)}`,
    }}
  >
    <EditorialLeadBand tone="deep" style={{ fontSize: 14, lineHeight: 1.18, padding: "12px 16px" }}>
      AI Agents sind keine weiteren Servicekonten, sondern handelnde Identitaeten. Sie nutzen
      Tools, Daten und Aktionen in wechselnden Kontexten und brauchen deshalb klare Identitaet,
      Verantwortung, Scope, Logging und Lifecycle.
    </EditorialLeadBand>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "0.95fr 1.05fr",
        gap: 10,
        minHeight: 0,
      }}
    >
      <SurfacePanel tone="primary" className="grid h-full min-h-0 grid-rows-[auto_auto_1fr] gap-2 p-2.5">
        <SectionLead
          eyebrow="Neue Identitaetsrealitaet"
          title="Was an Agents anders ist"
          text="Der naechste Mitarbeiter oder Kunde kann AI sein. Das macht Identity-first Security breiter und schwieriger."
          tone="primary"
        />
        <DenseEditorialCard
          tone="deep"
          density="tight"
          style={{
            display: "grid",
            gap: 4,
            background:
              "linear-gradient(140deg, color-mix(in srgb, var(--slide-text) 88%, var(--slide-bg)), color-mix(in srgb, var(--slide-primary) 62%, var(--slide-text)))",
            color: "var(--slide-bg)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: mix(PALETTE.bg, "transparent", 72),
              fontFamily: PALETTE.heading,
            }}
          >
            Hero-Objekt
          </div>
          <div
            style={{
              fontSize: 18,
              lineHeight: 1.02,
              fontFamily: PALETTE.heading,
            }}
          >
            AGENT ID
          </div>
          <div
            style={{
              fontSize: 11,
              lineHeight: 1.2,
              color: mix(PALETTE.bg, "transparent", 90),
              fontFamily: PALETTE.body,
            }}
          >
            Nicht Tool, sondern handelnde Identitaet mit Owner, Scope, Protokoll und Abschaltpunkt.
          </div>
        </DenseEditorialCard>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            alignContent: "start",
            minHeight: 0,
          }}
        >
          <IdentityTile
            title="Eigene IDs"
            text="Jeder Agent braucht eine klar trennbare Identitaet statt impliziter Sammelkonten."
            tone="primary"
          />
          <IdentityTile
            title="Sponsor"
            text="Zu jedem Agenten gehoert eine verantwortliche Person oder Rolle."
            tone="trust"
          />
          <IdentityTile
            title="Scope"
            text="Der Agent braucht nur die Tools, Daten und Aktionen, die seine Aufgabe wirklich verlangt."
            tone="signal"
          />
          <IdentityTile
            title="Dynamik"
            text="Agenten koennen schneller, breiter und kontextabhaengiger handeln als klassische Servicekonten."
            tone="deep"
          />
        </div>
      </SurfacePanel>

      <SurfacePanel tone="signal" className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-2 p-2.5">
        <SectionLead
          eyebrow="Governance-Modell"
          title="Welche Steuerung sichtbar mitgedacht werden muss"
          text="Scope ist mehr als Login: Entscheidend sind Tool-Zugriffe, Datenumfang, Aktionen, Kontext und kurzlebige Rechte."
          tone="signal"
        />
        <div style={{ minHeight: 0, display: "grid", gridTemplateRows: "1fr auto", gap: 8 }}>
          <div style={{ minHeight: 0, overflow: "hidden", display: "grid", alignContent: "start", gap: 8 }}>
            <ControlStrip
              step="01"
              title="Ownership + Delegation"
              text="Pro Agent ein Sponsor, klare Verantwortung und nachvollziehbare Delegation statt anonymer Automatisierung."
              tone="trust"
            />
            <ControlStrip
              step="02"
              title="Granularer Scope"
              text="Nicht nur Login erlauben, sondern Tools, Daten, Aktionen und Kontext separat begrenzen."
              tone="primary"
            />
            <ControlStrip
              step="03"
              title="Kurzlebige Rechte + Lifecycle"
              text="Fein granulare, delegierte und moeglichst kurzlebige Credentials; Registrierung, Rezertifizierung und Abschaltung inklusive."
              tone="signal"
            />
          </div>
          <DenseEditorialCard
            tone="trust"
            density="tight"
            style={{
              display: "grid",
              gap: 5,
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--slide-accent) 10%, var(--slide-bg)), color-mix(in srgb, var(--slide-secondary) 74%, var(--slide-bg)))",
            }}
          >
            <div
              style={{
                color: PALETTE.trust,
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontFamily: PALETTE.heading,
              }}
            >
              Risikoformel
            </div>
            <div
              style={{
                color: PALETTE.text,
                fontSize: 14,
                lineHeight: 1.16,
                fontFamily: PALETTE.heading,
              }}
            >
              Agent Sprawl + Oversharing + fehlende Governance erzeugen neue Angriffswege.
            </div>
            <div
              style={{
                color: PALETTE.text,
                fontSize: 11,
                lineHeight: 1.24,
                fontFamily: PALETTE.body,
              }}
            >
              Gute Steuerung startet mit vertrauenswuerdigen, klar begrenzten Use Cases und skaliert
              erst dann.
            </div>
          </DenseEditorialCard>
        </div>
      </SurfacePanel>
    </div>

    <DenseStatementStrip tone="signal" style={{ fontSize: 12, lineHeight: 1.06, padding: "6px 10px" }}>
      AI Agents brauchen kein Sondermarketing, sondern sauberes IAM: eigene Identitaet, menschliche
      Verantwortung, enge Rechte, kontrollierte Tool-Zugriffe und einen vollstaendigen Lifecycle.
    </DenseStatementStrip>
  </div>
);

const AiAgentsIdentitiesSlide: CodeSlide = {
  id: "diw-24-ai-agents-identities",
  name: "24 · AI Agents und nicht-menschliche Identitäten",
  description: "Zukunftsfolie zu Agenten, Maschinenidentitäten und Governance.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default AiAgentsIdentitiesSlide;
