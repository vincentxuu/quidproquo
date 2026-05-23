export class ProviderNotFound extends Error {
  name = 'ProviderNotFound'
  constructor(providerId: string) {
    super(`Provider not found: ${providerId}`)
  }
}

export class ProviderNotEnabled extends Error {
  name = 'ProviderNotEnabled'
  constructor(providerId: string) {
    super(`Provider not enabled: ${providerId}`)
  }
}

export class CredentialNotFound extends Error {
  name = 'CredentialNotFound'
  constructor(providerId: string) {
    super(`No credential found for provider: ${providerId}`)
  }
}

export class CredentialExpired extends Error {
  name = 'CredentialExpired'
  constructor(providerId: string) {
    super(`Credential expired for provider: ${providerId}`)
  }
}

export class ProviderHealthDegraded extends Error {
  name = 'ProviderHealthDegraded'
  constructor(providerId: string) {
    super(`Provider health degraded: ${providerId}`)
  }
}

export class RoutingFailed extends Error {
  name = 'RoutingFailed'
  constructor(message: string) {
    super(message)
  }
}

export class ProviderNotImplemented extends Error {
  name = 'ProviderNotImplemented'
  constructor(providerId: string) {
    super(`Provider not implemented: ${providerId}`)
  }
}
