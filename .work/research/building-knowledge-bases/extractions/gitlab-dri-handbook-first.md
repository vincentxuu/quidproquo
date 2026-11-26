# 抽取紀錄：GitLab — 先寫再宣布、誰都能提案、DRI 核准（Handbook Usage ＋ DRI 頁）

read_status=full（DRI 頁全文；Handbook Usage 全頁已在 gitlab-handbook-structure.md 讀過，本紀錄只抽 order 9 相關段，重讀相關行）

和 gitlab-handbook-structure.md 的分工：那份記「頂層怎麼分、不做 FAQ、搬移成本」（order 6–8 用）；這份只記維護責任：提案流程、核准、誰是 owner。

## 書目與讀取方式

| 頁面 | URL | 頁面標示最後修改 | 全文檔（scratchpad/fulltext/）|
|---|---|---|---|
| Handbook Usage | https://handbook.gitlab.com/handbook/about/handbook-usage/ | 2026-07-28（見 gitlab-handbook-structure.md）| gl-handbook_about_handbook-usage_.txt（333 行，30,343 bytes；行號以此檔為準）。本次另 curl 一份 o9-glusage.txt（337 行，30,410 bytes，內容相同，含頁首導覽多 4 行）|
| Directly Responsible Individuals (DRI) | https://handbook.gitlab.com/handbook/people-group/directly-responsible-individuals/ | 2026-04-15（行 87："Remove deprecated job grade table (93a48a94)"）| o9-gldri.txt（89 行，7,087 bytes）|

目錄完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/

讀取：curl（HTTP 200，HTML 約 2.3 MB，主要是側欄）→ pandoc plain。

## 性質

- 公司自述的規範（作者主張）。沒有成效資料。Usage 頁行 288 說工程部門把「Handbook Update Frequency」當 KPI，但只量更新次數，且說是為了「analyze and observe the effectiveness of this KPI」——KPI 本身還在觀察。

## 可引用內容與原句

### 先寫再宣布（Usage）

1. 三步流程（行 7–9）：問題出現 → "A proposal is made in a merge request to the handbook." → "Once merged, the change is announced by linking to the diff in the MR or commit." 重大變更貼 #whats-happening-at-gitlab，中等變更貼 #handbook 並附一行摘要；有 issue 就用 diff 連結結案。
2. 只能用 handbook 傳達變更（行 17）："Only communicate a (proposed) change through a change to the handbook; don’t use a presentation, email, chat message, or another medium to communicate the components of the change."
3. 先寫比較慢，公司承認（行 15）："Documenting in the handbook before taking an action may require more time initially ... But, it saves time in the long run"
4. 共同創辦人自己說最大的問題是沒做到（行 29–33）："The biggest problem is GitLab not working handbook first." / "The default of people, when they wish to communicate a change, is to send a Slack message, send an email, give a presentation, or tell people in a meeting — anything but make a change in the handbook." / "It’s slower than any other option."
5. handbook 寫的是現在（行 61）："the handbook is not what we hope to do, what we should formally do, or what we did months ago. It is what we do right now. Make sure you change the handbook in order to truly change a process."
6. 誰負責記下來（行 59）：被問到別人不知道的事，答完要討論「where it should be documented and who will do it」，提醒句是 "Who will document this?"

### 誰都能提案（Usage）

7. 拆開提案者與核准者（行 314–319）：wiki "tend to go stale over time"；MR 讓你 "split the role of submitter and approver"："Anyone who can read the handbook can make a proposal" / "Leaders (who tend to be short on time) only have to approve such a proposal"。
8. 小步、當天合（行 106、114）："contribute to the handbook by making small merge requests"；大而由上而下的流程變更 "can disempower DRIs"；"Aim to make and merge your update on the same day."
9. 搬移與改寫分開（行 116）："If you have to move content have a merge request that moves it and does nothing else."
10. 每個部門都有責任（行 202）："It is each department and team member’s responsibility to ensure the handbooks ... stay current."

### DRI 核准（Usage ＋ DRI 頁）

11. 頁面 owner 就是 DRI（Usage 行 242）："The page’s code owner is the DRI for the page and has the final say for what appears in the handbook. When in doubt, get the DRI’s permission before changing their page."
12. 不是每次都要核准（Usage 行 228–232）："Getting pinged to approve every small change to your page can be annoying"；"practice responsibility over rigidity. When you expect a page owner will appreciate your changes, go ahead and merge them without approval. Always ping the code owners"；出錯時 "we practice clean up over sign off."；例外如公開原本內部的文件要先核准。
13. owner 可以是群組（Usage 行 236–238）：從頁面 Maintainers 區看 owner；"For some pages, the Maintainers section is empty. This is because the page is maintained by a group rather than individuals." 要查 CODEOWNERS。——這是 order 9 自我檢查「owner 是角色不是人」最直接的一手例子。
14. 不知道找誰就看 CODEOWNERS（Usage 行 94）："Not sure who is responsible? Consult (and add to) the CODEOWNERS file"；範例：CMO staff 核准自家職能 MR、CMO 核准跨職能行銷 MR、CEO 核准全公司層級如 Values 頁（行 96）。
15. DRI 定義（DRI 頁行 11）："the ultimately accountable for the success or failure of a specific project, initiative, or activity"；"The DRI has final decision-making power but should consult and collaborate with relevant stakeholders"
16. DRI 不必解釋（DRI 頁行 15–17）："DRIs do not owe explanations for their decisions to avoid analysis paralysis"
17. DRI 多半掛在任務層級與職位上（DRI 頁行 33）："DRIs are most often assigned at the task-level. For example, when building a new product feature the Product Manager is the DRI for the prioritization and the Engineering Manager is the DRI for delivery."——寫法是職位（PM、EM），不是人名。
18. 與 RACI 的關係（DRI 頁行 51、56）：DRI 坐在 RACI 的 A；"There should be only one person accountable for each task and it’s often the same as the DRI."
19. 需要額外核准的情況（DRI 頁行 68–74）：牽涉三個以上職能、財務影響大、重大風險、聲譽考量、多重成功指標。

## 沒寫的事

- 兩頁都沒寫 DRI／code owner 離職、調職時頁面怎麼交接；也沒寫 CODEOWNERS 裡的人離開後誰更新那個檔。
- 沒有驗證週期：GitLab 靠「改流程一定要改 handbook」維持新鮮，沒有「每 N 個月確認一次」的機制。沒人去改的頁面不會被提醒。
- 沒有刪除規則（Usage 行 143–145 只說複製要改成連結）。
- DRI 頁講的是專案決策，不是文件維護；把 DRI 套到「頁面 owner」是 Usage 頁行 242 做的連結。

## 與常見轉述不一致處

1. 「GitLab 每頁都有一個負責人」：有些頁面由群組維護，Maintainers 欄是空的（Usage 行 238）。
2. 「GitLab 所有 handbook 修改都要 owner 核准」：原文反過來，預設是「預期 owner 會同意就直接合，事後 @ 通知」，出錯就清理（Usage 行 230）；只有特定情況要先核准。
3. 「handbook-first 讓 GitLab 文件永遠最新」：共同創辦人說最大問題就是大家不照做（Usage 行 29–33）；這是規範與目標，不是量測結果。
4. 「先寫再宣布」的「宣布」是貼 diff 連結到 Slack 頻道（行 9），宣布本身也指向 handbook，不是另寫公告內容。

## 限制

- 自述，無成效資料；GitLab 是全遠端、工程文化、全員會用 Git 的公司，「誰都能開 MR」的前提在一般團隊不一定成立（對照 counterevidence-verification-ritual.md 的 docs-as-code 採用摩擦）。
- 只讀公開 handbook；內部 handbook 的做法看不到。
