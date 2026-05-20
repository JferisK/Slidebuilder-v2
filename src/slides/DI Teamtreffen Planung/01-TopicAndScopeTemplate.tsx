import * as React from "react";
import type { CodeSlide } from "../types";
import { CanvasFrame, PromptCard, PromptList, TemplateTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <TemplateTitle
    eyebrow="DI Teamtreffen Planung"
    title="Update-Template 01 · Thema und Scope"
    subtitle="Leere Struktur fuer die erste Update-Folie: Thema benennen, Einordnung geben und Scope sauber begrenzen. Hier liegen die BMC-Dimensionen Kundensegmente und Nutzenversprechen."
    badges={["Pflichtfolie", "BMC 1-2", "interner Update-Stil"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-[1.25fr_0.75fr] grid-rows-[1fr_auto]">
    <PromptCard
      label="Leitfrage"
      prompt="Wie heisst die Solution, welches Nutzenversprechen verfolgt sie und fuer welche Kundensegmente ist sie gedacht?"
      hint="Hier spaeter den Solution-Namen, die Kurzbeschreibung, das Nutzenversprechen und das wichtigste Kundensegment platzieren."
      className="row-span-2"
    />
    <PromptList
      title="Pflichtfelder"
      items={[
        "Welches Kundensegment oder welche Stakeholder-Gruppe steht im Fokus?",
        "Welches konkrete Nutzenversprechen liefert die Solution fuer dieses Segment?",
        "Welche Scope-Grenze ist wichtig, damit das Nutzenversprechen glaubwuerdig bleibt?",
      ]}
      accent
    />
    <PromptList
      title="Optionale Stuetze"
      items={[
        "Welche weiteren Segmente sind spaeter denkbar, aber noch nicht im Fokus?",
        "Wie laesst sich das Nutzenversprechen intern in einem Satz verkaufen?",
        "Welche offene Scope-Frage sollte sichtbar bleiben?",
      ]}
    />
  </CanvasFrame>
);

const TopicAndScopeTemplate: CodeSlide = {
  id: "ditp-01-topic-scope-template",
  name: "01 · Update-Template: Thema und Scope",
  description:
    "Leere Auftaktfolie fuer interne Solution-Updates mit Fokus auf Thema, Kurzbeschreibung und klarer Scope-Abgrenzung.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelband mit Einordnung des Update-Templates.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Prompt-Flachen fuer Thema, Scope und optionale Einordnung.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default TopicAndScopeTemplate;