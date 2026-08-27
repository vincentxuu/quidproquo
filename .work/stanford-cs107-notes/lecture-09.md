# CS107 Winter 2026 — Lecture 09 research note

- 日期：2026-01-26（Mon）
- 官方標題：Pointers and Arrays
- 投影片標題：Arrays and Pointers
- 講者：未由 PDF 單獨署名確認
- 取用層級：✅ 一手；已讀 calendar 與完整 PDF

## 完整 agenda

1. 以「C strings 七誡」統整 arrays、pointers、parameters 與 memory segment。
2. local `char[]` 的可修改性與不可重新賦值。
3. array 在 parameter／assignment／arithmetic context decay 成 pointer。
4. string literal 經 `char *` 指向 read-only data，不可修改。
5. pointer 可重新賦值、pointer arithmetic 產生 suffix。
6. parameter aliasing 造成 mutation 跨函式持續存在；配合 etudes/gotchas/scenarios。

## 核心例子／指令／數字

- 七條規則：local `char[]` 可改、array name 不可賦值、array decay、literal read-only、pointer 可賦值、offset 得 suffix、經 parameter 改字元會保留。
- `char arr[]="hello"` 配到 writable stack array；`char *p="hello"` 指向 read-only segment，`p[0]='H'` 是 undefined behavior。
- `arr[i]` 與 `*(arr+i)` 指向同一 sequential memory；傳入函式後 `sizeof(param)` 得 pointer size，不是原 array capacity。
- calendar 特別要求理解 array/pointer 兩種 syntax 背後是同一連續記憶體，但 array object 與 pointer variable 不是同一事物。

## 來源

- Calendar：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Slides：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/09/Lecture09.pdf

## 材料缺口

- calendar 與 slide 標題詞序不同；無公開錄影／lecture code。
