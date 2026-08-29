export interface RoutineSummary {
  routineId: string
  routineName: string
  sessionId: string
  status: 'completed' | 'failed' | 'needs_action'
  detail: string
  duration: number
  tokenCount: number
}

export interface PlatformFailure {
  routineId: string
  routineName: string
  failedStep: string
  stderr: string
}

export interface ApprovalAction {
  id: string
  sessionId: string
  toolName: string
  input: unknown
}

export interface NotificationChannel {
  id: string
  type: string
  send(summary: RoutineSummary): Promise<void>
  sendPlatformFailure?(failure: PlatformFailure): Promise<void>
  renderActions?(approvals: ApprovalAction[]): Promise<void>
}
