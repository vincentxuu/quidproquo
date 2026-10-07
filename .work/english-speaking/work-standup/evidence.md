# work-standup：來源核對紀錄

核對日期：2026-10-07（Asia/Taipei）。文章：`src/content/posts/learning/2026-10-07-work-standup-english.md`（與 `-en.md`），目前 `draft: true`。句子來源是使用者確認過的中文候選清單，不是真實對話，沒有 `corrections.md`。

## 工具路徑

- Groundlane MCP 未掛載於本 session 的 callable inventory。
- Groundlane 直接 HTTP：一次 `tools/list` 回 HTTP 401，視為整體失敗。
- Firecrawl：可用但帳號額度偏低，只用了 2 次（Cambridge stuck 整頁、Cambridge walk-through 問答式片段）。
- Cambridge Dictionary 對直接 HTTP 請求回 403，因此字典改用 Oxford Learner's Dictionaries（OALD）。
- OALD、Atlassian、Mozilla、GitHub Docs：以 curl 抓公開頁面落到 session 暫存檔，本機去標籤後擷取正文。以下核對**不算 Groundlane 驗證**。

### 每頁讀取範圍

| 頁面 | 讀取範圍 |
| --- | --- |
| OALD：fix、wait、by、stuck、could、look（名詞）、moment、sure、scale、take、probably、estimate（名詞）、before（連接詞）、requirement、reproduce、approach（名詞）、confirm、locally | 整頁抓回，本機以關鍵字擷取相關義項與例句，未逐行讀完 |
| Cambridge：stuck | 整頁（詞條主體）；沒有「卡在某個任務」的 stuck on，只有 be stuck on someone（迷戀），因此不採用為依據 |
| Cambridge：walk someone through something | 只有問答式片段，**未讀整頁** |
| Atlassian：Stand-ups for agile teams | 整頁抓回，讀了定義與三個問題的段落，其餘未讀 |
| Mozilla：Bug Writing Guidelines | 整頁抓回，讀了含 reproduce 的段落 |
| GitHub Docs：Checking out pull requests locally | 整頁抓回，只讀標題與摘要句 |
| GitHub Docs：Requesting a pull request review | 抓回內容多為導覽列，只讀到摘要句，未引用於文章 |

## Evidence 表

evidenceType 指表達本身；contextEvidenceType 指「軟體團隊站立會議／協作」這個情境。所有卡片的情境都是自寫，contextEvidenceType 一律 adapted。

| 主張／卡片 ID | URL 與段落 | 支持範圍 | evidenceType | contextEvidenceType | 未支持的部分 |
| --- | --- | --- | --- | --- | --- |
| work-fixed | [OALD fix](https://www.oxfordlearnersdictionaries.com/us/definition/english/fix_1)：I've fixed the problem；find and fix the bug。[Atlassian](https://www.atlassian.com/agile/scrum/standups)：What did I work on yesterday? | fix 接問題／bug；站立會議會報告昨天的事 | adapted | adapted | login flow 當受詞是套用；yesterday 配過去式沿用 job-hunt-chat 已核對的 Cambridge past simple 頁，本次未重讀 |
| work-waiting | [OALD wait](https://www.oxfordlearnersdictionaries.com/us/definition/english/wait_1)：I'm still waiting for the results of my blood test | still waiting for + 名詞 | adapted | adapted | 無 |
| work-deadline | [OALD by](https://www.oxfordlearnersdictionaries.com/us/definition/english/by_1)：not later than the time mentioned; Can you finish the work by five o'clock?；I'll have it done by tomorrow | by 表期限、finish … by | adapted | adapted | by the end of the day 這個片語本身沒有例句；「下班前」的職場慣用說法未查 |
| work-stuck | [OALD stuck](https://www.oxfordlearnersdictionaries.com/us/definition/english/stuck_1)：stuck (on something) unable to answer or understand something; I got stuck on the first question | stuck on + 事情 | adapted | adapted | 字典例句是考題，用在設定步驟是套用 |
| work-stuck 替代句 | Atlassian：What issues are blocking me? | block 當動詞、主詞是問題 | adapted | adapted（來源即站立會議） | blocked on 未見，未採用 |
| work-repro | [Mozilla](https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html)：If you can't reproduce the problem；If you can reproduce occasionally。[GitHub Docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/checking-out-pull-requests-locally)：Check out pull requests locally | reproduce 用於軟體問題；locally 指本機 | adapted | adapted | 技術文件，不證明口語常見度；OALD reproduce 無此義項 |
| work-review | [OALD moment](https://www.oxfordlearnersdictionaries.com/us/definition/english/moment)：Could you look through this report when you have a spare moment?。[OALD look](https://www.oxfordlearnersdictionaries.com/us/definition/english/look_2)：Take a look at these figures!。[OALD could](https://www.oxfordlearnersdictionaries.com/us/definition/english/could)：used to politely ask somebody to do something for you | 整句結構幾乎與 moment 例句相同 | adapted | adapted | PR 當受詞是套用；when you have a moment 少了 spare |
| work-walkthrough | [Cambridge walk-through](https://dictionary.cambridge.org/us/dictionary/english/walk-through)：to slowly and carefully explain something to someone or show someone how to do something; He'll walk you through the procedure | walk + 人 + through + 事 | adapted | adapted | 未讀整頁；through 後面接 how 子句是套用 |
| work-unsure | [OALD sure](https://www.oxfordlearnersdictionaries.com/us/definition/english/sure_1)：Are you sure about that?；I'm not so sure about that one。[OALD scale](https://www.oxfordlearnersdictionaries.com/us/definition/english/scale_1)：Manufacturing is done on a small scale。OALD could：Could we stop by next week? | not sure about、on a small scale、Could we | adapted | adapted | 「先說不確定比較緩和」是自己的語氣判斷，無來源；smaller 比較級是套用 |
| work-duration | [OALD take](https://www.oxfordlearnersdictionaries.com/us/definition/english/take_1)：That should only take you ten minutes；Which Word 說 take 必須搭時間。[OALD probably](https://www.oxfordlearnersdictionaries.com/us/definition/english/probably)：It'll probably be OK | take + 時間、probably 位置 | adapted | adapted | two to three days 的範圍寫法未查 |
| work-estimate | [OALD estimate](https://www.oxfordlearnersdictionaries.com/us/definition/english/estimate_2)：I can give you a rough estimate of…。[OALD before](https://www.oxfordlearnersdictionaries.com/us/definition/english/before_2)：Do it before you forget。[OALD requirement](https://www.oxfordlearnersdictionaries.com/us/definition/english/requirement)：a software solution to meet your requirements | give + 人 + an estimate、before + 子句 | adapted | adapted | confirm the requirements：OALD confirm 的受詞例句是 details／reservation，接 requirements 是套用 |

## 仍待核對（未放進練習卡）

- I'm blocked on …
- by end of day／by EOD 與 by the end of the day 的差別
- 常見度比較：未做語料庫查詢

## 範圍聲明

只核對到字義與句型層級；情境層只有 Atlassian 說明站立會議的內容。沒有母語者測試、沒有語料頻率查詢，文章不寫「最自然／最常用」。
