import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import { findMission } from '../../../lib/curriculum';
import { clientKey, rateLimit } from '../../../lib/rate-limit';
import { buildStory } from '../../../lib/story-builder';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL = 'llama-3.3-70b-versatile';

/**
 * The model rewrites the *narrative* only.
 *
 * The equation, its real quantities, the solved answer and the tolerance all
 * stay exactly as authored. A language model cannot be trusted to invent
 * physics that is both correct and solvable on a slider, so it is not asked to.
 * It gets the job it is actually good at: writing a fresh scene.
 */
const SYSTEM_PROMPT = `You write short mission briefings for a STEM learning game aimed at ages 11-14.

Return JSON only, exactly this shape:
{ "scenario": string, "crisis": string, "insight": string, "resolution": string }

- scenario: a concrete setting, lowercase, starting with "a" or "an". One clause. Example: "a cargo crane leaning over a flooded rail yard".
- crisis: 2 sentences. State the real numbers you are given and what is going wrong. Never state the answer.
- insight: 2 sentences explaining the underlying principle in plain language. No formulas.
- resolution: 1 sentence describing the system once the relationship is satisfied.

Write concrete and grounded. No hype, no exclamation marks, no second-person pep talk. Never reveal the value the learner must find.`;

const noStore = (payload, status = 200) => NextResponse.json(payload, {
  status,
  headers: { 'Cache-Control': 'no-store, max-age=0' },
});

const isText = (value) => typeof value === 'string' && value.trim().length > 0 && value.length < 600;

function validateNarrative(candidate) {
  const errors = [];
  if (candidate === null || typeof candidate !== 'object') return { ok: false, errors: ['Response was not an object.'] };
  for (const field of ['scenario', 'crisis', 'insight', 'resolution']) {
    if (!isText(candidate[field])) errors.push(`Field "${field}" must be a non-empty string under 600 characters.`);
  }
  return errors.length ? { ok: false, errors } : { ok: true, narrative: candidate };
}

async function generateNarrative(apiKey, mission, previousErrors) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const client = new Groq({ apiKey });
    const repair = previousErrors.length
      ? ` Your previous reply failed these checks: ${previousErrors.join(' ')} Return corrected JSON.`
      : '';

    const brief = [
      `Concept: ${mission.title}.`,
      `Relationship: ${mission.formula}.`,
      `The learner controls ${mission.model.control.label} in ${mission.model.control.unit || 'plain units'}.`,
      `The two sides that must agree are "${mission.model.params.leftName}" and "${mission.model.params.rightName}".`,
      'Invent a fresh setting. Do not reuse the phrasing of any example.',
    ].join(' ');

    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.9,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `${SYSTEM_PROMPT}${repair}` },
        { role: 'user', content: brief },
      ],
    }, { signal: controller.signal });

    return JSON.parse(completion.choices?.[0]?.message?.content ?? '');
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request) {
  /**
   * Throttled before anything else runs.
   *
   * Every call past this point can become a paid model completion, so the limit
   * is checked ahead of body parsing rather than ahead of the Groq call: a
   * rejected caller should cost this route as close to nothing as possible.
   *
   * Ten a minute is far above what the "retell this mission" button can produce
   * under a human finger and far below what a loop needs to be worth running.
   */
  const decision = rateLimit(clientKey(request), { limit: 10, windowMs: 60_000 });
  if (!decision.ok) {
    return NextResponse.json(
      { error: 'Too many story requests. Try again shortly.' },
      {
        status: 429,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Retry-After': String(decision.retryAfter),
          'RateLimit-Limit': '10',
          'RateLimit-Remaining': '0',
          'RateLimit-Reset': String(decision.retryAfter),
        },
      },
    );
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const missionId = typeof payload?.missionId === 'string' ? payload.missionId.slice(0, 64) : '';
  const mission = findMission(missionId);
  if (!mission) return noStore({ error: 'Unknown mission.' }, 400);

  const apiKey = process.env.GROQ_API_KEY;
  // No key configured is a normal state, not an error: the authored story ships
  // with the app and is already complete.
  if (!apiKey) return noStore({ story: buildStory(mission), source: 'authored' });

  let errors = [];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const candidate = await generateNarrative(apiKey, mission, errors);
      const result = validateNarrative(candidate);
      if (result.ok) {
        // Narrative swapped in; model, control, tolerance and answer untouched.
        const story = buildStory({ ...mission, ...result.narrative });
        return noStore({ story, source: 'generated' });
      }
      errors = result.errors;
    } catch (error) {
      // Deliberately logs the error class only — never the prompt or the reply.
      console.error(`story generation attempt ${attempt + 1} failed: ${error?.constructor?.name ?? 'Error'}`);
      errors = [`Attempt ${attempt + 1} did not return usable JSON.`];
    }
  }

  return noStore({ story: buildStory(mission), source: 'authored-fallback' });
}
