import * as React from "react";
import type { CodeSlide } from "../types";
import { CanvasFrame, PromptCard, PromptList, TemplateTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <TemplateTitle
    eyebrow="DI Teamtreffen Planung"
    title="Update-Rahmen 03 · Bewegung seit den Solution Days"
    subtitle="Hier soll sichtbar werden, was sich seit den Solution Days bewegt hat, woran ihr weiterarbeitet und wo von aussen Hebel oder Unterstuetzung wichtig werden."
    badges={["Update-Rahmen", "Fortschritt", "vergleichbar"]}
  />
);

const BodySlot: React.FC = () => (
  <CanvasFrame className="grid-cols-[1.15fr_0.85fr] grid-rows-[1fr_1fr_auto]">
    <PromptCard
      label="Seit den Solution Days"
      prompt="Was hat sich seit den Solution Days sichtbar veraendert und woran laesst sich diese Bewegung heute am besten zeigen?"
      hint="Das kann ein erreichter Meilenstein, ein neuer Stand im Team, eine validierte Richtung oder eine greifbare Lernkurve sein."
      className="row-span-2"
      tone="accent"
    />
    <PromptList
      title="Was inzwischen belastbar ist"
      items={[
        "Welche Aktivitaeten, Ergebnisse oder Artefakte sind inzwischen belastbar geworden?",
        "Welche Faehigkeiten, Ressourcen oder Setup-Bausteine stehen heute besser als noch bei den Solution Days?",
        "Welche Aussage koennt ihr mit gutem Gewissen als Fortschritt vertreten?",
      ]}
    />
    <PromptList
      title="Wo die naechsten Hebel liegen"
      items={[
        "Woran arbeitet ihr gerade weiter, damit aus Bewegung ein belastbarer naechster Schritt wird?",
        "Welche Partner, Entscheidungen oder Zuarbeiten wuerden die Entwicklung deutlich beschleunigen?",
        "Welche offene Stelle ist wichtig genug, um sie in der Runde bewusst sichtbar zu machen?",
      ]}
      accent
    />
    <div className="col-span-2">
      <PromptList
        title="Management-Ton statt Aktivitaetenliste"
        items={[
          "Lieber wenige klare Fortschrittssignale zeigen als jede Kleinigkeit listen",
          "Offene Punkte duerfen sichtbar bleiben, wenn klar ist, warum sie gerade zaehlen",
          "Wenn ihr Unterstuetzung braucht, den Hebel und den erwarteten Effekt konkret machen",
        ]}
        accent
      />
    </div>
  </CanvasFrame>
);

const ProgressSinceSolutionDaysTemplate: CodeSlide = {
  id: "ditp-03-progress-since-solution-days-template",
  name: "03 · Update-Rahmen: Bewegung seit Solution Days",
  description:
    "Offene Fortschrittsfolie fuer sichtbare Bewegung, aktuelle Hebel und den naechsten inhaltlichen Anschlusspunkt.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelband fuer Fortschritts- und Bewegungsupdates.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Leitflaechen fuer sichtbare Bewegung, laufende Hebel und relevante Unterstuetzung.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default ProgressSinceSolutionDaysTemplate;