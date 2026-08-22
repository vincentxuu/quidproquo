---
title: "Stanford CS107 Lecture 26：Wrap-up，六個系統問題與下一站"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, computer-science, learning-path]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 27
tldr: "CS107 第 26 講用六個大問題收束十週內容：representation、text、memory、generics、execution 與 allocation；它以 explicit allocator 檢查學習成果，並把後續路線指向 CS111 與其他 systems 課。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 26：六個核心問題、學習目標、explicit allocator 綜合案例、Sebastian C，以及 CS111 等後續課程。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-wrap-up-next-steps-en)

Lecture 26 不再加入一套新機制，而是回頭問：十週之後，我們現在能解釋哪些一開始只會使用的東西？從 `int` 的 bits、C string 的終止 byte、pointer 與 lifetime，到 generic memory operation、assembly execution 與 heap allocator，CS107 把「程式能跑」逐步改造成「能說明它如何表示、在哪裡存在、由誰維護契約」。

本講公開投影片是 wrap-up 骨架，課堂 Q&A 沒有公開 transcript。本文因此只整理投影片明列的六個問題、程式成長對照、allocator 綜合例、learning goals、Sebastian C 與後續課程地圖；不替現場問答編造內容，也不把課程清單擴寫成選課保證。

## 本講資料與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 26，2026-03-09
- 官方標題：Wrap-Up / What's Next?
- 講者：Jerry Cain
- 已讀材料：官方 calendar、完整公開投影片、Stanford CS107 與 CS111 公開課程頁
- 材料缺口：Q&A、Canvas 錄影與 AFS examples 未公開；本文只能覆蓋已刊出的 wrap-up slides

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)將這堂列為最後正式內容講次。[完整投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/26/Lecture26.pdf)依序回顧六個 big questions、比較最初 C programs 與 explicit allocator、核對 learning goals、展示 Sebastian C、定位 CS107 在課程地圖上的位置，介紹 CS111 與其他後續課程，最後致謝。

## 六個問題比六份名詞表更重要

第一個問題是 representation：電腦如何用有限 bits 表示 integers 與 floating-point values？答案不只是一張編碼表，還包含位寬、signed interpretation、overflow 與 machine arithmetic 的限制。能看出某個計算超出可表示範圍，比背出 hexadecimal 轉換更接近 learning goal。

第二個問題是 text：較複雜資料如何被表示與操作？C string 用連續 `char` 加終止 null byte 建立慣例；array 本身不攜帶 length，函式收到 pointer 後也不會自動知道 capacity。字串處理因此同時是 representation、bounds 與 contract 的練習。

第三個問題是 memory：如何有效管理 pointers、stack 與 heap？這裡的「管理」包括 object lifetime、ownership、alias、allocation failure 與 cleanup。地址只是數字；合法 dereference 還需要正確 object、範圍、型別與存活期間。

第四個問題是 generics：如何用 memory representation 寫出可處理任意 data type 的 code？`void *`、byte count、function pointer 與 `memcpy` 能拿掉重複，但同時移除部分 compiler checks。Generic interface 的力量來自明確交接寬度、comparison semantics 與 callback contract，而不是假裝型別不存在。

第五個問題是 execution：C 如何編譯並執行成 assembly？課程從 register、addressing mode、ALU、condition codes、jumps、loops 到 function call convention，讓 source control flow 能追到 machine instructions。重點不是記住某次 build 的每個 register，而是沿著 dataflow、control flow 與 calling convention 解釋 observable behavior。

第六個問題是 allocation：`malloc` 與 `free` 如何運作，內建 allocator 是否永遠適合？三堂 heap allocator 把 headers、alignment、free-list search、splitting、coalescing 與 in-place `realloc` 組成一套 invariants。從 API client 走到 implementer，是全課最完整的抽象層穿透。

## 從第一支 C 程式到 explicit allocator

投影片把早期程式並排：讀 `argc`／`argv`、走訪並印出 arguments、用 bitwise operation 算 absolute value、反轉 C string，以及用 `void *` 與 `memmove` 寫 generic rotate。這不是取笑簡單題，而是提醒每個例子都埋著後續主題。Absolute-value 公式仍受 [Lecture 5 對 `INT_MIN` signed overflow 的分析](/posts/learning/2026-08-22-cs107-shifts-and-gdb)約束；wrap-up 再次展示它，不會把 undefined behavior 變成可用實作。

`argv[argc - 1][0]` 同時用 pointer、array indexing、C string 與 short-circuit evaluation。`reverse` 要保存終止 byte 並維持 indices 合法。`absolute_value_bitwise` 依賴 signed representation 與 shift 行為的分析。`rotate` 更把 address difference、byte width、overlap-safe move 與 generic contract 放在同一個 function。

最後的 explicit allocator 圖顯示成長不是「程式碼變長」而已。`malloc` 要搜尋 explicit free list、標記 header、把節點 splice 出 list，並在剩餘空間足夠時 split 成新 free block；`free` 要更新狀態、把 block 接回 list，並維持 coalescing 規則。每一步同時改 physical heap 與 logical list，任何 stale pointer 都可能讓兩種視圖分裂。

這個例子也是自我測驗：若能在紙上畫出 block addresses、sizes、used/free status、payload 與 next/prev links，再逐步模擬一次配置和釋放，就不只是「完成作業」，而是能操作課程核心 invariant。

## Learning goals 是能力階梯

投影片把成果分成 fluency、competency 與 exposure。Fluency 包含 C pointers/memory，以及 executable address space 與 runtime behavior；意思是遇到 code 時能自然追蹤，不必每次靠猜測 segment 或印幾個地址碰運氣。

Competency 包含 C 與 assembly 間的翻譯、尊重 computer arithmetic limits、找出 bottleneck 並改善 runtime、操作自己的 Unix environment，以及使用倫理框架思考軟體設計。這組合很關鍵：systems 能力不只在 machine code，也包括量測、工具與能力使用的責任。

Exposure 則是 computer architecture、compiler 與 assembler basics。課程沒有聲稱一學期後已能設計處理器或完整 compiler；它提供足以看穿抽象層、知道下一個問題在哪裡的介面。把 exposure 誤寫成 mastery，反而會失去後續學習方向。

[CS107 官方課程頁](https://web.stanford.edu/class/cs107/)把目標放在理解程式如何在 machine 上執行，以及寫出可靠的 systems code。Wrap-up 的清單不是額外 rubric，而是把一路使用的 debugging、assembly、memory 與 ethical reasoning 重新集中。

## Sebastian C 是一個綜合出口

投影片以 [Sebastian C 影片](https://www.youtube.com/watch?v=G7LJC9vJluU)作為輕鬆的 synthesis。公開 deck 沒有文字解說，因此本文不替影片指定唯一寓意；能確認的是，它被放在 learning goals 之後、course map 之前，作為十週技術密度中的收束節點。

讀者可以把它當成一次反向索引：影片或 demo 中看到 source、compiler、memory、machine behavior 時，試著標記它對應六個問題中的哪一個。若某個現象無法解釋，就回到該講的 representation 或 invariant，而不是只記住表面結果。

## 下一站 CS111：從一個程式走向共享系統

課程地圖把 CS107 放在 CS106B/X 之後，旁邊是 CS103 與 CS109，後面連到 CS111 與 CS161。這張圖表達方向，不是本文替每位學生制定的 prerequisite 判定；實際選課仍應查當期 catalog 與自己的背景。

投影片對 CS111 提四個問題：程式如何 concurrent 執行並共享資源？為何每個 process 像是擁有完整 address space？如何設計 persistent filesystem？如何實作 processes、threads、filesystems 與 virtual memory 等 operating-system services？這正好把 CS107 的單一 process model 擴大成資源共享、隔離與持久性。

[Stanford CS111 官方頁](https://web.stanford.edu/class/cs111/)把課程定位為 Operating Systems Principles。若 CS107 最吸引你的是 function call、address space、allocator 或 Unix tools，CS111 是自然延伸；但「自然」不表示輕鬆，它要求把局部 invariant 提升到 concurrency、failure 與跨程式資源管理。

投影片另列 CS112、CS212、CS143、CS144、CS145、CS149、CS152、CS155、CS181、CS182、CS221、CS246、EE108 與 EE180。這份清單涵蓋 OS projects、compilers、networking、databases、parallel programming、security、ethics、AI、data mining 與 digital systems。公開材料只提供名稱，本文不替各課補上未刊出的推薦順序。

## 如何檢查自己真的學會

用一個陌生但不大的 C program 做 capstone。先寫出每種資料的 bit-level representation 與合法範圍；畫 stack、heap、globals 與 code 的 lifetime；標出 owners、borrowers 與 aliases；再編譯、讀一段 assembly，確認 parameter、branch 與 return；最後用 profiler 找 hot path，只改一件事並重新量測。

再加一張責任清單：程式處理誰的資料、失敗會傷害誰、測試是否取得授權、logs 是否保存敏感資訊。若分析同時涵蓋 correctness、performance 與 ethics，就對應了投影片列出的 competency，而不是把倫理留在與 code 無關的一頁。

Lecture 26 的結論不是「所有 systems topics 都學完了」。更準確的說法是：現在有六個穩定問題，可以帶進下一門課與下一個 bug。資料如何表示？文字契約在哪裡？記憶體何時有效？泛型拿掉哪些檢查？source 如何成為 execution？allocation 由哪些 invariants 支撐？能持續提出並驗證這些問題，就是 CS107 真正留下的工具。

## 更新紀錄

- 2026-08-22：把 wrap-up 的 absolute-value 回顧明確連回 Lecture 5 的 `INT_MIN` signed-overflow caveat。

## 參考資料

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 26 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/26/Lecture26.pdf)
- [Stanford CS107 official course page](https://web.stanford.edu/class/cs107/)
- [Stanford CS111: Operating Systems Principles](https://web.stanford.edu/class/cs111/)
- [Sebastian C](https://www.youtube.com/watch?v=G7LJC9vJluU)
