import * as React from "react";
import type { CodeSlide } from "../types";
import { CardGrid, StandardTitle } from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Schutzobjekte"
    title="Was wir mit IAM eigentlich schützen"
    subtitle="Es geht nicht nur um Konten, sondern um Daten, Aktionen und Nachvollziehbarkeit."
  />
);

const BodySlot: React.FC = () => (
  <CardGrid
    columns={3}
    items={[
      { title: "Personenbezogene Daten", text: "Persönliche Informationen, die nicht beliebig sichtbar sein dürfen.", tone: "primary" },
      { title: "Finanzdaten", text: "Sensible Geschäfts- und Zahlungsinformationen mit direktem Schadenspotenzial.", tone: "trust" },
      { title: "Vertrauliche Kontexte", text: "Interne Kommentare, Begründungen und Zusatzinformationen.", tone: "signal" },
      { title: "Kritische Aktionen", text: "Freigaben, Exporte, Rollenzuweisungen und andere wirksame Eingriffe.", tone: "risk" },
      { title: "Nachvollziehbarkeit", text: "Logs und Protokolle, die Verantwortung und Belegbarkeit sichern.", tone: "ai" },
    ]}
  />
);

const ProtectionObjectsSlide: CodeSlide = {
  id: "diw-04-protection-objects",
  name: "04 · Was wir mit IAM schützen",
  description: "Kachelfolie zu den zentralen Schutzobjekten von IAM.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default ProtectionObjectsSlide;
