---
title: "多 agent 架構的考點交集：五張證照重複考什麼，又各自獨有什麼"
date: 2026-08-18
type: deep-dive
category: ai
tags: [certification, multi-agent, orchestration, mcp, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 16
tldr: "微軟 AI-500、AB-620、AB-100、NVIDIA NCP-AAI、Claude CCAR-F 這五張證照都考多 agent 架構，交集是七件事：編排拓樸、A2A 與 MCP、每個 agent 的身分邊界、三層記憶、可觀測性與 agent replay、人在迴圈、四個介入點的 guardrail。但同一件事四家用四個名字，而且各自有無法互相轉移的獨有考點——微軟命名了四種 context window 失效模式、NVIDIA 有 7% 綁死自家 NeMo 與 NIM、Claude 考 stop_reason 這種 SDK 層細節。另外修一個常見誤解：Google PMLE 滿篇「Agent Platform」是 Vertex AI 改名，不是多 agent 考點。"
description: "跨證照的多 agent 系統架構考點整理：比對微軟 AI-500 / AB-620 / AB-100、NVIDIA NCP-AAI、Claude CCAR-F 五份官方 exam guide 的重疊與分歧，附四家名詞對照表、獨有考點清單，以及一個能蓋掉交集的練習專案。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en)
>
> 本文是從官方資料建出來的備考材料，不是應考實錄 —— 作者沒有報考這些考試。所有「考什麼」都指回各家官方 exam guide 或 study guide，來源逐條列在文末。查證日期：2026-08-18。

這是 [AI 證照備考系列](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)的技術深潛篇。系列前十五篇是一張證照一篇，這篇反過來：**把「多 agent 系統架構」這個被五張證照重複考的主題抽出來，一次講完交集，再標出各家不能互相取代的部分。**

省時間的方式是先看交集——因為交集佔了每張證照多 agent 那塊的大半。但**只讀交集會過不了任何一張**，所以第四節那份獨有考點清單同樣重要。

## 哪五張，考點各在哪

| 證照 | 多 agent 相關 domain | 權重 | 這張的角度 |
|---|---|---|---|
| [微軟 AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)（beta） | Architect multi-agent solutions | 15–20% | code-first，Agent Framework / LangGraph |
| 同上 | Develop multi-agent solutions in Azure | **30–35%** | 編排模式與 MCP server 實作全在這塊 |
| [NVIDIA NCP-AAI](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide) | Agent Architecture and Design | 15% | 十個領域裡只有 7% 綁 NVIDIA 產品 |
| 同上 | Cognition, Planning, and Memory | 10% | 推理框架與有狀態編排 |
| [微軟 AB-620](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide) | Integrate and extend agents in Copilot Studio | **40–45%** | 低程式碼，「多 agent 協作」是其中四條之一 |
| [微軟 AB-100](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide) | Design AI-powered business solutions | 25–30% | 架構師視角，選型邊界與 ROI |
| [Claude CCAR-F](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide) | Agentic Architecture & Orchestration | **27%**（單一 domain 最高） | 綁 Claude Agent SDK，考到 API 層細節 |

**先修掉一個常見誤解**：Google PMLE 的考綱從頭到尾都是「Agent Platform」，很容易被當成多 agent 考試。**它不是。** 那些字是 Vertex AI 在 2026 年改名為 Gemini Enterprise Agent Platform 造成的產品名替換——Agent Platform Feature Store、Agent Platform Pipelines、Agent Platform Inference，指的是原本的 Feature Store、Pipelines 與 Prediction。PMLE 的骨架仍是傳統 ML 工程（特徵工程、分散式訓練、training-serving skew），[官方考試指南](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)裡沒有一條在考 agent 之間怎麼協調。想用 PMLE 證明多 agent 能力，方向是錯的。

**另一個門檻要先講**：Claude 四張只開放 Claude Partner Network 的組織報名，個人報不了名。下面引用 CCAR-F 是因為**它的 Domain 1 是這五份材料裡把編排講得最具體的一份**（具體到 `stop_reason` 與 `allowedTools`），對理解其他四張有幫助，不是建議你去考。

## 交集：五張都在考的七件事

### 一、編排拓樸

AI-500 是唯一把拓樸名稱逐個列出來的：**hub-and-spoke、循序、平行、peer-to-peer、orchestrator-subagent**。這五個名詞值得當成共同詞彙表背下來，因為另外四張考的是同一組東西，只是不列名：

- NCP-AAI 寫「多 agent 工作流編排」，並在同一個領域列 **ReAct 這類推理與行動框架**、用**邏輯樹與 prompt 鏈做多步推理**
- AB-620 寫「在 Copilot Studio 裡設計多 agent 方案」「整合 Foundry agent」「整合既有 agent」
- AB-100 寫「用 Microsoft 365 Copilot、Copilot Studio 與 Microsoft Foundry 設計多 agent 方案」——注意它考的是**跨三個產品的組合選型**，不是單一產品裡怎麼接
- CCAR-F 只考 hub-and-spoke 一種，但考得最深：coordinator 負責所有 subagent 的通訊、錯誤處理與資訊路由，而且**平行執行的正確做法是在單一 coordinator response 裡發出多個 Task tool call，不是分多個 turn**

**要點回指**：AI-500 Develop（30–35%）、CCAR-F Domain 1（27%）、NCP-AAI Agent Architecture（15%）、AB-620 Integrate（40–45% 的一部分）。

### 二、A2A 與 MCP

三張微軟證照都點名 **A2A**（[Agent2Agent 協定](https://a2a-protocol.org/latest/)），這是 2026 年的新考點：

- AI-500：「用 A2A 或 MCP 安全地把既有 agent 併入」
- AB-620：「用 A2A 協定建立多 agent 方案」，且認證頁把 MCP 與 A2A 列進「該熟悉」的生成式 AI 概念
- AB-100：「用 MCP 設計 Copilot Studio 的 agent 擴充」

[MCP](https://modelcontextprotocol.io/) 的考法則四家分歧最大。**微軟考的是「架在哪個 Azure 服務上」**——AI-500 的目標直接寫「設計並建置 MCP server 與 client，含 Azure Functions、Azure Logic Apps、Azure API Management」，這是實作題不是概念題。**Claude 考的是工具本身怎麼設計**（Domain 2 Tool Design & MCP Integration，18%）。NCP-AAI 只寫「agent 對 agent 的通訊協定」，**不點名任何協定**——這是它平台中立的一個副作用，也代表準備時你得自己決定讀哪份規格。

**要點回指**：AI-500 Develop、AB-620 Integrate、AB-100 Design、CCAR-F Domain 2。

### 三、每個 agent 的身分與權限邊界

這件事的措辭差異最大，但講的是同一個失效模式：**一個被攻破的 agent 不該能把權限擴散到其他 agent。**

AI-500 用的是最完整的框架——「**Zero Trust 多 agent 方案**：每個 agent 的身分範圍、**防止橫向移動**、法規部署的合規控制對應」。「橫向移動」（lateral movement）是資安詞彙，微軟把它直接搬進 agent 考綱是這五份裡唯一的。

其他家的等價考點：AB-620 的「身分策略」與工具權限；AI-500 架構塊另有「指定工具範圍、權限邊界與驗證方式」；CCAR-F 則從可靠性角度切入同一件事——**給一個 agent 18 個工具，比給 4–5 個相關工具的選擇可靠性低很多，每個 subagent 只拿它角色需要的工具**。

**這兩個角度要一起記**：最小權限既是資安控制，也是準確率控制。站內的 [Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer)與 [agent 安全：prompt injection 與信任邊界](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries)可以補實務脈絡。

**要點回指**：AI-500 Architect + Secure（20–25%）、AB-620 Plan（30–35%）、CCAR-F Domain 2。

### 四、記憶的三層，以及 context 怎麼壞掉

AI-500 把狀態切成三層，這是最好用的心智模型：**session state、共享團隊狀態、長期語意記憶**，而且要求「含生命週期與租戶隔離」。NCP-AAI 的講法是「短長期 context 的記憶機制」加上「**有狀態編排**」；CCAR-F 則給了一條很容易被忽略的實作事實——**subagent 不會自動繼承 coordinator 的對話歷史，必須在 prompt 裡明確傳入所需的上下文**。

AI-500 更進一步，**把四種 context window 失效模式逐一命名**：

| 失效模式 | 症狀 |
|---|---|
| sliding-window amnesia | 視窗滑動把早期關鍵事實擠掉 |
| summary drift | 反覆摘要導致原意逐步偏移 |
| vector-only recall | 只靠向量檢索召回，錯過需要精確比對的內容 |
| entity continuity | 跨輪次的實體指涉接不上 |

**這四個詞在另外四家的考綱裡都找不到。** 官方把它們逐一命名，代表題目很可能給症狀要你判斷是哪一種。而反過來說，這四種病在 CCAR-F 是以「整合多個 subagent 結果時不要把 15 個 subagent 的完整 output 直接串接」這種操作建議出現的——**症狀相同，考法不同**。

**要點回指**：AI-500 Architect + Evaluate（20–25%）、NCP-AAI Cognition/Planning/Memory（10%）、CCAR-F Domain 5 Context Management & Reliability（15%）。

### 五、可觀測性：trace 關聯與 agent replay

多 agent 的可觀測性跟單一服務的差別在**跨 agent 關聯**。四家的要求：

- **AI-500**：跨服務 trace 關聯、agent 推理路徑的結構化記錄、**agent replay 擷取以重現除錯**；實作面指名在 Foundry 做 tracing（token、prompt、correlation ID、告警、執行追蹤）
- **NCP-AAI**：監控儀表板與可靠性指標、日誌與異常追蹤、**持續與前版做 benchmark**（Run, Monitor, and Maintain 那塊）
- **AB-620**：用 **Application Insights** 監控 agent
- **AB-100**：**解讀遙測資料**做效能與模型調校

**agent replay 是 AI-500 獨有的措辭**，也是最值得單獨弄懂的一個——它要求你能把一次執行完整重放，而不只是看日誌。

**一個查證上的坑要順帶標記**：NCP-AAI 的 Run, Monitor, and Maintain 這塊，**官方網頁寫 5%、官方 PDF study guide 寫 7%**，兩份都在 nvidia.com。同一份表格的 Deployment and Scaling 也對不上（網頁 13%、PDF 5%）。準備時把它當不確定區間，別挑一個當事實。

**要點回指**：AI-500 Evaluate（20–25%）、NCP-AAI Run/Monitor/Maintain（5–7%，兩版矛盾）、AB-620 Integrate、AB-100 Deploy（40–45%）。

### 六、人在迴圈

四家都考，而且都不只是「加一個確認按鈕」：

- **AI-500**：架構塊要求設計含 subagent、控制迴圈與 **human-in-the-loop** 的工作流，並設計支援 **HAX（human-AI experience）** 的控制項；編排塊要求 human-in-the-loop 的**核可流程、覆寫、邊界案例**
- **AB-620**：「建立 **human-in-the-loop 的 agent flow**」是明列技能，跟「在 agent flow 裡做錯誤處理」並列
- **NCP-AAI**：獨立成一個 5% 的領域（Human-AI Interaction and Oversight），含**透明機制（可解釋推理、決策可追溯）**
- **CCAR-F**：沒有獨立 domain，但 Domain 1 的核心概念就是它的極端版本——**當某個工具呼叫順序是業務邏輯必要條件時，用程式碼強制執行，不要只靠 prompt**

最後那條值得單獨記住：**「先改 prompt」在這類題目裡通常是錯誤選項。**

**要點回指**：AI-500 Architect + Develop、AB-620 Plan、NCP-AAI Human-AI Interaction（5%）、CCAR-F Domain 1。

### 七、guardrail 有四個介入點，部署有三種發布法

AI-500 的 guardrail 框架是這五份裡最結構化的：「**多重介入的 guardrail 策略，涵蓋使用者輸入、工具呼叫、工具回應與輸出**」，再加上**用合成資料做 guardrail 測試與驗證**、shift-left（Foundry 的 AI Red Teaming Agent）。

**四個介入點這個切法值得直接拿去用**——多數人只做輸入與輸出兩點，漏掉工具呼叫與工具回應，而後兩者正是多 agent 系統實際被打穿的地方。

部署面：AI-500 明列 **DTAP、藍綠、金絲雀**；NCP-AAI 是**容器化擴展（Docker、Kubernetes）與負載平衡**加 MLOps 的 CI/CD；AB-100 則要求為 Copilot Studio 的 agent／connector／action、Foundry Agents service、自訂模型**分別設計 ALM**，並設計**模型與資料變更的稽核軌跡**。

**要點回指**：AI-500 Secure/Govern/Deploy（20–25%）、NCP-AAI Deployment and Scaling（5–13%，兩版矛盾）＋ Safety/Ethics/Compliance（5%）、AB-100 Deploy（40–45%）。

## 同一件事，四家四個名字

備考時最花時間的不是理解概念，是發現「這兩個名詞其實是同一件事」。這張表是本文最實用的部分：

| 概念 | 微軟（AI-500 / AB-620 / AB-100） | NVIDIA（NCP-AAI） | Anthropic（CCAR-F） |
|---|---|---|---|
| 主從式編排 | orchestrator-subagent、hub-and-spoke | 多 agent 工作流編排 | hub-and-spoke coordinator |
| 狀態管理 | 多層狀態持久化（session／共享團隊／長期語意） | 短長期 context 的記憶機制、有狀態編排 | context management、subagent 需明確傳入 context |
| agent 間通訊 | A2A、MCP（指名服務：Functions／Logic Apps／APIM） | 「agent 對 agent 的通訊協定」（不指名） | MCP（Domain 2，18%） |
| 安全邊界 | Zero Trust、防橫向移動、Key Vault | 分層安全框架（過濾器、升級協定）、NeMo Guardrails | 每個 subagent 只拿角色需要的工具 |
| 可靠性控制 | 多重介入 guardrail、AI Red Teaming Agent | 合規 guardrail、稽核軌跡 | 用程式碼強制執行工具順序、靠 `stop_reason` 終止迴圈 |
| 可觀測性 | Foundry tracing、correlation ID、agent replay | 監控儀表板、可靠性指標、與前版 benchmark | Domain 5 的 context 管理與可靠性 |
| 評估 | 針對記憶／知識／工具／prompt 分別評估、LLM-as-a-judge | 評估管線與任務 benchmark、準確度與延遲取捨 | 反模式清單（考試以情境題形式出現） |

**用法**：讀完一家的材料後，用這張表把名詞翻譯過去，另外三家的同一塊就不用重讀，只要補獨有的部分。

## 不能互相取代的部分

這是交集之外的清單。**每一條都只能從那張自己的官方材料補**，通用的 agent 經驗轉移不過去。

**AI-500 獨有**：四種 context window 失效模式的名詞、agent replay、Zero Trust 多 agent 的合規控制對應、MCP server 架在 Azure Functions／Logic Apps／API Management、Foundry 的 AI Red Teaming Agent、DTAP、**用 Hugging Face Transformers 實作進階多 agent 能力**（這條在別家完全沒有）。

**NCP-AAI 獨有**：那 7% 的 NVIDIA Platform Implementation——**NeMo Guardrails、NIM microservices、NeMo Agent Toolkit、TensorRT-LLM、Triton Inference Server**，加上架構塊的**知識圖譜關聯推理**。除了這 7%，這張的其餘九個領域是五份材料裡**廠商中立度最高的**，準備它對實際工作的轉移價值也最高。

**AB-620 獨有**：Copilot Studio 的 **agent flows**、**computer use**（官方寫的是「configure **and monitor** computer use」，監控是同一條技能的一部分）、**Fabric data agent**、adaptive cards、Power Platform 的 solution 與 Pipelines ALM。

**AB-100 獨有**：**含總持有成本的 ROI 準則**、**自建／購買／擴充的取捨**、**model router 把請求導向最合適的模型**、Microsoft AI Center of Excellence、以及三組選型分界（自建 vs 擴充 Copilot、標準 NLP vs 生成式編排、task agent vs autonomous agent）。這張考的是判斷不是實作，讀書補不完。

**CCAR-F 獨有**：靠 `stop_reason` 而不是解析回應文字終止 agentic loop、coordinator 的 `allowedTools` 必須含 `Task`、平行 subagent 要在單一 response 發多個 tool call、`fork_session` 與 `--resume` 的適用分界。**這些是 SDK 層細節**，換一家平台就不成立。

## 一個練習專案能蓋掉多少

如果你要同時準備兩張以上，做一個專案比讀兩份材料划算。這份清單對應上面七件事，**做完能蓋掉交集，蓋不掉獨有那節**：

1. 做一個 **orchestrator-subagent** 架構，至少三個 subagent，其中兩個要能平行執行 →（一）
2. 把其中一個工具做成 **MCP server**，另一個 agent 用協定接入而不是直接呼叫函式 →（二）
3. 給每個 subagent **不同的憑證與工具白名單**，並實際測一次「A 被打穿後能不能碰到 B 的資源」 →（三）
4. 明確實作三層狀態：單輪 session、跨 agent 共享、跨 session 的長期記憶，並各自寫下 TTL →（四）
5. 加 **correlation ID** 串起所有 agent 的 trace，並把一次完整執行存成可重放的紀錄 →（五）
6. 在一個**不可逆動作**前加核可節點，而且用程式碼擋，不是在 prompt 裡寫「請先確認」 →（六）
7. 在**四個介入點**各放一道 guardrail（輸入、工具呼叫、工具回應、輸出），用合成資料測它們會不會誤擋 →（七）
8. 最後跑一次**藍綠或金絲雀**切換，確認舊版流量能回滾 →（七）

補獨有考點的最短路徑：微軟線用 [Foundry 官方文件](https://learn.microsoft.com/en-us/azure/foundry/)與[多 agent 工作流自動化架構文](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/idea/multiple-agent-workflow-automation)；NVIDIA 線只能買 DLI 課或讀自家產品文件；Claude 線讀 [Agent SDK 文件](https://platform.claude.com/docs/en/agent-sdk/overview)。

## 只讀一份的話，讀哪一份

**[AI-500 的 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)。** 理由是三個：22 條子目標是這五份裡覆蓋最完整的多 agent 檢核表；它是免費公開網頁，不需報名也不需夥伴資格；而且它把很多別家沒命名的東西命名了（四種 context 失效模式、四個 guardrail 介入點、agent replay）。

**但要知道它的偏誤**：整份繞著 Microsoft Foundry，名詞是微軟的。想要中立版本，讀 [NCP-AAI 的十個領域描述](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)——那份只有 7% 綁 NVIDIA 產品，其餘九個領域的措辭可以直接當通用詞彙表用。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| AI-500 狀態 | 仍是 beta，官方部落格寫 GA 預計 2026/10 | 每月 |
| AI-500 四塊權重 | 15-20 / 30-35 / 20-25 / 20-25 | GA 之後 |
| NCP-AAI 報名 | Coming soon，尚未開放 | 每月 |
| NCP-AAI 權重矛盾 | 網頁合計 98%、PDF 合計 92%，兩項數字不同 | 開放報名時 |
| AB-620 / AB-100 權重 | 30-35 / 40-45 / 20-25；25-30 / 25-30 / 40-45 | 每季 |
| CCAR-F 權重 | 27 / 18 / 20 / 20 / 15（Exam Guide v1.0, Effective July 2026） | 每季 |
| A2A 與 MCP 的考法 | 三張微軟證照點名 A2A；NCP-AAI 不指名協定 | 每季 |

## 參考資料

- [AI-500 官方 study guide（四塊權重與 22 條子目標）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [AB-620 官方 study guide（三塊權重，含多 agent 協作四條）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-620)
- [AB-100 官方 study guide（三塊權重與 change log）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)
- [NCP-AAI 官方認證頁（十個領域與權重表）](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)
- [Claude Certified Architect – Foundations 官方認證頁（含 exam guide 下載）](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification)
- [Google Professional ML Engineer 官方考試指南（用來確認它不考多 agent 協調）](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io/)
- [Agent2Agent（A2A）協定官方文件](https://a2a-protocol.org/latest/)
- [用 Agent Framework 建多 agent 工作流自動化方案（微軟架構文）](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/idea/multiple-agent-workflow-automation)
- [Microsoft Foundry 官方文件](https://learn.microsoft.com/en-us/azure/foundry/)
- [Claude Agent SDK 文件](https://platform.claude.com/docs/en/agent-sdk/overview)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [微軟 AI-500 備考路徑](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)
- [NVIDIA NCP-AAI 備考路徑](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide)
- [微軟 AB-620 備考路徑](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide)
- [微軟 AB-100 備考路徑](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide)
- [Claude Certified Architect Foundations 備考指南](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide)
- [Google PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
- [Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer)
- [agent 安全：prompt injection 與信任邊界](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries)
- [多 agent 錯誤傳播與復原](/posts/ai/2026-06-04-multi-agent-error-propagation-recovery)
- [LangGraph agent 編排](/posts/ai/2026-03-27-langgraph-agent-orchestration)
