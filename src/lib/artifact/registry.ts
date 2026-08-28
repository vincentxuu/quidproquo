import { ArtifactKindUnknown, ArtifactValidationError } from './errors'
import type { ArtifactKindDefinition } from './registry/types'

export class ArtifactRegistry {
  private readonly kinds = new Map<string, ArtifactKindDefinition>()

  defineArtifact(def: ArtifactKindDefinition): void {
    this.kinds.set(def.kind, def)
  }

  getKind(kind: string): ArtifactKindDefinition {
    const def = this.kinds.get(kind)
    if (!def) throw new ArtifactKindUnknown(kind)
    return def
  }

  listKinds(): string[] {
    return [...this.kinds.keys()]
  }

  validatePayload(kind: string, payload: unknown): void {
    const def = this.getKind(kind)
    if (def.validate) {
      try {
        def.validate(payload)
      } catch (err) {
        throw new ArtifactValidationError(err instanceof Error ? err.message : String(err))
      }
    }
  }
}
