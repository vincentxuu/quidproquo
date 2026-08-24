---
title: "Qwen——從 0.8B 到 2.4T 全尺寸開源，HuggingFace 下載量王者的雙軌打法"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, qwen, open-source, model-family-qwen, moe, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Qwen 是 HuggingFace 下載量最高的模型家族，尺寸從 0.8B 一路涵蓋到 2.4T。2026 年 8 月阿里首度開源 Max 級旗艦權重（Qwen3.8-2.4T-A95B），但授權換成了自訂條款而非慣例的 Apache 2.0；同期開源、筆電就能跑的原生視覺模型 Qwen3.8-27B 反而是新面孔裡唯一的 Apache 2.0。這篇追蹤 Qwen 從 2023 年到 3.8 世代的演化、開源線與商用線的分家邏輯，以及每一層該怎麼選。"
description: "Qwen（通義千問）模型家族完整介紹：2023→2026 演化時間線、開源線與商用線雙軌策略、Gated DeltaNet 與細粒度 MoE 架構、Qwen3.8 Max／27B 選型指南、DashScope 定價與授權分層。"
series:
  name: "AI 模型家族"
  order: 2
draft: false
glossary:
  - term: "Gated DeltaNet"
    definition: "線性注意力（linear attention）家族的變體，用遞迴狀態取代完整的注意力矩陣，處理長序列時計算量隨長度線性增長而非平方增長。Qwen3.5 起用它取代部分傳統 attention 層"
  - term: "AxB-AyB 命名法"
    aliases: ["MoE 參數標記"]
    definition: "MoE 模型的參數標記：Ax 代表總參數量、Ay 代表每個 token 實際啟用的參數量。例如 397B-A17B 是總參數 397B、每次只啟用 17B"
  - term: "早期融合（early fusion）"
    aliases: ["early fusion"]
    definition: "從預訓練階段就把文字、圖片、影片混在一起訓練，而不是訓練完文字模型再外掛視覺 adapter。原生多模態能力的來源"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-qwen-en)

2026 年 8 月，阿里做了兩件看似矛盾的事。先發布 2.4T 參數的旗艦 [Qwen3.8-Max](https://qwen.ai/blog?id=qwen3.8)，接著又把這款旗艦的基座權重放上 HuggingFace——Qwen 史上第一次開源 Max 級模型。同一週開源的還有一款 27B 稠密模型，主打筆電等級硬體就能跑原生視覺理解。

這個家族的 HuggingFace 下載量長年是所有模型家族之冠（見[系列導讀](/posts/tech/2026-08-24-ai-model-landscape-overview)）。它靠的不是單一模型的勝利，而是覆蓋——從手機端的小模型一路到資料中心旗艦。這篇追蹤它的演化路徑、雙軌策略的轉向，以及現在該怎麼選。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。家族背景的更早版本介紹，可讀[四月版的 Qwen 深度介紹](/posts/ai/2026-04-28-qwen-model-intro)（寫到 Qwen3.6 為止）。

## 家族演化時間線

| 版本 | 發佈 | 關鍵事實 |
|---|---|---|
| Qwen-7B / 14B | 2023-08 | 初代開源，通義千問品牌亮相 |
| Qwen1.5 | 2024-02 | 0.5B～72B 全尺寸覆蓋，多語言強化 |
| Qwen2 | 2024-06 | 72B 旗艦，128K context |
| Qwen2.5 | 2024-09 | Coder／VL／Math 專模型線成形 |
| Qwen3 | 2025-04 | 235B-A22B MoE、思考模式可切換；閉源 Qwen3-Max（>1T 參數）首次現身 |
| Qwen3-Coder / Next | 2025-07 / 09 | Coder 480B-A35B 登場；Next-80B-A3B 首次試驗超稀疏 MoE ＋ 混合 Gated DeltaNet／全注意力 |
| Qwen3.5 | 2026-02 | 397B-A17B 開源旗艦：Gated DeltaNet + MoE、原生多模態、201 語言 |
| Qwen3.5 Small | 2026-02 底 | 0.8B～9B 行動端系列，家族內下載量最高的一批 |
| Qwen3.6 商用線 | 2026-04-02 | Max-Preview／Plus／Flash 三 SKU，全閉源、DashScope 獨佔 |
| Qwen3.6 開源線 | 2026-04 中旬 | 35B-A3B 與 27B Dense，新增 Thinking Preservation |
| Qwen3.7 | 2026-05～06 | Max（5/20）與 Plus（6/1）**全世代閉源**，無任何開放權重 |
| Qwen3.8-Max | 2026-08-03 | 2.4T-A95B GA，定價 $2/$6，16 天自主編碼演示 |
| Qwen3.8 開源 | 2026-08-12～14 | 2.4T-A95B（自訂授權）＋ 27B（Apache 2.0） |

三年、八個世代。前半段的劇本是「開源建立生態」，後半段多了第二條主軸：商用線和開源線正式分家。

## 兩條產品線：開源換生態，閉源收營收

看懂 Qwen 在 2026 年的動作，關鍵是把它拆成兩條平行線：

**開源線**（HuggingFace 上的 `Qwen` org）：從 3.5 到 3.8 的各代開源檢查點，絕大多數掛 Apache 2.0，商用不受限。這條線負責生態位——Ollama、vLLM、llama.cpp 全支援，微調社群把它當基底模型的首選。

**商用線**（DashScope／Model Studio 的 API）：Max 層級自問世以來就沒開放過權重。2026 年這條線明顯加速收攏——3.6 世代的商用三 SKU 只在 DashScope 上架，到了 3.7 更是整代不釋出權重。

中間還有人事轉折。[2026 年初 Qwen 核心技術負責人離職](https://modelfit.io/blog/qwen-team-exodus-alibaba/)，新管理層上任後的兩個世代明顯往閉源傾斜。當時開源社群甚至懷疑：這個以開源聞名的實驗室是不是就此轉向了？

所以 8 月的動作才值得注意。[Qwen3.8-Max 發布時官方明說](https://www.alibabacloud.com/blog/qwen3-8-max-a-new-bar-for-coding-and-cowork_603421)：這是第一次要開源 Max 級權重，六個世代的閉源 Max 線在此畫下句點。解讀不難——對上 Kimi K3 和 DeepSeek 的開源攻勢，開源生態位仍是 Qwen 最深的護城河。新管理層選擇回到這條路，只是方式更有算計（見下方授權那段）。

## 架構：為什麼小模型能打大仗

### Gated DeltaNet：讓長 context 變得便宜

傳統 Transformer 的注意力計算量隨序列長度平方增長，這是長 context 貴又慢的根本原因。Gated DeltaNet 是線性注意力的變體：用固定大小的遞迴狀態取代完整注意力矩陣，計算量改成線性增長。它先在 2025 年 9 月的 Qwen3-Next-80B-A3B 上試水溫，Qwen3.5 起升為主線架構。做法不是全面取代，而是**混合佈局**——部分層用 DeltaNet 處理長程依賴，關鍵層保留完整注意力。

到了 Qwen3.8-Max，這套混合佈局第一次跑上前沿規模。[NYU 上海圖書館的發布分析](https://rits.shanghai.nyu.edu/ai/qwen3-8-2-4t-a95b-alibaba-open-weights-its-max-tier-flagship/)特別點出：過去線性注意力能否撐住前沿規模只有論文描述，現在終於有一個可公開檢驗的樣本。

### 細粒度 MoE：397B 裡每次只用 17B

Qwen 的 MoE 走細粒度路線：專家切得多而小，每個 token 只啟動少數幾個。以 Qwen3.5-397B 為例，全模型有五百多個專家，每 token 只啟用十來個。Qwen3.8-Max 延續同樣設計——總參數和活躍參數的稀疏比約 25:1，具體配置見下一節的比較表。

這個設計的實際意義，在 35B-A3B 身上最清楚：活躍參數只有總量的零頭，卻打贏了上一代的 235B 級旗艦。對自架推論來說，決定 VRAM 和延遲的是活躍參數，不是總參數。同樣的硬體，能跑的品質上限被大幅拉高。

### 原生多模態：不是外掛，是天生

從 3.5 開始，Qwen 用早期融合的方式訓練——預訓練語料就混入文字、圖片、影片，而不是訓好文字模型再接視覺 adapter。8 月開源的 Qwen3.8-27B 把這件事帶進中型稠密模型，原生收文字／圖片／影片，[CNBC 報導](https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html)稱它在 17GB 顯示記憶體就能運行。對需要在本地跑視覺理解的場景，這是目前最省硬體的選項之一。

## Qwen3.8：Max 和 27B 怎麼選

8 月的兩個開源／可用新面孔，定位完全不同：

| 項目 | Qwen3.8-Max（API） | Qwen3.8-2.4T-A95B（開源） | Qwen3.8-27B（開源） |
|---|---|---|---|
| 總參數 | 2.4T | 2.4T | 27B |
| 活躍參數 | 95B | 95B | 27B（稠密） |
| Context | 1M | 原生 262K，可擴至約 1.01M | — |
| 多模態 | 文字／圖片／影片 | ✗（純文字基座） | ✓（文字／圖片／影片） |
| 授權 | 閉源 API | **自訂 Qwen3.8-Max License** | Apache 2.0 |
| 定價 | $2 / $6 / 快取 $0.25 每 1M tokens | 免費但需資料中心級硬體 | 免費，筆電級可跑 |
| 定位 | 前沿品質 | 自架旗艦研究 | 本地全能 |

定價與規格來自[官方部落格](https://qwen.ai/blog?id=qwen3.8)、[Marktechpost 發布報導](https://www.marktechpost.com/2026/08/03/alibaba-qwen-releases-qwen3-8-max/)與 [HuggingFace 模型卡](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B)。

### 授權陷阱：旗艦開源了，但不是 Apache 2.0

過去三年「Qwen 開源＝Apache 2.0」幾乎是等式，這次被打破了。[Qwen3.8-2.4T-A95B 掛的是自訂的 Qwen3.8-Max License](https://www.aimadetools.com/blog/qwen-3-8-max-complete-guide/)，不是 Apache 2.0——具體條款對商用部署、再散佈的限制需要逐條確認。27B 維持 Apache 2.0。這是一個明確的訊號：**開源的界線正在按模型層級重新畫**，小型和中型模型繼續送，旗艦級「開放權重」但附帶條件。如果你的部署依賴授權確定性，這一行比 benchmark 分數更重要。

### 效能位置

| 指標 | Qwen3.8-Max | 對照 |
|---|---|---|
| [LongBench v2](https://benchlm.ai/benchmarks/longbench-v2) | 66.3%（榜首） | Claude Opus 4.5 64.4%；上代 Qwen3.5 397B 63.2% |
| Terminal-Bench 2.1 | 86.6% | 官方表中超越 GPT-5.6 Sol 與 Claude Fable 5 |
| OSWorld-Verified | 86.1% | 同上 |
| SWE-Bench Pro | 67.7% | Claude Fable 5 80.3%——差距最大的一項 |
| [BenchLM 綜合](https://benchlm.ai/stats/open-source-llm) | 78.95（開源第一、全球第六） | 與最強閉源差約 4 分 |
| Arena.ai Vision | ELO 1305（第二名） | 廠商自行提交，待獨立複驗 |

效能數字之外，有三個誠實的但書。

Arena 排名是廠商自行提交，還沒有獨立複驗。多模態的世代躍進是拿 Qwen3.7-**Plus**（非 Max）當對照組，數字有放大效果。官方自己的強化學習曲線也在提醒冷靜：約四千個訓練環境之後，報酬不升反降——RL 環境的擴展還沒找到單調上升的路徑。

Alibaba 另外展示了 Qwen3.8-Max [連續 16 天自主編碼](https://rits.shanghai.nyu.edu/ai/qwen3-8-2-4t-a95b-alibaba-open-weights-its-max-tier-flagship/)做出開源框架 oh-my-cli。這是演示，不是第三方複測。

至於 2.4T 權重的自架門檻：即使量化到 4-bit，光權重就需要約 1.2TB 記憶體，[這是多節點資料中心的規格](https://aliteq.com/alibaba-qwen3-8-max-open-weights-2026)，不是工作站。它的現實受眾是雲團隊和研究者，不是個人玩家——個人玩家的那一份是 27B。

## 子線與生態系：一張表看懂 Qwen 有多少模型

「家族大」是 Qwen 最容易被低估的特徵。除了通用主線，它同時經營著八條以上的子線：

| 子線 | 演化路徑 | 最新狀態（2026-08） |
|---|---|---|
| 通用主線 | 3.5（開源）→ 3.6／3.7 商用線（閉源）→ 3.8-Max API ＋ 2.4T／27B 開源 | 分層供應，見上節 |
| Coder | Qwen2.5-Coder → Qwen3-Coder 480B-A35B → Coder-Next 80B-A3B（$0.12/$0.60） | Apache；[2026 年 3 月後無新版](https://www.scriptbyai.com/qwen-timeline)，coding 能力改由主線旗艦承擔 |
| 視覺語言 | Qwen2.5-VL → [Qwen3-VL-235B](https://huggingface.co/collections/Qwen/qwen3-vl)（DocVQA 96.5%、MathVista 85.8%，見[系列導讀](/posts/tech/2026-08-24-ai-model-landscape-overview)）→ 主線原生多模態 | 開源王者地位由 3.5／3.8 主線接手 |
| 推理 | QwQ-32B 獨立研究線 → 思考模式併入 Qwen3 主線 | 已收編 |
| Omni／語音 | Qwen2-Audio → Qwen3-Omni 30B-A3B（Apache，Instruct／Thinking／Captioner 三版）→ 3.5-Omni、Audio-3.0 系列 | 新版自 7 月中起純 API、不附權重 |
| 影像生成 | Qwen-Image → 2.0 → 2512（全 Apache 2.0）→ Image-3.0 | 新版 7/21 轉閉源 |
| Embedding／Reranker | Qwen3-Embedding 與 Qwen3-Reranker（0.6B/4B/8B） | Apache 2.0，RAG 現役主力 |
| Math | Qwen2.5-Math → 數學能力併入主線 | 已收編 |

兩條清晰的趨勢藏在這張表裡：

**能力往主線收編。** Coder、Math、QwQ 都已停止獨立迭代。這和 DeepSeek 從 V3 起把 Coder 併回主線是同一個劇本：通用模型的專項能力夠強之後，維護獨立子線就不划算。視覺走的是另一條路：不是砍掉 VL 線，而是用早期融合把視覺變成主線的天生能力。

**新的媒體生成子線反向閉源。** 7 月的 Audio-3.0 Realtime／TTS／ASR 與 Image-3.0 是第一批「出生即閉源」的 Qwen 專模型。它們的上一代——Qwen3-TTS、Qwen3-Omni、Qwen-Image-2.0——都還掛著 Apache 2.0。開源紅利在理解類任務上延續，在媒體生成類任務上正在收回。

部署生態是隱性優勢。AWS Bedrock 有 Qwen3-Coder 的一級模型卡；Google Vertex AI Model Garden 直接託管 Qwen3-VL；NVIDIA NIM 伺服 Coder-480B。再加上 OpenRouter、Together、Fireworks 等第三方託管，「哪裡都能跑 Qwen」目前沒有對手。

工具端有終端 Agent Qwen Code，以及 8 月開源的上下文基礎設施 MyContext。後者把 IM 對話、文件、協作紀錄整理成可回溯的工作檔案，瞄準 Agent 長任務的幻覺問題（詳見[中國區域觀察](/posts/daily/2026-08-21-region-china)）。

最後一個提醒：API 型號裡的 Max／Plus／Flash／Turbo 是服務層級標籤，不保證有可下載權重。判斷能不能自架，看授權欄位，不是看型號後綴。

## 跟競品的位置

把 Qwen3.8 放回 2026 年 8 月的開源格局：

- **對上 Kimi K3（2.8T 開放權重）**：K3 的總參數和活躍參數（估計約 200B）都更大。Qwen3.8 用一半的活躍參數在同一張開源牌桌上競爭，還有 27B 以下的全尺寸覆蓋。兩家是唯二提供 2T 級開放權重的實驗室
- **對上 DeepSeek V4**：DeepSeek 的優勢是價格（V4 Pro 離峰輸出 $0.87）和 MLA 的結構性低成本；Qwen 的優勢是尺寸光譜和多模態廣度。長文本榜（LongBench v2）目前是 Qwen3.8-Max 領先
- **對上 Claude／GPT 前沿**：Terminal-Bench 和 OSWorld 這類環境操作任務已經互有勝負。但 SWE-Bench Pro 落後 Fable 5 十二分以上——真實軟體工程的最後一段路還沒走完

## 對 Agent 開發者的意義

- **要前沿品質的 API** → Qwen3.8-Max，$2/$6 比上一代 3.7-Max（$2.50/$7.50）便宜，是 frontier 層級裡輸出價最低的檔位之一
- **多模態請求量大** → Qwen3.7-Plus（$0.40/$1.60，256K 以內）仍是最便宜的多模態 API，比 3.8-Max 便宜五倍，多數視覺任務夠用
- **要在筆電或邊緣裝置跑** → Qwen3.8-27B：稠密、原生視覺、Apache 2.0，17GB 顯示記憶體即可
- **要自架旗艦做研究或資料主權** → Qwen3.8-2.4T-A95B，但先讀自訂授權條款，並準備好多節點叢集
- **要做 RAG** → Qwen3-Embedding 加 Reranker，和主力模型同一生態，向量空間行為一致性是隱性收益
- **引用 benchmark 時** → Qwen 的命名矩陣——世代 × Max/Plus/Flash × 開源/閉源——是所有家族裡最容易搞錯的。型號和日期必須寫全，否則比的是不同場次

## 整體來說

Qwen 的賭注是「全家桶」。單項冠軍不一定拿：agentic coding 的最高水位仍在 Claude，成本戰也打不贏 DeepSeek。但從手機端到資料中心、從 embedding 到語音都有對應選項，而且大部分可以自己跑。

2026 年的故事有兩次轉向：核心團隊出走後一度往閉源收攏，八月底又把 Max 級權重還給社群。開源生態位被證明是它最深的護城河，連新管理層都得回頭經營。

真正值得盯著的是授權的分層化：小模型 Apache 2.0、旗艦自訂條款、專模型收回閉源。「開源」在三個層級上正在變成三種不同的東西，Qwen 只是第一家把界線畫得這麼清楚的家族。

---

## 參考資料

- [Qwen3.8-Max: A New Bar for Coding and Cowork — Qwen 官方部落格](https://qwen.ai/blog?id=qwen3.8)
- [Qwen/Qwen3.8-2.4T-A95B — HuggingFace 模型卡](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B)
- [Qwen3.8-2.4T-A95B: Alibaba Open-Weights Its Max-Tier Flagship — NYU Shanghai RITS](https://rits.shanghai.nyu.edu/ai/qwen3-8-2-4t-a95b-alibaba-open-weights-its-max-tier-flagship/)
- [Alibaba Qwen Releases Qwen3.8-Max — Marktechpost](https://www.marktechpost.com/2026/08/03/alibaba-qwen-releases-qwen3-8-max/)
- [Qwen3.8-Max — Benchmarks, Specs & Release Date — AI Release Tracker](https://aireleasetracker.com/model/qwen/qwen3.8-max)
- [Qwen Versions — 每一代 Qwen 發布紀錄 — Mungomash](https://mungomash.com/ai/qwen/versions/)
- [Qwen 3.8 Max Complete Guide（含授權章節）— Aimade Tools](https://www.aimadetools.com/blog/qwen-3-8-max-complete-guide/)
- [Qwen 3.7: Release Date, Status, and What's Real — Codersera](https://codersera.com/blog/qwen-3-7-release-date-whats-new-2026/)
- [Alibaba open-sources Qwen open-weight AI laptop models — CNBC](https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html)
- [Qwen3.8-27B — Artificial Analysis](https://artificialanalysis.ai/models/qwen3-8-27b)
- [Serve Qwen3.8-2.4T-A95B on NVIDIA GB300 NVL72 — NVIDIA Technical Blog](https://developer.nvidia.com/blog/serve-qwen3-8-2-4t-a95b-a-2-4t-parameter-model-with-configurable-reasoning-on-nvidia-gb300-nvl72/)
- [The hardware math behind self-hosting Qwen3.8-Max — Aliteq](https://aliteq.com/alibaba-qwen3-8-max-open-weights-2026)
- [Qwen team exodus — Modelfit](https://modelfit.io/blog/qwen-team-exodus-alibaba/)
- [Qwen Timeline: Model & Product Release History — ScriptbyAI](https://www.scriptbyai.com/qwen-timeline)
- [Qwen3 — AI Wiki（部署生態：Bedrock／Vertex／NIM）](https://aiwiki.ai/wiki/qwen_3)
- [Qwen3 技術報告（arXiv:2505.09388）](https://huggingface.co/papers/2505.09388)
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [Qwen（通義千問）深入介紹（寫至 3.6）](/posts/ai/2026-04-28-qwen-model-intro) — 本站，前一版家族介紹
