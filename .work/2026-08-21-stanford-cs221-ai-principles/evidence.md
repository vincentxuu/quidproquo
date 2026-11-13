# 查證紀錄：2026-08-21-stanford-cs221-ai-principles

以下內容原為正文的「附錄」一節，2026-11-12 依 writing-guide「查證過程不寫進正文」移出正文。

## 2026-08-21-stanford-cs221-ai-principles.md

## 附錄：數字與查證方式

- **開課規格**：ExploreCourses 條目列 3–4 學分，註明「May be taken for 3 units by graduate students」。2026–2027 學年秋季班（class #1903）為 Percy Liang 授課，週二週四 15:00–16:20，地點 Hewlett Teaching Center 200，期末考排在 2026-12-10；春季班（class #1890）為 Moses Charikar 授課，週一週三 10:30–12:20。Autumn 2025 那屆上課地點是 NVIDIA Auditorium，考試訂在 2025-11-19 晚上 6 至 9 點，單場、實體、佔總成績 60%。
- **評分比重的歷屆變化**：Autumn 2019 為作業 60%、考試 20%、專案 20%；Autumn 2021 為作業 55%、考試 40%（兩場開書、各 100 分鐘、透過 Gradescope 發放）；Autumn 2022 為作業 60%、考試 40%，專案降為最多 2% 加分；Autumn 2023 起變成作業 40%、考試 60%；Autumn 2024 與 Spring 2025 為作業 40%、考試 59.5%（多出的 0.5% 是先修測驗），專案最多 1.5% 加分；Autumn 2025 為作業 40%、單場考試 60%，專案最多 1.5% 加分、Ed 討論最多 1% 加分。各數字取自 `stanford-cs221.github.io/<學期>/` 的評分段落。
- **模組數與公開範圍**：Spring 2025 的模組登錄檔（`modules/course-data.js`）共列出 111 個模組，其中 32 個帶 Panopto 影片連結、10 個在索引裡直接給 PDF 連結。那 10 份分別是五份先修複習與五份嵌入式倫理模組。其餘模組的投影片 PDF 未列在索引上，但同樣位於 `spring2025-extra/modules/<群組>/<名稱>.pdf`，逐一測試皆可下載。
- **Autumn 2025 的講次數**：課表列到第 20 講。其中第 17（語言模型）、18（AI 與社會）、19 三講在課程網站上標記為 `[New]`。第 19 講的名稱在課程網站上是「AI Supply Chains」，在講義 repo 的 README 上是「Economics of AI」，兩者連到的材料不同（前者無獨立連結，後者是一份 Google 簡報）。
- **作業歷屆組成**：Autumn 2022 為 foundations、blackjack、pacman、scheduling、car、logic；Autumn 2023 把 blackjack 換成 sentiment；Autumn 2024 與 Spring 2025 增加 route 與 mountaincar，成為八份；Autumn 2025 移除 scheduling 與 car，加入 bayesian 與 society。
- **遲交規則**：全學期 7 個延遲日，單份作業最多用 2 天，用完之後每逾一天上限降 25%，超過 2 天不收。
- **未能確認的項目**：（一）三份官方頁面在先修條件上不一致時該以哪一份為準，沒有任何一頁說明；本文只能建議取聯集，無法判定優先序。（二）約束滿足被砍掉的原因，第一堂講義只寫了結果與一個顏文字，沒有給理由。（三）專案從計分項降為加分項的原因，歷屆課程網站都沒有說明。（四）作業指南頁寫著提交的程式「不保證支援標準函式庫以外的套件，不要用 numpy、scikit-learn、pandas」，但第一份作業的安裝步驟要你 `uv add numpy einops`，兩頁的適用範圍我無法從頁面本身確定。（五）Autumn 2025 的選課人數未公開。

## 2026-08-21-stanford-cs221-ai-principles-en.md

## Appendix: numbers and how they were checked

- **Offering details**: the ExploreCourses entry lists 3–4 units, noting "May be taken for 3 units by graduate students." The 2026–2027 autumn section (class #1903) is taught by Percy Liang, Tuesdays and Thursdays 15:00–16:20 in Hewlett Teaching Center 200, with the final exam on 2026-12-10; the spring section (class #1890) is taught by Moses Charikar, Mondays and Wednesdays 10:30–12:20. Autumn 2025 met in NVIDIA Auditorium, with a single in-person exam on 2025-11-19 from 6 to 9 pm worth 60% of the grade.
- **Grade weights across offerings**: Autumn 2019 was 60% assignments, 20% exams, 20% project; Autumn 2021 was 55% assignments and 40% exams (two open-book exams, 100 minutes each, distributed via Gradescope); Autumn 2022 was 60% assignments and 40% exams, with the project dropped to at most 2% extra credit; from Autumn 2023 it became 40% assignments and 60% exams; Autumn 2024 and Spring 2025 were 40% assignments and 59.5% exams (the extra 0.5% is a prerequisite quiz), with the project worth up to 1.5% extra credit; Autumn 2025 is 40% assignments and one 60% exam, with up to 1.5% extra credit for the project and up to 1% for Ed participation. Each figure comes from the grading section of `stanford-cs221.github.io/<quarter>/`.
- **Module count and what's public**: the Spring 2025 module registry (`modules/course-data.js`) lists 111 modules, 32 of them carrying Panopto video links and 10 linked directly to PDFs from the index. Those 10 are five prerequisite-review modules and five embedded-ethics modules. The remaining modules' slide PDFs aren't listed on the index but sit at the same `spring2025-extra/modules/<group>/<name>.pdf` path and download fine when tested one by one.
- **Lecture count for Autumn 2025**: the schedule runs to lecture 20. Lectures 17 (language models), 18 (AI and society) and 19 are marked `[New]` on the course site. Lecture 19 is titled "AI Supply Chains" on the course site and "Economics of AI" in the lecture repo's README, and the two link to different material (the former has no separate link; the latter is a Google Slides deck).
- **Assignment lineup across offerings**: Autumn 2022 was foundations, blackjack, pacman, scheduling, car, logic; Autumn 2023 swapped blackjack for sentiment; Autumn 2024 and Spring 2025 added route and mountaincar for a total of eight; Autumn 2025 removed scheduling and car and added bayesian and society.
- **Late policy**: 7 late days for the quarter, at most 2 on any single assignment; past that, the cap drops 25% per additional day, and nothing is accepted more than 2 days late.
- **What could not be confirmed**: (1) which of the three official pages takes precedence when they disagree on prerequisites — none of them says; this piece can only suggest taking the union, not settle the ordering. (2) Why constraint satisfaction was cut — the first lecture records the outcome and an emoticon, no reason. (3) Why the project dropped from a graded component to extra credit — no course site across the offerings explains it. (4) The assignment policy page says submitted code has "no guarantee of support for packages beyond the standard library" and tells you not to use numpy, scikit-learn or pandas, yet the setup steps for the first assignment tell you to run `uv add numpy einops`; I can't determine from the pages themselves which scope each rule applies to. (5) Autumn 2025 enrollment is not published.

