import type { Env } from '../config/env'
import { D1DefinitionStoreBackend } from './storage/d1/definition-store'
import { D1ExportStoreBackend } from './storage/d1/export-store'
import { D1SectionStoreBackend } from './storage/d1/section-store'
import { D1VersionStoreBackend } from './storage/d1/version-store'
import { InMemoryArtifactBlobBackend } from './storage/test/in-memory'
import type { ArtifactBackends } from './storage/types'

export type { ArtifactBackends } from './storage/types'

/**
 * Wire production D1/R2 backends from Cloudflare Worker bindings.
 */
export function createBackends(env: Env): ArtifactBackends {
  return {
    definitions: new D1DefinitionStoreBackend(env.DB),
    versions: new D1VersionStoreBackend(env.DB),
    sections: new D1SectionStoreBackend(env.DB),
    exports: new D1ExportStoreBackend(env.DB),
    // Blob backend: in production wire R2 here; for now use in-memory stub (flag-gated at Phase 3)
    blobs: new InMemoryArtifactBlobBackend(),
  }
}
