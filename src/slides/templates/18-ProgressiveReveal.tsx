import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Schrittweise Aufdeckung"
    hint="Komplexes Thema in Etappen"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid>
    <div className="col-span-4 h-full flex flex-col gap-2">
      <WireBlock label="Sticky Visual" variant="chart" className="flex-1" />
      <WireBlock
        label="Navigation / Steps"
        hint="1 · 2 · 3 · 4"
        variant="muted"
        className="h-8"
      />
    </div>
    <div className="col-span-8 h-full flex flex-col gap-2">
      <WireBlock label="Schritt-Erklärung 1" className="flex-1" />
      <WireBlock label="Schritt-Erklärung 2" className="flex-1" />
      <WireBlock label="Schritt-Erklärung 3" className="flex-1" />
    </div>
  </WireGrid>
);

export const ProgressiveReveal: CodeSlide = {
  id: "progressive-reveal",
  name: "18 · Progressive Reveal",
  description:
    "Sticky Visual links (4 Sp.) + fließender Erklär-Text rechts (8 Sp.), der beim Scrollen das Visual ergänzt. Für komplexe Erklärungen und datengetriebenes Storytelling.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Sticky-Area + Scroll-Text",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default ProgressiveReveal;
