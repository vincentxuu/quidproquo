# 查證與取得紀錄：2026-10-25-warm-up-and-training-load（認識人體 order 10）

## 來源與讀取程度

- Quarmby 2023（PMC10756908）：全文（Europe PMC fullTextXML，73,913 字元）；引文已程式比對。
- Herman 2012（PMC3408383）：全文讀過（106,419 字元），**沒有存檔也沒有逐字引文**；文章裡的數字（RR 0.67／0.45、9 項研究、年齡 13–26、叢集隨機 1,982 人約八個月）為轉述，未程式比對。
- Kłobuchowski 2026（PMC13210987）：全文已存檔，部分段落讀（方法、結果開頭、討論、結論）；文章只用摘要句，已比對。
- Gabbett 2016（PMC4789704）：全文已存檔；引文已比對。
- Ding 2026（PMC13520966）：全文已存檔；用摘要與結論句；已比對。
- Impellizzeri 2020、2021、Wang 2020、Dalen-Lorentsen 2021：**只有摘要**（Europe PMC search API）。文章與參考資料皆標「僅讀摘要」。

## 試過的管道（為「找不到」限定範圍）

- curl 直連 ebi.ac.uk 被 proxy 403；改用 Groundlane web_fetch 成功。
- 暖身表現面：Europe PMC 搜尋標題含 warm-up＋performance 的開放近年系統性回顧，只找到再暖身、PAPE 等窄題（Zheng 2026、Zhang 2026、Yang 2026、Zhu 2026）。未讀其全文；選用較綜合的 Kłobuchowski 2026，但品質有限。Silva 2018、McCrary 2015、Behm 2021 為非開放。
- ACWR 批評：Impellizzeri 2020／2021、Wang 2020、Lolli 2019、Dalen-Lorentsen 2021 皆無 PMCID（非開放），Europe PMC 只有摘要（Lolli 2019 連摘要也沒有）。未試 BJSM／IJSPP 開放版本或預印本（時間範圍內未查）。
- Han 2025（攀岩暖身 RCT）：授權狀態矛盾，未讀。

## 文章裡不在來源逐字內的說法

- 「兩者問的其實是不同問題」「證據層級不同，不能互相借用」：本文的架構判斷。
- 「所以這些試驗比較的是結構化計畫與平常暖身，沒有回答暖身比完全不暖身好多少」：由 Herman 表 4 對照組欄位（Normal warm-up strategy 等）推得；Brushøj 的對照是上半身計畫。這是本文的解讀。
- 「11+ 即 FIFA 11+」：Herman 內文只寫 The 11+；FIFA 11+ 的關聯來自 Kłobuchowski 摘要的 "FIFA 11+" 與 11+ 是同一計畫的常識，**未在來源內逐字確認二者等同**（Herman 的 Soligard 試驗標題為 Comprehensive warm-up programme…）。若審稿要更保守，可改成只寫「11+」。
- 「Gabbett 說比值很高的下一週風險較高」：僅限他引用的板球投手研究；文章已限定「在某些運動中」。
- 「作者本人推薦這個指標」：由 Gabbett 自述 "I describe the critical variable—acute:chronic workload ratio—as a best practice predictor" 推得（該句在摘要）。
- 「Gabbett 的核心想法仍是合理假說」：本文立場。
- 動作 2 的 1.5 與 1.33：算術（180/120=1.5；最近四週含第五週平均 (120*3+180)/4=135，180/135=1.33）。窗口已在正文寫明。

## 刻意不寫的內容

- 暖身的內容、時間、順序；ACWR 的 0.8–1.3／1.5 區間；Herman 各計畫的 NNT、各傷害部位 RR 細節；Kłobuchowski 的 RR 範圍與離心訓練；兒童、老人。
- Quarmby 的肌力訓練預防肩肘傷（第 7 篇範圍外，與本題無關）。

## 未解決

1. （已解決）動作 2 第二種算法的平均窗口已在正文寫明為最近四週含第五週。
2. Herman 無逐字引文與數字程式比對。
3. Kłobuchowski 的品質（LLM 編修、kappa 0.44）已在精讀紀錄，文章只說「差異很大」。
4. 11+ 與 FIFA 11+ 的等同未在來源內確認（見上）。

## 審稿後更正（2026-10-25）

改了：
- Soligard 2008（PMID 19066253，PMC2600961，DOI 10.1136/bmj.a2469）補讀**摘要**（Europe PMC search API）：125 個俱樂部、1,892 名 13–17 歲女球員、一季八個月、主要結局下肢傷害 rate ratio 0.71（0.49–1.03）未達顯著；整體 0.68、過度使用 0.47、嚴重 0.55。文章改以 Soligard 為叢集隨機與 11+ 結果的來源，Herman 的 0.67／0.45 改寫成「回顧重算的數字」。Herman 內文人數 1,982 與 Soligard 1,892 不一致，文章不引人數 1,982。
- 「FIFA 11+」改「11+（後來稱 FIFA 11+）」（等同由 Soligard 試驗為該計畫原始試驗＋常識；仍未在已取得來源逐字確認）。
- 「對照組做平常暖身」改為「9 項中 8 項；11+ 試驗也是；一項（Brushøj）是上半身計畫」，並說明「所以多半比較…」。
- Ding 2026「前瞻性」改「觀察研究」（摘要與方法寫法不一致）。
- 動作 2 數字改 120×4 + 140：1.17 與 1.12（140/120=1.1667；(120*3+140)/4=125，140/125=1.12），避開 1.3／1.5，並加「不代表安全或危險」。算法差異歸因改為 Ding 指出各研究計算方式與時間窗不一致，不再說是 Impellizzeri 的意思。
- 與 climbing-warm-up 不矛盾：「找不到」改成「在我查的範圍內，沒找到我能免費讀全文的」；註明該文流程是專家建議。我沒讀該文引的試驗原文。
- Quarmby 三項（結果段）vs 四項（討論段）已在正文並陳。
- 表現／防傷貫穿標題、description、tldr、結論與小標；補 ACWR 段就醫提醒；Gabbett 想法改成「是否成立，這些資料沒有回答」；Kłobuchowski 改「讀了方法、結果開頭與結論」並說明為何不引其防傷結果。
- 新增站內連結：tendons-and-load、recovery-and-sleep、core-stretching-foam-rolling、motor-learning（只用標題作連結名，未描述其內容）。
- 動作 1 換成「三句話分類」，附預期答案。
- 縮篇：正文約 3,800 字元（不含網址與參考資料）。

仍未解決：
1. Herman 全文只讀未存檔，數字未程式比對（與 Soligard 摘要比對有出入，已在文中並陳）。
2. Soligard 只讀摘要。
3. 「Gabbett 為敘述性回顧」是本文分類；已從正文刪除這個標籤，只留「回顧」。
