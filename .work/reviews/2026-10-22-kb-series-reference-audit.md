# 「知識庫怎麼建」系列 order 0–9 參考資料讀取稽核

- 稽核日期：2026-10-22
- 範圍：`src/content/posts/learning/2026-10-22-*.md` 中 series「知識庫怎麼建」的 10 篇中文版（不含 -en），各篇 `## 參考資料` 共 145 條（含跨篇重複；不重複網址 126 個）。
- 對照：`.work/research/building-knowledge-bases/extractions/`（102 檔，含 `_spotcheck-batch1–6`、`_order3-saturation`）。以網址、DOI、arXiv 編號比對，比對不到再用標題與作者 grep。`sources.jsonl` 只當參考，以抽取紀錄為準。
- 只讀，沒有改任何文章或紀錄。

## 依據的規則（writing-guide.md L423–433）

> **列進 `## 參考資料` 的每一條都必須完整讀過。搜尋摘要不算讀過。**
>
> **沒有「這篇讀摘要就夠」這種例外。**
>
> 全文太長就挑相關章節讀完，並在附錄或交接時說明讀了哪些段落——這跟「只看摘要」是兩件事。

判定標準：
- **全文**：紀錄寫明正文從頭讀到尾，或多頁來源中這一頁整頁讀完。附錄、補充材料、圖內文字、參考文獻沒讀，但紀錄有揭露的，仍算全文；這類情況另列在「全文但有版本或範圍註記」。
- **部分**：被引用的那個版本或頁面只讀了一部分，或只讀到另一個版本。
- **只摘要**：被引用的那篇只讀到摘要。
- **找不到紀錄**：`extractions/` 裡沒有任何紀錄。

## 數量

| 判定 | 條數（含重複） | 不重複來源 |
|---|---|---|
| 全文 | 135 | — |
| 部分 | 2 | 2 |
| 只摘要 | 1 | 1 |
| 找不到紀錄 | 7 | 3 |
| 合計 | 145 | 6 個非全文來源 |

六份抽查批次（`_spotcheck-batch1–6`）抽到的紀錄都是「通過」或「有小錯」，都不影響讀取判定。

## 逐條表

「依據」欄的行號是對應紀錄檔的行號。⚠ 表示 `sources.jsonl` 的 read_status 和抽取紀錄不一致。

| order | 參考資料條目 | 對應紀錄檔 | 判定 | 依據 |
|---|---|---|---|---|
| 0 | Boardman & Sasse 2004, "Stuff goes into the computer and doesn't come out": A cross-tool study of personal information management (CHI 2004) | `boardman-sasse-2004-stuff-goes-in.md` | **全文** | L3 `read_status=read（全文 PDF，CHI 2004 正式版排版，8 頁）…` |
| 0 | Malone 1983, How do people organize their desks? (ACM TOIS) | `malone-1983-desks.md` | **全文** | L3 `read_status=read（ACM 正式版 PDF 的文字層，經 Exa 取得；圖表只剩 OCR 殘字）…` (sources.jsonl=read) |
| 0 | Stocker & Tochtermann 2011, Enterprise Wikis: Types of Use, Benefits and Obstacles: A Multiple-Case Study (IC3K 2009, CCIS 128) | `stocker-tochtermann-2011-enterprise-wikis.md` | **全文** | L3 作者稿 13 頁全文；Springer 版只比對到 pp.297–298（L89） (sources.jsonl=read) |
| 0 | Anthropic 2024, Introducing Contextual Retrieval | `anthropic-2024-contextual-retrieval.md` | **全文** | L3 讀的版本 exa「未截斷」；L11「依序讀完全文」 (sources.jsonl=read) |
| 0 | Barnett et al. 2024, Seven Failure Points When Engineering a Retrieval Augmented Generation System (CAIN 2024; arXiv:2401.05856) | `barnett-2024-seven-failure-points.md` | **全文** | L3 arXiv HTML「未截斷」；L12「依序從標題讀到 References 結束」 (sources.jsonl=read) |
| 0 | Bruce, Jones & Dumais 2004, Information behaviour that keeps found things found (Information Research 10(1)) | `bruce-jones-dumais-2004-kftf.md` | **全文** | L3 `read_status=read（全文 HTML，期刊正式版）…` (sources.jsonl=read) |
| 0 | Bendersky, Metzler, Najork & Wang, Searching Personal Collections, in Information Retrieval: Advanced Topics and Techniques (ACM Press, 2025); arXiv:2412.12330 | `najork-2024-searching-personal-collections.md` | **全文** | L3 fulltext（arXiv）；L89「合計涵蓋第 1–1245 行全文」 (sources.jsonl=read) |
| 0 | Whittaker et al. 2011, Am I wasting my time organizing email? A study of email refinding (CHI 2011) | `whittaker-2011-email-refinding.md` | **全文** | L3 作者 camera-ready 8 頁；L95「全文讀完」 |
| 0 | Dumais et al. 2003, Stuff I've Seen: A System for Personal Information Retrieval and Re-Use (SIGIR 2003) | `dumais-2003-stuff-ive-seen.md` | **全文** | L3 fulltext；L9 讀 SIGIR Forum 2015 影印式重刊版；L86 1–529 全讀 |
| 0 | Grudin & Poole 2010, Wikis at Work: Success Factors and Challenges for Sustainability of Enterprise Wikis (WikiSym 2010) | `grudin-poole-2010-wikis-at-work.md` | **全文** | L3 `read_status=full（作者自存的會議論文 PDF，8 頁；與 ACM DL 版同篇，ACM 版因 403 沒取得，未逐字比對排版…` |
| 0 | Tiago Forte, Building a Second Brain: The Definitive Introductory Guide | — | **找不到紀錄** | extractions/ 無任何檔含此網址；sources.jsonl L118 標 read（exa 未截斷），research-note L59 卻標「🔎 片段／不引」 ⚠ sources.jsonl=read |
| 0 | zettelkasten.de, The Collector's Fallacy | — | **找不到紀錄** | extractions/ 無檔含此網址；只有 sources.jsonl L4 read（tried 欄空白）與 research-note L60 ✅、L95 摘要句 ⚠ sources.jsonl=read |
| 1 | Van Kleek, Styke, schraefel & Karger 2011, Finders/Keepers: A Longitudinal Study of People Managing Information Scraps in a Micro-note Tool (CHI 2011) | `vankleek-2011-finders-keepers.md` | **全文** | L3 `read_status=read（全文，第一作者 MIT CSAIL 個人頁上的 PDF；指定的 DSpace 作者最終稿當下回 HTTP …` (sources.jsonl=read) |
| 1 | zettelkasten.de, The Collector's Fallacy (2014) | — | **找不到紀錄** | extractions/ 無檔含此網址；只有 sources.jsonl L4 read（tried 欄空白）與 research-note L60 ✅、L95 摘要句 ⚠ sources.jsonl=read |
| 1 | Whittaker & Hirschberg 2001, The character, value, and management of personal paper archives (ACM TOCHI) | `whittaker-hirschberg-2001-paper-archives.md` | **部分** | L3「投稿前草稿全文；ACM TOCHI 正式版只讀到摘要與第 1–2 頁」；L22、L106 兩版只核對過 49% ⚠ sources.jsonl=read |
| 1 | Jones 2004, Finders, keepers? The present and future perfect in support of personal information management (First Monday 9(3)) | `jones-2004-finders-keepers.md` | **全文** | L3 `read_status=read（First Monday 正式版 HTML 全文；圖 1–5 是圖片，只讀到圖說，沒讀到圖內文字）…` (sources.jsonl=read) |
| 1 | Bruce 2005, Personal, anticipated information need (Information Research 10(3)) | `bruce-2005-anticipated-need.md` | **全文** | L13「以 Read 一次讀完 1–455（含 References）」 (sources.jsonl=read) |
| 1 | Neave et al. 2019, Digital hoarding behaviours: Measurement and evaluation (Computers in Human Behavior) | `neave-2019-digital-hoarding.md` | **全文** | L3 `read_status=full（讀的是 Northumbria 機構庫的作者接受稿 AAM，不是 Elsevier 排版版；文首註明 "T…` |
| 1 | Rutishauser & Fritz 2026, From Tabs to Structures: Understanding and Supporting Web Page Management (CHI 2026) | `rutishauser-2026-tabs-to-structures.md` | **全文** | L3 `read_status=fulltext（透過 Exa 取得的 ACM PDF 全文文字；表格與圖的版面有破損，見讀取紀錄）…` (sources.jsonl=read) |
| 1 | Malone 1983, How do people organize their desks? (ACM TOIS) | `malone-1983-desks.md` | **全文** | L3 `read_status=read（ACM 正式版 PDF 的文字層，經 Exa 取得；圖表只剩 OCR 殘字）…` (sources.jsonl=read) |
| 1 | GTD Weekly Review Checklist (David Allen Company) | — | **找不到紀錄** | extractions/ 無檔含此網址；只有 sources.jsonl L13 read（「document_parse 讀到完整清單」）與 research-note L61、L100 ⚠ sources.jsonl=read |
| 1 | Tiago Forte, Building a Second Brain: The Definitive Introductory Guide | — | **找不到紀錄** | extractions/ 無任何檔含此網址；sources.jsonl L118 標 read（exa 未截斷），research-note L59 卻標「🔎 片段／不引」 ⚠ sources.jsonl=read |
| 1 | Bruce, Jones & Dumais 2004, Information behaviour that keeps found things found (Information Research 10(1)) | `bruce-jones-dumais-2004-kftf.md` | **全文** | L3 `read_status=read（全文 HTML，期刊正式版）…` (sources.jsonl=read) |
| 1 | Pew Research Center 2024, When Online Content Disappears | `pew-2024-link-rot.md` | **全文** | L3 `read_status=full（PDF 全文 17 頁含方法說明，逐行讀完）…` |
| 1 | Omnivore（GitHub README：雲端服務於 2024 年 11 月停止） | `omnivore-2024-shutdown.md` | **部分** | L69 README「1–30 全讀並 grep 其餘段落」（README 共 180 行）；公告兩篇全文在 L65–67 |
| 1 | Mozilla Support, The future of Pocket | `pocket-2025-shutdown.md` | **全文** | L3 `read_status=full（三個官方頁面各自整頁讀完；支援頁是 2026-10 的現行版，不是 2025-05 公告當時的版本）…` |
| 1 | Kalnikaite & Whittaker 2007, Does Taking Notes Help You Remember Better? Exploring How Note Taking Relates to Memory (MeMos 2007 workshop proceedings) | `kalnikaite-whittaker-2007-note-taking-memory.md` | **全文** | L3 `read_status=read（全文 4 頁，取自工作坊論文集 PDF 第 33–36 頁；指定的 diuf.unifr.ch 單篇 PD…` (sources.jsonl=read) |
| 1 | Barnett et al. 2024, Seven Failure Points When Engineering a Retrieval Augmented Generation System (arXiv:2401.05856) | `barnett-2024-seven-failure-points.md` | **全文** | L3 arXiv HTML「未截斷」；L12「依序從標題讀到 References 結束」 (sources.jsonl=read) |
| 1 | Melumad & Yun 2025, Experimental evidence of the effects of large language models versus web search on depth of learning (PNAS Nexus) | `melumad-yun-2025-llm-vs-search.md` | **全文** | L3 主文全文；L100 補充材料（3 個複製實驗）未讀 |
| 1 | Readwise Reader 說明：Library configuration | `tools-official-docs.md` | **全文** | L3；L144 tools-rw-libconfig 1–69 |
| 1 | Obsidian Help：Web Clipper | `tools-official-docs.md` | **全文** | L3；L148 讀官方 help repo 的 Web Clipper 介紹頁 1–47（線上 SPA 抓不到，L159） |
| 1 | Notion Help：Save web pages with Notion Web Clipper | `tools-official-docs.md` | **全文** | L3；L153 tools-notion-clipper 1–70 |
| 1 | Bravo-Adasme et al. 2026, digital hoarding scoping review (Humanities and Social Sciences Communications) | `bravo-adasme-2026-digital-hoarding-scoping-review.md` | **全文** | L3 正文 13 頁全讀；附錄 1–4 與 Zenodo 補充資料未讀 (sources.jsonl=read) |
| 2 | Bergman, Beyth-Marom, Nachmias, Gradovitch & Whittaker 2008, Improved search engines and navigation preference in personal information management (ACM TOIS) | `bergman-2008-tois-navigation-preference.md` | **全文** | L58–62 Playwright 取 ACM PDF 24 頁，「依序讀完 1–650、650–1246」 ⚠ sources.jsonl=abstract |
| 2 | Bergman, Whittaker, Sanderson, Nachmias & Ramamoorthy 2010, The effect of folder structure on personal file navigation (JASIST) | `bergman-2010-folder-structure.md` | **全文** | L60–63 作者 preprint 41 頁「依序讀完」至附錄 Table 4 |
| 2 | Bergman & Dvir 2024, File hyper-searching explained (Human–Computer Interaction) | `bergman-dvir-2024-hypersearching.md` | **全文** | L77–79 T&F 網頁全文依序讀至參考文獻開頭；Table 1–8 為圖片未取得 ⚠ sources.jsonl=snippet |
| 2 | Bergman, Gradovitch, Bar-Ilan & Beyth-Marom 2013, Folder versus tag preference in personal information management (JASIST) | `bergman-2013-jasist-folder-vs-tag.md` | **只摘要** | L3「JASIST 正文 blocked（只讀到摘要＋參考文獻）」；L62–69 逐管道失敗；L60 控制任務數字只在 JASIST 正文、未讀 |
| 2 | Bergman et al. 2013, Tagging personal information: A contrast between attitudes and behavior (ASIS&T 2013) | `bergman-2013-jasist-folder-vs-tag.md` | **全文** | L10 姊妹篇 ASIS&T 2013「（全文）」；_spotcheck-batch4 已核 |
| 2 | Civan, Jones, Klasnja & Bruce 2008, Better to organize personal information by folders or by tags?: The devil is in the details (ASIS&T 2008) | `civan-2008-folders-vs-tags.md` | **全文** | L77–82 Wiley HTML 全文「依序讀完」1–553 |
| 2 | Whittaker et al. 2011, Am I wasting my time organizing email? A study of email refinding (CHI 2011) | `whittaker-2011-email-refinding.md` | **全文** | L3 作者 camera-ready 8 頁；L95「全文讀完」 |
| 2 | Ferreira et al. 2025, How People Manage Knowledge in their "Second Brains" (arXiv:2509.20187) | `ferreira-2025-second-brains-obsidian.md` | **全文** | L3 `read_status=read（全文 9 頁，arXiv v1，含 3 張圖說、參考文獻）…` |
| 2 | Notion Help: Create a subpage | `notion-pages-databases.md` | **全文** | L64–67 create-a-subpage 1–24、intro-to-databases 全文「依序讀完」 |
| 2 | Notion Help: Intro to databases | `notion-pages-databases.md` | **全文** | L64–67 create-a-subpage 1–24、intro-to-databases 全文「依序讀完」 |
| 2 | Tiago Forte, The PARA Method | `forte-para.md` | **全文** | L3；L94 para.txt 1–188 全文 (sources.jsonl=read) |
| 2 | Tiago Forte 2017, The PARA Method: A Universal System for Organizing Digital Information | `forte-para.md` | **全文** | L95 para-2017-every 1–228 全文 |
| 2 | Tiago Forte 2017, PARA Part 2: Operations Manual | `forte-para.md` | **全文** | L96 para-part2-every 1–173 全文 |
| 2 | Tiago Forte, Building a Second Brain: The Definitive Introductory Guide | — | **找不到紀錄** | extractions/ 無任何檔含此網址；sources.jsonl L118 標 read（exa 未截斷），research-note L59 卻標「🔎 片段／不引」 ⚠ sources.jsonl=read |
| 2 | Johnny.Decimal: Introduction | `johnny-decimal.md` | **全文** | L3；L96 jd-intro 1–185 全文 (sources.jsonl=read) |
| 2 | Johnny.Decimal: Philosophy | `johnny-decimal.md` | **全文** | L3；L99 jd-philosophy 全文 |
| 2 | Johnny.Decimal: The JDex | `johnny-decimal.md` | **全文** | L3；L100 jd-the-jdex 全文 |
| 2 | Johnny.Decimal: Expand an area | `johnny-decimal.md` | **全文** | L3；L104 起 expand-an-area-overview 全文 |
| 2 | Dinneen & Frissen 2020, Mac users do it differently: the role of operating system and individual differences in file management (CHI EA 2020) | `dinneen-frissen-2020-mac-individual-differences.md` | **全文** | L53–56 arXiv preprint「依序讀完 1–406（全文，含參考文獻）」 |
| 3 | Niklas Luhmann-Archiv, Der Zettelkasten Niklas Luhmanns | `luhmann-archiv-zettelkasten.md` | **全文** | L80 nachlass-zk 1–143 全文 |
| 3 | Niklas Luhmann-Archiv, Inhaltsübersicht Zettelkasten | `luhmann-archiv-zettelkasten.md` | **全文** | L3；L75–78 導覽與說明逐行讀，中段 4,000 餘條清單以程式全數解析＋抽看（非逐行人讀，紀錄已揭露） (sources.jsonl=read) |
| 3 | Niklas Luhmann, Communicating with Slip Boxes (English translation by Manfred Kuehn) | `luhmann-slip-boxes.md` | **全文** | L3 `read_status=fulltext（英譯全文；德文原文未讀）…` (sources.jsonl=read) |
| 3 | zettelkasten.de, Introduction to the Zettelkasten Method | `zettelkasten-de-introduction.md` | **全文** | L3 `read_status=fulltext（整份讀完；性質是方法推廣者的主張，作者也是 The Archive 軟體的開發者）…` ⚠ sources.jsonl=partial |
| 3 | Andy Matuschak, Evergreen notes | `matuschak-evergreen-notes.md` | **全文** | L3；L106 am-evergreen 全文 (sources.jsonl=read) |
| 3 | Andy Matuschak, Evergreen notes should be atomic | `matuschak-evergreen-notes.md` | **全文** | L107 am-atomic 全文 |
| 3 | Andy Matuschak, Evergreen notes should be concept-oriented | `matuschak-evergreen-notes.md` | **全文** | L108 am-concept 全文 |
| 3 | Andy Matuschak, Prefer associative ontologies to hierarchical taxonomies | `matuschak-evergreen-notes.md` | **全文** | L110 am-associative 全文 |
| 3 | Andy Matuschak, Write notes for yourself by default, disregarding audience | `matuschak-evergreen-notes.md` | **全文** | L111 am-foryourself 全文 |
| 3 | Linking Your Thinking, MOCs (defn) | `lyt-mocs.md` | **全文** | L3；L85 lyt-mocs 全文 |
| 3 | Bergman et al. 2008, Improved search engines and navigation preference in personal information management (ACM TOIS) | `bergman-2008-tois-navigation-preference.md` | **全文** | L58–62 Playwright 取 ACM PDF 24 頁，「依序讀完 1–650、650–1246」 ⚠ sources.jsonl=abstract |
| 3 | Bergman et al. 2010, The effect of folder structure on personal file navigation (JASIST) | `bergman-2010-folder-structure.md` | **全文** | L60–63 作者 preprint 41 頁「依序讀完」至附錄 Table 4 |
| 3 | Whittaker et al. 2011, Am I wasting my time organizing email? A study of email refinding (CHI 2011) | `whittaker-2011-email-refinding.md` | **全文** | L3 作者 camera-ready 8 頁；L95「全文讀完」 |
| 3 | Bertsch, Pesta, Wiscott & McDaniel 2007, The generation effect: A meta-analytic review (Memory & Cognition) | `bertsch-2007-generation-effect-meta.md` | **全文** | L3 `read_status=read（全文 10 頁，期刊排版版，含 Table 1 全表、兩則註腳、參考文獻）…` ⚠ sources.jsonl=abstract |
| 3 | McCurdy, Viechtbauer, Sklenar, Frankenstein & Leshikar 2020, Theories of the generation effect and the impact of generation constraint: A meta-analytic review (Psychonomic Bulletin & Review) | `mccurdy-2020-generation-effect-meta.md` | **全文** | L3 `read_status=read（全文，出版社版本 Version of record，含 Table 1–3、附錄、參考文獻）…` |
| 3 | Urry et al. 2021, Don't Ditch the Laptop Just Yet (Psychological Science) | `urry-2021-laptop-replication.md` | **全文** | L3 `read_status=read（全文 37 頁：正文、Table 1、Figure 1–3、參考文獻、Supplementary Mate…` |
| 3 | DeStefano & LeFevre 2007, Cognitive load in hypertext reading: A review (Computers in Human Behavior) | `destefano-lefevre-2007-hypertext-cognitive-load.md` | **全文** | L3 `read_status=read（全文 26 頁，期刊排版版，含參考文獻與作者簡介）…` |
| 3 | Madrid, Van Oostendorp & Puerta Melguizo 2009, The effects of the number of links and navigation support on cognitive load and learning with hypertext (Computers in Human Behavior) | `madrid-2009-number-of-links.md` | **全文** | L3 `read_status=read（accepted manuscript 全文 22 頁，從標題讀到參考文獻最後一條）…` |
| 3 | Alford & Mendes 2009, Scholarly research process: Investigating the effects of link type and directionality (HT 2009) | `alford-mendes-2009-link-type-directionality.md` | **全文** | L3 `read_status=read（ACM 出版版全文 10 頁，p. 99–108，從標題讀到參考文獻最後一條）…` |
| 3 | Ferreira et al. 2025, How People Manage Knowledge in their "Second Brains" (arXiv:2509.20187) | `ferreira-2025-second-brains-obsidian.md` | **全文** | L3 `read_status=read（全文 9 頁，arXiv v1，含 3 張圖說、參考文獻）…` |
| 4 | Kleppmann, Wiggins, van Hardenberg & McGranaghan 2019, Local-first software: You own your data, in spite of the cloud (Ink & Switch; Onward! 2019) | `kleppmann-2019-local-first.md` | **全文** | L3 `read_status=full…` ⚠ sources.jsonl=snippet |
| 4 | Obsidian Help: How Obsidian stores data | `obsidian-official-docs.md` | **全文** | L3 7 頁整頁讀完；L15 data-storage 列、L150 各自整檔讀完 |
| 4 | Obsidian Help: Sync your notes across devices | `obsidian-sync-import-bases.md` | **全文** | L3 主頁整份讀完；L163 obs2-sync 1–237 全讀 |
| 4 | Obsidian Help: Internal links | `obsidian-sync-import-bases.md` | **全文** | L170 obs2-internal-links 1–184 全讀（obsidian-official-docs L16 亦全讀） |
| 4 | Obsidian Help: Backlinks | `obsidian-official-docs.md` | **全文** | L3；L17 backlinks 列；L150 |
| 4 | Obsidian Help: Properties | `obsidian-official-docs.md` | **全文** | L3；L18 properties 列；L150 |
| 4 | Obsidian Help: Introduction to Bases | `obsidian-sync-import-bases.md` | **全文** | L166 obs2-bases-intro 1–45 全讀 |
| 4 | Obsidian Help: Obsidian Flavored Markdown | `obsidian-official-docs.md` | **全文** | L3；L20 OFM 列；L150 |
| 4 | Obsidian Help: Import from Notion | `obsidian-sync-import-bases.md` | **全文** | L164 obs2-notion 1–141 全讀 |
| 4 | Steph Ango, File over app | `ango-2023-file-over-app.md` | **全文** | L3 `read_status=full…` |
| 4 | Notion Help: Export your content | `notion-export-import.md` | **全文** | L3；L94 export 140–628 ⚠ sources.jsonl=partial |
| 4 | Notion Help: Import data into Notion | `notion-export-import.md` | **全文** | L3；L95 import 148–1236 |
| 4 | Dix 2024, The future of PIM: pragmatics and potential (Human–Computer Interaction) | `dix-2024-future-of-pim.md` | **全文** | L3 `read_status=full（本文與參考文獻整份讀完）…` |
| 5 | Van Kleek, Bernstein, Panovich, Vargas, Karger & schraefel 2009, Note to self: examining personal information keeping in a lightweight note-taking tool (CHI 2009) | `vankleek-2009-note-to-self.md` | **全文** | L3 `read_status=read（4 頁全文）；每週回顧實證研究：not-found（查詢與結果見最後一節）…` |
| 5 | GTD Weekly Review Checklist (David Allen Company) | — | **找不到紀錄** | extractions/ 無檔含此網址；只有 sources.jsonl L13 read（「document_parse 讀到完整清單」）與 research-note L61、L100 ⚠ sources.jsonl=read |
| 5 | Tiago Forte, Progressive Summarization: A Practical Technique for Designing Discoverable Notes | `forte-progressive-summarization.md` | **全文** | L3 三篇全文；_spotcheck-batch4 核 part1 305–439 為頁尾 ⚠ sources.jsonl=partial |
| 5 | Tiago Forte, Progressive Summarization II: Examples and Metaphors | `forte-progressive-summarization.md` | **全文** | L3 三篇全文 |
| 5 | Tiago Forte, Progressive Summarization III: Guidelines and Principles | `forte-progressive-summarization.md` | **全文** | L3 三篇全文 |
| 5 | Bergman, Tucker, Beyth-Marom, Cutrell & Whittaker 2009, It's not that important: demoting personal information of low subjective importance using GrayArea (CHI 2009) | `bergman-2009-grayarea.md` | **全文** | L3 `read_status=read（全文，10 頁，作者共同作者 Cutrell 個人網站上的 PDF；版面與 ACM 正式版一致：CHI 2…` |
| 5 | Chen et al. 2025, More AI Assistance Reduces Cognitive Engagement: Examining the AI Assistance Dilemma in AI-Supported Note-Taking (CSCW 2025) | `chen-2025-ai-assistance-dilemma.md` | **全文** | L3 `read_status=read（全文 29 頁含參考文獻；讀 arXiv PDF 版，正文到 §7 Conclusion 與致謝，參考文獻…` |
| 5 | Melumad & Yun 2025, Experimental evidence of the effects of large language models versus web search on depth of learning (PNAS Nexus) | `melumad-yun-2025-llm-vs-search.md` | **全文** | L3 主文全文；L100 補充材料（3 個複製實驗）未讀 |
| 5 | Etkin et al. 2025, Differential effects of GPT-based tools on comprehension of standardized passages (Frontiers in Education) | `etkin-2025-gpt-tools-comprehension.md` | **全文** | L3 Frontiers 網頁全文；L65 補充資料未下載 ⚠ sources.jsonl=abstract |
| 5 | Lee et al. 2025, The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers (CHI 2025) | `lee-2025-genai-critical-thinking.md` | **全文** | L3 `read_status=read（論文全文 PDF，含附錄 A.1 問卷題目與 Table 5 codebook；不是 Microsoft …` |
| 5 | Huq et al. 2025, NoTeeline: Supporting Real-Time, Personalized Notetaking with LLM-Enhanced Micronotes (IUI 2025) | `huq-2025-noteeline.md` | **全文** | L3 `read_status=read（arXiv v2 全文含附錄前的所有正文；角色：order 5 反證平衡——AI 協助整理筆記的正面效果）…` |
| 6 | Stack Overflow Developer Survey 2024: Professional Developers | `stackoverflow-2024-professional-knowledge.md` | **全文** | L3 `read_status=full（§6 頁面全文＋圖表 SVG 內嵌數字＋§7 Methodology 全文；原始資料集未取得，見讀取紀錄）…` (sources.jsonl=read) |
| 6 | Aghajani et al. 2019, Software Documentation Issues Unveiled (ICSE 2019) | `aghajani-2019-doc-issues-unveiled.md` | **全文** | L3 `read_status=full（作者頁 PDF，12 頁，ICSE 2019 會議版排版；未與 IEEE Xplore 版逐字比對）…` ⚠ sources.jsonl=partial |
| 6 | Aghajani et al. 2020, Software Documentation: The Practitioners' Perspective (ICSE 2020) | `aghajani-2020-practitioners-perspective.md` | **全文** | L3 `read_status=full（共同作者 Csaba Nagy 個人頁的 preprint PDF，12 頁，頁首含 ICSE '20 版…` |
| 6 | Stocker & Tochtermann 2011, Enterprise Wikis: Types of Use, Benefits and Obstacles: A Multiple-Case Study (IC3K 2009, CCIS 128) | `stocker-tochtermann-2011-enterprise-wikis.md` | **全文** | L3 作者稿 13 頁全文；Springer 版只比對到 pp.297–298（L89） (sources.jsonl=read) |
| 6 | Galan 2023, Knowledge loss induced by organizational member turnover: a review of empirical literature (Part I) (The Learning Organization) | `galan-2023-turnover-knowledge-loss.md` | **全文** | L3；L95 Part I 1–1042 依序讀（線上補充表未取得） |
| 6 | Galan 2023, Knowledge loss induced by organizational member turnover (Part II) (The Learning Organization) | `galan-2023-turnover-knowledge-loss.md` | **全文** | L3；L96 Part II 1–1250 依序讀 |
| 6 | DORA 2023, Accelerate State of DevOps Report | `dora-2023-documentation.md` | **全文** | L3 `read_status=full（95 頁全文依序讀完，v. 2023-12 版）…` |
| 6 | Grudin & Poole 2010, Wikis at Work: Success Factors and Challenges for Sustainability of Enterprise Wikis (WikiSym 2010) | `grudin-poole-2010-wikis-at-work.md` | **全文** | L3 `read_status=full（作者自存的會議論文 PDF，8 頁；與 ACM DL 版同篇，ACM 版因 403 沒取得，未逐字比對排版…` |
| 6 | Ahmeti et al. 2024, Architecture decision records in practice: an action research study (ECSA 2024) | `ahmeti-2024-adr-action-research.md` | **全文** | L3 `read_status=full（作者 Rebekka Wohlrab 個人頁的 accepted 版 PDF，16 頁，頁首標 "Acce…` |
| 6 | Diátaxis | `diataxis-four-types.md` | **全文** | L3；L89 首頁在 diataxis.txt 1–640 (sources.jsonl=read) |
| 6 | Diátaxis: The compass | `diataxis-four-types.md` | **全文** | L3 14 頁全文；L89 compass 在 diataxis.txt 依序讀 |
| 7 | NN/g 2014, Intranet Information Architecture (IA) Trends | `nng-intranet-ia.md` | **全文** | L3；L75 Read A L1–197 |
| 7 | NN/g 2024, Intranet Usability Guidelines: New Findings From 57 Intranets | `nng-intranet-ia.md` | **全文** | L3；L75 Read B L1–249（背後付費報告未讀） |
| 7 | Cozijn, Maes, Schackman & Ummelen 2007, Structuring job related information on the intranet: An experimental comparison of task vs. an organization-based approach (Journal of Technical Writing and Communication) | `cozijn-2007-intranet-task-vs-org.md` | **全文** | L3 `read_status=read（2007 英文正式版全文文字層；Figure 1–3 是圖片，只讀到圖說；Table 2 的數值在文字層裡…` |
| 7 | Resnick & Sánchez 2004, Effects of organizational scheme and labeling on task performance in product-centered and user-centered retail Web sites (Human Factors) | `resnick-sanchez-2004-org-scheme-labels.md` | **全文** | L3 `read_status=read（Gale／Free Online Library 的全文轉載，正文、Table 1–3、參考文獻齊全；Fi…` |
| 7 | GitLab Handbook | `gitlab-handbook-structure.md` | **全文** | L3；L69 首頁 L1–110 讀完 |
| 7 | GitLab Handbook: Handbook Usage | `gitlab-handbook-structure.md` | **全文** | L3；L69 首頁 L1–110 讀完 (sources.jsonl=read) |
| 7 | NN/g 2024, Card Sorting: Uncover Users' Mental Models for Better Information Architecture | `nng-card-sorting.md` | **全文** | L3；L68 Read A L1–279 ⚠ sources.jsonl=partial |
| 7 | Tullis & Wood 2004, How Many Users Are Enough for a Card-Sorting Study? (UPA 2004) | `tullis-wood-2004-card-sort-sample.md` | **全文** | L3；L10 RG 頁面文字層 L1–182 讀完 |
| 7 | NN/g 2023, Tree Testing: Evaluate Menu Labels and Categories | `nng-tree-testing.md` | **全文** | L3；L65 Read A L1–243 ⚠ sources.jsonl=partial |
| 7 | NN/g 2024, Tree Testing Part 2: Interpreting the Results | `nng-tree-testing.md` | **全文** | L3；L65 Read B L1–224 |
| 7 | Kuric, Demcak & Krajcovic 2025, Validation of information architecture: Cross-methodological comparison of tree testing variants and prototype user testing (Information and Software Technology) | `kuric-2025-tree-testing-variants.md` | **全文** | L3 `read_status=read（ScienceDirect OA 全文 HTML，從 Highlights 讀到參考文獻與 Data av…` |
| 8 | Google docguide: Best practices | `google-docguide.md` | **全文** | L3；L74 bp 一次讀完 (sources.jsonl=read) |
| 8 | Google docguide: Markdown style guide | `google-docguide.md` | **全文** | L3；L74 style 1–140 全文，140–638 去空行後全讀 |
| 8 | Diátaxis: How-to guides | `diataxis-four-types.md` | **全文** | L3；L89 how-to 在 diataxis.txt 依序讀 |
| 8 | Gao, Treude & Zahedi 2025, Adapting Installation Instructions in Rapidly Evolving Software Ecosystems (IEEE TSE) | `gao-2025-readme-install-template.md` | **全文** | L3 `read_status=full（arXiv 2312.03250v3 預印本，2025-01-07 版，22 頁；未與 TSE 正式版比對…` (sources.jsonl=read) |
| 8 | Nygard 2011, Documenting Architecture Decisions | `nygard-2011-adr.md` | **全文** | L3 `read_status=full（2026-10-22 curl 抓 live 版全文，pandoc 轉純文字；文章本體約 90 行，其餘是…` (sources.jsonl=read) |
| 8 | MADR: Markdown Architectural Decision Records | `adr-github-madr.md` | **全文** | L3 `read_status=full（3 頁＋MADR 4.0.0 minimal 模板原檔，2026-10-22 curl 抓 live 版；…` (sources.jsonl=read) |
| 8 | Ahmeti et al. 2024, Architecture decision records in practice: an action research study (ECSA 2024) | `ahmeti-2024-adr-action-research.md` | **全文** | L3 `read_status=full（作者 Rebekka Wohlrab 個人頁的 accepted 版 PDF，16 頁，頁首標 "Acce…` |
| 8 | Buchgeher et al. 2023, Using Architecture Decision Records in Open Source Projects—An MSR Study on GitHub (IEEE Access) | `buchgeher-2023-adr-github-msr.md` | **全文** | L3 `read_status=full（IEEE Access 開放取用 CC BY 版全文 HTML，經 Tavily extract 取得；圖…` (sources.jsonl=read) |
| 8 | Miccio, Tommasel & Diaz-Pace 2026, A Text Mining and Classification Approach for Analyzing Architecture Decision Records (arXiv) | `miccio-2026-adr-content-mining.md` | **全文** | L3 `read_status=full（arXiv 2609.07375v1 預印本全文，16 頁；投稿處未標示）…` (sources.jsonl=read) |
| 8 | Nogueira, Silva & Conte 2026, One Size Fits All? An Empirical Comparison of ADR Templates regarding Comprehension, Usability, and Ease of Adoption (EASE 2026, arXiv) | `nogueira-2026-adr-template-experiment.md` | **全文** | L3 `read_status=full（arXiv 2604.27333v1 預印本全文，11 頁；標 EASE'26 Glasgow，未與 AC…` (sources.jsonl=read) |
| 9 | Grudin & Poole 2010, Wikis at Work: Success Factors and Challenges for Sustainability of Enterprise Wikis (WikiSym 2010) | `grudin-poole-2010-wikis-at-work.md` | **全文** | L3 `read_status=full（作者自存的會議論文 PDF，8 頁；與 ACM DL 版同篇，ACM 版因 403 沒取得，未逐字比對排版…` |
| 9 | Tan, Wagner & Treude 2024, Detecting outdated code element references in software repository documentation (Empirical Software Engineering) | `tan-2024-outdated-code-references.md` | **全文** | L3 `read_status=full（期刊正式版全文＋arXiv v1 全文，兩版逐段比對關鍵數字）…` (sources.jsonl=read) |
| 9 | Torkki, Penttinen, Rinta-Kahila & Ruissalo 2024, Recommendations for Dealing with Unexpected Challenges in Paying Back Documentation Debt (ICIS 2024) | `torkki-2024-documentation-debt-action-research.md` | **全文** | L3 `read_status=full（出版社 PDF 全文，含方法、發現、挑戰、建議、限制；參考文獻略讀）…` (sources.jsonl=read) |
| 9 | GitLab Handbook: Handbook Usage | `gitlab-handbook-structure.md` | **全文** | L3；L69 首頁 L1–110 讀完 (sources.jsonl=read) |
| 9 | GitLab Handbook: Directly Responsible Individuals | `gitlab-handbook-structure.md` | **全文** | L3；L69 首頁 L1–110 讀完 (sources.jsonl=read) |
| 9 | Notion: Wikis & verified pages | `notion-verified-pages.md` | **全文** | L3；L9 (sources.jsonl=read) |
| 9 | Notion: Verify knowledge your teammates can trust | `notion-verified-pages.md` | **全文** | L3；L10（折疊段另由 HTML JSON 抽出） (sources.jsonl=read) |
| 9 | Confluence: Transfer ownership of your content item | `notion-verified-pages.md` | **全文** | L3；L13 (sources.jsonl=read) |
| 9 | Atlassian Community 2024, Verified Pages - Now Available in Confluence | `notion-verified-pages.md` | **全文** | L3；L11；counterevidence-verification-ritual L9–20 亦全文 (sources.jsonl=read) |
| 9 | Google docguide: Best practices | `google-docguide.md` | **全文** | L3；L74 bp 一次讀完 (sources.jsonl=read) |
| 9 | Write the Docs: Docs as Code | `writethedocs-docs-as-code.md` | **全文** | L3 `read_status=full（單頁全文，99 行；2026-10-22 讀）…` (sources.jsonl=read) |
| 9 | code.org PR #71072, Trim Pull Request template (2026) | `counterevidence-verification-ritual.md` | **全文** | L3；L22–25 gh api 取 PR 本文 99 行 (sources.jsonl=read) |
| 9 | Silva, Unterkalmsteiner & Wnuk 2023, Towards identifying and minimizing customer-facing documentation debt (TechDebt 2023) | `silva-2023-ericsson-documentation-debt.md` | **全文** | L3 `read_status=full（arXiv 全文；兩欄 PDF 改用非 layout 模式轉文字後逐段讀）…` (sources.jsonl=read) |
| 9 | KCS v6 Practices Guide: Reuse is Review | `kcs-v6-reuse-is-review.md` | **全文** | L3 9 頁正文全讀；L16 (sources.jsonl=read) |
| 9 | KCS v6 Practices Guide: Flag It or Fix It | `kcs-v6-reuse-is-review.md` | **全文** | L3；L17 (sources.jsonl=read) |
| 9 | KCS v6 Practices Guide: KCS Article State | `kcs-v6-reuse-is-review.md` | **全文** | L3；L19 (sources.jsonl=read) |
| 9 | KCS v6 Practices Guide: Archiving Old Articles | `kcs-v6-reuse-is-review.md` | **全文** | L3；L20 (sources.jsonl=read) |
## sources.jsonl 與抽取紀錄不一致

`sources.jsonl` 是研究初期寫的，後來精讀後多數沒有回寫。下面以抽取紀錄為準：

| 來源 | sources.jsonl | 抽取紀錄 |
|---|---|---|
| Bergman et al. 2008 TOIS | abstract | 全文（Playwright 取 ACM PDF，bergman-2008 L58–62） |
| Bergman & Dvir 2024 | snippet | 全文（bergman-dvir L77–79） |
| Bertsch et al. 2007 | abstract | 全文（bertsch L3） |
| Kleppmann et al. 2019 Local-first | snippet | 全文（kleppmann L111–116） |
| zettelkasten.de Introduction | partial（前 3 萬字元） | fulltext（zettelkasten-de-introduction L3） |
| Notion Export your content | partial（前 8 千字元） | full（notion-export-import L3） |
| Forte Progressive Summarization I | partial（前 2 萬字元） | read，三篇全文（forte-progressive-summarization L3） |
| Etkin et al. 2025 | abstract | 正文全文（etkin L3） |
| Aghajani et al. 2019 | partial（關鍵字抽讀） | full（aghajani-2019 L3） |
| NN/g Card Sorting 定義文 | partial（前 2 萬字元） | read 全文（nng-card-sorting L68） |
| NN/g Tree Testing Part 1 | partial（前 1 萬字元） | read 全文（nng-tree-testing L65） |
| Whittaker & Hirschberg 2001 | read | 只讀到投稿前草稿；TOCHI 正式版只讀摘要與第 1–2 頁 |
| Forte BASB overview | read | 沒有抽取紀錄；research-note L59 標「🔎 片段／不引」 |
| Collector's Fallacy | read（tried 空白） | 沒有抽取紀錄 |
| GTD Weekly Review Checklist | read | 沒有抽取紀錄 |

另外，有 78 條引用（含跨篇重複）的網址完全不在 `sources.jsonl` 裡，主要是 order 2–9 後期精讀的論文和官方文件，只有抽取紀錄。`research-note.md` L46–75 的狀態表也停在 10-20 版，例如 Bergman 2008、Dvir 2024、Bertsch、Urry、Najork、Bravo-Adasme、Kleppmann 都還標摘要或片段。後來都有全文紀錄了，但表沒改。

## 全文但有版本或範圍註記（不算違規，引用時要留意）

- **Dumais et al. 2003**：讀的是 SIGIR Forum 2015 的影印式重刊版，不是 SIGIR 2003 原版。紀錄 L9 說正文相同。
- **Stocker & Tochtermann 2011**：讀的是 ResearchGate 作者稿；Springer 版只比對到 pp.297–298（L89）。
- **Melumad & Yun 2025**：讀了主文全文。7 個實驗中有 3 個只在補充材料裡，補充材料沒讀（L100）。正文說「七個實驗、超過一萬人」（order 1 L91、order 5 L60），樣本數主文有列（L18、L30–33），所以有支撐。但補充實驗的細節不能引用。
- **Etkin et al. 2025**：補充資料沒讀（L65）。紀錄 L34「時間與評分沒有差異」的細節在補充資料裡；order 5 正文（L61、L65）沒有引用這部分。
- **Bravo-Adasme 2026**：附錄 1–4 與 Zenodo 補充資料沒讀。
- **Luhmann-Archiv 內容總覽**：中段 4,000 多條清單用程式全數解析再抽看，不是逐行人讀（L75–78）。紀錄已經揭露。
- **NN/g 2024 Intranet Usability Guidelines**：讀的是文章；背後的付費報告沒讀。
- **Bergman & Dvir 2024**：Table 1–8 是圖片，表內數字沒取得。

## 非全文與找不到紀錄的條目：處理建議

### 1. Tiago Forte, Building a Second Brain: The Definitive Introductory Guide（找不到紀錄；order 0、1、2）

- 狀態：`extractions/` 沒有紀錄。`sources.jsonl` L118 寫 read（exa web_fetch，maxCharacters 60000，未截斷）。但 `research-note.md` L59 對「CODE（Forte BASB）」標「🔎 片段，不引」，兩者矛盾。
- 正文依賴它的句子：
  - order 0 L78：「方法大多來自寫書、開課的作者，例如 Tiago Forte 的 PARA 與 Building a Second Brain」。這只是指出作者是誰，不依賴內容。
  - order 1 L56：「Tiago Forte 說他每週清一次，一次處理 10 到 20 則，只花幾分鐘」。
  - order 1 L62：「Forte 的做法是存的時候憑直覺，覺得有共鳴就先丟進收件匣」。
  - order 1 L64：「Forte 清收件匣時會依序問：這對哪個專案有用？對哪個長期負責的領域有用？屬於哪個感興趣的主題？」
  - order 2 L149：整包移進標日期的封存資料夾、新東西照新規則、舊的用到再搬（三步驟）。
- 建議：**補讀全文**，寫成 `extractions/forte-basb-overview.md`，把上面四處的數字與原句逐條對上。可試的管道：
  1. `curl -sL -A "Mozilla/5.0" https://fortelabs.com/blog/basboverview/` 再轉 pandoc。forte-para 用 Jina 讀 fortelabs 成功過。
  2. `mcp__exa__web_fetch_exa`，sources.jsonl 說這條管道未截斷。
  3. Wayback 快照。
- order 1 的三句如果找不到出處，改引 Forte 已讀全文的 PARA Part 2（`forte-para.md`）中對應的 just-in-time／flows and upkeep 段落。order 2 L149 的三步驟，請先查 PARA Part 2 或 2017 原版是否有同樣的做法。order 0 L78 也可以改連 `fortelabs.com/blog/para/`，該頁已全文讀過。

### 2. zettelkasten.de, The Collector's Fallacy（找不到紀錄；order 0、1）

- 狀態：沒有紀錄。`sources.jsonl` L4 寫 read，tried 欄空白；`research-note.md` L60 ✅，L95 有一句摘要。
- 正文依賴它的句子：
  - order 0 L78：只指出網站是誰。
  - order 1 L23：名稱、2014 年，以及「存下來的感覺本身就是一種獎勵」。
  - order 1 L25：英文原句引文「Why fallacy? Because 'to know about something' isn't the same as 'knowing something'.」。
  - order 1 L27：作者引用 Eco《如何撰寫論文》談影印。
  - order 1 L56：「zettelkasten.de 的建議更短：收集一小時就停，處理完再收下一批」。
- 建議：**補讀全文**，寫成 `extractions/zettelkasten-de-collectors-fallacy.md`。文章短，curl＋pandoc 或 exa web_fetch 都應該讀得到；同站的 introduction 頁之前讀成功過。order 1 L25 是逐字引文，一定要對原文。

### 3. GTD Weekly Review Checklist（找不到紀錄；order 1、5）

- 狀態：沒有紀錄。`sources.jsonl` L13 寫 read：「web_fetch 截斷 10,000 字元，document_parse 讀到完整清單」。`research-note.md` L61 ✅，L100 有三段結構的摘要。
- 正文依賴它的句子：
  - order 1 L56：「GTD 每週回顧的第二步是把收件匣清到零」。
  - order 5 L25–31：Get Clear／Get Current／Get Creative 三段，以及「GTD 原本」那一欄的對照表。
- 建議：**補讀全文**，寫成 `extractions/gtd-weekly-review-checklist.md`。這是一頁 PDF：`curl` 下載後 `pdftotext`，或用 Groundlane `document_parse`。逐項列出清單內容，核對「第二步」的編號，以及 order 5 表格裡「GTD 原本」欄的每一格。

### 4. Bergman, Gradovitch, Bar-Ilan & Beyth-Marom 2013, Folder versus tag preference in PIM（JASIST）（只摘要；order 2）

- 狀態：`bergman-2013-jasist-folder-vs-tag.md` L3 寫「JASIST 正文 blocked（只讀到摘要＋參考文獻）」，L62–69 列出各管道失敗。正文數字是從姊妹篇 ASIS&T 2013 全文轉述來的。
- 正文依賴它的句子：order 2 L51「Bergman 那篇論文裡，在控制好的找檔任務中，用標籤找的成功率較低、速度也較慢（Bergman et al. 2013, JASIST）」。L49 的 Gmail／Windows 7 數字已經改引姊妹篇。
- 建議（二選一）：
  - **改用已讀全文的替代來源**：姊妹篇已讀全文，而且有同義原句（紀錄 L36："retrievals with tags resulted in more failures to reach the target file and were significantly slower."）。把 L51 的連結改到 `10.1002/meet.14505001029`，或寫成「同一篇姊妹篇轉述」，再從參考資料移除 JASIST 這條。
  - **補讀全文**：可試 (a) 用 Playwright 開 Wiley 文章頁，通過 Cloudflare 挑戰後在頁內抓 `/doi/pdfdirect/`。bergman-2008 用同樣做法拿到了 ACM PDF。(b) Bar-Ilan 大學 CRIS／Ofer Bergman 個人出版頁。(c) 館際合作或寫信向作者索取。

### 5. Whittaker & Hirschberg 2001, Personal paper archives（ACM TOCHI）（部分；order 1）

- 狀態：`whittaker-hirschberg-2001-paper-archives.md` L3 寫，全文讀的是作者自存的投稿前草稿，內有「JUSTIFY」編輯標記；TOCHI 正式版只讀到摘要與第 1–2 頁。L13 記下兩版摘要措辭不同；L106 說兩版只核對過 49% 這個數字。
- 正文依賴它的句子：
  - order 1 L27：「趁一次辦公室搬遷清點員工的紙本檔案，發現其中 15% 從來沒讀過」。15% 只出自草稿。
  - order 1 L54：「習慣把文件歸檔的人，保留的紙本幾乎是堆放型的兩倍，過去一年翻閱過的比例卻比較低」，以及「過早歸檔」的解釋。這些也出自草稿。
- 建議：**補讀正式版全文**，核對 15%、「約兩倍」、翻閱比例三個數字。可試 (a) Playwright 開 ACM DL 頁通過挑戰，抓 `/doi/pdf/10.1145/376929.376932`（bergman-2008 用過這招）；(b) Semantic Scholar／Unpaywall 查有沒有 OA 版本；(c) Steve Whittaker 的 UCSC 個人頁。如果拿不到正式版，就在正文或參考資料標「依作者草稿」，紀錄 L22 也這樣建議；這是對讀過版本的誠實標示，不是讓摘要過關。

### 6. Omnivore GitHub README（部分；order 1）

- 狀態：`omnivore-2024-shutdown.md` L69 寫 README「1–30 全讀並 grep 其餘段落」，README 共 180 行。兩篇官方關閉公告（Wayback 快照）則是全文讀完（L65–67）。
- 正文依賴它的句子：order 1 L70「Omnivore 2024 年 10 月底宣布關閉雲端服務，使用者只有約一個月可以匯出」。這句的事實出自已全文讀過的兩篇部落格公告，不是 README。
- 建議（二選一）：
  - **改用已讀全文的替代來源**：把連結換成全文讀過的「Details on Omnivore shutting down」（2024-10-31，blog.omnivore.app，原站 502，可附 Wayback 快照 20250503155629 的網址）。
  - **補讀全文**：README raw 檔已經存在 `scratchpad/fulltext/omnivore-github-readme.md`（180 行），把 31–180 行讀完並補進讀取紀錄即可。

## 附帶觀察

- `chai-2023-folders-plus-tags.md`（abstract／blocked）、`santana-2026-icsa-adr-oss.md`（abstract）、Bergman & Dvir 2026 章節（只摘要）、Dinneen 2019（只摘要）都只讀到摘要，但都**沒有**被列進任何一篇的參考資料，符合規則。
- order 4 的 Kleppmann 2019 在 research-note 的狀態表仍是「🔎 只看過搜尋結果，要讀原文」，但 `kleppmann-2019-local-first.md` 已經全文讀完（L111–116）。建議把 research-note L46–75 的狀態表一起更新，免得下次稽核又誤判。

## 修正紀錄（2026-10-22）

- 6 個來源都補讀全文並寫了紀錄（forte-basb-overview、zettelkasten-collectors-fallacy、gtd-weekly-review-checklist 新寫；bergman-2013-jasist-folder-vs-tag、whittaker-hirschberg-2001-paper-archives、omnivore-2024-shutdown 更新）。
- 正文依核對結果改了 7 處（中英同步）：order 1 的 Whittaker「清點」→員工估計、zettelkasten.de 一小時是起步上限、Forte 每週決定歸處、三題答不出→封存或不存、Omnivore 改連官方公告並保留 README；order 2 的 Bergman JASIST 補條件與顯著性，參考資料標「依作者接受稿」。
- order 2 第 149 行第 3 步未改（原文「pull it out of your Archive folder」與「用到時再搬」意思一致）。
