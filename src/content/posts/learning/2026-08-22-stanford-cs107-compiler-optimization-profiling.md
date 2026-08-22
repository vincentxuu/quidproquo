---
title: "Stanford CS107 Lecture 24：先用 Callgrind 找熱點，再讀懂 GCC 做了哪些最佳化"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, optimization, gcc, callgrind]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 25
tldr: "CS107 第 24 講用矩陣乘法與 Callgrind 建立量測流程，再拆解 GCC 的 constant folding、共同子運算式消除、dead-code elimination、strength reduction、code motion 與遞迴轉迴圈；最佳化從瓶頸證據開始。"
description: "導讀 Stanford CS107 Winter 2026 Lecture 24：Callgrind 指令計數、-O0/-Og/-O2 差異、六種編譯器轉換、aliasing 與語意限制，以及可重複的 profiling 工作流程。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-compiler-optimization-profiling-en)

「這行看起來比較快」是效能工作最危險的起點。第 24 講把最佳化拆成兩個不同責任：程式設計者先選合理的演算法、量出真正的熱點；編譯器再在不改變可觀察語意的範圍內，刪除、搬動或替換低階工作。兩邊都重要，但不能互相冒充。

這講先用三層迴圈的矩陣乘法比較未最佳化與 `-O2`，再介紹 Callgrind 的動態指令計數。後半逐一看 constant folding、common-subexpression elimination、dead-code elimination、strength reduction、code motion 與 tail-recursion optimization，最後用反覆呼叫 `strlen` 的例子說明 compiler 為何有時知道得不夠多。

## 教材與完整議程

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 正式講次：Lecture 24，2026 年 3 月 4 日
- 官方標題：Optimizations
- 講者：Jerry Cain
- 指定閱讀：Bryant & O'Hallaron 第 5 章
- 已讀材料：官方 calendar、Lecture 24 投影片、GCC optimization options、Valgrind Callgrind manual
- 材料缺口：Canvas 錄影、AFS 範例與現場 `limitations.c` demo 未公開；本文依公開程式片段解釋，不虛構 demo 結果

[官方 Lecture 24 投影片](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/24/Lecture24.pdf)的完整順序是：最佳化目標與基本策略、GCC 的 `-O0`／`-Og`／`-O2` 等級、矩陣乘法、Callgrind workflow、六類編譯器轉換、`-Og` 與 `-O2` 的 factorial 組合語言比較，以及 compiler 面對可能 alias／mutation 時的限制。

## 最佳化先分清楚規模、頻率與漸近成本

投影片把多數決策濃縮成三句。小輸入、低頻率的工作，選最簡單清楚的實作；大輸入或高頻率的工作，先確保主要演算法的漸近成本合理；低階 micro-optimization 留到量測證明有必要之後，再讓 GCC 先做它擅長的轉換。

這個順序避免兩種浪費。第一種是把冷路徑改得難讀，總執行時間卻幾乎不動。第二種是在平方或立方演算法裡省一條 instruction，輸入一放大仍被演算法階數淹沒。今晚能做的具體動作是：先建立 release build 的 baseline，記下固定輸入、命令、compiler version 與 metric，再決定要改哪一段。

「效率」也不只一個數字。時間、peak memory、binary size、延遲尾端與能耗可能互相衝突。Lecture 24 聚焦 instruction count 與執行時間，但不能把少指令直接當成所有平台都更快；cache misses、branch prediction、vectorization 與 I/O 仍會改變 cycle cost。

## GCC 最佳化等級是轉換組合，不是速度旋鈕

投影片用 `-O0` 對比 `-O2`。前者大致保留 C 結構，便於逐行觀察；後者啟用多數合理的最佳化。課程平常也使用 `-Og`，在除錯體驗與部分最佳化之間取平衡。另有偏向速度的 `-O3`、偏向 code size 的 `-Os`，以及可能放寬 standards compliance 的 `-Ofast`。

[GCC Optimize Options](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)明確提醒，每個 `-O` 等級會啟用一組 passes，實際集合也取決於 target 與 GCC release。不能只說「`-O2` 比 `-O0` 快」；應保存完整 compiler command，必要時用 `gcc -Q --help=optimizers` 查看當前組態實際開啟的 flags。

`-O0` 的組合語言較貼近來源，不代表它是 C 語意的唯一真相；`-O2` 的組合語言不像來源，也不代表 compiler 擅自改程式。兩者都受 language rules 約束。若原程式依賴 undefined behavior，高等級最佳化可能讓問題更明顯，這不是 optimizer 必須保存錯誤假設。

## 矩陣乘法先展示 compiler 能帶來多大差距

投影片用標準 `i-j-k` 三層迴圈：

```c
void mm(double a[][DIM], double b[][DIM], double c[][DIM], size_t n) {
    for (size_t i = 0; i < n; i++) {
        for (size_t j = 0; j < n; j++) {
            for (size_t k = 0; k < n; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }
}
```

課堂量測在不同矩陣大小都顯示 `-O2` 減少 cycles，其中 25×25 的案例從約 1.32M 降到 0.19M。這個數字只描述投影片當時的程式、機器與量測，不能移植成「任何 C 程式都快七倍」。它的用途是證明 build mode 本身足以改變結論：拿 debug build 評估 production 效能，baseline 從一開始就錯了。

矩陣乘法也提醒演算法之外仍有 memory access pattern。即使 Big-O 同為立方，迴圈順序與 blocking 會改變 locality。這講沒有把 cache optimization 當主題，因此本文不把某個排列宣稱為投影片結論；可帶走的是分層方法：先確定演算法，再以 profiler 找成本，最後檢查 compiler 與硬體層行為。

## Callgrind 量的是動態工作從哪裡發生

[Valgrind 官方 Callgrind manual](https://valgrind.org/docs/manual/cl-manual.html)把 Callgrind 定位為呼叫圖 profiler。典型流程是執行程式產生 `callgrind.out.<pid>`，再用 annotation 工具按函式或來源行彙整 instruction references：

```bash
valgrind --tool=callgrind ./program arg1
callgrind_annotate --auto=yes callgrind.out.<pid>
```

Callgrind 不只是列出「哪個函式很大」，而是估計實際執行路徑累積了多少工作。Static instruction count 是 binary 裡存在多少 instructions；dynamic instruction count 是一次 run 真正執行多少次。迴圈 body 靜態只有幾行，跑十億次後卻會主宰 dynamic count。

[Valgrind Callgrind manual](https://valgrind.org/docs/manual/cl-manual.html)說明工具預設收集 instruction access，並可模擬 cache 與 branch prediction；模擬會顯著增加執行成本。這表示 profiler run 的 wall-clock time 不是原生程式延遲，報告適合定位相對成本，不該把 Valgrind 下的秒數當 production latency。

## 一個可重複的 profiling workflow

先用代表性輸入跑未修改版本，保存 command、binary hash 與報告。接著從 inclusive cost 最大的路徑往下讀：某個函式昂貴，可能因自己做很多事，也可能因它反覆呼叫昂貴 callee。找到可改動的 leaf 或 loop 後，只改一件事，重新用同一輸入量測，最後以原生 benchmark 確認 wall time。

若啟動與解析輸入會蓋掉目標區域，可依 [Valgrind 官方選項說明](https://valgrind.org/docs/manual/cl-manual.html#cl-manual.options)使用 `--toggle-collect=<function>`，只在指定函式範圍收集。這不是為報告變漂亮，而是讓量測問題與程式問題一致。範圍切得太窄也會漏掉 caller/callee 成本，所以要在交接中記錄收集邊界。

不要先讀 source 猜 hot loop，再只量那段來證明自己。先看全程 profile，決定瓶頸後才縮小收集範圍。這個順序能避免 confirmation bias，也能發現成本其實在 allocator、字串掃描或資料轉換，而不是最顯眼的數學函式。

## Constant folding：編譯期算得出的就不留到執行期

Constant folding 把純常數運算預先求值。`60 * 60 * 24 * n_days` 的常數部分不必每次重算。投影片更誇張的 `fold` 範例包含固定 `sizeof`、固定字串長度與常數算術；`-O0` 產生一長串 loads、calls 與 arithmetic，`-O2` 最後縮成乘上一個常數再加常數。

```c
int seconds = 60 * 60 * 24 * n_days;
```

程式設計者不必為了「幫 compiler」手算成 `86400`。保留可讀的單位推導，compiler 仍能折疊；magic number 反而丟失意義。能否折疊取決於 compiler 是否能證明值與呼叫在編譯期可知且沒有必須保留的副作用。

投影片另一個 bit trick 用 `~0U / UCHAR_MAX` 與 shift 建立 masks，`-O2` 直接把常數嵌入 `lea` 與 `and`。這是很好的界線：用可攜的 C 表達意圖，讓 target-specific instruction selection 留給 compiler。

## Common-subexpression elimination：相同運算只做一次

若同一表達式在可證明 operands 未改變的區域出現多次，compiler 可以計算一次並重用。投影片以 `param2 + 0x107` 為共同子運算式，再把後續代數整理成較短的乘加序列。

這項轉換不是文字搜尋。兩段看起來相同的 expression 中間若有可能修改資料的 call、volatile access 或 alias write，compiler 就不能任意共用舊值。反過來，來源看起來不同的算式若代數上等價，也可能被 compiler 合併。

寫程式時優先為人命名重要中間值，不必為每個重複算式手動 caching。只有 profiler 顯示 compiler 無法消除且成本重要時，才考慮重構資料流，並用 assembly 或 optimization report 驗證真的改變 generated code。

## Dead-code elimination：沒有可觀察效果的工作可以消失

投影片列出永遠不成立的條件、空迴圈、兩個分支做相同動作，以及最後等價於直接回傳參數的判斷。`-O0` 仍保留許多控制流程；`-O2` 把整個函式化成一次加法後返回。

Dead code 不只指 `if (false)`。若某次計算的結果從未被使用，且沒有 observable side effect，也能被移除。這會讓錯誤 benchmark 變成測量空函式：若結果既不輸出也不影響外部狀態，optimizer 可能合法刪掉整段待測工作。

避免的方法不是把所有東西標成 `volatile`。Benchmark harness 應讓結果以受控方式可觀察，例如累積 checksum，並檢查 generated assembly。`volatile` 有特定語意，會限制合法最佳化，卻不是通用的跨執行緒同步或 benchmarking 魔法。

## Strength reduction：用較便宜的等價運算取代昂貴運算

Strength reduction 會在語意允許時，把乘除或 modulo 換成 add、shift 或 bitwise operation。投影片例子包含乘以 32、乘以 7、除以 3、modulo 2，以及迴圈 induction variable 相關運算。

```c
int a = param2 * 32;
int d = param2 % 2;
```

不要因此把所有 `x * 32` 手改成 `x << 5`。對 signed values、overflow 與負數，兩個來源寫法的語意與可讀性可能不同；compiler 掌握 target cost model，通常能選擇合適 instruction。程式設計者應寫出正確型別與意圖，再用 profile 證明極少數需要人工介入的地方。

「較少 instructions」也不必然等於「較少 cycles」。現代 CPU 可平行執行部分操作，某些 multiply 已很快，而多條依賴的 add 可能拉長 critical path。Lecture 24 用 transformation 建立閱讀 assembly 的詞彙，不是提供永遠適用的手改規則。

## Code motion：把 loop-invariant work 搬出去

若 expression 在每輪結果相同且沒有必須重複的副作用，compiler 可以把它移到 loop 外。投影片例子中 `foo * (bar + 3)` 不依賴 `i`，因此沒必要每次重新計算。它和共同子運算式消除的差別是：這個 expression 在 source 只出現一次，重複來自動態迴圈。

```c
for (int i = 0; i < n; i++) {
    sum += arr[i] + foo * (bar + 3);
}
```

Code motion 需要證明 operands 不在 loop 內改變。Global state、未知函式呼叫、pointer alias 與可能 trap 的操作都可能阻止移動。手動提出常數有時能把領域知識告訴 compiler，但要先確認值真的 invariant，否則只是把 bug 搬到迴圈外。

## 遞迴轉迴圈：看 assembly 才知道 call 是否還在

投影片的 factorial 來源以 `n * factorial(n - 1)` 寫成遞迴。`-Og` assembly 保留 recursive `callq`；`-O2` 版本改成 loop，以乘法累積並遞減參數，不再為每一層建立 call frame。投影片把這類結果放在 tail-recursion 標題下，重點是 compiler 能辨識某些 recursive pattern 並改成 iteration。

這個具體來源的乘法在 recursive call 回來後才完成，嚴格說不是最直白的 source-level tail call；讀 assembly 比背標籤可靠。`-O2` 消除 call 並不會修正數學問題：若輸入因 unsigned wraparound 或條件永遠無法抵達 base case，改成 loop 只會把無窮遞迴變成無窮迴圈。

因此不能把 optimizer 當 correctness tool。先證明 termination、overflow 與邊界，再把「有沒有 stack growth」當效能與資源問題。需要穩定控制 stack usage 時，直接寫清楚的 iterative algorithm 往往比期待某個 compiler version 做轉換可靠。

## Compiler 的限制：它不能採用你腦中的領域保證

投影片最後用兩個 `strlen` 迴圈。只讀字串的 `char_sum` 中，compiler 可能把 `strlen(s)` 搬出 loop；但 `lower1` 會修改 `s[i]`，compiler 未必能證明字串長度不變，因此可能每輪重掃。程式設計者知道把大寫轉小寫不會產生 `\0`，source-level alias 與函式語意卻不一定把這項保證傳達給 optimizer。

```c
void lower1(char *s) {
    size_t n = strlen(s);
    for (size_t i = 0; i < n; i++) {
        if (s[i] >= 'A' && s[i] <= 'Z') {
            s[i] -= ('A' - 'a');
        }
    }
}
```

把長度先算一次能明確表達 invariant，也把反覆線性掃描改成一次。這類人工重構有證據、有語意理由，而且仍容易讀懂，和把乘法亂換 bit hacks 不同。改完後仍要用 Callgrind 比較 dynamic instruction count，並用測試覆蓋空字串、非 ASCII bytes 與邊界。

Aliasing 是常見阻礙。兩個 pointers 可能指到相同空間，透過其中一個寫入就可能使另一個讀值失效。Compiler 必須保守，除非型別規則、local analysis 或明確 contract 足以排除。程式設計者能做的是縮小 mutation 範圍、用清楚的 local variables 表達不變量，而不是責怪 compiler 沒猜中。

## 一份實際可用的最佳化檢查表

先固定 correctness tests，再建立與 production 相同 optimization level 的 baseline。用 Callgrind 找 dynamic instruction 熱點，同時以原生計時確認它真的影響目標 metric。選一個能說明機制的改動：降低演算法階數、消除重複掃描、改善資料布局，或讓 invariant 對 compiler 可見。

接著用同一 workload 重跑，查看 inclusive 與 self cost 是否如預期移動。若只把成本搬到另一個函式，不算完成。最後檢查 binary size、記憶體與 edge cases，保存 compiler version 與 flags。不要把一次 laptop 結果寫成跨平台定律。

若改動只讓 source 更晦澀，而 `-O2` assembly 原本就相同，撤回它。Constant folding、共同子運算式消除與 strength reduction 都說明了為何「替 compiler 手算」通常沒有收益。把人的注意力留給 algorithm、資料與 compiler 無法知道的 contract。

## 這講的真正結論：證據決定工作順序

Lecture 24 不是六招語法改寫大全。它建立一條完整鏈條：用合理的演算法避免結構性浪費，以 release-like build 形成可信 baseline，用 Callgrind 找出動態成本，再從 assembly 理解 compiler 已經做了什麼。只有剩下的瓶頸才輪到人工修改。

Compiler 很強，因為它可以精確追蹤常數、資料流與 target instructions；compiler 有限制，因為它必須保存語言允許的所有可觀察行為，不能隨便採用程式設計者沒寫出的領域知識。好的最佳化不是和 compiler 比誰更會 bit trick，而是把正確的資訊放在正確層級。

最值得帶走的動作很簡單：下一次覺得某段程式慢，先不要改。用固定輸入跑 profiler，寫下成本集中在哪裡，再檢查 `-O2` generated code。若 compiler 已把你的巧思做完，就保留清楚版本；若它被 alias 或 mutation 擋住，才重構以表達你能證明的不變量。

## 更新紀錄

- 2026-08-22：移除失效的 Stanford Callgrind guide，改以 Valgrind 官方手冊支撐工作流程與選項。

## 參考資料

- [Stanford CS107 Winter 2026 — Course Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 24 — Optimizations](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/24/Lecture24.pdf)
- [GCC — Options That Control Optimization](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)
- [Valgrind — Callgrind Manual](https://valgrind.org/docs/manual/cl-manual.html)
