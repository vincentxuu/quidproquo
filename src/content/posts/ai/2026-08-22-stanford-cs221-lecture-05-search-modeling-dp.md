---
title: "CS221 Lecture 5：Search I：先定義狀態，再談搜尋演算法"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 6
tldr: "第 5 講把搜尋問題寫成 state、action、successor 與 cost，並用 acyclic dynamic programming 說明：狀態若遺漏未來所需資訊，再快的演算法也只會解錯問題。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 5，依官方可執行講義整理核心 agenda、例子與限制。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-05-search-modeling-dp-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 5**，2025-10-06 由 Percy Liang 主講。官方課表、講義與作業入口在[課程網站](https://stanford-cs221.github.io/autumn2025/)，本文按[本講的可執行 search artifact](https://stanford-cs221.github.io/autumn2025-lectures/?trace=search) 的程式與文字順序整理。

> 材料缺口：source 只提供這份可執行講義的內容；本文沒有補寫 source 未展示的 route 作業解答、其他課堂投影片或未公開實驗結果。

## 動機：為什麼現在還要談 search

上一講是 machine learning：學習演算法從訓練資料 `{(input, output)}` 得到 predictor，predictor 再把輸入映射成數值或類別。但真實問題常常不能只靠一次反射式映射完成，還需要 reasoning：思考、解題與規劃。這一講把焦點轉到 deterministic world 裡的一種 reasoning：search。

例子很直觀：找出解 Rubik's cube 的一串 moves，或找出從 A 到 B 的最短路徑。它們都不是「看到輸入就吐出答案」的單步 predictor，而是要在可能的行動序列中找路徑。這也說明本講為什麼先談問題表示，再談演算法。

但這個方向有一條重要的歷史邊界：symbolic AI 從 1950 年代以 search 起步，而 source 直接提出「that didn't pan out」。所以問題不是把早期 search 神化成今天的萬靈丹，而是問它在今天是否仍有用。講義引用 Rich Sutton 2019 年的 [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)：能利用 computation 的 general methods 最終往往更有效；其中看起來能如此擴展的兩種方法是 search 和 learning。

source 的結論很克制：search 仍在變得重要，例如 language model 的 test-time compute；但同時也需要 learning。這不是「search 取代 learning」的主張，而是兩者可以分工：learning 提供可用的成本或偏好，search 在那個成本上找解。

## 先定義 search problem

先不要急著解 travel example。可執行講義先建立一個 search problem 抽象，並用兩個例子把它具體化。第一個例子是一條編號 1 到 n 的街：從 i 走到 i+1 要 1 分鐘，搭 magic tram 從 i 到 2*i 要 2 分鐘；目標是從 1 到 n，總時間最少。這裡的 mindset 是「先 formalize，不要先手解」，因為我們想要的是能處理一般 search problem 的方法。

一個完整的 search problem 有三個元件：

- `start_state()`：初始狀態，travel problem 從位置 1 開始。
- `successors(state)`：在目前狀態可採取哪些 action、各 action 的 cost，以及採取後抵達的 state。
- `is_end(state)`：目前 state 是否已經是 end state；travel problem 在位置 n 結束。

source 中的 `Step` 正好把 action、cost、state 綁在一起。`successors` 先檢查走一步是否仍在界線內，再檢查 `2 * state` 是否仍不超過 n，才加入 walk 或 tram。這些界線不是裝飾：它們定義了圖上有哪些邊。

目標是找一個 solution，也就是一串 actions，讓總 cost 最小。講義給出的其中一條 n=10 路徑是 walk 到 2、tram 到 4、walk 到 5、tram 到 10，成本是 1+2+1+2=6。它只是可行解，不代表已經是最佳解；接下來的搜尋才負責比較不同序列。

## 狀態設計：留下未來需要的資訊

第二個例子把限制加進來：magic tram 需要 ticket，而且手上的 ticket 數量有限。此時只有 location 不夠，因為同一個 location，剩 1 張 ticket 和剩 0 張 ticket，未來能做的事不同。`TravelState` 因此是 `(loc, tickets)`：walk 保留 tickets，tram 則把 tickets 減 1；到達 n 就是 end，剩幾張票不影響終止判定。

這個例子示範「狀態包含評估 actions、costs、successors 所需的任何資訊」。source 也提出另一個變化：如果不能連續兩次搭 tram，狀態還必須包含 location、ticket 數量，以及「上一個 action 是否是 tram」。重點不是背這個 tuple，而是問：從這個 state 出發，未來的合法動作與成本是否已經完全決定？

那為什麼不把所有歷史都放進 state？因為後面的 dynamic programming 會按 state 的數量擴展。歷史越長，表面上越安全，卻可能把本來相同的未來拆成大量不同 state，讓 cache 失去合併效果。反過來，若刪掉 ticket 或上一動作等真正影響未來的資訊，就會把不同未來錯誤合併。好的建模是在「足以決定未來」與「保持 state 數量小」之間取界線。

這也是本講的 modeling boundary：source 先把問題正式表示好，並不保證 solution 已經顯而易見；但搜尋演算法可以只依賴這些介面，而不必為每個問題重新發明一套解法。

## Exact search：先看 exhaustive recursion

目標仍是從 start state 找到最低成本的 action sequence。exhaustive search 的直接做法是嘗試所有可能的 solution。講義選擇一個之後能自然推廣到 DP、也能連到 reinforcement learning 的遞迴定義：`future_cost(state)` 是從這個 state 到某個 end state 的最低未來成本。

遞迴很簡單。對每個 successor，付出第一步的 `successor.cost`，再加上 `future_cost(successor.state)`；把所有 successor 的結果取最小：

`future_cost(state) = min_successor (successor.cost + future_cost(successor.state))`

抵達 end state 時，base case 是空的 solution，成本為 0。否則 `future_solution` 遞迴求出每個後繼的最佳 continuation，將第一個 step 接到前面，再依 solution cost 取最小者。這個寫法不是只算一個數字：source 的 `Solution` 保留 steps，並以 steps 中每個 cost 的總和得到總成本，因此可以把最佳 action sequence 一起交回。

小例子會暴露問題：travel problem `num_locs=4` 時，source 記錄探索了 9 次，但只有 4 個 location state。也就是說，有些 state 被從不同路徑重複進入。把 n 增加到 10、17，解的成本仍可能合理，然而 explored 數會隨問題規模快速增加。講義把 exhaustive search 的 worst-case time complexity 描述為對 state 數量 exponential；memory 則是遞迴 stack 的 solution length 線性量級。

這段 recurrence 假設沒有 cycles，例如 A → B → C → A；否則可能無限遞迴，定義也不再直接成立。source 將「下週用 MDP 的 value iteration 處理 cycles」留在下一講，本文不把它提前填成這一講的內容。source 給出的暫時 workaround 是把 step 數加入 state，讓每次都增加 1；超過 threshold 時由 `is_end` 終止，或用 infinite cost 剪掉超限 state。

## Memoization / dynamic programming：重複子問題只算一次

exhaustive search 的浪費來自同一 state 被反覆展開。dynamic programming 的定義在 source 裡非常直接：**exhaustive search + caching**，也叫 memoization。`cache` 對每個 state 保存最佳 future solution；遞迴一開始先查 cache，已見過就直接回傳，第一次算完才寫入。

在 travel problem n=10 的示範中，DP 探索 10 個 state，正好等於這個例子的 state 數；n=17、甚至 n=100 也能繼續示範。這不是說 DP 永遠很快，而是說它把「相同 state 的相同後續問題」合併了。若每個 action 都帶往全新的 state，就幾乎沒有可 cache 的重複路徑，exhaustive search 反而可能已經足夠。

使用 DP 的條件也很實際：state 數量要放得進 memory，而且要有許多不同路徑能抵達相同 state。source 強調一般來說 memory 比 time 更珍貴；程式可以多跑一陣子，但 cache 需要真實空間。這裡的「exact」指的是在已定義的 search problem、cost 與無 cycle 的前提下，DP 找到 minimum-cost solution；它沒有把一個過大的 state space 變成免費。

## Exact 與 approximate 的分界

到這裡，exhaustive search 與 DP 都是在求 minimum-cost solution，因此是 exact methods。時間至少要和 state 數量同量級；如果 state 是 locations 的集合，或是「目前已生成的整段 words sequence」，state space 可能大到 exact search 不可行。這是從 exact 轉向 approximate 的邊界：不是 objective 突然消失，而是計算資源迫使我們只看部分可能性。

approximate search 的核心想法是用 heuristic 只檢查一部分 actions。它可能漏掉真正的最佳解，換來可接受的時間或 memory；source 明確保留這個 trade-off，沒有宣稱 approximate 一定正確或一定找到全域最佳。

### Best-of-n：把路徑當抽樣

最簡單的近似方法是從 start state 開始，依 policy 隨機選 action，直到 end；重複 n 次，取其中成本最低的一條。policy 是把 state 映射到 action 的函式，也可以是 nondeterministic。source 的 `uniform_policy` 從 successors 均勻挑一個，`rollout` 逐步套用 policy，`best_of_n` 再比較 n 個 `Solution`。

source 給出的保證是：當 n 趨近無限大，solution 會收斂到 minimum-cost solution；但可能要花 exponential 長的時間。每條 path 可以獨立計算，所以這種方法 embarrassingly parallel。它簡單，也比 beam search 更容易平行化，但品質取決於 policy 是否抽到好路徑。

### Beam search：保留固定寬度的部分解

beam search 每一輪保留從 start 出發的 `beam_width` 個 partial solutions。它把每個候選各延伸一步，列出所有新候選，按目前累積 cost 排序，只留下最好的 `beam_width` 個，再進入下一輪。source 用 n=10、`beam_width=2` 示範這個流程。

beam width=1 時等同 greedy search；beam width 趨近無限時，會走向 exhaustive search。beam search 是 deterministic（source 另註 stochastic 版本是 particle filtering），只使用 costs；best-of-n 則把 policy 當作 prior。兩者都不是在這個有限 beam 或有限 n 下保證 exact。

## 語言模型的 test-time compute

最後，source 把同一個 search abstraction 接到 language model。給定的是 `prompt → distribution over next token` 的 language model，以及把 response 判成通過或不通過的 verifier；目標是產生通過 verifier、同時在 LM 下有高機率的 response。test-time compute 的想法是：不要只 sample 一個答案，而是多花 inference compute 找更好的答案。

在 `LanguageModelSearchProblem` 裡，state 是 prompt 加上目前已生成的 response prefix，action 是 next token，cost 是該 token 的 negative log probability；若完整句子通過 verifier，source 再減去 100 的 cost。successors 只保留模型機率最高的 5 個 token，新的 state 是把 token decode 後接到原字串。source 的示例 prompt 是 `"(3 + 7 *"`，end 判定則是 state 以 `)` 結尾；`contains_number` 透過 `eval` 判斷，source 也直接標註這是 dangerous，本文不把它當成安全實務建議。

接著 `lm_policy` 把 successor costs 轉成 `softmax(-costs)` 的抽樣分布，best-of-n 用它產生 5 個 candidates，再選最低成本者。source 還引用 [Large Language Monkeys](https://arxiv.org/pdf/2407.21787) 作為 test-time sampling 的外部材料；這份文章只記錄 artifact 實際展示的 cast：state、next-token action、negative-log-probability cost，以及 verifier 成功時的額外 reward。實務上還需要許多 inference optimization，source 在此只留下提醒，沒有在本講展開。

## 收束：一張可操作的檢查表

讀到一個新問題時，依序問：start state 是什麼？每個 state 的 successors、actions 與 costs 是什麼？什麼叫 end？solution 是哪一串 actions？cost 如何加總？state 是否保留了 ticket、上一動作或其他會改變未來的資訊？如果 state 數放得進 memory，且存在大量重複子問題，可以用 DP；否則 exact search 可能不可行，再考慮 best-of-n 或 beam search。

本講的核心不是「DP 永遠優於 recursion」，而是建模決定了哪些歷史能被壓縮，壓縮後才有機會 cache。exhaustive search 給 exact baseline，但可能 exponential；DP 在 state 小且路徑重合時把重複工作消掉；best-of-n 與 beam search 則用有限計算換近似答案。learning 可以提供 costs，search 再在這些 costs 上找 solution。下一講才處理 cycles：A → B → C → A。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方可執行 artifact：search](https://stanford-cs221.github.io/autumn2025-lectures/?trace=search)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
- [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)
- [Large Language Monkeys](https://arxiv.org/pdf/2407.21787)
