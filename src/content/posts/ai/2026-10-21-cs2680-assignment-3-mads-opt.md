---
title: "在不掉分的前提下省錢省時間：成本優化競賽｜Harvard CS2680 作業 3"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, coding-agent, agent-harness, swe-bench, course-guide]
lang: zh-TW
series:
  name: "Harvard CS2680 導讀"
  order: 11
tldr: "CS2680 作業 3（Mads-Opt）是一場 harness 競賽：同一批 SWE-bench Pro 題目，比誰解得多、每解一題花得少、每解一題等得短。三個指標不加權，改用 skyline（Pareto）分層排名：沒有人在三項都不比你差、還至少一項比你好，你就是第 1 名。這篇整理作業的容器架構與硬限制、排名與計分怎麼算（附手算例子），用作業頁公布的模型價格先算一題大概花多少，再把第 8 堂的成本與速度槓桿對到這份作業。不含官方解答，也不談具體解法。"
description: "Harvard CS2680 Modern AI Systems（Fall 2026）作業 3 Mads-Opt 導讀：agent container 與 task container、sandbox HTTP API、evaluate 與 continue／done、5 題並行與 4 小時上限、Expert／Standard／Starter 三種模型的價格、每次 $10 與每天 $30 的預算、三指標 skyline 排名與 max(81 − r, 50) 計分、第 8 堂槓桿在本作業的對應。依據公開作業頁面、作業投影片與 starter 檔，不含官方解答。"
draft: false
glossary:
  - term: "skyline（Pareto 分層）"
    aliases: ["skyline", "Pareto frontier", "Pareto 前緣", "支配"]
    definition: "多個指標不合成一個分數時的排名方式。A 在每個指標都不比 B 差、而且至少一項比 B 好，就說 A 支配 B。沒有被任何人支配的那一群是第一層；把它們拿掉，剩下的再找一次，就是第二層，依此類推。"
    context: "作業 3 用解題數、每題成本、每題時間三個指標分 skyline 層排名。"
  - term: "每解一題的成本（cost per solved task）"
    aliases: ["cost per solved task", "每題成本"]
    definition: "整個 run 期間花掉的錢除以解出的題數。沒解出的題也花了錢，這些錢一樣算進分子。"
    context: "作業 3 的三個指標之一；每題時間也是用同樣方式除以解出題數。"
---

> 🌏 [English version](/posts/ai/2026-10-21-cs2680-assignment-3-mads-opt-en)

**影片狀態：課程不錄影。** 本文依公開作業頁面、作業投影片與 starter 檔整理，手算例子為本站補充，不是官方解答。[來源說明](#課程影片來源)

[CS2680](https://cs2680.com/) 的[作業 3](https://cs2680.com/assignments/assignment3) 叫 Mads-Opt，10/5 發、10/20 截止，佔總成績 20%。第 8 堂的投影片說它比前兩份作業難得多，要「當期中考看」（[第 8 堂 p2](https://cs2680.com/slides/8_agent_design_5.pdf#page=2)）。作業總覽頁給它的副標是「Make every token count」：模型仍然當黑盒 API 用，你能優化的是它周圍的一切，目標是解題數不掉，成本和延遲往下壓（[作業總覽](https://cs2680.com/assignments/)）。

它接在[作業 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop) 和[第 8 堂](/posts/ai/2026-10-21-cs2680-lecture-08-cost-latency-harness)後面。作業 2 你寫出一個能在 SWE-bench Pro 上跑的 harness，只看解不解得出來；作業 3 用同一類題目，再加上兩把尺：花了多少錢、等了多久。第 8 堂講的成本拆解、model routing、預算上限與關鍵路徑，在這份作業裡都有對應的開關。

這篇要回答的問題是：解題數、成本、時間三個指標怎麼一起排名，該怎麼取捨？讀完你應該能算出一組提交的 Pareto 排名，並列出自己的 agent 要先試的三個優化。

先備：讀過作業 2 與第 8 堂；知道[第 7 堂](/posts/ai/2026-10-21-cs2680-lecture-07-agent-evaluation)講過「不只看成功率，也看成本與延遲」（[第 7 堂 p35](https://cs2680.com/slides/7_agent_design_4.pdf#page=35)）。作業 3 的 leaderboard 已在 10/20 關閉；不是修課生也能讀懂排名規則與成本計算，本機的 starter 環境需要 Linux x86_64、Docker 與約 15 GB 磁碟。

## 作業要你做什麼

### 兩種容器，中間只有 HTTP

作業 3 把 agent 和題目拆在不同的容器裡（[作業頁 Part 0](https://cs2680.com/assignments/assignment3)）：

- **agent container**：跑你的 `src/`。主 loop、prompt、工具、subagent、跨題的記憶都放這裡。它連不到網路，唯一的出口是一個到課程 API 的代理。
- **task container**：每題一個，裡面是該題 repo 在起始 commit 的狀態，加上跑測試需要的工具鏈。它完全沒有網路。

兩邊靠 task container 裡一支小小的 HTTP 伺服器溝通，只有四個路由：`/health`、`/exec`（在 repo 裡跑一行 shell 指令）、`/read`、`/write`。starter 把它包成 `Sandbox(url, workdir)`，提供 `exec`、`read_text`、`write_text` 三個方法。作業頁特別提醒：不要在 agent container 裡用 `open()` 或 `subprocess` 去碰 repo，那裡沒有 repo。需要新工具時，可以自己在伺服器上加路由。

這跟作業 2 不一樣。作業 2 的 agent 直接在題目容器裡下指令；作業 3 的每個動作都是一次 HTTP 請求，所以「一步要多久」除了模型思考，還多了一段來回。

### 評估結果會回來給你

agent 覺得改好了，就交 patch、請系統評分：

```python
dispatcher.extract_patch(k)    # 取 task container 的 git diff 當作這題的 patch
ev = dispatcher.evaluate(k)    # -> {"tests_failed": F, "tests_total": T, "attempt": a}
```

評分在另一個乾淨的容器裡套上你的 patch、跑這題的隱藏測試，然後把「幾個測試失敗、總共幾個」告訴你。接著你二選一：`continue_task(k)` 保留容器和修改、繼續改，之後可以再評一次；或 `done(k)` 定案，以最後一次評估的結果為準（[作業頁 Part 0](https://cs2680.com/assignments/assignment3)）。

這是作業 3 和作業 2 最大的差別：每題可以評很多次，每次都拿到隱藏測試的回饋。要不要再試、試幾次、什麼時候放棄，就是你要設計的策略，而每一次嘗試都要花錢、花時間。

下圖依作業頁的架構圖重畫，只留一題從開題到拿回評估結果會經過的元件：

```flow-diagram
{
  "title": "作業 3 一題的流程：開題、改 repo、評估",
  "lang": "zh-TW",
  "width": 640,
  "height": 410,
  "caption": "依作業 3 頁面 Part 0 的架構圖重畫。facility 也負責啟動與移除 task container，圖上省略這條線。",
  "nodes": [
    {
      "id": "grp",
      "label": "agent container",
      "x": 285,
      "y": 145,
      "w": 210,
      "h": 230,
      "shape": "group"
    },
    {
      "id": "api",
      "label": "課程 API",
      "x": 70,
      "y": 90,
      "w": 100,
      "shape": "chip"
    },
    {
      "id": "agent",
      "label": "你的 agent\n（src/）",
      "x": 285,
      "y": 90,
      "w": 150,
      "tone": "accent"
    },
    {
      "id": "disp",
      "label": "dispatcher\nclient",
      "x": 285,
      "y": 205,
      "w": 150
    },
    {
      "id": "task",
      "label": "task container k\nsandbox_server、/app",
      "x": 540,
      "y": 90,
      "w": 170
    },
    {
      "id": "fac",
      "label": "facility\nrun_all.py",
      "x": 285,
      "y": 350,
      "w": 150
    },
    {
      "id": "grade",
      "label": "grading container\n隱藏測試",
      "x": 540,
      "y": 350,
      "w": 170
    }
  ],
  "edges": [
    {
      "from": "disp",
      "to": "fac",
      "step": 1,
      "label": "next_task",
      "offset": 16,
      "labelAt": [
        253,
        285
      ],
      "labelSide": "left"
    },
    {
      "from": "agent",
      "to": "api",
      "step": 2,
      "label": "呼叫\n模型",
      "labelAt": [
        124,
        58
      ]
    },
    {
      "from": "agent",
      "to": "task",
      "step": 3,
      "label": "HTTP\nPOST",
      "labelAt": [
        402,
        58
      ]
    },
    {
      "from": "fac",
      "to": "grade",
      "step": 4,
      "label": "套 patch",
      "offset": 16,
      "labelAt": [
        400,
        386
      ]
    },
    {
      "from": "grade",
      "to": "fac",
      "step": 5,
      "label": "失敗／總數",
      "offset": 16,
      "labelAt": [
        368,
        320
      ]
    },
    {
      "from": "fac",
      "to": "disp",
      "step": 6,
      "label": "評估結果",
      "offset": 16,
      "labelAt": [
        317,
        285
      ]
    }
  ],
  "steps": [
    "agent 透過 dispatcher client 呼叫 next_task；facility 啟動這題的 task container，把題目與連線資訊交給 agent",
    "agent 呼叫模型，請求經 egress proxy 送到課程 API，這是 agent container 唯一的對外出口",
    "agent 用 HTTP POST 呼叫 task container 裡的 sandbox_server，在 /app 的 repo 裡跑指令、讀寫檔案",
    "agent 交出 patch 並呼叫 evaluate(k)；facility 在另一個乾淨的 grading container 裡套上 patch，跑這題的隱藏測試",
    "grading container 回報失敗的測試數與測試總數",
    "評估結果經 dispatcher 回到 agent，由 agent 決定 continue_task 繼續改，或 done 定案"
  ]
}
```

### 你能改什麼、不能改什麼

| 項目 | 規定 |
|---|---|
| 可以改的 | `src/` 底下的一切；leaderboard 只取你上傳的 `src/`（[作業頁 Part 1](https://cs2680.com/assignments/assignment3)） |
| 不能改的 | `dispatcher/`、`madsOpt.py`、`evaluation_scripts/`，跟 leaderboard 用的是同一份；只有 `dispatcher/student_name.json` 要填自己的名字 |
| 模型 | Expert、Standard、Starter 三種（[作業投影片 p4](https://cs2680.com/slides/8_assignment3.pdf#page=4)），同一個 run 裡可以任意混用（[作業頁 Part 1 Step 2](https://cs2680.com/assignments/assignment3)） |
| 同時開幾題 | 最多 5 題，第 6 題會被拒絕 |
| 每次評估 | 上限 35 分鐘，卡住的測試全部算失敗；同一題一次只能有一個評估在跑 |
| 整個 run | 上限 4 小時，從開第一題起算；時間到時，開著的題照當下狀態定案，沒開過的題算失敗 |
| 花費 | 每次提交 $10，每人每天 $30；碰到任一上限就停，已完成的部分照記 |
| 題目 | 本機 starter 有 5 題，leaderboard 有 26 題，都來自固定版本的 SWE-bench Pro |

starter 裡的 `Agent` 只示範每個呼叫怎麼用：一次開一題，什麼都不修就交，所以本機跑會得到 0/5。流程完全由你決定：開幾題、要不要平行、什麼時候評估、失敗了再試還是換下一題、上一題學到的東西要不要帶到下一題。

每次模型呼叫和工具呼叫都要經 `dispatcher.logger(k)` 記進 trace。作業頁說，leaderboard 從 trace 讀每題的 turn 數（大致是這題呼叫了幾次模型），顯示在 Past submissions 的每題結果裡。starter 的註解則說成本也從 trace 算。兩處說法不一，最保險的做法是每次呼叫都記。

> **自我檢查**：你的 agent 平行開了 5 題，想再開第 6 題，`next_task()` 會怎樣？這對 agent 的寫法有什麼影響？
> 答：會丟出 `DispatcherError`，第 6 題不會被打開。agent 要自己追蹤開著幾題，等某一題 `done` 之後才開下一題，不能把這個例外當成「沒有題目了」。沒有題目時，`next_task()` 回傳的是 `None`。

## 三個指標怎麼排名

### 三把尺，都用「解出的題」當分母

每一次提交量三個數字（[作業頁 Part 2 Step 4](https://cs2680.com/assignments/assignment3)）：

1. **解出幾題**。
2. **每解一題的成本**：整個 run 期間課程 API 帳號被扣的錢，除以解出的題數。
3. **每解一題的時間**：從開第一題到最後一題結束的牆鐘時間（真實經過的時間，不是各題相加），除以解出的題數。

分母都是解出的題數。沒解出的題也花了錢、佔了時間，這些都算進分子。舉例來說，一次 run 花了 $5、解出 16 題，每題成本是 $0.31。多花 $1 在兩題最後還是失敗的難題上，就變成 $6 ÷ 16 = $0.375。同樣多花 $1，要是多解出 1 題，則是 $6 ÷ 17 ≈ $0.35。放棄得太晚，三個數字裡有兩個會跟著變差。

### Skyline：沒有人支配你，你就是第 1 名

這三個數字不加權合成一個分數，而是分層排名（[作業頁 Part 2 Step 6](https://cs2680.com/assignments/assignment3)）。規則是：

- 每人只看自己最好的那一次提交。
- 解出 7 題以上的提交，照三個指標分 skyline 層。A 在三項都不比 B 差、而且至少一項比 B 好，就說 A **支配** B。沒有被任何人支配的，就是第 1 層；把第 1 層拿掉，剩下的再找一次，就是第 2 層。
- 名次算的是「排在你前面的人數加一」：第 1 層有三個人，他們都是第 1 名，第 2 層的人就是第 4 名（1、1、1、4）。
- 解不到 7 題的提交排在所有人後面，只比題數。
- 新的提交要名次嚴格比舊的好，才會取代你的最佳提交；平手就保留舊的。

「skyline」這個名稱來自資料庫：2001 年 [Börzsönyi 等人提出的 Skyline operator](https://doi.org/10.1109/ICDE.2001.914855)，從一堆資料裡只留下沒被別人在所有維度上支配的那些。第 7 堂在講評估時也畫過這張圖，第 1 層就是 Pareto 前緣；圖上只畫了能力與成本兩個指標，時間沒畫（[第 7 堂 p35](https://cs2680.com/slides/7_agent_design_4.pdf#page=35)）。

### 手算一次

本文教學例子，數字是假設的。三位同學的最佳提交：

| 提交 | 解出 | 每題成本 | 每題時間 |
|---|---|---|---|
| A | 20 題 | $0.30 | 120 秒 |
| B | 18 題 | $0.20 | 100 秒 |
| C | 17 題 | $0.35 | 150 秒 |

- **A 對 C**：A 解得多、比較便宜、比較快，三項都贏，A 支配 C。
- **B 對 C**：同樣三項都贏，B 也支配 C。
- **A 對 B**：A 解得多，B 便宜又快，誰都沒有三項都不輸對方，互不支配。

所以 A、B 是第 1 層，都是第 1 名。C 在第 2 層，前面有 2 個人，是第 3 名。

再加一位 D：解 12 題、每題 $0.10、每題 90 秒。D 解得比 A、B 少，但比他們便宜也比較快，A、B 都沒有支配 D；D 也沒有支配任何人。D 跟 A、B 一起在第 1 層，C 前面變成 3 個人，掉到第 4 名。

這個例子說明 skyline 的一個性質：解出 7 題以上時，三項裡只要有一項是**唯一**的第一（沒有人跟你並列），你就一定在第 1 層。別人要支配你，那一項至少得跟你一樣好，而沒有人做得到。題數少但極便宜、極快的提交，也可能是第 1 名。只是並列第一就不夠。A 是 20 題、$0.30、120 秒，X 是 20 題、$0.30、130 秒。X 的題數和成本都並列第一，但時間比 A 慢，仍被 A 支配，落在第 2 層。

### 名次怎麼換成分數

leaderboard 佔作業 80 分。設 r 是你最佳提交的名次（[作業頁 Grading](https://cs2680.com/assignments/assignment3)）：

- 任一次提交達到 baseline：分數 = max(81 − r, 50)。
- 否則：分數 = 81 − r。

baseline 是「4 小時內、$10 以內解出 16 題」。達到 baseline 的那一次不必是你的最佳提交。作業頁的例子：第 1 名 80 分；第 12 名不論有沒有達到 baseline 都是 69 分；第 40 名達到 baseline 是 50 分，沒達到是 41 分。

換句話說，baseline 只在名次很後面時有差：81 − r 掉到 50 以下（r 大於 31）時，它把分數墊在 50。前段名次靠的是 skyline。上面只有 A、B、C 的例子裡，A、B 都是 81 − 1 = 80 分，C 是 81 − 3 = 78 分。

> **自我檢查**：你原本的最佳提交是 A。你把模型全部換成最便宜的 Starter，成本大降，但少解了 3 題。排名一定變好嗎？
> 答：不一定。要看換完之後，還有沒有人在三個指標上都不差於你。題數變少，原本被你在題數上壓住的人，可能開始在三項都不輸你。反過來，如果你變成全場唯一最便宜的（每題成本沒有人跟你一樣低），而且仍解出 7 題以上，就一定在第 1 層。另外，新提交名次要嚴格變好才會取代舊的；沒有變好，舊的 A 還在，但這次提交花掉的錢照樣扣當天的 $30。

## 先算帳：一題大概花多少

### 三種模型的價格

作業頁公布了三種模型的價格，單位是每一百萬 token（[作業頁 Part 1 Step 2](https://cs2680.com/assignments/assignment3)）：

| 模型 | 輸入 | 快取輸入 | 輸出 |
|---|---|---|---|
| Expert（最強） | $2.00 | $0.10 | $10.00 |
| Standard | $0.08 | $0.004 | $0.28 |
| Starter（最便宜） | $0.01 | $0.0005 | $0.04 |

三種模型的快取輸入都是一般輸入的 1/20。快取輸入指的是：這次請求的開頭跟之前某次請求一樣，服務端可以重用已經算好的部分。[第 2 堂](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works)講過 agent 每一步都會重讀前面的 context，所以命中快取與否，帳單差很多。

### 一題 40 步的帳單

本文教學例子，步數、token 數與快取命中率都是假設的。一題跑 40 步，每步送出 30,000 token 的 context、輸出 500 token，其中 90% 的輸入命中快取：

- 輸入共 40 × 30,000 = 1,200,000 token：快取的 1,080,000 token、沒快取的 120,000 token。
- 輸出共 40 × 500 = 20,000 token。

| 模型 | 快取輸入 | 一般輸入 | 輸出 | 這一題 | 26 題 |
|---|---|---|---|---|---|
| Expert | $0.108 | $0.240 | $0.200 | 約 $0.55 | 約 $14.25 |
| Standard | $0.0043 | $0.0096 | $0.0056 | 約 $0.02 | 約 $0.51 |
| Starter | $0.0005 | $0.0012 | $0.0008 | 約 $0.0025 | 約 $0.07 |

在這組假設下，26 題全用 Expert 會超過每次 $10 的上限，run 會在中途被停掉。平均下來，每題能花的錢是 $10 ÷ 26 ≈ $0.38。同樣的工作量如果完全沒命中快取，Expert 一題要 $2.60，差將近 5 倍。

這張表不是在說「全用 Standard 就好」：便宜的模型可能要更多步、解出更少題，題數一少，每題成本的分母也跟著變小。第 8 堂的投影片也提醒，便宜的模型可能反而比較慢（[第 8 堂 p29](https://cs2680.com/slides/8_agent_design_5.pdf#page=29)）。這張表要說的是：在動手之前，先用自己的 trace 算出一題實際跑幾步、每步多少 token、快取命中多少，才知道預算夠不夠。

### 時間也有上限

26 題、4 小時，平均每題只有 240 ÷ 26 ≈ 9.2 分鐘。一題接一題做，只要平均超過 9 分多鐘，後面的題目就來不及打開，沒開過的題直接算失敗。最多可以同時開 5 題，平行做時，完成時間看的是最長的那條路徑，不是每一步加總（[第 8 堂 p29](https://cs2680.com/slides/8_agent_design_5.pdf#page=29)）。每題時間的分子是牆鐘時間，所以平行本身就會讓這個指標變好。代價是總 token 可能變多（[第 8 堂 p29](https://cs2680.com/slides/8_agent_design_5.pdf#page=29)），同一時間花錢的速度也變快，更容易碰到 $10 的上限。

> **自我檢查**：照上面的假設，全部用 Expert 跑 26 題，run 在花到 $10 時被停下。這時已經解出 12 題。這次提交的三個指標各是什麼？能不能拿 baseline？
> 答：解出 12 題；每題成本約 $10 ÷ 12 ≈ $0.83；每題時間是到停下為止的牆鐘時間除以 12。12 題不到 baseline 的 16 題，這次拿不到 baseline 的保底。

## 第 8 堂的槓桿在這份作業怎麼用

第 8 堂把成本拆成幾個相乘的因子：每個任務幾輪、每輪幾步、每步多少 token、每個 token 多少錢（[第 8 堂 p7](https://cs2680.com/slides/8_agent_design_5.pdf#page=7)）。第 8 堂說的「輪」是使用者來回一次。作業 3 沒有使用者，每題只有一輪，所以能動的是每輪幾步、每步多少 token、每個 token 多少錢，加上時間。這跟 leaderboard 上每題的 turn 數不是同一件事。下表把第 8 堂的槓桿對到作業 3 的開關，只說它對應到什麼、該看 trace 的哪個數字，不給具體做法：

| 第 8 堂的槓桿 | 在作業 3 對應到 | 先看什麼數字 |
|---|---|---|
| 減少步數 | 每題跑幾步才交 patch | trace 裡每題的步數分布 |
| 減少每步 token | 工具輸出截斷、舊輸出清掉、壓縮（[第 4 堂](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering)） | 每步送出的 prompt token 怎麼隨步數變大 |
| 快取 | 每次請求的開頭維持不變（[第 8 堂 p21](https://cs2680.com/slides/8_agent_design_5.pdf#page=21)） | 快取命中的比例（看 API 回傳的用量） |
| model routing | 三種模型誰做什麼：一開始就選定、失敗了再升級，或每步重選（[第 8 堂 p22](https://cs2680.com/slides/8_agent_design_5.pdf#page=22)） | 各模型的呼叫次數與花費 |
| 每題預算與停止條件 | 一題最多花多少錢、多少步、評估幾次；什麼情況放棄（[第 8 堂 p26](https://cs2680.com/slides/8_agent_design_5.pdf#page=26)） | 解出的題通常在第幾次評估、花多少錢解出 |
| 關鍵路徑與平行 | 同時開幾題（上限 5）、評估等待時先做別的題 | 牆鐘時間裡，有多少時間在等評估、等模型 |

要挑先試哪三個，可以照這個順序：

1. 本機跑一次，從 trace 把表格第三欄的數字填出來。
2. 先算這次整體每題花多少錢、多少分鐘，跟前面算出的 $0.38／題、9.2 分鐘／題比，看錢和時間哪一項超得多。
3. 在超標的那一項底下，挑第三欄數字最反常的三列，就是先試的三個。

挑的依據是 trace 裡的數字，不是直覺。

幾點要注意：

- **routing 的難處**：第 8 堂的投影片說，便宜模型的一個規劃錯誤，可能浪費後面很多步（[第 8 堂 p22](https://cs2680.com/slides/8_agent_design_5.pdf#page=22)）。省下的每 token 單價，可能被多出來的步數吃掉。
- **評估回饋就是停止條件**：`evaluate` 回傳的失敗測試數，是這份作業最直接的進度訊號。第 8 堂建議的停止條件裡，有一條是「N 步內沒有新的測試通過」（[第 8 堂 p26](https://cs2680.com/slides/8_agent_design_5.pdf#page=26)）；投影片上的預算數字是示意，要用你自己的 trace 定。
- **一次只改一件事**：第 8 堂講成本那一段的最後一頁，列了一個四步的迴圈（[第 8 堂 p38](https://cs2680.com/slides/8_agent_design_5.pdf#page=38)）。依序是跑一次並記錄、找出錢與時間花在哪、只改一件事、用同一批題目重新評估。這頁投影片寫著是給作業 4 用的提醒，同一套流程放到作業 3 也適用。leaderboard 每天只有 $30，大概只夠跑三次滿額提交，大部分實驗要在本機的 5 題上做。

研究上也有人主張，評估 agent 要同時看成本與準確率。2024 年的論文〈[AI Agents That Matter](https://arxiv.org/abs/2407.01502)〉指出，benchmark 只看準確率，會讓 agent 變得不必要地複雜又昂貴，因此主張把兩者一起優化。作業 3 的三指標排名，就是把這個主張寫進計分規則。

> **自我檢查**：你的 agent 在本機 5 題上解出 3 題，trace 顯示其中一題評估了 6 次才過，另一題評估了 9 次仍失敗。你該先動哪一個槓桿？
> 判準：答出要先看 trace 再決定，而且這組數字指向「每題預算與停止條件」：9 次仍失敗的那題花了多少錢與時間、評估之間失敗的測試數有沒有在減少。如果測試數一直沒減少，提早放棄能同時改善每題成本和每題時間。只答「換便宜模型」而沒看 trace，不算。

## 交什麼、怎麼評分

| 交什麼 | 放哪裡 |
|---|---|
| `src/` 壓成 `src.zip` | 上傳到 leaderboard 的 Submit 頁 |
| Claude Code 的 session 檔（`a3-sessions.tar.gz`） | 課程共用私有 repo 的 `assignment3/` |
| 一頁 writeup（`writeup.pdf`） | 同上 |
| 3 分鐘影片 | 上傳 Canvas（課程的教學平台） |

評分（[作業頁 Grading](https://cs2680.com/assignments/assignment3)）：

- **Leaderboard 80 分**：照上一節的名次與公式計算。leaderboard 不接受 late days（課程給的遲交天數額度），10/20 23:59 關閉，沒交就是 0 分；late days 只適用於 repo 和影片。
- **Writeup 10 分**：一頁，回答三個問題。作業頁要求完全由自己寫，不能有 AI 產生的文字。
  - harness 的主要元件，例如 subagent、跨題記憶、哪種模型做什麼。
  - 做了哪些優化與取捨，例如失敗的題什麼時候放棄、同時開幾題。
  - 踩到哪些坑，什麼幫助你改善解題數、每題成本或每題時間。
- **影片 10 分**：露臉、用自己的聲音講同樣的內容，打開程式碼，指出 writeup 裡每個元件在哪裡。

作業總覽頁對作業 3 的繳交形式寫的是「公開發表的 blog post」，和作業 3 頁面的 PDF 加影片不同；評分表以作業 3 頁面為準來寫。另外，作業頁說找到並回報資安漏洞，最多可加總成績 3 分，濫用漏洞則該次提交作廢。

## 綜合自我檢查

1. 用本文 A、B、C、D 四筆最佳提交（A、B、D 第 1 名，C 第 4 名）。B 又交了一次，這次解 21 題、每題 $0.20、每題 100 秒。四個人的名次會變成怎樣？
   判準：先算新提交的名次。它三項都不輸 A（21 > 20、$0.20 < $0.30、100 秒 < 120 秒），支配 A，也支配 C；D 解得少但比它便宜又快，沒被它支配。所以新提交是第 1 名。但 B 原本的最佳提交也是第 1 名，名次沒有嚴格變好，照規則平手保留舊的，新提交不會取代它。四個人的名次維持 A、B、D 第 1 名，C 第 4 名。這題考的就是平手規則；如果新提交生效，A 會掉到第 3 名。
2. 為什麼「每題成本」和「每題時間」都除以解出的題數，而不是除以打開的題數？這會鼓勵 agent 怎麼做？
   判準：答出這樣算，沒解出的題花的錢和時間都被攤到解出的題上，所以白做的工作會直接拉高兩個指標。它鼓勵 agent 判斷一題值不值得繼續，在沒有進展時停手，而不是每題都試到預算用完。
3. 你的 agent 一題接一題做，平均每題 12 分鐘。26 題的 run 會發生什麼事？
   判準：26 × 12 = 312 分鐘，超過 4 小時（240 分鐘）。大約到第 20 題時間就用完，後面的題沒開過、直接算失敗。要嘛縮短每題時間，要嘛同時開多題。
4. 你在本機跑完 5 題，從 trace 整理出幾個數字：平均每題 34 步，每步送出的 prompt token 從 4,000 漲到 60,000，快取命中約 20%。模型全部用 Expert，牆鐘時間有一半在等評估。解出的題都在第 1、2 次評估就過了，沒解出的題平均評估了 7 次。照槓桿表，哪三列離目標最遠？每一列各舉出你根據的數字。
   判準：只考讀 trace、找差距，不考怎麼改。先照正文的第 2 步估一題花多少錢：prompt 從 4,000 線性漲到 60,000，34 步共送出約 109 萬 token。命中 20%、全用 Expert，再假設每步輸出 500 token，一題約 $1.9，是 $0.38 的 5 倍。錢超了 5 倍，先看跟錢有關的列；牆鐘時間有一半在等評估，時間那一列也值得列進來。合理的答案會指出這三列：
   - 快取：命中只有 20%。
   - 每題預算與停止條件：解出的題 1–2 次就過，沒解出的題卻評了 7 次。
   - 關鍵路徑與平行：一半時間在等評估。

   答 model routing 或每步 token 也可以，只要附上對應的數字。答出某一列卻說不出依據的數字，不算。

## 延伸閱讀

- [作業 2：親手寫一個 coding agent harness](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop)：這份作業往下改的起點。
- [第 8 堂：讓 agent 便宜又快](/posts/ai/2026-10-21-cs2680-lecture-08-cost-latency-harness)：本文每個槓桿的完整說明。
- [跟成熟 coding agent 學設計（34）：Telemetry 與成本追蹤](/posts/ai/2026-08-30-coding-agent-telemetry-cost-tracking)：token 記下來之後，怎麼變成可以決策的數字。
- [Agent 省 token 時怎麼保住工具結果與技能指令](/posts/ai/2026-10-16-agent-token-cost-tool-results)：清掉舊工具輸出時，哪些要留、哪些可以丟。
- [CMU 11-768 作業 2：評估 agent](/posts/ai/2026-09-29-cmu-11768-assignment-2-eval)：另一門課怎麼量 agent 好不好。

## 課程影片來源

- 課程不錄影（[policy 頁](https://cs2680.com/policy)）。作業沒有錄影可對照。
- 底本：[作業 3 頁面](https://cs2680.com/assignments/assignment3)、[作業 3 投影片](https://cs2680.com/slides/8_assignment3.pdf)與 starter 檔 `assignment3.tar.gz`（`dispatcher.py`、`agentic_loop.py`、題目清單），2026-10-22 讀取。文中的排名例子、帳單估算、自我檢查與流程圖是本站補充。

## 參考資料

- [CS2680 作業 3：Harness competition（Mads-Opt）](https://cs2680.com/assignments/assignment3)
- [CS2680 作業 3 投影片：MadsOpt: Harness Competition](https://cs2680.com/slides/8_assignment3.pdf)
- [CS2680 作業總覽](https://cs2680.com/assignments/)
- [CS2680 第 7 堂投影片：Agent Design IV](https://cs2680.com/slides/7_agent_design_4.pdf)
- [CS2680 第 8 堂投影片：Agent Design V: cost-effective agents](https://cs2680.com/slides/8_agent_design_5.pdf)
- [CS2680 course note：Cost-effective agents](https://cs2680.com/notes/cost-effective-agents)
- [Börzsönyi, Kossmann & Stocker, The Skyline Operator（ICDE 2001）](https://doi.org/10.1109/ICDE.2001.914855)
- [Kapoor et al., AI Agents That Matter（arXiv 2407.01502）](https://arxiv.org/abs/2407.01502)
- [Deng et al., SWE-Bench Pro（arXiv 2509.16941）](https://arxiv.org/abs/2509.16941)
- [CS2680 課程政策](https://cs2680.com/policy)
