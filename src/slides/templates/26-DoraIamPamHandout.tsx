// src/slides/templates/26-DoraIamPamHandout.tsx
//
// Dense OneSlider handout — DORA / IAM / PAM executive briefing.
// Pattern: mirrors 24-PyramidHierarchy.tsx (canonical reference).
//   • Colors via var(--slide-*) and var(--ppt-accent*) only — no hardcoded hex.
//   • Widths: % and Tailwind layout — no fixed px in style props.
//   • Tailwind color classes are prohibited; Tailwind layout/spacing only.
//   • Dense-handout mode: body 9px, section headers 11px, leitzeile 10px, footer 8px.

import * as React from "react";
import type { CodeSlide } from "../types";
import { WireTitle } from "./_shared";

const tint = (cssVar: string, percent: number) =>
  `color-mix(in srgb, var(${cssVar}) ${percent}%, transparent)`;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Full-width hero Leitzeile band below the title placeholder. */
const HeroLeitzeile: React.FC = () => (
  <div
    className="w-full px-3 py-2 rounded-sm"
    style={{
      backgroundColor: tint("--slide-accent", 8),
      borderLeft: "3px solid var(--slide-accent)",
    }}
  >
    <p
      className="text-[10px] leading-snug"
      style={{ color: "var(--slide-text)" }}
    >
      <span className="font-semibold" style={{ color: "var(--slide-accent)" }}>
        Der Digital Operational Resilience Act ist seit dem 17.&nbsp;Januar&nbsp;2025 geltendes EU-Recht:
      </span>{" "}
      Banken müssen ICT-Risiken — einschließlich Identitäts- und Zugriffssteuerung — nachweisbar beherrschen,
      oder Bußgelder und persönliche Haftung drohen.
    </p>
  </div>
);

/** A single section cell in the 2×2 grid. */
const SectionCell: React.FC<{
  heading: string;
  tag?: string;
  bullets: string[];
  accentVar?: string;
}> = ({ heading, tag, bullets, accentVar = "--slide-accent" }) => (
  <div
    className="flex flex-col h-full rounded-sm overflow-hidden"
    style={{
      border: `1px solid ${tint(accentVar, 30)}`,
    }}
  >
    {/* Coloured header bar */}
    <div
      className="px-2 py-1 flex items-baseline gap-1.5"
      style={{ backgroundColor: tint(accentVar, 15) }}
    >
      {tag && (
        <span
          className="text-[8px] font-bold uppercase tracking-wider px-1 rounded-sm"
          style={{
            backgroundColor: `var(${accentVar})`,
            color: "var(--slide-bg)",
          }}
        >
          {tag}
        </span>
      )}
      <span
        className="text-[11px] font-semibold leading-tight"
        style={{ color: `var(${accentVar})` }}
      >
        {heading}
      </span>
    </div>
    {/* Bullet list */}
    <div className="flex-1 px-2 py-1.5">
      <ul className="flex flex-col gap-0.5 list-none m-0 p-0">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-1">
            <span
              className="mt-[3px] shrink-0 w-1 h-1 rounded-full"
              style={{ backgroundColor: `var(${accentVar})` }}
            />
            <span
              className="text-[9px] leading-snug"
              style={{ color: "var(--slide-text)" }}
            >
              {bullet}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/** Full-width penalty / sanctions callout box. */
const PenaltyCallout: React.FC = () => (
  <div
    className="w-full rounded-sm px-3 py-2"
    style={{ backgroundColor: "var(--ppt-accent3)" }}
  >
    <div className="flex items-center gap-2 mb-1.5">
      <span
        className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm shrink-0"
        style={{
          backgroundColor: "var(--ppt-accent4)",
          color: "var(--ppt-accent3)",
        }}
      >
        Sanktionen
      </span>
      <span
        className="text-[11px] font-semibold leading-tight"
        style={{ color: "#ffffff" }}
      >
        Zwei unabhängige Haftungsachsen
      </span>
    </div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
      {/* Axis 1 */}
      <div className="flex flex-col gap-0.5">
        <span
          className="text-[9px] font-semibold uppercase tracking-wide"
          style={{ color: "var(--ppt-accent4)" }}
        >
          Institutionelle Geldbuße
        </span>
        <span className="text-[9px] leading-snug" style={{ color: "#ffffff" }}>
          Bis zu{" "}
          <strong>1 % des globalen Jahresumsatzes</strong> pro Verstoß
          (BaFin-Vollzug)
        </span>
      </div>
      {/* Axis 2 */}
      <div className="flex flex-col gap-0.5">
        <span
          className="text-[9px] font-semibold uppercase tracking-wide"
          style={{ color: "var(--ppt-accent4)" }}
        >
          Persönliche Managerhaftung
        </span>
        <span className="text-[9px] leading-snug" style={{ color: "#ffffff" }}>
          Leitungsorgane haften individuell für mangelhafte ICT-Governance
          (DORA Art.&nbsp;5)
        </span>
      </div>
      {/* Third point — full width */}
      <div className="col-span-2 flex items-start gap-1 mt-0.5">
        <span
          className="mt-[3px] shrink-0 w-1 h-1 rounded-full"
          style={{ backgroundColor: "var(--ppt-accent4)" }}
        />
        <span className="text-[9px] leading-snug" style={{ color: "#ffffff" }}>
          Wiederholte Verstöße können zur Untersagung von Geschäftsaktivitäten führen.
        </span>
      </div>
    </div>
  </div>
);

/** Footer fact strip. */
const FooterStrip: React.FC = () => (
  <div
    className="w-full flex flex-wrap items-center gap-x-3 gap-y-0.5 px-2 py-1 rounded-sm"
    style={{
      backgroundColor: tint("--slide-secondary", 60),
      borderTop: `1px solid ${tint("--slide-text-muted", 40)}`,
    }}
  >
    {[
      "Geltungsbeginn: 17. Januar 2025",
      "DORA — Verordnung (EU) 2022/2554",
      "Rechtsgrundlage: Artt. 5, 9, 10, 64 DORA",
      "Aufsicht: BaFin (DE), EBA, ESMA, EIOPA",
    ].map((fact, i) => (
      <React.Fragment key={i}>
        {i > 0 && (
          <span
            className="text-[8px] select-none"
            style={{ color: "var(--slide-text-muted)" }}
            aria-hidden="true"
          >
            |
          </span>
        )}
        <span
          className="text-[8px] leading-none"
          style={{ color: "var(--slide-text-muted)" }}
        >
          {fact}
        </span>
      </React.Fragment>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Slot components
// ---------------------------------------------------------------------------

const TitleWire: React.FC = () => (
  <WireTitle
    label="DORA verpflichtet Banken ab 17. Januar 2025 zu nachweisbarer digitaler Betriebsresilienz — IAM, PAM und Managerhaftung sind Pflicht."
    hint="Titelplatzhalter — DORA Executive Handout"
  />
);

const ContentWire: React.FC = () => (
  <div className="flex flex-col h-full w-full gap-1.5 p-2">
    {/* Hero Leitzeile */}
    <HeroLeitzeile />

    {/* 2×2 Section grid */}
    <div className="grid grid-cols-2 gap-1.5 flex-1 min-h-0">
      {/* Row 1 — Context */}
      <SectionCell
        heading="Was ist DORA?"
        tag="Kontext"
        bullets={[
          "Gilt für Banken, Versicherungen, Zahlungsdienstleister und Kryptodienstleister.",
          "Reguliert erstmals direkt auch ICT-Drittanbieter (Kap. V).",
          "Löst fragmentierte nationale ICT-Vorgaben durch einheitliches EU-Recht ab.",
          "Geltung ab 17. Januar 2025 — keine Übergangsfrist mehr.",
        ]}
      />
      <SectionCell
        heading="Warum existiert DORA?"
        tag="Kontext"
        bullets={[
          "Digitale Ausfälle in Banken erzeugen systemische Ansteckungsrisiken.",
          "Cloud-Konzentration bei wenigen Anbietern erhöht Ausfallkorrelation.",
          "Frühere Regulierung adressierte ICT-Risiko zu fragmentiert und reaktiv.",
          "EU-Gesetzgeber verankert Resilienz als präventive Aufsichtspflicht.",
        ]}
      />

      {/* Row 2 — Requirements */}
      <SectionCell
        heading="IAM: Identitäts- und Zugriffsmanagement"
        tag="Pflicht"
        accentVar="--slide-primary"
        bullets={[
          "Least-Privilege-Prinzip: minimale Zugriffsrechte je Rolle und Funktion.",
          "Multi-Faktor-Authentifizierung für kritische Systeme und Remote-Zugriffe.",
          "Vollständiger Lifecycle-Management-Prozess (Onboarding, Änderung, Offboarding).",
          "Regelmäßige Access Reviews mit dokumentierter Genehmigungskette.",
          "Lückenlose Protokollierung und kontinuierliches Monitoring aller Zugriffe.",
        ]}
      />
      <SectionCell
        heading="PAM: Privilegierter Zugriff"
        tag="Pflicht"
        accentVar="--slide-primary"
        bullets={[
          "Governance für privilegierte Konten: Inventar, Eigentümer, Rezertifizierung.",
          "Just-in-Time-Access: Berechtigungen werden bedarfsgesteuert vergeben und entzogen.",
          "Vault und Session Recording: jede privilegierte Sitzung gespeichert und auditierbar.",
          "Vier-Augen-Prinzip bei kritischen administrativen Eingriffen.",
          "Strikte Trennung von Produktions- und Administratoridentitäten.",
        ]}
      />
    </div>

    {/* Penalty callout */}
    <PenaltyCallout />

    {/* Footer fact strip */}
    <FooterStrip />
  </div>
);

// ---------------------------------------------------------------------------
// CodeSlide export
// ---------------------------------------------------------------------------

export const DoraIamPamHandout: CodeSlide = {
  id: "dora-iam-pam-handout",
  name: "26 · DORA / IAM / PAM Handout",
  description:
    "Dense C-Level OneSlider: DORA-Pflichten mit IAM, PAM und Managerhaftung. Hero-Leitzeile, 2×2-Raster (Kontext + Anforderungen), Sanktions-Callout und Fußzeilen-Faktenband. 16:9, KPMG-Identität.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "DORA-Titelzeile — Aktions-Titel",
      Component: TitleWire,
    },
    {
      key: "content",
      label: "Inhalt",
      description:
        "Leitzeile · 2×2-Raster (Was / Warum / IAM / PAM) · Sanktions-Box · Fußzeile",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default DoraIamPamHandout;
