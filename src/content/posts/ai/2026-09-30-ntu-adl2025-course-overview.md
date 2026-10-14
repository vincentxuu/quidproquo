---
title: "深度學習之應用：概念、作業與實作的學習路線｜台大陳縕儂 深度學習之應用 課程總覽"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, deep-learning, nlp]
lang: zh-TW
math: true
series:
  name: "台大陳縕儂 深度學習之應用 導讀"
  order: 0
tldr: "台大陳縕儂《深度學習之應用》（ADL）是以 NLP 為主軸的深度學習課，14 堂分四段：神經網路與反向傳播、序列與 Transformer（詞向量、RNN、attention、BERT）、讓預訓練模型做事（prompt、instruction tuning、RLHF、LoRA、RAG、解碼與評估），以及 LLM 的議題與前沿（偏見與安全、Language Agents、推理、工具使用、多模態）。Fall 2025 的講義與分段影片公開；作業只有 HW1 有完整規格，HW2、HW3 與期末專題只有說明影片。"
description: "台大陳縕儂《深度學習之應用》ADL Fall 2025 系列入口：四段主線各堂在學什麼、一個用三個 key 手算 dot-product attention 的例子、先修與自我檢查、講課與助教課兩條線的讀法與校外拿得到的材料，以及全系列目錄。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

**影片狀態：已附影片。** 導言附第 0 堂課程介紹（29 分 36 秒），各堂分段影片在各堂導讀。[影片來源與說明](#課程影片來源)

《深度學習之應用》（Applied Deep Learning，簡稱 ADL）是台大資工系陳縕儂老師的課，課程網址固定在 [adl.miulab.tw](http://adl.miulab.tw/)。名字叫「深度學習之應用」，實際上以自然語言處理為主軸，課程投影片自己寫的是「ADL focus on NLP」。中文授課、投影片是英文。

課程目標寫得很具體：理解深度學習怎麼運作、怎麼把任務框成學習問題、怎麼用工具實作、怎麼利用預訓練模型，以及特定技術在什麼時候、為什麼有效。整學期照這個順序往上堆：先學會訓練一個網路，再學會處理語言序列，接著學怎麼讓預訓練好的大模型做你要的事，最後看 LLM 帶來的新問題。

這篇是系列入口：先講四段主線各堂在學什麼，再手算一次 attention，最後給先修檢查與讀法。本系列讀的是 Fall 2025（2025/09–12），最近一個已經上完的學期。下面是第 0 堂的課程介紹（29 分 36 秒），講課程目標、先修、評分與 AI 使用規則；評分細節與 AI 使用規則本文沒有寫，看影片。

```youtube
url: https://www.youtube.com/watch?v=RwRZVd9rLxE
title: ADL 0: Course Introduction 課程介紹與規定
```

## 主線：四段

### 神經網路怎麼學（第 1–2 堂）

[第 1 堂](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction)建立兩個觀念：深度學習是把很多簡單函數串成一條生產線，只給兩端的資料，中間每一站做什麼由機器學；要用它解問題，先寫下輸入 X 與輸出 Y，輸出的形式決定任務是分類還是序列預測。[第 2 堂](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)回答訓練的三個問題：模型是一層層 $z = Wa + b$ 再接非線性；好壞用 loss 衡量；用 gradient descent 往下走。參數有上百萬個，梯度靠反向傳播算：forward 一趟存下每層輸出，backward 一趟從輸出層往回算誤差項，兩者相乘就是每個權重的梯度。這兩堂是官方的 HW0，選課前就要看完。

### 序列與 Transformer（第 3–5 堂與作業 1）

[第 3 堂](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn)的主線是語言模型：一次預測下一個詞。詞從 one-hot 走到低維的 word embedding；語言模型從 n-gram（沒看過的組合機率是零）走到 RNN（把前文累積在 hidden state）。RNN 的梯度容易消失或爆炸，爆炸用 clipping，消失靠 LSTM、GRU 的閘門。[第 4 堂](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer)解決「整句壓進一個向量會記不住」：attention 讓解碼器每產生一個字，都回頭對輸入的每個位置打分數、取加權和；Transformer 讓輸入自己對自己做 attention，拿掉 recurrence 換來平行化，代價是要另外補位置資訊。[第 5 堂](/posts/ai/2026-09-30-ntu-adl2025-bert-family)前半講 subword 切詞（BPE 反覆合併最常相鄰的一對），後半講 BERT：遮住 15% 的 token 再填回來，學出看上下文的表示，再微調到下游任務。[作業 1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa) 是中文抽取式問答：從四段文字挑出相關段落，再標出答案的起訖位置。

### 讓預訓練模型做事（第 6–9 堂）

[第 6 堂](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning)把預訓練模型分成三類：encoder 看兩邊、適合理解；decoder 只看左邊、能生成，是目前勝出的一類；encoder-decoder 用去噪預訓練。GPT-3 的 in-context learning 不更新參數就能做任務；接著有兩種 prompt：hard prompt 用人寫的模板把任務改寫成填空，再用 verbalizer 把填進去的字對應到標籤，soft prompt 則直接訓練一串向量當提示。[第 7 堂](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)講「會接話」到「會照指令做事」的兩步：instruction tuning 教模型讀懂任務描述，RLHF 用 reward model 讓回答朝人類偏好靠攏（DPO、KTO 把強化學習那一段拿掉）；後半講只訓練少量參數的 Adapter 與 LoRA。[第 8 堂](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3)講 RAG：讓模型開書考，先依問題檢索段落，再連同問題一起回答；比較 sparse 與 dense retrieval、bi-encoder 與 cross-encoder，以及 prompting、RAG、fine-tuning 各適合什麼情境。[第 9 堂](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation)講生成時怎麼挑字：greedy 每步選最可能的字，beam search 同時保留幾條候選，top-k 與 nucleus sampling 只在機率較高的字裡抽樣；評估則有比對參考答案字詞重疊的 BLEU、ROUGE，以及 perplexity 與用 LLM 評。

### LLM 的議題與前沿（第 10–14 堂）

[第 10 堂](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)把網路資料訓練出的模型的問題分成三類：偏見（目標是公平）、有害內容（目標是安全，jailbreak 就是繞過防護）、幻覺（目標是符合事實，長回答可以拆成最小陳述逐條查）。三者常用的修正手段都是 alignment，但照著不完美的 reward model 最佳化過頭會變差。[第 11 堂](/posts/ai/2026-09-30-ntu-adl2025-language-agents)用推理、記憶、規劃三個概念組織 Language Agents：推理本身也是一種內部行動（CoT、ReAct）；記憶依新近、重要、相關三個分數取回；規劃從一步一步反應走到 tree search。[第 12 堂](/posts/ai/2026-09-30-ntu-adl2025-reasoning)分兩半：test-time scaling 是模型不動、推論時多花運算（多答幾次再選、用 process reward model 逐步評分）；learning to reason 是更新權重，例如 DeepSeek-R1-Zero 只給答案對錯、用強化學習讓推理行為自己長出來。[第 13 堂](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use)講對話系統：傳統上拆成理解、追蹤狀態、決定動作、產生句子四步，語言模型可以一口氣做完，但沒接工具時它說「我幫你查」其實什麼都沒查；Toolformer 讓模型自己產生並篩選使用工具的訓練資料。[第 14 堂](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal)講沒有標註時怎麼學表示：auto-encoder 把輸入壓成短碼再還原，VAE 讓短碼服從高斯分布所以能抽樣生成，對比學習把相似的拉近、不相似的推遠；CLIP 用圖文配對做對比學習，影像分類就不必另外訓練。

助教課是另一條線：Colab 與 PyTorch、NLP 專案流程、LoRA 與 QLoRA、量化、用 vLLM 部署，集中在[助教課篇](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)。

## 手算一次：attention 是加權平均

這是本文的教學例子，用來看第 4 堂的核心運算，以及它為什麼一路用到第 8 堂的檢索與第 9 堂的 temperature。

設查詢向量 $q = (1, 0)$，三個 key：$k_1 = (1, 0)$、$k_2 = (0, 1)$、$k_3 = (-1, 0)$，對應的 value 是 10、20、30。

1. **打分數**：內積 $q \cdot k_i$ 得到 1、0、−1。和 $q$ 方向一樣的 $k_1$ 分數最高。
2. **softmax 變成權重**：$e^1 \approx 2.718$、$e^0 = 1$、$e^{-1} \approx 0.368$，總和約 4.086，權重是 0.665、0.245、0.090，加起來是 1。
3. **加權平均**：$0.665 \times 10 + 0.245 \times 20 + 0.090 \times 30 \approx 14.25$。

輸出偏向 $k_1$ 對應的 10，但另外兩個也有貢獻。

把分數放大一倍（2、0、−2）再算一次：權重變成 0.867、0.117、0.016，輸出約 11.49，幾乎只取 $k_1$。分數的尺度越大，softmax 越尖，attention 越接近「只查一筆」。

**這個例子的意思：** attention 不是挑一個，而是依相似度做加權平均，分數尺度決定它有多「挑」。Transformer 把內積除以 $\sqrt{d_k}$（$d_k$ 是 key 的維度），就是為了不讓維度變大時分數尺度跟著變大、softmax 變得太尖。同樣的「相似度打分再取前幾名」出現在第 8 堂的 dense retrieval；「縮放分數控制分布尖不尖」則是第 9 堂 temperature 在做的事。

## 先修與自我檢查

官方必備是大學程度的微積分與線性代數，建議修過機率、統計與人工智慧導論；程式要熟 Python，作業都用 Python 寫。沒碰過 PyTorch 的話，先看助教課篇的 Dev Infra 助教課與 Colab。

讀完這篇，試著回答：

1. 單一個神經元為什麼做不了 XOR？
   答：一個神經元只畫得出一條直線分界，XOR 的兩類資料不能用一條直線分開，要疊兩層。
2. RNN 的梯度為什麼容易消失或爆炸？各怎麼處理？
   答：反向傳播時同一個權重矩陣連乘很多次；爆炸用 gradient clipping，消失靠 LSTM、GRU 的閘門。
3. 上面的例子如果 $q = (0, 1)$，哪個 value 拿到最高權重？
   答：分數變成 0、1、0，$k_2$ 最高，權重約 0.212、0.576、0.212。輸出剛好是 20，但這組 value 看不出偏向：$k_1$、$k_3$ 權重相同，10 和 30 平均起來也是 20。把 value 換成 10、20、60 再算：$0.212 \times 10 + 0.576 \times 20 + 0.212 \times 60 \approx 26.4$，比三者的平均 30 更靠近 $k_2$ 的 20。
4. 什麼情況用 RAG 比 fine-tuning 合適？
   答：知識常更新、是內部文件、或需要能查證出處時；RAG 不用重新訓練，換文件就能換知識。
5. test-time scaling 和 learning to reason 差在哪？
   答：前者不改模型、推論時多花運算；後者要更新權重，讓模型學會推理。

## 怎麼讀：講課、作業與材料

系列照官方課序排，HW1 獨立成一篇，HW2、HW3 與期末專題併進對應的講課篇，助教課集中成最後一篇。

**建議路線**：先讀第 1、2 堂配影片 1.1–2.5（官方 HW0）→ 讀到第 5 堂後做作業 1 當檢查點（資料要自己找）→ 第 6 堂以後依興趣讀。只想理解 NLP 從 RNN 到 LLM 的主線，講義加影片就夠了。

**材料與限制**：

- 第 1–11 堂有講義與分段影片。第 12–14 堂只在 [Fall 2025 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)上，課程頁只有標題；第 12 堂沒有公開投影片，第 13、14 堂的投影片來自 Fall 2024，文章會標明。
- 反向傳播那支影片（[ADL 2.5](https://youtu.be/BHgssEwMxsY)）有在課程頁上，但不在播放清單裡，只照播放清單看會漏掉。
- 作業只有 HW1 有完整規格，但它的資料與排行榜在 Kaggle 的邀請連結後面，程式與報告交到 NTU COOL，校外讀者拿不到資料，要自己找中文問答資料集照著練。HW2（文言文翻譯的 LLM 微調）與 HW3（RAG 的 retriever 與 reranker 訓練）只有說明影片，資料要自己準備，結果對不上官方評分；期末專題同樣只有說明影片。各篇整理了影片裡講的任務與配分。三份作業都沒有公開解答。
- 助教課的講義在課程頁的連結打不開，同名檔可以改從 [Fall 2024 路徑](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)下載。

**跟著 Fall 2026 上課的讀者**：[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~miulab/f115-adl/)前半換了新講義與影片，堂次也重排過，最容易弄混的是 RAG（Fall 2026 的第 7 堂，本系列的第 8 堂）；Post-Training 移到 RAG 之後，後半各堂的材料還沒更新。

## 本系列篇目

| 堂次 | 篇名 | 對應官方材料 |
|---|---|---|
| 第 1 堂 | [什麼是機器學習與深度學習](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction) | Introduction、影片 1.1–1.3 |
| 第 2 堂 | [神經網路與反向傳播](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop) | NN Basics、Backpropagation、影片 2.1–2.5 |
| 第 3 堂 | [詞向量、語言模型與 RNN](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn) | Sequence Modeling、影片 3.1–3.4 |
| 第 4 堂 | [Attention 與 Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer) | 影片 4.1–4.2 |
| 第 5 堂 | [Tokenization 與 BERT](/posts/ai/2026-09-30-ntu-adl2025-bert-family) | 影片 5.1–5.2；彈性補充 5.3–5.6 |
| 作業 1 | [HW1 中文抽取式問答](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa) | HW1 規格投影片 |
| 第 6 堂 | [預訓練三大類與 Prompt Learning](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning) | 影片 6.1–6.6 |
| 第 7 堂 | [後訓練與高效調整：Instruction Tuning、RLHF、LoRA＋HW2](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf) | 影片 7.1–7.5、HW2 影片 |
| 第 8 堂 | [RAG＋HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3) | 影片 8.1–8.6、HW3 影片 |
| 第 9 堂 | [NLG：解碼、控制與評估](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation) | 影片 9.1–9.5 |
| 第 10 堂 | [偏見、安全、幻覺與對齊＋期末專題](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality) | 影片 10.1–10.3、專題影片 |
| 第 11 堂 | [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents) | 影片 11.1–11.5 |
| 第 12 堂 | [Reasoning](/posts/ai/2026-09-30-ntu-adl2025-reasoning) | 影片 12.1–12.5 |
| 第 13 堂 | [對話系統與工具使用](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use) | 影片 13.1–13.9、Fall 2024 講義 |
| 第 14 堂 | [無標註學習與多模態](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal) | 影片 14.1–14.7、Fall 2024 講義 |
| 助教課 | [助教課：從 PyTorch 到 LLM 部署](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations) | 助教課影片、講義與 Colab |

## 今晚可以做的事

1. 看完上面約 30 分鐘的課程介紹，確認先修。
2. 把「手算一次」的三步自己算一遍，再把 $q$ 換成 $(0, 1)$、value 換成 10、20、60 算一次。
3. 讀[第 1 堂](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction)，配著影片 1.1–1.3。

站內相關入口：[台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)把 ADL 和李宏毅、林軒田的課放在一起比較；同校的[李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)從 AI Agent 切入，和 ADL 由基礎往上堆的順序互補；英文授課的 NLP 主線可以對照 [Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)。

下一篇：[什麼是機器學習與深度學習](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction)

## 課程影片來源

本文是課程總覽，導言嵌入第 0 堂課程介紹；各堂分段影片請從官方課程頁或播放清單查找，各堂導讀也附了對應影片。

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [ADL Fall 2025 官方播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)（77 支）
- [ADL 0: Course Introduction](https://www.youtube.com/watch?v=RwRZVd9rLxE)（導言嵌入，29:36）

查核日期：2026-10-14。

## 更新紀錄

- 2026-10-14：正文改寫成導讀：四段主線逐堂講出機制，補 attention 手算例子與自我檢查，導言嵌入第 0 堂課程介紹；課程規定、存取分級、課程頁問題與 Fall 2026 對照縮成讀法裡的幾段。
- 2026-10-13：第 5 堂與第 7 堂各併成一篇；更新 HW2、HW3 的說明。
- 2026-10-13：重查 Fall 2026 課程頁，補上兩學期的堂次對照。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [ADL Fall 2025（114-1）課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 週課表、講義與影片連結、助教課、作業入口、助教分工
- [Course Logistics 投影片（250901_Course.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — 課程目標、先修、評分、合作規範、HW0
- [2025 Fall 台大資訊 深度學習之應用 NTU CSIE ADL 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [ADL 0: Course Introduction 課程介紹與規定（YouTube）](https://youtu.be/RwRZVd9rLxE)
- [ADL 2.5: Backpropagation（YouTube，不在播放清單內）](https://youtu.be/BHgssEwMxsY)
- [NTU ADL 2025 Fall HW1 規格投影片](https://docs.google.com/presentation/d/1PzKXFOZc9mMhw8NewNZQDDerTpjK9U1Ot1hrALpKSTA/edit?usp=sharing)
- [ADL 2025 Fall Homework 2 說明影片](https://youtu.be/_QiIp0WTRzI)
- [ADL 2025 Fall Homework 3 說明影片](https://youtu.be/tzjmqxw1n8M)
- [ADL 2025 Final Project Introduction](https://youtu.be/UBe9eGPwRyg)、[Final Project Grand Challenge](https://youtu.be/pZxBNlSqy6I)
- [助教課 Colab：Dev Infra & Tooling](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT)、[NLP Lifecycle](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)
- [NLP Lifecycle 助教講義（Fall 2024 路徑同名檔）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)
- [BERT Variants 講義（Fall 2024 路徑）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf)
- [ADL Fall 2026（115-1）課程頁](https://www.csie.ntu.edu.tw/~miulab/f115-adl/) — 進行中的學期，只用來比對
- [陳縕儂 Vivian NTU MiuLab YouTube 頻道](https://www.youtube.com/@VivianMiuLab/playlists)
- 站內：[台大 AI／ML 課程導讀](/posts/learning/2026-09-30-ntu-ai-ml-course-map)
- [Attention Mechanism 投影片（250908_Attention.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Attention.pdf) — 第 4 堂：dot-product attention
- [Transformer 投影片（250908_Transformer.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Transformer.pdf) — 第 4 堂：self-attention 與位置資訊
- [NN Basics 講義（250901_NNBasics.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_NNBasics.pdf) — 第 2 堂：神經網路、gradient descent
