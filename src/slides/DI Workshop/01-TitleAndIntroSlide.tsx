import * as React from "react";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { FooterBand, HeroBand, MetaBadge, PALETTE, SignalPill, mix } from "./_shared";
import type { CodeSlide } from "../types";

const TitleSlot: React.FC = () => (
  <div className="flex h-full w-full items-center justify-between gap-4">
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="flex h-12 w-12 flex-none items-center justify-center rounded-[18px]"
        style={{
          background: `linear-gradient(145deg, ${PALETTE.primary}, ${PALETTE.trust})`,
          color: PALETTE.bg,
        }}
      >
        <ShieldAlert size={22} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.18em]"
          style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
        >
          IAM 101 Workshop
        </div>
        <div
          className="truncate text-[26px] font-semibold leading-[1.04]"
          style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
        >
          Identity &amp; Access Management 101
        </div>
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone="primary">Cyber Security</MetaBadge>
      <MetaBadge tone="trust">Workshop</MetaBadge>
      <MetaBadge tone="outline">Spesen-App</MetaBadge>
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div className="grid h-full w-full grid-cols-[1.08fr_0.92fr] gap-4">
    <div className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-4">
      <HeroBand
        eyebrow="Workshop entry"
        title={
          <>
            Wie falsche Zugriffe
            <br />
            echte Risiken erzeugen
          </>
        }
        subtitle="Heute geht es nicht um abstrakte Definitionen, sondern um die Frage, wie Identitaeten, Rechte und Kontrollen in einem realistisch unsicheren System zusammenspielen."
        kicker={<SignalPill label="praxisorientierter Einstieg" tone="trust" />}
      />

      <div
        className="grid min-h-0 grid-cols-[1.1fr_0.9fr] gap-4 rounded-[28px] p-5"
        style={{
          background: `linear-gradient(160deg, ${mix(PALETTE.secondary, PALETTE.bg, 78)}, ${mix(
            PALETTE.primary,
            PALETTE.bg,
            8,
          )})`,
          border: `1px solid ${mix(PALETTE.primary, "transparent", 20)}`,
        }}
      >
        <div className="flex flex-col justify-between gap-4">
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.16em]"
              style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
            >
              Kontext
            </div>
            <div
              className="mt-2 text-[16px] font-semibold leading-tight"
              style={{ color: PALETTE.text, fontFamily: PALETTE.heading }}
            >
              Workshop mit einer absichtlich unsicheren Spesen-App
            </div>
            <div
              className="mt-2 text-[11px] leading-snug"
              style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
            >
              Die App ist nicht Beiwerk. Sie ist die Lernumgebung, in der die
              Studierenden spaeter die sechs IAM-Prinzipien selbst entdecken und
              einordnen.
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <SignalPill label="Identitaet" tone="primary" />
            <SignalPill label="Zugriff" tone="signal" />
            <SignalPill label="Kontrolle" tone="trust" />
            <SignalPill label="Risiko" tone="risk" />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="grid w-full grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3">
            {[
              { label: "Identitaet", tone: PALETTE.primary },
              { label: "Zugriff", tone: PALETTE.signal },
              { label: "Risiko", tone: PALETTE.risk },
            ].map((item, index) => (
              <React.Fragment key={item.label}>
                <div
                  className="flex min-h-[7.5rem] items-center justify-center rounded-[24px] px-3 text-center"
                  style={{
                    background: mix(item.tone, PALETTE.bg, 14),
                    border: `1px solid ${mix(item.tone, "transparent", 24)}`,
                    color: item.tone,
                    fontFamily: PALETTE.heading,
                  }}
                >
                  <span className="text-[18px] font-semibold leading-tight">{item.label}</span>
                </div>
                {index < 2 ? (
                  <div className="flex justify-center" aria-hidden="true">
                    <ArrowRight size={24} style={{ color: PALETTE.muted }} />
                  </div>
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <FooterBand
        title="Einstieg"
        text="Ziel der Folie: Relevanz setzen, Ton setzen, aber die sechs Prinzipien noch nicht frontal erklaeren."
        tone="primary"
      />
    </div>
    <div
      className="flex h-full flex-col justify-between rounded-[28px] p-5"
      style={{
        background: `linear-gradient(180deg, ${mix(PALETTE.primary, PALETTE.bg, 10)}, ${mix(
          PALETTE.deep,
          PALETTE.bg,
          92,
        )})`,
        border: `1px solid ${mix(PALETTE.deep, "transparent", 18)}`,
      }}
    >
      <div>
        <div
          className="text-[10px] uppercase tracking-[0.16em]"
          style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
        >
          Was diese Folie nicht tut
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {[
            "keine sechs Prinzipien",
            "keine Definitionen",
            "keine Agenda im Detail",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[20px] px-4 py-3 text-[12px] leading-snug"
              style={{
                background: mix(PALETTE.bg, "transparent", 42),
                border: `1px solid ${mix(PALETTE.bg, "transparent", 18)}`,
                color: PALETTE.text,
                fontFamily: PALETTE.body,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-[22px] px-4 py-4"
        style={{
          background: mix(PALETTE.trust, PALETTE.bg, 12),
          border: `1px solid ${mix(PALETTE.trust, "transparent", 24)}`,
        }}
      >
        <div
          className="text-[10px] uppercase tracking-[0.16em]"
          style={{ color: PALETTE.trust, fontFamily: PALETTE.heading }}
        >
          Uebergang
        </div>
        <div
          className="mt-2 text-[13px] leading-snug"
          style={{ color: PALETTE.text, fontFamily: PALETTE.body }}
        >
          Bevor wir in die App gehen, schauen wir uns kurz an, wie der
          Workshop aufgebaut ist.
        </div>
      </div>
    </div>
  </div>
);

const TitleAndIntroSlide: CodeSlide = {
  id: "diw-01-title-intro",
  name: "01 · Titel und Einstieg",
  description:
    "Auftaktfolie fuer den IAM-101-Workshop mit klarer Relevanz, Kontext zur Spesen-App und einfachem Signalfluss Identitaet -> Zugriff -> Risiko.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Deck-Titel mit Workshop-Metadaten.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Hero-Zone, Kontext und Einstiegsvisual.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default TitleAndIntroSlide;
