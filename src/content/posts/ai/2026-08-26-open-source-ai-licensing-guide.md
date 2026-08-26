---
title: "開源 AI 授權地雷指南：MIT、Apache 2.0、Llama License 到底差在哪"
date: 2026-08-26
category: ai
type: deep-dive
tags: [open-source, mit, licensing, llama, qwen, gemma, code-model]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 15
tldr: "AI 的「開源」不等於軟體的開源。MIT 和 Apache 2.0 真的隨便用；Llama License 超過 7 億月活要另外談；舊版 Gemma 授權 Google 可以片面修改（Gemma 4 已改 Apache 2.0）。這篇按授權類型整理你能做什麼、不能做什麼。"
description: "AI 模型授權實務指南：MIT、Apache 2.0、Llama Community License、Gemma 授權的差異比較，以及 OSI 對『開源 AI』的正式定義為什麼排除大多數模型。"
draft: false
glossary:
  - term: "OSI"
    def: "Open Source Initiative，制定開源軟體定義的非營利組織，2024 年 10 月發布 OSAID 1.0 定義什麼是開源 AI"
  - term: "MAU"
    def: "Monthly Active Users，月活躍使用者數，Llama License 用 7 億 MAU 作為免費商用的門檻"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-open-source-ai-licensing-guide-en)

當一個 AI 模型說自己「開源」，它可能是 MIT 授權隨你用，也可能是「權重公開但超過 7 億使用者要另外談」。這兩者的差距，比「免費」跟「付費」還大。這篇整理 2026 年主流 AI 模型授權的實際差異，讓你在部署前知道自己踩在哪條線上。

## 授權光譜：從完全開源到 API-only

不是所有「開放」都一樣。按限制程度排列：

| 類型 | 代表 | 你能做什麼 |
|---|---|---|
| **完全開源** | MIT / Apache 2.0 | 商用、修改、再發布，幾乎無限制 |
| **受限開放** | Llama Community License | 商用可以，但超過 7 億 MAU 要另外談 |
| **開放權重** | 權重公開但自訂條款 | 可下載跑，但條款可能隨時變 |
| **API-only** | Claude、GPT（API） | 只能透過 API 呼叫，不碰權重 |

## 逐條拆解

### MIT（Ornith、DeepSeek）

最寬鬆的授權。你可以商用、修改、再發布、嵌入產品、用輸出訓練自己的模型。唯一要求：保留版權聲明。

[Ornith 1.5](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) 和 DeepSeek 都用 MIT。對部署者來說，MIT 意味著「你不需要律師」。

### Apache 2.0（Qwen、Gemma 4、NousCoder）

跟 MIT 一樣寬鬆，多一個**專利授權條款**：貢獻者自動授予你使用相關專利的權利。如果有人拿專利告你用了他們的模型，Apache 2.0 會自動撤銷那個人的授權。

重要更新：[Gemma 4 在 2026 年 4 月從自訂授權改為 Apache 2.0](https://arstechnica.com/ai/2026/04/google-announces-gemma-4-open-ai-models-switches-to-apache-2-0-license)。舊版 Gemma 3 的自訂條款允許 Google 片面修改授權、要求開發者在下游產品中執行 Google 的禁用政策，被社群批評「看起來像開源但不是」。Gemma 4 的轉向代表 Google 承認了這個問題。

[Qwen](https://huggingface.co/Qwen)（阿里）的主線模型也是 Apache 2.0。[NousCoder-14B](/posts/tech/2026-08-26-nous-research-hermes) 因為基於 Qwen3-14B，繼承 Apache 2.0。

### Llama Community License（Llama 4）

Meta 的 Llama 授權看起來很開放，但有三個關鍵限制：

1. **7 億 MAU 門檻**：如果你的產品或服務（含關聯公司）月活超過 7 億，必須向 Meta 申請另外的授權，而且 Meta 可以自行裁量是否核准。依 [Llama 4 Community License](https://developer.meta.com/ai/llama4/license) 原文：「Meta may grant to you in its sole discretion」
2. **品牌要求**：必須在介面、文件等顯著位置標示「Built with Llama」，用 Llama 建的模型名稱必須以「Llama」開頭
3. **可接受使用政策（AUP）**：Meta 另外維護一份禁用清單，你必須遵守

對大多數公司（月活遠低於 7 億）來說，Llama License 在實務上跟 MIT 差不多。但如果你是大型平台，或者你的產品被大型平台收購，這個條款就會變成問題。

[Nous Research 的 Hermes 4](/posts/tech/2026-08-26-nous-research-hermes) 基於 Llama 3.1，繼承這個授權。這代表：**你用的模型的授權，取決於它的基底模型**。

### 自訂授權（舊版 Gemma、部分模型）

最需要小心的類型。常見的地雷：

- 發布者可以**片面修改條款**（舊版 Gemma）
- **下游執行義務**：你必須讓你的使用者也遵守原始條款
- 用模型輸出訓練其他模型可能被禁止
- 「非商用」變體（部分 FLUX 模型、某些研究用模型）

## OSI 的定義：大多數「開源 AI」不是開源

Open Source Initiative（OSI）在 2024 年 10 月發布了 [OSAID 1.0](https://opensource.org/ai/open-source-ai-definition)，正式定義什麼是「開源 AI」。要符合這個定義，不只要公開權重，還需要：

1. **訓練資料的充分資訊**——不需要公開完整資料集，但要提供足以理解和重現的資訊
2. **完整的訓練與推論程式碼**——包含資料處理、訓練參數、驗證程式碼
3. **模型參數**——權重必須在 OSI 核准的授權下公開

依這個標準，**大多數自稱「開源」的 AI 模型都不合格**。Ornith、DeepSeek、Qwen 公開了權重和推論程式碼，但沒有公開完整的訓練資料資訊。

目前唯一接近 OSI 定義的家族是 **OLMo**（Allen AI）——訓練資料、程式碼、checkpoints 全部公開。但它也代表了這個標準有多嚴格：願意做到這個程度的團隊極少。

## 實際場景速查

| 我能不能... | MIT | Apache 2.0 | Llama License | 自訂授權 |
|---|---|---|---|---|
| 商用產品嵌入 | ✅ | ✅ | ✅（<7 億 MAU） | ⚠️ 看條款 |
| Fine-tune 後再發布 | ✅ | ✅ | ✅（要標 Llama） | ⚠️ 看條款 |
| 用輸出訓練自己的模型 | ✅ | ✅ | ⚠️ 有爭議 | ❌ 常被禁 |
| 公司內部自架 | ✅ | ✅ | ✅ | ✅（通常可以） |
| 不標出處 | ❌ 要保留版權 | ❌ 要保留版權 | ❌ 要標 Built with Llama | ⚠️ 看條款 |

## 部署前的檢查清單

1. **看 LICENSE 檔**，不是看 README 寫的——README 常簡化
2. **查基底模型的授權**——fine-tuned 模型繼承基底授權的限制
3. **注意「非商用」變體**——同一個模型家族可能有商用和非商用兩種版本
4. **留意雙授權陷阱**——有些模型對學術和商用分別授權
5. **確認沒有出口管制**——某些國家的模型可能受出口管制限制

## 整體來說

2026 年的趨勢是往更寬鬆的方向走：Gemma 4 從自訂授權改為 Apache 2.0、DeepSeek 和 Ornith 用 MIT。但 Llama 的 7 億 MAU 門檻和品牌要求仍然存在，自訂授權的模型也沒有消失。

最安全的做法：**部署前花 10 分鐘讀 LICENSE 檔**。這比事後被告便宜得多。

## 參考資料

- [OSAID 1.0 — Open Source AI Definition](https://opensource.org/ai/open-source-ai-definition)
- [Llama 4 Community License Agreement](https://developer.meta.com/ai/llama4/license)
- [Gemma 4 改用 Apache 2.0 — Ars Technica](https://arstechnica.com/ai/2026/04/google-announces-gemma-4-open-ai-models-switches-to-apache-2-0-license)
- [Gemma Terms of Use（舊版）](https://ai.google.dev/gemma/terms)
- [What Is Open Source AI? A Practical 2026 Guide — Moesif](https://www.moesif.com/blog/technical/api-development/Open-Source-AI)
- [Llama License 的 700M MAU 限制解析 — WCR.LEGAL](https://wcr.legal/llama-3-license-700m-mau-limit)
- [Ornith 模型家族介紹](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)
- [Nous Research 與 Hermes 介紹](/posts/tech/2026-08-26-nous-research-hermes)
- [MiniMax 模型家族介紹](/posts/tech/2026-08-26-minimax-model-family)
