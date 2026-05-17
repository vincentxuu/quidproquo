import type { GraphState } from '../state'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { invokeModel, type ProviderApiKeys } from '../model'
import { defineAgent } from '../../agent-os/access'

type ResultProfile = {
  writerContextSources?: number
}

type WriterModelResult = Awaited<ReturnType<typeof invokeModel>>

interface WriterRunOptions {
  apiKeys?: ProviderApiKeys
  maxTokens?: number
  resultProfile?: ResultProfile
  skillInstructions?: string
}

interface AgentRuntimeOptions {
  providerApiKeys?: ProviderApiKeys
}

interface AgentRuntime {
  syscallContext: Parameters<import('../../agent-os/kernel').AgentOsKernel['syscall']>[0]
  syscall: import('../../agent-os/kernel').AgentOsKernel['syscall']
  runtimeOptions?: AgentRuntimeOptions
}

export async function writerNode(
  state: GraphState,
  options?: WriterRunOptions
): Promise<Partial<GraphState>> {
  const maxTokens = options?.maxTokens ?? 2048
  const { systemPrompt, userPrompt } = buildWriterPrompts(state, {
    resultProfile: options?.resultProfile,
    skillInstructions: options?.skillInstructions,
  })

  const { response, route } = await invokeModel(
    state.config,
    'writer',
    [
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ],
    maxTokens,
    options?.apiKeys
  )

  return buildWriterUpdate(state, { response, route })
}

export const writerAgent = defineAgent<GraphState, Partial<GraphState>>({
  id: 'writer',
  version: 1,
  displayName: 'Writer',
  description: 'Writes grounded RAG answers from retrieved sources.',
  syscalls: ['model.invoke', 'memory.read', 'search.docs'],
  memoryScopes: ['agent', 'session'],
  secrets: [],
  outboundDomains: [],
  toolCallLimit: 10,
  timeoutSeconds: 180,
  irreversibleActionsRequireApproval: false,
  async run(state, runtime) {
    const { syscallContext, syscall, runtimeOptions } = runtime as AgentRuntime
    const maxTokens = 2048
    const { systemPrompt, userPrompt } = buildWriterPrompts(state)
    const result = await syscall(syscallContext, 'model.invoke', {
      config: state.config,
      stage: 'writer',
      messages: [
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt),
      ],
      maxTokens,
      apiKeys: runtimeOptions?.providerApiKeys,
    }) as WriterModelResult

    return buildWriterUpdate(state, result)
  },
})

function buildWriterPrompts(
  state: GraphState,
  options?: Pick<WriterRunOptions, 'resultProfile' | 'skillInstructions'>
): { systemPrompt: string; userPrompt: string } {
  const writerContextSources = Math.max(1, Math.min(40, Math.round(
    typeof options?.resultProfile?.writerContextSources === 'number' && Number.isFinite(options.resultProfile.writerContextSources)
      ? options.resultProfile.writerContextSources
      : 8
  )))
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage?.content === 'string' ? lastMessage.content : ''

  const language = state.language === 'en' ? 'English' : '繁體中文'

  const contextParts = state.search_results.slice(0, writerContextSources).map((r, i) => {
    const imgs = r.images.length > 0 ? `\nImages: ${r.images.join(', ')}` : ''
    return `[Source ${i + 1}] ${r.source_url}\n${r.evidence_excerpt}${imgs}`
  })

  const needsDisclaimer = (state.critique?.confidence ?? 1) < 0.6 || state.validation?.passed === false

  return {
    systemPrompt: `You are a writer for a personal blog Q&A system.
Respond in ${language}.

Describe the successful end state by producing an answer that:
- directly resolves the user's question before adding extra detail
- for recommendation intent, returns a structured list with title, category/link, and a concrete recommendation reason before any narrative
- stays grounded in the provided sources only
- cites factual claims inline as [short human-readable label](source_url) using the EXACT source_url from the provided sources
- never prints bare URLs, URL-only link text, or a separate "sources/articles/reference list"; the UI renders retrieved sources separately
- uses images only as ![description](image_url) when an image materially helps
- explicitly names uncertainty or missing evidence instead of guessing
- is valid Markdown with balanced code fences
- keeps Mermaid diagrams inside \`\`\`mermaid fenced blocks when used

Avoid step-by-step self-instructions or meta commentary about your process.
${needsDisclaimer ? 'Because prior checks found low confidence or formatting issues, include a brief limitation note near the start.' : ''}
Coverage gaps to mention if relevant: ${(state.coverage_gaps ?? []).join(', ') || 'none'}
Previous validation issues to avoid: ${(state.validation?.errors ?? []).join('; ') || 'none'}
${options?.skillInstructions ? `\nAgent skill instructions:\n${options.skillInstructions}` : ''}`,
    userPrompt: `Conversation summary:\n${state.conversation_summary ?? 'none'}\n\nQuestion: ${query}\n\nSources:\n${contextParts.join('\n\n')}`,
  }
}

function buildWriterUpdate(state: GraphState, result: WriterModelResult): Partial<GraphState> {
  const { response, route } = result
  const draft = typeof response.content === 'string' ? response.content : ''

  return {
    draft,
    final_response: draft,
    iteration: state.iteration + 1,
    token_usage: {
      input: (response.usage_metadata?.input_tokens ?? 0) + state.token_usage.input,
      output: (response.usage_metadata?.output_tokens ?? 0) + state.token_usage.output,
    },
    model_usage: [...state.model_usage, { stage: 'writer', ...route }],
  }
}
