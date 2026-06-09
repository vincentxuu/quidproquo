---
title: "Text / Image to Lottie：AI 動畫生成工具全景導讀"
date: 2026-06-09
category: ai
type: deep-dive
tags: [lottie, animation, open-source, llm, vlm, vector-animation]
lang: zh-TW
tldr: "從 CLI 工具 kin3o 到 CVPR 2026 論文 OmniLottie，盤點把文字和圖片轉成 Lottie 動畫的開源路徑，附效能基準與選型建議。"
description: "介紹 text/image/video 生成 Lottie 向量動畫的開源工具全景：OmniLottie、LottieGPT、AnimTOON、kin3o，以及各技術路徑的取捨與適用情境。"
draft: false
---

Lottie 是 Airbnb 在 2015 年推出的 JSON-based 向量動畫格式，現在幾乎是 iOS、Android、Web 上輕量 UI 動畫的預設選擇。但要把一句話描述或一張圖片轉成能直接跑的 Lottie 動畫，長期以來都沒有好用的開源工具。

2026 年初這個領域出現了質的飛躍：兩篇 CVPR 論文同時提出了端到端的向量動畫生成框架，另有兩個 developer-focused 工具讓今天就能上手。這篇文章盤點這些工具的技術路徑、效能比較，以及怎麼選。

## 為什麼直接讓 LLM 生成 Lottie 這麼難？

先理解核心難題：Lottie 格式本身不友善。

一個典型 Lottie JSON 的原始 token 數平均約 **18,202 tokens**（依 [AnimTOON 論文](https://github.com/srk0102/AnimTOON) 的 benchmark 數據），而且格式有幾個陷阱：

- **隱性規範**：顏色是 0–1 float（不是 0–255）、時間用 frame number（不是秒）、easing 用 Bézier 控制點——LLM 容易全搞錯
- **嚴格巢狀**：`layers → shapes → keyframes` 的多層 JSON 巢狀，格式錯一個地方就整個失效
- **格式冗長**：大量固定的 metadata 佔據 token 預算，留給真正有意義的動畫邏輯的空間不多

[OmniLottie（CVPR 2026）](https://arxiv.org/abs/2603.02138)的論文直接量化了這個問題：用 GPT-5 直接生成 Lottie JSON，**成功率只有 9.2%**；用 Gemini 3.1 Pro 是 **0%**。這不是模型不夠強，是格式本身的問題。

## 四條技術路徑

```
路徑 A：LLM Prompt 工程
  Text → Claude / GPT 生成 JSON → 驗證 + auto-fix → .lottie
  優點：不需 GPU，今天就能用
  缺點：品質受 LLM 能力限制，複雜動畫不穩定

路徑 B：端到端 VLM Fine-tune
  Text / Image / Video → 自訂 Tokenizer 壓縮 → Qwen2.5-VL → .lottie
  優點：品質最高，有嚴謹學術 benchmark
  缺點：硬體門檻高（~15 GB VRAM），training code 未開源

路徑 C：中間格式 + 小模型
  SVG + Text → AnimTOON 格式（166 tokens）→ 3B LoRA → Converter → .lottie
  優點：消費級 GPU 可跑（~5 GB），token 效率最高
  缺點：必須提供 SVG，不能只給文字

路徑 D：SVG 靜態轉換
  SVG → 對應 Lottie layer 結構 → .json（無動畫）
  優點：確定性，100% 可靠，成熟
  缺點：只做格式轉換，不加動畫
```

---

## kin3o（路徑 A）

**[kin3o](https://github.com/affromero/kin3o)** 是目前最可直接使用的 text-to-Lottie 工具。不訓練模型，而是把 LLM 呼叫做好做滿：

```bash
npx @afromero/kin3o generate "pulsing circle that breathes"
npx @afromero/kin3o generate "toggle switch with on/off states" --interactive
```

技術設計的核心在於「LLM 只是生成，其他都自己處理」：精心設計的 system prompt + few-shot examples 讓 Claude / Codex 少走彎路，生成後做 JSON 提取、結構驗證、auto-fix（RGB 0–255→0–1、missing fields、malformed keyframes），最後才輸出到磁碟。

支援三種 AI 提供者：Claude Code CLI（自動偵測已登入 session）、Codex CLI、或直接用 Anthropic API key。`--interactive` 旗標可輸出帶 hover/click 狀態的 dotLottie state machine，也能整合 LottieFiles 市集搜尋和發布。

**選 kin3o 的時機**：不想裝 GPU、需要立即可用、輸出要能 git diff。  
**不適合**：複雜多層動畫、需要圖片輸入、對品質有嚴格要求。

---

## OmniLottie（路徑 B）

**[OmniLottie](https://github.com/OpenVGLab/OmniLottie)**（[arXiv:2603.02138](https://arxiv.org/abs/2603.02138)，CVPR 2026）是目前學術上最嚴謹的解法，也是第一個支援 text、image、video 三種輸入的端到端 Lottie 生成框架。

核心創新是 **Lottie Tokenizer**：把原始 Lottie JSON 的巢狀結構拆解成 shape、effect、animation 三類 command token，把 18,202 tokens 的原始格式壓縮到約 20–40k 自訂 tokens。在這個壓縮後的 vocabulary 上 fine-tune Qwen2.5-VL，讓模型專注於學習動畫語義而非格式細節。

訓練資料 **MMLottie-2M** 包含 200 萬筆帶有 text / keyframe / video 標注的 Lottie 動畫，並配套釋出評估用的 **MMLottieBench**（900 samples，Real + Synthetic 兩個子集）。

從 MMLottieBench 上的結果（依 [arXiv:2603.02138](https://arxiv.org/abs/2603.02138) Table 1）：

| 方法 | 成功率 | 平均生成時間 | Object 對齊 | Motion 對齊 |
|------|--------|------------|------------|------------|
| [OmniLottie](https://github.com/OpenVGLab/OmniLottie) | **88.3%** | **~29s** | 4.44 | **5.94** |
| [GPT-5](https://openai.com/) | 9.2% | ~46s | — | 13.34 |
| [Gemini 3.1 Pro](https://deepmind.google/technologies/gemini/) | 0% | ~39s | — | — |
| [Qwen2.5-VL (3B)](https://github.com/QwenLM/Qwen2.5-VL) | 0% | ~21s | — | — |

Text-Image-to-Lottie 任務上，OmniLottie 的速度比 AniClipart 快 **52 倍**（88s vs 1212s），成功率 93.3%。

**限制**：推論約需 ~15 GB VRAM（⚠️ 數字來自 AnimTOON 的比較表，未從官方確認）、輸出幀率只有 8 fps、training code 尚未開源。

---

## LottieGPT（路徑 B，尚未可用）

**[LottieGPT](https://github.com/yisuanwang/LottieGPT)**（[arXiv:2604.11792](https://arxiv.org/abs/2604.11792)，CVPR 2026）與 OmniLottie 走相似路徑，但 tokenizer 設計不同：採用 keyframe-based temporal compression，只 encode keyframe 和插值函數而非每一幀，實現 lossless roundtrip（解碼後的動畫與原始渲染完全一致）。

訓練資料更大：**LottieImage-15M**（1500 萬靜態）+ **LottieAnimation-660K**（66 萬動畫），並使用「先學靜態、再學動態」的兩段式訓練策略。

**⚠️ 重要**：截至 2026-06-09，inference code 和 model weights **尚未釋出**（GitHub open-source plan 仍未勾選）。目前只能看論文，不能直接使用。

---

## AnimTOON（路徑 C）

**[AnimTOON](https://github.com/srk0102/AnimTOON)** 採取完全不同的角度：不讓模型生成形狀，把形狀和動畫分離。

設計思路是：模型只需要生成「動畫 keyframe 描述」，形狀從輸入的 SVG 提取，最後由確定性 Converter 組合。這讓模型輸出壓縮到 **166–597 tokens**，而不是 OmniLottie 的 4k–40k：

```
# AnimTOON 格式範例（166 tokens 就能描述一個完整動畫）
anim fr=30 dur=120

layer Logo shape
  fill #000000
  path sh x2
  pos [0.5,0.5]
  rot 0.0->-67 0.04->46 0.14->-31 0.28->0 ease=bounce
  scale 0.0->[0,0] 0.14->[90,90] 0.28->[100,100] ease=smooth
  opacity 0.0->0 0.14->100 ease=fade
```

與 OmniLottie 的量化比較（依 [AnimTOON README benchmark](https://github.com/srk0102/AnimTOON)）：

| 指標 | [AnimTOON](https://github.com/srk0102/AnimTOON) | [OmniLottie](https://github.com/OpenVGLab/OmniLottie) |
|------|----------|------------|
| 輸出 tokens（簡單） | **166** | 616 |
| 輸出 tokens（複雜） | **597** | 4,095 |
| 生成時間 | **13–38s** | 55–120s+ |
| 幀率 | **30 fps** | 8 fps |
| 推論 VRAM | **~5 GB** | ~15.2 GB |
| 自訂 tokenizer | **否（plain text）** | 是（40k token）|
| Format 成功率 | **100%**（converter 保證）| 88.3% |

**限制**：必須提供 SVG（不能只給文字就生成形狀）、訓練尚未完成（約 60%）、社群很小（Stars: 5）。適合已有 SVG 設計稿、想自動加上動畫的情境。

---

## SVG → Lottie 靜態轉換工具

如果需求是格式轉換而非動畫生成，這些工具更可靠：

- **[python-lottie](https://mattbas.gitlab.io/python-lottie)**：格式轉換瑞士刀，支援 SVG / GIF / Synfig / Telegram TGS / WebP / dotLottie 等雙向轉換，最成熟的非 AI 工具
- **[stepancar/svg-to-lottie](https://github.com/stepancar/svg-to-lottie)**：JS 實作，CLI + 瀏覽器 API，支援 rect / circle / path 基本形狀
- **[marciogranzotto/lottie-tools](https://github.com/marciogranzotto/lottie-tools)**：Web-based 編輯器，SVG import 後可手動加 keyframe 動畫，再匯出 Lottie JSON

這些工具輸出的是靜態 Lottie（形狀在，動畫要自己加），適合需要確定性結果、不接受 AI 輸出不穩定的場景。

---

## 對比商業方案

| | [LottieFiles Motion Copilot](https://lottiefiles.com/) | [Rive](https://rive.app/) | [Lottielab](https://www.lottielab.com/) |
|---|---|---|---|
| 輸入 | Text（在編輯器內）| 視覺編輯 | 視覺編輯 |
| 骨骼動畫 | 否 | ✅ 含 mesh deformation | 否 |
| Runtime 互動 | 有限 | ✅（滑鼠、滑桿）| 有限 |
| 開源 | 否 | Player 開源 | 否 |
| LLM 可生成格式 | ✅（JSON）| ❌（二進位 .riv）| ✅（JSON）|

Rive 在骨骼動畫和 runtime 互動上遙遙領先，但它的 `.riv` 是二進位格式，LLM 無法直接生成。這是 Lottie 開源生態的機會所在——JSON 格式對 AI 天然友善。

商業 AI 功能（Motion Copilot 等）整合了設計師工作流（編輯器 + 資產庫 + 協作），開源工具目前還缺這一層，但在純生成品質上差距已快速收窄。

---

## 怎麼選

| 情境 | 建議工具 |
|------|----------|
| 立即可用，不想裝 GPU | **kin3o** |
| 需要圖片或影片作為輸入 | **OmniLottie** |
| 已有 SVG，想自動加動畫，GPU 記憶體有限 | **AnimTOON**（等訓練完成後） |
| 研究 / 想在 MMLottie-2M 上自訓 | **OmniLottie** 或 **LottieGPT**（後者等 code 開源）|
| 只需格式轉換，不加動畫 | **python-lottie** |
| 骨骼動畫 / runtime 互動 | **Rive**（不在開源生態內）|

這個領域的開源工具在 2026 年上半年才剛成熟，OmniLottie 和 LottieGPT 都是今年被 CVPR 接受的論文，AnimTOON 也還在訓練中。現在上手 kin3o 做 UI 動畫是最省力的入口；如果需要更高品質的圖片驅動生成，OmniLottie 已經可以直接用。

## 參考資料

- [OmniLottie GitHub](https://github.com/OpenVGLab/OmniLottie)
- [OmniLottie 論文（arXiv:2603.02138）](https://arxiv.org/abs/2603.02138)
- [OmniLottie HuggingFace 模型頁](https://huggingface.co/OmniLottie/OmniLottie)
- [MMLottieBench Dataset](https://huggingface.co/datasets/OmniLottie/MMLottieBench)
- [LottieGPT GitHub](https://github.com/yisuanwang/LottieGPT)
- [LottieGPT 論文（arXiv:2604.11792）](https://arxiv.org/abs/2604.11792)
- [AnimTOON GitHub](https://github.com/srk0102/AnimTOON)
- [kin3o GitHub](https://github.com/affromero/kin3o)
- [kin3o 官網](https://kin3o.com/)
- [python-lottie](https://mattbas.gitlab.io/python-lottie)
- [stepancar/svg-to-lottie](https://github.com/stepancar/svg-to-lottie)
- [marciogranzotto/lottie-tools](https://github.com/marciogranzotto/lottie-tools)
