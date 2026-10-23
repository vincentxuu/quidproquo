---
name: post
description: Convert a conversation, notes, or experience into a structured Markdown post under a category directory in src/content/posts/ on quidproquo.cc. Use when user says 寫成文章 / 記錄一下 / 寫成介紹文 / 寫成深入介紹 / write post / deep dive, or asks for a new model-family introduction, or pastes notes/transcripts and asks to publish. Do NOT use to edit an already-existing post — use the `post-update` skill instead.
---

# post skill

把任何內容轉換成結構化的雙語 Markdown（zh-TW + en），存到 `src/content/posts/<category>/`，通過格式驗證。**每篇文章一定產出中英兩個檔案，這是一個步驟不是兩個。**

## 模型家族文章（必讀）

介紹「AI 模型家族」／「AI Model Families」系列時，先讀 `references/model-family-contract.md`，辨識家族主篇、總覽／跨家族比較、每日模型卡。家族主篇使用 `templates/model-family.md`；這份專用規格優先於下方一般介紹文骨架。開頭先回答選型問題，版本矩陣放前面，架構解說依家族特色展開。無資料就明示來源未揭露，不用空泛文字或猜測湊格式。

兩版同步寫，中文與英文採各自系列名稱；模型／端點、權重授權／服務條款、官方自報／第三方／本站實測分清楚。新增價格、模型版本、日期或評測先查官方來源；模板的核對日期只有真正查證才填。寫完執行 `node .agents/skills/post/scripts/check-model-family-format.mjs <中英檔案...>`，再跑既有品質閘門。glossary 依需要選填，不能因詞彙欄位而發明新宣稱。

## 觸發方式 → 模板對應

| 使用者語氣 | 對應模板 | 適用 |
|---|---|---|
| 「寫成文章」「記錄一下」「write post」 | `templates/tech-post.md` | 踩坑 / 問題解決 |
| 「寫成介紹文」「寫成深入介紹」「deep dive」 | `templates/tech-deep-dive.md` | 工具 / 技術 / 架構介紹 |
| 「模型家族介紹」「新增模型家族」 | `templates/model-family.md` | 家族主篇（先讀專用規格） |
| 「岩場介紹」「寫一個岩場」 | `templates/crag-guide.md`（英文 `crag-guide-en.md`） | 單一岩場／岩區導覽（先讀專用規格） |
| 其他分類 | `templates/general-post.md` | 自由結構 |

## 支援的分類

`tech` / `ai` / `product` / `marketing` / `learning` / `education` / `policy` / `design` / `career` / `climbing` / `surf` / `film` / `coffee` / `life` / `travel` / `anime` / `investing`

不要自己發明新分類。找不到合適的先問使用者。

## 執行步驟

### 0. 寫前閘門（動筆前必過，先於一切）

先寫一句：**讀者點進來想問什麼、看完能做什麼決定。** 這一句由 agent 根據來源、本站既有文章與讀者的實際用途決定；使用者只給連結也要自行選題，不要求使用者先出題。優先選有可靠證據、具體範例、能補足既有內容的角度，不因來源剛發布就直接改寫。再列大綱，大綱每節都要能回答這一句；只服務「我做過什麼工作」的節，砍掉或降成附錄。

文章照讀者問題排，不照工作量排。研究時讀了多少、查了多少，是過程，不是文章的形狀。

模型家族依上方專用規格；其他介紹文（導讀、工具介紹、課程介紹）固定骨架：

1. 是什麼
2. 給誰／先備知識
3. 內容地圖（按主題，不按品質）
4. 一個具體範例
5. 限制
6. 怎麼用

「研究過程不進門面」規則見 `references/writing-guide.md#研究過程不進門面`。正文同樣適用：查證後的事實直接寫，會改變讀者做法的限制併進用到的段落，查證過程（日期、404、沒查到、核對清單）存 `.work/<slug>/evidence.md`，見同一節的「查證過程不寫進正文」；`node scripts/check-process-leak.mjs <post.md>` 在 pre-commit 擋下被暫存的文章。

「但書與歸因不堆疊」見 `references/writing-guide.md#但書與歸因不堆疊`：查證報告說「作者概括未標示」時，刪掉、改成來源原意或直接寫成主張，不逐句補「這是我的判斷」。同一支檢查器超過 3 處就擋。

### 0a. 系列文章閘門（文章帶 `series`，或要在 `src/utils/series.ts` 登錄新系列時）

1. **先有規劃表再寫第一篇。** 新系列先跑 `series-curriculum-design`，把規劃表存成 `.work/series-plans/<series-slug>.md`，使用者確認後寫上 `使用者確認：YYYY-MM-DD`。`check:series-plan` 會擋沒有規劃表的新系列。
2. **入口是入門，不是事件。** order 0（或 1）是總覽：這個領域是什麼、整個流程長什麼樣、系列每篇在流程的哪裡、讀完能做到什麼。單篇事件文、查證文、新聞評論不能事後改標成第 0 篇；要收進系列就放到能看懂它的位置（通常是附錄）。
3. **先寫總覽＋第 1 篇給使用者看，再往下寫。** 沒有人即時看的工作（雲端 session、routine、背景 agent）每批最多 2 篇，交出後停下等回覆，不接著寫下一批。
4. **每篇都要三份審稿。** commit 前 `.work/reviews/<文章 slug>.md`（檔名去掉 `-en`，中英共用）要有 `## post-verify`、`## post-review`、`## post-polish` 三節，各記結論與修了什麼。只跑查證不算審稿：post-verify 只管句子對不對，不管讀不讀得懂、該寫的寫了沒。`check:series-plan` 會擋受管系列中缺紀錄的文章。

本站踩過：「從零開始的資安獵人」從一篇查證文事後升格成第 0 篇，接著兩天內每批四篇寫完 12 篇。13 份 post-verify 報告都寫了「教學品質交 post-review／post-polish」，一次都沒執行；使用者讀到時整個系列要重寫（2026-10-14）。

### 1. 準備

1. **判斷分類**：根據內容本質選 category。
2. **選擇模板**：依觸發方式照表對應，不混用。
3. **前置 metadata gate**：補齊 category、type、title direction、slug、tags（先查既有 tag 避免分裂）、references required、glossary needed。分類、標題方向、slug 與 tags 由 agent 自行判斷。只有無法查證的個人事實或必要範圍條件才問一個精準問題，**不要編造**。frontmatter 細節見 `references/frontmatter-schema.md`。
4. **抽資訊**：從對話／筆記抽出主體段落。先研究可查證的資訊；無法查證的個人經驗才問。

### 1a. 課程導讀必讀與驗收

課程總覽、單堂／跨堂、作業、週次文章，動筆前直接讀 `references/course-guide-contract.md`，把範圍卡存到 `.work/`。按文章角色對齊學習目標、正文例子與自我檢查；中文完整標題採「主題｜課程 第 N 堂」，英文用 Lecture N，不從 series.order 推原課堂次。教學重寫完成前依規格列正文證據，無例子／無判準則修正文，不靠 verify 綠宣稱教學完成。

岩場／岩區導覽（〈日本岩場〉〈義大利岩場〉這類單篇與總覽）動筆前讀 `references/crag-guide-contract.md`，單篇用 `templates/crag-guide.md`、英文版用 `templates/crag-guide-en.md`（以仁壽峰中英兩篇為範本）：固定 H2、依程度分級路線表、`scripts/climbing-grade-convert.mjs --check` 換算、封閉類事實的一手來源要求。

攀岩器材與保護系統文章（繩子、確保器、鉤環、吊帶、頭盔、岩楔／cam、固定點、bolt、確保、檢查汰換）預設補實測影片：先找 HowNOT2 與 Hard Is Easy，每篇 3–5 支嵌在對應段落、文末加頻道介紹。挑片、查證、限制寫法與標準稿見 `references/climbing-gear-videos.md`。

### 1b. 多來源導讀與英文練習

來源是 YouTube、podcast、影音檔或逐字稿時，先跑 `../media-to-post/SKILL.md`，取得來源紀錄、校正版、主題地圖、主張定位與覆蓋報告，再寫本文。只補嵌入不用跑整套。已處理材料可重用，但先確認來源版本、取得範圍與未解決疑點；不能拿 show notes 或他人摘要冒充整集內容。

遵守 `docs/content-source-writing-rules.md`（repo 根目錄）：先定讀者問題，再區分原始內容、官方核實與二手整理；明示全文／部分／轉述的讀取範圍。

開始英文練習前，填寫 `templates/shadowing-delivery-checklist.md` 到 `.work/`，區分「頁內逐字稿對照」與「原站字幕跟讀」。前者必須真的提供每段完整英文文字、中文對照、原音及轉載依據；後者須明示完整字幕在官方播放器／原站，本站短引文及摘要不是完整逐字稿。使用者要求頁內逐字稿時，不得自行用外部連結替代並稱完成；保留缺口，找允許轉載的素材或授權。英文版文章不等於英文逐字稿。標題、description、tldr、開頭與練習區承諾必須一致。回聽或部署尚未驗證，不稱完整交付或已上線。

有英文原音的導讀**預設附英文練習區**，不需逐篇詢問：原音嵌入或時間連結、可取得的官方逐字稿入口、核對後的短摘錄、中文對照與可套用的表達。YouTube fence 使用 `captions: en`，必要時加 `start`。挑段以意思完整、與本文問題相關、表達可用、聲音清楚為準，每篇預設至少三段 30–60 秒的連續原音，依完整意思與自然停頓調整；每段附中文重點。初學者可分句練習，但不能只交付一句。跟讀必須提供意思連貫的原字幕短段落與同段原音，不能只給短語表或自擬句。播放器顯示同步英文字幕，提供起訖範圍與重播方式；適用時用 `end` 與 `loop: true`。短引文只作定位，整段材料由官方同步字幕提供。發布前逐段核對起訖、字幕與重播，分別記錄字幕核對、原音回聽和播放器實測，未完成不得稱完整驗收。自擬練習句明示為改寫。

Podcast 採「原音＋逐字稿練習」：提供官方音訊入口、經核對的起訖、相同段落的官方逐字稿入口或有轉載依據的頁內文字，以及中文重點和重播操作。分別核對原音、文字對應與播放器跳轉／重播；播放器沒有同步字幕就明示，不要求套用 YouTube 同步字幕，也不稱同步字幕跟讀。只有文字定位、無法核對音訊起訖時，標為閱讀練習／原音定位待補。

未核實原音文字時，練習區標待補，不能從中文反譯冒充英文原話；未確認全文轉載授權時，連回官方全文，不重新散布整集逐字稿或完整翻譯。只有文字的來源提供閱讀／表達練習，不標為原音 shadowing。

**課程影片狀態**：課程導讀文章開頭一律有「影片狀態」行。判定「已附影片」或「沒有錄影」都要即時查原始來源（播放清單、講師頻道），並在 `scripts/config/course-videos.json` 登錄 video ID 或 `null` 加 `checkedAt`；`pnpm verify` 的 `check:course-videos` 對所有課程系列強制一致（嵌入、狀態、中英、查核日期）。細節見 `post-update` skill「課程影片狀態」。播放器放哪裡、導言怎麼交代片長、各節的時間連結與自我檢查，見 `references/course-guide-contract.md`「影片與正文的搭配」。

### 2. 體裁閘門（1500 字以上必過）

下筆前先定三件事（細節見 `references/writing-guide.md#長文的體裁與語域`）：

- **對象**：前三段要讓沒接觸過的人知道它是什麼
- **主脊**：按判決／按部件／按時間／按論證——選一個
- **動作**：每個建議都要能寫出一句今晚就能做的動作
- **圖解**（不限字數，短文也要想）：有多步驟流程、分支決策、元件關係、定位比較、層級或時間順序的內容，規劃 1–3 張圖，不要全部塞成文字段落。**先跑 `../diagram/SKILL.md` 選圖型**（架構、流程、循序、狀態機、時間軸、泳道、象限、分層、韋恩、金字塔、樹狀、巢狀、循環、前後對照、比較矩陣），圖型要配合內容，不要每篇都是同一種方框箭頭圖。逐步請求流程可用 `flow-diagram`（`references/writing-guide.md#逐步動畫流程圖flow-diagram`），節點很多的依賴圖可用 mermaid（`references/writing-guide.md#mermaid只留給大型依賴圖`）
- **影片**：來源是 YouTube 影片時，用 `youtube` fence 嵌入（格式見 `references/writing-guide.md#影片嵌入youtube`），中英版各一次

寫的當下遵守：每個主張最多一個數字、引述只在原話比轉述更有力時用、但書不堆疊、不替來源加上它沒有的主張。

### 3. 產生雙語檔案（一步完成，不是先寫中文再補英文）

同時產出兩個檔案：

| | 中文版 | 英文版 |
|---|---|---|
| 路徑 | `YYYY-MM-DD-<slug>.md` | `YYYY-MM-DD-<slug>-en.md` |
| `lang` | `zh-TW` | `en` |
| `title` / `tldr` / `description` | 中文 | 自然英文（不是機翻） |
| 跨語言連結 | `> 🌏 [English version](/posts/<category>/YYYY-MM-DD-<slug>-en)` | `> 🌏 [中文版](/posts/<category>/YYYY-MM-DD-<slug>)` |
| 其餘 frontmatter | 相同 | 相同；系列顯示名稱依已登錄的語言名，模型家族按專用規格 |

英文版規則：
- code block 不動（只翻中文註解）
- URL、檔案路徑、指令範例維持原樣
- 參考資料：翻譯描述文字；純中文來源保留原連結並標注 `(in Chinese)`

寫作風格見 `references/writing-guide.md`。

### 4. 參考資料（硬要求）

`pnpm check:references` 在以下任一條件成立時要求參考資料：
- category 是 tech / ai / learning / education / policy / design / marketing / product
- `##` 標題 ≥ 4 個、有 code fence、inline code ≥ 3、已有外部連結、含引用關鍵字 ≥ 2 個

文末必須有 `## 參考資料`（英文版 `## References`），含至少一個有效 `[text](url)` 連結。

**內文連結閘門**：文末清單不能取代內文連結。commit 前逐段掃一遍，每個第一次出現的專名——課號、課程官網、工具、論文、同系列的站上文章——都要是 inline 超連結。對照表、清單裡的專名也一樣。反例與規則見 `references/anti-shortcuts.md` 的「連結以後再補」條目。

**引用外部 repo 的行號或題目**：行號連結（`blob/main/...#L41`）會隨 repo 更新位移，而且不同工具抓到的內容行號可能差幾行（本站踩過：閱讀器版本與原始檔差 4–5 行）。所以：

1. 蒐集前由單一人用單一方式把原始檔抓成唯讀快照（`scripts/check-github-line-links.mjs` 的快照目錄），多個 agent 只讀快照，不各自下載、不共用可寫的快取。
2. 蒐集時就記逐字原題與行號，不要只記連結。
3. commit 前跑 `node .agents/skills/post/scripts/check-github-line-links.mjs <中文檔> <英文檔>`，逐列對照被引用的那一行是不是同一題。「連結字串出現在蒐集檔」不算核對。

### 5. 補齊 glossary

模型家族依專用規格判斷是否需要，選填不是必修；不能為填欄位增加未核對的宣稱。

- 先查 `src/lib/glossary/terms.ts` 是否已有定義
- 跨文章通用 → 補到 `terms.ts`（含中英雙語）
- 僅限這篇 → 補到 frontmatter `glossary` 欄位

### 6. 驗證（兩個檔案都要通過）

```bash
pnpm verify
pnpm check:references
pnpm lint
pnpm astro check
```

中文版另跑：`pnpm check:tw src/content/posts/<category>/<檔名>.md`

有 `diagram`／`flow-diagram` 區塊時，中英兩版都跑 `pnpm exec tsx scripts/diagram-preview.ts <檔案路徑> --out <暫存目錄>`：全部 ✓，並打開淺色、深色、手機三張截圖看過。

1500 字以上另跑：`bash .agents/skills/post-polish/scripts/register-scan.sh <檔案路徑>`

有 error 先修。commit 前對照 `references/anti-shortcuts.md` 反合理化清單。

### 7. Review + commit

先確認 `.work/reviews/<slug>.md` 的 post-verify／post-review／post-polish 三節都做完、修完（系列文章必做，見步驟 0a；單篇也建議）。查證報告裡寫「交給 X」的，就去跑 X，不在 commit 訊息寫「經獨立查證」帶過。

把中英文草稿給使用者看，確認後：

```bash
git add src/content/posts/<category>/YYYY-MM-DD-<slug>.md src/content/posts/<category>/YYYY-MM-DD-<slug>-en.md
git commit -m "post(<category>): <title summary>"
```

### 8. 系列回填（新文章屬於既有 series 時必做）

新文章帶著 `series` 進到一個已經有其他篇目的連載時，較早發佈的文章很可能寫著「接下來會寫 X」「第一批優先順序是…」這類對本篇的承諾。本篇上線那一刻，那些承諾就過期了。

1. 用 `rg -l '<series 名稱>' src/content/posts/` 或逐篇查 frontmatter，列出同 series 的所有文章
2. 掃每篇的「接下來」類段落、學校／課程對照表與 `## 參考資料`，找指向本篇主題但沒有連結的地方
3. 把過期承諾改寫成現況清單＋連結（不要用「更新：…」補丁式寫法），中英版一起
4. 這些修改走 `post-update` 流程：加 `## 更新紀錄`、跑驗證、diff review 後一起或分開 commit

## 詳細參考

- 寫作風格：`references/writing-guide.md`
- frontmatter schema：`references/frontmatter-schema.md`
- 反合理化清單：`references/anti-shortcuts.md`
- 模板：`templates/tech-post.md`、`templates/tech-deep-dive.md`、`templates/general-post.md`、`templates/crag-guide.md`、`templates/crag-guide-en.md`
