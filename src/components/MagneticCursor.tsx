import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  computeMagneticOffset,
  CursorTargetKind,
  getCursorVisualMetrics,
} from '../utils/cursorPhysics.ts';

const PROJECT_SELECTOR = '[data-cursor="project"]';
const INTERACTIVE_SELECTOR =
  'button, a, [role="button"], [role="tab"], [role="radio"], [data-cursor="interactive"]';
const TEXT_INPUT_SELECTOR = 'input, textarea, select';

function resolveTargetElement(node: EventTarget | null): {
  kind: CursorTargetKind;
  element: HTMLElement | null;
} {
  if (!(node instanceof Element)) {
    return { kind: 'default', element: null };
  }

  const projectEl = node.closest<HTMLElement>(PROJECT_SELECTOR);
  if (projectEl) {
    return { kind: 'project', element: projectEl };
  }

  const textEl = node.closest<HTMLElement>(TEXT_INPUT_SELECTOR);
  if (textEl) {
    return { kind: 'text', element: textEl };
  }

  const interactiveEl = node.closest<HTMLElement>(INTERACTIVE_SELECTOR);
  if (interactiveEl) {
    return { kind: 'interactive', element: interactiveEl };
  }

  return { kind: 'default', element: null };
}

export const MagneticCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [targetKind, setTargetKind] = useState<CursorTargetKind>('default');

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const dotRawX = useMotionValue(-100);
  const dotRawY = useMotionValue(-100);

  const ringX = useSpring(rawX, { stiffness: 360, damping: 28, mass: 0.45 });
  const ringY = useSpring(rawY, { stiffness: 360, damping: 28, mass: 0.45 });
  const dotX = useSpring(dotRawX, { stiffness: 700, damping: 35, mass: 0.2 });
  const dotY = useSpring(dotRawY, { stiffness: 700, damping: 35, mass: 0.2 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncEnabled = () => {
      setEnabled(finePointer.matches && !reducedMotion.matches);
    };

    syncEnabled();
    finePointer.addEventListener('change', syncEnabled);
    reducedMotion.addEventListener('change', syncEnabled);

    return () => {
      finePointer.removeEventListener('change', syncEnabled);
      reducedMotion.removeEventListener('change', syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY, target } = e;
      const { kind, element } = resolveTargetElement(target);

      setVisible(true);
      setTargetKind(kind);

      dotRawX.set(clientX);
      dotRawY.set(clientY);

      if (element && (kind === 'interactive' || kind === 'project')) {
        const rect = element.getBoundingClientRect();
        const strength = kind === 'project' ? 0.08 : 0.28;
        const maxOffset = kind === 'project' ? 12 : 10;
        const { dx, dy } = computeMagneticOffset(clientX, clientY, rect, strength, maxOffset);
        rawX.set(clientX + dx);
        rawY.set(clientY + dy);
      } else {
        rawX.set(clientX);
        rawY.set(clientY);
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => {
      setVisible(false);
      setTargetKind('default');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, rawX, rawY, dotRawX, dotRawY]);

  if (!enabled) return null;

  const { ringSize, dotScale, ringOpacity } = getCursorVisualMetrics(targetKind, isPressed);
  const isExpanded = targetKind === 'interactive' || targetKind === 'project';

  return (
    <div
      aria-hidden="true"
      data-testid="magnetic-cursor"
      data-cursor-state={visible ? targetKind : 'hidden'}
      className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
    >
      {/* Magnetic Expanding Outer Ring */}
      <motion.div
        data-testid="magnetic-cursor-ring"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? ringOpacity : 0,
          backgroundColor:
            targetKind === 'project'
              ? 'rgba(89, 128, 177, 0.16)'
              : isExpanded
                ? 'rgba(89, 128, 177, 0.1)'
                : 'rgba(255, 255, 255, 0)',
          borderColor: isExpanded
            ? 'rgba(223, 229, 236, 0.8)'
            : 'rgba(89, 128, 177, 0.55)',
        }}
        transition={{
          width: { type: 'spring', stiffness: 360, damping: 26 },
          height: { type: 'spring', stiffness: 360, damping: 26 },
          opacity: { duration: 0.18 },
          backgroundColor: { duration: 0.2 },
          borderColor: { duration: 0.2 },
        }}
        className="absolute top-0 left-0 rounded-full border backdrop-blur-[1px]"
      />

      {/* Precision Inner Dot */}
      <motion.div
        data-testid="magnetic-cursor-dot"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: visible ? (targetKind === 'project' ? 0 : dotScale) : 0,
          opacity: visible && targetKind !== 'project' ? 1 : 0,
        }}
        transition={{ duration: 0.14 }}
        className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-brand-light shadow-[0_0_8px_hsl(var(--brand-blue)/0.7)]"
      />
    </div>
  );
};
