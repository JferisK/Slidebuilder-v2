import * as React from "react";
import {
  ArrowRight,
  ScanFace,
  Sparkles,
  Video,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { FooterBand, MetaBadge, OrbCluster } from "./_shared";
import type { CodeSlide } from "../types";

const SignalCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  text: string;
}> = ({ icon, title, text }) => (
  <div
    className="rounded-2xl p-3"
    style={{
      background: "color-mix(in srgb, var(--slide-bg) 82%, transparent)",
      border: "1px solid color-mix(in srgb, var(--slide-bg) 24%, transparent)",
      backdropFilter: "blur(4px)",
    }}
  >
    <div className="flex items-start gap-2.5">
      <div
        className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg"
        style={{
          background: "color-mix(in srgb, var(--slide-bg) 84%, transparent)",
          color: "var(--slide-accent)",
        }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div
          className="text-[12px] font-semibold"
          style={{
            color: "var(--slide-bg)",
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          {title}
        </div>
        <div className="mt-0.5 text-[10px] leading-snug text-white/80">{text}</div>
      </div>
    </div>
  </div>
);

const ResponseStep: React.FC<{
  index: string;
  title: string;
  text: string;
}> = ({ index, title, text }) => (
  <div className="flex items-stretch gap-3">
    <div
      className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl text-[16px] font-semibold"
      style={{
        background: "color-mix(in srgb, var(--slide-primary) 14%, var(--slide-bg))",
        border: "1px solid color-mix(in srgb, var(--slide-primary) 22%, transparent)",
        color: "var(--slide-primary)",
        fontFamily: "var(--slide-font-heading)",
      }}
    >
      {index}
    </div>
    <div
      className="flex-1 rounded-2xl px-4 py-3"
      style={{
        background: "color-mix(in srgb, var(--slide-primary) 6%, var(--slide-bg))",
        border: "1px solid color-mix(in srgb, var(--slide-primary) 16%, transparent)",
      }}
    >
      <div
        className="text-[15px] font-semibold"
        style={{
          color: "var(--slide-primary)",
          fontFamily: "var(--slide-font-heading)",
        }}
      >
        {title}
      </div>
      <div
        className="mt-1 text-[11px] leading-snug"
        style={{ color: "var(--slide-text-muted)" }}
      >
        {text}
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
            "linear-gradient(135deg, var(--slide-accent), var(--slide-primary))",
          color: "var(--slide-bg)",
        }}
      >
        <Sparkles size={22} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Zukunft von Identity Security
        </div>
        <div
          className="truncate text-[26px] font-semibold leading-[1.06]"
          style={{
            fontFamily: "var(--slide-font-heading)",
            color: "var(--slide-primary)",
          }}
        >
          Warum IAM durch KI und Deepfakes wichtiger wird
        </div>
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge>Deepfakes</MetaBadge>
      <MetaBadge>Biometrie</MetaBadge>
      <MetaBadge variant="outline">Phishing-resistente MFA</MetaBadge>
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div
    className="grid h-full w-full grid-cols-[1.15fr_0.85fr] gap-4"
    style={{ fontFamily: "var(--slide-font-body)" }}
  >
    <Card
      className="relative overflow-hidden rounded-[28px] p-5"
      style={
        {
          "--card-bg":
            "linear-gradient(160deg, color-mix(in srgb, var(--slide-accent) 28%, var(--slide-primary)), color-mix(in srgb, var(--slide-primary) 74%, #0b1635))",
          "--card-border": "color-mix(in srgb, var(--slide-primary) 28%, transparent)",
          "--card-fg": "var(--slide-bg)",
        } as React.CSSProperties
      }
    >
      <div
        className="absolute -right-10 -top-10 h-48 w-48 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--slide-bg) 20%, transparent), transparent 68%)",
        }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[70%]">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/70">
              Neue Angriffsfläche
            </div>
            <div
              className="mt-1 text-[28px] font-semibold leading-[1.02]"
              style={{ fontFamily: "var(--slide-font-heading)" }}
            >
              Identität wird
              <br />
              leichter imitierbar.
            </div>
          </div>
          <div
            className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
            style={{
              background: "color-mix(in srgb, var(--slide-bg) 14%, transparent)",
              border: "1px solid color-mix(in srgb, var(--slide-bg) 18%, transparent)",
              color: "var(--slide-bg)",
            }}
          >
            Billiger · schneller · skalierbarer
          </div>
        </div>

        <div className="relative mt-3 flex-1">
          <div className="absolute inset-[10%_8%_18%_8%]">
            <OrbCluster
              items={[
                {
                  label: "Menschen\nim Call",
                  size: 90,
                  x: "20%",
                  y: "22%",
                  tone: "accent",
                },
                {
                  label: "Biometrische\nPrüfung",
                  size: 96,
                  x: "80%",
                  y: "24%",
                  tone: "secondary",
                },
                {
                  label: "Freigaben\n& Flows",
                  size: 96,
                  x: "25%",
                  y: "78%",
                  tone: "primary",
                },
                {
                  label: "Vertrauen\nwird\nsynthetisch",
                  size: 138,
                  x: "58%",
                  y: "56%",
                  tone: "accent",
                },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SignalCard
            icon={<Video size={15} />}
            title="Social Engineering"
            text="Täuschung wirkt persönlicher und glaubwürdiger."
          />
          <SignalCard
            icon={<ScanFace size={15} />}
            title="Automatisierte Prüfung"
            text="Auch technische Identitätschecks geraten unter Druck."
          />
        </div>
      </div>
    </Card>

    <div className="flex h-full flex-col gap-3">
      <div>
        <div
          className="text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Was gutes IAM jetzt leisten muss
        </div>
        <div
          className="mt-1 text-[24px] font-semibold leading-[1.04]"
          style={{
            color: "var(--slide-primary)",
            fontFamily: "var(--slide-font-heading)",
          }}
        >
          Nicht mehr Erkennung allein.
          <br />
          Sondern Kontrolle in Schichten.
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2.5">
        <ResponseStep
          index="01"
          title="Verify"
          text="Phishing-resistente MFA und starke Identitätsprüfung für riskante Aktionen."
        />
        <div className="flex justify-center">
          <ArrowRight size={16} style={{ color: "var(--slide-text-muted)" }} />
        </div>
        <ResponseStep
          index="02"
          title="Gate"
          text="Härtere Freigabe-, Rückruf- und Ausnahmeprozesse statt bloßer Plausibilität."
        />
        <div className="flex justify-center">
          <ArrowRight size={16} style={{ color: "var(--slide-text-muted)" }} />
        </div>
        <ResponseStep
          index="03"
          title="Respond"
          text="Zusätzliche Risikosignale sowie Detection und Response rund um Identitäten."
        />
      </div>

      <FooterBand
        title="Merksatz"
        text="KI ersetzt IAM nicht. Sie macht belastbare Rechte-, Freigabe- und Verifikationsmechanismen dringender."
      />
    </div>
  </div>
);

const IamAiDeepfakesSlide: CodeSlide = {
  id: "diw-iam-ai-deepfakes",
  name: "23 · IAM durch KI und Deepfakes",
  description:
    "Relevanzfolie zu Deepfakes, Social Engineering und der Notwendigkeit robuster Identity-Kontrollen.",
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
        "Hero-Panel mit Angriffsdruck links und gestufter IAM-Antwort rechts.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default IamAiDeepfakesSlide;
