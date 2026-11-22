# 審稿紀錄：2026-10-29-daodao-living-community（島島阿學怎麼經營 order 1）

檔案：`src/content/posts/product/2026-10-29-daodao-living-community.md`（zh-TW，主審）、`-en.md`（抽查）
日期：2026-11-12
說明：**本紀錄是發布後補做的審稿**（2026-11-12），不是發布前的原始審稿。2026-10-30 的原始審稿紀錄已於 2026-11-13 找回，見 `.work/reviews/2026-10-29-daodao-living-community-original-2026-10-30.md`；本檔保留 2026-11-12 的獨立重跑結果。三項都只報告，沒有改動文章。
審稿：子代理（沒有參與寫稿），照 `.agents/skills/post-verify`、`post-review`、`post-polish` 的 SKILL.md 執行。

工具與降級（toolDegradation）：
- Kraut & Fiore：Groundlane `web_search` 找到作者在 CMU 個人站的全文 PDF（kraut.hciresearch.info），以 curl 下載後 `pdftotext` 全文比對。文中連結的 dl.acm.org PDF 對 curl 回 403，`check:links` 也列為「需人工確認」。
- van Mierlo：jmir.org 對 curl 回 202 空頁；Groundlane `web_fetch`（browser engine）同樣回空文件（`js_empty_document`）。改用 Europe PMC REST API 讀同一篇論文的 PMC 全文（PMC3939180，vol 16 issue 2）。JMIR 原站的其餘 fallback（Groundlane 直接 HTTP、Keenable、You.com、Exa 等）沒有試，所以不宣稱 JMIR 頁讀不到，只記錄這次沒有從原站讀。
- McMillan & Chavis：文中連結的 cybersalon.org PDF 以 curl 下載、`pdftotext` 全文比對（期刊首頁標示 Volume 14, January 1986）。
- Wenger-Trayner：原頁以 curl 下載 HTML、去標籤後比對（頁首標 June 2015）。
- 島島學習生態圈文件：本機 `daodao` repo 讀檔，並以 `gh api` 確認 GitHub 公開 repo 上的同一檔案 blob sha（0755a1a…）與本機一致，repo visibility 為 public。
- 本次沒有使用 Exa／Tavily／linkup／jina／firecrawl。

## post-verify

結論統計：Confirmed 32／Outdated 0／Unverifiable 3／Contradicted 0（Misframed 0；有 1 條概括偏極端，列在 Confirmed 的備註）。

### 外部研究

| 宣稱（位置） | 來源（2026-11-12 讀） | 結論 |
|---|---|---|
| McMillan & Chavis 定義引文逐字（社群感節 blockquote） | cybersalon PDF 全文：「Sense of community is a feeling that members have of belonging, a feeling that members matter to one another and to the group, and a shared faith that members' needs will be met through their commitment to be together」 | ✅ 逐字相符 |
| 四元素名稱與意思：membership（界線）、influence、reinforcement（需求的整合與滿足）、shared emotional connection（共同歷史） | 同上：「Membership has boundaries」、「The third element is reinforcement: integration and fulfillment of needs」、「based, in part, on a shared history」 | ✅ |
| 社區組織者例子：先問居民煩惱、找共同需求、召集會議、選幹部、規劃行動 | 同上 "The neighborhood" 段：talks to people…find out their problems…calls a meeting…Members elect officers, set up bylaws, and begin to plan and implement programs | ✅ |
| 書目：Journal of Community Psychology, 14(1), 1986 | 同上，首頁「Volume 14, January 1986」 | ✅ |
| 「社區心理學裡**最常被引用**的定義」 | 沒有找到引用次數比較的來源；本次也沒有去查 | 🟡 Unverifiable（概括超出來源，見下方建議） |
| Wenger-Trayner 定義「一群人對某件事有共同的關心或熱情，在經常互動中學會怎麼做得更好」 | wenger-trayner.com 原頁：「groups of people who share a concern or a passion for something they do and learn how to do it better as they interact regularly」 | ✅ |
| 引文「A website in itself is not a community of practice.」 | 同上，逐字 | ✅ |
| 三要素（domain／community／practice）及「共同資源庫：經驗、故事、工具、處理反覆出現問題的方法；需要時間和持續互動」 | 同上：「shared repertoire of resources: experiences, stories, tools, ways of addressing recurring problems… This takes time and sustained interaction」 | ✅ |
| 參考資料日期 2015 | 原頁標「June 2015」 | ✅ |
| van Mierlo 2014：四個社群為戒酒、憂鬱、恐慌、戒菸 | PMC 全文：AlcoholHelpCenter、DepressionCenter、PanicCenter、StopSmokingCenter | ✅ |
| 「6 萬多名使用者」「57 萬多篇文章」 | 「63,990 actors created 578,349 posts」 | ✅ |
| 「不到 25% 的人發過文」 | 「less than 25% of actors in each DHSN authored one or more posts」 | ✅ |
| 「前 1% 的人寫了約 74.7% 的內容」 | 「Superusers」＝每個社群前 1% actors，加權平均 74.7%（n=276,034）；簡單平均是 73.6% | ✅（文中用加權平均，與摘要一致） |
| 書目 JMIR 16(2):e33 | Europe PMC 書目：vol 16、issue 2 | ✅ |
| Kraut & Fiore：追蹤 472,231 個新 Facebook 社團，三個月後 57% 停止產生新內容 | CMU 全文摘要：「traced the fate of 472,231 new online groups. By the end of a 3-month observation period, 57% of the groups had died, ceasing to post new content」 | ✅（單一來源：論文本身；ACM 頁被擋，ResearchGate／Semantic Scholar 只有搜尋摘要，不計為第二來源） |
| 創辦人第一週越活躍，社團越可能存活 | 「Founders' activities during the first week of a group's existence were strong predictors of group survival」 | ✅（論文自己寫明無法做因果宣稱；文中用相關性語氣，沒有放大） |
| 三種較容易死的社團：只有創辦人一位管理員、創辦人跟成員都有連結、成員都由創辦人拉進來 | 「groups were less likely to survive when the founders had more ties to group members, when the founders invited more of the members and when the founders served as the exclusive administrator」 | ✅ 備註：後兩項在論文裡是連續變數（連結越多、拉進來的比例越高越容易死），文中寫成「所有成員」是取極端值，方向正確。另外論文寫 91% 的社團本來就只有創辦人一位管理員，見需要人判斷 |
| 作者解讀：資源重要，但太依賴他一人就變成瓶頸 | 「they can also be a bottleneck if the group depends on them too much」 | ✅ |
| 書目 CSCW '14 | 全文頁首「CSCW 2014 • Leadership, February 15-19, 2014, Baltimore」 | ✅ |

### 島島自家資料（公開 repo 的內部文件：只能證明「文件這樣寫」，不能證明指標已實際量測）

| 宣稱 | 來源 | 結論 |
|---|---|---|
| 生態圈文件列六個指標，量的都是成員「之間」的事 | `daodao/docs/product/prd/learning-ecosystem.md` §六 | ✅ |
| 回應率：72 小時內至少一個快速回應或留言 | 同上表格 | ✅ |
| 回流率：收到回應後 7 天內再次打卡（文件原名「能量回流率」） | 同上 | ✅ |
| 複製鏈長度：每月被複製實踐數＋「複製的複製」佔比 | 同上 | ✅ |
| 連結密度：月活躍使用者中 ≥1 個連結或 ≥3 個關注 | 同上 | ✅ |
| 生產者多樣性：內容來源類型數（自產／模板／導師／外部資源） | 同上（文件另寫「目前恆等於 1」，文章沒提） | ✅ |
| Buddy 存活率：配對後 14 天內雙方仍打卡 | 同上 | ✅ |
| 「資料都在既有的資料表裡」 | 同上：「全部可以從既有資料表計算，不需要新增任何埋點」 | ✅ |
| Buddy 存活率要等火苗上線才量得出來 | 同上表格「（火苗上線後）」；§五 Buddy 目前只有請求收發、火苗未實作 | ✅ |
| 刻意不量：連續打卡天數、學習時長、嚴格期限達成率；原則「量流動、不量壓力」 | 同上：「仍然禁用」「量流動、不量壓力；量網絡、不量個人耐力」 | ✅ |
| 「靜默共讀 50 分鐘、最後打卡收尾」的格式 | `daodao/docs/product/gtm/plg-gtm-strategy.md`（同一公開 repo，已在 origin/main）：「靜默共讀 50 分鐘＋21:55 打卡儀式」 | ✅（single-source，自家文件） |
| 上一篇：轉向幫老師是因為人太少、打卡沒人回應 | `2026-10-29-daodao-why-help-facilitators.md` tldr 與「卡在人太少」一節 | ✅（站內一致；底層事實是作者自述） |
| 老師帶的系列活動學員一開始都是老師拉進來；島島自辦活動開頭是團隊在回應 | 只有作者自述（系列規劃表的經營骨架） | 🟡 Unverifiable（內部資料／作者自述，無外部來源，屬於作者本人可確認的事） |
| 「系列第 11 篇要談的『哨兵』指標」 | `.work/series-plans/daodao-community-ops.md` order 11 規劃了哨兵；該篇尚未發布 | 🟡 Unverifiable（未發布內容的前向承諾） |

### 建議（不動文）

1. 「最常被引用的定義」：沒有來源支持「最」。建議縮回原意，改成「社區心理學裡常被引用的定義」，或刪掉這個修飾。
2. 三種易死社團的寫法可以選擇縮回論文原意：「創辦人跟成員的連結越多、成員越多是他自己拉進來的，社團越容易死」。不改也沒有說錯，方向一致。
3. 歸因標籤：全篇「作者的解讀是」1 處、「我會／我不建議」2 處，沒有超過 3 處，不需要合併。

範圍聲明：本次只檢查了文中已提出的 35 條宣告，未評估文章對主題的覆蓋是否完整。開頭兩個社群（500 人 LINE 群、20 人讀書會）是說明用的假設例子，不列入事實宣告。
下一步（未完成前不能 commit）：post-review、post-polish（本紀錄下方兩節已補做）。

## post-review

### 機械檢查

- `pnpm verify`：3 項紅，都不是本篇造成的：
  - `check:series-plan`：本篇缺審稿紀錄（本檔就是補這一項）；另有研究筆記缺檔、`daodao-why-help-facilitators` 缺審稿紀錄，屬其他項目。
  - `check:post-quality`：ERROR 來自 `2026-11-12-no-code-*` 等其他文章。本篇只有一條 WARN：tag `metrics` 沒有對應詞。內文整節在講「指標」，判為誤判，可保留。
  - `check:course-videos`：其他課程文章的影片查核日期過期，與本篇無關。
- `check:tw`：0 blocking、0 to review。
- `check:lang-parity`、`check:references`：本篇無訊息。
- `check:links`：5 條外部連結沒有壞的；dl.acm.org 的 PDF 回 403，列「需人工確認」（見建議修 1）。
- 沒有 diagram 區塊，不需要跑 `diagram-preview`。`astro check` 本次沒有跑（沒有改任何檔案）。

### frontmatter／tldr

- 必填齊全；`type: guide`、`category: product`、series 名稱與 order 1 和系列規劃表一致；tags 4 個，都是 product 分類已有的 tag（community 12 篇、daodao／learning-community／metrics 各 4 篇），沒有分裂。
- tldr 是資訊型，遮掉正文也能照著檢查；數字（57%、47 萬）和正文一致，強度沒有放大。
- 🟡 tldr 列的四項（72 小時回應、7 天回流、不只一位核心成員、累積可重複使用的實踐）和正文「一份檢查表」的四題不是同一組：tldr 有回流率，檢查表沒有；檢查表有「成員能不能影響這裡的事」，tldr 沒有；tldr 說 72 小時，檢查表和判準說「一天內」。讀者只看 tldr 會拿到另一套標準。建議讓兩邊對齊（見需要人判斷）。
- 🟢 description 與 tldr 內容不重複，description 講來源組成，可以保留。

### 結構與覆蓋

- 引子（兩個社群對照）→ 社群感 → 共同實踐 → 參與不平均 → 新社群死亡率 → 島島的指標 → 檢查表 → 練習題與判準 → 參考資料。`guide` 型文章沒有「步驟→預期輸出」的形狀，但檢查表＋練習＋判準已經提供可做的動作，可以接受。
- 開頭承諾「最後收成一份可以直接拿去檢查自己社群的清單」有兌現；開頭的 LINE 群與讀書會在「一份檢查表」末段有回扣。
- 各節字數（awk）：社群感 1,707、共同實踐 1,122、參與不平均 733、新社群 922、島島怎麼量 1,670、檢查表 921、練習 915、參考資料 845。研究與島島指標約各半，沒有文體不一致。
- 台灣讀者位置：開頭用 LINE 群與讀書會，判準給「請兩三位老成員輪流回應新人」這類台灣經營者做得到的動作。✅
- 系列連結：上一篇連結存在且英文版用 `-en`；「下一篇」（order 2）與「系列第 11 篇」都還沒發布，屬前向承諾，發布時要回來確認還對得上。
- inline 來源：每個研究數字與引文在原句都有連結；島島指標連到公開的 GitHub 文件。✅

### 建議修

1. 🟡 Kraut & Fiore 的連結（內文與參考資料）指向 dl.acm.org 付費 PDF，讀者多半打不開，`check:links` 也是 403。建議改連 ACM 的 DOI 頁，或補作者公開版本 `https://kraut.hciresearch.info/wp-content/uploads/kraut14-RoleOfFounderInOnlineGroups.pdf`。
2. 🟡 tldr 與檢查表的門檻不一致（72 小時對「一天內」、四項內容不同），見上。
3. 🟢 「只有創辦人一位管理員」在論文裡是 91% 社團的常態。補一句「多數社團都是這樣開始的」可以讓讀者知道這不是少數人的錯誤，而是預設狀態；要不要加由作者決定。

### en 版抽查

- 8 個 H2 對齊；外部連結集合相同；數字集合只差寫法（zh「6 萬多／57 萬多／47 萬」，en「60,000／570,000／472,231」）。
- 檢查表「within a day」、判準「Over three days」、50 分鐘格式、「measure flow, not pressure」、part 11 sentinel 與中文一致。
- 🟡 en tldr 寫「groups with a single admin whose founder added every member die sooner」，把兩個獨立因素寫成同一種社團；中文 tldr「只有一位管理員、成員全由創辦人拉進來的社團」用頓號，也可能被讀成同時成立。論文是分開的三個因素，建議兩版都寫成並列（例如 en：「groups where the founder is the only admin, or added most of the members, die sooner」）。
- 沒有發現其他語意分歧。

## post-polish

`register-scan.sh` 結果（正文 44 段，約 67 句）：

| 指標 | 結果 | 判定 |
|---|---|---|
| 長句（>60 字） | 6 句（約 9%）：社群感設計清單句 84 字、Wenger-Trayner 定義句 82 字、van Mierlo 句 72 字、開頭回扣句 76 字、實踐模板句 60 字、指標對照句 62 字 | 綠，低於 10% |
| 但書密度 | 5／44 段（11%） | 綠 |
| 引述區塊 | 1（McMillan & Chavis 定義原文） | 綠；定義原文本身是引用重點，保留 |
| 數字密度 | 1 段 6 個數字：「參與本來就不平均」的 van Mierlo 段 | 該處理 |
| 姓名當主詞 | 0（掃描值）；人工看「Kraut 與 Fiore 在 2014 年的 CSCW 論文追蹤…」「van Mierlo 2014 年在 JMIR 分析…」兩段以姓名起頭 | 低於閾值，可不改 |
| 模板化轉折 | 0 | 綠 |
| 一般英文術語 | 0 | 綠 |

`scan-ledger.sh`：模板化轉折、台灣中文高風險用詞、標題壓縮分類語氣都是 0 命中。

建議（不動文）：

1. van Mierlo 段數字太密（2014、4 個社群、6 萬、57 萬、25%、1%、74.7%）。讀者要用的是「不到四分之一的人發過文、前 1% 寫了約四分之三」，可以把 6 萬、57 萬移到括號或刪掉，正文留比例。
2. 「這四個元素適合當**設計清單**：…」84 字，四個問句串在一句裡。可以在冒號後拆成短問句清單，或在「有沒有共同經歷？」後斷句，讓「我不建議做成分數」獨立成句，立場比較清楚。
3. Wenger-Trayner 定義句 82 字：可以在「裡」之後斷開，先說誰寫的，再給定義。
4. 人工回讀：開頭、建議與結論都是直接對讀者說話，沒有切換成稽核 memo 語氣；章節標題單獨念都像自然的中文判斷句（例如「新社群多半死在前三個月」），不需要改。每個「建議照做」都有對應動作（檢查表四題＋三題練習與判準）。

## 需要人判斷

- **門檻統一**：指標用「72 小時內有回應」，檢查表與判準用「一天內」、「超過三天」。兩者用途不同（平台指標對新人接住的標準）還是應該統一？tldr 要跟哪一組對齊？
- **共同創辦人揭露**：系列規劃表寫「研究者為島島共同創辦人，案例可能偏向替現行方向找支持，在 order 0 與用到的篇章明寫」。本篇引用島島自己的指標文件當判準來源，但沒有寫這句揭露；要不要補。
- **作者自述**：「老師帶的系列活動，學員一開始都是老師拉進來的；島島自辦的活動，開頭也是我們在回應」只有作者本人能確認。
- **「最常被引用」**：縮成「常被引用」還是保留（若有引用數據可補來源）。
- **Kraut & Fiore 連結**：改連作者公開版 PDF 或 DOI 頁。
- **91% 單一管理員**：要不要補這個背景數字。
- **前向承諾**：「下一篇談共學有沒有用」「系列第 11 篇的哨兵」在對應篇發布時要回頭確認標題與內容對得上。
- **開頭例子**：20 人讀書會寫「每週二四晚上」；島島實際的 re-Visit 共讀在 GTM 文件裡是週一、三晚上。如果這個例子原本是想寫島島自己的共讀，要對齊；如果是虛構例子，維持即可。
