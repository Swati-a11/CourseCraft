import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyStudyPlanError, generateStudyPlanWithFallback } from '../services/studyPlanGeneration.js';

const busy = () => Object.assign(new Error('UNAVAILABLE: high demand'), { status: 503 });
test('retries a temporary overload on the same model', async () => {
  const calls = [];
  const ai = { models: { generateContent: async ({ model }) => { calls.push(model); if (calls.length === 1) throw busy(); return { text: 'A plan' }; } } };
  assert.equal(await generateStudyPlanWithFallback(ai, 'prompt', { models: ['primary'], sleep: async () => {} }), 'A plan');
  assert.deepEqual(calls, ['primary', 'primary']);
});
test('falls back after repeated overload', async () => {
  const calls = [];
  const ai = { models: { generateContent: async ({ model }) => { calls.push(model); if (model === 'primary') throw busy(); return { text: 'Fallback plan' }; } } };
  assert.equal(await generateStudyPlanWithFallback(ai, 'prompt', { models: ['primary', 'backup'], sleep: async () => {} }), 'Fallback plan');
  assert.deepEqual(calls, ['primary', 'primary', 'backup']);
});
test('does not retry authentication or other permanent errors', async () => {
  let calls = 0;
  const ai = { models: { generateContent: async () => { calls++; throw Object.assign(new Error('Invalid API key'), { status: 401 }); } } };
  await assert.rejects(generateStudyPlanWithFallback(ai, 'prompt', { models: ['primary', 'backup'], sleep: async () => {} }), /Invalid API key/);
  assert.equal(calls, 1);
});
test('recognizes quota and JSON-wrapped overload responses', () => {
  assert.equal(classifyStudyPlanError(new Error('{"error":{"code":503,"status":"UNAVAILABLE"}}')), 'unavailable');
  assert.equal(classifyStudyPlanError(Object.assign(new Error('quota'), { status: 429 })), 'quota');
});
test('returns the last service error when all models are unavailable', async () => {
  let calls = 0;
  const ai = { models: { generateContent: async () => { calls++; throw busy(); } } };
  await assert.rejects(generateStudyPlanWithFallback(ai, 'prompt', { models: ['primary', 'backup'], sleep: async () => {} }), /UNAVAILABLE/);
  assert.equal(calls, 4);
});
