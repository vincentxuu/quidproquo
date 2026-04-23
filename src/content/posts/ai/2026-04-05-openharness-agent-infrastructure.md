---
title: "OpenHarness：把 Agent Harness 完整開源的框架"
date: 2026-04-05
type: project
category: ai
tags: [agent-harness, open-source, multi-agent, tool-use, mcp]
lang: zh-TW
tldr: "香港大學 HKUDS 開源的 Agent Harness 框架，實作了工具呼叫、技能載入、記憶、權限、多代理協作等完整基礎設施，支援 Anthropic / OpenAI / GitHub Copilot 三種 API 格式。"
description: "OpenHarness 是完整的 Agent Harness 開源實作，涵蓋 Agent Loop、43+ 工具、技能系統、持久記憶、多代理協作與安全治理，適合研究者理解生產級 Agent 的運作方式。"
draft: false
---

最近在研究 Agent 基礎設施的時候看到 HKUDS（香港大學數據科學實驗室）開源了 OpenHarness，把一個完整的 Agent Harness 攤開來讓你看。如果你想理解「LLM 怎麼變成一個能用工具、有記憶、可協作的 Agent」，這個專案的結構值得花時間讀。

## 什麼是 Agent Harness

Harness 是包在 LLM 外面的基礎設施層。模型提供智能，Harness 提供操作能力——工具、記憶、觀察、行動、權限。用 OpenHarness 自己的說法：

> Harness = Tools + Knowledge + Observation + Action + Permissions

這跟你手動在 LLM API 外面包一層 function calling + context management 是同一件事，只是 OpenHarness 把它系統化了，拆成 10 個子系統。

## Agent Loop 引擎

核心是一個串流式工具呼叫循環：

```
query → stream → tool-call → execute → loop
```

具體流程：

```python
while True:
    response = await api.stream(messages, tools)

    if response.stop_reason != "tool_use":
        break  # 模型判斷任務完成

    for tool_call in response.tool_uses:
        # 權限檢查 → Hook → 執行 → Hook → 結果
        result = await harness.execute_tool(tool_call)

    messages.append(tool_results)
    # 模型看到結果，決定下一步
```

這個 loop 支援 API 重試（指數退避）、並行工具執行、token 計數與成本追蹤。不是什麼新概念，但 OpenHarness 把每一層都實作出來了，包括 streaming 處理和錯誤恢復。

## 工具生態系（43+ 工具）

工具是 Agent 的手腳。OpenHarness 內建 43 個以上，分成幾大類：

| 類別 | 工具 | 用途 |
|------|------|------|
| 檔案 I/O | Bash, Read, Write, Edit, Glob, Grep | 核心檔案操作，帶權限檢查 |
| 搜尋 | WebFetch, WebSearch, ToolSearch | 網路與程式碼搜尋 |
| Notebook | NotebookEdit | Jupyter cell 編輯 |
| 代理 | Agent, SendMessage, TeamCreate | 子代理生成與協調 |
| 任務 | TaskCreate/Get/List/Update/Stop | 背景任務管理 |
| MCP | MCPTool, ListMcpResources | Model Context Protocol 整合 |
| 排程 | CronCreate/List/Delete | 定時與遠端執行 |

每個工具用 Pydantic 做輸入驗證，自帶 JSON Schema 描述，並整合權限系統和 Hook 生命週期。

## 技能系統（Skills）

技能是按需載入的 Markdown 檔案，讓 Agent 在需要時取得特定領域知識。內建技能涵蓋 commit 撰寫、程式碼審查、除錯、規劃、測試、簡化等。

跟把所有 prompt 塞進 system message 不同，Skills 是動態載入的——Agent 判斷需要某個技能時才注入 context，避免浪費 token。這個設計在 context window 有限的情況下很實際。

## 安全與治理

Agent 能執行 shell 指令、讀寫檔案，安全控制不能少。OpenHarness 的做法是多層防護：

- **多級權限模式**：控制工具的存取粒度
- **路徑與指令規則**：白名單/黑名單式的存取控制
- **PreToolUse / PostToolUse Hooks**：工具執行前後的攔截點，可以加自訂邏輯
- **互動式核准對話**：高風險操作需要使用者確認

這不是形式上的權限系統，而是每次工具呼叫都會經過的 pipeline。

## 持久記憶

Agent 最常被詬病的問題之一是「沒有記憶」。OpenHarness 用三層架構處理：

1. **CLAUDE.md 發現與注入**：自動偵測專案層級的指令檔並注入 context
2. **Context 壓縮（Auto-Compact）**：接近 context 上限時自動壓縮歷史訊息，保留語意
3. **MEMORY.md 持久儲存**：跨 session 的知識保存
4. **Session Resume**：恢復先前的對話狀態

這讓 Agent 不只是 stateless 的工具呼叫器，而是能在多個 session 之間累積知識。

## 多代理協作

OpenHarness 支援子代理生成與團隊協作：

- **Subagent Spawning**：動態建立子代理，委派子任務
- **Team Registry**：集中管理多個代理
- **背景任務生命週期**：追蹤任務狀態
- **ClawTeam 整合**（規劃中）

這對需要拆解複雜任務的場景有用——主代理負責規劃，子代理各自執行，結果回傳匯整。

## 支援的模型供應商

OpenHarness 不綁定單一模型，支援三種 API 格式：

**Anthropic 格式（預設）**
- Anthropic Claude 系列
- Moonshot / Kimi（`kimi-k2.5`）
- Vertex AI、Amazon Bedrock

**OpenAI 格式**
- OpenAI（GPT-4o）
- DashScope（Qwen、DeepSeek）
- DeepSeek API
- GitHub Models、SiliconFlow、Groq
- Ollama（本地部署）

**GitHub Copilot 格式**
- 透過 OAuth 裝置流程認證，不需要額外 API Key

切換供應商只要改環境變數：

```bash
# 用 Kimi
export ANTHROPIC_BASE_URL=https://api.moonshot.cn/anthropic
export ANTHROPIC_API_KEY=your_key
export ANTHROPIC_MODEL=kimi-k2.5
oh
```

## 整體架構

```
┌─────────────────────────────────────────────┐
│                  Agent Loop                  │
│         query → stream → tool → loop         │
├──────────┬──────────┬──────────┬────────────┤
│  Tools   │  Skills  │  Memory  │ Permissions │
│  43+     │  .md     │  3-layer │  multi-level│
├──────────┴──────────┴──────────┴────────────┤
│  Hooks │ Commands(54) │ MCP Client │ Plugins │
├─────────────────────────────────────────────┤
│            Multi-Agent Coordinator           │
│     subagent spawning / team registry        │
├─────────────────────────────────────────────┤
│  Anthropic API │ OpenAI API │ Copilot OAuth  │
└─────────────────────────────────────────────┘
```

## 整體來說

OpenHarness 的價值不在於它發明了什麼新東西，而是把一個生產級 Agent Harness 的完整實作開源出來。Agent Loop、工具系統、技能載入、記憶管理、權限控制、多代理協作——這些在各家商業產品裡都有，但很少有專案把每一層都攤開讓你看。

適合兩種人：想理解 Agent 內部運作的研究者，以及想在已驗證的架構上建構自己 Agent 的開發者。不適合只是想快速串一個 chatbot 的場景——這個框架的複雜度對簡單應用來說太重了。

技術要求是 Python 3.10+ 和 Node.js 18+，MIT 授權。

## 參考資料

- [OpenHarness GitHub — HKUDS Agent Harness 完整開源框架](https://github.com/HKUDS/OpenHarness)
- [HKUDS - 香港大學數據科學實驗室](https://github.com/HKUDS)
- [Model Context Protocol (MCP) — Agent 工具整合標準](https://modelcontextprotocol.io/)
- [Anthropic Claude API — OpenHarness 支援的多代理協作模型](https://docs.anthropic.com/en/api/getting-started)
