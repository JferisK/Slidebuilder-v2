import * as React from "react";
import { useSlideStore } from "@/store/slideStore";
import { CopilotPromptDrawer } from "./CopilotPromptDrawer";

export const GlobalCopilotDrawer: React.FC = () => {
  const open = useSlideStore((s) => s.copilotDrawerOpen);
  const prompt = useSlideStore((s) => s.copilotDrawerPrompt);
  const close = useSlideStore((s) => s.closeCopilotDrawer);
  const showToast = useSlideStore((s) => s.showToast);

  return (
    <CopilotPromptDrawer
      open={open}
      initialPrompt={prompt}
      onClose={close}
      onCopied={async (value) => {
        try {
          await navigator.clipboard.writeText(value);
          showToast("✅ Prompt kopiert — in Copilot Chat einfügen (Strg+V)");
        } catch {
          showToast("⚠️ Clipboard nicht verfügbar", "error");
        }
        close();
      }}
    />
  );
};
