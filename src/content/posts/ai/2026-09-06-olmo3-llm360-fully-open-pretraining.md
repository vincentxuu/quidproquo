---
title: "全透明的 LLM 怎麼做：OLMo 3 的 model flow 與 LLM360 K2 的 360° 開源"
date: 2026-09-06
category: ai
type: deep-dive
tags: [olmo, llm360, llm, open-source, pre-training, training-data]
lang: zh-TW
series:
  name: "從零訓練一個 LLM"
  order: 5
tldr: "「開源 LLM」其實是一條光譜：只開權重（Llama）→ 權重加資料（多數 fully open 專案）→ 連資料順序、中間 checkpoint、訓練日誌都開（LLM360 K2、OLMo 3 的 model flow）。這篇拆解兩個把透明度推到極致的專案：OLMo 3 在 2025 年 11 月放出首個全開的 32B thinking 模型，K2 則是首個 65B 級、連 optimizer states 都公開的模型。"
description: "拆解 OLMo 3 的 model flow 與 LLM360 K2 的 360° 開源：fully open 的定義光譜、中間 checkpoint 與訓練日誌的研究價值，以及什麼時候你真的需要這種等級的資源。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en)

「開源 LLM」這四個字涵蓋的東西差距極大。Llama 只開權重；[OLMo](/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm) 連訓練資料都開。而這篇要談的兩個專案——Ai2 的 OLMo 3 和 MBZUAI 團隊的 LLM360——把透明度再往上推一層：不只開資料，還開**訓練過程本身**。每一階段的 checkpoint、訓練日誌、甚至訓練資料的確切順序，都在公開範圍內。

## 「開源」的光譜：權重只是起點

把目前主流的開放程度排成三級，界線就清楚了：

| 等級 | 公開內容 | 代表 |
|---|---|---|
| 開放權重 | 最終模型權重 | [Llama](https://www.llama.com/)、Mistral |
| Fully open | 權重 + 訓練資料 + 訓練程式碼 | [OLMo](https://allenai.org/blog/olmo3)、[Marin](/posts/ai/2026-08-24-marin-535b-hero-run)、Apertus |
| 360° 全開 | 再加中間 checkpoint、訓練日誌、資料順序 | [LLM360](https://github.com/LLM360)、OLMo 3 |

這條光譜不是誰發明的單一標準，而是社群逐步疊出來的。Eleuther AI 的 [Pythia](https://github.com/EleutherAI/pythia) 在 2023 年就公開了 143 個中間 checkpoint，證明這樣做的價值；LLM360 在同年年底提出「360° open」，把資料順序和日誌納入定義；BLOOM 則用 [BLOOM Book](https://huggingface.co/spaces/bigscience/bloom-book) 展示過訓練過程的出版方式。OLMo 3 的增量不在「發明」這些做法，而是把全套流程套在**旗艦品質**的模型上——這是以前只有小模型才享有的待遇。

## OLMo 3：把 model flow 當成發佈物

Ai2 在 2025 年 11 月 20 日發佈 [OLMo 3](https://allenai.org/blog/olmo3)，7B 與 32B 兩個 dense 尺寸。官方用「model flow」描述它開放的東西：**一個語言模型的完整生命週期——每個階段、每個 checkpoint、每筆資料、每個依賴**。你拿到的不是一個最終權重檔，而是一整條可隨時介入的生產線。

幾個具體數字：

- 預訓練用 [Dolma 3](https://huggingface.co/datasets/allenai/dolma)：原始清理後的資料池約 9.3 兆 token，實際訓練用的 Dolma 3 Mix 約 5.9 兆（6T）token，其中程式碼與數學比例較前代更高，並做了更大規模的去重與去污染。
- 三階段 base 訓練：大規模預訓練 → 中訓練（Dolmino，100B token 高品質數學、程式碼與推理資料）→ 長上下文擴展（Longmino），最終支援到 65K context——是 OLMo 2 的 16 倍。
- 後訓練三條路線：Instruct（對話與工具呼叫）、Think（推理）、RL Zero（直接從 base 做 RLVR）。RL Zero 特別公開了 math、code、instruction following、general chat 四個領域系列的 checkpoint。
- 2025 年 12 月 12 日追加 [OLMo 3.1](https://allenai.org/blog/olmo3)：Think 32B 在延長 21 天、224 張 GPU 的 RL 訓練後，AIME 提升 5 分以上、IFBench 提升 20 分以上；同時補上社群點名要的 Instruct 32B。兩者權重都是 [Apache 2.0](https://huggingface.co/collections/allenai/olmo-3)。

Nathan Lambert 在 [Interconnects](https://www.interconnects.ai/p/olmo-3-americas-truly-open-reasoning) 的發文裡直稱 OLMo 3 32B 是「首個 32B 以上規模的全開推理模型」，並把 Think 32B 與 Qwen 3 32B 的差距縮到 1–2 分——而 OLMo 3 用的訓練 token 大約只有 1/6。更值得研究者的點是：Qwen 3 至今沒有放出 32B base 模型，而 RL Zero 這條路線之所以能做乾淨的 RLVR 研究（例如釐清 [Spurious Rewards](https://arxiv.org/abs/2506.10947) 這類爭議是不是資料污染造成的），正是因為預訓練資料全開、可以排除污染——這在開放權重模型上做不到。

## LLM360 K2：65B 的 360° 全開

LLM360 在 2023 年底提出「360° Open Source」，三個原則：可復現（reproducibility）、透明（transparency）、可及（accessibility）。先後做過 Amber 7B、CrystalCoder 7B，而 2025 年 1 月發表的 [K2 論文](https://arxiv.org/abs/2501.07124)把這套做法推到當時最大的規模：K2 Diamond，65B 參數、1.4 兆 token 從零訓練，據作者所知是**首個這個尺寸的全開源 LLM**。

K2 的成績不算新模型，但意義在於等價性：超越 LLaMA-65B、逼近 LLaMA2-70B，FLOPs 少約 35%，數學與程式碼能力反而更強。訓練用 480 張 A100，用 TP8×PP4×DP15 的 4D 並行。

真正稀有的是它公開的東西清單：

- **140 個中間 checkpoint**（訓練共存了 380 個，每個超過 100GB，受儲存限制先上傳 140 個），含 optimizer states——早期的 Amber 因實作錯誤弄丟了 optimizer states，論文裡誠實記了一筆。
- **確切的訓練資料順序**（[K2Datasets](https://huggingface.co/datasets/LLM360/K2Datasets)）：資料按 checkpoint 對應切成 chunk，理論上可逐 token 重現訓練。
- **完整的 W&B 訓練日誌**，加上 K2 [Prompt Gallery](https://huggingface.co/spaces/LLM360/k2-gallery) 與 [Evaluation Gallery](https://huggingface.co/spaces/LLM360/k2-eval-gallery)——仿 BLOOM Book，把每個 checkpoint 在固定提示上的輸出做成可瀏覽的畫廊。
- **訓練事故日誌**：訓練中遇到兩次惡性 loss spike（malignant spike），記錄了當下怎麼判斷（良性 spike 通常伴隨大梯度範數、更新量小、無害；持續超過 100 步的惡性 spike 則回滾重訓）、怎麼處理。「65B 怎麼處理 loss spike」這個問題，在 K2 之前只有閉源團隊知道答案。
- 權重 [Apache 2.0](https://huggingface.co/LLM360)，資料 ODC-By。

## Model flow 的價值：模型是一條流程，不是一個檔案

把這兩個專案放在一起看，會發現它們指向同一個概念轉移：**模型的單位從「最終權重」變成「整條訓練流程」**。OLMo 3 官方部落格的說法是，只分享最終結果「掩蓋了修改、調整、擴充模型能力所需的脈絡」——許多有意義的調整必須深入訓練流程的中段，而不是只在最終階段動手。

實務上這打開了幾扇門：

- **介入點可選**：OLMo 3 的每個階段 checkpoint 都能下載。想注入領域資料，從 midtraining checkpoint 續訓比從頭訓或事後微調都更有效；想做自己的後訓練，跳過 Ai2 的 Dolci 資料集換成你自己的 SFT/DPO 配方。
- **學習曲線可比**：K2 的 140 個 checkpoint 讓你畫出「65B 在 1.4T token 上每個階段各會什麼」，這正是它做 longitudinal capability study 的基礎——能力不是最後一步突然出現的，回看曲線才知道哪段資料貢獻了什麼。
- **污染可排除**：前面提到的 RLVR 研究爭議，只有資料全開的模型能給出乾淨結論。

## 什麼時候你才需要這種等級的資源

誠實說，多數使用者不需要。要跑推理、做 RAG、甚至做一般微調，開放權重模型就夠了，而且 Qwen、Gemma 這類選擇往往效能更好。360° 全開的資源是給這些人準備的：

1. **做 RLVR/後訓練研究的**：需要確認訓練資料沒污染你的 benchmark，OLMo 3 RL Zero 是目前最乾淨的實驗場。
2. **要從中間 checkpoint 續訓或做領域適配的**：與其從 7B 小模型摸索，不如從 OLMo 3 Base 32B 的 midtraining checkpoint 直接開工。
3. **做模型行為分析、可解釋性、資料影響研究的**：[OlmoTrace](https://allenai.org/blog/olmotrace) 能把模型輸出即時追溯回訓練資料，K2 的逐 checkpoint 畫廊則讓你直接觀察能力浮現的過程。
4. **教學與復現**：K2 的 loss spike 事故紀錄和 OLMo 3 完整的資料處理工具（[datamap-rs](https://github.com/allenai/datamap-rs)、[duplodocus](https://github.com/allenai/duplodocus)），是把「怎麼訓大模型」變成可讀文件的僅有案例。

## 整體來說

上一篇 [YuLan-Mini](/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining) 展示了用資料品質把小模型推到極致；這篇的兩個專案展示的是另一種極致——把訓練過程本身變成可研究的公開資產。OLMo 3 證明 fully open 可以跟旗艦性能同時成立（首個全開 32B thinking 模型），K2 證明 65B 這種等級的訓練全程可以完全可復現。對想自己從零訓一個模型的人，它們是最完整的參考答案；至於什麼規模、什麼情境該直接用現成模型，下一篇 [什麼時候該自己訓 LLM](/posts/ai/2026-09-06-when-to-train-llm-from-scratch) 會收攏整個系列。

## 參考資料

- [Olmo 3: Charting a path through the model flow to lead open-source AI（Ai2 官方部落格）](https://allenai.org/blog/olmo3)
- [OLMo 3 論文（Hugging Face Papers / arXiv:2512.13961）](https://huggingface.co/papers/2512.13961)
- [Olmo 3: America's truly open reasoning models（Nathan Lambert, Interconnects）](https://www.interconnects.ai/p/olmo-3-americas-truly-open-reasoning)
- [LLM360 K2: Building a 65B 360-Open-Source Large Language Model from Scratch（arXiv:2501.07124）](https://arxiv.org/abs/2501.07124)
- [LLM360 GitHub 組織（k2-train、k2-data-prep 等程式碼）](https://github.com/LLM360)
- [OLMo 3 模型與資料集合（Hugging Face）](https://huggingface.co/collections/allenai/olmo-3)
- [OLMo：唯一連訓練資料都開源的語言模型家族（站內舊文）](/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm)
- [Marin 535B 怎麼訓（站內舊文）](/posts/ai/2026-08-24-marin-535b-hero-run)
