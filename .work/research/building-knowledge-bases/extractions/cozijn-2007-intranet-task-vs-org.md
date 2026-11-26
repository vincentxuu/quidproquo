# Cozijn, Maes, Schackman & Ummelen 2007：企業內網按任務 vs 按組織結構

read_status=read（2007 英文正式版全文文字層；Figure 1–3 是圖片，只讀到圖說；Table 2 的數值在文字層裡掉了，改用 2003 荷文前身論文的同一張表補上）

用途：order 7「按任務 vs 按組織分類」的反證——這是少數直接比較兩種結構的對照實驗，主結果對任務式結構**不利**。

## 書目與讀取版本

- Cozijn, R., Maes, A., Schackman, D., & Ummelen, N. (2007). Structuring job related information on the intranet: An experimental comparison of task vs. an organization-based approach. *Journal of Technical Writing and Communication*, 37(2), 203–216. DOI: 10.2190/382G-91T8-T06R-2L52（Baywood 出版，現在由 SAGE 代管）。ERIC EJ905022。
- **實際讀的版本**：Alfons Maes 上傳到 ResearchGate 的出版版 PDF（頁首「J. TECHNICAL WRITING AND COMMUNICATION, Vol. 37(2) 203-216, 2007」，頁碼 203–216 齊全），用 `mcp__exa__web_fetch_exa` 取得文字層，2026-10-22。
  - URL：https://www.researchgate.net/profile/Alfons-Maes/publication/250145798_Structuring_Job_Related_Information_on_the_Intranet_An_Experimental_Comparison_of_Task_vs_an_Organization-Based_Approach/links/54268c380cf26120b7b027f3/Structuring-Job-Related-Information-on-the-Intranet-An-Experimental-Comparison-of-Task-vs-an-Organization-Based-Approach.pdf
  - 存檔：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/cozijn2007.txt`（195 行，31,263 bytes）。Table 1 依文字層的抽取順序重排成兩欄（前 7 個值是組織式、後 7 個是任務式；跟荷文版 Tabel 2 逐格相符），Smith 公式的根號和「1」在抽取時掉了，檔頭有註記。
- **對照版本（同一個實驗的前身）**：Schackman, D., Ummelen, N., Cozijn, R., & Maes, F. (2003). Het effect van informatiestructuur op taakefficiëntie en -effectiviteit bij intranetgebruikers. VIOT（荷語區語言溝通學會）2003 年會論文集，pp. 404–415（出處依 viot.nl 檔名；論文集正式書名沒有查證）。PDF：https://viot.nl/wp-content/uploads/2018/11/35-D.-Schackman-N.-Ummelen-R.-Cozijn-F.-Maes-2003-Het-effect-van-informatiestructuur-op-taakefficie%CC%88ntie-en-effectiviteit-bij-intranetgebruikers-pp.404-415.pdf ，curl 下載後跑 `pdftotext -layout`，存成 `.../scratchpad/fulltext/schackman2003_nl.txt`（652 行，36,010 bytes）。用來核對數字，補 Table 2 的滿意度數值。

### 讀取紀錄（2007 cozijn2007.txt 行號）

- L1–3 來源註記；L5–17 書目與摘要；L19–29 Introduction；L31–49 結構定義（組織式與任務式的實際做法）；L51–63 Method：Materials、Experimental Task；L71–73 Participants；L75–98 依變項（effectiveness、exploration/search/task time、Smith E、滿意度）；L100–107 Procedure；L109–127 Results；L129–148 Table 1、Table 2；L150–176 Conclusions and Discussion（含學習效果、In Sum）；L178–195 References。依序讀完。
- 荷文版 schackman2003_nl.txt：L1–25 摘要；L120–190 文獻與假設（從 Exa 搜尋摘錄與檔案讀過）；L190–420 方法、結果、Tabel 2/3；L500–562 Figuur 3/4（只有座標刻度）；L563–600 討論；L600–652 文獻。

## 設計

- **場域**：Sara Lee Household and Body Care Holland（Douwe Egberts 子公司）行銷部門。公司當時**還沒有內網**、正打算建置（L41、L101–102）。
- **兩種結構**（L45、L49）：
  - 組織式：依公司組織圖分類——兩大事業部（body care、health care），各有 marketing、sales、financial，底下再按產品分。
  - 任務式：四個任務類別——「how to market products, how to sell them, how to control finances, and how to control business」，每類底下是邏輯子任務。
  - 兩版內容相同，四層階層；版面刻意簡化：白底黑字、左側結構框（L55）。
  - **混淆變項**：「The organization-based hyperlinks had the form of noun phrases, the task-based hyperlinks verb phrases.」（L55）——結構和連結文字的詞性一起變。
- **任務**（L59–63）：替一個虛構的新身體保養產品寫 packaging briefing（給外部包材供應商的 5 頁提案），拆成 **6 個子任務、15 個欄位**（品牌價值、競爭者、銷售數字等事實查找）。照固定順序一題一題做，每題回首頁。指示「not to browse the intranet but to search decisively」（L105）。
- **受試者**（L71–73）：**20 名**行銷部員工，「13 women and 7 men」，都受過高等教育、每天用電腦數小時，都會寫 packaging briefing（但平常寫的是自己負責的品牌）。**隨機分派**到兩組，組間設計。各組人數沒有報告。
- **量了什麼**（L75–98）：
  - Effectiveness：正確數（方法段寫「number of correctly performed subtasks (minimum 0 and maximum 6)」，但結果段報的是錯誤數）。
  - Efficiency：exploration time（首頁到第一次點擊）、search time（子任務內第一次到最後一次點擊）、task performance time（每子任務與全任務）、造訪節點數、Smith（1996）的 E 值（0 = 最有效率）。用 ProxyPlus 記 log。
  - 滿意度：18 題 Likert 五點量表，分效率、效果、品質三部分。
- **分析**（L111）：單因子 ANOVA，結構是組間變項；「The analyses were run over 19 participants and 5 subtasks.」排除 1 名極慢、錯 9/15 的受試者；**排除第 6 個子任務**，因為「the information labels misled the participants in the task-based condition to look for the information in the wrong place」。

## 可引用結果

Table 1（L133–141；與荷文版 Tabel 2 相同）：

| 指標 | 組織式 | 任務式 | 檢定（2007 文中，L117–125） |
|---|---|---|---|
| 平均錯誤數（表上標「per subtask」） | 1.60 | 2.33 | F(1,17) < 1，不顯著 |
| Exploration time／子任務（秒） | 1.06 | 2.13 | F(1,17) = 4.80, MSE = 1.14, p < .05 |
| Search time／子任務（秒） | 11.04 | 24.04 | F(1,17) = 5.43, MSE = 147.37, p < .05 |
| Total time／子任務（秒） | 104.67 | 132.45 | F(1,17) = 5.09, MSE = 718.72, p < .05 |
| Total time／全任務（秒） | 636.70 | 752.11 | 2007 版印「F(1,17) = 89.19」；荷文版是 8,19（見下面不一致處） |
| 步數／子任務 | 5.34 | 5.76 | F(1,17) < 1 |
| Smith E（全任務） | 0.84 | 0.86 | F(1,17) = 3.89, MSE = 7.74, p = .07（趨勢） |

- 換算：任務式的搜尋時間大約是組織式的 2.2 倍；每子任務總時間多 27%；全任務多 18%（約 115 秒）。
- **滿意度**（L127、L146–148）：「Participants in the two conditions did not judge differently about the efficiency or quality of their task performance (F(1, 18) < 1).」效果分量表信度只有 .50，被剔除。數值（荷文版 Tabel 3，L407–413）：整體 任務式 4.04／組織式 3.99；效率 4.04／4.02；品質 4.04／3.97。
- **學習效果**（post hoc 線性趨勢，L156）：
  - Exploration time：兩組都沒有顯著趨勢（任務式 F(1,3) = 3.89, p = .14；組織式 F(1,3) = 4.80, p = .11）。
  - Search time：任務式隨子任務遞減，F(1,3) = 12.96, p < .05；組織式 F(1,3) < 1。
  - 步數：任務式遞減，F(1,3) = 34.94, p < .01；組織式 F(1,3) < 1。
  - 作者的話：「In sum, there was a clear learning effect in the task condition, which indicated the soundness of the task-based structure once participants get acquainted with it.」
- **作者結論原句**（In Sum，L170–176）：
  - 「In terms of organizational practice, the results of the experiment seem to favor an organization-based structure. The familiarity with the organization-based structure clearly dominated this experiment resulting in a more efficient task performance.」
  - 「However, task model users appeared to catch up quickly. Besides, they executed their tasks equally correct and were equally satisfied. The suggestion is that once users are acquainted with a task structure, it is at least as efficient as an organizational structure.」
  - 「Organizations that opt for task-based information structures have to take into account extra time and energy during the learning phase.」
  - 標籤：「whereas the labeling of hyperlinks in an organization-based structure seems straightforward, the labeling in a task-based structure seems to require special attention.」任務組在第 6 題誤點「Control finances」找預算資料，答案其實在「Market products」底下。
  - 「Once a task-oriented intranet has been set up, it may be as efficient as an organization-oriented intranet. However, it is unclear form our experiment whether this investment pays off.」
- 作者解釋組織式較快的原因（L152）：「Apparently, as employees of the company, they benefitted from their knowledge of the organizational chart on which the information structure was based.」研究設計時也刻意確認受試者熟悉組織圖（L47）。

## 作者自述的限制

- 結論只在這個實驗環境的變項組合內成立（L35）：「conclusions about the effect of hypertext structures or navigation tools are only valid within the application range defined by the interaction of the variables as they are implemented in a particular (experimental) environment.」
- 實際內網的資訊量遠大於實驗環境；任務式可能比較能組織大量資訊；任務式可能比較適合跨部門協作（L176）——**這些都是推測，實驗沒測**。荷文版另外點名：實驗只測個人任務，沒測協作。
- 學習期的投資值不值得，實驗回答不了（L176）。
- 任務式的連結標籤需要特別設計（第 6 題就是因為標籤誤導被剔除）。

## 與摘要或常見轉述不一致處

1. **摘要說任務式「at least as efficient」，正文沒有直接證據**。學習效果只是任務組內部的線性趨勢檢定，df 是 (1,3)，等於拿 5 個子任務的平均值做迴歸，不是用受試者當單位；**沒有做結構 × 子任務的交互作用檢定，也沒有比較最後幾題兩組是否已經沒有差異**。「追上」「至少一樣有效率」是作者推論；作者自己在同一段也說「it is unclear form our experiment whether this investment pays off」。
2. **全任務時間的 F 值兩版不同**：2007 英文版印「F(1, 17) = 89.19; MSE = 7702.41; p < 0.05」，2003 荷文版是「F (1,17) = 8,19; MSE = 7702,41; p < 0,05」。用表上平均數與 MSE 粗算，各組約 9–10 人時 F 約 8，**89.19 應該是排版錯誤**。引用時用 8.19 或只寫 p < .05。
3. **性別比兩版矛盾**：2007 寫「13 women and 7 men」；荷文版寫男女比「6:14」。
4. **錯誤數的單位對不上**：表格和文字標「per subtask」（1.60 vs 2.33），但同一段又說其餘 19 人「an average of 1.97 errors」（總共 15 個欄位）。1.60 和 2.33 的平均落在 1.97 附近，所以這兩個數字其實是**整份任務的錯誤數**，不是每個子任務。荷文版表格寫的是「Gemiddeld aantal fouten in taak」（整份任務），文字卻又寫「per subtaak」。另外方法段說 effectiveness 是「correctly performed subtasks (0–6)」，結果段報的卻是錯誤數。
5. **時間加總對不上**：每子任務總時間 × 5 = 523（組織式）／662（任務式）秒，但「全任務」報 637／752 秒。差額大約 115 秒，可能把被剔除的第 6 題或填表時間算進去了，正文沒說明。
6. **剔除第 6 題對任務式有利**：被剔除的那題正好是任務式標籤誤導受試者的那題，所以報告的差距**可能低估**任務式在實務上的劣勢。也可以反過來說那是標籤的問題、不是結構本身的問題——但作者沒有分開檢定。
7. **滿意度檢定的 df 是 (1,18)**，代表用了 20 人，其他分析都是 19 人；文中沒說明。滿意度量表方向也不清楚：方法段說「completely agree (1) to completely disagree (5)」，正反題交錯，表格卻寫「min. = 1, max. = 5」，沒有說明有沒有反向計分。
8. **orientation／exploration time 的名稱混用**（L91、L95、L156）；學習效果檢定那兩個 F 值（3.89、4.80）剛好等於主效果裡 Smith E 和 exploration time 的 F 值。p 值（.14、.11）跟 F(1,3) 對得上，所以不一定是抄錯，只記錄這個巧合。
9. **常見轉述的落差**：NN/g（Nielsen 2007，〈Intranet Information Architecture (IA) Methods〉）寫「task-based navigation tends to facilitate ease-of-learning」，並主張任務式結構比較耐得住組織改組。本研究的**主結果是組織式比較快**，學習效果只是 post hoc。把這篇轉述成「實驗證明任務式比較好」是錯的；比較準確的說法是：「熟悉組織圖的員工用組織式比較快；任務式在 5 題內有變快的趨勢，正確率和滿意度沒有差異。」
10. **混淆變項沒有被當成限制討論**：組織式連結用名詞片語、任務式用動詞片語（L55），所以結構和標籤措辭是一起變的。
11. 每組人數沒有報告（19 人分兩組，最多 10/9）；樣本很小，「沒有差異」的結果（正確率、滿意度）檢定力很低，不能當作「兩者等效」的證據。

## 對 order 7 的用法

- 反證要點：在**員工熟悉組織圖、內容量小、單人查事實**的條件下，按組織分類比按任務分類快（搜尋時間約一半），正確率和滿意度沒有差異。
- 限定條件一定要寫出來：N = 19–20、單一公司、四層小型原型、5 個子任務；任務式的「追上」只是組內趨勢，不是組間等效。
- 跟 Resnick & Sánchez 2004 一起用：兩篇都發現「使用者熟悉的分法（組織圖／商品類別）」打得過「理論上比較貼近任務的分法」，而且兩篇都碰到任務式的**標籤**比較難寫好的問題。
