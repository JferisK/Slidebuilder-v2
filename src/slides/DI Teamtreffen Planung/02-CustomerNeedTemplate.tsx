import * as React from "react";
import type { CodeSlide } from "../types";
import {
  CanvasFrame,
  PromptCard,
  PromptList,
  SegmentPill,
  TemplateTitle,
} from "./_shared";

const TitleSlot: React.FC = () => (
  <TemplateTitle
    eyebrow="DI Teamtreffen Planung"
    title="Update-Template 02 · Bedarf und Relevanz"
    subtitle="Leere Struktur fuer die zweite Update-Folie: Kundennutzen, Bedarf oder Problemraum benennen. Hier liegen die BMC-Dimensionen Kanaele und Kundenbeziehungen."
    badges={["Pflichtfolie", "BMC 3-4", "noch ohne Inhalt"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-2 grid-rows-[auto_1fr]">
    <div className="col-span-2 flex flex-wrap gap-2">
      {["Kanaele", "Kundenbeziehungen", "Relevanz"].map((label, index) => (
        <SegmentPill key={label} label={label} tone={index === 1 ? "accent" : "default"} />
      ))}
    </div>
    <PromptCard
      label="Kontext"
      prompt="Bei wem taucht das Problem auf, ueber welche Kanaele erreichen wir dieses Segment und in welcher Situation?"
      hint="Hier spaeter Kundensituation, Stakeholder-Kontext und erste Hinweise auf Kanal oder Touchpoint platzieren."
    />
    <PromptCard
      label="Bedarf"
      prompt="Welche Kundenbeziehung und welches konkrete Beduerfnis soll die Solution adressieren?"
      hint="Keine Vision-Claims. Lieber konkrete Beziehung, Trigger, Engpass oder Erwartung des Kunden benennen."
      tone="accent"
    />
    <PromptList
      title="Pflichtfragen"
      items={[
        "Welcher Kanal oder welcher Zugang zum Kunden ist fuer dieses Thema realistisch?",
        "Wie soll die Beziehung zum Kunden aussehen: beratend, operativ, wiederkehrend oder punktuell?",
        "Warum ist genau diese Kombination aus Kanal und Beziehung jetzt relevant?",
      ]}
      accent
    />
    <PromptList
      title="Nicht vergessen"
      items={[
        "Keine Produktwerbung statt Beziehungslogik",
        "Wenn der Kanal noch offen ist: als Annahme kennzeichnen",
        "Wenn die Kundenbeziehung noch unklar ist: Spannungsfeld sichtbar machen",
      ]}
    />
  </CanvasFrame>
);

const CustomerNeedTemplate: CodeSlide = {
  id: "ditp-02-customer-need-template",
  name: "02 · Update-Template: Bedarf und Relevanz",
  description:
    "Leere Folie fuer Zielkunde, Problemraum und Relevanz des Themas im internen Fortschrittsupdate.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelband fuer Bedarf und Relevanz.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Prompt-Flachen fuer Kontext, Bedarf und Anschlussfaehigkeit.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default CustomerNeedTemplate;