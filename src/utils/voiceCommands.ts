import { CommandPaletteItem, filterCommandItems } from './commandPalette.ts';

export type VoiceMatchConfidence = 'exact' | 'alias' | 'fuzzy' | 'none';

export interface VoiceCommandMatch {
  item: CommandPaletteItem | null;
  normalizedTranscript: string;
  cleanedQuery: string;
  confidence: VoiceMatchConfidence;
}

export interface BrowserSpeechRecognitionEvent {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
      confidence: number;
    };
  }>;
}

export interface BrowserSpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

export interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

const VOICE_INTENT_PREFIXES = [
  /^please\s+/,
  /^(?:can you|could you|would you)\s+/,
  /^(?:let us|let's|lets)\s+/,
  /^(?:go to|navigate to|jump to|take me to|scroll to|bring me to|head to|switch to|move to)\s+/,
  /^(?:show me|display|open up|open|view|see|find|visit|show|check out|check)\s+/,
  /^(?:the|my|his|stephen's|stephens)\s+/,
];

const VOICE_TRAILING_WORDS = /\s+(?:section|page|area|part|tab|please)$/i;

/**
 * Explicit natural-language spoken aliases mapped to CommandPaletteItem IDs.
 * Checked after normalizing and stripping conversational navigation prefixes.
 */
const VOICE_ITEM_ALIASES: Record<string, string[]> = {
  'sec-home': ['home', 'top', 'hero', 'start', 'beginning', 'back to top', 'overview', 'main'],
  'sec-work': [
    'work',
    'featured work',
    'featured systems',
    'systems',
    'projects',
    'portfolio',
    'case studies',
    'featured',
  ],
  'page-work-archive': ['work archive', 'all work', 'archive', 'all projects', 'all systems', 'catalog'],
  'sec-services': [
    'services',
    'service',
    'engineered services',
    'capabilities',
    'what you do',
    'offerings',
    'it support',
    'virtual assistant',
    'client care',
  ],
  'sec-explorations': [
    'explorations',
    'exploration',
    'visual playground',
    'playground',
    'gallery',
    'visuals',
    'designs',
  ],
  'sec-about': [
    'about',
    'about me',
    'about stephen',
    'resume',
    'bio',
    'credentials',
    'experience',
    'background',
    'tesda',
    'profile',
    'who is stephen',
  ],
  'sec-tools': [
    'tools',
    'tool',
    'tools i work with',
    'tech stack',
    'stack',
    'software',
    'platforms',
    'apps',
    'proficiency',
  ],
  'sec-recommend': [
    'recommend',
    'recommender',
    'find your fit',
    'find fit',
    'fit',
    'solution matcher',
    'matcher',
    'assessment',
    'quiz',
    'bottleneck',
  ],
  'sec-stats': ['stats', 'statistics', 'metrics', 'sla', 'impact', 'numbers', 'results'],
  'sec-contact': [
    'contact',
    'contacts',
    'contact me',
    'contact stephen',
    'say hi',
    'say hello',
    'hire',
    'hire stephen',
    'reach out',
    'get in touch',
    'brief',
    'brief builder',
    'inquire',
    'inquiry',
    'email',
  ],
  'action-copy-email': ['copy email', 'copy email address', 'copy address', 'copy mail'],
  'action-whatsapp': ['whatsapp', 'message on whatsapp', 'chat on whatsapp', 'open whatsapp'],
  'action-upwork': ['upwork', 'upwork profile', 'view upwork', 'open upwork'],
};

export const VOICE_COMMAND_EXAMPLES: string[] = [
  'Go to contact',
  'Show tools',
  'Open services',
  'Jump to featured work',
];

export function normalizeSpokenTranscript(transcript: string): string {
  return transcript
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripVoiceIntentPrefixes(normalized: string): string {
  let result = normalized.trim();
  let changed = true;

  // Iteratively strip stacked prefixes like "please take me to the contact section"
  while (changed && result.length > 0) {
    changed = false;
    for (const pattern of VOICE_INTENT_PREFIXES) {
      const next = result.replace(pattern, '').trim();
      if (next !== result) {
        result = next;
        changed = true;
      }
    }
    const trimmedTrailing = result.replace(VOICE_TRAILING_WORDS, '').trim();
    if (trimmedTrailing !== result) {
      result = trimmedTrailing;
      changed = true;
    }
  }

  return result;
}

export function matchVoiceCommand(
  transcript: string,
  items: CommandPaletteItem[]
): VoiceCommandMatch {
  const normalizedTranscript = normalizeSpokenTranscript(transcript);
  if (!normalizedTranscript) {
    return {
      item: null,
      normalizedTranscript: '',
      cleanedQuery: '',
      confidence: 'none',
    };
  }

  const cleanedQuery = stripVoiceIntentPrefixes(normalizedTranscript) || normalizedTranscript;
  const itemsById = new Map(items.map((item) => [item.id, item]));

  // 1. Check exact alias match against full normalized transcript first
  // (preserves multi-word action phrases like "copy email" or "say hi")
  for (const [itemId, aliases] of Object.entries(VOICE_ITEM_ALIASES)) {
    const item = itemsById.get(itemId);
    if (!item) continue;
    if (aliases.includes(normalizedTranscript)) {
      return {
        item,
        normalizedTranscript,
        cleanedQuery,
        confidence: 'exact',
      };
    }
  }

  // 2. Check alias match against cleaned intent target
  for (const [itemId, aliases] of Object.entries(VOICE_ITEM_ALIASES)) {
    const item = itemsById.get(itemId);
    if (!item) continue;
    if (aliases.includes(cleanedQuery)) {
      return {
        item,
        normalizedTranscript,
        cleanedQuery,
        confidence: 'alias',
      };
    }
  }

  // 3. Check exact label match
  const exactLabelMatch = items.find(
    (item) =>
      item.label.toLowerCase() === cleanedQuery ||
      item.label.toLowerCase() === normalizedTranscript
  );
  if (exactLabelMatch) {
    return {
      item: exactLabelMatch,
      normalizedTranscript,
      cleanedQuery,
      confidence: 'exact',
    };
  }

  // 4. Fallback to CommandPalette token search with cleanedQuery
  const filtered = filterCommandItems(items, cleanedQuery);
  if (filtered.length > 0) {
    return {
      item: filtered[0],
      normalizedTranscript,
      cleanedQuery,
      confidence: 'fuzzy',
    };
  }

  // 5. Try matching any individual significant word against aliases
  const words = cleanedQuery.split(/\s+/).filter((word) => word.length >= 3);
  for (const word of words) {
    for (const [itemId, aliases] of Object.entries(VOICE_ITEM_ALIASES)) {
      const item = itemsById.get(itemId);
      if (!item) continue;
      if (aliases.includes(word)) {
        return {
          item,
          normalizedTranscript,
          cleanedQuery,
          confidence: 'fuzzy',
        };
      }
    }
  }

  return {
    item: null,
    normalizedTranscript,
    cleanedQuery,
    confidence: 'none',
  };
}

export function getSpeechRecognitionConstructor(
  win?: Window
): BrowserSpeechRecognitionConstructor | null {
  const target = win ?? (typeof window !== 'undefined' ? window : undefined);
  if (!target) return null;

  const speechWindow = target as Window & {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  };

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(win?: Window): boolean {
  return getSpeechRecognitionConstructor(win) !== null;
}

export function formatVoiceErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access was blocked. Allow microphone permission to use voice commands.';
    case 'no-speech':
      return 'No speech detected. Tap the mic and try "Go to contact" or "Show tools".';
    case 'audio-capture':
      return 'No microphone was found on this device.';
    case 'network':
      return 'Voice recognition requires an active internet connection.';
    case 'aborted':
      return '';
    default:
      return 'Voice recognition stopped unexpectedly. Tap the mic to try again.';
  }
}
