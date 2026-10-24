## post-verify

文章：`src/content/posts/learning/2026-10-24-energy-systems.md`（及 `-en.md`，英文版與中文版逐句對應，同樣的問題都成立）
查證日期：2026-10-24
工具：Groundlane `web_fetch`／`web_extract`。
- Springer 頁面全文：`extract=full` 只回前 100,000 字元（truncated），所以另用 `selector=section[data-title="Discussion"]`、`section[data-title="Results"]` 取回 Discussion（含 5.1、5.2）與 Results 3.1。
- 表格：`/tables/3`、`/tables/4`、`/tables/6` 取回表 2、表 3、表 5。注意 Springer 的 `/tables/N` 比論文表號多 1（`/tables/6` 才是 Table 5）。
- OpenStax §10.3：`web_fetch` 全文（truncated=false）。
- 沒有重抓 Europe PMC XML：摘要、前言、方法已由 Springer 頁面取得，內容與精讀紀錄一致。
- 精讀紀錄的 Discussion／Limitations 原本沒有程式比對，這次已用 Springer 原文逐句對過。

---

### 🔴 Contradicted（要修）

**1. 「這篇回顧……也沒有攀岩的資料」（zh 第 72 行；tldr 第 9 行「不含攀岩這類間歇運動」；en 第 72、9 行同）**
- 原文：Results 3.1 列出「五篇 Bertuzzi 的研究」，其中包含 ref 81：Bertuzzi RC, Franchini E, Kokubun E, Kiss MA. *Energy system contributions in indoor rock climbing*. Eur J Appl Physiol 2007;101(3):293–300。Discussion 也把它列為「included studies」中訓練狀態的例子。
- 表 3（混合方法，`/tables/4`）有一列 `Climb / Climbers / N=6 / 平均年齡 20.1`。
  - 持續時間 73.8、80.8、82.3、83.9 s。
  - 無氧 58.4、51.5、56.1、57.9%。
  - 有氧 41.6、48.5、43.9、42.1%。
- 所以這篇回顧納入了一項室內攀岩研究（6 位攀登者，約 74–84 秒的路線，四筆資料點）。「沒有攀岩的資料」是錯的。
- 連帶的推論「所以『爬一條路線，無氧和有氧各佔幾成』，從這篇看不出來」也不成立。回顧沒有把攀岩單獨分析，但表裡有一筆攀岩資料可以讀。
- 這個錯來自精讀紀錄 `gastin-2026-energy-system-contribution.md` 第 12 行「**沒有攀岩。**」，那份紀錄當時沒讀到結果段與表格。紀錄也該一併更正。
- 建議修法：縮回來源原意，二選一。
  - (a)「這篇回顧只納入一項室內攀岩研究（6 人、路線約 74 到 84 秒），沒有單獨分析攀岩；其餘資料以跑步與腳踏車為主，所以不能直接套到一般的攀岩路線。」
  - (b) tldr 改成「而且排除了間歇運動，攀岩只有一項小樣本研究」。
- 同時重看第 74 行「不是同一等級的系統性回顧」那句：那項攀岩研究的結果（約 52–58% 無氧）本身就在回顧裡，要不要提由作者決定。

---

### 🔵 Misframed（數字對，框架偏）

**2. 「另一個值得記的發現：作者說，短時間最大運動中有氧的貢獻，比傳統上以為的還大」（zh 第 57 行；en 第 57 行）**
- 原句（Discussion）：「the aerobic contribution … during maximal exercise of short duration is considerable and appreciably greater than traditionally thought [14, 48]」。
- 句子本身是忠實轉述，但「發現」的框架偏了。
  - 這句是 Discussion 的總結語，引用的 ref 14 是作者自己 2001 年的回顧，ref 48 是 Spencer & Gastin 2001，不是這次回顧新得到的結果。
  - 「傳統上」是誰、什麼數字，原文沒有說。
  - 與 2001 年回顧相比，這次只是「≤15 s 多 2–3% 有氧、20 s 相近、30–240 s 多 1–3% 無氧」，整體差 0–3%（Discussion 第一段）。
  - 同一段還說：OD 法在短時間給出明顯較高的有氧貢獻（KFast 顯著較高），原因作者說「uncertain」。
- 建議修法：刪掉。或縮回原意：「作者認為，短時間最大運動的有氧貢獻不小，比過去常見的印象大；這個說法主要建立在氧攝取動力學的研究上，包括他們自己的早期研究。」
- 若保留，「發現」改成「作者的看法」，並刪去「值得記」。

**3. 「兩者各半的時間點，估計在 78.6 秒……超過這個時間，有氧的比例越來越大」（zh 第 54–55 行；tldr 第 9 行「各半的時間點約在 75 到 80 秒」）**
- 摘要原文：「The maximal exercise **duration** that derived equal contributions…was 78.6 s」。
- 表 5 的列是累積區間 0–X s：0–75 s 為 51/49，0–90 s 為 46/54。意思是「一整段持續約 78.6 秒的最大運動，整段總能量中兩者各半」，不是「運動進行到第 78.6 秒時，供能從無氧切到有氧」。
- 「時間點」「超過這個時間」容易被讀成一次運動中的切換時刻，正是精讀紀錄第 2 點警告的誤讀（「攀岩 80 秒後換有氧」）。第 53 行「持續 20 秒左右的估計是 82/18」是對的，用的是整段持續時間。
- 建議修法：把「時間點」全改成「持續時間」。
  - 例：「持續約 78.6 秒的最大強度運動，整段來看兩者各半（摘要的 95% 信賴區間為正負 1.1 秒）；更長的運動，有氧占整段的比例更高。」
  - tldr 同改。

**4. 「受試者約 78% 是男性」（zh 第 65 行；en 第 65 行）**
- 摘要原文：「mean results from studies comprising 78% male, 12% female, 11% mixed adult samples」。
- 78% 是「研究（資料）的樣本組成」，不是受試者人數比例。三個數字加起來是 101%，也顯示這是以研究或資料點為單位的比例。
- 建議修法：縮回原意：「納入的研究裡，約 78% 以男性為樣本、12% 以女性、11% 為混合樣本。」
- 另外，這條不是作者列的限制（見下表）。

**5. 「作者自己說，這些數字是平均趨勢，不是對特定運動項目或特定人的精確預測」（zh 第 68 行）**
- 5.2 原句：「represent averaged trends rather than precise predictions for any particular **exercise mode, pacing strategy, or athlete population**」。
- 「特定運動項目」對應 exercise mode（原文指跑／騎等運動模式，不是「攀岩」「足球」這種項目）；「特定人」對應 athlete population（一類選手），不是個人；「配速策略」被略掉。
- 小幅放大。建議改成「不是對某種運動模式、配速策略或某類選手的精確預測」，或直接寫「是平均趨勢，不是精確預測」。

**6. 「作者還說，把活動標成『無氧』或『有氧』是一個誤導的習慣」（zh 第 45 行）；連帶第 31 行「讀完你能說出為什麼『有氧運動、無氧運動』的標籤會誤導」，glossary 的 context「說明為什麼不能把一項運動直接標成……」**
- 原文（前言）：「a predominant energy system will emerge on the basis of the nature of the activity… This predominance has historically, although misleadingly, resulted in activities being labeled on the basis of their physiology (e.g., anaerobic or aerobic) rather than their activity (e.g., explosive, high intensity, endurance-intensive)」。
- 判斷：大體忠實，但比原文略強。
  - 原文是一個帶 although misleadingly 的插入語，批評的是「用生理系統（無氧／有氧）來命名活動，而不是用活動的性質（爆發、高強度、耐力型）」這個歷史慣例。
  - 它並沒有寫成「標籤本身是誤導的習慣」。
  - 作者的替代做法（用 explosive／high intensity／endurance-intensive 描述活動）文章沒有交代，讀者只知道「誤導」，不知道該改叫什麼。
  - 引用的是 ref 16（Chamari & Padulo 2015 術語批評），那才是論證所在。
- 第 31 行與 glossary 承諾「讀完能說出為什麼標籤會誤導」「不能直接標」。文章能給的理由只有「三套同時運作、某一套成為主要來源」，這是合理推論，但「不能」是文章自己的結論，不是作者的。
- 建議修法：縮回原意。
  - 例：「作者還指出，過去常依生理系統把活動標成『無氧』或『有氧』，而不是依活動本身的性質（爆發、高強度、耐力型）來描述，他們認為這樣的標籤有誤導之嫌。」
  - 第 31 行與 glossary 改成「讀完你能說出為什麼單靠『有氧／無氧』描述一項運動不夠精確」。

**7. tldr／標題「沒有哪一套單獨負責」（zh 第 9 行；標題、第 29 行）**
- 原文有兩個限定語：「No single system is responsible for the energy delivery **for gross motor activity beyond a few contractions**」。
- 文章正文第 45 行有寫「超過幾次收縮之後」，但 tldr 與第 29 行把限定語拿掉。
- 剛開始的幾秒，前言自己說「<10 s 的最大運動，磷酸肌酸與糖解提供高達 95% 的能量」，表 5 的 0–5 s 為 95/5。
- 建議修法：tldr 補回「超過幾次收縮之後」，或改成「沒有哪一套單獨負責整段運動」。

---

### 🟡 Unverifiable／判斷題

**8. 「作者寫模型的預測誤差約 12 到 14%」（第 63 行）**
- 原文有此句（5.2 與 Discussion 第一段），數字 ✓。
- 但「PE」在我取得的段落裡沒有定義（是相對誤差或百分點，無法確認）。文章把它與同一句的 95% CI（±<0.1% 到 6.0%）並列時，沒有說明兩者為何差很多。
- 方法段 2.9 之後的統計說明沒取回，所以只能標待確認。
- 建議：保持原句；若要解釋，需補讀方法段。

**9. 「運動主要是跑步與腳踏車」（第 65 行）**
- 作者沒有寫過這句。
- 我用表 2／表 3／表 4 的 Exercise 欄自行計數：表 2 有 66 列，表 3 有 33 列，表 4 有 7 列，共 106 列（略多於 102 項研究，因為有些研究在多張表出現）。
  - 腳踏車 46、跑步 31，合計 77，約 73%。
  - 其餘：游泳 9、獨木舟（kayak）8、滑雪 4、划船 3、手搖 3、橢圓機 1、攀岩 1。
- 「主要」站得住，但這是我的計數，不是作者的陳述。
- 文章把它放在作者語氣的清單裡，標成 Confirmed (self-count)。可保留「大多是跑步與腳踏車」，不要寫成作者的結論。

---

### 限制歸屬判斷（查證重點 2）

文章第 61 行起的六條限制，各自的出處：

| 文章的條目 | 出處 | 作者列為限制？ |
|---|---|---|
| 預測誤差約 12–14% | 5.2 + Discussion | 是（5.2 明寫 prudent interpretation） |
| 沒有公認的測量方法 | 前言 +5.2「absence of a gold standard」 | 是 |
| 對象偏窄（78% 男性、跑步與腳踏車） | 摘要的描述性數字；5.2 只說 sex distribution 與 training status 等「sample characteristics」有異質性 | **不是**以「偏窄」列出；這是文章的解讀 |
| 只看單次最大強度（間歇、重複衝刺、次最大被排除） | 2.2 納入／排除標準 | **不是限制**，是**設計**（方法段排除標準） |
| 資料較舊（到 2020 年 1 月）＋27% 來自 2001 回顧 | 5.2 末尾：「advancements…since the most recent included study (January 2020) were not captured」；27% 來自 Discussion 第一段（原話「partly to be expected」） | 2020 年 1 月截止：是；「27% 來自 2001 回顧」：**不是**限制，是作者交代估計與 2001 年相近的原因 |
| 平均趨勢，不是個別預測 | 5.2 | 是 |

- 回答「歸屬是否正確」：文章寫成「作者寫／作者指出／作者自己說」的三條（預測誤差、無公認方法、平均趨勢）歸屬都對，**文章沒有把排除間歇運動寫成作者列的限制**。
- 但清單的導語「這個結果有幾個限制，每一個都影響它能套用到誰」把「作者列的」和「設計／讀者解讀」混在同一份清單，讀者會以為六條都是作者列的。
- 建議修法：二選一。
  - (a) 把清單分兩組：「作者列的限制」（預測誤差、沒有金標準、平均趨勢、2020 年 1 月後未納入）與「這篇回顧的範圍」（單次最大強度、男性為主、跑步與腳踏車為主、含 27% 2001 年回顧的資料）。
  - (b) 導語改成「讀這些數字前要知道的幾件事」，不暗示都是作者列的。
- 全篇現有歸因標籤（作者說／作者寫／作者指出／作者自己說／作者還說）約 6 處，超過 3 處。合併或刪掉，改在清單前寫一次「以下限制多數是作者自己寫的」。

---

### 🟢 Confirmed（逐項）

| # | 位置（zh） | 主張 | 來源 | 結果 |
|---|---|---|---|---|
| a | 第 47、53 行 | 102 項研究、311 個資料點 | 摘要 Results | ✓ |
| b | 第 53 行 | 20 秒約 82% 無氧、18% 有氧 | Discussion「similar estimates for a duration of 20 s (i.e., 82% anaerobic, 18% aerobic)」；表 5 `0–20`：82 / 18，95% CI 0.9 | ✓ 兩處一致 |
| c | 第 54 行 | 78.6 s，95% CI ±1.1 s | 摘要 Results | ✓ |
| d | 第 54 行 | 約 75–80 s | Discussion「approximately 75–80 s」；摘要「up until approximately 75–80 s」。表 5：0–75 s 51/49、0–90 s 46/54，與 78.6 s 吻合 | ✓ |
| e | 第 63 行 | PE 約 12–14%，表要謹慎解讀 | Discussion 第一段、5.2 | ✓（見上 #8 的定義問題） |
| f | 第 64 行 | 沒有公認的全身運動無氧能量測量方法 | 前言「no universally accepted method…」；5.2「absence of a gold standard」 | ✓ |
| g | 第 66 行 | 間歇運動、重複衝刺、次最大強度被排除 | 2.2 | ✓ |
| h | 第 67 行 | 研究到 2020 年 1 月 | 摘要「1984 to January 2020」、5.2 | ✓ |
| i | 第 67 行 | 27% 來自 2001 回顧；第一作者同為 2001 回顧作者 | Discussion「28 studies (27%) from the original review」，ref 14 = Gastin PB. Sports Med 2001;31(10):725–41；本文書目 Gastin & Suppiah | ✓（28/102 = 27.5%） |
| j | 第 45 行 | 前言：三條途徑同時參與，超過幾次收縮後沒有哪一套單獨負責，依運動性質會有一套成為主要來源 | 前言原句 | ✓（限定語見 #7） |
| k | 第 33–41 行 | OpenStax：ATP 儲存很少、只夠撐幾秒 | 「only sufficient to power a few seconds worth of contractions」 | ✓ |
| l | 第 37 行 | 磷酸肌酸快、約 15 秒；把能量交給 ADP 變回 ATP | 「creatine phosphate transfers its phosphate back to ADP to form ATP…very quickly」「approximately 15 seconds」 | ✓ |
| m | 第 38 行 | 糖解不用氧、比磷酸肌酸慢、約 1 分鐘 | 「glycolysis cannot generate ATP as quickly as creatine phosphate」「approximately 1 minute of muscle activity」 | ✓ |
| n | 第 39 行 | 有氧：粒線體、葡萄糖或脂肪酸、效率高得多、要穩定供氧、慢、休息或中等活動約 95% | 原文逐項吻合 | ✓ |
| o | 第 41 行 | 同節磷酸肌酸有「最初幾秒」與「約 15 秒」兩種說法 | 「powers the first few seconds」vs「approximately 15 seconds」 | ✓ |

OpenStax 三條途徑的描述沒有比來源強。
- 「速度最快」是對照糖解與有氧的相對比較，原文有此意；文章把秒數標成近似值並自己點出 OpenStax 內部的兩種說法，處理得宜。
- 兩邊有一個文章沒點明的差異：OpenStax 用接力式語言（「muscles turn to glycolysis」「another energy source has to be used」），Gastin 則強調同時運作。文章只用 Gastin 的框架，並寫「這些時間都是近似值」。這不算錯，若要補一句，可寫「教科書用先後順序描述，是為了說明各途徑能撐多久；實際上三者同時運作」。
- OpenStax 同節的 ATP 個數不一致（2 與 4）文章沒用，正確。

---

### 查證重點對照

| 重點 | 結論 |
|---|---|
| (1) 82/18（20 秒）、78.6 s ±1.1、75–80 s、PE 12–14%、102/311、78% 男性、2020 年 1 月、27%、Gastin 同為 2001 作者 | 數字全部 ✓；框架問題見 #3（時間點／持續時間）、#4（78% 是研究組成） |
| (2) 限制歸屬 | 見上表；歸因寫的三條都對，排除間歇運動是設計不是作者列的限制，文章沒有誤標，但清單導語容易讓人以為都是作者列的 |
| (3) 誤導的習慣 | 方向忠實，比原文略強；見 #6 |
| (4) 有氧貢獻比傳統認知大 | 句子忠實，「發現」框架不對；見 #2 |
| (5) OpenStax | 描述與數字忠實，沒有比來源強 |
| (6) 前言「沒有哪一套單獨負責」 | 正文忠實；tldr／標題丟了限定語（#7） |
| (7) 是否暗示攀岩結論 | 沒有給出「攀岩用哪種能量」的結論，明確說不能直接套，這點對。但「沒有攀岩資料」「從這篇看不出來」是錯的（#1） |
| 表 5 核對 | 20 秒 82/18 與正文一致；表 5 是累積區間 0–X s，不是瞬間比例（#3） |

---

### 研究紀錄需更正

- `gastin-2026-energy-system-contribution.md` 第 12 行「沒有攀岩」。
- 第 4 行「結果段 3.2 以後與表 5 數值沒讀到」：現已讀到 3.1、表 2／3／5。
- 「已比對」一節可補：Discussion、5.2 逐句已對 Springer 原文。
- 該紀錄第 13 行對「不能直接回答攀岩」的推論仍可保留，但理由要改成「回顧只含一項 6 人的攀岩研究，且沒有單獨分析」。

---

範圍聲明：本次只檢查了文中已提出的宣告（zh 約 35 條），未評估文章對主題的覆蓋是否完整。
未驗範圍：
- 方法段 2.5–2.9 與結果段 3.2 之後（迴歸模型、PE 定義）。
- 攀岩原研究 Bertuzzi 2007 本身（只讀回顧表中的列）。
- 中英對照以外的站內連結（攀岩篇）。

下一步（未完成前不能 commit）：post-review、post-polish。
