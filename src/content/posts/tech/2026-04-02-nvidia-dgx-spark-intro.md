---
title: "NVIDIA DGX Spark：桌上型 AI 超級電腦，把一個 petaFLOP 塞進你的桌面"
date: 2026-04-02
type: guide
category: tech
tags: [nvidia, dgx-spark, gpu, ai-hardware, blackwell, edge-ai, llm]
lang: zh-TW
tldr: "NVIDIA DGX Spark 搭載 GB10 Grace Blackwell Superchip，128GB 統一記憶體，提供 1 petaFLOP FP4 算力，售價約 $3,999 美元起。適合開發者在本地跑 200B 參數模型、fine-tune 70B 模型，是目前最容易入手的 NVIDIA AI 開發平台。"
description: "NVIDIA DGX Spark 是一台搭載 Grace Blackwell 超級晶片的桌上型 AI 電腦，以迷你體積提供 1 petaFLOP 算力。本文介紹其規格、定位、與 DGX Station 的差異，以及適合哪些使用場景。"
draft: false
---

🌏 [English version](/posts/tech/2026-04-02-nvidia-dgx-spark-intro-en)

## DGX Spark 是什麼

NVIDIA DGX Spark 是 NVIDIA 在 GTC 2025 發表的個人 AI 超級電腦（最初代號 Project DIGITS）。它把 Grace Blackwell 架構塞進一個比 NUC 還小的機身（150×150×50.5mm，僅 1.2kg），功耗只有 170W，卻能輸出 1 petaFLOP 的 FP4 AI 算力。

簡單說：這是 NVIDIA 第一次把資料中心等級的 AI 晶片，做成一台放在桌上就能用的東西。

## 核心規格

| 項目 | 規格 |
|------|------|
| 晶片 | NVIDIA GB10 Grace Blackwell Superchip（ARM CPU + Blackwell GPU，NVLink-C2C 連接） |
| 記憶體 | 128GB 統一記憶體（LPDDR5x，不可升級） |
| 記憶體頻寬 | 273 GB/s |
| AI 算力 | 1 petaFLOP FP4 / 1,000 TOPS |
| Tensor Core | 第五代，支援 FP4 精度 |
| 儲存 | 1TB–4TB（依 SKU，購買時選定） |
| 網路 | Wi-Fi 7、Bluetooth 5.3、10GbE ConnectX-7 NIC |
| 連接埠 | 4×USB4、HDMI 2.1 |
| 功耗 | 170W |
| 作業系統 | NVIDIA DGX OS（基於 Linux） |

## 模型支援能力

- **推論（Inference）**：可跑最高 200B 參數的模型
- **微調（Fine-tune）**：支援最高 70B 參數的模型
- **雙機串聯**：兩台 DGX Spark 透過 ConnectX-7 連接，可處理最高 405B 參數模型（例如 Llama 3.1 405B）

128GB 的統一記憶體是關鍵。目前消費級顯卡最高是 RTX 5090 的 32GB VRAM，跑大模型時記憶體不夠就得量化或 offload，體驗大打折扣。DGX Spark 的 128GB 讓你可以把整個 70B 模型完整載入，不需要妥協。

## 軟體生態

DGX Spark 預裝完整的 NVIDIA AI 軟體堆疊：

- **NVIDIA NIM**：微服務化的推論引擎，部署模型只要幾行指令
- **NVIDIA Blueprints**：預建的 AI 應用範本（RAG、Agent 等）
- **開發工具**：PyTorch、Jupyter、Ollama 等常見框架直接可用
- **雲端無縫接軌**：本地開發完的容器可以直接推到 NVIDIA DGX Cloud

這意味著你在 DGX Spark 上 prototype 的東西，可以原封不動地部署到雲端或資料中心，不需要重新適配。

## 售價與購買

DGX Spark 的定價經歷了幾次變化：

- **GTC 2025 發表時**：$3,000 美元（Project DIGITS 時期）
- **2025 年 10 月正式發售**：Founders Edition $3,999 美元
- **2026 年 2 月調漲**：$4,699 美元（NVIDIA 表示因 128GB LPDDR5x 供應吃緊）
- **OEM 版本**：ASUS Ascent GX10 約 $3,000 美元起（1TB 儲存）

除了 NVIDIA 自己賣，Acer、ASUS、Dell、GIGABYTE、HP、Lenovo、MSI 等 OEM 都有推出自家版本。

## DGX Spark vs DGX Station

如果你在考慮 DGX Spark 跟 DGX Station 怎麼選，以下是重點比較：

| | DGX Spark | DGX Station |
|---|---|---|
| 晶片 | GB10 Grace Blackwell | GB300 Grace Blackwell Ultra |
| AI 算力 | 1 petaFLOP | 20 petaFLOP |
| 記憶體 | 128GB 統一記憶體 | 784GB（288GB HBM3e + 496GB LPDDR5X） |
| 記憶體頻寬 | 273 GB/s | 8 TB/s（GPU）+ 396 GB/s（CPU） |
| 最大模型 | 200B（單機）/ 405B（雙機） | 1T 參數 |
| 多用戶 | 單用戶 | MIG 最多 7 個分區 |
| 網路 | 10GbE ConnectX-7 | 800Gb/s ConnectX-8 SuperNIC |
| 體積 | NUC 大小（1.2kg） | 塔式機殼 |
| 價格 | ~$3,999–$4,699 | 預估五位數美元 |

**結論**：DGX Spark 是個人開發者和小團隊的選擇；DGX Station 是實驗室和企業級的東西——20 倍算力、6 倍記憶體，但價格也是完全不同量級。

## 適合誰用

DGX Spark 最適合這些場景：

1. **AI 開發者**：需要在本地跑 CUDA、用 NVIDIA 生態系工具鏈的人
2. **LLM 研究者**：想在本地 fine-tune 和測試大型語言模型，不想每次都付雲端費用
3. **原型開發**：在本地快速迭代，確認可行後再推到雲端規模化
4. **隱私敏感場景**：資料不能上雲的醫療、金融、政府單位
5. **Edge AI**：需要在邊緣端部署高算力推論的應用

如果你目前用 Mac Studio 跑 llama.cpp，或用 RTX 4090/5090 在本地跑模型但覺得記憶體不夠，DGX Spark 是目前最合理的升級路徑——128GB 統一記憶體加上完整的 NVIDIA 軟體支援，在這個價位帶沒有對手。

## 小結

DGX Spark 代表的趨勢是 **AI 算力的民主化**。過去要跑大模型，你的選項是租雲端 GPU 或買一台幾十萬的工作站。現在用不到 15 萬台幣的價格，就能在桌上放一台跑得動 200B 模型的機器。

它不是完美的——273 GB/s 的記憶體頻寬是瓶頸，記憶體不可升級，跑 training 的能力也有限。但作為一台本地推論和 fine-tune 的開發機，DGX Spark 在 2025–2026 年的 AI 硬體市場裡，找到了一個很精準的定位。

## 參考資料

- [NVIDIA DGX Spark 官方產品頁面](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)
- [NVIDIA Newsroom — DGX Spark Arrives for World's AI Developers](https://nvidianews.nvidia.com/news/nvidia-dgx-spark-arrives-for-worlds-ai-developers)
- [NVIDIA Blog — DGX Spark and DGX Station Power Open-Source and Frontier Models](https://blogs.nvidia.com/blog/dgx-spark-and-station-open-source-frontier-models/)
- [NVIDIA DGX Spark 硬體規格文件](https://docs.nvidia.com/dgx/dgx-spark/hardware.html)
- [NVIDIA DGX Spark Marketplace](https://marketplace.nvidia.com/en-us/enterprise/personal-ai-supercomputers/dgx-spark/)
- [NVIDIA DGX Spark Review — IntuitionLabs](https://intuitionlabs.ai/articles/nvidia-dgx-spark-review)
- [DGX Spark vs DGX Station 完整比較 — TWOWIN](https://twowintech.com/nvidia-dgx-spark-vs-nvidia-dgx-station-a-comprehensive-comparison/)
- [Nvidia DGX Spark: The Best Inventions of 2025 — TIME](https://time.com/collections/best-inventions-2025/7318247/nvidia-dgx-spark/)
- [DGX Spark now available for $3,999 — Constellation Research](https://www.constellationr.com/blog-news/insights/nvidia-dgx-spark-now-available-3999-real-impact-will-be-ai-edge)
- [DGX Spark vs. Mac Studio 價格比較 — Rost Glukhov](https://www.glukhov.org/post/2025/10/nvidia-dgx-spark-prices/)
