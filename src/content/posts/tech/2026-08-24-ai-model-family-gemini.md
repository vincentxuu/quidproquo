---
title: "Gemini——Google 的原生多模態旗艦，從 3.x Pro／Flash 到 Gemini 4 Carbon、Argon、Neon、Hydrogen 四層"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, gemini, google-deepmind, model-family-gemini, multimodal, reasoning, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Gemini 是 Google DeepMind 的原生多模態 LLM 家族，以 1M context 與原生影片／語音輸入見長。2026 年 9 月底起換成 Gemini 4 世代，到 11 月共四個型號：Carbon（最強推理）、Argon（較省 token 的前沿推理）、Neon（$3／$15，接近前沿、完成任務快）、Hydrogen（$1.50／$7.50，取代 Flash、免費層可用）。四個都支援 1M context，長解碼模式最多輸出 1M tokens。Carbon 與 Argon 的促銷價 $2／$10 只到 2026-11-30，12 月起變 $4／$20。"
description: "Gemini 模型家族完整介紹：從 2023 年 Gemini 1.0 到 2026 年 Gemini 4 的演化脈絡、原生多模態與 1M context、Gemini 4 Carbon／Argon／Neon／Hydrogen 四層定位與定價、舊型號停用與自動轉導、Gemma 授權差異，以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 4
draft: false
glossary:
  - term: "原生多模態"
    def: "從預訓練就整合文字、圖片、影片、語音等多種模態，而不是後掛視覺/語音 adapter"
  - term: "Thinking levels"
    def: "Gemini 4 的推理強度檔位：low、medium、high（預設）與 xhigh，檔位越高推理越深、token 用量越多"
  - term: "Implicit caching"
    def: "Gemini 4 的快取方式：重複的輸入前綴自動以快取價計費，不支援手動建立快取（explicit caching）"
  - term: "Fairwind Program"
    def: "Google 的受信任資安夥伴計畫；Gemini 4 Argon 與 Carbon 先透過它開放給資安防禦者，之後才進入一般 API"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-gemini-en)

2023 年 12 月，Google DeepMind 發佈 Gemini 1.0——第一個從預訓練就整合文字、圖片、影片、語音的「原生多模態」模型。到 2026 年，Gemini 3.x 已經把 Flash 線做到 agentic coding 追平前沿；9 月 30 日 Gemini 4 Argon 發表，接著兩個月內 Carbon、Hydrogen、Neon 相繼上線，型號名稱也從 Pro／Flash 改成元素名。這是「AI 模型家族」系列的第四篇家族深度介紹，追蹤 Gemini 從 1.0 到 Gemini 4 的完整演化。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族定位與版本矩陣

以 2026-11-20 Gemini API 定價頁與模型頁上架的型號為準：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Gemini 4 Carbon | 最強推理，長週期工程、科學與資安 | $2／$10 促銷到 11/30，之後 $4／$20 | 託管 API（付費層） |
| Gemini 4 Argon | 較省 token 的前沿推理 | 同 Carbon 價格，回應更快、每輪 token 更少 | 託管 API（付費層） |
| Gemini 4 Neon | 接近前沿、完成任務快 | $3／$15，無促銷 | 託管 API（付費層）、Gemini App |
| Gemini 4 Hydrogen | 日常 coding 與 agent 工作 | $1.50／$7.50，1M context 內不分段計價 | 託管 API（含免費層）、Gemini App、Google 搜尋 |
| Gemini 3.5 Flash-Lite | 高吞吐、最低成本 | $0.30／$2.50 | 託管 API |
| Gemma 4 | 自架選項 | 與 Gemini 不同產品線 | 開放權重，Apache 2.0 |

### 兩條產品線：閉源 Gemini 收營收，開源 Gemma 補生態
看懂 Gemini 在 2026 年的佈局，關鍵是把它拆成兩條線——和 GPT 的雙軌類似：

**閉源 API 線**（AI Studio／Gemini API／Gemini Enterprise Agent Platform）：Gemini 全系列只在 Google 基礎設施上，無權重可下載。從 1.5 時代就維持 1M context。這條線負責營收——Google 的企業與消費者流量都跑在這上面，TPU 自研晶片和全球數據中心是它的基礎設施護城河。

**開源權重線**（Gemma）：可下載、微調、自架，但不是前沿模型。授權要分代看：Gemma 4（2026-04）改用 Apache 2.0，之前的 Gemma 1–3 用的是 Google 自家的 Gemma Terms of Use。細節見 [Gemma 家族](/posts/tech/2026-09-19-ai-model-family-gemma)。

中間的轉折值得記：Google 在 2017 年發表 Transformer 論文、2014 年收購 DeepMind，2023 年 12 月把 Brain 和 DeepMind 合併為 **Google DeepMind**，Gemini 成為統一品牌——整合研究力量對抗 OpenAI 與 Microsoft。Gemma 的開源更像戰略補位，而不是路線回歸——閉源旗艦這條主軸從沒鬆動過。


### 子線與生態系：一張表看懂 Gemini 有多少產品
| 子線 | 代表版本（2026-11） | 定位 |
|---|---|---|
| 主線推理 | Gemini 4 Carbon／Argon／Neon／Hydrogen | 四層，從最強推理到日常主力 |
| 輕量 | Gemini 3.5 Flash-Lite、3.1 Flash-Lite | 高速低價，大規模分類與翻譯 |
| 資安 | Fairwind Program 下的 Argon／Carbon、3.8 Flash Cyber | 受信任防禦者可用無資安護欄版本；Vertex 上的 ID 為 `gemini-4-carbon-cyber-permissive` 等 |
| 決策模型 | Gemini Decision 1 | 批次是非／選擇／評分題，只收輸入費（[模型卡](/posts/daily/2026-11-13-model-google-gemini-decision-1)） |
| 開源權重 | Gemma 4 | Apache 2.0，可自架 |
| 嵌入 | gemini-embedding-2 | RAG 主力（Gemini Enterprise Agent Platform 列出） |
| 圖像 | Nano Banana 2.1／2／Pro | 生成與對話式編輯 |
| 語音 / 音訊 | Gemini 3.8 Live、3.8 Flash TTS、3.5 Transcribe | 即時語音對話、語音合成、轉錄 |
| 影片 | Gemini Omni 1.2 Flash | 最長 15 秒、含原生音訊的影片生成與編輯 |
| 互動世界模型 | Genie 4 | 即時串流可操控的 24 fps 世界，含音訊（[模型卡](/posts/daily/2026-11-03-model-google-genie-4)） |
| 開發者工具 | AI Studio、Google Antigravity、Gemini Enterprise Agent Platform | Agent 基礎設施 |
| 消費者產品 | Gemini App、NotebookLM、Google 搜尋 | 最大的分發管道 |

兩個觀察：

**多模態廣度是 Gemini 最被低估的資產。** Gemini 4 四個型號的輸入都涵蓋文字、圖片、音訊、影片與 PDF，而且從預訓練階段就融合（不是後掛 adapter）。對需要「看懂影片 + 聽得懂語音 + 讀得懂圖表」的 Agent 場景，這仍是 Gemini 最明顯的差異。

**基礎設施與分發是隱性護城河。** Google 擁有大規模 TPU 叢集，Gemini 4 Hydrogen 一上線就同時進 Gemini App、Google 搜尋與 Sheets，這是其他實驗室沒有的分發能力。但這也意味著 Gemini 的命運和 Google Cloud 深度綁定——對不想依賴單一雲的企業，這是風險。

## 家族演化

### 家族演化時間線
| 版本 | 發佈 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| Gemini 1.0 Ultra/Pro/Nano | 2023-12 | 首個原生多模態模型，32K context | 多模態不必再串多個模型 |
| Gemini 1.5 Pro / Flash | 2024-02／2024-05 | 業界首個 1M context | 整份文件、整段影片可以直接丟進一次請求 |
| Gemini 2.0 Flash | 2024-12 | Agent 能力、工具使用 | Flash 從「便宜摘要」變成可以跑 agent；API 已於 2026-06-01 停用 |
| Gemini 2.5 Pro / Flash | 2025-03／2025-04 | 推理能力大幅提升 | 推理模型進入 Gemini 主線；Developer API 於 2026-12-01 起自動轉到 3.8 Flash／3.5 Flash-Lite（[停用公告](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset)） |
| Gemini 3.0 Pro / 3.1 Pro | 2025-11／2026-02 | 3.1 Pro：GPQA Diamond 94.1%、ARC-AGI-2 77.1%（Deep Think），$2／$12 | Gemini 在科學推理上首次領先；3.1 Pro 至今仍是 preview 型號 |
| Gemini 3.1 Flash-Lite | 2026-03 | $0.25／$1.50 | 最低價層成形；預定 2027-05-07 停用，建議改用 3.5 Flash-Lite |
| Gemini 3.5 / 3.6 / 3.7 Flash | 2026-05／07／08 | 3.6 起 $0.75／$3.75 | Flash 連三代不漲價，主力從 Pro 移向 Flash；3.5、3.7 已自動轉導到新版（[3.7 模型卡](/posts/daily/2026-08-16-model-google-gemini-3-7-flash)） |
| Gemini 3.8 Flash / 3.8 Flash Cyber | 2026-09-02 | DeepSWE v1.1 73.7%、Terminal-Bench 2.1 89.4%，effort levels | Flash 價格跑出前沿 agentic coding；Cyber 變體開了「受信任資安夥伴先用」的路（[模型卡](/posts/daily/2026-09-04-model-google-gemini-3-8-flash)） |
| Gemini 4 Argon | 2026-09-30 發表／10-13 進 API | 輸出上限從 64K 拉到 1M，DeepSWE v1.1 77.9% | 新世代先給資安防禦者、再開放一般 API；長輸出成為選型條件（[模型卡](/posts/daily/2026-10-05-model-google-gemini-4-argon)） |
| Gemini 4 Carbon | 2026-10-28 發表／11-10 進 API | Artificial Analysis Intelligence Index v5.0 59 分第一（發表時） | 最強型號不再叫 Pro，旗艦與省 token 版同價並列（[模型卡](/posts/daily/2026-10-29-model-google-gemini-4-carbon)） |
| Gemini 4 Hydrogen | 2026-11-12 | $1.50／$7.50，免費層可用，取代 Flash 命名 | 日常主力換代，3.8 Flash 退為上一代 |
| Gemini 4 Neon | 2026-11-18 | $3／$15，AA Intelligence Index 61 分（xhigh）第三 | 補上 Hydrogen 與 Carbon 之間的價格層（[模型卡](/posts/daily/2026-11-20-model-google-gemini-4-neon)） |

三年、多個里程碑。Gemini 的演化有一條清晰的主線：**從多模態到 Agent，從旗艦到全尺寸覆蓋**。1M context 是 Gemini 最早建立的技術壁壘；3.x 時代主力從 Pro 移到 Flash；到 Gemini 4，Google 放棄 Pro／Flash 命名，改用四個元素名分層，並讓新世代先經過受信任資安夥伴，再開放給一般開發者。

## 架構與訓練取捨

### 架構：原生多模態、1M Context 與 1M 輸出
#### 原生多模態

Gemini 從第一代就是原生多模態——文字、圖片、影片、語音在預訓練階段就一起訓練，而不是先把文字模型訓練好，再後掛視覺 adapter。到 Gemini 4，模型頁列出的輸入模態是文字、圖片、音訊、影片與 PDF，輸出是文字；圖像、影片、語音生成則由 Nano Banana、Omni、TTS 等專門型號負責。

#### 1M Context 與長解碼

2024 年 2 月，Gemini 1.5 Pro 成為業界首個支援 1M token context window 的模型。1M tokens 大約等於 10 本完整的小說、3 萬行程式碼，或 5 小時的語音轉錄。

Gemini 4 的新變化在輸出端。Argon 發表時 Google 把輸出上限從前代的 64K 拉到 1M tokens，目的是讓模型在單一軌跡裡長時間推理、一次產出數十萬 tokens。模型頁現在把四個 Gemini 4 型號的輸出上限都寫成「64K / 1M」：一般請求 64K，長解碼最多 1M。

計價方式也跟 3.x 不同。Gemini 3.1 Pro 超過 200K input tokens 後整個請求改用長 context 費率；Gemini 4 Hydrogen 則官方寫明在整個 1M context 內同一個價格。

#### Thinking levels：從 Deep Think 到四個檔位

3.x 時代的深度推理靠 Deep Think 模式；3.8 Flash 改成 effort levels。Gemini 4 統一成四個 thinking levels：low、medium、high（預設）與 xhigh。Google 在 Hydrogen 與 Neon 的公告都強調檔位之間「平順、可預期」的遞進，讓開發者依任務決定推理深度與 token 花費。檔位會大幅改變分數與成本：同一個 Neon，在 Artificial Analysis Intelligence Index 上 high 與 xhigh 的分數不同，官方引用的最高分是 xhigh。

#### 多模型協作：Carbon 規劃、Hydrogen 執行

Gemini 4 的分層也反映在工具上。Google Antigravity 推出 Orchestrator，在同一個 session 裡讓 Carbon 負責規劃與判斷、Hydrogen 負責寫程式與測試；官方稱在 Terminal-Bench 4.0 上接近 Carbon 單獨跑的成功率，平均少用 24% 額度、快 19%。Neon 也被設計成可以擔任指揮多個 Hydrogen subagent 的協調者。

## 評測與競品比較

### 效能位置
Gemini 4 各型號的官方公告重點如下，皆為 Google 自測或 Google 引用的第三方榜單：

| 模型 | 官方重點數字 |
|---|---|
| Gemini 4 Argon | DeepSWE v1.1 77.9%（發表時 SOTA）、AutomationBench 51.3% 第一、LVBench（長影片理解）91.7%、CWE-bench v1 68% 並列第一 |
| Gemini 4 Carbon | Artificial Analysis Intelligence Index v5.0 59 分第一（10-28 發表時）；資安 SEC-bench Pro 88.2%、ExploitGym 54.8%、CWE-bench 71.0%；WebDev Arena 1768 第四；Terminal-Bench 4.0 作弊成功率降到 0.0% |
| Gemini 4 Hydrogen | AA Intelligence Index 51（high）／54（xhigh），高於 Argon 的 50；Terminal-Bench 4.1 57%，3.8 Flash 為 18.2%；完成任務快 2.5 倍 |
| Gemini 4 Neon | AA Intelligence Index 61（xhigh）全體第三；AA Coding Agent Index 58.6 第一；Terminal-Bench 4.1 65.2%；Terminal-Bench Science 70.5%；AutomationBench 56.3% 第一；Agents' Last Exam v1.1 75.8% |

和第三方評測對照：

| 來源 | 結果 |
|---|---|
| Artificial Analysis Intelligence Index | Carbon 發表時 59 分第一；到 Neon 發表時（11-18），Neon 61 分排第三，前面是 Claude Fable 5.2 與 GPT-6.2 Astra（[Neon 模型卡](/posts/daily/2026-11-20-model-google-gemini-4-neon)） |
| Arena Agent 排行榜 | Carbon（High）10-28 批次首次上榜第二（[評測快訊](/posts/daily/2026-10-30-benchmark-arena-agent-gemini-carbon)）；Neon 11-20 批次第三，與第二名 Claude Opus 5.5 信賴區間重疊（[評測快訊](/posts/daily/2026-11-20-benchmark-gemini-4-neon)） |
| Agents' Last Exam | The Decoder 報導 GPT-6.2 Astra 發表時，只有 Gemini 4 Carbon 能在這個榜上跟上它 |

讀這些數字的三個注意點：

- **排名的時間點**：Carbon 的「第一」是 10 月底的排名，三週後 Claude Fable 5.2 與 GPT-6.2 Astra 都排在 Gemini 4 前面。引用時要附日期。
- **thinking level**：Google 常引用 xhigh 的分數，但預設是 high。
- **benchmark 版本**：Gemini 4 用 Terminal-Bench 4.0／4.1，3.8 Flash 用 2.1，兩者不能直接比。

另一個值得注意的取捨：本站 Neon 模型卡整理的 AA-Omniscience 幻覺率，Neon（13.9–14.4%）反而比 Carbon（11.4%）、Hydrogen（8.5%）、Argon（4.3%）都高。


### 跟競品的位置
把 Gemini 放回 2026 年底的格局：

- **對上 Claude**：Claude Fable 5.2 在 Artificial Analysis 綜合指標排第一；Gemini 4 Neon 在 Coding Agent Index 與 AutomationBench 領先，價格 $3／$15 也低很多。詳見 [Claude 家族](/posts/tech/2026-08-24-ai-model-family-claude)
- **對上 GPT**：GPT-6.2 Astra 綜合指標高於 Gemini 4；Gemini 的差異在原生多模態輸入、長影片理解（Argon LVBench 91.7%），以及 Hydrogen 的免費層。詳見 [GPT 家族](/posts/tech/2026-08-24-ai-model-family-gpt)
- **對上開源（DeepSeek／Qwen／Kimi）**：開源模型可自架、單價更低；Gemini 的優勢是 1M context、多模態廣度與 Google 產品分發，但最強模型不開源

## 授權、價格與部署

### 授權陷阱：最強模型綁在 Google 基礎設施上
Google 的授權佈局和 OpenAI 類似——閉源旗艦 + 開源小模型雙軌：

- **閉源主線（Gemini 4 全系列）**：只有 API（AI Studio／Gemini API／Gemini Enterprise Agent Platform），無權重，授權即 Google 服務條款
- **開源權重（Gemma）**：Gemma 4 是 Apache 2.0；Gemma 1–3 是 Gemma Terms of Use，條款不同，不能混為一談
- **企業部署**：Gemini Enterprise Agent Platform（原 Vertex AI）上的 Gemini 受 Google Cloud 合約約束，資料處理地點可選區域

這裡的但書是：**Gemini 最強的模型幾乎綁死在 Google 基礎設施上**。想用 1M context 或原生影片理解，就必須走 Google 的 API。Gemma 4 雖然 Apache 2.0，但規模和品質都遠落後 Gemini 4。如果你的場景需要「Apache 2.0 + 前沿品質」，得看 DeepSeek（MIT）或 Qwen（多數 Apache）。

另一個陷阱是 **Google 生態綁定**：Gemini 的深度優勢（搜尋、YouTube、Maps、Workspace）只有在 Google 生態內才能發揮。離開 Google 基礎設施，優勢大幅縮水。

三個容易被忽略的價格與營運細節：

- **促銷期到期**：Carbon 與 Argon 的 $2／$10（快取 $0.10）只到 2026-11-30，12-01 起變 $4／$20（快取 $0.20），漲 100%（[促銷到期公告](/posts/daily/2026-10-17-pricing-google-gemini-argon-flash-promo-deadline)）。3.8 與 3.6 Flash 的 $0.75／$3.75 只到 2026-12-31，2027-01-01 起變 $1.50／$7.50
- **自動轉導而不是報錯**：Google 停用舊型號時常把請求自動轉到新型號並改用新型號計價。2.5 Pro 在 2026-12-01 轉到 3.8 Flash，2.5 Flash 轉到 3.5 Flash-Lite；3.7 Flash 已轉到 3.8 Flash，Omni 1.1 Flash 在 2026-12-03 轉到 Omni 1.2 Flash。程式不會壞，但模型行為和帳單會悄悄改變。Gemini Enterprise Agent Platform（原 Vertex AI）的時程不同：2.5 系列已於 2026-10-20 停用，3.6 Flash 於 2026-11-19 停用、3.7 Flash 預定 2027-01-28 停用，同一個型號在兩個入口的壽命不一樣
- **計費細節**：Gemini 4 只支援 implicit caching，不能手動建立快取；thinking tokens 與 grounding 時的內部工具指令都會計費。Carbon、Argon、Neon 不開放免費層，Hydrogen 有


### Gemini 4 Carbon、Argon、Neon、Hydrogen 怎麼選
Gemini API 定價頁（2026-11-20 讀取）的 Paid Tier 價格，每 1M tokens：

| 項目 | Gemini 4 Carbon | Gemini 4 Argon | Gemini 4 Neon | Gemini 4 Hydrogen | Gemini 3.5 Flash-Lite |
|---|---|---|---|---|---|
| 定位 | 最強推理、長週期工程與資安 | 較省 token 的前沿推理 | 接近前沿、完成任務快 | 日常 coding 與 agent | 高吞吐、最低成本 |
| Input | $2（至 11/30）→ $4 | $2（至 11/30）→ $4 | $3 | $1.50 | $0.30 |
| Output（含 thinking） | $10（至 11/30）→ $20 | $10（至 11/30）→ $20 | $15 | $7.50 | $2.50 |
| 快取 | $0.10 → $0.20 | $0.10 → $0.20 | $0.15 | $0.075 | $0.03 |
| 免費層 | 無 | 無 | 無 | 有 | 有 |
| Context／輸出上限 | 1M／64K（長解碼 1M） | 1M／64K（長解碼 1M） | 1M／64K（長解碼 1M） | 1M／64K（長解碼 1M） | — |
| 輸入模態 | 文字、圖片、音訊、影片、PDF | 同左 | 同左 | 同左 | 文字、圖片、影片、音訊 |

定價與規格來自 [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing) 與 [Gemini API Models](https://ai.google.dev/gemini-api/docs/models)。Batch API 為標準價的 50%。上一代仍在架上的 3.8 Flash（$0.75／$3.75 至 12/31）與 3.1 Pro preview（$2／$12，超過 200K 為 $4／$18）可繼續使用，官方也還沒公佈它們的停用日。

## Agent 使用與選型

### 對 Agent 開發者的意義
- **最難的長週期工程、科學與資安任務** → Gemini 4 Carbon：官方稱可連續跑數天處理大型 codebase 的根因分析與修補；資安三項 benchmark 領先。注意 12 月起單價翻倍
- **需要前沿推理但想省 token** → Gemini 4 Argon：同價，但每輪回應更快、token 更少
- **日常主力、coding agent** → Gemini 4 Neon（$3／$15）：Coding Agent Index 與 AutomationBench 領先，Google 也把它設計成指揮 Hydrogen subagent 的協調者
- **高量日常 coding、agent 執行端、免費試用** → Gemini 4 Hydrogen（$1.50／$7.50）：取代 3.8 Flash，官方稱 Terminal-Bench 4.1 從 18.2% 升到 57%
- **高吞吐分類／翻譯** → Gemini 3.5 Flash-Lite（$0.30／$2.50）
- **影片和語音理解** → 任一 Gemini 4 型號都能直接吃影片與音訊；長影片理解看 Argon 的 LVBench 91.7%
- **需要極長單次輸出** → Gemini 4 的長解碼最多 1M tokens 輸出，是 3.x 時代 64K 上限的最大改變
- **還在用 2.5／3.7 Flash** → 先查 deprecations 頁：自動轉導會改變行為與計價，遷移前用自己的請求比較
- **本地部署** → Gemini 綁在 Google 基礎設施上，需自架看 Gemma 4（Apache 2.0，非前沿）或 Qwen / DeepSeek

## 限制與取捨

Gemini 4 的公告數字多是 Google 自測或自選榜單、常用 xhigh 的分數；綜合指標上 Gemini 4 目前落後 Claude Fable 5.2 與 GPT-6.2 Astra。Carbon 與 Argon 12 月起價格翻倍，選型時要用到期後的價格估算。Neon 的幻覺率比同家族其他型號高。Gemini 和 Gemma 不能混用授權與部署假設；長 context 與多模態能力要對照具體型號、輸入條件和價格，不能把家族名稱當成規格。

### 整體來說
Gemini 的故事是「用基礎設施優勢換取多模態、長 context 與分發領先」。Google 擁有 TPU 自研晶片和全球數據中心，讓 Gemini 能在 1M context 內提供原生多模態，並把新模型同時推進 Gemini App、搜尋與 Workspace。

Gemini 4 帶來三個改變：輸出上限從 64K 拉到 1M、命名從 Pro／Flash 改成四個元素名、新世代先給受信任資安夥伴再開放。對 Agent 開發者來說，務實的做法是：Carbon 處理最難的任務，Neon 當日常主力與協調者，Hydrogen 跑大量執行與測試，Flash-Lite 扛高吞吐；並且記得 Carbon 與 Argon 的促銷價 11 月底就結束。


## 更新紀錄

- **2026-11-20**：補上 Gemini 4 世代（Argon、Carbon、Hydrogen、Neon）。版本矩陣、子線表、評測、定價與選型改寫為 2026-11-20 Gemini API 定價頁、模型頁與官方公告的內容；新增 thinking levels、1M 長解碼、Orchestrator 多模型協作、促銷到期與自動轉導的說明。Gemini 3.x 降為歷史世代：3.1 Pro 與 3.8 Flash 的詳細評測表、三型號定價表與選型建議移出正文，當時的數字見時間線連結的每日模型卡；時間線改為每列註明「改變了什麼選型」。修正錯誤：原文寫 Gemma 2／3 為 Apache 2.0，實際上 Gemma 1–3 是 Gemma Terms of Use，只有 Gemma 4 改用 Apache 2.0；子線表過時的 Imagen 4、Veo 3、Gemini 3.1 Flash-Lite 等條目改為目前在架的型號。
- **2026-10-11**：修正英文版落後中文 3.8 Flash 內容的差異；本次僅透過 Groundlane 重核 3.8 官方模型卡表格、發布文字與相關價格段落，未重查整篇。既有核對及圖表讀數警語分開保留。
- **2026-10-11**：依家族共同格式重組章節，補上由既有內容整理的矩陣。沿用原有版本、價格與來源日期，未進行新一輪事實查證。
- 2026-09-19：補充 Gemini 3.8 Flash（2026-09-02）——時間線、選型表、agentic coding 效能段落、子線表（3.8 Flash Cyber、Omni 1.1 Flash）、三代同價與 effort levels；benchmark 數字以 Model Card 評測表為準，blog 圖表讀數差異見內文警語

## 參考資料

- [Gemini 4 Argon: our next era of frontier intelligence — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon)
- [Gemini 4 Carbon: our next frontier model — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)
- [Introducing Gemini 4 Hydrogen — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/)
- [Introducing Gemini 4 Neon — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/)
- [Gemini 4 Hydrogen and Orchestrator — Google Antigravity Blog](https://antigravity.google/blog/gemini-4-hydrogen-in-google-antigravity/)
- [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API Models](https://ai.google.dev/gemini-api/docs/models)
- [Gemini API Deprecations](https://ai.google.dev/gemini-api/docs/deprecations)
- [Model versions and lifecycle — Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions)
- [Introducing Gemini 3.8 Flash and 3.8 Flash Cyber](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/)
- [Gemini 3.8 Flash Model Card](https://deepmind.google/models/model-cards/gemini-3-8-flash/)
- [Gemini 3.7 Flash: our most intelligent workhorse model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/)
- [Gemini 3.1 Pro: Announcing our latest Gemini AI model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/)
- [Gemini 3.1 Pro Model Card](https://deepmind.google/models/model-cards/gemini-3-1-pro/)
- [Google DeepMind Gemini](https://deepmind.google/models/gemini/pro/)
- [ARC-AGI-2 Benchmark](https://arcprize.org)
- [OpenAI launches GPT-6.2 Astra and Sol with lower API prices and some benchmark gains — The Decoder](https://the-decoder.com/openai-launches-gpt-6-2-astra-and-sol-with-lower-api-prices-and-some-benchmark-gains/)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
