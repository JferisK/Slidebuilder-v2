import * as React from "react";
import type { CodeSlide } from "../types";
import { CanvasFrame, PromptList, TemplateTitle, TEMPLATE_COLORS } from "./_shared";

const lanes = [
  {
    label: "Erledigt",
    prompt: "Welche Schluesselaktivitaeten wurden seit den Solution Days wirklich abgeschlossen?",
    accent: false,
  },
  {
    label: "In Arbeit",
    prompt: "Welche Schluesselressourcen oder Faehigkeiten werden aktuell aufgebaut?",
    accent: true,
  },
  {
    label: "Blockiert",
    prompt: "Welche Schluesselpartner, Abhaengigkeiten oder externen Zuarbeiten bremsen aktuell?",
    accent: false,
  },
];

const TitleSlot: React.FC = () => (
  <TemplateTitle
    eyebrow="DI Teamtreffen Planung"
    title="Update-Template 03 · Fortschritt seit den Solution Days"
    subtitle="Leere Fortschrittsfolie mit klarer Trennung zwischen abgeschlossen, laufend und blockiert. Hier liegen die BMC-Dimensionen Schluesselaktivitaeten, Schluesselressourcen und Schluesselpartner."
    badges={["Pflichtfolie", "BMC 5-7", "vergleichbar"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-3 grid-rows-[1fr_auto]">
    {lanes.map((lane) => (
      <div
        key={lane.label}
        className="flex h-full flex-col rounded-[22px] border border-dashed px-4 py-3"
        style={{
          background: lane.accent ? "color-mix(in srgb, var(--slide-accent) 14%, transparent)" : "var(--slide-bg)",
          borderColor: lane.accent ? "var(--slide-accent)" : "color-mix(in srgb, var(--slide-text-muted) 40%, transparent)",
        }}
      >
        <div
          className="text-[10px] uppercase tracking-[0.18em]"
          style={{
            color: lane.accent ? "var(--slide-accent)" : TEMPLATE_COLORS.textMuted,
            fontFamily: TEMPLATE_COLORS.body,
          }}
        >
          {lane.label}
        </div>
        <div
          className="mt-2 text-[15px] font-semibold leading-tight"
          style={{ color: TEMPLATE_COLORS.text, fontFamily: TEMPLATE_COLORS.heading }}
        >
          {lane.prompt}
        </div>
        <div className="mt-3 flex flex-1 flex-col gap-2">
          {["Placeholder 1", "Placeholder 2", "Placeholder 3"].map((item) => (
            <div
              key={`${lane.label}-${item}`}
              className="rounded-[16px] border border-dashed px-3 py-2 text-[10px]"
              style={{
                borderColor: lane.accent ? "var(--slide-accent)" : TEMPLATE_COLORS.borderMuted,
                color: TEMPLATE_COLORS.textMuted,
                fontFamily: TEMPLATE_COLORS.body,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ))}
    <div className="col-span-3">
      <PromptList
        title="Nachweis der Bewegung"
        items={[
          "Welche sichtbare Veraenderung gibt es bei Aktivitaeten, Ressourcen oder Partnern?",
          "Was wurde konkret erarbeitet, getestet, besetzt oder abgestimmt?",
          "Wo braucht es im Meeting eine Diskussion zu Partnern, Ressourcen oder Faehigkeiten?",
        ]}
        accent
      />
    </div>
  </CanvasFrame>
);

const ProgressSinceSolutionDaysTemplate: CodeSlide = {
  id: "ditp-03-progress-since-solution-days-template",
  name: "03 · Update-Template: Fortschritt seit Solution Days",
  description:
    "Leere Statusfolie mit drei Bahnen fuer erledigt, in Arbeit und blockiert sowie einem unteren Nachweis-Strip.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelband fuer Fortschritts-Updates.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Drei Status-Bahnen plus Leitfragen fuer echten Fortschritt.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default ProgressSinceSolutionDaysTemplate;