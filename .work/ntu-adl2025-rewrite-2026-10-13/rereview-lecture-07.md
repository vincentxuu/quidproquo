# 複審報告：ADL 2025 第 7 堂（Post-Training 與 LLM Adaptation）

複審日期：2026-10-13。複審者未參與撰寫與第一次審查，只審查、未改動文章。

## 審查對象與版本

| 檔案 | sha256（複審時） |
|---|---|
| `src/content/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf.md`（zh-TW） | `154eca02aa78a4029ea2386df8f01f28286c16d993650d8697db0aead2f053d5` |
| `src/content/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en.md`（en） | `fefbae6e4b396a7f756b423715ac7937aec0e9543712ecc34bf1a4f991266227` |

兩個 hash 都和第一次報告記錄的不同，確認是修改後的版本。中英兩版行號仍一一對應，下面的行號兩版通用。

第一次審查的版本沒有 commit，所以沒辦法用 diff 找出修改處。我是拿第一次報告引用的原句，到目前的文章裡逐條找對應句子。

## 這次實際對了什麼

- 字幕 `lecture-07-captions.txt`：用關鍵字抽出上下文，對過 7.2 的資料集名稱段、T5／STS-B 段、T0 11B 段，7.3 的 total reward 段、reference summary 段、DPO 化簡與效率段，7.5 的十億參數段、LoRA feed-forward 段、1024 與旋轉段、37／40 與「都在最上面」段、UniPELT gate 與「第二好」段、選方法的建議段。
- `7.4.txt` 第 104–122 行（PPO 式子那段）、`hw2.txt` 第 160–180 行（bonus 那段）與「連結」「ppl」相關行。
- 講義轉圖實際看過的頁面：Adaptation 第 9、11 頁（100 dpi）、第 13 頁（300 dpi）；Post-Training 第 17、19、27、38、45 頁（100 dpi）。
- 三個自編例子與自我檢查第 4、8 題用 Python 重算。
- 沒有重對的部分：第一次報告「無誤確認」表裡、這次沒有被修改的項目，我沒有全部重做，見最後一段。

## 結論

三項必修都已正確修正，沒有因為修改而引入新的事實錯誤。建議項大多已處理。剩下四處沒改或只改一半，都屬於措辭層級，沒有一項會讓讀者學到錯的東西；其中第 344 行（圖的描述和圖本身有出入）與第 384 行（來源外的斷言）我認為值得改。

---

## 仍需修改

### R1　第 344 行：LoRA 那條線「在各個參數量下都在最上面」（原建議 S5，未修正）

- 原句（zh）：「右邊兩張圖的橫軸是可訓練參數量，LoRA 那條線在各個參數量下都在最上面。」
- 原句（en）：「In the two charts on the right, the horizontal axis is the number of trainable parameters and LoRA's line is on top at every count.」
- 依據：字幕 7.5 [12:02] 老師確實說「它的 LowRank 的方式是，都在最上面就是 performance 最好，就是粉紅色這一條」。但 Adaptation 第 11 頁下方 MultiNLI-matched 那張圖，橫軸大約 7.6 到 8.5 之間，Adapter 的叉號和 LoRA 的三角形幾乎疊在一起（都在 0.915 上下）；上方 WikiSQL 那張圖 LoRA 才明顯在最上面。目前的句子沒有寫成老師說的，讀起來是本文對圖的描述，和圖有一點出入。
- 是否該修：建議修。改動很小，把這句歸給老師，再補一句圖上看到的情況。
- 建議文字（zh）：「右邊兩張圖的橫軸是可訓練參數量，老師說 LoRA 那條粉紅色的線都在最上面；細看 MultiNLI 那張，參數量較多的那一端 Adapter 的點和它幾乎重疊。」
- 建議文字（en）：「In the two charts on the right, the horizontal axis is the number of trainable parameters, and she says LoRA's pink line is on top throughout; on the MultiNLI chart the Adapter points nearly overlap it at the larger parameter counts.」

### R2　第 384 行：「校外的讀者拿不到資料集與評分指令稿」（原 HW2 建議，未修正）

- 原句（zh）：「校外的讀者拿不到資料集與評分指令稿。」
- 原句（en）：「Readers outside the course cannot get the dataset or the scoring script.」
- 依據：`hw2.txt` 只說答案與 `ppl.py` 放在「作業的連結」（[05:35]、[08:21]–[08:25]、[12:15]），沒有說這個連結對不對外公開。這句是來源外的斷言，文章也沒有標成本文的判斷。
- 是否該修：建議修。這句話讀者會直接照著行動，卻沒有依據。
- 建議文字（zh）：「助教說資料與評分用的 `ppl.py` 放在作業的連結裡，本文沒有確認校外讀者能不能取得。」
- 建議文字（en）：「The TA says the data and the scoring script `ppl.py` are provided through the assignment link; this guide has not confirmed whether readers outside the course can access it.」

### R3　第 154 行：R(τ) 的文字說明沒有交代 γ（原建議 S6，未修正）

- 原句（zh）：「一條 trajectory 的 reward 是把各時間點的 reward 加起來，R(τ) = Σ γ^(t−1) r_t。」
- 原句（en）：「The reward of a trajectory is the sum of the rewards at each time step, R(τ) = Σ γ^(t−1) r_t.」
- 依據：Post-Training 第 27 頁的式子確實是 R(τ) = Σ γ^(t−1) r_t，式子沒錯。字幕 7.3 [03:02]：「然後它會有一個這邊其實算是一個 skill 去 normalize，這邊也不是很重要，反正就是把所有時間點的 r 全部加在一起」（skill 應是 scale 的誤聽）。文字說「加起來」，式子裡卻多一個沒解釋的 γ。
- 是否該修：建議修，補半句即可。「折扣係數」這個名稱不在字幕裡，下面的寫法只用老師說過的話。
- 建議文字（zh）：「一條 trajectory 的 reward 是把各時間點的 reward 加起來，R(τ) = Σ γ^(t−1) r_t；式子裡的 γ 是加總時乘上的一個係數，老師說這裡不重要。」
- 建議文字（en）：「The reward of a trajectory is the sum of the rewards at each time step, R(τ) = Σ γ^(t−1) r_t; the γ is a scaling factor applied in the sum, which she says is not important here.」

### R4　英文版第 388 行：仍是第一人稱，主詞與補語單複數不合（原英文版建議，只修一半）

- 原句（en）：「These are my own summary, not points listed one by one in the lecture.」
- 依據：中文第 388 行是「以下是本文的歸納，不是課堂上逐條列出的內容」。後半句已補上，這部分修正正確。但全篇其他地方都用 this guide／this post 自稱，只有這裡用 my；「These are ... summary」也不通。
- 是否該修：建議修，只動英文版。
- 建議文字（en）：「This is this guide's own summary, not a list given in class.」
- 中文版不用改。

### R5　第 289 行：「十億個以上的參數」（原建議 S3，已改但和字幕仍有一點出入）

- 原句（zh）：「模型有十億個以上的參數，全部都要動」
- 原句（en）：「The model has a billion or more parameters and all of them move」
- 依據：字幕 7.5 [00:00] 段：「所以裡面有十億個參數等等的，全部都會因此要 update」。原本的「幾十億」已改掉，這部分是對的。但「以上」是字幕沒有的意思，「等等的」只是口語的帶過。
- 是否該修：可改可不改，風險低。要貼字幕的話：
- 建議文字（zh）：「模型裡有十億個參數這種規模，全部都要動」
- 建議文字（en）：「The model has on the order of a billion parameters and all of them move」

---

## 已確認修正正確

以下每一項都是這次實際回到來源對過的。

### 必修

| # | 行號 | 目前的句子 | 對照的來源 | 判定 |
|---|---|---|---|---|
| M1 | 326 | 「第 13 頁引用的 UniPELT 架構圖則把 LoRA 畫在 attention 那一區，接在 attention 的權重矩陣旁邊。」／「draws LoRA in the attention block, attached beside the attention weight matrices」 | Adaptation 第 13 頁（300 dpi）：LoRA 方框在 Multi-Head Attention 下方，裡面有 W_Q、W_K、W_V，兩組 W_Up／W_Down 各接到 W_Q 與 W_K 上方的加號，W_V 沒有低秩分支。 | 已正確修正。作者沒有照第一次報告建議寫到「W_Q、W_K 有、W_V 沒有」那麼細，改成比較籠統的說法，但原本錯的「畫在 W_Q、W_K、W_V 上」已拿掉，新句子和圖相符。 |
| M2 | 114 | 「有些資料集名稱剛好就是任務名稱，像 NLI，只給名稱還猜得到；有些名稱和任務沒有很直接的關係，只給名稱就比較困難。」 | 字幕 7.2 [09:00] 前後：「在某些情況下是可以的，因為比如說 NLI……但是有一些名稱就是跟他的任務不一定很直接的相關……那這個就比較困難」 | 已正確修正。「多數」「學不到東西」都拿掉了，中英一致。 |
| M2 | 407 | 「只給名稱也有幫助（比完全不給高），但有些名稱和任務沒有很直接的關係。」 | Post-Training 第 17 頁右圖：37.3／46.6／47.0／55.2 | 已正確修正。新增的「比完全不給高」由 46.6 對 37.3 支持，和第 109–110 行的表不再矛盾。 |
| M3 | 437 | 「老師建議怎麼選 PEFT 方法？」／「How does the lecturer suggest choosing a PEFT method?」 | 字幕 7.5 [15:01]：「就選一個你最容易 implement 的，或者是裡面比如說參數最少的」；第 13 頁只寫 No one can fit all tasks | 已正確修正。 |

### 建議

| # | 行號 | 目前的句子 | 對照的來源 | 判定 |
|---|---|---|---|---|
| S1 | 129 | 「老師的說法是 T0 在多數資料集比較好，而它只有 11B，連 100B 都不到，遠小於 GPT-3。」 | 字幕 7.2 [18:03]：「大部分都是比較好的……他只有 11B，就是連 100B 都不到，所以他的模型是遠小於這個 GPT-3 的」 | 已正確修正，「十分之一」已拿掉。 |
| S2 | 206 | 「老師指出：加了人類回饋的模型，連資料集裡的參考摘要都贏了。」 | 字幕 7.3 [24:01]：「reference summary 甚至是不如有做 human feedback 的」 | 已正確修正。 |
| S4 | 127 | 「有些任務的輸入前面放的只是資料集代號」 | Post-Training 第 19 頁：`cola sentence:`、`stsb sentence1:` 是代號，`translate English to German:`、`summarize:` 是任務前綴；字幕：「這一個 data set 叫做 st, sp，然後他並沒有跟他講說這個 task 是什麼」 | 已正確修正，加上「有些任務」之後和圖相符。 |
| — | 216 | 「π_ref 是訓練前的參考模型（符號的說明是本文依 DPO 論文補上的）」 | Post-Training 第 38 頁只有式子與 better／worse outputs 的標示 | 已標示為本文補充，中英一致。 |
| — | 246 | 「這一項會把模型拉住，不讓它離 SFT 模型太遠（這句解讀是本文的補充）。老師沒有展開這個式子，只說它做了一點調整，請大家自己看。」 | Post-Training 第 45 頁；`7.4.txt` [04:59]–[05:05]：「這邊就不贅述，大家可以自己去看，它是做了一點點的調整」 | 已標示，老師的部分和逐字稿相符。 |
| — | 326 | 「以下兩句不是課堂內容，是本文依 LoRA 論文的補充：論文的實驗只調整 attention 的權重矩陣；作法本身可以加在任何權重矩陣上，加在哪些層是要自己選的設定。」 | 字幕與講義都沒有這兩句 | 已清楚標示為來源外，中英一致。內容本身見「未驗證」。 |
| — | 328 | 「下面用 LoRA 論文的寫法算參數量……ΔW = BA」 | 講義第 10 頁只有瓶頸的圖 | 標示足夠（第一次報告已認可，這次沒有變動）。 |
| — | 67 | 「McCann 等，The Natural Language Decathlon」 | — | decaNLP 已拿掉，兩版都搜尋不到。 |
| HW2 | 372 | 「HW2 沒有公開的規格文件，下面整理自說明影片的助教口述。逐字稿的數字可能有聽錯，實際修課請以課程公告為準。」 | — | 重複的「沒有字幕、用音訊轉逐字稿」已從這一行拿掉，只留在第 46 行與第 489 行的來源區塊。 |
| HW2 | 380 | 「Bonus 是另外試實驗室學長釋出的臺灣版 LLaMA 模型。」 | `hw2.txt` [09:55]–[10:19]：「臺灣 LAMA，這是我們實驗室的林彥廷學長 Release 的……就可以得到這個兩份的 bonus」 | 已改成描述性的寫法，不再寫出無法由逐字稿確認的「Taiwan-LLaMA」。「實驗室學長釋出」有逐字稿依據。 |
| 英文 | 56 | 「Professor Chen opens the lecture with a contrast」 | — | 已修正，第一次出現 She（第 63 行）之前已點名講者。 |
| 英文 | 388 | 後半句「not points listed one by one in the lecture」 | — | 後半句已補上；第一人稱的問題見 R4。 |

### 新增或改寫句子的來源核對

除了上表，另外對了修改處附近、含「老師說」「投影片」的句子，都有依據，沒有說得比來源重：

- 第 326 行「老師口述也說它著重在 feed-forward 這一層，因為全連接層的參數最多」：字幕 7.5 [09:01]「它是著重在這個 fee forward 這一層，fee forward 就是通常是參數最多的這邊，因為……Fully Connected 都會連接在一起」。第 9 頁的圖確實把 LoRA 方塊畫在 Feed-Forward 旁邊。
- 第 322 行 1024 的例子、第 324 行旋轉的比喻：字幕 7.5 [09:01]–[12:02] 都有。
- 第 344 行「參數量相近時（LoRA 37.7M 對 Adapter 40.1M），LoRA 略勝」「參數量很少時，LoRA 的表現也不錯」：字幕「如果是在 37，然後跟對應的 adapter，如果是 40 比較起來，它的 performance 是略勝於 adapter 的，那如果是很少量的……也可以有很不錯的 performance」；表格數字和第 11 頁一致。
- 第 364 行 UniPELT 的 gate 與「就算不是最好也多半是第二好」、第 366 行選方法的建議：字幕 7.5 [15:01] 都有。
- 第 224 行「DPO 比較有效率也比較快，表現不比 RLHF 差」與「現在說 RLHF 多半沒有 RL」：字幕 7.3 [27:01]–[30:02] 都有。
- 第 127 行「老師認為 T0 這個名字是參考 T5，連圖都很像」：字幕 7.2「覺得他是參考這一個 T5 他的概念，你看他連圖都是非常相似的」。

### 中英一致

第 114、129、206、216、246、289、326、372、380、407、437 行，中英兩版在修改處意思一致，補充句的標示兩版都有。唯一的差異是第 388 行英文用 my（見 R4）。

### 數字自洽（Python 重算）

| 項目 | 文章 | 重算 |
|---|---|---|
| 成對損失，差 1.5 | 0.818、0.20 | 0.81757、0.20141 |
| 成對損失，差 −1.5 | 0.182、1.70 | 0.18243、1.70141 |
| DPO，β = 1 | 0.405、−0.693、1.099、0.75、0.29 | 0.40547、−0.69315、1.09861、0.75、0.28768 |
| DPO 對照組 | 0.69 | 0.69315 |
| LoRA，d = k = 4096，r = 8 | 16,777,216；65,536；0.39% | 16,777,216；65,536；0.390625% |
| 自我檢查第 4 題 | 0.69 | 0.69315 |
| 自我檢查第 8 題 | 8,192；1,048,576；0.78% | 8,192；1,048,576；0.78125% |

三個例子與兩題自我檢查的數字在修改後都沒有變動，仍然正確。

---

## 未驗證

- **LoRA 論文的三句補充**（第 326 行「論文的實驗只調整 attention 的權重矩陣」「可以加在任何權重矩陣上」、第 328 行 ΔW = BA 的形狀）與 **DPO 的 π_ref**（第 216 行「訓練前的參考模型」）：我只確認了它們都有標示為本文補充，沒有讀論文原文核對內容。就我的記憶這四句都對，這是推測，不是對過來源的結論。交稿前仍建議作者向論文原文確認一次。
- **第 375 行「Qwen3-4B」**：逐字稿是「千問三四B」「謙問3 4b」，解讀合理，但版本與尺寸的斷法沒辦法由逐字稿確定。未變動。
- **第 380 行那個模型的正式名稱**：逐字稿只有「臺灣 LAMA」，文章現在寫「臺灣版 LLaMA 模型」，是描述不是名稱。正式名稱我沒有查。
- **第 378 行 `get_prompt`、`get_bnb_config`、`README` 的寫法**：未變動，這次沒有重對。
- **第一次報告「無誤確認」裡這次沒被修改的項目**：其餘表格與公式的數字、glossary 頁碼、HW2 配分與資料筆數、常見誤解六條、自我檢查其餘各題。這次只重看了 Post-Training 第 17、19、27、38、45 頁與 Adaptation 第 9、11、13 頁，這幾頁上的數字和文章一致；其他頁面沒有重看，沿用第一次報告的結論。
- **影片長度、學期起訖、YouTube 標題、arXiv 連結、第 6 堂的描述、逐字稿對原音**：和第一次一樣沒有查。
- **站內連結、標題與版面檢查指令稿**：這次沒有重跑。
- **實際渲染的頁面**：沒有看。

## 三項分別回報

- 身分與標題：這次沒有變動，未重驗。
- 事實：三項必修都已正確修正，沒有新的事實錯誤。通過。R1、R2 建議在交稿前處理。
- 教學品質：修改沒有動到目標、例子、誤解、練習的結構，數字仍自洽。通過。
