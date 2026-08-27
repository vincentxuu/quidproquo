# CS107 Winter 2026 — Lecture 05 research note

- 日期：2026-01-14（Wed）
- 官方標題：Bitwise Operators, Take II
- 講者：未由 PDF 單獨署名確認
- 取用層級：✅ 一手；已讀 calendar 與完整 PDF

## 完整 agenda

1. 32-bit/long bitmask 操作練習。
2. `is_power_of_2` 的 bit trick。
3. left shift 與 right shift；logical/arithmetic shift 的差異。
4. 以 bit manipulation 實作 absolute value。
5. GDB：啟動、breakpoint、run/step/next、print/examine、backtrace。
6. bitmask + GDB 現場 demo。

## 核心例子／指令／數字

- `k = j & 0xFF` 取 32-bit `j` 最低 byte；`k = j ^ 0xFF0000FF` 反轉首尾 byte。
- `n = ~m` 或 `n = m ^ (~0L)` 全 bit 反相；`(n & (n >> 1)) != 0` 檢查相鄰兩個 1。
- power-of-two 判斷核心為非零 `n` 滿足 `(n & (n - 1)) == 0`。
- GDB 指令涵蓋 `gdb`, `break`, `run`, `next`, `step`, `print`, `x`, `backtrace`, `quit`。

## 來源

- Calendar：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Slides：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/05/Lecture05.pdf

## 材料缺口

- demo 的實際操作序列與 lecture code 未公開；講者未由 PDF 單獨確認。
