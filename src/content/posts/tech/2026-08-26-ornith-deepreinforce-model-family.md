---
title: "Ornith：小團隊用自我改進 RL 做出的開源 Coding 黑馬"
date: 2026-08-26
category: tech
type: deep-dive
tags: [open-source, reinforcement-learning, agentic-coding, moe, code-model, benchmark, qwen, gemma]
lang: zh-TW
series:
  name: "AI 模型家族"
  order: 13
tldr: "DeepReinforce 用 self-improvement RL 訓練的 Ornith 1.5 家族：397B 旗艦在 SWE-bench Verified 拿 86.0 追平 Claude Opus 4.8，35B-A3B 每 token 只啟用 3B 參數卻在同量級 coding benchmark 全面領先，9B 版本可以跑在手機上。2026-10-16 加入 122B MoE，SWE-bench Verified（non-hack）84.5，是 35B 與 397B 之間的自架選項。MIT 授權、完全開源。"
description: "Ornith 模型家族深入介紹：DeepReinforce 團隊背景、self-scaffolding 訓練方法論、四個規模（含 2026-10 新增的 122B）的 benchmark 對比、實際部署方式與開源生態意義。"
draft: false
glossary:
  - term: "MoE"
    def: "Mixture of Experts，混合專家架構——模型有多組參數但每次只啟用一部分，兼顧能力和效率"
  - term: "GRPO"
    def: "Group Relative Policy Optimization，一種不需要 value model 的強化學習演算法，直接用組內相對獎勵更新策略"
  - term: "SWE-bench"
    def: "Software Engineering Benchmark，用真實 GitHub issue 測量模型解決軟體工程問題能力的標準測試集"
---

> :globe: [English version](/posts/tech/2026-08-26-ornith-deepreinforce-model-family-en)

DeepReinforce 不是大廠。不是阿里、不是 Meta、不是 Google——是一個專注在 agentic coding 和強化學習的小團隊。但他們在 2026 年 8 月發布的 Ornith 1.5 家族，在多個 coding benchmark 上追平甚至超越了 Claude Opus 4.8，而且全部 MIT 授權開源。這篇整理他們怎麼做到的、值不值得關注。

## 家族定位與版本矩陣

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Ornith 1.5-397B | 旗艦 coding／推理 | 397B MoE | MIT 權重；vLLM／SGLang |
| Ornith 1.5-122B | 中大型自架 | 122B MoE；262K context，YaRN 可延伸到約 1M | MIT 權重；BF16、FP8、NVFP4、GGUF、MLX |
| Ornith 1.5-35B-A3B | 自架效率 | 35B／約 3B 啟用 | MIT 權重；OpenAI 相容介面 |
| Ornith 1.5-9B | 本地小尺寸 | 9B Dense，有量化版 | MIT 權重 |

### 團隊與定位

DeepReinforce（官網 [deep-reinforce.com](https://deep-reinforce.com)、產品頁 [ornith.ai](https://ornith.ai)）的核心主張是：與其手工設計 agent 的 scaffold 和訓練資料，不如讓模型自己學會怎麼搭 scaffold、自己產出訓練題目。

他們不從頭預訓練基礎模型——Ornith 建立在 Qwen3.5 和 Gemma 4 之上，透過繼續預訓練（CPT）、中間訓練和後訓練做出基底，再用自研的 self-improvement RL 框架做最後一哩。這個策略讓小團隊不需要幾千張 GPU 也能做出有競爭力的模型。

### 模型家族規格

Ornith 1.5 有四個規模，全部 MIT 授權、權重公開在 [Hugging Face](https://huggingface.co/ornith-ai)：

| 模型 | 架構 | 總參數 | 每 token 啟用 | 特點 |
|---|---|---|---|---|
| Ornith 1.5-397B | MoE | 397B | 未公開 | 旗艦，追平閉源頂尖 |
| Ornith 1.5-122B | MoE | 122B | 未公開 | 2026-10-16 新增，介於 35B 與 397B 之間 |
| Ornith 1.5-35B-A3B | MoE | 35B | ~3B | 效率怪物，同量級王者 |
| Ornith 1.5-9B | Dense | 9B | 9B | 有量化版可跑手機 |

官方說 9B 可以部署在 iPhone 和 Android 裝置上，並提到 `Ornith-1.5-9B-Mobile` 量化版，但 ornith-ai 組織下目前沒有這個 repo；手機端可用的是 GGUF 與 MLX 4／6／8-bit 量化版。

### 122B：35B 與 397B 之間的新尺寸

[Ornith-1.5-122B](https://huggingface.co/ornith-ai/Ornith-1.5-122B) 在 2026-10-16 上架 Hugging Face，10-20 補上 FP8、NVFP4、GGUF 與 MLX（4-bit／8-bit）版本，全部標 MIT。它是 reasoning 模型，預設先輸出 `<think>` 區塊；HF 的 `config.json` 是 `Qwen3_5MoeForConditionalGeneration`，256 個專家、每 token 選 8 個，原生 context 262,144 token，模型卡驗證過用 YaRN（factor 4.0）延伸到約 1M。每 token 啟用參數模型卡沒有寫。

模型卡稱它是 1.5 家族「most capable and efficient」的成員，可在單張 80GB GPU 上服務。這句要對照權重大小讀：BF16 權重檔約 250 GB、FP8 版約 133 GB，只有 NVFP4 版（約 78 GB）接近 80GB，留給 KV cache 的空間很少。要單卡跑，實際上是 NVFP4 加上縮短 context，上線前要自己量。模型卡另提到可裝進手機的 `Ornith-1.5-122B-Mobile`，但 ornith-ai 的 Hugging Face 組織頁目前沒有這個 repo。

## 家族演化

Ornith 從 1.0 的 self-scaffolding 走向 1.5 聯合優化出題、搭建 scaffold 與解題的迴圈；轉折是訓練方法，不只是尺寸。

| 時間 | 版本 | 改變了什麼選型 |
|---|---|---|
| 2026-06 | Ornith 1.0（9B／35B／397B） | 第一代 self-scaffolding，三個尺寸與 FP8／GGUF 版 |
| 2026-08-18 | Ornith 1.5（9B／35B-A3B／397B） | 訓練迴圈加入自己出題；35B-A3B 成為自架 coding agent 的效率選項 |
| 2026-09-20 | 1.5 的 DFlash draft 模型 | 397B、35B-A3B、9B 各有推測解碼 draft，降低自架延遲 |
| 2026-10-16 | Ornith 1.5-122B | 在 35B 與 397B 之間多一個 MoE 尺寸，10-20 補齊量化版；細節見[模型卡｜Ornith-1.5-122B](/posts/daily/2026-10-21-model-ornith-ai-ornith-1-5-122b) |

## 架構與訓練取捨

### 訓練方法：從 Self-Scaffolding 到 Self-Improvement

Ornith 的訓練方法是它最有意思的部分。

**Ornith 1.0** 引入 self-scaffolding：模型不只學解題，還學怎麼搭建解題用的 scaffold（工具呼叫策略、程式碼結構、推理框架）。scaffold 和解題 rollout 透過 GRPO 聯合優化。

**Ornith 1.5** 把這個迴圈擴展成完整的 self-improvement loop，加入了三個聯合優化的階段：

1. **Task Generation**——模型自己出題。依據 validity（題目合理）、frontier difficulty（剛好在模型能力邊緣）、novelty（不重複已見過的題）三個訊號給獎勵
2. **Scaffold Construction**——模型為每道題設計解題 scaffold
3. **Solution Rollout**——模型在 scaffold 裡執行解題，rollout 的獎勵回傳給前兩個階段

依 Ornith 官方技術報告所述：「Repeated over training, this creates a closed self-improvement loop in which stronger policies enable the generation of harder and more informative tasks, evolving scaffolds discover better ways to elicit the model's capabilities, and higher-quality rollouts provide increasingly effective learning signals.」

簡單說：模型越強 → 出的題越難 → scaffold 越聰明 → 解題品質越高 → 模型更強。這個正向循環不依賴人工標註的資料集，理論上可以持續改進。

## 評測與競品比較

### Benchmark 對比

以下數據來自 Ornith 官方技術報告，所有 Ornith 成績為五次獨立測試的平均值。

#### 旗艦 397B vs 閉源頂尖

| Benchmark | Ornith 1.5-397B | Claude Opus 4.8 | GLM-5.2 | DeepSeek-V4-Flash |
|---|---|---|---|---|
| Terminal-Bench 2.1 | **86.1** | 85.0 | 82.7 | 82.7 |
| SWE-bench Verified | **86.0** | 85.8 | — | — |
| DeepSWE | 56.0 | **59.0** | 46.2 | 54.4 |
| GPQA Diamond | **92.8** | — | — | — |
| BrowseComp | **86.6** | — | — | — |

397B 在 Terminal-Bench 和 SWE-bench 上略贏 Claude Opus 4.8，DeepSWE 則小輸。整體而言與最強閉源模型打成平手——對一個開源模型來說這是很高的水準。

#### 35B-A3B：真正的驚喜

35B-A3B 是整個家族最值得關注的成員。每個 token 只啟用約 3B 參數，卻在 coding benchmark 上全面領先同量級甚至更大的模型：

| Benchmark | Ornith 1.5-35B | Qwen3.6-35B | Gemma 4-31B | Muse Glimmer-30B | Qwen3.5-397B |
|---|---|---|---|---|---|
| SWE-bench Verified | **79.0** | 73.4 | 52.0 | 76.0 | 76.4 |
| SWE-bench Pro | **59.6** | 49.5 | 35.7 | — | — |
| SWE-bench Multilingual | **71.4** | 67.2 | — | — | 69.3 |
| Terminal-Bench 2.1 (Terminus-2) | **67.8** | 52.5 | 42.1 | 51.7 | 53.5 |
| Terminal-Bench 2.1 (Claude Code) | **68.5** | 49.2 | 43.4 | — | — |
| DeepSWE | **22** | 0 | 0 | — | 1 |
| NL2Repo | **46.2** | 29.4 | — | — | 36.8 |
| GPQA Diamond | **89.2** | 86.0 | — | — | 88.4 |

幾個重點：

- **SWE-bench Verified 79.0** 是同量級（30B-35B）唯一破 79 的模型，甚至超越 11 倍大的 Qwen3.5-397B（76.4）
- **DeepSWE 22 vs 0**——同量級的 Qwen3.6-35B 和 Gemma 4-31B 在這個 benchmark 上直接掛零，差距最為懸殊
- 在純推理（HLE with tools）上，35B 的 33.4 仍落後 Qwen3.5-397B 的 48.3，規模差距在通用推理上還是存在

#### 9B：手機上的 Coding Agent

| Benchmark | Ornith 1.5-9B | Qwen3.5-9B |
|---|---|---|
| Terminal-Bench 2.1 | **46.2** | 21.3 |

9B 在 Terminal-Bench 上超過 Qwen3.5-9B 兩倍以上。官方稱 9B 的表現已經追平甚至超越 Gemma 4-31B 和 Qwen 3.6-35B 這些大好幾倍的模型。

#### 122B：另一張表、另一組條件

122B 的數字來自它自己的[模型卡](https://huggingface.co/ornith-ai/Ornith-1.5-122B)，比較對象與評測設定都和上面 1.5 技術報告不同（SWE-bench 系列用 OpenHands、加防 reward hacking 檢查，標示為 non-hack），所以不跟 397B、35B 的表混排：

| Benchmark | Ornith 1.5-122B | Qwen3.8-Flash-Next（125B） | Qwen3.8（27B） | DeepSeek-V4-Flash-0731（284B） |
|---|---|---|---|---|
| SWE-bench Verified（non-hack） | **84.5** | 82.8 | 76.8 | — |
| SWE-bench Pro（no-hack） | **76.9** | 43.9 | 65.5 | — |
| SWE-bench Multilingual（non-hack） | **76.4** | 73.0 | 70.3 | — |
| Terminal-Bench 2.1 | 81.2 | **83.4** | 71.9 | 82.7 |
| CyberGym | **80.0** | 78.0 | 55.0 | 76.7 |
| NL2Repo | 51.2 | 45.2 | 42.3 | **54.2** |
| HLE（with tools） | 48.0 | 38.0 | 31.3 | **50.8** |
| BrowseComp | 78.5 | 75.3 | 71.4 | **80.2** |

讀法：122B 在 SWE-bench 三項領先同表，但 Terminal-Bench 2.1、NL2Repo、HLE、BrowseComp 輸給 Qwen3.8-Flash-Next 或兩倍大的 DeepSeek-V4-Flash。全部是 DeepReinforce 自報、沒有第三方複現；Terminal-Bench 2.1 用 Claude Code 2.1.126 跑、5 次平均，HLE 用 Claude 4.6 Opus 當評分模型。

## 授權、價格與部署

Ornith 1.5 權重採 MIT，從 Hugging Face 取得；既有使用範例以 vLLM／SGLang 搭配 OpenAI 相容的本地端點。本篇未整理託管 API 價格，權重取得方式不能推導服務帳單。

122B 的模型卡 metadata 標 MIT，`license_link` 指向 repo 裡的 LICENSE，但目前 repo 沒有這個檔案；法務要看授權全文的話，先拿同家族其他 repo 的 LICENSE 對照，或向 DeepReinforce 確認。122B 需要 Transformers ≥ 5.8.1、vLLM ≥ 0.19.1 或 SGLang ≥ 0.5.9；YaRN 是靜態套用到每個請求，模型卡提醒只有真的需要長於 262K 時才開，否則一般長度的輸入品質會略降。

2026-09-20 起 397B、35B-A3B、9B 各有 [DFlash](https://huggingface.co/ornith-ai/Ornith-1.5-397B-DFlash) 推測解碼 draft 模型，要搭配支援 DFlash 的推理設定，只加速、不是獨立模型。

## Agent 使用與選型

### 實際使用

Ornith 相容 OpenAI API 格式，可以用 vLLM 或 SGLang 部署。依 GitHub repo 說明，可以直接接入 Claude Code、OpenCode 等 agentic coding CLI：

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="EMPTY")
response = client.chat.completions.create(
    model="Ornith-1.5-35B-A3B",
    messages=[{"role": "user", "content": "Fix the bug in this function..."}]
)
```

選尺寸的順序：先看硬體。單機多卡、要最好成績用 397B；放得下 122B 的 FP8 版（約 133 GB，兩張 80GB 卡）或願意用 NVFP4 單卡、想要比 35B 強一截的 SWE-bench 成績，評測 122B；只有一張卡用 35B-A3B；手機與小 GPU 用 9B。

35B-A3B 因為每 token 只啟用 3B 參數，推論成本遠低於同分數的模型。社群已有人在單張 A100 上跑 35B 本地部署的實測報告。9B 量化版甚至可以跑在消費級 GPU（12 GB 起）或手機上。

## 限制與取捨

### 選用理由與保留條件

**選用時可考慮的三個理由：**

1. **方法論的意義**——self-improvement loop 不依賴人工標註就能持續改進。如果這條路可行，代表小團隊也能持續追趕甚至超越大廠的專有資料優勢
2. **效率的示範**——35B-A3B 用 3B 的推論成本做到 79 分的 SWE-bench，讓「自架開源模型做 agentic coding」從理論變成可行方案
3. **完全開源**——MIT 授權，權重、程式碼全公開，沒有「開源但不給商用」的限制

**需要保留的地方：**

- Benchmark 數據來自 Ornith 自己的測試，獨立第三方大規模複現還在進行中
- 通用推理能力（HLE、MATH）仍落後同規模閉源模型，Ornith 的強項集中在 coding 和 agentic 任務
- 團隊規模小，模型的長期維護和迭代速度是未知數

## 更新紀錄

- 2026-11-23：補上 Ornith 1.5-122B（2026-10-16，MIT）：版本矩陣、規格表、家族演化時間線（連 122B 每日模型卡）、獨立的 122B 官方評測表（與 1.5 技術報告不同條件，不混表）、部署需求與單卡 80GB 說法的權重大小對照、LICENSE 檔缺漏；補 2026-09-20 的 DFlash draft 模型與選尺寸順序。
- 2026-10-11：整理格式、版本矩陣與選型章節，沿用既有來源與日期；本次未重新查證事實。

## 參考資料

- [Ornith 1.5 官方技術報告](https://ornith.ai/ornith_1_5.html)
- [DeepReinforce 官網](https://deep-reinforce.com)
- [Ornith GitHub Repository](https://github.com/ornith-ai/Ornith-1)
- [Ornith Hugging Face 模型頁](https://huggingface.co/ornith-ai)
- [Hugging Face：ornith-ai/Ornith-1.5-122B（模型卡、評測與部署說明）](https://huggingface.co/ornith-ai/Ornith-1.5-122B)
- [Hugging Face：ornith-ai/Ornith-1.5-122B-NVFP4](https://huggingface.co/ornith-ai/Ornith-1.5-122B-NVFP4)
- [Hugging Face：ornith-ai/Ornith-1.5-397B-DFlash](https://huggingface.co/ornith-ai/Ornith-1.5-397B-DFlash)
- [模型卡｜Ornith-1.5-122B（站內）](/posts/daily/2026-10-21-model-ornith-ai-ornith-1-5-122b)
- [Ornith 1.5 35B-A3B Benchmark 分析 — MindStudio](https://www.mindstudio.ai/blog/ornith-1-5-35b-a3b-benchmarks)
- [Ornith 1.5 Self-Improvement Loop 解析 — MindStudio](https://www.mindstudio.ai/blog/ornith-1-5-self-improvement-loop)
- [AI 模型用途總覽——2026 年你該知道的模型地圖](/posts/tech/2026-08-24-ai-model-landscape-overview)
