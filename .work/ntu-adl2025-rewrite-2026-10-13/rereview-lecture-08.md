# 複審報告：ADL 2025 第 8 堂（RAG）導讀

複審日期：2026-10-13。複審者未參與撰寫與第一次審查，只審查、未修改文章。

## 審查對象與版本

| 檔案 | sha256（複審時） |
|---|---|
| `src/content/posts/ai/2026-09-30-ntu-adl2025-rag-hw3.md` | `0b52a307d7f80d168f36e60abafa9dbd6e65dd9e37b6507b03d64614e64abc48` |
| `src/content/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en.md` | `1a46411c11da5e7d796be9d068abfc1cb67108dcec7d0e16cd62f00545b759f2` |

第一次審查的版本（sha `65577ff8…`、`a215ebf3…`）在 scratchpad 的 `l8/l8zh.md`、`l8/l8en.md` 還留著，雜湊相符。我用 `diff` 比對前後兩版：中英各改 12 行，沒有增刪行，所以第一次報告的行號仍然適用。

- zh 改動行：126、129、152、201、229、243、248、296、302、365、382、385
- en 改動行：123、126、149、198、226、240、245、293、299、362、379、382

除這 12 行以外，文章與第一次審查時逐字相同。

## 我實際做了什麼

- 讀完 `review-lecture-08.md`、兩篇文章全文。
- 讀完 `lecture-08-captions.txt`（8.1–8.5）、`8.6.txt`、`hw3.txt` 全文。
- 講義讀圖：第 14、15、21、25、45（170 dpi）、47（170 dpi）、48 頁。文字抽取：第 9、25、45、46、47、59 頁。圖檔在 `scratchpad/rereview-08/`。
- 為了 S2 另外查了 `lecture-07-captions.txt`（只搜 pairwise 一段）。
- 用 Python 重算三個例子、自我檢查第 4 與第 6 題、第 45 頁的 λ。
- 沒有重跑 `check-course-titles.mjs` 與 layout 檢查；沒有看渲染後的頁面。

## 結論

三項必修都已正確修正，沒有引入新問題。12 處改寫的句子逐句回到來源都有依據，中英一致。

第一次報告的建議有一部分沒有處理。其中我認為應該修的有五處（S7、HW3 的三句、S11），其餘是可修可不修。

---

## 仍需修改

以下各項在兩個版本都沒有改動（不在上面的 12 行之內）。依我判斷的重要程度排列。

### A. 建議要修

#### A1.（S7，未修正）「近期最常用」的範圍與語氣

- zh L141：「老師說這是近期最常用的做法，各家都有直接提供 embedding 的 API，業界建 RAG 最常這樣做，因為不需要任何訓練資料。」
- en L138：「She says this is the most used approach recently, every vendor offers an embedding API, and it is what industry most often does when building RAG, since it needs no training data.」
- 依據（8.2 18:01，已對字幕）：這句話接在 GPT 那一段後面，「那這個其實是**我覺得**近期最常使用的，所以你可以看不管是 openAI 啊，或者是 google，他們都有直接推出這種就是 **LM-based 的這種 embedding**」。接著才說「在建置 RAG 的情況中，尤其是產業界最常被使用的，因為它就不用任何的 training data，我們直接用一個 pre-trained embedding」。
- 問題有兩個：文章把這句放在 BERT 與 GPT 兩者之後，讀起來像兩者都是近期最常用；老師說的是「我覺得」，而且舉的是 OpenAI 與 Google，文章寫成「各家都有」。
- 建議文字：
  - zh：「……或預訓練好的 GPT，取整段輸入讀完之後的那個向量。老師說她覺得後面這種以語言模型為底的 embedding 是近期最常用的，OpenAI 與 Google 都有直接提供 embedding 的 API。直接拿預訓練好的 embedding 來用，也是業界建 RAG 最常見的做法，因為不需要任何訓練資料。」
  - en：「…or a pre-trained GPT, taking the vector after the whole input has been read. She says she finds the latter, LM-based embeddings, the most used recently, with OpenAI and Google both offering embedding APIs. Using a pre-trained embedding as it is is also what industry most often does when building RAG, since it needs no training data.」

#### A2.（S8，未修正）HW3 模型「行為不同」少了保留語氣

- zh L388：「助教最後提醒，這次的 1.7B 模型和 HW2 的 4B 模型行為不同，prompt 要依手上的模型調整。」
- en L385：「The TA closes by noting that this 1.7B model behaves differently from the 4B model in HW2…」
- 依據（hw3.txt 20:16–20:28）：「這個 1.7B 的模型跟你們作業二所接觸到的 4B 模型**可能**他在行為上也會**有一些差異**」。
- 建議文字：
  - zh：「助教最後提醒，這次的 1.7B 模型和 HW2 的 4B 模型在行為上可能有些差異，prompt 要依手上的模型調整。」
  - en：「The TA closes by noting that this 1.7B model may behave somewhat differently from the 4B model in HW2, so the prompt has to be tuned to the model at hand.」

#### A3.（S8，未修正）「校外的讀者拿不到資料集」沒有來源

- zh L390：「校外的讀者拿不到資料集。」；en L387：「Readers outside the course cannot get the dataset.」
- 依據：逐字稿沒有這句。逐字稿只說「在 slide 裡面有我們這次作業的連結」（00:16）、討論區在 NTU COOL。資料集是否公開，指定來源無法判斷。
- 建議文字：
  - zh：「說明影片只說作業連結放在作業投影片裡，沒有提供公開的資料集連結。想練習的話，……」
  - en：「The briefing only says the assignment link is in the homework slides and gives no public dataset link. To practice, …」

#### A4.（S8，未修正）「HW3 沒有公開的規格文件」與逐字稿有出入

- zh L377：「HW3 沒有公開的規格文件，下面整理自說明影片的助教口述。」；en L374：「HW3 has no public spec document…」
- 依據：逐字稿 00:16 提到有一份作業投影片（「在 slide 裡面有我們這次作業的連結」），11:00 也說「這是我們要上傳的 file structure」，顯然是照著投影片講。所以規格投影片存在；是否公開，指定來源裡沒有。第一次報告是另外抓課程頁才判斷「一致」，那不在指定來源內，我沒有重查。
- 這一項是推測成分較高的判斷：我確認的是逐字稿提到投影片，沒有確認它公不公開。
- 建議文字：
  - zh：「說明影片是照著一份作業投影片講的，本文手上沒有那份投影片，下面整理自助教的口述。」
  - en：「The briefing follows a homework slide deck that this guide does not have; what follows is from the TAs' spoken briefing in the video.」

#### A5.（S11，未修正）指標名詞沒有解釋

- zh L187（EM、BLEU）、L250（NDCG@10）、L384 與 L390（Recall@10、MRR@10）；en L184、L247、L381、L387。文章直接使用，沒有說明。
- 依據：Recall@10 與 MRR 在 hw3.txt 08:40–09:02 有口頭定義：「如果這 Top 10 Passage 中有正確的 Passage，這個 Recall 就會加 1」「MRR 的部分則是看正確 Passage……的排序是多少」。NDCG@10 在字幕裡沒有定義，老師只說「這邊就是只 evaluate 在你搜尋的對不對的 performance 上面」（8.3 06:02）。EM、BLEU 字幕沒有解釋。
- 建議文字（Recall、MRR 有來源；NDCG 的說明是本文補充，要標明）：
  - zh L384：「**評估**：Recall@10 與 MRR@10，看 retriever 加 reranker 找回的前 10 段。前 10 段裡有正確的段落，Recall 就算命中；MRR 看正確的段落排在第幾名，越前面越好。另外還有 LLM 的答案與標準答案的句向量相似度。」
  - en L381：「**Evaluation**: Recall@10 and MRR@10, on the top 10 passages returned by retriever plus reranker. Recall counts a hit when the correct passage is among the top 10; MRR looks at where the correct passage ranks, the higher the better. There is also the sentence-embedding similarity between the LLM's answer and the gold answer.」
  - zh L250 句尾：「結果以 NDCG@10 計。這是衡量前 10 名排序品質的指標，越高越好（這句說明是本文補的，老師只說這張表評的是搜尋得對不對）：」
  - en L247 句尾：「Results are in NDCG@10, a measure of ranking quality over the top 10 results where higher is better (this gloss is this post's; she only says the table evaluates whether the search is right):」
- perplexity 在第 7 堂導讀已出現過（我只用 grep 確認該檔有這個詞，沒有確認那裡有沒有解釋）。EM、BLEU 若要補說明，來源裡沒有，需標成本文補充。

### B. 可修可不修

#### B1.（S5，未修正）第 9 頁兩個結論框合成一個

- zh L85：「投影片的結論是 Generation follows the distribution in the pre-training data，它帶來兩個後果：」；en L82 相同。
- 依據（第 9 頁文字抽取）：總統例子下面是「Pre-training data is outdated」，護士例子下面才是「Generation follows the distribution in the pre-training data」。兩句各管一個例子。
- 建議文字：
  - zh：「投影片在兩個例子下面各放一句結論：Pre-training data is outdated，以及 Generation follows the distribution in the pre-training data。對應兩個問題：」
  - en：「The slide puts one conclusion under each of its two examples: "Pre-training data is outdated" and "Generation follows the distribution in the pre-training data." They correspond to two problems:」

#### B2.（S4，未修正）roadmap 表格的「每個 token」不在圖上

- zh L273「把各頁的圖合起來是這張表」、L281「每個 token」；en L270、L278。
- 依據（第 48 頁讀圖）：Tokens → Output layer 只有一條箭頭連到 Adaptively，圖上沒有「每個 token」。這一格出自第 47 頁的文字「kNN-LM requires retrieval for each token」與 8.4 18:00 的口述。內容正確，來源標示不精確。
- 建議在表格下加一句：
  - zh：「表中 kNN-LM 的『每個 token』不在 roadmap 圖上，出自第 47 頁的文字。」
  - en：「The "every token" entry for kNN-LM is not on the roadmap figure; it comes from the text on slide 47.」

#### B3.（S12，未修正）第 59 頁沒有對應段落

- 依據：第 59 頁列四項（Long-tail knowledge、Knowledge update、Interpretability、Safety / Privacy）；8.5 15:00 老師口頭總結，最後一項說「我希望我的 document 不要外洩……就不要微調上去」。
- 建議在 zh L361、en L358 之後加一段：
  - zh：「第 59 頁用一個問題收尾：什麼時候該用 RAG？投影片列了四種情況：要用到長尾知識、知識會更新、需要可解釋性、有安全或隱私的考量。老師對最後一項的說明是，不希望文件外洩時，就不要把它微調進模型裡。」
  - en：「Slide 59 closes with one question: when to use RAG? It lists four cases: long-tail knowledge, knowledge updates, interpretability, and safety or privacy. On the last, she says that when documents must not leak, they should not be fine-tuned into the model.」

#### B4.（S8，未修正）HW3 兩個細節

- zh L381「LLM 是 Qwen3 1.7B」：逐字稿 02:17 聽作「QM3 1.7B BF16 版本」。L377 有總括的提醒，個別標示更清楚。
  - zh：「LLM 是 Qwen3 1.7B（逐字稿聽作『QM3』，名稱是本文推定的）」
  - en：「the LLM is Qwen3 1.7B (the transcript hears "QM3"; the name is this post's inference)」
- zh L386「用強化學習訓練一個小模型」：逐字稿 17:50–17:59 是「拿這個相似度去當做 reward，然後去 train 一個 RL-based 的 multilayer perceptron」。
  - zh：「用強化學習訓練一個小模型（助教舉的例子是多層感知器，reward 用 LLM 的回答與標準答案的相似度）」
  - en：「train a small model with reinforcement learning (the TA's example is a multilayer perceptron, rewarded by the similarity between the LLM's response and the answer)」

#### B5.（S13，未修正）用詞，只有中文版

- zh L181「算法和算 perplexity 一樣」：這裡指算的方式，字面容易被讀成 algorithm。建議改「算的方式和算 perplexity 一樣」。
- zh L122、L131「詞表」：老師口述是「詞典」與 vocabulary。可改「詞彙表」。我查了 repo 裡的寫作指引有沒有這兩個詞的規定，沒有找到對應的檔案，所以這一項是語感判斷。

#### B6.（S9 的延伸）L284 的問題沒有被新加的說明蓋到

- zh L284：「課堂問答裡有同學問為什麼現在的 RAG 和它差這麼多」；en L281。
- 作者在「課堂問答選錄」開頭加了「問題的文字經過本文改寫」，但這一句在 roadmap 一節，不在那個說明的範圍內。原題（8.6 19:06）是「為什麼 Modular 的 RAG 跟一開始的 RAG 差別那麼多」。
- 建議文字：
  - zh：「課堂問答裡有同學問為什麼 modular 的 RAG 和一開始的 RAG 差這麼多」
  - en：「In the Q&A a student asks why modular RAG differs so much from the original RAG」

#### B7.（S10、S14、S15）維持現狀即可

- S10（Google 一次 100 筆）：第一次報告判定如實，只是可補兩個細節。我重對了 8.6 21:54–22:32，文章的四個要點都對，不需要改。
- S14（標題）、S15（「哪些法律規範」、第 18 頁的 KL divergence）：不需要改。

---

## 已確認修正正確

以下每一項我都回到來源對過。

| 項目 | 現在的文字（zh／en 行號） | 依據 | 判定 |
|---|---|---|---|
| M1 | 「混合的式子寫成（固定的 λ 在第 45 頁的圖上）」（L296／L293）；「第 47 頁的式子因此把 λ 換成隨輸入而變的 λ(x)」（L302／L299） | 第 45 頁 Interpolation 方塊：`p(y) = λ p_kNN(y) + (1−λ) p_LM(y)`；第 47 頁：`P_kNN-LM(y|x) = (1 − λ(x)) P_LM(y|x) + λ(x) P_kNN(y|x)`（兩頁皆 170 dpi 讀圖） | 已正確修正 |
| M2 | 「低：query 和 passage 不用兩兩組合，各自獨立編碼」（L152／L149） | 8.2 21:00：「它不用兩兩組合在一起，它等於是這兩個是獨立切開的，所以下面這一個的 complexity 是會比較高的」 | 已正確修正 |
| M3 | 「老師說這是 pairwise 一個比較大的缺點」（L248／L245 "a fairly large drawback"） | 8.3 03:00：「pair-wise 它的 complexity 比較高，那當然是一個比較大的缺點」 | 已正確修正 |
| S1 | 例子標題加上「老師在課堂上沒有講解這個例子，下面的解讀是本文的」，條列末句的舊標示刪掉（L126、L129／L123、L126） | 8.2 12:00–15:00 全段沒有出現 what is nlp 這個例子，只講 TF-IDF 的概念與「大型語言模型／LLM」；第 14 頁讀圖，向量與三個內積相符 | 已正確修正 |
| S2 | 「老師的理由是（和第 7 堂談 reward model 時是同一個道理，這個連結是本文加的）」（L243／L240） | 8.3 03:00 沒有提到上一堂。另查第 7 堂字幕：「我們沒有一個基準去比較說怎樣都 7 分怎樣都 8 分……直接給你 pairwise 的兩個回覆」，道理確實相同 | 已正確修正 |
| S3 | 「投影片寫的是兩者平行進行；老師口述的是先用 sparse 縮小範圍，再用 dense 細找」（L229／L226） | 第 25 頁：「sparse and dense retrieval in parallel」；8.3 00:00：「hybrid 就是先 sparse 先縮小一點範圍，然後再用 dense 的，可以去比較 fine-grained 去 retrieve」 | 已正確修正 |
| S6 | 「少於 80 個 token」（L201）／「less than 80 tokens」（L198） | 第 21 頁讀圖：「output the answer of size less than 80 tokens」 | 已正確修正，中英一致 |
| S8（rewrite） | 「每筆資料有 query（欄位名稱是 rewrite）」（L382／L379） | hw3.txt 03:34「rewriter column 裡面就是 query 的 content」、05:07「Rewrite 裡面的 Content」 | 已正確修正 |
| S8（禁忌） | 「使用額外的訓練資料、把測試資料拿來訓練、設法找出 private 測試資料」（L385／L382） | hw3.txt 10:13–10:33，三項逐條相符 | 已正確修正 |
| S9 | 「下面是和這一堂有關的幾題，問題的文字經過本文改寫」（L365／L362） | 五題原題在 8.6 的 09:54、13:39、14:17、15:34、20:54，文章的題目確實是改寫 | 已正確修正（L284 另見 B6） |

關於 M1 的一點補充，不需要改：文章列出的式子 `P(y | x) = (1 − λ) P_LM(y | x) + λ P_kNN(y | x)` 不是任何一頁的原樣，是第 47 頁的寫法配上固定的 λ。它和第 45 頁的式子等價，文章用的是「寫成」而不是「投影片寫的是」，括號也只說固定的 λ 在第 45 頁的圖上，沒有說過頭。

### 新增或改寫的句子有沒有說得比來源重

12 處改寫逐句對過，沒有一句比來源重。M3 與 S3 改完之後比原來更貼近字幕。

另外我把全文含「老師說」「老師的」「她說」「投影片的結論」的句子對著字幕重讀了一遍（8.1–8.5 全部、8.6 的相關段落）。除了上面 A1、A2 兩處，沒有發現說重或沒有依據的句子。有一句屬於合理的轉述，列出來供參考：zh L181「把 query 的每個 token 的機率乘起來」，逐字稿（8.6 13:08–13:15）是「每一個字，然後去放進去，然後去計算它的機率，然後下一個字，然後就把它整整串」，「乘起來」是對「整串」的解讀，和「就跟你算 perplexity 一樣」一致。

### 中英一致

12 處改動在兩個版本逐一對應，意思一致。S6 原本的「不超過／under」差異已消除。未修正的各項在兩個版本同樣存在。

### 三個例子與自我檢查的數字

重算結果與文章相同，改動沒有動到任何數字。

| 項目 | 文章 | 重算 |
|---|---|---|
| q·d₁、q·d₂、q·d₃ | 0.165、0.0825、≈ 0.0413 | 0.165、0.0825、0.04125 |
| e²、正例機率、損失 | ≈ 7.39、≈ 0.79、≈ 0.24 | 7.389、0.787、0.2395 |
| 三個分數都是 0 | 1/3、≈ 1.10 | 1.0986 |
| 30 份 pairwise | 435 | 435 |
| 第 4 題 | 1/4、≈ 1.39 | 1.386 |
| 第 6 題 | 20 與 190 | 20 與 190 |
| 第 45 頁混合 | Hawaii 0.6 | λ = 2/3 時 Hawaii 0.6、Illinois 0.2，與圖相符 |

kNN-LM 那一段改了頁碼說明之後，「語言模型 0.2／鄰居 0.8／混合 0.6」與式子仍然自洽。自我檢查第 9 題的答案（輸出層、與語言模型的分布混合、每個 token 都查、後來改成視情況才查）和改過的 L296–302 一致。

---

## 未驗證

- 第一次報告「無誤確認」一節裡我沒有重新讀圖的頁面：第 2–8、10、12、13、16–19、23、26–30、33、35、37、38、40、42、43、49–58 頁。這些頁對應的文字這次沒有改動，口述部分我對過字幕，投影片上的數字與文獻年份沿用第一次報告的結論。
- 「HW3 沒有公開的規格文件」「校外的讀者拿不到資料集」：指定來源無法判斷，見 A3、A4。
- 「8.6 與 HW3 說明影片沒有字幕」、影片長度、影片標題、學期日期：沒有對 YouTube 或課程頁。
- 「Qwen3」「MS MARCO 的 MiniLM 系列」是不是助教實際用的模型：只有逐字稿的誤聽文字可對。
- 參考資料的 arXiv 連結、站內連結、渲染後的頁面：沒有檢查。
- gate 腳本（`check-course-titles.mjs`、layout 檢查）：這次沒有重跑。改動只在內文句子，沒有動標題與章節順序。
- perplexity 是否已在系列前面的文章解釋過：只確認第 7 堂導讀出現過這個詞。
