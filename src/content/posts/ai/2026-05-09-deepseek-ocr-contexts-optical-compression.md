---
title: "DeepSeek-OCR：把長上下文壓成圖片的 10× 壓縮實驗"
date: 2026-05-09
type: deep-dive
category: ai
tags: [ocr, deepseek, vision-language-model, long-context, context-compression, rag]
lang: zh-TW
tldr: "DeepSeek-OCR 的論文題目是 Contexts Optical Compression — OCR 只是手段，真正驗證的是『把文字渲染成圖片再餵給 VLM』能達到 10× 壓縮且 97% 精度。這對長上下文 LLM 與 RAG 的 token 成本是質變。"
description: "DeepSeek-OCR 不只是另一個 OCR 模型。它的架構（DeepEncoder + 3B-MoE-A570M）、五種解析度模式、與 LightOnOCR、PaddleOCR-VL、olmOCR-2、Chandra 的比較，以及真正的研究野心 — 用視覺 token 壓縮 LLM 的長上下文。"
draft: false
---

2025 年 10 月是 OCR 的爆發月 — 一個月內釋出超過六款開源 OCR/VLM 模型。但 DeepSeek-OCR 不只是搭順風車的其中一款。它的論文題目叫 **Contexts Optical Compression**，OCR 是手段、上下文壓縮才是目的。如果這條路走得通，未來 LLM 的長上下文成本可能不再是 token 數，而是像素數。

## 它在賭什麼

當前 LLM 處理長文本的核心瓶頸是 attention 的 O(n²)。10,000 個 token 就是 10,000 個離散的處理步驟，無論這些 token 攜帶的資訊密度高不高。

DeepSeek 的賭注：**一張 1024×1024 的文件圖片，可以用比文字 token 少 10 倍的 vision token 表示，而且解碼回原文的精度仍可達 97%**。

論文的關鍵實驗結果：

| 壓縮比（text tokens / vision tokens） | OCR 精度 |
|---|---|
| < 10× | **97%** |
| 20× | 約 60% |

換句話說，1 個 vision token 大約能承載 10 個 text token 的資訊量，而且幾乎無損。如果這個結論能擴展到一般文字（不只是 OCR），就等於替 LLM 的上下文視窗找到一個壓縮通道。

## 架構：兩段式

```
輸入圖片 (e.g. 1024×1024)
    ↓
DeepEncoder (380M)
  ├── SAM 視覺特徵
  ├── CLIP 語義特徵
  └── 16× compressor → 少量 vision tokens (64~1853 個)
    ↓
DeepSeek3B-MoE-A570M (3B 參數，每 token 激活 570M)
    ↓
文字輸出（純文字 / Markdown / HTML 表格 / 帶 grounding 的座標）
```

設計重點：
- **DeepEncoder** 在高解析度輸入下保持低激活，這是吞吐量的關鍵
- **MoE 解碼器** 總 3B 參數但實際只激活 570M，推論成本接近一個小模型
- **SAM + CLIP 拼接** 給了它強於一般 OCR 的視覺定位能力（grounding）

## 五種解析度模式

推論時可以選擇要花多少 vision token：

| 模式 | base_size | image_size | crop_mode | 適用 |
|---|---|---|---|---|
| Tiny | 512 | 512 | false | 簡單頁面、追求速度 |
| Small | 640 | 640 | false | 一般文件 |
| Base | 1024 | 1024 | false | 平衡選項 |
| Large | 1280 | 1280 | false | 細節密集 |
| **Gundam** | 1024 | 640 | **true** | 多欄、表格混排（多 tile 切片） |

對複雜版面（學術論文、報紙）必須開 Gundam 才有實用精度。論文裡測試報紙時，因為每頁文字 token 達 4000–5000，需要 Gundam 才能維持 10× 以下的壓縮比。

## OmniDocBench 上的兩個對照組

DeepSeek-OCR 故意挑了兩個極端對手：

| 模型 | tokens / page | 結果 |
|---|---|---|
| GOT-OCR 2.0 | 256 | baseline |
| **DeepSeek-OCR** | **100** | 勝出 |
| MinerU 2.0 | 6000+ | baseline |
| **DeepSeek-OCR** | **< 800** | 勝出 |

第一組證明「token 數可以更少」，第二組證明「就算對手用了 7-8 倍的 token，我用更少還是贏」。生產環境吞吐：**單張 A100-40G 一天 200,000 頁以上**，明顯為「給 LLM/VLM 生產訓練資料」優化。

## 同期競爭者：純 OCR 路線

如果只是要把 PDF 轉成 Markdown，2025 年其實有更多選擇：

| 模型 | 參數 | olmOCR-Bench | 速度 (pages/s) | 特色 |
|---|---|---|---|---|
| LightOnOCR | 1B | 76.1 | **5.55** | 最快、最便宜 |
| **DeepSeek-OCR** | 3B (570M MoE) | 75.7 | 4.65 | vision token 最少 |
| PaddleOCR-VL | 0.9B | 80.0 | 2.20 | 最精簡，多語言 |
| dots.ocr | 3B | 79.1 | 1.94 | 100+ 語言含小語種 |
| olmOCR-2 | 7B | 82.4 | 1.78 | RLVR 訓練、強手寫 |
| Chandra-OCR | 8B | **83.1** | 1.29 | 最強手寫、多格式輸出 |

如果只看 OCR 任務本身，**準確率最高的是 Chandra 和 olmOCR-2，速度成本比最好的是 LightOnOCR**。DeepSeek-OCR 在這個維度上不算一枝獨秀。

它真正獨特的地方是**用最少的 vision token 達到接近第一梯隊的精度** — 而這正是「光學壓縮」研究方向的論證需要。

## 真正的同類：研究方向

如果把 DeepSeek-OCR 放回「視覺壓縮上下文」這條研究線，同類其實只有兩三個：

### Vist（Vision-centric Token Compression, NeurIPS 2025 spotlight）

- **slow-fast 雙路徑**架構，模仿人類「掃讀 + 細讀」
- Fast path：遠處 token 渲染成圖，由凍結的輕量 vision encoder 概覽
- Slow path：近處 token 維持文字，餵給 LLM 細讀
- 結果：相同精度下 token ↓ 2.3×、FLOPs ↓ 16%、memory ↓ 50%

### Glyph（清華系，2025 Oct 同期）

- 同樣是「文字渲染為圖再餵 VLM」的思路
- 與 DeepSeek-OCR 同週被一起討論

DeepSeek-OCR 在這條線上的貢獻是**把壓縮比拉到最大（10×）並驗證精度**，而 Vist 提供了一個更工程化的應用框架（雙路徑而非全圖）。

## 對 RAG 與長上下文的啟發

論文末尾 DeepSeek 暗示了一個有趣方向：**記憶遺忘機制**。舊的對話/上下文用更高壓縮比存（圖片更模糊、token 更少），近的上下文用低壓縮（清晰）— 模擬人腦的記憶衰退。

對實際做 RAG 的人來說，短期內幾個務實的取捨：

| 場景 | 建議 |
|---|---|
| 純 markdown / 純文字內容 | 不需要 OCR，目前 chunking + embedding 就是最優解 |
| 需要收錄外部 PDF / 簡報 / 截圖 | PaddleOCR-VL 0.9B（小巧）或 Chandra（最準） |
| 想做「無限上下文」實驗 | 追蹤 Vist 與 DeepSeek-OCR 的後續工作 |
| Cloudflare Workers / 邊緣環境 | 跑不動，得走外部 GPU API（vLLM、SGLang 已支援） |

DeepSeek-OCR 釋出的是**權重和方法**，不是產品。它把一個之前只在 paper 裡討論的方向（visual modality as compression channel）做出可重現的實驗證據，這比「又一個 OCR SOTA」更有意義。

## 整體來說

DeepSeek-OCR 是一個**披著 OCR 外衣的研究實驗**。OCR 任務上它不是最準的，但它證明了視覺 token 可以承載 10 倍於文字 token 的資訊密度。如果你只想做文件解析，選 Chandra 或 olmOCR-2；如果你想理解未來 LLM 長上下文可能怎麼演進，DeepSeek-OCR 的論文值得從頭讀一次。

下一步論文裡明說了：digital-optical text interleaved pretraining、needle-in-a-haystack 測試。如果這兩個實驗也成功，那 LLM 的 context window 就真的要重新定義了。

## 參考資料

- [DeepSeek-OCR on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-OCR)
- [DeepSeek-OCR: Contexts Optical Compression (arXiv:2510.18234)](https://arxiv.org/abs/2510.18234)
- [DeepSeek-OCR GitHub](https://github.com/deepseek-ai/DeepSeek-OCR)
- [vLLM 官方支援文件](https://docs.vllm.ai/projects/recipes/en/latest/DeepSeek/DeepSeek-OCR.html)
- [Vist: Vision-centric Token Compression in LLM (NeurIPS 2025)](https://openreview.net/forum?id=YdggdEL41C)
- [olmOCR-2-7B](https://huggingface.co/allenai/olmOCR-2-7B-1025)
- [Chandra-OCR](https://huggingface.co/datalab-to/chandra)
- [PaddleOCR-VL](https://huggingface.co/PaddlePaddle/PaddleOCR-VL)
- [dots.ocr](https://huggingface.co/rednote-hilab/dots.ocr)
- [Hugging Face: Supercharge your OCR Pipelines with Open Models](https://huggingface.co/blog/ocr-open-models)
- [E2E Networks: 7 Best Open-Source OCR Models 2025](https://www.e2enetworks.com/blog/complete-guide-open-source-ocr-models-2025)
- [MinerU 2.5: Decoupled VLM for Document Parsing (arXiv:2509.22186)](https://arxiv.org/abs/2509.22186)
