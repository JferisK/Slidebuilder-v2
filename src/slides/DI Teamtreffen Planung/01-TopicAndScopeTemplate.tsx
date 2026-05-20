import * as React from "react";
import type { CodeSlide } from "../types";
import { CanvasFrame, PromptCard, PromptList, TemplateTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <TemplateTitle
    eyebrow="DI Teamtreffen Planung"
    title="Update-Rahmen 01 · Thema, Nutzen und Fokus"
    subtitle="Der Einstieg soll schnell verstaendlich machen, worum es bei der Solution geht, fuer wen sie relevant ist und wo ihr den Fokus fuer dieses Update setzt."
    badges={["Update-Rahmen", "Einstieg", "frei gestaltbar"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-[1.3fr_0.7fr] grid-rows-[1fr_auto]">
    <PromptCard
      label="Kernaussage"
      prompt="Wie wollt ihr die Solution in diesem Update rahmen, sodass Thema, Nutzen und Fokus in wenigen Momenten greifbar werden?"
      hint="Zum Beispiel ueber eine kurze Kernaussage, ein Bild des Einsatzkontexts oder eine knappe Einordnung, fuer wen die Loesung gerade besonders relevant ist."
      className="row-span-2"
      tone="accent"
    />
    <PromptList
      title="Orientierung fuer die Folie"
      items={[
        "Welches Umfeld, Segment oder welche Stakeholder-Gruppe soll diese Solution vor allem erreichen?",
        "Welcher konkrete Nutzen oder welches Versprechen soll nach eurem Update klar im Raum stehen?",
        "Welche Fokussierung hilft, damit die Folie nicht alles auf einmal erklaeren muss?",
      ]}
      accent
    />
    <PromptCard
      label="Bewusste Schaerfe"
      prompt="Welche Anschlussidee, offene Frage oder Grenze darf sichtbar bleiben, damit die Folie fokussiert wirkt statt ueberladen?"
      hint="Eine gute Auftaktfolie oeffnet die Diskussion, ohne jeden Nebenstrang schon mitzunehmen."
    />
  </CanvasFrame>
);

const TopicAndScopeTemplate: CodeSlide = {
  id: "ditp-01-topic-scope-template",
  name: "01 · Update-Rahmen: Thema, Nutzen und Fokus",
  description:
    "Offene Auftaktfolie fuer interne Solution-Updates mit Fokus auf Thema, Nutzenversprechen und klarer Schwerpunktsetzung.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelband mit Einordnung des Update-Rahmens.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Leitflaechen fuer Thema, Nutzen und bewusste Fokussierung.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default TopicAndScopeTemplate;