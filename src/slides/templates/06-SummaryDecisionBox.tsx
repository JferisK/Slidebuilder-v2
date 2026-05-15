import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Analyse-Schlussfolgerung"
    hint="Kernbotschaft oder Chart-Thema"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid rows={5}>
    <WireBlock
      label="Analyse / Chart"
      hint="Hauptvisualisierung oder Argumentation"
      variant="chart"
      className="col-span-12 row-span-4"
    />
    <WireBlock
      label="So-what / Decision-Box"
      hint="Handlungsempfehlung — farblich abgesetzt"
      variant="accent"
      className="col-span-12 row-span-1"
    />
  </WireGrid>
);

export const SummaryDecisionBox: CodeSlide = {
  id: "summary-decision-box",
  name: "06 · Summary + Decision Box",
  description:
    "Analyse/Chart oben, unten farblich abgehobene Decision-Box mit Handlungsempfehlung. McKinsey 'So-What'-Muster. Verhindert, dass Analysen ohne Konsequenz bleiben.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Analyse-Block oben, Decision-Box unten",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default SummaryDecisionBox;
