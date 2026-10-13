---
title: "Words, Tokens, Edit Distance, and N-grams：LLM 之前先決定模型看見什麼｜Stanford CS124 第 2 週"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, nlp, tokenization, language-model]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 3 }
tldr: "第 2 週教三件事：用 BPE 把文字切成 token、用動態規劃算兩個字串的編輯距離、用 n-gram 估下一個詞的機率並用 perplexity 評估。每一項都可以用紙筆算，本文各走一個例子。"
description: "Stanford CS124 Winter 2026 第 2 週導讀：詞與 token 的差別、BPE 的學習與編碼步驟、最小編輯距離的遞迴式與對齊、bigram 語言模型、perplexity、add-one smoothing，以及實作課一與 PA1 在做什麼。依公開投影片與 PA1 repo。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week2-tokens-ngram-en)

這是 [Stanford CS124 導讀](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)的第 2 週，也是第一個有技術內容的一週。它回答三個問題：

1. 模型讀文字時，最小的單位是什麼？
2. 兩個字串差多少，怎麼算？
3. 一句話「像不像人話」，怎麼變成一個數字？

**本週材料**：[Words and Tokens 投影片](https://web.stanford.edu/class/cs124/lec/tokens_jan26.pdf)、[Minimum Edit Distance 投影片](https://web.stanford.edu/class/cs124/lec/med25.pdf)、[N-gram 投影片](https://web.stanford.edu/class/cs124/lec/lm_jan25.pdf)、[實作課一](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf)、[PA1](https://github.com/cs124/pa1-regular-expressions)。指定閱讀是教科書 2025 年 8 月版的[第 2 章](https://web.stanford.edu/~jurafsky/slp3/old_aug25/2.pdf)與[第 3 章](https://web.stanford.edu/~jurafsky/slp3/old_aug25/3.pdf)。預錄影片在 Canvas，校外看不到，本文依投影片與教科書整理。

## 為什麼不能直接用「詞」當單位

投影片從一個看似簡單的問題開始：這句話有幾個詞？

> They picnicked by the pool, then lay back on the grass and looked at the stars.

不算標點是 16 個，算標點是 18 個。再問細一點：`They` 和 `they` 算同一個詞嗎？`I'm` 是一個詞還是兩個？口語裡的 `uh`、講到一半的 `main-` 算不算？

這裡要先分清楚兩個數字。**type** 是詞彙表裡的一個項目，**instance** 是它在文字裡出現的一次。上面那句有 16 個 instance，但 `the` 出現三次，所以只有 14 個 type。

用「詞」當單位有三個問題，投影片逐一舉例：

**很多語言沒有空白。** 中文、日文、泰文都不用空白分詞。投影片的例子是「姚明進入總決賽」，可以切成 3 個詞（姚明／進入／總決賽）、5 個詞（姚／明／進入／總／決賽）或 7 個字。前兩種來自兩套不同的標註規範，第三種是乾脆以字為單位，沒有哪一種是唯一正確的。

**詞收不完。** 語料越大，沒看過的詞越多：

| 語料 | type 數 | instance 數 |
|---|---|---|
| 莎士比亞全集 | 3.1 萬 | 88.4 萬 |
| Brown Corpus | 3.8 萬 | 100 萬 |
| COCA | 200 萬 | 4.4 億 |
| Google N-grams | 1,300 萬以上 | 1 兆 |

這個關係叫 Herdan's law（也叫 Heaps' law）：詞彙量隨著語料長度持續成長，不會停。不管詞彙表做多大，測試時永遠會遇到沒看過的詞。

**詞的內部還有結構。** `cats` 是 `cat` 加複數的 `-s`，`carefully` 是 `care` + `-ful` + `-ly`。這些有意義的最小片段叫 morpheme（詞素）。用詞素當單位聽起來合理，但詞素的邊界很難定義，各語言差異也大。

所以現在的做法是：不用詞、不用字元、也不用詞素，讓資料自己決定怎麼切。切出來的單位叫 **subword**，最常用的演算法是 BPE。

## 正規表達式

投影片在 BPE 之後另有一節正規表達式（regular expression），這裡提前講，因為 BPE 的前處理會用到。它是一種描述「字串長什麼樣子」的寫法，幾乎每個處理文字的工作都會用到，BPE 開始合併之前把文字切成一個個詞的那一步，用的就是它。

Python 的用法是 `re.search(pattern, string)`：掃過字串，回傳第一個符合樣式的地方。樣式習慣寫成 raw string（前面加 `r`），因為正規表達式和 Python 都用反斜線當特殊字元，不加 `r` 就得多打一層反斜線。

| 樣式 | 符合什麼 |
|---|---|
| `r"Buttercup"` | 字串裡任何位置的 `Buttercup` |
| `r"[mM]ary"` | `mary` 或 `Mary`。方括號表示「這幾個字元擇一」 |
| `r"[tT]he"` | `the` 或 `The`，也會抓到 `other` 裡面的 `the` |
| `r"\d+"` | 一個以上的數字。`\d` 是數字，`+` 是「一次以上」 |

PA1 的前半就是用這些工具，從網頁文字裡把 email 抓出來。

## BPE：反覆合併最常相鄰的一對

BPE（Byte Pair Encoding）分成兩個部分：**學習器**從訓練語料學出一張詞彙表，**編碼器**用這張表去切新的文字。

學習器的步驟只有三行：

1. 一開始，詞彙表是所有出現過的字元。
2. 找出語料裡最常相鄰出現的一對 token，把它們合併成一個新 token，加進詞彙表。
3. 重複第 2 步，直到合併了 k 次。

投影片用一份很小的語料示範：`set new new renew reset renew`。合併不會跨過詞的邊界，每個詞前面的空白算成詞的一部分（下面用 `␣` 表示）。先把語料拆成字元並數次數：

| 次數 | 詞（拆成字元） |
|---|---|
| 2 | `␣ n e w` |
| 2 | `␣ r e n e w` |
| 1 | `␣ s e t` |
| 1 | `␣ r e s e t` |

然後一輪一輪合併：

| 輪次 | 合併哪一對 | 出現幾次 | 新增的 token |
|---|---|---|---|
| 1 | `n` + `e` | 4（new 兩次、renew 兩次） | `ne` |
| 2 | `ne` + `w` | 4 | `new` |
| 3 | `␣` + `r` | 3（renew 兩次、reset 一次） | `␣r` |
| 4 | `␣r` + `e` | 3 | `␣re` |
| 5 | `␣` + `new` | 2 | `␣new` |
| 6 | `␣re` + `new` | 2 | `␣renew` |
| 7 | `s` + `e` | 2 | `se` |
| 8 | `se` + `t` | 2 | `set` |

這張表有幾輪是平手的：第 1 輪 `n`+`e` 和 `e`+`w` 都出現 4 次，第 3、5 輪也有次數相同的組合。上面是投影片選的順序。平手時選哪一對要有固定的規則，不然同一份語料跑兩次會得到不同的詞彙表，自己實作時要注意。

第 4 輪值得停一下：演算法沒有任何語言學知識，卻學到了 `␣re` 這個字首。

編碼器處理新文字時，先把它拆成字元，再**照學到的順序**把同樣的合併一條一條套上去。`new` 和 `renew` 會被還原成完整的 token；沒看過的詞，例如 `rearrange`，開頭也會被切出 `␣re`，剩下的拆成更小的片段。所以 BPE 沒有「未知詞」的問題：最差的情況就是拆到單一字元。

實際的系統有兩點和這個小例子不同：

- **在位元組上跑，不在字元上跑。** 文字先用 UTF-8 編碼成位元組，BPE 從 256 種位元組開始合併，詞彙表通常做到 5 萬到 20 萬個 token。這樣任何語言、任何符號都切得動。
- **對英文比較划算。** 訓練資料以英文為主，大部分的 token 都分給了英文。投影片拿同一句食譜比較：英文 14 個詞切成 18 個 token，沒有一個詞被拆開；西班牙文 16 個詞切成 33 個 token，有 6 個詞被拆開。同樣的內容，非英文要花更多 token。

## 編輯距離：兩個字串差幾步

拼字校正要找「最接近的正確拼法」，語音辨識要算「辨識結果和正確答案差多少」。兩者需要同一個工具：**最小編輯距離**，也就是把一個字串變成另一個字串最少要幾步。允許的操作有三種：插入一個字元、刪除一個字元、替換一個字元。

投影片的例子是 `intention` 變成 `execution`。一種最省的做法是：

```
i n t e * n t i o n
* e x e c u t i o n
d s s   i s
```

刪掉 `i`（d）、`n` 換成 `e`（s）、`t` 換成 `x`（s）、插入 `c`（i）、`n` 換成 `u`（s）。一次刪除、三次替換、一次插入。

距離是多少，要看每種操作算幾分：

- 三種操作都算 1 分：距離是 5。
- 替換算 2 分（等於一次刪除加一次插入）：距離是 1 + 3×2 + 1 = 8。

所以報編輯距離時要連計分方式一起講，不然數字不能比。

### 用動態規劃算

所有可能的編輯序列多到列不完，但這個問題可以拆成小問題。令 D(i, j) 是「來源的前 i 個字元」變成「目標的前 j 個字元」的最小距離。要算 D(i, j)，只有三條路可以走到這一格：

- 從 D(i−1, j) 過來，再刪掉來源的第 i 個字元。
- 從 D(i, j−1) 過來，再插入目標的第 j 個字元。
- 從 D(i−1, j−1) 過來：兩個字元一樣就不用花分數，不一樣就替換。

三條路取最小的。邊界是 D(i, 0) = i（全部刪掉）和 D(0, j) = j（全部插入）。

以下是本文自擬的小例子，把 `cat` 變成 `cut`，三種操作都算 1 分：

| | （空） | c | u | t |
|---|---|---|---|---|
| **（空）** | 0 | 1 | 2 | 3 |
| **c** | 1 | 0 | 1 | 2 |
| **a** | 2 | 1 | 1 | 2 |
| **t** | 3 | 2 | 2 | 1 |

右下角的 1 就是答案：把 `a` 換成 `u` 一步。看「a 那一列、u 那一欄」的格子怎麼來的：左上角是 0（`c` 變 `c`），`a` 和 `u` 不同，所以是 0 + 1 = 1。

只算出距離還不夠用。語音辨識的錯誤分析要知道**哪幾個字錯了、錯成什麼**。做法是每一格多記一個指標，記下它是從三條路的哪一條來的，算完從右下角沿著指標走回左上角，就得到一組對齊。這一步叫 backtrace。

整張表有 n × m 格，所以時間和空間都是 O(nm)。

## N-gram 語言模型：用前一兩個詞猜下一個

語言模型做兩件事，其實是同一件：給一整句話一個機率，或者給定前文、算出下一個詞的機率分布。

用連鎖律可以把整句的機率拆開：P(w₁ w₂ … wₙ) 等於每一步「給定前面所有的詞，下一個詞的機率」連乘。問題是「前面所有的詞」的組合多到語料裡根本數不到。n-gram 的做法是只看最近的幾個詞：bigram 只看前一個，trigram 看前兩個。這個簡化叫馬可夫假設。

機率直接用次數相除。[課程總覽裡的三句語料](/posts/ai/2026-08-21-stanford-cs124-languages-to-information#一個例子這門課要你算的是這種東西)走過一次完整的計算，這裡不重複。那個例子留下兩個問題，這週的後半段就在處理它們。

### 怎麼知道一個語言模型好不好：perplexity

拿一份沒看過的測試文字，好的模型應該給它比較高的機率。但機率會隨文字長度一路變小，不同長度的文字沒辦法比。**Perplexity** 把機率對長度做正規化：

PP(W) = P(w₁ w₂ … wₙ) 的 −1/n 次方

也就是整段機率的倒數，再開 n 次方根。**數字越低，模型越好。**

投影片用一個可以心算的例子說明它的意思。假設一種語言只有紅、綠、藍三個詞，測試文字是「紅 紅 紅 紅 藍」：

- **模型 A** 認為三個詞機率各 1/3。整段機率是 (1/3)⁵，perplexity 是 ((1/3)⁵) 的 −1/5 次方，等於 3。
- **模型 B** 認為紅 0.8、綠 0.1、藍 0.1。整段機率是 0.8⁴ × 0.1 = 0.04096，perplexity 約 1.89。

模型 A 的 3 剛好是詞的數量：它每一步都在三個選項裡均勻地猜。模型 B 知道紅色比較常見，所以每一步「實際上在猶豫的選項數」不到 2 個。Perplexity 可以這樣讀：模型每預測一個詞，平均在幾個選項之間拿不定主意。

投影片另外給了一組實際數字：用《華爾街日報》的語料訓練，unigram、bigram、trigram 的 perplexity 分別是 962、170、109。看的前文越長，猜得越準。

比較 perplexity 有一個前提：**兩個模型要用同一份測試資料、同一套斷詞。** 斷詞不同，n 就不同，數字沒有可比性。投影片講斷詞時也提到這一點：切法固定，不同系統對「這段文字有多長」才有共識。

### 沒看過的組合怎麼辦：smoothing

總覽的例子裡，「我 攀岩」在語料中出現 0 次，所以 P(攀岩 | 我) = 0，整句的機率跟著歸零，perplexity 也算不出來（要除以 0）。

最簡單的補法是 **add-one smoothing**：假裝每一種組合都多看到一次。

P(後 | 前) = (「前 後」的次數 + 1) ÷ (「前」的次數 + V)

V 是詞彙表的大小。拿總覽那份語料算：詞彙表有「我、你、喜歡、攀岩、咖啡、`</s>`」6 項，「我」出現 2 次。

| | 原本 | add-one 之後 |
|---|---|---|
| P(喜歡 \| 我) | 2/2 = 1 | (2+1)/(2+6) = 3/8 |
| P(攀岩 \| 我) | 0/2 = 0 | (0+1)/(2+6) = 1/8 |

「我 攀岩」不再是 0 了。代價也看得很清楚：原本確定的 P(喜歡 | 我) 從 1 掉到 3/8，有超過一半的機率被分給了沒看過的組合。Add-one 挪走的機率太多，實務上很少直接用在 n-gram 上。投影片接著介紹比較溫和的做法：**interpolation** 把 trigram、bigram、unigram 的機率加權混合，**backoff** 在高階的組合沒看過時退回去用低階的。

### 從模型取樣

語言模型也可以拿來產生文字：照機率分布抽一個詞，把它接上去，再抽下一個。投影片用莎士比亞的語料示範，unigram 抽出來的是一堆不相干的詞，bigram 開始有局部通順的片段，到 4-gram 讀起來就像莎士比亞。

但那是因為 4-gram 抽出來的**幾乎就是莎士比亞的原句**。語料只有 88 萬個詞，光是 bigram，可能的組合就有 99.96% 從沒出現過，4-gram 更稀疏：看到前三個詞之後，語料裡往往只有一種接法，模型只能照抄。n 越大，模型記得越多、能類推的越少。這個矛盾要到第 5、6 週才有解法：用向量表示詞，讓意思相近的前文共用統計。

## 實作課一與 PA1

[**實作課一**](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf)教怎麼用 UNIX 指令處理文字，不寫程式。核心是一條管線，把一份《紐約時報》的文字檔變成詞頻表：

```bash
tr -sc 'A-Za-z' '\n' < nyt_200811.txt | sort | uniq -c | sort -nr | head -n 50
```

`tr` 把所有非字母的字元換成換行，於是每行一個詞；`sort` 把相同的詞排在一起；`uniq -c` 把相鄰的重複行合併並數次數；第二個 `sort -nr` 照次數由大到小排；`head` 取前 50 行。投影片上每一題的下一頁就是解答，先自己做再翻頁。

**[PA1](https://github.com/cs124/pa1-regular-expressions)** 有兩部分。Section A 用正規表達式從文字裡抽出 email。Section B 從 Unicode 和 UTF-8 講起，再自己實作 BPE 的訓練、編碼與解碼。README 建議先讀教科書第 2 章的 2.1 節與 2.4.1、2.4.2、2.4.5 節。作業在 Jupyter notebook 裡完成，沿用 PA0 建好的 `cs124` conda 環境。

## 自我檢查

1. **BPE**：用上面那張合併表去切新詞 `␣rent`。答案：先拆成 `␣ r e n t`。第 1 輪的規則是合併 `n` + `e`，但這裡是 `e` 在前、`n` 在後，不符合；第 3 輪合併 `␣` + `r` 得到 `␣r e n t`；第 4 輪合併 `␣r` + `e` 得到 `␣re n t`；之後沒有規則適用。結果是三個 token：`␣re`、`n`、`t`。
2. **編輯距離**：三種操作都算 1 分，`ab` 變成 `acb` 的距離是多少？答案：1，插入一個 `c`。
3. **Perplexity**：一個模型對每個位置都在 10 個詞之間均勻地猜，perplexity 是多少？答案：10。
4. **Smoothing**：用上面的語料與 add-one，P(咖啡 | 喜歡) 是多少？「喜歡」出現 3 次，後面接「咖啡」1 次，所以是 (1+1)/(3+6) = 2/9。

## 這週和後面的關係

- BPE 切出來的 token，就是第 6、7 週神經語言模型的輸入單位。PA6a 訓練 Transformer 時用的是 GPT-2 的 BPE 詞彙表。
- 編輯距離在第 7 週會再出現：語音辨識的詞錯誤率（WER）就是用它算的，只是單位從字元換成詞。
- 「給定前文，預測下一個 token」這個目標從這週一路沿用到 LLM，perplexity 也是。第 7 週的 PA6a 要自己算一次。

**系列導覽**：上一篇 [第 1 週：Introduction and Setup](/posts/ai/2026-08-22-cs124-week1-introduction)｜下一篇 [第 3 週：Logistic Regression and Text Classification](/posts/ai/2026-08-22-cs124-week3-logistic-regression)

## 更新紀錄

- 2026-10-13：依公開投影片重寫。新增正規表達式一節，補上 BPE 逐輪合併、編輯距離表、perplexity 與 add-one 的手算例子和自我檢查；移除與課程內容無關的自學紀錄建議。

## 參考資料

- [CS124 Winter 2026 課程網站與課表](https://web.stanford.edu/class/cs124/)
- [Words and Tokens 投影片](https://web.stanford.edu/class/cs124/lec/tokens_jan26.pdf) — 詞數例子、語料規模表、BPE 範例語料與多語言 token 數比較
- [Minimum Edit Distance 投影片](https://web.stanford.edu/class/cs124/lec/med25.pdf) — intention／execution 例子與兩種計分方式
- [N-gram Language Modeling 投影片](https://web.stanford.edu/class/cs124/lec/lm_jan25.pdf) — 紅綠藍 perplexity 例子、《華爾街日報》perplexity、莎士比亞取樣
- [實作課一：Unix Text Processing](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf)
- [CS124 PA1](https://github.com/cs124/pa1-regular-expressions)
- [Speech and Language Processing 2025 年 8 月版](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) — 第 2、3 章
