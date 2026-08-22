# Stanford CS224V Fall 2025 系列內容計畫

## 範圍鎖定

- 對象：Stanford CS224V, *Conversational Virtual Assistants with Deep Learning*, Fall 2025。
- 系列名稱：`Stanford CS224V 導讀`；既有總覽為 order 1，逐講文章由 order 2 起。
- 只計 schedule 上有官方講義 PDF 的 14 個 instructional units；project idea、proposal、break 與 final presentation 不另立逐講文章。
- 不以 2026–27 ExploreCourses 的新課名 *Agentic AI* 回填 Fall 2025 課綱。新版尚未公開的 schedule、投影片與作業一律視為材料缺口。
- 每個 unit 產出 zh-TW / en 配對；同一日期、slug，英文版加 `-en`。

## Inventory 與 series order

| Order | Date | Instructional unit | 官方講義 | 產製狀態 |
|---:|---|---|---|---|
| 1 | — | CS224V 完整導讀 | course site / schedule | 已有雙語總覽 |
| 2 | 9/22 | Introduction | `l-introduction.pdf` | 完成 |
| 3 | 9/24 | Knowledge Curation | `2-knowledge-curation.pdf` | 完成 |
| 4 | 9/29 | Building a Task-Oriented Agent | `3-task-oriented-agent.pdf` | 完成 |
| 5 | 10/6 | Evaluation of Task-Oriented Agents | `l-Worksheet2.pdf` | 完成 |
| 6 | 10/13 | Grounding Conversational Agents on Free Text | `l-freetext.pdf` | 完成 |
| 7 | 10/22 | Introduction to Agents for Structured and Hybrid Data | `l-db-hybrid-intro.pdf` | 完成 |
| 8 | 10/27 | Structured / Unstructured Query Language | `l-suql.pdf` | 完成 |
| 9 | 10/29 | Question Answering on Sets of Long Documents | `l-longdoc-new.pdf` | 完成 |
| 10 | 11/3 | Document Set Analysis: Qualitative Coding | `l-data-coding.pdf` | 完成 |
| 11 | 11/5 | Agentic AI for Knowledge Base Queries | `l-agentic.pdf` | 完成 |
| 12 | 11/10 | Satisfying Natural Language Constraints Using SMT | `l-semantics.pdf` | 完成 |
| 13 | 11/12 | NLP Building Blocks | `l-churro.pdf` | 完成 |
| 14 | 11/17 | Multimodal Applications | `l-multimodal.pdf` | 完成 |
| 15 | 11/19 | Training LLMs | `l-training.pdf` | 完成 |

## 固定文章契約

每篇先說明這堂課在整條課程路線的位置，再依投影片順序完整覆蓋 agenda；至少包含核心系統／表示法、評估方法、可實作的讀法、限制與材料缺口。事實只採官方 schedule、講義、作業與講義明確指向的原始論文／專案頁。找不到錄影、speaker notes、課堂討論或新版材料時直接標為缺口，不猜測。

## 驗證

每批執行 `pnpm check:references`、新中文檔的 `pnpm check:tw`、`pnpm lint` 與 `pnpm astro check`；超過 1,500 字的中文稿另跑 register scan。

## Editorial revision audit

- Batch A（orders 2–6）已依 Fall 2025 官方 decks 擴寫；五篇 zh-TW 正文（排除 frontmatter）均達 6,000 字元，英文 partner 均達相同門檻。
- 擴寫新增的是 deck 既有 agenda 內的架構比較、intermediate state、evaluation 與 failure analysis；沒有以 Autumn 2026 catalog 或未公開材料補字數。
- 字數證據以第二個 frontmatter delimiter 後的正文執行 `wc -m`，不可用重複段落、來源清單或 YAML 灌水。
- Batch B（orders 7–11）已用同一方式完成：十篇雙語正文均達 6,000 字元；新增內容只來自 Fall 2025 structured/hybrid data、SUQL、SLIDERS、qualitative coding 與 SPINACH 官方 decks。
- Batch C（orders 12–15）完成後，14 個 instructional units／28 篇雙語正文已全數通過 frontmatter-excluded 6,000-character contract。最後四講只使用 Fall 2025 SMT、CHURRO、ReactGenie 與 data-efficient language modeling decks。
- Clean-review remediation（2026-08-22）：28 篇正文開頭均加入對應 Fall 2025 官方 deck 的 inline provenance；WikiChat 死鏈改為 ACL Anthology 原論文；Lecture 1 移除未受講義支持的 70% 敘述；14 對 heading 數量與實質內容已對齊。
- Series metadata 目前留在各篇 frontmatter；共享 registry 的註冊列為後續整合工作，本批刻意不修改共享檔。
- Source-at-point semantic re-audit（2026-08-22）：撤銷機械式 paragraph stamping，改逐節區分 deck-derived facts、paper-specific claims 與作者延伸。事實節通常只在支持句保留一個 deck／paper link；prototype、production checklist、自創測例與檢核方法均標成「本文建議／Author extension」，不歸屬投影片。另抽樣核對 CHURRO、ReactGenie、data-efficient training 與 clean-review 指定段落。
- Final scope audit：CHURRO alignment／provenance recipe 與授權三分法、ReactGenie schema regression／selection race／diagnostics，以及其餘文章中混合 deck fact 與 production prescription 的段落，已拆成來源支持的事實與明標作者延伸；zh/en scope 保持一致。
- Final pinpoint fix：Agentic Knowledge Base 的 SQL 延伸節已把 fixed-schema／iterative exploration 的 lecture fact 與 sandbox、row-level policy、query-cost limits 的本文部署建議拆開，雙語 deck link 僅留在前者。
