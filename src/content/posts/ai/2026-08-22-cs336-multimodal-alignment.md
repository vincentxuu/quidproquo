---
title: "CS336 Lecture 17：多模態模型先把影像變成 token，再處理語意與細節的衝突"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, multimodal, vision-language-model, clip, qwen-vl]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 18
tldr: "第十七講把 CLIP/SigLIP、LLaVA、Qwen-VL 與 Chameleon 排成三條路：對比式 encoder 學語意、vision encoder+projector+LM 做理解、離散 image tokens 做生成；解析度、token budget 與 modality balance 是共同瓶頸。"
description: "Stanford CS336 Spring 2026 Lecture 17 導讀：CLIP、SigLIP、LLaVA/AnyRes、Qwen-VL dynamic resolution、multimodal RoPE、VQ-VAE 與統一生成模型。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-multimodal-alignment-en)

本篇對應 **CS336 Spring 2026 Lecture 17: Alignment — multimodality**，2026 年 5 月 27 日由 Percy Liang 主講。主要來源是官方可執行講義 [`lecture_17.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_17.py)。這是本系列最後一堂正課；後面兩堂 guest sessions 不納入 17 講主系列。

Transformer 接收 token。文字需要 tokenizer，影像與影片也必須轉成一串可處理的 units。理解任務偏好保存高階語意，生成任務卻需要顏色、紋理與空間細節；同一套 representation 很難同時最佳。

## CLIP 用對比學習取得語意

CLIP 收集 image-text pairs，分別以 image encoder 與 text encoder 產生 embeddings。在一個 batch 內，每張影像應接近自己的 caption，遠離其他 captions；文字到影像方向也同樣計算。大量 noisy pairs 因此能提供 supervision，不需逐張人工分類。

Contrastive objective 需要許多 negatives，CLIP 因而偏好大 batch 與跨裝置 softmax。Image resize/crop 與固定 patch resolution 也會丟掉細節，特別影響 OCR、圖表和小物件。它學到的是 caption 能描述的語意，不是可逆的完整影像。

SigLIP 把 batch-wide multiclass softmax 改成每個 image-text pair 的 binary sigmoid loss，減少跨所有 examples 的 normalization 耦合。這讓 batch size 不必無限放大，仍能使用 web-scale pairs；data quality、OCR extraction 與多語 coverage 依然是主要工作。

## LLaVA 建立 vision encoder、projector、LM 模板

標準 vision-language model 先用 CLIP/SigLIP 類 encoder 取得 visual features。接著以 linear layer 或 MLP projector 映射到 LM embedding space，和 text tokens 一起送入 decoder。

LLaVA 的 alignment stage 凍結 vision encoder 與 LM，只訓練 projector；instruction tuning 再更新 projector 與 LM。Instruction data 常由 captions、detected objects 或圖片搭配 LLM 合成對話，所以模型行為高度依賴資料生成與任務比例。

固定把所有影像 crop 到低 resolution 會破壞 OCR。AnyRes 把高解析影像切成符合 encoder resolution 的 tiles，個別編碼後串接。影像越大 token 越多，因此還要在細節、context window 與 latency 間取捨。多張圖片與影片通常降低每張／每 frame resolution，以控制總 token budget。

## Qwen-VL 把解析度與時間放進 tokenization

Qwen-VL 世代使用 dynamic resolution，將不同尺寸影像切成 patches 並壓縮，讓 token 數隨原圖資訊量改變。影片再加入 frame sampling；時間戳可成為顯式 tokens，而不是只藏在 positional embedding。

Multimodal RoPE 把 temporal、height、width axes 配到旋轉位置的不同頻段。DeepStack 類 cross-layer fusion 則不只在輸入層塞一次 visual tokens，而是把不同層級 features 注入多個 LM layers。

長影片會產生遠多於文字的 tokens。若 loss 直接按 token 平均，video examples 可能支配 gradient；per-example 或 square-root-normalized weighting 用來平衡 modalities。這證明「統一成 token」只是介面統一，資訊密度與訓練動態仍不相同。

## 理解與生成需要不同 encoder

CLIP representation 為語意相似最佳化，不能精確重建 pixels。若要 autoregressive image generation，需要 VQ-VAE 類 tokenizer 把影像壓成離散 codebook indices，再和 text tokens 一起建模。Chameleon 類模型走這條路，形式很統一，但 quantization 會損失 OCR 等細節。

Image tokens 通常比 text tokens entropy 高，也可能造成 norm growth 與 logit drift；QK norm、z-loss 與 modality-balanced data 因而重要。另一條主流則保留 continuous vision encoder 做理解，以 diffusion decoder 做生成，接受系統不是單一純 autoregressive model。

## 一個多模態模型要怎麼驗

分開測 image classification/retrieval、OCR、chart/document understanding、spatial relation、多圖比較、video temporal reasoning 與 generation fidelity。每項同時掃 resolution、visual tokens、frames 與 latency。還要記錄 encoder、projector、LM 各階段凍結或更新哪些參數，以及 synthetic instruction data 的來源。

第十七講把整門課收回第一講：所有 modality 最後都要被 tokenization，但 token 選擇本身已經決定模型能保存什麼、要為什麼支付成本。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整可執行講義。本文依 CLIP、SigLIP、LLaVA、Qwen-VL 與 Chameleon 的當期章節整理，沒有納入後續 guest sessions。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 17 可執行講義](https://github.com/stanford-cs336/lectures/blob/main/lecture_17.py)
- [CLIP](https://arxiv.org/abs/2103.00020)
- [LLaVA](https://arxiv.org/abs/2304.08485)
