import type { Env } from '../config/env'
import { readFlags } from '../config/flags'
import { ExporterRegistry } from './exporters/registry'
import { registerDefaultExporters } from './exporters/register-defaults'
import { registerDefaultKinds } from './kinds'
import { ArtifactRegeneration } from './regeneration'
import { ArtifactRegistry } from './registry'
import type { ArtifactBackends } from './storage/types'
import { ArtifactVersioning } from './versioning'

export { ArtifactRegistry } from './registry'
export { ArtifactVersioning } from './versioning'
export type {
  DefinitionStoreBackend,
  VersionStoreBackend,
  SectionStoreBackend,
  ExportStoreBackend,
  ArtifactBlobBackend,
  ArtifactBackends,
} from './storage/types'

function readBool(val: string | undefined): boolean {
  return typeof val === 'string' && val.trim().toLowerCase() === 'true'
}

export interface ArtifactModule {
  registry: ArtifactRegistry
  versioning: ArtifactVersioning
  regeneration: ArtifactRegeneration
  exporters: ExporterRegistry
  storage: ArtifactBackends
}

export function createArtifact(env: Env, backends: ArtifactBackends): ArtifactModule {
  const enabled = readBool(env.AGENT_ARTIFACT_ENABLED)

  const registry = new ArtifactRegistry()
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
  const exporters = new ExporterRegistry(backends.versions)

  if (enabled) {
    // Register all kinds
    registerDefaultKinds(registry)
    registerDefaultExporters(exporters, readFlags(env).agentArtifact)
  }

  return { registry, versioning, regeneration, exporters, storage: backends }
}
