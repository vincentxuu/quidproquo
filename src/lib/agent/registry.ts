import type { AgentOsKernel } from './kernel'
import { criticAgent } from '../retrieval/agents/critic'
import { plannerAgent } from '../retrieval/agents/planner'
import { researchAgent } from '../retrieval/agents/research'
import { writerAgent } from '../retrieval/agents/writer'

export async function registerAgentDefinitions(kernel: AgentOsKernel): Promise<void> {
  // Phase 3 registers migrated RAG agents here one-by-one behind per-agent flags.
  await kernel.defineAgent(criticAgent)
  await kernel.defineAgent(plannerAgent)
  await kernel.defineAgent(researchAgent)
  await kernel.defineAgent(writerAgent)
}
