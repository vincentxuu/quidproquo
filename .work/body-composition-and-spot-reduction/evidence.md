# 查證與取得紀錄：2026-10-25-body-composition-and-spot-reduction（認識人體 order 20）

## 來源與讀取程度
- Paoli 2021（PMC8038840）：全文讀過（Europe PMC XML，未截斷）。**是 14 人 RCT，不是系統性回顧**；簡報／規劃表誤標，已在文章中按實際設計寫。
- Brobakken 2023（PMC10680576）：全文讀過。
- Ramírez-Campillo 2022（Hum Mov）：**只讀摘要**（期刊頁）。全文試過 Semantic Scholar PDF（web_fetch 與 document_parse 皆 OUTPUT_LIMIT）、doi.org（403 驗證頁）。無 PMID。文章與參考資料已標「只讀摘要」。
- 引文：只比對「我貼進 `bc/src_excerpts.txt` 的原句」，非獨立下載全文比對（curl 被 proxy 403；Groundlane 輸出未存檔）。文章英文引文共 3 句：“it is unclear if the findings translate to women”、“Fourteen volunteers”、“pooled ES”，加 “37 comparisons”（行文引述，位於摘要）。

## 文章裡不在來源逐字內的說法
- 「效果量可以想成兩側差多少、0 是沒差；信賴區間跨過 0 表示這份資料看不出差別」：白話解釋。
- 「兩個試驗合計 30 人」：14＋16 加總。
- 「比較穩當的說法是證據不支持，但沒有大型確定答案」：我的歸納。
- 「各試驗量的、比的、人數」的「為什麼對不上」前兩項標為作者所寫（Paoli 與 Brobakken 引言），中間兩項標為我的歸納。
- 「腹部運動組每次 84 分鐘、幾乎是只跑步組兩倍」：作者在討論自己寫 "almost double"。
- 「Paoli 引言寫全身脂肪可透過飲食或運動減少」：原文 "The reduction of total body fat can be achieved through diet and/or exercise intervention"（引用 Swift 2018、Elagizi 2020，未讀）。

## 刻意不寫的內容
- 任何體重、體脂、熱量、飲食或減重做法；各研究的體重降幅（kg）與體脂百分比數字。
- Hummov 結論尾句（influencers／wishful thinking）。
- 不點名任何貼文或帳號，不寫查證貼文。
- 攀岩者體重議題（只寫「沒資料、不在此討論」）。
- Brobakken 的機制推論（脂質動員、肌內三酸甘油酯、血流）只說「作者說機制不明」。

## 試過的管道（運動 vs 飲食缺口）
Europe PMC 標題搜尋（weight loss/fat loss＋exercise＋diet、SR／meta、OA、2018 後）只得 4 筆且主題偏離（NAFLD、骨密度、OSA）；Swift 2018（DOI 10.1016/j.pcad.2018.07.014）Europe PMC 標非 OA、無全文；候選 Busk-Cirera 2026、Fatmawati 2025（品質存疑）未精讀，且前者屬減重介入與藥物手術，不符本系列邊界。結論：在我查的範圍內無免費近年 SR，文章據實寫「回答不了」。

## 未解決
1. Hummov 全文限制未知；若主代理有管道讀全文，可補作者限制。
2. Paoli 的 8 週 vs 12 週不一致，未向作者查證。
3. Brobakken 的臨床試驗登記號 NCT05794854 是否為事後登記，未查（文中未提）。
4. 引文為「貼入原句」比對，非獨立比對。
5. 規劃表 order 20 的來源狀態欄把 Paoli 寫成 SR，建議主代理更正（我沒碰規劃表）。

## 已跑檢查
check-tw-terms（0）、check-process-leak（0）、check-post-references（0 error；2 warn：參考資料連結 3 個）、check-post-quality、check-lang-parity 皆無 blocking。未跑 lint／astro check／verify。

## 審稿後更正（2026-10-25）
- tldr／結論／標題改為依部位分層：統合分析只測單側肢體（摘要舉例 single-leg），不含腹部／軀幹；「手臂」一詞刪除（摘要沒寫，改「肢體」）。兩個試驗都看到腹部或軀幹減少，只有 Brobakken 報告組間差異（Paoli 只有組內）。刪除「彼此也不一致」。
- Paoli：交代 18 人入組（全文方法段）、4 人因出席不足排除、分析 7＋7 = 14；行動 1 說明摘要與全文人數差異。刪除無出處的「有男有女、有過重也有不過重」。
- 「沒控制飲食」改為「只要求不改變飲食、沒有量測攝取」。
- 為什麼對不上：逐項標來源（引言／我的歸納／Brobakken 討論）。
- 刪「先把問題講清楚」整節、攀岩診斷文連結與攀岩段縮為兩句；en 內部連結加 -en。
- 標題改「練哪裡，哪裡的脂肪就減得比較多嗎」，tag fat-loss 移除，改 subcutaneous-fat。
- polish：統合分析正文只留 −0.03 與信賴區間，37／17／20 移到行動段；皮褶夾、超音波（保留）、生物電阻抗加白話；「代償」加白話；5–6 倍標準差一句刪除；「作者」去重。
- 未再獨立下載全文比對：英文引文三句與 “37 comparisons” 先前已對貼檔比對，審稿者另以重取原文核對一致。
- 仍未解決：Ramírez-Campillo 全文；Paoli 8 vs 12 週不一致（不寫入正文）；Paoli 脊豎肌脂肪也減少、前大腿增加、Brobakken 基線 AG 較高等細節未寫（審稿者列為可選）。
