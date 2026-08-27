# CS107 Winter 2026 — Lecture 07 research note

- 日期：2026-01-21（Wed）
- 官方標題：C-Strings, Buffer Overflows and Security
- 投影片標題：More C Strings
- 講者：未由 PDF 單獨署名確認
- 取用層級：✅ 一手；已讀 calendar 與完整 PDF

## 完整 agenda

1. `strchr`, `strrchr`, `strstr` 的 pointer-returning interface。
2. 自行實作 reverse substring search。
3. `strspn`/`strcspn` 與 character-set 掃描。
4. C strings 作為 parameters、password-validation 案例。
5. buffer overflow 的機制與著名 exploits。
6. 避免 overflow 的 capacity reasoning、library 選擇與 Valgrind demo。

## 核心例子／指令／數字

- `char laureate[]="Katalin Kariko"`; `strchr(...,'a')` 回傳 suffix `"atalin Kariko"`，第二次搜尋必須從 `first + 1` 開始。
- `strrchr` 找最後一次 occurrence；`strstr` 找 substring；失敗皆回 `NULL`。
- password-validation 範例說明僅檢查字串內容不足以防止超長輸入覆寫相鄰記憶體。
- 防護重點是 destination capacity、保留 terminator、檢查回傳值，並用 Valgrind 找 invalid read/write。

## 來源

- Calendar：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Slides：https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/07/Lecture07.pdf

## 材料缺口

- calendar title 與 slide title 不完全相同，兩者皆保留；demo transcript／錄影未公開。
