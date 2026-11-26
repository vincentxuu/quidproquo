# 查證與取得紀錄：2026-10-25-menstrual-cycle-and-training（認識人體 order 19）

## 來源與讀取程度

- McNulty 2020（PMC7497427，DOI 10.1007/s40279-020-01319-3）：Europe PMC 全文 XML 全取回，讀摘要、Key Points、方法與結論；引文已程式比對。
- D'Souza 2023（PMC10979803，DOI 10.1152/japplphysiol.00346.2023）：全文取回，讀導論、正常週期、運動表現、肌肉適應、結論；引文已程式比對。
- D'Souza 2026（PMC13561106，DOI 10.1249/MSS.0000000000004031）：全文取回，讀摘要、導論、方法、結果前段、討論與限制；引文已程式比對。
- 精讀紀錄 `.work/research/human-body-basics/extractions/menstrual-cycle-and-training.md`。
- 取得管道：Groundlane `web_fetch` 對 Europe PMC fullTextXML 成功（McNulty 第一次 502，重試成功）。curl 連外被擋，沒用。PMID／PMCID 取自全文 XML 標頭，未另用 `EXT_ID:… AND SRC:MED` 查詢（curl 被擋，未試其他管道核對）；DOI 取自同一份 XML。

## 文章裡不在來源逐字內的說法

- 「約六個小階段」：由 D'Souza 2023 列的 early follicular、late follicular、ovulation、early luteal、midluteal、late luteal 整理。
- 「濾泡期＝月經開始到排卵」：由 2023 的「divided at ovulation」與 2026 對濾泡期的操作型定義（onset of menstruation to 24 h after positive LH）整理。
- 「統合分析是把多個研究的數據合併計算」「隨機對照試驗因果推論比觀察性研究可靠」：一般方法學白話，非來源逐字。
- 「雌激素與黃體素」在 2023 的圖與文字中以 estradiol／progesterone 出現；文章用「雌激素、黃體素」是常見譯名，未在樂詞網核對。
- 「連方向都不夠確定」：我對「可信區間跨過零」的白話解釋。
- 「兩個研究只把近期有傷當作排除條件」：McNulty（free from any injury that would affect participation）與 2026（lower-body injury in past 6 months）；2023 提到 injury 只在「症狀可能來自 lifestyle、injury、illness…」一句。
- 「不能直接當成 GRADE 等級」：McNulty 方法為「a strategy based on the recommendations of the GRADE working group」，我據此判斷其 42% 是自訂分數。
- 「2023 與 2026 作者群高度重疊」：兩篇作者列都含 D'Souza、Colenso-Semple、Phillips 等（2026 已讀到作者名單；McMaster 為同一單位）。

## 刻意不寫進正文的

- RED-S／相對能量不足的任何數字或標準（未讀到可靠來源）。
- 任何「某階段該怎麼練」。
- Colenso-Semple 2024 J Physiol（肌肉蛋白質合成）、Colenso-Semple 傘狀回顧、Elliott-Sale 2020／2021、Britton 2026：未精讀，只在引用 2023／2026 時間接出現（避孕藥統合分析以「轉述」標示）。
- 2023 的脂肪／醣類氧化統合分析、血管段。
- 早期支持濾泡期的研究（Sung、Wikström-Frisén 等）的名字與數字：未讀原文。
- 2026 的肌纖維、毛細血管結果與逐項數字。
- 馬拉松、田徑 100/200 m 的個別研究（2023 轉述，各有方法限制）。

## 未解決

1. 2026 論文的利益揭露：全文 XML 沒找到，未寫入文章。
2. 本篇多處由 2023 轉述（調查、控制較嚴謹的研究、Elliott-Sale），未讀原研究；文章都標了「引述」或「轉述」。
3. 攀岩性別差異、攀岩者與週期的專門回顧：在我查的範圍內（掃描檔 F 組 Europe PMC 標題搜尋）沒有找到。
4. McNulty 2020 的結果表與討論未逐段讀；若審稿者要查「80 項耐力結果中 7 項」類細節，需對 D'Souza 2023 的轉述再核。
5. 「57%」是丹麥精英女運動員（Tier 3 以上）使用荷爾蒙避孕的比例，來自 2023 引述的 Oxfeldt 等調查，未讀原文。

## 已跑的檢查

check-tw-terms（0 blocking）、check-process-leak（0 error，2 個參考資料數量 warning）、check-post-references、check-post-quality、check-lang-parity 皆通過。未跑 lint／astro check／verify（缺依賴）。

## 審稿後更正（2026-10-25）

- 42%：McNulty 結果段寫 8% 高、24% 中、42% 低、26% 極低，42% 是「被評為低品質的研究比例」，不是自訂分數；先前「依 GRADE 建議自訂的分數」是我的錯誤推論，已改為「整體評為低；評法改編自 GRADE，非正式 GRADE 等級；各等級佔比」。精讀紀錄第 3 點同步作廢。
- 利益揭露：2026 全文致謝後有揭露段（我先前漏看）。已中性寫入：Phillips 的研究經費（Nestlé Health Sciences、FrieslandCampina、US National Dairy Council、Dairy Farmers of Canada、Cargill 等）、差旅與講者費、Exerkine 專利；FrieslandCampina 提供豌豆蛋白；本研究由 NSERC 補助。不推論動機。McNulty 2020 的揭露段仍未讀。
- 作者重疊：先前「兩篇都含 Colenso-Semple」錯誤。實際只有 D'Souza 與 Phillips 兩位重疊，改為「同一實驗室、第一與通訊作者相同」。
- 階段確認方法：2023 只說多數研究只在一個階段驗證、作者認為可能導致不實結論；月曆／基礎體溫出自 2026 對早期研究的批評。已拆開歸屬，刪除「很費工」的自己推論。
- 兩條腿：原文為每人兩條腿、各分到四種條件中的一種（每人兩種）；已改寫。
- 總訓練量：改為「設計上配對，實際完成量無顯著差異（P≥0.46）」。
- 限制清單：分成「作者列的限制」與「本文觀察（只測大腿、兩段分期、受試者族群）」；補上等效檢定結果（瘦組織量全部通過、力量大多不確定）。
- McNulty 範圍：51 個研究用於第一項、73 個用於第二項；「連方向不確定」改為「無法排除沒有差距」。
- 停經：改為「原本有月經卻連續好幾個月沒來」請問醫師；更年期與停經後另列為範圍外並連到老化篇。
- 其他：tldr 改「沒有發現差別」；補避孕藥「勿自行停藥」；補多囊、子宮內膜異位、跨性別來源未涵蓋；動作 2 加三問檢查；「急性」改「單次運動時」；來源說明段移到開頭獨立一節；縮短感受節。
- 仍未解決：Key Points「第一條」是依 XML 文字順序推定，未看出版社頁面的 bullet 邊界；McNulty 利益揭露未讀；2023 轉述的原研究未讀。
