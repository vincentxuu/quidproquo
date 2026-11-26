# 抽取紀錄：反證與限制彙整——驗證變成點擊、勾選清單被跳過、文件放進 repo 也不會一起改

read_status=full（下列三個來源皆全文讀；另列只讀到摘要、未納入的來源）

這份收的是 order 9 的反證面。沒有找到「驗證到期」或「page owner」成效的對照研究（正面或反面都沒有）；以下是最接近的三類證據，證據強度都不高，用的時候要照實標示。

---

## A. Confluence Verified Pages 公告留言串（使用者回報，2024）

- 書目：Avinoam（Atlassian 員工），"📣 Verified Pages - Now Available in Confluence! ✅"，Atlassian Community，2024-04-08，https://community.atlassian.com/forums/Confluence-articles/Verified-Pages-Now-Available-in-Confluence/ba-p/2664827
- 讀取：curl（HTTP 200）→ pandoc；全文檔 /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o9-cf-verified-ann.txt（340 行，14,363 bytes）。功能本身的抽取在 notion-verified-pages.md。
- 性質：使用者留言（軼事）。部分留言者是競品外掛廠商，已在下面標出。
- 可引用：
  - 通知被忽略（行 175–177，Ralph Jäger，非廠商）："It could work for a smaller page count (<100), but for larger instances the automation will only find part of inactive pages. Furthermore our employees have been complaining about receiving about 100 emails about pages beeing inactive and started to ignore emails sent by confluence...."
  - 勾勾不代表核可（行 162，Maik）："The 'badge' makes it look like the page is 'authorised', which isn't always the case as every page creator can add it."
  - 驗證動作改掉了「最後更新日」（行 260，Matthew Taylor）："changing the page status via automation changes the last updated date. This means that almost every page in our wiki will have the same last updated date"；行 277："changing the status of the page counts as updating the page, rendering it a very lackluster feature."
  - 人工評估過時頁很耗時（行 195，Haddon Fisher）："doing this type of labeling and evaluating of stale pages manually is extremely time-consuming; you are either doing the work yourself, or managing\cajoling\herding the cats you've delegated this to."
  - 一頁一封信、150 頁上限（行 115–117，Levente Szabo，競品外掛廠商）。
- 限制：個人經驗、無數據；Atlassian 之後有放寬自動化上限的公告（行 256，未讀）。

## B. code-dot-org PR #71072「Trim Pull Request template」（專案自己的資料分析，2026）

- 書目：cat5inthecradle，"Trim Pull Request template"，code-dot-org/code-dot-org Pull Request #71072，開立 2026-02-27，合併 2026-03-02。https://github.com/code-dot-org/code-dot-org/pull/71072
- 讀取：`gh api repos/code-dot-org/code-dot-org/pulls/71072` 取 PR 本文；全文檔 /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o9-codeorg-pr71072.md（99 行，6,156 bytes）。
- 性質：專案維護者對自家 2026 年 542 個人類作者已合併 PR 的描述做的分析；作者說分析由 Claude Code 跑 GraphQL 抓資料、Python 腳本分類 checklist，「section 填寫率」是讀「a broad sample」估的（行 91–95）。沒有同儕審查，沒有附原始資料。
- 可引用（行 13–20、37、58）：
  - 8 項「PR Creation Checklist」（含測試覆蓋、隱私文件、資安檢查）："235 PRs (43.4%) kept the checklist but left every single box unchecked"、"304 PRs (56.1%) deleted the checklist entirely"、"0 PRs partially checked some boxes"、"3 PRs (0.6%) checked all 8 boxes"。
  - "The checklist has a 99.4% non-engagement rate. The template's length and rigidity appears to train authors to skip it entirely rather than engage with the parts that matter."
  - Privacy、Security、Caching 段落填寫率約 1%（行 37）。
- 和 order 9 的關係：這是「合併時要附文件／勾選文件已更新」這類軟性閘門被大規模跳過的實例——清單在，PR 照樣合併。注意它不是文件專屬的檢查，而且這是「不擋合併」的清單，不能推論「CI 硬擋」也會被繞過。
- 限制：單一專案、AI 協助分析、部分數字是抽樣估計。

## C. Hovhannisyan, Fan, Rodríguez-Pérez & Kula (2024) Linking Code and Documentation Churn: Preliminary Analysis

- 書目：arXiv:2410.05992 v1（2024-10-08），NAIST／UBC／Osaka University。兩頁的初步研究摘要。
- 讀取：curl https://arxiv.org/pdf/2410.05992（HTTP 200，64,887 bytes）→ pdftotext；全文檔 /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o9-hovh.txt（242 行，11,937 bytes）。本節行號是去掉空行後的行號（`awk 'NF'`）。
- 性質：實證但非常初步。三個專案（Apache httpd、GIMP、GTK），用副檔名把 commit 分成 Code／Documentation／Configuration／Mix（行 133–141）。
- 可引用（Table I，行 99–120；行 149–157）：httpd 有 14,768 次只改程式的變更、5,417 次程式與文件一起改；GIMP 22,317 vs 21,467；GTK 50,147 vs 17,720。原文："documentation updates were not continuously linked to code churns over time, even when new features were introduced to the codebase."
- 和 order 9 的關係：這三個專案的文件本來就在同一個 repo、走同一套版控（docs-as-code 的前提），仍有大量程式變更沒有同步改文件。
- 限制（要寫明）：分類方式粗糙——「Mix」的副檔名清單裡包含 .c、.h、Makefile（行 138），與 Code 類重疊，Table I 的數字很難解讀；沒說明時間範圍（"over a set period"，行 123–124）；作者自己也說 "There may be cases where the documentation might not be needed."（行 173–174）。只能當「方向一致的弱證據」，不能引數字當結論。

---

## 沒納入、只讀到摘要或非研究的線索（不引用為證據）

- Write the Docs Portland 2022，Marcia Riefer Johnston（AWS）演講頁摘要：搜尋結果顯示 "Subjecting docs to the same testing as the code created delays and prevented technical writers from independently publishing doc edits."——只讀到 Exa 搜尋摘要，未抓頁面全文，不引用；若 order 9 要用，需先讀 https://www.writethedocs.org/videos/portland/2022/one-aws-team-s-move-to-docs-as-code-what-worked-what-didn-t-what-s-next-marcia-riefer-johnston.html 。
- techwriterkoduje.pl〈Are people abandoning docs as code?〉：作者自稱 "This is not a study"，六位文件主管訪談；搜尋摘要提到開發者 "started contributing only very occasionally"。未讀全文，不引用。
- Kulp et al. CHI 2020（醫療檢核表：16% 勾選項其實沒做）：領域不同、2020 年，不放進 order 9。
- Rao et al. MSR 2022 Comments on Comments：code review 對文件的影響是正面的（review 留言後 76.4% 會更新註解），屬支持 docs-as-code 的證據，且只談程式碼註解；2022 年，未精讀。

## 綜合判斷（給 order 9 用）

1. 驗證到期的風險是「通知疲勞＋形式化」：證據只有使用者軼事（A），沒有研究。文章應寫成「廠商與使用者回報的問題」，不寫成研究結論。
2. 不擋合併的清單會被跳過（B），這支持「要擋就用機器擋、要不就別放清單」；但沒有直接證據說 CI 硬擋文件會被繞過——沒找到。
3. 「文件跟程式放在一起就會一起改」沒有證據支持；Tan 2024（82.3%／29.7% 曾過時）是較強的證據，C 只是方向一致的弱證據。
4. 還沒找到：驗證到期或 page owner 制度的前後對照研究；wiki 清理活動的成效研究。
