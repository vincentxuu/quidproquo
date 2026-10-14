---
title: "課程回顧與後續路線：七週教了什麼、沒教什麼、接著讀哪裡｜Harvard CS50 AI 主題單元"
date: 2026-08-30
category: tech
type: deep-dive
tags: [harvard-cs50ai, cs50, ai, wrapup, learning-path, python]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 10
tldr: "系列最後一篇：用一張表回顧七週各教了什麼、做了哪些專案；課程在 2023 年把第 6 週換成講到 attention 與 Transformer 的新版，其餘六週仍是 2020 年的錄影；講課沒有教怎麼使用今天的語言模型。後半依你想往哪裡走，連到站上九門後續課程的總覽。附三題回顧自我檢查。"
description: "Harvard CS50 AI 系列的回顧與後續路線：七週內容與十二個專案的一頁回顧（連到各週導讀）、第 6 週在 2023 年換了什麼、哪些今天常見的主題七支錄影都沒有講、免費自學路線有什麼與缺什麼，以及站上九門後續課程的總覽該從哪一門接。課程內容依本系列重寫後的各週導讀與課程官網；後續路線的選擇是本站的判斷。這一篇是本站的整理，不是課程某一週的講課。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-harvard-cs50ai-wrapup-en)

**影片狀態：僅附官方入口或錄影清單。** 這一篇是本站寫的課程回顧，不是課程某一週的講課，官方沒有對應的影片；各週的講課錄影與時間連結在各週導讀。[影片來源與說明](#課程影片來源)

> ⚠️ **版本提醒**：本系列的講課錄影，第 0–5 週片名標示 **2020**，第 6 週片名標示 **2023**；專案規格以 2026 年課程官網為準。

## TL;DR

CS50 AI 用四週教不靠資料學習的方法（搜尋、邏輯、機率、最佳化），再用三週教機器學習、神經網路與語言，十二個專案讓每個主題都親手寫過一次。七週裡只有第 6 週換過版本：2023 年的新版講到 attention 與 Transformer，專案從 Questions 換成 Attention。講課沒有教的是怎麼使用今天的語言模型。

這一篇分兩種內容。前四節講課程本身，依各週導讀與課程官網，每一項都附連結。第五節「接著讀什麼」是本站的判斷：站上有哪些後續課程的總覽、各自適合接在哪裡。

## 七週教了什麼

每一列的內容取自各週導讀；細節、例子與錄影的時間連結在連過去的那一篇。

| 週 | 講課教的 | 專案 |
|---|---|---|
| [第 0 週 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search) | 把問題寫成 state、action 與 goal；DFS、BFS、greedy best-first、A\*；有對手時用 Minimax 與 Alpha-Beta 剪枝 | [Degrees](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#專案-0adegrees--bfs-找演員六度人脈)、[Tic-Tac-Toe](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#專案-0btic-tac-toe--minimax-最佳策略) |
| [第 1 週 Knowledge](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge) | 命題邏輯；model checking 列舉所有真假組合；推論規則與 resolution；一階邏輯 | [Knights](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#專案-1aknights--邏輯謎題求解器)、[Minesweeper](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#專案-1bminesweeper--踩地雷-ai) |
| [第 2 週 Uncertainty](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty) | 條件機率與貝氏法則；貝氏網路；列舉推論與取樣；馬可夫鏈與隱藏式馬可夫模型 | [Heredity](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#專案-2aheredity--用貝氏網路推斷基因與性狀)、[PageRank](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#專案-2bpagerank--取樣與迭代兩種演算法) |
| [第 3 週 Optimization](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization) | Hill climbing 與模擬退火；線性規劃；約束滿足問題的 AC-3 與回溯搜尋 | [Crossword](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#專案-3crossword--csp-生成填字遊戲) |
| [第 4 週 Learning](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning) | 最近鄰、perceptron、support vector machine、迴歸；overfitting 的對策；Q-learning；k-means | [Shopping](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#專案-4ashopping--k-nn-預測購買意願)、[Nim](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#專案-4bnim--q-learning-學會玩遊戲) |
| [第 5 週 Neural Networks](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks) | Unit 與 activation function；梯度下降；隱藏層與 backpropagation；CNN；RNN | [Traffic](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#專案-5traffic--cnn-訓練分類交通號誌) |
| [第 6 週 Language](/posts/tech/2026-08-30-harvard-cs50ai-w06-language) | Context-free grammar；n-gram 與 Naive Bayes；word2vec；RNN 的 encoder–decoder；attention 與 Transformer | [Parser](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#專案-6aparser--用-cfg-剖析句子並抽出名詞片語)、[Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#專案-6battention--用-bert-預測被遮住的詞並畫出每個-attention-head) |

週與週之間怎麼銜接、哪些做法被後面的做法取代，整理在[跨週整理一](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1)；十二個專案的對照在[跨週整理二](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2)。

課程官網到 2026 年仍然拿第 0–5 週的 2020 年錄影當現行教材，Harvard Summer School 2026 年的學分班 CSCI S-80 用的也是 2020 年的錄影（見站上的 [Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map)）。

## 課程在 2023 年改了什麼

七週裡只有第 6 週換過版本，下面三點依[第 6 週導讀](/posts/tech/2026-08-30-harvard-cs50ai-w06-language)與課程官網：

- **講課**：官方筆記註明新版第 6 週講課於 2023-08-14 釋出。它講到 [attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#attention讓-decoder-自己決定看輸入的哪裡) 與 [Transformer](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#transformer-的-encoder平行處理positional-encoding-與-self-attention)，沒有教 TF-IDF。
- **專案**：2020 年版第 6 週的 Questions 專案（TF-IDF 問答）現行官網已經不列，換成 [Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#專案-6battention--用-bert-預測被遮住的詞並畫出每個-attention-head)：用預訓練的 BERT 預測被遮住的詞，並把每個 attention head 畫成圖。Parser 專案留著。
- **其餘六週**：講課錄影維持 2020 年版。專案的 distribution code 從 `2023/x` 的路徑下載，check50 的 slug 是 `ai50/projects/2024/x/...`，所以做專案時一律用官方規格頁給的下載網址與指令。

## 課程沒有教什麼

下面是本站拿今天常見的主題去對七支錄影的字幕，確認講者沒有講的項目。它說的是「這幾支錄影裡沒有」，不是對這些主題重不重要的評價。

- **怎麼使用語言模型**：prompt 的寫法、RAG、微調。課程官網的簡介提到 large language models，講課對應的內容是第 6 週的 Transformer 架構，停在架構。
- **第 2 週**：變數消去（variable elimination）這類比列舉快的精確推論方法。講者只提到列舉可以靠避免重複計算來加快，沒有講方法也沒有講名稱，接著就進到取樣。
- **第 4 週**：support vector machine 的 kernel。講者說 SVM 可以到更高的維度去找邊界，例如把線性不可分的資料用一個圓分開；kernel 這個詞與實際做法沒有出現。
- **第 5 週**：backpropagation 的微積分。講者明說不講，只給流程。
- **專案用到但講課沒教的**：PageRank 的迭代公式、Shopping 的 sensitivity 與 specificity、Attention 的 BERT，都寫在規格頁。

## 免費自學路線有什麼、缺什麼

**有的**（依課程官網與專案規格頁）：

1. **材料都公開**：每一週的講課頁有影片、音檔、投影片、筆記、講課原始碼、字幕、逐字稿與 quiz；專案有規格頁與 distribution code。
2. **自動評分**：`check50` 可以在自己的電腦跑；用 `submit50` 提交之後，規格頁寫的是五分鐘內評分完成，進度在 Gradebook 看。提交需要 edX 帳號與 GitHub 帳號。
3. **證書免費**：每個專案拿到 70% 以上，就能申請免費的 CS50 Certificate。Knights 是例外，規格寫明要 100% 正確才算通過。
4. **有地方問**：官網列了課程的社群，規格頁也寫可以在 Ed 上發問。

**缺的**（本系列實跑與核對時遇到的）：

1. **套件會更新，錄影與規格不會跟著改**：第 6 週的 Attention 專案照官方 `requirements.txt` 直接安裝，在 2026-10-13 跑不起來，[第 6 週導讀](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#專案-6battention--用-bert-預測被遮住的詞並畫出每個-attention-head)記錄了能跑的版本組合。規格頁註明這門課最高支援到 Python 3.12。
2. **錄影沒有介紹專案**：七支講課錄影都沒有提到該週的專案作業，專案要做什麼只能讀規格頁。
3. **數學只講到概念**：官方先修沒有列數學；機率在第 2 週從定義講起，第 5 週不講微積分。
4. **沒有語言模型的應用**：見上一節。

## 接著讀什麼

這一節是本站的建議，查核日期 2026-10-13：下面九篇的中英文檔案當天都確認存在，每一篇的描述對過該篇自己的摘要。它們都是站上已經寫好的課程總覽，每一門課教什麼、公開了哪些材料，依各篇自己的說明；「接在 CS50 AI 的哪裡」是本站依主題對應排的，不是這些課程官方的先修說明；各門課實際的先修要求請看各篇總覽。

**想把同樣的範圍再學一次、學得更深**

- [Berkeley CS188 課程總覽](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview)：同樣是人工智慧入門課，六個專案裡有四個用 Pacman 當情境。
- [Stanford CS221 課程總覽](/posts/ai/2026-08-21-stanford-cs221-ai-principles)：把 AI 排成反射、狀態、變數、邏輯四層，講義與八份作業公開。

**想補第 2、4、5 週背後的數學**

- [Stanford CS229 課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：把機器學習的數學推導走一遍，接第 4、5 週。
- [Stanford CS228 課程總覽](/posts/ai/2026-08-21-stanford-cs228-graphical-models)：機率圖模型，接第 2 週的貝氏網路與推論。

**想往強化學習走**

- [Stanford CS234 課程總覽](/posts/ai/2026-09-30-cs234-course-overview)：從有模型的 MDP 規劃講到策略梯度，接第 4 週的 Markov decision process 與 Q-learning。

**想往語言模型走**

- [Stanford CS224N 課程總覽](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)：從詞向量、反向傳播講到 Transformer，作業包含自己寫一個 decoder-only Transformer，接第 6 週。
- [Stanford CME295 課程總覽](/posts/ai/2026-09-29-cme295-course-overview)：九堂課從 Transformer 講到 agent，沒有作業。
- [Stanford CS336 課程總覽](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)：從零打造語言模型，五份作業沒有程式骨架，第二份起要自己準備算力。

**想聽中文授課**

- [台大李宏毅機器學習課程總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)：2026 春季版從 AI agent 講起，投影片、錄影與作業公開。

各校課程的公開程度與先修關係，整理在[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)。

## 回顧自我檢查

三題都是本站自擬的，答案都能在這一篇或連過去的文章裡找到。

**自我檢查｜先寫下答案，再展開。** 下面六項，哪些是 CS50 AI 的講課有教的？有教的在第幾週？A\* 搜尋、RAG、dropout、TF-IDF、k-means、prompt 的寫法。

<details>
<summary>答案</summary>

有教的三項：A\* 搜尋在第 0 週，k-means 在第 4 週，dropout 在第 5 週。

沒教的三項：RAG 與 prompt 的寫法，七支錄影都沒有講。TF-IDF 只在 2020 年版的第 6 週；現行的 2023 年版講課沒有教，對應的 Questions 專案也已經換成 Attention。

</details>

**自我檢查｜先寫下答案，再展開。** 有人十二個專案裡十一個都拿到 80%，只有 Knights 拿到 90%。依官方的說明，他能申請 CS50 Certificate 嗎？

<details>
<summary>答案</summary>

還不能。證書說明頁的條件是每個專案至少 70%，但 Knights 的規格頁另外寫明這一題要 100% 正確才算通過，是這門課「70% 算通過」的例外。他要把 Knights 改到全對。「Knights 沒過就不符合證書條件」是本站把這兩頁的說明合起來讀的結論。

</details>

**自我檢查｜先寫下答案，再展開。** 做第 3 週的 Crossword 之前，你從 `2020` 的路徑找到一份舊的 starter code。該用它嗎？為什麼？

<details>
<summary>答案</summary>

不該。現行專案的 distribution code 從 `2023/x` 的路徑下載，check50 用的是 `ai50/projects/2024/x/...` 的 slug，評分對的是現行規格。做法是每個專案都用官方規格頁上給的下載網址與 check50 指令，不要自己拿別的年份的檔案來拼。

</details>

## 系列連結

這個系列一共十一篇：課程總覽、七週導讀、兩篇跨週整理與本篇。講課由 Brian Yu 主講；課程官網的頁首並列他與 David J. Malan 兩個名字，edX 的課程頁把兩人都列為授課者（instructor）。材料與自動評分由 CS50 團隊公開並維護。

- [課程總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide)
- [第 0 週 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search)
- [第 1 週 Knowledge](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge)
- [第 2 週 Uncertainty](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty)
- [第 3 週 Optimization](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization)
- [第 4 週 Learning](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning)
- [第 5 週 Neural Networks](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks)
- [第 6 週 Language](/posts/tech/2026-08-30-harvard-cs50ai-w06-language)
- [跨週整理一：想法怎麼銜接與取代](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1)
- [跨週整理二：十二個專案各用到哪一段講課](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2)
- **課程回顧與後續路線（本文）**

## 課程影片來源

這一篇是本站寫的課程回顧，沒有對應的那一週，不嵌影片。文中談到某一週內容的地方都連到那一週的導讀，錄影的播放器與時間連結在那裡。官方 CS50 YouTube 播放清單（8 支：導論加第 0–6 週講課）已於 2026-10-10 即時核對，其中沒有課程回顧的影片。

課程與錄影入口：

- [CS50 AI — official course playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [CS50 AI — official course page](https://cs50.harvard.edu/ai/)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方播放清單，沒有對應本篇的單一講次錄影，狀態維持僅附官方入口。
- 2026-10-13：第 6 週的描述改為與現行課程一致：專案是 Parser 與 Attention，TF-IDF 與 Questions 專案只在 2020 年版；對照表的「CFG / CYK」改成「CFG」，課程沒有教 CYK。
- 2026-10-13：依重寫後的七週導讀與課程官網整篇重寫。「什麼是永恆的」一節原本列了許多講課沒有講的內容（D-separation、條件獨立、變分推論、鏈式法則與計算圖、各種 optimizer、平移不變性、消融實驗），改成一張依各週導讀寫的回顧表。「已被時代超越」的對照表整張拿掉，包含講 TF-IDF 的那一列：表裡對業界現況的說法都沒有附來源（例如「密集向量檢索完全取代稀疏向量」），現行課程也不教 TF-IDF。原本的後續路線圖、外部資源清單與「依目標建議」表拿掉，其中的工具名稱、週數與月數沒有依據；改成連到站上九門後續課程的總覽，並標明是本站的判斷。修正：錄影「錯過 Transformer」不對，第 6 週有講；證書條件補上 Knights 要 100% 的例外；「十篇系列文」更正為十一篇；拿掉「付費課程才有的體驗」「GitHub 上無數參考實作」與文末用引號包住的自創引言。新增三題回顧自我檢查。標題改為這篇實際的內容，範圍標示維持「主題單元」。用語：「Week N」改「第 N 週」，「優化」改「最佳化」，「播放列表」改「播放清單」。
- 2026-10-13：依獨立審稿修正：講課由 Brian Yu 主講（原寫兩人主講）；變數消去一項補上講者提過列舉可以避免重複計算；「接著讀什麼」的小標改為第 2、4、5 週；tags 拿掉 career 與 llm。
- 2026-10-14：依複審修正：授課者的說法改為依課程官網頁首與 edX 課程頁（官網頁首並列兩人的名字，edX 課程頁把兩人都列為授課者）。tags 再拿掉 retrospective。

## 參考資料

- [CS50 AI 課程官網](https://cs50.harvard.edu/ai/) — 課程簡介、修課方式、社群
- [Week 0 Search 講課頁](https://cs50.harvard.edu/ai/weeks/0/) — 每週講課頁提供的材料種類
- [Week 6 Language 講課頁](https://cs50.harvard.edu/ai/weeks/6/) — 現行第 6 週的講課與專案
- [CS50 Certificate 說明](https://cs50.harvard.edu/ai/certificate/) — 免費證書條件
- [Knights 專案規格](https://cs50.harvard.edu/ai/projects/1/knights/) — 100% 才算通過的例外、五分鐘內評分、在 Ed 發問
- [CS50 AI YouTube 播放清單](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義
- 站內：[Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map) — CSCI S-80 版本對照
