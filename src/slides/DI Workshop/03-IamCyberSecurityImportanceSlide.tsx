import * as React from "react";
import type { CodeSlide } from "../types";
import { HeroBand, KeyTakeawaysList, StandardTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Relevanz"
    title="Warum IAM ein Kernbereich von Cyber Security ist"
  />
);

const BodySlot: React.FC = () => (
  <div className="grid h-full grid-cols-[0.95fr_1.05fr] gap-4">
    <HeroBand
      eyebrow="Kernaussage"
      title="Der größte Schaden entsteht oft nicht beim ersten Login, sondern im Zugriffsspielraum danach."
      subtitle="IAM ist der Hebel, der aus einem Konto ein begrenztes Konto oder ein echtes Sicherheitsproblem macht."
      tone="deep"
    />
    <KeyTakeawaysList
      items={[
        "Viele Sicherheitsprobleme eskalieren über Identitäten und Zugänge.",
        "Ein kompromittiertes Konto ist besonders gefährlich, wenn es zu viel darf.",
        "Gute Sicherheit fragt nicht nur: Wer kommt rein?",
        "Gute Sicherheit fragt auch: Wer darf was sehen, tun, ändern und freigeben?",
      ]}
      tone="signal"
    />
  </div>
);

const IamCyberSecurityImportanceSlide: CodeSlide = {
  id: "diw-03-iam-cyber-security-importance",
  name: "03 · Warum IAM für Cyber Security wichtig ist",
  description: "Relevanzfolie zur Rolle von IAM in der Cyber Security.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default IamCyberSecurityImportanceSlide;
