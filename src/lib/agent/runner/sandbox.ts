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
import { getSandbox } from '@cloudflare/sandbox'

// Idle containers stop billing once asleep; agent runs are short, so sleep soon.
const SANDBOX_SLEEP_AFTER = '5m'

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
    const stub = getSandbox(
      this.sandboxNamespace as Parameters<typeof getSandbox>[0],
      session.id,
      { sleepAfter: SANDBOX_SLEEP_AFTER },
    ) as unknown as SandboxStub

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

/** The subset of the @cloudflare/sandbox Sandbox API this runner uses. */
interface SandboxStub {
  exec(command: string): Promise<{ exitCode: number; stdout: string; stderr: string }>
  readFile(path: string): Promise<{ content: string }>
  writeFile(path: string, content: string): Promise<unknown>
}

/** The SDK runs a shell command string; quote each argv element for POSIX sh. */
function toShellCommand(argv: string[]): string {
  return argv.map((arg) => (/^[\w@%+=:,./-]+$/.test(arg) ? arg : `'${arg.replace(/'/g, `'\\''`)}'`)).join(' ')
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
    const result = await this.stub.exec(toShellCommand(command))
    return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode }
  }

  async readFile(path: string): Promise<string> {
    return (await this.stub.readFile(path)).content
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
