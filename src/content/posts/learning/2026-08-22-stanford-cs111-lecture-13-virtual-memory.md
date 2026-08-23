---
title: "Stanford CS111 Lecture 13：位址空間、relocation、base-and-bound 與保護"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 14
tldr: "第 13 講從 single-tasking 與 load-time relocation 的失敗出發，以 MMU 的 base/bound 建立 virtual/physical address spaces、透明隔離與 traps，再用 segmentation 解開單一連續區域的限制。"
description: "逐頁導讀 Stanford CS111 Spring 2026 Lecture 13：memory-sharing goals、load-time relocation、MMU、base/bound、trap transitions、segmentation、sharing 與 fragmentation。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-13-virtual-memory-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 14 篇，對應 **Stanford CS111, Spring 2026, Lecture 13**。2026-04-27 由 Mendel Rosenblum 主講，官方題目是 [Virtual Memory](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

前半課程把一個 core 分享給 concurrent threads；從今天開始，要把一份 physical memory 分享給 concurrent processes。PDF 採歷史順序，讓每個新機制都針對前一版的失敗，而不是直接把現代 virtual memory 當成魔法。

## 1. Single-tasking 與四個 memory-sharing goals

Early batch monitors 與早期 MS-DOS 一次只讓一個 program 占據 memory，OS 也在同一 physical layout。好處是簡單有效率；壞處是 programs 無法共存，錯誤程式可以寫壞 OS 或整台 machine。

PDF 用四個 goals 評估後續設計。**Multitasking**：多個 processes 同時 memory-resident；**transparency**：每個 process 感覺擁有自己的 memory，不必知道共享；**isolation**：process 不能 corrupt 其他 process 或 OS；**efficiency**：分享不能嚴重降低 CPU 或 memory 效率。Single-tasking 只有 efficiency，其他三項都是 No。

這四項不是同義詞。把兩個 programs 放入 memory 已達 multitasking，卻不代表它們看不到彼此；隔離可以靠昂貴 software checks 達成，卻可能不 efficient。每次演進都要重新填 scoresheet。

## 2. Load-time relocation：能共存，不能保護

早期 sharing 讓 loader 在載入時像 linker 一樣，修改 program 中所有 addresses，把 process 放進不同 physical region。這讓多個 processes resident，且每個 compiled program 不必一開始知道自己的 physical base。

限制首先是 process size 必須 static declaration，載入後不能實用地 grow；process 也不能移動。其次，runtime 沒有 bounds enforcement，一個 bad pointer 仍能寫入別人或 OS。最後，variable-size contiguous regions 產生與 first/best-fit heap 相似的 fragmentation。

投影片評分是 multitasking Yes、transparency No、isolation No、efficiency Yes。Transparency 為 No 的原因是 relocation 改寫 program image，位置仍被固定在 physical layout；更重要的是，所有 instruction/data references 都必須在 load 時找出並修正，動態建立的 addresses 很難涵蓋。

## 3. Dynamic address translation 與兩個 address spaces

關鍵轉折是每次 memory access 都在 runtime translation。CPU 產生 **virtual address**；Memory Management Unit（MMU）把它轉為 **physical address** 後才送到 memory。Program 只看 virtual address space，physical address space 才是 DRAM 的真正配置。

代價是硬體必須處理 every instruction fetch、load、store，不能靠罕見 slow path。Translation 因此要快，且 protection check 最好與 address calculation 平行。好處是 process 的 instruction 仍可使用從 0 開始的 addresses，OS 可在 context switch 換 translation state，將相同 virtual addresses 指到不同 physical regions。

例如 Process 1 可有 0–1999、Process 6 有 0–999、Process 3 有 0–2999 的 virtual spaces；physical memory 則把它們分別放在 0、2000、5000 附近。相同 virtual 0 對每個 process 意義不同，回答了前講「誰取得 address 0」的問題。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf)）

## 4. Base and bound 的硬體契約

最早的簡單 MMU 稱 **base and bound**，只有兩個 hardware registers。`base` 是 process 在 physical memory 的起點；`bound` 是 virtual address-space size。每次 reference 同時做：比較 `virtual_address >= bound`，越界就 fault；否則計算 `physical_address = base + virtual_address`。

範例中 Process 3 使用 base 5000/bound 3000，Process 6 使用 2000/1000，Process 1 使用 0/2000。只要 OS 在 dispatch 時載入正確 registers，每個 process 都能從 virtual 0 執行，而 bounds check 阻止它超出自己的 contiguous region。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf)）

Protection 不能只檢查加完後的 physical address；先以 virtual address 對 bound 比較可避免 overflow 或跨界。PDF 的圖把 add 與 compare 平行，說明 efficiency 來自 simple hardware，而不是省略 isolation。

## 5. CALL/RETURN relocation 的逐步例子

另一例中 base=6000、bound=2000。CPU 的 virtual PC=62，該位置 instruction 是 `CALL 140`；MMU 取 instruction 的 physical address 是 6062。CALL 保存 virtual return address 66 到 stack：virtual SP 從 1420 變 1416，實際 store 位於 physical 7416；PC 再成為 virtual 140。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf)）

重要的是 stack 內保存 **66 而非 6066**。Program-visible pointers、PC 與 return addresses 都留在 virtual space，每次使用才加 base。若 process 之後 relocation 到 base 0，相同 code、stack value 66、PC 140 都不需改寫；MMU 自動讓 instruction 位於 physical 62、stack 位於 1416。

這就是 transparency 的具體含義：relocation 不只對 source variables，而是對所有 runtime-created addresses 都一致。Compiler、function call convention 和 heap pointers 不必知道 physical placement。

## 6. Process 與 OS 的 atomic transition

OS 本身在投影片模型中關閉 relocation/MMU，以 virtual address 直接作 physical address。Processor Status Register（PSR）含 relocation on 與 user mode bits。User process trap 進 OS 時，硬體必須 atomic 地保存 program counter、從 interrupt vector 取得新 PC、關 translation 與 user mode。

Return from trap 則 atomic 地重新開 translation/user mode 並 restore saved PC。若順序可被 user code 插入，process 可能在 privileged mode 或 translation disabled 時執行，直接破壞 TCB。Interrupt-vector entry 因此同時保存舊 PC、指定新 PC 與新 PSR value。

Context switch 還要換 base/bound registers，因為它們是 process address-space state。PDF 沒有在本頁重畫完整 dispatcher，但這正好連回 threads/processes：CPU state 不只 general registers，也包含控制 memory interpretation 的 privileged registers。

## 7. Base/bound 達標，卻被單一 region 限制

Base/bound 的 scoresheet 四項皆 Yes：多個 processes resident；virtual addresses 提供 transparency；bound fault 提供 isolation；一加一比的 hardware path 提供 efficiency。但每個 program 只有一個 contiguous variable-size region。

這不符合 code、data、stack 的不同需求：code 應 read-only，data/stack 要 read-write，stack 可能獨立 grow。單區域也不能共享 read-only code，仍有 external fragmentation，process growth 困難。即使可以搬動整個 process 來 compact，成本也高。

Bottom line 是「one region too limiting」。問題不是 dynamic translation 錯，而是 translation metadata 只有一組 base/bound，無法表達程式內部結構。

## 8. Segmentation：多組 base/bound 與 protection

Segmentation 把 process 拆成數個 variable-size segments；MMU segment map 每列保存 type/base/bound/protection。例如 code 映到 physical 1000、長 1000、R/O；data 映到 3000、長 2000、R/W；stack 映到 8000、長 2000、R/W。Translation 是 table lookup 加上 add/compare，仍接近 base/bound 的簡單硬體成本。（[官方講義](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf)）

Reference 必須同時提供 segment number 與 offset。PDP-10 例子用 high-order address bit 選 high/low segment；PDP-11 可由 instruction 類型隱含選 code 或 data；original x86 則在 instruction/prefix 指定 segment。不同 ISA encoding 不同，契約都是先選 descriptor，再以 offset bounds/protection 檢查。

各 segment 可獨立 grow/shrink、swap to disk、移動以 compact physical memory；多 processes 也可把 code segment 指向同一 physical region，共享 read-only instructions 而保有 private data/stacks。Protection 成為 segment property，而不再是整個 process 一個權限。

## 9. Segmentation 的下一個瓶頸

Segmentation 仍有限制。固定 segment 數量無法自然支援任意多 mappings，例如 `mmap` files；variable-length physical allocations 仍造成 fragmentation；address space 被 rigidly divided，program/ISA 必須知道某 reference 屬於哪個 segment。

所以 segmentation 改善了 base/bound 的「一區到底」，卻沒有消除 variable-size placement。下一步 paging 會把 address space 切成固定大小 pages，以另一種 metadata 與 translation trade-off 解決。Lecture 13 的核心方法是保留四個 goals，再逐代定位哪個 representation 太弱：load-time relocation 缺 runtime protection，base/bound 只有一區，segmentation 又受固定數與 variable lengths 限制。


## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 13 slides: Virtual Memory](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [OSTEP：Address Spaces](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf)
- [OSTEP：Address Translation](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-mechanism.pdf)
- [OSTEP：Segmentation](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-segmentation.pdf)
