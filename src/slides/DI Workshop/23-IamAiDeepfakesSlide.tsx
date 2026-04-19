import * as React from "react";
import type { CodeSlide } from "../types";
import { PALETTE, StandardTitle, mix } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Zukunft und Relevanz"
    title="Warum IAM durch KI und Deepfakes wichtiger wird"
  />
);

const BulletRow: React.FC<{
  text: string;
  tone: "risk" | "signal" | "ai" | "primary" | "trust";
}> = ({ text, tone }) => {
  const color =
    tone === "risk"
      ? PALETTE.risk
      : tone === "signal"
        ? PALETTE.signal
        : tone === "ai"
          ? PALETTE.ai
          : tone === "primary"
            ? PALETTE.primary
            : PALETTE.trust;

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
  tone: "risk" | "signal";
  rows: Array<{
    text: string;
    tone: "risk" | "signal" | "ai" | "primary" | "trust";
  }>;
}> = ({ eyebrow, title, tone, rows }) => {
  const color = tone === "risk" ? PALETTE.risk : PALETTE.signal;

  return (
    <div
      style={{
        borderRadius: 20,
        padding: "4.8% 5%",
        background: mix(color, PALETTE.bg, 10),
        border: `2px solid ${mix(color, PALETTE.bg, 58)}`,
        display: "grid",
        gridTemplateRows: "auto auto 1fr",
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
        PALETTE.primary,
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
        background: mix(PALETTE.primary, PALETTE.bg, 10),
        border: `2px solid ${mix(PALETTE.primary, PALETTE.bg, 60)}`,
        color: PALETTE.text,
        fontSize: 15,
        lineHeight: 1.22,
        fontFamily: PALETTE.heading,
      }}
    >
      Deepfakes greifen nicht nur Menschen an, sondern auch biometrische und automatisierte
      Identitaetspruefungen.
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
        eyebrow="Wie der Angriff wirkt"
        title="Warum der Druck steigt"
        tone="risk"
        rows={[
          { text: "Biometrische Pruefungen koennen gezielt getaescht werden", tone: "risk" },
          {
            text: "Menschen geraten in Freigabe- und Rueckrufsituationen unter Druck",
            tone: "signal",
          },
          {
            text: "KI macht Imitation und Angriffsvorbereitung schneller und billiger",
            tone: "ai",
          },
          {
            text: "Einzelne Deepfake-Erkennung ist keine ausreichend starke Kontrolle",
            tone: "primary",
          },
        ]}
      />
      <ColumnCard
        eyebrow="Welche IAM-Antwort folgt"
        title="Was jetzt tragen muss"
        tone="signal"
        rows={[
          { text: "Robuste MFA fuer kritische Zugaenge und Aktionen", tone: "primary" },
          {
            text: "Starke Rueckruf-, Verifikations- und Freigabeprozesse",
            tone: "trust",
          },
          { text: "Weitere Risikosignale statt Vertrauen auf eine Einzelpruefung", tone: "signal" },
          { text: "Detection und Response fuer Identitaetsbedrohungen", tone: "ai" },
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
      KI ersetzt IAM nicht. KI macht starke Kontrollschichten dringlicher.
    </div>
  </div>
);

const IamAiDeepfakesSlide: CodeSlide = {
  id: "diw-23-iam-ai-deepfakes",
  name: "23 · Warum IAM durch KI und Deepfakes wichtiger wird",
  description: "Zukunftsfolie zu Deepfakes, KI und gestärkten IAM-Kontrollen.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default IamAiDeepfakesSlide;
