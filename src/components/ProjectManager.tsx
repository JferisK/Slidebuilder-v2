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
} from "lucide-react";
import {
  useSlideStore,
  useActiveProject,
  type Project,
  type ProjectFolder,
  type SavedSlide,
} from "@/store/slideStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

// ── New project dialog ─────────────────────────────────────
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
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className="flex-1"
      />
      <Button size="sm" onClick={submit}>
        <Plus size={12} />
      </Button>
      <Button variant="ghost" size="sm" onClick={onDone}>
        <X size={12} />
      </Button>
    </div>
  );
};

// ── Folder tree item ───────────────────────────────────────
const FolderItem: React.FC<{
  folder: ProjectFolder;
  project: Project;
  depth: number;
  slides: SavedSlide[];
  childFolders: ProjectFolder[];
  allFolders: ProjectFolder[];
  allSlides: SavedSlide[];
}> = ({ folder, project, depth, slides, childFolders, allFolders, allSlides }) => {
  const [open, setOpen] = React.useState(true);
  const [addingFolder, setAddingFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const addFolder = useSlideStore((s) => s.addFolderToProject);
  const removeFolder = useSlideStore((s) => s.removeFolderFromProject);
  const removeSlide = useSlideStore((s) => s.removeSlideFromProject);

  const handleAddFolder = async () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    await addFolder(project.id, trimmed, folder.id);
    setNewFolderName("");
    setAddingFolder(false);
  };

  const subFolders = allFolders.filter((f) => f.parentId === folder.id);
  const subSlides = allSlides.filter((s) => s.folderId === folder.id);

  return (
    <div style={{ paddingLeft: depth * 12 }}>
      <div className="group flex items-center gap-1 rounded px-1 py-0.5 text-xs hover:bg-[var(--app-surface)]">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-4 w-4 items-center justify-center text-[var(--app-muted)]"
        >
          {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
        </button>
        <FolderOpen size={12} className="text-[var(--app-accent)]" />
        <span className="flex-1 truncate text-[var(--app-text)]">
          {folder.name}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
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
            onClick={() => removeFolder(project.id, folder.id)}
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
                onKeyDown={(e) => e.key === "Enter" && handleAddFolder()}
                className="h-6 flex-1 text-[10px]"
              />
              <Button size="icon" className="h-6 w-6" onClick={handleAddFolder}>
                <Plus size={10} />
              </Button>
            </div>
          )}
          {subFolders.map((cf) => (
            <FolderItem
              key={cf.id}
              folder={cf}
              project={project}
              depth={depth + 1}
              slides={subSlides}
              childFolders={allFolders.filter((f) => f.parentId === cf.id)}
              allFolders={allFolders}
              allSlides={allSlides}
            />
          ))}
          {subSlides.map((s) => (
            <div
              key={s.id}
              className="group flex items-center gap-1 rounded px-1 py-0.5 text-xs hover:bg-[var(--app-surface)]"
              style={{ paddingLeft: (depth + 1) * 12 }}
            >
              <FileCode2 size={11} className="text-[var(--app-muted)]" />
              <span className="flex-1 truncate text-[var(--app-text)]">
                {s.name}.tsx
              </span>
              <button
                type="button"
                onClick={() => removeSlide(project.id, s.id)}
                className="flex h-4 w-4 items-center justify-center opacity-0 group-hover:opacity-100 text-[var(--app-muted)] hover:text-[var(--app-destructive)]"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────
export const ProjectManager: React.FC = () => {
  const projects = useSlideStore((s) => s.projects);
  const activeProjectId = useSlideStore((s) => s.activeProjectId);
  const setActiveProject = useSlideStore((s) => s.setActiveProject);
  const deleteProject = useSlideStore((s) => s.deleteProject);
  const addFolder = useSlideStore((s) => s.addFolderToProject);
  const activeProject = useActiveProject();

  const [creating, setCreating] = React.useState(false);
  const [addingRootFolder, setAddingRootFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");

  const handleAddRootFolder = async () => {
    if (!activeProject) return;
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    await addFolder(activeProject.id, trimmed, null);
    setNewFolderName("");
    setAddingRootFolder(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Project selector */}
      <div className="flex items-center gap-1">
        <select
          value={activeProjectId ?? ""}
          onChange={(e) =>
            setActiveProject(e.target.value || null)
          }
          className="flex h-7 flex-1 appearance-none rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-2 text-xs text-[var(--app-text)]"
        >
          <option value="">– Projekt wählen –</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
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
            onClick={() => deleteProject(activeProject.id)}
          >
            <Trash2 size={12} />
          </Button>
        )}
      </div>

      {creating && (
        <NewProjectInline onDone={() => setCreating(false)} />
      )}

      {/* Folder tree for active project */}
      {activeProject && (
        <ScrollArea className="max-h-52">
          <div className="flex flex-col gap-0.5">
            {/* Root-level slides */}
            {activeProject.slides
              .filter((s) => !s.folderId)
              .map((s) => (
                <div
                  key={s.id}
                  className="group flex items-center gap-1 rounded px-1 py-0.5 text-xs hover:bg-[var(--app-surface)]"
                >
                  <FileCode2 size={11} className="text-[var(--app-muted)]" />
                  <span className="flex-1 truncate text-[var(--app-text)]">
                    {s.name}.tsx
                  </span>
                </div>
              ))}

            {/* Root-level folders */}
            {activeProject.folders
              .filter((f) => !f.parentId)
              .map((f) => (
                <FolderItem
                  key={f.id}
                  folder={f}
                  project={activeProject}
                  depth={0}
                  slides={activeProject.slides.filter(
                    (s) => s.folderId === f.id,
                  )}
                  childFolders={activeProject.folders.filter(
                    (cf) => cf.parentId === f.id,
                  )}
                  allFolders={activeProject.folders}
                  allSlides={activeProject.slides}
                />
              ))}

            {addingRootFolder && (
              <div className="flex gap-1 py-0.5">
                <Input
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ordnername"
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddRootFolder()
                  }
                  className="h-6 flex-1 text-[10px]"
                />
                <Button
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleAddRootFolder}
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
      )}

      {/* Suggested repo path */}
      {activeProject && (
        <div className="rounded border border-[var(--app-border)] bg-[#0a0a0a] px-2 py-1.5">
          <div className="text-[9px] uppercase tracking-wider text-[var(--app-muted)]">
            Repo-Pfad
          </div>
          <div
            className="mt-0.5 break-all font-mono text-[10px] text-[var(--app-text)]"
          >
            src/slides/
            {activeProject.name
              .replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, "")
              .replace(/\s+/g, "-")
              .toLowerCase()}
            /
          </div>
        </div>
      )}
    </div>
  );
};
