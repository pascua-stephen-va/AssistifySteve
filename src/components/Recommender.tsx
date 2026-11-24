import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Shield, Sparkles, Layers, Wrench } from 'lucide-react';
import { analyzeWorkflowNeeds } from '../utils/recommender.ts';
import { RecommendationResult } from '../types/index.ts';
import { ScrollReveal } from './ScrollReveal.tsx';

const SAMPLE_PROMPTS = [
  'Inbox overload and scheduling conflicts',
  'Manual data entry and spreadsheet consolidation',
  'Setting up Google Workspace and security permissions',
];

export const Recommender: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  const runEngine = (query: string) => {
    setIsAnalyzing(true);
    setRecommendation(null);
    window.setTimeout(() => {
      const result = analyzeWorkflowNeeds(query);
      setRecommendation(result);
      setIsAnalyzing(false);
      window.setTimeout(() => {
        const el = document.getElementById('recommendation-result');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }, 400);
  };

  const handleRunAnalysis = (customText?: string) => {
    const textToAnalyze = customText !== undefined ? customText : prompt;
    if (!textToAnalyze.trim()) {
      runEngine('General administrative workflow streamlining and IT automation');
      return;
    }
    runEngine(textToAnalyze);
  };

  const handleSelectSample = (sampleText: string) => {
    setPrompt(sampleText);
    handleRunAnalysis(sampleText);
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="recommend" className="bg-bg py-16 md:py-24 scroll-mt-[78px] md:scroll-mt-[88px]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <ScrollReveal className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-stroke" aria-hidden="true" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              Interactive Solution Engine
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-text-primary mb-3">
            Find your <span className="font-display italic">fit</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-xl">
            Describe your current operational bottlenecks or IT hurdles. The client-side engine matches the optimal service tier, tool stack, and execution roadmap.
          </p>
        </ScrollReveal>

        {/* Intake Card */}
        <ScrollReveal delay={0.1}>
        <div className="rounded-3xl bg-surface border border-stroke p-6 sm:p-8 md:p-10 mb-10">
          <label
            htmlFor="workflow-prompt-input"
            className="block text-xs uppercase tracking-[0.2em] text-muted mb-3"
          >
            Describe your current operational challenge
          </label>

          <textarea
            id="workflow-prompt-input"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your current workflow bottlenecks, administrative headaches, or IT challenges..."
            className="w-full rounded-2xl p-4 text-sm sm:text-base text-text-primary bg-bg border border-stroke focus:border-brand-blue outline-none transition-colors resize-none mb-5 placeholder:text-muted/60"
          />

          {/* Preset Bottleneck Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <span className="text-xs text-muted shrink-0">
              Try a preset bottleneck:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="px-3.5 py-1.5 rounded-full text-xs bg-bg text-muted hover:text-text-primary border border-stroke hover:border-brand-blue transition-colors"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-stroke">
            <div className="text-xs text-muted flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-brand-blue" />
              <span>Instant client-side algorithmic parsing. No data is stored.</span>
            </div>

            <button
              type="button"
              onClick={() => handleRunAnalysis()}
              disabled={isAnalyzing}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center rounded-full disabled:opacity-50"
            >
              <span
                className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />
              <span className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary text-sm font-medium transition-colors whitespace-nowrap">
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Bottlenecks...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze &amp; Recommend</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
        </ScrollReveal>

        {/* Recommendation Blueprint Card */}
        {recommendation && (
          <div
            id="recommendation-result"
            className="rounded-3xl bg-surface border border-brand-blue/40 p-6 sm:p-8 md:p-10 scroll-mt-24"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stroke mb-6">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-brand-blue">
                  Recommended Service Tier
                </span>
                <h3 className="text-3xl md:text-4xl font-display italic text-text-primary mt-1">
                  {recommendation.primaryTier}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs tabular-nums">
                <span className="px-3.5 py-1.5 rounded-full bg-bg border border-stroke text-text-primary">
                  {recommendation.tierTag}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-bg border border-brand-blue/40 text-brand-blue">
                  Match: {recommendation.matchScore}%
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xs uppercase tracking-[0.2em] text-muted mb-2">
                Strategic Assessment
              </h4>
              <p className="text-sm sm:text-base text-text-primary/85 leading-relaxed bg-bg p-5 rounded-2xl border border-stroke">
                {recommendation.executiveSummary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-5 rounded-2xl bg-bg border border-stroke">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted mb-3">
                  <Wrench className="w-4 h-4 text-brand-blue" />
                  <span>Suggested Tool Stack</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-text-primary">
                  {recommendation.suggestedTools.map((tool, idx) => (
                    <span key={tool} className="inline-flex items-center gap-2">
                      <span>{tool}</span>
                      {idx < recommendation.suggestedTools.length - 1 && (
                        <span className="text-muted" aria-hidden="true">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-bg border border-stroke">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted mb-2">
                  <Layers className="w-4 h-4 text-brand-blue" />
                  <span>Relevant System Pre-Built</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-display italic text-xl text-text-primary">
                      {recommendation.matchedProject.title}
                    </h5>
                    <p className="text-xs text-muted mt-1">
                      {recommendation.matchedProject.reason}
                    </p>
                  </div>
                  <a
                    href={recommendation.matchedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-blue hover:underline shrink-0 flex items-center gap-1 mt-1"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* 3-Step Execution Roadmap */}
            <div className="mb-8">
              <h4 className="text-xs uppercase tracking-[0.2em] text-muted mb-3">
                Tailored 3-Phase Execution Roadmap
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendation.actionRoadmap.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-bg border border-stroke flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-brand-blue block mb-1">
                        {item.step}
                      </span>
                      <h6 className="font-display italic text-xl text-text-primary mb-2">
                        {item.phase}
                      </h6>
                      <p className="text-xs text-muted leading-relaxed">
                        {item.deliverable}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-stroke flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={scrollToContact}
                className="text-xs sm:text-sm text-muted hover:text-text-primary transition-colors"
              >
                Prefer to talk directly? Reach out below
              </button>

              <button
                type="button"
                onClick={scrollToContact}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-text-primary text-bg hover:opacity-90 text-xs sm:text-sm font-medium transition-opacity"
              >
                <span>Engage Steve on this Blueprint</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
