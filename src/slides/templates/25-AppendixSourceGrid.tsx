import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle
    label="Titel: Appendix / Quellen / Methodik"
    hint="Backup-Material, nicht Haupt-Story"
  />
);

const SourceTile: React.FC<{ idx: number }> = ({ idx }) => (
  <WireBlock
    label={`Block ${idx}`}
    hint="Quelle / Berechnung / Annahme"
    variant="muted"
    className="col-span-3 row-span-1"
  />
);

const ContentWire: React.FC = () => (
  <WireGrid rows={3}>
    {Array.from({ length: 12 }).map((_, i) => (
      <SourceTile key={i} idx={i + 1} />
    ))}
  </WireGrid>
);

export const AppendixSourceGrid: CodeSlide = {
  id: "appendix-source-grid",
  name: "25 · Appendix / Source Grid",
  description:
    "Dichtes 4x3-Gitter mit kleinen Textblöcken oder Tabellen für Appendix-Zwecke: Datenquellen, Berechnungslogiken, Backup-Details. Hält das Hauptdeck sauber, schafft Transparenz.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Dichtes Appendix-Grid",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default AppendixSourceGrid;
