# 查證與取得紀錄：2026-10-25-imaging-findings-and-pain（認識人體 order 15）

## 來源與讀取程度
- Teraguchi 2026（PMC13152712）：全文讀過，引文程式比對通過（空白正規化）；補充表沒讀。
- Ibounig 2025（PMC11697641）：全文讀過，引文程式比對通過；補充表／圖沒讀。
- Brinjikji 2015a／2015b：**只讀摘要**（Europe PMC search core 回傳）。試過：Europe PMC fullTextXML（isOpenAccess=N，500）、europepmc.org pdf=render（browser 錯誤）、ncbi PMC pdf（403）。在我查的範圍內讀不到全文；文章與參考資料皆標「僅讀摘要」。
- 精讀紀錄：`extractions/imaging-findings-and-pain.md`。

## 文章裡不在來源逐字內的說法
- 「盛行率 vs 因果」的區分、「兩者都隨年齡增加所以可能同時出現」：一般流病概念解釋（Brinjikji 摘要只說 "likely part of normal aging"）；已標為推論／說明。
- 「約兩倍多的勝算」：由 OR 2.24 白話改寫。
- 「橫斷式研究」「勝算比」「系統性回顧」的定義：白話解釋。
- 「許特爾氏結節（Schmorl node）」譯名：未在樂詞網核對。
- 「就醫提醒」段（腿無力或麻木加重、大小便控制異常、發燒、受傷後劇痛、疼痛惡化）：一般安全提醒，**不是來源內容**，文內已明講。
- 「三份研究」的稱呼：實際引用四篇（Brinjikji 兩篇算脊椎組）；文章內文分脊椎／日本社區／肩膀三組。
- ODI 白話說明、「約六成三」：Teraguchi 摘要 63.0%、內文 63.4%。
- 「椎間盤退化＝Pfirrmann 第 4 或 5 級至少一節」：來自方法段。

## 刻意不寫的
- Teraguchi 的肥胖／男性預測因子與減重建議（涉及體重，依簡報不寫）。
- Ibounig 對 AC 以外的次要細節（滑囊、鈣化百分比等）。
- 膝蓋：沒有讀到來源。
- 不點名影像報告的特定詞該怎麼處理或要不要手術。

## 未解決
- Brinjikji 全文：2015a 的納入標準、無症狀定義、影像模態（CT 與 MRI 混合）細節、2015b 的年齡限制之外的異質性，都只知摘要。需要全文時請走 AJNR 官網或機構權限。
- 63.0 vs 63.4% 的來源內不一致，沒有向作者確認。
- 英文引文 "likely part of normal aging and unassociated with pain" 取自摘要，非程式比對全文。

## 已跑的檢查
check-tw-terms、check-process-leak、check-post-references、check-post-quality、check-lang-parity：無 blocking（第一版 tag 警告已改 tag）。未跑 lint／astro check／verify。

## 審稿後更正（2026-10-25）
- 「許特爾氏結節」改「許莫氏結節（Schmorl's node）」並加白話；仍未在樂詞網核對，找不到官方定名時以英文括號為準。Modic 只留一次並加白話；脊椎峽部裂、高強度區、纖維環裂縫、Modic 1 型從行文刪除。
- 「三份研究」改「四篇研究（脊椎兩篇、日本社區、肩膀）」；2015b 的主結果（有痛者部分發現較常見）與 2015a 分開寫；tldr 的「關聯有限」改為「有些發現較常見、有些看不出差別」。
- Teraguchi：調整因子寫「原文內文寫調整年齡，摘要另列性別、肥胖、疼痛強度與體能表現，前後不完全一致」；補未調整結果（DD 95.4 vs 91.5%；Schmorl 32.9 vs 45.7%）；ODI 循環說明改為「ODI 區分功能是定義使然」。
- Ibounig：補人口研究平均 65 歲、其他研究平均 41 歲（結果段 "mean participant age 65 years"、"mean age 41 years"）；補結果段 "Overall, the data suggest a trend of increasing prevalence with age"；補有症狀比較是敘述性、只有部分研究；明講用調整過的 GRADE（方法段 "we adapted the GRADE approach for prognostic studies"）。
- 「年輕」統一為「50 歲以下（或更年輕）的成人」。
- 範圍（只有脊椎與肩，不含膝、髖、頸）放進標題、description、tldr、導言。
- 紅旗症狀提前到導言後，分級（急診或當天／儘快就醫），補鞍區麻木、不明原因體重下降、癌症病史、夜間痛、外傷後抬不起手、肩痛合併胸悶胸痛；註明不是來自研究。**沒有加外部來源連結**（未查臨床指引，列未解決）。
- 「不是開放取用」改「這次沒有取得全文」。Brinjikji 的 GRADE：改寫成「不知道它對研究品質與證據確定性怎麼評估」；日本研究不承諾確定性。
- 動作 1 改為四句分類題（答案 a 盛行率、c 關聯、b/d 因果）；動作 2 刪同義反覆預期、註明沒報告就跳過。
- 補連 what-is-pain 與 posture-and-back-pain（兩篇皆已存在於 repo）。
- 縮篇：正文約 3,900 字元（不含空白，不含參考資料）。刪日本研究的 87–89% 分組細節與多數限制、肩膀的次要範圍清單與盂肱旁支、脊椎 2015a 的次要子項、Brinjikji 2015b 的多數發現清單。
- 未解決：紅旗症狀外部來源；樂詞網譯名；Brinjikji 全文；Teraguchi 表 3 與內文調整因子不一致未向作者確認。
