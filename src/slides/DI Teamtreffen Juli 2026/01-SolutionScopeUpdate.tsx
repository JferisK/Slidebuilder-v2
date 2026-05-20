import * as React from "react";
import type { CodeSlide } from "../types";
import { CanvasFrame, GroupedIdeaGrid, type IdeaGroup, UpdatePackTitle } from "./_shared";

const ideaGroups: IdeaGroup[] = [
  {
    title: "Solution-Kern",
    kicker: "Worum geht es?",
    tone: "accent",
    className: "col-span-7 row-span-7 col-start-1 row-start-1",
    emphasis: "strong",
    items: [
      "Ein Satz, der die Solution in Alltagssprache erklaert",
      "Der Arbeitsbereich oder Markt, in dem ihr unterwegs seid",
      "Das Zielbild, auf das eure Solution einzahlt",
      "Aus den gesammelten Punkten spaeter eine klare Auftakt-Story bauen",
    ],
  },
  {
    title: "Nutzenversprechen",
    kicker: "Warum zaehlt das?",
    className: "col-span-5 row-span-4 col-start-8 row-start-1",
    items: [
      "Welchen Mehrwert Kunden oder Kolleginnen und Kollegen sofort verstehen sollen",
      "Welches Ergebnis oder welchen Effekt ihr mit der Solution verbindet",
      "Was nach dem Update im Kopf bleiben soll, wenn man nur eine Sache mitnimmt",
    ],
  },
  {
    title: "Fokus dieses Updates",
    kicker: "Was zeigt ihr heute?",
    className: "col-span-5 row-span-8 col-start-8 row-start-5",
    items: [
      "Welche Facette der Solution ihr diesmal bewusst in den Vordergrund stellt",
      "Welche Fragen oder Baustellen fuer dieses Treffen wirklich relevant sind",
      "Was ihr bewusst ausklammert, damit die Folie nicht ueberlaedt",
    ],
  },
  {
    title: "Greifbare Teaser",
    kicker: "Was koennte drauf?",
    className: "col-span-7 row-span-5 col-start-1 row-start-8",
    items: [
      "Ein Arbeitsbeispiel, ein Screenshot oder ein Use Case als Einstieg",
      "Eine knappe Vorher-Nachher-Logik oder Problem-Nutzen-Klammer",
      "Ein Schlaglicht auf Stakeholder, Segment oder Einsatzkontext",
    ],
  },
];

const TitleSlot: React.FC = () => (
  <UpdatePackTitle
    eyebrow="DI Teamtreffen Juli 2026"
    title="Pflichtfolie 01 · Thema, Nutzen und Fokus der Solution"
    subtitle="Diese erste Folie soll in wenigen Sekunden klaeren, woran ihr arbeitet, warum die Solution relevant ist und welchen Fokus ihr fuer dieses Update bewusst setzt."
    badges={["Pflichtfolie", "Update-Start", "vergleichbar"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-1">
    <GroupedIdeaGrid
      intro="Sammelt hier moegliche Inhalte fuer die Auftaktfolie, gruppiert sie in sinnvolle Themenfelder und baut daraus erst dann die finale Story der Slide."
      groups={ideaGroups}
      headerPill="Gewichtet und priorisiert"
    />
  </CanvasFrame>
);

const SolutionScopeUpdate: CodeSlide = {
  id: "ditj26-01-solution-scope-update",
  name: "01 · Pflichtfolie: Thema, Nutzen und Fokus",
  description:
    "Verpflichtende Auftaktfolie als gruppiertes Brain-Teaser-Grid fuer Thema, Nutzenversprechen und Fokus.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelband fuer die erste Pflichtfolie des Team-Updates.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Gruppierte Boxen mit moeglichen Inhalten fuer Themenrahmung, Nutzen und Fokussierung.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default SolutionScopeUpdate;