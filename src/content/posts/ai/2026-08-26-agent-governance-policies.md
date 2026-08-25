---
title: "治理深水區：Policy、Omnibox、Spend 與憑證代理"
date: 2026-08-26
category: ai
type: deep-dive
tags: [agent-governance, omnigent, policy, sandbox, mcp]
lang: zh-TW
tldr: "Omnigent 把治理從 prompt 抽到 Server 層的 Policy 引擎：Python 函式回 allow/deny/ask，三層堆疊疊加 cost budget 與 tool caps，搭配 Omnibox 以 bwrap/seatbelt 做 OS 原生隔離與 egress 憑證代理；本文對照 FailproofAI、DashClaw 等五套治理方案的定位與決策表。"
description: "深入 Omnigent 的 contextual Policy 模型、三層堆疊、Spend 與 tool caps，以及 Omnibox 的 bwrap/seatbelt 隔離與 egress 憑證代理，並與 FailproofAI、DashClaw、custodian-kernel、Microsoft agent-governance-toolkit、herdr 對照，附 YAML 範例與選型決策表。"
series:
  name: "Meta-Harness 與 Agent 治理"
  order: 4
glossary:
  - term: "Policy"
    aliases: ["policy engine", "governance policy"]
    definition: "在 harness 之外、以程式攔截工具呼叫的治理規則，依上下文回傳 allow、deny 或 ask。"
    definition_en: "A governance rule outside the harness that intercepts tool calls and returns allow, deny, or ask based on context."
    advanced: "Omnigent 的 Policy 是 Python 函式，能讀取完整 session 上下文，較嚴格的規則優先，並可組合 cost budget 與 tool caps。"
    advanced_en: "In Omnigent, a Policy is a Python function with full session context; stricter rules win and can compose cost budgets and tool caps."
    links:
      - label: "Omnigent Policies"
        url: "https://omnigent.ai/docs/policies/overview"
  - term: "Omnibox"
    definition: "Omnigent 的 OS 層沙盒，以 Linux bwrap、macOS seatbelt 與 Windows Job Object 提供檔案與網路隔離，並透過 egress proxy 代理憑證。"
    definition_en: "Omnigent's OS-level sandbox using Linux bwrap, macOS seatbelt and Windows Job Objects for filesystem and network isolation with egress-proxy credential brokering."
    links:
      - label: "Omnibox 文件"
        url: "https://omnigent.ai/docs/policies/os-sandbox"
  - term: "憑證代理"
    aliases: ["credential brokering", "secretless"]
    definition: "憑證不進 agent 記憶體，只在 egress proxy 上對允許的請求臨時注入，降低外洩與提示詞竊取風險。"
    definition_en: "Credentials never enter the agent's memory; the egress proxy injects them only for allowed requests, reducing exfiltration and prompt-stealing risk."
---

> 🌏 [English version](/posts/ai/2026-08-26-agent-governance-policies-en)

前兩篇把 [Omnigent](https://github.com/omnigent-ai/omnigent) 的位置排開了：[第一篇談 Runner/Server/Omnibox 與 Polly 範例](/posts/ai/2026-08-26-omnigent-meta-harness)，[第二篇用四層模型對照 ACP、HarnessAgent 與 Flue](/posts/ai/2026-08-27-meta-harness-layers)。這篇往下鑽一層，談最容易被當成「再加一個 allowlist 就好」的治理——為什麼 [Omnigent](https://omnigent.ai/) 要用 Python 函式做 Policy、錢與次數怎麼控、以及 [Omnibox](https://omnigent.ai/docs/policies/os-sandbox) 為何不直接用 Docker 就好。最後用一張決策表對照五套同場方案：[FailproofAI](https://github.com/FailproofAI/failproofai)、[DashClaw](https://github.com/dashclaw/dashclaw)、[custodian-kernel](https://github.com/custodian-kernel/custodian-kernel)、[Microsoft agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit) 與 [herdr](https://github.com/herdrdev/herdr)。

## 為什麼治理不能只寫在提示詞裡

提示詞裡的「不要跑 `rm -rf`」「不要讀機密檔案」有三個結構性弱點：第一，模型看得到就能繞過；第二，審計時無法證明「當時攔了什麼」；第三，每換一個 harness 就要重寫一次。[Omnigent](https://omnigent.ai/) 的解法是把治理抽到 [Server 層的 tool hooks](https://omnigent.ai/docs/policies/overview)：無論底下跑 [Claude Code](https://code.claude.com/)、[Codex](https://developers.openai.com/codex) 還是 [Pi](https://github.com/badlogic/pi-mono)，所有工具呼叫在執行前都會經過同一條 Policy 路徑，回傳 `allow` / `deny` / `ask`。這讓治理變成可測試、可版本控制的程式，而不是散在提示詞中的自然語言叮嚀。

關鍵差異在**上下文**：Policy 函式看到的是整個 session——已讀過哪些檔案、剛才呼叫了什麼工具、現在想對哪個路徑寫入。相較於只看當次工具名稱的靜態 allowlist，這種 contextual 判斷能做到「讀 `src/` 可以，讀 `secrets/` 要 ask」「`git push` 到 `origin/main` 要擋，推到 `feat/*` 放行」。

## Omnigent 的 Policy：Python 函式與三層堆疊

一個 Policy 就是一個 Python 函式，簽章大致為 `def policy(ctx) -> Decision`，在 [Server 端執行](https://omnigent.ai/docs/policies/overview)。`ctx` 包含 session 歷史、當前工具呼叫、觸發該 Policy 的設定，`Decision` 為三選一。內建的 [safety 與 cost families](https://github.com/omnigent-ai/omnigent/tree/main/src/omnigent/policies/builtins) 已涵蓋常見情境，其餘可自寫函式接上。

### YAML 長什麼樣

```yaml
# omnigent.yaml — Policy 三層疊加範例
policies:
  # 任何 shell / OS 工具先問人
  approve_shell:
    type: function
    handler: omnigent.policies.builtins.safety.ask_on_os_tools

  # 單一 session 最多 50 次工具呼叫，超過直接 deny
  cap_calls:
    type: function
    handler: omnigent.policies.builtins.safety.max_tool_calls_per_session
    factory_params: { limit: 50 }

  # 花費到 3 美元先提醒，到 5 美元硬停
  budget:
    type: function
    handler: omnigent.policies.builtins.cost.cost_budget
    factory_params: { max_cost_usd: 5.00, ask_thresholds_usd: [3.00] }

  # 只擋「讀 /secrets」這種高風險路徑，其餘放行
  guard_secrets:
    type: function
    handler: policies.custom.deny_read_secrets
```

自訂函式只需回傳字串或結構化 Decision：

```python
# policies/custom.py
def deny_read_secrets(ctx):
    tool = ctx.tool_call
    if tool.name in ("read", "read_file") and "/secrets" in str(tool.args.get("path", "")):
        return "deny"  # 也可回 {"decision": "deny", "reason": "secrets 路徑需人工授權"}
    return "allow"
```

實務上可在 [Web UI 的 session 資訊面板](https://omnigent.ai/docs/policies/overview)即時開關，或直接在對話中說「幫我加一個 shell 前要我同意的 policy」。這對團隊很重要：治理不是部署時才定一次，而是在對話中逐步收斂。

### 三層堆疊：誰說了算

堆疊順序為 `server-wide（管理員）` → `per-agent（開發者）` → `per-session（使用者）`，**較嚴格者優先**。例如管理員設 `max_cost_usd: 20`，開發者在 agent YAML 設 `5`，實際生效為 `5`；若某層回 `deny`，就不會被較寬鬆的 `allow` 蓋掉。這個設計讓「組織底線」與「任務彈性」可並存——底線由平台定，任務可在底線內放寬。

## 錢與次數：Spend 與 Tool Caps

多 agent 同時跑時，最痛的不是單次呼叫貴，而是**沒人知道什麼時候該停**。[Omnigent](https://omnigent.ai/) 的 [cost budget](https://github.com/omnigent-ai/omnigent/tree/main/src/omnigent/policies/builtins) 採取軟硬兩段：`ask_thresholds_usd` 觸發 `ask`（讓使用者決定是否續跑），`max_cost_usd` 觸發 `deny`（直接停）。由於 Policy 看得到 session 累計花費，預算可以跨 harness 共用——同一個 session 內切換 [Claude Code](https://code.claude.com/) 與 [Codex](https://developers.openai.com/codex)，帳本是同一本。

工具次數上限（`max_tool_calls_per_session`）則用來防「迴圈爆衝」：當 agent 陷入重試迴圈或不斷列檔案時，次數上限比金額更早觸發。兩者常一起用：金額控「外部成本」，次數控「內部失控」。

| 控什麼 | 參數 | 觸發行為 | 什麼時候最有用 |
|---|---|---|---|
| 花費 | `max_cost_usd` / `ask_thresholds_usd` | `ask` → `deny` | 團隊共用額度、長時間任務 |
| 次數 | `limit`（per-session） | `deny` | 除錯迴圈、弱模型重試 |
| 範圍 | 自訂函式（路徑、網域、指令） | `allow/deny/ask` | 機密路徑、危險指令 |

## Omnibox：為何不用 Docker 就好

[Omnibox](https://omnigent.ai/docs/policies/os-sandbox) 是 Omnigent 的 OS 層沙盒，刻意選 **OS 原生效能**而非容器完整虛擬化：Linux 用 [bubblewrap (`bwrap`)](https://github.com/containers/bubblewrap)、macOS 用 [seatbelt](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/mac/sandbox.md)、Windows 目前以 [Job Object](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects) 做降級隔離。這讓每個 session 的 sandbox 啟動成本接近零，且在開發者本機就能跑，不需先建映像檔。

### 沙盒設定範例

```yaml
# omnigent.yaml — Omnibox 限制
sandbox:
  mode: omnibox  # 或 cloud（Modal/Daytona/E2B 等）
  omnibox:
    write_paths: ["./work", "/tmp"]      # 只能寫這兩個
    read_paths: ["./work", "./docs"]     # 只能讀這兩個
    allow_network: false                  # 預設斷網
    env_passthrough: ["PATH", "HOME"]    # 只透傳這兩個環境變數
    egress_rules:                         # 例外放行的外連
      - host: "api.github.com"
        methods: ["GET", "POST"]
      - host: "registry.npmjs.org"
        methods: ["GET"]
```

`egress_rules` 是關鍵：預設斷網，只對白名單中的 host/method 放行。這比「先全開再擋」更符合最小權限，且與 Policy 互補——Policy 控「能不能叫工具」，Omnibox 控「叫了之後能不能真的連出去」。

### 憑證代理：agent 拿不到明文

傳統做法把 `GITHUB_TOKEN` 丟進環境變數，agent 一 `env` 就看得到。[Omnibox](https://omnigent.ai/docs/policies/os-sandbox) 的 [credential proxy](https://omnigent.ai/docs/policies/os-sandbox#credential-proxy) 反過來：憑證留在 host，agent 只拿到一個代理位址，當工具真的要對 `api.github.com` 發請求時，egress proxy 才在出口處注入 `Authorization` 標頭。這帶來兩個好處：第一，提示詞竊取（prompt exfiltration）拿不到明文；第二，審計日誌可記錄「哪個 session 在何時對哪個 host 用了哪張憑證」。

Windows 目前的能力較弱：僅能以 Job Object 限制 process 樹與資源，無檔案與網路隔離，官方建議改用 [WSL](https://learn.microsoft.com/en-us/windows/wsl/)。這在評估跨平台團隊時要先說清楚。

## 同場對照：五套治理方案的定位

以下五套皆在 [agent-governance](https://github.com/topics/agent-governance) 等主題中可找到，但解的不是同一段：

### [FailproofAI](https://github.com/FailproofAI/failproofai) — 40 條現成 Policy 的輕量對照組

[FailproofAI](https://github.com/FailproofAI/failproofai)（約 1.5k stars）主打「開箱即用」：約 40 條內建 policy、本地 dashboard 與 observability，適合單機或小團隊快速加上護欄。相較 [Omnigent](https://omnigent.ai/) 的 Python 函式與三層堆疊，FailproofAI 的規則較宣告式、易讀，但上下文深度較淺，較難做到「看完整 session 再決定」。

### [DashClaw](https://github.com/dashclaw/dashclaw) — Approval Proxy 模型

[DashClaw](https://github.com/dashclaw/dashclaw) 把治理做成**代理層**：所有工具呼叫先經 proxy，依規則 `allow/ask/deny`，`ask` 時在 UI 彈出審批。這與 Omnigent 的 tool hooks 概念相近，差別在 DashClaw 更專注在「審批流程」本身（誰批、多久有效、批次通過），而 Omnigent 把審批只是 Policy 回傳值之一，審計與預算一併在同一引擎。

### [custodian-kernel](https://github.com/custodian-kernel/custodian-kernel) — 核心層隔離

[custodian-kernel](https://github.com/custodian-kernel/custodian-kernel) 走更底層路線：以 kernel / hypervisor 層的隔離與資源管控為主，適合需要強隔離的多租戶或高風險程式碼執行。Omnibox 仍在 OS 使用者空間（`bwrap`/`seatbelt`），custodian-kernel 則把邊界往下推到 kernel，代價是部署與維運成本更高。

### [Microsoft agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit) — 企業治理工具箱

[Microsoft agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit) 是針對企業落地的文件、評估與範本集合，涵蓋風險分類、稽核需求與合規對照。相較 Omnigent 這種「可執行的 Policy 引擎」，toolkit 更像「該怎麼定規範」的方法論，兩者可疊加：用 toolkit 定原則，用 Omnigent 執行原則。

### [herdr](https://github.com/herdrdev/herdr) — 團隊協作與群體治理

[herdr](https://github.com/herdrdev/herdr)（約 2k stars）聚焦在多 agent 的團隊協作與群體護欄，強調 session 共享與集體決策。與 Omnigent 的單 session 多 harness 治理相比，herdr 的重心更在「一群人怎麼一起管一群 agent」，Omnigent 則更在「一個 session 內怎麼跨 harness 管好一群工具」。

## 怎麼選：決策表

| 情境 | 首選 | 為什麼 | 何時疊加 Omnigent |
|---|---|---|---|
| 已用 Omnigent / 多 harness 混用、需 contextual 判斷 | [Omnigent](https://omnigent.ai/) | 三層 Policy + cost/次數 + Omnibox 憑證代理在同一路徑 | — |
| 單機快速加護欄、想要 40 條現成規則 | [FailproofAI](https://github.com/FailproofAI/failproofai) | 開箱即用、dashboard 輕 | 團隊擴大後，用 Omnigent 接管跨裝置與審計 |
| 重審批流程、需「誰批、批次批、限時批」 | [DashClaw](https://github.com/dashclaw/dashclaw) | proxy 模型把審批當一等公民 | 把 DashClaw 的審批接入 Omnigent 的 Policy `ask` |
| 多租戶 / 高風險程式碼需 kernel 級隔離 | [custodian-kernel](https://github.com/custodian-kernel/custodian-kernel) | 邊界在 kernel，隔離最深 | 上層仍用 Omnigent 做 Policy 與預算 |
| 企業要過稽核、需合規文件與風險框架 | [Microsoft agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit) | 方法論與範本齊全 | 用 Omnigent 執行 toolkit 定的原則 |
| 團隊共編、群體護欄 | [herdr](https://github.com/herdrdev/herdr) | 協作與群體治理為主 | 治理引擎改由 Omnigent 執行，herdr 專注協作面 |

實務建議：**先用 Omnigent 的 `ask_on_os_tools` + `cost_budget` + `egress_rules` 跑一週**，把「該擋什麼、該問什麼」的清單收斂後，再決定是否疊加其他工具。很多團隊發現，光這三條就能擋掉八成事故，剩下的再依上表補齊。

## 整體來說

治理的難處不在「有沒有規則」，而在「規則能否跟著 session 走、看得見上下文、且換 harness 仍有效」。[Omnigent](https://omnigent.ai/) 的答案是把治理做成 Server 層的程式：Policy 是可測試的 Python 函式，三層堆疊讓組織底線與任務彈性並存，[Omnibox](https://omnigent.ai/docs/policies/os-sandbox) 則以 OS 原生機制與憑證代理把「看得到」與「連得出去」分開控。其他方案各有所長——[FailproofAI](https://github.com/FailproofAI/failproofai) 適合輕量起步、[DashClaw](https://github.com/dashclaw/dashclaw) 專精審批、[custodian-kernel](https://github.com/custodian-kernel/custodian-kernel) 往 kernel 下探、[Microsoft toolkit](https://github.com/microsoft/agent-governance-toolkit) 補合規、[herdr](https://github.com/herdrdev/herdr) 顧協作——但若你的痛點是「多 harness、多裝置、要審計」，Omnigent 是目前最完整的單一解。

系列下一篇將回到實作面，用同一個任務（平行 worktree + cross-vendor review 的 Polly 模式）對比 Omnigent YAML、LangGraph、CrewAI 與 Goose 的寫法與維運成本。

## 參考資料

- [Omnigent — a meta-harness for building and running AI agents](https://omnigent.ai/)
- [omnigent-ai/omnigent](https://github.com/omnigent-ai/omnigent)
- [Omnigent Policies — overview & builtins](https://omnigent.ai/docs/policies/overview) / [Omnibox OS Sandbox](https://omnigent.ai/docs/policies/os-sandbox) / [Agent YAML Spec](https://github.com/omnigent-ai/omnigent/blob/main/docs/AGENT_YAML_SPEC.md)
- [Introducing Omnigent: A Meta-Harness to Combine, Control and Share Your Agents — Databricks Blog](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents)
- [FailproofAI — 40 policies + observability](https://github.com/FailproofAI/failproofai)
- [DashClaw — approval proxy for agent tool calls](https://github.com/dashclaw/dashclaw)
- [custodian-kernel — kernel-level isolation for agents](https://github.com/custodian-kernel/custodian-kernel)
- [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
- [herdrdev/herdr](https://github.com/herdrdev/herdr)
- [What Is a Meta-Harness? A 2026 Buyer's Guide — codepick.dev](https://codepick.dev/en/guides/meta-harness-2026/)
