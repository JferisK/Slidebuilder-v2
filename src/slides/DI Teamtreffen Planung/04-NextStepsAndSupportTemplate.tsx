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
    title="Update-Template 04 · Naechste Schritte und Bedarf aus der Runde"
    subtitle="Leere Abschlussfolie fuer das Update: was als Naechstes ansteht, welche Entscheidungen benoetigt werden und wo Unterstuetzung aus der Runde gebraucht wird. Hier liegen die BMC-Dimensionen Einnahmelogik und Kostenstruktur."
    badges={["Pflichtfolie", "BMC 8-9", "ohne Vorinhalt"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-[1.15fr_0.85fr] grid-rows-[auto_1fr]">
    <div className="col-span-2 flex flex-wrap gap-2">
      {[
        "Einnahmelogik / Nutzenhebel",
        "Kostenstruktur",
        "Entscheidungsbedarf",
      ].map((label, index) => (
        <SegmentPill key={label} label={label} tone={index === 1 ? "accent" : "default"} />
      ))}
    </div>
    <PromptCard
      label="Naechster Schritt"
      prompt="Was plant das Team als Naechstes, wie entsteht daraus Nutzen oder Einnahmewirkung und bis wann soll sichtbarer Fortschritt da sein?"
      hint="Hier spaeter die naechsten Schritte, Owner und den erwarteten Nutzenhebel oder Beitrag eintragen."
    />
    <PromptList
      title="Support aus der Runde"
      items={[
        "Welche Entscheidung wird fuer Einnahmelogik, Business Impact oder Priorisierung benoetigt?",
        "Wo fehlt Budget, Zugang, Sparring oder Freigabe mit Blick auf die Kostenstruktur?",
        "Welche Rueckmeldung soll direkt im Treffen eingesammelt werden?",
      ]}
      accent
    />
    <PromptList
      title="Abschlusslogik"
      items={[
        "Naechsten Schritt konkret formulieren",
        "Einnahmelogik oder Nutzenannahme explizit machen",
        "Kosten, Investitionen oder laufenden Aufwand sichtbar machen",
      ]}
    />
    <PromptCard
      label="Meeting-Nutzen"
      prompt="Welche Diskussion zu Nutzenhebel, Kostenstruktur oder Priorisierung soll das Team im Raum bewusst ausloesen?"
      hint="Die vierte Folie ist kein Appendix, sondern der operative Call to action des Updates mit wirtschaftlicher Perspektive."
      tone="accent"
    />
  </CanvasFrame>
);

const NextStepsAndSupportTemplate: CodeSlide = {
  id: "ditp-04-next-steps-support-template",
  name: "04 · Update-Template: Naechste Schritte und Bedarf",
  description:
    "Leere Abschlussfolie fuer Next Steps, benoetigte Entscheidungen und konkrete Unterstuetzung aus der Runde.",
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
      description: "Prompt-Flachen fuer Next Steps, Entscheidungen und Supportbedarf.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default NextStepsAndSupportTemplate;