import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Geografische Verteilung"
    hint="Marktanteile / Präsenz / Risiko"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid>
    <div className="col-span-9 h-full border-2 border-dashed border-slate-400 rounded-md bg-slate-50 flex items-center justify-center relative overflow-hidden">
      <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-500">
        Karte — Choropleth (eingefärbte Regionen)
      </span>
      <div className="absolute top-3 left-3 w-16 h-10 border border-dashed border-slate-400 bg-slate-200/50 rounded" />
      <div className="absolute bottom-4 right-4 w-20 h-14 border border-dashed border-slate-400 bg-slate-300/50 rounded" />
      <div className="absolute top-1/2 left-1/3 w-12 h-10 border border-dashed border-slate-400 bg-slate-200/40 rounded" />
    </div>
    <div className="col-span-3 h-full flex flex-col gap-2">
      <WireBlock label="Legende" hint="Farbskala / Wertebereiche" variant="muted" className="flex-1" />
      <WireBlock label="Top-Region" variant="accent" className="flex-1" />
      <WireBlock label="Bottom-Region" className="flex-1" />
    </div>
  </WireGrid>
);

export const RegionChoropleth: CodeSlide = {
  id: "region-choropleth",
  name: "21 · Multi-Region Data Map",
  description:
    "Landkarte mit wertbasiert eingefärbten Regionen, rechts schmale Legenden-/Callout-Spalte. Für Marktanteilsanalysen, globale Präsenz und Lieferketten-Risiken.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Karte links (9 Sp.) + Legende/Callouts rechts (3 Sp.)",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default RegionChoropleth;
