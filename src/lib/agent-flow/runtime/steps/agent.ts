import type { StepExecutor } from '../step-executor'
import { registerStepExecutor } from '../step-executor'

interface AgentStepFields {
  model?: string
  prompt?: string
  maxTokens?: number
}

const agentStepExecutor: StepExecutor = async (step, ctx, _state) => {
  if (step.type !== 'agent') return { outputs: {}, status: 'failed', errorJson: { kind: 'type_mismatch' } }

  // Kernel dispatch (Phase 3 wires real kernel; Phase 2 stub)
  const kernel = ctx.kernel as { scheduler?: { dispatch: (opts: unknown) => Promise<unknown> } } | undefined
  if (kernel?.scheduler?.dispatch) {
    try {
      const result = await kernel.scheduler.dispatch({
        agentId: (step as unknown as { agentId: string }).agentId,
        trigger: 'sub-agent',
        parentRunId: ctx.flowRunId,
        input: (step as unknown as { input?: unknown }).input ?? {},
      })
      return { outputs: { result }, status: 'done' }
    } catch (err) {
      return { outputs: {}, status: 'failed', errorJson: { kind: 'agent_dispatch_failed', error: String(err) } }
    }
  }

  // Direct LLM invocation when no kernel but model+prompt are specified
  const fields = step as unknown as AgentStepFields
  if (fields.model && fields.prompt) {
    try {
      const { createModel } = await import('../../../rag/model')
      const { HumanMessage, SystemMessage } = await import('@langchain/core/messages')
      const route = { provider: fields.model as 'groq' | 'openai' | 'openrouter' | 'opencode' | 'cloudflare' | 'google', model: getDefaultModel(fields.model), fallback: false }
      const model = createModel(fields.maxTokens ?? 2000, { route })
      const response = await model.invoke([
        new SystemMessage('You are a research assistant. Return structured JSON when asked.'),
        new HumanMessage(fields.prompt),
      ])
      const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content)
      return {
        outputs: {
          content,
          provider: fields.model,
          tokens: response.usage_metadata ?? null,
        },
        status: 'done',
      }
    } catch {
      // LLM unavailable (missing API key, network error) — fall through to stub
    }
  }

  // Stub: no kernel and no model configured
  return { outputs: { stubbed: true, stepType: 'agent' }, status: 'done' }
}

function getDefaultModel(provider: string): string {
  const defaults: Record<string, string> = {
    groq: 'llama-3.3-70b-versatile',
    openrouter: 'openrouter/auto',
    opencode: 'anthropic/claude-sonnet-4-20250514',
    openai: 'gpt-4o',
    cloudflare: '@cf/meta/llama-3.1-8b-instruct',
    google: 'gemini-2.0-flash',
  }
  return defaults[provider] ?? 'llama-3.3-70b-versatile'
}

registerStepExecutor('agent', agentStepExecutor)
export { agentStepExecutor }
