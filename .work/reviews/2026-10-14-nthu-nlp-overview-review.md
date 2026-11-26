# 獨立審稿：清大高宏宇 NLP 課程總覽（導讀改寫版）

- 審稿日期：2026-10-14
- 審稿者：獨立審稿 agent（未參與撰寫）
- 審稿範圍：只審不改
- 依據：`.agents/skills/post/references/course-guide-contract.md`（依角色教學／課程總覽、影片與正文的搭配）、`.agents/skills/post/references/writing-guide.md`「查證過程不寫進正文」
- 對照：`.work/process-leak-backfill/nthu-nlp-kao-course-guide-before.md`（及 `-en-before.md`）、同目錄 `2026-09-30-nthu-nlp-*.md` 18 篇

| 檔案 | sha256 |
|---|---|
| src/content/posts/ai/2026-09-30-nthu-nlp-kao-course-guide.md | 699999c6281ec27b9f40e9becf2630bc157c3665a65f882fa6a41f5e3e35b602 |
| src/content/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en.md | 12f4a737f04416927330e7a67b367d43e3a33de855f02fe8d0b09c6f74c3b2f8 |

檢查器（審稿時實跑）：`check-process-leak.mjs` 兩檔 0 問題；`check-course-guide-layout.mjs` 0 issue；`check-course-titles.mjs` 0 issue；`check-tw-terms.mjs`（中文）0 blocking / 0 review；`check-course-videos.mjs` 對這兩檔無問題（輸出的 2 個問題屬 ntu-adl2025，與本篇無關）。19 篇站內連結與延伸閱讀連結全部對應到存在的檔案。

**結論：需修改。** 結構與教學功能已到位（主體 H2 皆在講課程內容與讀法，查課型 H2 為 0），但有一處事實錯誤（作業 4 的檢索方式）會出現兩次，加上 TF-IDF 小數進位不一致、週次標籤與先備橋接連結等次要問題。

---

## 1. 六段主線是否講出機制

H2「主線：六段」（zh 41–65 行，en 41–65 行）。每一段都至少有一句機制，不是只列主題：

| 段 | 機制句（zh 行號） | 判定 |
|---|---|---|
| 把文字變成數字 | 45：TF-IDF「越常出現、越少見分數越高」；死穴是同義詞 → LSA；Word2Vec 負採樣；RNN 處理任意長度 | 通過 |
| 處理序列 | 49：長度不同 → encoder-decoder；attention 讓解碼直接看整句；self-attention 一次矩陣乘法、代價是失去詞序 → 位置編碼；BPE 反覆合併最常見的一對 | 通過 |
| 預訓練模型 | 53：「I record the record」→ 靜態向量不看上下文；三條路與各自目標 | 通過，但第 10、11 篇只列名 |
| 聽指令／PEFT | 57：MLE 分不出錯誤輕重 → SFT/RM/PPO+KL；56GB→17GB 因梯度與優化器狀態歸零 | 通過 |
| 外接知識 | 61：稀疏 vs 稠密、cross- vs bi-encoder 的取捨 | 通過，但第 15、16 篇偏列名 |
| 總結與推理 | 65：「推理在解碼」→ CoT decoding、self-consistency | 通過，第 19 篇只列名 |

只列主題名、沒講機制的句子（建議而非阻擋）：
- zh 53／en 53：第 10 篇「greedy、beam search、top-k／top-p … BLEU、ROUGE、perplexity」只列名。第 10 篇 tldr 有現成機制句（greedy 一步錯回不去、beam 偏好短句、抽樣換多樣性）。
- zh 53：第 11 篇「比較兩種架構的實作差異」沒說差在哪；第 11 篇的重點是 left padding、標籤 −100。
- zh 61：第 15 篇「改寫查詢、不怕雜訊、何時檢索」是修法分類名；第 16 篇「prompt、JSON 輸出、few-shot」是工具篇，可接受。
- zh 65：第 19 篇「期末專題的評分結構」只列名，可接受（非機制性內容）。

## 2. 與各篇導讀一致性

一致（已逐篇對照）：
- Google Analogy「近兩萬題」：HW1 篇為 19,544 題 → 一致。
- 56GB→17GB：PEFT 篇 56.28GB／17.19GB，理由「梯度和優化器狀態幾乎歸零」→ 一致。
- 作業 2「14*(43+20)=882」、LSTM 在「=」之後逐字生成 → 一致（HW2 篇是兩層 LSTM）。
- 作業 3：一個 BERT 兩個頭、1–5 分回歸＋三類（entailment）分類 → 一致。
- 第 1 篇「冬天：能穿多少穿多少」、LSA 的 SVD；第 2 篇 bigram、add-one、perplexity、負採樣、RNN；第 4 篇 LSTM 三個閘門；第 6 篇位置編碼；第 7 篇 BPE；第 8 篇「I record the record」；第 12 篇「編造事實 vs 挑錯同義詞」；第 14 篇稀疏／稠密、cross／bi-encoder；第 15 篇 Query Rewriting／RetRobust／Self-RAG；第 16 篇 2024 型號、Claude 型號已退役；第 18 篇三欄與 Denny Zhou；第 19 篇 75%＋25% 期中考 → 一致。
- 篇號與連結：表格 1–19 與各篇 `series.order` 完全對應，中英各 19 個連結都指向正確語言版本。

**不一致（需修改）：**
- **作業 4 的檢索方式寫錯。** zh 61「作業 4 用 BM25 加 cosine 的混合檢索做一個回答貓咪冷知識的 RAG」、zh 86「所以作業 4 的做法是 BM25 加 cosine 一起用」；en 61、86 同。依 `rag-lab-hw4.md`（tldr、90–113 行）：BM25＋cosine＋RRF 的混合檢索是**助教課 2** 的內容；HW4 是把**助教課 1 的 LangChain＋Chroma 骨架**套到 150 則 cat-facts，TODO2 建 Chroma、TODO4 建 retrieval chain，embedding 限定 jina-embeddings-v2-base-en。HW4 也回報 recall@1／@5 與 exact match（「recall@k」可接受）。86 行的教學收尾因此把「混合檢索」錯誤地歸給作業 4；改成「第 17 篇的第二堂助教課」或「作業 4 允許你在 TODO5 自己加上」之類即可。
- **段落週次標籤與實際週次不符。** zh 51「預訓練模型（第 6–7 週）」底下的作業 3（Week 8 助教課／作業說明）與第 11 篇（Week 9 錄影）不在 6–7 週；zh 63「總結與推理（第 14 週）」底下的第 19 篇是 W15–W16。en 51、63 同。建議改週次範圍或在段內註明。
- （次要）zh 57 PEFT「分成加參數、挑參數、重參數化幾類」；第 13 篇是四類，另有「混合（MAM Adapters、S4）」。「幾類」不算錯，但列三類容易讓讀者以為只有三類。

## 3. 「手算一次」TF-IDF 重算

重算（自然對數）：
- ln 3 = 1.0986 → 1.10 ✓
- ln 1.5 = 0.4055 → 0.41 ✓
- D1 = ln 3 + ln 1.5 = ln 4.5 = **1.504 → 1.50**；文中寫 **1.51**（是兩個已進位的數 1.10 + 0.41 相加）。
- 自我檢查第 1 題：N=4，「貓」df=2 → ln 2 = 0.693 → 0.69 ✓；「喜歡」df=2 → ln 2 ✓；D1 = 2 ln 2 = ln 4 = **1.386 → 1.39** ✓，但文中寫成「0.69 + 0.69 = 1.39」，照寫出的數字相加是 1.38。

結論：數值本身對，但兩處進位方式相反（主例用進位後相加得 1.51，練習用未進位精確值得 1.39），等式各自有一處看起來算不平（zh 82、95；en 82、95）。建議統一：寫「≈ 1.50」並註明「ln 4.5」，練習寫「2 ln 2 = ln 4 ≈ 1.39」，或兩處都用進位後相加（1.51、1.38）並說明。

其他觀察：
- zh 84「因為『貓咪』和『貓』是不同的字串」：「貓」是「貓咪」的子字串，嚴格說是「不同的詞（token）」；前文已寫「已經斷好詞」，所以結論成立，但用語建議改成「不同的詞」，以免讀者想到中文單字索引。
- 練習第 1 題答案只寫「『貓』變常見，權重就下降」，沒點出「喜歡」的 idf 反而從 0.41 升到 0.69（N 變大、df 不變），也沒明說 D1 從 1.51（1.50）降到 1.39。讀者自己算會發現 D1 只降 0.12，最好一句交代原因。
- **英文版**：cat／likes／fish、dog／likes／bones、kitty／hates／baths，df 結構與中文完全相同，數值與結論都成立；且 kitty 與 cat 沒有共同子字串，論證比中文更乾淨。但 en 71「(in the original, Chinese words; translated here)」的 “in the original” 暗示有原始出處，與 69 行「teaching example written for this post」矛盾；建議改成 “The Chinese version of this post uses Chinese words; translated here.”

## 4. 自我檢查五題（zh 92–103；en 92–103）

| 題 | 答案正確？ | 有判準？ | 備註 |
|---|---|---|---|
| 1 TF-IDF 加 D4 | 正確（見第 3 項的進位問題） | 有數值答案 | 補一句「喜歡」idf 上升、D1 從 1.50 降到 1.39 |
| 2 位置編碼 | 正確 | 有（「狗咬人／人咬狗」反例） | 「得到一樣的結果」可精確成「每個字得到的向量一樣，只是順序不同」，非必要 |
| 3 BERT vs GPT | 正確 | 有 | — |
| 4 KL penalty | 正確 | 有（reward hacking 的說法） | — |
| 5 混合檢索 | 正確 | 有 | 與第 2 項 HW4 錯誤無關，本題答案本身成立 |

五題都有答案或判準，涵蓋主線 1、2、3、4、5 段（第 6 段推理沒有題目，可接受）。

## 5. 查證過程外洩與必要限制

外洩：正文（出處區以前）未見「經查證」「打開核對」「404」「本系列沒有確認」類句型，檢查器 0 問題；查課型 H2 由舊版的 3 個（硬事實、兩學期對照、README 週次欄、公開程度）降到 0。「課程影片來源」只有出處、片長與查核日期，符合三層分工。更新紀錄 167 行描述改寫內容，屬於更新紀錄的正常用途。

必要限制是否保留：

| 限制 | 位置 | 判定 |
|---|---|---|
| 沒有公開解答 | zh 12（tldr）、30、111；en 12、30、111 | 保留 |
| NTU COOL 要帳號 | zh 111；en 111 | 保留，並給替代做法（GloVe 對照組） |
| README Topics 欄對不上 | zh 113；en 113 | 保留，並給讀法 |
| LLM API 型號已退役 | zh 113；en 113 | 保留，指向第 16 篇 |
| Fall 2026 改版 | zh 115、65；en 115、65 | 保留（75%＋25%、Reasoning／Agent、只公開前幾週） |

舊版有、新版拿掉、可能仍對讀者有用的（不阻擋，供作者判斷）：期末專題沒有題目或規格文件（只剩第 19 篇有交代）；Syllabus 寫 5 份作業但 repo 只有 4 份。

**連帶影響（不在本次兩檔內，但因本次改寫而失效）：**
- `2026-09-30-nthu-nlp-intro-text-processing.md` 33 行、`2026-09-30-nthu-nlp-word-embeddings-language-models.md` 33 行（及兩篇 en 32 行）寫「存取等級 A3（理由見系列總覽）」，總覽已不再解釋 A3。
- `learning/2026-09-30-taiwan-ai-course-map.md` 76 行（en 78 行）寫「入口篇整理了兩學期的評分與教材差異」，總覽已把兩學期對照縮成一句。

## 6. 導言影片嵌入（契約「課程總覽：導言放一支代表影片」）

- 位置：狀態行（zh 28）→ 導言三段 → 播放器（zh 36–39）→ 第一個 H2（41）。符合「導言末尾、第一個 H2 之前」。en 同。
- 片長：寫「1 小時 25 分」；實查 yt-dlp `duration` 5072 秒 = 1:24:32，四捨五入正確。
- 搭配：zh 34「內容對應本系列第 1 篇；可以先看影片再讀，或讀完第 1 篇再回來對照」，交代了搭配方式；第 1 篇確實嵌同一支 X7XJcm9wfFA。
- 狀態行：「已附影片……各週錄影在各篇導讀」，符合總覽要求，附錨點連結到「課程影片來源」。
- 「課程影片來源」區塊在文末、不放播放器，只放出處、片長、查核日期 → 符合。
- 次要：契約寫「影片狀態行之後用一句話寫全片多長、涵蓋哪些部分、怎麼搭配」；本文片長在狀態行、搭配在兩段之後，資訊齊全，可接受。

## 7. 中英一致與 zh-TW 用語

中英結構、行號、數字、連結幾乎逐行對應。差異：
- en 149 延伸閱讀 CS224N 多了 “with syllabi compared from 2019 to 2026”，zh 150 沒有。
- en 71 “in the original” 說法（見第 3 項）。
- en 參考資料加了 “(in Chinese and English)” “(in Mandarin)” 語言標註，屬英文版正常補充。

zh-TW：`check-tw-terms` 0 問題；人工掃過，「優化器」「損失函數」「顯示卡記憶體」皆為台灣慣用，未見中國用語。

## 契約「課程總覽」其他要求

- 讀者定位、先備、各模組學什麼、依賴與閱讀路線、具體起點：都有（30–34、43–65、88–90、105–115、142–146）。
- 「未在系列教過的先備給可到達的橋接連結」：zh 90 列出 Python、線性代數、機率、損失函數與梯度下降，本系列沒教，**沒有任何橋接連結**。站上已有台大林軒田、李宏毅等總覽可接。需補。
- H2 計數：10 個 H2，講課程內容與讀法的（主線、手算、先備與自我檢查、三種讀法、篇目、今晚可以做的事）6 個，過半 → 通過。

---

## 需修改清單

1. zh 61、86／en 61、86：作業 4 不是 BM25＋cosine 混合檢索，那是第 17 篇的助教課 2；HW4 用助教課 1 的 LangChain＋Chroma 骨架，兩處都要改。
2. zh 82、95／en 82、95：TF-IDF 進位不一致（ln 4.5 ≈ 1.50 寫成 1.51；0.69 + 0.69 寫成 1.39），統一寫法。
3. zh 51、63／en 51、63：段落週次標籤與內容不符（作業 3 在 Week 8、第 11 篇在 Week 9、第 19 篇在 W15–16）。
4. zh 90／en 90：先備（線性代數、機率、損失函數與梯度下降）缺橋接連結。
5. en 71：“in the original” 暗示有原始出處，與「本文自擬例子」矛盾。
6. zh 95／en 95（建議）：練習第 1 題答案補一句「喜歡」idf 上升、D1 從 1.50 降到 1.39。
7. zh 84（建議）：「不同的字串」改成「不同的詞」。
8. zh 53／en 53（建議）：第 10、11 篇各補一句機制（greedy 錯誤累積／beam 偏短句；left padding 與 −100）。
9. zh 57／en 57（建議）：PEFT 分類補「混合」一類或改寫成「主要有…」。
10. en 149（次要）：CS224N 延伸閱讀多出的子句，中英對齊。
11. 連帶（本次兩檔以外）：第 1、2 篇中英版「A3 理由見系列總覽」與 taiwan-ai-course-map 中英版「入口篇整理了兩學期的評分與教材差異」已失效。

---

# 複審（第 2 輪，2026-10-14）

| 檔案 | sha256 |
|---|---|
| src/content/posts/ai/2026-09-30-nthu-nlp-kao-course-guide.md | efd045b9f29ed2bb77384a82af04af756d98df97d4af542cafc9800b51722e18 |
| src/content/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en.md | a3b28e7b989396677b4248f68bf33566c2f19807824060e1f69574afa40502be |
| src/content/posts/ai/2026-09-30-nthu-nlp-intro-text-processing.md | 19108abe67b78305518f9f8cf037555678b0a3594befaaf662d88938e6dbfe68 |
| src/content/posts/ai/2026-09-30-nthu-nlp-intro-text-processing-en.md | 7e3e1f41fb879bb7b8b72772004276c9420ecf104b3258edc9571a5d18c76cb1 |
| src/content/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models.md | 30a51e1295c552e92d53e120006c8aa03f0d40e248ddc32e833ea73b3ad0a56c |
| src/content/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en.md | 29f2e27f6834524b95983c4f9d25177611774a5a6d9654b66ef7da6d4feab19c |
| src/content/posts/learning/2026-09-30-taiwan-ai-course-map.md | dd7d91ae31a5ede4b50be20f493de123abfa551c8d460ac80ab65097520cda8b |
| src/content/posts/learning/2026-09-30-taiwan-ai-course-map-en.md | 71f22e0c32ada26eeabde0a1938def5a370bc25336c779b777dc4fa29925e586 |

檢查器（複審時實跑）：`check-process-leak.mjs` 對以上 8 檔 0 問題；`check-course-guide-layout.mjs` 兩檔 0 issue；`check-tw-terms.mjs`（總覽中文）0；`check-course-videos.mjs` 無 nthu-nlp 相關問題；總覽中英所有站內連結（含 3 個新橋接連結的中英版）都對應到存在的檔案。

## 逐項確認

| # | 原問題 | 修正位置 | 判定 |
|---|---|---|---|
| 1 | 作業 4 誤寫成混合檢索 | zh/en 61：第 17 篇兩堂助教課、第二堂示範 BM25＋cosine，作業 4 套第一堂 LangChain＋Chroma 骨架；zh/en 86：改成「第 17 篇的助教課」 | 正確，與 `rag-lab-hw4.md` tldr、TODO2／TODO4 一致 |
| 2 | TF-IDF 進位 | zh/en 82：ln 1.5 + ln 3 = ln 4.5 ≈ 1.50（ln 4.5 = 1.504 ✓）；zh/en 95：2 ln 2 ≈ 1.39（ln 4 = 1.386 ✓），補「喜歡」0.41→0.69 與「比原本的 1.50 低一點」 | 正確；等式現在都算得平。「文件變多，它變得相對少見」對 idf = ln(N/df) 的解釋成立 |
| 3 | H3 週次標籤 | 六個 H3 改成篇號範圍 1–3、4–7、8–11、12–13、14–17、18–19 | 正確；每段範圍與段內提到的篇號一致，19 篇無遺漏、無重疊 |
| 4 | 先備橋接連結 | zh/en 90：CS181 作業 0（線代）、CS109 總覽（機率）、ADL 第 2 堂（loss 與 gradient descent） | 正確；三篇中英版都存在，ADL 第 2 堂 tldr 確實講 loss 與 gradient descent，連結語言版本正確 |
| 5 | en “in the original” | en 71 改成 “Three already-tokenized documents:” | 已移除 |
| 6 | 「字串」→「詞」 | zh 84「斷詞後『貓咪』和『貓』是不同的詞」 | 正確；en 84 保留 “different strings”，對 kitty／cat 成立 |
| 7 | 第 10、11 篇機制 | zh/en 53 | 正確；第 10 篇 greedy 錯誤累積、beam 保留多條、BLEU 的 n-gram 重疊與短句懲罰（brevity penalty）與第 10 篇 tldr 一致；第 11 篇 left padding、−100、encoder-decoder 由工具處理，與第 11 篇 tldr 及 glossary（DataCollatorForSeq2Seq 代勞）一致 |
| 8 | PEFT 四類 | zh/en 57「…與混合四類」 | 正確，與第 13 篇一致 |
| 9 | en CS224N 子句 | en 149 “Stanford's main NLP course, taught in English.” | 正確，與 zh 150 對齊 |
| 10 | 反向引用 | 第 1、2 篇中英版刪掉「存取等級 A3（理由見系列總覽）」整句；taiwan-ai-course-map 中 76／英 78 改成「整學期的主線與讀法」 | 正確；刪除點在句末，前後句完整、無殘留括號或孤立連結；新說法與總覽內容相符。地圖頁本身仍有自己的 A3 說明（en 77），不受影響 |
| 11 | （原第 6 項建議）練習第 1 題 | 併入第 2 項 | 已處理 |

## 新引入的問題

1. **en 61 大小寫錯誤**：“…few-shot through APIs; The two TA sessions in [Post 17]…” 分號後的 “The” 應小寫（或改成句號）。
2. （次要）en 53 第 10 篇 “top-k/top-p trade some accuracy for variety by sampling”，中文是「用抽樣換多樣性」，沒有 “accuracy”；第 10 篇原文也只講多樣性。可刪 “some accuracy” 讓中英一致，不阻擋。

未發現其他新錯誤：tldr、description、影片狀態行、導言影片、限制段落（無公開解答、NTU COOL、README Topics、LLM API 型號、Fall 2026）都未被改動。

## 範圍外觀察（既有，非本輪引入，不阻擋）

第 1、2 篇（中英）的「版本說明」開頭段仍有「本文依據……」「事實皆於 2026-09-30 對照投影片核對」「字幕讀過後發現」等句，正是 `writing-guide.md`「查證過程不寫進正文」第一條點名的寫法。`check-process-leak.mjs` 沒抓到，但這四檔這次被改動、進 commit，依「舊文章只要被改到就要一起修好」的精神，建議另排一輪處理或登錄 escalation queue。

## 複審結論

**需修改（僅剩 1 項小修）**：en 61 的 “; The” 大小寫。改完即可視為通過，不需再全面複審；第 2 項與範圍外觀察由作者判斷。
