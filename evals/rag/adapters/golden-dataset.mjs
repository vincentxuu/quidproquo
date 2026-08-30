import fs from 'node:fs'
import path from 'node:path'

export const RAG_GOLDEN_SCHEMA_VERSION = '1.0'

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function requireString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string`)
  }
  return value
}

function requireStringArray(value, label) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`${label} must be an array of strings`)
  }
  return value
}

function validateRetrievalContract(contract, label) {
  if (contract == null) return
  if (!isObject(contract)) throw new Error(`${label} must be an object`)
  requireStringArray(contract.required_sources ?? [], `${label}.required_sources`)
  requireStringArray(contract.forbidden_sources ?? [], `${label}.forbidden_sources`)
  if (contract.min_unique_sources != null && (!Number.isInteger(contract.min_unique_sources) || contract.min_unique_sources < 0)) {
    throw new Error(`${label}.min_unique_sources must be a non-negative integer`)
  }
  if (contract.max_latency_ms != null && (typeof contract.max_latency_ms !== 'number' || contract.max_latency_ms <= 0)) {
    throw new Error(`${label}.max_latency_ms must be a positive number`)
  }
  if (contract.require_uncached != null && typeof contract.require_uncached !== 'boolean') {
    throw new Error(`${label}.require_uncached must be a boolean`)
  }
}

function validateCase(testCase, index, fixture) {
  if (!isObject(testCase)) throw new Error(`cases[${index}] must be an object`)
  requireString(testCase.id, `cases[${index}].id`)
  requireString(testCase.query, `cases[${index}].query`)
  requireStringArray(testCase.expected_answer_points ?? [], `cases[${index}].expected_answer_points`)
  requireStringArray(testCase.expected_sources ?? [], `cases[${index}].expected_sources`)
  requireStringArray(testCase.forbidden_claims ?? [], `cases[${index}].forbidden_claims`)
  requireStringArray(testCase.allowed_trace_patterns ?? [], `cases[${index}].allowed_trace_patterns`)
  validateRetrievalContract(testCase.retrieval_contract, `cases[${index}].retrieval_contract`)

  if (fixture) {
    requireString(testCase.candidate_answer, `cases[${index}].candidate_answer`)
    requireStringArray(testCase.candidate_sources, `cases[${index}].candidate_sources`)
  }
}

export function parseRagDataset(value, options = {}) {
  const fixture = options.fixture === true
  if (!isObject(value)) throw new Error('RAG dataset root must be an object')
  if (value.schema_version !== RAG_GOLDEN_SCHEMA_VERSION) {
    throw new Error(`Unsupported RAG dataset schema_version: ${String(value.schema_version)}`)
  }
  requireString(value.dataset_id, 'dataset_id')
  requireString(value.evidence_kind, 'evidence_kind')
  if (!Array.isArray(value.cases) || value.cases.length === 0) {
    throw new Error('cases must be a non-empty array')
  }

  const ids = new Set()
  const queries = new Set()
  value.cases.forEach((testCase, index) => {
    validateCase(testCase, index, fixture)
    if (ids.has(testCase.id)) throw new Error(`Duplicate RAG case id: ${testCase.id}`)
    if (queries.has(testCase.query)) throw new Error(`Duplicate RAG case query: ${testCase.query}`)
    ids.add(testCase.id)
    queries.add(testCase.query)
  })

  return value
}

export function loadRagDataset(filePath, options = {}) {
  const resolved = path.resolve(filePath)
  let parsed
  try {
    parsed = JSON.parse(fs.readFileSync(resolved, 'utf8'))
  } catch (error) {
    throw new Error(`Failed to read RAG dataset ${resolved}: ${error instanceof Error ? error.message : String(error)}`)
  }
  return parseRagDataset(parsed, options)
}

export function findFixtureCase(dataset, { id, query }) {
  return dataset.cases.find((item) => (id && item.id === id) || item.query === query)
}

export function promptfooConfigFromContract(contract) {
  return {
    requiredSources: contract.required_sources ?? [],
    forbiddenSources: contract.forbidden_sources ?? [],
    minUniqueSources: contract.min_unique_sources ?? 0,
    maxLatencyMs: contract.max_latency_ms ?? Number.POSITIVE_INFINITY,
    requireUncached: contract.require_uncached !== false,
  }
}
