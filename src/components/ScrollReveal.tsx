import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  amount?: number | 'some' | 'all';
}

/**
 * Reusable Framer Motion scroll-into-view wrapper providing a subtle,
 * GPU-composited slide-up and fade reveal while respecting prefers-reduced-motion.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0,
  yOffset = 28,
  duration = 0.65,
  amount = 0.12,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div data-testid="scroll-reveal" className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      data-testid="scroll-reveal"
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
