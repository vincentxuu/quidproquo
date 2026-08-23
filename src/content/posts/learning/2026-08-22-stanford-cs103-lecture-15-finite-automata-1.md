---
title: "Stanford CS103 Lecture 14：有限自動機 I"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 16
tldr: "本講從「為什麼先研究一台很弱的電腦」推進到「從裝置行為抽出狀態機」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「為什麼先研究一台很弱的電腦」與「從裝置行為抽出狀態機」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-15-finite-automata-1-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 16 篇，對應 **Spring 2026 官方 Lecture 14（2026-05-01）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/14/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/14/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Finite Automata, Part I**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## 為什麼先研究一台很弱的電腦

本講從 computability theory 的大問題開始：什麼問題能由電腦解決？困難在於「電腦」會隨硬體世代改變，而且真實電腦複雜到不適合每次都從電路證明。課程因此引入 automaton：它像圖抽象社交網路一樣，用數學模型保留與計算能力有關的結構，拿掉實作雜訊。理想模型要同時足以涵蓋一大類裝置，又簡單到能做嚴格推理。

投影片 比較計算機與桌機，提出兩個差別：記憶容量，以及演算法是否固定。計算機的顯示與內部狀態有限，功能集合固定；桌機有大量記憶並可重新編程。本單元先隔離第一個方向，研究「固定、有限記憶」能做到什麼。算盤的資料存在木珠、演算法由人執行，電子計算機則把兩者放進硬體；材質不同不妨礙它們共享有限組態這個抽象。

## 從裝置行為抽出狀態機

投影片整理這些裝置的共同模式：外部輸入依序到達，每次是一個離散單位；每個輸入使裝置改變 configuration；輸入耗盡後，由最後 configuration 讀出 YES 或 NO。有限自動機便把所有可能的有限記憶組態畫成 states，把收到字元後的變化畫成 labeled transitions。

一個 state 不是「執行到第幾行」，而是讀完目前 prefix 後，未來判斷仍需保留的全部資訊。start arrow 指向唯一的起始狀態；雙圈表示 accepting state。機器從 start state 出發，由左至右逐字讀 輸入 string，每讀一個字元，就沿同標籤的 transition 移動。只有在所有字元都讀完後，才看所在 state：雙圈則 accept，否則 reject。中途經過雙圈不代表立刻停止。

投影片 的四狀態例以 \(a,b\) 為輸入，逐格播放 `ababba`。正確 trace 要寫成「當前狀態、尚未讀取 suffix」，每一步恰好消耗一個字元。不能跳過重複字元，也不能先看最終字元猜答案。這種有限機器計算的是 predicate：每個輸入最後只回 YES/NO，而且運算所用記憶是固定有限量，不隨輸入長度增加。

## alphabet、character、string 的型別

形式語言從 alphabet 開始。alphabet \(\Sigma\) 是有限、非空的 symbols 集合；其中每一個 symbol 稱 character。string over \(\Sigma\) 是由 \(\Sigma\) 中字元組成的有限序列。若 \(\Sigma=\{a,b\}\)，`a`、`abbababba` 與更長的 a/b 序列都是 strings；引號只是排版選擇，不是字串本體的一部分。

空字串沒有任何 characters，以 \(\varepsilon\) 表示，長度為 0。它不是「一個名叫 epsilon 的字元」，也不是空集合。若 \(\Sigma=\{a,b\}\)，則 \(a\in\Sigma\)，而 \(\varepsilon\notin\Sigma\)，因為 alphabet 的 elements 是 characters。不過 \(\varepsilon\) 確實是一個由 \(\Sigma\) 字元形成的有限序列，所以 \(\varepsilon\in\Sigma^\*\)。

型別檢查可以避免四個相似符號混在一起：\(\in\) 是 element-of 關係；\(\varepsilon\) 是一個 string；\(\Sigma\) 是 characters 的 set；\(\Sigma^\*\) 是所有 strings 的 set。`ab` 通常不屬於 \(\Sigma\)，但屬於 \(\Sigma^\*\)。\(\{ab\}\) 則是一個只含一條 string 的 語言，而不是 string。

## 語言 是字串集合

語言 over \(\Sigma\) 是 \(\Sigma^\*\) 的子集合：

\[
\Sigma^\*=\{w\mid w\text{ is a string over }\Sigma\},\qquad L\subseteq\Sigma^\*.
\]

例如在 \(\Sigma=\{a,b,c\}\) 上，palindrome 語言 包含 \(\varepsilon,a,b,c,aa,bb,cc,aba,aca,bab,\ldots\)。語言可以是有限或無限集合；每一個 element 仍是有限字串。這兩句不矛盾：集合有無限多個元素，不表示某個元素本身無限長。

層級應固定為：語言 是 strings 的 sets；strings 是 characters 的 finite sequences；alphabets 是 characters 的 finite nonempty sets。若題目問 `abba` 是否在 palindrome 語言，使用 \(\in\)；若問 palindrome 語言 是否為 \(\{a,b\}^\*\) 的一部分，使用 \(\subseteq\)。把 element 與 subset 符號交換，是後續自動機證明最常見的型別錯誤之一。

## 自動機的語言

給一台處理 \(\Sigma\) 上字串的 automaton \(A\)，它的 語言 定義為

\[
\mathcal L(A)=\{w\in\Sigma^\*\mid A\text{ accepts }w\}.
\]

左側 \(\mathcal L(A)\) 是集合，不是某次 run 的答案。右側先限制候選 \(w\) 的型別，再以 accept predicate 篩選。要證兩台機器語言相同，不能只跑幾個範例；要證對任意 \(w\)，兩者接受與否一致。

投影片 的兩狀態機 \(D\) 處理 \(\{a,b\}\)。狀態 \(q_0\) 表示目前不是以 a 結尾，\(q_1\) 表示目前以 a 結尾；讀 a 進 \(q_1\)，讀 b 回 \(q_0\)，且 \(q_1\) 接受。因此

\[
\mathcal L(D)=\{w\in\{a,b\}^\*\mid w\text{ ends in }a\}.
\]

空字串沒有最後一個字元，從 start state 不移動；若 start 非 accepting，它被 reject。`a` 結束於接受狀態；`ab` 最後讀 b 回拒絕狀態；`bba` 最後讀 a 到接受狀態。state 的意義由所有進出 transition 維持，不只是貼在圓圈旁的直覺標籤。

## 圖上的縮寫與三個小判讀

一條標成 `a,b` 的邊代表讀 a 或 b 都走這條 transition，不是一次讀兩個字元。self-loop 仍會消耗一個字元；start arrow 不是 transition，也不消耗輸入；雙圈只標 acceptance。投影片 讓讀者判讀三張小圖，目的在分開「如何 trace」與「機器接受哪個集合」。

第一類圖可以只有 start state 接受，任何讀入都離開它，因而只接受 \(\varepsilon\)。另一類圖需要讀足夠長的 prefix 才可能到 accepting state，邊上的 `0,1` 表示該位置不在乎是哪個 bit。判讀時先跑 \(\varepsilon\)，再跑長度 1、2、3 的所有代表，寫出每個 state 記住的 invariant；不要看到 accepting circle 就直接描述語言。

投影片 的 `0110` 與 `000` 動畫也提醒：輸入同一字元可因當前 state 不同而走不同邊。transition 是「state 與 symbol 共同決定下一 state」，不是 symbol 單獨決定。若 trace 某步沒有可走邊，或同時有兩條同標籤邊，這張圖尚未符合下一節 DFA 的規格。

## 為什麼需要 deterministic 的完整規格

只靠非正式 state diagram，兩個問題沒有答案：某 state 對某 symbol 沒有 outgoing transition 時怎麼辦？同一 state 對同一 symbol 有多條 transition 時又選哪一條？若要證明 finite automata 能與不能做到什麼，模型必須對所有輸入都有唯一行為。

DFA 是 deterministic finite automaton，相對某 alphabet \(\Sigma\) 定義。每個 state 對 \(\Sigma\) 的每一個 symbol 必須**恰好一條** outgoing transition；有唯一 start state；accepting states 可以是零個、一個或多個。恰好一條同時排除 missing transition 與 ambiguous transition，也使每個 輸入 string 產生唯一 run。

檢查一張圖是否為 \(\{0,1\}\) 上的 DFA，對每個 state 建兩欄 0 與 1。每格必須恰好填入一個 destination。標 `0,1` 的單邊會同時填兩格；兩條不同的 0-edge 會使 0 欄重複；缺少 1-edge 會留下空格。再確認 start arrow 恰好一個。accepting state 的數量不影響 determinism，沒有雙圈的完整圖仍是一台永遠 reject 的 DFA。

## DFA 的五元組與 transition 函數

雖然本講主要以圖介紹，圖可壓成標準五元組

\[
D=(Q,\Sigma,\delta,q_0,F).
\]

\(Q\) 是有限 states 集合，\(\Sigma\) 是有限非空 alphabet，\(\delta:Q\times\Sigma\to Q\) 是總函數，\(q_0\in Q\) 是 start state，\(F\subseteq Q\) 是 accepting states。圖上「每個 state 每個 symbol 恰有一邊」正等價於 \(\delta\) 是 total 函數：每個 pair 都有而且只有一個輸出。

對整條字串可遞迴延伸 transition：\(\delta^\*(q,\varepsilon)=q\)，以及 \(\delta^\*(q,xa)=\delta(\delta^\*(q,x),a)\)。DFA 接受 \(w\) 當且僅當 \(\delta^\*(q_0,w)\in F\)。這個寫法把「由左到右逐字走圖」變成可放進集合定義與證明的 predicate，也明確處理 empty string。

## 設計 state 的方法：記住未來真正需要的摘要

設計「以 a 結尾」的 DFA 時，不必記整個 prefix，只需記最後字元是否為 a。更一般地，先問：兩個已讀 prefixes 若對所有 future suffix 都會得到同一接受結果，是否可以放在同一 state？state 應代表足以決定未來的有限摘要。

例如要接受含偶數個 1 的 bit strings，只需 even 與 odd 兩 states；讀 0 留在原 state，讀 1 在兩者間切換，even 同時是 start 與 accepting。空字串包含零個 1，因此必須接受。這個例子不是 投影片 的新定理，而是把 投影片 的 state-as-memory 設計原則變成可操作練習。

## 可執行自測

先令 \(\Sigma=\{a,b\}\)，逐項標註型別：\(a\in\Sigma\)、\(ab\in\Sigma^\*\)、\(\varepsilon\in\Sigma^\*\)、\(\{a,ab\}\subseteq\Sigma^\*\)。故意把其中一個 \(\in\) 改成 \(\subseteq\)，說明左右兩側型別為何不合。

再選 投影片 的「以 a 結尾」機器，手寫 trace table：列出 \(\varepsilon,a,b,aa,ab,ba,bb\)，每個字元後記錄 state。最後用一句 invariant 描述兩 states，確認表格結果與 \(\mathcal L(D)\) 定義一致。最後審核任一候選 DFA：逐 state、逐 alphabet symbol 數 outgoing edges。只看圖形對稱或每個 state 的總邊數，無法保證 determinism。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「為什麼先研究一台很弱的電腦」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 14: Finite Automata, Part I](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/14/)
- [Official Lecture 14 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/14/Lecture%20Slides.pdf)
- [MIT OpenCourseWare：Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154：Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
