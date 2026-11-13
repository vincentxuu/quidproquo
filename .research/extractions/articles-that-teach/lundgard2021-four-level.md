# 抽取紀錄：Lundgard & Satyanarayan 2021，Accessible Visualization via Natural Language Descriptions: A Four-Level Model of Semantic Content（IEEE TVCG，doi 10.1109/TVCG.2021.3114770）

- **書目**：Alan Lundgard、Arvind Satyanarayan（全名對過首頁 L10、L81–82，皆為 MIT CSAIL）。2021。*IEEE Transactions on Visualization and Computer Graphics*（IEEE VIS 2021 特刊，VGTC Special Issue）。Manuscript received 31 March 2021; accepted 15 July 2021; Date of Publication 30 September 2021（L83–86）。DOI 10.1109/TVCG.2021.3114770。卷期頁碼本檔沒有。
- **原文檔**：`.research/raw/learning-content/q5-social/lundgard2021-four-level.pdf`（11 頁，2,064,614 位元組）。清單上的 `lundgard2021-four-level.txt`（830 行、112,385 字元）是 `-layout` 轉的雙欄檔，**這次沒用**；改用不帶 `-layout` 的 `pdftotext` 重轉成 `.research/raw/learning-content/q5-social/lundgard2021-four-level.seq.txt`（1,383 行、88,008 字元）。但這份 PDF 是 IEEE 雙欄，不帶 `-layout` 轉出來的段落仍然大量跨欄錯置（例如 §3.1 與 §3.2.1、§4.2 與 §4.3、§5.4.5 與 §6 互相插入），所以**正文第 2–9 頁我直接讀 PDF 頁面影像**，文字檔只拿來抄原文與標行號。下面行號是 `.seq.txt` 的行號，頁碼是 PDF 頁碼。
- **取得網址與版本**：https://arxiv.org/pdf/2110.04406v1 （arXiv:2110.04406v1，2021-10-08）。2026-10-14 重新下載，大小 2,064,614 位元組、SHA-1 `da96cf1e…71159` 與本機檔完全相同。每頁頁首自述「© 2021 IEEE. This is the author's version of the article that has been published in IEEE Transactions on Visualization and Computer Graphics.」（L1–3）——**作者版**，作者依 IEEE 政策放在 arXiv；與 IEEE Xplore 的刊出版是否逐字相同沒有比對。作者另有無障礙 HTML 版 http://vis.csail.mit.edu/pubs/vis-text-model/（沒讀）。
- 讀取日期：2026-10-14
- 供 order 23 使用（清單 F，23#6）

## 研究設計

兩段：先用紮根理論建模型（§3），再用排序實驗示範模型的用途（§5）。

### 建模（§3，p.3–4）

- **初始開放編碼**（§3.1，L363–379、p.3）：先找 FiveThirtyEight、紐約時報、金融時報的圖表說明，發現專業網站「usually provided no textual descriptions」，常把圖做成螢幕閱讀器直接跳過（L365–372）。改用兩個來源：研究所資料視覺化課 100 多位學生、最少提示下寫的 330 段描述；作者自己替其中 20 張圖寫的「盡量豐富」的描述（p.3 右欄）。由此形成軸碼與初步類別。
- **語料蒐集**（§3.2，L331–513、p.3–4）：50 張視覺化（來源 MassVis、Quartz Atlas、Vega-Lite gallery、新聞網站），依圖型、主題、難度分類（Table 1，p.3：長條 18、折線 21、散布 11；學術 15、商業 18、新聞 17；易 21、中 20、難 9），難度由兩位作者獨立標再討論。Prolific 招 120 人，約 30 分鐘、時薪 10–12 美元，每人描述 5 張隨機抽的圖，每張至少 10 段。**給受試者預先寫好的第 1 層句子當提示**，要求寫第 1 層以外的內容；**沒告訴受試者描述是給視障者讀的**（L452–454）。得 582 段描述、2,147 句；修正拼字文法（不改語意）後，兩位作者獨立給每句標層級、再討論。
- **語料分布**（p.4 右欄，L383–394）：第 1 層 9.1%、第 2 層 35.1%、第 3 層 42.9%、第 4 層 12.9%。第 1 層少是因為已給了提示句。

### 四層模型（§4、Table 2，p.4–7）

| 層 | 名稱 | 內容 | 計算上的考量 |
|---|---|---|---|
| 1 | elemental and encoded | 圖型、編碼通道、標題、軸範圍、標籤、顏色 | 有圖的規格或點陣圖即可；與觀看者無關（perceiver-independent） |
| 2 | statistical and relational | 描述統計、極值、離群值、相關、點與點比較 | 需要圖的規格或背後資料；與觀看者無關 |
| 3 | perceptual and cognitive | 複雜趨勢、模式綜合、例外、日常概念 | 需要看得到的圖與「常識」；依賴觀看者（perceiver-dependent） |
| 4 | contextual and domain-specific | 領域洞見、時事、社會政治脈絡、解釋 | 需要脈絡知識與領域專業；依賴觀看者（更強的意義） |

（Table 2 已對 p.5 版面。）作者強調層級是依「句子傳達的語意內容」分，不是依句法長短（§2.3.1，p.2）；第 3 層通常用「自然」口語表達，但口語表達是必要不充分條件，第 1、2 層也能口語說（L614–615）。預測句依內容可落在第 2、3 或 4 層（L774–781）。

### 評估實驗（§5，p.7–9）

- **設計**（§5.1，L844–866、p.7）：從 50 張中挑 15 張，三個維度各 5 張平衡。每張圖給 4 段描述、每段只含一個層級的內容，**不標層級、隨機順序**，請讀者依「有用程度」排 1（最不有用）到 4（最有用）。描述是作者從語料中挑句子拼成的「範例描述」（curated exemplar），不是原始受試者寫的整段。「有用」的定義刻意不給，由讀者自行解讀（L794–799）。每題另附一段情境文字（例如「假設你在讀一篇學術論文…」）；給盲人讀者的版本另註明這張圖螢幕閱讀器讀不到。另加第 5 個選項當注意力檢核（與圖無關的句子），沒排最後的作答剔除（L801–806）——**剔除了幾份原文沒寫**。先用 10 位明眼 Prolific 受試者與 1 位盲人合作者試做，改寫說明、加範例題、改善介面的螢幕閱讀器可及性（L854–860）。
- **受試者**（§5.2，L808–879、p.7）：明眼讀者 90 人（Prolific；條件：英語流利、無色覺異常；約 20 分鐘、時薪 10–12 美元；每人只排 15 張中的 5 張）；盲人讀者 30 人（經作者在盲人社群的朋友與 Twitter 招募；條件：熟練使用螢幕閱讀器；約 1 小時、時薪 50 美元；每人排全部 15 張）。每張圖兩組各 30 人排過。盲人組：男 16、女 11、不願透露 3；學士最多（18 人）；20–40 歲 20 人；螢幕閱讀器 VoiceOver 10、JAWS 10、NVDA 9、其他 1。明眼組：男 62、女 28；最高學歷高中 38、學士 36；20–30 歲 58 人。
- **量了什麼**：排序（每組 1,800 筆、合計 3,600 筆排名，L956；= 15 張 × 4 段 × 30 人 × 2 組）；問卷 7 點量表與開放式回饋（§5.4）。
- **分析**：每組各自做 Friedman 檢定，事後用 Nemenyi 做兩兩比較（L963–969）；熱圖以「平均 + 半個標準差」為門檻畫出區域 A–F（盲人組門檻 139、明眼組 136，L960–962）。

## 結果（逐項）

### 排序（§5.3、Table 4，p.8；熱圖數字是讀 PDF 圖上的格子，文字檔裡沒有）

Table 4 上半的格子數字（每格＝該層被排成該名次的次數；每列加總都是 450 = 15 張 × 30 人，我逐列加過，八列都對）：

| 組 | 層 | 排 1（最不有用） | 排 2 | 排 3 | 排 4（最有用） |
|---|---|---|---|---|---|
| 盲人 | 第 4 層 | 177 | 155 | 73 | 45 |
| 盲人 | 第 3 層 | 35 | 81 | 161 | 173 |
| 盲人 | 第 2 層 | 42 | 107 | 170 | 131 |
| 盲人 | 第 1 層 | 196 | 107 | 46 | 101 |
| 明眼 | 第 4 層 | 92 | 86 | 122 | 150 |
| 明眼 | 第 3 層 | 43 | 87 | 170 | 150 |
| 明眼 | 第 2 層 | 92 | 179 | 116 | 63 |
| 明眼 | 第 1 層 | 223 | 98 | 42 | 87 |

Table 4 下半（Nemenyi 兩兩比較，L922–928，原文寫法照抄「p <」）：

| 比較 | 1×2 | 1×3 | 1×4 | 2×3 | 2×4 | 3×4 |
|---|---|---|---|---|---|---|
| 盲人 | p < 0.001 | p < 0.001 | p < 0.321（不顯著） | p < 0.148（不顯著） | p < 0.001 | p < 0.001 |
| 明眼 | p < 0.001 | p < 0.001 | p < 0.001 | p < 0.001 | p < 0.001 | p < 0.059（不顯著） |

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號／頁 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 四層的有用程度不相同 | 兩組 Friedman 檢定都 p < 0.001 | 組內四層互比 | §5.3 | L963–966、p.8 | 「For both reader groups, using Friedman's Test … the p-value is p < 0.001」 |
| 2 | 盲人讀者：第 2、3 層最有用，第 1、4 層最不有用 | 第 3 層排第 4 名 173 次、第 2 層 131 次；第 4 層排第 1 名（最不有用）177 次、第 1 層 196 次；第 2 vs 第 3 層不顯著（p < 0.148）；第 1 vs 第 4 層不顯著（p < 0.321） | 盲人組內 | §5.3、Table 4 | L972–975、p.8 | 「blind readers rank content and Levels 2 and 3 as most useful (Region 4.C), and semantic content at Levels 1 and 4 as least useful (Regions 4.A and 4.B).」 |
| 3 | 明眼讀者：第 3、4 層最有用，第 1、2 層最不有用 | 第 4 層與第 3 層各排第 4 名 150 次；第 1 層排第 1 名 223 次；第 3 vs 第 4 層不顯著（p < 0.059） | 明眼組內 | §5.3、Table 4 | L969–971、p.8 | 「There appears to be strong agreement among sighted readers that higher levels of semantic content are more useful」 |
| 4 | 兩組最大的分歧在第 4 層 | 盲人把第 4 層排最有用只有 45 次（排最不有用 177 次）；明眼排最有用 150 次 | 盲人 vs 明眼（**沒有做組間統計檢定**，見下） | Table 4 | p.8 | 「while both groups generally prefer mid-level semantic content, they sharply diverge in their rankings of both the lowest and highest levels of our model.」（L91–93） |
| 5 | 第 1 層呈雙峰 | 多數排最不有用，但盲人 101 次、明眼 87 次排成最有用；是唯一雙峰的層 | 兩組 | §5.3 | L978–984 | 「this level is ranked "most useful" in 101 and 87 instances by blind and sighted readers, respectively.」 |
| 6 | 依圖型、主題、難度分開看：**無差異** | 沒有數字 | 15 張圖的三個維度 | §5.3 | L976–978 | 「When faceting these rankings by visualization type, topic, or difficulty we did not observe any significant differences」 |

### 問卷與開放回饋（§5.4，p.8–9）

| # | 結果 | 數字 | 節 | 行號／頁 | 原文一句 |
|---|---|---|---|---|---|
| 7 | 盲人讀者都遇過讀不到的視覺化 | 一週多次 43%（13）、每天 20%（6）、每月一兩次 20%（6）、至多每週一次 17%（5）；在教材中遇到 53%（16）、社群媒體 30%（9）、新聞網站 13%（4）；三種場合都遇過 53%（16） | §5.4.1 | L902–907 | 「All blind readers reported encountering inaccessible visualizations」 |
| 8 | 盲人讀者認為文字描述重要 | 「重要公共資訊因只有視覺格式而讀不到」μ = 6.1（σ 1.49）；「提供文字描述對我重要」μ = 6.83（σ 0.38），7 點量表 | §5.4.1 | L907–910 | 「"Providing textual descriptions of data visualizations is important to me" (µ = 6.83, σ = 0.38).」 |
| 9 | 兩組自評的圖表／統計理解相近 | 盲人：視覺化概念 6.3（1.03）、統計概念 5.90（1.01）；明眼：6.7（0.73）、5.67（1.06） | §5.4 | L937–942 | 「Sighted participants reported similar levels of understanding」 |
| 10 | 明眼讀者也支持文字描述 | μ = 5.60（σ 1.27）；對「視覺資訊讀不到」不置可否 μ = 4（σ 1.57）；52%（47）說有時讀圖有障礙、48%（43）說通常沒有 | §5.4.1 | L944–953 | 「sighted readers expressed support for natural language descriptions of visualizations (µ = 5.60, σ = 1.27).」 |
| 11 | 盲人多數不要作者的主觀詮釋（第 4 層） | 63%（19）明確表示描述不該含主觀詮釋、脈絡或評論；明眼 41%（37）反而說最有用的描述「講了一個故事」；明眼只有 4%（4）明說該排除第 4 層 | §5.4.2 | L986–1002 | 「A majority of blind readers (63%, n=19) were emphatic that descriptions should not contain an author's subjective interpretations, contextual information, or editorializing about the visualized data」 |
| 12 | 部分盲人讀者偏好第 3 層勝過第 2 層 | 個別引述（BR26、BR21），無比例 | §5.4.3 | L1003–1030 | 「more useful if it contains the summary of the overall trends and distributions of the data rather than just mentioning some of the extreme values or means.」（BR26） |
| 13 | 組合多層最有用 | 約 12% 的讀者（兩組）說描述要越短越好；盲人中 40%（12）說最有用的描述會組合多層；作者用這點解釋第 1 層的雙峰 | §5.4.4 | L1055–1067 | 「among blind readers, 40% (n=12) noted that the most useful descriptions would combine content from multiple levels.」 |
| 14 | 只講編碼的描述被批評 | BR9：只講 x/y 與配色的描述「almost useless」；BR26：只講編碼徒增閱讀負擔 | §5.4.4、§5.4.5 | L1060–1061、L1094–1098 | 「All of the descriptions provided in this survey which *only* elaborated on x/y and color-coding are almost useless.」 |
| 15 | 對自動產生說明的疑慮 | 個別引述（自動圖片描述「more of a timewaster than useful」） | §5.4.5 | L1078–1107 | 「Facebook and Apple auto-descriptions of general images are more of a timewaster than useful.」 |

### 作者的實務結論（§6.1，L1032–1053）

- 主要給明眼讀者的描述可以多寫高層內容；給盲人讀者的應讓讀者能自選、組合不同層級；一種做法是自動用 ARIA 標出第 1、2 層，第 3 層由人寫（L1043–1049）。摘要的版本是：自動產生圖表說明的研究應朝「more richly communicate overall trends and statistics」（L26）。
- 語料與標註已公開：http://vis.csail.mit.edu/pubs/vis-text-model/data/ （L1053；沒去看）。

## 作者自己列的限制

- 模型只處理英文句子與常見圖型，延伸到其他語言與客製圖表「may be warranted」（§6.2，p.9，L1099–1101）。
- 原文**沒有**獨立的限制節。作者沒有列、我讀到的：盲人讀者經作者人脈與 Twitter 招募、明眼讀者經 Prolific，兩組招募管道、作答量（5 張 vs 15 張）、時薪都不同（作者在 §5.2 說這在無障礙研究常見，並解釋了作答量差異的理由）；被排序的描述是作者拼出來的單層範例，每層只有一段，層級效果與「那一段寫得好不好」分不開；「有用」不給定義；排的是主觀有用程度，**沒有量讀者讀完描述後懂了多少**；注意力檢核剔除人數沒報。

## 與摘要說法不一致的地方

- 摘要說兩組讀者「differ significantly on which semantic content they rank as most useful」（L24），§5.3 開頭也寫「These results exhibit significant differences between reader groups」（L963）。但正文報的統計只有**各組組內**的 Friedman 與 Nemenyi 檢定，**沒有任何組間檢定**（沒有比較兩組在同一層的排名分布）。「兩組差異顯著」是從兩張熱圖形狀不同推論的，不是檢定結果。
- 導論寫語料由「over 120 participants」寫成（L69–70），§3.2.2 寫招了 120 人（L495）；另有 §3.1 的 100 多位學生寫了 330 段（不在 2,147 句裡）。小出入。
- 摘要說描述應「more richly communicate overall trends and statistics」（第 2、3 層），與盲人組結果一致；但明眼組其實偏好第 3、4 層，摘要的建議是對盲人讀者成立的。
- 其餘逐項對過，沒有。

## 與清單「要撐的結論」不合的地方

清單（23#6）暫定：「圖表描述的四層語意；盲人讀者把第 2、3 層排最有用」。

- **撐得住**，但要補三點才不會誤導：(1) 第 2 與第 3 層之間盲人組沒有顯著差異（p < 0.148），不能說誰比較好；(2) 第 1 層是雙峰——盲人有 101 次把它排最有用，40% 的盲人說最好的描述是多層組合，所以結論不是「不要寫圖型與軸」而是「不要只寫圖型與軸」；(3) 量的是「覺得有用」的主觀排序，不是理解或記憶的成績。
- 「盲人 vs 明眼的差異」若要寫，只能寫成「兩組的排名分布看起來不同（明眼偏好第 3、4 層，盲人把第 4 層排很低）」，不能寫「顯著不同」——原文沒做組間檢定。
- 每層只有一段作者拼出的範例描述，層級與寫作品質混在一起；15 張圖、每組 30 人。

## 讀取紀錄

- 第 1 頁（標題、摘要、導論前半）：`.seq.txt` L1–102 依序讀。
- 第 2–9 頁：直接讀 PDF 頁面影像，依版面順序讀完——p.2（導論後半、§2.1–2.3.1）、p.3（§2.3.1–2.3.2、§3、§3.1、§3.2、§3.2.1、Table 1）、p.4（Fig. 2、§3.2.1 續、§3.2.2、§3 小結、§4、§4.1）、p.5（Table 2、§4.2、§4.3、§4.4）、p.6（Table 3）、p.7（§4.4 續、§5、§5.1、§5.2、§5.2.1、§5.2.2）、p.8（Table 4、§5.3、§5.4、§5.4.1、§5.4.2、§5.4.3）、p.9（§5.4.3 續、§5.4.4、§5.4.5、§6、§6.1、§6.2、致謝）。同時對照 `.seq.txt` L103–1121 抄原文與標行號（L1–480、L480–959、L960–1159 三段依序讀過，首尾相接）。
- 第 10–11 頁參考文獻：`.seq.txt` L1123–1383 掃過。
- 對過 PDF 版面的表：Table 1（p.3）、Table 2（p.5）、Table 3（p.6，例句與顏色）、Table 4 上半熱圖與下半 p 值（p.8）。Table 4 熱圖的格子數字只存在圖上，是讀 PDF 影像得到的，八列逐列加總皆為 450 作為檢查。
