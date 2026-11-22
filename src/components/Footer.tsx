import React from 'react';
import { ArrowUp } from 'lucide-react';
import { BRAND_DATA } from '../data/portfolioData.ts';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = 2026;

  return (
    <footer className="py-14 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Centered Brand Mark & Tagline */}
        <div className="flex flex-col items-center text-center pb-10 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center mb-3">
            <img
              src="/assets/aistudio/Assistify_Stephen_Logo_Light_372bb444.png"
              alt={BRAND_DATA.name}
              className="h-14 sm:h-16 md:h-20 w-auto object-contain dark:hidden drop-shadow-sm"
            />
            <img
              src="/assets/aistudio/Assistify_Stephen_Logo_Dark.png"
              alt={BRAND_DATA.name}
              className="h-14 sm:h-16 md:h-20 w-auto object-contain hidden dark:block drop-shadow-sm"
            />
          </div>
          <p className="font-sans text-sm sm:text-base font-normal text-slate-500 dark:text-slate-400 max-w-md mb-6">
            "{BRAND_DATA.tagline}"
          </p>

          {/* Back to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="m3-btn-expressive inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 dark:text-slate-300 dark:hover:text-white text-xs font-accent font-semibold tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom row: copyright & details */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-slate-500 dark:text-slate-400">
          <div>
            © {currentYear} {BRAND_DATA.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-5 font-accent font-semibold tracking-wide">
            <a href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Services</a>
            <a href="#about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a>
            <a href="#work" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Featured Work</a>
            <a href="#tools" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tools</a>
            <a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
