---
title: "Stanford CS103 Lecture 24：不可解問題 II"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 26
tldr: "本講從「HALT 的定義與位置」推進到「為何 HALT 可辨識」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「HALT 的定義與位置」與「為何 HALT 可辨識」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-25-unsolvable-problems-2-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 26 篇，對應 **Spring 2026 官方 Lecture 24（2026-05-25）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/24/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/24/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Unsolvable Problems, Part II**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## HALT 的定義與位置

halting problem 問：給 TM M 與字串 w，M(w) 最終會 halt 嗎？這裡 halt 包含 accept 與 reject，排除 infinite loop。寫成 語言：

\[
HALT=\{\langle M,w\rangle\mid M\text{ is a TM that halts on }w\}.
\]

HALT 與 \(A\_{TM}\) 都位在 RE、但不在 R。差別是前者接受 M 的兩種 terminating outcomes，後者只接受 true/accept。它們都說明 R 真包含於 RE，而非兩個名字指同一集合。

## 為何 HALT 可辨識

recognizer `checkHalt(M,w)` 直接執行 M(w)。若 M accept 或 reject，呼叫終於回傳；不管 result 是 true 或 false，checkHalt 都 accept，因已觀察到 halt。若 M loop，呼叫永不返回，recognizer 也 loop。member 必 accept、nonmember 不 accept，因此 \(HALT\in RE\)。

與 `checkATM` 比較：後者在 M returns false 時 reject，只有 true 才 accept；前者在兩者都 accept。兩台機器遇到 loop 都無法越過模擬呼叫。這個 code-level 差異正對應兩個 語言 的 membership 定義。

## 為何 HALT 不可判定

若 HALT decidable，就有總停機函式 `willHalt(M,w)`。用 own-source construction 寫 trickster：取得 me；若 willHalt(me,輸入) 預測 halt，就進入無限迴圈；若預測 loop，就 return true。前者讓「halt」預測錯，後者讓「不 halt」預測錯。故不存在這種 decider，\(HALT\notin R\)。

投影片 因時間略過正式 證明，但模板與 ATM 相同：假設 decider、以其 output 構造反向行為、將分析對象設為 constructed program 自己、推出預測 iff 預測錯。不可只說「它看來很難」；contradiction 才排除所有 algorithms。

## RE 減 R 的執行語意

若 \(L\in RE\setminus R\)，有某 M 使 \(\mathcal L(M)=L\)，但任何 recognizer 都無法在所有 輸入 halt，否則它就是 decider。至少一個 nonmember 必讓該 recognizer loop：member 不能 loop，因 recognizer contract 要求 accept；若所有 nonmembers 也 reject，就已 total。

這不表示每個 L-recognizer 在同一 nonmember loop，也不表示每個 nonmember 都 loop。量詞是「不存在一台對所有 輸入 halt 的正確 recognizer」。HALT 與 ATM 是這個區域的兩個具體 見證。

## verification：答案難找，證據可能易查

面對五千行 TM code 與 輸入 `abbababababbbb`，直接問是否 halt 很難。若有人另給 hint「恰在第 20 步 halt」，驗證者只需模擬正好 20 步驟：第 20 步觀察到 accept 或 reject就 accept 證明憑證；否則 reject。這個 bounded simulation 永遠停止。

若第 20 步 accept，原 pair 在 HALT；若第 20 步 reject，同樣在 HALT，因 halt 不只 accept。若 20 步後還 running，只能說 證明憑證 20 無效，不能推出不在 HALT；也許第 21 或更晚 halt。這是 verification 的不對稱性。

## verifier 與 證明憑證 的正式定義

語言 L 的 verifier 是永遠 halt 的 TM V，且對每個 w：

\[
w\in L\quad\leftrightarrow\quad \exists c\in\Sigma^\*.\ V\text{ accepts }\langle w,c\rangle.
\]

使 V accept 的 c 稱 證明憑證。soundness 方向：只要 V accepts 某 pair，就保證 w 是 member。completeness 方向：每個 member 至少有一個 helpful 證明憑證。量詞是存在 c，不是所有 c；member 也可搭配大量 unhelpful 證明憑證 被 reject。

V 自己必對每個 \(\langle w,c\rangle\) halt。若它 reject 一張 證明憑證，資訊不足：可能 w 是 member 但 c 選錯，也可能 w 是 nonmember、根本沒有任何 c 可成功。這與 decider reject 直接證明 nonmember 不同。

## 為何 V 的 語言 通常不是 L

V 的 raw 輸入 是 encoded pair，因此

\[
\mathcal L(V)=\{\langle w,c\rangle\mid V\text{ accepts }\langle w,c\rangle\},
\]

而 L 是 w 的集合。型別已不同，通常不能寫 \(\mathcal L(V)=L\)、\(\mathcal L(V)\subseteq L\) 或反向 subset。verifier 定義是把 \(\mathcal L(V)\) 對 證明憑證 coordinate 做 existential projection 後得到 L。

證明憑證 格式依 語言 設計：可能是 步 count、方程變數 assignment、graph nodes set，或完整 Sudoku board。定義不承諾 證明憑證 唯一、最短或容易找到；只要求 member 存在至少一張，且 V 對給定證據能停機檢查。

## hailstone verifier 的逐步判讀

令 L 是 hailstone sequence 會終止的自然數 encodings。`checkHailstone(n,c)` 最多執行 c 次 update，每次偶數除二、奇數變 \(3n+1\)，看到 1 就 true，做完仍未到 1 就 false。有限 for-loop 保證對任意 n,c halt。

若 n 的 sequence 在 t 步驟 到 1，所有 \(c\ge t\) 都能作 helpful 證明憑證，因此通常有無限多張；短於 t 的 c 被 reject，並不否定 n∈L。若 sequence 永不終止，沒有任何 c 被接受。這正符合 existential 定義。

## ATM 的 verifier

對 \(A\_{TM}\)，證明憑證 可選「M 在多少 步驟 內 accept w」。`checkWillAccept(M,w,c)` 建立 simulation，跑 c 步驟，最後檢查是否在 accepting state。迴圈有限，所以 verifier always halts。

若 M accepts w，它必在某有限 t 第一步進 accepting state，選 c=t（或依 simulation 約定足夠大的 c）即可 accept。反之，若 verifier accept，代表確實觀察到 M accepting，所以 \(\langle M,w\rangle\in A\_{TM}\)。若 M reject 或 loop，沒有 證明憑證 能偽造 accepting configuration。

HALT verifier 與此只差最後 condition：HALT 證明憑證 可由第 c 步的 accept 或 reject 支持；ATM 證明憑證 必展示 accept。兩者都把 unbounded search 壓到 證明憑證 給定的 finite horizon。

## verifier 推出 recognizer：枚舉所有 證明憑證

給 L-verifier V，構造 `isInL(w)`：依 length 0,1,2,... 列舉所有字串 c，逐一執行 V(w,c)，一旦 accept 就 accept w。因 alphabet finite，每個長度只有有限 證明憑證；V 每次必 halt，所以搜尋不會卡在某張壞 證明憑證。

若 w∈L，存在某有限 c；length-order enumeration 最終到它並 accept。若 w∉L，所有 c 都被 reject，外層枚舉無限繼續而不 accept。故這是 recognizer，證明「有 verifier ⇒ \(L\in RE\)」。不能任意列出字串而永遠漏掉某個 c；枚舉必 exhaustive。

## recognizer 推出 verifier：證明憑證 當 步 bound

反方向從 L-recognizer M 出發。定義 `checkIsInL(w,c)` 模擬 M(w) 最多 c 步驟，然後回傳 M 是否已在 accepting state。即使 M 原本可能 loop，bounded simulation 永遠 halt；第二 輸入 c 解決 verifier 需要兩個 輸入 的形式。

若 verifier accept，就看到 M accept，因此 w∈L。若 w∈L，recognizer 必在某有限 t accept，取 c=t 即得到 證明憑證。這證明「\(L\in RE\) ⇒ 有 verifier」。rejecting run 不會錯認 member；looping run 對任何固定 c 也只產生有限模擬與 false。

## 核心等價與 證明 觀點

兩方向合起來：語言 有 verifier iff 它在 RE。從 verifier 到 recognizer 是 try all 證明憑證；從 recognizer 到 verifier 是 enforce a 步 count。這類似 DFA/NFA/regex 從不同機制刻畫同一 Regular class，只是此處刻畫 RE。

verifier 明確檢查 membership 證明；recognizer 可看成搜尋 證明。找到 證明憑證 就能說服別人 w∈L，找不到時可能永遠搜尋。非 RE 語言 更極端：不存在一般 verification system，甚至已知 w 是 member 時也未必有有限、可機械檢查的 證明憑證 能說服他人。

## 可執行自測

先比較 HALT/ATM：M accept、reject、loop 三列，各寫兩個 recognizer outcome。再驗證 步-20 三案例，特別說明「20 步未停」為何不是 nonmember 證明。接著對 verifier 定義逐字標註 \(\forall w\)、\(\exists c\) 與 V always halts。

最後自己重建兩個 conversion。V→M 要回答枚舉為何公平、單次檢查為何不會卡住；M→V 要回答 c 如何保證停機、member 為何一定有某個 c。若把 \(\mathcal L(V)\) 寫成 L，請先列兩邊 element type 修正。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「HALT 的定義與位置」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 24: Unsolvable Problems, Part II](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/24/)
- [Official Lecture 24 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/24/Lecture%20Slides.pdf)
- [Alan Turing, On Computable Numbers (1936)](https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf)
- [MIT OpenCourseWare：Recognizability and Undecidability](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/resources/mit18_404f20_lec6/)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
