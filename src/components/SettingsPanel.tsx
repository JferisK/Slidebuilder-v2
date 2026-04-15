import * as React from "react";
import {
  useActiveLayout,
  useActiveMaster,
  useActiveSlide,
  useSlideStore,
} from "@/store/slideStore";
import { Select } from "./ui/select";
import { Separator } from "./ui/separator";
import { ContentEditor } from "./ContentEditor";
import { SlideList } from "./SlideList";
import { ExportButton } from "./ExportButton";

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--app-muted)]">
    {children}
  </div>
);

export const SettingsPanel: React.FC = () => {
  const presentation = useSlideStore((s) => s.presentation);
  const activeMaster = useActiveMaster();
  const activeSlide = useActiveSlide();
  const activeLayout = useActiveLayout();
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const setActiveMaster = useSlideStore((s) => s.setActiveMaster);
  const setLayoutForSlide = useSlideStore((s) => s.setLayoutForSlide);

  if (!presentation || !activeMaster || !activeSlide || !activeLayout) {
    return null;
  }

  const masterOptions = presentation.masters.map((m) => ({
    value: m.id,
    label: m.name,
  }));
  const layoutOptions = activeMaster.layouts.map((l) => ({
    value: l.id,
    label: l.name,
  }));

  return (
    <aside
      style={{ width: 300 }}
      className="flex h-full flex-none flex-col border-l border-[var(--app-border)] bg-[var(--app-panel)]"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-thin p-4">
        <div>
          <SectionLabel>Folienmaster</SectionLabel>
          <Select
            value={activeMaster.id}
            options={masterOptions}
            onValueChange={(v) => setActiveMaster(v)}
          />
        </div>

        <Separator />

        <div>
          <SectionLabel>Layout</SectionLabel>
          <Select
            value={activeLayout.id}
            options={layoutOptions}
            onValueChange={(v) => setLayoutForSlide(activeSlideIndex, v)}
          />
        </div>

        <Separator />

        <div>
          <SectionLabel>Inhalte</SectionLabel>
          <ContentEditor
            layout={activeLayout}
            slideIndex={activeSlideIndex}
            content={activeSlide.content}
          />
        </div>

        <Separator />

        <div>
          <SectionLabel>Folien</SectionLabel>
          <SlideList />
        </div>

        <Separator />

        <div>
          <SectionLabel>Export</SectionLabel>
          <ExportButton />
        </div>
      </div>
    </aside>
  );
};
