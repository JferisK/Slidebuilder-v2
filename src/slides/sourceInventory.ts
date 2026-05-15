/// <reference types="vite/client" />

const slideSourceModules = import.meta.glob("./**/*.{ts,tsx}", {
  eager: true,
});

function normalizeFolderName(path: string): string | null {
  const cleaned = path.replace(/^\.\//, "");
  const [topLevel] = cleaned.split("/");
  if (!topLevel || topLevel.endsWith(".ts") || topLevel.endsWith(".tsx")) {
    return null;
  }
  return topLevel;
}

const repoSlideFolders = Array.from(
  new Set(
    Object.keys(slideSourceModules)
      .map(normalizeFolderName)
      .filter((value): value is string => Boolean(value)),
  ),
).sort((a, b) => a.localeCompare(b));

export function getRepoSlideFolders(): string[] {
  return repoSlideFolders;
}
