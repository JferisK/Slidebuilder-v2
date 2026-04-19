import * as React from "react";
import type { CodeSlide } from "../types";
import { KeyTakeawaysList, StandardTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Wrap-up"
    title="Die wichtigsten Erkenntnisse aus IAM 101"
  />
);

const BodySlot: React.FC = () => (
  <KeyTakeawaysList
    items={[
      "IAM ist ein Kernbereich von Cyber Security.",
      "Viele Risiken entstehen erst durch falsche Zugänge und Rechte.",
      "Die sechs Prinzipien lassen sich in realen Systemen wiederfinden.",
      "Gute Kontrollen wirken nur im Zusammenspiel.",
      "PAM, KI und AI Agents machen gutes IAM noch relevanter.",
    ]}
    tone="primary"
  />
);

const WrapUpSlide: CodeSlide = {
  id: "diw-25-wrap-up",
  name: "25 · Wrap-up",
  description: "Abschlussverdichtung der Workshop-Kernbotschaften.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default WrapUpSlide;
