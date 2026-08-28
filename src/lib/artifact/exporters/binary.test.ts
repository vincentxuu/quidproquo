import { describe, expect, it } from 'vitest'
import type { Env } from '../../config/env'
import { ArtifactExporterDenied } from '../errors'
import { createArtifact } from '../index'
import { createInMemoryArtifactBackends } from '../storage/test/in-memory'
import type { ExportContext } from './types'
import { createCsvFileExporter, csvFileExporter } from './csv-file'
import { createPdfExporter } from './pdf'
import { createPptxExporter } from './pptx'

function ctx(body: string): ExportContext {
  return {
    version: {} as ExportContext['version'],
    body,
    kind: 'csv_spreadsheet',
    options: { path: '/tmp/out.csv' },
  }
}

describe('csv-file exporter', () => {
  it('writes the body via an injected filesystem', async () => {
    const writes = new Map<string, string>()
    const exporter = createCsvFileExporter({ async write(path, body) { writes.set(path, body) } })
    const result = await exporter.export(ctx('a,b\r\n1,2'))
    expect(result.destination).toBe('csv_file')
    expect(writes.get('/tmp/out.csv')).toBe('a,b\r\n1,2')
  })

  it('throws ArtifactExporterDenied with no filesystem (Workers)', async () => {
    await expect(csvFileExporter.export(ctx('a,b'))).rejects.toBeInstanceOf(ArtifactExporterDenied)
  })
})

describe('pdf / pptx exporters (generator seam)', () => {
  const pdfCtx: ExportContext = {
    version: {} as ExportContext['version'],
    body: JSON.stringify({ title: 'Doc' }),
    kind: 'pdf_export',
    options: {},
  }

  it('pdf: invokes the injected generator and reports byte size', async () => {
    const exporter = createPdfExporter(true, async () => new Uint8Array([1, 2, 3, 4]))
    const result = await exporter.export(pdfCtx)
    expect(result.externalRef).toBe('4 bytes')
  })

  it('pdf: throws when no generator is configured', async () => {
    await expect(createPdfExporter(true).export(pdfCtx)).rejects.toBeInstanceOf(ArtifactExporterDenied)
  })

  it('pdf: throws when disabled', async () => {
    await expect(createPdfExporter(false, async () => new Uint8Array()).export(pdfCtx)).rejects.toBeInstanceOf(
      ArtifactExporterDenied,
    )
  })

  it('pptx: invokes the injected generator', async () => {
    const exporter = createPptxExporter(true, async () => new Uint8Array(10))
    const result = await exporter.export({ ...pdfCtx, kind: 'pptx_export' })
    expect(result.externalRef).toBe('10 bytes')
  })
})

describe('Phase 7 registration', () => {
  it('registers csv_file when the csv flag is on', () => {
    const artifact = createArtifact(
      { AGENT_ARTIFACT_ENABLED: 'true', AGENT_ARTIFACT_CSV: 'true' } as Env,
      createInMemoryArtifactBackends(),
    )
    expect(artifact.exporters.listDestinations()).toContain('csv_file')
  })

  it('registers all five kinds when enabled', () => {
    const artifact = createArtifact({ AGENT_ARTIFACT_ENABLED: 'true' } as Env, createInMemoryArtifactBackends())
    const kinds = artifact.registry.listKinds()
    expect(kinds).toEqual(
      expect.arrayContaining([
        'markdown_report',
        'evidence_bundle',
        'csv_spreadsheet',
        'pdf_export',
        'pptx_export',
      ]),
    )
  })

  it('does not register binary exporters when their flags are off', () => {
    const artifact = createArtifact({ AGENT_ARTIFACT_ENABLED: 'true' } as Env, createInMemoryArtifactBackends())
    const destinations = artifact.exporters.listDestinations()
    expect(destinations).not.toContain('pdf')
    expect(destinations).not.toContain('pptx')
    expect(destinations).not.toContain('csv_file')
  })
})
