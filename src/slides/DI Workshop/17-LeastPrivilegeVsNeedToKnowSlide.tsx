import * as React from "react";
import type { CodeSlide } from "../types";
import { ComparisonColumns, StandardTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle eyebrow="Vergleich" title="Least Privilege vs. Need to Know" />
);

const BodySlot: React.FC = () => (
  <ComparisonColumns
    left={{
      title: "Least Privilege",
      question: "Was darf ich tun?",
      focus: "Aktionen, Rechte, Funktionen",
    }}
    right={{
      title: "Need to Know",
      question: "Was darf ich sehen oder wissen?",
      focus: "Sichtbarkeit, Informationsumfang, Kontext",
    }}
    takeaway="Zu viel tun dürfen und zu viel sehen dürfen sind verwandt, aber nicht identisch."
  />
);

const LeastPrivilegeVsNeedToKnowSlide: CodeSlide = {
  id: "diw-17-least-privilege-vs-need-to-know",
  name: "17 · Vergleichs-Slide: Least Privilege vs. Need to Know",
  description: "Vergleichsfolie zur Trennung von Handlungs- und Informationsspielraum.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default LeastPrivilegeVsNeedToKnowSlide;
