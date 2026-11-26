# NN/g — Card Sorting（定義文 2024）＋ Card Sorting: How Many Users to Test（2004）

read_status=read（兩篇 NN/g 文章正文從標題讀到參考文獻）

## 來源與讀取版本

- A. Tankala, S. & Sherwin, K. (2024-02-02). *Card Sorting: Uncover Users' Mental Models for Better Information Architecture*. NN/g. https://www.nngroup.com/articles/card-sorting-definition/
  - 讀取：2026-10-22。先以 `mcp__exa__web_fetch_exa` 全文讀一次；再 `curl` 抓 HTML（200, 139,420 bytes）→ 擷取 `article-h1` 到 `</article>` → `pandoc -t plain` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/nng-card-sorting-definition.txt`（280 行，24,368 bytes），依序讀完 L1–280。頁面無「Last reviewed」標記。
- B. Nielsen, J. (2004-07-18). *Card Sorting: How Many Users to Test*. NN/g. https://www.nngroup.com/articles/card-sorting-how-many-users-to-test/
  - 讀取：2026-10-22，curl（200, 126,517 bytes）→ 同流程 → `.../fulltext/nng-card-sorting-how-many-users-to-test.txt`（126 行，10,667 bytes），讀完 L1–126。
  - 註：任務書給的 `card-sorting-how-many-users/` 與 `card-sorting-participants/` 兩個 URL 皆 404；正確 slug 由 exa 搜尋取得。

## 主張／發現

全部是**作者建議**（practitioner guidance），沒有新實證；數字的唯一實證根據是 Tullis & Wood 2004（另見 `tullis-wood-2004-card-sort-sample.md`）與 A 文引用的 Lantz et al. 2019。

### A（2024 定義文）

1. **卡片數：建議 30–50 張**（A L87）。「We recommend 30­–50 cards to prevent user fatigue and encourage thoughtful groupings from participants.」依據是作者經驗＋一個客戶案例（約 50 張，L89），沒有引實證。
2. **超過 50 張的風險**（A L216，作者建議）：「When you have over 50 cards, participants may create a large Miscellaneous category and stuff cards in it.」且無法分辨是不知道放哪還是累了。
3. **人數分質化／量化**（A L107–110）：
   - 質化：「Researchers need to recruit at least 15 participants for this approach.」
   - 量化：「we recommend at least 30–50 participants to ensure that results are generalizable to a broader population.」
   - L110：更多人不會傷害結果，數字是考量預算。
4. **開放式優先、封閉式改用 tree test、混合式通常不建議**（A L156–158）：
   - Open：「We recommend this approach because you get a holistic view of users' mental models」
   - Closed：「Instead of closed card sorting, we typically recommend tree testing (also known as reverse card sorting) as a way to evaluate navigation categories.」
   - Hybrid：「We generally recommend against this approach because the predefined categories bias users into identifying similarly structured categories.」只在對 1–2 個類別有把握時考慮。
5. **參與者命名的分類不要直接當最終標籤**（A L164）：「In an open card sort, don't expect participants to create effective labels.」
6. **卡片命名避免重複字**（A L99）：Toyota Camry／Matrix／Land Cruiser 會讓人只依「Toyota」分組。
7. **先分組、後命名**（A L152）：命名放在分組之後，避免先框住類別。
8. **量化也要配幾場有主持的場次**（A L200）。
9. **方法限制**（A L214–217）：缺少頁面脈絡（資訊氣味）、只產生一層分類、卡片數有上限、結果難解讀。

### B（Nielsen 2004）

1. **開頭定調「不要照組織圖」**（B L19–21，作者主張＋NN/g intranet 研究的概述）：「A classic mistake is to structure the information space based on how you view the content — which often results in different subsites for each of your company's departments」；「Rather than simply mirroring your org chart … In each of our intranet studies, we've found that some of the biggest productivity gains occur when companies restructure their intranet to reflect employees' workflow.」（沒有附數字）
2. **讀 Tullis & Wood 的數字**（B L53–55）：5 人 r = 0.75；15 人 r = 0.90；30 人 r = 0.95；60 人 r = 0.98。「You must test 15 users to reach a correlation of 0.90」。另 L59：20 人約 0.93。
3. **Nielsen 與原作者建議不同**（B L57）：「Tullis and Wood recommend testing 20–30 users for card sorting. Based on their data, my recommendation is to test 15 users.」理由是把省下的 15 人拿去做 3 輪質化易用性測試（L59）；大型高預算專案才做 30 人（L89）。
4. **為什麼卡片分類要比易用性測試多人**（B L67–72）：易用性測試是評估法，問題少數人就會出現；卡片分類是**生成法**，「There is great variability in different people's mental models and in the vocabulary they use」。
5. **不要只看相似度數字**（B L63）：「I don't recommend designing an information architecture based purely on a card sort's numeric similarity scores.」價值大半在聽使用者邊分邊講。
6. **作者自列研究弱點**（B L78–81）：只有一個研究；純量化，忽略質化資料。
7. **Nielsen 的個人經驗**（B L85）：以往建議約 15 人，預算緊或難招募時 12 人也有好結果。

## 可引用結果與原句

- 卡片數：A L87「We recommend 30­–50 cards」。
- 人數：B L55「You must test 15 users to reach a correlation of 0.90, which is a more comfortable place to stop.」／B L89「the current recommendation is to test 15 users for card sorting in most projects and 30 users in big projects with lavish funding.」
- 2024 版改口：A L108「For quantitative studies, we recommend at least 30–50 participants」。
- 方法分工：A L157 封閉式改用 tree testing。

## 限制

- 兩篇都是實務建議文，沒有新資料。B 的 0.75／0.90／0.95／0.98 是 Nielsen 對 Tullis & Wood 圖表的讀數（原論文內文沒有寫出這些數值，見 tullis-wood 抽取紀錄）。
- A 的「30–50 人」沒有說明怎麼從 Tullis & Wood（建議 20–30）或 Lantz 2019 推出來；文內沒有交代推導。
- B 第 19–21 行「按 workflow 重組 intranet 生產力提升最大」只是概述，沒有附研究數據。

## 與常見轉述不一致處

1. **「NN/g 說卡片分類 15 人就夠」已經過時，至少是不完整的**。2024 年定義文（A L107–108）把 15 人改成「**質化**卡片分類至少 15 人」，**量化要 30–50 人**。2004 年 Nielsen 的 15 人是針對「相似度相關 0.90 夠用」的判斷，屬於量化分析。新舊兩篇數字對不上，NN/g 沒有說明為什麼改。
2. **「15 人」不是 Tullis & Wood 的結論**。原作者建議 20–30 人（B L57 自己也寫了）；15 人是 Nielsen 把成本考量加上去後的個人建議。
3. **「卡片分類可以驗證 IA」是誤用**：NN/g 明確說封閉式驗證不如 tree testing（A L157），卡片分類是生成法（B L70）。
4. **卡片數「30–50」常被當成實證門檻**，A 的依據只有作者經驗與一個客戶案例。
5. 常見轉述說 NN/g「研究證明按任務組織 intranet 生產力最高」；B L21 只是一句概述，沒有效果量，要回到 NN/g intranet 報告或其他實證才能引用（見 `nng-intranet-ia.md`）。

## 讀取紀錄

- 2026-10-22 exa web_fetch A（全文）；curl A/B HTML → pandoc；Read A L1–90、L90–279、B L1–126。
- 試過但失敗：`/articles/card-sorting-how-many-users/`（404）、`/articles/card-sorting-participants/`（404）。
