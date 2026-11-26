# post-verify report: learning/2026-10-24-human-body-overview（zh-TW）＋ -en

查證日：2026-10-24。未修改任何檔案。

## 實際讀完的頁面（如實列出）

| 來源 | 狀態 |
|---|---|
| A. WHO 2020（PMC7719906）Europe PMC 全文 XML | 用 Groundlane web_fetch（format=text, extract=full）取回，約 80,021 字元，`truncated:false`。含 Methods、Table 1–4、各族群證據摘要、討論、參考文獻，已讀 Introduction 至 Table 4 與各族群證據段，其餘段落（懷孕、慢性病、討論）以關鍵字（observational、cohort、limitation）掃過，未逐字讀。 |
| B. Lazarczuk 2022（PMC9474511）Europe PMC 全文 XML | 同上，約 98,597 字元，`truncated:false`。已讀 Abstract、Key Points、Introduction、Methods（含 Table 1）、Results 前半（受試者、訓練類型、負荷參數）、Discussion 的 age／limitations 段；Table 2 逐篇表只看前半，Results 後半與 Discussion 其餘部分用關鍵字掃，未逐字讀。 |
| C. OpenStax §10.1 | web_fetch 取回全文（text, full），`truncated:false`，已讀完。 |
| D. OpenStax §10.2 | 同上，已讀完。 |
| 樂詞網 terms.naer.edu.tw | **沒讀到詞條內文。** 搜尋頁與 `/detail/1314566/` 被導回首頁（finalUrl 為首頁）。只拿到搜尋摘要：「Meta-Analysis - 整合分析」詞條的相關詞列表出現「後設分析；統合分析 meta analysis」。「systematic review」與「certainty of evidence/GRADE」搜尋沒有對應詞條。台灣用語結論因此是 Unverifiable，不是已查證。 |

工具：Groundlane web_fetch / web_search（未降級）。curl 未使用。

---

## 一、主線每一環（神經→收縮→肌腱→骨頭→血管）

| # | 句子（zh line 39 / en line 39） | 判定 | 依據 |
|---|---|---|---|
| 1 | 神經送出訊號，骨骼肌才會收縮；「完全依賴神經系統的訊號才能運作」 | Confirmed（C、D 兩源） | C：「skeletal muscle completely depends on signaling from the nervous system to work properly」。D：「the only way to functionally contract a skeletal muscle is through signaling from the nervous system」；「excitation step ... always triggered by signaling from the nervous system」。 |
| 2 | 肌肉出的力，經過肌腱傳給骨頭，骨頭被拉動，身體才動 | Confirmed，有一處限定被省略（見 Misframed M1） | D：「The tension created by contraction ... is then transferred through the mysia, to the tendon, and then to the periosteum to pull on the bone for movement of the skeleton」。但 D 開頭限定「In skeletal muscles that work with tendons to pull on bones」，並明說另有肌束膜接到腱膜（aponeurosis）或筋膜的情況。 |
| 3 | 收縮要消耗能量 | Confirmed | C：「All muscles require adenosine triphosphate (ATP) to continue the process of contracting」。D：「Muscle contraction requires energy」。正文沒有為此句掛連結，出處是 C／D 同頁，建議補連結或維持現狀（低風險，單源即可）。 |
| 4 | 肌肉也靠血管送來氧氣、帶走廢物 | Confirmed | D：「richly supplied by blood vessels for nourishment, oxygen delivery, and waste removal」。 |
| 5 | 把四環串成「一條線」、以「拿起一杯水」為例 | 作者的組織方式／教學例子 | C、D 各自支持單環，沒有任何一頁把這四環寫成一條序列。血管那環在 D 是肌肉的供應條件，不是訊號傳導之後的下一步；正文用「也靠」，語氣已有區隔，可接受。「拿起一杯水」是自製例子，不是出處原例。 |

主線結論：每一環都有出處（C 或 D），沒有一環是無來源的事實。串成單一序列是作者的整合，來源沒有這樣寫，正文也沒有宣稱來源這樣寫，可留。

## 二、證據四題

| # | 宣告 | 判定 | 依據／備註 |
|---|---|---|---|
| Q1a | WHO 指引主要建立在系統性回顧上 | Confirmed | A Abstract：「used and systematically updated recent relevant systematic reviews; new primary reviews addressed additional...」；Methods：沿用並更新各國指引的系統性回顧，另委託 6 項 umbrella review。 |
| Q1b | 「很多結論來自追蹤一群人的觀察性研究，看到的是兩件事一起出現，不等於一件事造成另一件」 | Unverifiable（作為「WHO 指引」的描述）／Misframed 風險 | A 全文沒有出現 “observational” 一詞。A 提到 “pooled analyses of cohort studies”、“evidence from cohort studies”（取消 10 分鐘 bout 限制那段），並大量使用 “associated with”，但也有 RCT 證據（例如懷孕的 “intervention trials”、老年人跌倒的 “balance and functional exercises reduce the rate of falls”）。整體比例來源沒說。這句目前讀起來像是在描述 WHO 證據的組成，建議縮成一般性提醒（「很多健康說法來自觀察性研究」），不要掛在 WHO 名下。 |
| Q2a | GRADE 分四級：高／中／低／極低 | Confirmed | A Table 2A。 |
| Q2b | 高＝對效果估計非常有信心；極低＝信心很低，真實效果很可能和估計差很遠 | Confirmed | A Table 2A：High「Very confident that the true effect lies close to that of the estimate」；Very low「Very little confidence...The true effect is likely to be substantially different」。「差很遠」比「substantially different」略口語，意思沒變。 |
| Q2c | 評級看五件事：偏差、前後一致、準確度、直接性、發表偏誤 | Confirmed | A Methods：「risk of bias, inconsistency, imprecision, indirectness of the evidence and publication bias」。逐項對得上，中英版一致。注意這是 A 列出的降級面向；GRADE 本身另有升級因子，A 沒提，正文標題「評級時看哪五件事」只對 A 的描述成立。 |
| Q2d | 「WHO 用一套叫 GRADE 的方法」 | Confirmed（附註） | A：證據確定性用 “GRADE method or an equivalent methodology”，並 “using the GRADE framework to rate the certainty”。 |
| Q3a | WHO 把建議分強力與有條件兩種 | Confirmed | A Table 2B。 |
| Q3b | 由利弊權衡、證據確定性等因素一起決定 | Confirmed | A：「balance of benefits to harms, the certainty of evidence, sensitivity to values and preferences and the potential impact on gender, social and health equity, as well as acceptability, feasibility and resource implications」。「等因素」已涵蓋其餘。 |
| Q3c | 兒童與青少年久坐建議＝強力建議＋低確定性 | Confirmed（A 兩處：Table 4 與文字） | A：「The sedentary behaviour recommendation was rated as strong based on low certainty evidence」（5–17 歲）。 |
| Q3d | 「強力建議不一定代表證據很硬」 | Confirmed（由 Q3c 的實例支持） | 一個實例支持「不一定」，足夠。 |
| Q4a | WHO 指引明說不處理運動員為競賽表現而做的訓練 | Confirmed，框架有一點偏（見 M3） | A：「do not address the benefits and harms experienced by athletes undertaking the types and amounts of activity necessary to improve performance-related fitness for participation in competition」。 |
| Q4b | 「表 2」是證據確定性定義表 | Confirmed | A Table 2 標題為 “Criteria for determination of the certainty of evidence (A) and interpretation of the strength of recommendations (B)”。 |
| Q4c | 「打開上面的 WHO 論文」（行動建議 2） | Confirmed | 論文為 CC BY 開放取用。 |

## 三、Lazarczuk 2022 細節

| # | 宣告 | 判定 | 依據／備註 |
|---|---|---|---|
| L1 | 整合 61 項研究 | Confirmed（措辭小差） | B：「Sixty-one articles met the inclusion criteria」，共 763 名受試者。來源單位是 “articles”，表中有同一批受試者出現在多篇（如 Fouré 2010/2011/2012、Kubo 2010 兩筆），「61 篇文章」比「61 項研究」精確；glossary 與正文都寫「61 項研究」，可接受，但嚴格說是篇數。 |
| L2 | 比較的是訓練前後 | Confirmed | B：「Studies were required to report both pre- and post-intervention measurements」；SMD 由 “each group's pre- and post-intervention mean and SD” 算出。 |
| L3 | 沒有納入對照組的資料 | Confirmed | B Data Extraction：「No control group data were extracted due to the heterogeneity between control groups」。補充：對照組描述放在線上補充材料（OSM S5），不是完全沒處理。 |
| L4 | 除了一項，每項研究只有 15 人以下 | Confirmed | B Discussion：「with all but one study [95] including ≤ 15 participants」。「15 人以下」含 15，與 ≤15 一致。 |
| L5 | 受試者多半沒有訓練背景 | Confirmed 但略寬（見 M2） | B：「untrained or recreationally active with no consistent histories of resistance training」。來源的限定是「沒有一貫的阻力訓練史」，且包含 “recreationally active”；正文「沒有訓練背景」讀起來是完全沒運動。 |
| L6 | 3 項納入受過良好訓練者，這幾項都沒有看到肌腱硬度的變化 | Misframed（省略限定，見 M2） | B：「Only three studies recruited well-trained athletes ... all of which displayed no change in **PT** stiffness even following high-intensity training」。來源明指髕腱（PT, patellar tendon）硬度，並說 “even following high-intensity training”。正文寫成泛稱「肌腱硬度」。 |
| L7 | 它發現「健康成人的下肢肌腱在阻力訓練後變硬」 | Misframed（見 M2） | 見下。 |
| L8 | 只涵蓋下肢肌腱 | Confirmed | 標題與 Table 1：lower limb；跟蹤的是跟腱、髕腱、股四頭肌腱、股外側肌腱膜。 |
| L9 | 只涵蓋健康肌腱 | Confirmed | B Table 1：排除肌腱病變、術後肌腱、影響肌腱的長期疾病。 |
| L10 | 「不能直接套用到手指的滑車或肩膀」 | 作者推論（來源沒寫手指或肩膀） | B 全文沒有 finger／pulley／shoulder。從「只涵蓋下肢」推到「不能套用到上肢」是合理推論，但屬作者判斷。目前寫法像來源的限定，建議直接寫成主張：「它只測下肢，手指滑車和肩膀沒有被測，所以這個結果不能直接拿來說它們」。 |

### L7 補充：B 的實際範圍比正文寬
- 受試者分組（B Table 3）：兒童 10 人、成人 629 人、老年 124 人。納入標準 “Any age”。正文只寫「健康成人」。
- 介入類型不只阻力訓練：阻力訓練 46 篇、跳躍 9 篇、兩者比較 3 篇、有氧單車 1 篇、阻力＋有氧 2 篇。整體結論是「機械負荷」使硬度中度增加（SMD 0.74）；阻力訓練的硬度 SMD 0.80；跳躍 0.49；併行訓練 0.03（無變化）；B Discussion 另說有氧單獨訓練看不到肌腱效果。
- 年齡效果：高強度阻力訓練的硬度與模量增幅「成人大於老年」。B 結論是阻力訓練可能對各年齡肌腱都有益。
- 所以「健康成人 … 阻力訓練後變硬」是來源的子集，方向對，但把整體發現縮成成人＋阻力訓練，並沒有說明研究也含兒童與老年人。若要把「像不像你」講精確，這其實是個好例子：來源有納入老年人、兒童，且老年人增幅較小。

## 四、特別標出

### Misframed（數字／事實大致對，但範圍或限定被改寬或改窄）
- **M1 主線第 2 環（zh/en line 39）**：D 的原句有前提「In skeletal muscles that work with tendons」，且明說也有肌束膜接腱膜或筋膜的路徑。正文寫成通則。入門文可接受，但「肌腱傳給骨頭」不是每條肌肉的唯一路徑。建議修法（二選一）：縮回原意「多數靠肌腱拉骨頭的肌肉，力量經肌腱傳給骨頭」，或維持現狀但因讀者用不到而不加但書；請作者決定。
- **M2 Lazarczuk 敘述（zh line 73 / en line 73）**：(a) 「健康成人」略去兒童與老年受試者（L7）；(b) 「3 項受過良好訓練者都沒看到硬度變化」省略 “PT” 與 “even following high-intensity training”（L6）；(c) 「沒有訓練背景」比 “untrained or recreationally active with no consistent histories of resistance training” 寬（L5）。三者方向都沒反，但都是省略限定讓意思變寬或變窄。建議修法：縮回原意，例如「這些研究的受試者以沒有一貫阻力訓練史的人為主」「3 項納入受過良好訓練者的研究，髕腱硬度都沒有變化」。「成人」可改為「健康的人（含少數兒童與老年人）」或只說「健康的人」。
- **M3 WHO 運動員例（zh/en line 73）**：此句放在「研究的對象像不像你」之下，但它說的是**指引的適用範圍**（指引不處理競賽運動員），不是 WHO 所依據的研究樣本。兩個例子合在一起講「研究對象」，第一個其實是「指引適用對象」。建議修法：改成「指引也有適用範圍：WHO 明說不處理…」，或移到別的位置。

### 把推論寫成事實／來源沒說的主張
- 手指滑車／肩膀不能套用（L10）：作者推論，來源沒寫。
- Q1b 的「很多結論來自觀察性研究」掛在 WHO 名下（見上）。
- 「整合通常比單一研究穩，因為單一研究再漂亮，也可能只是巧合」「整合得好不好，要看有沒有對照組、人數多不多」：一般方法學常識；B 的限制段（小樣本、單組設計）可作為旁證，但兩份來源都沒用這句話。低風險，作者概括，不必加歸因標籤。
- 「拿起一杯水的時候，身體裡發生的是這一條線」：自製例子，非出處原例（見主線 #5）。

### 中英版不一致
逐句對照後**沒有發現事實層的不一致**：數字（61、15、3）、四級定義、五件事、強力＋低確定性的敘述、Lazarczuk 的限定，zh 與 en 一致。僅有的差異（均非事實錯誤）：
- zh「差很遠」vs en “far from the estimate”，兩者對 “substantially different” 的處理一致。
- 兩版共有同一個缺漏：M2 與 L6／L7 的省略在兩版都有，修正時要兩版同步。
- zh line 53／en line 53：「開頭那三個問題，分別落在『適應』和『疼痛與姿勢』」三題兩段，「該不該常常伸展」沒有對應段落（表格沒有寫伸展）。這不是事實問題，是對應不清，兩版相同，交 post-review。
- en 版 frontmatter 的 `difficulty: 入門` 未翻譯（格式，非事實）。
- 連結：zh 連到 `…climbing-training-diagnosis`，en 連到 `…-en`，兩個檔案都存在（已 ls 確認）。

## 五、詞彙表三條定義

| 詞 | 判定 | 說明 |
|---|---|---|
| 證據確定性（四級＋GRADE 是評這個等級的方法） | Confirmed（A）| A Table 2A 的四級與定義支持「對研究估出來的效果離真實效果多近的信心程度」。「GRADE 是評這個等級的方法」可接受；補充一點：A 用 “GRADE or equivalent”，GRADE 本身也用來評建議強度，定義只講確定性這一半，沒有錯。 |
| 系統性回顧：用事先訂好的方法，蒐集、篩選並整合同一問題的研究 | Confirmed（單源，且為定義性陳述） | A、B 都描述了預先訂定的搜尋與篩選方法（A：agreed set of search terms, databases, standardised extraction；B：PROSPERO 預先註冊、PRISMA）。兩份來源都沒有給出一句定義，所以這是作者的通用定義，與 A、B 的做法相容。 |
| 統合分析：系統性回顧的一種做法，把多項研究的數字合併，得到整體估計 | Confirmed 但措辭可再精確 | B 標題為 “Systematic Review and Meta-Analysis”，以 random effects 合併 SMD，與定義相容。更精確的講法是「統合分析是合併數字的統計方法，常用於系統性回顧之內」；「是系統性回顧的一種做法」可讀成兩者是並列的類型，建議改為「系統性回顧裡用來合併數字的統計步驟」。小事，不是錯。 |

## 六、台灣用語（樂詞網）
- 無法確認。詞條內文讀不到（搜尋頁、詳細頁皆回首頁）。
- 僅從搜尋摘要看到：樂詞網「Meta-Analysis - 整合分析」詞條的相關詞列表同時列有「後設分析；統合分析 meta analysis」，表示「統合分析」「後設分析」「整合分析」都在樂詞網出現，但看不到哪個學科的審譯結果、哪個是推薦詞。**不能據此說樂詞網採用「統合分析」。**
- 「systematic review／系統性回顧」「certainty of evidence／證據確定性」在樂詞網搜尋沒有拿到對應詞條。
- 建議：作者或下一個 session 直接用瀏覽器在樂詞網查「meta-analysis」「systematic review」在醫學名詞與教育／心理名詞的審譯結果；在查到前，這三個中文詞以 PMC／國內醫學期刊慣用法為準，標 Unverifiable。

---

## 彙總

- 🟢 Confirmed：主線四環（C、D）；GRADE 四級、五個考量面向、強力／有條件、兒童久坐＝強力＋低、WHO 不處理競賽運動員；Lazarczuk 的 61、訓練前後、無對照組資料、≤15 人（除一項）、只下肢、只健康。
- 🔵 Misframed（需作者決定）：M1 肌腱傳力通則化、M2 Lazarczuk 範圍與限定（健康成人／PT／訓練背景）、M3 WHO 運動員例屬指引範圍而非研究樣本。
- 🟡 Unverifiable：「很多結論來自觀察性研究」掛名 WHO（Q1b）、手指滑車／肩膀（作者推論，L10）、樂詞網用語。
- 🟠 Outdated／🔴 Contradicted：無。
- 歸因標籤密度：全篇新增的來源歸因標籤不多（<3 處），不需要合併；建議修法皆為縮回原意或直接寫成主張，不加「我的判斷」標籤。

範圍聲明：本次只檢查了文中已提出的宣告（約 30 條），未評估文章對主題的覆蓋是否完整；A 的懷孕、慢性病、討論段與 B 的 Results 後半、Table 2 後半只掃過關鍵字，未逐字讀。

下一步（未完成前不能 commit）：post-review、post-polish
