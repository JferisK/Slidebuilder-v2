import * as React from "react";
import {
  Upload,
  MousePointerClick,
  MessageSquare,
  FolderTree,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useSlideStore } from "@/store/slideStore";
import { Button } from "./ui/button";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: <Upload size={32} />,
    title: "1. PPTX-Vorlage hochladen",
    description:
      "Lade deine PowerPoint-Vorlage (.pptx) hoch. SlideForge liest Master, Layouts, Placeholder, Farben und Schriften lokal im Browser aus.",
  },
  {
    icon: <MousePointerClick size={32} />,
    title: "2. Master und Layout wählen",
    description:
      "Wähle im rechten Panel unter PPTX-Struktur die passende Vorlage, den Folienmaster und das Layout für die aktive Folie.",
  },
  {
    icon: <FolderTree size={32} />,
    title: "3. Projekt oder Repo-Folie wählen",
    description:
      "Wähle unter Projekt & Folien einen Projekt- oder Repo-Ordner und lade eine vorhandene Slide oder eine zentrale Vorlage.",
  },
  {
    icon: <MousePointerClick size={32} />,
    title: "4. Bereiche und Inhalte prüfen",
    description:
      "Ordne CodeSlide-Slots den PowerPoint-Bereichen zu, blende unnötige Placeholder aus und markiere Inhalte oder Elemente gezielt auf der Folie.",
  },
  {
    icon: <MessageSquare size={32} />,
    title: "5. Prompt nutzen und exportieren",
    description:
      "Kopiere Feedback als Kontext-Prompt für Claude, Copilot oder Codex. Nach der Umsetzung exportierst du die sichtbare Folie als PNG.",
  },
];

export const OnboardingScreen: React.FC = () => {
  const setOnboardingDone = useSlideStore((s) => s.setOnboardingDone);
  const [step, setStep] = React.useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.85)]">
      <div
        className="w-full max-w-xl rounded-xl border border-[var(--app-border)] bg-[var(--app-panel)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        style={{ minHeight: 360 }}
      >
        {/* Header */}
        <div className="mb-6 flex items-center gap-2">
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: "var(--app-accent)",
              display: "inline-block",
            }}
          />
          <span className="text-sm font-semibold tracking-tight">
            SlideForge — So nutzt du die App
          </span>
          <span className="ml-auto text-[10px] text-[var(--app-muted)]">
            {step + 1} / {STEPS.length}
          </span>
        </div>

        {/* Progress dots */}
        <div className="mb-6 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                height: 3,
                flex: 1,
                borderRadius: 2,
                background:
                  i <= step
                    ? "var(--app-accent)"
                    : "var(--app-border)",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="text-[var(--app-accent)]">{current.icon}</div>
          <h2 className="text-base font-semibold text-[var(--app-text)]">
            {current.title}
          </h2>
          <p
            className="text-xs leading-relaxed text-[var(--app-muted)]"
            style={{ maxWidth: 420 }}
          >
            {current.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft size={12} /> Zurück
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOnboardingDone(true);
            }}
            className="text-[var(--app-muted)]"
          >
            Überspringen
          </Button>

          {isLast ? (
            <Button size="sm" onClick={() => setOnboardingDone(true)}>
              Loslegen <ArrowRight size={12} />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStep((s) => s + 1)}
            >
              Weiter <ArrowRight size={12} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
