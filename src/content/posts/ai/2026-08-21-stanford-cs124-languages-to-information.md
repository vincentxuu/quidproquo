---
title: "從語言到資訊：一門同時教 tf-idf 和 LLM 的 NLP 入門課｜Stanford CS124 課程總覽"
date: 2026-08-21
category: ai
type: guide
tags: [cs124, ai-course, stanford, nlp, retrieval, llm]
lang: zh-TW
series:
  name: "Stanford CS124 導讀"
  order: 1
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 8
tldr: "CS124 是 Stanford NLP 分支的第一門課：十週從斷詞、n-gram、文本分類、資訊檢索與詞嵌入，講到 LLM 與 Transformer。教科書是免費的《Speech and Language Processing》，九個作業 repo 與實作課的題目和解答都公開；預錄影片、每週複習測驗與自動評分要 Stanford 帳號。"
description: "Stanford CS124: From Languages to Information 系列總覽：這門課的主線、十週各教什麼與對應的作業、一個可以手算的 bigram 例子、先修與自我檢查、評分方式、校外讀者拿得到哪些材料，以及兩條閱讀路線。依據 Winter 2026 課程網站、公開作業 repo 與教科書網站。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

> **來源年份**：課表、作業與評分依據 Winter 2026 的課程網站。課程首頁寫明 2026–27 學年不開課，所以這一版會是接下來一段時間內最新的版本。本文是 [Stanford CS124 導讀](/series/stanford-cs124)系列的入口。

[CS124: From Languages to Information](https://web.stanford.edu/class/cs124/) 是 Stanford 電腦科學系的自然語言處理入門課，由 [Dan Jurafsky](https://web.stanford.edu/~jurafsky/) 授課，同時掛在語言學系（LINGUIST 180／280）。它在 [Stanford CS 課程地圖](/posts/learning/2026-08-20-stanford-cs-course-map)裡是 NLP 分支的第一格，後面接 [CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)、[CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch) 這些研究所課。

這篇回答六個問題：這門課的主線是什麼、十週各教什麼、要先會什麼、分數怎麼算、校外讀者拿得到哪些材料、十篇逐週導讀要照什麼順序讀。

## 這門課的主線

課名是「從語言到資訊」。人寫的字、講的話、彼此之間的連結，原本都不是電腦能直接計算的東西。這門課十週都在做同一件事：**把它們轉成可以計數、排序、預測的表示。**

- 一段文字切成 token 之後，可以數、可以算機率。
- 一篇文件變成特徵向量之後，可以分類。
- 一個查詢變成向量之後，可以拿去跟每篇文件比相似度、排出名次。
- 一個詞變成幾百維的向量之後，「意思相近」就變成「向量方向接近」。
- 使用者的評分排成矩陣之後，可以推薦；網頁之間的連結畫成圖之後，可以算哪一頁重要。

LLM 在這門課裡排在中段，不在開頭。第 1 週的[導論投影片](https://web.stanford.edu/class/cs124/lec/intro26.pdf)把 LLM 拆成幾個元件：BPE 斷詞、邏輯迴歸、詞嵌入、神經網路、attention、取樣、語言模型的 loss、RAG。對照課表會發現，每個元件都有一週專門教：

| LLM 的元件 | 在哪一週學 |
|---|---|
| 文字怎麼切成 token（BPE） | 第 2 週 |
| 「預測下一個 token」的機率模型 | 第 2 週（n-gram） |
| 輸出層的機率與 loss（sigmoid／softmax、cross-entropy） | 第 3 週 |
| 外部資料怎麼查進來（RAG 的檢索那一半） | 第 4 週 |
| token 怎麼變成向量 | 第 5 週 |
| 多層網路與反向傳播 | 第 6 週 |
| attention、取樣與 perplexity | 第 7 週 |

所以這門課適合兩種人：還沒學過 NLP、想從頭走一遍的人；以及已經在用 LLM，但說不出 tokenizer、embedding、attention 各自在做什麼的人。

## 十週各教什麼

| 週 | 主題 | 指定閱讀 | 程式作業 | 本站導讀 |
|---|---|---|---|---|
| 1 | 導論、環境設定 | — | PA0 Jupyter | [第 1 週](/posts/ai/2026-08-22-cs124-week1-introduction) |
| 2 | 斷詞與 BPE、編輯距離、n-gram 語言模型 | SLP 第 2、3 章 | PA1 正規表達式與 BPE | [第 2 週](/posts/ai/2026-08-22-cs124-week2-tokens-ngram) |
| 3 | 邏輯迴歸與文本分類 | SLP 第 4 章 | PA2 邏輯迴歸 | [第 3 週](/posts/ai/2026-08-22-cs124-week3-logistic-regression) |
| 4 | 資訊檢索與 RAG | SLP 第 11 章 | PA3 資訊檢索 | [第 4 週](/posts/ai/2026-08-22-cs124-week4-information-retrieval) |
| 5 | 詞嵌入、計算社會科學 | SLP 第 5、10 章 | PA4 詞嵌入 | [第 5 週](/posts/ai/2026-08-22-cs124-week5-embeddings-social-nlp) |
| 6 | 神經網路、LLM 與 Transformer | SLP 第 6 章 | PA5 神經網路 | [第 6 週](/posts/ai/2026-08-22-cs124-week6-neural-networks-llms) |
| 7 | Transformer 實作、語音處理 | SLP 第 7、8 章 | PA6a Transformer | [第 7 週](/posts/ai/2026-08-22-cs124-week7-transformers-speech) |
| 8 | 語音合成與辨識、Git 協作 | SLP 第 14、15 章 | PA6b 語音 | [第 8 週](/posts/ai/2026-08-22-cs124-week8-speech-git) |
| 9 | 協同過濾、LLM agent | [*Mining of Massive Datasets*](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf) 第 9 章 | PA7 Agent | [第 9 週](/posts/ai/2026-08-22-cs124-week9-recommenders-agent) |
| 10 | PageRank 與社群網路 | *Introduction to Information Retrieval* 第 21 章、[*Networks, Crowds, and Markets*](https://www.cs.cornell.edu/home/kleinber/networks-book/) | — | [第 10 週](/posts/ai/2026-08-22-cs124-week10-pagerank-networks) |

SLP 是這門課的教科書 *Speech and Language Processing*，章號以課綱採用的 2025 年 8 月版為準，下面「教科書要讀哪一版」會說明。

十週可以分成四段來看。

### 第 2–4 週：把文字變成數得出來的東西

這三週的表示方式都是人決定的，而且都可以用紙筆算。

**第 2 週**先處理「模型看到的單位是什麼」。英文可以用空白切，中文沒有空白，新詞又永遠收不完，所以現在的做法是 BPE：從字元開始，反覆把最常相鄰出現的一對合併成新單位，常見的詞會變成一個 token，罕見的詞拆成幾個已知片段。同一週還教兩件事：編輯距離用動態規劃算出兩個字串差幾步（拼字校正和語音辨識的錯誤率都靠它），n-gram 語言模型用「前一兩個詞」去估下一個詞的機率。

**第 3 週**教邏輯迴歸。把一篇文件變成特徵向量（例如每個詞出現幾次），乘上權重、加總、通過 sigmoid，得到「這是正面評論」的機率；再用 cross-entropy 量預測錯得多離譜，用梯度下降修權重。這一週看起來最不像 LLM，但語言模型每預測一個 token，做的就是一次類別數等於詞彙表大小的分類，用的是同一套 loss 與同一種更新方式。

**第 4 週**教搜尋。倒排索引記錄每個詞出現在哪些文件，查詢進來時不必掃過全部文件。排序用 tf-idf：一個詞在這篇文件出現越多次、在整個文件集合裡越少見，權重越高；查詢和文件都變成向量後，用 cosine 相似度排名次。這一章在教科書裡的標題是「Information Retrieval and Retrieval-Augmented Generation」，RAG 的前半段就是這套檢索。

### 第 5–7 週：表示改用學的，一路接到 Transformer

**第 5 週**是轉折點。前面的特徵是人挑的，從這週開始由資料學出來。出發點是一個假設：出現在相似上下文的詞，意思也相近。照這個假設，可以統計每個詞附近常出現哪些詞，或訓練一個小模型去預測上下文（word2vec），兩種做法都會得到每個詞的向量。同一週 Jurafsky 有一堂現場課講計算社會科學，那堂沒有錄影，投影片也要 Stanford 登入才看得到。

**第 6 週**把第 3 週的邏輯迴歸疊成多層。一個神經元仍然是「加權總和再過一個非線性函數」，差別在中間多了隱藏層，表示本身也會在訓練中改變；反向傳播用連鎖律把輸出端的梯度一層層傳回去。這週的現場課「LLMs and Transformers!」把語言模型分成 decoder、encoder、encoder-decoder 三種架構。

**第 7 週**動手寫 Transformer。PA6a 要在 `model.py` 裡實作 causal self-attention（每個位置只能看自己和左邊的 token，看不到後面的），用莎士比亞的文本訓練一個小模型，再調溫度取樣、計算 perplexity。這是整學期第一份不在 Jupyter notebook 裡寫的作業。

### 第 7–8 週：語音

第 7 週有一堂語音處理的現場課，沒有錄影，投影片公開；第 7、8 週的導讀依投影片講語音辨識的評估方式、聲音怎麼變成模型的輸入，以及 Whisper 的架構。作業是第 8 週的 PA6b：把一批句子（可以用自己 PA6a 模型產生的，沒做 PA6a 就用 repo 附的那一份）丟給語音合成變成音檔，再丟給語音辨識轉回文字，比對哪些資訊在來回之間不見了，並且用一段帶口音或停頓的真實錄音測同一條流程。

### 第 9–10 週：人與連結

最後兩週的資料換成人的行為和連結。預錄內容教的協同過濾與 PageRank 都不是神經網路，算的是矩陣和圖。

**第 9 週**教協同過濾：不看電影內容，只看評分矩陣，兩部電影被同一批人打的分數越像就越相似，再用使用者評過的電影去推估他沒看過的。PA7 把這個推薦函式包成工具，交給一個會呼叫工具的 LLM agent，另外再接上網頁搜尋和記憶功能。

**第 10 週**把網頁看成有向圖。PageRank 的想法是「被重要的頁面連到的頁面也重要」，用反覆迭代算出每一頁的分數；社群網路的部分教 degree、betweenness、clustering coefficient 這幾種衡量節點位置的方法。期末那堂現場課的[投影片](https://web.stanford.edu/class/cs124/lec/final124_26.pdf)補上預訓練之後的事：用偏好資料做對齊（preference alignment）、可解釋性、emergent misalignment，再加一段機器翻譯，最後講修完這門課可以接哪些課。

## 一個例子：這門課要你算的是這種東西

以下是本文自擬的例子，用來示範第 2 週的 bigram 語言模型，數字很小，可以心算。

訓練語料只有三句，已經切好詞，`<s>` 和 `</s>` 是句首與句尾的標記：

```
<s> 我 喜歡 攀岩 </s>
<s> 我 喜歡 咖啡 </s>
<s> 你 喜歡 攀岩 </s>
```

bigram 模型假設每個詞只跟前一個詞有關，機率直接用次數相除：P(後 | 前) = 「前 後」連著出現的次數 ÷「前」出現的次數。

| 要算的機率 | 計算 | 結果 |
|---|---|---|
| P(我 \| `<s>`) | 三句裡有兩句以「我」開頭 | 2/3 |
| P(你 \| `<s>`) | 三句裡有一句以「你」開頭 | 1/3 |
| P(喜歡 \| 我) | 「我」出現 2 次，後面都接「喜歡」 | 1 |
| P(喜歡 \| 你) | 「你」出現 1 次，後面接「喜歡」 | 1 |
| P(攀岩 \| 喜歡) | 「喜歡」出現 3 次，其中 2 次接「攀岩」 | 2/3 |
| P(咖啡 \| 喜歡) | 「喜歡」出現 3 次，其中 1 次接「咖啡」 | 1/3 |
| P(`</s>` \| 攀岩)、P(`</s>` \| 咖啡) | 這兩個詞後面都是句尾 | 1 |

一整句的機率是每一步相乘。「我 喜歡 攀岩」是 2/3 × 1 × 2/3 × 1 = 4/9。

從這張表可以讀出兩件事。

第一，**模型會給沒看過的句子機率**。「你 喜歡 咖啡」不在語料裡，但每一步都在別的句子出現過：1/3 × 1 × 1/3 × 1 = 1/9。語言模型學到的是詞與詞怎麼接，不是把句子背下來。

第二，**沒看過的組合會讓整句歸零**。「我 攀岩」這個組合在語料裡是 0 次，所以 P(攀岩 | 我) = 0，任何包含它的句子機率都是 0，即使這句話完全合理。第 2 週教的 smoothing 就是在處理這個問題：從看過的組合挪一點機率給沒看過的。

現在的 LLM 做的仍然是「給定前文，輸出下一個 token 的機率分布」。差別在於它不查次數表，而是用第 5 到 7 週教的向量、神經網路和 attention 來算這個分布，所以能參考更長的前文，也能讓意思相近的前文共用統計。

**自我檢查**：用同一份語料算「你 喜歡 攀岩」的機率。答案是 1/3 × 1 × 2/3 × 1 = 2/9。如果你還能說出為什麼它比「你 喜歡 咖啡」高（語料裡「喜歡」後面接「攀岩」的次數是「咖啡」的兩倍），第 2 週的閱讀就不會卡住。

## 先修

課程網站列了四項：

| 先修 | 用在哪裡 | 站內對應 |
|---|---|---|
| CS106B（資料結構） | 作業裡的字典、索引、矩陣操作 | — |
| Python（CS106A 的程度） | 全部作業都用 Python | — |
| CS109（機率） | 條件機率、連鎖律、最大概似估計，從第 2 週就開始用 | [CS109 課程總覽](/posts/learning/2026-08-21-stanford-cs109-probability) |
| CS107 程度的 UNIX 與程式成熟度 | 終端機、conda 環境、Git；第 7 週起的作業是多檔案專案 | [CS107 課程總覽](/posts/learning/2026-08-21-stanford-cs107-computer-systems) |

課號是 100 系列，但 CS107 和 CS109 兩門都是必要先修。課程網站說明，前幾年這兩門不是必要先修，學生反映先修過會比較順，才改成必修；CS107 可以同一學期一起修。只缺 UNIX 的人不用把 CS107 整門修完，FAQ 給了一份[舊版 CS107 的 UNIX 影片清單](https://web.stanford.edu/class/archive/cs/cs107/cs107.1186/unixref/)，指定要看登入、檔案系統、常用指令、Shell 與 Vim 幾段。

怎麼判斷自己夠不夠：

1. **機率**：上面的 bigram 例子算得出來，也說得出為什麼整句機率是每一步相乘。
2. **Python**：能讀一個文字檔，用字典數出每個詞出現幾次，印出前十名。
3. **UNIX**：能在終端機建一個 conda 環境、clone 一個 repo、啟動 Jupyter notebook，過程不用查指令。

三項都做得到就可以從第 2 週開始。第 1 項卡住，先讀 CS109 的[條件機率](/posts/learning/2026-08-22-stanford-cs109-lecture-02-conditional-probability)那一堂；第 3 項卡住，先做完 [PA0](https://github.com/cs124/pa0-jupyter-tutorial)。

## 上課方式與評分

CS124 是翻轉教室。多數週的安排是：先看兩到兩個半小時的預錄影片，讀指定章節，週二到教室上現場講課或實作課，做一份每週複習測驗，交一份程式作業。十個週二有五場現場講課（第 1、5、6、7、10 週）和五場實作課，現場的部分都不錄影，其中六天規定要到場。

沒有期中考，也沒有期末考，最後一項要求是 PA7。

| 項目 | 比重 |
|---|---|
| 出席 | 3% |
| 作業與測驗 | 97%，其中作業佔 73%、測驗佔 27% |

作業那 73 分的分法是 PA1 到 PA6 各 9 分、PA7 佔 18 分、PA0 佔 1 分。測驗共九次，可以翻書、可以重複作答，取最好的八次。PA0 到 PA6 合計有四天的免罰遲交額度。

九份作業的起始碼都是公開的 GitHub repo，全部用 Python：

| 作業 | 內容 | 起始碼 |
|---|---|---|
| PA0 | 環境設定與 Jupyter 教學 | [pa0-jupyter-tutorial](https://github.com/cs124/pa0-jupyter-tutorial) |
| PA1 | 正規表達式與 BPE 斷詞 | [pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions) |
| PA2 | 邏輯迴歸與文本分類 | [pa2-logistic-regression](https://github.com/cs124/pa2-logistic-regression) |
| PA3 | 資訊檢索 | [pa3-information-retrieval](https://github.com/cs124/pa3-information-retrieval) |
| PA4 | 詞嵌入 | [pa4-embeddings](https://github.com/cs124/pa4-embeddings) |
| PA5 | 神經網路 | [pa5-neural-networks](https://github.com/cs124/pa5-neural-networks) |
| PA6a | Transformer | [pa6a-transformers](https://github.com/cs124/pa6a-transformers) |
| PA6b | 語音合成與辨識 | [pa6b-speech](https://github.com/cs124/pa6b-speech) |
| PA7 | 協同過濾加 LLM agent | [pa7-agent](https://github.com/cs124/pa7-agent) |

PA7 跟前面幾份不一樣。PA1 到 PA6 可以一個人做或兩人一組，PA7 規定三到四人一組，配分是其他作業的兩倍，而且不能用遲交額度。內容分兩部分：先實作協同過濾來推薦電影，再做一個會呼叫工具的 LLM agent，接上網頁搜尋與記憶。

自學者要注意兩份作業得自己申請外部服務的帳號。PA7 要 Together AI 與 SerpAPI 的 API key：README 提醒建立 Together AI 的 key 時可能要填付款資料，SerpAPI 的免費帳號有 250 次搜尋額度。PA6b 要 Cartesia 的帳號來跑語音合成與辨識，README 說免費帳號的額度夠做完作業。額度與收費以各服務當下的頁面為準。

課程對 LLM 的規定寫在榮譽守則裡：可以把語言模型當助教用，幫助自己理解；不能把 LLM 產生的程式碼直接貼進作業。

## 教科書要讀哪一版

指定閱讀幾乎都來自同一本書：Jurafsky 與 James H. Martin 合著的 [*Speech and Language Processing* 第三版](https://web.stanford.edu/~jurafsky/slp3/)。全書以逐章 PDF 免費放在網路上，不用註冊。對自學者來說，這本書是這門課最完整的公開材料，預錄影片看不到的內容大多可以從這裡讀到。

要注意的是版本。課綱的章號對的是 2025 年 8 月版，教科書網站目前放的是 2026 年 8 月版，章節重排過。照課綱的連結點進去，會讀到別的章：

| 課綱寫的 | 主目錄現在的同號檔案 |
|---|---|
| 第 7 章 Large Language Models | Transformers and Pretraining |
| 第 8 章 The Transformer | Post-training |
| 第 10 章（詞嵌入補充閱讀） | Interpretability |
| 第 14 章 Phonetics | RNNs and LSTMs |
| 第 15 章 Automatic Speech Recognition | Phonetics and Speech Feature Extraction |

舊版完整保留在 [`old_aug25/`](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) 目錄。**照課綱的章號與頁碼讀書時，用 `old_aug25/` 那一版。** 想看最新的寫法再回主目錄，但要知道內容搬過家：舊版第 7 章講 LLM 的部分移到新版第 1 章，舊版第 8 章的 Transformer 併進新版第 7 章。

## 校外讀者拿得到什麼

課程不開放旁聽，但 FAQ 明講歡迎沒有選課的人自己看材料、做作業，只要不交作業、不在課程論壇發問。

**拿得到：**

- **整本教科書。** 逐章 PDF 與合併版都免費。
- **九份作業的起始碼。** 上面表格裡的 repo 全部可以 clone。
- **實作課的題目與解答。** 實作課二到五的題目在 [cs124/labs](https://github.com/cs124/labs)，其中二、三、五附解答；[實作課一的投影片](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf)是公開 PDF，每題的下一頁就是解答。
- **多數投影片。** 預錄主題的投影片（斷詞、編輯距離、n-gram、邏輯迴歸、資訊檢索、詞嵌入、神經網路、協同過濾、連結分析、社群網路）和四場現場講課的投影片（導論、LLM 與 Transformer、語音、期末），都掛在[課程首頁的課表](https://web.stanford.edu/class/cs124/)上，PDF 與 pptx 都有。

**拿不到：**

- **預錄影片。** 放在 Canvas，要 Stanford 帳號。
- **現場講課與實作課的內容。** 這十場都不錄影，只拿得到投影片。
- **計算社會科學那一堂的投影片。** 五場現場講課裡只有這一份要 Stanford 登入。
- **每週複習測驗與自動評分。** 都在 Gradescope 上，要選課帳號。作業做完之後，沒有機器幫你對答案，只有 repo 裡附的公開測試。

YouTube 上有一個 [From Languages to Information 頻道](https://www.youtube.com/channel/UC_48v322owNVtORXuMeRmpA)，放了一整套 CS124 的錄影，FAQ 也鼓勵大家去看。那套錄影是較早的課綱，多了 Naive Bayes、詞性標註、聊天機器人這些現在已經不教的主題，少了 LLM 與 Transformer、語音和 agent。斷詞、編輯距離、n-gram、邏輯迴歸、資訊檢索、詞嵌入、神經網路、推薦系統、PageRank 與社群網路都可以拿它配著看；缺的那三塊要靠投影片、教科書和作業。

## 兩條讀法

**從頭走一遍。** 照週次表一列一列來：讀該週的指定章節，看投影片，讀本站那一週的導讀，做那一份作業。第 2 到 6 週的作業都在 notebook 裡，數字小到可以手算驗證；第 7 週之後才需要比較多的運算時間和付費 API。實作課有公開解答的幾週（第 2、3、4、9 週），先自己做完再對答案。

**依目的挑幾週。** 已經有機器學習底子的人，可以只讀需要的部分：

- **在做 RAG 或搜尋**：[第 4 週](/posts/ai/2026-08-22-cs124-week4-information-retrieval)，再補[第 5 週](/posts/ai/2026-08-22-cs124-week5-embeddings-social-nlp)的向量相似度。先把 tf-idf 這個可以手算的基準弄懂，之後換成向量檢索時才知道改善了什麼。
- **想弄懂 LLM 內部**：[第 2 週](/posts/ai/2026-08-22-cs124-week2-tokens-ngram)的 BPE 與 n-gram、[第 6 週](/posts/ai/2026-08-22-cs124-week6-neural-networks-llms)、[第 7 週](/posts/ai/2026-08-22-cs124-week7-transformers-speech)，然後做 PA6a。
- **要做 agent**：[第 9 週](/posts/ai/2026-08-22-cs124-week9-recommenders-agent)。PA7 示範了怎麼把一個確定性的函式包成工具、怎麼測一個每次輸出都不太一樣的系統。
- **做語音產品**：[第 8 週](/posts/ai/2026-08-22-cs124-week8-speech-git)，配第 2 週的編輯距離（詞錯誤率就是用它算的）。
- **做推薦或圖分析**：[第 9 週](/posts/ai/2026-08-22-cs124-week9-recommenders-agent)前半和[第 10 週](/posts/ai/2026-08-22-cs124-week10-pagerank-networks)。

怎麼判斷自己走哪一條：看第 3 週。如果你能不查資料寫出邏輯迴歸的 loss，並且說得出梯度為什麼是「預測值減真實值，再乘上輸入特徵」，就可以挑著讀；說不出來，從第 2 週照順序走。

讀完之後往哪裡接，第 1 週的投影片也有指路：

| 想深入的方向 | 接哪門課 |
|---|---|
| 神經網路做 NLP | [CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning) |
| 從零訓練語言模型 | [CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch) |
| 自然語言理解 | [CS224U](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding) |
| 對話式助理與 agent | [CS224V](/posts/ai/2026-08-21-stanford-cs224v-agentic-ai) |
| 圖上的機器學習 | [CS224W](/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs) |

## 今晚可以做的事

1. 做上面那題 bigram 自我檢查，確認機率的部分沒問題。
2. 讀 [`old_aug25/2.pdf`](https://web.stanford.edu/~jurafsky/slp3/old_aug25/2.pdf)（Words and Tokens）講 BPE 的那一節，然後 clone [pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions)，把 BPE 那一題做出來。這是第 2 週作業的一部分，一個晚上做得完。
3. 環境裝不起來的話，先做完 PA0，再打開[實作課一的投影片](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf)，那是純 UNIX 文字處理的題目，做得動再回頭做 PA1。

**系列導覽**：下一篇 [Introduction and Setup：先把語言問題拆成可計算的元件](/posts/ai/2026-08-22-cs124-week1-introduction)

## 課程影片來源

官方 Winter 2026 課程頁（2026-10-10 即時讀取）寫明：預錄影片放在 Canvas 的 Modules（課號 186110），我實際開啟被導向 Stanford 登入頁，確認有登入牆；五場現場講課與五場實作課明寫 “not recorded”。YouTube 頻道 From Languages to Information 有一份 80 支的 “CS124 - Full Course” 播放清單，但分週標題（例如 Week 2: Naive Bayes、Week 6: Chatbots and Dialogue Agents）與 Winter 2026 課綱不同，不能當作當期錄影，所以不嵌入。

課程與錄影入口：

- [From Languages to Information YouTube 頻道](https://www.youtube.com/channel/UC_48v322owNVtORXuMeRmpA)
- [官方課程／講次來源](https://web.stanford.edu/class/cs124/)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-13：全文改寫成課程總覽。新增課程主線、十週各教什麼、bigram 手算例子、先修自我檢查與兩條閱讀路線；原本的查課過程（先修欄位沿革、封存目錄比對、選課人數等）移出正文。
- 2026-10-10：重查影片狀態。官方頁寫明預錄影片在 Canvas，實際開啟確認有登入牆；YouTube 頻道的週次標題與 Winter 2026 課綱不符，不嵌入；狀態改為需登入。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS124: From Languages to Information（Winter 2026 課程網站）](https://web.stanford.edu/class/cs124/) — 先修、課表、評分比重、旁聽與自學規定、榮譽守則
- [CS124 第 1 週導論投影片](https://web.stanford.edu/class/cs124/lec/intro26.pdf) — LLM 元件清單與後續課程
- [CS124 期末講課投影片](https://web.stanford.edu/class/cs124/lec/final124_26.pdf) — 最後一堂現場課的大綱
- [Speech and Language Processing 第三版](https://web.stanford.edu/~jurafsky/slp3/) — 教科書現行版本
- [SLP3 `old_aug25/` 目錄](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) — 課綱章號對應的 2025 年 8 月版
- [cs124/pa7-agent](https://github.com/cs124/pa7-agent) — PA7 的分組規定、兩部分結構與 API key 需求
- [cs124/pa6a-transformers](https://github.com/cs124/pa6a-transformers) — PA6a 的實作範圍
- [cs124/pa6b-speech](https://github.com/cs124/pa6b-speech) — PA6b 的流程與 Cartesia 帳號需求
- [cs124/pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions) — 第 2 週作業
- [cs124/labs](https://github.com/cs124/labs) — 實作課題目與解答
- [From Languages to Information YouTube 頻道](https://www.youtube.com/channel/UC_48v322owNVtORXuMeRmpA) — 較早課綱的公開錄影
- [Mining of Massive Datasets 第 9 章](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf) — 第 9 週協同過濾的指定閱讀
- [Networks, Crowds, and Markets](https://www.cs.cornell.edu/home/kleinber/networks-book/) — 第 10 週社群網路的指定閱讀
- [Stanford CS 課程地圖](/posts/learning/2026-08-20-stanford-cs-course-map) — CS124 在主線課程裡的位置
