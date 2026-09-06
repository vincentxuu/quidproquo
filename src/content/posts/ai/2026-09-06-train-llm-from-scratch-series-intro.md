---
title: "從零訓練一個 LLM：從 $0.4 到 65B 的專案光譜"
date: 2026-09-06
category: ai
type: guide
tags: [llm, training, open-source, pytorch, pre-training, learning-path]
lang: zh-TW
series:
  name: "從零訓練一個 LLM"
  order: 0
tldr: "開源社群把「從零訓練 LLM」的門檻壓到了驚人的低：MiniMind 用約 $0.4、單張 3090 兩小時就能跑完從 PreTrain 到 RL 的完整流程，另一端 OLMo 3 與 LLM360 K2 把 65B 模型的訓練資料、程式碼、每個階段的 checkpoint 全部公開。這個系列用 7 篇逛完從 $0.4 到 65B 的專案光譜，並標註這份地圖覆蓋不到的地方。"
description: "「從零訓練一個 LLM」系列導讀：從 MiniMind 的 $0.4 教學專案到 LLM360 K2 65B 的完全復現，蒐集 7 個開源預訓練專案的成本與透明度，附覆蓋矩陣、偏誤標註與 7 篇學習路徑。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-06-train-llm-from-scratch-series-intro-en)

用 API 接 LLM 跟從零把一個 LLM 訓出來，是同一張地圖上的兩端。前者人人都試過；後者在幾年前還是「大廠限定」的活動——動輒上億美元預算、上千張 GPU。[MiniMind](https://github.com/jingyaogong/minimind) 把這條線拉到了約 $0.4（租一張 RTX 3090 兩小時的成本），另一端由 [LLM360 K2](https://github.com/LLM360/k2-train) 用 65B 參數、1.4T tokens 展示了「完全復現」的工業標準。這篇是「從零訓練一個 LLM」系列（7 篇）的導讀：先定義我們選了什麼專案、為什麼，再擺出成本光譜、覆蓋矩陣與偏誤標註，最後是整條學習路徑。

## 本系列選了什麼

「從零訓練 LLM」的母群定義是：**公開完整訓練流程——程式碼加上資料或完整配方——而且模型是從隨機初始化、預處理開始循序漸進出來的**。排除三種常被誤認為「從零」的專案：只放權重（像是只發佈模型的 Llama）、只微調既有模型（[Llama-Factory](https://github.com/hiyouga/LLaMA-Factory) 這類）、以及純推理框架。換句話說，本系列只收「你拿得到所有按鈕」的專案——訓練超參數、資料配方、每一階段的權重，缺一不可。

## 為什麼要從零訓練：學習 vs 產品的取捨

同一個動機「想理解 LLM」，在光譜兩端長完全不同的形狀，這是本系列最重要的分類軸：

- **學習取向**，代表是 [MiniMind](https://github.com/jingyaogong/minimind)：64M 參數、約 $0.4 與 2 小時、56.8k stars，目標是「讓每個人都能讀懂每一行程式碼」。它的價值不在模型本身——64M 在任何真實任務上都不堪用——而在把決策鏈攤開：為什麼 8 層、詞表為什麼 6,400、GRPO 為何比 PPO 穩定。
- **產品取向**，代表是 [LLM360 K2](https://github.com/LLM360/k2-train) 65B／1.4T tokens：訓練目標是在實際任務上追上市售模型，而「完全復現」是它最大的資產——你想核對任何一個訓練決策，都能找到原始程式碼、資料與中間 checkpoint。

中間還有一整條收費梯：你要學演算法，看 Karpathy 的極簡代碼庫；要學資料效率，看 [YuLan-Mini](https://github.com/RUC-GSAI/YuLan-Mini)；要學工業級透明度，看 [OLMo](https://github.com/allenai/OLMo) 系列。判斷法只有一句：**你的問題是「為什麼這樣寫」，還是「這樣能不能複製」**——前者選便宜的教學專案，後者選公開程度最高、不是最省錢的專案。

## 成本光譜：從 MiniMind 到 LLM360 K2

同一個目標的收費可以差到六個數量級：預算量級不對，參數規模與公開程度也不對。以下表把每個案例的「價格刻度」列出來。

| 專案 | 參數規模 | 預算量級 | 資料 | 定位 | 系列篇目 |
|---|---|---|---|---|---|
| [MiniMind](https://github.com/jingyaogong/minimind) | 64M | ~$0.4 ／ 單張 3090 約 2 小時 | Qwen3 風格的全階段資料 | 全流程教學（PreTrain→SFT→RL） | [order 1](/posts/ai/2026-09-06-minimind-train-llm-from-scratch) |
| [nanochat](https://github.com/karpathy/nanochat)（[llm.c](https://github.com/karpathy/llm.c) 同源） | GPT-2/GPT-3-small 級區間 | $100 級／8×H100 約 4 小時；$300=GPT-2 級；$1,000/41 小時≈GPT-3-small | 公開資料 + 時間軸競速 | 極簡、單節點可跑 | [2](/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c) |
| 中文社群：[baby-llama2-chinese](https://github.com/DLLXW/baby-llama2-chinese)、[ChatLM-mini-Chinese](https://github.com/charent/ChatLM-mini-Chinese)、[Steel-LLM](https://github.com/zhanshijinwat/Steel-LLM) | 0.2B–1B | 4GB 顯存到 8×H800 | 中文語料為主 | 中文優先教學與長期實測 | [3](/posts/ai/2026-09-06-chinese-community-small-llm-training) |
| [YuLan-Mini](https://github.com/RUC-GSAI/YuLan-Mini) | 2.4B | 學術級（1.08T tokens） | 資料配方＋W&B logs 全公開 | 資料效率研究（ACL 2025 Oral） | [4](/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining) |
| [OLMo 3](https://huggingface.co/allenai/Olmo-3-1125-32B)（2025-11） | 7B／32B（含 Think 32B 思考模型） | 工業級 | Dolma 3 約 6T tokens | 每階段 checkpoint、Apache 2.0 | [5](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining) |
| [LLM360 K2](https://github.com/LLM360/k2-train) | 65B | 工業級 | 1.4T tokens | 完全復現 | [5](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining) |
| [SmolLM3](https://huggingface.co/HuggingFaceTB/SmolLM3-3B) | 3B | 11.2T tokens（2025-07 全配方公開） | 小模型的資料上限實驗 | —（第 5、6 篇提及） |

幾個值得先記的數字：Karpathy 在 2019 年訓練 GPT-2 花了大約 43,000 美元，今天 [nanochat](https://github.com/karpathy/nanochat) 的「time to GPT-2」競速把它壓到百元等級、4 小時內（2026 年初官方記錄約 $48／2 小時，時價浮動）；YuLan-Mini 用 1.08T tokens 在數學與程式碼上打平、甚至勝過 7~18T 的對照組；SmolLM3 證明 3B 模型也能吃下 11.2T tokens 而未飽和——TinyLlama 的 1.1B 吃 3T 還沒飽和，正是它之前的先例。

## 覆蓋矩陣

把以上放入維度矩陣，看出本系列在哪些維度有人認領、哪些只露一面：

| 維度 | 母群代表 | 系列覆蓋 |
|---|---|---|
| 極低成本教學（<$10） | MiniMind、baby-llama2-chinese | ✅ order 1、3 |
| 極簡工程（$100–1,000） | nanochat、llm.c | ✅ order 2 |
| 中文資料優先 | baby-llama2-chinese、ChatLM-mini-Chinese、Steel-LLM | ✅ order 3 |
| 資料效率研究 | YuLan-Mini | ✅ order 4 |
| 工業級完全開放 | OLMo 3、LLM360 K2 | ✅ order 5 |
| 開放配方但規模較小 | SmolLM3、MiniCPM 等 | ⚠️ 部分提及 |
| 研究用途退場 | Pythia、TinyLlama | ⚠️ 下面說明 |
| 非 Transformer 架構 | RWKV、Mamba 系 | ❌ 未列入 |
| 非英語非中文圈 | LLM-jp 等 | ❌ 未列入 |

**退場案例**：本系列提到 [Pythia](https://github.com/EleutherAI/pythia)（EleutherAI 留下的 154 checkpoints 研究套組）與 [TinyLlama](https://github.com/jzhang38/TinyLlama)（1.1B、3T tokens），重點在於它們把任務做完後功成身退——Pythia 的價值在留給研究使用的中間權重，TinyLlama 則證明「小模型也能吃到 tokens 飽和」。它們是「過去式還在用的工具」，本系列只用來對照，不單獨成篇。

## 偏誤標註：這張光譜沒透露的地方

- **以 GitHub 明星專案為母群**：選案高度往英語圈與中文圈靠攏（GitHub 的 star 機制天然偏重大語言市場），非英語非主流圈的專案容易被漏掉——[LLM-jp](https://huggingface.co/llm-jp) 這類日語生態完整、公開程度也高的專案，就因 star 量與討論度不足而未入選。這是這次蒐集已知的缺口。
- **退場案例只有研究用途的 Pythia／TinyLlama**：本系列的「退場」指的是「完成任務後被迭代超車」，不是失敗紀錄。Pythia 的 154 個 checkpoints 至今仍是研究界動態分析的工具；TinyLlama 則把「1B 模型吃 3T tokens」的實驗跑完交卷。選它們是想說明：這個類別的淘汰通常意味著它把某件事做到了底。
- **架構單一**：所有選案都是 Transformer。RWKV、Mamba 這些非注意力序列架構一度是熱門替代路線，但不符合本系列的「公開完整流程」選項，或者主流工具鏈沒有跟著走——想看替代架構，站上的 [CS336：Attention、MoE 與 Mamba](/posts/ai/2026-08-22-cs336-attention-moe) 是現成對照。

## 7 篇弧線

```
$0.4 ──────────────────────────────→ 65B（數十萬美元級）
教學/可讀性 ────────────────────→ 產品/可複製性
英語 → 中文 → 學術資料效率 ──────→ 工業透明
```

| order | 文章 | 主軸 |
|---|---|---|
| 0 | 本篇導讀 | 選案標準、成本光譜與偏誤 |
| 1 | [MiniMind：用 3 塊錢從零訓練一個 LLM](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)（已上線） | $0.4 級全流程教學 |
| 2 | [Karpathy：nanochat、nanoGPT 與 llm.c](/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c) | 極簡與「time to GPT-2」競速 |
| 3 | [中文社群小模型訓練](/posts/ai/2026-09-06-chinese-community-small-llm-training) | 語言資料優先的底線經驗 |
| 4 | [YuLan-Mini：資料效率化預訓練](/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining) | 1.08T 打平更大預算的資料配方與 ablation |
| 5 | [OLMo 3 與 LLM360：完全開放的預訓練](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining) | checkpoint 級透明與完全復現 |
| 6 | [什麼時候該從零訓練 LLM](/posts/ai/2026-09-06-when-to-train-llm-from-scratch) | 決策框架：把錢花在微調與 RAG 的對照 |

## 怎麼讀

- **動手派**：order 1（MiniMind）→ 2（Karpathy）→ 3（中文社群）。照著 README 跑一遍，你會有「從零」自己的模型的第一手感覺。
- **研究派**：order 4 → 5。想要更扎實的底子，先讀 [CS336 課程導覽](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)——本系列的參照課程——再回來看實務上的成本與公開程度。
- **決策者／預算管理者**：直接讀 order 6 的決策框架，再回頭補需要的個案。

每篇獨立可讀；但弧線的順序就是成本數量級與資料複雜度漸進，照著走最省力。

## 整體來說

這條光譜兩端回答的是不同問題：MiniMind 證明「便宜可以教學」，OLMo3/LLM360 證明「貴可以驗證」——共同點是「公開」，只是公開的對象不同（程式碼 vs 資料＋log）。本系列已上線的第一篇是 [MiniMind](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)，接下來沿著價量向上走，最後一篇再談「什麼時候別花這些錢」。站上的 [CS336 系列](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch) 與 [OLMo：AI 的完全開放](/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm) 舊文，分別給了理論基礎與前一代專案的全貌；[Marin 535B 單飛篇](/posts/ai/2026-08-24-marin-535b-hero-run) 則展示了個人跑極限的另一條路。先讀哪一篇都行，但我們建議從 [MiniMind](/posts/ai/2026-09-06-minimind-train-llm-from-scratch) 開始，因為它是唯一一篇「你今晚就能跟著做」的。

## 參考資料

- [MiniMind GitHub](https://github.com/jingyaogong/minimind)
- [karpathy/nanochat GitHub](https://github.com/karpathy/nanochat)
- [karpathy/llm.c](https://github.com/karpathy/llm.c)
- [Llama-Factory](https://github.com/hiyouga/LLaMA-Factory)
- [YuLan-Mini GitHub（RUC-GSAI）](https://github.com/RUC-GSAI/YuLan-Mini)
- [OLMo GitHub（AI2）](https://github.com/allenai/OLMo)
- [Olmo-3-1125-32B model card（Hugging Face）](https://huggingface.co/allenai/Olmo-3-1125-32B)
- [LLM360 K2 訓練程式碼（k2-train）](https://github.com/LLM360/k2-train)
- [SmolLLM3-3B model card（Hugging Face）](https://huggingface.co/HuggingFaceTB/SmolLM3-3B)
- [TinyLlama GitHub（jzhang38）](https://github.com/jzhang38/TinyLlama)
- [Pythia GitHub（EleutherAI）](https://github.com/EleutherAI/pythia)
- [baby-llama2-chinese GitHub](https://github.com/DLLXW/baby-llama2-chinese)
- [ChatLM-mini-Chinese GitHub](https://github.com/charent/ChatLM-mini-Chinese)
- [Steel-LLM GitHub](https://github.com/zhanshijinwat/Steel-LLM)