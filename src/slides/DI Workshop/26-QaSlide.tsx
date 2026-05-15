import * as React from "react";
import type { CodeSlide } from "../types";
import { CenteredPrompt, StandardTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Abschluss"
    title="Fragen und letzte Diskussion"
  />
);

const BodySlot: React.FC = () => (
  <CenteredPrompt
    title="Fragen?"
    subtitle="Zum Abschluss ist Raum für Einordnung, Rückfragen und eine letzte kurze Diskussion."
    points={[
      "Welche Beobachtung in der App war aus eurer Sicht am gefährlichsten?",
      "Welche Gegenüberstellung war am wichtigsten: Authentifizierung vs. Autorisierung, Least Privilege vs. Need to Know oder SoD vs. JLM?",
    ]}
  />
);

const QaSlide: CodeSlide = {
  id: "diw-26-qa",
  name: "26 · Q&A",
  description: "Offene Abschlussfolie für Fragen und Diskussion.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default QaSlide;
