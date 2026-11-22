import test from 'node:test';
import assert from 'node:assert/strict';
import { COMMAND_PALETTE_ITEMS } from './commandPalette';
import {
  formatVoiceErrorMessage,
  matchVoiceCommand,
  normalizeSpokenTranscript,
  stripVoiceIntentPrefixes,
} from './voiceCommands';

test('normalizeSpokenTranscript lowercases and strips punctuation', () => {
  assert.equal(normalizeSpokenTranscript('  Go to Contact! '), 'go to contact');
  assert.equal(normalizeSpokenTranscript('Show,   tools?'), 'show tools');
});

test('stripVoiceIntentPrefixes removes common spoken navigation prefixes and suffixes', () => {
  assert.equal(stripVoiceIntentPrefixes('go to contact'), 'contact');
  assert.equal(stripVoiceIntentPrefixes('please show me the tools section'), 'tools');
  assert.equal(stripVoiceIntentPrefixes('navigate to featured work page'), 'featured work');
  assert.equal(stripVoiceIntentPrefixes('take me to resume'), 'resume');
});

test('matchVoiceCommand resolves natural spoken navigation commands accurately', () => {
  const contactMatch = matchVoiceCommand('Go to contact', COMMAND_PALETTE_ITEMS);
  assert.equal(contactMatch.item?.id, 'sec-contact');
  assert.notEqual(contactMatch.confidence, 'none');

  const toolsMatch = matchVoiceCommand('Show tools', COMMAND_PALETTE_ITEMS);
  assert.equal(toolsMatch.item?.id, 'sec-tools');

  const servicesMatch = matchVoiceCommand('Please open the services section', COMMAND_PALETTE_ITEMS);
  assert.equal(servicesMatch.item?.id, 'sec-services');

  const workMatch = matchVoiceCommand('Jump to featured work', COMMAND_PALETTE_ITEMS);
  assert.equal(workMatch.item?.id, 'sec-work');

  const archiveMatch = matchVoiceCommand('Open work archive', COMMAND_PALETTE_ITEMS);
  assert.equal(archiveMatch.item?.id, 'page-work-archive');

  const aboutMatch = matchVoiceCommand('Take me to resume', COMMAND_PALETTE_ITEMS);
  assert.equal(aboutMatch.item?.id, 'sec-about');

  const copyEmailMatch = matchVoiceCommand('Copy email', COMMAND_PALETTE_ITEMS);
  assert.equal(copyEmailMatch.item?.id, 'action-copy-email');

  const topMatch = matchVoiceCommand('Back to top', COMMAND_PALETTE_ITEMS);
  assert.equal(topMatch.item?.id, 'sec-home');
});

test('matchVoiceCommand falls back to fuzzy keyword matching and reports none on unknown speech', () => {
  const fuzzy = matchVoiceCommand('Show me TaskScript', COMMAND_PALETTE_ITEMS);
  assert.equal(fuzzy.item?.id, 'sec-work');
  assert.equal(fuzzy.confidence, 'fuzzy');

  const unknown = matchVoiceCommand('play jazz music on mars', COMMAND_PALETTE_ITEMS);
  assert.equal(unknown.item, null);
  assert.equal(unknown.confidence, 'none');
});

test('formatVoiceErrorMessage maps Web Speech API errors to user-facing messages', () => {
  assert.match(formatVoiceErrorMessage('not-allowed'), /microphone/i);
  assert.match(formatVoiceErrorMessage('no-speech'), /no speech/i);
  assert.equal(formatVoiceErrorMessage('aborted'), '');
});
