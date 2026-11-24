import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, X } from 'lucide-react';
import { EXPLORATION_ITEMS, VISUAL_GALLERY_IMAGES } from '../data/visualAssets.ts';
import { ExplorationItem } from '../types/index.ts';
import { BRAND_DATA } from '../data/portfolioData.ts';
import { ScrollReveal } from './ScrollReveal.tsx';

gsap.registerPlugin(ScrollTrigger);

export const Explorations: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const [lightboxItem, setLightboxItem] = useState<ExplorationItem | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: contentRef.current,
        pinSpacing: false,
      });

      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { y: 80 },
          {
            y: -80,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { y: 140 },
          {
            y: -140,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    if (lightboxItem) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxItem]);

  const leftItems = EXPLORATION_ITEMS.filter((_, idx) => idx % 2 === 0);
  const rightItems = EXPLORATION_ITEMS.filter((_, idx) => idx % 2 === 1);

  return (
    <section
      id="explorations"
      ref={sectionRef}
      className="relative min-h-[240vh] md:min-h-[280vh] bg-bg overflow-hidden"
    >
      {/* Layer 1: Pinned Center */}
      <div
        ref={contentRef}
        className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-6 pointer-events-none"
      >
        <ScrollReveal className="pointer-events-auto max-w-xl mx-auto">
          <p className="text-xs text-muted uppercase tracking-[0.3em] mb-4">
            Explorations
          </p>
          <h2 className="text-5xl md:text-7xl font-normal tracking-tight text-text-primary mb-4">
            Visual <span className="font-display italic">playground</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-md mx-auto mb-8">
            Interface studies, automation topologies, and system aesthetics crafted alongside live client operations.
          </p>
          <a
            href={BRAND_DATA.social.upwork}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center rounded-full"
          >
            <span
              className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full bg-surface/90 backdrop-blur-md border border-stroke group-hover:border-transparent px-6 py-3 text-sm text-text-primary transition-colors">
              <span>View Upwork Portfolio</span>
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </a>
        </ScrollReveal>
      </div>

      {/* Layer 2: Parallax Columns */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center px-6">
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-2 gap-8 md:gap-40 py-24">
          <div ref={leftColRef} className="flex flex-col items-start gap-20 md:gap-36">
            {leftItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxItem(item)}
                className={`pointer-events-auto group relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden bg-surface border border-stroke shadow-2xl transition-transform duration-500 hover:scale-105 ${item.rotation}`}
              >
                <img
                  src={VISUAL_GALLERY_IMAGES[item.imageKey]}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                  <p className="font-display italic text-lg md:text-xl text-text-primary leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div ref={rightColRef} className="flex flex-col items-end gap-20 md:gap-36 pt-24 md:pt-48">
            {rightItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxItem(item)}
                className={`pointer-events-auto group relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden bg-surface border border-stroke shadow-2xl transition-transform duration-500 hover:scale-105 ${item.rotation}`}
              >
                <img
                  src={VISUAL_GALLERY_IMAGES[item.imageKey]}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                  <p className="font-display italic text-lg md:text-xl text-text-primary leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setLightboxItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl bg-surface border border-stroke overflow-hidden shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              aria-label="Close lightbox"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-bg/80 border border-stroke text-text-primary flex items-center justify-center hover:border-brand-blue transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[4/3] w-full bg-bg">
              <img
                src={VISUAL_GALLERY_IMAGES[lightboxItem.imageKey]}
                alt={lightboxItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex items-center justify-between gap-4 border-t border-stroke">
              <div>
                <h3 id="lightbox-title" className="text-2xl font-display italic text-text-primary">
                  {lightboxItem.title}
                </h3>
                <p className="text-xs text-muted mt-1">
                  {lightboxItem.subtitle} · {lightboxItem.year}
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-brand-blue">
                Exploration
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
