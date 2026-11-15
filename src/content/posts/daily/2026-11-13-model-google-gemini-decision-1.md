---
title: "模型卡｜Gemini Decision 1"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: zh-TW
description: "Google 推出全新「決策模型」Gemini Decision 1 與 Decisions API——不產生文字，單次 forward pass 對最多 1000 個是非/選擇/評分題打分，零輸出 token 計費、150–250ms 延遲"
tldr: "Gemini Decision 1（gemini-decision-1）：262,144 tokens context、$0.10 per 1M input、零輸出計費，單次請求最多評 1000 題是非/選擇/評分題，官方自測 JevBench 達 92.2% 領先 GPT-6 Luna的 90.9%；但獨立機構 Artificial Analysis 把它排在 18 個決策模型中第 9（66 分），每百萬任務成本 $345 是第 4 貴，官方與第三方評測結果不一致"
series:
  name: "AI Model Tracker"
  order: 71
glossary:
  - term: "決策模型（Decision Model）"
    def: "一種只對固定選項打機率分數、不逐字生成文字的專用模型，用於是非判斷、分類路由、評分等「有限選項」任務"
---

> 🌏 [English version](/posts/daily/2026-11-13-model-google-gemini-decision-1-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gemini-decision-1` |
| 廠商 | Google（Google DeepMind） |
| 參數量 | 未公開 |
| Context Window | 262,144 tokens（官方簡稱 256K，含共用輸入與所有題目） |
| Input 定價 (USD/1M tokens) | $0.10 |
| Output 定價 (USD/1M tokens) | $0.00（不產生輸出 token，故不計費） |
| 開源 | 否 |
| 發布日 | 2026-11-11 |
| 官方公告 | [Google Blog：Gemini Decisions API](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/) |
| 家族 | Gemini Decisions API（全新「決策模型」類別，非 Gemini 4.x 聊天模型家族的延伸） |

## 能力亮點

- **不逐字生成文字，而是對選項打分**：一次請求送入共用的多模態輸入（文字／圖片／音訊／影片／PDF）與最多 1,000 個獨立問題，模型用單次 forward pass 直接回傳每個問題的機率與信心分數（0–1），端到端延遲 150–250ms（官方測試範圍：上下文 16K 以內，1–100 題幾乎打平）
- **三種題型可混在同一次請求**：是非題（noul，回傳 0.01–0.99 機率）、選擇題（choice，2–255 選項各自機率）、評分題（score，2–255 級有序量表、每級機率），彼此互相看不到對方答案
- **共用輸入只計費一次、零輸出計費**：不管問 1 題還是 1,000 題，共用輸入的 token 只算一次，額外問題只加計自己的指令與判準文字；官方宣稱同一評測套件下比用 Gemini 3.5 Flash-Lite 跑「生成式問答」便宜近 5 倍
- **官方自測在 JevBench 達 92.2%**，領先 GPT-6 Luna 的 90.9% 與 TypeSafe Jev 1.14 的 90.0%，校準誤差（Top-1 ECE）0.0250 為四者最低

```diagram
title: 分類判斷從生成式模型改走決策模型
desc: 傳統做法用生成式模型逐字解碼產生文字再自行解析；Gemini Decision 1 改成單次 forward pass 直接對多題評分，回傳機率與信心分數。
caption: 簡化示意：是非／選擇／評分三種題型與單題計算細節省略；兩邊皆以 Google 公告內容為準。
---
<svg viewBox="0 0 640 476">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">改動前：生成式模型判斷</text>
  <text class="dg-heading" x="340" y="28" dominant-baseline="central">改動後：Gemini Decision 1</text>
  <line class="dg-rule" x1="316" y1="16" x2="316" y2="332"/>

  <path class="dg-line" d="M116 100V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M116 244V272" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M436 100V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M436 244V272" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="52" y="56" width="128" height="44" rx="6"/>
  <text class="dg-label" x="116" y="78" text-anchor="middle" dominant-baseline="central">共用輸入</text>

  <rect class="dg-box dg-box--ghost" x="52" y="128" width="128" height="116" rx="6"/>
  <text class="dg-label" x="116" y="152" text-anchor="middle" dominant-baseline="central">生成式模型</text>
  <text class="dg-sub" x="116" y="172" text-anchor="middle" dominant-baseline="central">逐字解碼產生文字</text>
  <text class="dg-sub" x="116" y="190" text-anchor="middle" dominant-baseline="central">每題各發一次請求</text>
  <text class="dg-sub" x="116" y="208" text-anchor="middle" dominant-baseline="central">共用輸入重複計費</text>

  <rect class="dg-box" x="52" y="272" width="128" height="60" rx="6"/>
  <text class="dg-label" x="116" y="294" text-anchor="middle" dominant-baseline="central">文字／JSON 輸出</text>
  <text class="dg-sub" x="116" y="312" text-anchor="middle" dominant-baseline="central">自行解析，無信心分數</text>

  <rect class="dg-box" x="372" y="56" width="128" height="44" rx="6"/>
  <text class="dg-label" x="436" y="78" text-anchor="middle" dominant-baseline="central">共用輸入＋最多 1000 題</text>

  <rect class="dg-box dg-box--accent" x="372" y="128" width="128" height="116" rx="6"/>
  <text class="dg-label" x="436" y="152" text-anchor="middle" dominant-baseline="central">Gemini Decision 1</text>
  <text class="dg-sub" x="436" y="172" text-anchor="middle" dominant-baseline="central">單次 forward pass</text>
  <text class="dg-sub" x="436" y="190" text-anchor="middle" dominant-baseline="central">多題一次評分</text>
  <text class="dg-sub" x="436" y="208" text-anchor="middle" dominant-baseline="central">共用輸入只計費一次</text>

  <rect class="dg-box" x="372" y="272" width="128" height="60" rx="6"/>
  <text class="dg-label" x="436" y="294" text-anchor="middle" dominant-baseline="central">機率＋信心分數</text>
  <text class="dg-sub" x="436" y="312" text-anchor="middle" dominant-baseline="central">零輸出 token 計費</text>

  <g class="dg-badge"><circle cx="36" cy="186" r="10"/><text x="36" y="186" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="36" cy="302" r="10"/><text x="36" y="302" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge dg-badge--accent"><circle cx="356" cy="186" r="10"/><text x="356" y="186" text-anchor="middle" dominant-baseline="central">+</text></g>
  <g class="dg-badge"><circle cx="356" cy="302" r="10"/><text x="356" y="302" text-anchor="middle" dominant-baseline="central">+</text></g>

  <line class="dg-rule" x1="20" y1="356" x2="620" y2="356"/>
  <text class="dg-tag" x="20" y="380" dominant-baseline="central">變更清單</text>
  <g class="dg-badge"><circle cx="32" cy="408" r="10"/><text x="32" y="408" text-anchor="middle" dominant-baseline="central">−</text></g>
  <text class="dg-sub" x="52" y="408" dominant-baseline="central">移除 逐字解碼生成文字：需自行解析、沒有信心分數</text>
  <g class="dg-badge dg-badge--accent"><circle cx="32" cy="432" r="10"/><text x="32" y="432" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="52" y="432" dominant-baseline="central">新增 Gemini Decision 1 單次 forward pass：對最多 1000 題同時評分</text>
  <g class="dg-badge"><circle cx="32" cy="456" r="10"/><text x="32" y="456" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="52" y="456" dominant-baseline="central">新增 機率＋信心分數直接輸出：零輸出 token、共用輸入只計費一次</text>
</svg>
```

## Benchmark 表現

| Benchmark | Gemini Decision 1 | TypeSafe Jev 1.14 | GPT-6 Luna | Gemini 3.5 Flash-Lite |
|---|---|---|---|---|
| JevBench（公開分割） | **92.2** | 90.0 | 90.9 | 86.6 |
| Amazon ESCI（Macro-F1） | **58.7** | 56.7 | 54.7 | 47.2 |
| Mind2Web（多模態） | 86.2 | **86.8** | 81.8 | 78.0 |
| When2Call | 79.9 | **82.0** | 70.4 | 60.9 |
| Top-1 ECE，7 項共用評測（越低越好） | **0.0250** | 0.0494 | 0.0721 | 0.2104 |
| 7 項共用評測總價（USD） | 0.88 | **0.68** | 0.93 | 4.14 |

⚠️ 以上為 Google 官方公告自測數字。獨立機構 Artificial Analysis 用自己的 Decision Index（v2.1，涵蓋 18 個決策模型，與 Google 公告評測集只有 When2Call 一項重疊）評出 Gemini Decision 1 為 66 分，在 18 個模型中排第 9（中位），略高於 GPT-6 Luna 的 60 分，但落後排名前段的低 70 分區；在成本面，Artificial Analysis 量得每百萬任務 $345，是 18 個模型中第 4 貴（中位數 $143）。校準表現在兩邊都算強（Brier score 偏低），但準確率在獨立評測下只算中等，跟官方「全面領先」的說法有落差。

## 與前代/競品比較

Gemini Decision 1 沒有直接前代（決策模型是全新類別），比較對象是同期出現的另外兩家：TypeSafe 的 Jev 1.14 與 OpenAI 的 Decisions API（底層模型 GPT-6 Luna）。三家輸入定價完全相同，都是 $0.10/1M tokens、輸出免費，但能力邊界不同：Gemini Decision 1 支援文字／圖片／音訊／影片／PDF 五種模態與單次最多 1,000 題，OpenAI 的 Decisions API 只吃文字與內嵌圖片、單次最多 400 題；TypeSafe Jev 1.14 在 Google 自己的表上反而贏了 Mind2Web 與 When2Call 兩項，且 Google 自報的總價也比 Jev 貴（$0.88 對 $0.68）。

這代表 Google 的「全面領先」說法要打折扣看：官方公告自測的 7 項評測裡，Jev 1.14 贏了 2 項且更便宜；而獨立機構 Artificial Analysis 的排名更進一步把 Gemini Decision 1 放在中位（9/18），而不是公告暗示的斷層領先。定價策略上三家全部卡在 $0.10/1M input 同一個價位，說明決策模型這個類別目前的競爭不在價格，而在模態覆蓋範圍、單次題目上限與延遲這些功能邊界上。

跟「拿一般生成式模型做分類」這條舊路相比，Google 強調的「nearly 5x cheaper」是跟 Gemini 3.5 Flash-Lite 走 Interactions API 比較得出的（$0.88 對 $4.14），這個比較本身是合理的——零輸出 token 計費加上共用輸入只算一次，確實讓「對同一份輸入問很多個是非題」這種用法在成本結構上跟生成式問答完全不同，不管跟哪一家決策模型比都一樣划算。

## 對 Agent 開發的意義

決策模型的出現代表 agent 架構裡「有限選項判斷」這一類節點（工具該選哪個、這個情境符不符合政策、這通對話該轉給哪個模型層級）可以從一般生成式 LLM 卸載出來，交給一個不產生文字、只回傳機率與信心分數的專用模型，省掉逐字解碼的延遲與輸出 token 成本。Google 自己在 Gemini Notebook（模型路由）、Search（MCP 工具的對抗行為偵測）等場景已經這樣用。

- 如果你在做多 agent 系統裡的路由層：把「這個請求該交給哪個子 agent / 該用哪個 thinking level」這類判斷換成決策模型的 choice 題型，理論上能拿到比一般生成式分類器更低的延遲與更穩定的信心分數，讓你的程式碼可以用信心分數門檻決定自動執行還是轉人工覆核
- 如果你在做需要大量規則式判斷但又想要信心分數的場景（內容審核、保單理賠初篩、客服工單分流）：一次請求把多個是非／評分題綁在同一份輸入上送出，共用輸入只計費一次，比對同一份輸入分別發多次生成式請求便宜得多
- 不適合：需要產生文字、呼叫工具、多輪對話記憶或思考鏈的任務——它完全不支援 function calling、thinking、Live API 與對話歷史輸入；目前也還沒上 Google Cloud／Vertex AI（官方標「即將推出」），已經在 Vertex 架構裡的團隊現階段用不到

## 今日收穫

Gemini Decision 1 是繼 TypeSafe Jev、OpenAI Decisions API 之後第三家主要廠商推出的「決策模型」，顯示業界正把「有限選項判斷」切成一個獨立類別來優化，而不是繼續用生成式模型硬做分類。但更值得記住的是官方評測與獨立評測的落差：Google 公告自己的評測套件說「全面領先」，獨立機構 Artificial Analysis 換一套評測集後卻把它排在中位——同一個模型，換一套題庫就從「斷層領先」變成「普通水準」。這提醒我們看任何新模型的 benchmark 時，第一件事不是看分數高低，而是先確認這是廠商自己的評測集還是獨立機構的評測集，兩者給出的排名可能完全不同。

## 參考資料

- [Google Blog：Gemini Decisions API — Fast, calibrated multimodal decisions（官方公告，含完整評測表與定價細節）](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)
- [Lindy：Gemini Decision 1 — What It Is, Pricing, Benchmarks（整理官方公告、文件、定價頁與 Artificial Analysis 數字）](https://www.lindy.ai/blog/gemini-decision-1)
- [Artificial Analysis：Gemini Decision 1 — Decision Index、成本與校準誤差獨立評測](https://artificialanalysis.ai/decision-models/gemini-decision-1)
- [VentureBeat：Google's Gemini Decision 1 model scores up to 1,000 questions in one API call](https://venturebeat.com/technology/googles-gemini-decision-1-model-scores-up-to-1-000-questions-in-one-api-call)
- [SiliconANGLE：Google enters decision model market with Gemini Decisions API](https://siliconangle.com/2026/11/11/google-enters-the-decision-model-market-with-gemini-decisions-api/)
