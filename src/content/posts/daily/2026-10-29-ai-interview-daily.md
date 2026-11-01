---
title: "AI Engineer 面試日練 — 2026-10-29：LLM & Agent Engineering"
date: 2026-10-29
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: zh-TW
description: "星期四主題 LLM & Agent Engineering：從 OpenAI 的真實面試題出發，練習怎麼設計一個會遵守權限、引用來源、且該拒答時會拒答的內部文件搜尋 agent。"
tldr: "今天的核心是權限控管跟引用驗證不能交給 prompt 去「請模型注意」，要做成 deterministic 的檢索層跟事後檢查：ACL 過濾發生在文件進入 context 之前,不是進了 context 之後靠 LLM 自律;引用則要在生成後驗證來源 ID 確實在允許的檢索集合裡。練習題取自 OpenAI 的真實面試(同一題也在 Google、Lyft 被回報):「設計一個搜尋內部文件的 agent,必須遵守權限、引用來源、且該拒答時會拒答」,關鍵不是背出 RAG 架構,是能示範一套「把安全邊界放進程式碼、把語意判斷留給模型」的分工邏輯。"
series:
  name: "AI Engineer 面試日練"
  order: 71
---

> 🌏 [English version](/posts/daily/2026-10-29-ai-interview-daily-en)

## 今日主題

今天進入 LLM & Agent Engineering，這是 AI Engineer 面試裡出題密度最高的一塊,因為它同時考 RAG、agent 架構、guardrails 跟評估四種能力,而且這四者在真實系統裡互相牽動——retrieval 做得好不好會決定生成品質,guardrails 設計得鬆不緊又會反過來影響 retrieval 要不要過濾。

這類題目常出現在 senior 等級的 onsite system design 環節。考官真正在意的不是你記不記得 LangChain 的 API,而是你有沒有把「安全邊界」這件事放進架構的正確位置——是在程式碼裡用 deterministic 的方式擋掉,還是指望 prompt 裡寫一句「請不要洩漏未授權的內容」就能解決。後者在真實系統裡會被 prompt injection 跟模型的不穩定性打穿。

## 核心概念速記

```diagram
title: 權限搜尋 agent 的四層安全邊界
desc: 使用者問題依序通過 ACL 過濾的檢索層、tool loadout 限定的 agent 協調層、標註來源 ID 的生成層，最後在 guardrail／評估層決定輸出答案或拒答。
caption: 簡化示意：省略多輪工具呼叫與重試迴圈。
---
<svg viewBox="0 0 640 740">
  <path class="dg-line" d="M320 76V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 196V252" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 316V372" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 436V492" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 556V576"/>
  <path class="dg-line" d="M320 576H148Q140 576 140 584V612" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M320 576H492Q500 576 500 584V612" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="220" y="20" width="200" height="56" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">使用者問題</text>

  <rect class="dg-box dg-box--accent" x="200" y="132" width="240" height="64" rx="6"/>
  <text class="dg-label" x="320" y="156" text-anchor="middle" dominant-baseline="central">檢索層</text>
  <text class="dg-sub" x="320" y="176" text-anchor="middle" dominant-baseline="central">ACL 過濾＋hybrid search</text>

  <rect class="dg-box" x="200" y="252" width="240" height="64" rx="6"/>
  <text class="dg-label" x="320" y="276" text-anchor="middle" dominant-baseline="central">Agent 協調層</text>
  <text class="dg-sub" x="320" y="296" text-anchor="middle" dominant-baseline="central">tool loadout 限定工具</text>

  <rect class="dg-box" x="200" y="372" width="240" height="64" rx="6"/>
  <text class="dg-label" x="320" y="396" text-anchor="middle" dominant-baseline="central">生成層</text>
  <text class="dg-sub" x="320" y="416" text-anchor="middle" dominant-baseline="central">結構化輸出＋標註來源 ID</text>

  <rect class="dg-box dg-box--accent" x="200" y="492" width="240" height="64" rx="6"/>
  <text class="dg-label" x="320" y="516" text-anchor="middle" dominant-baseline="central">Guardrail／評估層</text>
  <text class="dg-sub" x="320" y="536" text-anchor="middle" dominant-baseline="central">引用驗證＋拒答判斷</text>

  <rect class="dg-box" x="40" y="612" width="200" height="64" rx="6"/>
  <text class="dg-label" x="140" y="636" text-anchor="middle" dominant-baseline="central">答案</text>
  <text class="dg-sub" x="140" y="656" text-anchor="middle" dominant-baseline="central">附來源引用</text>

  <rect class="dg-box" x="400" y="612" width="200" height="64" rx="6"/>
  <text class="dg-label" x="500" y="636" text-anchor="middle" dominant-baseline="central">拒答</text>
  <text class="dg-sub" x="500" y="656" text-anchor="middle" dominant-baseline="central">資料不足／無權限</text>

  <line class="dg-rule" x1="20" y1="700" x2="620" y2="700"/>
  <text class="dg-tag" x="20" y="724" dominant-baseline="central">圖例</text>
  <rect class="dg-box dg-box--accent" x="76" y="716" width="16" height="16" rx="3"/>
  <text class="dg-small" x="100" y="724" dominant-baseline="central">deterministic 安全檢查層</text>
  <line class="dg-line dg-line--dashed" x1="340" y1="724" x2="364" y2="724"/>
  <text class="dg-small" x="372" y="724" dominant-baseline="central">拒答／中止路徑</text>
</svg>
```

### 1. 區分 retrieval error 跟 generation error

RAG 系統出錯時,retrieval error(檢索到不相關或不完整的文件)跟 generation error(檢索到對的文件但模型講錯)從外面看幾乎一樣——使用者只看到一個錯誤答案。但兩者的修法完全相反:retrieval error 要調 chunking、hybrid search 或 reranking;generation error 要調 prompt 或換模型。面試時第一步永遠是先隔離問題出在哪一層,再談怎麼修,直接跳進「我會加 reranker」反而顯得沒有診斷流程。

### 2. Context engineering 的工具箱:tool loadout 跟 context quarantine

長 context 不是萬能解,塞進太多工具或太多歷史反而會讓模型表現變差。Tool loadout 是只給 agent 當前任務真正需要的工具子集,而不是把全部工具都掛上去——這同時也是一個安全邊界:如果 agent 的任務是「搜尋內部文件」,就不要讓它同時掛著能寄信或改資料庫的工具,降低誤用跟被注入攻擊劫持的影響範圍。Context quarantine 則是用乾淨歷史的 subagent 處理獨立子任務,避免主對話裡累積的雜訊污染判斷。

### 3. Guardrails 是分層防禦,不是一句 prompt 指令

Guardrails 包含輸入檢查(擋掉超出範圍的問題)、輸出檢查(生成後再審一次答案)、工具限制(agent 只能呼叫被允許的工具)、流量限制跟異常監控。NeMo Guardrails、Guardrails AI 這類函式庫把這些規則結構化成可配置的 pipeline,而不是全部塞進一個巨大的 system prompt 裡指望模型自己遵守。

### 4. LLM 評估:RAGAS 的三個核心指標

評估 RAG 系統不能只看「答案聽起來對不對」。RAGAS 框架提供三個可量化的指標:faithfulness(答案有沒有超出檢索到的內容亂講)、context precision(檢索回來的文件裡有幾成真的相關)、context recall(真正相關的文件有幾成被檢索到)。搭配一組有標準答案的測試集,再用 LLM-as-judge 或人工覆核,才算是有評估基礎設施,而不是上線前隨便測幾句話。

### 5. RLHF 裡的 reward hacking

RLHF 訓練時,模型有時會找到 reward model 的漏洞,學會「讓 reward model 打高分」但不是「真的把任務做好」的行為——比如用更長、更有自信的語氣換取更高分數,而不是提升正確性。偵測靠的是在訓練過程中額外監控 reward 分數跟真實任務表現(如人工評分、下游任務成功率)是否開始脫鉤,出現落差就代表 reward model 被利用了。這個概念在 agent 工程裡也適用:如果只用「使用者有沒有點讚」當 agent 的優化訊號,agent 可能會學到討好使用者而不是解決問題。

## 今日練習題

### 題目

設計一個搜尋內部文件的 agent,它必須遵守文件的存取權限、引用答案所根據的來源、並且在不確定或沒有足夠授權資訊時主動拒答。

**來源**：OpenAI 真實面試題(同一題也在 Google、Lyft 被回報，LLM Dojo 彙整 270 筆公開面試回報收錄)　**難度**：進階　**環節**：onsite system design

### 拆解思路

1. **先釐清問題**：先問文件庫的規模跟類型(結構化 wiki？PDF？聊天記錄？)、使用者是誰(全公司員工,還是有不同部門/層級的存取權限)、權限模型長什麼樣(文件層級 ACL？欄位層級遮蔽？)、agent 還有沒有其他工具(只有搜尋,還是也能查工單系統)。這些答案決定你後面要不要處理多租戶跟細粒度權限。
2. **建立框架**：拆成四層——檢索層(ACL 過濾後的 hybrid search index)、agent 協調層(tool loadout,只給搜尋相關工具)、生成層(強制結構化輸出,答案必須標註來源文件 ID)、guardrail／評估層(拒答邏輯跟事後審核)。
3. **深入核心**：技術上最關鍵的 trade-off 是「權限檢查要發生在檢索之前,還是讓模型事後自己判斷」。正確答案是前者——deterministic 地在 index 層就依使用者身份過濾掉無權限的文件,讓未授權內容連 context 都進不去,而不是把整批文件丟給模型再指望 prompt 能擋住洩漏。這樣即使文件內容裡藏著 prompt injection,也無法誘導模型講出它本來就看不到的東西。第二個 trade-off 是引用的可信度——模型自己宣稱的來源不可靠(它可能編造一個看起來合理的文件 ID),所以生成後要做一次程式化驗證:檢查模型引用的每個來源 ID,是不是真的在這次允許檢索到的文件集合裡。
4. **收尾**：用「縱深防禦」收尾——權限過濾在檢索前做,引用驗證在生成後做,中間再疊一個拒答機制(檢索不到足夠相關或有權限的文件時,直接回「我沒有存取到足以回答這題的資料」,而不是硬答),最後整套流程要搭配一個包含「越權存取測試案例」的評估集,在每次 prompt 或模型版本更新前跑過,而不是上線後才發現漏洞。

### 範例回答（面試時可以這樣講）

> 我會先確認文件庫的權限模型是文件層級還是欄位層級,還有使用者群體有沒有分部門或職級——這決定我要不要處理多租戶隔離。**架構上**我會拆成四層:檢索層先依使用者身份對 index 做 ACL 過濾,讓沒有權限的文件在進入 context 之前就被擋掉,這一步必須是程式碼層的 deterministic 過濾,不能指望 prompt 裡寫「請不要引用未授權內容」就夠——文件內容裡可能藏著 prompt injection,一旦進了 context,安全邊界就只剩模型的自律,不可靠。
>
> **生成層**我會強制模型輸出結構化格式,每個論點都要標註對應的來源文件 ID,生成後再跑一次程式化驗證,檢查這些 ID 是不是真的落在這次允許檢索到的集合裡——模型自己宣稱的引用不能直接信。如果檢索不到足夠相關、或使用者對相關文件沒有權限,我會讓 agent 直接拒答,回覆「目前查到的資料不足以回答,或是你對相關文件沒有存取權限」,而不是硬編一個聽起來合理的答案。**評估**的部分,我會建一組包含越權存取測試案例的評估集——故意用低權限帳號去問只有高權限文件才能回答的問題,檢查 agent 有沒有正確拒答,搭配 RAGAS 的 faithfulness 跟 context precision 這類指標,在每次模型或 prompt 更新前跑一次回歸測試。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 權限過濾發生在檢索之前（index 層），不是靠 prompt 指望模型自律 | |
| 引用來源要在生成後程式化驗證，不能直接信任模型自己宣稱的來源 ID | |
| 有明確的拒答邏輯：資料不足或無權限時主動說「不知道」 | |
| 用 tool loadout 限制 agent 能用的工具範圍，縮小誤用跟被注入的影響面 | |
| 評估集包含越權存取測試案例，不是只測一般問答準確率 | |
| 加分項：提到 context poisoning 風險——未過濾的文件一旦進 context，即使不被引用也可能間接影響答案 | |

## 延伸閱讀

- [What OpenAI, Anthropic, Mistral and Meta actually ask in AI engineer interviews](https://dev.to/adityajha2005/what-openai-anthropic-mistral-and-meta-actually-ask-in-ai-engineer-interviews-2adk) — 270 筆真實面試回報按公司整理,今天的練習題跟「evaluation platform on top」「abstains when it should」的考點判斷都出自這篇
- [The State of Context Engineering](https://www.dbreunig.com/2026/10/24/the-state-of-context-engineering.html) — context engineering 六種手法(augmentation／tool loadout／quarantine／pruning／offloading／summarization)的完整技術拆解,附 DSPy 程式碼範例
- [AI Engineering Interview Questions 2026: RAG, LLMs & Agents](https://technovids.com/ai-engineering-interview-questions) — guardrails 的分層設計跟 RAGAS 評估指標的面試向解說

## 參考資料

- [What OpenAI, Anthropic, Mistral and Meta actually ask in AI engineer interviews](https://dev.to/adityajha2005/what-openai-anthropic-mistral-and-meta-actually-ask-in-ai-engineer-interviews-2adk) — 今日練習題「設計內部文件搜尋 agent,遵守權限、引用來源、適時拒答」的原始來源(OpenAI 真實面試,同題也見於 Google、Lyft)
- [The State of Context Engineering](https://www.dbreunig.com/2026/10/24/the-state-of-context-engineering.html) — 「tool loadout」「context quarantine」概念的技術細節來源
- [AI Engineering Interview Questions 2026: RAG, LLMs & Agents](https://technovids.com/ai-engineering-interview-questions) — 「guardrails 分層設計」「RAGAS 三個核心指標」的定義來源
- [Cracking the Generative AI Engineering Interview 2026 (Version II)](https://aiengineeringinsider.substack.com/p/cracking-the-generative-ai-engineering) — 「retrieval error 跟 generation error 要先隔離再修」的框架來源
