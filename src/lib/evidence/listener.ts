import type { Evidence } from './index'

interface FinishedEvent {
  kind: 'finished'
  agentRunId: string
  output?: {
    evidence?: {
      sources: Array<{ url: string; text: string; freshnessScore?: number }>
    }
  }
}

// Installs evidence extraction hook on a kernel event emitter.
// The kernel shape is intentionally loose (unknown) since agent-os types may not be available here.
export function attachEvidenceToKernel(
  kernel: unknown,
  evidence: Evidence,
  flowRunId: string,
): void {
  const emitter = (
    kernel as { on?: (event: string, handler: (event: unknown) => void) => void }
  ).on
  if (!emitter) return // kernel doesn't expose event hooks yet — no-op

  emitter.call(kernel, 'event', async (rawEvent: unknown) => {
    const event = rawEvent as FinishedEvent
    if (event.kind !== 'finished') return
    if (!event.output?.evidence?.sources?.length) return

    for (const src of event.output.evidence.sources) {
      try {
        const sourceId = await evidence.store.storeSource({
          url: src.url,
          contentHash: '',
          bodyText: src.text,
          freshnessScore: src.freshnessScore ?? 0.5,
          flowRunId,
        })
        const excerptId = await evidence.store.storeExcerpt({
          sourceId,
          offset: 0,
          length: src.text.length,
          text: src.text,
        })
        await evidence.extraction.extractFromSource(
          {
            sourceId,
            url: src.url,
            contentHash: '',
            bodyText: src.text,
            bodyRef: null,
            freshnessScore: src.freshnessScore ?? 0.5,
            retrievedAt: Date.now(),
            providerCallId: null,
            flowRunId,
            agentRunId: event.agentRunId,
            status: 'active',
            createdAt: Date.now(),
          },
          [
            {
              excerptId,
              sourceId,
              offset: 0,
              length: src.text.length,
              text: src.text,
              surroundingContext: null,
              createdAt: Date.now(),
            },
          ],
          { flowRunId, agentRunId: event.agentRunId },
        )
      } catch {
        // Non-fatal: evidence collection errors must not affect the flow run
      }
    }
  })
}
