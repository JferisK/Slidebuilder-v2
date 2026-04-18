import type { CodeSlide } from "./types";
import DoraPamCisoSlide from "./dora-pam/DoraPamCisoSlide";
import * as T from "./templates";

/**
 * Production code-slides — those that carry real, presentation-ready
 * content. Shown in the "Folienauswahl" dropdown.
 */
export const codeSlides: CodeSlide[] = [DoraPamCisoSlide];

/**
 * Wireframe templates — 25 proven information-design patterns rendered as
 * visual sketches. Shown in a separate "Vorlagen / Ideenvorschläge"
 * dropdown. They are not meant to carry final content; they exist as
 * inspiration for the user and as concrete layout examples for the LLM.
 */
export const slideTemplates: CodeSlide[] = [
  T.ExecutiveMessageFirst,
  T.KpiHeroLeft,
  T.BinaryContrast,
  T.DashboardTopLeft,
  T.ProcessChevron,
  T.SummaryDecisionBox,
  T.HubAndSpoke,
  T.ZPatternStory,
  T.ThreeUpCards,
  T.FourUpQuadrants,
  T.TitleBandVisual,
  T.ChartInsightHybrid,
  T.ArchitectureLayer,
  T.SwimlaneRoadmap,
  T.VerticalTimeline,
  T.Matrix2x2,
  T.WaterfallChart,
  T.ProgressiveReveal,
  T.MetricBaseline,
  T.QuoteExpert,
  T.RegionChoropleth,
  T.ScenarioComparison,
  T.HeatmapGap,
  T.PyramidHierarchy,
  T.AppendixSourceGrid,
];

/**
 * Looks up any code-slide by id — searches production slides first, then
 * templates. A slide's `codeSlideId` field can hold either kind, and the
 * renderer needs to resolve both transparently.
 */
export function getCodeSlide(id: string | null | undefined) {
  if (!id) return undefined;
  return (
    codeSlides.find((s) => s.id === id) ??
    slideTemplates.find((s) => s.id === id)
  );
}

export function isTemplateId(id: string | null | undefined) {
  if (!id) return false;
  return slideTemplates.some((s) => s.id === id);
}
