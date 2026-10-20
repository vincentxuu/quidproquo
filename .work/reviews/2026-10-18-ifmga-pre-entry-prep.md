# Review: 2026-10-18-ifmga-pre-entry-prep（zh + en）

Review date: 2026-10-18. Scope: 中英兩版，系列 order 11。獨立審稿（非作者）。

## post-verify

工具降級：Groundlane MCP（`web_fetch`）與 firecrawl 回「not connected」。改用 curl 直抓原頁（31 頁）、Exa `web_fetch_exa`（紐西蘭移民署頁被 Incapsula 擋 curl，r.jina.ai 回空，Exa 取得全文）、本地 pdftotext（ENSM 2025/2026 清單、EEMGA Platform）。原始檔：scratchpad `verify-fetch/`。

實際打開來源核對 31 條（高風險 18 條）：

- 🟢 Confirmed：CGC 夏季準備班 2,525€、2027 年 5/10 起、2025 年 28 人 7 人考上；CGC 冬季班 1,545€／3 週；CGC 入門高山 1,140€（4 人價）；Ski touring Autonomy L1 710€；Sharpe 580€ 起；Cosmiques 半膳 82€；紐西蘭打工度假 18–30 歲、12 個月、上課合計 6 個月、「closed for 2026」；NZMGA「resident or current work permit」、滑雪 30 天、3 季其中 2 季在紐西蘭；Alpine Guides 滑雪登山 6 天 NZ$4,525、7–11 月；TMC 8 天 NZ$5,525、11–2 月；Adventure Consultants TMC 8 天 NZ$5,450；ASC1 1.5 天 NZ$495；JAN L1 7 天 16 萬日圓、白馬小谷、1 月與 3 月兩期、8/24 含候補全部截止；Rising Sun 39,000、HBC 40,000 日圓；赤岳鉱泉 1 泊 2 食 14,000 日圓、冰塔 1 日券 1,000 日圓；首爾攀岩學校 4 週末 70 萬韓元、含住宿與保險；구곡폭포 每日 40 人、2026-01-13 起；韓國免簽 90 天；申根 90/180；TVBS 武嶺滑雪可罰 1,500 元；雪霸 2026 雪季 1/1–3/31 附自我檢查表；雪攀嚮導新訓 2025-12-21～24 八岳；翠池線滑落近 300 m；ENSM 55 條／3 年／24 條、滑雪 15 趟 >1,300 m／7 趟冰河、WI5 ×3 ≥150 m、造假 exclusion immédiate、口試最長 1 小時；IFMGA Platform 25 趟 ≥1,000 m、10 天冰河 ≥1,400 m。
- 🔴 Contradicted → 已修：杉坂嚮導阿弥陀北稜、赤岳主稜一對一是 95,000 日圓（頁面現價），文寫 88,000–98,000。
- 🟠 Outdated → 已修：UCPA 滑雪登山週頁面 JSON `productPriceFrom` 現為 1,390€，文寫 1,375€。
- 🔵 Misframed → 已修：
  - ENSM 長征：原文是「必須含 1 次 ≥3 天 raid，只算 15 趟中的 1 趟」，文只寫「只算 1 趟」，漏了「必須有」。
  - CGC 表頭寫「2027 年價目」，但冬季班頁面是「Tarifs 2026」→ 表頭改「2026-10-18 查詢的公告價」，冬季列標 2026 年價目。
  - 雪況對比拿「近十年最深 145 cm」對「去年初雪 1 cm」，初雪本來就薄，不能說明年際差 → 改用同一篇中央社：2016 年 145 cm、之後 5 年都沒超過 90 cm；刪掉華視連結與參考條目。
  - 私人嚮導 480€ 是 Peak Powder 的滑雪嚮導日費、不是高山路線；Sharpe 580€ 是高山／攀岩起價 → 標明各自類別；並補「你要付嚮導的山屋半膳」（Sharpe 頁 Not Included 列有 Guide hut expenses），讓 1,150–1,400€ 的加總有依據。
  - glossary「輪流領攀＝至少一半繩距先鋒」：2026 清單 PDF 沒有這句，出處是 ENSM 培訓頁（「au moins 50 % des longueurs effectuées en tête」）→ glossary 連結改指培訓頁。
- 🟡 Unverifiable／未逐條重開（依研究筆記與作者已下載檔）：太魯閣規劃報告引文、國家地理玉山東峰北壁、山谷登山會紀錄、山下勝弘 WI 對照、御前沢 700 m、JMGA 2026 不招新、BMG 4 年、AMGA 5 年、考生案例年數。赤岳鉱泉冰塔價格出自 2024–25 季公告，新一季可能調整，正文已寫「查詢的公告價」，未另加但書。

範圍聲明：本次只檢查了文中已提出的宣告，未評估文章對主題的覆蓋是否完整。

## post-review

機械檢查（修後）：`check:references` 本文 0 錯；`check:tw` 0 擋下、0 待看；`check:lang-parity` 2909 對無問題；`check:series-plan` 修前只缺本審稿檔。

發現：
- 🟡 系列連結列漏 4 篇（order 1 怎麼請嚮導、4 奧德義、7 西班牙與中東歐、9 南美）→ 已補齊中英兩版。
- 🟡 「要在留卡」對台灣讀者不好懂 → 改「報名要附在留卡（日本的居留證）」。
- 與第 2 篇（training-and-exams）對照：55 條、3 年、24 條、滑雪 25 趟 ≥1,000 m／冰河 ≥1,400 m、6b、WI4、AMGA 攀岩 5 年都一致；本篇不重列入學考，只連過去。
- 與第 10 篇（taiwan-path）對照：JMGA 接受 JAN L1 抵雪崩檢定、山域嚮導證四類、路線紀錄建議一致；taiwan-path 第 140 行已導向本篇，本篇沒有重講那 6 點。
- frontmatter：tags 6 個、type guide、tldr 有「推估」但書、數字與正文一致；description 與 tldr 不重複。
- inline 連結：每個價格、法規、數字都有原位連結。
- 結構：清單 → 能力地圖 → 台灣能／不能 → 日韓 → 阿爾卑斯／紐西蘭 → 年數 → 紀錄 → 行動，開頭的兩個問題都有回答。

未修（可選）：「雪少的年份多半是硬冰」是由雪霸處「步道沿途許多硬冰」推出的概括，可接受；作者可決定是否加連結。

## post-polish

register-scan（修前）：長句 0、但書 2%、引述 0、數字密度單段 ≥4：0、姓名主詞 0、模板化轉折 0、英文術語 0。phrase ledger：0 命中。

修後：長句 1（系列連結列 82 字，是連結清單，保留）；改寫雪況句時一度出現 6 個數字的段落，再改成「2016 年積到 145 cm，之後 5 年都沒超過 90 cm」（4 個數字，讀者需要的對比）。

人工回讀：段落短、句首銜接順；嚮導費段改寫後把「誰付山屋」講白。其餘不動。
