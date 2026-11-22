import { BRAND_DATA } from '../data/portfolioData.ts';

export type CommandGroup = 'Sections' | 'Pages' | 'Quick Actions';
export type CommandActionType = 'section' | 'route' | 'copy-email' | 'external';

export interface CommandPaletteItem {
  id: string;
  label: string;
  description: string;
  group: CommandGroup;
  keywords: string[];
  actionType: CommandActionType;
  target: string;
  shortcut?: string;
}

export const COMMAND_PALETTE_ITEMS: CommandPaletteItem[] = [
  {
    id: 'sec-home',
    label: 'Home',
    description: 'Hero overview and introduction',
    group: 'Sections',
    keywords: ['hero', 'top', 'start', 'stephen', 'pascua', 'intro'],
    actionType: 'section',
    target: 'hero',
    shortcut: '1',
  },
  {
    id: 'sec-work',
    label: 'Featured Work',
    description: 'Engineered systems, TaskAdjust, TaskScript, TaskPulse & AI tools',
    group: 'Sections',
    keywords: ['projects', 'portfolio', 'systems', 'taskadjust', 'taskscript', 'taskpulse', 'analytics'],
    actionType: 'section',
    target: 'work',
    shortcut: '2',
  },
  {
    id: 'sec-services',
    label: 'Engineered Services',
    description: 'IT Support, Executive Administration, and Client Care pillars',
    group: 'Sections',
    keywords: ['capabilities', 'it', 'admin', 'operations', 'customer', 'care', 'offerings'],
    actionType: 'section',
    target: 'services',
    shortcut: '3',
  },
  {
    id: 'sec-explorations',
    label: 'Visual Playground',
    description: 'Interface studies, workflow topologies, and system aesthetics',
    group: 'Sections',
    keywords: ['explorations', 'gallery', 'visual', 'playground', 'designs'],
    actionType: 'section',
    target: 'explorations',
    shortcut: '4',
  },
  {
    id: 'sec-about',
    label: 'About & Resume',
    description: '10+ years background, TESDA Level III certification & credentials',
    group: 'Sections',
    keywords: ['resume', 'bio', 'credentials', 'tesda', 'coach', 'experience', 'profile'],
    actionType: 'section',
    target: 'about',
    shortcut: '5',
  },
  {
    id: 'sec-tools',
    label: 'Tools & Tech Stack',
    description: '14 platforms across Microsoft 365, Google Workspace, AI & CRMs',
    group: 'Sections',
    keywords: ['stack', 'software', 'notion', 'gohighlevel', 'copilot', 'gemini', 'proficiency'],
    actionType: 'section',
    target: 'tools',
    shortcut: '6',
  },
  {
    id: 'sec-recommend',
    label: 'Find Your Fit',
    description: 'Interactive solution matcher for operational and IT bottlenecks',
    group: 'Sections',
    keywords: ['recommender', 'matcher', 'bottleneck', 'assessment', 'quiz', 'solution'],
    actionType: 'section',
    target: 'recommend',
    shortcut: '7',
  },
  {
    id: 'sec-stats',
    label: 'Impact & SLA Metrics',
    description: '10+ years experience, 95+ automated workflows, 99.4% resolution SLA',
    group: 'Sections',
    keywords: ['metrics', 'numbers', 'sla', 'stats', 'results'],
    actionType: 'section',
    target: 'stats',
  },
  {
    id: 'sec-contact',
    label: 'Contact & Brief Builder',
    description: 'Send a pre-formatted brief via Email, WhatsApp, or Viber',
    group: 'Sections',
    keywords: ['say hi', 'hire', 'email', 'whatsapp', 'viber', 'reach out', 'inquiry'],
    actionType: 'section',
    target: 'contact',
    shortcut: '8',
  },
  {
    id: 'page-work-archive',
    label: 'All Work Archive',
    description: 'Browse the complete categorized portfolio archive page',
    group: 'Pages',
    keywords: ['archive', 'all projects', 'catalog', 'full work'],
    actionType: 'route',
    target: '/work',
  },
  {
    id: 'action-copy-email',
    label: 'Copy Email Address',
    description: BRAND_DATA.email,
    group: 'Quick Actions',
    keywords: ['clipboard', 'mail', 'pascua', 'copy'],
    actionType: 'copy-email',
    target: BRAND_DATA.email,
  },
  {
    id: 'action-whatsapp',
    label: 'Message on WhatsApp',
    description: `Direct chat (${BRAND_DATA.displayPhone})`,
    group: 'Quick Actions',
    keywords: ['chat', 'phone', 'whatsapp', 'call'],
    actionType: 'external',
    target: BRAND_DATA.whatsapp,
  },
  {
    id: 'action-upwork',
    label: 'View Upwork Profile',
    description: 'Open Stephen Pascua on Upwork',
    group: 'Quick Actions',
    keywords: ['freelance', 'upwork', 'reviews', 'hire'],
    actionType: 'external',
    target: BRAND_DATA.social.upwork,
  },
];

const GROUP_ORDER: CommandGroup[] = ['Sections', 'Pages', 'Quick Actions'];

function scoreCommandItem(item: CommandPaletteItem, tokens: string[]): number {
  const label = item.label.toLowerCase();
  const description = item.description.toLowerCase();
  const group = item.group.toLowerCase();
  const keywords = item.keywords.map((k) => k.toLowerCase());
  const haystack = `${label} ${description} ${group} ${keywords.join(' ')}`;

  for (const token of tokens) {
    if (!haystack.includes(token)) {
      return -1;
    }
  }

  let score = 0;
  for (const token of tokens) {
    if (label === token) score += 100;
    else if (label.startsWith(token)) score += 60;
    else if (label.includes(token)) score += 35;
    else if (keywords.some((k) => k.startsWith(token))) score += 25;
    else if (keywords.some((k) => k.includes(token))) score += 15;
    else if (description.includes(token)) score += 10;
    else score += 5;
  }

  return score;
}

export function filterCommandItems(
  items: CommandPaletteItem[],
  query: string
): CommandPaletteItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return items;

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  return items
    .map((item, idx) => ({ item, idx, score: scoreCommandItem(item, tokens) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .map((entry) => entry.item);
}

export interface GroupedCommandSection {
  group: CommandGroup;
  items: CommandPaletteItem[];
}

export function groupCommandItems(items: CommandPaletteItem[]): GroupedCommandSection[] {
  return GROUP_ORDER.map((group) => ({
    group,
    items: items.filter((item) => item.group === group),
  })).filter((section) => section.items.length > 0);
}

export function getNextCommandIndex(currentIndex: number, delta: number, total: number): number {
  if (total <= 0) return -1;
  const base = currentIndex < 0 ? 0 : currentIndex;
  return (base + delta + total) % total;
}
