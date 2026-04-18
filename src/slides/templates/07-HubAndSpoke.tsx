import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Ökosystem / zentrales Konzept"
    hint="Was ist der Mittelpunkt?"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid rows={3}>
    <WireBlock label="Satellit 1" variant="muted" className="col-span-3 row-span-1" />
    <WireBlock label="Satellit 2" variant="muted" className="col-span-6 row-span-1" />
    <WireBlock label="Satellit 3" variant="muted" className="col-span-3 row-span-1" />

    <WireBlock label="Satellit 4" variant="muted" className="col-span-3 row-span-1" />
    <WireBlock
      label="Zentraler Hub"
      hint="Kernstrategie / Plattform / Vision"
      variant="accent"
      className="col-span-6 row-span-1"
    />
    <WireBlock label="Satellit 5" variant="muted" className="col-span-3 row-span-1" />

    <WireBlock label="Satellit 6" variant="muted" className="col-span-3 row-span-1" />
    <WireBlock label="Satellit 7" variant="muted" className="col-span-6 row-span-1" />
    <WireBlock label="Satellit 8" variant="muted" className="col-span-3 row-span-1" />
  </WireGrid>
);

export const HubAndSpoke: CodeSlide = {
  id: "hub-and-spoke",
  name: "07 · Hub-and-Spoke",
  description:
    "Zentraler Knoten (Hub) mit strahlenförmig angeordneten Satelliten. Für Ökosystem-Darstellungen, Abhängigkeiten oder Kernstrategien mit mehreren Hebeln.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Hub zentriert, Satelliten rundherum",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default HubAndSpoke;
