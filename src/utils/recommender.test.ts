import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeWorkflowNeeds } from './recommender.ts';

test('recommends Administrative & Operations Support for inbox & scheduling queries', () => {
  const result = analyzeWorkflowNeeds('Inbox overload and scheduling conflicts');
  assert.equal(result.primaryTier, 'Administrative & Operations Support');
  assert.equal(result.tierTag, 'Executive Ready');
  assert.ok(result.suggestedTools.includes('Microsoft 365') || result.suggestedTools.includes('Google Workspace'));
  assert.equal(result.actionRoadmap.length, 3);
});

test('recommends IT Support & Systems Management for workspace and permissions queries', () => {
  const result = analyzeWorkflowNeeds('Setting up Google Workspace and security permissions');
  assert.equal(result.primaryTier, 'IT Support & Systems Management');
  assert.equal(result.tierTag, 'Technical Rigor');
  assert.ok(result.suggestedTools.includes('Google Workspace'));
  assert.equal(result.actionRoadmap.length, 3);
});

test('matches Data Analytics 101 for spreadsheet and data consolidation challenges', () => {
  const result = analyzeWorkflowNeeds('Manual data entry and spreadsheet consolidation');
  assert.equal(result.matchedProject.title, 'Data Analytics 101');
  assert.ok(result.matchedProject.url.includes('da-101'));
});

test('matches TaskPulse for client retention and cadence bottlenecks', () => {
  const result = analyzeWorkflowNeeds('Client onboarding drop-offs and retention cadence tracking');
  assert.equal(result.primaryTier, 'Customer & Client Care');
  assert.equal(result.matchedProject.title, 'TaskPulse');
});

test('matches A Script 2 Scene for prompt engineering and storyboard queries', () => {
  const result = analyzeWorkflowNeeds('Generative AI prompt engineering and storyboard scene planning');
  assert.equal(result.matchedProject.title, 'A Script 2 Scene');
  assert.ok(result.matchedProject.url.includes('script-to-scene'));
});

test('gracefully handles empty or vague prompts with sane defaults', () => {
  const result = analyzeWorkflowNeeds('');
  assert.ok(result.primaryTier);
  assert.ok(result.matchScore >= 80);
  assert.ok(result.actionRoadmap.length === 3);
});
