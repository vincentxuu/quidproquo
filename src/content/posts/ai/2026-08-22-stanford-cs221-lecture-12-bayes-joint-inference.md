---
title: "CS221 Lecture 12：Bayesian Networks I：從 joint distribution 到 factorization"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 13
tldr: "第 12 講用 random variables 與 factors 建 joint distribution，再以 Bayesian-network factorization 表達 conditional independence，讓 conditioning 與 marginalization 成為可執行的 probabilistic inference。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 12：官方 agenda、核心推導、實作連接與材料缺口。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-12-bayes-joint-inference-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 12**，2025-10-29 由 Percy Liang 主講。課程版本與作業以[官方網站](https://stanford-cs221.github.io/autumn2025/)為準，本講主要材料是 [bayes](https://stanford-cs221.github.io/autumn2025-lectures/?trace=bayes)。

> 材料缺口：官方講義與影片公開；Canvas 課堂互動、作業解答與隱藏測資不公開。

## TL;DR

本講把 joint distribution 從完整表格拆成 Bayesian network factorization，並用 inference、probabilistic program 與 rejection sampling 顯示表示法和計算成本的交換。

## 1. 從 model-free 到 model-based

source 先對比 model-free 與 model-based：前者直接學 action 或 utility（如 SARSA、Q-learning、TD learning），後者表示世界如何運作（如 search、value iteration、minimax）。model-based 在 transition 不變時可替換 reward；本講因此用一組變數及其機率分布表示 state。

## 2. Random variables、joint、marginalization

先用兩個 binary random variables：sunshine `S ∈ {0, 1}` 與 rain `R ∈ {0, 1}`。完整 assignment 有四種：

| `S` | `R` | 意義 |
| ---: | ---: | --- |
| 0 | 0 | 沒有陽光，也沒有下雨 |
| 0 | 1 | 沒有陽光，有下雨 |
| 1 | 0 | 有陽光，沒有下雨 |
| 1 | 1 | 有陽光，也有下雨 |

joint distribution 對每個 assignment 給機率：

~~~text
P(S = 0, R = 0) = 0.20
P(S = 0, R = 1) = 0.08
P(S = 1, R = 0) = 0.70
P(S = 1, R = 1) = 0.02
~~~

這張 joint 是 source of truth，後續的 marginal 與 conditional 都從這裡導出。

若只問 `S`，就把 `R` marginalize out，將只差在 `R` 的 assignments 加總：

~~~text
P(S = 0) = P(S = 0, R = 0) + P(S = 0, R = 1)
         = 0.20 + 0.08 = 0.28
P(S = 1) = P(S = 1, R = 0) + P(S = 1, R = 1)
         = 0.70 + 0.02 = 0.72
~~~

機率表在程式裡就是 tensor。`P_SR` 的軸是 `S × R`，因此：

~~~python
P_S = ProbTable("S", einsum(P_SR.p, "s r -> s"))
~~~

`einsum` 的 labels 明確表示保留 `s`、對 `r` 求和。

### Marginalization

### Conditioning

觀察到 `R = 1` 時，先只選相容的 entries：

~~~text
P(S = 0, R = 1) = 0.08
P(S = 1, R = 1) = 0.02
~~~

這還不是 normalized 的 `P(S | R = 1)`，要先計算 evidence probability 再除掉它：

~~~text
P(R = 1) = 0.08 + 0.02 = 0.1
P(S = 0 | R = 1) = 0.08 / 0.1 = 0.8
P(S = 1 | R = 1) = 0.02 / 0.1 = 0.2
~~~

程式用 one-hot selector `R1 = np.array([0, 1])`：

~~~python
P_SR1 = einsum(P_SR.p, R1, "s r, r -> s")
P_R1 = einsum(P_SR1.p, "s ->")
P_S_given_R1 = P_SR1.p / P_R1.p
~~~

selection、summation、division 是三個步驟；不能把尚未 normalization 的值誤稱為 conditional distribution。

## 3. Inference query：問的是哪個分布

加入 traffic `T` 與 autumn `A`，完整 joint 是 `P(S, R, T, A)`。問題是「有 traffic 且是 autumn 時，下雨的機率是多少？」：

~~~text
query    = R
evidence = [T = 1, A = 1]
answer   = P(R | T = 1, A = 1)
~~~

這很像對 database 做 SQL query：evidence 是 filter，query 是要留下的欄位，其餘變數（此例中的 `S`）要被 marginalize out。換句話說，inference 需要一份能支撐加總與條件化的 joint distribution，不是只把 input 映射成一個 label。

## 4. Alarm：用 local tables 組成 joint

第一個完整案例是 burglary `B`、earthquake `E`、alarm `A`。 `B` 與 `E` 是 independent 的 rare events，各自機率 `ε = 0.05`；任一事件發生就會讓 alarm 響。要比較：

~~~text
P(B = 1 | A = 1)
P(B = 1 | A = 1, E = 1)
~~~

來源把建模拆四步：定義 variables；用 `B → A`、`E → A` 的 directed edges 連接；為每個 node 寫 local conditional probabilities；將 local probabilities 相乘成 joint。

~~~python
p_b = ProbTable("B", [1 - epsilon, epsilon])
p_e = ProbTable("E", [1 - epsilon, epsilon])
p_a_given_be = ProbTable(
    "A | B E",
    lambda b, e, a: a == (b or e),
    shape=(2, 2, 2),
)
~~~

`p(a | b, e)` 的 lambda 表示只要 burglary 或 earthquake 其中之一是 1，alarm 就是 1。相同的 `b`、`e` labels 對齊 tensor：

~~~python
P_BEA = einsum(p_b.p, p_e.p, p_a_given_be.p,
               "b, e, b e a -> b e a")
~~~

它實作的公式是：

~~~text
P(B = b, E = e, A = a) = p(b) p(e) p(a | b, e)
~~~

小寫 `p` 是 local probability，大寫 `P` 是 joint 導出的 marginal 或 conditional；小寫 `e` 是 value，大寫 `E` 是 random variable。`ProbTable` 可直接接 tensor，也能遍歷 function 定義的 assignments 建表。

先問沒有 evidence 時的 burglary marginal：

~~~python
P_B = einsum(P_BEA.p, "b e a -> b")
~~~

`e` 與 `a` 被加掉，留下的 `P(B = b)` 會符合 local `p(b)` 的低 burglary prior。問 `P(B = 1 | A = 1)` 時，先選 `a1 = np.array([0, 1])`，再算 evidence probability，最後除法：

~~~python
P_BA1 = einsum(P_BEA.p, a1, "b e a, a -> b")
P_A1 = einsum(P_BA1.p, "b ->")
P_B_given_A1 = P_BA1.p / P_A1.p
~~~

問 `P(B = 1 | A = 1, E = 1)` 時，只是再用 `e1` 選取 evidence 軸，求和後以 `P(A=1,E=1)` normalization。

程式強調的是方向而非額外列出一個未呈現的數字：只聽到 alarm 時，burglary much more likely；若知道 earthquake 也發生，burglary 又變得 unlikely，因為 earthquake 已足以解釋 alarm。這叫 **explaining away**：兩個 causes 正向影響同一個 effect；condition on effect，再 condition on 一個 cause，另一個 cause 的機率降低：

`P(B = 1 | A = 1, E = 1) < P(B = 1 | A = 1)`。

即使 causes 事前 independent，condition on common effect 後仍會產生這個關係。

## 5. Medical diagnosis：evidence 如何沿 network 傳播

第二個案例問：「咳嗽又眼睛癢，是感冒嗎？」變數是 cold `C`、allergies `A`、cough `H`、itchy eyes `I`。 `C` 與 `A` 都影響 `H`，`A` 影響 `I`。

~~~python
p_c = ProbTable("C", [0.9, 0.1])
p_a = ProbTable("A", [0.8, 0.2])
p_h_given_ca = ProbTable(
    "H | C A",
    lambda c, a, h: 0.9 if h == (c or a) else 0.1,
    shape=(2, 2, 2),
)
p_i_given_a = ProbTable(
    "I | A",
    lambda a, i: 0.9 if i == a else 0.1,
    shape=(2, 2),
)
P_CAHI = einsum(p_c.p, p_a.p, p_h_given_ca.p, p_i_given_a.p,
                "c, a, c a h, a i -> c a h i")
~~~

查 `P(C = 1 | H = 1)` 時，`A`、`I` 既不是 query 也不是 evidence，所以只選 `H = 1`，其餘軸消去：

~~~python
h1 = np.array([0, 1])
P_CH1 = einsum(P_CAHI.p, h1, "c a h i, h -> c")
P_H1 = einsum(P_CH1.p, "c ->")
P_C_given_H1 = P_CH1.p / P_H1.p
~~~

加入 `I = 1` 後，同時選 `h1`、`i1`，仍只留下 `c`：

~~~python
P_CH1I1 = einsum(P_CAHI.p, h1, i1, "c a h i, h, i -> c")
P_H1I1 = einsum(P_CH1I1.p, "c ->")
P_C_given_H1I1 = P_CH1I1.p / P_H1I1.p
~~~

來源用 assert 檢查加入 itchy eyes 後，cold posterior 小於只看 cough 的 posterior。 `I` 不是 cough 的 cause，但 `I = 1` 提高 allergy 的可能性，而 allergy 是 cough 的另一個 cause，所以 cold 的可能性下降。這是更細的 explaining away；一般而言，evidence 會沿 network 改變其他 nodes 的機率，可能提高，也可能降低。

## 6. 一般 Bayesian network 與 factorization

兩個例子抽象成四步：

1. 定義 random variables `X = (X_1, ..., X_n)`。
2. 在 variables 上定義 directed acyclic graph（DAG）。
3. 對每個 node `X_i` 定義 `p(x_i | parents(x_i))`。
4. 定義 joint：`P(X_1, ..., X_n) = Π_i p(x_i | parents(x_i))`。

每個 node 有一份 local conditional distribution，不是每條 edge 一份；它依賴該 node 的所有 parents。這能緊湊表示巨大 joint，但不代表每個 query 都容易。

這份來源直接以完整 tensor 和 `einsum` 展示 marginalization、selection、normalization。它沒有展示 enumeration，也沒有 variable elimination；沒有另外介紹 standalone factor-graph 演算法。因此本講的 factor 應理解成 local conditional tables，以及它們的 tensor product，而不是把後續方法擅自補進來。

給定 Bayesian network、evidence `E = e`（`E ⊆ X`，例如 `(X_3, X_7) = (0, 1)`）與 query `Q ⊆ X`，輸出就是 `P(Q | E = e)`。沒有 joint 或 local tables，就沒有足夠資訊推出 posterior。

## 7. Autoregressive language model

來源指出，很多東西其實都是 Bayesian networks。autoregressive language model 的 variables 是 tokens `X_1, ..., X_T`；每個 token 的 parents 是所有先前 tokens；Transformer 給出 `p(x_t | x_1, ..., x_{t-1})`；joint 是：

~~~text
P(X_1, ..., X_T) = Π_t p(x_t | x_1, ..., x_{t-1})
~~~

通常是 forward sampling：prompt 的 `X_1, X_2, X_3` 生成 `X_4, X_5, X_6`。反過來拿到 response，想找可能產生它的 prompts，就是從 `X_4, X_5, X_6` 反推 `X_1, X_2, X_3` 的 inference query。來源把這個方向連到 jailbreaking language models，並附[論文](https://arxiv.org/abs/2502.01236)；本文不替 source 補出額外攻擊結論。

## 8. 把 network 寫成 probabilistic program

前面是手寫 tables，這裡改由程式定義 distribution。 `Bernoulli(prob)` 以 `prob` 的機率回傳 1，否則回傳 0。alarm program 是：

~~~python
def alarm():
    B = Bernoulli(0.05)
    E = Bernoulli(0.05)
    A = B or E
    return {"B": B, "E": E, "A": A}
~~~

每次呼叫都產生 joint 的一個 sample。medical program 先 sample `C`、`A`，再依 `C or A` 決定 cough 的 Bernoulli probability，依 `A` 決定 itchy eyes 的 probability。dependency 被寫在執行順序與條件參數中，而不是先列出完整 tensor。

## 9. Rejection sampling

要近似 `P(B | A = 1)`，來源的 recipe 是：抽大量 samples；只保留符合 evidence 的 samples；記錄 query；將 counts normalize：

~~~python
def rejection_sampling(program, query, evidence, num_samples):
    counts = defaultdict(int)
    for _ in range(num_samples):
        sample = program()
        if evidence(sample):
            counts[query(sample)] += 1
    total_count = sum(counts.values())
    return {q: counts[q] / total_count for q in counts}
~~~

`query` 可為 `lambda sample: sample["B"]`，`evidence` 可為 `lambda sample: sample["A"] == 1`。來源用 `num_samples=10` 與 `1000` 比較，也對 medical diagnosis 用 200 samples。sample 數趨近無限時，估計會收斂到真實機率；但 evidence 很 rare 時，大多數 samples 都被丟掉，所以方法非常沒效率。這是 probabilistic program 很 flexible、但 rejection sampling 很 slow 的取捨。

同一個介面也處理 hidden Markov model：5 個 time steps 中，hidden position `H[t]` 是前一位置加 `Bernoulli(0.5)`；sensor `E[t]` 是 position 加另一個 `Bernoulli(0.5)`。問題是 `P(H_3 | E_5 = 2)`。來源沒有另外展開 HMM 的 exact inference，而是直接用同一個 rejection sampler。

## 10. 假設、實作邊界與限制

Bayesian network 需要先選定 variable set、DAG、每個 node 的 local conditional distribution。這些都是 modeling assumptions，不是世界本身：`B` 與 `E` independent、alarm 由任一 cause 觸發、medical symptoms 的 Bernoulli probabilities，都是 toy model 的設定。假設錯了，精確 tensor computation 仍只會精確地算錯模型。

還要分清 representation cost 與 inference cost。factorization 可能降低描述巨大 joint 的成本，但本檔只展示完整 tensor 上的 `einsum`；沒有聲稱任意大型 network 都能便宜回答 query。rejection sampling 則有 approximation 與 data-efficiency 限制：program 寫得自然，不能消除 rare evidence 造成的浪費。

Bayesian network 不同於固定 input → output 的 classifier：medical example 能從 evidence 反推 hidden causes。source 列出的優點包括 missing information、prior knowledge、intermediate variables 與 causal models precursor；本檔未實作 intervention 或 counterfactual API。

## 11. 收束：從 joint 到可計算的 query

先確認 network 的 factorization 與 local tables，再選 exact tensor computation 或近似 sampling；答案不能脫離 modeling assumptions 與 evidence 的稀有程度。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：bayes](https://stanford-cs221.github.io/autumn2025-lectures/?trace=bayes)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
