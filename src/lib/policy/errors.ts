export class PolicyNotImplemented extends Error {
  constructor(method: string) {
    super(`PolicyNotImplemented: ${method}`)
  }
}

export class PolicyDefinitionInvalid extends Error {
  constructor(errors: string[]) {
    super(`PolicyDefinitionInvalid: ${errors.join(', ')}`)
  }
}

export class PolicyInheritanceCycle extends Error {
  constructor() {
    super('PolicyInheritanceCycle: circular policy binding detected')
  }
}

export class PolicyProviderNotAllowed extends Error {
  readonly status = 403
  constructor(public readonly reason: string) {
    super(`PolicyProviderNotAllowed: ${reason}`)
  }
}
