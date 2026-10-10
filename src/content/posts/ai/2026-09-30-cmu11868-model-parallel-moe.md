---
title: "CMU 11-868 L16–L17：模型放不進一張卡時，切層、切矩陣，還是切專家"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, distributed-training, parallelism, moe, gpu]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 12
tldr: "CMU 11-868 在 2026 春季用兩講回答「模型太大，一張 GPU 放不下」：L16 講切層的 pipeline parallelism（GPipe 的 micro-batch、1F1B、交錯 stage）和切矩陣的 tensor parallelism（Megatron-LM 對 FFN、attention、embedding 的切法），結論是節點內用 TP、跨節點用 PP、再外面疊 DP；L17 把 MoE 當成第三種切法——每張卡放不同的專家、其餘部分複製，代價換成 all-to-all 通訊與負載平衡，並以 GShard、DeepSpeed-MoE、DeepSeek-V3 的設計逐一說明。"
description: "CMU 11-868 LLM Systems（Spring 2026）L16 Model Parallel Training 與 L17 System for MoE Models 導讀：naive pipeline 的閒置問題、GPipe micro-batch 與 bubble、gradient checkpointing、PipeDream 1F1B、Megatron-LM 交錯排程與 tensor parallelism、TP／PP／DP 的組合原則，以及從「切專家」角度看 MoE 的 expert parallelism、all-to-all、負載平衡損失、DeepSpeed-MoE 推論優化與 DeepSeek-V3 的 MoE 設定。"
draft: false
glossary:
  - term: "pipeline bubble"
    aliases: ["管線氣泡", "bubble"]
    definition: "pipeline parallelism 中，某些裝置在等待上游輸出或下游梯度而閒置的時間。GPipe 用把 batch 切成 micro-batch 的方式縮小它。"
    context: "L16 給的 bubble 比例是 O((K−1)/(M+K−1))，K 是切分數、M 是 micro-batch 數。"
  - term: "expert parallelism"
    aliases: ["專家平行", "EP"]
    definition: "把 MoE 層裡不同的專家放到不同裝置上，非專家部分（attention、embedding）在每張卡複製；token 依 router 的決定透過 all-to-all 送到專家所在的裝置。"
    context: "L17 引 GShard 作為這個做法的代表。"
  - term: "all-to-all"
    definition: "一種集體通訊：每個參與者都把自己資料的不同片段分別送給每一個其他參與者。MoE 用它把 token 分派到專家，再把結果收回。"
    context: "L17 指出 expert parallelism 需要快速的 all-to-all，其延遲隨裝置數線性增加。"
---

> 🌏 [English version](/en/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> **本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 的 2026 春季版。** 這是 [CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)系列的第 12 篇。上一篇講[資料平行](/posts/ai/2026-09-30-cmu11868-data-parallel-training)：每張卡放一份完整模型、分資料。本篇處理資料平行解決不了的情況：**一份完整模型就放不進一張卡。**

這兩講對應 [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 第 10 週：3/16 的「Distributed Model Training III」（[L16 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-16-model-parallel-83b41612547620ee0e172caa1ee448ed.pdf)，36 頁）與 3/18 的「Large models with Mixture-of-Expert」（[L17 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-17-MoE-3aa3125f9ccdd4bb7109ef077fbe9260.pdf)，38 頁），講者都是 Lei Li。官方課表未列本課公開錄影連結，以下只根據投影片與 Syllabus 列的 reading；頁碼指 PDF 頁碼（兩份投影片角落印的編號在後半段都比 PDF 頁碼大一到三號）。

## 課程影片來源

已核對 Spring 2026 官方 Syllabus：各講公開列出 slides、reading 與 homework，未列對應講次的公開錄影連結。本文因此以投影片、論文或作業導讀，沒有對應講次播放器；這項結論只限官方公開頁面，不代表校內沒有錄影。

官方來源：

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

查核日期：2026-10-10。

## 先看全貌：三種切法

L16 第 4 頁把 model parallel 定義為「把模型的計算（forward、backward、update）分到多個 worker」，並分成兩種：按層分（distributed layer-wise）和按張量分（distributed tensor）。同一頁的註腳說更進階的 expert parallelism 留到之後，也就是 L17。

| 切法 | 切的是什麼 | 每張卡存什麼 | 主要代價 | 本課代表論文 |
|---|---|---|---|---|
| Pipeline parallelism | 層（水平切） | 一段連續的層 | bubble（閒置）、activation 記憶體 | [GPipe](https://arxiv.org/abs/1811.06965)、PipeDream |
| Tensor parallelism | 一個矩陣乘法 | 每層權重的一部分 | 每層都要集體通訊，通常限節點內 | [Megatron-LM](https://arxiv.org/abs/2104.04473) |
| Expert parallelism | MoE 層的專家 | 部分專家＋複製的其他部分 | all-to-all、負載不平衡 | [GShard](https://openreview.net/forum?id=qrwe7XHTmYb)、[DeepSpeed-MoE](https://arxiv.org/abs/2201.05596) |

這張表是我依兩份投影片整理的，不是投影片原圖。

## L16 上半：切層的 pipeline parallelism

### 場景：天真的切法只有一張卡在工作

第 5 頁的 naive model parallel 把第 0 到 3 層放在 dev0 到 dev3，前一張卡算完，用 NCCL send/recv 把輸出交給下一張。投影片接著問「有什麼缺點？」，答案寫在同一頁：**任何時刻都只有一張 GPU 在算，其他全部閒置。**

第 8 頁列出 naive pipeline 的三個限制：

1. GPU 使用率低：同一時間只有一個裝置在工作
2. 計算和通訊沒有重疊：傳中間結果給下一張卡時，GPU 也在等
3. 記憶體需求高：第一張 GPU 要保留所有 activation，直到整個 batch 做完

### 直覺：把一個 batch 切成很多小份輪流送

[GPipe](https://arxiv.org/abs/1811.06965)（第 9–11 頁）的想法是把 mini-batch 切成更小的 micro-batch。第一張卡算完第一份 micro-batch 就立刻往下送，接著算第二份；這樣下游的卡很快就有事做。投影片特別說明兩件事：batch 大小通常由 GPU 記憶體決定、越大越好；micro-batch 則可以小很多。GPipe 的排程是**所有 micro-batch 先做完 forward，再開始 backward**。

### 機制：bubble、通訊、記憶體三筆帳

第 11 頁用三個符號算帳：K 是切分數（也就是裝置數），M 是 micro-batch 數，L 是層數。

- **Bubble 比例** 是 O((K−1)/(M+K−1))。投影片說當 M > 4 × K 時可以忽略。
- **通訊** 只發生在切分邊界：傳遞 activation 張量。
- **Activation 峰值記憶體** 從 O(N × L) 降到 O(N + L/K × N/M)，前提是搭配 gradient checkpointing。

第 13–14 頁補上 gradient checkpointing（引 Chen et al. 2016）。一般 backprop 的 activation 記憶體是 O(n)、計算 O(n)；極端省記憶體的做法只存 O(1)，但計算變成 O(n²)。折衷是每隔 √n 層存一次 activation，backward 時從最近的存檔點重算，計算量維持 O(n) 等級。在 GPipe 裡，每張卡 forward 時只存輸出 activation，backward 時重算自己那一段。

### 兩個改進：1F1B 與交錯 stage

第 15 頁指出 GPipe 還剩一個問題：先做完所有 forward，代表同時「在途」（forward 做完、backward 還沒做）的 micro-batch 很多，投影片的例子是 8 份，這 8 份的 activation 全都要存。

- **1F1B**（第 16 頁，PipeDream-Flush，Narayanan et al. SOSP 2019）：一有機會就開始 backward，一個 forward 接一個 backward。在途 micro-batch 在投影片的例子裡最多 4 份（假設 backward 花 forward 的兩倍時間），GPipe 是 8 份。省下的是 activation 記憶體。
- **交錯 stage**（第 17 頁，引 [Megatron-LM SC 2021](https://arxiv.org/abs/2104.04473)）：把層切成更小的 chunk，每張卡負責不連續的兩段。例如 16 層、4 張卡時，Device 1 拿第 1–2 層和第 9–10 層。每個 chunk 的計算量變小，一個 batch 裡每張卡會輪到兩次 forward／backward stage。論文摘要說這個交錯排程能提升 10% 以上的吞吐量，記憶體用量和既有做法相當。

<details>
<summary>投影片的程式碼：GPipe 排程與 PyTorch pipelining（第 18–24 頁）</summary>

第 18–20 頁引用 [shallowspeed](https://github.com/siboehm/shallowspeed) 的 `minibatch_steps`：先對所有 micro-batch `yield` forward 指令，再倒序 `yield` backward 指令，最後才 `OptimizerStep()`。forward 指令裡，第一個 stage 從磁碟讀 micro-batch，其他 stage 先 `RecvActivations()`，非最後 stage 做完再 `SendActivations()`（投影片標註為 non-blocking）。backward 則在最後一份 micro-batch 時把 backprop 和 AllReduce 交錯執行，其餘只累積梯度。

第 21–24 頁示範 PyTorch 的 [`torch.distributed.pipelining`](https://pytorch.org/docs/main/distributed.pipelining.html)：先在 meta device 上建整個 Transformer，依 stage 刪掉不需要的層，包成 `PipelineStage`；再用 `ScheduleGPipe(stage, n_microbatches)` 建排程，rank 0 呼叫 `schedule.step(x)` 餵整個 batch，會自動切成 micro-batch。

</details>

## L16 下半：切矩陣的 tensor parallelism

### 場景與直覺

第 26 頁從一個矩陣乘法 A × B = C 開始。把 B 按欄切成 B1、B2，分給兩張卡，各自算出 C1、C2，最後用 AllGather 拼回 C。切法的選擇決定了要在哪裡通訊。

### 機制：Transformer 各部分怎麼切

- **FFN**（第 27–28 頁）：若把輸入 X 和第一個權重 A 都切開，要 all-reduce 才能得到 XA，GeLU 之前就得同步。Megatron 的切法是把 A 按欄切成 [A1, A2]、把 B 按列切成 [B1; B2]。這樣兩張卡各自算 GeLU(X·A1)、GeLU(X·A2)，**算 Y 時不需要 all-reduce**；最後 Z = Y1·B1 + Y2·B2 才合併。
- **Self-attention**（第 29 頁）：權重按欄切，也就是按 head 切，投影片標注不需要 all-reduce。
- **Embedding**（第 30 頁）：輸入 embedding 按欄切，需要 all-reduce；輸出 embedding 也按欄切，並把輸出和 cross-entropy loss 融合，投影片說這能大幅減少通訊，但仍需 all-gather。
- **LayerNorm、dropout、residual**（第 31 頁）：每張卡各存一份，各自最佳化自己那份參數。

### 組合原則

第 32–34 頁引 Megatron-LM 的兩條 takeaway：

1. 用 g 張 GPU 的伺服器時，tensor parallelism 最多開到 g，再往上用 pipeline parallelism 跨伺服器擴展。投影片的一句話是「TP 用在節點內」。
2. 同時用資料平行和模型平行時，模型平行的總規模 M = t · p（t 是 TP 度、p 是 PP 度）要足以讓參數和中間資料放進 GPU 記憶體；再用資料平行擴展到更多 GPU。

第 32 頁另外說明，PP 和 TP 的度數取決於模型架構與 GPU 伺服器配置。L16 的總結（第 35 頁）把兩者對照：PP 是按層水平切，重點在消除 bubble、交錯 forward／backward；TP 是把矩陣計算分到多張 GPU，通常在單一節點內。

## L17：MoE，第三種切法

### 為什麼要 MoE

L17 第 3–4 頁的論證是：dense 模型越來越難擴展，運算量是訓練巨型模型的主要瓶頸；sparse 模型能在不增加訓練成本的情況下提高模型品質，MoE 是其中一種。投影片列出的好處是預訓練比 dense 模型快得多，推論也比參數量相同的 dense 模型快。

第 5 頁的定義：把 Transformer 的 FFN 換成多個小專家（每個專家是一個 FFN 之類的網路），再加一個 gating network 依每個 token 選要啟用哪個專家。投影片提醒不要和另一種同名的學習演算法（學多個預測器的加權平均）搞混。

建模細節（router 的公式、[Switch Transformer](https://arxiv.org/abs/2101.03961) 的 top-1 路由、共享專家的由來）本篇只帶到系統需要的程度。第 6–13 頁的要點：

- Switch Transformer 裡一個 token 只經過一個被選中的 FFN（第 6 頁），gating 用 top-k（第 7 頁）
- 共享專家（第 8 頁）：一個永遠都會經過的共享 FFN 負責共通知識，路由專家負責 token 專屬的知識。投影片說這個設計先出現在 DeepSpeed-MoE，後來 DeepSeek MoE 也採用
- 每一層啟用的專家不同（第 9 頁）
- 參數怎麼算（第 10 頁）：Mixtral 8x7B 不是 56B，而是 47B，因為只有 FFN 是專家，attention 和 embedding 是共用的

想看 MoE 的建模面，可以讀本站的 [CS336 attention 與 MoE 導讀](/posts/ai/2026-08-22-cs336-attention-moe)和 [MoE 架構為什麼會贏](/posts/ai/2026-08-26-moe-architecture-why-it-wins)。

### 機制：expert parallelism

第 15–16 頁引 GShard（Lepikhin et al., ICLR 2021）說明訓練 MoE 的方式：

1. **每張卡放一個專家**（Expert 1 在 GPU1，依此類推）
2. **其他部分全部複製**：embedding、attention、router 每張卡都有
3. **兩次 all-to-all**：router 決定每個 token 去哪個專家後，用 all-to-all 把 token 分派到專家所在的卡（dispatch），專家算完再用 all-to-all 把結果送回原來的卡

第 17 頁用兩個 batch（「red fox sits」「the weather is」）示範：每個 token 在每一層都可能跑到另一張卡上的專家，KV cache 則留在原本那張卡。第 18 頁補充 GShard 並不是每層都用 MoE，而是**每隔一層**用一次。

把它和 L16 對照就清楚了：expert parallelism 不需要 pipeline 的 micro-batch 排程，也不需要 TP 那樣每層切矩陣；它把「放不下」的問題轉成「token 要跨卡旅行」的問題。所以投影片第 15 頁直接寫：需要快速的 all-to-all 通訊。

### 負載平衡

如果 router 把大部分 token 都送給少數專家，這些專家所在的卡就會塞車，其他卡閒著，投影片稱之為 routing collapse。第 19 頁的 expert-level balance loss 是：

<details>
<summary>公式：expert-level balance loss（L17 第 19 頁）</summary>

$$L_{\text{ExpBal}} = \alpha_1 M \sum_{i=1}^{M} f_i P_i,\quad f_i = \frac{\#\text{tokens to expert } i}{\#\text{tokens}},\quad P_i = \frac{1}{\#\text{tokens}}\sum_{t} s_{i,t}$$

M 是專家數，$s_{i,t}$ 是 token t 給專家 i 的 routing weight。$f_i$ 是實際分到的比例，$P_i$ 是平均路由機率；兩者都集中在同一個專家時，損失最大。

</details>

第 30 頁的 DeepSeek 版本多了一層 **device-level balance loss**：把專家分組，用每組的平均 $f$ 和 $P$ 的總和算同樣形式的損失，目的是讓各裝置的計算量平衡，而不只是各專家。這正是從「切專家」角度看 MoE 會多出來的考量：平衡的單位最終是卡，不是專家。

### 推論：DeepSpeed-MoE 的系統設計

第 20 頁列出 MoE 推論效能取決於三件事：模型總大小、啟用多少專家、整體記憶體頻寬。預設做法是把所有專家都放在 GPU 記憶體裡，需要很大的記憶體。

第 21–24 頁引 [DeepSpeed-MoE](https://arxiv.org/abs/2201.05596)（Rajbhandari et al. 2022）的設計目標：**縮短每張卡的 critical data path，最大化可達成的總記憶體頻寬。** 具體做法：

- **Expert slicing 加 tensor slicing**（第 22 頁）：分到同一個專家的 token 放在同一條 critical data path 上，不同專家的 token 群用 expert parallelism 分到不同卡；非專家參數（attention）用 tensor parallelism 切，通常在節點內；外面再疊資料平行
- **Kernel 優化**（第 23 頁）：把 gating function 融合成單一 kernel，用 dense 的 token-to-expert 對照表。投影片寫 MoE kernel 相關延遲降低超過 6 倍
- **All-to-all 優化**（第 24 頁）：expert parallelism 的 all-to-all 延遲隨裝置數線性增加。對策是階層式 all-to-all（減少通訊跳數），以及依模型的平行策略安排通訊時機

DeepSpeed-MoE 論文摘要給的整體數字是：推論延遲與成本比既有 MoE 推論方案好 7.3 倍；和品質相當的 dense 模型相比，推論快最多 4.5 倍、便宜 9 倍。

### DeepSeek-V3：細粒度專家加共享專家

第 28 頁講 [DeepSeekMoE](https://arxiv.org/abs/2401.06066) 的兩個設計：把每個 FFN 切成更小的專家（細粒度專家），並同時用共享專家與路由專家，對路由專家取 top-k 加權平均。論文摘要說 DeepSeekMoE 16B 能以約 40% 的計算量達到和 LLaMA2 7B 相當的表現。

第 29 頁列出 DeepSeek-V3（投影片標 670B）的 MoE 設定，來源是官方 [inference/model.py](https://github.com/deepseek-ai/DeepSeek-V3/blob/main/inference/model.py)：

| 設定 | 值 |
|---|---|
| 詞表 | 129,280 |
| 隱藏維度 | 7,168 |
| 層數 | 61（最底下 3 層是 dense） |
| Attention head 數 | 128（MLA） |
| Dense FFN 中間維度 | 18,432 |
| MoE 專家中間維度 | 2,048 |
| 共享專家 | 1 |
| 路由專家 | 256 |
| 每個 token 啟用的路由專家 | 8 |
| 專家分組數／限制組數 | 8／4 |

第 31 頁提到 DeepSeek 釋出的兩個函式庫：專為 MoE 與 expert parallelism 設計的通訊庫 [DeepEP](https://github.com/deepseek-ai/DeepEP)，以及專家平行負載平衡器 [EPLB](https://github.com/deepseek-ai/EPLB)。第 33–36 頁則逐段帶讀 [DeepSpeed 的 MoE 教學](https://www.deepspeed.ai/tutorials/mixture-of-experts/)與 [`deepspeed/moe/layer.py`](https://github.com/microsoft/DeepSpeed/blob/master/deepspeed/moe/layer.py)。

## 怎麼做：沒修課也能練的三件事

1. **自己算一次 bubble**：取 K = 4，把 M 從 1 調到 32，用 (K−1)/(M+K−1) 畫一條曲線，看它在 M = 16（也就是 4K）時降到多少，再想想 micro-batch 變小對單張卡的計算效率有什麼影響。
2. **手推一次 Megatron 的 FFN 切法**：用 NumPy 隨機產生 X、A、B，把 A 按欄、B 按列切成兩半，驗證 GeLU(X·A1)·B1 + GeLU(X·A2)·B2 等於未切分的結果；再試試把 A 按列切，看看為什麼 GeLU 之前就得同步。
3. **讀一次 DeepSeek-V3 的 `model.py`**：只找 `Gate` 和 `MoE` 兩個類別，對照上面的設定表，找出 top-k、分組路由和共享專家各在哪幾行。

## 延伸閱讀

- 系列上一篇：[L14–L15 分散式訓練與資料平行](/posts/ai/2026-09-30-cmu11868-data-parallel-training)
- 系列下一篇：[L18 ZeRO：分散式訓練的記憶體優化](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization)
- 本講的實作：[HW5：資料平行與管線平行](/posts/ai/2026-09-30-cmu11868-hw5-distributed-training)
- 站內：[CS336 平行化機制](/posts/ai/2026-08-22-cs336-parallelism-mechanics)、[CS336 平行化策略](/posts/ai/2026-08-22-cs336-parallelism-strategies)
- 站內：[CS336 attention 與 MoE](/posts/ai/2026-08-22-cs336-attention-moe)、[MoE 架構為什麼會贏](/posts/ai/2026-08-26-moe-architecture-why-it-wins)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- 課程：[CMU 11-868 LLM Systems Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)（3/16、3/18 講題與 reading）
- 投影片：[L16 Model Parallel Training](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-16-model-parallel-83b41612547620ee0e172caa1ee448ed.pdf)、[L17 System for MOE Models](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-17-MoE-3aa3125f9ccdd4bb7109ef077fbe9260.pdf)
- 論文：[Huang et al., GPipe](https://arxiv.org/abs/1811.06965)、[Narayanan et al., Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM](https://arxiv.org/abs/2104.04473)（交錯排程提升 10% 以上吞吐量）
- 論文：[Lepikhin et al., GShard（OpenReview）](https://openreview.net/forum?id=qrwe7XHTmYb)、[arXiv 版](https://arxiv.org/abs/2006.16668)、[Fedus et al., Switch Transformers](https://arxiv.org/abs/2101.03961)
- 論文：[Rajbhandari et al., DeepSpeed-MoE](https://arxiv.org/abs/2201.05596)（7.3 倍、4.5 倍、9 倍等數字）、[Dai et al., DeepSeekMoE](https://arxiv.org/abs/2401.06066)（16B 對 LLaMA2 7B、約 40% 計算量）
- 程式：[DeepSeek-V3 inference/model.py](https://github.com/deepseek-ai/DeepSeek-V3/blob/main/inference/model.py)、[DeepEP](https://github.com/deepseek-ai/DeepEP)、[EPLB](https://github.com/deepseek-ai/EPLB)、[DeepSpeed MoE 教學](https://www.deepspeed.ai/tutorials/mixture-of-experts/)、[shallowspeed](https://github.com/siboehm/shallowspeed)、[PyTorch pipelining 文件](https://pytorch.org/docs/main/distributed.pipelining.html)
