# 修改紀錄：ADL Fall 2025 助教課導讀（依 review-ta-recitations.md，2026-10-13）

檔案：

- `src/content/posts/ai/2026-09-30-ntu-adl2025-ta-recitations.md`（zh）
- `src/content/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en.md`（en）

報告 21 項（必修 4、建議 17）：改了 19 項，2 項沒改（S16、S17）。未 commit，沒有動其他檔案。行號是報告用的舊行號。

查證方式：逐字稿用 grep 找到報告引用的時間點後讀原句；講義 w5 第 13、16、27 頁、w6 第 29 頁、w3 第 34 頁轉圖讀過，w3 封面看文字層；NLP Lifecycle Colab 的 .ipynb（scratchpad `ta-colab/`）用腳本印出第 15、17、48、51、54、56、66 格。沒有執行任何 Colab，沒有查 vLLM 原始碼或文件。

## 必修

### M1（第 438 行）已改

- 依據：w5 第 27 頁讀圖。BF16 88.6／40.1／42.1／48.0／54.3／62.0；LoRA BF16 88.8／40.5／42.6／47.1／55.4／60.7；QLoRA NF4 + DQ –／40.4／42.7／47.7／55.3／60.9。完整微調只在 T5-780M（+0.9）與 T5-11B（+1.3）領先，其餘四欄 LoRA 較高。標題寫 QLoRA replicates 16-bit LoRA and full-finetuning。逐字稿 eGQMzbhokg0 15:48「Full … Fine Tuning 當然是最好的」是口述；「直接用 LoRa」在 15:58 前後，依上下文判讀為 QLoRA。
- 和報告建議的差異：報告寫「只在最大的模型上領先」，表上其實是 T5-780M 與 T5-11B 兩欄，所以寫成兩欄。
- 改前（zh）：效果上，講義第 27 頁的比較顯示完整微調最好，LoRA 與 4-bit 加 double quantization 的 QLoRA 差不多。助教的結論：沒辦法做完整微調的話，直接用 QLoRA。
- 改後（zh）：效果上，講義第 27 頁引 QLoRA 論文的表 3，三種做法的分數很接近：六欄裡完整微調只在 T5-780M 與 T5-11B 兩欄領先約 1 分，其餘幾欄 LoRA 略高；LoRA 與 4-bit 加 double quantization 的 QLoRA 幾乎一樣。表格標題寫的也是 QLoRA 重現了 16-bit LoRA 與完整微調的結果。助教口頭的說法是完整微調當然最好，做不到的話直接用 QLoRA（逐字稿這裡聽成 LoRA，依上下文判讀為 QLoRA）。
- 改前（en）：On results, the comparison on slide page 27 shows full fine-tuning on top, with LoRA and 4-bit QLoRA with double quantization about level. The TA's conclusion: if you cannot do full fine-tuning, go straight to QLoRA.
- 改後（en）：On results, slide page 27 quotes Table 3 of the QLoRA paper, where the three options score close together: of the six columns, full fine-tuning leads by about one point only on T5-780M and T5-11B, and LoRA is slightly ahead on the rest; LoRA and 4-bit QLoRA with double quantization are nearly level. The table's own caption says QLoRA replicates 16-bit LoRA and full fine-tuning. What the TA says aloud is that full fine-tuning is of course best, and that if you cannot do it you should go straight to QLoRA (the transcript hears "LoRA" here; QLoRA is read from the context).

### M2（第 405 行）已改

- 依據：w5 第 16 頁讀圖，LoRA 論文 Table 4，列 FT、BitFit、PreEmbed、PreLayer、Adapter^H（兩種大小）、LoRA（兩種大小）。逐字稿 08:27 口述是「Finetune Adapter、PrefixTuning、PromptTuning，或是只 Finetune 前幾個」。
- 改前（zh）：講義第 16 頁把 LoRA 和其他 PEFT 方法（adapter、prefix tuning、prompt tuning、只微調部分層）放在 GPT-3 上比較。
- 改後（zh）：講義第 16 頁引 LoRA 論文的表 4，把 LoRA 和完整微調、BitFit、兩種 prefix 類方法（PreEmbed、PreLayer）與 adapter 放在 GPT-3 上比較。助教口頭舉的 PEFT 方法是 adapter、prefix tuning、prompt tuning 與只微調前幾層，其中後兩種不在這一頁的表上。
- 改前（en）：Slide page 16 compares LoRA with other PEFT methods on GPT-3 (adapters, prefix tuning, prompt tuning, tuning only some layers).
- 改後（en）：Slide page 16 quotes Table 4 of the LoRA paper, which compares LoRA on GPT-3 with full fine-tuning, BitFit, two prefix-style methods (PreEmbed and PreLayer), and adapters. The PEFT methods the TA names aloud are adapters, prefix tuning, prompt tuning, and tuning only the first few layers; the last two are not in the table on this page.

### M3（第 673、681 行）已改：拿掉原始碼與版本號

- 依據：逐字稿 4JPJkLxW84w 04:04「把這個 enforce eager…傳進去是 false 的話，它的記憶體用量就會稍微少一點…速度會稍微慢一點點」；06:56「我記得它預設是 32 還是 128」。指定來源裡沒有 vLLM 原始碼，版本與檔案我無法確認，所以照任務指示拿掉 v0.6.4、原始碼與「預設值 16」，沒有採用報告建議的補寫版本與檔案路徑的寫法。
- 第 673 行改前（zh）：強制用 eager 模式可以省下這些記憶體，代價是速度慢一點。逐字稿裡助教說的是把這個參數設成 false；依 vLLM 原始碼的參數說明，`enforce_eager` 設成 True 才是關掉 CUDA graph，實際操作時請以文件為準。
- 改後（zh）：助教口述是：把這個參數傳成 false，記憶體用量會少一點，代價是速度慢一點。本文補充：參數名稱的字面意思是強制用 eager 模式，和他口述的方向看起來相反；這個參數設成 True 還是 False 才會停用 CUDA graph，請以你安裝版本的 vLLM 文件為準（本文沒有查證）。
- 改前（en）：Forcing eager mode saves that memory at the cost of some speed. In the transcript the TA says to set this argument to false; according to the argument description in vLLM's source, setting `enforce_eager` to True is what disables the CUDA graph, so follow the documentation when you do this.
- 改後（en）：What the TA says is that passing false for this argument uses a little less memory at the cost of some speed. Added by this post: read literally, the argument's name means forcing eager mode, which looks like the opposite direction from what he says; whether True or False is what disables the CUDA graph, follow the vLLM documentation for the version you install (this post did not verify it).
- 第 681 行改前（zh）：他在影片裡沒有把數字說準；錄影前後的 vLLM 版本（v0.6.4）原始碼裡，這個預設值是 16。
- 改後（zh）：助教口述是預設值他記得是 32 還是 128，自己也不確定；影片用的 vLLM 版本沒有唸出來，實際的預設值請以你安裝版本的 vLLM 文件為準（本文沒有查證）。
- 改前（en）：He does not give the number precisely in the video; in the vLLM source around the recording date (v0.6.4), the default is 16.
- 改後（en）：What the TA says is that he recalls the default being 32 or 128 and is not sure himself; the video never states which vLLM version it uses, so take the actual default from the vLLM documentation for the version you install (this post did not verify it).
- 連帶：常見誤解第 9 條與自我檢查第 14 題的「預設值很小」前面加上「助教說」／"The TA says"，因為本文沒有另外查證。

### M4（第 845–855 行）已改

- 依據：`scripts/check-course-videos.mjs` 只檢查狀態行、youtube 區塊的 ID（中英一致、登錄表的 ID 有嵌入）與查核日期，不檢查「原始影片」那一行的內容。嵌入區塊維持兩支沒有動。
- 改動（zh）：「原始影片：」行尾補上 `[ADL TA Recitation: LLM Inference & Evaluation 使用與評估語言模型（YouTube）](https://www.youtube.com/watch?v=mulWMLla-AM)`、`[ADL TA Recitation: LLM Deployment 手把手教你如何部署大型語言模型（YouTube）](https://www.youtube.com/watch?v=4JPJkLxW84w)`，並在下一段加：「最後兩支（LLM Inference & Evaluation、LLM Deployment）是 2026-10-13 補列的，連結與本文「先看全貌」表格相同；這兩支這次沒有另外對照官方播放清單。」
- 改動（en）：補上對應兩支（`(YouTube, in Mandarin)`），並加："The last two (LLM Inference & Evaluation and LLM Deployment) were added to this list on 2026-10-13, with the same links as the table in "The big picture"; these two were not separately checked against the official playlist this time."
- 說明：該區開頭寫的是 2026-10-10 對照過播放清單。這兩支當時有沒有對照過我無從確認，所以照報告「不要靜默略過」的要求加了上面那句。

## 建議

### S1（第 550 行）已改

- 依據：AgZuF7lsu-8 08:25「它大概只占三層左右的總參數而已」。
- 改後（zh，插在 18% 之後）：助教在影片裡口頭說的是大約三成（逐字稿聽成「三層」，不夠清楚）；照講義的形狀實際算是 18%，兩個數字不同，結論相同。
- 改後（en）：In the video the TA says roughly thirty percent (the transcript is not clear here); working from the shapes on the slide gives 18%, so the two numbers differ and the conclusion is the same.

### S2（第 240–242、754 行）已改

- 依據：Colab 第 17 格 `metric = load_metric('glue', "mnli")`；第 53 格說明寫 take the argmax … (or just squeeze the last axis in the case of STS-B)；第 54 格 `predictions = predictions[:, 0]`；第 51 格 `load_best_model_at_end=True`、`metric_for_best_model=metric_name`；第 66 格 `classifier = pipeline(task='ner', '你的模型', device=0)`。只讀程式碼，沒有執行。報告說 accuracy「會接近 0」，我沒有跑過，文章裡改寫成「沒有意義」「不能信」。
- 新增清單項（zh）：`compute_metrics` 裡的 `predictions = predictions[:, 0]` 是原範例給迴歸任務（STS-B）用的寫法。分類任務要改成 `predictions = np.argmax(predictions, axis=1)`（記得 `import numpy as np`），否則拿去和標籤比的是第 0 類的 logit，算出來的 accuracy 沒有意義，以 accuracy 挑最佳模型也會挑錯。這一條是本文讀程式碼得出的判斷，助教沒有提，本文也沒有實際執行驗證。
- 新增清單項（en）：In `compute_metrics`, `predictions = predictions[:, 0]` is the original example's branch for a regression task (STS-B). For classification change it to `predictions = np.argmax(predictions, axis=1)` (remember `import numpy as np`). Otherwise what gets compared with the labels is the logit of class 0, the accuracy means nothing, and best-model selection by accuracy picks the wrong checkpoint. This item comes from this post reading the code; the TA does not mention it, and this post did not run the notebook to confirm it.
- Gradio 那一條補一句（zh）：另外那一行寫成 `pipeline(task='ner', '你的模型', device=0)`，關鍵字引數後面接了位置引數，Python 會直接判成語法錯誤，要把模型名稱改成 `model='…'` 的寫法（本文讀程式碼的判斷，沒有實際執行）。（en 同義）
- 「今晚可以做的一件事」改後（zh）：…把 `load_metric` 換成 `evaluate.load`，再把 `compute_metrics` 裡的 `predictions = predictions[:, 0]` 改成先取 argmax（`predictions = np.argmax(predictions, axis=1)`），跑到 `trainer.train()` 為止。…提醒：argmax 那一項不改，程式照樣跑得完，但每個 epoch 印出來的 accuracy 不能信。這些修改是本文讀 Colab 程式碼的判斷，沒有實際執行過，新版套件可能還有別的地方要調。
- 改後（en）：…change `predictions = predictions[:, 0]` in `compute_metrics` to take the argmax first (`predictions = np.argmax(predictions, axis=1)`), and run through `trainer.train()`. … A caution: without the argmax change the run still finishes, but the accuracy printed each epoch cannot be trusted. These edits come from this post reading the Colab code and were not run, and newer library versions may need other changes too.
- 第 234 行（助教說分數低是因為提前中斷、訓練太少）沒有動：逐字稿 29:35「次數太少了」，轉述相符。

### S3（第 664、680–681 行）已改

- 依據：4JPJkLxW84w 01:28 沒有唸指令；06:32「LM 的 class」「sampling parameters」，06:56「max token」。
- 改前（zh）：第一步是用 `nvidia-smi` 看手上有幾張卡、各有多少記憶體。
- 改後（zh）：第一步是先看手上有幾張卡、各有多少記憶體（助教沒有唸出指令；第 1 堂教的 `nvidia-smi` 就可以）。
- 改後（en）：The first step is to check how many cards you have and how much memory each has (the TA does not name a command; `nvidia-smi` from session 1 does it).
- 另在「Offline 推論的步驟」那一行補（zh）：其中 `LLM`、`SamplingParams`、`max_tokens` 是本文對應到 vLLM 的寫法；逐字稿裡聽到的是「LM 的 class」「sampling parameters」「max token」，沒有逐字唸出類別名稱。（en 同義）

### S4（第 644、767 行）已改

- 依據：w6 第 29 頁讀圖。GPT-3 四個尺寸遞減，GPT-2 兩個尺寸遞減，GPT-Neo/J 的 2.7B 高於 1.3B，UnifiedQA 的 2.8B 高於 770M。mulWMLla-AM 11:12「看最左邊，GPT3，它越來越大的時候，它分數越來越低」。
- 改前（zh）：講義第 29 頁的圖顯示一個反直覺的現象：同一系列的模型越大，在這個 benchmark 上的分數反而越低。
- 改後（zh）：講義第 29 頁的圖顯示一個反直覺的現象，助教請大家看最左邊的 GPT-3：從 350M 到 175B，模型越大分數越低。圖上的 GPT-2 也是遞減，GPT-Neo/J 與 UnifiedQA 則不是一路下降。
- 改後（en）：The figure on slide page 29 shows something counterintuitive, and the TA points to GPT-3 at its left: from 350M to 175B, the larger the model, the lower the score. GPT-2 in the figure also falls, while GPT-Neo/J and UnifiedQA do not fall steadily.
- 常見誤解改前（zh）：TruthfulQA 是反例：模型越大，越會複述網路上常見卻錯誤的說法。
- 改後（zh）：TruthfulQA 是反例：講義圖上的 GPT-3 系列，模型越大分數越低。助教的解釋是模型學的是網路上的文字，而網路上多數人講的不一定正確。
- 改後（en）：TruthfulQA is a counterexample: in the figure on the slides, the GPT-3 family scores lower as the model gets larger. The TA's explanation is that models learn from web text, and what most people say on the web is not necessarily right.

### S5（第 733 行）已改（只改 zh）

- 改前：它們是 2023 年以前的作業　改後：它們是 2023 年或更早的作業。英文原本就是 from 2023 and earlier，沒有動。

### S6（引號裡的口述）已改

- 依據：eGQMzbhokg0 04:33「我們回顧一下我們上禮拜講…transformer 的模型」；14:17「-2000 是最大的值，那就取得絕對值變 2000」；anK1_PK464k 23:51「現在開始咯」；01:42 助教說的是「之前的 ADL 的作業，應該是用了兩年或三年」，逐字稿裡沒有「作業一」三個字。
- 第 77 行改前（zh）：NLP Lifecycle 那支用的「以前的作業一」是意圖分類，助教說那份作業用了兩三年　改後：NLP Lifecycle 那支用的是之前 ADL 的作業（意圖分類，講義第 27 頁連到 2021 年的 HW1），助教說那份作業用了兩三年
- 改後（en）：The NLP Lifecycle video uses an earlier ADL assignment (intent classification; slide page 27 links to the 2021 HW1) that the TA says ran for two or three years.
- 第 78 行改前（zh）：LoRA 那支說「上禮拜講過 Transformer 的架構」　改後：LoRA 那支說上一週講過 Transformer 的模型架構
- 改後（en）：The LoRA video says the Transformer model architecture was covered the week before
- 第 224 行改前（zh）：告訴模型「現在開始了」　改後：用來標示一段輸入從這裡開始。（en：which marks where an input begins.）
- 第 427 行改前（zh）：助教用「最大值是 2000，就把 2000 壓到 127」來說明。　改後：助教舉的例子是：絕對值最大的數是 2000（原本是 −2000），就把它壓到 127。
- 改後（en）：The TA's example: if the largest absolute value is 2000 (originally −2000), it is squeezed down to 127.
- 第 752 行改前（zh）：LoRA 那支影片會說「上禮拜講過架構」　改後：LoRA 那支影片會說上一週講過架構。（en：The LoRA video says the architecture was covered the week before）
- 保留：第 77 行的「作業三」與「Homework 3 Instruction tuning」是名稱與講義原文（報告同意保留）。

### S7（第 502 行）已改

- 依據：TzhCZOILzlI 01:31「這邊很多投影片都是…我從他的投影片上面擷取下來的…你等到投影片去點它，它講得非常非常好」。
- 改前（zh）：助教說這些投影片很多取自別人的講解，並推薦大家去看原作者的影片　改後：助教說這些投影片很多是從別人的投影片擷取下來的，並推薦大家點講義上的連結去看原作者的講解
- 改後（en）：The TA says many of these slides were taken from someone else's slides and recommends following the link on the slides to the original author's explanation.

### S8（第 146 行）已改

- 依據：RYkEoCkJWeA 08:33 先看 size、08:45 再看 device，沒有說原因。
- 改前（zh）：…所以助教才會在除錯示範裡先看形狀、再看裝置。　改後：…所以除錯時形狀和裝置都要看；助教的示範也是先印形狀、再印裝置。
- 改後（en）：…so check both shape and device when debugging; the TA's demo also prints the shape first and the device second.

### S9（第 226 行）已改

- 依據：anK1_PK464k 25:43–26:20 轉錄重複壞掉，只有「下載到你的那個 Home Directory 的一個叫點 Catch」「如果你一直 LOW 的模型，然後你發現電腦根本登不進去」。
- 改前（zh）：…一直載入不同的模型會把磁碟空間用完。
- 改後（zh）：…載入模型時檔案會先下載到家目錄下的快取資料夾。助教提醒一直載入不同的模型可能出問題（這一段錄音轉錄不清楚，只聽得出他提到電腦登不進去；推測是指快取占滿磁碟）。
- 改後（en）：…The TA warns that loading many different models can cause trouble (the transcript is unclear here, and all that comes through is that he mentions being unable to log in to the machine; presumably the cache fills the disk).

### S10（第 614 行）已改

- 依據：mulWMLla-AM 04:21「其實會稍微比我們剛剛直接 Round to Nearest 好一點點」。
- 改前（zh）：意義：先縮放，讓原本的數值範圍對齊可以表示的範圍，誤差小很多。
- 改後（zh）：助教在影片裡只說先縮放的結果好一點點，沒有算誤差；上面的數字是本文補算的。意義：先縮放，讓原本的數值範圍對齊可以表示的範圍，以本文補算的數字來看誤差比較小。
- 改後（en）：In the video the TA only says scaling first is slightly better and does not compute the error; the numbers above are this post's. What it means: scaling first, so the original value range lines up with the representable range, gives the smaller error by this post's numbers.

### S11（自我檢查 13）已改

- 依據：正文只在 `enforce_eager` 那一項教了 CUDA graph 占額外記憶體；KV cache 只講原理與命中率（逐字稿 21:16–21:35 也沒說它占多少記憶體）。照報告建議改答案，題目不換。
- 改前（zh）：兩張共 96 GB 放得下，但還要留空間給 KV cache 與 CUDA graph。　改後：兩張共 96 GB 放得下，但實際用量會比估的高（例如 CUDA graph 要占額外的記憶體）。
- 改後（en）：Two give 96 GB, which fits, though real usage runs above the estimate (the CUDA graph takes extra memory, for example).

### S12（「算法」）已改

- 第 562 行：它的算法是 → 它的計算方式是。
- 第 652 行：Elo 的算法 → Elo 的計分方式（en：the Elo calculation → the way Elo is scored）。
- 第 666 行（報告沒列，同類）：同樣的算法 → 照同樣的方式算。
- 改完後全文「算法」只剩「演算法」。

### S13（第 389 行）已改

- 依據：w5 第 13 頁讀圖，兩個項目，no gradients for pretrained weights 是 Less memory 的子項。
- 改前（zh）：講義第 13 頁列的好處有三點：記憶體少、預訓練權重不用算梯度、LoRA 權重可以插拔。助教對第三點多說了一些
- 改後（zh）：講義第 13 頁列的好處有兩項：記憶體少（預訓練權重不用算梯度）、LoRA 權重可以插拔。助教對後者多說了一些
- 改後（en）：Slide page 13 lists two benefits: less memory (no gradients for the pretrained weights) and plug-and-play LoRA weights. The TA says more about the second.

### S14（第 303 行）已改

- 依據：w3 第 34 頁讀圖只有 `article`、`highlights` 兩欄；255ZzsTTHoU 17:58「那 ID 也給 ID」。
- 改前（zh）：欄位是 `article`（原文）、`highlights`（摘要）與 `id`（講義第 34 頁）。　改後：欄位是 `article`（原文）與 `highlights`（摘要）（講義第 34 頁），助教口頭補充還有 `id`。
- 改後（en）：whose fields are `article` (the source text) and `highlights` (the summary) (slide page 34); the TA adds aloud that there is also an `id`.

### S15（英文版用詞）已改，只動 en

- 第 234 行：into one line → into one pipeline。
- 第 248 行：reads "Applied Deep Learning - Recitation 3" → reads "應用深度學習 - 實作三" (the English cover on page 2 says "ADL - Recitation 3")。依據：w3 文字層封面是「應用深度學習 - 實作三」，英文封面是「NTU」「ADL - Recitation 3」兩行。
- 第 855 行：Original videos 的頓號改成半形逗號加空格。依據：檢查器不管這一行的格式；全站 `-en.md` 的同一行用逗號的有 72 篇、用頓號的 27 篇。

### S16（英文標題重複課名）沒改

- 理由：任務明確規定不要改 frontmatter 的 title。報告本身也說是否要改請作者或使用者決定。留給使用者決定。

### S17（作者紀錄 `W/ta/rewrite-log.md` 第 0 節過期）沒改

- 理由：純流程面的項目，而且任務規定不要動其他檔案。現況確認：十個 `.txt` 的檔頭現在都是正確主題，rewrite-log 第 0 節說的「檔頭標錯七支」已經不成立。

## 另外加的東西

- 兩篇的更新紀錄各加一條 2026-10-13 的審稿修正紀錄。
- 沒有新增來源以外的事實。來源外的判斷只有兩處，都已標明：`enforce_eager` 的字面意思（標「本文補充」／"Added by this post"）、Colab 的 argmax 與 `pipeline` 語法（標「本文讀程式碼的判斷，沒有實際執行」）。

## 檢查結果（改完後）

- `check-course-titles.mjs`：Course title gate: 0 issue(s)
- `check-course-guide-layout.mjs`：0 issue(s)
- `node scripts/check-course-videos.mjs | grep ta-recitations`：沒有輸出
- `pnpm -s check:lang-parity | grep ta-recitations`：沒有輸出
- `pnpm -s check:tw | grep ta-recitations`：沒有輸出
- 兩檔各 903 行，仍然逐行對齊。沒有看實際渲染的頁面。
