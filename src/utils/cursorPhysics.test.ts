import test from 'node:test';
import assert from 'node:assert/strict';
import { computeMagneticOffset, getCursorVisualMetrics } from './cursorPhysics';

test('computeMagneticOffset pulls toward element center and clamps to maxOffset', () => {
  const rect = { left: 100, top: 100, width: 200, height: 100 }; // center: (200, 150)

  const nearCenter = computeMagneticOffset(200, 150, rect, 0.25, 10);
  assert.deepEqual(nearCenter, { dx: 0, dy: 0 });

  const slightRight = computeMagneticOffset(220, 160, rect, 0.25, 10);
  assert.deepEqual(slightRight, { dx: -5, dy: -2.5 });

  const farEdge = computeMagneticOffset(500, 500, rect, 0.5, 10);
  assert.deepEqual(farEdge, { dx: -10, dy: -10 });
});

test('computeMagneticOffset returns zero for degenerate rects', () => {
  assert.deepEqual(
    computeMagneticOffset(10, 20, { left: 0, top: 0, width: 0, height: 50 }),
    { dx: 0, dy: 0 }
  );
});

test('getCursorVisualMetrics expands ring on interactive elements and project cards', () => {
  const defaultMetrics = getCursorVisualMetrics('default', false);
  const interactiveMetrics = getCursorVisualMetrics('interactive', false);
  const projectMetrics = getCursorVisualMetrics('project', false);
  const pressedProjectMetrics = getCursorVisualMetrics('project', true);

  assert.ok(interactiveMetrics.ringSize > defaultMetrics.ringSize);
  assert.ok(projectMetrics.ringSize > interactiveMetrics.ringSize);
  assert.ok(pressedProjectMetrics.ringSize < projectMetrics.ringSize);
});
