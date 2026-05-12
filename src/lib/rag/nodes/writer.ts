import type { GraphState } from '../state'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { createModel } from '../model'

export async function writerNode(state: GraphState): Promise<Partial<GraphState>> {
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : ''

  const model = createModel(2048)
  const language = state.language === 'en' ? 'English' : '繁體中文'

  const contextParts = state.search_results.slice(0, 8).map((r, i) => {
    const imgs = r.images.length > 0 ? `\nImages: ${r.images.join(', ')}` : ''
    return `[Source ${i + 1}] ${r.source_url}\n${r.evidence_excerpt}${imgs}`
  })

  const needsDisclaimer = state.critique.confidence < 0.6

  const systemPrompt = `You are a writer for a personal blog Q&A system.
Respond in ${language}.
Use the provided sources to answer the question.
Cite sources inline as [short human-readable label](source_url).
Never print bare URLs, URL-only link text, or a separate sources/articles/reference list; the UI renders retrieved sources separately.
Include images as: ![description](image_url)
${needsDisclaimer ? 'Note: Limited information available. Add a disclaimer.' : ''}
Coverage gaps to mention: ${state.coverage_gaps.join(', ') || 'none'}`

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`Question: ${query}\n\nSources:\n${contextParts.join('\n\n')}`),
  ])

  const draft = typeof response.content === 'string' ? response.content : ''

  return {
    draft,
    final_response: draft,
    token_usage: {
      input: (response.usage_metadata?.input_tokens ?? 0) + state.token_usage.input,
      output: (response.usage_metadata?.output_tokens ?? 0) + state.token_usage.output,
    },
  }
}
