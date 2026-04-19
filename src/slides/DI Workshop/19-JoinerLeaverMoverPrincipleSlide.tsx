import * as React from "react";
import { ArrowLeftRight, DoorOpen, UserPlus, UserRound } from "lucide-react";
import {
  FooterBand,
  HeroBand,
  MetaBadge,
  PALETTE,
  mix,
} from "./_shared";
import type { CodeSlide } from "../types";

const principleTone = "deep";
const principleColor = PALETTE.deep;
const principleSurface = mix(principleColor, PALETTE.bg, 10);
const principleBorder = mix(principleColor, "transparent", 24);

const pointCards = [
  {
    key: "joiner",
    title: "Passende Startrechte",
    text: "Neue Personen brauchen einen belastbaren Startpunkt statt zu großer Standardpakete.",
    icon: <UserPlus size={18} />,
  },
  {
    key: "mover",
    title: "Alte Rechte entziehen",
    text: "Bei Rollenwechseln müssen frühere Zusatzrechte konsequent entfernt werden.",
    icon: <ArrowLeftRight size={18} />,
  },
  {
    key: "leaver",
    title: "Rechtzeitig deaktivieren",
    text: "Nach Austritt oder Statuswechsel dürfen Zugriffe nicht unkontrolliert weiterlaufen.",
    icon: <DoorOpen size={18} />,
  },
  {
    key: "accounts",
    title: "Verantwortung sichtbar halten",
    text: "Sammelkonten und unklare Zuordnungen schwächen Nachvollziehbarkeit und Kontrolle.",
    icon: <UserRound size={18} />,
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
            16,
          )})`,
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
          Prinzipien-Slide · Team C
        </div>
        <div
          className="truncate text-[26px] font-semibold leading-[1.04]"
          style={{ color: principleColor, fontFamily: PALETTE.heading }}
        >
          Joiner-Leaver-Mover
        </div>
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone={principleTone}>Prinzip</MetaBadge>
      <MetaBadge tone="trust">Lifecycle</MetaBadge>
      <MetaBadge tone="outline">Passen Rechte noch?</MetaBadge>
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
        title="Rechte müssen sich mit Eintritt, Wechsel und Austritt einer Person verändern."
        subtitle="Joiner-Leaver-Mover macht aus Zugriffsverwaltung einen laufenden Lifecycle statt einen einmaligen Vergabemoment."
        kicker={<MetaBadge tone="outline">Kleingruppe 6</MetaBadge>}
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
          Passen Konto und Rechte noch zur aktuellen Person und Aufgabe?
        </div>
        <div
          className="mt-3 text-[11px] leading-snug"
          style={{ color: PALETTE.text }}
        >
          Die Folie schaut auf Pflege über die Zeit, nicht nur auf den Zustand
          in einem einzigen Prozessmoment.
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
              background: mix(principleColor, PALETTE.bg, 7),
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
            10,
          )}, ${mix(principleColor, PALETTE.bg, 90)})`,
          border: `1px solid ${mix(PALETTE.risk, "transparent", 24)}`,
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
            Schlechte Rollen- und Kontenpflege erzeugt über Zeit immer mehr
            unsichtbare Sicherheitslücken.
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
            Im Vortrag zeigen, wo Rechte nicht mehr zum aktuellen Status der
            Person passen.
          </div>
        </div>
      </div>
    </div>

    <FooterBand
      title="Merksatz"
      tone={principleTone}
      text="Joiner-Leaver-Mover hält Rechte über den gesamten Lebenszyklus passend, sichtbar und verantwortbar."
    />
  </div>
);

const JoinerLeaverMoverPrincipleSlide: CodeSlide = {
  id: "diw-19-joiner-leaver-mover-principle",
  name: "19 · Joiner-Leaver-Mover",
  description:
    "Studentische Prinzipienfolie zu Joiner-Leaver-Mover mit Definition, Leitfrage, Kernpunkten und Risikosatz.",
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

export default JoinerLeaverMoverPrincipleSlide;
