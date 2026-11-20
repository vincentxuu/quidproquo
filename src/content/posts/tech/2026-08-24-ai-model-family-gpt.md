---
title: "GPT——閉源 API 收營收、開源 GPT-OSS 補生態，從 GPT-5.6 三層到 GPT-6.2 Astra／Sol 的全球最大 AI 平台"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, gpt, openai, model-family-gpt, reasoning, agentic-coding, model-selection]
lang: zh-TW
type: deep-dive
tldr: "GPT 是 OpenAI 的 LLM 家族，從 2018 年 117M 參數的 GPT-1 一路演化到 2026 年的 GPT-6 世代：9 月 GPT-6 Astra 旗艦、Sol／Luna 平價版，9 月底 GPT-6.1 Sol、10 月 GPT-6.1 Terra，11 月 17 日 GPT-6.2 Astra（$8／$40）與 GPT-6.2 Sol（$2／$10）接手主力。同一組權重還切出受信任存取的 Rosalind（生命科學）與 Cyber（資安）專線。開源這條線至今仍只有 2025 年的 GPT-OSS 120B／20B（Apache 2.0）。"
description: "GPT 模型家族完整介紹：從 2018 年 GPT-1 到 2026 年 GPT-6.2 的演化脈絡、閉源 API 線與開源 GPT-OSS 線的雙軌策略、GPT-6 世代 Astra／Sol／Terra／Luna 分層與定價、Rosalind 與 Cyber 受信任存取專線、舊模型退役時程，以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 3
draft: false
glossary:
  - term: "RLHF"
    def: "Reinforcement Learning from Human Feedback，用人類回饋做強化學習的對齊方法，GPT-3.5 和 ChatGPT 的核心訓練技術"
  - term: "Reasoning effort"
    def: "GPT-5 之後的推理深度控制參數，從 none／low 到 max，讓使用者在速度、成本和品質之間做選擇；GPT-6.2 Astra 不接受 none"
  - term: "受信任存取（Trusted Access）"
    def: "OpenAI 對高風險領域模型的申請制存取：先審核用途、資安控管與治理，才開放 Rosalind（生命科學）或 Cyber（資安）這類放寬拒答的模型"
  - term: "GPT-OSS"
    def: "OpenAI 首次開源的權重語言模型（2025/08），包含 120B 和 20B 兩個尺寸，Apache 2.0 授權"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-gpt-en)

2022 年 11 月 30 日，ChatGPT 上線，5 天內達到 100 萬使用者，兩個月內突破 1 億——人類歷史上成長最快的消費產品。四年後的 2026 年，OpenAI 在半年內換了兩代：7 月 GPT-5.6 Sol／Terra／Luna 三層上線，9 月 GPT-6 Astra 開出新世代，11 月 17 日 GPT-6.2 Astra／Sol 又把旗艦價壓低 20%。這是「AI 模型家族」系列的第三篇家族深度介紹，追蹤 GPT 從 GPT-1 到 GPT-6.2 的完整演化。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族定位與版本矩陣

以 2026-11-20 OpenAI API 定價頁上架的型號為準：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| GPT-6.2 Astra | 旗艦，最難的專業與科研工作 | 最高品質，$8／$40 | 閉源 API、ChatGPT Work、Codex |
| GPT-6.2 Sol | 日常主力 | 接近 Astra、約五分之一價格，$2／$10 | 閉源 API、ChatGPT Work、Codex |
| GPT-6.1 Terra | 高量電腦操作與文書 | Sol 的一半價格，$1／$5 | 閉源 API |
| GPT-6 Luna | 高吞吐、低成本 | $0.10／$0.50 | 閉源 API |
| GPT-6 Rosalind／GPT-6 Cyber | 生命科學／資安專線 | 受信任存取，放寬拒答邊界 | 申請制 API |
| GPT-OSS 120B / 20B | 本地部署 | 開放權重，不是旗艦 | Apache 2.0 權重 |

### 兩條產品線：閉源 API 收營收，開源 GPT-OSS 補生態
看懂 GPT 在 2026 年的佈局，關鍵是把它拆成兩條線——和 Qwen 相反的方向（Qwen 是開源起家、近年往閉源收），GPT 是閉源起家、近年才往開源補：

**閉源 API 線**（OpenAI 官方 API／ChatGPT／Codex，另經 Azure 與 Amazon Bedrock 販售）：GPT-5 之後的旗艦全部只在 API 上，無權重可下載。2026 年這條線從單一 GPT-5 細分成多個價格層，到 GPT-6 世代固定成 Astra（旗艦）／Sol（日常）／Terra（中價）／Luna（高效）四個名字，版本號各自前進——所以同一時間在架上的是 6.2 Astra、6.2 Sol、6.1 Terra、6 Luna，不是整齊的一代。這條線負責營收——10 億使用者與 200 萬企業客戶都跑在這上面。

**開源權重線**（GPT-OSS）：2025 年 8 月首次釋出 120B 與 20B 兩個尺寸，Apache 2.0。之後只多了 2025 年 10 月的 gpt-oss-safeguard（同尺寸的安全分類微調版），截至 2026 年 11 月沒有新的通用開源模型。這條線負責生態位——給需要自架、微調、資料主權的開發者一條退路，但明確不是前沿模型。

中間的轉折值得記：OpenAI 從 2019 年 capped-profit 轉型、2026 年傳出 IPO，商業壓力只增不減。GPT-OSS 的開源更像戰略回應（對上 Llama、Qwen、DeepSeek 的開源攻勢），而不是路線回歸——閉源旗艦這條主軸從沒鬆動過，開源線一年多沒有續作也印證這點。


### 子線與生態系：一張表看懂 GPT 有多少產品
「家族大」在閉源陣營裡 GPT 排第二（僅次 Qwen）。除了通用主線，它同時經營著多條子線：

| 子線 | 代表版本（2026-11） | 定位 |
|---|---|---|
| 旗艦與日常主線 | GPT-6.2 Astra／Sol、GPT-6.1 Terra、GPT-6 Luna | 依價格分層，最高智慧到高吞吐 |
| 受信任存取專線 | GPT-6 Rosalind（生命科學）、GPT-6 Cyber（資安）、Astra for Law | 同一底層模型，依領域調整拒答與存取 |
| 開源權重 | GPT-OSS 120B / 20B、gpt-oss-safeguard | Apache 2.0，可自架 |
| 圖像 | GPT-Image-2.6 Flare／Sunburst | 文生圖、編輯、GIF、SVG 輸出 |
| 語音 | gpt-realtime-2.1、GPT-Live、gpt-transcribe | 語音對話、即時轉錄 |
| 嵌入 | text-embedding-3 | RAG 主力 |
| 開發者工具 | Codex、Responses API、Agents SDK | Agent 基礎設施 |
| 消費者產品 | ChatGPT（含 Work） | 全球最大 AI 應用 |

兩個觀察：

**從「一個路由器」走回「明確分層」。** GPT-5（2025-08）的核心賭注是統一路由：一個路由器依任務難度自動分配快速模型或推理模型，開發者不用選。但從 GPT-5.6 的 Sol／Terra／Luna 到 GPT-6 的 Astra／Sol／Terra／Luna，OpenAI 反而把層級攤開讓開發者挑，加上 reasoning effort 參數控制推理深度。好處是成本可控；代價是命名矩陣變得很難記。

**舊路線正在大量收掉。** o 系列推理模型已在 2026-10-23 關掉 o1、o3-mini、o4-mini，o3、o3-pro 與 GPT-5 系列會在 2026-12-11 停用；Sora 2 與 Videos API 已於 2026-09-24 關閉、沒有替代品；DALL·E 由 GPT-Image 系列取代；Whisper 的 API 版 `whisper-1` 預定 2027-02-26 停用（開源權重仍在）。最後一個提醒：API 型號裡的 Astra/Sol/Terra/Luna 是服務層級標籤，不保證有可下載權重——判斷能不能自架，看授權欄位，不是看型號後綴。

## 家族演化

### 家族演化時間線
| 版本 | 發佈 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| GPT-1 | 2018-06 | 117M 參數，首個生成式預訓練模型 | 證明「先預訓練再微調」可行，還不是可用產品 |
| GPT-2 | 2019-02 | 1.5B 參數，以「太危險」延遲釋出（後全開源）| 開了「權重要不要放」的辯論，也是 GPT-OSS 前最後一個開放權重的 GPT |
| GPT-3 | 2020-05 | 175B 參數，few-shot 學習，API 開放（需申請）| 從下載模型變成呼叫 API，OpenAI 的閉源 API 路線從這裡開始 |
| GPT-3.5 / ChatGPT | 2022-03／2022-11 | ~175B，RLHF 微調；ChatGPT 2 個月破 1 億使用者 | 對話式介面讓一般人也成了使用者，RLHF 成為標配 |
| GPT-4 / GPT-4 Turbo | 2023-03／2023-11 | 多模態，律師考試 90th percentile；Turbo 128K context | 確立「閉源旗艦品質最高」的印象，長 context 開始可用 |
| GPT-4o | 2024-05 | 原生多模態（文字＋視覺＋語音）| 語音與影像不必再串多個模型；2027-01-14 起 API 停用，官方建議改用 GPT-6 Luna（[停用公告](/posts/daily/2026-10-16-pricing-openai-gpt-4o-gpt-4-1-api-sunset)）|
| o1 / o3 / o4-mini | 2024-09／2025-04 | 推理模型，「先想再說」| 推理深度第一次成為要選的維度；之後併入主線的 reasoning effort，o 系列陸續停用 |
| GPT-4.1 | 2025-04 | API 專用，1M context | 1M context 進入 API 主線 |
| GPT-OSS | 2025-08 | 120B / 20B，Apache 2.0 | 要自架有了官方選項，但從此沒有續作 |
| GPT-5 | 2025-08 | 快速模型＋推理模型＋即時路由器 | 改由系統替開發者挑模型，代價是成本不透明；2026-12-11 API 停用（[停用公告](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown)）|
| GPT-5.5 | 2026-04 | 效率與 Agent 能力提升，1M context | ChatGPT 與 Codex 已於 2026-10-14 下架，API 仍可呼叫（[下架公告](/posts/daily/2026-09-17-pricing-openai-gpt-5-5-retirement)）|
| GPT-5.6 Sol/Terra/Luna | 2026-07 | 三層產品線，1.05M context | 從「路由器自動挑」回到「開發者按價格層選」，並用推論效率連續降價（[官方降價](/posts/daily/2026-08-23-pricing-openai-gpt-5-6-sol-official-price-cut)）|
| GPT-6 Astra | 2026-09-03 | 新世代旗艦，$10／$50；網路安全達 Preparedness Framework Critical 門檻 | 新世代先出旗艦，安全分級開始影響能用到哪些功能（[模型卡](/posts/daily/2026-09-06-model-openai-gpt-6-astra)）|
| GPT-6 Sol／Luna | 2026-09-22 | 用與 Astra 相近的方法訓練，比 GPT-5.6 促銷價再砍 50% | 平價層不再是旗艦的縮水版，同代能力往下分配到各價格（[模型卡](/posts/daily/2026-09-25-model-openai-gpt-6-sol-luna)）|
| GPT-6.1 Sol | 2026-09-29 | DevDay 發表，以約五分之一價格逼近 Astra | 日常主力的品質追近旗艦，多數任務不必再用 Astra（[模型卡](/posts/daily/2026-09-30-model-openai-gpt-6-1-sol)）|
| GPT-6.1 Terra | 2026-10-26 | 中價位電腦操作模型，$1／$5 | 大量電腦操作工作有了專門的中價位選項（[模型卡](/posts/daily/2026-10-26-model-openai-gpt-6-1-terra)）|
| GPT-6 Rosalind／Cyber | 2026-10-30／11-05 | 受信任存取專線：生命科學、資安 | 同一底層模型依存取資格分產品、分價格（[Rosalind](/posts/daily/2026-11-01-model-openai-gpt-6-rosalind)、[Cyber](/posts/daily/2026-11-06-model-openai-gpt-6-cyber)）|
| GPT-6.2 Astra／Sol | 2026-11-17 | 旗艦降價 20%、快取輸入降 60%；Astra 首個對外達 AI 自我改進 High 門檻的模型 | 目前的選型基準，見下方各節 |

八年、多個里程碑。GPT 的主線很清楚：**從研究論文到消費產品到平台生態**。GPT-3 證明 scaling law，ChatGPT 創造消費需求，GPT-4 確立品質標準，GPT-5 之後專注 Agent 能力與效率優化。2026 年下半年節奏明顯加快：9 月到 11 月不到三個月出了 GPT-6、6.1、6.2 三個版號，每次升級的重點都是「同樣品質、更低單價」。

## 架構與訓練取捨

### 架構：為什麼一個系統能打多種任務
#### 統一路由架構：GPT-5 的起點

2025 年 8 月的 GPT-5 標誌著 OpenAI 從「單一模型」轉向「統一系統」：

**GPT-5 = 快速模型 + 推理模型 + 即時路由器**

路由器根據對話類型、複雜度、工具需求和使用者明確意圖（例如「仔細想想」），即時決定用哪個模型。概念類似 Anthropic 的 adaptive thinking，但 GPT-5 的實現更明確——背後是兩個獨立模型，而 Claude 是一個模型內部調整推理深度。

實用意義是開發者不用選模型，系統自動決定。但代價是路由行為不透明、成本可控性下降——這也是後來 GPT-5.6 與 GPT-6 改回明確分層、把選擇權交還開發者的背景。消費端仍保留自動化：ChatGPT Work 的新對話預設用 GPT-6.2 Sol 搭 Light 推理。

#### GPT-6 世代：同一套方法，切成不同價格

GPT-6 世代的分層邏輯跟 GPT-5.6 不同。OpenAI 在 GPT-6 Sol／Luna 的公告裡寫明，這兩個模型是「用與 GPT-6 Astra 相近的方法訓練」，把 Astra 在專業工作、事實性、coding、電腦操作與對齊上的進步搬到更快更便宜的模型——不是同一個模型的縮水版。之後每個點版本都在做同一件事：

- **GPT-6.1 Sol**（9/29）：官方稱在 DeepSWE v1.1 以約五分之一成本追平 GPT-6 Astra，快取輸入降到 $0.10
- **GPT-6.1 Terra**（10/26）：主打電腦操作與視覺推理；內部事實錯誤率在 low effort 從 GPT-5.6 Terra 的 53.6% 降到 16.7%
- **GPT-6.2 Astra／Sol**（11/17）：Astra 標準單價降 20%、快取輸入降 60%，官方強調「更少 output token 做完更難的任務」

推論效率是降價的主要來源。GPT-6 Sol／Luna 公告把降價歸因於快取與推論的改進；GPT-6.2 則同時壓單價和每個任務耗用的 token，所以「每任務成本」降得比「每 token 單價」更多。

#### 同一組權重，按存取方式分層定價

GPT-6 世代另一個新做法是讓同一個底層模型依安全設定與存取方案分成不同產品。GPT-Rosalind-6 的 system card addendum 寫明它「與 GPT-6 Astra 使用相同權重，這次沒有新增訓練資料，也沒有額外 post-training」，差別在對雙重用途生物學問題拒答較少，且只透過受信任存取開放。GPT-6 Cyber 則是專門訓練來找出並驗證可利用漏洞、同時守住授權範圍的資安模型，只給 Daybreak Red 通過審核的客戶。換句話說，這兩條專線賣的不只是能力，還有「願意回答到什麼程度」。

#### 原生多模態與 GPT-OSS 架構

GPT-4o（2024-05）確立了原生多模態路線——文字、視覺、語音在同一模型內處理，不是外掛 adapter。到 GPT-6.2 Astra，API 模型頁列的輸入是文字與圖像、輸出是文字；圖像生成與語音則由 GPT-Image 和 realtime 系列各自負責。

另一邊的 GPT-OSS 是 OpenAI 第一次把語言模型權重交出去。兩個都是 MoE：120B 總參數約 117B、每 token 啟用 5.1B，可在單張 80GB GPU 上跑；20B 總參數約 21B、啟用 3.6B，16GB 記憶體就能跑。兩者都支援 function calling 與 structured outputs，授權是乾淨的 Apache 2.0。品質落後閉源旗艦一大截，而且一年多沒有更新。

## 評測與競品比較

### 效能位置
GPT-6 世代的公告大量使用「相對前代」與「每任務成本」的比較，以下以官方公告原文為準，並標明是自測：

| 模型 | 官方重點數字（OpenAI 自測） |
|---|---|
| GPT-6 Astra | FrontierMath Tier 4 98%、ARC-AGI-3 99.9%、ExploitBench 100%；OSWorld 2.0 延遲模擬 72.6%（GPT-5.6 Sol 65.7%），每任務時間少約 47% |
| GPT-6 Sol | AutomationBench（xhigh）33.2%，每任務 $0.27；Claude Opus 5（max）26.9%、成本是 Sol 的 11.1 倍。Agents' Last Exam（max）56.4% |
| GPT-6.1 Sol | DeepSWE v1.1 以約五分之一成本追平 GPT-6 Astra；Terminal-Bench Science 0.1 每任務 $5.47，Opus 5.5 $23.21、Astra $23.80（Astra 分數仍最高，68.1%） |
| GPT-6.1 Terra | Terminal-Bench 4.0（max）50.3%，GPT-5.6 Terra 公佈分數 21.5% |
| GPT-6.2 Astra | Agents' Last Exam 比 GPT-6 Astra 高 5.2 分、成本不到三分之一；比 Claude Fable 5.2 高 5.5 分、成本約 5%。Terminal-Bench Science 0.1 比 GPT-6 Astra 高 9 個百分點 |
| GPT-6.2 Sol | Cognition FrontierCode 2.0（max）距 GPT-6.2 Astra 0.5 分以內，成本約五分之一 |

和第三方評測對照：

| 來源 | 結果 |
|---|---|
| Artificial Analysis AA-3D（人類盲測偏好） | GPT-6.2 Astra 1,318 Elo 第一，Claude Fable 5.2 1,271，GPT-6.2 Sol 1,259（OpenAI 公告引用） |
| Artificial Analysis Intelligence Index | GPT-6.2 Astra 排第二，次於 Claude Fable 5.2，但在成本效益前緣居首（The Decoder 報導） |
| Agents' Last Exam | The Decoder 指出在這個榜上只有 Gemini 4 Carbon 跟得上 GPT-6.2 Astra |

讀這些數字的兩個注意點：一是 OpenAI 喜歡用「同分但成本幾分之一」來呈現，絕對分數常常不列；二是對 Claude 的比較常有附註，例如 Agents' Last Exam 上 Fable 5.2 的成績排除了九個用到 fallback 模型的任務。綜合指標上，GPT-6.2 Astra 並沒有全面勝出，它真正領先的是每任務成本。


### 跟競品的位置
把 GPT 放回 2026 年底的格局：

- **對上 Claude**：閉源雙雄。Claude Fable 5.2 在 Artificial Analysis 綜合指標仍排第一；GPT-6.2 Astra 在 OpenAI 自選的專業工作與科研 benchmark 上領先，且每任務成本低很多。詳見 [Claude 家族](/posts/tech/2026-08-24-ai-model-family-claude)
- **對上 Gemini**：Gemini 4 Carbon 在 Agents' Last Exam 是少數能跟 GPT-6.2 Astra 並列的模型，Gemini 一貫的強項是原生多模態與長 context。詳見 [Gemini 家族](/posts/tech/2026-08-24-ai-model-family-gemini)
- **對上 DeepSeek 與開源前沿**：DeepSeek、Qwen、Kimi、GLM 持續放出開源權重，可自架、單價遠低於 GPT。GPT 的優勢是生態成熟度（Codex、Responses API）、雲端通路與企業合規；GPT-OSS 提供開源退路，但品質非前沿。詳見 [DeepSeek 家族](/posts/tech/2026-08-24-ai-model-family-deepseek)

## 授權、價格與部署

### 授權陷阱：旗艦閉源，開源的不是前沿
OpenAI 的授權佈局是系列裡最分層的——開源和閉源之間有一道明確界線，GPT-6 世代又多加了一層「申請制」：

- **閉源主線（GPT-6.x 全系列）**：只有 API，無權重，授權即 OpenAI 服務條款。最強模型完全不可自架
- **受信任存取（Rosalind、Cyber）**：連 API 都要先申請，OpenAI 審核用途、資安控管與治理才開放，並保留收回存取的權利
- **開源權重（GPT-OSS 120B / 20B）**：Apache 2.0，可下載、微調、自架——但不是前沿模型
- **歷史遺留**：GPT-2 全開源，GPT-3 半開放（經申請），GPT-4 起完全閉源

這裡的但書是：**「OpenAI 開源」≠「最強模型開源」**。GPT-OSS 是真 Apache 2.0，授權比 Llama 4 的 Community License 乾淨，但品質落後 GPT-6.2 一大截。如果你的場景需要「Apache 2.0 + 前沿品質」，GPT-OSS 給不了，得看 DeepSeek（MIT）或 Qwen（多數 Apache）。

另外三個容易被忽略的成本與營運細節：

- **長 context 加價**：超過 272K input tokens 後，整個請求的 input 與快取價加倍、output 變 1.5 倍。長文件 workload（codebase、合約、會議記錄）的實際成本比短 context 定價高不少
- **退役節奏快**：OpenAI 文件寫的是一般模型至少 6 個月通知，但 2026 年一口氣排了大量停用——GPT-5 系列、o3、o3-pro 在 2026-12-11 停用，GPT-4o、GPT-4.1 在 2027-01-14 停用。換代不一定省錢：官方建議 `gpt-5-mini` 換到 `gpt-6.1-terra`，單價反而從 $0.25／$2 漲到 $1／$5
- **自助 fine-tuning 收掉**：從沒用過 fine-tuning 的組織已不能建立訓練工作，既有客戶 2027-01-06 起也不能再開新工作。GPT-6.2 Astra 的模型頁也標明不支援 fine-tuning


### GPT-6 世代：Astra、Sol、Terra、Luna 怎麼選
OpenAI API 定價頁（2026-11-20 讀取）的 Standard 費率，每 1M tokens，短 context（≤272K input）：

| 項目 | GPT-6.2 Astra | GPT-6.2 Sol | GPT-6.1 Terra | GPT-6 Luna |
|---|---|---|---|---|
| 定位 | 最難的專業、科研與 coding | 日常主力 | 高量電腦操作、文書 | 高吞吐、低成本 |
| Input | $8 | $2 | $1 | $0.10 |
| Cached input | $0.40 | $0.10 | $0.05 | $0.01 |
| Output | $40 | $10 | $5 | $0.50 |
| Long context input／output | $16／$60 | $4／$15 | $2／$7.50 | $0.20／$0.75 |
| Batch | 標準價的 50% | 50% | 50% | 50% |
| Fast mode | 標準價的 2 倍 | 2 倍 | 2 倍 | 2 倍 |
| 授權 | 閉源 API | 閉源 API | 閉源 API | 閉源 API |

GPT-6.2 Astra 的模型頁列出 1,050,000 context window、最大 input 922,000、最大 output 128,000。其他計費規則：

- **Ultrafast**：GPT-6.2 Astra／Sol 到 2027-02-28 是標準價 3 倍，2027-03-01 起 6 倍
- **背景請求折扣**：GPT-6.2 Astra／Sol、GPT-6.1 Terra、GPT-6 Luna 的背景請求，2 小時完成窗口比標準價低 30%，8 小時窗口低 40%
- **舊型號仍在架上**：GPT-6 Astra $10／$50、GPT-6.1 Sol 與 GPT-6 Sol $2／$10；GPT-5.6 Sol 的促銷價 $4／$20 只到 2026-11-30
- **專線價格**：GPT-6 Cyber $20／$100（Daybreak Red）；GPT-6 Rosalind 目前促銷價 $10／$50，至少到 2026-12-31；律師用的 GPT-6.2 Astra for Law $8／$40

## Agent 使用與選型

### 對 Agent 開發者的意義
- **要最強的 agentic 與科研表現** → GPT-6.2 Astra：官方 benchmark 在專業工作、Terminal-Bench Science 領先，$40 output 比 GPT-6 Astra 便宜 20%
- **日常 coding、寫作、多步驟工作** → GPT-6.2 Sol，$10 output，官方稱 FrontierCode 2.0 距 Astra 0.5 分以內、成本約五分之一
- **大量電腦操作、表單、文件流程** → GPT-6.1 Terra，$5 output，主打電腦操作與視覺推理；最複雜的 coding 官方仍建議用 Sol 或 Astra
- **高吞吐分類／摘要** → GPT-6 Luna，$0.50 output，也是 GPT-4o、GPT-4.1 停用後的官方建議替代
- **生命科學或資安研究** → Rosalind、Cyber 要先申請受信任存取；Rosalind 與 Astra 權重相同，多出的是較少拒答，不是更強的能力
- **要自架 + Apache 2.0** → GPT-OSS 120B/20B 可自架，但非前沿且一年多沒更新；前沿自架看 Qwen 或 DeepSeek
- **還在用舊型號** → 先查 deprecations 頁：GPT-5 系列、o3 在 2026-12-11 停用，遷移前用自己的請求比較輸出、延遲與成本
- **引用 benchmark 時** → GPT 的命名矩陣（世代 × Astra/Sol/Terra/Luna × 點版本 × 專線）是所有家族裡最容易搞錯的。型號和日期必須寫全，否則比的是不同場次

## 限制與取捨

GPT-6 世代的公告多是 OpenAI 自測、自選比較基準與 reasoning effort，很多只給相對差距不給絕對分數；第三方綜合指標上 GPT-6.2 Astra 並非第一。GPT-6.x 的品質也不能轉移到 GPT-OSS 的授權承諾上。長 context 加價、推理設定與 Ultrafast 倍率都會改變實際成本，應依本文保留的計費條件估算。

### 整體來說
GPT 的故事是「從研究論文到全球基礎設施」。OpenAI 用 GPT-3 證明 scaling law，用 ChatGPT 創造消費需求，用 GPT-4 確立品質標準，用 GPT-5 的統一路由重新定義模型使用方式，再用 GPT-6 世代把層級攤開：Astra、Sol、Terra、Luna 從 $0.50 到 $40 的 output 價覆蓋每個價格帶。

GPT-6 到 6.2 這三個月的主軸不是刷新分數天花板，而是把旗艦等級的能力往下壓到更便宜的層級、同時降低每個任務耗用的 token。對 Agent 開發者來說，務實的做法是：Astra 處理最難的任務，Sol 處理日常 coding，Terra 跑大量電腦操作，Luna 扛高吞吐量工作，並且盯緊退役時程。

真正值得盯著的是授權與存取的分層化：旗艦全閉源、專線要申請、GPT-OSS 真 Apache 2.0 但非前沿且停在 2025 年。「開源」在 GPT 身上目前只有一個層級是真的，而那個層級還不是最強的模型。


## 更新紀錄

- **2026-11-20**：補上 GPT-6 世代（GPT-6 Astra、GPT-6 Sol／Luna、GPT-6.1 Sol、GPT-6.1 Terra、GPT-6.2 Astra／Sol）、Rosalind 與 Cyber 受信任存取專線、GPT-Image-2.6；版本矩陣、子線表、時間線、評測、定價與選型全部改寫為 2026-11-20 OpenAI 定價頁與公告的內容；新增舊模型退役時程與 fine-tuning 收掉的說明。GPT-5.6 降為歷史世代：原本的 GPT-5.6 評測表、定價表與選型建議移出正文，當時的數字見時間線連結的每日模型卡與定價快照；時間線改為每列註明「改變了什麼選型」。修正錯誤：子線表的「o4 / o5」（o5 未發佈）與「DALL·E 3 / 4」（已由 GPT-Image 取代），以及 GPT-5.6 Sol「$5／$30、促銷到 11/21」與官方定價頁（$4／$20 促銷價，至 11/30）不符的數字。
- **2026-10-11**：依家族共同格式重組章節，補上由既有內容整理的矩陣。沿用原有版本、價格與來源日期，未進行新一輪事實查證。

## 參考資料

- [Introducing GPT-6.2 Astra and Sol — OpenAI](https://openai.com/index/introducing-gpt-6-2-astra-sol)
- [GPT-6.2 Astra 模型頁 — OpenAI API Docs](https://developers.openai.com/api/docs/models/gpt-6.2-astra)
- [GPT-6 Astra: A new generation of intelligence — OpenAI](https://openai.com/index/gpt-6-astra/)
- [Introducing GPT-6 Sol and Luna — OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna/)
- [Introducing GPT-6.1 Sol — OpenAI](https://openai.com/index/introducing-gpt-6-1-sol/)
- [Introducing GPT-6.1 Terra — OpenAI](https://openai.com/index/introducing-gpt-6-1-terra/)
- [GPT-Rosalind-6 System Card Addendum — OpenAI Deployment Safety Hub](https://deploymentsafety.openai.com/gpt-rosalind-6)
- [GPT-6 Cyber: Advancing the frontier of aligned cybersecurity agents — OpenAI](https://openai.com/index/introducing-gpt-6-cyber/)
- [Introducing Images 2.6 — OpenAI](https://openai.com/index/introducing-images-2-6/)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [OpenAI API Deprecations](https://developers.openai.com/api/docs/deprecations)
- [Introducing gpt-oss — OpenAI](https://openai.com/index/introducing-gpt-oss/)
- [Introducing gpt-oss-safeguard — OpenAI](https://openai.com/index/introducing-gpt-oss-safeguard/)
- [OpenAI launches GPT-6.2 Astra and Sol with lower API prices and some benchmark gains — The Decoder](https://the-decoder.com/openai-launches-gpt-6-2-astra-and-sol-with-lower-api-prices-and-some-benchmark-gains/)
- [GPT-5.6: Frontier intelligence that scales with your ambition — OpenAI](https://openai.com/index/gpt-5-6/)
- [Introducing GPT-5 — OpenAI](https://openai.com/index/introducing-gpt-5/)
- [OpenAI — Wikipedia](https://en.wikipedia.org/wiki/OpenAI)
- [The Complete History of OpenAI](https://www.datastudios.org/post/the-complete-history-of-openai-founding-structure-gpt-models-chatgpt-and-the-road-to-2026)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
