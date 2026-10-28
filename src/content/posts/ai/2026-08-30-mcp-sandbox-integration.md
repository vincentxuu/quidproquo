---
title: "MCP Server 沙箱集成：代理程式執行層的隔離邊界"
date: 2026-08-30
category: ai
type: deep-dive
tags: [sandbox, mcp, model-context-protocol, ai-agent, security, isolation]
lang: zh-TW
tldr: "沙箱系列的整合篇（order 20）。MCP Server 執行代理程式碼時，如何在沙箱中運行、隔離邊界在哪、常見漏洞（CVE-2026-33032）與防禦策略。"
description: "MCP Server 沙箱集成：MCP server 執行 agent 程式碼的沙箱化、隔離邊界、常見漏洞與防禦策略。"
series:
  name: "沙箱系列"
  order: 20
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-30-mcp-sandbox-integration-en)

## 本文定位

這篇是沙箱系列的「整合篇」（order 20），聚焦 **MCP (Model Context Protocol) Server 沙箱集成**。MCP 已成為 2026 年 AI agent 與工具之間的標準協定，但 MCP server 執行代理程式碼時，本身也是新的攻擊面。

本文涵蓋：
1. **MCP 與沙箱的關係** —— 為什麼 MCP server 需要沙箱
2. **MCP server 沙箱架構** —— STDIO 與 HTTP 兩種傳輸的隔離邊界
3. **常見漏洞** —— CVE-2026-33032、工具中毒、路徑遍歷
4. **防禦策略** —— 非特權執行、版本鎖定、網路允許清單
5. **程式碼範例** —— Code Sandbox MCP 的最小實作

---

## MCP 與沙箱的關係

### MCP 是什麼

Model Context Protocol (MCP) 是 Anthropic 於 2024 年末開放的標準協定，定義 AI agent 如何存取工具、資料與應用程式。到 2026 年，MCP 已被 Anthropic、OpenAI、Google 與大多數主要協調器採用，成為 AI agent 生態的「通用介面」。

### 為什麼 MCP server 需要沙箱

MCP server 的核心價值是「讓 agent 執行工具」。但工具執行程式碼時，如果沒有沙箱隔離：

1. **工具程式碼可直接存取主機檔案系統**：agent 透過 MCP server 讀取 `~/.ssh/id_rsa`、`~/.aws/credentials`
2. **工具程式碼可發起網路請求**：agent 透過 MCP server 攻擊內網服務
3. **工具程式碼可啟動子行程**：agent 透過 MCP server 執行任意 shell 命令

這就是 2026 年多起 MCP 安全事件的根因：**MCP server 本身沒有沙箱隔離，代理程式執行層直接暴露在主機上。**

---

## MCP Server 沙箱架構

### STDIO 傳輸的沙箱邊界

STDIO 是 MCP 最常見的傳輸方式，MCP server 透過標準輸入輸出與 agent 通訊。沙箱應圍繞 MCP server 進程建立：

```
┌─────────────────────────────────────┐
│           AI Agent                   │
└─────────────────────────────────────┘
           │ stdio
┌─────────────────────────────────────┐
│         MCP Server                  │
│  (sandboxed process)                │
│  - 非特權使用者                       │
│  - 檔案系統唯讀掛載                   │
│  - 網路預設無出口                     │
│  - 子行程 PID 上限                    │
└─────────────────────────────────────┘
           │ OS 隔離
┌─────────────────────────────────────┐
│           Host OS                    │
└─────────────────────────────────────┘
```

### HTTP 傳輸的沙箱邊界

HTTP 傳輸（Server-Sent Events 或 WebSocket）時，MCP server 運行在網路端點上。沙箱應圍繞伺服器進程，並額外加上網路策略：

```
┌─────────────────────────────────────┐
│           AI Agent                   │
└─────────────────────────────────────┘
           │ HTTP/SSE
┌─────────────────────────────────────┐
│         網路允許清單                    │
│  (只允許 agent 來源 IP)               │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│         MCP Server                  │
│  (sandboxed process)                │
└─────────────────────────────────────┘
```

---

## 常見漏洞

### CVE-2026-33032：nginx-ui MCP 認證繞過（CVSS 9.8）

**攻擊向量**：nginx-ui 產品出廠時內建 MCP 整合，讓 AI agent 可代表管理員管理 nginx 設定。其中一個 MCP 端點（`/mcp_message`）只強制 IP 允許清單，但允許清單為空時，中介軟體將其視為「允許所有」，導致未經驗證的請求可執行任意命令。

**防禦**：
- 不可將空允許清單視為「允許所有」
- MCP 端點應強制身份驗證，不僅僅是 IP 限制

### 工具中毒（Tool Poisoning）

**攻擊向量**：惡意 MCP server 註冊的工具描述中包含隱藏指令，誘導 agent 執行非預期操作。例如，一個「讀取檔案」工具實際上也會寫入攻擊者控制的伺服器。

**防禦**：
- 工具描述與實際執行邏輯分離審查
- 工具執行前要求人工核准（step-up auth）

### 路徑遍歷（Path Traversal）

**攻擊向量**：MCP server 接受使用者提供的檔案路徑，未經過驗證直接存取，agent 可透過 `../` 路徑讀取沙箱外檔案。

**防禦**：
- 路徑正規化後驗證是否在允許範圍內
- 使用 chroot 或唯讀掛載限制檔案系統存取

---

## 防禦策略

### 1. 非特權執行（Non-privileged Execution）

MCP server 應以非特權使用者運行，不擁有 root 權限、不掛載 Docker socket、不存取雲端 metadata 端點。

```bash
# 錯誤：以 root 運行 MCP server
docker run --user root my-mcp-server

# 正確：以非特權使用者運行
docker run --user 1000 --cap-drop ALL --read-only my-mcp-server
```

### 2. 版本鎖定（Version Pinning）

MCP server 的工具定義與執行邏輯應版本鎖定，避免供應商端未通知的變更導致安全行為改變。

### 3. 網路允許清單（Network Allowlist）

MCP server 的網路存取應預設無出口，僅允許必要的外部 API 端點。

### 4. 工具執行人工核准

對於寫入、刪除、部署、付款等高風險操作，應要求人工核准（step-up auth），不應自動執行。

### 5. 沙箱內執行工具

MCP server 執行的每個工具呼叫應在獨立沙箱內運行，工具呼叫之間不共享狀態，避免橫向移動。

---

## 程式碼範例：Code Sandbox MCP 最小實作

以下是一個使用 Python 與 `fastmcp` 建立的最小 Code Sandbox MCP server，使用 Docker 隔離程式碼執行：

```python
from fastmcp import FastMCP
import subprocess
import tempfile
import os

mcp = FastMCP("code-sandbox")

@mcp.tool()
def run_python_code(code: str) -> str:
    """在沙箱化 Docker 容器中執行 Python 程式碼"""
    with tempfile.TemporaryDirectory() as tmpdir:
        code_path = os.path.join(tmpdir, "script.py")
        with open(code_path, "w") as f:
            f.write(code)
        
        result = subprocess.run(
            ["docker", "run", "--rm",
             "--network", "none",
             "--memory", "512m",
             "--cpus", "1",
             "--cap-drop", "ALL",
             "--read-only",
             "--tmpfs", "/tmp:noexec,nosuid,size=100m",
             "-v", f"{tmpdir}:/workspace:ro",
             "python:3.12-slim",
             "python", "/workspace/script.py"],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        return f"stdout: {result.stdout}\nstderr: {result.stderr}\nexit_code: {result.returncode}"

if __name__ == "__main__":
    mcp.run()
```

### 關鍵安全設定說明

| 設定 | 目的 |
|------|------|
| `--network none` | 禁止網路存取，防止外洩與橫向移動 |
| `--memory 512m` | 限制記憶體，防止資源耗盡 |
| `--cpus 1` | 限制 CPU，防止計算資源濫用 |
| `--cap-drop ALL` | 丟棄所有 Linux 能力，防止權限提權 |
| `--read-only` | 檔案系統唯讀，防止寫入惡意檔案 |
| `--tmpfs /tmp:noexec,nosuid` | 臨時檔案系統不可執行，防止二進製攻擊 |
| `-v ...:ro` | 掛載程式碼為唯讀，防止篡改 |

---

## 讀完本文你應該理解

1. MCP server 執行代理程式碼時，為什麼需要沙箱隔離。
2. STDIO 與 HTTP 兩種傳輸的沙箱邊界差異。
3. 三個常見漏洞：CVE-2026-33032 認證繞過、工具中毒、路徑遍歷。
4. 五個防禦策略：非特權執行、版本鎖定、網路允許清單、人工核准、沙箱內執行工具。
5. 使用 Docker 隔離的 Code Sandbox MCP 最小實作與關鍵安全設定。

---

## 參考資料

- [Model Context Protocol (MCP) Specification](https://modelcontextprotocol.io/)
- [CVE-2026-33032: nginx-ui MCP Authentication Bypass](https://www.we45.com/post/securing-the-model-context-protocol-why-your-ai-agents-tool-layer-is-the-new-attack-surface)
- [Code Sandbox MCP](https://www.philschmid.de/code-sandbox-mcp)
- [MCP Code Execution Discussion #1780](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/1780)
- [本站：沙箱系列導讀（order 0）](/posts/tech/2026-08-30-sandbox-series-overview)
- [本站：CLI agent 與 IDE 沙箱整合（order 6）](/posts/tech/2026-08-30-cli-ide-sandbox-integration)
- [本站：AI Agent 沙箱逃逸與權限邊界（order 21）](/posts/tech/2026-08-22-agent-sandbox-permission-boundaries)
