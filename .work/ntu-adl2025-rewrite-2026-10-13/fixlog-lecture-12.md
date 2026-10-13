# 修改紀錄：ADL 2025 第 12 堂 Reasoning

- 日期：2026-10-13
- 依據報告：`review2-lecture-12.md`（必修 2、建議 10；S10 另含 6 個小項）
- 檔案：`src/content/posts/ai/2026-09-30-ntu-adl2025-reasoning.md`（zh）、`…-reasoning-en.md`（en）
- 查證方式：報告每一項都回來源看過。投影片畫面用審稿者留下的擷圖 `scratchpad/review2-12/`（逐張用 Read 看圖），投影片 14 另外擷了一張 `scratchpad/fix-12/f3_0640.png`；口述部分查 `transcripts/12.*.txt`。
- 檢查結果：`check-course-titles.mjs` 0 issue；`check-course-guide-layout.mjs` 0 issue；`scripts/check-course-videos.mjs` OK。
- 沒有 commit。

## 必修

### M1 Gemini 例題的字是「深」——已改

依據：12.4 投影片 29（01:10，`f4_0110.png`）。題目整句、字頻、6! = 720、120 + 120 = 240、480、紅字 "Let's refine the slotting:"、4! × P(5, 2) = 24 × 20 = 480、Consistency Check 都在圖上。逐字稿 12.4 00:54「身字」是同音錯字。

| | 改前 | 改後 |
|---|---|---|
| zh 題目 | 老師拿自己問 Gemini 的一題排列組合當例子：「恰有兩個『生』字相鄰」的排法有幾種。 | 老師拿自己問 Gemini 的一題排列組合當例子。投影片上的題目是：把「庭院深深深幾許」七個字任意排成一直線，恰有兩個「深」字相鄰的排法有幾種。 |
| zh 三個條列 | 「生」 | 「深」（三處） |
| zh 說明句 | 影片沒有唸出完整題目。從 6! 這個數字反推，題目應該是三個相同的字加上四個相異的字，我照這個假設把兩種算法補完： | 七個字是三個「深」加上庭、院、幾、許四個相異的字。投影片上兩種算法的數字如下，括號裡的說明是我補的： |
| zh 綁定法 | …（「塊＋生」與「生＋塊」），所以要扣 240，得到 480。 | …（「塊＋深」與「深＋塊」），投影片寫成 120 + 120 = 240，扣掉後得到 480。 |
| zh 插空法 | 「兩個生的塊」與「單獨的生」…有 5 × 4 = 20 種放法。 | 「兩個深的塊」與「單獨的深」…有 P(5, 2) = 5 × 4 = 20 種放法。 |
| en question | Her example is a permutation question she asked Gemini: how many arrangements have exactly two of the character 「生」 (shēng) adjacent. | Her example is a permutation question she asked Gemini. The slide shows it in full: arrange the seven characters of 「庭院深深深幾許」 in a line; how many arrangements have exactly two of the character 「深」 (shēn) adjacent? |
| en bullets | 「生」 | 「深」 |
| en note | The video does not read out the full question. Working back from 6!, it should be three identical characters plus four distinct ones, and under that assumption I filled in both calculations: | The seven characters are three 「深」 plus four distinct ones. The numbers for both methods are on the slide; the explanations in parentheses are mine: |
| en gluing | …, so subtract 240 to get 480. | …, which the slide writes as 120 + 120 = 240; subtracting gives 480. |
| en gap | …in 5 × 4 = 20 ways. | …in P(5, 2) = 5 × 4 = 20 ways. |

連帶：範圍卡 `scope-lecture-12.md` 的「480 的兩種算法由本文補完」已改。

### M2 「底座模型」——已改

依據：12.4 投影片 38（`f4_1335.png`），三組是 Llama-3.1-8B-Instruct、Llama-3.1-70B-Instruct、Llama-3.3-70B-Instruct。

- zh 改前：投影片的表比較了三個底座模型在 MATH-500、AMC23、AIME24 上的結果
- zh 改後：投影片的表比較了三個模型（Llama-3.1-8B、Llama-3.1-70B、Llama-3.3-70B）在 MATH-500、AMC23、AIME24 上的結果
- en 改前：The table on the slide compares three base models on MATH-500, AMC23, and AIME24:
- en 改後：The table on the slide compares three models (Llama-3.1-8B, Llama-3.1-70B, Llama-3.3-70B) on MATH-500, AMC23, and AIME24:

## 建議

### S1 Long CoT survey 出處——已改

依據：12.2 投影片 10（09:10，`f2_0910.png`），標題「(Chen+, 2025)」，頁尾印完整篇名。

- zh 改前：（她沒有唸出篇名，從描述看是[這一篇](…2503.09567)）
- zh 改後：（投影片註明是 Chen 等 2025 的 [Towards Reasoning Era](…2503.09567)）
- en 改前：(she does not read out its title; from her description it is [this one](…))
- en 改後：(the slide credits Chen et al., 2025, [Towards Reasoning Era](…))

### S2 平行對循序的分析出處——已改

依據：12.3 投影片 23（23:40，`f3_2340.png`），頁尾 Snell et al. 2024；橫軸 Number of Generations，2⁰、2¹ 四條線幾乎重疊，之後才拉開。

- zh 改前：老師引的一篇分析比較了兩者：在相同運算資源、數學這類較難的題目上，不論最後用多數決還是用 reward model 加權，循序修改都比平行抽樣好。
- zh 改後：老師引的分析（投影片註明是 Snell 等 2024）比較了兩者：在相同的生成次數、數學這類較難的題目上，生成次數多了以後，不論最後用多數決還是用 reward model 加權，循序修改都比平行抽樣好。
- en 改前：An analysis she cites compares the two. With the same compute, on harder problems such as math, sequential revision beats parallel sampling whether the final choice uses majority voting or reward-model weighting.
- en 改後：An analysis she cites (credited on the slide to Snell et al., 2024) compares the two. With the same number of generations, on harder problems such as math, sequential revision beats parallel sampling once the number of generations grows, whether the final choice uses majority voting or reward-model weighting.

### S3 PRM 比 ORM 好「6%」——已改

依據：12.3 投影片 19（17:50，`f3_1750.png`），表 ORM 72.4、PRM 78.2、Majority Voting 69.6；口述在逐字稿 12.3 17:58。

- zh 改前：光是這樣，就比 ORM 再好一些，老師口述的差距大約是 6%。
- zh 改後：光是這樣，就比 ORM 再好一些：投影片引的結果是 ORM 72.4%、PRM 78.2%（多數決 69.6%），差將近 6 個百分點。
- en 改前：That alone does somewhat better than ORM; the gap she states is about 6%.
- en 改後：That alone does somewhat better than ORM: the result on the slide is 72.4% for ORM and 78.2% for PRM (69.6% for majority voting), a gap of almost 6 percentage points.

### S4 aha moment 引句——已改

依據：12.5 投影片 43（03:10，`f5_0310.png`）紅字。

- zh 改前：例如「wait, wait, that's an aha moment」。
- zh 改後：例如投影片上的這一句：「Wait, wait. Wait. That's an aha moment I can flag here.」
- en 改前：such as "wait, wait, that's an aha moment."
- en 改後：such as this one on the slide: "Wait, wait. Wait. That's an aha moment I can flag here."

### S5 o1 圖的出處——已改

依據：逐字稿 12.1 03:51「它同時也post了一個blog」；12.1 投影片 4（05:25，`f1_0525.png`）兩張小圖標題 o1 AIME accuracy during training／at test time，沒有印引文。

- zh 改前：（她沒有說出處，從描述看是 OpenAI 介紹 o1 那篇文章裡的圖）
- zh 改後：（老師提到 OpenAI 同時發了一篇文章說明 o1；投影片上的圖標題是 o1 AIME accuracy，沒有另外印出處，對得上那篇文章裡的圖）
- en 改前：(she does not name its source; from her description it is the one in OpenAI's article introducing o1)
- en 改後：(she mentions that OpenAI published an article explaining o1; the chart on the slide is titled "o1 AIME accuracy" with no printed citation, and matches the one in that article)

### S6 「教小孩」的歸屬——已改

依據：逐字稿 12.2 01:17–01:26 作者只說「跟他在教小孩是有點像的」；02:32–02:47「你就跟他講說你這樣錯了，那他下次還是不會啊…需要有一個詳解的過程」是老師接著說的。

- zh 改前：老師轉述作者來台灣分享時的說法：這跟教小孩一樣，只跟他說「你錯了」沒有用，要給他看詳解。
- zh 改後：老師說，作者來台灣分享時提過這個想法跟他教小孩很像。老師的說明是：只跟小孩說「你錯了」，他下次還是不會，要給他看詳解。
- en 改前：She relays what the author said when visiting Taiwan: it is like teaching a child, where "you got it wrong" does not help and a worked solution does.
- en 改後：She says the author, when visiting Taiwan, described the idea as similar to teaching his children. Her own gloss: telling a child "you got it wrong" does not help next time; a worked solution does.

### S7 學習目標——已改（新增一段，放在底本說明之後）

- zh：讀完這一堂要能做五件事：說出 test-time scaling 與 learning to reason 差在哪裡；算 pass@k；用多數決、答案信心、ORM、PRM 各選一次答案；說明為什麼訓練資料不能只留完美的推理；說出 R1-Zero 與 R1 的差別。
- en：After this lecture you should be able to do five things: say how test-time scaling differs from learning to reason; compute pass@k; pick an answer once each with majority voting, answer confidence, an ORM, and a PRM; explain why training data should not keep only perfect reasoning; and state the difference between R1-Zero and R1.

### S8 pass@k 圖與三種選法的出處、五條路徑怎麼來（可選）——已改

依據：12.3 投影片 11（`f3_0220.png`，頁尾 Brown et al. 2024）、投影片 12（`f3_0510.png`，三行各標一篇）、投影片 14（06:40，`fix-12/f3_0640.png`，Decoding step 0 的 top-1 到 top-5 接 Continue greedy decoding）。

- zh 加在「k 越大，pass@k 越高」後：（投影片上的 pass@k 圖註明出自 Brown 等 2024 的 Large Language Monkeys）
- zh「選答案的三種常見做法」後加：（投影片各標了一篇出處：多數決是 Wang 等 2022，答案信心是 Wang 與 Zhou 2024，ORM 是 Cobbe 等 2021）
- zh 蘋果例子後加：這五條路徑在投影片上是把第一個 token 分別取前五名、後面照 greedy 接下去得到的。
- en 對應三處：(the pass@k chart on the slide is credited to Brown et al., 2024, Large Language Monkeys)；(the slide credits one paper for each: Wang et al., 2022 for majority voting; Wang and Zhou, 2024 for answer confidence; Cobbe et al., 2021 for the ORM)；On the slide the five paths come from taking each of the top five first tokens and continuing greedily.
- 沒有補的部分：投影片 17 的 ORM 三個分數（−0.3、0.2、0.7）。報告只列為背景，沒有建議文字，正文也沒有對應的句子可掛。

### S9 R1 最後一次 RL 的 Safety / Helpfulness（可選）——已改

依據：12.5 投影片 44（07:10，`f5_0710.png`）最後一列「RL／Safety / Helpfulness」。

- zh 改前：…回頭重新訓練 base model，最後再做一次 RL。
- zh 改後：…回頭重新訓練 base model，最後再做一次 RL（投影片在這一步標了 safety 與 helpfulness，老師沒有展開）。
- en 改前：…retrain the base model, and run RL once more.
- en 改後：…retrain the base model, and run RL once more (the slide labels this last step with safety and helpfulness; she does not elaborate).
- 自我檢查第 6 題（報告標的 L234）沒有動：答案沒有錯，報告也沒有給建議文字。

### S10 小處

| 小項 | 結果 | 改前 → 改後 | 依據 |
|---|---|---|---|
| S10-1「指令遵循能力夠好的模型」 | 已改（僅 zh，報告註明英文不用改） | 指令遵循能力夠好的模型 → 夠會照指令做的模型 | 用語 |
| S10-2 token 長度數字 | 已改 | zh 段尾加「投影片上，短的回答平均約 656 個 token（中位數 524），長的平均約 2,743 個（中位數 1,497）。」；en 加 "On the slide, short responses average about 656 tokens (median 524) and long ones about 2,743 (median 1,497)." | 12.4 投影片 35（`f4_1030.png`）圖例 656.48／524.00／2743.15／1497.00 |
| S10-3 資料「速度」改「存量」 | 已改 | zh：現在模型用掉資料的速度快要追上人類產生資料的速度 → 現在模型訓練用掉的資料量，快要追上人類累積的公開文字總量；en：the rate at which models consume data is about to catch up with the rate at which people produce it → the amount of data used to train models is about to catch up with the total stock of public human text | 12.1 投影片 3（`f1_0230.png`，Epoch AI：stock of public text 與 dataset sizes）。老師口述（12.1 02:27–02:50）說的是「速度」，改成投影片的量 |
| S10-4 兩條 o1 參考線 | 已改（補第二條） | zh 句尾加「圖上對應的另一條參考線是 o1 用 64 個樣本取共識（約 0.83）」；en 加 "and the chart's second reference line is o1 with consensus over 64 samples (about 0.83)" | 12.5 投影片 42（`f5_0210.png`）圖例 o1-0912-pass@1、o1-0912-cons@64 |
| S10-5「內容核對／Content check」行的措辭 | **不改** | — | 這一行是檢查器解析的固定行：`scripts/check-course-videos.mjs` 第 20 行的正則要求「內容核對：已依(字幕\|影片)核對」／"Content check: verified against the video"。照報告建議改寫會讓檢查失敗；報告自己也寫「如果是檢查器解析的固定行就不要動」。只更新了行內括號裡「對照過哪些投影片」的清單，讓它跟這次的修改一致，固定前綴沒動 |
| S10-6 範圍卡過期 | 已改（只影響 .work） | series.order 15 → 13；「無投影片」→ 註明由影片畫面讀取；自我檢查四題 → 六題；「未能確認」改列已確認的三項 | 文章 frontmatter 與本次看圖結果 |

## 工作規則項目

- 「優化」：中文版沒有出現，不用改。其他中國用語只有 M2 的「底座模型」。
- 英文版講者點名：第一次提到在導言「taught by Yun-Nung (Vivian) Chen」，之後才用 the instructor／she，已符合，沒有動。
- 「常見的誤解／Common misreadings」下沒有 "These are my own summary…" 這句說明，沒有東西可換。
- 粗體：`**ORM（best-of-n）**：` 改成 `**ORM**（best-of-n）：`；`**process reward model（PRM）**：` 改成 `**process reward model**（PRM）：`（僅 zh）。
- 更新紀錄：中英各加一行 2026-10-13，說明這次依投影片畫面修正的內容。

## 沒有處理的範圍

報告「來源外、未驗證」一節（OpenAI 文章的 74／83／93、DeepSeek-R1 論文的 15.6% → 71.0%、arXiv 編號、影片上傳日期、站內連結內容）不在指定來源內，這次沒有查，也沒有改。參考資料清單沒有新增 Snell、Brown、Wang、Cobbe 幾篇的連結：正文只寫投影片上印的作者與年份，arXiv 編號沒有查證。
