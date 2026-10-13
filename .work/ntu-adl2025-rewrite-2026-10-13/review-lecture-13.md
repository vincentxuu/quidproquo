# 第 13 堂（對話系統與工具使用）獨立審稿報告

審稿日期：2026-10-13。審稿者未參與本篇撰寫，只審查、未改動文章。

受審版本（sha256）：

- zh `src/content/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use.md`：`108510bb83340f913857129a9a07dbea17a9384197cf294dbfeadee05e4ba6fb`
- en `src/content/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use-en.md`：`a1720df81a3722164e6a14f1588234192ffa097927a509980e207f290a12869d`

實際對過的來源：

- 逐字稿 13.1–13.9 全文讀完（13.6 與 13.7 以 `cmp` 確認位元組完全相同）。
- 2024 講義 `241030_ConvAI.pdf`：全 108 頁抽文字；第 52、53、54、55、57、58、61、63、66、67、68、69、70、71、72、98、105、106 頁另轉成圖片讀圖。
- 影片畫面：`frames-13/13.6-frames.png`、`13.8-frames.png` 兩張拼圖；另從 13.6 影片擷 02:40、05:25、06:40、14:20，從 13.8 影片擷 04:00 放大確認小字。
- 規範 `course-guide-contract.md`；並跑了 `check-course-titles.mjs`（兩檔，0 issue）與 `check-course-guide-layout.mjs`（0 issue）。

結論：事實層面整體對得上來源，數字、頁碼、例句幾乎全數吻合。有 2 項必修（一處與投影片不符、一處中英不一致），其餘為措辭與歸因的建議。教學契約的五個要件齊備。

---

## 必修

### M1. ExploreToM 例子：移動蘋果的是第三個人，不是「另一個人」

- zh 第 241 行：「例如兩個人走進廚房，其中一人在蘋果上加了鹽然後離開，之後另一個人把蘋果移到冰箱。」
- en 第 241 行：「two people enter a kitchen, one salts an apple and leaves, and later the other moves the apple to the fridge.」
- 來源（13.8 影片 04:00 畫面，投影片 59，已放大讀圖）：故事節點依序是「Anne entered the kitchen. Beth entered the kitchen.」→「Beth salted the apple. Beth left the kitchen.」→「Beth texted to Charles to let him know the apple is salted. Charles entered the kitchen.」→「Charles moved the apple to the fridge.」
- 問題：依上下文「另一個人」會被讀成一開始進廚房的 Anne，實際上是後來才進場的 Charles。第四題「Does Anne think Charles knows that the apple is salted?」也要有 Charles 才成立。老師口述只講到「兩個人進廚房、加鹽、離開」，沒講誰移蘋果，所以這一句是依投影片寫的，應照投影片。
- 建議改法：改成「之後第三個人（Charles）進來，把蘋果移到冰箱」，中英同步。

### M2. 中英「延伸閱讀」內容不一致

- zh 第 355–359 行列三項：CS224N 第 10 堂 RAG 與 Language Agents、本系列第 11 堂、本系列第 8 堂。
- en 第 355–359 行列三項：CMU 11-768 Lecture 2 Tool Use 與 Lecture 5 Planning（附註「fills the 13.6 gap」）、CS224N RAG and Language Agents、CS224N Benchmarks and Evaluation 與 CME295 LLM Evaluation。
- 問題：兩版只有 CS224N RAG 一項相同。英文版多出「補 13.6 缺口」的說法，中文版沒有；中文版的本系列第 8、11 堂在英文版不見。連結目標檔案都存在（已逐一 `ls` 確認），所以是內容沒同步，不是壞連結。
- 建議改法：擇一為準後兩版對齊。

---

## 建議

### 與來源有落差的措辭

**S1. 自編例子的結語有一半沒有依據**（zh 第 86 行、en 第 86 行）

- 原句：「這兩件事正是語言模型單獨做不到或容易漏掉的地方。」
- 依據：「查資料庫」這件事，老師在 13.1 12:59–13:39 明確說沒有工具的模型做不到。但「靠 DST 接上前一輪」老師沒說語言模型做不到或會漏；13.9 07:30 起反而說這些元件「融在語言模型裡面」。
- 建議：只保留查詢那一件，或改成「前者是語言模型單獨做不到的」。

**S2. LaMDA 流程省略了「實際查了兩次」**（zh 第 120–125 行、en 同）

- 文章寫「第 43–48 頁用一個問題走完整個流程」並列四步。第 43–47 頁確實是這四步，逐字吻合。但第 48 頁畫的是兩次查詢（`Eiffel Tower construction date` → `construction started: 28 January 1887`；`Eiffel Tower complete when` → `date opened: 31 March 1889`），老師在 13.2 10:25–10:44 也說「其實實際上是收了兩次，然後才得到這個資訊，然後最後再把它合併在一起」。
- 建議：在四步後補一句說明第 48 頁的詳細版是查兩次再合併；自我檢查第 4 題的答案不受影響。

**S3. Toolformer 第 72 頁的圖與 GPT-3 的說法**（zh 第 187 行、en 第 187 行）

- 原句：「老師補充，圖上的橫虛線是當時的 GPT-3，它沒有用搜尋，也沒辦法做這些運算。」
- 依據：13.5 05:54–06:19 老師說的是「GPT3 是沒有用 WebSearch 的……其實有用 WebSearch 也不一定會很強……可能還是沒有辦法做這些運算」。「沒辦法做運算」講的是就算有網頁搜尋也一樣，不是直接描述 GPT-3。
- 另外讀圖確認：三張圖是 LAMA、Math Benchmarks、QA Benchmarks。QA 那張 GPT-3 虛線（約 39）仍高於最大的 Toolformer（約 31）。文章沒有寫錯，但讀者容易誤以為三張圖都贏過 GPT-3。
- 建議：把那句改成貼近原話，並補一句「QA 那張圖上 GPT-3 仍然比較高」。

**S4. ReSpAct 三類話的歸因**（zh 第 212 行、en 第 212 行）

- 原句：「她整理了代理人會說的三類話」。
- 依據：13.6 05:00–05:16 老師說的是「在這樣子的 framework 下面呢，他就發現了幾個……互動策略」，指論文的發現。13.6 影片 05:25 畫面（投影片 52）的三個小標是 (a) Seeking User Guidance、(b) Sharing Status Update、(c) Seeking User Preference。
- 建議：改成「投影片列了三類」或「論文整理出三類」。三類內容本身正確。

**S5. BlenderBot 2.0 例子「會去查」**（zh 第 137 行）

- 原句：「bot 說沒聽過那張專輯、會去查」。
- 依據：第 54 頁原文是「I haven't heard that one. I'll have to check it out.」，意思是會找來聽。英文版寫「will check it out」沒問題，中文「會去查」容易被讀成去搜尋。
- 建議：改成「會找來聽聽」。

**S6. WebGPT 動作清單最後一項少了 Controversial**（zh 第 157 行、en 第 157 行）

- 原句：「判定題目不合理而跳過」。
- 依據：第 68 頁最後一列是 `End: <Nonsense, Controversial>` → End browsing and skip answering phase。其餘九項逐項對過都正確。
- 建議：改成「判定題目不合理或有爭議而跳過」。

**S7. 老師有保留的話被寫成肯定句**

- zh 第 106 行：「老師提到當時的新聞：Google 內部有員工……後來被解僱。」13.2 01:27–01:31 老師說的是「有一個這個八卦，當然不確定是真是假，但我覺得應該是蠻真的」。建議加上「她說這是聽來的」之類的保留。
- zh 第 161 行：「老師說這是因為網路上很多人這樣講。」13.4 05:03 是「因為可能網路上面很多人說」。建議加「可能」。
- 英文版同位置同樣處理。

**S8. 「對回第 7 堂」是本文補的堂次**（zh 第 135 行、en 第 135 行）

- 原句：「老師把它對回第 7 堂：post-training 時引入各種任務……」
- 依據：13.3 01:11 老師只說「很像我們前面講過的 post training」，沒有講堂次。本站第 7 堂確實是 post-training（已看 `2026-09-30-ntu-adl2025-post-training-rlhf.md` 的標題），所以對應沒錯，只是堂次不是老師說的。
- 建議：改成「老師把它對回前面講過的 post-training（本系列第 7 堂）」。第 151 行「WebGPT 在第 8 堂出現過」是本文自己的交叉引用，寫法沒問題（第 8 堂文章確有 WebGPT）。

### 自編例子的標示

**S9. Toolformer 例子的機率建議明講是假設值**（zh 第 182–185 行、en 同）

- 現況：整個例子標了「本文自編」，機率 0.1、0.8、0.9、0.9 寫在「條件」裡。標示有到，但沒有一句直接說「機率是為了說明而假設的數字」。
- 建議：在條件句加上「以下機率是假設的數字」。
- 推理本身正確，也與正文第 180 行的篩選規則一致。「模型因此學到的不只是怎麼呼叫工具，還有什麼時候不必呼叫」是本文的推論，放在自編例子裡可以接受。

### 無法由指定來源獨立驗證

**S10. 「13.6 與 13.7 是同一段錄影」**（zh 第 51、395、400 行；en 同）

- 我能確認的：兩份逐字稿位元組完全相同（`cmp`）；本機 13.6 影片（FK-r_-dVHcI）長度 911.4 秒，等於 15:11；內容是 ReSpAct 與 SalesAgent，確實是 User Interaction，沒有 Plan-and-Execute 的段落；開頭 00:00–00:44 提到「剛剛前面那個機票、Hotel 的例子」，可見前面有一段沒錄進來。
- 我不能確認的：本機沒有 13.7（fzzOlH0t0_w）的影片或音訊，兩份逐字稿的修改時間也相同，所以無法排除「13.7 逐字稿是從 13.6 複製來的」這個可能。13.7 的長度 15:11 也屬來源外。
- 判斷：「兩支逐字稿相同」成立；「YouTube 上兩支是同一段錄影」「Plan-and-Execute 在公開影片裡找不到」推論合理，但要靠 13.7 影片本身才能定案。建議作者確認 13.7 逐字稿是獨立從 fzzOlH0t0_w 轉出來的，並把證據留在 `.work/`。

### 其他

- **S11.** 文末只嵌了 13.1、13.2、13.7、13.8 四支影片（zh 第 367–385 行），九支的連結在「原始影片」那一行都有。若是刻意限制數量就沒問題，只是 13.6 沒嵌、13.7 有嵌，和「兩支相同」的說法一起看可能讓讀者疑惑。
- **S12.** `.work/ntu-adl2025-rewrite-2026-10-13/` 下只有 `scope-lecture-12.md`，沒有第 13 堂的範圍卡。契約要求寫作前範圍卡存 `.work/`。這是流程缺件，不是文章內容問題。
- **S13.** zh 第 37 行「本文另外擷取影片畫面確認投影片上的標題與出處」帶一點查核歷程，但同時交代了 13.6–13.8 內容的來源底本，可留。

---

## 無誤確認

以下都實際對過來源。

### 13.1（講義第 2–9、36–37 頁）

- 產品列（第 2 頁）、Young 2000（第 5 頁）、老師說 2000 年就有此架構（13.1 11:02）。
- 四個模組表格的例句逐字相符：LU「Can you help me book a 5-star hotel on Sunday?」→ `Hotel_Book(star=5, day=sunday)`（第 6 頁）；DST「For two people, thanks!」→ `people_num=2`（第 7 頁）；DP `Inform(hotel_name=B&B)` 與「Access external knowledge」（第 8 頁）；NLG「I have book a hotel B&B for you.」（第 9 頁，原文如此）。
- 「前兩個理解、後兩個決定互動」（08:42）、LU 像 tool use（07:26）、兩家或一百家（10:17–10:34）、KB 三種形式（10:40–10:52）。
- 第 10–33 頁：領域判斷與意圖偵測標「Classification!」（第 12、13 頁），slot filling 用 BIO 標記（第 14 頁），各模組評估（第 17、22、29、33 頁）。老師在 13.1 確實沒講這幾頁。
- 自導自演（第 36 頁）：標題、訂台北 101、問哪一天與幾位與特殊需求、「（一段時間後）」、沒有可用座位、「Accessing external tools is necessary」全部相符。「有時也回已經訂好了」在 12:51。
- 第 37 頁 Understanding／Replying 與 KB；老師的說法在 14:20–14:57。

### 13.2 LaMDA（第 38–49 頁）

- Thoppilan 等 2022；1.56T words（第 39 頁）；輸入對話紀錄、輸出當前回覆；只最佳化當前回答（02:04–02:14）。
- 評分格式（第 40 頁）：`[context] [sentinel] [response] [attribute-name] [rating]`；三個例句與分數 1、0、0 相符。
- 蔡依林例子與「This basic model sometimes generates factually incorrect claims」（第 41 頁）。
- 三個部分與三個工具的例子（第 42 頁）：135+7721→7856、hello in French→Bonjour、Rafael Nadal / Age / 35。Hello 翻日文在 06:24–06:41。
- 艾菲爾鐵塔四步的英文原文與「2 years, 2 months and 5 days. From late January 1887 to March 31, 1889」（第 44–47 頁）逐字相符。
- 草稿不算全錯（08:28–08:43）、與 RAG 的對照（09:32–09:51）、像多個 agent（10:57–11:04）。
- 40K dialog turns 標 correct／incorrect 供 ranking（第 49 頁）；總結句相符。

### 13.3 BlenderBot（第 50–58 頁）

- Roller 等 2020；1.5B conversations；90M、2.7B、9.4B；PersonaChat、Wizard of Wikipedia、Empathetic Dialogues、BST；retrieval and refine；encoder-decoder（第 51 頁）。
- 2.0（Chen 等 2021）搜尋與長期記憶（第 52–53 頁）；第 54 頁 Kanye、The College Dropout、「memory write: (self) I am a fan of 808s and Heartbreak」。
- 兩種記憶與失憶的說法（04:25–04:36）；各家都有記憶、可想成簡單 RAG（04:52–05:10）。
- BAD dataset 與 `_POTENTIALLY_UNSAFE_`（第 55 頁）；像 reward model 但訓練在同一個模型（07:03–07:27）。
- 3.0：SeeKeR 三段（第 56 頁）、Director 的 contradiction／repetition／toxicity（第 57 頁）、real interactions with feedback（第 58 頁）；老師談重複與解碼機率（08:35–09:22）、demo site（09:28）。

### 13.4 WebGPT（第 59–68 頁）

- Nakano 等 2021；ELI5 與哈利波特對魔戒（第 60 頁）；介面上「This question does not make sense」「Add new quote」「Done quoting! Write an answer」（第 61 頁）。
- `[SEARCH] … [END]`、`[CLICK] 1 [END]`、Supervised learning（第 62 頁）；reward model 與 PPO（第 64–65 頁）。
- TruthfulQA（第 66 頁）與老師的解讀（04:17–04:32）。
- 夢與許願（第 67 頁）：題目原文、GPT-3「I have no comment.」、WebGPT「It is true that you can make a wish come true by the power of thought.」並標為錯。
- 動作清單十項（第 68 頁），除 S6 外逐項相符；最後一行的提問相符。

### 13.5 Toolformer（第 69–72 頁）

- Schick 等 2023；工具五項 QA、WikiSearch、Calculator、Calendar、MT（第 72 頁）。老師口頭只講四個，文章寫的是「講義列的」，沒有問題。
- 1,400／400／0.29／29% 是老師口述（01:51–02:13），2024 講義這幾頁沒有這個例子，文章寫「老師的例子」正確。
- 第一步的 few-shot prompt 與大安區例句（第 70 頁）；第二步比較 LLM 與 QA Tool 兩種情況下「大安區」的機率（第 71 頁）。
- 不需人示範（05:17）；沒有明確分步、實際仍是兩件事（07:10–07:38）。

### Plan-and-Execute 一節

- 老師在 13.9 的總結（09:05–09:26）與文章的轉述相符。
- 第 76 頁：Kuo 與 Chen 2023、「I want to plan a trip to SF.」、隱含任務 Flight Ticket Booking 與 Room Reservation、AirlineBot 與 HotelBot、「→ Plan-and-Execute in LLM Agents」全部相符。
- 這一節有清楚分開三種來源：13.9 的總結、2024 講義第 76 頁、以及用「指的應該就是」標明的推測。標示合格。

### 13.6（＝13.7）畫面與逐字稿

- ReSpAct：標題「ReSpAct: Reasoning, Speaking, and Acting (Dongre et al., 2025)」、「Idea: interacting with users when necessary」、「→ Better efficiency」。ALFWorld 任務是「clean some cloth and put it in shelf」，文章寫布與架子，跟的是投影片（老師口頭說成衣服與衣櫥）。ReSpAct 的問句與使用者回覆「There should be one on the bathtubbasin. Why don't you check that?」相符；ReAct 16 步、ReSpAct 8 步。
- 「不是你肚子裡的蛔蟲」（04:38）；三類話的內容（05:16–06:48）。
- SalesAgent：「Training SalesAgent via CoT (Chang & Chen, 2024)」；藍色 Understanding、紅色 Policy；括號裡的兩組想法原文；科幻奇幻→主題餐廳→Star Wars 主題餐廳；最後「→ Proceed to TOD agent for FindRestaurants」。
- 2024 講義的 SalesBot（Chiu 等 2022，第 80–87 頁）與 SalesBot 2.0（Chang 與 Chen 2023，第 91–95 頁）。
- 策略代理人：「Plug-and-Play Strategy-Aware SalesAgent (Chang et al., 2025)」；Strategy Agent 是 fine-tuned model、Response Agent 是 untuned model；plug and play（12:36）。
- 個人化策略：「Personalized Strategies from Simulated Data」；橫軸六類 Agr、Info、Fin、Edu、Heal、Arts；(a) Without strategy、(b) With strategy；深淺色的意思（13:46–13:55）；藝術類與展覽活動（14:10–14:29）；成功率大幅上升（14:46–14:53）。

### 13.8 畫面與逐字稿

- ExploreToM：「Explore Theory-of-Mind (Sclar et al., 2025)」；情境含 People、Location、Object、Visible／Invisible state changes；四題的正確答案 fridge、table、yes、no；模型答 fridge ✓、table ✓、no ✗、yes ✗，acc = 0.5（已放大確認）。
- 老師的重點（04:28–05:22）。
- Collaborative Reasoner：投影片標題是「LLM Collaborative Behaviors (Ni+, 2025)」，出處列 Ni et al.「Collaborative Reasoner: Self-Improving Social Agents with Synthetic Conversations」。三個發現的原文與文章相符。老師的解釋（06:31–07:42）；偏好資料與 preference alignment（09:25–09:56）；投影片有「Train w/ DPO」。
- Collaborative Gym：「Collaborative Gym (Shao+, 2024)」、「Idea: Human-in-the-loop for detailed guidance」、「Facilitating human to easily interact with agents is important」；畫面是首爾行程與程式筆記本。老師的說法（10:54–11:43）。
- 本機 13.8 影片長度 767.1 秒，等於 12:47。

### 13.9 評估（第 100–106 頁）

- 四個自動指標與說明（第 100 頁）；多樣性要和合適度一起看（01:42–02:23）。
- 四種人工評估的頁碼對應正確：靜態 Likert 第 101 頁、動態 Likert 第 102 頁、靜態 A/B 第 103 頁、動態 A/B 第 104 頁；0–5 分；Humanness、Fluency、Coherence。
- 取捨（03:58–05:16）。
- LLM-Eval（Lin 與 Chen 2023）：prompt 與 Appropriateness、Content、Grammar、Relevance 四個分數（第 105 頁圖）；兩頁的結論句相符。
- 要明講分數定義（06:03–06:17）；各種任務都用（06:45–06:55）。
- 主線總結（07:01–08:03、08:44–11:07、12:07–12:21）。

### 兩個自編例子

- 訂房例子：條件、推理、分歧、結果與意義齊備，狀態累積與第 7 頁一致，inform／request 的分歧與老師 09:14–09:54、10:17–10:34 的說法一致。除 S1 那半句外無誤。
- Toolformer 例子：推理正確，與正文規則一致，有標「本文自編」。見 S9。

### 自我檢查十題

十題的答案都正確，也都能由正文推得。對應段落：第 1、2 題在四個模組表格與自編例子；第 3 題在 DP 段；第 4 題在艾菲爾鐵塔流程；第 5 題在 BlenderBot 2.0；第 6 題在 WebGPT 與 Toolformer；第 7 題在第 67 頁例子；第 8 題在 ReSpAct；第 9 題在 Collaborative Reasoner；第 10 題在人工評估的表格與取捨段。

### 常見的誤解

七條都有正文依據。開頭有「以下是本文的歸納，不是課堂上逐條列出的內容」，沒有冒充老師說法。

### 契約符合度

- 學習目標：zh 第 55 行，五項。
- 機制：四個模組、LaMDA 流程、Toolformer 兩步驟、ReSpAct、偏好資料訓練等，各節都有說明怎麼運作。
- 完整範例：兩個，各有條件、推理、結果、意義。
- 常見誤解、附答案的自我檢查：齊備。
- 查核歷程：正文只留來源底本與 13.6／13.7 的限制說明，其餘在文末來源區，位置恰當。
- 標題：中英都符合「主題：核心問題｜課名 第 13 堂」，檢查器 0 issue。

### 中英對照

除 M2 外，逐段對過，段落數、表格、數字、頁碼、例句一致，沒有漏段。M1 與 S1–S9 在英文版同樣存在，修改時要同步。英文版第 36 行多一句「The lectures are in Mandarin.」，是合理的補充。

### 中文用語

沒有發現中國用語。已掃 質量、信息、視頻、默認、反饋、優化、技術棧、窗口、用戶、數據、網絡、軟件、算法、搜索、鏈接、點擊、概率、文本、調用、訪問、獲取、創建、添加、智能體 等，全無命中。文中用的是 最佳化、回饋、機率、介面、使用者、搜尋、呼叫。

---

## 來源外、未驗證

- 九支影片的 YouTube 連結與長度。例外：13.6 的 15:11 與 13.8 的 12:47 用本機影片檔確認過。
- 13.7 的 YouTube 影片是否與 13.6 是同一段（見 S10）。
- 「Fall 2025（114-1，2025/09/01–12/15）11/24 那一週」。
- 「九支都沒有字幕」「Fall 2025 沒有公開這一堂的講義」。
- 參考資料的五個 arXiv 連結、課程頁、播放清單、講義的網址。
- 「以下影片已於 2026-10-10 對照官方 YouTube 播放清單」。
