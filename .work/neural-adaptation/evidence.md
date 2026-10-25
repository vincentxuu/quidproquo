# 查證與取得紀錄：neural-adaptation（order 8）

## 試過的管道（在我查的範圍內）
- Europe PMC REST 搜尋（經 Groundlane web_fetch；curl 連外被代理擋 403）：
  1. 標題含 cross-education／contralateral 且為 SR/MA 且 OPEN_ACCESS → 找到 Altheyab 2026（PMID 39235953）。
  2. 標題含 neural adaptation(s)／early strength／early-phase 且 SR/MA → 29 筆，與主題相關者只有 Centner & Lauber 2020（血流限制訓練的神經適應，非本題，未用）。
  3. 標題含 motor unit／corticospinal／neuromuscular 且 resistance training 且 SR/MA → 5 筆：Li & Hu 2026（TMS 統合分析，PMC13368514）、Elgueta-Cancino 2022、Gordon 2024（tempo 與皮質脊髓徑，PMC11241463）、Chang 2026（HIIT＋阻力，不相關）、Latella 2019（cluster set 急性反應，不相關）。
- 未讀：Li & Hu 2026（TMS，皮質脊髓層級，標題含 systematic review and meta-analysis，只看到 metadata）、Gordon 2024；留給之後或標為未解決。
- 結論：沒有找到「專門比較新手前幾週神經與肌肉貢獻比例」的免費系統性回顧（限於上述查詢條件）。

## 不在來源逐字內、但文章裡出現的說法
- 「每條肌纖維只由一個運動神經元支配；更多、更大的運動單位被啟動叫徵召」：OpenStax §10.4 的改寫，已與讀到的原文對照，未程式比對。
- 「效果量約 0.4 到 0.6，屬中等大小」：由 SMD 0.39–0.62 整理；「中等」依 Elgueta 方法段的效果量分級（0.3–0.7 為 medium）推得，Altheyab 本身把 0.59 以外稱為 significant，未逐一標 medium。這是我的描述。
- 「確定性從非常低到高」：Altheyab 結果段各節的 certainty 描述。
- 「其他指標確定性非常低到中等、方向不一致」：Elgueta 摘要（low to moderate）、結果（very low）、結論（mixed direction, very low-to-moderate）。
- 「Aslam 拮抗肌少同時出力」：該篇 5.2 節敘事陳述（比較訓練者與未訓練者），文章標為該回顧的說法。
- 「我沒有整理各研究的訓練週數」：實際上我沒做；Altheyab 表 1 有 weeks 欄，但沒逐篇讀。

## 刻意不寫
- 神經 vs 肌肉的百分比分配；「前 X 週」的具體週數。
- Altheyab 的性別次分組與「eccentric 才使等長扭力顯著」。
- 交叉訓練用於受傷復健的建議（只在「沒講的」提到是作者展望）。
- 任何訓練處方。

## 未解決
1. OpenStax 引文需在可連線環境程式比對；作者／版本待補。
2. Li & Hu 2026（TMS）可能補強「皮質脊髓層級」直接證據，本輪未讀。
3. Altheyab 的 concentric 效果量摘要 0.61 vs 結果 0.62 不一致；Elgueta 放電率 P 值摘要 0.43 vs 結果 0.38 不一致。文章未用這些數字。
4. 是否有針對「完全新手、前 2–4 週」的原始研究（如 Roberts 2026 四天訓練、PMID 42555436）可補，本輪未讀。

## 審稿後更正
改了：
- 「效果量屬中等」改為「按一般慣例算中等，作者沒有這樣分級」（Altheyab 全文無此分級）。
- 「主因」全部改為「特徵」（Aslam）／「短期最明顯」（Elgueta，無出處的作者看法）。
- 「肌肉沒變大」改為「沒測到差別」，補「羽狀角 2 項、肌肉厚度 3 項、信賴區間寬」；tldr 加 3 項。
- 「7 項試驗」改為「7 項研究，含非隨機研究」（Elgueta 的 MURT 兩項為 NRSI；合併的 4 項含 1 項 NRSI）。
- 刪「肌肉蛋白質 2–4 週」（轉述 Staron 1994，未查證）。
- L33 與 tldr 明說三份來源不是針對新手前幾週；檢索限定語改為「用標題關鍵字檢索 Europe PMC 的開放取用系統性回顧」。
- 補「讀完後能……」句；動作 2 換新說法（右手／左手）；正文三篇來源加 inline DOI 連結；專名白話（系統性回顧連總覽、效果量、羽狀角、放電率、肌電圖、偏誤風險）。
- 運動單位段縮短並連〈肌肉怎麼收縮〉；刪「結果、作者說法、我的解讀」三分表；攀岩節縮短；連〈動作學習〉；「練一條腿」改「下肢一側」；Aslam 拮抗肌那句刪除（審稿者指出多處是菁英 vs 娛樂型的比較）。
- Li & Hu 2026（TMS 統合分析）：審稿者讀摘要為 11 項隨機試驗、244 人；文章只在「沒講的」點名，標示只看摘要、未納入。
- 刪掉 1RM 敏感度分析等細節（文章原本就沒寫）；正文由約 7,000 縮到約 3,000 字元。
仍未解決：OpenStax 引文未程式比對、作者／版本未補；Altheyab concentric 0.61／0.62 與 Elgueta P 值不一致（文章未用）；Roberts 2026 未讀。
