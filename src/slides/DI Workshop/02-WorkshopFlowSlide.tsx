import * as React from "react";
import { ArrowRight, Flag, MonitorPlay, Search, Sparkles, Users } from "lucide-react";
import { FooterBand, MetaBadge, PALETTE, mix } from "./_shared";
import type { CodeSlide } from "../types";

const steps = [
  "Warum IAM fuer Cyber Security wichtig ist",
  "Wichtige Schutzobjekte und Sicherheitsblick",
  "Kurzer Video-Einschub",
  "Erkundung der App",
  "Studentische Praesentation der erarbeiteten Prinzipien",
  "Zukunft: PAM, KI, Deepfakes und AI Agents",
];

const stepIcons = [Flag, Search, MonitorPlay, Sparkles, Users, ArrowRight];

const TitleSlot: React.FC = () => (
  <div className="flex h-full w-full items-center justify-between gap-4">
    <div>
      <div
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
      >
        Workshop orientation
      </div>
      <div
        className="text-[26px] font-semibold leading-[1.04]"
        style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
      >
        So ist der Workshop aufgebaut
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone="primary">6 Schritte</MetaBadge>
      <MetaBadge tone="trust">ohne Minutenplan</MetaBadge>
      <MetaBadge tone="outline">vor App keine Prinzipienliste</MetaBadge>
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div className="grid h-full w-full grid-rows-[1fr_auto] gap-4">
    <div
      className="grid h-full grid-cols-6 gap-3 rounded-[28px] p-5"
      style={{
        background: `linear-gradient(180deg, ${mix(PALETTE.secondary, PALETTE.bg, 82)}, ${mix(
          PALETTE.primary,
          PALETTE.bg,
          6,
        )})`,
        border: `1px solid ${mix(PALETTE.primary, "transparent", 18)}`,
      }}
    >
      {steps.map((step, index) => {
        const Icon = stepIcons[index];
        return (
          <div key={step} className="flex h-full flex-col">
            <div
              className="flex min-h-0 flex-1 flex-col rounded-[24px] p-4"
              style={{
                background: index >= 4 ? mix(PALETTE.trust, PALETTE.bg, 10) : PALETTE.bg,
                border: `1px solid ${
                  index >= 4
                    ? mix(PALETTE.trust, "transparent", 22)
                    : mix(PALETTE.text, "transparent", 12)
                }`,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div
                  className="text-[22px] font-semibold leading-none"
                  style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-[14px]"
                  style={{
                    background: mix(index >= 4 ? PALETTE.trust : PALETTE.primary, PALETTE.bg, 14),
                    color: index >= 4 ? PALETTE.trust : PALETTE.primary,
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>
              <div
                className="mt-4 text-[13px] font-semibold leading-tight"
                style={{ color: PALETTE.text, fontFamily: PALETTE.heading }}
              >
                {step}
              </div>
            </div>
            {index < steps.length - 1 ? (
              <div className="flex justify-center py-2">
                <ArrowRight size={18} style={{ color: PALETTE.muted }} />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>

    <FooterBand
      title="Didaktik"
      tone="trust"
      text="Die Prinzipien werden nicht frontal vorgetragen. Die Studierenden entdecken sie erst ueber die App und praesentieren sie spaeter selbst."
    />
  </div>
);

const WorkshopFlowSlide: CodeSlide = {
  id: "diw-02-workshop-flow",
  name: "02 · Workshop-Ablauf",
  description:
    "Prozessfolie mit den sechs Schritten des IAM-101-Workshops von Einordnung bis Zukunftsblock.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelzeile mit Prozess-Metadaten.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Lineare 6-Schritt-Darstellung des Workshop-Ablaufs.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default WorkshopFlowSlide;
