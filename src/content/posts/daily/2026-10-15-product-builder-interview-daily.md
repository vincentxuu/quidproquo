---
title: "Product Builder 面試日練 — 2026-10-15：AI Product Design"
date: 2026-10-15
category: daily
type: digest
tags: [product-builder-interview, daily, ai-product]
lang: zh-TW
description: "星期四輪到 AI Product Design——AI 功能的「好」要先寫成 eval，才有上線門檻可談；練一題 Perplexity 的真實面試題：agent 幫使用者省時間，但 5–10% 的 session 會做錯動作，怎麼定品質與上線門檻。"
tldr: "今天練 AI 產品的品質定義：AI PRD 比一般 PRD 多六段，其中 eval 計畫就是驗收標準；eval 從讀真實 trace 做錯誤分析開始，依「次數 × 對客戶的代價」排序，只替前幾名錯誤寫 eval，檢查方式從最便宜的 code assertion 開始；上線門檻要在看到結果前先寫好，而且分成「零容忍」與「可接受比例」兩類。練習題是 AllthingsPM 題庫收錄的 Perplexity 題，案例是 Intercom Fin 把計費單位從 resolution 改成 outcome。"
series:
  name: "Product Builder 面試日練"
  order: 57
---

> 🌏 [English version](/posts/daily/2026-10-15-product-builder-interview-daily-en)

## 今日主題

星期四輪到 AI Product Design。前幾次練過自主性階梯、信任校準和人機任務分配，講的是「AI 該做多少」。今天練的是更早的一步：AI 的輸出每次都不一樣，PM 要怎麼定義「這個功能夠好了，可以上線」？AI PM 面試裡，eval 與上線門檻已經常常取代或延伸傳統的 metrics 環節，答不出具體門檻，前面設計講得再漂亮也會被追問到卡住。

## 核心框架速記

### AI PRD：一般 PRD 加六段

一般 PRD 有問題、使用者、範圍、成功指標。AI 功能的 PRD 要再加六段：

| 段落 | 要回答的問題 |
|---|---|
| 要不要用 AI | 固定 workflow 夠不夠？為什麼一定要模型？ |
| 失敗模式與風險清單 | 會錯在哪？錯了誰受傷、多嚴重？ |
| 分層防護 | 輸入、輸出、動作各怎麼擋？ |
| 轉人工的條件 | 哪些情況一定交給人？ |
| eval 計畫 | 用什麼測試集、什麼通過標準驗收？ |
| 三層成功指標 | 模型品質、使用者行為、商業結果，加上成本與延遲上限 |

重點是第五段：eval 計畫就是驗收標準，不是上線後才補的監控。

### 錯誤分析優先：先讀 trace，再寫 eval

1. **讀真實輸出**：至少讀 30–50 筆真實 trace，每筆寫一句哪裡錯。
2. **分類排序**：替錯誤分類，用「出現次數 × 對客戶的代價」排序，這一輪只處理前三名。
3. **配對檢查方式**：能用規則判斷的用 code assertion；有標準答案的用 golden dataset；需要語意判斷的才用 LLM-as-judge；再加上重新生成、手動修改這類使用者行為訊號。從最便宜的開始，先篩掉再交給貴的。

常見錯誤是一開始就建 LLM judge，結果分數量不到真正的問題。

## 今日練習題

### 題目

一個電腦操作 agent 確實幫使用者省下時間，但在 5% 到 10% 的 session 裡會做錯動作。請定義品質標準與上線門檻。

（來源：AllthingsPM 題庫收錄的 Perplexity AI PM 面試題）

### 拆解思路

1. **釐清問題**：「做錯動作」是哪一種？點錯按鈕重來就好，還是送出表單、付款、寄信這種收不回的動作？錯誤在哪些任務類型集中？使用者有沒有發現並糾正？
2. **定義使用者**：分成願意盯著畫面的重度使用者，和交辦後就離開的使用者。後者看不到錯誤，代價高很多。
3. **結構化分析**：把錯誤按「可逆性 × 影響」分類，配上錯誤分析的排序方式。5–10% 是平均數，要拆開看每一類各佔多少。
4. **提出方案**：門檻分兩類。收不回的動作是零容忍，靠產品設計擋（動作前確認、權限限制）；可逆的錯誤給一個可接受比例，並要求使用者看得到、改得掉。
5. **定義成功**：每次成功任務省下的時間、需要人工修正的比例、零容忍類別的事故數，以及使用者交辦後的回訪率。

### 範例回答（面試時可以這樣講）

> **先拆開 5–10%。** 我不會直接回答「錯誤率要降到幾 %」，因為平均數會把兩種完全不同的錯混在一起。我會先讀最近 50 筆出錯的 session，把錯誤分成可逆與不可逆，再看各自集中在哪些任務。假設 8% 裡有 1% 是送出表單或付款這類收不回的動作，剩下 7% 是點錯、填錯後自己重來，這兩類要分開定門檻。
>
> **門檻在看結果前先寫好。** 不可逆的動作是零容忍：上線條件是 eval 集裡這一類 0 件，而且產品上一律在送出前停下來給使用者確認，不靠模型自己判斷。可逆的錯誤我會給一個比例，例如 eval 集上低於 5%，同時要求每個動作都顯示在畫面上、可以一鍵復原。eval 集從真實 session 抽，不用工程師自己編的情境。
>
> **上線後看三個數字。** 每次成功任務省下的時間要高於使用者花在修正上的時間；需要人工介入的比例逐週下降；零容忍類別一旦發生就自動降級成「每步都確認」模式。這樣門檻不只是上線那一刻的關卡，也是之後放寬或收緊自主性的依據。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先把平均錯誤率拆成不同類別 | |
| 用可逆性與影響決定門檻類型 | |
| 不可逆動作零容忍，靠產品設計擋 | |
| eval 集來自真實 session，門檻事先寫好 | |
| 上線後的指標與自動降級機制 | |
| 加分：把門檻連到自主性放寬或收緊 | |

## 今日案例

**Intercom Fin：計費單位從 resolution 改成 outcome**

Intercom 一開始用「Fin 自己完整解決對話」當成功定義，也照這個收費：解決了才付錢。這讓客戶能直接比較 AI 和真人客服的成本，目前有 12,000 多個團隊使用，平均解決率 76%。但 Fin 接手退訂、交易爭議、帳單這類流程以後，很多對話依客戶的政策本來就要交給真人確認，舊定義會把這些都算成失敗。Intercom 於是改成「outcome」：Fin 完成它被設定要做的動作就算數，完整解決只是其中一種。

**面試連結**：回答「怎麼定義 AI 功能的成功」時，這個案例說明成功定義本身就是產品決策。定義太窄，會逼產品追求不該追求的全自動；定義太寬，指標會失去意義。好答案要說清楚自己選的定義會鼓勵什麼行為。

## 延伸閱讀

- [The AI PRD: A Template With Risks, Guardrails, and Success Metrics](https://allthingspm.app/blog/the-ai-prd) — AI PRD 多出的六段逐段範本
- [The AI Eval Starter Kit: Six Templates, Error Analysis to Gate](https://falkster.com/blog/ai-eval-starter-kit) — 從錯誤分析紀錄一路到上線門檻的六個模板
- [AI PM Interview Questions and Answers (2026)](https://allthingspm.app/blog/ai-pm-interview-questions) — AI PM 面試各環節考什麼，以及 Anthropic、OpenAI、Perplexity 等公司的真實題目

## 參考資料

- [The AI PRD — AllthingsPM](https://allthingspm.app/blog/the-ai-prd) — 核心框架：AI PRD 六段
- [The AI Eval Starter Kit — Falkster](https://falkster.com/blog/ai-eval-starter-kit) — 錯誤分析優先、依次數 × 代價排序、先別建 judge
- [Teresa Torres's Three Steps for AI Evals — Falkster](https://falkster.com/answers/what-is-teresa-torres-three-step-approach-to-ai-evals) — 錯誤配對檢查方式、從最便宜的開始
- [AI PM Interview Questions and Answers (2026) — AllthingsPM](https://allthingspm.app/blog/ai-pm-interview-questions) — AI Product Design 練習題來源（Perplexity）與 eval 環節取代 metrics 環節的說明
- [From resolutions to outcomes — Intercom](https://www.intercom.com/blog/from-resolutions-to-outcomes-evolving-how-fin-delivers-value/) — 今日案例
