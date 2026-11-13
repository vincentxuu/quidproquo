# 查證紀錄：stanford-cs107-computer-systems

（2026-11-12 從 zh 與 en 正文移出的「附錄：數字與查證方式」整節，依 writing-guide「查證過程不寫進正文」）

## [zh] 附錄：數字與查證方式

本文資訊來自 2026-08-21 當天抓取的官方頁面，封存版網址格式為 `web.stanford.edu/class/archive/cs/cs107/cs107.<學期代碼>/`，其中 1256 為 Spring 2025、1262 為 Autumn 2025、1264 為 Winter 2026、1268 為 Summer 2026。每一個學期代碼對應的學期名稱，都以該封存頁自己標示的標題為準，不是從代碼推的。

- **Autumn 2025 作業功能分中位數**（出自該學期封存首頁的成績釋出公告）：assign0 為 26/26、assign1 為 90/90、assign3 為 95（公告寫「a perfect 95」）、assign4 為 106/107、assign5 為 116/119。assign2 的公告沒有給中位數，改為提醒功能分低於 85% 者適用重交政策，並點名很多人重新造輪子、自己實作了 `strspn`、`strcspn`、甚至 `strncmp`。assign6 的中位數在該學期公告中沒有出現。
- **Spring 2025 作業功能分中位數**（出自該學期封存首頁的成績釋出公告，七份齊全）：assign0 為 26/26、assign1 為 98/100、assign2 為 95/96、assign3 為 96/97（公告註明不計加分）、assign4 為 107/107、assign5 為 115/119、assign6 為 113/119。這是四個學期裡唯一連 assign6 都公布中位數的一梯。
- **Autumn 2025 與 Winter 2026 成績組成**（兩學期相同）：作業 40%、lab 參與 10%、期中 20%、期末 30%；Winter 2026 另寫明考試中位數低於 80 時整條分布往上調。
- **Spring 2025 成績組成**：作業 40%、lab 參與 5%、lecture points 5%、期中 20%、期末 30%。
- **Summer 2026 成績組成**：作業 20%、lab 參與 5%、期中 15%、期末 20%、小考 40%。C- 的門檻保證不高於 70%。
- **遲交上限（Cain 的兩個學期）**：24 小時內 95%、24–48 小時 90%、48–72 小時 85%、超過三天不收。
- **遲交上限（Spring 2025）**：24 小時內 95%、24–48 小時 87.5%，只開放兩天。
- **重交政策**：只出現在 Autumn 2025 與 Winter 2026 兩份 syllabus 的 Assignment Resubmission Policy 一節。內容為功能分低於 85% 者可重交補到 85%，但原始分數需至少 25%，否則上限為原分數的三倍；不重做程式碼審查；適用於 assign6 以外的所有作業。Spring 2025 的 syllabus 沒有這一節。
- **assign6 不收遲交**：四個學期一致，Head TA 核准的延期與 OAE 調整除外。
- **assign6 的檢查點規則**：期末提交的隱式配置器若與檢查點版本不同，功能分乘以 0.85 後若不低於檢查點分數才採用新版，否則以檢查點版本計分。
- **程式碼審查等第**：`+` / `ok` / `–` / `––` / `0` 五級，課程說明多數落在 `ok`。
- **講次與作業數**：Summer 2026 共 18 講（含期末複習）、7 份作業、7 份 lab。
- **課程結構**：每週一三五上課，另有每週一次的 lab。Summer 2026 的期末考長三小時。
- **五學分規定的適用範圍**：學位要求頁原文為「In the Core section, all undergraduate students (regardless of major) enrolling in CS 103, 107, 109, 111 or 161 must take it for 5 units.」——是「不分主修的所有大學部學生」，不限 CS 主修。
- **CS107ACE**：另一門一學分的加強輔導課（又稱 CS107A 或 Pathfinders），需申請、與 CS107 同時修，成績為滿意／不予學分。
- **遠距學分版學費**：[Stanford Online 的 CS107 頁](https://online.stanford.edu/courses/cs107-computer-organization-and-systems)在 2026-08-21 顯示為 7,875 美元、五學分，課程期間 2026-06-22 至 08-15，建議每週投入 15–25 小時。非學位生必須以最高學分數修習、必須拿字母成績、且每門課須維持 B 以上才能繼續選課。

有三項未能確認。**其一**，本站的 Stanford CS 課程地圖在 2026-08-20 記錄的 CS107 遠距學費是 8,110 美元，與本文 8 月 21 日讀到的 7,875 美元不同；該頁面只顯示當前開放梯次的數字，我無法回頭確認 8,110 對應哪一梯，兩個讀數都照實列出。**其二**，Summer 2026 講次表裡的 Sockets 那一講是否為該學期獨有，我只能確認 ExploreCourses 的官方課程描述沒有列入網路相關主題，無法確認其他學期的講次表是否也有這一講——封存區沒有公開索引頁，只能逐個學期代碼試。**其三**，Summer 2026 的 syllabus 我沒有找到重交政策的段落，但那不等於該學期沒有；我只能說我沒讀到，無法斷定不存在。

還有一項是刻意不下結論的：各學期的中位數為什麼都貼在上緣，公告頁與 syllabus 都沒有說明，本文不提供推測的機制。有重交政策的學期與沒有重交政策的學期，中位數同樣高，所以任何把兩者連起來的解釋都需要這些頁面之外的證據。

另外一項不是查不到、是刻意不查：作業與 lab 的起始碼在 AFS 上，需要 SUNet ID，本文沒有嘗試取得，所有關於作業內容的描述都來自公開的作業說明頁本身。

## [en] Appendix: numbers and how they were checked

Everything here comes from official pages fetched on 2026-08-21. Archived URLs follow the pattern `web.stanford.edu/class/archive/cs/cs107/cs107.<quarter code>/`, where 1256 is Spring 2025, 1262 is Autumn 2025, 1264 is Winter 2026, and 1268 is Summer 2026. Each code's term name comes from the title the archived page itself displays, not from decoding the number.

- **Autumn 2025 median functionality scores** (from grade-release announcements on that quarter's archived homepage): assign0 26/26, assign1 90/90, assign3 95 (the announcement says "a perfect 95"), assign4 106/107, assign5 116/119. The assign2 announcement gives no median, and instead reminds anyone below 85% of the functionality points about the resubmission policy, noting that many students reinvented the wheel by implementing `strspn`, `strcspn` and even `strncmp` themselves. No assign6 median appears in that quarter's announcements.
- **Spring 2025 median functionality scores** (from grade-release announcements on that quarter's archived homepage; all seven present): assign0 26/26, assign1 98/100, assign2 95/96, assign3 96/97 (the announcement notes this excludes extra credit), assign4 107/107, assign5 115/119, assign6 113/119. This is the only one of the four quarters that published a median for assign6.
- **Autumn 2025 and Winter 2026 grade composition** (identical): assignments 40%, lab participation 10%, midterm 20%, final 30%. Winter 2026 adds that if an exam median falls below 80, the whole distribution is curved up.
- **Spring 2025 grade composition**: assignments 40%, lab participation 5%, lecture points 5%, midterm 20%, final 30%.
- **Summer 2026 grade composition**: assignments 20%, lab participation 5%, midterm 15%, final 20%, quizzes 40%. The threshold for a C- is guaranteed to be no higher than 70%.
- **Late-submission ceilings (Cain's two quarters)**: 95% within 24 hours, 90% at 24–48 hours, 85% at 48–72 hours, nothing accepted past three days.
- **Late-submission ceilings (Spring 2025)**: 95% within 24 hours, 87.5% at 24–48 hours, two days only.
- **Resubmission policy**: appears only in the Assignment Resubmission Policy section of the Autumn 2025 and Winter 2026 syllabi. Anyone below 85% of the functionality points may resubmit up to that 85% mark, but the original score must be at least 25%, otherwise the ceiling is three times the original; the code review is not redone; it applies to every assignment except assign6. The Spring 2025 syllabus has no such section.
- **assign6 accepts no late submissions**: consistent across all four quarters, except for Head TA–granted extensions and OAE accommodations.
- **assign6 checkpoint rule**: if the implicit allocator submitted at the end differs from the checkpoint version, the new functionality score is multiplied by 0.85 and adopted only if the result is not below the checkpoint score; otherwise the checkpoint version is graded.
- **Code review grades**: five levels, `+` / `ok` / `–` / `––` / `0`; the course says most submissions land at `ok`.
- **Lecture and assignment counts**: Summer 2026 has 18 lectures (including the final review), 7 assignments, 7 labs.
- **Course structure**: lectures Monday, Wednesday and Friday, plus one lab a week. The Summer 2026 final runs three hours.
- **Scope of the five-unit rule**: the degree requirements page reads "In the Core section, all undergraduate students (regardless of major) enrolling in CS 103, 107, 109, 111 or 161 must take it for 5 units." — all undergraduates regardless of major, not just CS majors.
- **CS107ACE**: a separate one-unit supplementary section (also called CS107A or Pathfinders), by application, taken concurrently with CS107, graded satisfactory/no credit.
- **Tuition for the for-credit distance version**: the [Stanford Online CS107 page](https://online.stanford.edu/courses/cs107-computer-organization-and-systems) showed $7,875 for five units on 2026-08-21, running 2026-06-22 to 08-15, with a suggested 15–25 hours per week. Non-degree students must enroll for the maximum units, must take a letter grade, and must hold a B or better in each course to keep enrolling.

Three things I could not confirm. **First**, this site's Stanford CS course map recorded CS107 distance tuition as $8,110 on 2026-08-20, which differs from the $7,875 I read on August 21; that page only shows the currently open offering, and I can't go back to determine which offering $8,110 belonged to, so both readings are reported as read. **Second**, whether the Sockets lecture in the Summer 2026 schedule is unique to that quarter — I can confirm only that ExploreCourses' official description lists no networking topics, and I could not confirm whether other quarters' schedules include it, because the archive has no public index page and you can only try quarter codes one at a time. **Third**, I did not find a resubmission section in the Summer 2026 syllabus, but that isn't the same as the quarter not having one; all I can say is I didn't read it, not that it doesn't exist.

One more thing is deliberately left open: why the medians sit at the ceiling every quarter. Neither the announcements nor the syllabi explain it, and this piece offers no speculative mechanism. Quarters with a resubmission policy and quarters without have equally high medians, so any explanation linking the two needs evidence from outside these pages.

And one thing wasn't unavailable so much as not attempted: the assignment and lab starter code lives on AFS behind a SUNet ID, this piece made no attempt to obtain it, and every description of assignment content here comes from the public assignment specs themselves.

