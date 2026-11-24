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

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

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

  // Reset search state, lock body scroll, and manage focus on open/close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setQuery('');
      setActiveIndex(0);
      setCopiedNotice(false);

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

    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

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
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Jump to a section, work archive, or quick action..."
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
                onClick={onClose}
                aria-label="Close command palette"
                className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-stroke bg-bg text-[10px] font-mono uppercase tracking-wider text-muted hover:text-text-primary transition-colors shrink-0"
              >
                ESC
              </button>
            </div>

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
