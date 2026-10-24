---
title: "維護責任：誰負責、多久確認一次、什麼時候刪"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, wiki, documentation, docs-as-code]
lang: zh-TW
tldr: "文件過時是常態，而且不會報錯。GitHub 最熱門的專案裡，八成曾在文件裡留下指向已刪除程式碼的引用。維護有四種做法：每頁掛一個負責的角色、設驗證到期、改流程時同一個變更裡改文件、在被用到的時候順手改。每一種都有失靈的方式：負責人離職、到期通知被當垃圾信、規定在但沒人照做、沒人用的文章永遠沒人檢查。刪除的原則是先刪確定錯的，正確但少用的封存。讀完你能替團隊訂一張維護規則表：文件類型、負責角色、確認週期、刪除條件。"
description: "知識庫怎麼建 order 9：文件為什麼會默默過時、為什麼要有人整理、負責人、驗證到期、docs-as-code 與 KCS 的「被重用時才改」各自的做法和失靈方式、刪除還是封存，以及一張維護規則表與一次過期文件清理。"
series:
  name: "知識庫怎麼建"
  order: 9
---

> 🌏 [English version](/posts/learning/2026-10-22-team-wiki-maintenance-ownership-en)

一個兩百人的開發團隊有一個很活躍的 wiki，幾百個頁面、幾十個人在寫。受訪的每個人卻都抱怨同一件事：wiki「開始長滿雜草」。原本有一位主要貢獻者會定期整理格式、修正文字，他離開團隊後，專案經理被指派接手，不久又被調去做別的事。之後 wiki 還是很多人用，但沒有「園丁」，越來越亂；主管看到雜亂的內容，乾脆把維護的人力撤掉了（[Grudin & Poole 2010](https://doi.org/10.1145/1832772.1832780)）。

這篇是「知識庫怎麼建」團隊段的第四篇。[order 6](/posts/learning/2026-10-22-team-wiki-why-it-rots) 說過，團隊 wiki 爛掉的主因是沒寫、沒更新，以及寫的人沒時間或走了；order 6 也建議過每頁先寫上負責人；[order 7](/posts/learning/2026-10-22-team-wiki-information-architecture) 建議主結構要讓每頁都找得到負責人；[order 8](/posts/learning/2026-10-22-team-docs-templates-adr) 的模板頁首留了「負責人」和「最後確認」兩格。這篇談這兩格要怎麼讓它真的有用。搜尋找不到的問題留給 order 10。讀完你能替團隊訂一張維護規則表。

## 過時是常態，而且是默默發生

Tan 等人 2024 年檢查 GitHub 上的 README 和 wiki，找出文件裡提到、但程式碼裡已經不存在的函式或變數名稱（[Tan et al. 2024](https://doi.org/10.1007/s10664-023-10397-6)）。GitHub 最熱門的專案裡，八成多曾經出現過這種過時引用；Google 自家的專案約三成。現在還留著的過時引用，平均已經過時好幾年。作者的說法是，文件不像程式碼，過時了不會當機、也不會有錯誤訊息，它是「silently」過時的。

這還只是最容易偵測的一種過時：名稱被刪掉。行為改了但名字還在、流程換了、負責的人換了，這個方法都抓不到。所以實際的過時程度應該更高。

## 為什麼一定要有人負責

開頭那個 wiki 的問題不是沒人寫，是沒人整理。Torkki 等人 2024 年在一家公司做了 15 週的行動研究，處理一套系統累積的文件缺口；一位開發者的話很直接：「Everyone wants to have quality documentation, but no one wants to actually do the documentation work.」（[Torkki et al. 2024](https://aisel.aisnet.org/icis2024/practitioner/practitioner/8/)）。他們發現，指派負責人是維持文件的關鍵；但被急事打斷之後，負責人有時得出面提醒其他人回來寫。後來把寫作工作拆給每個人各自完成，品質反而下降了。

所以「每頁一個負責人」是必要的，但不是全部。下面四種做法，各自解決一部分問題，也各自會失靈。

## 四種維護做法

### 1. 負責人：掛角色，不掛人

GitLab 的 Handbook 規定，頁面的 code owner 就是那一頁的直接負責人（DRI），對頁面內容有最後決定權（[Handbook Usage](https://handbook.gitlab.com/handbook/about/handbook-usage/)）。有些頁面的負責人欄是空的，因為「the page is maintained by a group rather than individuals」，要去 CODEOWNERS 檔案查是哪個群組。GitLab 舉的 DRI 例子也是寫職位：產品經理負責排優先順序、工程經理負責交付（[GitLab DRI](https://handbook.gitlab.com/handbook/people-group/directly-responsible-individuals/)）。

Torkki 的研究也建議把文件責任綁在角色上，並用 RACI 表寫清楚誰負責、誰當責；他們的理由是，有了這張表，負責的人換掉時比較不會混亂。order 6 說先在頁首寫一個名字；更穩的寫法是寫角色。

要注意的是，Notion 說明頁寫的「頁面負責人」是人員欄位，沒有提到能填群組（[Notion: Wikis & verified pages](https://www.notion.com/help/wikis-and-verified-pages)），Confluence 的官方說明也沒有提到可以指派群組（[Confluence: Transfer ownership](https://support.atlassian.com/confluence-cloud/docs/transfer-ownership-of-your-content-item/)）。工具只能填人的話，我的做法是在頁首另外寫角色，例如「負責：前端值班（目前是小陳）」。

**失靈的方式**：人走了，欄位上的名字還在。

### 2. 驗證到期：定期確認還對不對

Notion 可以把頁面標成「已驗證」，並設定有效期限；到期時，負責人會收到通知（[Notion: Wikis & verified pages](https://www.notion.com/help/wikis-and-verified-pages)）。Notion 自己的使用建議有兩點值得照做：不要什麼都驗證，只驗證常被引用、過時會出大問題、是某個主題唯一來源的頁面；週期依內容變動的速度訂，例如行銷素材每月、品牌規範每季（[Notion guide](https://www.notion.com/help/guides/verify-knowledge-your-teammates-can-trust-with-page-verification)）。它也警告，太多頁面設成永久驗證，勾勾就不再代表品質。

Confluence 的做法不同：沒有到期日，改用自動化找出「一段時間沒動」的已驗證頁面，取消驗證並寄信給負責人（[Confluence: Verified pages](https://community.atlassian.com/forums/Confluence-articles/Verified-Pages-Now-Available-in-Confluence/ba-p/2664827)）。

**失靈的方式**：同一篇公告底下，有使用者回報員工收到約一百封「頁面不活躍」的信，就開始忽略 Confluence 寄來的所有信；也有人發現，改驗證狀態會一併更新頁面的「最後更新日期」，於是幾乎所有頁面都顯示同一天更新，用這個日期判斷過時的規則就失效了。這些是使用者的個人經驗，不是研究，但它們點出一件事：按下「驗證」不需要任何證據，系統分不出認真檢查和順手一點。

### 3. 跟著變更一起改：docs-as-code

Google 的文件指南要求「Change your documentation in the same CL as the code change.」程式改了，文件在同一個變更裡一起改（[Google docguide](https://google.github.io/styleguide/docguide/best_practices.html)）。Write the Docs 的 docs-as-code 指南則說，文件用跟程式碼一樣的工具管理，就「可以」擋下沒附文件的功能合併（[Write the Docs: Docs as Code](https://www.writethedocs.org/guide/docs-as-code/)）。

GitLab 把這個做法用在流程上，叫 handbook-first：要改流程，先在 Handbook 開一個修改提案，合併後再把修改的連結貼到 Slack 宣布；不用簡報、信件或聊天訊息傳達變更。誰都可以提案，負責人核准。

**失靈的方式**：放在同一個地方，不等於會一起改。Tan 研究的 README 本來就跟程式碼在同一個 repo、走同一套流程，還是過時了。軟性的檢查也容易被跳過：code.org 的維護者分析 2026 年頭兩個月由人提交、已合併的 PR，PR 範本裡那份檢查清單幾乎沒人真的勾，九成九以上不是整份沒勾就是直接刪掉（[code.org PR #71072](https://github.com/code-dot-org/code-dot-org/pull/71072)）。這是專案自己的分析，也不是專門檢查文件的清單。GitLab 的共同創辦人也寫道，最大的問題是大家沒有照 handbook-first 做，想通知變更時，預設還是發 Slack、寄信、開會。

能讓機器做的就交給機器。Silva 等人 2023 年分析 Ericsson 一項產品的文件缺陷，發現手寫的部署與安裝指南佔了一半以上的缺陷，從可靠資料自動產生的版本說明則少得多，作者推測跟它是自動產生的有關（[Silva et al. 2023](https://doi.org/10.1109/techdebt59074.2023.00015)）。設定參數表、API 規格這類參考資料，能從程式碼產生就不要手寫。

### 4. 被用的時候改：KCS 的「重用就是審查」

客服領域的知識管理方法 KCS 走的是另一條路：不定期審查，而是在文章被使用的時候審。它的理由是，誰比正在用這篇文章的人更適合判斷它對不對；而且最多八成的文章很少或從來沒被再用過，每篇都審是浪費（[KCS v6: Reuse is Review](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/030/040/020)）。使用的人照「flag it or fix it」的規則（[KCS v6: Flag It or Fix It](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/030/040/030)）：有把握、有權限就直接改，沒把握就標記，交給懂的人處理。

KCS 跟前面幾種做法有一個直接的衝突：它說「individual ownership of articles is death to successful knowledge management practices」，認為文章歸某個人所有，會讓其他人不敢改。我的讀法是兩者處理的是不同的內容：KCS 管的是大量、高頻、一題一篇的支援知識；負責人和驗證到期適合數量少、錯了會出事的正式文件，例如政策和 SOP。KCS 自己也對政策、法規類的文章設了例外，只有指定的人能改。

**失靈的方式**：沒人用的文章永遠不會被審，錯了也沒人發現；用的人照著錯的文章做卻沒察覺，也不會回報。

## 刪除還是封存

這裡兩邊的建議剛好相反。Google 的文件指南說：「Dead docs are bad.」做法是先刪確定錯的、不確定的先不管，遷移時預設刪除，真的需要的事後還找得回來。KCS 則說「Archiving an article is better than deleting it.」（[KCS v6: Article State](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/030)）：封存後不出現在搜尋裡，但舊的連結還看得到，也能還原；它也提醒，靠刪文章或封存來縮小知識庫、好讓東西比較好找，只是治標（[KCS v6: Archiving Old Articles](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/044)）。

我的讀法是兩者可以並存。Google 談的是寫錯、會誤導人的工程文件；KCS 談的是正確但很少用的紀錄。所以我的規則是：

- **確定錯的，刪。** 或者改到對為止。留著只會誤導人。
- **正確但沒人用的，封存。** 例如舊的會議紀錄、已經結束的專案。
- **已經被取代的決策紀錄，不刪也不封存。** 照 order 8，標成已被取代並連到新的。
- **不確定的，先找負責人。** 找不到負責人，就是這頁該處理的第一件事。

順帶一提，在 Tan 的研究裡，過時的文件最後被整份刪掉的情況最少見，更常見的是更新文件或程式碼改回來。刪除不是大家的第一反應，所以規則要先寫好。

## 例子：一張維護規則表

| 文件類型 | 負責角色 | 確認方式與週期 | 刪除或封存條件 |
|---|---|---|---|
| 操作指南（部署、設定） | 該系統的值班 | 流程改了就在同一個變更裡改；另外每季驗證一次 | 系統下線：照著做會失敗，刪掉或改成一句話連到新文件；步驟錯了就馬上改 |
| 參考資料（API、參數表） | 該服務的技術負責人 | 盡量從程式碼自動產生；手寫的部分跟著程式碼一起審 | 跟著版本走，舊版本封存 |
| 新人教學 | 帶新人的主管 | 每位新人用完後回報卡住的地方，當場修 | 半年沒新人用，檢查是否還需要 |
| 政策與規定（請假、出差） | 人資 | 規定一改就更新；另外每年驗證一次 | 被新規定取代就改寫原頁，不另開新頁 |
| 決策紀錄（ADR） | 當時的決策者所屬小組 | 不排定期審查；被推翻時寫新的一份 | 不刪，標「已被取代」 |
| 會議紀錄 | 會議主持人 | 不審 | 三個月後移到封存區 |

## 例子：一次過期文件清理

假設你打開 wiki 的頁面清單，依「最後更新日期」排序（如果你的工具在改驗證狀態時也會更新這個日期，就改用最後編輯內容的日期），最舊的五頁是：

1. **〈Jenkins 部署流程〉**，兩年沒動：系統已經換掉了，內容確定錯。刪掉，或改成一句話連到新的部署文件。
2. **〈2024 Q2 規劃會議〉**：正確但已經沒人需要。移到封存區。
3. **〈API 錯誤代碼表〉**，一年沒動：不確定還對不對，負責人欄寫的是已經離職的同事。先找現在負責這個服務的人，請他確認，並把負責人改成角色。
4. **〈為什麼選 PostgreSQL〉**：是決策紀錄，舊但沒有錯。保留。
5. **〈新人常見問題〉**：一半的問題還有效，一半過時。照 order 6 的建議，把有效的問題拆到對應的頁面，這頁封存。

第三頁是最難處理的一種。Grudin 和 Poole 訪問的 IT 人員也說，要清掉舊 wiki 時，最難的是判斷它還有沒有人在用；貢獻者已經離職的，他們才比較敢刪。

## 研究的限制

軟體工程與知識管理的研究裡，我沒有找到直接比較「有驗證到期」和「沒有」、或「有負責人」和「沒有」的團隊，文件品質有沒有差別的研究。Notion、Confluence、GitLab、Google、Write the Docs、KCS 的做法都是自己的說明，沒有附成效數據。Tan 只看公開的 GitHub 專案，Torkki 和 Silva 各是單一公司的個案。

## 今晚可以做的事

1. **列出團隊 wiki 裡最重要的十頁。** 每頁寫上負責的角色，不只寫名字。
2. **替這十頁各選一種確認方式。** 跟著變更改、定期驗證，或用的時候改；定期驗證的，依變動速度訂週期。
3. **排序找出最舊的五頁，照上面的四條規則處理。** 刪掉確定錯的，封存沒人用的，不確定的去找負責人。
4. **在交接清單上加一行「我負責的文件」。** 下一個人接手時，才知道這幾頁現在是他的。

## 自我檢查

**問：** 一頁的負責人離職了，該怎麼辦？

**判準：** 先把這頁交給接手他工作的人，再把負責人改成角色，例如「前端值班」，而不是另一個人名；這樣下次換人，頁面的歸屬跟著角色走，不會斷掉。事前的預防是把文件寫進交接清單：離職或調職時，列出自己負責的頁面，跟工作一起交出去。工具的負責人欄只能填人的話，頁首另外寫上角色。

## 參考資料

- [Grudin & Poole 2010, Wikis at Work: Success Factors and Challenges for Sustainability of Enterprise Wikis (WikiSym 2010)](https://doi.org/10.1145/1832772.1832780)
- [Tan, Wagner & Treude 2024, Detecting outdated code element references in software repository documentation (Empirical Software Engineering)](https://doi.org/10.1007/s10664-023-10397-6)
- [Torkki, Penttinen, Rinta-Kahila & Ruissalo 2024, Recommendations for Dealing with Unexpected Challenges in Paying Back Documentation Debt (ICIS 2024)](https://aisel.aisnet.org/icis2024/practitioner/practitioner/8/)
- [GitLab Handbook: Handbook Usage](https://handbook.gitlab.com/handbook/about/handbook-usage/)
- [GitLab Handbook: Directly Responsible Individuals](https://handbook.gitlab.com/handbook/people-group/directly-responsible-individuals/)
- [Notion: Wikis & verified pages](https://www.notion.com/help/wikis-and-verified-pages)
- [Notion: Verify knowledge your teammates can trust](https://www.notion.com/help/guides/verify-knowledge-your-teammates-can-trust-with-page-verification)
- [Confluence: Transfer ownership of your content item](https://support.atlassian.com/confluence-cloud/docs/transfer-ownership-of-your-content-item/)
- [Atlassian Community 2024, Verified Pages - Now Available in Confluence](https://community.atlassian.com/forums/Confluence-articles/Verified-Pages-Now-Available-in-Confluence/ba-p/2664827)
- [Google docguide: Best practices](https://google.github.io/styleguide/docguide/best_practices.html)
- [Write the Docs: Docs as Code](https://www.writethedocs.org/guide/docs-as-code/)
- [code.org PR #71072, Trim Pull Request template (2026)](https://github.com/code-dot-org/code-dot-org/pull/71072)
- [Silva, Unterkalmsteiner & Wnuk 2023, Towards identifying and minimizing customer-facing documentation debt (TechDebt 2023)](https://doi.org/10.1109/techdebt59074.2023.00015)
- [KCS v6 Practices Guide: Reuse is Review](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/030/040/020)
- [KCS v6 Practices Guide: Flag It or Fix It](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/030/040/030)
- [KCS v6 Practices Guide: KCS Article State](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/030)
- [KCS v6 Practices Guide: Archiving Old Articles](https://library.serviceinnovation.org/KCS/KCS_v6/KCS_v6_Practices_Guide/030/040/010/044)
