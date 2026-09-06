---
title: "國家隊的從零訓練：Apertus 的合規路線與 LLM-jp 的日文生態"
date: 2026-09-06
category: ai
type: deep-dive
tags: [apertus, llm-jp, llm, open-source, pre-training, multilingual, training-data]
lang: zh-TW
series:
  name: "從零訓練一個 LLM"
  order: 7
tldr: "兩個國家級專案展示了從零訓練的另一種動機：瑞士的 Apertus 用 15T tokens、1,000+ 語言與嚴格的 opt-out 個資過濾對齊 EU AI Act；日本的 LLM-jp 由 NII 主導，2026 年 4 月的 LLM-jp-4 在 12T tokens 上訓練出多項 benchmark 超越 GPT-4o 的模型。它們回答的問題和效能路線不同：不是「跑得快」，而是「主權與合規下能訓出什麼」。"
description: "「從零訓練一個 LLM」系列 order 7：瑞士 Apertus 與日本 LLM-jp 的國家級從零訓練——多語資料課程、合規導向的資料治理、以及非英語圈怎麼對抗模型壟斷。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-06-national-multilingual-llm-training-en)

這個系列到目前為止的專案有個共同點：動機是學習（MiniMind）、資料效率（YuLan-Mini）或研究透明性（OLMo、LLM360）。這篇的兩個專案動機不同——**語言主權與法規合規**。當你關心的語言在英語圈的訓練資料裡只占不到 1%，等現成模型改善你的語言是不切實際的；當你受 EU AI Act 約束，你需要的不是最強的模型，而是能說清楚每個訓練資料來源的模型。

## Apertus：為合規而生的全開模型

2025 年 9 月 2 日，EPFL、ETH Zurich 與瑞士國家超算中心 CSCS 發佈 [Apertus](https://ethz.ch/en/news-and-events/eth-news/news/2025/09/press-release-apertus-a-fully-open-transparent-multilingual-language-model.html)（拉丁語「開放」），8B 與 70B 兩個尺寸，在 Alps 超算上從零訓練。15 兆 token、超過 1,000 種語言——其中 40% 的訓練資料是非英文，包括 Swiss German、Romansh 這種在通用語料中近乎不存在的語言。權重與配方公開，訓練細節完整出版（[論文](https://arxiv.org/pdf/2509.14233)）。

它和系列前面專案最大的差異不在架構，在**資料治理**：

- **訓練前過濾，而非事後聲明**：語料只收公開可得的資料，訓練前就處理網站的機器可讀 opt-out 請求——甚至可以回溯適用，網站之後才聲明退出，版本也會處理。個人資料與不良內容在訓練開始前移除。
- **對齊法規**：整條流程被設計為滿足瑞士資料保護法與 EU AI Act 的透明性要求（Article 53(1)(d) 要求 GPAI 模型公開訓練內容摘要）。這讓 Apertus 成為「合規的 fully open」的參考實作，而不只是另一個開源模型。
- **多語課程**：1,811 種原生支援語言，低資源語言的資料平衡是課程設計的核心，而非事後補救。

2026 年 7 月 24 日，團隊發佈 [Apertus 1.5](https://ai.ethz.ch/news-and-events/ai-center-news/2026/07/apertus-15-building-the-next-generation-of-open-ai-infrastructure.html)：新增影像與音訊理解、推理與指令遵循改進，仍是 Apache 2.0。從純文字到多模態只花了十個月，這個迭代速度本身就是開放配方路線的論證——改良可以疊在公開的訓練流程上，而不用每次從頭來。

## LLM-jp：日本的做法

日本的做法不同：不是一所大學加一台超算，而是**國家研究院 NII 主導的產學聯盟**。[LLM-jp](https://llm-jp.nii.ac.jp/en/home-en/) 從 2024 年 9 月起持續發佈從零預訓練的日文模型系列，節奏快得像工廠：

- **2026 年 3 月，LLM-jp-3.1**：在 3 系列基礎上加連續預訓練與改良的後訓練，指令遵循大幅提升。已涵蓋 8 個 dense 尺寸（150M、440M、980M、1.8B、3.7B、7.2B、13B、172B）與 2 個 MoE（8×1.8B、8×13B）。
- **2026 年 4 月，[LLM-jp-4](https://www.nii.ac.jp/en/news/release/2026/0403.html)**：8B 與 32B-A3B 兩個尺寸，約 12 兆 token 的高品質語料（公開網路資料、政府與國會文件等），支援約 65K context，官方宣稱在多項標準 benchmark 超越 GPT-4o 與 Qwen3-8B。

兩個細節值得注意。第一，**語料的法律級別**：LLM-jp-4 的訓練語料按開源 AI 定義（OSAID）標準收集與構建，第三方可取得——政府文件、國會紀錄這類高品質、低風險的公共資料是它的差異化優勢，這是商業模型很難拿到的語料結構。第二，**尺寸光譜的完整性**：從 150M 到 172B 每一檔都出，等於把「日文 LLM 在每個規模的能力曲線」做成公開教材，跟 K2 做逐 checkpoint 畫廊是同一種思路，只是換了維度。

兩個專案共同說明一件事：非英語圈做從零訓練，瓶頸不在技術（技術是共通的），在**語料結構與治理決策**。Apertus 用嚴格過濾換合規，LLM-jp 用公共語料換品質與合法性——路線不同，但都拒絕了「直接翻譯英文資料湊數」的捷徑。

## 架構對照：RWKV 的另一條路

系列導讀承認過一個缺口：全部案例都是 Transformer。至少該知道另一條路存在：[RWKV-7（Goose）](https://wiki.rwkv.com/)——把注意力換成線性複雜度的 RNN 式架構，推理時記憶體恆定，2025 年 3 月論文發表，社群按版本持續從零訓練各尺寸開源模型。它目前在性能上還追不過同尺寸 Transformer，但「訓練時 15T token、推理時 O(1) 記憶體」的取捨在邊緣場景是真實的差異。把它放在這篇的原因：Apertus 與 LLM-jp 證明了多語資料可以系統化取得，而架構實驗（RWKV、Mamba 系）同樣需要公開配方才能被社群檢驗。

## 整體來說

上一篇 [OLMo 3 與 LLM360](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining) 展示透明度的上限；這篇的兩個專案展示的其實是同一件事的另一面——**「開放」不只是研究者友善，也是一種主權策略**。Apertus 用合規換來部署的合法性（Swisscom、Public AI 網路都直接採用），LLM-jp 用國家協作換日文生態的自主性（[Rakuten AI 3.0](https://global.rakuten.com/corp/news/press/2026/0317_01.html) 這類商業模型也在同一個 GENIAC 框架下發展）。對系列最初的問題——什麼時候該從零訓練——這篇補上了第四個答案：**當你的需求是主權與合規，而開放模型給不了你時**。決策收斂見 [什麼時候該自己訓 LLM](/posts/ai/2026-09-06-when-to-train-llm-from-scratch)，後續兩篇補充效率路線與訓練框架。

## 參考資料

- [Apertus 官方新聞稿（ETH Zurich）](https://ethz.ch/en/news-and-events/eth-news/news/2025/09/press-release-apertus-a-fully-open-transparent-multilingual-language-model.html)
- [Apertus 論文（arXiv:2509.14233）](https://arxiv.org/pdf/2509.14233)
- [Apertus 1.5 發佈（ETH AI Center）](https://ai.ethz.ch/news-and-events/ai-center-news/2026/07/apertus-15-building-the-next-generation-of-open-ai-infrastructure.html)
- [swiss-ai/Apertus-70B（Hugging Face）](https://huggingface.co/swiss-ai/Apertus-70B-2509)
- [LLM-jp 官方網站（NII）](https://llm-jp.nii.ac.jp/en/home-en/)
- [LLM-jp-4 發佈（NII 新聞稿）](https://www.nii.ac.jp/en/news/release/2026/0403.html)
- [LLM-jp-3.1 系列發佈](https://llm-jp.nii.ac.jp/en/news/release-of-llm-jp-3-1-series-instruct4/)
- [RWKV Wiki（RWKV-7 Goose）](https://wiki.rwkv.com/)
- [Rakuten AI 3.0（GENIAC 框架）](https://global.rakuten.com/corp/news/press/2026/0317_01.html)