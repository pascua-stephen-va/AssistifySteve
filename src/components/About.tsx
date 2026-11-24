import React from 'react';
import { Award, Terminal, BookOpen, ArrowRight } from 'lucide-react';
import { BRAND_DATA } from '../data/portfolioData.ts';
import { ScrollReveal } from './ScrollReveal.tsx';

export const About: React.FC = () => {
  return (
    <section id="about" className="bg-bg py-16 md:py-24 scroll-mt-[78px] md:scroll-mt-[88px]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Portrait & Credibility Anchor */}
          <ScrollReveal className="lg:col-span-5">
            <div className="rounded-3xl bg-surface border border-stroke p-6 sm:p-8">
              <div className="min-h-[340px] sm:aspect-square w-full rounded-2xl bg-bg border border-stroke p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 halftone-overlay opacity-25 pointer-events-none" />
                {/* Portrait Ring */}
                <div
                  className="relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full p-[2px] mb-5 shrink-0 accent-gradient"
                >
                  <div className="w-full h-full rounded-full bg-bg overflow-hidden">
                    <img
                      src="/assets/aistudio/Gemini_Generated_Image_rsaybqrsaybqrsay_-_Copy_69138b59.jpg"
                      alt="Stephen Pascua — IT & Administrative Virtual Assistant"
                      className="w-full h-full rounded-full object-cover object-top"
                    />
                  </div>
                </div>

                <h3 className="relative z-10 font-display italic text-3xl text-text-primary mb-1">
                  Stephen Pascua
                </h3>
                <p className="relative z-10 text-xs text-brand-blue uppercase tracking-[0.2em] mb-3">
                  {BRAND_DATA.title}
                </p>
                <p className="relative z-10 text-xs text-muted max-w-xs">
                  &ldquo;{BRAND_DATA.tagline}&rdquo;
                </p>
              </div>

              {/* Credibility Anchor */}
              <div className="mt-5 p-4 rounded-2xl bg-bg border border-stroke">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface border border-stroke flex items-center justify-center text-brand-blue shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-brand-blue">
                      Credibility Anchor
                    </div>
                    <div className="text-sm font-medium text-text-primary mt-0.5">
                      {BRAND_DATA.credibilityAnchor}
                    </div>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      National Competency Certification in specialized executive administration, ICT systems, and virtual team mentorship.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Narrative & Pillars */}
          <ScrollReveal delay={0.12} className="lg:col-span-7 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-stroke" aria-hidden="true" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">
                The Professional Behind {BRAND_DATA.name}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-text-primary mb-6 leading-[1.1]">
              Turning chaotic, disconnected workflows into <span className="font-display italic">structured systems.</span>
            </h2>

            <div className="space-y-4 text-sm md:text-base text-muted leading-relaxed mb-8">
              <p>
                With over <strong className="text-text-primary font-medium">10+ years of hands-on industry experience</strong>,
                Steve operates at the intersection of technical IT rigor, high-stakes executive operations, and operational coaching.
                Where most administrative support operates reactively, Steve builds the underlying system architecture first.
              </p>
              <p>
                From untangling sprawling Google Workspace and Microsoft 365 permissions to authoring airtight SOPs and launching
                AI-assisted execution checklists, every workflow is engineered for zero-friction consistency.
              </p>
              <p>
                As a certified coach and trainer, Steve doesn&apos;t just execute tasks—he trains and upskills teams in industry best practices,
                ensuring your operational infrastructure scales sustainably.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              <div className="p-5 rounded-2xl bg-surface/60 border border-stroke">
                <div className="flex items-center gap-2.5 mb-2 text-sm font-medium text-text-primary">
                  <Terminal className="w-4 h-4 text-brand-blue" />
                  <span>Technical IT Background</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Cloud tenant administration, access controls, network troubleshooting, and zero-trust security policies.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface/60 border border-stroke">
                <div className="flex items-center gap-2.5 mb-2 text-sm font-medium text-text-primary">
                  <BookOpen className="w-4 h-4 text-brand-blue" />
                  <span>Certified Pedagogical Rigor</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Authoring step-by-step SOPs and training materials that reduce ambiguity and onboarding latency.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#recommend"
                className="group relative inline-flex items-center rounded-full"
              >
                <span
                  className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <span className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary text-sm font-medium transition-colors">
                  <span>Find Your Solution Fit</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>

              <a
                href="#work"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface border border-stroke text-text-primary hover:border-brand-blue text-sm font-medium transition-colors"
              >
                <span>Explore Featured Systems</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
