export interface NavItem {
  label: string;
  targetId: string;
  index: string;
  subtitle: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', targetId: 'hero', index: '01', subtitle: 'Overview & Hero' },
  { label: 'Work', targetId: 'work', index: '02', subtitle: 'Featured Systems' },
  { label: 'Services', targetId: 'services', index: '03', subtitle: 'Core Capabilities' },
  { label: 'Tools', targetId: 'tools', index: '04', subtitle: 'Stack & Proficiency' },
  { label: 'Resume', targetId: 'about', index: '05', subtitle: 'Experience & Credentials' },
];

export interface ScrollSpyTarget {
  label: string;
  targetId: string;
}

export const SCROLL_SPY_TARGETS: ScrollSpyTarget[] = [
  ...NAV_ITEMS.map(({ label, targetId }) => ({ label, targetId })),
  { label: 'Contact', targetId: 'contact' },
];

export interface SectionPosition {
  label: string;
  top: number;
}

/**
 * Resolves the active navigation label based on section top offsets relative to
 * the viewport trigger line. Picks the deepest section whose top has crossed the
 * trigger line, and activates 'Contact' when scrolled to the bottom of the page.
 */
export function resolveActiveNavFromPositions(
  positions: SectionPosition[],
  triggerLine: number,
  isAtPageBottom = false
): string {
  if (isAtPageBottom && positions.some((sec) => sec.label === 'Contact')) {
    return 'Contact';
  }

  let current = 'Home';
  let bestTop = -Infinity;

  for (const sec of positions) {
    if (sec.top <= triggerLine && sec.top >= bestTop) {
      bestTop = sec.top;
      current = sec.label;
    }
  }
  return current;
}

/**
 * Resolves the default active navigation label from the current router pathname.
 */
export function resolveNavForPathname(pathname: string): string {
  if (pathname === '/work') return 'Work';
  return 'Home';
}
