---
title: "Stanford CS224U 導讀 17：兩場延伸講座——用擴散模型生成文字，以及把大模型訓練的「民間知識」講清楚"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, nlp, diffusion-model, distributed-training]
lang: zh-TW
series:
  name: "Stanford CS224U 導讀"
  order: 17
tldr: "2023 年春季 CS224U 在 Transformer 單元裡插了兩場由課程團隊成員主講的專題。Lisa Li 講 Diffusion-LM：不再一個字一個字往右生，而是把一串高斯雜訊逐步去噪成詞向量，代價是訓練與解碼效率都輸給自迴歸模型，換到的是可以在每一步用分類器梯度操控輸出。Sidd Karamcheti 講怎麼把 GPT-2 Small 的單卡訓練時間從 99.63 天壓到 3.37 天：資料平行、混合精度、ZeRO 一層層疊上去。前者只有投影片，後者有投影片與兩段錄影。"
description: "導讀 Stanford CS224U（Spring 2023）兩場延伸講座：Xiang Lisa Li 的 Diffusion objectives for text（88 頁投影片、Diffusion-LM 論文，無公開錄影）與 Siddharth Karamcheti 的 Fantastic Language Models and How to Build Them（27 頁投影片、XCS224U 播放清單第 49–50 支影片），加上同單元讀物 The Pile。寫清楚每份材料講了什麼、今天拿得到什麼、錄影哪一段才是這場講座。"
draft: false
glossary:
  - term: "Diffusion-LM"
    aliases: ["擴散語言模型", "diffusion language model"]
    definition: "Li 等人 2022 年提出的非自迴歸語言模型：先把每個詞映射成連續向量，再訓練模型把一整串高斯雜訊逐步去噪成詞向量序列，最後取回離散的詞。"
    context: "本篇第一場講座的主角，對照 GPT 那種由左到右的生成方式。"
  - term: "rounding（取整）"
    aliases: ["rounding error", "取整誤差"]
    definition: "擴散模型在連續空間生成向量後，要把每個位置的向量對回詞表裡最可能的詞；向量沒落在任何詞嵌入上時，這一步就會選錯字。"
    context: "投影片用「My ice cream is [BLANK]」說明 melting 與 saving 在嵌入空間很近，卻不能互換。"
  - term: "ZeRO"
    aliases: ["Zero Redundancy Optimizer"]
    definition: "把資料平行訓練中每張卡都各存一份的參數、梯度與優化器狀態，依 GPU 數量切片分散保存的記憶體優化方法。"
    context: "第二場講座用它把 GPT-2 Small 的訓練時鐘從 6.01 天壓到 3.37 天。"
---

> 🌏 [English version](/en/posts/ai/2026-09-29-cs224u-guest-lectures-en)

這是 [Stanford CS224U 導讀](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)的最後一篇，也是唯一一篇「選讀」。

2023 年春季的 [CS224U 課程網站](https://web.stanford.edu/class/cs224u/)，在 Apr 5 起的第一個單元（Domain adaptation for supervised sentiment）裡列了四項材料：作業一說明、Contextual word representations，以及兩份由別人主講的投影片——[Diffusion objectives for text](https://web.stanford.edu/class/cs224u/slides/lisa-224u-diffusion.pdf)（Lisa）和 [Fantastic language models and how to build them](https://web.stanford.edu/class/cs224u/slides/sidd-fantastic-lms-cs224u.pdf)（Sidd）。兩位講者 [Xiang (Lisa) Li](https://xiangli1999.github.io/) 與 [Sidd Karamcheti](https://www.siddkaramcheti.com/) 都列在課程網站的 Teaching team 名單上，所以嚴格說不是校外客座，是團隊成員帶的專題。

本系列把這兩場從單元一搬到最後，理由很單純：[第 4 篇](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families)剛講完 GPT、BERT、ELECTRA 這些模型家族，緊接著塞一個「文字也能用擴散生成」和一整套分散式訓練工程，等於同一段路上連跳兩個大台階。它們跟作業、期末專案都沒有直接關係，是「課程主線之外，2023 年這群人還在想什麼」的切片。

## 這兩場拿得到什麼

| 講座 | 官方材料 | 錄影 | 存取判斷 |
|---|---|---|---|
| Diffusion objectives for text（Xiang Lisa Li） | 投影片 88 頁；講次表讀物列 [Diffusion-LM（Li et al. 2022）](https://proceedings.neurips.cc/paper_files/paper/2022/hash/1be5bc25d50895ee656b8c2d9eb89d6a-Abstract-Conference.html) | [XCS224U 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)50 支影片裡沒有這場 | 只能讀投影片加論文 |
| Fantastic Language Models and How to Build Them（Siddharth Karamcheti） | 投影片 27 頁，封面日期 April 12, 2023 | 播放清單第 [49](https://www.youtube.com/watch?v=4-kuJpVrr7M)、[50](https://www.youtube.com/watch?v=JVKtPZsiv4k) 支 | 投影片與錄影都公開 |

整個系列的存取等級是 A3（依[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級：教材與作業足以自學）。但這一篇單看，比較接近 A2：只有講義與部分錄影，沒有任何練習題。Diffusion 那場的講者口頭解說完全拿不到，投影片上的結果長條圖也沒有標數字，下面寫到結果的地方都只能說到「比了哪些方法」為止。

## 第一場：能不能一次把所有字都生出來

投影片開場先列了一排名字：DALL·E 2、Imagen、DDPM 這些影像與音訊模型用擴散，GPT-2、GPT-3、PaLM、OPT、GPT-4、Claude、LLaMA 這些文字模型全是自迴歸。標題寫的是「Monopoly of Autoregressive LMs」。

### 自迴歸模型的兩個限制

Li 用「Harry Potter graduated from ___」示範自迴歸語言模型：模型對下一個詞給出機率（Hogwarts 0.8、Oxford 0.05），抽一個，接上去，再算下一個。整句的機率靠鏈式法則拆成每個位置的條件機率相乘。

投影片從這裡點出兩個限制：

1. **時間複雜度是 O(n)**，n 是文字長度，得一個一個生。
2. **生成順序固定**。想要由右往左生，或給定左右文去填中間，這個架構都不自然。

接著拋出整場的問題：「Can we generate all words at once?」答案是 [Diffusion-LM](https://proceedings.neurips.cc/paper_files/paper/2022/hash/1be5bc25d50895ee656b8c2d9eb89d6a-Abstract-Conference.html)，Li 與 John Thickstun、Ishaan Gulrajani、Percy Liang、Tatsunori Hashimoto 發表在 NeurIPS 2022 的論文。

### 影像擴散怎麼運作

投影片用幾頁快速交代影像擴散：生成時從純高斯雜訊 x_T 出發，模型每一步學 p(x_{t−1} | x_t)，一路去噪回到乾淨影像 x_0。訓練時則反過來，先對真實資料逐步加雜訊，造出成對的 (x_t, x_{t−1}) 潛變量，再做監督式學習，讓模型預測的均值貼近真正的後驗均值。

投影片把這個流程歸成一句：「Construct latent variables pairs, then apply supervised training.」

### 搬到文字上的兩個難題

影像本來就是連續值，文字是離散的詞。Diffusion-LM 要處理兩件事。

**第一，詞要先變成向量。** 投影片把每個詞映射到一個 d 維向量（d 是超參數，投影片說是個小數字），整句就是 n×d 的連續矩陣，擴散在這個空間裡跑。嵌入怎麼來？投影片比較了兩個選項：隨機嵌入，或端到端學。Diffusion-LM 選端到端，在原本的去噪損失之外加一項「從 x_0 取回原詞的機率」當重建損失，嵌入跟著一起訓練。

**第二，最後一步要取整。** 去噪到 x_0 後，每個位置取最可能的詞。理想上 x_0 應該剛好落在某個詞嵌入上，實際上不會。投影片的例子很好記：「My ice cream is [BLANK]」，melting 對、saving 錯，但這兩個詞在嵌入空間裡很近。

Li 給的解法是改訓練目標。原本每一步是「預測上一個時間步」，取整全部擠在 x_1 → x_0 那最後一步，很難也容易錯。改成每一步都直接「預測乾淨的 x_0」，模型在每個雜訊層級都被逼著對齊真實的詞嵌入，預測出來的 x_0 更精準，取整誤差跟著變小。

### 文字跟影像哪裡不一樣

投影片有兩頁在談頻率。影像的低頻決定大結構，中頻是細節，高頻在感知上幾乎沒意義，所以加一點高頻雜訊，人看起來差不多。

文字的「高頻」是什麼？投影片提了一種定義：相鄰詞嵌入的變化速率。問題是這部分對文字很要緊，它直接關係到每個 token 的預測，而一個不通順的 n-gram 讀者一眼就看得出來。影像可以忽略的東西，文字忽略不了。

### 跟自迴歸模型比，四個面向

| 面向 | 投影片的結論 | 理由 |
|---|---|---|
| 訓練效率 | 自迴歸勝 | 自迴歸靠 causal mask，一次前向就從每個位置拿到梯度；Diffusion-LM 一次前向只練到一個雜訊層級 |
| 解碼效率 | 自迴歸勝 | 自迴歸是 O(序列長度)，Diffusion-LM 是 O(擴散步數)；但自迴歸能快取，擴散每步都得全部重算。投影片補一句：文字越長，Diffusion-LM 可能越划算 |
| 生成順序 | Diffusion-LM 勝 | 不綁定由左到右 |
| 可控生成 | Diffusion-LM 勝 | 見下一節 |

中間還有一段對照寫作方式：人寫長文是「核心概念 → 結構 → 措辭」，自迴歸模型是由左到右，Diffusion-LM 是由粗到細（coarse-to-fine）。

### 真正的賣點：可控生成

最後一段才是這篇論文的主題。假設目標是「生成一則關於 Stanford 校園咖啡店 Coupa 的正面評論」，而你手上有一個凍結參數的預訓練模型。

Plug-and-play 的做法是另外準備一個評分器 p(c | x)，靠貝氏規則 p(x | c) ∝ p(x) p(c | x) 去拉生成結果。投影片示範了對自迴歸模型的反覆嘗試：生出三隻小豬、生出 Starbucks，評分器一直不滿意。

Diffusion-LM 的優勢在於它有一整串連續的中間狀態 x_T, …, x_0。每一步去噪時，除了走模型本身的轉移 p(x_{t−1} | x_t)，還可以沿著分類器分數 p(c | x_{t−1}) 的梯度方向更新 x_{t−1}。控制訊號因此能在每個雜訊層級介入，不用等整句生完才打分。

投影片的實驗頁示範的是「控制語意內容」：給一個欄位與值（例如 Food = Japanese），要求生成句涵蓋這個值，以 exact match 算成功率，另外比流暢度。對照組是 PPLM、FUDGE 與 FT-sample。長條圖沒有標數字；論文摘要的說法是，在六個細粒度控制任務上顯著優於先前方法。

## 第二場：把「民間知識」變成直覺

Karamcheti 的投影片副標寫著「Stanford || Zoom || Folks 2x-ing the Recording」。他在錄影裡自我介紹是做 language for robotics 的四年級博士生。開場點出這場的主張：每出一代新 GPT，就多一批藏起來、沒人公開寫的「folk knowledge」，學術圈的工作是把它們重新找出來，變成直覺。

27 頁分三部分：

1. **Transformer 的演化**：從 RNN（長 context、attention）和 CNN（多 filter、殘差、可平行）講起，推到 self-attention 與 multi-head，再一路追問「缺了什麼」——沒有非線性就加 MLP（錄影裡他用 SVM 的 kernel lifting 類比），激活值爆掉就加 LayerNorm，接著撞上最佳化問題，引出 learning rate warmup（投影片寫「線性 warmup 佔 5% 訓練，然後衰減」，並標注它違反傳統機器學習的直覺）。最後一頁是「The Modern Transformer (March 2023)」。
2. **大規模訓練**：見下一節。
3. **微調與推論**：訓練時學到的工具可以直接搬來用。ZeRO Infinity 做 CPU／NVMe offloading，8-bit 量化（投影片引 LLM.int8()，寫著「Powers llama.cpp and more!」），最後預告 LoRA 等參數高效微調，指向 Hugging Face [PEFT](https://github.com/huggingface/peft)。

### 99.63 天怎麼變成 3.37 天

第二部分是整場最具體的一段。Karamcheti 從自己的經驗講起：想訓練一個 GPT-2 Small（124M 參數），batch 大於 4 就在 12 GB 顯卡上 OOM，用 gradient accumulation 解決，然後發現單卡跑 400K 步要 99.63 天。

投影片的目標是「100 天單卡 → 16 張卡約 4 天」，接著每加一招就更新一次訓練時鐘：

| 做法 | 16 張 GPU 的訓練時鐘 | 投影片的重點 |
|---|---|---|
| 單卡（基準） | 99.63 天 | — |
| 分散式資料平行（DDP） | 7.2 天 | PyTorch 包一層就能自動切資料到各行程 |
| DDP + FP16 混合精度 | 6.01 天 | 靜態記憶體從每參數 20 bytes 降到 16 bytes；真正的加速來自 NVIDIA Tensor Core |
| DDP + FP16 + ZeRO | 3.37 天 | 優化器狀態、梯度依 GPU 數切片，不再每張卡各存一份 |

記憶體那頁值得停一下。FP32 加 Adam，每個參數要存參數、參數副本、梯度、momentum、variance，下限是「參數數 × 20 bytes」。投影片據此估算：1B 參數要 18 GB，175B 參數要 3 TB，這還沒算激活值。FP16 不代表每樣東西都是 16 位元，優化器狀態仍是 32 位元，所以只降到 16 bytes。

最後一頁承認撞牆：節點之間的通訊成本終究會太高，接下來得切矩陣乘法、排程反向傳播，「更難實作、跟模型綁定，還有很長的路」。

### 錄影要看哪一段

播放清單的兩支影片不是整場講座。第 49 支（約 46 分鐘）前段是 Potts 講完 contextual representations 的 ELECTRA 等剩餘小節，Karamcheti 大約在後三分之一才接手，講到 MLP 與 kernel 的類比就下課。第 50 支（約 81 分鐘）前半是 Potts 收尾 neural IR，後半才輪到 Karamcheti，從 warmup 講到 ZeRO。

第三部分在錄影裡幾乎沒講，時間到了，他只用最後一句話推薦 PEFT。想知道微調與推論那段的內容，只能看投影片第 25–26 頁。

## 同單元讀物：The Pile

講次表同一單元的讀物清單列了 [The Pile（Gao et al. 2020）](https://arxiv.org/abs/2101.00027)。講次表把讀物列在整個單元底下，沒有標明它對應哪一場；兩份投影片的文字裡也都沒有提到它。

論文本身是一個 825 GiB 的英文語料，由 22 個子集組成，很多來自學術或專業來源。作者用 GPT-2 與 GPT-3 在 Pile 上測，發現它們在學術寫作等子集表現不佳；在 Pile 上訓練的模型則在各子集上都明顯優於只用 Raw CC 和 CC-100 訓練的模型。論文也記錄了資料中可能令人擔憂的面向，並公開了建構程式碼。

## 今晚就能做的事

- 想懂 Diffusion-LM：先翻投影片第 43–48 頁（取整問題與「每步預測 x_0」），再讀論文摘要與方法節。這幾頁是整份投影片最有資訊量的地方。
- 想懂訓練工程：打開 Fantastic LMs 投影片第 20–22 頁，拿你手邊最常用的模型參數量乘上 20 bytes，算算 FP32 + Adam 的靜態記憶體下限，再看看它比你的顯卡記憶體大幾倍。
- 看錄影的話，直接從第 49 支影片的後三分之一、第 50 支的後半開始。

## 它在系列裡的位置

上一篇 [16：寫 NLP 論文、投稿與上台報告](/posts/ai/2026-09-29-cs224u-presenting-research)是課程主線的終點。這一篇是主線之外的延伸，系列到此結束。回到[系列總覽](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)可以看整門課的地圖、開課狀態與作業環境的坑。

## 延伸閱讀

- [CME295 2026 第 8 講預寫：Diffusion LLM 的三種雜訊、一條訓練目標與平行解碼的代價](/posts/ai/2026-09-29-cme295-diffusion-llms)：三年後的擴散語言模型走到哪裡
- [CMU 11-785 Lecture 23：擴散模型](/posts/ai/2026-08-22-cmu-11785-23-diffusion)：影像擴散的完整推導
- [CS336 Lecture 8：ZeRO、FSDP 與 3D Parallelism 怎麼對齊硬體拓撲](/posts/ai/2026-08-22-cs336-parallelism-strategies)：把第二場講座最後「撞上通訊牆」之後的事講完
- [CS224N 第 5 講：從 recurrence 到 Transformer](/posts/ai/2026-08-22-cs224n-transformers)：Transformer 機制的另一種講法

## 參考資料

以下來源都已打開核對（2026-09-29）：

- [Stanford CS224U 課程網站（Spring 2023）](https://web.stanford.edu/class/cs224u/)：Teaching team 名單、Apr 5 單元材料與讀物
- [Diffusion objectives for text 投影片（Xiang Lisa Li，88 頁）](https://web.stanford.edu/class/cs224u/slides/lisa-224u-diffusion.pdf)
- [Fantastic Language Models and How to Build Them 投影片（Siddharth Karamcheti，27 頁）](https://web.stanford.edu/class/cs224u/slides/sidd-fantastic-lms-cs224u.pdf)
- [XCS224U 播放清單（Spring 2023）](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [影片 49：Fantastic Language Models and How to Build Them, Part 1](https://www.youtube.com/watch?v=4-kuJpVrr7M)
- [影片 50：Fantastic Language Models and How to Build Them, Part 2](https://www.youtube.com/watch?v=JVKtPZsiv4k)
- [Li et al. 2022, Diffusion-LM Improves Controllable Text Generation（NeurIPS 2022）](https://proceedings.neurips.cc/paper_files/paper/2022/hash/1be5bc25d50895ee656b8c2d9eb89d6a-Abstract-Conference.html)
- [Gao et al. 2020, The Pile: An 800GB Dataset of Diverse Text for Language Modeling（arXiv 2101.00027）](https://arxiv.org/abs/2101.00027)
- [Hugging Face PEFT](https://github.com/huggingface/peft)
