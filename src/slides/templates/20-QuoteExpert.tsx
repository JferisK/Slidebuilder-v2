import * as React from "react";
import type { CodeSlide } from "../types";
import { WireTitle } from "./_shared";

const TitleWire: React.FC = () => (
  <WireTitle label="Titel: Voice of Customer / Experte" hint="z. B. Interviews" />
);

const ContentWire: React.FC = () => (
  <div className="h-full w-full p-2 flex items-center justify-center">
    <div className="col-span-10 w-10/12 border-2 border-dashed border-slate-400 rounded-xl bg-slate-50 p-4 flex flex-col gap-3">
      <span className="text-[36px] leading-none text-slate-300 font-serif">“</span>
      <span className="text-[14px] italic text-slate-700 leading-snug">
        Platzhalter für das Zitat — eine prägnante Aussage des Kunden oder Experten,
        1-3 Zeilen lang.
      </span>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-400 bg-white" />
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-slate-700">
            Name der Person
          </span>
          <span className="text-[9px] text-slate-500 uppercase tracking-wide">
            Rolle · Unternehmen
          </span>
        </div>
      </div>
    </div>
  </div>
);

export const QuoteExpert: CodeSlide = {
  id: "quote-expert",
  name: "20 · Quote Slide",
  description:
    "Groß gesetztes Zitat zentriert, mit Sprechername + Rolle. Für Voice-of-Customer-Reports, Experteninterviews und Strategieprojekte. Schafft Empathie und Glaubwürdigkeit.",
  slots: [
    { key: "title", label: "Titel", Component: TitleWire },
    {
      key: "content",
      label: "Inhalt",
      description: "Zitat-Block zentriert mit Sprecher-Attribution",
      Component: ContentWire,
    },
  ],
  preferredTypes: { title: ["title", "ctrTitle"], content: ["body"] },
};

export default QuoteExpert;
