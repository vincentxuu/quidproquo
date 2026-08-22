---
title: "Stanford CS107 Lecture 14：從 C 到 x86-64，第一次讀懂反組譯輸出"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, compiler]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 15
tldr: "CS107 第 14 講用 sum_array 的 10 條 x86-64 指令拆開反組譯輸出：左側是位址與機器碼，右側是 AT&T assembly；讀者的任務是由 opcode、operand、register 與控制流程還原 C，而不是手寫組合語言。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 14：編譯管線、objdump、x86-64 暫存器、AT&T 語法，以及如何由 sum_array 的反組譯結果重建 C 程式。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-assembly-x86-64-en)

一個 `for` 迴圈到了處理器眼中，不再有變數名稱、`int` 型別或陣列語法，只剩放在不同位址的 bytes、暫存器中的值，以及改變下一條指令位置的跳躍。Stanford CS107 Lecture 14 是課程由 C 記憶體模型轉進 machine-level execution 的轉折點：它不要求學生從空白頁手寫組合語言，而是教你面對 compiler 產生的 x86-64，辨認哪些片段共同實作原本的 C。

本講以 `sum_array` 的十條指令拆解反組譯各欄、assembly 與 machine code、十六個 general-purpose registers，以及 compiler 的「載入、運算、寫回」。完整 addressing modes、資料寬度與 `mov` 變體主要留給下一講。

## 本講資料、範圍與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 14，2026-02-06
- 官方標題：Introduction to Assembly and `x86-64`
- 投影片標題：Introduction to Assembly
- 講者：課程資料列 Jerry Cain 授課；本講 PDF 沒有另列 guest speaker
- 指定閱讀：Bryant 與 O'Hallaron，*Computer Systems: A Programmer's Perspective* 3.1–3.4
- 已讀材料：官方 calendar、完整 Lecture 14 投影片、GCC output-stage 文件、GNU `objdump` 文件、GNU assembler 的 AT&T/Intel syntax 對照
- 材料缺口：Canvas 錄影、AFS lecture code、課堂 demo 的 executable 與 starter repositories 未公開；指定教科書不在公開材料內，本文沒有把它冒充已讀來源

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)把本講列為 Topic 5 的開端，問題是「電腦如何解讀並執行 C？」；[完整投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/14/Lecture14.pdf)依序涵蓋：為什麼要讀 assembly；C、assembly、machine code 的關係；以 `objdump -d` 看 executable；拆解 `sum_array` 的 function label、instruction address、raw bytes、opcode 與 operands；辨認 immediate 與 register；比較 C abstraction 和 assembly abstraction；最後介紹 x86-64 的十六個 64-bit registers 與 compiler 的 load-operate-store 圖像。

## 三層表示：同一個意圖，三種讀者

C 的 names、types、arrays 與 control structures 不是硬體直接理解的東西；compiler 依 target architecture 選出 encoding、register 與 data layout，assembly 則是 machine instructions 的文字表示。三層並非逐行翻譯：一個 C statement 可能需要多條 instructions，一條 instruction 也可能合併位址計算與存取。閱讀目標是恢復整組 instructions 的效果。

[GCC 的 output options 文件](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html)把 toolchain 描述成最多四個依序發生的 stages：preprocessing、compilation proper、assembly、linking。`gcc` 是 driver，會協調各階段，不應把「GCC 將 C 直接翻成 executable」誤解成中間沒有 assembler、object file 或 linker。若想觀察中間層，可以讓流程提早停止：

```bash
gcc -E sum.c -o sum.i   # preprocessing 後停止
gcc -S sum.c -o sum.s   # compilation proper 後停止，保留 assembly
gcc -c sum.c -o sum.o   # 產生 object file，不執行 linking
gcc sum.c -o sum        # 完成 linking，產生 executable
```

`sum.i` 顯示 preprocessing 結果，`sum.s` 保留指令，`sum.o` 已有 machine code、仍待 link，`sum` 是 executable。

## `objdump -d` 顯示的不是「比較醜的 C」

[GNU `objdump` 文件](https://sourceware.org/binutils/docs/binutils/objdump.html)說明，`-d` / `--disassemble` 會把預期含有 instructions 的 sections 反組譯成 assembler mnemonics；它也能限制由特定 symbol 開始。投影片執行：

```bash
objdump -d sum
```

並得到以下核心片段：

```asm
0000000000401136 <sum_array>:
  401136: b8 00 00 00 00        mov    $0x0,%eax
  40113b: ba 00 00 00 00        mov    $0x0,%edx
  401140: 39 f0                 cmp    %esi,%eax
  401142: 7d 0b                 jge    40114f <sum_array+0x19>
  401144: 48 63 c8              movslq %eax,%rcx
  401147: 03 14 8f              add    (%rdi,%rcx,4),%edx
  40114a: 83 c0 01              add    $0x1,%eax
  40114d: eb f1                 jmp    401140 <sum_array+0xa>
  40114f: 89 d0                 mov    %edx,%eax
  401151: c3                    retq
```

先不要急著背 `movslq` 或 `jge`。同一行由左到右至少有三種資訊：instruction address、machine-code bytes、assembly instruction。以第一行為例，`401136` 是這條 instruction 放在 memory 的位址，`b8 00 00 00 00` 是處理器解碼的 bytes，`mov $0x0,%eax` 是給人看的文字表示。下一條從 `40113b` 開始，正因前一條 encoding 佔五個 bytes。

x86-64 採 variable-length encoding，所以位址不固定增加四或八：範例的 `cmp` 佔兩個 bytes，第一條 `mov` 佔五個。`<sum_array>` 是協助人辨認 function 起點的 symbol；CPU 實際沿位址取指令，不會尋找 C identifier。

## 一條 assembly instruction 要拆成 opcode 與 operands

投影片接著標出 instruction 的兩個基本部件。`mov`、`cmp`、`jge`、`add`、`jmp`、`retq` 是 operation names，也就是 opcodes 或 mnemonics；後面的值是 operands。operand 可能代表 constant、register、memory location 或 branch target。先辨認外形，再問語意：

- `$0x0`、`$0x1`：`$` 開頭是 immediate value，數值直接寫在 instruction 裡。
- `%eax`、`%edx`、`%esi`：`%` 開頭是 register name，不是 C 的 percentage operator。
- `(%rdi,%rcx,4)`：memory operand，會依 base、index 與 scale 組合出有效位址。
- `40114f`：control-flow target，決定符合條件時下一步去哪裡。

這套外形屬於 AT&T syntax。[GNU assembler 的 AT&T/Intel 對照](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)指出，AT&T immediate 前有 `$`、register 前有 `%`，且大多數雙 operand instructions 依 `source, destination` 排列；Intel syntax 則通常反過來。於是：

```asm
add $0x1,%eax
```

要讀成「把立即值 1 加進 `%eax`」，不是把 `%eax` 寫進常數。若你在另一個 disassembler 看到 `add eax, 1`，不代表 CPU 換了一種加法，而是工具選了 Intel syntax。`objdump` 文件也列出 `-M att` 與 `-M intel` 可選擇顯示模式。讀題前先確認 syntax，比死背逗號兩側更可靠。

AT&T mnemonic 的 `b`、`w`、`l`、`q` 尾碼可標示資料寬度；`movslq` 會把 32-bit signed long 擴展成 64 bits。完整規則留待後續。

## 暫存器不是「比較快的變數名稱」

投影片把 register 定義為 CPU 上可快速讀寫的 storage slot，並強調它不位於一般 memory。此處介紹的 x86-64 general-purpose register names 是：

```text
%rax  %rbx  %rcx  %rdx
%rsi  %rdi  %rbp  %rsp
%r8   %r9   %r10  %r11
%r12  %r13  %r14  %r15
```

每個列出的完整 register 是 64 bits，但同一硬體儲存位置還能用較窄名稱存取。`%rax` 的低 32 bits 叫 `%eax`，`%rdx` 的低 32 bits 叫 `%edx`；所以 `sum_array` 明明在 x86-64 上執行，仍大量出現以 `e` 開頭的 names。程式正在計算 C `int`，compiler 沒必要把每次整數運算都做成 64 bits。

不要把 C variable 與 register 建立永久一對一關係。範例中 `%eax` 在迴圈期間像 `i`，function 結束前又接收 return value；這是 register reuse。另一個 build、optimization level 或 compiler version 都可能分配不同 registers，卻保持相同 observable behavior。真正穩定的是 instruction 的資料流：哪個 operand 被讀、結果寫去哪裡、哪些條件改變 control flow。

register 也負責傳遞 arguments 與 return value；在本例中，輸入位於 `%rdi`、`%esi`，結果放進 `%eax`。完整 calling convention 留待後續。

## 由十條指令還原 `sum_array`

原始 C 是：

```c
int sum_array(int arr[], int nelems) {
    int sum = 0;
    for (int i = 0; i < nelems; i++) {
        sum += arr[i];
    }
    return sum;
}
```

閱讀反組譯時，最有效的方法不是由第一行開始逐字翻，而是先找 control-flow skeleton。此例有一條 conditional jump `jge`、一條回跳 `jmp` 與最後的 `retq`，很像「進入前檢查條件、執行 body、更新 index、回到條件」的迴圈。再把各段的資料角色填進去。

### 1. 初始化兩個累加狀態

```asm
mov $0x0,%eax
mov $0x0,%edx
```

兩個 32-bit registers 都清為零。觀察後續用途，`%eax` 每輪加一並參與邊界比較，因此對應 `i`；`%edx` 接收每個陣列元素的加總，因此對應 `sum`。角色是由 use-def chain 推回來的，不是因為 `eax` 天生叫 index register。

### 2. 在 body 之前檢查 `i < nelems`

```asm
cmp %esi,%eax
jge 40114f <sum_array+0x19>
```

在 AT&T 的 operand 順序下，`cmp source,destination` 會建立相當於 destination 減 source 的 condition information；緊接著 `jge` 在 `%eax >= %esi` 時跳出。也就是當 `i >= nelems`，前往 epilogue。反面條件才是繼續執行 body 的 `i < nelems`。

`cmp` 不會產生 C `bool` variable；它更新 condition state，由下一條 jump 使用。本講尚未完整介紹 condition codes，此處只辨認兩條指令合成的控制效果。

### 3. 把 32-bit index 擴展成可參與位址計算的 64-bit 值

```asm
movslq %eax,%rcx
```

`i` 是 `int`，所以 `%eax` 保存 32-bit 值；x86-64 address calculation 使用 64-bit register。`movslq` 將 signed 32-bit value sign-extend 到 `%rcx`。本例在合法的迴圈 body 中 `i` 從零向上成長，卻仍需要把 representation 轉成適合計算位址的寬度。

這提醒我們：C 中隱含的寬度規則可能成為明確 instruction；看得見的 assignment 也可能被 compiler 合併。

### 4. 用 base + index × scale 讀取元素並累加

```asm
add (%rdi,%rcx,4),%edx
```

這是整段最密集的一行。`%rdi` 保存 `arr` 的 base address，`%rcx` 保存擴展後的 `i`，scale `4` 對應此環境中一個 `int` 的 byte width。括號形成 memory operand，因此來源不是「算出的 address 數值」，而是該有效位址存放的 32-bit element。整體效果是把 `arr[i]` 加進 `%edx`。

x86-64 可讓某些 arithmetic instructions 直接讀 memory operand，不必固定拆成算地址、load、add 三行。投影片的 load-operate-store 圖是概念模型，不是固定 instruction 數量。

### 5. 更新 index 並回到條件

```asm
add $0x1,%eax
jmp 401140 <sum_array+0xa>
```

第一條實作 `i++`，第二條無條件回到 `cmp`。機器碼沒有名為 `for` 的 opcode；迴圈是 comparison、conditional exit、body、increment 與 backward jump 共同形成的 control-flow pattern。`while` 寫法也可能編成同一形狀，所以反向還原時通常只能說「語意等價的 loop」，不能斷言 source 一定用了哪個 C keyword。

### 6. 把累加值放到 return register

```asm
mov %edx,%eax
retq
```

離開迴圈後，`%edx` 的 sum 被複製到 `%eax`，再返回 caller。這也證明前面不能把 register name 當成固定 variable name：`%eax` 先保存 index，最後改成 function result。若 `nelems <= 0`，第一次 `jge` 就跳到這裡；因 `%edx` 已初始化為零，function 回傳零，與 C loop 一次都不執行的效果一致。

## 型別消失，仍會留下線索

CPU 不會檢查 `%rdi` 是不是 `int *`，但 `int` 仍導致 32-bit operation 與 scale 4。逆向時應合併 stride、資料寬度和後續運算；四-byte stride 也可能是 `float`，assembly 無法自動恢復 typedef 或 programmer intent。

實作時，在每條 instruction 旁寫「讀取、寫入、下一步」，再把 targets 分成初始化、loop header、body 與 return blocks，最後才改寫成 C。本講仍只是地圖：subregister、calling convention、condition codes 與 addressing modes 都留待後續。

## 這一講真正建立的能力

本講的核心不是背 register names，而是改用 instruction、operand、register、memory address 與 control-flow edge 讀程式。對 `sum_array`，先由 `jge` 和 backward `jmp` 找 loop，再追 `%eax` 的 index、`%edx` 的 sum、memory operand 的 array access，最後找 return value：先畫控制流程，再追資料流，最後命名角色。

練習時，把五行 C 編成 `.s` 與 executable，各看一次 `gcc -S` 和 `objdump -d`；在每條 instruction 旁註明「讀什麼、寫什麼、下一步去哪裡」。高階抽象不是被神祕抹掉，而是拆成可追蹤的機器狀態轉移。

## 參考資料

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 14 slides: Introduction to Assembly](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/14/Lecture14.pdf)
- [GCC: Options Controlling the Kind of Output](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html)
- [GNU Binutils: objdump](https://sourceware.org/binutils/docs/binutils/objdump.html)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
