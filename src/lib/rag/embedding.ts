export interface EmbeddingRuntime {
  run(model: string, input: Record<string, unknown>): Promise<unknown>
}

export interface EmbeddingProvider {
  readonly id: string
  readonly model: string
  readonly dimensions: number
  readonly batchSize: number
  readonly cacheNamespace: string
  embedQueries(runtime: EmbeddingRuntime, queries: string[]): Promise<number[][]>
  embedDocuments(runtime: EmbeddingRuntime, documents: string[]): Promise<number[][]>
  embedTexts(runtime: EmbeddingRuntime, texts: string[]): Promise<number[][]>
}

export function createWorkersAiEmbeddingRuntime(ai: Ai): EmbeddingRuntime {
  return {
    async run(model, input) {
      return ai.run(model, input)
    },
  }
}

function isEmbeddingOutput(value: unknown): value is { data: number[][] } {
  if (!value || typeof value !== 'object') return false
  const data = Reflect.get(value, 'data')
  return Array.isArray(data) && data.every(
    vector => Array.isArray(vector) && vector.every(component => typeof component === 'number')
  )
}

function validateEmbeddingOutput(
  output: unknown,
  expectedCount: number,
  expectedDimensions: number
): number[][] {
  if (!isEmbeddingOutput(output) || output.data.length !== expectedCount) {
    const received = isEmbeddingOutput(output) ? output.data.length : 0
    throw new Error(`Embedding output count mismatch: expected ${expectedCount}, received ${received}`)
  }

  const invalidIndex = output.data.findIndex(vector => vector.length !== expectedDimensions)
  if (invalidIndex >= 0) {
    throw new Error(
      `Embedding dimension mismatch at index ${invalidIndex}: expected ${expectedDimensions}, received ${output.data[invalidIndex].length}`
    )
  }

  return output.data
}

export const QWEN3_QUERY_INSTRUCTION = [
  'Given a Traditional Chinese or English technical knowledge-base question,',
  'retrieve passages that directly answer it.',
  'Preserve product names, API identifiers, and code terms across languages.',
].join(' ')

const qwen3Dimensions = 1024
const qwen3Model = '@cf/qwen/qwen3-embedding-0.6b'

async function runQwen3(
  runtime: EmbeddingRuntime,
  input: Record<string, unknown>,
  expectedCount: number
): Promise<number[][]> {
  const output = await runtime.run(qwen3Model, input)
  return validateEmbeddingOutput(output, expectedCount, qwen3Dimensions)
}

export const qwen3EmbeddingProvider: EmbeddingProvider = {
  id: 'workers-ai-qwen3-embedding-0.6b',
  model: qwen3Model,
  dimensions: qwen3Dimensions,
  batchSize: 50,
  cacheNamespace: 'qwen3-embedding-0.6b-v1',

  async embedQueries(runtime, queries) {
    if (queries.length === 0) return []
    return runQwen3(runtime, {
      queries,
      instruction: QWEN3_QUERY_INSTRUCTION,
    }, queries.length)
  },

  async embedDocuments(runtime, documents) {
    if (documents.length === 0) return []
    return runQwen3(runtime, { documents }, documents.length)
  },

  async embedTexts(runtime, texts) {
    if (texts.length === 0) return []
    return runQwen3(runtime, { text: texts }, texts.length)
  },
}

export const EMBEDDING_PROVIDERS = {
  qwen3: qwen3EmbeddingProvider,
} as const satisfies Record<string, EmbeddingProvider>

export type EmbeddingProviderId = keyof typeof EMBEDDING_PROVIDERS

/** Change this single selection only after rebuilding every vector and cache. */
export const ACTIVE_EMBEDDING_PROVIDER_ID: EmbeddingProviderId = 'qwen3'
export const ACTIVE_EMBEDDING_PROVIDER = EMBEDDING_PROVIDERS[ACTIVE_EMBEDDING_PROVIDER_ID]

export const EMBED_MODEL = ACTIVE_EMBEDDING_PROVIDER.model
export const EMBED_BATCH_SIZE = ACTIVE_EMBEDDING_PROVIDER.batchSize
export const EMBED_DIMENSIONS = ACTIVE_EMBEDDING_PROVIDER.dimensions
export const EMBEDDING_VERSION = ACTIVE_EMBEDDING_PROVIDER.cacheNamespace

export async function embedQueries(ai: Ai, queries: string[]): Promise<number[][]> {
  return ACTIVE_EMBEDDING_PROVIDER.embedQueries(createWorkersAiEmbeddingRuntime(ai), queries)
}

export async function embedDocuments(ai: Ai, documents: string[]): Promise<number[][]> {
  return ACTIVE_EMBEDDING_PROVIDER.embedDocuments(createWorkersAiEmbeddingRuntime(ai), documents)
}

/** Symmetric embeddings for stores that use one interface for both sides. */
export async function embedTexts(ai: Ai, texts: string[]): Promise<number[][]> {
  return ACTIVE_EMBEDDING_PROVIDER.embedTexts(createWorkersAiEmbeddingRuntime(ai), texts)
}
