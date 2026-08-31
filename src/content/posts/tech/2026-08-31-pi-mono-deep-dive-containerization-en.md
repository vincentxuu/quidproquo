---
title: "pi-mono Deep Dive 15: Containerization, Sandbox, Permission Model — Gondolin, Docker, OpenShell, Security Boundaries"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, containerization, sandbox, permission-model, gondolin, docker, openshell, security]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 15
tldr: "Why Pi has no built-in permission system, Gondolin Extension (micro-VM), Docker mode, OpenShell policy-controlled sandbox, permission model philosophy, three containerization patterns, security boundary comparison, micro-VM vs container vs process isolation."
description: "Deep dive into pi-mono security architecture: permission model philosophy (no built-in, user decides), Gondolin micro-VM isolation, Docker mode, OpenShell sandbox, security boundary comparison table, Extension sandbox hook points, containerized deployment guide. For engineers researching AI Agent security and sandboxing."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-containerization)

## TL;DR

- **設計哲學**：Pi 不內建 Permission System，理由是「一種規則不適合所有環境」，交由 Extension/容器實作
- **三種容器化模式**：
  1. **Gondolin Extension**：微 VM（KVM/QEMU）、Host 保留 Auth、工具路由到 VM
  2. **Docker**：整個 Pi 跑在 Container、簡單隔離
  3. **OpenShell**：Policy-controlled Sandbox、細粒度權限
- **Gondolin 細節**：`packages/coding-agent/src/extensions/gondolin/`、KVM/QEMU、9pfs 檔案共享、Tool Proxy
- **OpenShell**：Policy Engine、System Call Interception、Capability-based Security
- **Extension 實作沙盒**：`onBeforeToolCall` Hook 攔截、路由到沙盒執行器

---

## 為什麼 Pi 不內建 Permission System？

### 設計決策

> 「Pi 不包含內建權限系統來限制檔案系統、進程、網路或憑證存取。預設情況下，它以啟動使用者和進程的權限運行。」

### 理由

| 考量 | 說明 |
|---|---|
| **環境多樣性** | 本機開發、CI/CD、生產伺服器、Kubernetes、無伺服器——每個環境需不同權限模型 |
| **使用者自主** | 開發者最了解自己的風險承受度、專案敏感度 |
| **擴充性** | Permission System 很難設計成通用、Extension 更靈活 |
| **安全邊界** | Process-level isolation 不夠、需要容器/VM 級別 |
| **維護負擔** | 內建權限系統會成為維護負債、且永遠無法滿足所有人 |

### 替代方案

| 需求 | Pi 官方建議 |
|---|---|
| 檔案系統限制 | Gondolin Extension（微 VM）、Docker、OpenShell |
| 進程隔離 | Docker、Podman、systemd-nspawn |
| 網路控制 | 容器網路命名空間、防火牆規則、OpenShell Policy |
| 憑證保護 | 容器內運行、秘密管理系統（Vault、Sealed Secrets） |
| 審計日誌 | Extension Hooks 記錄所有工具調用 |

---

## 三種容器化部署模式對比

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Pi Containerization Modes                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │
│  │   Gondolin       │  │     Docker       │  │    OpenShell     │           │
│  │   (Micro-VM)     │  │   (Container)    │  │   (Sandbox)      │           │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤           │
│  │ 隔離等級: ★★★★★  │  │ 隔離等級: ★★★★☆  │  │ 隔離等級: ★★★★☆  │           │
│  │ 啟動時間: ~秒     │  │ 啟動時間: ~毫秒   │  │ 啟動時間: ~毫秒   │           │
│  │ 資源開銷: 高      │  │ 資源開銷: 低      │  │ 資源開銷: 中      │           │
│  │ 宿主機需求: KVM   │  │ 宿主機需求: Docker│  │ 宿主機需求: Linux │           │
│  │ 檔案共享: 9pfs    │  │ 檔案共享: Volume  │  │ 檔案共享: Bind   │           │
│  │ Auth 保留 Host    │  │ Auth 在 Container │  │ Auth 在 Sandbox  │           │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Gondolin Extension：微 VM 隔離

### 架構

```
┌─────────────────────────────────────────────────────────────────┐
│                        Gondolin Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Host (Pi Process)                    Guest (Micro-VM)          │
│  ┌─────────────────────┐           ┌─────────────────────┐      │
│  │ Pi Agent            │           │ Linux Kernel        │      │
│  │ ├─ Auth (Keys)      │           │ ├─ Tool Executors   │      │
│  │ ├─ LLM Calls        │    ◄───►  │ ├─ File System      │      │
│  │ ├─ UI/TUI           │   9pfs    │ ├─ Process Manager  │      │
│  │ └─ Gondolin Ext     │           │ └─ Network Stack    │      │
│  └─────────────────────┘           └─────────────────────┘      │
│         │                                    ▲                   │
│         │         QEMU/KVM + virtio         │                   │
│         └────────────────────────────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 核心組件

```typescript
// packages/coding-agent/src/extensions/gondolin/client.ts
export class GondolinClient {
  private vm: MicroVM;
  private fileServer: NinePServer;
  
  async start(config: GondolinConfig): Promise<void> {
    // 1. 啟動 Micro-VM (QEMU/KVM)
    this.vm = await MicroVM.create({
      kernel: config.kernelPath,
      initrd: config.initrdPath,
      memory: config.memory ?? "512M",
      cpus: config.cpus ?? 2,
      // 9pfs 共享宿主機檔案系統
      fs: { type: "9p", tag: "hostfs", path: config.workspacePath },
    });
    
    // 2. 等待 Guest Agent 就緒
    await this.waitForGuestAgent();
    
    // 3. 建立 Tool Proxy
    this.toolProxy = new ToolProxy(this.vm);
  }
  
  async executeTool(toolName: string, args: unknown): Promise<ToolResult> {
    // 將工具調用路由到 VM 內執行
    return this.toolProxy.execute(toolName, args);
  }
}
```

### 9pfs 檔案共享

```typescript
// 宿主機掛載到 Guest
const qemuArgs = [
  "-virtfs", "local,path=/host/workspace,mount_tag=hostfs,security_model=mapped-xattr",
  // Guest 內: mount -t 9p -o trans=virtio hostfs /workspace
];
```

### Tool Proxy：路由工具執行

```typescript
// packages/coding-agent/src/extensions/gondolin/tool-proxy.ts
export class ToolProxy {
  constructor(private vm: MicroVM) {}
  
  async execute(toolName: string, args: unknown): Promise<ToolResult> {
    const requestId = uuidv7();
    
    // 1. 發送請求到 Guest Agent
    await this.vm.send({
      type: "tool_execute",
      requestId,
      tool: toolName,
      args,
    });
    
    // 2. 等待回應（支援串流更新）
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Timeout")), 120000);
      
      this.vm.onMessage((msg) => {
        if (msg.requestId === requestId) {
          clearTimeout(timeout);
          if (msg.type === "tool_result") resolve(msg.result);
          else if (msg.type === "tool_error") reject(new Error(msg.error));
        }
      });
    });
  }
}
```

### Guest Agent（VM 內）

```typescript
// Gondolin Guest 內部運行的 Agent
class GuestAgent {
  private tools: Map<string, AgentTool> = new Map();
  
  async handleExecute(request: ToolExecuteRequest): Promise<void> {
    const tool = this.tools.get(request.tool);
    if (!tool) {
      this.send({ type: "tool_error", requestId: request.requestId, error: "Tool not found" });
      return;
    }
    
    try {
      const result = await tool.execute(request.requestId, request.args, 
        new AbortSignal(), (partial) => {
          // 串流更新回 Host
          this.send({ type: "tool_update", requestId: request.requestId, partial });
        }
      );
      this.send({ type: "tool_result", requestId: request.requestId, result });
    } catch (e) {
      this.send({ type: "tool_error", requestId: request.requestId, error: e.message });
    }
  }
}
```

---

## Docker 模式：簡單隔離

### Dockerfile

```dockerfile
# Dockerfile.pi
FROM node:22-alpine

# 安裝 Pi
RUN npm install -g @earendil-works/pi-coding-agent

# 建立非 root 使用者
RUN adduser -D -s /bin/sh pi
USER pi
WORKDIR /workspace

# 進入點
ENTRYPOINT ["pi"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  pi:
    build: .
    volumes:
      - ./workspace:/workspace
      - ~/.pi:/home/pi/.pi  # 持久化設定
      - ~/.ssh:/home/pi/.ssh:ro  # SSH Keys (唯讀)
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    # 安全選項
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /home/pi/.cache
```

### 執行模式

```bash
# 1. 互動模式
docker compose run --rm pi

# 2. 單次指令
docker compose run --rm pi -p "Read package.json"

# 3. 持久化 Session
docker compose run --rm -v pi-sessions:/home/pi/.pi/agent/sessions pi
```

---

## OpenShell：Policy-controlled Sandbox

### 架構

```
┌─────────────────────────────────────────────────────────────────┐
│                        OpenShell Architecture                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐     ┌─────────────────┐                    │
│  │ Pi Process      │     │ OpenShell       │                    │
│  │                 │     │ Sandbox         │                    │
│  │ Tool Call ──────┼────►│ Policy Engine   │                    │
│  │                 │     │ ├─ Allow/Deny   │                    │
│  │ Result ◄────────┼────┤ ├─ Resource     │                    │
│  │                 │     │ │   Limits      │                    │
│  │                 │     │ └─ Syscall      │                    │
│  │                 │     │     Intercept   │                    │
│  └─────────────────┘     └─────────────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Policy 定義

```yaml
# openshell-policy.yaml
version: "1.0"
policies:
  - name: "default-deny"
    default: deny
    rules:
      - action: allow
        tool: "read"
        paths:
          - "/workspace/**"
        conditions:
          - "file.size < 10MB"
  
  - name: "write-restricted"
    default: deny
    rules:
      - action: allow
        tool: "write"
        paths:
          - "/workspace/src/**"
          - "/workspace/tests/**"
        conditions:
          - "file.extension in ['.ts', '.js', '.json', '.md']"
  
  - name: "bash-limited"
    default: deny
    rules:
      - action: allow
        tool: "bash"
        commands:
          - "npm test"
          - "npm run build"
          - "git status"
          - "git diff"
        denied:
          - "rm -rf"
          - "sudo"
          - "chmod 777"
```

### Policy Engine 實作

```typescript
// openshell/src/policy-engine.ts
export class PolicyEngine {
  private policies: Policy[];
  
  evaluate(tool: string, args: unknown): PolicyDecision {
    for (const policy of this.policies) {
      const rule = policy.rules.find(r => r.tool === tool);
      if (!rule) continue;
      
      // 條件匹配
      if (this.matchConditions(rule.conditions, args)) {
        return { allowed: rule.action === "allow", reason: rule.reason };
      }
    }
    return { allowed: false, reason: "No matching policy" };
  }
  
  private matchConditions(conditions: Condition[], args: unknown): boolean {
    return conditions.every(c => this.evaluateCondition(c, args));
  }
}
```

### System Call Intercept (Linux)

```c
// openshell/src/syscall-intercept.c
// 使用 seccomp-bpf 或 ptrace 攔截系統調用
static int seccomp_filter(struct seccomp_data *data) {
    // 允許的 syscall 白名單
    switch (data->nr) {
        case __NR_read:
        case __NR_write:
        case __NR_openat:
        case __NR_close:
            return SECCOMP_RET_ALLOW;
        case __NR_execve:
        case __NR_execveat:
            // 檢查命令是否在允許清單
            return check_execve_allowed(data) ? SECCOMP_RET_ALLOW : SECCOMP_RET_KILL;
        default:
            return SECCOMP_RET_KILL;
    }
}
```

---

## Extension 實作沙盒：Hook Points

### onBeforeToolCall 攔截

```typescript
// 任意 Extension 可實作沙盒路由
const sandboxExtension: Extension = {
  name: "custom-sandbox",
  version: "1.0.0",
  
  onBeforeToolCall: async (ctx, signal) => {
    const { toolCall, args } = ctx;
    
    // 1. 檢查是否需要沙盒
    if (requiresSandbox(toolCall.name, args)) {
      // 2. 路由到沙盒執行器
      const result = await sandboxExecutor.execute(toolCall.name, args);
      
      // 3. 返回結果，阻擋原生執行
      return {
        block: true,
        reason: "Executed in sandbox",
        // 自訂結果
        customResult: result,
      };
    }
    
    return undefined; // 繼續原生執行
  },
};

function requiresSandbox(toolName: string, args: unknown): boolean {
  // 高風險工具
  if (["bash", "write", "edit"].includes(toolName)) return true;
  
  // 敏感路徑
  if (args && typeof args === "object" && "path" in args) {
    const path = (args as any).path;
    if (path.startsWith("/etc/") || path.startsWith("/root/")) return true;
  }
  
  return false;
}
```

### Sandbox Executor 抽象

```typescript
interface SandboxExecutor {
  execute(toolName: string, args: unknown): Promise<ToolResult>;
}

class DockerSandboxExecutor implements SandboxExecutor {
  async execute(toolName: string, args: unknown): Promise<ToolResult> {
    // 在臨時 Container 執行
    const container = await docker.createContainer({
      Image: "pi-sandbox:latest",
      Cmd: [toolName, JSON.stringify(args)],
      HostConfig: {
        NetworkMode: "none",
        ReadonlyRootfs: true,
        Memory: 512 * 1024 * 1024,
        CpuQuota: 50000,
      },
    });
    
    await container.start();
    const result = await container.wait();
    const logs = await container.logs({ stdout: true, stderr: true });
    await container.remove();
    
    return { content: [{ type: "text", text: logs }], details: { exitCode: result.StatusCode } };
  }
}

class GondolinSandboxExecutor implements SandboxExecutor {
  async execute(toolName: string, args: unknown): Promise<ToolResult> {
    // 路由到 Gondolin Micro-VM
    return gondolinClient.executeTool(toolName, args);
  }
}

class OpenShellSandboxExecutor implements SandboxExecutor {
  async execute(toolName: string, args: unknown): Promise<ToolResult> {
    // 經過 Policy Engine 評估
    const decision = policyEngine.evaluate(toolName, args);
    if (!decision.allowed) {
      throw new Error(`Policy denied: ${decision.reason}`);
    }
    // 執行（可能在 seccomp 沙盒內）
    return nativeExecute(toolName, args);
  }
}
```

---

## 安全邊界總結

| 攻擊向量 | Gondolin | Docker | OpenShell | 原生 Pi |
|---|---|---|---|---|
| 惡意檔案寫入 | ✅ VM 隔離 | ✅ Volume 權限 | ✅ Policy Deny | ❌ 無防護 |
| 惡意指令執行 | ✅ VM 隔離 | ✅ Capability Drop | ✅ Seccomp/Seccomp | ❌ 無防護 |
| 網路洩漏 | ✅ VM 網路隔離 | ✅ Network Namespace | ✅ Policy Control | ❌ 無防護 |
| 憑證竊取 | ✅ Auth 留 Host | ⚠️ 需 Volume 掛載 | ⚠️ 需 Policy 保護 | ❌ 無防護 |
| 逃逸風險 | 低 | 中 | 低 | 高 |

---

## 選擇指南

| 場景 | 推薦模式 |
|---|---|
| 本機開發、高安全需求 | Gondolin (Micro-VM) |
| CI/CD Pipeline、快速啟動 | Docker |
| 生產環境、細粒度控制 | OpenShell |
| 團隊共享、標準化 | Docker + 共享 Policy |
| 臨時實驗、一次性任務 | 原生 Pi + Extension Hook |

---

## 參考資料

- [GitHub - earendil-works/pi — packages/coding-agent/src/extensions/gondolin/](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src/extensions/gondolin)
- [Pi 官方文件：Containerization](https://pi.dev/docs/latest/containerization)
- [QEMU/KVM 官方文件](https://www.qemu.org/docs/master/)
- [9pfs 協定](https://www.kernel.org/doc/html/latest/filesystems/9p.html)
- [seccomp-bpf 文件](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html)
- [OpenShell 專案](https://github.com/openshell/openshell)

---

## 下一篇預告

> **第 16 篇：Release 流程、Lockstep Versioning、Binary Build、Trusted Publishing**
>
> Lockstep Versioning 所有套件同版本、Release Script 流程、Local Smoke Test、Binary Build (Bun/Node)、npm-shrinkwrap.json、GitHub Actions OIDC Trusted Publishing、R2 Release Marker、pi.dev/api/latest-version、Announcement Verification。