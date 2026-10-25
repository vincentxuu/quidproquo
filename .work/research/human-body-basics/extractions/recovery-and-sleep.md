# 精讀紀錄：order 9 睡眠與恢復（Kong 2025、Craven 2022、Davis 2020、Berjisian 2026、Jin 2026）

取得管道：Groundlane `web_fetch` 抓 Europe PMC `fullTextXML`（format=text，`truncated:false`），存檔後用 `python3 -I` 比對。書目與 PMCID 以 Europe PMC 為準。

## 來源與讀取程度
| 來源 | PMCID／DOI | 讀取 |
|---|---|---|
| Kong 2025 Front Physiol 16:1544286 | PMC11996801／10.3389/fphys.2025.1544286 | 全文 XML（81,933 字元）；讀摘要、方法、風險偏差、結果（有氧、無氧、最大力）、討論、限制、結論、利益衝突、作者分工。**沒讀**逐篇研究表、各森林圖、補充材料 |
| Craven 2022 Sports Med 52:2669 | PMC9584849／10.1007/s40279-022-01706-y | 全文 XML（96,061 字元）；讀摘要、Key Points、表 2、表 3、限制、結論、利益聲明。討論前半機制段略讀 |
| Davis 2020 BMJ Open Sport Exerc Med 6:e000614 | PMC7228568／10.1136/bmjsem-2019-000614 | 全文（91,916 字元，抓回正文無摘要，摘要由 Europe PMC 搜尋 API core 取得）；七個結果段與討論全讀 |
| Berjisian 2026 Sports Med Open 12:145 | PMC13627639／10.1186/s40798-026-01116-8 | 全文 XML（69,228 字元）；讀摘要、Key Points、重疊分析、慢性適應段、結論段、限制。**沒讀**各結果段完整細節、補充表 |
| Jin 2026 Front Sports Act Living 8:1876924 | PMC13531764／10.3389/fspor.2026.1876924 | 全文 XML（58,964 字元）；讀摘要、前言、限制、結論、利益聲明。**沒讀**方法與逐項網路結果細節 |

## 逐字引文表（皆程式比對，正規化空白與引號後吻合）
| 內容 | 原文 |
|---|---|
| Kong 限制：只能看短期 | "lacks insights into long-term effects" |
| Kong 利益衝突 | "Author GG was employed by DeRucci Healthy Sleep Co., Ltd." |
| Kong 結論 | "Sleep deprivation significantly impairs athletes' performance across various domains"（未入文，僅核對） |
| Craven 結論 | "Sleep loss appears to have a negative impact on exercise performance"（未入文，僅核對） |
| Jin 結論 | "No modality has been shown to outperform passive recovery on any outcome examined" |
| Berjisian 結論 | "rather than routine application after all exercise sessions" |
文章正文只直接引用前三項中的 Kong 兩句（含利益衝突句）；其餘為忠實轉述，無引號。

## 可用陳述（轉述，附出處段）
- Kong：45 研究、670 人、運動員 28 研究／非運動員 17；RCT 與隨機交叉試驗；運動員 AE、EP、MF、speed、skill、RPE 顯著；非運動員 AE 顯著；無氧耐力 SMD −0.08（P=0.6）不顯著；PSDB＝入睡晚（夜初）、PSDE＝提早起床（夜末）（方法段定義）；crossover 42 篇中 9 高風險、15 中、18 低；AE 有發表偏差跡象（Egger P=0.032），trim-and-fill 後穩定。
- Kong 限制：多為急性、異質性、睡眠品質監測不一、女性少無法分析性別。資金：無。作者分工 GG 為 Conceptualization、Writing–review and editing（無 Formal Analysis／Investigation）。
- Craven：69 文獻（摘要）、959 人、89% 男性；睡眠不足定義 ≤6 h／24 h；平均 %Δ −7.56%（95% CI −11.9 至 −3.13），I² 98.1%；剝奪與晚限制（提早起床）一致負面，早限制（延後入睡）不顯著（表 2：−5.85，p=0.125）；醒著每多 1 h 約降 0.4%（剝奪與晚限制，meta-regression）；PM 影響大於 AM（表 3：AM −5.42、PM −8.31）；98% 僅量睡眠量；女性約 11%；利益：無直接相關衝突。
- Davis：29 研究（12 RCT、17 隨機交叉）、1012 人；肌力、跳躍、衝刺、耐力、疲勞無顯著；柔軟度 SMD 1.07、I² 90%；DOMS SMD 1.13、I² 86%，文中寫「柔軟度 7%、DOMS 13%」，兩者各被單一離群研究拉動；DOMS 全為主觀量表；作者列限制：小樣本、方案多樣、低檢定力。
- Berjisian：15 SRMA、161 研究；AMSTAR2 低到極低；GRADE 低到非常低；抗痠痛至 96 h、降 CK 24–72 h；力量／肌肥大研究間重疊 64%；肌肥大 cSMD −0.22；肢體浸泡 −0.31 vs 全身 −0.08；作者限制：沒有對非重疊原始研究做統合分析；競爭利益：無；資金：無。
- Jin：16 RCT、273 人、耐力運動員；47 對照中 3 個排除零，但皆非穩固；DOMS 網路拿掉 5 項中 2 項就反轉；DOMS 結果依賴「估計值而非擷取值」，作者不下 DOMS 結論；假的恆溫浸泡 ≥ 所有主動方法；證據確定性 47 比較中 31 非常低、15 低；作者自述本稿為對先前版本錯誤的更正。

## 作者列的限制 vs 我的解讀
- 作者列：Kong 的短期、性別、異質性、睡眠品質；Craven 的睡眠品質、女性、無連續多夜；Davis 的小樣本與方案多樣；Berjisian 沒做原始研究層級統合；Jin 的更正與估計值問題。
- 我的解讀（文中已標示為我）：Kong 作者分工推論、兩篇睡眠方向一致的對照、Berjisian 與 Jin 在痠痛上的差異原因「我沒有逐篇比對」。

## 要小心的
1. Kong 與 Craven 對睡眠不足類型標籤相反（Kong 的「late」＝PSDB＝晚睡；Craven 的「late restriction」＝提早起床），文章以白話描述避免混淆。
2. Craven 摘要說「AM 任務大致不受影響」，但其表 3 的 AM 整體為 −5.42（CI 不含零）。文章只寫「下午影響較大」，不採摘要的說法。
3. Craven 摘要「69 publications」，結果段卻寫「Seventy-seven studies」。文章用摘要的 69，evidence.md 記未解決。
4. Kong 摘要寫「published in any language」，納入標準寫「written in English」。文章未涉及。
5. Kong 最大肌力：運動員 SMD −0.35，整體 −0.24；文章不寫此數。
6. Davis 有 2021 勘誤（Europe PMC：Erratum in 33981450），我沒有讀勘誤內容。
7. Kong 結尾「確保足夠睡眠至關重要」是建議，不是結果。
8. DeRucci 賣什麼，我沒有查證（掃描表寫床墊／睡眠產品，未驗證）；文章只寫「名稱和睡眠有關」。
9. Jin 為 2026 年新文且帶有自述更正，Berjisian 為傘狀回顧且原始證據品質低；兩者都只當輔助。

## 對本篇的影響
範圍縮到：實驗室急性睡眠不足的表現證據（兩份統合分析並讀）＋利益關係處理＋三類恢復方法的回顧證據。不寫睡眠時數、午睡、肌肉合成、受傷風險、補充劑、攀岩專屬建議。
