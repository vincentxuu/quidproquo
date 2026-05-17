import { env as workerEnv } from 'cloudflare:workers'

export interface AgentQueueMessage {
  agentId: string
  input?: Record<string, unknown>
  parentRunId?: string
}

export interface Env {
  DB: D1Database
  SESSION: KVNamespace
  RATE: KVNamespace
  DEEP_RESEARCH_KV?: KVNamespace
  VECTORIZE_INDEX: VectorizeIndex
  VECTORIZE_ABSTRACT?: VectorizeIndex
  AI: Ai
  R2_IMAGES: R2Bucket
  CRAWL_SECRET?: string
  ADMIN_PASSWORD?: string
  LLM_PROVIDER?: string
  URL?: string
  AGENT_QUEUE?: Queue<AgentQueueMessage>
  R2_AGENT_MEMORY?: R2Bucket
  AGENT_OS_ENABLED?: string
  AGENT_OS_PLANNER?: string
  AGENT_OS_RESEARCH?: string
  AGENT_OS_WRITER?: string
  AGENT_OS_CRITIC?: string
  AGENT_OS_MEMORY_R2?: string
  AGENT_OS_TOOLS_MCP_EXTERNAL?: string
  AGENT_OS_SCHEDULER_QUEUES?: string
}

export function getEnv(): Env {
  return workerEnv as unknown as Env
}
