---
title: "CS221 Lecture 6：Search II：UCS 與 A* 的優先順序"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 7
tldr: "Stanford CS221 Autumn 2025 第 6 講依官方材料拆解 Search II：UCS 與 A* 的優先順序，並標出方法成立的假設與限制。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 6：官方 agenda、核心推導、實作連接與材料缺口。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-06-search-ucs-astar-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 6**，2025-10-08 由 Percy Liang 主講。課程版本與作業以[官方網站](https://stanford-cs221.github.io/autumn2025/)為準，本講主要材料是 [ucs_astar](https://stanford-cs221.github.io/autumn2025-lectures/?trace=ucs_astar)。

> 材料缺口：官方講義與影片公開；Canvas 課堂互動、作業解答與隱藏測資不公開。

## 先回顧：搜尋在解什麼問題

上一講的起點是：複雜問題需要搜尋，也就是找出一串可執行的行動。搜尋問題要形式化成 state、successors、start state 與 end state；source 的十地點旅行例子正是先取起點、列 successors，再檢查終點。

目標不是任意路徑，而是讓總成本最小。exact algorithms 包含 exhaustive search 與使用 caching 的 dynamic programming；approximate algorithms 包含 best-of-n 與 beam search。找到答案和找到最低成本答案是不同目標。

本講處理允許 cycles 的搜尋圖，並假設 action cost 非負。agenda 依序是 UCS、A* 與以 relaxation 建立 heuristic；結論是兩者都是允許 cycles 的 exact algorithms（但需 non-negative costs），關鍵是依 increasing past cost 排序，一般情況不能比 UCS 更好，而 A* 可用 domain knowledge 加速。

## UCS 為什麼改用優先順序

future cost 是從 state 到 end state 的最低成本；past cost 是從 start 到該 state 的最低成本。dynamic programming 計算 future cost 時，因為依賴 successor，且假設沒有 cycles，所以從 end 往 start 算，像 backpropagation。

有 cycles（無向邊是直觀情形）就沒有單純的 topological order。diamond graph 從 A 出發：A→B 是 1、A→C 是 100，B→C 與 C→D 各是 1，另有成本 100 的繞路。B、C 先算哪個？下一個 state 應依什麼順序處理？

UCS 改算 past costs，依 increasing past cost 處理 states，而非 future costs 與 topological order；它和 Dijkstra（1956）都要求成本非負。否則下一步可能降低已花成本，「目前最小」便不可靠。

## frontier、priority queue 與更新

候選狀態分成 explored（已找到最低成本路徑）、frontier（看過但仍確認最佳到達方式）與 unexplored（尚未看過）。priority queue 管理 frontier，priority 是目前已知的最小 past cost；`remove_min` 取最小者。

start state 以 priority 0 入 queue。展開後對每個 successor 計算 `past_cost + successor.cost`，呼叫 `frontier.update`；只有新路徑更便宜或 state 尚未出現才更新，也才需要改 backpointer。

實作是 heap 加 `priorities` dictionary。降低 priority 時 push 新 tuple，舊 tuple 留在 heap，形成 stale entry。state 以新 priority 取出後標成 `DONE`；舊項目之後出現便跳過。因此 heap tuple 數量不等於有效候選數。

`num_explored` 只在有效 state 移出 queue 後增加；空 queue 回傳 no solution，end state 則停止。它計的是處理過的 states，不是所有候選或 heap tuples。

## backpointer 與路徑重建

queue 不必攜帶整條路徑。`Backpointer` 記錄前一個 state、action 與 action cost；successor 有更便宜的到達方式時才更新。

取出終點後沿 backpointers 往 start 走，把每個 `Step` 插到 steps 前面，得到正向 action sequence。backpointer 是目前最佳前驅，不是所有邊；若固定第一條可行路徑，diamond 中的昂貴路徑可能被保留。

## UCS 的兩個例子

diamond example 中 A 以 0 取出，B 以 1 入 frontier，C 先是 100；展開 B 後 C 更新為 2，D 先得候選 101。取 C 後 D 更新為 3，最後得到 A → B → C → D，而非昂貴繞路。

grid search 的 state 是座標，S 到 E 可用 up、down、left、right，每步 cost 1，`#` 是牆。source 畫圖、檢查 start/successors/end，再跑 UCS。等成本使 queue 按距離分層處理，但重點仍是一般 cost ordering，不只是把 UCS 改名為 BFS。

source 也提供「每個 pixel 都是 state」的大型影片；只有連結，沒有數字或效率結論，因此不補 benchmark。

## UCS 的正確性直覺與條件

定理的說法是：只要 UCS 把 state `s` 從 frontier 移到 explored，`priority(s) = PastCost(s)`。base case 是 `priority(start) = PastCost(start) = 0`。歸納步驟假設所有 explored state 都已符合等式，並考慮一條到 `s` 的替代 red path：它先經過 explored 的 `t`，再經過 frontier 的 `u`。

因為 `PastCost(t)` 是到 t 的最低成本，而 u 到 s 的 action cost 非負，red path 的成本至少是 `PastCost(t) + Cost(t,u)`；依歸納假設，這等於 `priority(t) + Cost(t,u)`。t 曾被用來更新 u，所以不會小於 `priority(u)`；而 s 是 frontier 中 priority 最小者，因此不會小於 `priority(s)`。這最後等於 blue path 的成本。於是，取出 s 時不可能存在更便宜的替代路徑。

這份推理沒有承諾負成本情形。若 action 可以讓總成本下降，從 explored 經過一條負邊可能推翻先前的排序，UCS 的上述保證就不成立。source 因此把 non-negative costs 列為明確假設，而不是實作細節。

## A*：把終點方向放進排序

UCS 只知道 past cost，對「離終點還有多遠」沒有資訊。理想上可以依 `PastCost(s) + FutureCost(s)` 排序，但 FutureCost 本身就是原問題的解，通常同樣難算。A* 用 heuristic `h(s)` 近似 FutureCost，依 `PastCost(s) + h(s)` 探索。

source 以修改後的成本把 A* 化成 UCS：

`Cost'(s, a) = Cost(s, a) + h(Succ(s, a)) - h(s)`。

直覺是，一個 action 若把我們帶到看起來更遠離終點的 state，就承擔較大的 penalty；若更接近終點，modified cost 可能較小。程式的 `ModifiedSearchProblem` 對每條 successor 邊套用這個公式，然後直接呼叫 UCS。UCS 找到的是 modified costs 下的路徑；`astar_search` 再用 `modified_cost - h(next) + h(current)` 還原原始 action cost。

source 的 line example 從 state 0 出發，左右移動各 cost 1，終點是 2。heuristic 定義為 `h(state) = 2 - state`，所以會偏好向右。先跑 UCS，再跑 A*，可以看到相同搜尋介面下，排序資訊如何改變。source 同時提供 UCS 與 A* 的示範影片連結。

但不是任意 heuristic 都可以。counterexample 中 `h(C) = 1000` 會主動把搜尋帶偏。為了讓修改後的成本適用 UCS，source 定義 consistency：每條邊的 `Cost(s,a) + h(Succ(s,a)) - h(s)` 必須非負，且 `h(end) = 0`。在這個條件下，A* 正確；任何從 start 到 end 的路徑，其 modified costs 總和等於原始 costs 總和減去 `h(start)`，因為中間的 heuristic 會在 telescoping sum 中消掉。

admissibility 則是 `h(s) <= FutureCost(s)`，也就是 heuristic 永遠低估未來成本。source 明確指出 consistency implies admissibility。效率命題的表達是：A* 會探索滿足 `PastCost(s) <= PastCost(end) - h(s)` 的 states。當 `h(s)=0` 時，A* 就是 UCS；當 `h(s)=FutureCost(s)` 時，只探索 minimum-cost path 上的 nodes；通常的 heuristic 位於兩者之間。這些是 source 的條件式比較，不是對所有實作都保證相同探索數。

## relaxation：如何取得 heuristic

理想 heuristic 等於 FutureCost，但那會把原問題再解一次。source 的 recipe 是先拿掉部分 constraints，求出較容易的 relaxed problem 的 future cost，再令 `h(s) = FutureCost_relaxed(s)`。重點不是隨意猜一個數字，而是讓 relaxed problem 保留可用的下界與可計算性。

第一個 relaxation 回到有牆的 grid：把所有 `#` 移除。此時從 `(r,c)` 到右下角的 relaxed future cost 有 closed form，就是 Manhattan distance：`abs(end_r-r) + abs(end_c-c)`。source 依序示範 `(0,0)`、`(0,1)`、`(2,4)` 與 `(3,0)`；看起來更接近 E 不代表在原本有牆的地圖上真的更快。執行 UCS 與 A* 後，材料特別註明這個例子沒有帶來 benefit。

第二個是 limited travel：從 1 到 n，可以 walking（`i → i+1`）或 tram（`i → 2*i`），但 tram 只能使用指定的 tickets 次。relaxed problem 讓 tram 再次 free，並用沒有 tickets 限制的 TravelSearchProblem 先算 future costs。原問題的 state 是 `(loc, tickets)`，relaxed problem 只有 loc，所以 heuristic 要把原 state 映射到 relaxed state。比較 UCS 與 A* 時，還必須把解 relaxed problem 的成本算進 accounting；source 也提醒 dynamic programming 不能處理 cycles。若 relaxed problem 有 cycles，可建立 reversed relaxed problem，把 A → B 反轉成 B → A，再用 reversed problem 的 past costs 得到原 relaxed problem 的 future costs。

第三個是 8-puzzle。原問題禁止 tiles overlap；relaxed problem 允許 overlap，因此拆成八個 independent subproblems，各自可用 closed form 解決。source 的示例 heuristic value 是各 tile 移動距離的總和 `1 + 1 + 3 + 1 + 1 + 1 + 1 + 3`。這裡只保留材料展示的 relaxation，不延伸成 source 沒有說明的 puzzle 理論。

更一般的定義是：relaxation 保持相同的 states、actions、successors，但對每條邊滿足 `Cost_relaxed(s,a) <= Cost(s,a)`。它可以理解成把某些限制造成的 infinite cost 降成有限成本。若 `h` 是 relaxed problem 的 future cost，則 `h(s) <= Cost_relaxed(s,a) + h(Succ(s,a)) <= Cost(s,a) + h(Succ(s,a))`，所以 h 是 consistent heuristic。

但 relaxed problem 不會自動變容易；成本要以結構化方式降低，才能減少 states、得到 closed-form solution，或拆成 independent subproblems。最後，若 h1 是「拆牆」的 heuristic、h2 是「free tram」的 heuristic，兩者都 consistent 時，可以取 `h(s)=max(h1(s),h2(s))`，仍然 consistent。source 的證明只需對兩個 consistency 不等式取 max，再把共同的 Cost 拉出來。

## 收束：本講承諾了什麼

UCS 以 increasing past cost 探索，透過 priority queue、frontier update、DONE/stale-entry accounting 與 backpointer 重建最低成本路徑；在 non-negative costs 下，取出的終點具有 minimum cost。A* 是加上 heuristic 的 UCS：consistent heuristic 讓修改後成本非負，admissible heuristic 提供 future cost 的下界，好的 relaxation 則可能減少探索。

下一講的問題是：如果 action 的 outcome 不再 deterministic，例如擲骰子，搜尋會發生什麼事？至於本講未公開的 Canvas 互動、作業解答、hidden tests 與未提供的數據，仍維持材料缺口，不用另一個 term 或直覺補齊。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：ucs_astar](https://stanford-cs221.github.io/autumn2025-lectures/?trace=ucs_astar)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
