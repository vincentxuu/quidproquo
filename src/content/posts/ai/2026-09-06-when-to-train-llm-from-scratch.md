---
title: "什麼時候該從零訓練 LLM：一張決策樹與完整的成本梯度"
date: 2026-09-06
category: ai
type: deep-dive
tags: [llm, training, pre-training, open-source, cost, scaling-laws]
lang: zh-TW
series:
  name: "從零訓練一個 LLM"
  order: 6
tldr: "從零訓練只在三種情況成立：你要學習訓練本身、你有開放模型沒見過的 10B+ 乾淨語料、或你需要全透明的訓練過程做研究。否則微調或 RAG 幾乎總是更便宜的答案。這篇把系列走過的主要路線收斂成一張成本梯度表與決策樹。"
description: "「從零訓練一個 LLM」系列總結：從 3 元到 65B 的成本梯度、四種訓練動機對應的路線選擇、什麼時候不該從零訓練，以及整個系列的光譜回顧。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-06-when-to-train-llm-from-scratch-en)

這個系列走過的每條路線都可以用同一個透鏡看：3 塊錢的 [MiniMind](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)、[100 美元的 nanochat](/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c)、中文社群的小模型、榨乾每 token 價值的 YuLan-Mini、以及工業級全透明的 OLMo 3 與 LLM360。加上後續的國家級、效率與框架路線。這篇收斂成一個問題：**你該走哪條路，或者根本不走。**

## 成本梯度

「從零訓練」不是一個動作，是一個橫跨五個數量級的光譜：

| 投入 | 代表 | 你會得到 |
|---|---|---|
| ~3 元人民幣 / 2 小時 | MiniMind（64M） | 完整訓練流程的教學樣本，模型本身不堪用 |
| ~$100 / 4 小時 | nanochat（8×H100） | 能對話的 ChatGPT clone，GPT-2 以下水準 |
| ~$300 / 12 小時 | nanochat 中檔 | CORE 指標達 GPT-2 等級 |
| ~$1,000 / 41 小時 | nanochat 大檔 | 更連貫，能解簡單數學與程式問題 |
| 數千 GPU-小時 | YuLan-Mini（2.4B，1.08T tokens） | 數學與程式可比更大的模型，但需要資料工程功力 |
| 數萬 GPU-小時 | OLMo 3（32B）、LLM360 K2（65B） | 前沿研究級模型，且訓練過程全透明 |

這張表的解讀方式比數字本身重要：**每往上一級，瓶頸就從「有沒有卡」換成另一種東西**。3 元的門檻是讀懂程式碼；$100 的門檻是會操作多卡節點；YuLan-Mini 的門檻是資料課程設計；OLMo 級的門檻是系統工程與資金。

## 從這些專案學到的失敗模式

這些路線反覆驗證了幾個同樣的教訓：

- **資料比架構難**。每個專案的 README 裡，架構都只有幾頁，資料管線卻佔了大部分篇幅。MiniMind 為了統一資料格式重寫過三版；YuLan-Mini 的核心貢獻全部在資料課程；OLMo 乾脆把資料集做成一個獨立的開源專案（Dolma）。
- **小模型的分數會說謊**。MiniMind 的評估章節展示了同一個模型在「有資料汙染」與「無汙染」條件下分數可以差到 97% 與 25%——差別不在能力，在測試集有沒有混進訓練資料。讀任何 from-scratch 專案的 benchmark 之前，先問資料汙染怎麼處理的。
- **獎勵稀疏是 RL 的牆，不是調參問題**。模型太弱時，rule-based 獎勵恆為零，強化學習整條線直接失效。MiniMind 用連續分數的 reward model 繞過它，這個取捨在任何規模的 RL 訓練都會再遇到一次。
- **「訓得起」和「維護得起」是兩件事**。中文社群的專案示範了這點：訓練一次的成本幾乎為零，但 tokenizer、資料格式、下游生態相容性的維護成本會長期存在，這也是多數小專案停在 v1 的原因。

## 決策樹

先問你要什麼：

**想理解訓練怎麼運作** → MiniMind 或 nanochat。前者單卡、中文生態、覆蓋到 Agentic RL；後者是全棧強基線、英文生態、更接近工業實務。兩個都跑完，你對 LLM 的理解會超過多數只做過微調的人。理論背景缺的話，[Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch) 的課程導讀是配套教材。

**想讓模型學會你的領域資料** → 幾乎不要從零。LoRA、全參微調或 RAG 能解決的問題，從零預訓練是拿數萬美元換更差的結果。例外只有一種：你手上有 10B+ token、沒有任何開源模型見過的乾淨語料（稀有語言、專利領域、封閉行業語料），這時先看 YuLan-Mini 的資料效率配方，它證明了資料品質與課程設計可以省下一個數量級的算力。

**做研究需要透明性** → OLMo 3 或 LLM360。權重、資料、每個階段的 checkpoint、訓練 log 全開。要追溯模型輸出對應哪段訓練資料，只有這條路線做得到。

**想訓練生產級模型** → 用 verl、Llama-Factory 這類成熟框架，站在 [OLMo](/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm) 與 Marin 這類公開配方上，不要重造訓練器。

## 什麼時候不該訓練

誠實的清單：

- 你的需求是「模型懂我的文件」→ RAG，一天搞定
- 你的需求是「模型照我的格式回答」→ 微調
- 你的需求是「模型更新知識」→ RAG 或重新微調
- 你想要一個「自己的模型」但說不清用途 → 先把用途說清楚，多數時候答案是 API

從零預訓練在 2026 年的定位很像自己組裝電腦：學習價值極高，經濟價值通常為負。但「經濟上不划算」不等於「不值得」——這正是這整個系列的存在理由。

## 整體來說

回顧這個系列的光譜：[MiniMind](/posts/ai/2026-09-06-minimind-train-llm-from-scratch) 把門檻壓到任何人都能跑；Karpathy 的 nanochat 展示一個人能維護的工業級下限；中文社群專案證明資料生態比架構更難；YuLan-Mini 把資料效率做到極致；OLMo 與 LLM360 則定義了「完全開源」的天花板。這些路線互相不取代——它們回答的是不同的問題。你唯一需要避免的錯誤，是拿玩具專案的期待去跑旗艦的訓練，或反過來，拿旗艦的需求去否定教學專案的價值。

## 參考資料

- [MiniMind GitHub](https://github.com/jingyaogong/minimind)
- [nanochat GitHub](https://github.com/karpathy/nanochat)
- [nanochat 官方發佈討論串](https://github.com/karpathy/nanochat/discussions/1)
- [YuLan-Mini GitHub](https://github.com/RUC-GSAI/YuLan-Mini)
- [YuLan-Mini 論文](https://arxiv.org/abs/2412.17743)
- [OLMo 3 — Allen AI Blog](https://allenai.org/blog/olmo3)
- [LLM360 K2 論文](https://arxiv.org/pdf/2501.07124)
- [SmolLM3 — Hugging Face](https://huggingface.co/HuggingFaceTB/SmolLM3-3B)
- [Self-Training a Small LLM From Scratch (2026 Guide)](https://codersera.com/blog/self-training-small-llm-complete-guide-2026/)
- 系列各篇：[order 0 導讀](/posts/ai/2026-09-06-train-llm-from-scratch-series-intro)、[order 2 Karpathy 譜系](/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c)、[order 3 中文社群路線](/posts/ai/2026-09-06-chinese-community-small-llm-training)、[order 4 YuLan-Mini](/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining)、[order 5 全透明旗艦](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining)、[order 7 國家隊](/posts/ai/2026-09-06-national-multilingual-llm-training)、[order 8 效率邊緣](/posts/ai/2026-09-06-efficient-edge-llm-training)、[order 9 訓練框架](/posts/ai/2026-09-06-litgpt-from-scratch-framework)