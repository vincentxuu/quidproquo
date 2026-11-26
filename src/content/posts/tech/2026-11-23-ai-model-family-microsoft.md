---
title: "Microsoft 自研模型——MAI 的 Code 2、Thinking 1 與語音圖像線，加上 Phi 和 Research 的開放權重小模型"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, microsoft, model-family-microsoft, moe, open-source, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Microsoft 的自研模型分兩條線。Microsoft AI（MAI）做閉源託管模型：主力是 Ignite 推出的 MAI Code 2（約 2.8T 總參數、77B 啟用、1M context，只在 GitHub Copilot）與 Code 2 Flash（Copilot＋Foundry），另有推理模型 MAI Thinking 1、圖像 MAI Image 2.7、轉錄 MAI Transcribe 2 與語音 MAI Voice 2.1，全部不給權重、價格壓在對手的幾分之一，但文字模型目前只有微軟自報分數。Microsoft Research 與 Windows 團隊則放出 MIT／Apache 授權的小模型：Phi-4-reasoning-vision-15B、瀏覽器 agent Fara1.5、4B 桌面 agent Mage-VL-Cowork 與 Windows 內建的 Aion 1.0。"
description: "Microsoft 自研模型家族介紹：MAI Code 2／Code 2 Flash、Thinking 1、Cyber 2 Flash、Image 2.7、Transcribe 2、Voice 2.1、Realtime 1 的規格、價格與通路，Phi、Fara、Mage、Aion 等開放權重線，2024→2026 演化時間線、官方與第三方評測的邊界，以及 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 38
draft: false
glossary:
  - term: "MAI（Microsoft AI）"
    aliases: ["Microsoft AI"]
    definition: "Microsoft 由 Mustafa Suleyman 領導的 AI 部門，負責從頭預訓練的閉源模型（MAI Code、Thinking、Image、Transcribe、Voice 等），與 Microsoft Research 的開放權重線分開"
  - term: "MSBench"
    definition: "Microsoft 內部的 agent 評測平台；MAI Code 系列的官方分數都是在這裡用 GitHub Copilot CLI 當 harness 跑出來的"
  - term: "Computer-use agent（CUA）"
    aliases: ["CUA"]
    definition: "看螢幕截圖、輸出點擊與鍵盤等動作來操作電腦或瀏覽器的 agent 模型"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-microsoft-en)

這篇介紹 Microsoft 自己訓練的模型，不含 Azure 上代管的 OpenAI 或 Anthropic 模型。寫給兩種讀者：在 GitHub Copilot 或 Microsoft Foundry 上選模型、想知道 MAI 那幾個名字差在哪的人；以及想找 MIT 授權小模型來自架的人。讀完應該能決定：哪些工作可以交給便宜的 MAI 模型、哪些要等第三方評測，以及 Phi、Fara、Mage 各適合哪種本機部署。

2026 年 11 月的局面是：Microsoft AI 在 11 月 17 日的 Ignite 一次推出七個模型，主角是寫程式用的 MAI Code 2 與 Code 2 Flash；開放權重那一側，最新的通用 Phi 仍是 3 月的 Phi-4-reasoning-vision-15B，沒有 Phi-5。

怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

Microsoft 的自研模型由兩個組織分別發佈，取得方式完全不同：

- **Microsoft AI（MAI）**：從頭預訓練的閉源模型，只透過 GitHub Copilot、Microsoft Foundry、少數合作平台（OpenRouter、fal、Vercel）與微軟自家產品提供，不散布權重。
- **Microsoft Research 與 Windows 團隊**：在 Hugging Face 的 [`microsoft` 組織](https://huggingface.co/microsoft)放出 MIT 或 Apache 2.0 授權的開放權重，以小模型與 computer-use agent 為主。

以下價格每 1M tokens，來源見各列：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式與價格 |
|---|---|---|---|
| MAI Code 2 | 日常企業 coding 主力 | 約 2.8T 總參數、77B 啟用；1M context；文字＋圖片輸入；五段 reasoning effort | 只在 GitHub Copilot（Pro 以上）：$0.50／$2.50，快取 $0.025（促銷價至 2027-05-17，之後 $1／$5） |
| MAI Code 2 Flash | 高量、低價 coding | 約 398B 總參數、12B 啟用；1M context | Copilot（含 Free）與 Foundry 限量預覽：$0.05／$0.25（至 2027-05-17，之後 $0.10／$0.50） |
| MAI Thinking 1 | 通用推理 | 約 1T 總參數、35B 啟用；256K context；function calling | Foundry public preview：$2／$8，快取 $0.20 |
| MAI Cyber 2 Flash | 資安漏洞掃描 | 1M context；以微軟安全資料訓練 | 只進 Microsoft 安全產品（MDASH 等），不對外開 API |
| MAI Image 2.7／2.7 Flash | 圖像生成與編輯 | 2.7 偏品質、Flash 偏速度；支援透明背景 | Foundry public preview、OpenRouter 等：約 $35 與 $10／千張 |
| MAI Transcribe 2（＋Streaming） | 批次與即時轉錄 | 60 語言、說話者分離、逐字時間戳 | Foundry／Azure Speech：$0.10／小時（限時至 2026-12-31）；Streaming $0.54／小時 |
| MAI Voice 2.1／2.1 Flash | 文字轉語音 | 23 語言、同一聲音跨語言、幾秒參考音訊即可複製聲音 | Foundry、OpenRouter：$22 與 $15／1M 字元 |
| MAI Realtime 1 | 語音對語音 | 相容 OpenAI Realtime API | MAI Labs 試用＋登記：$0.01／音訊分鐘，推理另計 |
| Phi-4-reasoning-vision-15B | 開放權重視覺推理 | 15B、16K context；可切換思考／不思考 | Hugging Face，MIT；Foundry |
| Fara1.5（4B／9B／27B） | 開放權重瀏覽器 agent | 以 Qwen3.5 微調；262K context | Hugging Face，MIT |
| Mage-VL-Cowork | 開放權重桌面 agent | 4B，GUI 與終端機雙通道 | Hugging Face，Apache 2.0 |
| Aion 1.0 Instruct | Windows 內建小模型 | 2.3B、32K context、8 種語言 | Hugging Face，MIT；2027-01 底前進 Windows |

Code 系列價格出自 [GitHub Copilot 價格表](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)，Thinking 1 與圖像出自 Azure 零售價目，語音與轉錄出自 MAI 各模型的發佈文。

三件先知道的事：

- **最強的 MAI Code 2 不在 Foundry。** [模型卡](https://microsoft.ai/pdf/MAI-Code-2-And-MAI-Code-2-Flash-Model-Card.pdf)寫明 Foundry 只提供 Code 2 Flash；想用 Code 2 寫自己的 agent，目前只能走 Copilot。官方說之後會上 OpenRouter、Vercel 等平台，但還沒有日期。
- **MAI 的文字模型沒有權重。** 唯一的例外是 Ignite 宣布的 [MAI Licensed Weights](https://microsoft.ai/news/introducing-mai-licensed-weights/)：讓企業在自己的 Azure 環境部署、微調 MAI 模型，但要透過微軟的 Frontier Company 合作案，還沒開放。
- **開放權重線多半不是從頭訓練。** Phi 是 Microsoft 從頭訓練的；Fara1.5 是在 Qwen3.5 上微調，Mage-VL 的語言解碼器是 Qwen3-4B，只有視覺編碼器 Mage-ViT 從頭訓練。

### 其他子線

- **決策模型**：Microsoft-Decision-1.1 回傳選項機率、不生成文字，見[決策模型怎麼選](/posts/tech/2026-10-22-ai-model-family-decision-models)。
- **MAI Work Flash**：由 Code 2 Flash 再最佳化，服務 Excel、PowerPoint、Word、Teams 與 FabricIQ，不單獨對外販售。
- **語音辨識與嵌入的開放權重**：VibeVoice-ASR（含 1.5B／7B 串流版）與 harrier-oss-v1 嵌入模型（270M、0.6B、27B）都是 MIT。harrier 27B 在[用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)的嵌入一節有分數。
- **Phi 的小分支**：GUI 定位的 Phi-Ground-Any、醫療的 MediPhi、MoE 版的 Phi-mini-MoE 與 Phi-tiny-MoE。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| Phi-3／3.5 | 2024-04／2024-08 | 3.8B 的 Phi-3-mini 主打在裝置上跑，MIT 授權；3.5 加了 MoE 與視覺版 | — |
| Phi-4 | 2024-12 | 14B、16K context，以大量合成資料訓練、主打數學與推理；至今仍是 OpenRouter 上唯一的 Phi | — |
| Phi-4-mini／multimodal／reasoning | 2025-02～04 | 小模型開始有 function calling、語音輸入與推理版 | — |
| MAI-DS-R1 | 2025-04 | MAI 在 DeepSeek-R1 上後訓練的開放權重，不是自研底座 | — |
| MAI-Voice-1、MAI-1-preview | 2025-08-28 | MAI 第一批自研模型；MAI-1-preview 是約 15,000 張 H100 訓練的 MoE，只在 LMArena、Copilot 與受邀測試者的 API 上測試 | — |
| MAI-Image-1 | 2025-10-13 | 第一個自研圖像模型，進 Bing Image Creator | — |
| MAI Transcribe 1、Voice 1、Image 2 進 Foundry | 2026-04-02 | MAI 模型第一次讓所有開發者透過 API 付費使用 | — |
| Build：Thinking 1、Code 1 Flash 等七個模型 | 2026-06-02 | MAI 第一個推理模型與第一個 coding 模型；Code 1 Flash 只有 5B 啟用 | — |
| MAI Code 1.1 Flash | 2026-08-11 | 138B／5B 啟用、256K，價格降到 1.0 的約四分之一；10 月加了可本機跑的 3-bit 版 | — |
| Thinking 1 public preview、Cyber 1 Flash | 2026-08-12／13 | Thinking 1 在 Foundry 開放，$2／$8；第一個資安專用模型進 MDASH | — |
| Transcribe 2、Image 2.6、Voice 2.1 | 2026-09～10 | 轉錄加說話者分離並降到 $0.10／小時；Voice 擴到 23 語言 | — |
| Mage-VL-Cowork | 2026-10-30 | 4B 開放權重桌面 agent，GUI 與終端機在同一個策略裡 | [模型卡](/posts/daily/2026-11-02-model-microsoft-mage-vl-cowork) |
| Ignite：Code 2、Cyber 2 Flash、Image 2.7、Realtime 1 | 2026-11-17 | Code 換到 MAI-Base-2 底座、context 到 1M；Licensed Weights 預告 | — |
| Aion 1.0 Instruct | 2026-11-18 | Windows 內建小模型的下一代（接替 Phi Silica），先放 MIT 權重 | — |

一年多的主軸是兩件事。第一，MAI 從「Copilot 內部用的消費者模型」轉成按任務切分的企業產品線：coding、推理、資安、圖像、轉錄、語音各一條，每條都主打價格。第二，底座在變大：Code 1.x Flash 是 5B 啟用，Code 2 換到 10 月完成預訓練的 [MAI-Base-2](https://microsoft.ai/news/frontier-pre-training-at-microsoft-ai/)（約 2.8T 總參數、80B 啟用）。Phi 這一側反而放慢：Phi-4 之後只有分支版本，Windows 內建小模型改名 Aion。

## 架構與訓練取捨

### MAI Code 2：大底座、長 context，訓練直接跑在 Copilot

[MAI Code 2 模型卡](https://microsoft.ai/pdf/MAI-Code-2-And-MAI-Code-2-Flash-Model-Card.pdf)列出的公開資訊：

- **兩個尺寸、同一套配方**：都是帶視覺編碼器的稀疏 MoE decoder。Code 2 約 2.8T 總參數、77B 啟用另加 3B 嵌入參數，預訓練約 50T tokens，再用約 150B tokens 延伸到 1M context。Code 2 Flash 約 398B 總參數、12B 啟用，預訓練約 25T tokens（其中 3T 是圖像），用 logit distillation 向一個更大的內部 MAI 模型學。
- **強化學習直接跑在產品 harness**：RL 環境就是 GitHub Copilot CLI 與 VS Code 的 agent harness，目的是讓離線分數對應實際使用。代價是官方分數也都在同一個 harness 上量，換到別的 agent 框架表現未必一樣。
- **context 上限**：總長 1,050,000 tokens，輸入最多 922,000、輸出最多 128,000；reasoning effort 有 low 到 max 五段。

讀規格時要注意，模型卡開頭的摘要表寫「50B-100B (80B active)」，跟第 1 節的 2.8T 總參數對不上；本文依第 1 節的文字敘述。

MAI 一再強調「不從第三方模型蒸餾、資料可追溯」，這是它跟多數開放權重模型的主要差異，也是 Licensed Weights 的賣點。Code 2 Flash 的 logit distillation 用的是 MAI 自家的 teacher，跟這個說法不衝突。

### MAI Thinking 1：中型推理模型

[Thinking 1 發佈文](https://microsoft.ai/news/introducing-mai-thinking-1/)只揭露約 1T 總參數、35B 啟用的稀疏 MoE，256K context，安全與能力用同一套 RL 獎勵一起訓練（把不安全的順從和不必要的拒答都當成缺陷）。架構細節與訓練資料量沒有公開。它是 Cyber 1 Flash 的來源，Code 2 則改用新的 MAI-Base-2。

### Phi 與 Research 開放權重：小、可本機跑，但多半英文

- **Phi-4-reasoning-vision-15B**：[模型卡](https://huggingface.co/microsoft/Phi-4-reasoning-vision-15B)寫明是 Phi-4-Reasoning 加 SigLIP-2 視覺編碼器的 mid-fusion 架構，用 240 張 B200 訓練 4 天。同一個模型可以用 `<think>` 做長推理，或用 `<nothink>` 直接回答。context 只有 16K，主要針對英文。
- **Fara1.5**：[模型卡](https://huggingface.co/microsoft/Fara1.5-27B)說明它只看螢幕截圖、不讀 DOM，直接輸出像素座標的點擊動作；訓練資料由多 agent 管線 FaraGen1.5 合成並驗證。訓練時就教它在輸入個資、付款、送出、登入前停下來問使用者。
- **Mage-VL-Cowork**：視覺編碼器從頭訓練、按影片編碼器的重要度分配 token，再用五階段課程把 GUI 操作與終端機執行合進同一個策略，細節見[模型卡文章](/posts/daily/2026-11-02-model-microsoft-mage-vl-cowork)。
- **Aion 1.0**：[模型卡](https://huggingface.co/microsoft/Aion-1.0-Instruct-2.3B)寫明 2.29B、28 層、21 層滑動視窗加 7 層全注意力，訓練資料延續 Phi Silica。多語資料只占約 6%。

## 評測與競品比較

### 第三方：多模態有，文字模型還沒有

- **圖像**：MAI 引述 Artificial Analysis 的 AA-Image-Editing v2.1，MAI Image 2.7 以 1,215 Elo 排第 1，領先 GPT Image 2.6 Sunburst (max) 4 分（[發佈文註腳](https://microsoft.ai/news/introducing-mai-image-2-7/)，截至 2026-11-16）。[用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)的圖像表也是這個分數，並指出它是前五名裡最便宜的。
- **轉錄**：Artificial Analysis 的字錯誤率榜上，MAI Transcribe 2 是 2.0%，排第 2（[模型頁](https://microsoft.ai/models/mai-transcribe-2/)）；跟其他 API 與開放權重的比較見[語音音訊家族文](/posts/tech/2026-08-26-ai-model-family-speech-audio)。
- **決策**：Microsoft-Decision-1.1 在 Artificial Analysis Decision Index v2.1 是 67.8，見[決策模型文](/posts/tech/2026-10-22-ai-model-family-decision-models)。
- **文字模型**：MAI Thinking 1、Code 2、Code 2 Flash 在 Artificial Analysis Intelligence Index 都沒有實測分數。第三方網站上看到的 Thinking 1 分數是用其他 benchmark 推估的，不是實測。

### 官方自報：MAI Code 2 與 Code 2 Flash

[模型卡](https://microsoft.ai/pdf/MAI-Code-2-And-MAI-Code-2-Flash-Model-Card.pdf)只公布自家兩個模型的分數，條件是 MSBench、GitHub Copilot CLI 1.0.102、關閉 subagent、max reasoning、每題跑三次取平均：

| Benchmark | MAI Code 2 | MAI Code 2 Flash |
|---|---|---|
| DeepSWE 1.1 | 73.2% | 59.9% |
| Terminal-Bench 2.1 | 84.6% | 78.3% |
| SWE Atlas | 43.1% | 44.8% |

[發佈文](https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/)則只給比例：四個 benchmark（上面三個加 FrontierCode v1.1）平均，Code 2 有 GPT-6.1 Sol 98% 的表現、成本 40%；有 Claude Opus 5.5 96% 的表現、成本 5%。Code 2 Flash 跟 GPT-6 Luna、Claude Haiku 5.5 表現相當，成本分別是 65% 與 20%。成本都用 50% 的促銷價計算。

[InfoWorld](https://www.infoworld.com/article/4250152/microsoft-launches-mai-code-2-models-to-challenge-openai-and-anthropic-in-ai-coding.html) 轉述了微軟發表時的逐項圖表：四項平均 Code 2 63.2%、GPT-6.1 Sol 64.1%、Claude Opus 5.5 65.3%。落差集中在 SWE Atlas，Code 2 是 43.1%，Claude Opus 5.5 是 57.5%。

讀法：

- **日常 coding 接近前沿，長程與大型 codebase 理解有落差。** SWE Atlas 是在 18 個大型 repo 做問答、寫測試與重構，Code 2 在這裡輸最多。官方也明說沒有針對「非常長程的 agentic 工作」調校。
- **Flash 不是全面較弱。** SWE Atlas 上 Flash 還略高於 Code 2，差距 1.7 個百分點，三次平均下可以視為相當。
- **同一份模型卡有兩組不同的分數。** 安全評估一節的 advanced autonomy 表寫 Code 2 的 DeepSWE 1.1 是 60.2%、SWE Atlas 80.9%，跟效能一節不同，條件沒有說明。引用時用效能一節的表。
- **對齊程度的自評**：模型卡說兩個模型的對齊程度「與 GPT-5.6 Sol 相近，但不如 GPT-6」。

### 官方自報：MAI Thinking 1 與多模態

- **Thinking 1**：AIME 2025 97.0%、AIME 2026 94.5%；SWE-Bench Pro 與 Claude Opus 4.6 相當；在 Surge 專業評分員的 1,276 題盲評中勝過 Claude Sonnet 4.6。比較對象是上一代模型，跟 Code 2 的比較對象不同世代。
- **Transcribe 2**：FLEURS 60 種語言平均字錯誤率 5.2%（前 25 種語言 3.4%），1 小時音訊約 10 秒轉完；官方說比 GPT-Transcribe 快 10 倍、比 Scribe v2 快 7 倍（[發佈文](https://microsoft.ai/news/mai-transcribe-2-is-the-fastest-most-accurate-and-cheapest-speech-recognition-model-in-the-world/)）。
- **Realtime 1**：官方說在 Big Bench Audio 與 τ-Voice 上勝過 GPT-Realtime 2.1，沒有公布分數。
- **Cyber 2 Flash**：CyberGym-E2E 92.3%，GPT-6 Astra 91.5%。微軟發現 905 題裡有 92 題跟自家訓練資料出自同一批開源專案與漏洞報告，所有模型都排除這 92 題後計分。

### 開放權重

- **Fara1.5**（官方自報，[模型卡](https://huggingface.co/microsoft/Fara1.5-27B)）：WebVoyager 4B／9B／27B 分別 80.8、86.6、89.3；Online-Mind2Web 57.3、63.4、72.3；WebTailBench 27.4、32.3、40.2。
- **Mage-VL-Cowork**：OSWorld-Verified 66.0%（50 步），是 4B 級最高，但瀏覽器任務輸給專做瀏覽器的 Fara1.5-4B。
- **Phi-4-reasoning-vision-15B**：AI2D 84.8、ChartQA 83.3、MathVista 75.2、MMMU 54.3、ScreenSpot-V2 88.2（官方以 VLMEvalKit 自測）。

## 授權、價格與部署

### 權重授權

- **MIT**：Phi 全系列、Fara1.5、Aion 1.0、VibeVoice、harrier。Phi-4 與 Aion 的 repo 附 MIT 授權全文；Phi-4-reasoning-vision-15B 與 Fara1.5 只在模型卡 metadata 標 MIT。
- **Apache 2.0**：Mage-VL 與 Mage-VL-Cowork（附授權全文）。Fara1.5 與 Mage-VL 的底座來自 Qwen，自架時要一併看 Qwen 原始權重的條款。
- **MAI**：沒有權重授權。Code 2 模型卡列的使用條件是 Microsoft Enterprise AI Services Code of Conduct、Microsoft Product Terms 中的 Foundry 條款，以及 Azure 預覽版補充條款。Thinking 1、Image 2.7、Transcribe 2 在 Foundry 仍是 public preview，適用 Azure 預覽版補充條款，正式上線前不要當成有 SLA 的服務。

### API 價格

- **Coding（GitHub Copilot 計價，每 1M tokens）**：Code 2 $0.50／$2.50、Code 2 Flash $0.05／$0.25，促銷價都到 2027-05-17，之後翻倍；上一代 Code 1.1 Flash $0.20／$1.20。Copilot Free 與 Student 方案只能用 Flash。
- **Thinking 1**：Foundry Global 部署 $2／$8，快取輸入 $0.20。
- **圖像**：Image 2.7 約 $35／千張、Flash 約 $10／千張；依 token 計價是文字輸入 $5、圖片輸入 $8、圖片輸出 $34（Flash 為 $1.75、$2.50、$10）。
- **語音與轉錄**：Transcribe 2 $0.10／小時（限時至 2026-12-31），Streaming $0.54／小時；Voice 2.1 $22、Flash $15（每 1M 字元）；Realtime 1 $0.01／分鐘，推理另計 $1／$5。
- **開放權重的託管**：OpenRouter 上只有 Phi-4 一個 Phi，$0.07／$0.14、16K context。

### 部署

- **MAI**：Copilot 內直接選模型；Foundry 的 Code 2 Flash 走 OpenAI 相容的 Responses API，Thinking 1 相容 Chat Completions API，Realtime 1 相容 OpenAI Realtime API，既有 OpenAI SDK 程式改端點就能測。
- **Phi-4-reasoning-vision-15B**：官方建議 vLLM、bf16，在 A6000、A100、H100、B200 上測過。
- **Fara1.5**：官方要求搭配 MagenticLite 或 fara CLI 的沙箱（Docker 瀏覽器、網域白名單、可隨時暫停），27B 建議至少兩張 GPU。
- **Mage-VL-Cowork**：4B，單卡可跑；模型卡要求只在隔離 VM 或沙箱裡執行。

## Agent 使用與選型

- **在 Copilot 裡做日常 coding agent** → Code 2 Flash 先跑、難的升 Code 2。兩者在 Copilot 價格表上都屬便宜的一檔，但長程、大型 codebase 的任務先用自己的 repo 比過 Claude 或 GPT。
- **在 Foundry 自建 coding agent** → 目前只能用 Code 2 Flash；要 Code 2 等級的能力，暫時得換別家模型。
- **一般推理與文件工作** → Thinking 1（$2／$8、256K）。官方的比較對象是 Claude Sonnet 4.6 與 Opus 4.6 這一代，沒有第三方分數，先跟手上的模型做對照測試。
- **轉錄、配音、語音 agent** → Transcribe 2（批次）、Transcribe 2 Streaming 加 Voice 2.1 Flash（低延遲對話）、或直接 Realtime 1。這一側有第三方分數，也是 MAI 最有價格優勢的地方。
- **圖像生成與編輯** → Image 2.7：第三方編輯榜第 1，官方說價格約 GPT Image 2.6 Sunburst (max) 的五分之一；大量產圖用 Flash。
- **要本機或離線跑** → 文件與圖表推理用 Phi-4-reasoning-vision-15B；瀏覽器 agent 用 Fara1.5；桌面與終端機混合操作用 Mage-VL-Cowork；Windows 裝置上的摘要與改寫用 Aion 1.0。全部只適合英文為主的工作。
- **要決策、路由** → Microsoft-Decision-1.1，見決策模型文。

最小的選型驗證：在 Copilot CLI 用同一組 issue 跑 Code 2 Flash、Code 2 與你目前的主力模型，記錄完成率、AI credits 與人工修改量。官方數字就是在這個 harness 上量的，同條件下最容易對照；換到其他框架再重測一次，看分數掉多少。

## 限制與取捨

- **文字模型只有自報分數。** Code 2 的逐項分數只有自家兩個模型，競品對照只有比例或媒體轉述的圖表；Thinking 1 也沒有獨立的整體評測。在 Artificial Analysis 或其他第三方上榜前，選型要靠自己的任務測。
- **長程 agent 不是設計目標。** 官方明說 Code 2 沒有針對科學研究與非常長程的 agentic 工作調校；模型卡也列出長 session 會重複呼叫工具、偏離指示、沒驗證就停下。
- **只對英文最佳化。** Code 2 寫明只針對英文程式產出；Phi、Fara、Aion 也以英文為主，中文工作要自己測。
- **價格有期限。** Code 系列的促銷價到 2027-05-17，Transcribe 2 的 $0.10 到 2026-12-31；長期預算要用原價算。
- **通路綁定。** Code 2 只在 Copilot、Cyber 2 Flash 只在微軟安全產品；MAI 沒有權重，Licensed Weights 也還沒開放，要可攜性的團隊不適合把核心流程押在 MAI 上。
- **開放權重線偏研究性質。** Fara1.5 與 Mage-VL 的底座來自 Qwen，而 Phi 的通用模型停在 Phi-4 世代、context 多在 16K 到 32K。

整體來說，MAI 的策略是把每個任務做成一個比前沿便宜很多的專用模型，先放進 Copilot、Office 與 Bing 這些自家產品，再開給 Foundry。對外部開發者而言，語音、轉錄與圖像已經有第三方佐證，可以直接排進評測清單；coding 與推理模型便宜得很有吸引力，但要等獨立評測，或自己先測。

## 參考資料

- [Seven new world-class models at scalable price-performance — Microsoft AI（Ignite 2026 總覽）](https://microsoft.ai/news/microsoft-ignite-2026/)
- [MAI Code 2 and Code 2 Flash — Microsoft AI](https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/)
- [MAI Code 2 and MAI Code 2 Flash 模型卡（PDF）](https://microsoft.ai/pdf/MAI-Code-2-And-MAI-Code-2-Flash-Model-Card.pdf)
- [MAI Code 2 and MAI Code 2 Flash in GitHub Copilot — GitHub Changelog](https://github.blog/changelog/2026-11-17-mai-code-2-and-mai-code-2-flash-in-github-copilot/)
- [Models and pricing for GitHub Copilot — GitHub Docs](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)
- [MAI Code 1.1 Flash — Microsoft AI](https://microsoft.ai/news/mai-code-1-1-flash-br-better-faster-at-a-quarter-of-the-cost/)
- [MAI-Code-1.1-Flash 模型卡（PDF）](https://microsoft.ai/pdf/MAI-Code-1.1-Flash-Model-Card.PDF)
- [Introducing MAI Thinking 1 — Microsoft AI](https://microsoft.ai/news/introducing-mai-thinking-1/)
- [New MAI models in Microsoft Foundry — Microsoft Community Hub（含 Thinking 1 價格）](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/new-mai-models-in-microsoft-foundry-across-text-image-voice-and-speech/4524632)
- [Building a hill-climbing machine: Launching seven new MAI models — Microsoft AI（Build 2026）](https://microsoft.ai/news/building-a-hillclimbing-machine-launching-seven-new-mai-models/)
- [Frontier Pre-training at Microsoft AI（MAI-Base-2）](https://microsoft.ai/news/frontier-pre-training-at-microsoft-ai/)
- [MAI Cyber 2 Flash — Microsoft AI](https://microsoft.ai/news/introducing-mai-cyber-2-flash/)
- [MAI Image 2.7 — Microsoft AI](https://microsoft.ai/news/introducing-mai-image-2-7/)
- [MAI Image 2.6 — Microsoft AI](https://microsoft.ai/news/pushing-the-quality-cost-frontier-with-mai-image-2-6/)
- [MAI Transcribe 2 — Microsoft AI](https://microsoft.ai/news/mai-transcribe-2-is-the-fastest-most-accurate-and-cheapest-speech-recognition-model-in-the-world/)
- [MAI Transcribe 2 模型頁](https://microsoft.ai/models/mai-transcribe-2/)
- [MAI-Transcribe-2 模型卡（PDF）](https://microsoft.ai/pdf/MAI-Transcribe-2-Model-Card.pdf)
- [MAI Transcribe 2 Streaming 與 MAI Voice 2.1 — Microsoft AI](https://microsoft.ai/news/our-first-streaming-transcription-model/)
- [MAI Realtime 1 — Microsoft AI](https://microsoft.ai/news/introducing-mai-realtime-1/)
- [MAI Licensed Weights — Microsoft AI](https://microsoft.ai/news/introducing-mai-licensed-weights/)
- [Two in-house models in support of our mission — Microsoft AI（MAI-Voice-1、MAI-1-preview）](https://microsoft.ai/news/two-new-in-house-models/)
- [Introducing MAI Image 1 — Microsoft AI](https://microsoft.ai/news/introducing-mai-image-1-debuting-in-the-top-10-on-lmarena/)
- [Microsoft launches MAI Code 2 models — InfoWorld](https://www.infoworld.com/article/4250152/microsoft-launches-mai-code-2-models-to-challenge-openai-and-anthropic-in-ai-coding.html)
- [microsoft/Phi-4-reasoning-vision-15B — Hugging Face](https://huggingface.co/microsoft/Phi-4-reasoning-vision-15B)
- [Introducing Phi-4-Reasoning-Vision to Microsoft Foundry — Microsoft Community Hub](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-phi-4-reasoning-vision-to-microsoft-foundry/4499154)
- [microsoft/phi-4 — Hugging Face](https://huggingface.co/microsoft/phi-4)
- [microsoft/Fara1.5-27B — Hugging Face](https://huggingface.co/microsoft/Fara1.5-27B)
- [microsoft/Mage-VL — Hugging Face](https://huggingface.co/microsoft/Mage-VL)
- [microsoft/Mage-VL-Cowork — Hugging Face](https://huggingface.co/microsoft/Mage-VL-Cowork)
- [microsoft/Aion-1.0-Instruct-2.3B — Hugging Face](https://huggingface.co/microsoft/Aion-1.0-Instruct-2.3B)
- [Microsoft: Phi 4 — OpenRouter](https://openrouter.ai/microsoft/phi-4)
- [MAI-Image-2.7 — OpenRouter](https://openrouter.ai/microsoft/mai-image-2.7)
- [模型卡｜Microsoft Mage-VL-Cowork](/posts/daily/2026-11-02-model-microsoft-mage-vl-cowork) — 本站
- [決策模型怎麼選](/posts/tech/2026-10-22-ai-model-family-decision-models) — 本站
- [語音與音訊模型](/posts/tech/2026-08-26-ai-model-family-speech-audio) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
