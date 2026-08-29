import type { SessionRecord } from '../session-manager'

export type NetworkMode = 'none' | 'trusted' | 'full' | 'custom'
export type RunnerStatus = 'provisioning' | 'cloning' | 'setup' | 'running' | 'sleeping' | 'stopped' | 'destroyed'

export interface EnvironmentConfig {
  runnerProvider: string
  networkMode: NetworkMode
  allowedHosts?: string[]
  deniedHosts?: string[]
  envVars?: Record<string, string>
  setupScript?: string
}

export interface RunnerProvider {
  id: string
  label: string
  provision(session: SessionRecord, env?: EnvironmentConfig): Promise<RunnerHandle>
  destroy(handle: RunnerHandle): Promise<void>
  status?(handle: RunnerHandle): Promise<RunnerStatus>
  isAvailable?(): Promise<boolean>
}

export interface SandboxRunnerProvider extends RunnerProvider {
  clone(handle: RunnerHandle, repo: string, branch?: string): Promise<void>
  runSetupScript(handle: RunnerHandle, script: string): Promise<ExecResult>
}

export interface RunnerHandle {
  providerId: string
  containerId?: string
  sessionId: string
  networkMode: NetworkMode
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
