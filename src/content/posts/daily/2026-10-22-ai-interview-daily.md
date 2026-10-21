---
title: "AI Engineer 面試日練 — 2026-10-22：LLM & Agent Engineering"
date: 2026-10-22
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: zh-TW
description: "今天練 LLM agent 評估怎麼拆解成多個指標，以及 context engineering 裡 compaction 什麼時候真的划算。"
tldr: "agent 一旦串了多個 retriever、sub-agent 跟 tool call，光看最終答案對不對已經不夠；今天練怎麼把評估拆到每個環節，並用一道多工具 agent 評估題練習完整回答。"
series:
  name: "AI Engineer 面試日練"
  order: 64
---

> 🌏 [English version](/posts/daily/2026-10-22-ai-interview-daily-en)

## 今日主題

今天練 LLM & Agent Engineering，這個環節考的核心問題是：當一個系統不再只是「輸入 prompt、拿到一個答案」，而是串了多個 retriever、多個 sub-agent、一串 tool call 之後才產生結果，你要怎麼知道哪裡壞掉、該信任到什麼程度。這類問題常出現在 AI Engineer 的 phone screen 或 onsite 的「你怎麼評估你做的系統」環節，考官真正想聽的不是一個模糊的「我們會做 evaluation」，而是你能不能具體講出評估要拆到哪一層、每一層用什麼指標。

另一個常被考的面向是 context engineering：當 agent 需要長時間運作、上下文越堆越多，什麼時候該把舊內容丟掉或壓縮，什麼時候該靠檢索把東西叫回來。這兩塊今天會一起練。

## 核心概念速記

### 1. Agent 評估要拆成多層，不能只看最終答案

一個複雜的 agent 可能組合多個 retrieval engine、多個 LLM 生成步驟、sub-agent 跟一串 tool call，只看「最終輸出對不對」只能告訴你系統整體有沒有壞，沒辦法定位是哪個環節壞的。正確的拆法是同時看任務完成度（Task Completion）、路徑效率（Step Efficiency）、工具呼叫是否正確（Tool Correctness）、參數是否正確（Argument Correctness）、計畫是否跟著使用者目標走（Plan Adherence），以及安全性指標（偏見、毒性、有害內容）。RAG 相關的指標（答案相關性、忠實度、上下文精準率跟召回率）其實是 agent 評估的子集，不是另一套獨立的東西。

### 2. RAG 的核心心智模型：開卷考試，但考試好不好跟出題品質有關

把 RAG 想成給 LLM 開卷考試而不是閉卷考試：模型手上有真實、相關的檢索內容，比較不容易產生幻覺，找不到答案時也該誠實說找不到。但 2026 年的共識是「要不要用 RAG」已經不是問題，難的是怎麼把它跑好——這代表面試官不會再問你 RAG 的基本定義，而是會往下挖你怎麼挑 improvement 的優先順序、怎麼量化改善的效益。

### 3. Context engineering：compaction 只有壓縮倍率夠高才划算

部分 API 的 cached token 成本可以比一般 token 便宜到 50 倍，這代表把 context 壓縮（compaction）這件事只有在壓縮倍率超過這個門檻、同時不犧牲品質時才真的省錢，否則還不如讓 cache 繼續命中。架構上更關鍵的決定是：把檢索做成 agent loop 裡的一個 tool call，讓 agent 自己決定要不要查、查什麼，而不是在進入迴圈前就把所有資料硬塞進 prompt——這讓 agent 可以動態縮小範圍，而不是每次都處理整包資料。

### 4. Guardrail 調校：漏放跟過度阻擋都是失敗

面試官常用「你怎麼調 guardrail」來測你有沒有實際上線過。正確答案要同時講兩個方向的錯誤：漏放有害內容是安全失敗，但過度阻擋合法請求（把正常問題也擋下來）同樣是產品失敗——過度謹慎不是「安全」，是體驗跟信任度的損失。上線後要同時監控這兩種錯誤率，而不是只看有沒有漏放。

### 5. SFT、RLHF、DPO 三者分工不同，面試常考能不能清楚講出差異

Supervised fine-tuning（SFT）教的是格式跟行為示範——用人類標註的「問題→理想回答」配對去模仿；RLHF 是先用人類偏好資料訓練一個 reward model，再用強化學習去優化 policy，讓模型輸出更符合人類偏好；DPO（Direct Preference Optimization）則是跳過訓練獨立 reward model 這一步，直接用偏好資料優化 policy。一句話版本：SFT 教格式，RLHF／DPO 教偏好。

## 今日練習題

### 題目

你的團隊做了一個客服 agent，它會呼叫多個工具（查訂單系統、查退貨政策的 RAG 檢索、呼叫退款 API），有時候還會把子問題分給一個 sub-agent 處理。上線後使用者抱怨「答案有時候是錯的」，但你只有「最終回答」跟「使用者有沒有抱怨」這兩個訊號。請說明你會怎麼設計一套評估方法，讓你能找出問題到底出在哪一層。

**來源**：改編自 Confident AI「LLM Agent Evaluation Metrics in 2026」部落格文章的評估框架（2026-10-15 發布）　**難度**：中等　**環節**：phone screen / onsite LLM engineering

### 拆解思路

1. **先釐清問題**：先問這個 agent 的典型任務流程長什麼樣（有幾個 tool call、有沒有 sub-agent 分工）、目前有沒有留存完整的執行軌跡（trace）、使用者抱怨的量級跟密度（是零星個案還是某個流程普遍出錯）。
2. **建立框架**：強調「最終答案對不對」只是整體訊號，真正要做的是把評估拆到流程的每一步——retrieval 是否找到對的退貨政策段落、工具呼叫的參數是否正確（查的是不是對的訂單號）、sub-agent 回傳的子結果是否符合主 agent 的意圖、最後生成的答案是否忠實於檢索到的內容。
3. **深入核心**：技術上最關鍵的 trade-off 是評估粒度跟成本的取捨——每一步都上人工標註不現實，所以要分層：高頻但便宜的自動指標（工具呼叫參數是否符合 schema、RAG 的 contextual precision/recall 可以用 LLM-as-judge 自動跑）放在 CI 擋版本更新，高成本的人工抽樣覆核留給真的出問題的 trace 跟定期品質稽核。另一個關鍵點是「歸因」——如果最終答案錯了，要有辦法回溯是 retrieval 環節沒找到對的文件、還是工具呼叫查錯訂單、還是生成環節沒忠實引用檢索到的內容，這需要把每一步的輸入輸出都記錄成完整 trace，而不是只存最終輸出。
4. **收尾**：用具體數字收尾，例如「把評估拆成 retrieval 精準率、工具呼叫正確率、生成忠實度三層之後，發現 80% 的錯誤案例來自工具呼叫查錯訂單號，而不是檢索或生成環節」，讓面試官感覺到你真的用這套框架定位過問題，而不是紙上談兵。

### 範例回答（面試時可以這樣講）

> 我會先把這個 agent 的執行流程拆成三個可觀測的環節：retrieval（查退貨政策）、工具呼叫（查訂單、呼叫退款 API）、生成（組合這些資訊變成最終回答），然後讓系統記錄每一步完整的 trace——不只存最終答案，連中間的檢索結果、工具呼叫參數跟回傳值都存下來。**光有「使用者抱怨」這個訊號是不夠的**，因為它沒辦法告訴我錯誤發生在哪一層。
>
> **評估指標上**我會分層設計：retrieval 層用 contextual precision 跟 recall 去量檢索到的政策段落夠不夠準、夠不夠全；工具呼叫層檢查呼叫的參數是否符合 schema、是否查對了訂單號，這個可以用規則直接檢查，成本很低；生成層則看最終回答是否忠實於檢索到的內容（faithfulness），避免模型自己腦補政策細節。這些自動指標可以放進 CI，每次改動 prompt 或模型版本都先跑一輪回歸測試。
>
> **歸因的部分**是這題真正的難點：我會對真的被使用者抱怨的 trace 做人工抽樣覆核，看是哪一層先出錯——實務上常常發現問題不是出在生成，而是工具呼叫查錯了訂單號、或 retrieval 根本沒找到對的退貨政策段落，生成模型只是忠實地把錯的輸入組成了一個聽起來合理的錯誤答案。找到瓶頸環節之後，修復的優先順序就很清楚了，不會把力氣都花在調 prompt 上。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 指出只看最終答案無法定位問題出在哪一層 | |
| 把評估拆成 retrieval／工具呼叫／生成至少三層分開衡量 | |
| 提到完整記錄執行 trace（不只存最終輸出） | |
| 區分高頻自動指標（CI 擋版本）跟低頻人工覆核（抽樣稽核） | |
| 加分項：提到找到瓶頸環節後修復優先順序隨之清楚 | |

## 延伸閱讀

- [LLM Agent Evaluation Metrics in 2026: Tool Calling, Task Completion, ...](https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide) — 今天核心概念跟練習題的主要來源，完整列出 agent 評估的十多種指標跟分層邏輯
- [Context Engineering in 2026](https://daily.dev/posts/context-engineering-in-2026-louis-fran-ois-bouchard-omar-solano-samridhi-vaid-towards-ai-psjpeinog) — compaction 的成本效益分析、RAG vs GraphRAG vs 長上下文的實測比較
- [GenAI & LLM System Design Interview Guide (2026)](https://prachub.com/resources/genai-llm-system-design-interview-guide-2026) — GenAI system design 面試常考的 RAG pipeline 逐層拆解，適合延伸練習架構類問題

## 參考資料

- [LLM Agent Evaluation Metrics in 2026: Tool Calling, Task Completion, ...](https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide) — 「Agent 評估要拆成多層」核心概念與今日練習題的改編來源
- [RAG Explained Simply and Why Every Engineer Should Understand It](https://dglearning.substack.com/p/rag-explained-simply-and-why-every) — 「RAG 開卷考試」心智模型與 2026 年「怎麼跑好 RAG」趨勢的來源
- [Context Engineering in 2026](https://daily.dev/posts/context-engineering-in-2026-louis-fran-ois-bouchard-omar-solano-samridhi-vaid-towards-ai-psjpeinog) — compaction 成本效益與檢索做成 agent loop tool call 的架構決定
- [AI Engineer Interview Questions (40, With Answer Outlines)](https://copilotinterview.com/blog/ai-engineer-interview-questions) — guardrail 調校（漏放 vs 過度阻擋）與 SFT/RLHF/DPO 分工比較的來源
