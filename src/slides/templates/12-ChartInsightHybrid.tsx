import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Aussage zur Daten-Interpretation"
    hint="z. B. 'Wachstum kommt primär aus Segment X'"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid>
    <WireBlock
      label="Haupt-Diagramm"
      hint="Liniendiagramm / Balken / Scatter"
      variant="chart"
      className="col-span-8 h-full"
    />
    <div className="col-span-4 flex flex-col gap-2">
      <WireBlock label="Key Finding 1" className="flex-1" />
      <WireBlock label="Key Finding 2" className="flex-1" />
      <WireBlock label="Key Finding 3" className="flex-1" />
      <WireBlock label="Quelle / Methodik" variant="muted" className="h-8" />
    </div>
  </WireGrid>
);

export const ChartInsightHybrid: CodeSlide = {
  id: "chart-insight-hybrid",
  name: "12 · Chart + Side Commentary",
  description:
    "Großes Diagramm links (8 Spalten), schmale Insight-Spalte rechts (4 Spalten) mit Key Findings. Consulting-Goldstandard: Daten + Interpretation direkt nebeneinander.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "8/4 Split Chart + Findings",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default ChartInsightHybrid;
