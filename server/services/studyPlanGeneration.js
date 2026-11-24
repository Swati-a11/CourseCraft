const defaultModels = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.1-flash-lite'];
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export function classifyStudyPlanError(error) {
  const message = String(error?.message || '');
  const status = Number(error?.status || error?.code) || Number(message.match(/"code"\s*:\s*(\d+)/)?.[1]);
  if (status === 429 || /RESOURCE_EXHAUSTED/i.test(message)) return 'quota';
  if (status === 503 || status === 502 || status === 504 || /UNAVAILABLE|high demand|overloaded/i.test(message)) return 'unavailable';
  if (status === 404 || /NOT_FOUND/i.test(message)) return 'model';
  return 'other';
}

export async function generateStudyPlanWithFallback(ai, prompt, { models = defaultModels, sleep = wait } = {}) {
  let lastError;
  for (const [index, model] of models.entries()) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        const text = typeof response.text === 'string' ? response.text.trim() : '';
        if (!text) throw new Error('The AI returned an empty response.');
        return text;
      } catch (error) {
        lastError = error;
        const kind = classifyStudyPlanError(error);
        if (kind === 'other') throw error;
        if (kind === 'unavailable' && attempt === 0) { await sleep(800 + index * 400); continue; }
        break;
      }
    }
  }
  throw lastError;
}
