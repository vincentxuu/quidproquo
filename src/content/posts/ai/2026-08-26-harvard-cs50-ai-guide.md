---
title: "人工智慧入門：七週從搜尋、邏輯、機率走到神經網路與語言｜Harvard CS50 AI 課程總覽"
date: 2026-08-26
category: ai
type: guide
tags: [cs50, harvard, ai-course, python, learning-path]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 0
tldr: "CS50 AI 用七週、十二個 Python 專案走過人工智慧的入門內容：搜尋、邏輯推論、機率、最佳化、機器學習、神經網路與語言。前四週的方法靠人把問題寫清楚，後三週讓電腦從資料裡學。講課、筆記、專案與自動評分都對校外免費開放。這篇是本系列的入口：七週各教什麼機制、一個可以跟著算的例子、先備檢查與閱讀路線。"
description: "Harvard CS50's Introduction to Artificial Intelligence with Python 的課程總覽：這門課的主線、七週各自的機制（每週連到導讀）、一個算到底的 Q-learning 例子、十二個專案各要寫什麼、三題附判準的先備檢查，以及怎麼修、從哪裡開始。文首附官方 1 分 53 秒的課程導論短片。第 0–5 週的講課是 2020 年的錄影，第 6 週是 2023 年的新版；專案規格以現行課程官網為準。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en)

**影片狀態：已附影片。** 片長 1:53，是官方播放清單的第 1 支：課程的導論短片，預告七週的主題。它不是任何一週的講課，沒有字幕軌，本文依機器轉錄的逐字稿轉述；七週的講課錄影各自嵌在各週導讀，每一節附時間連結。[影片來源與說明](#課程影片來源)

[Harvard CS50's Introduction to Artificial Intelligence with Python](https://cs50.harvard.edu/ai/)（以下簡稱 CS50 AI）是一門用 Python 教人工智慧入門的課，講課由 [Brian Yu](https://brianyu.me) 主講；課程官網的頁首並列他與 [David J. Malan](https://cs.harvard.edu/malan/) 兩個名字，[edX 的課程頁](https://cs50.edx.org/ai)把兩人都列為授課者（instructor）。每一週看一支講課錄影，做一到兩個專案，七週共十二個。課程透過 OpenCourseWare 免費公開，按照本站在[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)定的分級是 **A3（足以自學）**：教材、專案與自動評分都對校外開放。

本系列替七週各寫了一篇導讀，這篇是入口。下面這支是官方的課程導論，不到兩分鐘，先看它或先讀下一節都可以。

```youtube
url: https://www.youtube.com/watch?v=gR8QvFmNuLE
title: Introduction - CS50's Introduction to Artificial Intelligence with Python 2020
```

## 這門課的主線

導論短片把整門課講成一條線，下面依影片的順序轉述（依據是機器轉錄的逐字稿，見文末說明）：

1. AI 怎麼替問題**搜尋**解答，例子是學會玩一個遊戲，或找出開車到目的地的路線。
2. AI 怎麼**表示資訊**，包含它確定的知識，以及它沒有把握的資訊與事件；更重要的是怎麼用這些資訊**推論**出新的結論。
3. AI 怎麼解各種**最佳化**問題：把利潤拉到最高、把成本壓到最低，或滿足某些限制。
4. **機器學習**：不告訴 AI 怎麼解問題，改成給它資料與經驗，讓它自己學會。
5. 其中特別講**神經網路**，影片說它是現代機器學習最受歡迎的工具之一。
6. 最後是**自然語言處理**，讓 AI 理解人的語言。

影片另外說了兩件事：這門課接在 CS50 之後；一路上你會自己寫 AI 程式把這些想法做出來。

影片沒有說每一項在第幾週，下面的對應是本文依課程官網的週頁排的：第 2 項拆成兩週，確定的知識是第 1 週、沒有把握的資訊是第 2 週，其餘各一週。本站的讀法是把七週分成兩半，這是本站的歸納，影片沒有這樣分：前四週（搜尋、知識、不確定性、最佳化）的方法靠人把問題寫清楚、交給演算法去找答案；後三週（學習、神經網路、語言）改成給電腦資料，讓它自己找規律。神經網路要到第 5 週才出現。

## 七週各教什麼

每一列用一兩句講那一週的機制，取自各週導讀；點週次到官方的講課頁，點「導讀」到本系列那一週的文章。第 0–5 週的講課是 2020 年的錄影，第 6 週是 2023 年的新版，這不影響下表的內容，但會影響專案怎麼做，見「十二個專案在做什麼」。

| 週 | 主題 | 這一週的機制 |
|---|---|---|
| [第 0 週](https://cs50.harvard.edu/ai/weeks/0/) | Search | 把問題寫成 state、action 與 goal，用 frontier 逐一展開節點。DFS 與 BFS 只差在 frontier 用 stack 還是 queue；A\* 把已走步數加上啟發式的估計；有對手時用 Minimax，雙方輪流取最大與最小值。[導讀](/posts/tech/2026-08-27-harvard-cs50ai-w00-search) |
| [第 1 週](https://cs50.harvard.edu/ai/weeks/1/) | Knowledge | 用命題符號與連結詞把知識寫成句子。Model checking 列出全部真假組合，檢查已知的句子是否蘊涵某個查詢；組合太多時，改用推論規則與 resolution 直接從句子推出新句子。[導讀](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge) |
| [第 2 週](https://cs50.harvard.edu/ai/weeks/2/) | Uncertainty | 條件機率與貝氏法則把證據換算成機率。貝氏網路用箭頭把聯合機率拆成每個節點的條件機率表，推論可以列舉（精確但慢）或取樣（近似）；馬可夫鏈描述隨時間變化的狀態。[導讀](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty) |
| [第 3 週](https://cs50.harvard.edu/ai/weeks/3/) | Optimization | 局部搜尋只記一個 state，hill climbing 往更好的鄰居走，模擬退火以一定機率接受變差的一步；線性規劃把問題寫成線性的成本函數加限制式；約束滿足問題先用 arc consistency 縮小每個變數的 domain，再用回溯搜尋找解。[導讀](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization) |
| [第 4 週](https://cs50.harvard.edu/ai/weeks/4/) | Learning | 監督式學習從有標籤的資料學出函數：k-NN 看最近的鄰居，perceptron 與 support vector machine 用權重畫出決策邊界。強化學習的 Q-learning 依 reward 更新每個 state 與 action 的估計值。非監督式學習以 k-means 分群。[導讀](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning) |
| [第 5 週](https://cs50.harvard.edu/ai/weeks/5/) | Neural Networks | 一個 unit 把輸入乘上權重、加 bias、再過 activation function；梯度下降一小步一小步調權重，隱藏層靠 backpropagation 把誤差往回分。影像先做卷積與 pooling 再接一般的網路（CNN），序列資料用 RNN。[導讀](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks) |
| [第 6 週](https://cs50.harvard.edu/ai/weeks/6/) | Language | 先用 context-free grammar 手寫規則剖析句子，再改用統計（n-gram、Naive Bayes）；用 word2vec 把詞變成向量，用 RNN 的 encoder–decoder 處理整個序列；最後是 attention 與 Transformer。[導讀](/posts/tech/2026-08-30-harvard-cs50ai-w06-language) |

週與週不是各自獨立的。第 2 週的馬可夫鏈在第 4 週變成 Markov decision process，第 4 週「輸入乘權重」的分類器在第 5 週變成一個 unit，第 5 週的 RNN 在第 6 週用來處理句子。這些銜接整理在[跨週整理一](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1)。

## 跟著算一次：Q-learning 的一步更新

各週導讀的每一節都帶一個算得完的小例子。下面這個取自[第 4 週導讀「讓 AI 自己學會玩 Nim」一節](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#讓-ai-自己學會玩-nim以及-function-approximation)的自我檢查，情境是該篇自擬的，不是講課內容；更新式是講課教的（[Q-learning 與 ε-greedy](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#q-learning-與-ε-greedy)）。

**條件。** Nim 這個遊戲有幾堆東西，雙方輪流從某一堆拿走至少一個，拿走最後一個的人輸。現在只剩一堆、裡面有 2 個，輪到你。你有兩個動作：

- 拿 1 個：剩 1 個，對手被迫拿最後一個，你贏。
- 拿 2 個：你自己拿了最後一個，你輸。

**機制。** Q-learning 替每一組「state 與 action」記一個估計值 Q，一開始都是 0。AI 每試一次，就照下面的式子修正：

```text
新的 Q = 舊的 Q + α ×（這一步的 reward + 未來最好的估計 − 舊的 Q）
```

Nim 專案裡 `α` 預設是 0.5。讓自己輸掉的一步 reward 是 −1，而且遊戲結束了，沒有未來的 reward。

**計算。** 「拿 2 個」這個動作：

- 第一次被更新：0 + 0.5 × (−1 − 0) = −0.5
- 第二次被更新：−0.5 + 0.5 × (−1 − (−0.5)) = −0.75

每次都往 −1 靠近一半。「拿 1 個」會讓對手輸，同樣的算式會讓它的 Q 值一步步靠近 1。

**結果的意思。** 試的次數夠多之後，AI 在這個 state 會選 Q 值比較高的「拿 1 個」。沒有人告訴它哪一步好，它是從輸贏的 reward 裡自己學到的；第 4 週的 Nim 專案就是讓 AI 這樣和自己下 10,000 局。導論短片講機器學習時說的也是這件事：不告訴 AI 怎麼解，給它經驗讓它自己學。

**自我檢查｜先寫下答案，再展開。** 「拿 2 個」第三次被更新之後，Q 值是多少？

<details>
<summary>答案</summary>

−0.75 + 0.5 × (−1 − (−0.75)) = −0.75 + 0.5 × (−0.25) = −0.875。和 −1 的差距從 0.25 縮成 0.125，還是每次減半。

</details>

## 十二個專案在做什麼

每個專案官方都給 distribution code 和規格，你補上規格指定的函式，不是從空白檔案寫起。講課錄影沒有介紹專案，專案要做什麼只寫在規格頁；本系列各週導讀的後半是專案的規格說明、官方檔案與參考實作。

| 週 | 專案 | 你要做的事 |
|---|---|---|
| [Project 0](https://cs50.harvard.edu/ai/projects/0/) | [Degrees](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#專案-0adegrees--bfs-找演員六度人脈)、[Tic-Tac-Toe](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#專案-0btic-tac-toe--minimax-最佳策略) | 用 BFS 找兩位演員之間最短的合作路徑；用 Minimax 寫井字遊戲 AI |
| [Project 1](https://cs50.harvard.edu/ai/projects/1/) | [Knights](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#專案-1aknights--邏輯謎題求解器)、[Minesweeper](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#專案-1bminesweeper--踩地雷-ai) | 把騎士與騙子謎題寫成命題邏輯，交給 model checking 推理；用「一組格子加地雷數」的句子做推論，寫踩地雷 AI |
| [Project 2](https://cs50.harvard.edu/ai/projects/2/) | [Heredity](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#專案-2aheredity--用貝氏網路推斷基因與性狀)、[PageRank](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#專案-2bpagerank--取樣與迭代兩種演算法) | 在貝氏網路上算聯合機率，推斷家族成員的基因份數與性狀；用取樣與迭代公式兩種方法算網頁排名 |
| [Project 3](https://cs50.harvard.edu/ai/projects/3/) | [Crossword](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#專案-3crossword--csp-生成填字遊戲) | 把填字遊戲寫成約束滿足問題，用 AC-3 與回溯搜尋產生填法 |
| [Project 4](https://cs50.harvard.edu/ai/projects/4/) | [Shopping](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#專案-4ashopping--k-nn-預測購買意願)、[Nim](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#專案-4bnim--q-learning-學會玩遊戲) | 用最近鄰分類器預測購買意願，回報 sensitivity 與 specificity；用 Q-learning 讓 AI 靠自我對弈學會玩 Nim |
| [Project 5](https://cs50.harvard.edu/ai/projects/5/) | [Traffic](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#專案-5traffic--cnn-訓練分類交通號誌) | 用 TensorFlow 訓練神經網路辨識 43 種交通號誌，並寫 README 記錄試過的架構 |
| [Project 6](https://cs50.harvard.edu/ai/projects/6/) | [Parser](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#專案-6aparser--用-cfg-剖析句子並抽出名詞片語)、[Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#專案-6battention--用-bert-預測被遮住的詞並畫出每個-attention-head) | 寫 CFG 文法剖析句子並抽出名詞片語；用 BERT 預測被遮住的詞並畫出 attention |

表裡的專案名稱連到本系列導讀的專案節，「Project N」連到官方頁面。十二個專案放在一起的對照在[跨週整理二](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2)。

做專案時有三件事和錄影的年份有關：

- **用現行官網的檔案。** 錄影是 2020 年的，專案不是。以 Degrees 為例，distribution code 從 `2023/x` 的路徑下載，`check50` 用的是 `ai50/projects/2024/x/degrees` 這個 slug。每個專案都用官方規格頁給的下載網址與指令，不要拿別的年份的 starter code 來拼。規格頁註明這門課最高支援到 Python 3.12。
- **第 6 週的專案是 Parser 與 Attention。** 2020 年版的 Questions 專案（TF-IDF 問答）現行官網已經不列，但 2020 年版的規格頁仍然連得到，不要照著做。
- **自動評分要帳號。** [`check50`](https://cs50.readthedocs.io/projects/check50/en/latest/index.html) 與 [`submit50`](https://cs50.readthedocs.io/submit50/) 的提交流程要用 GitHub 帳號登入，官網另外要你先註冊 edX 帳號。沒有帳號也能照規格頁的例子自己對答案，各週導讀列了每個專案可以對的例子。

## 先備與自我檢查

官方頁面寫的先修條件是：修過 [CS50x](https://cs50.harvard.edu/x)，或至少一年 Python 經驗。沒有要求線性代數或機率：機率在第 2 週從定義講起，第 5 週的梯度下降講者明說不講微積分的細節。

下面三題是本站出的，用來判斷現在開始會不會太早。前兩題的程式片段取自這門課的官方檔案與本系列的參考實作。

**自我檢查｜先寫下答案，再展開。** `pages = ["a", "b", "c", "d"]` 時，`{page: 1 / len(pages) for page in pages}` 的值是什麼？

<details>
<summary>答案與判準</summary>

一個字典，四個鍵各對應 0.25：`{"a": 0.25, "b": 0.25, "c": 0.25, "d": 0.25}`。

判準：不用執行就說得出來，Python 的程度夠開始。第 2 週導讀的 PageRank 參考實作裡有幾乎一樣的一行。看不懂字典推導式的話，專案的 distribution code 會讀得很吃力，先補 Python。

</details>

**自我檢查｜先寫下答案，再展開。** 官方的 `util.py` 裡有 `class QueueFrontier(StackFrontier):`，類別裡只定義了一個 `remove` 方法。`QueueFrontier` 的 `add` 方法從哪裡來？

<details>
<summary>答案與判準</summary>

從 `StackFrontier` 繼承來的。`QueueFrontier` 只改寫了 `remove`（改成取出最早放進去的那一個），其餘方法沿用父類別的。

判準：說得出「繼承」與「改寫一個方法」就夠。這正是第 0 週的重點：DFS 與 BFS 的程式只差在 `remove` 取哪一個。

</details>

**自我檢查｜先寫下答案，再展開。** 擲兩顆骰子，點數和是 12 的機率是多少？

<details>
<summary>答案與判準</summary>

1/36。兩顆骰子有 6 × 6 = 36 種同樣可能的結果，和是 12 的只有 (6, 6) 一種。

判準：這一題答不出來沒有關係。第 2 週的講課就是從兩顆骰子的點數和教起，不需要先學過機率。

</details>

## 怎麼修、從哪裡開始

**三條路線。** 官網列了五個入口，可以歸成三條：

1. **免費的 OpenCourseWare**（本系列走的路線）：直接跟[課程官網](https://cs50.harvard.edu/ai/)走。規格頁寫提交後五分鐘內評分完成，進度記錄在 [Gradebook](https://cs50.me/cs50ai)。每個專案都拿到 70% 以上，就能申請免費的 [CS50 Certificate](https://cs50.harvard.edu/ai/certificate/)；Knights 是例外，它的規格頁寫明要 100% 正確才算通過。
2. **edX 證書**：想要 edX 的 verified certificate，改從 [edX 版本](https://cs50.edx.org/ai)註冊；professional certificate 是另一個入口。費用與身分驗證的細節要看 edX 的頁面。
3. **學分**：走 [Harvard Extension School](https://web.dce.harvard.edu/extension/csci/e/80) 或 Harvard Summer School 的對應班次。[站上的 Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map)查核過 Summer 2026 班次：它用的仍是 2020 年錄影，Gradescope、section、office hours 只屬於修課學生。

**閱讀路線。** 照第 0 週到第 6 週的順序讀。每篇導讀的前半跟著講課錄影走，每一節附時間連結與一題自我檢查；後半是該週的專案。七週讀完後，[跨週整理一](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1)整理週與週的關係，[跨週整理二](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2)比較十二個專案，[課程回顧與後續路線](/posts/tech/2026-08-30-harvard-cs50ai-wrapup)談課程沒教什麼、接著讀哪裡。

**今晚就可以做的三步：**

1. 打開 [Degrees 的規格頁](https://cs50.harvard.edu/ai/projects/0/degrees/)，下載 distribution code，讀完 Understanding 段落。
2. 寫出 `shortest_path`。做法規格頁的 Background 段落已經講了：用 breadth-first search。卡住就讀第 0 週導讀的[節點、frontier 與通用搜尋流程](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#節點frontier-與通用搜尋流程)與 [DFS 與 BFS](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#dfs-與-bfs差別只在從-frontier-拿哪一個) 兩節，那裡有錄影的時間連結。
3. 執行 `python degrees.py large`，輸入 Emma Watson 與 Jennifer Lawrence，規格頁的範例輸出是 3 度。有帳號的話再跑 `check50 ai50/projects/2024/x/degrees`。

這三步走得完，其餘十一個專案是同樣的流程。光是讀規格就卡住的話，先去補 [CS50x](https://cs50.harvard.edu/x) 或一年的 Python，再回來。

## 課程影片來源

文首嵌入的是官方 CS50 YouTube 播放清單（CS50's Introduction to Artificial Intelligence with Python，8 支）的第 1 支，清單已於 2026-10-10 即時核對；這支影片的片名、片長、上傳日期與能否嵌入於 2026-10-13 用 yt-dlp 再查過一次。

原始影片：[Introduction - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=gR8QvFmNuLE)（片長 1:53，上傳日期 2023-07-24）

課程與錄影入口：

- [CS50 AI — official course playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [CS50 AI — official course page](https://cs50.harvard.edu/ai/)

查核日期：2026-10-10（播放清單）、2026-10-13（導論短片）。

底本說明：這支導論短片沒有字幕軌（2026-10-13 用 yt-dlp 查過）。「這門課的主線」一節依的是機器轉錄的逐字稿（Whisper large-v3-turbo，未經人工校對），整支 1 分 53 秒都讀過；本文只轉述影片依序預告的主題，沒有引用原話，也沒有放時間連結。影片沒有說每個主題在第幾週，週次的對應是本文依課程官網的週頁排的。七週講課的內容不是依這支影片寫的，各自依各週導讀。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方播放清單，沒有對應本篇的單一講次錄影，狀態維持僅附官方入口。
- 2026-10-13：Project 6 的說明修正：Attention 專案是用 BERT 預測被遮住的詞並畫出 attention 圖，不是實作 self-attention。
- 2026-10-13：依重寫後的七週導讀與課程官網整篇重寫成課程總覽。文首嵌入官方播放清單第 1 支的課程導論短片，狀態改為已附影片；新增「這門課的主線」，依導論短片的機器轉錄逐字稿轉述。標題與 tldr 改為講課程教什麼（原標題是「七週主題、十二個 projects 與一門 2020 年錄影的課怎麼跟」）。「七週各教什麼」從主題名表格改成每週的機制並連到各週導讀；新增一個算到底的 Q-learning 例子與三題附判準的先備檢查。原本講版本的兩節（「核心張力」「2020 年的錄影還值不值得跟」）不再各佔一節，會影響做法的三項併進專案一節。修正的事實：專案不是「從零寫一個完整程式」，是補上 distribution code 裡指定的函式；做完的成品原寫「搜尋引擎、西洋棋 AI」，課程沒有這些專案；官網列的是五個入口，原寫四種；證書條件補上 Knights 要 100% 的例外。拿掉沒有依據的說法（「幾乎一定排在前幾名」「六個月內」「全球大量高中與入門營隊拿它當骨架」「市面上的最新 AI 課更新的是工具名稱」「三天內走完」）。用語：「Week N」改「第 N 週」，「掃雷」改「踩地雷」。
- 2026-10-13：依獨立審稿修正：講課由 Brian Yu 主講（原寫兩人主講，字幕與官網都沒有這個依據）；導論片六項對到七週的那一句當場標明是本文排的；一處轉述拿掉引號；狀態行補上底本是機器轉錄。
- 2026-10-14：依複審修正：授課者的說法改為依課程官網頁首與 edX 課程頁（官網頁首並列兩人的名字，edX 課程頁把兩人都列為授課者），並補上 edX 課程頁的連結。
- 2026-08-26：初版。錄影與作業版本狀態以 2026 年 8 月 26 日官網查核為準。

## 參考資料

- [CS50's Introduction to Artificial Intelligence with Python — 課程官網](https://cs50.harvard.edu/ai/) — 先修條件、每週流程、五個修課入口
- [Introduction（YouTube）](https://www.youtube.com/watch?v=gR8QvFmNuLE) — 「這門課的主線」的底本
- [Week 0 Search](https://cs50.harvard.edu/ai/weeks/0/) — 錄影資產指向 `cdn.cs50.net/ai/2020/spring/`
- [Week 6 Language](https://cs50.harvard.edu/ai/weeks/6/) — 錄影資產指向 `cdn.cs50.net/ai/2023/x/`；現行第 6 週的專案
- [Projects 總覽](https://cs50.harvard.edu/ai/projects/)
- [Degrees 專案規格](https://cs50.harvard.edu/ai/projects/0/degrees/) — `2023/x` distribution、`ai50/projects/2024/x/degrees` slug、Python 3.12 上限、範例輸出、五分鐘內評分
- [Knights 專案規格](https://cs50.harvard.edu/ai/projects/1/knights/) — 100% 才算通過的例外
- [CS50 Certificate 說明頁](https://cs50.harvard.edu/ai/certificate/) — 每個專案 70% 以上換免費證書
- [edX 修課入口（verified certificate）](https://cs50.edx.org/ai)
- [CS50 AI YouTube 播放清單](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- [Gradebook](https://cs50.me/cs50ai)
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A0–A3 分級定義
- 站內：[Harvard AI／ML 課程地圖](/posts/learning/2026-08-22-harvard-ai-ml-course-map) — CSCI S-80 Summer 2026 與 OCW 的版本對照
