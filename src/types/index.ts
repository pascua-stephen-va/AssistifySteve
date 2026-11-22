export type ThemeMode = 'system' | 'light' | 'dark';

export interface ServiceItem {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  summary: string;
  scope: string[];
  deliverables: string[];
  icon: string;
}

export interface PortfolioItem {
  id: string;
  step: string;
  title: string;
  url: string;
  badge: string;
  summary: string;
  category: string;
  accent: string;
  accentBorder: string;
  capabilities: string[];
  impactMetric: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string[];
  imageKey: 'adjust' | 'script' | 'pulse' | 'analytics' | 'scene' | 'arch';
}

export interface ExplorationItem {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  imageKey: 'adjust' | 'script' | 'pulse' | 'analytics' | 'scene' | 'arch';
  rotation: string;
}

export interface ToolItem {
  name: string;
  category: 'AI & Copilots' | 'Cloud Workspaces' | 'Work Management' | 'CRM & Communications';
  description: string;
  featuredInWorkflow: string;
  proficiencyLevel: string;
}

export interface RecommendationResult {
  primaryTier: 'IT Support & Systems Management' | 'Administrative & Operations Support' | 'Customer & Client Care';
  tierTag: string;
  matchScore: number;
  executiveSummary: string;
  suggestedTools: string[];
  matchedProject: {
    title: string;
    url: string;
    badge: string;
    reason: string;
  };
  actionRoadmap: {
    step: string;
    phase: string;
    deliverable: string;
  }[];
  detectedPainPoints: string[];
}
