---
title: "多個 Agent 怎麼一起管：Omnigent 的 meta-harness、Policy 與跨裝置 Session"
date: 2026-08-26
category: ai
type: deep-dive
tags: [omnigent, ai-agent, multi-agent, claude-code, mcp, sandbox]
lang: zh-TW
tldr: "Databricks 開源的 Omnigent 把 Claude Code、Codex、Cursor、Pi 等 harness 包在 Runner/Server 與 Omnibox 沙盒之上，用三層 Policy 與可分享的持久化 Session 讓模型與 harness 一鍵替換，9.3k stars 的 alpha 專案。"
description: "Databricks 於 2026-06-13 開源的 Omnigent meta-harness 深導讀：為何需要 harness 之上的治理層、Runner/Server/Omnibox 架構、YAML 自定義 agent 與 Polly/Debby 範例、contextual Policy、沙盒與 GitHub 同層專案對照。"
series:
  name: "Meta-Harness 與 Agent 治理"
  order: 1
glossary:
  - term: "meta-harness"
    aliases: ["meta harness"]
    definition: "位於單一 agent harness 之上的共通治理層，統一多個 harness 的接入、排程、權限與協作。"
    definition_en: "A control plane above individual agent harnesses that unifies access, scheduling, permissions and collaboration across multiple harnesses."
    advanced: "Omnigent 的 meta-harness 以 Runner/Server 分離與共通 API 讓 Claude Code、Codex、Pi 等可在同一 session 中替換與協作。"
    advanced_en: "Omnigent's meta-harness uses a Runner/Server split and a common API to let Claude Code, Codex, Pi, etc. be swapped and composed in the same session."
    context: "本文以 Omnigent 作為 meta-harness 的參考實作，對照 ACP、HarnessAgent 等協議/SDK 層。"
    context_en: "This post uses Omnigent as the reference implementation of a meta-harness, contrasted with protocol/SDK layers like ACP and HarnessAgent."
    links:
      - label: "Omnigent 官網"
        url: "https://omnigent.ai/"
      - label: "Databricks Blog: Introducing Omnigent"
        url: "https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents"
  - term: "Omnibox"
    definition: "Omnigent 的 OS 層沙盒，以 Linux bwrap、macOS seatbelt 與 Windows Job Object 提供檔案與網路隔離，並透過 egress proxy 代理憑證。"
    definition_en: "Omnigent's OS-level sandbox using Linux bwrap, macOS seatbelt and Windows Job Objects for filesystem/network isolation with egress-proxy credential brokering."
    links:
      - label: "Omnibox 文件"
        url: "https://omnigent.ai/docs/policies/os-sandbox"
---

> 🌏 [English version](/posts/ai/2026-08-26-omnigent-meta-harness-en)

同時開 4、5 個 agent 是常態：[Claude Code](https://code.claude.com/) 改程式、[Codex](https://developers.openai.com/codex) 跑測試、[Cursor](https://cursor.com/) 在編輯器裡補完，還有一個自己寫的資料分析 agent。痛點不在模型夠不夠聰明，而是每個 harness 都是孤島——自己的 session、自己的權限、自己的歷史，換一個工具就要重講上下文、重設護欄、再複製貼上一次。

[Omnigent](https://github.com/omnigent-ai/omnigent)（[omnigent.ai](https://omnigent.ai/)）是 Databricks 在 2026-06-13 [Data + AI Summit 同步開源](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents) 的 **meta-harness**，Apache 2.0，截至 2026-08-26 約 9.3k stars / 1.4k forks / 2,838 commits，版本 `0.11.0.dev0` 仍標 alpha。它不取代你已在用的 harness，而是蓋在它們之上，讓 session、policy 與 skill 跟著你走，[Claude Code](https://code.claude.com/)、[Codex](https://developers.openai.com/codex)、[Cursor](https://cursor.com/)、[OpenCode](https://opencode.ai/)、[Hermes](https://github.com/NousResearch/hermes-agent)、[Pi](https://github.com/badlogic/pi-mono) 與你自己用 YAML 定義的 agent 可以一鍵替換、共處同一個可分享的 session。

這篇把它的設計邏輯、架構、實際怎麼用、以及在 GitHub 上有哪些同層專案一次整理。

## Omnigent 在解什麼：harness 碎片化

Databricks 的說法很直接：

> 每個 harness 都是自己的 silo，有自己的 context、自己的 controls、自己的 way of running，none of it carries over when you switch tools.

實務上就是三個跨 harness 問題：

1. **可攜（Composition）**：想讓同一個 agent 定義今天跑 Claude、明天跑 Codex，或把兩個不同 harness 的 sub-agent 混在同一任務裡，不想重寫。
2. **治理（Control）**：想在 prompt 之外、用可審計的方式控管「能不能 `git push`」「花多少錢要停」「能不能讀那份機密文件」。
3. **協作（Collaboration）**：想把「活的 agent session」用連結分享給同事，讓對方即時看、留言、甚至接管執行。

這三件事在單一 harness 內都做不到，才需要往上提一層。Omnigent 的類比是 Kubernetes 之於 containers：把「一群 agent 怎麼管」從模型層往上抽。

## 整體架構：Runner 包執行，Server 管治理

```
[你] ── terminal / browser / phone / 桌面 app / REST API
          │
     ┌────▼────┐
     │ Server  │  持久化 session 歷史（Postgres/SQLite）、MCP proxy、
     │         │  Policy 執行、Auth/OIDC、技能與 agent 註冊、WebSocket 同步
     └────┬────┘
          │ WebSocket
     ┌────▼────┐
     │ Runner  │  實際跑 harness 與工具（bwrap/seatbelt 沙盒內）、
     │ (host)  │  inference 與憑證留在 host
     └─────────┘
  筆電 / devbox / K8s Pod / Modal / Daytona / E2B / Blaxel / Databricks sandbox
```

關鍵決定是 **Runner / Server 分離，而非把大腦與手分離**。Server 只做協調，Runner 在你指定的 host 上跑 harness 與 shell，模型推論與 API key 不上 Server。這帶來兩個直接好處：

- **Session 可接續與可分享**：關掉筆電，session 仍在 Server；用手機打開同一個 `http://your-host` 就能繼續看同一個 chat、sub-agent、terminal 與檔案。
- **多 surface 同步**：terminal、web、桌面 app 看的是同一個 session，訊息與檔案即時同步，評論可直接回到 agent。

共通 API 的抽象也很克制：對外就是 `messages/files in → text streams/tool calls out + cancel`，底層同時包「terminal 型 harness」（Claude Code、Codex、Pi 等）與「SDK 型 harness」（Claude Agent SDK、OpenAI Agents SDK 等）。新增 harness 走 plugin 形式，Atlassian 的 Robo harness 就是外部擴充案例。

## 怎麼用：一個 YAML 就是一個 agent

最精簡的自定義 agent 長這樣（[Agent YAML spec](https://github.com/omnigent-ai/omnigent/blob/main/docs/AGENT_YAML_SPEC.md)）：

```yaml
name: my_agent
prompt: You are a helpful data analyst.

executor:
  harness: claude-sdk   # 一行切換：claude-native / codex / cursor-native / hermes / pi / opencode / openai-agents ...

tools:
  word_count:
    type: function
    callable: mypackage.mymodule.word_count

  docs:
    type: mcp
    url: https://example.com/mcp

  researcher:
    type: agent
    prompt: Search for relevant information and summarize it.
    tools:
      word_count: inherit
```

三個重點：

- **`tools` 三類**：`function`（本地 Python 函式，schema 自動產生）、`mcp`（MCP server）、`agent`（把另一個完整 agent 當工具，含不同 harness 也能混用）。
- **一行切 harness**：`executor.harness` 或 `omnigent run path/to/agent.yaml --harness <harness>`，sub-agent 也能各自指定。
- **啟動方式**：本地 `omnigent claude` / `omnigent codex` / `omnigent run examples/polly/`，或 `omnigent start` 後在瀏覽器 `http://localhost:6767` 選 host 開新 chat。

### 官方三個範例，最適合抄的是第三個

- **🐙 Polly**：多 agent coding orchestrator，自己不寫程式，只做規劃、把工作分給 Claude Code/Codex/Pi 的 sub-agent（平行 git worktree），再把 diff 路由給不同 vendor 的 reviewer，最後由你 merge。
- **🟠🔵 Debby**：雙頭辯論，同一個問題同時送 Claude 與 GPT，並排呈現，`/debate` 讓兩邊互評幾輪再收斂。
- **🔎 Deep Research**：單 agent + 一個 MCP 搜尋 server，規劃子查詢、抓全文、跨來源驗證後產生帶引用的報告。**結構最簡單，適合當模板抄。**

### 模型與 host 的選擇

```bash
omnigent setup
```

四種憑證皆為一等公民：API key、Claude Pro/Max 或 ChatGPT 的 subscription（透過官方 CLI 登入）、Gateway（[OpenRouter](https://openrouter.ai/)、LiteLLM、Ollama、vLLM、Azure）、Databricks workspace（需 `databricks` extra）。每種 harness 有各自的預設，可在 session 中 `/model` 即時切。

部署則有兩路：自架 `docker compose up` 或一鍵上 Render/Railway/Fly.io/Hugging Face Spaces/Modal/Cloudflare/Databricks Apps；也可用 Cloudflare Tunnel / Tailscale 把筆電直接暴露成 host。Server 還能每 session 派一個雲端 sandbox（managed hosts），筆電不用常駐。

## 治理才是分水嶺：Policy 與 Omnibox

Omnigent 把治理從 prompt 裡抽出來，放在 Server 層用 **tool hooks 攔截**。Policy 是 Python 函式，看到的是整個 session（已讀過什麼、現在想做什麼），回傳 `allow` / `deny` / `ask`。

```yaml
policies:
  approve_shell:
    type: function
    handler: omnigent.policies.builtins.safety.ask_on_os_tools
  cap_calls:
    type: function
    handler: omnigent.policies.builtins.safety.max_tool_calls_per_session
    factory_params: { limit: 50 }
  budget:
    type: function
    handler: omnigent.policies.builtins.cost.cost_budget
    factory_params: { max_cost_usd: 5.00, ask_thresholds_usd: [3.00] }
```

三層堆疊為 `server-wide（admin）` / `per-agent（開發者）` / `per-session（使用者）`，較嚴格者優先。成本控管（soft 提醒 + hard 上限）、工具次數上限、是否強制 sandbox 都走同一條路徑。實務上可在 web UI 的 session 資訊面板開關，或直接在 chat 裡說「幫我加一個 shell 前要我同意的 policy」。

沙盒是雙層的：

- **Omnibox OS 層**：Linux 用 `bubblewrap`（`bwrap`）、macOS 用 `seatbelt`，可限制 `write_paths`/`read_paths`、`allow_network`、`env_passthrough` 與 HTTP `egress_rules`，並支援 **credential proxy**——把 GitHub token 等憑證藏起來，只在 egress proxy 上對允許的請求注入，agent 本身拿不到明文。
- **雲端沙盒層**：Modal、Daytona、Blaxel、Islo、E2B、CoreWeave、Kubernetes、OpenShell、Boxlite、Databricks 等，每 session 一個隔離環境，關機後仍可續跑。

Windows 目前為降級模式：以 Job Object 做 process 樹隔離與資源限制，沒有檔案與網路隔離，官方建議改用 WSL。

## Harness 群像：Omnigent 治理的是誰

Omnigent 治理的對象是**單一 harness**，常見的如下（各取一代表，避免單挑某一個造成誤讀）：

- [Block/Goose](https://github.com/aaif-goose/goose)（51k，Rust，AAIF 託管）— 最中立，40+ providers，不綁模型廠，適合講「為何需要中立治理」。
- [OpenCode](https://opencode.ai/) — Omnigent 原生支援 `opencode`，輕量 BYOK，適合講「一鍵替換」。
- [Pi (badlogic/pi-mono)](https://github.com/badlogic/pi-mono) — 極小 harness，也是 Cloudflare Flue 的底座，適合講「小 harness 如何被放大」。
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`，2026-08-25 preview，MIT，165k）— `Everything is a Plugin`（[Cordis](https://github.com/cordiverse/cordis)），連 UI 都是 plugin，適合講「單一 harness 的極致可塑性」。

它們都與 [Claude Code](https://code.claude.com/) / [Codex](https://developers.openai.com/codex) 同級（模型 + harness = agent），而 Omnigent 是**之上**的 meta-harness。實務上這些 harness 的模型皆可透過 Omnigent 的 Gateway 使用，本身也可被包成 `harness: goose/openCode/pi/deepseek` 來調度。

## 跟 ADE（Agentic Development Environment）的差別：控制面 vs 工作台

ADE 現在已是類別名，不只一個產品。最具代表性的是 [arul28/ADE](https://github.com/arul28/ADE)（`Your workspace for every AI coding agent — macOS, Windows, iOS, and CLI all synced`），同家族還有 Kadro ADE、Orca、[per-simmons/damon-ade](https://github.com/per-simmons/damon-ade)、DCENT_ADE 等。

一句話定位：**Omnigent = 控制面（control plane）**，`Runner + Server + Omnibox + Policy` 把多個 harness 變成可替換、可治理、可審計的服務；**ADE = 工作台（workspace）**，`Brain + Desktop/Web/Mobile + Lane/worktree + PR` 把多個 agent 變成可並行、可看見、可合併的開發環境。

| 維度 | Omnigent | ADE（以 arul28/ADE 為例） |
|---|---|---|
| 架構 | Server（持久 session/Policy/MCP proxy/DB）+ Runner（在筆電/K8s/Modal 等 host 上真跑 harness） | Brain（常駐 daemon 擁有 project catalog + sync websocket）+ 4 個 UI（Desktop/Electron、Web、Terminal `ade code`、iOS） |
| 同步 | Server 經 WebSocket 同步 terminal/browser/手機/REST API | Brain 經 LAN → Tailscale → relay 三級同步，帳號僅用於發現，無帳號也能 LAN/SSH 配對 |
| 平行單位 | Session + git worktree（Polly 扇出給不同 harness 的 sub-agent） | Lane（ADE 對 git worktree 的命名），每任務一 lane、一分支、一隔離 copy，PR 直接在 ADE 內審 |
| 治理 | 重點在 **contextual Policy**（Python 函式看完整 session 回 `allow/deny/ask`）、三層堆疊、cost budget、credential proxy、Omnibox `bwrap/seatbelt` | 輕：lane 隔離 + approval gate，無 Policy engine / spend kernel / 憑證代理 |
| 自定義 | 一個 YAML 就是一個 agent，`tools: function/mcp/agent` 可跨 harness 混用 | 以 repo 為單位的 workspace 設定，靠 Brain + `.ade/` 狀態 |
| 模型/host | 4 類憑證 + 10 種雲 sandbox 可每 session 派一個 | 內建 Claude Code/Codex/Cursor/Factory Droid/OpenCode，model bar 一鍵切，host 就是裝 Brain 的機器 |
| 部署 | `docker compose` / Fly/Railway/Modal/Cloudflare/Databricks Apps 皆可自架 | `curl -fsSL https://ade-app.dev/install.sh | sh` 裝 Brain，或 dmg/exe 裝桌面版；Linux 僅 Brain |

實務上兩者可疊加：用 Omnigent 的 Runner 跑在 ADE 的 Brain 機器上，或把 ADE 當成 Omnigent 的其中一個 host UI。

## GitHub 同層專案速覽：掃描三個 Topics 的結果

這次依你的要求再掃了 [agent-orchestration](https://github.com/topics/agent-orchestration)（2,895 repos）、[agent-governance](https://github.com/topics/agent-governance)（677 repos）、[agent-framework](https://github.com/topics/agent-framework)（2,408 repos），與先前的 `agent-harness` 交叉比對。真正與 Omnigent 同屬「控制面 / 治理層」且值得對照的如下，依相關性而非單純星星排序：

### 控制面 / 治理層（直接可比）

| 專案 | 一句話 | 跟 Omnigent 的對位 |
|---|---|---|
| [huangruiteng/loopx](https://github.com/huangruiteng/loopx) (5.1k) | Long-horizon control plane，專為 Codex/Claude Code 的長程可控執行設計 | 最接近 Omnigent 的「長程治理」切片，更偏 loop-engineering |
| [zhnt/loushang](https://github.com/zhnt/loushang) (1.2k) | Python 的多模型 harness（GPT/Claude/DeepSeek/Qwen/Kimi/GLM/MiniMax），有狀態 session + tool governance | 模型廣度優於 Omnigent，但無多 harness 替換與跨裝置協作 |
| [holaboss-ai/holaOS](https://github.com/holaboss-ai/holaOS) (10.8k) | Agentic workspace，100+ 整合 + MCP + 共享 memory | 產品化 workspace，Omnigent 更純粹在 CLI/Server 層 |
| [first-fluke/oh-my-agent](https://github.com/first-fluke/oh-my-agent) (1.2k) | 事後驗證派，用 artifacts / stop-hook / independent judge 跨 10+ runtimes 驗結果 | Omnigent 控「執行前」，它控「執行後」 |
| [FailproofAI/failproofai](https://github.com/FailproofAI/failproofai) (1.5k) | 40 條內建 policy + observability，本地 dashboard | 輕量 policy 對照組 |
| [ruvnet/ruflo](https://github.com/ruvnet/ruflo) (68k) | Agent meta-harness for Claude Code/Codex，plugins + swarm + memory + federation | **harness 放大器** vs Omnigent 的 **harness 治理器** |
| [Zed ACP](https://agentclientprotocol.com/) / [Vercel HarnessAgent](https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer) / [Cloudflare Flue](https://blog.cloudflare.com/agents-platform-flue-sdk/) | 協議 / SDK / 雲端 runtime 三個互補層 | 分別解「接入」「在 code 裡切」「大併發持久執行」 |

另外三個同名 `metaharness`（[ruvnet/metaharness](https://github.com/ruvnet/metaharness)、[stanford-iris-lab/meta-harness](https://github.com/stanford-iris-lab/meta-harness)、[SuperagenticAI/metaharness](https://github.com/SuperagenticAI/metaharness)）指的是「用外層迴圈去優化 harness 程式碼」（論文 [arXiv:2603.28052](https://arxiv.org/abs/2603.28052)），與 Omnigent 的控制面同名不同義。

## 什麼時候適合用 Omnigent

**適合：**

- 團隊已同時用多種 harness/模型，想一行切換且不改 agent 邏輯。
- 需要把「活的 session」分享給同事，支援留言、共駕（`omnigent attach <session_id>`）、或 fork（`omnigent run --fork <session_id>`）後各自再跑。
- 想讓 agent 在雲端 sandbox 續跑，關掉筆電也能用手機追進度。
- 需要可審計的成本與安全護欄，且不信任 prompt 層面的 allowlist。

**不適合：**

- 個人單機、單一 harness 已足夠 — 原生 harness 更輕，Omnigent 多一個 server 與 `tmux`/`bwrap` 依賴。
- Windows 原生且強依賴檔案/網路隔離 — 目前為降級模式。
- 對 alpha 成熟度敏感 — `0.11.0.dev0` 的 API 仍在變動，升級走 `omni upgrade`。

## 整體來說

Omnigent 把「agent 的可攜性」從模型層往上提了一層，用一個可自架的 Server 換來跨 harness 複用、狀態化治理與即時協作。代價是多一個需要部署與維運的組件，以及對上游 harness 變動的跟隨成本。若你的痛點是「工具多、協作難、治理落在 prompt 裡」，它是目前最完整的開源解；若你只用單一 harness 且單機作業，它的價值就顯得間接。

下一步可接續的題目：用 loopx / loushang / holaOS 與 Omnigent 做同任務的實測對比（token / latency / 治理粒度），或深入 Omnibox 的 egress 策略與 secretless 憑證在企業環境的落地。

## 參考資料

- [Omnigent — a meta-harness for building and running AI agents](https://omnigent.ai/)
- [omnigent-ai/omnigent](https://github.com/omnigent-ai/omnigent)
- [Introducing Omnigent: A Meta-Harness to Combine, Control and Share Your Agents — Databricks Blog](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents)
- [Omnibox (OS Sandbox)](https://omnigent.ai/docs/policies/os-sandbox) / [Shared Server](https://omnigent.ai/docs/deploy/overview) / [Agent YAML Spec](https://github.com/omnigent-ai/omnigent/blob/main/docs/AGENT_YAML_SPEC.md)
- [What Is a Meta-Harness? A 2026 Buyer's Guide — codepick.dev](https://codepick.dev/en/guides/meta-harness-2026/)
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) / [DeepSeek Harness 官網](https://deepseek.com/harness/en/) / [Block/Goose](https://github.com/aaif-goose/goose) / [OpenCode](https://opencode.ai/) / [Pi](https://github.com/badlogic/pi-mono)
- [huangruiteng/loopx](https://github.com/huangruiteng/loopx) / [zhnt/loushang](https://github.com/zhnt/loushang) / [holaboss-ai/holaOS](https://github.com/holaboss-ai/holaOS)
- [FailproofAI/failproofai](https://github.com/FailproofAI/failproofai) / [first-fluke/oh-my-agent](https://github.com/first-fluke/oh-my-agent)
- [herdrdev/herdr](https://github.com/herdrdev/herdr) / [superset-sh/superset](https://github.com/superset-sh/superset) / [builderz-labs/mission-control](https://github.com/builderz-labs/mission-control) / [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
- [arul28/ADE](https://github.com/arul28/ADE) / [ade-app.dev](https://www.ade-app.dev/docs)
- [Meta-Harness: End-to-End Optimization of Model Harnesses — arXiv:2603.28052](https://arxiv.org/abs/2603.28052)
