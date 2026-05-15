import type { GraphState } from '../state'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { invokeModel, type ProviderApiKeys } from '../model'

export async function writerNode(
  state: GraphState,
  options?: {
    apiKeys?: ProviderApiKeys
    maxTokens?: number
  }
): Promise<Partial<GraphState>> {
  const maxTokens = options?.maxTokens ?? 2048
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : ''

  const language = state.language === 'en' ? 'English' : '繁體中文'

  const contextParts = state.search_results.slice(0, 8).map((r, i) => {
    const imgs = r.images.length > 0 ? `\nImages: ${r.images.join(', ')}` : ''
    return `[Source ${i + 1}] ${r.source_url}\n${r.evidence_excerpt}${imgs}`
  })

  const needsDisclaimer = (state.critique?.confidence ?? 1) < 0.6 || state.validation?.passed === false

  const systemPrompt = `You are a writer for a personal blog Q&A system.
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
Previous validation issues to avoid: ${(state.validation?.errors ?? []).join('; ') || 'none'}`

  const { response, route } = await invokeModel(
    state.config,
    'writer',
    [
    new SystemMessage(systemPrompt),
    new HumanMessage(`Conversation summary:\n${state.conversation_summary ?? 'none'}\n\nQuestion: ${query}\n\nSources:\n${contextParts.join('\n\n')}`),
    ],
    maxTokens,
    options?.apiKeys
  )

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
