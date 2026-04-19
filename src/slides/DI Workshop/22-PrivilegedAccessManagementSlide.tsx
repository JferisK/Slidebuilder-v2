import * as React from "react";
import type { CodeSlide } from "../types";
import {
  FooterBand,
  LayerStack,
  StandardTitle,
} from "./_shared";

const TitleSlot: React.FC = () => (
  <StandardTitle
    eyebrow="Vertiefung"
    title="Was ist Privileged Access Management?"
    tags={[
      { label: "PAM", tone: "signal" },
      { label: "JIT", tone: "trust" },
      { label: "Generalschlüssel", tone: "risk" },
    ]}
  />
);

const BodySlot: React.FC = () => (
  <div className="grid h-full grid-cols-[1.02fr_0.98fr] gap-4">
    <div className="grid grid-rows-[auto_1fr] gap-4">
      <FooterBand
        title="Merksatz"
        text="Dauerhafte Privilegien sind wie Generalschlüssel, die immer herumliegen."
        tone="risk"
      />
      <LayerStack
        layers={[
          {
            key: "task",
            title: "Nur für die Aufgabe",
            text: "Privilegien werden auf konkrete, fachlich notwendige Aktionen begrenzt.",
            tone: "primary",
          },
          {
            key: "time",
            title: "Nur für den Zeitraum",
            text: "Rechte werden nicht dauerhaft bereitgelegt, sondern zeitlich begrenzt vergeben.",
            tone: "trust",
          },
          {
            key: "approval",
            title: "Mit Freigabe und Protokoll",
            text: "Privilegierte Aktionen brauchen Nachvollziehbarkeit und Kontrollpunkte.",
            tone: "signal",
          },
          {
            key: "remove",
            title: "Mit Rücknahme nach Nutzung",
            text: "Nach der Aufgabe werden erhöhte Rechte wieder entzogen.",
            tone: "ai",
          },
        ]}
      />
    </div>
    <LayerStack
      layers={[
        {
          key: "roles",
          title: "Rollen ändern",
          text: "Privilegierte Identitäten dürfen Rollen nicht unkontrolliert vergeben.",
          tone: "primary",
        },
        {
          key: "exceptions",
          title: "Ausnahmen freigeben",
          text: "Sonderfälle sind privilegierte Entscheidungen mit hohem Missbrauchspotenzial.",
          tone: "risk",
        },
        {
          key: "payments",
          title: "Auszahlungen auslösen",
          text: "Finanzwirksame Aktionen gehören unter besonders enge Kontrolle.",
          tone: "trust",
        },
        {
          key: "exports",
          title: "Große Datenmengen exportieren",
          text: "Bulk-Exporte erzeugen hohen Schaden bei geringem operativem Aufwand.",
          tone: "signal",
        },
      ]}
    />
  </div>
);

const PrivilegedAccessManagementSlide: CodeSlide = {
  id: "diw-22-privileged-access-management",
  name: "22 · Was ist Privileged Access Management?",
  description: "Vertiefungsfolie zu privilegierten Konten, Rollen und Aktionen.",
  slots: [
    { key: "title", label: "Titel", Component: TitleSlot },
    { key: "content", label: "Inhalt", Component: BodySlot },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default PrivilegedAccessManagementSlide;
