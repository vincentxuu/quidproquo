---
title: "模型卡｜Iris-3B"
date: 2026-10-12
category: daily
type: digest
tags: [ai-agent, model-release, daily, speridlabs, model-family-speridlabs]
lang: zh-TW
description: "Sperid Labs 開源 Iris-3B——跳過 VAE 直接輸出像素的 3B 擴散模型，文字生成影像打平 Qwen-Image，但論文誠實坦承深度估計與影像修復沒有驗證到預期的下游優勢"
tldr: "Iris-3B：Sperid Labs 2026-10-07 發表論文（arXiv 2610.09450），3B 參數擴散 transformer（+ 凍結 4B Qwen3-VL-4B-Instruct 文字編碼器），不經 VAE／潛空間直接輸出像素；GenEval 0.798、DPG-Bench 86.52（皆 1024px），OneIG-EN 打平 Qwen-Image；但微調後的單眼深度估計（AbsRel 0.071）只打平有 VAE 的潛空間模型 FLUX.2 Klein、4 倍影像修復（LPIPS 0.292／PSNR 20.68）未能超越，論文自己承認『沒有找到像素空間生成先驗帶來顯著下游優勢』；權重與訓練程式碼全開源 Apache 2.0"
series:
  name: "AI Model Tracker"
  order: 45
glossary:
  - term: "VAE（變分自編碼器）"
    def: "多數主流擴散模型（Stable Diffusion、FLUX 等）用來把高解析度圖片先壓縮成低維度「潛空間」再還原回像素的壓縮/還原模組，能大幅降低運算量，但壓縮過程會損失部分細節"
---

> 🌏 [English version](/posts/daily/2026-10-12-model-speridlabs-iris-3b-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `speridlabs/iris-3b` |
| 廠商 | Sperid Labs |
| 參數量 | 3B（像素空間擴散 transformer）＋凍結 4B 文字編碼器（Qwen3-VL-4B-Instruct） |
| Context Window | 不適用（純影像生成／密集預測模型，非語言模型；預設輸出 1024×1024，約 100 萬像素） |
| Input 定價 (USD/1M tokens) | 不適用（開源自架，無官方託管 API，需自備 NVIDIA GPU／CUDA） |
| Output 定價 (USD/1M tokens) | 不適用（同上） |
| 開源 | 是（Apache 2.0；凍結的文字編碼器 Qwen3-VL-4B-Instruct 沿用其原廠 Apache 2.0 授權） |
| 發布日 | 2026-10-05（HuggingFace 權重上架）；論文 2026-10-07 提交 arXiv |
| 官方公告 | [arXiv 2610.09450](https://arxiv.org/abs/2610.09450) |
| HuggingFace | [speridlabs/iris-3b](https://huggingface.co/speridlabs/iris-3b) |
| 家族 | Sperid Labs 首款公開模型（無前代） |

## 能力亮點

- 全程不經過 VAE／潛空間，擴散 transformer 直接輸出每一個像素（16×16 patch 經 4 層 PiT pixel head 還原成像素），訓練走 256→512→1024 像素三階段課程，共 665K steps
- 文字生成影像在 GenEval 拿到 **0.798**、DPG-Bench **86.52**（皆 1024px，官方評測器），OneIG-EN 總分打平 Qwen-Image（論文未指名具體版本）
- 同一套骨幹不改架構，微調後可做單眼深度估計（AbsRel **0.071**、δ1 **0.946**，NYUv2/KITTI/ETH3D/ScanNet/DIODE 五個資料集 zero-shot 平均，Marigold V2 協定）與 4 倍影像修復/放大（LPIPS **0.292**、PSNR **20.68**，DIV2K 驗證集）
- 權重、訓練程式碼與論文全部公開（Apache 2.0），另外提供深度、放大兩個微調版本與 HuggingFace Space demo，不需要 GPU 也能試用

## Benchmark 表現

| Benchmark | Iris-3B | 比較對象 | 結果 |
|---|---|---|---|
| GenEval（1024px） | 0.798 | — | 論文自測，官方評測器 |
| DPG-Bench（1024px） | 86.52 | — | 論文自測，官方評測器 |
| OneIG-EN（1024px） | 打平 | Qwen-Image（論文未指名版本） | 論文自測，未公開具體分數 |
| 單眼深度 AbsRel（5 資料集零樣本平均） | 0.071 | 原生潛空間 FLUX.2 Klein（打平）／同架構轉換版 FLUX.2 Klein（落後 Iris-3B） | Marigold V2 協定 |
| 4× 影像修復 LPIPS／PSNR（DIV2K） | 0.292／20.68 | 原生潛空間 FLUX.2 Klein 微調版（兩個像素空間版本皆未超越） | 論文自測 |

⚠️ 以上全為 Sperid Labs 自測，目前未見第三方獨立複現。論文的核心結論本身就是負向結果：深度估計與影像修復兩項，拿掉 VAE 並未帶來顯著優勢。

## 與前代/競品比較

Sperid Labs 是第一次公開發模型，沒有前代可比，比較對象是論文自己設計的兩組對照：原生潛空間模型 FLUX.2 Klein base 4B，以及把同一個 FLUX.2 Klein 轉換成像素空間後的版本。先看文字生成影像：OneIG-EN 打平 Qwen-Image、GenEval／DPG 數字也算體面，說明「拿掉 VAE 直接輸出像素，品質不犧牲」這個假設的前半段是成立的。

但論文真正要驗證的賣點——「像素空間沒有 VAE 的有損壓縮，應該在需要精細細節的下游任務上有優勢」——結果不成立：微調後的深度估計只打平用潛空間（有 VAE）的 FLUX.2 Klein，4 倍影像修復甚至沒贏。把既有的 FLUX.2 Klein 直接轉成像素空間（而非像 Iris-3B 從頭訓練）表現還更差，兩條路徑都沒驗證到最初的假設。

定價方面雙方都是開源自架、無官方 API，比較重點落在硬體門檻：Iris-3B 推論需要 NVIDIA GPU＋CUDA，純文字生成影像權重約 12GB，深度與放大功能各再加 12GB，100 steps 跑在 3B 模型加 4B 文字編碼器上不是輕量任務，作者自己也沒給出推論時間或 VRAM 用量數字。

## 對 Agent 開發的意義

這篇對 agent 開發者最大的意義不是「多一個圖片生成模型」，而是「幫你省一次重複驗證的成本」——如果你在評估要不要把 agent 的視覺感知模組換成「無 VAE」的像素空間骨幹（例如想用生成式先驗做深度估計或影像修復），Sperid Labs 已經做過受控對照實驗並得到否定結果，不用自己重跑一輪驗證同一個假設。

- 如果你在做：需要本地自架、不想依賴閉源 API 計費的小型圖片生成 agent（如素材生成、原型視覺化），Iris-3B 是一個 Apache 2.0、3B 參數、可跑在單張資料中心或高階消費級 GPU 的選項，OneIG-EN 打平 Qwen-Image 代表品質堪用
- 如果你在做：需要同一套骨幹同時支援生成、深度、修復三種任務而不想維護三套不同架構的 pipeline，Iris-3B 證明了「不改架構、分別微調」這條路可行
- 不適合：任何期待「像素空間＝更精細下游視覺任務表現」的場景——深度估計／影像修復 agent 如果本來就有成熟的潛空間模型（FLUX 系列、DINOv2 類 encoder）在跑，論文沒有給出理由現在換過去；也不適合要低延遲互動的場景，100 steps 的擴散推理加上額外子模型下載都不是輕量路徑

## 今日收穫

「VAE 是有損壓縮，拿掉它應該換來更精細的下游細節」聽起來是個合理到不需要驗證的假設，但 Sperid Labs 用同一組受控實驗（同資料規模、同訓練步數、兩條不同路徑）直接測了一次，結果是「可行，但沒有優勢」——這提醒我們：架構上「聽起來合理」的假設，在對照實驗跑完之前都只是假設。這篇論文選擇誠實發表負向結果、而不是把「文字生成影像打平 Qwen-Image」包裝成全面突破，這個發表態度本身比模型效果更值得記一筆。

## 參考資料

- [HuggingFace：speridlabs/iris-3b 模型卡](https://huggingface.co/speridlabs/iris-3b)
- [arXiv 2610.09450：Iris-3B: Going Beyond the Latent with Pixel-Space Diffusion Training, Conversion and Fine-Tuning](https://arxiv.org/abs/2610.09450)
- [GitHub：speridlabs/iris-3b（訓練程式碼）](https://github.com/speridlabs/iris-3b)
- [explainx.ai：Iris-3B 深度解讀（含論文細節與誤差提醒）](https://explainx.ai/blog/sperid-iris-3b-pixel-space-image-model-no-vae-2026)
- [AI Weekly：SperidLabs Scales Iris-3B to 3B, Finds No Downstream Edge](https://aiweekly.co/alerts/speridlabs-scales-iris-3b-to-3b-finds-no-downstream-edge)
- [Sperid Labs 官方研究頁面](https://speridlabs.com/research/iris)
