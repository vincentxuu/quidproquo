---
title: "YuLan-Mini：1.08T tokens 怎麼榨出 2.4B 參數的旗艦小模型"
date: 2026-09-06
category: ai
type: deep-dive
tags: [yulan-mini, llm, pre-training, training, open-source, data-curation, annealing]
lang: zh-TW
series:
  name: "從零訓練一個 LLM"
  order: 4
tldr: "YuLan-Mini 是中國人民大學 AI Box 實驗室用 48 張 A800 訓出來的 2.4B 開源模型：只餵 1.08T tokens，MATH-500 拿 37.8、HumanEval 64.0，數學與程式能力壓過用了 7T–18T tokens 的 Qwen2/Qwen2.5 同級模型。它公開的不是口號，是每個階段的資料配比、退火前的 optimizer 狀態、連消融實驗的 W&B logs。"
description: "深度解析 YuLan-Mini：資料清理管線與課程設計、訓練穩定性工程、退火階段的資料選擇與長上下文訓練，以及小團隊如何用有限算力榨出性能。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining-en)

如果說上一篇的 [MiniMind](/posts/ai/2026-09-06-minimind-train-llm-from-scratch) 回答的是「一個人、一張卡能不能走完訓練流程」，這篇的 [YuLan-Mini](https://github.com/RUC-GSAI/YuLan-Mini) 回答的是另一個問題：**一個大學實驗室、幾十張卡，能不能訓出接近工業水準的模型**。答案是能——2.42B 參數、只用 1.08T tokens 預訓練，MATH-500 拿 37.8 分、HumanEval pass@1 64.0 分，對比訓練量 7T 到 18T tokens 的 Qwen2、Qwen2.5 同級模型，在數學與程式這兩項反而是 YuLan-Mini 領先（依[技術報告](https://arxiv.org/abs/2412.17743)論文自己的評測）。論文其後獲 ACL 2025 Main Conference Oral。

「資料效率」在這裡不是形容詞，而是三件可以拆開看的事：**把 1.08T tokens 這個預算花在哪**（資料清理、合成與課程設計）、**怎麼讓訓練過程不炸掉**（穩定性工程）、**最後 80B tokens 怎麼衝刺**（退火階段的資料選擇與長上下文）。

## 定位：認真的訓練，不是教學玩具

先講清楚它跟 MiniMind 的差別——兩者常被並列成「小模型開源專案」，但根本不是同一種東西：

- **MiniMind 的 64M 模型在任何實際任務上都不堪用**，它的價值是讓你讀懂每一行程式碼；YuLan-Mini 的目標是同等級模型中的頂尖性能。
- **算力差三個數量級**：MiniMind 是一張 3090 跑 2 小時；YuLan-Mini 用 56 張 A800（後來降到 48 張）跑了超過 1T tokens，資源受限到只做得出 28K 上下文。
- 但兩者共用同一套價值觀：**全部公開**。MiniMind 公開訓練資料集，YuLan-Mini 走得更遠——每個課程階段的資料組成、27 個階段的中間 checkpoint、退火前的 optimizer 狀態，連六組消融實驗的 [W&B 訓練日誌](https://wandb.ai/yiwen_hu/YuLan-Mini)。程式碼、權重、optimizer 狀態都是 MIT 授權。

它也不是從零發明技術：WSD 排程來自 MiniCPM、8% 退化比例的估計來自 Tissue et al. 的 scaling law 研究、退化階段資料選擇基於 LESS——YuLan-Mini 的增量是把既有技術組合成「有限算力下可執行的完整配方」，並寫清楚每個環節的取捨。整個策略本質上是在 [Scaling Laws](/posts/ai/2026-08-26-understanding-ai-models-scaling-laws) 預算表的約束下做最佳化。

## 資料流程：1.08T tokens 花在哪

總量 1.08T tokens 的組成（依論文 Table 4）：網頁資料約 560B、程式碼 202B、數學 85B，其餘是一般知識、書籍、百科與開源指令資料；自製的合成資料合計 32B。所有來源都是公開資料集——FineWeb-Edu、the-stack-v2、OpenWebMath、Chinese-FineWeb-Edu 等——加上自己合成的部分。沒有任何簽 NDA 的內部資料，這是「大學實驗室可複現」的前提。

資料清理管線分六步，比較特別的兩步：

- **主題召回**：訓練 fasttext 與 TinyBERT 分類器，從 FineWeb-Edu 和 DCLM 的網頁語料裡撈出數學（10.4B tokens）、程式（1.11B）、推理（1.01B）相關文本，既直接進訓練集，也當合成資料的種子。
- **品質評分**：沿用 FineWeb-Edu 官方的 fineweb-edu-scorer 給網頁與數學文本打分，捨棄 1–2 分、啟發式排序 3–5 分。有個細節值得學：評分模型刻意只認中小學程度的內容，避免模型偏愛 arXiv 摘要這類「看起來高級」但資訊密度低的文本。

**課程設計**是整個管線的骨架：訓練切成 27 個連續的課程階段，每階段 40B tokens。數學和程式碼資料按難度遞增排列（依教育程度評分，低分代表更難的專業內容）；網頁資料反而**不做**課程排序——實驗發現按教育程度分階會嚴重破壞原本的分佈。每過一個階段，依模型的 benchmark 表現微調下一階段的資料比例，但相鄰兩階段的變動被強制壓在 3% 以內，避免分佈突變造成 loss spike。整個穩定訓練期間，指令資料占比不超過 5%——先把地基打好，指令型資料留到後面。

## 合成資料：o1 式長思考與形式數學

最關鍵的增量是自製的 32B tokens 合成資料，其中三類最值得看：

- **o1 式長思考**：從比較難的數學題（NuminaMath 等）出發，用 slow-thinking 模型 QwQ-32B-Preview 蒸餾長篇思考過程（出自團隊的 o1 復現專案），而且**預訓練階段**就混入，不等後訓練才教模型推理。
- **形式數學**：加入 Lean 定理證明資料（DeepSeek-Prover、Lean-GitHub、Lean-Workbook），並受 LIME 啟發做演繹、溯因、歸納三種推理原語的增強，讓模型學「從證明狀態推 tactic」而不是背證明。
- **反思資料**：故意取模型的錯誤回答，用 Qwen2.5-Math-7B-Instruct 找出第一步錯誤、截斷之後，再生成錯誤分析與銜接語句，把「錯 → 糾正 → 對」整條軌跡變成訓練樣本，base model 本身就學會自我修正。

程式碼用 ICL 擴充 LeetCode 題目、OSS-Instruct 生成真實任務；科學推理從入學考試與 camel-ai 收難題，同樣用 QwQ 蒸餾。合成資料與生成 prompt 都開源在 [HuggingFace 集合](https://huggingface.co/collections/yulan-team/yulan-mini-676d214b24376739b00d95f3)上。

## 穩定性：讓學習率 0.01 撐得住

YuLan-Mini 用了一個激進的設定：全域學習率 0.01，比常見值大幾倍。理由是論文的核心判斷——**大學習率訓出來的模型在退化階段有更大的提升空間**。但 0.01 之下 loss spike 幾乎必然發生，他們把穩定性當成系統工程問題來解：

1. **監控指標不是 loss 而是 hidden states**。用 0.2B 代理模型實驗發現：hidden states 變異數與梯度範數會在 loss 還正常時持續增長，等 loss spike 已經來不及。
2. **μP 式初始化 + WeSaR 重參數化**。μP 讓超參數從小模型遷移到大模型時不用重調（CerebrasGPT、MiniCPM 已驗證）；WeSaR 給每個權重矩陣加一個可學習的縮放參數，把梯度範數和梯度方向解耦，壓住大學習率下持續更新造成的偏移。
3. **該捨棄的就捨棄**。QK LayerNorm 確實能壓住 attention logits 爆炸，但訓練時間增加 34%——其他方法已經夠穩，就不用。這種「驗證過但不用」的記錄比只報成功方法有用得多。

## 退火：最後 80B tokens 的衝刺

WSD 排程下，穩定訓練用 990B tokens、退化階段只用 80B——**占總預算 8% 的資料，卻是性能躍升的主戰場**。退火前的 checkpoint 在 GSM8K 只有 29.9 分，退火後直接翻倍到 68.5。具體做了四件事：

- **學習率退化函數選 1-sqrt**：實測比線性和 cosine 都好。
- **資料選擇**：退化階段的資料組成完全不同——指令資料占比拉到近 20%（程式占大宗），並用梯度式資料選擇（加速版 LESS + InsTag）挑高品質樣本。前面課程階段刻意把指令資料壓在 5% 以下，就是為了讓模型吃下這個突變。
- **長上下文**：RoPE 基頻從 10,000 調到 490,000，上下文從 4K 擴到 28K。並用遮罩的跨文件注意力加上 upsample 的書籍與拼接 GitHub 程式碼當長文本，保住短文本能力。
- **checkpoint 合併**：仿 Llama 3，把退化階段最後幾個 checkpoint 平均——單項分數可能略降，但整體更均衡。

背後的觀察是：學習率下降時模型學新東西最快，同樣的資料早餵是浪費、晚餵是杠杆。他們連退火前的 optimizer 狀態都開源了，你可以從 checkpoint 接著用**自己的資料**跑退化。

## 整體來說

YuLan-Mini 證明的事：1.08T tokens、公開資料、大學實驗室級算力，做出 MATH-500 37.8、HumanEval 64 的 base model——同等級的工業模型用的資料量是它的 7 到 18 倍。代價也寫在論文裡：長上下文能力平庸（RULER 明顯落後 Qwen2.5），通用知識也比不上 Qwen2.5-1.5B。它把有限預算集中押在數學與程式上，這是取捨不是魔法。

對小團隊的實際意義是：**算力不夠時，槓桿在資料端而不是模型端**——清理管線、課程設計、合成資料、退化階段的資料選擇，每一項都不需要買更多 GPU。而且開源的不只終點：中間 checkpoint 配訓練資料可以研究能力怎麼長出來，退火前 checkpoint 配 optimizer 狀態可以直接接手做自己的實驗。

這條「用資料效率對抗算力差距」的路線，下一篇的 [OLMo 3 與 LLM360](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining) 會從完全開源的角度再看一次；如果想看中文社群怎麼做小模型訓練，往回讀[中文社群小模型訓練實踐](/posts/ai/2026-09-06-chinese-community-small-llm-training)。

## 參考資料

- [YuLan-Mini GitHub（RUC-GSAI）](https://github.com/RUC-GSAI/YuLan-Mini)
- [YuLan-Mini: An Open Data-efficient Language Model（arXiv:2412.17743）](https://arxiv.org/abs/2412.17743)
- [YuLan-Mini HuggingFace 集合（模型、資料集、分類器）](https://huggingface.co/collections/yulan-team/yulan-mini-676d214b24376739b00d95f3)
- [消融實驗 W&B 訓練日誌](https://wandb.ai/yiwen_hu/YuLan-Mini)
- [MiniMind：用 3 塊錢從零訓練一個 LLM（本系列 order 1）](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)
- [Scaling Laws：模型要多大才夠（本站）](/posts/ai/2026-08-26-understanding-ai-models-scaling-laws)
