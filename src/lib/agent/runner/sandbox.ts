import type {
  SandboxRunnerProvider,
  RunnerHandle,
  ExecResult,
  GrepResult,
  EnvironmentConfig,
  RunnerStatus,
  NetworkMode,
} from './types'
import type { SessionRecord } from '../session-manager'

const TRUSTED_HOSTS = [
  'github.com',
  '*.github.com',
  'registry.npmjs.org',
  'registry.yarnpkg.com',
  '*.cloudflare.com',
  '*.googleapis.com',
]

function buildNetworkPolicy(mode: NetworkMode, config?: EnvironmentConfig) {
  switch (mode) {
    case 'none':
      return { allowedHosts: [] as string[], deniedHosts: ['*'] }
    case 'trusted':
      return { allowedHosts: TRUSTED_HOSTS, deniedHosts: [] as string[] }
    case 'full':
      return { allowedHosts: ['*'], deniedHosts: [] as string[] }
    case 'custom':
      return {
        allowedHosts: config?.allowedHosts ?? [],
        deniedHosts: config?.deniedHosts ?? [],
      }
  }
}

export class SandboxProvider implements SandboxRunnerProvider {
  id = 'sandbox'
  label = 'Cloudflare Sandbox'

  private sandbox: unknown
  private handles = new Map<string, SandboxHandle>()

  constructor(private sandboxBinding: unknown) {
    this.sandbox = sandboxBinding
  }

  async isAvailable(): Promise<boolean> {
    return this.sandbox != null
  }

  async provision(session: SessionRecord, env?: EnvironmentConfig): Promise<RunnerHandle> {
    const networkMode: NetworkMode = env?.networkMode ?? 'trusted'
    const network = buildNetworkPolicy(networkMode, env)

    const sb = this.sandbox as {
      create: (opts: Record<string, unknown>) => Promise<{ id: string; exec: (argv: string[]) => Promise<{ exitCode: number; stdout: string; stderr: string }> }>
    }

    const container = await sb.create({
      sleepAfter: 600_000,
      network,
      env: env?.envVars ?? {},
    })

    const handle = new SandboxHandle(session.id, container, networkMode)
    this.handles.set(session.id, handle)

    if (session.repo) {
      await this.clone(handle, session.repo)
    }
    if (env?.setupScript) {
      await this.runSetupScript(handle, env.setupScript)
    }

    return handle
  }

  async clone(handle: RunnerHandle, repo: string, branch?: string): Promise<void> {
    const branchArg = branch ? ['-b', branch] : []
    const result = await handle.exec(['git', 'clone', '--depth', '1', ...branchArg, repo, '/workspace'])
    if (result.exitCode !== 0) {
      throw new Error(`Clone failed: ${result.stderr}`)
    }
    await handle.exec(['sh', '-c', 'cd /workspace'])
  }

  async runSetupScript(handle: RunnerHandle, script: string): Promise<ExecResult> {
    await handle.writeFile('/tmp/setup.sh', script)
    return handle.exec(['bash', '/tmp/setup.sh'])
  }

  async destroy(handle: RunnerHandle): Promise<void> {
    const sh = this.handles.get(handle.sessionId)
    if (sh) {
      await sh.destroyContainer()
      this.handles.delete(handle.sessionId)
    }
  }

  async status(handle: RunnerHandle): Promise<RunnerStatus> {
    const sh = this.handles.get(handle.sessionId)
    return sh?.containerStatus ?? 'destroyed'
  }
}

class SandboxHandle implements RunnerHandle {
  providerId = 'sandbox'
  containerId?: string
  networkMode: NetworkMode
  sessionId: string
  containerStatus: RunnerStatus = 'running'

  private container: {
    id: string
    exec: (argv: string[]) => Promise<{ exitCode: number; stdout: string; stderr: string }>
    destroy?: () => Promise<void>
  }

  constructor(
    sessionId: string,
    container: { id: string; exec: (argv: string[]) => Promise<{ exitCode: number; stdout: string; stderr: string }> },
    networkMode: NetworkMode,
  ) {
    this.sessionId = sessionId
    this.container = container
    this.containerId = container.id
    this.networkMode = networkMode
  }

  async exec(command: string[]): Promise<ExecResult> {
    const result = await this.container.exec(command)
    return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode }
  }

  async readFile(path: string): Promise<string> {
    const result = await this.exec(['cat', path])
    if (result.exitCode !== 0) throw new Error(`readFile failed: ${result.stderr}`)
    return result.stdout
  }

  async writeFile(path: string, content: string): Promise<void> {
    const escaped = content.replace(/'/g, "'\\''")
    const result = await this.exec(['sh', '-c', `printf '%s' '${escaped}' > ${path}`])
    if (result.exitCode !== 0) throw new Error(`writeFile failed: ${result.stderr}`)
  }

  async glob(pattern: string): Promise<string[]> {
    const result = await this.exec(['sh', '-c', `find /workspace -path '${pattern}' -type f 2>/dev/null`])
    if (result.exitCode !== 0) return []
    return result.stdout.trim().split('\n').filter(Boolean)
  }

  async grep(pattern: string, paths: string[]): Promise<GrepResult[]> {
    const result = await this.exec(['grep', '-rn', pattern, ...paths])
    if (result.exitCode !== 0) return []
    return result.stdout.trim().split('\n').filter(Boolean).map(line => {
      const [file, lineStr, ...rest] = line.split(':')
      return { file, line: parseInt(lineStr, 10), content: rest.join(':') }
    })
  }

  async stop(): Promise<void> {
    await this.exec(['sh', '-c', 'cd /workspace && git add -A && git diff --cached --quiet || git commit -m "auto-save" && git push 2>/dev/null || true'])
    this.containerStatus = 'stopped'
  }

  async destroyContainer(): Promise<void> {
    if (this.container.destroy) {
      await this.container.destroy()
    }
    this.containerStatus = 'destroyed'
  }
}
