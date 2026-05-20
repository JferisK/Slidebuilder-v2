import * as React from "react";
import type { CodeSlide } from "../types";
import { CanvasFrame, GroupedIdeaGrid, type IdeaGroup, UpdatePackTitle } from "./_shared";

const ideaGroups: IdeaGroup[] = [
  {
    title: "Naechster konkreter Schritt",
    kicker: "Was tut ihr als Naechstes?",
    tone: "accent",
    className: "col-span-8 row-span-6 col-start-1 row-start-1",
    emphasis: "strong",
    items: [
      "Die eine Aktivitaet oder Entscheidung, die als Naechstes wirklich ansteht",
      "Ein kurzer Zeithorizont oder Meilenstein, an dem man Fortschritt festmachen kann",
      "Woran man merkt, dass dieser Schritt erfolgreich war",
      "So formulieren, dass daraus spaeter die klare Schlussbotschaft der Folie wird",
    ],
  },
  {
    title: "Benoetigter Support",
    kicker: "Was braucht ihr?",
    className: "col-span-4 row-span-12 col-start-9 row-start-1",
    items: [
      "Welche Freigabe, Ressource oder Priorisierung jetzt den Unterschied macht",
      "Welche Art von Sparring, Budget oder Vernetzung ihr konkret braucht",
      "Was die Runde tun kann, statt nur zuzuhoren",
      "Den Support so konkret machen, dass die Runde den Bedarf sofort versteht",
    ],
  },
  {
    title: "Wer helfen koennte",
    kicker: "Von wem?",
    className: "col-span-3 row-span-6 col-start-1 row-start-7",
    items: [
      "Welche Rolle, Person oder Partnergruppe euch beim naechsten Schritt helfen kann",
      "Wo ein Sponsor, Entscheider oder Fachexperte gebraucht wird",
      "Welche Rueckmeldung oder Entscheidung ihr gezielt in den Raum gebt",
    ],
  },
  {
    title: "Erwarteter Effekt",
    kicker: "Warum lohnt sich das?",
    className: "col-span-5 row-span-6 col-start-4 row-start-7",
    items: [
      "Welchen Hebel der naechste Schritt fuer Kunde, Team oder Pipeline ausloesen soll",
      "Was sich verbessert, wenn der benoetigte Support wirklich kommt",
      "Welche Botschaft als klares Schlussbild der Folie stehen bleiben soll",
    ],
  },
];

const TitleSlot: React.FC = () => (
  <UpdatePackTitle
    eyebrow="DI Teamtreffen Juli 2026"
    title="Pflichtfolie 04 · Was habt ihr vor und was braucht ihr dafuer?"
    subtitle="Zum Abschluss soll klar werden, was ihr als Naechstes tun wollt, welchen Effekt ihr erwartet und welche Entscheidung, Hilfe oder Rueckendeckung ihr aus der Runde braucht."
    badges={["Pflichtfolie", "Next Steps", "Supportbedarf"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-1">
    <GroupedIdeaGrid
      intro="Diese Abschlussfolie startet mit einem Brainstorm in Gruppen: Was ist der naechste Schritt, was braucht ihr dafuer und welche Botschaft soll die Runde mitnehmen?"
      groups={ideaGroups}
      headerLabel="Naechste Schritte priorisieren"
      headerPill="Support sichtbar machen"
    />
  </CanvasFrame>
);

const NextStepsAndSupportUpdate: CodeSlide = {
  id: "ditj26-04-next-steps-support-update",
  name: "04 · Pflichtfolie: Naechste Schritte und Bedarf",
  description:
    "Verpflichtende Abschlussfolie als gruppiertes Brain-Teaser-Grid fuer naechste Schritte und benoetigte Unterstuetzung.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelband fuer die vierte Pflichtfolie des Team-Updates.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Gruppierte Boxen mit moeglichen Inhalten fuer naechste Schritte, Supportbedarf und klaren Call into the room.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default NextStepsAndSupportUpdate;