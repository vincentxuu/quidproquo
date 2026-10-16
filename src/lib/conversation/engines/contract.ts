import type { PipelineCallbacks, GraphState, NativeTrace } from '../../retrieval/state'
import type { ProviderApiKeys } from '../../retrieval/model'

export type RagPipelineEngine = GraphState['config']['pipelineEngine']
export type RagEvaluationSummary = {
  faithfulness: number
  answerRelevance: number
  contextRecall: number
  recallAtK: number
  mrr: number
  sourceDiversity: number
  tokenUsage?: {
    input: number
    output: number
  }
  stageDurationsMs?: Record<string, number>
}

export interface RagLifecycleInput {
  message: string
  traceId: string
  threadId?: string
  conversationSummary?: string
  /** 最近幾輪逐字稿（前端送來，已由 api/chat 驗證與裁剪的純文字）。只當 prompt 背景，不參與檢索。 */
  recentTurns?: string
  pageContext?: GraphState['page_context']
  config: GraphState['config']
  providerApiKeys?: ProviderApiKeys
  indexProfile?: {
    sourceFilters?: Array<'posts' | 'docs'>
    offset?: number
    limit?: number
  }
}

export interface RagLifecycleOutput extends GraphState {
  native_trace?: NativeTrace
}

export interface RagLifecycleEngine {
  name: RagPipelineEngine
  query: (input: RagLifecycleInput, callbacks: PipelineCallbacks) => Promise<RagLifecycleOutput>
  index?: (
    input: RagLifecycleInput,
    callbacks: PipelineCallbacks
  ) => Promise<Pick<RagLifecycleOutput, 'native_trace' | 'search_results' | 'model_usage' | 'token_usage' | 'trace_steps' | 'config'>>
  evalCase?: (
    input: RagLifecycleInput,
    callbacks: PipelineCallbacks
  ) => Promise<Pick<RagLifecycleOutput, 'native_trace' | 'search_results' | 'model_usage' | 'token_usage' | 'trace_steps' | 'config' | 'final_response'>>
}
