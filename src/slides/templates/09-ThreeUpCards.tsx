import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Gleichwertige Optionen / Features"
    hint="3 parallele Themen"
  />
);

const Card: React.FC<{ idx: number }> = ({ idx }) => (
  <div className="col-span-4 h-full flex flex-col gap-1.5">
    <WireBlock label={`Card ${idx} — Header`} variant="title" className="h-10" />
    <WireBlock label="Icon / Visual" variant="muted" className="h-12" />
    <WireBlock
      label={`Beschreibung ${idx}`}
      hint="2-3 Zeilen Fließtext"
      className="flex-1"
    />
  </div>
);

const ContentWire: React.FC = () => (
  <WireGrid>
    <Card idx={1} />
    <Card idx={2} />
    <Card idx={3} />
  </WireGrid>
);

export const ThreeUpCards: CodeSlide = {
  id: "three-up-cards",
  name: "09 · 3-up Cards",
  description:
    "Drei vertikale Karten nebeneinander (4-4-4) für gleichwertige Features, Produkt-Säulen oder regionale Zusammenfassungen. Sehr sauber, gut scannbar, modular.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "3 identisch strukturierte Karten",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default ThreeUpCards;
