import * as React from "react";
import {
  Bot,
  Boxes,
  FileSearch,
  GitBranch,
  KeyRound,
  ScanSearch,
  UserRoundCog,
  Workflow,
  Wrench,
} from "lucide-react";
import {
  EvidenceStat,
  FlowConnector,
  FooterBand,
  GovernanceBoard,
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
          background: `linear-gradient(145deg, ${PALETTE.ai}, ${PALETTE.primary})`,
          color: PALETTE.bg,
        }}
      >
        <Bot size={22} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: PALETTE.muted }}
        >
          New Identity Operating Model
        </div>
        <div
          className="truncate text-[26px] font-semibold leading-[1.04]"
          style={{ fontFamily: PALETTE.heading, color: PALETTE.primary }}
        >
          AI Agents und nicht-menschliche Identitäten
        </div>
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone="ai">Agents</MetaBadge>
      <MetaBadge tone="signal">Tools + Data</MetaBadge>
      <MetaBadge tone="trust">Governance</MetaBadge>
      <MetaBadge tone="outline">machine identities</MetaBadge>
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div
    className="grid h-full w-full grid-cols-[1.02fr_0.98fr] gap-4"
    style={{ fontFamily: PALETTE.body }}
  >
    <div className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-4">
      <div className="grid grid-cols-[1.15fr_0.85fr] gap-3">
        <HeroBand
          eyebrow="Identity landscape"
          tone="ai"
          title={
            <>
              Die nächste Welle
              <br />
              von Identitäten handelt selbst.
            </>
          }
          subtitle="Services, Bots, Skripte, Workloads und Agents bilden eine neue Identitätsklasse mit eigener Governance."
          kicker={
            <PaletteRibbon
              items={[
                { label: "tools", tone: "signal" },
                { label: "data", tone: "trust" },
                { label: "actions", tone: "risk" },
                { label: "context", tone: "ai" },
              ]}
            />
          }
        />
        <div className="grid grid-rows-2 gap-3">
          <EvidenceStat
            value="AI"
            label="Your next customer or employee could be AI"
            tone="ai"
          />
          <EvidenceStat
            value="new"
            label="Agents werden als neue Identitätsklasse behandelt"
            tone="trust"
          />
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-[30px] p-5"
        style={{
          background: `linear-gradient(165deg, ${mix(PALETTE.primary, PALETTE.bg, 14)}, ${mix(
            PALETTE.secondary,
            PALETTE.bg,
            82,
          )})`,
          border: `1px solid ${mix(PALETTE.primary, "transparent", 22)}`,
        }}
      >
        <div
          className="absolute left-[-8%] top-[-8%] h-44 w-44 rounded-full"
          style={{
            background: `radial-gradient(circle, ${mix(PALETTE.ai, "transparent", 18)}, transparent 68%)`,
          }}
        />
        <div
          className="absolute right-[-10%] bottom-[-10%] h-52 w-52 rounded-full"
          style={{
            background: `radial-gradient(circle, ${mix(PALETTE.signal, "transparent", 16)}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 grid h-full grid-cols-[1.15fr_0.85fr] gap-4">
          <div className="flex min-h-0 flex-col">
            <div
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: PALETTE.muted }}
            >
              Identity universe
            </div>
            <div
              className="mt-1 text-[22px] font-semibold leading-[1.02]"
              style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
            >
              Agents verbinden Identität, Tools, Daten und Entscheidungen.
            </div>

            <div className="relative mt-4 flex-1">
              <RiskSurface
                center={
                  <div>
                    <div
                      className="text-[10px] uppercase tracking-[0.16em]"
                      style={{ color: "rgba(255,255,255,0.68)" }}
                    >
                      Agent identity
                    </div>
                    <div
                      className="mt-1 text-[20px] font-semibold leading-tight"
                      style={{ fontFamily: PALETTE.heading }}
                    >
                      AI
                      <br />
                      agent
                    </div>
                  </div>
                }
                nodes={[
                  {
                    key: "services",
                    label: "Services",
                    x: "16%",
                    y: "24%",
                    size: 92,
                    tone: "trust",
                  },
                  {
                    key: "bots",
                    label: "Bots",
                    x: "84%",
                    y: "22%",
                    size: 88,
                    tone: "ai",
                  },
                  {
                    key: "scripts",
                    label: "Skripte",
                    x: "15%",
                    y: "76%",
                    size: 88,
                    tone: "primary",
                  },
                  {
                    key: "tools",
                    label: "Tool\ncalls",
                    x: "84%",
                    y: "76%",
                    size: 94,
                    tone: "signal",
                  },
                  {
                    key: "data",
                    label: "Data\naccess",
                    x: "50%",
                    y: "14%",
                    size: 90,
                    tone: "risk",
                  },
                  {
                    key: "sponsor",
                    label: "Human\nsponsor",
                    x: "50%",
                    y: "88%",
                    size: 98,
                    tone: "deep",
                  },
                ]}
              />
              <div className="absolute left-[28%] top-[37%]">
                <FlowConnector tone="trust" length={86} />
              </div>
              <div className="absolute right-[28%] top-[37%]">
                <FlowConnector tone="ai" length={86} />
              </div>
              <div className="absolute left-[29%] bottom-[34%]">
                <FlowConnector tone="primary" length={84} />
              </div>
              <div className="absolute right-[29%] bottom-[34%]">
                <FlowConnector tone="signal" length={84} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div
              className="rounded-[24px] p-4"
              style={{
                background: mix(PALETTE.trust, PALETTE.bg, 12),
                border: `1px solid ${mix(PALETTE.trust, "transparent", 24)}`,
              }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.16em]"
                style={{ color: PALETTE.muted }}
              >
                Access facets
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <SignalPill label="tools" tone="signal" />
                <SignalPill label="data" tone="trust" />
                <SignalPill label="actions" tone="risk" />
                <SignalPill label="context" tone="ai" />
              </div>
            </div>

            <div
              className="rounded-[24px] p-4"
              style={{
                background: mix(PALETTE.bg, PALETTE.secondary, 78),
                border: `1px solid ${mix(PALETTE.primary, "transparent", 16)}`,
              }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.16em]"
                style={{ color: PALETTE.muted }}
              >
                Risk signals
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <SignalPill label="oversharing" tone="risk" />
                <SignalPill label="agent sprawl" tone="ai" />
                <SignalPill label="governance gaps" tone="trust" />
                <SignalPill label="new attack vectors" tone="signal" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <LegendStrip
        items={[
          { label: "owned / governed", tone: "trust" },
          { label: "machine-native", tone: "ai" },
          { label: "tool + telemetry", tone: "signal" },
          { label: "risk-critical", tone: "risk" },
        ]}
      />
    </div>

    <div className="grid min-h-0 grid-rows-[auto_auto_1fr_auto] gap-4">
      <HeroBand
        eyebrow="Control plane"
        tone="trust"
        title={
          <>
            Govern.
            <span style={{ color: PALETTE.deep }}> Nicht nur freigeben.</span>
          </>
        }
        subtitle="IAM wird für Agents zum Operating Model für Ownership, Scope, Logging und Lifecycle."
      />

      <GovernanceBoard
        items={[
          {
            key: "owner",
            title: "Human owner",
            text: "Jeder Agent braucht Sponsor, Verantwortung und Accountability.",
            icon: <UserRoundCog size={17} />,
            tone: "trust",
          },
          {
            key: "identity",
            title: "Unique identity",
            text: "Keine diffuse Sammelidentität, sondern sauber registrierte Zuordnung.",
            icon: <Bot size={17} />,
            tone: "primary",
          },
          {
            key: "scope",
            title: "Scoped access",
            text: "Welche Tools, welche Daten, welche Aktionen und für welchen Kontext?",
            icon: <KeyRound size={17} />,
            tone: "signal",
          },
          {
            key: "trace",
            title: "Traceability",
            text: "Logging, Nachvollziehbarkeit und Audit sind kein Add-on mehr.",
            icon: <FileSearch size={17} />,
            tone: "ai",
          },
        ]}
      />

      <LayerStack
        layers={[
          {
            key: "register",
            title: "Register",
            text: "Agenten und Workloads werden sichtbar und eindeutig inventarisiert.",
            tone: "primary",
            icon: <Boxes size={17} />,
          },
          {
            key: "authorize",
            title: "Authorize",
            text: "Scopes werden granular über Tools, Daten, Aktionen und Kontext definiert.",
            tone: "signal",
            icon: <Wrench size={17} />,
          },
          {
            key: "observe",
            title: "Observe",
            text: "Sprawl, Oversharing und unerwartete Pfade werden kontinuierlich sichtbar gemacht.",
            tone: "ai",
            icon: <ScanSearch size={17} />,
          },
          {
            key: "govern",
            title: "Govern lifecycle",
            text: "Erstellen, ändern, rezertifizieren und abschalten wird Teil des IAM-Betriebs.",
            tone: "trust",
            icon: <Workflow size={17} />,
          },
          {
            key: "decide",
            title: "Compare futures",
            text: "Ungoverned agents erzeugen neue Attack Vectors; governed agents erweitern das Geschäft kontrolliert.",
            tone: "deep",
            icon: <GitBranch size={17} />,
          },
        ]}
      />

      <FooterBand
        title="Merksatz"
        tone="ai"
        text="AI Agents sind kein Randthema des IAM. Sie definieren gerade das nächste große Identitäts-Arbeitsfeld."
      />
    </div>
  </div>
);

const AiAgentsIdentitiesSlide: CodeSlide = {
  id: "diw-ai-agents-identities",
  name: "24 · AI Agents und Identitäten",
  description:
    "Zukunftsfolie zur agentischen Identitätslandschaft und zum Governance-Operating-Model für nicht-menschliche Identitäten.",
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
        "Identity landscape links, Governance operating model rechts.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default AiAgentsIdentitiesSlide;
