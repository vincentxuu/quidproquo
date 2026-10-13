# 第 13 堂（對話系統與工具使用）修改紀錄

日期：2026-10-13。依 `rereview-lecture-13.md` 修改，未 commit。

檔案：

- zh `src/content/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use.md`
- en `src/content/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use-en.md`

複審報告沒有必修項目。待處理的是 R1–R4 與一項未編號的參考建議（下稱 R5），另加任務書的通用規則。

## 報告項目

### R1 Toolformer：補回「可能」— 已改

- 依據：`transcripts/13.5.txt` 06:06–06:15「其實有用WebSearch也不一定會很強啦／因為WebSearch可能不一定／這麼符合他這種QA的這種精確問題／以及可能還是沒有辦法做這些運算」。報告說法屬實。
- zh 第 189 行
  - 改前：她說就算有搜尋，也不一定適合這種精確的問答，而且還是做不了這些運算。
  - 改後：她說就算有搜尋，也不一定適合這種精確的問答，可能還是做不了這些運算。
- en 第 189 行
  - 改前：she says that even with search it would not necessarily suit such precise QA and still could not do the arithmetic.
  - 改後：she says that even with search it would not necessarily suit such precise QA and might still be unable to do the arithmetic.

### R2 LaMDA 第二次查詢 — 已改

- 依據：2024 講義第 48 頁（`pdftotext -f 48 -l 48 -layout`）：`TS, Eiffel Tower construction date` → `construction started: 28 January 1887`；`TS, Eiffel Tower complete when` → `date opened: 31 March 1889`。`transcripts/13.2.txt` 10:29–10:41「開始的時間是這個／然後他就會說那是什麼時候完成的呢／然後他就會再收完成時間／……其實實際上是收了兩次／……最後再把它合併在一起」。報告說法屬實。
- zh 第 127 行
  - 改前：Research 其實查了兩次：先查動工的日期，再查啟用的日期，最後合併成一句。
  - 改後：Research 其實查了兩次：第一次查到動工的日期，再追問什麼時候完成，查到啟用的日期，最後合併成一句。
- en 第 127 行
  - 改前：Research actually queries twice: first for the construction start date, then for the opening date, and merges the two into one sentence.
  - 改後：Research actually queries twice: the first query returns the date construction started, it then asks when the tower was completed and gets the opening date, and it merges the two into one sentence.

### R3 「同一段錄影」的理由 — 已改（措辭比報告建議更貼近證據）

- 依據：複審留下的比對檔 `scratchpad/rereview-13/`。這次重算 `dl/zh136.m4a` 與 `dl/zh137.m4a` 的 sha256，兩者都是 `2c324dca…d66a`，原始音軌位元組相同。`ssim.log` 共 182 格，末三格 All 為 0.9945、0.9979、0.9898，與報告「平均 0.9948、最低 0.9858」相容（平均與最低沒有重算）。兩份逐字稿 `cmp` 相同。
- 報告建議寫「畫面與聲音完全相同」。影片檔是各自轉檔的（報告第二節：360p 檔案雜湊不同，SSIM 約 0.995），位元組相同的只有音軌，所以改成「畫面一致、原始音軌完全相同」。
- zh 第 51 行
  - 改前：13.6 與 13.7 兩支的逐字稿一字不差，長度也相同，是同一段錄影掛了兩個標題。
  - 改後：13.6 與 13.7 兩支影片的畫面一致、原始音軌完全相同，長度也相同，是同一段錄影掛了兩個標題。
- en 第 51 行
  - 改前：The transcripts of 13.6 and 13.7 are identical word for word and the lengths match: one recording is posted under two titles.
  - 改後：Videos 13.6 and 13.7 show the same picture, carry an identical original audio track, and have the same length: one recording is posted under two titles.

### R4 缺第 13 堂範圍卡 — 不改

- 理由：流程面項目，不涉及文章內容，屬任務書允許不改的情況 (b)。是否補卡由作者決定。

### R5（未編號，「不建議一定要改」）LaMDA 傳聞的後半句 — 已改

- 依據：`transcripts/13.2.txt` 01:27–01:31「就是有一個這個八卦／當然不確定是真是假／但我覺得應該是蠻真的／大家可以去Google一下」。報告說法屬實。
- zh 第 106 行
  - 改前：她說不確定真假，請大家自己查。
  - 改後：她說不確定真假，但覺得應該是真的，請大家自己查。
- en 第 106 行
  - 改前：She says she is not sure whether it is true and suggests looking it up.
  - 改後：She says she is not sure whether it is true, though she thinks it probably is, and suggests looking it up.

## 任務書的通用規則

### 英文版第一次提到講者要點名 — 已改

- 英文正文第一次提到講者是第 51 行的 "the lecturer's summary"，早於第 59 行的 "Professor Chen"。
  - 改前：…from slide 76 of the 2024 deck and the lecturer's summary in 13.9.
  - 改後：…from slide 76 of the 2024 deck and Professor Chen's summary in 13.9.
- 第 59 行原本就是 "Professor Chen first separates two cases."，之後才用 she，不動。

### 「常見的誤解」說明句 — 已改（僅英文）

- en 第 303 行
  - 改前：These are my own summary, not points listed one by one in the lecture.
  - 改後：This list is my own summary, not something the lecture enumerated point by point.
- zh 第 303 行「以下是本文的歸納，不是課堂上逐條列出的內容。」不動。

### 「優化」與其他中國用語 — 無須修改

- zh 全文沒有「優化」。另外搜尋了質量、信息、視頻、默認、數據、用戶、網絡、軟件、代碼、算法、調用、內存、文本、模塊、交互、屏幕、反饋、接口、智能體等，都沒有出現。唯一命中是第 171 行「通過測驗」，這裡是「考試及格」的意思，不是中國用語的「通過（透過）」。

### 粗體 `**詞（說明）**` 後直接接中文字 — 無須修改

- zh 共七處粗體以「）」收尾（第 82、137、139、145、184、226、235 行），後面接的都是句號「。」，不是中文字，粗體可以正常渲染。第 243 行已是 `**ExploreToM**（Sclar 等 2025）`。

## 沒有改的項目

| 項目 | 理由 |
|---|---|
| R4 範圍卡 | 流程面，不涉及文章內容 |
| S11 文末只嵌四支影片、S13 第 37 行查核說明 | 複審報告第四節註明維持原狀、沒有另外意見，不是待辦項目 |
| 「優化」、粗體格式 | 查過，文章裡沒有符合的情況 |

## 檢查結果

- `check-course-titles.mjs`：`Course title gate: 0 issue(s)`
- `check-course-guide-layout.mjs`：`Course source layout: 1716 posts, 0 issue(s). This checks section order, not teaching quality.`（這支腳本回報的是全站篇數，不是只算傳入的兩個檔案）

`pnpm verify` 沒有跑，實際渲染的頁面也沒有看。
