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

export class SandboxProvider implements SandboxRunnerProvider {
  id = 'sandbox'
  label = 'Cloudflare Sandbox'

  private handles = new Map<string, SandboxHandle>()

  constructor(private sandboxNamespace: unknown) {}

  async isAvailable(): Promise<boolean> {
    return this.sandboxNamespace != null
  }

  async provision(session: SessionRecord, env?: EnvironmentConfig, branch?: string): Promise<RunnerHandle> {
    const networkMode: NetworkMode = env?.networkMode ?? 'trusted'
    const ns = this.sandboxNamespace as {
      idFromName: (name: string) => unknown
      get: (id: unknown) => SandboxStub
    }

    const id = ns.idFromName(session.id)
    const stub = ns.get(id)

    const handle = new SandboxHandle(session.id, stub, networkMode)
    this.handles.set(session.id, handle)

    if (session.repo) {
      await this.clone(handle, session.repo, branch)
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
  }

  async runSetupScript(handle: RunnerHandle, script: string): Promise<ExecResult> {
    await handle.writeFile('/tmp/setup.sh', script)
    return handle.exec(['bash', '/tmp/setup.sh'])
  }

  async destroy(handle: RunnerHandle): Promise<void> {
    const sh = this.handles.get(handle.sessionId)
    if (sh) {
      this.handles.delete(handle.sessionId)
    }
  }

  async status(_handle: RunnerHandle): Promise<RunnerStatus> {
    return 'running'
  }
}

interface SandboxStub {
  exec(argv: string[]): Promise<{ exitCode: number; stdout: string; stderr: string }>
  readFile(path: string): Promise<string>
  writeFile(path: string, contents: string): Promise<void>
}

class SandboxHandle implements RunnerHandle {
  providerId = 'sandbox'
  containerId?: string
  networkMode: NetworkMode
  sessionId: string

  constructor(
    sessionId: string,
    private stub: SandboxStub,
    networkMode: NetworkMode,
  ) {
    this.sessionId = sessionId
    this.networkMode = networkMode
  }

  async exec(command: string[]): Promise<ExecResult> {
    const result = await this.stub.exec(command)
    return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode }
  }

  async readFile(path: string): Promise<string> {
    return this.stub.readFile(path)
  }

  async writeFile(path: string, content: string): Promise<void> {
    await this.stub.writeFile(path, content)
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
  }
}
