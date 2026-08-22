---
title: "Stanford CS103 Lecture 18：非正規語言"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 20
tldr: "本講從「四種 regular 的說法已經等價」推進到「finite memory 的精確直覺」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「四種 regular 的說法已經等價」與「finite memory 的精確直覺」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-19-nonregular-languages-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 20 篇，對應 **Spring 2026 官方 Lecture 18（2026-05-11）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/18/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/18/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Nonregular Languages**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## 四種 regular 的說法已經等價

投影片 開頭收束前三講：下列條件等價——L regular；存在 DFA \(D\) 使 \(\mathcal L(D)=L\)；存在 NFA \(N\) 使 \(\mathcal L(N)=L\)；存在 regex \(R\) 使 \(\mathcal L(R)=L\)。因此證 nonregular 時，只需排除其中一種表示，其他三種也一起不可能。

證 regular 很容易提供正面 見證：畫 DFA、NFA 或寫 regex。證 nonregular 則是全稱否定，要排除**所有可能 DFA**，不能只說自己試了三張圖都失敗。這是本講要建立的新 證明 technology。

## finite memory 的精確直覺

投影片以 button UI、TCP/IP state diagram 與 app lifecycle 說明有限狀態模型。任何實體電腦的 RAM 與 storage 雖然巨大，仍只有有限多個 bit configurations；原則上可把每個 configuration 當 DFA state，把每種離散 輸入 當 alphabet symbol。states 數量荒謬地大，不影響「有限」這個數學分類。

regular 語言 對應只需有限種 memory summaries 的問題。nonregular 語言 則要求輸入增長時產生無上限的、彼此不能混合的 summaries。這不是說現實程式完全不能處理有限長度樣本，而是沒有固定有限 state set 能對所有可能長度都正確。

一個 語言 無限並不代表 nonregular。\(a^\*\)、\(\Sigma^\*\) 都有無限多 strings，卻只需極少 states。關鍵不是 語言 cardinality，而是不同 prefixes 對未來 suffix 的反應是否必須永遠區分。

## 第一個候選 E：相等數量且順序固定

令 \(\Sigma=\{a,b\}\)，

\[
E=\{a^nb^n\mid n\in\mathbb N\}
=\{\varepsilon,ab,aabb,aaabbb,\ldots\}.
\]

先看幾個錯誤 regex。\(a^\*b^\*\) 允許不同數量，如 `aab`；\((ab)^\*\) 交錯 blocks，不包含 `aabb`；列舉 \(\varepsilon\cup ab\cup a^2b^2\cup a^3b^3\) 只覆蓋有限個 n。NFA 的嘗試也會遇到同一障礙：有限 states 不能記住前面究竟讀了多少 a，之後便無法要求完全相同數量的 b。

直覺「需要計數」仍不是 證明，因為某些 counting 只需 modulo information，例如偶數個 a 是 regular。必須說明 E 為何需要辨識每一個精確 count，而非有限多類別。

## 為何 a² 與 a⁴ 不能到同一 state

假想一台 recognize E 的 DFA。讀完 \(a^4\) 與 \(a^2\) 後，若落在同一 state，再餵完全相同 suffix \(b^4\)，兩次 run 必定沿相同 transitions 抵達同一 final state。但 \(a^4b^4\in E\)，而 \(a^2b^4\notin E\)。final state 若 accepting，錯收後者；若 rejecting，錯拒前者。兩種都矛盾。

因此 \(a^2\) 與 \(a^4\) 必須落在不同 states。相同論證可對任意 \(m\ne n\) 使用 suffix \(b^m\) 或 \(b^n\)：其中一條補成 equal counts，另一條不能。這就把「要記精確數量」改寫成「無限多 prefixes 必須到不同 states」。

## distinguishability 的定義與量詞

對任意 \(L\subseteq\Sigma^\*\)，若存在 \(w\in\Sigma^\*\)，使 \(xw,yw\) 中恰好一個屬於 L，就稱 x、y relative to L distinguishable，記為 \(x\not\equiv_L y\)：

\[
\exists w\in\Sigma^\*.\;(xw\in L\leftrightarrow yw\notin L).
\]

w 稱 distinguishing suffix。它必須附加在兩個 strings 的**右側**且完全相同。不能對 x 加一條、對 y 加另一條；那無法測試兩 prefixes 是否可共享同一 DFA memory state。

對 E，\(a^2\not\equiv_E a^4\)，w 可選 \(b^4\)：\(a^4b^4\in E\)，\(a^2b^4\notin E\)。也可選 \(b^2\)，此時前者不在、後者在。定義只需存在一個 見證，不要求每個 suffix 都區分。

## distinguishable strings 必須抵達不同 DFA states

定理：若 x、y relative to L distinguishable，任何 recognize L 的 DFA 在讀 x 與 y 後必須位於不同 states。反證假設兩者抵達同一 q。取 定義 保證的 suffix w；determinism 表示從同一 q 讀同一 w 必到同一 final state，因此 xw 與 yw 會同時接受或同時拒絕，與恰好一個在 L 矛盾。

這個 theorem 是從 語言 semantics 到 memory lower bound 的橋。每一組 pairwise distinguishable prefixes 都要求獨立 state。反方向在完整 Myhill–Nerode characterization 也成立，但 投影片 此處只需「無限 distinguishing set 推出 nonregular」的方向。

## distinguishing set 必須 pairwise

集合 \(S\subseteq\Sigma^\*\) 稱為 L 的 distinguishing set，若任意兩個不同 \(x,y\in S\) 都 relative to L distinguishable。重點是 pairwise：不是每個 element 都能與某個固定字串區分，也不是每對共用同一 suffix。w 可以依 pair 改變。

要驗證 S，證明 skeleton 是：「任取不同 x,y∈S；不失一般性設定其參數 m<n；選明確 suffix w；計算 xw、yw 的 membership，證恰好一個在 L。」再另外證 S infinite。只展示三對例子不能建立任意 pair。

## Myhill–Nerode 的 nonregular criterion

投影片 使用的定理是：若 L 有一個 infinite distinguishing set S，則 L nonregular。證明結合有限 states 與 pigeonhole principle。

反證假設 L regular，故有 DFA D。令 D 有 k states。因 S infinite，可從中選 k+1 個不同 strings。把它們跑過 D，k 個 states 是 pigeonholes，k+1 個 strings 是 pigeons，所以至少兩條 x≠y 抵達同一 state。可是 S distinguishing，x、y 必 distinguishable；上一 theorem 又要求任何 L-DFA 將它們送到不同 states。矛盾，因此不存在 D。

這裡「S infinite」真正使用的位置，是針對未知但有限的 k 總能取 k+1 個。證明 不能先假設 DFA 有某個固定大小，也不用知道最小 DFA 長什麼樣。

## E 的完整 nonregular 證明

取

\[
S=\{a^n\mid n\in\mathbb N\}.
\]

S infinite，因每個 n 給不同長度的 string。任取 \(a^m,a^n\in S\) 且 \(m\ne n\)。選 suffix \(w=b^m\)。則 \(a^mb^m\in E\)，而 \(a^nb^m\notin E\)，因 a 與 b 數量不同。故每對不同 elements 都 distinguishable，S 是 infinite distinguishing set。由 theorem，E nonregular。

若採 w=\(b^n\) 也成立，只是 membership 方向交換。要明寫 m≠n，否則第二條不在 E 的結論沒有依據。也要把 \(\varepsilon=a^0\) 包含在 S 與 E；當 m=0 時 w=epsilon，仍能區分 epsilon 與任何正長 a-prefix。

## 第二個例子 EQ：必須記住整段內容

令 alphabet \(\Sigma=\{a,b,\mathrel{≟}\}\)，

\[
EQ=\{w\mathrel{≟}w\mid w\in\{a,b\}^\*\}.
\]

`ab≟ab`、`bbb≟bbb` 與 `≟`（w=epsilon）在 EQ；`ab≟ba`、`bbb≟aaa`、`b≟` 不在。此語言不只要記長度，還要記 separator 左側每一個 symbol 及順序，才能與右側逐字比對。

取 \(S=\{a,b\}^\*\)。它 infinite，因已包含 \(a^n\) for every n。任取不同 x,y∈S，選 suffix \(\mathrel{≟}x\)。則 \(x\mathrel{≟}x\in EQ\)，而 \(y\mathrel{≟}x\notin EQ\)，因 y≠x。因此任意不同 pair distinguishable，S 是 infinite distinguishing set，EQ nonregular。

suffix 必須包含 separator；若只選 x，concat 後未必有合法 EQ 格式。S 本身選 separator 前的 possible left halves，這讓 見證 能以「separator + 其中一半」完成一條正例並使另一條成反例。

## 如何發現 distinguishing set

先找機器在讀某個 prefix 後「理論上需要記住」的資訊。E 需要記 a-count，所以候選 prefixes 是所有 \(a^n\)；EQ 需要記完整 left half，所以候選是 \(\{a,b\}^\*\)。接著不要停在 intuition，要為任意不同 pair 設計共同 suffix，讓其中一個被補成 valid member，另一個失敗。

若候選 S 中有兩條無法找到 suffix 區分，縮小或重選 S。S 不需等於整個 語言，也不需 elements 本身在 L；E 的 \(a^n\) 在 n>0 時都不屬於 E，仍是完美 prefixes。目標是未來行為不同，不是當下 membership 不同。

## 常見失敗證法

「語言 infinite」不夠，因 regular 語言 可 infinite。「必須 counting」不夠，因 modulo counting 可有限狀態完成。「我畫不出 DFA」只描述人的嘗試。「有 infinitely many prefixes」也不夠；必須 pairwise distinguishable，否則多個 prefixes 可安全合併一 state。

另一個錯誤是對每 pair 用不同的兩條 suffix。定義要求同一 w 同時接到 x、y。還有人只證 xw∈L，沒證 yw∉L；這只給 positive 例子，沒有 distinguishability。最後，closure 性質 若用反方向也會出錯：L regular 推得操作後 regular，不代表操作後 nonregular 就能在任何方向任意回推，除非寫出合法 contrapositive 與其他前提。

## 可執行自測

對 \(E\)，取 pairs \((a,a^3)\)、\((\varepsilon,a^2)\)、\((a^4,a^7)\)，各用較短者對應數量的 b 作 suffix，逐行寫兩個 concatenations 與 membership。接著假設一台 DFA 只有 5 states，從 \(S\) 選 6 條 prefixes，說明 pigeonhole collision 如何與 distinguishability 衝突。

對 EQ，取 x=`abba`、y=`abab`，使用 suffix `≟abba`；確認 `abba≟abba` 在而 `abab≟abba` 不在。最後嘗試 S={a^n b | n∈N} 是否能證 E：找 suffix 前先注意 prefix 已含 b，分析能否對任意 pair 完成合法 \(a^kb^k\)。這項失敗練習會迫使你檢查候選集合是否真的方便構造 見證。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「四種 regular 的說法已經等價」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 18: Nonregular Languages](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/18/)
- [Official Lecture 18 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/18/Lecture%20Slides.pdf)
- [MIT OpenCourseWare：Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154：Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
