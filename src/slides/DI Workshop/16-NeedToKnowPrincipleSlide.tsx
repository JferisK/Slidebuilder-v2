import * as React from "react";
import { Eye, FileSearch, MessagesSquare, ShieldAlert } from "lucide-react";
import {
  FooterBand,
  HeroBand,
  MetaBadge,
  PALETTE,
  mix,
} from "./_shared";
import type { CodeSlide } from "../types";

const principleTone = "ai";
const principleColor = PALETTE.ai;
const principleSurface = mix(principleColor, PALETTE.bg, 8);
const principleBorder = mix(principleColor, "transparent", 24);

const pointCards = [
  {
    key: "visibility",
    title: "Sichtbarkeit folgt Aufgabe",
    text: "Nicht jede beteiligte Person braucht denselben Informationsumfang.",
    icon: <Eye size={18} />,
  },
  {
    key: "sensitive",
    title: "Sensible Inhalte enger fassen",
    text: "Personenbezogene, finanzielle oder interne Kontexte brauchen engere Grenzen.",
    icon: <ShieldAlert size={18} />,
  },
  {
    key: "context",
    title: "Kontext ist entscheidend",
    text: "Auch wenn jemand mitarbeitet, muss nicht jeder Einblick fachlich nötig sein.",
    icon: <FileSearch size={18} />,
  },
  {
    key: "exports",
    title: "Exporte und Kommentare",
    text: "Gerade verdichtete Daten und interne Notizen werden schnell zu kritischen Sichtbarkeitsfällen.",
    icon: <MessagesSquare size={18} />,
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
          background: `linear-gradient(145deg, ${principleColor}, ${mix(
            PALETTE.primary,
            principleColor,
            18,
          )})`,
          color: PALETTE.bg,
        }}
      >
        <Eye size={22} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: PALETTE.muted }}
        >
          Prinzipien-Slide · Team B
        </div>
        <div
          className="truncate text-[26px] font-semibold leading-[1.04]"
          style={{ color: principleColor, fontFamily: PALETTE.heading }}
        >
          Need to Know
        </div>
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone={principleTone}>Prinzip</MetaBadge>
      <MetaBadge tone="trust">Sichtbarkeit</MetaBadge>
      <MetaBadge tone="outline">Was darfst du sehen?</MetaBadge>
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div
    className="grid h-full w-full grid-rows-[auto_1fr_auto] gap-4"
    style={{ fontFamily: PALETTE.body }}
  >
    <div className="grid grid-cols-[1.08fr_0.92fr] gap-4">
      <HeroBand
        eyebrow="Definition"
        tone={principleTone}
        title="Nicht jede Person muss jede Information sehen."
        subtitle="Need to Know begrenzt den Einblick auf den fachlich nötigen Informationsumfang."
        kicker={<MetaBadge tone="outline">Kleingruppe 4</MetaBadge>}
      />

      <div
        className="rounded-[26px] p-5"
        style={{
          background: principleSurface,
          border: `1px solid ${principleBorder}`,
        }}
      >
        <div
          className="text-[10px] uppercase tracking-[0.18em]"
          style={{ color: PALETTE.muted }}
        >
          Leitfrage
        </div>
        <div
          className="mt-2 text-[22px] font-semibold leading-[1.08]"
          style={{ color: principleColor, fontFamily: PALETTE.heading }}
        >
          Welche Informationen braucht diese Rolle wirklich?
        </div>
        <div
          className="mt-3 text-[11px] leading-snug"
          style={{ color: PALETTE.text }}
        >
          Die Folie fokussiert auf Einblick und Wissensumfang, nicht auf
          Handlungsspielraum.
        </div>
      </div>
    </div>

    <div className="grid min-h-0 grid-cols-[1.18fr_0.82fr] gap-4">
      <div className="grid min-h-0 grid-cols-2 gap-3">
        {pointCards.map((card) => (
          <div
            key={card.key}
            className="rounded-[24px] p-4"
            style={{
              background: mix(principleColor, PALETTE.bg, 6),
              border: `1px solid ${mix(principleColor, "transparent", 20)}`,
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[14px]"
              style={{
                background: mix(principleColor, PALETTE.bg, 14),
                color: principleColor,
              }}
            >
              {card.icon}
            </div>
            <div
              className="mt-3 text-[14px] font-semibold leading-tight"
              style={{ color: principleColor, fontFamily: PALETTE.heading }}
            >
              {card.title}
            </div>
            <div
              className="mt-2 text-[10px] leading-snug"
              style={{ color: PALETTE.muted }}
            >
              {card.text}
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex flex-col justify-between rounded-[28px] p-5"
        style={{
          background: `linear-gradient(160deg, ${mix(
            PALETTE.risk,
            PALETTE.bg,
            12,
          )}, ${mix(PALETTE.deep, PALETTE.bg, 92)})`,
          border: `1px solid ${mix(PALETTE.risk, "transparent", 26)}`,
        }}
      >
        <div>
          <div
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            Risiko
          </div>
          <div
            className="mt-2 text-[22px] font-semibold leading-[1.06]"
            style={{ color: PALETTE.bg, fontFamily: PALETTE.heading }}
          >
            Zu breite Sichtbarkeit kann schon ohne aktive Manipulation großen
            Schaden anrichten.
          </div>
        </div>
        <div
          className="rounded-[20px] p-4"
          style={{
            background: mix(PALETTE.bg, "transparent", 8),
            border: `1px solid ${mix(PALETTE.bg, "transparent", 18)}`,
          }}
        >
          <div
            className="text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "rgba(255,255,255,0.68)" }}
          >
            Präsentationslogik
          </div>
          <div
            className="mt-2 text-[10px] leading-snug"
            style={{ color: "rgba(255,255,255,0.82)" }}
          >
            Im Vortrag erklären, wo zu viel Information sichtbar wird, ohne
            konkrete Lösungsbeweise auf die Folie zu schreiben.
          </div>
        </div>
      </div>
    </div>

    <FooterBand
      title="Merksatz"
      tone={principleTone}
      text="Need to Know begrenzt Sichtbarkeit und Wissensumfang auf das fachlich Erforderliche."
    />
  </div>
);

const NeedToKnowPrincipleSlide: CodeSlide = {
  id: "diw-16-need-to-know-principle",
  name: "16 · Need to Know",
  description:
    "Studentische Prinzipienfolie zu Need to Know mit Definition, Leitfrage, Kernpunkten und Risikosatz.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Prinzipientitel mit Team- und Themenbadges.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description:
        "Definition, Leitfrage, vier Kernpunkte und ein klarer Risikoblock.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default NeedToKnowPrincipleSlide;
