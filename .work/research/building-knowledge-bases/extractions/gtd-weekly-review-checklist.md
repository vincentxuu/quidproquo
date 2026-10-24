# 抽取紀錄：GTD Weekly Review Checklist（David Allen Company）

read_status=full（一頁 PDF，全部文字讀完）

## 書目

- The David Allen Company，「GTD Weekly Review®」清單，一頁。頁尾：「© 1990-2006 The David Allen Company. All rights reserved. www.davidallengtd.com」。
- 網址：https://gettingthingsdone.com/wp-content/uploads/2014/10/Weekly_Review_Checklist.pdf （上傳路徑 2014/10）
- PDF 中繼資料：Adobe InDesign CS3 製作，CreationDate 2010-07-14，ModDate 2013-08-17，1 頁。
- 性質：方法作者的官方檢核清單，不是研究。
- 讀取方式與全文檔（scratchpad/fulltext/）：
  - `curl -sL -A "Mozilla/5.0 …"` → HTTP 200，39,221 bytes PDF（dl/gtd.pdf；與先前存的 gtd-weekly.pdf 位元組相同，`cmp` 無差異）
  - `pdftotext -layout` → fix-gtd-weekly-review-checklist.txt（52 行，1,995 bytes）
  - 目錄完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 下文行號是 fix-gtd-weekly-review-checklist.txt 的行號。

## 清單全文（三段、11 項，依原順序編號）

GET CLEAR（6–14）
1. Collect Loose Papers and Materials —「Gather all accumulated business cards, receipts, and miscellaneous paper-based materials into your in-tray.」（7–8）
2. Get "IN" to Zero —「Process completely all outstanding paper materials, journal and meeting notes, voicemails, dictation, and emails.」（10–11）
3. Empty Your Head —「Put in writing and process any uncaptured new projects, action items, waiting for's, someday maybe's, etc.」（13–14）

GET CURRENT（17–36）
4. Review Action Lists —「Mark off completed actions. Review for reminders of further action steps to record.」（18–19）
5. Review Previous Calendar Data（21–22）
6. Review Upcoming Calendar（24–25）
7. Review Waiting For List（27–28）
8. Review Project (and Larger Outcome) Lists —「Evaluate status of projects, goals, and outcomes, one by one, ensuring at least one current action item on each. Browse through project plans, support material, and any other work-in-progress material to trigger new actions, completions, waiting for's, etc.」（30–33）
9. Review Any Relevant Checklists —「Use as a trigger for any new actions.」（35–36）

GET CREATIVE（39–44）
10. Review Someday Maybe List —「Review for any projects which may now have become active, and transfer to "Projects." Delete items no longer of interest.」（40–41）
11. Be Creative and Courageous —「Any new, wonderful, hare-brained, creative, thought-provoking, risk-taking ideas to add into your system???」（43–44）

## 核對系列正文

| 正文位置 | 正文說法 | 原文 | 判定 |
|---|---|---|---|
| order 1 L56 | GTD 每週回顧的第二步是把收件匣清到零 | 第 2 項 Get "IN" to Zero（10–11） | 吻合。注意「IN」在原文指所有待處理的紙本、筆記、語音、email，不只一個收件匣 |
| order 5 L25 | 分成三段：Get Clear、Get Current、Get Creative | 6、17、39 行三個段標 | 吻合 |
| order 5 L25 | 原本是給待辦事項用的 | 內容全是 actions、projects、calendar、waiting for | 吻合 |
| order 5 表 Get Clear | GTD 原本：收件匣清到零 | 第 2 項；本段另有第 1 項收集散落紙本、第 3 項清空腦袋 | 吻合（只列代表項） |
| order 5 表 Get Current | GTD 原本：檢查專案清單 | 第 8 項；本段共 6 項，另有行動清單、行事曆前後、等待清單、相關檢核表 | 吻合（只列代表項，非唯一內容） |
| order 5 表 Get Creative | GTD 原本：檢視「將來／也許」清單 | 第 10 項；另有第 11 項 Be Creative and Courageous | 吻合（只列代表項） |

## 沒寫的事

- 沒寫每週回顧要花多久、在星期幾做；也沒寫為什麼是每週。
- 沒有任何效果證據；清單本身只是步驟。

## 讀取紀錄

- 全文檔：fix-gtd-weekly-review-checklist.txt，52 行，1,995 bytes。
- 依序讀完第 1–52 行（cat -n 一次讀完）：1 標題，6–44 三段 11 項，49 延伸資源網址，52 版權列。
- 讀取日期：2026-10-22
