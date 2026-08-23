---
title: "Stanford CS103 Lecture 15：有限自動機 II"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 17
tldr: "本講從「DFA 的形式定義把前半學期串起來」推進到「regular 語言 是「存在一台 DFA」」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「DFA 的形式定義把前半學期串起來」與「regular 語言 是「存在一台 DFA」」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-16-finite-automata-2-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 17 篇，對應 **Spring 2026 官方 Lecture 15（2026-05-04）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/15/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/15/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Finite Automata, Part II**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## DFA 的形式定義把前半學期串起來

投影片 先複習 alphabet、string、\(\varepsilon\)、語言 與 \(\Sigma^\*\)，再把 DFA 拆成先前學過的集合、函數與 Cartesian product。相對 alphabet \(\Sigma\)，一台 DFA 包含：states 集合 \(S\)、唯一 start state \(s_0\in S\)、accepting states 子集合 \(A\subseteq S\)，以及 transition 函數

\[
\delta:S\times\Sigma\to S.
\]

因為 start state 必須是 \(S\) 的 element，\(S\) 不可能是空集合。accepting set 則可以空，也可以等於整個 \(S\)。\(\delta\) 的 domain 是 ordered pairs；若 \(S=\{q_0,q_1,q_2\}\)、\(\Sigma=\{0,1\}\)，domain 有六個 pairs：每個 state 各搭配 0 與 1。函數對每一 pair 都必須有恰好一個輸出，這正是 deterministic 與「每個 symbol 一條邊」的形式版本。

機器 \(D\) 的語言仍是

\[
\mathcal L(D)=\{w\in\Sigma^\*\mid D\text{ accepts }w\}.
\]

注意五個物件的型別不能交換：\(s_0\) 是 state，不是 states 集合；\(A\) 是 states 子集合，不是單一 state；\(\delta(q,a)\) 回傳 state，不是 Boolean。accept/reject 是整條字串跑完後，檢查最終 state 是否在 \(A\) 所得到的 predicate。

## regular 語言 是「存在一台 DFA」

若存在 DFA \(D\) 使 \(\mathcal L(D)=L\)，就稱 \(L\) 為 regular 語言，也說 \(D\) recognizes \(L\)。這是存在定義：要證 regular，提供機器並說明其語言恰好是 \(L\)；只畫出一台接受若干正例的機器不夠，還要排除所有不屬於 \(L\) 的字串。

「recognize」不是接受一條指定 輸入，而是對每條 \(w\in\Sigma^\*\) 都正確分類。可用 state invariant 證明：說明讀完任意 prefix 後，每個 state 精確代表什麼，再由 accepting set 得到 iff。正向證「若 \(w\in L\)，最後接受」，反向證「若最後接受，\(w\in L\)」，兩邊缺一都不能建立語言相等。

## complement 必須相對同一個 universe

給 \(L\subseteq\Sigma^\*\)，它的 complement 是

\[
\overline L=\Sigma^\*-L.
\]

complement 不是「所有不是字串的東西」，也不能省略 alphabet。相同集合若放在不同 \(\Sigma^\*\) universe，補集會不同。投影片 的例子令 \(L\) 是 \(\{a,b\}\) 上含 substring `aa` 的字串；\(\overline L\) 就是同一 alphabet 上不含 `aa` 的所有字串。

對完整 DFA 取 complement，只需交換 accepting 與 nonaccepting states。每條 輸入 原本都有唯一 run，且最後 state 恰落在兩類之一，所以新機器接受當且僅當舊機器拒絕。因此 regular 語言 在 complementation 下 closed。投影片 說此 closure theorem 可在課內假設，圖像操作則展示理由。

投影片再問：若 \(L\) 不 regular，\(\overline L\) 是否也不 regular？答案是是。反證假設 \(L\) 不 regular 但 \(\overline L\) regular；由 closure，\(\overline{\overline L}=L\) regular，矛盾。這裡使用 double complement 與 closure，而不是錯誤地把原命題機械「取否定」。

## 從 DFA 改成 NFA：選擇成為計算的一部分

NFA 是 nondeterministic finite automaton。nondeterministic 表示每一步可有有限個 choices，包含零個。state 結構仍有限，但同一 state 讀同一 symbol 時可以走一條、多條或沒有 transition。若一條 path 遇到沒有 matching edge，它就死掉；其他仍存活的 paths 不受影響。

接受條件是存在一串 choices，使 輸入 全部讀完後位於 accepting state。這是一個存在量詞：只要一條 branch 成功就 accept；不是所有 branches 都要成功，也不是任選一條 branch 看運氣。要證 reject，則必須證所有可能 branches 都失敗。

投影片 以 bit-string NFA 示範 `01011`。從 \(q_0\) 讀某個 1 時既可留在追蹤主路徑，也可猜測「這也許是倒數第二個 1」而分支到 \(q_1\)。某些 guesses 太早會因後續符號不合而死；只要有一個猜測在輸入耗盡時走到 \(q_2\)，整台 NFA 接受。圖不是神諭式猜中，而是同時考慮所有有限選擇。

## NFA transition 的正確型別

單一 NFA state 對 symbol 的轉移結果是 states 集合，因此常寫

\[
\delta:S\times\Sigma\to\mathcal P(S).
\]

投影片 也從「目前可能 states 的集合」描述一步更新，此時 lifted transition 的型別是

\[
\widehat\delta:\mathcal P(S)\times\Sigma\to\mathcal P(S),
\]

把集合內每個 state 的 successors 做 union。兩種表示不要混用：前者輸入單 state，後者輸入 state-set。DFA 的輸出永遠恰好一個 state；NFA 的輸出可為 \(\varnothing\)、singleton 或多元素集合。

這個 powerset 視角消除了「機器到底在哪裡」的神祕感。讀完一個 prefix 後，維護所有仍可能到達的 states。初始集合是 start state（再加下一節的 epsilon closure）；每讀 symbol 就取所有 outgoing destinations 的 union。輸入結束時，可能集合只要與 accepting set 相交就接受。

## 死路不是整台機器 reject

投影片 的較簡 NFA 從 \(q_0\) 可以持續讀 `0,1`，也可在 1 上前往 \(q_1\)，再靠下一個 1 到 \(q_2\)。一條 branch 若到 \(q_1\) 後看見 0 而沒有 edge，該 branch dies。只有當所有 branches 都死去，或輸入結束時沒有任何 accepting branch，才 reject。

這裡最常見的誤判有三種。第一，看見一條死路便宣布 reject，忽略其他 path。第二，看見某 branch 中途到 accepting state便提前 accept，卻還有 輸入 未讀。第三，認為 NFA 必須選一條 edge；其實語意是存在 path，可以等價地追蹤所有 choices。

## ε-transition 不消耗輸入

NFA 還可有 \(\varepsilon\)-transition。機器可在任何時刻走任意有限次 epsilon edges，而不讀 輸入 character，也可以完全不走。圖上的 \(\varepsilon\) 是 transition label，不是 alphabet 中真的送進來的字元。

因此 trace 要把「目前 state-set」先取 epsilon closure：加入只靠零或多條 epsilon edges 可到達的 states；讀下一個真實 symbol；再取一次 closure。若 start state 經 epsilon paths 可到 accepting state，NFA 可能接受 empty string。反過來，有 epsilon edge 不代表必走；強迫走會錯失合法 accepting path。

投影片 的上下兩條 a/b 路徑以 epsilon edges 串接，輸入 `baabb` 可在不同時間切換分支。題目同時要求找一條接受與一條不接受的 state sequence，是在訓練量詞：存在失敗 path 不會推翻 acceptance，存在成功 path 才是決定性見證。

## 把 NFA 看成 powerset 上的 DFA

每次維護 possible-state set，就得到一台 DFA：它的 states 是 \(\mathcal P(S)\) 中可達的 subsets；一個 subset 讀字元後，移到所有 successor 的 union（含 epsilon closure）；只要 subset 含原 NFA accepting state，就標為 accepting。這是 subset construction 的核心直覺。

若 NFA 有 \(n\) states，理論上 subset DFA 至多有 \(2^n\) states，實際只需保留由 start subset 可達者。空集合也是合法 DFA state，代表所有 NFA branches 已死；它對任何後續 symbol 通常回到自己。這解釋了 NFA 的便利性不是額外的可辨識能力，而是圖可以更精簡、設計可以用「猜測」表達。

## 設計 NFA：拆成簡單語言再用 ε 分派

投影片 的設計題是

\[
L=\{w\in\{0,1\}^\*\mid w\text{ ends in }010\text{ or }101\}.
\]

先拆成 \(L_1\)（ends in `010`）與 \(L_2\)（ends in `101`）。每個 branch 可在前面任意讀 0/1，並 nondeterministically 猜測某位置是目標 suffix 的開頭；接著依序核對三個 symbols，且只有恰在 輸入 結束時抵達 final state 才接受。

再新增單一 start state，以兩條 epsilon transitions 分派到兩個子機器。新 NFA 的語言是 \(L_1\cup L_2\)：若字串屬於任一語言，就存在走入相應 branch 的 accepting path；若兩者皆否，所有 branch 都失敗。這套「拆成 simple 語言、各自造 machine、epsilon dispatch」是 投影片 明示的 NFA design recipe。

投影片後面把相同技巧擴充到多個條件，例如一個 branch 偵測指定 substring，另一個 branch 辨認不含某 character 的字串。每個 submachine 的 alphabet 必須一致；若某 branch 漏掉 symbol edge，它只是可能死去，不會破壞 NFA 定義。

## DFA 與 NFA 的量詞對照

DFA 對每個 輸入 有唯一 run，因此 accept 是「那條 run 結束於 accepting state」。NFA 對每個 輸入 有一組 runs，因此 accept 是「存在一條 run 結束於 accepting state」。語言定義仍是接受字串的集合；改變的是 run 的結構與接受量詞。

做 complement 時不能直接翻轉 NFA 雙圈：舊 NFA reject 表示所有 paths 拒絕，新圖翻圈後 accept 只需要存在一條原本 nonaccepting path，兩者不等價。要安全 complement，可先用 subset construction 轉成完整 DFA，再翻轉 accepting set。這個限制正好檢驗是否真的理解 existential acceptance。

## 可執行自測

第一題，令 \(S=\{q_0,q_1,q_2\}\)、\(\Sigma=\{0,1\}\)，完整列出 \(S\times\Sigma\) 六個 pairs，為 DFA transition table 每格填一個 state；再故意把一格改成兩個 states，說明它為何不再是 DFA 而可表示 NFA choice。

第二題，對任一 NFA 從 \(\{q_0\}\) 開始，以集合方式 trace `01011`。每一步先列 symbol，再列 successor union；有 epsilon edges 時前後都取 closure。最後檢查集合與 accepting set 是否相交。第三題，畫 ends-in-`010` or `101` 的兩個 branches，測試 `010`、`11010`、`1010`、\(\varepsilon\)，並逐一指出接受見證或所有 branches 失敗的原因。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「DFA 的形式定義把前半學期串起來」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 15: Finite Automata, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/15/)
- [Official Lecture 15 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/15/Lecture%20Slides.pdf)
- [MIT OpenCourseWare：Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154：Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
