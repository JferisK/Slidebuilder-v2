import * as React from "react";
import { ArrowLeftRight, SplitSquareVertical } from "lucide-react";
import {
  FooterBand,
  HeroBand,
  MetaBadge,
  PALETTE,
  mix,
} from "./_shared";
import type { CodeSlide } from "../types";

const leftColor = PALETTE.risk;
const rightColor = PALETTE.deep;

const columns = [
  {
    key: "sod",
    eyebrow: "Segregation of Duties",
    question: "Welche kritischen Schritte müssen getrennt werden?",
    focus: "Prozesse, Rollen, Kontrollpunkte",
    text: "Die linke Seite betrachtet die Kontrollarchitektur eines Ablaufs und die bewusste Trennung kritischer Schritte.",
    color: leftColor,
    icon: <SplitSquareVertical size={20} />,
  },
  {
    key: "jlm",
    eyebrow: "Joiner-Leaver-Mover",
    question: "Passen Rechte noch zur Person und zur aktuellen Rolle?",
    focus: "Eintritt, Wechsel, Austritt, Rechtepflege",
    text: "Die rechte Seite betrachtet Pflege, Aktualisierung und Verantwortung von Rechten über die Zeit.",
    color: rightColor,
    icon: <ArrowLeftRight size={20} />,
  },
] as const;

const TitleSlot: React.FC = () => (
  <div
    className="flex h-full w-full items-center justify-between gap-4"
    style={{ fontFamily: PALETTE.body }}
  >
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="flex h-12 w-12 flex-none items-center justify-center rounded-[18px]"
        style={{
          background: `linear-gradient(145deg, ${leftColor}, ${rightColor})`,
          color: PALETTE.bg,
        }}
      >
        <ArrowLeftRight size={22} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: PALETTE.muted }}
        >
          Vergleichs-Slide · Team C
        </div>
        <div
          className="truncate text-[26px] font-semibold leading-[1.04]"
          style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
        >
          Segregation of Duties vs. Joiner-Leaver-Mover
        </div>
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone="risk">Schritte trennen</MetaBadge>
      <MetaBadge tone="deep">Rechte pflegen</MetaBadge>
      <MetaBadge tone="outline">Vergleich</MetaBadge>
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div
    className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-4"
    style={{ fontFamily: PALETTE.body }}
  >
    <HeroBand
      eyebrow="Unterscheidung"
      tone="deep"
      title="Prozesskontrolle und Rechtepflege hängen zusammen, beantworten aber unterschiedliche Kernfragen."
      subtitle="Die Folie trennt die Logik von Kontrollpunkten im Ablauf und die Logik von Berechtigungspflege über den Lebenszyklus."
      kicker={
        <div className="flex gap-2">
          <MetaBadge tone="risk">Prozess</MetaBadge>
          <MetaBadge tone="deep">Lifecycle</MetaBadge>
        </div>
      }
    />

    <div className="grid min-h-0 grid-cols-2 gap-4">
      {columns.map((column) => (
        <div
          key={column.key}
          className="flex min-h-0 flex-col rounded-[30px] p-5"
          style={{
            background: mix(column.color, PALETTE.bg, 7),
            border: `1px solid ${mix(column.color, "transparent", 24)}`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{ color: PALETTE.muted }}
              >
                {column.eyebrow}
              </div>
              <div
                className="mt-2 text-[24px] font-semibold leading-[1.06]"
                style={{ color: column.color, fontFamily: PALETTE.heading }}
              >
                {column.question}
              </div>
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[15px]"
              style={{
                background: mix(column.color, PALETTE.bg, 15),
                color: column.color,
              }}
            >
              {column.icon}
            </div>
          </div>

          <div
            className="mt-4 rounded-[22px] p-4"
            style={{
              background: mix(column.color, PALETTE.bg, 11),
              border: `1px solid ${mix(column.color, "transparent", 18)}`,
            }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.16em]"
              style={{ color: PALETTE.muted }}
            >
              Fokus
            </div>
            <div
              className="mt-2 text-[16px] font-semibold leading-tight"
              style={{ color: column.color, fontFamily: PALETTE.heading }}
            >
              {column.focus}
            </div>
          </div>

          <div
            className="mt-4 flex-1 text-[11px] leading-snug"
            style={{ color: PALETTE.text }}
          >
            {column.text}
          </div>
        </div>
      ))}
    </div>

    <FooterBand
      title="Verbindung"
      tone="trust"
      text="Schlechtes Lifecycle-Management kann später auch SoD-Probleme erzeugen. Im Vortrag daher Ablauf und Zeitdimension getrennt einordnen."
    />
  </div>
);

const SodVsJlmComparisonSlide: CodeSlide = {
  id: "diw-20-sod-vs-jlm",
  name: "20 · Segregation of Duties vs. Joiner-Leaver-Mover",
  description:
    "Vergleichsfolie zur klaren Trennung zwischen Prozesskontrolle und Rechtepflege über den Lebenszyklus.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Vergleichstitel mit Merksatz-Badges.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description:
        "Symmetrische Zweispaltenfolie mit Leitfrage, Fokus und Verbindungssatz.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default SodVsJlmComparisonSlide;
