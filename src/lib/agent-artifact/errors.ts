export class ArtifactNotImplemented extends Error {
  constructor(method: string) {
    super(`ArtifactNotImplemented: ${method}`)
    this.name = 'ArtifactNotImplemented'
  }
}

export class ArtifactKindUnknown extends Error {
  constructor(kind: string) {
    super(`ArtifactKindUnknown: ${kind}`)
    this.name = 'ArtifactKindUnknown'
  }
}

export class ArtifactValidationError extends Error {
  constructor(message: string) {
    super(`ArtifactValidationError: ${message}`)
    this.name = 'ArtifactValidationError'
  }
}

export class ArtifactVersionNotFound extends Error {
  constructor(versionId: string) {
    super(`ArtifactVersionNotFound: ${versionId}`)
    this.name = 'ArtifactVersionNotFound'
  }
}

export class ArtifactExporterNotFound extends Error {
  constructor(destination: string) {
    super(`ArtifactExporterNotFound: ${destination}`)
    this.name = 'ArtifactExporterNotFound'
  }
}

export class ArtifactExporterDenied extends Error {
  constructor(reason: string) {
    super(`ArtifactExporterDenied: ${reason}`)
    this.name = 'ArtifactExporterDenied'
  }
}

export class ArtifactBlobTooLarge extends Error {
  constructor(bytes: number) {
    super(`ArtifactBlobTooLarge: ${bytes} bytes exceeds 256KB limit and r2Offload is disabled`)
    this.name = 'ArtifactBlobTooLarge'
  }
}

export class ArtifactFlagDisabled extends Error {
  constructor(flag: string) {
    super(`ArtifactFlagDisabled: ${flag}`)
    this.name = 'ArtifactFlagDisabled'
  }
}

export class ArtifactSectionUnknown extends Error {
  constructor(sectionId: string) {
    super(`ArtifactSectionUnknown: ${sectionId}`)
    this.name = 'ArtifactSectionUnknown'
  }
}

export class ArtifactRegenerationFailed extends Error {
  constructor(reason: string) {
    super(`ArtifactRegenerationFailed: ${reason}`)
    this.name = 'ArtifactRegenerationFailed'
  }
}
