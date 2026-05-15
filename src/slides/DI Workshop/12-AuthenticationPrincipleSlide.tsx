import * as React from "react";
import { Fingerprint, KeyRound, ShieldCheck, TimerReset } from "lucide-react";
import {
  FooterBand,
  HeroBand,
  MetaBadge,
  PALETTE,
  mix,
} from "./_shared";
import type { CodeSlide } from "../types";

const principleTone = "primary";
const principleColor = PALETTE.primary;
const principleSurface = mix(principleColor, PALETTE.bg, 8);
const principleBorder = mix(principleColor, "transparent", 24);

const pointCards = [
  {
    key: "login",
    title: "Login und Identitätsnachweis",
    text: "Der Einstieg prüft zuerst, ob die behauptete Identität belastbar nachgewiesen werden kann.",
    icon: <KeyRound size={18} />,
  },
  {
    key: "factors",
    title: "Mehrere Faktoren",
    text: "Wissen, Besitz oder Biometrie erhöhen die Sicherheit, wenn das Risiko steigt.",
    icon: <Fingerprint size={18} />,
  },
  {
    key: "protection",
    title: "Schutz vor Fremdzugriff",
    text: "Eine starke Authentifizierung senkt die Chance, dass Unbefugte überhaupt starten können.",
    icon: <ShieldCheck size={18} />,
  },
  {
    key: "sessions",
    title: "Sessions gehören dazu",
    text: "Auch nach dem Login muss die Identität über die Sitzung hinweg glaubwürdig gesichert bleiben.",
    icon: <TimerReset size={18} />,
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
            22,
          )})`,
          color: PALETTE.bg,
        }}
      >
        <Fingerprint size={22} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: PALETTE.muted }}
        >
          Prinzipien-Slide · Team A
        </div>
        <div
          className="truncate text-[26px] font-semibold leading-[1.04]"
          style={{ color: principleColor, fontFamily: PALETTE.heading }}
        >
          Authentifizierung
        </div>
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone={principleTone}>Prinzip</MetaBadge>
      <MetaBadge tone="signal">Identität</MetaBadge>
      <MetaBadge tone="outline">Wer bist du?</MetaBadge>
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
        title="Authentifizierung prüft, ob eine behauptete Identität echt ist."
        subtitle="Die Frage lautet nicht nur, ob jemand hereinkommt, sondern ob das System der richtigen Identität vertraut."
        kicker={<MetaBadge tone="outline">Kleingruppe 1</MetaBadge>}
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
          Woher weiß das System, dass du wirklich du bist?
        </div>
        <div
          className="mt-3 text-[11px] leading-snug"
          style={{ color: PALETTE.text }}
        >
          Die Folie liefert das Prinzip. Konkrete Beobachtungen aus der App
          werden erst in der Präsentation mündlich ergänzt.
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
            Wenn Authentifizierung schwach ist, startet jedes weitere Problem
            auf einem unsicheren Fundament.
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
            Erst das Prinzip sauber erklären, dann passende Beobachtungen aus
            der App mündlich daran anknüpfen.
          </div>
        </div>
      </div>
    </div>

    <FooterBand
      title="Merksatz"
      tone={principleTone}
      text="Authentifizierung beantwortet die Identitätsfrage vor jeder weiteren Zugriffsentscheidung."
    />
  </div>
);

const AuthenticationPrincipleSlide: CodeSlide = {
  id: "diw-12-authentication-principle",
  name: "12 · Authentifizierung",
  description:
    "Studentische Prinzipienfolie zur Authentifizierung mit Definition, Leitfrage, Kernpunkten und Risikosatz.",
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

export default AuthenticationPrincipleSlide;
