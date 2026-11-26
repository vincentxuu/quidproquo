# 查證與取得紀錄：2026-10-25-posture-and-back-pain（認識人體 order 14）

## 來源與讀取程度
| 來源 | 程度 | 管道 |
|---|---|---|
| Sadler 2017（PMC5418732） | 全文（摘要到限制；補充檔未讀） | Europe PMC fullTextXML（Groundlane web_fetch） |
| Igwesi-Chidobe 2025（PMC12603532） | 簡介前半、討論、限制、結論；XML 只有表格，改用 jina read_url 的 Europe PMC PDF 轉文字；結果段逐項評分未逐段讀 | 同上＋jina |
| Liu 2026（PMC13674534） | 全文 | Europe PMC fullTextXML |
| Valenciano 2020（PMC7594503） | 全文 | Europe PMC fullTextXML |
| Swain 2020（PMID 31451200）、Chun 2017（28476690） | 只讀摘要（不在 Europe PMC 全文） | Europe PMC search resultType=core |
| Mahmoud 2019（PMC6942109）、Rani 2023（PMC9941407） | 只讀摘要；fullTextXML 回 HTTP 500 | 同上；curl 連外被擋（status 000） |

PMID／PMCID／DOI 皆取自 Europe PMC 回傳（`EXT_ID:<PMID>`），未憑記憶。

## 文章裡不在來源逐字內的說法
- 「勝算約高 37%」：Sadler 寫 1/0.73=1.37、"37% greater likelihood"；文章改寫成勝算。
- 「結果主要來自兒童、青少年和年輕成人」：Sadler 寫三個研究平均年齡 12.8–27 歲；歸納是我的。
- 「這份來源沒有骨盆前傾的直接資料」：依 Sadler 討論段 "although not reported in the included studies"，並且我讀過結果段與 Table 3，沒有骨盆參數。
- 「(Sadler) 作者提出先痛後改變姿勢」：討論段原文 "the degree of lumbar lordosis may change in response to LBP developing ..."，是作者解釋與先前回顧結論不同的可能原因。
- Liu 的「受力不是疼痛」：我的歸納。作者本人把 loading 與 LBP 風險並列。
- Igwesi 的「沒有放諸四海皆準的理想姿勢」與「恐懼迴避」：標為作者立場，非回顧測得。
- 「範圍回顧」白話解釋（盤點研究與工具、不一定合併結果）：我的白話。
- 「干擾因素」白話解釋：我的白話。
- 紅旗提醒：一般性提醒，無來源，未列診斷標準。
- 「Swain 2020 只納追蹤研究的回顧結論更不一致」：摘要 "systematic reviews that included only prospective studies were less able to provide consistent conclusions"。

## 刻意不寫的
- Liu 作者的結論「direction of motion 是 modifiable risk factor」（比設計強）。
- Sadler 作者的臨床建議（可預防）。
- Singla & Veqar 2017（敘事回顧、非開放）、Chaudhuri 2023（未驗證）、Sugavanam 2025（不可讀）：未用。
- 未引用工作站、坐站交替等人因工程研究：沒有找到可讀來源。
- 未寫具體姿勢矯正動作、時間、次數。

## 試過的管道（支持「在我查的範圍內沒有找到」）
- Europe PMC 標題搜尋（posture/postural/ergonomic × neck/back pain × intervention/exercise/training，限 SR／MA，OA 與非 OA 各一輪）：命中的多是姿勢控制（平衡）、方案計畫書（BMJ Open 2022 posture-correction protocol）、學童姿勢教育、全身姿勢再教育（GPR）頸痛統合分析（Furqan 2025，非開放、不在 Europe PMC）。
- 未試 Cochrane 官網、出版社付費頁、Exa/Tavily/Firecrawl 搜尋（時間考量；使用者要的是縮小範圍，不是窮盡）。**未解決：** 不能宣稱「沒有這樣的回顧」，只能說「我在 Europe PMC 的查詢範圍內沒有可讀全文」。

## 未解決
1. Sadler 的 Table 3 的 Adams「3Space Isotrak 裝置」是否為「儀器」，英文版寫 device；今晚動作的預期結果以 Table 3 的「Equipment」欄為準。
2. 英文引文只做了 Sadler 與 Igwesi 的程式比對；Swain、Chun、Mahmoud、Rani 的內容都是摘要轉述，無引文。
3. 勝算比的白話解釋（「離 1 越遠差別越大」）是通用統計說明，未引用來源。

## 已跑的檢查
check-tw-terms（0 blocking；「頭部」警告為解剖語境）、check-process-leak、check-post-references、check-post-quality、check-lang-parity 皆無問題。未跑 lint／astro check／verify（缺依賴）。

## 審稿後更正（2026-10-25）
- 勝算比：內文改寫「0.73 小於 1，原文倒過來換算 1.37：前凸較小組勝算約為另一組 1.37 倍（高約 37%）；是勝算不是機率」。**未解決：** Sadler 文字與 Table 3 沒有明寫 0.73 的參考組標籤（forest plot 圖未讀），方向依作者文字「OR 1.37 or 37% greater likelihood in people with restricted lumbar lordosis」判斷。
- 前凸合併由 Adams 帶動：Table 3 Adams 0.56（0.38–0.83）權重 35.48%，Milgrom 0.88（0.48–1.62）、Nissinen 0.84（0.61–1.16）區間跨 1。文章只寫「只有 Adams 自己的結果明顯、合併主要由 Adams 帶動」（「主要由…帶動」為我依權重與區間的歸納）。
- 「以前痛過」限定為前凸三篇中只有 Adams（Sadler 結果段：Adams 屬含痛過者；Milgrom、Nissinen 為無痛史）。
- 骨盆：改用原文 sacral slope／pelvic incidence（骶骨坡度、骨盆入射角）；「沒有直接資料」限定為追蹤研究；補 Liu 2026 Table 3 的 Rahman 2025（護理師 13 vs 13，橫斷式，負重移動時 pelvic tilt 較大）並註明是動態作業。
- tldr／內文：「前凸變大」改為「這份回顧沒有分析」。
- 頸部：只有 Mahmoud 摘要明講橫斷式；Rani 摘要沒寫設計（文章已如此寫）；glossary 改為 Mahmoud。Chun 改「摘要說是觀察性研究」。Swain 補前半句（合併分析較常支持關聯）。
- 「環境」歸 Sadler；Liu 是心理、社經、生活型態（Liu 討論段原文確認）。
- 刪「舉重物時的受力」整節（含 15 人模型數字），僅保留 Liu Table 3 的骨盆傾斜一句與 Liu 作為「社經與生活型態」來源。Liu 仍列在參考資料。
- 就醫提醒前移（結論段後一句＋獨立小節「背痛什麼時候該先就醫」，註明非研究內容、非完整清單）。補「不表示姿勢不重要」「沒找到證據不等於沒效」。
- 補連 what-is-pain、imaging-findings-and-pain（檔案存在，標題已核對）。
- 專名白話：前瞻性世代、偏誤風險、隨機分組、比較組、橫斷式、干擾因素、信賴區間、勝算比。
- 動作 1 改為內文題（12 個月；平均 12.8–27 歲；上緣 0.98）；動作 2 加「頭前傾和頸痛有關」（答案：橫斷式、只能說同時存在）。
- Igwesi 三處作者陳述本次仍未重取正文，沿用先前 PDF 比對；文章已標為作者立場／推論。
- 長度：中文正文（不含參考資料）約 3,100 字元（原約 4,100）。
