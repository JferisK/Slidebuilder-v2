import * as React from "react";
import {
  FolderPlus,
  FolderOpen,
  Trash2,
  ChevronRight,
  ChevronDown,
  FileCode2,
  Plus,
  X,
  FolderCog,
} from "lucide-react";
import {
  getProjectSlidesForFolder,
  useActiveProject,
  useActiveSlide,
  useSlideStore,
  type Project,
  type ProjectFolder,
  type SavedSlide,
} from "@/store/slideStore";
import {
  FILE_SYSTEM_ACCESS_SUPPORTED,
  getProjectSlideRelativePath,
} from "@/lib/projectFileSystem";
import { getRepoSlideFolders } from "@/slides/sourceInventory";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

const ROOT_FOLDER_VALUE = "__root__";

function getRepoFolderLabel(folderName: string) {
  if (folderName === "templates") return "template";
  return folderName;
}

function flattenFolderOptions(
  folders: ProjectFolder[],
  parentId: string | null = null,
  depth = 0,
): Array<{ value: string; label: string }> {
  return folders
    .filter((folder) => folder.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((folder) => [
      {
        value: folder.id,
        label: `${"· ".repeat(depth)}${folder.name}`,
      },
      ...flattenFolderOptions(folders, folder.id, depth + 1),
    ]);
}

const NewProjectInline: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [name, setName] = React.useState("");
  const templates = useSlideStore((s) => s.templates);
  const activeTemplateId = useSlideStore((s) => s.activeTemplateId);
  const createProject = useSlideStore((s) => s.createProject);
  const showToast = useSlideStore((s) => s.showToast);

  const templateId = activeTemplateId ?? templates[0]?.id ?? "";

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!templateId) {
      showToast("Bitte erst ein Template hochladen", "error");
      return;
    }
    await createProject(trimmed, templateId);
    showToast(`Projekt "${trimmed}" erstellt`);
    onDone();
  };

  return (
    <div className="flex gap-1">
      <Input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Projektname"
        onKeyDown={(e) => e.key === "Enter" && void submit()}
        className="flex-1"
      />
      <Button size="sm" onClick={() => void submit()}>
        <Plus size={12} />
      </Button>
      <Button variant="ghost" size="sm" onClick={onDone}>
        <X size={12} />
      </Button>
    </div>
  );
};

const SlideMovePicker: React.FC<{
  project: Project;
  slide: SavedSlide;
  depth: number;
  onDone: () => void;
}> = ({ project, slide, depth, onDone }) => {
  const moveSlide = useSlideStore((s) => s.moveSlideInProject);
  const showToast = useSlideStore((s) => s.showToast);
  const folderOptions = React.useMemo(
    () => [
      { value: ROOT_FOLDER_VALUE, label: "Projektwurzel" },
      ...flattenFolderOptions(project.folders),
    ],
    [project.folders],
  );

  const handleMove = async (value: string) => {
    try {
      await moveSlide(
        project.id,
        slide.id,
        value === ROOT_FOLDER_VALUE ? null : value,
      );
      showToast(`"${slide.name}" verschoben`);
      onDone();
    } catch (err) {
      console.error(err);
      showToast("Verschieben fehlgeschlagen", "error");
    }
  };

  return (
    <div
      className="pt-1"
      style={{ paddingLeft: (depth + 1) * 12 }}
      onClick={(e) => e.stopPropagation()}
    >
      <select
        autoFocus
        value={slide.folderId ?? ROOT_FOLDER_VALUE}
        onChange={(e) => void handleMove(e.target.value)}
        className="flex h-7 w-full appearance-none rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-2 text-[10px] text-[var(--app-text)]"
      >
        {folderOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const ProjectSlideItem: React.FC<{
  slide: SavedSlide;
  project: Project;
  depth: number;
}> = ({ slide, project, depth }) => {
  const activeSlide = useActiveSlide();
  const loadProjectSlide = useSlideStore((s) => s.loadProjectSlideIntoActive);
  const removeSlide = useSlideStore((s) => s.removeSlideFromProject);
  const showToast = useSlideStore((s) => s.showToast);
  const [moving, setMoving] = React.useState(false);

  const isLoaded = activeSlide?.projectSlideId === slide.id;
  const relativePath = slide.relativePath ?? getProjectSlideRelativePath(project, slide);

  const handleRemove = async () => {
    try {
      await removeSlide(project.id, slide.id);
      showToast(`"${slide.name}" entfernt`);
    } catch (err) {
      console.error(err);
      showToast("Löschen fehlgeschlagen", "error");
    }
  };

  return (
    <div style={{ paddingLeft: depth * 12 }}>
      <div
        className={`group flex items-center gap-1 rounded px-1 py-0.5 text-xs transition-colors ${
          isLoaded
            ? "bg-[rgba(59,130,246,0.12)] text-[var(--app-accent)]"
            : "hover:bg-[var(--app-surface)]"
        }`}
        onClick={() => loadProjectSlide(project.id, slide.id)}
      >
        <FileCode2 size={11} className="text-[var(--app-muted)]" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{slide.name}.tsx</div>
          <div className="truncate font-mono text-[9px] text-[var(--app-muted)]">
            {relativePath || "Projektwurzel"}
          </div>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            title="Verschieben"
            onClick={(e) => {
              e.stopPropagation();
              setMoving((value) => !value);
            }}
            className="flex h-4 w-4 items-center justify-center text-[var(--app-muted)] hover:text-[var(--app-text)]"
          >
            <FolderCog size={10} />
          </button>
          <button
            type="button"
            title="Folie löschen"
            onClick={(e) => {
              e.stopPropagation();
              void handleRemove();
            }}
            className="flex h-4 w-4 items-center justify-center text-[var(--app-muted)] hover:text-[var(--app-destructive)]"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>
      {moving && (
        <SlideMovePicker
          project={project}
          slide={slide}
          depth={depth}
          onDone={() => setMoving(false)}
        />
      )}
    </div>
  );
};

const FolderItem: React.FC<{
  folder: ProjectFolder;
  project: Project;
  depth: number;
  activeFolderId: string | null;
}> = ({ folder, project, depth, activeFolderId }) => {
  const [open, setOpen] = React.useState(true);
  const [addingFolder, setAddingFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const addFolder = useSlideStore((s) => s.addFolderToProject);
  const removeFolder = useSlideStore((s) => s.removeFolderFromProject);
  const setActiveFolder = useSlideStore((s) => s.setActiveFolder);
  const showToast = useSlideStore((s) => s.showToast);

  const subFolders = project.folders
    .filter((entry) => entry.parentId === folder.id)
    .sort((a, b) => a.name.localeCompare(b.name));
  const subSlides = project.slides
    .filter((slide) => slide.folderId === folder.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleAddFolder = async () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    try {
      await addFolder(project.id, trimmed, folder.id);
      setNewFolderName("");
      setAddingFolder(false);
      showToast(`Ordner "${trimmed}" erstellt`);
    } catch (err) {
      console.error(err);
      showToast("Ordner konnte nicht erstellt werden", "error");
    }
  };

  const handleRemoveFolder = async () => {
    try {
      await removeFolder(project.id, folder.id);
      showToast(`Ordner "${folder.name}" gelöscht`);
    } catch (err) {
      console.error(err);
      showToast("Ordner konnte nicht gelöscht werden", "error");
    }
  };

  return (
    <div style={{ paddingLeft: depth * 12 }}>
      <div
        className={`group flex items-center gap-1 rounded px-1 py-0.5 text-xs transition-colors ${
          activeFolderId === folder.id
            ? "bg-[rgba(59,130,246,0.12)] text-[var(--app-accent)]"
            : "hover:bg-[var(--app-surface)]"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-4 w-4 items-center justify-center text-[var(--app-muted)]"
        >
          {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
        </button>
        <button
          type="button"
          onClick={() => setActiveFolder(folder.id)}
          className="flex min-w-0 flex-1 items-center gap-1 text-left"
        >
          <FolderOpen size={12} className="text-[var(--app-accent)]" />
          <span className="truncate">{folder.name}</span>
        </button>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            title="Unterordner"
            onClick={() => setAddingFolder(true)}
            className="flex h-4 w-4 items-center justify-center text-[var(--app-muted)] hover:text-[var(--app-text)]"
          >
            <FolderPlus size={10} />
          </button>
          <button
            type="button"
            title="Ordner löschen"
            onClick={() => void handleRemoveFolder()}
            className="flex h-4 w-4 items-center justify-center text-[var(--app-muted)] hover:text-[var(--app-destructive)]"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {open && (
        <>
          {addingFolder && (
            <div
              className="flex gap-1 py-0.5"
              style={{ paddingLeft: (depth + 1) * 12 }}
            >
              <Input
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Ordnername"
                onKeyDown={(e) => e.key === "Enter" && void handleAddFolder()}
                className="h-6 flex-1 text-[10px]"
              />
              <Button
                size="icon"
                className="h-6 w-6"
                onClick={() => void handleAddFolder()}
              >
                <Plus size={10} />
              </Button>
            </div>
          )}
          {subFolders.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              project={project}
              depth={depth + 1}
              activeFolderId={activeFolderId}
            />
          ))}
          {subSlides.map((slide) => (
            <ProjectSlideItem
              key={slide.id}
              slide={slide}
              project={project}
              depth={depth + 1}
            />
          ))}
        </>
      )}
    </div>
  );
};

export const ProjectManager: React.FC = () => {
  const projects = useSlideStore((s) => s.projects);
  const activeProjectId = useSlideStore((s) => s.activeProjectId);
  const activeFolderId = useSlideStore((s) => s.activeFolderId);
  const activeRepoFolder = useSlideStore((s) => s.activeRepoFolder);
  const setActiveProject = useSlideStore((s) => s.setActiveProject);
  const setActiveRepoFolder = useSlideStore((s) => s.setActiveRepoFolder);
  const deleteProject = useSlideStore((s) => s.deleteProject);
  const addFolder = useSlideStore((s) => s.addFolderToProject);
  const setActiveFolder = useSlideStore((s) => s.setActiveFolder);
  const pickProjectDirectory = useSlideStore((s) => s.pickProjectDirectory);
  const showToast = useSlideStore((s) => s.showToast);
  const activeProject = useActiveProject();

  const [creating, setCreating] = React.useState(false);
  const [addingRootFolder, setAddingRootFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const repoSlideFolders = React.useMemo(() => getRepoSlideFolders(), []);

  const scopedSlides = React.useMemo(
    () => getProjectSlidesForFolder(activeProject, activeFolderId),
    [activeProject, activeFolderId],
  );
  const sourceSelectValue = activeProjectId
    ? `project:${activeProjectId}`
    : activeRepoFolder
      ? `repo:${activeRepoFolder}`
      : "";
  const sourceOptions = React.useMemo(
    () => [
      ...repoSlideFolders.map((folderName) => ({
        value: `repo:${folderName}`,
        label: getRepoFolderLabel(folderName),
      })),
      ...projects.map((project) => ({
        value: `project:${project.id}`,
        label: project.name,
      })),
    ],
    [projects, repoSlideFolders],
  );

  React.useEffect(() => {
    if (activeProject || activeRepoFolder || repoSlideFolders.length === 0) return;
    setActiveRepoFolder(repoSlideFolders[0]);
  }, [activeProject, activeRepoFolder, repoSlideFolders, setActiveRepoFolder]);

  const handleAddRootFolder = async () => {
    if (!activeProject) return;
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    try {
      await addFolder(activeProject.id, trimmed, null);
      setNewFolderName("");
      setAddingRootFolder(false);
      showToast(`Ordner "${trimmed}" erstellt`);
    } catch (err) {
      console.error(err);
      showToast("Ordner konnte nicht erstellt werden", "error");
    }
  };

  const handleDeleteProject = async () => {
    if (!activeProject) return;
    try {
      await deleteProject(activeProject.id);
      showToast(`Projekt "${activeProject.name}" gelöscht`);
    } catch (err) {
      console.error(err);
      showToast("Projekt konnte nicht gelöscht werden", "error");
    }
  };

  const handlePickDirectory = async () => {
    if (!activeProject) return;
    try {
      await pickProjectDirectory(activeProject.id);
      showToast("Projektordner verknüpft");
    } catch (err) {
      console.error(err);
      showToast(
        err instanceof Error ? err.message : "Projektordner konnte nicht geöffnet werden",
        "error",
      );
    }
  };

  const handleSourceChange = (value: string) => {
    if (!value) {
      setActiveProject(null);
      setActiveRepoFolder(null);
      return;
    }
    if (value.startsWith("repo:")) {
      setActiveRepoFolder(value.slice("repo:".length));
      return;
    }
    if (value.startsWith("project:")) {
      setActiveProject(value.slice("project:".length));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <select
          value={sourceSelectValue}
          onChange={(e) => handleSourceChange(e.target.value)}
          className="flex h-7 flex-1 appearance-none rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-2 text-xs text-[var(--app-text)]"
        >
          <option value="">– Ordner wählen –</option>
          {sourceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button size="icon" variant="secondary" onClick={() => setCreating(true)}>
          <Plus size={12} />
        </Button>
        {activeProject && (
          <Button
            size="icon"
            variant="destructive"
            onClick={() => void handleDeleteProject()}
          >
            <Trash2 size={12} />
          </Button>
        )}
      </div>

      {creating && <NewProjectInline onDone={() => setCreating(false)} />}

      {activeProject && (
        <>
          <div className="rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--app-muted)]">
                  Projektordner
                </div>
                <div className="text-[11px] text-[var(--app-text)]">
                  {activeProject.directoryName ?? "Noch nicht verknüpft"}
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => void handlePickDirectory()}
                disabled={!FILE_SYSTEM_ACCESS_SUPPORTED}
              >
                <FolderOpen size={12} />
                {activeProject.directoryHandle ? "Neu wählen" : "Ordner wählen"}
              </Button>
            </div>
            <div className="mt-1 text-[10px] text-[var(--app-muted)]">
              {FILE_SYSTEM_ACCESS_SUPPORTED
                ? "Slides werden als echte .tsx-Dateien in diesem Ordner und seinen Unterordnern gespeichert."
                : "Dieser Browser unterstützt keine direkte Ordnerbearbeitung."}
            </div>
          </div>

          <ScrollArea className="max-h-56 rounded border border-[var(--app-border)] bg-[var(--app-surface)] p-1">
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => setActiveFolder(null)}
                className={`flex items-center gap-1 rounded px-1 py-0.5 text-xs text-left transition-colors ${
                  activeFolderId === null
                    ? "bg-[rgba(59,130,246,0.12)] text-[var(--app-accent)]"
                    : "hover:bg-[var(--app-panel)]"
                }`}
              >
                <FolderOpen size={12} className="text-[var(--app-accent)]" />
                <span className="truncate">Projektwurzel</span>
              </button>

              {activeProject.slides
                .filter((slide) => slide.folderId === null)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((slide) => (
                  <ProjectSlideItem
                    key={slide.id}
                    slide={slide}
                    project={activeProject}
                    depth={1}
                  />
                ))}

              {activeProject.folders
                .filter((folder) => folder.parentId === null)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((folder) => (
                  <FolderItem
                    key={folder.id}
                    folder={folder}
                    project={activeProject}
                    depth={0}
                    activeFolderId={activeFolderId}
                  />
                ))}

              {addingRootFolder && (
                <div className="flex gap-1 py-0.5">
                  <Input
                    autoFocus
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Ordnername"
                    onKeyDown={(e) => e.key === "Enter" && void handleAddRootFolder()}
                    className="h-6 flex-1 text-[10px]"
                  />
                  <Button
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => void handleAddRootFolder()}
                  >
                    <Plus size={10} />
                  </Button>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAddingRootFolder(true)}
                className="w-full justify-start text-[var(--app-muted)]"
              >
                <FolderPlus size={12} /> Neuer Ordner
              </Button>
            </div>
          </ScrollArea>

          <div className="rounded border border-[var(--app-border)] bg-[#0a0a0a] px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-wider text-[var(--app-muted)]">
              Aktueller Filter
            </div>
            <div className="mt-0.5 text-[10px] text-[var(--app-text)]">
              {activeFolderId
                ? `${scopedSlides.length} Slides im gewählten Ordner inkl. Unterordnern`
                : `${scopedSlides.length} Slides im gesamten Projekt`}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
