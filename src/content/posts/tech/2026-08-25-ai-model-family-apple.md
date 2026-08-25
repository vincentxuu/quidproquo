---
title: "Apple Foundation Models——隱私優先的封閉生態 AI，20B 稀疏模型跑在手機上"
date: 2026-08-25
category: tech
tags: [ai-agent, llm, apple-intelligence, model-family-apple, foundation-models, private-cloud-compute, on-device-ai, apple-silicon, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Apple Foundation Models（AFM）是 Apple 自研的封閉生態 AI 家族，三代演進從 2024 年的 3B dense + LoRA adapter，到 2026 年的五個模型。AFM 3 Core Advanced 用 IFP 稀疏架構把 20B 跑在手機上（只啟動 1–4B），雲端最強的 Cloud Pro 跑在 Google Cloud NVIDIA GPU、用 Gemini 蒸餾精煉。沒有公開 API 定價，沒有第三方 benchmark，只透過 Foundation Models framework 給 iOS/macOS 開發者使用。"
description: "Apple Foundation Models 家族完整介紹：從 2024 年 AFM 第一代到 2026 年 AFM 3 的三代演化脈絡、IFP 稀疏架構與 LoRA adapter 技術、Private Cloud Compute 安全架構、Gemini 蒸餾關係、Foundation Models framework 開發者 API、以及與其他 LLM 家族的根本差異"
series:
  name: "AI 模型家族"
  order: 12
draft: false
glossary:
  - term: "IFP"
    aliases: ["Instruction-Following Pruning"]
    definition: "Apple 研發的稀疏啟動技術——根據 prompt 動態選擇要載入的 expert 子集，讓 20B 參數模型以 1–4B 的運算開銷跑在手機上"
  - term: "Private Cloud Compute"
    aliases: ["PCC"]
    definition: "Apple 的雲端 AI 推論基礎設施，以五大安全保證（stateless computation、enforceable guarantees、no privileged access、non-targetability、verifiable transparency）確保使用者資料不會被任何人存取，包括 Apple"
  - term: "PT-MoE"
    aliases: ["Parallel-Track Mixture-of-Experts"]
    definition: "Apple 自創的 MoE 變體，結合 track parallelism 和 expert routing，用於 AFM 第二代和第三代的 server model"
  - term: "Foundation Models framework"
    definition: "Apple 提供的原生 Swift API，讓開發者以統一介面調用 on-device 和 PCC 雲端模型，支援 guided generation、tool calling 和第三方模型接入"
---

> 🌏 English version 待翻譯

2024 年 6 月，Apple 在 WWDC 2024 發佈了 Apple Intelligence，底層是兩個自研基礎模型——一個 3B 跑在手機上，一個跑在自家雲端。兩年後的 2026 年 6 月，AFM 3 家族已經擴展到五個模型，其中 AFM 3 Core Advanced 用 200 億參數的稀疏架構跑在 iPhone 上，每次只啟動 1–4B 參數；最強的 AFM 3 Cloud Pro 跑在 Google Cloud 的 NVIDIA GPU 上，用 Gemini 做蒸餾精煉。這是「AI 模型家族」系列的第十一篇，追蹤 Apple 從 AFM 第一代到 AFM 3 的完整演化。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族演化時間線

| 版本 | 時間 | 關鍵事實 |
|---|---|---|
| AFM 第一代 | 2024-06 | ~3B on-device dense + server model，LoRA adapter 切任務，Apple Intelligence 首發 |
| 技術報告 | 2024-07 | arXiv 2407.21075，首次公開跟 GPT-4、Llama-3-70B 等的 benchmark 比較 |
| PCC 發佈 | 2024-10 | Private Cloud Compute 上線，安全研究者可驗證所有正式環境軟體 |
| AFM 第二代 | 2025-06 | Server model 換 PT-MoE 架構，Foundation Models framework 首次開放給開發者 |
| IFP 論文 | 2025-01 | arXiv 2501.02086，Instruction-Following Pruning 技術發表 |
| AFM 3 | 2026-06 | 五個模型、IFP 稀疏架構、與 Google 合作、PCC 延伸到 NVIDIA GPU |
| PCC on Google Cloud | 2026-06 | NVIDIA Confidential Computing + Intel TDX + Google Titan，業界首個第三方硬體 confidential inference pipeline |
| Framework 開源宣布 | 2026-06 | 承諾「later this summer」開源，companion package 已在 GitHub（Apache-2.0） |
| PCC 免費額度 | 2026-08 | Small Business Program 開發者（下載 < 200 萬）可免費使用 PCC 雲端模型 |

三代、九個里程碑。Apple 的演化主線不是「做最強通用模型」，而是**把模型深度整合進 OS，用隱私架構當護城河**。每一代的技術決策——LoRA adapter 動態切換、IFP 稀疏架構、PCC stateless computation——都是為了這個策略服務。

## 五個模型：兩層 on-device、三層雲端

AFM 3（2026 年 6 月）是目前的最新世代，根據 [Apple Machine Learning Research](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models) 的技術文章，家族由五個模型組成：

| 模型 | 參數量 | 架構 | 部署 | 定位 |
|---|---|---|---|---|
| AFM 3 Core | 30 億 | Dense | On-device，所有支援裝置 | 通用輕量任務 |
| AFM 3 Core Advanced | 200 億 | IFP 稀疏 | On-device，最新 Apple silicon | 複雜 on-device 推論 |
| AFM 3 Cloud | 未公開 | PT-MoE | PCC on Apple silicon | 通用雲端推論 |
| ADM 3 Cloud（Image） | 未公開 | Diffusion | PCC on Apple silicon | 影像生成與編輯 |
| AFM 3 Cloud Pro | 未公開 | 未公開 | PCC on Google Cloud NVIDIA GPU | agentic tool use、complex reasoning |

Apple **只公開了 on-device 模型的參數量**，三個雲端模型的參數量都沒有揭露。

跟其他家族的差異一眼就能看出：**沒有定價表**。Apple 不像 OpenAI、Anthropic、Google 那樣賣 API token——AFM 只能透過 Foundation Models framework 在 Apple 平台上使用，目前沒有獨立的 API 定價。符合資格的小型開發者（App Store Small Business Program + 下載 < 200 萬）可以[免費使用 PCC 雲端模型](/posts/ai/2026-08-25-apple-pcc-free-afm3)。

## 架構：三代的技術演進

### 第一代：LoRA Adapter 切任務（2024）

第一代的核心設計是用同一個 ~3B base model 疊加多個 **LoRA adapter**，每個 adapter 只有幾十 MB（rank 16），負責特定任務——摘要、改寫、通知分類。Adapter 可以動態載入、快取、切換，讓一個小模型「當場變身」成不同專家。

壓縮策略很激進：混合 2-bit/4-bit 量化（平均 3.7 bits-per-weight），搭配 LoRA accuracy-recovery adapter 補回量化損失。訓練框架用 Apple 自研的開源 [AXLearn](https://github.com/apple/axlearn)（基於 JAX/XLA）。

### 第二代：PT-MoE + Foundation Models Framework（2025）

Server model 從 dense 換成 **Parallel-Track Mixture-of-Experts（PT-MoE）**，Apple 自創的 MoE 變體。On-device 模型擴展到 15 個語言、新增影像理解。

最大的變化是 **Foundation Models framework** 誕生——原生 Swift API，開發者第一次可以直接呼叫 on-device 模型。框架的設計亮點：

- **Guided generation**：開發者定義 Swift struct + macro annotation → framework 自動注入型別約束 → constrained decoding + speculative decoding 保證輸出格式。這是 Apple 垂直整合（模型 + OS + 編譯器 + Swift 語言）的典型展現
- **Tool calling**：實作 Swift `Tool` protocol，framework 自動處理平行/序列 tool call 的 call graph
- Apple 明確定位：「It is not designed to be a chatbot for general world knowledge.」

### 第三代：IFP 稀疏架構 + Gemini 蒸餾（2026）

**IFP（Instruction-Following Pruning）** 是 AFM 3 最重要的技術突破。原始論文（[arXiv 2501.02086](https://arxiv.org/abs/2501.02086)）2025 年 1 月發表，AFM 3 Core Advanced 是第一個量產部署。

傳統 LLM 要求所有權重在 DRAM 才能推論。IFP 的做法：把 200 億參數存在 NAND flash，用輕量 dense block 在收到 prompt 時選擇要載入的 expert 子集（1–4B），只搬選中的搬進 DRAM。routing 決策以 **prompt** 為單位，不是逐 token——因為 NAND-to-DRAM 頻寬太慢，逐 token 換 expert 會造成致命延遲。

論文的關鍵數據：3B activated 配置比 3B dense baseline 在數學和 coding 上高出 **5–8 個絕對百分點**，同時匹配 9B dense 模型的品質。

**Gemini 的角色**是 teacher signal，不是 runtime model。Apple SVP Craig Federighi 說「The amount of the Google Assistant we use is none」，Apple AI VP Amar Subramanya 說模型是「custom builds for Apple Silicon, trained using proprietary data, and refined using outputs from Gemini frontier models」。Apple 在正式環境沒有跑 Gemini，Gemini 的輸出被用於 post-training 蒸餾精煉。

## Private Cloud Compute：Apple 的安全護城河

PCC 不只是「Apple 的雲端推論服務」——它是理解 Apple AI 策略的關鍵。根據 [Apple Security Research](https://security.apple.com/blog/private-cloud-compute)，PCC 從 2024 年第一天就建立在五大安全保證上：

1. **Stateless computation**：使用者資料處理完立即刪除，不留 log
2. **Enforceable guarantees**：安全保證是技術上可強制執行的，不靠政策
3. **No privileged runtime access**：沒有 remote shell、沒有 Developer Mode，連 Apple 員工也無法存取
4. **Non-targetability**：即使有物理存取權也無法鎖定特定使用者
5. **Verifiable transparency**：所有正式環境軟體映像公開發布，安全研究者可獨立驗證

底層是 Apple silicon 伺服器 + iOS/macOS 安全子集 + Secure Enclave + Secure Boot。使用者裝置先驗證 PCC 節點的加密簽證，確認跑的是公開發布的軟體，才傳送加密後的推論請求。

2026 年 PCC [延伸到 Google Cloud](https://security.apple.com/blog/expanding-pcc)——不是單純靠 confidential computing，而是在 NVIDIA Confidential Computing + Intel TDX + Google Titan 之上疊加 Apple 自有的軟體安全層，維持完整的五大保證。Apple 稱這是業界第一個在第三方硬體上達到這種安全層級的 confidential inference pipeline。

## Benchmark：只跟自己比

Apple 的 benchmark 策略跟系列裡所有其他家族都不同——**從第二代起就不再公開跟外部模型比較**。

唯一一次正面比較是第一代（2024）的技術報告：

**IFEval（Instruction Following）：**

| 模型 | Instruction-level Accuracy |
|---|---|
| **AFM-on-device (~3B)** | **85.7%** |
| Llama-3-8B | 82.5% |
| Phi-3-mini | 67.9% |
| Mistral-7B | 65.2% |

| 模型 | Instruction-level Accuracy |
|---|---|
| **AFM-server** | **88.5%** |
| Llama-3-70B | 88.1% |
| GPT-4 | 85.4% |
| Mixtral-8x22B | 79.4% |
| GPT-3.5 | 74.8% |

從第二代開始，所有評估都是 vs 自家前一代的 side-by-side 人工偏好——沒有 MMLU、SWE-bench、GPQA、LiveBench。AFM 3 Cloud 相比 2025 server model 的偏好比例是 **56% vs 11%**（英文）、**68.3% vs 6.9%**（PFIGSCJK 語系）。AFM 3 Cloud Pro 再比 Cloud 提升 ~10%（文字）和 ~14%（圖像理解與數學）。

Apple 的立場似乎是：我們不是在做通用 LLM，我們做的是整合進 OS 的功能，所以用功能面的人工評估比 benchmark 分數更有意義。這讓外部開發者無法把 AFM 跟 GPT / Claude / Gemini / DeepSeek 做直接比較。

## 跟競品的位置

Apple Foundation Models 在這個系列裡是最特殊的存在——它跟其他九個家族的比較維度完全不同：

| 維度 | Apple AFM | Claude | GPT | Gemini | DeepSeek |
|---|---|---|---|---|---|
| 使用方式 | 只能透過 iOS/macOS framework | API | API | API | API + 開源自架 |
| 定價 | 開發者免費（有門檻） | $1–$50/MTok | $0.15–$30/MTok | $0.08–$12/MTok | $0.07–$8/MTok |
| 開放權重 | ✗ | ✗ | ✗ | ✗ | ✓ MIT |
| On-device | ✓（核心設計） | ✗ | ✗ | ✓（Nano 系列） | ✗ |
| 第三方 benchmark | ✗（只 vs 自己） | ✓ | ✓ | ✓ | ✓ |
| 隱私保證層級 | 架構級 | 政策級 | 政策級 | 政策級 | 政策級 |
| 跨平台 | iOS / macOS / visionOS 限定 | 全平台 | 全平台 | 全平台 | 全平台 |
| EU 可用 | ✗（iPhone/iPad 不可用） | ✓ | ✓ | ✓ | ✓ |

三個根本差異讓 AFM 自成一類：

1. **不賣 API，賣生態**。Apple 不是 LLM API provider——AFM 的存在是為了讓 iOS App 更好用。你不能用 AFM 建一個跨平台的 AI 產品，但你可以讓你的 iOS App 有免費的 AI 能力。

2. **隱私是架構決策，不是承諾**。PCC 的 stateless computation 和 verifiable transparency 是技術上可強制執行的，不是「我們承諾不看你的資料」。這在系列裡是唯一的。

3. **On-device 是主場**。其他家族把 on-device 當實驗（Gemini Nano）或完全不做。Apple 把最創新的技術（IFP 稀疏架構）投在 on-device 模型上，因為這是它的差異化核心。

## 授權與取用方式

AFM 是**完全封閉的**——沒有開放權重、沒有獨立 API、沒有可下載的模型檔。使用方式只有一條路：

1. 加入 Apple Developer Program（$99/年）
2. 透過 Foundation Models framework（Swift API）在 iOS 26+ / macOS 等平台上呼叫
3. On-device 模型免費；PCC 雲端模型對 Small Business Program 開發者免費（下載 < 200 萬），超過門檻後 6 個月過渡期轉付費

Framework 預計今年開源，屆時 server-side Swift 也能使用同一套 API。目前已有 companion package 在 GitHub（Apache-2.0），包含 Skills API、history management、chat-completions adapter。

**Apple 允許第三方模型接入**：透過 `LanguageModel` protocol，Claude 和 Gemini 已經可以在同一套 framework 裡使用。Anthropic 已發布 Apache-2.0 的 Swift 套件。

## 開發者怎麼選：什麼時候用 AFM

**適合用 AFM 的場景：**
- iOS/macOS 限定的 App，不需要跨平台
- 隱私是核心賣點（醫療、金融、兒童 App）
- 需要離線 AI 能力（structured extraction、classification、摘要、tool routing）
- 預算有限的小型開發者，想要零成本的 AI 能力

**不適合用 AFM 的場景：**
- 跨平台產品（Android、Web）
- 需要 frontier reasoning、長 context agentic loops
- 需要跟其他 LLM 做公開 benchmark 比較
- EU 或中國大陸市場（Apple Intelligence 初期不可用）
- 需要自架或有資料主權合規要求但不在 Apple 生態內

**務實的混合模式：** on-device AFM 處理免費離線任務，`LanguageModel` protocol 接 Claude/Gemini 處理複雜任務，保留切換 provider 的彈性。

## 參考資料

- [Introducing Apple's On-Device and Server Foundation Models — Apple ML Research（2024）](https://machinelearning.apple.com/research/introducing-apple-foundation-models)
- [Apple Intelligence Foundation Language Models — arXiv 2407.21075](https://arxiv.org/abs/2407.21075)
- [Updates to Apple's On-Device and Server Foundation Language Models — Apple ML Research（2025）](https://machinelearning.apple.com/research/apple-foundation-models-2025-updates)
- [Introducing the Third Generation of Apple's Foundation Models — Apple ML Research（2026）](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)
- [Instruction-Following Pruning for Large Language Models — arXiv 2501.02086](https://arxiv.org/abs/2501.02086)
- [Private Cloud Compute: A new frontier for AI privacy in the cloud — Apple Security Research（2024）](https://security.apple.com/blog/private-cloud-compute)
- [Expanding Private Cloud Compute — Apple Security Research（2026）](https://security.apple.com/blog/expanding-pcc)
- [Foundation Models — Apple Developer Documentation](https://developer.apple.com/documentation/foundationmodels)
- [Accessing Private Cloud Compute — Apple Developer](https://developer.apple.com/private-cloud-compute)
- [Apple Is Open-Sourcing the Foundation Models Framework — Blake Crosley](https://blakecrosley.com/blog/foundation-models-open-source)
- [Apple's Third-Generation Foundation Models: A Developer's Read — ofox.ai](https://ofox.ai/blog/apple-foundation-models-3-wwdc-2026-developer-read)
- [Apple 開放免費雲端運算，小型開發者可申請 PCC 存取權 — INSIDE](https://www.inside.com.tw/article/42165-apple-foundation-model-cloud-developers)
