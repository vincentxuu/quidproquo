# 修改紀錄：ADL 2025 第 8 堂（RAG）導讀

日期：2026-10-13。依 `rereview-lecture-08.md`（複審報告）修改，`review-lecture-08.md` 供參考。

檔案：

- `src/content/posts/ai/2026-09-30-ntu-adl2025-rag-hw3.md`（zh）
- `src/content/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en.md`（en）

查證方式：字幕與逐字稿用關鍵字取出前後文對照；講義第 9、47、48、59 頁用 `pdftotext -layout` 取文字，第 9、48 頁另外轉圖讀過（圖檔在 scratchpad 的 `fix-08/`）。行號是複審報告的行號（修改前）。

## 已改（13 項，其中 B4、B5 各含兩處）

### A1（S7）「近期最常用」的範圍與語氣

- 依據：8.2 18:01。「那這個其實是我覺得近期最常使用的，所以你可以看不管是openAI啊，或者是google，他們都有直接推出這種就是LM-based的這種embedding」；之後才說「在建置 RAG 的情況中，尤其是產業界最常被使用的，因為它就不用任何的 training data，我們直接用一個 pre-trained embedding」。報告屬實。
- zh L141 改前：老師說這是近期最常用的做法，各家都有直接提供 embedding 的 API，業界建 RAG 最常這樣做，因為不需要任何訓練資料。
- zh 改後：老師說她覺得後面這種以語言模型為底的 embedding 是近期最常用的，OpenAI 與 Google 都有直接提供 embedding 的 API。直接拿預訓練好的 embedding 來用，也是業界建 RAG 最常見的做法，因為不需要任何訓練資料。
- en L138 改前：She says this is the most used approach recently, every vendor offers an embedding API, and it is what industry most often does when building RAG, since it needs no training data.
- en 改後：She says she finds the latter, LM-based embeddings, the most used recently, with OpenAI and Google both offering embedding APIs. Using a pre-trained embedding as it is is also what industry most often does when building RAG, since it needs no training data.

### A2（S8）HW3 模型「行為不同」

- 依據：hw3.txt 20:16–20:28。「1.7B的模型跟你們作業二所接觸到的4B模型可能他在行為上也會有一些差異」。報告屬實。
- zh L388 改前：這次的 1.7B 模型和 HW2 的 4B 模型行為不同，prompt 要依手上的模型調整。
- zh 改後：這次的 1.7B 模型和 HW2 的 4B 模型在行為上可能有些差異，prompt 要依手上的模型調整。
- en L385 改前：…this 1.7B model behaves differently from the 4B model in HW2, and the prompt has to be tuned to the model at hand.
- en 改後：…this 1.7B model may behave somewhat differently from the 4B model in HW2, so the prompt has to be tuned to the model at hand.

### A3（S8）「校外的讀者拿不到資料集」

- 依據：hw3.txt 00:16 只有「那在slide裡面有我們這次作業的連結」與討論區；全文沒有提到資料集公開與否。報告屬實。
- zh L390 改前：校外的讀者拿不到資料集。想練習的話，…
- zh 改後：說明影片只說作業連結放在作業投影片裡，沒有提供公開的資料集連結。想練習的話，…
- en L387 改前：Readers outside the course cannot get the dataset. To practice, …
- en 改後：The briefing only says the assignment link is in the homework slides and gives no public dataset link. To practice, …

### A4（S8）「HW3 沒有公開的規格文件」

- 依據：hw3.txt 00:16「在slide裡面有我們這次作業的連結」、11:00「那這是我們要上傳的file structure」、17:40「前面這張圖就是在第一頁裡面」。助教是照著投影片講的；投影片公不公開，來源沒有。報告屬實。
- zh L377 改前：HW3 沒有公開的規格文件，下面整理自說明影片的助教口述。
- zh 改後：說明影片是照著一份作業投影片講的，本文手上沒有那份投影片，下面整理自助教的口述。
- en L374 改前：HW3 has no public spec document; what follows is from the TAs' spoken briefing in the video.
- en 改後：The briefing follows a homework slide deck that this guide does not have; what follows is from the TAs' spoken briefing in the video.

### A5（S11）指標名詞沒有解釋

- 依據：hw3.txt 08:38–09:02。「K 是設定為10……找回來的 Top 10 的 Passages，那如果這 Top 10 Passage 中有正確的 Passage，這個 Record（Recall）就會加1，那 MR（MRR）的部分則是看正確 Passage 在這四個中的排序是多少，那越高越好」。NDCG@10：8.3 只有「這邊就是只 evaluate 在你搜尋的對不對的 performance 上面」，沒有定義。EM、BLEU、F1：字幕沒有解釋。報告屬實。
- (1) HW3 評估。zh L384 改前：**評估**：Recall@10、MRR@10（看 retriever 加 reranker 找回的前 10 段），以及 LLM 的答案與標準答案的句向量相似度。
  - zh 改後：**評估**：Recall@10 與 MRR@10，看 retriever 加 reranker 找回的前 10 段。前 10 段裡有正確的段落，Recall 就算命中；MRR 看正確的段落排在第幾名，越前面越好。另外還有 LLM 的答案與標準答案的句向量相似度。
  - en L381 改前：**Evaluation**: Recall@10 and MRR@10 (on the top 10 passages returned by retriever plus reranker), and the sentence-embedding similarity between the LLM's answer and the gold answer.
  - en 改後：**Evaluation**: Recall@10 and MRR@10, on the top 10 passages returned by retriever plus reranker. Recall counts a hit when the correct passage is among the top 10; MRR looks at where the correct passage ranks, the higher the better. There is also the sentence-embedding similarity between the LLM's answer and the gold answer.
- (2) NDCG@10（來源外，標成本文補充）。zh L250 改前：結果以 NDCG@10 計：
  - zh 改後：結果以 NDCG@10 計。這是衡量前 10 名排序品質的指標，越高越好（這句說明是本文補充，老師只說這張表評的是搜尋得對不對）：
  - en L247 改前：Results in NDCG@10:
  - en 改後：Results are in NDCG@10, a measure of ranking quality over the top 10 results where higher is better (this gloss is added by this post; she only says the table evaluates whether the search is right):
- (3) EM、BLEU（連同同表的 F1；來源外，標成本文補充）。在 XOR-TyDi QA 表格（zh L187–191、en L184–188）下新增一段：
  - zh 新增：本文補充（老師沒有解釋這三個指標）：EM 是 exact match，看答案和標準答案是否完全相同；F1 與 BLEU 看答案和標準答案在用詞上重疊多少。三者都是越高越好。
  - en 新增：Added by this post (she does not explain these three metrics): EM is exact match, whether the answer is identical to the gold answer; F1 and BLEU measure how much the answer's wording overlaps with the gold answer. Higher is better for all three.
- perplexity 沒有另外加說明：第 7 堂導讀（`…post-training-rlhf.md` L377）已有一句解釋，本篇 L181 也寫了算的方式。

### B1（S5）第 9 頁兩個結論框

- 依據：第 9 頁讀圖。總統例子下面的黃框是「Pre-training data is outdated」，護士例子下面的黃框是「Generation follows the distribution in the pre-training data」。報告屬實。
- zh L85 改前：投影片的結論是 Generation follows the distribution in the pre-training data，它帶來兩個後果：
- zh 改後：投影片在兩個例子下面各放一句結論：Pre-training data is outdated，以及 Generation follows the distribution in the pre-training data。對應兩個問題：
- en L82 改前：The slide concludes that generation follows the distribution in the pre-training data, which has two consequences:
- en 改後：The slide puts one conclusion under each of its two examples: "Pre-training data is outdated" and "Generation follows the distribution in the pre-training data." They correspond to two problems:

### B2（S4）roadmap 表格的「每個 token」

- 依據：第 48 頁讀圖，Tokens → Output layer 只有一條箭頭連到 Adaptively，When 欄沒有「每個 token」；第 47 頁文字「kNN-LM requires retrieval for each token → inefficient」。報告屬實。
- zh：表格（L275–282）下新增「表中 kNN-LM 的「每個 token」不在 roadmap 圖上，出自第 47 頁的文字。」
- en：表格（L272–279）下新增 "The "every token" entry for kNN-LM is not on the roadmap figure; it comes from the text on slide 47."

### B3（S12）第 59 頁

- 依據：第 59 頁文字（When to use RAG? Long-tail knowledge／Knowledge update／Interpretability／Safety / Privacy）；8.5 15:00「如果我的情況是有這個privacy，或是safety的情況，我希望我的document不要外洩……就不要微調上去」。報告屬實。
- zh：在 L361（六個優點那段）之後新增「第 59 頁用一個問題收尾：什麼時候該用 RAG？投影片列了四種情況：要用到長尾知識、知識會更新、需要可解釋性、有安全或隱私的考量。老師對最後一項的說明是，不希望文件外洩時，就不要把它微調進模型裡。」
- en：在 L358 之後新增 "Slide 59 closes with one question: when to use RAG? It lists four cases: long-tail knowledge, knowledge updates, interpretability, and safety or privacy. On the last, she says that when documents must not leak, they should not be fine-tuned into the model."

### B4（S8）HW3 兩個細節

- (1) 依據：hw3.txt 02:17「LLM的部分是QM3 1.7B BF16版本」。
  - zh L381 改前：LLM 是 Qwen3 1.7B。
  - zh 改後：LLM 是 Qwen3 1.7B（逐字稿聽作「QM3」，名稱是本文推定的）。
  - en L378 改前：the LLM is Qwen3 1.7B.
  - en 改後：the LLM is Qwen3 1.7B (the transcript hears "QM3"; the name is this post's inference).
- (2) 依據：hw3.txt 17:45–17:59「LM就會產生一個Response，那我們要跟Answer去比對一個相似度，我們這邊給同學的例子就是，我們可以拿這個相似度去當做 reward（逐字稿作 revert），然後去train一個RL-based的multilayer perceptron」。
  - zh L386 改前：用強化學習訓練一個小模型，動態決定要放幾段 passage 給 LLM。
  - zh 改後：用強化學習訓練一個小模型（助教舉的例子是多層感知器，reward 用 LLM 的回答與標準答案的相似度），動態決定要放幾段 passage 給 LLM。
  - en L383 改前：train a small model with reinforcement learning to decide dynamically…
  - en 改後：train a small model with reinforcement learning (the TA's example is a multilayer perceptron, rewarded by the similarity between the LLM's response and the answer) to decide dynamically…

### B5（S13）用詞（只有中文版）

- (1) zh L181 改前：算法和算 perplexity 一樣 → 改後：算的方式和算 perplexity 一樣。依據：8.6 12:55「就跟你算 perplexity（逐字稿作 publicity）一樣」，指的是算的方式。
- (2) zh L122、L131「詞表」→「詞彙表」（兩處）。依據：8.2 12:00 老師口述「我們有一個詞典」。
- 英文版用的是 vocabulary、"The computation is the same as for perplexity"，沒有這個問題，不需要改。

### B6（S9 延伸）L284 的問題

- 依據：8.6 19:06–19:09「為什麼Modular的RAG，跟一開始的RAG差別那麼多」。報告屬實。
- zh L284 改前：課堂問答裡有同學問為什麼現在的 RAG 和它差這麼多
- zh 改後：課堂問答裡有同學問為什麼 modular 的 RAG 和一開始的 RAG 差這麼多
- en L281 改前：In the Q&A a student asks why today's RAG differs so much from it
- en 改後：In the Q&A a student asks why modular RAG differs so much from the original RAG

### 任務指定的通則

- en L391 改前：These are my own summary, not points listed one by one in the lecture. → 改後：This list is my own summary, not something the lecture enumerated point by point.
- 英文版第一次提到講者（L46）原本就是 "Professor Chen opens with two questions"，之後才用 she，不需要改。
- 中文版沒有「優化」；改掉「算法」「詞表」之後，再掃一次這三個詞都是零筆。
- 粗體：中文版 11 處 `**詞（說明）**` 後面接的都是句號「。」，不是直接接中文字，沒有改。

## 不改

- B7（S10、S14、S15）：複審報告本身判定「維持現狀即可」。S10（Google 一次 100 筆）四個要點與 8.6 21:54–22:32 相符；S14 是標題，任務規定不改 title；S15 的「哪些法律規範」是更正投影片錯字後的引用，第 18 頁的 KL divergence 文章沒有寫也不是錯誤。
- 複審報告「已確認修正正確」的 M1–M3、S1–S3、S6、S8（rewrite、禁忌）、S9：上一輪已改，這次沒有動。
- 「未驗證」一節（影片長度與標題、學期日期、arXiv 連結、渲染後的頁面）：屬於流程面，指定來源無法查，沒有動。

## 檢查

- `check-course-titles.mjs`：Course title gate: 0 issue(s)
- `check-course-guide-layout.mjs`：Course source layout: 1716 posts, 0 issue(s)
- 沒有動 frontmatter 的 title、date、series，沒有改檔名，沒有 commit。
- 沒有看渲染後的頁面。
