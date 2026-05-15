import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Action-Title — Kernbotschaft als vollständiger Satz"
    hint="Antwort zuerst (Pyramid Principle)"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid>
    <WireBlock
      label="Beweispfeiler 1"
      hint="Fakt / Zahl / Kernaussage"
      className="col-span-4"
    />
    <WireBlock
      label="Beweispfeiler 2"
      hint="Fakt / Zahl / Kernaussage"
      className="col-span-4"
    />
    <WireBlock
      label="Beweispfeiler 3"
      hint="Fakt / Zahl / Kernaussage"
      className="col-span-4"
    />
  </WireGrid>
);

export const ExecutiveMessageFirst: CodeSlide = {
  id: "exec-message-first",
  name: "01 · Executive Message-First",
  description:
    "Action-Title oben, darunter 3 Beweispfeiler (4/4/4). Für strategische Zusammenfassungen und Entscheidungsfolien — McKinsey-Standard / Pyramid Principle.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Action-Title mit vollständig ausformulierter Kernbotschaft",
      Component: TitleWire,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "3 Beweispfeiler als 4/4/4-Grid",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default ExecutiveMessageFirst;
