import fs from 'node:fs';
import path from 'node:path';

const DATASET_PATH = path.resolve('docs/rag-golden-dataset.json');
const BASE_URL = process.env.RAG_EVAL_BASE_URL ?? 'http://127.0.0.1:4321';
const COOKIE = process.env.RAG_EVAL_COOKIE ?? '';

function tokenize(text) {
  return (text.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []).map((token) => token.toLowerCase());
}

function jaccard(a, b) {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  const intersection = [...setA].filter((token) => setB.has(token)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

async function ask(query) {
  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(COOKIE ? { Cookie: COOKIE } : {}),
    },
    body: JSON.stringify({ message: query }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Chat request failed for "${query}" with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let answer = '';
  let sources = [];

  const processBlock = (block) => {
    const lines = block.split('\n');
    let eventType = 'token';
    let dataStr = '';
    for (const line of lines) {
      if (line.startsWith('event:')) eventType = line.slice(6).trim();
      else if (line.startsWith('data:')) dataStr = line.slice(5).trim();
    }
    if (!dataStr) return;
    const data = JSON.parse(dataStr);
    if (eventType === 'token') answer += data.text ?? '';
    if (eventType === 'sources') sources = data;
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
  return { answer, sources };
}

function scoreCase(item, answer, sources) {
  const answerRelevance = jaccard(item.query, answer);
  const faithfulness = sources.length > 0 ? Math.min(1, (answer.match(/\]\(https?:\/\/[^)]+\)/g) ?? []).length / Math.max(1, sources.length)) : 0;
  const contextRecall = item.category === 'not-in-kb'
    ? (sources.length === 0 ? 1 : 0)
    : Math.min(1, sources.length / 3);

  return {
    id: item.id,
    category: item.category,
    faithfulness,
    answerRelevance,
    contextRecall,
    passed: faithfulness >= 0.8 && answerRelevance >= 0.75 && contextRecall >= 0.7,
  };
}

async function main() {
  const dataset = JSON.parse(fs.readFileSync(DATASET_PATH, 'utf8'));
  const results = [];

  for (const item of dataset) {
    const { answer, sources } = await ask(item.query);
    results.push(scoreCase(item, answer, sources));
  }

  const averages = results.reduce((acc, row) => ({
    faithfulness: acc.faithfulness + row.faithfulness,
    answerRelevance: acc.answerRelevance + row.answerRelevance,
    contextRecall: acc.contextRecall + row.contextRecall,
    passed: acc.passed + (row.passed ? 1 : 0),
  }), { faithfulness: 0, answerRelevance: 0, contextRecall: 0, passed: 0 });

  const summary = {
    count: results.length,
    faithfulness: averages.faithfulness / results.length,
    answerRelevance: averages.answerRelevance / results.length,
    contextRecall: averages.contextRecall / results.length,
    passed: averages.passed,
  };

  console.log(JSON.stringify({ summary, results }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
