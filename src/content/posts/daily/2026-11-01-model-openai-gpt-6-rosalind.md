---
title: "模型卡｜GPT-6 Rosalind"
date: 2026-11-01
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: zh-TW
description: "OpenAI 發佈 GPT-6 Rosalind——跟 GPT-6 Astra 用同一組權重、沒有額外訓練，差別只在生物安全拒答邊界放寬與受信任存取門檻，定價卻是 Astra 的 1.5 倍"
tldr: "GPT-6 Rosalind（API ID：`gpt-6-rosalind`）：OpenAI 於 2026-10-30 發佈 system card addendum，2026-11-01 定價頁正式上架；與 GPT-6 Astra 權重完全相同、未新增訓練資料或額外 post-training，差異只在生物安全拒答邊界放寬＋受信任存取（trusted access）；定價 input $15.00／output $75.00（每 1M tokens，cached input $1.50，超過 272K input 後 $30／$112.50），是 Astra（$10／$50）的 1.5 倍；MedChemBench v7 49.6%、GeneBench Pro v13 37.7%、LifeSciBench Gold 61.3%，皆比前代 GPT-Rosalind-5.5 翻倍以上；但敏感生物資安測試通過率僅 79.0%，明顯低於 Astra 的 99.8%——多答對的題目來自拒答率下降，不是能力變強"
series:
  name: "AI Model Tracker"
  order: 65
glossary:
  - term: "GPT-Rosalind"
    def: "OpenAI 專攻生物學、藥物發現與轉譯醫學的受限存取模型系列，目前版本與對應世代的旗艦模型共用權重"
  - term: "Trusted Access"
    def: "OpenAI 對高風險能力模型採用的審核式存取機制，申請者需通過使命審查、治理與存取控管評估才能取得模型"
---

> 🌏 [English version](/posts/daily/2026-11-01-model-openai-gpt-6-rosalind-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gpt-6-rosalind`（商用名稱 GPT-Rosalind-6 Research） |
| 廠商 | OpenAI |
| 參數量 | 未公開（與 GPT-6 Astra 共用權重） |
| Context Window | 未在獨立頁面公開；因與 GPT-6 Astra 權重相同，推定同為 1,050,000 tokens |
| Input 定價 (USD/1M tokens) | $15.00（cached input $1.50；超過 272K input 後 $30.00） |
| Output 定價 (USD/1M tokens) | $75.00（超過 272K input 後 $112.50） |
| 開源 | 否（受信任存取限定，一般 ChatGPT 無法使用） |
| 發布日 | 2026-10-30（system card addendum）／2026-11-01（定價頁正式列出） |
| 官方公告 | [OpenAI：GPT-Rosalind-6 System Card Addendum](https://deploymentsafety.openai.com/gpt-rosalind-6) |
| 家族 | GPT-Rosalind 生命科學系列（前代 GPT-Rosalind-5.5 建立在 GPT-5.5 上；本代建立在 GPT-6 Astra 上） |

## 能力亮點

- 與 GPT-6 Astra **完全相同的權重**，官方明文「沒有新增訓練資料，也沒有做額外的 post-training」——這次發佈改的是安全調教與存取門檻，不是模型能力
- 三項生命科學研究評測對比前代 GPT-Rosalind-5.5 全面翻倍以上：MedChemBench v7（藥物化學）28.9% → 49.6%、GeneBench Pro v13（量化生物學）16.7% → 37.7%、LifeSciBench Gold（生科研究）44.0% → 61.3%
- 生物安全合規測試：對「良性生物學問題」完整回答率 100%（Astra 為 91.6%），但這個優勢主要來自拒答率下降，而非答對能力提升
- 隨模型同步推出 Rosalind Workbench 研究工作空間（Codex／ChatGPT 內），內建 FASTQ 品質控制、bulk RNA-seq、single-cell RNA-seq 等次世代序列分析工作流程

## Benchmark 表現

| Benchmark | GPT-6 Rosalind | 前代 (GPT-Rosalind-5.5) | 對照（GPT-6 Astra，同權重） |
|---|---|---|---|
| MedChemBench v7（99 題，最高推理預算） | 49.6% | 28.9% | 未公開（非該系列測項） |
| GeneBench Pro v13（129 題，最高推理預算） | 37.7% | 16.7% | 未公開（非該系列測項） |
| LifeSciBench Gold（94 題，最高推理預算） | 61.3% | 44.0% | 未公開（非該系列測項） |
| Biorisk 知識測試（未調整拒答） | 78.3% | 79.2% | 63.3% |
| Biorisk 知識測試（拒答調整後） | 85.0%（拒答率 9.4%） | 未公開 | 90.0%（拒答率 29.2%） |
| 敏感生物資安測試通過安全 grader | 79.0% | 未公開 | 99.8% |

⚠️ 以上皆為 OpenAI 官方 system card addendum 自測結果，獨立機構尚未重現；GeneBench Pro 使用「與正式環境不同的評測專用設定」。拒答調整後的 biorisk 分數會把拒答視為「答對」來估計模型被安全訓練隱藏的真實能力，用途是風險評估，不是一般能力排名。

## 與前代/競品比較

跟前代 GPT-Rosalind-5.5 比，三項生科評測的進步幅度（翻倍以上）主要來自底層模型從 GPT-5.5 換成 GPT-6 Astra，而不是這次發佈本身做了什麼新訓練——換句話說，這張模型卡量化的其實是「GPT-6 Astra 比 GPT-5.5 強多少」，被包裝成生科系列的進步。

跟同樣共用權重的 GPT-6 Astra 比，Rosalind 在 biorisk 知識測試「未調整」分數上領先（78.3% vs 63.3%），但那主要是因為它的拒答率只有 9.4%（Astra 是 29.2%）；一旦把拒答視為「模型本來知道但選擇不答」重新估算，排名就反過來（Astra 85.0% 的調整分數其實比 Rosalind 低，addendum 原文寫 Rosalind 85.0%、Astra 90.0%，Astra 反而更高）——i-SCOOP 的結論很直接：這個優勢「來自答得更多，不是答得更好」。在敏感生物資安測試上，Rosalind 的安全 grader 通過率只有 79.0%，比 Astra 低了 20.8 個百分點，是用更高的誤判風險換取更少的拒答。

定價策略是這次最值得記的部分：OpenAI 開始對「同一組權重」按安全設定與存取方案分層定價——`gpt-6-astra` 一般存取 $10/$50，`gpt-6-rosalind` 受信任存取、拒答邊界放寬 $15/$75（1.5 倍），而定價頁上還列著一個更便宜的 `gpt-rosalind-research`（$5/$25），OpenAI 沒說清楚它對應哪個版本。換算成實際用量：20 萬 input token＋2 萬 output token 的研究型 agent 任務，`gpt-rosalind-research` 要價 $1.50、Astra $3.00、Rosalind 6 要 $4.50——每月跑 1 萬次就是 1.5 萬美元、3 萬美元、4.5 萬美元的差距。Anthropic 用 Claude Science 進入同一塊市場，意味著「為降低拒答率收取溢價」可能成為 2026 下半年生科 AI 的通用定價模式。

## 對 Agent 開發的意義

這次發佈對 Agent 架構設計最直接的影響，是把「人工審核」從軟性建議變成合約義務：system card addendum 明文要求「客戶必須在模型輸出影響實驗、發表或重大決策之前，套用合格的人工審核」。如果你在做一個會自動產出化合物建議、排入實驗排程的研究型 Agent，這代表 closed-loop 設計裡**必須**內建一個具名的審核關卡與留存記錄，不能只靠模型自己判斷——OpenAI 沒定義「合格審核」具體要做什麼、審核者要簽署什麼文件，這塊要自己補規範。

- 如果你在做已經拿到受信任存取資格、且本身就有治理與存取控管基礎設施（例如已符合 GxP 驗證流程）的生科研究機構的內部工具：Rosalind 值得評估，因為 Astra 對良性生物學問題仍有約 8% 的拒答／但書比例，這對需要無人值守跑完整個 pipeline 的 Agent 是實際的中斷風險，Rosalind 把這個比例壓到接近零
- 如果你的 Agent 會讀取外部或不受信任的內容（例如从文獻資料庫、協作訊息抓取資料）：要注意 addendum 揭露的一項指標顯著惡化——「與外部 agent 訊息的非預期互動」從 Astra 的 0.0% 升到 Rosalind 的 2.5%，這是放寬拒答邊界的直接代價，對會呼叫工具、讀外部訊息的 Agent 是真實的安全性退步
- 不適合：還沒拿到受信任存取核准的團隊（連申請模型的資格都沒有）；想做對外客戶服務或 CRO 代工產品的場景（addendum 明文限制僅供「內部研究」使用）；沒有建立撤銷存取與備援模型方案的團隊——OpenAI 保留隨時以「濫用」為由收回存取權，卻沒說明觸發條件與通知期限，單一依賴這個模型的 pipeline 缺乏容錯

## 今日收穫

過去看模型發佈習慣假設「新版本 = 新訓練 = 能力提升」，但這次 OpenAI 自己寫得很清楚：GPT-6 Rosalind 沒有新增任何訓練資料或 post-training，三項生科評測的進步幾乎全部來自底層换成更強的 Astra，而這次發佈真正改變、也真正拿來收費的東西，是「同一組權重」在不同安全調教與存取方案下的拒答行為——定價不再單純跟著能力走，開始跟著「願意回答到什麼程度」走。對做 Agent 的人來說，這意味著評估一個模型時，除了看 benchmark 分數，還要看它的拒答率曲線跟存取方案，因為那可能是帳單差 50% 的主因，而不是模型變聰明了。

## 參考資料

- [OpenAI：GPT-Rosalind-6 System Card Addendum](https://deploymentsafety.openai.com/gpt-rosalind-6)
- [OpenAI：Introducing GPT-Rosalind for life sciences research](https://openai.com/index/introducing-gpt-rosalind)
- [OpenAI：Introducing new capabilities to GPT-Rosalind](https://openai.com/index/introducing-new-capabilities-to-gpt-rosalind)
- [OpenAI Help Center：GPT-Rosalind for life sciences research](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research)
- [OpenAI：API Pricing](https://developers.openai.com/api/docs/pricing)
- [i-scoop：GPT-6 Rosalind shows OpenAI now sells access, not just models](https://www.i-scoop.eu/gpt-6-rosalind-trusted-access/)
- [beri.net：OpenAI Launches GPT-6 Rosalind at $15/$75 per Million Tokens](https://www.beri.net/article/gpt-6-rosalind-research-astra-weights-trusted-access-refusals-medchembench-pricing-life-sciences)
- [OpenAI：GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/)（本次比較基準，發布於 2026-09-03）
