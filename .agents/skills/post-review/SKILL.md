---
name: post-review
description: 'Pre-publish review of a post draft in src/content/posts/: runs validators, checks frontmatter, tldr, tags, structure and reference coverage, returns a tiered issue list. Does NOT modify the file. Use when user says review 一下 / 審稿 / 發文前看一下 / 幫我檢查這篇. Facts → post-verify; prose polish → post-polish.'
---

# post-review skill

發文前的最後一關。**只報告，不動文**——這個 skill 的價值就在於使用者可以決定要不要採納。

## 何時不用

- 查版本、價格、數字、引述是不是真的 → `post-verify`；來源可不可信、有沒有業配 → `source-eval`。
- 文章讀不下去、要潤稿改寫 → `post-polish`（本 skill 的步驟 6.6 只報告語域問題）。
- 要動文 → `post-update`。本 skill 只審 `src/content/posts/` 下的草稿並回報 issue。

## 課程文章審稿（必讀）

涉及課程總覽、單堂導讀、作業或週次文章，審稿前必須直接讀 `../post/references/course-guide-contract.md`，先辨識文章角色。中文單堂標題採「主題｜課程 第 N 堂」，英文使用 `Lecture N`；其他角色依該規格處理，原課堂次不能用 `series.order` 代替。

審課程文章前先讀 `references/special-series.md` 的「課程文章審稿」：獨立標題檢查指令、教學品質的四項正文證據、總覽與僅更新來源的驗收方式都在那裡，讀完才開始審。

報告須分開列「機械檢查」「事實查證」「教學品質」。未跑事實查證就標未查，找不到教學證據就列缺口；任何一層通過都不能推定另兩層通過。

## 書籍導讀審查（必讀）

審查書籍導讀時，先讀 `../post/references/book-guide-contract.md`。審稿的人讀過研究筆記，自己判「讀者問題第一段就出來」不算數：照規格做只給正文的冷讀，答不出事件或論點是什麼就是 🔴 必修。另查規劃用語與固定標籤 H2 是否進了正文、description 或 tldr。

## 模型家族文章審查（必讀）

審查「AI 模型家族」／「AI Model Families」系列時，先讀 `../post/references/model-family-contract.md`，依文章角色檢查；每日模型卡不套家族長文模板。執行 `node .agents/skills/post/scripts/check-model-family-format.mjs <中英檔案...>`；這是本 skill 的專項檢查，不取代 pnpm verify，也不改寫文章。

五項專項檢查（共同 H2 與矩陣、版本數字一致、評測可比較條件、中英一致、改序後的接縫）在 `references/special-series.md` 的「模型家族文章審查」，跑完格式檢查後先讀再逐項對。

違反專用格式列必修，缺未知資訊的來源邊界列需補；glossary 是選填，不以缺欄位判缺陷。報告分開格式、事實範圍與選型可讀性，不能用機械檢查綠宣稱整篇事實最新。

## 執行步驟

### 1. 定位草稿

使用者指定的路徑、slug 或關鍵字。多個候選 → 列出讓使用者挑，**不要自己選**。

### 2. 機械檢查（先跑命令）

```bash
pnpm verify        # lint + references + post-quality + glossary + series-order + lang-parity + skills-sync
pnpm astro check
pnpm exec tsx scripts/diagram-preview.ts <檔案路徑> --out <暫存目錄>   # 有 diagram / flow-diagram 區塊時，中英兩版都跑
```

任何一項紅，先列在報告開頭，**這些是必修**。

外部連結要另外跑（會打網路，所以不在 `verify` 裡）：

```bash
pnpm check:links src/content/posts/<category>/<檔名>.md
```

它分兩欄輸出：「壞掉的連結」（404/410/逾時）要修；「需人工確認」多半是出版社與社群網站擋機器人（403/429），開瀏覽器看一眼即可。

### 3. frontmatter 檢查

對照 `../post/references/frontmatter-schema.md`：

九項欄位檢查在 `references/core-checklists.md` 的「3. frontmatter 檢查」，先讀再逐項對。

### 4. tldr / description 強度

評 tldr / description 前先讀 `references/tldr-derived.md` 的「4. tldr / description 強度」（弱強對照表與五個檢查點），逐點對過。另外：

- `check:post-quality` 的 tldr 警告（自指、否定式對比、意義抬高）逐條看；誤判要能說出理由，不然列必修。規則見 `../post/references/writing-guide.md` §tldr / description 原則

### 4.5 衍生內容的事實一致性（tldr / faq / glossary）

`tldr`、`faq`、frontmatter `glossary` 都是從正文改寫來的**衍生內容**，而且比正文更短、更斷言、更容易被搜尋引擎與 answer engine 整段抽走。它們也最常在最後一刻趕出來，是錯誤最容易溜進去的地方。

逐條檢查前先讀 `references/tldr-derived.md` 的「4.5 衍生內容的事實一致性」，六項一項一項對。

判斷原則：**改寫等於重新宣稱一次。** 有疑慮就回原始來源對，不是回正文對——正文的錯會被原封不動複製過來。

### 5. tags 衛生

跟同 category 既有 tag 比對：

```bash
grep -h "^tags:" src/content/posts/<category>/*.md | sort -u
```

比對完先讀 `references/core-checklists.md` 的「5. tags 衛生」：要找的四類問題，以及跟 `tag-audit` 一致的 canonical 判斷規則。

### 6. 結構

模型家族先按上方專用規格；其餘按 `type` 對應預期：

- `debug`：情境 → 問題 → 嘗試 → 解法 → 原因 → 學到的事
- `deep-dive`：開頭段 → 多個展開段 → 整體架構（如有）→ 整體來說 → 參考資料
- `guide`：前置 → 步驟 → 預期輸出 → 常見錯誤
- `project`：問題 → 為什麼做 → 怎麼做 → 現況

缺主要段落 → 列。

### 6.5 對象覆蓋（導讀／評論／拆解類必查）

只要文章在討論一個外部對象——課程、工具、論文、專案、產品——就檢查**對象本身有沒有被描述**，而不只是被評論。

三項檢查、最常見的失效型態與 grep 快速檢法在 `references/coverage-genre-ownership.md` 的「6.5 對象覆蓋」，這類文章先讀再查。

### 6.55 文體一致性（導讀／評論／拆解類必查）

比對**標題與 tldr 承諾的文體**（介紹／審查／教學…）和**各章節實際字數占比**。

四項檢查與算各節字數的 awk 指令在 `references/coverage-genre-ownership.md` 的「6.55 文體一致性」，先讀再跑。

把各 `##` 字數算成占比，逐節標類型（介紹／評測發現／方法／參考），對照標題承諾。規則見 `../post/references/writing-guide.md#研究過程不進門面`。不一致標 🔴；單純數字放錯位置標 🟡。

### 6.6 語域（zh-TW 長文）

事實對、結構對，但讀者讀不下去——這是獨立的一層，機械檢查抓得到一半：

zh-TW 長文先讀 `references/register-taiwan.md` 的「6.6 語域」，照裡面跑兩支掃描、再做機器抓不到的那項人工檢查。本步驟只**報告**；要改寫走 `post-polish`。

### 6.65 台灣讀者位置（zh-TW 導讀／評論／拆解類必查）

繁體字、台灣用詞、或多寫幾次「台灣」都不等於台灣讀者位置。這一層查的是：文章有沒有把外部材料翻成台灣讀者會遇到的問題、限制、決策或行動。

適用範圍、五個檢查點與 🔴／🟡／🟢 判準在 `references/register-taiwan.md` 的「6.65 台灣讀者位置」，先讀再查。

站內語氣錨點見 `.research/2026-08-29-quidproquo-voice-reference-set.md`；外部參考來源見 `.research/2026-08-29-taiwan-article-sources-for-tone.md`。結構模板見 `../post/references/taiwan-voice-structure.md`。檢查時優先看「讀者位置」與「問題翻譯」，不要只算台灣詞彙出現次數。

### 6.7 通順與接縫（改過兩輪以上必查）

**機械檢查全綠 ≠ 文章讀得通。** 前面每一步都是分項檢查；這一步是**從第一行讀到最後一行**，看它還是不是一篇完整的文章。

必查時機：文章被改過兩輪以上、或用字串取代／腳本動過內容。那種改法會在接縫留下機械檢查抓不到的東西。

符合必查時機就先讀 `references/flow-seams.md`，照順序做完反向大綱、一致性搜尋、逐句看句首三個動作，再對七項清單、跑掃描指令。通讀時「碰巧注意到」不算檢查。

### 6.8 主題歸屬（站上已有相關系列時必查）

站愈大愈容易犯：某一節把另一個系列已經擁有的主題重講一遍。結果不是寫錯，是**兩處會各自過期的重複描述**——而且日後更新只有其中一處會被改到，另一處靜靜爛掉。

觸發條件：文章有一節在講的東西，站上已經有專文或系列在處理。

查站內既有系列的指令與三項檢查在 `references/coverage-genre-ownership.md` 的「6.8 主題歸屬」，觸發時先讀再查。

判準：**在這篇裡，越界的主題只需要回答「為什麼它不屬於這篇的範圍、該去哪裡看」。** 一旦開始解釋它怎麼運作，就是越界。

### 7. 標題與清單可讀性

對照 Google-style 的可掃讀原則，檢查文章是否容易被人和模型穩定解析：

六項檢查在 `references/core-checklists.md` 的「7. 標題與清單可讀性」，先讀再逐項對。

### 8. 參考資料覆蓋

四項檢查在 `references/core-checklists.md` 的「8. 參考資料覆蓋」，先讀再逐項對。

### 8.5 inline source link 覆蓋（數據與引述）

逐段掃文章正文，找出所有「引用外部事實」的句子——包含數字、百分比、研究結論、人物引言、公司行為描述——然後檢查：

四項檢查在 `references/core-checklists.md` 的「8.5 inline source link 覆蓋」，先讀再逐段對。

如果一段有數字或引述但沒有超連結，標為 🔴 必修。理由：讀者不會主動去文末參考資料對照，沒有 inline link 等於沒有來源。

### 9. 寫作品質（風格層）

對照 `../post/references/writing-guide.md`：

五項檢查在 `references/core-checklists.md` 的「9. 寫作品質」，先讀再逐項對。

### 9.3 圖表使用（所有文章必查）

對照 `../diagram/SKILL.md`。不論長短，逐節問：這段讀者看圖會不會比讀文字更快懂？

七項檢查與各自的 🔴／🟡／🟢 分級在 `references/diagram-checks.md`，先讀再逐節判斷。

### 9.5 台灣用語（只查 `lang: zh-TW`）

繁體字不等於台灣用語——模型的中文語料以中國內容為大宗，中國詞彙與翻譯腔會自動流進來。先跑掃描指令，再逐句看翻譯腔：

```bash
pnpm check:tw <post>
```

分兩級：**A 級**（用戶、視頻、激活、插件…）標 🔴 必修；**B 級**（質量、智能、信號、界面、反饋）標 🟡，因為它們在物理、專有名詞、控制理論等語境下是正確的，要看過再判斷。

廣度檢查另外跑 `zhtw-mcp lint`（不進 CI，用法見 `../post/references/writing-guide.md#兩層檢查`）。

- [ ] 掃描命中的每一處都確認過（命中不等於一定要改，但要看過）
- [ ] 翻譯腔四型逐句掃：形容詞直譯（「很不性感」）、名詞化（「執法啟動」）、英文語序（「壞的 X 的代表案例」）、術語硬譯（framing →「框架」多半該寫「說法」）
- [ ] 金額寫成「4,000 萬美元」而不是「$4,000 萬」
- [ ] 從英文材料翻寫的段落特別檢查——那是翻譯腔密度最高的地方

替換對照表在 `../post/references/writing-guide.md#台灣用語`。這類問題標 🟡 建議修，除非整段讀起來明顯不像中文母語者寫的（🔴）。

### 10. 報告格式

把所有 issue 分成三層回報：

寫報告前先讀 `references/report-format.md`，照裡面的三層模板輸出，每條 issue 帶齊它列的三個欄位。

**不要直接動文**。讓使用者選要採納哪些。

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 「直接幫他改下去」 | review 跟 update 是兩件事；這 skill 只報告，使用者要主動觸發 post-update 才動 |
| 「跑完命令沒紅就 OK」 | 機械檢查通過 ≠ 內容好；要讀內文做品質檢查 |
| 「不檢查 tag 分裂」 | 站內聚合靠 tag，這是長期負債 |
| 「tldr 弱算了不提」 | tldr 弱直接影響點擊率，是發文前最該修的 |
| 「tldr / faq 是從正文抄的，正文對就對」 | 改寫會併句、會丟掉對照條件、會把「其中一項分析」變成「研究證明」。這三種錯都只在衍生內容裡，正文檢查抓不到 |
| 「分類講錯了，補一段說明清楚」 | 補充等於把別的系列的內容複製一份過來，變成兩處各自過期。分類錯要修的是分界句與轉手連結，修完那節應該**變短** |
| 「這段寫得不錯，重複也沒差」 | 重複描述的成本在未來——更新時只有一處會被改到，另一處靜靜過期，而且沒人會提醒你 |
| 「這段沒改過，跳過」 | 沒改過只代表沒被檢查過。review 是看現在的文章對不對，不是看這次改了什麼 |

## 詳細參考

- 寫作風格：`../post/references/writing-guide.md`
- frontmatter schema：`../post/references/frontmatter-schema.md`
- 改文章流程：使用 `post-update` skill
