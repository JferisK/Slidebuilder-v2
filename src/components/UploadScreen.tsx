import * as React from "react";
import { FileUp, Loader2 } from "lucide-react";
import { parsePptx } from "@/parser/pptxParser";
import { useSlideStore, type StoredTemplate } from "@/store/slideStore";
import { Button } from "./ui/button";

export const UploadScreen: React.FC = () => {
  const setParsedPresentation = useSlideStore(
    (s) => s.setParsedPresentation,
  );
  const addTemplate = useSlideStore((s) => s.addTemplate);
  const setActiveTemplate = useSlideStore((s) => s.setActiveTemplate);
  const templates = useSlideStore((s) => s.templates);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pptx")) {
      setError("Bitte eine .pptx-Datei auswählen.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [parsed, arrayBuffer] = await Promise.all([
        parsePptx(file),
        file.arrayBuffer(),
      ]);

      const tpl: StoredTemplate = {
        id: Math.random().toString(36).slice(2, 10),
        name: file.name.replace(/\.pptx$/i, ""),
        fileName: file.name,
        uploadedAt: Date.now(),
        pptxData: arrayBuffer,
        parsed,
      };

      await addTemplate(tpl);
      setParsedPresentation(parsed);
      useSlideStore.getState().setActiveTemplate(tpl.id);
    } catch (err) {
      console.error(err);
      setError("Datei konnte nicht gelesen werden. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const hasSaved = templates.length > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] p-8">
      <div className="w-full max-w-lg rounded-xl border border-[var(--app-border)] bg-[var(--app-panel)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
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
          <h1 className="text-base font-semibold tracking-tight">
            SlideForge
          </h1>
        </div>
        <p className="mb-6 text-xs text-[var(--app-muted)]">
          Lade deine PowerPoint-Vorlage (<code>.pptx</code>). React-Folien
          werden anschließend auf deine Layouts angewendet.
        </p>

        {/* Stored templates quick access */}
        {hasSaved && (
          <div className="mb-4">
            <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--app-muted)]">
              Gespeicherte Vorlagen
            </div>
            <div className="flex flex-col gap-1">
              {templates.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    setParsedPresentation(t.parsed);
                    setActiveTemplate(t.id);
                  }}
                  className="flex items-center gap-2 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-left text-xs text-[var(--app-text)] transition-colors hover:border-[var(--app-accent)] hover:bg-[rgba(59,130,246,0.05)]"
                >
                  <FileUp size={14} className="text-[var(--app-accent)]" />
                  <div className="flex flex-col">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-[10px] text-[var(--app-muted)]">
                      {t.fileName} •{" "}
                      {new Date(t.uploadedAt).toLocaleDateString("de-DE")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="my-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-[var(--app-border)]" />
              <span className="text-[10px] uppercase tracking-wider text-[var(--app-muted)]">
                oder neue Vorlage
              </span>
              <div className="h-px flex-1 bg-[var(--app-border)]" />
            </div>
          </div>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragging
              ? "border-[var(--app-accent)] bg-[rgba(59,130,246,0.05)]"
              : "border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-accent)]"
          }`}
        >
          {loading ? (
            <>
              <Loader2
                className="mb-3 animate-spin text-[var(--app-accent)]"
                size={28}
              />
              <div className="text-xs text-[var(--app-muted)]">
                Datei wird gelesen…
              </div>
            </>
          ) : (
            <>
              <FileUp className="mb-3 text-[var(--app-muted)]" size={28} />
              <div className="mb-1 text-sm font-medium text-[var(--app-text)]">
                PPTX-Vorlage hier ablegen
              </div>
              <div className="text-xs text-[var(--app-muted)]">
                oder Klick zum Auswählen
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pptx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] px-3 py-2 text-xs text-[var(--app-destructive)]">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
