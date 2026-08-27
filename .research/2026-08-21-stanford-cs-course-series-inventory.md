# Research: Stanford CS 逐課逐講系列 inventory

- 查證日期：2026-08-21
- 目的：在改文章前，鎖定 18 門 Stanford 課程的 canonical offering、公開材料、逐講單位與可交付規模。
- 編輯基準：`docs/content-plan-cs230.md` 的 1:1 講次、雙語、完整 agenda 契約。

## 子問題

1. 每門課應鎖定哪一個明確學期／版本，才不會把不同年份材料拼成虛構課程？
2. 官方逐講材料實際公開到錄影、notes、slides、作業、閱讀清單的哪一層？
3. 一篇應對應 lecture、week 還是 chapter；每門課可被證據支持的篇數是多少？
4. 哪些課目前只能標記缺口，不能達到 CS230 等級的逐講內容？

## 判定標準

| 等級 | 判準 | 可執行內容 |
|---|---|---|
| L3 | 每個單元有錄影或完整講義，且 schedule／作業可對齊 | 完整逐講系列 |
| L2 | 多數單元有 notes／slides，少數缺失 | 逐講系列，缺失單元明列 gap |
| L1 | 只有週次標題／閱讀清單，缺實質講授材料 | 暫停正文，只保留 manifest |
| L0 | 只有 catalog／課名 | 不拆講，等待官方材料 |

## Repo 現況（已完整讀取）

| 事實 | 證據 | 狀態 |
|---|---|---|
| Stanford master 目前是 1 篇地圖＋16 篇單課總覽，zh/en 各 17 篇 | `src/content/posts/**/2026-08-{20,21}-stanford-*.md` frontmatter | ✅ 一手／repo 全文 |
| CS230 已有 9 篇／語言，CS146S 已有 11 篇／語言 | series frontmatter 與 `src/utils/series.ts` | ✅ 一手／repo 全文 |
| CS230 content plan 明定 1:1 講次與雙語 | `docs/content-plan-cs230.md` | ✅ 一手／repo 全文 |
| `additionalSeries` 已參與系列列表與篇內導覽 | `src/content.config.ts`、`src/utils/seriesNav.ts` | ✅ 一手／repo 全文 |
| 現行 series-order checker 只檢查 primary series | `scripts/check-series-order.mjs` | ✅ 一手／repo 全文 |
| 英文文章 canonical route 是 `/posts/...-en`；`/en/posts/...` 現站回 404 | `src/pages/posts/[...slug].astro`＋2026-08-21 production HEAD check | ✅ repo＋現站驗證 |

### Existing baselines

| Course series | zh-TW | en | Reading order | Baseline status |
|---|---:|---:|---|---|
| CS230 | 9 | 9 | 連續 1–9；官方沒有 Lecture 7，但公開稿不以缺號破壞導覽 | 已有逐講系列，待官方來源 audit 確認是否仍是 canonical offering |
| CS146S | 11 | 11 | course map 1＋十週內容 2–11 | 現有內容是 syllabus-based 週摘要；Fall 2026 尚未開課，未達逐 session 完成標準 |

## 課程 inventory

所有數量以 canonical offering 的官方 schedule 為準；`新檔` 是逐講文章 × zh/en，不含既有總覽 pair。

| Course | Canonical offering | Unit | Count | Public evidence | Gap | Level | New files |
|---|---|---|---:|---|---|---|---:|
| CS103 | Spring 2026 `cs103.1266` | lecture IDs 00–27 | 28 | 每講 public slides；完整 manifest | Panopto／Canvas gated | L3 | 56 |
| CS107 | Winter 2026 `cs107.1264` | lecture IDs 01–26 | 26 | calendar、每講 slides、labs | videos、lecture code、starter repos gated | L3 | 52 |
| CS109 | Spring 2026 `cs109.1266` | lecture | 約 27 | reader、schedule、worksheets | schedule／navbar 有 27／28 編號衝突；psets/videos gated | L2 pending repair | 約 54 |
| CS111 | Spring 2026 `cs111.1266` | lecture IDs 1–28 | 28 | calendar＋全部 lecture PDFs | 無影響逐講的主要缺口 | L3 | 56 |
| CS161 | Winter 2026 | lecture IDs 1–18 | 18 | notes、slides、homework、notebooks | video gated；EthiCS 是額外 session | L3 | 36 |
| CS221 | Autumn 2025 | lecture 1–20 | 20 | executable lecture repo、official Stanford Online videos、8 HWs | L19 artifact 是 Google Slides，需固定引用 | L3 | 40 |
| CS229 | Summer 2026 current | current count unavailable | 未知 | current homepage／access statement | 無公開 syllabus 或逐講材料；Fall 2020 的 20 講只能作另行核准的 historical fallback | L0 blocked | 0 ready／40 conditional |
| CS230 | Autumn 2025 | 9 actual sessions | 9 | syllabus、playlist、slides；既有 zh/en 各 9 | `/lecture/` 誤標 Fall 2018；L7 是 no-class | L3 complete | 0 |
| CS336 | Spring 2026 | 19 scheduled meetings | 19 | L1–17 artifacts／videos、Dan Fu guest video、5 assignments | Daniel Selsam guest session 無公開材料 | L2 | 36 ready／2 deferred |
| CS124 | Winter 2026 | week 1–10 | 10 | schedule、slides、readings、GitHub PAs | prerecorded videos Canvas；5 live lectures/labs 未錄 | L2 | 20 |
| CS228 | Winter 2017–18 historical candidate | week 1–10 | 10 | historical schedule＋living notes | HOLD：living notes 為 16 chapters 且版本／provenance 未固定；近期 offering 無 public manifest | L2-volume, provenance pending | 20 conditional |
| CS224N | Winter 2026 | regular lecture | 19 | current slides／readings 多數公開 | videos Canvas；2024 public videos 是別的學期 | L2 | 38 |
| CS224U | Spring 2023 historical | thematic bundle | 7 | slides、notebooks、GitHub 完整 | Spring 2027 尚無材料；不能把 blank M/W dates 當 lectures | L3 historical | 14 |
| CS224V | Fall 2025 historical | instructional unit | 14 | 14 組 linked slides | slides 明說省略重要細節；recordings Canvas；Autumn 2026 `Agentic AI` 尚無 manifest | L2 historical | 28 |
| CS224W | Fall 2025 | lecture 1–19 | 19 | current slides、assignments | videos Canvas；2021 public videos 不對齊；Autumn 2026 頁尚未換料 | L2 | 38 |
| CS329Z | Fall 2026 future | planned content meeting | 19 | tentative titles／readings | 尚未開課，materials promised later；目前 0 篇可寫 | L1 blocked | 38 deferred |
| CS329A | Autumn 2025 | 17 content sessions（20 IDs 扣 3 midterms） | 17 | 其中 10 sessions 有 readings | 無 slides／recordings，不能忠實重建 lecture | L1 blocked | 34 deferred |
| CS146S | Fall 2026 future | 10 weeks × 2 sessions | 20 | syllabus titles；既有站內 course map＋10 weekly summaries | 2026-09-22 才開課，尚無 lecture artifacts | L1 blocked | 40 deferred |

### Scope totals

- 確定可由 L2／L3 offering 支持：234 posts／語言，約 **468 個新 Markdown 檔**。
- 需先做 historical offering／provenance 決策：CS228 10＋CS229 20＝30 posts／語言，約 **60 個條件式新檔**。
- 材料待發布或單堂缺料：CS329Z 19＋CS329A 17＋CS146S 20＋CS336 guest 1＝57 posts／語言，約 **114 個後續檔**。
- 最終上限：321 posts／語言，約 **642 個新 Markdown 檔**。
- 第一個 production sample 仍建議 CS161：18 講、L3、notes／slides 完整，是最小的正規學期 L3 核心課。

## 讀取完整度盤點

| Course | Official source | 讀取程度 | 阻礙／備註 |
|---|---|---|---|
| CS103 | https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/ | ✅ homepage manifest＋lecture pages | Panopto／Canvas 是校內權限 |
| CS107 | https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html | ✅ calendar／每講 slides／labs | starter repos、videos gated |
| CS109 | https://web.stanford.edu/class/archive/cs/cs109/cs109.1266/schedule.html | ✅ schedule；🟡 linked materials | 頁面自身 lecture numbering 衝突待逐項解 |
| CS111 | https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar | ✅ calendar＋PDF links | 無 |
| CS161 | https://stanford-cs161.github.io/winter2026/lectures/ | ✅ lecture index | recordings 在 Canvas |
| CS221 | https://stanford-cs221.github.io/autumn2025/ | ✅ schedule／notes／assignments | L19 Google Slides 需避免抓取截斷 |
| CS229 | https://cs229.stanford.edu/ | ✅ Summer 2026 current page；https://cs229.stanford.edu/index.html-fall25 ✅ latest completed access statement；https://cs229.stanford.edu/syllabus-fall2020.html ✅ historical option | current 無公開逐講；historical fallback 必須獨立命名與核准 |
| CS230 | https://cs230.stanford.edu/syllabus/ | ✅ syllabus | `/lecture/` 的年份標示與 current syllabus 衝突 |
| CS336 | https://cs336.stanford.edu/ | ✅ Spring 2026 schedule／artifact links；official video playlist | Daniel Selsam guest session 無 artifact |
| CS124 | https://web.stanford.edu/class/cs124/lec/ | ✅ schedule／slides／readings | videos Canvas，live sessions 未錄 |
| CS228 | https://cs.stanford.edu/~ermon/cs228/index.html | ✅ historical schedule；https://ermongroup.github.io/cs228-notes/ ✅ living notes | HOLD：living notes 非 version-pinned，尚未證明可逐週歸屬歷史 offering |
| CS224N | https://web.stanford.edu/class/cs224n/ | ✅ current schedule／slides | videos gated |
| CS224U | https://web.stanford.edu/class/cs224u/ | ✅ Spring 2023 bundles | future Spring 2027 尚無材料 |
| CS224V | https://web.stanford.edu/class/cs224v/schedule.html | ✅ Fall 2025 schedule／slides | Autumn 2026 renamed course 尚未發布 manifest |
| CS224W | https://web.stanford.edu/class/cs224w/ | ✅ Fall 2025 schedule／slides／assignments | public videos 是舊版 |
| CS329Z | https://cs329z.stanford.edu/ | ✅ tentative future schedule | 尚未開課，materials 未釋出 |
| CS329A | https://cs329a.stanford.edu/ | ✅ schedule／readings | 無 lecture artifacts／recordings |
| CS146S | https://themodernsoftware.dev/ | ✅ Fall 2026 syllabus | 尚未開課，無 lecture artifacts |

## 事實交叉表

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| CS107 正規 Winter offering 是 26 講，不是既有 plan 的約 18 | Winter 2026 official calendar | repo CS107 guide 的 summer comparison | ✅；既有 plan sizing 要更正 |
| CS109 有 27／28 的編號衝突 | official schedule | official navbar／reader links | ❌ conflict；逐項 manifest 前不鎖總數 |
| CS229 最新 completed offering 不可匿名逐講 | Fall 2025 official page access statement | Fall 2020 official historical syllabus | ✅；只能選 current L1 或 historical L2，不可混合 |
| CS230 實際 9 堂且沒有 Lecture 7 | official syllabus | repo 9 篇 zh＋9 篇 en | ✅ complete |
| CS336 Spring 2026 有 19 meetings，但目前只可忠實寫 18 篇 | official schedule | official artifact repo／video set | ✅；L1–17＋Dan Fu guest 可寫，Daniel Selsam guest 列 gap |
| CS224V Fall 2025 與 Autumn 2026 是不同命名／內容身份 | Fall 2025 official schedule | Autumn 2026 official catalog/site state | ✅；不能混成同一系列 |
| CS146S 現有週文不是已完成 lecture series | Fall 2026 official 20-session syllabus | repo 10 weekly summaries | ✅；目前 L1 pending |
| CS329A 不是「9 堂公開可直接寫」 | official schedule/readings | repo guide 對 9 支散落錄影的描述 | ❌ material identity conflict；無法把散落影片等同 17 content sessions |

## 我的推論（與事實分開）

| 推論 | 依據 | 可能錯在哪 |
|---|---|---|
| 總入口應只收每門課的一篇代表文章，lectures 只留在 course series | 現有 `additionalSeries` 可同時建立 umbrella 與 primary course path | 若代表文章不是可靠的 course gateway，master UX 可能仍需專用 course card |
| 不能用官方 Lecture 編號直接當 `series.order` | 現有 prev/next 只查 `order ± 1`；CS230 公開稿也採連續 order | 未來若導覽改成按排序相鄰而非 ±1，可以重新考慮 |
| CS161 應作第一門完整 sample | 它是 18 講的正規學期 L3，比其他 L3 核心課短 | CS221 有影片、讀者可能更感興趣；但範圍較大且不適合先驗證系統類文章 |

## 待解問題

- CS109 official schedule 的 27／28 編號衝突逐項解決。
- CS329Z、CS146S Fall 2026 材料何時公開，能否升到 L2。
- CS329A 是否有可被 official schedule 對應的 lecture artifacts；目前沒有。
- CS228 living notes 的版本／provenance 是否能固定到 Winter 2017–18；在此之前保持 HOLD。
- CS229 是否採 Fall 2020 historical series，或等待 future current materials。
- 是否獲准擴充 `scripts/check-series-order.mjs` 檢查 `additionalSeries`。
