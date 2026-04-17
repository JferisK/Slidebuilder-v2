import { create } from "zustand";
import type {
  ParsedPresentation,
  SlideLayout,
  SlideMaster,
} from "@/parser/pptxParser";
import {
  listTemplates,
  saveTemplate,
  deleteTemplate as deleteTemplateFromDb,
  listProjects,
  saveProject as saveProjectToDb,
  deleteProject as deleteProjectFromDb,
  type StoredTemplate,
  type Project,
  type SavedSlide,
  type ProjectFolder,
} from "@/lib/templateStorage";

// ---------- Types -----------------------------------------------------------

export interface Slide {
  id: string;
  masterId: string;
  layoutId: string;
  content: Record<string, string>;
  /**
   * If set, the slide is rendered by a React component from `src/slides/registry.ts`
   * instead of the placeholder-based layout. The master is still used for theming.
   */
  codeSlideId?: string;
}

export interface AreaRect {
  x1: number; // 0-1 normalized
  y1: number;
  x2: number;
  y2: number;
}

export interface Annotation {
  id: string;
  slideIndex: number;
  position: { x: number; y: number };
  area?: AreaRect;
  targetPlaceholderIdx?: number;
  targetPlaceholderType?: string;
  comment: string;
}

export type SelectionMode = "pin" | "area";

export type ToastKind = "success" | "info" | "error";

export interface ToastMessage {
  id: string;
  text: string;
  kind: ToastKind;
}

export { type StoredTemplate, type Project, type SavedSlide, type ProjectFolder };

export interface SlideForgeStore {
  // ── Templates ─────────────────────────────────────────────
  templates: StoredTemplate[];
  activeTemplateId: string | null;
  loadTemplates: () => Promise<void>;
  addTemplate: (tpl: StoredTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  setActiveTemplate: (id: string) => void;

  // ── Parsed presentation (driven by active template) ──────
  presentation: ParsedPresentation | null;
  setParsedPresentation: (p: ParsedPresentation) => void;

  // ── Active selections ────────────────────────────────────
  activeMasterId: string | null;
  activeSlideIndex: number;
  setActiveMaster: (id: string) => void;
  setActiveSlide: (index: number) => void;

  // ── Placeholder selection ────────────────────────────────
  selectedPlaceholderIdx: number | null;
  setSelectedPlaceholder: (idx: number | null) => void;

  // ── Selection mode (pin vs area) ─────────────────────────
  selectionMode: SelectionMode;
  setSelectionMode: (mode: SelectionMode) => void;

  // ── Slides ───────────────────────────────────────────────
  slides: Slide[];
  addSlide: (codeSlideId?: string) => void;
  duplicateSlide: (index: number) => void;
  removeSlide: (index: number) => void;
  setLayoutForSlide: (slideIndex: number, layoutId: string) => void;
  setCodeSlideForSlide: (
    slideIndex: number,
    codeSlideId: string | null,
  ) => void;
  updateSlideContent: (
    slideIndex: number,
    idx: string,
    value: string,
  ) => void;

  // ── Annotations ──────────────────────────────────────────
  annotations: Annotation[];
  annotationsVisible: boolean;
  addAnnotation: (a: Omit<Annotation, "id">) => void;
  removeAnnotation: (id: string) => void;
  setAnnotationsVisible: (v: boolean) => void;

  // ── Projects ─────────────────────────────────────────────
  projects: Project[];
  activeProjectId: string | null;
  loadProjects: () => Promise<void>;
  createProject: (name: string, templateId: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  setActiveProject: (id: string | null) => void;
  addFolderToProject: (projectId: string, name: string, parentId: string | null) => Promise<void>;
  removeFolderFromProject: (projectId: string, folderId: string) => Promise<void>;
  saveSlideToProject: (projectId: string, slide: Omit<SavedSlide, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  removeSlideFromProject: (projectId: string, slideId: string) => Promise<void>;
  updateSlideInProject: (projectId: string, slideId: string, patch: Partial<SavedSlide>) => Promise<void>;

  // ── Onboarding ───────────────────────────────────────────
  onboardingDone: boolean;
  setOnboardingDone: (v: boolean) => void;

  // ── Toast ────────────────────────────────────────────────
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
  // ── Templates ────────────────────────────────────────────
  templates: [],
  activeTemplateId: null,

  loadTemplates: async () => {
    try {
      const tpls = await listTemplates();
      set({ templates: tpls });
    } catch (err) {
      console.warn("[store] loadTemplates failed:", err);
    }
  },

  addTemplate: async (tpl) => {
    try {
      await saveTemplate(tpl);
      set({ templates: [...get().templates, tpl] });
    } catch (err) {
      console.warn("[store] addTemplate failed:", err);
    }
  },

  deleteTemplate: async (id) => {
    try {
      await deleteTemplateFromDb(id);
      const next = get().templates.filter((t) => t.id !== id);
      set({ templates: next });
      if (get().activeTemplateId === id) {
        set({ activeTemplateId: null, presentation: null, slides: [], annotations: [] });
      }
    } catch (err) {
      console.warn("[store] deleteTemplate failed:", err);
    }
  },

  setActiveTemplate: (id) => {
    const tpl = get().templates.find((t) => t.id === id);
    if (!tpl) return;
    set({ activeTemplateId: id });
    get().setParsedPresentation(tpl.parsed);
  },

  // ── Parsed presentation ──────────────────────────────────
  presentation: null,
  activeMasterId: null,
  activeSlideIndex: 0,
  selectedPlaceholderIdx: null,
  selectionMode: "pin",
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
      selectedPlaceholderIdx: null,
    });
  },

  setActiveMaster: (id) => {
    const { presentation, slides, activeSlideIndex } = get();
    const newMaster = presentation?.masters.find((m) => m.id === id);
    if (!newMaster) return;
    const nextSlides = slides.map((slide, i) => {
      if (i !== activeSlideIndex) return slide;
      return {
        ...slide,
        masterId: newMaster.id,
        layoutId: newMaster.layouts[0]?.id ?? slide.layoutId,
      };
    });
    set({ activeMasterId: id, slides: nextSlides, selectedPlaceholderIdx: null });
  },

  setActiveSlide: (index) => set({ activeSlideIndex: index, selectedPlaceholderIdx: null }),
  setSelectedPlaceholder: (idx) => set({ selectedPlaceholderIdx: idx }),
  setSelectionMode: (mode) => set({ selectionMode: mode }),

  addSlide: (codeSlideId) => {
    const { presentation, activeMasterId, slides } = get();
    const master = findMaster(presentation, activeMasterId);
    const layout = master?.layouts[0];
    if (!master || !layout) return;
    const newSlide: Slide = {
      id: uid(),
      masterId: master.id,
      layoutId: layout.id,
      content: {},
      codeSlideId,
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
    const owningMaster = presentation?.masters.find((m) =>
      m.layouts.some((l) => l.id === layoutId),
    );
    if (!owningMaster) return;
    const next = slides.map((s, i) =>
      i === slideIndex
        ? { ...s, masterId: owningMaster.id, layoutId }
        : s,
    );
    set({ slides: next, selectedPlaceholderIdx: null });
  },

  setCodeSlideForSlide: (slideIndex, codeSlideId) => {
    const { slides } = get();
    const slide = slides[slideIndex];
    if (!slide) return;
    const next = slides.map((s, i) =>
      i === slideIndex
        ? { ...s, codeSlideId: codeSlideId ?? undefined }
        : s,
    );
    set({ slides: next, selectedPlaceholderIdx: null });
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

  // ── Projects ─────────────────────────────────────────────
  projects: [],
  activeProjectId: null,

  loadProjects: async () => {
    try {
      const projs = await listProjects();
      set({ projects: projs });
    } catch (err) {
      console.warn("[store] loadProjects failed:", err);
    }
  },

  createProject: async (name, templateId) => {
    const proj: Project = {
      id: uid(),
      name,
      templateId,
      folders: [],
      slides: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveProjectToDb(proj);
    set({ projects: [...get().projects, proj], activeProjectId: proj.id });
    return proj;
  },

  deleteProject: async (id) => {
    await deleteProjectFromDb(id);
    const next = get().projects.filter((p) => p.id !== id);
    set({ projects: next });
    if (get().activeProjectId === id) set({ activeProjectId: null });
  },

  setActiveProject: (id) => set({ activeProjectId: id }),

  addFolderToProject: async (projectId, name, parentId) => {
    const projs = get().projects;
    const proj = projs.find((p) => p.id === projectId);
    if (!proj) return;
    const folder: ProjectFolder = { id: uid(), name, parentId };
    const updated = { ...proj, folders: [...proj.folders, folder], updatedAt: Date.now() };
    await saveProjectToDb(updated);
    set({ projects: projs.map((p) => (p.id === projectId ? updated : p)) });
  },

  removeFolderFromProject: async (projectId, folderId) => {
    const projs = get().projects;
    const proj = projs.find((p) => p.id === projectId);
    if (!proj) return;
    // Remove folder and all children recursively
    const idsToRemove = new Set<string>();
    const collect = (id: string) => {
      idsToRemove.add(id);
      proj.folders.filter((f) => f.parentId === id).forEach((f) => collect(f.id));
    };
    collect(folderId);
    const updated = {
      ...proj,
      folders: proj.folders.filter((f) => !idsToRemove.has(f.id)),
      slides: proj.slides.filter((s) => !s.folderId || !idsToRemove.has(s.folderId)),
      updatedAt: Date.now(),
    };
    await saveProjectToDb(updated);
    set({ projects: projs.map((p) => (p.id === projectId ? updated : p)) });
  },

  saveSlideToProject: async (projectId, slideData) => {
    const projs = get().projects;
    const proj = projs.find((p) => p.id === projectId);
    if (!proj) return;
    const slide: SavedSlide = {
      ...slideData,
      id: uid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = { ...proj, slides: [...proj.slides, slide], updatedAt: Date.now() };
    await saveProjectToDb(updated);
    set({ projects: projs.map((p) => (p.id === projectId ? updated : p)) });
    get().showToast("Folie gespeichert");
  },

  removeSlideFromProject: async (projectId, slideId) => {
    const projs = get().projects;
    const proj = projs.find((p) => p.id === projectId);
    if (!proj) return;
    const updated = {
      ...proj,
      slides: proj.slides.filter((s) => s.id !== slideId),
      updatedAt: Date.now(),
    };
    await saveProjectToDb(updated);
    set({ projects: projs.map((p) => (p.id === projectId ? updated : p)) });
  },

  updateSlideInProject: async (projectId, slideId, patch) => {
    const projs = get().projects;
    const proj = projs.find((p) => p.id === projectId);
    if (!proj) return;
    const updated = {
      ...proj,
      slides: proj.slides.map((s) =>
        s.id === slideId ? { ...s, ...patch, updatedAt: Date.now() } : s,
      ),
      updatedAt: Date.now(),
    };
    await saveProjectToDb(updated);
    set({ projects: projs.map((p) => (p.id === projectId ? updated : p)) });
  },

  // ── Onboarding ───────────────────────────────────────────
  onboardingDone: localStorage.getItem("slideforge-onboarding") === "done",

  setOnboardingDone: (v) => {
    localStorage.setItem("slideforge-onboarding", v ? "done" : "");
    set({ onboardingDone: v });
  },

  // ── Toast ────────────────────────────────────────────────
  showToast: (text, kind = "success") => {
    const id = uid();
    set({ currentToast: { id, text, kind } });
    setTimeout(() => {
      if (get().currentToast?.id === id) set({ currentToast: null });
    }, 2000);
  },

  dismissToast: () => set({ currentToast: null }),
}));

// ── Helper selectors ───────────────────────────────────────
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

export function useActiveProject(): Project | undefined {
  return useSlideStore((s) =>
    s.projects.find((p) => p.id === s.activeProjectId),
  );
}
