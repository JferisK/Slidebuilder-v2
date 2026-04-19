import * as React from "react";
import type { CodeSlide } from "../types";
import { ReflectionGrid, StandardTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Übergang"
    title="Jetzt schauen wir auf ein ganzes System"
    subtitle="Drei kurze Fragen leiten vom Video in die App-Erkundung."
  />
);

const BodySlot: React.FC = () => (
  <ReflectionGrid
    items={[
      "Wo können Identitäten, Rechte oder Kontrollen schiefgehen?",
      "Was wäre in einem echten System besonders kritisch?",
      "Welche Muster könnten wir gleich in der App wiederfinden?",
    ]}
  />
);

const VideoToAppTransitionSlide: CodeSlide = {
  id: "diw-07-video-to-app-transition",
  name: "07 · Übergang vom Video in die App",
  description: "Reflexionsfolie zwischen Video und App-Erkundung.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default VideoToAppTransitionSlide;
