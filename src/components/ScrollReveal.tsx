import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  yOffset = 28,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.65,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.2, 0.0, 0, 1.0], // Google Material 3 Expressive emphasized deceleration curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
