import { create } from "zustand";
import type {
  ParsedPresentation,
  SlideLayout,
  SlideMaster,
} from "@/parser/pptxParser";

export interface Slide {
  id: string;
  masterId: string;
  layoutId: string;
  content: Record<string, string>;
}

export interface Annotation {
  id: string;
  slideIndex: number;
  position: { x: number; y: number };
  comment: string;
}

export type ToastKind = "success" | "info" | "error";

export interface ToastMessage {
  id: string;
  text: string;
  kind: ToastKind;
}

export interface SlideForgeStore {
  presentation: ParsedPresentation | null;
  setParsedPresentation: (p: ParsedPresentation) => void;

  activeMasterId: string | null;
  activeSlideIndex: number;
  setActiveMaster: (id: string) => void;
  setActiveSlide: (index: number) => void;

  slides: Slide[];
  addSlide: () => void;
  duplicateSlide: (index: number) => void;
  removeSlide: (index: number) => void;
  setLayoutForSlide: (slideIndex: number, layoutId: string) => void;
  updateSlideContent: (
    slideIndex: number,
    idx: string,
    value: string,
  ) => void;

  annotations: Annotation[];
  annotationsVisible: boolean;
  addAnnotation: (a: Omit<Annotation, "id">) => void;
  removeAnnotation: (id: string) => void;
  setAnnotationsVisible: (v: boolean) => void;

  currentToast: ToastMessage | null;
  showToast: (text: string, kind?: ToastKind) => void;
  dismissToast: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

function findMaster(
  presentation: ParsedPresentation | null,
  masterId: string | null,
): SlideMaster | undefined {
  if (!presentation || !masterId) return undefined;
  return presentation.masters.find((m) => m.id === masterId);
}

function findLayout(
  master: SlideMaster | undefined,
  layoutId: string,
): SlideLayout | undefined {
  return master?.layouts.find((l) => l.id === layoutId);
}

export const useSlideStore = create<SlideForgeStore>((set, get) => ({
  presentation: null,
  activeMasterId: null,
  activeSlideIndex: 0,
  slides: [],
  annotations: [],
  annotationsVisible: true,
  currentToast: null,

  setParsedPresentation: (p) => {
    const firstMaster = p.masters[0];
    const firstLayout = firstMaster?.layouts[0];
    const initialSlide: Slide | null =
      firstMaster && firstLayout
        ? {
            id: uid(),
            masterId: firstMaster.id,
            layoutId: firstLayout.id,
            content: {},
          }
        : null;
    set({
      presentation: p,
      activeMasterId: firstMaster?.id ?? null,
      activeSlideIndex: 0,
      slides: initialSlide ? [initialSlide] : [],
      annotations: [],
      annotationsVisible: true,
    });
  },

  setActiveMaster: (id) => {
    const { presentation, slides, activeSlideIndex } = get();
    const newMaster = presentation?.masters.find((m) => m.id === id);
    if (!newMaster) return;
    // Retarget active slide's layout to the first layout of the new master
    const nextSlides = slides.map((slide, i) => {
      if (i !== activeSlideIndex) return slide;
      return {
        ...slide,
        masterId: newMaster.id,
        layoutId: newMaster.layouts[0]?.id ?? slide.layoutId,
      };
    });
    set({ activeMasterId: id, slides: nextSlides });
  },

  setActiveSlide: (index) => set({ activeSlideIndex: index }),

  addSlide: () => {
    const { presentation, activeMasterId, slides } = get();
    const master = findMaster(presentation, activeMasterId);
    const layout = master?.layouts[0];
    if (!master || !layout) return;
    const newSlide: Slide = {
      id: uid(),
      masterId: master.id,
      layoutId: layout.id,
      content: {},
    };
    set({
      slides: [...slides, newSlide],
      activeSlideIndex: slides.length,
    });
  },

  duplicateSlide: (index) => {
    const { slides } = get();
    const src = slides[index];
    if (!src) return;
    const clone: Slide = {
      ...src,
      id: uid(),
      content: { ...src.content },
    };
    const next = [...slides];
    next.splice(index + 1, 0, clone);
    set({ slides: next, activeSlideIndex: index + 1 });
  },

  removeSlide: (index) => {
    const { slides, activeSlideIndex, annotations } = get();
    if (slides.length <= 1) return;
    const next = slides.filter((_, i) => i !== index);
    // Re-map annotations: drop for removed slide, shift indexes above
    const nextAnnotations = annotations
      .filter((a) => a.slideIndex !== index)
      .map((a) =>
        a.slideIndex > index ? { ...a, slideIndex: a.slideIndex - 1 } : a,
      );
    const newActive =
      activeSlideIndex >= next.length ? next.length - 1 : activeSlideIndex;
    set({
      slides: next,
      activeSlideIndex: Math.max(0, newActive),
      annotations: nextAnnotations,
    });
  },

  setLayoutForSlide: (slideIndex, layoutId) => {
    const { slides, presentation } = get();
    const slide = slides[slideIndex];
    if (!slide) return;
    // Find which master owns this layout
    const owningMaster = presentation?.masters.find((m) =>
      m.layouts.some((l) => l.id === layoutId),
    );
    if (!owningMaster) return;
    const next = slides.map((s, i) =>
      i === slideIndex
        ? { ...s, masterId: owningMaster.id, layoutId }
        : s,
    );
    set({ slides: next });
  },

  updateSlideContent: (slideIndex, idx, value) => {
    const { slides } = get();
    const next = slides.map((s, i) =>
      i === slideIndex
        ? { ...s, content: { ...s.content, [idx]: value } }
        : s,
    );
    set({ slides: next });
  },

  addAnnotation: (a) =>
    set({
      annotations: [...get().annotations, { ...a, id: uid() }],
    }),

  removeAnnotation: (id) =>
    set({ annotations: get().annotations.filter((a) => a.id !== id) }),

  setAnnotationsVisible: (v) => set({ annotationsVisible: v }),

  showToast: (text, kind = "success") => {
    const id = uid();
    set({ currentToast: { id, text, kind } });
    // Auto-dismiss after 2s if still the same toast
    setTimeout(() => {
      if (get().currentToast?.id === id) set({ currentToast: null });
    }, 2000);
  },

  dismissToast: () => set({ currentToast: null }),
}));

// Helper selectors
export function useActiveMaster(): SlideMaster | undefined {
  return useSlideStore((s) => findMaster(s.presentation, s.activeMasterId));
}

export function useActiveSlide(): Slide | undefined {
  return useSlideStore((s) => s.slides[s.activeSlideIndex]);
}

export function useActiveLayout(): SlideLayout | undefined {
  return useSlideStore((s) => {
    const slide = s.slides[s.activeSlideIndex];
    if (!slide || !s.presentation) return undefined;
    const master = s.presentation.masters.find((m) => m.id === slide.masterId);
    return findLayout(master, slide.layoutId);
  });
}
