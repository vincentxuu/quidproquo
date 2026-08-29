import type { RunnerProvider, RunnerHandle, ExecResult, GrepResult } from './types'
import type { SessionRecord } from '../session-manager'

interface PendingRequest {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
  timer: ReturnType<typeof setTimeout>
}

interface RunnerCommand {
  id: string
  type: 'exec' | 'readFile' | 'writeFile' | 'glob' | 'grep' | 'start' | 'stop'
  params: Record<string, unknown>
}

interface RunnerResponse {
  id: string
  result?: unknown
  error?: string
}

const COMMAND_TIMEOUT_MS = 120_000

export class MacRunnerHandle implements RunnerHandle {
  providerId = 'mac'
  networkMode = 'full' as const
  sessionId: string
  private ws: WebSocket
  private pending = new Map<string, PendingRequest>()

  constructor(sessionId: string, ws: WebSocket) {
    this.sessionId = sessionId
    this.ws = ws
  }

  private send(cmd: RunnerCommand): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(cmd.id)
        reject(new Error(`runner command ${cmd.type} timed out after ${COMMAND_TIMEOUT_MS}ms`))
      }, COMMAND_TIMEOUT_MS)
      this.pending.set(cmd.id, { resolve, reject, timer })
      this.ws.send(JSON.stringify(cmd))
    })
  }

  handleResponse(resp: RunnerResponse): void {
    const p = this.pending.get(resp.id)
    if (!p) return
    this.pending.delete(resp.id)
    clearTimeout(p.timer)
    if (resp.error) {
      p.reject(new Error(resp.error))
    } else {
      p.resolve(resp.result)
    }
  }

  async exec(command: string[]): Promise<ExecResult> {
    const result = await this.send({
      id: crypto.randomUUID(),
      type: 'exec',
      params: { command },
    })
    return result as ExecResult
  }

  async readFile(path: string): Promise<string> {
    const result = await this.send({
      id: crypto.randomUUID(),
      type: 'readFile',
      params: { path },
    })
    return result as string
  }

  async writeFile(path: string, content: string): Promise<void> {
    await this.send({
      id: crypto.randomUUID(),
      type: 'writeFile',
      params: { path, content },
    })
  }

  async glob(pattern: string): Promise<string[]> {
    const result = await this.send({
      id: crypto.randomUUID(),
      type: 'glob',
      params: { pattern },
    })
    return result as string[]
  }

  async grep(pattern: string, paths: string[]): Promise<GrepResult[]> {
    const result = await this.send({
      id: crypto.randomUUID(),
      type: 'grep',
      params: { pattern, paths },
    })
    return result as GrepResult[]
  }

  async stop(): Promise<void> {
    await this.send({
      id: crypto.randomUUID(),
      type: 'stop',
      params: { sessionId: this.sessionId },
    }).catch(() => {})
    for (const [, p] of this.pending) {
      clearTimeout(p.timer)
      p.reject(new Error('runner stopped'))
    }
    this.pending.clear()
  }
}

export class MacRunnerProvider implements RunnerProvider {
  id = 'mac'
  label = 'Mac（本機）'
  private db: D1Database
  private activeHandles = new Map<string, MacRunnerHandle>()
  private runnerWebSockets = new Map<string, WebSocket>()

  constructor(db: D1Database) {
    this.db = db
  }

  registerRunnerSocket(runnerId: string, ws: WebSocket): void {
    this.runnerWebSockets.set(runnerId, ws)
  }

  unregisterRunnerSocket(runnerId: string): void {
    this.runnerWebSockets.delete(runnerId)
  }

  getHandle(sessionId: string): MacRunnerHandle | undefined {
    return this.activeHandles.get(sessionId)
  }

  async provision(session: SessionRecord): Promise<RunnerHandle> {
    const runner = await this.db
      .prepare("SELECT runner_id FROM runner_connections WHERE provider = 'mac' AND status = 'connected' ORDER BY last_heartbeat DESC LIMIT 1")
      .first<{ runner_id: string }>()

    if (!runner) {
      throw new Error('no Mac runner connected — start scripts/mac-runner.mjs on your Mac')
    }

    const ws = this.runnerWebSockets.get(runner.runner_id)
    if (!ws) {
      throw new Error(`Mac runner ${runner.runner_id} registered but WebSocket not found`)
    }

    const handle = new MacRunnerHandle(session.id, ws)
    this.activeHandles.set(session.id, handle)

    await handle.exec(['echo', `session ${session.id} provisioned`])

    return handle
  }

  async destroy(handle: RunnerHandle): Promise<void> {
    await handle.stop()
    this.activeHandles.delete(handle.sessionId)
  }
}
