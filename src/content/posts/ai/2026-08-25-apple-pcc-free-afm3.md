---
title: "Apple 開放 Private Cloud Compute 免費額度：AFM 3 模型家族與開發者該知道的事"
date: 2026-08-25
category: ai
type: deep-dive
tags: [apple-intelligence, foundation-models, private-cloud-compute, on-device-ai, apple-silicon, ios, swift]
lang: zh-TW
tldr: "Apple 讓 App Store Small Business Program 開發者免費使用跑在 Private Cloud Compute 上的 AFM 3 模型，門檻是首次下載數低於 200 萬次。AFM 3 家族共五個模型，裝置端的 AFM 3 Core Advanced 用 200 億參數稀疏架構只啟動 1–4B，雲端最強的 AFM 3 Cloud Pro 跑在 Google Cloud NVIDIA GPU 上。"
description: "Apple 第三代 Foundation Models（AFM 3）完整介紹：五個模型的架構差異、Private Cloud Compute 免費額度資格條件、Foundation Models framework 的開放策略，以及對小型 iOS 開發者的實質影響。"
draft: false
---

Apple 在 WWDC 2026 發表第三代 Apple Foundation Models（AFM 3），同時宣布符合資格的小型開發者可以**免費**使用跑在 Private Cloud Compute（PCC）上的雲端模型。這件事容易被淹沒在 WWDC 的大量更新裡，但對獨立開發者和小型工作室來說，這可能是第一次不用先燒雲端 AI 帳單就能在 App 裡接入 frontier 等級模型的機會。

## 免費額度的資格條件

根據 [Apple Developer 官方頁面](https://developer.apple.com/private-cloud-compute)，要拿到免費的 PCC 存取權，開發者需要同時滿足三個條件：

1. **加入 App Store Small Business Program**（年費 $99 的 Apple Developer Program 會員，且前一年營收低於 $1M 才能加入）
2. **旗下所有 App 的首次下載總數低於 200 萬次**
3. **取得 Private Cloud Compute entitlement**（在官方 entitlement 頁面用 Apple ID 申請）

幾個細節值得注意：TestFlight 和 ad hoc 測試安裝**不計入**下載數，開發者可以在 App Store Connect Analytics 查目前的累積下載量。如果某款 App 後來衝過 200 萬次門檻，或開發者不再符合 Small Business Program 資格，Apple 會通知並給予 **6 個月過渡期**遷移到付費方案，不會直接斷線。

這個設計的潛台詞很清楚：Apple 想讓小開發者先用起來，養出依賴 PCC 的 App 生態。等 App 長大超過門檻，開發者已經綁定 Apple 的 API 和隱私架構，轉移成本自然就高了。

## AFM 3：五個模型，兩種運算場景

根據 [Apple Machine Learning Research 的技術文章](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)，AFM 3 是一個由五個模型組成的家族，與 Google 合作打造，橫跨裝置端和雲端：

### 裝置端（On-Device）

| 模型 | 參數量 | 架構 | 特點 |
|---|---|---|---|
| AFM 3 Core | 30 億 | Dense | 上一代的直接升級，所有支援裝置都能跑 |
| AFM 3 Core Advanced | 200 億 | 稀疏（IFP） | 每次只啟動 1–4B 參數，僅限最新 Apple silicon |

AFM 3 Core Advanced 的架構是這次最有趣的技術突破。傳統大型語言模型要求所有權重都在 DRAM 裡才能推論，但手機的記憶體有限。Apple 的做法是把完整的 200 億參數模型存在 flash memory（NAND），用一種叫做 **Instruction-Following Pruning（IFP）** 的技術，在收到 prompt 時由一個輕量 dense block 決定要載入哪些 expert，然後只把選中的 1–4B 參數搬進 DRAM。

> 關鍵差異：routing 決策是以 **prompt** 為單位，不是逐 token 切換——這跟傳統 Mixture-of-Experts 架構截然不同。因為 NAND 到 DRAM 的頻寬不夠快，逐 token 換 expert 會造成致命延遲。

這個設計還帶來「推論時彈性」：不同難度的任務可以動態調整啟動的參數量。簡單任務只載入 1B 的 expert 子集，複雜任務載到 4B，在速度和品質之間取得平衡。

### 雲端（Private Cloud Compute）

| 模型 | 硬體 | 用途 |
|---|---|---|
| AFM 3 Cloud | Apple silicon | 通用推論，速度與效率優先 |
| ADM 3 Cloud（Image） | Apple silicon | 影像生成與編輯（Image Playground、Genmoji） |
| AFM 3 Cloud Pro | Google Cloud NVIDIA GPU | 最強能力：agentic tool use、complex reasoning |

三個雲端模型都跑在 Private Cloud Compute 上。前兩個跑在 Apple 自己的 Apple silicon 伺服器，AFM 3 Cloud Pro 則是 Apple 與 Google、NVIDIA 合作，把 PCC 的隱私保證延伸到 Google Cloud 的 NVIDIA GPU 上。根據 Apple 的人工評估數據，AFM 3 Cloud 相比 2025 年的舊版 server model，在英文任務中被偏好的比例是 **56% vs 11%**；AFM 3 Cloud Pro 比 AFM 3 Cloud 再提升約 10%（文字）和 14%（圖像理解）。

PCC 的核心承諾是隱私：使用者資料**不會被儲存或分享給任何人，包括 Apple**。這是 Apple 跟所有其他雲端 AI 服務最根本的差異——不是「我們承諾不看你的資料」，而是架構上做到無法看。

## Foundation Models Framework：統一的 Swift API

Foundation Models framework 是 Apple 提供的原生 Swift API，開發者用同一套介面就能調用裝置端模型和 PCC 雲端模型。根據 [WWDC 2026 session](https://developer.apple.com/videos/play/wwdc2026/339) 的說明，PCC 模型提供 **32K token context window**，並且支援 reasoning 能力。

更值得注意的是開放策略：Apple 引入了 `LanguageModel` protocol，讓第三方模型也能接入同一套框架。目前已支援 Claude 和 Gemini，開發者可以用相同的 API 呼叫不同 provider 的模型。Apple 也宣布 Foundation Models framework **將會開源**，讓在 server-side 部署 Swift 的開發者也能使用。

```swift
// 同一套 API，不同 provider
let session = LanguageModelSession()
let response = try await session.respond(to: "分析這張照片的內容")
```

這個設計跟 Apple 過去在 Core ML 上的策略一致：提供統一抽象層，讓開發者不需要直接對接底層模型的差異。差別在於這次抽象層直接涵蓋了雲端推論。

## 對小型開發者的實質意義

把這件事放到 iOS 開發者的日常來看：

**省下來的不只是錢**。以 OpenAI GPT-4o 為例，每百萬 output token 約 $10；Claude Sonnet 4 約 $15。一個月活 10 萬的 App 如果每個使用者每天觸發 5 次 AI 功能，光是 API 費用就可能佔掉小型工作室的大部分利潤。Apple 把這個成本壓到零，讓小開發者可以先把功能做出來、驗證 PMF，再擔心規模化的問題。

**但免費額度的邊界模糊**。Apple 沒有公開算力上限、rate limit、或每月可用的 token 數。「免費」到底能撐住多少推論量，目前沒有白紙黑字。審核速度也沒有 SLA 保證。這意味著開發者不應該把核心功能完全押在免費額度上，至少要有一條 fallback 路徑。

**鎖定效應是真的**。一旦 App 的 AI 功能建立在 Foundation Models framework 上，要遷移到其他平台的成本就不低——不只是 API 呼叫方式不同，PCC 的隱私架構也是 App Store 審核和使用者信任的賣點。Apple 給了甜頭，但也在建立護城河。

## 需要注意的地方

- **地區限制**：PCC 目前僅在 Apple Intelligence 可用的地區開放，台灣開發者要注意 App 的目標市場是否在支援範圍內
- **200 萬下載門檻**聽起來很高，但如果 App 爆紅，6 個月過渡期可能不夠完成付費方案的遷移和測試
- **模型能力上限未知**：AFM 3 Cloud Pro 是最強的，但免費額度是否涵蓋 Cloud Pro，還是只限基礎的 AFM 3 Cloud，Apple 沒有明說
- **框架開源時程未定**：「預計今年稍晚」是 Apple 的說法，實際時間要等

## 整體來說

Apple 用免費 PCC 額度吸引小型開發者進入 AI 功能開發，同時用 Foundation Models framework 建立統一抽象層。技術上最值得關注的是 AFM 3 Core Advanced 的 IFP 稀疏架構——200 億參數跑在手機上，每次只啟動 1–4B，這在 on-device AI 領域是真正的工程突破。

對台灣的獨立開發者來說，這是一條值得嘗試的路：零成本開始、原生 Swift API、隱私保證可以當 App 賣點。但要記住兩件事：免費額度的邊界還不清楚，以及 Apple 生態的鎖定效應是刻意設計的。最穩健的策略是用 `LanguageModel` protocol 保留切換 provider 的能力，不要把所有邏輯寫死在 Apple 特有的 API 上。

## 參考資料

- [Accessing Private Cloud Compute — Apple Developer](https://developer.apple.com/private-cloud-compute)
- [Introducing the Third Generation of Apple's Foundation Models — Apple Machine Learning Research](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)
- [What's new in the Foundation Models framework — WWDC 2026](https://developer.apple.com/videos/play/wwdc2026/241)
- [Build with the new Apple Foundation Model on Private Cloud Compute — WWDC 2026](https://developer.apple.com/videos/play/wwdc2026/319)
- [Bring an LLM provider to the Foundation Models framework — WWDC 2026](https://developer.apple.com/videos/play/wwdc2026/339)
- [Foundation Models — Apple Developer Documentation](https://developer.apple.com/documentation/foundationmodels)
- [Apple Intelligence — Apple Developer](https://developer.apple.com/apple-intelligence)
- [Apple 開放免費雲端運算，小型開發者可申請 Private Cloud Compute 存取權 — INSIDE](https://www.inside.com.tw/article/42165-apple-foundation-model-cloud-developers)
