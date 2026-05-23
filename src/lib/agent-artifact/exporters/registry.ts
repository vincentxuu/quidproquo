import { ArtifactExporterNotFound, ArtifactVersionNotFound } from '../errors'
import type { VersionStoreBackend } from '../storage/types'
import type { Exporter, ExportContext, ExportResult } from './types'

export interface ExportByIdOpts {
  versionId: string
  destination: string
  options: Record<string, unknown>
}

export interface ExportByIdResult extends ExportResult {
  exportId?: string
  status?: string
}

export class ExporterRegistry {
  private readonly exporters = new Map<string, Exporter>()

  constructor(private readonly versions?: VersionStoreBackend) {}

  register(exporter: Exporter): void {
    this.exporters.set(exporter.destination, exporter)
  }

  getExporter(destination: string): Exporter {
    const e = this.exporters.get(destination)
    if (!e) throw new ArtifactExporterNotFound(destination)
    return e
  }

  listDestinations(): string[] {
    return [...this.exporters.keys()]
  }

  /** Export by version id — resolves the version row, looks up the exporter, dispatches. */
  async export(opts: ExportByIdOpts & { kernel?: ExportContext['kernel'] }): Promise<ExportByIdResult> {
    const exporter = this.getExporter(opts.destination)

    let version = null
    let body = ''
    let kind = ''
    if (this.versions) {
      version = await this.versions.getById(opts.versionId)
      if (!version) throw new ArtifactVersionNotFound(opts.versionId)
      body = version.bodyText ?? ''
      // Resolve kind from definition if needed — for now read from payloadJson metadata
      kind = opts.destination
    }

    const ctx: ExportContext = {
      version: version as ExportContext['version'],
      body,
      kind,
      options: opts.options,
      kernel: opts.kernel,
    }

    // Approval gate: if the exporter requires approval, pause and wait for human decision
    if (exporter.requiresApproval && ctx.kernel?.access?.requestApproval) {
      const decision = await ctx.kernel.access.requestApproval({
        runId: (version as Record<string, unknown> | null)?.['flow_run_id'] as string ?? '',
        reason: 'artifact_export',
        context: { versionId: opts.versionId, destination: opts.destination, options: opts.options },
        ttlSeconds: 86400,
      })

      const d = decision?.decision ?? 'expire'
      if (d !== 'approve') {
        return {
          destination: opts.destination,
          status: d === 'reject' ? 'rejected' : 'expired',
          exportedAt: Date.now(),
        } as ExportByIdResult
      }
    }

    const result = await exporter.export(ctx)
    return result
  }

  /** Direct export from a fully-resolved ExportContext (used by flow step). */
  async exportDirect(ctx: ExportContext & { destination: string }): Promise<ExportResult> {
    const exporter = this.getExporter(ctx.destination)
    return exporter.export({ version: ctx.version, body: ctx.body, kind: ctx.kind, options: ctx.options })
  }
}
