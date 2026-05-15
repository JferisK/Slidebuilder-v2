import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Priorisierungs-Matrix"
    hint="z. B. Impact × Komplexität"
  />
);

const ContentWire: React.FC = () => (
  <div className="grid h-full w-full p-2 gap-2" style={{ gridTemplateColumns: "auto 1fr", gridTemplateRows: "1fr auto" }}>
    <div className="flex items-center justify-center">
      <span className="text-[10px] text-slate-500 -rotate-90 whitespace-nowrap uppercase tracking-wide font-semibold">
        Y-Achse: z. B. Impact
      </span>
    </div>
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
      <WireBlock label="Oben Links" hint="hoher Impact · niedrig X" variant="muted" />
      <WireBlock label="Oben Rechts — Zielquadrant" hint="Quick Wins / Stars" variant="accent" />
      <WireBlock label="Unten Links" hint="Deprioritize" variant="muted" />
      <WireBlock label="Unten Rechts" hint="hoher X · niedrig Impact" variant="muted" />
    </div>
    <div />
    <div className="flex items-center justify-center">
      <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">
        X-Achse: z. B. Komplexität
      </span>
    </div>
  </div>
);

export const Matrix2x2: CodeSlide = {
  id: "matrix-2x2",
  name: "16 · 2x2 Matrix mit Achsen",
  description:
    "Klassische strategische 2x2-Matrix mit beschrifteten Achsen. Für Priorisierung von Initiativen oder Marktpositionierung (BCG-Matrix). Erzwingt Entscheidungen und Trade-offs.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "2x2-Matrix mit X/Y-Achsenbeschriftung",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default Matrix2x2;
