# CS107 Winter 2026 — Lecture 04 research note

- 日期：2026-01-12（Mon）
- 官方標題：Bitwise Operators
- 講者：未由此 PDF 單獨署名確認（版權列 Stanford CS；slides credits 含 Jerry Cain 等人）
- 取用層級：✅ 一手；已讀 calendar 與完整 PDF

## 完整 agenda

1. signed/unsigned cast：bits 不變、interpretation 改變。
2. 不同 signedness 的 comparison 規則。
3. sign extension、zero extension 與 truncation。
4. `&`, `|`, `~`, `^` 的逐 bit 語義。
5. 多位元運算、bitmask、bit vector 表示集合。
6. mask 的讀取、設定、清除與切換操作。

## 核心例子／指令／數字

- `int v=-12345; unsigned int uv=v;` 印出 `uv=4294954951`；32 個 bits 完全相同，只是型別解讀不同。
- 多型別 comparison 先依 C conversion rules 轉型，可能使負 signed 值成為很大的 unsigned 值。
- bit vector 例子用每一 bit 表示 core CS course 是否正在修習，集合操作可映射為 AND/OR/XOR。
- 常見 mask idioms：`x & mask` 測試、`x | mask` 設定、`x & ~mask` 清除、`x ^ mask` toggle。

## 來源

- Calendar：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Slides：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/04/Lecture04.pdf

## 材料缺口

- PDF 沒有單獨列講者姓名；不得僅憑 slide credits 斷言授課者。
