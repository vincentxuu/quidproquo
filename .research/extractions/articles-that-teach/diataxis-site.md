# 抽取紀錄：Diátaxis 官網三頁（首頁、Foundations、How to use）

- **書目**：Diátaxis 網站，https://diataxis.fr/ 。三頁：首頁（https://diataxis.fr/）、〈Foundations〉（https://diataxis.fr/foundations/）、〈Diátaxis as a guide to work〉（https://diataxis.fr/how-to-use-diataxis/）。網頁，沒有 DOI、沒有發表日期。**存檔的三頁正文都沒有出現作者姓名**（Jina reader 只留了正文）；網站作者一般認定是 Daniele Procida，但這一點我沒有從存檔核到，引用作者時要另外對網站的頁尾或 colophon。檔名因此沒有照「作者年份」的格式。
- **原文檔**（都在 `.research/raw/learning-content/q6-evaluate/`，經 Jina reader 轉成 markdown，取得日期依檔案時間是 2026-10-13）：
  - `diataxis-home.md`：49 行、2,800 字元
  - `diataxis-theory.md`：54 行、4,782 字元（內容是 Foundations 頁）
  - `diataxis-howtouse.md`：72 行、7,982 字元
- **讀取日期**：2026-10-14
- **版本**：網站現行頁面的存檔（不是固定版本，網站會改）
- **供哪幾篇使用**：order 27
- **既有紀錄**：`.research/extractions/teaching-text/diataxis.md` 已記錄首頁與 Foundations（用的是另一份 curl 存檔 `.work/teaching-text-research/seq/diataxis_*.txt`，由文章作者自己讀）。那份沒有涵蓋第三頁。這三個檔都很短，我三頁都從頭讀了；前兩頁的內容與既有紀錄一致，下面只在有補充的地方多寫。

## 研究設計

**不是研究。** 三頁都是框架作者對自己方法的說明與主張，沒有受試者、資料、比較或測量。三頁合計**沒有任何一筆參考文獻、註腳或對外部研究的引用**；唯一的外部連結是三則證言者的公司或個人頁、以及一張插畫的版權標示。

## 主張（逐項）

### 首頁（`diataxis-home.md`）

| # | 主張 | 行號 | 原文 |
|---|---|---|---|
| 1 | 定位 | L7、L11 | 「A systematic approach to technical documentation authoring.」「Diátaxis is a way of thinking about and doing documentation.」 |
| 2 | 四種需求對四種文件 | L15 | 「Diátaxis identifies four distinct needs, and four corresponding forms of documentation - tutorials, how-to guides, technical reference and explanation. It places them in a systematic relationship, and proposes that documentation should itself be organised around the structures of those needs.」 |
| 3 | 來源是「對使用者需求的系統性理解」 | L13 | 「It prescribes approaches to content, architecture and form that emerge from a systematic approach to understanding the needs of documentation users.」 |
| 4 | 解決三類問題 | L18 | 「Diátaxis solves problems related to documentation content (what to write), style (how to write it) and architecture (how to organise it).」 |
| 5 | 對寫的人也有用 | L20 | 「It is light-weight, easy to grasp and straightforward to apply. It doesn’t impose implementation constraints.」 |
| 6 | 自稱已在實務中證實 | L34 | 「Diátaxis is proven in practice. Its principles have been adopted successfully in hundreds of documentation projects.」沒有清單、數字出處或連結。 |
| 7 | 三則證言 | L36–49 | Greg Frileux（Vonage）：「…a high-quality set of internal documentation that our users love, and our contributors love adding to.」；Megan Sullivan（Gatsby）：「we made it easier for users to discover the resources that they need when they need them.」；Adam Schwartz（Cloudflare 開發者文件）：「Our documentation is now clearer than it’s ever been, both for readers and contributors.」三則都是採用者的主觀評價，沒有前後測量。 |

### Foundations（`diataxis-theory.md`）

| # | 主張 | 行號 | 原文 |
|---|---|---|---|
| 8 | 有用，而且感覺對 | L7 | 「Diátaxis is successful because it works - both users and creators have a better experience of documentation as a result. It makes sense and it feels right.」 |
| 9 | 自己承認那還不夠當理論依據 | L9–11 | 「However, that’s not enough to be confident in Diátaxis as a theory of documentation. As a theory, it needs to show why it works. It needs to show that there is actually some reason why there are exactly four kinds of documentation, not three or five. It needs to demonstrate rigorous thinking and analysis, and that it stands on a sound theoretical foundation. Otherwise, it will be just another useful heuristic approach, and the strongest claim we can make for it is that “it seems to work quite well”.」 |
| 10 | 服務的對象 | L17 | 「The user whose needs Diátaxis serves is the practitioner in a domain of skill.」例子：使用程式語言、駕駛某型飛機、當飛行員。 |
| 11 | 第一個維度：行動／認知 | L23 | 「A skill or craft or practice contains both action (practical knowledge, knowing how, what we do) and cognition (theoretical knowledge, knowing that, what we think).」 |
| 12 | 第二個維度：習得／應用 | L27 | 「something that needs to be both acquired, and applied. Being “at work” … and being “at study” … are once again counterparts」 |
| 13 | 兩個維度構成完整的地圖，所以必然是四格 | L34 | 「This is a complete map. There are only two dimensions, and they don’t just cover the entire territory, they define it. This is why there are necessarily four quarters to it, and there could not be three, or five. It is not an arbitrary number.」 |
| 14 | 對照表 | L45–50 | learning → tutorials（使用者習得技藝；文件指引行動）；goals → how-to guides（應用；行動）；information → reference（應用；認知）；understanding → explanation（習得；認知） |
| 15 | 依據的性質，作者自己的用詞 | L52 | 「a map is only reliable if it adequately describes a reality. Diátaxis is underpinned by a systematic description and analysis of generalised user needs.」 |
| 16 | 完整列舉的宣稱 | L54 | 「This is why there are four and only four types of documentation. There is simply no other territory to cover.」 |

論證的形狀：先設定兩個二分的維度，再由 2 × 2 推出四格。「只有這兩個維度」這個前提是直接宣告的（L34），頁面沒有論證為什麼沒有第三個維度，也沒有說「系統性的描述與分析」（L52）是怎麼做的、根據哪些使用者。

### How to use（`diataxis-howtouse.md`）

這一頁談的是工作流程，不是四分法的依據。

| # | 主張 | 行號 | 原文 |
|---|---|---|---|
| 17 | 自認和主流做法相反：不鼓勵事先規劃 | L10 | 「Diátaxis provides an approach to work that runs counter to much of the accepted wisdom in documentation. In particular, it discourages planning and top-down workflows, preferring instead small, responsive iterations from which overall patterns emerge.」 |
| 18 | 是指引不是計畫 | L14 | 「the structure it proposes is not intended to be a plan, something you must complete in your documentation. It’s a guide, a map to help you check that you’re in the right place and going in the right directions.」 |
| 19 | 不要先把結構搭好 | L20–24 | 「using Diátaxis means not spending energy trying to get its structure correct.」「It certainly does not mean that you should create empty structures for tutorials/howto guides/reference/explanation with nothing in them. Don’t do that. It’s horrible.」 |
| 20 | 結構是改善的結果，不是手段 | L22、L26 | 「it will have assumed that shape because it has been improved. It’s not the other way round, that the structure must be imposed upon documentation to improve it.」「Diátaxis changes the structure of your documentation from the inside.」 |
| 21 | 一次一小步，改完就發布 | L30–34 | 「every step in the right direction is worth publishing immediately.」「don’t try to work on the big picture. It’s both unnecessary and unhelpful.」 |
| 22 | 不要打掉重練 | L38 | 「If you’re tidying up a huge mess, the temptation is to tear it all down and start again. Again, avoid it.」 |
| 23 | 四步循環：選一段、評估、決定、做 | L40–48 | 評估時問的四題：「What user need is represented by this? How well does it serve that need? What can be added, moved, removed or changed to serve that need better? Do its language and logic meet the requirements of this mode of documentation?」；決定時問：「What single next action will produce an immediate improvement here?」 |
| 24 | 這樣做的好處（宣稱，無依據） | L50 | 「Working like this helps reduce the stress of one of the most paralysing and troublesome aspects of the documentation-writer’s work: working out what to do.」 |
| 25 | 有機成長的比喻 | L58、L64 | 「A good model for documentation is well-formed organic growth that adapts to external conditions.」「Good structure develops from within.」 |
| 26 | 「完整但未完成」 | L68–72 | 「a plant is never finished … But, at every stage of its development … it’s always complete」「documentation is also never finished… However it can always be complete: useful to users, appropriate to its current stage of development」 |

第三頁同樣沒有引用任何研究、案例資料或前後比較；「counter to much of the accepted wisdom」所指的主流做法也沒有引出處。

## 作者自己列的限制

三頁都沒有限制一節。相當於自我設限的只有：

1. Foundations 開頭：只憑「有用、感覺對」不足以當理論，否則最多只能說「it seems to work quite well」（L9–11）。作者接著用兩個維度的推導來補這個缺口；補上的是概念分析，不是資料。
2. Foundations L52：「a map is only reliable if it adequately describes a reality」——作者自己設的檢驗標準，但頁面沒有拿現實去檢驗。
3. 適用對象限定在「the practitioner in a domain of skill」（L17），也就是技能或工具的使用者；純概念性學科的教學不在它宣稱的範圍內。
4. How to use 頁說它是指引不是計畫（L14），並警告不要先建四個空分類（L24）。

## 與摘要說法不一致的地方

網頁沒有摘要。改對三頁之間的說法：

1. 首頁說「proven in practice」（L34），Foundations 說光靠「it works」還不足以有信心、需要說明為什麼（L9）。兩頁對「實務上有用」這件事的證據力給了不同的份量；首頁的「proven」沒有資料，只有三則證言。
2. 首頁與 Foundations 都強調結構（「documentation should itself be organised around the structures of those needs」，首頁 L15；「strongly prescribes a structure」，How to use L30），How to use 卻說不要花力氣在結構上（L20）。作者的調和方式是「結構從內部長出來」（L26）。這不算矛盾，但只引前兩頁會把 Diátaxis 讀成「把文件分成四區」，那正是第三頁叫人不要做的事。

## 與清單『要撐的結論』不合的地方

清單寫：「四分法的依據是概念分析，沒有引用對照研究」。

1. **「依據是概念分析」撐得住。** Foundations 的推導就是兩個二分維度相乘（L23–34），作者自己的說法是「a systematic description and analysis of generalised user needs」（L52）。
2. **「沒有引用對照研究」在這三頁的範圍內撐得住，而且可以說得更完整：三頁沒有引用任何研究，連非對照的也沒有。** 但要守住範圍：我只讀了三頁，網站還有 tutorials、how-to guides、reference、explanation、the map、quality、complex hierarchies 等頁沒有讀。可以寫「首頁、Foundations 與 How to use 三頁沒有引用任何研究」，不能寫「Diátaxis 沒有實證」或「整個網站沒有引用研究」。（清單的「沒有可精讀的來源」一節已提醒這一點。）
3. **要補一句：首頁有正面宣稱「proven in practice」與「hundreds of documentation projects」**，依據是採用數與三則證言。寫成「沒有引用研究」時不要漏掉它其實有提出證據主張，只是證據是採用與口碑。
4. **要補作者自己的那句保留**（Foundations L9–11）：他自己就說感覺對不夠。先前的稿子把它寫成「有用是因為感覺對」，既有紀錄已指出這是誤讀；原頁的順序是「有用 → 感覺對 → 但這不夠」。
5. **第三頁對 order 27 有一點直接相關的內容，清單沒提**：它主張改寫既有文件時不要打掉重練、不要先規劃整體，而是挑一小段、問它服務哪一種需求、改一步就發布（L38–48）。這是作者的工作建議，沒有任何依據，只能當成「一種做法」引用。

## 讀取紀錄

| 順序 | 檔案與行號 | 內容 |
|---|---|---|
| 1 | `diataxis-home.md` L1–49（全檔） | 標題、語言切換、定義、四種文件、圖一張（只有替代文字「Diátaxis」）、對作者的價值、Contents 三句導覽文字（連結目標被轉檔丟掉）、「proven in practice」、三則證言 |
| 2 | `diataxis-theory.md` L1–54（全檔） | Foundations：開頭三段、Two dimensions of craft（Action/cognition、Acquisition/application、The map of the territory）、Serving needs、對照表、結尾兩段。兩張圖沒有看（two-dimensions.png、axes-of-needs.png） |
| 3 | `diataxis-howtouse.md` L1–72（全檔） | 開頭三段、Use Diátaxis as a guide, not a plan、Don’t worry about structure、Work one step at a time、Just do something（四步循環）、Allow your work to develop organically（Well-formed organic growth、Complete, not finished）。一張插畫沒有看 |

沒有表格需要對版面（Foundations 的對照表是 HTML 表格轉成的 markdown 表，四列四欄完整）。

沒做的：沒有開線上頁面核對存檔是否為現況；沒有讀網站其他頁；作者姓名沒有從存檔核到。
