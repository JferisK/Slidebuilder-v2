import * as React from "react";
import {
  ArrowRight,
  BarChart3,
  Blocks,
  Gauge,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CodeSlide } from "../types";

const tint = (cssVar: string, percent: number, mixWith = "transparent") =>
  `color-mix(in srgb, var(${cssVar}) ${percent}%, ${mixWith})`;

const gradient = (start: string, end: string) =>
  `linear-gradient(135deg, ${start}, ${end})`;

const SIGNAL = "var(--ppt-accent4, var(--slide-primary))";
const DEEP = "var(--ppt-accent3, var(--slide-accent))";

const controlChain: Array<{
  step: string;
  title: string;
  summary: string;
  tags: string[];
  icon: LucideIcon;
  accent: "--slide-primary" | "--slide-accent";
}> = [
  {
    step: "Define",
    title: "Define privileged access scope",
    summary:
      "legt fest, welche privilegierten Konten, Rollen und Policies kontrolliert werden muessen.",
    tags: ["Inventory", "Roles", "Policies"],
    icon: Blocks,
    accent: "--slide-primary",
  },
  {
    step: "Enforce",
    title: "Enforce access initiation",
    summary:
      "erzwingt Genehmigung, zeitliche Begrenzung und starke Authentisierung vor dem Zugriff.",
    tags: ["Approval", "JIT", "MFA"],
    icon: ShieldCheck,
    accent: "--slide-accent",
  },
  {
    step: "Secure",
    title: "Secure privileged execution",
    summary:
      "schuetzt Sessions und Secrets waehrend der Ausfuehrung statt erst im Nachgang.",
    tags: ["Vault", "Secrets", "Session Proxy"],
    icon: KeyRound,
    accent: "--slide-primary",
  },
  {
    step: "Evidence",
    title: "Evidence control effectiveness",
    summary:
      "macht Wirksamkeit, Ueberwachung und Governance als belastbare Evidenz steuerbar.",
    tags: ["Audit Trail", "Monitoring", "Review"],
    icon: BarChart3,
    accent: "--slide-accent",
  },
];

const assessmentLens = [
  {
    label: "Coverage",
    detail: "Welche Tool-Bausteine stuetzen welche Stufe der Kontrollkette?",
  },
  {
    label: "Enforcement",
    detail: "Wo wird Kontrolle technisch erzwungen und wo bleibt sie prozessual?",
  },
  {
    label: "Gaps",
    detail: "Wo entstehen Brueche, Ueberlappungen oder nicht adressierte Risiken?",
  },
  {
    label: "Maturity",
    detail: "Wie weit ist PAM von Feature-Abdeckung zu Governed Control Operations entwickelt?",
  },
];

const maturityLevels = [
  {
    level: "L1",
    label: "Feature-based",
    detail: "isolierte Funktionen ohne durchgaengige Kontrolllogik",
  },
  {
    level: "L2",
    label: "Integrated",
    detail: "verbundene Policy-, Zugriffs- und Execution-Kontrollen",
  },
  {
    level: "L3",
    label: "Governed",
    detail: "nachweisbare Wirksamkeit mit Review, Monitoring und Steuerung",
  },
];

const benchmarkNote =
  "CyberArk serves as capability reference only; no product recommendation or target architecture implication.";

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
        PAM Evaluation Framework
      </div>
      <div
        className="mt-1 text-[26px] font-semibold leading-[1.02]"
        style={{
          color: "var(--slide-text)",
          fontFamily: "var(--slide-font-heading)",
        }}
      >
        Vier Kontrolldimensionen ueberfuehren PAM-Features in eine pruefbare Kontrollkette
      </div>
      <div
        className="mt-1.5 max-w-[82%] text-[11px] leading-snug"
        style={{ color: "var(--slide-text-muted)" }}
      >
        Bestehende Tools werden gegen Scope, Enforcement, Secure Execution und Governance gemappt,
        damit Coverage-Gaps, Kontrollbrueche und Reifegrad sichtbar werden.
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
        Tool map -&gt; control evidence
      </div>
    </div>
  </div>
);

const ChainStep: React.FC<(typeof controlChain)[number] & { isLast: boolean }> = ({
  step,
  title,
  summary,
  tags,
  icon: Icon,
  accent,
  isLast,
}) => (
  <div className="flex min-h-0 gap-3">
    <div className="flex w-[82px] flex-none flex-col items-center pt-0.5">
      <div
        className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]"
        style={{
          backgroundColor: tint(accent, 12, "var(--slide-bg)"),
          color: `var(${accent})`,
          border: `1px solid ${tint(accent, 20)}`,
        }}
      >
        {step}
      </div>
      {!isLast ? (
        <div className="flex flex-1 items-center py-1.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{
              backgroundColor: tint("--slide-secondary", 55, "var(--slide-bg)"),
              color: "var(--slide-primary)",
              border: `1px solid ${tint("--slide-text-muted", 14)}`,
            }}
          >
            <ArrowRight size={14} className="rotate-90" />
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}
    </div>

    <div
      className="min-h-0 flex-1 rounded-[22px] border px-3.5 py-3"
      style={{
        background: gradient(
          tint("--slide-bg", 96, "var(--slide-secondary)"),
          tint("--slide-secondary", 34, "var(--slide-bg)")
        ),
        borderColor: tint(accent, 14),
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl"
          style={{
            backgroundColor: tint(accent, 12, "var(--slide-bg)"),
            color: `var(${accent})`,
          }}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="text-[15px] font-semibold leading-tight"
            style={{
              color: DEEP,
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
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <div
                key={tag}
                className="rounded-full px-2.5 py-1 text-[9px] font-medium leading-none"
                style={{
                  backgroundColor: "var(--slide-bg)",
                  color: "var(--slide-text)",
                  border: `1px solid ${tint(accent, 16)}`,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LensRow: React.FC<(typeof assessmentLens)[number]> = ({ label, detail }) => (
  <div
    className="rounded-2xl border px-3 py-2.5"
    style={{
      backgroundColor: "var(--slide-bg)",
      borderColor: tint("--slide-text-muted", 14),
    }}
  >
    <div
      className="text-[10px] font-semibold uppercase tracking-[0.14em]"
      style={{ color: "var(--slide-primary)" }}
    >
      {label}
    </div>
    <div
      className="mt-1 text-[10px] leading-snug"
      style={{ color: "var(--slide-text)" }}
    >
      {detail}
    </div>
  </div>
);

const MaturityPanel: React.FC = () => (
  <div
    className="rounded-[24px] border px-3 py-3"
    style={{
      background: gradient(
        tint("--slide-primary", 92, "var(--slide-bg)"),
        tint("--slide-secondary", 70, "var(--slide-bg)")
      ),
      borderColor: tint("--slide-primary", 18),
    }}
  >
    <div className="flex items-start justify-between gap-2">
      <div>
        <div
          className="text-[9px] uppercase tracking-[0.16em]"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Maturity Scale
        </div>
        <div
          className="mt-1 text-[15px] font-semibold leading-tight"
          style={{
            color: DEEP,
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          From isolated features to governed control operations
        </div>
      </div>
      <div
        className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl"
        style={{
          backgroundColor: tint("--slide-primary", 12, "var(--slide-bg)"),
          color: SIGNAL,
        }}
      >
        <Gauge size={18} />
      </div>
    </div>

    <div className="mt-3 flex flex-col gap-1.5">
      {maturityLevels.map((item, index) => (
        <div
          key={item.level}
          className="rounded-2xl border px-2.5 py-2"
          style={{
            backgroundColor:
              index === 2
                ? tint("--ppt-accent4", 12, "var(--slide-bg)")
                : tint("--slide-bg", 82, "var(--slide-secondary)"),
            borderColor:
              index === 2
                ? tint("--ppt-accent4", 22)
                : tint("--slide-text-muted", 12),
          }}
        >
          <div className="flex items-baseline gap-2">
            <div
              className="text-[11px] font-semibold"
              style={{ color: "var(--slide-primary)" }}
            >
              {item.level}
            </div>
            <div
              className="text-[11px] font-semibold"
              style={{
                color: DEEP,
                fontFamily: "var(--slide-font-heading)",
              }}
            >
              {item.label}
            </div>
          </div>
          <div
            className="mt-0.5 text-[9px] leading-snug"
            style={{ color: "var(--slide-text)" }}
          >
            {item.detail}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div
    className="grid h-full w-full grid-cols-[1.5fr_0.9fr] gap-3"
    style={{ fontFamily: "var(--slide-font-body)" }}
  >
    <div
      className="rounded-[28px] border px-4 py-3"
      style={{
        background: gradient(
          tint("--slide-bg", 98, "var(--slide-secondary)"),
          tint("--slide-secondary", 42, "var(--slide-bg)")
        ),
        borderColor: tint("--slide-primary", 16),
        boxShadow: `0 12px 28px ${tint("--slide-primary", 8)}`,
      }}
    >
      <div className="flex h-full min-h-0 flex-col gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              className="text-[9px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--slide-text-muted)" }}
            >
              Control Chain
            </div>
            <div
              className="mt-1 text-[18px] font-semibold leading-[1.05]"
              style={{
                color: DEEP,
                fontFamily: "var(--slide-font-heading)",
              }}
            >
              End-to-end control logic before vendor comparison
            </div>
          </div>
          <div
            className="rounded-full px-2.5 py-1 text-[9px] font-medium"
            style={{
              backgroundColor: tint("--slide-primary", 10, "var(--slide-bg)"),
              color: "var(--slide-primary)",
              border: `1px solid ${tint("--slide-primary", 16)}`,
            }}
          >
            Define -&gt; Enforce -&gt; Secure -&gt; Evidence
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-1.5">
          {controlChain.map((item, index) => (
            <div key={item.step} className="min-h-0 flex-1">
              <ChainStep {...item} isLast={index === controlChain.length - 1} />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-2.5">
      <div
        className="rounded-[24px] border px-3.5 py-3"
        style={{
          background: gradient(
            tint("--slide-bg", 98, "var(--slide-secondary)"),
            tint("--slide-secondary", 48, "var(--slide-bg)")
          ),
          borderColor: tint("--slide-text-muted", 14),
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div
              className="text-[9px] uppercase tracking-[0.16em]"
              style={{ color: "var(--slide-text-muted)" }}
            >
              Assessment Lens
            </div>
            <div
              className="mt-1 text-[15px] font-semibold leading-tight"
              style={{
                color: DEEP,
                fontFamily: "var(--slide-font-heading)",
              }}
            >
              Die gleiche Kette liefert die Bewertungslogik fuer Tools und Maturity.
            </div>
          </div>
          <div
            className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl"
            style={{
              backgroundColor: tint("--slide-primary", 12, "var(--slide-bg)"),
              color: SIGNAL,
            }}
          >
            <BarChart3 size={18} />
          </div>
        </div>

        <div className="mt-3 grid gap-1.5">
          {assessmentLens.map((item) => (
            <LensRow key={item.label} {...item} />
          ))}
        </div>
      </div>

      <MaturityPanel />

      <div
        className="rounded-2xl border px-3 py-2.5"
        style={{
          backgroundColor: tint("--slide-accent", 7, "var(--slide-bg)"),
          borderColor: tint("--slide-accent", 16),
        }}
      >
        <div
          className="text-[9px] uppercase tracking-[0.16em]"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Benchmark Note
        </div>
        <div
          className="mt-1 text-[9px] leading-snug"
          style={{ color: "var(--slide-text)" }}
        >
          {benchmarkNote}
        </div>
      </div>
    </div>
  </div>
);

const PamEvaluationArchitectureSlide: CodeSlide = {
  id: "pam-evaluation-architecture",
  name: "PAM Architektur fuer Tool- und Maturity-Bewertung",
  description:
    "Produktionsfolie fuer PAM-Workshops: vier Kontrolldimensionen als End-to-End-Kontrollkette mit Assessment Lens und kompaktem Maturity-Modell.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Action Title mit Executive-Zusammenfassung fuer die Bewertungslogik.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description:
        "Linke Control Chain und rechte Assessment Lens mit Maturity- und Benchmark-Hinweis.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default PamEvaluationArchitectureSlide;
