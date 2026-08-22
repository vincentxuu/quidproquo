---
title: "Stanford CS107 Lecture 18：從 condition codes 到 loops，讀懂 x86-64 條件控制"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, control-flow]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 19
tldr: "CS107 第 18 講以 ZF/SF/CF/OF 串起 cmp、test、signed/unsigned conditional jumps，再拆解 if、loops、dynamic instruction count、setcc 與 cmovcc。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 18：condition codes、cmp/test、conditional jumps、if 與 loop translation、setcc、cmovcc。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-assembly-conditions-loops-en)

`cmp %rsi,%rdi` 沒有把 subtraction result 寫進 general-purpose register，下一條 `jge` 卻能據此決定是否跳轉。中間的橋樑是 condition codes：CPU 用少數 flags 保存最近一次算術或邏輯操作的關鍵性質。Stanford CS107 Lecture 18 就從這份隱藏 state 出發，把 C 的 `if`、`while`、`for` 還原成 fall-through 與 control-flow edges。

## 本講資料、缺口與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 18，2026-02-18
- calendar 標題：More Control Flow Operations
- 投影片標題：Assembly: Control Flow
- 講者：[完整 PDF](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/18/Lecture18.pdf) metadata 列 Jerry Cain
- 指定閱讀：Bryant 與 O'Hallaron，*Computer Systems: A Programmer's Perspective* 3.6
- 已讀材料：官方 calendar、完整 20 頁投影片、GNU assembler AT&T/Intel syntax 文件、2025 AMD64 System V ABI
- 材料缺口：Canvas 錄影與 AFS lecture code 未公開；指定教科書不在公開材料內，本文不宣稱已讀

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)把本講定位成完成 control flow operations。[完整投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/18/Lecture18.pdf)依序涵蓋：用 conditional execution 實現 `if/else` 與 loops；`cmp` 加 `jcc` 模式；完整 conditional-jump families；四組 jump etudes；ZF/SF/CF/OF；三組 8-bit flag exercises；由 `and/add/cmp` 追 flags；別把 flag equations 複雜化；`test` 與非 `cmp` flag writers；`daisy`、重複兩頁的 `rose`；`sum_array` loop；static 與 dynamic instruction counts；`setcc` 與 `is_small`；完整 set 表；`cmovcc`、`max` 與完整 conditional-move 表。

本講止於 conditional moves。它沒有介紹 function-call instruction、return-address 保存、stack frame 或 caller/callee-saved registers；那些是 Lecture 19 的範圍，本文不提前帶入。`ret` 只在完整函式 listing 中作結，不延伸解釋 mechanics。

## Conditional control 是 fall-through 與跳過區塊的組合

Assembly 沒有一條包辦所有 `if` 或 `while` semantics 的 instruction。典型形狀是：

```asm
cmp S1,S2
jcc label
```

`cmp S1,S2` 計算 `S2-S1` 但不保存 subtraction result，只更新 flags；`jcc` 再依特定 flag combination 決定改寫 `%rip` 或 fall through。Lecture 17 已建立 jump 改寫 program counter，本講新增的只是「是否改寫」的判斷。

[GNU assembler 的 AT&T/Intel syntax 對照](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)確認 AT&T 採 source、destination 順序，所以 `cmp $-5,%rax` 應讀成 `%rax - (-5)`。接著 `jle target` 表示把 `%rax` 視為 signed value 時，小於等於 -5 就跳。若用眼睛照 Intel 的 destination-first 習慣讀，結論會反過來。

## `jcc` 的兩套大小關係：signed 用 greater/less，unsigned 用 above/below

相等與零測試共用 `je/jz`，不相等共用 `jne/jnz`；`js` 看 negative，`jns` 看 nonnegative。帶順序的 comparisons 則分兩個家族。

Signed relations：`jg`、`jge`、`jl`、`jle`，synonyms 分別有 `jnle`、`jnl`、`jnge`、`jng`。Unsigned relations：`ja`、`jae`、`jb`、`jbe`，另有 `jnbe`、`jnb`、`jnae`、`jna`。

```asm
cmp $0,%eax
jge 0x400300      # signed int eax >= 0

cmp %dx,%bx
je 0x400104       # 16-bit patterns equal

cmp $0x300,%r10
jbe 0x400148      # unsigned r10 <= 0x300
```

最後一題 `cmp $0xffff,%cx; ja ...` 有個結構性答案：16-bit unsigned `%cx` 最大就是 `0xffff`，不可能 strictly above，所以 branch 永遠不會 taken。這類不可能條件是 reverse engineering 時應主動找的 simplification。

## ZF、SF、CF、OF 是 subtraction 性質的壓縮摘要

`cmp S1,S2` 內部形成 `S2-S1`，並用 flags 摘要結果：

- ZF（zero flag）：結果為零。
- SF（sign flag）：結果最高 bit 為一，按該寬度看起來是負值。
- CF（carry flag）：subtraction 需要 borrow，支援 unsigned relation。
- OF（overflow flag）：two's-complement signed result 超出該寬度能表示的範圍。

投影片用 8-bit arithmetic 強迫讀者同時看兩種 interpretation。若 `%bl=0x01`，執行 `cmp $0xff,%bl`，截成 8 bits 的結果是 `0x02`：ZF=0、SF=0；unsigned 的 1-255 需要 borrow，所以 CF=1；signed 的 1-(-1)=2 可表示，所以 OF=0。

若 `%bl=0x80`，同一 comparison 得 `0x81`：nonzero、sign bit 一，因此 ZF=0、SF=1；unsigned 128-255 借位，CF=1；signed -128-(-1)=-127 可表示，OF=0。

若 `%bl=0x00`，`cmp $0x80,%bl` 得 `0x80`：ZF=0、SF=1、unsigned 需要 borrow 故 CF=1。signed 計算是 0-(-128)=128，超出 signed 8-bit 的 -128..127，所以 OF=1。這一題展示為何 signed less 不能只看 SF：overflow 可能讓 truncated sign 與數學結果的方向相反。

## Branch 讀的是最後一位 flag writer，不保證緊鄰 `cmp`

Conditional jump 不記得某個 C expression；它只讀當下 flags。`cmp` 常放在前面，但 arithmetic 與 logical operations 也會更新 condition codes：

```asm
and $0x7,%ax
je target
```

`and` 保留低三 bits，若原值是 8 的倍數，結果為零、ZF=1，`je` taken。這裡沒有 `cmp`。

```asm
sub %esi,%edx
jl target
```

`sub` 把 `%edx-%esi` 寫回 `%edx`，同時更新 flags；`jl` 依 signed relation 判斷結果小於零。和 `cmp` 的差別在於 subtraction result 是否保存。

`test S1,S2` 做 bitwise AND、更新 flags，但不保存 AND result：

```asm
test %rdi,%rdi
jl target
```

一個 value 與自己 AND 不改 bit pattern，因此可檢查零或 sign 而不改 `%rdi`。投影片指出 compiler 常以此取代 `cmp $0,%rdi`，因 encoding 更短。

也不能武斷地只看 conditional instruction 正上一行。`cmp %edi,%esi; mov %edi,%eax; cmovge %esi,%eax` 仍有效，因普通 `mov` 不改 flags。正確做法是向上找最近一條會寫 flags 的 instruction，並確認中間沒有另一個 arithmetic/logical operation 覆蓋它。

## Flag equations 是底層依據，閱讀時優先還原 comparison

`je` 直接看 ZF；signed greater-or-equal 的 `jge` 要求 SF=OF；signed less 的 `jl` 要求 SF≠OF；`jle` 是 ZF=1 或 SF≠OF。Unsigned above 的 `ja` 要求 CF=0 且 ZF=0，below 的 `jb` 看 CF=1。

```asm
sub $0x10,%rdi
cmp $0x4032,%rdi
jge 0x401930
```

但必須分清是哪一條 operation 的結果。第一行 `sub` 會更新 flags，第二行 `cmp` 又覆寫，所以 `jge` 只對 `cmp` 的 `%rdi-0x4032` 作判斷，不直接讀取 `sub` 留下的 flags。

投影片另一題先 `and $0xf0,%rax`，再 `cmp $0xc0,%al; je`。`and` 把最低 byte 的低 nibble 清零，`cmp` 檢查高 nibble 是否為 `0xc`；真正供 `je` 使用的是 `cmp` 設定的 ZF，而不是 `and` 的 flags。

## `daisy` 與 `rose`：先畫 taken/fall-through，再命名 if branch

`daisy`：

```asm
cmpl $10,%edi
je .L4
movl %edi,%eax
negl %eax
ret
.L4:
leal 1(%rdi),%eax
ret
```

`je` taken 時 x==10，直接到 `.L4` 算 `x+1`；not taken 時 fall through，把 x 搬進 return register 再 negate。等價 C：

```c
int daisy(int x) {
    if (x == 10) x++;
    else x = -x;
    return x;
}
```

不要用 listing 上方/下方猜 `if` 與 `else`；先寫 taken edge 和 fall-through edge，各自追到 `ret`。

`rose`：

```asm
movq %rdi,%rax
subq %rsi,%rax
cmpq %rsi,%rdi
jge .L5
movq %rsi,%rax
subq %rdi,%rax
.L5:
ret
```

先預設 result=x-y。若 x>=y，`jge` 跳過改寫；若 x<y，fall through 改成 y-x。因此 function 回傳 absolute difference。投影片第 13、14 頁是幾乎完全相同的 `rose` 解答，差別只在末段措辭；本文記錄一次，不把重複頁偽裝成新 agenda。

依 [AMD64 System V ABI](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)，前兩個 INTEGER-class arguments 在 `%rdi/%rsi`，integer return value 由 return classification 配到 `%rax`。這份 ABI evidence 支持 etude 的資料流命名，但不表示每個函式內 `%rdi` 永遠保留原始 x；若中途被寫入，就要跟著新值走。

## `sum_array`：for loop 是 forward test 加 backward conditional edge

```asm
sum_array:
    movq $0,%rax
    movl $0,%edx
    jmp .L8
.L9:
    addl (%rdi,%rax,4),%edx
    addq $1,%rax
.L8:
    cmpq %rsi,%rax
    jb .L9
    movl %edx,%eax
    ret
```

`%rax` 是 `size_t i`，`%rsi` 是 `size_t n`，所以使用 unsigned `jb` 表達 i<n。開頭先 jump 到 `.L8`，確保 n==0 時完全不執行 body。每次 test 通過，conditional backward edge 到 `.L9`，完成 add、increment，再自然 fall through 回 test。

對應 C：

```c
int sum_array(int arr[], size_t n) {
    int sum = 0;
    for (size_t i = 0; i < n; i++) sum += arr[i];
    return sum;
}
```

Loop 的辨識證據不是只有 backward jump。還要找 induction variable 初始化、test、更新與 body memory access。少任何一項都可能是不同 control structure。

## Dynamic instruction count：相同九條 static instructions，執行成本仍不同

投影片比較兩個皆有九條 static instructions 的版本。上面的 layout 每輪執行 `addl`、`addq`、`cmpq`、`jb`，共四條；另一個 top-tested layout 每輪另外需要尾端 unconditional `jmp`，共五條。

對大陣列，五相對四表示 loop body 每輪約多 25% instructions。這個百分比只比較投影片列出的 dynamic instruction count，不等於 wall-clock time 必然慢 25%；實際時間還受 branch prediction、pipeline、cache 與其他微架構因素影響，而這些不是本講材料。

做成本追蹤時，可把初始化算一次、每輪 path 乘 iteration count、exit path 算一次。這比看到 assembly 共九行就斷言兩版等價有效率更可靠。

## `setcc`：把 condition materialize 成單一 byte 的 0 或 1

`setcc D` 使用與 `jcc` 相同的 condition suffix，但不跳；條件成立就把 destination byte 設為 1，否則設為 0。Destination 可以是 byte subregister 或 memory。

```asm
is_small:
    cmp $255,%rdi
    setbe %al
    movzbl %al,%eax
    ret
```

對 `bool is_small(unsigned long x) { return x < 256; }`，`setbe` 檢查 unsigned x<=255。它只改 `%al`，其餘 `%rax` bytes 保持原樣；後續 `movzbl` 才把 byte cleanly zero-extend，使完整 `%eax/%rax` 都形成 canonical 0 或 1。

`setcc` 適合產生 Boolean value，而不是改變 control-flow graph。看到它後應追 destination byte 是否立刻被 extension、mask 或 store，而不是找一條不存在的 branch target。

## `cmovcc`：先準備預設值，條件成立才覆寫 register

`cmovcc S,R` 在條件成立時把 source 搬到 destination register，否則保留原 destination。`cmovge` 的 condition 與 `jge` 相同，但 `%rip` 不分岔。

```asm
max:
    cmp %edi,%esi
    mov %edi,%eax
    cmovge %esi,%eax
    retq
```

`cmp %edi,%esi` 比較 y-x；先把 x 當預設 return value 放入 `%eax`，若 y>=x，`cmovge` 再以 y 覆寫，實作 `return x > y ? x : y`。中間的 `mov` 不更新 flags，所以 `cmovge` 仍讀到 `cmp` 的結果。

完整 family 同樣對齊 equality、sign、signed relations 與 unsigned relations：`cmove/cmovne`、`cmovs/cmovns`、`cmovg/ge/l/le`、`cmova/ae/b/be`，destination 必須是 register。

投影片稱四-instruction 版本 often fast，但這不是「所有 `cmov` 永遠較快」。只有兩個 candidate 都能安全計算時，才能以 branchless form 取代 guarded computation。

## 一套完整但不跨進 Lecture 19 的 tracing 流程

1. 找出 conditional transfer、`setcc` 或 `cmovcc`。
2. 向上找到最後一條真正寫 flags 的 instruction，不假設一定是緊鄰的 `cmp`。
3. 若是 `cmp S1,S2`，先寫出 `S2-S1`。
4. 由 suffix 確定寬度，由 `g/l` 或 `a/b` family 確定 signedness。
5. 對 jump 分別畫 taken 與 fall-through edges，再辨認 blocks。
6. 對 loop 補上初始化、test、update、back edge 與 exit edge。
7. 對 `setcc` 追單一 byte 如何擴展；對 `cmovcc` 追預設值與覆寫值。
8. 若比較成本，分開 static instruction count 與實際 path 的 dynamic count。

## 參考資料

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 18: Assembly — Control Flow（PDF）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/18/Lecture18.pdf)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
- [System V Application Binary Interface: AMD64 Architecture Processor Supplement（PDF）](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)
