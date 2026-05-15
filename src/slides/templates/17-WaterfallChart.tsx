import * as React from "react";
import type { CodeSlide } from "../types";
import { WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Treiber-Analyse"
    hint="z. B. EBIT-Bridge 2024 → 2025"
  />
);

const Bar: React.FC<{ label: string; pctFrom: number; pctTo: number; variant: "start" | "plus" | "minus" | "end" }> = ({
  label,
  pctFrom,
  pctTo,
  variant,
}) => {
  const color =
    variant === "start" || variant === "end"
      ? "bg-slate-400/80 border-slate-600"
      : variant === "plus"
      ? "bg-emerald-200 border-emerald-500"
      : "bg-rose-200 border-rose-500";
  return (
    <div className="relative h-full flex-1 flex items-end">
      <div
        className={`absolute left-[10%] right-[10%] border-2 border-dashed rounded ${color}`}
        style={{ bottom: `${pctFrom}%`, top: `${100 - pctTo}%` }}
      />
      <span className="absolute bottom-[-18px] left-0 right-0 text-[9px] text-center text-slate-600 uppercase">
        {label}
      </span>
    </div>
  );
};

const ContentWire: React.FC = () => (
  <WireGrid>
    <div className="col-span-12 relative h-full pb-5 flex gap-1 items-end">
      <Bar label="Start" pctFrom={0} pctTo={60} variant="start" />
      <Bar label="+ Treiber A" pctFrom={60} pctTo={75} variant="plus" />
      <Bar label="+ Treiber B" pctFrom={75} pctTo={85} variant="plus" />
      <Bar label="− Effekt" pctFrom={70} pctTo={85} variant="minus" />
      <Bar label="+ Sonstiges" pctFrom={70} pctTo={78} variant="plus" />
      <Bar label="Endwert" pctFrom={0} pctTo={78} variant="end" />
    </div>
  </WireGrid>
);

export const WaterfallChart: CodeSlide = {
  id: "waterfall-chart",
  name: "17 · Waterfall Logic Pattern",
  description:
    "Wasserfall-Diagramm zeigt, wie ein Startwert durch positive/negative Effekte zu einem Endwert wird. Goldstandard für EBIT-Bridges, Kostentreiber oder Personalfluktuation.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Wasserfall-Balken mit Start- und Endwert",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default WaterfallChart;
