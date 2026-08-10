---
title: "協定層：MCP、A2A、ACP、Skills 各解什麼問題"
date: 2026-08-10
category: ai
type: deep-dive
tags: [mcp, agent-skills, ai-agent, tool-use, llm]
lang: zh-TW
series:
  name: "Agent 生產線"
  order: 7
tldr: "MCP 管 agent ↔ 工具，A2A 管 agent ↔ agent，Skills 管可重複使用的知識。判準是資料會不會變：呼叫之間會變就要 MCP，穩定到可以寫下來就用 skill 檔案——後者不需要一個會獨立失敗的 runtime。"
description: "從 function calling 到 MCP 的完整演進與代價、MCP 的五個 primitives（含方向反轉的 Sampling）、A2A 與 ACP 的定位，以及 MCP 與 Agent Skills 的五維度比較與選用判準。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en)

[第一篇](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)把 MCP 定位成「LLM 怎麼用工具的標準介面」，但沒展開。這一篇處理協定層——包括它解決了什麼、代價是什麼，以及 Skills 為什麼不是 MCP 的競品。

## 從 function calling 到 MCP：演進與代價

[〈Connecting LLMs to the Real World〉](https://blog.bytebytego.com/p/connecting-llms-to-the-real-world)把這段歷史講得最完整：

1. **2023 年中**，function calling 成為 OpenAI API 的一級功能——模型可以輸出結構化的呼叫意圖，由應用端執行
2. **ChatGPT Plugins** 嘗試把這件事產品化，但因為**發現困難、品質參差、安全模型不成熟**，2024-04 全面廢止
3. 各家自己定義 schema，於是出現 **N×M 問題**：N 個 agent 要接 M 個後端，每一對都要單獨實作
4. **MCP 把它變成 N+M**：agent 實作一次 client，後端實作一次 server，中間走同一個協定
5. **2025 年底捐給 Linux Foundation 底下的 Agentic AI Foundation**

第 3 到第 4 步是整件事的核心價值。它跟當年 ODBC 對資料庫、LSP 對編輯器做的事是同一類——不是讓任何單一整合變好，而是讓整合的**數量**從乘法變成加法。

**但代價是真的**，兩個：

- **2025-09 出現第一起針對 MCP 的供應鏈攻擊**：一個偽裝成 Postmark 官方的套件，暗中複製外寄郵件。協定普及帶來的是一個新的、共用的攻擊面
- **每個工具定義都吃 context**。這件事很容易被低估——掛了幾十個 MCP server 的 agent，可能在開始工作前就吃掉可觀的 context 預算，而[第三篇](/posts/ai/2026-08-10-agent-context-memory-failure)說過那是有品質後果的，不只是成本問題

Pinterest 的處理方式值得參考：**多個小 server 而不是一個大 server**（不同 server 需要不同存取控制），配一個**中央 registry 當治理骨幹**——只有註冊過的 server 才算通過生產核可。registry 不是電話簿，是閘門。

## MCP 的五個 primitives

多數介紹只講 Host / Client / Server 三個角色，但協定本身定義了五個 primitive，分屬兩邊：

**伺服端提供：**

- **Tools**——可被呼叫的動作
- **Resources**——可被讀取的資料
- **Prompts**——預先寫好的提示模板

**客戶端提供：**

- **Roots**——安全的檔案存取邊界
- **Sampling**——**server 反過來請求 AI 幫忙**，例如生成一句資料庫查詢

**Sampling 這個方向反轉最值得注意**：不是 agent 呼叫 server，是 server 回頭要求模型協助。這讓 server 可以在不自帶模型的情況下處理需要語言理解的步驟，成本與金鑰都留在 client 那邊。多數 MCP 導讀完全沒提這一個。

## A2A 與 ACP：agent 之間怎麼講話

MCP 管的是 agent ↔ 工具。agent ↔ agent 是另一組協定：

| | 做什麼 | 發現機制 |
|---|---|---|
| **MCP** | agent ↔ 工具 | server 宣告 tools / resources / prompts |
| **A2A** | agent ↔ agent | **Agent Card**，發佈在 well-known URL |
| **ACP** | REST 優先的 agent ↔ agent | **Agent Manifest**，直接走 HTTP |

A2A 的流程是：透過 Agent Card 發現同儕 → 委派任務 → 拿回結構化結果；若對方中途需要更多輸入，會進入 **input-required** 狀態再回頭問。ACP 走的是 REST 路線，同步回應或 async SSE 串流，**目前已併入 A2A**。

生產環境兩者互補而非競爭：**MCP 管工具存取，A2A 管 agent 之間的溝通。**

## MCP vs Agent Skills：不是同一個問題

這兩個東西最常被拿來比較，但它們解的問題不同。五個維度：

| | MCP | Agent Skills |
|---|---|---|
| **整合方式** | client-server 協定，N 個 agent 對 M 個後端走同一介面 | 一個資料夾 + `SKILL.md`，觸發時載入 |
| **架構** | 獨立行程、自己的 runtime、講 JSON-RPC | 就是一個目錄：`SKILL.md` + 選配的 scripts / references / assets |
| **呼叫** | 具型別參數、對 schema 驗證、可串接 | agent 讀 `SKILL.md`，執行裡面寫的 bash / python / curl |
| **Runtime** | 常跑在自己的容器或服務裡 | 跑在 agent 自己的環境，不需額外基礎設施 |
| **適用** | 接**活的**系統與資料 | 給 agent **可重複使用的知識與做法** |

留言區有一條比正文更好的判準：

> 呼叫之間資料會變 → 需要 MCP（agent 需要即時存取）；知識穩定到可以寫下來、幾週內都還正確 → skill 檔案更簡單更便宜，**而且不需要一個會獨立於 agent 而失敗的 runtime**。

最後那半句是重點。MCP server 是一個獨立行程，它會自己壞掉、需要自己的部署與監控。一份 markdown 不會。

真正的常態是兩者都要：**skill 告訴 agent 怎麼思考，MCP 給它可以思考的即時資料。**

### 一個對維護 skill 的人有用的推論

Skills 的載入模型本身就是為了對抗 context 稀釋設計的：agent 先拿到一份**只有名稱與簡短描述的 skills index**，決定要用哪一個之後，才載入那個 `SKILL.md` 的全文。這跟 OpenAI 的 deferred tool discovery 是同一個思路。

推論很直接：**`SKILL.md` 的 `description` 欄位要當成檢索鍵來寫，不是當成註解。** 它是唯一在「還沒被選中」時就進入 context 的部分，寫得含糊等於這個 skill 永遠不會被選中。

LinkedIn 對這件事有更進一步的做法：他們建了 **skill registry**，配相似度檢查與人工把關，防止 skill 無節制擴散。方向也有意思——從「應用團隊宣告我要哪些 skill」轉成「下游系統宣告我提供哪些 skill，應用去發現」。

## 為什麼不能只用截圖或既有 REST API

Figma 那篇提供了「為什麼需要 MCP 而不是現成介面」最具體的論證：

- **只給截圖** → LLM 只能**從像素猜值**，不知道間距是 24px 還是 20px，做出來的東西「看起來很像但不一樣」
- **只給 REST API** → 回傳完整 JSON，**資料太多**，單一頁面就能產生數千行，塞滿像素座標、視覺效果、內部佈局規則

MCP 的價值在於回傳一份**經過策展的表示**，介於兩者之間。這也是判斷「該不該為某個系統做 MCP server」的一個好問題：既有介面是太粗（猜）還是太細（淹沒）？如果剛剛好，就不需要。

## 本系列

1. [概念界線：agent、workflow、RAG、MCP 到底差在哪](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)
2. [模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
3. [context 與記憶：agent 失敗的真正位置](/posts/ai/2026-08-10-agent-context-memory-failure)
4. [上線才是工作的開始：企業案例橫向讀](/posts/ai/2026-08-10-enterprise-agent-case-studies)
5. [安全：prompt injection 只能在 harness 層做損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)
6. [引用之前：把 19 份一手來源查一遍](/posts/ai/2026-08-10-verifying-agent-numbers)
7. **協定層：MCP、A2A、ACP、Skills 各解什麼問題**（本篇）
8. [RAG 的三種形態與 evaluator paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants)

## 參考資料

- [Model Context Protocol 官方文件](https://modelcontextprotocol.io/)
- [ByteByteGo — Connecting LLMs to the Real World: Tool Use, Function Calling, and MCP](https://blog.bytebytego.com/p/connecting-llms-to-the-real-world)
- [ByteByteGo — MCP vs A2A vs ACP: How AI Agents Actually Talk to Each Other](https://blog.bytebytego.com/p/mcp-vs-a2a-vs-acp-how-ai-agents-actually)
- [ByteByteGo — EP213: MCP vs Skills, Clearly Explained](https://blog.bytebytego.com/p/ep213-mcp-vs-skills-clearly-explained)
- [ByteByteGo — EP154: What is MCP?](https://blog.bytebytego.com/p/ep154-what-is-mcp)
- [ByteByteGo — Why Anthropic's MCP is a Big Deal](https://blog.bytebytego.com/p/why-anthropics-mcp-is-a-big-deal)
- [ByteByteGo — Figma Design to Code, Code to Design](https://blog.bytebytego.com/p/figma-design-to-code-code-to-design)
- [ByteByteGo — How Pinterest Built a Production MCP Ecosystem](https://blog.bytebytego.com/p/how-pinterest-built-a-production)
- [ByteByteGo — The Evolution of LinkedIn's Generative AI Tech Stack](https://blog.bytebytego.com/p/the-evolution-of-linkedins-generative)
