import * as React from "react";
import type { CodeSlide } from "../types";
import {
  CanvasFrame,
  PromptCard,
  PromptList,
  TemplateTitle,
} from "./_shared";

const TitleSlot: React.FC = () => (
  <TemplateTitle
    eyebrow="DI Teamtreffen Planung"
    title="Update-Rahmen 02 · Bedarf, Relevanz und Zugang"
    subtitle="Diese Folie soll greifbar machen, warum das Thema relevant ist, in welchem Kontext es auftaucht und wie ihr den Zugang zur Zielgruppe heute denkt."
    badges={["Update-Rahmen", "Kundenperspektive", "offen formulierbar"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-[1.05fr_0.95fr] grid-rows-[1fr_auto]">
    <PromptCard
      label="Problemraum"
      prompt="Woran merkt das Umfeld heute, dass hier ein relevantes Problem, ein Bedarf oder eine echte Gelegenheit liegt?"
      hint="Hilfreich sind Situationen, Trigger oder Beobachtungen, an denen andere sofort verstehen, warum die Solution nicht abstrakt bleibt."
      className="row-span-2"
    />
    <PromptCard
      label="Go-to-Need"
      prompt="Wie soll der Zugang zur Zielgruppe aussehen, damit die Loesung glaubwuerdig andockt und nicht wie ein allgemeines Versprechen wirkt?"
      hint="Das kann ein Kanal, ein wiederkehrender Kontaktpunkt, ein konkreter Use Case oder ein vertrauter Arbeitskontext sein."
      tone="accent"
    />
    <PromptList
      title="Woran Relevanz haengen sollte"
      items={[
        "Welche Situation oder welches Verhalten zeigt am besten, warum das Thema jetzt relevant ist?",
        "Welcher Zugang zur Zielgruppe fuehlt sich realistisch und anschlussfaehig an?",
        "Welche Art von Beziehung oder Zusammenarbeit macht die Loesung fuer andere plausibel?",
      ]}
      accent
    />
    <PromptList
      title="Was sauber als Annahme markiert werden darf"
      items={[
        "Wenn der Zugangskanal noch nicht feststeht, lieber sauber als Hypothese benennen",
        "Wenn die Zielbeziehung noch reift, das Spannungsfeld sichtbar machen statt es glattzuziehen",
        "Nicht in Produktwerbung kippen: Die Relevanz soll aus dem Bedarf kommen, nicht aus Claims",
      ]}
    />
  </CanvasFrame>
);

const CustomerNeedTemplate: CodeSlide = {
  id: "ditp-02-customer-need-template",
  name: "02 · Update-Rahmen: Bedarf, Relevanz und Zugang",
  description:
    "Offene Folie fuer Problemraum, Relevanz und den gedachten Zugang zur Zielgruppe im internen Fortschrittsupdate.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelband fuer Bedarf, Relevanz und Zugang.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Leitflaechen fuer Ausgangslage, Zugang und Kundenrelevanz.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default CustomerNeedTemplate;