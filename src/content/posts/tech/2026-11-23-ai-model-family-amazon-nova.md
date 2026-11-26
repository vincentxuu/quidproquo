---
title: "Amazon Nova——Nova 2 Lite 與 Nova 2.5 Sonic 撐起主線，Premier、Canvas、Reel 已停用，開放權重只剩 Chronos"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, amazon, aws, bedrock, model-family-amazon-nova, voice-agent, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Amazon Nova 是只在 AWS 上取得的閉源模型家族。目前在架的主力是 Nova 2 Lite（1M context、可調推理、Bedrock 全球推論 $0.30／$2.50）與語音模型 Nova 2.5 Sonic；Nova 2 Pro 與 Omni 停在只給 Nova Forge 客戶的預覽，Premier、Canvas、Reel 已在 2026 年 9 月停用。Amazon 真正被大量下載的開放權重是時間序列模型 Chronos-2。適合已經在 AWS 上、重視資料留在帳號內與賠償條款的團隊；只看單價或分數，同價位有更好的選擇。"
description: "Amazon Nova 模型家族介紹：Nova 2 Lite、Nova 2.5 Sonic、Multimodal Embeddings、Nova Act、Nova Forge 的定位與 Bedrock 價格，2024→2026 演化與 Premier／Canvas／Reel 停用，技術報告與第三方評測，Chronos 時間序列開放權重，以及 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 43
draft: false
glossary:
  - term: "跨區域推論（Cross-Region Inference）"
    aliases: ["CRIS", "Global cross-region inference"]
    definition: "Bedrock 把請求轉送到同一地理區（Geo）或全球任一區（Global）執行的機制；Nova 2 Lite 走全球推論比單一區域便宜約一成，代價是資料可能離開原區域"
  - term: "Nova Forge"
    definition: "AWS 的年費制模型客製服務，客戶可從 Nova 預訓練、中段訓練或後訓練的檢查點接手，混入 Amazon 整理的訓練資料再做 SFT 與強化學習"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-amazon-nova-en)

Amazon Nova 是 Amazon 自己訓練的模型家族，只能透過 [Amazon Bedrock](/posts/ai/2026-08-22-amazon-bedrock-llm-platform) 與 SageMaker AI 使用，沒有開放權重。這篇寫給已經在 AWS 上開發 Agent 的團隊，回答三個問題：Nova 2 Lite 跟 Bedrock 上的 Claude、GPT 比起來該不該選？語音 Agent 要不要用 Nova 2.5 Sonic？2026 年這一輪縮編之後，還能放心依賴哪些型號？

2026 年 11 月的局面是：文字主力是 2025 年 12 月推出的 Nova 2 Lite，語音主力是 10 月 5 日上線的 Nova 2.5 Sonic。上一代旗艦 Premier 與生成模型 Canvas、Reel 已在 9 月停用。Business Insider 報導 Amazon 正把資源集中到一個新的前沿模型，預期在今年底的 re:Invent 發表，Amazon 尚未證實。

怎麼解讀文中的 benchmark 數字，請參考 [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

Nova 的價值主張是「AWS 原生」：計費、IAM、Guardrails、VPC 與資料留存都走 Bedrock 既有機制，官方另提供不設上限的賠償承諾（uncapped indemnity）。以下價格取自 [AWS Price List API](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/us-east-1/index.json)（2026-11-11 版，us-east-1），每 1M tokens：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式與價格 |
|---|---|---|---|
| Nova 2 Lite（`amazon.nova-2-lite-v1:0`） | 目前文字主力 | 文字、圖片、影片輸入；1M context、輸出上限 64K；推理預設關閉，可開 low／medium／high；內建 web grounding 與 code interpreter | Bedrock：全球推論 $0.30／$2.50，單區域 $0.33／$2.75；OpenRouter 同價 |
| Nova 2.5 Sonic（`amazon.nova-2-5-sonic`） | 即時語音 Agent | 單一 speech-to-speech 模型；7 種語言、非同步工具呼叫、語音與文字可在同一 session 切換；256K context | Bedrock 雙向串流 API：語音 $3.00／$12.00，文字 $0.33／$2.75 |
| Nova Multimodal Embeddings | RAG 與跨模態搜尋 | 文字、文件、圖片、影片、音訊映到同一向量空間；8K tokens | Bedrock：文字 $0.135，圖片每張 $0.00006，影片每秒 $0.0007 |
| Nova Act | 瀏覽器 UI 自動化服務 | 以客製版 Nova 2 Lite 驅動，搭配 Python SDK 與 IDE 擴充 | 每 agent 小時 $4.75，僅 us-east-1 |
| Nova Forge | 自建模型服務 | 從預訓練、中段訓練或後訓練檢查點接手，混入 Amazon 訓練資料 | 年費制（[CNBC](https://www.cnbc.com/2025/12/02/amazon-nova-forge-lets-clients-customize-ai-models-for-100000-a-year.html) 報導為每年 $100,000） |
| Nova 2 Pro、Nova 2 Omni（Preview） | 旗艦推理、圖文生成 | 只開放給 Nova Forge 客戶 | Pro 全球推論 $1.25／$10；Omni 文字 $0.30／$2.50 |
| Nova Micro／Lite／Pro（第一代） | 舊版低價文字與多模態 | 無推理模式；context 128K／300K／300K，輸出上限 10K | Bedrock：$0.035／$0.14、$0.06／$0.24、$0.80／$3.20 |
| Chronos-2（`amazon/chronos-2`） | 時間序列預測 | 120M 參數、零樣本，支援多變量與共變數；不是語言模型 | 開放權重，Apache 2.0 |

三個要先知道的事：

- **Nova 2 Lite 有三種推論路徑，價差一成。** 全球跨區域推論（`global.` 前綴）最便宜；`us.`／`eu.`／`jp.` 的地理區推論與單區域呼叫都是 $0.33／$2.75。資料不能出區域的工作負載要付這一成。
- **快取寫入不收費。** Nova 2 Lite 的快取讀取在全球推論是 $0.075，寫入 $0；但[模型卡](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-lite.html)寫 Nova 一次最多只能快取 20K tokens，長 system prompt 的節省有上限。
- **Nova 2 Pro 不是一般客戶能選的選項。** 它從 2025 年 12 月預覽至今仍未 GA，也不在 Bedrock 模型卡清單裡。

### 開放權重：Chronos

Nova 本身沒有權重。Amazon 在 HuggingFace 的 [`amazon` 組織](https://huggingface.co/amazon)近 30 天下載約 1,730 萬次，前十名全是 Chronos 時間序列模型，其中 [Chronos-2](https://huggingface.co/amazon/chronos-2) 一個就占約 923 萬次。它跟 Nova 出自不同團隊（Nova 是 Amazon AGI，Chronos 是 AWS 的預測研究團隊）、授權也不同，放在這裡是因為讀者搜尋「Amazon 開源模型」時拿到的多半是它。用途與 IBM Granite 的時間序列子線重疊，比較見 [Granite 家族文](/posts/tech/2026-11-23-ai-model-family-granite)。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 |
|---|---|---|
| Nova Micro／Lite／Pro、Canvas、Reel | 2024-12（re:Invent） | Amazon 第一次推出自家通用模型，以低價切入 Bedrock；同時有圖片與影片生成 |
| Nova Act（研究預覽） | 2025-03-31 | 專做瀏覽器操作的模型與 SDK，強調把流程拆成可靠的小步驟 |
| Nova Sonic | 2025-04-08 | Bedrock 第一個 speech-to-speech 模型，連帶推出雙向串流 API |
| Nova Premier | 2025-04-30 | 1M context 的第一代旗艦，也是官方推薦的蒸餾教師模型 |
| Nova Multimodal Embeddings | 2025-10-28 | 一個 embedding 模型同時處理文字、圖片、影片、音訊 |
| Nova 2 Lite、Nova 2 Sonic、Nova Act GA、Nova Forge；Nova 2 Pro、Omni 預覽 | 2025-12-02 | 改成可調推理的混合模型，價格從第一代 Lite 的 $0.06 漲到 $0.30；客製化從微調延伸到中途接手訓練 |
| Premier、Sonic v1、Canvas、Reel 進入 Legacy | 2026-03 | 新客戶不能再用，生成類沒有指定的 Nova 替代 |
| Business Insider 報導縮編 | 2026-07-28 | Premier、Omni、Canvas、Reel 進入只維護不開發的狀態，資源轉向新前沿模型 |
| Premier、Sonic v1 停用；Canvas、Reel 停用 | 2026-09-14；2026-09-30 | 舊 model ID 呼叫會失敗 |
| Nova 2.5 Sonic | 2026-10-05 | 語音模型改善推理與工具呼叫、降低延遲，價格與 Nova 2 Sonic 相同 |

站上沒有 Nova 的每日模型卡，上表的日期來自 AWS 官方公告與 [Bedrock 生命週期表](https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle-legacy.html)。

這兩年的轉折有兩個。第一是 Nova 2 把整條線改成推理模型：AIME 2025 從第一代 Lite 的 7.0 跳到 91.0。代價是輸入單價變成五倍、輸出約十倍，「Nova 最便宜」的印象只剩第一代 Micro 與 Lite 還成立。第二是 2026 年的收縮：旗艦、全模態與圖片、影片生成都退出或停在預覽，留下的是文字、語音、embedding 與 Act、Forge 兩個服務。

## 架構與訓練取捨

### 閉源，而且技術報告不談架構

[Nova 2 技術報告](https://cdn.amazon.science/c5/3d/84514a224666b5be6de4b43ef4aa/nova-2-0-technical-report2.pdf)（2025-12-02）只有評測、延遲與安全評估，沒有參數量、架構、訓練資料量或訓練硬體。AWS 公開的設計選擇集中在使用介面：

- **混合推理**：Nova 2 Lite、Pro、Omni 都能開關推理，推理深度分 low／medium／high 三檔。報告的 Figure 2 顯示 LiveCodeBench 分數隨推理檔位上升；預設關閉代表多數請求以非推理模式計費。
- **內建工具**：web grounding（每次請求 $0.03）與 code interpreter 由 Bedrock 端執行，另支援遠端 MCP 工具。
- **長 context**：Nova 2 Lite 與 Nova 2 Sonic 都是 1M；Nova 2.5 Sonic 的模型卡與公告寫 256K，Nova 產品頁卻寫「最多 1M」，以模型卡為準。

代價是無法自架、無法檢查權重，也無法用參數量估算推論成本或延遲。Artificial Analysis 量到 Nova 2 Lite 開推理（medium）時首個答案 token 要 17 秒以上，輸出約每秒 140 tokens。

### 客製化是主打

Nova 2 Lite 的客製化選項比 Bedrock 上多數閉源模型多：

- **Bedrock**：監督式微調（SFT）與強化微調（RFT）。
- **SageMaker AI**：完整參數微調，[2026 年 2 月起](https://aws.amazon.com/blogs/aws/announcing-amazon-sagemaker-inference-for-custom-amazon-nova-models/)可以把客製版 Nova Micro、Nova Lite、Nova 2 Lite 部署在 SageMaker Inference（G5、G6、P5 執行個體，按小時計費）。
- **[Nova Forge](https://aws.amazon.com/nova/forge/)**：從預訓練、中段訓練或後訓練檢查點接手，把自有資料和 Amazon 整理的資料混合，降低災難性遺忘；強化學習階段可以接客戶自己環境裡的獎勵函數。Bedrock 上客製模型的隨選推論與基礎模型同價。

Forge 的客戶案例（GlobalFoundries、Nimbus Therapeutics、Sony）都宣稱客製版 Nova 2 Lite 在自家任務勝過 Claude Sonnet 4.5 或 Sonnet 4。這些是客戶自述，而且比的是客製模型對未客製的通用模型。

### Chronos-2：小而專的編碼器

[Chronos-2 模型卡](https://huggingface.co/amazon/chronos-2)與[技術報告](https://arxiv.org/abs/2510.15821)（2025-10-17）寫明：120M 參數、只有 encoder、架構參考 T5 encoder，用 group attention 讓同一組相關序列與共變數互相參照，輸出多步 quantile 預測。最長 context 8,192 步、預測長度最多 1,024 步，單張 A10G 每秒可跑 300 條以上序列，也能在 CPU 推論。上一代 Chronos-Bolt 只支援單變量，context 2,048。

## 評測與競品比較

### 官方自報：Nova 2 技術報告

以下摘自[技術報告](https://cdn.amazon.science/c5/3d/84514a224666b5be6de4b43ef4aa/nova-2-0-technical-report2.pdf) Table 1、2、4。對手數字來自各家模型卡、排行榜或 Artificial Analysis；MultiChallenge 的對手分數是 Amazon 依對方模型卡指引自測：

| Benchmark | Nova 2 Lite | Claude Haiku 4.5 | GPT-5 Mini | Gemini 2.5 Flash |
|---|---|---|---|---|
| MMLU-Pro | 80.9 | 80.0 | 83.7 | 83.2 |
| GPQA-Diamond | 79.6 | 73.0 | 82.3 | 82.8 |
| AIME 2025 | 91.0 | 80.7 | 91.1 | 72.0 |
| MultiChallenge | 76.6 | 57.1 | 67.8 | 62.6 |
| τ²-bench Telecom（Artificial Analysis 測） | 76.0 | 54.7 | 71.1 | 31.6 |
| BFCL v4 | 60.3 | 61.8 | 56.0 | 55.9 |
| MMMU-Pro | 61.8 | 58.0 | 74.1 | 69.0 |
| SWE-Bench Verified | 53.6（64.5） | 73.3 | 71 | 48.9（60.4） |
| Terminal-Bench 1.0 | 32.5 | 41.8 | 30.8 | 16.8 |

括號內是加上推論時擴展的分數：Nova 用的是 Amazon 內部的 agentic scaffolding，Gemini 是 Google 自報的 test-time scaling，條件不同。

讀法：

- **指令遵循與多輪對話是強項。** MultiChallenge 與 τ²-bench Telecom 領先同級三家，這也是 AWS 主打客服與流程自動化的依據。
- **coding 與視覺是弱項。** 不加 scaffolding 的 SWE-Bench Verified 53.6 明顯落後 Haiku 4.5 與 GPT-5 Mini；MMMU-Pro 落後 GPT-5 Mini 十幾分。
- **對手是一年前的世代。** 表中的 Haiku 4.5、GPT-5 Mini、Gemini 2.5 Flash 在 Bedrock 與其他平台都已有後繼型號，Amazon 沒有發表新的對照。

### 第三方：Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/nova-2-0-lite-reasoning-medium) 目前的 Intelligence Index v5.0.1 沒有給 Nova 2 Lite 或 Nova 2 Pro Preview 分數。舊版指數的個別評測仍可在 [OpenRouter 的模型頁](https://openrouter.ai/amazon/nova-2-lite-v1)看到：Nova 2.0 Lite（high）τ²-Bench Telecom 72.8%、GPQA Diamond 81.1%、Terminal-Bench Hard 16.7%。Artificial Analysis 對價格的評語是輸入「略貴」、輸出「貴」：同級模型輸出中位數約 $0.83，Nova 2 Lite 是 $2.50。

### 語音：Nova 2 Sonic 與 2.5 Sonic

技術報告對 Nova 2 Sonic 的比較對象是 GPT-Realtime（2025-08）與 Gemini 2.5 Flash Live（2025-09）：

- **語音辨識**：Common Voice 七種語言平均 WER 6.5%，GPT-Realtime 8.4%、Gemini 2.5 Flash Live 15.9%（Amazon 自測）。
- **推理**：Big Bench Audio 87.0，GPT-Realtime 83.0（Artificial Analysis 測）。
- **延遲是弱項**：Artificial Analysis 量到的首段音訊時間中位數 1.39 秒，GPT-Realtime 0.98 秒、Gemini 2.5 Flash Live 0.63 秒。

Nova 2.5 Sonic 的[公告](https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-nova-2.5-Sonic/)只寫推理、指令遵循、工具呼叫改善與延遲降低，沒有公布數字，也還沒有第三方對照。跨廠商的語音模型比較見[語音與音訊總覽](/posts/tech/2026-08-26-ai-model-family-speech-audio)。

### 時間序列：Chronos-2

Chronos-2 發佈時在 fev-bench、GIFT-Eval 與 Chronos Benchmark II 都是公開模型零樣本第一（官方自報）。之後已有廠商宣稱超越：H2O.ai 的 TimeH2O-v1 在 2026 年 10 月自稱 fev-bench 32 個模型中勝率第一（見[當天的 AI Agent 日報](/posts/daily/2026-10-27-ai-agent-daily)），引用排名前要看排行榜當下的快照。

## 授權、價格與部署

### 授權與服務條款

- **Nova**：閉源，只以服務形式提供，使用條件是 AWS 服務條款與 Bedrock 模型的 EULA（各模型卡有連結）。[Nova 產品頁](https://aws.amazon.com/nova/models/)寫明提供不設上限的賠償承諾；內容審核可以為核准的業務情境放寬（例如資安分析），兒少保護與隱私相關控制不可調。
- **Chronos 系列**：Apache 2.0（HF metadata 與 [GitHub repo](https://github.com/amazon-science/chronos-forecasting) 的 LICENSE），沒有營收或用途限制。

### Bedrock 價格要點

- **服務層級**：Nova 2 Lite 支援 Standard、Priority、Flex、Reserved。Flex 與批次推論都是五折（全球推論 $0.15／$1.25），Priority 是標準價的 1.75 倍。
- **語音按 token 計**：Nova 2.5 Sonic 與 Nova 2 Sonic 同價，語音輸入 $3、輸出 $12；工具呼叫結果、對話歷史這類文字 token 另以 $0.33／$2.75 計。
- **Nova Act 按時間計**：每 agent 小時 $4.75，從 agent 開始工作算到結束，等待人類回覆的時間不計；平行跑的 agent 各自計費。
- **對照組**：同樣在 Bedrock 上，[Claude Haiku 5.5](https://openrouter.ai/provider/amazon-bedrock) 的牌價是 $0.10／$0.50。Nova 2 Lite 的每 token 單價已經不是 Bedrock 上的低價選項，便宜的只剩第一代 Micro 與 Lite。

### 區域與停用

- Nova 2 Lite 的模型卡列出 26 個可呼叫的區域（含台北 ap-east-2），部分區域只能走跨區域推論。Nova 2.5 Sonic 只在 us-east-1、us-west-2、eu-north-1、ap-northeast-1；Nova Act 與 Nova Forge 只在 us-east-1。
- **已停用**：Nova Premier（`amazon.nova-premier-v1:0`）與第一代 Nova Sonic（`amazon.nova-sonic-v1:0`）在 2026-09-14、Nova Canvas 與 Nova Reel 在 2026-09-30 停用。Sonic v1 改用 Nova 2.5 Sonic；Premier 的工作可改用 Nova 2 Lite（技術報告稱 Lite 在多步推理與 agent 任務超越 Premier，成本是七分之一）；Canvas 與 Reel AWS 沒有指定 Nova 替代，Bedrock 上要改用其他廠商的圖片、影片模型（見[影片生成總覽](/posts/tech/2026-08-26-ai-model-family-video-generation)）。OpenRouter 目前仍列出 Nova Premier，但 Bedrock 端已停用，新專案不要選。
- **下一個停用風險**：Nova 2 Lite 與 Nova 2 Sonic 的模型卡寫「EOL 不早於 2026-12-02」，Legacy 期至少 6 個月。這是最早可能的時間，不是已排定的日期；但對 2026 年剛被縮編的家族，接下來的公告值得盯著。2026 年 9 月 7 日之後上架的模型（包括 Nova 2.5 Sonic）適用新的生命週期政策，模型卡會寫最早停用日與 Legacy 期長度。

### 採用程度

- AWS 自稱超過 50,000 家客戶使用 Nova 模型（官方數字，未定義「使用」）。
- OpenRouter 上 Nova 2 Lite 每週約 35 億 tokens，供應商只有 Amazon Bedrock。
- HuggingFace：Chronos-2 近 30 天下載 923 萬次，以 `amazon/chronos-2` 為 base model 的衍生模型 61 個。Nova 沒有權重，所以沒有 HuggingFace 或 Ollama 的下載數可比較。

## Agent 使用與選型

- **已經在 AWS、要一個便宜的推理模型做客服、文件處理、流程自動化** → Nova 2 Lite。推理預設關閉，先用非推理模式跑，失敗的任務再開 low 或 medium。
- **主力 coding agent** → 不要選 Nova 2 Lite。官方自己的 SWE-Bench Verified 與第三方 Terminal-Bench Hard 都落後同價位對手。
- **只看單價** → 先比 Bedrock 上的 Claude Haiku 5.5 與第一代 Nova Micro／Lite；Nova 2 Lite 的輸出單價是 Haiku 5.5 的五倍。
- **即時語音客服** → Nova 2.5 Sonic。它是 Bedrock 上原生的 speech-to-speech 模型，搭配 [Strands Bidi Agents](https://strandsagents.com/blog/bidi-agents-now-ga/) 可以在背景重連，繞過單一 session 8 分鐘的上限。延遲先實測，Nova 2 Sonic 的首段音訊時間明顯慢於 OpenAI 與 Google。
- **RAG 要同時搜文字、圖片、影片** → Nova Multimodal Embeddings，一個模型取代多個 embedding 管線。
- **重複性的網頁表單、後台操作** → Nova Act，用 Python 把流程拆成小步驟，必要時交給人確認；按小時計費，長時間等待頁面載入也算錢。
- **有大量專有資料、想要自己的模型** → 先試 Bedrock 上的 Nova 2 Lite SFT 或 RFT，年費 $100,000 等級的 Nova Forge 留給需要從預訓練或中段訓練介入的情況。
- **需求預測、指標預測** → Chronos-2，可以完全自架，Apache 2.0。

最小的選型驗證：用 Bedrock Converse API 把同一組任務分別送 `global.amazon.nova-2-lite-v1:0`（推理關閉、medium）與你目前用的模型，比較完成率、輸出 token 與帳單。Converse API 換 model ID 就能切換，不用改程式其他部分。

## 限制與取捨

- **家族在收縮。** 旗艦 Premier、全模態 Omni、圖片與影片生成都已停用或停在預覽；Business Insider 報導的新前沿模型尚未公布，現有型號的後續投入有不確定性。
- **只能在 AWS 上用。** 沒有權重、沒有其他雲的託管，OpenRouter 也只轉送到 Bedrock；離開 AWS 就要換模型。
- **評測多半是自報，對手是上一代。** 技術報告比的是 Claude Haiku 4.5、GPT-5 Mini 這一代；Artificial Analysis 的新版指數沒有 Nova 2 的分數。
- **coding 與視覺偏弱。** 不加 scaffolding 的 SWE-Bench Verified 與 MMMU-Pro 都落後同級對手。
- **輸出單價偏高。** $2.50 的輸出價被 Artificial Analysis 列為同級偏貴，Bedrock 上也有更便宜的替代。
- **架構不透明。** 參數量、訓練資料與架構都未揭露，延遲與成本只能實測。

Nova 適合的情況很具體：已經把資料與權限放在 AWS、需要賠償條款與 Bedrock 的治理功能，或要用 Nova Act、Sonic 這種 AWS 原生的 Agent 元件。純比分數或單價的選型，Nova 2 Lite 很難排進前段；它的開放權重代表作反而是不屬於 Nova 的 Chronos-2。

## 參考資料

- [Amazon Nova 2: Multimodal Reasoning and Generation Models — 技術報告與模型卡（PDF）](https://cdn.amazon.science/c5/3d/84514a224666b5be6de4b43ef4aa/nova-2-0-technical-report2.pdf)
- [Amazon Nova 2 技術報告 — Amazon Science 頁面](https://www.amazon.science/publications/amazon-nova-2-multimodal-reasoning-and-generation-models)
- [Announcing Amazon Nova 2 foundation models — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/12/nova-2-foundation-models-amazon-bedrock/)
- [Introducing Amazon Nova 2 Lite — AWS News Blog](https://aws.amazon.com/blogs/aws/introducing-amazon-nova-2-lite-a-fast-cost-effective-reasoning-model/)
- [Introducing Amazon Nova 2 Omni in Preview — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-nova-2-omni-preview/)
- [Introducing Amazon Nova 2 Sonic — AWS News Blog](https://aws.amazon.com/blogs/aws/introducing-amazon-nova-2-sonic-next-generation-speech-to-speech-model-for-conversational-ai/)
- [Announcing Amazon Nova 2.5 Sonic — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-nova-2.5-Sonic/)
- [Nova 2 Lite — Bedrock 模型卡](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-lite.html)
- [Nova 2.5 Sonic — Bedrock 模型卡](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-5-sonic.html)
- [Nova Pro — Bedrock 模型卡](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-pro.html)
- [Nova Premier — Bedrock 模型卡（簡體中文）](https://docs.aws.amazon.com/zh_cn/bedrock/latest/userguide/model-card-amazon-nova-premier.html)
- [Model lifecycle (Legacy) — Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle-legacy.html)
- [Model lifecycle — Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle.html)
- [Amazon Bedrock pricing](https://aws.amazon.com/bedrock/pricing/)
- [AWS Price List API — AmazonBedrock（us-east-1）](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/us-east-1/index.json)
- [Amazon Nova pricing](https://aws.amazon.com/nova/pricing/)
- [Amazon Nova foundation models](https://aws.amazon.com/nova/models/)
- [Amazon Nova Forge](https://aws.amazon.com/nova/forge/)
- [Build agents with Amazon Nova Act (GA) — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/12/build-automate-production-ui-workflows-nova-act/)
- [Introducing Amazon Nova Act — Amazon Science](https://www.amazon.science/blog/nova-act)
- [Amazon Nova Premier — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/04/amazon-nova-premier-complex-tasks-model-distillation/)
- [Announcing Amazon Nova Sonic — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/04/amazon-nova-sonic-speech-to-speech-conversations-bedrock/)
- [Announcing Amazon Nova Multimodal Embeddings — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-nova-multimodal-embeddings/)
- [Announcing Amazon SageMaker Inference for custom Amazon Nova models — AWS News Blog](https://aws.amazon.com/blogs/aws/announcing-amazon-sagemaker-inference-for-custom-amazon-nova-models/)
- [Bidi Agents now GA — Strands Agents](https://strandsagents.com/blog/bidi-agents-now-ga/)
- [Amazon Nova Forge lets clients customize AI models for $100,000 a year — CNBC](https://www.cnbc.com/2025/12/02/amazon-nova-forge-lets-clients-customize-ai-models-for-100000-a-year.html)
- [Amazon overhauls its AI strategy, winding down most flagship models — Business Insider](https://www.businessinsider.com/amazon-overhauls-ai-strategy-phasing-out-most-nova-models-2026-7)
- [Amazon: Nova 2 Lite — OpenRouter（價格、供應商、Artificial Analysis 分數轉載）](https://openrouter.ai/amazon/nova-2-lite-v1)
- [Amazon Bedrock — OpenRouter 供應商頁](https://openrouter.ai/provider/amazon-bedrock)
- [Nova 2.0 Lite (medium) — Artificial Analysis](https://artificialanalysis.ai/models/nova-2-0-lite-reasoning-medium)
- [Nova 2.0 Pro Preview — Artificial Analysis](https://artificialanalysis.ai/models/nova-2-0-pro-reasoning-medium)
- [amazon/chronos-2 — HuggingFace 模型卡](https://huggingface.co/amazon/chronos-2)
- [Chronos-2: From Univariate to Universal Forecasting — arXiv 2510.15821](https://arxiv.org/abs/2510.15821)
- [amazon-science/chronos-forecasting — GitHub](https://github.com/amazon-science/chronos-forecasting)
- [Amazon Bedrock 平台介紹](/posts/ai/2026-08-22-amazon-bedrock-llm-platform) — 本站
- [IBM Granite 模型家族](/posts/tech/2026-11-23-ai-model-family-granite) — 本站
- [語音與音訊模型總覽](/posts/tech/2026-08-26-ai-model-family-speech-audio) — 本站
- [影片生成模型總覽](/posts/tech/2026-08-26-ai-model-family-video-generation) — 本站
- [AI Agent 日報 2026-10-27](/posts/daily/2026-10-27-ai-agent-daily) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
