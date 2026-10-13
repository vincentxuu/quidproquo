# 獨立審稿報告：ADL 2025 第 14 堂（Beyond Supervised Learning 與 Multimodality）

審稿日期：2026-10-13。審稿者未參與本篇撰寫與翻譯，只審查、未改動文章。

## 受審版本

| 檔案 | sha256 |
|---|---|
| `src/content/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal.md`（zh-TW，437 行） | `33671b232de0f127e56d91a1eacccda19da71f22c5f3641ba5f452569875de9f` |
| `src/content/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal-en.md`（en，436 行） | `8962953b10ca049ce694e23d1743d24dbe70167cd5ea4c8363df0e14edc1cd8a` |

文章再改動後，本報告不再涵蓋。

## 我實際做了什麼

- 逐字稿 14.1–14.7 全部讀完（七份，共約 12 萬字元）。
- 講義 82 頁：全文用 pdftotext 讀過；另外把下列頁面轉成圖片逐頁看過：5、10、15、16、18、19、21、22、24、25、30、34、37、39、40、42、43、45、47、48、49、50、51、53、54、55、63、64、66、67、68、73、74、75、76、77、78、79、80。其餘頁面（2–4、6–9、11–14、17、20、23、26–29、31–33、35–36、38、41、44、46、52、56–62、65、69–72、81–82）只對過 pdftotext 的文字，沒有看圖。
- 14.7：看過拼圖 `frames-13/14.7-frames.png`，另外從影片擷取 00:40、01:30、02:30、03:15、03:40、04:30、04:55、05:20、11:50、12:20、12:45、13:03、13:20、14:10、15:10 的畫面。影片只有 640×360，小字（投影片 86 的對話內文、頁尾引文的第一個字）看不清楚。
- 英文版逐段對照中文版讀完。
- 跑過 `check-course-titles.mjs`（整個 ntu-adl2025 系列一起傳入，0 issue）與 `check-course-guide-layout.mjs`（0 issue）。
- 沒有查任何外部網頁。影片長度、YouTube 連結、arXiv 連結、課程日期都是「來源外、未驗證」。

結論：**沒有發現必修的事實錯誤**。數字、公式、頁碼、例句、表格逐項對上來源。full-duplex 三種策略與老師口述的對應正確。下面列的是措辭與歸因層級的建議。

---

## 一、必修

無。

---

## 二、建議

行號以中文版為準；英文版正文同一句的行號是中文行號減 1。

### 事實與歸因的措辭

**S1. 「最後兩張投影片」不準確**（zh L314／en L313）
- 原句：「最後兩張投影片引的是 Wang 等 2025 的一篇綜述」／"The last two slides cite a survey by Wang et al. 2025"
- 來源：影片畫面上這兩張是投影片 94、95；後面還有 96（Diverse Approaches and Applications）與 97（Concluding Remarks）。
- 建議：改成「接下來兩張投影片」。

**S2. 「綜述」這個定性在指定來源裡找不到**（zh L314、L320／en L313、L319）
- 投影片標題只寫 Full-Duplex Strategy (Wang et al., 2025)，頁尾引文可辨識的部分是 "Towards … Auditory Intelligence: Large Multimodal Models for Machine Listening and Speaking," arXiv preprint arXiv:2511.01299 (2025)。老師口頭只說「近期 Google 也發了一篇 paper，在語音的領域」（14.7 約 11:20），沒有說是綜述。
- 「綜述／survey」可能是對的，但屬來源外、未驗證。建議改成「一篇 2025 年的論文」，或查過原文再保留。老師口述的「Google」文章沒有採用，這個取捨沒有問題（投影片也沒寫機構）。

**S3. 第 22 頁像素檢索的結果描述偏強**（zh L102／en L101）
- 原句：「直接在像素上算距離，找回來的是顏色分布相近但內容無關的東西。」
- 講義第 22 頁上排三張檢索結果：第一張是一位紅髮女性的臉，後兩張才是無關的東西（一塊有圖樣的東西、一個馬蹄形磁鐵）。老師指的是那塊黑色的東西「跟這個黑黑的蠻像」，並說 code 檢索的結果「至少是人類嘛…比這個大磁鐵來的合理」。
- 建議：改成「找回來的有些是顏色相近但內容無關的東西（例如一塊磁鐵）」。「顏色分布相近」是本文對老師「黑黑的蠻像」的轉述，可接受。

**S4. 第 41 頁的轉述少了半句**（zh L139／en L138）
- 原句：「老師說這裡兩者的差異不大」
- 逐字稿 14.3 約 15:20：用 VAE「可能就會更好一點，雖然這個差異並沒有到非常的明顯」。
- 建議：補成「VAE 稍微好一點，但差異不明顯」。

**S5. 「流理台」與老師的說法不同**（zh L285／en L284）
- 原句：「也都有流理台」／"all have a kitchen counter"
- 逐字稿 14.6 約 13:05：「它會覺得 kitchen 就是要有一些這個洗手檯」。第 80 頁的兩張生成圖確實都有水槽與檯面，所以內容不算錯，只是和口述用詞不同。
- 另外英文句 "the ceilings are all on the low side and all have a kitchen counter" 主詞是 ceilings，文法上變成天花板有流理台，建議改寫。

**S6. any-to-any 的訓練資料：投影片寫的是 Audio Caption**（zh L301／en L300）
- 原句：「聲音配逐字稿」／"audio paired with transcripts"
- 投影片 88 的三列是 Image Caption、Audio Caption、Video Caption。「逐字稿」來自老師的口頭說明（14.7 約 04:35：「audio 也可以 audio caption，就是語音辨識的結果」）。
- 文章跟的是口述，不算錯；但投影片與口述不一致，依契約「來源衝突在相關段落保留」，建議寫成「聲音配聲音描述（老師口頭說就是語音辨識的結果）」。

**S7. SimCSE 有標註版本：講義圖上的標註是 NLI，不是類別**（zh L238／en L237）
- 原句：「有標註時（例如知道哪些句子同一類），把同類的拉近、不同類的推遠，效果更好。」
- 這是老師的口頭說法（14.5 約 15:20：「這幾個句子是 A 主題、這幾個是 B 主題」），轉述正確。但講義第 68 頁的圖用的是 label=entailment 當正例、label=contradiction 當負例。
- 建議：加半句說明講義圖上的標註是句對的 entailment／contradiction，或把括號改成「老師舉的例子是…」。

**S8. 第 49–51 頁與結果頁的出處只寫了 Xia 等 2017**（zh L174、L184／en L173、L183）
- 第 49、50 頁的引文是 Xia 等 2017（正確）。第 51 頁的引文是 Su, Huang, Chen, ACL 2019（Dual Supervised Learning for Natural Language Understanding and Generation），第 52–54 頁的 NLU/NLG 結果應出自這一篇（結果頁本身沒有印引文，這一點是我的推測）。
- 建議：在「第 52–54 頁是結果」前補上 Su 等 2019（第 51 頁）。

**S9. 「下一張投影片（Wu 等 2023）」**（zh L301／en L300）
- LLaVA 的最後一張是投影片 86，Wu+ 2023 是 88、89；中間的 87 我沒有擷取到畫面，內容不明。「下一張」未驗證，建議改成「接下來的投影片」。另外投影片 90 是 Google Gemini Multimodal LLM (2023)，老師只帶過一句，文章沒寫，屬合理取捨。

**S10. σ 稱作變異數**（zh L120／en L119）
- 講義第 34、37 頁寫 N(μ, σ)，老師口頭說 mean 跟 variance，文章照寫，對得上來源。只是 σ 慣例上是標準差，讀者可能困惑；可加一句「講義的記號」。非必要。

### 常見誤解與自我檢查的正文依據

**S11. 「CLIP 沒有用任何標註」這一條正文沒有鋪陳**（zh L335／en L334）
- 「老師特別指出它的標註是圖片和文字的配對關係，只是沒有針對特定任務」有來源：14.6 約 02:25「某種程度上還是有用了 label 的 data，它的 label 其實是 language 跟 image 的關係，但是並沒有對於特定一個任務」。歸因正確，沒有冒充。
- 但正文「CLIP 怎麼訓練」一節沒有寫這件事，讀者第一次看到是在誤解清單。建議在 zh L252 附近補一句。

**S12. 自我檢查第 1 題的答案超出正文**（zh L344／en L343）
- 答案：「同一個數字不同寫法會得到相近的表示」。正文（L65）只寫到「短不代表表示力比較弱，它可能更能呈現語意」。逐字稿有依據（14.1 約 14:00：「因為可能都是 7 的話，它可能很自然而然都可以用類似這樣子的方式來表示」），所以不是無來源，只是「答案都能從上面的內容找到」這句話對這一題不完全成立。
- 建議：把老師那句話補進 L65。

**S13. 自我檢查第 7 題沒有寫出取 max 的步驟**（zh L368／en L367）
- 0.8 − 1.0 + 0.5 = 0.3 正確，max(0, 0.3) = 0.3，答案正確。建議補「大於 0，所以 loss 是 0.3」，和正文例子的寫法一致。

### 契約與格式

**S14. 「內容核對：已依影片核對」的寫法**（zh L422／en L421）
- 契約寫：影片狀態行寫明底本是「講義與機器轉錄逐字稿」，不要寫「內容核對：已依字幕核對」。目前寫的是「已依影片核對」後面再解釋是機器轉錄，意思有到，但開頭那幾個字仍可能被讀成對過字幕。如果這一行是 course-videos 檢查器要解析的固定行就維持；否則建議改成「依講義與機器轉錄逐字稿整理」。我沒有查檢查器是否解析這一行。

**S15. 沒有找到第 14 堂的範圍卡**
- `.work/ntu-adl2025-rewrite-2026-10-13/` 下只有 `scope-lecture-12.md`。契約要求寫作前範圍卡存 `.work/`。可能放在別處，我沒有全站搜尋。

**S16. 英文版多了一句中文版沒有的話**（en L36）
- "The lectures are in Mandarin." 中文版沒有。對英文讀者是合理的補充，也符合事實（逐字稿是中文），列出供確認。

---

## 三、無誤確認

以下每一項都是我對過來源後確認的。標「文字」的只對過 pdftotext，沒有看圖。

### 14.1（第 2–11 頁）
- 第 2 頁：Big data ≠ Big annotated data；三類學習（有標註／有環境給 reward／都沒有）；問句「unlabeled and unrelated data」與答案 Finding latent factors that control the observations。（文字）
- 手寫 4、旋轉約 10 度、像素全變：逐字稿 04:20–05:50。
- Topic model 不需標註、分出主題與常見詞：逐字稿 06:30–07:30。
- 推薦系統：悟空、魯夫；「單純呆／傲嬌」印在第 5 頁上，老師也說「我自己的理解」；推理類、韓劇、實境秀在第 6 頁。（第 5 頁看圖，第 6 頁文字）
- 第 8 頁：28 × 28 = 784 pixels、No. 1／3／5、[1 0 1 0 1 0 …….]。（文字）老師「短不代表表示力比較弱」：逐字稿 13:40。
- 第 9 頁 P(Y|X)、P(X)、P(X, Y)；第 10 頁 p(x, z; θ)（看圖）；第 11 頁三種 latent 形式。

### 14.2（第 12–30 頁）
- 第 15 頁（看圖）：z = σ(Wx + b)、y = σ(W′z + b′)、Minimize (x − y)²、Bottleneck layer。
- 資訊理論的說法：逐字稿 02:50。
- 第 16 頁（看圖）：圖是 9，加雜訊後還原目標是乾淨的 x。第 25 頁（看圖）：Randomly mask 15% of tokens、denoising (masked LM)。15% 來自講義，老師口頭沒說數字。
- 第 17 頁引文 Hinton and Salakhutdinov 2006；第 18 頁（看圖）：PCA 784-30-784，深層 784-1000-500-250-30-250-500-1000-784；第 19 頁（看圖）：壓到 2 維。老師「不是越深越好，要看資料量」：逐字稿 07:00。
- 第 20 頁引文 Krizhevsky 等 2011；第 21 頁（看圖）：32x32、8192-4096-2048-1024-512-256；第 22 頁（看圖）：256 codes，下排三張都是人臉。
- 第 24 頁（看圖）：2000-500-250-125-2。第 23 頁 Semantics are not considered。（文字）
- 第 26–29 頁 layer-wise pre-training 與老師「現在不太需要」：逐字稿 11:10–12:20。
- 第 30 頁（看圖）：Germain et al., 2015；p(x₂)、p(x₃|x₂)、p(x₁|x₂, x₃)，順序是 x₂ → x₃ → x₁。

### 14.3（第 31–43 頁）
- decoder 不能直接生成、VAE 限制分布：逐字稿 00:00–03:30。第 32 頁問句。（文字）
- 第 34 頁（看圖）z ∼ N(μ, σ)；第 37 頁（看圖）encoder 輸出 μ 與 σ、sampling、decode。
- 第 39 頁（看圖）：E_{z∼q_φ(z|x)}[log p_θ(x|z)] − D_KL(q_φ(z|x) ‖ p(z))，下標 reconstruction loss／KL regularizer，Regularized Auto-Encoder。文章省略下標 φ、θ，不影響意思。
- 第 40 頁（看圖）：AE is not generative model: (1) Can't sample new data from AE (2) Can't compute the log likelihood of data x。
- 訓練不穩定因為抽樣：逐字稿 09:30–10:20。
- 第 42 頁（看圖逐字核對）：AE 起點 i went to the store to buy some groceries、終點 horses are my favorite animal、中間有 horses are to buy any groceries；VAE 起點 i want to talk to you、終點 she did n't want to be with him、中間有 i do n't want to be with you。文章把 do n't 寫成 don't，是斷詞的正規化。
- 第 43 頁（看圖）：Posterior collapse issue、relies solely on decoder and ignore latent variable；KL annealing；Σᵢ max[λ, D_KL(q_φ(zᵢ|x) ‖ p(zᵢ))]。老師的解釋：逐字稿 18:30–20:10。

### 14.4（第 44–55 頁）
- 第 45 頁（看圖）：五列對偶任務全部對上。
- 第 46 頁與「強化學習的概念」「語意相近不必一字不差」：逐字稿 03:00–04:40。
- 第 47 頁（看圖）：例句、area[riverside], eatType[pub], name[blue spice]、g(f(x)) ≡ x、f(g(y)) ≡ y、Su 等 ACL 2020。
- 第 49 頁（看圖）：Xia et al., 2017、Proposed for machine translation、機率等式。第 50 頁（看圖）：l_duality 的式子逐項對上。
- P(x) 用語言模型、語意那邊用 MADE：逐字稿 08:00–09:30，第 48 頁 Masked autoencoder (MADE) for semantics。
- 第 52–54 頁：50k examples in the restaurant domain。第 53 頁（看圖）：加 duality 後 ROUGE-1、BLEU 上升，F1 幾乎不變（略低）；第 54 頁（看圖）：加 MADE 後三項都最高。文章寫的是老師的解讀，與圖一致。
- 第 55 頁（看圖）：四列比較全部對上。「沒有主從」是老師的話（逐字稿 12:00）。

### 14.5（第 56–70 頁）
- 第 57 頁定義、第 58 頁 intra-sample／inter-sample、第 59 頁的幾種遮法。（文字）老師對比 AE／VAE：逐字稿 00:30。
- 第 61、62 頁。（文字）「常被用來調整 embedding」：逐字稿 04:20。
- 第 63 頁（看圖）：Schroff et al., 2015；max(0, ‖f(x) − f(x⁺)‖² − ‖f(x) − f(x⁻)‖² + ε)。講義外面多一個 Σₓ，文章寫單一 triplet 的形式。
- 第 64 頁（看圖）：Sohn, 2016，multiple negative samples。負例隨機抽：逐字稿 08:30。
- 第 65 頁 pseudo labels（文字）；第 66 頁（看圖）：data augmentation、different modalities、mainstream approaches for contrastive learning。灰階、放大縮小、旋轉、「跑得很快」：逐字稿 10:20–12:10。
- 第 67 頁（看圖）：Gao et al., 2021；圖上寫 Different hidden dropout mask in two forward passes，負例是同批其他句子；右表是 STS12–16、STS-B、SICK-R。老師「沒有任何新的資料」：逐字稿 14:20。
- 第 69–70 頁 Chang & Chen, 2022（文字）；老師的說明：逐字稿 16:00–17:00。
- 客服中心的新例子（LLM embedding 上再做對比學習、先分群、比直接丟給語言模型好、再請語言模型命名）：逐字稿 17:10–20:30。

### 14.6（第 71–80 頁）
- 第 71 頁。（文字）第 72–73 頁（73 看圖）：400 million (image, text) pairs、batch-size=32,768、Iᵢ·Tⱼ 矩陣與對角線。老師解釋圖都有文字、batch 越大越好：逐字稿 02:50–05:00。
- 第 74 頁（看圖）：A photo of a {object}，圖上的類別是 plane、car、dog、bird；dog、cat 是老師口頭的例子。
- 第 75 頁（看圖逐格核對）：ImageNet 76.2／76.2、ImageNetV2 64.3／70.1、ImageNet-R 37.7／88.9、ObjectNet 32.6／72.3、ImageNet Sketch 25.2／60.2、ImageNet-A 2.7／77.1。十二個數字全對，欄名是 ImageNet ResNet101 與 Zero-Shot CLIP。手繪香蕉 25% 對 60 幾 %：逐字稿 08:40–09:30。
- 第 76–79 頁（看圖）：prior P(zᵢ|y)、decoder P(x|zᵢ, y)、P(x|y) = P(x|zᵢ, y)P(zᵢ|y)；第 77 頁 produces a CLIP image embedding given a caption。老師只提 diffusion model：逐字稿 11:20。
- 第 80 頁（看圖）：caption 是 a small kitchen with a low ceiling，真實圖是斜屋頂。

### 14.7（影片畫面與逐字稿）
- 投影片 84–86（看畫面）：LLaVA: Large Language and Vision Assistant (Liu+, 2023)；Idea: use language-only GPT-4 to generate instruction tuning dataset for multimodal VLM tuning；Projection W、Vision Encoder、Language Model；燙衣服的照片，車是黃色計程車樣式，投影片內文可辨識出 moving taxi 字樣；問題是 What is unusual about this image。
- 投影片 88–89（看畫面）：Multimodal LLM (Wu+, 2023)；Encoding-side LLM-centric alignment 與 Decoding-side instruction-following alignment；輸入端各有 Encoder 與 Input Projection，輸出端各有 Output Projection 接到 diffusion 模型。
- 投影片 91–93（看畫面）：GPT-4o: Streaming Multimodal Interaction (2024)；Pipelined 與 End-to-end；[ENTER] 的圖。老師的說明：逐字稿 05:20–11:10，文章每一句轉述都找得到。
- **Full-duplex 三種策略的對應正確。** 投影片 94（看畫面）：(a) Perpetual speaking，一個 Speech Interaction LLM，圖下標 One time block；(b) Model-as-a-server，兩個方塊，Speech Interaction LLM (Monitoring) 與 Speech Interaction LLM (Generation)；(c) Standalone state prediction，一個 Speech Interaction LLM。
  - 「有一個 monitor 專門判斷」（逐字稿 11:55–12:40）對應 (b)：圖上就寫 Monitoring；13:20 老師說「直接拿一個現成的 language model，再 train 一個什麼時候接手講話的」時游標停在 (b) 的 Monitoring 方塊。
  - 「全部 training 在一起」（逐字稿 12:41–12:56）對應 (c)：12:45 的畫面游標在 (c) 下方。
  - 「理想上最符合人類、比較難訓練」（13:07–13:15）：13:03 的畫面游標仍在 (c)。
  - 11:50 講「每一次都要產生回應…就會一直講」時游標在 (a)。
  - 「她沒有說哪一種最好」：逐字稿 13:01「不一定哪一個比較好」。
- 投影片 95（看畫面）：Multi-stage Training 下 Paradigm (1) Large-scale Pre-training → Dialogue Fine-tuning、Paradigm (2) Comprehension → Generation。老師「沒有理解好，生成也很難訓練好」：逐字稿 14:30。
- 老師的總結三句：逐字稿 18:20–19:50。

### 本文自編的例子與第 7 題（我重算）
- Triplet：1.0 − 1.5 + 1 = 0.5 → loss 0.5；1.0 − 2.5 + 1 = −0.5 → loss 0。正確。「達到差距之後不再產生梯度」正確。
- CLIP：32,768² = 1,073,741,824，約 10.7 億（1.07 billion）；每張圖 1 個正例、32,767 個負例。正確。
- 第 7 題：max(0, 0.8 − 1.0 + 0.5) = 0.3。正確。

### 自我檢查十題
十題答案都正確。第 2–6、8–10 題可由正文直接推得；第 1 題見 S12；第 7 題見 S13。

### 常見的誤解七條
開頭已聲明「是本文的歸納，不是課堂上逐條列出的內容」。七條裡只有 CLIP 那一條寫「老師特別指出」，有逐字稿依據（見 S11）。其餘六條都能在正文找到對應段落，沒有冒充老師說法。

### 「老師說」的歸因
全文標成老師說法的句子我逐句對過逐字稿，都找得到，沒有發現把本文的解釋寫成老師說的。標成「講義說／講義寫」的句子也都在對應頁面上。

### 契約符合度
- 標題：中英文格式都符合，檢查器 0 issue；堂次 14 與 series.order 15 分開，沒有混用。
- 學習目標：zh L52 列了五項能力。
- 機制：各節都有從問題到做法的說明。
- 完整範例：兩個自編例子都有條件、推理、結果與意義，都標了「本文自編」。講義的內插例句、CLIP 表格是有結果解讀的來源例子。
- 常見誤解、自我檢查（附答案）：齊備。
- 查核歷程：正文只留來源底本的說明（L37–38、L289、L422），沒有逐頁核對紀錄，位置合理。
- 版面：教學主體在來源區之前，檢查器 0 issue。

### 中英對照
- 逐段對照沒有發現漏譯或誤譯。公式、表格、所有數字（784、30、15%、256、2000、2、5 萬／50,000、4 億／400 million、32,768、10.7 億／1.07 billion、32,767、十二個表格數字、0.5、0.3）兩版一致。
- 站內連結六個全部是 -en 版本（course-overview、bert-family、rag-hw3、post-training-rlhf、conversational-ai-tool-use、ta-recitations），目標檔都存在。錨點 `#course-video-sources` 對得上英文標題。
- 多出的內容只有 S16 那一句。
- 文法小問題一處，見 S5。

### 中國用語
中文版沒有出現質量、信息、視頻、默認、反饋、優化、技術棧、窗口、數據、網絡、用戶、算法、概率、魯棒等用語。用的是資訊、回饋、機率、穩健、資料、變異數。

### 來源外、未驗證
- 影片長度七個數字、YouTube 連結、播放清單連結、課程頁連結。
- 四篇論文的 arXiv 連結，以及 2024 講義的網址。
- 「ADL Fall 2025（114-1，2025/09/01–12/15）12/01 那一週」「最後一堂講課」「2026-10-10 對照官方播放清單」。
- Wang 等 2025 是不是綜述（S2）。
- Radford 2021、Ramesh 2022 等年份與講義引文一致，但講義引文本身的會議名稱我沒有另外查。
