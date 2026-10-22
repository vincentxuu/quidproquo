# 抽取紀錄：Google Style Guides — docguide（Best Practices、Philosophy、READMEs、Markdown style guide）

read_status=full（4 頁全文，2026-10-22 curl 抓 live 版，pandoc 轉純文字；頁面沒有標示最後更新日期）

角色：order 8「最小可用文件、不重複寫別處有的指南、README 至少要有什麼」的一手來源；order 9 也會用（Update Docs with Code、Delete Dead Documentation）。

## 書目

- 發布者：Google（google/styleguide repo 的 gh-pages，頁尾 "This site is open source. Improve this page."）。頁面無作者、無日期。
- 讀過的頁面：
  - https://google.github.io/styleguide/docguide/best_practices.html
  - https://google.github.io/styleguide/docguide/philosophy.html
  - https://google.github.io/styleguide/docguide/READMEs.html
  - https://google.github.io/styleguide/docguide/style.html
- 全文文字檔（皆在 /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/）：
  - o8-gdoc-bp.txt（88 行，5,881 bytes）
  - o8-gdoc-phil.txt（51 行，2,599 bytes）
  - o8-gdoc-readme.txt（44 行，1,934 bytes）
  - o8-gdoc-style.txt（638 行，23,867 bytes）

## 這是什麼（性質）

- 組織內部寫作規範的公開版（作者主張／實務規範）。沒有研究、沒有數據。適用對象是 Google 內部工程文件（提到 CL、Gitiles、Code Search、google3），對外部團隊是「一家大公司怎麼做」的參考，不是證據。

## 可引用內容（行號指各檔）

1. 最小可用文件（bp 行 15–19）
   - 「A small set of fresh and accurate docs is better than a large assembly of "documentation" in various states of disrepair.」（bp 行 17；style 行 55 有幾乎相同的句子，用 "sprawling, loose assembly"）
   - 「Write short and useful documents. Cut out everything unnecessary, including out-of-date, incorrect, or redundant information.」；「Docs work best when they are alive but frequently trimmed, like a bonsai tree.」（bp 行 19）
   - Philosophy：「Brief and utilitarian is better than long and exhaustive. The vast majority of users need only a small fraction of the author's total knowledge, but they need it quickly and often.」（phil 行 43）
   - style 行 59–60：「Identify what you really need: release docs, API docs, testing guidelines.」「Delete cruft frequently and in small batches.」
2. 文件跟程式碼同一個變更（bp 行 23–27）——order 9 用
   - 「Change your documentation in the same CL as the code change.」（行 25）；好的 reviewer "can at least insist that ... README.md files, and any other docs get updated alongside the CL."（行 27）
3. 刪除死文件（bp 行 29–39）——order 9 用
   - 「Dead docs are bad. They misinform, they slow down, they incite despair in engineers and laziness in team leads.」（行 31）
   - 步驟：慢慢來；"First delete what you're certain is wrong, ignore what's unclear."；全隊參與 "Keep or delete?"；"Default to delete or leave behind if migrating. Stragglers can always be recovered."；Iterate（行 35–39）
4. 不重複（bp 行 84–86）——order 8 用
   - 「Do not write your own guide to a common Google technology or process. Link to it instead.」若不存在或過時，就去原處補或寫 package-level README（行 86）。
5. 設計文件實作後的角色（bp 行 80）——跟 ADR 有關
   - 「once the code is implemented, design docs should serve as archives of these decisions, not as half-correct docs (they are often misused).」
6. 文件光譜（bp 行 49–82）：命名 → 行內註解（說 why）→ API 註解 → README.md → docs/ 目錄（get started、跑測試、除錯、發版）→ 設計文件 → 外部文件（要從 README 明確指過去）。
7. README 至少要有什麼（readme 行 34–42；bp 行 65–69）
   - 「At a minimum, your README.md file should contain a link to your user- and/or team-facing documentation.」（readme 行 34）
   - 每個 package README 應包含或指向五項：用途、聯絡人（Points of contact）、狀態（是否 deprecated、是否未公開發布）、怎麼用（範例、可複製的指令）、相關文件連結（readme 行 38–42）。
   - bp 版的三問：目錄裝什麼？先看哪些檔？誰維護、去哪了解更多？（bp 行 67–69）
8. 文件版面骨架（style 行 94–120 "Document layout"）——可直接當 how-to 模板的外框
   - `# 標題` → 1–3 句簡介（行 116："Imagine yourself as a complete newbie ... "What is Foo? Why would I extend it?""）→ [TOC] → `## Topic` → `## See also`。作者署名可省略，"revision history generally suffices."（行 114）
9. Better is better than best（phil 行 45–49；style 頁）
   - 「Incremental improvement is better than prolonged debate.」（phil 行 47）
   - 文件 review 標準低於 code review："Set lower standards for each CL, so that more such CLs can happen."（style 行 66）；reviewer "When reasonable, LGTM immediately"（行 70）、避免 "You should also…" 型留言。
10. 其他對模板有用的規則（style 頁）：標題要唯一且完整（"Foo summary" 而非重複的 "Summary"）；連結文字要有意義，不要 "here"/"link"（style 行 428："Users often do not read documents; they scan them."）；資料不均勻時用清單不用表格。

## 沒寫的事

- 沒有 how-to 模板本身；只有通用版面骨架與 README 五項。
- 沒有 ADR 或決策紀錄的格式；只說設計文件實作後應「當成決策的封存」。
- 沒說「最小」的判準是什麼（多短算短）；沒有測量。
- 沒有 owner 指派或驗證週期機制（README 有「Points of contact」，但沒說誰負責更新）。

## 與常見轉述不一致處

- 「Google 說文件越少越好」：原文是「少量但新鮮正確」勝過「大量但年久失修」，重點是新鮮與正確，不是少。
- 「Google 說要刪文件」：原文是先刪「確定錯的」、不清楚的先不管；遷移時預設刪除。不是全面清空。
- 「最小可用文件」常被說成 Google 的研究結論——它是規範主張，沒有資料。

## 限制

- Google 內部情境（code review 文化、單一 repo、Gitiles）；換到用 Notion／Confluence 的團隊，「同一個 CL 改文件」需要轉譯。
- 無日期，無法判斷各頁何時修訂。

## 讀取紀錄

- 管道：`curl -sL -A "Mozilla/5.0"` 各頁 → 皆 HTTP 200 → `pandoc -f html -t plain --wrap=none`（成功）。
- bp、phil、readme 各一次讀完；style 頁讀行 1–140 全文，行 140–638（Markdown 排版細則：行寬、標題、清單、程式碼、連結、圖片、表格）去空行後全部讀過。
