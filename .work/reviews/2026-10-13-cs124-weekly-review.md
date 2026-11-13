# Stanford CS124 逐週導讀（第 1–10 週，中英共 20 檔）獨立審稿

- 審稿日期：2026-10-13
- 審稿者：獨立審稿 agent，未參與撰寫；只讀，未改文章、未 commit
- 審的版本：工作目錄未提交的改動，基底 commit `d5e84964`
- 規格：`.agents/skills/post/references/course-guide-contract.md`、同目錄 `writing-guide.md`
- 結論：**待修正後複審**。數字例子幾乎全對、來源引用大致可靠、教學結構符合 contract；但有 2 個 blocker（三篇標題仍是舊版「材料缺口」框架；第 6 週對投影片範圍的陳述與來源不符並造成 instruction tuning 整段沒人教）與 9 個 should-fix。

## 1. 審稿對象與 sha256

審稿開始與結束時各算一次，20 檔 hash 相同（審稿期間檔案未變動）。

| 檔案（`src/content/posts/ai/`） | sha256 |
|---|---|
| 2026-08-22-cs124-week1-introduction.md | d2dc14d4cb9f5216c5b3278bf77243fabe9e948a7a853bd41216d70cb862357b |
| 2026-08-22-cs124-week1-introduction-en.md | 5d1a3773e66a464a3bb44abc58ea4dc203fe417b87a2174b95d2747b3c06e709 |
| 2026-08-22-cs124-week2-tokens-ngram.md | 6b87ba2b8b4613655a1ebeafca1bbca538a6641fd4533cfbfd99a334236a467b |
| 2026-08-22-cs124-week2-tokens-ngram-en.md | ba112ca1b3742e0df82226a65c4ba90eba8d9251b91fcc7a1d1ac7f4fb30cb50 |
| 2026-08-22-cs124-week3-logistic-regression.md | cf203e1200a6b4baf057bf5bc6994ee695aae427751e5aa0c1aa5182d6ad4f7d |
| 2026-08-22-cs124-week3-logistic-regression-en.md | c9281f58c987023fee84efdeeb5e31ac9c0004e35de77da3aec0c9c751c1d5eb |
| 2026-08-22-cs124-week4-information-retrieval.md | dd1b17a83e1532c48e0d52ad48745ab33549157ccbeea582be7cc3745669c358 |
| 2026-08-22-cs124-week4-information-retrieval-en.md | 55d02577fa5fde8459fbd2281a3934a09393c264a28112f7095673945b9c5b98 |
| 2026-08-22-cs124-week5-embeddings-social-nlp.md | 0a3a0cbfe3b0ecac0191a4f0a64513009d4ff5c256790cf13d2ad159d1bf17e4 |
| 2026-08-22-cs124-week5-embeddings-social-nlp-en.md | 615bbb643014ba691937faefc99062059d5ab717b354823dd28f5d3568ea7d66 |
| 2026-08-22-cs124-week6-neural-networks-llms.md | 9b16f82340390c1ea1ea420323361d444cef42836c78adde71d46035afa4af7a |
| 2026-08-22-cs124-week6-neural-networks-llms-en.md | bba9d6892e51a6d6728c69dadb32037f859cfc719e3806b5d214adb3709128ac |
| 2026-08-22-cs124-week7-transformers-speech.md | bee65fe460a96c0c14686091c0a03741b4f4d3ca6a9d3cb175f0fdb06896de26 |
| 2026-08-22-cs124-week7-transformers-speech-en.md | 267bc0389e1d118655902172d65c1ed2f57a9f4bbfcee16b61534adcfb90bc01 |
| 2026-08-22-cs124-week8-speech-git.md | ad6533d832b6f5b2cd4e99adeb8478b3082da4559a4b4c9ab8eaed8cfdc20c9c |
| 2026-08-22-cs124-week8-speech-git-en.md | 754b41a9f9ced3ec32ea83511adb736abd3bc061809c109174c546ed4ecdd65d |
| 2026-08-22-cs124-week9-recommenders-agent.md | e7a19b388a829d67781c87aa90f9906bfcf7bc919e58296ff645e79fd0232b50 |
| 2026-08-22-cs124-week9-recommenders-agent-en.md | db8d367272fd783b48a822a8687baef9781fcc5ac0b2a0cac21785df0ad0d111 |
| 2026-08-22-cs124-week10-pagerank-networks.md | 35e73586f0f914aea5b3b7ebf44861c53c10d345dc72f5004e82e3a45ed7262d |
| 2026-08-22-cs124-week10-pagerank-networks-en.md | 44f1e0869575db7e0728928a6039ffece6a25119ac2d0e180ce1f166f17eaa47 |

## 2. 做了什麼、怎麼驗

- 中文 10 檔全文讀完；英文 1、2、3、7、10 週全文讀完，其餘 5 檔以逐行數字／連結／結構比對加抽讀（每對行數完全相同，可逐行對照）。
- 數字：用 Python 腳本從頭重算（BPE 用程式模擬合併、編輯距離用 DP、PageRank 用分數精確運算）。腳本在 session scratchpad 的 `rev/calc.py`。
- 來源：直接讀 scratchpad 的 18 份投影片文字（必要時對 PDF 重跑 `pdftotext -layout`）；即時抓官方課表 HTML、9 份 PA README、6 份 labs markdown，另外抓了 PA1–PA5 的 notebook 讀章節標題。
- 連結：48 個外部網址逐一 curl（全部 200／206）；站內連結與錨點用腳本對目標檔標題；`old_aug25/` 的 2、3、4、5、6、7、8、10、11、14、15 各抓第一頁核對章名，並抓教科書主目錄同號檔對照。
- 檢查器：`check-course-titles.mjs`（20 檔＋總覽 2 檔一起傳）回報 0 issue；`check-tw-terms.mjs` 10 檔中文皆 0 blocking、0 to review。

## 3. 逐項結論

### 3.1 數字例子與自我檢查（任務 1）

全部重算。除下列三處，其餘與文章一致。

| 週 | 項目 | 結果 |
|---|---|---|
| 2 | BPE 八輪次數與順序、`␣rent` → `␣re`/`n`/`t`、cat→cut 表 16 格、intention→execution 5 與 8、perplexity 3 與 1.89（0.04096）、16 instance／14 type | 全對。合併順序與投影片相同 |
| 2 | add-one：中文版 3/8、1/8、2/9；英文版 3/9、1/9、2/9 | 全對，各自與同語言總覽的語料自洽（V = 6） |
| 3 | z = 0.8328、σ = 0.697、loss 0.361／1.194→文中 0.36／1.20、梯度與更新、0.668→0.67、0.403→0.40、F1 0.615、四題自我檢查 | 全對 |
| 4 | idf 六個、查詢向量、文件 1（0.747）、文件 2（0.078）、文件 4（0）、AP 0.722／0.639、0.750、0.44／0.40 | 全對 |
| 4 | **文件 3 的 cosine 0.358** | **應為 0.357**（精確值 0.35750；文中自己列的 0.383×0.137＋0.924×0.330 = 0.3574）→ S4 |
| 5 | 0.018（0.01775）、0.996、cherry/strawberry 0.9998、σ(2) 0.88、σ(−1) 0.27 | 全對。投影片印的是 .017（截位），見 N1 |
| 6 | 0.87／0.70、XOR 表、softmax 表（總和 33.23）、三個梯度與驗算、溫度表三列、五題自我檢查 | 全對。softmax 第 3、4 欄 0.007／0.100 是正確四捨五入，投影片印 0.006／0.099，見 N1 |
| 7 | a₃ = [0.79, 0.79]、a₂ = [0.27, 0.73]、遮罩 10 格、perplexity 4、16 倍、25%／20% | 全對 |
| 7 | **WER 112.5%（5 替換／2 刪除／2 插入）** | 與投影片的對齊一致，但**不是最小編輯距離**：最小是 8（6 替換、1 刪除、1 插入），WER = 100% → S1 |
| 8 | mel 1000／2146／2840、694、781、兩個卷積例子、300／150 frame、25/1.3 = 19 | 全對 |
| 9 | 0.32（0.316）、2.54、0.81／0.77／0.44、四個候選分數、五題自我檢查 | 全對。M2 的 0.90 用的是講義四捨五入後的值（未捨入是 0.892），講義自己也寫 0.90 |
| 10 | 轉移矩陣三列、x₁–x₄、收斂值 [5/18, 4/9, 5/18]、驗算 20/54＋4/54、五題自我檢查 | 全對 |

### 3.2 對來源核對（任務 2）

抽查約 150 條「投影片說／README 說／講義說」的陳述，絕大多數在對應來源找得到，數字相符。逐週不符或需註記的項目見第 4 節。

官方課表對照（2026-10-13 即時抓取）：

| 週 | 文章連的投影片／講義 | 課表現況 |
|---|---|---|
| 1 | intro26.pdf、PA0 | 相符 |
| 2 | tokens_jan26、med25、lm_jan25、Lab1_UnixText_2026_upload、PA1 | 相符（課表另有週四選修 NumPy tutorial，文章未提） |
| 3 | logreg26jan、lab2logreg_lecture、Lab2 與解答、PA2 | 相符 |
| 4 | ir_jan17_2026、Lab3 與解答、PA3 | 相符（課表另有 lab3irupload.pdf 導引投影片，文章未連） |
| 5 | vector26jan、**ContextualEmbeddings25**、PA4 | vector26jan 相符；**ContextualEmbeddings25.pdf 在課表原始碼裡被 `<!-- -->` 註解掉，頁面上看不到**，檔案仍可下載 → S5 |
| 6 | 7_NN、llm_cs124_26、PA5 | 相符；transformer 投影片屬第 6 週現場課，文章第 6、7 週都有交代，清楚 |
| 7 | transformer_cs124_26、speech_cs124_26、PA6a | 相符；「選修、出席加分、不錄影」與課表一致 |
| 8 | speech_cs124_26（後半）、PA6b、Lab4_Agent | 相符；Lab 4 必須到場與課表一致 |
| 9 | collaborativefiltering26、Lab5、PA7、MMDS 第 9 章 | 相符（課表另有 Lab 5 解答的 md，文章未連） |
| 10 | spark-public 的 web.pdf、socialnetworks21、final124_26 | 相符 |

`old_aug25/N.pdf` 章名：2 Words and Tokens、3 N-gram Language Models、4 Logistic Regression and Text Classification、5 Embeddings、6 Neural Networks、7 Large Language Models、8 Transformers、10（BERT／masked language modeling）、11 Information Retrieval and RAG、14 Phonetics and Speech Feature Extraction、15 Automatic Speech Recognition。全部與文章引用的內容相符。主目錄現行版（2026-08-19 稿）的 7、8、10、14、15 已是別的章（Transformers and Pretraining、Post-training、Interpretability、RNNs and LSTMs、Phonetics），第 7 週文中的提醒屬實。

### 3.3 技術正確性（任務 3）

BPE、編輯距離、perplexity、smoothing、邏輯迴歸梯度、tf-idf、倒排索引、MAP、SGNS、反向傳播、溫度取樣、teacher forcing、Q/K/V 與遮罩、residual stream、mel、卷積、cross-attention、協同過濾、PageRank、弱連結、DPO、logit lens、chrF 的解釋都沒有發現實質錯誤。需要改的是 S1（WER）、S2（BPE 平手）、S8（WER 譯名），以及幾個過度簡化的句子（N5、N6、N9）。

### 3.4 教學品質（任務 4，依 contract）

| 週 | 機制解說 | 完整例子（條件→計算→結果→意義） | 附答案的自我檢查 | 備註 |
|---|---|---|---|---|
| 1 | 課程範圍、歧義（「語言為什麼難：歧義」） | The chef made her duck 的五種讀法與歧義來源 | 3 題，有答案或判準 | 無演算法的一週，角色合理 |
| 2 | BPE／編輯距離／n-gram／perplexity／smoothing 各一節 | BPE 八輪、cat→cut、紅綠藍、add-one 表 | 4 題 | 正規表達式沒有教（S3） |
| 3 | 四個零件各一節 | 影評預測、loss 表、一步梯度下降、F1 | 4 題 | 好 |
| 4 | tf、idf、cosine、倒排索引、AP、dense、RAG | 四篇文件完整算到排名並解讀 | 4 題 | 好；PA3 只有一句（S7） |
| 5 | distributional hypothesis、SGNS、靜態與上下文 | 兩個 cosine、apricot 正負例 | 4 題 | PA4 只有兩句（S7） |
| 6 | 神經元、XOR、softmax、反向傳播、LLM、取樣、預訓練 | XOR 表、softmax、計算圖、溫度表 | 5 題 | instruction tuning 缺（B2）；PA5 沒講作業內容（S7） |
| 7 | attention 簡化版→QKV→遮罩→block→輸入輸出 | a₃、遮罩表、perplexity、WER | 5 題 | WER 例子（S1） |
| 8 | 發聲、頻譜、frame、mel、卷積、Whisper | mel 表、卷積表 | 5 題 | 好 |
| 9 | 內容式、兩種協同過濾、PA7 簡化版、ReAct | 減平均的 cosine、2.54、實作課五完整排名 | 5 題 | 好 |
| 10 | anchor text、隨機漫步、轉移矩陣、中心性、弱連結、DPO、logit lens、MT | 三頁面矩陣與 power iteration、群聚係數 | 5 題 | 好 |

正文沒有哪一節還在講查課過程。第 1 週文末的「課程影片來源」是站上慣例位置，沒有擋在教學主體前。**問題出在標題**：第 5、7、8 週的副標仍在講材料邊界（B1）。

讀起來吃力的地方很少。第 8 週「把聲音寫下來→發聲的過程→波形與頻譜」一路沒有例子，到 mel 才有數字，是全系列最長的一段純敘述，但仍讀得下去，不列問題。

### 3.5 中英對齊（任務 5）

- 每一對行數相同、H2／H3 與表格結構相同、外部連結逐行相同、站內連結都指向同語言版本。
- 數字逐行比對：差異只有單位換算（3.1 萬／31 thousand、7.21 億／721 million、68 萬／680,000）與刻意不同的例句（第 2 週 add-one、第 7 週自我檢查第 5 題），各自自洽。
- 所有下列問題除特別註明外，中英兩版都有，要一起改。
- 英文自然，沒有翻譯腔。只有一句彆扭（N12）。

### 3.6 文風（任務 6）

- `check-tw-terms.mjs`：10 檔 0 blocking、0 to review。另外人工掃了約 60 個中國用語，沒有命中（「演算法」「函式」「位元組」「遮罩」「取樣」「最佳化」「同溫層」都是台灣用法）。
- 破折號「——」：0 處。「不是…而是」：全系列只有 1 處。
- 整句英文片語塞在中文句子裡：正文沒有（唯一命中是引用的例句 The chef made her duck）。保留英文的都是術語。
- 需要改的只有 WER 的譯名（S8）。

### 3.7 連結（任務 7）

- 站內連結：目標檔全部存在。
- 錨點：`#兩條讀法`、`#一個例子這門課要你算的是這種東西`、`#two-ways-to-read`、`#an-example-the-kind-of-thing-the-course-asks-you-to-compute`、`#課程影片來源`、`#course-video-sources` 都在目標檔標題找得到對應。
- 外部連結 48 個全部可讀。

## 4. 問題清單

### Blocker

**B1｜第 5、7、8 週標題仍是舊版框架（中英共 6 檔）**

- week5：`Embeddings and Social NLP：語境向量與公開材料的證據邊界`／`Context Vectors and the Public-Evidence Boundary`
- week7：`Transformers and Speech Processing：causal attention、生成與未錄現場課的邊界`／`Causal Attention, Generation, and an Unrecorded Lecture`
- week8：`Speech and PA7/Git Lab：把 TTS→STT pipeline 當成可稽核的資訊損失｜Stanford CS124 第 8 週／程式作業 7`／`Auditing Information Loss in a TTS-to-STT Pipeline | … Week 8 / Programming Assignment 7`

正文已經重寫，系列頁上最先被看到的標題卻還在講「證據邊界」「未錄現場課」「可稽核的資訊損失」，正是使用者抱怨的那種東西。第 8 週另外標了「／程式作業 7」，但這週的作業是 PA6b，PA7 只在實作課四預告，屬於第 9 週。格式檢查器只驗「｜」後面，所以回報 0 issue。第 7、9 週文末導覽的連結文字「第 8 週：Speech and PA7/Git Lab」也要跟著改。

建議（主題那一半沿用官方週名，副標放這週教什麼）：
- week5：`Embeddings and Social NLP：用鄰居表示詞義，從共現次數到 word2vec｜Stanford CS124 第 5 週`
- week7：`Transformers and Speech Processing：attention 怎麼讓每個 token 參考前文｜Stanford CS124 第 7 週`
- week8：`Speech and PA7/Git Lab：聲音怎麼變成 Transformer 讀得懂的向量｜Stanford CS124 第 8 週`（拿掉「／程式作業 7」）

**B2｜第 6 週對現場課範圍的陳述與投影片不符，instruction tuning 整段沒有任何一篇教（week6、week10，中英）**

- week6：「這堂課只講第一個，後兩個留到第 10 週的最後一堂。」／"This lecture covers only the first, and the other two wait for the final lecture in Week 10."
- week10：「最後一堂回到 LLM，補上第 6 週留下的部分」；instruction tuning 只有一個括號「（用「指令加上正確回應」的資料做監督式微調）」。

`llm_cs124_26.pdf`（文章連的那一份）在預訓練之後還有三節：「Instruction tuning Large Language Models」（預訓練模型為什麼不會對話：問「向六歲小孩解釋登月」它接的是另一個問句；SFT 的定義；五類指令任務；SuperNatural Instructions 一萬六千個任務；Aya 多語資料；prompt 是 in-context learning、不更新參數）、「Evaluating Large Language Models」（perplexity、大小、能耗、公平性）、「Ethical and Safety Issues」（著作權、資料同意、隱私、幻覺等）。期末投影片的開頭是「SFT (Instruction tuning) isn't enough」，也就是它預設 instruction tuning 已經教過。現場課沒有錄影，實際講到哪裡無法確認，但文章的依據是投影片，這句話與投影片相反。

建議：第 6 週刪掉「只講第一個」，新增「Instruction tuning」一小節（用投影片的登月例子說明為什麼需要、SFT 是什麼、和 in-context learning 的差別），並用一段交代評估與倫理兩節；第 10 週把「補上第 6 週留下的部分」改成「接著第 6 週的 instruction tuning 往下講」。

### Should-fix

**S1｜第 7 週 WER 例子的對齊不是最小編輯距離（week7，中英）**

引文：「它就是第 2 週的最小編輯距離……用編輯距離對齊之後……5 個替換、2 個刪除、2 個插入，共 9 個錯誤。WER = 9 ÷ 8 = 112.5%。」

表格與 112.5% 都忠實照投影片，但用第 2 週的 DP 算，這兩句的最小編輯距離是 8：Um→My、I→sister、left→her 三個替換，this 刪除，phone 相同，it 插入，upstairs→stores、last→less、night→nine 三個替換，共 6 替換＋1 刪除＋1 插入，WER = 100%。照文章教的方法驗算的讀者會算出不同答案。

建議：保留投影片的表，加一句「這是投影片畫的對齊，依發音對應排的；用第 2 週的動態規劃可以找到只要 8 個錯誤的對齊，WER 是 100%」。「WER 可以超過 100%」那一段改用自擬的例子（例如參考答案 2 個詞、辨識結果 5 個詞）。

**S2｜第 2 週「小例子不會遇到平手」與自己的例子矛盾（week2，中英）**

引文：「實作 BPE 時有一個小例子不會遇到的細節：兩對的次數一樣多時要選哪一對。」／"a detail the small example never hits"

這個例子每隔一輪就平手：第 1 輪 `n`+`e` 與 `e`+`w` 都是 4；第 3 輪 `␣`+`r` 與 `r`+`e` 都是 3；第 5 輪有四對都是 2。投影片只是直接挑了一個。

建議：改成「上面的例子其實已經遇到了：第 1 輪 `n`+`e` 和 `e`+`w` 都出現 4 次，投影片直接選了前者。實作時要把選法固定下來」，合併表的第 1 輪也可加註。

**S3｜第 2 週完全沒有教正規表達式（week2，中英）**

`tokens_jan26.pdf` 有一整節 Regular Expressions（disjunction、否定、Kleene `*` 與 `+`、anchor `^` `$`、`|`、別名、反覆修正規則的流程），PA1 的 Section A 就是用正規表達式抽 email（含刻意隱藏寫法的 email）。文章只在 PA1 一句帶過。第 1 週也把正規表達式列為「其他重要的語言演算法」。

建議：加一小節，放一張符號表與一個手算例子（例如用 `[tT]he` 找 the，先漏掉大寫、再誤抓 other，示範修正過程），自我檢查加一題。

**S4｜第 4 週文件 3 的 cosine 寫 0.358，應為 0.357（week4，中英，各 2 處）**

引文：「cos = 0.383 × 0.137 + 0.924 × 0.330 = 0.358」與排名表的 0.358。式子裡的數字相乘是 0.3574，未捨入的精確值是 0.35750（0.357498），都捨入成 0.357。排名不受影響。

**S5｜第 5 週把官方課表已註解掉的投影片列為本週材料（week5，中英）**

引文：「**本週材料**：……、[Contextual Embeddings 投影片](…/ContextualEmbeddings25.pdf)」

課表 HTML 裡這個連結被包在 `<!-- … -->` 裡，2026 年的頁面上沒有它；檔案本身仍可下載，內容對應指定閱讀的第 10 章第 9–12 頁。

建議：改寫成「2025 年版的 Contextual Embeddings 投影片（2026 年課表沒有列，檔案仍在）」，或把這一節的依據改寫成教科書第 10 章。

**S6｜第 10 週「投影片列了三類方法」，實際是五項（week10，中英）**

引文：「投影片列了三類方法（logit lens、因果介入、sparse autoencoder）」

投影片列的是 logit lens、probing、steering、causal manipulation（patching、DAS）、sparse autoencoders。改成「五種」並補上 probing 與 steering，或寫「列了幾種方法，包括……」。

**S7｜第 4、5、6 週的作業段落沒有說作業要做什麼（week4、week5、week6，中英；week2、week3 較輕）**

引文：week4「在 notebook 裡實作一個檢索系統」；week5「在 notebook 裡操作詞向量」；week6 的 PA5 一段只有矩陣形狀的建議。

README 確實沒有內容，但公開的 notebook 有完整結構，第 7–9 週的作業段落寫得很細，前後落差明顯。notebook 章節（已抓取核對）：
- PA3：倒排索引 → get posting → TF-IDF → rank retrieve → dense retrieval → 比較兩種方法 → 倫理題
- PA4：靜態向量找同義詞、比較相似度指標、反義詞 → 用 BERT 取上下文向量 → 句子相似度 → 倫理題
- PA5：為什麼邏輯迴歸不夠 → 自己寫網路的初始化、forward、backward、predict → 用詞向量做 Yelp 評論分類 → 倫理題
- PA1：Section A 用正規表達式抽 email；Section B 從 Unicode、UTF-8 講到 BPE 訓練、encode、decode
- PA2：Triage 資料集，依序寫 sigmoid、loss、梯度下降、分類器，再做評估與倫理題

建議依 notebook 補上各部分做什麼、各自對應文中哪一節。

**S8｜WER 譯成「字錯誤率」，容易和字元錯誤率混淆（week2、week7、week8 中文版）**

引文：week7「**字錯誤率**（word error rate，WER）。它就是第 2 週的最小編輯距離，單位從字元換成詞」。中文語音辨識慣例裡「字錯誤率」指 CER（以字元為單位），WER 是「詞錯誤率」。同一句又說單位是「詞」，自己就不一致。建議全系列改成「詞錯誤率」。

**S9｜第 3 週說溫度在「第 7 週」再出現，本系列是在第 6 週教的（week3，中英）**

引文：「第 7 週從語言模型取樣時會再遇到它。」第 6 週的文章有「取樣：下一個詞怎麼選」一節並回指這一題。改成第 6 週（第 7 週的 PA6a 會實際調它）。

### Nit

- **N1｜自算值與投影片印的值差一個尾數，沒有說明。** week5 cosine 文章 0.018、投影片 .017；week6 softmax 文章 0.007／0.100、投影片 0.006／0.099。文章的四捨五入是對的，投影片是截位。各加半句「投影片印 .017，是截去尾數」。
- **N2｜week2「三種切法分別來自不同的標註規範」。** 投影片是兩個規範（Chinese Treebank、北大）加「直接用字」，第三種不是標註規範。
- **N3｜week2「訓練語料裡的詞會被還原成完整的 token」。** 照文中八輪合併，`set` 是 `␣`＋`set`、`reset` 是 `␣re`＋`set`，沒有變成單一 token。投影片也說得籠統。改成「`new` 和 `renew` 會被還原成完整的 token」。
- **N4｜week2「這也是前面投影片說『斷詞要固定』的原因之一」。** 投影片確實有這句，但文章前面沒提過，讀者找不到「前面」指什麼。
- **N5｜week8「7,000 Hz 和 7,100 Hz 幾乎聽不出差別」** 說得太滿，這是自擬的例子（投影片只說 1000 Hz 以上比較不敏感）。改成「聽起來的差距小得多」。
- **N6｜week8 自我檢查第 5 題「大小寫和標點在聲音裡沒有對應的訊號」。** 大小寫成立；標點有停頓與語調可以部分對應。改成「大小寫沒有，標點只有停頓和語調這種間接線索」。
- **N7｜week9「投影片最後一節說明……三個差別」。** 那一節後面還有 Evaluation and Implications，不是最後一節；第 2 點（喜歡清單轉成 0／1 向量）出自實作課五，投影片的三點是不減平均、不除以相似度總和、不用 mean-centered overlap cosine。
- **N8｜week9 配分 68＋32＋7 = 107，實作課四講義寫「剛好 100 分另加 5 分加分」。** 文章照 README 寫沒錯，來源彼此不一致，可加一句註記；「佔總成績 18%」出自實作課四，不在 README。
- **N9｜week7「把 token 的順序打亂，算出來的結果一樣」。** 嚴格說是每個 token 的輸出跟著換位置，而且要在沒有遮罩的前提下（自我檢查第 3 題寫得比較精確）。
- **N10｜week10「用 logit lens 看中間幾層」。** 投影片寫的是 lower layers。
- **N11｜week4、week5「README 要求先看完……」。** README 原文是 "We recommend"，改成「建議」。
- **N12｜week1 英文版** "The telescope can belong to the seeing" 不自然，建議 "The telescope can go with the seeing (I used it to see her) or with her (she was holding it)"。
- **N13｜未連的官方材料。** week4 的 lab3irupload.pdf、week9 的 Lab 5 解答 md、week2 的 NumPy tutorial，課表都有。
- **N14｜week1 的元件表沒有 Conv Nets，week8 卻寫「第 1 週導論投影片列的元件裡有 Conv Nets」。** 投影片確實有列；在第 1 週的表補一列即可。week1「有助教在場」投影片沒有寫。
- **N15｜week8 實作課四的 GitHub 流程** 只寫到 clone，講義還有改檔、同步與解 merge conflict 兩步。
- **N16｜week10 chrF。** 投影片的例子是去掉空白後再切（`witnessforthepast` 18 個 unigram、17 個 bigram），可補一句。

## 5. 未能核對

- Canvas 上的預錄影片與 PA0 安裝影片：需 Stanford 登入。
- 第 5 週計算社會科學現場課投影片：`/restricted/` 路徑回 403，導向 Stanford 登入頁（文章的說法屬實）。
- 兩堂現場課實際講到哪裡：沒有錄影，只能以投影片為準（影響 B2 的措辭，不影響結論）。
- PA1–PA5 notebook：只讀了章節標題，沒有逐格核對；PA2「不呼叫現成的分類器」與標題結構相符但未逐格確認。
- 實作課三、五的試算表（Google Sheets）沒有打開；數字是用講義 markdown 與自己重算核對的。
- 實際渲染的頁面沒有看：Playwright MCP 這個 session 連線失敗。文章沒有用 `$…$` 公式，風險低，但表格與上下標在站上的呈現未經目視確認。
- 範圍卡（contract 要求存 `.work/`）有沒有寫，不在這次審稿範圍。

## 6. 三項分別回報（contract 完成證據第 4 點）

- **身分／標題**：格式檢查 0 issue；但 3 篇（6 檔）副標內容不合格，1 篇範圍標示錯誤（B1）。未通過。
- **事實**：抽查約 150 條引用，1 條與來源相反（B2）、3 條數量或細節不符（S5、S6、N7）、2 個數字要改（S1、S4）。修正後可通過。
- **教學品質**：10 篇都有機制解說、至少一個條件→計算→結果→意義完整的例子、附答案的自我檢查，沒有查課歷程取代概念的段落。缺口是第 2 週的正規表達式（S3）、第 6 週的 instruction tuning（B2）與前半系列過薄的作業段落（S7）。補齊後可通過。

文章修改後 hash 會變，需依 contract 重新複審。

## 複審（2026-10-13）

- 複審者：同一位獨立審稿 agent；只讀，未改文章、未 commit
- 審的版本：工作目錄未提交的改動，基底 commit `d5e84964`；複審開始與結束各算一次 hash，22 檔相同
- 結論：**有條件通過**。B1、B2 與 S1–S9 全部修好，中英對齊。修改時新引入 1 個事實錯誤（R1，第 2 週正規表達式一節的投影片順序寫反，中英各一句），改掉那一句即可，不需要再整批複審。另有 5 個小問題（R2–R6）與 2 個刻意未處理的 nit。

### 複審版本的 sha256

| 檔案（`src/content/posts/ai/`） | sha256 |
|---|---|
| 2026-08-21-stanford-cs124-languages-to-information.md | d89a4b37722481c3c657a13a11aadd88f3441d80728fa96af7f41f7d0c45653a |
| 2026-08-21-stanford-cs124-languages-to-information-en.md | 2cae3e362d34e6791d536eec2ce30593d2bc23e9ed7c5ce0e9e5648874a8567b |
| 2026-08-22-cs124-week1-introduction.md | 8fe857061c53a473c3655c099d945fdfbd3d50bb04c900b8a95c6b270c0ef1f8 |
| 2026-08-22-cs124-week1-introduction-en.md | a815b701ffb5b3f5cb63e1fbb53dd5bbd4f7bf25267bd161f60e9ab46ffb62c1 |
| 2026-08-22-cs124-week2-tokens-ngram.md | 3797d9bd63ff48d7058252f49bde1b9ead7016954b1b18fc616371fc7e44a0b1 |
| 2026-08-22-cs124-week2-tokens-ngram-en.md | cf320632afc752fe9294284163d8f970a2814d2c927649e8f0bc827685d8fe35 |
| 2026-08-22-cs124-week3-logistic-regression.md | 9add21aee2d70e7f8aa26254d3a5433fae654f1dbb5ab47cdde62d1989646403 |
| 2026-08-22-cs124-week3-logistic-regression-en.md | 3defcfa669cb201470eedae3c6aaf8960ed61ea761cefc393498b34e50729b31 |
| 2026-08-22-cs124-week4-information-retrieval.md | 269df15f1cbde82c52098b2d51ee8697d16a46026736da0341391ac8614c7c6a |
| 2026-08-22-cs124-week4-information-retrieval-en.md | bfa07d6ba81936bca2c3af746ab67aaa45f5aeb441ac0f0273cd6c4135bc381c |
| 2026-08-22-cs124-week5-embeddings-social-nlp.md | 6269f1f83643aba0b4a5429d121132fb2f232e6f646eb6fa60ba884974d42f73 |
| 2026-08-22-cs124-week5-embeddings-social-nlp-en.md | 59f2bd2c494e93e12b37e1ce6d2dcfd9b7981693840a5e66c7316c68814151f4 |
| 2026-08-22-cs124-week6-neural-networks-llms.md | 5ab4906ef99549f8f69a809ff352b88aeabd69f264c76afc9ec1d39ee1c6b667 |
| 2026-08-22-cs124-week6-neural-networks-llms-en.md | 525b14199a7304c24bfeae673519f86ec647536d6bcea23200589428473e9d74 |
| 2026-08-22-cs124-week7-transformers-speech.md | 516ea850071498322377da7e43755dfdd33bfb65e3d1fc55f5ee2c849f19793e |
| 2026-08-22-cs124-week7-transformers-speech-en.md | 27ee489a7f2bf1f057883387d7760f49914c570260c813ddf3a261e88c190df6 |
| 2026-08-22-cs124-week8-speech-git.md | 005ef6bb7aa66e3b946e9708ea20e0026abe1f3f1b6b989ca3ed98f1de4e9500 |
| 2026-08-22-cs124-week8-speech-git-en.md | 74e2e8fa7c56b56db9398486b87a3712307bac9ac5270f414a7e88215fd6a8d6 |
| 2026-08-22-cs124-week9-recommenders-agent.md | 0368802c2e803579bc486706db87b956bfbafe86f4d5b04bf158258c968b344c |
| 2026-08-22-cs124-week9-recommenders-agent-en.md | bca0bbc8306f498fbcdea013758be183f0ec14492a84d636b23326241b2ce6ce |
| 2026-08-22-cs124-week10-pagerank-networks.md | 0b01b53f3676d48d473168a873cb2e67860a4013569b3f1126ecbd0d3adf068f |
| 2026-08-22-cs124-week10-pagerank-networks-en.md | 566f48177839d77b3f2a744d8ac7815f44d974feb6873b0296b58fe1d05ac909 |

英文版總覽（`…languages-to-information-en.md`）這一輪沒有被修改（`git status` 無變動），hash 列出供對照。

### 怎麼驗

- 全文重讀：第 2、6、7 週中英、第 5、8、9、10 週中文；第 9、10 週英文讀修改段落；第 1、3、4、5、8 週英文逐行對修改處。
- 重算：`rev2/c.py`（session scratchpad）用 DP 算 WER 例子並列舉所有最佳對齊的替換／刪除／插入組合；用程式模擬 BPE 八輪並列出每輪並列最高的組合；重算 0.383 × 0.137 + 0.924 × 0.330。
- 對來源：`tokens_jan26.txt`、`llm_cs124_26.txt`（另對 PDF 重跑 `pdftotext -layout`）、`final124_26.txt`、`collaborativefiltering26.txt`；PA7 README 與 Lab 5 講義重新抓取；PA1–PA5 notebook 章節標題重跑一次。
- 對齊：腳本逐行比對 10 對檔案的行數、標題數、外部網址（0 差異）與數字（差異全是單位換算、英文把序數寫成數字、以及兩處刻意不同的例句）。
- 檢查器：`check-course-titles.mjs` 22 檔 0 issue；`scripts/check-tw-terms.mjs` 10 檔中文 0 blocking、0 to review。破折號 0 處；「不是…而是」1 處（第 4 週，與上一輪相同）。

### 逐條結論

| 編號 | 結論 | 說明 |
|---|---|---|
| B1 | 已修 | 三篇新標題都在講課程內容，中英對應：第 5 週「用周圍的詞表示一個詞的意思」／"Representing a Word by the Words Around It"；第 7 週「attention 怎麼讓每個 token 參考前文」／"How Attention Lets Each Token Use Its Context"；第 8 週「聲音怎麼變成 Whisper 讀得懂的輸入」／"How Sound Becomes Input Whisper Can Read"，「／程式作業 7」已拿掉。20 檔與總覽裡搜不到「證據邊界」「未錄現場課」「可稽核」及英文對應字串。第 7、9 週文末導覽的連結文字只用官方週名，不受影響 |
| B2 | 已修 | 第 6 週改成「這堂課講前兩個，偏好對齊留到第 10 週」，新增「Instruction tuning」與「評估與安全」兩節；第 10 週改成「接著第 6 週講到的預訓練與 instruction tuning 往下講」。逐項對投影片：登月→重力的例子、The small dog→crossed the road、SFT 的定義、「還是預測下一個詞」、Aya 503 million／114 languages（文中「5 億多筆」）、demonstrations 不改權重、Frankenstein 與 1816、hallucination 的成因、危險或違法建議、著作權未有定論、data consent、美國作者偏多，全部相符。「摘要」在投影片的圖裡有（Summarize／Summarization）。小缺口見 R3 |
| S1 | 已修 | 保留投影片的表與 112.5%，補上「不是錯誤最少的排法」。DP 結果：最小編輯距離 8，8 ÷ 8 = 100%。文中寫的 6 替換＋1 刪除＋1 插入是最佳對齊之一（另一個是 8 個全替換，因為兩句都是 8 個詞），敘述正確。150% 的自擬例子（2 個詞的答案多吐 3 個詞，3 ÷ 2）自洽 |
| S2 | 已修 | 模擬結果：第 1 輪 `n`+`e`、`e`+`w` 各 4；第 3 輪 `␣`+`r`、`r`+`e` 各 3；第 5 輪四對各 2。與文中敘述一致。第 6、7 輪其實也平手，文中沒有說「只有」這三輪，不算錯 |
| S3 | 已修，但引入 R1 | 新增「正規表達式」一節。`re.search` 的說明、raw string 的理由、`r"Buttercup"`、`r"[mM]ary"`、`r"[tT]he"`、`r"\d+"` 都與投影片相符。表格原始碼是一個反斜線加 d，放在行內程式碼裡，不會被 markdown 吃掉。沒有採用上一輪建議的「反覆修正」手算例子與自我檢查題，屬可接受的取捨（見 R2） |
| S4 | 已修 | 中英各 2 處改成 0.357。第 101 列的 0.357 是文件 1 的 `sweet` 正規化值，另一個數字，原本就對 |
| S5 | 已修 | 「2025 年的檔案，目前的課表頁面沒有顯示這個連結，檔案仍可下載」，中英一致 |
| S6 | 已修 | 「五類方法（logit lens、probing、因果介入、sparse autoencoder、steering）」五個名稱都在投影片上，順序與投影片不同（投影片把 steering 排第三），無礙 |
| S7 | 已修 | PA1–PA5 的段落與 notebook 章節相符：PA1 Section A／B；PA2 Triage、sigmoid→loss→梯度下降→分類器→評估→倫理；PA3 倒排索引→postings→tf-idf→rank retrieve→dense retrieval→比較→倫理；PA4 同義詞→相似度指標→反義詞→BERT→句子相似度→倫理；PA5 為什麼邏輯迴歸不夠→init／forward／backward／predict→Yelp→倫理 |
| S8 | 已修 | 20 檔與總覽都搜不到「字錯誤率」，全部是「詞錯誤率」 |
| S9 | 已修 | 「第 6 週講語言模型怎麼取樣時會再遇到它，第 7 週的 PA6a 會實際調這個參數」，中英一致 |

Nit 的處理情形：N1–N12、N14、N15 已修（逐條讀過）；N13 補了 lab3irupload.pdf 與 Lab 5 解答（`Lab5_LargeLanguageModels_Solutions.md` 存在：GitHub contents API 有列、blob 頁 200；第一次 curl 回 503 是暫時性的），NumPy tutorial 刻意不連；N16 刻意不處理。第 9 週的 107 分註記與 README（68＋32＋7）及實作課四講義（"exactly 100 points, with an additional 5 points of extra credit"）相符；簡化版兩點與投影片「Don't mean-center」「Don't normalize」「Just use cosine」相符，第三點確實出自實作課五（"synthetic user likes vector (0/1)"）。

### 新引入或仍存在的問題

**R1｜should-fix｜第 2 週說正規表達式一節在 BPE「之前」，投影片是在之後（week2，中英）**

- 引文：「投影片在講 BPE 之前有一節正規表達式（regular expression）。」／"Before BPE the slides have a section on regular expressions."
- `tokens_jan26.pdf` 的章節順序是 Unicode → Byte Pair Encoding → Corpora → Regular Expressions → Pretokenization for BPE。正規表達式排在 BPE 與語料之後，緊接著才是「BPE 的前處理用一條正規表達式」。
- 建議：改成「投影片在 BPE 之後另有一節正規表達式」／"After BPE the slides have a section on regular expressions."。這一節在文章裡放在 BPE 前面沒有問題，只要不說投影片也是這個順序。

**R2｜nit｜`[tT]he` 那一列說得比投影片滿（week2，中英）**

- 引文：「`r"[tT]he"` | `the` 或 `The`」
- 投影片用同一個樣式示範它也會抓到 other、Theology 裡的片段。可以在那一列補半句「也會抓到 other 裡的 the」，順便帶出誤抓的觀念；不補也不算錯。

**R3｜nit｜第 6 週「評估與安全」的評估只寫 perplexity（week6，中英）**

- 投影片的 Evaluating 一節在 perplexity 之後還列了模型大小、能耗、公平性三項。補一句「另外還會看模型大小、訓練耗能與公平性」即可。

**R4｜nit｜第 2 週說 WER 在「第 8 週」再出現，本系列是在第 7 週教的（week2，中英；上一輪漏抓，非本次引入）**

- 引文：「編輯距離在第 8 週會再出現：語音辨識的詞錯誤率（WER）就是用它算的」／"Edit distance returns in Week 8"
- 詞錯誤率的定義與手算在第 7 週那一篇。改成第 7 週。和 S9 是同一類問題。

**R5｜nit｜兩處文末清單沒跟上新增的內容**

- week2 更新紀錄（中英）沒有提到新增的正規表達式一節。
- week6 參考資料（中英）LLM 投影片那一行的說明停在「訓練資料」，沒有列 instruction tuning、評估與安全。

**R6｜should-fix｜課程總覽仍說語音現場課「公開的部分是第 8 週的 PA6b」（總覽，中英；不在 20 檔內，上一輪未審正文）**

- 引文：「第 7 週有一堂語音處理的現場課，同樣沒有錄影。公開的部分是第 8 週的 PA6b」／"The public part is PA6b in Week 8"
- 第 7、8 週的文章已經改成投影片公開並據此撰寫，第 7 週的更新紀錄也寫了「原本寫沒有公開投影片，官方課表現在有」。總覽這一句和週文矛盾。建議改成「沒有錄影，投影片公開；第 7、8 週的導讀依投影片整理，第 8 週的 PA6b……」。英文版總覽這一輪沒有動過，要一起改。

### 未能核對（與上一輪相同的部分不重列）

- 實際渲染的頁面仍然沒看：Playwright MCP 這個 session 連線失敗。新增的正規表達式表格含反斜線與方括號，建議作者在本機 `pnpm dev` 目視確認一次那張表。
- 現場課實際講到哪裡仍無法確認，第 6 週的範圍以投影片為準。

### 三項分別回報

- **身分／標題**：通過。
- **事實**：R1 改掉後通過；R6 在總覽，建議同一批處理。
- **教學品質**：通過。
