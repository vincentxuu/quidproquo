---
title: "從比較像素到比較意義：embedding 是怎麼練出來的"
date: 2026-08-16
category: ai
type: deep-dive
tags: [embedding, contrastive-learning, triplet-loss, self-supervised-learning, stanford-cs230]
lang: zh-TW
series:
  name: "Stanford CS230 導讀"
  order: 2
tldr: "兩張同一個人的照片，左上角像素可以差到接近 255，而那個像素毫無意義。embedding 之所以存在，是因為有人先設計了一個 loss function 去逼網路把「同一個人」拉近、「不同人」推遠。從 FaceNet 的 triplet 到 SimCLR 的自監督 pairs，這一步的變化才是現代模型能吃下數十億張未標註影像的原因。"
description: "CS230 Lecture 2 導讀：為什麼像素比較必然失敗、encoding 與 embedding 的界線在哪、triplet loss 怎麼被推導出來，以及自監督 contrastive learning 如何讓標註不再是瓶頸。"
draft: false
---

> [上一篇](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)講了什麼時候 prompt 撐不住。這一篇往下鑽一層。

站上 [RAG 系統實戰](/series/rag-systems)六篇都在用 embedding：[Hybrid Search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf) 討論它和 BM25 怎麼互補、[PageIndex](/posts/ai/2026-05-08-pageindex-vectorless-rag) 討論怎麼不用它。但**沒有一篇講它是怎麼被訓練出來的**。

CS230 [Lecture 2](https://www.youtube.com/watch?v=DNCn1BpCAUY)（2025/09/30，Kian Katanforoosh 主講，1 小時 40 分）把這條線從頭走了一遍，而且是用「先問學生你會怎麼做、再給答案」的方式推導出來的。這一篇把那條線整理出來。

## 先看一個必然失敗的做法

情境是課堂上的案例：學校想用人臉驗證取代刷學生證。你有資料庫裡的證件照，也有現場相機拍的照片，要判斷是不是同一個人。

最直覺的做法是**逐像素比較**：兩張圖夠接近就是同一個人。它為什麼不行？

**光線。** 課堂上那張投影片，兩張圖左上角的像素一個亮一個暗，差值接近 255——**而那個像素根本不重要**。Kian 的說法是：「它會在**完全不影響判斷的地方**懲罰你。」

**幾何。** 人往右移三個像素，逐像素比較的結果就完全不同了。平移、旋轉、縮放，全都會摧毀這個比較。

**其他。** 眼鏡、帽子、髮型、鬍子、年齡——「而且學生證上的人總是比本人年輕。」

這四類問題有一個共同點：**它們全都是「表面變了但意義沒變」。** 而逐像素比較只看得到表面。

## encoding 與 embedding 的界線

要比較意義，就得先有一個能代表意義的東西。課堂上給的定義很乾淨，值得記下來：

> **encoding 是任何向量表示。當這些向量之間的「距離」有意義時，它才叫 embedding。**

這個向量從哪裡來？從網路中間某一層抓出來。而抓哪一層有講究——Kian 用一個訓練在人臉上的網路示範：

- 第一層看的是像素，所以它學到的是**邊緣**（對角、垂直、水平）
- 中間層看的是第一層的輸出，所以它學到的是**眼睛、鼻子、耳朵**（有邊就能拼出圓）
- 更深的層看到的是更複雜的組合，**越接近任務本身**

人臉驗證要的是身分，所以要抓得夠深。抓出來是一個 128 維的向量，兩張圖過**同一個網路**各得一個，算距離，設門檻。

課堂上的數字是：距離 0.4，門檻 0.5，判定為同一人。而門檻決定了 true positive、false positive、false negative 的取捨——**「機場的門檻和史丹佛餐廳的門檻當然不一樣。」**

有學生問：那 128 維裡面到底裝了什麼特徵？答案很誠實：

> 「**現在我答不出來**，除非我去做那個研究。deep learning 的重點是你設計一個 loss function，逼參數去學出特徵。」

（這個問題會在系列的最後一篇被正面處理——Lecture 10 整堂都在講怎麼打開模型看裡面。）

## triplet loss：把目標寫成一個可以最佳化的東西

到這裡都還只是架構。**真正決定 embedding 有沒有意義的是 loss function。**

課堂上用白話先把目標講出來：**同一個人的不同照片要有相近的向量，不同人的照片要有相遠的向量。**

把它變成資料就是三元組：
- **anchor**：基準照片
- **positive**：同一個人的另一張
- **negative**：不同人的照片

然後最小化 anchor–positive 的距離、最大化 anchor–negative 的距離。

這裡有個容易忽略的細節：**margin（課堂上寫成 α）**。沒有它的話，「所有輸出都是 0」就是一個合法解——所有距離都變成 0，loss 也是 0，模型什麼都沒學到卻拿了滿分。margin 逼它必須真的把 negative 推開一段距離。

出處是 [FaceNet](https://arxiv.org/abs/1503.03832)（Schroff、Kalenichenko、Philbin，CVPR 2015）。論文本身值得一提的數字是：他們在 LFW 上達到 99.63% 的準確率，而每張臉只用了 128 bytes。

還有一個實作上的重點：**negative 只存在於訓練時**。測試時只有相機那張照片過網路再比對，沒有第三張。Kian 的說法是「**那只是訓練用的技巧**」。

## 但這一切都需要標籤

triplet 要成立，你得先知道哪兩張是同一個人。**標註很貴。**

課堂上 Kian 把這個問題丟給學生，而且逼問得很細。有人說「讓網路找出彼此接近的圖」，他馬上堵回去：

> 「但你**不知道**它們是不是同一個人。我給你一個**隨機初始化**的網路，你拍我週六和週日的照片，向量完全對不上。**你怎麼開始？**」

有人說「先分群」，他也堵回去：分群是靠 encoder 才 work 的，而 encoder 正是你現在要訓練的東西。

## 答案：用資料增強自己造監督訊號

一隻狗的照片旋轉 90 度，還是同一隻狗。人腦用的是「旋轉不變性 + 語意理解」。

那就設計一個 loss，**逼這兩張圖的向量靠近**。

- 旋轉、裁切、平移、加雜訊——任何變形後的版本，都和原圖算同一對
- 或者把同一張臉遮左半、遮右半，告訴網路「這兩個應該幾乎是同一個向量」

**不需要 triplet 了。一張圖加上各種變形就能成對。**

這就是 contrastive learning，代表作是 [SimCLR](https://arxiv.org/abs/2002.05709)（Chen、Kornblith、Norouzi、Hinton，ICML 2020）。論文的結論很有說服力：在 SimCLR 學到的表示上訓練一個線性分類器，ImageNet top-1 達到 76.5%，**追平了一個監督式訓練的 ResNet-50**；只用 1% 的標籤微調就有 85.8% top-5。

Kian 給的那句總結，是這一講最值得記住的一句：

> 「**從 2015 年 FaceNet 的監督式 triplet，到自監督的 pairs——這就是為什麼現代模型能用『數十億張未標註影像』訓練。**」

而且他補了一句：「其實比大家想的簡單，寫個腳本去爬就好，**最後複雜的地方是算力。**」

## 同一招換到文字上，就是 next token prediction

「self 來自於**不是你手動標的**。」

課堂上做了五個句子接龍，每一個對應一種被逼出來的能力：

| 句子 | 逼出來的能力 |
|---|---|
| I poured myself a cup of ___ | 東西要**裝得進杯子**，而且是**液體** |
| The capital of France is ___ | **編碼真實世界的事實** |
| She unlocked her phone using her ___ | 語意分群：這些東西都是**用來解鎖的** |
| The cat chased the ___ | **機率推理**（同一句在資料裡有很多不同結尾） |
| If it's raining I should bring an ___ | **推理**：把條件連起來 |

沒有一個是被明確教過的。課堂上給的定義是：

> **湧現行為＝在規模化之下，由簡單訓練目標產生的、未被明確教導或標註的非預期能力。**

對照一下會更清楚：以前做人臉驗證，你得刻意造 triplet 並宣告「這是人臉驗證任務」；現在直接爬全網做 contrastive learning，**你根本沒定義過人臉驗證這個任務，它就會了**。

## 多模態：這裡課堂上講得不夠精確

最後一段是把不同模態綁進同一個空間。課堂引的是 Meta 的 [ImageBind](https://arxiv.org/abs/2305.05665)（Girdhar 等人，2023）。

Kian 課堂上的說法是「大多數東西都連到文字，**所以文字通常就是你要的共享空間**」。

**但論文的結論不是文字，是影像。** ImageBind 綁的是六個模態——影像、文字、音訊、深度、熱成像、IMU——而它的核心發現是：

> 你**不需要**所有模態兩兩配對的資料，**只要有「和影像配對」的資料就足以把所有模態綁在一起**。

論文名字就叫 Image**Bind**，樞紐是影像不是文字。這個差別有實務意義：如果你要把一個新模態接進既有的向量空間，你要找的是**它和影像的自然配對**，而不是它和文字的。

順帶一提，這種「自然出現的配對」有個名字叫 **weakly supervised learning**——你不是在幫圖片寫說明文字，你是在**利用世界上本來就成對出現的東西**：影片與其音軌、電影與字幕、音樂與歌名、醫學影像與檢查報告、遊戲畫面與鍵盤操作。

## 這對你選 embedding 模型意味著什麼

把整條線收起來：

1. embedding 不是模型的副產品，**它是被一個特定的 loss function 逼出來的**
2. 那個 loss 決定了「什麼算接近」——FaceNet 的接近是「同一個人」，SimCLR 的接近是「同一張圖的不同變形」
3. 所以**沒有通用的「好 embedding」**，只有「對某個相似性定義而言好的 embedding」

這一點直接影響 RAG。當你發現檢索結果語意上明明相關卻排不上去，問題往往不在你的 chunking 或 rerank，而在**那個 embedding 模型當初被訓練成認為什麼叫「接近」**，和你的查詢情境不一樣。站上的 [Hybrid Search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf) 那篇之所以要把 BM25 拉回來補盲區，根源就在這裡。

## 參考資料

- [Lecture 2: Supervised, Self-Supervised, & Weakly Supervised Learning](https://www.youtube.com/watch?v=DNCn1BpCAUY) — 2025/09/30，Kian Katanforoosh。像素比較的失敗、encoding 與 embedding 的界線、triplet loss 現場推導、湧現行為五句接龍的出處
- [FaceNet: A Unified Embedding for Face Recognition and Clustering](https://arxiv.org/abs/1503.03832) — Schroff et al., CVPR 2015。triplet loss 與 128 維人臉 embedding
- [A Simple Framework for Contrastive Learning of Visual Representations](https://arxiv.org/abs/2002.05709) — Chen et al., ICML 2020。SimCLR，自監督 contrastive learning
- [ImageBind: One Embedding Space To Bind Them All](https://arxiv.org/abs/2305.05665) — Girdhar et al., 2023。六模態共享空間，樞紐是影像
- [CS230 Lecture 2 投影片](https://cs230.stanford.edu/syllabus/fall_2025/2/lecture_2.pdf)
