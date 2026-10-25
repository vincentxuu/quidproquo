# post-verify：recovery-and-sleep（order 9）

檔案：src/content/posts/learning/2026-10-25-recovery-and-sleep.md（zh）、-en.md
取得方式：Groundlane web_fetch 抓 Europe PMC fullTextXML（truncated:false），五篇全文皆重新取得並程式搜尋比對；Davis 2021 勘誤（PMID 33981450 → PMC8072748）也取得全文。

## 來源取得程度
| 來源 | 取得 |
|---|---|
| Kong 2025 PMC11996801 | 全文 81,933 字元：摘要、方法定義、結果、討論、限制、結論、經費、分工、利益衝突、單位 |
| Craven 2022 PMC9584849 | 全文 96,061 字元：摘要、Key Points、方法定義、結果、表 2、表 3、限制、利益聲明 |
| Davis 2020 PMC7228568 | 全文 91,916 字元（正文，無摘要段） |
| Davis 2021 勘誤 PMC8072748 | 全文 |
| Berjisian 2026 PMC13627639 | 全文 69,228 字元，讀摘要、Key Points、重疊、慢性適應、限制 |
| Jin 2026 PMC13531764 | 全文 58,964 字元，讀摘要、3.4、3.7、3.9、4.3、4.6、5 |

## Contradicted
無。

## Misframed

1. 【zh L53 / en L53】「兩份對哪種睡眠不足比較傷說法大致一致：整晚沒睡，或比平常早起，影響比較一致」
   - 對應本身站得住：Craven 方法定義 late restriction = 比平常早醒、early restriction = 延後入睡（"participants awakened earlier than normal"／"went to sleep at a later time"）；Kong 方法定義 PSDE = 提早起床、PSDB = 晚睡。Kong 的 PSDE ≈ Craven 的 late restriction，兩邊都是該型最強（Kong PSDE：EP、MF、speed、RPE 顯著；Craven late restriction −7.39%，p<0.001）。文章用白話並註明標籤相反，做法正確。
   - 走樣處：「整晚沒睡影響比較一致」只有 Craven 支持（Craven Key Points：deprivation 與 late restriction 一致為負）。Kong 的 TSD 只有有氧耐力顯著（SMD −0.56, P=0.03），PSDE 反而範圍更廣。晚睡型：Kong 的 PSDB 並非沒有影響（skill control SMD −2.12、RPE 0.47 顯著，speed P=0.05），Craven early restriction 整體 −5.85（p=0.125）不顯著。所以「晚睡」這一項兩份並不一致。
   - 建議改法：只保留「兩份都顯示提早起床那型影響最明顯」，把整晚沒睡與晚睡拆開；晚睡寫成「Craven 沒有看到一致影響，Kong 在少數結果（動作技巧、費力感）看到影響，兩份對這型不完全一致」。「大致一致」改為「在提早起床這型上一致」。
   - 補充：兩篇統合分析引用的原始研究可能重疊（兩篇都是同領域），「獨立佐證」的說法要保守；我沒有逐篇核對重疊度，不判定。

2. 【zh L67 / en L67】利益關係處理第三點：「另一份 Craven 的統合分析，方向相同」
   - 利益揭露本身與原文一致：Kong 通訊單位列 GG 屬 DeRucci Healthy Sleep Co., Ltd., Beijing；利益聲明 "Author GG was employed by DeRucci Healthy Sleep Co., Ltd."，其他作者無商業或財務關係；經費 "no financial support was received"；分工 GG 只有 Conceptualization、Writing–review and editing，Formal Analysis 為 YK、BY、HH。文章推論有保留（「我無法確認實際情況，所以不拿這點當作沒有影響的證明」），沒有過頭。Craven 聲明 "no conflicts of interest ... directly relevant"、經費 "No sources of funding" 也一致。
   - 走樣處：「方向相同」只在整體方向（睡眠不足 → 表現下降）成立；細項（見第 1 點）並不一致，且 Kong 的結論句 "PSDE ... more pronounced" 在 Craven 有對應，但 TSD 與 PSDB 沒有。建議改「整體方向相同（睡眠不足後表現下降）；細項不完全一致」。action item 2.1（L87）括號「Craven 的結論方向是否相同」同步微調。
   - 一個可選的補充：DeRucci 在 Kong 中是單位（affiliation），不是資助者；文章已寫經費為無，沒問題。

3. 【zh L77 / en L77】Jin 假浸泡：「有一種假的、水溫不冷的浸泡，表現得和有效的方法一樣好或更好，作者認為這顯示期待的影響無法和生理效果分開」
   - 原文：假浸泡（thermoneutral 27 °C）只來自一個試驗（Batista 2024，青少年游泳選手，競技程度），"No sham contrast reached significance, and all derive from one trial, so no inference about thermoneutral immersion itself is warranted"（3.7）。「所有主動方法」也過頭：3.7 實際是柔軟度第 1、運動表現 11 節點中第 3、CMJ 勝過兩個按摩臂；摘要寫 "ranked at or above every active modality on all three outcomes" 與 3.7 內文不完全相符，是原作者摘要的強度問題，文章承襲了摘要。
   - 「有效的方法」用詞錯誤：這些方法並未被證明有效，正是整篇的結論。
   - 建議改法：「其中一個青少年游泳選手的試驗，納入了一個水溫不冷的假浸泡組，它的排名不輸多數主動方法；但只有這一個試驗，沒有任何假浸泡的比較達到顯著，作者自己也說不能據此推論假浸泡本身。作者把這個模式當作『期待效應可能無法分開』的線索」。把「有效的方法」改為「主動恢復方法」。
   - 同段「拿掉兩個試驗就會反轉，所以作者不下痠痛的結論」：因果連接不對。作者不下 DOMS 結論的原因是 DOMS 結果完全依賴工作表中「估計值而非擷取值」的兩個試驗（3.9、4.6：「we do not present a DOMS conclusion in either direction until they are [resolved]」）；「拿掉兩個試驗就反轉」是同一件事的呈現（拿掉那兩個，四種方法反而顯著，作者明說這「不是方法有效的證據」）。建議改為「痠痛結果完全取決於兩個數值是估計而非擷取的試驗，拿掉後結果就反轉，所以作者兩個方向都不下結論」。
   - 同段「更正先前版本的錯誤後重做」：原文是投稿版本在審稿時發現 4 個試驗編碼錯誤與 4 個結果在擷取表沒有對應資料，已重做；不是已發表版本的更正。建議寫「投稿版本在審稿時發現編碼錯誤，作者重做了全部分析」，避免讀者以為有一份已發表的舊版。「資料公開供檢查」：全文寫 "analysis code and arm-level dataset are available"，方法段寫 "(repository/on request)"，連結沒有落實；建議改為「作者說分析程式碼與逐組資料可取得」，不寫成已公開。

4. 【zh L79 / en L79】「兩份冷水浸泡相關的回顧，在痠痛上說法不同：Berjisian 說有降低，Jin 說沒有任何方法勝過被動恢復」
   - Jin 明確不下痠痛結論（4.6 第二點、3.9）；「沒有任何方法勝過被動恢復」是對所有結果的總結，不是痠痛結論。這段把 Jin 寫成與 Berjisian 在痠痛上「說法不同」，其實是 Jin 對痠痛是「不下結論」。另外 Berjisian 是對統合分析的整理（對象為健康成人／各種運動），Jin 是耐力運動員的 16 個隨機試驗，比較基準不同。
   - 建議改法：「Berjisian 整理的統合分析多數發現痠痛評分降低；Jin 的痠痛分析因資料問題，作者不下任何結論。兩者不矛盾，是證據層級與族群不同。」並刪除「可能原因是…」那句推測，或保留但說明 Jin 並未下結論。

5. 【zh L75 / en L75】Berjisian：肌力與肌肉量被削弱
   - 數字與文字都對：15 SRMA、161 研究、AMSTAR 2 "low to critically low"、GRADE "low to very low"、重疊 64%（只在談力量／肌肥大的兩篇之間 [20,21]）、肌肥大 cSMD −0.22 "small"、"rather than routine application after all exercise sessions"；競爭利益與資金都是無。
   - 走樣處之一：Berjisian 同一組分析顯示「肢體浸泡削弱肌力（−0.31），全身浸泡無明顯影響（−0.08）」，Key Points 也特別寫出。文章只寫「可能削弱」，沒有交代這個條件。建議補一句「作者指出僅浸泡運動肢體時才看到明顯減弱，全身浸泡沒有明顯影響」。
   - 走樣處之二：「肌力表現沒有改善」正確，但 Berjisian 還報告了改善：浸泡後立即的耐力表現、24–72 小時的爆發力與跳躍，以及初期的跳躍下降。文章整段只寫對痠痛與 CK 的好處，容易讀成「除了痠痛外沒有好處」。建議加一句「作者也報告部分爆發力與跳躍在 24–72 小時有改善，但同一份回顧的確定性低到非常低」。
   - 「效果小」：作者只對肥大（cSMD −0.22）用 "small"；肌力是 SMD −0.23、median power 0.07（檢定力極低）。建議把「效果小」改為「肌肉量的效果作者稱小；其中肌力那篇的檢定力很低」。
   - 範圍：我讀的是摘要、Key Points、傳統結果各節與限制；補充表未取得。

6. 【zh L73 / en L73】Davis：「小幅改善」
   - 數字全對（29、12 RCT＋17 交叉、1012、柔軟度 I² 90%、DOMS 86%、各由一個離群研究拉動、DOMS 全為主觀量表、結論句）。
   - 「小幅」是作者用語（"small but statistically significant"；7%、13%），但對應的標準化效果量 SMD 1.07 與 1.13，慣例上屬「大」，且 CI 下限 0.21 與 0.44。建議加註「作者以百分比稱小幅（7%、13%），標準化效果量高於 1 但區間很寬，且被離群值拉動」，避免與文中 glossary「效果量」互相矛盾。
   - 作者的限制「小樣本、方案多樣、低檢定力」在文中沒有提到，是漏掉的限定語，建議在 L73 補。

7. 【zh L39–41、標題、tldr】「睡不好」與研究的操作定義
   - 標題與開場寫「睡不好」，但兩份研究測的是睡眠量被縮短或剝奪（Craven 定義 ≤6 h／24 h；約 98% 的結果只量睡眠時間，文中 L59 已寫）。「睡不好」會被讀成睡眠品質差，作者明說沒有辦法探討睡眠品質（Craven 限制）。建議標題與開場改「少睡」「睡眠被縮短」，或至少在開場一句講清楚；因果用語本身沒問題（隨機實驗，且文中已標「在實驗條件下」）。

## 次要（Confirmed，但可補強）
- Craven AM/PM（L53 的「下午影響比較明顯」）：Craven 表 3 AM −5.42 (−9.66 至 −1.17, p=0.013)，PM −8.31；正文也寫 "consistent negative influence on performance when tasks were performed in both the AM and PM; however the magnitude ... larger for PM"。摘要和 Key Points 的 "largely unaffected" 與自己的表 3 矛盾，文章沒採摘要說法是對的。建議補一句「上午測也有顯著下降，只是幅度較小」，避免讀者以為上午不受影響。Kong 的 a.m. 也有顯著結果（speed、RPE）。
- Craven 69 vs 77：已解決。方法段：75 篇符合，排除 6 篇，剩 69 篇 publications，提供 77 個 "studies"（多出 8 個參與者池）；959 人與 89% 男性是 77 個研究的分析（摘要與結果段都用 959）。文章寫「69 篇文獻，959 人」與原文一致，不矛盾，不需要改；若想更精確可寫「69 篇文獻（77 個研究）」。evidence.md 的「未解決 1」可以結案。
- Craven 的 0.4% 每小時：Key Points／摘要為 "~0.4% decrease for every hour awake"，是 meta-regression，剝奪與 late restriction；文章「約再降 0.4%」「不是對單一個人的預測」正確。
- Kong 670 人：Kong 說「七個研究的資料因為睡眠介入時長、族群或測試方法不同而被納入兩次」，670 人可能含重複計數；文章照寫 670 並無錯，但「共 670 人」可加「（作者標示）」。
- Kong 其他數字：45 研究、28／17、運動員 AE／EP／MF／speed／skill／RPE 顯著、非運動員 AE 顯著、AE 發表偏差 Egger P=0.032、trim-and-fill 後穩定、「lacks insights into long-term effects」、女性少無法分析性別，全部與原文一致。無氧耐力不顯著我沒有重抓該段（精讀紀錄 SMD −0.08, P=0.6），本次未重驗。
- 「只讀摘要」問題：Berjisian／Jin 兩篇文章都有全文可讀，文章沒有把摘要當全文用；文章對 Jin 的明示態度（「只能當一個參考，不當定論」）與其自述的資料問題一致。

## Davis 2021 勘誤（PMID 33981450）
- 可取得：Europe PMC 對應 PMC8072748，標題 "Correction: Effect of sports massage on performance and recovery"，DOI 10.1136/bmjsem-2019-000614corr1。
- 內容：只替換圖 3（衝刺、耐力、疲勞的森林圖），說明原本刊出的是錯誤版本。更正圖說：衝刺 overall p=0.27、耐力 p=0.91、疲勞 p=0.22。
- 對文章的影響：文章引用的 29 研究、1012 人、七個結果、柔軟度／痠痛 I²（90%、86%）全部不在圖 3 內，而且文章對衝刺、耐力、疲勞只寫「沒有找到證據」，與更正後的 p 值（皆不顯著）一致。更正沒有動到文章用的任何數字。正文中的對應數字（衝刺 SMD −0.35、耐力 SMD 0.21、疲勞 SMD 0.47 等）和更正圖說的 p 值是否一致我沒有逐一核算，文章也沒有使用這些數字。evidence.md「未解決 4」可結案；建議在文章或 evidence 註記「已核對 2021 勘誤，只更換圖 3」。
- 未取得：勘誤的 PDF 版圖形本身（我只有圖說文字）。

## 英中一致性
en 與 zh 的主張互相一致；上列 1–4、6 的問題在兩版相同位置存在，修正時需同步。en L53「Both also found larger effects for tests done in the afternoon」與 zh 一致。

## 範圍聲明
只檢查文中已提出的宣告；未檢查文中沒寫的主題（睡眠時數、午睡、肌肉合成、受傷風險、補充劑、攀岩專屬證據）。「在我查的範圍內沒有找到攀岩專屬證據」是搜尋範圍的聲明，這次沒有重新搜尋。DeRucci 的產品線未查（文章只寫「名稱和睡眠有關」，沒有誇大，維持現狀即可）。Davis 2020 摘要、Kong 無氧耐力段、Berjisian 補充表、Jin 方法細節與補充表本次未重新取得。
