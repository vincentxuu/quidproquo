import type { ArtifactVersionRecord } from '../storage/types'

export interface ExportContext {
  version: ArtifactVersionRecord
  body: string
  kind: string
  options: Record<string, unknown>
  kernel?: {
    access?: {
      requestApproval?: (opts: {
        runId: string
        reason: string
        context: Record<string, unknown>
        ttlSeconds: number
      }) => Promise<{ decision: 'approve' | 'reject' | 'expire' } | undefined>
    }
  }
}

export interface ExportResult {
  destination: string
  externalRef?: string
  exportedAt: number
}

export interface Exporter {
  destination: string
  supportsKinds: string[]
  requiresApproval: boolean
  optionsSchema: Record<string, unknown>
  export(ctx: ExportContext): Promise<ExportResult>
}
