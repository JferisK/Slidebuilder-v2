import { create } from "zustand";
import type {
  ParsedPresentation,
  SlideLayout,
  SlideMaster,
} from "@/parser/pptxParser";
import {
  PPTX_PARSER_VERSION,
  parsePptxData,
} from "@/parser/pptxParser";
import {
  listTemplates,
  saveTemplate as saveTemplateToDb,
  deleteTemplate as deleteTemplateFromDb,
  listProjects,
  saveProject as saveProjectToDb,
  deleteProject as deleteProjectFromDb,
  type StoredTemplate,
  type Project,
  type SavedSlide,
  type ProjectFolder,
} from "@/lib/templateStorage";
import { getCodeSlide } from "@/slides/registry";
import { autoMapCodeSlots } from "@/slides/mapping";
import {
  deleteProjectSlideFile,
  pickProjectDirectoryHandle,
  syncProjectSlideFile,
} from "@/lib/projectFileSystem";
import type { ContentElementMeta } from "@/hooks/useElementInstrumentation";

// ---------- Types -----------------------------------------------------------

export interface Slide {
  id: string;
  masterId: string;
  layoutId: string;
  content: Record<string, string>;
  projectSlideId?: string;
  projectSlideName?: string;
  /**
   * If set, React slots from the named code slide are rendered inside the
   * matching placeholder boxes of this slide's layout. The master is still
   * used for theming.
   */
  codeSlideId?: string;
  /**
   * Mapping from slot key (e.g. "title", "content") to placeholder idx of
   * the current layout. Editable per slide so unusual layouts (e.g. body
   * at idx 18) can host the same code slide.
   */
  codeSlotMapping?: Record<string, number>;
  /**
   * Placeholder idx values that the user has hidden for this slide
   * (e.g. page number, footer). Hidden placeholders are skipped in the
   * canvas completely.
   */
  hiddenPlaceholderIdxs?: number[];
}

export interface ContentElementIndexEntry extends ContentElementMeta {}

export type ContentElementIndex = Record<string, ContentElementIndexEntry>;

export interface ElementStyleOverride {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: number;
  borderRadius?: string;
  textAlign?: "left" | "center" | "right";
}

export type ElementStyleOverrides = Record<string, ElementStyleOverride>;

export const ELEMENT_STYLE_KEYS: ReadonlyArray<keyof ElementStyleOverride> = [
  "color",
  "backgroundColor",
  "fontSize",
  "fontWeight",
  "borderRadius",
  "textAlign",
];

export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 4;
export const ZOOM_STEP = 0.1;
const ACTIVE_PROJECT_STORAGE_KEY = "slideforge-active-project";
const ACTIVE_FOLDER_STORAGE_KEY = "slideforge-active-folder";
const ACTIVE_REPO_FOLDER_STORAGE_KEY = "slideforge-active-repo-folder";

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

  // ── Element selection (multi, by global element id) ──────
  selectedElementIds: string[];
  setSelectedElements: (ids: string[]) => void;
  toggleElementSelected: (id: string) => void;
  addElementsToSelection: (ids: string[]) => void;
  clearElementSelection: () => void;

  // ── Content-element index (per slide, built at render time) ──
  contentElementIndex: Record<string, ContentElementIndex>;
  setContentElementsForPlaceholder: (
    slideId: string,
    placeholderIdx: number,
    entries: ContentElementMeta[],
  ) => void;
  clearContentElementsForPlaceholder: (
    slideId: string,
    placeholderIdx: number,
  ) => void;
  clearContentElementsForSlide: (slideId: string) => void;

  // ── Element style overrides (in-memory live preview) ─────
  // TODO(persistence): keys include slideId (re-generated per session),
  // so survival across reloads requires keying by master/layout/placeholder.
  elementStyleOverrides: ElementStyleOverrides;
  setElementStyle: (
    id: string,
    patch: Partial<ElementStyleOverride>,
  ) => void;
  setElementStyleForMany: (
    ids: string[],
    patch: Partial<ElementStyleOverride>,
  ) => void;
  clearElementStyle: (id: string) => void;
  clearElementStylesForMany: (ids: string[]) => void;
  clearAllElementStyles: () => void;

  // ── Copilot drawer (shared open state) ───────────────────
  copilotDrawerOpen: boolean;
  copilotDrawerPrompt: string;
  openCopilotDrawer: (prompt: string) => void;
  closeCopilotDrawer: () => void;

  // ── Canvas zoom ──────────────────────────────────────────
  canvasZoom: number;
  setCanvasZoom: (z: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

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
  setCodeSlotMapping: (
    slideIndex: number,
    slotKey: string,
    placeholderIdx: number | null,
  ) => void;
  clearLayoutSlotOverrides: (slideIndex: number) => void;
  togglePlaceholderHidden: (slideIndex: number, placeholderIdx: number) => void;
  updateSlideContent: (
    slideIndex: number,
    idx: string,
    value: string,
  ) => void;

  // ── Projects ─────────────────────────────────────────────
  projects: Project[];
  activeProjectId: string | null;
  activeFolderId: string | null;
  activeRepoFolder: string | null;
  loadProjects: () => Promise<void>;
  createProject: (name: string, templateId: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  setActiveProject: (id: string | null) => void;
  setActiveFolder: (id: string | null) => void;
  setActiveRepoFolder: (folder: string | null) => void;
  pickProjectDirectory: (projectId: string) => Promise<void>;
  addFolderToProject: (projectId: string, name: string, parentId: string | null) => Promise<void>;
  removeFolderFromProject: (projectId: string, folderId: string) => Promise<void>;
  saveSlideToProject: (
    projectId: string,
    slide: Omit<SavedSlide, "id" | "createdAt" | "updatedAt">,
  ) => Promise<SavedSlide | undefined>;
  removeSlideFromProject: (projectId: string, slideId: string) => Promise<void>;
  updateSlideInProject: (projectId: string, slideId: string, patch: Partial<SavedSlide>) => Promise<void>;
  moveSlideInProject: (projectId: string, slideId: string, folderId: string | null) => Promise<void>;
  loadProjectSlideIntoActive: (projectId: string, slideId: string, slideIndex?: number) => void;

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

function getTemplateLayoutOverrides(
  templates: StoredTemplate[],
  templateId: string | null,
  layoutId: string,
): Record<string, number> | undefined {
  if (!templateId) return undefined;
  const template = templates.find((t) => t.id === templateId);
  return template?.layoutSlotOverrides?.[layoutId];
}

function resolveCodeSlotMapping(
  codeSlideId: string | null | undefined,
  layout: SlideLayout | undefined,
  existing: Record<string, number> | undefined,
  templates: StoredTemplate[],
  activeTemplateId: string | null,
): Record<string, number> | undefined {
  const codeSlide = getCodeSlide(codeSlideId);
  if (!codeSlide || !layout) return undefined;
  const layoutOverrides = getTemplateLayoutOverrides(
    templates,
    activeTemplateId,
    layout.id,
  );
  return autoMapCodeSlots(codeSlide, layout, {
    ...(existing ?? {}),
    ...(layoutOverrides ?? {}),
  });
}

function updateTemplateLayoutOverrides(
  template: StoredTemplate,
  layoutId: string,
  nextOverrides: Record<string, number> | undefined,
): StoredTemplate {
  const current = template.layoutSlotOverrides ?? {};
  const updatedLayoutSlotOverrides = { ...current };
  if (!nextOverrides || Object.keys(nextOverrides).length === 0) {
    delete updatedLayoutSlotOverrides[layoutId];
  } else {
    updatedLayoutSlotOverrides[layoutId] = nextOverrides;
  }
  return {
    ...template,
    parserVersion: PPTX_PARSER_VERSION,
    layoutSlotOverrides: updatedLayoutSlotOverrides,
  };
}

function readStoredId(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key) || null;
}

function writeStoredId(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
}

function normalizeProject(project: Project): Project {
  return {
    ...project,
    directoryHandle: project.directoryHandle ?? null,
    directoryName:
      project.directoryName ?? project.directoryHandle?.name ?? null,
  };
}

function collectFolderIds(
  folders: ProjectFolder[],
  folderId: string | null,
): Set<string> {
  const ids = new Set<string>();
  if (!folderId) return ids;
  const queue = [folderId];
  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId || ids.has(currentId)) continue;
    ids.add(currentId);
    folders
      .filter((folder) => folder.parentId === currentId)
      .forEach((folder) => queue.push(folder.id));
  }
  return ids;
}

export function getProjectSlidesForFolder(
  project: Project | undefined,
  folderId: string | null,
): SavedSlide[] {
  if (!project) return [];
  if (!folderId) {
    return [...project.slides].sort((a, b) => a.name.localeCompare(b.name));
  }
  const allowedIds = collectFolderIds(project.folders, folderId);
  return project.slides
    .filter((slide) => slide.folderId !== null && allowedIds.has(slide.folderId))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const useSlideStore = create<SlideForgeStore>((set, get) => ({
  // ── Templates ────────────────────────────────────────────
  templates: [],
  activeTemplateId: null,

  loadTemplates: async () => {
    try {
      const stored = await listTemplates();
      const upgraded = await Promise.all(
        stored.map(async (tpl) => {
          const needsReparse = tpl.parserVersion !== PPTX_PARSER_VERSION;
          if (!needsReparse) {
            return {
              ...tpl,
              layoutSlotOverrides: tpl.layoutSlotOverrides ?? {},
            };
          }
          try {
            const parsed = await parsePptxData(tpl.pptxData.slice(0));
            const nextTpl: StoredTemplate = {
              ...tpl,
              parsed,
              parserVersion: PPTX_PARSER_VERSION,
              layoutSlotOverrides: tpl.layoutSlotOverrides ?? {},
            };
            await saveTemplateToDb(nextTpl);
            return nextTpl;
          } catch (err) {
            console.warn("[store] template reparse failed:", err);
            return {
              ...tpl,
              layoutSlotOverrides: tpl.layoutSlotOverrides ?? {},
            };
          }
        }),
      );
      set({ templates: upgraded });
    } catch (err) {
      console.warn("[store] loadTemplates failed:", err);
    }
  },

  addTemplate: async (tpl) => {
    try {
      await saveTemplateToDb(tpl);
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
        set({ activeTemplateId: null, presentation: null, slides: [] });
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
  selectedElementIds: [],
  contentElementIndex: {},
  elementStyleOverrides: {},
  canvasZoom: 1,
  slides: [],
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
      selectedElementIds: [],
      elementStyleOverrides: {},
      canvasZoom: 1,
    });
  },

  setActiveMaster: (id) => {
    const {
      presentation,
      slides,
      activeSlideIndex,
      templates,
      activeTemplateId,
    } = get();
    const newMaster = presentation?.masters.find((m) => m.id === id);
    if (!newMaster) return;
    const nextSlides = slides.map((slide, i) => {
      if (i !== activeSlideIndex) return slide;
      const nextLayout = newMaster.layouts[0];
      return {
        ...slide,
        masterId: newMaster.id,
        layoutId: nextLayout?.id ?? slide.layoutId,
        codeSlotMapping: resolveCodeSlotMapping(
          slide.codeSlideId,
          nextLayout,
          slide.codeSlotMapping,
          templates,
          activeTemplateId,
        ),
      };
    });
    set({
      activeMasterId: id,
      slides: nextSlides,
      selectedElementIds: [],
      canvasZoom: 1,
    });
  },

  setActiveSlide: (index) =>
    set({ activeSlideIndex: index, selectedElementIds: [], canvasZoom: 1 }),

  setSelectedElements: (ids) => set({ selectedElementIds: ids }),
  toggleElementSelected: (id) => {
    const current = get().selectedElementIds;
    const exists = current.includes(id);
    set({
      selectedElementIds: exists
        ? current.filter((x) => x !== id)
        : [...current, id],
    });
  },
  addElementsToSelection: (ids) => {
    const current = get().selectedElementIds;
    const next = [...current];
    for (const id of ids) if (!next.includes(id)) next.push(id);
    set({ selectedElementIds: next });
  },
  clearElementSelection: () => set({ selectedElementIds: [] }),

  setContentElementsForPlaceholder: (slideId, placeholderIdx, entries) => {
    const current = get().contentElementIndex;
    const perSlide = { ...(current[slideId] ?? {}) };
    // Remove previous entries for this placeholder (by prefix).
    const prefix = `${slideId}::p${placeholderIdx}::`;
    for (const key of Object.keys(perSlide)) {
      if (key.startsWith(prefix)) delete perSlide[key];
    }
    for (const entry of entries) {
      perSlide[entry.id] = entry;
    }
    set({
      contentElementIndex: {
        ...current,
        [slideId]: perSlide,
      },
    });
  },

  clearContentElementsForPlaceholder: (slideId, placeholderIdx) => {
    const current = get().contentElementIndex;
    const perSlide = current[slideId];
    if (!perSlide) return;
    const next: ContentElementIndex = {};
    const prefix = `${slideId}::p${placeholderIdx}::`;
    for (const key of Object.keys(perSlide)) {
      if (!key.startsWith(prefix)) next[key] = perSlide[key];
    }
    set({
      contentElementIndex: {
        ...current,
        [slideId]: next,
      },
    });
  },

  clearContentElementsForSlide: (slideId) => {
    const current = get().contentElementIndex;
    if (!current[slideId]) return;
    const next = { ...current };
    delete next[slideId];
    set({ contentElementIndex: next });
  },

  setElementStyle: (id, patch) => {
    const current = get().elementStyleOverrides;
    const existing = current[id] ?? {};
    const merged: ElementStyleOverride = { ...existing };
    for (const k of ELEMENT_STYLE_KEYS) {
      if (k in patch) {
        const v = patch[k];
        if (v === undefined || v === null || v === "") {
          delete (merged as Record<string, unknown>)[k];
        } else {
          (merged as Record<string, unknown>)[k] = v;
        }
      }
    }
    const next = { ...current };
    if (Object.keys(merged).length === 0) {
      delete next[id];
    } else {
      next[id] = merged;
    }
    set({ elementStyleOverrides: next });
  },

  setElementStyleForMany: (ids, patch) => {
    if (ids.length === 0) return;
    const current = get().elementStyleOverrides;
    const next = { ...current };
    for (const id of ids) {
      const existing = next[id] ?? {};
      const merged: ElementStyleOverride = { ...existing };
      for (const k of ELEMENT_STYLE_KEYS) {
        if (k in patch) {
          const v = patch[k];
          if (v === undefined || v === null || v === "") {
            delete (merged as Record<string, unknown>)[k];
          } else {
            (merged as Record<string, unknown>)[k] = v;
          }
        }
      }
      if (Object.keys(merged).length === 0) {
        delete next[id];
      } else {
        next[id] = merged;
      }
    }
    set({ elementStyleOverrides: next });
  },

  clearElementStyle: (id) => {
    const current = get().elementStyleOverrides;
    if (!(id in current)) return;
    const next = { ...current };
    delete next[id];
    set({ elementStyleOverrides: next });
  },

  clearElementStylesForMany: (ids) => {
    if (ids.length === 0) return;
    const current = get().elementStyleOverrides;
    let changed = false;
    const next = { ...current };
    for (const id of ids) {
      if (id in next) {
        delete next[id];
        changed = true;
      }
    }
    if (changed) set({ elementStyleOverrides: next });
  },

  clearAllElementStyles: () => set({ elementStyleOverrides: {} }),

  copilotDrawerOpen: false,
  copilotDrawerPrompt: "",
  openCopilotDrawer: (prompt) =>
    set({ copilotDrawerOpen: true, copilotDrawerPrompt: prompt }),
  closeCopilotDrawer: () => set({ copilotDrawerOpen: false }),

  setCanvasZoom: (z) =>
    set({ canvasZoom: Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z)) }),
  zoomIn: () => {
    const z = get().canvasZoom;
    set({ canvasZoom: Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)) });
  },
  zoomOut: () => {
    const z = get().canvasZoom;
    set({ canvasZoom: Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)) });
  },
  resetZoom: () => set({ canvasZoom: 1 }),

  addSlide: (codeSlideId) => {
    const {
      presentation,
      activeMasterId,
      slides,
      templates,
      activeTemplateId,
    } = get();
    const master = findMaster(presentation, activeMasterId);
    const layout = master?.layouts[0];
    if (!master || !layout) return;
    const codeSlotMapping = resolveCodeSlotMapping(
      codeSlideId,
      layout,
      undefined,
      templates,
      activeTemplateId,
    );
    const newSlide: Slide = {
      id: uid(),
      masterId: master.id,
      layoutId: layout.id,
      content: {},
      codeSlideId,
      codeSlotMapping,
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
    const { slides, activeSlideIndex } = get();
    if (slides.length <= 1) return;
    const next = slides.filter((_, i) => i !== index);
    const newActive =
      activeSlideIndex >= next.length ? next.length - 1 : activeSlideIndex;
    set({
      slides: next,
      activeSlideIndex: Math.max(0, newActive),
    });
  },

  setLayoutForSlide: (slideIndex, layoutId) => {
    const { slides, presentation, templates, activeTemplateId } = get();
    const slide = slides[slideIndex];
    if (!slide) return;
    const owningMaster = presentation?.masters.find((m) =>
      m.layouts.some((l) => l.id === layoutId),
    );
    if (!owningMaster) return;
    const newLayout = owningMaster.layouts.find((l) => l.id === layoutId);
    const nextMapping = resolveCodeSlotMapping(
      slide.codeSlideId,
      newLayout,
      slide.codeSlotMapping,
      templates,
      activeTemplateId,
    );
    const next = slides.map((s, i) =>
      i === slideIndex
        ? {
            ...s,
            masterId: owningMaster.id,
            layoutId,
            codeSlotMapping: nextMapping,
          }
        : s,
    );
    set({ slides: next, selectedElementIds: [] });
  },

  setCodeSlideForSlide: (slideIndex, codeSlideId) => {
    const { slides, presentation, templates, activeTemplateId } = get();
    const slide = slides[slideIndex];
    if (!slide) return;
    const master = findMaster(presentation, slide.masterId);
    const layout = master?.layouts.find((l) => l.id === slide.layoutId);
    const mapping = resolveCodeSlotMapping(
      codeSlideId,
      layout,
      undefined,
      templates,
      activeTemplateId,
    );
    const next = slides.map((s, i) =>
      i === slideIndex
        ? {
            ...s,
            codeSlideId: codeSlideId ?? undefined,
            codeSlotMapping: mapping,
            projectSlideId: undefined,
            projectSlideName: undefined,
          }
        : s,
    );
    set({ slides: next, selectedElementIds: [] });
  },

  setCodeSlotMapping: (slideIndex, slotKey, placeholderIdx) => {
    const {
      slides,
      presentation,
      templates,
      activeTemplateId,
    } = get();
    const slide = slides[slideIndex];
    if (!slide) return;
    const current = slide.codeSlotMapping ?? {};
    const next = { ...current };
    if (placeholderIdx === null) {
      delete next[slotKey];
    } else {
      for (const key of Object.keys(next)) {
        if (next[key] === placeholderIdx) delete next[key];
      }
      next[slotKey] = placeholderIdx;
    }

    if (!activeTemplateId) {
      const updatedSlides = slides.map((s, i) =>
        i === slideIndex ? { ...s, codeSlotMapping: next } : s,
      );
      set({ slides: updatedSlides });
      return;
    }

    const activeTemplate = templates.find((t) => t.id === activeTemplateId);
    if (!activeTemplate) {
      const updatedSlides = slides.map((s, i) =>
        i === slideIndex ? { ...s, codeSlotMapping: next } : s,
      );
      set({ slides: updatedSlides });
      return;
    }

    const currentLayoutOverrides = {
      ...(activeTemplate.layoutSlotOverrides?.[slide.layoutId] ?? {}),
    };
    if (placeholderIdx === null) {
      delete currentLayoutOverrides[slotKey];
    } else {
      for (const key of Object.keys(currentLayoutOverrides)) {
        if (currentLayoutOverrides[key] === placeholderIdx) {
          delete currentLayoutOverrides[key];
        }
      }
      currentLayoutOverrides[slotKey] = placeholderIdx;
    }

    const updatedTemplate = updateTemplateLayoutOverrides(
      activeTemplate,
      slide.layoutId,
      Object.keys(currentLayoutOverrides).length > 0
        ? currentLayoutOverrides
        : undefined,
    );
    const nextTemplates = templates.map((t) =>
      t.id === updatedTemplate.id ? updatedTemplate : t,
    );
    void saveTemplateToDb(updatedTemplate).catch((err) => {
      console.warn("[store] save layout slot override failed:", err);
    });

    const updatedSlides = slides.map((s, i) => {
      if (s.layoutId !== slide.layoutId || !s.codeSlideId) {
        return i === slideIndex ? { ...s, codeSlotMapping: next } : s;
      }
      const master = findMaster(presentation, s.masterId);
      const layout = findLayout(master, s.layoutId);
      return {
        ...s,
        codeSlotMapping: resolveCodeSlotMapping(
          s.codeSlideId,
          layout,
          i === slideIndex ? next : s.codeSlotMapping,
          nextTemplates,
          activeTemplateId,
        ),
      };
    });

    set({ slides: updatedSlides, templates: nextTemplates });
  },

  clearLayoutSlotOverrides: (slideIndex) => {
    const {
      slides,
      presentation,
      templates,
      activeTemplateId,
    } = get();
    const slide = slides[slideIndex];
    if (!slide || !activeTemplateId) return;
    const activeTemplate = templates.find((t) => t.id === activeTemplateId);
    if (!activeTemplate) return;

    const updatedTemplate = updateTemplateLayoutOverrides(
      activeTemplate,
      slide.layoutId,
      undefined,
    );
    const nextTemplates = templates.map((t) =>
      t.id === updatedTemplate.id ? updatedTemplate : t,
    );
    void saveTemplateToDb(updatedTemplate).catch((err) => {
      console.warn("[store] clear layout slot overrides failed:", err);
    });

    const updatedSlides = slides.map((s) => {
      if (s.layoutId !== slide.layoutId || !s.codeSlideId) return s;
      const master = findMaster(presentation, s.masterId);
      const layout = findLayout(master, s.layoutId);
      return {
        ...s,
        codeSlotMapping: resolveCodeSlotMapping(
          s.codeSlideId,
          layout,
          undefined,
          nextTemplates,
          activeTemplateId,
        ),
      };
    });

    set({ slides: updatedSlides, templates: nextTemplates });
  },

  togglePlaceholderHidden: (slideIndex, placeholderIdx) => {
    const { slides } = get();
    const slide = slides[slideIndex];
    if (!slide) return;
    const current = slide.hiddenPlaceholderIdxs ?? [];
    const isHidden = current.includes(placeholderIdx);
    const nextList = isHidden
      ? current.filter((i) => i !== placeholderIdx)
      : [...current, placeholderIdx];
    const nextField = nextList.length > 0 ? nextList : undefined;
    const updated = slides.map((s, i) =>
      i === slideIndex ? { ...s, hiddenPlaceholderIdxs: nextField } : s,
    );
    set({ slides: updated });
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

  // ── Projects ─────────────────────────────────────────────
  projects: [],
  activeProjectId: null,
  activeFolderId: null,
  activeRepoFolder: readStoredId(ACTIVE_REPO_FOLDER_STORAGE_KEY),

  loadProjects: async () => {
    try {
      const projs = (await listProjects()).map(normalizeProject);
      const storedProjectId = readStoredId(ACTIVE_PROJECT_STORAGE_KEY);
      const nextActiveProjectId =
        (storedProjectId && projs.some((project) => project.id === storedProjectId)
          ? storedProjectId
          : projs[0]?.id) ?? null;
      const activeProject = projs.find((project) => project.id === nextActiveProjectId);
      const storedFolderId = readStoredId(ACTIVE_FOLDER_STORAGE_KEY);
      const nextActiveFolderId =
        activeProject && storedFolderId
          ? activeProject.folders.some((folder) => folder.id === storedFolderId)
            ? storedFolderId
            : null
          : null;
      const nextActiveRepoFolder =
        nextActiveProjectId === null
          ? readStoredId(ACTIVE_REPO_FOLDER_STORAGE_KEY)
          : null;

      writeStoredId(ACTIVE_PROJECT_STORAGE_KEY, nextActiveProjectId);
      writeStoredId(ACTIVE_FOLDER_STORAGE_KEY, nextActiveFolderId);
      writeStoredId(ACTIVE_REPO_FOLDER_STORAGE_KEY, nextActiveRepoFolder);
      set({
        projects: projs,
        activeProjectId: nextActiveProjectId,
        activeFolderId: nextActiveFolderId,
        activeRepoFolder: nextActiveRepoFolder,
      });
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
      directoryHandle: null,
      directoryName: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveProjectToDb(proj);
    writeStoredId(ACTIVE_PROJECT_STORAGE_KEY, proj.id);
    writeStoredId(ACTIVE_FOLDER_STORAGE_KEY, null);
    writeStoredId(ACTIVE_REPO_FOLDER_STORAGE_KEY, null);
    set({
      projects: [...get().projects, proj],
      activeProjectId: proj.id,
      activeFolderId: null,
      activeRepoFolder: null,
    });
    return proj;
  },

  deleteProject: async (id) => {
    await deleteProjectFromDb(id);
    const next = get().projects.filter((p) => p.id !== id);
    const nextActiveProjectId =
      get().activeProjectId === id ? (next[0]?.id ?? null) : get().activeProjectId;
    const nextActiveProject = next.find((project) => project.id === nextActiveProjectId);
    const currentFolderId = get().activeFolderId;
    const nextActiveFolderId =
      nextActiveProject && currentFolderId
        ? nextActiveProject.folders.some((folder) => folder.id === currentFolderId)
          ? currentFolderId
          : null
        : null;
    const nextActiveRepoFolder =
      nextActiveProjectId === null
        ? readStoredId(ACTIVE_REPO_FOLDER_STORAGE_KEY)
        : null;
    writeStoredId(ACTIVE_PROJECT_STORAGE_KEY, nextActiveProjectId);
    writeStoredId(ACTIVE_FOLDER_STORAGE_KEY, nextActiveFolderId);
    writeStoredId(ACTIVE_REPO_FOLDER_STORAGE_KEY, nextActiveRepoFolder);
    set({
      projects: next,
      activeProjectId: nextActiveProjectId,
      activeFolderId: nextActiveFolderId,
      activeRepoFolder: nextActiveRepoFolder,
    });
    if (get().activeProjectId === id) {
      const project = next.find((entry) => entry.id === nextActiveProjectId);
      if (project?.templateId) {
        get().setActiveTemplate(project.templateId);
      }
    }
  },

  setActiveProject: (id) => {
    const project = get().projects.find((entry) => entry.id === id);
    if (project?.templateId) {
      get().setActiveTemplate(project.templateId);
    }
    writeStoredId(ACTIVE_PROJECT_STORAGE_KEY, id);
    writeStoredId(ACTIVE_FOLDER_STORAGE_KEY, null);
    writeStoredId(ACTIVE_REPO_FOLDER_STORAGE_KEY, null);
    set({ activeProjectId: id, activeFolderId: null, activeRepoFolder: null });
  },

  setActiveFolder: (id) => {
    writeStoredId(ACTIVE_FOLDER_STORAGE_KEY, id);
    set({ activeFolderId: id });
  },

  setActiveRepoFolder: (folder) => {
    writeStoredId(ACTIVE_REPO_FOLDER_STORAGE_KEY, folder);
    writeStoredId(ACTIVE_PROJECT_STORAGE_KEY, null);
    writeStoredId(ACTIVE_FOLDER_STORAGE_KEY, null);
    set({
      activeRepoFolder: folder,
      activeProjectId: null,
      activeFolderId: null,
    });
  },

  pickProjectDirectory: async (projectId) => {
    const project = get().projects.find((entry) => entry.id === projectId);
    if (!project) return;
    const directoryHandle = await pickProjectDirectoryHandle();
    const updated = normalizeProject({
      ...project,
      directoryHandle,
      directoryName: directoryHandle.name,
      updatedAt: Date.now(),
    });
    await saveProjectToDb(updated);
    set({
      projects: get().projects.map((entry) =>
        entry.id === projectId ? updated : entry,
      ),
    });
  },

  addFolderToProject: async (projectId, name, parentId) => {
    const projs = get().projects;
    const proj = projs.find((p) => p.id === projectId);
    if (!proj) return;
    const folder: ProjectFolder = { id: uid(), name, parentId };
    const updated = normalizeProject({
      ...proj,
      folders: [...proj.folders, folder],
      updatedAt: Date.now(),
    });
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
    const removedSlides = proj.slides.filter(
      (slide) => slide.folderId !== null && idsToRemove.has(slide.folderId),
    );
    const updated = normalizeProject({
      ...proj,
      folders: proj.folders.filter((f) => !idsToRemove.has(f.id)),
      slides: proj.slides.filter((s) => !s.folderId || !idsToRemove.has(s.folderId)),
      updatedAt: Date.now(),
    });
    if (proj.directoryHandle) {
      for (const slide of removedSlides) {
        await deleteProjectSlideFile(proj, slide);
      }
    }
    await saveProjectToDb(updated);
    set({ projects: projs.map((p) => (p.id === projectId ? updated : p)) });
    if (get().activeProjectId === projectId && idsToRemove.has(get().activeFolderId ?? "")) {
      writeStoredId(ACTIVE_FOLDER_STORAGE_KEY, null);
      set({ activeFolderId: null });
    }
  },

  saveSlideToProject: async (projectId, slideData) => {
    const projs = get().projects;
    const proj = projs.find((p) => p.id === projectId);
    if (!proj) return undefined;
    const slide: SavedSlide = {
      ...slideData,
      id: uid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const fileSync = slide.reactCode
      ? await syncProjectSlideFile(proj, null, slide)
      : null;
    if (fileSync) {
      slide.fileName = fileSync.fileName;
      slide.relativePath = fileSync.relativePath;
    }
    const updated = normalizeProject({
      ...proj,
      slides: [...proj.slides, slide],
      updatedAt: Date.now(),
    });
    await saveProjectToDb(updated);
    set({ projects: projs.map((p) => (p.id === projectId ? updated : p)) });
    get().showToast("Folie gespeichert");
    return slide;
  },

  removeSlideFromProject: async (projectId, slideId) => {
    const projs = get().projects;
    const proj = projs.find((p) => p.id === projectId);
    if (!proj) return;
    const slide = proj.slides.find((entry) => entry.id === slideId);
    if (slide && proj.directoryHandle) {
      await deleteProjectSlideFile(proj, slide);
    }
    const updated = normalizeProject({
      ...proj,
      slides: proj.slides.filter((s) => s.id !== slideId),
      updatedAt: Date.now(),
    });
    await saveProjectToDb(updated);
    set({ projects: projs.map((p) => (p.id === projectId ? updated : p)) });
  },

  updateSlideInProject: async (projectId, slideId, patch) => {
    const projs = get().projects;
    const proj = projs.find((p) => p.id === projectId);
    if (!proj) return;
    const currentSlide = proj.slides.find((slide) => slide.id === slideId);
    if (!currentSlide) return;
    const nextSlide: SavedSlide = {
      ...currentSlide,
      ...patch,
      updatedAt: Date.now(),
    };
    const fileSync = nextSlide.reactCode
      ? await syncProjectSlideFile(proj, currentSlide, nextSlide)
      : null;
    if (fileSync) {
      nextSlide.fileName = fileSync.fileName;
      nextSlide.relativePath = fileSync.relativePath;
    }
    const updated = normalizeProject({
      ...proj,
      slides: proj.slides.map((slide) =>
        slide.id === slideId ? nextSlide : slide,
      ),
      updatedAt: Date.now(),
    });
    await saveProjectToDb(updated);
    set({ projects: projs.map((p) => (p.id === projectId ? updated : p)) });
  },

  moveSlideInProject: async (projectId, slideId, folderId) => {
    await get().updateSlideInProject(projectId, slideId, { folderId });
  },

  loadProjectSlideIntoActive: (projectId, slideId, slideIndex) => {
    const { projects, slides, activeSlideIndex } = get();
    const project = projects.find((entry) => entry.id === projectId);
    const projectSlide = project?.slides.find((entry) => entry.id === slideId);
    const targetIndex = slideIndex ?? activeSlideIndex;
    if (!project || !projectSlide || !slides[targetIndex]) return;

    const nextSlides = slides.map((slide, index) =>
      index === targetIndex
        ? {
            ...slide,
            masterId: projectSlide.masterId,
            layoutId: projectSlide.layoutId,
            content: { ...projectSlide.content },
            projectSlideId: projectSlide.id,
            projectSlideName: projectSlide.name,
            codeSlideId: undefined,
            codeSlotMapping: undefined,
            hiddenPlaceholderIdxs: undefined,
          }
        : slide,
    );

    set({
      slides: nextSlides,
      activeSlideIndex: targetIndex,
      activeMasterId: projectSlide.masterId,
      selectedElementIds: [],
      canvasZoom: 1,
    });
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
