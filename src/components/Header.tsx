import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import {
  NAV_ITEMS,
  SCROLL_SPY_TARGETS,
  resolveActiveNavFromPositions,
  resolveNavForPathname,
} from '../utils/navigation';

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const wasMobileMenuOpenRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      if (location.pathname === '/') {
        const triggerLine = window.innerHeight * 0.45;
        const positions = SCROLL_SPY_TARGETS.map((sec) => {
          const el = document.getElementById(sec.targetId);
          return el ? { label: sec.label, top: el.getBoundingClientRect().top } : null;
        }).filter((pos): pos is { label: string; top: number } => pos !== null);

        const isAtPageBottom =
          window.scrollY > 120 &&
          window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 24;

        setActiveNav(resolveActiveNavFromPositions(positions, triggerLine, isAtPageBottom));
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setActiveNav(resolveNavForPathname(location.pathname));
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key or when expanding to desktop viewport
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  // Lock body scroll and manage focus when mobile menu opens/closes
  useEffect(() => {
    if (mobileMenuOpen) {
      wasMobileMenuOpenRef.current = true;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const timer = window.setTimeout(() => {
        closeMenuButtonRef.current?.focus();
      }, 20);
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = previousOverflow;
      };
    }

    if (wasMobileMenuOpenRef.current) {
      wasMobileMenuOpenRef.current = false;
      openMenuButtonRef.current?.focus();
    }
  }, [mobileMenuOpen]);

  const handleLinkClick = (label: string, targetId: string) => {
    setActiveNav(label);
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return;
    }

    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderLogoBadge = () => (
    <a
      href="#hero"
      onClick={(e) => {
        e.preventDefault();
        handleLinkClick('Home', 'hero');
      }}
      aria-label="AssistifySteve Home"
      className="group relative w-9 h-9 rounded-full p-[1.5px] shrink-0 transition-transform duration-300 hover:scale-110"
      style={{
        background:
          'linear-gradient(90deg, hsl(var(--brand-light)) 0%, hsl(var(--brand-blue)) 100%)',
      }}
    >
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(270deg, hsl(var(--brand-light)) 0%, hsl(var(--brand-blue)) 100%)',
        }}
        aria-hidden="true"
      />
      <span className="relative z-10 w-full h-full rounded-full bg-bg flex items-center justify-center font-display italic text-[13px] text-text-primary">
        AS
      </span>
    </a>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-3 sm:px-4 pointer-events-none">
        {/* Desktop Pill Navigation (md and above) */}
        <nav
          aria-label="Primary navigation"
          className={`pointer-events-auto hidden md:inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface/95 px-2 py-2 transition-shadow duration-300 max-w-full ${
            scrolled ? 'shadow-md shadow-black/30' : ''
          }`}
        >
          {renderLogoBadge()}

          <div className="w-px h-5 bg-stroke mx-1 shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleLinkClick(item.label, item.targetId)}
                  className={`inline-flex items-center text-sm rounded-full px-4 py-2 whitespace-nowrap shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'text-text-primary bg-stroke/50'
                      : 'text-muted hover:text-text-primary hover:bg-stroke/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="w-px h-5 bg-stroke mx-1 shrink-0" aria-hidden="true" />

          {onOpenCommandPalette && (
            <>
              <button
                type="button"
                onClick={onOpenCommandPalette}
                aria-label="Open command palette (Cmd+K)"
                title="Quick navigate (Cmd+K / Ctrl+K)"
                className="inline-flex items-center gap-1.5 text-xs rounded-full px-3 py-2 text-muted hover:text-text-primary hover:bg-stroke/50 transition-colors whitespace-nowrap shrink-0"
              >
                <Search className="w-3.5 h-3.5" aria-hidden="true" />
                <kbd className="font-mono text-[11px] tracking-tight text-muted/90">⌘K</kbd>
              </button>

              <div className="w-px h-5 bg-stroke mx-1 shrink-0" aria-hidden="true" />
            </>
          )}

          <button
            type="button"
            onClick={() => handleLinkClick('Contact', 'contact')}
            data-active={activeNav === 'Contact' ? 'true' : 'false'}
            aria-current={activeNav === 'Contact' ? 'location' : undefined}
            className="group relative inline-flex items-center rounded-full shrink-0 whitespace-nowrap"
          >
            <span
              className={`absolute -inset-[2px] rounded-full accent-gradient-animated transition-opacity duration-300 ${
                activeNav === 'Contact' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              aria-hidden="true"
            />
            <span
              className={`relative z-10 inline-flex items-center gap-1 text-sm rounded-full px-4 py-2 bg-surface backdrop-blur-md text-text-primary border transition-colors ${
                activeNav === 'Contact'
                  ? 'border-transparent'
                  : 'border-stroke group-hover:border-transparent'
              }`}
            >
              <span>Say hi</span>
              <span aria-hidden="true">↗</span>
            </span>
          </button>
        </nav>

        {/* Mobile Compact Pill Bar (< md) */}
        <nav
          aria-label="Mobile navigation bar"
          className={`pointer-events-auto flex md:hidden items-center justify-between w-full max-w-md rounded-full backdrop-blur-md border border-white/10 bg-surface/95 px-2 py-2 transition-shadow duration-300 ${
            scrolled ? 'shadow-md shadow-black/30' : ''
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {renderLogoBadge()}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium tracking-tight text-text-primary truncate">
                AssistifySteve
              </span>
              <span
                className="text-[11px] uppercase tracking-[0.16em] text-muted border-l border-stroke pl-2 truncate"
                aria-label={`Current section: ${activeNav}`}
              >
                {activeNav}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleLinkClick('Contact', 'contact')}
              data-active={activeNav === 'Contact' ? 'true' : 'false'}
              aria-current={activeNav === 'Contact' ? 'location' : undefined}
              className={`inline-flex items-center gap-1 text-xs rounded-full px-3 py-2 border transition-colors whitespace-nowrap ${
                activeNav === 'Contact'
                  ? 'bg-brand-blue/15 text-brand-light border-brand-blue/60'
                  : 'bg-bg/70 text-text-primary border-stroke hover:border-white/25'
              }`}
            >
              <span>Say hi</span>
              <span aria-hidden="true">↗</span>
            </button>

            <button
              ref={openMenuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-overlay"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="w-9 h-9 rounded-full bg-bg/80 border border-stroke flex items-center justify-center text-text-primary hover:bg-stroke/50 transition-colors shrink-0"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Menu className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Fullscreen Hamburger Menu Overlay (< md) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setMobileMenuOpen(false);
              }
            }}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] md:hidden bg-bg/95 backdrop-blur-2xl flex flex-col justify-between pt-4 pb-8 px-3 sm:px-4 overflow-y-auto focus:outline-none"
          >
            {/* Overlay Top Bar matching mobile pill alignment */}
            <div className="mx-auto w-full max-w-md flex items-center justify-between rounded-full border border-white/10 bg-surface/95 px-2 py-2 shadow-lg shadow-black/40">
              <div className="flex items-center gap-2.5 min-w-0">
                {renderLogoBadge()}
                <span className="text-sm font-medium tracking-tight text-text-primary truncate">
                  AssistifySteve
                </span>
              </div>

              <button
                ref={closeMenuButtonRef}
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="w-9 h-9 rounded-full bg-bg/80 border border-stroke flex items-center justify-center text-text-primary hover:bg-stroke/50 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Center Staggered Navigation List */}
            <motion.nav
              aria-label="Mobile menu sections"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-md flex-1 flex flex-col justify-center py-6"
            >
              <div className="flex items-center justify-between px-3 mb-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                  Navigation
                </p>
                {onOpenCommandPalette && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.setTimeout(() => onOpenCommandPalette(), 60);
                    }}
                    aria-label="Open command palette"
                    className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text-primary px-2.5 py-1 rounded-full border border-stroke bg-surface/80 transition-colors"
                  >
                    <Search className="w-3 h-3" aria-hidden="true" />
                    <span>Quick Jump</span>
                  </button>
                )}
              </div>

              <ul className="space-y-1.5">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = activeNav === item.label;
                  return (
                    <motion.li
                      key={item.label}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.24,
                        delay: prefersReducedMotion ? 0 : 0.04 + idx * 0.04,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleLinkClick(item.label, item.targetId)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left transition-colors ${
                          isActive
                            ? 'bg-surface border-brand-blue/40 text-text-primary'
                            : 'bg-transparent border-transparent text-muted hover:bg-surface/70 hover:border-stroke hover:text-text-primary'
                        }`}
                      >
                        <div className="flex items-baseline gap-4 min-w-0">
                          <span className="text-xs font-mono text-muted/80 tabular-nums shrink-0">
                            {item.index}
                          </span>
                          <div className="min-w-0">
                            <span
                              className={`block text-2xl sm:text-3xl leading-tight ${
                                isActive
                                  ? 'font-display italic text-text-primary'
                                  : 'font-normal tracking-tight'
                              }`}
                            >
                              {item.label}
                            </span>
                            <span className="block text-xs text-muted mt-0.5 truncate">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>

                        <span className="shrink-0 ml-3 flex items-center gap-2">
                          {isActive ? (
                            <span
                              className="w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_8px_hsl(var(--brand-blue))]"
                              aria-label="Active section"
                            />
                          ) : (
                            <span className="text-sm text-muted/60" aria-hidden="true">
                              ↗
                            </span>
                          )}
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.nav>

            {/* Bottom Overlay CTA & Brand Footer */}
            <div className="mx-auto w-full max-w-md space-y-4 pt-5 border-t border-stroke">
              <button
                type="button"
                onClick={() => handleLinkClick('Contact', 'contact')}
                className="group relative w-full inline-flex items-center justify-center rounded-full"
              >
                <span
                  className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <span className="relative z-10 w-full inline-flex items-center justify-center gap-2 text-sm font-medium rounded-full px-5 py-3.5 bg-surface text-text-primary">
                  <span>Say hi</span>
                  <span aria-hidden="true">↗</span>
                </span>
              </button>

              <div className="flex items-center justify-between text-xs text-muted px-1">
                <span className="truncate">Simplify. Organize. Automate. Assistified.</span>
                <span className="inline-flex items-center gap-1.5 shrink-0 ml-3 text-text-primary/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  Available
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
