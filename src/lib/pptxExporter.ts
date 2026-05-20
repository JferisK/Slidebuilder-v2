import JSZip from "jszip";
import { resolveLayoutPath, type SlideLayout } from "@/parser/pptxParser";
import type { Slide } from "@/store/slideStore";
import type { StoredTemplate } from "@/lib/templateStorage";

const NS = {
  p: "http://schemas.openxmlformats.org/presentationml/2006/main",
  a: "http://schemas.openxmlformats.org/drawingml/2006/main",
  r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
  pkgRels: "http://schemas.openxmlformats.org/package/2006/relationships",
  ct: "http://schemas.openxmlformats.org/package/2006/content-types",
} as const;

const REL_TYPE = {
  slide:
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide",
  slideLayout:
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout",
} as const;

const CT_SLIDE =
  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function readText(zip: JSZip, path: string): Promise<string | null> {
  const file = zip.file(path);
  return file ? file.async("string") : null;
}

function parseXml(text: string): Document {
  return new DOMParser().parseFromString(text, "application/xml");
}

function serializeXml(doc: Document): string {
  return new XMLSerializer().serializeToString(doc);
}

function buildSlideXml(layout: SlideLayout, content: Record<string, string>): string {
  const shapes = layout.placeholders
    .map((p, i) => {
      const idAttr = i + 2; // id="1" is reserved for the group
      const phAttrs: string[] = [];
      if (p.type && p.type !== "body") phAttrs.push(`type="${escapeXml(p.type)}"`);
      phAttrs.push(`idx="${p.idx}"`);
      const text = content[String(p.idx)] ?? "";
      const txBody = text
        ? `<p:txBody><a:bodyPr/><a:lstStyle/>${text
            .split("\n")
            .map(
              (line) =>
                `<a:p><a:r><a:rPr lang="de-DE" dirty="0"/><a:t>${escapeXml(line)}</a:t></a:r></a:p>`,
            )
            .join("")}</p:txBody>`
        : `<p:txBody><a:bodyPr/><a:lstStyle/><a:p/></p:txBody>`;
      const namePart = p.type ? `${p.type} ${p.idx}` : `Placeholder ${p.idx}`;
      return `<p:sp><p:nvSpPr><p:cNvPr id="${idAttr}" name="${escapeXml(namePart)}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph ${phAttrs.join(" ")}/></p:nvPr></p:nvSpPr><p:spPr/>${txBody}</p:sp>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="${NS.a}" xmlns:r="${NS.r}" xmlns:p="${NS.p}"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>${shapes}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}

function buildSlideRelsXml(layoutFileName: string): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="${NS.pkgRels}"><Relationship Id="rId1" Type="${REL_TYPE.slideLayout}" Target="../slideLayouts/${layoutFileName}"/></Relationships>`;
}

function removeExistingSlides(zip: JSZip): void {
  const paths: string[] = [];
  zip.forEach((relativePath) => {
    if (
      /^ppt\/slides\/slide\d+\.xml$/.test(relativePath) ||
      /^ppt\/slides\/_rels\/slide\d+\.xml\.rels$/.test(relativePath)
    ) {
      paths.push(relativePath);
    }
  });
  for (const p of paths) zip.remove(p);
}

function pruneContentTypes(doc: Document): void {
  const overrides = Array.from(doc.getElementsByTagNameNS(NS.ct, "Override"));
  for (const ov of overrides) {
    const part = ov.getAttribute("PartName") ?? "";
    if (/^\/ppt\/slides\/slide\d+\.xml$/.test(part)) {
      ov.parentNode?.removeChild(ov);
    }
  }
}

function addSlideContentType(doc: Document, partName: string): void {
  const types = doc.getElementsByTagNameNS(NS.ct, "Types")[0];
  if (!types) return;
  const override = doc.createElementNS(NS.ct, "Override");
  override.setAttribute("PartName", partName);
  override.setAttribute("ContentType", CT_SLIDE);
  types.appendChild(override);
}

function nextRelId(doc: Document): string {
  const rels = Array.from(
    doc.getElementsByTagNameNS(NS.pkgRels, "Relationship"),
  );
  let max = 0;
  for (const r of rels) {
    const id = r.getAttribute("Id") ?? "";
    const m = /^rId(\d+)$/.exec(id);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  }
  return `rId${max + 1}`;
}

function rewritePresentationRels(doc: Document, slideTarget: string): string {
  const rels = Array.from(
    doc.getElementsByTagNameNS(NS.pkgRels, "Relationship"),
  );
  for (const r of rels) {
    if (r.getAttribute("Type") === REL_TYPE.slide) {
      r.parentNode?.removeChild(r);
    }
  }
  const id = nextRelId(doc);
  const root = doc.getElementsByTagNameNS(NS.pkgRels, "Relationships")[0];
  const rel = doc.createElementNS(NS.pkgRels, "Relationship");
  rel.setAttribute("Id", id);
  rel.setAttribute("Type", REL_TYPE.slide);
  rel.setAttribute("Target", slideTarget);
  root?.appendChild(rel);
  return id;
}

function rewriteSldIdLst(doc: Document, relId: string): void {
  const presentation = doc.getElementsByTagNameNS(NS.p, "presentation")[0];
  if (!presentation) return;
  const existing = doc.getElementsByTagNameNS(NS.p, "sldIdLst")[0];
  if (existing) existing.parentNode?.removeChild(existing);

  const sldIdLst = doc.createElementNS(NS.p, "p:sldIdLst");
  const sldId = doc.createElementNS(NS.p, "p:sldId");
  sldId.setAttribute("id", "256");
  sldId.setAttributeNS(NS.r, "r:id", relId);
  sldIdLst.appendChild(sldId);

  const masterIdLst = doc.getElementsByTagNameNS(NS.p, "sldMasterIdLst")[0];
  if (masterIdLst && masterIdLst.nextSibling) {
    presentation.insertBefore(sldIdLst, masterIdLst.nextSibling);
  } else if (masterIdLst) {
    presentation.appendChild(sldIdLst);
  } else {
    presentation.insertBefore(sldIdLst, presentation.firstChild);
  }
}

export interface ExportPptxInput {
  template: StoredTemplate;
  slide: Slide;
  layout: SlideLayout;
}

export async function exportActiveSlideAsPptx(
  input: ExportPptxInput,
): Promise<Blob> {
  const { template, slide, layout } = input;

  // Clone bytes so a subsequent export sees a fresh zip view.
  const zip = await JSZip.loadAsync(template.pptxData.slice(0));

  const resolved = await resolveLayoutPath(zip, slide.layoutId);
  if (!resolved) {
    throw new Error("Layout path could not be resolved in template");
  }
  const layoutFileName = resolved.layoutPath.split("/").pop()!;

  removeExistingSlides(zip);

  zip.file("ppt/slides/slide1.xml", buildSlideXml(layout, slide.content));
  zip.file(
    "ppt/slides/_rels/slide1.xml.rels",
    buildSlideRelsXml(layoutFileName),
  );

  const ctText = await readText(zip, "[Content_Types].xml");
  if (!ctText) throw new Error("[Content_Types].xml missing");
  const ctDoc = parseXml(ctText);
  pruneContentTypes(ctDoc);
  addSlideContentType(ctDoc, "/ppt/slides/slide1.xml");
  zip.file("[Content_Types].xml", serializeXml(ctDoc));

  const prelsText = await readText(zip, "ppt/_rels/presentation.xml.rels");
  if (!prelsText) throw new Error("ppt/_rels/presentation.xml.rels missing");
  const prelsDoc = parseXml(prelsText);
  const slideRelId = rewritePresentationRels(prelsDoc, "slides/slide1.xml");
  zip.file("ppt/_rels/presentation.xml.rels", serializeXml(prelsDoc));

  const pText = await readText(zip, "ppt/presentation.xml");
  if (!pText) throw new Error("ppt/presentation.xml missing");
  const pDoc = parseXml(pText);
  rewriteSldIdLst(pDoc, slideRelId);
  zip.file("ppt/presentation.xml", serializeXml(pDoc));

  return zip.generateAsync({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
}
