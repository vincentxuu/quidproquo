---
title: "清大高宏宇 NLP 第一週：語言為什麼難，以及 LLM 以前怎麼把文字變成數字"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, ai-course, nlp, information-retrieval, tf-idf, bm25, word2vec]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 1
tldr: "清大高宏宇 NLP 課第一週的 W1_NLP_brief 共 91 頁：先用「Watch for kids」、望遠鏡句的五種讀法、大舅到十一舅的繞口令說明語言為什麼難，再從資訊檢索的角度，把倒排索引、tokenization、stemming、TF-IDF、BM25 講成一條管線。後半段處理這條管線的死穴（同義詞、一詞多義、詞彙對不上），走到 LSA 的 SVD 降維，最後用 Skip-gram、GloVe、FastText 預告稠密詞向量。"
description: "清大高宏宇《自然語言處理》Fall 2025 第一週導讀：依據 W1_NLP_brief.pdf 與 W1 週二、週四錄影，整理歧義例子、NLP 的四個層次、倒排索引、tokenization 與 stemming／lemmatization、停用詞、向量空間模型與 TF-IDF、BM25、Bag of Words 的限制、LSA／LSI 的 SVD 例子、Skip-gram 訓練流程、GloVe 與 FastText，以及 Fall 2026 v2 投影片的差異。"
draft: false
glossary:
  - term: "倒排索引"
    aliases: ["inverted index", "posting list"]
    definition: "以詞為鍵的字典，每個詞指向一串出現位置（文件編號，必要時加上字元位移）。查詢時直接查表，不必逐篇掃描。"
    context: "投影片把它當成資訊檢索的第一步：先建索引求效率，再排序求準確。"
  - term: "stemming"
    aliases: ["詞幹還原", "詞幹提取"]
    definition: "用規則把詞的各種變化形削成同一個索引詞，例如 fishing、fisher 都歸到 fish。輸出不一定是真的單字。"
    context: "投影片以 Porter 演算法（1980）為例，和較慢但輸出真實單字的 lemmatization 對照。"
  - term: "LSA"
    aliases: ["LSI", "latent semantic analysis", "latent semantic indexing", "潛在語意分析"]
    definition: "對詞—文件（或詞—詞共現）矩陣做 SVD，只保留最大的 K 個奇異值，把詞和文件投影到低維的「概念」空間。"
    context: "用來解決「查詢和相關文件用了不同的字，餘弦相似度就很低」的問題。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing-en)

> **版本說明**：本文依據[清大高宏宇《自然語言處理》](https://github.com/IKMLab/NTHU_Natural_Language_Processing) Fall 2025 的 [W1_NLP_brief.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W1_NLP_brief.pdf)（91 頁），對應錄影是 [Week 1 Tue.](https://www.youtube.com/live/X7XJcm9wfFA) 與 [Week 1 Thu.](https://www.youtube.com/live/0hTqSpoNp4o)，事實皆於 2026-09-30 對照投影片核對。本篇只依投影片內容整理，沒有逐字對照錄影。存取等級 **A3**（理由見[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)）。

**系列位置**：上一篇 [系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)｜下一篇 [詞向量與語言模型：從 n-gram 到 RNN](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

打開一個搜尋框，打「計程車」，你大概也想看到寫著「的士」或「出租车」的文章。對人來說這是同一件事；對一個只會比對字串的程式來說，這三個詞毫無關係。

第一週的投影片就在處理這個落差。它回答一個問題：**在大型語言模型出現以前，電腦怎麼把一堆文字變成可以計算、可以排序的東西？** 答案是一條從資訊檢索長出來的管線，以及這條管線撞牆之後的兩次修補：LSA 和詞向量。

## 課程影片來源

影片連結對應本文教材；此處不提供未核對的時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=X7XJcm9wfFA
title: Fall 2025 Week 1 Tue. 錄影
```

```youtube
url: https://www.youtube.com/watch?v=0hTqSpoNp4o
title: Fall 2025 Week 1 Thu. 錄影
```

原始影片：[Fall 2025 Week 1 Tue. 錄影](https://www.youtube.com/watch?v=X7XJcm9wfFA)、[Fall 2025 Week 1 Thu. 錄影](https://www.youtube.com/watch?v=0hTqSpoNp4o)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## 語言對電腦為什麼難

投影片開頭的定義很短：NLP 是讓電腦使用人類語言，被視為機器學習的一個分支；應用包括翻譯、資訊檢索、聊天機器人和資訊查證。接著它用一串例子說明「對人很簡單、對電腦很難」：

- **詞義歧義**：投影片只放了「Watch for kids」和一個問號。watch 可以是「注意」，也可以是「手錶」。
- **句法歧義**：「I saw a man on a hill with a telescope.」投影片列了五種讀法：我用望遠鏡看他、他拿著望遠鏡、望遠鏡在山上、我在山上看一個拿望遠鏡的人，還有把 saw 讀成「鋸」的那一種。
- **推理**：「大舅去二舅家找三舅說四舅被五舅騙去六舅家偷七舅放在八舅櫃子裡九舅借十舅發給十一舅的 1000 元薪水」，問誰是小偷、錢本來是誰的。投影片的標題是「Is reasoning difficult for LLM?」。
- **情境理解**：「冬天：能穿多少穿多少；夏天：能穿多少穿多少。」同一句話，意思相反。
- **同音**：《季姬擊雞記》幾乎每個字都讀 ji，只能靠上下文推敲。
- **閱讀理解**：一段 2017 年「科技大擂台」的題目，要從四個選項選出文章主旨。

接著投影片把語言分成幾個層次，後面整學期的任務都可以掛回這張表：

| 層次 | 在處理什麼 | 例子 |
|---|---|---|
| Morphology（構詞） | 字的結構 | 字首字尾、lemmatization／stemming、拼字檢查 |
| Syntax（句法） | 詞怎麼組成句子 | 詞性標注、句法樹、依存樹 |
| Semantics（語意） | 詞與句子的意思 | 命名實體辨識、關係抽取、詞義消歧、共指消解 |
| Pragmatics（語用） | 不能照字面解析的部分 | 主題切分、摘要 |

中間一段是 LLM 以前的應用巡禮：Twitter 流感預測、情感分析、假新聞偵測，還有一個醫學文獻的例子。Swanson 與 Smalheiser（1994）從論文裡串出「壓力 → 偏頭痛」「壓力 → 鎂流失」「鎂是天然的鈣通道阻斷劑」這類鏈條，推出偏頭痛與鎂濃度的關係。投影片也引用了「80%–90% 的資料是非結構化的」這個說法，替整門課找理由。

## 從資訊檢索的角度第一次碰到文字

投影片把這一段叫「First meet with text: from the view of information retrieval」。資訊檢索的任務是：給定使用者的查詢，找出最相關的一組文件。它拆成兩件事，**建索引求效率，排序求準確**。

### 倒排索引

投影片說最簡單的倒排索引就是一本字典：每個詞是一個鍵，對應一個 bucket（posting list），裡面記下這個詞在整個文件集合裡的所有出現位置。每一筆記錄至少有文件編號；如果每次出現都記下字元位移，就能在搜尋結果裡秀出前後文（投影片舉 Google 搜尋結果的摘要為例），也能支援「兩個詞要靠得很近」的查詢。

### 建索引前的詞彙處理

把文件轉成索引或向量之前，要先做幾件事：

- **Tokenization**：從文件裡抽出詞。去掉 HTML 標籤、標點與特殊字元，把大小寫統一。
- **Stemming**：把詞的變化形歸到同一個索引詞。投影片的例子是一份文件寫 fish 和 fisher，查詢打 fishing 卻找不到它；stemming 把三者都歸成 fish。它也立刻追問：那「fishing rod」怎麼辦？投影片介紹 [Porter 演算法](http://www.tartarus.org/~martin/PorterStemmer/)（1980），用預先建好的字尾規則表，例如 BINARIZATION → BINARIZE。
- **Stemming 還是 lemmatization**：studies 經過 stemming 變成 studi，經過 lemmatization 變成 study。前者靠規則、快、輸出不一定是真的字，適合搜尋引擎；後者靠語料和句法、慢、輸出是真的字，適合語意理解與問答。
- **停用詞**：冠詞、介係詞這類常見詞，拿掉可以讓索引小 20%–30%。但投影片接著丟出三個問題：停用詞表該固定還是動態？要看應用嗎？什麼時候拿？它的例子是「To be or not to be!」，整句都是停用詞。

### 向量空間模型與 TF-IDF

每份文件被表示成一個高維向量，每一維是一個詞。因為詞彙表遠大於單篇文件用到的詞，這種向量非常稀疏。

- **TF（詞頻）**：一個詞在文件裡出現越多次，可能越重要。投影片的定義是出現次數除以文件長度。
- **IDF（逆文件頻率）**：只出現在少數文件裡的詞，比到處都有的詞更能區分文件。IDF = log(n / nⱼ)，n 是文件總數，nⱼ 是含有這個詞的文件數。
- **相似度**：用兩個文件向量的餘弦值排序。

投影片也提醒 TF-IDF 有很多變體，搜尋引擎常對查詢和文件用不同的加權組合（它舉的記號是「ltn.lnc」）。

### BM25

最後一個排序函式是 Okapi BM25（1980 年代），投影片把它定位成「改良版的 TF-IDF」，有兩個自由參數 k 和 b，並寫「一般 k=2、b=0.75」。它沒有展開公式。想看公式與兩個參數各自在控制什麼的讀者，可以對照 [CS224U 資訊檢索篇](/posts/ai/2026-09-29-cs224u-information-retrieval)，那份投影片給的 k 預設值是 1.2，可見這是要調的參數，不是常數。

## Bag of Words 撞到的牆

到這裡，文字已經能變成數字了。投影片接著說明這種「一個詞一個維度」的表示法會壞在哪。

它先用中文例子說明 Bag of Words 丟掉了順序：「錢，不是問題」和「不，錢是問題」用的字一樣，意思相反。再用餐廳評論示範 one-hot：便宜、有名、讚、嫩、難吃、太貴、差、老，每個詞各佔一維，彼此正交。在這個空間裡，「便宜」和「價位低」的距離，跟「便宜」和「難吃」一樣遠。

兩個經典問題：

- **同義詞**（bandit、brigand、thief）：同一個概念用不同的詞表達，會傷到 recall。
- **一詞多義**（bank 是存放重要東西的地方，也是河岸）：同一個詞在不同語境意思不同，會傷到 precision。

投影片把問題推到「概念比對 vs. 字詞比對」：查詢和文件在概念上很接近，餘弦相似度卻很小。原因可能是用了不同地區的說法（計程車、出租车、的士）、不同領域的詞彙（「智慧型行動運算裝置」與「手機」），或是新詞（COVID-19、新冠病毒、SARS-CoV-2 病毒）。

用 WordNet 這類人工詞典解決也有代價：不看上下文、缺新詞、維護成本高，而且很難量化相似度。

解法是**連續、分散式的表示**：用實數向量表示詞，讓相近的詞在空間裡也靠近。投影片在這裡引出 [Bengio 等人 2003 年的神經機率語言模型](http://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf)，以及 Firth（1957）的分布假說：「A word is characterized by the company it keeps.」cat 和 dog 都常出現在 lick 和 fur 附近，所以它們的向量應該相近。

## LSA：用 SVD 找出藏在字詞背後的概念

第一種修補是 Deerwester 等人 1990 年提出的 Latent Semantic Analysis。做法是：在語料上數共現次數，得到一個矩陣，再用 SVD 降維。

投影片的小例子用三句話：「I like deep learning.」「I like NLP.」「I enjoy programming.」建出 7×7 的共現矩陣，取最大的兩個奇異值，把每個詞畫到二維平面上。

比較完整的是 LSI 的例子：10 篇文件標題，前 5 篇是 Linux 開源軟體新聞（Debian、Gentoo、gnuPOD），後 5 篇是基因體新聞（Dolly 羊、DNA 晶片）。原本的詞—文件矩陣裡，Linux 這個詞只出現在 d4。只保留最大的兩個奇異值（K=2）重建之後，Linux 在 d1–d5 都有了正值，在基因體那 5 篇則接近 0。**Linux 從來沒有出現在 d2，LSI 卻判斷它和 d2 相關**，這正是投影片說的「有出現不見得是相關，沒出現不見得是無關」。它也標出重建矩陣裡出現了負值，這在原本的計數矩陣裡不可能發生。

LSA 的問題投影片列了四點：矩陣的大小跟詞彙表一樣（可能是 100,000 × 100,000）、極度稀疏、SVD 的計算成本是二次方、加一個新詞就要重算整個矩陣。

## Word2Vec、GloVe、FastText：預告稠密詞向量

最後一段從機率模型的角度往下走。只看單一詞的 unigram 模型完全不管詞序，看前一個詞的 bigram 模型好一點但上下文太短；word2vec 用一個窗口取得更多上下文，分成兩種：

- **CBOW**：看上下文，猜中間的詞（The cat ___ its fur）。
- **Skip-gram**：看中間的詞，猜上下文（___ licked ___）。投影片說接下來聚焦在這一種。

Skip-gram 的訓練流程投影片一步步畫出來：用窗口大小 1 從「The cat licked its fur. The truck moved.」切出（the, cat）、（cat, licked）這類詞對；網路只有一層隱藏層，輸入到隱藏層的矩陣就是詞向量，隱藏層到輸出的矩陣是另一組「輸出向量」。實作上不做矩陣乘法，直接用詞的編號查表取出向量；再和每個詞的輸出向量做內積、取 softmax，得到整個詞彙表上的機率分布，用 cross entropy 算誤差、更新參數。這一段在第二週會再深入一次，本篇點到為止。

另外兩種詞向量各一頁：

- **[GloVe](https://nlp.stanford.edu/projects/glove/)（2014）**：投影片說 word2vec 擅長學相似度與線性規律，但沒有充分利用共現統計；GloVe 加入了全域統計資訊。
- **[FastText](https://fasttext.cc/)**：考慮字元層級的特徵，所以能替沒看過的詞（OOV）猜出向量，並提供多種語言的預訓練向量。

該用哪一種？投影片的答案是「看情況」。GloVe 用得廣；FastText 也能有好結果；如果你的領域有大量預訓練向量沒收錄的詞，例如處理文言文，就值得用 word2vec 自己訓練。最好的做法是在你的任務上實際比較，評估資料可以用 [WordSim353](http://www.cs.technion.ac.il/~gabr/resources/data/wordsim353/)。

投影片倒數第二頁引用了 Leonie Monigatti 的文章〈[37 Things I Learned About Information Retrieval in Two Years at a Vector Database Company](https://www.leoniemonigatti.com/blog/what_i_learned.html)〉，挑出幾條：BM25 是很強的 baseline、相似不等於相關（「怎麼修水龍頭」和「哪裡買廚房水龍頭」）、向量搜尋對錯字不穩健、out-of-domain 不等於 out-of-vocabulary。這幾條把第一週的傳統方法和後面的 RAG 單元接了起來。

## Fall 2026 的 v2 投影片

2026 首頁 README 的 W1 與 W2 都連到 [W1_NLP_brief_v2.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/W1_NLP_brief_v2.pdf)，共 95 頁，錄影是 [Fall 2026 Week 1](https://youtube.com/live/EEbwXXoVQPY) 與 [Week 2](https://youtube.com/live/MnA5KUETSg4)。和 2025 版比對文字，主線相同，看得到的增補有：

- 詞彙表那一頁加上 LLM 的詞彙量：LLaMA 1、2 與 Mistral 7B 是 32K，GPT-3 是 50K，GPT-4 是 128K，Qwen 是 152K，並問「Bigger = Better?」。
- 語言模型歷史頁補上 Markov 與 Shannon 的具體內容。
- 詞向量段落加了一行中文的做法：CW2Vec 與 Stroke-rich FastText。
- 《季姬擊雞記》標上作者趙元任。

## 讀完這篇可以做什麼

- **今晚**：拿三篇你自己寫過的文章，手算其中幾個詞的 TF-IDF，看看哪些詞分數最高，是不是你心中的關鍵字。
- **想更進一步**：用 scikit-learn 的 `TfidfVectorizer` 加上 `TruncatedSVD`，重現投影片的 LSI 例子，看 K 從 2 改成 5 時「Linux」那一列怎麼變。
- **下一篇**：[詞向量與語言模型](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models)會從 n-gram 與 perplexity 開始，把「預測下一個字」這件事做完整，再走到 RNN。

## 延伸閱讀

- [CS224N 詞向量](/posts/ai/2026-08-22-cs224n-word-vectors)：Stanford 版本的 word2vec 與分布語意講法。
- [CS224U 資訊檢索](/posts/ai/2026-09-29-cs224u-information-retrieval)：BM25 公式、IR 指標與 neural IR。
- [混合搜尋：BM25 + 向量 + RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)：把本篇的 BM25 放進實際的 RAG 檢索系統。

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [W1_NLP_brief.pdf（Fall 2025）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W1_NLP_brief.pdf)
- [W1_NLP_brief_v2.pdf（Fall 2026）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/W1_NLP_brief_v2.pdf)
- [2025 README：Fall 2025 週次表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [Fall 2025 Week 1 Tue. 錄影](https://www.youtube.com/live/X7XJcm9wfFA)
- [Fall 2025 Week 1 Thu. 錄影](https://www.youtube.com/live/0hTqSpoNp4o)
- [Bengio et al. 2003, A Neural Probabilistic Language Model](http://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf)
- [Porter Stemming Algorithm](http://www.tartarus.org/~martin/PorterStemmer/)
- [GloVe: Global Vectors for Word Representation](https://nlp.stanford.edu/projects/glove/)
- [fastText](https://fasttext.cc/)
- [Leonie Monigatti, 37 Things I Learned About Information Retrieval](https://www.leoniemonigatti.com/blog/what_i_learned.html)
