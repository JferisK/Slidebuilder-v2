import * as React from "react";
import type { CodeSlide } from "../types";
import { HeroBand, KeyTakeawaysList, StandardTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Verdichtung"
    title="Was gutes IAM nach den sechs Prinzipien gemeinsam besser macht"
  />
);

const BodySlot: React.FC = () => (
  <div className="grid h-full grid-cols-[0.92fr_1.08fr] gap-4">
    <HeroBand
      eyebrow="Gemeinsame Linie"
      title="Gutes IAM ist kein Regelkatalog, sondern ein sichtbares, priorisierbares Kontrollsystem."
      subtitle="Erst das Zusammenspiel aus Identitätsprüfung, Rechtesteuerung, Sichtbarkeit und Pflege über die Zeit macht die Sicherheitswirkung belastbar."
      tone="trust"
    />
    <KeyTakeawaysList
      items={[
        "Identitäten verlässlich prüfen",
        "Rechte wirklich und kontextgerecht durchsetzen",
        "überberechtigte, verwaiste und geteilte Konten sichtbar machen",
        "Informationen eng und passend sichtbar machen",
        "Privilegien nur bei Bedarf und möglichst kurz vergeben",
        "kritische Schritte trennen und Rechte über die Zeit sauber pflegen",
      ]}
      tone="signal"
    />
  </div>
);

const IamSynthesisSlide: CodeSlide = {
  id: "diw-21-iam-synthesis",
  name: "21 · Was gutes IAM gemeinsam besser macht",
  description: "Synthetische Verdichtungsfolie nach dem studentischen Prinzipienblock.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default IamSynthesisSlide;
