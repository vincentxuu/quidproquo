# CS107 Winter 2026 — Lecture 02 research note

- 日期：2026-01-07（Wed）
- 官方標題：Unix and C
- 講者：Jerry Cain（投影片版權可確認）
- 取用層級：✅ 一手；已讀 calendar 與完整 PDF（約 50 pages）

## 完整 agenda

1. C 的歷史、與 C++/Java 的共通點及限制、語言設計哲學。
2. 第一個 C 程式：headers、`main`、statement、return value、comments。
3. `printf`、熟悉的控制語法、`bool` 與 command-line arguments。
4. 編寫、編譯、執行、除錯 workflow 與現場 demo。
5. Topic 1「Bits and Bytes」動機與 unexpected-behavior demo。
6. bit、byte、二進位與十進位互轉、hex 表示與互轉練習。

## 核心例子／指令／數字

- C 由 Dennis Ritchie 於 Bell Labs 1969–1972 年間建立，用來實作 Unix；從 B 延伸出 chars/longs/pointers/arrays/records。
- `int main(int argc, char *argv[])`、`printf` 與 `gcc` 編譯／執行流程是主要程式骨架。
- 8-bit byte 可表示 256 種 bit pattern；hex 一位對應 4 bits、兩位對應 1 byte。
- 練習包含 base-2/base-10 逐位權重、乘以 base 與除以 base、binary/hex 每四位分組。

## 來源

- Calendar：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Slides：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/02/Lecture02.pdf

## 材料缺口

- 錄影與 lecture code 不公開；PDF 標示 demo，但無完整終端 transcript。
