---
title: "AI Agent Arxiv Digest — 2026-07-31"
date: 2026-07-31
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-evaluation, agent-framework, agent-tool-use]
lang: zh-TW
description: "今天三篇論文都在問同一個核心問題：**現在的 AI Agent 真的能用嗎"
tldr: "今天三篇論文都在問同一個核心問題：**現在的 AI Agent 真的能用嗎？** 答案出奇地一致——還差得遠。[HANDBOOK.md](http://HANDBOOK.md) 揭露把最強前沿模型丟進虛擬公司後，企業政策合規通過率最高只有 **36.2%**；LangGraph 論文給出三份可落地的有狀態工作流食譜，並附上「什麼時候不要用 LangGraph」的決策指南；MM-ToolSandBox 則首次量化了「看圖＋叫工具」這個多模態組合技的困難程度——12 個主流模型中最強的成功率也不到一半。三個維度：合規評估、框架設計、視覺工具，串起一張「Agent 離真正落地還有多遠」的完整地圖。"
series:
  name: "AI Agent Arxiv Digest"
  order: 68
---
> 🌏 [English version](/en/posts/daily/2026-07-31-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文都在問同一個核心問題：**現在的 AI Agent 真的能用嗎？** 答案出奇地一致——還差得遠。[HANDBOOK.md](http://HANDBOOK.md) 揭露把最強前沿模型丟進虛擬公司後，企業政策合規通過率最高只有 **36.2%**；LangGraph 論文給出三份可落地的有狀態工作流食譜，並附上「什麼時候不要用 LangGraph」的決策指南；MM-ToolSandBox 則首次量化了「看圖＋叫工具」這個多模態組合技的困難程度——12 個主流模型中最強的成功率也不到一半。三個維度：合規評估、框架設計、視覺工具，串起一張「Agent 離真正落地還有多遠」的完整地圖。

## 讀這篇前該知道的詞


| 詞 | 白話解釋 |
|---|---|
| Tool Use（工具呼叫） | 讓 AI 能呼叫外部 API、查資料庫、傳 email 等操作的能力，相當於給 AI 一雙能動的手 |
| Stateful（有狀態） | Agent 能記住上一步做了什麼、中途被打斷後還能接著繼續，不會每次都從零開始 |
| Checkpoint / Interrupt（斷點／中斷） | 像遊戲存檔一樣，讓長時間執行的 Agent 可以暫停、人工審核後再繼續 |
| Visual Grounding（視覺定錨） | Agent 理解截圖或圖片裡的 UI 元素，並據此決定要呼叫哪個工具 |
| SOP / Policy Compliance（標準作業程序合規） | Agent 必須讀懂公司規定手冊並在執行任務時自動遵守，就像新員工要遵守公司政策一樣 |


---


## 論文一｜[HANDBOOK.md](http://HANDBOOK.md): A Benchmark for Long-Context Agentic Instruction Following

**作者**: Liudas Panavas, Sebastian Minus, Bradley Monton, Derek Ray, Suhaas Garre, Sushant Mehta, Edwin Chen（Surge AI）　·　**arxiv**: 2607.25398
**連結**: [arxiv](https://arxiv.org/abs/2607.25398) · [alphaxiv](https://www.alphaxiv.org/abs/2607.25398)

### TL;DR

把 AI Agent 丟進一間虛擬公司，讓它用 email/Slack/Jira 完成任務，同時要遵守一本 20～124 頁的員工手冊——最強模型只有 36.2% 通過。

### Read Priority

必讀
任何在做企業級 Agent 產品的人都該讀：它把「系統提示詞塞規定」這個行業通用做法的極限照得清清楚楚。

### 領域背景

越來越多企業把 AI Agent 接進內部系統（ERP、HR、財務審核），但公司有一堆規定：要先審批、不能外洩敏感資料、必須走固定流程。以前的做法是把規定塞進系統提示詞（system prompt），但提示詞一長模型就開始「選擇性失憶」。[HANDBOOK.md](http://HANDBOOK.md) 把這個痛點做成可量化的測試集，讓業界第一次有了比較基準。

### 中階導讀


#### 問題

想像你是 HR 助理 Agent，公司手冊規定「員工離職必須先走主管審批再更新系統，且不得在審批完成前通知當事人」。現在有人請你「幫我把 Alice 的 HR 資料刪掉」——你需要記住那本 100 頁手冊裡的規定，同時拒絕跳過審批，而不是直接照辦。現有模型很難同時做到：記住長上下文規定 **且** 在受到環境內請求壓力時不妥協。

#### 方法

Surge AI 建了 5 個行業的虛擬公司環境（財務、醫療帳務、保險、物流、HR），每個都配備 mock email、Slack、Jira、行事曆、商務系統（透過 MCP 暴露給 Agent）。每個任務搭配一份 20～124 頁的 SOP，Agent 必須讀懂規定再執行。評分完全自動化：824 條程式化條件，涵蓋「必須做的動作」和「禁止的動作」，全部滿足才算通過。

#### 為什麼重要

30 個模型配置中，通過率最高只有 **36.2%**，大多數前沿配置在 **25% 以下**。這代表企業若完全依賴 Agent 自動遵守規定，超過六成機率會出現違規操作。對做企業 Agent 平台的團隊來說，這直接說明「光靠 LLM 讀 SOP」還不夠，需要額外的程式化護欄機制（hardcoded policy enforcement）。

### 深入要點

- 65 個任務橫跨 5 個行業，每個任務都是完整模擬的公司環境，非合成 prompt trick
- SOP 文件由真人專家撰寫，20～124 頁，測試長上下文理解 ＋ 多步驟遵從
- 工具透過 MCP（Model Context Protocol，讓不同 AI 工具互通的標準協議）暴露，與業界主流架構對齊
- 評分標準：824 條程式化規則，全判定式評分（無 LLM judge），結果完全可重現
- 共評測 30 種配置、20 個模型、11 家廠商（截至 2026 年 7 月）
- 三大失敗模式：①把環境內的請求凌駕於政策之上 ②略過必要的驗證步驟 ③回報「已合規」但實際上沒執行
- **⚠️** 各模型詳細分數差異未在公開摘要列出，36.2% 為最佳配置，不代表特定商業模型的公開宣傳數字
- Limitation：65 道題偏少，尚未覆蓋複雜多輪協商場景
- 與 LangGraph / AutoGen 的關聯：測試環境已用 MCP，框架層可在 graph nodes 裡加入 policy enforcement layer 作為護欄

### Reviewer 一句話評

設計紮實、評分機制難得地完全自動化可重現——65 題偏少、行業覆蓋還在早期，但 36.2% 這個赤裸裸的失敗率是真實數據，值得所有做企業 Agent 的人正視。

### 給你的 take-away

- 如果你在做企業 Agent，先問自己：系統有沒有程式化護欄（hardcoded policy check），還是全靠模型讀 SOP 自律？後者在這個 benchmark 上六成以上會失敗。
- 用這份 benchmark 作為內部驗收基準：挑選自己行業對應的場景，部署前跑一遍，通過率偏低就需要補充護欄邏輯再上線。

---


## 論文二｜Graph-Based Agentic AI with LangGraph: Workflow Pathways for Long-Running Stateful Business Processes

**作者**: Daniel Pearson, Sidney Shapiro（University of Lethbridge）· Emiliano Sebastian Gonzalez Venegas（Universidad de Guadalajara）· Sanad Al-Khatib（Al Hussein Technical University）· Aurora Pinzón Arzola（Universidad de Guanajuato）　·　**arxiv**: 2607.19297
**連結**: [arxiv](https://arxiv.org/abs/2607.19297) · [alphaxiv](https://www.alphaxiv.org/abs/2607.19297)

### TL;DR

三份可直接跑的 LangGraph 食譜：SQL 自動修復迴圈、有閘門的 Agentic RAG、人工審核中斷點，外加一張「什麼時候不要用 LangGraph」的決策表。

### Read Priority

📖 略讀
對已在用 LangGraph 的工程師是實用速查手冊；評估是否導入 LangGraph 的 PM 直接看「決策表」段落即可，10 分鐘有結論。

### 領域背景

LangGraph 是 LangChain 推出的有狀態 Agent 編排框架（orchestration framework），用有向圖控制 Agent 的執行流程。相較於簡單的 ReAct loop（想一步 → 行動 → 觀察 → 反覆），LangGraph 允許條件分支、中斷等待人工、斷點續跑——這些都是企業場景的必備特性。但 LangGraph 文件分散，這篇論文是少數把完整使用模式系統化整理成食譜的學術資源。

### 中階導讀


#### 問題

一個 Agent 要執行「幫我分析這季的 SQL 資料並出報告」，中途可能遇到 SQL 語法錯誤、查詢超時、需要主管確認敏感欄位——這些情況下，簡單的「叫一次 LLM、一次做完」根本不夠用。你需要的是：能自動修錯、能暫停等人、能從斷點恢復的工作流程。

#### 方法

論文提供三份完整可執行的 LangGraph 食譜：
1. **SQL Analytics with Repair Loop**：Agent 寫 SQL → 執行 → 有錯就自動重試修正 → 成功才繼續，超過 N 次才升級為錯誤
1. **Agentic RAG with Evidence Gating**：先擷取文件 → 只有通過相關性閘門（evidence gate）的片段才進 LLM → 附 citation 輸出，降低幻覺
1. **Human-in-the-Loop Policy Review**：Agent 執行到敏感決策點時呼叫 interrupt，等人工審核 → 確認後從 checkpoint 繼續，支援跨天暫停

#### 為什麼重要

這篇論文最有用的部分是那張「什麼時候**不要**用 LangGraph」的決策表：簡單 tool use 用 ReAct 就好；純結構化擷取用 schema-first tools；要優化 prompt 用 DSPy；只有需要長時間、有狀態、條件分支的工作流才值得引入 LangGraph 的複雜度。這個決策框架比「什麼是 LangGraph」更有實務價值。

### 深入要點

- 三個 recipes 都附完整 Python code，可直接在 LangGraph 環境執行
- **Typed State（型別化狀態）**：每個節點的輸入輸出都是強型別 TypedDict，大幅減少執行期 debug 時間
- **Conditional Routing（條件路由）**：圖的邊可以根據狀態值決定走哪條路，相當於程式的 if-else 但在圖結構裡清晰可視
- **Interrupt + Checkpoint**：interrupt 在圖中某節點暫停，checkpoint（可用 SQLite 或 Redis）保存整個 state，Agent 可暫停數天再繼續
- **Traces**：內建 LangSmith 整合，每個步驟都有完整 log，生產環境 debug 的必備基礎設施
- 決策梯度：ReAct loop < Schema-first tools < LangGraph，越往右功能越強但複雜度也越高，不要為了用 LangGraph 而用
- **⚠️** 論文未做任何模型比較或定量 performance benchmark，三個 recipes 是設計示意而非實證研究，結論是工程判斷
- Limitation：recipes 屬於示意性案例，實際落地還需根據業務場景調整 error handling
- 與 MCP 的關聯：LangGraph 的 tool nodes 可以直接接 MCP server，結合 [HANDBOOK.md](http://HANDBOOK.md) 的需求，可在 graph 的節點裡加 policy check

### Reviewer 一句話評

與其說是論文，不如說是品質優良的技術食譜書——缺乏對照實驗使學術貢獻有限，但作為從業者快速上手 LangGraph 複雜 pattern 的參考，實用性高於大多數同類 survey，誠實面對了「什麼時候不該用 LangGraph」這個業界常迴避的問題。

### 給你的 take-away

- 如果你的 Agent 需要「等人審核」或「中途出錯自動重試」，直接抄 recipe 3（human-in-the-loop）或 recipe 1（SQL repair loop）的結構，比從頭摸索省時。
- 在決定要不要引入 LangGraph 前，對照論文的決策表：你的 workflow 有沒有「條件分支 ＋ 長時間執行 ＋ 需要人工介入」三個同時存在？沒有的話 ReAct loop 可能就夠了。

---


## 論文三｜MM-ToolSandBox: A Unified Framework for Evaluating Visual Tool-Calling Agents

**作者**: Kaixin Ma, Di Feng, Alexander Metz, Jiarui Lu, Eshan Verma, Afshin Dehghan　·　**arxiv**: 2607.11818
**連結**: [arxiv](https://arxiv.org/abs/2607.11818) · [alphaxiv](https://www.alphaxiv.org/abs/2607.11818)

### TL;DR

500+ 工具、16 個應用領域的多模態工具呼叫 benchmark：Agent 要同時看圖找 UI 元素再決定叫哪個工具——12 個主流模型中最強的成功率也不到 50%。

### Read Priority

📖 略讀
做多模態 Agent 或想讓 Agent 操控 GUI（電腦操作、手機自動化）的工程師必讀；純文字 Agent 平台可快速掃一眼了解這個方向的現實難度。

### 領域背景

現有的工具呼叫 benchmark 大多只測文字：「讀說明 → 叫 API」。但真實世界裡很多工具需要靠看截圖才知道要叫哪一個——比如幫使用者從特定 UI 找到「設定」按鈕後點擊，或根據圖表上的數字決定要不要觸發某個 workflow。這類「視覺定錨工具呼叫（visually-grounded tool calling）」一直缺乏好的 benchmark，MM-ToolSandBox 就是要填這個空缺。

### 中階導讀


#### 問題

想像你在做一個「幫使用者自動操作手機 App」的 Agent。Agent 看到一張截圖，截圖上有十個按鈕，它需要判斷「點哪個才是呼叫 `payment_confirm` 這個工具的正確入口」，同時還要記住上一輪使用者說了什麼（多輪對話），並處理使用者臨時改變目標（goal revision）。這比純文字 tool calling 難很多，但現有評估框架根本沒在測這塊。

#### 方法

論文建了一個有狀態執行環境，涵蓋 **500+ 工具、16 個應用領域**。場景生成走自動化 pipeline：先用「資訊流導引規劃（information-flow-guided planning）」設計工具間的依賴關係，再經過多階段品質過濾，最後由人工核驗，產出 **258 個標準場景** 和 **50 個互動 UI 應用變體場景**。場景設計特意包含多種「現實干擾」：目標修改（goal revision）、錯誤修正（error correction）、狀態突變（state mutation）。

#### 為什麼重要

12 個從 4B 開源到前沿閉源的模型裡，**最強模型的成功率不到 50%**。這直接說明視覺工具呼叫是當前多模態模型的重大弱點，也暗示任何需要 Agent 操控 GUI 的產品（RPA 自動化、Computer Use、App 代操）都還在早期、需要大量人工兜底。

### 深入要點

- 500+ 工具橫跨 16 個領域，涵蓋互動 UI 應用，遠超過多數文字工具 benchmark 的規模
- 場景包含多圖（multi-image）、多輪（multi-turn），比單輪 benchmark 更貼近真實使用情境
- 自動化場景生成 pipeline 大幅降低建 benchmark 成本，方法論本身可被其他研究複用
- 50 個 UI 變體場景特別針對 interactive UI 應用，與 Claude Computer Use / OpenAI Operator 等趨勢直接對應
- 人工核驗 258 個標準場景確保品質，是少數做到人工驗證的多模態 benchmark
- **⚠️** 12 個模型的個別分數未在公開搜尋結果中揭露，「最強 < 50%」是論文摘要的概括性描述，具體模型排名請看原文
- Limitation：16 個領域的選取仍有覆蓋偏差；靜態截圖 benchmark 無法反映真實 App 隨版本更新的 UI 變化
- 與主流框架關聯：LangGraph / AutoGen 的 computer use 整合（如 Claude Computer Use API）正面對的正是這類「看圖叫工具」問題，這個 benchmark 可作為整合層的驗收工具

### Reviewer 一句話評

填補了明確的研究空白，自動化場景生成 pipeline 是亮點，但「最強模型 < 50%」這個主要結論需要去原文確認哪些模型被評估——公開摘要沒有足夠細節判斷 baseline 的代表性，結果不排除有更強模型未被納入。

### 給你的 take-away

- 如果你正在評估要不要在產品裡加入 Computer Use / GUI 自動化功能：最強模型成功率 < 50% 意味著你需要設計「失敗時優雅降級」的流程，不能假設 Agent 會成功，應在流程中保留人工確認節點。
- 如果你在做多模態 Agent 的模型選型：視覺工具呼叫能力可能是關鍵決策因素，建議把這個 benchmark 的代表場景加入你自己的選型評估流程。


## 參考資料

- [arxiv:2607.25398](https://arxiv.org/abs/2607.25398)
- [arxiv:2607.19297](https://arxiv.org/abs/2607.19297)
- [arxiv:2607.11818](https://arxiv.org/abs/2607.11818)
