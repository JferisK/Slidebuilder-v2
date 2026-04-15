import * as React from "react";
import { useSlideStore } from "@/store/slideStore";

const kindStyles: Record<string, React.CSSProperties> = {
  success: {
    background: "#0f2b1a",
    border: "1px solid #1f6b3a",
    color: "#a6f0c2",
  },
  info: {
    background: "#2a1d0a",
    border: "1px solid #8a5a18",
    color: "#f5c98a",
  },
  error: {
    background: "#2a0f13",
    border: "1px solid #8a2030",
    color: "#f3a0ae",
  },
};

export const Toast: React.FC = () => {
  const toast = useSlideStore((s) => s.currentToast);
  const dismiss = useSlideStore((s) => s.dismissToast);

  if (!toast) return null;
  const style = kindStyles[toast.kind] ?? kindStyles.info;

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        padding: "10px 14px",
        borderRadius: 8,
        fontSize: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        zIndex: 100,
        animation: "toast-in 0.2s ease-out",
        cursor: "pointer",
        maxWidth: 360,
        ...style,
      }}
    >
      {toast.text}
    </div>
  );
};
