import * as React from "react";
import { Eye, LockKeyhole, ScanSearch, ShieldAlert, UserCog } from "lucide-react";
import { FooterBand, MetaBadge, PALETTE, mix } from "./_shared";
import type { CodeSlide } from "../types";

const prompts = [
  {
    title: "Wo wirkt ein Zugriff zu offen?",
    icon: LockKeyhole,
    tone: PALETTE.primary,
  },
  {
    title: "Wo wirkt eine Aktion zu maechtig?",
    icon: ShieldAlert,
    tone: PALETTE.risk,
  },
  {
    title: "Wo sind Informationen sichtbar, die nicht jeder sehen sollte?",
    icon: Eye,
    tone: PALETTE.trust,
  },
  {
    title: "Wo scheinen Kontrollen oder Trennungen zu fehlen?",
    icon: ScanSearch,
    tone: PALETTE.signal,
  },
  {
    title: "Wo wirkt die Rollen- oder Kontenpflege unstimmig?",
    icon: UserCog,
    tone: PALETTE.deep,
  },
];

const TitleSlot: React.FC = () => (
  <div className="flex h-full w-full items-center justify-between gap-4">
    <div>
      <div
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
      >
        Suchraster
      </div>
      <div
        className="text-[26px] font-semibold leading-[1.04]"
        style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
      >
        Wonach ihr in der App suchen sollt
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone="primary">Beobachtungsfragen</MetaBadge>
      <MetaBadge tone="outline">noch keine Prinzipiennamen</MetaBadge>
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div className="grid h-full w-full grid-rows-[1fr_auto] gap-4">
    <div
      className="grid h-full grid-cols-2 gap-4 rounded-[28px] p-5"
      style={{
        background: `linear-gradient(180deg, ${mix(PALETTE.secondary, PALETTE.bg, 82)}, ${mix(
          PALETTE.primary,
          PALETTE.bg,
          6,
        )})`,
        border: `1px solid ${mix(PALETTE.primary, "transparent", 18)}`,
      }}
    >
      {prompts.slice(0, 4).map((prompt) => {
        const Icon = prompt.icon;
        return (
          <div
            key={prompt.title}
            className="flex flex-col rounded-[24px] p-5"
            style={{
              background: PALETTE.bg,
              border: `1px solid ${mix(prompt.tone, "transparent", 20)}`,
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[14px]"
              style={{ background: mix(prompt.tone, PALETTE.bg, 14), color: prompt.tone }}
            >
              <Icon size={18} />
            </div>
            <div
              className="mt-4 text-[15px] font-semibold leading-tight"
              style={{ color: PALETTE.text, fontFamily: PALETTE.heading }}
            >
              {prompt.title}
            </div>
          </div>
        );
      })}

      <div
        className="col-span-2 flex items-center gap-4 rounded-[24px] p-5"
        style={{
          background: mix(PALETTE.deep, PALETTE.bg, 94),
          border: `1px solid ${mix(PALETTE.deep, "transparent", 18)}`,
        }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-[16px]"
          style={{ background: mix(PALETTE.deep, PALETTE.bg, 80), color: PALETTE.deep }}
        >
          <UserCog size={22} />
        </div>
        <div>
          <div
            className="text-[10px] uppercase tracking-[0.16em]"
            style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
          >
            Leitfrage 5
          </div>
          <div
            className="mt-2 text-[16px] font-semibold leading-tight"
            style={{ color: PALETTE.text, fontFamily: PALETTE.heading }}
          >
            {prompts[4].title}
          </div>
        </div>
      </div>
    </div>

    <FooterBand
      title="Hinweis"
      tone="trust"
      text="Diese Fragen entsprechen schon den spaeteren Prinzipien, aber ohne sie hier sichtbar auszubuchstabieren."
    />
  </div>
);

const AppSearchLogicSlide: CodeSlide = {
  id: "diw-09-app-search-logic",
  name: "09 · Suchlogik in der App",
  description:
    "Methodische Leitfolie fuer die App-Erkundung mit fuenf Beobachtungsfragen statt zufaelligem Klicken.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelzeile fuer das Suchraster.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Fuenf Leitfragen fuer die strukturierte App-Beobachtung.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default AppSearchLogicSlide;
