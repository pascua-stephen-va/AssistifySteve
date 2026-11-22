import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SectionDividerProps {
  variant?: 'wave' | 'node' | 'step';
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ variant = 'node' }) => {
  const prefersReducedMotion = useReducedMotion();

  const renderAccentPath = () => {
    switch (variant) {
      case 'wave':
        return (
          <motion.path
            d="M 460 16 C 515 16 540 5 600 16 C 660 27 685 16 740 16"
            stroke="url(#section-divider-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: prefersReducedMotion ? 0.85 : 0 }}
            whileInView={{ pathLength: 1, opacity: 0.85 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          />
        );
      case 'step':
        return (
          <motion.path
            d="M 480 16 L 560 16 L 580 8 L 620 24 L 640 16 L 720 16"
            stroke="url(#section-divider-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: prefersReducedMotion ? 0.85 : 0 }}
            whileInView={{ pathLength: 1, opacity: 0.85 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          />
        );
      case 'node':
      default:
        return (
          <motion.path
            d="M 470 16 L 584 16 M 616 16 L 730 16"
            stroke="url(#section-divider-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: prefersReducedMotion ? 0.85 : 0 }}
            whileInView={{ pathLength: 1, opacity: 0.85 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          />
        );
    }
  };

  return (
    <div
      aria-hidden="true"
      data-testid="section-divider"
      className="bg-bg w-full overflow-hidden py-1"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <svg
          viewBox="0 0 1200 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 block"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="section-divider-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--brand-blue))" stopOpacity="0" />
              <stop offset="30%" stopColor="hsl(var(--brand-blue))" stopOpacity="0.7" />
              <stop offset="50%" stopColor="hsl(var(--brand-light))" stopOpacity="0.95" />
              <stop offset="70%" stopColor="hsl(var(--brand-blue))" stopOpacity="0.7" />
              <stop offset="100%" stopColor="hsl(var(--brand-blue))" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Left & Right Architectural Hairlines */}
          <motion.path
            d="M 600 16 L 0 16"
            stroke="hsl(var(--stroke))"
            strokeWidth="1"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: prefersReducedMotion ? 1 : 0.2 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.path
            d="M 600 16 L 1200 16"
            stroke="hsl(var(--stroke))"
            strokeWidth="1"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: prefersReducedMotion ? 1 : 0.2 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
          />

          {/* Centered Brand Gradient Trace */}
          {renderAccentPath()}

          {/* Precision Center Node */}
          <motion.circle
            cx="600"
            cy="16"
            r="3"
            fill="hsl(var(--bg))"
            stroke="hsl(var(--brand-light))"
            strokeWidth="1.25"
            initial={{ scale: prefersReducedMotion ? 1 : 0, opacity: prefersReducedMotion ? 1 : 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.circle
            cx="600"
            cy="16"
            r="7"
            stroke="hsl(var(--brand-blue))"
            strokeOpacity="0.35"
            strokeWidth="1"
            fill="none"
            initial={{ scale: prefersReducedMotion ? 1 : 0.4, opacity: prefersReducedMotion ? 0.8 : 0 }}
            whileInView={{ scale: 1, opacity: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </svg>
      </div>
    </div>
  );
};
