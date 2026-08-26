---
title: "Harvard CS50 AI 導讀：七週主題、十二個 projects 與一門 2020 年錄影的課怎麼跟"
date: 2026-08-26
category: ai
type: guide
tags: [cs50, harvard, ai-course, python, learning-path]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 0
tldr: "CS50 AI 的 OpenCourseWare 版公開七週影片、投影片、notes 與十二個 Python projects，校外自學者可以拿到 autograder 回饋和每個 project 都達 70% 以上的免費 CS50 Certificate；但前六週錄影沿用 2020 年 Spring 版，只有 Week 6 Language 換成 2023 年重錄版。"
description: "導讀 Harvard CS50's Introduction to Artificial Intelligence with Python：七週涵蓋什麼、十二個 projects 各做什麼、免費 OCW 路線與 edX 證書路線差在哪，以及 2020 年錄影在 2026 年還值不值得跟。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en)

搜「免費 AI 課程」，[Harvard CS50's Introduction to Artificial Intelligence with Python](https://cs50.harvard.edu/ai/)（以下簡稱 CS50 AI）幾乎一定排在前幾名。它由 [Brian Yu](https://brianyu.me) 和 [David J. Malan](https://cs.harvard.edu/malan/) 主講，透過 OpenCourseWare 完全免費公開：七週影片、逐講 notes、投影片、原始碼、quiz，加上十二個有 autograder 回饋的 Python projects。按照本站在[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)定的分級，它是 **A3——足以自學**：錄影、教材、projects、回饋系統全部對校外開放，一個人從零走到拿證書，中間不需要任何校內身分。

但「材料全開」不等於「材料是最新的」。打開任何一講的下載連結，你會發現路徑寫著 `cdn.cs50.net/ai/2020/spring/`——影片是 2020 年春天錄的。這篇要回答的問題因此有兩個層：這七週和十二個 projects 到底在做什麼；以及一份 2020 年的錄影，放在 2026 年還值不值得跟。

## 先判斷它是不是你要的課

官方頁面把先修條件寫得很清楚：修過 [CS50x](https://cs50.harvard.edu/x)，或至少一年 Python 經驗。沒有要求線性代數或機率——需要機率的地方，課程會在第二週自己教。

它的定位是「用 Python 把古典 AI 到現代 AI 的全景走一遍」，不是理論課也不是框架培訓班。每一週的節奏固定：看講課、做 projects、交給 autograder。官方對 workflow 的描述就是兩步——Watch Lecture，Submit Project。如果你想要的是嚴格數學推導，它不是那門課；如果你想要的是六個月內能動手寫出搜尋引擎、西洋棋 AI、貝氏網路和神經網路的入門路徑，它大概是免費選項裡結構最完整的。

## 七週在教什麼

七個主題是一條刻意設計的線，從「怎麼搜尋」一路走到「語言模型」：

| 週 | 主題 | 涵蓋內容 |
|---|---|---|
| [Week 0](https://cs50.harvard.edu/ai/weeks/0/) | Search | DFS、BFS、A\*、Minimax、Alpha-Beta 剪枝 |
| [Week 1](https://cs50.harvard.edu/ai/weeks/1/) | Knowledge | 命題邏輯、model checking、resolution |
| [Week 2](https://cs50.harvard.edu/ai/weeks/2/) | Uncertainty | 機率、Bayes 法則、貝氏網路、馬可夫模型 |
| [Week 3](https://cs50.harvard.edu/ai/weeks/3/) | Optimization | 局部搜尋、模擬退火、約束滿足問題 |
| [Week 4](https://cs50.harvard.edu/ai/weeks/4/) | Learning | 監督式學習、SVM、強化學習、Q-learning、k-means |
| [Week 5](https://cs50.harvard.edu/ai/weeks/5/) | Neural Networks | 反向傳播、TensorFlow、CNN、RNN |
| [Week 6](https://cs50.harvard.edu/ai/weeks/6/) | Language | n-grams、Naive Bayes、word2vec、attention、transformers |

前半段（Search 到 Optimization）是古典 AI：符號、邏輯、機率、搜尋。後半段（Learning 到 Language）才進入機器學習。很多免費課直接跳到神經網路，CS50 AI 反過來先花三週建立「AI 不等於深度學習」的全景——這是它在 2026 年仍然值得跟的最大理由之一。

## 十二個 projects 在做什麼

每個 project 都是從零寫一個完整程式，官方提供 distribution code 和規格，寫完用 [`check50`](https://cs50.readthedocs.io/projects/check50/en/latest/index.html) 驗證正確性、[`submit50`](https://cs50.readthedocs.io/submit50/) 提交：

| 週 | Projects | 你要做的事 |
|---|---|---|
| [Project 0](https://cs50.harvard.edu/ai/projects/0/) | [Degrees](https://cs50.harvard.edu/ai/projects/0/degrees/)、[Tic-Tac-Toe](https://cs50.harvard.edu/ai/projects/0/tictactoe/) | BFS 算演員間隔幾層關係；Minimax 下井字棋 |
| [Project 1](https://cs50.harvard.edu/ai/projects/1/) | [Knights](https://cs50.harvard.edu/ai/projects/1/knights/)、[Minesweeper](https://cs50.harvard.edu/ai/projects/1/minesweeper/) | 用命題邏輯解騎士與騙子謎題；知識表示掃雷 |
| [Project 2](https://cs50.harvard.edu/ai/projects/2/) | [PageRank](https://cs50.harvard.edu/ai/projects/2/pagerank/)、[Heredity](https://cs50.harvard.edu/ai/projects/2/heredity/) | 取樣與迭代算網頁排名；貝氏網路推斷基因型 |
| [Project 3](https://cs50.harvard.edu/ai/projects/3/) | [Crossword](https://cs50.harvard.edu/ai/projects/3/crossword/) | 用 backtracking 和 constraint satisfaction 生產填字遊戲 |
| [Project 4](https://cs50.harvard.edu/ai/projects/4/) | [Shopping](https://cs50.harvard.edu/ai/projects/4/shopping/)、[Nim](https://cs50.harvard.edu/ai/projects/4/nim/) | k 近鄰預測購買意願；Q-learning 學會玩 Nim |
| [Project 5](https://cs50.harvard.edu/ai/projects/5/) | [Traffic](https://cs50.harvard.edu/ai/projects/5/traffic/) | TensorFlow 訓練 CNN 辨識交通號誌 |
| [Project 6](https://cs50.harvard.edu/ai/projects/6/) | [Parser](https://cs50.harvard.edu/ai/projects/6/parser/)、[Attention](https://cs50.harvard.edu/ai/projects/6/attention/) | CFG 解析句子；實作 self-attention |

這份清單的價值在於覆蓋面：邏輯 puzzle、機率推斷、組合最佳化、監督式學習、強化學習、電腦視覺、NLP 各一個起碼的代表作。做完十二個，你不是「聽懂」了這些詞，而是每個都親手寫過一次。

## 三條官方路線差在哪

官網明確列出四種修課方式，校外自學者真正會考慮的是前三種：

**1. 免費 OCW 路線（本篇主軸）**

直接跟 [OpenCourseWare](https://cs50.harvard.edu/ai/) 走，不花一毛錢。要拿 autograder 回饋，需註冊一個 edX 帳號並透過 GitHub 授權加入課程；提交後成績在五分鐘內出來，進度記錄在 [Gradebook](https://cs50.me/cs50ai)。每個 project 都拿到 70% 以上，就能申請免費的 [CS50 Certificate](https://cs50.harvard.edu/ai/certificate/)。

**2. edX 證書路線**

想要 edX 的 verified certificate 就改註冊 [edX 版本](https://cs50.edx.org/ai)；想湊 professional certificate 則是另一個入口。差別只在證書的身分驗證與費用，教材本身同一套。

**3. 學分路線**

想拿正式學分，走 [Harvard Extension School](https://web.dce.harvard.edu/extension/csci/e/80) 或 Summer School 的對應班次。[站上的 Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map)查核過 Summer 2026 班次：它是新的正式班級，底層仍使用 2020 年錄影與指定作業快照，且 Gradescope、section、office hours 只屬於修課學生。純自學不需要考慮這條。

順帶一提，課程授權允許老師直接採用或改編教材開自己的課——這也是為什麼全球大量高中與入門營隊拿它當骨架。

## 核心張力：材料全開，影像卻停在 2020

這是全文最重要的部分，也最容易被忽略。

打開 Week 0 到 Week 5 任一講的資產清單，影片、音檔、投影片、transcript 的 URL 全部指向 `cdn.cs50.net/ai/2020/spring/`。換句話說，**前六週的畫面是 2020 年春天錄的**。

唯一的例外是 Week 6 Language：它的資產路徑是 `cdn.cs50.net/ai/2023/x/`，是 2023 年重錄的版本。所以 attention、transformers 這些 LLM 時代的概念確實在課裡，但只佔最後一週。

作業端同樣跨年份。以 [Degrees](https://cs50.harvard.edu/ai/projects/0/degrees/) 為例：distribution code 從 `2023/x` 的路徑下載，`check50` 和 `submit50` 卻跑 `ai50/projects/2024/x/degrees` 這個 slug。

概念上它是同一題，執行版本卻橫跨好幾年。官方也在規格頁標明課程最高支援到 Python 3.12。

正確的理解方式是把「課程版本」拆成四件事：**正式班次、講課資產、作業資產、回饋系統**。OCW 的正式頁面掛著當期年份，講課是 2020 年的，作業混用 2023／2024 的 distribution，autograder 則持續維運到今天。四者不同步，不代表課壞了，代表你應該照 OCW 自己的 download 和 `check50` 路徑走，不要自己拼裝別的版本。

## 2020 年的錄影，2026 年還值不值得跟

我的判斷是：值得，理由有三個，各自可驗證。

第一，這門課教的東西變化很慢。DFS、A\*、Minimax、貝氏網路、Q-learning、backpropagation 都是幾十年不變的核心演算法。2020 年的錄影在這些主題上不存在「過時」問題——今天的教科書教的還是同一套。

第二，真正快速變化的部分，課程已經處理了一半。Week 6 用 2023 年重錄版補上 attention 和 transformers，讓課程至少摸得到 LLM 概念的邊。缺的是 prompt engineering、RAG、agent 這類應用層——但那些本來就不是這門課宣稱要教的。

第三，替代品未必更好。市面上大量「2026 最新 AI 課」更新的是工具名稱，不是基礎原理；而這門課的十二個 projects 加 autograder 回饋，仍然是免費課裡少見的完整閉環。

做法建議很具體：跟 OCW 版就整條跟到底，project 一律用官方頁面給的 download URL 和 `check50` 指令，不要混用其他年份的 starter code。想補 LLM 應用層，另外找資源，不要期待這門課替你覆蓋。

## 最小開始方式

今晚就可以做的三步：

1. 打開 [Degrees 的 spec](https://cs50.harvard.edu/ai/projects/0/degrees/)，下載 distribution code，讀完 Understanding 段落。
2. 寫出 `shortest_path`——提示已經寫在 spec 裡：用 breadth-first search。卡住就回去看 [Week 0](https://cs50.harvard.edu/ai/weeks/0/) 講課。
3. 跑 `check50 ai50/projects/2024/x/degrees`，全綠就走提交流程，確認你的 edX 帳號和 Gradebook 有記錄。

如果第一步到第三步你在三天內走完，這門課適合你繼續；如果光是讀 spec 就卡住，先去補 [CS50x](https://cs50.harvard.edu/x) 或一年的 Python，再回來。

## 更新紀錄

- 2026-08-26：初版。錄影與作業版本狀態以 2026 年 8 月 26 日官網查核為準。

## 參考資料

- [CS50's Introduction to Artificial Intelligence with Python — OpenCourseWare 主站](https://cs50.harvard.edu/ai/)
- [Week 0 Search](https://cs50.harvard.edu/ai/weeks/0/) — 錄影資產指向 `cdn.cs50.net/ai/2020/spring/` 的證據
- [Week 6 Language](https://cs50.harvard.edu/ai/weeks/6/) — 錄影資產指向 `cdn.cs50.net/ai/2023/x/` 的證據
- [Projects 總覽](https://cs50.harvard.edu/ai/projects/)
- [Degrees project spec](https://cs50.harvard.edu/ai/projects/0/degrees/) — `2023/x` distribution、`ai50/projects/2024/x/degrees` slug、Python 3.12 上限
- [CS50 Certificate 說明頁](https://cs50.harvard.edu/ai/certificate/) — 每 project 70% 以上換免費證書
- [edX 修課入口（verified certificate）](https://cs50.edx.org/ai)
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- [Gradebook](https://cs50.me/cs50ai)
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A0–A3 分級定義
- 站內：[Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map) — CSCI S-80 Summer 2026 與 OCW 的版本對照
