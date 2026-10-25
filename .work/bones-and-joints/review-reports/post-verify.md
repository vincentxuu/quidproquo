# post-verify：bones-and-joints（order 1）

檢查日期 2026-10-25。對象：`src/content/posts/learning/2026-10-25-bones-and-joints.md`（zh，行號以此為準）與 `-en.md`。

## 實際取得的來源
| 來源 | 取得程度 |
|---|---|
| Miao 2025 Front Physiol（PMC12823962） | Europe PMC fullTextXML，Groundlane web_fetch，73,266 字元，truncated:false。讀了摘要、方法、Table 1–5、結果、討論、限制、結論。未讀補充材料與森林圖本體 |
| Miao 2025 PeerJ（PMC12225634） | 同上，54,154 字元，truncated:false。讀了摘要、方法、Table 1–2、風險段、結果、限制、結論 |
| OpenStax 6.3 / 6.4 / 6.6 / 9.1 / 9.4 | 逐頁 web_fetch，全文 truncated:false。授權頁（Ch.1 的 Citation/Attribution）也取得 |
| Lu 2026 BMJ（PMID 42716561） | 只取得 Europe PMC 書目與摘要，沒取得全文 |

## Contradicted
無。

## Misframed
1. **L113「運動之後的骨量增加，出現在年輕成年女性的子群」**。Front Physiol 取的是「治療後平均值與 SD」（方法 2.3：post-intervention means and standard deviations），比的是運動組與對照組「結束時誰比較高」，不是從基線算起的增加量。文章 L99 寫「運動組比對照組高」是對的，L113 的「增加」走樣。PeerJ 那份才是變化量（ΔBMC，方法有明寫 within-group change scores）。建議改法：L113 改成「運動組的骨量比對照組高，出現在……；兒童那份則是骨質含量的變化量較大」。tldr、description 用語也順帶檢查。
2. **L107「跳躍組……運動組顯著高於對照組」（en 同）**。PeerJ 結果明寫 “BMC changes in the exercise group compared to controls”，是變化量（單位 g，腰椎 MD 0.86、股骨頸 MD 0.11），不是絕對量。建議改法：「骨質含量的增加量大於對照組」。
3. **L89「沒有說明是運動讓骨頭變厚，還是骨頭本來就比較厚的人比較愛運動」**。6.6 原文在該句前後其實給了因果敘述（mechanical stress stimulates deposition … “That is why people who exercise regularly have thicker bones”），緊接的下一段還寫 “Numerous, controlled studies have demonstrated that people who exercise regularly have greater bone density than those who are more sedentary”。文章把這句說成單純兩群人的比較，並說章節「沒有列研究出處」，後者屬實（無具體引用），前者則是文章自己的詮釋。建議改法：「教科書用力學刺激來解釋，並提到『許多對照研究』，但沒有給出處；『常運動的人骨頭比較厚』這句話本身是兩群人的比較，單獨看無法排除反向因果」。en 對應段同改。
4. **L93 的 15／22 並列**。「15 項研究的參加者是停經前的女性；整份分析 22 項研究的年齡約 19 到 43 歲」。數字都對（原文 3.2：22 RCT、1,051 人；15 項女性、3 項男性、3 項男女混合；年齡約 19–43）。但骨密度的合併分析只用女性研究（腰椎 12 項、股骨頸 9 項、全身 7 項），男性與混合性別的 6 項只進骨轉換指標。讀者容易把「22 項」當成骨密度分析的規模。L101「22 項研究的偏誤風險只有 2 項低風險」同理，分母含了不進骨密度分析的研究（兩項低風險 Colleran、Batrakoulis 都在骨密度分析內，所以結論不受影響）。建議改法：在 L93 補一句「22 項裡有 6 項含男性，只用在骨轉換指標；骨密度分析是 7 到 12 項女性研究」。
5. **L99 與 tldr 的子群描述漏了全身骨密度**。作者的年齡子群中，全身骨密度 <30 歲組 SMD 0.24（−0.23, 0.71）不顯著，文章只寫腰椎與股骨頸顯著，未說全身不顯著。不算錯，但讀者可能以為三個部位都有。建議補半句「全身骨密度則沒有達到顯著」。
6. **L109 的「4 項不是隨機分組」缺分布**。PeerJ 作者限制段寫明 4 項非隨機中，跳躍 8 項裡只有 1 項（Witzke 2000），阻力 4 項裡有 3 項（Dowthwaite、Gómez、Thein-Nissenbaum）。也就是阻力訓練「沒有顯著」的那一側，設計最弱。文章只寫總數，沒點出這個不對稱。建議補一句。另外阻力組全為女性（原文），跳躍組含男童；PeerJ 的性別子群顯示跳躍只在女孩顯著（腰椎 MD 1.40 [0.16–2.63]、股骨頸 0.11 [0.00–0.21]，男孩不顯著），文章未提，屬省略不是錯誤。

## Unverifiable
1. **L21 glossary「兩者都只是骨頭強度的替代指標，不等於骨頭實際承受力量的能力」**。兩份論文與五節 OpenStax 都沒有這句話，也沒有稱 BMD／BMC 為 surrogate。PeerJ 反而寫 “BMC more accurately reflects bone development during growth and is not significantly affected by bone size or growth stage”（引 Wren 2005），與把 BMC 和 BMD 一律歸為替代指標不盡相同。evidence.md 已把此句列為「未解決」。建議：補一個獨立來源（例如 DXA／BMD 與骨折風險的綜述或指引）後保留；否則刪去後半句，只留「單位面積的礦物質量，常用 DXA 量」。
2. **L130／en L95「2026 年的網路統合分析談中老年骨健康，我讀不到全文」**。我查到書目與摘要：Lu C 等，BMJ 2026 Sep;394:e100561，標題 “Effect of exercise on bone health in middle aged and older adults: hierarchical network meta-analysis of randomised trials”，≥40 歲，124 項試驗、18,429 人。所以「存在、主題是中老年」屬實。但文章寫「讀不到全文」，與「摘要在 Europe PMC 可讀」不衝突。如果日後要採用，摘要就能提供背景。這句按實情標 Confirmed（限定範圍），此處只是補充。

## Confirmed（抽樣列出，均對原文）
- Front Physiol：18–45 歲、至少 8 週、RCT；22 RCT、1,051 人（547／504）；腰椎 12 項 15 組 SMD 0.15（−0.09, 0.38）P=0.23；股骨頸 SMD 0.06；<30 歲腰椎 0.46（0.16, 0.76）、股骨頸 0.42（0.13, 0.71）；>30 歲跨 0；合併運動股骨頸 0.49（2 組）、全身 0.52（4 組）；各子群 1–8 組；2 項低風險、2 項高風險；作者限制三點（子群研究少、男性少、運動參數異質）；A1 引文逐字相符；A2 為作者推論，文章也標為推論。
- 「以各研究平均年齡 30 歲切」：原文 “subgroup analysis … was conducted with an average age of 30 years”。是否事先規劃，論文沒說，文章也沒說，OK。
- PeerJ：12 項、940 人（524／416）；平均年齡 7.3–16.8；8 項跳躍（含跳繩、capoeira）、4 項阻力；4 項非隨機；DXA；跳躍腰椎與股骨頸顯著；阻力三部位皆不顯著；結論句 “possibly due to the limited number of studies and methodological limitations” 相符。
- 「兩份作者群高度重疊、同一研究基金，不算獨立佐證」：Front 作者 Miao、Li、Zhang、Liu、Xiao、Wang；PeerJ 作者 Miao、Li、Zhang、Yang、Wang；重疊 4 人（Miao、Li、Zhang、Wang），通訊作者同為 Wang Xiaoqiang，皆為 Shandong Sport University。兩篇資金聲明都是 Social Science Planning Research Program of Shandong Province 2021（21DTYJ03）。註冊編號不同（CRD420251001516 對 CRD42024625921）。屬實。補充：兩份研究對象與問題不同，「不獨立」指同一團隊的方法與判斷偏好重疊，不是同一批試驗重複計算；文字現狀沒有暗示後者，OK。
- 「兩份都沒用 GRADE」：兩份全文搜尋 “GRADE”、“certainty” 皆 0 筆。
- 「機制是作者引用他人」：Front Physiol 討論的 osteocyte／myokine 段、PeerJ 緒論的 mechanotransduction 段皆為引用文獻。屬實。
- 範圍限定語：L121、L130 皆有「在我查的範圍內」；「讀不到全文」那份確實沒被當全文用。歸屬標籤（「作者」「教科書」）未超量。
- 英文版與中文版主張一致；en 的 hinge／condyloid 對照與 zh 一致。上述 Misframed 1–3、5 同樣適用 en 對應句，須同步改。

## OpenStax 改寫忠實度（6.3 / 6.4 / 6.6 / 9.1 / 9.4）
逐句對過，zh 與 en 都沒有新增原文沒有的事實，沒有走樣：
- 骨幹／骨骺／生長板／骨膜（含「肌腱和韌帶附著在骨膜」「關節處骨膜不覆蓋改由關節軟骨蓋住」）、礦物質與膠原的分工、緻密骨與海綿骨用途、「每條骨小樑沿著受力的方向長出來」，全部對應 6.3。
- 成骨細胞、骨細胞、蝕骨細胞的分工對應 6.3。骨重塑「同一表面先吸收再補新」「每年約 5–10%」「受傷、運動與其他活動也會引起重塑」對應 6.4；文章已標「教科書給了一個概數」，沒有當作研究結果。
- 關節三種結構分類與三種活動度分類、「滑液關節是最常見」對應 9.1／9.4；關節囊、滑液（含供應軟骨養分）、關節軟骨、韌帶、半月板緩衝、「動態韌帶」與肩膀、六型關節與例子、肩髖取捨，全部對應 9.4。
- **沒有沿用教科書簡化**：9.4 把膝與踝列為樞紐關節，文章表格刻意只列手肘與指間關節，沒有採用膝；6.4／6.3 的「18–21 歲生長板閉合」文章只寫「長大以後」；6.6 的太空人每月流失 1–2%（原文為 “is thought to be”）與補充劑、荷爾蒙、骨質疏鬆治療都沒採用；9.4 的「wear and tear」骨關節炎框架也沒用。
- 6.6 的「任何運動／阻力訓練比有氧大」文章明確標為教科書概括，並說兩份分析不支持這麼簡單的排名，這個判斷與論文相符（成年女性：阻力子群 LS 0.27 [−0.14, 0.67]、FN −0.14 皆不顯著；兒童：阻力不顯著）。
- 小處：L83「教科書指出，活動度和穩定度是互相取捨的」，原文只在肩與髖的對照中講 “reflecting the need for stability and weight-bearing ability”，一般化成「互相取捨」是文章的概括，措辭可改為「教科書用肩和髖的對比說明……」。不算錯。
- 授權：OpenStax 頁面標示 CC BY-NC-SA（Attribution-NonCommercial-ShareAlike），與文章末尾聲明一致；頁面另有「不得用於訓練 LLM」的聲明，與本篇事實無關，僅提供給主代理判斷站台是否算非商業使用。

## 其他小項
- 引用年份：Front Physiol 的 PMC 版權標 2026（線上 2026-01-08），DOI 與卷號為 2025（vol 16）。文章寫 2025，與期刊卷號一致，可保留；若要精確可加「2025 年卷，2026 年 1 月線上」。
- OpenStax 引文沒有逐字引用，故無逐字比對需求。

## 範圍聲明
只檢查文中已提出的宣告；未驗證論文所引的初級試驗本身，也未檢查補充材料、森林圖本體與預註冊文件，未評論文章沒提到的內容是否該寫。
