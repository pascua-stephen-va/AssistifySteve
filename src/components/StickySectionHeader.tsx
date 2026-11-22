import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  PORTFOLIO_SECTIONS,
  PortfolioSectionMeta,
  StickySectionState,
  resolveStickySectionState,
} from '../utils/stickySection.ts';

interface StickySectionHeaderProps {
  onNavigateSection?: (sectionId: string) => void;
}

const INITIAL_STATE: StickySectionState = {
  visible: false,
  activeSection: PORTFOLIO_SECTIONS[0],
  activeIndex: 0,
  totalSections: PORTFOLIO_SECTIONS.length,
  sectionProgress: 0,
  prevSection: null,
  nextSection: PORTFOLIO_SECTIONS[1] ?? null,
};

export const StickySectionHeader: React.FC<StickySectionHeaderProps> = ({
  onNavigateSection,
}) => {
  const [state, setState] = useState<StickySectionState>(INITIAL_STATE);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Track active portfolio section and intra-section reading progress via rAF-throttled scroll
  useEffect(() => {
    let rafId = 0;

    const measure = () => {
      rafId = 0;
      const rects = PORTFOLIO_SECTIONS.map((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          id: sec.id,
          top: rect.top,
          height: rect.height,
        };
      }).filter((item): item is { id: string; top: number; height: number } => item !== null);

      const nextState = resolveStickySectionState(
        rects,
        window.scrollY,
        window.innerHeight
      );

      setState((prev) => {
        const prevProgressRounded = Math.round(prev.sectionProgress * 100);
        const nextProgressRounded = Math.round(nextState.sectionProgress * 100);
        if (
          prev.visible === nextState.visible &&
          prev.activeSection.id === nextState.activeSection.id &&
          prevProgressRounded === nextProgressRounded
        ) {
          return prev;
        }
        return nextState;
      });
    };

    const scheduleMeasure = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, []);

  // Close section switcher popover when hidden, on Escape, or on outside click
  useEffect(() => {
    if (!state.visible && menuOpen) {
      setMenuOpen(false);
    }
  }, [state.visible, menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [menuOpen]);

  const jumpToSection = useCallback(
    (section: PortfolioSectionMeta) => {
      setMenuOpen(false);
      if (onNavigateSection) {
        onNavigateSection(section.id);
        return;
      }

      if (section.id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const el = document.getElementById(section.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [onNavigateSection]
  );

  const { visible, activeSection, totalSections, sectionProgress, prevSection, nextSection } =
    state;

  return (
    <div
      data-testid="sticky-section-header-root"
      className="fixed top-[74px] md:top-[86px] left-0 right-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none"
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={containerRef}
            data-testid="sticky-section-header"
            data-active-section={activeSection.id}
            role="region"
            aria-label="Active portfolio section indicator"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative max-w-[calc(100vw-24px)]"
          >
            {/* Main Compact Glass Ribbon */}
            <div className="relative rounded-full border border-white/10 bg-surface/90 backdrop-blur-md shadow-lg shadow-black/45 px-2.5 sm:px-3.5 py-1.5 flex items-center gap-2 sm:gap-2.5">
              {/* Clipped bottom intra-section reading hairline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full overflow-hidden"
              >
                <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-stroke/60 rounded-full overflow-hidden">
                  <div
                    data-testid="sticky-section-progress"
                    className="h-full accent-gradient origin-left transition-transform duration-150 ease-out"
                    style={{ transform: `scaleX(${sectionProgress})` }}
                  />
                </div>
              </div>

              {/* Active section numeric index */}
              <div className="relative z-10 inline-flex items-center gap-1.5 shrink-0 pl-0.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_hsl(var(--brand-blue))]"
                  aria-hidden="true"
                />
                <span
                  data-testid="sticky-section-index"
                  className="font-mono text-[11px] tabular-nums tracking-tight text-brand-light"
                >
                  {activeSection.index}
                  <span className="text-muted/70">/{String(totalSections).padStart(2, '0')}</span>
                </span>
              </div>

              <span className="relative z-10 w-px h-3.5 bg-stroke shrink-0" aria-hidden="true" />

              {/* Section title + dropdown switcher trigger */}
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-controls="sticky-section-menu"
                aria-label={`Current section: ${activeSection.label}. Toggle section navigation menu`}
                className="relative z-10 inline-flex items-center gap-1.5 sm:gap-2 min-w-0 rounded-full px-1.5 py-0.5 text-left hover:bg-white/5 transition-colors"
              >
                <div className="overflow-hidden min-w-0 flex items-center gap-2">
                  <motion.span
                    key={activeSection.id}
                    data-testid="sticky-section-title"
                    initial={prefersReducedMotion ? false : { opacity: 0.25, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-baseline gap-2 min-w-0"
                  >
                    <span className="text-xs sm:text-[13px] font-medium tracking-tight text-text-primary truncate">
                      {activeSection.label}
                    </span>
                    <span className="hidden md:inline text-[11px] text-muted truncate">
                      {activeSection.subtitle}
                    </span>
                  </motion.span>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted shrink-0 transition-transform duration-200 ${
                    menuOpen ? 'rotate-180 text-brand-light' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              <span className="relative z-10 w-px h-3.5 bg-stroke shrink-0" aria-hidden="true" />

              {/* Previous / Next Section Step Buttons */}
              <div className="relative z-10 flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  disabled={!prevSection}
                  onClick={() => prevSection && jumpToSection(prevSection)}
                  aria-label={
                    prevSection
                      ? `Jump to previous section: ${prevSection.label}`
                      : 'No previous section'
                  }
                  title={prevSection ? `Previous: ${prevSection.label}` : undefined}
                  className="w-6 h-6 rounded-full inline-flex items-center justify-center text-muted hover:text-text-primary hover:bg-stroke/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  disabled={!nextSection}
                  onClick={() => nextSection && jumpToSection(nextSection)}
                  aria-label={
                    nextSection
                      ? `Jump to next section: ${nextSection.label}`
                      : 'No next section'
                  }
                  title={nextSection ? `Next: ${nextSection.label}` : undefined}
                  className="w-6 h-6 rounded-full inline-flex items-center justify-center text-muted hover:text-text-primary hover:bg-stroke/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Section Quick-Jump Popover */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  id="sticky-section-menu"
                  role="menu"
                  aria-label="Jump to portfolio section"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 max-w-[calc(100vw-24px)] rounded-2xl border border-white/12 bg-surface/95 backdrop-blur-xl shadow-2xl shadow-black/75 p-1.5"
                >
                  <div className="px-3 py-1.5 flex items-center justify-between border-b border-stroke/80 mb-1">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
                      Portfolio Sections
                    </span>
                    <span className="text-[10px] font-mono text-muted/80 tabular-nums">
                      {activeSection.index} / {String(totalSections).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-0.5">
                    {PORTFOLIO_SECTIONS.map((section) => {
                      const isCurrent = section.id === activeSection.id;
                      return (
                        <button
                          key={section.id}
                          type="button"
                          role="menuitemradio"
                          aria-checked={isCurrent}
                          onClick={() => jumpToSection(section)}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left transition-colors border ${
                            isCurrent
                              ? 'bg-brand-blue/15 border-brand-blue/35 text-text-primary'
                              : 'bg-transparent border-transparent text-text-primary/80 hover:bg-stroke/45 hover:text-text-primary'
                          }`}
                        >
                          <div className="flex items-baseline gap-2.5 min-w-0">
                            <span
                              className={`font-mono text-[11px] tabular-nums shrink-0 ${
                                isCurrent ? 'text-brand-light' : 'text-muted/75'
                              }`}
                            >
                              {section.index}
                            </span>
                            <div className="min-w-0">
                              <span className="block text-xs font-medium truncate">
                                {section.label}
                              </span>
                              <span className="block text-[11px] text-muted truncate">
                                {section.subtitle}
                              </span>
                            </div>
                          </div>
                          {isCurrent && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
