# Resnick & Sánchez 2004：組織方式 vs 標籤品質（零售網站）

read_status=read（Gale／Free Online Library 的全文轉載，正文、Table 1–3、參考文獻齊全；Figure 1–5 沒有轉載，只讀到正文對圖的描述；轉載版沒有摘要，摘要從 PubMed 讀）

用途：order 7「按任務 vs 按組織分類」的反證——按任務（goal-centered）分類沒有贏過按商品分類，標籤品質的效果比分類方式大得多。

## 書目與讀取版本

- Resnick, M. L., & Sánchez, J. (2004). Effects of organizational scheme and labeling on task performance in product-centered and user-centered retail Web sites. *Human Factors*, 46(1), 104–117. DOI: 10.1518/hfes.46.1.104.30390。PMID 15151158。作者單位：Florida International University（Sánchez 當時是 Georgia Tech 博士生）。收稿 2002-02-07，接受 2003-09-24。
- **實際讀的版本**：The Free Library（Farlex）轉載的 Gale 全文，「COPYRIGHT 2004 Sage Publications, Inc.」，7,573 字。URL：https://www.thefreelibrary.com/Effects+of+organizational+scheme+and+labeling+on+task+performance+in...-a0128974899 。curl 和 Exa 碰到 Cloudflare 挑戰頁（作者列表頁 Exa 讀得到，但沒有連結），改用 Playwright 開頁通過挑戰後抓 `innerText`，2026-10-22。
  - 存檔：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/resnick2004.txt`（452 行，51,112 bytes；L1–14 和 L402–452 是網站外框）。
  - 沒有原刊頁碼，以下引用一律標行號。
- 摘要：PubMed 15151158（Exa 搜尋結果全文顯示）。

### 讀取紀錄（resnick2004.txt 行號）

- L14–23 Introduction；L25–52 文獻：Organizational Scheme、Organizational Techniques、Labels、Labeling Techniques；L54–66 Objectives and Hypotheses；L68–128 Methods（Participants、Materials：card sort、label rating、site design；Tasks；Experimental Design；Procedure）；L130–180 Results（Time、Errors、SUS、Clicks、Products Found、分層）；L182–210 Discussion、Design Implications；L212–214 Conclusion；L216–343 Table 1–3；L347–401 References 與作者資料。依序讀完。

## 設計

- **2 × 3 完全因子、組間設計**（L106）：組織方式（product based vs task based）× 標籤品質（high / medium / low），共 6 個版本，60 人，每格約 10 人（ANOVA 誤差 df = 54）。
- **網站**（L76–98）：虛構的健康食品網路商店，每版 17 頁；導覽是上方水平選單加左側垂直類別選單；不用捲動。
  - 兩種組織方式都是從現有健康食品網站 benchmarking 找出來的：「One was goal centered, in which similar products are grouped together according to typical user tasks. The other was product centered, in which products are grouped according to the product categories that fit company purchasing and inventory models.」（L76）
  - 6 類 × 6 品 = 36 個商品，**刻意挑能同時對應兩種分法的商品**（Table 1：任務類 Weight Loss / Weight Gain / General Health / Illness / Energy / Stress；商品類 Pills / Bars / Shakes / Books / Creams / Produce）。
- **前置研究**：
  - 開放式卡片分類（L80–84）：10 人，36 張卡。360 組配對中 **75%** 依目標（任務）分組；書籍一律依商品分，非書籍商品 90% 依目標分；10 人中 9 人把非書籍商品全部依目標分。→ 使用者在卡片分類裡**偏好任務式**。
  - 標籤評分（L86–92）：另找 20 人（每種分法 10 人），每類最多 11 個候選標籤，用 5 點量表評「多適合當類別名稱」，Friedman 檢定分出三個品質等級，「All groups were statistically different at the p <.025 level」。
  - 標籤範例（Table 2–3，L317–343）：任務式 best / medium / lowest＝「Weight gain / High calories / Sports nutrition」、「Stress relief / Nerve products / Homeopathy」、「Energy supplements / Activity boosters / Uppers」；商品式＝「Bars / Nutrition sticks / Crunch sticks」、「Pills / Capsules / Tabs」、「Shakes and blends / Smoothies / Twists」。
- **受試者**（L72）：主實驗 60 人，18–40 歲，邁阿密社區招募；47% 網路熟悉度高、53% 低到中等。
- **任務**（L102）：一個購物情境，找 6 項商品，至少要進 3 個大類；不告訴商品名稱，只描述需求（例：「a low-calorie snack that you can keep in your briefcase in case you feel hungry at work」）。兩種分法的最佳路徑都是 19 次點擊（L112）。
- **量了什麼**（L108–120）：完成時間、點擊數、錯誤數（進入沒有目標商品的頁面，或離開有目標商品的頁面卻沒有加入購物車）、正確找到的商品數、SUS 滿意度（0–100）。

## 假設（L58–66）

- H1A：任務式在所有指標上**略優於**商品式。
- H1B：標籤品質越差，任務式的優勢越大。
- H2：標籤品質越高，所有指標越好。

## 可引用結果

| 指標 | 組織方式主效果 | 標籤品質主效果 | 交互作用 |
|---|---|---|---|
| 時間（L134–136） | 不顯著，F(1,54) = 1.213, p = .276；任務式 256.4 s、商品式 233.8 s | 顯著，F(2,54) = 17.922, p = .001；高 166 s、中 254 s、低 315 s | 不顯著，F(2,54) = 0.523, p = .596 |
| 錯誤（L142–148） | 商品式較少，F(1,54) = 11.041, p = .002；任務式 6.4、商品式 4.0 | 顯著，F(2,54) = 20.701, p = .001；高 2.2、中 5.7、低 7.8 | 顯著，F(2,54) = 3.169, p = .05；**只有低品質標籤時任務式顯著較差**（p = .001），高、中品質時 p = .331、.421 |
| SUS（L152–158） | 商品式較高，F(1,54) = 9.910, p = .005；任務式 71.2、商品式 84.1 | 顯著，F(2,54) = 4.529, p = .015；高 85.3、中 77.8、低 70.1 | 顯著；高品質標籤時不顯著（p = .296），中、低品質時顯著（p = .02、.05） |
| 點擊（L162–168） | 商品式較少，F(1,54) = 16.201, p = .001；任務式 24.1、商品式 21.6 | 顯著，F(2,54) = 24.074, p = .001；高 20.4、中 22.7、低 25.5 | 只有低品質標籤時任務式顯著較多（p = .001）；高、中品質時 p = .163、.096 |
| 找到商品數（L172–176） | 不顯著，F(1,54) = 0.153, p = .697；任務式 4.7、商品式 4.6 | 顯著，F(2,54) = 7.095, p = .002；高 5.2、中 **4.0**、低 4.9 | 未報告 |

- 分層（L180）：性別和網路經驗幾乎沒有影響；唯一例外是在任務式網站裡，網路熟悉度高的人找到的商品顯著較多，商品式網站沒有這個差異。
- 作者原句：
  - 組織方式（L186）：「Organizational scheme did not have the widespread effect on user performance that was expected. ... Its effect on the number of errors, number of clicks, and user satisfaction was limited to the sites with poor labels, and in these cases the result was the opposite of that suggested by the design guideline.」
  - 結論（L204）：「the success of a Web site is more dependent on the quality of the labels than on the organizational scheme.」
  - 設計建議（L208–210）：「Resources should first be allocated toward creating user-centered labels for products and categories.」「The advantages of using a task-centered design may be offset by the users' experience with product-centered designs. Designers must consider the experience of their expected users with other sites before committing to an architecture for a new site.」
  - 作者對組織方式結果的解釋（L192）：「Perhaps people, when shopping, are used to stores being organized in a product-centric style and are able to accommodate that style as well as their natural task-based preference. When labels are poorly worded, the users' experience in typical shopping situations may drive their expectations. Another possible explanation is that the lower-quality Labels used in the task-based organization were simply less intuitive than the lower-quality labels used in the product-based organization.」
- 關鍵張力：卡片分類裡 75% 的配對、10 人中 9 人偏好任務式，**實際操作時任務式卻沒有比較好**，標籤差的時候甚至比較差——「使用者說的分法」不等於「使用者用起來最快的分法」。

## 作者自述的限制

- 網站很小、結構簡單（L186、L210、L214）：「the simplicity of the sites used in this study may have diminished the benefits of the task-centered design.」「the sites were relatively small as compared with those of the most popular on-line retailers. Additional effects may be found by using larger and more complex sites.」
- 只測兩個參數、只在零售情境（L214），資訊出版、社群等類型的網站需要另外研究。
- 為了公平，兩種分法刻意設計成同樣的最佳點擊數與頁數，可能消掉了組織方式的差異（L186）。
- 引 Nielsen（2000）：大家熟悉的設計就算不理想，表現也可能跟理想的新設計一樣好，甚至更好（L186）。

## 與摘要或常見轉述不一致處

1. **摘要的措辭會讓人讀反**。摘要：「User-centered organization did not result in improved performance except when the label quality was poor.」字面上像是「標籤差的時候，以使用者為中心的組織方式比較好」。但正文（L144、L164、L186、L192）的結果剛好相反：標籤差的時候，**商品式（非使用者中心）比較好**，任務式的錯誤、點擊比較多，滿意度比較低。作者在討論段自己也寫「the result was the opposite of that suggested by the design guideline」。引用時要以正文為準，不能照抄摘要。
2. **「90% improvement」是相對時間比**：L136 說高、低品質標籤的時間差「corresponds to an improvement of 90%」，實際是 315 / 166 ≈ 1.90，也就是低品質標籤**多花 90% 時間**；換成高品質標籤的角度是**快 47%**。Human Factors International 的電子報轉述成「Participants were 90% more efficient」，同樣是比值的說法。
3. **「25% more errors」其實是點擊數**：L166 在點擊段寫「Thus the low-quality labels caused 25% more errors than did the high-quality labels」，但數字是點擊數 25.5 / 20.4 ≈ 1.25。錯誤數的比是 7.8 / 2.2 ≈ 3.5 倍。HFI 電子報改寫成「25% fewer clicks」，數字對了，但方向和基準換過。
4. **滿意度交互作用，結果段和討論段說法不一致**：結果段（L154）說中、低品質標籤時兩種分法的 SUS 都有顯著差異（p = .02、.05）；討論段（L190）卻寫「Only on sites with the low-quality labels was there a significant effect of organizational scheme」。
5. **找到商品數不是單調關係**：中品質 4.0 < 低品質 4.9 < 高品質 5.2，而且低和高之間沒有顯著差異（p = .805）。所以「標籤越好、找到越多」只在高 vs 中成立。作者沒有解釋這點。
6. **「user-centered」標籤不全是使用者產生的**：候選標籤混了卡片分類受試者取的名字和 benchmarking 從現有網站收集的名字（L86），再由另一批人評分分級。討論段（L202）說「the labels of higher quality were gathered from potential users and the labels of lower quality were gathered through benchmarking」——方法段並沒有說明分級跟來源一一對應。另外，低品質標籤有些看起來是刻意挑差的（「Uppers」「Homeopathy」「Textual items」「Twists」），所以標籤效果的大小有一部分來自操弄的極端程度，不完全代表「使用者中心 vs 公司中心」的落差。
7. **這裡的「task-based」不是工作任務**：任務式指的是購物目標（減重、增重、抒壓……），組織方式則是商品類別；跟 Cozijn 2007 的「組織圖 vs 工作任務」不是同一種對比，合併引用時要講清楚。
8. **同樣設計的老年人研究結果不同**：HFES 2002 年會論文集（作者在搜尋結果中沒有顯示，還沒確認是不是同一團隊）裡的〈The Impact of Organizational Structure and Labels on Web Usability for Older Adults〉（DOI 10.1177/154193120204600207；只讀到摘要）用同樣的 2 × 3 設計，60 名 60 歲以上受試者，摘要寫「higher quality labels and goal-centered organization resulted in higher levels of performance and satisfaction」。也就是說，對年長使用者，goal-centered 分法反而比較好。只讀了摘要，不能引數字，但它說明「商品式較好」這個結果可能跟受試者族群（18–40 歲、熟悉網購）有關。
9. 摘要說受試者「with a wide range of Internet and on-line shopping experience」，但正文說教學時「all participants were familiar with E-commerce Web sites」（L126），而且年齡限定 18–40 歲——經驗範圍沒有摘要講的那麼廣。

## 對 order 7 的用法

- 反證要點：在小型零售網站上，**按目標／任務分類沒有贏過按商品類別分類**；標籤差的時候，任務式在錯誤、點擊、滿意度上都比較差。**標籤品質的效果比分類方式大且穩定**（時間、錯誤、點擊、滿意度都顯著）。
- 寫成：「先把標籤寫成使用者看得懂的詞，再煩惱要按任務還是按類別分」——這是作者自己的設計建議（L208），有正文數據支持。
- 不要寫成：「研究證明任務式分類比較差」——任務式只在低品質標籤時比較差，高、中品質時沒有差異；而且網站只有 17 頁，作者自己說可能低估任務式的好處。
