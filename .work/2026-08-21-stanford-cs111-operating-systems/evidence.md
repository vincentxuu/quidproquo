# 查證紀錄：2026-08-21-stanford-cs111-operating-systems

以下內容原為正文的附錄，2026-11-12 依 writing-guide「查證過程不寫進正文」移出正文。

## （原附錄）附錄：數字與查證方式

- **計分比重**（Spring 2026 syllabus）：作業 35%、section 出席 5%、講堂點名 5%、期中考 20%、期末考 35%。期中是兩小時、閉書、可帶兩張雙面 A4 筆記；期末三小時。
- **學分**：ExploreCourses 與 Stanford Bulletin 都寫 3–5 學分；CS 系學位要求頁規定 CS103／107／109／111／161 必須以五學分修習；syllabus 補充只有 Stanford 在籍研究生可以修 3–5 學分，大學部不滿五學分不予評分。三處說法一致，只是切面不同。
- **來源異動**：本文查證期間，Stanford CS 系的 `www-cs.stanford.edu/bs-core-requirements` 已下架（301 到 `www.cs.stanford.edu/bs-core-requirements` 後 404）。五學分規定改引現行的學位要求頁，「Formerly known as CS110」改引 2026 年 1 月的封存快照。引用這條的舊文章都需要換連結。
- **課程規模與時段**：Spring 2026 在 Nvidia Auditorium，一週三堂各 50 分鐘，共 28 堂（其中一堂遇假日停課）。八次 section、八份程式作業加一份暖身作業。
- **未來開課**：2026–2027 學年秋、冬、春三學期都開；秋與冬由 Nick Troccoli 授課，春由 Rosenblum 授課（依 ExploreCourses 條目，2026 年 8 月查）。
- **封存網址格式**：`web.stanford.edu/class/archive/cs/cs111/cs111.1266/`（1266 = Spring 2026）。CS110 的封存版是 `cs110.1204`（Winter 2020），本文寫作時可正常存取。
- **假日標示有誤**：Spring 2026 行事曆把 5 月 25 日標成 Presidents' Day，該日實際上是 Memorial Day（Presidents' Day 在二月）。停課本身沒錯，標籤錯了。
- **未能確認的三項**：（一）旁聽者用 `guest` 取代 `$USER` 的 clone 路徑是否仍然可用——我沒有 SUNet ID，無法實測；（二）寄信索取錄影權限的實際核准率；（三）Winter 2026 那一版（`cs111.1264`）的作業編號與 Spring 2026 不同（V6 檔案系統排在 assign1、日誌式檔案系統排在 assign2），我只讀到那兩份的封存頁，沒有完整的該學期行事曆，所以無法判斷整學期的順序是否重排過。

## （原附錄）Appendix: numbers and how they were checked

- **Grade weights** (Spring 2026 syllabus): assignments 35%, section attendance 5%, lecture participation 5%, midterm 20%, final 35%. The midterm is two hours, closed-book, with two double-sided A4 pages of notes allowed; the final is three hours.
- **Units**: ExploreCourses and the Stanford Bulletin both say 3–5 units; the CS degree requirements page mandates 5 units for CS103/107/109/111/161; the syllabus adds that only enrolled Stanford graduate students may take 3–5 units, and undergraduates below five units are not graded. All three agree — they're just cutting the same rule from different angles.
- **A source that moved**: while this was being checked, Stanford CS's `www-cs.stanford.edu/bs-core-requirements` came down (301 to `www.cs.stanford.edu/bs-core-requirements`, then 404). The five-unit rule is now cited to the current degree requirements page, and "Formerly known as CS110" to a January 2026 archive snapshot. Older articles citing that line all need their links replaced.
- **Size and schedule**: Spring 2026 meets in Nvidia Auditorium, three 50-minute lectures a week, 28 total (one cancelled for a holiday). Eight sections, eight programming assignments plus one warm-up.
- **Future offerings**: autumn, winter and spring of 2026–2027; Nick Troccoli teaches autumn and winter, Rosenblum teaches spring (per the ExploreCourses entry, checked August 2026).
- **Archive URL format**: `web.stanford.edu/class/archive/cs/cs111/cs111.1266/` (1266 = Spring 2026). The CS110 archive is `cs110.1204` (Winter 2020), reachable at the time of writing.
- **A mislabeled holiday**: the Spring 2026 calendar marks May 25 as Presidents' Day; that date is actually Memorial Day (Presidents' Day is in February). The cancellation is right, the label isn't.
- **Three things I could not confirm**: (1) whether the auditor clone path with `guest` in place of `$USER` still works — I have no SUNet ID and couldn't test it; (2) how often the email request for recording access is actually granted; (3) the Winter 2026 offering (`cs111.1264`) numbers its assignments differently from Spring 2026 (V6 file systems is assign1, the journaling file system is assign2). I could only reach those two archived handouts, not that quarter's full calendar, so I can't tell whether the whole sequence was reordered.
