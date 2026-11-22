import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  Briefcase,
  Check,
  Compass,
  Copy,
  CornerDownLeft,
  FolderKanban,
  Home,
  Layers,
  Mail,
  MessageSquare,
  Mic,
  MicOff,
  Search,
  Sparkles,
  User,
  Wrench,
  X,
  BarChart3,
} from 'lucide-react';
import {
  COMMAND_PALETTE_ITEMS,
  CommandPaletteItem,
  filterCommandItems,
  getNextCommandIndex,
  groupCommandItems,
} from '../utils/commandPalette.ts';
import {
  BrowserSpeechRecognition,
  VOICE_COMMAND_EXAMPLES,
  formatVoiceErrorMessage,
  getSpeechRecognitionConstructor,
  matchVoiceCommand,
} from '../utils/voiceCommands.ts';

interface CommandPaletteProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function getItemIcon(id: string) {
  switch (id) {
    case 'sec-home':
      return <Home className="w-4 h-4" aria-hidden="true" />;
    case 'sec-work':
      return <FolderKanban className="w-4 h-4" aria-hidden="true" />;
    case 'sec-services':
      return <Briefcase className="w-4 h-4" aria-hidden="true" />;
    case 'sec-explorations':
      return <Compass className="w-4 h-4" aria-hidden="true" />;
    case 'sec-about':
      return <User className="w-4 h-4" aria-hidden="true" />;
    case 'sec-tools':
      return <Wrench className="w-4 h-4" aria-hidden="true" />;
    case 'sec-recommend':
      return <Sparkles className="w-4 h-4" aria-hidden="true" />;
    case 'sec-stats':
      return <BarChart3 className="w-4 h-4" aria-hidden="true" />;
    case 'sec-contact':
      return <Mail className="w-4 h-4" aria-hidden="true" />;
    case 'page-work-archive':
      return <Layers className="w-4 h-4" aria-hidden="true" />;
    case 'action-copy-email':
      return <Copy className="w-4 h-4" aria-hidden="true" />;
    case 'action-whatsapp':
      return <MessageSquare className="w-4 h-4" aria-hidden="true" />;
    default:
      return <ArrowUpRight className="w-4 h-4" aria-hidden="true" />;
  }
}

type VoiceStatus = 'idle' | 'listening' | 'matched' | 'error' | 'unsupported';

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceMessage, setVoiceMessage] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const autoExecuteTimerRef = useRef<number | null>(null);
  const latestInterimRef = useRef<string>('');
  const handledFinalResultRef = useRef<boolean>(false);
  const voiceStatusRef = useRef<VoiceStatus>('idle');

  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    voiceStatusRef.current = voiceStatus;
  }, [voiceStatus]);

  const filteredItems = useMemo(
    () => filterCommandItems(COMMAND_PALETTE_ITEMS, query),
    [query]
  );

  const groupedSections = useMemo(
    () => groupCommandItems(filteredItems),
    [filteredItems]
  );

  const flatItems = useMemo(
    () => groupedSections.flatMap((section) => section.items),
    [groupedSections]
  );

  // Global keyboard shortcut listener: Cmd+K / Ctrl+K (plus Escape to close)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
        return;
      }

      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onOpen, onClose]);

  const stopVoiceRecognition = useCallback((resetState = false) => {
    if (autoExecuteTimerRef.current !== null) {
      window.clearTimeout(autoExecuteTimerRef.current);
      autoExecuteTimerRef.current = null;
    }

    const activeRecognition = recognitionRef.current;
    if (activeRecognition) {
      recognitionRef.current = null;
      try {
        activeRecognition.onstart = null;
        activeRecognition.onresult = null;
        activeRecognition.onerror = null;
        activeRecognition.onend = null;
        activeRecognition.abort();
      } catch {
        // Ignore abort errors from already-ended sessions
      }
    }

    if (resetState) {
      setVoiceStatus('idle');
      setVoiceTranscript('');
      setVoiceMessage('');
    }
  }, []);

  // Cleanup any active speech recognition on unmount
  useEffect(() => {
    return () => {
      stopVoiceRecognition(false);
    };
  }, [stopVoiceRecognition]);

  // Reset search state, lock body scroll, and manage focus on open/close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setQuery('');
      setActiveIndex(0);
      setCopiedNotice(false);
      stopVoiceRecognition(true);

      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 20);

      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = prevOverflow;
      };
    }

    stopVoiceRecognition(true);

    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen, stopVoiceRecognition]);

  // Keep activeIndex in bounds when filtered list changes
  useEffect(() => {
    setActiveIndex(flatItems.length > 0 ? 0 : -1);
  }, [query, flatItems.length]);

  // Keep keyboard-selected option scrolled into view
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const activeItem = flatItems[activeIndex];
    if (!activeItem) return;
    const node = itemRefs.current[activeItem.id];
    if (node) {
      node.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, activeIndex, flatItems]);

  const executeItem = useCallback(
    (item: CommandPaletteItem) => {
      if (item.actionType === 'copy-email') {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(item.target).catch(() => {});
        }
        setCopiedNotice(true);
        window.setTimeout(() => {
          setCopiedNotice(false);
          onClose();
        }, 700);
        return;
      }

      onClose();

      if (item.actionType === 'route') {
        navigate(item.target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (item.actionType === 'external') {
        const anchor = document.createElement('a');
        anchor.href = item.target;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.click();
        return;
      }

      // Section jump
      const scrollToTarget = () => {
        if (item.target === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const el = document.getElementById(item.target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      };

      if (location.pathname !== '/') {
        navigate('/');
        window.setTimeout(scrollToTarget, 140);
      } else {
        window.setTimeout(scrollToTarget, 40);
      }
    },
    [location.pathname, navigate, onClose]
  );

  const processSpokenTranscript = useCallback(
    (spokenText: string) => {
      const trimmed = spokenText.trim();
      if (!trimmed) {
        setVoiceStatus('error');
        setVoiceMessage('No speech detected. Tap the mic and try "Go to contact" or "Show tools".');
        return;
      }

      const match = matchVoiceCommand(trimmed, COMMAND_PALETTE_ITEMS);
      setVoiceTranscript(trimmed);

      if (match.item) {
        const targetItem = match.item;
        setVoiceStatus('matched');
        setVoiceMessage(
          targetItem.group === 'Quick Actions'
            ? `Running ${targetItem.label}`
            : `Navigating to ${targetItem.label}`
        );
        setQuery(targetItem.label);

        if (autoExecuteTimerRef.current !== null) {
          window.clearTimeout(autoExecuteTimerRef.current);
        }
        autoExecuteTimerRef.current = window.setTimeout(() => {
          autoExecuteTimerRef.current = null;
          executeItem(targetItem);
        }, 420);
        return;
      }

      setVoiceStatus('error');
      setQuery(match.cleanedQuery || trimmed);
      setVoiceMessage(
        `No command matched "${trimmed}". Try saying "Go to contact" or "Show tools".`
      );
    },
    [executeItem]
  );

  const handleToggleVoice = useCallback(() => {
    if (voiceStatus === 'listening') {
      stopVoiceRecognition(true);
      inputRef.current?.focus();
      return;
    }

    stopVoiceRecognition(false);

    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor) {
      setVoiceStatus('unsupported');
      setVoiceTranscript('');
      setVoiceMessage(
        'Voice recognition is not supported in this browser. Try Chrome, Edge, or Safari, or type a command above.'
      );
      return;
    }

    latestInterimRef.current = '';
    handledFinalResultRef.current = false;

    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceStatus('listening');
        setVoiceTranscript('');
        setVoiceMessage('Listening... try "Go to contact" or "Show tools"');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const text = result?.[0]?.transcript ?? '';
          if (result?.isFinal) {
            finalText += text;
          } else {
            interim += text;
          }
        }

        if (interim.trim()) {
          latestInterimRef.current = interim.trim();
          setVoiceTranscript(interim.trim());
        }

        if (finalText.trim()) {
          handledFinalResultRef.current = true;
          latestInterimRef.current = finalText.trim();
          recognitionRef.current = null;
          try {
            recognition.stop();
          } catch {
            // Ignore stop errors if already stopping
          }
          processSpokenTranscript(finalText.trim());
        }
      };

      recognition.onerror = (event) => {
        recognitionRef.current = null;
        handledFinalResultRef.current = true;
        const friendlyMessage = formatVoiceErrorMessage(event.error);
        if (!friendlyMessage) {
          setVoiceStatus('idle');
          setVoiceMessage('');
          return;
        }
        setVoiceStatus('error');
        setVoiceMessage(friendlyMessage);
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        if (!handledFinalResultRef.current) {
          if (latestInterimRef.current) {
            handledFinalResultRef.current = true;
            processSpokenTranscript(latestInterimRef.current);
          } else if (voiceStatusRef.current === 'listening') {
            setVoiceStatus('idle');
            setVoiceMessage('');
          }
        }
      };

      recognitionRef.current = recognition;
      setVoiceStatus('listening');
      setVoiceTranscript('');
      setVoiceMessage('Listening... try "Go to contact" or "Show tools"');
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setVoiceStatus('error');
      setVoiceMessage('Could not start voice recognition. Check microphone permissions and try again.');
    }
  }, [voiceStatus, stopVoiceRecognition, processSpokenTranscript]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => getNextCommandIndex(prev, 1, flatItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => getNextCommandIndex(prev, -1, flatItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && flatItems[activeIndex]) {
        executeItem(flatItems[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const isListening = voiceStatus === 'listening';
  let runningIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="command-palette-backdrop"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-md flex items-start justify-center px-3 sm:px-4 pt-[12vh] sm:pt-[15vh] pb-6"
        >
          <motion.div
            id="command-palette-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl border border-white/12 bg-surface/95 shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[74vh]"
          >
            {/* Search Input Header */}
            <div className="shrink-0 flex items-center gap-3 px-4 py-3.5 border-b border-stroke">
              <Search className="w-4 h-4 text-brand-blue shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (voiceStatus === 'error' || voiceStatus === 'unsupported') {
                    setVoiceStatus('idle');
                    setVoiceMessage('');
                  }
                }}
                onKeyDown={handleInputKeyDown}
                placeholder='Jump to a section or tap the mic ("Go to contact")...'
                aria-label="Search portfolio sections and actions"
                aria-controls="command-palette-listbox"
                aria-activedescendant={
                  activeIndex >= 0 && flatItems[activeIndex]
                    ? `command-option-${flatItems[activeIndex].id}`
                    : undefined
                }
                autoComplete="off"
                spellCheck={false}
                className="flex-1 min-w-0 bg-transparent text-sm sm:text-base text-text-primary placeholder:text-muted/80 focus:outline-none focus-visible:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search query"
                  className="p-1 rounded-md text-muted hover:text-text-primary hover:bg-stroke/60 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                data-testid="command-palette-voice-btn"
                onClick={handleToggleVoice}
                aria-pressed={isListening}
                aria-label={isListening ? 'Stop voice recognition' : 'Start voice command'}
                title={
                  isListening
                    ? 'Stop listening'
                    : 'Voice command — say "Go to contact" or "Show tools"'
                }
                className={`relative w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                  isListening
                    ? 'bg-brand-blue/25 border-brand-blue/65 text-brand-light'
                    : voiceStatus === 'matched'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-bg border-stroke text-muted hover:text-text-primary hover:border-brand-blue/50'
                }`}
              >
                {isListening && !prefersReducedMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg border border-brand-blue/70"
                    initial={{ opacity: 0.7, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.32 }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
                {voiceStatus === 'unsupported' ? (
                  <MicOff className="w-3.5 h-3.5 relative z-10" aria-hidden="true" />
                ) : (
                  <Mic className="w-3.5 h-3.5 relative z-10" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close command palette"
                className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-stroke bg-bg text-[10px] font-mono uppercase tracking-wider text-muted hover:text-text-primary transition-colors shrink-0"
              >
                ESC
              </button>
            </div>

            {/* Voice Recognition Live Status Strip */}
            <AnimatePresence initial={false}>
              {voiceStatus !== 'idle' && (
                <motion.div
                  data-testid="command-palette-voice-status"
                  data-voice-status={voiceStatus}
                  role="status"
                  aria-live="polite"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: 'easeOut' }}
                  className="shrink-0 overflow-hidden border-b border-stroke bg-bg/85"
                >
                  <div className="px-4 py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isListening && (
                        <div
                          className="flex items-end gap-[2px] h-3.5 shrink-0"
                          aria-hidden="true"
                        >
                          {[0.4, 1, 0.65, 0.9].map((peak, barIdx) => (
                            <motion.span
                              key={barIdx}
                              className="w-[2px] rounded-full bg-brand-blue origin-bottom"
                              style={{ height: '14px' }}
                              animate={
                                prefersReducedMotion
                                  ? { scaleY: peak }
                                  : { scaleY: [0.3, peak, 0.4, Math.min(1, peak + 0.15), 0.3] }
                              }
                              transition={{
                                duration: 0.9 + barIdx * 0.12,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          ))}
                        </div>
                      )}
                      {voiceStatus === 'matched' && (
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                      )}
                      {(voiceStatus === 'error' || voiceStatus === 'unsupported') && (
                        <MicOff className="w-3.5 h-3.5 text-muted shrink-0" aria-hidden="true" />
                      )}

                      <div className="min-w-0">
                        <p className="text-xs text-text-primary truncate">
                          {isListening && voiceTranscript
                            ? `"${voiceTranscript}"`
                            : voiceStatus === 'matched' && voiceTranscript
                              ? `"${voiceTranscript}" — ${voiceMessage}`
                              : voiceMessage}
                        </p>
                        {isListening && !voiceTranscript && (
                          <p className="text-[11px] text-muted truncate mt-0.5">
                            Say: {VOICE_COMMAND_EXAMPLES.map((ex) => `"${ex}"`).join(' · ')}
                          </p>
                        )}
                      </div>
                    </div>

                    {isListening ? (
                      <button
                        type="button"
                        onClick={() => stopVoiceRecognition(true)}
                        className="text-[11px] font-mono text-brand-light hover:text-text-primary px-2 py-0.5 rounded border border-brand-blue/35 bg-brand-blue/15 shrink-0 transition-colors"
                      >
                        Stop
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => stopVoiceRecognition(true)}
                        aria-label="Dismiss voice status"
                        className="p-1 rounded text-muted hover:text-text-primary transition-colors shrink-0"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results List */}
            <div
              id="command-palette-listbox"
              role="listbox"
              aria-label="Navigation commands"
              className="flex-1 min-h-0 overflow-y-auto px-2 py-2.5 space-y-3"
            >
              {groupedSections.length === 0 ? (
                <div className="py-10 px-4 text-center">
                  <p className="text-sm text-text-primary">No matching sections or actions.</p>
                  <p className="text-xs text-muted mt-1">
                    Try searching for &ldquo;Work&rdquo;, &ldquo;Services&rdquo;, &ldquo;Tools&rdquo;, or &ldquo;Contact&rdquo;.
                  </p>
                </div>
              ) : (
                groupedSections.map((section) => (
                  <div key={section.group}>
                    <div className="px-3 pb-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
                      {section.group}
                    </div>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        runningIndex += 1;
                        const currentIdx = runningIndex;
                        const isSelected = currentIdx === activeIndex;
                        const showCopied = item.actionType === 'copy-email' && copiedNotice;

                        return (
                          <button
                            key={item.id}
                            id={`command-option-${item.id}`}
                            ref={(el) => {
                              itemRefs.current[item.id] = el;
                            }}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onMouseEnter={() => setActiveIndex(currentIdx)}
                            onClick={() => executeItem(item)}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors border ${
                              isSelected
                                ? 'bg-brand-blue/15 border-brand-blue/35 text-text-primary'
                                : 'bg-transparent border-transparent text-text-primary/85 hover:bg-stroke/40'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                                  isSelected
                                    ? 'bg-brand-blue/20 border-brand-blue/40 text-brand-light'
                                    : 'bg-bg border-stroke text-muted'
                                }`}
                              >
                                {showCopied ? (
                                  <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                                ) : (
                                  getItemIcon(item.id)
                                )}
                              </span>
                              <div className="min-w-0">
                                <span className="block text-sm font-medium truncate">
                                  {showCopied ? 'Email copied to clipboard' : item.label}
                                </span>
                                <span className="block text-xs text-muted truncate">
                                  {item.description}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {item.shortcut && !isSelected && (
                                <span className="hidden sm:inline-block text-[11px] font-mono tabular-nums text-muted/65">
                                  {item.shortcut.padStart(2, '0')}
                                </span>
                              )}
                              {isSelected && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-brand-light font-mono">
                                  <CornerDownLeft className="w-3.5 h-3.5" aria-hidden="true" />
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Shortcuts Legend */}
            <div className="shrink-0 px-4 py-2.5 border-t border-stroke bg-bg/70 flex items-center justify-between text-[11px] text-muted">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border border-stroke bg-surface font-mono text-[10px] text-text-primary/80">
                    ↑↓
                  </kbd>
                  Navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border border-stroke bg-surface font-mono text-[10px] text-text-primary/80">
                    ↵
                  </kbd>
                  Select
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <Mic className="w-3 h-3 text-brand-blue" aria-hidden="true" />
                  Voice ready
                </span>
              </div>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-stroke bg-surface font-mono text-[10px] text-text-primary/80">
                  ⌘K
                </kbd>
                <span className="hidden sm:inline">/ Ctrl+K</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
