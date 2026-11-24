import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, X } from 'lucide-react';
import { FEATURED_WORK } from '../data/portfolioData.ts';
import { WORK_IMAGES } from '../data/visualAssets.ts';
import { PortfolioItem } from '../types/index.ts';
import { ScrollReveal } from './ScrollReveal.tsx';

const WORK_CATEGORIES = [
  'All',
  'Enterprise Calculations & Audits',
  'AI Workflow & SOP Automation',
  'Retention & Client Cadence',
  'Technical Education & Skills Lab',
  'Generative AI & Prompt Engineering',
];

const SHORT_CATEGORY_LABELS: Record<string, string> = {
  'All': 'All Systems',
  'Enterprise Calculations & Audits': 'Calculations',
  'AI Workflow & SOP Automation': 'Automation',
  'Retention & Client Cadence': 'Retention',
  'Technical Education & Skills Lab': 'Education',
  'Generative AI & Prompt Engineering': 'Generative AI',
};

export const FeaturedWork: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalItem(null);
      }
    };
    if (activeModalItem) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalItem]);

  const filteredWork =
    selectedCategory === 'All'
      ? FEATURED_WORK
      : FEATURED_WORK.filter((item) => item.category === selectedCategory);

  const getBentoSpan = (index: number, total: number) => {
    if (total === 1) return 'md:col-span-12 aspect-[16/9] md:aspect-[21/9]';
    const pattern = index % 4;
    if (index === 4 && total === 5) {
      return 'md:col-span-12 aspect-[16/9] md:aspect-[21/9]';
    }
    if (pattern === 0 || pattern === 3) {
      return 'md:col-span-7 aspect-[16/10] md:aspect-[16/11]';
    }
    return 'md:col-span-5 aspect-[4/3] md:aspect-auto md:min-h-[340px]';
  };

  return (
    <section id="work" className="bg-bg py-16 md:py-24 scroll-mt-[78px] md:scroll-mt-[88px]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-stroke" aria-hidden="true" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">
                Selected Work
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-text-primary mb-3">
              Featured <span className="font-display italic">systems</span>
            </h2>
            <p className="text-sm md:text-base text-muted max-w-lg">
              A selection of engineered tools and AI workflows I&apos;ve built, from concept to launch.
            </p>
          </div>

          {/* View all work button (Desktop) */}
          <Link
            to="/work"
            className="hidden md:inline-flex group relative rounded-full shrink-0"
          >
            <span
              className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-surface border border-stroke group-hover:border-transparent px-5 py-2.5 text-sm text-text-primary transition-colors">
              <span>View all work</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </ScrollReveal>

        {/* Category Filter Tabs */}
        <ScrollReveal delay={0.08}>
        <div
          className="flex flex-wrap items-center gap-2 mb-10"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {WORK_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(category)}
                className={`relative px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'text-bg'
                    : 'bg-surface/60 text-muted hover:text-text-primary border border-stroke'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeWorkCategoryPill"
                    className="absolute inset-0 rounded-full bg-text-primary -z-0"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 500, damping: 34 }
                    }
                  />
                )}
                <span className="relative z-10">
                  {SHORT_CATEGORY_LABELS[category] || category}
                </span>
              </button>
            );
          })}
        </div>
        </ScrollReveal>

        {/* Bento Grid with Smooth Layout & Enter/Exit Filter Transitions */}
        <motion.div
          layout={!prefersReducedMotion}
          transition={{ layout: { type: 'spring', stiffness: 320, damping: 32 } }}
          className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredWork.map((item, index) => (
              <motion.div
                key={item.id}
                layout={!prefersReducedMotion}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.95, y: 18 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.94, y: -10 }
                }
                transition={{
                  layout: { type: 'spring', stiffness: 340, damping: 32 },
                  opacity: { duration: prefersReducedMotion ? 0.12 : 0.28 },
                  scale: { duration: prefersReducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] },
                  y: {
                    duration: prefersReducedMotion ? 0 : 0.34,
                    delay: prefersReducedMotion ? 0 : Math.min(index * 0.045, 0.2),
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                className={getBentoSpan(index, filteredWork.length)}
              >
                <BentoProjectCard
                  item={item}
                  imageSrc={WORK_IMAGES[item.id]}
                  onSelect={() => setActiveModalItem(item)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Mobile View All Link */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-full bg-surface border border-stroke px-5 py-2.5 text-sm text-text-primary"
          >
            <span>View all work</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* System Architecture Details Modal */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="work-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-3xl bg-surface border border-stroke p-6 sm:p-8 shadow-2xl text-text-primary"
          >
            <div className="flex items-start justify-between pb-5 border-b border-stroke">
              <div>
                <p className="text-xs text-muted uppercase tracking-[0.25em] mb-1">
                  System {activeModalItem.step} · {activeModalItem.category}
                </p>
                <h3 id="work-modal-title" className="text-3xl md:text-4xl font-display italic text-text-primary">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="p-2 rounded-full text-muted hover:text-text-primary hover:bg-stroke/60 transition-colors"
                aria-label="Close system details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-5">
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-muted mb-2">
                  Engine Function
                </h4>
                <p className="text-sm text-text-primary/85 leading-relaxed">
                  {activeModalItem.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-muted mb-2.5">
                  System Specifications
                </h4>
                <ul className="space-y-2">
                  {activeModalItem.capabilities.map((cap, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-text-primary/80 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full accent-gradient mt-2 shrink-0" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-bg border border-stroke">
                <span className="text-xs uppercase tracking-[0.2em] text-brand-blue block mb-1">
                  Operational Value
                </span>
                <p className="text-sm text-text-primary">
                  {activeModalItem.impactMetric}
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-stroke flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-muted">
                {activeModalItem.badge}
              </span>
              <a
                href={activeModalItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center rounded-full"
              >
                <span
                  className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <span className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary text-xs font-medium transition-colors">
                  <span>Open {activeModalItem.title}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

interface BentoProjectCardProps {
  item: PortfolioItem;
  imageSrc?: string;
  onSelect: () => void;
}

const BentoProjectCard: React.FC<BentoProjectCardProps> = ({
  item,
  imageSrc,
  onSelect,
}) => {
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [3.5, -3.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-3.5, 3.5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      ref={cardRef}
      type="button"
      data-cursor="project"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.008 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.992 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        transformPerspective: 1100,
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
      }}
      className="group relative w-full h-full bg-surface border border-stroke hover:border-brand-blue/50 rounded-3xl overflow-hidden text-left focus-visible:ring-2 focus-visible:ring-brand-blue transition-colors duration-300 will-change-transform"
    >
      {/* Background Artwork */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={`${item.title} visual showcase`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-bg to-surface" />
      )}

      {/* Halftone Overlay */}
      <div className="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply pointer-events-none" />

      {/* Measured Gradient Scrim for Legible Text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15 pointer-events-none" />

      {/* Card Bottom Metadata & Title (Always Visible) */}
      <div className="relative z-10 h-full w-full p-6 md:p-8 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-4 text-xs text-text-primary/75">
          <span className="tabular-nums tracking-[0.2em] uppercase truncate">
            {item.step} · {item.category}
          </span>
        </div>

        <div>
          <h3 className="text-3xl md:text-4xl font-display italic text-text-primary tracking-tight mb-2">
            {item.title}
          </h3>
          <p className="text-xs md:text-sm text-text-primary/75 max-w-xl line-clamp-2">
            {item.impactMetric}
          </p>
        </div>
      </div>

      {/* Hover Blur Overlay & Animated Gradient Label Pill */}
      <div className="absolute inset-0 z-20 bg-bg/70 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
        <div className="relative rounded-full p-[2px] accent-gradient-animated shadow-xl">
          <div className="rounded-full bg-text-primary text-bg px-6 py-3 text-sm font-medium flex items-center gap-2 whitespace-nowrap">
            <span>View —</span>
            <span className="font-display italic text-lg leading-none">{item.title}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
};
