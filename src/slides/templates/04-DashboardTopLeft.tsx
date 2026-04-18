import * as React from "react";
import type { CodeSlide } from "../types";
import { WireBlock, WireGrid, WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle label="Titel: Operativer Status-Überblick" hint="Dashboard-Header" />
);

const ContentWire: React.FC = () => (
  <WireGrid rows={3}>
    <WireBlock
      label="Primärer KPI"
      hint="Wichtigstes Widget, oben links (F-Pattern Anker)"
      variant="accent"
      className="col-span-4 row-span-1"
    />
    <WireBlock label="Sekundärer KPI" variant="metric" className="col-span-4 row-span-1" />
    <WireBlock label="Tertiärer KPI" variant="metric" className="col-span-4 row-span-1" />
    <WireBlock
      label="Trend-Chart"
      variant="chart"
      className="col-span-8 row-span-2"
    />
    <WireBlock
      label="Detail / Alerts"
      variant="muted"
      className="col-span-4 row-span-2"
    />
  </WireGrid>
);

export const DashboardTopLeft: CodeSlide = {
  id: "dashboard-top-left",
  name: "04 · Dashboard mit Primärfokus oben links",
  description:
    "Kritische Status-Infos im oberen linken Quadranten (F-Pattern). 4-4-4 KPI-Zeile oben, darunter Trend-Chart + Alerts. Für operative Führungs-Dashboards.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "KPI-Zeile + Chart/Alerts darunter",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default DashboardTopLeft;
