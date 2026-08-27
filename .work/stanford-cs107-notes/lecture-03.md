# CS107 Winter 2026 — Lecture 03 research note

- 日期：2026-01-09（Fri）
- 官方標題：Integers, Bits and Bytes
- 講者：Jerry Cain（投影片版權可確認）
- 取用層級：✅ 一手；已讀 calendar 與完整 PDF

## 完整 agenda

1. 32-bit 與 64-bit 系統的型別／位址空間。
2. unsigned integer 的範圍與 binary interpretation。
3. signed integer 表示法的候選設計，最後導出 two's complement。
4. two's-complement 規則、負數轉換、加法為何可沿用相同硬體。
5. binary representation 與 unsigned/signed overflow。
6. overflow 案例：PSY view count、Pac-Man、Donkey Kong，以及真實系統問題。

## 核心例子／指令／數字

- 32-bit pointer 可定址 `2^32` bytes = 4GB；64-bit 理論上 `2^64` bytes = 16 exabytes。
- 4-bit unsigned：`0101₂=5`, `1011₂=11`, `1111₂=15`，一般範圍 `0..2^w-1`。
- two's complement 的 w-bit signed 範圍為 `-2^(w-1)..2^(w-1)-1`；負值可由反相再加 1 得到。
- 投影片以有限位元加法展示 carry 被截掉，以及 signed overflow 在 C 中不是可靠的 wraparound 契約。
- YouTube/PSY 案例連到 32-bit signed counter 上限 `2,147,483,647`。

## 來源

- Calendar：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Slides：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/03/Lecture03.pdf

## 材料缺口

- 公開 PDF 完整；錄影只在 Canvas，故無法核對講者臨場補充。
