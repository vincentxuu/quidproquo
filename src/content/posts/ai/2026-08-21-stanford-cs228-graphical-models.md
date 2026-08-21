---
title: "Stanford CS228 導讀：先修只寫「基本機率與演算法」，但這門課已經停開兩年"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs228, ai-course, stanford, probabilistic-graphical-models, bayesian-network, variational-inference]
lang: zh-TW
series:
  name: "Stanford CS 主線課程導讀"
  order: 9
tldr: "CS228 的官方先修就一句『basic probability theory and algorithm design and analysis』，沒有指定任何前置課程。但 ExploreCourses 顯示它最後一次開課是 Winter 2024，下一次排在 2026-27 冬季、講師欄還空著。自學者真正拿得到的是那份公開講義 cs228-notes：16 章寫完，最後一次改動停在 2025 年 6 月。"
description: "Stanford CS228: Probabilistic Graphical Models 導讀。實際讀過 ExploreCourses 條目、凍結在 Winter 2024 的課程官網、以及公開講義 cs228-notes 的每一章，整理先修門檻、五份作業的節奏、講義的真實完整度與維護狀態，以及它跟 CS236 的關係。"
draft: false
---

[CS 228: Probabilistic Graphical Models: Principles and Techniques](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog) 教的是一件在 2026 年很不流行的事：把一個大到不可能寫下來的機率分布，用一張圖壓成可以計算的東西。貝氏網路、馬可夫隨機場、變數消除、信念傳播、取樣、變分推論、參數與結構學習——一個學期十週走完表示、推論、學習三塊。

它在 Stanford 的 AI 課程地圖裡位置很特別：所有人都知道它存在，很少人真的修。障礙不在門檻。它的官方先修沒有指定任何前置課程，而隔壁的 [CS 234](https://explorecourses.stanford.edu/search?q=CS+234&view=catalog) 要求 CS229 或同等程度，低了一整層。真正的障礙是它已經兩年沒有開課，官網也凍結在最後一次開課的樣子。

這篇是把 ExploreCourses 的四個學年條目、凍結的課程官網、以及那份公開講義的每一章實際打開讀過之後寫的。涵蓋：硬規定寫了什麼、五份作業的節奏、講義的真實完整度、以及它跟 CS236 的關係。**不包含**逐章的數學推導——那是講義本身的工作，而講義是公開的。系列的階梯排序見[《Stanford CS 課程導讀》地圖文](/posts/learning/2026-08-20-stanford-cs-course-map)。

## 這門課的硬事實

先修條件原文只有一句，逐字抄自 [ExploreCourses 的 CS 228 條目](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog)：

> Prerequisites: basic probability theory and algorithm design and analysis.

沒有指定課號、沒有要求機器學習背景、沒有要求 PyTorch。[課程官網](https://cs228.stanford.edu/)的版本多了兩個詞（statistics、programming），並補上一條自我檢查：

> If you are able to comfortably complete homework 1 then you likely have all the relevant background knowledge.

課的規格：三到四學分、只在冬季開、講師 Stefano Ermon。ExploreCourses 的 2026-2027 學年頁面顯示這門課已經排進 **Winter 2027**，但講師欄與上課時間都還空著。

真正該注意的是它中間空掉的那一段：在兩個較早學年的頁面上，這門課的狀態都是 `Last offered: Winter 2024`——它連續兩個學年沒開。**ExploreCourses 沒有說明原因**，課程官網也沒有任何公告，這裡只有現象，沒有解釋。

順帶一提，這門課在 Stanford 的課表裡還有一個側面存在感：[MATH 151](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog) 的條目寫著，CS 主修可以申請用它抵掉 CS109，條件是「預期也會修 CS 228 或 CS 229」。它被寫進了另一門課的抵免規定裡。

旁聽政策查不到。官網只留了 SCPD 學生的聯絡窗口（`scpdsupport@stanford.edu`），對校內旁聽一個字都沒寫。

## 它真正在教的那個東西：把指數壓成多項式

講義第一章用垃圾郵件分類把整門課的問題意識立起來，這是最省時間的入口。你要對 `n` 個英文單字的出現與否加上「是不是垃圾郵件」建一個聯合分布，得寫下 2 的 n+1 次方個數字。存不下，也估不準。

接著它做一件事：假設所有單字在給定標籤之後條件獨立（Naive Bayes 假設），分布就拆成一堆小因子的乘積，參數量掉到 O(n)。[講義的說法](https://ermongroup.github.io/cs228-notes/preliminaries/introduction/)是：機率本質上是指數大小的物件，能操作它的唯一方式就是對它的結構做簡化假設。

整門課就是把這個動作系統化。圖用來**寫下**你做了哪些獨立假設，這是表示；圖的性質決定你**問得起**哪些問題，這是推論；而學習又反過來把推論當子程序反覆呼叫。三塊互相咬住，這也是講義的目錄結構。

這個框架的實用價值在於它給了一把尺：**看到任何機率模型，先問它假設了什麼獨立性，再問這個假設讓哪些查詢從指數變成多項式。** Transformer、diffusion、HMM 都能放進這把尺裡量——講義自己就這麼做了，下面會講到。

## 那份公開講義的實際狀態

自學者真正拿得到的東西是 [cs228-notes](https://ermongroup.github.io/cs228-notes/)，由 Volodymyr Kuleshov 與 Stefano Ermon 撰寫，掛在 GitHub Pages 上、MIT 授權、[原始碼公開](https://github.com/ermongroup/cs228-notes)。它不是投影片的附件，是一份可以獨立讀完的教材。

規模是 16 章加一份延伸閱讀清單，對齊課程的三塊：

| 區塊 | 章節 |
|---|---|
| Preliminaries | [Introduction](https://ermongroup.github.io/cs228-notes/preliminaries/introduction/)、[Probability Review](https://ermongroup.github.io/cs228-notes/preliminaries/probabilityreview/)、[Real-World Applications](https://ermongroup.github.io/cs228-notes/preliminaries/applications/) |
| Representation | [Bayesian networks](https://ermongroup.github.io/cs228-notes/representation/directed/)、[Markov random fields](https://ermongroup.github.io/cs228-notes/representation/undirected/) |
| Inference | [Variable elimination](https://ermongroup.github.io/cs228-notes/inference/ve/)、[Belief propagation](https://ermongroup.github.io/cs228-notes/inference/jt/)、[MAP inference](https://ermongroup.github.io/cs228-notes/inference/map/)、[Sampling](https://ermongroup.github.io/cs228-notes/inference/sampling/)、[Variational inference](https://ermongroup.github.io/cs228-notes/inference/variational/) |
| Learning | [Directed](https://ermongroup.github.io/cs228-notes/learning/directed/)、[Undirected](https://ermongroup.github.io/cs228-notes/learning/undirected/)、[Latent variable](https://ermongroup.github.io/cs228-notes/learning/latent/)、[Bayesian](https://ermongroup.github.io/cs228-notes/learning/bayesian/)、[Structure](https://ermongroup.github.io/cs228-notes/learning/structure/) |
| 收尾 | [The variational autoencoder](https://ermongroup.github.io/cs228-notes/extras/vae/) |

首頁上那句「The notes are still **under construction**」值得單獨講，因為它會誤導人。索引頁在四個地方標了 *under construction*：機率複習、應用、Bayesian learning 的例子、以及結構學習的 Bayesian structure learning。**把這四頁全部打開讀過之後，這些標記大多已經對不上內容了：**

- 機率複習不但寫完了，還寫得比課程需要的更深——它從 σ-algebra 與測度講起，明講材料改寫自 CS229 的機率講義與 STATS310 的講義。
- 應用那章是整份講義最長的一章，涵蓋影像、語言、音訊、因果推論、錯誤更正碼、計算生物、生態、經濟與醫療診斷。
- Bayesian learning 標的是「Examples（under construction）」，但那頁開頭就擺著兩個完整的例子。一個是偏心硬幣的 MLE 為什麼不會隨資料量變得更有信心，另一個是 bag-of-words 語言模型碰到未見詞時整句機率變成零。後面接共軛先驗、Beta、Dirichlet，最後把 Laplace smoothing 收成 Dirichlet 先驗的特例。
- 唯一還真的缺的是結構學習那章。score-based、Chow-Liu、AIC/BIC、BD score、constraint-based、order search 與 ILP 都在，但沒有獨立的 Bayesian structure learning 一節。

維護狀態就誠實一點。這個 repo 有兩千多顆星、沒有被封存，但**最後一次推送停在 2025 年 6 月**，而且那筆改動只是一則錯字修正。再往前翻，實質內容的編輯集中在 2023 到 2024 年初。它現在還掛著幾個沒被合併的 PR，最舊的那個開在六年前（精確數字見附錄）。

腐蝕開始出現，但也有人在補。講義裡有三處推薦「一位前 CS228 學生做的互動模擬」，全部指向同一個已經下線的 `pgmlearning.herokuapp.com`。其中兩處已經被改成 Wayback Machine 的封存版：d-separation 與變數消除。repo 裡有一筆 2024 年初的 commit 名字就叫「Update variable elimination web app link with archived version」。**只有結構學習那章的 K3 演算法模擬還指著原網址，實測回 404。**

## 講義自己怎麼安置 Transformer 和 diffusion

「2026 年還要不要學圖模型」是讀者真正會問的問題。這裡不自己編答案，直接看材料怎麼定位自己——而課程的兩份材料給的答案不一樣。

**官方課程描述沒有回答這個問題。** ExploreCourses 的條目列的應用是「語音辨識、生物模型與發現、醫療診斷、訊息編碼、視覺、機器人運動規劃」。課程官網的版本則是「機器學習、電腦視覺、自然語言處理與計算生物」。兩份都沒有提到深度學習、生成模型或 LLM。

**講義有回答，而且是明確地把現代模型收編進圖模型的框架。** 應用那章談 diffusion 時的說法是「Diffusion models are a class of PGMs that build upon the directed Markov chain structure」——把它當成有向馬可夫鏈結構上的一類圖模型。談語言模型時更直接：

> Many modern language models do not make strong independence assumptions and instead learn a fully connected PGM with a large quantity of data in order to avoid overfitting. Recent successes in commerical language products such as ChatGPT are based on the Transformer Architecture which is a fully connected graphical model.

（`commerical` 是原文拼字，逐字照抄。）

這段話的立場很清楚：Transformer 不是圖模型的替代品，是圖譜上「不做獨立假設」的那個極端——用資料量換掉結構假設。這正好是第一章那把尺的另一端。

而整份講義的收尾章節是[變分自編碼器](https://ermongroup.github.io/cs228-notes/extras/vae/)，首頁自己寫明課程「從最基本的地方開始，最後從第一原理解釋變分自編碼器」。VAE 那章把 EM、mean field、取樣三種課堂學過的做法逐一試過、逐一說明為什麼行不通，才引出 [Kingma 與 Welling 的 AEVB](https://arxiv.org/abs/1312.6114) 與重參數化技巧。這是這份講義最好的一段，因為它示範了整門課的方法論怎麼推導出一個現代結果。

**但要注意時間戳。** 這些現代化的段落最新引用停在 2023 年（ChatGPT、Child et al. 2021 的 Very Deep VAE），之後沒有再更新。所以講義回答的是「到 2023 年為止，現代生成模型怎麼放進圖模型框架」，不是 2026 年的版本。

## 作業長什麼樣

課程官網沒有公開作業內容（都在 Ed 上），但公開了完整的時程表，而時程表本身有資訊。五份作業，寫明「both written and programming parts」，每份都圍繞一個應用。搭配十週的講次表是這樣排的：

| 作業 | 開放區間 | 對應主題 |
|---|---|---|
| HW1 | 1/9 – 1/23 | 機率理論、貝氏網路 |
| HW2 | 1/24 – 2/2 | 無向模型、學習貝氏網路 |
| HW3 | 2/1 – 2/13 | 精確推論、訊息傳遞 |
| HW4 | 2/13 – 2/27 | MAP 推論、結構化預測、取樣 |
| HW5 | 2/27 – 3/12 | 參數學習、貝氏學習、結構學習 |

**HW2 是唯一的異數：只有九天，而其他四份都是十二天以上。** 它同時也是唯一一份「還沒截止、下一份就已經開放」的作業——時程表上 HW2 與 HW3 的區間直接疊在一起。課程網站沒有說明為什麼這樣排。

另一條可以直接讀的線索是加開的助教課。官網列了五場、全部在週五下午、寫明「optional but encouraged」，主題依序是 d-separation、變數消除、junction tree、Metropolis-Hastings 與 Gibbs 取樣、EM。五場全部落在第二到第七週，也就是表示與推論那一段。

規定也寫得很硬。遲交有六天額度、單份作業最多用兩天，超過之後每多一天扣 25%；官網還特地舉例算給你看：四天全押在同一份作業上，那份直接砍半。往年解答不准看，原文是「It is an honor code violation to intentionally refer to a previous year's solutions, either official or written up by another student」。評分是作業 70%、期末考 30%，另有最多 3% 加分——加分的兩種拿法之一是**對 GitHub 上的課程講義送 PR**。也就是說，你在網路上讀到的那份公開講義，有一部分是被課程用加分餵出來的。

期末考是一場三小時的考試。**沒有期末專案**——這跟同一位講師的 CS236 是相反的安排，那門課的課程專案占四成。

## 自學者實際拿得到什麼

逐項講，拿得到與拿不到分開：

- **講義**：拿得到。16 章全公開、MIT 授權、可以 fork。這是本篇的重點，也是這門課對自學者最大的價值。
- **教科書**：拿不到（免費的話）。指定書是 Koller 與 Friedman 的 *Probabilistic Graphical Models: Principles and Techniques*（MIT Press），要買。官網列的六本延伸閱讀裡，只有 [MacKay 的 *Information Theory, Inference, and Learning Algorithms*](http://www.inference.org.uk/mackay/itila/book.html) 是作者自己放的免費線上版。Bishop、Murphy、Darwiche 三本走 Stanford 圖書館入口，校外進不去。**而 Wainwright 與 Jordan 那份 *Graphical Models, Exponential Families, and Variational Inference* 的 PDF 連結現在回 404**——那是第九週指定要配著讀的材料。
- **講次投影片**：拿不到。官網的 syllabus 只有主題與課本章節，沒有掛任何 PDF。
- **錄影**：拿不到。官網的 Lecture Videos 指向 `canvas.stanford.edu` 的一個外部工具，要登入。
- **作業**：拿不到。全部在 Ed 上。公開的只有一份 [LaTeX 作答模板](https://cs.stanford.edu/~ermon/cs228/hwtemplate.tex)。
- **自動評分器**：拿不到，Gradescope 需要課程邀請。
- **往年課程網站**：拿不到。這門課的網站不在 `web.stanford.edu/class/archive/` 底下（那個路徑回 404），它是 GitHub Pages，所以只有一個版本——最新的那個。要看歷史只能翻 git commit 或 Wayback Machine。

所以自學路徑其實很清楚，也很受限：**你有一份完整的教材，但沒有作業、沒有錄影、沒有評分器。** 官網那句「能舒服地做完 HW1 就代表你的背景夠了」對校外的人是失效的，因為 HW1 你拿不到。

順帶一提，網路上關於這門課的二手介紹要小心。連 Ermon 自己的 [Stanford 首頁](https://cs.stanford.edu/~ermon/)也不準——那份教學列表最新只到 Winter 2022/2023，但 ExploreCourses 與課程官網都記錄了 Winter 2024 那次開課，講師是他本人。

## 跟 CS236 的關係：兩門課現在都停著

CS228 和 [CS236: Deep Generative Models](https://deepgenerativemodels.github.io/) 出自同一個人。很多人以為 CS228 是 CS236 的前置，這件事**在官方頁面上不成立**。CS236 的先修原文是「Basic knowledge about machine learning from at least one of CS 221, 228, 229 or 230」。CS228 只是四選一的其中一個，不是必經。

比較有訊息量的是兩門課現在的狀態。ExploreCourses 上 CS236 的狀態是 `Last offered: Autumn 2023`，它的課程官網標題也還寫著「CS236 - Fall 2023」——跟 CS228 官網凍結在 Winter 2023-24 是同一種樣子。兩門課現在都不在開課中，差別在於前者已經排進了下一個冬季，後者在最新學年的頁面上沒有排程。**沒有任何官方頁面說明原因**，這裡列的是兩張課表的狀態，不是解釋。

分工倒是清楚的：CS228 教怎麼用圖寫下獨立假設、怎麼在圖上做推論與學習，結束在 VAE；CS236 從 VAE 開始，往 GAN、normalizing flow、autoregressive、energy-based 與 score-based 展開。所以講義最後那章，剛好就是兩門課的接縫。另外一個實務差異：CS236 官網明寫歡迎校內旁聽（「we are very open to sitting-in guests if you are a member of the Stanford community」），CS228 官網沒有對應的說法。

## 怎麼開始

今晚就能做的一件事，用來判斷你到底進不進得去：

打開[貝氏網路那章](https://ermongroup.github.io/cs228-notes/representation/directed/)，讀到 d-separation 那一節，然後蓋住頁面，自己回答三個三變數結構的獨立性——`X → Z → Y`、`X ← Z → Y`、`X → Z ← Y`——在 Z 有沒有被觀測的兩種情況下，X 和 Y 各是獨立還是相依。

第三個（v-structure，講義叫 explaining away）跟前兩個是反過來的：**Z 沒被觀測時 X 與 Y 獨立，Z 被觀測之後反而相依。** 講義用草地來解釋——Z 是「早上草地是濕的」，X 是下過雨、Y 是灑水器開過；知道草是濕的、又知道灑水器沒開，那下過雨的機率就被推到 1。兩個原本無關的原因，因為共同結果被觀測而綁在一起。

如果你能自己把這件事講出來，這門課的整套推論演算法你都跟得上，因為 d-separation 是後面每一個演算法的地基。如果講不出來，就把那一章重讀一遍再往下——它是講義裡回報率最高的一節，也剛好是課程第一場加開助教課的主題。

## 附錄：數字與查證方式

- **學分與開課**：3–4 學分、只在冬季開。ExploreCourses 的 2026-2027 學年頁面顯示 CS 228 Class # 25130、Session 2026-2027 Winter 1、In Person，講師欄與上課時間空白（2026-08-21 讀數）。2024-2025 與 2025-2026 兩個學年頁面的狀態均為 `Last offered: Winter 2024`。
- **評分比重**：作業 70%（五份）、期末考 30%、額外加分最多 3%。加分的兩種拿法是在 Ed 上實質回答同學問題，或對課程講義送 GitHub PR。
- **遲交政策**：六天額度，單份作業最多兩天不罰，超出後每多一天罰 25%。這是遲交規定，不是重交規定——官網沒有任何重新提交的條款。
- **期末考時間**：Winter 2024 那次是 3 月 21 日 15:30–18:30，三小時。官網目前顯示的就是這一版。CS228 沒有期末專案；作為對照，CS236 官網的比重是三份作業各 15%、期中 15%、課程專案 40%。
- **講義 repo 數字**：2,009 顆星、476 個 fork、7 個開著的 PR（2026-08-21 由 GitHub API 讀取）。repo 建於 2017-01-10，最後一次推送 2025-06-24（PR #227，機率複習的錯字修正）。最舊的未合併 PR 開於 2020-03-16。
- **講義 under construction 標記**：索引頁標了四處（Probability Review、Real-World Applications、Bayesian learning 的 Examples、Structure learning 的 Bayesian structure learning）。四頁均已逐頁讀過，前三處內容存在且完整，第四處確實沒有對應章節。
- **死連結**（皆為 2026-08-21 實測）：結構學習章節的 K3 互動模擬 `pgmlearning.herokuapp.com/k3LearningApp` 回 HTTP 404；d-separation 與變數消除兩章的同系列連結已改指 Wayback 封存版，可開。課程官網延伸閱讀清單裡的 Wainwright & Jordan PDF `www.eecs.berkeley.edu/~wainwrig/Papers/WaiJor08_FTML.pdf` 回 HTTP 404，`people.eecs.berkeley.edu` 的常見替代路徑同樣 404，本篇未能找到該檔的官方有效鏡像。
- **課程官網位置**：`cs228.stanford.edu` 實際導向 `ermongroup.github.io/cs228`，頁首標示 Winter 2023-24。`web.stanford.edu/class/archive/cs/cs228/` 回 404，這門課沒有 Stanford 封存區的歷屆版本。

**未能確認的項目**：(1) CS228 為何連續兩個學年停開、CS236 為何自 Autumn 2023 後未再開課——所有官方頁面都沒有說明，本篇只列狀態；(2) Winter 2027 的授課者是誰，ExploreCourses 的講師欄目前空白；(3) 五份作業的實際題目與難度分布，作業內容鎖在 Ed 上，本篇對作業的描述全部來自公開的時程表與評分政策，不是作業本身。

## 參考資料

- [ExploreCourses：CS 228 條目（2026-2027 學年）](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog) — 先修原文、學分、Winter 2027 排課與空白講師欄
- [ExploreCourses：CS 228 條目（2025-2026 學年）](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog&academicYear=20252026) — `Last offered: Winter 2024`，同頁另有 CS 236 的 `Last offered: Autumn 2023` 與 MATH 151 的抵免規定
- [ExploreCourses：CS 228 條目（2023-2024 學年）](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog&academicYear=20232024) — Winter 2024 開課紀錄與 Ermon 掛名
- [ExploreCourses：CS 234 條目](https://explorecourses.stanford.edu/search?q=CS+234&view=catalog) — 用來對照先修門檻：CS234 要求 CS229 或同等程度
- [CS 228 課程官網](https://cs228.stanford.edu/) — 凍結於 Winter 2023-24：先修、評分、遲交、榮譽守則、十週講次表、五場助教課
- [cs228-notes 公開講義](https://ermongroup.github.io/cs228-notes/) — 16 章目錄、作者、under construction 聲明
- [cs228-notes GitHub repo](https://github.com/ermongroup/cs228-notes) — 星數、fork、未合併 PR、commit 歷史與 MIT 授權
- [講義：Introduction](https://ermongroup.github.io/cs228-notes/preliminaries/introduction/) — 垃圾郵件的指數參數量與 Naive Bayes 的簡化
- [講義：Real-World Applications](https://ermongroup.github.io/cs228-notes/preliminaries/applications/) — diffusion 與 Transformer 被放進圖模型框架的原文
- [講義：Bayesian networks](https://ermongroup.github.io/cs228-notes/representation/directed/) — d-separation 與 v-structure 的定義
- [講義：Structure learning](https://ermongroup.github.io/cs228-notes/learning/structure/) — 內容完整度與失效的 K3 模擬連結
- [講義：The variational autoencoder](https://ermongroup.github.io/cs228-notes/extras/vae/) — 課程收尾章節，從課堂方法推導到 AEVB
- [CS236: Deep Generative Models 課程官網](https://deepgenerativemodels.github.io/) — 凍結於 Fall 2023，先修原文與旁聽政策
- [Stefano Ermon 個人首頁](https://cs.stanford.edu/~ermon/) — 教學列表僅到 Winter 2022/2023，與課表不一致
- 站內：[Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 深度導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
