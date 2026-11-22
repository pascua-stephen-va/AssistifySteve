export interface PortfolioSectionMeta {
  id: string;
  index: string;
  label: string;
  subtitle: string;
}

export const PORTFOLIO_SECTIONS: PortfolioSectionMeta[] = [
  {
    id: 'hero',
    index: '01',
    label: 'Overview',
    subtitle: 'Simplify. Organize. Automate.',
  },
  {
    id: 'work',
    index: '02',
    label: 'Featured Systems',
    subtitle: 'Engineered Workflows & Apps',
  },
  {
    id: 'services',
    index: '03',
    label: 'Engineered Services',
    subtitle: 'IT, Admin & Client Care',
  },
  {
    id: 'explorations',
    index: '04',
    label: 'Visual Playground',
    subtitle: 'Interface & Topology Studies',
  },
  {
    id: 'about',
    index: '05',
    label: 'About & Credentials',
    subtitle: '10+ Years · TESDA Level III',
  },
  {
    id: 'tools',
    index: '06',
    label: 'Tools & Stack',
    subtitle: '14 Daily Platforms',
  },
  {
    id: 'recommend',
    index: '07',
    label: 'Find Your Fit',
    subtitle: 'Solution Matcher',
  },
  {
    id: 'stats',
    index: '08',
    label: 'Impact & SLA',
    subtitle: 'Delivery Metrics',
  },
  {
    id: 'contact',
    index: '09',
    label: 'Contact',
    subtitle: 'Direct Brief Builder',
  },
];

export interface MeasuredSectionRect {
  id: string;
  top: number;
  height: number;
}

export interface StickySectionState {
  visible: boolean;
  activeSection: PortfolioSectionMeta;
  activeIndex: number;
  totalSections: number;
  sectionProgress: number;
  prevSection: PortfolioSectionMeta | null;
  nextSection: PortfolioSectionMeta | null;
}

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * Resolves the currently active portfolio section, visibility state, and intra-section
 * scroll progress from DOM section rects relative to the viewport.
 */
export function resolveStickySectionState(
  rects: MeasuredSectionRect[],
  scrollY: number,
  viewportHeight: number,
  sections: PortfolioSectionMeta[] = PORTFOLIO_SECTIONS,
  showThresholdPx = 280
): StickySectionState {
  const safeViewport = Math.max(1, viewportHeight);
  const triggerLine = safeViewport * 0.35;
  const rectById = new Map(rects.map((rect) => [rect.id, rect]));

  let activeIndex = 0;
  for (let i = 0; i < sections.length; i += 1) {
    const rect = rectById.get(sections[i].id);
    if (rect && rect.top <= triggerLine) {
      activeIndex = i;
    }
  }

  const activeSection = sections[activeIndex] ?? sections[0];
  const activeRect = rectById.get(activeSection.id);

  // Calculate reading progress within the active section
  let sectionProgress = 0;
  if (activeRect && activeRect.height > 0) {
    const travelled = triggerLine - activeRect.top;
    sectionProgress = clampProgress(travelled / activeRect.height);
  }

  // Stay hidden while at the very top of the Hero so the initial fold remains uncluttered
  const firstContentRect = sections.length > 1 ? rectById.get(sections[1].id) : undefined;
  const passedHeroThreshold =
    scrollY >= showThresholdPx ||
    (firstContentRect !== undefined && firstContentRect.top <= safeViewport * 0.55);

  const visible = passedHeroThreshold && activeIndex > 0;

  return {
    visible,
    activeSection,
    activeIndex,
    totalSections: sections.length,
    sectionProgress,
    prevSection: activeIndex > 0 ? sections[activeIndex - 1] : null,
    nextSection: activeIndex < sections.length - 1 ? sections[activeIndex + 1] : null,
  };
}
