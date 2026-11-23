---
title: "Cohere——RAG 原生的異類：Command A+、Embed 5、Rerank 5 與 Aya 怎麼選"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, cohere, rag, embedding, rerank, model-family-cohere, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Cohere 是唯一把生成、嵌入、重排、文件解析與多語言都做成獨立產品的模型家族。目前這一代：Command A+（2026-05，218B 總參數／25B 啟用 MoE，128K，Apache 2.0，兩張 H100 可跑）負責生成；Embed 5（2026-09-30，Pro $0.12／Fast $0.08 每百萬 token）與 Rerank 5（2026-10-21，Pro $0.05／Fast $0.02，可回傳段落）負責檢索；Aya 與 North Small Translate 負責多語言。旗艦首次有可商用自架權重，但 Aya 與翻譯線仍是非商用授權。"
description: "Cohere 模型家族完整介紹：從 2019 年多倫多創立到 Command A+ 的演化、Embed 5 與 Rerank 5 的檢索架構、Aya／Tiny Aya 多語言線、Model Vault 與私有部署、授權分層、定價與停用時程，以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 10
draft: false
glossary:
  - term: "RAG"
    aliases: ["Retrieval-Augmented Generation"]
    definition: "先檢索外部資料再交給模型生成答案的架構，降低幻覺、提升可追溯性。"
  - term: "Rerank"
    definition: "檢索第二階段：對召回的候選文件重新打分排序，只把最相關的餵進生成模型。"
  - term: "Context Focus"
    definition: "Rerank 5 的選用功能：同一次 rerank 呼叫除了文件分數，還回傳文件內最相關的段落（字元區間），讓下游 LLM 只讀必要內容。"
  - term: "Model Vault"
    definition: "Cohere 的獨佔式託管推論平台，模型跑在隔離實例上，按 GPU 小時計費，另有機密運算的 Encrypted 版本。"
  - term: "Aya"
    definition: "Cohere Labs 的多語言研究系列，從 Aya 101 到 Tiny Aya，授權依版本分為 Apache 2.0 與 CC BY-NC。"
---

> :globe: [English version](/posts/tech/2026-08-24-ai-model-family-cohere-en)

2019 年，Transformer 論文共同作者 Aidan Gomez 在多倫多創立 Cohere。當多數實驗室追逐「最強聊天模型」時，Cohere 選了一條不同的路——做企業的 RAG 基礎設施。七年後，這個選擇長成了一整條檢索流水線：Command 生成、Embed 嵌入、Rerank 精排、Parse 解析文件，外加 Aya 與 North 的多語言與專用模型。2026 年是這條線換代最密的一年：5 月 Command A+、9 月 Embed 5、10 月 Rerank 5。

這篇是「AI 模型家族」系列的 Cohere 家族主篇，正文以 2026 年這一代為主，Command R 到 Command A、Embed v3／v4、Rerank v3／v4 的演化放在家族演化時間線。Cohere 首個 agentic coding 模型 North Mini Code 另有[專文](/posts/tech/2026-10-10-ai-model-family-cohere-north)，這裡只在矩陣與選型提一句。怎麼解讀文中引用的 benchmark，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)；快速對照 20 多種用途的模型選型，見[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)。

## 家族定位與版本矩陣

以 Cohere 官方模型總覽頁現役（Live）的型號為準：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Command A+（`command-a-plus-05-2026`） | 企業 agent、RAG、推理、視覺、翻譯 | 218B 總參數／25B 啟用 MoE，128K，48 種語言 | Apache 2.0 權重；API 在速率上限內免費，正式用量走 Model Vault |
| Embed 5 Pro／Fast | 嵌入：文字、圖片、圖文混合 PDF | 128K，256～2048 維，Pro 與 Fast 共用同一個向量空間 | API $0.12／$0.08 每百萬文字 token；可自架 |
| Rerank 5 Pro／Fast | 精排 | 32K，Context Focus 回傳段落，分數經校準 | API $0.05／$0.02 每百萬 token |
| Parse 5（`parse-v5.0`） | 文件解析：表單、PDF 轉結構化資料 | 視覺解析模型 | API、SageMaker、Foundry |
| North Small Translate、North Mini Code | 翻譯、agentic coding | 前者 218B／25B、50+ 語言、CC BY-NC；後者 30B／3B、Apache 2.0 | API；權重見各自授權 |
| Aya Expanse 32B、Aya Vision 32B、Tiny Aya | 多語言研究 | Tiny Aya 為 3.35B、70 種語言，可在手機上跑 | API；權重 CC BY-NC |
| Transcribe／Transcribe Arabic | 語音辨識 | 14 種語言；阿拉伯語微調版 | API；Transcribe 權重 Apache 2.0 |

### 一條流水線，不是一個端點

多數家族的主線是一個聊天模型；Cohere 的主線是 RAG 的每一段：

**生成（Command）**：從 Command R 起就針對「給定文件、產生帶引用回答」與多步驟 tool use 訓練。Command A+ 是 Command A 家族的最後一個型號，把 Command A Vision（看圖）、Command A Reasoning（推理）、Command A Translate（翻譯）的能力收進同一組權重，也是 Cohere 第一個 MoE 模型。

**檢索（Embed、Rerank、Parse）**：Embed 5、Rerank 5、Parse 5 是官方說的「最新一代搜尋模型」。Embed 負責召回、Rerank 負責精排並挑出段落、Parse 負責在嵌入前把 PDF 與表單變成結構化資料。

**多語言（Aya、North Small Translate）**：Aya 是 Cohere Labs 的研究線，North Small Translate 是 2026 年 9 月的專用翻譯模型。

別家通常要自己拼 OpenAI＋BGE＋Jina＋翻譯模型，Cohere 給的是同一家計費、同一套私有部署的一整套。這仍然是它的護城河。

### 平台：North 2 與 Model Vault

模型之外，Cohere 疊了兩層平台。**North** 是企業 agent 平台，2026-10-05 推出的 North 2 換了新的 agent harness，加入記憶、知識庫與技能，管理端可設成本上限、速率限制與使用者配額，可雲端、地端或 air-gapped 部署並支援自帶模型。**Model Vault** 是獨佔式推論環境，現在除了 Cohere 自家模型，也能跑 DeepSeek、GLM、MiMo、Gemma、Nemotron、GPT-OSS、Phi、Qwen 等第三方開放模型。Command A+ 的正式用量就是透過 Model Vault。

## 家族演化

| 版本 | 發佈 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| Cohere 成立 | 2019 | 多倫多，Aidan Gomez 與 Nick Frosst、Ivan Zhang | — |
| Command R／R+ | 2024-03／04 | RAG 專用，128K；R+ 104B，多步驟 tool use | 「帶引用的企業問答」成為 Cohere 的主打；舊版已於 2025-09-15 deprecated |
| Aya 101／Aya 23 | 2024-02／05 | 101 語言 Apache 2.0；23 語言改 CC BY-NC | 多語言研究線的授權開始收緊 |
| Command R+ 08-2024 | 2024-08 | 吞吐 +50%，降價到 $2.50／$10.00 | 同品質更便宜 |
| Aya Expanse | 2024-12 | 8B／32B，23 種語言 | 8B 版已於 2026-04-04 停用 |
| Command A | 2025-03-13 | 111B 稠密，256K，兩張 GPU；HF 權重 CC BY-NC | 私有部署的旗艦門檻降到兩張卡 |
| Embed v4 | 2025 | 文字＋圖片＋混合 PDF，128K，可變維度 | 嵌入不必先轉文字 |
| Command A Vision／Reasoning／Translate | 2025-07～08 | 看圖、推理、23 語言翻譯三個專用版 | 專用需求各自一個型號，選型變複雜 |
| Rerank v4 Pro／Fast | 2025-12-11 | 32K，半結構化資料 | 長文件與 JSON 可直接精排 |
| Transcribe | 2026-03-26 | 首個語音辨識模型，Apache 2.0 | 語音進入產品線 |
| Command A+ | 2026-05-20 | 218B／25B MoE，Apache 2.0，48 語言 | 專用版收回單一模型，旗艦首次可商用自架，見下方各節 |
| North Mini Code | 2026-06 | 30B／3B MoE，Apache 2.0 | 首次跨入 coding（[專文](/posts/tech/2026-10-10-ai-model-family-cohere-north)） |
| North Small Translate | 2026-09 | 218B／25B MoE，50+ 語言，CC BY-NC | 翻譯獨立成專用模型 |
| Embed 5 Pro／Fast | 2026-09-30 | ViDoRe V3 Pro 85.8（Embed 4 為 77.0），共用向量空間 | 建索引與查詢可用不同價位的模型（[模型卡](/posts/daily/2026-10-06-model-cohere-embed-5)） |
| North 2 | 2026-10-05 | 企業 agent 平台改版 | 平台層支援自帶模型 |
| Rerank 5 Pro／Fast | 2026-10-21 | Context Focus、校準分數，改按 token 計費 | 精排同時負責「挑段落」，下游 token 可再減 |

七年的節奏不是「每季發一個更大模型」，而是每條線各自演進、2026 年同時換代。生成線的轉折最大：2025 年長出 Vision、Reasoning、Translate 三個專用版，2026 年又全部收回 Command A+；授權也從 Command A 的 CC BY-NC 改成 Command A+ 的 Apache 2.0。

## 架構與訓練取捨

### Command A+：Cohere 的第一個 MoE

[Hugging Face 模型卡](https://huggingface.co/CohereLabs/command-a-plus-05-2026-w4a4)寫明結構：decoder-only sparse MoE，218B 總參數、每 token 啟用 25B；128 個 experts 每次啟用 8 個，外加 1 個所有 token 共用的 shared expert。attention 沿用 Command A 的設計——滑動視窗 attention（搭 RoPE）與無位置編碼的全域 attention 以 3:1 交錯。

這個設計換來的是部署效率：W4A4 量化下最少 1 張 B200 或 2 張 H100 就能跑，官方稱延遲與吞吐都明顯優於 Command A Reasoning。代價是 context 從 Command A 的 256K 降到 128K（最大輸出 64K），知識截止日是 2025-04-01。

### Grounded generation 與引用

Command 系列從訓練階段就針對「給定文件、產生帶引用回答」最佳化，回答裡會用標記指出每句話出自哪份文件。Command A+ 保留這套引用格式，並把 tool use、推理、視覺放進同一個模型——不用再為「要看圖」或「要推理」換型號。

### Embed 5：建索引與查詢分開算

Embed 5 的設計重點是 Pro 與 Fast **共用同一個向量空間**：可以用 Pro 建索引、用 Fast 查詢（或反過來），Cohere 自測交叉組合平均只比同模型掉 1.6–2.7%，不用重建索引。Fast 比 Pro 便宜三分之一，文件吞吐量平均是 Pro 的 2.4 倍。兩者都支援 Matryoshka 維度（256 到 2048）與 float／int8／binary 格式，官方建議多數場景用 1024 維 int8。

### Rerank 5：精排也負責挑段落

Rerank 5 的新功能 **Context Focus** 讓同一次呼叫除了文件分數，還回傳文件內最相關的字元區間；分數也經過校準（0.7 代表約 70% 機率有用），可以跨查詢與領域用同一個門檻。Cohere 在 30 個問答資料集上測：砍掉一半的檢索內容，答案品質保留 96%；砍掉四分之三，保留 87%。Rerank 讀的是查詢當下的原始文字，從舊版升級不必重建索引。

## 評測與競品比較

以下數字都是 Cohere 自報；Embed 5 與 Rerank 5 使用 Cohere 自家設計的 RCP-nDCG@10 評測法，尚無第三方獨立複現。

### 生成：Command A+

| Benchmark | Command A+ | 對照 | 條件 |
|---|---|---|---|
| τ²-Bench Telecom | 85% | Command A Reasoning 37% | 標準設定與使用者模擬 |
| Terminal-Bench Hard | 25% | Command A Reasoning 3% | Terminus-2 harness，依 Artificial Analysis 方法 |
| Artificial Analysis Intelligence Index | 37 | 官方稱勝過其他主要開放模型 | 發佈時的指數版本 |

官方只拿自家前代與「其他開放模型」比，沒有列出與閉源前沿的直接對照。37 分在發佈時（2026-05）的指數上，不能和之後改版的指數直接比。

### 檢索：Embed 5 與 Rerank 5

| 模型 | Benchmark | 分數 | 對照 |
|---|---|---|---|
| Embed 5 Pro | ViDoRe V3（視覺豐富企業文件） | 85.8 | Embed 4 77.0、Voyage 4 Large 83.7、Gemini Embedding 2 83.2 |
| Embed 5 Pro | FinanceBench | 80.1 | OpenAI text-embedding-3-large 58.7 |
| Rerank 5 Pro | BRIGHT | 82.2 | Voyage AI Rerank 3 低 5.8 分 |
| Rerank 5 Pro | 46 個綜合資料集 | 39 個第一、43 個前二 | ViDoRe V3、nanoMTEB、BRIGHT、BEIR 等 |
| Rerank 5 Pro＋Context Focus（門檻 0.4） | 搜尋 agent 評測 | 準確率 58%、token 比只用 BM25 少 35% | BM25 單獨 46% |

Embed 5 的公告沒有引用 MTEB 這類通用英文檢索基準，強項集中在視覺豐富文件、財務文件與多語言。

### 跟競品的位置

- **對上 OpenAI 嵌入與通用模型**：Embed 5 在財務與視覺文件上自報大幅領先 text-embedding-3-large；通用生成品質與生態仍是 OpenAI 強
- **對上 Voyage、Gemini Embedding（閉源檢索）**：Embed 5 Pro 自報領先 1–3 分，Rerank 5 Pro 自報領先 Voyage Rerank 3；差距不大，換自己的語料重測才算數
- **對上 BGE-M3、Jina（開源檢索）**：開源組合可自架、成本低；Embed 5 也支援自架，但授權與費用要洽 Cohere
- **對上 Qwen、DeepSeek、Mistral（開放權重生成）**：Command A+ 是 Apache 2.0、兩張 H100 可跑，第一次跟這些家族站在同一條起跑線；綜合能力上，本文引用來源沒有可直接比較的同條件分數
- **對上 Claude、GPT、Gemini（閉源生成）**：coding 與推理仍是閉源前沿領先；Cohere 的差異化是整條 RAG 流水線與私有部署

一句話定位：**如果你要的是「一個最強的 /chat/completions 端點」，Cohere 不是首選；如果你要的是「一套能私有部署、從解析到生成都同一家的 RAG 流水線」，Cohere 是少數能一次給齊的家族。**

## 授權、價格與部署

### 授權分層

| 授權 | 適用 | 意義 |
|---|---|---|
| Apache 2.0 | Command A+、North Mini Code、Transcribe、Aya 101 | 可商用、可自架、可改作 |
| CC BY-NC 4.0（附 Cohere Labs 使用政策） | Command A、Command R／R+ 的 HF 權重、Aya 23、Aya Expanse、Aya Vision、Tiny Aya、North Small Translate | 只限研究與非商用；商用要走 API 或洽業務 |
| 只有服務、無公開權重 | Embed、Rerank、Parse | 透過 API、Model Vault 或私有部署取得 |

Command A+ 是這張表最大的變化：Cohere 旗艦生成模型第一次有可商用的開放權重。但同一個 218B／25B 底座做出來的 North Small Translate 仍是 CC BY-NC，不能因為參數規格相同就套用 A+ 的授權。

### API 定價

| 模型 | 計費 | 價格 |
|---|---|---|
| Command A+ | 速率上限內免費（試用與正式 key 皆同） | 正式用量走 Model Vault |
| Command A 03-2025、Command R+ 08-2024 | 每百萬 token | $2.50／$10.00 |
| Embed 5 Pro／Fast | 每百萬 token（文字／圖片） | Pro $0.12／$0.40；Fast $0.08／$0.40 |
| Rerank 5 Pro／Fast | 每百萬 token | Pro $0.05；Fast $0.02 |
| Aya Expanse 32B | 每百萬 token | $0.50／$1.50 |

Rerank 5 改成按 token 計費；舊版 Rerank 的「search unit」（1 個查詢＋最多 100 份文件為一單位）計法不適用。

### Model Vault（每 GPU 小時，On-Demand／促銷價至 2027-03-31）

| GPU | On-Demand | 促銷價 |
|---|---|---|
| L4 24GB | $3.00 | $1.00 |
| A100 80GB | $3.50 | $2.25 |
| H100 80GB | $6.25 | $4.25 |
| H100 80GB（Encrypted，機密運算） | $9.00 | $4.25 |
| H200 141GB | $7.25 | $5.50 |
| B200 192GB | $9.75 | $8.00 |
| GB200 192GB | $12.50 | $10.00 |

Model Vault 是獨佔實例（非多租戶），分 Standard 與 Encrypted（機密運算、遠端驗證）；Command A+ 最小配置 2 張 H100，換算促銷期約 $8.50／小時起。

### 已停用與排定停用

- `command-r-03-2024`、`command-r-plus-04-2024`、`command`、`command-light`：2025-09-15 deprecated，官方建議改用 Command A 或 R／R+ 08-2024
- Aya Expanse 8B、Aya Vision 8B、Embed v2.0：2026-04-04 停用
- Rerank v4：仍可用，官方標為上一代、新專案建議 Rerank 5

### 私有部署

除了 Model Vault，Cohere 也提供跑在客戶自有環境（on-prem 或隔離 VPC）的 Private Deployment，AWS、Azure、GCP、OCI 都支援；Embed 5 與 Rerank 5 另可透過 Microsoft Foundry、Amazon SageMaker 與 OpenRouter 取得。

## Agent 使用與選型

- **企業知識庫 RAG（新專案）** → Embed 5 Pro 建索引、Embed 5 Fast 查詢、Rerank 5 Pro 開 Context Focus、Command A+ 帶引用生成：同一家 API、同一套私有部署，下游 token 可以靠 Context Focus 再砍三成以上
- **要自架、要可商用的 agent 模型** → Command A+：Apache 2.0、兩張 H100；先確認 128K context 夠用
- **多步驟、反覆搜尋的 agent loop** → Embed 5 的共用向量空間正好對應「索引一次、查詢很多次」的成本結構；Rerank 5 的校準分數讓 agent 可以用固定門檻決定要不要再搜
- **財報、技術手冊、掃描 PDF** → Parse 5 先解析，或直接用 Embed 5 的圖文混合嵌入
- **多語言** → 商用生成用 Command A+（48 語言）；端側小模型可評估 Tiny Aya，但它是 CC BY-NC，商用要另談
- **翻譯** → 商用用 Command A+ 或洽 North Small Translate 的商用授權；研究可直接用 North Small Translate 權重
- **coding agent** → North Mini Code 見[專文](/posts/tech/2026-10-10-ai-model-family-cohere-north)；複雜 coding 仍建議用閉源前沿模型，Cohere 負責檢索
- **還在用 Command A 或 Rerank v4** → 都還能用；換 Command A+ 前先確認 context 從 256K 降到 128K 的影響，Rerank 換到 v5 只要改 model 參數

最小的選型驗證：拿 50–100 題真實查詢，比較「現有檢索」與「Embed 5＋Rerank 5（Context Focus 關／開）」的命中率與送進 LLM 的 token 數。Cohere 這一代的主張集中在「更少 token、同樣品質」，這個數字在自己的語料上最容易驗證。

## 限制與取捨

- **評測幾乎都是自報**：Embed 5 與 Rerank 5 使用 Cohere 自家的 RCP-nDCG@10，雖然附上標註資料與程式碼，評測集仍由 Cohere 設計
- **授權不一致**：同一代裡，Command A+ 是 Apache 2.0，Aya、Tiny Aya、North Small Translate 是 CC BY-NC，Embed／Rerank 沒有公開權重；選型時逐一核對
- **Command A+ 的 context 變短**：128K 對多數 RAG 夠用，但原本依賴 Command A 256K 的長文件工作流要重新測
- **API 免費有上限**：Command A+ 在速率上限內免費，正式用量要開 Model Vault、按 GPU 小時付費，成本結構跟按 token 計費不同
- **通用能力不是主打**：Cohere 沒有拿 Command A+ 對閉源前沿做直接比較，需要最強推理或 coding 的場景不該期待它取代前沿模型

## 更新紀錄

- **2026-11-23**：補上 2026 年這一代（Command A+、Embed 5、Rerank 5、Parse 5、North Small Translate、Tiny Aya、Transcribe），矩陣、評測、定價與選型改寫為 Cohere 官方模型總覽、各模型文件與發佈公告的內容；新增授權分層表與 Model Vault 每 GPU 小時定價。Command A、Embed v4、Rerank v4 降為歷史世代，原本的 Embed v4／Rerank v4 規格表移出正文，Embed 5 發佈時的數字見時間線連結的每日模型卡。修正錯誤：原文稱 Cohere 旗艦沒有可商用自架權重，Command A+ 已以 Apache 2.0 釋出；Apache 2.0 的型號不只 Aya 101 與 North Mini Code，還有 Command A+ 與 Transcribe；Aya Expanse 8B 已於 2026-04-04 停用；Model Vault 已改為每 GPU 小時計價；原本漏列的 Command A Vision、Reasoning、Translate（2025）補進時間線。North Mini Code 的細節留在專文，本篇只保留連結。
- **2026-10-11**：依家族共同格式重組章節，補上由既有內容整理的矩陣。沿用原有版本、價格與來源日期，未進行新一輪事實查證。

## 參考資料

- [Cohere 官方網站](https://cohere.com)
- [An Overview of Cohere's Models — Cohere Docs](https://docs.cohere.com/docs/models) — 全模型清單、context、狀態與平台對照
- [Introducing Command A+ — Cohere Blog](https://cohere.com/blog/command-a-plus) — Apache 2.0、218B／25B、48 語言、τ²-Bench、AA Intelligence Index 37
- [Command A+ — Cohere Docs](https://docs.cohere.com/docs/command-a-plus) — 2026-05-20、128K／64K、免費至速率上限、Model Vault
- [Command A+ W4A4 — Hugging Face](https://huggingface.co/CohereLabs/command-a-plus-05-2026-w4a4) — 128 experts／8 啟用、attention 結構
- [Embed 5 — Cohere Blog](https://cohere.com/blog/embed-5) — Pro／Fast、共用向量空間、定價、ViDoRe V3
- [Cohere Rerank 5 — Cohere Blog](https://cohere.com/blog/rerank-5) 與 [Announcing Rerank 5 — Cohere Changelog](https://docs.cohere.com/v2/changelog/rerank-v5) — Context Focus、校準分數、$0.05／$0.02
- [Release Notes — Cohere](https://docs.cohere.com/changelog) — Rerank v4（2025-12-11）、Transcribe（2026-03-26）、Embed 5（2026-09-30）、Aya 8B 停用（2026-04-04）
- [Deprecations — Cohere Docs](https://docs.cohere.com/docs/deprecations)
- [Cohere Pricing](https://cohere.com/pricing) — 舊模型定價、Aya Expanse、Model Vault 每 GPU 小時
- [Tiny Aya — Cohere Docs](https://docs.cohere.com/docs/tiny-aya) 與 [tiny-aya-global — Hugging Face](https://huggingface.co/CohereLabs/tiny-aya-global) — 3.35B、70 語言、CC BY-NC
- [North-Small-Translate-1.0 — Hugging Face](https://huggingface.co/CohereLabs/north-small-translate-1.0) — CC BY-NC 4.0、WMT26
- [Introducing North 2 — Cohere Blog](https://cohere.com/blog/introducing-north-2)
- [Command A — Cohere Docs](https://docs.cohere.com/docs/command-a) 與 [Introducing Command A — Cohere Blog](https://cohere.com/blog/command-a)
- [Command A 03-2025 — HuggingFace](https://huggingface.co/CohereLabs/c4ai-command-a-03-2025) — 111B、256K、CC BY-NC
- [Aya — Cohere Research](https://cohere.com/research/aya)、[Aya 101 — HuggingFace](https://huggingface.co/CohereLabs/aya-101)、[Aya Expanse 32B](https://huggingface.co/CohereLabs/aya-expanse-32b)
- [Model Vault — Docs](https://docs.cohere.com/docs/model-vault) 與 [Private Deployments](https://cohere.com/private-deployments)
- [Cohere Labs — HuggingFace](https://huggingface.co/CohereLabs) — 開放權重總表
- [Attention Is All You Need (arXiv:1706.03762)](https://arxiv.org/abs/1706.03762) — Transformer 奠基論文，Aidan Gomez 為共同作者
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
