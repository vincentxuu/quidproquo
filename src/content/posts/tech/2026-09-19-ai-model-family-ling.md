---
title: "百靈（Ling）——560B／25B 的 Ling 3.1 成為主力，Ring 併入混合推理，醫療與語音線各自開枝"
date: 2026-09-19
category: tech
type: deep-dive
tags: [ai-agent, llm, ant-group, model-family-ling, moe, open-source, agent, finance, healthcare]
lang: zh-TW
description: "螞蟻集團百靈（Ant Ling／inclusionAI）模型家族：Ling-3.1-flash（560B 總參數／25B 啟用、1M context、MIT）與原生多模態的 Ling-3.2-flash 成為主力，Ring 思考模型線 API 下架改由混合推理 Ling 承接，LingSante 醫療線與 Ming-3.0 語音線，以及授權、價格、停用時程與 Agent 選型"
tldr: "百靈目前的主力是 Ling-3.1-flash：560B 總參數、每 token 啟用 25B、1M context，思考可開關，MIT 權重在 Hugging Face。2026-11-05 上線的 Ling-3.2-flash 同尺寸、原生吃圖像與影片，目前只有 API（OpenRouter 有免費端點），權重官方說即將開放。Ring 思考模型已在 2026-11-15 從官方 API 下架，官方建議改用 Ling-3.1-flash。要省錢、高頻任務仍可用 124B／5.1B 的 Ling-3.0-flash；醫療有 LingSante-3.1，語音有 Ming-3.0。"
series:
  name: "AI 模型家族"
  order: 20
glossary:
  - term: "百靈（Ling）"
    def: "螞蟻集團自主開發並開源的大型語言模型家族，以 MoE 架構為主；目前在官方 API 上的是 Ling 3.x 系列，另有 Ming 全模態／語音線與 LingSante 醫療線"
  - term: "Ring"
    def: "百靈過去的思考模型線（Ring-1T 到 Ring-2.6-1T）；官方 API 已於 2026-11-15 全數下架，建議改用可開關思考的 Ling-3.1-flash，權重仍在 Hugging Face"
  - term: "Ming"
    def: "百靈的全模態與語音模型線：Ming-flash-omni-2.0 是全模態旗艦，2026 年 9–10 月推出 Ming-3.0 的語音理解、語音合成與語音辨識模型"
  - term: "KDA"
    def: "Kimi Delta Attention，線性注意力變體，在 Delta Rule 狀態更新加入細粒度對角門控；Ling 3.x 以 KDA 層為主、穿插少量 Gated MLA 全域注意力層"
---

> :globe: [English version](/posts/tech/2026-09-19-ai-model-family-ling-en)

百靈（Ant Ling，Hugging Face 上的組織名是 inclusionAI）是螞蟻集團的開源模型家族。2026 年秋天它換了一代：主力從 124B 的 Ling-3.0-flash 換成 560B 總參數、每 token 啟用 25B 的 Ling-3.1-flash，思考模式可開可關，原本獨立的 Ring 思考模型線因此從官方 API 退場。這篇給要在 agent 工作流裡選開放權重模型的人：讀完可以決定用 3.1 還是 3.0、要不要等 3.2 的權重，以及醫療、語音這兩條分支適不適合你。

這是「AI 模型家族」系列的第二十篇家族深度介紹。怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族定位與版本矩陣

以 Ant Ling 官方文件的選型表、停用頁與 Hugging Face 模型卡為準：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Ling-3.1-flash（含 `-1019` 後訓練更新） | 主力：長流程 agent、辦公、軟體開發 | 560B 總參數／25B 啟用，1M context，思考可開關 | MIT 權重（HF、ModelScope）；官方 API `Ling-3.1-flash`；OpenRouter `inclusionai/ling-3.1-flash` |
| Ling-3.2-flash | 原生多模態：視覺理解、多模態長程 agent、3D、醫療影像 | 同為 560B／25B、1M，原生吃圖像、文字、影片 | 只有 API：官方 `Ling-3.2-flash`、OpenRouter `inclusionai/ling-3.2-flash:free`；權重尚未公開 |
| Ling-3.0-flash | 低成本、高頻、低延遲 | 124B／5.1B 啟用，256K | MIT 權重；官方 API；OpenRouter 付費端點 |
| Ling-3.0-flash-VL | 低成本視覺語言 | 124B／5.5B，圖像＋影片輸入，256K | MIT 權重；官方 API；OpenRouter 付費端點 |
| Ling-3.0-tiny | 端側、本地離線 | 7.9B／1.3B | MIT 權重；官方 API；OpenRouter 付費端點 |
| LingSante-3.1-flash／-3.1-air-VL | 醫療研究與評測 | 前者基於 Ling-3.1-flash（560B／25B、1M），後者基於 Ling-3.0-flash-VL（124B／5.5B，文字＋圖像） | MIT 權重；flash 版另有 Computrix API |
| Ming-3.0 語音模型 | 語音理解、語音合成、語音辨識 | audio-flash 126B／6.5B、audio-tiny 9.3B／2.7B、tts-0.5B、tts-tiny、asr-tiny | MIT 權重；asr-tiny、tts-0.5B、audio-flash 有官方 API |

### 從三線到一條混合推理主線

2025 年到 2026 年中，百靈用三條線分工：Ling 不思考、負責執行；Ring 是萬億級思考模型、負責規劃與深度推理；Ming 負責全模態。Ling 3.0 開始，思考模式變成同一個模型的開關（官方文件說 Ling-3.0-flash 可以在思考與非思考之間切換），Ling 3.1 把這條路走完：官方停用頁把 Ling-1T、Ring-1T、Ling/Ring-2.5-1T、Ling/Ring-2.6-1T 與 Ling-2.6-flash 的替代模型全部指向 Ling-3.1-flash。

結果是選型問題變簡單了：通用文字任務先看 Ling-3.1-flash；要省錢或要低延遲退到 Ling-3.0-flash；要看圖看影片用 Ling-3.2-flash（API）或 Ling-3.0-flash-VL（可自架）。Ring 的權重還在 Hugging Face，但已經不是官方維護的服務。

### 垂直分支：金融、醫療、語音

百靈的另一個特色是把同一個底座做成領域版本：

- **金融**：Ling-3.0-flash-Fin（2026-09-09，124B／5.1B，MIT），細節見[模型卡](/posts/daily/2026-09-19-model-ant-group-ling-3-0-flash-fin)。目前官方 API 的可用清單沒有列它，OpenRouter 端點也已經沒有，要用得下載權重自架
- **醫療**：Ling-3.0-flash-Sante（2026-10-19，124B／5.1B）之後，2026-11-19 推出 LingSante-3.1-flash（換到 3.1 底座）與 LingSante-3.1-air-VL（多模態，模型卡說是螞蟻醫療團隊第一個開源的多模態醫療模型）。兩份模型卡都寫明這是研究模型、不是醫療器材
- **語音**：Ming-3.0 拆成理解（audio-flash、audio-tiny）、合成（tts-0.5B、tts-tiny）與辨識（asr-tiny）三種，小尺寸的 tts-tiny 與 asr-tiny 用的是 Ling 3.0 tiny 的骨幹

## 家族演化

| 時間 | 版本 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| 2025-03 | Ling 1.0 | 在非 A100／H100 的異構算力上驗證 MoE 大模型 | 國產算力自架成為賣點 |
| 2025-10-09 | Ling-1T、Ring-1T | 萬億參數非思考與思考模型同步開源 | 「Ling 執行、Ring 規劃」的雙模型組合成形；官方 API 已於 2026-06-15 下架 |
| 2025-10 | Ling 2.0 系列 | FP8 端到端訓練、1M context | 萬億級開源模型可以拿來做長文件 |
| 2026-02 | Ling-2.5-1T、Ring-2.5-1T、Ming-flash-omni-2.0 | Ling 2.5 改用混合線性注意力；Ring 2.5 官方稱 IMO 2025、CMO 2025 金牌水準；Ming 2.0 統一語音、音樂與音訊 | 長程推理的吞吐變便宜；API 已於 2026-09-30 下架 |
| 2026-04～05 | Ling-2.6-1T、Ling-2.6-flash、Ring-2.6-1T | 2.6-flash 為 104B／7.4B；Ring-2.6-1T API 提供 high／xhigh 推理強度 | 萬億旗艦與思考模型的最後一代；API 已於 2026-11-15 下架 |
| 2026-07-23 | Ling-3.0-flash | 124B／5.1B，原生混合線性架構（KDA：MLA 5:1），思考可開關 | 百億級模型逼近前代萬億旗艦，單節點可部署 |
| 2026-08～09 | Ling-3.0-tiny、Ling-3.0-flash-VL、Ling-3.0-flash-Fin | 7.9B／1.3B 端側版；124B／5.5B 視覺語言版；金融增強版 | 同一底座開始分出端側、視覺與垂直領域版本（Fin 見[模型卡](/posts/daily/2026-09-19-model-ant-group-ling-3-0-flash-fin)） |
| 2026-09～10 | Ming-3.0 語音模型 | audio-flash／tiny（09-03）、tts-0.5B／tiny（09-22）、asr-tiny（10-14），10-19 上官方 API | 語音辨識、合成與理解有了可自架的專用小模型 |
| 2026-09-30 | Ling-3.1-flash（API 首發） | 560B／25B；免費體驗期間服務長度 256K | 主力尺寸從百億級跳到五百億級 |
| 2026-10-15 | Ling-3.1-flash 開源 | MIT 權重；HF repo 建於 10-13，另有 base 版（10-25） | 目前的選型基準，見下方各節 |
| 2026-10-27 | Ling-3.1-flash-1019 | 同架構的後訓練更新，官方引用 AA Intelligence Index v4.3.2 從 41 升到 44 | 自架建議直接用這一版 |
| 2026-11-05 | Ling-3.2-flash | 560B／25B、1M，原生多模態；上線前兩週限免 | 多模態不必再退到 124B 的 VL 版，但目前只有 API |
| 2026-11-19 | LingSante-3.1-flash、LingSante-3.1-air-VL | 醫療線換到 3.1 底座，並推出多模態醫療版 | 醫療研究可以直接拿 MIT 權重做評測 |

主線是：**先用萬億參數證明上限，再用混合線性架構把同等能力壓到百億級（3.0），然後在 3.1 把尺寸放回五百億級、把思考與非思考合進同一個模型**。Ring 的退場是這條路的結果，不是放棄推理。

## 架構與訓練取捨

### Ling 3.1：更高比例的線性注意力

[Ling-3.1-flash 模型卡](https://huggingface.co/inclusionAI/Ling-3.1-flash)寫明結構：72 層中 63 層是 KDA（Kimi Delta Attention，線性時間複雜度）、9 層是 Gated MLA，比例 7:1；前 4 層是 dense 層；MoE 部分 512 個路由專家每 token 選 8 個，外加 1 個共享專家；hidden size 4096，詞彙表 157,184。

跟 Ling 3.0（42 層、KDA：MLA 5:1、hidden 2560）相比有兩個變化：

- **線性注意力比例更高**：每 8 層只留 1 層全域注意力。官方部落格的說法是 KDA 負責長序列擴展、Gated MLA 保留全域通路，1M context 因此不需要讓每一層都付二次方成本。代價是全域檢索能力集中在少數層，長文件裡的精準回查仍要用自己的資料驗證
- **專家稀疏度不變、尺寸放大**：啟用比例維持 8/512（1/64），但每個專家變寬、層數變多，總參數從 124B 變成 560B、啟用從 5.1B 變成 25B。單 token 計算量約是 3.0 的五倍，換來的是長流程任務的穩定度

### 思考可開關，不再分兩個模型

Ling 3.1 是「hybrid reasoning」模型：推論時用 `chat_template_kwargs: {"enable_thinking": true}` 開啟思考，模型卡建議 agent 任務開著、取樣參數 `temperature=1.0`、`top_p=0.95`、`top_k=20`。官方部落格也承認 RL 讓任務成功率上升的同時，思維鏈長度與互動輪數變長，會拉高回應時間與 token 成本。

### 部署取捨：BF16 要 8 張 H200

官方 BF16 權重約 574GB。模型卡的 SGLang 範例是 8×H200（TP8＋EP8）或 4×GB300；開源部落格說 routed experts 用 MXFP4、dense 層用 block-FP8 後，權重從約 534GB 降到 292GB，Hopper 上可從 8 卡降到 4 卡。Hugging Face 上 inclusionAI 目前只為醫療版放了 MXFP4 repo（`LingSante-3.1-flash-MXFP4`），通用版的量化檔主要來自社群（GGUF、EXL3、MLX 等）。

### Ling-3.2-flash：架構未公開

官方只公開 560B 總參數、25B 啟用、1M context，以及「從架構層面原生融合視覺與語言、不依賴外掛視覺模組」。層數、視覺編碼器與訓練資料都沒有公開，權重也還沒放出，本文不推測它跟 3.1 的關係。

## 評測與競品比較

以下數字都來自官方模型卡、部落格或官方帳號公告，條件不同的分數不混表比較。

### Ling-3.1-flash（官方引用與自報）

| 指標 | 數值 | 來源與條件 |
|---|---|---|
| Artificial Analysis Intelligence Index v4.3.2 | 41（原版）→ 44（`-1019`） | `-1019` 模型卡引用 |
| Artificial Analysis Intelligence Index v5 | 30（`-1019`） | 同上；v4 與 v5 尺度不同，不能直接相減 |
| AA-Briefcase | 1397 → 1524 | 同上 |
| AutomationBench-AA | 62% → 68% | 同上 |
| CritPt／SciCode | 18%→26%／54%→57% | 同上 |
| 輸出速度 | 約 210 token/s | 開源部落格引用 Artificial Analysis |

官方部落格另外公開三個長時間執行的案例，對照組是 Claude Fable 5 與 GLM-5.3-Flash：從零寫 Lua 到 x86-64 的編譯器，約 17 小時後通過 178／182 項測試（97.8%，Fable 5 為 99.0%、GLM-5.3-Flash 95.9%）；把 C 圖像庫重寫成 Rust，加速 8.015 倍，高於 GLM-5.3-Flash 的 1.396 倍、遠低於 Fable 5 的 27.31 倍。這些是官方自選的任務，能看出它能跑十幾小時不崩，但不是公開 benchmark。

### Ling-3.2-flash（官方帳號公告）

Ant Ling 的發佈貼文列出三項對 Claude Opus 5（max）的比較：OmniDocBench 1.5 92.21 對 90.56、ZEROBench（Sub）43.71 對 39.52、Vision2Web 85.86 對 80.20。這三項都是文件理解與視覺任務，是廠商自選的勝場，沒有第三方重測。

### LingSante-3.1

模型卡說它在開源模型的複雜醫療推理上領先，但結果只以圖片呈現、沒有可複製的數字表；Artificial Analysis 已收錄 LingSante-3.1-flash，因為沒有公開 API，還沒有 Intelligence Index 分數。模型卡也明說 benchmark 與模擬環境的結果不代表臨床有效性。

### 跟競品的位置

- **對上中國開放模型（GLM-5.3、DeepSeek V4.x、Kimi 等）**：Ling-3.1-flash 的賣點是價格與 MIT 授權，官方長程案例對 GLM-5.3-Flash 互有勝負，綜合指數本文沒有可在同條件下並列的數字
- **對上閉源前沿**：官方自己的長程案例顯示跟 Claude Fable 5 仍有差距，極限效能優化差距最大
- **3.1 對上 3.0**：3.1 能力強、但每 token 啟用量約五倍；官方選型表仍把 3.0-flash 定位為高 TPS、低成本的高頻任務模型

## 授權、價格與部署

### 授權

Ling-3.0／3.1 系列、LingSante、Ming-3.0 語音模型在 Hugging Face 的授權欄都是 MIT（Ling-3.1-flash repo 沒有另附 LICENSE 檔，以 metadata 為準）。Ling-3.2-flash 目前沒有權重，只能依各 API 平台的服務條款使用。醫療版的模型卡另外列出使用限制：不能獨立做診斷、處方或分流決策，處理病歷要符合當地隱私與醫療法規。

### API 價格（每百萬 token）

官方定價頁（Ant Ling，人民幣）：

| 模型 | 輸入 | 輸出 | 快取讀取 | 目前優惠 |
|---|---|---|---|---|
| Ling-3.2-flash | ¥2.00 | ¥6.00 | ¥0.40 | 上線前兩週限免已結束 |
| Ling-3.1-flash | ¥2.00 | ¥6.00 | ¥0.40 | 2.5 折：¥0.50／¥1.50／¥0.10 |
| Ling-3.0-flash、Ling-3.0-flash-VL | ¥0.50 | ¥1.50 | ¥0.10 | 2.8 折：¥0.14／¥0.42／¥0.028 |

OpenRouter（美元，2026-11-23 的模型 API）：

| Model ID | 端點 | Input | Output | Context |
|---|---|---|---|---|
| `inclusionai/ling-3.2-flash:free` | Ant Digital | $0 | $0 | 1M |
| `inclusionai/ling-3.1-flash` | Novita | $0.06 | $0.18 | 1M |
| `inclusionai/ling-3.0-flash` | Novita／DeepInfra | $0.021／$0.06 | $0.063／$0.18 | 262K／131K |
| `inclusionai/ling-3.0-flash-vl` | DeepInfra | $0.06 | $0.18 | 131K |
| `inclusionai/ling-3.0-tiny` | Ant Digital | $0.015 | $0.045 | 262K |

官方定價頁列的 OpenRouter 價格是 3.1-flash 原價 $0.30／$0.90、優惠 $0.075／$0.225，3.2-flash $0.30／$0.90，跟 OpenRouter API 目前顯示的不完全一致，實際以 OpenRouter 頁面為準。舊的 `ling-3.0-flash:free` 與 `ling-3.0-flash-fin` 在 OpenRouter 已經沒有端點；OpenRouter 上的 3.2 免費端點只列文字與圖片輸入，影片輸入要走官方 API。

### 已停用的型號

Ant Ling 停用頁（到期後該 Model ID 的 API 呼叫會回錯誤）：

| 型號 | 停用日期（UTC+8） | 官方建議替代 |
|---|---|---|
| Ling-2.6-1T、Ring-2.6-1T、Ling-2.6-flash | 2026-11-15 | Ling-3.1-flash |
| Ling-2.5-1T、Ring-2.5-1T | 2026-09-30 | Ling-3.1-flash |
| Ling-1T、Ring-1T | 2026-06-15 | Ling-3.1-flash |

停用只影響官方 API；Hugging Face 上的權重仍可下載。

### 部署

自架建議用 SGLang（官方提供 day-0 映像檔，含 MTP 推測解碼）或 vLLM（`--tool-call-parser ling3 --reasoning-parser ling3`）。官方 API 同時相容 OpenAI 與 Anthropic 協定，文件附 Claude Code、Kilo Code、OpenClaw、Hermes Agent 的接法。Ling-3.0-flash 已有華為昇騰的適配，3.1 的國產算力支援本文引用來源沒有提到。

## Agent 使用與選型

- **長流程 coding agent、辦公自動化、搜尋 agent** → Ling-3.1-flash（自架用 `-1019`），思考開著跑；先確認你的 GPU 預算能放 8×H200 或量化後的 4 卡
- **高頻、低延遲、大量批次處理** → Ling-3.0-flash：官方 API 價格約是 3.1 原價的四分之一，關掉思考後延遲更低
- **要看圖看影片的 agent（GUI 自動化、文件理解、截圖轉網頁）** → 只用 API 的話選 Ling-3.2-flash；要自架就先用 Ling-3.0-flash-VL，等 3.2 權重
- **端側、離線、隱私敏感** → Ling-3.0-tiny（7.9B／1.3B）
- **醫療研究、醫療 agent 評測** → LingSante-3.1-flash（文字）或 LingSante-3.1-air-VL（影像報告、皮膚、餐點、GUI 掛號流程），一律加人工覆核
- **金融投研** → Ling-3.0-flash-Fin 權重自架，或直接用 Ling-3.1-flash（官方說 3.1 在金融也有提升），兩者在自家題目上比一次
- **語音** → Ming-3.0-asr-tiny（中英＋方言辨識、支援熱詞）、Ming-3.0-tts-0.5B（7 種語言＋四川話、粵語，零樣本音色複製）、Ming-3.0-audio-flash（音訊理解與推理）
- **還在呼叫 Ring 或 Ling 2.x 的 API** → 已經停用，改成 `Ling-3.1-flash` 並開啟思考，重跑自己的評測；Ring 的 xhigh 推理強度沒有對應的參數

最小的選型驗證：用 20–50 題自家 agent 任務，分別跑 Ling-3.1-flash 思考開／關與 Ling-3.0-flash，記錄成功率、平均輸出 token、工具呼叫輪數與單題成本。3.1 的優勢在長流程，題目要包含多輪工具呼叫，否則看不出差別。

## 限制與取捨

- **3.2 還不能自架**：Ling-3.2-flash 只有 API，架構細節與權重都未公開；官方只說權重「即將開放」
- **評測幾乎都是官方自報**：AA 分數由模型卡引用，長程案例與 3.2 的勝場都是官方自選；醫療版的數字只有圖片
- **3.1 的硬體門檻高**：BF16 要 8 張 H200 等級的 GPU，量化後也要 4 張；不是單機工作負載
- **思考變長**：官方承認 RL 後思維鏈與互動輪數增加，帳單與延遲要用自己的工作負載估
- **價格標示不一**：官方文件與 OpenRouter API 對同一模型列的價格不同，優惠結束後也會回到原價
- **醫療版不是醫療器材**：兩份 LingSante 模型卡都禁止獨立做診斷、處方與分流
- **Ring 的位置**：思考模型線不再有官方服務，需要萬億級思考模型的團隊只能自架舊權重

## 更新紀錄

- 2026-11-23：換代到 Ling 3.1 世代。矩陣、架構、評測、價格與選型改寫為 Ling-3.1-flash（2026-09-30 API、10-15 開源、10-27 `-1019` 更新）與 Ling-3.2-flash（11-05，只有 API）；新增 LingSante-3.1 醫療線、Ming-3.0 語音線與官方停用表（Ring 全線與 Ling 2.x 已從官方 API 下架）。Ling 3.0 世代降為歷史與低成本選項，原本的 3.0 衍生版本表與 Fin 細節移出正文，Fin 見時間線連結的每日模型卡。修正錯誤：移除已失效的 OpenRouter `ling-3.0-flash:free`、`:fin:free`、`:vl:free` 端點；「三線並行、Ring 負責規劃」改為現況；「幾乎所有模型 Apache 2.0 或 MIT」改為逐模型標示授權；詞彙表的 Ring 說明原寫 Ring-2.6-1T 拿 IMO 金牌，正文來源寫的是 Ring 2.5，已改寫。
- 2026-10-11：整理格式、版本矩陣與選型章節，沿用既有來源與日期；本次未重新查證事實。

## 參考資料

- [Ant Ling 文件：Ling 模型系列與選型表](https://developer.ant-ling.com/zh-CN/docs/models/ling/) — 3.2／3.1／3.0 規格、演進表
- [Ant Ling 文件：定價](https://developer.ant-ling.com/zh-CN/docs/models/price/) — 官方與 OpenRouter、ZenMux 價格
- [Ant Ling 文件：下架](https://developer.ant-ling.com/zh-CN/docs/models/deprecation/) — Ring、Ling 2.x 停用日期與替代模型
- [Ant Ling 文件：更新日誌](https://developer.ant-ling.com/zh-CN/docs/getting-started/changelog/) — Ling-3.2-flash、Ming-3.0 API 上線日期
- [Ant Ling 部落格：Ling-3.1-flash 面向真實世界任務的模型升級（2026-09-30）](https://developer.ant-ling.com/zh-CN/blogs/ling-3.1-flash)
- [Ant Ling 部落格：Ling-3.1-flash 正式開源（2026-10-15）](https://developer.ant-ling.com/zh-CN/blogs/ling-3.1-flash-open-source)
- [Ant Ling：Introducing Ling-3.2-flash（LinkedIn，2026-11-06）](https://www.linkedin.com/posts/ant-ling_antling-multimodalai-opensourceai-activity-7524272962829471744-O2DN)
- [Hugging Face：inclusionAI/Ling-3.1-flash](https://huggingface.co/inclusionAI/Ling-3.1-flash)
- [Hugging Face：inclusionAI/Ling-3.1-flash-1019](https://huggingface.co/inclusionAI/Ling-3.1-flash-1019)
- [Hugging Face：inclusionAI/LingSante-3.1-flash](https://huggingface.co/inclusionAI/LingSante-3.1-flash)
- [Hugging Face：inclusionAI/LingSante-3.1-air-VL](https://huggingface.co/inclusionAI/LingSante-3.1-air-VL)
- [Hugging Face：inclusionAI/Ming-3.0-audio-flash](https://huggingface.co/inclusionAI/Ming-3.0-audio-flash)
- [Hugging Face：inclusionAI/Ming-3.0-tts-0.5B](https://huggingface.co/inclusionAI/Ming-3.0-tts-0.5B)
- [Hugging Face：inclusionAI/Ming-3.0-asr-tiny](https://huggingface.co/inclusionAI/Ming-3.0-asr-tiny)
- [Hugging Face：inclusionAI/Ling-3.0-flash](https://huggingface.co/inclusionAI/Ling-3.0-flash)
- [OpenRouter：inclusionai 模型列表](https://openrouter.ai/inclusionai)
- [Artificial Analysis：LingSante-3.1-flash](https://artificialanalysis.ai/models/lingsante-3-1-flash-1119)
- [Ant Group 官方：Ant Group Unveils Ling AI Model Family and Launches Ling-1T（2025-10-09）](https://www.antgroup.com/en/news-media/press-releases/1759982400000)
- [Ant Group 官方：Ant Group Releases Ling-2.5-1T and Ring-2.5-1T（2026-02-16）](https://secure.businesswire.com/news/home/20260215551663/en/Ant-Group-Releases-Ling-2.5-1T-and-Ring-2.5-1T-Evolving-Its-Open-Source-AI-Model-Family)
- [Ant Group 官方：Ant Group Unveils Ling-3.0-Flash（BusinessWire，2026-07-27）](https://www.businesswire.com/news/home/20260726584441/en/)
- [Ant Group 官方：Open-Sources Ling-3.0-flash-Fin for Real-World Financial Workflows（2026-09-09）](https://www.antgroup.com/en/news-media/press-releases/1788944400000)
- [Ant Ling 文件：Ling-3.0-flash 發佈](https://developer.ant-ling.com/zh-CN/blogs/ling-3.0-flash-release)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
