import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import {
  PORTFOLIO_SECTIONS,
  PortfolioSectionMeta,
  resolveStickySectionState,
} from '../utils/stickySection.ts';

interface FloatingNavState {
  canScrollTop: boolean;
  activeSection: PortfolioSectionMeta;
  prevSection: PortfolioSectionMeta | null;
  nextSection: PortfolioSectionMeta | null;
}

const INITIAL_NAV_STATE: FloatingNavState = {
  canScrollTop: false,
  activeSection: PORTFOLIO_SECTIONS[0],
  prevSection: null,
  nextSection: PORTFOLIO_SECTIONS[1] ?? null,
};

export const ScrollToTopButton: React.FC = () => {
  const [navState, setNavState] = useState<FloatingNavState>(INITIAL_NAV_STATE);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const isLandingPage = location.pathname === '/' || location.pathname === '';

  useEffect(() => {
    let rafId = 0;

    const measure = () => {
      rafId = 0;
      const scrollY = window.scrollY;
      const canScrollTop = scrollY > 140;

      if (!isLandingPage) {
        setNavState((prev) =>
          prev.canScrollTop === canScrollTop
            ? prev
            : {
                ...INITIAL_NAV_STATE,
                canScrollTop,
                nextSection: null,
              }
        );
        return;
      }

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

      const isAtPageBottom =
        scrollY > 120 &&
        scrollY + window.innerHeight >= document.documentElement.scrollHeight - 24;

      const resolved = resolveStickySectionState(
        rects,
        scrollY,
        window.innerHeight,
        PORTFOLIO_SECTIONS,
        280,
        isAtPageBottom
      );

      setNavState((prev) => {
        if (
          prev.canScrollTop === canScrollTop &&
          prev.activeSection.id === resolved.activeSection.id &&
          prev.prevSection?.id === resolved.prevSection?.id &&
          prev.nextSection?.id === resolved.nextSection?.id
        ) {
          return prev;
        }
        return {
          canScrollTop,
          activeSection: resolved.activeSection,
          prevSection: resolved.prevSection,
          nextSection: resolved.nextSection,
        };
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
  }, [isLandingPage]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [prefersReducedMotion]);

  const scrollToSection = useCallback(
    (section: PortfolioSectionMeta | null) => {
      if (!section) return;
      if (section.id === 'hero') {
        scrollToTop();
        return;
      }
      const el = document.getElementById(section.id);
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    },
    [prefersReducedMotion, scrollToTop]
  );

  // On non-landing pages (e.g. /work archive), show a single back-to-top button once scrolled
  if (!isLandingPage) {
    return (
      <AnimatePresence>
        {navState.canScrollTop && (
          <motion.button
            type="button"
            data-testid="floating-back-to-top"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            title="Back to top"
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 w-11 h-11 rounded-full bg-surface/90 backdrop-blur-md border border-white/12 text-text-primary hover:border-brand-blue hover:text-brand-light flex items-center justify-center shadow-lg shadow-black/50 transition-colors"
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    );
  }

  const { canScrollTop, activeSection, prevSection, nextSection } = navState;

  return (
    <motion.nav
      aria-label="Section scroll navigation"
      data-testid="floating-section-nav"
      data-active-section={activeSection.id}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center gap-1 rounded-full bg-surface/90 backdrop-blur-md border border-white/12 p-1.5 shadow-xl shadow-black/55"
    >
      {/* Back to Top Arrow */}
      <button
        type="button"
        data-testid="floating-back-to-top"
        disabled={!canScrollTop}
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        title="Back to top"
        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
          canScrollTop
            ? 'bg-brand-blue/15 border-brand-blue/35 text-brand-light hover:bg-brand-blue/25 hover:border-brand-blue hover:text-text-primary'
            : 'bg-transparent border-transparent text-muted/40 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" aria-hidden="true" />
      </button>

      <div className="w-5 h-px bg-stroke/80 my-0.5" aria-hidden="true" />

      {/* Previous Section Arrow */}
      <button
        type="button"
        data-testid="floating-prev-section"
        disabled={!prevSection}
        onClick={() => scrollToSection(prevSection)}
        aria-label={
          prevSection ? `Previous section: ${prevSection.label}` : 'No previous section'
        }
        title={prevSection ? `Previous: ${prevSection.label}` : 'At first section'}
        className="w-9 h-9 rounded-full flex items-center justify-center text-text-primary/85 hover:text-text-primary hover:bg-stroke/65 disabled:text-muted/35 disabled:pointer-events-none transition-colors"
      >
        <ChevronUp className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Next Section Arrow */}
      <button
        type="button"
        data-testid="floating-next-section"
        disabled={!nextSection}
        onClick={() => scrollToSection(nextSection)}
        aria-label={nextSection ? `Next section: ${nextSection.label}` : 'No next section'}
        title={nextSection ? `Next: ${nextSection.label}` : 'At last section'}
        className="w-9 h-9 rounded-full flex items-center justify-center text-text-primary/85 hover:text-text-primary hover:bg-stroke/65 disabled:text-muted/35 disabled:pointer-events-none transition-colors"
      >
        <ChevronDown className="w-4 h-4" aria-hidden="true" />
      </button>
    </motion.nav>
  );
};
