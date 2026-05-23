import type { BlobBackend } from '../../agent-os/storage/types'
import type { Flags } from '../../config/flags'

export async function preservePartialOutput(
  flowRunId: string,
  partialOutput: Record<string, unknown>,
  blobBackend: BlobBackend,
  flags: Pick<Flags, 'agentPolicy' | 'agentOs'>,
): Promise<string | null> {
  if (!flags.agentPolicy.enabled || !flags.agentOs.memory.r2) {
    return null  // R2 disabled — partial output dropped
  }
  try {
    const body = JSON.stringify(partialOutput)
    const { key } = await blobBackend.put('partial-outputs', flowRunId, body)
    return key
  } catch {
    return null
  }
}
