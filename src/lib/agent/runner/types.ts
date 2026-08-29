import type { SessionRecord } from '../session-manager'

export interface RunnerProvider {
  id: string
  provision(session: SessionRecord): Promise<RunnerHandle>
  destroy(handle: RunnerHandle): Promise<void>
}

export interface RunnerHandle {
  sessionId: string
  exec(command: string[]): Promise<ExecResult>
  readFile(path: string): Promise<string>
  writeFile(path: string, content: string): Promise<void>
  glob(pattern: string): Promise<string[]>
  grep(pattern: string, paths: string[]): Promise<GrepResult[]>
  stop(): Promise<void>
}

export interface ExecResult {
  stdout: string
  stderr: string
  exitCode: number
}

export interface GrepResult {
  file: string
  line: number
  content: string
}
