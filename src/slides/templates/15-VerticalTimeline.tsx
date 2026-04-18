import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Evolution / Meilensteine"
    hint="Historische Rückschau oder Phasen"
  />
);

const Milestone: React.FC<{
  date: string;
  side: "left" | "right";
  body: string;
}> = ({ date, side, body }) => (
  <>
    {side === "left" ? (
      <WireBlock
        label={date}
        hint={body}
        className="col-span-5 row-span-1"
      />
    ) : (
      <div className="col-span-5 row-span-1" />
    )}
    <div className="col-span-2 row-span-1 flex justify-center items-center">
      <div className="w-full h-1 bg-slate-300" />
      <div className="w-3 h-3 rounded-full bg-slate-500 flex-none" />
      <div className="w-full h-1 bg-slate-300" />
    </div>
    {side === "right" ? (
      <WireBlock label={date} hint={body} className="col-span-5 row-span-1" />
    ) : (
      <div className="col-span-5 row-span-1" />
    )}
  </>
);

const ContentWire: React.FC = () => (
  <WireGrid rows={4}>
    <Milestone date="2022" side="left" body="Ausgangslage / Baseline" />
    <Milestone date="2023" side="right" body="Erste Ergebnisse" />
    <Milestone date="2024" side="left" body="Skalierung" />
    <Milestone date="2025" side="right" body="Ziel-Zustand" />
  </WireGrid>
);

export const VerticalTimeline: CodeSlide = {
  id: "vertical-timeline",
  name: "15 · Vertical Milestone Flow",
  description:
    "Vertikale Zeitachse mit seitlich versetzten Meilensteinen. Für Unternehmenshistorie, Projektphasen oder Evolution-Stories. Wirkt modern und dynamisch.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Zentrale Linie mit beidseitigen Meilensteinen",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default VerticalTimeline;
