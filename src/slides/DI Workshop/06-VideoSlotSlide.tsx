import * as React from "react";
import type { CodeSlide } from "../types";
import { CenteredPrompt, StandardTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Praxisbeispiel"
    title="Praxisbeispiel aus dem Alltag"
    subtitle="Kurzer Video-Einschub"
  />
);

const BodySlot: React.FC = () => (
  <CenteredPrompt
    title="Kurzer Video-Einschub"
    subtitle="Der konkrete Inhalt wird live gesetzt. Diese Folie hält den externen Impuls bewusst offen."
  />
);

const VideoSlotSlide: CodeSlide = {
  id: "diw-06-video-slot",
  name: "06 · Video-Slot",
  description: "Platzhalterfolie für einen externen Video-Impuls.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default VideoSlotSlide;
