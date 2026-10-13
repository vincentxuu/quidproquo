# 獨立審稿報告（第二次）：ADL 2025 第 12 堂 Reasoning

- 審查日期：2026-10-13
- 文章與內容 hash（sha256 前 16 碼）
  - `src/content/posts/ai/2026-09-30-ntu-adl2025-reasoning.md`：`3eba81ce6b3a4854`
  - `src/content/posts/ai/2026-09-30-ntu-adl2025-reasoning-en.md`：`fd73161841fbc31d`
- 來源：`transcripts/12.1.txt`–`12.5.txt` 全文讀過；影片畫面擷取 41 張（`scratchpad/review2-12/`），涵蓋投影片 2–5、7、9–12、14、15、17、19–21、23、24、26、27、29、31、32、35、37–44。
- 審稿者沒有參與本篇撰寫，也沒有修改文章檔案。
- 結論：**必修 2 項、建議 10 項**。事實層只有一處錯（Gemini 例題的字）；其餘數字全部對上投影片或逐字稿。教學結構齊備，只缺一句明示的學習目標。

行號中英相同者只寫一次；不同者分別標示。

---

## 必修

### M1. Gemini 例題的字是「深」，不是「生」；而且投影片上有完整題目與兩種算法

- 位置：zh L141、L143–L145、L148、L150–L151；en 同行號
- 原句（zh L141）：「恰有兩個『生』字相鄰」的排法有幾種。
- 原句（zh L148）：「影片沒有唸出完整題目。從 6! 這個數字反推，題目應該是三個相同的字加上四個相異的字，我照這個假設把兩種算法補完：」
- 來源（12.4 投影片 29，01:10 擷圖 `f4_0110.png`，**實際看圖確認**）：題目整句印在投影片上，「請問『庭院深深深幾許』讓每個字任意排列(直線排列)，恰有2個『深』字相鄰的方法數為何？」。逐字稿 00:54 的「身字」是語音辨識的同音錯字。
- 投影片上 Gemini 的步驟也都看得到：字頻「庭:1 院:1 深:3 幾:1 許:1」；策略一 6! = 720，扣掉 120 + 120 = 240，得 480；策略二 Slotting，4! = 24，中途一行紅字 "Let's refine the slotting:"，5 個空位，4! × P(5, 2) = 24 × 20 = 480；第 9 步 Consistency Check 寫兩種方法都得到 480。
- 影響：文章推測的結構（三同四異）是對的，480 的兩種算法我重算也對；錯的是字，以及「影片沒有完整題目、由本文補完」這個說法。後者把投影片上有的內容寫成作者的假設，也屬於查核歷程留在正文。
- 建議文字（zh）：
  - L141：「老師拿自己問 Gemini 的一題排列組合當例子。投影片上的題目是：把『庭院深深深幾許』七個字任意排成一直線，恰有兩個『深』字相鄰的排法有幾種。模型的思考過程是這樣的：」
  - L143–L145：三處「生」改成「深」。
  - L148：「七個字是三個『深』加上庭、院、幾、許四個相異的字。投影片上兩種算法的數字如下，括號裡的說明是我補的：」
  - L150：「…三個『深』全相鄰的排法是 5! = 120 種，而每一種在綁定法裡被算了兩次（『塊＋深』與『深＋塊』），投影片寫成 120 + 120 = 240，扣掉後得到 480。」
  - L151：「…有 P(5, 2) = 5 × 4 = 20 種放法。24 × 20 = 480。」
- 建議文字（en）：
  - L141: "Her example is a permutation question she asked Gemini. The slide shows it in full: arrange the seven characters of 「庭院深深深幾許」 in a line; how many arrangements have exactly two of the character 「深」 (shēn) adjacent? The model's thinking went like this:"
  - L143–L145: replace 「生」 with 「深」.
  - L148: "The seven characters are three 「深」 plus four distinct ones. The numbers for both methods are on the slide; the explanations in parentheses are mine:"
  - L150: "...each is counted twice by the gluing method (block then single, and single then block), which the slide writes as 120 + 120 = 240; subtracting gives 480."
  - L151: "...in P(5, 2) = 5 × 4 = 20 ways. 24 × 20 = 480."
- 連帶：範圍卡 `scope-lecture-12.md` 的「480 的兩種算法由本文補完」也要改。

### M2. 中文版用了「底座模型」

- 位置：zh L171
- 原句：「投影片的表比較了三個底座模型在 MATH-500、AMC23、AIME24 上的結果」
- 依據：「底座模型／基座模型」是中國用語；同篇 L191、L193 用的是 base model。投影片 38 的三組是 Llama-3.1-8B-Instruct、Llama-3.1-70B-Instruct、Llama-3.3-70B-Instruct（看圖確認）。
- 建議文字（zh）：「投影片的表比較了三個模型（Llama-3.1-8B、Llama-3.1-70B、Llama-3.3-70B）在 MATH-500、AMC23、AIME24 上的結果」
- 建議文字（en，可選，補上模型名）："The table on the slide compares three models (Llama-3.1-8B, Llama-3.1-70B, Llama-3.3-70B) on MATH-500, AMC23, and AIME24"
- 嚴重度說明：這一項不是事實錯誤，列必修是因為專案對中國用語是硬性規則。「底座」是否算中國用語是我的判斷，writing-guide 的替換表裡沒有這個詞。

---

## 建議

### S1. Long CoT survey 的出處投影片上有印，不必寫成推測

- 位置：L63
- 原句：「（她沒有唸出篇名，從描述看是[這一篇](…2503.09567)）」
- 來源（12.2 投影片 10，09:10，看圖確認）：標題「Short CoT vs. Long CoT (Chen+, 2025)」，頁尾印「Chen et al., "Towards Reasoning Era: A Survey of Long Chain-of-Thought for Reasoning Large Language Models", 2025.」三個特徵在圖上的名稱是 Deep Reasoning、Extensive Exploration、Feasible Reflection。
- zh：「老師介紹了一篇整理 long CoT 的 survey（投影片註明是 Chen 等 2025 的 [Towards Reasoning Era](https://arxiv.org/abs/2503.09567)），說 long CoT 多了三個特徵：」
- en: "She introduces a survey of long CoT (the slide credits Chen et al., 2025, [Towards Reasoning Era](https://arxiv.org/abs/2503.09567)) and lists three features that long CoT adds:"

### S2. 平行對循序的那篇分析，投影片有印出處

- 位置：L129
- 原句：「老師引的一篇分析比較了兩者」
- 來源（12.3 投影片 23，23:40，看圖確認）：頁尾「Snell et al., "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters," in 2024.」圖的橫軸是 Number of Generations（2⁰–2⁶），縱軸是 MATH Test Accuracy，四條線是 Sequential／Parallel × Best-of-N Weighted／Majority。
- 補充：圖上 2⁰、2¹ 兩點四條線幾乎重疊，2¹ 的 Sequential Majority 還略低於 Parallel Majority；差距從 2² 之後才拉開。老師口頭說「不管哪一種都是 sequential 比較好」，文章照口述寫沒有錯，只是比圖稍微絕對。
- zh：「老師引的分析（投影片註明是 Snell 等 2024）比較了兩者：在相同的生成次數、數學這類較難的題目上，生成次數多了以後，不論最後用多數決還是用 reward model 加權，循序修改都比平行抽樣好。」
- en: "An analysis she cites (credited on the slide to Snell et al., 2024) compares the two. With the same number of generations, on harder problems such as math, sequential revision beats parallel sampling once the number of generations grows, whether the final choice uses majority voting or reward-model weighting."
- 範圍卡「未能確認：parallel vs sequential 分析的論文名稱」可以結掉。

### S3. PRM 比 ORM 好「6%」：投影片上有數字，單位是百分點

- 位置：L120
- 原句：「老師口述的差距大約是 6%」
- 來源（12.3 投影片 19，17:50，看圖確認）：表「% Solved (Best-of-1860)」ORM 72.4、PRM 78.2、Majority Voting 69.6，頁尾 Lightman et al., "Let's Verify Step by Step," 2023。差 5.8 個百分點。口述在逐字稿 17:58「已經有6%了」。
- zh：「光是這樣，就比 ORM 再好一些：投影片引的結果是 ORM 72.4%、PRM 78.2%（多數決 69.6%），差將近 6 個百分點。」
- en: "That alone does somewhat better than ORM: the result on the slide is 72.4% for ORM and 78.2% for PRM (69.6% for majority voting), a gap of almost 6 percentage points."
- 這也讓 L241「講 PRM 的那張投影片引的就是它」有了看圖依據（已確認）。

### S4. aha moment 的引句和投影片不一樣

- 位置：L187
- 原句：例如「wait, wait, that's an aha moment」
- 來源（12.5 投影片 43，03:10，看圖確認）：紅字是「Wait, wait. Wait. That's an aha moment I can flag here.」
- 契約要求機器逐字稿的說法不加引號當原話；這句是投影片上的字，可以照抄。
- zh：例如「Wait, wait. Wait. That's an aha moment I can flag here.」
- en: such as "Wait, wait. Wait. That's an aha moment I can flag here."

### S5. o1 那張圖「她沒有說出處」說得比來源重

- 位置：L45
- 原句：「（她沒有說出處，從描述看是 OpenAI 介紹 o1 那篇文章裡的圖）」
- 來源：逐字稿 12.1 03:51「它同時也 post 了一個 blog，然後去有點像說明 O1 它的這個概念」，接著 05:16 講這張圖；投影片 4（05:25，看圖確認）標題是「OpenAI o1 thinks longer before it answers (2024 Dec)」，兩張小圖標題是「o1 AIME accuracy during training／at test time」，縱軸 pass@1 accuracy，橫軸 train-time／test-time compute (log scale)。投影片上沒有印引文。
- zh：「（老師提到 OpenAI 同時發了一篇文章說明 o1；投影片上的圖標題是 o1 AIME accuracy，沒有另外印出處，對得上那篇文章裡的圖）」
- en: "(she mentions that OpenAI published an article explaining o1; the chart on the slide is titled 'o1 AIME accuracy' with no printed citation, and matches the one in that article)"

### S6. 「教小孩」那段把老師自己的解釋也歸給作者

- 位置：L55 最後一句
- 原句：「老師轉述作者來台灣分享時的說法：這跟教小孩一樣，只跟他說『你錯了』沒有用，要給他看詳解。」
- 來源：逐字稿 12.2 01:17–01:26，作者分享的只有「這裡面的概念就跟他在教小孩是有點像的」；02:29–02:50「你就跟他講說你這樣錯了，那他下次還是不會啊…需要有一個詳解的過程」是老師接著做的說明，逐字稿看不出是作者原話。
- zh：「老師說，作者來台灣分享時提過這個想法跟他教小孩很像。老師的說明是：只跟小孩說『你錯了』，他下次還是不會，要給他看詳解。」
- en: "She says the author, when visiting Taiwan, described the idea as similar to teaching his children. Her own gloss: telling a child 'you got it wrong' does not help next time; a worked solution does."

### S7. 正文沒有一句明示的學習目標

- 位置：L33–L35 導言
- 現況：導言只有主問題（「模型怎麼學會先想再答，而且想得對？」）。同系列的第 9、11 堂在導言都有一句「讀完這一堂要能做四件事：…」。範圍卡已經寫好「讀完能做」，只是沒有進正文。
- zh（放在 L35 之前或之後）：「讀完這一堂要能做五件事：說出 test-time scaling 與 learning to reason 差在哪裡；算 pass@k；用多數決、答案信心、ORM、PRM 各選一次答案；說明為什麼訓練資料不能只留完美的推理；說出 R1-Zero 與 R1 的差別。」
- en: "After this lecture you should be able to do five things: say how test-time scaling differs from learning to reason; compute pass@k; pick an answer once each with majority voting, answer confidence, an ORM, and a PRM; explain why training data should not keep only perfect reasoning; and state the difference between R1-Zero and R1."

### S8. 選答案三種方法與 pass@k 圖的出處可以補（可選）

- 位置：L77–L86
- 來源（看圖確認）：投影片 11 的 pass@k 圖頁尾是 Brown et al., "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling," 2024（橫軸到 10⁴ 個樣本，對得上老師說的上百上千次）。投影片 12 列出 Majority vote / self-consistency (Wang et al., 2022)、Answer confidence in CoT decoding (Wang and Zhou, 2024)、Outcome reward model for selection (Cobbe et al., 2021)。投影片 17 的 ORM 例子三個分數是 −0.3、0.2、0.7。
- 一個細節：投影片 14 那五條路徑是「第一個 token 取 top-1 到 top-5，後面接 greedy decoding」得到的（圖上寫 Decoding step 0、Continue greedy decoding），不是調高 temperature 抽出來的；老師口頭說的是「sample 這麼多次」。文章寫「五條路徑」沒有錯，要不要補這一句由作者決定。表頭是「GSM8K (top-100)」。
- zh（L85 可加）：「這五條路徑在投影片上是把第一個 token 分別取前五名、後面照 greedy 接下去得到的。」
- en: "On the slide the five paths come from taking each of the top five first tokens and continuing greedily."

### S9. R1 最後一次 RL，投影片另外標了 Safety / Helpfulness（可選）

- 位置：L193、L234
- 來源（12.5 投影片 44，07:10，看圖確認）：五列依序是 v3-base →（Accuracy as reward in RL）→ R1-Zero；v3-base ＋「data filtering poor readability and mixed languages」→ Model A；Model A →（Accuracy + Language Coherence as reward in RL）→ Model B；v3-base ＋「data covering more domains and filtering with ORM and readability」→ Model C；Model C →（RL，Safety / Helpfulness）→ DeepSeek-R1。老師口頭沒有提 safety／helpfulness。
- 文章三個步驟與這張圖一致。要補的話：
- zh：「…回頭重新訓練 base model，最後再做一次 RL（投影片在這一步標了 safety 與 helpfulness，老師沒有展開）。」
- en: "...retrain the base model, and run RL once more (the slide labels this last step with safety and helpfulness; she does not elaborate)."

### S10. 小處

- L57「指令遵循能力夠好的模型」：直譯腔，建議「夠會照指令做的模型」。英文不用改。
- L165 可補投影片 35 的數字（看圖確認）：short 的平均 656、中位數 524 個 token；long 的平均 2,743、中位數 1,497。zh：「投影片上，短的回答平均約 656 個 token，長的平均約 2,743 個。」en: "On the slide, short responses average about 656 tokens and long ones about 2,743."
- L41「模型用掉資料的速度快要追上人類產生資料的速度」：照老師口述，沒有錯。投影片 3（Epoch AI）畫的其實是「訓練資料集的大小」追上「人類公開文字的存量」，是存量不是速度。可改成「模型訓練用掉的資料量，快要追上人類累積的公開文字總量」；en: "the amount of data used to train models is about to catch up with the total stock of public human text."
- L187「接近圖上作為參考線的 o1」：圖上有兩條參考線，o1-0912-pass@1（約 0.74）與 o1-0912-cons@64（約 0.83）。文章只提第一條，數字正確。
- en L268 "Content check: verified against the video transcript" 後面接「沒有字幕」讀起來有點矛盾，建議 "Content check (2026-10-13): written from speech-recognition transcripts of the audio…"；中文同一行「已依影片核對」同理。如果這一行是檢查器解析的固定行就不要動，我沒有查檢查器。
- 範圍卡過期：series.order 寫 15（文章是 13）、「無投影片…72%、6% 皆口述」、「自我檢查四題」（文章六題）。只影響 .work。

---

## 無誤確認

### 實際對過影片畫面的項目

| 文章內容 | 位置 | 來源 |
|---|---|---|
| CoT 範例「5 顆球、2 罐每罐 3 顆、5 + 6 = 11」；CoT 是 2022 年 | L53、L55 | 12.2 投影片 7（Wei+, 2022） |
| zero-shot CoT「Let's think step by step」 | L57 | 投影片 9 |
| self-consistency 是多數決的別名 | L84 | 投影片 12 |
| 蘋果題英文句、三條答 5 兩條答 8、選 8 | L85 | 12.3 投影片 14 |
| GSM8K 44.0／37.0／51.0／72.0 | L85 | 投影片 14 的表，四個數字全對 |
| 橫軸用產生的 token 數；多數決在 pass@1 與 pass@k 之間；ORM 高於多數決；PRM 又高於 ORM | L88、L120 | 投影片 15、20（Llama 3.1 8B-Instruct，MATH） |
| beam search 一開始四條 | L121 | 投影片 21 |
| nudging agent：先分析、判 positive／negative、negative 才給建議；出處 Yen-Ting Lin 2025 博士論文 | L133 | 投影片 24、26、27 |
| Step-KTO 表：MATH-500、AMC23、AIME24；8B 的 MATH-500 pass@1 是 53.8／60.6／63.2 | L171 | 12.4 投影片 38 |
| 「多數欄位高於 KTO」：18 格裡 16 格高、2 格平手（8B 的 AIME24 兩欄），沒有一格低。對 rejection 是 18 格全高 | L171 | 同上，逐格比過 |
| 蒸餾到 Qwen、Llama | L175 | 投影片 39 |
| 「我很急」與「仔細想」兩種指令 | L181 | 投影片 40 |
| R1-Zero 曲線：pass@1 約 0.15 起、到 0.7 左右；cons@16 後期 0.8 以上；o1 pass@1 約 0.74 | L187 | 12.5 投影片 42 |
| R1 三個步驟、language coherence | L191–L193 | 投影片 44 |
| o1 圖兩張小圖的軸；「2024 Dec」 | L45、L49 | 12.1 投影片 4 |

### 實際對過逐字稿的項目

inference 與 reasoning 的區分（12.1 00:00–00:40）；進步趨緩與資料用完（01:20–03:26）；o1 藏 token、API 照計費（04:33–05:12）；舉的模型（08:01–08:22）；`<think>` 與三種策略（08:47–09:57）；接龍的解釋與追上專用模型（12.2 01:55–04:26）；zero-shot 當基準（06:25–07:04）；reasoning path 的說法（07:20–07:43）；long CoT 收合與摘要（08:36–08:53）；DFS／BFS／reflection（09:43–11:07）；pass@k 與弱模型要抽上百上千次（12.3 01:42–02:55）；upper bound（03:13、07:49）；三種選法（03:50–05:18）；verifier 的訓練（10:39–12:12）；PRM 兩階段（17:18–20:41）；sequential revision 與 take-away（21:43–24:34）；nudging agent（24:44–29:12）；Gemini 例子的流程與語言（12.4 00:43–02:57）；資料三來源與只留完美資料的陷阱（03:42–09:10）；SFT 後長度分布右移（10:02–11:03）；DPO／KTO 與 Step-KTO（11:30–14:05）；蒸餾與限制（14:28–16:33）；延遲與成本（17:47–18:20）；R1-Zero（12.5 00:00–03:29）；「大概才 0.1%」的口誤（01:59）；R1 流程（03:37–07:35）；數學與程式（10:29–12:07）。以上轉述都對得上，沒有把老師沒說的話寫成老師說的（S6 那一句除外）。

### 重算

- 五個樣本的表：答 5 的平均 (0.40 + 0.45 + 0.35) ÷ 3 = 0.40；答 8 的平均 1.75 ÷ 2 = 0.875。PRM 平均 A 0.467、B 0.500、C 0.433、D 0.867、E 0.833。全對。
- pass@5 = 1 − 0.7⁵ = 0.83193。對。
- 第 2 題：pass@3 = 0.875；多數決 3 × 0.25 × 0.5 + 0.125 = 0.5。對，假設也寫明了。
- 第 5 題：0.85 ÷ 2 = 0.425；2.10 ÷ 3 = 0.70。對。
- 「庭院深深深幾許」：綁定法 720 − 240 = 480；插空法 24 × 20 = 480。對。

### 自我檢查與常見誤解

- 六題答案都正確。第 1、3、4、6 題可由正文推得（依序對應 L137 與 L80、L163–L171、L116–L121、L187–L195）；第 2、5 題是計算題，已重算。
- 四條常見誤解都有正文依據（L137、L80、L163、L177），寫成本文的說明，沒有冒充老師說法。

### 契約

- 標題：中英都符合格式，`check-course-titles.mjs` 兩個檔 0 issue。
- 機制、完整例子（條件、計算、結果、意義四項都有）、常見誤解、附答案的自我檢查：齊備。學習目標見 S7。
- 查核歷程：L35 的底本說明、L49 的日期補充、L187 的口誤說明屬於契約允許的來源衝突與歸因。L148 見 M1；L45、L63 見 S5、S1。
- 自編例子有標示（L92 標題與 L94 首句、L90、L201）。

### 中英對照

逐段比過，兩版段落、表格、數字、公式、題數一致，沒有漏譯或誤譯。英文版多的只有 L33「taught by Yun-Nung (Vivian) Chen」、L35「in Mandarin」、L141 的拼音、參考資料的「(lectures in Mandarin)」，都是必要補充。英文版第一次提到講者是 L33 的全名，L35 之後才用 the instructor／she。M1 的「生」在英文版同樣出現，拼音也要從 shēng 改成 shēn。

### 中國用語與粗體

- 掃過質量、信息、視頻、默認、反饋、優化、技術棧、窗口、數據、軟件、用戶、文檔、代碼、調用、智能體等，除 M2 外沒有命中。「算法」在 L112、L146、L148 是「計算方式」的意思，不是 algorithm，不算。
- 粗體：用腳本檢查了中文版每一組 `**…**` 的前後字元，沒有「結尾是全形標點、後面直接接中文字」的情況。`**ORM（best-of-n）**：`、`**process reward model（PRM）**：` 後面接的是全形冒號，會正常渲染。我沒有看實際渲染的頁面。

---

## 來源外、未驗證

以下不在指定來源內，我沒有查：

- OpenAI 文章的 74%／83%／93% 與 2024-09-12（L49、L90、L283）；o1 正式版在 2024 年 12 月推出（L49）。
- DeepSeek-R1 論文的 15.6% → 71.0%（L187）。
- 各 arXiv 編號與標題是否對應（L53、L57、L63、L171、L185、L241、L284–L289）。其中 survey、Let's Verify、Step-KTO、DeepSeek-R1 的標題與投影片頁尾一致，編號沒查。
- 影片網址、上傳日期 2025-11-20、說明欄日期與「投影片借自李宏毅老師」（L242、L268）、課程頁 12/01。
- 站內連結：只確認了目標檔案存在（cs224n 兩篇、cme295 兩篇、ntu-ml2026 總覽、ADL 第 7、9、11、13 堂，中英都在），沒有看內容是否如連結文字所述。
- 文章沒有寫影片長度。
