import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { FEATURED_WORK } from '../data/portfolioData.ts';
import { WORK_IMAGES } from '../data/visualAssets.ts';

const WORK_CATEGORIES = [
  'All',
  'Enterprise Calculations & Audits',
  'AI Workflow & SOP Automation',
  'Retention & Client Cadence',
  'Technical Education & Skills Lab',
  'Generative AI & Prompt Engineering',
];

export const WorkArchivePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const prefersReducedMotion = useReducedMotion();

  const filtered =
    selectedCategory === 'All'
      ? FEATURED_WORK
      : FEATURED_WORK.filter((item) => item.category === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen bg-bg text-text-primary pt-32 pb-24"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to overview</span>
        </Link>

        <h1 className="text-5xl md:text-7xl font-normal tracking-tight text-text-primary mb-4">
          All <span className="font-display italic">systems</span>
        </h1>
        <p className="text-sm md:text-base text-muted max-w-xl mb-10">
          Complete directory of proprietary engines, AI workflow launchers, and interactive labs engineered by Stephen Pascua.
        </p>

        {/* Category Filter Tabs */}
        <div
          className="flex flex-wrap items-center gap-2 mb-12"
          role="tablist"
          aria-label="Archive project categories"
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
                className={`relative px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'text-bg'
                    : 'bg-surface border border-stroke text-muted hover:text-text-primary'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeArchiveCategoryPill"
                    className="absolute inset-0 rounded-full bg-text-primary -z-0"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 500, damping: 34 }
                    }
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>

        {/* Systems List */}
        <motion.div
          layout={!prefersReducedMotion}
          transition={{ layout: { type: 'spring', stiffness: 320, damping: 32 } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.article
                key={item.id}
                layout={!prefersReducedMotion}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.96, y: 16 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.95, y: -10 }
                }
                transition={{
                  layout: { type: 'spring', stiffness: 340, damping: 32 },
                  opacity: { duration: prefersReducedMotion ? 0.12 : 0.25 },
                  scale: { duration: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] },
                  y: {
                    duration: prefersReducedMotion ? 0 : 0.3,
                    delay: prefersReducedMotion ? 0 : Math.min(index * 0.04, 0.18),
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                data-cursor="project"
                className="rounded-3xl bg-surface border border-stroke overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-[16/9] relative overflow-hidden bg-bg">
                  <img
                    src={WORK_IMAGES[item.id]}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 text-xs uppercase tracking-[0.2em] text-text-primary/80">
                    System {item.step}
                  </span>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-brand-blue uppercase tracking-[0.2em] mb-2">
                      {item.category}
                    </p>
                    <h2 className="text-3xl font-display italic text-text-primary mb-2">
                      {item.title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed mb-5">
                      {item.summary}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {item.capabilities.map((cap, i) => (
                        <li key={i} className="text-xs text-text-primary/80 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full accent-gradient mt-1.5 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-stroke flex items-center justify-between gap-4">
                    <span className="text-xs text-muted">{item.impactMetric}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-text-primary text-bg text-xs font-medium hover:opacity-90 transition-opacity shrink-0"
                    >
                      <span>Launch</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};
