# CS107 Winter 2026 — Lecture 08 research note

- 日期：2026-01-23（Fri）
- 官方標題：Introduction to Pointers
- 講者：未由 PDF 單獨署名確認
- 取用層級：✅ 一手；已讀 calendar 與完整 PDF

## 完整 agenda

1. 回顧 C++ pass-by-reference。
2. pointer 是儲存 memory address 的變數；`&` 取址與 `*` dereference。
3. 從 CS106B style reference 過渡到 CS107 的記憶體圖與 pointer syntax。
4. pointer declaration、assignment、alias、mutation。
5. pointers 作為 parameters，如何讓函式修改 caller state。
6. pointer-parameter etudes、key takeaways、typed swap/rotation。

## 核心例子／指令／數字

- C++ `void func(int& num)` 可將 caller 的 `x=2` 改成 3；C 用 `void func(int *num)` 搭配 `func(&x)` 與 `*num=3` 達成。
- `int *p=&x`：`p` 存 `x` 的地址，`*p` 是該地址上的 int；多個 pointers 可 alias 同一格記憶體。
- pointer parameter 本身仍 pass-by-value，但複製的是地址，所以 dereference 後能改 caller-owned memory。
- strongly typed swap/rotation 展示每個資料型別都需各自版本，為後續 `void *` generics 埋伏筆。

## 來源

- Calendar：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Slides：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/08/Lecture08.pdf

## 材料缺口

- 講者未由 PDF 單獨確認；無公開 lecture code／錄影。
