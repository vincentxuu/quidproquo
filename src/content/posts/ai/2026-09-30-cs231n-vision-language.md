---
title: "CS231N L16：視覺與語言——從 CLIP 的對比學習到會看圖說話的多模態基礎模型"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, clip, vision-language-model, multimodal, foundation-models]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 17
tldr: "CS231N Spring 2026 的視覺與語言講次，先把課程前半的「一個任務一個模型」換成「基礎模型」：先用大量多樣的資料預訓練一個模型，再用微調、zero-shot 或 few-shot 接到許多任務。主角有三條線。第一條是 CLIP：用 4 億組網路圖文配對做雙向對比學習，再把類別名稱寫成句子，就能不經微調直接分類；它也有弱點，分不出「草地上的杯子」和「杯子裡的草」。第二條是 LLaVA、Flamingo 到 Qwen3-VL、Molmo 的視覺語言模型：把圖片特徵接進 LLM，讓模型看圖輸出文字。第三條是 chaining：讓 LLM 寫描述或寫程式，把現成的視覺模型串起來。"
description: "Stanford CS231N（Spring 2026）Lecture 16「Vision + Language (and Foundation Models)」導讀：基礎模型的定義、CLIP 的資料與雙向 InfoNCE 目標、zero-shot 分類與 prompt ensemble、CLIP 的優缺點（batch size、組合性、hard negative）、SigLIP 與 CoCa、LLaVA 與 Flamingo 的兩種融合方式、Qwen3-VL 與 Molmo／PixMo、CuPL 與 VisProg，以及 omni 模型。"
draft: false
glossary:
  - term: "zero-shot classification"
    aliases: ["零樣本分類"]
    definition: "不用目標資料集的任何標註微調，直接把每個類別寫成一句文字，用文字編碼器得到類別向量，再把圖片分到最相似的類別。"
    context: "CLIP 讓這種用法在影像分類上變得實用。"
  - term: "compositionality"
    aliases: ["組合性"]
    definition: "理解由相同元素以不同結構組成的意思差異，例如「草地上的杯子」和「杯子裡的草」。CS231N 用它說明 CLIP 式模型的弱點。"
    context: "投影片提到 Winoground、CREPE、ARO 等評測。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-vision-language-en)

> **來源年份：** 投影片與作業是 Spring 2026；錄影是 Spring 2025（YouTube）。兩者可能有差異，本文以 2026 投影片為準，錄影只當輔助。
>
> 這是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列的第 17 篇。上一篇是 [L14：生成模型（二）Diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion)，下一篇是 [A3 導讀：Transformer Captioning、SSL、DDPM、CLIP & DINO](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip)。L15（3D 視覺）在系列裡移到 A3 之後，見 [L15 導讀](/posts/ai/2026-09-30-cs231n-3d-vision)。

[CS231N](https://cs231n.stanford.edu/) 2026 年 5 月 26 日那一講，[課表](https://cs231n.stanford.edu/schedule.html)寫的標題是「Vision and Language」，投影片封面則是「Vision + Language (and Foundation Models)」。官方材料是 122 頁的 [lecture_16.pdf](https://cs231n.stanford.edu/slides/2026/lecture_16.pdf)，對應的公開錄影是 [Spring 2025 Lecture 16](https://www.youtube.com/watch?v=mQOK0Mfyrkk)。

**錄影和投影片的差異這一講特別大。** 2025 年的 [lecture_16.pdf](https://cs231n.stanford.edu/slides/2025/lecture_16.pdf) 有 148 頁，講者是 Ranjay Krishna，其中有一大段 Segment Anything；2026 版只在分類圖上列出 Segment Anything，另外新增了 Qwen3-VL、SigLIP 與 omni 模型。看 2025 錄影時，遇到 2026 投影片沒有的段落，就當成補充。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=mQOK0Mfyrkk
title: YouTube：CS231N Spring 2025 Lecture 16: Vision and Language
```

原始影片：[YouTube：CS231N Spring 2025 Lecture 16: Vision and Language](https://www.youtube.com/watch?v=mQOK0Mfyrkk)

課程與錄影入口：

- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 場景：一個任務一個模型，還能走多遠？

第 2 頁回顧課程到目前為止的思考方式：**每個任務訓練一個專門模型**。四個資料領域、四個模型、四個任務。

第 3 頁換成另一個範式：**基礎模型（Foundation Model）**。用大規模、多樣的資料集預訓練一個模型，再透過微調、zero-shot 或 few-shot 接到很多任務。

怎麼判斷一個模型算不算基礎模型？第 4 頁給了兩層標準：

- **一定會看到**：能泛用、穩健地處理很多不同任務
- **常常會看到**：參數量大、資料量大、自監督的預訓練目標

第 7 頁把基礎模型分成五類，並標出本講的主題：Language（ELMo、BERT、GPT、T5）、Classification（CLIP、CoCa）、LM + Vision（LLaVA、Flamingo、GPT、Gemini、Qwen）、Chaining（LMs + CLIP、Visual Programming），以及 And More（Segment Anything、Whisper、DALL·E、Stable Diffusion、Imagen）。

## 直覺：把 SimCLR 的表示空間，擴大到也能放句子

第 9–11 頁先回顧 [L12 的 SimCLR](/posts/ai/2026-09-30-cs231n-self-supervised-learning)：用自監督目標學影像特徵，同一張圖的兩個變形拉近、不同圖推開，希望學到的表示能泛化到新的例子。

第 13 頁問了一個關鍵問題：**如果這個表示空間也能嵌入句子呢？**「我最喜歡的狗是黃金獵犬」和「一隻可愛蓬鬆的貓」如果能和圖片放在同一個空間，要怎麼建出這個圖文聯合空間？

## 機制一：CLIP 的兩個步驟

**第一步：收集大量資料**（第 14–15 頁）。[CLIP](https://arxiv.org/abs/2103.00020) 的訓練資料是從網路上大規模爬下來的圖片和對應的 alt-text，約 4 億組圖文配對。投影片補充這個資料收集方式後來也被重現（[Xu et al., Demystifying CLIP Data, ICLR 2024](https://arxiv.org/abs/2309.16671)）。

**第二步：選損失函數**（第 17–25 頁）。投影片引用 CLIP 作者對先前做法（例如影像描述）的評論：不需要從圖片預測**一字不差**的描述，只要學會**把正確的描述配到圖片上**。

所以 CLIP 用的是和 SimCLR 同一類的對比目標（InfoNCE）：一批 N 張圖和 N 段文字分別經過影像編碼器和文字編碼器，兩兩算相似度得到 N×N 的矩陣。**雙向的 InfoNCE**（圖找文、文找圖）讓對角線上的配對相似度越高越好。投影片註明有些細節沒畫出來，例如溫度參數、向量會先做 L2 正規化。訓練完得到一個能嵌入圖片和文字、並給出圖文相似度分數的模型。

## 機制二：不微調，直接分類

傳統用法（第 26–27 頁）是把預訓練的編碼器接一個線性分類器，轉移到分類、偵測、分割等下游任務。

但語言模型有另一種用法（第 28 頁）：不微調，直接拿來「創意地」使用。例如把影評分類寫成填空題「這則影評『我討厭這部電影』是 ___」。視覺語言模型能不能也這樣？

**CLIP 的巧招**（第 30–37 頁）：

1. 用**文字編碼器**為每個類別產生一個向量，例如 "plane"、"dog"、"bird"
2. 新圖片經過影像編碼器，和每個類別向量算相似度
3. 選最相似的類別

投影片形容這很像 1-NN，只是「訓練資料」換成了文字向量。兩個提示工程的小技巧：

| 做法 | ImageNet 上的提升（投影片） |
|---|---|
| 把類別寫成句子「A photo of a [category]」，因為 CLIP 是用句子訓練的 | +1.3% |
| 用多種句型（「A photo of…」「A drawing of…」）再取平均向量 | +5% |

**結果**（第 38–43 頁）：用 4 億組圖文配對訓練後，CLIP 的 zero-shot 準確率追上在 ImageNet 上訓練的 ResNet-101，而 CLIP **完全沒用人工標註**。更有意思的是泛化：在 ImageNet 上訓練的模型換到 ObjectNet（同樣類別、奇怪視角）表現就掉下來，CLIP zero-shot 卻表現很好，在圖像、素描、對抗資料集上也一樣。

**為什麼沒標註能贏過有標註？** 第 46–48 頁提了三個可能答案：「沒標註」這說法有點誤導（文字本身就是監督）、預訓練規模巨大、測試集外洩。第三點大概不是主因：資料集外洩約 2%。規模的對比是：

| | CLIP | ImageNet ResNet |
|---|---|---|
| 參數 | 3.07 億 | 4,450 萬 |
| 訓練資料 | 4 億張圖 | 128 萬張 |

**兩個常見變體**（第 49–52 頁）：

- **[SigLIP](https://arxiv.org/abs/2303.15343)**：用 sigmoid 取代 softmax。好處是算每個樣本的損失時不必把整批材料化，能省記憶體
- **[CoCa](https://arxiv.org/abs/2205.01917)**：在 CLIP 之外加一個生成目標，也就是多一個帶 captioning loss 的解碼器

## CLIP 式模型的強項與弱點

**強項**（第 54 頁）：

1. 內積非常有效率：容易訓練、方便擴展；推論也快，例如能在 50 億張圖上做檢索
2. 開放詞彙，可以 zero-shot 泛化
3. 可以和其他模型串接（本講後面的 CuPL）

**弱點**（第 55–62 頁）。投影片引用 2022 年 4 月 Tristan Thrush 等人的例子：CLIP **分不出**「there is a mug in some grass」和「there is some grass in a mug」。

1. **太依賴 batch size 學概念。** batch 越大，概念越細：batch 4 時只學到「animal」，100 時學到「dog」，32,000 時學到「Welsh Corgi」。但這條路有極限：就算 batch 有 32K，也不太可能同時看到「草地上的杯子」和「杯子裡的草」。這類問題叫**組合性**，相關評測有 Winoground、CREPE、ARO。一個解法是 hard negative 微調（「horse eating grass」對「grass eating horse」），但它也有自己的問題：「一隻黑貓和一隻棕狗」和「一隻棕狗和一隻黑貓」其實是同一件事，是「hard positive」，不該被推開
2. **整張圖的描述不夠當監督。** 可以改用帶 bounding box 座標的區域描述來訓練
3. **一份 50 億的資料集不可能包含一切。** 資料的收集和過濾必須非常刻意

## 機制三：讓 LLM 看得到圖——LLaVA 與 Flamingo

**動機**（第 65 頁）：做下一個 token 預測的語言模型，推論時能處理數學、情感分析、符號推理等各種任務。能不能做一個**吃圖片和文字、輸出文字**的模型？這就是視覺語言模型（VLM）。

**歷史脈絡**（第 66–67 頁）：VLM 不是從 LLaVA 開始的，至少可以追溯到 2019 年的 [ViLBERT](https://arxiv.org/abs/1908.02265)。但當時每個任務都要各自微調，還要用不簡單的任務專屬方法，例如 RefCOCO 要用 Mask R-CNN 重排 bounding box。這又回到本講開頭批評的「任務專屬」範式。

**[LLaVA](https://arxiv.org/abs/2304.08485) 的關鍵想法**（第 68–75 頁）：LLM 本來就是自迴歸地解碼文字，那就在文字 token 前面**插入圖片 token**。用哪種圖片 token 最好？CLIP 編碼器是好選擇，但要選對層：

- 最後一層的 patch token 沒有被監督（CLIP 的對比損失只看 CLS 或 pooling token），它們就算是亂的，損失也不會變
- 所以用**倒數第二層**。實務上這些 token 對 LLM 保留了最多空間與語言資訊，丟掉 CLS 還能稍微變好

LLaVA 的訓練配方分三步：用預訓練的 LLM（例如 LLaMA）初始化解碼器、用預訓練的 CLIP 當影像編碼器；訓練一個新的線性層，把 CLIP 特徵接到 LLM 的輸入空間；再把 LLM 和線性層一起微調。投影片提到約 17.8 萬筆「圖片＋指令＋輸出文字」的樣本就能得到不錯的表現。

**[Flamingo](https://arxiv.org/abs/2204.14198) 的另一種融合方式**（第 76–85 頁）：影像經過視覺編碼器後，從旁邊接進語言模型的各層，圖片在文字序列裡只留一個 `<image>` 標記。第 78 頁的架構圖標出凍結的部分是視覺編碼器和 LM block，學出來的部分有兩個：一是 Perceiver sampler，把數量不定的圖片 token 轉成固定數量；二是插在 LM block 之間的 gated cross-attention 層（圖上標為 GATED XATTN-DENSE）。訓練資料的排法像語言模型，用 `<image>`、`<eos>` 這類特殊標記表示圖片出現或文字結束。它支援 in-context learning，能做 zero-shot 和 few-shot。

## 2026 的現況：開放權重不等於完全開源

**誰是 SOTA？**（第 86 頁）投影片寫的是 Gemini 被普遍認為是最好的專有 VLM。

**開放模型**（第 87–94 頁）：投影片先區分兩件事——**開放權重**（能下載、在本機跑）和**完全開源**（能重現訓練）。接著以 [Qwen3-VL 技術報告](https://arxiv.org/abs/2511.21631)（2025 年 12 月）說明和 LLaVA 的差異：

1. 原生影像解析度：越大的圖用越多 token，位置編碼改用 2D-RoPE 處理不同尺寸
2. 視覺編碼器改用 SigLIP-2，不是 CLIP
3. 影片的每一幀時間用文字給出，例如 `<0.0 seconds>`
4. 使用 SigLIP-2 第 8、16、24 層的嵌入
5. 四個訓練階段，從接上視覺編碼器開始，後面包含拉長 context

**開放權重的模型多半是蒸餾來的**（第 96–102 頁，[Molmo 與 PixMo](https://arxiv.org/abs/2409.17146)，CVPR 2025）。投影片把模型分成 API only、open weights、distilled、completely open，並拿資料量做對比：Molmo 用的 PixMo 約 70 萬組圖文配對，投影片對照的 Llama 3.1V 則是 60 億組。這是品質與數量的取捨：網路資料常是偶然的（「pink, japan, aesthetic」），人工標註則是刻意的。問題是密集描述很難收集。Molmo 的解法很聰明：**人不喜歡打字，但喜歡講話**。標註者對一張圖講 60 到 90 秒，再自動把語音轉成文字當預訓練資料。

## 機制四：Chaining——把模型串起來

**CuPL**（第 104–107 頁，[Pratt et al.](https://arxiv.org/abs/2209.03320)）：模型遇到沒看過的概念（marimba、viaduct、papillon、lorikeet）怎麼分類？先讓 LLM 產生這個類別的描述，再用描述去分類。

**VisProg**（第 108–116 頁，[Gupta et al.](https://arxiv.org/abs/2211.11559)）：能不能把 chaining 推廣到所有視覺任務？傳統做法是為新任務訓練新模型，或手寫一段 Python 把現有模型串起來（例如跑兩次單圖 VQA 再合併答案），但手寫的程式只適用兩張圖。VisProg 讓 GPT 產生這段程式，組合現成的視覺模型去回答問題。

**Omni 模型**（第 117 頁）：超越視覺和語言，訓練一個模型同時輸入輸出文字、音訊和影片。投影片說這從 2024 年的 GPT-4o 開始，最近 Thinking Machines 和 Gemini 也推出了自己的版本。

## 連回模型：這一講在整門課的位置

回頭看，這一講把前面幾講的零件都收在一起：[L8](/posts/ai/2026-09-30-cs231n-attention-transformers-vit) 的 ViT 是 CLIP 的影像編碼器，[L12](/posts/ai/2026-09-30-cs231n-self-supervised-learning) 的對比學習變成圖文對比，[L7](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks) 的影像描述則是 CLIP 作者認為不必走的那條路。上一講的 [FLUX.1](/posts/ai/2026-09-30-cs231n-generative-models-diffusion) 也用 CLIP 當文字編碼器之一。

**作業對應。** [A3](https://cs231n.github.io/assignments2026/assignment3/) 的 Q4 是 CLIP 與 DINO（`CLIP_DINO.ipynb`、`cs231n/clip_dino.py`）。CLIP 部分沿用 A2 影像描述用過的 COCO 資料，要實作圖文相似度、zero-shot 分類器和以文字找圖的檢索器；其中一個 inline question 就是本講的弱點一：「CLIP 的學習為什麼依賴 batch size？」細節見 [A3 導讀](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip)。

## 想深入

**官方材料**

- [lecture_16.pdf（2026）](https://cs231n.stanford.edu/slides/2026/lecture_16.pdf)
- [lecture_16.pdf（2025）](https://cs231n.stanford.edu/slides/2025/lecture_16.pdf)：多了 Segment Anything 的段落，對應 2025 錄影
- 錄影：[Spring 2025 L16](https://www.youtube.com/watch?v=mQOK0Mfyrkk)
- [A3](https://cs231n.github.io/assignments2026/assignment3/)：Q4 CLIP & DINO

**站內延伸閱讀**（各自完整，重疊部分不刪）

- [CS224N：多模態](/posts/ai/2026-08-22-cs224n-multimodality)——從 NLP 課的角度看同一批模型
- [CS336 Lecture 17：多模態對齊](/posts/ai/2026-08-22-cs336-multimodal-alignment)——從訓練語言模型的角度看影像 token

## 存取限制

依[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級，這門課是 **A3**：2026 投影片、作業與起始碼公開，另有 2025 完整錄影。本講的缺口是 2026 錄影只放在 Canvas、限修課生觀看；而且 2025 錄影和 2026 投影片的內容差異比其他講次大。

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Stanford CS231N 課程首頁（Spring 2026）](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)
- [CS231N Spring 2026 Lecture 16 投影片](https://cs231n.stanford.edu/slides/2026/lecture_16.pdf)
- [CS231N Spring 2025 課表](https://cs231n.stanford.edu/2025/schedule.html)
- [CS231N Spring 2025 Lecture 16 投影片](https://cs231n.stanford.edu/slides/2025/lecture_16.pdf)
- [YouTube：CS231N Spring 2025 Lecture 16: Vision and Language](https://www.youtube.com/watch?v=mQOK0Mfyrkk)
- [CS231N Assignment 3（Spring 2026）](https://cs231n.github.io/assignments2026/assignment3/)
- [Radford et al., Learning Transferable Visual Models From Natural Language Supervision（CLIP）](https://arxiv.org/abs/2103.00020)
- [Zhai et al., Sigmoid Loss for Language Image Pre-Training（SigLIP）](https://arxiv.org/abs/2303.15343)
- [Yu et al., CoCa: Contrastive Captioners are Image-Text Foundation Models](https://arxiv.org/abs/2205.01917)
- [Liu et al., Visual Instruction Tuning（LLaVA）](https://arxiv.org/abs/2304.08485)
- [Alayrac et al., Flamingo](https://arxiv.org/abs/2204.14198)
- [Qwen3-VL Technical Report](https://arxiv.org/abs/2511.21631)
- [Deitke et al., Molmo and PixMo](https://arxiv.org/abs/2409.17146)
- [Pratt et al., What does a platypus look like?（CuPL）](https://arxiv.org/abs/2209.03320)
- [Gupta & Kembhavi, Visual Programming（VisProg）](https://arxiv.org/abs/2211.11559)
