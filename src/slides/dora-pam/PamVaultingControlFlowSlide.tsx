import * as React from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Database,
  FileSearch,
  KeyRound,
  RefreshCw,
  Server,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CodeSlide } from "../types";

const tint = (cssVar: string, percent: number, mixWith = "transparent") =>
  `color-mix(in srgb, var(${cssVar}) ${percent}%, ${mixWith})`;

const gradient = (start: string, end: string) =>
  `linear-gradient(135deg, ${start}, ${end})`;

const intakeSources: Array<{
  label: string;
  detail: string;
  icon: LucideIcon;
}> = [
  {
    label: "Admins & Operators",
    detail: "ad-hoc privilegierter Zugriff ohne zentrale Steuerung",
    icon: UserRoundCog,
  },
  {
    label: "Applikationen & Jobs",
    detail: "eingebettete oder skriptbasierte Credentials ohne Rotation",
    icon: KeyRound,
  },
  {
    label: "Zielsysteme",
    detail: "statische Credential-Abhaengigkeiten ohne Lifecycle",
    icon: Server,
  },
];

const vaultCapabilities = [
  "Secrets liegen verschluesselt im Vault — nicht auf Endpunkten oder in Skripten.",
  "Jede Ausgabe ist an Policy, Zeitfenster und Session-Kontext gebunden.",
  "Credential-Lifecycle wird zentral gesteuert statt dezentral verteilt.",
];

const controlImpacts = [
  "Keine statischen Secrets mehr in Systemen oder Skripten",
  "Zugriff wird policy-gebunden und zeitlich begrenzt",
  "Credential-Lifecycle wird zentral gesteuert und rotiert",
  "Nutzung ist vollstaendig auditierbar und nachweisbar",
];

const governedOutcomes: Array<{
  eyebrow: string;
  title: string;
  detail: string;
  icon: LucideIcon;
  tone: "primary" | "accent";
}> = [
  {
    eyebrow: "2. Kontrollierte Ausgabe",
    title: "Zugriff ist policy-basiert, kontextabhaengig und zeitlich begrenzt",
    detail:
      "Nur autorisierte Nutzer und Sessions erhalten Credentials — gebunden an Freigabe und Zeitfenster.",
    icon: ShieldCheck,
    tone: "primary",
  },
  {
    eyebrow: "3. Rotation",
    title: "Credentials werden rotierend erneuert — Missbrauchsfenster schrumpfen",
    detail:
      "Automatische Rotation nach Nutzung oder Zeitplan verhindert Wiederverwendung kompromittierter Secrets.",
    icon: RefreshCw,
    tone: "accent",
  },
  {
    eyebrow: "4. Audit Trail",
    title: "Jede Nutzung ist vollstaendig protokolliert und revisionssicher nachweisbar",
    detail:
      "PAM verknuepft Secret-Nutzung mit Session, Kontext und Nachweis in einer belastbaren Spur.",
    icon: FileSearch,
    tone: "primary",
  },
];

const TitleSlot: React.FC = () => (
  <div
    className="flex h-full w-full items-start justify-between gap-4"
    style={{ fontFamily: "var(--slide-font-body)" }}
  >
    <div className="min-w-0 flex-1">
      <div
        className="text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "var(--slide-primary)" }}
      >
        CyberArk Vaulting
      </div>
      <div
        className="mt-1 text-[26px] font-semibold leading-[1.04]"
        style={{
          color: "var(--slide-text)",
          fontFamily: "var(--slide-font-heading)",
        }}
      >
        Zentrales Vaulting eliminiert statische Secrets und macht privilegierte Nutzung kontrollierbar.
      </div>
      <div
        className="mt-1.5 max-w-[84%] text-[11px] leading-snug"
        style={{ color: "var(--slide-text-muted)" }}
      >
        Secrets werden nicht mehr verteilt, sondern ueber Policies gesteuert, zeitlich begrenzt
        genutzt, rotiert und revisionssicher nachvollzogen.
      </div>
    </div>

    <div className="flex flex-none items-start pt-0.5">
      <div
        className="rounded-full px-3 py-1 text-[10px] font-medium"
        style={{
          background: gradient(
            tint("--slide-primary", 10, "var(--slide-bg)"),
            tint("--slide-accent", 8, "var(--slide-bg)")
          ),
          border: `1px solid ${tint("--slide-primary", 18)}`,
          color: "var(--slide-primary)",
        }}
      >
        Zentraler Vault statt statischer Secret-Verteilung
      </div>
    </div>
  </div>
);

const SourceNode: React.FC<(typeof intakeSources)[number]> = ({ label, detail, icon: Icon }) => (
  <div
    className="rounded-2xl border px-3 py-2.5"
    style={{
      backgroundColor: tint("--slide-secondary", 36, "var(--slide-bg)"),
      borderColor: tint("--slide-text-muted", 18),
    }}
  >
    <div className="flex items-start gap-2.5">
      <div
        className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-xl"
        style={{
          backgroundColor: tint("--slide-primary", 10, "var(--slide-bg)"),
          color: "var(--slide-primary)",
        }}
      >
        <Icon size={14} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[11px] font-semibold leading-tight"
          style={{
            color: "var(--slide-text)",
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          {label}
        </div>
        <div className="mt-1 text-[9px] leading-snug" style={{ color: "var(--slide-text-muted)" }}>
          {detail}
        </div>
      </div>
    </div>
  </div>
);

const VaultCore: React.FC = () => (
  <div
    className="relative overflow-hidden rounded-[30px] border px-[5%] py-[5.5%]"
    style={{
      background: gradient(
        tint("--slide-primary", 10, "var(--slide-bg)"),
        tint("--slide-accent", 16, "var(--slide-bg)")
      ),
      borderColor: tint("--slide-accent", 22),
      boxShadow: `0 12px 28px ${tint("--slide-accent", 10)}`,
    }}
  >
    <div
      className="absolute inset-y-[8%] left-[8%] w-[1.3%] rounded-full"
      style={{ backgroundColor: tint("--slide-accent", 28, "var(--slide-bg)") }}
    />

    <div className="relative pl-[7%]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--slide-accent)" }}
          >
            1. Zentral speichern und kontrollieren
          </div>
          <div
            className="mt-1 text-[21px] font-semibold leading-tight"
            style={{
              color: "var(--slide-accent)",
              fontFamily: "var(--slide-font-heading)",
            }}
          >
            Der Vault wird zum zentralen Kontrollpunkt fuer Speicherung, Zugriff und Nachweis.
          </div>
        </div>

        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl"
          style={{
            backgroundColor: tint("--slide-accent", 14, "var(--slide-bg)"),
            color: "var(--slide-accent)",
          }}
        >
          <Database size={18} />
        </div>
      </div>

      <div
        className="mt-3 rounded-2xl border px-3 py-2.5 text-[10px] leading-snug"
        style={{
          backgroundColor: tint("--slide-bg", 82, "var(--slide-secondary)"),
          borderColor: tint("--slide-accent", 16),
          color: "var(--slide-text)",
        }}
      >
        Vaulting ueberfuehrt privilegierte Credentials aus statischer Verteilung in einen zentral
        gesteuerten Lifecycle. Kein Zugriff ohne Policy, Kontext und Freigabe.
      </div>

      <div className="mt-3 grid gap-2">
        {vaultCapabilities.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2 rounded-2xl border px-3 py-2"
            style={{
              backgroundColor: tint("--slide-bg", 88, "var(--slide-secondary)"),
              borderColor: tint("--slide-primary", 14),
            }}
          >
            <div
              className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full"
              style={{
                backgroundColor: tint("--slide-primary", 14, "var(--slide-bg)"),
                color: "var(--slide-primary)",
              }}
            >
              <BadgeCheck size={12} />
            </div>
            <div className="text-[10px] leading-snug" style={{ color: "var(--slide-text)" }}>
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ConnectorRail: React.FC<{ direction: "in" | "out" }> = ({ direction }) => (
  <div className="flex h-full items-center justify-center">
    <div className="flex w-full items-center gap-0">
      <div
        className="h-px flex-1"
        style={{ backgroundColor: tint("--slide-primary", 30) }}
      />
      <div
        className="flex h-8 w-8 flex-none items-center justify-center rounded-full"
        style={{
          backgroundColor: tint("--slide-primary", 12, "var(--slide-bg)"),
          color: "var(--slide-primary)",
          border: `1.5px solid ${tint("--slide-primary", 30)}`,
        }}
      >
        <ArrowRight size={14} className={direction === "in" ? "" : ""} />
      </div>
      <div
        className="h-px flex-1"
        style={{ backgroundColor: tint("--slide-primary", 30) }}
      />
    </div>
  </div>
);

const OutcomeCard: React.FC<(typeof governedOutcomes)[number]> = ({
  eyebrow,
  title,
  detail,
  icon: Icon,
  tone,
}) => {
  const toneVar = tone === "accent" ? "--slide-accent" : "--slide-primary";

  return (
    <div
      className="rounded-[24px] border px-3.5 py-3"
      style={{
        background: gradient(
          tint(toneVar, 8, "var(--slide-bg)"),
          tint("--slide-secondary", 30, "var(--slide-bg)")
        ),
        borderColor: tint(toneVar, 18),
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-8 w-8 flex-none items-center justify-center rounded-2xl"
          style={{
            backgroundColor: tint(toneVar, 14, "var(--slide-bg)"),
            color: `var(${toneVar})`,
          }}
        >
          <Icon size={14} />
        </div>
        <div className="min-w-0">
          <div
            className="text-[9px] uppercase tracking-[0.16em]"
            style={{ color: `var(${toneVar})` }}
          >
            {eyebrow}
          </div>
          <div
            className="mt-1 text-[13px] font-semibold leading-tight"
            style={{
              color: "var(--slide-text)",
              fontFamily: "var(--slide-font-heading)",
            }}
          >
            {title}
          </div>
          <div className="mt-1.5 text-[9px] leading-snug" style={{ color: "var(--slide-text-muted)" }}>
            {detail}
          </div>
        </div>
      </div>
    </div>
  );
};

const BodySlot: React.FC = () => (
  <div className="grid h-full grid-cols-[22%_4%_38%_4%_32%] gap-y-[3%]">
    <div className="col-span-5 flex items-center gap-3 rounded-2xl px-3 py-2"
      style={{
        backgroundColor: tint("--slide-secondary", 34, "var(--slide-bg)"),
        border: `1px solid ${tint("--slide-text-muted", 14)}`,
      }}
    >
      <div
        className="rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]"
        style={{
          backgroundColor: tint("--slide-accent", 12, "var(--slide-bg)"),
          color: "var(--slide-accent)",
        }}
      >
        Governed Secret Lifecycle
      </div>
      <div className="text-[10px] leading-snug" style={{ color: "var(--slide-text)" }}>
        Secrets werden zentral gespeichert, kontrolliert ausgegeben, kontinuierlich rotiert
        und vollstaendig nachvollziehbar gemacht.
      </div>
    </div>

    <div className="row-span-2 mt-[2%] grid content-start gap-[3%]">
      {intakeSources.map((item) => (
        <SourceNode key={item.label} {...item} />
      ))}
    </div>

    <div className="row-span-2 mt-[8%]">
      <ConnectorRail direction="in" />
    </div>

    <div className="row-span-2">
      <VaultCore />
    </div>

    <div className="row-span-2 mt-[8%]">
      <ConnectorRail direction="out" />
    </div>

    <div className="row-span-2 grid content-start gap-[3%]">
      {governedOutcomes.map((item) => (
        <OutcomeCard key={item.eyebrow} {...item} />
      ))}
    </div>

    {/* Kontrollwirkung – bottom strip */}
    <div
      className="col-span-5 flex items-center gap-4 rounded-2xl px-3 py-2"
      style={{
        backgroundColor: tint("--slide-accent", 6, "var(--slide-bg)"),
        border: `1px solid ${tint("--slide-accent", 16)}`,
      }}
    >
      <div
        className="flex-none rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]"
        style={{
          backgroundColor: tint("--slide-accent", 14, "var(--slide-bg)"),
          color: "var(--slide-accent)",
        }}
      >
        Kontrollwirkung
      </div>
      <div className="flex flex-1 items-center gap-3">
        {controlImpacts.map((item) => (
          <div key={item} className="flex items-center gap-1.5">
            <CheckCircle2
              size={10}
              style={{ color: "var(--slide-accent)", flexShrink: 0 }}
            />
            <span
              className="text-[9px] leading-snug"
              style={{ color: "var(--slide-text)" }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PamVaultingControlFlowSlide: CodeSlide = {
  id: "pam-vaulting-control-flow",
  name: "CyberArk Vaulting - zentraler Kontrollfluss",
  description:
    "C-Level-Folie: Zentrales Vaulting als Kontrollpunkt fuer Secret-Lifecycle mit Policy-Enforcement, Rotation und Audit Trail.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Action Title mit kurzer Einordnung und einem kompakten Meta-Badge.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description:
        "Governed-Flow-Komposition mit linker Bedarfsseite, zentralem Vault und rechter Kontrollwirkung.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default PamVaultingControlFlowSlide;