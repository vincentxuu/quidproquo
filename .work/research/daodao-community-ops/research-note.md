# 研究筆記：島島阿學怎麼經營（daodao-community-ops）

> **這是重建版，不是原始筆記。**
>
> - 原始研究筆記（連同 `cases.md` 案例、`frameworks.md` 理論與實證）在 2026-10-29 規劃時寫成，但從未 commit，產生它的 session 容器已回收，全機搜尋找不到副本（見治理紀錄 Q-053）。
> - 本檔於 2026-11-12 重建，依據只有兩項：(a) 已 commit 的規劃表 `.work/series-plans/daodao-community-ops.md`；(b) 已發布的兩篇文章（zh + en）實際引用的來源：`src/content/posts/product/2026-10-29-daodao-why-help-facilitators{,-en}.md`、`src/content/posts/product/2026-10-29-daodao-living-community{,-en}.md`。中英版引用的 URL 完全相同（各 9 個、5 個，共 14 個）。
> - 下表每個來源都在 2026-11-12 重新開啟，記錄的是**這次實際讀到的內容**，不是原筆記的記載。
> - **`cases.md` 與 `frameworks.md` 沒有重建。** 規劃表裡指向 `cases §x`、`frameworks §x` 的引用目前沒有對應檔案；order 2–12 的研究基礎要在動筆前重做（見最後兩節）。

最後更新：2026-11-12（重建）

## 母群定義

依規劃表推回（原筆記的逐段母群定義已遺失）：

- **島島自身歷程**：島島阿學 2020 年至今的公開紀錄（官方網站活動頁、電子報、vocus、LinkedIn、OCF 專案頁、第三方訪談文、GitHub README），加上 daodaoedu/daodao 公開 repo 裡的產品文件。
- **社群「活著」的判準**：社區心理學與實踐社群的定義性原文，以及量化線上社群參與分布、新社群存活的實證研究。
- **order 2–12 的案例與實證**（P2PU、Hack Club、Write of Passage、Trevari、g0v、Women Who Code、Buildspace、MOOC 完課率、Circle、CMX 等）：原本收在 `cases.md`／`frameworks.md`，已遺失，本次未重建，母群需重新定義。

## 來源表（2026-11-12 重讀狀態）

讀取管道：Groundlane `web_fetch` 優先；Groundlane 失敗時依序改用其他管道，寫在「讀取範圍」欄。

### 外部公開來源（兩篇已發布文章引用）

| ID | 來源 | URL | 讀取範圍 | 用於 |
|---|---|---|---|---|
| D1 | Day 7: 島島阿學的誕生：從教育理念到實際行動（iT 邦幫忙，2024-09-08） | https://ithelp.ithome.com.tw/articles/10348539 | ✅ 全文（Groundlane）。確認：發起人主要是台灣實驗教育工作者培育計畫成員；參加 g0v 2020 零時小學校找到工程師、做出第一版網站；隔週三晚上開會、Discord＋Notion | order 0 |
| D2 | DaoTW 島島阿學自學平台 README（GitHub LeeLin2602/DaoTW） | https://github.com/LeeLin2602/DaoTW | ✅ README 全文（`gh api` 取 raw，41 行）。第 20 行原文「我們真正的構想是這個資料庫的維護和社群的營運，而非單單的一個網站」，文章引文是這句的後半；README 最早 commit 2020-10-04 | order 0 |
| D3 | 【社群專案】島島阿學學習社群（開放文化基金會） | https://ocf.tw/p/daodao/ | ✅ 主文（Groundlane article 模式；導覽列與卡片被抽掉）。確認：2020 年起「以全志工的方式運作」、每兩週一次線上會議、「近百位志工」、2020 零時小學校前五名、2021 親子天下教育創新 100。頁面未標日期 | order 0 |
| D4 | 島島盃｜2025 春季學習馬拉松（官方活動頁） | https://daodao.so/en/learning-marathons/2025S1 | 🟡 前約 5,000 字（輸出截斷，主辦單位介紹之後未讀）。確認：計畫期間 2025-02-09～07-12、入選 20 位、引導師一對一與團體諮詢、學習小組每月聚會、申請時要填計畫簡述／動機／目標／里程碑式欄位 | order 0 |
| D5 | 學習實驗室：當我們重新思考「開始學習」這件事（島島阿學，vocus） | https://vocus.cc/article/690203fefd8978000130c914 | ✅ 正文全文（Groundlane）。發布時間 2025-10-29T18:01Z（台灣 2025-10-30）。確認：「學習計劃」要填簡述、動機、目標、里程碑，對還在探索的人不合理；主題實踐 7–30 天、彈性頻率；學習實驗室為 4 週活動 | order 0 |
| D6 | 島島阿學近況更新：在摸索中前進的這一年，卡關、收歛、重新調整（島島電子報，Kit） | https://daoda.kit.com/posts/-6 | ✅ 全文（Groundlane）。確認：「學習實驗室」因為報名人數不足而暫緩；預計 2026 年 1 月推出新形態。**注意**：頁面顯示「Published 11 months ago」（約 2025-12），正文卻寫「2024年已經來到尾聲」，與文內「上半年學習馬拉松」「預計2026年1月」對不上，判斷是原文筆誤；文章放在「2025 下半年」與內文其餘線索一致 | order 0 |
| D7 | 島島阿學近況更新：'re-Visit' 共讀聚會、島島阿學是什麼？（島島電子報，Kit） | https://daoda.kit.com/posts/re-visit | ✅ 全文（Groundlane）。確認：上半年辦《Rewire 神經可塑性》共讀，「形式上很安靜」但感受到參與者熱情；re-Visit 07/01–07/27、每週一三 21:00–22:00、島島 Discord、免費 | order 0 |
| D8 | Dao Dao 島島阿學 LinkedIn 公司頁 | https://tw.linkedin.com/company/daodaolearn | 🟡 未登入可見部分（Groundlane）：「關於我們」全文＋最近 4 則動態。確認：介紹文字與文章引文一致；有一則「重新思考島島服務的『第一個人』是誰」（頁面只顯示相對時間「1 個月」，文章寫 2026-09）。**未能確認**：文章引用的 2025-08-22 貼文「面對 5 個月的承諾時，許多人開始猶豫」不在未登入可見的動態裡；另用 Groundlane 搜原句，0 筆 | order 0 |
| F1 | McMillan, D. W. & Chavis, D. M. (1986). Sense of Community: A Definition and Theory. *Journal of Community Psychology*, 14(1) | https://cybersalon.org/wp-content/uploads/2021/06/Sense_of_Community_A_Definition_and_Theory.pdf | ✅ 全文 18 頁（curl 下載 PDF＋pdftotext）。確認：定義句逐字相符（第 143–144 行）；社區組織者例子（先問居民煩惱 → 召集會議、界定歸屬 → 選幹部、規劃行動）在 PDF 第 485–505 行。PDF 放在第三方網站 cybersalon.org，不是出版社頁面 | order 1 |
| F2 | Wenger-Trayner, E. & B. (2015). Introduction to communities of practice | https://www.wenger-trayner.com/introduction-to-communities-of-practice/ | 🟡 前約 9,000 字（Groundlane text 模式，至「Where does the concept come from?」開頭）。確認：定義句、domain／community／practice 三要素、「A website in itself is not a community of practice.」、shared repertoire（experiences, stories, tools, ways of addressing recurring problems）、「takes time and sustained interaction」。網址會 301 到不帶 www 的網域 | order 1 |
| F3 | van Mierlo, T. (2014). The 1% Rule in Four Digital Health Social Networks. *JMIR* 16(2):e33 | https://www.jmir.org/2014/2/e33 | ✅ 全文（Groundlane 回 202、內容空白；curl 同樣 202；改用 jina `read_url` 取得全文）。確認：63,990 名 actors、578,349 篇；每個社群發過文的都不到 25%（合計 19.4%）；Superusers 加權平均 74.7%。**證據限制**：作者是這四個平台所屬公司 Evolution Health Systems 的 CEO（利益衝突已揭露）；四個社群都有付費版主；74.7% 是加權平均，簡單平均是 73.6% | order 1 |
| F4 | Kraut, R. E. & Fiore, A. T. (2014). The Role of Founders in Building Online Groups. CSCW '14 | https://dl.acm.org/doi/pdf/10.1145/2531602.2531648 | ✅ 全文 11 頁，但**不是**從文章連結讀到的：ACM 連結 curl 回 403、jina 停在 Cloudflare 驗證頁；改讀作者自存版 https://kraut.hciresearch.info/wp-content/uploads/kraut14-RoleOfFounderInOnlineGroups.pdf （curl＋pdftotext）。確認：472,231 個社團、3 個月觀察期結束時 57% 已停止產生新內容；創辦人第一週活動能預測存活；三種較易失敗：創辦人是唯一管理員、與所有成員都有連結、所有成員都是創辦人加入的；多管理員的社團存活機率高 25% | order 1 |

### daodaoedu/daodao 公開 repo 的產品文件（文章有連結）

| ID | 來源 | URL | 讀取範圍 | 用於 |
|---|---|---|---|---|
| P1 | 留存診斷：動機、通知系統健檢與唯一工程項（規劃表稱「留存診斷」） | https://github.com/daodaoedu/daodao/blob/main/docs/product/gtm/retention-diagnosis.md | ✅ 全文 109 行（`gh api`；repo 是 public）。最後 commit 2026-07-10。確認：引文「管子是好的，但裡面沒有水：零密度 → 打卡沒人回應 → 通知系統無事可通知 → 社會動機的獎勵環節空轉」逐字在第 45 行；回應通知、週報「已建」。**沒找到**：文章列舉的「打卡後的動態牆」不在該文件的「已建機制」表裡（靈感牆只出現在第 93 行的零工程降級方案） | order 0 |
| P2 | 島島阿學的學習生態圈：完整描述（規劃表稱「生態圈 PRD」） | https://github.com/daodaoedu/daodao/blob/main/docs/product/prd/learning-ecosystem.md | 🟡 以關鍵字搜過全文 217 行，讀了第 8–26、146–148、198–211 行。最後 commit 2026-09-02。確認：六個指標的定義與文章表格一致（第 198–203 行）；刻意不量連續打卡天數、學習時長、嚴格 deadline 達成率，原則是「量流動、不量壓力」（第 205 行）；共同挑戰 2026-09 上線（第 146 行） | order 1、5、11 |

### 內部資料（規劃表有引用，但不在本 repo）

以下文件規劃表有引用，但 quidproquo repo 裡沒有。daodaoedu/daodao 的 `docs/product/gtm/`、`docs/product/prd/` 底下也沒有同名檔。**本次未讀，內容不作任何轉述。**

| ID | 規劃表名稱 | 狀態 | 規劃表中用於 |
|---|---|---|---|
| I1 | GTM v2（§2 B 軌、§2.1、§2.2.1、§2.3、§4、§5、Phase 2、三層架構） | 內部資料、未在 repo 中；未讀 | order 0、3、4、6、7、9、10、11 |
| I2 | 燈塔 PRD | 內部資料、未在 repo 中；未讀 | order 3、8 |
| I3 | 共同挑戰 PRD | 內部資料、未在 repo 中；未讀 | order 5 |
| I4 | 使用者口述（2026-10-29 討論） | 只記在規劃表的「經營骨架」一節 | order 0 |

（P1 留存診斷、P2 生態圈 PRD 規劃表也列為內部文件，但實際放在公開 repo，已讀，見上表。）

### 重讀結果統計

- 文章引用的 14 個 URL：**13 個這次讀得到**，其中 F4 是改讀作者自存版；**1 個主張沒能確認**（D8 LinkedIn 的 2025-08-22 引文，原因是公司頁對未登入者只顯示最近幾則動態）。
- 文章連結本身：沒有 404 或失效。ACM 連結（F4）對自動化工具回 403／Cloudflare，一般瀏覽器應該打得開，但讀者若碰到付費牆，可以改連作者自存版。
- 和文章敘述對不起來的細節：D6 正文的「2024年」筆誤（文章沒有直接引用這個年份）；P1 沒有列「打卡後的動態牆」。

## 研究足夠的五關

### order 0、1（已發布，依上表重驗）

1. **一手來源**：通過。order 0 的島島歷程都來自島島自己的公開紀錄（D1–D8）或第一方文件（P1），屬於自述的一手資料；只有 D8 那句 2025-08-22 引文沒能重新確認。order 1 的四個理論與實證主張（F1–F4）都讀過原文，F1、F3、F4 全文，F2 讀到論證所需的段落。
2. **證據類型**：大致通過，但要標明限制。order 0 是組織自述，沒有外部驗證；「密度不足是主因」是 P1 的內部診斷（推論），不是實驗結果。order 1：F1、F2 是理論與定義（作者主張）；F3、F4 是觀察性實證。F3 作者擁有被研究的平台，樣本是付費版主管理的健康社群；F4 是 Facebook 社團，套用到學習社群屬於推論。島島六個指標（P2）是內部設計，沒有效度資料。
3. **時效**：部分通過。order 0 的來源都在 2024–2026 年。order 1 的理論與實證是 1986、2014、2015 年；兩篇文章都沒有引用 2024 年以後、確認這些結論仍成立的研究。下次更新 order 1 時要補。
4. **反證**：order 1 不通過。這次重建只重讀了文章已引用的來源，沒有另外搜反證（例如 1% 法則的反例、Sense of Community 量表效度的批評、創辦人效應的後續複現）。原筆記若有做過，紀錄已遺失。order 0 主要是自述，反證的對象是「轉向幫引導者是對的」這個判斷；規劃表已要求寫明研究者是共同創辦人、案例有偏向的風險。
5. **飽和**：無法判定。原本的搜尋關鍵字與輪次紀錄都遺失了。

### order 2–12（尚未動筆）

規劃表記錄的系列層級結果是「一手大致通過、證據類型通過、時效通過、反證通過、飽和大致通過」。**這些結果現在無法重新驗證**：它們依據的案例與文獻在 `cases.md`／`frameworks.md` 裡，兩份都遺失了，規劃表裡的 `cases §x`、`frameworks §x` 也找不到對應內容。每一篇動筆前都要重做研究，並對該篇重過五關，不能沿用規劃表的結論。

## 動筆前要補的缺口

從規劃表「研究足夠的判準」一節移過來，再加上這次重建發現的項目：

1. **重建 `cases.md` 與 `frameworks.md`**：依規劃表範圍卡列出的案例（P2PU、學思達、Hack Club／HCB、六角、Write of Passage、Trevari、On Deck、Women Who Code、Buildspace、g0v、CoderDojo、Recurse、Exercism、freeCodeCamp、Slack 90 天限制、Mastodon 遷移、AO3）與實證（MOOC 完課率、cohort 對照與小組 RCT、Facebook 社團研究、Wikipedia／Stack Exchange 新人流失、開源維護者與版主倦怠、Circle 2025 營收分布、CMX 2026「17% 能有信心量化社群價值」），逐項重新讀一手來源。order 2–12 每篇動筆前至少補齊該篇用到的部分。
2. **order 5**：「共享節奏 vs 共享題目」目前是推論。動筆前補搜開放式挑戰活動（如 100 Days of Code、NaNoWriMo）的參與與回應資料。
3. **order 6**：補搜 cohort 結束後留存的研究或案例。
4. **內部文件 I1–I3**（GTM v2、燈塔 PRD、共同挑戰 PRD）：要引用的篇章動筆前，向使用者取得文件並確認可以公開的範圍；在那之前不轉述內容。
5. **order 0 小修（可選，需使用者同意才動已發布文章）**：D8 那句 2025-08-22 引文要登入 LinkedIn 確認，或改引其他來源；P1 沒有「打卡後的動態牆」，要確認這是指別的文件還是寫錯了。
6. **order 1 補時效與反證**：補一篇 2024 年以後、檢驗參與不平等或新社群存活的研究，以及至少一組 replication／criticism 搜尋。
