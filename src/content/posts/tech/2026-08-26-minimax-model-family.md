---
title: "MiniMax：聊天 App 公司做出的低價 Agent 模型，M3.1 Flash 把單價壓到 $0.15／$0.60"
date: 2026-08-26
category: tech
type: deep-dive
tags: [open-source, moe, code-model, benchmark, pricing, china-ai, agentic-coding]
lang: zh-TW
series:
  name: "AI 模型家族"
  order: 14
tldr: "MiniMax 從角色聊天與影片生成 App 起家，2026 年靠 M 系列語言模型打進 agentic coding。目前的主力 M3.1 Flash（2026-10-19）沿用 M3 的 428B／23B 啟用 MoE、1M context，API 只要 $0.15／$0.60，快取讀取 $0.015；官方表上企業自動化（Automation-Bench）領先，但終端操作與部分 coding 項目落後，獨立測試也質疑幻覺率。權重開放，但 MiniMax Community License 的授權條文以非商業為主，商用要標示並通知或取得書面授權。這篇整理家族演化、MSA 稀疏注意力、定價與授權，以及怎麼選。"
description: "MiniMax 模型家族介紹：M3.1 Flash 與 M3 規格與定價、MiniMax Sparse Attention、M2→M3 演化、MiniMax Community License 商用條件、H3 影片與 H3-Image 圖像子線，以及 Agent 選型。"
draft: false
glossary:
  - term: "MoE"
    def: "Mixture of Experts，混合專家架構——模型有多組參數但每次只啟用一部分，兼顧能力和效率"
  - term: "MSA"
    def: "MiniMax Sparse Attention，MiniMax 自研的區塊稀疏注意力：輕量 Index Branch 為每組 GQA 挑出 top-k 個 KV 區塊，Main Branch 只對選中的區塊做精確注意力"
  - term: "SWE-bench"
    def: "Software Engineering Benchmark，用真實 GitHub issue 測量模型解決軟體工程問題能力的標準測試集"
---

> :globe: [English version](/posts/tech/2026-08-26-minimax-model-family-en)

MiniMax 一開始不是模型公司。它做的是角色聊天 App（[Talkie](https://www.talkie-ai.com/)）和影片生成（[Hailuo AI](https://hailuoai.video/)）。2026 年 2 月的 M2.5 在 SWE-bench Verified 拿到 80.2%，價格卻是閉源旗艦的零頭，MiniMax 從此成為 coding agent 的低價選項。

這篇寫給要評估 MiniMax 的 Agent 開發者：目前該用 M3.1 Flash 還是 M3、它在哪類任務值得試、權重的授權允許什麼商用，以及同一家公司的影片與圖像模型在哪裡。

## 家族定位與版本矩陣

以下價格為 2026-11-20 對照 [MiniMax 定價頁](https://platform.minimax.io/docs/guides/pricing)與[模型列表](https://platform.minimax.io/docs/guides/models-intro)核對，單位為每 1M tokens：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式與價格 |
|---|---|---|---|
| MiniMax-M3.1-Flash | 目前主力語言模型 | 428B 總參數／23B 啟用，1M context，文字／圖片／影片輸入；全模型改用稀疏注意力 | API：$0.15／$0.60，快取讀取 $0.015；開放權重（MiniMax Community License） |
| MiniMax-M3 | 上一代旗艦 | 同規模，思考模式可開關 | API：512K 以內 $0.30／$1.20（標價 $0.60／$2.40，官方標「永久五折」），超過 512K 加倍；開放權重 |
| MiniMax-H3 系列 | 影片生成 | 文字／圖片／影片／音訊參考生成影片，768P／2K | 按秒計費，詳見[影片生成家族文](/posts/tech/2026-08-26-ai-model-family-video-generation) |
| MiniMax-H3-Image | 圖像生成與編輯 | 33.1B 擴散 transformer，最多 16 張參考圖 | 按 token 計費，1K 圖約 $0.022；開放權重，授權排除部分地區（見[模型卡](/posts/daily/2026-11-16-model-minimax-h3-image)） |
| MiniMax Code／Token Plan | 官方產品 | coding agent 與訂閱方案 | 與 API 分開計費 |

M2.5 與 M2.7 已不在官方語言模型列表和定價頁上；新專案直接從 M3 系列開始。

## 家族演化

### 公司背景

MiniMax 於 2021 年 12 月在上海成立，創辦人閆俊杰來自商湯科技（SenseTime）。2026 年 1 月 9 日在港交所主板上市（股票代號 0100）。

依[2025 年年度業績公告](https://www.hkexnews.hk/listedco/listconews/sehk/2026/0302/2026030202837.pdf)，2025 年營收 7,904 萬美元（年增 159%），其中 73% 來自中國大陸以外；年度虧損 18.7 億美元，但其中 15.9 億是優先股估值上升造成的公允價值損失，調整後淨虧損約 2.5 億美元。營收約三分之二來自 AI 原生產品（如 Hailuo），三分之一來自開放平台與企業服務。

一家消費 AI 公司為什麼要做 coding 模型？要讓對話、角色扮演、影片產品真正好用，底層模型的推理與工具使用能力就得夠強；coding 是 agentic 能力的基礎。

### 演化時間線

依 [MiniMax 模型發布紀錄](https://platform.minimax.io/docs/release-notes/models)：

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| MiniMax-Text-01／VL-01 | 2025-01-15 | 第一代自家旗艦 LLM 與視覺語言模型 | — |
| MiniMax-M2 | 2025-10-27 | M 系列登場，主打 agentic 效率 | — |
| MiniMax-M2.1 | 2025-12-22 | 多語言程式與重構 | — |
| MiniMax-M2.5／highspeed | 2026-02 | SWE-bench Verified 80.2%，價格是閉源旗艦零頭；成為低價 coding agent 選項 | — |
| MiniMax-M2.7／highspeed | 2026-03-18 | 主打「模型參與自身演化」，SWE-Pro 56.2% | — |
| MiniMax-M3 | 2026-06-01 | 428B／23B、MSA 稀疏注意力、1M context、原生多模態；權重 6 月中開放 | — |
| MiniMax-H3 | 2026-07-31 | 開放權重的多模態影片模型 | 見[影片生成家族文](/posts/tech/2026-08-26-ai-model-family-video-generation) |
| **MiniMax-M3.1-Flash** | 2026-10-19（API）／10-23（權重） | 同規模換全稀疏注意力與量化感知訓練，單價約 M3 的一半 | [模型卡](/posts/daily/2026-10-20-model-minimax-m3-1-flash) |
| MiniMax-H3-Image | 2026-11-10 | 開放權重圖像生成與編輯 | [模型卡](/posts/daily/2026-11-16-model-minimax-h3-image) |

M2.5 與 M3 在主篇降為歷史。M2.5 的 SWE-bench Verified 80.2%、M3 的 SWE-bench Pro 59 與 Verified 80.5 等完整數字，分別保留在 [M2.5](https://huggingface.co/MiniMaxAI/MiniMax-M2.5) 與 [M3](https://huggingface.co/MiniMaxAI/MiniMax-M3) 的 HuggingFace 模型卡。

## 架構與訓練取捨

### MSA：讓 1M context 變便宜

[M3 官方公告](https://www.minimax.io/blog/minimax-m3)與 [MSA 論文](https://arxiv.org/html/2606.13392)說明了核心設計：MSA 建在 GQA 之上，輕量的 Index Branch 為每個 query 與 GQA 群組挑出 top-k 個 KV 區塊，Main Branch 只對選中的區塊做精確注意力。實作上以 KV 區塊為外層迴圈、聚合命中它的 query，讓每個區塊只讀一次、記憶體連續存取。

官方數字：1M context 時，M3 的每 token 計算量是 M2 的 1/20，prefill 快 9 倍、decode 快 15 倍；多數消融實驗中 MSA 與全注意力表現相當。論文另在 109B 模型上報告每 token 注意力計算量降 28.4 倍。這些都是 MiniMax 自己的測量。

### M3 → M3.1 Flash：三處改動

依 [M3.1 Flash 模型卡](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash)，它保留 M3 的 MoE 骨架，只改三處：

- **全模型稀疏注意力**：M3 前三層的全注意力也換成稀疏注意力。
- **量化感知訓練**：路由專家與注意力路徑在訓練中就量化，降低記憶體與服務成本。
- **DSpark 推測解碼**：取代 M3 類 EAGLE 的 MTP 做法，權重附帶 draft head。

另一個行為差異：M3 的思考模式可設 `enabled`／`adaptive`／`disabled`；M3.1 Flash 只能用 `reasoning_effort` 在 low 到 max 五檔間調整，無法關閉思考。

### 原生多模態與訓練方法

M3 從第一步就混合文字、圖片、影片訓練，[NVIDIA 技術部落格](https://developer.nvidia.com/blog/deploy-long-context-reasoning-and-agentic-workflows-with-minimax-m3-on-nvidia-accelerated-infrastructure/)記載約 100 兆交錯 tokens。RL 方面，[M2.5 模型卡](https://huggingface.co/MiniMaxAI/MiniMax-M2.5)寫明在超過 20 萬個真實環境、10 種以上程式語言上訓練，並觀察到模型在寫程式前會先寫架構規格的湧現行為；[M2.7](https://huggingface.co/MiniMaxAI/MiniMax-M2.7) 則讓內部版本自行改進 RL 實驗流程與程式 scaffold。

## 評測與競品比較

### M3.1 Flash 的位置

以下出自 [M3.1 Flash 模型卡](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash)，全部是 MiniMax 自測，對手多數是發布時的上一代版本：

| Benchmark | M3.1 Flash | DeepSeek V4.1 Flash-1017 | Kimi K3 | Claude Opus 5 |
|---|---|---|---|---|
| Automation-Bench v1.0.6（企業自動化） | **62.8** | 60.5 | 46.7 | 50.3 |
| BankerToolBench | **76.2** | — | 69.1 | **76.2** |
| LOCA-Bench 256K（長 context） | **60.3** | — | 49.7 | 53.7 |
| DeepSWE v1.1 | 73.7 | **77.0** | 67.5 | 74.0 |
| Terminal Bench 4.0 | 38.1 | 42.3 | 12.6 | **51.8** |
| NL2Repo-Bench | 61.2 | 68.2 | 58.0 | **75.3** |
| OSWorld 2.0 | 61.7 | — | 58.3 | **70.6** |
| HLE（不用工具） | 43.4 | 42.6 | 43.5 | **55.6** |

讀這張表：企業自動化、金融工具與長 context 任務是強項；終端操作、整個 repo 生成與電腦操作落後 Claude Opus 5。注意表裡的對手是 Kimi K3 與 Opus 5，不是後來的 K3.1 Pro 與 Opus 5.5。

### 可靠度的爭議

[站上模型卡](/posts/daily/2026-10-20-model-minimax-m3-1-flash)整理過兩組方向相反的第三方結果：VentureBeat 引用 Artificial Analysis 的 AA-Omniscience，因為 M3.1 Flash 幾乎不棄答，該評測定義下的幻覺率高達 93%；The New Stack 的事實問答測試裡它答對 56%，反而高於 DeepSeek V4.1 Flash。MiniMax 官方表沒有任何可靠度指標。用在需要事實準確的流程前，要自己測。

### 跟競品的位置

- **對上 DeepSeek V4.1 Flash**：DeepSWE、Terminal Bench、NL2Repo 都是 DeepSeek 領先；M3.1 Flash 單價更低、Automation-Bench 較高。DeepSeek 的權重授權更寬鬆（見 [DeepSeek 家族文](/posts/tech/2026-08-24-ai-model-family-deepseek)）。
- **對上 Kimi K3.1 Pro（$2／$10）**：K3.1 Pro 的 coding agent 分數高得多，單價約 13–17 倍（見 [Kimi 家族文](/posts/tech/2026-08-24-ai-model-family-kimi)）。
- **對上 [Ornith](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)**：同樣主打低成本 coding，Ornith 走自我改進 RL，MiniMax 走大規模環境 RL。

## 授權、價格與部署

### MiniMax Community License：商用要標示並通知

M3 與 M3.1 Flash 都用 MiniMax Community License（[M3.1 Flash LICENSE](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash/raw/main/LICENSE)）。條文結構和 Kimi、Qwen 的自訂授權不同：

- **授權本體寫的是非商業用途**：可使用、修改、散佈。
- **商用條件**：產品或服務要在網站、介面、部落格、關於頁或文件顯著標示「Built with MiniMax M3.1-Flash」。產品或服務年營收 2,000 萬美元以下，寄一次通知信給 MiniMax 即可；超過 2,000 萬美元，要事先取得書面授權。
- **商用的定義很寬**：收費給第三方的產品或服務、商用 API，以及部署微調或後訓練過的衍生模型，都算。
- **禁止用途附錄**：包括任何軍事用途、傷害未成年人、意圖造成傷害的不實資訊。

實際影響：小團隊商用多半只要標示加通知；營收大的產品要先談授權。和 Kimi 的門檻相比，MiniMax 的門檻按「該產品或服務」的營收算，不是整個集團，但沒有內部使用豁免條款。H3-Image 的授權另排除美國、歐盟、英國、南韓的部署與使用，選圖像模型時要另外確認。

### 價格重點

- **M3.1 Flash**：$0.15／$0.60，快取讀取 $0.015，不分 context 長度階梯。
- **M3**：512K 輸入以內 $0.30／$1.20、超過 512K 為 $0.60／$2.40（已含官方標示的永久五折）；`priority` 服務層是標準價 1.5 倍。
- **任務成本**：官方稱 M3.1 Flash 的 agentic 任務加權平均成本從 M3 的 $0.51 降到 $0.22（見站上模型卡），屬自報。

### 自架

M3.1 Flash 權重約 250GB，官方建議 SGLang、vLLM 或 TokenSpeed，另有 FlagOS 多晶片部署。模型卡標 428B 總參數，HuggingFace 中繼資料顯示的參數量較小（約 220B），官方未說明差異，可能和量化格式有關。

## Agent 使用與選型

- **大量企業自動化、金融工具、長文件任務，預算優先** → M3.1 Flash。單價是同級開放權重模型裡最低的一檔，Automation-Bench 與 LOCA-Bench 領先。
- **主力是 coding agent 或終端操作** → 先比較 DeepSeek V4.1 Flash 或 Kimi K3.1 Pro；M3.1 Flash 在 Terminal Bench 與 NL2Repo 落後。
- **需要關閉思考壓延遲** → M3 可以 `thinking: disabled`，M3.1 Flash 不行。
- **需要事實準確** → 先用自己的資料測幻覺，第三方結果互相矛盾。
- **要商用自架** → 先確認是否要標示、寄通知或取得授權；營收大的產品別假設可以直接用。
- **影片或圖像生成** → H3 與 H3-Image 走另一套計費與授權，看[影片生成家族文](/posts/tech/2026-08-26-ai-model-family-video-generation)與 [H3-Image 模型卡](/posts/daily/2026-11-16-model-minimax-h3-image)。

## 限制與取捨

- **評測幾乎都是自報**，而且對照的是發布時的上一代競品。
- **可靠度未定**：獨立測試的幻覺結果互相矛盾，官方沒有提供可靠度指標。
- **授權不是 MIT**：條文以非商業為本體，商用有標示與通知義務，沒有內部使用豁免。
- **思考模式無法關閉**（M3.1 Flash）。
- **公司仍在虧損**：調整後淨虧損約 2.5 億美元，低價可能帶有補貼成分，長期價格不能當成固定值。
- **地緣政治**：中國廠商的託管 API 對部分使用情境是考量因素；開放權重可以自架，但授權義務仍在。

## 更新紀錄

- **2026-11-20**：補上 M3 與 M3.1 Flash 世代。矩陣、架構、評測、定價、授權與選型改寫（MiniMax 定價頁、模型列表與發布紀錄、M3 官方公告、MSA 論文、HuggingFace 模型卡與 LICENSE、港交所年度業績公告，2026-11-20 讀取）；新增 MSA 機制、M3→M3.1 Flash 三處改動、Community License 條款、可靠度爭議、H3 與 H3-Image 子線。M2.5 與 M3 降為歷史，原本的 M2.5 與 M3 評測表移出正文，完整數字見其 HuggingFace 模型卡。修正：M3 規格原寫 456B／45.9B 啟用，實為約 428B／23B；M3 價格原寫 $0.60／$2.40，那是標價，實收 $0.30／$1.20 並有 512K 階梯；「營業虧損 18.7 億美元」實為年度虧損，主要來自公允價值損失，調整後淨虧損約 2.5 億美元；M2.7「每 token 啟用約 10B、SWE-bench 78%」查不到一手來源已刪除；員工人數、融資金額、使用者數等無來源數字一併刪除。
- 2026-10-11：整理格式、版本矩陣與選型章節，沿用既有來源與日期；本次未重新查證事實。

## 參考資料

- [MiniMax 定價頁](https://platform.minimax.io/docs/guides/pricing)
- [MiniMax 模型列表](https://platform.minimax.io/docs/guides/models-intro)
- [MiniMax 模型發布紀錄](https://platform.minimax.io/docs/release-notes/models)
- [MiniMaxAI/MiniMax-M3.1-Flash — HuggingFace 模型卡](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash)
- [MiniMax Community License（M3.1 Flash）— HuggingFace](https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash/raw/main/LICENSE)
- [MiniMax M3: Frontier Coding, 1M Context, Native Multimodality — 官方部落格](https://www.minimax.io/blog/minimax-m3)
- [MiniMaxAI/MiniMax-M3 — HuggingFace 模型卡](https://huggingface.co/MiniMaxAI/MiniMax-M3)
- [MiniMax Sparse Attention — arXiv:2606.13392](https://arxiv.org/html/2606.13392)
- [MiniMaxAI/MiniMax-M2.7 — HuggingFace 模型卡](https://huggingface.co/MiniMaxAI/MiniMax-M2.7)
- [MiniMaxAI/MiniMax-M2.5 — HuggingFace 模型卡](https://huggingface.co/MiniMaxAI/MiniMax-M2.5)
- [MiniMax Group 2025 年度業績公告 — 港交所](https://www.hkexnews.hk/listedco/listconews/sehk/2026/0302/2026030202837.pdf)
- [Deploy MiniMax M3 on NVIDIA Accelerated Infrastructure — NVIDIA 技術部落格](https://developer.nvidia.com/blog/deploy-long-context-reasoning-and-agentic-workflows-with-minimax-m3-on-nvidia-accelerated-infrastructure/)
- [模型卡｜MiniMax M3.1 Flash](/posts/daily/2026-10-20-model-minimax-m3-1-flash) — 本站
- [模型卡｜MiniMax-H3-Image](/posts/daily/2026-11-16-model-minimax-h3-image) — 本站
- [影片生成模型家族](/posts/tech/2026-08-26-ai-model-family-video-generation) — 本站
- [Ornith：小團隊用自我改進 RL 做出的開源 Coding 黑馬](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) — 本站
