import { langGraphEngine } from './langgraph'
import { llamaIndexEngine } from './llamaindex'
import { manualEngine } from './manual'
import type { RagLifecycleEngine, RagPipelineEngine } from './contract'

const ENGINES: Record<RagPipelineEngine, RagLifecycleEngine> = {
  manual: manualEngine,
  langgraph: langGraphEngine,
  llamaindex: llamaIndexEngine,
}

export function resolveRagEngine(name: RagPipelineEngine): RagLifecycleEngine {
  return ENGINES[name]
}

export { ENGINES as RAG_ENGINE_REGISTRY }
