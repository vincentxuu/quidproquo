---
title: "ByteDance Seed（豆包）——Seed2.1 Pro／Turbo、Seedream 5.5 與 Seed Audio 1.0，主力閉源、開放權重停在研究線"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, bytedance, model-family-bytedance-seed, multimodal, image-generation, model-selection]
lang: zh-TW
type: deep-dive
tldr: "ByteDance Seed 是字節跳動的基礎模型團隊，豆包 App 背後的模型都出自這裡。目前在架的文字主力是 Seed2.1 Pro 與 Turbo（2026-06），影像是 Seedream 5.5（Artificial Analysis 影像榜第 14），影片是 Seedance 2.5，音訊是 Seed Audio 1.0。主力全部閉源，只能走火山引擎、BytePlus 或 OpenRouter；開放權重只有 Seed-OSS-36B、UI-TARS 這類研究模型。Seed2.1 的評測幾乎都是自報，Artificial Analysis 還沒有分數，國際通路目前只買得到 Turbo。"
description: "ByteDance Seed（豆包）模型家族介紹：Seed2.1 Pro／Turbo／Lite 的定位與官方評測、Seedream 5.5 影像、Seedance 2.5 影片、Seed Audio 1.0 音訊，火山引擎、BytePlus、OpenRouter 價格，Seed-OSS 與 UI-TARS 開放權重的採用數字，2025→2026 演化時間線與 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 46
draft: false
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-bytedance-seed-en)

ByteDance Seed 是字節跳動的基礎模型團隊，中文產品名多半叫「豆包」：豆包 App、程式工具 TRAE、火山引擎上的 Doubao 模型，背後都是 Seed 的模型。它跟 Qwen、DeepSeek 最大的差別是：主力模型不開放權重，而且同一個團隊同時做文字、影像、影片、音訊四條線。

這篇寫給要評估中國模型的 Agent 開發者與內容製作團隊：Seed2.1 的 Pro、Turbo、Lite 各該接在哪裡，Seedream 5.5 和 Seed Audio 1.0 在多模態工作流裡能做什麼，以及在中國以外要從哪個通路買、哪些型號買不到。

怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

Seed 的[模型頁](https://seed.bytedance.com/en/models)目前列出的在架世代是文字的 Seed2.1，以及影像、影片、音訊各一個生成模型。同一個模型在不同通路有不同名字：火山引擎（中國）叫 `doubao-seed-*`，BytePlus（國際）叫 `dola-seed-*`，OpenRouter 叫 `bytedance-seed/*`。

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Seed2.1 Pro | 文字旗艦：長程 agent、複雜辦公任務、coding | 文字、圖片、影片輸入；官方表在 GDPval、影片理解領先 | 閉源；火山引擎 API、豆包、TRAE；BytePlus 定價表沒有列 |
| Seed2.1 Turbo | 高吞吐的生產主力 | 256K context；四檔推理深度（minimal 為不思考） | 閉源；火山引擎、BytePlus、OpenRouter |
| Seed2.1 Lite | 低價全模態理解 | 文字、圖片、影片、音訊輸入；1M context | 閉源；火山引擎 |
| Seedream 5.5 | 影像生成與多輪編輯 | 原生 RGBA 透明素材、100 輪連續編輯 | 閉源；即夢、豆包、火山引擎、BytePlus、OpenRouter |
| Seedance 2.5 | 影片生成 | 單次 30 秒、大量參考素材 | 閉源；即夢／Dreamina、火山引擎、BytePlus |
| Seed Audio 1.0 | 場景音訊生成 | 人聲、音效、環境聲同一個模型產生 | 閉源；BytePlus、火山引擎、OpenRouter |
| Seed-OSS-36B | 開放權重文字模型 | 36B 稠密、512K context、可控思考預算 | Hugging Face，Apache 2.0 |
| UI-TARS-1.5-7B | GUI agent 研究模型 | 看螢幕截圖輸出操作 | Hugging Face，Apache 2.0；OpenRouter |

先知道三件事：

- **國際通路只有 Turbo。** [BytePlus ModelArk 定價表](https://docs.byteplus.com/en/docs/modelark/model-pricing)列了 `dola-seed-2-1-turbo`，沒有 Pro 也沒有 Lite；OpenRouter 也只有 Turbo。要用 Pro 得走火山引擎（中國帳號）或豆包、TRAE 等產品。
- **Lite 不在發佈文裡。** [Seed2.1 發佈文](https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity)只介紹 Pro 與 Turbo；[火山方舟](https://ark.volcengine.com/region:cn-beijing/model/detail?Id=doubao-seed-2-1-lite)後來上架 Lite（版號 260915），描述是全模態理解、1M context。
- **還有一條即時互動線。** 模型頁另列 SeedRealtime（同時聽、看、說的全雙工互動），本篇不展開。

## 家族演化

文字主線的日期取自 Seed 官方的 [Seed Model Portfolio](https://seed.bytedance.com/en/seed_model_portfolio)，影像、影片、音訊取自各自的發佈頁。

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| Seed1.5（Doubao-1.5-pro） | 2025-01-22 | Portfolio 列出的第一代 Seed 模型，對外名稱是 Doubao-1.5-pro | — |
| Seed1.5-VL | 2025-05-13 | 視覺語言模型獨立成線，附技術報告 | — |
| Seed1.6 | 2025-06-25 | 230B 總參數、23B 啟用的 MoE，256K context；用 AdaCoT 依題目難度決定要不要思考 | — |
| Seed-OSS-36B | 2025-08-20 | Apache 2.0 的通用文字權重；之後的主線世代都沒有再開放權重 | — |
| Seed1.8 | 2025-12-17 | 定位改成「通用 agent 模型」，強調 GUI 操作與搜尋 agent；附 model card | — |
| Seed2.0 | 2026-02-14 | Pro／Lite／Mini 三尺寸加 Code 模型；官方稱 token 價比同級前沿模型低約一個數量級。Lite 在 4 月底升級為全模態理解 | — |
| Seed2.1 | 2026-06-23 | 收斂成 Pro 與 Turbo，主打 agent 交付與 coding；Turbo 8 月上 OpenRouter | — |
| Seed Audio 1.0 | 2026-07-20 | 人聲、音效、環境聲合成一個模型 | — |
| Seedance 2.5 | 2026-07-31 | 單次影片從 15 秒拉到 30 秒 | [影片家族文](/posts/tech/2026-08-26-ai-model-family-video-generation) |
| Seedream 5.5 | 2026-11-09 | 加入原生透明背景與百輪編輯，單張價格低於 5.0 Pro | — |

站上沒有 Seed 各代的每日模型卡，所以舊世代的分數不在站內保存；需要 Seed2.0 數字的讀者請讀官方的 [Seed2.0 model card](https://seed.bytedance.com/en/seed2)。主軸是兩件事：文字線從「追分數」轉向「真實工作流能不能交付」（Seed2.1 model card 的說法）；開放權重則停在 2025 年的 Seed-OSS 與 UI-TARS，沒有跟著主線更新。價格並非一路往下：Seed2.1 Pro 在火山引擎是 ¥6／¥30，高於 Seed2.0 Pro 最低分段的 ¥3.2／¥16，換來的是不再依輸入長度加價。

## 架構與訓練取捨

### Seed2.1：未揭露架構，揭露的是評測方法

Seed 官方頁面寫過參數規模的是 [Seed1.6](https://seed.bytedance.com/en/seed1_6)：230B 總參數、23B 啟用的稀疏 MoE，在持續預訓練階段混入圖文資料。Seed2.1 是否沿用這個規模，官方沒有說。

[Seed2.1 model card](https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2.1/Seed2_1_Model_Card.pdf)沒有寫參數量、是否 MoE、訓練資料量或 context 設計。它花篇幅講的是怎麼決定優化方向：

- **用產品回饋當訓練目標。** 內部使用者、外部受邀測試者與群眾測試的開發者持續 dogfooding；coding 評測優先看 Claude Code 與 TRAE 裡的實際體驗，而不是單獨的 coding benchmark。
- **從失敗案例擴充評測集。** 一般 agent 場景的評測集從使用者回報的壞案例長出來，再加上訪談企業與領域專家整理出的任務。
- **讓模型參與自己的開發。** model card 用一整節描述 Seed 模型如何參與評測建構、失敗分析、資料清洗與合成。官方自己說這還在早期。

代價是讀者很難獨立判斷：Workspace Bench 之外，Agent Startup Bench、xDailyBench、CreativeWork、Trae Agent Bench 都是 Seed 自建的評測，結論高度依賴字節自己的產品情境。

### Seedream 5.5 與 Seed Audio 1.0

[Seedream 5.5 發佈文](https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5)沒有揭露架構，只說用專項訓練做到「未編輯區域像素級保持」。這解決的是連續編輯的累積誤差：前一輪輸出成為下一輪輸入，小偏差會一路疊加成畫質退化。

[Seed Audio 1.0](https://seed.bytedance.com/en/seedaudio1_0) 揭露了兩段式結構：語言模型先把創作意圖拆成場景層級的控制（誰說話、情緒、什麼時候進場），再由 diffusion 聲學生成器在潛空間產生音訊。人聲、音效、環境聲共用同一個聲學編碼器，所以能在同一次生成裡對齊時間與空間感，不用分別生成再混音。

### Seed-OSS-36B：老派稠密架構

[Seed-OSS-36B 模型卡](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct)是 36B 稠密模型（GQA、64 層、RoPE、SwiGLU），原生 512K context，只用 12T tokens 訓練。特色是可控的思考預算：用 `thinking_budget` 指定推理長度，簡單任務可以省 token。它還另外釋出不含合成指令資料的 base（`-woSyn`），方便研究者做乾淨的後訓練實驗。

## 評測與競品比較

### 第三方：幾乎沒有

[Artificial Analysis 的 ByteDance Seed 頁](https://artificialanalysis.ai/models/creators/bytedance_seed)只收了 Doubao Seed Code 與 Seed-OSS-36B-Instruct，兩者都沒有 Intelligence Index 分數；Seed2.1 Pro 與 Turbo 不在上面。文字模型目前能看的第三方訊號只有一個：Seed 自己公布 Seed2.1 Preview 在 Arena 的 Code Arena: Frontend 排第 8（1539 分）。

影像和影片有第三方分數：

- **Seedream 5.5**：[AA-Image-T2I v2.1](https://artificialanalysis.ai/text-to-image/arena/leaderboard-text) 排第 14，Elo 1135±12（5,334 票），AA 標示價格 $20／千張。上一代 Seedream 5.0 Pro 是第 23（1104），價格 $90／千張。第一名 GPT Image 2.6 Sunburst 是 1263。
- **Seedance 2.5**：在 AA 文生影片榜屬於第一梯隊，名次、每分鐘成本與跟 Veo、Kling、Wan 的比較寫在[影片家族文](/posts/tech/2026-08-26-ai-model-family-video-generation)。

### 官方自報：Seed2.1 對上 2026 年中的前沿模型

以下摘自 [Seed2.1 產品頁](https://seed.bytedance.com/en/seed2_1)與 model card，全部是字節公布的數字。對手是 Claude Opus 4.7、GPT-5.5、Gemini 3.1 Pro，也就是 2026 年 6 月發佈時的前沿，不是今天的最新版本：

| Benchmark | Seed2.1 Pro | Seed2.1 Turbo | Claude Opus 4.7 | GPT-5.5 | Gemini 3.1 Pro |
|---|---|---|---|---|---|
| GDPval | 87.9 | 82.7 | 82.7 | 84.9 | 67.3 |
| Workspace Bench | 53.0 | 54.7 | 55.1 | 58.7 | 32.8 |
| Terminal Bench 2.1 | 71.0 | 67.6 | 71.7 | 73.8 | 70.7 |
| NL2Repo-Bench | 47.0 | 43.7 | 58.2 | 45.1 | 33.4 |
| DeepSWE | 32.7 | 23.0 | 54.0 | 70.0 | 10.0 |
| SWE-Atlas | 35.2 | 30.6 | 38.7 | 44.7 | 23.6 |
| MMMU-Pro（含工具） | 82.7 | 82.2 | 74.0 | 81.2 | 80.5 |
| BabyVision | 73.7 | 62.9 | 22.2 | 55.9 | 54.4 |

讀法：

- **辦公與經濟價值任務是強項。** GDPval 87.9 是表上最高；Turbo 的 82.7 與 Claude Opus 4.7 同分。Workspace Bench 則除了 Gemini 3.1 Pro 之外四款接近。
- **視覺理解領先幅度最大。** BabyVision、MMMU-Pro、影片理解（VideoMME Pro 89.2、Turbo 89）都在對手之上。model card 也寫 MobileWorld 手機 GUI 任務拿到最高分。
- **難的程式修復明顯落後。** DeepSWE 上 Pro 32.7、Turbo 23.0，GPT-5.5 是 70.0、Claude Opus 4.7 是 54.0；model card 自己也寫 GPT-5.5 在最難的程式修復任務上明顯領先。Terminal Bench 2.1 則接近前沿。
- **Turbo 不一定比 Pro 弱。** Workspace Bench 與 BeyondAIME（88.0 對 87.0）Turbo 還略高，差距主要出現在 DeepSWE、Agent Startup Bench（54.0 對 68.8）與 TOMATO 動作感知（56.8 對 79.5）。

model card 另有一項群眾評測：匿名開發者比較各模型輸出，Seed2.1 的偏好排名高於 Claude Opus 4.6。這是 Seed 自己辦的評測，任務分布也由 Seed 決定。

### Seedream 5.5 與 Seed Audio 1.0（自報）

- **Seedream 5.5**：在 MagicArena 平台找資深評測員比較電商、行銷、影視、遊戲、辦公、服裝設計六種場景，六種都比 Seedream 5.0 Pro 好，影視與辦公場景的可用率是上一代兩倍以上；中英文小字的嚴重文字崩壞率 0.4%、輕微 1.7%。對 GPT Image 2.5 Sunburst 與 Nano Banana 2.1 宣稱文字結構與文生圖真實感領先，但第三方的 AA 榜上兩者都排在 Seedream 5.5 前面。
- **Seed Audio 1.0**：多數場景（影視、短劇、動畫、Podcast、直播銷售等）可用率超過 90%，多數語言自然度 MOS 高於 4.0；越南語的複雜指令遵循沒有超過 3.5，是官方自己標出的弱項。

### 開放權重：Seed-OSS-36B（自報）

[Seed-OSS-36B-Instruct 模型卡](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct)的數字是 2025 年 8 月的對照組（Qwen3-30B-A3B-Thinking-2507、gpt-oss-20b、Qwen3-32B）：AIME25 84.7、LiveCodeBench v6 67.4、SWE-Bench Verified（OpenHands）56、TAU1-Retail 70.4。一年後的今天，同尺寸的開放權重模型已經換了好幾代，這組數字只能證明它在發佈當時有競爭力。

## 授權、價格與部署

### 主力模型：閉源 API，依通路計價

主力模型沒有權重，使用條款是各平台的服務協議（火山方舟頁面附「豆包模型服務協議」）。三個通路的牌價：

| 型號 | 火山引擎（人民幣／百萬 tokens） | BytePlus（美元） | OpenRouter（美元） |
|---|---|---|---|
| Seed2.1 Pro | ¥6／¥30，快取命中 ¥1.2 | 未列 | 未上架 |
| Seed2.1 Turbo | ¥3／¥15，快取命中 ¥0.6 | $0.50／$2.50，快取 $0.10 | $0.50／$2.50 |
| Seed2.1 Lite | ¥0.8／¥2.7（音訊輸入 ¥12） | 未列 | 未上架 |
| Seed2.0 Lite | 依輸入長度分段，¥0.6／¥3.6 起 | $0.25／$2.00 | $0.25／$2.00 |
| Seed2.0 Mini | 依輸入長度分段，¥0.2／¥2.0 起 | $0.10／$0.40 | $0.10／$0.40 |

價格取自[火山方舟模型價格](https://ark.volcengine.com/region:cn-beijing/docs/model-pricing)、[BytePlus ModelArk 定價](https://docs.byteplus.com/en/docs/modelark/model-pricing)與 [OpenRouter](https://openrouter.ai/bytedance-seed/seed-2-1-turbo)。幾個細節：

- **離峰與批次約半價。** 火山引擎的「低優」與批量推理約為常規價的 50%，BytePlus 對應的是 Flex（Turbo $0.25／$1.25）。快取命中價不打折。
- **Seed2.1 取消了長度分段。** Seed2.0 依輸入長度分三段計價（128K–256K 的單價是 32K 以內的三倍）；Seed2.1 三款都是單一價格，Turbo 上限 256K，Pro 與 Lite 的計價區間到 1,024K。
- **OpenRouter 只是轉送。** Turbo 唯一的 provider 就是 Seed 本身（FP8），實際成交的快取命中率 76%。
- **生成模型按張、按秒計。** Seedream 5.5 每張 ¥0.13（約 1.5K 以下）或 ¥0.23（約 2K 以下）；BytePlus 是 $0.020／$0.035，參考圖每張另收 $0.008。Seed Audio 1.0 在 OpenRouter 是每分鐘 $0.15，單次最多 120 秒。Seedance 2.5 依解析度與 token 用量計價，720p 5 秒在火山引擎估算約 ¥7.56。

### 開放權重：Apache 2.0，但都是研究線

[Hugging Face 的 ByteDance-Seed 組織](https://huggingface.co/ByteDance-Seed)有 63 個模型，大多是論文配套（影像修復、蛋白質、定理證明、可解釋性等）。值得選型的是兩個：

- **Seed-OSS-36B**：[LICENSE](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct/blob/main/LICENSE.txt) 是未修改的 Apache 2.0，沒有營收或月活門檻。模型卡特別註明它主要針對國際（i18n）用途優化。
- **UI-TARS-1.5-7B**：看螢幕截圖輸出操作的 GUI agent 模型，Apache 2.0，OpenRouter 上有託管（每百萬 tokens $0.10／$0.20、128K context）；近 30 天下載量是這個組織裡最高的。

Seed-Coder-8B 系列另採 MIT 授權。Seed 系列新的研究權重（例如 11 月的 Cola2 連續潛空間語言模型）有些沒有標授權，使用前要先確認。

### 採用程度

只列可查數字：

- **Hugging Face 下載與衍生模型**（下載為近 30 天／累計，衍生為以它為 base model 的 repo 數）：UI-TARS-1.5-7B 228,551／4,723,023、衍生 28；Seed-OSS-36B-Instruct 44,136／460,823、衍生 66；SeedVR2-3B（影片修復）41,691／288,938、衍生 28；BAGEL-7B-MoT 累計 54,566、衍生 92。
- **Ollama**：官方 library 沒有任何 ByteDance Seed 模型；社群上傳的 Seed-OSS-36B-Instruct 1,624 次、UI-TARS 5,198 次下載。
- **OpenRouter 使用量**（近 7 天 token）：Seed 2.1 Turbo 5.12B、Seed-2.0-Lite 4.17B、Seedream 5.0 Flash 3.19B、Seedream 5.5 2.24B。Turbo 的公開流量來源裡 Claude Code 排第二。
- **雲端上架**：火山引擎方舟（Seed2.1 全系列，含 Pro、Lite）、BytePlus ModelArk（Seed2.1 Turbo、Seed2.0、Seedream、Seedance、Seed Audio）。

## Agent 使用與選型

- **辦公文件、報告、簡報類 agent** → Seed2.1 Pro（中國通路）或 Turbo（國際）。GDPval 與 Workspace Bench 是它表現最好的類型，Turbo 的辦公任務分數接近 Pro。
- **需要看圖、看影片、讀圖表的 agent** → Seed2.1。視覺與影片理解是它相對前沿模型領先最多的地方；要吃音訊或 1M context 改用 Lite。
- **手機 GUI 自動化** → Seed2.1（官方 MobileWorld 最高分）；要自架、可微調的小模型用 UI-TARS-1.5-7B。
- **主力 coding agent** → 不建議當首選。Terminal Bench 接近前沿，但 DeepSWE 落後一大截；可以當便宜的第二意見或前端生成，難的修復交給別的模型。
- **電商、行銷素材流水線** → Seedream 5.5。固定每張價格好估預算，原生 RGBA 省去去背，連續改圖不掉畫質；畫質排名要頂尖的仍是 GPT Image 與 Nano Banana。
- **配音、短影音、遊戲在地化** → Seed Audio 1.0。一次產生帶環境聲的場景音訊，並能指定台詞進場時間。
- **長敘事影片** → Seedance 2.5，選型細節見[影片家族文](/posts/tech/2026-08-26-ai-model-family-video-generation)。
- **一定要開放權重或地端部署** → Seed-OSS-36B（Apache 2.0、512K），但它是 2025 年的模型；要更新的中國開放權重，看 [Qwen](/posts/tech/2026-08-24-ai-model-family-qwen)、[DeepSeek](/posts/tech/2026-08-24-ai-model-family-deepseek) 或 [Tencent Hy](/posts/tech/2026-11-23-ai-model-family-tencent-hy)。

最小的選型驗證：Seed2.1 Turbo 在 OpenRouter 上相容 OpenAI 與 Anthropic Messages 格式，可以直接接進 Claude Code 這類 host。拿同一組自己的 agent 任務，分別用 `reasoning_effort` 的 `minimal` 與預設的 `high` 跑，比較完成率與輸出 token；再挑幾個需要讀圖表或截圖的任務，這是它最可能贏過同價位模型的地方。

## 限制與取捨

- **評測幾乎全是自報。** Seed2.1 沒有 Artificial Analysis 或其他獨立整體分數，官方表裡一半以上是 Seed 自建的評測，對手也停在 2026 年 6 月的版本。
- **國際通路不完整。** Pro 和 Lite 只在火山引擎；BytePlus 與 OpenRouter 只有 Turbo，OpenRouter 也只有 Seed 一家 provider，沒有備援。
- **難的程式修復落後。** DeepSWE 的差距是官方自己公布的數字，不是第三方挑出來的。
- **開放權重沒有跟上主線。** Seed-OSS 與 UI-TARS 都是 2025 年的模型，主力世代沒有任何權重；需要地端或可稽核權重的團隊，Seed 不是好選項。
- **服務條款與資料政策要另外看。** 主力模型只能透過字節的雲端使用，資料存放位置與合規要依火山引擎（中國）或 BytePlus（國際，ModelArk 位於 ap-southeast-1 區域）的條款判斷。

Seed 的策略跟 Qwen、DeepSeek 相反：不靠開放權重擴散，而是靠豆包、即夢、TRAE 這些自家產品累積使用回饋，再把模型賣給企業。對外部開發者來說，Seed2.1 Turbo 是價格中段、視覺理解特別強的閉源選項，Seedream 5.5 與 Seed Audio 1.0 則是多模態內容流水線值得排進比較的低價選擇。

## 參考資料

- [Seed2.1 Officially Released: Advancing AI Productivity — ByteDance Seed 官方部落格](https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity)
- [Seed2.1 正式发布，深入 AI 生产力 — ByteDance Seed 官方部落格（簡體中文）](https://seed.bytedance.com/zh/blog/seed2-1-officially-released-advancing-ai-productivity)
- [Seed2.1 產品頁（評測表）](https://seed.bytedance.com/en/seed2_1)
- [Seed2.1 Model Card（PDF）](https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2.1/Seed2_1_Model_Card.pdf)
- [Seed-2.1-Preview Model Release on Arena — ByteDance Seed](https://seed.bytedance.com/en/blog/seed-2-1-preview-model-release-on-arena)
- [Seed Models — ByteDance Seed](https://seed.bytedance.com/en/models)
- [Seed Model Portfolio — ByteDance Seed](https://seed.bytedance.com/en/seed_model_portfolio)
- [Seed1.6 — ByteDance Seed（MoE 規模、AdaCoT）](https://seed.bytedance.com/en/seed1_6)
- [Seed1.8 — ByteDance Seed](https://seed.bytedance.com/en/seed1_8)
- [Seed 2.0 Official Launch — ByteDance Seed](https://seed.bytedance.com/en/blog/seed-2-0-official-launch)
- [Seed2.0 產品頁與 Model Card](https://seed.bytedance.com/en/seed2)
- [Introducing Seedream 5.5 — ByteDance Seed](https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5)
- [Seedream 5.5 发布 — ByteDance Seed（簡體中文，上線通路）](https://seed.bytedance.com/zh/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5/)
- [Introducing Seed Audio 1.0 — ByteDance Seed](https://seed.bytedance.com/en/blog/from-speech-to-audio-creation-introducing-the-seed-audio-1-0-audio-creation-model)
- [Seed Audio 1.0 產品頁](https://seed.bytedance.com/en/seedaudio1_0)
- [Introducing Seedance 2.5 — ByteDance Seed](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5)
- [火山方舟模型價格（簡體中文）](https://ark.volcengine.com/region:cn-beijing/docs/model-pricing)
- [Doubao-Seed-2.1-turbo — 火山方舟模型詳情（簡體中文）](https://ark.volcengine.com/region:cn-beijing/model/detail?Id=doubao-seed-2-1-turbo)
- [Doubao-Seed-2.1-lite — 火山方舟模型詳情（簡體中文）](https://ark.volcengine.com/region:cn-beijing/model/detail?Id=doubao-seed-2-1-lite)
- [BytePlus ModelArk Pricing](https://docs.byteplus.com/en/docs/modelark/model-pricing)
- [ByteDance Seed: Seed 2.1 Turbo — OpenRouter](https://openrouter.ai/bytedance-seed/seed-2-1-turbo)
- [ByteDance Seed 模型清單與使用量 — OpenRouter](https://openrouter.ai/bytedance-seed)
- [ByteDance Seed Models — Artificial Analysis](https://artificialanalysis.ai/models/creators/bytedance_seed)
- [AA-Image-T2I v2.1 Leaderboard — Artificial Analysis](https://artificialanalysis.ai/text-to-image/arena/leaderboard-text)
- [ByteDance-Seed — Hugging Face 組織](https://huggingface.co/ByteDance-Seed)
- [ByteDance-Seed/Seed-OSS-36B-Instruct — Hugging Face 模型卡](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct)
- [Seed-OSS-36B LICENSE（Apache 2.0）](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct/blob/main/LICENSE.txt)
- [ByteDance-Seed/UI-TARS-1.5-7B — Hugging Face](https://huggingface.co/ByteDance-Seed/UI-TARS-1.5-7B)
- [milkey/Seed-OSS-36B-Instruct — Ollama（社群上傳）](https://ollama.com/milkey/Seed-OSS-36B-Instruct)
- [影片生成模型家族](/posts/tech/2026-08-26-ai-model-family-video-generation) — 本站，Seedance 2.5 的比較與定價
- [中國區域週報：豆包 Work 與辦公 Agent 大戰](/posts/daily/2026-08-28-region-china) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
