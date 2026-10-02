---
title: "CS231N L12：自監督學習——沒有標註，怎麼學到好的表示"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, self-supervised-learning, contrastive-learning, representation-learning]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 14
tldr: "CS231N 第 12 講的問題是：大規模訓練需要大量標註，能不能不靠人工標註學到好的表示？答案分三段。第一段是從影像變換自動產生標籤的 pretext task：預測旋轉、拼圖、補洞、上色，以及把遮罩比例拉到 75% 的 MAE。第二段是更通用的對比學習：InfoNCE 損失、需要大 batch 的 SimCLR、用佇列解耦 batch 與負樣本數的 MoCo，以及序列層級的 CPC。最後是不需要負樣本的 DINO：學生網路去預測動量老師的輸出，靠 centering 與 sharpening 避免崩塌。評估方式的核心是 linear probing：凍結編碼器，只訓練一層線性分類器。"
description: "Stanford CS231N Spring 2026 Lecture 12（Self-Supervised Learning）導讀：pretext task 與 downstream task 的分工、旋轉／相對位置／拼圖／inpainting／上色／影片上色、MAE、linear probing 等評估方法、對比學習與 InfoNCE、SimCLR、MoCo v1/v2、CPC，以及 DINO 的自蒸餾。投影片 Spring 2026，錄影 Spring 2025，並對照 DINO 原論文。"
draft: false
glossary:
  - term: "pretext task"
    aliases: ["前置任務", "代理任務"]
    definition: "用資料本身自動產生標籤的訓練任務，例如預測圖片被轉了幾度。我們不在乎這個任務本身做得多好，而在乎它逼模型學到的特徵在下游任務上有多有用。"
    context: "自監督學習的第一類方法。"
  - term: "linear probing"
    aliases: ["linear evaluation protocol", "線性探測"]
    definition: "把預訓練好的編碼器凍結，只在最後加一層線性層訓練，用它的表現衡量表示的品質。"
    context: "SimCLR、MAE、DINO 都用它當主要評估指標之一。"
  - term: "InfoNCE"
    definition: "對比學習的損失函數：把一個正樣本和 N−1 個負樣本放在一起做 N 類分類，要模型挑出正樣本。它是 f(x) 與 f(x+) 之間互資訊的一個下界。"
    context: "出自 van den Oord et al. 2018 的 CPC 論文；SimCLR、MoCo 都用它。"
  - term: "momentum encoder"
    aliases: ["動量編碼器"]
    definition: "參數不經梯度更新，而是取另一個網路參數的指數移動平均（EMA）的編碼器。"
    context: "MoCo 用它編碼 key；DINO 用它當老師網路。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-self-supervised-learning-en)

> **來源年份**：投影片依據 [CS231N](https://cs231n.stanford.edu/) Spring 2026 的 [Lecture 12 投影片](https://cs231n.stanford.edu/slides/2026/lecture_12.pdf)（104 頁，封面日期 2026-05-07）；錄影是 [Spring 2025 的 Lecture 12](https://www.youtube.com/watch?v=4howBU7THbM)（YouTube，約 1 小時 14 分，2025 課表列的講者是 Ehsan Adeli）。2026 錄影只放在 Canvas，限修課生，兩個年份的內容可能有差異。
>
> 這是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列的第 14 篇，也是官方第三單元「Generative and Interactive Visual Intelligence」的第一講。

這一講從前面學過的東西出發。AlexNet 最後一層的 4096 維特徵裡，最近鄰的圖片語意相近，而像素空間的最近鄰不是。**學到的表示很有用，問題是它需要大量標註資料。** 能不能不靠大量人工標註，也訓練出這樣的表示？

## 整體框架：pretext task 與 downstream task

投影片把自監督學習拆成兩段：

1. **Pretext task**：根據資料本身定義一個任務，不需要人工標註（可以算是一種無監督學習）。標籤由資料自動產生。訓練完拿到一個編碼器
2. **Downstream task**：把編碼器接到你真正在意的任務上，用少量標註資料訓練（監督或半監督）

我們通常不在乎 pretext task 本身做得多好，在乎的是學到的特徵對下游的分類、偵測、分割有多有用。

**怎麼評估。** 投影片列了幾類：pretext task 本身的表現；表示品質，包括 **linear evaluation protocol**（凍結編碼器，訓練線性分類器）、分群效果、t-SNE 視覺化；對不同資料集的穩健性與泛化；計算效率；遷移學習與下游任務表現。

投影片也把視野拉大：同一個想法出現在語言模型（GPT-4）、語音合成（WaveNet）、機器人學習等領域。

## 第一段：從影像變換產生標籤

| Pretext task | 做法 | 出處（投影片標註） |
|---|---|---|
| 預測旋轉 | 把整張圖轉 0/90/180/270 度，做 4 類分類 | [Gidaris et al. 2018](https://arxiv.org/abs/1803.07728) |
| 預測相對位置 | 給兩個 patch，猜第二個在第一個的哪個方位 | Doersch et al. 2015 |
| 拼圖 | 把打亂的 patch 排回原位 | Noroozi & Favaro 2016 |
| Inpainting（補洞） | 挖掉一塊，用 encoder-decoder 重建缺失的像素 | [Pathak et al. 2016（Context Encoders）](https://arxiv.org/abs/1604.07379) |
| 上色 | 從灰階預測顏色；split-brain autoencoder 拆成兩個子網路互相預測 | Zhang et al. |
| 影片上色 | 參考幀有顏色，其他幀要照著上色 | Vondrick et al. 2018 |

幾個值得記住的細節：

- **旋轉的假設**：模型只有具備「這個物體正常時該長什麼樣」的視覺常識，才能認出正確的旋轉方向。評估時在 CIFAR-10 上凍結前兩層卷積，只用部分標註訓練後面的層。
- **Inpainting 的損失是重建加上對抗損失**：投影片並排比較只用重建、只用對抗、兩者合併的補洞結果（對抗學習是[下一講](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan)的內容）。
- **影片上色會長出追蹤能力**：它利用的是顏色在時間上的一致性。投影片展示，學到的 attention 可以直接拿來在影格之間傳播分割遮罩，雖然沒有人教過它追蹤。

### MAE：把遮罩比例拉到 75%

[Masked Autoencoders](https://arxiv.org/abs/2111.06377)（He et al., 2021）是重建式方法的代表：

- 跟 ViT 一樣切成不重疊的 patch，均勻隨機遮掉很高比例（75%）
- **Encoder 只處理沒被遮的 25%**：線性投影、加位置嵌入、過 Transformer block。因為輸入很少，encoder 可以做得很大，每個 token 的計算量是 decoder 的 9 倍以上
- **Decoder** 把 encoder 輸出和共用的 mask token 合併，放回被遮的位置、加位置編碼，過 Transformer 後線性投影回像素
- 損失是像素空間的 MSE，**只算被遮住的 patch**

遮罩比例高，任務才夠難、夠有意義。投影片列了 MAE 的一長串消融選項：遮罩比例、decoder 深度與寬度、encoder 是否使用 mask token、重建目標、資料增強、遮罩取樣方式、訓練時長。

**這一段的限制**：學到的表示可能被綁在特定 pretext task 上。能不能找一個更通用的 pretext task？

## 第二段：對比學習

更通用的想法是：**同一個物體的不同版本，表示應該靠近；不同物體，應該推開**（attract／repel）。

形式化：x 是參考樣本，x⁺ 是正樣本，x⁻ 是負樣本。選一個分數函數，學一個編碼器 f，讓正樣本對 (x, x⁺) 的分數高、負樣本對 (x, x⁻) 的分數低。

<details>
<summary>InfoNCE 損失（標準形式）</summary>

給一個正樣本和 N−1 個負樣本：

$$\mathcal{L} = -\mathbb{E}\left[\log \frac{\exp(s(f(x), f(x^+)))}{\exp(s(f(x), f(x^+))) + \sum_{j=1}^{N-1} \exp(s(f(x), f(x_j^-)))}\right]$$

這就是一個 N 類分類的 cross-entropy：在 N 個候選裡挑出正樣本。投影片的總結指出它是 f(x) 與 f(x⁺) 之間互資訊的一個下界。

</details>

### SimCLR

[SimCLR](https://arxiv.org/abs/2002.05709)（Chen et al., 2020）的設計：

- 分數函數用 cosine similarity
- **正樣本從資料增強來**：同一張圖做兩次隨機增強（隨機裁切、隨機顏色扭曲、隨機模糊），就是一對正樣本；同一個 batch 裡其他圖都是負樣本
- 在特徵後面加一個投影網路 g(·)，對比損失在投影後的空間計算

投影片特別註明：**作業裡的 SimCLR 公式跟投影片略有不同，要照作業說明做。**

兩個關鍵設計選擇：

- **非線性投影頭有幫助**。投影片給的可能解釋：對比目標要求表示對資料增強不變，可能丟掉對下游有用的資訊；投影頭讓 z 空間去承擔這個不變性，投影前的 h 空間就能保留更多資訊
- **大 batch 至關重要**。但大 batch 在反向傳播時記憶體很大，ImageNet 實驗需要在 TPU 上分散式訓練（這就是[上一講](/posts/ai/2026-09-30-cs231n-distributed-training)的主題）

評估上，投影片展示在 ImageNet 上用 SimCLR 訓練編碼器後，凍結並訓練線性分類器；以及只用 1% 或 10% 的 ImageNet 標註微調編碼器的半監督結果。

### MoCo 與 MoCo v2

[MoCo](https://arxiv.org/abs/1911.05722)（He et al., 2020）解決 SimCLR 對大 batch 的依賴。跟 SimCLR 的主要差別：

- 維護一個**先進先出的 key 佇列**當負樣本
- 只透過 query 計算梯度、更新編碼器；key 編碼器不回傳梯度，而是用**動量**更新
- 因此 minibatch 大小和負樣本數解耦，可以用大量負樣本

**MoCo v2** 是兩者的混合：從 SimCLR 拿非線性投影頭和強資料增強，從 MoCo 拿動量更新的佇列，能用大量負樣本訓練而**不需要 TPU**。投影片的結論是：非線性投影頭與強資料增強對對比學習至關重要。

### CPC：序列層級的對比

SimCLR 和 MoCo 是**實例層級**的對比（正負樣本是不同實例）。[CPC](https://arxiv.org/abs/1807.03748)（Contrastive Predictive Coding, van den Oord et al., 2018）是**序列層級**的對比：

- **Contrastive**：對比「對的」和「錯的」序列
- **Predictive**：給定目前的上下文，預測未來的模式
- **Coding**：先把序列中的每個樣本編碼成向量 z_t

投影片的例子有音訊（在 LibriSpeech 上做線性分類評估），也有影像：把圖切成 patch，把一列列 patch 當成由上而下的序列，用上面幾列預測下面幾列。總結頁的評語是：CPC 可以用在很多問題上，但學影像表示時不如實例層級的方法有效。

## 第三段：DINO，沒有標籤的自蒸餾

投影片最後介紹 [DINO](https://arxiv.org/abs/2104.14294)（Caron et al., 2021, *Emerging Properties in Self-Supervised Vision Transformers*），這也是課表列出的建議閱讀。投影片以圖為主，以下機制依據原論文：

- **兩個網路、同一個架構**：學生 g_s 與老師 g_t。學生用 SGD 更新；老師不接收梯度（stop-gradient），參數是學生參數的指數移動平均，也就是動量編碼器
- **目標**：老師與學生的輸出各過 softmax 變成機率分布，用 cross-entropy 讓學生去匹配老師。論文把它解讀為「沒有標籤的知識蒸餾」
- **Multi-crop**：一張圖產生 2 個 224² 的全域視角和數個 96² 的局部視角。所有視角都給學生，只有全域視角給老師，鼓勵「從局部對應到全域」
- **避免崩塌**：DINO 不用負樣本，只靠對老師輸出做 **centering** 和 **sharpening**。論文的解釋是：centering 防止某一維主導，但會把輸出推向均勻分布；sharpening 的效果相反；兩者平衡，加上動量老師就足以避免崩塌

<details>
<summary>DINO 原論文的虛擬碼骨架（不含 multi-crop）</summary>

```python
# gs, gt: student and teacher networks
# C: center (K)
# tps, tpt: student and teacher temperatures
# l, m: network and center momentum rates
gt.params = gs.params
for x in loader:  # load a minibatch x with n samples
    x1, x2 = augment(x), augment(x)  # random views
    s1, s2 = gs(x1), gs(x2)  # student output n-by-K
    t1, t2 = gt(x1), gt(x2)  # teacher output n-by-K
    loss = H(t1, s2)/2 + H(t2, s1)/2
    loss.backward()  # back-propagate
    # student, teacher and center updates
    update(gs)  # SGD
    gt.params = l*gt.params + (1-l)*gs.params
    C = m*C + (1-m)*cat([t1, t2]).mean(dim=0)

def H(t, s):
    t = t.detach()  # stop gradient
    s = softmax(s / tps, dim=1)
    t = softmax((t - C) / tpt, dim=1)  # center + sharpen
    return - (t * log(s)).sum(dim=1).mean()
```

</details>

論文摘要列出兩個關鍵發現：自監督 ViT 的特徵明確帶有影像的語意分割資訊，這在監督式 ViT 和 CNN 上都沒那麼明顯；這些特徵也是很好的 k-NN 分類器。論文也強調動量編碼器、multi-crop 訓練和小 patch 的重要性。投影片最後一頁 DINO 標題是「DINO v2」，但頁面只有圖片，本文不轉述它的細節。

## 自學建議

- **先搞懂 pretext／downstream 的分工，再看方法。** 每看到一個新方法，問兩件事：標籤從哪裡自動產生？怎麼評估學到的表示？
- **InfoNCE 就是 cross-entropy。** 把它想成「N 選 1 的分類題」，SimCLR、MoCo、CPC 的差別就只剩「正負樣本從哪來」。
- **動手做 A3。** [A3 導讀](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip)涵蓋的 Spring 2026 作業裡，Q2 是 Self-Supervised Learning（起始碼有 `simclr/` 資料夾），Q4 是 CLIP & DINO。記得投影片的提醒：作業的 SimCLR 公式跟投影片略有不同。
- **缺口**：課表把這一講的主題列為 pretext tasks、contrastive learning、multisensory supervision，但 2026 與 2025 的投影片議程都沒有獨立的「多感官監督」段落，只有 CPC 的音訊例子沾得上邊。想學影音自監督，可以回頭看 [L10](/posts/ai/2026-09-30-cs231n-video-understanding) 的影音多模態段落。2026 錄影不公開。

## 延伸閱讀

- 對比學習在圖文上的延伸（CLIP）：本系列 [L16：視覺與語言](/posts/ai/2026-09-30-cs231n-vision-language)
- ViT 與 patch 的基礎：本系列 [L8：Attention、Transformer 與 ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit)
- 課表建議閱讀：[Lilian Weng 的 Self-Supervised Representation Learning](https://lilianweng.github.io/lil-log/2019/11/10/self-supervised-learning.html)

**系列導覽**：上一篇 [L11：大規模分散式訓練](/posts/ai/2026-09-30-cs231n-distributed-training)｜下一篇 [L13：生成模型（一）VAE、GAN 與自迴歸](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

## 參考資料

- [CS231N 課程首頁（Spring 2026）](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)
- [Lecture 12: Self-Supervised Learning 投影片（Spring 2026, PDF）](https://cs231n.stanford.edu/slides/2026/lecture_12.pdf)
- [Lecture 12 投影片（Spring 2025, PDF）](https://cs231n.stanford.edu/slides/2025/lecture_12.pdf)
- [CS231N Spring 2025 課表](https://cs231n.stanford.edu/2025/schedule.html)
- [Stanford CS231N 2025 Lecture 12: Self-Supervised Learning（YouTube）](https://www.youtube.com/watch?v=4howBU7THbM)
- [Stanford CS231N 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [CS231N Assignment 3（Spring 2026）](https://cs231n.github.io/assignments2026/assignment3/)
- [Caron et al. (2021). Emerging Properties in Self-Supervised Vision Transformers（DINO）](https://arxiv.org/abs/2104.14294)
- [Meta AI 部落格：DINO and PAWS](https://ai.facebook.com/blog/dino-paws-computer-vision-with-self-supervised-transformers-and-10x-more-efficient-training)
- [Lilian Weng (2019). Self-Supervised Representation Learning](https://lilianweng.github.io/lil-log/2019/11/10/self-supervised-learning.html)
- [Gidaris et al. (2018). Unsupervised Representation Learning by Predicting Image Rotations](https://arxiv.org/abs/1803.07728)
- [Pathak et al. (2016). Context Encoders: Feature Learning by Inpainting](https://arxiv.org/abs/1604.07379)
- [He et al. (2021). Masked Autoencoders Are Scalable Vision Learners](https://arxiv.org/abs/2111.06377)
- [Chen et al. (2020). A Simple Framework for Contrastive Learning of Visual Representations（SimCLR）](https://arxiv.org/abs/2002.05709)
- [He et al. (2020). Momentum Contrast for Unsupervised Visual Representation Learning（MoCo）](https://arxiv.org/abs/1911.05722)
- [van den Oord et al. (2018). Representation Learning with Contrastive Predictive Coding](https://arxiv.org/abs/1807.03748)
