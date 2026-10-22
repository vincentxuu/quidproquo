# 抽取紀錄：Diátaxis（Daniele Procida, diataxis.fr）

read_status=full（14 個頁面全文；2026-10-22 以 curl 抓 live 版，pandoc 轉純文字。網站沒有標示最後更新日期）

## 書目

- 作者：Daniele Procida（Colophon："Diátaxis is the work of Daniele Procida."）
- 網站：https://diataxis.fr/ ，原始碼 https://github.com/evildmp/diataxis-documentation-framework（有 CITATION.cff）。作者要求引用網站本身。
- 讀過的頁面（皆 2026-10-22 抓取）：
  - 首頁 /、Start here /start-here/
  - Applying：/tutorials/、/how-to-guides/、/reference/、/explanation/、/compass/、/how-to-use-diataxis/（Workflow）
  - Understanding：/foundations/、/map/、/quality/、/tutorials-how-to/、/reference-explanation/
  - /colophon/
- 未讀：/applying-diataxis/（目錄頁）、/understanding-diataxis/（目錄頁）、Help translate、News & Updates。
- 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/diataxis.txt、diataxis-part2.txt

## 這是什麼（性質）

- 不是實證研究，是單一作者的實務框架與論述。沒有樣本、對照或測量。採用證據只有首頁三則推薦語（Vonage、Gatsby、Cloudflare）與「數百個專案」的自述。
- 原始適用範圍：軟體產品文件（Colophon："The original context for the Diátaxis approach was limited to software product documentation."）。作者 2021 年起延伸到科研、企業內部文件、組織管理、教育，"This work is on-going."

## 可引用內容

1. 四種文件與兩個軸（Start here、Foundations）
   - 原文："The core idea of Diátaxis is that there are fundamentally four identifiable kinds of documentation, that respond to four different needs. The four kinds are: tutorials, how-to guides, reference and explanation."
   - 兩軸：action（做）／cognition（知）；acquisition（學，study）／application（用，work）。
   - Compass（判斷表，原文）：

     | If the content… | …and serves the user's… | …then it must belong to… |
     |---|---|---|
     | informs action | acquisition of skill | a tutorial |
     | informs action | application of skill | a how-to guide |
     | informs cognition | application of skill | reference |
     | informs cognition | acquisition of skill | explanation |

   - 原文（compass）："To use the compass, just two questions need to be asked: action or cognition? acquisition or application?"

2. 四種的定義（Start here 與各子頁首句）
   - Tutorial："A tutorial is a lesson, that takes a student by the hand through a learning experience."；"A tutorial is always learning-oriented."
   - How-to："A how-to guide addresses a real-world goal or problem, by providing practical directions to help the user who is in that situation."；"A how-to guide always addresses an already-competent user"
   - Reference："Reference guides contain the technical description - facts - that a user needs in order to do things correctly: accurate, complete, reliable information, free of distraction and interpretation."；"One hardly reads reference material; one consults it."
   - Explanation："Explanatory guides provide context and background. They serve the need to understand and put things in a bigger picture. Explanation joins things together, and helps answer the question why?"

3. Map 表（/map/）：回答的問題
   - Tutorials "Can you teach me to…?"；How-to "How do I…?"；Reference "What is…?"；Explanation "Why…?"
   - 類比：教小孩做菜／食譜／食品包裝背面的資訊／一篇烹飪社會史文章。

4. 混淆是問題的根源（/map/、/tutorials-how-to/）
   - 原文："Crossing or blurring the boundaries described in the map is at the heart of a vast number of problems in documentation."
   - 原文："the single most common conflation made in software product documentation is that between the tutorial and the how-to guide."
   - 「基礎 vs 進階」不是分界："a tutorial can present something complex or advanced. And, a how-to guide can cover something that's basic or well-known. The difference between the two lies in the need they serve: the user's study, or their work."

5. Reference 與 Explanation 的判別法（/reference-explanation/）
   - 經驗法則："If it's boring and unmemorable it's probably reference."；"if you can imagine reading something in the bath, probably, it's explanation"
   - 真正的檢驗："is this something someone would turn to while working ... Or is it something they'd need once they have stepped away from the work, and want to think about it?"
   - 常見滑移："one often finds explanatory material sprinkled into reference."

6. 各類寫作原則（摘要）
   - Tutorial："Ruthlessly minimise explanation"、"Ignore options and alternatives"、"Aspire to perfect reliability"；維護成本高："Writing and maintaining tutorials can consume a remarkable amount of effort and time."；產品一變，"all that work needs to be done again"。
   - How-to：從使用者目標出發而不是工具功能："How-to guides are about goals, projects and problems, not about tools."；標題要明說："good: How to integrate application performance monitoring"。
   - Reference：結構應映照被描述之物（"the structure of the documentation should mirror the structure of the product"）；可自動生成以保持準確，但 "too many software developers think that auto-generated reference material is all the documentation required."
   - Explanation：可以有意見與觀點；常見問題是散落："explanation tends to be scattered in small parcels in other sections."；可改名為 Discussion／Background／Conceptual guides／Topics。

7. 工作方式：不要先建四個空分類（/how-to-use-diataxis/）——跟「團隊 wiki 怎麼開始」直接相關
   - 原文："It certainly does not mean that you should create empty structures for tutorials/howto guides/reference/explanation with nothing in them. Don't do that. It's horrible."
   - 原文："it discourages planning and top-down workflows, preferring instead small, responsive iterations from which overall patterns emerge."
   - 四步循環：選一塊（任何一塊）→ 評估 → 決定一個立即可做的改進 → 做完並發布；重複。
   - "Complete, not finished"：文件永遠不會完成，但每個階段都可以是完整的。

## 作者自己說的限制

- 不處理正確性、完整性（/quality/）："Diátaxis cannot address functional quality in documentation. It is concerned only with certain aspects of deep quality"。功能品質（accuracy、completeness、consistency…）上 "Diátaxis principles can have only an analytical role."——能讓缺口變明顯，不能補上。
- 不是公式（/quality/）："Diátaxis offers a set of principles - it doesn't offer a formula. It certainly cannot offer a short-cut to success, bypassing the skills and insights of disciplines such as user experience or user interaction design"；"Using Diátaxis does not guarantee deep quality."
- 適用範圍原為軟體產品文件；企業內部文件的應用作者說還在探索中（/colophon/）。
- 作者承認早期版本（Divio 時期 2014–2021）"there are several aspects that I now think I got wrong."（沒說哪些）。
- Foundations 自承：光是「好用」不夠，"Otherwise, it will be just another useful heuristic approach"——然後用兩軸論證「四種且只有四種」。這是概念論證，不是實證。

## 與摘要或常見轉述不一致處

- 「Diátaxis 要你把文件分成四個資料夾」：作者明確反對先建空結構（"Don't do that. It's horrible."），結構應該由逐步改善「從內長出來」。
- 「Tutorial 是入門、How-to 是進階」：作者專門寫一段反駁，分界是 study vs work，不是難易。
- 「用 Diátaxis 就能讓文件正確、不過時」：作者說它不處理功能品質，只能暴露問題。對「wiki 為什麼爛掉」（過時、錯誤）它不是解法，只是分類與寫法的框架。
- 「Diátaxis 經過驗證」：首頁說 "Diátaxis is proven in practice"，證據只有推薦語與採用數；沒有對照研究。「四種且只有四種」是作者的概念推導（兩軸 × 兩值）。
- 「How-to 是讀最多的」：how-to 頁寫 "Well-written how-to guides that address the right questions are likely to be the most-read sections of your documentation."——是 "likely"，沒有資料。
- 企業內部知識庫（決策紀錄、會議紀錄、onboarding、runbook、政策）不在原始設計範圍。runbook 大致可對到 how-to；決策紀錄（為什麼這樣做）可對到 explanation；但這是我的對應，作者沒寫。

## 讀取紀錄

- diataxis.txt：1,595 行，75,592 bytes（9 頁：首頁、start-here、tutorials、how-to-guides、reference、explanation、compass、map、foundations）。依序讀 1–640（首頁、start-here、tutorials、how-to 開頭）→ 640–1219（how-to、reference、explanation、compass 開頭）→ 1219–1595（compass、map、foundations）。
- diataxis-part2.txt：492 行，38,339 bytes（tutorials-how-to、reference-explanation、quality、how-to-use-diataxis、colophon）。一次讀完 1–492。
- 圖片（map 圖、compass 圖、Partial／Total collapse 圖）沒有文字，只讀到 alt text。
- 管道：`curl -sL -A "Mozilla/5.0"` 各頁 → 200 HTML → `pandoc -f html -t plain`（成功）。
