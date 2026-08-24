---
title: "Kimi——從 200K 長文本工具到 2.8T 開源前沿，以及 K3 的架構躍進"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, kimi, moonshot-ai, model-family-kimi, long-context, reasoning, moe, open-source, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Kimi 是月之暗面（Moonshot AI）推出的 LLM 家族，以超長 context 起家。2026 年 7 月發布的 Kimi K3 是全球首個開源 3T 級模型——2.8T 參數、104B 活躍、1M context，在 Artificial Analysis Intelligence Index 得分 60 與 GLM-5.3 並列開源第一。其 Kimi Delta Attention 架構帶來 2.5 倍 scaling 效率提升。"
description: "Kimi（月之暗面 / Moonshot AI）模型家族完整介紹：2023→2026 演化時間線、開源權重與 API 雙軌策略、Kimi Delta Attention 與 Attention Residuals 架構、Stable LatentMoE、K3 選型指南、Kimi K3 License 授權分析，以及 Agent 開發者的選型建議"
series:
  name: "AI 模型家族"
  order: 9
draft: false
glossary:
  - term: "Agent Swarm"
    definition: "Kimi K2.5 的架構：一個路由器分配最多 100 個子 agent 並行處理不同子任務，再由另一個路由器合併結果"
  - term: "Kimi Delta Attention"
    aliases: ["KDA"]
    definition: "Kimi K3 採用的注意力機制，提供高效的長序列混合，週期性交錯 Gated MLA 層以保留全域互動"
  - term: "Attention Residuals"
    aliases: ["AttnRes"]
    definition: "讓每一層選擇性地關注所有前序層的表示，改善跨模型深度的資訊流"
  - term: "Stable LatentMoE"
    definition: "K3 的稀疏 MoE 框架，將路由專家空間擴展到 896 個，每 token 啟動 16 個，配合歸一化與 SiTU-GLU 在極端稀疏度下穩定優化"
  - term: "MoonViT-V2"
    definition: "K3 的視覺編碼器，從頭以 next-token prediction 訓練（不依賴 SigLIP 初始化），參數 401M"
---

2023 年，當全世界都在追趕 OpenAI 時，一家叫「月之暗面」（Moonshot AI）的中國新創做了一個不太一樣的選擇——它沒有急著推出「中國版 ChatGPT」，而是把賭注押在**超長 context window**。2026 年 7 月，這條路走到極致：**Kimi K3**——全球首個開源 3T 級模型，2.8T 參數、104B 活躍、1M context，在 Artificial Analysis Intelligence Index 得分 60 與 GLM-5.3 並列開源第一。這篇追蹤 Kimi 從長文本工具到開源前沿的完整演化，以及 K3 的架構躍進。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的第九篇家族深度介紹。

## 家族演化時間線

| 版本 | 發佈 | 關鍵事實 |
|---|---|---|
| Kimi Chat | 2023-10 | 200K 中文字元 context，長文本起家 |
| Kimi K1.5 | 2025-01 | 強化學習推理，Long CoT，多模態推理 |
| Kimi-VL | 2025-04 | 16B MoE（3B 活躍）開源視覺語言模型 |
| Kimi-Dev | 2025-06 | 72B 程式碼專用模型，SWE-bench Verified 開源 SOTA |
| Kimi K2 | 2025-07 | 1T MoE（32B 活躍），384 experts，MuonClip 優化器 |
| K2 Thinking | 2025-11 | 256K context，200–300 次連續工具調用 |
| Kimi K2.5 | 2026-01 | 原生多模態，Agent Swarm（100 子 agent），Modified MIT |
| **Kimi K3** | 2026-07 | **2.8T MoE（104B 活躍），1M context，KDA + AttnRes，開源 3T 級首例** |

三年、八個世代。前半段的劇本是「長文本差異化」，後半段則是**規模與架構雙軌躍進**——K3 一次把總參數推到 2.8T，同時用新架構把效率拉高 2.5 倍。

## 兩條產品線：開源權重與 API

看懂 Kimi 在 2026 年的動作，關鍵是把它拆成兩條線：

**開源線**（HuggingFace 上的 `MoonshotAI`）：K2.5 掛 Modified MIT，K3 掛 **Kimi K3 License**（自訂，見下方授權陷阱）。權重完全開放下載，可微調、可自架。這條線負責生態位與研究影響力——K3 是史上第一個開源 3T 級模型，意義在於把前沿規模向社群開放。

**商用線**（platform.kimi.ai 的 API）：K3 API 定價 $3.00 / $15.00 每 1M tokens（cache-hit input $0.30），由 Mooncake 分散式推論架構支撐，coding 工作負載 cache hit rate 超過 90%。這條線負責營收。

一個重要時間點：**K2.5 與 moonshot-v1 系列將於 2026-08-31 全面下架**，新註冊的使用者已不可選。換言之，Kimi 的產品重心已完全轉向 K3。

## 架構：為什麼 2.8T 能跑出 2.5x 效率

### Kimi Delta Attention（KDA）

K3 的核心架構創新。KDA 提供高效的長序列混合，並週期性交錯 Gated MLA 層以保留全域互動。它解決的是「資訊如何在 1M context 的長序列中有效流動」這個根本問題——傳統注意力在這個長度會資訊稀釋，KDA 讓模型能在序列長度與模型深度兩個維度上都保持資訊流。

### Attention Residuals（AttnRes）

讓每一層選擇性地關注所有前序層的表示，而非只看上一層。這改善了跨模型深度的資訊流，是 K3 在 93 層深度下仍能穩定訓練的關鍵之一。

### Stable LatentMoE

K3 把路由專家空間擴展到 **896 個**，每 token 啟動 16 個 + 2 個共享專家。配合歸一化、SiTU-GLU 與 Quantile Balancing，在極端稀疏度（~56:1）下穩定優化。對比 K2 的 384 experts / 8 active，K3 的專家數與活躍比都翻倍。

### MoonViT-V2：從頭訓練的視覺編碼器

K3 的視覺編碼器 MoonViT-V2（401M 參數）完全從頭以 next-token prediction 訓練，不依賴 SigLIP 初始化。智譜發現：預訓練視覺編碼器（如 SigLIP）接上 LLM 時梯度不穩、頻繁 spike；MoonViT-V2 則全程穩定，且視覺評測與對照組持平——證明大規模多模態模型「不需要對比預訓練做初始化」。

## Kimi K3：怎麼選

K3 世代目前有開源權重與 API 兩種取得方式，K2.5 即將退場：

| 項目 | Kimi K3（API）| Kimi K3（開源權重）| Kimi K2.5（舊世代）|
|---|---|---|---|
| 總參數 | 2.8T | 2.8T | 1T |
| 活躍參數 | 104B | 104B | 32B |
| Context | 1M | 1M | 256K |
| 多模態 | 文字 + 圖片 | 文字 + 圖片 | 文字 + 圖片 |
| 授權 | 閉源 API | **Kimi K3 License（自訂）**| Modified MIT |
| 定價 | $3.00 / $15.00（cache-hit $0.30）| 免費，需多節點叢集 | 已退場（2026-08-31）|
| 推薦框架 | Kimi Code CLI | vLLM / SGLang / TokenSpeed | — |

定價與規格來自 [Kimi K3 官方部落格](https://www.kimi.ai/blog/kimi-k3) 與 [Kimi API 模型列表](https://platform.kimi.ai/docs/models)。

### 授權陷阱：Kimi K3 License 不是 MIT

K2.5 掛的是 Modified MIT（相對寬鬆），但 **K3 換成了自訂的 Kimi K3 License**——這和 Qwen3.8-Max 換自訂條款是同一個訊號：旗艦級開源權重，授權不再是最寬鬆的那一檔。具體條款對商用部署、再散佈的限制需要逐條確認。

這裡的但書是：**「開源 3T 級」是真，但「可自由商用」要看授權細節**。如果你的部署依賴授權確定性，K3 的 Kimi K3 License 不如 GLM 的 MIT 或 Qwen 多數模型的 Apache 2.0 乾淨。想用最寬鬆授權跑大模型，GLM-5.3（MIT）仍是更省心的選項。

### 效能位置

| 指標 | Kimi K3 | 對照 |
|---|---|---|
| Artificial Analysis Intelligence Index | **60**（開源第一，並列）| 與 GLM-5.3 並列開源第一；Claude Fable 5 / GPT-5.6 Sol 級別 |
| Reasoning / Knowledge | 93.5 | Claude Fable 5 92.6 / GPT-5.6 Sol 94.1 |
| HLE（人類最後考試）| 43.5 / 56.0 | 落後閉源旗艦 |
| Coding: DeepSWE | 67.5 | Claude Fable 5 70.0 / GPT-5.6 Sol 67.0 |
| ProgramBench | 7x | 接近閉源 |
| Context | 1M tokens | 開源最大 context 之一 |

三個誠實的但書：K3 在 Intelligence Index 與 GLM-5.3 並列開源第一，但**整體仍落後 Claude Fable 5 與 GPT-5.6 Sol**；在 HLE 這種「人類最後考試」級難度上差距明顯；2.8T 權重即使量化也需要多節點資料中心，個人玩家實際跑不起來——除非用 API。

## 子線與生態系：一張表看懂 Kimi 有多少模型

除了通用主線，月之暗面同時經營多條子線：

| 子線 | 代表模型 | 最新狀態（2026-08）|
|---|---|---|
| 通用主線 | K1.5 → K2 → K2.5 → **K3** | K3 為旗艦，K2.5 月底退場 |
| 視覺語言 | Kimi-VL（16B MoE）| 開源 VL 模型 |
| 程式碼 | Kimi-Dev（72B）| SWE-bench Verified 開源 SOTA |
| 輕量 | Kimi Linear（48B MoE，3B 活躍）| KDA 高效推理 |
| 推理 | K2 Thinking | 256K context，長鏈工具調用 |
| Agent 框架 | Kimi Code CLI | 終端機式 coding agent，對應 K3 |
| 消費者產品 | Kimi.com / Kimi Work / Kimi App | 多平台 agent 入口 |

兩個趨勢：

**能力往主線收編。** 和 Qwen、DeepSeek、GLM 收編 Coder/Math 子線的劇本相同，Kimi 把專項能力併回 K 主線——K3 原生多模態、原生 coding，不再需要獨立子線。

**開源授權分層化。** K2.5 是 Modified MIT，K3 換成自訂 Kimi K3 License。和 Qwen、Llama 4 一樣，「開源」在不同模型層級正在變成不同東西——小模型寬鬆、旗艦附條件。

## 跟競品的位置

把 K3 放回 2026 年 8 月的開源格局：

- **對上 GLM-5.3（744B MIT）**：兩家在 Intelligence Index 並列 60（開源第一）。K3 總參數更大（2.8T vs 744B），但 GLM 的 MIT 授權更乾淨；Kimi 的優勢在 1M context 與架構效率
- **對上 Qwen3.8-Max（2.4T）**：Qwen 尺寸光譜更廣（0.8B–2.4T），但 K3 是開源 3T 級唯一選項；兩家旗艦授權都是自訂條款
- **對上 DeepSeek V4**：DeepSeek 的價格（$0.28/$0.42）遠低於 K3 的 $3/$15，且 MIT 授權；K3 的優勢在規模與長 context
- **對上 Claude / GPT 前沿**：K3 在綜合水位仍落後 Fable 5 與 GPT-5.6 Sol，但開源部署選項與 1M context 是閉源給不了的

## 對 Agent 開發者的意義

- **需要開源 3T 級模型** → Kimi K3：全球首個，2.8T 參數 + 1M context，目前唯一選項
- **複雜 coding agent** → K3：DeepSWE 67.5、ProgramBench 接近閉源，配 Kimi Code CLI
- **超長文件 / 知識工作** → K3 的 1M context，適合研究報告、長文分析、多步推理
- **需要最便宜的開源 API** → DeepSeek V4 Flash（$0.28/$0.42）比 K3（$3/$15）便宜一個數量級
- **需要授權確定性** → GLM-5.3（MIT）比 K3 的 Kimi K3 License 更乾淨
- **需要最強 coding** → Claude Opus 5 仍領先 SWE-bench

## 整體來說

Kimi 的故事是「一個被忽略的方向，長出了一個開源前沿」。從 2023 年的 200K 長文本聊天機器人，到 2026 年 7 月的 K3——2.8T 參數、104B 活躍、1M context，全球首個開源 3T 級模型。三年內從「中國長文本工具」變成「開源規模標竿」。

K3 的架構升級（KDA + AttnRes + Stable LatentMoE）帶來了 2.5 倍的 scaling efficiency 提升。在 Intelligence Index 得分 60，與 GLM-5.3 並列開源第一，在 coding、知識工作和推理上都達到前沿水準。

真正值得記住的是授權：在「開源」的光譜上，K3 站在「可下載但附條件」的中段——Kimi K3 License 不如 GLM 的 MIT 或 Qwen 多數模型的 Apache 2.0 乾淨。對需要 3T 級規模且能接受自訂授權的開發者，K3 是目前唯一的開源選項；對需要授權確定性的場景，GLM-5.3 仍是更省心的選擇。

---

## 參考資料

- [Kimi K3: Open Frontier Intelligence — 官方部落格](https://www.kimi.ai/blog/kimi-k3)
- [Kimi K3 — arXiv:2607.24653](https://arxiv.org/html/2607.24653v2)
- [MoonshotAI/Kimi-K3 — Hugging Face](https://github.com/MoonshotAI/Kimi-K3)
- [Kimi API 模型列表](https://platform.kimi.ai/docs/models)
- [Kimi K1.5 技術報告](https://arxiv.org/abs/2501.12599)
- [Kimi K2 技術報告](https://arxiv.org/abs/2507.20534)
- [Kimi K3 — kimi.ai/ai-models](https://www.kimi.ai/ai-models/kimi-k3)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
