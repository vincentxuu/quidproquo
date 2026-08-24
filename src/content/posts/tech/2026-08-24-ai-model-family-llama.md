---
title: "Llama——從開源實驗到部署量最大的開源 LLM，以及 Meta 的閉源轉向"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, llama, meta, model-family-llama, open-source, moe, multimodal, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Llama 是 Meta 推出的開源 LLM 家族，以企業部署量最大、生態最成熟聞名。Llama 4 Scout（10M context）和 Maverick（17B active / 400B total MoE）是目前的開源多模態標竿，但 Meta 已在 2026 年 4 月轉向閉源 Muse Spark——Llama 4 很可能是最後一個主要的開源 Llama，且授權不是真正的開源（Llama 4 Community License，月活超 7 億需另外授權）。"
description: "Llama 模型家族完整介紹：2023→2026 演化時間線、Llama 4 的 MoE 架構與 10M context、Community License 的授權陷阱、Scout/Maverick/Behemoth 子線、Meta 轉向閉源 Muse Spark 的影響，以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 5
draft: false
glossary:
  - term: "Llama Community License"
    aliases: ["Llama 4 Community License"]
    definition: "Meta 的 Llama 授權條款——允許商用與微調，但月活超 7 億的產品需向 Meta 另外申請授權，且必須標註「Built with Llama」。不是 OSI 認證的開源授權"
  - term: "Behemoth"
    definition: "Llama 4 系列中最大的教師模型，288B active / ~2T total，從未公開釋出，用於蒸餾 Scout 與 Maverick"
  - term: "Muse Spark"
    definition: "Meta 於 2026 年 4 月推出的閉源旗艦模型，公告中稱 Llama 4 Maverick 為「我們的上一代模型」，標誌 Meta 從開源轉向閉源"
  - term: "Llama.cpp"
    definition: "最流行的本地推論框架之一，由社群維護，讓 Llama 權重能在筆電、手機甚至樹莓派上運行，是 Llama 生態的核心"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-llama-en)

2023 年 2 月，Meta 發布了 Llama 1——一個 7B/13B/33B/65B 的開源 LLM 家族。這個決定改變了整個 AI 產業：開源模型從「學術玩具」變成「企業基礎設施」。到 2026 年 4 月，Llama 4 Scout 以 10M context window 和 Maverick 以 128 專家的 MoE 架構成為開源多模態的標竿。但同年，Meta 推出了閉源的 Muse Spark，Llama 4 很可能是最後一個主要的開源 Llama。這是「AI 模型家族」系列的第五篇家族深度介紹，追蹤 Llama 從 Llama 1 到 Llama 4 的完整演化，以及它在 2026 年的定位變化。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族演化時間線

| 版本 | 發佈 | 最大尺寸 | 關鍵里程碑 |
|---|---|---|---|
| Llama 1 | 2023-02 | 65B | 首個開源 LLM，帶動整個開源生態 |
| Llama 2 | 2023-07 | 70B | 商用授權，首次大規模 MoE 探索 |
| Code Llama | 2023-08 | 34B / 70B | 程式碼專用子線 |
| Llama 3 | 2024-04 | 8B / 70B | 128K context，工具使用 |
| Llama 3.1 | 2024-07 | 405B | 首個 400B+ 開源模型 |
| Llama 3.2 | 2024-09 | 90B | 多模態（視覺），輕量版 |
| Llama 3.3 | 2024-12 | 70B | 品質最佳化 |
| Llama 4 Scout | 2025-04 | 109B | 10M context，16 專家 MoE |
| Llama 4 Maverick | 2025-04 | 400B | 128 專家 MoE，原生多模態 |
| Muse Spark（閉源）| 2026-04 | — | Meta 首個閉源旗艦，標誌轉向 |

三年、九個里程碑。Llama 的演化有一條清晰的主線：**從小模型到大模型，從純文字到多模態，從開源到（部分）閉源**。Llama 4 是一個轉折點——它既是開源的巔峰，也可能是最後一個主要的開源 Llama。

## 兩條產品線：開源權重換生態，閉源 Muse Spark 收旗艦

看懂 Llama 在 2026 年的動作，關鍵是把它拆成兩條平行線——和 Qwen 相反的方向，Meta 也是開源起家、近年才往閉源收：

**開源權重線**（HuggingFace / Ollama / llama.cpp）：從 Llama 1 到 Llama 4 的各代檢查點，全部可下載、微調、自架。這條線負責生態位——Ollama、vLLM、llama.cpp 全支援，微調社群把它當基底模型的首選，幾乎所有本地 AI 桌面應用（LM Studio、Jan、GPT4All）預設就能跑 Llama。

**閉源旗艦線**（Muse Spark）：2026 年 4 月才首次現身，Meta 在公告中稱 Llama 4 Maverick 為「我們的上一代模型」，標誌旗艦從開源轉向閉源。這條線不對外釋出權重，未來更新路徑由 Meta 獨佔。

中間的轉折值得記：Meta（前 Facebook）自 2013 年成立 FAIR 以來，以「開源」作為核心策略——不靠賣模型賺錢（不像 OpenAI 和 Anthropic），而是靠 AI 增強社交產品與雲端託管抽成。Llama 系列是這個策略的核心載體。Muse Spark 的閉源更像戰略轉向（對上 Claude、GPT 的閉源攻勢與訓練成本攀升），而不是路線回歸——但它確實讓「Llama 是否繼續開源」成了未定數。

## 架構：Llama 4 的三個關鍵設計

### MoE：每次只啟動 17B

Llama 4 是 Meta 第一個全面採用 Mixture-of-Experts 的家族。以 Maverick 為例：

```
總參數：    400B
活躍參數：  17B（每次推理只啟動這部分）
專家數：    128 個路由 + 1 個共享
稀疏比：    ~24:1
```

每個 token 被送進共享專家，再加上 128 個路由專家中的一個。結果是：所有參數都儲存在記憶體裡，但每次推理只活化一小部分——這讓 400B 級模型能在單台 H100 主機上服務，同時保持前沿品質。Scout 則是 17B 活躍 / 109B 總參數，16 個專家，設計目標是塞進單張 H100（Int4 量化）。

### 原生多模態：早期融合

Llama 4 用早期融合（early fusion）訓練——預訓練語料就混入文字和圖片，而不是訓好文字模型再外掛視覺 adapter。這讓 Scout 和 Maverick 天生能理解圖像，而不只是「文字模型後面掛一個視覺模組」。

### 10M Context：Scout 的殺手鐧

Scout 的 10M token context 是任何模型（開源或閉源）中最長的。它讓單次請求能塞進完整程式碼庫、整本書、或數小時的轉錄稿。但要注意：10M 是 Meta 文件標示的上限，實際可用 context 取決於硬體配置與 serving stack——Int4 量化後 Scout 權重能跑在單張 H100 上，但 full 10M context 還需要更多 KV-cache 記憶體。

## Llama 4：Scout、Maverick、Behemoth 怎麼選

2026 年的三款命名，定位完全不同：

| 項目 | Llama 4 Scout | Llama 4 Maverick | Llama 4 Behemoth |
|---|---|---|---|
| 總參數 | 109B | 400B | ~2T（未釋出）|
| 活躍參數 | 17B | 17B | 288B |
| 專家數 | 16 | 128 + 1 共享 | 16（預告）|
| Context | 10M | 1M | — |
| 多模態 | ✓ | ✓ | — |
| 狀態 | 開源 | 開源 | 從未釋出 |
| 定位 | 超長 context 讀取 | 生產級多模態 | 教師模型（蒸餾用）|

定價（透過 Together AI 等第三方，Meta 不提供一級 API）：

| 模型 | Input ($/MTok) | Output ($/MTok) | Context |
|---|---|---|---|
| Llama 4 Scout | $0.08 | $0.30 | 10M |
| Llama 4 Maverick | $0.27 | $0.85 | 1M |
| Llama 3.1 405B | $3.50 | $3.50 | 128K |
| Llama 3.3 70B | $0.88 | $0.88 | 128K |

Scout 的 $0.08 input 是所有模型中最便宜的，搭配 10M context，是長文件處理的性價比之王。

### 授權陷阱：開源了，但不是你以為的開源

Llama 4 使用 **Llama 4 Community License**——這不是 OSI 認證的開源授權。關鍵限制：

- **月活超 7 億**的產品使用 Llama 4，必須向 Meta 另外申請授權（Meta 保留批准與否的決定權）
- 必須在產品上標註「Built with Llama」
- 有可接受使用條款（acceptable use policy）限制

對大多數企業來說，這跟開源差不多。但對超大型平台（如 Twitter、Snapchat 等），這是一個真實的法律限制。它和 Apache 2.0（Qwen 多數模型）或 MIT（GLM-5、DeepSeek）的寬鬆度差距明顯——如果你的部署依賴授權確定性，「可下載權重」不等於「可自由商用」。

### 效能位置

| 指標 | Llama 4 Maverick / Scout | 對照 |
|---|---|---|
| SWE-bench 等軟體工程基準 | 落後約 3 個百分點 | Claude Opus 5 96%、DeepSeek V4 Pro 96.4%——開源與閉源旗艦仍有差距 |
| 長 context（10M） | Scout 獨佔 | 任何模型（開源或閉源）中最長；Qwen3.8-Max 1M、Gemini 1M、Muse 未公開 |
| 成本 | Scout $0.08 input 最便宜 | Maverick $0.27/$0.85 仍遠低於閉源旗艦（Claude $5/$25、GPT $5/$30）|
| 多模態 | Maverick 原生多模態 | 與 Qwen3-VL、Gemini 原生多模態同級 |

和競品直接對照：

| 指標 | Llama 4 Maverick | Qwen3.8-Max | DeepSeek V4 Pro | Claude Opus 5 |
|---|---|---|---|---|
| 總參數 | 400B | 2.4T | — | — |
| 活躍參數 | 17B | 95B | — | — |
| Context | 1M | 1M | 1M | 1M |
| 授權 | Community License | 自訂 / Apache | MIT | 閉源 |
| SWE-bench | 落後 ~3pp | 67.7% (SWE-Bench Pro) | 96.4% | 96% |

Llama 4 在超長 context 與成本上仍有獨佔區間，但在軟體工程 benchmark 上落後前沿約 3 個百分點。真正值得記住的是：在「開源」的光譜上，Llama 4 站在「可下載但附條件」的中段——比真正開源（Apache/MIT）多一層限制，又比完全閉源多一線自由。

## 子線與生態系：一張表看懂 Llama 有多少模型

除了通用主線，Llama 同時經營著多條子線：

| 子線 | 代表模型 | 最新狀態（2026-08）|
|---|---|---|
| 通用主線 | Llama 3.1/3.3 → Llama 4 Scout/Maverick | 開源權重，Community License |
| Code Llama | Code Llama 34B/70B | 已停止獨立迭代，能力併入主線 |
| 視覺語言 | Llama 3.2 Vision 11B/90B → Llama 4 原生多模態 | 視覺變成主線天生能力 |
| 輕量端側 | Llama 3.2 1B/3B | 手機、邊緣裝置主力 |
| 安全工具 | Purple Llama | 開源安全評估框架 |

兩個趨勢藏在這張表裡：

**能力往主線收編。** Code Llama 已停止獨立迭代——與 Qwen、DeepSeek 收編子線的劇本相同。通用模型的專項能力夠強之後，維護獨立子線就不划算。視覺走的是另一條路：不是砍掉 VL 線，而是用早期融合把視覺變成主線的天生能力。

**生態滲透率是隱性護城河。** Llama 真正的護城河不是單一模型，而是**生態**。Llama.cpp、Ollama、vLLM、Hugging Face Transformers 全都一級支援；微調社群把它當基底模型首選；幾乎所有本地 AI 桌面應用預設就能跑 Llama。這種「哪裡都能跑」的滲透率，讓 Llama 成為開源推理的事實標準。

最後一個提醒：API 型號裡的 Scout/Maverick/Behemoth 不保證有可下載權重（Behemoth 從未釋出）。判斷能不能自架，看授權與釋出狀態，不是看型號後綴。

## 跟競品的位置

把 Llama 4 放回 2026 年的開源格局：

- **對上 Qwen**：Qwen3.8-Max（2.4T）總參數和活躍參數都遠大於 Maverick，且 Qwen 多數模型掛 Apache 2.0，授權確定性更好。Llama 的優勢是生態成熟度——本地推論框架的支援度仍領先
- **對上 DeepSeek V4**：DeepSeek 的 MLA 架構成本更低、定價更激進（$0.28/$0.42）；Llama 4 在 10M context 上仍有獨佔區間
- **對上 Kimi K3（2.8T 開放權重）**：K3 總參數更大，但 Llama 4 Scout 的 10M context 仍是目前最長
- **對上閉源（Claude / GPT / Gemini）**：Llama 4 在 SWE-bench 等軟體工程基準上落後約 3 個百分點，且 Meta 已轉向閉源 Muse Spark，未來更新路徑不明
- **對上 Mistral / GLM**：Llama 的生態滲透率仍領先，但 Mistral 授權更乾淨（Apache/Modified MIT），GLM 走國產合規路線

## 對 Agent 開發者的意義

- **超長文件分析** → Llama 4 Scout：10M context + $0.08/MTok，目前性價比無對手
- **成本敏感的企業部署** → Scout / Maverick 可自架，資料不上雲，適合醫療、金融等資料主權場景
- **多語言場景** → Llama 4 支援 200 種語言（含阿拉伯語、西班牙語、德語、印地語等）
- **本地 / 邊緣推理** → Llama.cpp + 量化，讓 Llama 能在筆電甚至手機上跑
- **需要授權確定性** → 注意 Community License 的 7 億 MAU 條款，大型平台應改用 MIT/Apache 模型（GLM、DeepSeek、Qwen 多數）
- **需要前沿 coding agent** → Llama 4 落後 Claude 和 DeepSeek，建議改選
- **引用 benchmark 時** → Llama 的命名矩陣（世代 × Scout/Maverick/Behemoth）容易與未釋出的 Behemoth 混淆。型號和日期必須寫全，否則比的是不同場次

## 整體來說

Llama 的故事是「開源如何改變一個產業」。Meta 用 Llama 系列證明了開源模型可以達到商業品質，讓全球開發者建立了無數基於 Llama 的產品。Llama 4 Scout 的 10M context 和 Maverick 的 128 專家 MoE，至今仍是開源模型的技術標竿；而其生態滲透率（Llama.cpp 幾乎成了本地推理的代名詞）更是無人能及。

但 2026 年的轉折也很明顯——Meta 推出閉源的 Muse Spark，並在公告中稱 Llama 4 Maverick 為「上一代模型」。這釋出兩個信號：第一，Meta 已把旗艦從開源轉向閉源；第二，Llama 4 的未來更新不再確定。對 Agent 開發者來說，Llama 4 在超長 context 和成本上仍有獨佔區間，但授權限制（非 OSI 開源）和 Meta 策略轉向，都是採用前必須權衡的風險。真正值得記住的是：在「開源」的光譜上，Llama 4 站在「可下載但附條件」的中段——它比真正開源（Apache/MIT）多一層限制，又比完全閉源多一線自由。

---

## 參考資料

- [Llama 4 — Meta AI 官方部落格](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [Llama 4 Scout and Maverick on Hugging Face](https://huggingface.co/blog/llama4-release)
- [Llama 4 Model Card](https://github.com/meta-llama/llama-models/blob/main/models/llama4/MODEL_CARD.md)
- [Meta Llama Pricing Guide 2026 — AI Cost Check](https://aicostcheck.com/blog/meta-llama-pricing-guide-2026)
- [Llama 4, reviewed — benchr](https://benchr.org/articles/llama-4-review)
- [Meta Superintelligence Labs / Muse Spark 公告](https://ai.meta.com/)
- [Llama.cpp — 本地推理框架](https://github.com/ggerganov/llama.cpp)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站