import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { TOOLS_DATA } from '../data/portfolioData.ts';
import { ToolItem } from '../types/index.ts';

const TOOL_ICONS: Record<string, string> = {
  'Microsoft 365': '/assets/aistudio/Microsoft_365_43de437b.png',
  'Google Workspace': '/assets/aistudio/Google_Workspace_dbd5f067.png',
  'Canva': '/assets/aistudio/Canva_fe91223d.png',
  'ChatGPT': '/assets/aistudio/ChatGPT_22b5b73c.png',
  'Microsoft Copilot': '/assets/aistudio/Microsoft_Copilot_d6871487.png',
  'Gemini': '/assets/aistudio/Google_Gemini_68161a74.png',
  'Google Gemini': '/assets/aistudio/Google_Gemini_68161a74.png',
  'Perplexity': '/assets/aistudio/Perplexity_b7ce5a86.png',
  'Notion': '/assets/aistudio/Notion_f1137a11.png',
  'monday.com': '/assets/aistudio/Monday.com_fb6f7eb0.png',
  'Trello': '/assets/aistudio/Trello_8cddd64a.png',
  'GoHighLevel': '/assets/aistudio/GoHighLevel_d3c3ad1a.png',
  'Microsoft Loop': '/assets/aistudio/Microsoft_Loop_9ef76f81.png',
  'Microsoft Teams': '/assets/aistudio/Microsoft_Teams_ed2675b2.png',
  'Zoom': '/assets/aistudio/Zoom_Workspace_16a630bb.png',
  'Zoom Workspace': '/assets/aistudio/Zoom_Workspace_16a630bb.png',
};

const CATEGORIES = [
  'All',
  'AI & Copilots',
  'Cloud Workspaces',
  'Work Management',
  'CRM & Communications',
];

export const ToolsGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const filteredTools =
    selectedCategory === 'All'
      ? TOOLS_DATA
      : TOOLS_DATA.filter((t) => t.category === selectedCategory);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (activeTool && cat !== 'All' && activeTool.category !== cat) {
      setActiveTool(null);
    }
  };

  const getToolVisual = (name: string) => {
    const iconPath = TOOL_ICONS[name];
    if (!iconPath) return null;
    return (
      <img
        src={iconPath}
        alt={`${name} icon`}
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
    );
  };

  return (
    <section id="tools" className="bg-bg py-16 md:py-24 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-stroke" aria-hidden="true" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              Tech Stack &amp; Proficiency
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-text-primary mb-3">
            Tools I <span className="font-display italic">work with</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-xl">
            14 production-grade productivity platforms, enterprise cloud workspaces, AI copilots, and client management ecosystems.
          </p>
        </motion.div>

        {/* Category Filter Tabs (Preserved As-Is) */}
        <div
          className="flex flex-wrap items-center gap-2 mb-10"
          role="tablist"
          aria-label="Tool categories"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleCategoryChange(cat)}
                className={`relative px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'text-bg'
                    : 'bg-surface/70 text-muted hover:text-text-primary border border-stroke'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeToolCategoryPill"
                    className="absolute inset-0 rounded-full bg-text-primary -z-0"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 500, damping: 32 }
                    }
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* 14 Tools Responsive Grid with Smooth Filter Transitions */}
        <motion.div
          layout={!prefersReducedMotion}
          transition={{ layout: { type: 'spring', stiffness: 360, damping: 32 } }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mb-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, index) => {
              const isCurrent = activeTool?.name === tool.name;
              return (
                <motion.button
                  key={tool.name}
                  layout={!prefersReducedMotion}
                  type="button"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.9, y: 12 }
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.88, y: -8 }
                  }
                  transition={{
                    layout: { type: 'spring', stiffness: 380, damping: 30 },
                    opacity: { duration: prefersReducedMotion ? 0.1 : 0.22 },
                    scale: { duration: prefersReducedMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] },
                    y: {
                      duration: prefersReducedMotion ? 0 : 0.26,
                      delay: prefersReducedMotion ? 0 : Math.min(index * 0.025, 0.18),
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  onClick={() => setActiveTool(isCurrent ? null : tool)}
                  className={`group relative rounded-2xl p-4 flex flex-col items-center text-center justify-between min-h-[145px] border transition-colors duration-200 ${
                    isCurrent
                      ? 'bg-surface border-brand-blue ring-1 ring-brand-blue/40'
                      : 'bg-surface/50 border-stroke hover:bg-surface hover:border-white/25'
                  }`}
                >
                  <div className="w-12 h-12 mb-3 p-2 rounded-xl bg-bg border border-stroke flex items-center justify-center shrink-0">
                    {getToolVisual(tool.name)}
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <span className="font-medium text-xs sm:text-sm text-text-primary leading-tight mb-1">
                      {tool.name}
                    </span>
                    <span className="text-[11px] text-muted leading-tight">
                      {tool.proficiencyLevel.split(' ')[0]}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Active Tool Deep-Dive Card */}
        <AnimatePresence>
          {activeTool && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="max-w-2xl mx-auto rounded-3xl bg-surface border border-brand-blue/50 p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 p-2.5 rounded-2xl bg-bg border border-stroke flex items-center justify-center shrink-0">
                    {getToolVisual(activeTool.name)}
                  </div>
                  <div>
                    <h4 className="font-display italic text-2xl text-text-primary">
                      {activeTool.name}
                    </h4>
                    <span className="text-xs text-brand-blue">
                      {activeTool.category} · {activeTool.proficiencyLevel}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  className="p-2 rounded-full text-muted hover:text-text-primary hover:bg-stroke/60 transition-colors"
                  aria-label="Close tool details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-stroke text-xs sm:text-sm text-muted space-y-2">
                <p>
                  <strong className="text-text-primary font-medium">Core Utility:</strong>{' '}
                  {activeTool.description}
                </p>
                <p>
                  <strong className="text-text-primary font-medium">Primary Workflow Integration:</strong>{' '}
                  {activeTool.featuredInWorkflow}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
