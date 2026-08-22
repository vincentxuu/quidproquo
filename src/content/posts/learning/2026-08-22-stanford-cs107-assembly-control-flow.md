---
title: "Stanford CS107 Lecture 17：從乘除法到 %rip，讀懂 x86-64 control flow"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, control-flow]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 18
tldr: "CS107 第 17 講先完成 x86-64 的 full-width multiplication 與 division，再沿著 instruction bytes 追蹤 %rip，最後以 direct／indirect jmp 說明程式如何離開預設的順序執行。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 17：imul/mul、idiv/div、cqto、兩組反組譯練習、program counter、instruction encoding 與 unconditional jumps。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-assembly-control-flow-en)

`addq` 的結果仍放得進一個 64-bit register，但兩個 64-bit 數相乘可能需要 128 bits；division 更特別，dividend 橫跨 `%rdx:%rax`，quotient 與 remainder 又分別回到這兩個 registers。Stanford CS107 Lecture 17 先收完這組「一個 operand，卻暗中讀寫多個 registers」的 ALU operations，再問另一個更根本的問題：CPU 怎麼知道下一條 instruction 在哪裡？

答案是 `%rip`。一般情況下，它隨目前 instruction 的 encoded length 前進；遇到 `jmp`，它改成指定 target。這講刻意只走到 unconditional jump，尚未介紹 condition codes 或 conditional jumps。讀者若把後續 flags、`cmp`／`test`、`jcc` 或 function call stack mechanics 提前塞進來，反而會模糊本講用 instruction bytes 建立的基本模型。

## 本講資料、缺口與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 17，2026-02-13
- calendar 標題：Introduction to Control Flow Operations
- 投影片標題：Assembly: Arithmetic and Logic Wrap, Control Flow
- 講者：[完整 PDF](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/17/Lecture17.pdf) metadata 列 Jerry Cain
- 指定閱讀：Bryant 與 O'Hallaron，*Computer Systems: A Programmer's Perspective* 3.5–3.6
- 已讀材料：官方 calendar、完整 19 頁投影片、GNU assembler AT&T/Intel syntax 文件、2025 AMD64 System V ABI
- 材料缺口：Canvas 錄影與 AFS lecture code 未公開；指定教科書不在公開材料內，本文不宣稱已讀

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)說本講會完成 ALU operations，接著介紹 control flow 與 unconditional jumps。[完整投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/17/Lecture17.pdf)的 agenda 依序是：two-operand 與 one-operand multiplication；signed／unsigned division 與 remainder；`cqto`；`div_and_mod` reverse engineering（相同解答頁重複一次）；`tinker_toy` etude；instructions 也是 memory 裡的 bytes；以五個地址逐步追蹤 `%rip`；預設按 instruction length 前進；`jmp` 改寫 program counter；由 backward jump 還原 infinite loop；最後區分 direct 與 indirect jump。

範圍也要明確：本講第 19 頁以「如何有條件地跳？」收尾，沒有回答。Conditional control、condition codes 與 loop translation 屬於後續材料，本文不提前補寫。投影片中的 `push %rbp` 與 stack 區域只出現在示例 listing；本講沒有解釋 call frame，因此也不把它延伸成 stack-frame 教學。

## 乘法有兩種形狀：截斷結果，或保留完整 128 bits

Lecture 16 已介紹 two-operand `imul S,D`：

```asm
imulq %rsi,%rax       # %rax = low64(%rax * %rsi)
```

它把 product 截斷成 destination width，再寫回第二 operand。若 C 只需要 machine-width result，這種形狀直接；但 64×64 的完整 product 最多需要 128 bits，單一 64-bit register 放不下。

one-operand form 使用 implicit registers 解決：

```asm
imulq %rsi            # signed:   %rdx:%rax = %rax * %rsi
mulq  %rsi            # unsigned: %rdx:%rax = %rax * %rsi
```

列出的 operand 只提供另一個 factor；第一個 factor 固定來自 `%rax`。結果低 64 bits 放 `%rax`，高 64 bits 放 `%rdx`，合稱 `%rdx:%rax`。冒號表示把兩個 registers 串成一個 128-bit quantity，不是 memory addressing syntax，也不是先做 `%rdx` 除以 `%rax`。

`imulq` 與 `mulq` 的 bit-level 低半部可能相同，但高半部依 signed 或 unsigned interpretation 產生。若只看 `%rax` 並丟掉 `%rdx`，很多輸入會讓兩者看似無差；要判斷程式是否真的需要 full product，必須追蹤後續是否使用高半部。

這也說明 instruction arity 不能只用「幾個值參與」理解。one-operand multiply 在文字上只有 `S`，卻隱含讀 `%rax`，並同時覆寫 `%rax` 與 `%rdx`。做 liveness analysis 或手動 tracing 時，兩個 implicit effects 都要列出。

## Division 先準備 128-bit dividend，再同時得到 quotient 與 remainder

`idivq S` 做 signed division，`divq S` 做 unsigned division。兩者都把 `%rdx:%rax` 視為 128-bit dividend，以明列的 64-bit `S` 當 divisor：

```text
%rax = quotient
%rdx = remainder
```

因此 division 前不能只把 x 放進 `%rax` 就直接執行。高半部 `%rdx` 也是 dividend 的一部分；若保留先前任務留下的 bits，輸入就不是原本的 x。signed 64-bit dividend 通常用：

```asm
movq %rdi,%rax
cqto
idivq %rsi
```

`cqto` 把 `%rax` 的 sign bit 延伸到整個 `%rdx`：非負值令 `%rdx` 全零，負值令它全一，使 `%rdx:%rax` 成為同一 signed value 的 128-bit representation。它不會讀 memory，也沒有明列 operand。

unsigned division 的準備邏輯不同：若 dividend 真的只有 64 bits，通常要把 `%rdx` 清零，再執行 `divq`。不能用 `cqto` 取代，因為最高 bit 為一的 unsigned value 不是負數，卻會被 `cqto` 補出全一的高半部。

兩種 division 都必須把 divisor 為零與 quotient 放不進 destination 視為錯誤條件；本講投影片沒有展開 exception mechanics，所以本文也不虛構 signal 或作業系統處理流程。眼前要保留的 contract 是：dividend 準備正確、divisor 是唯一明列 operand、兩個輸出會覆寫 `%rax/%rdx`。

## `div_and_mod`：先保存會被 implicit output 蓋掉的 pointer

投影片提供：

```asm
div_and_mod:
    movq %rdi,%rax
    movq %rdx,%rcx
    cqto
    idivq %rsi
    movq %rdx,(%rcx)
    ret
```

依 [AMD64 System V ABI](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)，前三個 INTEGER-class arguments 依序進 `%rdi`、`%rsi`、`%rdx`。若 signature 是 `long div_and_mod(long x, long y, long *p_mod)`，進函式時 `%rdx` 是 `p_mod`，但 `idivq` 也必須用 `%rdx` 放 remainder。

第二條先把 pointer 複製到 `%rcx`，不是多餘 move，而是避開 register role collision。`cqto` 隨即覆寫 `%rdx` 準備 dividend；`idivq` 又把 remainder 寫入 `%rdx`。division 後，`movq %rdx,(%rcx)` 才能透過保存的 pointer 寫出 remainder，而 `%rax` 已自然符合 integer return register 的位置。

等價 C 是：

```c
long div_and_mod(long x, long y, long *p_mod) {
    long quotient = x / y;
    long remainder = x % y;
    *p_mod = remainder;
    return quotient;
}
```

投影片把同一份 etude 與答案連續放在第 4、5 頁，並不是第二個不同例題。完整性要求應記錄這個重複，而不是為了讓文章看起來內容更多，憑空發明另一種 `div_and_mod` 行為。

## `tinker_toy`：argument width 與 address width 可以不同

第二個 etude 是：

```asm
tinker_toy:
    movslq %edx,%rdx
    movl %edi,%eax
    addl (%rsi,%rdx,4),%eax
    ret
```

對應的 C：

```c
int tinker_toy(int x, int arr[], int y) {
    int sum = x;
    sum += arr[y];
    return sum;
}
```

`x` 與 `y` 是 `int`，因此真正有意義的是 `%edi`、`%edx` 的低 32 bits；`sum` 也由 `%eax` 保存。可是 memory address expression 需要 64-bit index，第一條才把 `%edx` sign-extend 到 `%rdx`。這不是把 y 改成 `long` 的 source-level assignment，而是為 address calculation 準備一份寬版暫存值。

`(%rsi,%rdx,4)` 的 scale 4 與 `int` element width 一致；`addl` 又確認讀取與累加都是 32 bits。Reverse engineering 要把多項證據合在一起：ABI 說 arguments 從哪裡來，suffix 說 operation width，address scale 支持 element size，`%eax` 在 `ret` 前的值則支持 return expression。

## Instructions 本身也是 memory 裡長短不一的 bytes

投影片接著把視角由「資料放在 memory」轉成「程式碼也放在 memory」。示例 listing 是：

```asm
4004ed: 55                      push %rbp
4004ee: 48 89 e5                mov  %rsp,%rbp
4004f1: c7 45 fc 00 00 00 00    movl $0x0,-0x4(%rbp)
4004f8: 83 45 fc 01             addl $0x1,-0x4(%rbp)
4004fc: eb fa                   jmp  4004f8
```

左欄是每條 instruction 起始 address，中間是 encoded bytes，右欄是 disassembly。x86-64 instructions 不是固定四 bytes：這五條分別佔 1、3、7、4、2 bytes。所以「下一條」不能簡化成 address 加一，也不能假設固定加四；decoder 必須知道目前 instruction 的長度。

這份 listing 也再次說明 disassembler 沒有還原唯一 source。它把 bytes 解成等價 instruction syntax，symbol `<loop+0xb>` 則來自 address 與可用 symbol information。高階的 `while`、local variable 名稱與 source formatting 並沒有存在 instruction bytes 裡。

## `%rip` 保存下一條 instruction 的地址

x86-64 的 program counter 是 `%rip`。投影片逐頁把它從 `0x4004ed` 推到 `0x4004ee`、`0x4004f1`、`0x4004f8`、`0x4004fc`，正好對應前面每條 instruction 的起始位置。

預設規則可以寫成：

```text
next_rip = current_instruction_address + encoded_instruction_length
```

這是 sequential execution 的精確版本。「逐行執行」只是 disassembly 排版帶來的方便說法；CPU 取的是 address 指向的 bytes，decode 出 instruction length 與語意，再建立下一個 `%rip`。若 listing 中間插入 label 或註解，不會消耗 runtime address。

以 `movl` 為例，從 `0x4004f1` 開始的七個 bytes 到 `0x4004f7`，因此下一條從 `0x4004f8` 開始。`addl` 佔四個 bytes，所以下一個 `%rip` 是 `0x4004fc`。先核對地址差與 byte count，是閱讀 objdump 時抓錯位或資料誤當 code 的基本方法。

投影片把 main memory 畫成 stack、heap、data、text regions，是為了指出 instruction bytes 位於 code/text 區域；它沒有在本講定義完整 process memory map。本文只採用「code 是可定址 bytes、`%rip` 指向待執行 instruction」這個受到投影片支持的範圍。

## `jmp` 用 target 取代預設的下一個 `%rip`

到 `0x4004fc` 時，兩-byte instruction `eb fa` 被解成：

```asm
jmp 0x4004f8
```

若沿預設規則，下一個 address 應是 `0x4004fe`；但 unconditional `jmp` 直接令 `%rip = 0x4004f8`。於是 `addl` 執行後又跳回自身，形成不會自行結束的 loop。投影片將其近似還原成：

```c
int n = 0;
while (true) n++;
```

這個 C 只表達控制結構與局部計數效果，不聲稱完整重建原程式。Assembly listing 中 `n` 放在 `-0x4(%rbp)`，但 source variable 名稱已遺失；而 signed overflow 等 C language 細節也不該由這個短 etude 過度推論。

重要的是區分兩種「往前」。正常 instruction completion 讓 `%rip` 走到編碼後方；jump 則依 target 決定方向，可以向較小 address loop back，也能向較大 address skip over 一段 code。Unconditional 表示不先檢查條件，不表示 target 必須向後。

## Direct 與 indirect jump：target 寫在 instruction，或先從 operand 取得

本講最後把 `jmp` 分成：

```asm
jmp label       # direct
jmp *%rax       # indirect
```

direct jump 的 target 由 instruction encoding 表達，disassembler 可以顯示具體 destination 或 label。示例的 `jmp 4004f8` 屬於這類，常用於 loopback 或跳過某段 code。

indirect jump 的 target 則來自 register 或 memory operand；`jmp *%rax` 把 `%rax` 目前保存的值當成下一個 `%rip`。[GNU assembler 的 AT&T/Intel syntax 文件](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)說明 AT&T 的 absolute jump/call operand 以 `*` 標示，這個星號是 assembly dialect 的 indirect-control-transfer notation，不是 C source 中可直接逐字替換的 dereference operator。

投影片只點出 indirect jumps 可服務大型 `switch` 與 function pointers，沒有展示 jump table 或 indirect call。Direct jump 是固定 edge；indirect jump 還要逆推 target 的資料流。

## Tracing

Full-width arithmetic：

1. 先確認 one-operand 還是 two-operand multiplication。
2. 把 implicit `%rax/%rdx` reads 與 writes 明列出來。
3. division 前檢查 `%rdx:%rax` 如何準備，signed 才使用 `cqto`。
4. division 後把 `%rax` 標成 quotient、`%rdx` 標成 remainder。
5. 若 `%rdx` 是 live argument，找它是否先被搬走。

Control flow：

1. 從 listing 的 address 算出 instruction length。
2. 沒有 jump 時，`%rip` 指向下一個 instruction。
3. 遇到 `jmp` 時，以 target 取代預設 successor。
4. direct jump 直接記錄固定 edge；indirect jump 反查 operand value 的來源。
5. 只還原 edges 支持的 loop 或 skip，不假設尚未出現的 condition。

## 參考資料

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 17: Arithmetic and Logic Wrap, Control Flow（PDF）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/17/Lecture17.pdf)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
- [System V Application Binary Interface: AMD64 Architecture Processor Supplement（PDF）](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)
