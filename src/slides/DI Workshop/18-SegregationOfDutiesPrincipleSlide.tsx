import * as React from "react";
import { GitFork, ShieldAlert, SplitSquareVertical, Stamp } from "lucide-react";
import {
  FooterBand,
  HeroBand,
  MetaBadge,
  PALETTE,
  mix,
} from "./_shared";
import type { CodeSlide } from "../types";

const principleTone = "risk";
const principleColor = PALETTE.risk;
const principleSurface = mix(principleColor, PALETTE.bg, 8);
const principleBorder = mix(principleColor, "transparent", 24);

const pointCards = [
  {
    key: "critical",
    title: "Kritische Schritte trennen",
    text: "Antrag, Genehmigung, Ausführung und Kontrolle gehören nicht in eine einzige Hand.",
    icon: <SplitSquareVertical size={18} />,
  },
  {
    key: "self",
    title: "Selbstfreigaben vermeiden",
    text: "Gerade Selbstgenehmigungen untergraben die eigentliche Kontrollwirkung besonders stark.",
    icon: <Stamp size={18} />,
  },
  {
    key: "exceptions",
    title: "Ausnahmen stärker sichern",
    text: "Sonderfälle brauchen meist mehr Kontrolle, nicht weniger.",
    icon: <ShieldAlert size={18} />,
  },
  {
    key: "evidence",
    title: "Nachweise geschützt halten",
    text: "Auch Logs und Kontrollspuren dürfen nicht beliebig vom selben Kreis manipulierbar sein.",
    icon: <GitFork size={18} />,
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
            PALETTE.deep,
            principleColor,
            18,
          )})`,
          color: PALETTE.bg,
        }}
      >
        <SplitSquareVertical size={22} />
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
          Segregation of Duties
        </div>
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone={principleTone}>Prinzip</MetaBadge>
      <MetaBadge tone="deep">Kontrollpunkte</MetaBadge>
      <MetaBadge tone="outline">Welche Schritte trennen?</MetaBadge>
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
        title="Kritische Schritte werden auf mehrere Rollen oder Personen verteilt."
        subtitle="Segregation of Duties schützt Prozesse dort, wo einzelne Akteure sonst zu viel Kontrolle bündeln würden."
        kicker={<MetaBadge tone="outline">Kleingruppe 5</MetaBadge>}
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
          Wer darf beantragen, wer genehmigen, wer auszahlen und wer
          kontrollieren?
        </div>
        <div
          className="mt-3 text-[11px] leading-snug"
          style={{ color: PALETTE.text }}
        >
          Die Folie fokussiert auf Ablauf und Kontrollarchitektur, nicht auf
          einzelne App-Beispiele.
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
            principleColor,
            PALETTE.bg,
            16,
          )}, ${mix(PALETTE.deep, PALETTE.bg, 92)})`,
          border: `1px solid ${mix(principleColor, "transparent", 26)}`,
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
            Wenn eine Person zu viele kritische Schritte kontrolliert, sinkt die
            Kontrollwirkung drastisch.
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
            Im Vortrag auf Prozessketten schauen: Wo bündelt sich zu viel Macht
            an einem Punkt?
          </div>
        </div>
      </div>
    </div>

    <FooterBand
      title="Merksatz"
      tone={principleTone}
      text="Segregation of Duties schützt Prozesse, indem kritische Schritte bewusst voneinander getrennt werden."
    />
  </div>
);

const SegregationOfDutiesPrincipleSlide: CodeSlide = {
  id: "diw-18-segregation-of-duties-principle",
  name: "18 · Segregation of Duties",
  description:
    "Studentische Prinzipienfolie zu Segregation of Duties mit Definition, Leitfrage, Kernpunkten und Risikosatz.",
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

export default SegregationOfDutiesPrincipleSlide;
