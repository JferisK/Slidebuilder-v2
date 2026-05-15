import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Phasen oder Wertschöpfungsschritte"
    hint="z. B. Projekt-Roadmap"
  />
);

const Chevron: React.FC<{ step: string; label: string }> = ({ step, label }) => (
  <div className="relative col-span-3 h-full">
    <div className="h-full bg-slate-100 border-2 border-dashed border-slate-400 rounded-md flex flex-col justify-center items-center text-center px-3">
      <span className="text-[10px] text-slate-500 font-mono">{step}</span>
      <span className="text-[11px] text-slate-700 font-semibold uppercase">
        {label}
      </span>
    </div>
  </div>
);

const ContentWire: React.FC = () => (
  <WireGrid rows={2}>
    <Chevron step="Schritt 1" label="Phase A" />
    <Chevron step="Schritt 2" label="Phase B" />
    <Chevron step="Schritt 3" label="Phase C" />
    <Chevron step="Schritt 4" label="Phase D" />
    <WireBlock
      label="Output / Verantwortliche"
      hint="optional: Zeile mit Details je Phase"
      variant="muted"
      className="col-span-12 row-span-1"
    />
  </WireGrid>
);

export const ProcessChevron: CodeSlide = {
  id: "process-chevron",
  name: "05 · Horizontaler Prozessfluss",
  description:
    "Lineare Abfolge von 3-6 Schritten als Pfeilkette. Für Roadmaps, Wertschöpfungsketten oder zeitliche Abläufe von links nach rechts.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Horizontale Chevron-Kette + optionale Detailzeile",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default ProcessChevron;
