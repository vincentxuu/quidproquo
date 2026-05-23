import { describe, expect, it } from 'vitest'
import { ArtifactRegenerationFailed, ArtifactVersionNotFound } from './errors'
import { ArtifactRegeneration } from './regeneration'
import { ArtifactRegistry } from './registry'
import { registerDefaultKinds } from './kinds'
import { ArtifactVersioning } from './versioning'
import type { ArtifactSectionRecord } from './storage/types'
import { createInMemoryArtifactBackends } from './storage/test/in-memory'

function setup() {
  const backends = createInMemoryArtifactBackends()
  const registry = new ArtifactRegistry()
  registerDefaultKinds(registry)
  const versioning = new ArtifactVersioning(
    {
      definitions: backends.definitions,
      versions: backends.versions,
      sections: backends.sections,
      blobs: backends.blobs,
    },
    registry,
  )
  const regeneration = new ArtifactRegeneration({
    versioning,
    definitions: backends.definitions,
    versions: backends.versions,
    sections: backends.sections,
    registry,
  })
  return { backends, registry, versioning, regeneration }
}

describe('ArtifactRegeneration.regenerateFromStep', () => {
  it('re-runs a step, patches its sections, and creates a new chained version', async () => {
    const { backends, versioning, regeneration } = setup()

    const original = await versioning.createVersion({
      flowId: 'flow-1',
      kind: 'markdown_report',
      logicalName: 'Q1 report',
      inputsHash: 'hash-1',
      flowRunId: 'run-1',
      flowStepRunId: 'step-1',
      payload: {
        title: 'Q1 report',
        sections: [
          { heading: 'Intro', body_markdown: 'intro v1' },
          { heading: 'Findings', body_markdown: 'findings v1' },
        ],
      },
    })

    // createVersion stamps the SAME flowStepRunId on all sections; rewrite the persisted rows so the
    // two sections come from distinct steps, to exercise per-step patching.
    const persisted = await backends.sections.listForVersion(original.versionId)
    const rewritten: ArtifactSectionRecord[] = persisted.map((row, index) => ({
      ...row,
      flowStepRunId: index === 0 ? 'step-1' : 'step-2',
    }))
    await backends.sections.insertBatch(rewritten)

    let reRanWith: { stepRunId: string; options?: Record<string, unknown> } | null = null
    const result = await regeneration.regenerateFromStep({
      versionId: original.versionId,
      stepRunId: 'step-2',
      options: { providerOverride: 'alt-llm' },
      reRunStep: async (stepRunId, options) => {
        reRanWith = { stepRunId, options }
        return {
          output: { title: 'Q1 report', sections: [{ heading: 'Findings', body_markdown: 'findings v2' }] },
        }
      },
    })

    expect(reRanWith).toEqual({ stepRunId: 'step-2', options: { providerOverride: 'alt-llm' } })
    expect(result.newVersionId).not.toBeNull()
    expect(result.patchedSections).toEqual([rewritten[1].sectionId])

    const newVersion = await backends.versions.getById(result.newVersionId!)
    expect(newVersion?.parentVersionId).toBe(original.versionId)
    expect(newVersion?.versionNumber).toBe(2)

    // Section 1 (step-1) is unchanged; section 2 (step-2) carries the regenerated body.
    const newSections = await backends.sections.listForVersion(result.newVersionId!)
    expect(newSections.map((s) => s.bodyText)).toEqual(['intro v1', 'findings v2'])
  })

  it('throws ArtifactRegenerationFailed for a binary kind', async () => {
    const { backends, versioning, regeneration } = setup()

    const version = await versioning.createVersion({
      flowId: 'flow-pdf',
      kind: 'pdf_export',
      logicalName: 'deck',
      inputsHash: 'hash-pdf',
      flowRunId: 'run-pdf',
      flowStepRunId: 'step-1',
      payload: { title: 'Deck', blocks: [{ type: 'heading', text: 'H' }] },
    })
    void backends

    await expect(
      regeneration.regenerateFromStep({
        versionId: version.versionId,
        stepRunId: 'step-1',
        reRunStep: async () => ({ output: {} }),
      }),
    ).rejects.toBeInstanceOf(ArtifactRegenerationFailed)
  })

  it('throws ArtifactVersionNotFound for an unknown versionId', async () => {
    const { regeneration } = setup()
    await expect(
      regeneration.regenerateFromStep({
        versionId: 'missing',
        stepRunId: 'step-1',
        reRunStep: async () => ({ output: {} }),
      }),
    ).rejects.toBeInstanceOf(ArtifactVersionNotFound)
  })
})
