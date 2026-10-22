# 審稿紀錄：知識庫怎麼建 order 9〈維護責任：誰負責、多久確認一次、什麼時候刪〉

- 審稿對象：`src/content/posts/learning/2026-10-22-team-wiki-maintenance-ownership.md`（zh）、`src/content/posts/learning/2026-10-22-team-wiki-maintenance-ownership-en.md`（en）
- 日期：2026-10-22
- 審稿員：獨立審稿（未參與寫作），一輪做完 post-verify／post-review／post-polish；未改文章
- 證據來源：`.work/research/building-knowledge-bases/extractions/` 的 grudin-poole-2010-wikis-at-work、tan-2024-outdated-code-references、torkki-2024-documentation-debt-action-research、gitlab-dri-handbook-first、gitlab-handbook-structure、notion-verified-pages、counterevidence-verification-ritual、google-docguide、writethedocs-docs-as-code、silva-2023-ericsson-documentation-debt、kcs-v6-reuse-is-review；有疑義處回 scratchpad `fulltext/` 全文核對（o9-torkki.txt、grudin.txt、o9-codeorg-pr71072.md、o9-silva.txt）。規則依 repo 版 `.agents/skills/post/references/writing-guide.md`。
- 行號：zh／en 逐行對齊（兩檔都是 140 行），以下同一行號。
- 機器檢查：`check-process-leak.mjs` 中英皆 0；`pnpm check:tw` 0 blocking／0 review；`register-scan.sh` 三段單段 4 個數字（19、23、59 行）、模板化轉折 2 處（49、105 行）、研究者姓名當主詞 1；`scan-ledger.sh` 模板化轉折 2 處同上。

統計：🔴 4／🟡 13／🟢 7

---

## post-verify

### 🔴 V1　Torkki「負責人常常在提醒別人」把 sometimes 寫成常態

- 位置：zh 29；en 29
- 原句：zh「但負責人實際上常常在做的事，是提醒其他人去寫。」；en「but what owners actually spent much of their time doing was reminding others to write.」
- 依據：torkki-2024-documentation-debt-action-research.md 行 26；全文 o9-torkki.txt 行 576–577：「owners sometimes had to remind contributors of the documentation tasks when the time came to return their attention to documentation」。原文是「有時」，而且是在急事打斷之後；en「much of their time」更強。
- 改法：
  - zh：「但被急事打斷之後，負責人有時得出面提醒其他人回來寫。」
  - en：「but when urgent work pulled people away, owners sometimes had to remind contributors to come back to the documentation.」

### 🔴 V2　Torkki 的 RACI 是作者建議，不是觀察

- 位置：zh 39；en 39
- 原句：zh「他們觀察到，有了這張表，負責的人換掉時比較不會混亂。」；en「they observed that with the chart in place, a change of responsible person caused less confusion.」
- 依據：torkki 紀錄行 33；全文 o9-torkki.txt 行 840–866：在〈Recommendation 1〉內，「To resolve this dilemma, we propose a process approach……Having the RACI model in place reduces confusion when there is a change of a responsible person.」是提案的理由，個案公司沒有實施 RACI，也沒有觀察到這個效果。
- 改法：
  - zh：「他們的理由是，有了這張表，負責的人換掉時比較不會混亂。」
  - en：「their reasoning is that with the chart in place, a change of responsible person causes less confusion.」

### 🔴 V3　KCS「封存勝過刪除」與「政策類例外」的出處頁沒列，參考資料列了另一頁

- 位置：zh 67（政策例外）、73（「Archiving an article is better than deleting it.」與封存後的行為）、138–140（參考資料）；en 同行
- 原句：zh 73「KCS 則說『Archiving an article is better than deleting it.』：封存後不出現在搜尋裡，但舊的連結還看得到，也能還原」；zh 67「KCS 自己也對政策、法規類的文章設了例外，只有指定的人能改。」
- 依據：kcs-v6-reuse-is-review.md 行 59（引文出自 t52「Technique 5.2 KCS Article State」行 176、208–209）、行 55（Compliance Based 例外出自 t52 行 261–272）；t52 路徑是 `030/040/010/030`（同檔行 19）。參考資料只列了 4.1 Reuse is Review（030/030/040/020）、4.2 Flag It or Fix It（030/030/040/030）、5.5 Archiving Old Articles（030/040/010/044）；5.5 只支撐「治標」那半句（行 61）。直接引文的來源頁不在清單、也沒有行內連結。另三條已列路徑與紀錄一致。
- 改法：參考資料加一條，並在第 73 行引文處加行內連結。
  - zh 參考資料：「- [KCS v6 Practices Guide: KCS Article State](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/030)」；第 73 行：「KCS 則說『Archiving an article is better than deleting it.』（[KCS v6: Article State](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/030)）：……」
  - en 同上（顯示名稱相同）。
  - 順帶：第 65 行「flag it or fix it」第一次出現時也可加行內連結到 030/030/040/030；第 73 行「治標」可加連結到 030/040/010/044。

### 🟡 V4　KCS 說「縮小知識庫是治標」，文章寫成只講「刪」

- 位置：zh 73；en 73
- 原句：zh「它也提醒，靠刪文章來解決找不到，只是治標。」；en「it also warns that shrinking the knowledge base to fix findability only treats the symptom.」
- 依據：kcs 紀錄行 61：「Archiving old articles treats the symptoms of findability, not the cause.」「Addressing findability issues by reducing the size of the knowledge base is treating the symptom」。KCS 連「封存」也算治標。zh 寫成「刪」，等於把 KCS 說成「封存可以解決找不到」；en 的 shrinking 是對的，zh/en 不一致。
- 改法：zh「它也提醒，靠刪文章或封存來縮小知識庫、好讓東西比較好找，只是治標。」en 不用改。

### 🟡 V5　Confluence 留言「約一百封」寫成「上百封」

- 位置：zh 51；en 51
- 原句：zh「有使用者回報員工收到上百封『頁面不活躍』的信」；en「about a hundred」
- 依據：notion-verified-pages.md 行 57；counterevidence-verification-ritual.md 行 15：「receiving about 100 emails」。「上百封」在台灣常讀成「好幾百封」，而且中英不一致。
- 改法：zh「收到約一百封『頁面不活躍』的信」。

### 🟡 V6　Notion「只能填人」比來源強

- 位置：zh 41；en 41
- 原句：zh「Notion 的『頁面負責人』欄位只能填人」；en「Notion's "page owner" field only takes people」
- 依據：notion-verified-pages.md 行 34：「owner 是『人』欄位……說明頁沒有提到可以指派群組或角色」；行 73 同。來源能支持的是「說明頁只寫了填人」。
- 改法：
  - zh：「Notion 說明頁寫的『頁面負責人』是人員欄位，沒有提到能填群組」
  - en：「Notion's help page describes the page owner as a person field and doesn't mention groups」

### 🟡 V7　Confluence「官方說明沒有群組」沒附連結

- 位置：zh 41；en 41
- 原句：zh「Confluence 的官方說明也沒有提到可以指派群組。」
- 依據：notion-verified-pages.md 行 13、52（依據頁是 Transfer ownership of your content item，已全文讀），但正文與參考資料都沒有這一頁；行內唯一的 Confluence 連結是社群公告，不是官方說明。
- 改法：行內加連結，參考資料加一條。
  - zh：「Confluence 的官方說明也沒有提到可以指派群組（[Confluence: Transfer ownership](https://support.atlassian.com/confluence-cloud/docs/transfer-ownership-of-your-content-item/)）。」
  - en：「…doesn't mention assigning a group either ([Confluence: Transfer ownership](https://support.atlassian.com/confluence-cloud/docs/transfer-ownership-of-your-content-item/)).」

### 🟡 V8　GitLab「DRI 多半寫成職位」把 most often 套錯對象；「每一頁都有 code owner」是紀錄標過的轉述

- 位置：zh 37；en 37
- 原句：zh「GitLab 的 Handbook 每一頁都有 code owner……GitLab 的 DRI 也多半寫成職位」；en「Every page of GitLab's Handbook has a code owner……GitLab's DRIs are also mostly written as positions」
- 依據：gitlab-dri-handbook-first.md 行 48：原文「DRIs are most often assigned at the task-level」，「多半」指任務層級；寫成職位（PM、EM）是例子的寫法，不是「多半」。同檔行 42、61：原文是「The page's code owner is the DRI for the page」，「GitLab 每頁都有一個負責人」被列為與常見轉述不一致處。
- 改法：
  - zh：「GitLab 的 Handbook 規定，頁面的 code owner 就是那一頁的直接負責人（DRI）……GitLab 舉的 DRI 例子也是寫職位：產品經理負責排優先順序、工程經理負責交付」
  - en：「In GitLab's Handbook, a page's code owner is its directly responsible individual (DRI)…… GitLab's own DRI examples are written as positions: the product manager owns prioritization and the engineering manager owns delivery」

### 🟡 V9　code.org「2026 年」實為 2026 年頭兩個月

- 位置：zh 59；en 59
- 原句：zh「分析自家 2026 年合併的 542 個 PR」；en「analyzed the 542 pull requests merged in their project in 2026」
- 依據：counterevidence-verification-ritual.md 行 24（PR 開立 2026-02-27）；全文 o9-codeorg-pr71072.md 行 8：「all 542 merged pull requests by human authors in 2026」。文章日期是 2026-10，讀者會讀成全年。
- 改法：zh「分析 2026 年頭兩個月由人提交、已合併的 PR」；en「analyzed the pull requests by human authors merged in the first two months of 2026」（同時解決 P1 的數字密度）。

### 🟡 V10　Silva「只有 8 筆」沒有比較對象

- 位置：zh 61；en 61
- 原句：zh「發現從可靠資料自動產生的版本說明只有 8 筆缺陷」
- 依據：silva-2023-ericsson-documentation-debt.md 行 23–24；全文 o9-silva.txt 行 450–452：同一張分布表裡部署指南 129 筆、安裝指南 53 筆，版本說明 8 筆。少了對照，「只有」沒有意義。
- 改法：
  - zh：「發現手寫的部署與安裝指南佔了一半以上的缺陷，從可靠資料自動產生的版本說明則少得多，作者推測跟它是自動產生的有關」
  - en：「found that handwritten deployment and installation guides accounted for over half the defects, while the release notes, generated automatically from a reliable source, had far fewer; the authors conjecture…」

### 🟢 V11　Torkki 引文歸屬可更清楚

- 位置：zh 29；en 29
- 原句：zh「他們記下的一句話很直接」；en「one quote they report puts it bluntly」
- 依據：o9-torkki.txt 行 578–580：「One developer summarized team members' general attitude……」。現寫法沒錯，但讀起來像研究者自己的話。
- 改法：zh「一位開發者的話很直接」；en「one developer put it bluntly」。

### 🟢 V12　「所以實際的過時程度只會更高」少了誤報那一面

- 位置：zh 25；en 25
- 依據：tan-2024-outdated-code-references.md 行 53（只抓一種過時，是下限）與行 69（也有誤報，RQ4 有 4/15 專案回報誤報）。
- 改法：zh「所以實際的過時程度應該更高」；en「So the real level of staleness is likely higher」。

### 已核對無誤（摘要）

Grudin Orbit 案例：200 人、數百頁、數十位貢獻者、「going to weed」、主要貢獻者離開→PM 接手又被調走→沒有 gardener→經理看到 raggedy 內容撤資源（grudin 紀錄行 42–44；grudin.txt 行 225–262）。Tan：熱門組 800 個有歷史可分析、82.3% 曾經過時（tldr「八成」）、Google 組 29.7%（「約三成」）、「現在還留著的」平均 4.7／4.2 年、「silently」原句、刪文件是最少用的修法（tan 紀錄行 30、32–33、37–38、46）——熱門組 vs Google 組、曾經 vs 現在都沒有混用，方向正確。Torkki 15 週、引文原句、owner 是 pivotal、拆給個人後品質下降（torkki 行 16、24–25、28）。GitLab group-maintained 原句、CODEOWNERS、handbook-first 流程、共同創辦人原話（gitlab-dri 行 26–29、44）。Notion 驗證到期與通知、不要全驗證、campaign 每月／brand 每季、永久驗證警告（notion 行 30、40、42、44）；Notion 兩個 URL 與紀錄一致。Confluence 自動化取消驗證並寄信、改狀態會改最後更新日（notion 行 51、60）。Google「same CL」「Dead docs are bad」與刪除步驟（google-docguide 行 33、35–36）。WTD「can block」（writethedocs 行 25）。code.org 99.4% 不參與（counterevidence 行 28–29）。KCS 80%、「Who better……」、flag it or fix it、「individual ownership……is death」（kcs 行 43–44、52–53）；KCS 三個已列路徑正確。所有 DOI／URL 與紀錄一致。

---

## post-review

### 🔴 R1　維護規則表與清理例子對「系統下線的操作指南」給了相反的處理

- 位置：zh 77、88 vs 99；en 77、88 vs 99
- 原句：規則 zh 77「**確定錯的，刪。**」；規則表 zh 88 操作指南「系統下線就封存；步驟確定錯了就馬上改」；清理例子 zh 99「〈Jenkins 部署流程〉……系統已經換掉了，內容確定錯。刪掉，或改成一句話連到新的部署文件。」
- 問題：同一種情況（系統換掉的 how-to），表說封存，例子說刪。讀者照表做和照例子做會得到不同結果，這正是任務指定要查的「維護規則表與正文規則是否一致」。
- 改法（建議以四條規則為準，改表）：
  - zh 88 第四欄：「系統下線：照著做會失敗，刪掉或改成一句話連到新文件；步驟錯了就馬上改」
  - en 88 第四欄：「When the system is retired, following it would fail: delete it or reduce it to a one-line pointer to the new doc; fix immediately if a step is wrong」
  - 若作者想保留「封存」，則改清理例子第 99 行並在規則第 77 行補一句「描述已下線系統的文件，算正確但沒人用」。兩邊擇一，不能並存。

### 🟡 R2　「最常卡住的是該問誰」沒有來源

- 位置：zh 105；en 105
- 原句：zh「注意第三頁：清理過期文件時，最常卡住的不是內容，而是『該問誰』。」
- 依據：最接近的是 Grudin：IT 想刪無用 wiki 時，貢獻者已離職的比較敢刪，其他「it was hard to know」（grudin 紀錄行 54）。「最常」沒有計數。scan-ledger 也把這句標為模板化轉折（「不是……而是」）。
- 改法（接上來源、去掉「最常」）：
  - zh：「第三頁是最難處理的一種。Grudin 和 Poole 訪問的 IT 人員也說，要刪舊 wiki 時，最難的是判斷它還有沒有人負責。」
  - en：「The third page is the hard kind. The IT staff Grudin and Poole interviewed said the same: when cleaning out old wikis, the hard part was telling whether anyone was still responsible for one.」

### 🟡 R3　「研究的限制」的「沒找到」沒寫範圍，也重複正文已講過的限制

- 位置：zh 109；en 109
- 原句：zh「我讀到的研究，沒有一篇直接比較……」；「驗證到期的問題來自使用者留言」（第 51 行已講）
- 依據：任務規則「『沒找到』要寫範圍」「限制不疊加」；counterevidence-verification-ritual.md 行 5、57（沒找到驗證到期或 page owner 的對照研究）。另外 Write the Docs 也是社群主張，卻不在「廠商或組織」那串裡。
- 改法：
  - zh：「軟體工程與知識管理的研究裡，我沒有找到直接比較『有驗證到期』和『沒有』、或『有負責人』和『沒有』的研究。Notion、Confluence、GitLab、Google、Write the Docs、KCS 的做法都是自己的說明，沒有附成效數據。Tan 只看公開的 GitHub 專案，Torkki 和 Silva 各是單一公司的個案。」（刪「驗證到期的問題來自使用者留言」，第 51 行已說）
  - en 對應改：「In the software engineering and knowledge management research, I found no study that directly compares teams with and without verification expiry, or with and without owners… Notion, Confluence, GitLab, Google, Write the Docs and KCS all describe their own practices…」

### 🟡 R4　導言把 order 6 的「每頁寫負責人」記成 order 7

- 位置：zh 19；en 19
- 原句：zh「order 7 建議每頁都要有負責人」
- 依據：order 6（2026-10-22-team-wiki-why-it-rots.md）行 93：「**每頁寫上負責人。**……order 9 會談怎麼讓這個名字真的有用。」order 7 行 37 講的是「主結構選一個每頁都找得到負責人的分法」，是分類方式，不是每頁掛名。order 6 那句是本篇最直接的伏筆，沒接上。
- 改法：
  - zh：「order 6 也建議過每頁先寫上負責人；order 7 建議主結構要讓每頁都找得到負責人；order 8 的模板頁首留了……」
  - en：「order 6 also suggested writing an owner on every page; order 7 recommended a main structure in which every page has an owner; and the template in order 8…」
  - 另：order 6 寫「在頁首寫一個名字」，本篇主張「掛角色不掛人」，可在第 1 節補半句「order 6 說先寫一個名字；更穩的寫法是角色」，讓讀者知道是升級不是矛盾（🟢）。

### 🟢 R5　清理例子依「最後更新日期」排序，但同篇剛說這個日期會被驗證動作污染

- 位置：zh 97 vs 51；en 97 vs 51
- 改法（可選，一句話）：zh「（如果你的工具在改驗證狀態時也會更新這個日期，就改用『最後編輯內容的日期』或『最後驗證日期』。）」en「(If changing the verification status also bumps this date in your tool, sort by last content edit or last verification instead.)」

### 🟢 R6　「兩者可以並存」是作者的讀法，寫成了事實

- 位置：zh 75；en 75
- 依據：kcs 紀錄行 80（「兩者可並存的讀法」是抽取者的讀法）。第 67 行同類讀法有寫「我的讀法是」，這裡沒有，前後不一。
- 改法：zh「我的讀法是兩者可以並存」；en「My reading is that the two can coexist」。整段只說一次，不再加別的歸因標籤。

### 🟢 R7　tldr 的失靈方式漏了 KCS 那一種

- 位置：zh 8；en 8
- 原句：zh「每一種都有失靈的方式：負責人離職、到期通知被當垃圾信、規定在但沒人照做。」——四種做法只列三種失靈。
- 改法：zh 句尾加「、沒人用的文章永遠沒人檢查」；en「…, and articles nobody uses never get checked」。

### KCS 與 owner 衝突的處理（無問題）

第 67 行引 KCS「individual ownership……is death」原句、說明不同內容各用不同做法、並點出 KCS 自己的政策類例外，處理得當，與 kcs 紀錄行 79 的建議一致（出處頁問題見 V3）。

### 自我檢查與範圍卡（無問題）

- 自我檢查「owner 離職怎麼辦→角色不是人，交接清單要含文件」與範圍卡一致；判準與第 1 節（掛角色）、今晚可做第 4 條（交接清單）、Torkki RACI 段一致。
- 範圍卡逐項：Grudin 整理者離開 ✓（17）；每頁 owner 與驗證到期、Notion 為例 ✓；docs-as-code 同一變更、可擋合併 ✓；GitLab 先寫再宣布、誰都能提案、DRI 核准 ✓（57）；KCS「被重用時才改」✓（「在需求當下寫」沒寫，可接受）；Google 先刪確定錯的、預設刪除 ✓（73）；Tan 熱門組八成、Google 約三成 ✓；不講搜尋 ✓（19 交給 order 10）。讀完能訂規則表 ✓（86–93，四欄與範圍卡「文件類型 × owner × 驗證週期 × 刪除條件」一致）；例子兩份 ✓。
- 與 order 8 銜接：order 8 模板第 54 行「負責人／最後確認」被本篇第 19 行接上 ✓；ADR 不刪標 superseded 與本篇第 79、92 行一致 ✓；order 8 範例的 Jenkins 決策（ADR 3）與本篇清理例子 #1 的 Jenkins 部署流程是同一故事線，處理方式（決策紀錄保留、操作文件刪）一致 ✓。
- 規則表其他列與四條規則逐一對照：參考資料「舊版本封存」＝正確但沒人用 ✓；新人教學「半年沒人用就檢查」✓；政策「改寫原頁」✓；ADR「不刪」＝規則 3 ✓；會議紀錄「三個月後封存」＝規則 2 ✓、清理例子 #2 ✓；清理例子 #3 找負責人＝規則 4 ✓；#5 FAQ 拆頁＝order 6 行 80 ✓。唯一衝突是 R1。

---

## post-polish

### 🟡 P1　「開始長草了」在台灣會被讀成另一個意思

- 位置：zh 17
- 原句：「wiki『開始長草了』」
- 問題：台灣網路用語「長草」多指「很想買某樣東西」。原文「going to weed」是雜草叢生；範圍卡用的是「長雜草」。
- 改法：zh「wiki『開始長滿雜草』」。en 不用改。

### 🟡 P2　規則表 ADR 列「不定期審」與英文意思相反

- 位置：zh 92；en 92
- 原句：zh「不定期審；被推翻時寫新的一份」；en「No scheduled review; write a new one when reversed」
- 問題：中文「不定期」是「時間不固定地（偶爾）審」，en 是「不排定期審查」。讀者會以為 ADR 要偶爾審。
- 改法：zh「不排定期審查；被推翻時寫新的一份」。

### 🟡 P3　單段數字太多

- 位置：zh 23、59；en 同行
- 原句：zh 23「最熱門的 1,000 個專案裡，有歷史可分析的 800 個中，八成多曾經……Google 自家的專案約三成」；zh 59「2026 年合併的 542 個 PR，PR 範本裡那份 8 項的檢查清單……九成九以上」
- 依據：repo 寫作指南長文第 4 條。
- 改法：
  - zh 23：「GitHub 最熱門的專案裡，八成多曾經出現過這種過時引用；Google 自家的專案約三成。」（「1,000」「800」移到參考資料或刪）；en「Over eight in ten of GitHub's most popular projects had at some point contained such a reference; for Google's own projects it was about three in ten.」
  - zh 59 照 V9 改後只留「九成九以上」。

### 🟢 P4　兩處「不是……而是」句型

- 位置：zh 49、105
- 依據：register-scan／scan-ledger 第 7 項。
- 改法：zh 49「Confluence 的做法不同：沒有到期日，改用自動化找出……」；zh 105 照 R2 改。

### 🟢 P5　「處理一套系統長年累積的文件缺口」的「長年」沒有出處

- 位置：zh 29；en 29（「years of accumulated」）
- 依據：torkki 紀錄行 15：觸發點是外包顧問六個月內全部換成內部員工；文件債的年限紀錄沒給。
- 改法：zh「處理一套系統累積的文件缺口」；en「working through the accumulated documentation gaps for a system」。

### 中英一致

除 V4（zh「刪」vs en「shrinking」）、V5（「上百封」vs「about a hundred」）、P2（「不定期審」vs「No scheduled review」）三處不一致外，其餘段落、表格、清單、例子逐段對照一致；en 連結都指向 `-en` 版。台灣用語：`check:tw` 0 筆；人工掃到「錯誤代碼表」（台灣也用）、「成效數據」（repo 指南列為台灣可用），不需改。翻譯腔四型逐句看過，未見明顯問題。

## 修正紀錄（2026-10-22）

- 全部採用：V1–V12、R1（改規則表，以四條規則為準）、R2（改接 Grudin 原文）、R3、R4（含「名字→角色」半句）、R5、R6、R7、P1–P5。
- V3：參考資料補 KCS Article State，並在 flag it or fix it、封存、治標三處加行內連結；V7 補 Confluence Transfer ownership 頁。
