---
title: "CS234 作業一：有效視野、reward hacking、Bellman residual 與 RiverSwim"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, homework, mdp]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 3
tldr: "CS234 Winter 2026 的作業一共 68 分、四題：庫存 MDP 看視野與折扣怎麼改變最佳策略（8）、自駕車的 proxy reward 為什麼讓 AI 車乾脆不上匝道（5）、用 Bellman residual 界住貪婪策略的表現（30），以及在 RiverSwim 上親手寫 value iteration 與 policy iteration（25）。三題紙筆在練同一件事：你寫下的 reward、γ 與價值函數，不一定是你以為的那個目標。"
description: "Stanford CS234（Winter 2026）作業一導讀：Q1 有效視野、Q2 reward hacking、Q3 Bellman residual 與策略表現下界、Q4 RiverSwim 的 VI／PI 實作，含配分、繳交方式、code.zip 檔案清單與 RiverSwim 環境參數。只講題目在練什麼，不提供解答。"
draft: false
glossary:
  - term: "Bellman residual"
    aliases: ["Bellman 殘差", "Bellman error magnitude"]
    definition: "對任意價值向量 V 做一次 Bellman backup 後跟原本的差 BV − V；它的無窮範數 ‖BV − V‖ 叫 Bellman error magnitude。"
    context: "作業一 Q3 用它來界住「從 V 取出的貪婪策略」離最佳策略多遠。"
  - term: "reward hacking"
    aliases: ["獎勵駭客", "proxy reward"]
    definition: "代理人把寫下來的 reward（常是容易量的代理指標）最佳化得很好，行為卻偏離設計者真正想要的結果。"
    context: "作業一 Q2 用 Pan、Bhatia、Steinhardt（ICLR 2022）的交通匯流例子。"
    links:
      - label: "Pan, Bhatia & Steinhardt (ICLR 2022)"
        url: "https://openreview.net/pdf?id=JYtwGwIL7ye"
  - term: "RiverSwim"
    definition: "Strehl & Littman（2008）提出的小型 MDP：一排狀態像一條河，往下游（LEFT）一定成功但獎勵很小，往上游（RIGHT）常被水流推回，最上游才有大獎勵。常用來測探索與折扣的影響。"
    context: "作業一 Q4 用 6 個狀態、三種水流強度的修改版。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en)

> **版本說明**：本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 的作業與投影片；公開錄影是 [Spring 2024 版](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)。所有事實都在 2026-09-30 打開 [作業頁](https://web.stanford.edu/class/cs234/assignments.html)、[A1 題目 PDF](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf)（7 頁）與 [code.zip](https://web.stanford.edu/class/cs234/assignments/a1/code.zip) 核對。存取等級 **A3**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：題目、LaTeX 範本與起始碼都公開；拿不到的是 Gradescope 自動評分、隱藏測資與官方解答。

**系列位置**：上一篇 [有模型時怎麼規劃：policy evaluation、PI、VI](/posts/ai/2026-09-30-cs234-mdp-planning)｜下一篇 [沒模型時怎麼評估：MC、TD(0)、certainty equivalence](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

上一篇講完已知模型時的規劃：policy evaluation、policy iteration、value iteration，以及 Bellman backup 為什麼是 contraction。作業一把這些東西拆成四題，逼你從兩個方向碰它：一邊用紙筆證明 Bellman operator 的性質，一邊在一個小環境上親手寫出 VI 與 PI。

依 2026 課表，作業一在 Week 1 發下，**1 月 16 日下午 6 點（PST）截止**，也就是跟 L3「Policy Evaluation」、L4「Q-learning and function approximation」同一週。所以校內學生是一邊學 model-free 方法、一邊交這份 model-based 作業。

本文只講每題在練什麼、需要哪些前一講的工具、做的時候容易卡在哪。**不提供任何題目的解答。**

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

## 繳交方式與配分

作業分三份交到 Gradescope：

1. 紙筆部分的 PDF（用官方 [LaTeX 範本](https://web.stanford.edu/class/cs234/assignments/a1/assignment1_template.zip) 排版）
2. 同一份的原始 `.tex` 檔
3. 程式部分：在 `code/` 目錄跑 `make clean` 再跑 `make submit`，產生 `assignment1.zip`

| 題目 | 主題 | 配分 | 形式 |
|---|---|---|---|
| Q1 | Effect of Effective Horizon | 8 | 紙筆，四小題各 2 分 |
| Q2 | Reward Hacking | 5 | 紙筆，2＋3 分 |
| Q3 | Bellman Residuals and performance bounds | 30 | 紙筆證明，(a)–(i) 計分，(j)(k) 是不計分的挑戰題 |
| Q4 | RiverSwim MDP | 25 | 程式 20 分＋紙筆 5 分 |

合計 68 分。官網的成績比重分兩套：校內學生作業一佔 7%（另有佔 24% 的必修 tutorials），校外學生沒有 tutorials，作業一佔 15%。

## Q1：同一個 MDP，視野一改，最佳策略就變

題目是一家店的庫存管理。狀態是庫存量 s（0 到 10），動作只有 sell 與 buy：

- 賣：s > 0 時得 +1、庫存減一；s = 0 時什麼都不發生
- 買：不得獎勵、庫存加一；從 9 買到 10 那一步得 **+100**
- s = 10 是終止狀態；每天從 s = 3 開始

題目先給一個 H = 4 的例子：連賣三次拿 +3，第四步不管做什麼都是 0。四個小題接著問：

- (a) 從 s = 3 出發，有沒有某個有限視野 H 會讓最佳策略**又買又賣**？
- (b) 在無限視野、有折扣的設定下，有沒有某個 γ ∈ [0, 1) 讓最佳策略**永遠不補滿**庫存？只要說明推理，不用給數值。
- (c) 無限視野＋折扣 γ 的版本，跟有限視野 H、不折扣的版本，有沒有可能最佳策略相同？有的話要給一組具體的 γ 與 H。
- (d) 延續 (c)：是不是**每一個** H 都找得到對應的 γ？用一兩句話說明。

這題在練的是上一篇的一個結論：reward 與 dynamics 完全一樣，γ 或 H 不同，最佳策略就可能完全不同。+1 是每步都拿得到的小獎勵，+100 要先忍六步沒獎勵才拿得到。你可以把 H 或 γ 看成「代理人願意等多久」，再去想這兩種「等待」的形狀是否一樣。

做 (c)(d) 前，先回去看 [L2 投影片](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf) 的兩句話：無限視野折扣 MDP 的最佳策略是 stationary（不隨時間步改變）；而 finite horizon 任務的最佳策略是否 stationary，投影片的答案是「In general no」。最佳策略能不能跟**剩幾步**有關，是想「兩種設定能不能一一對應」的起點。

## Q2：proxy reward 讓 AI 車乾脆不上匝道

題目直接接著 Q1 的結論：視野與折扣的選擇就可能讓策略偏離人的本意，這種現象叫 reward hacking。例子取自 [Pan、Bhatia、Steinhardt 的 ICLR 2022 論文](https://openreview.net/pdf?id=JYtwGwIL7ye)：

- 真正的目標是讓所有車（人開的與 AI 開的）平均通勤時間最短，但這很難寫成 reward
- 所以改用容易量的 **proxy**：最大化所有車的平均速度
- 場景是一輛 AI 車在匝道口，高速公路上有很多人開的車
- 在這個 proxy 下，AI 車的最佳策略是**停著不併入**

(a) 要你解釋為什麼不併入是最佳解（2 分）；(b) 要你提出替代的 reward（不是直接最小化通勤時間），它仍然好最佳化，但不會讓 AI 車永遠不併入。這題寫 2 到 5 句、可以用式子，題目明說沒有唯一答案，合理就給滿分（3 分）。

想 (a) 時，把「平均」這個字拆開看：分母裡有誰、AI 車停著時分母與分子各自怎麼變。題目的註腳還補了一句：原論文發現，函數表示比較簡單的系統在這個例子裡反而比較不會 reward hack。這個觀察之後在系列的 [價值對齊](/posts/ai/2026-09-30-cs234-value-alignment-ethics) 一篇會再碰到。

## Q3：從 Bellman residual 界住貪婪策略的表現

這是整份作業的重心，30 分，也是整門課前半段最密的一題證明。題目先強調一個區別：

- **V** 是任意一個 |S| 維向量，不一定是哪個策略真的做得到的價值。題目舉例：一個只有負獎勵的 2 狀態 MDP，V = [1, 1] 可以當 V，但不可能是任何 V^π。
- **V^π** 是某個策略 π 在這個 MDP 裡實際達到的價值。

範數一律是無窮範數 ‖v‖ = max_s |v(s)|。題目給兩個 operator：最佳化的 B（對動作取 max）與固定策略的 B^π，並提醒課堂上已經證過 ‖BV − BV′‖ ≤ γ‖V − V′‖。

小題可以分成三段看。

**第一段：B^π 的基本性質（9 分）**

| 小題 | 要證的事 | 分數 |
|---|---|---|
| (a) | B^π 也是 γ-contraction | 3 |
| (b) | B^π 的 fixed point 唯一（可以假設存在；提示用反證法） | 3 |
| (c) | 單調性：V ≤ V′ 逐元素成立，則 B^π V ≤ B^π V′ | 3 |

(a) 可以照著課堂上 B 的證明走一次，而且固定策略版本其實更簡單，因為少了 max。(b)(c) 是後面所有不等式的地基。

**第二段：Bellman residual 與表現下界（16 分）**

題目定義 Bellman residual 為 BV − V，**Bellman error magnitude** 為 ‖BV − V‖，並從任意 V 取出貪婪策略 π(s) = argmax_a [r(s,a) + γ Σ p(s′|s,a) V(s′)]。

| 小題 | 內容 | 分數 |
|---|---|---|
| (d) | 什麼樣的 V 會讓 ‖BV − V‖ = 0？為什麼？ | 2 |
| (e) | 證明 ‖V − V^π‖ ≤ ‖V − B^π V‖ / (1 − γ) 與 ‖V − V*‖ ≤ ‖V − BV‖ / (1 − γ)；提示：插入一個零項再用三角不等式 | 5 |
| (f) | 令 ε = ‖BV − V‖、π 是 V 的貪婪策略，證明 V^π(s) ≥ V*(s) − 2ε/(1 − γ) | 5 |
| (g) | 舉一個「有 V^π 的下界會很有用」的真實應用 | 2 |
| (h) | 另一個 V′ 有相同的 ε，下界相同是否代表兩個貪婪策略的價值在每個狀態都相等？ | 2 |

(e) 是整題的槓桿，(f) 是它的第一個應用。題目在 (i) 之後附了一段直覺：每步固定拿 r 的折扣總和是 r/(1 − γ)，所以這個下界等於是說「貪婪策略平均每步比最佳策略少拿最多 2ε」。換句話說，只要演算法能把 Bellman residual 壓小，你就能保證取出的策略不會太差。

**第三段：如果 V 高估了（5 分＋挑戰題）**

(i) 加一個條件 V* ≤ V（V 在每個狀態都不低於最佳價值），要你證明下界可以收緊成 ε/(1 − γ)。提示是：為什麼對所有 π 都有 V^π ≤ V*？

(j)(k) 不計分。(j) 處理一個實際問題：V* 通常不知道，V* ≤ V 很難檢查；它要你證明只要 BV ≤ V 就足以推出 V* ≤ V，提示是歸納法與 lim B^n V。(k) 要把 (f)(i) 的界再收緊成 2γε/(1 − γ) 與 γε/(1 − γ)。

<details>
<summary>做 Q3 前先確認手上有哪些工具</summary>

- 上一篇的 value iteration contraction 證明：‖BV − BV′‖ ≤ γ‖V − V′‖ 怎麼從 max 的性質推出來
- 三角不等式在無窮範數下成立
- 「逐元素不等式」與「範數不等式」是兩件事：(c)(i)(j) 是前者，(a)(e) 是後者，混用是最常見的失誤來源
- V^π 是 B^π 的 fixed point，V* 是 B 的 fixed point
- 貪婪策略的定義本身就說明了 B^π V 與 BV 在這個 π 下的關係

</details>

## Q4：在 RiverSwim 上寫 VI 與 PI

程式題用 [Strehl & Littman（2008）](https://www.sciencedirect.com/science/article/pii/S0022000008000767) 的 RiverSwim，只需要 Python 3 與 numpy（`requirements.txt` 只有 numpy 一行）。`code.zip` 解開是：

| 檔案 | 用途 |
|---|---|
| `riverswim.py` | 環境：`RiverSwim(current, seed)`，`get_model()` 回傳 reward 表 R 與轉移張量 T |
| `vi_and_pi.py` | 要填的五個函式，`__main__` 會在 WEAK 水流、γ = 0.99 下跑 PI 與 VI |
| `Makefile`、`collect_submission.sh` | `make submit` 只把 `vi_and_pi.py` 打包成 `assignment1.zip` |
| `requirements.txt` | numpy |

### 環境長什麼樣

讀 `riverswim.py` 可以直接看到環境參數（這是題目設定，不是解答）：

- 6 個狀態、2 個動作：0 是 LEFT、1 是 RIGHT；永遠從最左邊的狀態 0 出發
- reward 是 R[s, a] 的表：只有兩格非零，最左邊往左是 **0.005**，最右邊往右是 **1**
- 往左一定成功
- 中間狀態往右：0.6 機率留在原地，**0.09 × 水流強度** 機率被推回一格，剩下的機率前進一格
- 水流強度 WEAK、MEDIUM、STRONG 分別對應 1、2、3，所以往右前進的機率依序是 0.31、0.22、0.13

這就是 RiverSwim 的張力：往左是一個幾乎零風險但很小的獎勵，往右要逆流游好幾格，才碰得到大 200 倍的獎勵。

### 四個小題

| 小題 | 內容 | 分數 |
|---|---|---|
| (a) | 實作 `bellman_backup(state, action, R, T, gamma, V)`：回傳單一 state-action 做一次 Bellman backup 的值 | 4 |
| (b) | 實作 `policy_evaluation`、`policy_improvement`、`policy_iteration`，回傳最佳價值函數與最佳策略 | 8 |
| (c) | 實作 `value_iteration` | 8 |
| (d) | 紙筆：在 WEAK 水流下，找出讓「從最左邊出發的最佳代理人**不往上游游**」的最大 γ（取到小數點後兩位），解釋為什麼合理；再對 MEDIUM、STRONG 重做，從數值與定性兩方面說明最佳價值與 γ 怎麼變 | 5 |

題目給了一組 sanity check：WEAK 水流、γ = 0.99、容差 0.001 時，最左與最右兩個狀態的價值應該是 **30.328** 與 **36.859**，VI 與 PI 的結果都要落在 0.001 之內。評分另外會用隱藏測資。

幾個實作上值得先想清楚的地方：

- `bellman_backup` 是後面三個函式共用的積木。它只處理一個 (s, a)，不做 max；max 與 argmax 留給呼叫它的地方。
- `policy_evaluation` 的簽名帶 `tol=1e-3`，意思是它要做**迭代式**評估直到變化小於容差，而不是直接解線性方程。
- `policy_iteration` 的 docstring 要求你呼叫前兩個函式；停止條件想一下：策略不再變，還是價值不再變？
- 起始碼的策略用 `np.zeros(num_states, dtype=int)` 初始化，也就是一開始全部往左。
- (d) 的「最大 γ」要用程式掃出來。這一小題其實是 Q1 在更真實環境裡的重演：γ 決定代理人願不願意為了遠方的大獎勵先付出代價。

## 自學怎麼做

1. 先確定上一篇的兩個證明你能自己重寫一次：policy improvement 的單調性，與 Bellman backup 的 contraction。Q3 幾乎每一小題都是它們的變形。
2. Q1、Q2 先做，不用太久，但把答案寫成「因為 H／γ 改變了什麼，所以策略改變了什麼」的句型。這個句型在 Q4 (d) 還會用到。
3. Q3 照 (a)→(c)、(d)→(f)、(i) 的順序做，每段做完再往下；(j)(k) 留到整份寫完有餘力再挑戰。
4. Q4 先寫 `bellman_backup`，用 sanity check 的兩個數字對 VI 與 PI，對得上再去掃 (d) 的 γ。
5. 沒有 autograder：你能自己驗的只有 sanity check 那兩個數字，以及 VI 與 PI 彼此是否一致。

今晚可以做的一件事：打開 `riverswim.py`，在紙上畫出 6 個狀態與兩個動作的箭頭，把 WEAK 水流下的每個轉移機率寫上去。畫完之後，你對 Q4 (d) 的答案大概會有一個直覺，再用程式去驗。

## 延伸閱讀

- 同一套 MDP、value iteration 與 Q-learning 在另一門課的講法：[CS221 第 7 講：MDP 與 value iteration](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration)
- 深度 RL 的完整課程路線與作業：[Berkeley CS285 Spring 2026 導讀](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表（A1 在 Week 1 發下、Week 2 截止）、成績比重、late day 規則
- [CS234 作業頁](https://web.stanford.edu/class/cs234/assignments.html) — A1 題目、LaTeX 範本與 code.zip 連結
- [CS234 Winter 2026 Assignment 1 題目 PDF](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf) — 四題的敘述、配分、繳交方式與 sanity check 數值
- [A1 code.zip](https://web.stanford.edu/class/cs234/assignments/a1/code.zip) — `riverswim.py`、`vi_and_pi.py`、Makefile、`collect_submission.sh`、`requirements.txt`
- [A1 LaTeX 範本](https://web.stanford.edu/class/cs234/assignments/a1/assignment1_template.zip) — 紙筆部分的排版範本
- [CS234 Lecture 2 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf) — Q1、Q3 用到的 Bellman backup、contraction 與 stationary 策略
- [Pan, Bhatia & Steinhardt, The Effects of Reward Misspecification (ICLR 2022)](https://openreview.net/pdf?id=JYtwGwIL7ye) — Q2 的交通匯流例子
- [Strehl & Littman, An analysis of model-based Interval Estimation for Markov Decision Processes (JCSS 2008)](https://www.sciencedirect.com/science/article/pii/S0022000008000767) — RiverSwim 的出處（題目引用）
- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — 公開錄影，第 2 支「Tabular MDP Planning」對應作業一需要的內容
