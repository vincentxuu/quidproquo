---
title: "百靈（Ling）——從萬億旗艦到 5.1B 高效執行節點，Ant Group 的三線 AGI 棋局"
date: 2026-09-19
category: tech
type: deep-dive
tags: [ai-agent, llm, ant-group, model-family-ling, moe, open-source, agent, finance]
lang: zh-TW
description: "蚂蚁集團百靈大模型家族完整介紹：2025→2026 演化時間線、Ling/Ring/Ming 三大系列雙軌策略、從 Ling 1.0 到 Ling 3.0 的架構躍遷、Ling-3.0-flash-Fin 金融增強模型，以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 20
glossary:
  - term: "百靈（Ling）"
    def: "蚂蚁集團自主開發並開源的大型語言模型家族，包含 Ling（非思考）、Ring（思考）、Ming（多模態）三大系列，以 MoE 架構實現高效推理"
  - term: "Ring"
    def: "百靈家族中的思考模型系列，專注深度推理與數學證明，Ring-2.6-1T 在 IMO 2025 和 CMO 2025 達到金牌水平"
  - term: "Ming"
    def: "百靈家族中的全模態模型系列，支持文字、圖像、音頻、影片的跨模態理解與生成，Ming-flash-omni-2.0 為最新旗艦"
  - term: "KDA"
    def: "Kimi Delta Attention，從 Lightning Attention 升級的線性注意力變體，引入細粒度對角門控於 Delta Rule 狀態更新，精確保留長序列關鍵資訊"
---

> 🌏 [English version](/posts/tech/2026-09-19-ai-model-family-ling-en)

2025 年 3 月，蚂蚁集團在非 A100/H100 的異構計算平台上驗證了 MoE 大模型的工程可行性——這是百靈家族的起點。十五個月後，它交出了一個涵蓋 7.9B 到 1T 參數、橫跨文本、推理與全模態的开源矩陣。2026 年 9 月 9 日外灘大會上，家族再添一名成員：Ling-3.0-flash-Fin，首個金融增強模型。

這是「AI 模型家族」系列的第二十篇家族深度介紹，追溯百靈從萬億旗艦到 5.1B 高效執行節點的完整演進路徑，以及它「規劃-執行分離」的 AGI 佈局。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族演化時間線

| 時間 | 版本 | 關鍵意義 |
|---|---|---|
| 2025-03 | Ling 1.0 | 在非高端異構計算平台上驗證 MoE LLM 工程可行性，完成國產算力平台適配 |
| 2025-09 | Ring-1T-preview | 史上首個開源萬億參數思考模型 |
| 2025-10-09 | Ling-1T + Ring-1T | 萬億旗艦非思考模型 + 思考模型同步開源，Ling/Ring/Ming/Ming 三系列正式成形 |
| 2025-10 | Ling 2.0 系列 | 首度突破萬億參數規模，FP8 端到端訓練，1M context |
| 2026-02 | Ling-2.5-1T + Ring-2.5-1T | Ling 2.5：混合線性注意力、AIME 2026 僅用 5,890 token 達前沿效果；Ring 2.5：IMO 2025/CMO 2025 雙金 |
| 2026-02 | Ming-flash-omni-2.0 | 業界首個統一語音、音樂與音頻的單一架構全模態模型 |
| 2026-04 | Ling-2.6-1T | 萬億旗艦「快思考」：MLA + Linear Attention 混合架構，AIME 2026 領先，SWE-bench Verified 達開源前列 |
| 2026-04 | Ling-2.6-flash | 104B/7.4B，OpenRouter 匿名版「Elephant Alpha」連續多日 Trending 榜首 |
| 2026-05 | Ring-2.6-1T | 萬億級深度思考模型，適合複雜推理與長程自主執行 |
| 2026-07-23 | Ling-3.0-flash | 124B/5.1B，原生混合線性架構，KDA + MLA 5:1，對照 1T 旗艦效能 |
| 2026-08 | Ling-3.0-tiny | 7.9B/1.3B，純本地部署，無雲端依賴 |
| 2026-08 | Ling-3.0-flash-VL | 124B/5.5B，視覺語言模型，AA Intelligence Index 42，支援圖像與影片輸入 |
| 2026-08 | Ling-3.0-flash-Fin | 124B/5.1B，金融增強，MIT 開源，聯合中金開發 FinFIRST 評測基準 |
| 2026-09-09 | 外灘大會 | Ling-3.0-flash-Fin 正式宣布開源，全面量產 BF16/FP8/FP4/INT4 |

一年半、十二個里程碑。百靈的演化有一條清晰的主線：**先以萬億參數證明技術上限，再用架構創新壓縮到高效小模型，最後以垂直領域版本（Fin）開拓場景深度**——規模不是目的，「智效比」才是。

## 三條產品線：Ling 執行、Ring 思考、Ming 多模態

看懂百靈家族的架構關鍵，是把它拆成三條平行線（外加一條實驗線）：

**Ling 系列**（非思考/通用）：從 Ling-mini 到 Ling-3.0-flash 的全尺寸矩陣，以 MoE 架構實現「旗艦智能、Flash 效率」。這條線負責執行——高速推理、工具呼叫、高頻 Agent 任務。Ling-3.0-flash 的定位是「規劃-執行分離」範式中的執行節點。

**Ring 系列**（思考/推理）：從 Ring-1T 到 Ring-2.6-1T 的萬億思考模型，專注深度推理、數學證明和長程自主執行。Ring 2.5-1T 在 IMO 2025 拿到 35/42（金牌標準）、CMO 2025 拿到 105/126（超越中國國家隊切線）。這條線負責「規劃」——複雜問題的多步推演。

**Ming 系列**（全模態）：統一文字、圖像、音頻、影片的跨模態理解與生成。Ming-flash-omni-2.0 是業界首個在同一架構中統一語音、音樂與音頻的模型。

**LLaDA 系列**（實驗）：擴散模型實驗線，包含 LLaDA-MoE、LLaDA 2.0/2.1/2.2，探索非自回歸生成路徑。

三線並行的邏輯是：**Ling 負責「快且省」，Ring 負責「深且嚴」，Ming 負責「全且通」**。三者共用底層訓練基礎設施與架構創新（混合線性注意力、MoE 路由優化），但推理時各司其職。

## 架構演進：從混合線性到原生混合線性

百靈家族的架構躍遷可以濃縮為一條線：

**Ling 1.0（2025-03）**：在非高端異構計算平台上驗證 MoE 可行性，完成國產算力平台適配。這是工程驗證階段，架構本身還在摸索。

**Ling 2.0（2025-10）**：首度突破萬億參數，引入 FP8 端到端訓練。訓練效率大幅提升，實現跨領域泛化。上下文窗口達到 1M。

**Ling 2.5（2026-02）**：混合線性注意力架構（Hybrid Linear Attention）登場——將注意力層以 1:7 比例混搭 MLA 和 Lightning Linear Attention。顯著提升長程推理場景的吞吐能力：32K+ Token 長文本生成時，訪存規模降低 10 倍以上，生成吞吐提升 3 倍以上。

**Ling 2.6（2026-04）**：「快思考」路線確立。Ling-2.6-1T 捨棄業界普遍追求的「慢思考」多步推理模式，轉而以極低 Token 開銷直達結果。在 AIME 2026 上顯著領先其他非思考模型，SWE-bench Verified、TAU2-Bench、BFCL-V4 均達開源前列。Ling-2.6-flash 以 104B/7.4B 在 Agent 相關基準上達到同尺寸 SOTA。

**Ling 3.0（2026-07）**：從「混合線性」升級為**原生混合線性設計**。核心創新是 KDA（Kimi Delta Attention）從 Lightning Attention 脫胎換骨——引入細粒度對角門控（diagonal gating）於 Delta Rule 狀態更新，長序列記憶更新更精確。MoE 專家激活比從上一代的 1/32 壓縮到 **1/64**，模型容量不變但計算效率大幅提升。KDA 與 MLA 層以 **5:1** 比例交替，在長上下文效率與狀態記憶之間取得平衡。

這條路徑的意義是：百靈不是在「放大模型」，而是在**「壓縮智能」**——每次世代都用更少的激活參數達到同等甚至超越更大模型的效能。

## 家族矩陣與選型

### Ling 3.0 核心模型

| 面向 | Ling-3.0-tiny | Ling-3.0-flash | Ling-3.0-flash-VL | Ling-3.0-flash-Fin |
|---|---|---|---|---|
| 總參數 | 7.9B | 124B | 124B | 124B |
| 激活參數 | 1.3B | 5.1B | **5.5B** | 5.1B |
| 定位 | 純本地離線 | 生產級 Agent 執行 | 視覺語言 | 金融增強 Agent |
| 輸入 | 文字 | 文字 | **圖像 + 影片 + 文字** | 文字 |
| Context | 256K | 256K → 1M | 256K | 256K → 1M |
| 開源 | 是 | 是 | 是（MIT） | 是（MIT） |
| 適用場景 | 個人知識管理、離線 | 高預 Agent、coding | 視覺理解、多模態推理 | 投研、財報、估值 |
| AA Intelligence Index | N/A | 38 | **42** | 41 |

### Ling 3.0-flash 衍生版本（Hugging Face）

| 版本 | 說明 | 權重大小 |
|---|---|---|
| `Ling-3.0-flash` | BF16 基座 | 127.5B 參數（含 3.1B MTP head） |
| `Ling-3.0-flash-fp8` | 序列化 block-FP8 量化 | 約 66B |
| `Ling-3.0-flash-fp4` | MXFP4 壓縮量化 | 約 33B |
| `Ling-3.0-flash-int4` | 對稱 W4 壓縮（僅路由專家） | 約 16B |
| `Ling-3.0-flash-dspark` | 投机解碼 draft 模型（加速用） | 1B |
| `Ling-3.0-flash-base-midtrain` | 預訓練中期檢查點 | 127B |

同樣的量化與衍生版本也提供給 `Ling-3.0-flash-Fin`（含 `-fp4` 版本）與 `Ling-3.0-tiny`（含 `-fp8` 版本）。

### 完整 Ling 3.0 矩陣（含量化和衍生版）

| 品項 | 授權 | 取得方式 |
|---|---|---|
| Ling-3.0-flash（BF16） | MIT | Hugging Face `inclusionAI/Ling-3.0-flash` |
| Ling-3.0-flash-fp8 | MIT | 同上，權重頁量化列表 |
| Ling-3.0-flash-fp4 | MIT | 同上 |
| Ling-3.0-flash-int4 | MIT | 同上 |
| Ling-3.0-flash-dspark | MIT | Hugging Face `inclusionAI/Ling-3.0-flash-dspark` |
| Ling-3.0-flash-VL | MIT | Hugging Face `inclusionAI/Ling-3.0-flash-VL` |
| Ling-3.0-flash-Fin | MIT | Hugging Face `inclusionAI/Ling-3.0-flash-Fin` |
| Ling-3.0-flash-Fin-fp4 | MIT | 同上 |
| Ling-3.0-tiny | MIT | Hugging Face `inclusionAI/Ling-3.0-tiny` |
| Ling-3.0-tiny-fp8 | MIT | 同上 |
| API（OpenRouter） | 限免 / 付費 | `inclusionai/ling-3.0-flash:free`、`:fin:free`、`:vl:free`、`/tiny` |

### 架構細節

所有 Ling 3.0-flash 系列共享同一基礎架構：

- **42 層 Transformer**：35 層 KDA（Kimi Delta Attention）+ 7 層 Gated MLA（比例 5:1）
- **512 個路由專家 + 1 個共享專家**，每 token 啟用 **8 個專家**（MoE 1/64 稀疏比）
- **Hidden size 2560**，Expert intermediate size 768
- **詞彙表 157,184**
- **3.1B MTP（多 token 預測）head**，使完整檢查點達 127.5B 參數
- **上下文訓練階段**：8K → 32K → 256K
- **SGLang HiCache + Mooncake 分層快取**，長輸入 TTFT 減少 60–80%
- 支援 vLLM 0.25.0+（含 Bailing V3 原生支援）

### 選型邏輯

**要本地離線、小型任務——tiny。要高速 Agent 執行、coding、一般推理——flash。要視覺理解、多模態推理——flash-VL。要金融領域專業——flash-Fin。要推測解碼加速——搭配 dspark draft 模型。**

## 開源策略與生態

百靈的開源策略有三個特點：

**第一，授權乾淨**。從 Ling-1T 到 Ling-3.0-flash-Fin，幾乎所有模型都掛 Apache 2.0 或 MIT 授權。對比 Qwen 3.8-Max 的自訂條款和 Llama 的 Community License，百靈的授權對商業使用者更友善。

**第二，國產算力適配**。從 Ling 1.0 開始就強調在非 A100/H100 異構計算平台上的運行能力。Ling-3.0-flash 已獲華為昇騰 0 Day 支持（全新算子編程框架 CANN PyPTO）。這降低了國內開發者的自架門檻。

**第三，框架生態完善**。SGLang、vLLM、TokenSpeed、llama.cpp、transformers 全支援。百靈已驗證與 Claude Code、Kilo Code、Qwen Code、Hermes Agent、OpenClaw 等主流 Agent 框架的相容性。

## 與競品的位置

百靈在 2026 年的位置可以用兩個維度描述：

**開源領先**：Ling-3.0-flash 在多個核心基準上「對照甚至超越參數規模 2-3 倍的行業領先模型」。獨立評測（[frangelbarrera/Ling-3-flash-evaluation](https://github.com/frangelbarrera/Ling-3-flash-evaluation)，845 次 API 呼叫、12 個測試階段）給出 7.0/10 的綜合評分，在 jailbreak resistance（20/20 = 100%）和安全性（10/10 間接注入未被執行）上表現突出。

**對照中國開源**：Ling 2.5-1T 在 AIME 2026 上僅用 5,890 token 就能達到前沿思考模型 15k–23k token 的效果——這個 token 效率在同期 DeepSeek V4、Kimi K2.5、GPT-5.2 之間屬於領先級。

不足之處也很明確：**封閉前沿（Claude、GPT）全面領先**，Ling 在 SWE-bench 等頂級編程基準上仍有差距（Ring-2.6-1T 的 Terminal-Bench 2.1 57.5 vs GPT-5.4 的更高分數）。另外，flash-Fin 雖然在金融基準上領先，但通用基準（AA Intelligence Index 41）仍低於頂級閉源模型。

## 對 Agent 開發者的意義

如果你在做**視覺/多模態 Agent**（圖像分析、影片理解、視覺推理）：Ling-3.0-flash-VL 是開源生態中最高效的視覺語言模型——124B/5.5B 架構、AA Intelligence Index 42、256K context，支援單次請求最多 40 張圖像與影片輸入。

如果你在做**高頻 Agent 工作流**（coding agent、搜尋 agent、工具呼叫密集的場景）：Ling-3.0-flash 是目前開源中最具「智效比」的選擇之一——5.1B 激活參數達到 1T 旗艦的效能，TTFT 減少 60–80%，單一節點即可部署。搭配 Ling-3.0-tiny 還能做「大帶小」的架構：flash 負責規劃，tiny 負責本地執行。

如果你在做**金融相關 Agent**（投研、財報分析、估值建模）：Ling-3.0-flash-Fin 是目前開源生態中最完整的金融增強模型，MIT 授權加上 FinFIRST 基準開源，讓你能自架、測試、驗證整套流程。

如果你在做**深度推理任務**（數學證明、代碼正確性驗證）：Ring-2.6-1T 是比 Ling 更合適的選擇——它專為「慢思考」設計，IMO/CMO 金牌的推理嚴謹度不是 Ling 系列能比擬的。

不適合：追求榜首效能（封閉模型全面領先）、需要語音/全模態輸出（Ling 系列處理文字與視覺，Ming 系列才是全模態旗艦）、需要 100% 生產級可靠性（官方明確聲明 flash-Fin「不構成投資建議」）。

## 整體來說

百靈家族的核心賭注是「**智效比勝於絕對規模**」——不是在比誰的參數更大，而是在比同樣的計算資源下誰的智能更高。從 Ling 1.0 的工程驗證，到 3.0 的原生混合線性架構，這條路徑越走越清晰：1/64 的 MoE 專家激活比、KDA 的精確長序列記憶、「規劃-執行分離」的三線並行。

Flash-Fin 的意義不只是一個金融模型，而是「百靈打法」的第一次垂直落地——把通用高效架構 + 領域微調 + 開源評測基準打包成一個完整方案。Flash-VL 則是同一打法在多模態領域的落地：把原生混合線性架構 + 視覺編碼器 + 高效推理打包成開源方案。後續觀察重點是：這套打法是否會複製到法律、醫療、工程等其他垂直領域，以及 Ling-3.0 系列是否會推出語音/影片生成的完整全模態版本填補 Ming 與 flash-VL 之間的空白。

## 參考資料

- [Ant Group 官方：Ant Group Unveils Ling AI Model Family and Launches Ling-1T（2025-10-09）](https://www.antgroup.com/en/news-media/press-releases/1759982400000)
- [Ant Group 官方：Ant Group Releases Ling-2.5-1T and Ring-2.5-1T（2026-02-16）](https://secure.businesswire.com/news/home/20260215551663/en/Ant-Group-Releases-Ling-2.5-1T-and-Ring-2.5-1T-Evolving-Its-Open-Source-AI-Model-Family)
- [Ant Group 官方：Open-Sources Ling-3.0-flash-Fin for Real-World Financial Workflows（2026-09-09）](https://www.antgroup.com/en/news-media/press-releases/1788944400000)
- [Ant Ling 官方文件：模型家族](https://developer.ant-ling.com/zh-CN/docs/models)
- [Ant Ling 官方文件：Ling-3.0-flash 發佈](https://developer.ant-ling.com/zh-CN/blogs/ling-3.0-flash-release)
- [Hugging Face：inclusionAI/Ling-3.0-flash](https://huggingface.co/inclusionAI/Ling-3.0-flash)
- [Hugging Face：inclusionAI/Ling-3.0-flash-VL](https://huggingface.co/inclusionAI/Ling-3.0-flash-VL)
- [Hugging Face：Ling 3.0 Collection（含全部量化版）](https://huggingface.co/collections/inclusionAI/ling-30)
- [Hugging Face：Ling 3.0 Fin Collection](https://huggingface.co/collections/inclusionAI/ling-30-fin)
- [OpenRouter：inclusionai 模型列表](https://openrouter.ai/inclusionai)
- [LLM Timeline：Ant Group（27 models, 2025-2026）](https://llmtimeline.org/ant-group)
- [frangelbarrera/Ling-3-flash-evaluation：獨立評測](https://github.com/frangelbarrera/Ling-3-flash-evaluation)
- [vLLM Recipes：Ling-3.0-flash（含架構細節）](https://recipes.vllm.ai/inclusionAI/Ling-3.0-flash)
- [雷峰網：連續發布兩款萬億參數模型，螞蟻 AI 來勢洶洶](https://www.leiphone.com/category/ai/L6tQCmiyhpWnqvRk.html)
- [Ant Group 官方：Ant Group Unveils Ling-3.0-Flash（BusinessWire，2026-07-27）](https://www.businesswire.com/news/home/20260726584441/en/)
