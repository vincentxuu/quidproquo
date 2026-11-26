# 查證與取得紀錄：balance-and-fall-prevention（order 12）

## 來源與讀取程度
- Khan 2025 Eur Geriatr Med：PMC12743702，全文（Europe PMC fullTextXML 前 100,000 字元 + Springer 討論段）。見精讀紀錄。
- Sherrington 2019 Cochrane：PMID 30703272，**只讀摘要**（Europe PMC search core 回傳）。
- WHO 2020：沿用 `extractions/who-2020-physical-activity-guidelines.md`（#8、#9、限制 1）。本篇未重新取得全文。
- PMID/PMCID/DOI 皆以 Europe PMC `EXT_ID:<PMID> AND SRC:MED` 回傳值核對（Khan、Sherrington）；WHO DOI 取自既有紀錄。

## 試過的管道（為何 Cochrane 與 ESSA 沒讀全文）
- Cochrane 全文：Europe PMC fullTextXML 在先前掃描回 HTTP 500；PMC6360922 標 isOpenAccess=N；本次改走 Europe PMC search core 取得摘要，未再試 Cochrane 官網或 PDF 連結（curl 對 ebi.ac.uk 回 403，經 proxy 擋）。
- ESSA 立場聲明（Tiedemann 2025，PMID 39341781）：掃描表標 isOA=N、Europe PMC 無全文；本次未另外嘗試其他管道。
- 以上「沒讀」均限於我查的範圍，不代表無法取得。

## 文章裡不在來源逐字內的說法
- 「系統性回顧是先訂好規則，把符合條件的研究都找來」「隨機對照試驗是…隨機分組」「統合分析是把多個研究數字合併」「I² 衡量各研究結果有多不一致」：通識性白話解釋，非來源引文。
- 「24% 不是每個人少跌 24%」：對率比的白話詮釋（率比 0.76 = 次數比），由我加；Cochrane 摘要自己寫 "reduces the rate of falls by 24%"。
- 「平衡測驗進步 vs. 跌倒次數」的二分框架：我的編排，來源 Khan 表 1 的指標分類（BBS/FAB/TUG/dTUG 與 falls）。
- 「統計上有差但平均沒大到有感」：作者原句是 MD 沒達 MCID；"有感" 為 MCID 的白話定義（glossary），定義由我寫。
- 「不要為了試試看單腳站」：安全提醒，非來源內容。
- 「跌倒受傷後的痛」連到 what-is-pain：依規劃表 12→13 斷崖處理；該篇尚未存在時 check-post-references 會報錯，需待該篇建立。
- Khan 的量表描述（14 項、0–56；TUG 3 公尺）來自 Khan 方法段，glossary 用。

## 刻意不寫的內容
- Khan 的最佳劑量與 95% 出席的建議（見精讀紀錄「要小心的」）。
- Cochrane 摘要的 Tai Chi、多元運動（RaR 0.66）數字：避免數字過密，也不比較運動型態。
- 骨折、需就醫的跌倒等次要結果（低確定性）。
- 「美國每四位 65 歲以上的人每年跌倒」等 Khan 引言的流行病學數字：為二手引用，未查原始來源。
- 任何運動課表、頻率與強度。

## 未解決
1. Khan 跌倒 MD（−0.33）的單位與計算方式不明；Table 3 為 −0.30。已在文中說明不換算。
2. Khan 摘要與結果段對低偏差風險比例（58% vs 54%）不一致；文章未引用此數字。
3. Khan 的 GRADE 細節（補充檔 3）未讀。
4. Cochrane 全文、ESSA 立場聲明、Dyer 2025（照護機構）、Li 2024（太極）未讀。
5. check-post-references 對 `/posts/learning/2026-10-25-what-is-pain`（與 -en）報錯，因該篇尚未建立；其他檢查通過。

## 審稿後更正（2026-10-25）
改了：
- WHO 段刪除「每週 3 天以上、中等以上強度」，只留結論並連回〈一週要動多少〉與〈年紀大了肌力怎麼變〉；補「WHO 老年人指 65 歲以上」；「一般族群」改為「老年人建議也涵蓋慢性病與身心障礙者，但缺直接證據、靠推測延伸」。
- Cochrane「全文不是開放取用」改成「全文我沒讀」（Europe PMC 有免費全文連結，我沒去讀）。
- 「照護機構不在範圍」改成：Cochrane 只含社區居住者；Khan 有少數照護機構試驗，文中沒按場所拆開（zh「這篇沒講的」不再提照護機構）。
- description 改成各自確定性；補一句「Cochrane 高、Khan 中，我沒進一步查原因」；Khan 補充檔未讀（不知評級依據）。
- 結尾橋重寫（what-is-pain 談定義與慢性下背痛，不是急性受傷）並加就醫條件；開頭就醫提醒拆成「剛跌倒受傷／撞到頭／新出現頭暈」與「想增加活動量而有慢性病先問專業人員」。
- 縮篇：刪信賴區間、研究數、−0.30／−0.33 差異等；正文約 5,500 字元（含標題，不含參考資料）。
- 刪「日常活動」標題；補連 aging-muscle-and-bone；平均差、I²、偏差白話；動作 1 用原文小寫（Cochrane 摘要為句中小寫）；動作 2 列出三條並註明 Cochrane 高與 Khan 中。
仍未解決：Khan 跌倒 MD 單位不明（文中已寫）；Khan 補充檔與 GRADE 依據未讀；Cochrane 全文、ESSA 聲明未讀；Cochrane 與 Khan 對跌倒評級不同的原因未查。
移除的說法：「Khan 跌倒 −0.30 vs −0.33」「4 週等最佳劑量」均不在文中。
