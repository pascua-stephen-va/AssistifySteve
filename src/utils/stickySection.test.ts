import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PORTFOLIO_SECTIONS,
  clampProgress,
  resolveStickySectionState,
} from './stickySection';

test('clampProgress keeps values cleanly within 0 to 1', () => {
  assert.equal(clampProgress(-0.4), 0);
  assert.equal(clampProgress(0.45), 0.45);
  assert.equal(clampProgress(1.8), 1);
  assert.equal(clampProgress(Number.NaN), 0);
});

test('resolveStickySectionState stays hidden at top of Hero section', () => {
  const rects = [
    { id: 'hero', top: 0, height: 900 },
    { id: 'work', top: 900, height: 1100 },
    { id: 'services', top: 2000, height: 800 },
  ];

  const state = resolveStickySectionState(rects, 0, 900);
  assert.equal(state.visible, false);
  assert.equal(state.activeSection.id, 'hero');
  assert.equal(state.prevSection, null);
  assert.equal(state.nextSection?.id, 'work');
});

test('resolveStickySectionState reveals and tracks Featured Systems, Tools, and Contact accurately', () => {
  const workRects = [
    { id: 'hero', top: -850, height: 900 },
    { id: 'work', top: 50, height: 1000 },
    { id: 'services', top: 1050, height: 900 },
    { id: 'tools', top: 2800, height: 900 },
    { id: 'contact', top: 4500, height: 800 },
  ];

  const workState = resolveStickySectionState(workRects, 850, 900);
  assert.equal(workState.visible, true);
  assert.equal(workState.activeSection.id, 'work');
  assert.equal(workState.activeSection.label, 'Featured Systems');
  assert.equal(workState.prevSection?.id, 'hero');
  assert.equal(workState.nextSection?.id, 'services');
  assert.ok(workState.sectionProgress > 0.2 && workState.sectionProgress < 0.4);

  const toolsRects = [
    { id: 'hero', top: -3500, height: 900 },
    { id: 'work', top: -2600, height: 1000 },
    { id: 'services', top: -1600, height: 900 },
    { id: 'explorations', top: -900, height: 700 },
    { id: 'about', top: -400, height: 500 },
    { id: 'tools', top: 100, height: 800 },
    { id: 'recommend', top: 900, height: 700 },
    { id: 'stats', top: 1600, height: 500 },
    { id: 'contact', top: 2100, height: 800 },
  ];

  const toolsState = resolveStickySectionState(toolsRects, 3500, 900);
  assert.equal(toolsState.visible, true);
  assert.equal(toolsState.activeSection.id, 'tools');
  assert.equal(toolsState.activeSection.index, '06');
  assert.equal(toolsState.prevSection?.id, 'about');
  assert.equal(toolsState.nextSection?.id, 'recommend');

  const contactRects = PORTFOLIO_SECTIONS.map((sec, idx) => ({
    id: sec.id,
    top: idx === PORTFOLIO_SECTIONS.length - 1 ? 120 : -500 * (PORTFOLIO_SECTIONS.length - idx),
    height: 800,
  }));

  const contactState = resolveStickySectionState(contactRects, 6200, 900);
  assert.equal(contactState.visible, true);
  assert.equal(contactState.activeSection.id, 'contact');
  assert.equal(contactState.nextSection, null);
  assert.equal(contactState.prevSection?.id, 'stats');
});

test('resolveStickySectionState activates final Contact section at page bottom', () => {
  const nearBottomRects = PORTFOLIO_SECTIONS.map((sec, idx) => ({
    id: sec.id,
    top: idx === PORTFOLIO_SECTIONS.length - 1 ? 420 : -500 * (PORTFOLIO_SECTIONS.length - idx),
    height: 480,
  }));

  const state = resolveStickySectionState(nearBottomRects, 6800, 900, PORTFOLIO_SECTIONS, 280, true);
  assert.equal(state.visible, true);
  assert.equal(state.activeSection.id, 'contact');
  assert.equal(state.sectionProgress, 1);
  assert.equal(state.prevSection?.id, 'stats');
  assert.equal(state.nextSection, null);
});
