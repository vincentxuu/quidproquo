# interview-experience：來源核對紀錄

核對日期：2026-10-07（Asia/Taipei）。文章：`src/content/posts/learning/2026-10-07-interview-experience-english.md`（與 `-en.md`），目前 `draft: true`。句子來源是使用者確認過的中文候選清單，不是真實對話，沒有 `corrections.md`。年資、公司類型、數字都是示範用的假設值，不是使用者的履歷。

## 工具路徑

與 `../work-standup/evidence.md` 相同：Groundlane 未掛載、直接 HTTP 回 401；Cambridge 對直接請求回 403；字典改用 Oxford Learner's Dictionaries（OALD），以 curl 抓公開頁面落到 session 暫存檔後本機擷取。The Muse 同樣以 curl 取得。HBR 的面試提問文章抓回內容只有導覽列，未採用。以下核對**不算 Groundlane 驗證**。

### 每頁讀取範圍

| 頁面 | 讀取範圍 |
| --- | --- |
| OALD：experience、work、currently、build、at、responsible、design、implement、reduce、under、part、migrate、downtime、underestimate、disagree、decision、since（介系詞／連接詞／副詞三頁）、divide、role、goal、always、complexity | 整頁抓回，本機以關鍵字擷取相關義項與例句，未逐行讀完 |
| The Muse：51 Interview Questions You Should Be Asking（The Muse Editors，頁面標示 Updated 12/23/2024） | 整頁抓回，讀了職位、成功衡量、團隊三組問題，其餘未讀 |

## Evidence 表

evidenceType 指表達本身；contextEvidenceType 指「軟體工程師英文面試」這個情境。

| 主張／卡片 ID | URL 與段落 | 支持範圍 | evidenceType | contextEvidenceType | 未支持的部分 |
| --- | --- | --- | --- | --- | --- |
| interview-years | [OALD experience](https://www.oxfordlearnersdictionaries.com/us/definition/english/experience_1)：experience in something He gained extensive experience in the field of artificial intelligence；experience as something I have over ten years' experience as a teacher；years of experience of teaching children to read | in + 領域、as + 角色、年數兩種寫法 | adapted | adapted | 「five years of experience in」的組合是套用 |
| interview-current | [OALD work](https://www.oxfordlearnersdictionaries.com/us/definition/english/work_1)：She works for an engineering company。[OALD currently](https://www.oxfordlearnersdictionaries.com/us/definition/english/currently)：at the present time。[OALD build](https://www.oxfordlearnersdictionaries.com/us/definition/english/build_1)：We build computer systems for large companies。[OALD at](https://www.oxfordlearnersdictionaries.com/us/definition/english/at)：used to say where somebody works or studies; He's been at the bank… | work for + 公司；at 表工作地點 | adapted | adapted | work at + 公司 沒有直接例句（at 的例句動詞是 be）；AI customer service tools 是自寫 |
| interview-owned | [OALD responsible](https://www.oxfordlearnersdictionaries.com/us/definition/english/responsible)：responsible for doing something Mike is responsible for designing the entire project。[OALD design](https://www.oxfordlearnersdictionaries.com/us/definition/english/design_2)：He designed and built his own house | responsible for + V-ing；design and build 並列 | adapted | adapted | feature 當受詞是套用。[implement](https://www.oxfordlearnersdictionaries.com/us/definition/english/implement_1) 標 formal，例句只有 changes/decisions/policies，未用於主句 |
| interview-result | [OALD reduce](https://www.oxfordlearnersdictionaries.com/us/definition/english/reduce)：The number of employees was reduced from 40 to 25；Costs have been reduced by 20%。[OALD under](https://www.oxfordlearnersdictionaries.com/us/definition/english/under_1)：less than; an annual income of under £20 000 | from A to B、by、under | adapted | adapted | response time 的技術用語未另查；數字是假設 |
| interview-hardest | [OALD part](https://www.oxfordlearnersdictionaries.com/us/definition/english/part_1)：The worst part was having to wait three hours in the rain；I gave up once I got to the hard part。[OALD migrate](https://www.oxfordlearnersdictionaries.com/us/definition/english/migrate)：(computing) to move programs or hardware from one computer system to another。[OALD downtime](https://www.oxfordlearnersdictionaries.com/us/definition/english/downtime) | the … part was + V-ing；migrate 與 downtime 的電腦義 | adapted | adapted | hardest 最高級是套用；migrate 的受詞是 programs or hardware，接 data 是套用；without downtime 無例句 |
| interview-underestimate | [OALD underestimate](https://www.oxfordlearnersdictionaries.com/us/definition/english/underestimate_1)：underestimate what, how, etc… We underestimated how long it would take | underestimate how + 子句 | adapted（swap 句與原句只差主詞） | adapted | how complex it was 是套用 |
| interview-disagree | [OALD disagree](https://www.oxfordlearnersdictionaries.com/us/definition/english/disagree)：I must respectfully disagree with my colleague；Victoria and I obviously disagree on this issue。[OALD decision](https://www.oxfordlearnersdictionaries.com/us/definition/english/decision)：Who made the decision to go ahead with the project? | disagree with 人／on 主題、make a decision | adapted | adapted | used data to make the decision 是自寫 |
| interview-since | [OALD since](https://www.oxfordlearnersdictionaries.com/us/definition/english/since_1)：(used with the present perfect or past perfect tense)… That was years ago. I've changed jobs since then。[OALD before](https://www.oxfordlearnersdictionaries.com/us/definition/english/before_2)：Do it before you forget | since then + 現在完成式；before + 子句 | adapted | adapted | 文章與卡片只寫「這裡用現在完成式」，沒有宣稱 I always write 不可用 |
| interview-ask-team | [OALD divide](https://www.oxfordlearnersdictionaries.com/us/definition/english/divide_1)：We divided the work between us；Profits were divided up among the staff。[The Muse](https://www.themuse.com/advice/51-interview-questions-you-should-be-asking)：40. Can you tell me about the team I'll be working with? | divide (up) the work；面試可問團隊 | adapted | adapted（Muse 有同類問題，非同一句） | 「How does the team divide up the work?」整句無來源原文 |
| interview-ask-team 替代句 | The Muse 第 40 題 | 原句 | direct | direct | 無 |
| interview-ask-goals | The Muse：18. What are the most important things you'd like to see someone accomplish in the first 30, 60, and 90 days on the job?。[OALD role](https://www.oxfordlearnersdictionaries.com/us/definition/english/role)、[OALD goal](https://www.oxfordlearnersdictionaries.com/us/definition/english/goal) | 問到職初期的期待；role／goal 字義 | adapted | adapted（Muse 有同類問題） | goals for this role 的搭配無例句 |
| interview-ask-goals 替代句 | The Muse 第 18 題 | 原句 | direct | direct | 無 |

The Muse 是商業求職網站，不是語言教材；用來支持「面試時有人建議問這類問題」，不支持語法或常見度。

## 仍待核對（未放進練習卡）

- implement a feature 在口語是否通用
- zero downtime 與 without downtime
- 面試回答的整體結構（未查面試教材）
- 常見度比較：未做語料庫查詢

## 範圍聲明

只核對到字義與句型層級；情境層只有反問面試官兩句有求職網站示範。沒有母語者測試、沒有語料頻率查詢。句子內的經歷與數字皆為假設值。

## 2026-10-08 更新：範例值換成真實內容

使用者同意後，五張含範例值的卡換成去識別化的真實內容，並改用新 id（舊卡的熟悉度不沿用）：

| 舊 id | 新 id | 新英文 | 內容出處 |
| --- | --- | --- | --- |
| interview-years | interview-experience-in | I have experience in RAG pipelines, context engineering, and agent memory systems. | 使用者履歷筆記的自述；真實年資未知，所以不講年數 |
| interview-owned | interview-owned-memory | I was responsible for designing and building the agent's memory feature. | 記憶功能是使用者從頭做的；整個產品是既有的，不能用 build |
| interview-result | interview-limit-cut | We reduced the attachment limit from 100 MB to 10 MB. | 使用者面試筆記：附件上限由 100 MB 收到 10 MB |
| interview-hardest | interview-hardest-silent | The hardest part was finding a bug that produced no errors and no logs. | 使用者面試筆記：一個零錯誤、零 log 的 bug |
| interview-since | interview-since-flag | Since then, I've always checked every place that writes a flag before I change its meaning. | 使用者面試筆記的教訓：改語意要檢查所有寫入端 |

句型依據不變（OALD experience、responsible、design、reduce、part、since）。migrate、downtime、under 三個詞條不再使用。文章兩個語言版本同步更新。
