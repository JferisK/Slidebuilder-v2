import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Schmales Titelband — starkes Statement"
    hint="z. B. Eröffnungs-Folie / Keynote"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid>
    <WireBlock
      label="Full-Bleed Visual"
      hint="Großflächiges Bild, Chart oder Key-Visual"
      variant="chart"
      className="col-span-12 h-full"
    />
  </WireGrid>
);

export const TitleBandVisual: CodeSlide = {
  id: "title-band-visual",
  name: "11 · Title Band + Visual Body",
  description:
    "Schmales kontrastreiches Titelband oben, großflächiges Key-Visual unten. Für Keynotes, Eröffnungs-Folien oder emotionale Statements. Hohe Wirkung, ein Thema.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Full-Bleed Visual",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body", "pic"] },
};

export default TitleBandVisual;
