import * as React from "react";
import type { CodeSlide } from "../types";
import { FooterBand, ProcessSteps, StandardTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Zusammenarbeit"
    title="So arbeitet ihr heute zusammen"
  />
);

const BodySlot: React.FC = () => (
  <div className="grid h-full grid-rows-[1fr_auto] gap-4">
    <ProcessSteps
      steps={[
        { title: "Erst erkundet ihr die App in Kleingruppen." },
        { title: "Danach bekommt jede Kleingruppe eine vorbereitete inhaltliche Slide." },
        { title: "Später präsentiert ihr in größeren Teams jeweils drei Slides." },
      ]}
      tone="trust"
    />
    <FooterBand
      title="Ziel"
      text="App beobachten, Slide verstehen, beides zusammen präsentieren."
      tone="signal"
    />
  </div>
);

const GroupMechanicsSlide: CodeSlide = {
  id: "diw-10-group-mechanics",
  name: "10 · Gruppenmechanik",
  description: "Organisationsfolie für die studentische Arbeitsform.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default GroupMechanicsSlide;
