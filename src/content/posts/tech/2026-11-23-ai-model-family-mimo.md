---
title: "小米 MiMo——V2.6 Pro 與 Flash：MIT 授權的全模態開放權重，便宜但慢"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, xiaomi, open-source, model-family-mimo, moe, model-selection]
lang: zh-TW
type: deep-dive
tldr: "小米 MiMo 目前在架的是 MiMo-V2.6-Pro（1.02T 總參數、42B 啟用）與 MiMo-V2.6-Flash（309B、15B 啟用），都是 1M context、可讀文字／圖片／影片／音訊的全模態模型，權重標 MIT。官方 API 每 1M tokens 只要 $0.435／$0.87 與 $0.14／$0.28，Flash 是 OpenRouter 週榜第 10。代價是慢且囉嗦：Artificial Analysis 現行指數給 Pro 30 分、每題平均 43.7 分鐘，終端與資安長任務仍明顯落後閉源前沿。"
description: "小米 MiMo 模型家族介紹：MiMo-V2.6-Pro、Flash、Pro-UltraSpeed 與 Distill-Qwen-9B 的規格、混合 SWA 架構與單次混合 RL 訓練、官方與第三方評測、MIT 授權與使用限制、官方 API 與 OpenRouter 價格、V2.5 停用、HF／Ollama 採用數字、2025→2026 演化與 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 40
draft: false
glossary:
  - term: "SWA（Sliding Window Attention，滑動視窗注意力）"
    aliases: ["SWA"]
    definition: "每個 token 只看前面固定長度視窗（MiMo-V2.6 為 128 個 token）的注意力；MiMo 把多層 SWA 與少數全域注意力層交錯，以壓低長 context 的 KV cache"
  - term: "MOPD（Multi-Teacher On-Policy Distillation）"
    aliases: ["MOPD2"]
    definition: "小米的多教師 on-policy 蒸餾：學生模型自己生成，交給各領域的教師模型逐 token 評分後更新；V2.6 的 MOPD2 再加入以教師軌跡或 SFT 示範當前綴的單輪生成"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-mimo-en)

MiMo 是小米自研的大型語言模型家族，Hugging Face 組織是 [XiaomiMiMo](https://huggingface.co/XiaomiMiMo)。這篇寫給要評估中國開放權重模型的 Agent 開發者：MiMo-V2.6-Pro 與 Flash 各適合什麼任務、在 DeepSeek、Kimi、Tencent Hy 旁邊站在哪裡，以及「便宜」背後要付出的速度與穩定性代價。

2026 年 11 月的局面是：V2.6 系列在 9 月 21–22 日開源並上線 API，9 月 27 日補上修正工具呼叫重複問題的 MOPD 版權重；上一代 V2.5 的官方 API 在 10 月 21 日停用。V2.6-Flash 是 [OpenRouter 週榜](https://openrouter.ai/rankings)第 10 名，截至 11 月 22 日的一週處理 3.7T tokens，比前一週多 381%。

怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

以下價格為[小米官方 API 牌價](https://mimo.xiaomi.com/mimo-v2-6)，每 1M tokens，格式為輸入／輸出：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式與價格 |
|---|---|---|---|
| MiMo-V2.6-Pro（API `mimo-v2.6-pro`；權重 `MiMo-V2.6-Pro-RL`／`-MOPD`） | 目前旗艦 | 1.02T 總參數、42B 啟用；1M context；輸入文字、圖片、影片、音訊 | 開放權重（MIT）＋API：$0.435／$0.87，快取命中 $0.0036 |
| MiMo-V2.6-Flash（API `mimo-v2.6-flash`；權重 `MiMo-V2.6-Flash-RL`／`-MOPD`） | 高頻、低成本 | 309B 總參數、15B 啟用；1M context；模態同 Pro | 開放權重（MIT）＋API：$0.14／$0.28，快取命中 $0.0028 |
| MiMo-V2.6-Pro-UltraSpeed（`mimo-v2.6-pro-ultraspeed`） | 低延遲 | 同一個 Pro checkpoint 的高速服務模式，官方稱輸出最高快 20 倍 | 只有 API：$4.35／$8.70，快取命中 $0.036 |
| MiMo-V2.6-Distill-Qwen-9B | 本機與研究用小模型 | 以 MiMo 生成資料 SFT [Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B)；文字＋圖片 | 開放權重（標 MIT）；Ollama `mimo-v2.6` |

先知道三件事：

- **權重有 RL 與 MOPD 兩版。** 9 月 21 日釋出的 `-RL` 是大規模強化學習後的 checkpoint；9 月 27 日的 `-MOPD` 是再經多教師蒸餾的升級版，主要修掉「反覆發出相同工具呼叫」的問題。官方沒有說明 API 端點目前對應哪一版權重。
- **API 限制。** [官方模型頁](https://mimo.mi.com/docs/en-US/quick-start/model)列 Pro 與 Flash 最大輸出 128K、每帳號每模型 RPM 100、TPM 10M；thinking 模式下 `temperature` 與 `top_p` 固定為 1.0 與 0.95，不能自訂。
- **小米的語音模型另成一線。** 同一平台還有 MiMo-V2.5-ASR 與 MiMo-V2.5-TTS（含聲音複製與聲音設計），本篇不涵蓋；語音選型見[語音與音訊模型家族](/posts/tech/2026-08-26-ai-model-family-speech-audio)。

### 採用程度

能查到的數字如下，都是 2026-11-23 的讀數：

| 通路 | 數字 |
|---|---|
| OpenRouter 週榜 | V2.6-Flash 第 10 名，3.7T tokens／週（+381%） |
| Hugging Face 下載（近 30 天／累計） | Flash-RL 43,138／155,568；Pro-RL 31,483／137,950；Distill-9B 38,921／68,938；Flash-MOPD 25,500／38,177；Pro-MOPD 21,593／31,388 |
| Hugging Face 衍生模型（`base_model` 篩選） | Distill-9B 126 個、Flash-RL 46、Flash-MOPD 33、Pro-RL 13、Pro-MOPD 13 |
| Ollama | `mimo-v2.6`（Distill-9B，本機）141.1K 次下載；`mimo-v2.6-flash:cloud` 10.6K；`mimo-v2.6-pro:cloud` 9,801 |
| 雲端與路由平台 | OpenRouter（小米、DeepInfra、StreamLake、Cohere、Tenstorrent 等）、[Vercel AI Gateway](https://vercel.com/changelog/mimo-v2-6-models-now-available-on-ai-gateway)、[Cloudflare](https://developers.cloudflare.com/ai/models/xiaomi/mimo-v2.6-pro/)（經 PrimaLabs）、[Fireworks](https://fireworks.ai/models/fireworks/mimo-v2p6-pro-rl)（專屬 GPU，無 serverless）、Ollama Cloud |

兩個讀法：第一，API 用量集中在 Flash，Pro 沒有進 OpenRouter 週榜前十。第二，HF 上下載最多的是 Flash，但 Ollama 上是能在單張消費級 GPU 跑的 Distill-9B 遙遙領先（14 萬次，兩個大模型的 cloud 版各約 1 萬），HF 衍生模型數也是它最多。V2.6 大模型權重的累計下載量目前遠低於上一代 V2.5 的 166 萬次，但 V2.5 已上架七個月，V2.6 只有兩個月。AWS Bedrock、Microsoft Foundry、Google Vertex AI 的託管目錄未列 MiMo，[PrudentBench](https://prudai.com/en/prudentbench/models/mimo-v2-6-pro) 11 月的合規檢查也找不到這三家的 EU 路由；需要大型雲端合約的團隊目前要自架或走上述平台。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| MiMo-7B | 2025-04 | 7B 推理模型，小米第一個開放權重 LLM | — |
| MiMo-VL-7B、MiMo-Audio-7B | 2025-05／2025-09 | 分別補上視覺與音訊的 7B 開放模型 | — |
| MiMo-V2-Flash | 2025-12-16 | 309B-A15B MoE，引入 5:1 的 SWA／全域注意力混合與 MTP，開始進入大型 MoE 競爭；2026 年 1 月、2 月兩次更新提升 coding 與工具呼叫成功率 | — |
| MiMo-V2-Pro、V2-Omni | 2026-03-18 | 1T-A42B 旗艦與 256K 全模態模型，只有 API，沒有釋出權重 | — |
| MiMo-V2.5、V2.5-Pro | 2026-04-23（API）／04-27（權重） | V2.5 首度把全模態與 1M context 放進開放權重；V2.5-Pro 開放 1T 旗艦權重，但只吃文字 | — |
| MiMo-V2.6 Pro／Flash | 2026-09-21–22 | 兩款都變成全模態，價格沿用 V2.5；整個 RL 訓練過程直播 6 天 | [模型卡](/posts/daily/2026-09-27-model-xiaomi-mimo-v2-6-pro) |
| V2.6 MOPD 版權重 | 2026-09-27 | 修正工具呼叫重複；V2.5 官方 API 於 10-21 停用 | — |

一年半內的主軸是「規模放大、模態合併、價格不動」。V2.5 世代時，要全模態得選 309B 的 V2.5、要最強文字能力得選只吃文字的 V2.5-Pro；V2.6 把兩條線合併成同樣全模態的 Pro 與 Flash，只剩規模與價格的取捨。V2.6-Pro 剛發佈時的詳細分數（AA 指數 v4.3 的 46.32 分、對 Claude Opus 5 的比較）保留在[當時的模型卡](/posts/daily/2026-09-27-model-xiaomi-mimo-v2-6-pro)。

## 架構與訓練取捨

### 骨幹：大量滑動視窗注意力

[Pro 模型卡](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL)與[技術報告](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL/blob/main/MiMo_V2_6_technical_report.pdf)寫明的設計：

| 項目 | V2.6-Pro | V2.6-Flash |
|---|---|---|
| 總參數／啟用 | 1.02T／42B | 309B／15B（技術報告寫 310B） |
| 層數（SWA／全域） | 70（60／10） | 48（39／9） |
| 路由專家 | 384 選 8，無共用專家 | 256 選 8，無共用專家 |
| 滑動視窗 | 128 token | 128 token |
| 預訓練資料 | 30T（27T 文字＋3T 全模態） | 48T（26T 文字＋22T 全模態） |

- **混合注意力**：第一層是全域注意力加稠密 FFN，其餘層由多個 SWA 層接一個全域注意力層組成區塊。視窗只有 128 token，所以絕大多數層的 KV cache 不隨 context 長度增加，這是 1M context 撐得起來的主因。
- **全模態編碼器**：681M 參數的 MiMo ViT（28 層，24 層 SWA）處理圖片與影片；音訊走 308M 的 AudioTokenizer 加 127M 的 patch encoder。
- **MTP 投機解碼**：5 層 SWA 草稿模型，一次預測後面 7 個 token 再平行驗證。
- **Flash 吃的資料比 Pro 多**：Flash 的全模態階段有 22T token，Pro 只有 3T；這可能是兩者在視覺任務上分數接近的原因之一，技術報告沒有直接下這個結論。

代價是自架門檻：官方 SGLang 範例 Pro 要 16 張 GPU、跨 2 台機器，Flash 用單機 8 張；權重以 FP8 釋出，訓練時已做 MXFP4 量化感知訓練。

### 訓練：一次混合 RL，加上直播

V2.6 的賣點在後訓練。[官方部落格](https://mimo.xiaomi.com/mimo-v2-6)與技術報告描述的做法：

- **中期訓練換優化器**：預訓練用 AdamW，中期訓練（256K 再延伸到 1M）把隱藏層換成 Muon 的變體 Muown，為大批次 RL 做準備。
- **You Only RL Once**：coding、一般 agent、視覺與資安任務放進同一批次、同一次 RL，並混用多種 agent harness，而不是各領域分開訓練再合併。每步 1,568 個 prompt、每個 16 條 rollout，單步 3.5–3.7B tokens。
- **Groupwise Agentic Grading**：通過測試的解法不再全拿一樣的獎勵。GRS 從同組 rollout 的對比離線建立評分標準，GAR 線上把優勢值移向品質較高、路徑較短的解法。
- **MOPD2**：RL 之後再做多教師 on-policy 蒸餾，延伸到難以自動驗證的領域（遊戲開發、科研、具身智慧）。

小米把 RL 正式訓練直播了 6 天：兩個模型各跑 30 步、約 75 萬條軌跡，成本約 $0.85M（Flash）與 $2.62M（Pro）；保留的 DeepSWE v1.1 從 48.8 升到 65.68（Flash）、58.4 升到 72.57（Pro）。環境、RL 框架與 Distill-9B 一併開源，對想研究 agentic RL 的團隊是少見的完整材料。

## 評測與競品比較

### 第三方：Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/mimo-v2-6-pro) 的 Intelligence Index v5.0.1 給 V2.6-Pro 30 分，在大型開放權重模型裡排第 6、高於中位數 23；[Flash](https://artificialanalysis.ai/models/mimo-v2-6-flash) 27 分。同一版指數上 [Tencent Hy4 是 35 分](/posts/tech/2026-11-23-ai-model-family-tencent-hy)。

小米官方與發佈當時的模型卡引用的 46.32 分是舊版指數 v4.3，評測組成不同，不能跟現行的 30 分直接相比，也不能拿 46 分去跟其他模型的 v5 分數排名。

Artificial Analysis 也標出兩個代價：

- **慢**：Pro 每題平均 43.7 分鐘（同級中位數 14.4），首個答案 token 要 36 秒、輸出約 46 tok/s；Flash 每題 48.9 分鐘，比 Pro 還慢。
- **囉嗦**：跑完整套指數 Pro 產生 1.31 億個輸出 token、Flash 1.63 億，中位數約 1.04 億。

### 第三方：Vals AI

[Vals AI](https://www.vals.ai/models/xiaomi_mimo-v2.6-pro) 目前的 Vals Index 給 Pro 57.81%（43 個模型中第 24）、[Flash](https://www.vals.ai/models/xiaomi_mimo-v2.6-flash) 54.83%（第 28），兩者都經官方 API 測。Vals 自己跑的 Terminal-Bench 4.0：Pro 31.31%、Flash 24.24%。發佈當天 Vals 的評語是 Flash 59.58%、Pro 59.47%，在當時 65 個模型的版本裡是開放權重第一、第二，CyberBench 由 Flash 拿第一；兩個時間點的模型集合不同，名次不能直接比。

### 官方自報：V2.6 對上閉源前沿

以下摘自 [Pro 模型卡](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL)與技術報告 Table 3，全部是小米公布的數字；MiMo Code Bench、MiMo Visual Coding、MiMo Cyber Bench 是小米內部評測集：

| Benchmark | V2.6-Pro | V2.6-Flash | V2.5-Pro | Claude Opus 5 | GPT-5.6 Sol |
|---|---|---|---|---|---|
| DeepSWE v1.1 | 71.9 | 67.9 | 19.0 | 74.0 | 73.0 |
| ProgramBench | 26.5 | 26.0 | 12.5 | 37.0 | 25.0 |
| AutomationBench v1.0.6 | 53.1 | 52.3 | 16.0 | 50.3 | 45.8 |
| Toolathlon-Verified | 76.9 | 73.6 | 49.1 | 80.6 | 74.9 |
| Terminal Bench 4.0 | 34.9 | 28.8 | 1.5 | 49.0 | 39.9 |
| OSWorld-Verified | 82.0 | 80.8 | — | 83.4 | 83.0 |
| JobBench | 62.0 | 61.2 | 25.0 | 65.7 | 45.4 |
| ExploitBench | 47.9 | 25.3 | 16.6 | 70.0 | 78.5 |

讀法：

- **比較對象是上一輪的閉源模型。** 表中是 Claude Opus 5 與 GPT-5.6 Sol。[官方部落格附錄](https://mimo.xiaomi.com/mimo-v2-6)另列較新的對手：Terminal Bench 4.0 上 GPT 6 Astra 59.6、Claude Fable 5.1 55.1，差距比表中更大。
- **一般 agent 與電腦操作接近前沿。** AutomationBench、JobBench、OSWorld-Verified 與 Opus 5 相差幾分以內。
- **終端長任務與資安攻擊落後。** Terminal Bench 4.0 落後 Opus 5 約 14 分，第三方 Vals 測到的 31.31% 也低於自報的 34.9；ExploitBench、ExploitGym 差距更大。
- **Flash 跟 Pro 很接近。** 多數項目差 4 分以內；差距大的是 Terminal Bench 4.0、ExploitBench 這類長任務與資安項目。部落格附錄裡 DeepSeek V4.1 Flash 的 DeepSWE（74.2）與 AutomationBench（54.8）都高於 V2.6-Pro。

### Distill-Qwen-9B

[模型卡](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B)列的是 SFT checkpoint 相對 Qwen3.5-9B 的增益（小米自測）：SWE-bench Pro 44.6（原 32.0）、AutomationBench 30.3（原 5.0）、Terminal Bench 2.1 37.1（原 27.0）。它是給 agentic RL 研究當起點的 SFT 版本，官方沒有宣稱它能取代大模型。

## 授權、價格與部署

### 權重授權：MIT，附一段使用限制提醒

V2.6 所有權重 repo 的 metadata 都標 MIT，Artificial Analysis 也列 MIT。要注意兩點：

- **repo 裡沒有附 LICENSE 全文**，授權只寫在模型卡的 metadata；需要法務存檔的團隊得自行保留模型卡版本。
- **模型卡末段有「Use Restrictions」**，列出不得用於違法、侵權、軍事用途、惡意資安活動、未經授權處理個資或違規爬取，以及「在沒有適當人類監督下自主執行高風險動作」。同一段也寫明這只是提醒，不修改既有授權、不加授權條件。

換句話說，商用、微調、再散布、做 API 轉售都沒有 Tencent Hy 那類營收或月活門檻；但把 MiMo 接成無人監督的 agent 去跑高風險操作，與小米公開表態的期待相反。Distill-9B 的基底 Qwen3.5-9B 有自己的授權，衍生使用時兩者都要看。

### API 服務與資料

[服務協議](https://mimo.mi.com/docs/terms/user-agreement)（2026-07-07 版）寫明中國境外的服務由 Xiaomi Technologies Singapore 營運，資料存放在歐洲與新加坡的伺服器；中國境內另有一套條款。[中國境內版隱私政策](https://privacy.mi.com/XiaomiMiMoPlatform/zh_CN)寫明未經事先同意，不會把使用者提供的文字內容用於模型訓練，條文只講文字，沒有涵蓋圖片、影片與音訊。

### API 價格

- **官方**：Flash $0.14／$0.28、Pro $0.435／$0.87、UltraSpeed $4.35／$8.70（每 1M tokens）；快取寫入限時免費。中國的人民幣價格另列在定價頁。
- **OpenRouter 上的第三方託管價差很大。** Flash 從 $0.10（Darkbloom，FP4、context 只有 32K）到 $0.20（Makora）都有；Pro 在 PrimaLabs 是 $2.64／$5.28，經 PrimaLabs 的 Cloudflare 是 $4.00／$8.00，比官方貴 6–9 倍。路由時要鎖定供應商，不能只看模型名。
- **UltraSpeed 是 Pro 的十倍價。** 官方稱輸出最高快 20 倍，OpenRouter 的描述寫約 10 倍；只在延遲真的是瓶頸時才值得。

### 停用與遷移

[官方停用公告](https://mimo.mi.com/docs/en-US/updates/deprecate)：`mimo-v2.5-pro` 與 `mimo-v2.5` 在 2026-10-21 10:00（UTC+8）停用，10 月 14 日起已自動轉到 `mimo-v2.6-pro` 與 `mimo-v2.6-flash`。遷移時要注意 Flash 的 `max_completion_tokens` 預設從 32,768 變成 131,072，以及 thinking 模式不再接受自訂 `temperature`／`top_p`。OpenRouter 上仍有第三方託管的 V2.5，但小米官方端點已關閉。

### 自架

官方提供 SGLang（`lmsysorg/sglang:latest`）與 vLLM（`vllm/vllm-openai:mimov25-cu129`）的部署指令，`--reasoning-parser mimo`、`--tool-call-parser mimo` 要一起開。Flash 的模型卡提醒穩定版 vLLM 可能跟不上，建議用預建映像檔。

## Agent 使用與選型

- **高頻、成本敏感的 agent 迴圈** → V2.6-Flash。價格是 Pro 的三分之一，多數 agent benchmark 只差幾分。
- **需要看螢幕、影片或聽音訊的 agent** → V2.6-Pro 或 Flash。同一個模型吃四種模態，可以省掉另外串 OCR 或 ASR。
- **主力 coding agent 或終端操作** → MiMo 不是首選。Terminal Bench 4.0（官方 34.9、Vals 31.31%）明顯落後閉源前沿，DeepSWE 也輸 DeepSeek V4.1 Flash。
- **要求低延遲或互動式** → 標準版不適合，每題平均 40 分鐘以上；UltraSpeed 速度快但價格是十倍，要先算帳。
- **資安滲透或漏洞利用** → 不適合。ExploitBench 落後 GPT-5.6 Sol 約 30 分，模型卡的使用限制也明列惡意資安活動。
- **本機或研究 agentic RL** → Distill-Qwen-9B 加上開源的環境與 RL 框架。
- **要寬鬆授權的大型開放權重** → MIT，沒有 MaaS 或月活門檻。

最小的選型驗證：把同一組 agent 任務送 Flash 與 Pro 的官方端點，記錄完成率、輸出 token、總耗時與工具呼叫次數。同一條軌跡裡出現重複的工具呼叫，就換成 MOPD 版權重自架，或在 host loop 加上重複呼叫偵測。

## 限制與取捨

- **慢與囉嗦是第三方量到的。** Artificial Analysis 的每題耗時是同級中位數的三倍左右，輸出 token 也偏多；便宜的單價會被 token 量抵掉一部分。
- **終端長任務與資安落後。** 官方表、Vals 的 Terminal-Bench 4.0 與部落格附錄都指向同一件事，而且官方表的比較對象不是最新一代閉源模型。
- **工具呼叫重複。** [小米自己的分析](https://mimo.xiaomi.com/blog/mimo-v2-6-tool-call-repetition)顯示 RL 版在 OpenCode 的重複率是 Flash 1.02%、Pro 0.54%；MOPD 版有改善，但官方沒說 API 用的是哪一版。
- **分數口徑要對齊。** 46.32 是 AA 舊版指數、30 是現行版本；Vals 的名次在發佈後因模型集合變動而改變。引用時要寫明版本與日期。
- **大型雲端目錄沒有。** 需要 Bedrock、Foundry、Vertex 合約與資料駐留保證的團隊，現在只能自架。
- **授權文件不完整。** 權重只有 metadata 標 MIT、沒有 LICENSE 全文，模型卡另附使用限制提醒。

MiMo 的策略可以概括成：用公開直播與完整開源的 RL 工程建立可信度，把開放權重做到便宜、全模態、MIT。對外部開發者來說，V2.6-Flash 是高頻 agent 迴圈與多模態輸入值得排進評測清單的低價選項；它不是 coding 或資安冠軍，也不適合要求即時回應的場景。

## 參考資料

- [Introducing MiMo-V2.6 series — Xiaomi MiMo 官方部落格](https://mimo.xiaomi.com/mimo-v2-6)
- [XiaomiMiMo/MiMo-V2.6-Pro-RL — Hugging Face 模型卡（規格、評測、部署、使用限制）](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL)
- [XiaomiMiMo/MiMo-V2.6-Flash-RL — Hugging Face 模型卡](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Flash-RL)
- [XiaomiMiMo/MiMo-V2.6-Pro-MOPD — Hugging Face 模型卡](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-MOPD)
- [XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B — Hugging Face 模型卡](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B)
- [MiMo-V2.6 技術報告（PDF）](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL/blob/main/MiMo_V2_6_technical_report.pdf)
- [Diagnosing and Mitigating Tool-Call Repetition in MiMo-V2.6 — Xiaomi MiMo 技術部落格](https://mimo.xiaomi.com/blog/mimo-v2-6-tool-call-repetition)
- [Models — Xiaomi MiMo API 文件](https://mimo.mi.com/docs/en-US/quick-start/model)
- [Model Deprecation — Xiaomi MiMo API 文件](https://mimo.mi.com/docs/en-US/updates/deprecate)
- [Model Release — Xiaomi MiMo API 文件（各代發佈紀錄）](https://mimo.mi.com/docs/en-US/updates/model)
- [Xiaomi MiMo Service Agreement](https://mimo.mi.com/docs/terms/user-agreement)
- [Xiaomi MiMo 隐私政策（簡體中文）](https://privacy.mi.com/XiaomiMiMoPlatform/zh_CN)
- [XiaomiMiMo/MiMo-V2.5-Pro — Hugging Face](https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro)
- [XiaomiMiMo/MiMo-V2.5 — Hugging Face](https://huggingface.co/XiaomiMiMo/MiMo-V2.5)
- [XiaomiMiMo/MiMo-V2-Flash — Hugging Face](https://huggingface.co/XiaomiMiMo/MiMo-V2-Flash)
- [XiaomiMiMo/MiMo-7B-RL — Hugging Face](https://huggingface.co/XiaomiMiMo/MiMo-7B-RL)
- [Xiaomi: MiMo-V2.6-Flash — OpenRouter（供應商與價格）](https://openrouter.ai/xiaomi/mimo-v2.6-flash)
- [Xiaomi: MiMo-V2.6-Pro — OpenRouter](https://openrouter.ai/xiaomi/mimo-v2.6-pro)
- [LLM Rankings — OpenRouter](https://openrouter.ai/rankings)
- [MiMo-V2.6-Pro — Artificial Analysis](https://artificialanalysis.ai/models/mimo-v2-6-pro)
- [MiMo-V2.6-Flash — Artificial Analysis](https://artificialanalysis.ai/models/mimo-v2-6-flash)
- [MiMo V2.6 Pro — Vals AI](https://www.vals.ai/models/xiaomi_mimo-v2.6-pro)
- [MiMo V2.6 Flash — Vals AI](https://www.vals.ai/models/xiaomi_mimo-v2.6-flash)
- [mimo-v2.6 — Ollama](https://ollama.com/library/mimo-v2.6)
- [MiMo V2.6 models now available on AI Gateway — Vercel](https://vercel.com/changelog/mimo-v2-6-models-now-available-on-ai-gateway)
- [MiMo-V2.6-Pro — Cloudflare AI docs](https://developers.cloudflare.com/ai/models/xiaomi/mimo-v2.6-pro/)
- [MiMo-V2.6-Pro-RL — Fireworks AI](https://fireworks.ai/models/fireworks/mimo-v2p6-pro-rl)
- [MiMo V2.6 Pro — PrudentBench（雲端路由合規檢查）](https://prudai.com/en/prudentbench/models/mimo-v2-6-pro)
- [模型卡｜MiMo-V2.6-Pro](/posts/daily/2026-09-27-model-xiaomi-mimo-v2-6-pro) — 本站
- [Tencent Hy（混元）模型家族](/posts/tech/2026-11-23-ai-model-family-tencent-hy) — 本站
- [語音與音訊模型家族](/posts/tech/2026-08-26-ai-model-family-speech-audio) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
