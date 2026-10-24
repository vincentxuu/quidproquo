# Van Kleek et al. 2009 — Note to Self: Examining Personal Information Keeping in a Lightweight Note-Taking Tool（＋每週回顧實證研究查詢紀錄）

read_status=read（4 頁全文）；每週回顧實證研究：not-found（查詢與結果見最後一節）

## 書目（實際讀的版本）

- 作者：Max Van Kleek, Michael Bernstein, Katrina Panovich, Greg Vargas, David Karger（MIT CSAIL）、mc schraefel（University of Southampton）。
- 出處：CHI 2009，4 頁短文（DOI 10.1145/1518701.1518924，前綴 1518701 為 CHI '09 主論文集；4 頁應為當年的 Note 類別，本紀錄未打開 ACM 頁確認類別）。Exa 結果標 2009-04-04。
- 讀的檔：https://people.csail.mit.edu/emax/papers/listit-chi2009.pdf（作者網站版，4 頁）。
- 與既有紀錄的關係：`vankleek-2011-finders-keepers.md` 是同一工具 List-it 的兩年縱貫分析（420 人）；本篇是更早的 10 天田野實驗（42 人），**不是同一份資料**。

## 選這篇的理由

- 任務要找「每週回顧或筆記維護習慣」的實證研究；每週回顧沒找到同儕審查研究（見最後一節），改取有行為記錄的筆記維護研究：本篇直接記錄了筆記建立後多久被編輯、刪除、搜尋。

## 研究設計

- 工具：list.it，Firefox 側欄的極簡文字筆記（新增、刪除、關鍵字搜尋；可快捷鍵、離線、跨機同步）。
- 受試者：112 位初期使用者中招募 42 人；10 天田野實驗。
- 自然筆記＋每天兩次 email 提示（10am、3pm；寫指定個人資訊或角色扮演情境；類型 to-do、how-to、wish-list、連結、事件摘要；順序平衡）。只有完成提示才給小額報酬，另抽 3 張禮券。
- 量了什麼：**實測行為記錄**（建立時間、長度、編輯、刪除、搜尋）＋結束後問卷（37 人回覆；分類最多 15 則隨機非提示筆記、解釋三則預選筆記）。分析僅限非提示筆記（除另註明）。

## 可引用結果（RESULTS 各小節）

1. 量：42 人都有非提示筆記；中位數 11 則、最多 142 則；未刪除筆記總數平均每天增加 35 則。
2. **記得快又短**：30% 在 5 秒內、50% 在 10 秒內、95% 在 2 分鐘內記完；長度中位數 29 字元、平均 62（σ 164）；中位數 7 個字；7% 只有一個字；43% ≤5 個字；80% 無換行、78% 無標點。
3. **記下後很少改**（Notes Are Rarely Revised or Deleted）：「After capture, 75% of notes were never edited again; 19% of notes were edited exactly once. Among edited notes, 39% were changed within 5 minutes of creation, while 76% were changed within a day.」被編輯的筆記中 40% 只改一兩個字元（多為錯字或加「!!」）。「it was more common for participants to append information to a note than to delete or revise existing text.」
4. **很少刪**：「only 28% of the notes created in list.it were deleted by the end of the study.」刪除者中 10% 在建立 1 小時內、26% 在 1 天內刪；1 天內刪的筆記較短（t(165)=−2.26, p<0.05；44.4 vs 73.6 字元）。個人差異大：16% 的人刪掉一半以上，多數人刪較少（μ=21%, σ=22%）。
5. **搜尋少**：335 次搜尋，42 人中 32 人搜尋少於 10 次；72% 至少搜一次。自報 34% 的筆記被刻意找回至少一次、21% 被瀏覽時碰到。兩位重度搜尋者 76% 的查詢是「today」「todo」這類詮釋詞——把搜尋當篩選器。
6. 自加詮釋詞：有人在筆記頭尾加「to do」「classes」「@」「**」「!!」以利找回（作者假設，搜尋詞與這些附加詞相符作為支持）。
7. 筆記不守 PIM 類型：自評 to-do 最多（69%），但常混入行事曆、聯絡資訊、URL。
8. 研究結束一週後 42 人中 16 人仍在用（約 38%）。

## 作者列的限制

- 引入新工具本身可能改變被研究的行為（THE LIST.IT 節）；作者以「設計夠簡單、與現有工具類似」為理由繼續。
- 搜尋少可能因為 10 天內累積筆記太少，說會長期追蹤（即後來的 2011 縱貫研究）。
- 瀏覽與其他使用無法從記錄區分，找回比例靠自報。

## 與摘要或常見轉述不一致處

1. 作者結論說「A week after the conclusion of the study, 16 of 42 participants continued to use the tool, demonstrating its efficacy」——留存率約 38%，換個角度是 62% 一週內就不用了；「demonstrating its efficacy」是作者的詮釋。
2. 「rarely revised or deleted」的觀察期只有 10 天；28% 刪除率是 10 天內的數字，不能外推成長期刪除率。
3. 「34% 被找回」是 37 人問卷中對隨機抽樣筆記的自報，不是行為記錄。
4. 本篇是 4 頁短文，統計只有一個 t 檢定，其餘為描述統計。

## 對 order 5 的意義

- 支持「筆記記下後絕大多數不會再被碰」：75% 從未編輯、編輯多在當天、多是改錯字或加記號；維護（改寫、合併、刪除）在自然狀態下幾乎不發生。這是需要「刻意回顧」或「讓 LLM 接手維護」的前提證據，但只有 10 天、42 人。
- 刪除：短命筆記（一天內刪）較短，像是用完即丟的提醒；長期留下的筆記大多不刪。

## 每週回顧（weekly review）實證研究查詢紀錄

- 查詢 1（Exa）：「empirical study of weekly review habit in personal task management or note maintenance practices, GTD weekly review users study」。結果：David Allen〈The Weekly Review〉PDF（方法說明，非研究）；Haraty et al. 2015 GI〈How and why personal task management behaviors change over time〉（178 人調查＋12 人訪談，主題是 PTM 行為變化，摘要未提每週回顧）；Haraty 2016〈How personal task management differs across individuals〉（IJHCS；訪談中有人試過 GTD 後放棄，「too much overhead」，但沒量回顧）；downloadchaos.com 部落格聲稱「surveyed 127 people」、每週回顧一致者 78% 自認成功（**個人部落格自辦調查，無方法說明，不可引用**）；Van Kleek 2009（本篇）；Finders/Keepers 2011（已有紀錄）。
- 查詢 2（Exa）：「peer-reviewed study Getting Things Done practitioners interviews weekly review adherence」。結果：produktivNorge 2015 GTD 課後調查（70/178 回覆，自評壓力下降等，**培訓公司自辦，無對照**）；Johnson 2013 博士論文（GTD 軟體對職前教師動機與自我調節，實驗組與對照組都顯著改善，作者歸因為課程平台本身模仿了 GTD，結果無法歸因於 GTD；未量每週回顧）；Lund & Wiese 2021 DIS〈Less is More: Exploring Support for Time Management Planning〉（19 位研究生訪談＋5 天規劃日記，主題是每日規劃，非每週回顧）；Roman Kalugin 2026 部落格〈Getting Things Done by David Allen: What the Research Says〉稱 2026-08-10 查 Crossref 與 Europe PMC「Neither index returns a single study of a two-minute completion threshold or of a weekly review ritual」（**二手部落格，查詢方法本紀錄未重做驗證**）。
- 結論：兩次查詢沒有找到直接量測「每週回顧」習慣或效果的同儕審查實證研究。可引用的相鄰證據是 PIM 行為研究（本篇、Finders/Keepers 2011、Haraty 2015/2016）。若 order 5 要寫每週回顧，只能寫成「方法論主張，未見實證檢驗」；如需再補，下一步可用 Groundlane paper_search 或 Google Scholar 查「weekly review」「periodic review」「self-monitoring」＋「personal information management」，以及 Heylighen & Vidal 2008〈Getting Things Done: the science behind stress-free productivity〉（理論文，非實證）。

## 讀取紀錄

- 取得：`curl -sL -A "Mozilla/5.0" https://people.csail.mit.edu/emax/papers/listit-chi2009.pdf` → PDF 4 頁；`pdftotext`（非 layout）。
- 全文檔：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/vankleek-2009-note-to-self.txt`（437 行，20,617 bytes）。依序讀第 1–415 行（標題至 CONCLUSION）；416 行起為參考文獻（5 筆），未逐條讀。雙欄抽字有段落錯置（摘要後半出現在作者欄下方、METHOD 段夾在 RESULTS 前後），已依語意還原。
- Figure 1（介面截圖）未看圖。
