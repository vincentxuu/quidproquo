# CS124 課程總覽語意審稿（獨立審稿，未參與撰寫）

審稿日期：2026-10-13。只讀不改文章，未 commit。

## 審稿對象與版本

| 檔案 | sha256 |
|---|---|
| `src/content/posts/ai/2026-08-21-stanford-cs124-languages-to-information.md`（zh-TW，292 行） | `04eae588753f128e25196de30af0114b8c9080222e0bc9b7ffbf7646315b3200` |
| `src/content/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en.md`（en，292 行） | `46d62c871e2140fe34bcb663f943b49c8594128de0649a9ce42c78204ff5a94c` |

文章再改動後 hash 會變，本報告只對上面兩個版本有效。

## 總結

- **blocker：0。** 兩篇已經是課程總覽，不再是查課流水帳；主線、十週機制、可手算例子、先修自我檢查、閱讀路線、具體起點都有對應段落。
- **should-fix：8 項**（S1–S8），其中 4 項是事實或技術上會誤導讀者的句子，1 項只影響英文版。
- **nit：11 項**（N1–N11）。
- **逐週導讀的過時問題：7 項**（W1–W7），不是這兩篇的問題，另列。
- 三項分開回報：**身分／標題通過**（`check-course-titles.mjs` 連同十篇逐週 0 issue；`check-course-guide-layout.mjs` 0 issue）；**事實大致通過**，S1–S4、S7 需修；**教學品質通過**，S5、S6 修掉後更準確。

建議狀態：修完 S1–S8 後可驗收；修改後需依新 hash 複審改動段落。

## 來源與核對方式

| 來源 | 取得方式 | 結果 |
|---|---|---|
| 課程首頁 `web.stanford.edu/class/cs124/` | curl，200 | 全文讀過 |
| `pa7-agent`、`pa6a-transformers`、`pa6b-speech`、`pa1-regular-expressions` README | raw.githubusercontent.com，200 | 讀過 |
| 九個作業 repo 與 `labs` 的檔案清單 | GitHub contents API | 讀過 |
| SLP3 主目錄、`old_aug25/`、`old_jan26/` | curl，200 | 目錄頁讀過 |
| SLP3 第 2、3、7、8、10、14、15 章，現行版、aug25、jan26 各一份 | curl + pdftotext 讀第一頁章名 | 讀過 |
| `intro26.pdf`、`final124_26.pdf`、`llm_cs124_26.pdf`、`lm_jan25.pdf` | curl + pdftotext | 讀過相關頁 |
| 其餘投影片連結（tokens、med、logreg、ir、vector、7_NN、collaborativefiltering26、socialnetworks21、speech、transformer、Lab1、spark-public web.pdf） | curl 狀態碼 | 皆 200、application/pdf |
| `restricted/css_cs124_26.pdf` | curl | 導向 `login.stanford.edu`，確認要登入 |
| ExploreCourses XML（2025–26） | curl | 讀到 `From Languages to Information (LINGUIST 180, LINGUIST 280)` |
| YouTube 頻道播放清單頁 | curl | 讀到清單名稱與支數 |

沒有任何一項需要標「未能核對」。

## 1. 教學

讀完能說出主線（把文字、語音、連結轉成可計數、排序、預測的表示）與十週四段各自在學什麼。對照規格的位置：

| 規格要求 | 位置（zh 行號，en 同行） | 判定 |
|---|---|---|
| 主線 | 29–51 | 有，且有一張「LLM 元件對應週次」表 |
| 各模組一兩句講機制 | 72–100 | 有，十週都講到機制，不是只列主題 |
| 可跟著算的例子 | 102–136 | 有：條件、計算、結果、意義俱全，明示自擬 |
| 先備與自我檢查 | 138–157 | 有三項可操作判準與橋接連結 |
| 自我檢查附答案 | 136、240 | 有答案與判準 |
| 閱讀路線與具體起點 | 228–256 | 有 |

H2 共 12 個，扣掉影片來源、更新紀錄、參考資料三個固定區塊後 9 個，其中 6 個在講課程教什麼與怎麼讀，過半。

逐項機制核對：

| 機制 | 位置 | 判定 |
|---|---|---|
| BPE | 76 | 正確 |
| 編輯距離 | 76 | 正確 |
| n-gram | 76、114 | 正確 |
| 邏輯迴歸、cross-entropy、梯度 | 78、240 | 正確；梯度「預測值減真實值乘輸入特徵」正確 |
| 倒排索引、tf-idf、cosine | 80 | 正確 |
| distributional hypothesis、word2vec | 84 | 正確（簡化可接受） |
| 多層網路、反向傳播 | 86 | 正確 |
| causal self-attention | 88 | **不精確，見 S5** |
| 協同過濾 | 98 | 正確，與 README 的 item-item cosine 一致 |
| PageRank、centrality | 100 | 正確 |

### S5（should-fix）causal self-attention 的括號說明少了「自己」

- zh 88：「每個位置只能看自己左邊的 token」
- en 88："each position can only see the tokens to its left"

causal mask 允許位置 i 看 1 到 i，包含自己。照字面讀成「只看左邊、不含自己」是錯的，照這句話去寫 PA6a 的 mask 會多遮掉對角線。

建議：zh「每個位置只能看自己和左邊的 token，看不到右邊」；en "each position can attend only to itself and the tokens to its left"。

### S6（should-fix）「兩週都沒有用到神經網路」與同段內容矛盾

- zh 96：「最後兩週的資料換成人的行為和連結，兩週都沒有用到神經網路。」
- en 96："neither week uses neural networks."

同一節緊接著寫 PA7 要做 LLM agent（98），期末現場課講 preference alignment、可解釋性、emergent misalignment（100）。

建議：zh「預錄內容教的兩個演算法（協同過濾、PageRank）都不是神經網路」；en "the two algorithms in the recorded material, collaborative filtering and PageRank, are not neural"。

## 2. bigram 例子重算

語料三句，計數：`<s>` 3 次、我 2、你 1、喜歡 3、攀岩 2、咖啡 1。

| 機率 | 重算 | 文中 | 判定 |
|---|---|---|---|
| P(我\|`<s>`) | 2/3 | 2/3 | 對 |
| P(你\|`<s>`) | 1/3 | 1/3 | 對 |
| P(喜歡\|我) | 2/2 | 1 | 對 |
| P(喜歡\|你) | 1/1 | 1 | 對 |
| P(攀岩\|喜歡) | 2/3 | 2/3 | 對 |
| P(咖啡\|喜歡) | 1/3 | 1/3 | 對 |
| P(`</s>`\|攀岩) | 2/2 | 1 | 對 |
| P(`</s>`\|咖啡) | 1/1 | 1 | 對 |

整句：

- 我 喜歡 攀岩 = 2/3 × 1 × 2/3 × 1 = **4/9**，對。
- 你 喜歡 咖啡 = 1/3 × 1 × 1/3 × 1 = **1/9**，對。
- 你 喜歡 攀岩 = 1/3 × 1 × 2/3 × 1 = **2/9**，對。
- 四個可能句子合計 4/9 + 2/9 + 2/9 + 1/9 = 1，模型自洽。
- 「我 攀岩」：count(我 攀岩) = 0，P(攀岩\|我) = 0，含這個 bigram 的句子機率為 0。**說法正確。**
- 英文版（I／you／like／climbing／coffee）數字逐格相同，全對。
- 「第 2 週教的 smoothing」：aug25 版第 3 章第 14 頁起是「Smoothing, Interpolation, and Backoff」，`lm_jan25.pdf` 也有 add-one 一節，成立。

### S3（should-fix，只影響英文版）"I climbing" 撐不起「句子完全合理」

- en 132："The pair "I climbing" appears 0 times ... any sentence containing it has probability 0, however reasonable that sentence is."

中文「我攀岩」本身是合理句子，所以論點成立。英文 "I climbing" 不合文法，讀者會覺得機率為 0 很合理，這一段要說的「合理的句子也歸零」就落空了。

建議：英文改用同一份語料裡另一個零次 bigram：「like you」。"I like you" 是完全正常的句子，P(you | like) = 0/3 = 0，整句歸零。中文版要不要一起換成「我 喜歡 你」可自行決定；換的話兩篇例子保持一致，不換的話英文獨立改即可（數字與表格都不用動）。

## 3. 事實核對

### 與官方頁一致的項目

| 項目 | 文中位置 | 官方原文／證據 | 判定 |
|---|---|---|---|
| 先修四項 | 142–147 | "CS106B, Python (at the level of CS106A), CS109 (or equivalent background in probability), and programming maturity and knowledge of UNIX equivalent to CS107 (or taking CS107 or CS1U concurrently)" | 一致（見 N3） |
| 107／109 改為必修 | 149 | "In some previous years CS107 and CS109 were optional ... So now both are required." | 一致（見 N2） |
| UNIX 影片清單五段 | 149 | Logging in、File System、Useful Commands、Shell/Productivity、Vim | 一致 |
| 3%／97% | 167–168 | "3% attendance ... 97% homeworks and quizzes" | 一致 |
| 73%／27% | 168 | "73% of 97%: homeworks ... 27% of 97%: weekly review quizzes" | 一致 |
| PA1–6 各 9、PA7 18、PA0 1 | 170 | "PAs 1-6 are each worth the same, 9% ... PA7 is worth 18% ... PA0 is worth 1%"；6×9+18+1=73 | 一致 |
| 九次測驗取八次、開書、可重複作答 | 170 | "we will only count your best 8 of the 9 quizzes"、"open book"、"attempted an infinite number of times" | 一致 |
| 四天遲交額度，PA0–6 | 170 | "a total of 4 free late (calendar) days to use on programming assignments 0-6" | 一致 |
| PA7 不能用遲交額度 | 186 | "You cannot use late days on PA 7." | 一致 |
| 五場現場課週次 1、5、6、7、10 | 161 | 課表逐週核對 | 一致 |
| 六天必到 | 161 | "Required attendance in Hewlett 200: 6 days"（四場現場課加 Lab 1、Lab 4） | 一致 |
| 現場課與實作課不錄影 | 161、222 | "the 5 live lectures and the 5 labs are not recorded" | 一致 |
| 沒有期中期末，最後一項是 PA7 | 163 | "There is no final exam and midterm ... The last class requirement is the final programming assignment" | 一致 |
| 各週 PA | 57–66 | PA0 週 1、PA1 週 2、PA2 週 3、PA3 週 4、PA4 週 5、PA5 週 6、PA6a 週 7、PA6b 週 8、PA7 週 9（週 10 截止） | 一致 |
| 指定閱讀章號 | 57–66 | 週 2：Ch.2、3；週 3：Ch.4；週 4：Ch.11；週 5：Ch.5 加 Ch.10 pp.9–12；週 6：Ch.6；週 7：Ch.7、8；週 8：Ch.14、15；週 9：MMDS Ch.9 | 一致（週 10 見 N5） |
| 投影片公開 | 217 | 列出的十個預錄主題與四場現場課，連結全部 200 | 一致 |
| 計算社會科學投影片在 `restricted/` | 84、223 | 連結為 `/restricted/css_cs124_26.pdf`，導向 Stanford 登入 | 一致 |
| 不開放旁聽但歡迎自學 | 210 | "Can I audit this class? No and yes ... don't submit homeworks or quizzes to be graded, and don't ask questions on Ed" | 一致 |
| FAQ 鼓勵看 YouTube | 226 | "we encourage you to watch the videos on YouTube" | 一致 |
| 2026–27 不開課 | 23 | "will not be taught in AY 2026-2027" | 一致 |
| 榮譽守則的 LLM 規定 | 190 | "You should use language models like you use a TA, to improve your understanding. You may not paste code directly from an LLM into your programming assignment." | 一致 |
| 預錄影片 2 到 2.5 小時 | 161 | "2 to 2.5 hours total" | 一致 |
| Canvas 課號 186110 | 262 | "Modules section on Canvas"，連結 `courses/186110` | 一致 |
| LINGUIST 180／280 | 25 | ExploreCourses："(LINGUIST 180, LINGUIST 280)" | 一致 |
| 教科書為 2025 年 8 月版 | 196 | "third edition August 2025 release" | 一致 |
| PA1–6 可一人或兩人 | 186 | "you can also choose a partner and do pair programming for PA 1-6" | 一致 |

### 與 GitHub README 一致的項目

| 項目 | 位置 | README | 判定 |
|---|---|---|---|
| PA7 三到四人 | 186 | "groups of 3-4 members. (To work in a group of size 2, you must get special permission...)" | 一致 |
| PA7 兩部分 | 186 | 先協同過濾推薦電影，再做會呼叫工具的 agent，加網頁搜尋與記憶 | 一致 |
| Together AI 與 SerpAPI key、付款資料提醒 | 188 | "you may have to add some payment information to create an API key"（Together AI） | 一致，但見 S1 |
| PA7 的 agent 不確定性測試 | 236 | README 有 "Note on testing and agent nondeterminism" 一節 | 一致 |
| PA6a 在 `model.py` 實作 causal self-attention | 88 | "implement the `forward` method of the `CausalSelfAttention` class" | 一致 |
| 莎士比亞語料、溫度取樣、perplexity | 88 | 三部分皆有 | 一致 |
| 第一份不在 notebook 的作業 | 88 | "This is the first assignment in this class that is not run on Jupyter Notebooks" | 一致 |
| PA1–PA5 都是 notebook | 230 | 各 repo 有 `paN.ipynb` | 一致 |
| PA6b 合成再辨識、比對資訊遺失 | 92 | TTS→STT，Part 3 要列三類錯誤 | 一致，但見 S2 |
| PA6b 口音或停頓的真實錄音 | 92 | "strong regional dialect, a non-native English accent, or ... dysfluencies" | 一致 |
| PA6b 需要 Cartesia 帳號 | 188 | "Sign up for a free account" | 一致，但見 S1 |

### 與投影片一致的項目

| 項目 | 位置 | 證據 | 判定 |
|---|---|---|---|
| 導論投影片的 LLM 元件 | 39 | 兩頁合起來有 BPE Tokenization、Logistic Regression、Word embeddings、Neural Networks、Attention、Sampling、Language Model Loss、RAG | 一致（原投影片還有 Conv Nets、Gradient Descent／Backprop，文中是選列） |
| 後續課程 | 244–250 | 導論與期末投影片都列 CS224N、224U、224V、224W、336 等 | 一致 |
| 三種架構 | 86 | `llm_cs124_26.pdf` 有 Decoders、Encoders、Encoder-decoders | 一致 |
| 期末投影片內容 | 100 | 大綱：Preference Alignment、Interpretability、Emergent Misalignment、Machine Translation，結尾列後續課程 | 一致 |

### 教科書章號對照表

第一頁章名（pdftotext）：

| 章號 | `old_aug25/` | 主目錄（2026-08-19 版） | 文中 | 判定 |
|---|---|---|---|---|
| 7 | Large Language Models | Transformers and Pretraining | 同 | 對 |
| 8 | Transformers | Post-training | 左欄寫「The Transformer」，是課綱的寫法 | 對 |
| 10 | Masked Language Models | Interpretability | 同 | 對 |
| 14 | Phonetics and Speech Feature Extraction | RNNs and LSTMs | 左欄簡寫成「Phonetics」 | 對（見 N6） |
| 15 | Automatic Speech Recognition | Phonetics and Speech Feature Extraction | 同 | 對 |

補充：教科書網站另有 `old_jan26/`（2026-01-06 版），第 7、8、10、14、15 章的章名與 aug25 相同。文中建議讀 `old_aug25/` 沒有問題，課綱也明寫 August 2025 release。

### S1（should-fix）「兩份作業會用到付費服務」對 PA6b 不成立，對 PA7 也過頭

- zh 188：「自學者要注意兩份作業會用到付費服務。⋯⋯PA6b 需要 Cartesia 的帳號來跑語音合成與辨識。」
- zh 230：「第 7 週之後才需要比較多的運算時間和付費 API。」
- en 188、230 同。

README 的說法：

- PA6b："Sign up for a free account"、"Cartesia's free tier API comes with a rate limit. While this rate limit is more than enough to complete this assignment"。免費帳號就做得完。
- PA7 的 SerpAPI："register a free account ... You will get 250 searches with a free account."
- PA7 的 Together AI：才是可能要付錢的那一個（"you may have to add some payment information"，而且課程給各組的額度自學者沒有）。

同系列第 8 週導讀（40 行）寫的是「free tier rate limit 足以完成作業」，總覽這裡反而比逐週導讀不準。

建議改寫（zh）：「自學者要注意兩份作業要自己申請外部服務的帳號。PA7 需要 Together AI 與 SerpAPI 的 API key：SerpAPI 的免費帳號有 250 次搜尋；Together AI 建立 key 時可能要填付款資料，選課學生有課程給的額度，自學者要自己付。PA6b 需要 Cartesia 的帳號，README 說免費方案的速率上限足夠做完作業。」230 行的「付費 API」改成「外部服務的 API key」。英文版對應修改。

### S2（should-fix）PA6b 的輸入句子不一定來自 PA6a

- zh 92：「把 PA6a 模型產生的句子丟給語音合成」
- en 92："send the sentences generated by your PA6a model"

README："We have provided a default `sampled_sentences.json` file for you to use. If you'd like, you can optionally replace it with the sentences you sampled from your trained model in PA6a."

這會影響自學者的判斷：沒做 PA6a 也能直接做 PA6b（「做語音產品」那條路線正好是這種讀者）。

建議：zh「把一批取樣出來的句子（repo 附了一份，也可以換成自己 PA6a 模型產生的）丟給語音合成」。

### S4（should-fix）YouTube 舊錄影涵蓋的主題講少了

- zh 226：「斷詞、編輯距離、n-gram、資訊檢索這些前半段的主題可以拿它來配著看，後半段要靠投影片和教科書。」
- en 226 同。

頻道播放清單實際有：Basic Text Processing and Edit Distance、Language Modeling、Naive Bayes、Logistic Regression、Information Retrieval、Part of Speech and Named Entity Tagging、Vector Semantics and Embeddings、Neural Networks、Chatbots and Dialogue Agents、Recommender Systems、PageRank、Social Networks。

也就是邏輯迴歸、詞嵌入、神經網路、推薦系統、PageRank、社群網路都有舊錄影；第 9、10 週的預錄主題正好是 2026 年沿用舊投影片的部分（`socialnetworks21.pdf`、spark-public 的 `web.pdf`）。真正沒有錄影的是 LLM 與 Transformer、語音、agent。現在的寫法會讓讀者以為第 5 週以後完全沒有影片可看。

「有 Naive Bayes、詞性標註、聊天機器人，沒有 Transformer 與 LLM」這半句核對成立；影片來源區的「80 支」「Week 2: Naive Bayes」「Week 6: Chatbots and Dialogue Agents」也都核對成立。

建議：zh「斷詞與編輯距離、n-gram、邏輯迴歸、資訊檢索、詞嵌入、神經網路、推薦系統、PageRank、社群網路都有對應的舊錄影，可以配著看；LLM 與 Transformer、語音、agent 這幾週沒有，要靠投影片和教科書。」

### S7（should-fix）「回主目錄找對應的章名」對第 7 章做不到

- zh 206：「想看最新的寫法，再回主目錄找對應的章名。」
- en 206 同。

2026 年 8 月版沒有叫「Large Language Models」的章。教科書首頁寫明舊第 7 章的 LLM 內容搬進新的第 1 章（"Much LLM material from the former chapter 7 was decanted here"），其餘在新的第 7 章。讀者照章名找會找不到。

建議在對照表加第三欄「內容現在在哪」，五列分別是：新版第 1 章 Introduction 與第 7 章 Transformers and Pretraining；第 7 章；第 9 章 Masked Language Models；第 15 章；第 16 章。左欄順便把第 14 章寫成完整章名（N6）。

### S8（should-fix）「隨堂測驗」會被讀成課堂上考

- zh 14（tldr）、161、224：「隨堂測驗」
- en 用的是 "quizzes"／"review quiz"，沒有這個問題。

官方的 Automated Review Quizzes 是看完影片後在 Gradescope 上作答，不計時、開書、可無限次重交，週二 23:59 截止，不在課堂上進行。「隨堂」與 170 行自己寫的「可以翻書、可以重複作答」也對不起來。

建議：三處改成「每週複習測驗」或「每週測驗」。

## 4. 連結

- 站內 `/posts/...`：zh 20 個、en 20 個，對應檔案全部存在，`draft: false`，語言正確（zh 連 zh、en 連 `-en`）。
- `/series/stanford-cs124` 與 `/en/series/stanford-cs124`：成立。`src/utils/series.ts` 406–414 行定義 `slug: 'stanford-cs124'`，名稱 `Stanford CS124 導讀`／`Reading Stanford CS124` 與兩篇 frontmatter 的 `series.name` 完全相同；`src/pages/series/[series].astro` 與 `src/pages/en/series/[series].astro` 都由 `getStaticPaths` 依 slug 產生頁面。
- 文內錨點 `#課程影片來源`、`#course-video-sources` 對應的 H2 存在。
- 外部連結抽查全部 200：課程首頁、`intro26.pdf`、`final124_26.pdf`、`Lab1_UnixText_2026_upload.pdf`、`old_aug25/`、`old_aug25/2.pdf`、九個作業 repo、`cs124/labs`、CS107 unixref、MMDS ch9、Networks, Crowds, and Markets、YouTube 頻道、Jurafsky 個人頁。
- 未實際起 dev server 看渲染後的頁面（Playwright MCP 本次連線失敗）；表格、程式碼區塊都是一般 Markdown，沒有公式或 mermaid。

**站外一提（不是這兩篇的問題）**：`src/utils/series.ts` 411–412 行的系列描述寫「從語言模型與文字分類，到資訊抽取、問答與語音」，Winter 2026 課綱沒有資訊抽取與問答。系列頁會顯示這段，建議改成與總覽一致的內容（斷詞、n-gram、文字分類、資訊檢索、詞嵌入、Transformer、語音、推薦與 PageRank）。

## 5. 中英一致

- 結構：兩篇都是 292 行、16 個 H2／H3，段落一一對應。
- 數字：評分比重、週次、章號、機率全部相同。
- 連結目標：一一對應，英文版全部指向 `-en` 檔與 `/en/series/`。
- 例子：英文把語料換成 I／you／like／climbing／coffee，數字相同（問題見 S3）。

英文大致自然，以下幾處生硬：

| 行 | 現在 | 建議 | 嚴重度 |
|---|---|---|---|
| 84 | "from this week on the data learns them" | "from this week on they are learned from data" | nit（N9） |
| 136 | "the Week 2 reading will not stop you" | "you are ready for the Week 2 reading" | nit（N9） |
| 25 | "the first cell of the NLP branch" | "the first stop on the NLP branch" | nit（N9） |
| 262、274 | 彎引號 `’`，其餘全篇直引號 | 統一成直引號 | nit（N10） |
| 271 | "## Update Log"，其餘 H2 是句首大寫 | 若是全站固定寫法就保留 | nit（N10） |

## 6. 文風（zh-TW）

- **替換表**：任務說明提到 writing-guide 有中國用語替換表，但目前的 `.agents/skills/post/references/writing-guide.md` 沒有這張表，全 repo 也搜不到（搜尋「中國用語」「大陸用語」「替換表」皆無）。以下依一般台灣用語判斷。
- 常見中國用語（信息、視頻、默認、數據、代碼、算法、用戶、網絡、質量、鏈接、登錄、賬號、創建、運行、調用、函數作為程式用語等）：**未出現**。「非線性函數」是數學用語，沒問題。
- 兩個可再斟酌的詞（N7）：「文本分類」（14、59、178 行，以及 88 行「莎士比亞的文本」），台灣較常寫「文字分類」；`series.ts` 的系列描述用的就是「文字分類」，站內不一致。「倒排索引」（80 行）台灣也寫「反向索引」。兩者都不算錯。
- AI 腔：全篇沒有破折號；「不是⋯而是」只有 130 行一處變體（「不是把句子背下來」），不構成堆疊；沒有空泛收尾，結尾是三件今晚可做的事。**通過。**
- 查課流水帳：正文已清乾淨。殘留只有兩處，都在可接受範圍：149 行一句先修沿革（N2）；262 行影片來源區的「我實際開啟被導向 Stanford 登入頁」，屬於固定的影片狀態區塊。

## 7. 與十篇逐週導讀的事實對照

總覽本身與官方頁一致。以下是**逐週導讀過時或有誤**，不是這兩篇的問題：

| # | 檔案與行 | 逐週導讀的說法 | 官方頁現況 | 
|---|---|---|---|
| W1 | week10 16、18、44、106、110、123 | 期末投影片是「標示 2025 的 final deck」`finallecture_cs124_2025.pdf`，大綱為 post-training、instruction tuning、preference alignment、multilinguality、speech | 課表掛的是 `final124_26.pdf`，大綱為 preference alignment、interpretability、emergent misalignment、machine translation |
| W2 | week7 16、44 | 語音現場課「沒有公開 deck」 | 課表掛 `speech_cs124_26.pdf`／pptx，200 可讀（127 頁） |
| W3 | week6 18、40、112；week7 18、113 | LLM／Transformer 投影片是 `LLM_cs124_week7_2025.pdf` | 課表掛 `llm_cs124_26.pdf` 與 `transformer_cs124_26.pdf` 兩份 |
| W4 | week9 18 | 協同過濾投影片 `collaborativefiltering21.pdf` | 課表掛 `collaborativefiltering26.pdf` |
| W5 | week8 18、46、48、116（en 18、42、84） | Lab 4 連到 `Lab4_LargeLanguageModels.md` | **404**。現在的檔名是 `Lab4_Agent.md` |
| W6 | week9 18、125（en 18、91） | Lab 5 連到 `Lab5_Chatbots.md` | **404**。現在的檔名是 `Lab5_LargeLanguageModels.md` |
| W7 | week3、4、5、6 多處 | 指定閱讀連到主目錄 `slp3/N.pdf` | 第 2–6、11 章章號未變，連結仍對得上內容，但頁碼以 `old_aug25/` 為準；與總覽「用 `old_aug25/`」的建議不一致 |

舊檔名的投影片（W1、W3、W4）連結仍是 200，只是不是當季課表掛的版本。W5、W6 是壞連結，優先修。

另外兩處小出入：

- week1 第 11 行 tldr：「用 PA0 建好後續九週共同使用的 Jupyter 環境」。總覽（88 行）與 PA6a README 都說第 7 週起不用 notebook。
- week8 第 40 行說 Cartesia 免費方案足以完成作業，這是對的；與它矛盾的是總覽 188 行（S1）。

## nit 清單

| # | 位置 | 問題 | 建議 |
|---|---|---|---|
| N1 | zh／en 221 | 「課表上的影片連結都指向 Canvas」。課表上實際有連結的只有 PA0 的兩支安裝影片，其餘預錄影片只標「Canvas Videos」沒有連結 | 改成「預錄影片放在 Canvas」 |
| N2 | zh 149 | 「前幾年這兩門只是建議」。原文是 optional，英文版寫 optional | 改「非必修」；這句是唯一殘留的沿革，也可整句刪 |
| N3 | zh／en 142–149 | 原文允許同時修（"or taking CS107 or CS1U concurrently"、"You may take them concurrently"）與同等機率背景，文中沒提 | 加半句「可以同學期一起修，有同等背景也算」 |
| N4 | zh／en 149 | UNIX 影片清單在 FAQ 裡是給「獲准免修 CS107 的人」（例如外系博士生）的 | 可不改；要精確就加「原本是給獲准免修 CS107 的學生」 |
| N5 | zh／en 66 | 第 10 週指定閱讀只列 *Networks, Crowds, and Markets*。課表另有 MR+S（Manning、Raghavan、Schütze《Introduction to Information Retrieval》）第 21 章 Link Analysis pp.421–433，那才是 PageRank 的閱讀 | 補上 |
| N6 | zh／en 203 | 「第 14 章 Phonetics」是簡寫，完整章名與下一列右欄相同 | 寫完整章名，併入 S7 |
| N7 | zh 14、59、80、88、178 | 「文本」「倒排索引」 | 見第 6 節，可改「文字分類」「反向索引」 |
| N8 | zh／en 216、230 | 「實作課二、三、五在 cs124/labs」。Lab 4 的題目（`Lab4_Agent.md`）也在同一個 repo | 改「實作課二到五」，並說明 Lab 4 是 PA7 分組與 Git 設定，沒有需要對的答案 |
| N9 | en 25、84、136 | 英文生硬 | 見第 5 節 |
| N10 | en 262、271、274 | 彎引號、標題大小寫 | 見第 5 節 |
| N11 | zh／en 255–256 | 「這是第 2 週的份量」：第 2 週還有編輯距離、n-gram、Lab 1，PA1 也還有正規表達式那一半。第 3 點說環境裝不起來先做 Lab 1，但 157 行說的是先做 PA0 | 改「這是第 2 週作業的一半」；第 3 點補上「先回 PA0 把環境裝好」 |

另一個可選的小修：zh／en 49「attention、取樣與 perplexity｜第 7 週」，perplexity 在第 2 週的 n-gram 章就教過（SLP 3.3），第 7 週是在 Transformer 上再算一次。230 行「數字小到可以手算驗證」對 PA5 神經網路有點勉強。
