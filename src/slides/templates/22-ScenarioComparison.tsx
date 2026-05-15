import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Szenario-Analyse"
    hint="Annahmen → Auswirkungen auf KPI"
  />
);

const Scenario: React.FC<{
  name: string;
  variant: "muted" | "accent" | "default";
  kpi: string;
}> = ({ name, variant, kpi }) => (
  <div className="col-span-4 h-full flex flex-col gap-1.5">
    <WireBlock label={name} variant={variant === "accent" ? "accent" : "title"} className="h-10" />
    <WireBlock label="Hero-KPI" hint={kpi} variant="metric" className="h-14" />
    <WireBlock label="Annahme 1" variant={variant} className="flex-1" />
    <WireBlock label="Annahme 2" variant={variant} className="flex-1" />
    <WireBlock label="Annahme 3" variant={variant} className="flex-1" />
  </div>
);

const ContentWire: React.FC = () => (
  <WireGrid>
    <Scenario name="Worst Case" variant="muted" kpi="z. B. NPV negativ" />
    <Scenario name="Base Case — empfohlen" variant="accent" kpi="NPV Basis" />
    <Scenario name="Best Case" variant="default" kpi="NPV Upside" />
  </WireGrid>
);

export const ScenarioComparison: CodeSlide = {
  id: "scenario-comparison",
  name: "22 · Szenario-Vergleich",
  description:
    "Drei parallele Szenario-Spalten (Worst / Base / Best), Base Case farblich hervorgehoben. Für Business Cases, Finanzplanung und Risikobewertung. Demonstriert Denken in Unsicherheiten.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "3 Szenario-Spalten mit Base Case Highlight",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default ScenarioComparison;
