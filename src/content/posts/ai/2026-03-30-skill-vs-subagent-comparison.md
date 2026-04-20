---
title: "Skill vs Subagent：Claude Code 兩種 Agent 協作模式比較"
date: 2026-03-30
category: ai
tags: [claude-code, multi-agent, subagent, skill]
lang: zh-TW
tldr: "Skill 是你手動呼叫的 prompt 模板，Subagent 是 Claude 自動 routing 的獨立 agent。看起來很像，但觸發方式、工具隔離、context 管理完全不同。"
description: "比較 Claude Code 中 Skill 與 Subagent 的設計哲學、適用情境與實作差異"
draft: false
---

用 Claude Code 做 AI 開發，遲早會碰到一個問題：一個 agent 扛不住所有事。這時候有兩條路可以走 — Skill 和 Subagent。兩者表面上很像，都是把能力拆出去，但設計哲學和適用情境完全不同。

## Skill：你自己按的按鈕

Skill 本質上是一個 **prompt template**。你定義好一段 system prompt，綁定一個 slash command，需要的時候手動呼叫。

```
/ai-expert 幫我設計一個 RAG pipeline 的 reranking 策略
```

執行時，skill 的 prompt 會展開注入到主對話裡，Claude 在同一個 context window 中回應。沒有獨立 session，沒有工具限制，沒有自動觸發。

**適合的情境：**
- 你明確知道要問什麼領域的問題
- 單一任務，不需要跟其他能力串接
- 想要快速切換 Claude 的「角色」

**不適合的情境：**
- 你丟一個大任務，希望自動拆解分工
- 需要限制工具存取（例如只能讀不能寫）
- 需要跨 session 記憶

**實際範例：**
你在開發 RAG 系統，遇到 embedding model 選型問題，打 `/ai-expert` 問一下就好。你知道這是 AI 領域的問題，你自己做了 routing。

## Subagent：Claude 自己找隊友

Subagent 是一個**獨立的 agent session**，有自己的 system prompt、工具權限、甚至可以指定用不同的 model。

定義方式是在 `.claude/agents/` 放一個 markdown 檔：

```markdown
---
name: stock-analyst
description: 股票分析專家。分析股價趨勢、財報數據、技術指標。
tools: Read, Bash, Grep
model: sonnet
memory: project
---

你是一個股票分析師。收到任務後分析技術指標，給出具體建議。
```

關鍵差異在 `description` 欄位 — Claude 會根據這段描述**自動判斷**要不要把任務 delegate 給這個 subagent。你不用手動呼叫，Claude 自己決定。

**適合的情境：**
- 複雜任務需要多種專長，你希望自動分工
- 需要工具隔離（例如 db-reader 只能跑 SELECT）
- 需要不同 model（主 agent 用 opus 思考，subagent 用 haiku 跑重複性工作）
- 需要獨立 context window，避免主對話被塞爆

**不適合的情境：**
- 簡單問答，一個 prompt 就能搞定
- 你每次都手動 `@mention` — 這樣跟 skill 沒差別

**實際範例：**
你說「幫我分析台積電最近的股價然後產生一份語音報告」。Claude 自己判斷需要 `stock-analyst` 分析數據，再把結果交給 `tts-agent` 產生語音。你只下了一個 prompt，routing 是自動的。

## 整體架構

```
┌───────────────────────────────────────┐
│              你的 prompt               │
│                  │                     │
│                  ▼                     │
│          ┌──────────────┐             │
│          │  Main Agent  │             │
│          └──────┬───────┘             │
│                 │                      │
│         ┌───────┴───────┐             │
│         ▼               ▼             │
│    ┌─────────┐    ┌─────────┐        │
│    │  Skill  │    │Subagent │        │
│    │         │    │         │        │
│    │ 你手動  │    │ 自動    │        │
│    │ 呼叫    │    │ routing │        │
│    │         │    │         │        │
│    │ 同一個  │    │ 獨立    │        │
│    │ context │    │ session │        │
│    └─────────┘    └─────────┘        │
│     手動觸發       自動觸發           │
└───────────────────────────────────────┘
```

## 整體來說

判斷該用哪個，問自己兩個問題：

| 問題 | 答案 | 用什麼 |
|------|------|--------|
| 我知道要問什麼、問誰？ | 是 | **Skill** |
| 我想讓 Claude 自己決定找誰？ | 是 | **Subagent** |

兩者不互斥。Skill 可以是 subagent 內部預載的能力。但核心取捨很簡單：如果你每次都知道該呼叫誰，用 skill 就好，簡單直接；如果你希望丟一個任務就自動拆解分工，那就定義 subagents，讓 Claude 自己 routing。大部分情境下，先從 skill 開始，等發現手動 routing 變成負擔時，再升級成 subagent。

## 參考資料

**官方文件：**
- [Claude Code — Custom Slash Commands (Skills)](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Claude Code — Sub-agents](https://docs.anthropic.com/en/docs/claude-code/sub-agents)

**站內相關文章：**
- [Claude Code Skill 完整指南：把重複的工作流程變成一句指令](/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide) — Skill 的設計哲學、檔案結構、四個實際案例
- Claude Code Sub-agents 完整指南：自訂 AI 子代理與平行執行（即將推出） — Sub-agent 的完整設定、工具控制、persistent memory
- Claude Code Agent Teams：讓多個 AI 代理組隊協作（即將推出） — Agent Teams 的多代理協作架構
- [Claude Code 的三層品質防線：Hook、Skill、指令檔](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md) — Hook、Skill、指令檔如何組合使用
- CLAUDE.md 與 AGENTS.md 完整指南（即將推出） — 寫給 AI 看的行為指引
- [Google 的八種 Multi-Agent 設計模式](/posts/ai/2026-03-28-google-multi-agent-patterns) — 八種模式的適用場景與取捨
