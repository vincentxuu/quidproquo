# Kuric, Demcak & Krajcovic 2025 — Tree testing 變體與原型測試的交叉比較（＋任務 6 搜尋紀錄）

read_status=read（ScienceDirect OA 全文 HTML，從 Highlights 讀到參考文獻與 Data availability）

## 任務 6 搜尋紀錄（2020–2026 IA 對找資訊成功率的實證）

目標：按任務 vs 按組織、導覽、標籤命名對找資訊成功率影響的 2020–2026 實證研究。用 `mcp__exa__web_search_exa`，2026-10-22：

1. 「empirical study comparing task-based versus organizational structure navigation website findability success rate tree test experiment」
2. 「2022 study information architecture navigation labels effect on information findability university website user experiment results」
3. 「2023 controlled experiment intranet or government website navigation organized by user tasks versus by department, findability task success」
4. 「Journal of Usability Studies 2021 tree testing information architecture labels comparison findability results participants」
5. 「between-subjects study 2020 … 2025 comparing two information architectures user-centered vs organization-centered categories tree test success directness」
6. 「Ntouvaleti Katsanos "Validity of the Open Card Sorting Method…" pdf」

結果：**沒有找到 2020–2026 年直接比較「按任務 vs 按組織」的實驗**。找到的直接比較都較舊：

- Cozijn, Maes, Schackman & Ummelen 2007（*J. Technical Writing and Communication*，DOI 10.2190/382g-91t8-t06r-2l52）：intranet，按組織 vs 按任務的超連結結構；**按組織效率較高**（推測因熟悉），事後分析任務結構有學習效果。只讀到摘要。
- Resnick & Sánchez 2004（*Human Factors* 46(1)，60 人，零售網站）：使用者中心的**標籤**顯著提升績效與滿意度；使用者中心的**組織方式**只有在標籤品質差時才有幫助。只讀到摘要。
- Holsapple & Fang（年份未確認）：usage-oriented 或混合階層的易用性顯著高於 subject-oriented。只讀到摘要。

2020–2026 期間最接近的候選與取得狀況：

- **Ntouvaleti & Katsanos 2022**（CHI EA，DOI 10.1145/3491101.3519734）：受試者內比較兩個功能原型，一個複製既有網站結構、一個用開放式卡片分類結果重建；重建版 first click 成功率、任務時間、SEQ、SUS 皆顯著較好。**最貼題，但 closed access**：OpenAlex `is_oa: false`；ACM PDF curl 403；ACM fullHtml 經 exa（live-crawl timeout）、tavily（空結果）皆失敗；Groundlane MCP 與 cloudflare MCP 未連線；jina 餘額不足（HTTP 402）。只讀到摘要。
- Santana-Mancilla et al. 2025（大學入口網站 tree test，9 類使用者）：例行任務成功率 >80%，需理解機構術語的任務明顯較低；「Extensión」一詞只有內部人員懂，10 人中 9 人沒能連到文化／社區服務。只讀到 exa 摘錄。
- Dougalis & Katsanos 2025（封閉式卡片分類樣本數）、Pampoukidou & Katsanos 2021（開放式卡片分類重測信度）：方法研究，與「成功率」無直接關係。

**選讀**：Kuric et al. 2025，因為是期間內唯一 OA、有大樣本、直接量測找資訊成功率（以及驗證 tree test 這把尺本身）的實證研究。它**不比較按任務 vs 按組織**，比較的是測量方法；這個落差要在文章中明說。

## 書目與讀取版本

- Kuric, E., Demcak, P., & Krajcovic, M. (2025). Validation of information architecture: Cross-methodological comparison of tree testing variants and prototype user testing. *Information and Software Technology*, 183, 107740. DOI 10.1016/j.infsof.2025.107740。CC 授權 OA。
- 資料與分析腳本：https://github.com/treetest-research/information-architecture-validation（GitHub API 確認存在：README.md、analysis/、assets/、webpage/；未讀內容）。
- 讀取：curl PDF 403；exa 只回摘要；`mcp__tavily__tavily_extract`（advanced, text）取得全文 HTML → 存 `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/kuric-2025-tree-testing.txt`（fold 至 200 欄後 958 行，117,149 bytes），依序讀 L1–330、L330–650、L650–959。圖為影像，只讀到圖說；Fig. 6 的逐題數值不在文字中。

## 設計

- **兩個受試者間研究**，皆在 UXtweak 平台、英國一般民眾、性別與年齡分層抽樣，各 90 人分 3 組 × 30 人（L377–386、L567–574）。總計 180 人、1,800 次任務。
- **IA**：自製線上雜誌，4 層、53 個分支、279 個葉節點；**刻意放入結構與標籤缺陷**（例：頂層同時有「Hobbies」與「Entertainment」）（L266–275）。
- **任務**：1 個暖身 + 10 題（5 易、3 中、2 難），隨機順序；措辭不含樹中標籤原字；部分合理答案刻意不算正確，以模擬設計者與使用者落差（L276–317）。
- **Study 1**：三種 tree test 介面（L115–142）——
  - Tree-visible：已走過的層與其兄弟節點一直可見，可一鍵回到任何上層（像桌面串接選單）。
  - Path-visible：只顯示走過的路徑、隱藏兄弟節點，根節點是「Home」。
  - Compact：只看得到目前一層與其子層，一次只能退一層。
- **Study 2**：同一 IA 做成三個高擬真原型——Desktop（水平串接下拉選單）、Desktop-intrusive（加動畫廣告、選單顏色雜亂、細字）、Mobile（漢堡選單、逐層下鑽，受試者用自己的手機）（L527–561）。
- **指標**：成功率、直達率、直接成功率、完成時間、路徑長度，加上作者新提的 backclicks／backtracks／backsteps；每題後 7 點自評信心與難度（L323–355）。

## 主張／發現（實證）

1. **整體成功率不高，且易題也有問題**（L393–397）：Study 1 三種 tree test 合計成功率 **58.6%**、直接成功率 23.8%、直達率 37.8%、平均 35.89 秒。T10（中等難度）成功率最高 87.78%，但直接成功率只有 24.44%——「indicating a significant usability issue」。
2. **只看全部題目平均，三種 tree test 無顯著差**（Table 2，L402–430）：成功率 Tree-visible 58.7% / Path-visible 54.3% / Compact 62.7%（p = .117）；時間、路徑、信心、難度都不顯著。**回頭行為有差**：backclicks p = .048、backtracks p = .037（效果量 η² = .005，很小）。作者提醒（L406–408）：平均不顯著不代表行為一樣。
3. **難題上變體會改變結果**（L433–448, Table 3）：回頭最多的 6 題中，成功率差異顯著（χ²(2, n=540) = 6.54, p = .038, V = .2；Tree-visible 56.7%、Path-visible 50.6%、Compact 63.9%）。T4 成功 p = .009、T7 直接成功 p = .011、T10 成功 p = .037。
4. **質化路徑分析**（L459–481）：
   - Compact 的受試者搜得較仔細、成功率較高（T4 找墨西哥菜：Compact 30 人中 7 人答對，Tree-visible 2 人、Path-visible 0 人；T10：Compact 30 人全對，其他兩組各有 6、5 人選了 Lifestyle 下的 Self-growth／Self-care）。
   - Path-visible 出現「不回頭」：受試者選了明顯不合理的答案也不退回。
5. **哪個 tree test 最像真實選單**（L616–622, Table 5）：**Tree-visible 與兩個桌面原型在所有指標上都沒有顯著差**；Path-visible 與 Compact 在回頭行為與完成時間上和桌面原型顯著不同。Mobile 原型成功率與 tree test 相近，但路徑較長、信心較低。
6. **原型之間的差異**（L575–585, Table 4）：成功率 Desktop 68% / Desktop-intrusive 68% / Mobile 59.7%（p = .047）；路徑長 Mobile 最長（8.74，p = .001）；信心 Mobile 最低（p = .003）。
7. **顏色等外觀改變會改變選擇**（L691–695，質化）：Desktop-intrusive 中「Film」是紅色、競爭項是冷綠色，T1 多數人直接點 Film；「Hobbies」是中性灰時，T7 只有 1 人 first click 點它（另兩種條件各 7 人）。
8. **作者的實務建議**（L720–730）：選哪種 tree test 會影響結果；可快速撤銷的 Tree-visible 最接近桌面串接選單；非標準導覽（顏色差異等）應另做易用性測試；手機原型適合評估「費力程度」（路徑長、信心）。

## 可引用結果與原句

- L765–767「depending on which commonly used tree test variant is employed, the observed results of a tree test can significantly differ.」
- L767–768「the Tree-visible tree test approximated user behavior in menus potentially so well that in standard menus, further validation via usability testing may be redundant.」
- L702–705「it should be understood that the tree test is in itself a model.」
- L169–171（文獻回顧）：Schmettow & Sommer 2016「have shown that the mismatch between the user's mental models obtained from card sorting and the IA of a system does not axiomatically result in decreased user performance.」

## 限制

- 作者列（L734–754）：單一 IA、單一領域（線上雜誌）、一般民眾、線上非受控環境；需在其他 IA 與特定族群重複。
- 我另外看到的：
  - 每組只有 30 人；依 MeasuringU 的表，n = 30 時比例的 95% 誤差約 ±17%，個別題目的差異很不穩。
  - 效果量都很小（η² ≈ .005–.013、V ≈ .1–.2）。
  - 研究受 UXtweak 資助並在 UXtweak 平台上執行（Acknowledgments L786），作者宣告無利益衝突（L783）；三個變體分別對應 UXtweak、Maze、Optimal Workshop 的實作，但作者刻意匿名（L111–114）。
  - IA 刻意放入缺陷，絕對成功率不能當一般基準。
  - 研究對象是「測量工具」，不是「哪種 IA 比較好找」；沒有比較組織方式或標籤方案。

## 與常見轉述不一致處

1. **文中自相矛盾**：L576–577 說「Participants performed slightly worse in prototypes and were also faster」，但同段數字是原型成功率 **65.2%**、tree test **58.6%**——原型其實比較好。應以數字為準，敘述是錯的（或指其他指標）。
2. **與 NN/g 的方向不同**：NN/g Part 2 說 tree test 成功率通常低於成品（去掉了搜尋與視覺線索）。本研究的原型同樣沒有搜尋，成功率只高約 6.6 個百分點；Mobile 原型（59.7%）甚至與 tree test 相近。所以「tree test 67% 可能變成成品 90%」在沒有搜尋的情況下沒有得到支持。
3. **「tree test 換工具結果都一樣」不成立**，但也不要誇大成「tree test 不可靠」：全體平均的成功率、時間都沒有顯著差，差異集中在難題與回頭行為。
4. 參考文獻把 NN/g〈Tree testing part 2〉標為 Whitenton (2017)，與現行頁面（Laubheimer, 2024-01-19）不同。
5. 本篇被轉述為 IA 實證時要小心：它不能回答「按任務 vs 按組織」的問題。order 7 若需要這類實證，2020 年後目前只找到 Ntouvaleti & Katsanos 2022（卡片分類重建的結構 > 既有結構，closed access，只有摘要）；直接的任務 vs 組織實驗只有 Cozijn 2007（結果反而是組織結構較快）。Schmettow & Sommer 2016 是重要反證，應補讀原文。

## 讀取紀錄

- 2026-10-22：exa 搜尋 6 次（字串見上）→ OpenAlex 查 4 個 DOI 的 OA 狀態 → Kuric 2025 curl PDF 403、exa 只摘要 → tavily extract 全文 → 存檔 → 依序讀完 L1–959。
- Ntouvaleti 2022 取得失敗：ACM PDF 403、exa timeout、tavily 空、Groundlane MCP 未連線、cloudflare MCP 未連線、jina 402；firecrawl 依指示未使用；內建 WebFetch 依指示未使用。
