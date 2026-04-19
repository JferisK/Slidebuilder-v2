import * as React from "react";
import { ClipboardCheck, FilePenLine, Search, TriangleAlert } from "lucide-react";
import { FooterBand, HeroBand, MetaBadge, PALETTE, mix } from "./_shared";
import type { CodeSlide } from "../types";

const tasks = [
  {
    title: "Schaut euch die App systematisch an",
    icon: Search,
    tone: PALETTE.primary,
  },
  {
    title: "Achtet auf auffaellige Zugaenge, Rechte und Sichtbarkeiten",
    icon: TriangleAlert,
    tone: PALETTE.risk,
  },
  {
    title: "Notiert, was euch riskant oder seltsam vorkommt",
    icon: FilePenLine,
    tone: PALETTE.signal,
  },
  {
    title: "Begruendet eure Beobachtungen und bereitet euch auf eine spaetere Slide vor",
    icon: ClipboardCheck,
    tone: PALETTE.trust,
  },
];

const TitleSlot: React.FC = () => (
  <div className="flex h-full w-full items-center justify-between gap-4">
    <div>
      <div
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
      >
        Arbeitsstart
      </div>
      <div
        className="text-[26px] font-semibold leading-[1.04]"
        style={{ color: PALETTE.primary, fontFamily: PALETTE.heading }}
      >
        Euer Arbeitsauftrag in der App
      </div>
    </div>
    <div className="flex flex-none items-center gap-1.5">
      <MetaBadge tone="primary">beobachten</MetaBadge>
      <MetaBadge tone="signal">begruenden</MetaBadge>
      <MetaBadge tone="trust">spaeter praesentieren</MetaBadge>
    </div>
  </div>
);

const BodySlot: React.FC = () => (
  <div className="grid h-full w-full grid-cols-[0.9fr_1.1fr] gap-4">
    <div className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-4">
      <HeroBand
        eyebrow="App phase"
        title={
          <>
            Sucht nicht zufaellig.
            <br />
            Beobachtet mit Absicht.
          </>
        }
        subtitle="Die erste App-Phase ist noch keine Theorievermittlung. Sie ist die strukturierte Sammlung von Auffaelligkeiten, die spaeter mit den Prinzipien verbunden werden."
        tone="primary"
      />

      <div
        className="rounded-[28px] p-5"
        style={{
          background: mix(PALETTE.secondary, PALETTE.bg, 78),
          border: `1px solid ${mix(PALETTE.primary, "transparent", 18)}`,
        }}
      >
        <div
          className="text-[10px] uppercase tracking-[0.16em]"
          style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
        >
          Wichtige Einordnung
        </div>
        <div
          className="mt-3 text-[14px] font-semibold leading-tight"
          style={{ color: PALETTE.text, fontFamily: PALETTE.heading }}
        >
          Die sechs Prinzipien stehen schon hinter der App, aber werden hier
          noch nicht als Liste ausformuliert.
        </div>
        <div
          className="mt-2 text-[11px] leading-snug"
          style={{ color: PALETTE.muted, fontFamily: PALETTE.body }}
        >
          Sichtbar auf der Folie ist nur der Arbeitsauftrag. Die inhaltliche
          Schaerfung folgt spaeter ueber vorbereitete Slides pro Gruppe.
        </div>
      </div>

      <FooterBand
        title="Uebergang"
        tone="trust"
        text="Damit ihr nicht planlos klickt, bekommt ihr noch ein Suchraster."
      />
    </div>

    <div
      className="grid h-full grid-cols-2 gap-3 rounded-[28px] p-5"
      style={{
        background: `linear-gradient(180deg, ${mix(PALETTE.primary, PALETTE.bg, 8)}, ${mix(
          PALETTE.secondary,
          PALETTE.bg,
          84,
        )})`,
        border: `1px solid ${mix(PALETTE.primary, "transparent", 18)}`,
      }}
    >
      {tasks.map((task, index) => {
        const Icon = task.icon;
        return (
          <div
            key={task.title}
            className="flex flex-col rounded-[24px] p-4"
            style={{
              background: PALETTE.bg,
              border: `1px solid ${mix(task.tone, "transparent", 20)}`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div
                className="text-[18px] font-semibold leading-none"
                style={{ color: task.tone, fontFamily: PALETTE.heading }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-[14px]"
                style={{ background: mix(task.tone, PALETTE.bg, 14), color: task.tone }}
              >
                <Icon size={18} />
              </div>
            </div>
            <div
              className="mt-4 text-[12px] leading-snug"
              style={{ color: PALETTE.text, fontFamily: PALETTE.body }}
            >
              {task.title}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const AppAssignmentSlide: CodeSlide = {
  id: "diw-08-app-assignment",
  name: "08 · Arbeitsauftrag fuer die App",
  description:
    "Arbeitsauftragsfolie fuer die erste App-Phase mit vier klaren Handlungsanweisungen ohne vorweggenommene Prinzipienliste.",
  slots: [
    {
      key: "title",
      label: "Titel",
      description: "Titelzeile des Arbeitsauftrags.",
      Component: TitleSlot,
    },
    {
      key: "content",
      label: "Inhalt",
      description: "Arbeitslogik der ersten App-Phase mit vier Aufgabenblöcken.",
      Component: BodySlot,
    },
  ],
  preferredTypes: {
    title: ["title", "ctrTitle"],
    content: ["body"],
  },
};

export default AppAssignmentSlide;
