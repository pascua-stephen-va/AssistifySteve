import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { HlsBackgroundVideo } from './HlsBackgroundVideo.tsx';

const HERO_ROLES: { article: string; label: string }[] = [
  { article: 'An', label: 'IT Specialist' },
  { article: 'An', label: 'Ops Architect' },
  { article: 'A', label: 'VA Mentor' },
  { article: 'An', label: 'Automator' },
];
const HERO_VIDEO_URL = '/assets/aistudio/motionsites-background-1ed54127_db250406.mp4';

export const Hero: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '.name-reveal',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      ).fromTo(
        '.blur-in',
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 },
        0.3
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentRole = HERO_ROLES[roleIndex];

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg px-6 pt-28 pb-24"
    >
      {/* Background Video */}
      <HlsBackgroundVideo src={HERO_VIDEO_URL} overlayClassName="bg-black/35" fadeBottom />

      {/* Centered Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Eyebrow */}
        <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">
          ASSISTIFYSTEVE
        </p>

        {/* Name */}
        <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
          Stephen Pascua
        </h1>

        {/* Role Line */}
        <p className="blur-in text-lg md:text-2xl text-muted mb-5 font-body">
          {currentRole.article}{' '}
          <span
            key={roleIndex}
            className="font-display italic text-text-primary text-2xl md:text-3xl animate-role-fade-in inline-block px-1"
          >
            {currentRole.label}
          </span>{' '}
          working globally.
        </p>

        {/* Description */}
        <p className="blur-in text-sm md:text-base text-muted max-w-md mx-auto mb-12 leading-relaxed">
          Designing seamless operational workflows and resilient IT systems by focusing on the unique nuances that bring remote teams to life.
        </p>

        {/* CTA Buttons */}
        <div className="blur-in inline-flex flex-wrap items-center justify-center gap-4">
          {/* See Works: Solid default -> dark with accent gradient ring on hover */}
          <button
            type="button"
            onClick={() => scrollToSection('work')}
            className="group relative rounded-full text-sm transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <span
              className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <span className="relative z-10 inline-flex items-center justify-center rounded-full px-7 py-3.5 bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary font-medium transition-colors duration-200 whitespace-nowrap">
              See Works
            </span>
          </button>

          {/* Reach out...: Outlined default -> accent gradient border ring on hover */}
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="group relative rounded-full text-sm transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <span
              className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <span className="relative z-10 inline-flex items-center justify-center rounded-full px-7 py-3.5 border-2 border-stroke bg-bg text-text-primary group-hover:border-transparent font-medium transition-colors duration-200 whitespace-nowrap">
              Reach out...
            </span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        type="button"
        onClick={() => scrollToSection('work')}
        aria-label="Scroll down to selected work"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-muted hover:text-text-primary transition-colors"
      >
        <span className="text-[11px] uppercase tracking-[0.2em]">SCROLL</span>
        <span className="w-px h-10 bg-stroke relative overflow-hidden block">
          <span className="absolute inset-x-0 top-0 h-1/2 accent-gradient animate-scroll-down block" />
        </span>
      </button>
    </section>
  );
};
