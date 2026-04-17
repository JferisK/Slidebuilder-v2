import * as React from "react";
import {
  ShieldCheck,
  FileText,
  Lock,
  UserCog,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CodeSlide } from "../types";

/**
 * DORA × Privileged Access Management × CISO.
 *
 * Provides content for two placeholders from the host PowerPoint layout:
 *   - `0` (title) → icon + title + subtitle + meta badges
 *   - `1` (body)  → 3-column grid (DORA-Vorgaben, PAM-Kontrollen,
 *                   CISO-Implikationen) + Meldefristen footer row
 *
 * All colors/fonts are pulled from the active master via `--slide-*`
 * CSS variables, so the same slide adapts to any PPTX theme.
 */

const SURFACE_BG =
  "color-mix(in srgb, var(--slide-primary) 6%, var(--slide-bg))";
const SURFACE_BORDER =
  "color-mix(in srgb, var(--slide-primary) 18%, transparent)";
const ACCENT_BORDER =
  "color-mix(in srgb, var(--slide-accent) 35%, transparent)";

const Column: React.FC<{
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}> = ({ icon, eyebrow, title, children }) => (
  <Card
    className="flex h-full min-h-0 flex-col"
    style={
      {
        "--card-bg": SURFACE_BG,
        "--card-border": SURFACE_BORDER,
        "--card-fg": "var(--slide-text)",
      } as React.CSSProperties
    }
  >
    <CardHeader className="p-3 pb-2">
      <div
        className="flex items-center gap-2"
        style={{ color: "var(--slide-primary)" }}
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-md"
          style={{
            background:
              "color-mix(in srgb, var(--slide-primary) 14%, transparent)",
          }}
        >
          {icon}
        </span>
        <div className="flex flex-col leading-tight">
          <span
            className="text-[9px] uppercase tracking-[0.12em]"
            style={{ color: "var(--slide-text-muted)" }}
          >
            {eyebrow}
          </span>
          <CardTitle
            className="text-[14px]"
            style={{
              color: "var(--slide-primary)",
              fontFamily: "var(--slide-font-heading)",
            }}
          >
            {title}
          </CardTitle>
        </div>
      </div>
    </CardHeader>
    <CardContent
      className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden p-3 pt-0 text-[11px] leading-snug"
      style={{
        color: "var(--slide-text)",
        fontFamily: "var(--slide-font-body)",
      }}
    >
      {children}
    </CardContent>
  </Card>
);

const Row: React.FC<{ label?: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-0.5">
    {label && (
      <Badge variant="secondary" className="self-start text-[9px]">
        {label}
      </Badge>
    )}
    <div>{children}</div>
  </div>
);

// ─── Slot 0: Title ─────────────────────────────────────────────
const TitleSlot: React.FC = () => (
  <div
    className="flex h-full w-full items-center justify-between gap-4"
    style={{ fontFamily: "var(--slide-font-body)" }}
  >
    <div className="flex min-w-0 items-center gap-3">
      <span
        className="flex h-11 w-11 flex-none items-center justify-center rounded-xl"
        style={{
          background: "var(--slide-primary)",
          color: "var(--slide-bg)",
        }}
      >
        <ShieldCheck size={22} />
      </span>
      <div className="flex min-w-0 flex-col">
        <div
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "var(--slide-text-muted)" }}
        >
          EU-Verordnung 2022/2554 · DORA
        </div>
        <div
          className="truncate text-[26px] font-semibold leading-[1.1]"
          style={{
            color: "var(--slide-primary)",
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          DORA &amp; Privileged Access Management
        </div>
        <div
          className="mt-0.5 truncate text-[12px] leading-snug"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Vorgaben für privilegierten Zugriff &amp; CISO-Implikationen
        </div>
      </div>
    </div>
    <div className="flex flex-none flex-col items-end gap-1">
      <Badge variant="default">
        <Clock size={10} /> Anwendbar seit 17.01.2025
      </Badge>
      <Badge variant="outline">Finanzsektor · ICT-Risk</Badge>
    </div>
  </div>
);

// ─── Slot 1: Body ──────────────────────────────────────────────
const BodySlot: React.FC = () => (
  <div
    className="flex h-full w-full flex-col gap-2"
    style={{ fontFamily: "var(--slide-font-body)" }}
  >
    <div
      className="grid min-h-0 flex-1 grid-cols-3 gap-2"
      style={{ minHeight: 0 }}
    >
      <Column
        icon={<FileText size={14} />}
        eyebrow="Regulatorisch"
        title="DORA-Vorgaben"
      >
        <Row label="Art. 5">
          ICT-Governance — Verantwortung des Leitungsorgans, dokumentierte
          Strategie.
        </Row>
        <Row label="Art. 9 (3–4)">
          Identitäts- &amp; Zugriffsmanagement; starke Authentifizierung
          für kritische Funktionen.
        </Row>
        <Row label="Art. 28">
          Third-Party-ICT-Risk — privilegierte Dienstleisterzugriffe im
          Register &amp; Vertrag.
        </Row>
        <Row label="RTS / Annex II">
          Least-Privilege, Segregation of Duties, regelmäßige
          Rezertifizierung.
        </Row>
      </Column>
      <Column
        icon={<Lock size={14} />}
        eyebrow="Technische Umsetzung"
        title="PAM-Kontrollen"
      >
        <Row label="Just-in-Time">
          Temporäre Privilegien on-demand statt permanenter Admin-Rechte.
        </Row>
        <Row label="MFA · Phishing-resistant">
          Zwingend für alle privilegierten &amp; Service-Accounts.
        </Row>
        <Row label="Session-Recording">
          Aufzeichnung &amp; Monitoring aller Admin-Sessions auf
          kritischen Systemen.
        </Row>
        <Row label="Vaulting · Rotation">
          Credentials im Vault, automatische Rotation, keine
          Shared-Accounts.
        </Row>
        <Row label="Segregation">
          Getrennte Tier-0 / Tier-1 Accounts — Admin ≠ Office-User.
        </Row>
      </Column>
      <Column
        icon={<UserCog size={14} />}
        eyebrow="Für den CISO"
        title="Implikationen"
      >
        <Row label="Board-Reporting">
          Jährlicher ICT-Risk-Report inkl. privilegierter Zugänge,
          Sign-off Leitungsorgan.
        </Row>
        <Row label="Incident-Response">
          Klassifikation + Meldewege an die Aufsichtsbehörde.
        </Row>
        <Row label="TLPT alle 3 Jahre">
          Threat-Led-Pen-Testing für bedeutende Institute — PAM im
          Pflicht-Scope.
        </Row>
        <Row label="3rd-Party-Register">
          Register aller kritischen ICT-Provider + Exit-Strategie.
        </Row>
        <Row label="Policies &amp; Awareness">
          Policies, Beschaffungs-Templates und Schulungen ausrichten.
        </Row>
      </Column>
    </div>

    <div
      className="flex flex-none items-center justify-between gap-3 rounded-lg px-3 py-2"
      style={{
        background:
          "color-mix(in srgb, var(--slide-accent) 10%, transparent)",
        border: `1px solid ${ACCENT_BORDER}`,
        color: "var(--slide-text)",
      }}
    >
      <div className="flex items-center gap-2 text-[11px]">
        <AlertTriangle
          size={13}
          style={{ color: "var(--slide-accent)" }}
        />
        <span>
          <strong
            style={{
              color: "var(--slide-accent)",
              fontFamily: "var(--slide-font-heading)",
            }}
          >
            Meldefristen schwerer Vorfälle:
          </strong>{" "}
          initial ≤ 4 h · intermediate ≤ 72 h · final ≤ 1 Monat
        </span>
      </div>
      <div
        className="text-[10px]"
        style={{ color: "var(--slide-text-muted)" }}
      >
        VO (EU) 2022/2554 · RTS ICT-Risk
      </div>
    </div>
  </div>
);

const DoraPamCisoSlide: CodeSlide = {
  id: "dora-pam-ciso",
  name: "DORA & PAM — CISO-Implikationen",
  description:
    "Was die EU-Verordnung 2022/2554 für privilegierten Zugriff vorschreibt.",
  slots: {
    "0": TitleSlot,
    "1": BodySlot,
  },
};

export default DoraPamCisoSlide;
