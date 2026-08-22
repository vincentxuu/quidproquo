# Stanford CS 逐課逐講系列重整計畫

## Requirements Summary

- 目標：把目前的 Stanford CS 內容從「1 篇地圖＋16 篇一門課一篇」改成「1 個總入口＋每門課各自一個、比照 CS230 的逐講系列」。
- 「比照 CS230」的明確定義：一篇對應一個官方 lecture／week 單位；依講者或課程團隊的 agenda 完整覆蓋，不挑一條方便發揮的主線取代原課程；中文與英文成對發布；每篇標示課程版本、日期、來源與材料缺口。CS230 已確認採 1:1 講次與雙語，且先建逐講研究筆記再寫稿。[CS230 計畫](../../docs/content-plan-cs230.md:3)
- 既有單課深讀不刪除、不改 slug、不改 `date`；它們成為各自 course series 的「總覽／閱讀順序 1」，逐講文從閱讀順序 2 開始；官方 Lecture 編號另行保留，避免頁面顯示 `0 / N`。
- `/series/stanford-cs/` 保留為總入口，只收地圖與每門課的一篇代表總覽，不直接混入所有 lecture 文章。
- Stanford 範圍鎖定現有 16 門：CS103、CS107、CS109、CS111、CS161、CS221、CS124、CS229、CS228、CS224N、CS224U、CS224V、CS224W、CS329Z、CS336、CS329A；既有 CS230 與 CS146S 也掛回同一總入口，共 18 個 course series。CS230 已達逐講標準；CS146S 現有 10 篇是未開課 syllabus 的逐週整理，並非 20 個實際 sessions 的逐講材料，因此仍列待補。
- 預設雙語同步，因為現有 16 篇總覽與 CS230 都已有 zh-TW／en 配對；若未來要改成先中文後英文，需另做編輯決策，不在執行時自行降級。
- 本計畫只規劃，不授權 production deploy、已發布 slug/date 變更、治理腳本修改或超過 20 檔的批次執行。

## Current-State Evidence

- 現在每篇文章只有一個 primary `series`，另有可選的 `additionalSeries`；兩者都會被系列列表與篇內導覽讀取。[內容 schema](../../src/content.config.ts:41) [系列導覽](../../src/utils/seriesNav.ts:17)
- 系列頁目前只是把同一系列的文章平鋪成 `PostCard`，沒有 parent／child course series 概念。[系列頁](../../src/pages/series/[series].astro:27)
- `Stanford CS 主線課程導讀` 沒有正式登記在 `SERIES_DEFINITIONS`，所以目前靠名稱 slugify 成 `stanford-cs`，介紹文案退回 `${name} 系列文章`。[系列 fallback](../../src/utils/series.ts:263)
- CS230 已有正式 slug、中英文名稱與逐講定位。[CS230 definition](../../src/utils/series.ts:118)
- 現有 Stanford 地圖是 master series order 1；其餘 16 篇以 order 2–17 排列。[地圖 frontmatter](../../src/content/posts/learning/2026-08-20-stanford-cs-course-map.md:13)
- 舊的全球課程計畫明定「單課深讀不逐週抄 syllabus」並讓 Stanford 維持平面系列；這與使用者的新要求衝突。本計畫在 Stanford 範圍內明確取代該決策，但不改 CMU／MIT／Berkeley 規劃。[舊計畫](./global-ai-cs-course-guide-series-plan.md:148)
- 現行 `check:series-order` 只檢查 primary `series`，沒有檢查 `additionalSeries` 或父子系列關係。[series order checker](../../scripts/check-series-order.mjs:14)

## Target Information Architecture

```text
/series/stanford-cs/                         Stanford CS 總入口（地圖＋18 門代表總覽）
├─ 課程地圖文章                              保留既有 URL
├─ /series/stanford-cs103/                  CS103 總覽＋Lecture 1..N
├─ /series/stanford-cs107/                  CS107 總覽＋Lecture 1..N
├─ /series/stanford-cs109/                  CS109 總覽＋Lecture 1..N
├─ /series/stanford-cs111/                  CS111 總覽＋Lecture 1..N
├─ /series/stanford-cs161/                  CS161 總覽＋Lecture 1..N
├─ /series/stanford-cs221/                  CS221 總覽＋Lecture 1..N
├─ /series/cs230/                           既有 CS230 逐講系列
├─ /series/cs146s/                          既有 CS146S 逐週系列
└─ 其餘 CS124 / 228 / 229 / 224* / 329* / 336
```

### Series membership model

優先復用現有 `series`＋`additionalSeries`，不新增 hierarchy schema：

- 每門課的總覽與逐講文以該 course series 為 primary `series`，因此卡片 badge 與上下篇只留在同一門課。
- 只有每門課的一篇代表總覽加入 `additionalSeries: Stanford CS 主線課程導讀`；總入口因此維持 1 篇地圖＋18 門課代表卡，不會被數百篇 lecture 灌滿。
- 16 篇既有單課文章就是代表總覽；CS146S 使用既有 course-map 首篇；CS230 暫以 Lecture 1 作代表卡，不為了形式新增內容空洞的 gateway post。
- 正式在 `src/utils/series.ts` 登記 master 與所有 course series 的固定 slug、中英文名稱和說明。
- 既有 `/series/cs230/`、`/series/cs146s/` 不改；其他新 course series 固定使用 `stanford-csNNN`，避免未來其他學校出現相同課號時碰撞。
- 這套模型已被 schema 與 runtime 支援；需要補的是 `additionalSeries` 的順序驗證，不是再造一套父子 registry。[內容 schema](../../src/content.config.ts:41) [系列 membership](../../src/utils/seriesNav.ts:17)

## Editorial Contract: What “Like CS230” Means

每個 course series 在寫第一篇 lecture 前，必須先有 `docs/content-plan-stanford-csNNN.md` 與 `.work/stanford-csNNN-notes/`：

1. 鎖定一個明確學期／版本，不把不同年份材料拼成彷彿同一輪；若只能使用歷史公開版，系列名稱與每篇開頭都標示年份。
2. 建 `SOURCES.md`，逐講列出 official schedule、講義／投影片、錄影、作業、閱讀材料、材料年份與存取狀態。
3. 一篇對應官方的一個 lecture／week；只有官方明確把兩堂視為同一單元，或單堂材料不足以形成文章時才合併，並在 content plan 留下理由。`series.order` 一律使用連續閱讀序號，官方 Lecture 編號另寫在標題與 manifest；現有 prev/next 只尋找 `order ± 1`，不能用缺號表達停課。[系列導覽](../../src/utils/seriesNav.ts:31)
4. 正文照該講 agenda 完整走；站內已有重複主題仍需完整交代，再用內鏈導向更深文章。這沿用 CS230 修正後的規則。[CS230 編輯契約](../../docs/content-plan-cs230.md:21)
5. 標題格式：`官方 Lecture 標題：具體觀點副標`；不得只寫抽象 SEO 標題。
6. 每篇開頭固定標示：課程代碼、學期、lecture 編號／日期、講者、官方材料連結、公開材料缺口。
7. 事實與評註分層：課程內容是正文；作者補充集中在 `## 延伸`，不能把延伸取代課程原內容。
8. 每篇中文目標 6,000–9,500 字元；材料本身很短時不灌水，低於門檻需在 plan 記錄原因；超過 11,000 字元才考慮按官方 agenda 拆成上下篇。
9. 每篇完成 `post-review` 與 `post-verify`，尤其自動字幕中的人名、數字、論文、版本與講者歸屬不得直接採信。
10. zh-TW／en 使用相同 course version、lecture order、來源集合與章節骨架；翻譯不能另做一篇內容不同的文章。

## Material-Fidelity Gate

「每門課都要逐講」不等於可以捏造缺失內容。每門課先按 lecture 層級做材料盤點：

| 等級 | 逐講材料 | 執行方式 |
|---|---|---|
| L3 | 每講至少有錄影或完整講義，且 schedule／作業可對齊 | 可直接做完整逐講系列 |
| L2 | 多數講次有投影片／notes，少數缺失 | 逐講寫；缺失講明列資料缺口，不用別年內容偷補 |
| L1 | 只有週次標題或閱讀清單，缺少實質講授材料 | 暫不寫 lecture 正文；先保留總覽並建立待補 manifest |
| L0 | 只有 catalog／課名 | 不拆講；master 頁標示「無公開逐講材料」 |

- 使用者要求的最終目標是 18 門都成為逐講／逐週系列；目前只有 CS230 達成。L0／L1 是課程的「阻塞狀態」，不是永久降級成一篇總覽。
- 不同年份材料只有在 series 明確改名為該歷史版本時才可使用；例如當期 CS229 與 Stanford Engineering Everywhere 舊版不能混寫成同一輪。
- 研究階段產出 18 門 manifest；CS230 是完成基準，另外 17 門待擴寫或等待材料。官方來源盤點得到：234 篇／語言可直接進 research／writing；CS228 historical provenance 與 CS229 historical fallback 若核准可再加 30；CS146S、CS329Z、CS329A 與 CS336 一場 guest 共 57 篇目前阻塞。最終上限約 321 篇／語言，即約 642 個新 Markdown 檔。

### Existing evidence readiness snapshot

這只是 plan sizing，不代替 Phase 1 的正式 manifest：

| 課程 | 初步單元量 | 已知限制 |
|---|---:|---|
| CS103 | 15（summer）或 28（spring） | 不同學期差異大，先選 canonical offering。[既有導讀](../../src/content/posts/learning/2026-08-21-stanford-cs103-math-foundations.md:121) |
| CS107 | 26 lectures | Winter 2026 正規學期 calendar／slides／labs 完整；starter code／video 受限。既有導讀的約 18 是壓縮 summer offering。[既有導讀](../../src/content/posts/learning/2026-08-21-stanford-cs107-computer-systems.md:132) |
| CS109 | 約 27 lectures | Spring 2026 schedule／navbar 對 27／28 的編號有衝突，manifest 必須先修復；reader／worksheets 公開。[既有導讀](../../src/content/posts/learning/2026-08-21-stanford-cs109-probability.md:126) |
| CS111 | 28 lectures | lecture PDFs 公開，適合早期樣板。[既有導讀](../../src/content/posts/learning/2026-08-21-stanford-cs111-operating-systems.md:168) |
| CS161 | 18 lectures | notes／slides 公開。[既有導讀](../../src/content/posts/learning/2026-08-21-stanford-cs161-algorithms.md:12) |
| CS221 | 20 lectures | Autumn 2025 executable notes、official videos 與 8 assignments 公開。[既有導讀](../../src/content/posts/ai/2026-08-21-stanford-cs221-ai-principles.md:170) |
| CS124 | 約 10 weeks | 當期 video 受限；公開 YouTube 對應舊 syllabus。[既有導讀](../../src/content/posts/ai/2026-08-21-stanford-cs124-languages-to-information.md:165) |
| CS228 | 約 10 weeks／16 chapters | notes 完整但沒有 recordings／assignments。[既有導讀](../../src/content/posts/ai/2026-08-21-stanford-cs228-graphical-models.md:54) |
| CS229 | current count unavailable | Summer 2026 現行頁不公開 syllabus／講次，是 L0；Fall 2025 archive 有 20 講但 materials gated；Fall 2020 可作明確標年的 L2 歷史 fallback，需另決策且不能混用。[既有導讀](../../src/content/posts/ai/2026-08-21-stanford-cs229-machine-learning.md:160) |
| CS224N | 19 regular lectures | Winter 2026 slides／readings 多數公開、video gated；2024 public videos 是錯的學期。[既有導讀](../../src/content/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning.md:44) |
| CS224U | 7 thematic bundles | Spring 2023 slides／notebooks／GitHub 公開；Spring 2027 尚無材料，應做明確歷史系列。[既有導讀](../../src/content/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding.md:157) |
| CS224V | 14 lectures | 有多屆公開材料，2026 改名使 offering identity 需先鎖定。[既有導讀](../../src/content/posts/ai/2026-08-21-stanford-cs224v-agentic-ai.md:90) |
| CS224W | 19 lectures | Fall 2025 slides／assignments 公開，videos gated；2021 public videos 不對齊。[既有導讀](../../src/content/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs.md:173) |
| CS329Z | 19 planned content meetings | Fall 2026 尚未開課且 materials 未釋出，目前 L1、0 篇可發布。[既有導讀](../../src/content/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents.md:144) |
| CS336 | 19 meetings | Spring 2026：L1–17 有 artifacts／videos，Dan Fu guest 有影片，Daniel Selsam guest 無材料；嚴格每堂為 18 可寫＋1 blocked。[既有導讀](../../src/content/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch.md:181) |
| CS329A | 17 content sessions | Autumn 2025 只有 10 sessions 的 readings，沒有 slides／recordings；目前 L1，不能宣稱 9 講可直接寫。[既有導讀](../../src/content/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents.md:155) |

## Course Inventory and Rollout Order

### Wave 0 — 結構樣板，不新增 lecture 內容

- 正式登記 `stanford-cs` 與缺少的 16 個 course definitions；沿用既有 CS230／CS146S definitions。
- 將 16 篇既有單課文章改掛各自 course series，order 設為 1；原 URL、date、正文保留。
- 透過 `additionalSeries` 把 18 門代表總覽掛回 Stanford CS；CS230／CS146S 現有 primary order 完全不動，但 CS146S completion 保持 L1／pending。
- 補 course-series membership、額外系列順序與中英文映射的自動測試；不在這一 wave 新增 lecture 內容。

### Wave 1 — 地基五門

1. CS103
2. CS107
3. CS109
4. CS111
5. CS161

理由：它們是既有地圖明確定義的核心骨架，也是下游課程的先修；完成後可驗證「數學／系統／機率／OS／演算法」五種不同教材形態是否都能套用同一契約。[地圖文章](../../src/content/posts/learning/2026-08-20-stanford-cs-course-map.md:42)

### Wave 2 — AI 主幹

1. CS221
2. CS230（既有，作為基準回歸驗證）
3. CS336

理由：先完成有 L2／L3 證據的 AI 入門、深度學習與 language modeling 主軸；CS229 current 是 L0，不在生產 wave 裡假裝可寫。

### Wave 3 — NLP／agent／圖分支

1. CS124
2. CS224N
3. CS224U
4. CS224V
5. CS224W
6. CS329Z
7. CS329A

### Wave 4 — 停開或材料不足課

1. CS228
2. CS229（current L0；若要採 Fall 2020 historical fallback，另做 offering 決策）
3. CS146S（等 Fall 2026 sessions 與材料實際發布）
4. CS329Z
5. CS329A
6. CS336 Daniel Selsam guest session
7. 任何在 manifest 被評為 L0／L1 的課

這一 wave 不是降低優先級後忘記，而是等找到可被明確定年的官方完整版本，再以「歷史某學期逐講系列」發布。

## Implementation Steps

### Phase 1 — Inventory and contracts

1. 建立 `.research/stanford-cs-course-series-inventory.md`，18 門各列：target term、lecture count、official schedule、video、slides／notes、assignments、readings、access、material fidelity、last verified；CS230 標記 complete，CS146S 標記 future／L1。
2. 為每門課建立或排定 content plan；先完成 Wave 1 的五份 plan，再開始任何 lecture 稿。
3. 在每份 plan 鎖定官方講次清單與預計檔名；總覽 `series.order: 1`，lectures 從 2 起使用連續閱讀序號，官方編號／停課缺號另存在 manifest 與正文。
4. 以 audit 結果計算總篇數、雙語檔案數與批次大小；達到 >20 檔前提交執行批次給使用者確認。

### Phase 2 — Series membership implementation

5. 修改 `src/utils/series.ts`，補齊 `stanford-cs` 與 course series 的正式雙語名稱、說明和固定 slug；不改 `SeriesDefinition` schema。
6. 系列頁優先維持現有 `PostCard` 平鋪：master 只會收到地圖與 18 篇代表總覽，course series 只收到該課總覽與 lectures；除非 smoke test 證明資訊不足，否則不改 Astro 頁面。
7. 新增 targeted tests，覆蓋：primary／additional membership、master ordering、zh/en slug mapping、普通系列無回歸、CS230／CS146S URL 不變、course count 只計該課文章。
8. 保留英文文章既有 canonical route `/posts/...-en`，並補 bilingual navigation test；2026-08-21 現站驗證 `/posts/...-en` 為 200、`/en/posts/...` 為 404，不新增錯誤的 `/en` 前綴。[文章導覽](../../src/pages/posts/[...slug].astro:263)
9. 擴充 `scripts/check-series-order.mjs` 讓它同時檢查 `additionalSeries`，屬治理腳本變更，執行前另取明確同意；未獲同意時以獨立 targeted test 驗證 umbrella order，不弱化現有 gate。
10. Wave 0 的程式與驗證器 diff 完成後，以 `/dev:review` 開乾淨 context 審查；開發 session 不自審。

### Phase 3 — Existing content migration

11. 將 16 組 zh/en 單課總覽的 primary series 改成各自 course series、order 1；不改 slug／date。
12. 更新總覽文章開頭，明確標示它是系列總覽，並加入 course series 連結；一次只做一門課的 zh/en pair，避免 32 檔機械批改失控。
13. 更新 Stanford 地圖中的課程連結，指向 course series，而不是只指向單篇總覽；保留總覽文章作為系列閱讀順序 1。
14. 確認 CS230／CS146S 的代表卡指向既有 course series，所有現有文章與上下篇導覽保持不變。

這個 migration 的明確治理批次是 **36 個既有 Markdown 檔**：16 門現有課程總覽的 zh/en pair，加上 CS230 Lecture 1 與 CS146S course map 的 zh/en representative pair。Stanford master map 自己維持 order 1，不計入這 36 檔。批次只改 series frontmatter／必要的系列入口文字，不改 slug、date 或外部 URL。

### Phase 4 — Per-course research and writing

15. 每門課依序執行：source manifest → 逐講 notes → 中文稿 → `post-review` → `post-verify` → 英文稿 → parity 檢查。
16. 每完成一門課才開始下一門；同一門課可把獨立 lecture 研究並行化，但 source manifest、術語、版本與系列隱藏主軸由單一 owner 統一。
17. 每批最多 10 篇內容檔（例如 5 個 lecture 的雙語稿）；批次內跑 targeted checks，wave 結束跑完整 `pnpm verify`。
18. L0／L1 課只完成 research artifact 與 blocker 記錄，不發布推測性 lecture 文章。

### Phase 5 — Completion and handoff

19. 每個 course series 完成後，在研究 inventory 記錄 `完成篇數／官方講次數`，兩者相同才標示 complete；缺公開材料則標 blocked，不以總覽篇冒充完成。是否把進度顯示到公開卡片留作後續產品決策，不塞進本輪必要範圍。
20. 更新既有全球課程計畫的 Stanford 段落，標記已由本計畫取代；CMU／MIT／Berkeley 決策不變。
21. 依 repo 協定更新 `progress.txt`／archive，最終以 `pnpm verify` 全綠和所有公開 URL smoke test 作停止條件。

## Acceptance Criteria

### Architecture

- `/series/stanford-cs/` 顯示地圖與 18 門代表總覽，順序與課程地圖一致；不平鋪 lecture 文章。
- 每個 course series 有固定 slug、中英文名稱與非 fallback 說明；頁面 metadata 不再出現「`${name} 系列文章`」。
- CS230 保持 `/series/cs230/`、CS146S 保持既有 slug，現有篇序與 URL 完全不變。
- 其他非 Stanford series 的文章數、排序、URL 與頁面 DOM 結構沒有回歸。

### Content

- 每門課在第一篇 lecture 發布前都有 target term、官方 lecture manifest、來源矩陣與 material-fidelity 等級。
- 每篇 lecture 對應 manifest 中恰好一個官方單元，或有書面合併理由；不得漏掉官方 agenda 的主要段落。
- 每篇包含課程版本、lecture 編號／日期、講者、至少一個有效官方來源與材料缺口聲明。
- 每個 zh/en pair 的 `series.order`、course version、章節骨架與來源集合一致。
- course series 的 complete 狀態可由 manifest lecture count 與已發布 lecture count 機械比較；既有總覽 ID 不計入 lecture completion。CS230 complete；CS146S 的既有週文不等於 Fall 2026 session completion。

### Governance and quality

- 不改任何既有 slug 或 `date`；若未來確實需要，另走 Tier 2 同意。
- 每個 >20 檔批次在執行前取得明確同意；計畫本身不視為批次執行授權。
- 若修改 `scripts/check-series-order.mjs`，必須先取得治理腳本變更同意，且只加強檢查、不降低現有門檻。
- 每篇通過 `post-review`、`post-verify`、`pnpm check:references`；每批通過 `pnpm check:series-order`、`pnpm check:lang-parity`；每 wave 通過 `pnpm verify`。

## Verification Steps

1. Unit／utility：對 series helper 測 primary／additional membership、umbrella ordering、語言名稱與固定 slug。
2. Build integration：執行 `pnpm build`，確認 master／course static paths 生成成功且沒有重複 route。
3. Content structure：以 script 比較每個 manifest 的 lecture IDs 與 frontmatter order，報告 missing、duplicate、unexpected。
4. Bilingual parity：執行 `pnpm check:lang-parity`，另檢查 zh/en 的 `additionalSeries.order` 與 series definition 映射完全相同。
5. Series order：執行 `pnpm check:series-order`；若 additional-series checker 尚未獲准修改，另跑 targeted membership test。
6. References：執行 `pnpm check:references`，每篇再依 skill 執行 `post-verify`。
7. URL smoke：至少檢查 `/series/stanford-cs/`、18 個 course series、每門課總覽、CS230／CS146S 第一與最後一篇，以及 zh/en switchHref。
8. Final gate：執行唯一品質閘門 `pnpm verify`；任何紅燈修真問題，不繞過。

## Risks and Mitigations

- **規模上限約 642 個新內容檔。** 先完成 18 門 manifest；目前 468 檔可直接研究／寫作，60 檔取決於 CS228／CS229 歷史 offering 決策，114 檔等待 CS146S／CS329Z／CS329A／CS336 guest 材料；以每批最多 10 個內容檔、每 wave 一次總驗收控制風險。
- **很多課沒有 CS230 等級的公開錄影。** 以完整 notes／slides 也可逐講，但 L0／L1 不寫推測稿；系列清楚標 blocked。
- **不同學期拼接造成虛構課程。** 每個 series 鎖定 target term；歷史材料另命名、另說明，不和當期混合。
- **同課術語與主張跨篇漂移。** 每門課先定 glossary、source manifest、講者表與隱藏主軸，再平行處理 lecture。
- **umbrella membership 可能影響全站系列排序。** 復用現有 `additionalSeries` code path，不改系列頁模板；以 CS230、CS146S 與非 Stanford 系列做回歸測試。
- **舊計畫與新計畫互相矛盾。** 本計畫只覆寫舊全球計畫的 Stanford 單課粒度；執行時在舊檔加 superseded note，不默默保留兩套規則。
- **文章只是在重述 syllabus。** 編輯契約要求完整 agenda、作業／講義細節、材料缺口與獨立延伸，但延伸不得取代課程內容。
- **並行寫稿造成雙語或事實分叉。** 同一 course 由單一 owner 整合；research 可並行，發布前逐篇做 clean-context review 與 parity check。

## Stop Condition

本規劃階段在以下條件成立時停止：計畫檔完成、現況與目標架構有檔案證據、執行 phases／批次／驗收可操作，且未修改內容或 production。實作階段只有在 18 門 course inventory 全部建立、17 門待擴寫課程中所有可取得 L2／L3 材料的官方講次都有雙語文章、L0／L1 阻塞逐門留有證據、所有系列頁可瀏覽且 `pnpm verify` 全綠時才算完成。

## Decisions Requiring Explicit Approval Before Execution

1. **Wave 0／既有內容 migration 超過 20 檔**：需使用者核准具體檔案清單與批次。
2. **治理腳本修改**：若要讓 `check:series-order` 原生檢查 `additionalSeries`，需另行核准。
3. **任何既有 slug／date 變更**：本計畫預設完全不做；若遇到不可避免情況，單獨提案。
