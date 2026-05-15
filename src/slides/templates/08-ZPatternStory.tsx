import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Narrative Aufhänger"
    hint="Pitch, Brand-Launch, Storytelling"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid rows={2}>
    <WireBlock
      label="Top Left — Eyecatcher"
      hint="Hauptbotschaft / Claim"
      variant="accent"
      className="col-span-6 row-span-1"
    />
    <WireBlock
      label="Top Right — Ankerzahl"
      hint="Hero-Metrik / Badge"
      variant="metric"
      className="col-span-6 row-span-1"
    />
    <WireBlock
      label="Bottom Left — Visualisierung"
      hint="Bild, Chart oder Illustration"
      variant="chart"
      className="col-span-6 row-span-1"
    />
    <WireBlock
      label="Bottom Right — Fazit / CTA"
      hint="Abschluss / Next Step"
      variant="title"
      className="col-span-6 row-span-1"
    />
  </WireGrid>
);

export const ZPatternStory: CodeSlide = {
  id: "z-pattern-story",
  name: "08 · Story-Slide im Z-Muster",
  description:
    "Vier Ankerpunkte in den Ecken, angeordnet im Z-Lesefluss: Claim links oben → Ankerzahl rechts oben → Visual links unten → Fazit rechts unten. Für Pitch-Decks und narrative Folien.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "4 Ecken im Z-Pattern",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default ZPatternStory;
