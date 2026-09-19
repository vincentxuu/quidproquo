import { langGraphEngine } from './langgraph'
import { manualEngine } from './manual'
import { agentEngine } from './agent'
import type { RagLifecycleEngine, RagPipelineEngine } from './contract'

const ENGINES: Record<RagPipelineEngine, RagLifecycleEngine> = {
  manual: manualEngine,
  langgraph: langGraphEngine,
  agent: agentEngine,
}

export function resolveRagEngine(name: RagPipelineEngine): RagLifecycleEngine {
  return ENGINES[name]
}

export { ENGINES as RAG_ENGINE_REGISTRY }
