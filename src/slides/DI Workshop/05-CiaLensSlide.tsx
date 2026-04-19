import * as React from "react";
import type { CodeSlide } from "../types";
import { CardGrid, StandardTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Beobachtungsrahmen"
    title="CIA-Triade: Eine einfache Beobachtungslinse"
  />
);

const BodySlot: React.FC = () => (
  <CardGrid
    columns={3}
    items={[
      { title: "Vertraulichkeit", text: "Wer darf etwas sehen?", tone: "primary" },
      { title: "Integrität", text: "Wer darf etwas ändern, freigeben oder manipulieren?", tone: "trust" },
      { title: "Verfügbarkeit", text: "Wer kann arbeiten, wenn er arbeiten können muss?", tone: "signal" },
    ]}
  />
);

const CiaLensSlide: CodeSlide = {
  id: "diw-05-cia-lens",
  name: "05 · CIA-Triade als Beobachtungslinse",
  description: "Dreiklang aus Vertraulichkeit, Integrität und Verfügbarkeit.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default CiaLensSlide;
