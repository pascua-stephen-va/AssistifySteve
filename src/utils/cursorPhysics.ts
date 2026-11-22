export type CursorTargetKind = 'default' | 'interactive' | 'project' | 'text';

export interface ElementRectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface MagneticOffset {
  dx: number;
  dy: number;
}

export interface CursorVisualMetrics {
  ringSize: number;
  dotScale: number;
  ringOpacity: number;
}

export function computeMagneticOffset(
  pointerX: number,
  pointerY: number,
  rect: ElementRectLike,
  strength = 0.25,
  maxOffset = 10
): MagneticOffset {
  if (rect.width <= 0 || rect.height <= 0 || strength <= 0 || maxOffset <= 0) {
    return { dx: 0, dy: 0 };
  }

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const rawDx = (centerX - pointerX) * strength;
  const rawDy = (centerY - pointerY) * strength;

  const dx = Math.max(-maxOffset, Math.min(maxOffset, rawDx));
  const dy = Math.max(-maxOffset, Math.min(maxOffset, rawDy));

  return { dx, dy };
}

export function getCursorVisualMetrics(
  kind: CursorTargetKind,
  isPressed = false
): CursorVisualMetrics {
  const pressFactor = isPressed ? 0.86 : 1;

  switch (kind) {
    case 'project':
      return {
        ringSize: Math.round(68 * pressFactor),
        dotScale: isPressed ? 0.7 : 0.85,
        ringOpacity: 0.95,
      };
    case 'interactive':
      return {
        ringSize: Math.round(46 * pressFactor),
        dotScale: isPressed ? 0.75 : 0.9,
        ringOpacity: 0.9,
      };
    case 'text':
      return {
        ringSize: Math.round(14 * pressFactor),
        dotScale: 0.5,
        ringOpacity: 0.45,
      };
    case 'default':
    default:
      return {
        ringSize: Math.round(20 * pressFactor),
        dotScale: isPressed ? 0.85 : 1,
        ringOpacity: 0.75,
      };
  }
}
