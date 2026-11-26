# post-verify report: 2026-10-24-tendons-and-load（zh-TW，並對照 -en）

查證日期：2026-10-24。只報告，未修改文章。

## 取得紀錄（工具與讀取範圍）

- Europe PMC `fullTextXML`：本 session 的 curl 經 agent proxy 被擋（`www.ebi.ac.uk:443` connect_rejected，403），改用 Groundlane `web_fetch`（format=text, extract=full）取得同一 URL，四篇全文都取到且 `truncated:false`：
  - PMC9474511 Lazarczuk 2022：98,597 字元，整篇讀過（摘要、Key Points、方法、結果、討論、Limitations）。
  - PMC10756908 Quarmby 2023：73,913 字元，對關鍵數字逐項搜尋比對。
  - PMC10798940 Saeterbakken 2024：95,001 字元，只比對文章引到的三句（最常見非急性受傷部位、RT 可能減少肌腱傷、介入研究少）。
  - PMC9778768 Pastor 2022：**全文**讀過（先前精讀紀錄只讀摘要）。
- OpenStax 10.2：Groundlane `web_fetch` 取得全頁。
- 兩個來源都是同一篇論文的官方開放取用版本，數字類 claim 以「論文全文 + 先前精讀紀錄交叉」計為單一原始來源（沒有第二份獨立來源；統計數字這類高風險 claim 嚴格說只有 single-source，已在下方標註）。
- 中文版與 -en 版的數字、主張逐句一致，下列行號以中文版為準，英文版同樣適用。

## 🔴 Contradicted

無。數字全部抄對（見最後的數字核對表）。

## 🔵 Misframed（數字對，但歸屬、框架或強度有偏差）

1. **「這篇回顧本身的品質也不高：分數 8 到 20 分（滿分 32），平均 14.4 分」**（line 79；en 同）
   - Quarmby 原文：8–20/32、平均 14.4 是**納入的 34 項研究**的 Downs and Black 分數，不是這篇系統性回顧本身的品質分數；"The quality of most studies overall was quite low, as 64.7% of studies were cross-sectional designs"。
   - 主詞錯了：被評分的是被納入的研究。
   - 建議修法（縮回原意）：「這篇回顧納入的研究品質偏低：Downs and Black 分數 8 到 20 分（滿分 32），平均 14.4 分，近三分之二是橫斷式研究。」

2. **「負荷不是越多越好，這個問題研究還沒有答案」＋ 小標「負荷也有代價」**（line 75、79）
   - Quarmby 的 intensity 是**攀岩難度等級／程度**（"usually measured by climbing grade or level of climbing (e.g., intermediate vs. elite climbers)"），不是肌腱承受的機械負荷；結論只說 "associated with an increased risk of injury"，作者也承認多因子交互作用目前無法下結論。
   - 文章前一句已寫「有關聯，不是造成」，但最後一句與小標又把「難度等級」換成「負荷」，並暗示負荷越多越傷，等於把關聯讀成劑量反應。
   - 建議修法：縮回原意，例如「它能支持的只有：攀的難度越高，傷害風險越高（關聯），攀岩時數與傷害的關係則研究互相矛盾。」小標改成不含「代價」的中性寫法，或刪掉最後一句。

3. **「研究品質中等。納入的研究用 PEDro 量表評分，中位數是 4 分」**（line 61；en 同）
   - 原文：PEDro 在這篇是**修訂後滿分 8**（因為受試者與治療者不可能盲，第 5、6 項一律不計；單組設計滿分只有 4），中位數 4（IQR 3–6），調整後中位數 50%，44% 的研究達 60% 以上；作者自己的結論是 "The overall quality of included studies was moderate to high"，且只有 1 篇符合全部適用準則。
   - 文章沒寫滿分，讀者會按標準 PEDro 10 分制把「4 分」讀成很差；同時把作者的「moderate to high」縮成「中等」。
   - 建議修法（縮回原意）：「納入的研究用 PEDro 量表評分（這篇修訂後滿分 8），中位數是 4，約是滿分的一半；作者的整體判斷是中等到高。」或刪去分數，只留 7% 那句。

4. **「只有 7% 的研究報告了隨機分派與分派隱匿」**（line 61）
   - 原文有兩處：結果段 "not specifying the method of randomisation and concealment (7% of **eligible** studies met criteria)"，討論段 "Allocation concealment (reported in 7% of studies)"；而同一討論段又說 "Randomisation of groups ... was not reported in 21% of included studies"，也就是約 79% 有報告隨機分派。
   - 「7%」是「同時具備隨機分派方法與分派隱匿」的合併準則，分母是適用的（多組設計）研究，不是 61 項全部。文章句子可被讀成「93% 沒有隨機分派」，與原文的 21% 相衝。
   - 建議修法：改成「分派隱匿幾乎沒人報告（7%）」，不要與隨機分派併寫；或整句刪掉（讀者用不到）。

5. **「發現硬度上升主要跟彈性模數有關，跟橫截面積無關」**（line 47）
   - 原文：meta-regression 只用 **20 項**同時量三項的研究，模數 p < 0.001，CSA "was not a significant moderator (p = 0.19)"。「未達顯著」不等於「無關」；而且分析單位是 20 項、不是 61 項。tldr 與「白話是…變硬主要是材料變硬，不是變粗」沿用同樣強度。
   - 建議修法：「在同時量了三項的 20 項研究中，硬度的上升主要跟彈性模數有關；橫截面積的關聯沒有達到顯著。」tldr 的「主要是材料變硬，不是變粗」可保留，作者結論本身就是 "main mechanism ... is increased tendon modulus"。

6. **「作者自己列了幾項限制」下的兩條**（line 55、59、60）
   - 「比的是訓練前後，沒有抽取對照組資料」出自方法段（"No control group data were extracted due to the heterogeneity between control groups"），Limitations 段只提到用 SMD 而非 SMC，原因包含部分研究沒有對照組。語意接近，但不是作者列為限制。
   - 「只涵蓋下肢。手指、肩膀、手肘的肌腱不在範圍內」：全文**完全沒有** finger、shoulder、elbow、pulley 等字，作者沒有談過這點。這是研究範圍（標題即 Lower Limb）加上本站的判斷，不是作者的限制。先前精讀紀錄把「不能直接套到手指滑車、肩袖或肘部肌腱」列為作者限制第 8 項，**與全文不符**，應更正精讀紀錄。
   - 建議修法：把引言改成「這個結果的限制」，或把第 4 條移出「作者列的」範圍，直接寫成本站的判斷（「它的範圍只有下肢，我不會用它推論到手指」）。

7. **手指段：「三類東西，都不是『手指肌腱怎麼適應』的直接研究」＋「個案報告」「只有一個人」**（line 67、70；tldr）
   - Pastor 2022 全文讀完：它是**個案報告加文獻回顧**（標題 "A Review of the Literature"，文章參考資料也這樣標），並且**直接量了屈指肌腱厚度**：超音波下 A2、A4 滑車、屈指肌腱、掌板「thicker compared with the non-climber」。討論段還整理了其他橫斷式研究：Schreiber 2015（肌腱、滑車、掌板比對照組厚）、Garcia 2018（20 位青少年攀岩者）、Klauser（52 位極限攀岩者，滑車較厚）、Fröhlich 2021 十年追蹤（軟組織參數較基線更厚）。
   - 所以「手指肌腱適應沒有任何直接研究」說得太滿。比較準確的狀態是：有橫斷式與個案層級的超音波觀察顯示攀岩者屈指肌腱／滑車較厚，但設計不能證明是負荷造成的適應、也沒有訓練介入研究。文章把 Pastor 只描述成「軟組織和骨頭的變化」且「只有一個人」，漏掉它回顧了其他研究。
   - 建議修法（縮回原意）：保留「找不到可靠的介入研究」，補一句「橫斷式的超音波研究看到攀岩者的屈指肌腱和滑車比不攀岩的人厚，但這種比較不能說明是負荷造成的」；或維持現狀但把「都不是直接研究」改成「都不是介入研究」。這也是 tldr「目前找不到可靠的研究」需要一起調的地方。
   - 另：「找不到」是檢索範圍的陳述；候選清單只有這三篇，非窮盡檢索，見下方 Unverifiable。

8. **「這是他們的推論 … 他們也寫到，這方面的介入研究很少，對攀岩表現的證據有限」**（line 69）
   - Saeterbakken：「介入研究很少、對攀岩**表現**改善的證據有限」是在**表現**章節的總結（"The number of intervention studies conducted is few and evidence of potential performance improvement in climbing is limited"，上下文是高反覆輕負荷 RT 與等長指屈肌收縮），**不是**在談肌腱受傷預防。
   - 文章用「這方面」緊接在肌腱受傷預防之後，會讓讀者以為「RT 預防肌腱傷的介入研究很少」。
   - 建議修法：把「這方面」改成「攀岩表現方面」，或拆成獨立一句。

9. **Pastor 的「他被選中是因為他是負荷最高的一小群人之一」**（line 70）
   - 原文：被選中是因為他是首位攀 8B／8B+／8C 的人；"It is therefore **hypothesized** that he belongs to a small group of people with the highest accumulative loads"。這是作者的假設，文章寫成已知理由。
   - 「晚期還有關節炎的徵象」：這位 52 歲者所有手指的 PIP 與 DIP 都有 OA 徵象；摘要的 "at later stages" 指整個攀岩生涯的後期，不是這個個案的疾病分期。可留，建議改成「長年高強度攀岩後」。
   - 建議修法：「他被選中，是因為作者假設他屬於累積負荷最高的一小群人。」

10. **「受試者多半沒受過訓練」**（tldr、line 58 標題）
    - 原文是 "untrained or recreationally active with no consistent histories of resistance training"，意思是未受規律阻力訓練，包含休閒運動者。tldr 的「沒受過訓練」略強，但方向一致，屬低風險，列為可選修。

## 🟡 Unverifiable

1. **「手指肌腱的適應，目前找不到可靠的研究」**：本次只查了候選清單內的來源，沒有做窮盡檢索（Pastor 全文已指出存在橫斷式超音波研究，見 Misframed 7）。這句的陳述本質是「我沒找到」，屬作者陳述，無法由來源驗證。若要保留，建議明確限定為「手指肌腱的訓練介入研究」。
2. **「依據是他們引用的其他文獻」（Saeterbakken [139]）**：本次沒有讀 [139]，無法確認它支持「RT 降低肌腱傷」；文章只說這是作者推論、依據是引用文獻，與全文一致，不影響主張。
3. **「肌肉出多少力，要靠這一段傳過去」**（line 37）：OpenStax 只寫張力由肌肉經結締組織傳到肌腱再到骨膜；「要靠這一段傳過去」是本站的白話引申，屬一般解剖常識，低風險，無需處理。

## 🟢 Confirmed

OpenStax 10.2（line 37）：原文 "The tension created by contraction of the muscle fibers is then transferred through the mysia, to the tendon, and then to the periosteum to pull on the bone for movement of the skeleton." 文章的轉述準確（單一來源，低風險）。

Lazarczuk 2022（單一論文，高風險數字依全文核對，未另找第二份獨立來源）：
- 61 項、763 人（男 615、女 135、未註明 13）。
- 對象健康下肢肌腱（跟腱 33、髕腱 24 項為主；另有股外側肌腱膜 2 項，文章寫「跟腱和髕腱」略簡化，可接受）；介入以阻力訓練為主（49 項）。
- 硬度中度、模數大幅、CSA 小幅上升。
- 只有阻力訓練對模數與 CSA 有明確上升；高應變（~5%）優於低應變（~3%，"did not induce significant increases for any outcome"）；只有 3 項研究提供應變資訊（Limitations 原文）。
- 除 1 項外每項 ≤ 15 人；只有 3 項納入受過良好訓練者，三項都沒有髕腱硬度變化。
- 沒有抽取對照組資料。
- 摘要與 Key Points 的說法與文章一致。

Saeterbakken 2024：手指和肩膀是最常見的非急性受傷部位 ✓；RT "may reduce" 肌腱傷 ✓（用 may，文章也寫「可能」）；敘述性回顧 ✓。

Pastor 2022：n = 1，52 歲，超音波、X 光、理學檢查 ✓；軟組織與骨頭變化 ✓；作者自己寫 "broad conclusions cannot be drawn based on a single climber" ✓。

Quarmby 2023：34 項、10,049 人 ✓；強度 21 項中 19 項顯示傷害風險隨強度上升（原文 "the remaining 19 studies indicated some level of association ... linear and positive"）✓，其餘兩項是一項前瞻研究與一項只看腳傷的回溯調查；攀岩量與傷害「互相矛盾」✓（原文：一項前瞻研究有關聯、兩項前瞻研究無關聯、五項橫斷研究有關聯）；Downs and Black 8–20/32、平均 14.4 ✓；64.7% 橫斷式 ✓（「近三分之二」）；不是肌腱專屬 ✓；沒有 meta-analysis，文章也沒有宣稱有 ✓。

## 數字核對表

| 文章數字 | 來源 | 結果 |
|---|---|---|
| 61 項 | Lazarczuk 摘要／結果 | ✓ |
| 763 人 | 同上 | ✓（唯一受試者數） |
| 除一項外 ≤15 人 | Limitations | ✓ |
| 3 項受過良好訓練者，髕腱硬度無變化 | Limitations | ✓ |
| PEDro 中位數 4 | 結果 Study Quality | 數字 ✓；滿分 8、IQR 3–6，文章未寫分母 → Misframed 3 |
| 7% | 結果／討論 | 數字 ✓；分母是 eligible studies、與 21% 並存 → Misframed 4 |
| ~5% 與 ~3% | Relative Intensity and Strain | ✓ |
| 3 項量應變 | Limitations | ✓ |
| 34 項／10,049 人 | Quarmby 摘要、3.3 | ✓ |
| 21 項中 19 項 | Quarmby 3.6.4 | ✓ |
| 8–20／32，平均 14.4 | Quarmby 3.2 | 數字 ✓；主詞應是「納入的研究」→ Misframed 1 |
| 64.7%（近三分之二） | Quarmby 3.2 | ✓ |

## 其他觀察

- 歸因標籤密度：全篇「作者自己列、作者說、作者還說、作者提醒、作者認為、作者用…」至少 6 處，超過 3 處門檻。建議合併：例如限制段只在引言說一次「以下來自作者的討論與限制」，各條不再重複「作者說」；Misframed 6 的修法剛好可以一併處理。
- 英文版與中文版的主張、數字逐句一致，上面所有發現同時適用於 -en。
- 範圍聲明：本次只檢查了文中已提出的主張（約 40 條，含 12 個數字），未評估文章對主題的覆蓋是否完整。
- 精讀紀錄需更正（不屬於文章）：`extractions/lazarczuk-2022-tendon-loading.md` 的限制第 8 點（「不能直接套到手指滑車、肩袖或肘部肌腱」）和第 6 點的「7% 的研究有報告」分母；`extractions/pastor-2022-climber-fingers.md` 已過時，全文現在讀過，且內含肌腱厚度結果與其他橫斷式研究。

下一步（未完成前不能 commit）：post-review、post-polish
