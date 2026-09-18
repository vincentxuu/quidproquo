---
title: "Agent 記憶的攻擊面：當記憶變成持久化的後門"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, security, prompt-injection, memory-poisoning, minja, privacy]
lang: zh-TW
series:
  name: "AI Agent 記憶工程"
  order: 8
tldr: "記憶是持久化的 prompt injection 載體：MINJA 證明只靠對話就能注入記憶（成功率 >95%），SpAIware 示範植入後每次回答都外洩資料。業界兩派防線——引用驗證（Copilot）和人工核准（Gemini CLI / Devin）——各有盲點。"
description: "從三起實證攻擊（SpAIware、MINJA、Bedrock 投毒）拆解 agent 記憶系統的安全風險，比較業界兩種主流防線，整理保留政策與隱私設計。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-19-agent-memory-attack-surface-en)

你花了兩週建好一套 agent 記憶系統——自動從對話抽取事實、跨 session 保留、下次回答時注入。上線第一天，一個使用者在對話裡藏了一條指令。從此，你的 agent 每次回答都會在結尾附上一個外部 URL，而你的 dashboard 看不到任何異常。

這不是假設。2024 年 9 月，安全研究員 Johann Rehberger 在 ChatGPT macOS app 上完整示範了這個攻擊。他把它叫做 [SpAIware](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/)。

這篇整理 agent 記憶系統特有的攻擊面——不是一般的 prompt injection，而是利用記憶的持久性把一次性攻擊變成永久後門。範圍限定在有公開技術論述的攻擊與防禦。

## 為什麼記憶讓 prompt injection 變危險

一般的 prompt injection 是單次的：攻擊者在當前 context 裡注入指令，影響當次回答。Session 結束，攻擊就消失了。

記憶改變了這個等式。Agent 記憶系統會自動從對話中抽取「值得保留的事實」，寫進持久儲存，然後在未來每次 session 開始時注入 context。這意味著：

1. **攻擊只需成功一次**——注入的指令被記憶系統「學會」之後，會在每次未來互動中重新注入
2. **攻擊者不需要在場**——攻擊載荷已經存進記憶，攻擊者可以離開
3. **受害範圍擴大**——如果記憶是跨使用者共享的（如 Copilot repo-level memory），一次注入影響所有人
4. **偵測更困難**——記憶看起來就是普通的事實條目，不會觸發即時的安全警報

依 MITRE ATLAS 的分類，這屬於 [AML.T0080](https://atlas.mitre.org/techniques/AML.T0080)——AI Supply Chain Compromise 的記憶投毒變體。Microsoft AI Red Team 在其失效模式分類中把 memory poisoning 列為關鍵項。

## 三起實證攻擊

### SpAIware：持久化資料外洩（2024-09）

Johann Rehberger 在 [SpAIware](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/) 中示範了完整的攻擊鏈：

1. 攻擊者在對話中植入一段偽裝成使用者偏好的文字
2. ChatGPT 的記憶系統把它當作正常事實儲存
3. 被植入的指令要求模型在每次回答時，把對話內容編碼成 URL 參數，透過 Markdown 圖片標籤發送到攻擊者的伺服器
4. 從此以後，每一次新對話都會觸發這個外洩行為

關鍵發現：ChatGPT 的記憶系統**沒有區分使用者的真實偏好和注入的指令**。記憶抽取的 LLM 把兩者一視同仁。OpenAI 在揭露後修補了 Markdown 圖片渲染的外洩路徑，但記憶注入本身的問題仍然存在。

### MINJA：只靠對話就能注入（NeurIPS 2025）

如果 SpAIware 證明了「記憶被注入後很危險」，[MINJA](https://arxiv.org/abs/2503.03704)（NeurIPS 2025 poster）則證明了「注入本身非常容易」。

MINJA 的攻擊方式是純對話：攻擊者不需要任何特殊權限，只需要跟 agent 正常聊天。研究團隊用黑箱和白箱兩種方法產生注入文字，讓記憶系統把攻擊載荷當作正常事實儲存。

依論文資料，注入成功率 **>95%**。

更值得注意的是他們測試的不是玩具系統——實驗在 Mem0 和 MemGPT（Letta 的前身）上跑，這兩個是業界最常用的記憶框架。這意味著任何使用自動記憶抽取的系統都可能受影響。

### Bedrock Agents 記憶投毒（Unit 42，2025-10）

Palo Alto Networks 的 Unit 42 團隊在 [2025 年 10 月的研究](https://unit42.paloaltonetworks.com/indirect-prompt-injection-poisons-ai-longterm-memory/)中，在 AWS Bedrock Agents 上完成了記憶投毒的概念驗證。

攻擊路徑是 indirect prompt injection：透過 agent 讀取的外部資料（如網頁、文件）植入指令，讓 agent 把惡意內容寫進長期記憶。依 AWS 文件，投毒防護屬於[共同責任模型](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)——AWS 提供基礎設施安全，但記憶內容的驗證是應用端的責任。

## 攻擊的共同模式

三起攻擊看似不同，但核心機制相同：

```
使用者/外部輸入
  → LLM 記憶抽取（無法區分事實 vs 指令）
    → 持久儲存（攻擊只需成功一次）
      → 每次 session 注入（攻擊自動重播）
        → 影響所有後續互動
```

弱點在第二步：**記憶抽取的 LLM 沒有能力區分「這是使用者的真實偏好」和「這是偽裝成偏好的攻擊指令」**。這不是特定實作的 bug，是整個「用 LLM 自動抽取記憶」設計模式的結構性問題。

## 兩派防線

業界在 2026 年發展出兩種主要防禦策略：

### 引用 + JIT 驗證（Copilot 路線）

GitHub Copilot Memory 的設計是目前最精細的防線，依其[工程部落格](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)：

- **每條記憶附引用（citation）**：記錄這條記憶是從哪段程式碼或對話中產生的
- **JIT 驗證**：每次 session 開始注入記憶時，檢查引用的程式碼是否仍然存在於當前 branch。如果原始程式碼已被刪除或修改，這條記憶就不用
- **28 天衰減**：未被驗證使用的記憶自動刪除，攻擊載荷有天然的保存期限
- **寫入門檻**：只有有 repo 寫入權的貢獻者才能產生 repo-level 記憶

這個設計的核心思路是**不信任記憶的內容，但信任記憶的來源**。每條記憶都有可驗證的出處，失去出處就失效。

盲點：引用驗證只能確認來源存在，不能確認來源內容是善意的。如果攻擊者有 repo 寫入權（例如外部貢獻者的 PR），就能產生帶有效引用的惡意記憶。

### 人工核准 inbox（Gemini CLI / Devin / LangSmith 路線）

另一派直接把寫入決定權交還給人：

- **Gemini CLI Auto Memory**（[官方文件](https://geminicli.com/docs/cli/auto-memory)）：背景掃描閒置 3+ 小時的 session，草擬 memory patch 和 SKILL.md 候選進審核 inbox，**使用者核准才生效**。Auto Memory 不能直接改 active memory、settings 或憑證
- **Devin Knowledge Suggestions**（[官方文件](https://docs.devin.ai/product-guides/knowledge)）：從對話回饋自動建議知識條目，使用者核准後才加入組織的 Knowledge base
- **LangSmith Fleet**：記憶更新須使用者逐條核准
- **Cursor 1.2**：在 GA 時對背景產生的記憶加入核准流程（後來整個 Memories 功能在 2.1.17 被移除）

核准 inbox 的邏輯是：**人是最後一道閘門**。不管 LLM 抽取出什麼，寫入都需要人點頭。

盲點：核准疲勞。當 inbox 裡堆了幾十條記憶建議，使用者會開始批量核准而不逐條審查——這跟 HTTPS 憑證警告被忽略是同一個人因問題。

## 廠商怎麼說

部分廠商在文件中直接對記憶安全發出警語：

**Cursor Automations**（[官方文件](https://cursor.com/docs/cloud-agents/automations)）在 Memories 功能說明中直接附上 prompt injection 警語，提醒開發者 `MEMORIES.md` 檔案可能被注入。

**Anthropic memory tool**（[官方文件](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)）明確標示記憶操作是 client-side，儲存、租戶隔離、TTL 全部是應用端責任，且必須防 path traversal。

**AWS AgentCore**（[開發者指南](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)）明言投毒防護屬共同責任。

這些不是公關辭令——它們等於承認：**我們提供記憶基礎設施，但內容安全是你的問題**。

## 保留政策與隱私

記憶安全不只是攻擊面，還涉及「記了什麼、存多久、誰能刪」。

### 消費端

三大廠都提供基本的使用者控制（2026-09 查詢）：

| 能力 | ChatGPT | Claude.ai | Gemini |
|---|---|---|---|
| 逐條檢視/刪除 | Settings > Personalization | Settings > Memory > Topics | /memory show |
| 整體關閉 | ✓ | ✓（Enterprise 關閉即永久刪除） | ✓ |
| 不寫記憶的模式 | Temporary Chat | Incognito chat | Temporary Chat |

### 平台端

| 平台 | 隔離機制 | 刪除方式 | ZDR 相容 |
|---|---|---|---|
| Anthropic memory tool | 應用端責任 | 應用端實作 | client-side，可用（但 Covered Models 需 [30 天保留](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)） |
| Anthropic Managed Agents | workspace | redact（無 restore）、版本保留 30 天 | 不適用 |
| OpenAI Responses API | `store` flag | 預設存 30 天；`store=false` 走 ZDR | `store=false` |
| Mem0 | `user_id` / `agent_id`（應用端慣例） | `delete` / `batch_delete(≤1000)` / `delete_all`，硬刪 | N/A |
| AWS AgentCore | namespace + IAM condition key | 事件過期（3–365 天）、長期記憶靠策略 | 一律加密，可選 CMK |
| Google Memory Bank | scope + IAM Conditions | 未確認 TTL 欄位 | VPC-SC、CMEK、HIPAA |
| Microsoft Foundry | scope 綁 Entra tenant | `default_ttl_seconds` | 未公開 |

值得注意的是：**開源框架（Mem0、LangGraph、Graphiti）的隔離 key 都是應用端慣例，沒有內建 ACL**。如果你用 Mem0 建多租戶系統，「不讓 A 公司看到 B 公司記憶」完全是你的程式碼要處理的事。

## 如果你在建記憶系統

根據以上攻擊和防禦的分析，給幾個具體建議：

**最低要求**：
- 使用者能看到 agent 記住了什麼（不是黑盒）
- 使用者能逐條刪除記憶
- 有不寫記憶的模式（Temporary/Incognito chat 的等價物）

**建議加入**：
- 記憶寫入的審核閘門（inbox 核准或至少管理者可審）——依 MINJA 的研究結果，無閘門的自動抽取幾乎必然被注入
- 記憶附引用來源——依 Copilot 的設計，有來源的記憶可以被驗證、可以自動失效
- 衰減或 TTL——沒有遺忘機制的記憶系統等於攻擊載荷的永久儲存庫
- 多租戶場景的隔離不能只靠 key 慣例，需要真正的 ACL

**B2B 場景特別注意**：
- 管理者必須能清除特定使用者的所有記憶（GDPR 刪除權的前置條件）
- 共享記憶（如 repo-level、org-level）的寫入需要權限控制
- 考慮記憶內容是否符合資料保留政策——記憶抽取的 LLM 可能把敏感資訊（API key、個資）當作「事實」儲存

## 記憶安全的現狀

MINJA 的結論暗示了一個尷尬的現實：只要記憶系統用 LLM 自動抽取，就存在結構性的注入風險。目前沒有任何系統能完全解決這個問題。

依 2026-04 的[記憶安全 survey](https://arxiv.org/abs/2604.16548) 整理，現有的緩解措施可以分成三層：

1. **寫入閘門**（減少攻擊進入的機會）：人工核准、寫入權限控制、內容過濾
2. **讀取驗證**（減少已注入攻擊的影響）：引用驗證、JIT 檢查、衰減/TTL
3. **可觀察性**（讓攻擊可被發現和清除）：使用者可見可編輯、管理者儀表板、稽核日誌

沒有任何單一措施足夠。Copilot 的引用驗證解決了「記憶來源可追溯」但沒解決「有寫入權的人就能投毒」；Gemini CLI 的 inbox 解決了「人有最終決定權」但沒解決「人會疲勞」。

實務上，**三層都做**是 2026 年的最低標準。

## 參考資料

- [SpAIware: persistent data exfiltration via ChatGPT memory — Johann Rehberger（2024-09）](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/)
- [MINJA: Memory Injection Attacks on LLM Agents via Query-Only Interaction — NeurIPS 2025（arXiv 2503.03704）](https://arxiv.org/abs/2503.03704)
- [Indirect prompt injection poisons AI long-term memory — Unit 42（2025-10）](https://unit42.paloaltonetworks.com/indirect-prompt-injection-poisons-ai-longterm-memory/)
- [Building an agentic memory system for GitHub Copilot — GitHub Engineering](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)
- [Copilot Memory 概念文件 — GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [Gemini CLI Auto Memory 官方文件](https://geminicli.com/docs/cli/auto-memory)
- [Devin Knowledge 官方文件](https://docs.devin.ai/product-guides/knowledge)
- [Cursor Automations 官方文件](https://cursor.com/docs/cloud-agents/automations)
- [Anthropic memory tool 官方文件](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)
- [Anthropic Managed Agents Memory 官方文件](https://platform.claude.com/docs/en/managed-agents/memory)
- [Anthropic API 與資料保留政策](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention)
- [AWS AgentCore Memory 開發者指南](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)
- [MITRE ATLAS AML.T0080](https://atlas.mitre.org/techniques/AML.T0080)
- [A Survey on Security of Long-Term Memory（arXiv 2604.16548）](https://arxiv.org/abs/2604.16548)
