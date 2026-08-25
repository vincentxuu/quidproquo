---
title: "CS221 Lecture 14：Bayesian Networks III：從計數、平滑到 EM"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 15
tldr: "第 14 講從 complete data 的 maximum-likelihood counts 與 Laplace smoothing，走到 latent variables 下交替計算 posterior responsibilities 和更新參數的 EM。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 14：官方 agenda、核心推導、實作連接與材料缺口。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-14-bayes-learning-em-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 14**，官方課程表將它列為 2025-11-05 的 Bayesian Networks III。課程版本以[官方網站](https://stanford-cs221.github.io/autumn2025/)為準；本文逐段依 [bayes_learning](https://stanford-cs221.github.io/autumn2025-lectures/?trace=bayes_learning) 的可執行 source 重建。重點不是把 EM 背成一個黑盒，而是跟著程式走完「完整資料如何計數、缺資料後如何加權計數」這條線。

> 材料缺口：官方課程頁公開課程表，lectures repository 與可執行講義公開；Canvas 影片、課堂白板互動、作業解答與隱藏測資不在這份公開材料中。以下不把那些缺口用其他學期的講義補起來。

## 先把 Bayesian network 放回原位

Lecture 14 一開始不是直接跳進 EM，而是先回顧模型由什麼組成。給定隨機變數 (X=(X_1,ldots,X_n))，先在它們之間畫一張有向無環圖（DAG），再為每個節點指定一個區域條件分布：

\[
P(X_1=x_1,ldots,X_n=x_n)=\prod_i p(x_i\mid \operatorname{parents}(X_i)).
\]

Alarm network 是小例子：(B) 表示 burglary、(E) 表示 earthquake、(A) 表示 alarm，聯合分布寫成 (p(b)p(e)p(a\mid b,e))。有了聯合分布，才談得上像 SQL 一樣回答問題，例如 (P(B\mid A=1))；source 也提醒可以用 exact inference、rejection sampling 或 Gibbs sampling 取得答案。這裡的關鍵是分工：推論是在**讀**已經存在的區域分布，而本講接下來要處理的是如何**寫入**這些分布的參數。

## 完全可觀察：學習任務其實是寫入局部表格

完全可觀察（fully observable）的輸入是一組資料，每一筆都是所有變數的完整 assignment；輸出則是 Bayesian network 的 local conditional distributions。若變數是電影評分 (R\in\{1,2,3,4,5\})，模型只有 (p_R(r))，參數就是五個機率。source 的資料為 1、3、4、4、4、4、4、5、5、5。演算法沒有神秘的全域步驟：逐筆掃描資料，對每個 rating 增加 count，再把所有 count 除以總數。

加入 (G\)（genre）後，聯合分布是 (p_G(g)p_R(r\mid g))。此時每筆資料同時更新 (G) 的 count 與 ((G,R)) 的 local count；對每一個固定的 (g)，只在對應的 rating count 上正規化。這就是 source 反覆強調的 **count + normalize**：估計某個局部條件分布時，只需要看它的 child 與 parents 的 assignment，不必把整個聯合表重新列出。

有 v-structure (G\to R\leftarrow A) 時，(p_R(r\mid g,a)) 必須同時 condition on 所有 parents；不能只按 (g) 或只按 (a) 分組。反過來，在 (G\to R1) 與 (G\to R2) 的 inverted-v 例子中，(p_G)、(p_{R1}(r1\mid g))、(p_{R2}(r2\mid g)) 各自有自己的局部 count。這些圖形結構沒有改變基本操作，只改變「哪一組 parent values 是一個桶」。

### Parameter sharing 是建模選擇

source 接著把 (R1) 和 (R2) 改成共用一個 (p_R(r\mid g))。計數時，兩個 rating 都加進同一個 `counts_gr[g]`，因此每個 genre 的資料量增加，最後仍是分組後正規化。從推論角度，讀取 (p(r1\mid g)) 和 (p(r2\mid g)) 看不出差別；但學習時是在寫入參數，是否共用就會直接改變 count 如何累積。

共用參數的好處是參數較少、需要的例子較少；不共用則保留更大的彈性。source 沒有替我們決定兩位使用者是否相似，而是把它明確留成 modeling decision。這個例子也說明「資料足夠」不是抽象口號：參數共享改變了哪些觀測被視為同一個局部分布。

### HMM 只是同一個計數器的重複使用

hidden Markov model 的 hidden state (H_t) 與 sensor reading (E_t) 讓參數名字更有時間結構：(p_{start})、(p_{trans})、(p_{emit})。source 展開三個時間點的聯合分布：起始狀態、每一步 emission，以及相鄰 hidden state 之間的 transition 交替相乘。

在 source 的兩筆完整資料中，程式把 (H1) 放進 start count，把每個 (H_t,E_t) 放進 emission count，把 (H1\to H2) 和 (H2\to H3) 放進 transition count，然後分別正規化。一般 Bayesian network 的實作把同一件事抽象化：`network_structure` 為每個變數記錄 `(parameter_name, parent_vars)`，例如 `H2` 使用 `trans` 且 parent 是 `H1`。掃過每筆 assignment 時，取出 parent values 組成 key，再將 child value 的 count 加一。

若多個節點使用相同的 `parameter_name`，就是 parameter sharing；否則就是不同的 local table。`fully_observable_learning` 先建立
`counts[parameter_name][parent_values][value]`，或從 pseudocounts 的深拷貝開始，再對每個 parent bucket 呼叫 `normalize_dict`。這段實作很小，但它把 DAG、局部條件分布、完整資料和共享參數接在同一條可執行路徑上。

## Count + normalize 為什麼是 maximum likelihood

直覺演算法不是另一種和統計目標無關的技巧。source 隨後說明，它正好是 maximum likelihood estimation 的 closed-form solution。給定資料 (D)，目標是找參數 \(	heta) 使 likelihood 最大：

\[
\max_\theta \prod_{x\in D}P(X=x;\theta)
=\max_\theta \sum_{x\in D}\log P(X=x;\theta).
\]

對單一 rating 的例子，資料是 (R=1,5,5)，要最大化 (p_R(1)p_R(5)p_R(5))，同時滿足五個機率加總為一。source 只要求一個推導 sketch：加入 Lagrange multiplier 處理 sum-to-one constraint，令目標梯度為零並解出結果，得到 (p_R(1)=1/3)、(p_R(5)=2/3)。未出現的 rating 會得到零，這不是程式疏忽，而是純 MLE 在這組資料上的結果。

兩個變數的例子更能看出 Bayesian network 的分解。資料為 `(drama,4)`、`(drama,5)`、`(comedy,5)`，原始 likelihood 是三筆 (p_G(g)p_R(r\mid g)) 因子的乘積。把相同參數的因子重排後，問題分成三個互不相干的最佳化：一個估 (p_G)，一個估 (p_R(\cdot\mid drama))，一個估 (p_R(\cdot\mid comedy))。每一個子問題都回到單一變數的 count + normalize。因此 closed form 的前提不是「所有機率都能神奇地直接算」，而是完整 assignment 和這種局部參數化讓目標可以按表格拆開。

## Smoothing：仍然是加權計數，不要把它說成另一個模型

source 用 (R=1) 和 (R=4) 的資料問：我們真的相信 (p_R(2)=0) 嗎？Laplace smoothing 的實作很直接：對每一個可能 rating 的 count 都加上同一個 pseudocount \(lambda)，再照原本流程正規化。`fully_observable_learning` 的 `pseudocounts` 參數就是這個入口；source 建立五個 rating 各加 1 的表，再把它傳進學習函式。

這個參數的行為可以由 source 的三次執行讀出來。當 \(lambda\to0)，回到原本的 MLE；當 \(lambda\to\infty)，分布趨近 uniform。資料量增加時，固定的 pseudocount 相對影響會被洗淡：source 用 (R=4) 重複 1000 次示範這件事。這裡只需要保留它實際提供的結論：smoothing 讓零機率估計不再出現；材料把它稱作加 pseudocount，沒有進一步展開更一般的先驗推導。

## 資料不完整：likelihood 先改寫，再談 EM

到這裡每一筆 training data 都包含所有變數。EM 的問題設定只改一件事：在 (G\to R1)、(G\to R2) 的模型裡，資料只觀察到 (R1,R2)，沒有 (G)。若 (G) 已知，前面的完全可觀察學習可以 count + normalize；現在未知的是 hidden assignment 和參數 \(	heta=(p_G,p_{R\mid G}))，兩者互相依賴。

maximum likelihood 仍然是目標，但 data 是「實際觀察到的東西」。對每筆 ((r1,r2))，完整 joint probability 要把沒有觀察到的 (g) marginalize 掉：

\[
\max_\theta\sum_{r1,r2}\log P(R1=r1,R2=r2;\theta)
=\max_\theta\sum_{r1,r2}\log\sum_g P(G=g,R1=r1,R2=r2;\theta).
\]

這個 sum 在 log 裡面，正是不能直接把 (G) 當成已知 label 再計數的原因。source 把它描述成 chicken-and-egg：知道 \(	heta) 就能算 (P(G=g\mid R1=r1,R2=r2;\theta))；知道 hidden (G) 又能算新的 \(	heta)。EM 用交替步驟處理這個循環。

## EM 的 E-step 與 M-step

source 的 `expectation_maximization` 先設定參數：`p_g` 是 drama/comedy 各 0.5，`p_r_given_g` 則是 comedy 對 rating 1、2 為 0.4、0.6，drama 為 0.6、0.4。文字說明以初始參數開始迭代；這份 source 的具體實作不是呼叫 random，而是使用這組固定、非完全對稱的初始化。

### E-step：把每筆觀察展開成加權完整資料

對每一筆 `x`，程式先對每個 (g) 算未正規化的 joint weight：

\[
q(g)=p_G(g)p_{R\mid G}(r1\mid g)p_{R\mid G}(r2\mid g).
\]

接著用 `normalize_dict(q)`，得到真正的後驗 (P(G=g\mid r1,r2;\theta))。如果一筆資料同時支持兩個 genre，兩個 (g) 都保留，但各自帶不同權重；程式將 `x | {"G": g}` 與 `q[g]` 放進 `weighted_training_data`。所以 E-step 不是硬猜一個 label，而是把一筆部分觀察資料轉成多筆「可能的完整 assignment」，每筆的影響力由 posterior weight 決定。

### M-step：對 fractional counts 做同一個操作

M-step 重新掃過 weighted data。對每個 `(x, weight)`，`counts_g[x["G"]]` 加上 `weight`；`R1` 和 `R2` 也都把相同 weight 加進該 genre 的 rating count。這就是 source 所說的 weighted full assignments：count 可以是浮點數，不必是整數，因為它代表 posterior responsibility 的總和。

最後 `p_g = normalize_dict(counts_g)`，對每個 (g) 再把 `counts_gr[g]` 正規化成 (p_R(r\mid g))。這個 M-step 的形狀和 fully observable learning 幾乎一樣；真正的差別只在 count 不再來自確定 label，而來自 E-step 的權重。完成一次 M-step 後，新的參數又回到下一輪 E-step，用來重新計算後驗。source 先跑 5 次迭代，第二個較異質的資料例子跑 10 次。

第二個例子包含多筆 `(1,1)`、`(2,2)`，也包含 `(1,2)` 和 `(2,1)`。source 的觀察是，這組較 heterogeneous 的 assignment 會得到稍微 smoother 的機率，以容納不完全一致的資料；它沒有把這個現象延伸成未在材料中出現的泛化定理。

## EM 的保證、初始化與可辨識性

這段 source 給出的保證要精確讀：每次迭代會增加 likelihood，並收斂到某個 local maximum；沒有保證是 global maximum。原因不是「EM 會隨機失敗」這麼模糊，而是 latent-variable objective 可能有多個局部解，迭代從哪裡開始會影響它放大哪一種解釋。source 因而指出初始化的重要性，並提醒要用非 uniform 的初始化打破 symmetry；本實作的 0.5/0.5 prior 與 0.4/0.6、0.6/0.4 的 conditional table 正好提供了這個非完全對稱起點。

還有一個不能忽略的 identifiability 限制：hidden label 的名字本身沒有意義。若最後一個解把 `drama` 和 `comedy` 對調，觀察資料的模型解釋可能完全等價；source 將此說成只能 up to permutation of labels 恢復 hidden variable。因此比較兩次 EM 結果時，不能只看 label 字串是否對上，必須先承認這個 permutation symmetry。

## 把這一講收成一條實作檢查線

這份 source 的完整路徑可以壓成四個問題。第一，資料是否是所有變數的完整 assignment？是的話，為每個 `(parameter_name, parent_values, value)` 計數並正規化。第二，是否要共用 local parameter？那是建模選擇，會改變哪些觀測被合併。第三，是否要避免零機率？可以在 count 前放入 pseudocount，並知道 \(lambda\) 從 0 到很大時的行為。第四，是否有未觀察的變數？不能直接把缺的 label 當成真值，而要以 observed-data likelihood 為目標，在 E-step 算 posterior 權重、M-step 做 weighted count + normalize。

這也劃出材料支持的限制：EM 的結果依初始化而變，可能只到 local maximum；hidden label 可置換；完全可觀察的 closed-form count + normalize 並不能原封不動套到 log 裡含 marginalization 的 incomplete-data objective。source 沒有在這裡討論連續變數、一般數值最佳化、缺失機制或更多收斂診斷，因此本文也不把那些內容冒充成 Lecture 14 的結論。

## 參考資料

- [CS221 Autumn 2025 官方課程網站與課表](https://stanford-cs221.github.io/autumn2025/)
- [本講官方可執行材料：bayes_learning](https://stanford-cs221.github.io/autumn2025-lectures/?trace=bayes_learning)
- [CS221 Autumn 2025 lectures repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
