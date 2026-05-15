import type { PipelineCallbacks, GraphState, NativeTrace } from '../state'

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
  config: GraphState['config']
  providerApiKeys?: Record<string, string>
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
