# Tullis & Wood 2004 — How Many Users Are Enough for a Card-Sorting Study?

read_status=read（UPA 2004 論文 9 頁全文文字層；Figure 1–6 為圖片，只讀到圖說與座標刻度）

## 書目與讀取版本

- Tullis, T. (Fidelity Investments) & Wood, L. (Brigham Young University) (2004). *How Many Users Are Enough for a Card-Sorting Study?* Usability Professionals Association (UPA) 2004 Conference, Minneapolis, MN, June 7–11, 2004. 無 DOI。
- 讀的版本：Tullis 本人 2017-05-29 上傳到 ResearchGate 的 PDF 的頁面文字層（https://www.researchgate.net/publication/254164354_How_Many_Users_Are_Enough_for_a_Card-Sorting_Study），經 `mcp__exa__web_fetch_exa` 取得，2026-10-22。
  - curl 試過：RG PDF 連結 403；citeseerx `doi=10.1.1.514.3907` 404；upassoc.org 舊路徑 404。
  - 論文部分逐字存入 `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/tullis-wood-2004.txt`（182 行，12,980 bytes；Table 1 依文字層重排成欄位，數值未改）。讀完 L1–182。
  - 文字層的空白斷字（如「numb er」）保留；**Figure 1 只有座標刻度（y 0.5–1.0、x 0–70），沒有資料點數值**。

## 設計

- **情境**：Fidelity 內部易用性部門 **intranet 網站改版**（L31–35）。**46 張卡**，多為部門提供的服務（Prototyping、Usability Testing、Focus Groups、Card-sorting）與部門資訊（Who We Are、Where We Are、Tour of the Usability Lab）。
- **形式**：線上 WebCAT，**開放式**（「Categories were not pre-defined; each user created and named their own categories」，L37–41），每張卡都要放進類別才算完成。
- **參與者**：全公司員工每日訊息招募，誘因是 $50 抽獎；172 人參加、4 人資料不完整，**168 份完整**（L43–48）。
- **分析**（L56–80）：每人的相似度矩陣（同組 = 1）加總；從 168 人中隨機抽子樣本，樣本數 2、5、8、12、15、20、30、40、50、60、70，**每種大小 10 個樣本**，算子樣本矩陣與全體矩陣的相關係數，取平均畫 Figure 1（附誤差棒）。
- **樹狀結構比較**（L101–118, Table 1）：全體 168 人的叢集分析有 17 個「基本雙卡叢集」；N = 5、10、15、20、40 各抽 **5 個樣本**生樹，計算每對基本叢集在子樣本樹上被幾個節點隔開。

## 主張／發現（實證）

1. **相關係數隨樣本數遞增、遞減報酬**（L87–90）：「the increase is more dramatic at the smaller sample sizes so that as the size increases beyond 20-30, there is little increase in the size of the correlation coefficient. Also note that the variance of the values, as indicated by the error bars, is much greater for the smaller samples.」
2. **樹的結構也隨樣本變大而接近全體**（Table 1，L130–148）：
   - 所有基本叢集的平均分隔節點數：N=5 **2.0**、N=10 **1.3**、N=15 **1.5**、N=20 **1.1**、N=40 **0.75**。
   - 基本叢集被拆開的平均比例：N=5 **69%**、N=10 **50%**、N=15 **45%**、N=20 **48%**、N=40 **35%**。
   - 例：卡 18「Remote usability testing」與 21「Portable usability testing」在 N=40 樹中仍在一起，N=20 到 N=5 越分越遠（L103–108）。
3. **結論**（L152–160）：「it may not be cost effective to spend resources to gather information from more than 20-30 participants in a card-sorting study.」
4. **小樣本也比設計師自己猜好**（作者判斷，L155–157）：「even the trees based on the smallest sample sizes are probably closer to the one for all 168 participants than might be obtained from speculation by a designer who is not a potential user」——這句沒有資料支持（研究中沒有「設計師猜測」這一組）。
5. **作者自己的外推警告**（L159–161）：「we must exercise appropriate caution in generalizing results from one study. Results will obviously differ as a function of the homogeneity of the participants in a sample and such things as the instructions given」。

## 可引用結果與原句

- 摘要（L16–18）：「Results indicate that reasonable structures are obtained from 20-30 participants.」
- Table 1 底兩列（N=5 / 10 / 15 / 20 / 40）：平均分隔 2.0 / 1.3 / 1.5 / 1.1 / 0.75；拆開比例 69% / 50% / 45% / 48% / 35%。

## 限制

- 單一研究、單一組織、單一內容（易用性部門自己的 intranet，46 張卡），參與者是同公司員工——同質性高，作者自己點名同質性會影響結果。
- 「正確答案」是 168 人的總和，不是外部效標；研究測的是**小樣本能多接近大樣本**，不是「做出來的 IA 好不好用」。沒有任何找資訊成功率的資料。
- 每個樣本大小只抽 10 次（相關）或 5 次（樹），估計不穩。
- 只有開放式卡片分類。
- 會議論文，未經期刊審查；Figure 1 數值沒有在內文列出。

## 與常見轉述不一致處

1. **0.75／0.90／0.93／0.95／0.98 這組數字不在論文內文裡**。論文只有 Figure 1 的圖與「20–30 之後增加很少」的文字；這組數字出自 Nielsen 2004 NN/g 文章（他讀圖或另得自作者），之後被大量轉述成「Tullis & Wood 發現 15 人相關 0.90」。引用時應寫「Nielsen 依 Tullis & Wood 的資料讀出」。
2. **「Tullis & Wood 說 15 人就夠」是錯的**：原作者結論是 20–30 人；15 人是 Nielsen 的建議。
3. **樹結構並非單調改善**：Table 1 中 N=15 的平均分隔（1.5）比 N=10（1.3）還差，拆開比例 N=20（48%）比 N=15（45%）還高；只有 N=40 明顯較好。以樹的結構看，「15 人就收斂」並不成立，比較接近「40 人才明顯穩定」。論文沒有討論這個非單調現象。
4. **內文圖號敘述有誤**：L102 說「Figures 3-6 … for sample sizes of 40, 20, 15, 10, and 5」，列了 5 個樣本數卻只有 4 張圖；附錄實際是 Fig. 3 N=40、Fig. 4 N=20、Fig. 5 N=10、Fig. 6 N=5，**沒有 N=15 的圖**；L111 又寫「Figures 3-7」。Table 1 也有排版問題（「0,4」用逗號；卡 38 HID research 列 N=5 為「8」、N=15 為「8.2」，遠高於其他列；「03 Site feedback」該列無數值）。
5. **常被轉述成「卡片分類樣本數的通則」**：其實是易用性部門 intranet 的單一案例。後續研究數字差很多：Dougalis & Katsanos 2025（CHIGreece，**封閉式**，191 人、45 張卡、7 類）結論是 8–12 人即可（Mantel r 0.91–0.94）——僅讀到摘要與 exa 摘錄，未讀全文；Lantz et al. 2019（*Journal of Classification*）被 NN/g 2024 引用，未讀。

## 讀取紀錄

- 2026-10-22：exa 搜尋 → exa web_fetch ResearchGate 頁面（含全文文字層）→ 寫入 fulltext 檔 → 依序讀完。
- 失敗來源：RG PDF 直連（403）、citeseerx（404）、upassoc.org（404）。
- 後續可補：Dougalis & Katsanos 2025（gold OA，DOI 10.1145/3749012.3749050）、Lantz et al. 2019、Pampoukidou & Katsanos 2021（CHI EA，開放式卡片分類重測信度，closed access）。

## 行號修正（2026-10-22，依 _spotcheck-batch5）
- 摘要、外推警告、Figures 3-6／3-7 行號改為對應現行全文檔；其餘行號（如 L103–108）未逐一重核，引用前以全文檔為準。
