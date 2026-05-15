/**
 * IndexedDB layer for persisting uploaded PPTX templates and project data.
 * Works entirely in the browser — no backend needed.
 */

import type { ParsedPresentation } from "@/parser/pptxParser";

const DB_NAME = "slideforge";
const DB_VERSION = 2;
const TEMPLATES_STORE = "templates";
const PROJECTS_STORE = "projects";

// ---------- Types -----------------------------------------------------------

export type BrandGuideSource = "copilot" | "claude" | "manual";

export interface BrandGuideRecord {
  masterId: string;
  templateId: string;
  markdown: string;
  generatedAt: number;
  source: BrandGuideSource;
  inputSummary?: string;
}

export interface StoredTemplate {
  id: string;
  name: string;
  fileName: string;
  uploadedAt: number;
  parserVersion?: number;
  pptxData: ArrayBuffer;
  parsed: ParsedPresentation;
  layoutSlotOverrides?: Record<string, Record<string, number>>;
  brandGuides?: Record<string, BrandGuideRecord>;
}

export interface ProjectFolder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface SavedSlide {
  id: string;
  folderId: string | null;
  name: string;
  masterId: string;
  layoutId: string;
  content: Record<string, string>;
  reactCode?: string;
  fileName?: string;
  relativePath?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  templateId: string;
  folders: ProjectFolder[];
  slides: SavedSlide[];
  directoryHandle?: FileSystemDirectoryHandle | null;
  directoryName?: string | null;
  createdAt: number;
  updatedAt: number;
}

// ---------- DB init ---------------------------------------------------------

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(TEMPLATES_STORE)) {
        db.createObjectStore(TEMPLATES_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
        db.createObjectStore(PROJECTS_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(
  db: IDBDatabase,
  store: string,
  mode: IDBTransactionMode,
): IDBObjectStore {
  return db.transaction(store, mode).objectStore(store);
}

function wrap<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ---------- Template CRUD ---------------------------------------------------

export async function saveTemplate(tpl: StoredTemplate): Promise<void> {
  const db = await openDb();
  await wrap(tx(db, TEMPLATES_STORE, "readwrite").put(tpl));
}

export async function getTemplate(
  id: string,
): Promise<StoredTemplate | undefined> {
  const db = await openDb();
  return wrap(tx(db, TEMPLATES_STORE, "readonly").get(id));
}

export async function listTemplates(): Promise<StoredTemplate[]> {
  const db = await openDb();
  return wrap(tx(db, TEMPLATES_STORE, "readonly").getAll());
}

export async function deleteTemplate(id: string): Promise<void> {
  const db = await openDb();
  await wrap(tx(db, TEMPLATES_STORE, "readwrite").delete(id));
}

// ---------- Project CRUD ----------------------------------------------------

export async function saveProject(proj: Project): Promise<void> {
  const db = await openDb();
  await wrap(tx(db, PROJECTS_STORE, "readwrite").put(proj));
}

export async function getProject(id: string): Promise<Project | undefined> {
  const db = await openDb();
  return wrap(tx(db, PROJECTS_STORE, "readonly").get(id));
}

export async function listProjects(): Promise<Project[]> {
  const db = await openDb();
  return wrap(tx(db, PROJECTS_STORE, "readonly").getAll());
}

export async function deleteProject(id: string): Promise<void> {
  const db = await openDb();
  await wrap(tx(db, PROJECTS_STORE, "readwrite").delete(id));
}
