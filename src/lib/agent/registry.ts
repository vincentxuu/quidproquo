import type { AgentOsKernel } from './kernel'
import { criticAgent } from '../retrieval/agents/critic'
import { plannerAgent } from '../retrieval/agents/planner'
import { researchAgent } from '../retrieval/agents/research'
import { writerAgent } from '../retrieval/agents/writer'
import { frameworkDigestAgent } from '../digest/framework'
import { securityDigestAgent } from '../digest/security'
import { pricingDigestAgent } from '../digest/pricing'
import { githubDigestAgent } from '../digest/github'
import { fundingDigestAgent } from '../digest/funding'
import { toolDigestAgent } from '../digest/tool'
import { modelCardDigestAgent } from '../digest/model-card'
import { aiInterviewDigestAgent } from '../digest/ai-interview'
import { productInterviewDigestAgent } from '../digest/product-interview'

export async function registerAgentDefinitions(kernel: AgentOsKernel): Promise<void> {
  await kernel.defineAgent(criticAgent)
  await kernel.defineAgent(plannerAgent)
  await kernel.defineAgent(researchAgent)
  await kernel.defineAgent(writerAgent)
  await kernel.defineAgent(frameworkDigestAgent)
  await kernel.defineAgent(securityDigestAgent)
  await kernel.defineAgent(pricingDigestAgent)
  await kernel.defineAgent(githubDigestAgent)
  await kernel.defineAgent(fundingDigestAgent)
  await kernel.defineAgent(toolDigestAgent)
  await kernel.defineAgent(modelCardDigestAgent)
  await kernel.defineAgent(aiInterviewDigestAgent)
  await kernel.defineAgent(productInterviewDigestAgent)
}
