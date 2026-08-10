---
title: "上線才是工作的開始：企業 agent 案例橫向讀"
date: 2026-08-10
category: ai
type: deep-dive
tags: [ai-agent, harness-engineering, agentic-ai, orchestration, evaluation]
lang: zh-TW
series:
  name: "Agent 生產線"
  order: 4
tldr: "Salesforce 從兩萬個部署得到的數字：agent 有 90% 的工作發生在上線之後，跟傳統軟體剛好相反。Stripe 每週合併 1,300 個零人類手寫的 PR，靠的是環境而不是模型。附六家公司的橫向比對。"
description: "Salesforce、Stripe、Microsoft、Grab、Meta、OpenAI 六家企業 agent 案例的橫向重點：上線後的四類分診迴圈、unattended agent 的環境設計、依風險剖面切分讀寫路徑，以及 rubric-based eval。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-10-enterprise-agent-case-studies-en)

前三篇談的是原則。這一篇看真的把 agent 推到生產環境的人怎麼做——[Salesforce](https://blog.bytebytego.com/p/what-salesforce-learned-from-20000)（兩萬個企業部署）、[Stripe](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs)、[Microsoft](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at)、[Grab](https://blog.bytebytego.com/p/how-grab-is-using-ai-agents-to-boost)、[Meta](https://blog.bytebytego.com/p/how-meta-uses-ai-agents-for-data)、[OpenAI 資料平台](https://blog.bytebytego.com/p/how-openai-built-its-data-agent)。

## Salesforce：90% 的工作在上線之後

這是整批材料裡最反直覺的一個數字，也是他們認為多數企業 agent 失敗的根因——團隊沿用傳統軟體的節奏，以為上線就結束了。

**上線前只要做三件事**：範圍收小（"Don't boil the ocean"）、綁一個 KPI（他們用 containment rate，即不需人工跟進就完全解決的比例）、架好信任層（input guardrails 管安全檢索與資料留存邊界，output guardrails 管工具驗證、grounding 檢查與內容過濾）。

**上線後靠一個四類分診的回饋迴圈**：

| 症狀 | 往哪修 |
|---|---|
| 語氣不對 | 改 system prompt |
| 邏輯錯誤 | 查工具設定；反覆出現就改成確定性腳本 |
| 資料品質 | 問題不在 agent，回頭找文件擁有者 |
| 覆蓋缺口 | 擴範圍，或做一條乾淨的人工升級路徑 |

**迴圈的速度就是能不能擴大規模的閘門。** 這句話值得單獨記——決定你能跑多大的不是模型能力，是從發現問題到修好的循環時間。

還有一個很少看到有人講的細節：他們的**資料遮罩預設關閉**，因為遮罩會把 agent 推理需要的 context 一起遮掉。這是安全與可用性的真實衝突，多數文章會避開。

### Intercom 補上另一半：別用解決率當 KPI

[Intercom](https://www.intercom.com/blog/whats-new-with-fin-3/) 自陳 Fin 2 的平均解決率已達 66%（跨六千多個客戶，超過兩成的客戶在 80% 以上）。但他們自己說這個指標不夠：

> 回答一個聊天室裡的快速 FAQ，跟調查一筆付款爭議或用電話驗證退款，不是同一回事。兩者都算「已解決」，但工作量差很多。

他們改看**自動化率**——agent 端到端處理掉你整體工作量的多少。這跟 Salesforce 的 Agentic Work Units 是同一個洞察的兩種說法：**不要用互動次數或解決率當 KPI，要衡量真正被完成的工作量。** 兩家獨立收斂到同一點。

## Stripe：沒人盯著的 agent

每週合併超過 1,300 個「零人類手寫程式碼」的 PR。這篇最有價值的貢獻是一組區分：**attended 對 unattended**。Cursor、Claude Code 是有人盯著、隨時導正的；Minions 沒人看，收到任務自己做完交件。這個差別改變下游所有的設計要求。

背景難度不低：數億行程式碼、Ruby + Sorbet（LLM 訓練資料裡少見的組合）、滿是自家函式庫、生產環境每年經手超過一兆美元。

- **環境先於模型**：devbox 十秒開機（靠預先暖機的機器池），跑在已與生產隔離的 QA 環境，**所以 agent 可以全權限執行、完全不需要確認提示**——出錯的爆炸半徑就是一台可丟棄的機器。關鍵句：「Stripe 不是為 agent 建的這些，是為人建的。對人好的東西對 agent 也好。」
- **規則要 scoped，不要 global**：他們「非常謹慎地」使用全域規則，因為全域規則會在 agent 還沒開始工作前就把 context 填滿。改成綁定到特定子目錄與檔案模式，agent 走到哪就撿起哪裡的規則——而且是 Cursor 與 Claude Code 共用同一批規則檔，沒有重複維護
- **工具預設給少**：用 MCP host 了將近 500 個工具，但 Minions 預設只拿一小組，工程師需要時再加
- **回饋分層**：本地 lint 五秒內（背景 daemon 預算好適用規則並快取）→ CI 從三百多萬個測試裡選擇性跑、已知失敗模式自動修 → 還失敗就再給 agent 一次機會
- **硬上限**：**最多兩輪 CI，之後退回給人。** 理由是 LLM 重試同一個問題有遞減報酬。「知道什麼時候該停，跟知道怎麼開始一樣重要」

那條 scoped rules 的建議，是整批材料裡對「維護 `CLAUDE.md` 越長越好嗎」這個問題最直接的回答：不好，而且問題不在內容品質，在它無條件佔用預算。

## Grab 與 Meta：兩個他處沒有的架構

**Grab 依風險剖面切成兩條路徑**，這是我看到唯一明確用「讀 vs 寫」劃分架構的案例：

- **調查路徑（唯讀，4 個 agent）**：Classifier（解析問題、抽取實體、偵測 PII 等 guardrail 違規、決定要哪些專家 agent 及順序，**並輸出路由理由供 debug**）→ Data Agent → Code Search Agent → On-call Agent → Summarizer
- **增強路徑（寫入，1 個 agent）**：**每一階段都要人工核可**，因為它會動到生產管線

設計哲學叫 "decoupling the brain from the hands"，好處是出問題時能立刻分辨是推理錯還是某個工具互動錯。而且他們誠實寫下：系統在 demo 很好，**上生產後六件事壞掉**。

**Meta 讓 data-user agent 與 data-owner agent 互相協商**資料存取核可。data-user agent 底下再分三個子 agent 由 triage 層調度，其中最有意思的是 **alternative-suggestion**：你要一張敏感表時，它建議一張含有類似但非敏感資料的替代表，甚至幫你改寫 query 只用非受限欄位。原文的觀察很好——**這種過去只存在於少數資深工程師腦中的 tribal knowledge，現在被 agent 綜合出來了。**

另一個子 agent 處理 low-risk exploration：多數人在探索階段不需要整份資料集的完整權限，給臨時的、部分的樣本存取即可。

## Microsoft：harness 的完整解剖

五層：Inference（一萬多個可換的模型）→ Runtime（框架中立）→ Observability & Governance → Identity → Context。

三個值得單獨記的點：

- **retrieval-as-a-subagent**——把檢索包成一個小 agent：規劃查哪些來源 → 執行 → 對照原問題評估 → 決定回傳、改寫查詢、還是換來源。最值得注意的是**迭代用盡時回傳結構化的「我不知道」**，而不是硬給一個聽起來合理的錯答案
- **agent 要有自己的身分**——在 Entra 裡是一類 principal，有角色指派與稽核軌跡。否則日誌只會顯示「AI 幹的」，出事時無從追起
- **guardrails 要移到 tool boundary**——chatbot 只需篩使用者輸入與模型輸出；agent 還會讀工具輸出與檢索到的文件，間接注入就藏在那裡（這條在[第五篇](/posts/ai/2026-08-10-agent-security-harness-layer)展開）

## 怎麼知道它有沒有變好

Microsoft 的 **rubric-based eval** 解掉了一個很實際的問題：通用指標（groundedness、coherence）只能告訴你 agent 能不能動，不能告訴你它做得對不對。他們的例子是訂餐 agent——它成功建立了訂位，但有沒有問清楚時間？有沒有先確認有位子？於是改用**是非題式的 rubric**，再接 Agent Optimizer 自動改 prompt、換模型、調工具，平行產生數個候選版本、按 rubric 評分、擇優升版。

[DoorDash](https://blog.bytebytego.com/p/how-doordash-built-a-testing-system) 則給了一個完整的 **simulation & evaluation flywheel**：離線模擬器**從歷史逐字稿生成**擬真的多輪客服對話（不動到真實客戶），配自動評分框架。流程是——發現問題 → 寫一條捕捉該失敗模式的 eval → 一個 job 觸發整條管線 → 改 prompt 或架構 → 重跑看通過率有沒有上升 → 到達門檻才部署。

他們的問題背景值得記：**幻覺不是那種戲劇性的捏造，而是「原始資料就在 context 裡，但資訊太多反而讓模型讀錯」**——這正好回到[第三篇](/posts/ai/2026-08-10-agent-context-memory-failure)那句「多數失敗是 context 失敗」。

## 橫向收斂

六個案例、六個不同產業，共通的其實只有幾件事：**環境先於模型、確定性節點越多越好、寫入路徑要跟讀取路徑分開、回饋迴圈的速度決定規模上限、以及知道什麼時候停。**

沒有任何一家把重點放在模型選型上。

## 本系列

1. [概念界線：agent、workflow、RAG、MCP 到底差在哪](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)
2. [模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
3. [context 與記憶：agent 失敗的真正位置](/posts/ai/2026-08-10-agent-context-memory-failure)
4. **上線才是工作的開始：企業案例橫向讀**（本篇）
5. [安全：prompt injection 只能在 harness 層做損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)
6. [協定層：MCP、A2A、ACP、Skills 各解什麼問題](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)
7. [RAG 的三種形態與 evaluator paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants)

## 參考資料

- [ByteByteGo — What Salesforce Learned from 20,000 Enterprise Agent Deployments](https://blog.bytebytego.com/p/what-salesforce-learned-from-20000)
- [ByteByteGo — How Stripe's Minions Ship 1,300 PRs a Week](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs)
- [ByteByteGo — How Microsoft Ships AI Agents at Enterprise Scale](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at)
- [ByteByteGo — How Grab is Using AI Agents to Boost Team Productivity](https://blog.bytebytego.com/p/how-grab-is-using-ai-agents-to-boost)
- [ByteByteGo — How Meta Uses AI Agents for Data Warehouse Access and Security](https://blog.bytebytego.com/p/how-meta-uses-ai-agents-for-data)
- [ByteByteGo — How OpenAI Built Its Data Agent](https://blog.bytebytego.com/p/how-openai-built-its-data-agent)
- [ByteByteGo — How DoorDash Built a Testing System to Evaluate LLMs](https://blog.bytebytego.com/p/how-doordash-built-a-testing-system)
- [ByteByteGo — A Guide to LLM Evals](https://blog.bytebytego.com/p/a-guide-to-llm-evals)
- [ByteByteGo — How Pinterest Built a Production MCP Ecosystem](https://blog.bytebytego.com/p/how-pinterest-built-a-production)
- [Intercom — What's new with Fin 3](https://www.intercom.com/blog/whats-new-with-fin-3/)
