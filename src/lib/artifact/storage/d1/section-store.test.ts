import { describe, expect, it } from 'vitest'
import { D1SectionStoreBackend } from './section-store'
import { createTestD1 } from '../test/d1-sqlite'
import type { ArtifactSectionRecord } from '../types'

function section(overrides: Partial<ArtifactSectionRecord>): ArtifactSectionRecord {
  return {
    sectionId: crypto.randomUUID(),
    versionId: 'v1',
    artifactId: 'a1',
    orgId: 'default',
    sectionKey: 'body',
    ordinal: 0,
    heading: null,
    bodyText: 'hello',
    bodyJson: null,
    flowStepRunId: 'step-1',
    claimIdsJson: null,
    sourceIdsJson: null,
    approvalStatus: 'draft',
    resolvedBy: null,
    resolvedAt: null,
    createdAt: 1000,
    ...overrides,
  }
}

describe('D1SectionStoreBackend', () => {
  it('insertBatch + listForVersion round-trips ordered by ordinal', async () => {
    const store = new D1SectionStoreBackend(createTestD1(['migrations/0016_agent_artifact.sql']))
    await store.insertBatch([
      section({ sectionKey: 'b', ordinal: 1, claimIdsJson: JSON.stringify([3]) }),
      section({ sectionKey: 'a', ordinal: 0, claimIdsJson: JSON.stringify([1, 2]) }),
    ])
    const rows = await store.listForVersion('v1')
    expect(rows.map((r) => r.sectionKey)).toEqual(['a', 'b'])
    expect(rows[0].claimIdsJson).toBe(JSON.stringify([1, 2]))
    expect(rows[1].flowStepRunId).toBe('step-1')
  })

  it('insertBatch of an empty array is a no-op', async () => {
    const store = new D1SectionStoreBackend(createTestD1(['migrations/0016_agent_artifact.sql']))
    await store.insertBatch([])
    expect(await store.listForVersion('v1')).toEqual([])
  })

  it('updateStatus flips approval_status', async () => {
    const store = new D1SectionStoreBackend(createTestD1(['migrations/0016_agent_artifact.sql']))
    const row = section({ sectionId: 's1' })
    await store.insertBatch([row])
    await store.updateStatus('s1', 'approved', { resolvedBy: 'admin', resolvedAt: 2000 })
    const fetched = await store.getById('s1')
    expect(fetched?.approvalStatus).toBe('approved')
    expect(fetched?.resolvedBy).toBe('admin')
  })
})
