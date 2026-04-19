import type { CodeSlide } from "./types";
import DoraPamCisoSlide from "./dora-pam/DoraPamCisoSlide";
import {
  AiAgentsIdentitiesSlide,
  AppAssignmentSlide,
  AppSearchLogicSlide,
  AppWorkPhaseSlide,
  AuthenticationPrincipleSlide,
  AuthenticationVsAuthorizationSlide,
  AuthorizationPrincipleSlide,
  CiaLensSlide,
  GroupMechanicsSlide,
  IamCyberSecurityImportanceSlide,
  IamAiDeepfakesSlide,
  IamSynthesisSlide,
  JoinerLeaverMoverPrincipleSlide,
  LeastPrivilegePrincipleSlide,
  LeastPrivilegeVsNeedToKnowSlide,
  NeedToKnowPrincipleSlide,
  PrivilegedAccessManagementSlide,
  ProtectionObjectsSlide,
  QaSlide,
  SegregationOfDutiesPrincipleSlide,
  SodVsJlmComparisonSlide,
  TitleAndIntroSlide,
  VideoSlotSlide,
  VideoToAppTransitionSlide,
  WorkshopFlowSlide,
  WrapUpSlide,
} from "./DI Workshop";
import * as T from "./templates";

export interface RegisteredCodeSlide extends CodeSlide {
  sourceFolder: string;
  kind: "production" | "template";
}

/**
 * Production code-slides — those that carry real, presentation-ready
 * content. Shown in the "Folienauswahl" dropdown.
 */
export const codeSlides: RegisteredCodeSlide[] = [
  {
    ...TitleAndIntroSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...WorkshopFlowSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...IamCyberSecurityImportanceSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...ProtectionObjectsSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...CiaLensSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...VideoSlotSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...VideoToAppTransitionSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...AppAssignmentSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...AppSearchLogicSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...GroupMechanicsSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...AppWorkPhaseSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...AuthenticationPrincipleSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...AuthorizationPrincipleSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...AuthenticationVsAuthorizationSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...LeastPrivilegePrincipleSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...NeedToKnowPrincipleSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...LeastPrivilegeVsNeedToKnowSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...SegregationOfDutiesPrincipleSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...JoinerLeaverMoverPrincipleSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...SodVsJlmComparisonSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...IamSynthesisSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...PrivilegedAccessManagementSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...IamAiDeepfakesSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...AiAgentsIdentitiesSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...WrapUpSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...QaSlide,
    sourceFolder: "DI Workshop",
    kind: "production",
  },
  {
    ...DoraPamCisoSlide,
    sourceFolder: "dora-pam",
    kind: "production",
  },
];

/**
 * Wireframe templates — 25 proven information-design patterns rendered as
 * visual sketches. Shown in a separate "Vorlagen / Ideenvorschläge"
 * dropdown. They are not meant to carry final content; they exist as
 * inspiration for the user and as concrete layout examples for the LLM.
 */
export const slideTemplates: RegisteredCodeSlide[] = [
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
].map((slide) => ({
  ...slide,
  sourceFolder: "templates",
  kind: "template",
}));

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

export function getCodeSlidesForRepoFolder(folder: string | null | undefined) {
  if (!folder) return [];
  return codeSlides.filter((slide) => slide.sourceFolder === folder);
}

export function getSlideTemplatesForRepoFolder(folder: string | null | undefined) {
  if (!folder) return [];
  return slideTemplates.filter((slide) => slide.sourceFolder === folder);
}

export function getRegisteredSlidesForRepoFolder(folder: string | null | undefined) {
  if (!folder) return [];
  return [...getCodeSlidesForRepoFolder(folder), ...getSlideTemplatesForRepoFolder(folder)];
}
