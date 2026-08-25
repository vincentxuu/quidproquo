import type { StepExecutor } from '../step-executor'
import { registerStepExecutor } from '../step-executor'

interface AgentStepFields {
  model?: string
  prompt?: string
  maxTokens?: number
}

interface ProviderConfig {
  baseUrl: string
  envKey: string
  defaultModel: string
}

const PROVIDERS: Record<string, ProviderConfig> = {
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', envKey: 'OPENROUTER_API_KEY', defaultModel: 'stealth/ox-alpha' },
  opencode: { baseUrl: 'https://opencode.ai/zen/v1', envKey: 'OPENCODE_API_KEY', defaultModel: 'anthropic/claude-sonnet-4-20250514' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', envKey: 'GROQ_API_KEY', defaultModel: 'llama-3.3-70b-versatile' },
  openai: { baseUrl: 'https://api.openai.com/v1', envKey: 'OPENAI_API_KEY', defaultModel: 'gpt-4o' },
}

async function callLlm(provider: string, prompt: string, maxTokens: number): Promise<{ content: string; model: string; tokens?: unknown }> {
  const config = PROVIDERS[provider]
  if (!config) throw new Error(`Unknown provider: ${provider}`)

  const { env } = await import('cloudflare:workers')
  const apiKey = (env as Record<string, string>)[config.envKey]
  if (!apiKey) throw new Error(`${config.envKey} not set`)

  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.defaultModel,
      messages: [
        { role: 'system', content: 'You are a research assistant. Return structured JSON when asked.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: maxTokens,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status} ${body}`)
  }

  const data = await res.json() as { choices: Array<{ message: { content: string } }>; model: string; usage?: unknown }
  return {
    content: data.choices?.[0]?.message?.content ?? '',
    model: data.model,
    tokens: data.usage,
  }
}

const agentStepExecutor: StepExecutor = async (step, ctx, _state) => {
  if (step.type !== 'agent') return { outputs: {}, status: 'failed', errorJson: { kind: 'type_mismatch' } }

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

  const fields = step as unknown as AgentStepFields
  if (fields.model && fields.prompt && PROVIDERS[fields.model]) {
    try {
      const result = await callLlm(fields.model, fields.prompt, fields.maxTokens ?? 2000)
      return {
        outputs: {
          content: result.content,
          provider: fields.model,
          model: result.model,
          tokens: result.tokens,
        },
        status: 'done',
      }
    } catch (llmErr) {
      console.error('[agent-step] LLM failed:', String(llmErr))
      return { outputs: { stubbed: true, stepType: 'agent', llmError: String(llmErr) }, status: 'done' }
    }
  }

  return { outputs: { stubbed: true, stepType: 'agent' }, status: 'done' }
}

registerStepExecutor('agent', agentStepExecutor)
export { agentStepExecutor }
