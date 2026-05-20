import * as React from "react";
import type { CodeSlide } from "../types";
import { CanvasFrame, GroupedIdeaGrid, type IdeaGroup, UpdatePackTitle } from "./_shared";

const ideaGroups: IdeaGroup[] = [
  {
    title: "Sichtbare Fortschritte",
    kicker: "Was ist passiert?",
    tone: "accent",
    className: "col-span-8 row-span-8 col-start-1 row-start-1",
    emphasis: "strong",
    items: [
      "Ein Meilenstein, eine Entscheidung oder ein Schritt, der seit Sonthofen wirklich erreicht wurde",
      "Ein Lerngewinn oder eine Validierung, die vorher noch offen war",
      "Ein Unterschied zwischen damals und heute, den man konkret benennen kann",
      "Spaeter nur 2 bis 3 Fortschrittssignale zeigen, die echte Bewegung beweisen",
    ],
  },
  {
    title: "Greifbare Artefakte",
    kicker: "Was koennte drauf?",
    className: "col-span-6 row-span-4 col-start-7 row-start-9",
    items: [
      "Ein Demo-Stand, Prototyp, Canvas, Angebot oder Dokument, das inzwischen existiert",
      "Ein Test, Workshop oder Kundengespraech, aus dem belastbare Erkenntnisse kamen",
      "Ein neues Setup, Partnerbild oder Ressourcenbaustein, der heute steht",
    ],
  },
  {
    title: "Offene Luecken",
    kicker: "Was fehlt noch?",
    className: "col-span-6 row-span-4 col-start-1 row-start-9",
    items: [
      "Welche Blockade oder Abhaengigkeit den naechsten Schritt noch bremst",
      "Welche Arbeit trotz Vorleistung noch nicht belastbar abgeschlossen ist",
      "Wo die Runde verstehen soll, dass noch echter Druck oder Fokus noetig ist",
    ],
  },
  {
    title: "Botschaft an die Runde",
    kicker: "Wie verkauft ihr den Stand?",
    className: "col-span-4 row-span-8 col-start-9 row-start-1",
    items: [
      "Welche eine Fortschrittsaussage man nach eurem Update wiedergeben koennen soll",
      "Wie ihr Ehrlichkeit ueber offene Punkte mit sichtbarer Bewegung verbindet",
      "Welche Diskussion ihr bewusst anschieben wollt, statt nur Aktivitaeten zu listen",
      "Die Botschaft auf sichtbare Bewegung statt auf reine Aktivitaetslisten zuspitzen",
    ],
  },
];

const TitleSlot: React.FC = () => (
  <UpdatePackTitle
    eyebrow="DI Teamtreffen Juli 2026"
    title="Pflichtfolie 03 · Was ist seit den Solution Days passiert?"
    subtitle="Diese Folie soll sichtbare Bewegung seit Sonthofen zeigen. Nicht entscheidend ist, wie viel Arbeit investiert wurde, sondern was heute belastbar anders ist als damals."
    badges={["Pflichtfolie", "Fortschritt", "Zugzwang"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-1">
    <GroupedIdeaGrid
      intro="Hier sammelt ihr moegliche Fortschrittssignale, offene Luecken und Belege. Erst nach der Gruppierung entscheidet ihr, welche 2 bis 3 Punkte auf die eigentliche Update-Slide kommen."
      groups={ideaGroups}
      headerLabel="Fortschritt sichtbar machen"
      headerPill="Bewegung vor Aktivitaeten"
    />
  </CanvasFrame>
);

const ProgressSinceSolutionDaysUpdate: CodeSlide = {
  id: "ditj26-03-progress-since-solution-days-update",
  name: "03 · Pflichtfolie: Fortschritt seit Solution Days",
  description:
    "Verpflichtende Fortschrittsfolie als gruppiertes Brain-Teaser-Grid fuer Bewegung seit den Solution Days und offene Hebel.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelband fuer die dritte Pflichtfolie des Team-Updates.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Gruppierte Boxen mit moeglichen Inhalten fuer Fortschritt, offene Luecken und wirksame Hebel.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default ProgressSinceSolutionDaysUpdate;