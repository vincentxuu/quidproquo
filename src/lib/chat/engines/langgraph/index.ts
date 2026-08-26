import type { RagLifecycleEngine } from '../contract'
import { runLangGraphEvalCase } from './eval-graph'
import { runLangGraphIndex } from './index-graph'
import { runLangGraphQuery } from './query'

export const langGraphEngine: RagLifecycleEngine = {
  name: 'langgraph',
  query: runLangGraphQuery,
  index: runLangGraphIndex,
  evalCase: runLangGraphEvalCase,
}
