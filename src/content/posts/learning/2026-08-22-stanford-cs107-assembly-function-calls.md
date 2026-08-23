---
title: "Stanford CS107 Lecture 19：從 call/ret 到 calling convention，讀懂 x86-64 函式呼叫"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, calling-convention]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 20
tldr: "CS107 第 19 講追蹤 %rsp、push/pop、call/ret、parameters、return values、stack locals 與 caller/callee register discipline，建立可跨函式維持資料與控制流的 ABI 契約。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 19：stack pointer、push/pop、call/ret、function pointers、參數傳遞、local storage 與 register-saving convention。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-assembly-function-calls-en)

函式呼叫不是單純「跳到另一個 label」。Caller 還得讓 callee 找到 parameters，保留回來後該執行的 instruction address，提供必要 stack space，並確保雙方不會踩掉仍有用的 registers。Stanford CS107 Lecture 19 用 57 頁逐格追蹤，把這四件事收斂成 `call`、`ret`、`%rsp` 與 calling convention。

這份契約的價值在於 separate compilation：caller 不必讀懂 callee 每一行，只要雙方遵守同一 ABI，就能交換 data、恢復 control，並知道哪些 registers 可能改變。

## 本講資料、缺口與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 19，2026-02-20
- calendar 標題：Introduction to Function Call and Return
- 投影片標題：Assembly: Function Call
- 講者：[完整 PDF](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/19/Lecture19.pdf) metadata 列 Jerry Cain
- 指定閱讀：Bryant 與 O'Hallaron，*Computer Systems: A Programmer's Perspective* 3.7
- 已讀材料：官方 calendar、完整 57 頁投影片、GNU assembler AT&T/Intel syntax 文件、2025 AMD64 System V ABI
- 材料缺口：Canvas 錄影、AFS lecture code，以及第 56 頁列出的 `rfact.c`／`rfact` demo 未公開；本文不虛構 recursion trace

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)把本講定位成 function call 與 return。[完整投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/19/Lecture19.pdf)依序涵蓋：transfer control／pass data／manage memory；`%rsp` 與 stack growth 的五頁動畫；`pushq/popq` effect、等價展開與 etude；return address 的五頁動畫；`call/ret`；function pointers；六個 register parameters 與 stack parameters；local storage 四個理由與 `swap_add`；八參數 `func` 的 20 頁逐步 trace；register interference；caller/callee 相對角色；兩類 register ownership；nested calls；recursion demo 提示；最後用 `sum_array` 收束整套 assembly。

本講沒有談 heap allocation 或 Lecture 20 的 privacy 主題。Stack diagram 雖把 heap/data/text 畫在同一張 memory map，本文只使用本講實際說明的 stack 與 code/control-flow 部分。

## `%rsp` 定義當前 stack top，呼叫前後必須恢復平衡

投影片圖中的 stack 往較低 address 成長，所以 `foo` 再呼叫 `bar` 時，新 frame 畫在下方，`%rsp` 也下降。圖上的「top」是最新配置位置，不是紙張上緣。

最重要的不變量是：一個 function 正常 return 後，caller 看到的 `%rsp` 應回到 call 前的位置。Callee 可以暫時下降 `%rsp` 配置 frame，也可因 nested call 再下降；但退出前必須解除自己造成的變化，否則 caller 的 locals、stack arguments 與 return address 都會以錯誤 offset 解讀。

Stack frame 不是每個 function 都必須長成固定模板。若 locals 全能留在 registers、沒有額外 alignment 需求，compiler 可能不配置 frame。閱讀時應追 `%rsp` 的實際 arithmetic，而不是先假設一定有 `%rbp` prologue。

## `pushq` 與 `popq`：先移動指標還是先讀寫，順序不能反

`pushq S` 的 effect：

```text
%rsp = %rsp - 8
memory[%rsp] = S
```

等價於：

```asm
subq $8,%rsp
movq S,(%rsp)
```

`popq D` 則先讀目前 stack top，再上移：

```text
D = memory[%rsp]
%rsp = %rsp + 8
```

等價於 `movq (%rsp),D; addq $8,%rsp`。Pop 不會清零舊 bytes；它只是宣告該位置不再屬於目前 active stack，之後可被 overwrite。

Etude 從 `%rax=0x123`、`%rdx=0`、`%rsp=0x108` 開始。`pushq %rax` 先讓 `%rsp=0x100`，再把 `0x123` 寫到 `0x100`；`popq %rdx` 讀出 `0x123`，最後 `%rsp` 回 `0x108`。這是一組最小的 stack-balance proof。

## `call` 保存 return address，`ret` 用它恢復 `%rip`

若 main 要去 foo，直接改 `%rip` 會失去「回哪裡」的資訊。`call target` 把 call 後緊接的 instruction address push 到 stack，再把 `%rip` 設成 callee target。`ret` 從 stack top pop 八 bytes 到 `%rip`，於是 caller 從 call 的 successor 繼續。

```asm
call label       # direct call
call *%rax       # indirect call
ret
```

[GNU assembler 的 AT&T/Intel syntax 對照](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)說 AT&T 的 absolute jump/call operand 以 `*` 標示；因此 `call *%rax` 的 target 來自 register。Function pointer，例如 `qsort` 收到的 comparator，讓真正 callee 到 runtime 才決定。

Return address 與 return value 必須分開。前者是 code address，`call` 放到 stack、`ret` 放回 `%rip`；後者是 callee 算出的 data，常放 `%rax` 或其 subregister。`ret` 不會替 function 計算回傳值。

投影片動畫用 `%rsp` 從 `0xff20` 到 `0xff18`、return address `0x3026` 被保存，再進入 foo；foo 自己的 frame 還可使 `%rsp` 更低。退出 frame 後 `ret` 取回 `0x3026`，最後 caller 的 `%rsp` 恢復。具體 addresses 是示意；不變的是 push/transfer 與 pop/resume 的次序。

## Parameters 與 return value 依 ABI 放置

[AMD64 System V ABI](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)的 parameter-passing 規則將前六個 INTEGER-class arguments 依序放入 `%rdi`、`%rsi`、`%rdx`、`%rcx`、`%r8`、`%r9`；放不進 registers 的 arguments 進 stack argument area。Return value 則依 type classification 指派，普通 integer/pointer 常由 `%rax` 帶回。

「第七參數一定在 `%rsp`」並不精確：call 本身還會 push return address，caller 也須遵守 alignment，callee entry 的實際 offset 必須按 ABI layout 計算。讀 listing 時以 call 前後的 `%rsp` 與 stores 為證據，不背一個脫離時間點的固定 offset。

Parameter register 只保證 call boundary 上的入口位置。Callee 可立刻搬走、覆寫或重用；反組譯時要追 data flow，不能在整個函式裡永久把 `%rdi` 命名成第一個 source variable。

## Locals 為何需要 stack storage

投影片列四個理由：可用 registers 不足；某些 live values 必須跨 call 保存；local 被取 `&`，需要真正 address；local 本身是 array/struct 等 aggregate，適合連續 memory。

```c
long caller() {
    long arg1 = 534;
    long arg2 = 1057;
    long sum = swap_add(&arg1, &arg2);
}
```

對應片段：

```asm
subq $0x10,%rsp
movq $0x216,0x8(%rsp)
movq $0x421,(%rsp)
movq %rsp,%rsi
leaq 0x8(%rsp),%rdi
callq swap_add
```

前兩個 stores 建立 arg1/arg2；`mov %rsp,%rsi` 直接把 arg2 address 當第二 parameter，`lea` 算出 arg1 address 當第一 parameter。`lea` 沒 dereference，正好對應 C 的 `&`。這個 frame 退出前還需把 `%rsp` 加回 16，雖然本頁在 call 處截斷。

Stack local 的 lifetime 與 frame 綁定。Return 後把其 address 留給 caller 使用會違反 C lifetime；本講的例子只在 active call 中把 pointers 傳給 `swap_add`，沒有引入 heap 或跨 lifetime ownership。

## 八參數 trace：先配置四個 locals，再分流 register 與 stack arguments

投影片用：

```c
func(&i1,&i2,&i3,&i4,i1,i2,i3,i4)
```

做了從第 28 到 47 頁的逐步動畫。`main` 先 `sub $0x18,%rsp`，把四個 `int` 以 4-byte stores 放到 offsets `0xc/0x8/0x4/0`。接著 arguments 7、8，也就是 v3=3、v4=4，以反向準備次序 push 到 stack；arguments 5、6 的 v1=1、v2=2 放 `%r8d/%r9d`。

前四個 pointer parameters 要在兩次 push 後才用 `lea` 計算。因 `%rsp` 已下降 16 bytes，原 locals 相對目前 `%rsp` 的 offsets 變成 `0x1c/0x18/0x14/0x10`，依序放 `%rdi/%rsi/%rdx/%rcx`。若在 push 前算 pointer 並保存於不穩定位置，或仍使用舊 offsets，就會指向錯誤 stack slots。

`callq func` 再 push return address，使 callee entry 的 `%rsp` 比兩個 stack arguments 更低。Func return 後，execution 恢復於 `0x40059b`，caller 以 `add $0x10,%rsp` 移除自己為 arguments 7、8 push 的 16 bytes；它之後仍需在函式結尾解除 local frame。

這 20 頁不是 20 個不同 concepts，而是同一 invariant 的逐 instruction 可視化：每次 push 都會改變後續 stack-relative address。文章濃縮動畫，但保留每一類 state transition、register assignment 與 return-address effect。

## Caller/callee 是每一條 call edge 的相對角色

若 main 呼叫 function1，main 是 caller、function1 是 callee；function1 再呼叫 function2 時，它同時是前一條 edge 的 callee與下一條 edge 的 caller。Calling convention 不能把一個 function 永久分類成 caller 或 callee。

問題是所有 functions 共用同一組 hardware registers。Function1 若把 live value 放 `%r10` 再呼叫 function2，而 function2 也寫 `%r10`，原值就消失。ABI 因此把 registers 分成需要 callee preserve 與允許 callee clobber 兩群。

投影片使用「caller-owned」表示 caller 可假設跨 call 保留、所以 callee 使用前要 save/restore；常見 ABI 術語稱這群 **callee-saved**。投影片的「callee-owned」表示 callee 可直接覆寫、caller 若需要舊值須自行保存；常見術語稱 **caller-saved**。兩套名稱觀看所有權的角度相反，effect 才是判讀準則。

## Save/restore discipline 讓 nested calls 仍能組合

若 function1 使用 callee-saved `%rbx/%rbp`，典型做法：

```asm
pushq %rbp
pushq %rbx
...
popq %rbx
popq %rbp
retq
```

Restore 要逆序，因 stack 是 LIFO。Function1 可以假設 function2 同樣遵守契約，因此它放在 callee-saved registers 的 values 能跨 nested call 存活。

對 caller-saved `%r10/%r11`，function1 若 call function2 後仍需要舊值，就由 function1 在 call 前保存、call 後恢復：

```asm
pushq %r10
pushq %r11
callq function2
popq %r11
popq %r10
```

實際 compiler 也可能 spill 到已配置 frame 而不使用 push/pop。核心契約不是特定 instruction sequence，而是 callee-saved 在 return 時回復入口值；caller-saved 不承諾保留。

ABI 的 register table還包含 `%rsp` 必須維持 stack discipline，以及各 register 在 parameter passing 中的角色。文章使用投影片的 ownership 教學分類，但真正跨 object files 的 interoperability 以 ABI 文件為準。

## Recursion 與 `sum_array` 收束：公開 slide 只給方向，不補 demo

第 56 頁說將以 `rfact.c`、`rfact` 和 GDB 追 recursion，但公開 PDF 沒有 code、trace 或結果。可由已知 mechanics 推論每次 recursive `call` 都需要自己的 return address與必要 saved state；然而無法忠實還原 demo 的 frame layout，所以本文停在材料邊界。

最後一頁重放 `sum_array`：arguments 在 `%rdi/%esi`，loop index與sum 在 `%eax/%edx`，`movslq` 準備 64-bit index，conditional/unconditional jumps 實現 loop，`mov %edx,%eax` 放 return value，`retq` 取回 caller control。它沒有新的 opcode，而是證明 Lectures 14–19 的各個片段已能合成完整函式。

## 一套 function-call tracing 清單

1. 在 call 前記錄 `%rsp`、return successor 與所有 parameter locations。
2. 展開每個 push：先減 `%rsp`，再 store；所有後續 stack offsets 隨之重算。
3. 對 `call` 同時加入 return-address push 與 callee control edge。
4. 在 callee 中區分 return value `%rax` 與 stack 上的 return address。
5. 標記每個跨 nested call 仍 live 的 value，檢查由 caller 還是 callee 負責保存。
6. 對 `ret` 取 stack top 成新 `%rip`，再驗證 caller cleanup 後 `%rsp` 平衡。
7. Function pointer 的 indirect target 要沿 register/memory data flow 追來源。

Lecture 19 的核心是三份契約同時成立：control 由 return address 接回去，data 依 parameter/return locations 交換，memory 與 registers 依 ownership 規則恢復。這些契約足以解釋獨立編譯的 functions 為何能互相呼叫；heap 與後續 privacy 議題不需要被提前塞進來。

## 參考資料

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 19: Assembly — Function Call（PDF）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/19/Lecture19.pdf)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
- [System V Application Binary Interface: AMD64 Architecture Processor Supplement（PDF）](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)
