---
title: "MIT 6.5940 L19–L20 分散式訓練：記憶體不夠就切模型，頻寬不夠就壓梯度"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, distributed-training, parallelism, zero]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 22
tldr: "GPT-3 的 fp16 權重就要 350GB，一張 80GB 的 A100 放不下，更別說梯度和 Adam 狀態。L19 講怎麼切：資料平行、ring all-reduce、ZeRO-1/2/3（每張卡能訓練的模型從 5B 推到 320B）、GPipe 把 pipeline 利用率從 25% 提到 57%、Megatron 式 tensor parallelism、Ulysses 與 Ring Attention 的 sequence parallelism。L20 講切完之後的通訊瓶頸：Alpa 自動搜平行策略、DGC 把梯度壓 277–608 倍還不掉精度、TernGrad 把梯度量化成三值，以及用延遲更新蓋掉網路延遲的 DGA。"
description: "MIT 6.5940 Fall 2024 第 19、20 講 Distributed Training 導讀：資料、管線、張量、序列四種平行；parameter server 與 all-reduce 的頻寬比較；ZeRO-1/2/3 與 FSDP 的記憶體算式；GPipe micro-batch；Megatron-LM 的 FFN 與 attention 切法；DeepSpeed Ulysses 與 Ring Attention；混合平行與 Alpa；頻寬與延遲瓶頸；Deep Gradient Compression、PowerSGD、1-bit SGD、TernGrad 與 Delayed Gradient Averaging。"
draft: false
glossary:
  - term: "all-reduce"
    aliases: ["AllReduce", "全歸約"]
    definition: "所有 worker 各自持有一份張量，通訊結束後每個 worker 都拿到全部張量的總和（或平均）。資料平行訓練用它同步梯度；ring 實作讓每個節點的頻寬需求不隨節點數成長。"
    context: "MIT 6.5940 L19 投影片第 47、53–57 頁。"
  - term: "ZeRO"
    aliases: ["Zero Redundancy Optimizer", "ZeRO-1/2/3"]
    definition: "DeepSpeed 提出的資料平行記憶體最佳化：把 optimizer state（ZeRO-1）、再加上梯度（ZeRO-2）、再加上權重（ZeRO-3）切成 N 份分散到各張卡，消除每張卡各存一份完整副本的冗餘。PyTorch 的 FSDP 就是 ZeRO-3 的實作。"
    context: "MIT 6.5940 L19 投影片第 68–73 頁。"
  - term: "Deep Gradient Compression"
    aliases: ["DGC", "深度梯度壓縮"]
    definition: "只傳送大小排前面的梯度，其餘累積在本地下次再送；再加上 momentum correction（累積 velocity 而非梯度）、local gradient clipping 與 warm-up，讓 99.9% 的梯度稀疏度下仍能收斂到原本精度。"
    context: "MIT 6.5940 L20 投影片第 26–52 頁，出自 Lin et al., ICLR 2018。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-distributed-training-en)

> **版本說明**：本文依據 [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940) 第 19 講（2024-11-12）與第 20 講（2024-11-14），主要材料是 [Lec19-Distributed-Training-I.pdf](https://www.dropbox.com/scl/fi/85ud2gzrtyllgeqgpv9gs/Lec19-Distributed-Training-I.pdf?rlkey=80t52w3peqqf8oanpc6ojmvnf&st=jn4yxsjy&dl=0)（103 頁）、[Lec20-Distributed-Training-II.pdf](https://www.dropbox.com/scl/fi/c0w7j7dxduuf8ply7lzeb/Lec20-Distributed-Training-II.pdf?rlkey=ynh3yx4jf99nojklt0ki7zh0y&st=vxzkzdt4&dl=0)（76 頁）與兩支錄影（[L19](https://www.youtube.com/watch?v=LcOM-nZdqxw)、[L20](https://www.youtube.com/watch?v=lOVcPooetrM)）。文中「L19 第 N 頁」指 PDF 頁。事實於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片與錄影公開；這兩講沒有對應 lab，校外拿不到的是 Canvas 與 Piazza。
>
> **Fall 2026 對照**：[F26 課表](https://hanlab.mit.edu/courses/2026-fall-65940)保留同樣兩講（Part I 11 月 17 日、Part II 11 月 19 日），課程簡介還把「model serving」加進主題列表。截至 2026-09-30 兩講的投影片與錄影都是空連結。

**系列位置**：上一篇 [L18 高效 Diffusion 模型](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency)｜下一篇 [L21 裝置端訓練與遷移學習](/posts/ai/2026-09-30-mit-65940-on-device-training)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

這兩講開啟官方課程的 Chapter III：Efficient Training。前面十七講都在讓推論變省，現在換成訓練。

L19 第 6 頁的表格說明了為什麼非分散不可：在 A100 上，ResNet-50 訓練要 31 GPU 小時，GPT-3 要 310 萬 GPU 小時，換算下來單卡要 355 年。第 8 頁的算法更直接：10 GPU 天的訓練，理想上 1024 張卡 14 分鐘就能做完。研究週期會因此快很多。

第 10 頁是 HAN Lab 自己的例子：在 Summit 超級電腦上訓練影片模型 TSM，1 個節點（6 張 GPU）要 49 小時 50 分，256 個節點（1536 張 GPU）只要 14 分鐘，精度幾乎不變（74.1% 對 74.0%）。

但「多加幾張卡」會碰到兩個問題，剛好對應兩講：

- **模型放不進一張卡**：要把模型切開（L19）。
- **切開之後卡跟卡要講話**：通訊變成瓶頸（L20）。

## 課程影片來源

影片連結已與本文採用版本的官方課程頁核對。

```youtube
url: https://www.youtube.com/watch?v=LcOM-nZdqxw
title: EfficientML.ai Lecture 19 - Distributed Training Part 1（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=lOVcPooetrM
title: EfficientML.ai Lecture 20 - Distributed Training Part 2（YouTube）
```

原始影片：[EfficientML.ai Lecture 19 - Distributed Training Part 1（YouTube）](https://www.youtube.com/watch?v=LcOM-nZdqxw)、[EfficientML.ai Lecture 20 - Distributed Training Part 2（YouTube）](https://www.youtube.com/watch?v=lOVcPooetrM)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## 四種切法一覽

L19 第 12–31 頁先快速走過四種平行，L20 第 4 頁再把它們的取捨整理成一張表：

| 平行方式 | 切什麼 | 模型副本 | 利用率 | 記憶體成本 | 通訊量 |
|---|---|---|---|---|---|
| Data | 資料 | N 份 | 高 | 高 | 低 |
| Pipeline | 按層切模型 | 1 份 | 低 | 低 | 中 |
| Tensor | 按張量切模型 | 1 份 | 高 | 低 | 高 |
| Sequence | 按 token 切資料 | — | — | — | attention 層額外通訊 |

資料平行的記憶體問題可以用 ZeRO／FSDP 解。表上沒有一種方式三項全贏，所以最後一定是混合（見 L20 段落）。

## 資料平行：從 parameter server 到 all-reduce

第 33–42 頁用 [parameter server（Li et al., OSDI 2014）](https://www.usenix.org/conference/osdi14/technical-sessions/presentation/li_mu) 講資料平行的五個步驟：複製模型給每個 worker、隨機平均切資料、各自算梯度、把梯度推給 server 加總、server 更新權重。第 42 頁指出，和單機相比多了兩個同步點。

第 44–47 頁補通訊原語：send／recv、scatter／gather、reduce／broadcast、all-reduce／all-gather。第 50 頁讓你用這套詞彙重新描述 parameter server：拉模型是 broadcast，推梯度是 reduce。

問題出在頻寬。第 52–53 頁算出，worker 的頻寬需求是 O(1)，但 server 是 O(N)，會隨 worker 數線性成長。能不能不要中央 server？答案是 all-reduce。第 57 頁比較了幾種實作：

| 做法 | 時間 | 單節點峰值頻寬 | 總頻寬 |
|---|---|---|---|
| Parameter server | O(1) | O(N) | O(N) |
| All-reduce，依序 | O(N) | O(N) | O(N) |
| All-reduce，ring | O(N) | O(1) | O(N) |
| All-reduce，全部平行 | O(1) | O(N) | O(N²) |

Ring 把峰值頻寬壓到 O(1)，但要走 N 步。第 58–66 頁的 recursive halving（出自 MPICH 的集體通訊最佳化）讓每個節點依序和距離 1、2、4 的鄰居交換，N 個 worker 只要 log(N) 步就完成。

## ZeRO：資料平行為什麼那麼吃記憶體

第 68 頁：GPT-3 175B 光是 fp16 權重就要 350GB，遠超過 A100 的 80GB，而訓練還要存梯度和 optimizer state。

第 69 頁用 [ZeRO（Rajbhandari et al.）](https://arxiv.org/abs/1910.02054) 的記帳方式算每個參數要幾個 byte：權重 2 bytes、梯度 2 bytes、Adam 的 optimizer state 12 bytes（fp32 權重副本、momentum、variance）。樸素資料平行每張卡都存一份，共 16 bytes，80GB 的卡最多只能訓練 5B 參數的模型。

ZeRO 的想法是把冗餘的部分切成 N 份。第 70–73 頁以 N=64 計算：

| 階段 | 切掉什麼 | 每參數 bytes | 80GB 能訓練的最大模型 |
|---|---|---|---|
| 樸素資料平行 | 無 | 2 + 2 + 12 | 5B |
| ZeRO-1 | optimizer state | 2 + 2 + 12/N | 19B |
| ZeRO-2 | ＋梯度 | 2 + 2/N + 12/N | 36B |
| ZeRO-3 | ＋權重 | (2 + 2 + 12)/N | 320B |

第 73 頁補一句：PyTorch 裡的 ZeRO-3 就是 FullyShardedDataParallel，也就是 FSDP。

## Pipeline parallelism：切層，然後把氣泡填滿

第 75 頁換一個方向：不切資料，改切模型。350GB 分給 8 張卡，每張 43.75GB，放得下。

問題是第 78 頁畫的時間軸：前向要一層傳一層，反向要倒回來，同一時間只有一張卡在算。4 層網路的理論利用率只有 25%。

第 79–80 頁的 [GPipe（Huang et al.）](https://arxiv.org/abs/1811.06965) 把一個 batch 切成 micro-batch，例如 [16, 10, 512] 切成四個 [4, 10, 512]。第一張卡做完第一個 micro-batch 就交出去，接著做第二個，於是多張卡能同時工作。同一個例子裡利用率提到 57%，是原本的 2.5 倍；micro-batch 越多，利用率越高。

## Tensor parallelism：切矩陣，讓每張卡都在算

第 82 頁說，pipeline 就算加了 micro-batch 還是有閒置時間。能不能切得更細？Tensor parallelism 直接把一個權重矩陣切成 N 塊。

第 83–90 頁照 [Megatron-LM（Shoeybi et al.）](https://arxiv.org/abs/1909.08053) 的切法走一遍 Transformer：

- **FFN**：第一個 linear 按**欄**切，輸入 broadcast 給每張卡，各自算出一段；第二個 linear 按**列**切，各自乘完後用一次 all-reduce 加總（第 85–87 頁）。兩層中間不需要通訊。
- **Attention**：QKV projection 按欄切，每張卡拿到一部分 head；softmax(QKᵀ)V 在本地算完，不用通訊；輸出 projection 按列切，最後 all-reduce（第 88–90 頁）。

第 87 頁的結論：只要通訊不是瓶頸，GPU 可以完全被用滿。這個「只要」就是 L20 要處理的事。

## Sequence parallelism：上下文太長時切 token

第 30–31 頁說，資料平行切 batch，sequence parallelism 切 token，後者在上下文超過 100K 時很有用。第 92 頁點出難處：FC 層切 token 跟資料平行沒兩樣，但 attention 的每個 query 要看所有 key 和 value。

投影片給兩個解法：

- **[DeepSpeed Ulysses](https://arxiv.org/abs/2309.14509)**（第 93 頁）：FC 層按 token 切，進 attention 前用 all-to-all 重新分配，改成按 head 切。
- **[Ring Attention](https://arxiv.org/abs/2310.01889)**（第 94–96 頁）：每張卡留著自己的 query，key／value 塊沿著環傳，邊傳邊算。

這和 [L15 長上下文](/posts/ai/2026-09-30-mit-65940-long-context-llm)的主題相連：訓練長上下文模型，瓶頸之一就在這裡。

## L20：混合平行與自動搜尋

L20 第 5–8 頁展示幾種組合：資料平行加 pipeline（DeepSpeed 教學的例子）、pipeline 外層加 tensor 內層（Megatron-LM 的 GPU cluster 訓練）、再加上資料平行的 3D 平行。第 7 頁是 HAN Lab 的 [LongVILA](https://arxiv.org/abs/2408.10188)：節點內頻寬高，用 all-to-all 重新分配；節點之間用 Ring Attention，兩層各用擅長的方式。

組合一多，手動挑策略就變難。第 9 頁把問題重新表述成兩類：inter-operator（像 pipeline，把不同運算放不同卡）與 intra-operator（像 tensor parallelism，把同一個運算切開）。第 10–14 頁的 [Alpa](https://arxiv.org/abs/2201.12023) 分兩層搜：外層用 dynamic programming 切 stage，內層對每個運算子用 0-1 整數規劃挑切法，成本包含計算、通訊與運算子之間的 resharding。第 14 頁的結果是能追平專門手調的系統，比手動 baseline 最多快 8 倍。

## 通訊為什麼是瓶頸：頻寬與延遲是兩回事

第 17–18 頁列出原因：每一步都要同步、模型越大傳越多、節點越多 all-reduce 越久。

第 19–22 頁再把延遲單獨拿出來看。同一個機櫃或同一個資料中心內，延遲幾乎不影響訓練；換成家用無線網路慢 1.4 倍；跨越半個地球則慢 3.5 到 5.8 倍。

第 62–64 頁把兩者分開：**頻寬容易改善，延遲很難**。頻寬可以靠壓縮梯度，也可以升級硬體（家用路由器 100Mbps–1Gbps、光纖交換器 1–25Gbps、InfiniBand 20–400Gbps）。延遲受物理限制：光從上海到波士頓也要 162ms。所以 L20 分兩條路：壓梯度對付頻寬，延遲更新對付延遲。

## 壓梯度之一：剪掉小梯度（DGC）

第 26–28 頁的起點是 [sparse communication（Aji & Heafield 2017）](https://arxiv.org/abs/1704.05021)：只傳大小排前面的梯度，沒傳的留在本地累積下次再送。簡單網路有效，但 ResNet-110 在 CIFAR-10 上掉了 1 個百分點（93.75% 到 92.75%）。

第 29 頁的診斷只有一個詞：**momentum**。第 36–40 頁畫出原因：把累積的梯度直接拿去算 momentum，優化軌跡會和原本的 momentum SGD 對不上。[Deep Gradient Compression（Lin et al.）](https://arxiv.org/abs/1712.01887) 的修正是**累積 velocity，而不是梯度**（第 41–43 頁）。再加上 warm-up：前幾個 epoch 學習率慢慢升，稀疏度也以指數方式慢慢加上去（第 44–46 頁）。

第 47 頁的消融表把每一招的貢獻拆開（8 張 GPU、ResNet-110、CIFAR-10）：

| 設定 | Top-1 |
|---|---|
| Baseline | 92.92 |
| 樸素梯度剪枝 | 不收斂 |
| ＋本地梯度累積 | 91.36 |
| ＋本地累積＋momentum correction | 92.56 |
| ＋本地累積＋warm-up | 91.89 |
| DGC（全部組合） | 93.28 |

第 49–51 頁是壓縮比：AlexNet 的梯度從 232.56MB 壓到 0.39MB（597 倍），VGG 277 倍，語言模型 462 倍，語音辨識 608 倍，精度都沒掉。第 49 頁也自問為什麼到不了 1000 倍：稀疏格式要存索引，bias 也沒有剪。

第 52 頁點出一個實務問題：稀疏梯度在 all-reduce 過程中會越加越密，因為每個節點留下的位置不同。第 53–54 頁的 [PowerSGD](https://arxiv.org/abs/1905.13727) 改用低秩分解，每台機器的矩陣維度一致，就不會變密。

## 壓梯度之二：量化梯度

第 57–60 頁三種做法：

- **1-bit SGD**（Seide et al., 2014）：每個梯度只留正負號，搭配按欄的 scaling factor，量化誤差累積到下一步。
- **Threshold quantization**（Strom, 2015）：用預先選好的門檻 τ 同時當門檻和重建值，同樣累積誤差，但 τ 要靠經驗挑。
- **[TernGrad](https://arxiv.org/abs/1705.07878)**：以 |gᵢ|/max(g) 的機率把梯度量化成 0、+1、−1，期望值等於原梯度，因此不用累積誤差。

第 55 頁把剪枝類方法的差別總結成一句：一般稀疏化只能到低稀疏度；DGC 靠 momentum correction、梯度裁剪與 warm-up 做到 99.9%；PowerSGD 改用低秩。

## 對付延遲：Delayed Gradient Averaging

第 65–68 頁的問題：同步 SGD 裡，每個 worker 算完梯度要等通訊結束才能做下一步。延遲一長，時間都花在等待。投影片用一個比喻：能不能讓梯度「遲交」？

第 69–71 頁的 [DGA（Zhu et al., NeurIPS 2021）](https://hanlab.mit.edu/projects/dga) 把第 i 步的平均梯度延到第 i+D 步才收。worker 送出梯度後繼續做本地更新，通訊被計算蓋掉。

直接套用過時的梯度會傷精度，所以第 72 頁加一個修正項：用本地的新梯度，扣掉 D 步前的本地梯度，再加上 D 步前的全域平均。第 72 頁用 ResNet-18、CIFAR-10 驗證修正項的效果：

| 延遲 D | 無修正 | 有修正 |
|---|---|---|
| 5 | 88.7 | 89.2 |
| 10 | 86.9 | 89.3 |
| 15 | 85.5 | 89.0 |
| 20 | 84.2 | 88.7 |

第 74 頁的實機測試用 8 個節點，DGA 在視覺任務快 7.1 倍、語言任務快 7.5 倍，對照的 FedAvg（K=10）是 3.8 倍和 4.2 倍。

<details>
<summary>DGA 的更新式（第 71–72 頁）</summary>

```python
G = {}
for iter in range(1, max_iters + 1):
    g = grad(net, data)
    send(g, id=iter)
    G[iter] = g
    avg_g = recv(id=iter - D)        # D 步前送出去的全域平均，現在才到
    W = W - lr * (g - G[iter - D] + avg_g)
```

`g - G[iter-D]` 是本地這 D 步的變化，`avg_g` 補上其他節點的資訊。
</details>

## 讀完這兩講可以做什麼

- **今晚能做的事**：拿你正在訓練（或想訓練）的模型，用 L19 第 69 頁的 16 bytes／參數算一次：你的卡能不能放下權重、梯度、optimizer state？放不下的話，ZeRO-1、2、3 各能讓它變成多少？這一步能直接告訴你該開哪個 FSDP 設定。
- 在 PyTorch 跑一次雙卡 DDP，打開 profiler 看 all-reduce 佔一步多少時間；再把 batch size 調小，看比例怎麼變。
- 想親手寫出這些平行：[CS336 Lecture 7：從 collective operations 組出資料、張量與管線平行](/posts/ai/2026-08-22-cs336-parallelism-mechanics)，再看 [Lecture 8：ZeRO、FSDP 與 3D Parallelism 怎麼對齊硬體拓撲](/posts/ai/2026-08-22-cs336-parallelism-strategies)。

## 延伸閱讀

- [CMU 11-868 L14–L15：分散式訓練與資料平行](/posts/ai/2026-09-30-cmu11868-data-parallel-training)
- [CMU 11-868 L18：ZeRO 怎麼把資料平行的記憶體切掉](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization)
- [CMU 11-868 L16–L17：切層、切矩陣，還是切專家](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)
- 梯度剪枝與 L3–L4 的權重剪枝是同一套思路：[L3 剪枝的粒度與標準](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940) — L19、L20 日期、投影片與錄影連結
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940) — 兩講排在 11 月 17、19 日，材料未放出
- [Lec19-Distributed-Training-I.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/85ud2gzrtyllgeqgpv9gs/Lec19-Distributed-Training-I.pdf?rlkey=80t52w3peqqf8oanpc6ojmvnf&st=jn4yxsjy&dl=0)
- [Lec20-Distributed-Training-II.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/c0w7j7dxduuf8ply7lzeb/Lec20-Distributed-Training-II.pdf?rlkey=ynh3yx4jf99nojklt0ki7zh0y&st=vxzkzdt4&dl=0)
- [EfficientML.ai Lecture 19 - Distributed Training Part 1（YouTube）](https://www.youtube.com/watch?v=LcOM-nZdqxw)
- [EfficientML.ai Lecture 20 - Distributed Training Part 2（YouTube）](https://www.youtube.com/watch?v=lOVcPooetrM)
- [Li et al., Scaling Distributed Machine Learning with the Parameter Server（OSDI 2014）](https://www.usenix.org/conference/osdi14/technical-sessions/presentation/li_mu)
- [Rajbhandari et al., ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)
- [Huang et al., GPipe](https://arxiv.org/abs/1811.06965)
- [Shoeybi et al., Megatron-LM](https://arxiv.org/abs/1909.08053)
- [Jacobs et al., DeepSpeed Ulysses](https://arxiv.org/abs/2309.14509)
- [Liu et al., Ring Attention with Blockwise Transformers for Near-Infinite Context](https://arxiv.org/abs/2310.01889)
- [Chen et al., LongVILA](https://arxiv.org/abs/2408.10188)
- [Zheng et al., Alpa（OSDI 2022）](https://arxiv.org/abs/2201.12023)
- [Aji & Heafield, Sparse Communication for Distributed Gradient Descent](https://arxiv.org/abs/1704.05021)
- [Lin et al., Deep Gradient Compression（ICLR 2018）](https://arxiv.org/abs/1712.01887)
- [Vogels et al., PowerSGD](https://arxiv.org/abs/1905.13727)
- [Wen et al., TernGrad](https://arxiv.org/abs/1705.07878)
- [Zhu et al., Delayed Gradient Averaging（NeurIPS 2021，MIT HAN Lab 專案頁）](https://hanlab.mit.edu/projects/dga)
