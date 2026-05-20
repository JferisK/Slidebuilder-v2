import * as React from "react";
import type { CodeSlide } from "../types";
import { CanvasFrame, GroupedIdeaGrid, type IdeaGroup, UpdatePackTitle } from "./_shared";

const ideaGroups: IdeaGroup[] = [
  {
    title: "Schmerzpunkt oder Bedarf",
    kicker: "Was tut weh?",
    tone: "accent",
    className: "col-span-5 row-span-12 col-start-1 row-start-1",
    emphasis: "strong",
    items: [
      "Ein konkreter Reibungspunkt, der heute sichtbar oder messbar ist",
      "Eine wiederkehrende Situation, in der der Bedarf auffaellt",
      "Die Luecke zwischen heutigem Zustand und gewuenschtem Ergebnis",
      "Am Ende nur die staerksten Bedarfssignale auswaehlen und gewichten",
    ],
  },
  {
    title: "Zielgruppe und Umfeld",
    kicker: "Bei wem?",
    className: "col-span-3 row-span-5 col-start-10 row-start-1",
    items: [
      "Welche Persona, Rolle oder Branche diesen Bedarf zuerst spueren wuerde",
      "In welchem Arbeitskontext das Thema besonders relevant wird",
      "Welche Stakeholder man mit der Folie sofort an Bord holen will",
    ],
  },
  {
    title: "Kundenanschluss",
    kicker: "Wie erzaehlt man es?",
    className: "col-span-4 row-span-5 col-start-6 row-start-1",
    items: [
      "Welche Formulierung im Kundengespraech glaubwuerdig andockt",
      "Welcher Use Case oder Trigger den Bedarf anschaulich macht",
      "Welche Beobachtung zeigt, dass das Thema nicht nur intern spannend ist",
    ],
  },
  {
    title: "Moegliche Belege",
    kicker: "Was koennte drauf?",
    className: "col-span-7 row-span-7 col-start-6 row-start-6",
    items: [
      "Ein Beispiel aus einem Kundenkontext oder aus dem Delivery-Alltag",
      "Eine kurze Problemfolge, wenn nichts getan wird",
      "Eine Hypothese, die ihr bewusst als noch offen markieren wollt",
      "Belege nur dann zeigen, wenn sie das Kernproblem wirklich schaerfer machen",
    ],
  },
];

const TitleSlot: React.FC = () => (
  <UpdatePackTitle
    eyebrow="DI Teamtreffen Juli 2026"
    title="Pflichtfolie 02 · Welches Beduerfnis bedient ihr?"
    subtitle="Hier soll klar werden, welches Problem ihr loest, fuer wen es relevant ist und wie ihr den Bedarf so beschreibt, dass andere ihn auch beim Kunden anschlussfaehig erzaehlen koennen."
    badges={["Pflichtfolie", "Bedarf", "kundenfaehig"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-1">
    <GroupedIdeaGrid
      intro="Diese Folie sammelt alles, was den eigentlichen Bedarf plausibel macht. Erst die Punkte gruppieren, dann die staerksten Argumente fuer die finale Folie auswaehlen."
      groups={ideaGroups}
      headerLabel="Bedarf sammeln und gewichten"
      headerPill="Erst Problem, dann Beleg"
    />
  </CanvasFrame>
);

const CustomerNeedUpdate: CodeSlide = {
  id: "ditj26-02-customer-need-update",
  name: "02 · Pflichtfolie: Bedarf und Relevanz",
  description:
    "Verpflichtende Update-Folie als gruppiertes Brain-Teaser-Grid fuer Bedarf, Relevanz und Kundenanschluss.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelband fuer die zweite Pflichtfolie des Team-Updates.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Gruppierte Boxen mit moeglichen Inhalten fuer Bedarf, Relevanz und Zielgruppenanschluss.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default CustomerNeedUpdate;