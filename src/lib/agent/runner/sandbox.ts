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

// A sleeping container loses /workspace, so the idle limit must outlast the longest
// gap between commands in a run (one model call can take minutes with retries).
// Runs destroy the container when they finish, so this only bounds abandoned runs.
const SANDBOX_SLEEP_AFTER = '20m'

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
  destroy(): Promise<void>
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
    // find -path matches the whole path, so anchor relative patterns at the workspace root.
    const absolute = pattern.startsWith('/') ? pattern : `/workspace/${pattern.replace(/^\.\//, '')}`
    const result = await this.exec(['find', '/workspace', '-path', absolute, '-type', 'f'])
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

  /** Commits and pushes any workspace changes, then destroys the container; throws when saving fails. */
  async stop(): Promise<void> {
    try {
      await this.save()
    } finally {
      await this.stub.destroy().catch(() => {})
    }
  }

  private async save(): Promise<void> {
    const status = await this.exec(['git', '-C', '/workspace', 'status', '--porcelain'])
    if (status.exitCode !== 0) throw new Error(`workspace status failed: ${redact(status.stderr)}`)
    if (!status.stdout.trim()) return

    const commit = await this.exec(['sh', '-c', 'cd /workspace && git add -A && git commit -m "auto-save"'])
    if (commit.exitCode !== 0) throw new Error(`auto-save commit failed: ${redact(commit.stderr || commit.stdout)}`)

    const push = await this.exec(['git', '-C', '/workspace', 'push', 'origin', 'HEAD'])
    if (push.exitCode !== 0) throw new Error(`auto-save push failed: ${redact(push.stderr || push.stdout)}`)
  }
}

/** Strips credentials embedded in clone URLs from git output. */
function redact(text: string): string {
  return text.replace(/\/\/[^/@\s]+@/g, '//***@').trim().slice(0, 500)
}
