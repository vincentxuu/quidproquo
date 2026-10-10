---
title: "MIT 6.5940 L8 NAS II：不訓練也能評估架構，再讓硬體回饋進搜尋"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, neural-architecture-search, efficient-ml, ai-course, mit]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 9
tldr: "MIT 6.5940 Fall 2024 第 8 講處理 NAS 最貴的一步：評估候選架構。從頭訓練 12,800 個架構要 22,400 GPU-hours，所以課程依序介紹繼承權重、hypernetwork、ProxylessNAS 的單路徑訓練、延遲查表與預測器、Once-for-All 的一次訓練 10^19 個子網路，再到完全不訓練的 zero-shot NAS 與神經網路／加速器共同搜尋 NAAS。本篇照 105 頁投影片走一遍，標出每個主張的頁碼。"
description: "MIT 6.5940（Fall 2024）Lecture 8 Neural Architecture Search Part II 導讀：accuracy estimation strategy（train from scratch、inherit weight、hypernetwork）、hardware-aware NAS（ProxylessNAS、MACs 不等於延遲、latency lookup table 與 predictor、Once-for-All progressive shrinking）、zero-shot NAS（Zen-NAS、GradSign）、NAAS 神經網路與加速器共同搜尋，以及 HAT、SPVNAS、Anycost GAN、Flextron 等應用。"
draft: false
glossary:
  - term: "Once-for-All network"
    aliases: ["OFA", "OFA network", "super network", "supernet"]
    definition: "先訓練一個包含所有候選子網路的大網路，子網路共享它的權重；之後針對不同硬體直接抽出子網路，不再重新訓練。"
    context: "MIT 6.5940 L8 投影片第 40–73 頁；Lab 3 用的 MCUNetV2 super network 就是用這種方式訓練。"
    links:
      - label: "Once-for-All（ICLR 2020）"
        url: "https://arxiv.org/abs/1908.09791"
  - term: "zero-shot NAS"
    definition: "不訓練候選架構，只在隨機初始化狀態下計算某個分數（例如對輸入擾動的敏感度、梯度符號一致性），拿它代替準確度來排序架構。"
    context: "L8 以 Zen-NAS 與 GradSign 為例。"
  - term: "latency lookup table"
    aliases: ["延遲查表"]
    definition: "事先在目標裝置上量好每一種運算（op）的延遲，搜尋時把一個架構各層的延遲查表加總，當作它的預估延遲。"
    context: "L8 投影片第 26–29 頁，出自 ProxylessNAS。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware-en)

這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列第 9 篇，對應 [Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940)上的 **Lecture 8：Neural Architecture Search (Part II)**，2024 年 10 月 1 日上課，講者 Song Han。材料有兩份，都公開：

- 投影片 [Lec08-Neural-Architecture-Search-II.pdf](https://www.dropbox.com/scl/fi/kaia5vvmdwb2bj0xnbihm/Lec08-Neural-Architecture-Search-II.pdf?rlkey=vkp9i12ljbk4jmdfp05j3ctdy&st=hincmob7&dl=0)（105 頁，下文頁碼都指 PDF 頁）
- 錄影 [EfficientML.ai Lecture 8 - Neural Architecture Search Part II](https://www.youtube.com/watch?v=5ty12mNV4Sg)

存取等級沿用[課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級：Fall 2024 是 **A3 足以自學**。**Fall 2026 對照**：截至 2026-09-30，[Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940)只放出 L1–L6，第 8 講的投影片與錄影還是空連結，所以本篇只用 Fall 2024。

## 課程影片來源

影片連結已與本文採用版本的官方課程頁核對。

```youtube
url: https://www.youtube.com/watch?v=5ty12mNV4Sg
title: EfficientML.ai Lecture 8 - Neural Architecture Search Part II（YouTube）
```

原始影片：[EfficientML.ai Lecture 8 - Neural Architecture Search Part II（YouTube）](https://www.youtube.com/watch?v=5ty12mNV4Sg)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## 上一篇留下的問題：搜尋空間與策略有了，每個候選怎麼打分？

[上一篇](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy)講了 NAS 的前兩個零件：search space（候選架構的集合）與 search strategy（怎麼在裡面走）。投影片第 5 頁把第三個零件補上，稱為 **accuracy estimation strategy**：給定一個架構，怎麼估它的準確度。這一講的主脊就是「估價越來越便宜」：

| 階段 | 做法 | 付出的成本 |
|---|---|---|
| 從頭訓練 | 每個候選都完整訓練一次 | 最貴 |
| 繼承權重／hypernetwork | 從別的模型或生成器拿權重 | 省掉部分訓練 |
| Once-for-All | 一次訓練大網路，子網路直接抽 | 訓練一次，評估只要秒級 |
| Zero-shot | 完全不訓練，只算分數 | 只剩一次前向／反向 |

投影片第 3 頁列出的講次計畫也是這個順序：accuracy estimation strategy → hardware-aware NAS → zero-shot NAS → neural-hardware architecture co-search → NAS applications。

## 一、準確度怎麼估

### 從頭訓練：貴到只能做小資料集

第 7 頁引用 [Zoph and Le（ICLR 2017）](https://arxiv.org/abs/1611.01578) 的數字：在 CIFAR-10 上訓練了 12,800 個架構，花了 22,400 GPU-hours。第 8 頁接著問：換成 ImageNet、COCO 這種大資料集呢？答案是做不動。

### 繼承權重：不要每次從零開始

第 10 頁用 [Net2Net](https://arxiv.org/abs/1511.05641) 說明：新架構從父模型繼承權重（Net2Wider 加寬、Net2Deeper 加深），訓練成本就降下來了。第 11 頁再往前一步，引用 [Cai et al.（AAAI 2018）](https://arxiv.org/abs/1707.04873)：控制器不直接產生架構，而是產生「把模型變寬／變深」這類 **network transformation action**，在現有架構上修改。

### Hypernetwork：讓一個網路幫別的網路生權重

第 13 頁的 [SMASH](https://arxiv.org/abs/1708.05344) 做法是三步：每個訓練步從搜尋空間隨機抽一個架構，hypernetwork 根據這個架構產生權重，再用梯度下降更新 hypernetwork。訓練完之後，任何候選架構都能直接拿到一組權重來估準確度。

## 二、Hardware-aware NAS：把目標硬體放進迴圈

### 為什麼要替每種硬體各搜一次

第 15 頁的立場很直接：一個模型通吃 GPU、CPU、手機、Raspberry Pi，效率不會好；**specialized model** 才有效率。問題是之前的 NAS 太貴，只能用代理任務。第 16 頁列了兩個例子：NASNet 要 48,000 GPU hours，就算只在 CIFAR 上也約等於單卡跑 5 年；DARTS 若直接在 ImageNet 上搜，要 100GB GPU 記憶體。所以大家改用代理：CIFAR-10、較小的架構空間、較少 epoch，並拿 FLOPs 與參數量當效率指標。代理任務上找到的架構，搬到目標任務與硬體上不一定最好。

### ProxylessNAS：一次只讓一條路徑活著

[ProxylessNAS](https://arxiv.org/abs/1812.00332)（第 17–19 頁）的做法：

1. 建一個 over-parameterized 網路，每一層把所有候選路徑都放進去。
2. 把整個 NAS 化簡成「訓練這一個大網路」的單一流程。
3. 用 architecture parameter 決定要剪掉哪些多餘路徑。

關鍵在第 18 頁：把 architecture parameter 二值化，每次只讓一條路徑的 activation 存在記憶體裡，記憶體從 O(N) 降到 O(1)。這讓它能直接在 ImageNet、大搜尋空間、完整訓練下搜尋，效率指標也從 FLOPs 換成實測延遲（第 19 頁的對照表）。

### MACs 不等於真實延遲

第 20–22 頁是這一講最值得記住的一個觀念。投影片用 [HAT](https://arxiv.org/abs/2005.14187) 的量測：

- 在 NVIDIA Titan Xp GPU 上，增加層數與增加 hidden dimension 可以得到相近的 FLOPs，延遲卻差很多（第 21 頁）。
- 同樣是放大 hidden dimension，Raspberry Pi ARM CPU 的延遲受影響很大，GPU 幾乎不受影響（第 22 頁）。

換句話說，同一個 MACs 數字在不同硬體上代表不同的延遲。要讓搜尋結果在目標裝置上真的快，就得拿那台裝置的延遲當回饋。

### 延遲怎麼拿：實測、查表、預測

[MnasNet](https://arxiv.org/abs/1807.11626) 直接在手機上量每個候選的延遲。第 23–24 頁的評語是又慢又貴。ProxylessNAS 的解法（第 25–30 頁）是先建一份 `[架構, 延遲]` 資料集，再從中做出延遲模型，分兩種：

- **Layer-wise：latency lookup table**。把每一種 op 在目標裝置上的延遲量好存成表，架構的延遲就是各層查表加總（第 26–29 頁）。
- **Network-wise：latency prediction model**。直接拿整個架構的特徵預測延遲。第 31–32 頁以 HAT 為例，特徵包括層數、embedding dim、hidden dim、head 數等；在 Raspberry Pi ARM CPU 上，預測延遲與實測延遲幾乎落在 y=x 線上。

第 33 頁給出的效果：針對手機特化的模型，比沒有特化的版本快 1.83 倍，在 GPU 上差距更大。

### Once-for-All：訓練一次，替每台裝置抽一個

就算每次搜尋只要訓練一個大網路，裝置一多，成本還是會疊加。第 37–39 頁用 MnasNet 式的「搜尋→訓練→再訓練」迴圈示意：設計成本從 40K GPU hours 疊到 160K，再到替多種裝置各做一次的 1600K。

[Once-for-All（OFA）](https://arxiv.org/abs/1908.09791)（第 40–73 頁）改掉這個迴圈：

1. 先訓練一個 once-for-all 網路，子網路是它 sparsely activated 的一部分。
2. 需要部署時，抽一個子網路，取得它的準確度與延遲。
3. 重複第 2 步，挑最好的。

第 40 頁把兩種流程並排：舊流程每取得一次回饋要訓練一次（以天計），OFA 抽子網路評估只要幾秒。第 46 頁的說法是一個 OFA 網路裡有約 10^19 個子網路，它們共享權重、一起訓練，攤掉訓練成本。第 43 頁列出的目標硬體一路延伸到三顆微控制器：STM32H743（512kB SRAM／2MB Flash）、STM32F746（320kB／1MB）、STM32F412（256kB／1MB）。

<details>
<summary>Progressive shrinking：怎麼讓 10^19 個子網路一起訓練而不互相打架（第 47–71 頁）</summary>

OFA 的訓練順序是「先大後小」，逐步打開四個可變維度：

| 維度 | 做法 |
|---|---|
| Resolution | 每個 batch 隨機抽輸入影像大小 |
| Kernel size | 從完整的 7×7 開始；較小的 kernel 取中心的權重，再乘一個轉換矩陣（投影片畫的是 25×25 與 9×9） |
| Depth | 先用完整深度訓練，再逐步允許每個 unit 裡後面的層被跳過 |
| Width | 先用完整寬度，再逐步縮窄；縮之前依 channel importance 排序，保留最重要的 channel |

</details>

第 72 頁還補了一個硬體角度的觀察：在 Xilinx ZU9EG 與 ZU3EG FPGA 上，OFA 找到的模型 arithmetic intensity（Ops/Byte）較高，比較不受記憶體頻寬限制，所以不改 RTL 也能拿到較高的利用率與 GOPS/s。這一點可以跟[第 1 篇](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics)的效率指標、以及之後 [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas) 用的 peak memory 限制對照著看。

## 三、Zero-shot NAS：連訓練都省掉

第 75 頁把目標講白：不訓練，直接分析架構本身來估準確度。投影片舉兩個方法。

**[Zen-NAS](https://arxiv.org/abs/2102.01063)**（第 76 頁）的步驟：

1. 產生隨機輸入 x ~ N(0,1)，再加一點擾動得到 x′ = x + ε。
2. 把網路所有權重初始化成 N(0,1)。
3. 算 z₁ = log‖f(x′) − f(x)‖。直覺是「好的模型應該對輸入擾動敏感」。
4. 再加上各層 batch normalization 的變異數項 z₂，Zen score 是 z₁ + z₂。

**[GradSign](https://arxiv.org/abs/2110.08616)**（第 77 頁）的直覺是：好的模型在各個樣本上的局部極小值比較密集，所以不同樣本的梯度在初始化點上同號的機率較高。它就拿這個「梯度符號一致」的統計量當分數。

投影片沒有替 zero-shot 分數與實際準確度的相關性下結論，本篇也不替它補。

## 四、神經網路與加速器一起搜：NAAS

前面都是「硬體固定、搜模型」。第 79 頁開始的 [NAAS](https://arxiv.org/abs/2105.13258) 把加速器也放進搜尋空間。第 80 頁的設計空間分三層：

| 層 | 可調維度 |
|---|---|
| 加速器 | local buffer size、global buffer size、#PEs、compute array size、PE connectivity |
| 編譯器（mapping） | loop order、loop tiling size、dataflow |
| 神經網路 | #layers、#channels、kernel size、bypass、input／weight 量化精度 |

第 81 頁的主張：兩者放在同一個最佳化迴圈裡搜，得到的解彼此匹配度較高。

這裡有一個實作上的小難題（第 84–89 頁）：loop order 這種參數不是數字。直接用索引編碼（`CRXKYS` 記成 0、`CXYRSK` 記成 1），索引加減一沒有任何物理意義。NAAS 改用 **importance-based encoding**：固定每個維度在向量裡的位置，讓最佳化器替每個維度指定一個重要度數值，再依數值由大到小排序，排出 loop order（或挑出前兩個作為平行化維度）。

結果（第 91–92 頁）：跟只搜 architectural sizing 相比，連 connectivity 與 mapping 一起搜能降更多 EDP（energy-delay product）；NAAS 加上 OFA 相對 baseline 人工設計，準確度 +2.7%，EDP 降 4.4 倍。第 92 頁也提到 NAAS 找到的 dataflow 平行化的是 output height 與 output channel，跟人工設計很不一樣。

## 五、應用：OFA 的點子搬到其他任務

第 94–101 頁是應用巡禮，每個例子一張投影片：

- **NLP**：[HAT](https://arxiv.org/abs/2005.14187)。第 94 頁寫，在 Raspberry Pi 上跑 WMT'14 En-Fr，比 Evolved Transformer 快 2.7 倍、模型小 3.7 倍、FLOPs 少 3.2 倍、搜尋成本少 10,148 倍，BLEU 還高 0.1。
- **點雲**：[SPVNAS](https://arxiv.org/abs/2007.16100)。第 96 頁的對照是 MinkowskiNet 3.4 FPS、SPVNAS 9.1 FPS。
- **GAN**：[Anycost GAN](https://arxiv.org/abs/2103.03243)。一次訓練，小子網路拿來快速預覽，大子網路拿來產出最終高品質結果，目標是 iPad 上的互動式修圖（第 97 頁）。
- **姿態估計**：[Lite Pose](https://arxiv.org/abs/2205.01271)，用 hardware-aware NAS 做裝置端姿態估計（第 98 頁）。
- **量子電路**：[QuantumNAS](https://arxiv.org/abs/2107.10845)。第 100 頁寫量子雜訊讓準確度從 87% 掉到 47%；做法是訓練一個「super circuit」，再搜出對雜訊穩健的 sub-circuit，並剪掉小幅度的量子閘。這個主題在第 23 講會再出現。
- **LLM**：[Flextron](https://arxiv.org/abs/2406.10260)（ICML 2024）。同一個模型、同一組權重，推論時依延遲目標由 router 決定 MLP 與 attention 用多少比例；把現成 LLM 轉成 Flextron 的步驟是排序 head 與 channel、分組、訓練 router（第 101 頁）。

## 讀完這一講，接下來怎麼接

第 102 頁的總結列了五項：NAS 的 performance estimation strategy、hardware-aware NAS、zero-shot NAS、neural-hardware architecture search、NAS 應用。

這一講的觀念馬上會在 **[Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas)** 落地：你會拿到一個 OFA 方式訓練好的 MCUNetV2 super network，自己實作 efficiency predictor（MACs 與 peak memory）與 accuracy predictor，再寫 random search 與 evolutionary search。下一講 **[L9 知識蒸餾](/posts/ai/2026-09-30-mit-65940-knowledge-distillation)** 則換一個方向：架構定了之後，怎麼讓小模型訓練得更好。

如果只有一個小時：先看錄影裡 ProxylessNAS 到 OFA 那段（投影片第 16–73 頁），這是 Lab 3 直接用到的部分；zero-shot 與 NAAS 可以之後再補。

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940)
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940)
- [Lec08-Neural-Architecture-Search-II.pdf（Fall 2024 投影片）](https://www.dropbox.com/scl/fi/kaia5vvmdwb2bj0xnbihm/Lec08-Neural-Architecture-Search-II.pdf?rlkey=vkp9i12ljbk4jmdfp05j3ctdy&st=hincmob7&dl=0)
- [EfficientML.ai Lecture 8 - Neural Architecture Search Part II（YouTube）](https://www.youtube.com/watch?v=5ty12mNV4Sg)
- [Zoph and Le, Neural Architecture Search with Reinforcement Learning（ICLR 2017）](https://arxiv.org/abs/1611.01578)
- [Chen et al., Net2Net（ICLR 2016）](https://arxiv.org/abs/1511.05641)
- [Cai et al., Efficient Architecture Search by Network Transformation（AAAI 2018）](https://arxiv.org/abs/1707.04873)
- [Brock et al., SMASH（ICLR 2018）](https://arxiv.org/abs/1708.05344)
- [Cai et al., ProxylessNAS（ICLR 2019）](https://arxiv.org/abs/1812.00332)
- [Tan et al., MnasNet（CVPR 2019）](https://arxiv.org/abs/1807.11626)
- [Wang et al., HAT（ACL 2020）](https://arxiv.org/abs/2005.14187)
- [Cai et al., Once-for-All（ICLR 2020）](https://arxiv.org/abs/1908.09791)
- [Lin et al., Zen-NAS（ICCV 2021）](https://arxiv.org/abs/2102.01063)
- [Zhang and Jia, GradSign（ICLR 2022）](https://arxiv.org/abs/2110.08616)
- [Lin et al., NAAS（DAC 2021）](https://arxiv.org/abs/2105.13258)
- [Tang et al., SPVNAS（ECCV 2020）](https://arxiv.org/abs/2007.16100)
- [Lin et al., Anycost GANs（CVPR 2021）](https://arxiv.org/abs/2103.03243)
- [Wang et al., Lite Pose（CVPR 2022）](https://arxiv.org/abs/2205.01271)
- [Wang et al., QuantumNAS（HPCA 2022）](https://arxiv.org/abs/2107.10845)
- [Cai et al., Flextron（ICML 2024）](https://arxiv.org/abs/2406.10260)
- [全球 AI／CS 課程地圖（A0–A3 分級）](/posts/learning/2026-08-21-global-ai-cs-course-map)
