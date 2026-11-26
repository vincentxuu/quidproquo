# post-verify：neural-adaptation（認識人體 order 8）

檔案：`src/content/posts/learning/2026-10-25-neural-adaptation.md` 與 `-en.md`。未修改文章。

## 來源取得程度
| 來源 | 取得 | 程度 |
|---|---|---|
| Altheyab 2026（PMC13238690） | Groundlane web_fetch，Europe PMC fullTextXML，80,195 字元，未截斷 | 全文（不含補充材料、圖） |
| Elgueta-Cancino 2022（PMC8918924） | 同上，53,612 字元，未截斷 | 全文（不含附錄） |
| Aslam 2025（PMC12183069） | 同上，98,578 字元，未截斷 | 全文可 grep；只對文章引用處做逐句核對 |
| OpenStax §10.4 | web_fetch 頁面全文，未截斷 | 全文，逐句目視；授權另查 Preface |
| Li & Hu 2026（PMC13368514） | Europe PMC 搜尋 API | 只有 metadata 與摘要 |

## 判定總表
| # | 位置 | 判定 | 摘要 |
|---|---|---|---|
| 1 | zh L56／en L56 | Misframed | 「效果量約 0.4 到 0.6，屬於中等大小」：「中等」是寫手的標籤，Altheyab 全文沒有 medium／moderate effect 之類的分級 |
| 2 | zh L83／en L83 | Misframed | 「作者的說法：神經適應是早期力量進步的主因」比來源強 |
| 3 | zh L9, L58–60／en 同 | Misframed（輕） | 「肌肉沒變大／沒有明顯差別」：只有 2、3 項研究，信賴區間很寬，是「未測到差別」，不是「沒變大」 |
| 4 | zh L50／en L50 | Misframed（輕） | Aslam 拮抗肌共同收縮：多處是在區分菁英與娛樂型，只有 5.1 一句說新手「改善主動肌與拮抗肌協調」 |
| 5 | zh L33／en L33 | 限定語需加強 | 「沒有專門量化…」有限定，但檢索範圍比文中寫的窄，且有一篇相關的 TMS 統合分析沒讀 |
| 6 | zh L66／en L66 等 | 輕微 | Elgueta 的 7 項不全是隨機試驗（合併的 4 項中有 1 項非隨機介入研究），文中統稱「試驗」 |
| — | 其餘 | Confirmed | 見下 |

沒有 Contradicted，沒有 Unverifiable。

## 逐項

### 1. 「效果量約 0.4 到 0.6 屬中等大小」的歸屬（Misframed）
- 數字範圍對：1RM 0.59、MVC 0.55、concentric 0.62（結果段；摘要 0.61）、eccentric 0.39、isometric 0.45。
- Altheyab 全文沒有把這些效果量稱為 medium／moderate。grep "medium|moderate effect|Cohen" 無對應。文中的 moderate 都指 GRADE 確定性（isometric、羽狀角、肌肉厚度）。
- 「0.3–0.7 為 medium」的分級，出現在 Elgueta 方法段（引 Fritz 2012），不是 Altheyab 的。evidence.md 自己也寫了這是推得的描述。
- 讀者緊接著看到「但作者評的證據確定性…」，會把「中等大小」讀成作者說的，或與「確定性中等」混淆。
- 建議：刪掉「屬於中等大小」；或改成「我依 Cohen 慣例（0.5 左右算中等）把它歸為中等，作者沒有這樣分級」。en 同改。
- 另可補：1RM 刪掉一個異質來源研究（Martínez 2021）的敏感度分析後，SMD 降到 0.33（P = 0.04），低於「0.4–0.6」。文章沒提，不算錯，但「約 0.4 到 0.6」是全部主分析的範圍，不含敏感度分析。

### 2. 寫手說的兩處內部不一致：文章是否避開（Confirmed，已避開）
- Altheyab 摘要 concentric 0.61（CI 0.39–0.84），結果 3.7 寫 0.62（CI 0.38–0.86）。我在原文確認兩處不同。文章只寫範圍「約 0.4 到 0.6」，0.61 與 0.62 都在範圍內，沒有引用單一數字。另外 eccentric CI 上限摘要 0.64、結果 0.65，文章也沒用。
- Elgueta 摘要寫放電率 P = 0.43，結果段寫 P = 0.38，討論段又寫 "SMD = 0.7, P = 0.43"。我在原文確認三處。文章只寫「沒有顯著改變」，沒有 P 值，也沒有 SMD。已避開。
- 附帶：Elgueta 合併的點估計是 SMD 0.70 偏向訓練組（作者稱 moderate effect size，但不顯著，I² 91%）。文章寫「沒有顯著改變」是對的；若讀者以為沒有任何方向就太簡化了，但文章沒這樣寫。

### 3. 肌肉結構「沒有明顯差別」（Misframed，輕）
- 原文：羽狀角 2 項研究，SMD 0.25，CI −0.27 到 0.77；肌肉厚度 3 項，SMD 0.01，CI −0.44 到 0.46；兩者作者評 moderate certainty，I² 0%。人數、研究數都很少。
- 文章 L58 寫「沒有明顯差別，作者評為中等確定性」是對的。
- L60「沒練的那一側肌肉沒變大，力量卻增加了」和 tldr「肌肉厚度沒明顯差別」是把「統計上沒偵測到」寫成「沒變大」。CI 對羽狀角還包含中等程度的增加。
- 建議：L60 改成「沒練那一側沒測到肌肉變大」，並補一句「只有 2、3 項研究，信賴區間寬」。en L60 "did not get bigger muscles" 同改。

### 4. 「作者說這種現象很少伴隨肌肉量增加…」（Confirmed）
- Altheyab 簡介：「rarely associated with increased muscle mass or changes in muscle structure」「neural adaptations purported to underlie this effect」，並引用 Farthing 2011、Kurobe 2015。討論段 "remain unidentified"。這是簡介引他人，不是本回顧自己的結果，文章寫「作者也說，這種現象很少伴隨…一般認為」基本到位。可再明確寫成「作者在簡介引用先前研究」。
- 也確認 Altheyab 自己沒量神經（文章已寫）。

### 5. Altheyab 設計與人數（Confirmed）
- 29 項 RCT 入選、20 項進統合分析（PRISMA 段）；健康成人、下肢；對照組（control）；RoB 2：低 22.58%、疑慮 58.06%、高 19.35%。
- 文章未寫總人數，不需補。
- 「練一條腿」是簡化：納入的訓練包含小腿提踵、足背屈等下肢肌群，不全是腿部推舉類。可保留，或改成「練下肢一側」。
- 1RM 6 項研究（10 組資料）；文章沒寫。確定性：1RM very low、MVC low、concentric high、eccentric high、isometric moderate。「非常低到高」「1RM 是非常低」Confirmed。
- 「年齡分組因資料不足沒做」Confirmed（限制段）。
- 「受傷、中風復健是作者展望」：未逐句核對該句在討論的位置，但簡介與結論都提到臨床應用，方向一致。

### 6. Elgueta-Cancino 2022（Confirmed，附 #6）
- 7 項、167 人、"All studies investigated men only."、每項 20–27 人、年齡 19.4–27 歲。Confirmed。
- 合併 4 項、82 人、放電率不顯著、I² 91%、確定性 very low。Confirmed。但 4 項是 3 項 RCT 加 1 項非隨機介入研究（Del Vecchio 2019a）。7 項整體也含非隨機研究（MURT 兩項都是 NRSI）。文章用「試驗」「小型試驗」。建議在 L66 或 L64 標題旁改成「7 項研究」，或加「含非隨機研究」。tldr 的「7 項小型試驗」同改。
- 「其他指標有些顯示改變，確定性非常低到中等，方向不一致」：摘要 low to moderate、討論 MUDRV 為 moderate、結論 "mixed direction…very low-to-moderate"。Confirmed。
- "there is a lack of high-quality evidence" 在摘要與結論都有，Confirmed。"None of the seven…low risk of bias" 在討論，Confirmed。
- 「神經變化在短期阻力訓練最明顯，長期主要來自肌肉形態」：原文在討論段的限制討論，"there is a general consensus…" 沒附出處。文章寫「在討論裡說…沒有附出處，屬於作者的看法」Confirmed。
- 「肌肉蛋白質適應在訓練前 2 到 4 週內就會發生」：原文引 Staron 1994，並說 "as recently discussed by Pearcey et al. (2021)"。文章寫「轉述另一項早期研究，我沒有再查證」Confirmed。
- 「還不清楚哪些神經因素最相關」："it is not clear which factors are most relevant"，Confirmed。
- 同一篇引言說「神經變化被認為是早期力量增加的原因」，文章在 L83 把它放進「作者的說法」之一（見 #2）。

### 7. 「作者說法：主因」（Misframed）
- zh L83／en L83：「神經適應是早期力量進步的主因。這來自敘事回顧與一句沒有附出處的討論。」
- Aslam 原文是 "a defining feature of early strength gains, especially in recreational trainees"（特徵，不是主因，且限定娛樂型訓練者）。Elgueta 是 "most notable with short-term resistance training"（短期最明顯）。兩者都沒說「主因」或比例。
- 建議：改成「神經適應是早期力量進步的特徵（Aslam）／在短期訓練最明顯（Elgueta）」。

### 8. Aslam 2025 是否標為敘事回顧（Confirmed，附 #4）
- 文中四處標為敘事回顧：來源清單、L50、L83、參考資料。原文 1.1 "Although this review adopts a narrative approach"。
- 納入條件與排除條件確實有列（22 篇入選，檢索 4 個資料庫）。全文沒有逐篇偏誤評估或 GRADE；只在限制段泛稱研究品質問題。文章「雖然列了檢索與納入條件，但我讀到的部分沒有看到逐篇偏誤評估」Confirmed，而且我現在讀的是全文可 grep，限定語「我讀到的部分」偏保守，可保留。
- 主題確為菁英 vs 娛樂型。Confirmed。
- 「EMG 變化可能被肌肉變大混淆」：Aslam 8.2 "A recent study cautioned against attributing EMG changes purely to neural adaptations due to the confounding effect of muscle growth (Škarabot 2021b)"。文章寫「引用一項研究提醒」。Škarabot 2021 題名是 "The knowns and unknowns of neural adaptations to resistance training"，看起來是回顧文章；Aslam 稱 study。影響小，可略。
- 拮抗肌（#4）：Aslam 摘要說「reduced antagonist co-contraction」是 elite 與 recreational 的差異；5.1 說新手有 "improved agonist-antagonist coordination"，並與 EMG 增加並列；另一段說 trained athletes 有更低的共同收縮。文章寫「拮抗肌少一點同時出力」，並標為該回顧的說法，不是實驗結果。方向可接受；若要更準，改成「改善主動肌與拮抗肌的協調」。
- 注意：Aslam 5.1 的依據含 Grgic & Schoenfeld 2018 之類回顧，與其自己的排除標準（排除缺原始資料的回顧）有出入。文章只當背景，標示已足夠。

### 9. OpenStax §10.4 改寫（逐句目視，Confirmed）
原文（已取得）：
- "Each muscle fiber is innervated by only one motor neuron."
- "The actual group of muscle fibers in a muscle innervated by a single motor neuron is called a motor unit."
- "As more strength is needed, larger motor units, with bigger, higher-threshold motor neurons are enlisted…"
- "This increasing activation of motor units produces an increase in muscle contraction known as recruitment."
- "A single action potential from a motor neuron will produce a single contraction in the muscle fibers of its motor unit."

文章逐句：
1. L48「每條肌纖維只由一個運動神經元支配」對應第 1 句。Confirmed。
2. L48「一條運動神經元加上它支配的肌纖維，叫運動單位」對應第 2 句。Confirmed。
3. L48「需要更大力量時，更多、更大的運動單位會被啟動，這叫徵召」對應第 3、4 句。「更大」來自第 3 句，「更多」來自第 4 句的 increasing activation。Confirmed。
4. 術語表運動單位：「神經元放出訊號，這組肌纖維就一起收縮」對應 single action potential 那句。Confirmed（「一起收縮」是白話，原文講的是一個動作電位產生一次收縮）。
5. 術語表徵召：「啟動更多、更大的運動單位」Confirmed。
6. L50「徵召更多運動單位、放電更快」：徵召來自 OpenStax；「放電更快」不在 OpenStax，這是文章自己列的可能環節（Elgueta 的放電率研究、Aslam 的 firing efficiency 可支持）。L50 整段在 OpenStax 之後、沒有標來源，建議在「放電更快」加一個來源標記（Elgueta 或 Aslam），避免被讀成教科書內容。
7. L50「同一條肌肉沒變大，神經卻能更有效地使喚它」：寫手的詮釋，OpenStax 沒有談訓練適應。L39 已寫教科書「不是訓練實驗」，OK。
- 授權：OpenStax A&P 2e Preface 寫明 CC BY-NC-SA 4.0，與文末聲明一致。作者、版本、出版日期仍未補（evidence.md 未解決項），但文末只寫書名與授權，不影響事實。

### 10. 「在我查的範圍內沒有專門量化神經 vs 肌肉比例的系統性回顧」（需加強限定）
- 文章 L33 的限定語「在我查的範圍內（Europe PMC 的免費全文）」存在。
- evidence.md 顯示實際檢索更窄：標題含 cross-education／neural adaptation／early strength／motor unit／corticospinal／neuromuscular 且 resistance training、限 SR/MA、限 OPEN_ACCESS，共三組查詢。意思是只掃標題關鍵字，沒掃摘要或全文。建議限定語改成「用標題關鍵字檢索 Europe PMC 的開放取用系統性回顧」。
- 檢索結果中 Li & Hu 2026（PMC13368514）我用 Europe PMC 讀了摘要：11 項隨機試驗、244 名健康成人，阻力訓練使經顱磁刺激測得的皮質脊髓興奮性增加（SMD 0.59，CI 0.10–1.08，I² 69%），動作表現 SMD 0.40。它是直接量神經的統合分析，但沒有量化神經與肌肉各占多少，所以不推翻 L33 的限定宣告。
- 但它與文章的框架有關：L33「直接證據很薄」、「直接證據」小節只談運動單位。讀者可能以為直接測神經的只有那 7 項。建議二選一：在「這篇沒講的」加一行「皮質脊髓層級（如 TMS 統合分析 Li & Hu 2026）我只看到摘要，沒有納入」；或把它補進文章並標摘要層級。文章現有的「神經的細節：大腦皮質、脊髓層級的變化，我沒有讀」（L98）已有概略涵蓋，但沒點名這篇。
- 文章沒有寫「完全沒有」，沒有 Contradicted。

## 英文版與中文版一致性
- 主張、數字、限定語兩版一致（7 項、167 人、29／20 項、2／3 項、very low 等）。
- 兩版在 #1、#2、#3、#6 同樣需要改。

## 歸屬標籤
- 「作者的說法／作者評／作者也說」在文中出現 10 次以上，主要集中在 L56–L84，已超過 3 處，但每處都對應不同來源陳述，沒有堆疊在同一句。若要精簡，L83 的三層摘要已重述了前文的歸屬，可擇一保留。

## 「只讀摘要」的來源
- 文章沒有宣稱任何來源只讀摘要；三篇論文都取得全文。Li & Hu 未被文章引用，故無此問題。

## 範圍聲明
只檢查文中已提出的宣告，不判斷文章沒寫的內容是否該寫（Li & Hu 為完整性建議）。補充材料（GRADE 表、附錄）與各研究逐篇表未讀，文章沒有引用那些內容。
