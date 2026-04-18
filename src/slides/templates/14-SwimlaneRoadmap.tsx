import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Projekt-Roadmap / Release-Plan"
    hint="Zeitachse + Funktionsbereiche"
  />
);

const Lane: React.FC<{ name: string; bars: Array<{ span: number; label: string }> }> = ({
  name,
  bars,
}) => (
  <>
    <WireBlock label={name} variant="title" className="col-span-2 row-span-1" />
    <div className="col-span-10 row-span-1 grid grid-cols-10 gap-1 h-full items-center">
      {bars.map((b, i) => (
        <div
          key={i}
          className="h-3/4 border-2 border-dashed border-slate-400 bg-slate-100 rounded px-1 text-[9px] flex items-center"
          style={{ gridColumn: `span ${b.span}` }}
        >
          {b.label}
        </div>
      ))}
    </div>
  </>
);

const ContentWire: React.FC = () => (
  <WireGrid rows={4}>
    <WireBlock
      label="Zeitachse"
      hint="Q1 · Q2 · Q3 · Q4"
      variant="muted"
      className="col-span-12 row-span-1"
    />
    <Lane name="Team A" bars={[{ span: 4, label: "Initiative A1" }, { span: 3, label: "A2" }]} />
    <Lane name="Team B" bars={[{ span: 6, label: "Initiative B1" }]} />
    <Lane name="Team C" bars={[{ span: 2, label: "C1" }, { span: 5, label: "C2" }]} />
  </WireGrid>
);

export const SwimlaneRoadmap: CodeSlide = {
  id: "swimlane-roadmap",
  name: "14 · Swimlane Roadmap",
  description:
    "Gitter aus Zeitachse (X) und funktionalen Bereichen (Y). Initiativen als Balken in den Bahnen. Für Projektplanung, Release-Management und funktionsübergreifende Strategien.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Swimlane-Gitter mit Zeitachse",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default SwimlaneRoadmap;
