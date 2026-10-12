---
title: "推理模型：多花算力如何選到可驗證的答案｜CMU 10-423 第 20 堂"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 25
description: "能比較候選選擇與GRPO優勢且區分機制因果證據"
draft: false
---

> [English version](/posts/ai/2026-09-30-cmu10423-reasoning-models-en)

**影片狀態：錄影需登入或課程授權。** 本文依 CMU 10-423 Spring 2026 第 20 堂公開投影片整理；算例與變式是本站教學補充。

同一道算術題，模型寫五行答錯，寫五十行也可能答錯。推理模型的改變不能只看文字變長，而要看額外算力用在哪裡：提出候選、修正步驟、執行工具或驗證答案。第20堂也談機制可解釋性，提醒我們：可讀的解題敘述與模型內部因果機制，是兩種證據。

先備是[解碼與抽樣](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)、[SFT／RLHF](/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf)。本篇先做候選與驗證，再展開GRPO的組內優勢，不用演算法名字清單代替計算。

## 訓練算力與推論算力改不同東西

Chain-of-thought提示讓模型輸出中間步驟，不更新權重。STaR則收集能得到正確答案的推理，再用來微調；答案正確是篩選訊號，仍不保證每句中間理由都忠實。強化學習把正確性等獎勵接到策略更新，讓模型更常產生高獎勵回答。

DeepSeek-R1-Zero展示不先做該階段SFT、以RL訓練推理的路線，完整R1另有冷啟動資料與多階段訓練。不能把兩者合成「R1完全沒有SFT」。o1則展示訓練與推論投入更多算力的方向；不能由產品展示反推未公開的完整訓練實作。

推論時可多抽候選、讓一個候選想更久或接驗證器。這些都花token或工具成本，但失敗模式不同。候選高度相關時，多抽幾次可能只是重複同一錯誤；驗證器偏好漂亮格式時，也可能穩定選錯。

## 候選多不多，先看能否驗證

本文自擬題目：「兩張票各120元，另收總額10%手續費，總價多少？」基準計算是 `2×120=240`，手續費24，總價264。四個候選回答264、252、264、240，多數決選264，這次答對；獨立算式驗證器也只接受264。

若候選改成264、252、252、240，多數決就選252，而按原題核對的驗證器仍選264。這說明額外抽樣與選擇策略不能分開看。若「手續費」定義改為每張固定12元，仍264，但只是碰巧同數，驗證器要讀新條件，不可只記答案。若無候選通過，合理結果是再嘗試或回報未解，而不是硬選分數最高的錯答案。

## GRPO 如何用一組回答建立比較基準

GRPO為同一prompt抽一組回答，用組內reward平均與標準差計算優勢，不另外依賴訓練一個value model。本文自擬四個reward `[1,0,1,0]`，平均 .5，population標準差 .5，忽略數值穩定的小epsilon時，優勢為 `[1,−1,1,−1]`。它告訴策略哪些回答相對同題其他回答更好，不是給每個token一份正確答案標籤。

更新仍比較新／舊策略機率比，使用clipping限制某些過大更新，並搭配reference KL正則。以單個正優勢token、自擬clip幅度 .2為例，ratio=1.3時surrogate取 `min(1.3×1,1.2×1)=1.2`。負優勢token ratio=.7時取 `min(.7×−1,.8×−1)=−.8`。這只是展開一個局部項，整體還有token／羣組平均與KL；不能把這兩項當完整loss或說clip保證策略不會漂移。

變式reward `[1,1,1,1]`：平均1、標準差0，實作需要處理零變異；加穩定項後，這組的中心化優勢全0，沒有相對區分訊號，不代表沒有任何KL梯度。若reward全獎勵格式而非正確性，GRPO就可能改善格式而沒有改善解題。

## 「看懂步驟」與「看懂模型」

Superposition指出有限維度可以承載多個稀疏特徵；一個神經元不一定對應一個可命名概念。Sparse autoencoder用稀疏字典分解activation，嘗試找更可解讀的feature；circuits與cross-layer transcoders則追跨層資訊路徑。

這些工具找到與答案相關的特徵，還要做介入才更接近因果證據：消融某特徵是否改變答案、patch activation是否恢復行為、在不同題目是否可重現？重建誤差、漏掉的特徵與替代模型近似都限制結論。不能看到一個「推理feature」，就宣稱模型所有解題文字忠實反映內部運算。

最後變式：只增加輸出長度，正確率不變而費用加倍，算不算更好？在同一品質要求下沒有證據。要固定題集、reward、工具與選擇規則，同時記正確率、token成本與延遲。會講解、會答對、可被機制研究解釋，各自都要驗收。


## 延伸閱讀

- [上一篇](/posts/ai/2026-10-11-cmu10423-lecture-19-long-context)
- [下一篇](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models)

## 課程影片來源

官方[課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)提供 Panopto 錄影入口，讀取需登入或課程授權。本篇提供投影片導讀，未提供原音逐字稿、字幕或跟讀材料。

## 參考資料

- [CMU Lecture 20 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture20-reasoning.pdf)
- [DeepSeekMath / GRPO](https://arxiv.org/abs/2402.03300)
- [DeepSeek-R1](https://arxiv.org/abs/2501.12948)
- [STaR](https://arxiv.org/abs/2203.14465)
- [Toy Models of Superposition](https://transformer-circuits.pub/2022/toy_model/index.html)
