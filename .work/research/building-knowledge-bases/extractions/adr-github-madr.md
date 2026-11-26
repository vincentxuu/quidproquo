# 抽取紀錄：adr.github.io（首頁、ADR Templates 頁）與 MADR 4.0.0 模板

read_status=full（3 頁＋MADR 4.0.0 minimal 模板原檔，2026-10-22 curl 抓 live 版；ADR Templates 頁標 "Posted Oct 25, 2024 Updated Jul 7, 2026"，首頁與 MADR 頁無更新日期）

角色：order 8「ADR 欄位與 status／superseded 怎麼寫」；跟 Nygard 原版對照出 MADR 多了什麼。

## 書目

- 發布者：GitHub「adr」組織（adr.github.io）。MADR 由 Oliver Kopp、Olaf Zimmermann 等維護；學術出處 Kopp, Armbruster & Zimmermann 2018, "Markdown Architectural Decision Records: Format and Tool Support", ZEUS 2018（本次未讀）。
- 讀過的頁面：
  - https://adr.github.io/ （首頁）
  - https://adr.github.io/adr-templates/
  - https://adr.github.io/madr/
  - https://raw.githubusercontent.com/adr/madr/4.0.0/template/adr-template-minimal.md 與 adr-template-bare-minimal.md
- 全文文字檔（/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/）：
  - o8-adr-home.txt（33 行，3,607 bytes）
  - o8-adr-templates.txt（68 行，2,994 bytes）
  - o8-madr.txt（228 行，12,939 bytes；含完整模板開發版，行 133–212）
  - o8-madr-adr-template-minimal.md（23 行，1,029 bytes）、o8-madr-adr-template-bare-minimal.md（16 行，179 bytes）

## 這是什麼（性質）

- 實務社群的定義、模板與工具說明（作者主張）。沒有效果數據。首頁列的 "Architecture Decision Records in Action by Michael Keeling ... and Joe Runde (IBM) [YouTube] is a presentation that includes empirical numbers"（home 行 31）是指向外部，本頁本身沒有數字。

## 可引用內容（行號指各檔）

1. 定義（home 行 3；madr 行 5）
   - 「An Architectural Decision Record (ADR) captures a single AD and its rationale」；「The collection of ADRs created and maintained in a project constitute its decision log.」（home 行 3）
   - 用途可擴大到非架構決策："ADR usage can be extended to design and other decisions ("any decision record")"（home 行 3）；MADR 頁："Do not take the term "architecture" too seriously"（madr 行 44），"we believe that any (important) decision should be captured in a structured way"（madr 行 48）。
2. 三種主流模板（templates 頁）
   - Nygard：「An ADR consists of title, status, context, decision, and consequences」（templates 行 42）
   - MADR：「We think that the considered options with their pros and cons are crucial to understand the reasons for choosing a particular design.」並建議 decision makers、confirmation 等 metadata（templates 行 38）
   - Y-statement 一句話版：「In the context of <use case/user story>, facing <concern> we decided for <option> to achieve <quality>, accepting <downside>.」（templates 行 50）；長版加 "and neglected <other options>" 與 "because <additional rationale>"（行 54）
   - ISO/IEC/IEEE 42010:2011 附錄 A 建議 ADR 九個資訊項（templates 行 62；未讀標準本身）
3. MADR 4.0.0 結構（madr 行 133–212，完整開發版）
   - YAML 前置欄位（全部標 optional）：`status: "{proposed | rejected | accepted | deprecated | … | superseded by ADR-0123"`、`date`、`decision-makers`、`consulted`、`informed`（行 140–144）
   - 章節：Context and Problem Statement（2–3 句或一個小故事，可寫成問句）→ Decision Drivers（optional）→ Considered Options → Decision Outcome（"Chosen option: "{title}", because {justification}"）→ Consequences（optional，Good/Bad, because…）→ Confirmation（optional，怎麼驗證實作符合決定，例如 code review 或 ArchUnit 測試；"although we classify this element as optional, it is included in many ADRs"，行 182）→ Pros and Cons of the Options（optional）→ More Information（optional，含何時重新檢視，行 212）
   - minimal 模板只有四段：Context and Problem Statement、Considered Options、Decision Outcome、Consequences（minimal.md 行 1–23）。換句話說，MADR 認為「考慮過的選項」是最小集合的一部分；Nygard 五欄裡沒有。
4. superseded 的寫法（madr 行 140）
   - 狀態值直接寫成「superseded by ADR-0123」——把連結寫在舊 ADR 的狀態裡。這是本篇自我檢查題「標 superseded 並連到新決定」最直接的格式依據。
5. 檔名與位置（madr 行 77–98）
   - `docs/decisions/NNNN-title-with-dashes.md`，NNNN 連號，"we assume that there won't be more than 9,999 ADRs in one repository"（行 94）
   - 放 `decisions/` 子目錄："to keep them close to the documentation but also separate the decisions from other documentation."（行 98）
6. 規模變大後的問題（madr 行 110）
   - 「Large projects may accumulate hundreds of decision records over time, and finding them might be hard. MADR does not enforce any repository or directory organization structure.」可用子目錄分類，但編號就只在類別內唯一（行 125）。
7. 版本演變（madr 行 26–40）
   - 3.0.0（2022-10-09）把 Positive／Negative Consequences 合併為 Consequences（行 31–32）；3.0.0-beta 曾改名 "Markdown Any Decision Records"（行 34），4.0.0（2024-09-17）改回 "Architectural"（行 26–28）。
   - 「There is currently no tooling supporting MADR 3.0.0.」（行 102）——工具支援落後模板版本。

## 沒寫的事

- 沒有任何採用率或效果數據；沒有比較 Nygard 與 MADR 哪個好。
- 沒說 superseded 時新 ADR 要不要回指舊 ADR（只有舊的狀態欄寫 "superseded by"）。
- 沒說誰能把狀態從 proposed 改成 accepted（decision-makers 欄位只是列名單）。
- 沒處理「ADR 開成 accepted 跳過討論」的問題（Santana 2026 說 63% 如此，見 santana-2026-icsa-adr-oss.md）。

## 與常見轉述不一致處

- 「MADR 是 Nygard 的 Markdown 版」：不是。MADR 把 Considered Options 放進最小模板，Nygard 沒有這欄；Status 在 MADR 是可刪的 optional metadata，在 Nygard 是正式一節。
- 「Status 只有 proposed／accepted／superseded」：MADR 列 proposed、rejected、accepted、deprecated、superseded（還有 "…" 表示可自訂）。
- 「Nygard 模板最常用是因為最好」：Buchgeher 2023 指出可能是因為 adr-tools 預設用它（見 buchgeher-2023-adr-github-msr.md）。

## 限制

- 維護者自我推廣的頁面；首頁 "ADRs in the Media" 是推薦清單，不是證據。
- 開發版模板（madr 頁行 133–212）與 4.0.0 release 可能有差；minimal 模板我讀的是 4.0.0 tag 版。

## 讀取紀錄

- 管道：`curl -sL -A "Mozilla/5.0"` → adr-home 200（16,410 bytes）、madr 200（35,365 bytes）、adr-templates 200（21,360 bytes）→ `pandoc -f html -t plain --wrap=none`（成功）；minimal 模板以 curl 抓 raw.githubusercontent.com 4.0.0 tag，200。
- 各檔一次讀完。
