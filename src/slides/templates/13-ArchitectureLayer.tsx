import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: System- oder Strategie-Architektur"
    hint="z. B. Target Operating Model"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid rows={4}>
    <WireBlock
      label="Top Layer — User / Experience"
      variant="title"
      className="col-span-12 row-span-1"
    />
    <WireBlock
      label="Platform / Services Layer"
      variant="default"
      className="col-span-12 row-span-1"
    />
    <WireBlock
      label="Data Layer"
      variant="default"
      className="col-span-12 row-span-1"
    />
    <WireBlock
      label="Foundation / Infrastructure"
      variant="muted"
      className="col-span-12 row-span-1"
    />
  </WireGrid>
);

export const ArchitectureLayer: CodeSlide = {
  id: "architecture-layer",
  name: "13 · Architecture / Landscape Layer",
  description:
    "Vertikal gestapelte Ebenen (Foundation → Platform → User Layer) für IT-Architekturen, Target Operating Models oder strategische Säulen. Zeigt Abhängigkeiten und strukturelle Ordnung.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Horizontale Layer-Bänder übereinander",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default ArchitectureLayer;
