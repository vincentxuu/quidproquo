# 「世界名校 AI／CS 課程地圖」系列計畫

## Requirements Summary

- 目標：在既有 Stanford CS 課程導讀之外，建立可持續擴張到其他學校的課程介紹系列；不預設每校都有公開課。
- 讀者：想比較各校教學路線、在申請前確認「實際會學什麼」，以及在材料足夠時沿公開教材自學的讀者。
- 核心承諾：不照排名列課名，而是重建每校的先修關係、課程主幹與分支，並誠實標示讀者實際拿得到多少教材。
- 與「AI 學位怎麼選」分工：學位系列回答去哪裡念、拿什麼學位；課程系列回答進去後學什麼、不入學能否沿著課表自學。
- 停止條件：第一季完成全球入口與 3 間新學校的課程地圖；單課深讀數量由公開材料 audit 決定，不設硬篇數。所有課程狀態由當期官方來源確認，`pnpm verify` 全綠。

## Architecture Decision

採「傘狀系列＋校內分冊」，不用一個系列流水號塞進所有學校與單課文章。

```text
世界名校 AI／CS 課程地圖（傘狀入口）
├─ Stanford CS 課程地圖 ── CS103 / CS107 / CS221 / CS229 / CS336 ...
├─ CMU AI／ML 課程地圖 ─── 07-280 / 07-380 / 10-301 / 10-601 ...
├─ MIT AI／ML 課程地圖 ──── 待官方課號與當期開課查證
└─ Berkeley AI／ML 課程地圖 ─ 待官方課號與當期開課查證
```

- 每間學校的「課程地圖」是校內分冊的 `series.order: 1`，後續單課導讀接 order 2、3、4。
- 各校課程地圖另外加入 `additionalSeries: 世界名校 AI／CS 課程地圖`，在傘狀系列中依學校排序。
- 單課文章只留在自己的校內分冊，不加入全球傘狀系列，避免全球列表膨脹成數十篇。
- 課程地圖和單課深讀是兩種不同承諾：前者可只靠官方 catalog、program requirement 與 syllabus 建立；後者必須有足以分析教學設計的公開材料。
- 查證採雙軌且以 2025–2026 最近完整官方版本為主：官方來源判斷當期開課與目前匿名存取；2026 完整就優先，若 2026 尚未發布或受限而 2025 官方版更完整，可正式採 2025 並在標題標明學期。CSDIY 只補社群實修經驗與歷史替代資源，不取代官方 schedule，也不替第三方資源或教材授權背書。
- 現有 schema 已支援主系列與額外系列；主系列控制文章卡片 badge，額外系列同樣進系列列表與篇內導覽。[內容 schema](../../src/content.config.ts:41)
- 現有 Stanford 地圖已是「Stanford CS 主線課程導讀」order 1，可直接補一個額外系列位置，無須改名或重排既有十多篇文章。[Stanford frontmatter](../../src/content/posts/learning/2026-08-20-stanford-cs-course-map.md:1)

## First-season Editorial Slate

### Umbrella order 0 — 全球入口

暫定標題：`世界名校 AI／CS 課程地圖：先修路線，以及哪些真的能公開自學`

- 回答：不同學校的課號不能直接比，該用什麼共同標準閱讀？
- 內容：選校標準、共同課程層級、公開程度分級、各校地圖入口；明講有些學校只能看課表，拿不到課程內容。
- 只放學校級摘要，不複製各校完整課表。
- 建議長度：1,800–2,400 字。

### Umbrella order 1 — Stanford（既有）

沿用：`Stanford CS 課程導讀：按先修關係排一次，從 CS106A 到 CS336`

- 現成範本已包含程式入門、核心骨架、AI 入口、主幹、五條分支、研究級課程，以及自學限制。[文章結構](../../src/content/posts/learning/2026-08-20-stanford-cs-course-map.md:42)
- 動作只有補 `additionalSeries` 與全球入口內鏈；不改既有主系列與 order。

### Umbrella order 2 — CMU

暫定標題：`CMU AI／ML 課程導讀：從 07-280 到研究級機器學習怎麼排`

- 差異化問題：CMU 把 AI、ML、語言、機器人拆在不同系所，怎麼拼成一條可走的路？
- 地圖候選：AI 入門、數學與 ML 基礎、ML 理論、機率圖模型、語言技術、機器人、人機協作。
- 最新主線採 `07-280 AI & ML I → 07-380 AI & ML II`。07-280 於 Spring 2026 首開，07-380 預計 Fall 2026 首開；官方 FAQ 明說 15-281 與 10-315 退役，因此 15-281 只作課程改制前史，不列 latest-first 首批。
- 第一批單課 audit 候選：`07-280 AI & ML I`、`10-301/10-601 Machine Learning`。07-280 等 Fall 2026 教材實際發布後重判；`10-708 Probabilistic Graphical Models` 目前只確認 Spring 2019 完整版，移到經典課程備選。
- 發稿門檻：逐門確認最新課號、先修、最近一次開課、課程網站、作業與錄影公開狀態；研究筆記中的 CMU 學位課程只能當搜尋入口，不能代替課程查證。[CMU 研究](../../docs/research-ai-degree-programs.md:68)

### Umbrella order 3 — MIT

暫定標題：`MIT AI／ML 課程導讀：沒有 AI 學位，課程主線藏在哪裡？`

- 差異化問題：MIT 沒有獨立 AI 學位，EECS、CSAIL 與 OpenCourseWare 的課程要怎麼對齊？
- 地圖層級：數學／演算法地基、AI 推理、機器學習、深度學習、決策與機器人、研究 seminar。
- 單課名稱與課號全部列為待查，不從記憶直接定稿；MIT 近年課號制度曾重編，必須同時對照現行 catalog、當期 subject listing 與 OCW 歷史版本。
- 優勢：可把「正式課表」和「公開可自學版本」的年代差異寫清楚，這會是 MIT 篇的辨識度。

### Umbrella order 4 — Berkeley

暫定標題：`Berkeley AI／ML 課程導讀：CS188、CS189 之後，該往哪一條線走？`

- 差異化問題：AI 與 ML 兩個入口之後，深度學習、強化學習、視覺、NLP 與系統如何分流？
- 第一批單課 audit 候選：`CS188 Introduction to Artificial Intelligence`、`CS189 Introduction to Machine Learning`、`CS285 Deep Reinforcement Learning`；不得因為曾有公開網站就推定現行版本仍公開。
- 發稿門檻：確認候選課在目標學期是否仍開、先修是否改動、公開網站是否屬於現行課程，以及錄影／作業授權範圍。

### 第二季候選

- ETH Zurich：適合寫「Machine Intelligence major 如何在歐洲 120 ECTS 架構中組課」，但公開教材可自學程度需先盤點。[ETH 研究](../../docs/research-ai-degree-programs.md:233)
- Tübingen：適合寫研究型 ML 路線與 Max Planck／ELLIS 生態，但課程內容需從正式 module handbook 重建。[Tübingen 研究](../../docs/research-ai-degree-programs.md:288)
- NUS：適合比較獨立 MComp in AI 與 AI Specialisation 的共同核心及差異。[NUS 研究](../../docs/research-ai-degree-programs.md:352)
- 東京大學：適合寫「AI 分散在六個專攻裡」的非單一路線，但必須處理英文授課與日本課程名稱。[東京大學研究](../../docs/research-ai-degree-programs.md:381)
- Edinburgh：適合用獨立 MSc AI 示範一個 180-credit、選修密度高的英國一年制課表。[Edinburgh 研究](../../docs/research-ai-degree-programs.md:271)

## Two Article Types and Access Labels

### Type A — 學校課程地圖

- 必要來源：現行 program requirement、course catalog、當期 schedule；有 syllabus 更好，但不是必要條件。
- 可以回答：這間學校要求什麼、先修怎麼接、有哪些分支、哪些課近期有開。
- 不可以回答：作業強度、教學品質、是否適合完整自學；除非另有材料支持。
- 即使教材全鎖在 LMS，仍可成篇，但標題與結論只能承諾「看懂課程結構」。

### Type B — 單課深讀／自學導讀

- 必要來源：除了 catalog 與當期開課證據，至少還要有完整 syllabus，加上講義、作業或錄影三者之一。
- 若只有課程描述或一頁 syllabus，不獨立成篇，只留在學校地圖中。
- 若是歷史公開版本，文章要明寫年份，並與現行課程分開，不能包裝成現在正在教的內容。
- CSDIY 可證明「這個版本曾被整理成自學路線」，不能單獨證明當期仍開放。反過來，未被 CSDIY 收錄也不會讓官方已達 A3 的課程降級。
- 主版本的操作定義是「2025 年起，查證日以前最近一個已完整發布且核心材料可匿名穩定讀取的學期」。進行中或即將開課的學期若只有 schedule，不為了追新而寫空殼導讀；2025 官方完整版本可以優先於受限或未完成的 2026 版本。
- 若 CSDIY 推薦的歷史影片與官方最新作業來自不同學期，主文只分析最新學期；歷史影片放在獨立的替代資源框，不能混稱為同一套課程。

每門課使用同一組 access label：

| 等級 | 讀者拿得到什麼 | 可以怎麼寫 |
|---|---|---|
| A0 課表可見 | 課名、學分、簡介 | 只放學校地圖，不談自學 |
| A1 課綱可見 | syllabus、週次、閱讀清單 | 可分析範圍，不評作業體驗 |
| A2 教材部分開放 | 講義、部分作業或錄影 | 可做選題式深讀，清楚列缺口 |
| A3 足以自學 | 系統化講義／錄影、作業與必要檔案 | 才能提供完整自學路線 |

## School Selection Rubric

每間候選校先打 0–2 分，總分至少 6/10 才排入下一季；但「現行官方課程結構」必須至少 1 分，否則不寫：

| 欄位 | 0 分 | 1 分 | 2 分 |
|---|---|---|---|
| 官方先修資料 | 無 | 零散 | 可重建完整依賴圖 |
| 公開教材 | A0 | A1–A2 | A3 |
| 最近開課 | 無法確認 | 兩年內 | 當學年可確認 |
| 路線辨識度 | 與既有校重複 | 有一個差異 | 有清楚獨特教學模型 |
| 站內連結價值 | 孤立 | 可連一個主題 | 可連學位系列與多篇技術文 |

名氣與排名不列入分數；它們不能證明課表值得介紹或適合自學。公開教材拿 0 分不會淘汰一間學校，只代表它只能做課程地圖，不能延伸單課自學導讀。

## First Audit Result — 2026-08-21

完整 source matrix 見 `.research/2026-08-21-ai-cs-course-access-inventory.md`。第一輪只查代表課程；第二輪已擴到其他最新 AI／ML／NLP／DL systems 候選，不能把首批四門當完整清單：

| 學校 | 校級地圖 | 可立即深讀的課 | 暫緩／限制 |
|---|---|---|---|
| CMU | 可寫 | 10-301/10-601（Spring 2026 A3）；11-785 Spring 2026 暫列 A2；07-280 Spring 教材暫列 A2 | 07-280、10-414/714 開課後追 Fall 2026 新版；15-281 已退役，只列改制前史；10-708 只列經典版 |
| MIT | 可寫 | 6.S191 2026（A3）；6.7960 Fall 2025、6.4110 Spring 2026（A2） | 6.3900 Fall 2026 尚未發布；6.7920 slides 在 Canvas |
| Berkeley | 可寫 | CS188、CS288、CS285（Spring 2026 A3／教材 A3） | CS189 等 Fall 2026 穩定站；CS180/280A Fall 2026 尚未發布材料 |

- Stanford 現有導讀不只 CS221、CS229、CS336，還包括 CS124、CS224N／U／V／W、CS228、CS329A／Z 與多門核心課；不列入「新增跨校」優先序不代表沒有最新材料。
- 新增單課優先序：MIT 6.S191 2026 → Berkeley CS288 Spring 2026 → Berkeley CS188 Spring 2026 → CMU 10-301/601 Spring 2026 → Berkeley CS285 Spring 2026。MIT 6.7960 Fall 2025 可做 A2 導讀；CMU 11-785 可同列 Spring 2026 與 Fall 2025 官方影音版本，完成作業 audit 後定主版本。CMU 07-280、Berkeley CS189、MIT 6.390、CMU 10-414/714 與 Berkeley CS180/280A 追 Fall 2026 實際發布。
- 「過去看得到、現在看不到」不視為矛盾：靜態課站可能保留，CAT-SOOP／Canvas／Panopto／Gradescope 卻在學期後關閉；泛用網域也可能輪替到新學期。文章一律記錄實際採用學期與查證日，不只存根網址。
- MIT 篇以「現行課程、當期公開材料、歷史公開版如何對齊」為主軸，不把 OpenCourseWare 的完整度轉嫁到現行課程。
- 已退役的 CMU 15-281 與 Berkeley CS188 的 Pacman project 血統可延伸成歷史／改制比較，但須當成額外選題，不取代兩校課程地圖。

## Reusable Article Templates

### A. 學校課程地圖

1. 這間學校怎麼編課號，以及哪些數字不能拿來推論難度。
2. 最低地基：程式、離散數學、線代、機率、演算法、系統各要求到哪裡。
3. AI／ML 的正式入口課。
4. 主幹課與各分支的先修圖。
5. 研究級課程、seminar 與已停開／更名課程。
6. Access audit：這些課是 A0、A1、A2 還是 A3；材料不足就直接說明只能看課表。
7. 三條實際路線：學位修課型、AI 工程準備型、研究準備型；只有 A3 路線能稱為完整自學路線。
8. 「怎麼做」：給讀者一個 30–90 分鐘可立即驗證程度的任務。

### B. 單門課深讀

1. 課程身份：學期、授課者、正式課名與最新課號。
2. 硬先修與隱性先修。
3. 課綱真正的主張，而不是逐週摘要。
4. 作業／專案如何逼學生建立能力。
5. 與前後課、同校替代課及他校近似課的差異。
6. 公開資源實際拿得到什麼、缺什麼。
7. 適合誰、誰應該先補地基、誰可以跳過。
8. 一個可執行的試讀或試做任務。

## Editorial Boundaries

- 課程地圖寫「依賴與選擇」；單課深讀寫「教學設計與能力轉換」，不逐週抄 syllabus。
- 正式課程、研究中心 training、MOOC、暑期課與 seminar 分開標示。
- 每個「目前開設」「已停開」「改名」判斷都要附目標學年與查證日。
- 公開網頁不等於公開課，更不等於可自學；至少分成課程描述、syllabus、講義、作業、起始碼、解答、錄影七欄，再給 A0–A3 標籤。
- CSDIY 是歷史自學版本與實修經驗的交叉證據，不是當期權限、官方性或開放授權證明；第三方影片、個人 GitHub 與泛用課站逐一標示。
- 不把教師個人舊站自動當現行課程；必須和 catalog 或當期 schedule 對上。
- 單課標題與開頭固定標示採用學期；「最新」指最近完整可用版本，不把只有課表、教材尚未發布的下一學期算成可導讀版本。
- 正式收錄窗為 2025–2026；2025 不是只能放附錄，但採用時要說明它比 2026 更適合自學的具體原因。
- 不替讀者重製受版權保護的教材；文章提供分析、路徑與官方連結。
- 每篇最多詳寫 12 門課；其餘放附錄或候選清單，避免課名百科化。

## Cross-series Linking

```text
AI 學位怎麼選：全球課程與申請地圖
             │「這個學位實際學什麼？」
             ▼
世界名校 AI／CS 課程地圖（全球入口）
             │「這間學校怎麼排？」
             ▼
各校課程地圖 ──► 單門課深讀 ──► 站內技術實作文章
             │
             └──► 2026 AI 課程總覽（需要真正公開教材時的替代路線）
```

- 學位區域篇只連到對應學校地圖，不複製課程細節。
- 各校地圖開頭連回該校在學位系列的定位；只有存在 A2／A3 材料時才連到單課深讀，否則直接連公開自學替代方案。
- 單課文章連回校內地圖，並可用 `additionalSeries` 保留既有主題系列；但同一篇最多兩個閱讀路徑。

## Publication Sequence

1. 建全球入口草稿，先定共同欄位與公開程度分級。
2. 將既有 Stanford 地圖掛入全球傘狀系列，作為格式基準。
3. 補查 CMU、MIT、Berkeley 的官方 catalog、當期課表與課程網站，再掃描 CSDIY 對應頁與推薦學期，完成三張雙軌 source matrix。
4. 依序發布 CMU、MIT、Berkeley 課程地圖；不要求每張地圖都延伸單課文章。
5. 第一批單課只從 A2／A3 課程挑選；若三校都沒有足夠材料，第一季可以零篇單課深讀並改連既有 Stanford 或其他公開課。
6. 第一季結束後，按選校 rubric 決定 ETH、Tübingen、NUS、東京大學或 Edinburgh 誰進第二季。

建議節奏：每週一篇地圖或深讀。最低可行版本是全球入口＋既有 Stanford＋CMU 地圖＋MIT 地圖；單課深讀不是最低版本的必要條件。

## Implementation Steps

1. 在研究目錄新增每校 source matrix，欄位至少包括 current catalog、current schedule、prerequisites、materials、assignments、recordings、last verified、status。
2. 在 `src/utils/series.ts` 登記「世界名校 AI／CS 課程地圖」及新增的校內分冊名稱；中英文 slug 共用，若暫無英文稿仍先保留名稱映射。
3. 用 `post` skill 建全球入口與各校課程地圖草稿，依本文模板限制範圍。
4. 只在來源矩陣全綠且 access label 至少 A2 後建立單課深讀；每篇完成後分別跑 `post-review` 與 `post-verify`。
5. 更新 Stanford 地圖的 `additionalSeries` 與跨系列內鏈；不改既有 `series`、slug、date 或正文主張。
6. 每批發布前跑 references、series order、lang parity，最後跑唯一品質閘門 `pnpm verify`。

## Acceptance Criteria

- 全球入口只收學校地圖，目前傘狀系列 order 0–5（全球入口、Stanford、CMU、MIT、Berkeley、Harvard）無缺號或重號。
- Stanford 現有主系列名稱與篇序完全不變，只新增傘狀系列歸屬。
- 每張學校地圖至少有一條可由官方來源重建的先修路線，且每條邊都能指出來源。
- 每門課都完成七欄公開資源 audit 與 A0–A3 標記；A0／A1 不得標為可完整自學，A0 不得獨立成單課文章。
- 所有課程狀態帶學年與查證日；無法確認當期開課者清楚標為歷史材料。
- 各校地圖正文詳寫課程不超過 12 門，並提供至少三種不同目標的路線。
- 每篇至少連回全球入口、校內地圖或對應學位文章中的兩者。
- `post-review` 無 blocking issue、`post-verify` 無未解關鍵事實、`pnpm verify` 全綠。

## Risks and Mitigations

- 風險：範圍快速膨脹。緩解：一季最多新增三校，先地圖、再由資料完整度決定單課。
- 風險：課號與開課狀態過期。緩解：課號、catalog、當期 schedule 三方對照，文首標示查證學期。
- 風險：MIT OCW 等舊教材被誤寫成現行課。緩解：把「現行正式課」與「可用歷史教材」拆成兩欄。
- 風險：和學位系列重複。緩解：學位文只談制度與申請，課程文只談先修、教學與自學可用性。
- 風險：Stanford 的公開程度被誤認為所有學校的標準。緩解：課程地圖不要求公開課；用 A0–A3 明確區分「看得到課表」與「真的能自學」。
- 風險：CSDIY 舊連結被誤認為目前仍有效，或第三方鏡像被當成官方公開。緩解：官方現況與 CSDIY 歷史路線分欄；每篇鎖定具體學期，直接測試所有核心材料，泛用網址只作搜尋入口。
- 風險：為了追最新而選到尚未發布材料的學期，文章只剩課名摘要。緩解：採「最近完整學期」而非「日期最大學期」；新學期核心材料實際上線後再更新版本。

## Verification Steps

1. `rg -n '世界名校 AI／CS 課程地圖|additionalSeries|series:' <series files>` 檢查傘狀與校內分冊歸屬。
2. `pnpm check:series-order` 檢查各系列篇序。
3. `pnpm check:references` 與 `post-verify` 檢查所有「現行／停開／可自學」判斷，並確認 CSDIY 沒被用來單獨支撐當期開課或授權主張。
4. `pnpm check:lang-parity` 檢查已發布雙語稿的名稱與篇序。
5. `pnpm verify` 作最終品質閘門。

## Default Decisions

- 系列名稱改為「世界名校 AI／CS 課程地圖」，避免暗示每間學校都有公開課；學校入選靠資料與路線辨識度，不靠排名。
- 第一季新增 CMU、MIT、Berkeley；Stanford 作既有第一站。
- 先寫中文；英文版以一個學校分冊為單位整批翻譯。
- 第一季先驗證「學校地圖」是否有讀者需求，再擴寫大量單課深讀。
