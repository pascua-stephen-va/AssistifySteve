import { RecommendationResult } from '../types/index.ts';

interface KeywordRule {
  keywords: string[];
  weight: number;
}

const IT_RULES: KeywordRule = {
  keywords: [
    'it', 'tech', 'technical', 'security', 'permission', 'permissions', 'access', 'workspace',
    'admin', 'setup', 'troubleshoot', 'troubleshooting', 'api', 'integration', 'software',
    'dns', 'domain', 'network', 'cloud', 'm365', 'microsoft 365', 'google workspace',
    'migration', 'hardware', 'credentials', 'password', 'mfa', 'sso'
  ],
  weight: 1.0,
};

const ADMIN_RULES: KeywordRule = {
  keywords: [
    'inbox', 'email', 'calendar', 'schedule', 'scheduling', 'appointment', 'appointments',
    'meeting', 'meetings', 'travel', 'flight', 'sop', 'sops', 'standard operating procedure',
    'procedure', 'logistics', 'executive', 'admin', 'coordination', 'organize', 'files',
    'document', 'triage', 'overload', 'conflicts', 'clutter'
  ],
  weight: 1.0,
};

const CLIENT_RULES: KeywordRule = {
  keywords: [
    'customer', 'client', 'clients', 'support', 'ticket', 'tickets', 'crm', 'escalation',
    'escalations', 'retention', 'cadence', 'gohighlevel', 'lead', 'leads', 'chat', 'inquiry',
    'helpdesk', 'relationship', 'onboarding', 'outreach', 'churn', 'care'
  ],
  weight: 1.0,
};

const DATA_RULES: KeywordRule = {
  keywords: [
    'data', 'sheet', 'sheets', 'excel', 'spreadsheet', 'spreadsheets', 'consolidation',
    'sql', 'analysis', 'analytics', 'formula', 'vlookup', 'entry', 'manual', 'report',
    'reporting', 'dashboard', 'database', 'reconciliation'
  ],
  weight: 1.1,
};

export function analyzeWorkflowNeeds(input: string): RecommendationResult {
  const normalized = (input || '').toLowerCase();

  let itScore = 0;
  let adminScore = 0;
  let clientScore = 0;
  let dataScore = 0;

  const detectedPainPoints: string[] = [];

  IT_RULES.keywords.forEach(kw => {
    if (normalized.includes(kw)) {
      itScore += IT_RULES.weight;
      if (!detectedPainPoints.includes(kw) && detectedPainPoints.length < 5) {
        detectedPainPoints.push(kw);
      }
    }
  });

  ADMIN_RULES.keywords.forEach(kw => {
    if (normalized.includes(kw)) {
      adminScore += ADMIN_RULES.weight;
      if (!detectedPainPoints.includes(kw) && detectedPainPoints.length < 5) {
        detectedPainPoints.push(kw);
      }
    }
  });

  CLIENT_RULES.keywords.forEach(kw => {
    if (normalized.includes(kw)) {
      clientScore += CLIENT_RULES.weight;
      if (!detectedPainPoints.includes(kw) && detectedPainPoints.length < 5) {
        detectedPainPoints.push(kw);
      }
    }
  });

  DATA_RULES.keywords.forEach(kw => {
    if (normalized.includes(kw)) {
      dataScore += DATA_RULES.weight;
      if (!detectedPainPoints.includes(kw) && detectedPainPoints.length < 5) {
        detectedPainPoints.push(kw);
      }
    }
  });

  let primaryTier: RecommendationResult['primaryTier'] = 'Administrative & Operations Support';
  let tierTag = 'Executive Ready';

  if (itScore > adminScore && itScore >= clientScore) {
    primaryTier = 'IT Support & Systems Management';
    tierTag = 'Technical Rigor';
  } else if (clientScore > adminScore && clientScore > itScore) {
    primaryTier = 'Customer & Client Care';
    tierTag = 'Relationship Focus';
  } else if (adminScore === 0 && itScore === 0 && clientScore === 0 && dataScore > 0) {
    primaryTier = 'IT Support & Systems Management';
    tierTag = 'Technical Rigor';
  }

  const toolsSet = new Set<string>();
  if (primaryTier === 'IT Support & Systems Management') {
    toolsSet.add('Google Workspace');
    toolsSet.add('Microsoft 365');
    toolsSet.add('Gemini');
    toolsSet.add('Microsoft Copilot');
    if (dataScore > 0 || normalized.includes('data')) {
      toolsSet.add('Notion');
    }
  } else if (primaryTier === 'Customer & Client Care') {
    toolsSet.add('GoHighLevel');
    toolsSet.add('monday.com');
    toolsSet.add('Zoom');
    toolsSet.add('ChatGPT');
    toolsSet.add('Canva');
  } else {
    toolsSet.add('Microsoft 365');
    toolsSet.add('Google Workspace');
    toolsSet.add('Notion');
    toolsSet.add('Trello');
    toolsSet.add('Perplexity');
  }

  let matchedProject = {
    title: 'TaskScript',
    url: 'https://taskscript.webvi.be',
    badge: '02 | AI Workflow & Procedure Launcher',
    reason: 'Standardizes dynamic processes into validated, automated execution checklists.',
  };

  if (
    normalized.includes('settlement') ||
    normalized.includes('refund') ||
    normalized.includes('overtime') ||
    normalized.includes('calc') ||
    normalized.includes('reconcil')
  ) {
    matchedProject = {
      title: 'TaskAdjust',
      url: 'https://taskadjust.webvi.be',
      badge: '01 | Settlement, Refund & Overtime Engine',
      reason: 'Automates complex multi-rule calculation tables, approval thresholds, and audit trails.',
    };
  } else if (
    dataScore > 1 ||
    normalized.includes('excel') ||
    normalized.includes('sql') ||
    normalized.includes('spreadsheet') ||
    normalized.includes('data')
  ) {
    matchedProject = {
      title: 'Data Analytics 101',
      url: 'https://data-analytics-101.webvi.be',
      badge: '04 | Interactive Excel & SQL Skills Training Lab',
      reason: 'Transforms fragmented, messy tables into clean schemas, relational joins, and automated queries.',
    };
  } else if (
    primaryTier === 'Customer & Client Care' ||
    normalized.includes('client') ||
    normalized.includes('retention') ||
    normalized.includes('cadence') ||
    normalized.includes('crm')
  ) {
    matchedProject = {
      title: 'TaskPulse',
      url: 'https://taskpulse.webvi.be',
      badge: '03 | Client Cadence & Retention Engine',
      reason: 'Eliminates client drop-offs through proactive milestone touchpoints and automated SLA monitoring.',
    };
  } else if (
    normalized.includes('prompt') ||
    normalized.includes('scene') ||
    normalized.includes('storyboard') ||
    normalized.includes('script 2 scene') ||
    normalized.includes('generative ai')
  ) {
    matchedProject = {
      title: 'A Script 2 Scene',
      url: 'https://script-to-scene.webvi.be',
      badge: '05 | Prompt Engineering Studio',
      reason: 'Transforms narrative scripts and creative concepts into structured generative AI prompts and visual shot lists.',
    };
  }

  let executiveSummary = '';
  let roadmap: RecommendationResult['actionRoadmap'] = [];

  if (primaryTier === 'IT Support & Systems Management') {
    executiveSummary = `Based on your technical infrastructure profile, your bottleneck stems from fragmented permissions, software silos, or manual system synchronization. Steve's 10+ years in IT systems will establish secure administrative baselines, clean API automations, and zero-trust identity controls.`;
    roadmap = [
      { step: 'Phase 01', phase: 'Security & Access Audit', deliverable: 'Comprehensive review of workspace permissions, 2FA enforcement, and software license consolidation.' },
      { step: 'Phase 02', phase: 'Architecture & Integration', deliverable: 'Automated data bridging between Microsoft 365, Google Workspace, and core business tools.' },
      { step: 'Phase 03', phase: 'Continuous Reliability & SOPs', deliverable: 'Documentation of IT disaster recovery procedures and structured admin runbooks.' },
    ];
  } else if (primaryTier === 'Customer & Client Care') {
    executiveSummary = `Your operational flow shows critical vulnerability in response times, multi-channel customer communications, or CRM cadence follow-through. Steve applies structured ticket triage, GoHighLevel automation, and white-glove executive client care.`;
    roadmap = [
      { step: 'Phase 01', phase: 'Channel & Pipeline Mapping', deliverable: 'Centralization of inbound customer touchpoints, tagging taxonomies, and escalation protocols.' },
      { step: 'Phase 02', phase: 'Cadence Automation', deliverable: 'Implementation of smart email/SMS triggers and CRM status tracking to safeguard retention.' },
      { step: 'Phase 03', phase: 'SLA Quality Benchmarking', deliverable: 'Weekly resolution scorecards, customer satisfaction metrics, and feedback synthesis.' },
    ];
  } else {
    executiveSummary = `Your inquiry highlights classic executive bandwidth erosion: calendar overlap, inbox inundation, and unstandardized manual tasks. Steve will install an executive triage cadence, systematize repetitive handoffs, and author step-by-step SOPs.`;
    roadmap = [
      { step: 'Phase 01', phase: 'Inbox Zero & Calendar Shield', deliverable: 'Installation of high-priority VIP filters, calendar buffering, and scheduling rules.' },
      { step: 'Phase 02', phase: 'SOP Authoring & AI Acceleration', deliverable: 'Codification of weekly routines into executable checklists with Copilot/Gemini prompts.' },
      { step: 'Phase 03', phase: 'Autonomous Execution', deliverable: 'Seamless handoff of travel bookings, recurring coordination, and cross-team follow-ups.' },
    ];
  }

  const totalHits = itScore + adminScore + clientScore + dataScore;
  const matchScore = Math.min(99, Math.max(88, Math.round(85 + (totalHits * 2.5))));

  return {
    primaryTier,
    tierTag,
    matchScore,
    executiveSummary,
    suggestedTools: Array.from(toolsSet).slice(0, 5),
    matchedProject,
    actionRoadmap: roadmap,
    detectedPainPoints: detectedPainPoints.length > 0 ? detectedPainPoints : ['workflow bottleneck', 'time constraint'],
  };
}
