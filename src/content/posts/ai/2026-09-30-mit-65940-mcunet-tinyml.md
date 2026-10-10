---
title: "MIT 6.5940 L10 MCUNet：在只有 320kB SRAM 的微控制器上跑神經網路"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, tinyml, edge-ai, on-device-ai]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 12
tldr: "MCU 的 SRAM 約 256–320kB、Flash 約 1MB，比手機小上萬倍，連 int8 的 MobileNetV2 峰值記憶體都超出 5 倍。L10 的答案是 MCUNet：TinyNAS 先挑搜尋空間再搜子網路，MCUNetV2 用 patch-based inference 把 MobileNetV2 的峰值 SRAM 從 1372kB 壓到 172kB，最後看視覺、語音、異常偵測三類 tinyML 應用。"
description: "MIT 6.5940 Fall 2024 第 10 講 MCUNet and TinyML 導讀：tinyML 的定義與記憶體限制、Flash 與 SRAM 的估算方式、為什麼 MobileNetV2 省參數卻不省 activation、TinyNAS 的兩階段搜尋、MCUNetV2 的 patch-based inference 與 halo 問題，以及 visual wake words、keyword spotting、autoencoder 異常偵測三類應用。"
draft: false
glossary:
  - term: "tinyML"
    aliases: ["TinyML", "Tiny AI"]
    definition: "把深度學習模型部署到微控制器（MCU）這類 KB 級記憶體、mW 級功耗的裝置上。6.5940 L10 把它放在 Cloud AI → Mobile AI → Tiny AI 這條光譜的最右端。"
    context: "MIT 6.5940 第 10 講的主題。"
  - term: "peak SRAM"
    aliases: ["峰值 SRAM", "peak activation memory"]
    definition: "推論過程中同時存在 SRAM 裡的 activation 最大值。L10 的簡化估法是每層輸入 activation 加輸出 activation，取所有層的最大值；權重放在 Flash、可以分段讀入，不算進來。"
    context: "MCU 上決定模型放不放得下的關鍵指標，比參數量更常是瓶頸。"
  - term: "patch-based inference"
    aliases: ["逐 patch 推論", "per-patch inference"]
    definition: "MCUNetV2 的做法：網路前段記憶體最吃緊的幾層，不一次算整張 feature map，而是把輸入切成小塊逐塊算完再拼回，換取較低的峰值 SRAM。代價是相鄰 patch 的重疊區（halo）要重複計算。"
    context: "L10 投影片第 51–72 頁。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml-en)

> **版本說明**：本文依據 [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940) 第 10 講（2024-10-08），主要材料是 [Lec10-MCUNet.pdf](https://www.dropbox.com/scl/fi/udgt7c6sw5wpvrbh7us2t/Lec10-MCUNet.pdf?rlkey=sryh8aiehv8792uk1ocu00icn&st=8v4oql2g&dl=0)（93 頁）與 [課堂錄影](https://youtu.be/uR1KKhIhHEk)。文中頁碼指 PDF 頁。事實於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片、錄影、同期 Lab 3 都公開；拿不到的是 Canvas 繳交與評分回饋。
>
> **Fall 2026 對照**：[F26 課表](https://hanlab.mit.edu/courses/2026-fall-65940)把同名講次排在 10 月 15 日，截至 2026-09-30 投影片與錄影仍是空連結。

**系列位置**：上一篇 [L9 知識蒸餾](/posts/ai/2026-09-30-mit-65940-knowledge-distillation)｜下一篇 [L11 TinyEngine 與平行運算](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

前九講的壓縮手法——剪枝、量化、NAS、蒸餾——都在回答「模型怎麼變小」。L10 換一個問法：小到多小才夠？答案取決於你要部署的那顆晶片。這一講把目標設在最極端的一端：微控制器（MCU），一顆可能只賣幾塊美元、沒有作業系統、SRAM 以 kB 計的晶片。

投影片第 2 頁的 Lecture Plan 有四項：什麼是 tinyML、tinyML 的挑戰、tiny 神經網路設計、應用（視覺、語音、時間序列／異常偵測）。本篇照這個順序走。

## 課程影片來源

影片連結已與本文採用版本的官方課程頁核對。

```youtube
url: https://www.youtube.com/watch?v=uR1KKhIhHEk
title: EfficientML.ai Lecture 10 - MCUNet and TinyML（YouTube）
```

原始影片：[EfficientML.ai Lecture 10 - MCUNet and TinyML（YouTube）](https://www.youtube.com/watch?v=uR1KKhIhHEk)

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## 什麼是 tinyML：從雲端一路縮到 IoT

Song Han 用一條光譜開場（第 5–8 頁）：**Cloud AI → Mobile AI → Tiny AI**。雲端靠 GPU/TPU，資料上傳後推論；行動端靠手機；再往下就是 IoT 裝置裡的微控制器。

為什麼要往這麼小的地方走？第 9–12 頁列了四個理由：

- **數量多**：全世界有數十億台以 MCU 為基礎的 IoT 裝置。
- **便宜**：單價約 $0.1–$10，投影片的說法是讓低收入族群也用得起，「Democratize AI」。
- **省電**：功耗在 mW 級，對應 green AI、降低碳排。
- **應用廣**：智慧家庭、智慧製造、個人化醫療、精準農業。

## 挑戰：記憶體比手機小上萬倍

第 13–16 頁是整講的核心數字。投影片把三種平台的記憶體並排：

| | Cloud AI | Mobile AI | Tiny AI |
|---|---|---|---|
| Memory（放 activation） | 32GB | 4GB | 320kB |
| Storage（放權重） | ~TB/PB | 256GB | 1MB |

從手機到 MCU，activation 記憶體小了約 13,000 倍，權重儲存小了約 100,000 倍。第 16 頁的結論是：**權重與 activation 兩邊都得縮**。第 17 頁補一句：行動端只要顧延遲與能耗，tinyML 還多了一道記憶體限制。

### 怎麼估一個 CNN 要多少記憶體

第 20–23 頁給了一個簡化的估法（投影片註明先不算暫存 buffer 與程式碼大小）。它把兩種記憶體分開看：

- **Flash 用量 = 模型大小**。靜態的，整個模型都得放得下。
- **SRAM 用量 = 輸入 activation + 輸出 activation**。動態的，每層不同，我們在意的是**峰值**。權重不算進來，因為可以分段從 Flash 讀。

投影片舉的兩塊板子：Arduino Nano 33 BLE Sense（SRAM 256KB、Flash 1MB）與 STM32 F746ZG（SRAM 320KB、Flash 1MB）。

用這個尺去量現成模型，第 24 頁的結果很直接：在 320kB 的限制下，ResNet-50 的峰值 SRAM 超出 23 倍，MobileNetV2 超出 22 倍，連 int8 量化後的 MobileNetV2 都還超出 5 倍。

第 25–26 頁點出一個反直覺的事實：**MobileNetV2 只縮了參數，沒縮峰值 activation**。在 ImageNet 約 70% top-1 的精度帶，拿 ResNet-18 當基準（int8 計算），MobileNetV2-0.75 的參數少了 4.6 倍，峰值 activation 只少了 1.8 倍。MCUNet 則把兩者分別壓到 6.1 倍與 3.4 倍。這就是 L1–L2 提過的 peak activation 指標，到了 MCU 上變成第一順位。

## Tiny 神經網路設計：MCUNet

### 系統與演算法一起設計

第 29–31 頁把過去的做法分成兩種：

- (a) 在既有推論函式庫上搜模型，例如 [ProxylessNAS](https://arxiv.org/abs/1812.00332)、MnasNet。
- (b) 固定模型，去調函式庫，例如 TVM。

[MCUNet](https://arxiv.org/abs/2007.10319) 是 (c)：**TinyNAS**（搜架構）與 **TinyEngine**（編譯器與 runtime）一起最佳化。TinyEngine 是[下一講](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing)的主題。第 34 頁寫著「Will introduce in lecture 17」，應是舊版課表的殘留；F24 課表上它就在 L11。

### TinyNAS 第一階段：先挑對搜尋空間

第 36–38 頁先講問題。搜尋空間的品質幾乎決定了搜出來的模型好不好。直接沿用手機的搜尋空間（例如 MnasNet space）不行：空間裡**最小**的子網路都塞不進 MCU，因為 320KB 和 4GB 差太多。所以得替 IoT 裝置另選空間，問題是怎麼選。

第 39–41 頁的切入點是兩個旋鈕：輸入解析度 R 與寬度倍率 W。R=224、W=1.0 的原始空間適合手機；放大到 R=260、W=1.4 適合 GPU（引用 [Once-for-All](https://arxiv.org/abs/1908.09791)）。那 256kB、320kB、512kB 的不同 MCU 各該用哪組 R、W？

第 44–45 頁的判準是：在每個候選空間裡，隨機抽出**滿足記憶體限制**的模型，看它們的 FLOPs 分布。FLOPs 越高代表模型容量越大，越可能精度高。投影片比較了兩個空間：好的那個有 20% 的模型超過 50M FLOPs，差的那個只有 20% 超過 32M FLOPs。所以選前者。

第 47 頁把搜出來的最佳組合整理成規律：

- **Flash 變大、SRAM 不變** → 通道數變多、解析度變小。
- **SRAM 變大、Flash 不變** → 解析度變大。

這個規律可以用前面的估算法推回去：通道數主要吃權重（Flash），解析度主要吃 activation（SRAM）。

### TinyNAS 第二階段：在空間裡搜子網路

第 48 頁：用 one-shot NAS 的權重共享，訓練一個 super network，隨機取樣子網路一起 fine-tune，小的子網路嵌在大的裡面。這段和 [L7–L8 的 NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware) 與 [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas) 是同一套工具。F24 的 Lab 3 就在 L10 當天放出，用的正是 Visual Wake Words 資料集。

第 49 頁比較前兩個 stage 的峰值記憶體：和 MobileNetV2 相比，TinyNAS 搜出的網路各 block 峰值更平均（圖上標出 1.6× 與 2.2× 的差距），同樣記憶體就能塞進更大的模型。第 50 頁在 VWW 上和 MobileNetV2、ProxylessNAS 等模型比較，投影片的結論是：精度更高，推論快 3 倍，記憶體成本小 4 倍。

### MCUNetV2：把最擠的那一段切成小塊算

第 51–53 頁看 MobileNetV2 每個 block 的 SRAM 用量，發現分布極不平均：前段幾個 block 很高，後面很低。峰值 1372kB，是 256kB 限制的 8 倍左右。只要壓低前段，整體峰值就下來了。

[MCUNetV2](https://arxiv.org/abs/2110.15352) 的做法是 **patch-based inference**（第 54–57 頁）：前段不再逐層算完整張 feature map，而是把輸入切成小塊，每塊一路算完前段再拼起來。同一個 MobileNetV2，峰值從 1372kB 降到 172kB。第 58 頁在 STM32F746 上實測，以 TinyEngine 為基準，四個模型的峰值 SRAM 降了 4.1–5.9 倍。

代價在第 59–62 頁：相鄰 patch 之間有重疊區（halo），會重複計算；感受野越大，重疊越大。對策有兩個：

1. **網路重新分配**（第 63–64 頁）：把 patch-based inference 直接套在 MobileNetV2 上，MACs 多了 10%。重新分配網路結構（redistribute）之後，投影片寫額外計算量可忽略，影像分類與物件偵測的效能維持不變。
2. **架構與排程一起搜**（第 65 頁）：把 patch 數量、要用 patch 算幾層，和層數、通道數、kernel size 放進同一個搜尋空間。

第 69–72 頁拆解一個搜出來的 VWW 架構，歸納出三條設計規律：per-patch 階段 kernel 小（減少重疊）；中段 expansion ratio 小（壓峰值），後段大（拉效能）；VWW 這類對解析度敏感的資料集用更大輸入（MCUNet 是 128×128）。

## 應用：視覺、語音、時間序列

### 視覺

第 75 頁：用 int4 量化，MCUNet 在 ImageNet 上拿到 70.7% top-1，投影片稱之為第一個在商用 MCU 上超過 70% 的結果。四顆 STM32 的 SRAM／Flash 從 256kB/1MB 到 512kB/2MB。

第 76 頁的 **visual wake words** 是更實際的用法。投影片把它比作視覺版的「Hey Siri」：MCU 上只跑一個小模型判斷鏡頭前有沒有人，有人才喚醒後面大得多的人臉辨識模型，省下大量能耗（資料集出自 [Chowdhery et al. 2019](https://arxiv.org/abs/1906.05721)）。

物件偵測對解析度更敏感，因為要做密集預測。第 78–80 頁說明 patch-based inference 能塞下更大的輸入解析度，因此讓 MCU 上的人臉／口罩偵測、人物偵測成為可能。第 81 頁預告在 MCU 上做訓練（[On-Device Training Under 256KB Memory](https://arxiv.org/abs/2206.15472)），留到 [L21](/posts/ai/2026-09-30-mit-65940-on-device-training)。

### 語音：keyword spotting

第 84 頁是 keyword spotting 的流程（引用 [Hello Edge](https://arxiv.org/abs/1711.07128)）：把音訊切成長度 l、步長 s 的重疊 frame，總共 T = (L − l)/s + 1 個；轉成頻域特徵；再交給神經網路輸出類別機率。第 85 頁說明為什麼 CNN 比全連接 DNN 合適：語音頻譜在時間與頻率上都有強相關，DNN 沒有利用這一點，也沒有針對說話風格造成的平移變化建模。第 86 頁再把 MCUNet 的軟硬體協同設計套到 speech commands 上。

### 時間序列：用 autoencoder 抓異常

第 88–91 頁：訓練一個 autoencoder 重建正常資料；上線後重建誤差超過門檻，就判為異常。投影片列了它的三個性質：不需要標籤、只對和訓練資料相似的資料有效、重建本身有損。第 92 頁的例子是用 Arduino Nano 33 BLE Sense（SRAM 256KB、Flash 1MB、Cortex-M4 @ 64MHz）偵測風扇異常，常見方法列了 K-means、autoencoder、GMM。

## 讀完這講可以做什麼

- **今晚能做的事**：挑一個你手上的小模型，用第 22–23 頁的估法手算每層「輸入 + 輸出 activation」，找出峰值落在哪一層。多半會在前段，這就是 MCUNetV2 要解的問題。
- 想動手：[MCUNet repo](https://github.com/mit-han-lab/mcunet) 是官方實作；[Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas) 用 VWW 練 supernet 搜尋。
- 系統層怎麼把峰值再壓低（in-place depthwise、記憶體排版），接著讀 [L11 TinyEngine](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing)。

## 延伸閱讀

- CNN 基礎與 MobileNet 類 building block：[CS231N L5：用 CNN 做影像分類](/posts/ai/2026-09-30-cs231n-cnn-image-classification)
- 本系列的 NAS 兩講：[L7 搜尋空間與策略](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy)、[L8 硬體感知 NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware)
- 指標定義（#Params、peak activation）：[L1–L2 效率指標](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940) — L10 日期、投影片與錄影連結、Lab 3 放出日
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940) — L10 排在 10 月 15 日，材料未放出
- [Lec10-MCUNet.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/udgt7c6sw5wpvrbh7us2t/Lec10-MCUNet.pdf?rlkey=sryh8aiehv8792uk1ocu00icn&st=8v4oql2g&dl=0) — 本文所有頁碼與數字的出處
- [EfficientML.ai Lecture 10 - MCUNet and TinyML（YouTube）](https://youtu.be/uR1KKhIhHEk)
- [Lin et al., MCUNet: Tiny Deep Learning on IoT Devices（NeurIPS 2020）](https://arxiv.org/abs/2007.10319) — L10 投影片部分頁標為 NeurIPS 2019
- [Lin et al., MCUNetV2: Memory-Efficient Patch-based Inference for Tiny Deep Learning（NeurIPS 2021）](https://arxiv.org/abs/2110.15352)
- [Cai et al., ProxylessNAS（ICLR 2019）](https://arxiv.org/abs/1812.00332)
- [Cai et al., Once-for-All（ICLR 2020）](https://arxiv.org/abs/1908.09791)
- [Chowdhery et al., Visual Wake Words Dataset（2019）](https://arxiv.org/abs/1906.05721)
- [Zhang et al., Hello Edge: Keyword Spotting on Microcontrollers（2017）](https://arxiv.org/abs/1711.07128)
- [Lin et al., On-Device Training Under 256KB Memory（NeurIPS 2022）](https://arxiv.org/abs/2206.15472)
- [mit-han-lab/mcunet（GitHub）](https://github.com/mit-han-lab/mcunet)
