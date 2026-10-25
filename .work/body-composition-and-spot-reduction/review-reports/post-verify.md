# post-verify：body-composition-and-spot-reduction（認識人體 order 20）

查證日期 2026-10-25。工具：Groundlane web_fetch（text）。

## 來源取得程度
| 來源 | 取得 | 備註 |
|---|---|---|
| Paoli 2021 PMC8038840 | Europe PMC fullTextXML 全文，108,979 字元，未截斷 | 獨立重取，非手貼檔 |
| Brobakken 2023 PMC10680576 | 全文，107,613 字元，未截斷 | 同上 |
| Ramírez-Campillo 2022 Hum Mov | 期刊頁 hummov.awf.wroc.pl：完整摘要＋參考文獻清單，158,590 字元 | 重取成功，但仍只有摘要，全文未取得 |

## Contradicted
無。

## Misframed
1. zh 第 63 行「前兩項是研究自己寫的，後面是我的歸納」與下列四項內容矛盾。第 1 項（量法）與第 4 項（機制未明）是作者寫的，第 2 項（比較對象）與第 3 項（人數少）是文章自己的歸納。英文版第 63 行寫 “first and last are stated by the authors”，是對的。建議 zh 改成「第一項和最後一項是研究自己寫的，中間兩項是我的歸納」。這是中英不一致。
2. zh 第 33 行「兩個小型隨機試驗…彼此也不一致」，en 第 33 行 “do not agree with each other”。兩個試驗都在腹部／軀幹看到減少（Paoli 腹部超音波與髂上皮褶；Brobakken 軀幹 DEXA），不一致的是它們與統合分析之間，不是試驗之間。Paoli 只有三頭肌沒變，而 Brobakken 沒量三頭肌。建議改成「與統合分析的結果不同」。
3. zh/en tldr 與 description 寫兩個試驗「在腹部或軀幹看到較多的減少」。
   - Brobakken：組間比較，軀幹多減 697 g（p<0.05），成立。
   - Paoli：只有組內前後變化（SR 組減少、RT 組沒變）。方法段寫了 time×training 兩因子 ANOVA，結果只報時間主效應與組內事後檢定，沒有交互作用 p 值。正文第 55 行（「沒有看到報告兩組差異的檢定」）寫對了，tldr 的「較多」則走樣。
   - 補充：Paoli 作者在討論段自己寫 Siri 體脂「SR 組相較 RT 組顯著下降」，但結果段沒有對應的組間檢定。
   - 建議 tldr 改成「一個在過重男性的軀幹看到組間差異，另一個只報告了組內變化」。
4. zh 第 80 行／en 第 80 行（行動 1）：「整個試驗只有 14 人隨機分成兩組」。摘要確實寫 “Fourteen volunteers were randomly assigned”，但全文方法段是 18 人入組（9 女 9 男），2＋2 人因出席不足被排除，分析 7＋7 人。「14 人」是分析人數。正文第 53 行「14 位…隨機分成兩組」同理。建議改成「納入分析的只有 14 人（7＋7）」，並補一句：摘要寫 14 人，全文有 4 人因出席不足被排除。tldr、en tldr 的「14 人」同理。
5. zh 第 59 行／en 第 59 行「沒有控制飲食」。作者原文是「受試者被要求不要改變飲食或運動，但沒有納入飲食控制的測量」（"instructed to abstain from additional exercise training or dietary changes"；"including a measure of dietary control would have strengthened the study design"）。建議改成「只要求受試者不改變飲食，沒有量測攝取」，避免讀成完全沒管。
6. zh 第 43／45 行、en 第 43／45 行（統合分析範圍）：納入設計是 unilateral limb training，摘要只舉 "single-leg training" 為例。文中「只練一條腿或一隻手臂」的「手臂」摘要沒有，我讀不到全文，無法確認。另一個較大的問題是，這份統合分析的設計（同一人的兩側肢體）本身測不到腹部／軀幹。文章只在「比較的對象不一樣」帶過。第 33 行與 en 第 41 行標題把它稱為「最完整的一篇」，容易讓讀者以為它已涵蓋兩個試驗測的腹部問題。建議在第 45 行後補一句「這個設計比的是四肢，沒有檢驗腹部」，並把「手臂」改成「肢體」，或標明這是推測。

## 次要／可選
- Paoli 摘要與方法寫 8 週，討論段寫 "after 12 weeks"。文章採 8 週是對的，但文章沒告知內部不一致。紀錄檔已知。可在文中加一句，或維持不寫，留在研究筆記。
- Paoli 上腹超音波 −18.89% 的 p = 0.05（表格），摘要卻寫 p < 0.05。文章沒引數字，無需改。
- Paoli 脊豎肌位置（背部，未直接訓練）也減少了約 19%，前大腿則反而增加。文章只寫了腹部與三頭肌。這是會影響「局部」解讀的結果，有空間時值得補一句，不補也不算錯。
- Brobakken 兩組各 n = 8、使用非參數檢定、AG 組基線體重與脂肪較高（103 vs 93 kg；作者自己也提）。文章沒寫，不算錯，但對讀者判斷把握度有用。
- Brobakken 的 NCT05794854 是否事後登記，我沒有查，文中也沒提。

## Confirmed（重新取得原文逐項核對）
- Ramírez-Campillo（摘要）：1833 筆紀錄、13 項研究、1158 位男女、14–71 歲、37 組比較（17 組偏向練的一側、20 組偏向沒練的一側）、pooled ES −0.03、95% CI −0.10 到 0.05、p = 0.508、結論 “no effect…no spot reduction”。數字與文章一致。
- 「作者自評高方法學品質、低異質性」：摘要確實寫 "high methodological quality"、I² = 24.3%，並用 PEDro 量表。文章標為作者自評、未核對，框架正確。摘要結尾那句 influencers／wishful thinking 文章未引用，符合筆記的決定。
- 「我只讀到摘要」：文章沒有把摘要當全文用，沒有寫任何作者限制。參考資料標「只讀摘要」。符合。
- 英文引文三處與原文逐字一致：“Fourteen volunteers”（Paoli 摘要）、“it is unclear if the findings translate to women”（Brobakken 討論段）、“pooled ES”／“37 comparisons”（Hum Mov 摘要）。這次是對重取的原文比對，不是對手貼檔。
- Paoli：8 週、兩組動作相近順序不同、三種量法、腹部皮下脂肪減少而三頭肌未變且作者稱 “unexpected”、BIA 總脂肪無顯著變化、SD 最高為觀察差異的 5–6 倍、人數少為限制、引言對皮褶的說法、引言 “reduction of total body fat can be achieved through diet and/or exercise”，皆成立。
- Brobakken：16 位過重男性（43 ± 9 歲）、10 週、跑步加腹部運動 vs 只跑步 45 分鐘、依先導測量配對總能量消耗、總脂肪與體重兩組同樣下降、軀幹組間差 697 g（p<0.05）、作者結論 “advocate that spot reduction exists in overweight adult males”、DEXA 分不出脂肪層、女性不明、84 分鐘 "almost double"、機制 metabolic vs circulatory 未明、引言卡尺與 DEXA／MRI 吻合差，皆成立。「兩試驗合計 30 人」：14＋16，成立（見 Misframed 4：Paoli 為分析人數）。
- 「在我查的範圍內」：運動 vs 飲食缺口段有限定，不是無條件宣稱。
- 歸屬標籤：每段不超過 3 處，未過量。
- 英文版與中文版主張一致，除 Misframed 1 一處。其他段落一一對得上。

## 身材焦慮／目標檢查
全文沒有體重、體脂目標，沒有飲食或熱量建議，沒有助長身材焦慮的句子。開頭（zh 第 35 行）與結尾（第 85 行）有轉介醫師或營養師的說明。引用的脂肪變化是研究的組間差（約 700 g），沒有鼓勵讀者量化自己。「練腹肌就能減肚子的脂肪」是開場引述的流行說法，語氣中性。無需修改。

## 範圍聲明
只檢查文中已提出的宣告；未檢查文章沒有寫到的主題，也未檢查 Ramírez-Campillo 全文與納入研究細節（未取得）。教學品質與文風不在本報告範圍。
