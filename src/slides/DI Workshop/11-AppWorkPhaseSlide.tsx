import * as React from "react";
import { FilePenLine, Search, Shapes } from "lucide-react";
import { FooterBand, HeroBand, MetaBadge, PALETTE, SignalPill, mix } from "./_shared";
import type { CodeSlide } from "../types";

const reminders = [
  { label: "systematisch erkunden", icon: Search, tone: PALETTE.primary },
  { label: "Beobachtungen notieren", icon: FilePenLine, tone: PALETTE.signal },
  { label: "spaeter mit eurer Slide verbinden", icon: Shapes, tone: PALETTE.trust },
];

const TitleSlot: React.FC = () => (
  <div className="flex h-full w-full items-center justify-between gap-4">
    <div>
      <div
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
      >
        Holding slide
      </div>
      <div
        className="text-[26px] font-semibold leading-[1.04]"
        style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
      >
        Arbeitsphase: App erkunden und Beobachtungen sammeln
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone="primary">ruhig halten</MetaBadge>
      <MetaBadge tone="outline">keine neue Theorie</MetaBadge>
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div className="grid h-full w-full grid-cols-[0.88fr_1.12fr] gap-4">
    <div className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-4">
      <HeroBand
        eyebrow="Arbeitsphase"
        tone="trust"
        title={
          <>
            Jetzt bleibt die Folie
            <br />
            bewusst im Hintergrund.
          </>
        }
        subtitle="Keine neue Theorie, keine Beispiele, keine Prinzipienliste. Die Aufmerksamkeit soll in der App und in den Beobachtungen der Gruppen liegen."
        kicker={
          <div className="flex flex-wrap gap-2">
            <SignalPill label="beobachten" tone="primary" />
            <SignalPill label="notieren" tone="signal" />
            <SignalPill label="verbinden" tone="trust" />
          </div>
        }
      />

      <div
        className="rounded-[28px] p-5"
        style={{
          background: mix(PALETTE.secondary, PALETTE.bg, 78),
          border: `1px solid ${mix(PALETTE.primary, "transparent", 18)}`,
        }}
      >
        <div
          className="text-[10px] uppercase tracking-[0.16em]"
          style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
        >
          Rolle der Folie
        </div>
        <div
          className="mt-3 text-[13px] leading-snug"
          style={{ color: PALETTE.text, fontFamily: PALETTE.body }}
        >
          Diese Folie haelt die Arbeitsphase offen und praesentationsfaehig,
          ohne bereits Inhalte vorwegzunehmen, die spaeter ueber die
          Prinzipien-Slides in die Diskussion kommen.
        </div>
      </div>

      <FooterBand
        title="Hinweis"
        tone="primary"
        text="Nach der Arbeitsphase werden die Prinzipien-Slides ausgeteilt oder aufgerufen."
      />
    </div>

    <div
      className="grid h-full grid-cols-3 gap-3 rounded-[28px] p-5"
      style={{
        background: `linear-gradient(145deg, ${mix(PALETTE.deep, PALETTE.bg, 94)}, ${mix(
          PALETTE.primary,
          PALETTE.bg,
          8,
        )})`,
        border: `1px solid ${mix(PALETTE.deep, "transparent", 18)}`,
      }}
    >
      {reminders.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center rounded-[24px] p-5 text-center"
            style={{
              background: mix(PALETTE.bg, "transparent", 18),
              border: `1px solid ${mix(PALETTE.bg, "transparent", 14)}`,
            }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-[16px]"
              style={{ background: mix(item.tone, PALETTE.bg, 16), color: item.tone }}
            >
              <Icon size={22} />
            </div>
            <div
              className="mt-4 text-[14px] font-semibold leading-tight"
              style={{ color: PALETTE.bg, fontFamily: PALETTE.heading }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const AppWorkPhaseSlide: CodeSlide = {
  id: "diw-11-app-work-phase",
  name: "11 · Arbeitsphase in der App",
  description:
    "Reduzierte Holding-Slide fuer die offene Arbeitsphase in der App mit drei knappen Erinnerungen.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelzeile der Arbeitsphase.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Ruhige Arbeitsphasen-Folie mit drei Erinnerungen.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default AppWorkPhaseSlide;
