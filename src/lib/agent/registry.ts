import type { AgentOsKernel } from './kernel'
import { criticAgent } from '../retrieval/agents/critic'
import { plannerAgent } from '../retrieval/agents/planner'
import { researchAgent } from '../retrieval/agents/research'
import { writerAgent } from '../retrieval/agents/writer'
import { frameworkDigestAgent } from '../digest/framework'

export async function registerAgentDefinitions(kernel: AgentOsKernel): Promise<void> {
  await kernel.defineAgent(criticAgent)
  await kernel.defineAgent(plannerAgent)
  await kernel.defineAgent(researchAgent)
  await kernel.defineAgent(writerAgent)
  await kernel.defineAgent(frameworkDigestAgent)
}
