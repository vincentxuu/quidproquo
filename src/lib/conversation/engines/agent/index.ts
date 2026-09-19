import type { RagLifecycleEngine } from '../contract'
import { langGraphEngine } from '../langgraph'
import { runAgentQueryWithFallback } from './query'

/**
 * `rag_pipeline_engine = agent`：單一 agent + 唯讀工具（search_posts、get_post_detail）。
 * index／evalCase 沿用 langgraph（agent 引擎只改查詢路徑）。
 */
export const agentEngine: RagLifecycleEngine = {
  name: 'agent',
  query: runAgentQueryWithFallback,
  index: langGraphEngine.index,
  evalCase: langGraphEngine.evalCase,
}
