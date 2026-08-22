---
title: "CMU 07-280 階段複習二：用 AlexNet 與 GPT-2 把模型真正組起來"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, alexnet, gpt-2, deep-learning]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 26
type: deep-dive
tldr: "第二階段不把 CNN 與 Transformer 當兩份架構圖背誦，而是透過 HW8 與 HW11 檢查表示、計算圖、訓練、遷移與生成是否真的接得起來。"
description: "整合 CMU 07-280 Spring 2026 的 AlexNet 與 GPT-2 路線，從 CNN、autograd、fine-tuning 走到 tokenization、attention 與 perplexity。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-stage-2-alexnet-gpt2-en)

07-280 最有辨識度的設計，是不在講完 neural network 後停在兩層 MLP。課程要求學生沿著兩個 landmark systems 繼續組裝：先在 HW8 建 AlexNet，再在 HW11 建 GPT-2。這兩份作業不是要複製歷史模型的榜單成績，而是讓抽象的 feature learning、autograd、optimization 與 generalization 變成會失敗的程式。

這篇把影像與語言階段合併檢查。它不會假裝有公開逐講錄影，也不會把 notebook 能開啟等同於完整自學體驗；正式班仍有 Gradescope、算力、助教與解答回饋。校外讀者能做的是沿公開 written spec 重建驗收標準。

## AlexNet：空間結構如何進入表示

全連接層不在乎相鄰 pixel 的相對位置，CNN 則用局部 receptive field 與共享 kernel 把空間先驗寫進模型。對單一輸出位置，一維卷積可以寫成：

```text
y[i] = Σ_k w[k] · x[i + k]
```

同一組 `w[k]` 在不同位置重用，因此參數量不隨影像寬高等比例暴增。Pooling 或 stride 進一步縮小 feature map，換取一定程度的位移穩健性。AlexNet 把這些部件堆成深網路，再以非線性、正規化與分類頭產生可訓練系統。

[HW8 written specification](https://www.cs.cmu.edu/~07280/assignments/hw8_blank.pdf)要求學生比較自己實作的 AlexNet、TorchVision AlexNet 與 MobileNet 的參數量，並觀察不同資料規模的 loss／accuracy curves。這比問「AlexNet 有幾層」更接近實務：架構名稱相同，不代表 classifier head、input size 或 parameter count 相同。

## Frozen 與 unfrozen 不是兩個按鈕

HW8 也比較 frozen／unfrozen fine-tuning。Frozen backbone 把預訓練 feature extractor 當固定函數，只更新新任務的分類頭；unfrozen 則讓梯度回到更多層。

```text
frozen:   image → fixed backbone → trainable head → loss
unfrozen: image → trainable backbone → trainable head → loss
```

前者訓練便宜、過度擬合風險較低，卻可能無法適應差異大的 domain；後者有較高調整能力，也更需要資料、記憶體與學習率控制。真正的選擇不是哪個永遠比較準，而是資料量、domain shift 與算力共同決定更新範圍。

今晚可用一個小影像資料集重做相同控制實驗：固定 seed、split、epoch 與 augmentation，只改 backbone 是否凍結。除了 final accuracy，也記錄 trainable parameter count 與每個 epoch 的時間；否則你無法說明多出的準確率花了什麼成本。

## GPT-2：把序列變成可平行的條件預測

GPT-2 階段先把文字切成 token，再為 token identity 與 position 建立表示。Self-attention 讓每個位置依 query、key 的相似度，對 value 做加權整合：

```text
Attention(Q, K, V) = softmax(QKᵀ / √d_k) V
```

Causal mask 禁止目前位置看到未來 token，因而把訓練寫成 next-token prediction。所有位置仍可在訓練時平行計算；生成時則必須把新 token 接回輸入，逐步往後取樣。

[HW11 written specification](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)要求放入 training loss 與 training perplexity 圖，並用不同 prompt 與 temperature 觀察生成。Perplexity 可由平均 cross-entropy `L` 寫成 `exp(L)`；數字下降表示模型平均對正確 token 配出更高機率，不保證文字就會更真實或更有用。

## Temperature 改的是取樣，不是知識

把 logits `z` 除以 temperature `T` 再做 softmax：

```text
p_i = exp(z_i / T) / Σ_j exp(z_j / T)
```

`T` 較低時分布更尖，輸出通常較穩定；較高時尾部 token 更容易被抽到，變化也更大。這個旋鈕不會加入訓練資料裡沒有的事實，也不會修正錯誤表示。用單一 prompt 看一次結果，很容易把隨機樣本誤認為模型性格。

更好的重做方式，是固定四個 prompts，每個 temperature 產生多個 samples，再記錄重複、斷裂、格式遵從與明顯錯誤。這不是完整 LLM evaluation，但比挑一段最漂亮的輸出更接近 HW11 想訓練的觀察能力。

## 兩份作業真正共用的骨架

AlexNet 與 GPT-2 的輸入、layer 與輸出不同，實驗責任卻相同：檢查 tensor shapes、讓 forward pass 可追、確認 gradient 真正流到預期參數、建立 baseline，再一次只改一個變因。Autograd 幫你算導數，不會替你發現資料洩漏、mask 方向錯誤或 validation split 被污染。

因此第二階段的通關條件不是「我跑過兩個 notebook」。你應該能從一張 tensor-shape 表重建 forward pass，能解釋 frozen parameters 為何沒有 gradient，也能把 loss／perplexity 曲線連回一個具體假設。做到這裡，模型架構才從圖變成系統。

## 參考資料

- [CMU 07-280 official course site and assignment table](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [HW8: Building AlexNet](https://www.cs.cmu.edu/~07280/assignments/hw8_blank.pdf)
- [HW11: Building GPT-2](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
- [Neural Networks notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Neural_Networks.pdf)
- [CNN notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_CNNs.pdf)
