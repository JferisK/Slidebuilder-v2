import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Status einer Leit-Kennzahl"
    hint="z. B. Umsatzwachstum YTD, NPS, Conversion"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid>
    <div className="col-span-5 flex flex-col gap-2">
      <WireBlock
        label="Hero-KPI"
        hint="Große Zahl, z. B. 142 %"
        variant="metric"
        className="flex-1 text-[22px]"
      />
      <WireBlock
        label="Delta / Baseline"
        hint="+12 pp ggü. Vorjahr"
        variant="muted"
        className="h-10"
      />
    </div>
    <WireBlock
      label="Begleit-Chart"
      hint="Trendlinie oder Segment-Breakdown"
      variant="chart"
      className="col-span-7"
    />
  </WireGrid>
);

export const KpiHeroLeft: CodeSlide = {
  id: "kpi-hero-left",
  name: "02 · KPI Hero Left + Context Right",
  description:
    "Dominante Leit-Kennzahl links (Spalten 1-5), dahinter Trend oder Segmentierung rechts (6-12). Für Performance-Dashboards und Status-Updates mit Zielwert-Fokus.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Was zeigt die Hero-Metrik?",
      Component: TitleWire,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "5/7 Split: Hero-KPI links, Kontext-Chart rechts",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default KpiHeroLeft;
