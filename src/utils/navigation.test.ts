import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NAV_ITEMS,
  resolveActiveNavFromPositions,
  resolveNavForPathname,
} from './navigation';

test('NAV_ITEMS contains all five primary sections in order', () => {
  assert.deepEqual(
    NAV_ITEMS.map((item) => item.label),
    ['Home', 'Work', 'Services', 'Tools', 'Resume']
  );
  assert.deepEqual(
    NAV_ITEMS.map((item) => item.targetId),
    ['hero', 'work', 'services', 'tools', 'about']
  );
});

test('resolveActiveNavFromPositions defaults to Home above first trigger', () => {
  const positions = [
    { label: 'Home', top: 500 },
    { label: 'Work', top: 1200 },
    { label: 'Services', top: 2100 },
  ];
  assert.equal(resolveActiveNavFromPositions(positions, 400), 'Home');
});

test('resolveActiveNavFromPositions selects the deepest section past triggerLine', () => {
  const positions = [
    { label: 'Home', top: -1800 },
    { label: 'Work', top: -900 },
    { label: 'Services', top: 280 },
    { label: 'Tools', top: 960 },
    { label: 'Resume', top: 1850 },
  ];
  assert.equal(resolveActiveNavFromPositions(positions, 405), 'Services');
  assert.equal(resolveActiveNavFromPositions(positions, 960), 'Tools');
});

test('resolveActiveNavFromPositions resolves accurately when nav order differs from DOM order', () => {
  // Tools (#tools) appears below Resume (#about) in the landing page DOM
  const positions = [
    { label: 'Home', top: -3500 },
    { label: 'Work', top: -2600 },
    { label: 'Services', top: -1600 },
    { label: 'Tools', top: 80 },
    { label: 'Resume', top: -650 },
  ];
  assert.equal(resolveActiveNavFromPositions(positions, 405), 'Tools');
});

test('resolveNavForPathname maps work archive and landing routes accurately', () => {
  assert.equal(resolveNavForPathname('/work'), 'Work');
  assert.equal(resolveNavForPathname('/'), 'Home');
  assert.equal(resolveNavForPathname('/unknown'), 'Home');
});
