import * as React from "react";
import {
  Activity,
  Fingerprint,
  KeyRound,
  Layers3,
  Network,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CodeSlide } from "../types";

const tint = (cssVar: string, percent: number, mixWith = "transparent") =>
  `color-mix(in srgb, var(${cssVar}) ${percent}%, ${mixWith})`;

const layers: Array<{
  eyebrow: string;
  title: string;
  summary: string;
  controls: string[];
  riskOutcome: string;
  icon: LucideIcon;
  tone: "accent" | "primary";
}> = [
  {
    eyebrow: "1. Scope & Governance",
    title: "Kronjuwelen, Rollen und Policy zuerst sauber schneiden",
    summary:
      "PAM startet mit klaren privilegierten Personas, Tier-0 Scope und verbindlichen Regeln fuer Genehmigung, Rezertifizierung und SoD.",
    controls: [
      "kritische Systeme und privilegierte Rollen inventarisieren",
      "human-, admin- und machine-identities trennen",
      "Joiner/Mover/Leaver, SoD und Rezertifizierung definieren",
    ],
    riskOutcome: "senkt unklare Verantwortungen und ueberprivilegierte Startpunkte",
    icon: Layers3,
    tone: "accent",
  },
  {
    eyebrow: "2. Access Control Plane",
    title: "JIT, MFA und Freigabe in einen zentralen Broker legen",
    summary:
      "Die Steuerungsebene entscheidet, wer wann fuer welche Aufgabe privilegiert werden darf und erzwingt starke Authentisierung.",
    controls: [
      "policy engine fuer least privilege und risikobasierte Freigaben",
      "MFA fuer alle privilegierten Einstiege und Break-Glass",
      "zeitlich begrenzte Aktivierung statt standing privilege",
    ],
    riskOutcome: "reduziert Missbrauch durch kompromittierte Konten und Dauerechte",
    icon: Fingerprint,
    tone: "primary",
  },
  {
    eyebrow: "3. Secrets & Session Layer",
    title: "Credentials, Sessions und Befehle technisch einsperren",
    summary:
      "Vault, Rotation, Session Proxy und Recording machen privilegierte Nutzung kontrollierbar, ohne Geheimnisse offen zirkulieren zu lassen.",
    controls: [
      "vaulting und automatische Rotation fuer privilegierte Credentials",
      "session brokering, recording und command control",
      "shared accounts abbauen und ownership erzwingen",
    ],
    riskOutcome: "begrenzt lateral movement, credential theft und forensische Luecken",
    icon: KeyRound,
    tone: "accent",
  },
  {
    eyebrow: "4. Detection & Resilience",
    title: "Telemetry, Alarme und Evidenz in den Betrieb bringen",
    summary:
      "Ein gutes PAM endet nicht beim Login, sondern liefert Anomalien, Auditfaehigkeit und belastbare Nachweise fuer Risk, Audit und Incident Response.",
    controls: [
      "SIEM/UEBA-Anbindung fuer Anomalien auf privilegierten Pfaden",
      "eindeutige Audit Trails fuer Mensch, Maschine und Drittparteien",
      "regelmaessige Kontrolltests, Tabletops und Break-Glass-Drills",
    ],
    riskOutcome: "verkuerzt Erkennung, Rekonstruktion und regulatorische Nachweisfuehrung",
    icon: Activity,
    tone: "primary",
  },
];

const designPrinciples = [
  "deny by default und nur task-basiert erhoehen",
  "menschliche und nicht-menschliche Privilegien getrennt steuern",
  "jede Session einer Person, Aufgabe und Zeitspanne zuordnen",
  "Drittparteien wie interne Admins kontrollieren, nicht ausnehmen",
];

const riskHotspots = [
  "standing privilege auf Servern, Cloud-Admins und Verzeichnisdiensten",
  "unverwaltete Service Accounts, Secrets in Skripten und lokale Admins",
  "fehlende Session-Telemetrie bei kritischen Changes und Notfallzugriffen",
  "PAM ohne Rezertifizierung, SoD und Ownership wird zum Tool statt zur Kontrolle",
];

const TitleSlot: React.FC = () => (
  <div
    className="flex h-full w-full items-center justify-between gap-4"
    style={{ fontFamily: "var(--slide-font-body)" }}
  >
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="flex h-11 w-11 flex-none items-center justify-center rounded-xl"
        style={{
          backgroundColor: "var(--slide-accent)",
          color: "var(--slide-bg)",
        }}
      >
        <ShieldAlert size={22} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--slide-text-muted)" }}
        >
          PAM Architektur
        </div>
        <div
          className="text-[25px] font-semibold leading-[1.08]"
          style={{
            color: "var(--slide-accent)",
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          PAM senkt Risiko nur als durchgaengige Kontrollkette
        </div>
        <div
          className="mt-0.5 text-[12px] leading-snug"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Governance, Access Broker, Vaulting, Session Control und Telemetry muessen gemeinsam greifen.
        </div>
      </div>
    </div>

    <div className="flex flex-none flex-col items-end gap-1.5 text-right">
      <div
        className="rounded-md px-2 py-1 text-[10px] font-medium"
        style={{
          backgroundColor: tint("--slide-primary", 12),
          border: `1px solid ${tint("--slide-primary", 28)}`,
          color: "var(--slide-primary)",
        }}
      >
        Risk Lens: Blast Radius, Misuse, Auditability
      </div>
      <div
        className="text-[10px]"
        style={{ color: "var(--slide-text-muted)" }}
      >
        Zielbild fuer Banken, kritische Plattformen und Drittparteizugriffe
      </div>
    </div>
  </div>
);

const LayerBand: React.FC<(typeof layers)[number]> = ({
  eyebrow,
  title,
  summary,
  controls,
  riskOutcome,
  icon: Icon,
  tone,
}) => {
  const toneVar = tone === "accent" ? "--slide-accent" : "--slide-primary";

  return (
    <div
      className="grid grid-cols-[auto_minmax(0,1fr)_minmax(18%,22%)] gap-3 rounded-xl border px-3 py-2"
      style={{
        backgroundColor: tint(toneVar, 8, "var(--slide-bg)"),
        borderColor: tint(toneVar, 24),
      }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{
          backgroundColor: tint(toneVar, 18),
          color: `var(${toneVar})`,
        }}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <div
          className="text-[9px] uppercase tracking-[0.16em]"
          style={{ color: `var(${toneVar})` }}
        >
          {eyebrow}
        </div>
        <div
          className="text-[13px] font-semibold leading-tight"
          style={{
            color: `var(${toneVar})`,
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          {title}
        </div>
        <div
          className="mt-1 text-[10px] leading-snug"
          style={{ color: "var(--slide-text)" }}
        >
          {summary}
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          {controls.map((control) => (
            <div
              key={control}
              className="rounded-md px-2 py-1 text-[9px] leading-snug"
              style={{
                backgroundColor: tint("--slide-secondary", 55, "var(--slide-bg)"),
                color: "var(--slide-text)",
              }}
            >
              {control}
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex min-w-0 self-stretch items-center rounded-lg px-2 py-1.5 text-[9px] leading-snug"
        style={{
          backgroundColor: tint("--slide-bg", 75, `var(${toneVar})`),
          color: "var(--slide-text)",
          border: `1px solid ${tint(toneVar, 22)}`,
        }}
      >
        <span>
          <strong style={{ color: `var(${toneVar})` }}>Risk Effekt:</strong>{" "}
          {riskOutcome}
        </span>
      </div>
    </div>
  );
};

const SidePanel: React.FC<{
  title: string;
  eyebrow: string;
  icon: LucideIcon;
  toneVar: "--slide-accent" | "--slide-primary";
  items: string[];
}> = ({ title, eyebrow, icon: Icon, toneVar, items }) => (
  <div
    className="rounded-xl border px-3 py-2"
    style={{
      backgroundColor: tint(toneVar, 9, "var(--slide-bg)"),
      borderColor: tint(toneVar, 24),
    }}
  >
    <div className="flex items-start gap-2">
      <div
        className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg"
        style={{
          backgroundColor: tint(toneVar, 18),
          color: `var(${toneVar})`,
        }}
      >
        <Icon size={16} />
      </div>
      <div>
        <div
          className="text-[9px] uppercase tracking-[0.16em]"
          style={{ color: `var(${toneVar})` }}
        >
          {eyebrow}
        </div>
        <div
          className="text-[13px] font-semibold leading-tight"
          style={{
            color: `var(${toneVar})`,
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          {title}
        </div>
      </div>
    </div>
    <div className="mt-2 flex flex-col gap-1.5">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-md px-2 py-1.5 text-[10px] leading-snug"
          style={{
            backgroundColor: tint("--slide-secondary", 55, "var(--slide-bg)"),
            color: "var(--slide-text)",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div
    className="grid h-full w-full grid-cols-[1.34fr_0.66fr] gap-3"
    style={{ fontFamily: "var(--slide-font-body)" }}
  >
    <div className="flex min-h-0 flex-col gap-2">
      <div
        className="rounded-xl border px-3 py-2"
        style={{
          backgroundColor: tint("--slide-accent", 7, "var(--slide-bg)"),
          borderColor: tint("--slide-accent", 20),
        }}
      >
        <div
          className="text-[11px] leading-snug"
          style={{ color: "var(--slide-text)" }}
        >
          <strong
            style={{
              color: "var(--slide-accent)",
              fontFamily: "var(--slide-font-heading)",
            }}
          >
            Architekturprinzip:
          </strong>{" "}
          PAM ist kein Tresorprojekt. Die Architektur muss den kompletten privilegierten Pfad absichern:
          Identitaet, Freigabe, Credential, Session und Nachweis.
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {layers.map((layer) => (
          <LayerBand key={layer.eyebrow} {...layer} />
        ))}
      </div>

      <div
        className="flex items-center justify-between gap-3 rounded-xl px-3 py-2"
        style={{
          backgroundColor: tint("--slide-primary", 10, "var(--slide-bg)"),
          border: `1px solid ${tint("--slide-primary", 22)}`,
        }}
      >
        <div className="text-[10px] leading-snug" style={{ color: "var(--slide-text)" }}>
          <strong style={{ color: "var(--slide-primary)" }}>So-what:</strong>{" "}
          Wenn eine Ebene fehlt, bleibt privilegierter Zugriff technisch moeglich,
          aber operativ nicht beherrscht.
        </div>
        <div className="text-[10px]" style={{ color: "var(--slide-text-muted)" }}>
          Outcome: weniger Blast Radius, weniger Standing Privilege, mehr Evidenz
        </div>
      </div>
    </div>

    <div className="grid min-h-0 grid-rows-[auto_auto_1fr] gap-2">
      <SidePanel
        title="Designprinzipien aus Risk Sicht"
        eyebrow="Risk Lens"
        icon={Network}
        toneVar="--slide-primary"
        items={designPrinciples}
      />
      <SidePanel
        title="Hotspots, die zuerst geschlossen werden muessen"
        eyebrow="Priority Risks"
        icon={TriangleAlert}
        toneVar="--slide-accent"
        items={riskHotspots}
      />
      <div
        className="rounded-xl border px-3 py-2"
        style={{
          backgroundColor: tint("--slide-secondary", 52, "var(--slide-bg)"),
          borderColor: tint("--slide-text-muted", 20),
        }}
      >
        <div
          className="text-[9px] uppercase tracking-[0.16em]"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Minimaler Steuerungskern
        </div>
        <div
          className="mt-1 text-[12px] font-semibold leading-tight"
          style={{
            color: "var(--slide-accent)",
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          Jede privilegierte Aktion braucht Identitaet, Anlass, Zeitfenster und Beweis.
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {[
            "wer fordert Zugriff an",
            "welche Aufgabe rechtfertigt ihn",
            "wie lange bleibt er aktiv",
            "wo liegt der revisionssichere Nachweis",
          ].map((item) => (
            <div
              key={item}
              className="rounded-md px-2 py-1.5 text-[10px] leading-snug"
              style={{
                backgroundColor: "var(--slide-bg)",
                color: "var(--slide-text)",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PamArchitectureRiskSlide: CodeSlide = {
  id: "pam-architecture-risk-overview",
  name: "PAM Architektur aus Risk Sicht",
  description:
    "Produktionsfolie zur Zielarchitektur von PAM: 4-Layer-Stack mit Governance, Control Plane, Vaulting/Session und Monitoring plus expliziter Risk Lens.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Aktions-Titel mit Kurzunterzeile und Risk-Lens-Marker.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description:
        "Architektur-Stack links, Risk-Panels rechts, kompaktes So-what am Fuss.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default PamArchitectureRiskSlide;