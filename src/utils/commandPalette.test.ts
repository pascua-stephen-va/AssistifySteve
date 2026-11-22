import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMMAND_PALETTE_ITEMS,
  filterCommandItems,
  getNextCommandIndex,
  groupCommandItems,
} from './commandPalette';

test('COMMAND_PALETTE_ITEMS includes active portfolio sections and excludes Journal', () => {
  const ids = COMMAND_PALETTE_ITEMS.map((item) => item.id);
  assert.ok(ids.includes('sec-home'));
  assert.ok(ids.includes('sec-work'));
  assert.ok(ids.includes('sec-services'));
  assert.ok(ids.includes('sec-explorations'));
  assert.ok(ids.includes('sec-about'));
  assert.ok(ids.includes('sec-tools'));
  assert.ok(ids.includes('sec-recommend'));
  assert.ok(ids.includes('sec-contact'));
  assert.equal(
    COMMAND_PALETTE_ITEMS.some((item) => /journal|recent thoughts/i.test(`${item.label} ${item.description}`)),
    false
  );
});

test('filterCommandItems returns all items for empty or whitespace queries', () => {
  assert.equal(filterCommandItems(COMMAND_PALETTE_ITEMS, '').length, COMMAND_PALETTE_ITEMS.length);
  assert.equal(filterCommandItems(COMMAND_PALETTE_ITEMS, '   ').length, COMMAND_PALETTE_ITEMS.length);
});

test('filterCommandItems matches by label, keyword, and multi-token queries with label priority', () => {
  const toolsMatches = filterCommandItems(COMMAND_PALETTE_ITEMS, 'tools');
  assert.equal(toolsMatches[0]?.id, 'sec-tools');

  const tesdaMatches = filterCommandItems(COMMAND_PALETTE_ITEMS, 'tesda');
  assert.equal(tesdaMatches[0]?.id, 'sec-about');

  const multiToken = filterCommandItems(COMMAND_PALETTE_ITEMS, 'copy email');
  assert.equal(multiToken.length, 1);
  assert.equal(multiToken[0]?.id, 'action-copy-email');

  const noMatches = filterCommandItems(COMMAND_PALETTE_ITEMS, 'nonexistent-xyz');
  assert.equal(noMatches.length, 0);
});

test('groupCommandItems preserves group ordering and omits empty groups', () => {
  const onlyActions = COMMAND_PALETTE_ITEMS.filter((item) => item.group === 'Quick Actions');
  const grouped = groupCommandItems(onlyActions);
  assert.equal(grouped.length, 1);
  assert.equal(grouped[0]?.group, 'Quick Actions');
  assert.equal(grouped[0]?.items.length, onlyActions.length);
});

test('getNextCommandIndex wraps cleanly in both directions and handles empty lists', () => {
  assert.equal(getNextCommandIndex(0, -1, 5), 4);
  assert.equal(getNextCommandIndex(4, 1, 5), 0);
  assert.equal(getNextCommandIndex(1, 1, 5), 2);
  assert.equal(getNextCommandIndex(0, 1, 0), -1);
});
