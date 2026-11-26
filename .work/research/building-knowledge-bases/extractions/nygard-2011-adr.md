# 抽取紀錄：Nygard 2011, Documenting Architecture Decisions（Cognitect blog）

read_status=full（2026-10-22 curl 抓 live 版全文，pandoc 轉純文字；文章本體約 90 行，其餘是網站側欄）

角色：order 8「ADR 的五個欄位與 superseded」的一手原文。

## 書目

- 作者：Michael Nygard；發表於 Cognitect Blog，2011-11-15；標籤 agility、architecture。授權 CC0（行 93–94）。
- 網址：https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o8-nygard.txt（204 行，8,750 bytes；本文在行 9–91）

## 這是什麼（性質）

- 作者主張＋一段經驗報告。不是研究：沒有樣本設計、沒有對照。唯一的「證據」是文末 Experience Report：幾個專案用了約三個多月、六到十位開發者輪替。
- 文章本身就寫成一份 ADR（Context／Decision／Status／Consequences），作者自己點破（行 81）。

## 可引用內容（行號指 o8-nygard.txt）

1. 為什麼要小文件（Context，行 17–21）
   - 「Agile methods are not opposed to documentation, only to valueless documentation. Documents that assist the team itself can have value, but only if they are kept up to date. Large documents are never kept up to date. Small, modular documents have at least a chance at being updated.」（行 19）
   - 「Nobody ever reads large documents, either.」（行 21）
2. 不知道理由的兩種壞結果（行 23–33）
   - 新人面對過去決策只有兩條路："Blindly accept the decision." 或 "Blindly change it."（行 25、29）。盲目接受累積太多會 "the development team becomes afraid to change anything"（行 27）；盲目改可能破壞尚未測到的非功能需求（行 31）。
3. 什麼決策要記（行 37）
   - 「"architecturally significant" decisions: those that affect the structure, non-functional characteristics, dependencies, interfaces, or construction techniques.」
4. 存放與編號（行 41–45）
   - 放在專案 repo：「doc/arch/adr-NNN.md」（行 41）；用 Markdown 或 Textile（行 43）。
   - 「ADRs will be numbered sequentially and monotonically. Numbers will not be reused.」（行 45）
5. 推翻時不刪——本篇自我檢查題的出處（行 47）
   - 「If a decision is reversed, we will keep the old one around, but mark it as superseded. (It's still relevant to know that it was the decision, but is no longer the decision.)」
6. 五個部分（行 49–59）
   - Title：短名詞片語，例「ADR 1: Deployment on Ruby on Rails 3.0.10」（行 51）
   - Context：各方力量（技術、政治、社會、專案在地），"value-neutral. It is simply describing facts."（行 53）
   - Decision：完整句、主動語態，"We will …"（行 55）
   - Status：proposed／accepted；後來的 ADR 改變或推翻時，"it may be marked as "deprecated" or "superseded" with a reference to its replacement."（行 57）
   - Consequences：所有後果，不只正面，"positive, negative, and neutral"（行 59）
7. 長度與寫法（行 61）
   - 「The whole document should be one or two pages long. We will write each ADR as if it is a conversation with a future developer.」
   - 反對條列句："Bullets are acceptable only for visual style, not as an excuse for writing sentence fragments."
8. 一份 ADR 一個決定、後果會變成下一份的脈絡（行 69–71）
9. 經驗報告（行 81–87）
   - 「We've been using this format on a few of our projects since early August. ... we've had six to ten developers rotate through projects using ADRs. All of them have stated that they appreciate the degree of context they received by reading them.」（行 81）
   - 放 repo 會讓 PM 等不住在版控裡的人較難讀；他們用 GitHub 私有 repo 傳連結解決（行 85）。

## 沒寫的事

- 沒有「考慮過的選項（alternatives）」欄位——五欄裡沒有。後來的 MADR 才把 Considered Options 列為核心（見 adr-github-madr.md）。
- 沒有日期、決策者欄位；沒說誰可以改 Status、誰核准。
- 沒說 superseded 後新舊兩份怎麼互相連（只說舊的要 "reference to its replacement"，沒說新的要不要回指舊的）。
- 沒說多少決策才值得寫、怎麼判斷「架構上重要」的邊界（只給五類影響）。
- 沒有長期維護資料：經驗只有約三個月。

## 與常見轉述不一致處

- 「ADR 五欄位」通常列 Title／Status／Context／Decision／Consequences，跟原文一致；但原文 Status 有四種值（proposed、accepted、deprecated、superseded），不是只有 superseded。轉述常漏 deprecated。
- 「ADR 是不可變的」：原文沒用 immutable 這個字；只說推翻時保留舊的並標 superseded。實務上 Status 欄位本身會被改（舊 ADR 從 accepted 改成 superseded），所以不是「一字不能改」。
- 「Nygard 證明 ADR 有效」：證據只有六到十人的自陳好評、約三個月，作者自己說 "That's not a very long time"（行 81）。
- 原文路徑是 `doc/arch/adr-NNN.md`；常見的 `docs/adr/` 或 `docs/decisions/` 是後來工具（adr-tools、MADR）的慣例，不是 Nygard 寫的。

## 限制

- 單一作者部落格、單一顧問公司經驗、時間短。
- 寫作年代 2011，GitHub Markdown 渲染當作「跟 wiki 一樣友善」的前提，對非工程讀者是否成立沒驗證。

## 讀取紀錄

- 管道：`curl -sL -A "Mozilla/5.0"` → HTTP 200，45,800 bytes HTML → `pandoc -f html -t plain --wrap=none`（成功）。
- 一次讀完行 1–204（本文 9–91，其餘為網站作者清單與頁尾）。
