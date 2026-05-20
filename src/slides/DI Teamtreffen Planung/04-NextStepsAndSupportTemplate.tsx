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
    title="Update-Rahmen 04 · Naechste Schritte und was aus der Runde hilft"
    subtitle="Zum Abschluss soll klar werden, was als Naechstes ansteht, welche Wirkung ihr damit verbindet und an welcher Stelle Rueckhalt, Entscheidungen oder Sparring hilfreich sind."
    badges={["Update-Rahmen", "Abschluss", "Call into the room"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-[1.15fr_0.85fr] grid-rows-[1fr_auto]">
    <PromptCard
      label="Naechster Schritt"
      prompt="Was ist der naechste sinnvolle Schritt, den ihr aus diesem Update heraus anstossen wollt, und woran merkt man danach Wirkung?"
      hint="Das kann ein konkreter Arbeitsschritt, eine Entscheidung, ein Test oder ein Fokus fuer die naechste Etappe sein."
      className="row-span-2"
    />
    <PromptList
      title="Was aus der Runde wirklich hilft"
      items={[
        "Welche Entscheidung, Freigabe oder Rueckmeldung wuerde den naechsten Schritt spuerbar erleichtern?",
        "Wo hilft Zugang, Sparring, Vernetzung oder Priorisierung mehr als noch eine weitere Folie?",
        "Welche Frage wollt ihr bewusst in den Raum geben, damit sie dort bearbeitet werden kann?",
      ]}
      accent
    />
    <PromptCard
      label="Entscheidungslogik"
      prompt="Welcher Nutzenhebel, welcher Aufwand und welche Diskussion sollen fuer die Runde unmittelbar sichtbar sein?"
      hint="Die Abschlussfolie darf klar fuehren, ohne wie ein Steuerungstableau auszusehen."
      tone="accent"
    />
    <PromptCard
      label="In die Runde geben"
      prompt="Welche Diskussion oder welche Form von Rueckhalt soll diese Folie im Raum ausloesen?"
      hint="Die Abschlussfolie darf klar sein, ohne nach Steuerung auszusehen: wichtig ist, dass andere verstehen, wo sie sinnvoll andocken koennen."
    />
  </CanvasFrame>
);

const NextStepsAndSupportTemplate: CodeSlide = {
  id: "ditp-04-next-steps-support-template",
  name: "04 · Update-Rahmen: Naechste Schritte und Bedarf",
  description:
    "Offene Abschlussfolie fuer naechste Schritte, wirtschaftliche Stoerke und konkrete Unterstuetzung aus der Runde.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelband fuer den operativen Abschluss des Updates.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Leitflaechen fuer naechste Schritte, wirtschaftliche Einordnung und hilfreiche Rueckmeldungen aus der Runde.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default NextStepsAndSupportTemplate;