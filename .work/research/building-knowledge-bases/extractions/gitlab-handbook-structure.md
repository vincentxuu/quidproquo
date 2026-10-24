# GitLab Handbook — 頂層結構、Handbook Usage、About、Editing the Handbook

read_status=read（首頁、/handbook/、handbook-usage 全頁、about 全頁；editing-handbook 讀與結構／搬移相關的段落）

## 來源與讀取版本

讀取 2026-10-22，curl（皆 200）→ 擷取 `div.td-content`／`<main>` → pandoc plain（頁面 HTML 達 2.3 MB，主要是側欄導覽；只轉正文）。

| 頁面 | URL | 頁面標示的最後修改 | 檔案 |
|---|---|---|---|
| 首頁 | https://handbook.gitlab.com/ | — | `gl-.txt`（110 行，1,747 bytes）|
| Handbook 目錄 | https://handbook.gitlab.com/handbook/ | 2025-04-10 | `gl-handbook_.txt`（130 行，2,463 bytes）|
| Handbook Usage | https://handbook.gitlab.com/handbook/about/handbook-usage/ | 2026-07-28 | `gl-handbook_about_handbook-usage_.txt`（333 行，30,343 bytes）|
| About the Handbook | https://handbook.gitlab.com/handbook/about/ | 2026-09-17 | `gl-handbook_about_.txt`（132 行，6,801 bytes）|
| Editing the Handbook | https://handbook.gitlab.com/handbook/about/editing-handbook/ | 2026-10-15 | `gl-handbook_about_editing-handbook_.txt`（563 行，28,496 bytes）|

檔案目錄：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/`。

`/handbook/content-websites/handbook/` 轉址到 GitLab 登入頁（403），未讀。

## 主張／發現

全部是 **GitLab 自述的做法與理由**，沒有使用者研究或成效資料。

### 頂層怎麼分

1. **頂層就是公司職能／部門**（首頁 L5–94；/handbook/ L11–110）：Company、People Group、Product、Engineering、Enterprise Technology & AI、Security、Marketing、Sales、Finance、Legal & Corporate Affairs，共 10 個；第二層多是部門或子部門名（Accounts Payable、Payroll、Tax、Customer Support Department、Infrastructure Platforms Department…）。唯一不屬於部門的頂層是 Company（Values、Mission、Communication、About the Handbook）。
2. **規模**（/handbook/ L5）：「Printed, it consists of over 2,000 pages of text.」About L72：2026-10-22 Hugo 即時統計 **4,068,737 字、3,304 頁**（2026-01-01 為 5,137,908 字、4,040 頁，近一年頁數減少約 18%）。

### 他們自己說的取捨

3. **刻意按職能與結果組織，目的是每份內容都有位置和負責人**（Usage L151–157）：「The handbook is organized by function and result to ensure every item in it has a location and owner to keep it up to date.」
4. **他們承認這違反直覺**（Usage L156）：「Adhering to this hierarchy is sometimes counter-intuitive. We've learned over the years that keeping content in context helps to ensure consistency when making future updates.」
5. **不另建平行結構**（Usage L155）：「we not maintain separate structures for company training materials (such as onboarding materials, how-tos, etc.), videos, or other documentation.」
6. **需要另一種視角時，只連結、不複製**（Usage L157）：「At times, a change of perspective may be desired. In those cases, link to relevant sections of the handbook but don't include the content itself.」範例：入職模板、KPI 清單。
7. **避免非結構化格式**（Usage L167–172）：不要做 FAQ、quick links、資源頁、glossary、playbook、how-to 集合——「These are very hard to keep up-to-date and are not compatible with organization per function and result.」改把答案放到最相關的位置，「Use descriptive headings so that people can easily search for content.」但同一頁內混用多種格式可以。
8. **單一真實來源**（Usage L143–145）：「Instead of repeating content cross-link it」；複製就要刪掉原處並改成連結。
9. **補償手段是搜尋與標題**：每頁頂端有搜尋（Usage L86–88）；「Have a great search function, plus make it public so you can Google search.」（Usage L307）。
10. **頁面短**（Usage L163–165）：「Keep in mind that the biggest challenge cited by new employees is the vast amount of information to take in during onboarding.」
11. **讀者抱怨的回應**（Usage L298–310）：引用另一家公司的困擾「people don't know about it because they never bothered to read or search … 'wall of text'」，GitLab 的回應是寫作風格、好搜尋、入職測驗、真實例子、白話。
12. **wiki 不擴展**（Usage L312–323）：wiki 無法做跨多頁的提案，「Therefore it is hard to reorganize the handbook」；MR 讓提案者與核准者分工。
13. **搬移的代價被寫成標準流程**（Editing L70–92；L146–148）：移動頁面要更新所有入站連結、導覽、CODEOWNERS，加 redirect，並在實際服務環境驗證 redirect；「Changing a filename or directory can change the published URL」。Editing L41 的範例提示語：「I need to find a Git change to the sales development handbook page, which lived in marketing and was recently moved to sales.」——職能重組時頁面跟著搬家的實例。
14. **命名規則**（Editing L426–428）：「Handbook URLs should describe their content and be as clean and easy to remember as possible」；目錄與頁面只用小寫 a–z、`-`、`_`。
15. **標題**（Usage L176）：超過兩個標題加自動目錄；標題用一般大小寫，不用全大寫或 Title Case。
16. **流程本身**（Usage L5–21、L55–64）：先改 handbook 再行動；回答問題時給連結；「The handbook is the process」——名稱裡有 process／policies／best practices／SOP 的段落代表更深的問題（可能重複描述）。

## 可引用結果與原句

- Usage L153「The handbook is organized by function and result to ensure every item in it has a location and owner to keep it up to date.」
- Usage L156「Adhering to this hierarchy is sometimes counter-intuitive.」
- Usage L169 不做 FAQ／quick links／glossary 等，「very hard to keep up-to-date」。
- Editing L41 「…which lived in marketing and was recently moved to sales.」

## 限制

- 全是自述的規範，沒有讀者找資訊成功率、搜尋使用率或滿意度資料。About L87 說用 Snowplow 追蹤使用量、看 Tableau，但資料不公開。
- 只讀了公開 handbook；內部 handbook 的結構看不到。
- 工程部門把「Handbook Update Frequency」當 KPI（Usage L288），衡量的是更新頻率，不是可找性。

## 與常見轉述不一致處

1. **「GitLab handbook 是按讀者需求組織的典範」**：它的頂層明確是按職能／部門，而且 GitLab 自己承認這樣「sometimes counter-intuitive」。它選擇的是「每份內容有負責人、好維護」，讀者端的可找性交給搜尋、描述性標題、連結與入職訓練。這正是 NN/g（2014 A L56）說的「按部門方便維護、改組時導覽要跟著改」那一邊。
2. **「GitLab 用 FAQ／快速連結幫新人」**：handbook 規範恰好相反，叫人不要做 FAQ、quick links、glossary（Usage L169）；需要不同視角時只能做「連結頁」（如入職模板）。NN/g 2024 則把 Glossary 與 Quick Links（換好名字）列為好的 intranet 導覽項（NN/g B L88、L104），兩邊建議衝突。
3. **「handbook 越寫越大」**：頁數在 2026 年反而下降（4,040 → 3,304 頁，About L71–72）；頁面沒有說明原因（可能是清理或改統計方法），引用時不要推論。
4. 「handbook-first 讓文件永遠最新」是他們的目標敘述（Usage L19），不是量測結果；他們同一頁也引用共同創辦人說「The biggest problem is GitLab not working handbook first」（Usage L29）。

## 讀取紀錄

- 2026-10-22 curl 5 頁（1 頁轉址失敗）→ 自寫 HTML 擷取腳本 → pandoc；Read/cat 首頁 L1–110、/handbook/ L1–130、Usage L1–333、About L1–132；Editing 讀 L1–30、L90–125、L375–460 並 grep 全文的 structure／move／rename／section 等字（約讀了 40%，其餘為編輯工具操作說明，未逐行讀）。
