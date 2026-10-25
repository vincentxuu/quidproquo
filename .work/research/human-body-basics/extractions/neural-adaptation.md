# 精讀紀錄：神經適應（order 8）

## 來源與取得
| 來源 | 書目 | 取得 | 讀取程度 |
|---|---|---|---|
| Altheyab 2026 | Altheyab A, Alqurashi H, England TJ, Phillips BE, Piasecki M. Exp Physiol 111(6):2895–2917（線上 2024-09-05）。PMID 39235953、PMCID PMC13238690、DOI 10.1113/EP091881（皆為 Europe PMC 回傳值） | Groundlane web_fetch 讀 Europe PMC fullTextXML，80,195 字元，truncated false | 摘要、簡介、方法（納入條件、偏誤、GRADE、統合）、結果（1RM、MVC、各峰值扭力、羽狀角、肌肉厚度、性別分組、偏誤摘要）、討論開頭、限制、結論。**沒讀：** 補充材料（GRADE 表）、各研究逐篇表（表 1 只看了部分）、圖 |
| Elgueta-Cancino 2022 | Elgueta-Cancino E, Evans E, Martinez-Valdes E, Falla D. Front Physiol 13:817631。PMID 35295567、PMCID PMC8918924、DOI 10.3389/fphys.2022.817631 | 同上，53,612 字元，truncated false | 摘要、簡介、方法、結果（參與者、偏誤、統合、各結果）、討論、限制、結論 全讀。**沒讀：** 補充附錄 |
| Aslam 2025 | Aslam S, Habyarimana JDD, Bin SY. Front Physiol 16:1598149。PMID 40551899、PMCID PMC12183069、DOI 10.3389/fphys.2025.1598149 | 同上，98,578 字元 | **部分讀**：摘要、方法（檢索）、3–4 節片段、5.1–5.5 神經適應、限制（8.2–8.3）、結論。其餘章節（基因、恢復、受傷）略過 |
| OpenStax §10.4 | OpenStax, Anatomy and Physiology 2e, 10.4 Nervous System Control of Muscle Tension | Groundlane web_fetch，truncated false，主文全讀 | 全文；**引文未程式比對**（內容未存檔、curl 連不到）。作者／版本／出版日期未補 |

## 可用陳述與逐字引文（Elgueta／Altheyab／Aslam 已用 python 對全文正規化後比對，全部吻合）
| 陳述 | 逐字 | 來源 |
|---|---|---|
| 神經變化被認為是早期力量增加的原因，但運動單位的確切變化不清楚 | "While neural changes are thought to be responsible for early increases in strength following resistance training (RT), the exact changes in motor unit (MU) firing properties remain unclear." | Elgueta 摘要 |
| 7 項試驗 167 人 | "Seven trials including 167 participants met the inclusion criteria." | Elgueta 摘要 |
| 缺乏高品質證據 | "Overall, this systematic review revealed that there is a lack of high-quality evidence for the effect of RT on MU firing properties." | Elgueta 摘要 |
| 沒有一項低偏誤風險 | "None of the seven studies included in this review was rated as low risk of bias" | Elgueta 討論 |
| 全為男性 | "All studies investigated men only." | Elgueta 結果 |
| 放電率證據確定性非常低 | "The certainty of the evidence for MUDR was rated as very low." | Elgueta 結果 |
| 不清楚哪些因素最相關 | "it is not clear which factors are most relevant" | Elgueta 討論 |
| 作者看法：神經變化在短期最明顯，長期靠形態 | "Yet there is a general consensus that neural changes to RT are most notable with short-term resistance training, with morphological changes being the primary mechanism for long-term strength gains." | Elgueta 限制段（無附出處） |
| 交叉訓練定義（含「由神經變化驅動」的前提） | "Cross-education describes the training of one limb that leads to performance enhancements in the contralateral untrained limb, driven by neural changes rather than muscle adaptation." | Altheyab 摘要 |
| 29 項研究 | "A total of 29 studies were included." | Altheyab 摘要 |
| 很少伴隨肌肉量變化、神經適應被認為是背後原因 | "This cross-education is rarely associated with increased muscle mass or changes in muscle structure in the untrained muscles"；"with neural adaptations purported to underlie this effect" | Altheyab 簡介 |
| 機制未釐清 | "The exact biological processes facilitating the transfer of muscle strength to the contralateral limb after RET remain unidentified" | Altheyab 討論 |
| 羽狀角無差別 | "there was no cross-education through RET interventions, with no difference in pennation angle between the two groups"（2 項研究，SMD 0.25，CI −0.27–0.77，moderate certainty） | Altheyab 結果 3.10 |
| 肌肉厚度無差別 | "there was no difference in muscle thickness between the two groups"（3 項研究，SMD 0.01，CI −0.44–0.46，moderate certainty） | Altheyab 結果 3.11 |
| 年齡分組做不了 | "we could not conduct subgroup analysis based on age due to insufficient data" | Altheyab 限制 |
| 神經適應是早期力量增加的特徵 | "Neural adaptations are a defining feature of early strength gains, especially in recreational trainees." | Aslam 5.1（敘事） |
| EMG 變化可能被肌肉變大混淆 | "A recent study cautioned against attributing EMG changes purely to neural adaptations due to the confounding effect of muscle growth" | Aslam 8.2 |
| 敘事取向 | "Although this review adopts a narrative approach" | Aslam 1.1 |
| 運動單位／徵召（OpenStax，未程式比對） | "Each muscle fiber is innervated by only one motor neuron."；"This increasing activation of motor units produces an increase in muscle contraction known as recruitment." | OpenStax §10.4 |

## 數字（文章用到的）
- Altheyab：1RM SMD 0.59（very low）；MVC 0.55（low）；concentric 0.62（結果段，摘要寫 0.61，兩處不同）；eccentric 0.39；isometric 0.45（moderate）。文章只寫「約 0.4 到 0.6」與「確定性從非常低到高」。結果段把 concentric 與 eccentric 評為 high certainty；摘要未列確定性。20 項進入統合分析（結果 3.1）。
- Elgueta：統合 4 項、82 人；摘要寫放電率 P = 0.43，結果段寫 P = 0.38（內部不一致）→ 文章只寫「沒有顯著改變」。I² 91%。

## 作者列的限制
- Altheyab：缺機制資料；年齡分組做不了；部分結果異質性（以敏感度分析處理）。偏誤：整體低風險 22.58%、有疑慮 58.06%、高風險 19.35%（31 項評估）。
- Elgueta：樣本小無檢定力、全為男性、訓練方式／肌肉／量測方法異質、無低偏誤研究、只搜線上資料庫、PlotDigitizer 資料單人擷取。
- Aslam：敘事回顧；未見逐篇偏誤評估（我讀到的部分）；自述 EMG 受肌肉量混淆；男性為主；「elite」定義不一。

## 要小心的
1. Altheyab 對「交叉訓練 → 神經」的說法是前提／推測，沒有量神經；不能寫成它證明神經適應。
2. 未訓練側 ≠ 被訓練側前幾週。
3. 「女性可能獲益更多」是探索性次分組（部分資料不足），文章刻意不寫。
4. Elgueta 引言提到肌肉蛋白質適應 2–4 週內發生，是轉述 Staron 1994，我沒查原文，文章標明為轉述。
5. Aslam 部分段落引用系統性回顧作為依據，但它自己的納入標準排除回顧；該篇內部一致性有疑問，只作背景。
6. ACSM 2026 精讀紀錄裡我 grep 不到 cross-education／neural，沒有用 ACSM。

## 對本篇的影響
範圍縮到「證據層級」：交叉訓練（間接）、運動單位（直接，品質低）、敘事回顧（背景）。不寫比例、不寫週數、不寫處方。
