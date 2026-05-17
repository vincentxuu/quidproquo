export class AgentRegistrationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AgentRegistrationError'
  }
}

export class PermissionsChangedWithoutVersionBump extends Error {
  constructor(agentId: string) {
    super(`Permissions changed without version bump for agent: ${agentId}`)
    this.name = 'PermissionsChangedWithoutVersionBump'
  }
}

export class AgentAccessDenied extends Error {
  constructor(public readonly reason: string) {
    super(reason)
    this.name = 'AgentAccessDenied'
  }
}

export class AgentCancelled extends Error {
  constructor(runId: string) {
    super(`Agent run cancelled: ${runId}`)
    this.name = 'AgentCancelled'
  }
}

export class SyscallNotFound extends Error {
  constructor(name: string) {
    super(`Syscall not found: ${name}`)
    this.name = 'SyscallNotFound'
  }
}

export class SyscallInputInvalid extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SyscallInputInvalid'
  }
}

export class SyscallLimitExceeded extends Error {
  constructor(limit: number) {
    super(`Syscall limit exceeded: ${limit}`)
    this.name = 'SyscallLimitExceeded'
  }
}

export class AgentApprovalRejected extends Error {
  constructor(approvalId: string) {
    super(`Approval rejected: ${approvalId}`)
    this.name = 'AgentApprovalRejected'
  }
}

export class AgentApprovalExpired extends Error {
  constructor(approvalId: string) {
    super(`Approval expired: ${approvalId}`)
    this.name = 'AgentApprovalExpired'
  }
}

export class MemoryBodyTooLarge extends Error {
  constructor(limitBytes: number) {
    super(`Memory body exceeds inline limit of ${limitBytes} bytes and R2 memory is disabled`)
    this.name = 'MemoryBodyTooLarge'
  }
}

export class InvalidMemoryType extends Error {
  constructor(type: string) {
    super(`Invalid memory type "${type}". Expected working, episodic, semantic, or procedural.`)
    this.name = 'InvalidMemoryType'
  }
}
