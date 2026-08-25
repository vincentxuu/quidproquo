---
title: "CS221 Lecture 13：Bayesian Networks II：Gibbs sampling 與 Markov blanket"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 14
tldr: "第 13 講在 exact inference 太昂貴時改用 Gibbs sampling：每次只重抽一個變數，僅依 Markov blanket 計算 conditional distribution，並以樣本頻率近似查詢機率。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 13：官方 agenda、核心推導、實作連接與材料缺口。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-13-bayes-gibbs-sampling-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 13**。課程版本以[官方課程網站](https://stanford-cs221.github.io/autumn2025/)為準；本講的可執行材料是 [gibbs_sampling](https://stanford-cs221.github.io/autumn2025-lectures/?trace=gibbs_sampling)，以下按照 `source/gibbs_sampling.py` 的執行順序整理。程式不是把抽象概念藏在一張圖裡，而是用 `ProbTable`、`Bernoulli`、`sample_dict` 與 `normalize_dict` 把每一步的分布、取樣和計數攤開來。

> 材料缺口：官方可執行講義與課程網站公開；本篇不把 Canvas 內的錄影互動、作業解答或隱藏測資當成已知內容。可執行講義 repository 也只代表公開的 lecture artifact，不代表完整課堂活動。

## TL;DR

本講從 rejection sampling 的浪費走到 Gibbs 的局部更新，再用 Markov blanket 與 conditional independence 解釋何時能省計算、何時會 mixing 困難。

## 先回顧：Bayesian network 是一個 joint distribution 的表示

`main()` 開始列出本講 agenda：上次是 Bayesian networks 與 rejection sampling，這次是更快的 probabilistic inference methods，也要看 conditional independence。要跟上後面的 Gibbs 推導，先把 network 的語意固定下來。

給定隨機變數 (X=(X_1,ldots,X_n))，先在變數上畫一個 directed acyclic graph。最小的 alarm 例子有 burglary (B)、earthquake (E) 和 alarm (A)，圖是 (B	o A)、(E	o A)。每個節點只需要定義一個 local conditional distribution：`p(b)`、`p(e)`、`p(a | b, e)`。程式用 `ProbTable("B", [0.95, 0.05])` 與 `ProbTable("E", [0.95, 0.05])` 表示兩個 prior；`p(a | b, e)` 則在 (a=(blor e)) 時給 1，否則給 0。

Bayesian network 的 joint factorization 是

\[
P(X_1,ldots,X_n)=\prod_i p(x_i\mid parents(x_i)).
\]

對 alarm network，就是

\[
P(B,E,A)=p(b)p(e)p(a\mid b,e).
\]

這裡的「joint distribution 像一個說明世界如何運作的 database」不是比喻性的額外模型：它告訴我們每個 assignment 的機率如何由 local factors 相乘而來。後面 Gibbs 更新一個變數時，仍然依賴同一個乘積，只是不一定真的把所有格子列出來。

## 推論的基本操作：condition、marginalize、normalize

推論就是在 joint distribution 上回答問題。材料以 (P(Bmid A=1)) 示範。先 condition on evidence，把 (A) 固定為 1；在陣列上等同取出 `P_BEA.p[:, :, 1]`，得到仍帶著 (B,E) 的 (P(B,E,A=1))。接著 marginalize 掉不在問題裡的 (E)：

\[
P(B,A=1)=\sum_e P(B,e,A=1).
\]

再把 (B) 也加總，得到 evidence 的機率 (P(A=1))，最後 normalize：

\[
P(Bmid A=1)=\frac{P(B,A=1)}{P(A=1)}.
\]

程式用 `einsum` 做這些消去：`"b e -> b"` 把 (E) 收掉，`"b ->"` 把剩下的 (B) 收成 scalar。這就是本講出現的 exact inference 操作；重點是 conditioning、marginalization 和 normalization 的順序，而不是另造一個推論 API。問題在於，若把所有變數的 joint table 都形成出來，大小可能隨變數數量指數成長。

### 從 joint program 取樣

講義接著把 Bayesian network 寫成 probabilistic program：`alarm()` 先以 `Bernoulli(0.05)` 取樣 (B) 和 (E)，再令 `A = B or E`，回傳 `{"B": B, "E": E, "A": A}`。能從 joint distribution 取一個 sample 的程式，也就定義了這個 joint distribution 的生成方式。

### Rejection sampling 的流程與瓶頸

`rejection_sampling(program, query, evidence, num_samples)` 每次從頭呼叫 program。若 `evidence(sample)` 為真，才把 `query(sample)` 的值加入 `counts`；最後令每個 query value 的 count 除以所有保留下來的 count，得到估計分布。alarm 例子問的是 (P(Bmid A=1))：sample 仍會先依 prior 生成，只有 alarm 確實為 1 才留下。

這個方法有一個乾淨的優點：保留下來的 sample 彼此獨立，因為每次都是重新生成。但它不在生成過程中使用 evidence。當 evidence 很罕見，大多數 sample 都在 `if evidence(sample)` 被丟掉；想得到固定數量的有效 sample，就得從頭再試很多次。講義的轉折很直接：能不能有更快的 probabilistic inference？

## 從 rejection 到 Gibbs：讓下一個 state 接著走

rejection sampling 的圖像是 `sample`、丟掉，再從頭 `sample`。Gibbs sampling 改成一條 chain：`sample → sample → sample → sample`。基本想法只有兩步：先任意建立一個完整 assignment；然後一次改一個變數，每次都把其他變數視為已知。

最重要的初始化條件是 evidence 已經滿足。之後更新的變數不包含 evidence，所以 chain 的每個 state 都保留同一份觀察。這讓方法不必像 rejection sampling 那樣先生成一個不符合 evidence 的世界，再把它丟掉。代價也同樣明確：相鄰 sample 共用前一個 state，因此不獨立，需要更多樣本；方法是 MCMC 的一個特例。

## Telephone：先把一次 Gibbs update 算完

第一個完整例子是 telephone network：(A	o B	o C)。直覺是 (A) 傳一個 bit 給 (B)，(B) 再傳給 (C)，每段傳輸都可能被破壞。程式定義 `p_a = [0.5, 0.5]`；若 (b=a)，`p_b_given_a` 給 0.8，否則 0.2；同樣地，若 (c=b)，`p_c_given_b` 給 0.8，否則 0.2。目標是 (P(Amid C=1))：看到最後是 1，會把 (A=1) 往上推，但訊息經過兩次可能出錯，所以影響不會是直接複製。

講義先以固定 random seed 3 做 100 次 rejection sampling。這個結果作為比較基線：每一筆候選都從 `telephone()` 開始，query 是 `sample["A"]`，evidence 是 `sample["C"] == 1`。

接著固定 (C=1)，初始化為 `x = {"A": 1, "B": 0, "C": 1}`。若此刻要更新 (B)，不是憑直覺挑一個比較合理的值，而是先寫出條件分布：

\[
P(B=b \mid A=a,C=c)=
\frac{P(A=a,B=b,C=c)}{P(A=a,C=c)}.
\]

分母只是 normalizer：

\[
P(A=a,C=c)=\sum_bP(A=a,B=b,C=c).
\]

因為 telephone 的 joint 由 factors 組成，分子是

\[
P(A=a,B=b,C=c)=p(a)p(b \mid a)p(c \mid b).
\]

對目前 assignment，`joint_prob(x, "B", value)` 先複製並覆蓋 `B`，再計算更新後 (y) 的三個 local factor。分別算出 `p_ab0c` 和 `p_ab1c`，相加成 `p_ac`，再除以它得到 (P(B=0mid A=1,C=1)) 與 (P(B=1mid A=1,C=1))，最後由 `sample_dict` 依這兩個機率取樣。因為 (A=1) 和 (C=1) 都支持中間 bit 為 1，B 會被拉向 1。

這個計算的細節很關鍵：沒有先建立完整的 (A,B,C) joint table；只在 (B) 的 domain `{0,1}` 上試兩個 assignment。但 `joint_prob` 仍觸碰 (A,B,C) 的 local factors。講義因此給出成本 (O(\#iterations\times\#variables\times|domain|\times\#variables))。

## Gibbs sampling 的程式骨架：burn-in、samples 與 counts

來源中的 `gibbs_sampling` 接受 `init_x`、要更新的 `vars`、`query`、`joint_prob` 和 `num_iterations`。它先以 `x = dict(init_x)` 複製初始 assignment，避免直接改掉呼叫端的 dictionary。每一輪對 `vars` 逐一處理；對二元變數，建立 `{0: joint_prob(x,var,0), 1: joint_prob(x,var,1)}`，用 `normalize_dict` 變成條件分布，再以 `sample_dict` 更新 `x[var]`。

來源程式在每次單變數更新後就做 `counts[query(x)] += 1`，最後對 counts normalize，回傳 query 的估計分布。因此這個實作沒有另設一個 burn-in 參數，也沒有在程式中丟掉前幾輪；所謂從初始 state 走向穩定的過程，必須在解讀結果時注意，而不能假裝函式已經自動處理。`num_iterations=100` 代表外層輪數，每輪會更新 `vars` 裡的每個變數，所以實際被記錄的 query 次數是每次單變數 update 一筆。

telephone 例子把 `vars` 設為 `["A", "B"]`，`C` 是 evidence，不更新；先跑一次，再跑 100 次，與前面的 rejection 結果比較，兩者都在同一個大致範圍。這不是精確值保證，而是用一個可以追蹤的例子展示 chain 如何產生估計。

## Markov blanket：只保留會影響局部條件的 factors

完整 joint 計算雖然避免了先建立巨大 table，卻仍可能每次更新都把很多無關 factor 算一次。電話鏈上的 joint 是

\[
p(a)p(b \mid a)p(c \mid b)p(d \mid c)p(e \mid d).
\]

如果只改一個變數，大部分 factor 在分子和分母會同時出現而抵消。以 (A	o B	o C) 更新 (A) 為例，在 (B=b,C=c) 固定下，兩個候選值的 joint 分別含有

\[
p(a=0)p(b \mid a=0)p(c \mid b),
\]

與

\[
p(a=1)p(b \mid a=1)p(c \mid b).
\]

共同的 (p(c \mid b)) 不影響 normalize 後的 (P(Amid B,C))，可以忽略。

一般來說，更新一個節點只需納入「涉及該節點的 local conditional probabilities」，而計算這些 factors 需要該節點的 parents、children，以及 children 的其他 parents。來源把這組變數稱為 Markov blanket，並在這個簡化講法中列出：`MarkovBlanket(A) = {B}`、`MarkovBlanket(B) = {A, C}`、`MarkovBlanket(C) = {B}`。它不是把整張圖刪掉，而是指出在目前的 conditional ratio 裡哪些 terms 不必再算。

`markov_prob` 對 (A) 只算 `p_a * p_b_given_a`，對 (B) 只算 `p_b_given_a * p_c_given_b`，不再乘與正在更新的變數無關的 prior 或 child factor。用同一條 telephone chain 跑 100 輪 Gibbs，查詢仍是 (A)。成本從觸碰整個變數集合，縮成依賴 Markov blanket 大小的版本：來源以 (O(\#iterations\times\#variables\times|domain|\times|markov\_blanket|)) 表示。當 blanket 很小，這是很實際的節省。

## Alarm network：局部化不等於立刻精確

接著回到 (B,E	o A) 的 alarm network。先以 `x = {"B": 1, "E": 1, "A": 1}` 初始化，因為 (A=1) 是要固定的 evidence；只對 `B` 和 `E` 更新。`compute_prob` 對每個候選 assignment 計算 `p_b * p_e * p_a_given_be`，query 是 (B)。來源分別跑 100 與 200 次，並明確提醒 estimates「aren't quite accurate」。這句提醒不能被改寫成精確推論：增加迭代次數可能改善估計，但程式片段沒有給出誤差界線或收斂保證。

## 兩種方法各自在哪裡困難

講義用兩個二元例子把 trade-off 說得很具體。第一個是 (A	o B)，prior `p_a = [0.5, 0.5]`，而 `p_b_given_a` 是 `[[0.9999, 0.0001], [0.9998, 0.0002]]`，查詢 (P(Amid B=1))。(B=1) 的 evidence 很罕見，因此 rejection sampling 必須拒絕幾乎所有不符合的生成 sample；Gibbs sampling 直接把 (B=1) 固定，這種例子對它比較友善。

第二個仍是 (A	o B)，但 `p_b_given_a` 由 `a == b` 決定，兩個變數高度相關。此時沒有 evidence，從 `{"A": 0, "B": 0}` 開始。rejection sampling 每次從頭產生，因而可以正常探索；Gibbs 一次只改一個變數，若把 (A) 改成 1 卻不改 (B)，這個 joint assignment 的機率是 0，反過來也一樣，所以 chain 會卡在 (A=0,B=0)，看不到 (A=1)。

這就是來源對 mixing 的具體限制，而不是泛泛地說「MCMC 可能不準」：rare events 對 rejection sampling 困難；highly correlated variables 對 Gibbs sampling 困難。實作時要先問 evidence 是否稀少、單變數更新是否能讓 chain 在高機率區域間移動，再決定只增加迭代次數是否合理。來源提到更一般的 MCMC 方法 Metropolis–Hastings，並指出可用 mixing times 研究相關樣本的有效執行時間；但本講程式沒有展開 proposal distribution 或理論證明，因此這裡只保留這個延伸方向。

## 最後：從圖結構問 independence

Gibbs 之後，來源才進入 conditional independence。前面已經能在 Bayesian network 上做推論，現在把圖的結構連到機率性質。

兩個變數 (A,B) independent，定義是對所有 (a,b)，

\[
P(A=a,B=b)=P(A=a)P(B=b).
\]

若圖上沒有連邊，joint 可以寫成 `p(a) p(b)`，所以 independent。若是 (A	o B)，joint 是 `p(a) p(b | a)`，一般不 independent。較容易誤判的是 (A,B	o C)：即使兩者共同指向 (C)，把 (C) marginalize 掉後，來源寫成 `Σ_c p(a) p(b) p(c | b, a) = p(a) p(b)`，因此 (A,B) 可以 independent。反過來在 common cause (C	o A,B) 中，`Σ_c p(c)p(a|c)p(b|c)` 通常不會拆成兩個 marginal，所以 (A,B) 不 independent。

Conditional independence 是在給定 (C=c) 後成立：

\[
P(A=a,B=b \mid C=c)=P(A=a \mid C=c)P(B=b \mid C=c).
\]

同一個 common-cause 圖 (C	o A,B) 在固定 (C=c) 後，joint 化成 `p(a | c) p(b | c)`，所以 A、B conditional independent。相反地，對 (A,B	o C)，固定共同 child 的 (C=c) 會留下 `p(a)p(b)p(c|a,b)`，來源指出這時 A、B 不再 conditional independent。alarm 例子把這件事具體化：Burglary (B) 與 Earthquake (E) 原本 independent，但給定 (A=1) 後不再 conditional independent，因為知道其中一個原因會改變另一個原因對 alarm evidence 的解釋。

來源最後給出判斷 conditional independence 的一般圖算法：先把要 condition 的變數 shade；遞迴移除非 shaded leaves；把 parents 彼此 connect（marriage）；最後看 A 到 B 是否存在不經過 shaded nodes 的 path。講義文字的編號把最後兩步都寫成 3，這不影響操作順序，但也提醒我們應以步驟內容而不是編號閱讀。

醫療 diagnosis 例子有 Cold (C)、Allergies (A)、Cough (H)、Itchy eyes (I)，材料列出 C 與 A independent、C 與 I independent、給定 A 後 C 與 I independent、給定 A、H 後仍列為 independent。這裡只保留 source 明確列出的判斷，不補畫未公開的數值 table。

## 這一講留下的檢查

這份 artifact 展示 sampler 的 mechanics 與限制，不提供完整 convergence proof、診斷標準或隱藏課堂材料。

## 參考資料

- [CS221 Autumn 2025 官方課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方可執行材料：gibbs_sampling](https://stanford-cs221.github.io/autumn2025-lectures/?trace=gibbs_sampling)
- [CS221 Autumn 2025 官方可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
