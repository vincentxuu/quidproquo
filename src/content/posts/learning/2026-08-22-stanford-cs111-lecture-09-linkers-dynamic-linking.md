---
title: "Stanford CS111 Lecture 9：object file、symbol、relocation、static 與 dynamic linking"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: zh-TW
series:
  name: "Stanford CS111 導讀"
  order: 10
tldr: "第 9 講沿著 source→assembly→object→executable→process，拆解 linker 的三次掃描、symbol relocation，以及 dynamic loader 如何用 jump table 把 shared library 位址延後到啟動時解決。"
description: "逐頁導讀 Stanford CS111 Spring 2026 Lecture 9：process memory layout、object sections、symbol table、unresolved references、linker 三個 passes、static linking 與 jump-table dynamic linking。"
draft: true
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs111-lecture-09-linkers-dynamic-linking-en)

這是 [Stanford CS111 導讀](/series/stanford-cs111)的第 10 篇，對應 **Stanford CS111, Spring 2026, Lecture 9**。2026-04-17 由 Mendel Rosenblum 主講，官方題目是 [Linkers and Dynamic Linking](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf)。本文依公開 PDF 與[課程行事曆](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)整理；錄影在 Canvas／Panopto 後面，沒有把它當成已讀來源。

Lecture 9 是課程的轉折：前一個三分之一完成 CPU、threads、processes、synchronization 與 scheduling；接著進入 main memory、process layout、virtual memory 與 paging，最後才是 storage 和 file systems。linker 看似是編譯工具，卻剛好把「程式如何成為記憶體中的 process」接起來。

## 1. Main memory 與 process layout 的問題

[官方 Lecture 9 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf)先固定硬體尺度。main memory 通常是 volatile DRAM，可 byte-addressable，但實際以約 64-byte cache line 搬移；投影片列出約 60–100 ns、200–300 CPU cycles 的 access time。容量例子是 laptop 16–64 GB、desktop 32–256 GB、server 512–4096 GB，server 還可能是 NUMA。這些是 Spring 2026 投影片的量級快照，不是跨所有機器的規格保證。

C++ 範例同時放入 `global`、指向 global 的 `gptr`、函式參數、stack local、指向 local 的 pointer，以及 `new int(42)` 配置的 heap object。投影片隨後把 process memory 簡化成低位址的 code（text）、data，以及高位址附近的 stack。source line 不會依原始檔順序原封不動躺在記憶體；compiler、assembler、linker 與 loader 逐步決定 representation 與位置。

這張圖也故意留下問題：兩個 process 同時載入時誰能取得 address 0？OS 自己的 code/data 在哪裡？一個 process 有多個 threads 時，每條 thread 都需要 private stack；已執行的 application 又如何加入更多 code？後續 virtual memory 會回答前幾題，本講則從最後一題切入 linking。

## 2. 從 source 到 running process 的五個階段

官方 pipeline 是：

```text
x.c --gcc--> x.s --as--> x.o \
y.c --gcc--> y.s --as--> y.o  --ld--> a.out --OS loader--> process
z.c --gcc--> z.s --as--> z.o /
```

Compiler 把 source code 轉成 assembly；assembler 把 assembly 編成 binary object file；linkage editor（Linux 的 `ld`，Windows 的 `LINK`）合併 object files 與 runtime libraries，產生 executable；OS loader 把 executable sections 放入記憶體，建立初始 process layout，然後跳到 code segment 的 start location。

這幾個角色不可互換。assembler 能決定一個 `.o` 內 instruction encoding 與局部 offset，卻不知道其他 object 最後排在哪裡；linker 看見整組 objects 後才能組合 sections 和解 external references；loader 則在執行環境建立 process。日常執行 `gcc main.c` 看似一步，只是 driver 替我們依序呼叫工具。

## 3. Runtime libraries 如何進入 process

Linker 還會納入 runtime libraries。PDF 列出兩類重要內容：`malloc`／C++ `new` 之類 memory allocation routines，必要時呼叫 OS 擴大 data segment；以及 system-call stub routines，負責進入 kernel。stack segments 通常按需求成長，而不是 executable 預先裝滿每一次函式呼叫需要的 stack bytes。

因此「連結完成」不代表 process 的每個 byte 都已存在。executable 提供 code、初始 data 與 metadata；loader 建立 layout；runtime 再依執行需求長出 stack、heap 或映射。這也是 object file 的 data section 和 runtime stack 必須分開理解的原因：stack 在 object file 中一開始是空的，local variables 由呼叫時配置。

## 4. Object file 為何故意不完整

Assembler 面對最終位置未知的 function calls 與 external data references，只能留下 placeholder（投影片用 0 示意）與 relocation 資訊。object file 的任務不是直接可執行，而是把已知 bytes 和未知連結需求完整交給 linker。

PDF 列出的內容有四類：

1. **Sections**：code/text 與 data，各自有 size、starting address 和 initial contents；stack 初始為空。
2. **Symbol table**：對外有興趣的 routines 與 non-stack variables，記錄 name 與目前位於哪個 section/offset。
3. **Unresolved references**：哪個 location 需要哪個 symbol address。
4. **Debugging information**：source line、structure layout、variable location 等，讓 debugger 設 breakpoint 或解釋記憶體。

「symbol 的 current location」常是 object 內相對位置，不是最終 process address。Linker 的核心工作就是先決定 section placement，再把 `section + offset` 轉成 executable 中可用的位置，回填所有引用。

## 5. `main.o`、`stdio.o`、`math.o` 的範例

範例 `main.c` 宣告外部 `sin`、`printf`、`scanf`，讀入數字、計算 sine 並輸出。`stdio.c` 定義 `stdin`、`stdout`、`printf`、`scanf`，內部又引用 `fputc`、`fgetc`；`math.c` 提供 `sin`。

[官方 Lecture 9 PDF 的 object 範例](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf)中，`main.o` 的 text section 裡，offset 30 與 86 都有 `call printf`，52 有 `call scanf`，60 有 `call sin`。data section 在 offset 0、14、17 存三個 format strings。symbol table 說 `main` 在 `T[0]`，字串 `_s1/_s2/_s3` 在 `D[0]/D[14]/D[17]`；unresolved list 則表示 text offsets 30、86、52、60 和字串引用位置仍需回填。

[同一份官方 object 範例](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf)裡，`stdio.o` 的 `printf` 在 text offset 44、`scanf` 在 232；`stdin` 與 `stdout` 位於 data offsets 0、8。它同樣不是封閉世界：offset 118 要載入 `stdout`，122 呼叫 `fputc`，306 載入 `stdin`，310 呼叫 `fgetc`。每個 object 只承諾自己的 definitions 與 references；linker 才在整組輸入中建立一致名字空間。

## 6. Linker 的三次掃描

投影片把 linkage editor 簡化成 three passes。

依[官方 Lecture 9 PDF 的三階段範例](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf)，**Pass 1：讀 section sizes，計算 memory layout。** 範例依序放 `main.o text` 於 0–95、`stdio.o text` 於 96–507、`math.o text` 於 508–719、`main.o data` 於 720–759、`stdio.o data` 於 760–835。數字的用途是示範 base address 如何由前面 sections 的大小累加，不是規定真正 ELF linker 必須用同一排列。

[官方三階段範例](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf)的**Pass 2：讀所有 symbols，建立完整 symbol table。** `main` 的最終地址仍是 0；`_s1` 從 `main.o D[0]` 變成 720，`_s2` 成為 734，`_s3` 成為 737。`printf` 是 `stdio.o T[44]`，加上該 text section base 96 後得到 140；`scanf` 得 328；`stdin/stdout` 得 760/768；`sin` 在 `math.o T[0]`，得到 508。

[官方三階段範例](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf)的**Pass 3：讀 sections 與 unresolved references，更新 addresses，寫出 executable。** 例如 `main.o` text offset 30 原本是 `call 0` 並附有 `printf T[30]` relocation；查完整 symbol table 得 `printf=140` 後，輸出位置 30 被改成 `call 140`。其他 function calls、data references 也用相同契約處理。

三次掃描的依賴很清楚：不知道 sizes 就不能排 layout；沒有 layout 就不能把 symbols 轉成 final addresses；沒有完整 symbol table 就不能 resolve references。真實 object formats 的 relocation type、alignment、architecture encoding 更複雜，但 PDF 的三步模型已說清 linker 為何不能只「串接 bytes」。

## 7. Static linking 的完整性與浪費

到這裡描述的是 **static linking**：每個 executable 自成完整程式，所有 references 在連結時解決。好處是啟動時不必再尋找這些 library functions，且 executable 明確攜帶它需要的程式碼。代價是 language libraries 變大後，不同 programs 各帶一份相同 code；它們同時執行時，memory 中也可能有多個 copies。

問題不是只有 disk size。若 library 修補 bug，static executable 不會自動改用新版本，通常要重新 link；相對地，這也提供版本固定與部署可預測性。PDF 本身只強調 wasted memory，後兩點是理解 static/dynamic 邊界的延伸，不應誤寫成投影片逐字主張。

## 8. Dynamic linking：把位址決定延後

Shared libraries 允許多個 processes 在 memory 共用 library code 的 single copy。困難是 library location 到 program 載入時才知道，所以 references 不能全在原本 static link 階段寫死。dynamic linking 把一部分 resolution 延後到 program startup／execution environment。

投影片用 **jump table** 解釋一種做法。主程式的 `call printf` 不直接跳入 `stdio` 最終地址，而是先指向 table entry。entry 記錄 function name（如 `printf`）、含該 function 的 shared-library filename，以及一條尚未知目標的 jump instruction。jump table 放在 data section。

在 `main` 執行前，dynamic-loader code 掃描 jump table，map 所列 shared libraries，再把 `JMP XXX` 填成 `JMP printf` 的實際入口。之後 call site 保持不變，經 table 多一跳到 shared function。位址知識被集中在可更新 entry，而不必改寫每個呼叫位置。

## 9. Jump table 的契約與限制

這個設計把三件事拆開：static linker 知道「需要 `printf` 且應走哪個 entry」；loader 知道「本次 process 把 library map 在哪裡」；CPU 執行時只遵循已填好的 jump instruction。它解決 location late binding，也讓同一 library code page 可由多個 processes 映射。

代價包括啟動時要 map 與 resolve、每次呼叫可能多一層 indirection，以及 executable 對 library name／介面相容性的依賴。官方 PDF 只展示 startup 時掃完整張 table，沒有展開 ELF 的 PLT/GOT、lazy binding、symbol interposition、ASLR 或 security hardening；本文因此不把那些現代細節塞回這個簡化 jump-table algorithm。

可用一個最小除錯順序檢查 linker 問題：definition 是否真的存在於輸入 objects/libraries？symbol name 與 visibility 是否一致？reference 的 section/offset 是否正確？layout 後的 base 加 offset 是否得到預期地址？dynamic case 還要確認 loader 找得到指定 shared library。這些問題直接對應 object file 與三 passes，而不是只重跑 compiler 碰運氣。

## 10. 從 linker 回到 OS 的主線

本講最終交付的不是 `ld` 旗標清單，而是一條 representation pipeline。source 的名字與結構先被 compiler 降成 assembly；assembler 產生含 placeholders 的 relocatable objects；linker 以 section sizes、symbols、unresolved references 建 executable；loader 才把它變成記憶體中的 process。每一層只在擁有足夠資訊時作決定。

Static linking 在 build time 完成 resolution，換取自足但可能重複的 executable；dynamic linking 把 library placement 延後，換取共享與彈性，也新增 loader、jump table 與 compatibility 的執行期契約。下一段課程要討論 virtual memory 與 paging；到時「兩個 processes 為何都能看見自己的 address 0」以及 shared pages 如何成立，就有了可銜接的 code/data layout。

## 參考資料

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 9 slides: Linkers and Dynamic Linking](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [System V ABI：Object Files](https://refspecs.linuxfoundation.org/elf/gabi4+/ch4.intro.html)
- [GNU `ld` manual](https://sourceware.org/binutils/docs/ld/)
- [Linux manual：dynamic linker/loader](https://man7.org/linux/man-pages/man8/ld.so.8.html)
