import type { Project, ProjectFolder, SavedSlide } from "./templateStorage";

export const FILE_SYSTEM_ACCESS_SUPPORTED =
  typeof window !== "undefined" && "showDirectoryPicker" in window;

type FileSystemPermissionMode = "read" | "readwrite";
type FileSystemPermissionHandle = FileSystemHandle & {
  queryPermission?: (descriptor: {
    mode: FileSystemPermissionMode;
  }) => Promise<PermissionState>;
  requestPermission?: (descriptor: {
    mode: FileSystemPermissionMode;
  }) => Promise<PermissionState>;
};
type AsyncDirectoryValues = AsyncIterable<FileSystemHandle>;

export interface DirectoryEntryInfo {
  kind: "file" | "directory";
  name: string;
}

export function sanitizePathSegment(value: string): string {
  const cleaned = value
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\.+$/g, "")
    .trim();
  return cleaned.replace(/\s+/g, "-") || "slide";
}

export function getFolderChain(
  folders: ProjectFolder[],
  folderId: string | null,
): ProjectFolder[] {
  if (!folderId) return [];
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const chain: ProjectFolder[] = [];
  let current = byId.get(folderId) ?? null;
  while (current) {
    chain.unshift(current);
    current = current.parentId ? byId.get(current.parentId) ?? null : null;
  }
  return chain;
}

export function getFolderPathSegments(
  folders: ProjectFolder[],
  folderId: string | null,
): string[] {
  return getFolderChain(folders, folderId).map((folder) =>
    sanitizePathSegment(folder.name),
  );
}

export function getProjectSlideRelativePath(
  project: Project,
  slide: Pick<SavedSlide, "folderId" | "name">,
): string {
  const segments = getFolderPathSegments(project.folders, slide.folderId);
  const fileName = `${sanitizePathSegment(slide.name)}.tsx`;
  return [...segments, fileName].join("/");
}

async function ensurePermission(
  handle: FileSystemHandle,
  mode: FileSystemPermissionMode,
): Promise<boolean> {
  const permissionHandle = handle as FileSystemPermissionHandle;
  if (
    typeof permissionHandle.queryPermission !== "function" ||
    typeof permissionHandle.requestPermission !== "function"
  ) {
    return true;
  }
  const opts = { mode };
  if ((await permissionHandle.queryPermission(opts)) === "granted") return true;
  return (await permissionHandle.requestPermission(opts)) === "granted";
}

export async function pickProjectDirectoryHandle(): Promise<FileSystemDirectoryHandle> {
  if (!FILE_SYSTEM_ACCESS_SUPPORTED) {
    throw new Error("Die File System Access API ist in diesem Browser nicht verfügbar.");
  }
  const picker = (
    window as typeof window & {
      showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
    }
  ).showDirectoryPicker;
  if (!picker) {
    throw new Error("showDirectoryPicker ist nicht verfügbar.");
  }
  const handle = await picker();
  const granted = await ensurePermission(handle, "readwrite");
  if (!granted) {
    throw new Error("Schreibzugriff auf den Projektordner wurde nicht erlaubt.");
  }
  return handle;
}

export async function ensureProjectDirectoryAccess(
  handle: FileSystemDirectoryHandle | null | undefined,
): Promise<FileSystemDirectoryHandle> {
  if (!handle) {
    throw new Error("Kein Projektordner ausgewählt.");
  }
  const granted = await ensurePermission(handle, "readwrite");
  if (!granted) {
    throw new Error("Schreibzugriff auf den Projektordner wurde nicht erlaubt.");
  }
  return handle;
}

export async function listDirectoryEntries(
  handle: FileSystemDirectoryHandle | null | undefined,
): Promise<DirectoryEntryInfo[]> {
  const directory = await ensureProjectDirectoryAccess(handle);
  const values = (directory as FileSystemDirectoryHandle & {
    values?: () => AsyncDirectoryValues;
  }).values;
  if (typeof values !== "function") {
    throw new Error("Der Browser kann Verzeichniseinträge nicht auflisten.");
  }

  const entries: DirectoryEntryInfo[] = [];
  for await (const entry of values.call(directory)) {
    entries.push({
      kind: entry.kind,
      name: entry.name,
    });
  }

  return entries.sort((a, b) => {
    if (a.kind !== b.kind) {
      return a.kind === "directory" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

export async function ensureDirectoryPath(
  root: FileSystemDirectoryHandle,
  segments: string[],
): Promise<FileSystemDirectoryHandle> {
  let current = root;
  for (const segment of segments) {
    current = await current.getDirectoryHandle(segment, { create: true });
  }
  return current;
}

async function removeFileIfExists(
  root: FileSystemDirectoryHandle,
  relativePath: string | null | undefined,
): Promise<void> {
  if (!relativePath) return;
  const segments = relativePath.split("/").filter(Boolean);
  const fileName = segments.pop();
  if (!fileName) return;
  let current = root;
  for (const segment of segments) {
    try {
      current = await current.getDirectoryHandle(segment);
    } catch {
      return;
    }
  }
  try {
    await current.removeEntry(fileName);
  } catch {
    // If the file is already gone, keep the project metadata cleanup flowing.
  }
}

export async function writeProjectSlideFile(
  project: Project,
  slide: Pick<SavedSlide, "folderId" | "name" | "reactCode">,
): Promise<{ fileName: string; relativePath: string }> {
  const root = await ensureProjectDirectoryAccess(project.directoryHandle);
  const folderSegments = getFolderPathSegments(project.folders, slide.folderId);
  const dir = await ensureDirectoryPath(root, folderSegments);
  const fileName = `${sanitizePathSegment(slide.name)}.tsx`;
  const fileHandle = await dir.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(slide.reactCode ?? "");
  await writable.close();
  return {
    fileName,
    relativePath: [...folderSegments, fileName].join("/"),
  };
}

export async function deleteProjectSlideFile(
  project: Project,
  slide: Pick<SavedSlide, "relativePath">,
): Promise<void> {
  const root = await ensureProjectDirectoryAccess(project.directoryHandle);
  await removeFileIfExists(root, slide.relativePath);
}

export async function syncProjectSlideFile(
  project: Project,
  previousSlide: Pick<
    SavedSlide,
    "folderId" | "name" | "reactCode" | "relativePath"
  > | null,
  nextSlide: Pick<SavedSlide, "folderId" | "name" | "reactCode">,
): Promise<{ fileName: string; relativePath: string } | null> {
  if (!project.directoryHandle) return null;
  const writeResult = await writeProjectSlideFile(project, nextSlide);
  if (previousSlide?.relativePath && previousSlide.relativePath !== writeResult.relativePath) {
    const root = await ensureProjectDirectoryAccess(project.directoryHandle);
    await removeFileIfExists(root, previousSlide.relativePath);
  }
  return writeResult;
}
