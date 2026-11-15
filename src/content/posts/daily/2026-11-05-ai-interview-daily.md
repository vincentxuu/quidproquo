---
title: "AI Engineer 面試日練 — 2026-11-05：LLM & Agent Engineering"
date: 2026-11-05
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: zh-TW
description: "星期四主題 LLM & Agent Engineering：從 OpenAI 公開面試準備資源整理的代表性考題出發，練習怎麼把工具呼叫 agent 從「模型提案就執行」的脆弱迴圈，變成有格式驗證、side-effect 分級與上限控制的可靠系統。"
tldr: "今天的核心是 agent 的工具呼叫迴圈不能只靠模型自律，要把失敗模式拆進程式碼層逐一擋掉：格式驗證、迭代與 token 上限、read／write 分級處理、state 持久化，以及用任務是否達成而非單次呼叫是否正確來評估品質。練習題取自 OpenAI 公開面試準備資源整理的代表性考題（非洩漏題目）：設計一個可靠的工具呼叫 agent，關鍵是先分類失敗模式再逐一解決，而不是信任模型全程會自己判斷對錯。"
series:
  name: "AI Engineer 面試日練"
  order: 78
---

> 🌏 [English version](/posts/daily/2026-11-05-ai-interview-daily-en)

## 今日主題

今天延續 LLM & Agent Engineering，但從上週的「檢索＋權限」切到另一個同樣常被深挖的面向：agent 呼叫外部工具之後，整條迴圈要怎麼不失控。多數候選人準備這類題目時，心裡的模型是「agent 提議呼叫工具→執行→把結果餵回去」，聽起來很簡單，但面試官真正想聽的是這條迴圈在生產環境會在哪些地方壞掉，以及每一個失敗模式對應的具體工程解法——這正是 FDE 跟 applied engineer 職缺面試裡最常被深挖的題型之一。

## 核心概念速記

```diagram
title: Agent 工具呼叫迴圈的五道可靠性關卡
desc: 模型提議的工具呼叫依序通過格式驗證、side-effect 分級、不可逆操作把關、state 與上限檢查，最後依任務是否完成分流成回傳答案或回傳部分進度。
caption: 簡化示意：省略模型重新提案與多輪迭代的細節。
---
<svg viewBox="0 0 640 740">
  <path class="dg-line" d="M320 76V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 196V252" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 316V372" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 436V492" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 556V576"/>
  <path class="dg-line" d="M320 576H148Q140 576 140 584V612" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M320 576H492Q500 576 500 584V612" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="200" y="20" width="240" height="56" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">模型提議工具呼叫</text>

  <rect class="dg-box dg-box--accent" x="200" y="132" width="240" height="64" rx="6"/>
  <text class="dg-label" x="320" y="156" text-anchor="middle" dominant-baseline="central">格式驗證層</text>
  <text class="dg-sub" x="320" y="176" text-anchor="middle" dominant-baseline="central">JSON schema＋重試上限 3 次</text>

  <rect class="dg-box" x="200" y="252" width="240" height="64" rx="6"/>
  <text class="dg-label" x="320" y="276" text-anchor="middle" dominant-baseline="central">Side-effect 分級</text>
  <text class="dg-sub" x="320" y="296" text-anchor="middle" dominant-baseline="central">read 自由重試／write 要 idempotency key</text>

  <rect class="dg-box" x="200" y="372" width="240" height="64" rx="6"/>
  <text class="dg-label" x="320" y="396" text-anchor="middle" dominant-baseline="central">不可逆操作把關</text>
  <text class="dg-sub" x="320" y="416" text-anchor="middle" dominant-baseline="central">退款／刪除／寄信需人工確認</text>

  <rect class="dg-box dg-box--accent" x="200" y="492" width="240" height="64" rx="6"/>
  <text class="dg-label" x="320" y="516" text-anchor="middle" dominant-baseline="central">State 與上限檢查</text>
  <text class="dg-sub" x="320" y="536" text-anchor="middle" dominant-baseline="central">持久化紀錄＋迭代／時間／token budget</text>

  <rect class="dg-box" x="40" y="612" width="200" height="64" rx="6"/>
  <text class="dg-label" x="140" y="636" text-anchor="middle" dominant-baseline="central">任務完成</text>
  <text class="dg-sub" x="140" y="656" text-anchor="middle" dominant-baseline="central">回傳答案＋執行軌跡</text>

  <rect class="dg-box" x="400" y="612" width="200" height="64" rx="6"/>
  <text class="dg-label" x="500" y="636" text-anchor="middle" dominant-baseline="central">達上限未完成</text>
  <text class="dg-sub" x="500" y="656" text-anchor="middle" dominant-baseline="central">回傳部分進度＋原因</text>

  <line class="dg-rule" x1="20" y1="700" x2="620" y2="700"/>
  <text class="dg-tag" x="20" y="724" dominant-baseline="central">圖例</text>
  <rect class="dg-box dg-box--accent" x="76" y="716" width="16" height="16" rx="3"/>
  <text class="dg-small" x="100" y="724" dominant-baseline="central">deterministic 驗證／控制層</text>
  <line class="dg-line dg-line--dashed" x1="340" y1="724" x2="364" y2="724"/>
  <text class="dg-small" x="372" y="724" dominant-baseline="central">達上限的中止路徑</text>
</svg>
```

### 1. Agent 工具呼叫迴圈的五個失敗模式

「模型提議呼叫工具→執行→把結果餵回去」這個天真迴圈，在生產環境會在五個地方壞掉：模型呼叫格式錯誤或幻覺出不存在的參數、任務永遠不終止、工具呼叫有副作用卻沒分級處理、中途重啟後狀態丟失、以及用錄到的單次呼叫正確率誤判整體品質。面試時把答案拆成這五個失敗模式逐一給解法，比籠統講「我會做好錯誤處理」更有說服力。

### 2. Context 跟 Memory 要分開設計：短期用 compact，長期用 store

短期記憶是一次對話或一次執行的狀態，通常靠 checkpointer 存起來做續接跟容錯；長期記憶是該跨任務留存的資訊（使用者偏好、學到的事實），要放進獨立的 store，而不是塞進每次都重送的 context。context window 填滿時的三招是壓縮（summarize 歷史）、把筆記移到視窗外（offload 到檔案或資料庫）、或拆成乾淨歷史的 subagent 處理子任務——三招對應的是不同的資訊保真度跟成本 trade-off，不是互斥的，面試時講清楚什麼情況用哪一招才算到位。

### 3. RAG 跟 fine-tuning 的決策測試：要「知道」還是要「表現」

面對「要不要 fine-tune」的問題，先問這個需求是要模型「知道」新東西，還是要它「表現」不同——前者幾乎都該用 RAG：它處理資料新鮮度（更新索引比重新訓練快）、能依使用者權限過濾檢索結果、還能附引用來源；後者才輪到 fine-tuning，像是固定語氣格式、處理領域術語、或把大模型的行為蒸餾到小模型上省成本。預設順序是先試 prompting，context 塞得下就先塞，不夠才升級到 RAG，行為類需求才考慮 fine-tune。

### 4. 模型升級後「變差了」要當 eval 問題處理，不是吵贏道理

客戶說「新版本變差了」時，不要跟著用印象辯論，要把它變成可驗證的問題：拉出升級前後的生產紀錄，用既有的 eval 集（沒有就現在建一個，抽 50–100 筆近期生產輸入，兩個版本各跑一次輸出）跑兩個版本並按任務類型切分比較——整體打平常常藏著某個子類別真的退步了。評分可以用 LLM-as-judge，但一定要先拿一小批人工標註校準過。同時請客戶給 5–10 個具體失敗案例，往往比籠統印象更快抓到問題模式。

### 5. Prompt injection 沒有完全解，只能縱深防禦加縮小爆炸半徑

誠實的起點是：指令跟資料共用一個通道，目前沒有能完全防住 prompt injection 的方法，所以答案不是找一個濾網，而是分層降低中招機率＋把中招後的代價壓到最低。降低機率靠權限分離（系統提示明確標註檢索內容是資料、不是指令）跟輸入端分類器（有幫助但能被繞過，只能當一層，不能當唯一防線）；真正的安全感在縮小爆炸半徑——工具存取遵循最小權限、憑證按使用者與 session 範圍限制、不可逆或外洩性動作一律卡人工確認、對外連線預設拒絕。設計心態是假設某次一定會被注入成功，讓那次事件的代價低到可接受。

## 今日練習題

### 題目

你要幫一個能呼叫外部工具（function calling）的 agent 設計執行迴圈，讓它可靠到能上線。這個迴圈要擋掉哪些失敗模式，具體怎麼擋？

**來源**：OpenAI 面試準備資源整理（`ombharatiya/AI-Engineer-Interview-Questions`，依公開職缺重點與候選人分享合成的代表性考題，非洩漏題目）　**難度**：進階　**環節**：onsite system design／技術深挖

### 拆解思路

1. **先釐清問題**：問清楚這個 agent 掛了哪些工具、有沒有不可逆操作（退款、刪除、寄信）、任務型態是單輪還是多輪多工具鏈、公司既有的 observability／tracing 基礎設施長怎樣、使用者能不能忍受任務只完成一部分。這些答案決定後面要不要特別強調人工確認跟容錯分級。
2. **建立框架**：把迴圈拆成五層關卡——格式驗證、side-effect 分級、不可逆操作把關、state 持久化、上限與品質衡量，逐層講清楚各自擋的是哪一種失敗模式，不要混在一起講。
3. **深入核心**：技術上最關鍵的 trade-off 是「寬鬆驗證換流暢度 vs 嚴格驗證換可靠性」——格式錯誤要回傳結構化錯誤讓模型自己重試，而不是直接讓程式崩潰，但重試次數要設上限，避免卡在同一個錯誤迴圈裡出不來。第二個 trade-off 是工具數量跟選擇準確率成反比：起手給 agent 的工具集要精簡到剛好夠完成當前任務，不要一次掛上全部工具讓它自己挑。
4. **收尾**：用「把失敗模式分類再逐一解決」收尾，強調這比「信任模型會自己判斷」可靠得多；再補一句——每一步都要留執行痕跡，上線後才查得出是哪個環節壞的，這也是後續 debug 跟評估的基礎。

### 範例回答（面試時可以這樣講）

> 我會先問清楚這個 agent 掛的工具裡有沒有不可逆操作，比如退款、刪除、寄信——這決定我要不要在 write 路徑加人工確認。**架構上**我會把迴圈拆成幾層關卡：模型提議的每個工具呼叫先過 JSON schema 驗證，格式錯誤就把結構化錯誤回傳給模型，讓它自己修正重試，但重試次數設上限（例如 3 次），避免卡在同一個錯誤迴圈；驗證過的呼叫再按 read 跟 write 分流——read 類可以自由重試，write 類一律要求 idempotency key，不可逆的操作則額外卡一道人工確認或政策檢查，不讓 agent 自己決定要不要退款。
>
> **可靠性**的部分，我會把每一步的訊息跟工具結果都持久化，讓流程能從中斷點恢復，而不是整段重放已經執行過的 side effect，這同時也是 debug 時唯一能看懂「它在哪一步出錯」的方式。我還會設硬性的迭代數、時間、token 上限，達上限就回傳目前的進度跟理由，而不是靜默卡死。**評估**上我不會只看單次呼叫格式對不對,而是看任務層級的成功率——這個任務的最終狀態有沒有真的達成——再搭配每個工具自己的錯誤率儀表板,因為工具本身退化通常才是「agent 突然變笨」最常見的原因。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 工具呼叫有沒有先過 schema 驗證，而不是直接信任模型輸出的格式 | |
| 有沒有設迭代次數／時間／token 上限，避免無限迴圈，而不是指望模型自己停下來 | |
| write 類工具是否要求 idempotency key，不可逆操作是否需要人工確認或政策把關 | |
| 每一步 state 有沒有持久化，讓流程能從中斷點恢復而不是重放整段 | |
| 評估是否用任務層級成功率（最終狀態有沒有達成），不只看單次呼叫是否格式正確 | |
| 加分項：提到起手給的工具集要精簡，工具越多 agent 選擇準確率越差 | |

## 延伸閱讀

- [AI-Engineer-Interview-Questions：OpenAI company interview guide](https://github.com/ombharatiya/AI-Engineer-Interview-Questions/blob/main/14-company-interview-questions/openai.md) — 今天練習題跟 RAG vs fine-tuning、eval regression、prompt injection 四個概念的原始來源，附完整拆解跟追問
- [Top 30 AI Agent Developer Interview Questions and Answers (2026) — Second Talent](https://www.secondtalent.com/interview-guide/ai-agent-developers) — 短期／長期記憶分離、context 填滿時的三招應對，有具體框架對照
- [AI Agent Memory: How LLM Agents Manage State in Production — n8n Blog](https://blog.n8n.io/ai-agent-memory-how-llm-agents-manage-state-in-production) — 把短期記憶跟長期記憶的實作細節講得更落地，適合補強第二個核心概念

## 參考資料

- [AI-Engineer-Interview-Questions：OpenAI company interview guide](https://github.com/ombharatiya/AI-Engineer-Interview-Questions/blob/main/14-company-interview-questions/openai.md) — 這份 engineer 面試準備指南整理了今日練習題「設計可靠的工具呼叫 agent」、以及 RAG vs fine-tuning 決策測試、eval regression gate、prompt injection 縱深防禦四個核心概念的來源
- [Top 30 AI Agent Developer Interview Questions and Answers (2026) — Second Talent](https://www.secondtalent.com/interview-guide/ai-agent-developers) — 「短期記憶用 checkpointer、長期記憶用 store」分離概念的來源
- [AI Agent Memory: How LLM Agents Manage State in Production — n8n Blog](https://blog.n8n.io/ai-agent-memory-how-llm-agents-manage-state-in-production) — context window 填滿時「壓縮／offload／subagent」三招應對的補充說明
- [50 LLM Interview Questions and Answers for 2026 — StrataScratch](https://www.stratascratch.com/blog/50-llm-interview-questions-and-answers) — context window 與 KV-cache 記憶體限制的背景補充
