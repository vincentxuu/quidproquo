import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadRagDataset } from '../evals/rag/adapters/golden-dataset.mjs';

const DATASET_PATH = path.resolve('docs/rag-golden-dataset.json');
const FIXTURE_DATASET_PATH = path.resolve(process.env.RAG_EVAL_FIXTURE_PATH ?? 'docs/rag-golden-fixture.json');
const BASE_URL = process.env.RAG_EVAL_BASE_URL ?? 'http://127.0.0.1:4321';
const COOKIE = process.env.RAG_EVAL_COOKIE ?? '';
const ENFORCE = process.env.RAG_EVAL_ENFORCE === '1';
const OFFLINE_MODE = process.env.RAG_EVAL_OFFLINE === '1';
const RUN_KIND = OFFLINE_MODE ? 'fixture' : 'live';
const RAG_EVAL_MAX_ATTEMPTS = Number(process.env.RAG_EVAL_MAX_ATTEMPTS ?? 3);
const RAG_EVAL_INITIAL_DELAY_MS = Number(process.env.RAG_EVAL_INITIAL_DELAY_MS ?? 700);
const RAG_ENGINES = (process.env.RAG_ENGINE?.split(',') ?? [''])
  .map((engine) => engine.trim())
  .filter(Boolean);
const THRESHOLDS = {
  faithfulness: Number(process.env.RAG_EVAL_MIN_FAITHFULNESS ?? '0.8'),
  answerRelevance: Number(process.env.RAG_EVAL_MIN_ANSWER_RELEVANCE ?? '0.75'),
  contextRecall: Number(process.env.RAG_EVAL_MIN_CONTEXT_RECALL ?? '0.7'),
};

export function resolveArtifactPaths(runKind = RUN_KIND) {
  const artifactRoot = path.resolve(process.env.RAG_EVAL_ARTIFACT_ROOT ?? '.work/rag-evals', runKind);
  return {
    report: path.resolve(process.env.RAG_EVAL_REPORT_PATH ?? path.join(artifactRoot, 'baseline-report.json')),
    outputs: path.resolve(process.env.RAG_EVAL_OUTPUTS_PATH ?? path.join(artifactRoot, 'baseline-outputs.jsonl')),
    scores: path.resolve(process.env.RAG_EVAL_SCORES_PATH ?? path.join(artifactRoot, 'baseline-scores.jsonl')),
    traces: path.resolve(process.env.RAG_EVAL_TRACES_PATH ?? path.join(artifactRoot, 'baseline-traces.jsonl')),
  };
}

export function tokenize(text) {
  const normalized = String(text ?? '').toLowerCase();
  const latinTokens = normalized.match(/[a-z0-9][a-z0-9._:/#-]*/g) ?? [];
  const cjkTokens = [...normalized].filter((char) => /[\p{Script=Han}]/u.test(char));
  return [...latinTokens, ...cjkTokens];
}

export function jaccard(a, b) {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  const intersection = [...setA].filter((token) => setB.has(token)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildLiveRequestBody(query, pipelineEngine) {
  return {
    message: query,
    traceScope: 'eval',
    cacheMode: 'bypass',
    ...(pipelineEngine ? { pipelineEngine } : {}),
  };
}

async function ask(query, pipelineEngine) {
  if (OFFLINE_MODE) {
    throw new Error('OFFLINE mode does not support ask()');
  }
  if (!COOKIE) {
    throw new Error('RAG_EVAL_COOKIE is required for uncached live Ask AI evaluation');
  }

  let attempt = 0;
  while (attempt < RAG_EVAL_MAX_ATTEMPTS) {
    attempt += 1;
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(COOKIE ? { Cookie: COOKIE } : {}),
      },
      body: JSON.stringify(buildLiveRequestBody(query, pipelineEngine)),
    });

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let answer = '';
      let sources = [];
      let related = [];
      const agentSteps = [];
      let doneEvent = {};
      let errorEvent = null;

      const processBlock = (block) => {
        const lines = block.split('\n');
        let eventType = 'token';
        const dataLines = [];
        for (const line of lines) {
          if (line.startsWith('event:')) eventType = line.slice(6).trim();
          else if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
        }
        if (dataLines.length === 0) return;
        const data = JSON.parse(dataLines.join('\n'));
        if (eventType === 'token') answer += data.text ?? '';
        if (eventType === 'sources') sources = data;
        if (eventType === 'related') related = data;
        if (eventType === 'agent_step') agentSteps.push(data);
        if (eventType === 'done') doneEvent = data;
        if (eventType === 'error') errorEvent = data;
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() ?? '';
        for (const block of blocks) {
          if (block.trim()) processBlock(block);
        }
      }

      if (buffer.trim()) processBlock(buffer);
      return {
        answer,
        sources,
        related,
        agentSteps,
        done: doneEvent,
        error: errorEvent,
        evidenceKind: 'live-output',
      };
    }

    if (response.status !== 429 || attempt >= RAG_EVAL_MAX_ATTEMPTS) {
      throw new Error(`Chat request failed for "${query}" with status ${response.status}`);
    }

    await sleep(RAG_EVAL_INITIAL_DELAY_MS * 2 ** (attempt - 1));
  }

  throw new Error(`Chat request failed for "${query}" with status 429`);
}

export function buildOfflineResponse(item) {
  if (typeof item.candidate_answer !== 'string' || !Array.isArray(item.candidate_sources)) {
    throw new Error(`Offline fixture "${item.id ?? 'unknown'}" must define candidate_answer and candidate_sources`);
  }

  return {
    answer: item.candidate_answer,
    sources: item.candidate_sources.map((source) => ({ source_url: String(source) })),
    related: [],
    agentSteps: [],
    done: {},
    error: null,
    evidenceKind: 'offline-fixture',
  };
}

function getExpectedSources(item) {
  return Array.isArray(item.expected_sources) ? item.expected_sources : [];
}

function getExpectedAnswerPoints(item) {
  return Array.isArray(item.expected_answer_points) ? item.expected_answer_points : [];
}

function normalizeLocator(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    return `${url.hostname}${url.pathname}`.replace(/^www\./, '').replace(/\/$/, '');
  } catch {
    return raw.replace(/^https?:\/\//, '').replace(/^\/+|\/+$/g, '');
  }
}

function locatorAliases(value) {
  const normalized = normalizeLocator(value);
  const aliases = new Set([normalized]);
  if (normalized.startsWith('docs/')) aliases.add(normalized.slice('docs/'.length));
  return [...aliases].filter(Boolean);
}

function sourceMatchesExpected(source, expected) {
  const sourceLocator = normalizeLocator(source);
  return locatorAliases(expected).some((alias) => sourceLocator.includes(alias));
}

function getSourceUrl(source) {
  if (typeof source === 'string') return source;
  return String(source?.source_url ?? source?.url ?? '');
}

function coverage(expected, actual) {
  const expectedTokens = new Set(tokenize(expected));
  const actualTokens = new Set(tokenize(actual));
  if (expectedTokens.size === 0) return 0;
  const matched = [...expectedTokens].filter((token) => actualTokens.has(token)).length;
  return matched / expectedTokens.size;
}

function extractCitationUrls(answer) {
  return [...String(answer).matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((match) => match[1]);
}

export function scoreCase(item, answer, sources) {
  const normalizedAnswer = String(answer ?? '').toLowerCase();
  const expectedSources = getExpectedSources(item);
  const sourceUrls = sources.map(getSourceUrl).filter(Boolean);
  const matchedSources = expectedSources.filter((expected) =>
    sourceUrls.some((source) => sourceMatchesExpected(source, expected))
  );
  const contextRecall = expectedSources.length === 0
    ? (sourceUrls.length === 0 ? 1 : 0)
    : matchedSources.length / expectedSources.length;

  const expectedPoints = getExpectedAnswerPoints(item);
  const matchedPoints = expectedPoints.filter((point) => coverage(point, normalizedAnswer) >= 0.4);
  const forbiddenClaims = Array.isArray(item.forbidden_claims) ? item.forbidden_claims : [];
  const detectedForbiddenClaims = forbiddenClaims.filter((claim) =>
    normalizedAnswer.includes(String(claim).toLowerCase()) || coverage(claim, normalizedAnswer) >= 0.85
  );
  const pointCoverage = expectedPoints.length === 0 ? 1 : matchedPoints.length / expectedPoints.length;
  const answerRelevance = detectedForbiddenClaims.length > 0 ? 0 : pointCoverage;

  const citationUrls = extractCitationUrls(answer);
  const groundedCitations = citationUrls.filter((citation) =>
    sourceUrls.some((source) => normalizeLocator(source) === normalizeLocator(citation))
  );
  const citationGrounding = citationUrls.length === 0 ? 0 : groundedCitations.length / citationUrls.length;
  const sourceAlignment = sourceUrls.length === 0
    ? 0
    : sourceUrls.filter((source) => expectedSources.some((expected) => sourceMatchesExpected(source, expected))).length / sourceUrls.length;
  const faithfulness = detectedForbiddenClaims.length > 0
    ? 0
    : expectedSources.length === 0
      ? (sourceUrls.length === 0 && citationUrls.length === 0 ? 1 : 0)
      : (sourceAlignment + citationGrounding) / 2;

  return {
    id: item.id,
    category: item.category ?? 'fixture',
    faithfulness,
    answerRelevance,
    contextRecall,
    matchedAnswerPoints: matchedPoints.length,
    expectedAnswerPoints: expectedPoints.length,
    matchedSources: matchedSources.length,
    expectedSources: expectedSources.length,
    forbiddenClaims: detectedForbiddenClaims,
    passed: faithfulness >= THRESHOLDS.faithfulness
      && answerRelevance >= THRESHOLDS.answerRelevance
      && contextRecall >= THRESHOLDS.contextRecall,
  };
}

function summarize(rows) {
  const averages = rows.reduce((acc, row) => ({
    faithfulness: acc.faithfulness + row.faithfulness,
    answerRelevance: acc.answerRelevance + row.answerRelevance,
    contextRecall: acc.contextRecall + row.contextRecall,
    passed: acc.passed + (row.passed ? 1 : 0),
  }), { faithfulness: 0, answerRelevance: 0, contextRecall: 0, passed: 0 });
  return {
    count: rows.length,
    faithfulness: rows.length === 0 ? 0 : averages.faithfulness / rows.length,
    answerRelevance: rows.length === 0 ? 0 : averages.answerRelevance / rows.length,
    contextRecall: rows.length === 0 ? 0 : averages.contextRecall / rows.length,
    passed: averages.passed,
  };
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

async function main() {
  const datasetPath = OFFLINE_MODE ? FIXTURE_DATASET_PATH : DATASET_PATH;
  const dataset = loadRagDataset(datasetPath, { fixture: OFFLINE_MODE });
  const artifactPaths = resolveArtifactPaths();
  const results = [];
  const outputs = [];
  const traces = [];
  const askFn = OFFLINE_MODE
    ? async (item) => buildOfflineResponse(item)
    : async (item, engine) => ask(item.query, engine || undefined);

  const activeEngines = RAG_ENGINES.length > 0 ? RAG_ENGINES : ['']
  const perEngineSummaries = new Map();
  for (const engine of activeEngines) {
    const engineRows = []
    for (const item of dataset.cases) {
      const response = OFFLINE_MODE
        ? await askFn(item)
        : await askFn(item, engine);
      const engineName = engine || 'default';
      const scored = { ...scoreCase(item, response.answer, response.sources), engine: engineName };
      results.push(scored);
      engineRows.push(scored);
      outputs.push({
        caseId: item.id,
        engine: engineName,
        evidenceKind: response.evidenceKind,
        answer: response.answer,
        sources: response.sources,
        related: response.related,
        done: response.done,
        error: response.error,
      });
      traces.push({
        caseId: item.id,
        engine: engineName,
        evidenceKind: response.evidenceKind,
        agentSteps: response.agentSteps,
        allowedTracePatterns: item.allowed_trace_patterns ?? [],
      });
    }
    perEngineSummaries.set(engine || 'default', summarize(engineRows));
  }

  const summary = {
    ...summarize(results),
    thresholds: THRESHOLDS,
    generatedAt: new Date().toISOString(),
    engines: RAG_ENGINES.length > 0 ? RAG_ENGINES : ['default'],
    schemaVersion: dataset.schema_version,
    datasetId: dataset.dataset_id,
    evidenceKind: dataset.evidence_kind,
    runKind: RUN_KIND,
    liveEvidence: !OFFLINE_MODE,
    artifacts: artifactPaths,
  };

  const perEngine = Object.fromEntries(Array.from(perEngineSummaries.entries()).map(([engine, engineSummary]) => {
    return [
      engine,
      {
        ...engineSummary,
        thresholds: THRESHOLDS,
      },
    ]
  }));
  const report = { summary, perEngine, results };
  fs.mkdirSync(path.dirname(artifactPaths.report), { recursive: true });
  fs.writeFileSync(artifactPaths.report, JSON.stringify(report, null, 2) + '\n');
  writeJsonl(artifactPaths.outputs, outputs);
  writeJsonl(artifactPaths.scores, results);
  writeJsonl(artifactPaths.traces, traces);
  console.log(JSON.stringify(report, null, 2));

  const failed = Object.values(perEngine).some((engineSummary) =>
    engineSummary.faithfulness < THRESHOLDS.faithfulness
    || engineSummary.answerRelevance < THRESHOLDS.answerRelevance
    || engineSummary.contextRecall < THRESHOLDS.contextRecall
  );
  if (ENFORCE && failed) {
    throw new Error(`RAG eval below threshold. See ${artifactPaths.report}`);
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
