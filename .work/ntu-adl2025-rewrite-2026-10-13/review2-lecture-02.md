# 第 2 堂（神經網路與反向傳播）獨立審稿報告（第二輪）

- 審稿日期：2026-10-13。審稿者未參與本篇撰寫；只審查，未改文章。
- 待審檔與內容 hash（sha256 前 16 碼）：
  - zh：`src/content/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop.md`（`cd19ea844af298f7`）
  - en：`src/content/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en.md`（`1e65f5d146075112`）
- 對照來源：`transcripts/lecture-02-captions.txt`（2.2／2.3／2.5／2.4 全文讀完）、`transcripts/2.1.txt`（全文）、`slides/nn.pdf`（pdftotext 全文＋第 12、28、39、51、58、65、68、69、80、81、86、87、92 頁轉圖）、`slides/bp.pdf`（pdftotext 全文＋第 13、15、18、20、22、26–32 頁轉圖）、`course-guide-contract.md`。
- 結論：必修 1 項、建議 8 項。公式、反向傳播方向、三個自編例子與自我檢查的數值全部重算無誤。

下文行號中英兩檔相同（兩檔逐行對齊），除非另註。

---

## 一、必修

### M1. 「2.1 沒有可取得的字幕，未對照」已與現況不符

- 位置：zh／en 第 402 行；連帶第 12 行 description（「影片 2.2–2.5 的課堂口述」）、第 410 行更新紀錄（「依四支影片」）。
- 原句（zh 402）：「2.2、2.3、2.4、2.5 四支都依字幕整理；2.1（4:41）沒有可取得的字幕，未對照。」
- 依據（已實際對過）：`transcripts/2.1.txt` 存在，是帶時間戳的機器轉錄，從 00:00 到 04:35。內容與文章第 38–42 行相符：02:56 起講三個步驟（model 是 function set 的定義、什麼叫好的 function、怎麼找最好的，第三步稱 optimization），與 NN Basics 第 6 頁三題一致。文章沒有任何一句和 2.1 逐字稿衝突。
- 契約依據：`course-guide-contract.md`「影片沒有字幕軌，不等於拿不到課堂口述」；底本是機器轉錄時要寫明「講義與機器轉錄逐字稿」。
- 建議文字：
  - zh：「內容核對（2026-10-13）：2.2、2.3、2.4、2.5 依字幕整理；2.1（4:41）沒有字幕軌，改以機器轉錄逐字稿對照，三個問題的拆法與講義第 6 頁一致。」description 改成「影片 2.1–2.5 的課堂口述」。
  - en: "Content check (2026-10-13): 2.2, 2.3, 2.4, and 2.5 were worked from their captions; 2.1 (4:41) has no caption track and was checked against a machine transcript, whose three-question breakdown matches page 6 of the deck." Change the description to "videos 2.1–2.5".
- 註：我只能確認逐字稿存在且內容相符；作者當時是否看過這份逐字稿我無從得知，所以建議文字寫的是現在可以成立的說法。

---

## 二、建議

### S1. overfitting 圖：10 次方那格的數字 0.52 沒寫，三個數字也沒說明是訓練資料上的 MSE

- 位置：第 239 行。
- 原句：「一次方的模型只能畫直線，圖上標的誤差是 1.37；二次方……誤差 0.70；次方很高的模型（圖上是 10 次方，影片口述成十四次方）可以更貼近訓練資料，training 的誤差可能更低」
- 依據（nn.pdf 第 92 頁轉圖）：圖標題「Fitting training data」，三格圖例分別是「Training data (MSE = 1.37)」「(MSE = 0.70)」「(MSE = 0.52)」，第三格標「Degree = 10」。字幕 2.4 [51:00] 只唸了 1.37 與 0.7，並說「設到 14 方」；[54:02] 說 training 的 loss「有可能更低」。
- 判斷：現有寫法沒有錯，10 與 14 也有並陳。但圖上其實給了數字，「可能更低」可以寫成確定的 0.52。
- 建議文字：
  - zh：「一次方的模型只能畫直線，圖上標的訓練資料 MSE 是 1.37；二次方是 0.70；次方很高的模型（圖上是 10 次方，影片口述成十四次方）在訓練資料上的 MSE 更低，圖上標 0.52，但曲線在點與點之間亂彎……」
  - en: "A degree-1 model can only draw a line, and the figure marks its MSE on the training data as 1.37; degree 2 gives 0.70. A model of very high degree (degree 10 on the figure; she says 14 in the video) gets a lower training MSE still, 0.52 on the figure, but the curve swings wildly between points…"

### S2. learning rate「在最低點兩側跳來跳去」來源沒有

- 位置：第 225 行。
- 原句：「太大，一步跨過最低點，loss 反而變高，或在最低點兩側跳來跳去下不去」
- 依據：字幕 2.4 [39:03]–[42:00]：很大時「走到這邊，然後反而到達了一個 cost 更高的地方」；沒那麼大但不夠小時「略過了這個實際上是 minimal 的點，所以我就會卡在這邊，loss 也下不去」。第 86 頁轉圖：Very Large 曲線上升，Large 曲線很快停在高處不再下降，右圖綠色箭頭是跨過深谷停在另一側平台，沒有來回跳的畫法。
- 建議文字：
  - zh：「太大，一步跨到 cost 更高的地方；稍微小一點但還是太大，會略過最低點、卡在別處，loss 降不下去；太小，下得去但非常慢。」
  - en: "Too large, and one step lands somewhere with a higher cost. Somewhat smaller but still too large, and it skips past the minimum and gets stuck elsewhere, so the loss stops falling. Too small, and it descends very slowly."

### S3. 「講義這幾頁沒有寫 bias」說得太滿

- 位置：第 297 行。
- 原句：「講義這幾頁沒有寫 bias。照同樣的拆法可以補上（本文補充）」
- 依據（bp.pdf 第 29、31、32 頁轉圖）：第 29、32 頁的 Forward Pass 寫了 `z^l = W^l a^(l-1) + b^l`；第 31 頁的 ∇C(θ) 向量裡列了 `∂C(θ)/∂b_i^l` 這一項。講義沒有的是 bias 梯度的推導與算式。字幕 2.5 全段也只推導權重。
- 建議文字：
  - zh：「講義只推導了權重的梯度；第 31 頁的梯度向量裡列了 ∂C/∂b，但沒有寫它怎麼算。照同樣的拆法可以補上（本文補充）：bias 的梯度就是 δ，因為 ∂z/∂b = 1。」
  - en: "The deck derives only the weight gradients. Page 31 lists ∂C/∂b in the gradient vector but does not say how to compute it. The same split gives it (my own addition): a bias's gradient is δ itself, because ∂z/∂b = 1."

### S4. 符號對照裡的 `x = a^0` 不是講義的寫法

- 位置：第 137 行（`<details>` 內，標題寫「NN Basics 第 30–34 頁」）。
- 原句：「整個網路就是把 `x = a^0` 一層層套這兩條式子，直到輸出層 `y = a^L`。」
- 依據：nn.pdf 第 39 頁轉圖寫 `a^1 = σ(W^1 x + b^1)`、`a^L = σ(W^L a^(L-1) + b^L) = y`，沒有 a^0。bp.pdf 第 18、29 頁把第一層另外列成 `x_j, l = 1`，字幕 2.5 [15:02] 也說第一層的輸入是 x、不是前一層的輸出。`y = a^L` 有依據，`x = a^0` 是本文的簡寫，卻放在標了講義頁碼的區塊裡，而且文章第 269 行自己也照講義把第一層另外處理。
- 建議文字：
  - zh：「整個網路就是從輸入 x 開始一層層套這兩條式子（第一層用 x 取代 a^(l−1)），直到輸出層 `y = a^L`（第 39 頁）。」
  - en: "The whole network applies these two lines layer by layer starting from the input x (the first layer uses x in place of a^(l−1)) up to the output layer `y = a^L` (page 39)."

### S5. 英文版正文第一次提到講者沒有點名

- 位置：en 第 48 行。
- 原句："…which the instructor says is the usual case in practice. She also notes…"
- 依據：正文在此之前只有系列名稱裡出現 Yun-Nung Chen，第一次指稱講者用的是 the instructor，下一句就接 She。
- 建議文字：
  - en: "…which Yun-Nung Chen, the instructor, says is the usual case in practice. She also notes…"
  - zh（對應處第 48 行可不改；若要一致）：「陳縕儂老師說實際應用多半是後者。」

### S6. 兩處頁碼標得比實際寬

- 第 110–112 行：「第 28 頁用圖說明表達力怎麼長出來：一層：一面斜坡」。第 28 頁轉圖只有兩層的 ridge 與三層的 bump；一面坡的圖在第 23 頁（"location, orientation, and steepness of cliff"）。
  - zh：「第 23 與 28 頁用圖說明表達力怎麼長出來」
  - en: "Pages 23 and 28 illustrate how expressive power grows"
- 第 234 行：「除錯的順序（第 90–92 頁）」。流程圖在第 90–91 頁，第 92 頁是 overfitting 圖，下一段已另外引用。
  - zh：「除錯的順序（第 90–91 頁）」
  - en: "The debugging order (pages 90–91)"

### S7. 兩處式子是把講義簡化過的，沒有註明

- 第 156 行：「把每筆資料『預測值與真實值的差的絕對值』加總」。「絕對值」是老師口述（字幕 2.3 [06:00]）；第 51 頁轉圖寫的是範數 `C(θ) = Σ_k ‖ŷ_k − f(x_k; θ)‖`。輸出是向量時兩者不同。
  - zh：「最直接的 loss 是把每筆資料預測與答案的差距加總（第 51 頁寫成範數 ‖ŷ − f(x; θ)‖，老師口頭說成差的絕對值）。」
  - en: "The most direct loss sums, over all examples, the gap between prediction and answer (page 51 writes it as a norm ‖ŷ − f(x; θ)‖; she calls it the absolute difference)."
- 第 184 行：「loss 用 square error，C = (y − ŷ)²」。第 65 頁轉圖寫的是對所有 x 加總：`C(θ) = Σ_∀x ‖ŷ − f(x; θ)‖ = (ŷ − f(x; θ))²`，第 68 頁推導時才省掉加總。文章的三條偏微分與第 69 頁完全一致，這裡只是少一句交代。
  - zh：「loss 用 square error；講義第 65 頁是對所有資料加總，這裡和第 68 頁的推導一樣只看一筆：C = (y − ŷ)²。」
  - en: "The loss is square error. Page 65 sums it over all examples; as in the derivation on page 68, this looks at one example: C = (y − ŷ)²."

### S8. 更新紀錄裡的查核歷程可以收斂

- 位置：第 406–408 行。
- 原句（408）：「依字幕核對影片內容。2.2 字幕與文章 Q1 各段相符；2.1 取不到字幕，未核對內容……」
- 依據：契約「登入測試、逐頁核對、字幕修正歷程放 .work/ 或研究筆記」。這三條 2026-10-10 的紀錄描述的是重寫前的版本，其中「2.1 取不到字幕」和 M1 是同一件事。它在文末不在教學主體，影響小。
- 建議文字：
  - zh：三條併成「2026-10-10：標註影片狀態，核對錄影來源；2.1、2.2 是 2023/09/14 的舊錄影。」
  - en: merge into "2026-10-10: Added video status and checked recording sources; 2.1 and 2.2 are older recordings dated 2023/09/14."

---

## 三、無誤確認

### 3.1 實際對過來源確認的項目

**頁數與頁碼範圍**
- NN Basics 93 頁、Backpropagation 33 頁（pdfinfo）。
- 表格頁碼範圍：第 4 頁「How to Train a Model?」、第 8 頁「What is the Model?」、第 45 頁「What does the Good Function mean?」、第 53 頁「How can we Pick the Best Function?」都是標題頁，範圍 4–7／8–44／45–52／53–93 正確。
- 第 6 頁三題、第 10 頁分類、第 11–14 頁向量表示、第 16–20 頁單一神經元、第 18 頁 class prior、第 21 頁 10 neurons、第 23–25 頁 perceptron 與 XOR、第 30–40 頁符號、第 43 頁三種 activation、第 48／50／52 頁、第 57–61 頁 gradient descent、第 64–69 頁單一神經元、第 80–82 頁、第 83／85／86／87 頁、第 88–89 頁、bp 第 12／13／26–27／29–32 頁，全部與講義對得上。

**公式（均以轉圖確認）**
- `z^l = W^l a^(l-1) + b^l`、`a^l = σ(z^l)`：nn 第 38 頁、bp 第 6／29 頁。
- `w_ij^l` 是從 l−1 層的 j 到 l 層的 i：nn 第 31 頁、字幕 2.2 [33:00]。
- `θ^(i+1) = θ^i − η ∂C/∂θ`：nn 第 58 頁。
- 單一神經元三條偏微分 `2(y − ŷ)·y(1 − y)·x1`／`x2`／無係數：nn 第 68–69 頁（講義寫成 `2(σ(Wx+b) − ŷ)[1 − σ(Wx+b)]σ(Wx+b)x1`），符號方向一致。
- chain rule `∂z/∂w = ∂z/∂y · ∂y/∂x · ∂x/∂w`：bp 第 13 頁。
- `∂C/∂w_ij^l = ∂z_i^l/∂w_ij^l × ∂C/∂z_i^l`，前段是 `a_j^(l-1)`（l>1）或 `x_j`（l=1）：bp 第 15／18 頁。
- `δ_i^l` 定義為「the propagated gradient corresponding to the l-th layer」：bp 第 20 頁。
- `δ^L = σ'(z^L) ⊙ ∇C(y)`：bp 第 22／28 頁。
- `δ_i^l = σ'(z_i^l) Σ_k w_ki^(l+1) δ_k^(l+1)`、`δ^l = σ'(z^l) ⊙ (W^(l+1))^T δ^(l+1)`：bp 第 26–27 頁，下標 ki 的順序正確。
- 第 87 頁是 √K 倍（pdftotext 漏掉根號，轉圖確認）；老師的例子是 4 倍對 2 倍（字幕 2.4 [45:03]）。

**反向傳播的方向**
- δ 從 δ^L 算到 δ^1（bp 第 20 頁「from δ^L to δ^1」）；backward 先算最靠近輸出的一項（bp 第 13 頁箭頭、字幕 2.5 [12:01]）；forward 存每層 a、backward 算 δ、兩者相乘（bp 第 32 頁、字幕 2.5 [39:01]–[42:02]）。文章三處敘述方向都對。
- 「乘一個常數 σ'(z)」「方向相反的網路」：bp 第 26 頁「multiply a constant」、字幕 2.5 [33:02]–[36:03]。
- 字幕 2.5 [42:02] 老師口誤成「delta l 乘上 a l」，文章照講義寫 a^(l−1)，處理正確。

**數字與機制**
- 16×16＝256 維、10 維輸出、1 for ink（第 12 頁）；詞典 1000 詞、三類（字幕 2.2 [06:00]）；n 設成 1000（[03:06]）。
- 門檻 0.5、「is 2 / not 2」（第 20 頁）。
- bias 是 always-on feature、z 到 0 時 y 才到 0.5、資料多半該超過 0.5 時會學出較大的 b（字幕 2.2 [09:03]–[12:00]）。
- 1 和 7、7 和 9（[15:00]）；各輸出獨立、不共用權重（第 23 頁、[18:00]）；位置、方向、陡度（第 23 頁）。
- XOR＝(A AND NOT B) OR (NOT A AND B)（第 25 頁 `AB' + A'B`、[21:00]）。
- ridge 是兩面對向的坡夾起來、bump 是兩道垂直的 ridge（第 28 頁、[24:00]–[27:00]）；參數太多會去包 noise、需要更多資料（[27:00]）。
- hidden layer 超過一層叫 deep、之前只算得動一層（[27:00]–[30:00]）。
- 線性 activation 可以乘開成一個矩陣（[45:00]）；選哪種沒有好的 guideline（[42:00]）。
- loss／cost／error 與 objective／reward（第 50 頁）；平方是差越多罰越重（字幕 2.3 [06:00]）。
- 暴力法與直接解微分走不通（第 55 頁、字幕 2.4 [00:00]–[03:01]）。
- 100×100 一萬個、十層十萬個、millions（字幕 2.4 [24:00]）。
- 一萬筆資料（[24:00]）；SGD 期望值（第 74 頁、[27:02]）；20 筆更新 20 次（第 76 頁）。
- 第 80 頁轉圖：準確率 stochastic 約 97、10 約 96、100 約 92、1000 約 74、10000 與 full 約 50；訓練時間 SGD 約 270 秒、10–1000 約 35 秒、full 約 650 秒。「靠近 SGD 一側較準」「大約 10」（[36:01]）成立。
- 矩陣乘矩陣比多次矩陣乘向量快（第 82 頁）。
- local optima 沒有完全解決、non-convex（第 83 頁、[39:03]）；每次同一點出發會卡在同一處（[39:03]）；shuffle 與記住順序、固定 batch size（第 87 頁）；「沒有細究為什麼是根號 K」（[45:03]）。
- training／validation／real testing（第 88–89 頁）；先假設有包到但沒找到、調 training strategy，不行才改 model（[51:00]）；overfitting 定義（第 91 頁）；more training samples、dropout（第 92 頁）。
- 反向傳播不用自己寫（字幕 2.5 [00:00]）；「can be applied to any function」（bp 第 12 頁）；誤差越大梯度越大（[27:02]）。

**自編例子與計算題（全部用 Python 重算）**
- XOR 網路四列真值表正確。
- 單一神經元：z＝−0.5、y＝0.37754、C＝0.38746、共同部分＝−0.29256、∂C/∂w2＝−0.58512；更新後 w＝(0.79256, 0.08512)、b＝0.29256、z＝1.25536、y＝0.77823、C＝0.04918。文章各數值四捨五入正確。
- 反向傳播：a¹＝0.62246、y＝0.34922、C＝0.42351、σ'(z²)＝0.22727、2(y−1)＝−1.30156、δ²＝−0.29580、δ¹＝0.06951、∂C/∂w²＝−0.18412、∂C/∂w¹＝0.06951。中央差分（±0.0001）得 0.069514 與 −0.184123，驗算成立。正負號的解讀（w² 為負所以 w¹ 要減少）正確。
- 自我檢查 1：5000 維、一個 1。可由第 55–57 行推得。
- 自我檢查 2：h1＝0、h2＝0、y＝0。正確。
- 自我檢查 3：共同部分 −0.25，∂C/∂w1＝−0.25，∂C/∂w2＝0。正確。
- 自我檢查 3b：w1＝0.25、w2＝0、b＝0.25、z＝0.5、y＝0.6225。正確。
- 自我檢查 4：20／1／1000。正確，可由第 211–217 行推得。
- 自我檢查 5：與第 236 行一致。
- 自我檢查 6：δ¹＝0。正確。
- 自我檢查 7：a¹＝0.73106、y＝0.67504、C＝0.45568、y(1−y)＝0.21936、2y＝1.35008、δ²＝0.29615、a¹(1−a¹)＝0.19661、δ¹＝0.05823、∂C/∂w²＝0.21651。正確。

**常見的誤解（五條）**
- 都有正文依據（第 78–89、143、219、237、243–299 行）。開頭寫明「這幾條是我依課堂內容整理的」，沒有冒充老師說法。
- 第 192 行「輸入是 0 的那一維梯度是 0」標了「這是我的推論」，第 297 行標了「本文補充」，三個例子都標「本文自編」，歸因清楚。

**契約符合度**
- 標題格式：`check-course-titles.mjs` 兩檔 0 issue；中英課程與堂次一致。
- 學習目標（第 34 行四項能力）、機制（三題＋反向傳播）、完整範例三個（各有條件、計算、結果、結果的意思）、常見誤解、附答案的自我檢查，齊備。四項學習目標分別對應自我檢查 1、2、3／3b、6／7。
- 教學主體內沒有查核歷程；來源與核對說明在文末「課程影片來源」（M1、S8 除外）。

**中英對照**
- 逐段比對：章節、表格、程式碼區塊、所有數字與公式一致，沒有漏譯或誤譯。
- 英文版多出的只有在地化說明（"in Mandarin"、"NTU term 114-1"），表格省略影片的中文副標，都不影響內容。
- 英文第 223 行 "the first hollow it rolls into" 比中文多一個 first，不改變意思。

**中國用語**
- 掃過 質量、信息、視頻、默認、反饋、優化、技術棧、窗口、數據、網絡、算法、軟件、硬件、內存、模塊、接口、文檔、代碼、用戶、服務器、激活、魯棒、調用、運行：全部無命中。文中用的是最佳化、資訊、資料、神經網路。

**粗體標記**
- 用 CommonMark flanking 規則掃過兩檔所有 `**`，沒有不會渲染的寫法。`**…（本文自編）。**` 後面都接空白；`**…C(θ)**：` 後面接全形標點，可以渲染。

### 3.2 來源外、未驗證的項目

以下不在指定來源內，我沒有查：

- 五支影片的長度（4:41、46:40、8:41、57:29、44:06）。2.1 逐字稿最後一個時間戳是 04:35，與 4:41 不衝突，但不算驗證。
- 所有 YouTube、課程頁、講義 PDF、播放清單的外部連結。
- 「114-1，2025/09/01–12/15」「自學／先修列」「HW0」「選課前就要看完」（第 20 行）。講義封面日期是 September 1st, 2025，只能佐證 09/01。
- 「2.5 不在 2025 Fall 播放清單裡」（第 32 行）。
- 「2.1、2.2 的上傳日與說明欄都是 2023/09/14」（第 402 行）。bp.pdf 最後一頁寫 slido: #ADL2024，可見素材有沿用，但不能證明上傳日。
- 延伸閱讀與上下篇的站內連結是否存在、標題是否正確。
- 第 382 行「2026-10-10 對照官方課程頁與官方播放清單」。

### 3.3 審稿限制

- 字幕是自動字幕，專有名詞錯字很多（perception＝perceptron、airpods＝epoch、trend rule＝chain rule 等），我依上下文與講義判讀。
- 講義只把上面列出的頁轉成圖；其餘頁只看 pdftotext，那些頁沒有文章引用的公式或圖上數字。
