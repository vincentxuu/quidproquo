---
title: "Stanford CS103 Lecture 16：有限自動機 III"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 18
tldr: "本講從「自動機階梯：能力要用語言區分」推進到「DFA transition table 是圖的精確轉寫」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「自動機階梯：能力要用語言區分」與「DFA transition table 是圖的精確轉寫」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-17-finite-automata-3-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 18 篇，對應 **Spring 2026 官方 Lecture 16（2026-05-06）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/16/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/16/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Finite Automata, Part III**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## 自動機階梯：能力要用語言區分

投影片 先定位後半學期的 progression：DFA、帶 nondeterministic choices 的 NFA、具有 stack memory 的 PDA（課程會用等價的 CFG 研究），最後是具有無限 tape 的 Turing machine。每升一層，都要找一個下層無法 recognize 的 語言，才能證明能力真的增加。這也預告一件事：NFA 看似能完美猜測，但本講會證明它沒有超越 DFA。

regular 語言 原定義為存在 DFA 的語言。並非所有 語言 都 regular；有限 states 無法記住任意多資訊。可是在證明限制前，要先確定 DFA 與 NFA 的關係，否則「沒有某張 DFA 圖」還不能排除較靈活的 NFA。

## DFA transition table 是圖的精確轉寫

投影片把一張四狀態 DFA 轉為表格。row 對應 current state，column 對應 alphabet symbol，cell 填下一 state。第一 row 標示 start state，state 名旁的星號標 accepting。圖上 `q0 --0--> q1` 便寫成 row \(q_0\)、column 0 的值 \(q_1\)。

因為 DFA transition 是 total 函數，表格不能用 dash 表示「沒有 transition」。投影片 的 \(q_3\) 若圖上未畫 outgoing edges，正確補法是讓 0、1 都回 \(q_3\)，把它變成 sink state；選「留白」會使機器不再是 DFA。sink 不必 rejecting，但此例的語意通常是落入無法復原的拒絕狀態。

表格的好處是 missing 或 duplicate transition 無處藏。每個 \((q,a)\) pair 恰有一格，也方便把「同時位於多個 NFA states」提升成下一節的 subset rows。

## 一個方向免費：每台 DFA 都是 NFA

NFA 允許每個 symbol 有零、一或多個 successors，也可有 epsilon moves。DFA 只是每次剛好一個 successor、沒有使用額外選項的特例。因此若 \(L\) 有 DFA，就立刻有 NFA recognize \(L\)：使用同一組 states、edges、start 與 accepting states 即可。

反方向才令人意外。NFA acceptance 是「存在一條成功 path」，似乎有 perfect guessing 的力量。定理卻說：對所有 語言 \(L\)，若有 NFA recognize \(L\)，就存在 DFA recognize 同一 \(L\)。證明責任是從任意 NFA 建出 DFA，而不是針對一張圖巧猜另一張圖。

## massive parallelism：把所有可能 states 一起追蹤

核心 insight 是把 NFA 想成同時嘗試所有 choices。讀完 prefix \(x\) 後，不問「它在哪個 state」，而問「它可能在哪些 states」。答案是原 NFA state set \(S\) 的 subset。下一個 character 到來時，從 subset 中每個 state 沿所有 matching edges 前進，取 destinations 的 union；有 epsilon edges 時再取 epsilon closure。

例如 投影片 對 `ababa` 逐步列可能集合。某個 branch 死掉只會從集合消失；若集合變成 \(\varnothing\)，後續仍保持空。輸入結束時，subset 只要包含至少一個原 NFA accepting state，便代表存在接受 branch。

這個模擬沒有預測未來。它用更多 DFA states 編碼「目前所有猜測的集合」，把 nondeterministic breadth 換成 deterministic memory。

## subset construction 的逐步算法

給 NFA \(N\) 的 states \(S\)，建立 DFA \(D\)：

1. DFA 的 start state 是 NFA start state 的 epsilon closure。
2. 每個 DFA state 是 \(S\) 的一個 subset。
3. 對 subset \(T\) 與 symbol \(a\)，先由每個 \(q\in T\) 取 a-successors 的 union，再取 epsilon closure，得到唯一下一 subset。
4. subset 若與 NFA accepting set 相交，就標為 DFA accepting state。
5. 從 start subset 展開 transition table，直到沒有新 subset；不可達 subsets 不必畫。

空 subset 必須保留為合法 sink，因為它代表所有 NFA branches 已死。若原 NFA 有 \(n=|S|\) states，powerset 至多有 \(2^n\) subsets，所以最壞情況 DFA 可能 exponentially larger。投影片 特別問是否真的存在需要 \(2^n\) 的 family，重點是轉換保證存在，不保證尺寸相近。

## 為何建出的 DFA 語言完全相同

對任意 輸入 prefix \(x\)，維持 invariant：DFA 所在 subset 恰好等於 NFA 讀完 \(x\) 後可到達的所有 states。base case \(x=\varepsilon\) 由 start epsilon closure 成立。inductive 步 假設對 \(x\) 成立，讀下一 symbol \(a\) 時，construction 恰好 union 所有 a-successors 並 closure，所以對 \(xa\) 仍成立。

輸入 \(w\) 結束後，NFA accept iff reachable set 含 accepting state；construction 正好把這些 subsets 標為 accepting。因此 \(D\) accept \(w\) iff \(N\) accept \(w\)。因 \(w\) 任意，\(\mathcal L(D)=\mathcal L(N)\)。這完成存在性定理，也得到「regular 可等價定義為 NFA-recognizable」。

## union closure：用 nondeterminism 分派

若 \(L_1,L_2\subseteq\Sigma^\*\) 都 regular，各有 NFA \(N_1,N_2\)。新增 start state，以 epsilon edges 連到兩台機器的 starts，accepting states 保留兩邊的 accepting states。新 NFA 可選擇模擬任一機器，因此接受 iff \(w\in L_1\) 或 \(w\in L_2\)。由 NFA/DFA 等價，\(L_1\cup L_2\) regular。

這個 證明 使用的量詞與 union 對齊：NFA 需要存在接受 path，兩個 epsilon choices 對應「至少一個 語言」。若 \(w\) 同時在兩者，也只是有兩個 witnesses，不會重複計算造成問題。

## intersection closure：平行追蹤一對 states

對 intersection，需要兩台機器都接受。可建 product DFA，states 為 \(S_1\times S_2\)，start 是 \((s_1,s_2)\)，讀 symbol \(a\) 時同步更新

\[
\delta((p,q),a)=(\delta_1(p,a),\delta_2(q,a)).
\]

accepting set 是 \(A_1\times A_2\)，所以 pair 只有在兩個 components 都 accepting 時接受。此機器的 invariant 是：讀完同一 prefix 後，第一 component 是 \(D_1\) 的 state，第二 component 是 \(D_2\) 的 state。故語言恰為 \(L_1\cap L_2\)。

投影片 也可由 De Morgan 與已知 complement、union closure 推出 intersection closure：\(L_1\cap L_2=\overline{\overline{L_1}\cup\overline{L_2}}\)。兩證法都有效；product construction 更直接展現 AND 記憶。

## 語言 concatenation 不是 set union

兩語言的 concatenation 定義為

\[
L_1L_2=\{xy\mid x\in L_1\land y\in L_2\}.
\]

它把一條來自 \(L_1\) 的 string 與一條來自 \(L_2\) 的 string 依序黏接。投影片 以簡化英文語法示範：若 `TheNoun` 與 `VerbTheNoun` 是兩個 語言，concatenation 產生 `TheNounVerbTheNoun` 形式。切點不一定唯一；只要存在一個 decomposition \(w=xy\) 即屬於 concatenation。

若 \(L_1,L_2\) regular，從 \(N_1\) 每個 accepting state 加 epsilon edge 到 \(N_2\) start，並只把 \(N_2\) accepting states 留作整體接受。NFA nondeterministically 猜某個 prefix 已由 \(N_1\) 接受，在該點切換到 \(N_2\) 處理 remainder。存在成功 path iff 存在合法 split，故 regular 語言 對 concatenation closed。

若 \(\varepsilon\in L_1\)，機器可一開始就切到 \(N_2\)；若 \(\varepsilon\in L_2\)，讀完 \(L_1\) 後可立即接受。epsilon edges 正確處理這些 boundary cases，手動排除反而會漏字串。

## 語言 powers 與 Kleene closure

投影片 令 \(L^0=\{\varepsilon\}\)，\(L^{n+1}=L^nL\)。例如 \(L=\{aa,b\}\)，\(L^2\) 包含 `aaaa`、`aab`、`baa`、`bb`；每個元素是選兩個 L-words 後 concatenate。注意 \(L^0\) 不是空 語言 \(\varnothing\)：零次串接必須提供 identity \(\varepsilon\)。

Kleene closure 定義為

\[
L^\*=\bigcup\_{n\in\mathbb N}L^n,
\]

也就是串接零個或多個 L-words 的所有方式，所以永遠包含 \(\varepsilon\)。即使每個 \(L^n\) regular，不能只說 regular 語言 對 finite union closed 就直接推出無限 union；finite automaton 不會一般性地承受任意無限 union。

直接 NFA construction 才是證明。新增同時 start 與 accepting 的 state，epsilon 進入原 L-machine；從每個原 accepting state epsilon 回原 start，允許再跑一份 L。接受可在零次後停，也可在每次完整 L-word 後停。因此新 NFA recognize \(L^\*\)，再由 subset theorem 得 regular。

## 本講 closure toolbox 與使用限制

投影片 總結：若 \(L_1,L_2\) regular，則 complement、union、intersection、concatenation，以及 Kleene star 仍 regular。closure 證明 是 construction 證明：從已存在的 machines 組出新 machine。它能證某語言 regular，卻不能反向說「看起來無法組」便不 regular。

alphabet 必須先對齊。若兩機器原本 alphabets 不同，可選共同 \(\Sigma\)，補上缺少 symbols 到 rejecting sink，再做 product 或 union。complement 更要求 DFA complete；漏 transition 的非正式圖直接翻圈會錯。

## 可執行自測

挑一台三狀態 NFA，從 start epsilon closure 開始列 subset table。每個 row 對 0、1 各算一次 union；新 subset 加成 row，直到收斂。標出與 accepting set 相交的 rows，再用三條字串同步 trace NFA-state-set 與新 DFA，確認每步一致。

接著令 \(L_1\) 是以 0 結尾，\(L_2\) 是含偶數個 1。畫 product DFA，四種 state meanings 是兩個 Boolean 條件的組合，只有「以 0 結尾且偶數個 1」接受。最後用 \(L=\{aa,b\}\) 手列 \(L^0,L^1,L^2\)，確認 \(\varepsilon\) 只因零次重複必然存在，而不是假設 \(\varepsilon\in L\)。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「自動機階梯：能力要用語言區分」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 16: Finite Automata, Part III](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/16/)
- [Official Lecture 16 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/16/Lecture%20Slides.pdf)
- [MIT OpenCourseWare：Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154：Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
