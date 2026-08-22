---
title: "Stanford CS124 導讀：課號掛 100，先修寫死四門，而且下一學年整年不開"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs124, ai-course, stanford, nlp, retrieval, llm]
lang: zh-TW
series:
  name: "Stanford CS124 導讀"
  order: 1
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 8
tldr: "CS124 是 Stanford NLP 分支的第一門課，教科書是 Jurafsky 自己免費放在網路上的《Speech and Language Processing》，九個作業 repo 全部公開。但課程網站首頁掛著一行公告：2026–27 學年整年不開。而且那份課綱指定的章號，已經跟 2026 年 8 月版的教科書對不上了。"
description: "Stanford CS124: From Languages to Information 完整導讀。逐項核對先修原文、十週課表、九個作業 repo 與評分配比，比對 Winter 2026 課綱與 SLP 第三版 2026 年 8 月版的章號落差，並確認自學者實際拿得到哪些材料、拿不到哪些。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en)

[CS124: From Languages to Information](https://web.stanford.edu/class/cs124/) 是 Stanford 電腦科學系的語言與資訊入門課，由 [Dan Jurafsky](https://web.stanford.edu/~jurafsky/) 開，同時掛在語言學系底下（LINGUIST 180／280）。它教的是怎麼把一堆非結構化的文字、語音和社群連結變成可以計算的東西：斷詞、分類、檢索、推薦、轉寫。課程自己的定位寫得很白——它是 CS224N、CS246、CS276、CS336 這一整排研究所課的**大學部總入口**。

這門課在 [Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)裡是 NLP 分支的第一格。地圖那篇回答的是「它在階梯的哪一層」。這篇要回答的是進去之後會發生什麼事：課表怎麼排、作業長什麼樣、哪一份是分水嶺、沒選到課的人實際拿得到多少。

範圍先講清楚。**這篇不包含逐堂投影片精讀，也不包含錄影內容**——現行這屆的錄影鎖在 Canvas 裡，非選課者拿不到，下面會講清楚拿不到的邊界在哪。本篇的依據是 Winter 2026 的課程網站、[ExploreCourses](https://explorecourses.stanford.edu/search?q=CS+124&view=catalog) 條目、公開的作業 repo，以及教科書網站本身。

## 這門課的硬事實

Winter 2026 這屆是 Tu/Th 下午在 Hewlett 200 上課，三到四學分，可以抵 WAY-AQR 的通識要求。課程網站說每年學生「almost 400」，而且**沒有選課上限**，原文是「cs124 has no enrollment cap, so everyone is admitted!」。ExploreCourses 上這一 section 的選課數是 350（詳細數字見附錄）。

但首頁最上面那行公告才是這屆真正的訊息：課程描述的第一個括號裡就寫著「which will not be taught in AY 2026-2027, so take it now!」。理由頁面自己交代了，不用猜：「because I will be on sabbatical」。

ExploreCourses 的 2026–2027 條目對得上。CS 124 那一格沒有任何開課時段，只留一行「Last offered: Winter 2026」。頁面接著建議，如果你得在 Winter 2028 之前修到這門課，就該修這一屆。

旁聽的答案是「No and yes」。不能旁聽，理由是助教的工作量按選課人數分配，旁聽等於要助教做白工。但**所有課程材料都是公開的**：官網明確鼓勵非選課者自己看影片、自己做作業，只要不交作業、不在 Ed 論壇問問題。這個立場對自學者很關鍵——它不是默許，是寫在 FAQ 裡的邀請。

還有一條容易被忽略的硬規定：這門課**必須同步修**，不接受非同步。全學期十個星期二各有一場現場講課或實作課，其中六天強制到課，而且**現場的部分一律不錄影**。醫療因素或「這學期不修就畢不了業」可以個別申請例外。

## 課號說謊，而且說謊的證據就寫在同一頁

CS124 掛在 100 系列，看起來像大二的課。它的先修欄位不是這樣寫的：

> Prerequisites: CS106B, Python (at the level of CS106A), CS109 (or equivalent background in probability), and programming maturity and knowledge of UNIX equivalent to CS107 (or taking CS107 or CS1U concurrently).

四樣東西：C++ 的資料結構課、Python、機率課、以及 [CS107](https://explorecourses.stanford.edu/search?q=CS107&view=catalog) 等級的 UNIX 與程式成熟度。CS107 和 [CS109](https://explorecourses.stanford.edu/search?q=CS109&view=catalog) 都在 Stanford CS 系的五門核心課裡。系上學位要求頁對那五門有一條硬規定，原文是「must take it for 5 units」——不接受降學分的版本。

換句話說，一門三到四學分的 100 系列課，先修欄位裡站著兩門不准降學分的五學分課。

更有意思的是，**這條先修不是一開始就這麼寫的，而課程頁面自己交代了改動的經過**：

> In some previous years CS107 and CS109 were optional. Many students advised us that it would have been helpful to have 107 and 109 first. So now both are required.

把封存目錄裡那份 2021 年的舊課綱打開，當年的原文只有一句：「CS106B. CS 107 can be helpful, but if you haven't had it we'll cover the required UNIX material.」那時候不但不要求 CS107，課程還負責幫你補 UNIX。

現在補課的責任回到學生身上。FAQ 直接給了一份[舊版 CS107 的 UNIX 影片清單](https://web.stanford.edu/class/archive/cs/cs107/cs107.1186/unixref/)，指定要看哪幾段：登入、檔案系統前七支、常用指令前七支、Shell 前三支，加上 Vim。

所以「課號＝難度」在這裡失效的方式很具體：**課號沒變，先修欄位變了兩次，而且是學生反映之後往上加的。** 判斷一門 Stanford 課的門檻，看 ExploreCourses 的 `Prerequisites` 欄位，不要看數字。

## 教科書免費，作者就是講台上那個人

這門課的指定閱讀只有一本書：Jurafsky 與 James H. Martin 合著的 [Speech and Language Processing 第三版](https://web.stanford.edu/~jurafsky/slp3/)。全書以逐章 PDF 的形式免費掛在網路上，也有整本合併的單一 PDF。

這是自學者能從這門課拿到的最大一筆資產。**它不是課程材料的附屬品，而是這個領域被廣泛採用的教科書本身，作者之一就站在這門課的講台上。**

目前的狀態是 2026 年 8 月 19 日版。網站首頁的更新說明講了三件事。第一，這一版第一次有了第 1 章，大量 LLM 內容從舊的第 7 章搬過來。第二，可解釋性那一章目前是個「about half」的殘稿。第三，是一句在教科書網站上很少見的話：

> We used Claude Opus 5 to suggest more exercises for various chapters, and also to do a pass over the first 8 chapters to point out any bugs it could find. It found a lot.

把這句話跟課程網站的加分規則放在一起看會更有意思。CS124 給學生的其中一項加分，是**成為第一個在 Jurafsky and Martin 教科書裡找到錯字的人**，不含圖表編號的錯誤。同一本書，一邊請模型掃前八章，一邊懸賞學生抓字。

還有一件事值得記下來：教科書的第 12 章標題是「Agents」，索引頁上標著 **[not written yet]**，沒有連結。而這門課分數最重的那份作業，就是要學生做一個 agent。

## 課綱指的章號，已經對不上現在的書了

這是自學者今天照著 CS124 課綱讀書會立刻撞到的一件事，而且沒有任何頁面會警告你。

課程網站的閱讀指定寫著「Chapter 7: Large Language Models (only pages 1-11 and page 17)」與「Chapter 8: The Transformer」，連結指向 `slp3/7.pdf` 和 `slp3/8.pdf`。這些連結今天還活著，但檔案內容換了。我把兩個檔案抓下來看第一頁的章名：

| 課綱寫的 | 連結指向 | 今天打開會看到 |
|---|---|---|
| Ch7 Large Language Models | [7.pdf](https://web.stanford.edu/~jurafsky/slp3/7.pdf) | Transformers and Pretraining |
| Ch8 The Transformer | [8.pdf](https://web.stanford.edu/~jurafsky/slp3/8.pdf) | Post-training |
| Ch10（嵌入補充讀物） | [10.pdf](https://web.stanford.edu/~jurafsky/slp3/10.pdf) | Interpretability（殘稿） |
| Ch14 Phonetics | [14.pdf](https://web.stanford.edu/~jurafsky/slp3/14.pdf) | RNNs and LSTMs |
| Ch15 Automatic Speech Recognition | [15.pdf](https://web.stanford.edu/~jurafsky/slp3/15.pdf) | Phonetics and Speech Feature Extraction |

成因不需要推測，教科書網站自己寫了：舊的第 8 章（Transformers）被併進舊的第 7 章的剩餘部分，合成一章新的。頁碼指定跟著全部失準。

課程網站標的版本是「third edition August 2025 release」，而那一版仍然完整保留在 [`old_aug25/`](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) 目錄裡。我核對過該目錄下的檔案：`7.pdf` 的章名是 Large Language Models、`8.pdf` 是 Transformers、`14.pdf` 是 Phonetics、`15.pdf` 是 Automatic Speech Recognition——跟課綱一字不差。

**所以照 CS124 課綱自學的正確做法是：章名與頁碼走 `old_aug25/` 那一版，想讀最新內容再回主目錄。** 兩份混著讀，你會在「第 8 章講什麼」這件事上跟課綱吵一整個晚上。

## 一門 2026 年的 NLP 課，怎麼同時教 tf-idf 和 LLM

看週次表就知道比例，不用猜。這是 Winter 2026 十週的骨架：

| 週 | 主題 | 指定閱讀（課綱標的章號） |
|---|---|---|
| 1 | 導論（現場） | — |
| 2 | 斷詞與 BPE、編輯距離、n-gram 語言模型 | J+M Ch2、Ch3 |
| 3 | 邏輯迴歸與文本分類 | J+M Ch4 |
| 4 | 資訊檢索 | J+M Ch11（Information Retrieval and RAG） |
| 5 | 詞嵌入＋計算社會科學（現場） | J+M Ch5、Ch10 |
| 6 | 神經網路＋「LLMs and Transformers!」（現場） | J+M Ch6 |
| 7 | 語音處理（現場，選修加分） | J+M Ch7、Ch8 |
| 8 | 語音（實作課四：PA7 與 Git） | J+M Ch14、Ch15 |
| 9 | 協同過濾與 LLM 課堂倫理（實作課五） | *Mining of Massive Datasets* Ch9 |
| 10 | PageRank 與社群網路（現場） | *Introduction to Information Retrieval* Ch21、Easley & Kleinberg |

答案是：**LLM 沒有把前半段擠掉，它接在後面。**

前四週仍然是斷詞、編輯距離、n-gram、邏輯迴歸、倒排索引。最後兩週仍然是協同過濾與 PageRank，用的還是 Leskovec 那本 [*Mining of Massive Datasets*](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf) 和 Easley 與 Kleinberg 的 [*Networks, Crowds, and Markets*](https://www.cs.cornell.edu/home/kleinber/networks-book/)。Transformer 與 LLM 集中在中段那兩週，是「嵌入 → 神經網路 → transformer」這條坡道的終點，不是起點。

真正被擠掉的東西，要跟舊版並排才看得出來。2021 年那版課綱裡有、現在整個不見的包括三樣：Naive Bayes 與情感分析（現在直接從邏輯迴歸開始）、詞性標註與命名實體識別、以及 ELIZA 與 PARRY 那組聊天機器人史的指定閱讀。

**還有兩次期中考。** 現在這門課沒有期中也沒有期末，課綱原文是「There is no final exam and midterm.」，最後一項課程要求就是那份程式作業。

另外，第 4 週那章的標題本身就是這幾年的變化——J+M 的第 11 章現在叫「Information Retrieval and Retrieval-Augmented Generation」。tf-idf 沒有被淘汰，它變成 RAG 那一章的前半。

## 作業長什麼樣，以及哪一份是分水嶺

課綱寫的是七份程式作業（PA1 到 PA7），再加上一份設定用的 PA0。實際上 PA6 拆成 6a 與 6b 兩份，所以起始碼一共是九個公開 GitHub repo，全部用 Python：

| 作業 | 主題 | 起始碼 |
|---|---|---|
| PA0 | 環境設定與 Jupyter 教學 | [pa0-jupyter-tutorial](https://github.com/cs124/pa0-jupyter-tutorial) |
| PA1 | 正規表達式與 BPE 斷詞 | [pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions) |
| PA2 | 邏輯迴歸與文本分類 | [pa2-logistic-regression](https://github.com/cs124/pa2-logistic-regression) |
| PA3 | 資訊檢索 | [pa3-information-retrieval](https://github.com/cs124/pa3-information-retrieval) |
| PA4 | 詞嵌入 | [pa4-embeddings](https://github.com/cs124/pa4-embeddings) |
| PA5 | 神經網路 | [pa5-neural-networks](https://github.com/cs124/pa5-neural-networks) |
| PA6a | Transformers | [pa6a-transformers](https://github.com/cs124/pa6a-transformers) |
| PA6b | 語音（TTS 與 STT） | [pa6b-speech](https://github.com/cs124/pa6b-speech) |
| PA7 | Agent | [pa7-agent](https://github.com/cs124/pa7-agent) |

分水嶺是 **PA7**，而且它的性質跟前面每一份都不同。

PA1 到 PA6 可以獨力做，也可以找一個人配對。PA7 **強制三到四人一組**，不准單幹，理由課綱寫得很清楚：這份作業的目的之一就是學會做團隊專案。它的配分是其他每一份的兩倍，而且**不能用遲交日**（其他作業共有四天遲交額度）。

內容是把整學期串起來：README 寫明第一部分實作協同過濾來推薦電影，第二部分實作一個「LLM agent that can make tool calls to take on web search and memory functionalities」。也就是說，第九週那個經典的協同過濾演算法，和一個會呼叫工具的 agent，被塞進同一個 `agent.py`。

它同時是這門課成本最高的一份作業：環境要裝 `dspy`、`together`、`mem0ai`、`serpapi`，而且要自己申請 Together AI 的 API key——README 直接寫了「you may have to add some payment information to create an API key」。PA6b 也一樣，需要 Cartesia 的帳號跑 TTS 與 STT。**這兩份作業自學者做得動，但要自己付 API 錢。**

另外值得記一筆的是這門課對 LLM 的立場，寫在榮譽守則裡，不是含糊帶過：

> You should use language models like you use a TA, to improve your understanding. You may not paste code directly from an LLM into your programming assignment.

同一份榮譽守則的舊版快照裡沒有這兩句，只有「用 ChatGPT 幫你寫程式是違反榮譽守則」那半句。教學團隊裡還有一位掛名 Ethics TA 的助教。

## 自學者實際拿得到什麼、拿不到什麼

逐項講，不要籠統。

**拿得到：**

- **教科書全部**。逐章 PDF 加整本合併版，免費，不用註冊。這是最大的一塊。
- **全部作業的起始碼**。九個 repo 我逐一開過，全部公開可 clone。
- **實作課的題目和解答**。實作課二、三、五的題目與**解答**都在 [cs124/labs](https://github.com/cs124/labs) 這個公開 repo 裡，實作課一的投影片是公開 PDF。
- **五場現場講課的投影片，四場拿得到**。導論、LLM 與 Transformer、語音、期末講課的 pptx 與 pdf 都在 `web.stanford.edu/class/cs124/lec/` 底下公開。

**拿不到：**

- **所有預錄影片**。課表裡每一列的「Canvas Videos」都指向 `canvas.stanford.edu`，要 Stanford 帳號。
- **五場現場講課與五場實作課的內容**。課程網站寫得很直接：「the 5 live lectures and the 5 labs are **not recorded**」。你拿得到投影片，拿不到那兩小時。
- **計算社會科學那場講課的投影片**。這是五場裡唯一的例外——它的檔案放在 `cs124/restricted/` 底下，我開過，回 403。其餘四場的 `lec/` 檔案都回 200。
- **九次隨堂測驗與自動評分**。全在 Gradescope 上，要選課帳號。這也代表你做完作業沒有機器告訴你對不對。

還有一項介於兩者之間，值得單獨講：**YouTube 上確實有一整套 CS124 的錄影**，FAQ 也明講「we encourage you to watch the videos on YouTube」。但那個[頻道](https://www.youtube.com/channel/UC_48v322owNVtORXuMeRmpA)的播放清單標題是另一版課綱：第 2 週是 Naive Bayes、第 4 週是詞性與命名實體標註、第 6 週是 Chatbots and Dialogue Agents。這幾項在 Winter 2026 的課表上全部找不到，卻全部出現在 2021 年那版封存課綱上。**公開錄影覆蓋的是這門課的前半身，transformer 與 LLM 那兩週不在裡面。** 我沒有找到任何官方頁面標註這批影片的錄製年份，這一點列在附錄的未確認項目裡。

## 怎麼開始

**怎麼做**：把 [`old_aug25/2.pdf`](https://web.stanford.edu/~jurafsky/slp3/old_aug25/2.pdf)（Words and Tokens）的前二十六頁讀完，然後 clone [pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions)，把 BPE 斷詞那一題做出來。這是這門課第二週的完整份量，一個晚上做得完。它會直接告訴你一件事：如果 UNIX 和 Python 的部分讓你卡住，先修欄位裡的 CS107 不是裝飾。

**怎麼做（更快的版本）**：打開公開的[實作課一投影片](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf)，那是純 UNIX 文字處理的題目，解答就在下一張。做不動就先補 UNIX，別急著往下走。

## 附錄：數字、學期代碼與未確認項目

- **學分與通識**：ExploreCourses 的 2025–2026 條目寫 3-4 units、UG Reqs 為 WAY-AQR，Grading 為 Letter or Credit/No Credit。cross-list 為 LINGUIST 180（大學部）與 LINGUIST 280（研究所）。
- **選課人數**：課程 FAQ 說每年「almost 400 students」且無選課上限；ExploreCourses 的 Winter 2026 section（Class # 7010）顯示 350 / 500。兩個數字量的東西不同，頁面沒有說明兩者關係，此處不作推論。
- **評分配比**：3% 出席（強制到課的講課與實作課）＋ 97% 作業與測驗。97% 裡面，作業佔 73%、測驗佔 27%。作業那 73 分的分法是 PA1–PA6 各 9 分、PA7 佔 18 分、PA0 佔 1 分。測驗共九次，取最好的八次計分，沒有遲交額度。
- **A+ 的條件**：課綱原文是「It is very easy to get an A in this class but hard to get an A+」，A+ 要同時滿足四項：所有作業與測驗滿分、十個星期二全勤（含非必修的實作課）、在 Ed 論壇給出至少五則實質有幫助的回答、以及在實作課／測驗／作業的加分題上拿到至少三次分數。A 是總分 93% 以上。
- **遲交規則**：PA0–PA6 共四天免費遲交額度，用完之後每天扣 20%，逾期超過四天不收。PA7 不能用遲交日。
- **Stanford 學期代碼**：封存網址格式為 `web.stanford.edu/class/archive/cs/cs124/cs124.<代碼>/`，末碼 2=秋、4=冬、6=春、8=夏。
- **封存目錄標示與內容不符**：`cs124.1254` 這個目錄按代碼與網頁 title 都標成 Winter 2025，但打開之後裡面是 **Winter 2026 那份頁面的早期草稿**——同樣的「2026–27 不開課」公告、同樣的 1 月 6 日開課日期，只是助教欄還是 TBD、作業還沒放起始碼連結。兩份並排還看得到兩處改動：那份草稿裡 PA7 的名字是 *Chatbot*，正式版改成 *Agent*；榮譽守則也是正式版才加上「像用助教一樣用語言模型」那兩句。`cs124.1204` 也對不上：title 寫 Winter 2021，但課表日期從 3 月 30 日排到 6 月 3 日，助教信箱是 `cs124-spr2021-staff`。**引用 CS124 封存頁時要打開內容核對，不要信目錄代碼。** 本文引用「2021 年那版」時指的是 `cs124.1204` 頁面上的內容，不是它的目錄標籤。
- **教科書章號的對照**：本文表格裡「今天打開會看到」那一欄，是我把 `slp3/` 主目錄與 `old_aug25/` 的 PDF 各自抓下來、讀第一頁章名比對出來的。主目錄版本頁首標示 Draft of August 19, 2026；`old_aug25/` 版本標示 Draft of August 24, 2025。另外主目錄的 `12.pdf` 仍然存在且可下載，但內容是標示 Draft of January 6, 2026 的 Machine Translation——索引頁上第 12 章列的是「Agents [not written yet]」，沒有給連結。
- **未確認項目**：（1）YouTube 頻道那批錄影的實際錄製年份，官方頁面沒有標註，本文只依播放清單主題與封存課綱的對應關係描述，不宣稱年份。（2）Winter 2026 各份作業的實際完成率、分數分布與平均投入時數，課程網站沒有公開任何一項，本文沒有這方面的宣稱。（3）2026–27 之後這門課會不會沿用同一份課綱，頁面只寫了不開課與建議修課時程，沒有講之後的內容規劃。

## 參考資料

- [CS124: From Languages to Information（Winter 2026 課程網站）](https://web.stanford.edu/class/cs124/) — 本文所有先修原文、課表、評分配比、旁聽與同步修課規定、榮譽守則引文的出處。
- [ExploreCourses：CS 124（2026–2027 檢視）](https://explorecourses.stanford.edu/search?q=CS+124&view=catalog) — 顯示「Last offered: Winter 2026」與該學年無開課時段，以及 LINGUIST 180/280 的 cross-list。
- [ExploreCourses：CS 124（2025–2026 檢視）](https://explorecourses.stanford.edu/search?q=CS+124&view=catalog&academicYear=20252026) — 學分數、WAY-AQR、Class # 7010 的 350/500 選課數與教學團隊名單。
- [Speech and Language Processing 第三版（線上版）](https://web.stanford.edu/~jurafsky/slp3/) — 2026 年 8 月 19 日版的更新說明、章節索引、第 12 章「Agents [not written yet]」、以及使用 Claude Opus 5 校閱前八章的原文。
- [SLP3 `old_aug25/` 封存目錄](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) — 課綱標的那一版，用來核對章號落差。
- [cs124/pa7-agent](https://github.com/cs124/pa7-agent) — PA7 的分組規定、協同過濾＋LLM agent 兩部分結構、套件清單與 Together AI 付費 key 的原文。
- [cs124/pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions) — 第二週作業的實際內容與環境需求。
- [cs124/pa4-embeddings](https://github.com/cs124/pa4-embeddings)、[cs124/pa6b-speech](https://github.com/cs124/pa6b-speech) — 用來確認起始碼公開狀態與外部 API 需求（PA6b 需要 Cartesia 帳號）。
- [cs124/labs](https://github.com/cs124/labs) — 實作課題目與解答的公開來源。
- [CS124 封存版 `cs124.1204`](https://web.stanford.edu/class/archive/cs/cs124/cs124.1204/) — 舊版先修原文、Naive Bayes 與聊天機器人史的指定閱讀、兩次期中考的評分配比。
- [CS124 封存版 `cs124.1254`](https://web.stanford.edu/class/archive/cs/cs124/cs124.1254/) — 目錄標籤與內容不符的那一份，也是榮譽守則舊版措辭與 PA7 舊名稱的比對來源。
- [Stanford CS BS Degree Requirements](https://www.cs.stanford.edu/bs-degree-requirements) — CS103、107、109、111、161 必須以五學分修習的原文。
- [From Languages to Information YouTube 頻道](https://www.youtube.com/channel/UC_48v322owNVtORXuMeRmpA) — 公開錄影的播放清單結構，用來確認涵蓋範圍。
- [Mining of Massive Datasets 第 9 章「Recommendation Systems」](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf) — 第九週協同過濾的指定閱讀，免費 PDF。
- [Networks, Crowds, and Markets](https://www.cs.cornell.edu/home/kleinber/networks-book/) — 第十週社群網路的指定閱讀；作者頁面上有完整的出版前草稿與逐章 PDF，同樣免費。
- [Stanford CS 課程導讀：按先修關係排一次](/posts/learning/2026-08-20-stanford-cs-course-map) — 本系列的入口地圖，CS124 在 NLP 分支的位置。
