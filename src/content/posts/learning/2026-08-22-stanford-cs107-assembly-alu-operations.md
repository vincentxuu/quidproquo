---
title: "Stanford CS107 Lecture 16：從 subregister 到 ALU，讀懂 x86-64 算術與位元運算"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, alu]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 17
tldr: "CS107 第 16 講把 b/w/l/q 資料寬度、subregister、movs/movz、lea、呼叫慣例、算術邏輯與 shift 串成一套規則：先確定操作寬度，再追蹤來源、目的與是否真的讀取記憶體。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 16：x86-64 資料寬度、subregister、sign/zero extension、lea、特殊用途 registers、ALU 算術邏輯與 shift instructions。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-assembly-alu-operations-en)

同一個 `%rax` 可以被叫作 `%eax`、`%ax` 或 `%al`；同一串位元經過 zero extension 與 sign extension，也可能變成完全不同的 64-bit 數值。Stanford CS107 Lecture 16 的核心不是再背一批 mnemonics，而是替上一講的 addressing modes 加上兩個維度：**這次操作幾個 bytes，以及 ALU 如何解讀與改寫這些 bits。**

讀任何 instruction 時，可以固定問四件事：operand 寬度是多少、來源在哪裡、目的在哪裡、括號只是拿來計算位址還是真的會 dereference。這套順序能解釋 `movzbl`、`leaq`、`addq` 和 `sar`，也能避免把 register 的不同名稱誤認成彼此獨立的 storage。

## 本講資料、缺口與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 16，2026-02-11
- calendar 標題：Introduction to ALU Operations
- 投影片標題：Assembly: Arithmetic and Logic Operations
- 講者：[完整 PDF](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/16/Lecture16.pdf) metadata 列 Jerry Cain
- 指定閱讀：Bryant 與 O'Hallaron，*Computer Systems: A Programmer's Perspective* 3.5–3.6
- 已讀材料：官方 calendar、完整 14 頁投影片、GNU assembler 的 AT&T/Intel syntax 文件、2025 AMD64 System V ABI
- 材料缺口：Canvas 錄影與 AFS lecture code 未公開；指定教科書不在公開材料內，本文不宣稱已讀

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)把本講安排在 assembly addressing modes 之後、control flow 之前。投影片的完整 agenda 依序是：資料寬度名稱與 `b/w/l/q` suffix；register 與 subregister；部分寬度寫入；`movz`／`movs`；兩份完整 extension instruction 清單；以 `sum_array` 重看 `movslq`；`lea` 與 `mov` 對照；特殊用途 registers；`dolores_park` reverse-engineering etude；unary／binary arithmetic and logic；最後是 logical／arithmetic shifts 與 `%cl` 限制。

公開投影片沒有課堂口述、現場問答或額外程式碼，因此本文不替這些缺口補故事。另一個要明說的材料瑕疵是第 5 頁的 sign-extension 範例把 `movzwq` 又印了一次；依下一頁完整 `movs` 表格，16→64 的 signed mnemonic 應是 `movswq`。本文採用完整表格與 mnemonic 規則，不沿用該處筆誤。

## `b/w/l/q`：instruction suffix 先決定這次碰多少資料

x86 沿用歷史名稱：byte 是 1 byte、word 是 2 bytes、double word 是 4 bytes、quad word 是 8 bytes。AT&T syntax 把寬度寫進 mnemonic：`b`、`w`、`l`、`q` 分別代表 8、16、32、64 bits。

```asm
movb $0x41,%al
subb $1,(%rax)
xorw %dx,%dx
leaq (%rdi,%rsi,8),%rax
pushq %rbp
```

[GNU assembler 的 AT&T/Intel syntax 對照](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)也明列：AT&T 以 mnemonic 最後一個字元決定 memory operand 寬度，Intel syntax 則常寫成 `byte ptr`、`dword ptr` 等前綴。這是 dialect 差異，不是硬體做了不同工作。

suffix 有時可省略，因為 register 名稱已經透露寬度。例如 `%al` 是 byte，`%edx` 是 32 bits。但 `movq $5,8(%rsp)` 的 destination 只有一個 memory address expression，地址本身沒有告訴 assembler 要寫幾個 bytes，所以 suffix 不能省。地址寬度與資料寬度是兩回事：`%rsp` 是 64-bit address register，不表示 `8(%rsp)` 必然存 8 bytes。

這也提供一個實用 review 動作：看到 memory destination 和 immediate source 時，先找 suffix。沒有 register operand 幫忙推導寬度，遺漏或猜錯寬度都可能使組譯失敗，或讓你錯讀相鄰 bytes 的變化。

## Subregister 是同一份 storage 的不同視窗

`%rax` 是完整 64 bits，`%eax` 看低 32 bits，`%ax` 看低 16 bits，`%al` 看低 8 bits。`%rbx/%ebx/%bx/%bl`、`%rcx/%ecx/%cx/%cl`、`%rdx/%edx/%dx/%dl` 同理；其他 general-purpose registers 也有 64、32、16、8-bit 名稱。

它們不是四個可以獨立保存值的 registers。假設 `%rax` 原本是 `0x1122334455667788`：

```asm
movb $0xff,%al
```

只替換最低 byte，結果是 `0x11223344556677ff`。寫 `%ax` 會改低兩 bytes，寫 `%eax` 則有 x86-64 的特殊規則：32-bit register write 會把對應 64-bit register 的高 32 bits 清為零。因此：

```asm
movl $0xaabbccdd,%eax
```

會讓 `%rax` 成為 `0x00000000aabbccdd`，不是保留舊高半部的 `0x11223344aabbccdd`。這條規則讓 compiler 常用 32-bit instruction 同時產生乾淨的 unsigned 64-bit 結果；反過來說，看到 `%eax` 被寫後，就不能繼續沿用先前 `%rax` 高半部的假設。

## `movz` 與 `movs`：擴大寬度時必須決定高位元怎麼填

把 8-bit 或 16-bit source 複製進更寬 destination，缺少的高位元不能保持「未定」。`movz` 以零填滿，適合 unsigned interpretation；`movs` 複製 source 的最高位元，適合 two's-complement signed interpretation。

```asm
movzbl %al,%eax       # byte → 32-bit，zero-extend
movzwq (%rdi),%rax    # 16-bit → 64-bit，zero-extend
movsbl %al,%eax       # byte → 32-bit，sign-extend
movswq (%rdi),%rax    # 16-bit → 64-bit，sign-extend
```

若 `%al == 0xff`，`movzbl` 產生 `0x000000ff`，數值是 255；`movsbl` 產生 `0xffffffff`，若按 signed 32-bit 解讀就是 -1。原始八個 bits 完全相同，差別來自新增高位元的規則。

mnemonic 同時編碼 source 與 destination：`movzbl` 是 zero-extend byte-to-long，`movswq` 是 sign-extend word-to-quad。zero-extension 的完整表是 `movzbw`、`movzbl`、`movzwl`、`movzbq`、`movzwq`；sign-extension 則是 `movsbw`、`movsbl`、`movswl`、`movsbq`、`movswq`、`movslq`。source 必須是 memory 或 register，destination 必須是 register。

`cltq` 是特殊的 in-place form：把 `%eax` 的 signed 32-bit value sign-extend 到 `%rax`。投影片預告它會服務 signed division 所需的 dividend 準備；division 的完整流程留到後續，本講只建立「先把窄 signed value 擴成完整寬度」的理由。

## `sum_array`：`movslq` 是 index 進入 64-bit 位址公式的橋

投影片再次拿出 `sum_array`：

```asm
mov    $0x0,%eax
mov    $0x0,%edx
cmp    %esi,%eax
jge    done
movslq %eax,%rcx
add    (%rdi,%rcx,4),%edx
add    $0x1,%eax
jmp    loop
```

`%eax` 保存 `int i`，但 x86-64 memory operand 的 base/index 由 64-bit registers 組成，所以 `movslq %eax,%rcx` 先把 signed index 擴為 64 bits。接著 `(%rdi,%rcx,4)` 計算 `arr + i * 4` 並讀取一個 `int`，`add` 把它累加到 `%edx`。

這裡不能只說「compiler 喜歡多做一次 move」。若負 index 被錯誤 zero-extend，`-1` 會變成巨大的正 offset；sign-extension 保留 signed value 的數值意義。合法 C 呼叫本來不應用負 index 讀陣列，但 assembly 仍需忠實表達 source-level signed arithmetic。

## `lea` 只交付 effective address，不會讀取那個地址

`lea src,dst` 的 source 長得像 memory operand，destination 必須是 register；它把 effective address 的計算結果放進 destination，卻不 dereference：

```asm
leaq 8(%rsp),%rax
leaq (%rdi,%rsi),%rax
leaq 16(%rdi,%rsi,4),%rax
leaq -0x20(%rbp,%rcx,8),%r10
```

第一條得到 `%rsp + 8`；最後一條得到 `%rbp + 8 * %rcx - 32`。就算結果不是有效 memory address，純算術用途仍成立，因為 `lea` 沒有讀取它。

對照最容易看清：

```asm
movslq 4(%rsi,%rcx,8),%rbx
leaq   4(%rsi,%rcx,8),%rbx
```

第一條先算 address，再到 memory 取四 bytes 並 sign-extend；第二條只把 `%rsi + 8 * %rcx + 4` 放入 `%rbx`。若 `struct fract { int num; int denom; };`，前者可能對應 `fractions[i].denom` 的值，後者可能對應 `&fractions[i].denom`。括號並不足以宣告 memory access；instruction 本身才決定是否 dereference。

`lea` 也常被 compiler 當成受限但便宜的加法器。例如 `leaq (%rsi,%rdx,2),%rax` 能一次算出 `x + 2*y`。這不是濫用：effective-address hardware 本來就在做加法與 1/2/4/8 倍 scale，而 `lea` 明確要求只取結果、不讀 memory。

## 特殊用途 registers 來自執行契約，不是硬體型別

投影片列出常見角色：`%rax` 放整數 return value；`%rdi`、`%rsi`、`%rdx`、`%rcx`、`%r8`、`%r9` 依序放前六個 integer/pointer parameters；更多 parameters 通常改由 stack 傳遞；`%rip` 指向下一個 instruction；`%rsp` 指向目前 stack top。

這些角色主要是 ABI 契約。[AMD64 System V ABI](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)的 parameter passing 章節明列 INTEGER class 依 `%rdi` 到 `%r9` 的順序配置，return-value 章節則依 return type 分類決定 registers。也就是說，`%rdi` 不是天生的「第一參數 register」；遵守同一 ABI 的 caller 與 callee 約定如此使用它。

`%rip` 和 `%rsp` 的角色更靠近處理器執行與 stack discipline，但閱讀反組譯時仍要避免過度命名。函式內稍後可能重用 caller-saved register 保存暫存值；只有在相應程式執行點與 ABI 邊界上，parameter/return 解讀才最可靠。

## `dolores_park`：先逐條記錄效果，再還原兩行 C

投影片給出：

```asm
dolores_park:
    leaq (%rsi,%rdx,2),%rax
    movq %rax,(%rdi)
    movq (%rdi,%rsi,8),%rax
    subq %rdx,%rax
    ret
```

由 ABI 知道三個參數在 `%rdi/%rsi/%rdx`，假設 signature 是 `long dolores_park(long arr[], long x, long y)`。第一條計算 `x + 2*y`，第二條寫到 `arr[0]`。第三條從 `arr[x]` load 到 return register，第四條再減去 `y`。等價 C 是：

```c
long dolores_park(long arr[], long x, long y) {
    arr[0] = x + 2 * y;
    return arr[x] - y;
}
```

還原時有個順序陷阱：先寫 `arr[0]`，再讀 `arr[x]`。若 `x == 0`，return 讀到的是剛更新的值。把兩條 C 對調會在多數測試看似相同，卻不是等價程式。Reverse engineering 不只要認出 expressions，也要保留 side effects 的時間順序。

## Unary 與 binary ALU operations：第二個 operand 也是 destination

四個 unary instructions 只接一個 register 或 memory destination：`inc D` 做 `D+1`、`dec D` 做 `D-1`、`neg D` 做 two's-complement negation、`not D` 逐 bit 反相。

```asm
incq %rax
decq 8(%rsi)
negq (%rbx,%rcx,8)
notw %dx
```

binary form 則延續 AT&T 的 source、destination 順序：`add S,D`、`sub S,D`、`imul S,D`、`xor S,D`、`or S,D`、`and S,D` 都覆寫第二個 operand。source 可以是 immediate；兩個 operands 中至多一個是 memory。

```asm
addq %rsi,%rax
subq %rax,8(%rdi)
imulq $4,(%rsi,%rdx,8)
xorl %eax,%eax
orq $1,%rax
andq $-8,%rsp
```

`xorl %eax,%eax` 利用 `x ^ x == 0` 清零，再加上 32-bit write 清高半部，完整 `%rax` 都變成零。`orq $1,%rax` 設定最低 bit；`andq $-8,%rsp` 在 two's-complement mask 下清掉低三 bits，可把 stack pointer 向下對齊到 8-byte boundary。

最後一例也提醒：assembly comment 常提供意圖，instruction 只保證位元效果。`and $-8` 的直接語意是 mask；「alignment」是根據 operand、常數與上下文做出的高階解讀。

## Shift：左移相同，右移必須選 signed 或 unsigned 敘事

shift instruction 的兩個 operands 是 amount `k` 與被修改的 `D`。`sal` 與 `shl` 都把 bits 左移並以零補低位；`shr` logical-right shift，以零補高位；`sar` arithmetic-right shift，複製 sign bit 到高位。

```asm
shlq $1,%rax
shrq $2,%rbx
sarq $5,%rcx
sarq $3,8(%rdi)
```

對沒有 overflow 的整數，左移一位可對應乘二。`shr $2` 對 unsigned value 可對應除四；`sar $5` 常對應 signed value 的除 32 型態，但負數 rounding 與 source-language 規則仍需看 compiler 產生的完整 sequence，不能把單一 shift 無條件翻成 `/`。

若 shift amount 不是 immediate，x86 指定由 `%cl` 提供，而不是任意 register：

```asm
movq %rsi,%rcx
shlq %cl,%rax
```

實際 instruction 讀 `%cl`，並依 destination width 遮罩 count。投影片的 `%cl = 0xff` 例中，`shlb` 的有效 amount 是 7，`shlw` 是 15。

## Trace

1. 由 suffix 或 register 決定寬度。
2. 把 subregister 展開成完整 register 的哪一段，特別標記 32-bit write 會清高半部。
3. 分辨 immediate、register 與 memory；若有 address expression，先算 effective address。
4. 判斷 instruction 是像 `mov` 一樣讀取 memory，還是像 `lea` 只保留 address。
5. 寬度擴大時，標記 zero-extension 或 sign-extension。
6. 對 binary ALU form，先算 `D op S`，再把結果寫回第二 operand。
7. 對 shift，分清 `sar` 與 `shr`，並檢查 amount 是 immediate 還是 `%cl`。
8. 最後才用 ABI 與周邊 instructions 命名語意。

## 參考資料

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 16: Assembly — Arithmetic and Logic Operations（PDF）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/16/Lecture16.pdf)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
- [System V Application Binary Interface: AMD64 Architecture Processor Supplement（PDF）](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)
