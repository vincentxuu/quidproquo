# 獨立審稿報告：ADL 2025 第 8 堂（RAG）導讀

審稿日期：2026-10-13。審稿者未參與撰寫，只審查、未修改文章。

## 審查對象與版本

| 檔案 | sha256 |
|---|---|
| `src/content/posts/ai/2026-09-30-ntu-adl2025-rag-hw3.md`（zh-TW，518 行） | `65577ff85d502ad74504e80a51c21c458e0f6b4a220d6479bb6775324a10151b` |
| `src/content/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en.md`（en，515 行） | `a215ebf38063a0a603d5bd92db676dd0a8e759fd835bd6a1490cc0c3cb4c8ab9` |

兩檔都是工作區未提交的版本（`git status` 為 ` M`）。文章再改動後，本報告不再適用，需複審。

## 我實際做了什麼

- 讀完 `lecture-08-captions.txt`（8.1–8.5 全文）、`8.6.txt`、`hw3.txt` 全文。
- 講義 60 頁：全部以 `pdftotext -layout` 取出文字；下列頁面另外轉成 PNG 讀圖：3、6、8、9、12、13、14（170 dpi）、15、16、17、19、21（170 dpi）、28、29、30、33、35、37、38（170 dpi）、40、42、43、45（170 dpi）、47、48、49、50、51、52、55、56。圖檔在 `scratchpad/review-l8/`。
- 只用文字抽取、沒有讀圖的頁面：2、4、5、7、10、18、23、25、26、27、53、54、57、58、59（這些頁是純文字或文字已完整抽出）。roadmap 的中間幾頁（32、34、36、39、41、44、46）只看文字抽取，圖只看了最後完整的第 48 頁。
- 重算三個例子與自我檢查第 4、6 題。
- 跑了 `check-course-titles.mjs`（兩檔，0 issue）與 `check-course-guide-layout.mjs`（0 issue）。
- 掃過中文版的中國用語。
- 逐段比對英文版與中文版。

## 結論

整體忠於來源。逐項核對的數字、公式、例句、文獻年份幾乎全部對得上，沒有發現會改變概念或結論的錯誤。有三處屬於來源忠實度的小問題需要修（一處頁碼與公式形式對不上、一處表格內容沒有字幕依據、一處把老師的話說重了），其餘是建議。

- 身分／標題：通過。
- 事實：三項必修，其餘確認無誤。
- 教學品質：學習目標、機制、三個完整例子、常見誤解、附答案的自我檢查都齊備；有幾個指標名詞沒有解釋，列在建議。

---

## 必修

### M1. kNN-LM 混合式的頁碼與式子形式對不上

- zh L296–298：「混合的式子在第 47 頁：P(y | x) = (1 − λ) P_LM(y | x) + λ P_kNN(y | x)」；zh L302：「上面式子裡的 λ 因此變成隨輸入而變的 λ(x)。」
- en L293–295、L299 相同。
- 來源實際內容（已讀圖）：
  - 第 45 頁 Interpolation 方塊裡的式子才是固定 λ 的版本：`p(y) = λ p_kNN(y) + (1−λ) p_LM(y)`。
  - 第 47 頁的式子已經是 λ(x) 的版本：`P_kNN-LM(y|x) = (1 − λ(x)) P_LM(y|x) + λ(x) P_kNN(y|x)`。
- 問題：文章說固定 λ 的式子「在第 47 頁」，接著又說它「變成」λ(x)，但第 47 頁上本來就是 λ(x)。兩個形式數學上沒錯，錯的是頁碼歸屬。
- 修法：固定 λ 的式子改標第 45 頁，λ(x) 的式子標第 47 頁。

### M2. bi-encoder／cross-encoder 表格有一格沒有字幕依據

- zh L152：「| 成本 | 低：passage 的向量可以事先算好 | …」；en L149：「Low: passage vectors can be computed in advance」。
- 表格前一句是「老師接著講兩種常見的架構」，讀者會當成老師的說法。
- 字幕實際內容（8.2 約 21:00–24:00）：老師只說 bi-encoder 的 query 與 document「不用兩兩組合在一起，它等於是這兩個是獨立切開的，所以下面這一個（cross-encoder）的 complexity 是會比較高的」。全段沒有提到 passage 向量可以預先算好。
- 這是正確的工程常識，但屬於本文補充。修法：改成老師的說法（兩邊分開編碼，不必每一對都組合起來跑），或把「可以事先算好」標成本文補充。
- 表格其餘七格都有字幕依據（見「無誤確認」）。

### M3. 「最大的缺點」說重了

- zh L248：「老師說這是 pairwise 最大的缺點。」；en L245：「She calls this the biggest drawback of pairwise.」
- 字幕實際內容（8.3 約 03:00–06:00）：「所以 pair-wise 它的 complexity 比較高，那當然是一個比較大的缺點」。
- 老師說的是「比較大的缺點」，不是「最大的」。修法：改成「老師說這是一個比較大的缺點」／"a fairly big drawback"。

---

## 建議

### S1. TF-IDF 例子的「本文的觀察」標示：夠用，但可以更清楚

- zh L129、en L126。標示放在整個「結果與意義」條列的最後一句（「這一點是本文的觀察，老師在課堂上沒有討論這個例子的排序。」），前面有四句話，「這一點」指到哪裡不明確：讀者讀到 d₁「和 NLP 無關」「d₂ 才是答案」時還不知道這是本文的判讀。
- 另外，字幕裡完全沒有出現 q = what is nlp 這個例子（8.2 12:00–15:00 只講 TF-IDF 的概念與「大型語言模型／LLM」的例子），所以不只是「沒有討論排序」，是整個例子老師都沒有口頭講解。
- 建議：把標示移到條列開頭，例如「結果與意義（以下是本文的觀察，老師沒有口頭講解這張表）」。
- 判定：現在的寫法沒有冒充老師，例子標題也寫了「投影片的數字，本文重算」，所以列為建議而非必修。

### S2. 「老師的理由和上一堂 reward model 的討論一樣」

- zh L243、en L240。8.3 的字幕裡老師沒有提到上一堂或 reward model，只說絕對分數「沒有一個明確的基準」「沒有校準得很好」。兩堂的理由相同是本文的連結（我查了第 7 堂導讀 L419，內容確實對應，但沒有對第 7 堂的字幕）。
- 建議改成不會被讀成老師口述的寫法，例如「老師的理由是……（這和上一堂 reward model 用成對比較的原因相同）」。

### S3. hybrid search：投影片與口述不一致，文章沒有交代

- zh L229：「Fusion retrieval／hybrid search：sparse 與 dense 一起用。」
- 第 25 頁寫的是 "sparse and dense retrieval **in parallel**"；老師口述（8.3 約 00:00–03:00）是「hybrid 就是先 sparse 先縮小一點範圍，然後再用 dense 的」，是先後串接。
- 「一起用」兩邊都說得通，但把差異蓋掉了。契約要求會改變概念的來源衝突要保留，建議補一句兩種說法。

### S4. roadmap 表格的「每個 token」不在 roadmap 圖上

- zh L281、en L278。文章說「把各頁的圖合起來是這張表」。第 48 頁的圖上，Tokens → Output layer 只有一條箭頭連到 Adaptively，「When」欄沒有「每個 token」這個節點；kNN-LM 每個 token 都查，出自第 47 頁的文字（"kNN-LM requires retrieval for each token"）與口述。
- 內容正確，只是來源不是 roadmap 圖。可在表格下加一句說明，或把該格改成「（第 47 頁：每個 token）」。
- 同一處：投影片寫的是 "Efficient NN-LM (He+, 2021)"，文章寫「Efficient kNN-LM」。老師口述是「efficient 的 kNN-LM」，可接受。
- RETRO 那一列的「—」與圖相符（Intermediate layers 沒有箭頭連到 When 欄）。

### S5. 第 9 頁有兩個結論框，文章合成一個

- zh L85：「投影片的結論是 Generation follows the distribution in the pre-training data，它帶來兩個後果」。
- 第 9 頁實際有兩個黃框：總統例子下面是 "Pre-training data is outdated"，護士例子下面才是 "Generation follows the distribution in the pre-training data"。文章把第二個框當成總結、把「過時」當成它的後果之一。意思沒有走樣，但不是投影片的結構。

### S6. 「不超過 80 個 token」

- zh L201：「不超過 80 個 token」；en L198：「under 80 tokens」。第 21 頁原文是 "less than 80 tokens"。中文版應為「少於 80」，並與英文版一致。

### S7. 「近期最常用」指的範圍

- zh L141 把「老師說這是近期最常用的做法」放在「現成的 embedding」整條（BERT 與 GPT 兩者）後面。字幕（8.2 18:01 起）這句話接在 GPT／LM-based embedding 之後：「這個其實是我覺得近期最常使用的……都有直接推出這種 LM-based 的 embedding」。建議讓這句話明確接在 LM-based embedding 上。

### S8. HW3 一節與逐字稿的出入

逐項對過 `hw3.txt`，沒有發現與逐字稿矛盾的內容。下列是文章寫了但逐字稿沒有明說，或是省略的地方：

| 位置 | 文章 | 逐字稿 | 判定 |
|---|---|---|---|
| zh L381 | LLM 是「Qwen3 1.7B」 | 02:17「QM3 1.7B BF16 版本」 | 「Qwen3」是從誤聽推定的；文章 L377 有總括的免責聲明，但這一個名稱可以個別標「逐字稿聽作 QM3」 |
| zh L381 | reranker 是「MS MARCO 的 MiniLM 系列」 | 02:12「MS Macro Mini LM L10 V2」 | 文章刻意不寫層數，處理得當 |
| zh L382 | 「改寫過的 query」 | 03:34「rewriter column 裡面就是 query 的 content」 | 逐字稿只說欄位名稱，沒說 query 經過改寫；建議寫成「rewrite 欄位放 query 內容」 |
| zh L385 | 不能做的事列兩項 | 10:13–10:33 的「禁忌」有三項：不用額外訓練資料、不把 test data 拿來微調、不要嘗試找出 private test data | 漏第三項 |
| zh L386 | 「訓練一個小模型」 | 17:54「RL-based 的 multilayer perceptron」 | 可寫明是 MLP；reward 用回答與答案的相似度（17:50）也可補 |
| zh L388 | 「行為不同」 | 20:16「可能他在行為上也會有一些差異」 | 原話有保留語氣 |
| zh L390 | 「校外的讀者拿不到資料集」 | 逐字稿沒有這句（只說作業連結在投影片、討論在 NTU COOL） | 沒有來源，我無法驗證 |
| zh L377 | 「HW3 沒有公開的規格文件」 | 逐字稿沒有這句 | 我另外抓了課程頁：HW 3 的連結只指向這支 YouTube 影片，與此說法一致；但這不在指定來源內 |

逐字稿有、文章沒寫但不影響正確性的：每個 query 恰有一個正例（03:21）；test data 的 evidences 可能不含正例（04:46）；retriever 兩邊共用權重（01:32）；距離用 cosine similarity（05:49）；句向量模型是 all-MiniLM-L6-v2（09:14）；不得修改 inference 腳本（09:19）；繳交期限 11/3。

### S9. 課堂問答：問題是改寫過的

- 五題的回答都對得上 `8.6.txt`，沒有曲解。但問題本身是本文改寫：
  - 「Reasoning 和 RAG 是什麼關係？」原題（15:34）是「Generation Augmented Retrieval 和 Reasoning 差別是有沒有拿到網路上的真實資料」。
  - 「為什麼不幫每筆資料加上時間」原題（09:54）問的是加 positional embedding 讓模型學時序；老師先說明 positional encoding 是字在句中的位置、不是時間，再把問題改解成「加上時間描述」。
  - 「為什麼現在的 RAG 和它差這麼多」（zh L284）原題（19:06）是「為什麼 Modular 的 RAG 跟一開始的 RAG 差別那麼多」。
- 建議在該節開頭加一句「問題經本文改寫」。

### S10. Google 一次 100 筆那段

- zh L370、en L367：如實。逐字稿 21:54–22:32：以前有一個引數可以設 100、一次看 100 筆回來的結果；那個 argument 消失了；現在一次給 10；原本搜一次 100 個，現在要搜 10 次；成本變高很多。文章四個要點（100、參數不能用、10、要搜 10 次、成本高）都對。
- 文章省略了兩個細節，可以考慮補：老師說這是「近期有一個算是新聞」；以及這個引數「一開始也沒有說是一個 valid argument，是大家試出來的」。
- 文章把這個例子放在「搜尋引擎那一段你控制不了」之後當例證，逐字稿裡例子在前、結論在後，意思一致。

### S11. 沒有解釋的指標名詞

- NDCG@10、MRR@10、Recall@10、EM、BLEU、perplexity 在文中直接使用。契約要求未在系列教過的先備要有可到達的橋接連結。HW3 一節裡逐字稿其實有 Recall@10 與 MRR 的口頭定義（08:40–09:02：前 10 段裡有正確段落就算命中；MRR 看正確段落排第幾），可以直接用。NDCG@10 至少加一句「看前 10 名排序品質的指標，越高越好」。
- 字幕 8.2 12:00 老師說 TF-IDF「之前在 representation 那邊有講過」，可以連回系列裡對應的那一堂。

### S12. 第 59 頁沒有寫

- 第 59 頁 Concluding Remarks（When to use RAG：long-tail knowledge、knowledge update、interpretability、safety／privacy）文章沒有對應段落。8.5 15:00 老師有口頭總結。不是錯誤，可用一小段收尾。

### S13. 用詞

- 中文版沒有出現指定清單裡的中國用語（質量、信息、視頻、默認、反饋、優化、技術棧、窗口等，以及我另外加掃的文檔、數據、用戶、網絡、代碼、搜索、概率、調用、通過、實現、場景、性能等，全部零筆）。
- 兩個可斟酌的詞：
  - zh L122、L131「詞表」：台灣較常寫「詞彙表」，老師口述是「詞典」／vocabulary。
  - zh L181「算法和算 perplexity 一樣」：這裡是「算的方式」，不是 algorithm，但字面容易被讀成中國用語的「算法」。建議改「算的方式」。

### S14. 標題與 HW3

- 檔名帶 `hw3`、文中有一整節 HW3，標題只寫「第 8 堂」。`check-course-titles.mjs` 通過。契約有「跨活動用 ／ 連接」的寫法（第 8 堂／作業 3），但這一節只是轉述說明影片、不是作業教學，維持現狀可以接受。列出供作者判斷。

### S15. 零碎

- zh L330 引用第 53 頁的問題寫「哪些法律規範」，投影片原文是「那些法律規範」（投影片的錯字）。文章用引號，可維持更正後的寫法。
- zh L179「機率高的當成正例」與口述一致（8.2 27:00–30:00）。第 18 頁的圖實際上是把語言模型的分數過 softmax、與 retriever 的分布算 KL divergence（軟標記），文章沒有寫。不是錯誤。

---

## 無誤確認

以下都是我實際對過來源的項目。

### 第 2–10 頁

- 第 2–3 頁：蔡英文的回答又長又正確；Taiwan-LLM 把陳縕儂說成電機系教授、史丹佛博士、研究半導體元件；投影片以紅色刪除線劃掉錯處（讀圖）；「有一些是正確的，但其實也蠻大部分很多是錯誤的」（8.1 00:00）；結論句 "LLMs cannot memorize all details about long-tail information"。
- long tail 的說明與考試比喻（8.1 03:00）。
- 第 4 頁：同一模型先搜尋再答，資訊系教授、卡內基美隆博士、語言理解與對話系統；結論句用 reducing；老師強調 reduce 不是 resolve（8.1 06:01）。
- 第 5 頁：「台灣現任總統是誰？」答蔡英文；knowledge editing (Hsueh+, 2024)；繼續訓練會同時存在兩種答案、沒有時間順序；「現任總統的爸爸」要連帶更新（8.1 09:00）。
- 第 6 頁：WebGPT (Nakano et al., 2021)；哈利波特與魔戒哪個字數多；在 GPT-3 上做監督式微調；比 ChatGPT 早一點（8.1 12:00）。
- 第 7 頁：「川普最新聲明是甚麼？」、`[SEARCH] Trump's latest post [END]`、`[CLICK] 1 [END]`、"Supervised learning of human actions"，逐字相符。
- 第 8 頁：Gemini、Google Search、Query successful（讀圖）。
- 第 9 頁：「我好朋友是護士，」、「她／他對待病人很有耐心」，她的長條明顯較長（讀圖）；過時資訊難以在預訓練時濾掉（8.1 21:00）。
- 第 10 頁：四個限制逐條相符；停修／選課問答系統的例子（8.1 24:00）。

### RAG 框架（第 12–23 頁）

- 第 12 頁：Query、Documents（Open-Sourced／Close-Sourced）、Indexing、Retrieval、Prompt、LLM（有雪花）、Output。
- indexing：圖書館、編號、先依主題分群（8.2 00:00–03:00）。
- 第 13 頁與切段：稀釋、300 token、重疊、切在句尾、太細與太粗的取捨、法規的例子（8.2 06:02–09:00）。
- 第 14 頁（170 dpi 讀圖，逐格核對）：維度 what、candy、nlp、is、language；q = (0.33, 0, 0.33, 0.33, 0)；d₁ = (0.25, 0.125, 0, 0.25, 0)；d₂ = (0, 0, 0.125, 0.125, 0)；d₃ = (0, 0, 0.125, 0, 0)；q·d₁ = 0.165、q·d₂ = 0.0825、q·d₃ = 0.0413；d₁ =「what is life ? candy is life !」、d₂ =「nlp is an acronym for natural language processing」；BM25 公式在頁面上。全部相符。
- 第 15 頁：Off-the-shelf（Pre-trained BERT、Pre-trained GPT）、Learned embeddings w/ contrastive learning：DPR (Karpukhin+, 2020)、Contriever (Izacard+, 2022)；CosSim。
- bi／cross 表格有字幕依據的七格：兩者的做法；bi 效果較差因為看不到對方、cross 可以直接做 attention；cross 成本高因為每一對都要接起來跑；bi 用在檢索、cross 用在 reranking（8.2 18:01–24:01）。共用或分開權重與理由、30 份候選、「除非文件不多」也都有。
- 第 16 頁：美國哪一州面積最大、英文正例、兩份中文負例、Inner Product、`L = −log e^{s(q,d⁺)} / Σᵢ e^{s(q,dᵢ)}`、"Paired training data is difficult to collect"；一正配五負、Google／Microsoft（8.2 24:01–27:00）。
- 第 17 頁：`P(q | d)`；出處 "Improving Passage Retrieval with Zero-Shot Question Generation, Sachan et al., 2023"（文章沒寫年份，不衝突）。
- 第 18–19 頁：Huang & Chen, 2024；日文問題配英文文件；XOR-TyDi QA 九個數字全對（F1 7.2／43.5／44.9，EM 3.3／33.5／34.7，BLEU 6.3／31.1／32.5）；橘色 CORA、紅色 UMR；結論句相符。
- 第 21 頁（170 dpi 讀圖）：三個重點與原文相符（除 S6 的「不超過」）。
- 第 23 頁：五個問題逐條相符；角色扮演攻擊的例子、法規的例子（8.2 36:02–39:00）。

### Advanced RAG（第 24–30 頁）

- 第 25 頁：Pre-retrieval 四項、Post-retrieval 兩項，共六項，名稱與歸類相符；老師的補充說明都有字幕（8.3 00:00–03:00）。
- 第 26 頁：pointwise 1 到 5 分、pairwise A 或 B、"Pairwise reranking is more accurate"；3 與 4 的例子、linear 與 n 平方（8.3 03:00）。
- 第 28 頁：NDCG@10 九個數字全對（BM25 50.58／47.96／38.01；MonoT5-3B 71.83／68.89／46.65；InstUPR-pair 70.53／68.55／46.63）；老師的解讀（8.3 06:02）。
- 第 29 頁：`L = L_CL + λ_KD·L_KD + λ_pair·L_pair`；反覆訓練；不需要留 LLM reranker（8.3 06:02–09:01）。
- 第 30 頁：2015 AFL Rising Star、Jesse Hogan、第一輪 198 cm（紅字，錯）、第二輪 1.95 m；multi-hop。

### Roadmap（第 31–48 頁）

- 表格六列與第 48 頁的圖相符（除 S4 的一格）；文獻與年份全對；ACL 2023 tutorial。
- RAG (Lewis+, 2020)：end-to-end、一起訓練、以向量進 generator、retriever 給權重（8.4 00:00–03:00；第 33 頁）。這些是老師的說法，我沒有對原論文。
- RETRO：ATTN 與 FFW 之間插 CCA（讀圖）；"More efficient than injecting in the input layer → training required"；少用的原因（8.4 03:00–06:01）。
- 第 37–38 頁：World Cup 的例子；117M 由 34.7 到 29.5、1.5B 由 18.6 到 16.4（170 dpi 讀圖）；橫軸 64 到 1；小模型進步較多；結論句。
- 第 40 頁 FLARE：Joe Biden 摘要、第一句（1942 年 11 月 20 日、第 46 任）、賓州大學有底線、改寫為德拉瓦大學。
- 第 42 頁：Policy LLM、Search Engine、"Reward: answer correctness"；3B 與 GPT-4（8.4 12:00）。
- 第 43 頁："knowing what you know"、"Reward: answer correctness + correct decision making"；oversearch、8B 與 3B（8.4 15:05）。
- 第 45 頁（170 dpi 讀圖）：LM 的 Hawaii 0.2、Illinois 0.2；kNN 彙整後 Hawaii 0.8、Illinois 0.2；混合後 Hawaii 0.6；"Obama's birthplace is"、"Obama was born in"、"Obama is a native of"；結論句。
- 第 47 頁：graduated from 的例子、adaptive retrieval。

### 第 49–58 頁

- 第 49 頁：三類來源與子項相符；「任職於」的例子；表格三種用法（8.4 21:00–27:02）。
- 第 50 頁：GraphRAG (Peng+, 2024)，三欄，叉、叉、勾；結論句。
- 第 51 頁：Iterative、Recursive、Adaptive；下一頁的比喻；產品多半 adaptive、檢索段多半 recursive（8.5 00:00）。
- 第 52 頁：兩軸、Prompt Engineering 在左下、RAG 在上、Fine-tuning 在右。
- 第 53 頁：三條與口述（教科書、去修課、天書）。
- 第 54 頁：優缺點表六格與結論句相符；說話風格的例子（8.5 06:00）。
- 第 55–56 頁：四種訓練方式；LLM 固定訓練 retriever 較實際；目標「相關但不衝突」（8.5 09:01–12:02）。
- 第 57 頁：三類應用九個項目；諷刺的例子。
- 第 58 頁：六個優點；隱私的說明（8.5 12:02–15:00）。

### 三個例子與第 4、6 題（自己重算）

| 項目 | 文章 | 我算的 |
|---|---|---|
| q·d₁ | 0.165 | 0.33×0.25×2 = 0.165 |
| q·d₂ | 0.0825 | 0.33×0.125×2 = 0.0825 |
| q·d₃ | ≈ 0.0413 | 0.04125 |
| e² | ≈ 7.39 | 7.389 |
| 正例機率 | ≈ 0.79 | 7.389 ÷ 9.389 = 0.787 |
| 損失 | ≈ 0.24 | 0.2395 |
| 三個分數都是 0 | 1/3，≈ 1.10 | 1.0986 |
| 30 份 pairwise | 435 | 30×29÷2 = 435 |
| 第 4 題 | 1/4，≈ 1.39 | −ln(1/4) = 1.386 |
| 第 6 題 | 20 與 190 | 20 與 20×19÷2 = 190 |

另外順手驗了第 45 頁：0.6 = λ×0.8 + (1−λ)×0.2 時 λ = 2/3，數字自洽。

### 自我檢查十題

十題答案都正確，都能由正文推得：1（L92–97）、2（L131、L137）、3（表格與 L157）、4（L163 的式子）、5（L177–179）、6（L247）、7（L264–269）、8（AdaSearch 段）、9（kNN-LM 兩段）、10（L346 與第 54 頁表格）。第 2 題「Dense 有機會找到」用了保留語氣，恰當。

### 常見的誤解

七條都有正文依據，開頭標明「本文的歸納，不是課堂上逐條列出的內容」，沒有冒充老師：1（L57、L216）、2（L115–116）、3（L141）、4（L157）、5（L177–179）、6（第 38 頁與 AdaSearch 段）、7（課堂問答 L369）。

### 課堂問答

五題回答對過 `8.6.txt`：引用與 RAG（13:39–14:14）、檢索幾次（14:17–15:27）、reasoning 與 RAG 獨立（15:51–16:36）、搜尋引擎排序（20:54–23:55）、時間資訊（09:54–12:06）。另外兩處引用也對：query likelihood 的澄清（12:28–13:39）、RAG 名稱（19:06–20:26）。沒有曲解。

### 契約符合度

- 標題：中英都符合「主題：核心問題｜課名 第 N 堂」格式，課程與範圍一致；gate 0 issue。
- 學習目標：L43 五項，分別對應 L90–97、L99–118、L120–157、L271–302、L326–346。
- 機制：各節都有從問題到做法的說明。
- 完整例子：三個，各有條件、推理、結果與意義；兩個自擬例子標了「本文自編」，一個標了「投影片的數字，本文重算」。
- 常見誤解、附答案的自我檢查：齊備。
- 查核歷程：正文只在 L41 交代字幕與逐字稿的來源，屬於契約允許的來源底本說明；核對日期與方式放在文末來源區。沒有不當出現在教學主體。
- 版面順序：layout 檢查 0 issue。

### 中英對照

英文版與中文版段落一一對應，沒有漏段；所有表格、數字、公式、五題問答、HW3 八項、七條誤解、十題自我檢查都一致。英文版多一句 "The lectures are in Mandarin."，屬合理補充。唯一的數字語意差異是 S6（不超過／under）。M1、M2、M3 與 S1–S5 在英文版同樣存在。

---

## 我沒有驗證的項目

- 影片長度（27:32 等）與影片標題：只確認字幕最後一個時間戳不超過標示長度，沒有對 YouTube。
- 學期日期「2025/09/01–12/15」、「114-1」：來源裡沒有。
- 參考資料的 arXiv 連結與論文標題：沒有逐一開啟。
- 「校外的讀者拿不到資料集」：來源裡沒有。
- 老師的說法本身是否符合原論文（例如 Lewis 2020 的文件以向量進 generator、Search-R1 用 3B 模型接近 GPT-4）：只確認文章如實轉述並歸給老師。
- 第 7 堂的字幕：S2 的對照只看了第 7 堂導讀文章。
- 站內連結：只確認六個目標檔案（中英各六）存在，沒有看實際渲染的頁面。
