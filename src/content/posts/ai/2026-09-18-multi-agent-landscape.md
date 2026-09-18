---
title: "Multi-Agent 系統全景：從 CLI 到雲端，2026 年各家怎麼做多 Agent 協作"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, agent, anthropic, openai, google, antigravity, microsoft-agent-framework, langgraph, crewai, agent-cli]
lang: zh-TW
tldr: "2026 年幾乎所有主流 coding agent 都支援 subagent。設計哲學分三派：腳本確定性編排（Claude Code Workflow）、model-driven 自主（Codex、Devin）、IDE 指揮台（Windsurf 2.0、VS Code）。這篇是系列總篇，整理產品定位、能力矩陣與架構光譜。"
description: "Multi-Agent 系統實戰系列總篇。涵蓋 Claude Code、Codex、Antigravity（原 Gemini CLI）、Cursor、Windsurf、Devin、LangGraph、CrewAI 的 subagent 模型與編排方式，附能力矩陣與設計哲學光譜。"
draft: false
series:
  name: "Multi-Agent 系統實戰"
  order: 1
---

2026 年，「讓 AI agent 自己再叫一個 AI agent 幫忙」已經從實驗性功能變成標配。從 CLI 工具到 IDE、從開源框架到雲端服務，幾乎每家都有某種形式的 multi-agent 支援。

但各家的設計哲學差異很大——有的讓你用 JavaScript 腳本精確控制每一步，有的讓 LLM 自己決定要不要 spawn 子 agent。這篇是 Multi-Agent 系統實戰系列的總篇，整理各家產品的定位和能力，幫你判斷哪種模式適合你的場景。

## CLI / Terminal Agents

### Claude Code（Anthropic）

依 [Anthropic 官方文件](https://code.claude.com/docs/en/workflows)，Claude Code 的 multi-agent 體系分四層：

1. **Subagents** — Fork（繼承完整 context + 共享 prompt cache）或 Fresh（零上文獨立判斷）
2. **Skills** — 預定義 prompt 模板驅動
3. **Agent Teams** — 少量 peer session 即時對話協商
4. **Dynamic Workflows** — JS 腳本確定性編排，是目前最完整的多 agent 編排系統

Workflow 提供五個核心原語：`pipeline()`（逐 item 流水線，無 barrier）、`parallel()`（barrier 同步）、`agent({schema})`（結構化輸出）、`phase()` / `log()`（進度分組）、`budget.remaining()`（token 預算追蹤）。單次 run 最多 1,000 個 agent、16 並發，支援中斷後 resume。

Claude Code 的特色是**同時支援腳本和 model-driven 兩種模式**——Workflow 做確定性的流程，Subagent 和 Agent Teams 做自主的探索。

### Codex CLI（OpenAI）

依 [Codex 官方公告](https://openai.com/index/codex-now-generally-available/)（2026-03 GA），Codex 走 Manager / Worker 模式。Manager agent 負責決策，用六個原語控制 worker：`spawn_agent`、`send_message`、`followup_task`、`wait_agent`、`list_agents`、`close_agent`。

三個內建 agent 類型：`default`、`worker`（實作導向）、`explorer`（唯讀探索）。定義在 `.codex/agents/<name>.toml` 或 `AGENTS.md`。

[Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) 是 OpenAI 開源的獨立編排層，用 Linear 當 control plane 把 issue 映射到 Codex agent——但這是 always-on 的 issue-driven 模式，不是 session 內的 multi-agent。

### Antigravity（原 Gemini CLI，Google）

Gemini CLI 於 2026-06-18 正式退役，改名為 [Antigravity](https://github.com/google-gemini/gemini-cli/discussions/27274)，用 Go 重寫並新增多 agent 背景編排。原有的 subagent 架構延續了 Hub-and-Spoke 模式：主 agent 用 `@agent` 語法 dispatch，內建 `@generalist`、`@cli_help`、`@codebase_investigator` 三個 agent。

Antigravity 的特色是**結果壓縮後才回傳主 session**，防止子 agent 的大量輸出污染父 context。每個 subagent 獨立 context + tool set。

### Aider

目前**無 multi-agent 支援**。單 agent 順序處理，強項是極輕量、支援幾乎所有 LLM vendor。社群已提案 `/spawn` 和 `/delegate`，尚未實作。

## IDE Agents

### Cursor

依 [Cursor 3.2 更新](https://cursor.com/changelog)（2026-04），Cursor 正從「編輯器」轉向「agent 執行 runtime」：

- **Subagents**（Cursor 2.4, 2026-01）：spawn 多個獨立 context 的 Claude instance 平行跑
- **/multitask**（Cursor 3.2）：自動把大任務拆成 chunk 分配給 subagent
- **Background Agents**：跑在雲端沙盒，產出以 PR 形式 review

### Windsurf（Codeium → Devin 收購）

Windsurf 的策略是**不自己做 multi-agent 編排，而是當指揮台**：

- **Cascade**：核心 agent，持久 context-aware，拆任務成 Flows
- **Wave 13**（2025-12）：平行多 Cascade session（最多 5 個），各自 git worktree 隔離
- **Windsurf 2.0**（2026-04）：[Agent Command Center](https://devin.ai/blog/windsurf-2-0)（Kanban 式多 agent 儀表板）+ Devin 原生整合

Cascade 負責即時的本地工作（低延遲），長任務一鍵交給 Devin 的雲端 VM 跑。

### VS Code Agent Sessions（Microsoft）

VS Code 1.109（2026-02）加入 Multi-Agent Development，讓多個不同 agent 在同一 IDE 平行跑——可混搭 Copilot + Claude + Codex。這是 **IDE 層**的多 agent 框架，不是任一 agent 本身的 subagent 架構。

## Cloud / Async Agents

### GitHub Copilot Coding Agent

每個任務跑在 GitHub Actions runner 沙盒，接收 Issue → 自主工作 → 產出 PR。**無原生 subagent**，多 agent 能力來自 VS Code Agent Sessions。

### Jules（Google）

每個任務在 Google 管理的獨立雲端 VM 執行。內部四個階段：Planning（Gemini 2.5 Pro）→ Execution → [Critique](https://jules.google/docs/changelog/2025-08-083/)（2025-08 加入）→ Testing。官方描述為「內部工作流階段」，使用者不直接控制編排。

### Devin（Cognition）

[Fusion 架構](https://cognition.com/blog/devin-fusion)（2026-06）：兩個平行 agent——frontier「lead」model + 廉價「sidekick」model，各自有獨立 toolset 和 context。完整 VM 含桌面 / 瀏覽器 / computer-use。

## Multi-Agent 開發框架

### LangGraph（LangChain）

[圖狀態機](https://langchain-ai.github.io/langgraph/)：State（快照）→ Node（執行）→ Edge（流向）。四種模式：subagents（supervisor 委派）、handoffs（交接）、routers（路由分流）、custom workflows。依 [LangChain 官方 benchmark](https://www.langchain.com/blog/benchmarking-multi-agent-architectures)，可混搭 model tier 降低成本。

### CrewAI

[角色扮演框架](https://docs.crewai.com/)：每個 Agent 有 role、goal、backstory。兩種 process：sequential / hierarchical（manager 自動委派）。2026 年社群成長最快。

### Microsoft Agent Framework（MAF）

2026-04 GA，合併 AutoGen + Semantic Kernel。AutoGen 進入[維護模式](https://github.com/microsoft/autogen/discussions/7066)。支援 sequential / concurrent / handoff / group chat / Magentic-One 編排模式，Graph-based workflow 做顯式多 agent 編排。

原 AutoGen 的社群 fork [AG2](https://github.com/ag2ai/ag2) 仍在獨立發展，保留 0.2 API。

## 能力矩陣

| 能力 | Claude Code | Codex | Cursor | Windsurf | Antigravity | Copilot | Jules | Devin |
|---|---|---|---|---|---|---|---|---|
| Subagent | Fork + Fresh | 6 原語 | /multitask | 多 Cascade | @agent | — | 內部 4 階段 | Fusion |
| 腳本化編排 | JS Workflow | — | — | — | — | — | — | — |
| Model-driven | Agent Teams | Manager/Worker | Parent/Child | Cascade Flows | Hub-and-Spoke | — | 內部 | Orchestrator |
| Context 繼承 | Fork 繼承 | 各自獨立 | 各自獨立 | Cascade 持久 | 壓縮回傳 | — | — | 各自獨立 |
| 結構化輸出 | `agent({schema})` | — | — | — | — | — | — | — |
| Budget 追蹤 | `budget.remaining()` | — | — | — | — | — | — | — |
| 雲端 agent | remote | 沙盒容器 | Background | Devin VM | — | Actions runner | Google VM | 完整 VM |

## 設計哲學光譜

由誰控制編排？從左（確定性腳本）到右（model 完全自主）：

```
確定性腳本 ◄─────────────────────────────────────► Model-driven 自主

LangGraph    Claude Code    CrewAI    Cursor    Codex    Devin    AutoGen
  圖狀態機    Workflow       角色+委派  /multitask  Manager   Fusion   GroupChat
             JS 腳本                            /Worker   lead     自由對話
                                                         /sidekick
```

**腳本派**把編排當基礎設施——流程確定、可 resume、可追蹤 budget。適合需要可重複、可審計的工作流。

**Model-driven 派**讓 LLM 自主決定 spawn 和彙總。彈性高但不可預測，適合探索性任務。

**混合派**（Windsurf 2.0、VS Code）不自己做編排，當「指揮台」整合多家 agent。

另一個趨勢是 **internal multi-agent**——Jules 的 4 階段流水線、Devin 的 lead/sidekick，使用者看到單一 agent 介面，內部由多個專責 agent 協作。

## 系列導讀

這是 Multi-Agent 系統實戰系列的第一篇。後續各篇深入單一主題：

- **成本控制**：並行 spawn + 巢狀深度如何燒錢，七家框架的防護機制，「先軟著陸再硬擋」的業界共識
- **編排模式**：腳本 vs model-driven vs 混合，怎麼選
- **Context 隔離與共享**：fork vs fresh、歷史截斷、結果壓縮
- **Agent 間通訊**：mailbox、handoff、delegate、A2A/MCP 協定
- **可觀測性**：多 agent 系統怎麼 debug、怎麼知道錢花在哪
- **安全與護欄**：防 prompt injection 跨 agent 傳播、權限隔離

## 參考資料

- [Anthropic — Claude Code Workflows 官方文件](https://code.claude.com/docs/en/workflows)
- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/agents)
- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic — Patterns and problems in multiagent systems](https://www.anthropic.com/research/multiagent-systems)
- [Anthropic — Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [OpenAI — Codex GA 官方公告](https://openai.com/index/codex-now-generally-available/)
- [OpenAI — Symphony 開源編排層](https://openai.com/index/open-source-codex-orchestration-symphony/)
- [OpenAI — Agents SDK orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration)
- [Antigravity（原 Gemini CLI）— 退役與遷移公告](https://github.com/google-gemini/gemini-cli/discussions/27274)
- [Antigravity — Subagents 文件](https://github.com/google-gemini/gemini-cli/blob/main/docs/core/subagents.md)
- [Google — Jules Critique 階段更新](https://jules.google/docs/changelog/2025-08-083/)
- [Cognition — Devin Fusion 架構](https://cognition.com/blog/devin-fusion)
- [Cursor — Changelog](https://cursor.com/changelog)
- [Windsurf — Agent Command Center (2.0)](https://devin.ai/blog/windsurf-2-0)
- [Microsoft Agent Framework](https://github.com/microsoft/agents)
- [Microsoft — AutoGen 進入維護模式](https://github.com/microsoft/autogen/discussions/7066)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangChain — Benchmarking Multi-Agent Architectures](https://www.langchain.com/blog/benchmarking-multi-agent-architectures)
- [CrewAI Documentation](https://docs.crewai.com/)
- [AG2 — Community fork of AutoGen](https://github.com/ag2ai/ag2)
- [Google Research — Towards a Science of Scaling Agent Systems (arXiv 2512.08296)](https://arxiv.org/abs/2512.08296)
- [VILA-Lab — Dive into Claude Code (arXiv 2604.14228)](https://arxiv.org/abs/2604.14228)
