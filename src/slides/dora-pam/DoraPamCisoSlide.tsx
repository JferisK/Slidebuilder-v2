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

/**
 * DORA × Privileged Access Management × CISO.
 *
 * A self-contained React slide (1:1 — one file, one slide). Structure and
 * content live here; colors and fonts come from the active master via the
 * `--slide-*` CSS variables set by the canvas wrapper.
 */

const SURFACE =
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
    className="flex h-full flex-col"
    style={
      {
        "--card-bg": SURFACE,
        "--card-border": SURFACE_BORDER,
        "--card-fg": "var(--slide-text)",
      } as React.CSSProperties
    }
  >
    <CardHeader className="pb-3">
      <div
        className="flex items-center gap-2"
        style={{ color: "var(--slide-primary)" }}
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background:
              "color-mix(in srgb, var(--slide-primary) 14%, transparent)",
          }}
        >
          {icon}
        </span>
        <div className="flex flex-col leading-tight">
          <span
            className="text-[10px] uppercase tracking-[0.14em]"
            style={{ color: "var(--slide-text-muted)" }}
          >
            {eyebrow}
          </span>
          <CardTitle
            className="text-[17px]"
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
      className="flex flex-1 flex-col gap-2.5 pb-5 text-[13px] leading-snug"
      style={{
        color: "var(--slide-text)",
        fontFamily: "var(--slide-font-body)",
      }}
    >
      {children}
    </CardContent>
  </Card>
);

const Row: React.FC<{
  label?: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <Badge variant="secondary" className="self-start text-[10px]">
        {label}
      </Badge>
    )}
    <div>{children}</div>
  </div>
);

const DoraPamCisoSlide: React.FC = () => {
  return (
    <div
      className="flex h-full w-full flex-col"
      style={{
        padding: "36px 48px 28px",
        background: "var(--slide-bg)",
        fontFamily: "var(--slide-font-body)",
        color: "var(--slide-text)",
      }}
    >
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 flex-none items-center justify-center rounded-xl"
            style={{
              background: "var(--slide-primary)",
              color: "var(--slide-bg)",
            }}
          >
            <ShieldCheck size={22} />
          </span>
          <div className="flex flex-col">
            <div
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{ color: "var(--slide-text-muted)" }}
            >
              EU-Verordnung 2022/2554 · DORA
            </div>
            <h1
              className="mt-0.5 text-[30px] font-semibold leading-[1.1]"
              style={{
                color: "var(--slide-primary)",
                fontFamily: "var(--slide-font-heading)",
              }}
            >
              DORA &amp; Privileged Access Management
            </h1>
            <p
              className="mt-1 text-[14px] leading-snug"
              style={{ color: "var(--slide-text-muted)" }}
            >
              Was die Verordnung für privilegierten Zugriff vorschreibt — und
              was CISOs jetzt umsetzen müssen.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 pt-1">
          <Badge variant="default">
            <Clock size={11} /> Anwendbar seit 17.01.2025
          </Badge>
          <Badge variant="outline">Finanzsektor · ICT-Risk</Badge>
        </div>
      </header>

      {/* Accent divider */}
      <div
        className="mt-5 h-px w-full"
        style={{ background: ACCENT_BORDER }}
      />

      {/* ─── Body: 3 columns ───────────────────────────────────── */}
      <main
        className="mt-5 grid flex-1 grid-cols-3 gap-4"
        style={{ minHeight: 0 }}
      >
        {/* Column 1: DORA requirements */}
        <Column
          icon={<FileText size={16} />}
          eyebrow="Regulatorisch"
          title="DORA-Vorgaben"
        >
          <Row label="Art. 5">
            ICT-Governance — Verantwortung des Leitungsorgans, dokumentierte
            Strategie für digitalen Betrieb.
          </Row>
          <Row label="Art. 9 (3–4)">
            Identitäts-, Zugriffs- &amp; Rechtemanagement; starke
            Authentifizierung für kritische Funktionen.
          </Row>
          <Row label="Art. 28">
            Third-Party-ICT-Risk — privilegierte Dienstleisterzugriffe im
            Register &amp; Vertrag verankert.
          </Row>
          <Row label="RTS / Annex II">
            Least-Privilege, Segregation of Duties, regelmäßige
            Rezertifizierung.
          </Row>
        </Column>

        {/* Column 2: PAM controls */}
        <Column
          icon={<Lock size={16} />}
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
            Aufzeichnung &amp; Echtzeit-Monitoring aller Admin-Sessions auf
            kritischen Systemen.
          </Row>
          <Row label="Vaulting · Rotation">
            Credentials im PAM-Vault, automatische Rotation, keine
            Shared-Accounts.
          </Row>
          <Row label="Segregation">
            Getrennte Tier-0 / Tier-1 Accounts — Admin ≠ Office-User.
          </Row>
        </Column>

        {/* Column 3: CISO implications */}
        <Column
          icon={<UserCog size={16} />}
          eyebrow="Für den CISO"
          title="Implikationen"
        >
          <Row label="Board-Reporting">
            Jährlicher ICT-Risk-Report inkl. privilegierter Zugänge,
            Sign-off durch das Leitungsorgan.
          </Row>
          <Row label="Incident-Response">
            Klassifikation + Meldewege an die zuständige Aufsichtsbehörde
            einrichten.
          </Row>
          <Row label="TLPT alle 3 Jahre">
            Threat-Led-Penetration-Testing für bedeutende Institute —
            PAM-Umgebung ist Pflicht-Scope.
          </Row>
          <Row label="3rd-Party-Register">
            Register aller kritischen ICT-Provider inkl. deren
            Admin-Zugriffe &amp; Exit-Strategie.
          </Row>
          <Row label="Awareness &amp; Policies">
            Policies, Beschaffungs-Templates und Schulungen DORA-konform
            ausrichten.
          </Row>
        </Column>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer
        className="mt-5 flex items-center justify-between gap-4 rounded-lg px-4 py-3"
        style={{
          background:
            "color-mix(in srgb, var(--slide-accent) 10%, transparent)",
          border: `1px solid ${ACCENT_BORDER}`,
          color: "var(--slide-text)",
        }}
      >
        <div className="flex items-center gap-2 text-[12px]">
          <AlertTriangle
            size={15}
            style={{ color: "var(--slide-accent)" }}
          />
          <span>
            <strong
              style={{
                color: "var(--slide-accent)",
                fontFamily: "var(--slide-font-heading)",
              }}
            >
              Meldefristen bei schwerwiegenden Vorfällen:
            </strong>{" "}
            initial ≤ 4 h · intermediate ≤ 72 h · final ≤ 1 Monat
          </span>
        </div>
        <div
          className="text-[11px]"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Quelle: VO (EU) 2022/2554 · RTS ICT-Risikomanagement
        </div>
      </footer>
    </div>
  );
};

export default DoraPamCisoSlide;
