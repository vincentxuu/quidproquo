# 第 6 堂（Pretraining & Prompt Learning）獨立審稿報告（第二次，全新審查）

審查日期：2026-10-13。審稿者未參與本篇撰寫，只審查、未修改文章。

## 審查對象與版本

| 檔案 | 行數 | sha256 前 16 碼 |
|---|---|---|
| `src/content/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning.md`（zh） | 365 | `ed1bd2abf5f889f5` |
| `src/content/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en.md`（en） | 364 | `9298c3c514cd7968` |

兩檔在 git 都是未提交的修改狀態（working copy）。文章若再改動，本報告即失效，需複審。

## 來源與做法

- 字幕：`transcripts/lecture-06-captions.txt`，6.1–6.6 全文讀完（下文以「6.x mm:ss」標段落起點的時間戳，時間戳每三分鐘一個，所以是「約」）。
- 講義：`slides/250915_Pretraining.pdf` 共 67 頁。全部頁面以 pdftotext 讀文字；另外把全部頁面轉成 PNG，其中**實際看過圖**的是第 4、20、21、23、29、30、31、39、40、51、52、53、54、55、56、57、58、59、60、65、66 頁。其餘頁面只看 pdftotext 的文字（這些頁沒有文章引用的圖上數字）。
- 規範：`course-guide-contract.md` 全文。
- 執行過的檢查器：`check-course-titles.mjs`（兩檔，0 issue）、`check-course-guide-layout.mjs`（0 issue）。這兩個只驗格式與區塊順序。

## 先回答使用者的問題：那四項「沒有套用的建議」不屬於這一篇

使用者貼的四項（σ 稱作變異數、SimCSE 的 entailment／contradiction、Dual supervised learning 的 Su 等 2019、自我檢查第 1、7 題答案）**都不在第 6 堂**：

- 我在第 6 堂的中英兩檔與字幕裡搜尋 SimCSE、dual supervised、σ、變異數、Xia、Su，全部 0 筆。第 6 堂的自我檢查第 1、7 題都已有答案（zh L273、L297）。
- 這四項出自第 14 堂（`…-beyond-supervised-multimodal.md`），對應既有報告 `review-lecture-14.md` 的 S7、S8、S10。
- 我順手看了第 14 堂目前 working copy 的幾行（**只是抽看，不是審查**）：L120 已加「一般的慣例裡 σ 是標準差」、L174 已寫「引的是 Su 等 2019」、L238 已寫「第 68 頁圖上用的標註是句子之間的 entailment 與 contradiction」、自我檢查第 1、7 題都有答案。也就是說，就我看到的檔案內容，這四項目前看起來都已經在文中；「沒有套用」的說法和現在的檔案對不上。為什麼先前回報成沒套用，我沒有那一輪的紀錄，無法判斷。

以下是第 6 堂本身的審查結果。

---

## 一、必修（3 項）

### M1. 英文版第一次提到講者沒有點名（en L42、L44）

- 原句（en L42）："The instructor's analogy is sending the model to school…"；en L44 接著就用 "she gives the reason for each"。
- 依據：英文正文裡「Yun-Nung Chen」只出現在課名（標題、en L28 的 "NTU Yun-Nung Chen's Applied Deep Learning"），沒有一次是以講者身分出現；之後全篇都是 she／her。讀者要從課名回推 she 是誰。**已對過全文確認**。
- 建議（en）："Professor Yun-Nung Chen's analogy is sending the model to school: …"（之後再用 she）。
- 建議（zh）：中文版 L43「老師的比喻是…」可以不動；若要對稱，可寫「陳縕儂老師的比喻是把模型送去學校」。

### M2. 「拆開」書本不在來源裡，卻列在「老師舉了」底下（zh L59／en L58）

- 原句（zh）：「它買了大量實體書，拆開掃描、轉成文字後拿去訓練。」／（en）"took them apart, scanned them, converted them to text"
- 來源實際內容：6.1 約 06:03「他們是真的有去買這些書，然後就實體的書，然後把它掃描下來，然後就是電子化 OC（OCR）等等…其實是蠻多苦工的」。講義第 4 頁（看圖）只有兩則新聞標題截圖。兩處都沒有「拆開」。這個細節是來源外的資訊，被寫進老師的舉例。**已對過字幕與第 4 頁圖確認**。
- 建議（zh）：「它買了大量實體書，掃描、轉成文字後拿去訓練（老師說這是很費工的事）。」
- 建議（en）："It bought large numbers of physical books, scanned them, converted them to text, and trained on them (laborious work, she notes)."
- 若想保留「拆開」，請移到下面的補充框並附出處。

### M3. 中文版出現「優化」（zh L21，frontmatter glossary）

- 原句：「而是一組直接用梯度優化的 embedding 向量」
- 依據：任務指定的中國用語清單含「優化」。全文其他指定詞（質量、信息、視頻、默認、反饋、技術棧、窗口等）搜尋結果為 0。另有 L309 的「高效調整」是第 7 堂文章的標題連結文字，不在本篇範圍，僅提示。
- 建議（zh）：「而是一組直接用梯度訓練出來的 embedding 向量」（或「最佳化」）。
- 英文版對應句（en L20）"optimized directly by gradient descent" 無問題；順帶一提，來源只說 back-propagation／直接 training（6.5 約 03:01），沒有說 gradient descent，可改成 "trained directly by backpropagation"。

---

## 二、建議（11 項）

### S1. 「六萬個 token」是老師隨口假設的數字（zh L80／en L79）

- 原句（zh）：「詞表有六萬個 token，就是六萬維」
- 來源：6.2 約 03:01「如果你的 vocabulary 其實舉例來說，如果有六萬個 token 好了，那你就會有六萬維」。講義第 7 頁沒有這個數字。中文句可以被讀成 BERT 的詞表就是六萬。
- 建議（zh）：「假設詞表有六萬個 token，輸出就是六萬維」
- 建議（en）："Suppose the vocabulary has sixty thousand tokens: the output then has sixty thousand dimensions"
- （BERT 實際詞表大小不在指定來源內，我沒有查。）

### S2. Anthropic 補充框：沒有寫成課堂內容，但標示可以更明確；且「和解」其實講義圖上就有（zh L62／en L61）

- 判定：補充框是獨立的引用區塊，開頭寫「補充：」並點名 Reuters，前一行（L60）明寫「老師說總共賠了 15 億美元」，兩者分得開，**沒有把和解細節寫成老師說的**。這一點確認無誤。
- 可改進之處有二：
  1. 導言（zh L39）只說「標成『本文自編』的例子不是課堂內容」，補充框不在這句涵蓋範圍內。建議把標籤寫明。
  2. 講義第 4 頁（看圖）右邊那則新聞的標題就是 "AI firm Anthropic agrees to pay authors $1.5bn to settle piracy lawsuit"（6 September 2025），左邊是 "Anthropic wins a major fair use victory for AI — but it's still in trouble for stealing books"、"Judge William Alsup determined that Anthropic training its AI models on purchased copies of books is fair use"。所以「和解」不必只靠外部報導，講義本身就支持；老師口頭說的「被判…賠償」（6.1 約 06:03）和自己的投影片不一致。
- 建議（zh）：「補充（非課堂口述，本文另查）：講義第 4 頁貼的新聞標題寫的是 agrees to pay … to settle，也就是和解，不是判賠。這個案子是 Bartz v. Anthropic…」
- 建議（en）："Note (not from the lecture; checked separately): the headline shown on slide 4 itself reads 'agrees to pay authors $1.5bn to settle', a settlement rather than a court award. The case is Bartz v. Anthropic…"
- 補充框裡「數位化買來的紙本書也是合理使用」「下載盜版書建立資料庫不是」「約 50 萬本、每本 3,000 美元」「Reuters 2025-09-05」都是**來源外、未驗證**（依指示不查）。
- 文末「內容核對」那句（zh L333／en L332）「老師說是判賠，查證後是和解」可順手補上「講義第 4 頁的標題也是 settle」。

### S3. LM-BFF「自動產生的 template 不比人寫的差」比表格重一點（zh L199／en L198）

- 來源：6.4 約 15:01「有一些人寫的可能還是比較好，可是它都不比它來得差」（口述本身前後不一致）。第 54 頁表格（看圖）Prompt-based FT (man) 對 (auto)：SST-2 92.7／92.3、MR 87.0／85.5、CR 90.3／89.0、MNLI 68.3／68.3、QNLI 64.5／68.3、RTE 69.1／73.9、TREC 84.8／88.2、CoLA 9.3／14.0。互有高低，不是「都不比人寫的差」。
- 建議（zh）：「實驗結果是自動產生的 template 和人寫的差不多，各任務互有高低（第 54 頁）。」
- 建議（en）："In the experiments the automatically generated templates are roughly on par with hand-written ones, each ahead on some tasks (slide 54)."

### S4. Prefix-Tuning 少了講義的「all layers」，和下一條「只加在輸入那一層」對不起來（zh L217／en L216）

- 來源：第 57 頁（看圖）"only optimize the prefix embeddings (all layers) for efficiency"；第 58 頁 "task-specific prompt (one layer)"；第 67 頁結語也寫 "(all layers)"。文章在 Prompt Tuning 寫了「只加在輸入那一層」，但前一條沒說 Prefix-Tuning 是每一層都有，對比不成立。
- 建議（zh）：「只在最前面放一小段可訓練的 prefix（講義註明每一層都有）。每個任務只要存自己的 prefix。」
- 建議（en）："put a short trainable prefix at the very front (in every layer, per the slide). Each task stores only its own prefix."

### S5. 儲存量的自編例子：計算正確，但缺「結果的意思」，而且講義同一張圖已有現成數字（zh L222／en L221）

- 重算：3 × 11B = 33B；100 × 4096 = 409,600；× 3 = 1,228,800 ≈ 123 萬。**全部正確**。
- 問題一：契約要求完整例子有「條件、推理、結果、結果的意思」。這一段停在數字，沒有收尾說這代表什麼。
- 問題二：第 58 頁（看圖）就寫 "Task Prompts (20K params each)"，配的正是 11B 的模型。自編的 409,600 和講義的 20K 差二十倍，讀者對照講義會疑惑。
- 建議（zh）：在段末加「三個任務多存的 123 萬個參數，只有一份模型的萬分之一左右，所以幾乎等於只存一份模型。講義第 58 頁的圖用的數字更小：每個任務約 20K 個參數。」（1,228,800 ÷ 11×10⁹ ≈ 0.011%，已驗算。）
- 建議（en）："The 1.23 million extra parameters for three tasks are about one ten-thousandth of a single model copy, so storage is essentially one model. The figure on slide 58 uses an even smaller number: about 20K parameters per task."

### S6. 自我檢查第 1 題的後半題，正文沒有依據（zh L271–273／en L270–272）

- 答案本身正確，字幕有依據（6.2 約 12:02「把翻譯的 source 當成 input 放進去，然後就讓他去學怎麼去 generate target 的 sentence」）。但正文 Decoder 小節（zh L98）只說 encoder 做不了生成，沒提翻譯，讀者無法由正文推得「原文當輸入、接著生成譯文」。
- 建議（zh，加在 L98 末）：「以翻譯為例：encoder 沒辦法一個 token 一個 token 生出譯文；decoder 把原文當成輸入，接著往下生成譯文就可以了。」
- 建議（en）："Take translation: an encoder cannot emit the translation token by token, while a decoder takes the source text as input and simply continues with the translation."

### S7. 自我檢查第 7 題的 verbalizer 寫法容易誤讀（zh L297／en L296）

- 原句（zh）：「verbalizer 是 垃圾 → 是、正常 → 不是」／（en）"spam → yes, normal → no"。箭頭右邊應該是任務標籤，寫成「是／不是」「yes／no」會和講義第 50 頁把 yes／no 當作**模型輸出的詞**的用法撞在一起。
- 建議（zh）：「verbalizer 是 垃圾 → 垃圾信、正常 → 非垃圾信」
- 建議（en）："the verbalizer spam → spam, normal → not spam"
- 另一點是我的推測、來源沒談：一個 [MASK] 只填一個 token，「垃圾」「正常」在以字為單位的中文模型裡是兩個 token。第 4 題用單字「好／差」就沒有這個問題。若要嚴謹，可把範例改成單字詞，或在判準加一句「verbalizer 的詞最好是模型的單一 token」。

### S8. 引用頁碼：「資料很少時也有效」的證據在第 52 頁（zh L190／en L189）

- 原句：「（第 51–52 頁，Le Scao 與 Rush 2021）」。第 52 頁（看圖）才是 "Prompt-tuning is better under data scarcity (Le and Rush, 2021)" 與六張曲線圖；第 51 頁是「Fine-tuning PLMs based on few annotated data samples／No parameter tuning when zero-shot settings」，文章在下一段另外引它來講口述與講義的差異。
- 建議（zh）：改成「（第 52 頁，講義標 Le and Rush 2021）」。建議（en）："(slide 52, cited on the slide as Le and Rush 2021)"。
- 附帶：講義上印的作者是 "Le and Rush"，文章寫 Le Scao 與 Rush，是依論文正名改的，屬來源外資訊，可保留但宜如上註明。

### S9. 表頭「Precision」，講義寫的是 P@1（zh L205／en L204）

- 第 55 頁（看圖）表頭是 "P@1"；老師口頭說 precision（6.5 約 00:00）。建議表頭寫「P@1（precision）」，中英相同。

### S10. 英文自我檢查與個別句子的小瑕疵

- en L105："Why could the first generation continue with a next word and still not write a sentence?" 稍拗口。建議："Why could the first generation suggest a plausible next word yet fail to write a sentence?"（中文 L106 無問題。）
- en L16 的 Verbalizer 沒有 aliases，中文有「標籤詞映射」；英文不需要，屬合理差異，僅記錄。

### S11. 文末來源區（不影響教學內容，僅提示）

- zh L313–323／en L312–322 只嵌入 6.1、6.2 兩支影片，正文用了六支。是否要全嵌屬 course-videos 規則，我沒有核對該規則。
- zh L333「內容核對：已依字幕核對」。契約規定：若底本是機器轉錄逐字稿，要寫「講義與機器轉錄逐字稿」，不能寫「已依字幕核對」。`lecture-06-captions.txt` 是 YouTube 自動字幕還是自行轉錄，我**無法從檔案判斷**（專名錯字很多：Enthropec、Bird、Income test learning、Chain of soul），請作者依實際來源確認這一句的寫法。

---

## 三、無誤確認

### 3.1 指定要特別核對的項目

**第 55 頁表格（看圖確認）**，文章 zh L205–212／en L204–211 四列全部相符：

| 講義 | 文章 |
|---|---|
| [X] is located in [Y]. (original)　31.29 | 31.29 |
| [X] is located in which country or state? [Y].　19.78 | 19.78 |
| [X] is located in which country? [Y].　31.40 | 31.40 |
| [X] is located in which country? In [Y].　51.08 | 51.08 |

- 「掉了十幾個百分點」：31.40 − 19.78 = 11.62，正確。
- 「高了將近二十個百分點」：51.08 − 31.40 = 19.68，正確。
- 老師的敘述順序與文章一致（6.5 約 00:00）。

**第 51 頁（看圖確認）**：兩行文字是 "Fine-tuning PLMs based on few annotated data samples"、"No parameter tuning when zero-shot settings"，沒有表格或數字。文章 zh L192 的轉述正確；「影片裡老師強調模型不動、調的是 prompt」對得上 6.4 約 09:01「Pretrained Model 我們自己動不了它…可以訓練的就是放進來的這個 Prompt」「你沒有動到這個 Model 裡面的任何的參數」。這段屬於「會改變概念的來源衝突」，依契約留在正文是對的，不算查核歷程外露。

**第 53–54 頁**：LM-BFF 全名、template「It was [MASK]」、great → positive、terrible → negative、T5 產生候選 template、"Fine-tune and evaluate" 選最佳，全部相符。

**Anthropic 段落**：見 S2。老師口述的部分（買實體書、掃描、法院認定合理使用；盜版網站的書、賠 1.5B；美國較開放、歐盟較嚴、台灣觀望）都對得上 6.1 約 03:02–09:01。除了 M2 的「拆開」。

### 3.2 逐項對過來源、確認相符的內容

預訓練（6.1）
- 送去學校的比喻、三個要點與各自的理由、「一本教科書沒有問答配對」（字幕作 taskbook）、BookCorpus 2015 與爬蟲抓免費書、「免費給你看不代表著作權給你」：相符。講義第 2、3 頁相符。

三種架構（6.2）
- 架構表與第 5 頁相符；「戰國時代」「截至目前 decoder 勝出」「OpenAI 一開始就只做這種」：相符。
- BERT：15% 的兩個理由（第 7 頁 "Too little: expensive to train／Too much: not enough context" 與口述）、[CLS]／最後一個 token／平均三種做法、RoBERTa、SpanBERT：相符。
- GPT：12 層、約 7000 本、BPE（第 11 頁）；GPT-2 加論壇資料（第 13 頁 WebText from Reddit）；GPT-3 的資料來源與多種尺寸（第 14、33 頁）；117M／1.5B／175B（第 15 頁）；手機輸入法的比喻：相符。
- BART／T5：例句、`<X> for inviting <Y> last <Z>`（第 18 頁）、分類做法（第 19 頁）、噪音種類與 text infilling 最好（第 20 頁看圖：Token Masking、Token Deletion、Text Infilling、Document Rotation、Sentence Shuffling，粗體多落在 Text Infilling）、prefix LM 左雙向右單向且不如 encoder-decoder（第 21 頁看圖）、multi-task 與「就是現在的 post-training」（第 22 頁與口述）：相符。
- 第 23 頁（看圖）：理解任務 9 欄裡 BART 高於 T5 的有 8 欄半（MNLI 一個子分數同為 89.9），摘要 ROUGE-1、ROUGE-2 是 BART 高、第三欄 T5 高。「BART 在多數欄位分數較高」正確；老師口頭說「不相上下」（6.2 約 30:01）也正確轉述。

兩個難關（6.3）
- 最小任務 2.5K（第 25 頁 RTE）、業界常常沒有標註資料、fine-tuning 對 in-context learning 的表（第 26 頁）、考試題型說明的比喻（第 27 頁）、zero／one／few-shot：相符。「從任務清單看是 GLUE」有標明是推斷。
- 第 29 頁（看圖）：模型越大三條線都上升，相符。
- 第 30 頁（看圖）：Fine-tuned BERT Large 約 69、BERT++ 約 71.5、175B zero-shot 約 58、few-shot (K=32) 約 73；右圖 0 → 1 個例子從約 58 跳到約 69，1 → 2 幾乎持平。文章「大約 70 分」「將近 60%」「32 個例子超過微調的 BERT」「0 到 1 進步最大、1 到 2 不一定有差」「仍低於專門設計的模型」（Fine-tuned SOTA 約 89）全部相符，且文章有標「數字是老師口述」。
- 第 31 頁（看圖）：最小模型約 76%、最大約 52%、亂猜 50%，「七成多」「接近五成」相符。
- 新詞造句（第 32 頁與口述）：相符。
- Scaling laws：N、D、C 與「幫助分配資源」（第 39 頁看圖）；Chinchilla 70B、1.4T token，對照 Gopher 280B／300B，正好四倍（第 40 頁看圖）；"scaled equally"；每個任務存一份 11B（第 41 頁）；第 42 頁接到 prompt learning：相符。

Hard prompt（6.4）
- entailment 三類、例句、改寫成 "Is it true that…" 後答 yes／no／maybe（第 45–46 頁）、三個元件（第 47–50 頁）、verbalizer 對應（第 50 頁）、「別的詞就算是整個分布裡最高的也不管」（6.4 約 06:00）、zero-shot 沒東西可調（約 09:01）：相符。

Soft prompt（6.5）
- 「文字進模型也是變成向量」「直接訓練向量、可以 back-propagation」、P-Tuning（第 56 頁）、Prompt Tuning 的 one layer 與 mixed-task batch（第 58 頁看圖，圖上確實寫 "Mixed-task Batch"）、「細節不重要、有興趣再看論文」（約 06:00）、soft 比 hard 好且老師認為合理：相符。
- 第 59 頁（看圖）：左圖 Prompt Tuning 在各尺寸都不高於 Model Tuning，最大尺寸時接近；標題 "Competitive performance and better space efficiency"。文章 zh L220 的兩句都正確。

全景與結論（6.6）
- 四階段表（第 60 頁看圖）三欄都相符。
- 分類維度（第 61–66 頁）、五種策略表（第 65 頁看圖：BERT; RoBERTa／GPT-3／Prefix-Tuning／T5／P-Tuning；第 66 頁看圖的打勾也一致）：相符。
- zh L247「老師先把 P-Tuning 和 Prefix-Tuning 一起放在 fixed-LM，後面又說 P-Tuning 兩者都調」：字幕 6.6 約 09:01 兩處都有，轉述正確。
- 「留下來的是 tuning-free prompting」「兩個原因」「手動改 prompt 是手動版 prompt tuning」「動參數比較麻煩、少人做」「模型越大越動不到、chain-of-thought」（6.6 約 12:01–15:03）：相符。

### 3.3 自編例子與計算（全部重算）

- 遮罩（zh L87）：512 × 0.15 = 76.8 ≈ 77；512 − 77 = 435；512 × 0.05 = 25.6 ≈ 26；5% ÷ 15% = 三分之一。正確。
- Verbalizer 走一遍（zh L176–186）：機率和 0.30 + 0.20 + 0.10 + 0.05 + 0.35 = 1.00；三個候選詞裡 no 最高 → contradiction。正確，且條件、推理、結果、意義齊備。
- 儲存量：見 S5，數字正確。

### 3.4 自我檢查八題

| 題 | 答案 | 能否由正文推得 |
|---|---|---|
| 1 | 正確（字幕 6.2 約 12:02） | 前半可以；翻譯那半正文沒寫，見 S6 |
| 2 | 正確（第 18 頁） | 可以（L114–115） |
| 3 | 正確（第 26、41 頁） | 可以（L135–138 的表） |
| 4 | 正確：0.25 > 0.15 → 負面（重算） | 可以；給的機率合計 0.8，其餘落在別的詞，沒有矛盾 |
| 5 | 正確（第 65、66 頁） | 可以 |
| 6 | 正確（6.4 約 09:01、6.3 約 09:06） | 可以 |
| 7 | 判準正確；範例寫法見 S7 | 可以 |
| 8 | 正確 | 可以 |

八題都有答案或判準，沒有「想一想」式的空題。

### 3.5 常見的誤解五條

每一條都有正文依據（依序對應 L137–142、L76 與 L98、L186、L251、L157），開頭寫明「這幾條是我依課堂內容整理的」，沒有冒充老師說法。確認無誤。

### 3.6 契約符合度

- 標題：中英都符合「主題：核心問題｜課名 第 6 堂／Lecture 6」，檢查器 0 issue；兩語的課程與範圍一致。
- 學習目標：zh L39／en L38，四項，可檢驗。
- 機制：三種架構的 attention、MLM、denoising、in-context learning、template／verbalizer、soft prompt 都有講運作方式。
- 完整例子：verbalizer 例子四要素齊備；儲存量例子缺意義一句（S5）。
- 常見誤解、自我檢查（附答案）：齊備。
- 查核歷程：正文裡保留的三處（BART 對 T5、prompt-tuning 動不動模型、P-Tuning 的歸類）都是會改變概念或結論的來源衝突，依契約應留在相關段落。逐頁核對之類的歷程沒有出現在正文，只在文末來源區。符合。
- 版面順序：獨立來源區在教學主體之後，檢查器 0 issue。

### 3.7 中英對照

逐段比對，H2／H3 各 20 個，一一對應；表格列數、所有數字（15%、5%、77、435、26、117M／1.5B／175B、2,500、70、60%、32、70B、31.29／19.78／31.40／51.08、11B、33B、409,600、1.23 million、0.4／0.25／0.15）與頁碼兩語一致。沒有發現漏譯、誤譯或單邊多出的段落。差異只有：

- 講者點名（M1）。
- en L33 影片標題省略中文副標並加註 "(lectures in Mandarin)"，合理。
- en L79 的 "With sixty thousand tokens…" 比中文更像假設語氣（S1）。
- en L58 "took them apart" 與中文同樣的問題（M2）。

### 3.8 粗體標記

以正規表示式掃過中文版，並逐條看過所有 `**…**`：沒有 `**…（…）**` 後面直接接中文字的寫法；收尾 `**` 緊貼全形標點的幾處（L27、L29、L47–49、L87、L176、L198–199、L222、L261–265、各題題目）後面都是空白或行尾，符合 CommonMark 的右側界定條件，會正常渲染。`**GPT（2018）**：`、`**[BART](…)**（Meta）` 這類是標點接標點，也會渲染。**我沒有實際開頁面看渲染結果**，這是依規則推斷。

### 3.9 來源外、未驗證（依指示不查）

- 影片長度（9:23、33:38、21:39、15:55、7:13、15:43、26:15）與所有 YouTube 連結、播放清單、課程頁連結。
- 影片 6.5 的副標「人不懂沒關係機器懂就好」等官方影片標題。
- 所有 arXiv／OpenAI 論文連結與編號、Reuters 與 copyright.gov 連結。
- 「HW2 在第 7 堂那一週公布，只有說明影片」、存取等級 A2、系列內其他文章的連結與標題。
- 6.0 QA 的內容（文章已說明未對照）。
- 封面的致謝：講義印的是 "Mohit Lyyer (Umass)"，文章寫 Mohit Iyyer，是更正講義的拼字，屬來源外資訊。

---

## 統計

- 必修 3 項：M1 英文未點名講者、M2「拆開」無來源、M3「優化」。
- 建議 11 項：S1–S11。
- 沒有發現數字、頁碼、公式或表格與講義不符之處。
