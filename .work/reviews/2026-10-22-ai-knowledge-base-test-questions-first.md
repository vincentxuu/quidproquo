# Review — 2026-10-22-ai-knowledge-base-test-questions-first（order 11，中英）

- 審稿日期：2026-10-22。審稿者沒參與寫作與精讀。
- 這次合併做三輪：post-verify、post-review、post-polish。
- 中英兩檔都是 210 行，段落一一對齊，下文「L」行號兩版通用。
- 證據：
  - order 11 的 8 份抽取紀錄。
  - `.work/research/building-knowledge-bases/extractions/_spotcheck-batch8.md`（同日抽查）。
  - 全文檔在 `scratchpad/fulltext/`。Barnett 用 `scratchpad/spot8/dl/barnett.txt`（另抓的 v1 PDF），Kulkarni 用 Exa 重抓的全文。
- 規劃依據：`.work/series-plans/building-knowledge-bases.md` Order 11 範圍卡（L236 起）。
- 只寫報告，沒有改文章。

統計：🔴 1、🟡 9、🟢 22。

## post-verify

### 🔴 V1 Barnett「前三個最常跟文件本身有關」：來源沒有這個主張

- 位置：中 L27、英 L27
- 原句：
  - 中：「列出七個失敗點，前三個最常跟文件本身有關」
  - 英："the first three are the ones most often tied to the documents themselves"
- 依據：
  - Barnett §5（barnett.txt 第 197–230 行）只列七個失敗點的定義，沒有任何頻率資料，「最常」沒有出處。
  - 只有 FP1 Missing Content 是文件本身缺內容。FP2 "Missed the Top Ranked Documents" 是排序取前 K 名的問題。FP3 "Not in Context - Consolidation strategy Limitations" 是取回後整併進 context 的問題。
  - 這違反寫作指南長文第 7 條（不要替來源加上它沒有的主張）。
- 改法：
  - 中：「列出七個失敗點，前三個都發生在答案交到模型手上之前（[Barnett et al. 2024](…)）：」
  - 英："list seven failure points; the first three all happen before the answer ever reaches the model ([Barnett et al. 2024](…)):"

### 🟡 V2 Peng「正確率最高的設定，不可回答題表現最差」只在 Table 2 成立

- 位置：中 L125、英 L125
- 原句：
  - 中：「在其中一組測試裡，可回答題正確率最高的那個設定，遇到不可回答題時表現最差。」
  - 英："in one of their test sets, the configuration with the best accuracy on answerable questions did worst on unanswerable ones."
- 依據：
  - Table 2（TriviaQA）：OpenAI＋Vector＋無 reranker＋無改寫，正確率 88.4%、可接受率 49.0%。原文也寫 "yield the lowest acceptance rate"。
  - 但 Table 2 只列 9 組。附錄 Table 17 的 27 組裡，有 4 組可接受率更低：48.2%、47.5%、48.7%、43.0%。
  - 88.4% 的正確率也和另外兩組並列。
  - 方向（只追正確率會傷到拒答）正確；「最差」是過頭的說法。見抽查第 4 節。
- 改法：
  - 中：「在 TriviaQA 上，可回答題正確率並列最高（88.4%）的一個設定，遇到不可回答題時，只有 49% 回得恰當，在 27 種組合裡接近墊底。」
  - 英："on TriviaQA, one configuration tied for the best accuracy on answerable questions (88.4%) handled only 49% of unanswerable ones acceptably, near the bottom of the 27 combinations tested."

### 🟡 V3 Peng 的分類：「最相關的三種」是作者自己挑的，讀起來像 Peng 說的

- 位置：中 L125、英 L125
- 原句：
  - 中：「Peng 等人 2024 年把這類題目分成幾種，對企業知識庫最相關的是三種：……」
  - 英："Peng and colleagues classified such questions into several types; the three most relevant to a company knowledge base are …"
- 依據：
  - Peng §3.1 有六類：Underspecified、False-presupposition、Nonsensical、Modality-limited、Safety-concerned、Out-of-Database。
  - 「對企業知識庫最相關」是抽取紀錄的用法建議（peng 紀錄 L38），不是 Peng 的主張。
- 改法（只說一次「我」，不堆歸因）：
  - 中：「Peng 等人 2024 年把這類題目分成六類；我會先放其中三類：缺了關鍵資訊、需要追問的；前提就錯的；知識庫裡根本沒有的。」
  - 英："Peng and colleagues sorted such questions into six types; I'd start with three of them: questions missing key information, which need a follow-up; questions with a false premise; and questions about things the knowledge base doesn't contain."

### 🟢 V4 FP3 的描述：方向對，「截掉」把 consolidation 講窄了

- 位置：中 L31、英 L31
- 原句：
  - 中：「**排到了，但沒放進去**：被找到的段落太多，在組合成提示時被截掉。」
  - 英："**It's ranked, but doesn't make it in**: too many chunks are retrieved, and it's cut when the prompt is assembled."
- 依據：
  - 原文（第 209–214 行）："Documents with the answer were retrieved from the database but did not make it into the context for generating an answer. This occurs when many documents are returned from the database and a consolidation process takes place to retrieve the answer."
  - 原文說的是「取回了」，沒說「排到前面」。被刷掉是整併策略的限制，不一定是截斷。
- 改法：
  - 中：「**找到了，但沒放進去**：取回的段落太多，整併成提示時被刷掉。」
  - 英："**Retrieved, but left out**: too many chunks come back, and it's dropped when they're consolidated into the prompt."

### 🟢 V5 FP2 的描述：「有被找到」稍有出入

- 位置：中 L30、英 L30
- 原句：
  - 中：「正確的段落有被找到，但排名不夠前面，沒被交給模型。」
  - 英："the right chunk is found, but not ranked high enough to be passed to the model."
- 依據：原文（第 203–208 行）："The answer to the question is in the document but did not rank highly enough to be returned to the user … the top K documents are returned"。
- 改法：
  - 中：「答案在文件裡，但排名沒進前幾名，沒被交給模型。」
  - 英："the answer is in the documents, but its chunk doesn't rank in the top few that are passed to the model."

### 🟢 V6 「門檻是 2024 年 Claude 的上下文長度」是推論

- 位置：中 L35、英 L35
- 原句：
  - 中：「這個門檻是 2024 年 Claude 的上下文長度，會隨模型改變。」
  - 英："That threshold was Claude's context length in 2024 and will change with the models."
- 依據：Anthropic 原文第 45 行只寫 200,000 tokens（約 500 頁），沒說這是 context 長度。事實上相符（Claude 3.5 是 200K），但不是來源的話。
- 改法（縮回事實，不加標籤）：
  - 中：「20 萬 token 正好是當時 Claude 一次能讀的長度，換模型就要重算。」
  - 英："200,000 tokens happened to be how much Claude could read at once at the time; recheck it for whatever model you use."

### 🟢 V7 Thakur 的 56% 和 72% 是兩批不同的題目

- 位置：中 L150、英 L150
- 原句：
  - 中：「人先看過 GPT-4o 的標籤再修改時，一致率升到 72%，比較像是被它的答案帶著走。」
  - 英："When people saw GPT-4o's labels first and then revised them, agreement rose to 72%, which looks more like being led by its answers."
- 依據：
  - 56% 是 22 個題目，72.1% 是另外 14 個題目（para.txt 第 265 行）。
  - 作者自己寫 "human judges are more likely to agree with the GPT-4o judge unless it is an obvious mistake"，所以解讀有支撐。
- 改法：
  - 中：「另一批題目改成人先看 GPT-4o 的標籤再修改，一致率升到 72%；作者觀察到，除非錯得明顯，人多半會同意它。」
  - 英："On another set of topics where people saw GPT-4o's labels first and revised them, agreement rose to 72%; the authors note that people tended to go along with it unless it was obviously wrong."

### 🟢 V8 Kucia 的落差是用能對應頁面的 165 題算的

- 位置：中 L142、英 L142
- 原句：
  - 中：「同樣的檢索系統，換成真實題後，前五名命中率掉了 29 到 37 個百分點。」
  - 英："top-five hit rates fell by 29 to 37 percentage points when switching to real questions"
- 依據：Table 3 標題是 "authentic (165 questions)"，322 題裡只有能對應單一頁面的 165 題能算 Hit@5。
- 改法（選用）：
  - 中：「換成真實題（能對應到頁面的那 165 題）後」
  - 英："when switching to the real questions that could be matched to a page"

### 🟢 V9 「寫不出出處＝文件沒收」與「要放答不了的題」有張力（事實面）

這條和 R4 是同一件事，改法見 R4。

### 🟢 已核對無誤的數字與說法

- Kucia（R 檔行號）：
  - 2.3 倍（15.7／6.8 字，R 363）。
  - 29–37 個百分點（R 579；三組 29.3／30.4／36.9）。
  - 1.7 倍（2.70／1.57 s，R 591–592）。正文寫的是「同一個資料庫的純向量檢索」，沒有寫成 8 倍，已照研究結果修正。
  - 近一半（157／322，R 601）。
  - 50–100 題（R 729）。
  - 「涵蓋的文件廣得多」（165 vs 53 個來源）。
  - 「定義上一定答得出來」（§3 原句）。
- Kulkarni：
  - 8 到 10 天寫 10 題（"in two cases"，三週原型專案）。
  - 100 題 27 題不合格，另 7 題有保留。
  - 常見問題是「正確但不完整」。
  - 約 100 題是常見起點。
  - 三種錯誤拆法逐字對到原文。
- Thakur：
  - 從零標完全一致 56%、post-editing 72%。
  - 系統排名 τ ≥ 0.79。
  - "more likely to provide a higher support label"（＝寬鬆）。
- Akkiraju：
  - 三個內部聊天機器人。
  - "self-fulfilling prophecy … reinforcing their inherent biases"。
  - "supplement but not replace human oversight"。
- Azure：
  - 準備階段三件事平行做。
  - Query／Context／Answer 三欄，附頁碼。
  - 每塊先生兩題、SME 審。
  - 不可回答題的兩種回應方式。
  - 真實題來源：help desk、FAQs、ticketing system。
- Anthropic：
  - 營收 3% 例子。
  - 200,000 tokens（約 500 頁）。
- Barnett：
  - FP1 原意（"could be fooled into giving a response"）。
  - 後四個失敗點的簡述。
  - 兩個結論（只能在運作中驗證、robustness 是演進出來的）。

## post-review

### 🟡 R1 例子「每兩百字切一段」與切出的三段長度對不上

- 位置：中 L168、L170–174；英 L168、L170–174
- 原句：
  - 中：「假設切塊工具每兩百字切一段，模型可能拿到的三段是：」
  - 英："Suppose the chunking tool cuts every two hundred characters."
- 依據：
  - 中文三段分別是 57、43、48 字。整頁正文約 250 字，照兩百字切只會有兩段。
  - 英文三段是 228、122、120 字元，也不是兩百。
  - 這是全篇唯一的實例，又是在講切塊。
- 改法：
  - 中：「假設切塊工具大約每五十字切一段，模型可能拿到其中三段：」，或不給數字：「假設切塊工具照固定長度切，模型可能拿到其中三段：」。
  - 英："Suppose the chunking tool cuts at a fixed length. Three of the chunks the model might get are:"

### 🟡 R2 中文版政策「三天以內／三天以上」兩邊都含三天，跟英文版語意不同

- 位置：中 L17、L131、L164、L170–172、L176、L193（英文沒有這個問題）
- 原句：
  - 中 L164：「三天以內由直屬主管核准；三天以上由部門主管核准。」
  - 英 L164："Up to three days is approved by your direct manager; more than three days by the department head."
- 依據：
  - 台灣法令慣例「以上、以下、以內」都連本數計算（刑法第 10 條第 1 項）。照中文版的寫法，請剛好三天的假，兩條都適用，這頁本身就自相矛盾。
  - 英文 "up to／more than" 沒有重疊，兩版語意不同。
  - 這篇在講怎麼寫出答案明確的測試題，例子本身答案就不明確，正好是反例。
- 改法：
  - 中 L164 改成「三天以內由直屬主管核准；超過三天由部門主管核准。」
  - L17、L131、L176、L193 的問題同步改成「超過三天的假要誰核准？」，段 B 開頭改成「超過三天由部門主管核准。」。
  - 英文不用改。

### 🟡 R3 「知識庫沒有」的例子太遠，不是 Peng／Barnett 說的那種題

- 位置：中 L134、英 L134
- 原句：
  - 中：「知識庫沒有｜公司附近哪家餐廳好吃？｜說不知道，或指向福委會頻道」
  - 英："Not in the knowledge base | Which restaurant near the office is good? | …"
- 依據：
  - Peng 的 Out-of-Database 是「相關但知識庫沒有答案」。Barnett FP1 也特別說危險的是 "questions that are related to the content but don't have answers"。
  - 餐廳題跟知識庫無關，系統很容易拒答，測不出真正的問題。
  - 例子頁 L160 正好寫「約聘人員另見〈約聘人員請假規定〉」，那份文件不在例子裡，是現成的「相關但沒有」題。
- 改法：
  - 中：「知識庫沒有｜約聘人員請五天假要誰核准？｜說明正職規定不適用，請對方看〈約聘人員請假規定〉或問人資；不能套用正職的答案」
  - 英："Not in the knowledge base | Who approves five days of leave for a contractor? | Say the full-time rules don't apply and point to 'Contractor leave rules' or HR; don't reuse the full-time answer"

### 🟡 R4 「寫不出出處就是文件沒收」跟後面「要放答不了的題」打架

- 位置：中 L111、L187；英 L111、L187
- 原句：
  - 中 L111：「寫不出答案出處的題目，代表那份文件還沒被收進來」
  - 中 L187：「找不到出處的，先標起來，那是 order 12 要補收的文件。」
  - 英 L111："A question whose answer you can't source means that document hasn't been collected yet"
- 依據：
  - 同篇 L125 要刻意收文件答不了的題。L144 引 Kucia：真實題近一半對應不到任何頁面，原因是要個資、即時資料或問得太模糊。
  - 所以找不到出處有兩種可能：文件沒收，或本來就沒有文件。現在只寫了一種。
- 改法：
  - 中 L111：「寫不出答案出處的題目，要嘛是文件還沒收進來（order 12 盤點來源的起點），要嘛是本來就沒有文件，那就歸到『知識庫沒有』的題型。」
  - 中 L187：「找不到出處的先標起來：有文件但沒收的，交給 order 12；根本沒有文件的，改成第 3 步的題型。」
  - 英 L111："If you can't source a question's answer, either the document hasn't been collected yet (where order 12's inventory starts) or no document exists, in which case it belongs to the 'not in the knowledge base' type."
  - 英 L187："Flag the ones you can't source: documents that exist but weren't collected go to order 12; questions with no document at all become step 3's types."

### 🟡 R5 圖：虛線箭頭方向和圖說相反

- 位置：中英 L55（`dg-line--dashed` path）、L44（caption）
- 原句：
  - path `d="M300 656H372Q380 656 380 648V56Q380 48 372 48H304"`，`marker-end` 在 11。
  - 圖說「虛線：最後一步用第一步寫的測試題驗收。」
- 依據：
  - 箭頭從 19 指回 11，讀起來是「19 回饋到 11」。圖說說的是 11 的測試題給 19 用，資料方向是 11 → 19。
  - diagram skill 的內容檢查要求線要表達正文寫的關係。「上線失敗回流補題」是 order 19 的範圍，本篇正文沒寫，不能用這個解讀。
- 改法：
  - 把 path 反過來：`d="M300 48H372Q380 48 380 56V648Q380 656 372 656H304"`，讓箭頭落在 19 右側。
  - 中英同座標。改完重跑 `diagram-preview.ts`。

### 🟡 R6 「C 段」是規劃表用語，讀者沒看過

- 位置：中 L9（description）、L37（H2）；英文已用 "this part"，不用改
- 原句：
  - 「C 段九個步驟的流程總圖」
  - 「## C 段的九個步驟」
- 依據：order 0 正文用「個人段、團隊段、AI 段」，從沒出現「C 段」。本篇 L19 自己也用「AI 段」。
- 改法：改成「AI 段九個步驟的流程總圖」、「## AI 段的九個步驟」。

### 🟢 R7 題數前後不一：20 題＋5 題

- 位置：中英 L19、L186、L188
- 原句：
  - L19「寫出 20 題附出處與答案的測試題」
  - L186「列出 20 個同事最常問的問題」
  - L188「補 5 題文件答不了的」
- 依據：照步驟做完是 25 題，而且答不了的 5 題沒有出處。範圍卡寫的是「20 題附出處與答案」。
- 改法：
  - 中 L188：「**再補 5 題文件答不了的**（這 5 題的出處欄留空，改寫期待的回應）。」
  - 英："(leave the source empty for these five and write the expected response instead)"

### 🟢 R8 與 order 0 的銜接：例子重複

- 位置：中英 L25、L35
- 依據：
  - order 0 L39 已用過 Anthropic 的「營收成長 3%」例子，L47 也講過「知識庫小就直接放進提示」。
  - order 0 L90 承諾「每段第一篇只假設讀過總覽」，所以重講是對的。可以加半句接上，讓讀過的人知道這是延伸。
- 改法：
  - 中 L25 句首加「order 0 舉過 Anthropic 的例子：」
  - 英："Order 0 used Anthropic's example:"

### 🟢 R9 與 order 10 的銜接良好，可再補一處

- order 10 L121 收在「同事會越來越常直接問 AI 助理」，本篇 L17 用同一份〈請假與休假政策〉開場（order 10 的自我檢查剛把〈休假政策〉改成這個名字）。斷崖處理表 10→11 要的「B 段寫好的文件正是最好的原料」，在 L19 有寫。
- 選用：order 10 L93 說這頁加了一行「育嬰假：請洽人資窗口」，本篇 L162 的假別清單沒有。可以在 L162 補上，或當作「要追問／轉人」題型的另一個例子。

### 🟢 R10 四種題型表與例子頁一致

- 位置：中英 L129–134
- 「前提錯：為什麼年假不能跨年使用？」對應例子頁 §2「可遞延至隔年 6 月底」。
- 「要追問：我可以請幾天假？」對應「年假依年資計算」。
- 「可回答」的出處標第 3 節。
- 除了 R2、R3 之外沒有矛盾。

### 🟢 R11 自我檢查與範圍卡、例子一致

- 位置：中英 L193–195
- 三處（沒收錄、切塊失去上下文、沒排進前幾名）和範圍卡逐字對應。
- 第二處的例子（答案和舊制切在同一段）就是 L172 的段 B。
- 「沒收錄」對 FP1、「沒排進前幾名」對 FP2，都標對了。「切塊失去上下文」沒有標 Barnett 編號，也沒有硬套，正確。

### 🟢 R12 範圍卡逐項都有

- 有寫到的：
  - 模型只看到片段（L23–25）。
  - 七個失敗點與只能上線後驗證（L27–33）。
  - 流程總圖（L41–103）。
  - 三欄題庫，含答不了的題（L117–134）。
  - 與內容分析平行（L107）。
  - 合成題要人驗、混入真實題（L136–146）。
  - 約 20 萬 token 可先不做 RAG（L35）。
- 範圍卡 2026-10-22 的修正（三欄、1.7 倍、20 題 vs 約 100 題）都有反映。
- 沒有越界寫 order 12–19 的實作。

### 🟢 R13 參考資料都讀過全文，站內連結都存在

- 9 條外部來源都有抽取紀錄，讀取狀態都是全文：
  - Anthropic、Barnett（HTML 全文）。
  - Azure preparation、Azure 設計總覽。
  - Kulkarni（Exa 全文）。
  - Peng：正文全文，附錄只看標題。V2 那條正是附錄才有的資訊。
  - Kucia、Thakur、Akkiraju。
- 本次也回全文核對過。
- 站內 3 條（中英各 3 個檔）都存在，標題和參考資料寫的一致：
  - `ai/2026-08-26-understanding-ai-models-finetuning-vs-rag(-en)`
  - `ai/2026-03-12-rag-failure-modes(-en)`
  - `ai/2026-09-19-retriever-silent-failure(-en)`
- order 0 連結也存在。
- 規劃表列的 Karakurt & Akbulut 2026 沒有引用，也沒列進參考資料，正確（沒讀到的不列）。
- `pnpm check:references` 對中文檔只有一條 WARN：「參考資料和標題缺少關鍵詞重疊」。原因是中文標題配英文參考資料，屬誤報。

### 🟢 R14 圖符合 diagram skill

- 中英 `diagram-preview.ts` 都是 ✓，淺色、深色、手機三張截圖都看過（`scratchpad/spot8/dg/`、`spot8/dg-en/`），沒有重疊或溢出。
- 9 個節點，剛好是上限。accent 只用在 2 個。先畫線再畫節點。只用 `dg-*` class。title 與 desc 寫法正確。
- 小建議：九個框一樣大。skill 建議節點大小要有層級，可以把 11、19 加高 8–12 px，或不動。
- 圖內容沒有正文沒寫的主張，R5 的箭頭方向除外。

### 🟢 R15 英文版用詞

- 位置：英 L120
- 原句："**Context**: the original passages …"
- 依據：其他地方都叫 source（L60 圖、L123、L131、L189）。Azure 的欄位名確實是 Context，但同篇混用兩個名稱會讓讀者以為是兩個欄位。
- 改法："**Source (Azure calls it Context)**: the original passages …"

### 🟢 R16 tldr 太長

- 位置：中英 L8
- 依據：寫作指南規定 tldr 寫 1–2 句，目前是 4 句。
- 改法：刪掉 Azure 那句，或把最後一句併進前一句。

### 🟢 R17 inline 連結格式

- 依據：寫作指南規定論文第一次出現時寫成「[名稱](arxiv)（arXiv:XXXX）」，目前沒附 arXiv ID。這個系列前幾篇也沒附，要改就整個系列一起改，不急。

## post-polish

`register-scan.sh`（中文）結果：

| 指標 | 結果 | 閾值 |
|---|---|---|
| 長句 | 12／101 句，約 12% | 綠 < 10%，處理 > 15% |
| 但書段落 | 8／41，19% | — |
| 引述區塊 | 8 個 | — |
| 單段 ≥4 個數字 | 4 段 | — |
| 姓名當主詞 | 1 | — |
| 模板化轉折 | 1 | — |

其他檢查：

- `pnpm check:tw`：0 blocking、0 review。
- `scan-ledger.sh`：中英都只有 L17 一處模板化轉折，未超標。
- `check-process-leak.mjs`：中英都通過。

### 🟡 P1 Thakur 段太擠：8 個數字、88 字長句、兩個研究擠一段

- 位置：中英 L150
- 原句（中）：「Thakur 等人 2025 年比較 GPT-4o 和人工評審判斷答案有沒有被引用段落支持，在系統排名的層級上兩者相當一致；但逐筆比較，從零開始各自標的一致率只有 56%，而且 GPT-4o 一貫比人寬鬆（…）。」
- 依據：這段同時有 Thakur 的兩個條件和 NVIDIA 的經驗，超過「單段 ≤3 個數字」的閾值，也是全篇最長的一句。
- 改法：拆成兩段，第一段只放 Thakur，NVIDIA 另起一段。
  - 中：「Thakur 等人 2025 年讓 GPT-4o 和人工評審判斷同一件事：答案有沒有被引用的段落支持。拿來排系統，兩者相當一致。逐筆對，就差多了：各自從零標，只有 56% 完全一致，而且 GPT-4o 比人寬鬆。」接 V7 的改法，然後另起一段：「NVIDIA 分享建三個內部聊天機器人的經驗時也提醒……」
  - 英："Thakur and colleagues had GPT-4o and human judges decide the same thing: whether an answer was supported by the passages it cited. For ranking systems, the two agreed well. Item by item, much less so: labeling from scratch, they agreed exactly only 56% of the time, and GPT-4o was more lenient." 後面的處理同中文。

### 🟢 P2 其他長句

- 位置與原句：
  - L19「order 0 說過，每段的第一篇只假設你讀過總覽；讀過團隊段……」（65 字）
  - L23「多數接上公司文件的 AI 助理用的是……」（76 字）
  - L107「Microsoft 的 Azure 架構中心有一套 RAG 設計指南……」（70 字）
  - L113「微軟的 Kulkarni 和 Savelieva 指出……」（75 字）
  - L176「問『三天以上的假要誰核准』時，段 B 的前半句是答案……」
- 依據：比例 12% 介於綠燈與該處理之間。
- 改法：各在第一個分號處斷句。
  - L23 例：「多數接上公司文件的 AI 助理用的是檢索增強生成（RAG）。做法是先把文件切成小段、建好索引；有人提問時，找出最相關的幾段，跟問題一起交給模型。」
  - L176 例：「……段 B 的前半句是答案，後半句卻是舊制。如果檢索只拿到段 A，或模型把舊制當成現行規定，就會答出開頭那個錯誤的『直屬主管』。」
  - 英文 L23、L176 照同樣位置斷句。

### 🟢 P3 填充式開頭

- 位置：中 L35、L144；英 L35、L144
- 原句：
  - 中「另外一提：」「還有一件事：」
  - 英 "One more thing:"、"There's one more thing:"
- 依據：兩處都是不帶資訊的轉場。
- 改法：
  - 中 L35 改成「知識庫很小時，可以先不做 RAG。」
  - 中 L144 改成「真實題裡將近一半，……」
  - 英文同樣刪掉開頭。

### 🟢 P4 引述區塊數量

- 位置：中英 L158–174
- 依據：8 個「引述區塊」全是例子頁與三個切塊，不是引用別人的話，掃描器把每個 `>` 段落都算進去。保留。
- 選用：三段切塊可以改成三列表格（段／內容），一眼看出段 B 前後半衝突。

### 🟢 P5 數字密度另外三段

- 位置：L19（6 個，都是 order 編號）、L142（5 個）、L182（4 個，限制節）
- 依據：L19 的數字是導覽編號，不是統計數字。L182 在限制節。都可保留。
- L142 做了 V8 之後會多一個數字。如果要控制密度，可以把「1.7 倍」留在正文、「29 到 37 個百分點」移到 tldr 就好。不改也可以。

---

## 🔴 一行摘要

- V1：L27「前三個最常跟文件本身有關」是 Barnett 沒有的主張（沒有頻率資料，FP2／FP3 是檢索與整併問題，不是文件問題）。改成「前三個都發生在答案交到模型手上之前」，中英同改。

## 修正紀錄（2026-10-22）

- 採用：V1（改「前三個都發生在答案交到模型手上之前」）、V2、V3、V4、V5、V6、V7、V8、V9／R4、R1（不給切塊字數）、R2（中文全篇「三天以上」改「超過三天」）、R3（知識庫沒有改約聘人員題）、R5（虛線改為 11 → 19，重跑預覽通過）、R6（C 段 → AI 段）、R7、P1（Thakur 與 NVIDIA 拆段）。
- 不採用：R16（tldr 保留）、其餘 🟢 文字建議視為可選，未改。
- 抽查 batch8 的三處紀錄錯誤已在紀錄中更正（azure 行數、akkiraju 行號、peng Table 1 欄位）。
