export class FlowParseError extends Error {
  constructor(
    public readonly path: string[],
    message: string,
    public readonly line?: number,
    public readonly column?: number,
  ) {
    super(`FlowParseError at ${path.join('.')}: ${message}`)
    this.name = 'FlowParseError'
  }
}

export class FlowSchemaError extends Error {
  constructor(
    public readonly path: string[],
    message: string,
    public readonly line?: number,
    public readonly column?: number,
  ) {
    super(`FlowSchemaError at ${path.join('.')}: ${message}`)
    this.name = 'FlowSchemaError'
  }
}

export class FlowStepValidationError extends Error {
  constructor(
    public readonly path: string[],
    message: string,
  ) {
    super(`FlowStepValidationError at ${path.join('.')}: ${message}`)
    this.name = 'FlowStepValidationError'
  }
}

export class FlowEdgeValidationError extends Error {
  constructor(
    public readonly path: string[],
    message: string,
  ) {
    super(`FlowEdgeValidationError at ${path.join('.')}: ${message}`)
    this.name = 'FlowEdgeValidationError'
  }
}

export class FlowCycleError extends Error {
  constructor(public readonly cycle: string[]) {
    super(`FlowCycleError: cycle detected: ${cycle.join(' → ')}`)
    this.name = 'FlowCycleError'
  }
}

export class FlowCompileError extends Error {
  constructor(public readonly reason: string) {
    super(`FlowCompileError: ${reason}`)
    this.name = 'FlowCompileError'
  }
}

export class FlowLoopBoundsError extends Error {
  constructor(
    public readonly path: string[],
    message: string,
  ) {
    super(`FlowLoopBoundsError at ${path.join('.')}: ${message}`)
    this.name = 'FlowLoopBoundsError'
  }
}

export class FlowConditionError extends Error {
  constructor(
    public readonly path: string[],
    message: string,
  ) {
    super(`FlowConditionError at ${path.join('.')}: ${message}`)
    this.name = 'FlowConditionError'
  }
}
