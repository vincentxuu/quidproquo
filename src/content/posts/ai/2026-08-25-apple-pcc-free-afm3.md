---
title: "Apple 開放 Private Cloud Compute 免費額度：AFM 3 模型家族與開發者該知道的事"
date: 2026-08-25
category: ai
type: deep-dive
tags: [apple-intelligence, foundation-models, private-cloud-compute, on-device-ai, apple-silicon, ios, swift]
lang: zh-TW
tldr: "Apple 讓 App Store Small Business Program 開發者免費使用跑在 Private Cloud Compute 上的 AFM 3 模型，門檻是首次下載數低於 200 萬次。AFM 3 家族共五個模型，裝置端的 AFM 3 Core Advanced 用 200 億參數稀疏架構只啟動 1–4B，雲端最強的 AFM 3 Cloud Pro 跑在 Google Cloud NVIDIA GPU 上，用 Gemini 輸出做蒸餾式精煉。"
description: "Apple 第三代 Foundation Models（AFM 3）完整介紹：五個模型的架構差異、IFP 稀疏技術原理、Gemini 蒸餾關係釐清、Private Cloud Compute 免費額度資格條件、Foundation Models framework 開源狀態，以及 EU/中國不可用等開發者必須知道的限制。"
draft: false
---

Apple 在 2026 年 6 月的 WWDC 2026 發表第三代 Apple Foundation Models（AFM 3），同時宣布符合資格的小型開發者可以**免費**使用跑在 Private Cloud Compute（PCC）上的雲端模型。這件事容易被淹沒在 WWDC 的大量更新裡，但對獨立開發者和小型工作室來說，這可能是第一次不用先燒雲端 AI 帳單就能在 App 裡接入 frontier 等級模型的機會。

## 免費額度的資格條件

根據 [Apple Developer 官方頁面](https://developer.apple.com/private-cloud-compute)，要拿到免費的 PCC 存取權，開發者需要同時滿足三個條件：

1. **加入 App Store Small Business Program**（年費 $99 的 Apple Developer Program 會員，且前一年營收低於 $1M 才能加入）
2. **旗下所有 App 的首次下載總數低於 200 萬次**
3. **取得 Private Cloud Compute entitlement**（在官方 entitlement 頁面用 Apple ID 申請）

幾個細節值得注意：TestFlight 和 ad hoc 測試安裝**不計入**下載數，開發者可以在 App Store Connect Analytics 查目前的累積下載量。如果某款 App 後來衝過 200 萬次門檻，或開發者不再符合 Small Business Program 資格，Apple 會通知並給予 **6 個月過渡期**遷移到付費方案，不會直接斷線。

這個設計的潛台詞很清楚：Apple 想讓小開發者先用起來，養出依賴 PCC 的 App 生態。等 App 長大超過門檻，開發者已經綁定 Apple 的 API 和隱私架構，轉移成本自然就高了。

## AFM 3：五個模型，兩種運算場景

根據 [Apple Machine Learning Research 的技術文章](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)，AFM 3 是一個由五個模型組成的家族，與 Google 合作打造，橫跨裝置端和雲端。

### 裝置端（On-Device）

| 模型 | 參數量 | 架構 | 特點 |
|---|---|---|---|
| AFM 3 Core | 30 億 | Dense | 上一代的直接升級，所有支援裝置都能跑 |
| AFM 3 Core Advanced | 200 億 | 稀疏（IFP） | 每次只啟動 1–4B 參數，僅限最新 Apple silicon |

AFM 3 Core Advanced 的架構是這次最有趣的技術突破。傳統大型語言模型要求所有權重都在 DRAM 裡才能推論，但手機的記憶體有限。Apple 的做法是把完整的 200 億參數模型存在 flash memory（NAND），用一種叫做 **Instruction-Following Pruning（IFP）** 的技術，在收到 prompt 時由一個輕量 dense block 決定要載入哪些 expert，然後只把選中的 1–4B 參數搬進 DRAM。

IFP 不是 Apple 臨時發明的——原始論文（[arXiv 2501.02086](https://arxiv.org/abs/2501.02086)）在 2025 年 1 月就已發表。論文的關鍵結果：3B activated 配置比 3B dense baseline 在數學和 coding 上高出 **5–8 個絕對百分點**，同時匹配 9B dense 模型的品質。換句話說，同樣的運算開銷買到了三倍參數量的效果。

> 關鍵差異：routing 決策是以 **prompt** 為單位，不是逐 token 切換——這跟傳統 Mixture-of-Experts 架構截然不同。因為 NAND 到 DRAM 的頻寬不夠快，逐 token 換 expert 會造成致命延遲。

這個設計還帶來「推論時彈性」：不同難度的任務可以動態調整啟動的參數量。簡單任務只載入 1B 的 expert 子集，複雜任務載到 4B，在速度和品質之間取得平衡。依 [ofox.ai 的開發者分析](https://ofox.ai/blog/apple-foundation-models-3-wwdc-2026-developer-read)，這是第一個量產出貨到消費者手上的動態稀疏 LLM。

### 雲端（Private Cloud Compute）

| 模型 | 硬體 | 用途 |
|---|---|---|
| AFM 3 Cloud | Apple silicon | 通用推論，速度與效率優先 |
| ADM 3 Cloud（Image） | Apple silicon | 影像生成與編輯（Image Playground、Genmoji） |
| AFM 3 Cloud Pro | Google Cloud NVIDIA GPU | 最強能力：agentic tool use、complex reasoning |

三個雲端模型都跑在 Private Cloud Compute 上。Apple **沒有公開任何雲端模型的參數量**——只有裝置端模型有公開數字。前兩個跑在 Apple 自己的 Apple silicon 伺服器，AFM 3 Cloud Pro 則是 Apple 與 Google、NVIDIA 合作，把 PCC 的隱私保證延伸到 Google Cloud 的 NVIDIA GPU 上。

根據 Apple 的人工評估，AFM 3 Cloud 相比 2025 年舊版 server model，在英文任務中的偏好比例是 **56% vs 11%**，跨所有語系一致地大幅進步（PFIGSCJK 語系偏好 68.3% vs 6.9%）。AFM 3 Cloud Pro 再比 AFM 3 Cloud 提升約 **10%（文字）** 和 **14%（圖像理解與數學）**。

但有一個關鍵注意事項：**Apple 沒有發布任何第三方 benchmark**——沒有 MMLU、SWE-bench、GPQA。所有比較都是 vs 自家 2025 baseline 的 side-by-side 人工偏好評估。不要把這些數字當成跟 GPT-5.5、Claude Opus 4.8 或 Gemini 3.1 Pro 的競爭排名。

PCC 的核心承諾是隱私：使用者資料**不會被儲存或分享給任何人，包括 Apple**。這是 Apple 跟所有其他雲端 AI 服務最根本的差異——不是「我們承諾不看你的資料」，而是架構上做到無法看。

## Gemini 的角色：teacher signal，不是 runtime

Apple 與 Google 的合作關係容易被誤讀，需要釐清。根據兩位 Apple 高層的公開說法：

> 「The amount of the Google Assistant we use is none.」——Craig Federighi, SVP Software Engineering（[9to5Mac](https://9to5mac.com)）

> 「All of these are custom builds for Apple Silicon, trained using proprietary data, and refined using outputs from Gemini frontier models.」——Amar Subramanya, Apple AI VP（[CNBC](https://www.cnbc.com)）

調和這兩句話：Apple 在正式環境**沒有跑 Gemini**。Gemini 的輸出被用來做 post-training 的蒸餾式精煉（distillation-style refinement）。對 AFM 3 Cloud Pro 而言，Google 的參與更深——多份報導描述了 Gemini-derived 的訓練基礎設施，但 pre-training 和 post-training 仍由 Apple 主導，推論在 NVIDIA GPU 上跑。

這其實是 2026 年的產業趨勢：frontier lab 訓練 teacher model，下游玩家做蒸餾。Apple 是目前公開承認這個模式的最大發行通路。

## Foundation Models Framework：統一的 Swift API

Foundation Models framework 是 Apple 提供的原生 Swift API，開發者用同一套介面就能調用裝置端模型和 PCC 雲端模型。根據 [WWDC 2026 session](https://developer.apple.com/videos/play/wwdc2026/339) 的說明，PCC 模型提供 **32K token context window**，並且支援 reasoning 能力。今年新增了影像輸入——開發者可以在不走雲端的情況下做圖片描述、收據結構化擷取、UI 元素分類。

### 開放策略

Apple 引入了 `LanguageModel` protocol，讓第三方模型接入同一套框架。Anthropic 已經發布了 Apache-2.0 授權的 Swift 套件，將 Claude 實作為符合該 protocol 的 backend；Google 和 OpenAI 也有對應的整合。開發者可以用相同的 API 呼叫不同 provider 的模型：

```swift
// 同一套 API，不同 provider
let session = LanguageModelSession()
let response = try await session.respond(to: "分析這張照片的內容")
// response.tokenUsage — iOS 27 beta 新增的 token 消耗追蹤
```

### 開源狀態

Apple 在 Platforms State of the Union 承諾「later this summer」開源 Foundation Models framework，讓同一套 Swift API 可以跑在 server-side。目前框架本身**尚未開源**，但一個 companion Swift package 已經在 GitHub 以 Apache-2.0 釋出，包含：

- **Skills API**：一個 result builder，讓你把 task-specific 指令即時注入 session transcript，避免 context 汙染
- **History management modifiers**：丟棄已完成的 tool call、滾動視窗、摘要——維持長時間 agentic loop 不超出 context
- **Chat-completions adapter**：把任何支援 chat completions REST API 的 server（包括本機的 MLX-LM Server）接入 Foundation Models 的程式模型

Apple 的 repo 自己標了「emerging and experimental」，API surface 還會變動。

## 對小型開發者的實質意義

把這件事放到 iOS 開發者的日常來看：

**省下來的不只是錢**。以 OpenAI GPT-4o 為例，每百萬 output token 約 $10；Claude Sonnet 4 約 $15。一個月活 10 萬的 App 如果每個使用者每天觸發 5 次 AI 功能，光是 API 費用就可能佔掉小型工作室的大部分利潤。Apple 把這個成本壓到零，讓小開發者可以先把功能做出來、驗證 PMF，再擔心規模化的問題。

**On-device 適合什麼、不適合什麼**。根據目前的能力邊界，on-device 模型適合：structured extraction、classification、嵌入式摘要、tool routing。仍然需要走雲端的場景：long context、agentic loops、frontier reasoning、多圖 vision-language 任務。務實的模式是 hybrid——on-device 做免費離線工作，fallback 到雲端模型處理複雜任務。

**但免費額度的邊界模糊**。Apple 沒有公開算力上限、rate limit、或每月可用的 token 數。「免費」到底能撐住多少推論量，目前沒有白紙黑字。審核速度也沒有 SLA 保證。這意味著開發者不應該把核心功能完全押在免費額度上，至少要有一條 fallback 路徑。

**鎖定效應是真的**。一旦 App 的 AI 功能建立在 Foundation Models framework 上，要遷移到其他平台的成本就不低——不只是 API 呼叫方式不同，PCC 的隱私架構也是 App Store 審核和使用者信任的賣點。Apple 給了甜頭，但也在建立護城河。

## 需要注意的地方

- **EU 和中國大陸不可用**：Apple Intelligence 在 EU 的 iPhone/iPad 和中國大陸初期都不提供。同一支 iPhone，Apple ID 地區不同，能做的事完全不同。開發者必須在程式碼裡處理「Apple Intelligence 不可用」的 fallback 路徑
- **200 萬下載門檻**聽起來很高，但如果 App 爆紅，6 個月過渡期可能不夠完成付費方案的遷移和測試
- **模型能力上限未知**：AFM 3 Cloud Pro 是最強的，但免費額度是否涵蓋 Cloud Pro，還是只限基礎的 AFM 3 Cloud，Apple 沒有明說
- **沒有第三方 benchmark**：Apple 只公布了 vs 自家舊版的偏好評估，沒有 MMLU、SWE-bench 等標準測試。模型在你的特定任務上表現如何，得自己測
- **框架開源時程未定**：「later this summer」是 Apple 的說法，companion package 已經在 GitHub，但核心框架還沒
- **裝置限制**：AFM 3 Core Advanced 只支援最新 Apple silicon（iPhone 15 Pro 以上），較舊裝置只能用 3B 的 AFM 3 Core

## 整體來說

Apple 用免費 PCC 額度吸引小型開發者進入 AI 功能開發，同時用 Foundation Models framework 建立統一抽象層。技術上最值得關注的是 AFM 3 Core Advanced 的 IFP 稀疏架構——200 億參數跑在手機上，每次只啟動 1–4B，3B 的運算開銷買到 9B 的品質，這是第一個量產出貨的動態稀疏 LLM。

Gemini 在這個家族裡扮演的是 teacher signal 而非 runtime model——Apple 用 Gemini 的輸出做蒸餾精煉，但跑在使用者面前的是 Apple 自己的模型。這個模式正在成為產業常態。

對台灣的獨立開發者來說，這是一條值得嘗試的路：零成本開始、原生 Swift API、隱私保證可以當 App 賣點。但要記住三件事：免費額度的邊界還不清楚、EU/中國不可用是硬限制、以及 Apple 生態的鎖定效應是刻意設計的。最穩健的策略是用 `LanguageModel` protocol 保留切換 provider 的能力，不要把所有邏輯寫死在 Apple 特有的 API 上。

## 參考資料

- [Accessing Private Cloud Compute — Apple Developer](https://developer.apple.com/private-cloud-compute)
- [Introducing the Third Generation of Apple's Foundation Models — Apple Machine Learning Research](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)
- [Instruction-Following Pruning for Large Language Models — arXiv 2501.02086](https://arxiv.org/abs/2501.02086)
- [What's new in the Foundation Models framework — WWDC 2026](https://developer.apple.com/videos/play/wwdc2026/241)
- [Build with the new Apple Foundation Model on Private Cloud Compute — WWDC 2026](https://developer.apple.com/videos/play/wwdc2026/319)
- [Bring an LLM provider to the Foundation Models framework — WWDC 2026](https://developer.apple.com/videos/play/wwdc2026/339)
- [Foundation Models — Apple Developer Documentation](https://developer.apple.com/documentation/foundationmodels)
- [Apple Is Open-Sourcing the Foundation Models Framework — Blake Crosley](https://blakecrosley.com/blog/foundation-models-open-source)
- [Apple's Third-Generation Foundation Models: A Developer's Read — ofox.ai](https://ofox.ai/blog/apple-foundation-models-3-wwdc-2026-developer-read)
- [Apple 開放免費雲端運算，小型開發者可申請 Private Cloud Compute 存取權 — INSIDE](https://www.inside.com.tw/article/42165-apple-foundation-model-cloud-developers)
