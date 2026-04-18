import * as React from "react";
import {
  Bot,
  Boxes,
  FileSearch,
  KeyRound,
  UserRoundCog,
  Workflow,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { FooterBand, MetaBadge, OrbCluster } from "./_shared";
import type { CodeSlide } from "../types";

const GovernanceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  text: string;
}> = ({ icon, title, text }) => (
  <div
    className="rounded-2xl p-4"
    style={{
      background: "color-mix(in srgb, var(--slide-primary) 6%, var(--slide-bg))",
      border: "1px solid color-mix(in srgb, var(--slide-primary) 16%, transparent)",
    }}
  >
    <div className="flex items-start gap-3">
      <div
        className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
        style={{
          background: "color-mix(in srgb, var(--slide-primary) 14%, var(--slide-bg))",
          color: "var(--slide-primary)",
        }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div
          className="text-[14px] font-semibold"
          style={{
            color: "var(--slide-primary)",
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          {title}
        </div>
        <div
          className="mt-1 text-[10px] leading-snug"
          style={{ color: "var(--slide-text-muted)" }}
        >
          {text}
        </div>
      </div>
    </div>
  </div>
);

const TitleSlot: React.FC = () => (
  <div
    className="flex h-full w-full items-center justify-between gap-4"
    style={{ fontFamily: "var(--slide-font-body)" }}
  >
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, var(--slide-primary), color-mix(in srgb, var(--slide-secondary) 55%, var(--slide-primary)))",
          color: "var(--slide-bg)",
        }}
      >
        <Bot size={22} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Nächste Identitätsklasse
        </div>
        <div
          className="truncate text-[26px] font-semibold leading-[1.06]"
          style={{
            fontFamily: "var(--slide-font-heading)",
            color: "var(--slide-primary)",
          }}
        >
          AI Agents und nicht-menschliche Identitäten
        </div>
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge>Services</MetaBadge>
      <MetaBadge>Bots</MetaBadge>
      <MetaBadge>AI Agents</MetaBadge>
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div
    className="grid h-full w-full grid-cols-[1.02fr_0.98fr] gap-4"
    style={{ fontFamily: "var(--slide-font-body)" }}
  >
    <Card
      className="relative overflow-hidden rounded-[28px] p-5"
      style={
        {
          "--card-bg":
            "linear-gradient(165deg, color-mix(in srgb, var(--slide-primary) 18%, var(--slide-bg)), color-mix(in srgb, var(--slide-secondary) 16%, var(--slide-bg)))",
          "--card-border": "color-mix(in srgb, var(--slide-primary) 18%, transparent)",
          "--card-fg": "var(--slide-text)",
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--slide-primary) 10%, transparent), transparent)",
        }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "var(--slide-text-muted)" }}
            >
              Neue Realität
            </div>
            <div
              className="mt-1 text-[28px] font-semibold leading-[1.02]"
              style={{
                color: "var(--slide-primary)",
                fontFamily: "var(--slide-font-heading)",
              }}
            >
              Identitäten handeln
              <br />
              nicht mehr nur menschlich.
            </div>
          </div>
          <div
            className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
            style={{
              background:
                "color-mix(in srgb, var(--slide-secondary) 18%, var(--slide-bg))",
              color: "var(--slide-primary)",
              border:
                "1px solid color-mix(in srgb, var(--slide-secondary) 26%, transparent)",
            }}
          >
            Mehr Identitäten · mehr Handlungsmacht
          </div>
        </div>

        <div className="relative mt-2 flex-1">
          <div className="absolute inset-[8%_4%_14%_4%]">
            <OrbCluster
              items={[
                {
                  label: "Service",
                  size: 76,
                  x: "20%",
                  y: "26%",
                  tone: "secondary",
                },
                {
                  label: "Bot",
                  size: 72,
                  x: "79%",
                  y: "26%",
                  tone: "primary",
                },
                {
                  label: "Skript",
                  size: 72,
                  x: "22%",
                  y: "76%",
                  tone: "secondary",
                },
                {
                  label: "Tool-\nZugriff",
                  size: 78,
                  x: "78%",
                  y: "77%",
                  tone: "primary",
                },
                {
                  label: "AI\nAgent",
                  size: 142,
                  x: "50%",
                  y: "53%",
                  tone: "accent",
                },
              ]}
            />
          </div>
        </div>

        <div
          className="rounded-2xl px-4 py-3"
          style={{
            background:
              "color-mix(in srgb, var(--slide-bg) 60%, color-mix(in srgb, var(--slide-primary) 8%, transparent))",
            border:
              "1px solid color-mix(in srgb, var(--slide-primary) 16%, transparent)",
          }}
        >
          <div
            className="text-[11px] leading-snug"
            style={{ color: "var(--slide-text)" }}
          >
            Sie lesen Daten, sprechen Tools an, bereiten Entscheidungen vor und
            können Aktionen auslösen.
          </div>
        </div>
      </div>
    </Card>

    <div className="flex h-full flex-col gap-3">
      <div>
        <div
          className="text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Was IAM dafür leisten muss
        </div>
        <div
          className="mt-1 text-[24px] font-semibold leading-[1.04]"
          style={{
            color: "var(--slide-primary)",
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          Govern.
          <span style={{ color: "var(--slide-text)" }}> Nicht nur freigeben.</span>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3">
        <GovernanceCard
          icon={<UserRoundCog size={17} />}
          title="Owner"
          text="Jeder Agent braucht eine verantwortliche Person."
        />
        <GovernanceCard
          icon={<KeyRound size={17} />}
          title="Eigene ID"
          text="Keine diffuse Sammelidentität, sondern eindeutige Zuordnung."
        />
        <GovernanceCard
          icon={<Boxes size={17} />}
          title="Least Privilege"
          text="Nur die Tools, Daten und Aktionen, die wirklich nötig sind."
        />
        <GovernanceCard
          icon={<FileSearch size={17} />}
          title="Lifecycle"
          text="Registrieren, überwachen, anpassen und sauber abschalten."
        />
      </div>

      <div
        className="rounded-[24px] p-4"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--slide-primary) 8%, var(--slide-bg)), color-mix(in srgb, var(--slide-secondary) 12%, var(--slide-bg)))",
          border:
            "1px solid color-mix(in srgb, var(--slide-primary) 18%, transparent)",
        }}
      >
        <div
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--slide-text-muted)" }}
        >
          <Workflow size={14} />
          Entscheidende Frage
        </div>
        <div
          className="mt-1 text-[18px] font-semibold leading-tight"
          style={{
            color: "var(--slide-primary)",
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          Wenn ein Agent handeln darf:
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Welche Tools?", "Welche Daten?", "Welche Aktionen?"].map((item) => (
            <div
              key={item}
              className="rounded-full px-3 py-1.5 text-[11px] font-medium"
              style={{
                background:
                  "color-mix(in srgb, var(--slide-primary) 12%, var(--slide-bg))",
                border:
                  "1px solid color-mix(in srgb, var(--slide-primary) 18%, transparent)",
                color: "var(--slide-primary)",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <FooterBand
        title="Merksatz"
        text="AI Agents sind keine bloßen Servicekonten. Sie sind eine neue Identitätsklasse mit Scope, Verantwortung und Governance."
      />
    </div>
  </div>
);

const AiAgentsIdentitiesSlide: CodeSlide = {
  id: "diw-ai-agents-identities",
  name: "24 · AI Agents und Identitäten",
  description:
    "Zukunftsfolie zu nicht-menschlichen Identitäten, AI Agents und den daraus folgenden IAM-Pflichten.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Kurztitel und fokussierte Meta-Badges.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description:
        "Hero-Panel mit Identitätslandschaft links und Governance-Board rechts.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default AiAgentsIdentitiesSlide;
