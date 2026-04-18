import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Ist vs. Soll / A vs. B"
    hint="Vergleichsthema in einem Satz"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid>
    <div className="col-span-6 flex flex-col gap-2">
      <WireBlock label="Option A — Überschrift" variant="title" className="h-10" />
      <WireBlock label="Merkmal 1" className="flex-1" />
      <WireBlock label="Merkmal 2" className="flex-1" />
      <WireBlock label="Merkmal 3" className="flex-1" />
    </div>
    <div className="col-span-6 flex flex-col gap-2">
      <WireBlock label="Option B — Überschrift" variant="title" className="h-10" />
      <WireBlock label="Merkmal 1" className="flex-1" />
      <WireBlock label="Merkmal 2" className="flex-1" />
      <WireBlock label="Merkmal 3" className="flex-1" />
    </div>
  </WireGrid>
);

export const BinaryContrast: CodeSlide = {
  id: "binary-contrast",
  name: "03 · Symmetrischer Vergleich",
  description:
    "Zwei identisch strukturierte Spalten (6-6) für Trade-offs, Wettbewerbsvergleiche oder Ist/Soll-Transformationen. Parallele Zeilen erzwingen logische Konsistenz.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Was wird verglichen?",
      Component: TitleWire,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "6/6 Split mit parallelen Merkmalen",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default BinaryContrast;
