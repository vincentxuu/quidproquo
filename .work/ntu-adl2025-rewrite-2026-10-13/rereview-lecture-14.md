# 複審報告：ADL 2025 第 14 堂（Beyond Supervised Learning 與 Multimodality）

複審日期：2026-10-13。複審者未參與撰寫、翻譯與第一次審查；只審查，未改動文章。

受審檔案（第一次審查後作者已修改的版本）：

- zh：`src/content/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal.md`（438 行）
- en：`src/content/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal-en.md`（437 行）

## 我實際做了什麼

- 讀完第一次報告 `review-lecture-14.md` 與中英兩版全文。
- 逐字稿：沒有重讀七份全文，只讀了與 16 項建議及作者新增句子對應的段落：14.1（03:40–06:10、12:50–15:00）、14.2（07:13–09:01）、14.3（03:27–04:19、08:11–08:54、14:57–15:57）、14.4（07:30–09:43）、14.5（14:08–15:57）、14.6（00:49–03:16、12:25–13:19）、14.7（02:58–05:42、10:48–14:16）。
- 講義：看圖的頁面是 22、34、37、41、51、54、68、80；47–55 另外對過 pdftotext 文字；全份講義搜尋過 variance／deviation。
- 14.7 影片：02:10–05:30 每 5 秒擷取一張（共 40 張），11:00–12:00 每 6 秒一張（10 張），另外放大 04:36（投影片 88）與 11:40（投影片 94）。
- 來源外查證一項：用 arXiv API 查了 2511.01299 與 1905.06196 的標題與作者名單（只有名單，沒有機構）。
- 查了 `scripts/check-course-videos.mjs` 是否解析「內容核對」那一行。
- 沒有做：沒有重跑 `pnpm verify` 或檢查器；沒有看渲染後的頁面；第一次報告「無誤確認」一節裡與本次修改無關的項目沒有重對。

結論：16 項裡 12 項已正確修正或不需修改，3 項修了但留下不準確的說法（S6／S9 同一句、S10、S12），1 項（S15 範圍卡）未處理。沒有發現事實錯到必須擋稿的問題。

---

## 一、仍需修改

### 1. any-to-any 那一句：歸因寫反，英文版單數（S6＋S9）

- zh L301：「後面的投影片（Wu 等 2023）把同樣的想法推廣：……訓練時輸入端用『圖配圖片描述、聲音配逐字稿（老師的說法；投影片上寫的是 audio caption）、影片配影片描述』這類資料來學投影。」
- en L300：「A later slide (Wu et al. 2023) generalizes the same idea: …… audio paired with transcripts (her wording; the slide says audio caption) ……」

依據（實際對過）：

- 影片畫面：LLaVA 最後一張是投影片 86，畫面停到約 03:25；03:30 起就是投影片 87，標題 **Any-to-Any Multimodal LLM (Wu+, 2023)**；04:05 起是 88（Multimodal LLM (Wu+, 2023)，Encoding-side LLM-centric alignment）；04:55 起是 89（Decoding-side instruction-following alignment）；05:20 是 90（Google Gemini Multimodal LLM (2023)）；05:25 是 91（GPT-4o）。
- 所以 **LLaVA 與 Wu 等 2023 之間沒有別的投影片**，Wu 等 2023 是連續三張（87–89）。第一次報告 S9 說「Wu+ 2023 是 88、89，87 內容不明」不完整；作者原本寫的「下一張投影片」其實是對的。文章這一段前半（各模態有 encoder 與投影、輸出端接生成模型）講的正是 87，後半（訓練資料）是 88。
- 投影片 88 右側三個輸出確實是 Image Caption、Audio Caption、Video Caption（放大畫面可讀）。
- 逐字稿 14.7 04:39–04:43：「那 audio 也可以 audio caption，就是語音辨識的結果，那 video 就是 video caption」。老師自己也說了 audio caption，再補一句解釋成語音辨識的結果。「逐字稿」是本文的轉述，不是老師的用詞。

問題：

- 「老師的說法；投影片上寫的是 audio caption」把兩者寫成對立，但老師口頭也用 audio caption。
- 英文「A later slide」是單數，內容其實跨 87–88 兩張。

建議文字：

- zh：「接下來三張投影片（Wu 等 2023）把同樣的想法推廣：……訓練時輸入端用『圖配圖片描述、聲音配 audio caption（老師口頭解釋成語音辨識的結果）、影片配影片描述』這類資料來學投影。」
- en：「The next three slides (Wu et al. 2023) generalize the same idea: …… audio paired with audio captions (which she glosses as the speech recognition output), video paired with video captions.」

### 2. σ 的註解：講義沒有把 σ 稱作 variance（S10）

- zh L120：「（講義與老師都把 σ 稱作 variance；一般的慣例裡 σ 是標準差，σ² 才是變異數）」
- en L119：「(the deck and the lecturer both call σ the variance; by the usual convention σ is the standard deviation and σ² the variance)」

依據（實際對過）：

- 講義第 34 頁只寫 z ∼ N(μ, σ)；第 37 頁圖上是 W_μ、W_σ、μ、σ、N(μ, σ)。兩頁都沒有 variance 這個字。全份講義只有第 43 頁出現一次 variance（「set the mean/variance of q to be the same as p」），沒有指著 σ 說。
- 逐字稿 14.3：03:42「有一個 mean 跟 variance 來決定」、08:27「它的平均跟它的 variance」、09:34「控制 mu 跟這個 variance」。稱作 variance 的是老師的口述。

問題：「講義……把 σ 稱作 variance」說得比講義重。後半句的慣例說明是本文補充的常識，不在來源裡，以括號註解的形式出現可以接受。

建議文字：

- zh：「（講義寫成 N(μ, σ)，老師口頭說的是 mean 跟 variance；一般的慣例裡 σ 是標準差，σ² 才是變異數）」
- en：「(the deck writes N(μ, σ) and the lecturer speaks of the mean and the variance; by the usual convention σ is the standard deviation and σ² the variance)」

### 3. 自我檢查第 1 題的依據補錯了位置（S12）

- zh L62（手寫數字，第 3 頁）新增：「用這種意義來表示，同一個數字的不同寫法會得到相近的表示。」
- zh L65（筆畫，第 7–8 頁）沒有改：「老師強調短不代表表示力比較弱，它可能更能呈現語意。」
- zh L344 答案：「用筆畫表示短得多，而且同一個數字不同寫法會得到相近的表示，更接近語意。」
- en 對應 L61、L64、L343，情況相同。

依據（實際對過）：

- 老師那句話是在講筆畫時說的。逐字稿 14.1 13:50–14:04：「雖然它更簡單，但不代表說它的表示力就會比較弱，它有可能反而是更能夠呈現出它 semantic 上面的 meaning，因為可能都是 7 的話，它可能很自然而然都可以用類似這樣子的方式來表示。」
- 講手寫 4 的段落（04:18–05:59）說的是：人不是從 pixel 理解、旋轉後 pixel 值全變、但還是能對應到腦中有意義的 latent factor。沒有說「得到相近的表示」。

問題：第 1 題問的是「改用筆畫表示有什麼好處」，答案的後半句現在出現在手寫數字那一條，而筆畫那一條仍然沒有。L62 新增的那句放在第 3 頁的例子下，老師在那裡沒有這樣說，是合理的延伸但不是口述。

建議：把 L62 新增的句子刪掉，改補在 L65。

- zh L65：「老師強調短不代表表示力比較弱，它可能更能呈現語意：同樣是 7，不同的寫法很自然會用到相近的筆畫組合來表示。」
- en L64：「She stresses that shorter does not mean weaker representational power, and that it may present the semantics better: different ways of writing a 7 would naturally come out as similar combinations of strokes.」

### 4. 第 14 堂的範圍卡仍然沒有（S15，流程項目，不是文章內容）

- `.work/ntu-adl2025-rewrite-2026-10-13/` 下以 scope 為名的檔案仍只有 `scope-lecture-12.md`。我只查了這個目錄，沒有全站搜尋。是否補交由作者決定。

---

## 二、已確認修正正確

以下都實際對過來源。

**S1「最後兩張」→「接下來兩張」**（zh L314／en L313）。已改。11:00–12:00 的畫面：投影片 93 之後在約 11:24 換成 94（Full-Duplex Strategy (Wang et al., 2025)）。

**S2「綜述」→「論文」，並加上「老師說是 Google 近期發表的」**（zh L314、L320／en L313、L319）。

- 逐字稿 14.7 11:23–11:37：「那近期呢，Google 也發了一篇 paper，那 Google 的這個是在語音的領域，他們就專門針對這個 audio 的 interaction，然後做了比較多的實驗以及分享。」
- 畫面：投影片 94 恰好在 11:24 左右出現，所以老師這句話指的就是這張投影片引的文章；13:30 又說「在這篇論文上面呢」，接著講投影片 95。文章寫成「老師說是……」，歸因清楚，沒有說得比來源重。
- 頁尾引文放大後可讀：「Siyin Wa… et al. "Towards … Auditory Intelligence: Large Multimodal Models for Machine Listening and Speaking." arXiv preprint arXiv:2511.01299 (2025)」。
- 來源外補充：arXiv 上這篇共 29 位作者，第一作者 Siyin Wang。作者名單不含機構，「是不是 Google 的論文」我沒有驗證；文章只轉述老師的說法，維持現狀即可。

**S3 像素檢索**（zh L102／en L101）。改成「多半是」／「mostly」。第 22 頁上排三張：一張紅髮女性的臉、一塊有圖樣的東西、一個馬蹄形磁鐵，三張裡兩張無關，「多半」成立。逐字稿 07:47「這個東西就跟這個黑黑的蠻像」、08:45「但至少是人類嘛……這個是一個大磁鐵」。

**S4 第 41 頁**（zh L139／en L138）。改成「VAE 好一點，但差異不明顯」。逐字稿 14.3 15:31–15:36：「如果用 Variational Autoencoder，它可能就會更好一點，雖然這個差異並沒有到非常的明顯」。老師的原話有「可能」，文章省掉了，程度上略重一點，不影響意思；要更貼近可寫「可能好一點，差異沒有到很明顯」。

**S5 洗手檯**（zh L285／en L284）。改成「但天花板都偏低，廚房裡也都有洗手檯」／「the ceilings are all on the low side and the kitchens all have a sink」。逐字稿 14.6 12:58–13:15：「雖然它產生出來的不是這種斜斜的，不過呢，它也都是產生稍微比較低一點的……它會覺得 kitchen 就是要有一些這個洗手檯」。第 80 頁 kitchen 那一欄的兩張生成圖都看得到水槽。英文的主詞問題已解決。

**S7 SimCSE 有標註版本**（zh L238／en L237）。新句：「老師口頭舉的是『同一類的句子拉近、不同類的推遠』；第 68 頁圖上用的標註是句子之間的 entailment 與 contradiction。」逐字稿 14.5 15:23–15:46：「這幾個句子他是 A 主題，這幾個句子是 B 主題……同 label 的句子拉近，不同 label 的拉遠」。第 68 頁圖上是 label=entailment、label=contradiction，標題下寫 Supervised: further adapt embeddings based on labels。兩半都對得上。

**S8 Su 等 2019 的出處**（zh L174、L184／en L173、L183）。

- 第 51 頁頁尾引文：Shang-Yu Su, Chao-Wei Huang, and Yun-Nung Chen, "Dual Supervised Learning for Natual Language Understanding and Generation," ACL 2019。文章寫「第 51 頁把它用在語言理解與生成，引的是 Su 等 2019」，正確。
- **第 52–54 頁是否出自 Su 等 2019：講義上沒有印。** 三頁都沒有頁尾引文（pdftotext 與第 54 頁的圖都確認）。老師在 14.4 09:01–09:40 講結果時也沒有提出處。間接線索是這三頁緊接第 51 頁，圖例是 NLG/NLU Baseline、DSL w/o MADE、DSL w/ MADE。所以「出自 Su 等 2019」只能算合理推測。
- 文章目前的寫法是「第 52–54 頁是結果（E2E NLG 資料，餐廳領域 5 萬筆）」，沒有把結果歸給任何一篇論文，這是對的，不要再加。
- 結果的解讀對得上：第 54 頁加 duality 後 ROUGE-1、BLEU 上升，F1 略低於 baseline；加 MADE 後三項都最高。逐字稿 09:11–09:40：「有機會 improve 一些……在 understanding 這邊其實並沒有辦法真的 improve，就差不多……紅色其實就是用一個 MADE 的方式……兩邊都會增加」。

**S11 CLIP「還是用了標註」**（zh L252／en L251）。新句：「老師特別指出，它雖然叫 pretraining，某種程度上還是用了標註：圖片和文字的配對關係就是標註，只是沒有針對特定任務。」逐字稿 14.6 02:24–02:37：「所以實際上雖然它叫做 Pretraining，它某種程度上還是有用了 Label 的 Data，它的 Label 其實是 Language 跟 Image 的關係，但是並沒有對於特定一個任務」。逐句對得上，「某種程度上」有保留。誤解清單 zh L335 現在有正文依據。

**S13 第 7 題**（zh L368／en L367）。已補「大於 0，取 max 之後 loss 就是 0.3」。

**S14「內容核對」那一行**（zh L422／en L421）。未改，不需要改。`scripts/check-course-videos.mjs` 第 20 行的正規表示式是 `內容核對[：:]\s*已依(?:字幕|影片)核對|Content check:\s*verified against the video`，這是檢查器解析的固定行，中英兩版目前的寫法都符合。

**S16 英文版多的一句**（en L36 "The lectures are in Mandarin."）。未改，不需要改。逐字稿是中文。

### 中英一致性

- 上列修改處兩版內容一致：σ 註解、Su 等 2019、SimCSE、CLIP 標註、洗手檯／sink、audio caption、Google、「多半」／mostly、第 41 頁、第 7 題。差異只有「一、1」提到的英文單數 A later slide。
- 第一次報告說英文行號是中文行號減 1，現在仍然成立。

### 自編例子與自我檢查的數字（重算）

- Triplet：1.0 − 1.5 + 1 = 0.5，loss 0.5；1.0 − 2.5 + 1 = −0.5，loss 0。兩版一致。
- CLIP：32,768² = 1,073,741,824，約 10.7 億／1.07 billion；正例 1、負例 32,767。兩版一致。
- 第 7 題：max(0, 0.8 − 1.0 + 0.5) = 0.3。兩版一致。
- 第 3 題答案的「平均值 μ 與 σ」與正文 L120 一致。

---

## 三、未驗證

- 第 52–54 頁的結果出自哪一篇論文：講義沒印、老師沒說，見上。
- Wang 等 2025 是不是「Google 的論文」、是不是綜述：只查到作者名單，沒查機構與摘要全文。
- 投影片 86 的對話內文、投影片 94 頁尾引文的前幾個字：影片只有 640×360，放大後仍被工具列圖示蓋住一部分。
- 第一次報告「無誤確認」一節中與本次修改無關的項目：沒有重對。
- 影片長度、YouTube 與 arXiv 連結、課程日期：沒有查。
- 沒有重跑檢查器，沒有看渲染後的頁面。
