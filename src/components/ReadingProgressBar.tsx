import React from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

export const ReadingProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      data-testid="reading-progress-bar"
      className="fixed top-[74px] md:top-[84px] left-0 right-0 z-[45] h-[3px] bg-stroke/45 backdrop-blur-sm pointer-events-none"
    >
      <motion.div
        data-testid="reading-progress-fill"
        className="h-full w-full accent-gradient origin-left"
        style={{
          scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress,
          boxShadow: '0 0 10px hsl(var(--brand-blue) / 0.55)',
        }}
      />
    </div>
  );
};
