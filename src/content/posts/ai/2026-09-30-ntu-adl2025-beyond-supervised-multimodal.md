---
title: "台大陳縕儂 ADL 2025 Fall 導讀：超越監督學習與多模態——Auto-Encoder、VAE、Dual Learning、對比學習到 CLIP"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, self-supervised-learning, representation-learning, vae, clip]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 17
tldr: "資料很多不代表標註很多。ADL 最後一講問：沒有標註時，怎麼學到好的表示？答案是找出背後控制資料的潛在因子。Auto-encoder 把輸入壓成一段短碼再還原；denoising 版本先加雜訊或遮掉 15% 的 token，BERT 的 masked LM 就是這個想法。VAE 規定短碼要服從一個分布，於是能從分布抽樣來生成。Dual learning 讓翻譯與反向翻譯、理解與生成這類對稱任務互相當對方的回饋。自監督學習分兩派：自我預測（遮一部分猜回來）與對比學習（相似的拉近、不相似的推遠）。CLIP 用 4 億組圖文對做對比學習，讓影像分類可以 zero-shot；DALL·E 2 再把 CLIP 的表示拿來生成圖。Fall 2025 只有影片，投影片用 Fall 2024 版補位。"
description: "台大陳縕儂《深度學習之應用》Fall 2025 第 17 篇導讀，依影片 14.1–14.7 與 Fall 2024 講義 241127_BeyondSL.pdf（82 頁）：潛在因子、auto-encoder 與 denoising／masked AE、VAE 與 posterior collapse、dual learning（無監督與監督）、自監督學習的自我預測與對比學習、SimCSE、CLIP、DALL·E 2；14.7 Multimodality 在 2024 講義找不到對應頁，只列名稱。"
draft: false
glossary:
  - term: "Contrastive Learning"
    aliases: ["對比學習"]
    definition: "學一個嵌入空間，讓相似的樣本對彼此靠近、不相似的樣本對彼此遠離的表示學習方法；正負樣本常用資料增強或不同模態產生。"
    context: "ADL BeyondSL 講義第 60–70 頁，分成 inter-sample classification、feature clustering、multiview coding 三類。"
  - term: "Dual Learning"
    aliases: ["對偶學習"]
    definition: "利用兩個互為反向的任務（例如英翻中與中翻英、語言理解與語言生成），讓一個任務的輸出經過另一個任務還原，以還原程度當成訓練訊號的方法。"
    context: "ADL BeyondSL 講義第 44–55 頁，包含陳縕儂實驗室在 NLU／NLG 上的 dual supervised 與 joint dual learning。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal-en)

**本文依據[台大陳縕儂《深度學習之應用》（ADL）Fall 2025（114-1，2025/09/01–12/15）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)播放清單上的 L14 影片，投影片則用 Fall 2024 版補位。** 這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)系列第 17 篇，也是講課篇的最後一篇。前面十六篇幾乎都假設有標註資料，或至少有「下一個字」可以預測；這一篇換個方向問：**沒有標註時，怎麼學到好的表示？語言模型的做法又怎麼延伸到影像？**

用到的官方材料：

- **影片**：[2025 Fall 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)上的 14.1–14.7，說明欄都寫「2025/12/01 Applied Deep Learning」；14.1–14.3 另外註明「Slides credited from Hung-Yi Lee」。課程頁 12/01 那列寫的是「Reasoning」，沒有講義也沒有影片連結。
- **投影片**：Fall 2025 沒有公開這一講的講義。本文用 [Fall 2024 的 Beyond Supervised Learning 講義（241127_BeyondSL.pdf，82 頁）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241127_BeyondSL.pdf)。**下文引用的頁碼全部指這份 2024 講義。**

| # | 影片（2025） | 中文副標 | 長度 | 2024 講義對應頁 |
|---|---|---|---|---|
| 14.1 | [Beyond Supervised Learning](https://youtu.be/j5XknQ4MGw0) | 沒有標註時的實用小技巧 | 21:19 | 2–11 |
| 14.2 | [Auto-Encoder](https://youtu.be/rQyhxK-fDyI) | 學習一個好的資料表示方法 | 14:40 | 12–30 |
| 14.3 | [Variational Auto-Encoder (VAE)](https://youtu.be/I3by1PGKBMM) | 控制特徵的分布以生成用 | 20:25 | 31–43 |
| 14.4 | [Dual Learning](https://youtu.be/zDe-RNd38bQ) | 兩個對稱任務可以互相幫助 | 12:39 | 44–55 |
| 14.5 | [Self-Supervised Learning](https://youtu.be/5CJW10uSj80) | 自我預測＋對比學習 | 20:52 | 56–70 |
| 14.6 | [CLIP & DALL·E 2](https://youtu.be/-UpU_dfq_IU) | 從語言能力進階到各種模態 | 13:24 | 71–80 |
| 14.7 | [Multimodality](https://youtu.be/Q0-8988uEiU) | 像人類一樣能看能聽能說話 | 19:52 | 找不到 |

「對應頁」是本文依主題比對的結果，影片實際放的投影片是不是這幾頁，沒有辦法從公開資訊確認。

## 為什麼沒標註的資料也有用（第 2–11 頁）

第 2 頁開宗明義：**大資料不等於大量標註資料。** 有標註用監督學習，有環境能給 reward 用強化學習，都沒有就用非監督學習。講義接著問：沒標註、甚至和任務無關的資料，為什麼能幫上忙？答案是**找出控制觀察資料的潛在因子（latent factors）**。

第 3–8 頁舉了三個例子：手寫數字由筆畫組成，筆畫就是潛在因子；文件背後有主題；推薦系統裡，使用者與作品背後各有一組看不見的特質，講義用動漫角色屬性和劇種示意。

第 9–11 頁補上術語：判別式模型算 P(Y|X)，生成式模型算 P(X) 或 P(X, Y)；變數分成觀察到的與潛在的、確定的與隨機的。潛在變數可以是連續向量（auto-encoder、VAE）、離散向量（topic model），或結構（HMM、樹狀模型）。這一講只走連續向量這條。

## Auto-Encoder：壓縮再還原（第 12–30 頁）

一張 28×28 的手寫數字圖有 784 維，但不是每張 784 維的圖都是數字（第 14 頁）。所以可以用更短的碼來表示。**Auto-encoder** 由 encoder 與 decoder 組成，encoder 把輸入壓成中間的短碼，decoder 再把短碼還原，訓練目標是讓還原結果和輸入越接近越好（第 15 頁，最小化 ‖x − y‖²）。中間那一層（bottleneck）的輸出就是學到的表示。

幾個變化：

- **Denoising auto-encoder（第 16 頁）**：先在輸入加雜訊，再要求還原乾淨的原圖，讓表示更穩健。
- **Deep auto-encoder（第 17–19 頁）**：疊很多層，例如 784 → 1000 → 500 → 250 → 30 再對稱展開。第 18 頁把它和 PCA 壓到 30 維的還原結果並排比較。
- **應用（第 20–24 頁）**：用 256 維碼做相似圖片檢索，比直接比像素距離找得更準；文字檢索也一樣，把詞袋向量壓成低維碼。
- **遮罩就是一種雜訊（第 25 頁）**：隨機遮掉 15% 的 token 再還原，講義在旁邊直接標了 masked LM。**這就是[第 6 篇](/posts/ai/2026-09-30-ntu-adl2025-bert-family) BERT 的預訓練目標**，從這裡回頭看，BERT 是一個 denoising auto-encoder。
- **逐層預訓練（第 26–29 頁）**：早年先一層一層用 auto-encoder 初始化權重，最後再用反向傳播整體微調。
- **MADE（第 30 頁）**：[Germain et al., 2015](https://arxiv.org/abs/1502.03509) 的 masked auto-encoder，依指定順序還原，用來估計分布。後面 dual learning 會再用到它。

## VAE：讓短碼服從分布，才能生成（第 31–43 頁）

一般 auto-encoder 的短碼可以散落在任何地方，隨便挑一個碼丟進 decoder，不一定生得出像樣的東西（第 32 頁）。**VAE（Variational Auto-Encoder）**的做法是限制短碼的分布：規定潛在變數從高斯分布產生，生成時就從這個先驗分布抽樣（第 33–34 頁）。講義第 34 頁的一句話摘要是「壓縮後的表示要服從一個分布」。

第 37–39 頁把 VAE 拆成兩個任務：decoder 學「從碼生成資料」，encoder 學「潛在因子的分布」。損失函數因此也分兩項：還原損失，加上讓 encoder 輸出接近先驗的 KL 正則項。所以講義也把它叫做「正則化的 auto-encoder」。

第 41–42 頁把 AE 與 VAE 並排比較：影像的還原結果，以及文字在兩個嵌入之間做內插時生出的句子。第 43 頁是實務提醒：**posterior collapse**。KL 項比較好學，模型可能乾脆讓 decoder 自己扛、忽略潛在變數。解法有 KL annealing（KL 項的權重從小慢慢加大）與 KL thresholding。

<details>
<summary>VAE 的損失在算什麼（講義第 35–40 頁的精簡版）</summary>

目標是最大化單一資料點 x 的邊際似然 p(x) = ∫ p(x|z) p(z) dz。這個積分直接算不動，所以引入 encoder q(z|x) 去近似真正的後驗，改成最大化一個下界：

- 第一項：從 q(z|x) 抽 z，看 decoder p(x|z) 能多好地還原 x，這是還原損失。
- 第二項：q(z|x) 和先驗 p(z)（標準高斯）之間的 KL divergence，這是正則項。

原始推導見 [Kingma & Welling, Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114)。

</details>

**怎麼做**：用 PyTorch 在 MNIST 上各訓練一個 2 維碼的 AE 和 VAE，把測試集的碼畫成散佈圖、依數字上色。VAE 的點會擠在原點附近一團，AE 的點會散得比較開。再從兩邊各抽幾個碼丟進 decoder，就能親眼看到第 32–33 頁講的差別。

## Dual Learning：對稱任務互相幫忙（第 44–55 頁）

第 44 頁註明這段投影片取自 ACML 2018 tutorial。第 45 頁列出很多成對的任務：英翻中與中翻英、語音辨識與語音合成、看圖說話與依文字生圖、語言理解與語言生成、問答與出題。一個是 primal，另一個是 dual。

- **Dual unsupervised learning（第 46 頁）**：英文句子翻成中文，再翻回英文，看還原得像不像，把這個差距當成回饋訊號，用強化學習等方式訓練。不需要配對的標註資料。
- **Dual supervised learning（第 49–50 頁）**：[Xia et al., 2017](https://arxiv.org/abs/1707.00415) 為機器翻譯提出。兩個方向的模型理論上要滿足 P(x|y)P(y) = P(y|x)P(x)，所以在各自的監督損失之外加一項「對偶性」懲罰，逼兩個模型遵守這個機率約束。
- **套到 NLU／NLG（第 51–54 頁）**：陳縕儂實驗室把它用在「句子 ↔ 語意框架」，例如把「McDonald's is a cheap restaurant nearby the station」解析成 RESTAURANT、PRICE、LOCATION 三個欄位，反向就是從欄位寫回句子（[Su et al., ACL 2019](https://arxiv.org/abs/1905.06196)）。資料是 E2E NLG 的 5 萬筆餐廳領域資料，NLU 用 F1、NLG 用 BLEU 與 ROUGE 評估。
- **Joint dual learning（第 47–48 頁）**：同一團隊的後續工作（[Su et al., ACL 2020](https://arxiv.org/abs/2004.14710)），讓 NLU、NLG 串成一個閉迴路，目標是完整還原輸入。回饋訊號分兩類：明確的（還原似然、BLEU／ROUGE／F1）與隱含的（用語言模型估句子的分布、用前面提過的 MADE 估語意框架的分布）。

第 55 頁把 dual learning 跟相近的概念對照：半監督只有一個任務；co-training 靠不同特徵集；multi-task 共用表示；transfer learning 用輔助任務幫目標任務。Dual learning 的特點是多個任務同時、互相提升，而且只要形成閉迴路就好，不必共用表示。

這一段和[上一篇](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use)的任務型對話直接相連：NLU 就是對話系統裡的 LU，NLG 就是最後一個模組。

## 自監督學習：自我預測與對比學習（第 56–70 頁）

第 56 頁註明這段投影片取自 NeurIPS 2021 tutorial。第 57 頁的定義：**自監督學習是用沒標註的資料自己造出監督任務**，動機是標註貴、標註少，而好的表示能轉移到各種下游任務。

第 58 頁把它分成兩派：

- **自我預測（self-prediction）**：給一筆資料，遮掉一部分，用其他部分猜回來。這是「樣本內」的預測。第 59 頁引 Yann LeCun 的示意圖：用過去猜未來、用現在猜過去、用下半部猜上半部、用看得到的猜被擋住的。語言模型預測下一個字、BERT 猜被遮的字，都屬於這一派。
- **對比學習（contrastive learning）**：給多筆資料，預測它們之間的關係。這是「樣本間」的預測。

對比學習的核心想法（第 61 頁）：學一個嵌入空間，讓相似的樣本對靠近、不相似的推遠。講義分三類：

1. **Inter-sample classification（第 62–64 頁）**：給一個錨點，加上正樣本與負樣本，要模型認出哪個是相似的。正樣本可以是原始輸入的變形版本，或同一個目標的不同視角。損失函數從 triplet loss（[Schroff et al., 2015](https://arxiv.org/abs/1503.03832)）推廣到能一次比較多個負樣本的 N-pair loss。
2. **Feature clustering（第 65 頁）**：用學到的特徵分群，把群當成偽標籤。
3. **Multiview coding（第 66 頁）**：對同一筆輸入的不同「視角」套 InfoNCE 目標，視角可以來自資料增強，也可以來自不同模態。講義標註這是對比學習的主流做法。

NLP 的例子（第 67–70 頁）：[SimCSE（Gao et al., 2021）](https://arxiv.org/abs/2104.08821) 的非監督版只靠 dropout 的隨機性，把同一句話編碼兩次當成正樣本對；監督版再用標註資料調整。SpokenCSE（Chang & Chen, INTERSPEECH 2022）把乾淨文字與語音辨識出錯的文字當成正樣本對，讓語言理解對辨識錯誤更穩健。

## CLIP 與 DALL·E 2：從語言走到影像（第 71–80 頁）

第 71 頁對比兩個領域：文字有自監督（語言模型）、訓練資料大、能 zero-shot 轉移；影像主要靠監督學習（ImageNet），資料沒那麼大。講義的想法是：**把視覺任務接上語言，換取更好的轉移能力。**

**CLIP（[Radford et al., 2021](https://arxiv.org/abs/2103.00020)，第 72–75 頁）**：

- 自建 WebImageText 資料集，從網路收集 4 億組（圖片，文字）對。
- 圖片 encoder 與文字 encoder 一起訓練，在一個 batch 裡讓配對的圖文靠近、不配對的推遠。講義標出 batch size 是 32,768，也就是每一對都有三萬多個負樣本。這正是上一節的 multiview coding，兩個「視角」剛好是兩種模態。
- **Zero-shot 影像分類（第 74 頁）**：把 N 個類別名稱各寫成一句文字、編碼成向量，看圖片向量和哪一句最接近，就判成那一類。不用為新類別重新訓練。

**DALL·E 2（[Ramesh et al., 2022](https://arxiv.org/abs/2204.06125)，第 76–80 頁）**：反過來用 CLIP 生成圖片。講義把它拆成兩個元件：

- **Prior**：給一段描述，產生對應的 CLIP 圖片嵌入。講義列出自回歸 prior 與 diffusion prior 兩種。
- **Decoder**：從圖片嵌入生成圖片，講義標註用的是 GLIDE。

推論時就是「文字 → prior → CLIP 圖片嵌入 → decoder → 圖片」。擴散模型的原理講義沒有展開，本文也不補，見延伸閱讀。

**怎麼做**：用 Hugging Face 上的開源 CLIP 模型，拿自己手機裡十張照片，寫五個類別描述（例如「一張貓的照片」「一張食物的照片」），跑一次 zero-shot 分類。接著把描述改寫得更具體或更含糊，看準確率怎麼變。這能直接感受第 74 頁「類別就是一句文字」的意思。

## 14.7 Multimodality：只列名稱

14.7 的副標是「像人類一樣能看能聽能說話」，長 19:52。2024 講義裡找不到對應頁，Fall 2025 又沒有公開投影片，本文只能寫到這裡。多模態 LLM 的完整整理請看延伸閱讀的 CS224N 與 CS231n。

## 本文能確認與不能確認的

能確認：七支影片的標題、中文副標、長度與說明欄（YouTube oEmbed 與 yt-dlp 核對）；Fall 2024 BeyondSL 講義 82 頁的標題與列點；上面引用論文的 arXiv 標題。

不能確認：Fall 2025 影片實際放的投影片是不是這份 2024 講義，或改了多少；14.1–14.3 註明投影片借自李宏毅老師，這三支可能至少部分改用了別的投影片。14.7 的內容。本文沒有逐字聽寫影片。講義裡的結果圖表只轉述比較對象，數字請以原論文為準。「怎麼做」裡的 AE／VAE 散佈圖現象是一般經驗，不是講義內容。

## 延伸閱讀

- [CS231n：生成模型（VAE、GAN）](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan)、[CS231n：生成模型（擴散）](/posts/ai/2026-09-30-cs231n-generative-models-diffusion)：VAE 推導與 DALL·E 2 背後的擴散模型。
- [CS231n：自監督學習](/posts/ai/2026-09-30-cs231n-self-supervised-learning)、[CS231n：視覺與語言](/posts/ai/2026-09-30-cs231n-vision-language)：影像端的對比學習與 CLIP。
- [MIT 6.S184 導讀：Flow Matching 與擴散模型](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)。
- [CS224N：多模態](/posts/ai/2026-08-22-cs224n-multimodality)：可以補 14.7 的空白。

下一篇是講課以外的支線：[助教課：從 PyTorch 到 LLM 部署](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)｜上一篇 [對話系統與工具使用](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use)｜下一篇 [助教課：從 PyTorch 到 LLM 部署](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)

## 參考資料

- [台大陳縕儂《深度學習之應用》Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [2025 Fall 台大資訊 深度學習之應用 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- 影片：[14.1](https://youtu.be/j5XknQ4MGw0)、[14.2 Auto-Encoder](https://youtu.be/rQyhxK-fDyI)、[14.3 VAE](https://youtu.be/I3by1PGKBMM)、[14.4 Dual Learning](https://youtu.be/zDe-RNd38bQ)、[14.5 Self-Supervised Learning](https://youtu.be/5CJW10uSj80)、[14.6 CLIP & DALL·E 2](https://youtu.be/-UpU_dfq_IU)、[14.7 Multimodality](https://youtu.be/Q0-8988uEiU)
- [241127_BeyondSL.pdf（Beyond Supervised Learning，Fall 2024 講義）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241127_BeyondSL.pdf)
- [ADL Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~miulab/f113-adl/)
- [Auto-Encoding Variational Bayes（arXiv 1312.6114）](https://arxiv.org/abs/1312.6114)
- [MADE: Masked Autoencoder for Distribution Estimation（arXiv 1502.03509）](https://arxiv.org/abs/1502.03509)
- [Dual Supervised Learning（arXiv 1707.00415）](https://arxiv.org/abs/1707.00415)
- [Dual Supervised Learning for Natural Language Understanding and Generation（arXiv 1905.06196）](https://arxiv.org/abs/1905.06196)
- [Towards Unsupervised Language Understanding and Generation by Joint Dual Learning（arXiv 2004.14710）](https://arxiv.org/abs/2004.14710)
- [FaceNet（triplet loss，arXiv 1503.03832）](https://arxiv.org/abs/1503.03832)
- [SimCSE（arXiv 2104.08821）](https://arxiv.org/abs/2104.08821)
- [Learning Transferable Visual Models From Natural Language Supervision（CLIP，arXiv 2103.00020）](https://arxiv.org/abs/2103.00020)
- [Hierarchical Text-Conditional Image Generation with CLIP Latents（DALL·E 2，arXiv 2204.06125）](https://arxiv.org/abs/2204.06125)
