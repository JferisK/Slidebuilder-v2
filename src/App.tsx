import * as React from "react";
import { UploadScreen } from "./components/UploadScreen";
import { SlideCanvas } from "./components/SlideCanvas";
import { SettingsPanel } from "./components/SettingsPanel";
import { Toast } from "./components/Toast";
import { useSlideStore } from "./store/slideStore";

const App: React.FC = () => {
  const presentation = useSlideStore((s) => s.presentation);

  if (!presentation) {
    return (
      <>
        <UploadScreen />
        <Toast />
      </>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--app-bg)] text-[var(--app-text)]">
      <header className="flex h-10 flex-none items-center gap-2 border-b border-[var(--app-border)] bg-[var(--app-panel)] px-4">
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 9999,
            background: "var(--app-accent)",
            display: "inline-block",
          }}
        />
        <span className="text-xs font-semibold tracking-tight">
          SlideForge
        </span>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main
          className="flex flex-1 items-center justify-center overflow-auto scrollbar-thin"
          style={{ background: "var(--app-canvas)", padding: 32 }}
        >
          <div style={{ width: "100%", maxWidth: 1280 }}>
            <SlideCanvas />
          </div>
        </main>
        <SettingsPanel />
      </div>
      <Toast />
    </div>
  );
};

export default App;
