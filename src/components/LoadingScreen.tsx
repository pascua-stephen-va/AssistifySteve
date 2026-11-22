import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const ROTATING_WORDS = ['Simplify', 'Organize', 'Automate', 'Assistified'];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let completeTimer = 0;
    const duration = 3200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const nextCount = Math.floor(progress * 100);
      const nextWordIndex = Math.min(
        ROTATING_WORDS.length - 1,
        Math.floor(progress * ROTATING_WORDS.length)
      );

      setCount(nextCount);
      setWordIndex(nextWordIndex);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setCount(100);
        setWordIndex(ROTATING_WORDS.length - 1);
        completeTimer = window.setTimeout(() => {
          onComplete();
        }, 400);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      if (completeTimer) window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } }}
      className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-6 md:p-10 select-none"
      role="status"
      aria-label="Loading portfolio"
    >
      {/* Top-Left Label */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex items-center justify-between"
      >
        <span className="text-xs text-muted uppercase tracking-[0.3em]">Portfolio</span>
        <button
          type="button"
          onClick={onComplete}
          className="text-xs text-muted hover:text-text-primary transition-colors uppercase tracking-[0.2em] py-1 px-2"
        >
          Skip
        </button>
      </motion.div>

      {/* Center Rotating Words */}
      <div className="flex items-center justify-center overflow-hidden min-h-[5rem]">
        <AnimatePresence mode="wait">
          <motion.span
            key={ROTATING_WORDS[wordIndex]}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
          >
            {ROTATING_WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bottom-Right Counter + Bottom Progress Bar */}
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <span className="text-xs text-muted tracking-[0.25em] uppercase hidden sm:inline">
            AssistifySteve
          </span>
          <div className="ml-auto text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums leading-none">
            {String(count).padStart(3, '0')}
          </div>
        </div>

        <div className="w-full h-[3px] bg-stroke/50 overflow-hidden">
          <div
            className="h-full w-full accent-gradient origin-left transition-transform duration-75"
            style={{
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
