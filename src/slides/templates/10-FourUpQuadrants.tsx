import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Vier Dimensionen / SWOT"
    hint="2x2 ohne Achsen"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid rows={2}>
    <WireBlock
      label="Quadrant I"
      hint="z. B. Stärken"
      variant="title"
      className="col-span-6 row-span-1"
    />
    <WireBlock
      label="Quadrant II"
      hint="z. B. Schwächen"
      variant="title"
      className="col-span-6 row-span-1"
    />
    <WireBlock
      label="Quadrant III"
      hint="z. B. Chancen"
      variant="title"
      className="col-span-6 row-span-1"
    />
    <WireBlock
      label="Quadrant IV"
      hint="z. B. Risiken"
      variant="title"
      className="col-span-6 row-span-1"
    />
  </WireGrid>
);

export const FourUpQuadrants: CodeSlide = {
  id: "four-up-quadrants",
  name: "10 · 4-up Quadrants",
  description:
    "Vier Inhaltsblöcke in 2x2-Anordnung ohne Achsenbeschriftung. Für SWOT-Analysen, Portfolio-Übersichten oder Projekt-Dimensionen. Hohe Informationsdichte bei klarer Struktur.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "2x2-Matrix mit 4 Quadranten",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default FourUpQuadrants;
