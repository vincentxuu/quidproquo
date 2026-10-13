---
title: "無標註學習與多模態：沒有標註時怎麼學到好的表示｜台大陳縕儂 深度學習之應用 第 14 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, representation-learning, self-supervised-learning, multimodal]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 導讀"
  order: 15
tldr: "資料很多不代表標註很多。這一堂問的是：沒有標註時，怎麼從資料裡學到有用的表示？共同的想法是找出觀察背後的潛在因子。Auto-encoder 把輸入壓成一段短碼再還原。VAE 另外要求短碼服從高斯分布，所以可以從分布抽樣來生成。Dual learning 讓兩個方向相反的任務互相當對方的回饋。自監督學習分成自我預測（遮掉一部分猜回來）與對比學習（相似的拉近、不相似的推遠）。CLIP 用圖文配對做對比學習，讓影像分類不必另外訓練；DALL·E 2 再用它的表示生成圖片。最後談多模態模型：把影像投影到語言模型的空間，以及能邊聽邊決定何時開口的串流互動。"
description: "台大陳縕儂《深度學習之應用》Fall 2025 第 14 堂導讀，依影片 14.1–14.7 的課堂口述與 Fall 2024 的 Beyond Supervised Learning 講義：潛在因子、discriminative 與 generative、auto-encoder 與 denoising、深層 auto-encoder 與檢索、VAE 的目標函數與 posterior collapse、dual learning 的三種做法、自我預測、triplet loss、SimCSE、CLIP、DALL·E 2、LLaVA、any-to-any 多模態模型、GPT-4o 的串流互動與 full-duplex 的三種策略。附兩個可以手算的例子與自我檢查。"
draft: false
glossary:
  - term: "latent factor"
    aliases: ["潛在因子", "latent variable"]
    definition: "觀察不到、但假設它存在，而且控制著我們看到的資料的因素。例如手寫數字背後的筆畫、文章背後的主題。"
    context: "ADL Beyond Supervised Learning 講義第 2–11 頁，是整堂的共同出發點。"
  - term: "VAE"
    aliases: ["variational auto-encoder", "變分自編碼器"]
    definition: "一種 auto-encoder，另外要求中間的短碼服從一個指定的分布（通常是高斯），因此可以從分布抽樣出新的短碼來生成資料。"
    context: "ADL Beyond Supervised Learning 講義第 31–43 頁。"
  - term: "對比學習"
    aliases: ["contrastive learning"]
    definition: "給定多個樣本，學它們之間的關係：相似的樣本在向量空間裡拉近，不相似的推遠。"
    context: "ADL Beyond Supervised Learning 講義第 60–70 頁；CLIP 把它用在圖片與文字之間。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

這是[台大陳縕儂 深度學習之應用 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 14 堂，也是最後一堂講課，依據 ADL Fall 2025（114-1，2025/09/01–12/15）12/01 那一週的影片。前面各堂多半假設有標註資料，或至少有「下一個 token」可以當目標。這一堂回答兩個問題：**只有資料、沒有標註時，可以學到什麼、怎麼學？語言模型的做法怎麼延伸到影像與聲音？**

官方材料：

- 影片 14.1–14.7，見下表。七支都沒有字幕，本文用音訊轉成的逐字稿整理。
- Fall 2025 沒有公開這一堂的講義。本文用 [Fall 2024 的 Beyond Supervised Learning 講義](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241127_BeyondSL.pdf)（82 頁）對照，**文中的頁碼都指這份 2024 講義**。14.7 的內容不在 2024 講義裡，本文另外擷取影片畫面確認投影片上的標題與出處。

| 影片 | 主題 | 長度 | 2024 講義對應頁 |
|---|---|---|---|
| [14.1](https://youtu.be/j5XknQ4MGw0) | Beyond Supervised Learning | 21:19 | 2–11 |
| [14.2](https://youtu.be/rQyhxK-fDyI) | Auto-Encoder | 14:40 | 12–30 |
| [14.3](https://youtu.be/I3by1PGKBMM) | Variational Auto-Encoder | 20:25 | 31–43 |
| [14.4](https://youtu.be/zDe-RNd38bQ) | Dual Learning | 12:39 | 44–55 |
| [14.5](https://youtu.be/5CJW10uSj80) | Self-Supervised Learning | 20:52 | 56–70 |
| [14.6](https://youtu.be/-UpU_dfq_IU) | CLIP & DALL·E 2 | 13:24 | 71–80 |
| [14.7](https://youtu.be/Q0-8988uEiU) | Multimodality | 19:52 | 無 |

標成「本文自編」的例子不是課堂內容。

讀完要能做五件事：用潛在因子的說法解釋無標註的資料為什麼有用；說出 auto-encoder 與 VAE 的差別，以及 VAE 為什麼能生成；說明 dual learning 需要什麼樣的任務、回饋從哪裡來；分清楚自我預測與對比學習，並算出 triplet loss；解釋 CLIP 怎麼做到不另外訓練就能分類影像。

## 為什麼沒有標註的資料也有用

老師開場說，這一堂的方法很多是很久以前就有的，有些現在看起來沒那麼實用，但概念很簡單，套到新的技術上常常還是有效。

講義第 2 頁的第一句是 Big data ≠ Big annotated data。機器學習依手上有什麼分成三類：有標註用監督式學習，有環境可以給 reward 用強化學習，都沒有就是無監督學習。同一頁問：沒有標註、甚至和任務不直接相關的資料，為什麼幫得上忙？答案是：找出控制觀察的潛在因子（latent factors）。

看得到的資料叫 observation，背後看不到、但假設存在的東西叫 latent factor。老師舉了四個例子：

- **手寫數字**（第 3 頁）。同一個 4，每個人寫得不一樣，旋轉的角度也不同。把圖轉一下，每個像素的值全變了，但你還是認得它是 4。人理解的單位不是像素，是「數字 4，加上轉了大約 10 度」這種背後的意義。
- **文章**（第 4 頁）。一篇文章背後有主題：財經、體育、娛樂。Topic model 是很早就有的方法，不需要標註，把大量文章丟進去，它就能分出主題和各主題常見的詞。
- **推薦系統**（第 5–6 頁）。系統看得到你看了哪些影片、看多久、有沒有按喜歡，想學的是你喜歡哪一類。講義用動漫角色當例子：有人喜歡悟空和魯夫，有人喜歡另外兩個角色。老師自己的解讀是前一類是單純熱血型，後一類是傲嬌型。知道一部新影片的屬性（推理類、韓劇、實境秀），就算沒有人看過，也能推薦給對的人。
- **筆畫**（第 7–8 頁）。手寫字由筆畫組成。一張 28×28 的圖有 784 個像素；如果改用「用了哪幾種筆畫」來表示，例如第 1、3、5 號筆畫，向量就是 [1 0 1 0 1 0 ……]，短得多。老師強調短不代表表示力比較弱，它可能更能呈現語意：同樣是 7，不同的寫法很自然會用到相近的筆畫組合來表示。

### 幾個名詞

第 9–11 頁整理後面會用到的說法：

- **Discriminative**：算 P(Y|X)，給輸入、判斷它是哪一類。要有標註才能做。
- **Generative**：算 P(X) 或 P(X, Y)，去描述資料本身的分布。只有一堆手寫數字的圖、不知道各是哪個數字時，能做的是這一種。
- **Deterministic 與 random**：同一個輸入每次給同樣的輸出，或是依一個機率分布給出不同的結果。
- Latent variable model 寫成 p(x, z; θ)：x 是觀察，z 是潛在因子，θ 是模型參數。

依 z 的形式分類：連續向量（auto-encoder、VAE）、離散向量（topic model）、有結構的（語音辨識用的 HMM、樹狀結構的模型）。這一堂講第一種。

## Auto-encoder：壓縮再還原

### 基本想法

第 13–15 頁。Encoder 把輸入 x 壓成一段比較短的 code（z），decoder 再把 code 還原成 y，兩者一起訓練，目標是讓 y 和 x 盡量接近：

z = σ(Wx + b)，y = σ(W′z + b′)，最小化 (x − y)²

為什麼可以壓？老師的說法是：不是每一張 28×28 的圖都是合理的數字，所以不需要用到全部 784 維。中間那一層叫 bottleneck layer，維度比較小，只有真正帶資訊的東西擠得過去。老師說這和資訊理論裡的壓縮是同一個概念：在損失最少資訊的前提下找到比較短的表示。

### 加雜訊：denoising auto-encoder

第 16 頁。圖上加了一些雜訊，人還是看得出是 9。要讓模型也做到，就先在乾淨的圖上人工加雜訊，encode 再 decode 之後，要求結果接近**沒有雜訊**的原圖。這樣學到的表示比較穩健。

第 25 頁把這個想法接到語言模型：BERT 隨機遮掉 15% 的 token 再要求還原，就是一種 denoising auto-encoder。老師說這裡的概念一直沿用到現在的預訓練模型。

### 疊深一點

第 17–19 頁（Hinton 與 Salakhutdinov 2006）。比較兩種把 784 維壓到 30 維的做法：只用一層（相當於 PCA），還原出來的數字糊糊的；用 784-1000-500-250-30 再對稱展開的深層 auto-encoder，還原得清楚很多。把 code 壓到 2 維畫出來，深層模型把不同的數字分得比較開。老師補充，不是越深就一定越好，還要看資料量。

第 26–29 頁的 layer-wise pre-training 是早期訓練深層網路的技巧：一次訓練一層，訓練好就固定，再訓練下一層，最後整個一起微調。老師說現在資料量夠多，隨機初始化通常就訓練得起來，這個技巧不太需要了。

### 用 code 來檢索

第 20–22 頁（Krizhevsky 等 2011）。拿一張人臉的照片找相似的圖。直接在像素上算距離，找回來的多半是顏色分布相近但內容無關的東西。把 32×32 的圖用 8192-4096-2048-1024-512-256 的 auto-encoder 壓成 256 維的 code 再找，回來的至少都是人臉。老師說這個空間的每一維代表什麼，人也說不清楚，但投影上去之後，距離比較有意義。

第 23–24 頁是文字版。傳統做法把文件和查詢都表示成 bag-of-words，只看詞有沒有出現，不考慮語意；意思相同但用字不同就找不到。用 auto-encoder 把 2000 維的 bag-of-words 壓成 2 維，談同一件事的文件會靠在一起。

第 30 頁的 MADE（Germain 等 2015）是 auto-encoder 的一個變形：在網路的連線上加遮罩，讓輸出之間形成「先有 x₂、再有 x₃、再有 x₁」這種條件順序，用來估計分布。後面 dual learning 會用到它。

## VAE：讓 code 服從一個分布

### Auto-encoder 的 decoder 為什麼不能拿來生成

14.3 從一個問題開始。Auto-encoder 訓練完，我們用的其實只有 encoder；decoder 只是為了訓練時有還原的目標。但 decoder 的功能是「給一段 code，產生一張圖或一篇文章」，聽起來很有用。能不能隨便挑一個 code 叫它生成？

不行。Auto-encoder 對 code 的分布沒有任何限制，隨便挑一個 code，decode 出來通常不是合理的東西（第 32 頁：How can we set a latent code for generation?）。

### 核心想法

VAE 的做法是限制 code 的分布（第 33–34 頁）：要求 z 服從高斯分布 N(μ, σ)。這樣之後就可以從這個分布抽樣出新的 z，交給 decoder 產生資料。

實際的網路是這樣（第 37 頁）：encoder 不直接輸出 z，它輸出這個高斯分布的平均值 μ 和 σ（講義寫成 N(μ, σ)，老師口頭說的是 mean 跟 variance；一般的慣例裡 σ 是標準差，σ² 才是變異數）；從這個分布抽樣得到 z；decoder 由 z 產生 y。

目標函數有兩項（第 39 頁）：

E_{z∼q(z|x)}[ log p(x | z) ] − KL( q(z | x) ‖ p(z) )

前一項是還原得像不像，後一項要求 encoder 給出的分布 q(z|x) 接近我們指定的分布 p(z)。所以講義說 VAE 是一種 regularized auto-encoder。

第 40 頁對照兩者：auto-encoder 不是生成模型，因為沒辦法從它抽樣出新資料，也算不出資料的 likelihood。

老師提醒 VAE 訓練起來不穩定，因為中間有抽樣這一步：同一筆資料每次進去，抽到的 z 都可能不同。

### 內插的例子

第 42 頁用句子比較兩者。取兩個句子的 code，在中間做內插，再 decode：

- **Auto-encoder**：從「i went to the store to buy some groceries」到「horses are my favorite animal」，中間出現「horses are to buy any groceries」。看起來是句子，但沒有意義。
- **VAE**：從「i want to talk to you」到「she didn't want to be with him」，中間是「i don't want to be with you」這類句子。每一句都是合理的句子。

第 41 頁是影像的還原結果，老師說 VAE 可能好一點，但差異沒有到很明顯；VAE 更重要的用途在 decoder 可以拿來生成。

### 訓練的技巧：posterior collapse

第 43 頁。目標函數的兩項一起放進去訓練，loss 確實會降，但降的主要是 KL 那一項，因為它比較好學：只要讓分布符合目標就行，不必認真還原。結果是模型只靠 decoder、忽略 z，這叫 posterior collapse。

兩個做法：

- **KL annealing**：KL 那一項乘上一個權重，一開始很小，逼模型先把還原學好，再慢慢把權重調大。
- **KL thresholding**：KL 低於某個門檻時就不再往下壓，講義的式子是 Σ max[λ, KL(q(zᵢ|x) ‖ p(zᵢ))]。

## Dual learning：兩個相反的任務互相幫忙

### 對偶的任務

第 45 頁。兩個任務，一個是 x → y，一個是 y → x，就有對偶關係。講義列了幾組：

| 領域 | f : x → y | g : y → x |
|---|---|---|
| 機器翻譯 | 英翻中 | 中翻英 |
| 語音 | 語音辨識 | 語音合成 |
| 影像理解 | 圖片描述 | 圖片生成 |
| 語言理解 | 語言理解 | 語言生成 |
| 問答 | 回答問題 | 產生問題 |

### 沒有配對資料：dual unsupervised learning

第 46 頁。手上有很多英文句子和很多中文句子，但沒有對齊。讓英文句子 x 先翻成中文 y = f(x)，再翻回英文 x′ = g(y)，x′ 和 x 有多像，就是回饋的訊號。老師說這是強化學習的概念：過去再回來，得到一個 reward，用它讓兩個函式都變好。相似指的是語意相近，不必一字不差。

### 兩個方向都繞一圈：joint dual learning

第 47–48 頁（Su 等 2020）。例子是語言理解與生成：句子「at the riverside there is a pub called the blue spice」對應語意表示 area[riverside]、eatType[pub]、name[blue spice]。兩個循環都要成立：g(f(x)) ≡ x，以及 f(g(y)) ≡ y。兩邊各有資料、只是沒有配對時，可以這樣訓練。

### 有配對資料：dual supervised learning

第 49–51 頁（Xia 等 2017，原本為機器翻譯提出；第 51 頁把它用在語言理解與生成，引的是 Su 等 2019）。有配對資料時本來就可以直接訓練 x → y。但兩個方向在機率上應該一致：

P(x) P(y | x; θ_{x→y}) = P(y) P(x | y; θ_{y→x})

所以在各自原本的 loss 之外，多加一項 duality loss，要求兩邊的差距越小越好：

l_duality = ( log P̂(x) + log P(y | x; θ_{x→y}) − log P̂(y) − log P(x | y; θ_{y→x}) )²

這裡需要估計 P(x) 與 P(y)。x 是自然語言時，P(x) 用語言模型估；y 是語意標記時，可以用前面的 MADE 估。

第 52–54 頁是結果（E2E NLG 資料，餐廳領域 5 萬筆）。老師的解讀：加了 duality 之後生成那一邊有進步，理解那一邊差不多；把其中一邊的分布估得更好（用 MADE）之後，兩邊都進步。

### 和其他做法的差別

第 55 頁的對照：

| 其他做法 | Dual learning |
|---|---|
| 一般的無監督／半監督學習：只有一個任務，沒有回饋訊號 | 有多個任務，自動產生回饋 |
| Co-training：一個任務，用不同的特徵集互補 | 多個任務，對特徵集沒有假設 |
| Multi-task learning：多個任務共用表示 | 不必共用表示，只要形成封閉的迴圈 |
| Transfer learning：用輔助任務幫目標任務 | 沒有主從，所有任務互相幫助 |

## 自監督學習：自我預測與對比學習

第 57 頁的定義：self-supervised learning 是用沒有標註的資料**造出**監督式的任務。老師對比前面的 AE、VAE：那些沒有明確的預測目標，這裡是自己造一個目標，再照監督式學習的方式訓練。現在的預訓練就屬於這一類。

第 58 頁分成兩類：

- **Self-prediction**：在**一個**樣本裡，遮掉一部分，用其他部分預測它（intra-sample）。語言模型用前面預測後面、BERT 預測被遮的 token，都是這一類。第 59 頁列了幾種遮法：用過去預測未來、用下半預測上半、用看得到的預測被遮住的。
- **Contrastive learning**：給**多個**樣本，預測它們之間的關係（inter-sample）。

老師說自我預測大家已經熟了，這一段主要講對比學習。

### 對比學習的目標

第 61 頁：學一個向量空間，相似的樣本靠近、不相似的遠離。老師說它常被用來調整 embedding。

沒有標註時，誰和誰相似要自己造（第 62 頁）：

1. 原本的輸入和它被扭曲過的版本（例如加了雜訊）。
2. 同一個對象的不同視角。

**Triplet loss**（第 63 頁，Schroff 等 2015）是最經典的做法。一個 anchor x、一個正例 x⁺、一個負例 x⁻：

L = max( 0, ‖f(x) − f(x⁺)‖² − ‖f(x) − f(x⁻)‖² + ε )

**例子（本文自編）**。條件：ε = 1。目前 anchor 和正例的距離平方是 1.0，和負例的距離平方是 1.5。

- 推理：1.0 − 1.5 + 1 = 0.5，大於 0，所以 loss 是 0.5。
- 對照：如果負例已經被推到距離平方 2.5，1.0 − 2.5 + 1 = −0.5，取 max 之後 loss 是 0。
- 結果與意義：loss 不要求負例無限遠，只要求它比正例遠超過 ε。達到這個差距之後，這組樣本就不再產生梯度。

**N-pair loss**（第 64 頁，Sohn 2016）把一個負例推廣成很多個。老師說負例很容易取得：知道誰和我像，其他的就從大量資料裡隨機抽。

另外兩種造正負例的方式：

- **Feature clustering**（第 65 頁）：先分群，同群的當正例、不同群的當負例，等於先給一個 pseudo label。
- **Multiview coding**（第 66 頁）：用資料擴增產生同一個輸入的不同版本，例如把圖轉成灰階、放大縮小、旋轉。講義說這是對比學習的主流做法。不同的視角也可以來自不同的模態：一張「跑得很快」的圖、一句「跑得很快」的文字、一段說「跑得很快」的聲音，向量應該靠近。

### SimCSE：用 dropout 造正例

第 67–68 頁（Gao 等 2021）。要在 BERT 之上改進句子的向量。無監督的版本做法很簡單：同一個句子過兩次模型，每次 dropout 丟掉的節點不同，得到兩個略有差異的向量，這兩個就是正例；同一批裡其他句子的向量是負例。老師強調它沒有用任何新資料，只靠 dropout，句子相似度的各項評測就明顯提升。

有標註時，把該拉近的拉近、該推遠的推遠，效果更好。老師口頭舉的是「同一類的句子拉近、不同類的推遠」；第 68 頁圖上用的標註是句子之間的 entailment 與 contradiction。

第 69–70 頁的 SpokenCSE（Chang 與 Chen 2022）把同樣的想法用在語音辨識的結果上：把辨識有錯的句子和原本乾淨的句子拉近。這樣辨識出錯時，向量還是接近正確的句子，後面的語意判斷不受影響。

老師最後補了一個比較新的例子（不在 2024 講義裡）：現在常用的是語言模型產生的 embedding，在它上面再做對比學習還是有幫助。情境是客服中心想自動發現新出現的詢問類型。先用對比學習調整向量再分群，比把所有內容丟給語言模型請它找新主題的效果好。分好的群可以再請語言模型命名。

## CLIP 與 DALL·E 2

### 為什麼要把影像接到語言

第 71 頁。文字可以用自監督的方式學，資料量大，而且有 zero-shot 的遷移能力。影像過去多半靠監督式學習，ImageNet 已經收集了很多圖，量還是比不上文字。所以想法是把影像的任務和語言連起來，借用語言的遷移能力。

### CLIP 怎麼訓練

第 72–73 頁（Radford 等 2021）。CLIP 是 Contrastive Language-Image Pretraining。資料是從網路上收集的 4 億組圖片與文字。老師特別指出，它雖然叫 pretraining，某種程度上還是用了標註：圖片和文字的配對關係就是標註，只是沒有針對特定任務。老師解釋為什麼網路上的圖都有文字：沒有描述的圖很難被找到，所以作者都會寫。

一個 text encoder、一個 image encoder。一批資料排成一個矩陣，第 i 張圖 Iᵢ 和第 j 段文字 Tⱼ 算相似度。對角線上是配對的圖文，要拉近；其他格子都要推遠。講義標的 batch size 是 32,768。

**例子（本文自編）**。條件：一批 32,768 組圖文。

- 推理：矩陣有 32,768 × 32,768 ≈ 10.7 億格。對每一張圖來說，正例只有 1 個，負例有 32,767 個。
- 結果與意義：老師說 batch 大一點訓練會更好，因為一次要推遠的對象比較多。這個數字說明「比較多」是什麼規模：每一張圖都在三萬多段文字裡找出自己的那一段。

### 不另外訓練就能分類

第 74 頁。訓練資料裡沒有任何「影像分類」的標註，但可以這樣做分類：把每個候選類別寫成一句話，例如 a photo of a dog、a photo of a cat，各自算出文字的向量；把要分類的圖算出影像的向量；看哪一句和圖最像，就是答案。

第 75 頁的表比較在 ImageNet 上監督式訓練的 ResNet101 和 zero-shot 的 CLIP：

| 資料集 | ResNet101 | CLIP（zero-shot） |
|---|---|---|
| ImageNet | 76.2 | 76.2 |
| ImageNetV2 | 64.3 | 70.1 |
| ImageNet-R | 37.7 | 88.9 |
| ObjectNet | 32.6 | 72.3 |
| ImageNet Sketch | 25.2 | 60.2 |
| ImageNet-A | 2.7 | 77.1 |

在 ImageNet 本身兩者打平。老師指著香蕉的例子說：換成手繪的香蕉（ImageNet Sketch），監督式訓練的模型只剩 25%，因為它的訓練資料裡沒有手繪的版本；CLIP 還有 60%。這說明它的遷移能力比較好。

### DALL·E 2：反過來生成圖

第 76–80 頁（Ramesh 等 2022）。輸入文字 y，要產生符合的圖 x。它用到 CLIP 的向量，分成兩步：

1. **Prior**：P(zᵢ | y)。由文字的向量，產生對應的 CLIP 影像向量。
2. **Decoder**：P(x | zᵢ, y)。由影像向量產生圖。

合起來是 P(x | y) = P(x | zᵢ, y) P(zᵢ | y)。老師沒有細講影像生成的部分，只說 decoder 可以用 diffusion model。第 80 頁的例子裡，文字是「a small kitchen with a low ceiling」，產生的圖不是原圖那種斜屋頂，但天花板都偏低，廚房裡也都有洗手檯。

## 多模態的語言模型

14.7 的內容不在 2024 講義裡，以下的論文名稱與年份來自影片畫面上的投影片。

### LLaVA：把影像投影到語言的空間

LLaVA（Liu 等 2023）。投影片上的一句話是：用只懂文字的 GPT-4 產生 instruction tuning 的資料，拿來訓練視覺語言模型。

架構是：一個已經訓練好的影像 encoder 把圖編碼，經過一個投影矩陣 W，轉到語言模型看得懂的向量空間，再和文字指令一起交給語言模型。老師的說法是把語言當成中樞，影像投影到語言的空間，再由語言模型判斷。

這樣可以用到語言模型原本的常識。投影片的例子是一張有人在計程車後面燙衣服的照片，問它這張圖哪裡不尋常，它答得出來。

### 任何模態進、任何模態出

緊接著的幾張投影片（Wu 等 2023）把同樣的想法推廣：影像、聲音、影片各有 encoder，各接一個投影到語言模型；輸出端也各有投影，接到對應的生成模型。訓練時輸入端用「圖配圖片描述、聲音配 audio caption（老師口頭解釋成語音辨識的結果）、影片配影片描述」這類資料來學投影。

### 串流互動

投影片標題是 GPT-4o: Streaming Multimodal Interaction (2024)。先對比兩種架構：

- **Pipelined**：聲音先做語音辨識，文字進語言模型，回答再做語音合成。老師說這樣其實已經做得很不錯，很多時候不會比較差。
- **End-to-end**：一個模型直接理解不同的模態。好處是不會有語音辨識錯誤往後傳的問題，也沒有那麼多延遲。

串流的難處在於沒有 Enter 鍵。平常用語言模型，你打完字按 Enter，模型才開始處理。串流時模型在每個時間點都要判斷：現在該聽還是該回？老師的描述是：你還在講的時候它要安靜地聽；你停下來了，它要判斷該它說話；它說話的時候耳朵還要開著，因為你可能打斷它說「等等，你誤會了」。她說這不是把原本的模型改一改就能做到的。

### Full-duplex 的三種策略

接下來兩張投影片引的是 Wang 等 2025 的一篇論文（老師說是 Google 近期發表的），列了三種策略：

- **(a) Perpetual speaking**：模型在每個時間區塊都產生輸出。
- **(b) Model-as-a-server**：一個模型專門監聽、判斷現在該不該講；判斷該講了，再交給另一個負責生成的模型。老師說這和原本的語言模型比較接近，拿一個現成的語言模型，再訓練一個判斷何時接手的模型，就能做到某種程度的 full-duplex。
- **(c) Standalone state prediction**：全部訓練在同一個模型裡，它自己判斷不該講、該講了、講完了。老師說這理想上最像人，但也比較難訓練。

她沒有說哪一種最好。同一篇論文也整理了訓練的階段：先大規模預訓練，再做對話的微調；先學理解，再學生成。老師的說法是理解沒有學好，生成也很難訓練好。

### 老師的總結

現在的多模態模型很多把語言模型當中樞，把其他模態接進來。發展到現在，領先的公司推出的模型多半已經是 end-to-end 的版本。她認為語言還是占最大的比重，因為語言的資料最充裕，語言模型本身的能力也最好。

## 常見的誤解

以下是本文的歸納，不是課堂上逐條列出的內容。

- **「沒有標註就沒辦法訓練。」** 可以還原自己、可以遮掉一部分猜回來、可以拿相反方向的任務互相檢查、可以造正負例。這一堂每一種方法都是在回答標註從哪裡來。
- **「Auto-encoder 訓練完就能拿 decoder 來生成。」** 它對 code 的分布沒有限制，隨便挑的 code 還原出來通常不合理。VAE 才加上這個限制。
- **「VAE 的兩項 loss 一起降就是學好了。」** KL 那一項比較好降，模型可能只顧它而不認真還原。所以要先壓低它的權重。
- **「Dual learning 就是 multi-task learning。」** Multi-task 靠共用表示；dual learning 不必共用，靠的是兩個任務方向相反、可以形成迴圈。
- **「對比學習一定要有人標誰和誰相似。」** SimCSE 只用 dropout 就造出正例，負例用同一批裡的其他句子。
- **「CLIP 沒有用任何標註。」** 老師特別指出它的標註是圖片和文字的配對關係，只是沒有針對特定任務。
- **「多模態模型就是語音辨識加語言模型加語音合成。」** 那是 pipelined 的做法。End-to-end 的模型直接處理多種模態，串流互動還要在每個時間點決定聽或說。

## 自我檢查

題目是本文自擬的，答案都能從上面的內容找到。

**1. 一張 28×28 的手寫數字圖用像素表示要幾維？改用筆畫表示有什麼好處？**

784 維。用筆畫表示短得多，而且同一個數字的不同寫法會用到相近的筆畫組合，更接近語意。

**2. Denoising auto-encoder 的輸入與還原目標各是什麼？BERT 和它有什麼關係？**

輸入是加了雜訊的資料，目標是還原成沒有雜訊的原始資料。BERT 遮掉 15% 的 token 再還原，是同一種想法。

**3. 為什麼 auto-encoder 不算生成模型？VAE 改了什麼？**

Auto-encoder 沒有限制 code 的分布，無法抽樣出合理的新 code。VAE 要求 code 服從高斯分布，encoder 輸出的是分布的平均值 μ 與 σ，之後可以從分布抽樣再交給 decoder。

**4. VAE 的目標函數有哪兩項？posterior collapse 是什麼，怎麼處理？**

還原的項與 KL 的項。KL 那一項比較好學，模型可能只降它而忽略 z、不認真還原。處理方法是 KL annealing（權重由小慢慢調大）或 KL thresholding。

**5. 你有大量英文句子和大量中文句子，但沒有對齊。Dual learning 的訓練訊號從哪裡來？**

把英文翻成中文再翻回英文，翻回來的句子和原句有多接近，就是回饋。

**6. Dual supervised learning 多加的那一項在要求什麼？**

兩個方向的機率要一致：P(x)P(y|x) 應該等於 P(y)P(x|y)。兩邊取對數之後的差距平方就是 duality loss。

**7. Triplet loss 裡 ε = 0.5，anchor 與正例的距離平方是 0.8，與負例的距離平方是 1.0。Loss 是多少？**

0.8 − 1.0 + 0.5 = 0.3，大於 0，取 max 之後 loss 就是 0.3。

**8. SimCSE 的無監督版本怎麼得到正例與負例？**

同一個句子用不同的 dropout 過兩次模型，兩個向量互為正例。同一批的其他句子是負例。

**9. CLIP 沒有用影像分類的資料訓練，怎麼做影像分類？**

把每個類別寫成一句「a photo of a ……」，算出各句的文字向量，和圖片的影像向量比相似度，取最高的那一類。

**10. Full-duplex 的三種策略裡，哪一種可以沿用現成的語言模型？它多了什麼？**

Model-as-a-server。多一個負責監聽、判斷何時該說話的模型，判斷該說了再交給生成的模型。

## 延伸閱讀

- [本系列第 5 堂：Tokenization 與 BERT](/posts/ai/2026-09-30-ntu-adl2025-bert-family)，masked LM 的細節
- [本系列第 8 堂：RAG](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3)，dense retriever 的對比損失與 bi-encoder
- [本系列第 7 堂：後訓練與高效調整](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)，instruction tuning 的資料怎麼來

上一堂：[第 13 堂 對話系統與工具使用](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use)｜接下來：[助教課](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)

## 課程影片來源

以下影片已於 2026-10-10 對照官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=j5XknQ4MGw0
title: ADL 14.1: Beyond Supervised Learning
```

```youtube
url: https://www.youtube.com/watch?v=I3by1PGKBMM
title: ADL 14.3: Variational Auto-Encoder (VAE)
```

```youtube
url: https://www.youtube.com/watch?v=5CJW10uSj80
title: ADL 14.5: Self-Supervised Learning
```

```youtube
url: https://www.youtube.com/watch?v=Q0-8988uEiU
title: ADL 14.7: Multimodality
```

原始影片：[14.1 Beyond Supervised Learning](https://www.youtube.com/watch?v=j5XknQ4MGw0)、[14.2 Auto-Encoder](https://www.youtube.com/watch?v=rQyhxK-fDyI)、[14.3 Variational Auto-Encoder (VAE)](https://www.youtube.com/watch?v=I3by1PGKBMM)、[14.4 Dual Learning](https://www.youtube.com/watch?v=zDe-RNd38bQ)、[14.5 Self-Supervised Learning](https://www.youtube.com/watch?v=5CJW10uSj80)、[14.6 CLIP & DALL·E 2](https://www.youtube.com/watch?v=-UpU_dfq_IU)、[14.7 Multimodality](https://www.youtube.com/watch?v=Q0-8988uEiU)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-13。

內容核對：已依影片核對（2026-10-13）：14.1–14.7 都沒有字幕，本文把音訊用語音辨識轉成逐字稿後整理，逐字稿可能有聽錯的專有名詞與數字。公式、數字與例句以 Fall 2024 講義的頁面為準；14.7 的論文名稱與出處另外對過影片畫面上的投影片。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-13：依七支影片的課堂口述重寫。補上 14.7 的內容（先前只列名稱），加上兩個例子、常見誤解與附答案的自我檢查。

## 參考資料

- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [2025 Fall 台大資訊 深度學習之應用 NTU CSIE ADL 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Beyond Supervised Learning 講義（Fall 2024，241127_BeyondSL.pdf）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241127_BeyondSL.pdf) — 本文頁碼來源
- [Gao et al., SimCSE: Simple Contrastive Learning of Sentence Embeddings](https://arxiv.org/abs/2104.08821)
- [Radford et al., Learning Transferable Visual Models From Natural Language Supervision（CLIP）](https://arxiv.org/abs/2103.00020)
- [Ramesh et al., Hierarchical Text-Conditional Image Generation with CLIP Latents（DALL·E 2）](https://arxiv.org/abs/2204.06125)
- [Liu et al., Visual Instruction Tuning（LLaVA）](https://arxiv.org/abs/2304.08485)
