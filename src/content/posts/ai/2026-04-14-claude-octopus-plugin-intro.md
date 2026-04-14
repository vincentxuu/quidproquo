---
title: "Claude Octopus：把 8 個模型同時掛在 Claude Code 上的共識 Plugin"
date: 2026-04-14
category: ai
tags: [claude-code, plugin, octopus, multi-model, consensus, orchestration, dark-factory]
lang: zh-TW
tldr: "Claude Octopus 是一個 Claude Code plugin，能同時叫 Codex、Gemini、Copilot、Qwen、Ollama、Perplexity、OpenRouter 和 Claude 一起看同一份 code，用 75% 共識門檻找單模型的盲點。內建 32 個 persona、48 個 /octo:* slash commands、51 個 skill、以及 Dark Factory 全自動 spec-to-code 管線。"
description: "深入介紹 Claude Code 的 claude-octopus plugin：多模型共識架構、Double Diamond 四階段流程、32 個 persona、Dark Factory 全自動模式，以及它和一般單模型工作流相比的取捨。"
draft: false
---

單一模型會有盲點，這件事所有用過 agentic coding 的人都同意。Claude Octopus 是 `nyldn` 做的 Claude Code plugin，核心想法很直接：**一次把最多 8 個模型掛在同一個任務上，彼此互審，意見不合就擋下來**。這篇整理它的架構、指令、persona 系統、以及和其他 Claude Code 增強層（例如 oh-my-claudecode）相比的差異。

## 定位：不是另一個 agent，是一層共識閘門

Octopus 在 Claude Code 裡是一個 plugin，不是 fork 也不是 wrapper。它只佔用 `/octo:*` 這個 namespace 和自然語言前綴 `octo`，其他 Claude Code 行為完全不動。這個設計很重要——你可以裝起來試，不滿意一行指令就乾淨卸載，沒有殘留設定。

它要解決的問題不是「自動寫更多 code」，而是「在 ship 之前，讓另外 7 個模型先罵一輪」。Octopus 把 **consensus gate** 當成第一原則：預設 75% 的 provider 要同意，工作才能過 gate，否則整條管線就停下來給人看。

## 八個 tentacle：多 provider 協作

預設支援的 provider 有八種，每個角色不同：

| Provider | 角色 | 認證方式 | 費用 |
|---|---|---|---|
| Claude | Orchestration、synthesis | Claude Code 內建 | 依 Claude 訂閱 |
| Codex (OpenAI) | Implementation、code pattern 深度 | `codex login` 或 `OPENAI_API_KEY` | OAuth 免費或 per-token |
| Gemini (Google) | 生態廣度、security review | Google OAuth 或 `GEMINI_API_KEY` | OAuth 免費或 per-token |
| Copilot (GitHub) | Research 零成本跑腿 | 沿用 GitHub 訂閱 | 免費 |
| Qwen (Alibaba) | Research tier | Qwen OAuth | 每日 1,000–2,000 次免費 |
| Ollama | 本地、離線、隱私敏感任務 | 本地安裝 | 免費 |
| Perplexity | Live web search、CVE 查詢 | API key | 依 API |
| OpenRouter | 100+ 模型 routing | API key | 依模型 |

重點是**零 provider 也能跑**——只有 Claude 的話 Octopus 就退化成有 persona 和 slash command 的單模型 harness。每加一個 provider 就自動偵測啟用，不用手動配 pipeline。

## Double Diamond 四階段

Octopus 把 UK Design Council 的 Double Diamond 方法論直接搬到 coding agent 上，分四個階段：

| 階段 | 指令 | 做什麼 |
|---|---|---|
| Discover | `/octo:discover` | 多 AI 研究、探索問題空間 |
| Define | `/octo:define` | 用共識釐清需求、寫 spec |
| Develop | `/octo:develop` | 開始實作、帶 quality gate |
| Deliver | `/octo:deliver` | Adversarial review + go/no-go 打分 |

你可以單獨呼叫任一階段，也可以 `/octo:embrace` 一次跑完整條管線。相較於「直接丟一句 prompt 給 Claude 寫 code」，這套流程的差別是**定義階段先讓多模型吵架**——spec 寫清楚再進到 develop，省掉 80% 的「做完才發現需求理解錯」。

## 八隻核心觸手（Primary Commands）

```bash
/octo:embrace       # 整條 lifecycle：research → define → develop → deliver
/octo:factory       # Autonomous spec-to-software（Dark Factory）
/octo:debate        # 四 AI 結構化辯論 + 共識
/octo:research      # 三 provider 多源綜合
/octo:design        # UI/UX 設計（含 BM25 retrieval）
/octo:tdd           # Red-green-refactor 紀律
/octo:security      # OWASP 漏洞掃描 + 修復
/octo:prd           # AI-optimized 產品需求文件
```

加上 `review / debug / extract / docs / schedule / parallel / sentinel / optimize / brainstorm / doctor / quick` 等延伸指令，整個 plugin 有 **48 個 slash command**。想偷懶就用 smart router：

```bash
/octo:auto <description>
```

它會解析自然語言意圖，自己選要跑哪條 workflow。

## 32 個 persona：context-aware agent

Octopus 預先定義了 32 個特化角色，根據 request 自動套用：

- **Software Engineering（11）**：backend-architect、frontend-architect、fullstack-engineer、devops-engineer、security-auditor、performance-optimizer、testing-strategist、database-specialist、api-designer、integration-engineer、systems-engineer
- **Specialized Development（6）**：mobile-engineer、ml-engineer、data-engineer、blockchain-engineer、iot-engineer、game-developer
- **Documentation / Communication（5）**：technical-writer、product-manager、business-analyst、ux-writer、content-strategist
- **Research / Strategy（3）**：researcher、strategist、analyst
- **Business / Compliance（3）**：compliance-officer、financial-analyst、legal-advisor
- **Creative / Design（4）**：ui-ux-designer、graphic-designer、creative-director、brand-strategist

一個「review 這支 API」的 request 可能同時觸發 `api-designer` + `security-auditor` + `performance-optimizer`，每個 persona 用不同 provider 回一份審查，最後在 consensus gate 收斂。

## Dark Factory：給 spec 就走到底

Dark Factory 是最激進的模式——把一份 spec 丟進去，Octopus 完全自動跑完 Discover → Define → Develop → Deliver，中間不問人：

```bash
/octo:factory "build a CLI that converts CSV to JSON"
```

有三個 autonomy level：

- **Supervised**：每個 phase 都要人工 approve
- **Semi-autonomous**：只有失敗才介入
- **Autonomous**：整條跑完才回頭看

搭配 git worktree 做 workstream isolation，可以讓多個並行任務在各自 branch 跑，最後自動 merge、處理衝突。

## Reaction Engine：自動回應 lifecycle 事件

這是我覺得最「team-aware」的設計。Reaction Engine 監聽 CI、review、PR 的狀態變化，自動回應：

| 事件 | 動作 | 最大重試 | Escalation |
|---|---|---|---|
| CI failure | 收 log 丟 agent inbox | 3 | 30 分鐘後找人 |
| Changes requested | 收 review comment 丟 inbox | 2 | 60 分鐘後找人 |
| Agent 卡住 | Escalate 給人類 | — | 15 分鐘後 |
| PR approved + CI green | 通知 ready-to-merge | — | — |

設定寫在 `.octo/reactions.conf`，可以 per-project 客製。這個機制的哲學很明確：**讓 agent 處理機械性的修復循環，只有真的卡住才打擾人**。

## 安裝

Claude Code（推薦）：

```bash
claude plugin marketplace add https://github.com/nyldn/claude-octopus.git
claude plugin install octo@nyldn-plugins

# 進 Claude Code session 後
/octo:setup
```

不乾淨的話：

```bash
claude plugin uninstall octo
# 或加上 scope
claude plugin uninstall octo --scope project
```

也支援 Codex CLI、Cursor（走 MCP server）、OpenCode。Cursor 的 `~/.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "claude-octopus": {
      "command": "npx",
      "args": ["tsx", "${userHome}/.cursor/claude-octopus/mcp-server/src/index.ts"],
      "env": {
        "OCTO_CLAW_ENABLED": "true",
        "OPENAI_API_KEY": "${env:OPENAI_API_KEY}",
        "GEMINI_API_KEY": "${env:GEMINI_API_KEY}"
      }
    }
  }
}
```

## 跟其他 Claude Code 增強層比

| 層面 | Claude Octopus | oh-my-claudecode | 純 Claude Code |
|---|---|---|---|
| 核心抽象 | Consensus gate + multi-provider | 多 Agent 協作 + magic keyword | 單 Agent CLI |
| Provider | 最多 8 個（含 Copilot、Qwen、Ollama） | Claude + Codex + Gemini | 只有 Claude |
| 主要賣點 | 共識擋盲點、Dark Factory 全自動 | 跨模型省 token、rate limit 自動恢復 | 簡單、直接 |
| Persona | 32 個 | 19 個 | 無 |
| 安裝影響 | Plugin namespace 隔離 | 增強層 | — |

簡單說：**Octopus 在意的是品質管控，OMC 在意的是協作效率，原生 Claude Code 在意的是可控性**。如果你的痛點是「模型寫出來的東西看起來都對但上線就炸」，Octopus 的共識 gate 最直接。

## 適用情境

- **Security 敏感的 PR**：`/octo:security` 讓 Gemini + Perplexity 查 CVE、security-auditor persona 跑 OWASP checklist
- **需求還沒定的新功能**：`/octo:embrace` 從 discover 開始，讓多 provider 先吵出 spec 再動手
- **大量重複性 scaffolding**：`/octo:factory` 配 semi-autonomous，交出一份 spec，回來看成果
- **多人 review 難排**：Reaction Engine + 多 provider review，等於內建一支異步 review 團隊

不適合：

- **單純 one-shot 小改**：共識開銷不划算，直接 Claude Code
- **完全 offline**：除非只用 Ollama provider，否則共識價值打折
- **預算極敏感**：八 provider 裡 Perplexity 和 OpenRouter 會算錢，Codex / Gemini 的 OAuth 額度也是有上限的

## 整體來說

Claude Octopus 把「多模型共識」從研究題目變成可以一行指令裝的 Claude Code plugin。32 persona + 48 slash command + 51 skill 規模上不算小，但 `/octo:*` 命名空間隔離讓它比想像中好裝拆。最有價值的設計不是指令數量，而是**把共識門檻（75%）和 reaction 自動化（CI/review 閉環）當成預設**——這兩點是純 Claude Code 目前沒有內建的。

想要把 Claude Code 從「單模型寫 code」升級成「多模型互審 + 有 delivery gate」，Octopus 是目前最完整的現成答案。

## 參考資料

- [nyldn/claude-octopus — GitHub Repository](https://github.com/nyldn/claude-octopus)
- [claude-octopus README](https://github.com/nyldn/claude-octopus/blob/main/README.md)
- [Plugin Architecture — docs/PLUGIN-ARCHITECTURE.md](https://github.com/nyldn/claude-octopus/blob/main/docs/PLUGIN-ARCHITECTURE.md)
- [CHANGELOG](https://github.com/nyldn/claude-octopus/blob/main/CHANGELOG.md)
- [Claude Octopus Documentation（Mintlify）](https://nyldn-claude-octopus-64.mintlify.app/)
- [Claude Plugin Hub — octo](https://www.claudepluginhub.com/plugins/nyldn-claude-octopus)
- [aitmpl.com — Claude Octopus Plugin](https://www.aitmpl.com/plugins/claude-octopus)
