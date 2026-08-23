---
title: "Stanford CS103 Lecture 20：圖靈機 I"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: zh-TW
series:
  name: "Stanford CS103 導讀"
  order: 22
tldr: "本講從「為何 CFG 之後還要換模型」推進到「長加法揭示 local access 原則」，依官方例題重建定義、推導與易錯邊界。"
description: "依官方投影片逐步整理「為何 CFG 之後還要換模型」與「長加法揭示 local access 原則」，並標明公開材料能支持的內容界線。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs103-lecture-21-turing-machines-1-en)

這是 [Stanford CS103 導讀](/series/stanford-cs103)的第 22 篇，對應 **Spring 2026 官方 Lecture 20（2026-05-15）**。課程團隊是 Cynthia Bailey Lee 與 Alex Aiken；公開頁面沒有逐堂標示實際講者，因此本文不猜講者。[講次頁面](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/20/)與[完整投影片](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/20/Lecture%20Slides.pdf)公開，錄影與逐字稿只在 Canvas／Panopto，本文沒有使用。

本講的官方題目是 **Turing Machines, Part I**。CS103 的讀法不是背一排名詞，而是依序問：物件如何定義、哪些輸入合法、主張要求什麼，以及什麼論證才足以支持結論。這篇依投影片的定義與例子整理；沒有出現在公開 投影片 的口頭補充，不會被補寫成課堂內容。

## 為何 CFG 之後還要換模型

finite automata 精確 recognize regular 語言，但像 \(\{a^nb^n\}\) 需要 unbounded counting。CFG 可以描述這類 recursive 語言，卻是 generator，不直接回答「一般 computing device 如何使用無界工作空間執行算法」。本講引入 Turing machine（TM），把有限控制與可任意延伸的 memory 分開。

投影片 的 語言 圖提醒：regular、CFL 只佔 all 語言 很小部分；我們想建立足以代表一般可行計算的模型。問題不是讓一步同時看到全部 memory，而是允許計算需要多少就逐格存取。

## 長加法揭示 local access 原則

投影片逐位做兩個很長整數的 addition。scratch space 可隨 digit 數增加，但任一時刻只需看當前兩 digits、carry 與局部輸出。這帶出關鍵 idea：即使計算整體需要巨大空間，每一步只需 access 少量位置。

TM 便把 memory 排成 cells。finite control 每一步只看 head 下的一格；透過反覆移動，仍可在任意長有限區域工作。infinite tape 是數學上「不預先設固定上限」，不是宣稱一次操作無限多資料。

## 歷史模型與課堂模型的界線

投影片 提到 Alan Turing 1936 年的 a-machine，但課堂語法不是原論文逐字重現。原模型、後來 Emil Post／Hao Wang 風格與現代 instruction presentation 在表面上不同，保留的核心是有限規則控制 head，在無界 tape 上 read、write、move。

因此本文只依 投影片 解釋 CS103 pseudocode TM。歷史名稱提供脈絡，不應把課堂每條 instruction 說成 Turing 原文的 notation。

## tape、head、blank 與初始 configuration

tape 由無限多 cells 組成，未使用 cells 含 Blank。輸入 string 連續寫在某段 tape 上，左右由 blanks 包圍；輸入 alphabet 不可包含 Blank，否則無法區分資料結尾與資料內字元。head 初始位於第一個 輸入 character；若 輸入 是 \(\varepsilon\)，head 指向全 blank tape 上某格。

一個 configuration 至少包括 program counter（下一條 instruction）、head position，以及每格目前 symbol。TM 每步可能 read head cell、覆寫它、向 Left/Right 移一格，或跳到某 label。雖然 tape 無限，任一有限時間 run 只造訪有限多 cells。

## 投影片 的第一支程式在檢查什麼

程式如下：

```text
Start:
  If Blank Return True
  If 'b' Return False
  Write 'x'
  Move Right
  If Not 'b' Return False
  Write 'x'
  Move Right
  Goto Start
```

每輪先要求目前不是 b；在 輸入 alphabet \(\{a,b\}\) 下，這等價要求 a，並改寫成 x。右移後要求 b，也改為 x，再右移開始下一 pair。遇 Blank 只可能在 pair boundary accept。因此它 recognize \((ab)^\*\)：\(\varepsilon\)、`ab`、`abab` 接受；`a` 在等待 b 時看到 Blank 拒絕；`aba` 下一輪讀 a 後再缺 b；`ba` 一開始便拒絕。

marker x 是 tape alphabet 的工作 symbol，不必屬於 輸入 alphabet。覆寫已讀 characters 表示「這一格已處理」，證明 TM 能把 tape 當 mutable scratch space，而 DFA 輸入 只能單向讀取且不能改。

## label 與 sequential execution

execution 從特殊 `Start:` label 後第一條開始。label 本身沒有效果，抵達它時只 move to next line；其他 labels 是 `Goto` targets。一般 instruction 若沒有 jump 或 return，就順序落到下一行。

這些細節會影響 trace。`If 'b' Return False` 在 cell 不是 b 時什麼也不做，接著執行 `Write 'x'`；它不是 if/else block，也不會跳過後續整段。讀 code 時應為每條 If 分開判斷，而非套用高階語言的 indentation 直覺。

## If、If Not 與 read semantics

`If symbol command` 比較 head 下 symbol；相等才執行 command，不等則直接下一行。`If Not symbol command` 則不相等時執行。symbol 可是 quoted character 或 Blank。

第一支程式的 `If Not 'b' Return False` 在 head 看見 b 時不執行 return，因而往下寫 x；看見 a、x 或 Blank 都立即 false。若忘記 Blank 也屬於「not b」，便會錯判 odd-length 輸入。

condition 不移動 head，也不改 tape，除非 command 本身是 Move、Write、Goto 或 Return。連續兩條 If 是兩次針對當下 configuration 的 tests；前一條沒 return 時後一條仍執行。

## Write、Move、Goto、Return

`Write symbol` 只覆蓋 head 所在 cell，不移動。`Move Left/Right` 只移一格，不讀寫。`Goto label` 改 program counter，不改 head 或 tape。`Return True/False` 立即 halt 並輸出 Boolean。若 execution 落出 program bottom，投影片 規定視同 `Return False`。

因此 trace 必須將三種位置分開：code line、head index、tape contents。只寫 tape snapshot 常會漏 Goto；只寫 code line會漏覆寫與 head movement。每步用 tuple `(label/line, head, finite nonblank tape window)` 最可靠。

## 手動 trace 第一支程式

以 `abab` 為例，head 初始在 index 0。第一輪 index 0 的 a 被改 x，移至 index 1；它是 b，改 x，移至 index 2，Goto Start。第二輪同樣處理 indices 2、3。head 到 index 4 Blank，Start 第一條 Return True，tape 的 輸入 段成 `xxxx`。

以 `abb` 為例，第一 pair 處理後 head 在第三個 b；Start 的 `If Blank` 不觸發，`If 'b' Return False` 觸發，立即 reject。以 `aa` 為例，第一 a 改 x，右移看到 a，`If Not 'b'` 觸發 reject。這些 counterexamples 分別測 extra symbol 與 pair mismatch。

## TM 的優勢：可以反覆掃描與標記

投影片 後半建立一支 TM，recognize

\[
L\_=\{w\in\{a,b\}^\*\mid \#a(w)=\#b(w)\}.
\]

高階 plan 是重複找最左邊未標記 character。若找到 a，就把它標 x，向右掃過 a 與 x，找到一個未標記 b 並標 x；若先到 Blank，代表缺 b，reject。若找到 b 則對稱地向右找一個 a。每配成一 pair，`GoHome` 向左移到 Blank，再右移回 輸入 起點。

Start 跳過 x，遇未處理 a 去 `FoundA`，遇 b 去 `FoundB`，全為 x 後碰 Blank accept。這支機器不要求所有 a 在 b 前，`abab`、`bbaa`、`abba` 只要 counts equal 都能 pairing。若某類多出，對應 Loop 掃到 Blank 時 false。

## pairing program 的 invariant 與 termination

核心 invariant 是：每次回到 Start，x-marked cells 可分成同樣多個原 a 與原 b；所有未標記 cells 保留原 symbols。FoundA 每成功一輪新增一個 a-marker 與一個 b-marker，FoundB 也相同，所以 invariant 保持。當 Start 看到 Blank 且沒有未標記字元，所有 輸入 symbols 已成 pairs，counts equal。

若 counts unequal，某輪選到多餘類別後，搜尋 counterpart 會到 Blank 並 false。若 counts equal，每個 outer iteration 至少標記兩個新 cells，輸入 finite，所以迭代至多 \(|w|/2\) 次，必 halt。\(\varepsilon\) 一開始 Blank，正確 accept，因兩種 counts 都為 0。

這同時完成 soundness、completeness 與 termination 三個責任。只說「每次消掉一對」未說明如何回到 start、何時發現缺 pair，仍不是完整 algorithm argument。

## TM composition：用小程序組大程序

投影片 總結 TM 可以 composed。`GoHome` 是可重用 subroutine：向左直到 Blank，再右移一格。pairing 的 FoundA/FoundB 是鏡像 routines。把 labels 當有明確 precondition/postcondition 的 blocks，比逐行記萬步 trace 更容易 reasoning。

例如 GoHome 的 precondition 是 head 位於 輸入 或右側 blank；postcondition 是 head 回到最左 輸入 cell（empty 輸入 則停在選定 blank）。routine 不應破壞 tape。設計新 TM 時先寫 blocks 的 contract，再展開 instruction，能降低 head off-by-one 錯誤。

## sorting idea 與算法層級描述

投影片最後提出另一條 route：若能把任意 a/b 輸入 sort 成所有 a 在前、b 在後，equal counts 就化為已熟悉的 \(a^nb^n\) check。動畫以局部 swaps 把 a 向左、b 向右。這說明同一 語言 可有多個 TM algorithms，也開始把思考從逐 instruction 提升到可 composition 的高階 operations。

投影片 沒在本講完整給出 sorting TM code，因此不能把某個特定 sorting algorithm 歸給課程。能確定的是 design idea：tape 可反覆掃描、交換或重寫，然後串接另一台已知 檢查器。

## TM 與 DFA/NFA 的關鍵差異

DFA/NFA 輸入 head 概念上只向右、輸入 不可改，額外 memory 只在 finite state。TM 可左移、右移、overwrite，並使用 輸入 外的 arbitrarily many blank cells。finite program 沒變，unbounded memory 來自 tape extent 與 run length。

但 TM 並非一步完成無限工作。任一 transition 仍是 local、finite；它也可能永不 halt。這個可能性將在下一講導致 decidability 與 recognizability 的差異。本講程式都有明確 return paths與可論證 termination，不應提前把「沒有 return」一律當 reject。

## 可執行自測

先對第一支程式逐 instruction trace \(\varepsilon\)、`ab`、`abab`、`a`、`abb`、`aa`，每步記 code line、head index 與 tape。歸納出它 recognize \((ab)^\*\)，再做兩方向說明：每輪只接受完整 ab pair；每個 \((ab)^n\) 會跑 n 輪後碰 Blank。

接著用 pairing program 的高階 blocks trace `abba` 與 `aab`。每輪寫被標記的原 symbol、尋得 counterpart、GoHome 後 tape；確認前者全 x accept，後者某 FoundA 掃到 Blank reject。最後刻意刪除 GoHome 的最後 `Move Right`，說明 head 停在左側 Blank 時下一輪會如何錯誤提前 accept。

## 材料缺口與閱讀界線

完整投影片足以辨認課程安排、定義與主要例子，因此這講通過 fidelity gate。但投影片不是錄影，不包含所有口頭轉折、學生問題或臨場補充。本文只把公開 投影片 能支持的內容歸於課程，不把作者的銜接文字包裝成講師原話。

## 更新紀錄

- 2026-08-22：依 clean review 重查「為何 CFG 之後還要換模型」的投影片覆蓋，並修正失效連結、metadata 與中文語域。

## 參考資料

- [Stanford CS103 Spring 2026 Lecture 20: Turing Machines, Part I](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/20/)
- [Official Lecture 20 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/20/Lecture%20Slides.pdf)
- [MIT OpenCourseWare：Theory of Computation](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/)\n- [Stanford CS154：Automata and Complexity](https://web.stanford.edu/class/cs154/)\n- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
