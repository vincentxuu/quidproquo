---
title: "Language——N-gram、Parser、Attention 與 Transformer｜Harvard CS50 AI 第 6 週"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, nlp, n-gram, parser, attention, transformer, bert, language-model, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 7
tldr: "第 6 週講電腦怎麼處理自然語言：先用 context-free grammar 手寫規則剖析句子，再改用統計，從 n-gram、Markov chain 生成文字到用 Naive Bayes 判斷評論的正負；接著用 word2vec 把詞變成向量，用 RNN 的 encoder–decoder 處理整個序列，最後是 attention 與 Transformer。附逐段時間連結，以及 Parser、Attention 兩個專案的解題思路、容易出錯的地方與檢查方式。"
description: "Harvard CS50 AI 第 6 週 Language 導讀：依片名標示 2023 的講課錄影字幕逐段整理語法與語意、context-free grammar 與 NLTK 剖析、n-gram 與 Markov chain、bag-of-words 與 Naive Bayes 情感分析、one-hot 與 word2vec 詞向量、RNN encoder–decoder、attention 與 Transformer，每節附可點的時間連結與自我檢查，另有 Parser 與 Attention（BERT）兩個專案的任務、解題思路、虛擬碼、容易出錯的地方與檢查方式，完整參考實作摺疊在各專案最後。專案規格以 2026 年課程官網為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en)

**影片狀態：已附影片。** 全片 1:05:21。本文的「講課導讀」依這支錄影的英文字幕逐段寫成，每一節開頭有時間連結，點了頁面上的播放器會跳到那一段。講課沒有介紹本週專案，專案部分依課程官網寫成。[跳到播放器](#課程影片與時間軸)｜[影片來源與說明](#課程影片來源)

> ⚠️ **版本提醒**：本週講課錄影的片名標示 **2023**（本系列第 0 到第 5 週的錄影片名標示 2020）；官方筆記註明新版第 6 週講課於 2023-08-14 釋出，內容已經講到 attention 與 Transformer。專案規格、distribution code、check50 slug 以 2026 年課程官網為準（`ai50/projects/2024/x/...`），官網第 6 週的專案是 Parser 與 Attention。2020 年版的 Questions 專案（TF-IDF 問答）現行官網已經不列，這支錄影也沒有教 TF-IDF，本文不收錄。

## TL;DR

第 6 週是這門課的最後一週，主題是讓電腦處理人類的語言。講課順著一條線走：先試著把語法寫成規則（context-free grammar），發現規則寫不完，改從大量文字裡統計（n-gram、Markov chain、Naive Bayes），再把詞換成能表達意思的向量（word2vec），交給神經網路處理整個序列（RNN 的 encoder–decoder）。最後講 attention 與 Transformer：前者讓 decoder 不必只靠一個 hidden state，後者拿掉 RNN 必須逐字依序計算的限制。

這篇分成兩半：前半「講課導讀」跟著錄影走，後半是兩個專案的任務、解題思路與檢查方式，完整參考實作摺疊在各專案最後；講課沒有提到專案。Parser 專案用的就是講課第二節的 context-free grammar，Attention 專案把最後三節講的 attention 畫成看得到的圖。

## 課程影片與時間軸

全片 1 小時 5 分，下面「講課導讀」的九個小節依序涵蓋整支錄影。每一節開頭和文中的時間連結都能點，頁面上的播放器會跳到那一段；某一節看不懂時，直接回去聽講者怎麼講。

```youtube
url: https://www.youtube.com/watch?v=QAZc9xsQNjQ
title: Language - Lecture 6 - CS50's Introduction to Artificial Intelligence with Python 2023
```

YouTube：[Week 6 Language (2023 版)](https://www.youtube.com/watch?v=QAZc9xsQNjQ)

> 時間說明：下表時間已依帶時間碼的英文字幕核對（2026-10-13），是講者開始講各主題的位置，不是官方章節。此表只描述這支片名標示 2023 的錄影，影片本身沒有介紹本週專案。

| 時間（點了從該處播放） | 內容 |
|---|---|
| [0:00–5:13](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=0s) | 自然語言處理的任務，語法（syntax）與語意（semantics） |
| [5:13–13:19](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=313s) | 形式文法與 context-free grammar，用 NLTK 剖析句子 |
| [13:19–19:09](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=799s) | n-gram、斷詞（tokenization）與 Markov chain 生成文字 |
| [19:09–30:57](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1149s) | 文字分類：bag-of-words、Naive Bayes 與 Laplace smoothing |
| [30:57–40:33](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1857s) | 詞的表示：one-hot、分散式表示與 word2vec |
| [40:33–46:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2433s) | 序列到序列：用 RNN 做 encoder–decoder |
| [46:35–52:57](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2795s) | Attention：attention score 與加權平均 |
| [52:57–1:00:10](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3177s) | Transformer 的 encoder：positional encoding、self-attention、multi-headed attention |
| [1:00:10–1:05:21](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3610s) | Transformer 的 decoder、各種變形與全課程收尾 |

> 官方筆記：[Lecture 6 Notes](https://cs50.harvard.edu/ai/notes/6/)（現行版，章節與這支錄影相同）；投影片與講課原始碼 `src6.zip` 在[第 6 週講課頁](https://cs50.harvard.edu/ai/weeks/6/)。

## 講課導讀

以下依錄影的英文字幕逐段寫成。光讀字幕看不到投影片，語法樹、神經網路的方塊圖與 attention 的熱度圖本文不重建，只寫講者口頭說出的內容；圖在[官方筆記](https://cs50.harvard.edu/ai/notes/6/)裡。講者在終端機示範的程式，本文對照了官方的講課原始碼 `src6.zip`，貼出的文法與程式片段取自那份原始碼，另有兩處取自官方投影片，各處會標明。每節結尾的自我檢查都是本文出的題目，不是講課內容；其中沿用講課例子的會寫明，標「本文自擬」的連例子也是本文編的。

### 自然語言處理要做什麼：語法與語意

[錄影 0:00–5:13](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=0s)

講者 Brian Yu 先回顧整門課：前面幾週都是把問題改寫成電腦懂的形式，例如搜尋問題、constraint satisfaction 問題、最佳化問題。這一週反過來，要讓電腦懂人平常用的語言。他把這類工作統稱自然語言處理（natural language processing），舉了五種任務：

- 自動摘要：給一段長文，產生比較短的版本。
- 資訊擷取：從文字裡抽出相關的事實或細節。
- 機器翻譯：把文字從一種語言翻成另一種。
- 問答：對手機或聊天機器人提問，電腦看懂文字後產生回答。
- 文字分類：替一段文字貼標籤，例如正面或負面、收件匣或垃圾信。

在談做法之前，他先講語言本身的兩個難處。

第一個是**語法**（syntax），也就是語言的結構（[2:18](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=138s)）。「Just before nine o'clock Sherlock Holmes stepped briskly into the room.」是結構正確的句子。拿其中一些詞重新排列成「Just before Sherlock Holmes nine o'clock stepped briskly the room」，每個詞都還是合法的英文，但合起來不成句子。

語法還有一個麻煩（[3:12](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=192s)）：同一個句子可能有不只一種正確的結構。「I saw the man on the mountain with a telescope.」可以是我拿著望遠鏡看到那個人，也可以是山上那個人帶著望遠鏡。講者的說法是，自然語言有歧義，同一句話可以有好幾種讀法。

第二個是**語意**（semantics），也就是語言的意思（[3:46](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=226s)）。只知道句子結構正確還不夠，還要知道它在說什麼。「A few minutes before nine, Sherlock Holmes walked quickly into the room.」和前面那一句用的詞不完全相同，意思卻幾乎一樣，理想的模型要看得出來。反過來，結構正確的句子也可能沒有意思。他引語言學家 Noam Chomsky 的名句「Colorless green ideas sleep furiously.」：形容詞修飾名詞 ideas，動詞和副詞的位置都對，整句卻不知所云。

這一節沒有演算法，只是把後面要處理的兩件事分開：結構（語法）與意思（語意）。接下來兩節處理結構，從第五節的詞向量開始處理意思，後面這個對應是本文的整理。

**自我檢查｜先寫下答案，再展開。** 下面兩句都是講課的例子，各自出問題的是語法還是語意？(a) Just before Sherlock Holmes nine o'clock stepped briskly the room. (b) Colorless green ideas sleep furiously.

<details>
<summary>答案</summary>

(a) 是語法出問題：每個詞都是合法的英文，但排列的順序不構成句子。(b) 是語意出問題：形容詞加名詞、動詞加副詞，結構完全正確，合起來卻沒有意思。兩句合在一起說明這是兩個不同的層次，電腦通過其中一關不代表通過另一關。

</details>

### 把語法寫成規則：context-free grammar

[錄影 5:13–13:19](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=313s)

要讓電腦懂句子的結構，第一個想法是直接把規則交給它。英文裡名詞通常在動詞前面，名詞可以被形容詞修飾，如果能把這些規則寫成形式，電腦就能照著用。講者把這種做法叫**形式文法**（formal grammar）：一套用來產生某個語言裡句子的規則。形式文法有好幾種，這一週只講 **context-free grammar**（以下寫 CFG）。

他用「she saw the city」說明 CFG 的三個零件（[6:13](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=373s)）：

- **終端符號**（terminal symbol）：句子裡實際出現的詞，she、saw、the、city。叫終端是因為產生出這個詞之後就沒有東西要再產生了。
- **非終端符號**（nonterminal symbol）：用來產生其他符號的記號。`N` 是名詞（noun），`V` 是動詞（verb），`D` 是限定詞（determiner，像 the、a、an）。
- **改寫規則**（rewriting rule）：箭頭左邊是一個非終端符號，右邊是它可以被換成什麼，多個選項用直線隔開（[7:07](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=427s)）。

下面的規則裡，`N`、`D` 兩列與後三條是講者唸出來的；`V` 的詞他只說「以此類推」，這一列取自官方投影片。投影片上前三列的結尾都有刪節號，表示清單沒有列完。

```text
N  → she | city | car | Harry
D  → the | a | an
V  → saw | ate | walked
NP → N | D N
VP → V | V NP
S  → NP VP
```

後三條的右邊是其他非終端符號。`NP` 是名詞片語（noun phrase）：可以只是一個名詞（she），也可以是限定詞加名詞（the city）。`VP` 是動詞片語（verb phrase）：可以只是一個動詞（walked），也可以是動詞加名詞片語（saw the city）。`S` 是句子，由名詞片語加動詞片語組成。

用這幾條規則走一遍「she saw the city」：`S` 換成 `NP VP`；前面的 `NP` 換成 `N`，再換成 she；`VP` 換成 `V NP`，`V` 換成 saw；後面的 `NP` 換成 `D N`，也就是 the city。每一步都用到一條規則，走完就得到句子的結構：she 是名詞片語，saw the city 是動詞片語，其中 the city 自己又是一個名詞片語。

接著是程式（[9:41](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=581s)）。講者用 Python 的 NLTK（Natural Language Toolkit）套件，`cfg0.py` 先把文法寫成字串交給 NLTK，再請使用者輸入一個句子、切成詞，最後剖析並印出語法樹。下面是官方講課原始碼裡的 `cfg0.py`：

```python
import nltk

grammar = nltk.CFG.fromstring("""
    S -> NP VP

    NP -> D N | N
    VP -> V | V NP

    D -> "the" | "a"
    N -> "she" | "city" | "car"
    V -> "saw" | "walked"
""")

parser = nltk.ChartParser(grammar)

sentence = input("Sentence: ").split()
try:
    for tree in parser.parse(sentence):
        tree.pretty_print()
except ValueError:
    print("No parse tree possible.")
```

輸入 she walked，得到 she 是名詞片語、walked 是動詞片語。輸入 she saw the city，得到 she 是名詞片語、saw the city 整段是動詞片語。專案 Parser 的 `parser.py` 用的是同一組呼叫（`nltk.CFG.fromstring` 與 `nltk.ChartParser`）。

`cfg1.py` 的文法比較大（[11:08](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=668s)）。句子仍然是名詞片語加動詞片語，另外多了形容詞片語 `AP` 與介系詞片語 `PP`，名詞片語前面可以加形容詞片語，名詞後面可以接介系詞片語。原始碼裡的規則是：

```text
S  -> NP VP
AP -> A | A AP
NP -> N | D NP | AP NP | N PP
PP -> P NP
VP -> V | V NP | V NP PP
```

輸入 she saw the wide street，NLTK 剖析出一棵樹：動詞片語裡的名詞片語包含一個形容詞。輸入 she saw the dog with the binoculars（[12:07](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=727s)），NLTK 給出兩棵樹，對應這句話的兩種讀法：

- the dog with the binoculars 整段是一個名詞片語，帶著望遠鏡的是狗。
- the dog 是名詞片語，with the binoculars 是修飾 saw 的介系詞片語，她用望遠鏡看到狗。

上一節說的歧義，在這裡變成「同一個句子有兩棵合法的語法樹」。本文用這兩份文法實跑過，結果和講者說的相同：前三個句子各一棵樹，最後一句兩棵。

講者最後點出這條路的限制（[13:05](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=785s)）：一切都靠人把規則寫出來。要替別人可能寫出或說出的每一種英文句子寫規則，工作量非常大，規則也會非常複雜。

**自我檢查｜先寫下答案，再展開。** 只用 `cfg0.py` 的文法，下面三個句子哪些能剖析？(a) the city saw she (b) she saw the the city (c) saw the city（本文自擬）

<details>
<summary>答案</summary>

(a) 可以。the city 是 `D N`，符合 `NP`；saw she 是 `V NP`，符合 `VP`；合起來是 `NP VP`。這句英文其實不通（受詞該用 her），但文法裡 she 只是一個 `N`，規則沒有分主詞與受詞，所以照樣接受。

(b) 不行。`NP` 只能是 `N` 或 `D N`，沒有一條規則允許兩個 `D` 連在一起。

(c) 不行。`S` 只有 `NP VP` 一條規則，句子必須以名詞片語開頭，而 saw 只能是 `V`。

三句都用 `cfg0.py` 的文法實跑過。(a) 說明規則寫得太鬆會接受不該接受的句子；順帶一提，`cfg1.py` 因為有 `NP -> D NP`，會接受 (b) 這種連續兩個 the 的句子，Parser 專案的規格特別要你避免這種情況。這一段關於 (a) 與 `cfg1.py` 的說明是本文的補充。

</details>

### 改用統計：n-gram、斷詞與 Markov chain

[錄影 13:19–19:09](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=799s)

規則寫不完，講者換一個角度：給電腦大量現成的英文句子，看能從資料裡學到什麼。一次讀懂一長段文字太難，所以先把它切成小塊。

**n-gram** 是一段文字裡連續的 n 個項目，項目可以是字元，也可以是詞。n 等於 3 叫 trigram，n 等於 2 叫 bigram。講者拿福爾摩斯小說裡的一段話找 trigram，開頭幾個是：how often have、often have I、have I said、I said to、said to you、to you that。每往右移一個詞就得到下一個。如果讓電腦從一大份語料庫（corpus）裡把所有 trigram 抽出來，它就能知道哪些三個詞的組合常常連在一起出現，對語言的結構有一點概念。

`ngrams.py` 做的就是這件事（[14:54](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=894s)）：把一個資料夾的文字檔讀進記憶體，用 NLTK 的 `ngrams` 函式抽出所有 n-gram，再用 Python 的 `Counter` 數哪些最常出現。資料是幾篇福爾摩斯故事。

| n | 最常出現的 n-gram（依講者唸的順序） |
|---|---|
| 2 | of the、in the、it was |
| 3 | it was a、one of the、I think that |

要做到這一步，得先做**斷詞**（tokenization）（[16:31](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=991s)）：把一串字元切成一段一段。這裡是切成一個個詞，再看這些詞的序列。

有了 n-gram 能做什麼？講者接回第 2 週講機率時教過的 **Markov chain**（[16:58](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1018s)）：一串值，其中每個值可以依前面的值來預測。知道哪些詞常跟在哪些詞後面，就能預測下一個詞可能是什麼，於是可以替語言建一個 Markov chain，產生和輸入資料有相同統計規律的文字。

示範用的輸入是 `shakespeare.txt`，內容是莎士比亞的作品。`generator.py` 用一個第三方套件（原始碼裡是 `markovify`）讀進文字、訓練一個 Markov 模型，再請它產生五個句子。這些句子不一定出現在原文裡，只是依照同樣的統計規律，一個詞接一個詞預測出來的。

講者立刻補上限制（[18:52](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1132s)）：到目前為止，沒有任何東西保證產生的句子有意思或說得通，它們只是符合電腦看過的統計規律。怎麼產生比較有意義的文字，他說後面會再回來談。

**自我檢查｜先寫下答案，再展開。** 講課那段話的開頭是「how often have I said to you that」，共 8 個詞，講者從中列出 6 個 trigram。同樣這 8 個詞有幾個 bigram？前三個是什麼？另外，用 Markov chain 產生的句子保證了什麼、沒保證什麼？

<details>
<summary>答案</summary>

7 個 bigram。n 個詞裡，連續 k 個詞的組合有 n − k + 1 個：trigram 是 8 − 3 + 1 = 6，和講者列的數量相同；bigram 是 8 − 2 + 1 = 7。前三個是 how often、often have、have I。這個公式是本文補的，講者只列了例子。

Markov chain 保證的是統計規律：每一步選的詞，都是訓練資料裡常跟在前面那些詞後面的詞。它不保證句子有意思，也不保證整句說得通，因為每一步只看前面少數幾個詞。

</details>

### 文字分類：bag-of-words 與 Naive Bayes

[錄影 19:09–30:57](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1149s)

接下來換一個問題：**文字分類**（text classification），替一段文字貼上類別。信箱要判斷一封信該進收件匣還是垃圾信匣；**情感分析**（sentiment analysis）要判斷一段文字是正面還是負面。講者用四則商品評論當例子：

1. My grandson loved it! So much fun.
2. Product broke after a few days.
3. One of the best games I've played in a long time.
4. Kind of cheap and flimsy, not worth it.

人一眼就看得出第 1、3 則是正面，第 2、4 則是負面。怎麼看出來的？多半是注意到幾個關鍵詞：loved、fun、best 常出現在正面評論，broke、cheap、flimsy 常出現在負面評論。如果電腦能學到哪些詞和哪一種評論有關，就能做同樣的判斷。

**Bag-of-words**（[21:01](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1261s)）是把文字看成一堆沒有順序的詞。哪個詞先、哪個詞後都不管。講者承認這樣丟掉了資訊，詞序明明很重要，他說後面會回來處理；現在先簡化。

在這個模型上，他建了一個 **Naive Bayes** 分類器（[21:37](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1297s)），用的是第 2 週教過的貝氏定理：

```text
P(b | a) = P(a | b) × P(b) ÷ P(a)
```

想知道的是「看到 my grandson loved it 這則評論，它是正面的機率」。用 bag-of-words 的看法，評論就是 my、grandson、loved、it 四個詞都出現，順序不管。套進貝氏定理：

```text
P(正面 | my, grandson, loved, it)
  = P(my, grandson, loved, it | 正面) × P(正面) ÷ P(my, grandson, loved, it)
```

講者分兩步把它化簡。

第一步，分母和「正面還是負面」無關，兩種情況算出來都一樣，所以可以不算，只說機率**正比於**分子，最後再把正面與負面兩個值正規化，讓它們加起來等於 1。分子依聯合機率的定義，就是「評論是正面，而且四個詞都出現」的聯合機率。

第二步是名稱裡「naive」的由來（[24:28](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1468s)）：假設每個詞出現與否彼此獨立，只和評論是正面或負面有關。也就是說，grandson 出現在評論裡，不會改變 loved 出現的機率。講者明說這個假設實際上多半不成立，但它讓計算變簡單，結果也還不錯。有了這個假設：

```text
P(正面 | my, grandson, loved, it)
  ∝ P(正面) × P(my | 正面) × P(grandson | 正面) × P(loved | 正面) × P(it | 正面)
```

右邊每一項都能從標好正負的訓練資料數出來：

- `P(正面)`：正面評論的數量除以全部評論的數量。
- `P(loved | 正面)`：含有 loved 的正面評論數量，除以正面評論的數量。

講者給了一組資料（[26:19](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1579s)）：49% 的評論是正面，51% 是負面；正面評論有 30% 含 my，負面有 20%；正面評論有 1% 含 grandson，負面有 2%。loved 與 it 兩列他沒有唸出數字，下表這兩列取自官方筆記的圖。

| | 正面 | 負面 |
|---|---|---|
| 這一類評論的比例 | 0.49 | 0.51 |
| 含 my | 0.30 | 0.20 |
| 含 grandson | 0.01 | 0.02 |
| 含 loved | 0.32 | 0.08 |
| 含 it | 0.30 | 0.40 |

把每一欄從上到下乘起來。講者只說「得到某個值」，下面兩個乘積是本文照表算的，和官方筆記圖上的數字相同：

```text
正面：0.49 × 0.30 × 0.01 × 0.32 × 0.30 = 0.00014112
負面：0.51 × 0.20 × 0.02 × 0.08 × 0.40 = 0.00006528
```

這兩個值加起來不是 1，還不是機率分布。正規化之後，正面是 0.00014112 ÷ (0.00014112 + 0.00006528) ≈ 0.68，負面約 0.32。這兩個結果講者有唸出來：模型認為這則評論有 68% 的機率是正面。

接著是這個做法會出的問題（[27:44](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1664s)）。假如訓練資料裡 grandson 從來沒有出現在正面評論，`P(grandson | 正面)` 就是 0，整串乘下來正面那一邊也是 0。模型會說這則評論不可能是正面，只因為裡面有 grandson。這個結論不合理：詞很少見的時候，訓練資料裡剛好沒有它，並不代表它不可能出現在正面評論裡。

解法是**加法平滑**（additive smoothing）：替分布裡的每個值加上一個數 α，把資料稍微抹平。常見的一種是 **Laplace smoothing**，每個值加 1，等於假裝每個詞都比實際多看過一次。從沒看過的當成看過一次，看過一次的當成兩次，這樣就不會乘到 0。

用一組數字看差別（本文自擬，講者沒有給數字）：假設訓練資料有 20 則正面評論，沒有一則含 grandson。不做平滑時，`P(grandson | 正面)` = 0 ÷ 20 = 0。做 Laplace smoothing 時，「含 grandson」與「不含 grandson」兩種情況各多算一次，估計變成 (0 + 1) ÷ (20 + 2) = 1 ÷ 22 ≈ 0.045，不再是 0。另一個在 20 則裡出現 5 則的詞，從 5 ÷ 20 = 0.25 變成 6 ÷ 22 ≈ 0.27，只動了一點。分母加 2 是因為兩種情況各加了 1；這個算式是本文依講者「每個值加 1」的說法寫的。

最後是程式示範（[29:21](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1761s)）。`sentiment.py` 讀進一小份正面評論（例如「It was great! So much fun」）與負面評論（例如「Not worth it」「Kind of cheap」），訓練一個 Naive Bayes 分類器，再請使用者輸入一句話。

| 輸入 | 分類器的輸出 |
|---|---|
| I enjoyed it | 正面的機率約 0.92 |
| kind of overpriced | 負面的機率約 0.96 |

**自我檢查｜先寫下答案，再展開。** 用上面那張表，算「my grandson」這則只有兩個詞的評論是正面的機率。和四個詞的結果比，是哪一個詞把判斷翻過來的？（評論是本文自擬的，數字用講課的表）

<details>
<summary>答案</summary>

正面：0.49 × 0.30 × 0.01 = 0.00147。負面：0.51 × 0.20 × 0.02 = 0.00204。正規化：0.00147 ÷ (0.00147 + 0.00204) = 0.00147 ÷ 0.00351 ≈ 0.42。只看 my 和 grandson，模型認為正面的機率是 0.42、負面是 0.58，會判成負面：my 雖然偏正面（0.30 對 0.20），抵不過 grandson 在負面評論裡出現的比例（0.02）是正面（0.01）的兩倍，負面評論本來也稍微多一點。

加上 loved 與 it 之後變成 0.68。翻盤的是 loved：它在正面評論出現的比例是 0.32，負面只有 0.08，差了四倍，足以蓋過 grandson 與 it（0.30 對 0.40）往負面拉的力道。

</details>

### 把詞變成向量：one-hot、分散式表示與 word2vec

[錄影 30:57–40:33](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1857s)

Naive Bayes 能用，但要靠幾個假設。講者接著問：能不能用機器學習的工具，更充分利用語言資料？前幾週一再出現的做法是把輸入變成數字。神經網路的輸入和輸出都是向量，所以要先想辦法把詞變成向量，而且向量要能表達詞的意思。

最直接的做法是 **one-hot 表示**（[32:02](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=1922s)）。以「He wrote a book」為例：

```text
he    = [1, 0, 0, 0]
wrote = [0, 1, 0, 0]
a     = [0, 0, 1, 0]
book  = [0, 0, 0, 1]
```

每個詞的向量只有一個位置是 1，其餘是 0。每個詞都有自己的向量，可以餵給神經網路了。但講者指出兩個問題：

1. 這裡只有四個詞。詞彙有幾千幾萬個的時候，每個詞要一個不同的向量，向量就會很長，難處理也難訓練。
2. 意思相近的詞，向量應該也要相近，在向量空間裡靠在一起。one-hot 做不到：wrote 和 authored 意思差不多，book 和 novel 也是，但它們的 1 都在不同的位置，向量完全不同。

所以想要的是**分散式表示**（distributed representation）（[34:05](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2045s)）：每個詞對應一個向量，詞的意思分散在很多個數值上，而且相近的詞有相近的向量。

這些數值從哪裡來？講者引英國語言學家 J. R. Firth 的話：「You shall know a word by the company it keeps.」也就是用一個詞周圍出現的詞來定義它的意思。看「for ___ he ate」這個上下文，空格裡填 breakfast、lunch、dinner 都說得通。這三個詞出現在相似的上下文，所以意思應該相近。這件事電腦學得來：讀一大份語料庫，看哪些詞出現在相似的上下文，就讓它們的向量靠近。

**word2vec** 是做這件事的常見模型（[35:39](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2139s)）。講者只講了概念：一開始每個詞放在空間裡隨機的位置，用資料訓練的過程中，模型學到哪些詞出現在相似的上下文，並把向量往對的方向移，最後 breakfast、lunch、dinner 會聚在一起，book、memoir、novel 也是。

程式示範（[36:24](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2184s)）用的是訓練好的結果。`words.txt` 每一行是一個詞和它的 word2vec 向量；`vectors.py` 把它讀成字典，另外定義 `distance`（兩個詞向量的距離）與 `closest_words`（向量最接近的幾個詞）。講者在 Python 直譯器裡試了幾組：

| 詞 | 距離 |
|---|---|
| book 與 novel | 0.34 |
| book 與 breakfast | 約 0.64 |
| lunch 與 breakfast | 約 0.2 |

講者說可以把 0 讀成非常接近、1 讀成離得很遠。單看 book 的向量是一長串沒有意義的數字，拿來和別的詞的向量比才有意義。和 book 最接近的 10 個詞，第一個是 book 自己，接著是 books、essay、memoir、essays、novella、anthology 等等。

word2vec 還附帶抓到詞與詞之間的關係（[39:03](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2343s)）。把 king 的向量減掉 man 的向量，得到的是「從 man 走到 king」的那個向量。把它加到 woman 上，再問最接近的詞是什麼，答案是 queen：

```text
closest_word(king − man + woman) = queen
```

**自我檢查｜先寫下答案，再展開。** 依講者報的三個距離，book–novel、book–breakfast、lunch–breakfast 哪一對意思最接近、哪一對最遠？如果改用 one-hot 表示，wrote–authored 和 wrote–book 這兩對的距離會有差別嗎？

<details>
<summary>答案</summary>

距離越小越接近：lunch–breakfast（約 0.2）最近，其次是 book–novel（0.34），book–breakfast（約 0.64）最遠。這和直覺一致，兩餐飯比一本書和一頓早餐像得多。

用 one-hot 的話沒有差別。任何兩個不同的詞，1 都在不同的位置，兩個向量沒有任何位置同時不是 0，所以每一對不同的詞都一樣遠。wrote 和 authored 的距離，會等於 wrote 和 book 的距離。這就是講者說的第二個問題。補充一點：`vectors.py` 的 `distance` 用的是 cosine distance，照這個算法，任何兩個不同的 one-hot 向量距離都是 1。這一句是本文對照原始碼補的，講者沒有說距離怎麼算。

</details>

### 序列進、序列出：RNN 的 encoder–decoder

[錄影 40:33–46:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2433s)

詞能寫成向量之後，就能當神經網路的輸入或輸出。講者先回顧神經網路在做什麼：輸入進去、輸出出來，用訓練資料調整裡面的權重，讓輸入到輸出的對應越來越準。於是可以想像丟一個詞進去、拿一個詞出來。

這在**機器翻譯**用得上，例如把英文的 lamp 丟進去，得到法文的同一個詞。但翻譯通常以整個句子或段落為單位，很少一個詞對一個詞。這裡有個問題（[42:12](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2532s)）：神經網路的輸入與輸出大小是固定的，句子的長度不固定。所以要解決的是「把一個序列轉成另一個序列」。問答也是同一種問題：輸入「What is the capital of Massachusetts」，希望輸出「The capital is Boston」。

工具是上一週看過的**遞迴神經網路**（recurrent neural network，RNN）（[43:06](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2586s)）：把同一個網路跑很多次，每次吃序列裡的一個值，並把一份 **hidden state** 從這一次傳給下一次，用它記住到目前為止的相關資訊。

講者用的架構叫 **encoder–decoder**（[43:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2615s)）：encoder 把問題編成 hidden state，decoder 再把 hidden state 解成想要的輸出。他用那個問句逐步走了一遍。

Encoder 這一半：

1. 第一個詞 what 進網路，產生一份 hidden state。
2. 第二個詞 is 進同一個網路，同時拿到上一步的 hidden state，產生新的 hidden state。
3. the、capital、of、Massachusetts 依序重複，每一步都吃一個詞與上一步的 hidden state。走完得到最後一份 hidden state。
4. 輸入沒有東西了，送進一個特殊的 end token 表示結束。

Decoder 這一半（[44:56](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2696s)）：

1. 產生第一個詞 the，同時產生一份 hidden state。
2. 要產生下一個詞，知道上一個詞是什麼會有幫助，所以把 the 送回 decoder，連同 hidden state，產生 capital。
3. 把 capital 送回去，產生 is。
4. 再一次，產生 Boston。
5. 怎麼知道結束了？再跑一次：把 Boston 送回去，這次的輸出是 end token。

整理起來：輸入序列進 encoder，encoder 是一個 RNN，沿路產生 hidden state，直到最後一份；decoder 也是一個 RNN，拿這份 hidden state 產生輸出序列。

**自我檢查｜先寫下答案，再展開。** 依講課的走法，答案「the capital is Boston」只有四個詞，decoder 總共跑了幾次？第四次跑的時候，它拿到哪些輸入、產生什麼？

<details>
<summary>答案</summary>

五次。前四次各產生一個詞（the、capital、is、Boston），第五次把 Boston 送進去，產生 end token，程式看到它才知道該停。少了第五次，decoder 沒有辦法表示「答案到這裡結束」。

第四次的輸入是上一步產生的詞 is，以及上一步留下的 hidden state；輸出是 Boston 和一份新的 hidden state。decoder 每一步手上只有這兩樣東西，下一節要處理的問題就從這裡來。

</details>

### Attention：讓 decoder 自己決定看輸入的哪裡

[錄影 46:35–52:57](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2795s)

講者說，RNN 和它的各種變形有好幾年是自然語言處理最好的做法，但有問題要解決。第一個出在 encoder（[47:04](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2824s)）：整個輸入序列被編成最後那一份 hidden state，產生輸出所需要的一切資訊都得塞在裡面。序列短還可以，序列越長越難。

比較好的做法是產生輸出時不只看最後一份，而是參考 encoder 沿路產生的每一份 hidden state。可是這麼多份要怎麼合成一份？加起來或取平均都行，但那等於假設每一份同樣重要。實際上不是：每一份 hidden state 主要對應輸入的某一個詞，有些詞比較重要；而且產生輸出的不同位置時，重要的輸入詞也不一樣。

真正需要的，是讓模型自己決定在哪個時間點該注意哪些輸入。這就是 **attention** 的核心想法（[48:37](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2917s)）。

回到同一個例子。輸入是 What is the capital of Massachusetts，輸出已經產生了 the capital is，現在要產生第四個詞。Attention 機制替輸入的每個詞算一個 **attention score**，代表「現在這一刻，這個詞有多值得注意」。產生第四個詞的時候，最該注意的大概是 capital 與 Massachusetts。

分數怎麼算，講者說有好幾種機制：可以簡單到用內積（dot product）看兩個向量有多像，也可以訓練一整個神經網路來算。重點是怎麼算分數是在訓練過程中學出來的，模型自己學會決定下一個詞時該注意什麼。

有了分數之後（[50:51](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3051s)）：每個輸入詞都對應一份 hidden state 向量，這份向量記著句子到那個詞為止的資訊，但主要是那個詞本身。把每份向量乘上它的 attention score 再全部加起來，也就是取**加權平均**，得到一個新的向量。它代表輸入的上下文，但特別偏重被認為重要的那幾個詞。把這個向量交給 decoder，decoder 就能決定下一個詞是 Boston。

講者接著展示了提出這個想法的論文裡的一張圖（[51:37](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3097s)），任務是英文翻法文。講者沒有說是哪一篇；官方投影片在圖旁註記這張圖改自 Bahdanau 等人 2015 年的〈Neural machine translation by jointly learning to align and translate〉。圖的上方是英文輸入，左邊是法文輸出，每個方格是一個 attention score，顏色越亮分數越高。圖上看得到法文詞與對應英文詞之間明顯的對應：產生法文的「agreement」時，主要在看英文的 agreement。有時會同時看好幾個詞：法文的「economic」主要看英文的 economic，也看了 European。講者說 attention score 很容易畫成圖，可以用來看模型做決定時到底在注意什麼。

**自我檢查｜先寫下答案，再展開。** 假設輸入只有三個詞，它們的 hidden state 是 h₁ = (1, 0)、h₂ = (0, 1)、h₃ = (1, 1)，產生某個輸出詞時的 attention score 是 0.1、0.2、0.7。交給 decoder 的向量是多少？和直接取平均差在哪裡？（本文自擬，分數加起來等於 1 也是本文的設定）

<details>
<summary>答案</summary>

加權平均：0.1 × (1, 0) + 0.2 × (0, 1) + 0.7 × (1, 1) = (0.1 + 0.7, 0.2 + 0.7) = (0.8, 0.9)。

直接平均是 ((1 + 0 + 1) ÷ 3, (0 + 1 + 1) ÷ 3) ≈ (0.67, 0.67)，三個詞各佔三分之一。加權平均的結果靠近 h₃ 的 (1, 1)，因為第三個詞的分數最高。換一個輸出位置，分數不同，同樣三份 hidden state 會合出另一個向量；直接平均則不管產生哪個詞都一樣，這正是講者說取平均不夠好的原因。

</details>

### Transformer 的 encoder：平行處理、positional encoding 與 self-attention

[錄影 52:57–1:00:10](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3177s)

RNN 加上 attention 已經很好用，但 RNN 還有另一個問題：每一次執行都要用到前一步的輸出。這讓網路知道詞的先後順序，卻也代表前一個詞的 hidden state 沒算完，這一個詞就不能算。整個過程很難平行化（[53:21](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3201s)）。講者把這件事連到大型語言模型的發展：訓練資料越多，模型越準，於是模型和資料集越來越大，訓練時間也越來越長，不能平行化就成了越來越嚴重的問題。這是 **Transformer** 架構的主要動機之一（[54:21](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3261s)）。講者說 Transformer 有很多種，他只講一種基本架構。

先看 encoder。RNN 的 encoder 得照順序一個詞一個詞走；Transformer 讓每個詞各自通過同一個神經網路，得到那個詞的**編碼表示**（encoded representation）。詞與詞之間不用互相等，全部可以同時算。講者提醒：他只畫一個詞的流程，其他每個輸入詞都在同時做一樣的事。

平行化的代價是詞序不見了（[56:16](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3376s)）。「Sherlock Holmes gave the book to Watson」和「Watson gave the book to Sherlock Holmes」意思不同。RNN 因為一個詞一個詞依序跑，順序是自動帶進去的；Transformer 每個詞獨立處理，就沒有這份資訊。

補救的方法是 **positional encoding**（[56:50](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3410s)）：一個表示「這是句子裡第幾個詞」的向量。把它加到輸入詞的向量上，相加的結果同時帶著兩種資訊，這個詞是什麼、它在句子的哪裡。這個結果再送進神經網路，網路就能同時用到兩者。

除了 positional encoding 與這個前饋神經網路（feed-forward neural network），還要加一個 **self-attention** 步驟（[57:46](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3466s)）。這裡的 attention 看的是其他輸入詞：一個詞該怎麼解讀，會隨著輸入裡的其他詞而變，所以讓每個輸入詞自己決定要注意輸入裡的哪些詞，再決定自己的編碼表示。講者給的理由是詞由它的上下文定義；這和第五節 Firth 那句話是同一個想法，這個連結是本文的整理。

Self-attention 很有用，所以 Transformer 常常同時用好幾個 self-attention 層，讓模型一次注意輸入的好幾個面向。這叫 **multi-headed attention**（[58:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3515s)），每個 attention head 可以注意不同的東西。

照深度學習的慣例，「multi-headed self-attention 層加神經網路層」這兩步可以重複疊很多次，學到更深的規律。全部輸入詞都加上 positional encoding、通過這些層之後，得到每個詞的編碼表示，這就是 encoder 的輸出。

**自我檢查｜先寫下答案，再展開。** 如果把 positional encoding 拿掉，依講者的說法，Transformer 的 encoder 處理「Sherlock Holmes gave the book to Watson」和「Watson gave the book to Sherlock Holmes」時會少掉什麼？為什麼 RNN 沒有這個問題？

<details>
<summary>答案</summary>

少掉的是詞的位置。兩句用的是同一組詞，差別只在誰排在前面，而這正是「誰把書給誰」的依據。Transformer 的每個詞各自平行處理，輸入裡如果沒有另外帶著位置，模型就沒有任何依據分辨這兩句。

RNN 一次只吃一個詞，並把 hidden state 傳給下一步，所以先吃到 Sherlock Holmes 還是先吃到 Watson，後面的 hidden state 就不一樣，順序是計算過程自動帶進去的。代價是不能平行。Transformer 換到了平行化，就得用 positional encoding 把順序補回來。

</details>

### Transformer 的 decoder 與課程收尾

[錄影 1:00:10–1:05:21](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3610s)

Decoder 的結構和 encoder 很像。要產生下一個輸出詞時，輸入是上一個輸出詞，加上它的 positional encoding（現在在輸出序列的第幾個位置）。接著是同樣的兩步：self-attention 與神經網路，也可以重複很多層。這裡的 self-attention 是讓輸出詞去注意同一個輸出裡的其他詞，因為決定下一個詞時需要知道前面已經產生了什麼。

Decoder 多了一個步驟（[1:00:41](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3641s)）：另一個 attention，讓輸出詞去注意 encoder 產生的那些編碼表示。產生輸出序列的每一個 token 時，都要能決定輸入詞的哪些編碼表示和現在這一步有關，這一步做的就是這件事。

兩半合起來：encoder 吃進所有輸入詞，產生編碼表示；decoder 拿上一個輸出詞，注意已經產生的輸出，也注意編碼過的輸入，然後產生下一個輸出詞。講者說這只是 Transformer 可能的架構之一，關鍵是這些讓詞彼此注意的 attention 步驟。訓練時不必等詞一個一個依序處理，所以容易平行化；attention 該怎麼做，也是訓練中學出來的。

他最後提到這個模型有很多變形（[1:02:43](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3763s)）：有的 Transformer 只用 encoder，有的只用 decoder，有的是其他組合，核心想法不變。他沒有舉任何一個模型的名字。

收尾時（[1:03:30](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3810s)）講者回顧了整門課的七個主題：搜尋、知識、不確定性、最佳化、機器學習、神經網路，以及這一週的語言。

**自我檢查｜先寫下答案，再展開。** Transformer 的 decoder 產生一個輸出詞時，會經過兩種 attention。它們各自在注意什麼？哪一種是 encoder 沒有的？

<details>
<summary>答案</summary>

第一種是 self-attention，注意的是輸出序列裡已經產生的其他詞，用來知道前面寫了什麼。Encoder 也有 self-attention，只是那裡注意的是輸入的其他詞。

第二種是 decoder 多出來的 attention，注意的是 encoder 產生的編碼表示，也就是輸入的每個詞。它的角色和上一節 RNN 上的 attention 相同：決定產生這一個輸出詞時，輸入的哪些部分最相關。把這兩節連起來看的這句話是本文的整理。

</details>

## 專案 6A：Parser —— 用 CFG 剖析句子並抽出名詞片語

> 本站對專案解答的處理方式：下面兩個專案都先講任務、官方給的程式、解題思路、虛擬碼、容易出錯的地方與檢查方式，這些部分不含可以直接繳交的程式。完整參考實作摺疊在各專案的最後，預設不顯示。課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)把用圖或虛擬碼討論解法列為合理，把提供或事先查看解答列為不合理。

### 任務

依[官方規格](https://cs50.harvard.edu/ai/projects/6/parser/)，要在 `parser.py` 完成三件事，讓程式能剖析 `sentences/` 目錄下的十個句子，並列出每個句子的名詞片語區塊（noun phrase chunk）：

1. **`NONTERMINALS`**：補上產生非終端符號的 CFG 規則。每條規則一行，第一條必須以 `S ->` 開頭，名詞片語要用 `NP` 這個符號。`TERMINALS` 不能改。
2. **`preprocess(sentence)`**：把句子轉成小寫的詞串列。規格要求用 `nltk` 的 `word_tokenize` 斷詞，並去掉不含任何英文字母的詞（例如 `.` 或 `28`）。
3. **`np_chunk(tree)`**：回傳所有名詞片語區塊。名詞片語區塊的定義是：標籤為 `NP`、而且裡面不再包含其他 `NP` 的子樹。如果 the home 是一個區塊，the armchair in the home 就不是，因為它包含前者。

規格另外提醒：文法不要過度產生（「Armchair on the sat Holmes.」不該被接受），也不要寫成只對得上某一句的規則。

### 官方已提供的程式

`parser.py` 開頭已經給好所有產生詞的規則，以及一條起始規則。下面是官方檔案的內容：

```python
import nltk
import sys

TERMINALS = """
Adj -> "country" | "dreadful" | "enigmatical" | "little" | "moist" | "red"
Adv -> "down" | "here" | "never"
Conj -> "and" | "until"
Det -> "a" | "an" | "his" | "my" | "the"
N -> "armchair" | "companion" | "day" | "door" | "hand" | "he" | "himself"
N -> "holmes" | "home" | "i" | "mess" | "paint" | "palm" | "pipe" | "she"
N -> "smile" | "thursday" | "walk" | "we" | "word"
P -> "at" | "before" | "in" | "of" | "on" | "to"
V -> "arrived" | "came" | "chuckled" | "had" | "lit" | "said" | "sat"
V -> "smiled" | "tell" | "were"
"""

NONTERMINALS = """
S -> N V
"""

grammar = nltk.CFG.fromstring(NONTERMINALS + TERMINALS)
parser = nltk.ChartParser(grammar)
```

`main` 也已經寫好：讀進句子（從檔案或鍵盤），呼叫 `preprocess`，用 `parser.parse` 取得所有語法樹，印出每棵樹與 `np_chunk` 找到的區塊。要自己寫的兩個函式在檔案裡是這樣：

```python
def preprocess(sentence):
    """
    Convert `sentence` to a list of its words.
    Pre-process sentence by converting all characters to lowercase
    and removing any word that does not contain at least one alphabetic
    character.
    """
    raise NotImplementedError


def np_chunk(tree):
    """
    Return a list of all noun phrase chunks in the sentence tree.
    A noun phrase chunk is defined as any subtree of the sentence
    whose label is "NP" that does not itself contain any other
    noun phrases as subtrees.
    """
    raise NotImplementedError
```

只有 `S -> N V` 這一條規則的文法，只能產生「Holmes sat.」這種名詞加動詞的句子。

### 解題思路

文法的寫法就是導讀「[把語法寫成規則：context-free grammar](#把語法寫成規則context-free-grammar)」那一節的做法（[錄影 5:13](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=313s)），講者示範的 `cfg1.py`（[11:08](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=668s)）已經有形容詞片語與介系詞片語，可以當起點。照抄行不通：這裡的符號名稱不同（`Det`、`Adj`、`Adv`、`Conj`），規格也明說講課的規則刻意寫得很簡化，會過度產生。

比較穩的做法是一句一句擴充。先讓第 1 句剖析得出來，再看下一句多了什麼結構、該讓哪一種片語多一種改寫方式。十個句子依序會用到這些結構：

| 句子 | 新出現、文法要能處理的結構 |
|---|---|
| 1 Holmes sat. | 名詞片語加動詞片語 |
| 2 Holmes lit a pipe. | 限定詞加名詞；動詞後面接名詞片語 |
| 3 We arrived the day before Thursday. | 介系詞片語（before Thursday） |
| 4 Holmes sat in the red armchair and he chuckled. | 多了形容詞（red）與連接詞（and） |
| 5 My companion smiled an enigmatical smile. | 沒有新結構，用來確認前面的規則 |
| 6 Holmes chuckled to himself. | 沒有新結構 |
| 7 She never said a word until we were at the door here. | 副詞在動詞前面（never）與句尾（here） |
| 8 Holmes sat down and lit his pipe. | 多了副詞 down；and 兩邊的東西和第 4 句不一樣 |
| 9 I had a country walk on Thursday and came home in a dreadful mess. | 沒有新結構；注意 country 在 `TERMINALS` 裡是 `Adj` |
| 10 I had a little moist red paint in the palm of my hand. | 連續好幾個形容詞；兩個介系詞（in、of）接連出現 |

每加一種結構，都要決定它掛在哪一層。介系詞片語掛在名詞片語上還是動詞片語上，會決定一個句子有幾棵樹；限定詞放在哪裡，會決定「the the armchair」會不會被接受。

`preprocess` 是三個步驟：斷詞、轉小寫、濾掉不含英文字母的 token。

`np_chunk` 要檢查的是每一棵標籤為 `NP` 的子樹「底下還有沒有別的 `NP`」。規格的提示說 `nltk.tree` 的 `label` 與 `subtrees` 兩個方法會用得上。

### 虛擬碼

```text
寫文法的流程：
    文法 ← 只有「句子是名詞片語加動詞片語」
    對 sentences/ 的第 1 句到第 10 句：
        試著剖析
        如果剖析不出來：
            找出句子裡文法還沒涵蓋的結構
            替對應的片語多加一種改寫方式（加在片語這一層，不替這一句寫專用規則）
        回頭確認前面每一句仍然剖析得出來
    最後拿不該接受的句子來試，確認剖析不出來

前處理(句子)：
    把句子斷成 token
    留下的詞 ← 空清單
    對每個 token：
        轉成小寫
        如果裡面至少有一個英文字母：加進留下的詞
    回傳留下的詞

名詞片語區塊(語法樹)：
    結果 ← 空清單
    對語法樹裡每一棵標籤是 NP 的子樹 t：
        如果 t 的底下（t 自己不算）沒有標籤是 NP 的子樹：
            把 t 加進結果
    回傳結果
```

### 容易出錯的地方

下面的現象都是本站實跑時觀察到的（2026-10-13，Python 3.15.0、nltk 3.10.3）。規格頁註明課程使用的 Python 最高到 3.12；獨立審稿者另外用 Python 3.12.13 把這個專案整套重跑一次，結果與本站相同，本站自己沒有用 3.12 跑。

- **官方檔案原樣執行會直接丟 `NotImplementedError`。** 錯誤來自 `preprocess`，還沒走到文法。規格建議先讓 `np_chunk` 暫時回傳空清單，專心測文法。
- **`word_tokenize` 需要另外下載資料。** 沒有的時候會丟 `LookupError`，訊息是 `Resource 'punkt_tab' not found`。nltk 3.10.3 只要下載 `punkt_tab` 這一份就能跑。
- **沒轉小寫或沒濾掉標點，錯誤看起來像文法有問題。** `TERMINALS` 裡的詞全是小寫。把 `Holmes` 原樣交給剖析器，`main` 會印出 `Grammar does not cover some of the input words: "'Holmes'".`；留下句點則是同一句訊息、換成 `'.'`。看到這句話先查 `preprocess`，不是去改文法。
- **照抄講課的 `cfg1.py` 會接受連續兩個限定詞。** 那份文法讓名詞片語可以是「限定詞加名詞片語」，於是限定詞能一直疊。本站實跑 `cfg1.py`，she saw the the city 剖析得出一棵樹。規格點名「Holmes sat in the the armchair.」不該被接受。
- **`subtrees` 會把子樹自己也算進去。** 判斷「底下有沒有別的 `NP`」時如果沒有排除自己，每一棵 `NP` 都會被判成包含 `NP`，`np_chunk` 永遠回傳空清單，畫面上「Noun Phrase Chunks」底下什麼都沒有。
- **`np_chunk` 要回傳樹，不是字串。** `main` 會對每個回傳值呼叫 `flatten()`，規格也寫明回傳值是 `nltk.tree` 物件的串列、每個的標籤都是 `NP`。
- **一個句子有好幾棵樹是正常的。** 規格說英文文法本來就有歧義。`main` 會把每棵樹與它的區塊各印一次，所以同一組區塊重複出現不是錯。
- **替某一句寫專用規則會通過那一句，卻沒有用。** 規格舉的反例是把第 10 句的詞性照順序排成一條規則：剖析得出來，但不能推廣。

### 怎麼檢查自己寫的對不對

先確認環境與執行方式：

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/6/parser.zip
unzip parser.zip && cd parser

# 規格頁註明課程使用的 Python 最高到 3.12
pip3 install -r requirements.txt  # nltk

# word_tokenize 需要的斷詞資料（nltk 3.10.3 是 punkt_tab）
python -c "import nltk; nltk.download('punkt_tab')"

# 剖析檔案裡的句子；不帶參數則自己輸入
python parser.py sentences/1.txt
```

規格頁給的範例：輸入 `Holmes sat.`，印出的樹是 `S` 底下一個 `NP`（裡面是 `N` holmes）與一個 `VP`（裡面是 `V` sat），「Noun Phrase Chunks」底下是 holmes。

可以手算的小案例：

- `preprocess("Holmes sat 28 .")` 應該得到 `['holmes', 'sat']`。28 與句點都不含英文字母。
- 「Holmes lit a pipe.」的區塊是 holmes 與 a pipe。
- 「I had a little moist red paint in the palm of my hand.」的區塊是 i、a little moist red paint、the palm、my hand。the palm of my hand 整段不算，因為它裡面還有別的名詞片語。

十個句子都要至少剖析出一棵樹。下面是本站參考文法找到的名詞片語區塊（2026-10-13，Python 3.15.0 跑一次；獨立審稿者用 3.15.0 與 3.12.13 各重跑一次，結果相同）。文法寫法不同時，個別區塊可能不同：

| 句子 | 名詞片語區塊 |
|---|---|
| 1 | holmes |
| 2 | holmes、a pipe |
| 3 | we、the day、thursday |
| 4 | holmes、the red armchair、he |
| 5 | my companion、an enigmatical smile |
| 6 | holmes、himself |
| 7 | she、a word、we、the door |
| 8 | holmes、his pipe |
| 9 | i、a country walk、thursday、home、a dreadful mess |
| 10 | i、a little moist red paint、the palm、my hand |

樹的數量取決於你的文法，沒有標準答案。本站的參考文法在第 3、9、10 句各得到 2、4、5 棵，其餘各一棵；你的數字不同不代表錯。

再拿規格提示裡的句子測文法鬆緊：

| 句子 | 應該 |
|---|---|
| Holmes sat in the armchair. | 剖析得出來 |
| Holmes sat in the red armchair. | 剖析得出來 |
| Holmes sat in the little red armchair. | 剖析得出來 |
| Holmes sat in the the armchair. | 印出 `Could not parse sentence.` |
| Armchair on the sat Holmes. | 印出 `Could not parse sentence.` |
| His Thursday chuckled in a paint. | 接受或不接受都可以，規格說沒有意思的句子被接受不必擔心 |

還可以自己多試幾個不該接受的句子。下面九句用的都是 `TERMINALS` 裡的詞，本站的參考文法全部剖析不出來：Sat Holmes.、Holmes Holmes sat.、Holmes sat sat.、Holmes sat and and lit his pipe.、Holmes in the armchair.、Never Holmes sat.、Holmes sat and.、Holmes sat the red.、Holmes lit a pipe pipe.

最後是官方的自動檢查：

```bash
check50 ai50/projects/2024/x/parser
style50 parser.py
```

### 完整參考實作

<details>
<summary>完整參考實作（先自己寫完並繳交，再打開）</summary>

> ⚠️ 如果你正在修這門課、或打算申請 CS50 的證書：課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)規定，繳交自己的作業之前不能看別人的解答。請先完成並繳交，再用這一段對照。這份實作只在本站列出的環境實跑過，沒有經過 check50。

這是一種寫法，不是官方解答。文法的取捨是：限定詞只能出現一次，形容詞可以連續好幾個。

```python
NONTERMINALS = """
S -> NP VP | S Conj S | S Conj VP
NP -> N | Det N | Det AP N | NP PP
AP -> Adj | Adj AP
PP -> P NP
VP -> V | V NP | VP PP | Adv VP | VP Adv
"""


def preprocess(sentence):
    return [
        word.lower() for word in nltk.word_tokenize(sentence)
        if any(c.isalpha() for c in word)
    ]


def np_chunk(tree):
    chunks = []
    for subtree in tree.subtrees(lambda t: t.label() == "NP"):
        inner = list(subtree.subtrees(lambda t: t.label() == "NP"))
        if len(inner) == 1:
            chunks.append(subtree)
    return chunks
```

本站把這份實作放進官方的 `parser` 目錄實跑過（Python 3.15.0、nltk 3.10.3），獨立審稿者另外從文章抽出程式重跑，結果相同：十個句子全部剖析得出來，區塊與樹數如上一小節的表；規格提示的三個 armchair 句子都能剖析，「Holmes sat in the the armchair.」與「Armchair on the sat Holmes.」剖析不出來；「His Thursday chuckled in a paint.」會被接受。獨立審稿者另外用 Python 3.12.13（nltk 3.10.3）重跑，結果相同。

</details>

---

## 專案 6B：Attention —— 用 BERT 預測被遮住的詞，並畫出每個 attention head

這一節的編排和上一個專案相同：參考實作與 `analysis.md` 的示範摺疊在最後。

### 任務

依[官方規格](https://cs50.harvard.edu/ai/projects/6/attention/)，這個專案用 Google 的 BERT 做兩件事。BERT 是以 Transformer 為基礎的語言模型，訓練方式是 masked language model：把句子裡一個詞遮住，讓模型依上下文猜回來。規格寫明 base 版的 BERT 有 12 層，每層 12 個 self-attention head，總共 144 個。

這正好接上導讀最後三節：第七節的 attention score、第八節的 self-attention 與 multi-headed attention，在這裡都變成看得到的東西。講者在第九節說有的 Transformer 只用 encoder，BERT 就是這一種；這一句規格頁沒有寫，是本文的補充。

第一部分是補完 `mask.py` 的三個函式：

1. **`get_mask_token_index(mask_token_id, inputs)`**：回傳 `[MASK]` 在輸入 token 序列裡的位置，從 0 算起；輸入裡沒有 `[MASK]` 就回傳 `None`。`inputs` 是 tokenizer 產生的 `transformers.BatchEncoding`。
2. **`get_color_for_attention_score(attention_score)`**：把 0 到 1 的 attention score 換成灰階的 RGB 三元組。0 是全黑 `(0, 0, 0)`，1 是全白 `(255, 255, 255)`，中間線性變化；三個值要相等而且是整數，取整數時無條件捨去或四捨五入都可以（0.25 回傳 `(63, 63, 63)` 或 `(64, 64, 64)` 都算對）。
3. **`visualize_attentions(tokens, attentions)`**：替每一層的每一個 head 呼叫一次 `generate_diagram`。`attentions[i][j][k]` 的 `i` 是第幾層、`j` 是 beam 編號（這裡永遠是 0）、`k` 是第幾個 head；傳給 `generate_diagram` 的層號與 head 號要從 1 算起。

第二部分是看圖寫分析：在 `analysis.md` 描述至少兩個 attention head 看起來學到了詞與詞之間的什麼關係，每個附至少兩個你實際餵給模型的例句。規格自己示範了兩個（Layer 3 Head 10 注意下一個 token，Layer 4 Head 11 讓副詞注意它修飾的動詞），你寫的要和這兩個不同。

### 官方已提供的程式

`mask.py` 的開頭與 `main` 已經寫好，下面是官方檔案的內容：

```python
import sys
import tensorflow as tf

from PIL import Image, ImageDraw, ImageFont
from transformers import AutoTokenizer, TFBertForMaskedLM

# Pre-trained masked language model
MODEL = "bert-base-uncased"

# Number of predictions to generate
K = 3

# Constants for generating attention diagrams
FONT = ImageFont.truetype("assets/fonts/OpenSans-Regular.ttf", 28)
GRID_SIZE = 40
PIXELS_PER_WORD = 200


def main():
    text = input("Text: ")

    # Tokenize input
    tokenizer = AutoTokenizer.from_pretrained(MODEL)
    inputs = tokenizer(text, return_tensors="tf")
    mask_token_index = get_mask_token_index(tokenizer.mask_token_id, inputs)
    if mask_token_index is None:
        sys.exit(f"Input must include mask token {tokenizer.mask_token}.")

    # Use model to process input
    model = TFBertForMaskedLM.from_pretrained(MODEL)
    result = model(**inputs, output_attentions=True)

    # Generate predictions
    mask_token_logits = result.logits[0, mask_token_index]
    top_tokens = tf.math.top_k(mask_token_logits, K).indices.numpy()
    for token in top_tokens:
        print(text.replace(tokenizer.mask_token, tokenizer.decode([token])))

    # Visualize attentions
    visualize_attentions(inputs.tokens(), result.attentions)
```

`main` 的流程是：讀進一句含 `[MASK]` 的文字，用 tokenizer 斷詞，找出 `[MASK]` 的位置，把輸入交給 BERT，印出最可能的 `K` 個詞（預設 3 個），最後呼叫 `visualize_attentions` 畫圖。規格提醒 token 不一定等於詞：序列開頭固定是 `[CLS]`、結尾是 `[SEP]`，一個詞也可能被切成好幾個 token（規格的例子是 intelligently 切成 `intelligent` 與 `##ly`）。

要自己寫的三個函式在檔案裡是這樣：

```python
def get_mask_token_index(mask_token_id, inputs):
    """
    Return the index of the token with the specified `mask_token_id`, or
    `None` if not present in the `inputs`.
    """
    # TODO: Implement this function
    raise NotImplementedError



def get_color_for_attention_score(attention_score):
    """
    Return a tuple of three integers representing a shade of gray for the
    given `attention_score`. Each value should be in the range [0, 255].
    """
    # TODO: Implement this function
    raise NotImplementedError



def visualize_attentions(tokens, attentions):
    """
    Produce a graphical representation of self-attention scores.

    For each attention layer, one diagram should be generated for each
    attention head in the layer. Each diagram should include the list of
    `tokens` in the sentence. The filename for each diagram should
    include both the layer number (starting count from 1) and head number
    (starting count from 1).
    """
    # TODO: Update this function to produce diagrams for all layers and heads.
    generate_diagram(
        1,
        1,
        tokens,
        attentions[0][0][0]
    )
```

`generate_diagram(layer_number, head_number, tokens, attention_weights)` 也已經寫好：它畫出一張方格圖，每個 token 一列一欄，格子的顏色由 `get_color_for_attention_score` 決定，越亮代表分數越高，存成 `Attention_Layer{層}_Head{head}.png`。圖的讀法是「這一列的 token 在注意哪一欄的 token」。

### 解題思路

三個函式都很短，難處在弄清楚資料長什麼樣子。

**找 `[MASK]` 的位置。** tokenizer 把句子變成一串 token 的編號，`[MASK]` 有自己固定的編號，就是傳進來的 `mask_token_id`。要做的是在那串編號裡找到它排第幾個。兩件事要先看清楚：`inputs` 可以一次裝很多句，所以編號是「句子 × token」兩層，這裡只有一句；開頭的 `[CLS]` 也佔一個位置。規格建議去讀 transformers 文件裡 tokenizer 回傳值的欄位。

**分數換顏色。** 這是一條線性對應：0 到 1 對到 0 到 255，再取整數，三個顏色通道用同一個值。

**畫出所有的圖。** 官方已經示範了怎麼畫第一層的第一個 head，要做的是把它推廣成「每一層、每一個 head 各畫一張」。資料是三層索引：層、beam、head，其中 beam 永遠是 0。程式裡的索引從 0 算，傳給 `generate_diagram` 的編號從 1 算。

**看圖寫分析。** 這一半用到導讀「[Attention：讓 decoder 自己決定看輸入的哪裡](#attention讓-decoder-自己決定看輸入的哪裡)」（[錄影 46:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=2795s)）與「[Transformer 的 encoder](#transformer-的-encoder平行處理positional-encoding-與-self-attention)」裡 self-attention（[57:46](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3466s)）與 multi-headed attention（[58:35](https://www.youtube.com/watch?v=QAZc9xsQNjQ&t=3515s)）的說法：每個 head 各自決定每個 token 要注意哪些 token，講者說每個 head 可以注意不同的東西。每張圖畫的就是一個 head 的 attention score。讀圖時一次看一列，找這一列最亮的格子在哪一欄。可以找的規律大致三類：

- 位置的規律：亮格排成一條斜線，代表每個 token 注意固定距離外的 token。
- 詞性或語法的規律：某一類詞的亮格落在和它有語法關係的詞上。規格列了幾個可以找的方向：動詞與受詞、介系詞、代名詞、形容詞、限定詞、注意前一個 token。
- 沒有規律：整張圖的亮格集中在 `[SEP]` 或 `[CLS]` 那一欄。規格的提示說這常見，代表這個 head 在這句話裡沒有適合注意的詞。

一個 head 的規律要用好幾個句子確認。把目標詞換位置、在中間插入別的詞，看亮格會不會跟著走；也要記下不符合的地方，規格說 head 很吵，不必每一句都成立。144 張圖一張一張看很慢，可以把分數直接印成數字，先篩出候選的 head，再打開圖確認。

### 虛擬碼

```text
找遮罩位置(遮罩編號, 輸入)：
    取出輸入裡唯一那一句的 token 編號序列
    從位置 0 開始逐一比對：
        如果這個位置的編號等於遮罩編號：回傳這個位置
    都沒有：回傳「沒有」

分數換顏色(分數)：
    灰階值 ← 分數 × 255，取成整數
    回傳三個通道都是灰階值的顏色

畫出所有 attention(tokens, 所有分數)：
    對每一層（從第 1 層數起）：
        對這一層的每一個 head（從第 1 個數起）：
            取出這一層、唯一的 beam、這個 head 的分數表
            用官方的畫圖函式畫一張，帶上層號與 head 號

找一個 head 的規律：
    準備幾個結構不同、都含 [MASK] 的句子
    對每個句子執行程式，得到 144 張圖
    挑一個 head：
        對每一列，記下最亮的格子在哪一欄
        猜一個關係（例如「某類詞注意某類詞」）
    換句子驗證這個猜測，記下成立與不成立的例子
    成立的夠多，寫進 analysis.md，附上至少兩個例句
```

### 容易出錯的地方

**環境是最大的坑。** 官方的 `requirements.txt` 沒有鎖版本，本站在 2026-10-13 用 Python 3.12.13（macOS）試了四種組合，獨立審稿者重現了同樣的結果：

| 安裝的版本 | 結果 |
|---|---|
| `pip3 install -r requirements.txt`（當天裝到 transformers 5.19.0、tensorflow 2.21.0） | `mask.py` 第 5 行 `ImportError: cannot import name 'TFBertForMaskedLM' from 'transformers'` |
| transformers 4.57.6、tensorflow 2.21.0、tf-keras 2.21.0 | 載入模型時 `TypeError: 'builtins.safe_open' object is not iterable` |
| transformers 4.44.2、tensorflow 2.21.0，沒有 tf-keras | `RuntimeError`，訊息要求安裝 `tf-keras` |
| **transformers 4.44.2、tensorflow 2.21.0、tf-keras 2.21.0、pillow 12.3.0** | 可以執行 |

這三種錯誤都出在匯入套件或載入模型，和你寫的函式無關。看到它們先換套件版本。

其他幾點：

- **位置要把 `[CLS]` 算進去。**「Then I picked up a [MASK] from the table.」的 token 是 `[CLS]`、then、i、picked、up、a、`[MASK]`…，所以答案是 6，不是 5。
- **token 編號是兩層的。** 忘了先取出那一句，拿來比對的會是整句的編號序列，不是單一編號。
- **顏色要是整數。** 規格要求三個值都是整數；模型給的分數不是 Python 的整數，乘完 255 之後要記得取整。
- **層號與 head 號從 1 算起。** 檔名應該從 `Attention_Layer1_Head1.png` 到 `Attention_Layer12_Head12.png`。出現 `Layer0` 或缺了 `Layer12` 就是差了一。
- **圖會被下一次執行蓋掉。** 每次執行都把 144 張圖寫在目前的目錄，檔名只有層號與 head 號。比較不同句子之前，先把上一句的圖搬到別的資料夾。
- **check50 不檢查畫圖。** 本站讀了 `ai50/projects` 的 `2024/x/attention` 檢查檔：除了檔案存在與能匯入，另外八項全是 `get_mask_token_index` 與 `get_color_for_attention_score`。`visualize_attentions` 有沒有畫出 144 張、`analysis.md` 寫得對不對，check50 全綠也不代表沒問題，要自己檢查。
- **第一次執行會下載模型。** `bert-base-uncased` 從 Hugging Face 下載，獨立審稿者量到快取約 421 MB。
- **輸入會被轉成小寫。** 模型是 uncased 版，圖上的 token 都是小寫，Holmes 會顯示成 holmes。

### 怎麼檢查自己寫的對不對

安裝與執行：

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/6/attention.zip
unzip attention.zip && cd attention

# 官方規格寫的是 pip3 install -r requirements.txt（規格頁註明課程使用的 Python 最高到 3.12）
# 2026-10-13 實測能跑的組合如下，原因見上面「容易出錯的地方」
pip3 install pillow tensorflow==2.21.0 tf-keras==2.21.0 transformers==4.44.2

# 第一次執行會從 Hugging Face 下載 bert-base-uncased
python mask.py
```

三個函式可以單獨測，下面是本站實跑的值（2026-10-13，上表最後一組套件，各跑一次；獨立審稿者重跑相同）：

| 呼叫 | 應該得到 |
|---|---|
| `get_color_for_attention_score(0)` | `(0, 0, 0)` |
| `get_color_for_attention_score(1)` | `(255, 255, 255)` |
| `get_color_for_attention_score(0.25)` | `(63, 63, 63)` 或 `(64, 64, 64)`，規格兩個都接受 |
| `get_mask_token_index`，輸入「Then I picked up a [MASK] from the table.」 | `6` |
| `get_mask_token_index`，輸入沒有 `[MASK]` 的句子 | `None` |

整支程式的輸出。前兩句是規格頁的範例，本站跑出來的預測與規格頁相同；後兩句是本站另外跑的：

```text
Text: Then I picked up a [MASK] from the table.
Then I picked up a book from the table.
Then I picked up a bottle from the table.
Then I picked up a plate from the table.

Text: We turned down a narrow lane and passed through a small [MASK].
We turned down a narrow lane and passed through a small field.
We turned down a narrow lane and passed through a small clearing.
We turned down a narrow lane and passed through a small park.

Text: The turtle moved slowly across the [MASK].
The turtle moved slowly across the water.
The turtle moved slowly across the sand.
The turtle moved slowly across the beach.

Text: She opened the old door with a small [MASK].
She opened the old door with a small smile.
She opened the old door with a small key.
She opened the old door with a small sigh.
```

預測這一段是官方寫好的程式印的，只要 `get_mask_token_index` 正確就會出現。輸入沒有 `[MASK]` 的句子時，程式應該印出 `Input must include mask token [MASK].` 後結束。

圖的檢查：

- 每跑一句，目錄裡應該多出 144 個 PNG。
- 拿規格頁自己公開的例子對照：輸入「Then I picked up a [MASK] from the table.」，打開 `Attention_Layer3_Head10.png`。規格說這個 head 讓每個 token 注意下一個 token，所以圖上應該是一條比主對角線往右偏一格的白色斜線。本站的圖是這樣；用數字看，五個句子裡除了 `[CLS]` 與 `[SEP]` 兩列，每個 token 給下一個 token 的分數都在 0.99 到 1.00 之間。你的圖如果是往左偏、或整張全黑全白，回頭查顏色換算與索引。
- 再對照規格的第二個例子：輸入「The turtle moved slowly across the [MASK].」，看 `Attention_Layer4_Head11.png` 裡 slowly 那一列最亮的是不是 moved。本站的分數是 slowly → moved 0.84。

官方的自動檢查：

```bash
check50 ai50/projects/2024/x/attention
style50 mask.py
```

`analysis.md` 沒有自動檢查。自己檢查的標準是規格的要求：至少兩個 head、每個至少兩個實際跑過的例句、不能是規格已經示範的 Layer 3 Head 10 與 Layer 4 Head 11。

### 完整參考實作

<details>
<summary>完整參考實作（先自己寫完並繳交，再打開）</summary>

> ⚠️ 如果你正在修這門課、或打算申請 CS50 的證書：課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)規定，繳交自己的作業之前不能看別人的解答。請先完成並繳交，再用這一段對照。這份實作只在本站列出的環境實跑過，沒有經過 check50。下面的 head 觀察等同 `analysis.md` 的答案，同樣請先寫完自己的。

這是一種寫法，不是官方解答。

```python
def get_mask_token_index(mask_token_id, inputs):
    for i, token_id in enumerate(inputs.input_ids[0]):
        if int(token_id) == mask_token_id:
            return i
    return None


def get_color_for_attention_score(attention_score):
    value = round(float(attention_score) * 255)
    return (value, value, value)


def visualize_attentions(tokens, attentions):
    for i, layer in enumerate(attentions):
        for k in range(len(layer[0])):
            generate_diagram(
                i + 1,
                k + 1,
                tokens,
                layer[0][k]
            )
```

`inputs.input_ids` 的形狀是「一批句子 × token 數」，這裡只有一句，所以取 `[0]`。`attentions` 是一個 tuple，每層一個張量，`layer[0]` 取出唯一的那個 beam，`len(layer[0])` 就是這一層的 head 數。

本站把這份實作放進官方的 `attention` 目錄實跑過（2026-10-13，macOS、Python 3.12.13，transformers 4.44.2、tensorflow 2.21.0、tf-keras 2.21.0、pillow 12.3.0）：上一小節的四個句子各印出那三個預測、各產生 144 張圖，三個函式的單測值也如上表。獨立審稿者另外從文章抽出程式重跑，結果相同。

**`analysis.md` 的示範：本站實際看到的兩個 head。** 做法是先用一小段程式把五個句子在 144 個 head 上的分數印出來，找出規律最明顯的 head，再打開對應的圖確認。五個句子是上面四句，加上「Holmes lit his [MASK] and sat in the red armchair.」；其中 She 與 Holmes 開頭的兩句是本文自擬的，其餘三句出自規格頁。

**Layer 4 Head 6：注意前一個 token。** 圖上是一條往左偏一格的斜線，比 Layer 3 Head 10 模糊。

- 「Then I picked up a [MASK] from the table.」：i → then 0.96、a → up 0.95、from → `[MASK]` 0.97、the → from 0.96。
- 「She opened the old door with a small [MASK].」：the → opened 0.98、old → the 0.85、door → old 0.81、a → with 0.91。
- 不符合的地方：句子的第一個詞前面沒有詞，分數給了 `[CLS]`（then → `[CLS]` 0.85、she → `[CLS]` 0.95）；另外有些詞也把最高分給 `[CLS]`，動詞與名詞都有（picked → `[CLS]` 0.67、turtle → `[CLS]` 0.57、armchair → `[CLS]` 0.76）。

**Layer 8 Head 11：限定詞注意所屬片語的名詞，介系詞也有同樣的傾向但比較弱。**

- 「We turned down a narrow lane and passed through a small [MASK].」：a → lane 0.93，中間隔著 narrow。
- 「Then I picked up a [MASK] from the table.」：the → table 0.86。
- 「She opened the old door with a small [MASK].」：the → door 0.76，中間隔著 old。
- 名詞被遮住時，限定詞注意的是 `[MASK]`：上面三句的 a → `[MASK]` 分別是 0.82、0.68、0.78。
- 介系詞：最強的是 from → table 0.88，其餘偏弱：through → `[MASK]` 0.55、with → `[MASK]` 0.53、down → lane 0.50、in → armchair 0.44；across 沒有注意名詞，把最高分（0.43）給了 `[SEP]`。
- 不符合的地方：「Holmes lit his [MASK]…」的 his 把最高分（0.50）給了 `[SEP]`；「The turtle moved slowly across the [MASK].」第二個 the 也是（0.55）。這個 head 裡，名詞、動詞等其他 token 幾乎都把分數給 `[SEP]`，就是規格提示說的那種情況。

這兩個觀察只來自五個句子，是對 head 行為的猜測。規格也說 attention head 很吵，不一定對應到人能解釋的關係。

</details>

---

## 學習檢核清單

- [ ] 能分辨一個句子的問題出在語法還是語意，並舉出一個有兩種剖析的句子
- [ ] 能用 context-free grammar 的改寫規則推導一個句子，並說出手寫規則的限制
- [ ] 能列出一段文字的 bigram 與 trigram，說明 Markov chain 產生的文字保證什麼、不保證什麼
- [ ] 能用 Naive Bayes 手算一則評論的正負機率，並解釋為什麼需要 Laplace smoothing
- [ ] 能說出 one-hot 表示的兩個問題，以及 word2vec 依據什麼決定詞的向量
- [ ] 能說明 encoder–decoder 把整個輸入壓進一份 hidden state 的問題，以及 attention 的加權平均怎麼處理它
- [ ] 能說出 Transformer 為什麼需要 positional encoding，以及 decoder 的兩種 attention 各在注意什麼
- [ ] 能讀 attention 圖：說出某一列的 token 在注意哪一欄的 token，並描述一個 head 的規律與例外
- [ ] Parser 與 Attention 兩個專案 `check50` 全綠

## 課程影片來源

官方 CS50 YouTube 播放清單（CS50's Introduction to Artificial Intelligence with Python，8 支）已於 2026-10-10 即時核對，第 6 週講課錄影在清單中。

原始影片：[Language - Lecture 6 - CS50's Introduction to Artificial Intelligence with Python 2023](https://www.youtube.com/watch?v=QAZc9xsQNjQ)

課程與錄影入口：

- [CS50 AI Week 6 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/6/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-13）：用 yt-dlp 取得帶時間碼的英文字幕，讀完全片 1:05:21 後重寫「講課導讀」，各節起點與文中引用的數字（Naive Bayes 的 0.49／0.51、my 與 grandson 的比例、0.68 與 0.32，情感分類示範的 0.92 與 0.96，詞向量距離 0.34、0.64、0.2）都取自字幕；沒有看影片畫面。字幕在 45:46 把 decoder 最後輸出的 end token 記成「n token」，本文依前文（44:54 的 end token）寫；官方逐字稿 `lecture6.txt` 在同一處也是「n token」，是官方字幕本身的誤記。有四類內容不是來自字幕，文中各處已標明：CFG 規則區塊的 `V` 一列與 attention 圖的論文出處取自官方投影片 `lecture6.pdf` 轉出的文字；Naive Bayes 表裡 loved 與 it 兩列的數值取自官方筆記的圖；`cfg0.py` 的程式、`cfg1.py` 的規則、`markovify` 這個套件名與 `distance` 的算法取自官方講課原始碼 `src6.zip`；兩份文法的剖析結果本文另外用 nltk 實跑過。字幕全程未提到本週專案，專案說明來自課程官網而非影片。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 CS50 YouTube 播放清單即時核對，本週講課錄影存在，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。依字幕重寫影片時間表，移除影片沒有的 TF-IDF／問答／專案介紹，時間碼改為約略值。
- 2026-10-13：播放器從文末來源區移到「課程影片與時間軸」，開頭補上片長。
- 2026-10-13：用帶時間碼的字幕重新核對，「核心概念速覽」重寫成九節的「講課導讀」，每節附時間連結與一題自我檢查；時間表的約略分鐘數改為實際起點，每一列連到影片的對應位置；片長依實際影片改為 1:05:21。原速覽裡講課沒有提到的內容已移除：n-gram 的最大似然估計公式、Add-k／Good-Turing／Kneser-Ney 平滑比較、CFG 四元組定義與 CYK 演算法、TF-IDF 與餘弦相似度公式、scaled dot-product attention 的 Q／K／V 公式、Transformer 的 LayerNorm 與 residual 結構。學習檢核清單同步改寫。
- 2026-10-13：專案 6A 依官方 `parser.zip` 重寫。原本貼的 `Grammar` 類別、CYK 剖析與 `generate` 函式都不在官方檔案裡；官方要完成的是 `NONTERMINALS` 文法、`preprocess` 與 `np_chunk`。新的參考實作已放進官方專案目錄實跑。執行指令裡不存在的 `sentences.txt` 改為 `sentences/1.txt`。
- 2026-10-13：官方筆記連結改為與這支錄影同版的現行頁面。專案 6B 加上版本說明：Questions 已不在課程官網現行的第 6 週專案清單，該節內容尚未對照官方檔案。
- 2026-10-13：依獨立審稿修正。專案 6B 從 2020 年版的 Questions 換成課程官網現行的 Attention 專案：distribution code 取自官方 `attention.zip`，參考實作在 Python 3.12 實跑，文中記錄了能跑與不能跑的套件版本、三句的預測結果與兩個 attention head 的觀察；原本的 Questions 節（TF-IDF、餘弦相似度）整節移除。標題的「TF-IDF 問答系統」與 tags 的 `tf-idf`、`questions` 一併拿掉，tags 補上 `transformer`、`bert`。
- 2026-10-13：導讀補上兩處取自官方投影片的內容（CFG 規則的 `V` 一列、attention 圖的論文出處）與一個自擬的 Laplace smoothing 數字例子；版本提醒加上官方筆記記載的釋出日期；兩處講者歸因改成和字幕相同的語氣；tokenization 統一寫「斷詞」。
- 2026-10-13：專案節改成任務、官方已提供的程式、解題思路、虛擬碼、容易出錯的地方與檢查方式在前，完整參考實作與 `analysis.md` 的示範摺疊在各專案最後並加上警語，依據是課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)；參考實作的程式碼沒有改動。另依複審補上：規格示範的 Layer 3 Head 10 的分數範圍排除 `[CLS]` 與 `[SEP]` 兩列、摺疊區塊裡兩個 head 觀察的補充數字與例外、規格頁第二個範例句的預測。
- 2026-10-13：依專案節複審修正。更新紀錄不再寫出摺疊區塊裡的 head 編號；Parser 的 Python 版本說明移到摺疊區塊外，並記下審稿者用 Python 3.12.13 重跑的結果；解題思路表有三列改得更粗；tldr 與 description 改成與現在的專案節相符。

## 參考資料

- [Week 6 Language 講課頁](https://cs50.harvard.edu/ai/weeks/6/) — 影片、投影片、講課原始碼 `src6.zip`、逐字稿、Quiz
- [Language - Lecture 6（YouTube）](https://www.youtube.com/watch?v=QAZc9xsQNjQ) — 「講課導讀」的底本，內容、數字與時間連結取自它的英文字幕
- [Lecture 6 Notes](https://cs50.harvard.edu/ai/notes/6/) — 現行版官方筆記，章節與這支錄影相同，可對照投影片上的圖
- [Parser 專案規格](https://cs50.harvard.edu/ai/projects/6/parser/) — Distribution code `2023/x`、check50 slug `ai50/projects/2024/x/parser`
- [Attention 專案規格](https://cs50.harvard.edu/ai/projects/6/attention/) — Distribution code `2023/x`、check50 slug `ai50/projects/2024/x/attention`
- [Questions 專案規格（2020 年版）](https://cs50.harvard.edu/ai/2020/projects/6/questions/) — 現行官網已不列，本文不收錄
- [CS50 AI YouTube 播放清單](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義
