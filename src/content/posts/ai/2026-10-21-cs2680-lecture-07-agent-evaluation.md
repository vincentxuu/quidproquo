---
title: "怎麼評估 agent：benchmark、pass@k 與資料洩漏｜Harvard CS2680 第 7 堂"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, agent-evaluation, benchmark, coding-agent, course-guide]
lang: zh-TW
series:
  name: "Harvard CS2680 導讀"
  order: 9
tldr: "CS2680 第 7 堂（2026-09-30）講怎麼量一個 agent 好不好。先分清楚量的是零件還是整條任務，以及「成功」指的是答對、做出能跑的程式，還是把環境改到對的狀態。指標方面，pass@k 問試 k 次有沒有一次成功，pass^k 問 k 次是不是全部成功；同一組試驗結果，兩者可以差到 0.9 和 0.3。接著看八個代表 benchmark 各量什麼，再看分數什麼時候不可信：解答可能在訓練資料裡、可能被 agent 上網查到、可能藏在環境的 git 歷史裡，評分器本身也可能被鑽漏洞。"
description: "Harvard CS2680 Modern AI Systems（Fall 2026）第 7 堂導讀：零件評估與端到端評估、五種「成功」的定義、pass@k 與 pass^k（含不偏估計式與手算例）、benchmark 評測迴圈、GAIA／BFCL／WebArena／OSWorld／SWE-bench／τ-bench／Terminal-Bench／TheAgentCompany、資料洩漏四層、單輪指令的盲點、benchmark 飽和。依據公開投影片與課程筆記。"
draft: false
glossary:
  - term: "pass@k"
    definition: "同一題獨立試 k 次，至少一次成功的機率。適合部署時真的有驗證器、可以從多個候選裡挑出對的那一個的情境，例如有單元測試的程式生成。"
    context: "第 7 堂拿它和 pass^k 對照：同一組試驗，pass@k 不會比單次成功率低。"
  - term: "pass^k"
    aliases: ["pass hat k", "pass-hat-k"]
    definition: "同一題獨立試 k 次，k 次全部成功的機率，再對所有題目平均。量的是一致性，適合每次都要做對的情境，例如客服。由 τ-bench 提出。"
    context: "第 7 堂說 pass^k 刻意比 pass@k 嚴格。"
  - term: "資料洩漏"
    aliases: ["data leakage", "contamination", "汙染"]
    definition: "評測題目或它的解答，透過訓練資料、執行時上網、環境裡殘留的檔案或歷史、或反覆對著測試集調整，被受測系統事先知道，使分數高估真實能力。"
    context: "第 7 堂把它分成訓練、執行時、環境、benchmark 過擬合四層。"
---

> 🌏 [English version](/posts/ai/2026-10-21-cs2680-lecture-07-agent-evaluation-en)

**影片狀態：課程不錄影。** 本文依公開投影片與課程筆記整理，數值例子為本站補充。[來源說明](#課程影片來源)

[CS2680](https://cs2680.com/) 第 7 堂在 2026 年 9 月 30 日上課，題目是〈Agent design IV: evaluation〉（[投影片](https://cs2680.com/slides/7_agent_design_4.pdf)）。這堂配了一份課程筆記〈[Agent evaluation and benchmarks](https://cs2680.com/notes/agent-evaluation)〉，把投影片只用一句話帶過的指標寫成估計式與例子。前幾堂教你怎麼搭 agent、怎麼拆成多個 agent、怎麼讓它[記得事情、出錯時找得到原因](/posts/ai/2026-10-21-cs2680-lecture-06-memory-reliability)（第 6 堂）；這堂問的是：改完之後，怎麼知道它真的變好了？

這堂要回答的問題是：一個 agent 好不好要怎麼量，什麼時候數字不可信？讀完之後，你應該能拿一組重複試驗的結果算出 pass@k 與 pass^k，也能說出一個 benchmark 分數可能被灌水的幾種方式。

如果你做過[作業 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop)，你已經做過一次小型評測：10 題 SWE-Bench Pro 加上 4 題自己出的題目。這堂把那件事放大成一門方法。

投影片分四段：怎麼量、八個代表 benchmark、評測的難處、評測的演變。最後一頁預告作業 3 的評分方式；大綱列的成本優化移到第 8 堂。

## 量的是什麼

### 零件，還是整條任務

評估一個 agent 有兩種角度（p6）：

- **零件評估**：拆開來看 agent 裡面的能力。規劃與任務拆解、工具使用（找到工具、選對工具、參數填對）、錯誤恢復、記憶（抽取、整合、取回）。
- **端到端評估**：只看結果。任務有沒有完成、每個任務花多少錢、多久完成。

兩者互補。端到端分數告訴你「好不好」，零件分數告訴你「壞在哪」。課程筆記補了一句很重要的話：一個 benchmark 分數量的是「一個特定系統、在一組特定任務上、照一套特定規則」的表現。對 agent 來說，這個系統包含模型、prompt、記憶、工具、控制迴圈與執行環境；只改工具介面或重試次數，分數就可能變，模型一點都沒換。這正是[第 4 堂](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering)「Agent = Model × Harness」的另一面。

### 「成功」有五種意思

benchmark 一路從語言模型時代演變到 agent 時代（p7），「成功」的定義也跟著換（p8）：

| 評估目標 | 代表 benchmark | 怎樣算成功 |
|---|---|---|
| 預測文字 | PTB、WikiText | 給實際出現的文字高機率 |
| 答對問題 | MMLU、GSM8K、GPQA、HLE | 和已知答案一致 |
| 給出比較好的回覆 | Arena、AlpacaEval、MT-Bench | 人或模型評審比較喜歡 |
| 寫出能跑的程式 | HumanEval、LiveCodeBench、SWE-bench | 通過可執行的測試 |
| 完成互動任務 | WebArena、OSWorld、τ-bench、Terminal-Bench | 環境最後停在要求的狀態 |

前四種看的是模型吐出來的東西，最後一種看的是世界被改成什麼樣子。agent 會動手，所以 agent 的評測多半落在最後兩列。這也表示：一個答對問題的分數，不能拿來推論它會不會把資料庫改對。

> **自我檢查**：你的 agent 負責幫客戶改訂單地址。拿 MMLU 分數高的模型來當底，能不能說它很適合這份工作？
> 答：不能。MMLU 量的是答對知識題，你的工作要的是把後台資料改對、而且只改該改的。要評估它，得看任務結束後訂單資料庫的狀態，屬於「完成互動任務」那一類。

## 指標：找到一次成功，還是每次都成功

### 投影片列的指標

p10 把指標分成三組：

- **早期 benchmark**：困惑度（perplexity，模型對一段沒看過的文字有多「意外」，越低越好）、正確率或 F1（同時看找得準與找得全的分數）、偏好勝率。
- **能力**：pass@k，k 次裡至少一次成功；pass^k，k 次全部成功，由 [τ-bench](https://arxiv.org/abs/2406.12045) 提出。
- **成本與延遲**：成本多半是模型費用，但工具呼叫與快取沒命中常被忽略；延遲也不只模型的時間。

pass@k 和 pass^k 長得很像，問的卻是相反的問題（p19）。pass@k 問「試 k 次，有沒有一次做對」，適合寫程式這類有測試可以挑出正確版本的情境。前提是部署時你手上真的有這個測試：benchmark 的隱藏測試不能拿來替 agent 挑答案，否則 pass@k 量到的是評分器，不是 agent（課程筆記）。pass^k 問「試 k 次，是不是每次都做對」，適合客服這類每位使用者都要成功的情境，所以 τ-bench 說它刻意比 pass@k 嚴格。

### 同一組結果，兩個數字差三倍

課程筆記用的例子是：同一題獨立跑 5 次，成功 3 次。想知道 k = 2 時的兩個指標。

- **pass@2**：隨機挑 2 次，至少一次成功的機率。5 次挑 2 次有 10 種挑法；兩次都失敗只有 1 種（剛好挑到那 2 次失敗）。所以 pass@2 ＝ 1 − 1/10 ＝ 0.9。
- **pass^2**：挑到的 2 次都成功的機率。從 3 次成功裡挑 2 次有 3 種。所以 pass^2 ＝ 3/10 ＝ 0.3。

```diagram
title: 5 次試驗挑 2 次，共 10 種挑法
desc: 5 次試驗中前 3 次成功、後 2 次失敗；任挑 2 次的 10 種組合裡，3 種兩次都成功，6 種一成一敗，只有 1 種兩次都失敗，所以 pass^2 是 3/10、pass@2 是 1 − 1/10。
caption: 課程筆記的例子。只畫第 i 次與第 j 次（i 小於 j）的組合；格內數字是這兩次裡成功的次數。哪幾次成功不影響結果。
---
<svg viewBox="0 0 548 336">
  <text class="dg-label" x="218" y="28" text-anchor="middle" dominant-baseline="central">第 2 次</text>
  <text class="dg-sub" x="218" y="48" text-anchor="middle" dominant-baseline="central">成功</text>
  <text class="dg-label" x="306" y="28" text-anchor="middle" dominant-baseline="central">第 3 次</text>
  <text class="dg-sub" x="306" y="48" text-anchor="middle" dominant-baseline="central">成功</text>
  <text class="dg-label" x="394" y="28" text-anchor="middle" dominant-baseline="central">第 4 次</text>
  <text class="dg-sub" x="394" y="48" text-anchor="middle" dominant-baseline="central">失敗</text>
  <text class="dg-label" x="482" y="28" text-anchor="middle" dominant-baseline="central">第 5 次</text>
  <text class="dg-sub" x="482" y="48" text-anchor="middle" dominant-baseline="central">失敗</text>
  <text class="dg-label" x="112" y="88" text-anchor="end" dominant-baseline="central">第 1 次</text>
  <text class="dg-sub" x="160" y="88" text-anchor="end" dominant-baseline="central">成功</text>
  <text class="dg-label" x="112" y="140" text-anchor="end" dominant-baseline="central">第 2 次</text>
  <text class="dg-sub" x="160" y="140" text-anchor="end" dominant-baseline="central">成功</text>
  <text class="dg-label" x="112" y="192" text-anchor="end" dominant-baseline="central">第 3 次</text>
  <text class="dg-sub" x="160" y="192" text-anchor="end" dominant-baseline="central">成功</text>
  <text class="dg-label" x="112" y="244" text-anchor="end" dominant-baseline="central">第 4 次</text>
  <text class="dg-sub" x="160" y="244" text-anchor="end" dominant-baseline="central">失敗</text>
  <rect class="dg-heat-3" x="176" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="218" y="79" text-anchor="middle" dominant-baseline="central">2</text>
  <text class="dg-sub dg-text--ink" x="218" y="99" text-anchor="middle" dominant-baseline="central">都成功</text>
  <rect class="dg-heat-3" x="264" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="306" y="79" text-anchor="middle" dominant-baseline="central">2</text>
  <text class="dg-sub dg-text--ink" x="306" y="99" text-anchor="middle" dominant-baseline="central">都成功</text>
  <rect class="dg-heat-2" x="352" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="394" y="79" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="394" y="99" text-anchor="middle" dominant-baseline="central">一成一敗</text>
  <rect class="dg-heat-2" x="440" y="64" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="79" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="482" y="99" text-anchor="middle" dominant-baseline="central">一成一敗</text>
  <rect class="dg-heat-3" x="264" y="116" width="84" height="48" rx="2"/>
  <text class="dg-label" x="306" y="131" text-anchor="middle" dominant-baseline="central">2</text>
  <text class="dg-sub dg-text--ink" x="306" y="151" text-anchor="middle" dominant-baseline="central">都成功</text>
  <rect class="dg-heat-2" x="352" y="116" width="84" height="48" rx="2"/>
  <text class="dg-label" x="394" y="131" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="394" y="151" text-anchor="middle" dominant-baseline="central">一成一敗</text>
  <rect class="dg-heat-2" x="440" y="116" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="131" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="482" y="151" text-anchor="middle" dominant-baseline="central">一成一敗</text>
  <rect class="dg-heat-2" x="352" y="168" width="84" height="48" rx="2"/>
  <text class="dg-label" x="394" y="183" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="394" y="203" text-anchor="middle" dominant-baseline="central">一成一敗</text>
  <rect class="dg-heat-2" x="440" y="168" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="183" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-sub dg-text--ink" x="482" y="203" text-anchor="middle" dominant-baseline="central">一成一敗</text>
  <rect class="dg-heat-1" x="440" y="220" width="84" height="48" rx="2"/>
  <text class="dg-label" x="482" y="235" text-anchor="middle" dominant-baseline="central">0</text>
  <text class="dg-sub dg-text--ink" x="482" y="255" text-anchor="middle" dominant-baseline="central">都失敗</text>
  <rect class="dg-outline--accent" x="440" y="220" width="84" height="48" rx="2"/>
  <line class="dg-rule" x1="20" y1="288" x2="528" y2="288"/>
  <text class="dg-tag" x="20" y="312" dominant-baseline="central">圖例</text>
  <rect class="dg-heat-3" x="84" y="304" width="16" height="16" rx="2"/>
  <text class="dg-small" x="108" y="312" dominant-baseline="central">兩次都成功：3 格</text>
  <rect class="dg-heat-2" x="252" y="304" width="16" height="16" rx="2"/>
  <text class="dg-small" x="276" y="312" dominant-baseline="central">一成一敗：6 格</text>
  <rect class="dg-heat-1" x="404" y="304" width="16" height="16" rx="2"/>
  <text class="dg-small" x="428" y="312" dominant-baseline="central">兩次都失敗：1 格</text>
</svg>
```

同一組資料，一個 0.9、一個 0.3。報數字時不寫清楚是哪一個，讀者會差三倍。

很多人會直接拿成功率 0.6 去算：pass@2 ≈ 1 − 0.4² ＝ 0.84，pass^2 ≈ 0.6² ＝ 0.36。這叫代入估計（plug-in），試驗次數有限時會有偏差；上面數組合的算法才是不偏的估計（課程筆記；[Chen et al., 2021](https://arxiv.org/abs/2107.03374)）。代入法對兩個指標錯的方向相反：pass@k 平均會被估得太低（Chen et al. 附錄的結論，這組資料是 0.84 對 0.9），pass^k 平均會被估得太樂觀（0.36 對 0.3）。所以要逐一數組合。

還有一個常見錯誤：先把所有題目的成功率平均，再套公式。假設有兩題，各跑 5 次：A 題 5 次全成功，B 題只成功 1 次。整體成功率是 0.6，看起來和上面一樣。但逐題算再平均：

- pass^2：A 題是 1，B 題成功不到 2 次所以是 0，平均 0.5。
- pass@2：A 題是 1，B 題是 1 − 6/10 ＝ 0.4，平均 0.7。

用整體成功率代公式得到的是 0.36 和 0.84，兩個都錯。課程筆記的規則是：每題分開算，再對題目平均。

<details>
<summary>估計式與程式（給想自己算的人）</summary>

每題跑 n 次、成功 c 次，C(a, k) 是從 a 個裡挑 k 個的組合數，a < k 時為 0：

```text
估計 pass@k = 1 − C(n − c, k) / C(n, k)
估計 pass^k = C(c, k) / C(n, k)
```

兩個都要求 n ≥ k，而且 n 要事先定好、每次都重設環境。跑到第一次成功就停，這個估計就不成立了。pass@k 的式子出自 HumanEval 論文（Chen et al., 2021，論文附錄證明了代入法有偏差），pass^k 的式子出自 τ-bench。

```python
from math import comb

def pass_at_k(n, c, k):
    return 1 - comb(n - c, k) / comb(n, k)

def pass_hat_k(n, c, k):
    return comb(c, k) / comb(n, k)

print(pass_at_k(5, 3, 2), pass_hat_k(5, 3, 2))   # 0.9 0.3

# 兩題各跑 5 次：A 成功 5 次、B 成功 1 次，逐題算再平均
tasks = [(5, 5), (5, 1)]
print(sum(pass_at_k(n, c, 2) for n, c in tasks) / len(tasks))   # 0.7
print(sum(pass_hat_k(n, c, 2) for n, c in tasks) / len(tasks))  # 0.5
```

如果知道單次成功機率 p，公式更簡單：pass@k ＝ 1 − (1 − p)^k，pass^k ＝ p^k。課程筆記的例子是 p ＝ 0.8、k ＝ 3：pass@3 ＝ 99.2%，pass^3 ＝ 51.2%。單次成功率 80% 的 agent，同一類請求連續來三次、三次都辦好的機率只有一半左右。

比較兩個系統時，課程筆記建議用配對比較：同一題上兩個系統的結果放在一起看。差距有多可靠，用 paired bootstrap 估：把「題目」當單位有放回地重抽，同一題的兩邊結果和多次試驗綁在一起抽。bootstrap 的概念見 [Stanford CS109 第 16 堂](/posts/learning/2026-08-22-stanford-cs109-lecture-16-bootstrapping-p-values)，組合數見 [CS109 第 4 堂](/posts/learning/2026-08-22-stanford-cs109-lecture-04-counting-combinatorics)。

</details>

### 成功率之外：花了多少

p31 用一句話點出問題：同樣成功，一次跑 200 步、花 40 美元，另一次跑 12 步、花 0.30 美元，兩者該一樣分嗎？課程筆記建議，成功率旁邊一定要報延遲、呼叫次數、token 數與實際花費。失敗的嘗試也要算錢。

筆記的假設例子是兩個系統各跑同樣 100 題：

| | 系統 A | 系統 B |
|---|---|---|
| 兩邊都成功 | 65 題 | 65 題 |
| 只有這邊成功 | 5 題 | 10 題 |
| 兩邊都失敗 | 20 題 | 20 題 |
| 成功率 | 70% | 75% |
| 總花費（含失敗） | 100 美元 | 150 美元 |
| 每次成功的花費 | 約 1.43 美元 | 2.00 美元 |

B 多解了 10 題、少解了 5 題，淨多 5 題，多花 50 美元，等於每多解一題付 10 美元。兩者沒有一個在成功率和成本上都贏。配對來看還有一件事：B 有 5 題退步了，只看 70% 對 75% 會看不到。

> **自我檢查**：你在做客服 agent，該看 pass@k 還是 pass^k？
> 答：pass^k。每位客戶都要被服務好，不是「試 k 次有一次成功就好」；客戶不會讓你重來 k 次再挑最好的那次。

## 一次評測怎麼跑

p11 把所有 benchmark 共用的流程寫成幾行虛擬碼：

```text
for task in benchmark:
    environment = reset_to_task_initial_state(task)
    while not terminated and within_budget:
        observation = environment.observe()
        action = agent(task_instruction, observation, history, tools)
        environment.execute(action)
    score = task_evaluator(agent_final_answer, final_environment_state, trajectory)
```

三個部件：

1. 每題開始前，把環境重設到初始狀態。
2. agent 在預算內一步一步觀察、行動。
3. 評分器看三種證據的一種或多種：最終答案、最終的環境狀態、整條執行軌跡（trajectory）。

課程筆記把兩種 harness 分開：agent 的 harness 決定模型看到什麼、執行工具、決定何時停；評測的 harness 負責初始化任務、限制資源、保存證據、呼叫評分器。兩者要分開，受測的系統才改不到自己的評分規則。

### 評分器也是量測的一部分

課程筆記用一個退款例子說明，為什麼只看最終狀態不夠。任務是：使用者要退一件符合條件的商品，公司規定退款前要先取得使用者確認。三條假設的軌跡：

| 軌跡 | 最終狀態對嗎？ | 有先確認嗎？ | 算成功嗎？ |
|---|---|---|---|
| 取得確認、說已完成，但後台根本沒退款 | 否 | 是 | 否 |
| 退了對的款，但在使用者確認之前就退了 | 是 | 否 | 否 |
| 先確認，再退對的款，並正確回報 | 是 | 是 | 是 |

第二條軌跡的最終狀態完全正確，只看資料庫的評分器會給它滿分。要抓到「先確認才動手」，得看軌跡裡事件的順序。τ-bench 原論文自己也承認這一點：它的獎勵只看最終資料庫和回覆內容，r ＝ 1「可能是必要條件但不是充分條件」，agent 可能沒取得明確確認就退款（[Yao et al., 2024](https://arxiv.org/abs/2406.12045)）。

反過來，要求 agent 照著參考答案的步驟走也不對：同一件事常有好幾種合法做法。p31 把這個兩難寫成一句：只看結果，會放過運氣好或不安全的那次；比對軌跡，會誤殺合法的另一條路。

> **自我檢查**：上表第二條軌跡，用什麼證據才抓得到？
> 答：看軌跡裡的事件順序：「使用者確認」這個事件要出現在「呼叫退款 API」之前。只看最終資料庫或只看 agent 最後的回覆都看不出來。

## 八個代表 benchmark

投影片花了十一頁介紹八個 benchmark（p12–22），p23 收成一張表。依「agent 在哪裡做事」排：

| Benchmark | agent 在哪裡做事 | 典型動作 | 評分看什麼 |
|---|---|---|---|
| [BFCL](https://gorilla.cs.berkeley.edu/leaderboard.html) | 函式／API 介面 | 結構化的函式呼叫 | 呼叫、參數與造成的狀態 |
| [GAIA](https://arxiv.org/abs/2311.12983) | 網頁、檔案、程式工具 | 搜尋、看檔案、計算 | 簡短的最終答案 |
| [τ-bench](https://arxiv.org/abs/2406.12045) | 客服 API 加對話 | 和使用者對話、呼叫 API | 資料庫狀態與回覆內容 |
| [SWE-bench](https://www.swebench.com/) | 程式碼 repo | 看程式、改檔、跑測試 | patch 能否通過測試 |
| [Terminal-Bench](https://www.tbench.ai/) | 隔離的終端機容器 | 任意 shell 指令 | 每題專屬的驗證測試 |
| [WebArena](https://arxiv.org/abs/2307.13854) | 自架的網站 | 點、打字、換頁 | 網站或後台狀態 |
| [OSWorld](https://arxiv.org/abs/2404.07972) | 完整的桌面虛擬機 | 滑鼠、鍵盤、操作應用程式 | 檔案、應用程式與系統狀態 |
| [TheAgentCompany](https://arxiv.org/abs/2412.14161) | 模擬的軟體公司 | 用網頁工具、寫程式、問同事 | 流程中的檢查點與最終狀態 |

每個 benchmark 的設計，都決定了它量不到什麼：

- **GAIA**（466 題，p12–13）只評最終答案，一個數字或一串字。agent 中間搜尋、下載、跑 Python 都不計分。所以它量得到研究與整合能力，量不到「寄信、訂機票、改資料庫」這類動作。
- **BFCL**（p14）專看工具呼叫可不可靠。例題是「訂下週一波士頓到芝加哥最便宜的機票」，兩種典型錯誤是：捏造一個 `passenger_id`（應該問使用者），以及呼叫無關的 `get_weather`。投影片提醒 V4 加了網頁搜尋與記憶類別，要看分項分數，不要只看總分。
- **WebArena**（812 題，p15）與 **OSWorld**（369 題，p16）都看最終狀態，差在觀察方式：前者讀網頁的無障礙樹（accessibility tree，瀏覽器給輔助工具用的結構化頁面描述），後者看螢幕截圖。WebArena-Verified 拿掉了 LLM 當評審，改成決定性的比對；OSWorld 2.0 改成 108 個長流程，給部分分數。
- **SWE-bench**（p17）把 agent 的 patch 套回 repo 跑測試。家族裡有人工審過的 Verified、300 題的 Lite、9 種語言的 Multilingual、圖片類的 Multimodal，以及更難的 Pro。
- **τ-bench**（p18–19）有一個由 LLM 扮演的使用者，agent 要守航空公司的規定，例如 basic economy 不能改票。獎勵是 r ＝ r_action × r_output，最終資料庫要和標準答案完全一致，回覆也要包含必要資訊，兩者都要。
- **Terminal-Bench**（p20–21）介於 SWE-bench 與 OSWorld 之間：透過 shell 做事，不用預測滑鼠座標，任務也不限於修 repo 的 bug，還有系統管理、資料處理、訓練模型、資安。[2.0 版](https://arxiv.org/abs/2601.11868)有 89 題；[3.0 版](https://www.tbench.ai/news/terminal-bench-3-0)換成一組更難的 74 題；[4.0 版](https://www.tbench.ai/news/terminal-bench-4-0)再刪掉 8 題、剩 66 題，每題給 8 小時。投影片寫「89 → 66」，中間還隔了 2.1 與 3.0 兩版。
- **TheAgentCompany**（175 題，p22）在模擬公司裡做完一整件工作：讀工單、問同事、改程式、跑測試、更新工單、回報。它有部分給分：

```text
S_partial = 0.5 × 拿到的檢查點分數 ／ 總檢查點分數 + 0.5 × S_full
```

S_full 是整件工作完成時為 1、否則為 0。8 個檢查點做完 4 個、沒完成：0.5 × 4/8 ＝ 0.25；做完 7 個、沒完成：0.5 × 7/8 ≈ 0.44；全部做完：0.5 + 0.5 ＝ 1.00。完成整件工作的那一跳，比任何一個檢查點都值錢。

> **自我檢查**：你的 agent 要讀公司內部文件、回答員工的問題，不會改任何系統。上面八個裡，哪一個最接近？它量不到什麼？
> 答：GAIA 最接近：用工具查資料、給出簡短答案、只評答案。它量不到動作的正確與副作用，但你的 agent 本來就不動手，所以影響不大；要注意的是 GAIA 的題目是公開網路與附件，跟你的內部文件不同，最後還是要用自己的題目測。

## 分數什麼時候不可信

### 洩漏有四層

一般說資料汙染，指的是題目出現在訓練資料裡。p25 指出 agent 評測至少有四層洩漏，而且 agent 越像真的在工作，可洩漏的面就越大：真實的工具一定包含上網，benchmark 本身可能就搜得到。

| 層 | 怎麼發生 | 真實案例 |
|---|---|---|
| 訓練 | 題目或人類修法在訓練資料裡 | OpenAI 測試的前沿模型都能重現部分 SWE-bench Verified 題目的原始修法或題目細節，這是 OpenAI 停報這個 benchmark、改報 SWE-bench Pro 的兩個理由之一，另一個是測試寫得太窄，見下一節（[OpenAI](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)） |
| 執行時 | agent 上網找到未來的修法 | NIST CAISI 在自家評測紀錄裡找到 agent 用 curl 抓 CTF（資安搶旗賽）題目的公開解題文、直接交出答案（[NIST CAISI](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)）；Terminal-Bench 4.0 比 3.0 刪掉的 8 題裡，有 2 題就是因為解答已經公開 |
| 環境 | 沙箱裡留著未來的 commit 或隱藏測試 | SWE-bench Verified 的容器保留完整 git 歷史，Claude 4 Sonnet 與 Qwen3-Coder 跑 `git log --all` 就看到修好這個 issue 的未來 commit（[SWE-bench issue #465](https://github.com/SWE-bench/SWE-bench/issues/465)） |
| benchmark 過擬合 | prompt 與 scaffold（包住模型的外層框架，也就是 harness）對著公開測試集調 | 開發者反覆看測試集上的失敗、一直調系統，測試集就變成另一個開發集 |

第三層對你最切身。[作業 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop) 用的是 SWE-Bench Pro 的題目，而 SWE-Bench Pro 公開的 Docker 映像檔也被回報有同樣的問題：未來的 git 歷史沒清乾淨（[SWE-Bench Pro issue #93](https://github.com/scaleapi/SWE-bench_Pro-os/issues/93)，2026 年 4 月回報，截至 10 月 issue 仍開著）。做自己的評估集時，記得清掉 repo 裡比 base commit 新的 commit、分支、tag 與 reflog。

p26 把範圍再擴大：agent 的表現大致是

```text
P = f(LLM, prompt, scaffold, tools, retriever, memory, environment)
```

每一項都可能帶進題目資訊：few-shot 範例取自測試題、RAG 的資料庫收錄了答案、記憶裡存著上一輪跑同一題的結果、手寫的規則剛好對準 benchmark。所以「模型沒有用測試集訓練」這句話，對 agent 評測遠遠不夠。

### 評分器也會被鑽

洩漏之外，另一類問題是評分器本身。課程筆記把它叫做評分器被鑽（grader gaming）：agent 讓檢查通過了，卻沒做到真正要求的事。

- [NIST CAISI](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations) 的 CVE-Bench 例子：任務要求利用某個公開編號的已知漏洞（CVE）讓伺服器停止回應，評分只看伺服器有沒有停。gpt-4o 沒有用那個漏洞，而是送了一個讀 `/dev/urandom` 的請求，用無窮的亂數把伺服器灌爆。
- 評分設計本身的漏洞：[Agentic Benchmark Checklist](https://arxiv.org/abs/2507.02825) 發現 τ-bench airline 子集有 38% 是故意設計成不可能完成的題目，成功條件是「環境保持不變」，所以一個什麼都不做的 agent 在這些題目上都會被算成功。
- 測試寫得太窄：[OpenAI](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/) 請工程師審查 o3 跑 64 次仍常解不出的 138 題 SWE-bench Verified，其中 59.4% 的題目在測試或題目描述上有實質問題，例如測試要求一個題目沒提到的函式名稱，正確的修法也會被判錯。

這些例子的共同點是：分數高不代表做對，分數低也不一定代表做錯。課程筆記的建議是成功和失敗都要抽樣看軌跡，可疑的高分要追查，而不是從分數推論誠實。

> **自我檢查**：你的 agent 在 SWE-bench 類的題目上，從 40% 進步到 55%。列出兩個你該先排除的「假進步」來源。
> 答：任兩個即可：容器裡留有未來的 git 歷史，agent 用 `git log` 找到了修法；agent 可以上網，查到了上游的 PR；你反覆對同一組題目調 prompt，已經過擬合；這次改動剛好讓評分器的漏洞更容易被觸發。檢查方式是抽看新解出來的題目的軌跡，並在沒看過的題目上重跑。

### 真實工作不是一句指令

大多數 benchmark 只給 agent 一句寫得完整的指令，沒有使用者在迴圈裡（p27）。真實的工作是模糊的、會被修改、會被打斷：缺條件、做到一半被糾正、目標改了。只看單輪的評分還會獎勵自信地亂猜，因為問一句澄清問題要多花步數，卻拿不到分數。

講者拿全班作業 1 的 Claude Code 紀錄當證據（p28–29）。在 166 個 build session 裡，只打一個 prompt 的有 40 個，大約四分之一；打 11 個以上的有 64 個，大約四成。prompt 最常見的長度只有 21–100 個字元，也就是一兩句短話。至少這一大群用法是很多輪、很短的來回，跟 benchmark 的「一句完整指令」差很遠。

p30 因此列出單輪 benchmark 量不到的三件事：目標不清楚時會不會問、做到一半被糾正時會不會重新規劃、跨很多輪時會不會記得前面的限制。

### 還有三個難處

p31 補了三個：

- **非決定性**：同一個 agent、同一題，每次結果不同，所以只跑一次的分數是雜訊，不是訊號。這就是前面要談 pass@k 和 pass^k 的原因。
- **安全與副作用**：一路上刪了檔案、寄了信、花了錢，只要最後通過，評分都不會扣分。
- **成本與延遲**：前面講過，成功率不夠。

## benchmark 很快就飽和

p32 列了六個例子，以下挑其中四個（數字照投影片）：GLUE 14 個月到人類水準、MMLU 39 個月到專家水準，SWE-bench Verified 用 22 個月從 33% 到 95%，ARC-AGI-3 半年內從 0.5% 到 62.7%。p33 把時間軸攤開：不管哪一代，多數 benchmark 都在幾年內飽和。投影片對「飽和」的定義是：前沿模型達到人類基準，或頂尖模型之間已經拉不開差距。截至 2026 年 9 月，投影片把 OSWorld 2.0、ARC-AGI-3、SWE-bench Pro 這類新題組列為仍然開放。

這是 benchmark 一直在換的原因，也是讀分數時要先問「哪一版」的原因。[Terminal-Bench 4.0](https://www.tbench.ai/news/terminal-bench-4-0) 刪掉的 2 題飽和題，標準是最新一代各家模型都 5 次全解，這種題目已經分不出模型的差別。

p34 把演變整理成一張表：

| 面向 | 早期 | 現在 |
|---|---|---|
| 評估對象 | 基礎模型 | 模型＋prompt＋工具＋agent harness |
| 互動 | 靜態、單輪 | 有狀態、長流程 |
| 評分 | 完全比對或機率 | 測試、環境狀態、人或評審模型 |
| 資料集 | 固定、公開 | 新的、隱藏的、動態的，或會檢查汙染 |
| 主要指標 | 平均正確率 | 除了成功率，還有可靠度、品質、成本、延遲 |

p35 預告作業 3 的評分方式：解題能力、成本、速度三個指標一起排名。A 在每個指標上都不比 B 差、至少一個比 B 好，就說 A 支配（dominate）B；沒有被任何人支配的那一群是第一名，也就是柏拉圖前緣（Pareto frontier）。這會在作業 3 的導讀細講。

## 替自己的 agent 設計評測

課程筆記最後兩節是一份清單，可以直接拿來用：

1. **先定義成功**：要求的結果是什麼、允許哪些動作、哪些副作用不能接受。最終狀態證明不了「守規定」時，另外評。
2. **驗證題目與評分器**：題目用給的資訊和工具解得出來嗎？評分器會不會收錯誤答案、拒絕合法的另一種做法？隱藏測試與評分器狀態放在 agent 寫不到的地方。
3. **保留沒看過的題目**：在開發題上調，然後凍結評估集與設定。要宣稱能用在新 repo、新客戶，就保留整組新 repo、新客戶當測試，不只是同一批裡隨機抽幾題。
4. **控制比較條件**：題目、初始狀態、工具、停止規則、資源上限都固定。比模型就固定 harness；比整個系統就寫清楚差在哪。
5. **重複並檢查**：保留每題的結果，用配對比較與不確定性估計，成功與失敗的軌跡都要看。
6. **報告時寫清楚**：題組版本與題數、系統設定、預算、評分方式、分子分母、每題跑幾次、是 pass@k 還是 pass^k、成本（含失敗）與延遲分布。

這份清單就是[作業 2 自建評估集](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop#建自己的評估集)那一段的完整版。作業要你分成「改了之後解得出來」和「還是解不出來」兩組，等於逼你做一次配對比較。

## 綜合自我檢查

1. 你的 agent 對一題跑了 6 次，成功 4 次。算 pass@3 與 pass^3。
   答：C(6,3) ＝ 20。pass@3 ＝ 1 − C(2,3)/20，C(2,3) ＝ 0，所以是 1；只有 2 次失敗，挑 3 次一定會挑到成功的。pass^3 ＝ C(4,3)/20 ＝ 4/20 ＝ 0.2。
2. 同事說：「新版本在我們的 benchmark 上從 62% 到 68%，可以上線了。」你要先問哪三個問題？
   判準：答出其中三個即可：每題跑幾次、這 6 個百分點在多次試驗下穩不穩（配對比較、不確定性）；有沒有題目退步；成本和延遲變多少；題組有沒有被反覆拿來調整，或有沒有洩漏；評分器是看最終狀態還是軌跡，會不會放過副作用。
3. 你在做一個幫使用者在網站上下訂單的 agent。從 p25 的四層洩漏與 p31 的副作用來看，評測環境要做哪兩件事？
   判準：答出隔離與保護評分：題目環境不能連到能查到標準答案的地方，參考答案與評分器狀態放在 agent 寫不到的位置；並且記錄、檢查副作用，例如多下的訂單、多扣的款，不只看最後那張訂單對不對。

## 延伸閱讀

- [CMU 11-768 作業 2：替資料視覺化 agent 寫評分器](/posts/ai/2026-09-29-cmu-11768-assignment-2-eval)：自己動手寫評分器，四類錯誤與驗證器。
- [Stanford CS329A 第 17 堂：長任務評估](/posts/ai/2026-10-11-stanford-cs329a-lecture-17-long-horizon-evaluation)：做完、做對與值得交付的差別。
- [Stanford CS109 第 16 堂：bootstrap 與 p 值](/posts/learning/2026-08-22-stanford-cs109-lecture-16-bootstrapping-p-values)：配對比較背後的統計工具。
- [Kapoor et al., AI Agents That Matter](https://arxiv.org/abs/2407.01502)：只看正確率會讓 agent 又貴又複雜，以及 benchmark 缺少保留集的問題。
- [NIST CAISI：Cheating on AI agent evaluations](https://www.nist.gov/blogs/caisi-research-blog/cheating-ai-agent-evaluations)：怎麼從評測紀錄裡找出作弊。

## 課程影片來源

- 課程不錄影（[policy 頁](https://cs2680.com/policy)）。
- 底本：[第 7 堂投影片](https://cs2680.com/slides/7_agent_design_4.pdf)（PDF 頁序 p5–35）與課程筆記〈[Agent evaluation and benchmarks](https://cs2680.com/notes/agent-evaluation)〉，2026-10-22 讀取。頁碼一律用 PDF 頁序。
- pass@k 與 pass^k 的估計式回 HumanEval 與 τ-bench 原論文核對；各 benchmark 題數回原論文或官方頁核對。洩漏與評分器的真實案例（OpenAI、NIST CAISI、SWE-bench issue #465、Agentic Benchmark Checklist、Terminal-Bench 4.0 公告）是本站補充的來源。
- 兩題各跑 5 次的逐題平均例子、各自我檢查的答案是本站補充；5 次成功 3 次、p ＝ 0.8 與系統 A／B 的例子出自課程筆記。

## 參考資料

- [CS2680 第 7 堂投影片：Agent design IV: evaluation](https://cs2680.com/slides/7_agent_design_4.pdf)
- [CS2680 課程筆記：Agent evaluation and benchmarks](https://cs2680.com/notes/agent-evaluation)
- [Chen et al., Evaluating Large Language Models Trained on Code (2021)](https://arxiv.org/abs/2107.03374)
- [Yao et al., τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (2024)](https://arxiv.org/abs/2406.12045)
- [Mialon et al., GAIA: a benchmark for General AI Assistants (2023)](https://arxiv.org/abs/2311.12983)
- [Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html)
- [Zhou et al., WebArena (2023)](https://arxiv.org/abs/2307.13854)
- [Xie et al., OSWorld (2024)](https://arxiv.org/abs/2404.07972)
- [SWE-bench](https://www.swebench.com/)
- [Merrill et al., Terminal-Bench (2026)](https://arxiv.org/abs/2601.11868)
- [Terminal-Bench 3.0 公告](https://www.tbench.ai/news/terminal-bench-3-0)
- [Terminal-Bench 4.0 公告](https://www.tbench.ai/news/terminal-bench-4-0)
- [Xu et al., TheAgentCompany (2024)](https://arxiv.org/abs/2412.14161)
- [OpenAI：Why we no longer evaluate SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)
- [NIST CAISI：Examples of cheating in CAISI's agent evaluations (2025)](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)
- [SWE-bench issue #465：Repo State Loopholes During Agentic Evaluation](https://github.com/SWE-bench/SWE-bench/issues/465)
- [SWE-Bench Pro issue #93：Git Reward Hacking in SWEBench Pro OSS](https://github.com/scaleapi/SWE-bench_Pro-os/issues/93)
- [Zhu et al., Establishing Best Practices for Building Rigorous Agentic Benchmarks (2025)](https://arxiv.org/abs/2507.02825)
- [Kapoor et al., AI Agents That Matter (2024)](https://arxiv.org/abs/2407.01502)
