import * as React from "react";
import {
  AudioLines,
  Fingerprint,
  Radar,
  ScanFace,
  ShieldCheck,
  ShieldEllipsis,
  Sparkles,
  Telescope,
} from "lucide-react";
import {
  EvidenceStat,
  FlowConnector,
  FooterBand,
  HeroBand,
  LayerStack,
  LegendStrip,
  MetaBadge,
  PALETTE,
  PaletteRibbon,
  RiskSurface,
  SignalPill,
  mix,
} from "./_shared";
import type { CodeSlide } from "../types";

const TitleSlot: React.FC = () => (
  <div
    className="flex h-full w-full items-center justify-between gap-4"
    style={{ fontFamily: PALETTE.body }}
  >
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="flex h-12 w-12 flex-none items-center justify-center rounded-[18px]"
        style={{
          background: `linear-gradient(145deg, ${PALETTE.risk}, ${PALETTE.primary})`,
          color: PALETTE.bg,
        }}
      >
        <Sparkles size={22} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: PALETTE.muted }}
        >
          Future of Identity Defense
        </div>
        <div
          className="truncate text-[26px] font-semibold leading-[1.04]"
          style={{ fontFamily: PALETTE.heading, color: PALETTE.primary }}
        >
          Warum IAM durch KI und Deepfakes wichtiger wird
        </div>
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone="risk">Deepfake Identity</MetaBadge>
      <MetaBadge tone="signal">ITDR</MetaBadge>
      <MetaBadge tone="ai">IAM Hygiene</MetaBadge>
      <MetaBadge tone="outline">JIT statt master keys</MetaBadge>
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div
    className="grid h-full w-full grid-cols-[1.08fr_0.92fr] gap-4"
    style={{ fontFamily: PALETTE.body }}
  >
    <div className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-4">
      <div className="grid grid-cols-[1.15fr_0.85fr] gap-3">
        <HeroBand
          eyebrow="Action Title"
          tone="deep"
          title={
            <>
              KI macht Identität
              <br />
              zur neuen Angriffsfläche.
            </>
          }
          subtitle="Nicht nur Inhalte werden synthetisch. Auch Vertrauen, Verifikation und Freigaben werden angreifbar."
          kicker={
            <PaletteRibbon
              items={[
                { label: "billiger", tone: "risk" },
                { label: "schneller", tone: "signal" },
                { label: "skalierbarer", tone: "ai" },
              ]}
            />
          }
        />
        <div className="grid grid-rows-3 gap-3">
          <EvidenceStat
            value="69%"
            label="Deepfake gegen Face Biometrics oder automatisierte Identitätsprüfung"
            tone="risk"
          />
          <EvidenceStat
            value="56%"
            label="Deepfake in Audio-Calls und Social Engineering"
            tone="signal"
          />
          <EvidenceStat
            value="63%"
            label="Deepfake in Video-Calls und Freigabesituationen"
            tone="ai"
          />
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-[30px] p-5"
        style={{
          background: `linear-gradient(170deg, ${mix(PALETTE.deep, PALETTE.bg, 92)}, ${mix(
            PALETTE.risk,
            PALETTE.deep,
            18,
          )})`,
          border: `1px solid ${mix(PALETTE.primary, "transparent", 28)}`,
        }}
      >
        <div
          className="absolute left-[-5%] top-[-10%] h-44 w-44 rounded-full"
          style={{
            background: `radial-gradient(circle, ${mix(PALETTE.signal, "transparent", 20)}, transparent 68%)`,
          }}
        />
        <div
          className="absolute right-[-8%] bottom-[-12%] h-48 w-48 rounded-full"
          style={{
            background: `radial-gradient(circle, ${mix(PALETTE.risk, "transparent", 18)}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 grid h-full grid-cols-[1.25fr_0.75fr] gap-4">
          <div className="flex min-h-0 flex-col">
            <div
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              Identity Attack Surface
            </div>
            <div
              className="mt-1 text-[22px] font-semibold leading-[1.02]"
              style={{ color: PALETTE.bg, fontFamily: PALETTE.heading }}
            >
              Deepfakes treffen Menschen, Biometrie und Workflows gleichzeitig.
            </div>

            <div className="relative mt-4 flex-1">
              <RiskSurface
                center={
                  <div>
                    <div
                      className="text-[10px] uppercase tracking-[0.16em]"
                      style={{ color: "rgba(255,255,255,0.68)" }}
                    >
                      Synthetic trust
                    </div>
                    <div
                      className="mt-1 text-[20px] font-semibold leading-tight"
                      style={{ fontFamily: PALETTE.heading }}
                    >
                      identity
                      <br />
                      impersonation
                    </div>
                  </div>
                }
                nodes={[
                  {
                    key: "voice",
                    label: "Voice\nbiometrics",
                    x: "18%",
                    y: "26%",
                    size: 102,
                    tone: "signal",
                  },
                  {
                    key: "face",
                    label: "Face\nbiometrics",
                    x: "82%",
                    y: "24%",
                    size: 102,
                    tone: "risk",
                  },
                  {
                    key: "social",
                    label: "Social\nengineering",
                    x: "18%",
                    y: "76%",
                    size: 108,
                    tone: "ai",
                  },
                  {
                    key: "flows",
                    label: "Approvals\n& workflows",
                    x: "82%",
                    y: "76%",
                    size: 108,
                    tone: "trust",
                  },
                ]}
              />
              <div className="absolute left-[25%] top-[39%]">
                <FlowConnector tone="signal" length={88} />
              </div>
              <div className="absolute right-[25%] top-[39%]">
                <FlowConnector tone="risk" length={88} />
              </div>
              <div className="absolute left-[25%] bottom-[36%]">
                <FlowConnector tone="ai" length={88} />
              </div>
              <div className="absolute right-[25%] bottom-[36%]">
                <FlowConnector tone="trust" length={88} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div
              className="rounded-[24px] p-4"
              style={{
                background: mix(PALETTE.bg, "transparent", 10),
                border: `1px solid ${mix(PALETTE.bg, "transparent", 18)}`,
              }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.16em]"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                Was hier neu ist
              </div>
              <div
                className="mt-1 text-[14px] font-semibold leading-tight"
                style={{ color: PALETTE.bg, fontFamily: PALETTE.heading }}
              >
                Nicht nur Login wird angegriffen.
              </div>
              <div
                className="mt-1 text-[10px] leading-snug"
                style={{ color: "rgba(255,255,255,0.78)" }}
              >
                Angegriffen wird genau der Moment, in dem ein System Vertrauen
                herstellt.
              </div>
            </div>

            <div
              className="rounded-[24px] p-4"
              style={{
                background: mix(PALETTE.bg, "transparent", 8),
                border: `1px solid ${mix(PALETTE.bg, "transparent", 18)}`,
              }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.16em]"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                Attack surface view
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { label: "trust", tone: "trust" as const },
                  { label: "signals", tone: "signal" as const },
                  { label: "privilege", tone: "primary" as const },
                  { label: "response", tone: "risk" as const },
                ].map((item, idx) => (
                  <div
                    key={item.label}
                    className="rounded-xl px-2 py-2 text-center text-[10px]"
                    style={{
                      background:
                        idx % 2 === 0
                          ? mix(
                              item.tone === "trust"
                                ? PALETTE.trust
                                : item.tone === "signal"
                                  ? PALETTE.signal
                                  : item.tone === "risk"
                                    ? PALETTE.risk
                                    : PALETTE.primary,
                              PALETTE.bg,
                              18,
                            )
                          : mix(PALETTE.deep, PALETTE.bg, 88),
                      color:
                        item.tone === "trust"
                          ? PALETTE.trust
                          : item.tone === "signal"
                            ? PALETTE.signal
                            : item.tone === "risk"
                              ? PALETTE.risk
                              : PALETTE.primary,
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <LegendStrip
        items={[
          { label: "voice/telemetry", tone: "signal" },
          { label: "synthetic/manipulated", tone: "risk" },
          { label: "human process", tone: "trust" },
          { label: "AI-enabled attack", tone: "ai" },
        ]}
      />
    </div>

    <div className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-4">
      <HeroBand
        eyebrow="IAM Defense System"
        title={
          <>
            Nicht mehr nur
            <br />
            Erkennung.
            <span style={{ color: PALETTE.trust }}> Kontrolle in Schichten.</span>
          </>
        }
        subtitle="Die Antwort ist nicht eine Deepfake-Detection-Box, sondern eine kombinierte Identity-Defense-Architektur."
        tone="trust"
      />

      <LayerStack
        layers={[
          {
            key: "verify",
            title: "Verify",
            text: "Phishing-resistente MFA und starke Verifikation für riskante Aktionen.",
            tone: "primary",
            icon: <ShieldCheck size={18} />,
          },
          {
            key: "exposure",
            title: "Reduce Exposure",
            text: "JIT und JEA statt stehender Privilegien oder digitaler master keys.",
            tone: "trust",
            icon: <ShieldEllipsis size={18} />,
          },
          {
            key: "surface",
            title: "See the Surface",
            text: "IAM Hygiene, Visibility und Observability zeigen, wo die echte Angriffsfläche wächst.",
            tone: "ai",
            icon: <Telescope size={18} />,
          },
          {
            key: "respond",
            title: "Detect & Respond",
            text: "ITDR ergänzt IAM um Identitätssignale, Detection und Reaktion bei Angriffen.",
            tone: "signal",
            icon: <Radar size={18} />,
          },
        ]}
      />

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <FooterBand
          title="Merksatz"
          tone="risk"
          text="KI verschiebt IAM von Zugangskontrolle zu aktiver Identitätsverteidigung."
        />
        <div className="flex items-center">
          <SignalPill label="security discipline" tone="deep" />
        </div>
      </div>
    </div>
  </div>
);

const IamAiDeepfakesSlide: CodeSlide = {
  id: "diw-iam-ai-deepfakes",
  name: "23 · IAM durch KI und Deepfakes",
  description:
    "Systemfolie zu Deepfake Identity Impersonation, IAM Attack Surface und der mehrschichtigen IAM-Antwort.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Action-Title mit Meta-Badges.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description:
        "Hero-Zonen für Attack Surface, Evidenz und gestufte Defense-Architektur.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default IamAiDeepfakesSlide;
