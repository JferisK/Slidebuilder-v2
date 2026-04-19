import * as React from "react";
import type { CodeSlide } from "../types";
import { PALETTE, StandardTitle, mix } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Operating Model für neue Identitäten"
    title="AI Agents und nicht-menschliche Identitäten"
  />
);

const BulletRow: React.FC<{
  text: string;
  tone: "primary" | "trust" | "signal";
}> = ({ text, tone }) => {
  const color = tone === "primary" ? PALETTE.primary : tone === "trust" ? PALETTE.trust : PALETTE.signal;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "10px 1fr",
        gap: 10,
        alignItems: "start",
        padding: "8px 0",
        borderBottom: `1px solid ${mix(color, PALETTE.bg, 74)}`,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          marginTop: 5,
          background: color,
        }}
      />
      <div
        style={{
          color: PALETTE.text,
          fontSize: 14,
          lineHeight: 1.24,
          fontFamily: PALETTE.body,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const ColumnCard: React.FC<{
  eyebrow: string;
  title: string;
  tone: "primary" | "signal";
  intro?: string;
  rows: Array<{
    text: string;
    tone: "primary" | "trust" | "signal";
  }>;
}> = ({ eyebrow, title, tone, intro, rows }) => {
  const color = tone === "primary" ? PALETTE.primary : PALETTE.signal;

  return (
    <div
      style={{
        borderRadius: 20,
        padding: "4.8% 5%",
        background: mix(color, PALETTE.bg, 10),
        border: `2px solid ${mix(color, PALETTE.bg, 58)}`,
        display: "grid",
        gridTemplateRows: intro ? "auto auto auto 1fr" : "auto auto 1fr",
        gap: 8,
        height: "100%",
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color,
          fontFamily: PALETTE.body,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          color: PALETTE.text,
          fontSize: 19,
          lineHeight: 1.08,
          fontFamily: PALETTE.heading,
        }}
      >
        {title}
      </div>
      {intro ? (
        <div
          style={{
            borderRadius: 14,
            padding: "10px 12px",
            background: mix(PALETTE.bg, color, 12),
            border: `2px solid ${mix(color, PALETTE.bg, 62)}`,
            color: PALETTE.text,
            fontSize: 14,
            lineHeight: 1.22,
            fontFamily: PALETTE.body,
          }}
        >
          {intro}
        </div>
      ) : null}
      <div style={{ display: "grid" }}>
        {rows.map((row) => (
          <BulletRow key={row.text} text={row.text} tone={row.tone} />
        ))}
      </div>
    </div>
  );
};

const BodySlot: React.FC = () => (
  <div
    style={{
      height: "100%",
      display: "grid",
      gap: 10,
      gridTemplateRows: "auto 1fr auto",
      borderRadius: 24,
      padding: "2.2%",
      background: `linear-gradient(180deg, ${mix(PALETTE.bg, PALETTE.secondary, 94)}, ${mix(
        PALETTE.signal,
        PALETTE.bg,
        6,
      )})`,
      border: `2px solid ${mix(PALETTE.primary, PALETTE.bg, 60)}`,
    }}
  >
    <div
      style={{
        borderRadius: 16,
        padding: "10px 14px",
        background: mix(PALETTE.deep, PALETTE.bg, 12),
        border: `2px solid ${mix(PALETTE.deep, PALETTE.bg, 54)}`,
        color: PALETTE.bg,
        fontSize: 15,
        lineHeight: 1.22,
        fontFamily: PALETTE.heading,
      }}
    >
      AI Agents sind nicht nur Tools, sondern eine neue Identitaetsklasse mit eigenen Rechten und Risiken.
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        minHeight: 0,
      }}
    >
      <ColumnCard
        eyebrow="Neue Realitaet"
        title="Was neu ist"
        tone="primary"
        intro="Services, Bots, Skripte und AI Agents handeln als Identitaeten."
        rows={[
          { text: "Jeder Agent braucht eine eigene Identitaet", tone: "primary" },
          { text: "Jeder Agent braucht eine verantwortliche Person", tone: "trust" },
          { text: "Agenten muessen klar von anderen Rollen und Konten getrennt werden", tone: "signal" },
        ]}
      />
      <ColumnCard
        eyebrow="Was IAM dafuer leisten muss"
        title="Welche Steuerung noetig ist"
        tone="signal"
        rows={[
          { text: "Enge, aufgabenspezifische Rechte statt breitem Zugriff", tone: "primary" },
          { text: "Klare Kontrolle ueber Tools, Daten und Aktionen", tone: "trust" },
          { text: "Logging und Nachvollziehbarkeit fuer das Handeln des Agents", tone: "signal" },
          { text: "Lifecycle von Registrierung bis Aenderung und Abschaltung", tone: "primary" },
        ]}
      />
    </div>

    <div
      style={{
        borderRadius: 14,
        padding: "9px 12px",
        background: mix(PALETTE.secondary, PALETTE.bg, 54),
        border: `1px solid ${mix(PALETTE.primary, PALETTE.bg, 72)}`,
        color: PALETTE.text,
        fontSize: 13,
        lineHeight: 1.2,
        fontFamily: PALETTE.heading,
        textAlign: "center",
      }}
    >
      AI Agents brauchen eigene Identitaet, klares Ownership und kontrollierten Scope ueber den gesamten Lifecycle.
    </div>
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
