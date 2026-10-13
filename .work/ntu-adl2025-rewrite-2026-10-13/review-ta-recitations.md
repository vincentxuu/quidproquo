# 獨立審稿報告：ADL Fall 2025 助教課導讀（2026-10-13）

審稿對象（未修改任何文章檔）：

- `src/content/posts/ai/2026-09-30-ntu-adl2025-ta-recitations.md`（sha256 開頭 `1b4c8c8596c6611b`，與作者紀錄相符）
- `src/content/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en.md`（sha256 開頭 `254c229ce14f928d`，與作者紀錄相符）

兩檔都是 900 行、段落逐行對齊，下文行號中英通用。

## 審稿方法與範圍

實際對過的來源：

- 十支逐字稿 `W/ta/*.txt` 全文讀完。
- 五份講義的文字層全部頁面（pdftotext），另讀圖：w3 第 10、18、24、25、34、36、40、42 頁；w4 第 4、13、22、24、25 頁；w5 第 6、14、16、19、20、25、27、29、30 頁；w6 第 8、11、28、29 頁。
- 兩份 Colab 的 .ipynb（scratchpad `ta-colab/`，30 格與 68 格）逐格讀過。
- 契約 `.agents/skills/post/references/course-guide-contract.md`。
- 文中所有自編例子與自我檢查的計算題用 Python 重算。
- 中英兩檔逐行比對數字與行內程式碼（腳本），英文全文人工讀過。
- `check-course-titles.mjs`、`check-course-guide-layout.mjs` 重跑，都是 0 issue。

沒有驗證（來源外）：YouTube 說明欄與錄製日期、影片長度、課程頁與 Course Logistics 投影片、HW2 說明影片、放假日、作業對照表、所有外部連結是否可開、vLLM 原始碼、實際渲染頁面。影片長度只和逐字稿最後一個時間戳比過，十支都吻合（差距在 20 秒內）。

結論：指令、參數名、程式碼、表格數字、頁碼幾乎全部對得上來源，沒有發現編造的口述。必修 4 項都是歸屬或標示問題，沒有會讓讀者算錯或跑錯指令的錯誤。建議 17 項。

---

## 必修（4 項）

### M1. 第 438 行：把助教的話寫成講義表格的結論

- 原句（zh）：「效果上，講義第 27 頁的比較顯示完整微調最好，LoRA 與 4-bit 加 double quantization 的 QLoRA 差不多。」
- 原句（en）：「On results, the comparison on slide page 27 shows full fine-tuning on top, with LoRA and 4-bit QLoRA with double quantization about level.」
- 依據（已讀圖）：w5 第 27 頁是 QLoRA 論文 Table 3。BF16（完整微調）六欄是 88.6／40.1／42.1／48.0／54.3／62.0；LoRA BF16 是 88.8／40.5／42.6／47.1／55.4／60.7；QLoRA NF4 + DQ 是 –／40.4／42.7／47.7／55.3／60.9。完整微調只在 T5-780M 與 T5-11B 兩欄領先，其他四欄 LoRA 較高。表格標題自己寫的是「QLoRA replicates 16-bit LoRA and full-finetuning」。「完整微調當然最好」是助教口述（eGQMzbhokg0 15:48），不是表格顯示的結果。
- 建議（zh）：「效果上，講義第 27 頁引 QLoRA 論文的表 3，三種做法的分數很接近：完整微調只在最大的模型上領先約 1 分，LoRA 與 4-bit 加 double quantization 的 QLoRA 幾乎一樣。助教的說法是完整微調當然最好，做不到的話直接用 QLoRA。」
- 建議（en）：「On results, slide page 27 quotes Table 3 of the QLoRA paper, where the three options score close together: full fine-tuning leads by about one point only on the largest model, and LoRA and 4-bit QLoRA with double quantization are nearly level. The TA's take is that full fine-tuning is of course best, and that if you cannot do it you should go straight to QLoRA.」
- 附註：同一句的「直接用 QLoRA」，逐字稿聽成「就直接用 LoRa」（15:58）。上下文在講 QLoRA，判讀合理，但屬推測。

### M2. 第 405 行：講義第 16 頁列的方法寫錯

- 原句（zh）：「講義第 16 頁把 LoRA 和其他 PEFT 方法（adapter、prefix tuning、prompt tuning、只微調部分層）放在 GPT-3 上比較。」
- 原句（en）：「Slide page 16 compares LoRA with other PEFT methods on GPT-3 (adapters, prefix tuning, prompt tuning, tuning only some layers).」
- 依據（已讀圖）：w5 第 16 頁是 LoRA 論文 Table 4，列的是 FT、BitFit、PreEmbed、PreLayer、Adapter（兩種大小）與 LoRA。括號裡的四項是助教口述舉的例子（08:27），其中「prompt tuning」「只微調部分層」不在這一頁。
- 建議（zh）：「講義第 16 頁引 LoRA 論文的表 4，把 LoRA 和完整微調、BitFit、兩種 prefix 類方法（PreEmbed、PreLayer）與 adapter 放在 GPT-3 上比較。助教口頭提到的其他方法還有 prompt tuning 與只微調前幾層。」
- 建議（en）：「Slide page 16 quotes Table 4 of the LoRA paper, which compares LoRA on GPT-3 with full fine-tuning, BitFit, two prefix-style methods (PreEmbed and PreLayer), and adapters. The other methods the TA mentions aloud are prompt tuning and tuning only the first few layers.」

### M3. 第 673 行：`enforce_eager` 引用 vLLM 原始碼，沒有寫版本與檔案

- 原句（zh）：「逐字稿裡助教說的是把這個參數設成 false；依 vLLM 原始碼的參數說明，`enforce_eager` 設成 True 才是關掉 CUDA graph，實際操作時請以文件為準。」
- 依據：逐字稿 04:04 確實是「把這個 enforce eager…傳進去是 false 的話，記憶體用量就會稍微少一點」，口述與文章轉述一致。原始碼那一半屬來源外，**本次審稿未驗證**。作者紀錄寫查的是 v0.6.4 的 `entrypoints/llm.py`，但正文沒有寫版本也沒有寫檔案，讀者無從查對；同段第 681 行的 `max_tokens` 有寫版本，兩處標法不一致。（就我記憶，該版 docstring 的語意確實是 True 才停用 CUDA graph，但這不算查證。）
- 建議（zh）：「逐字稿裡助教說的是把這個參數設成 false；本文另查 vLLM v0.6.4 的 `vllm/entrypoints/llm.py`，`LLM` 的參數說明寫 `enforce_eager` 設成 True 才會停用 CUDA graph。這一點不在助教課的材料裡，操作時請以你安裝的版本的文件為準。」
- 建議（en）：「In the transcript the TA says to set this argument to false. This post also checked `vllm/entrypoints/llm.py` in vLLM v0.6.4, where the `LLM` argument description says setting `enforce_eager` to True is what disables the CUDA graph. That is outside the recitation material, so follow the documentation of the version you install.」
- 同類（第 681 行，列為必修的一部分）：「錄影前後的 vLLM 版本（v0.6.4）原始碼裡，這個預設值是 16」把 v0.6.4 說成錄影時的版本。逐字稿 09:01 只說啟動時會印出版本，沒有唸出版號，所以影片用哪一版並不知道。建議改成（zh）「他在影片裡沒有把數字說準（說的是 32 還是 128）；本文另查 vLLM v0.6.4 的 `vllm/sampling_params.py`，預設值是 16。影片實際用的版本沒有確認。」（en）「He does not give the number precisely in the video (he says 32 or 128). This post checked `vllm/sampling_params.py` in vLLM v0.6.4, where the default is 16; the version used in the video was not confirmed.」來源外、未驗證。

### M4. 第 845–855 行：「課程影片來源」只列了 8 支，缺第 6、7 堂的兩支

- 現況：嵌入兩支（PyTorch、Debugging），「原始影片：」列 8 支，沒有 `mulWMLla-AM`（Inference & Evaluation）與 `4JPJkLxW84w`（Deployment）。這兩支只出現在全貌表、內文與參考資料。
- 依據：第 863 行寫「十支助教課影片都沒有可用的字幕，本文把音訊…」，第 7 堂更是只有影片一個來源。來源區少列兩支，和正文「10 支」不一致。
- 建議（zh）：在「原始影片：」那一行補上「[ADL TA Recitation: LLM Inference & Evaluation 使用與評估語言模型（YouTube）](https://www.youtube.com/watch?v=mulWMLla-AM)、[ADL TA Recitation: LLM Deployment 手把手教你如何部署大型語言模型（YouTube）](https://www.youtube.com/watch?v=4JPJkLxW84w)」。
- 建議（en）：補上「[ADL TA Recitation: LLM Inference & Evaluation (YouTube, in Mandarin)](https://www.youtube.com/watch?v=mulWMLla-AM), [ADL TA Recitation: LLM Deployment (YouTube, in Mandarin)](https://www.youtube.com/watch?v=4JPJkLxW84w)」。
- 不確定之處：這一行可能受 `check:course-videos` 的格式或「官方播放清單」名單限制（第 843 行寫 2026-10-10 對照過播放清單）。如果這兩支當時不在播放清單上，請在該區加一句說明，不要靜默略過。

---

## 建議（17 項）

### S1. 第 548–550 行：attention 占比，口述數字與本文計算不同，沒有交代

- 現況：本文用講義第 22 頁的形狀算出 18%，標示清楚，重算無誤（MLP 26.17 億、attention 5.70 億、17.9%）。
- 依據：逐字稿 AgZuF7lsu-8 08:25 助教說 attention「大概只占三層左右的總參數」，應是「三成左右」。和 18% 有落差。契約要求會改變數字的來源衝突留在段落裡。
- 建議（zh）：在例子後加一句「助教在影片裡口頭說的是大約三成（逐字稿不夠清楚）；照講義的形狀實際算是 18%，結論相同。」
- 建議（en）：「In the video the TA says roughly thirty percent (the transcript is not clear here); working from the shapes on the slide gives 18%, and the conclusion is the same.」

### S2. 第 240–242、754 行：Colab 還有一處不改就得不到正確 accuracy（讀碼推論，未實際執行）

- 依據（已讀 Colab 第 54 格）：`compute_metrics` 寫的是 `predictions = predictions[:, 0]`，那是原範例給 STS-B 迴歸用的分支；分類任務應取 `argmax`。照原樣跑，拿第 0 類的 logit 去和標籤比，accuracy 會接近 0，`load_best_model_at_end` 也會挑錯。另外第 17 格是 `load_metric('glue', "mnli")`。
- 這很可能才是影片裡 accuracy 很低的原因。文章第 234 行寫「他說是因為示範時提前中斷、訓練次數太少」，轉述與逐字稿（29:31）一致，不必改；但「可能要改的地方」清單與「今晚可以做的一件事」少了這一項，讀者照做會得到沒有意義的分數。
- 建議（zh）：清單加一條「`compute_metrics` 裡的 `predictions = predictions[:, 0]` 是原範例給迴歸任務用的寫法，分類要改成 `predictions = np.argmax(predictions, axis=1)`，否則 accuracy 會接近 0（本文讀程式碼得出，助教沒有提）。」
- 建議（en）：「In `compute_metrics`, `predictions = predictions[:, 0]` is the original example's branch for a regression task; for classification change it to `predictions = np.argmax(predictions, axis=1)`, or accuracy will sit near 0 (this comes from reading the code; the TA does not mention it).」
- 另：最後一格 `pipeline(task='ner', '你的模型', device=0)` 關鍵字引數後接位置引數，本身是語法錯誤，可在第 242 行順帶說明。

### S3. 第 664 行：第 7 堂的 `nvidia-smi` 逐字稿沒有出現

- 原句：「第一步是用 `nvidia-smi` 看手上有幾張卡、各有多少記憶體。」
- 依據：逐字稿 01:28 只說「你會先 check 一下你現在的顯示卡長什麼樣子、有多大的 memory」，沒有唸出指令。這堂沒有講義，畫面未驗證。
- 建議（zh）：「第一步是先看手上有幾張卡、各有多少記憶體（第 1 堂教的 `nvidia-smi` 就可以）。」
- 建議（en）：「The first step is to check how many cards you have and how much memory each has (`nvidia-smi` from session 1 does it).」
- 同類提醒：第 680–681 行的 `LLM`、`SamplingParams`、`max_tokens` 是 vLLM 的實際名稱，逐字稿聽成「LM 的 class」「sampling parameters」「max token」，對應合理，但類別名稱不是從來源逐字得到的。

### S4. 第 644、767 行：TruthfulQA 的趨勢說得比講義圖寬

- 原句：「同一系列的模型越大，在這個 benchmark 上的分數反而越低。」
- 依據（已讀圖，w6 第 29 頁）：GPT-3 四個尺寸確實遞減（約 37→32→24→21），GPT-2 也是；GPT-Neo/J 與 UnifiedQA 不是單調下降。助教說的是「看最左邊，GPT-3」。
- 建議（zh）：「以圖上最左邊的 GPT-3 為例，從 350M 到 175B，模型越大分數越低。」常見誤解那條改成「TruthfulQA 是反例：圖上的 GPT-3 系列越大分數越低。」
- 建議（en）：「Take GPT-3 at the left of the figure: from 350M to 175B, the larger the model, the lower the score.」

### S5. 第 733 行：「2023 年以前的作業」

- 依據：instruction tuning 的作業三就是 2023 年秋季的作業（w5 封面 2023/11/16、第 4 頁）。「以前」容易讀成不含 2023。英文版「from 2023 and earlier」是對的。
- 建議（zh）：「它們是 2023 年或更早的作業」。英文不用改。

### S6. 引號裡的助教口述（第 77、78、427、224 行等）

- 契約：「課堂說法用轉述、不加引號當原話」。
- 例：第 78 行「上禮拜講過 Transformer 的架構」（逐字稿 04:33 是「我們回顧一下我們上禮拜講…transformer 的模型」）；第 427 行「最大值是 2000，就把 2000 壓到 127」（14:17 是「-2000 是最大的值，那就取得絕對值變 2000，然後把它壓在 127」）；第 752 行同句再出現一次。
- 建議：去掉引號改成轉述，例如（zh）「LoRA 那支說上一週講過 Transformer 的架構」、「助教舉的例子是絕對值最大的數是 2000，就把它壓到 127」；（en）「The LoRA video says the Transformer architecture was covered the week before」、「The TA's example: if the largest absolute value is 2000, it is squeezed down to 127.」第 77 行的「作業三」「Homework 3 Instruction tuning」是名稱與講義原文，可以保留。

### S7. 第 502 行：「推薦大家去看原作者的影片」

- 依據：逐字稿 TzhCZOILzlI 01:31 是「很多投影片都是…我從他的投影片上面擷取下來的…你等到投影片去點它，它講得非常非常好」。來源說的是點投影片上的連結，沒有說是影片。
- 建議（zh）：「並推薦大家點講義上的連結去看原作者的講解」；（en）「and recommends following the link on the slides to the original author's explanation」。

### S8. 第 146 行：替助教補了動機

- 原句：「所以助教才會在除錯示範裡先看形狀、再看裝置。」
- 依據：助教示範時確實先印 size 再印 device（RYkEoCkJWeA 08:28–08:51），但沒有說原因。這一段標的是「本文自編」，結尾卻把理由歸給助教。
- 建議（zh）：「意義：tensor 的形狀錯誤不一定會讓程式停下來，所以除錯時形狀和裝置都要看；助教的示範也是先印形狀、再印裝置。」
- 建議（en）：「What it means: a shape error does not always stop the program, so check both shape and device when debugging; the TA's demo also prints the shape first and the device second.」

### S9. 第 226 行：「一直載入不同的模型會把磁碟空間用完」

- 依據：逐字稿 anK1_PK464k 25:43–26:20 這段轉錄壞掉，只聽得到「下載到你的 Home Directory 的一個叫點 Catch…如果你一直 LOW 的模型，然後你發現電腦根本登不進去」。「磁碟用完」是合理推測，不是聽到的內容。作者紀錄也把這段列為聽不清楚。
- 建議（zh）：「載入模型時檔案會先下載到家目錄下的快取資料夾。助教提醒一直載入不同的模型可能出問題（這一段錄音轉錄不清楚，推測是指快取占滿磁碟）。」
- 建議（en）：「Loading a model first downloads its files into a cache folder under your home directory. The TA warns that loading many different models can cause trouble (the transcript is unclear here; presumably the cache fills the disk).」

### S10. 第 614 行：2-bit 例子的評語比助教重

- 依據：助教說先縮放的結果「稍微比直接 round to nearest 好一點點」（mulWMLla-AM 04:21）。本文補了還原步驟後算出 40 對 12.8，寫成「誤差小很多」。計算無誤、出處也標了，但讀者會以為這是助教的評語。
- 建議（zh）：在結果後加「助教在影片裡只說好一點點，沒有算誤差；上面的數字是本文補算的。」（en）「In the video the TA only says it is slightly better and does not compute the error; the numbers above are this post's.」

### S11. 第 824 行（自我檢查 13）：「還要留空間給 KV cache」正文沒教

- 依據：正文第 673 行教了 CUDA graph 占額外記憶體；KV cache 在正文只講原理與命中率，沒說它要占顯示卡記憶體。答案的這一點無法由正文推得。
- 建議（zh）：「兩張共 96 GB 放得下，但實際用量會比估的高（例如 CUDA graph）。」（en）「Two give 96 GB, which fits, though real usage runs above the estimate (the CUDA graph, for example).」

### S12. 第 562、652 行：「算法」

- 「它的算法是」「Elo 的算法」。指的是計算方式，不是演算法，但「算法」在 writing-guide 的替換表範圍內。
- 建議：改成「它的算法是」→「它的計算方式是」；「Elo 的算法」→「Elo 的計分方式」。其餘指定詞（質量、信息、視頻、默認、反饋、優化、窗口、代碼、內存、硬盤、調用、運行）全文沒有出現。「文本」出現在任務名稱，是講義原文（「生成文本內容」「從文本中提取答案」）。

### S13. 第 389 行：「好處有三點」

- 依據：w5 第 13 頁是兩個項目（Less memory、Plug-and-Play Lora），「no gradients for pretrained weights」是 Less memory 的子項。
- 建議（zh）：「講義第 13 頁列的好處有兩項：記憶體少（預訓練權重不用算梯度）、LoRA 權重可以插拔。助教對後者多說了一些」；（en）「Slide page 13 lists two benefits: less memory (no gradients for the pretrained weights) and plug-and-play LoRA weights. The TA says more about the second.」

### S14. 第 303 行：`id` 欄不在第 34 頁截圖上

- 依據（已讀圖）：w3 第 34 頁只看得到 `article` 與 `highlights` 兩欄；`id` 是助教口述（17:58「ID 也給 ID」）。
- 建議（zh）：「欄位是 `article`（原文）與 `highlights`（摘要）（講義第 34 頁），助教口頭補充還有 `id`。」（en）「whose fields are `article` and `highlights` (slide page 34); the TA adds aloud that there is also an `id`.」

### S15. 英文版用詞（第 234、248、855 行）

- 第 234 行「wraps … into one line」：中文是「包成一條流水線」。建議改「into one pipeline」。
- 第 248 行「The cover … reads "Applied Deep Learning - Recitation 3"」：講義中文封面是「應用深度學習 - 實作三」，英文封面（第 2 頁）是「NTU ADL - Recitation 3」。引號裡的字不是講義上的原文。建議改「reads "應用深度學習 - 實作三" (the English cover on page 2 says "ADL - Recitation 3")」。
- 第 855 行「Original videos:」用頓號「、」分隔。全站英文稿多數（309 篇對 27 篇）不用頓號，建議改成半形逗號加空格；若這是檢查器產生的格式則略過。

### S16. 英文標題主題那一半重複課名（未在本次重寫範圍，僅提醒）

- 英文標題「NTU ADL 2025 TA Recitations: From PyTorch … | NTU Yun-Nung Chen Applied Deep Learning Tutorial」，課名與助教課各出現兩次；中文標題沒有這個問題。契約寫「主題那一半不重複系列標籤」。`check-course-titles.mjs` 目前判 0 issue。是否要改請作者或使用者決定，改標題不影響 slug。

### S17. 作者紀錄第 0 節已過期

- 紀錄寫「`.txt` 第一行的標題把七支影片的主題標錯了」。現在十個 `.txt` 的檔頭都已是正確主題（檔案時間 14:39，晚於紀錄），只留下「轉錄時給模型的提示詞用了錯的主題名稱」的附註。紀錄請更新，免得下一位讀者以為檔頭仍然是錯的。

---

## 無誤確認

以下每一項都實際對過來源。

### 影片與堂次的對照表（第 51–59 行）

十支影片的逐字稿內容都和被歸到的那一堂相符：

| 影片 | 逐字稿實際內容 | 文章歸類 |
|---|---|---|
| zuiACAhRUzA | Colab、T4、PyTorch tensor | 9/01 Dev Infra |
| RYkEoCkJWeA | ipdb、SimpleMLP、裝置不一致 | 9/01 Dev Infra |
| anK1_PK464k | NLP 專案的一生、意圖分類 Colab | 9/08 NLP Lifecycle |
| 255ZzsTTHoU | 四大任務、NER、摘要、SQuAD | 9/15 Underlying Logic |
| eGQMzbhokg0 | LoRA、浮點格式、QLoRA、Axolotl | 9/22 LoRA |
| BBw-ki4_06o | scaling law、FLOPs、Chinchilla | 10/13 Basics |
| TzhCZOILzlI | RMSNorm、RoPE、KV cache、GQA、SwiGLU | 10/13 Architecture |
| AgZuF7lsu-8 | MoE 路由、capacity factor、MoD | 10/13 MoE |
| mulWMLla-AM | 量化、AWQ、GPTQ、評估 | 10/27 Inference & Eval |
| 4JPJkLxW84w | vLLM 離線與線上部署 | 11/03 Deployment |

講義頁數（46、43、33、30、37）用 pdfinfo 確認。封面文字（第 73 行）四份都對。

### 第 1 堂（抽查 20 項，全部相符）

`!pip show torch` 與 2.0.1、大於第二版；`torch.cuda.is_available()`、`!nvidia-smi`、約 15 GB；CUDA 11.8 對 12 的例子；`torch.arange(10)`、`torch.linspace(2.0, 3.0, steps=5)`、`torch.full((3, 4), 7)`、`zeros_like`／`ones_like`／`full_like`、`torch.tensor(ndarray)`；`x.view(2, 6)`、`x.view(-1, 6)`、`-1, 5` 報錯；2×3×4 的 `transpose(0, 1)` 與 `permute(1, 0, 2)` 都得 3×2×4；Colab 30 格、四段目錄、錯誤分類清單；`c`／`n`／`q` 與 `p`／`l`／`s`；五種啟動方式的寫法與助教推薦第二、四種；1000 筆、10 個特徵、`3 * X.sum(dim=1) + 2 + noise`、batch 32、`nn.Linear(10, 5)` 與 `nn.Linear(5, 1)`、MSELoss、Adam、10 個 epoch；`cuda:0`；錯誤訊息；除錯六步的順序；三十秒到一分鐘。

### 第 2 堂（抽查 24 項，除 S2、S9 外相符）

講義第 2、9、11、16–21、23、27、31–38、43 頁的內容；10 到 100 筆、幾十到幾百元、幾千到幾萬筆；兩篇論文與推薦第二篇；詐騙簡訊的例子；doccano 與 Scale AI；四種任務表；口述補的三個細節；twllm.com；FastAPI 與 Gradio；切分表與 10–30%；八成對六成；大模型不照這個框架；Colab 68 格與範例標題；`!pip install "transformers[torch]" datasets`、`notebook_login()`、`!apt install git-lfs`、4.11.0（助教口頭說 4.10，文章採 Colab）與 4.33、`distilbert-base-uncased`、`batch_size = 16`、`load_dataset("yentinglin/ntu_adl_recitation")`、`use_fast=True`、`dataset.map(preprocess_function, batched=True)`、learning rate 2e-5、5 個 epoch、`evaluation_strategy = "epoch"`、`metric_for_best_model`、weight decay；101；77 類是助教假設的例子；4690 步；`device` 的 -1 與 0；最後一格的 `'ner'`、「你的模型」、`fn=...`；`load_metric`、`evaluation_strategy` 確實是 Colab 的寫法。

### 第 3 堂（抽查 22 項，除 S14 外相符）

講義第 10 頁四種實體；第 17 頁 `tokens` 與 `ner_tags`（0、3、4、0；German 與 British 都是 7）；第 18 頁九個標籤與編號；2n + 1 與 9 類；`examples/pytorch/token-classification`；三支腳本的完整指令逐字對過第 25、36、42 頁的截圖（`run_ner.py` 5 個參數、`run_summarization.py` 11 個、`run_qa.py` 10 個，值全部相同）；`-h`、`gradient_accumulation_steps`；`pipeline` 的 `ner`、`gr.Interface`、`demo.launch()`；Spaces 的步驟；`--source_prefix` 與 8 × 4 = 32；`answer_start` 515 與 Saint Bernadette Soubirous；自我介紹的例子；`--max_seq_length 384`、`--doc_stride 128`、設 0 不重疊。表格頁碼範圍（10–31、33–36、38–42）與文字層相符。

### 第 4 堂（抽查 22 項，除 M1、M2、S13 外相符）

第 4 頁「Homework 3 Instruction tuning」；第 6 頁 Mistral-7B-v0.1、A10 PCIe 24 GB、四種格式、三種用途；rank 是概念上的；W_q／W_k／W_v／W_o；第 12 頁 A (d, r)、B (r, d)、1 到 32；d = 512、r = 4；第 14 頁表 5 文章列的五欄數字全部正確（省略了單獨 W_k、W_o 兩欄）、18M；至少 Q 與 V、rank 4、不建議 1 或 2 的理由；13B／34B／70B；第 19 頁三種格式的位元數；1,750 億參數；第 20 頁 E4M3、E5M2；NF4、bfloat16、dequantize；第 25 頁公式與 127；block-wise、double quantization、paged optimizer；第 29–30 頁 Axolotl、`examples/llama-2/qlora.yml`、`load_in_4bit: true`、`adapter: qlora`、`lora_r: 32`、`lora_alpha: 16`、`lora_dropout: 0.05`、`lora_target_modules:`、`accelerate launch -m axolotl.cli.train examples/llama-2/qlora.yml`。yaml 片段把不相鄰的行排在一起，值都對。第 10 頁 Umar Jamil 的出處標示。

### 第 5 堂（抽查 30 項，除 S1、S7 外相符）

第 3 頁三個詞；第 4 頁橫軸每格 100 倍、縱軸越低越好；第 5 頁 Taiwan-LLM；第 6 頁定義；第 8–9 頁公式與 `6 x 70e9 x 500e9 = 2e23`、GPT-4 2e25；第 10 頁三列金額與兩個問號；第 12 頁問題設定；第 13、14 頁出處與左右圖的讀法；data mixture；第 16 頁五項清單與「請見去年實習課影片」；架構表五列；10×3 矩陣；RoPE、KV cache、GQA、SwiGLU 的說明；第 18 頁五個模型的全部數字（Mixtral 13B／56B 等）；每次過 2 個、100B 以下；專家的個人看法與 2024 年 9 月；共享專家的兩種解讀；第 22 頁六個矩陣的形狀與「Attn 做 MoE 好處不大」；1024 維、4 個專家、W_g 1024×4；第 25 頁公式與圖（factor 1.0 時有一條虛線箭頭被丟、1.5 時每個專家 3 格）；第 27 頁兩邊的數字與 0.5、0.447；第 28、31、33 頁；batch size 1 的論點。

來源外的觀察：講義寫 Mixtral 8x7B 的總參數是 56B，就我所知官方數字約 47B。文章忠於講義，不必改；要加註請先查證。

### 第 6 堂（抽查 20 項，除 S4、S10 外相符）

第 2 頁五項；不講 PagedAttention 與 FlashAttention；vLLM 與 TGI；第 4、5 頁；第 8、11 頁的矩陣（3、3、1 得 (3, 6, 3)；3、1、0 得 (3, 2, 0)）；0.33 與 2.97、1.32、0.33；係數在 0 與 1 之間；第 13 頁的 Data Dependent；GPTQ 逐層與 reconstruction loss（第 19 頁）；中文校正資料的例子；AutoAWQ、AutoGPTQ；第 25 頁三類；MMLU；9/11 的例子（第 28 頁表格）；第 29 頁的圖在第 29 頁；MT-Bench 兩輪與 f(2)；GPT-4 或 Claude 2；第 32 頁三個部分與 1 到 10 分；第 34 頁成對比較；Elo 與對新模型不利。

### 第 7 堂（抽查 22 項，除 M3、S3 外相符）

CUDA 12.1 與 11.8；兩張 80 GB 的 H100；8B 與 70B；700 億參數、2 bytes；`dtype` 與 float16；CUDA graph 占額外記憶體；FP8 或 AWQ 省一半；offline 與 online；`max_tokens` 預設很小、助教說 32 還是 128；temperature、top-p、top-k、min-p；最後停在 user；4 個檔案、約一分鐘；先離線驗證輸出；tensor parallel 與前饋層；pipeline parallel 與 405B；張數設 1 或 2；70B 沒跑完；`vllm serve` 與 `--help`；not found 與模型名稱沒改；1,000 人每秒 1 個 token 對 10 人每秒 50 個；server 端的數字；examples 資料夾。

### 自編例子與計算題重算（全部正確）

| 位置 | 內容 | 重算 |
|---|---|---|
| 第 146 行 | (32, 1) 對 (32,) broadcast 成 (32, 32)，PyTorch 只給警告 | 正確；Colab 的 `y` 形狀是 (n,)、輸出是 (n, 1) |
| 第 232 行 | 15,000 ÷ 16 = 937.5，938 × 5 = 4,690 | 正確 |
| 第 282 行 | 2 × 3 + 1 = 7 | 正確 |
| 第 357 行 | 384 − 128 = 256；兩段；重疊 256–383 | 正確；`doc_stride` 在腳本裡確實當重疊量用 |
| 第 387 行 | 262,144；4,096；1.56% | 正確（1.5625%） |
| 第 429 行 | c = 63.5；[32, −64, 127]；[0.504, −1.008, 2.0]；混入 200 後 c = 0.635，得 0、−1、1 | 正確 |
| 第 440 行 | 14 GB、3.5 GB、四倍 | 正確 |
| 第 488 行 | 2.1×10²³ | 正確 |
| 第 550 行 | 26.2 億、5.7 億、18% | 正確（17.9%） |
| 第 560 行 | 6 ÷ 3 = 2；2 × 1.5 = 3 | 正確 |
| 第 566–568 行 | 0.5；0.34、0.66、0.447 | 正確（0.4467） |
| 第 614 行 | 平方和 40 與約 12.8 | 正確（12.77） |
| 第 666 行 | 140 GB、16 GB | 正確 |

自我檢查 14 題：答案全部正確。第 1、2、4–12、14 題可由正文直接推得；第 3 題「驗證集被反覆用來挑模型」可由第 218 行（以 accuracy 挑最佳模型）推得；第 13 題見 S11。第 4 題 750、第 5 題 5 類、第 7 題 1/64、第 9 題 3、第 11 題兩種做法的誤差、第 13 題 68 GB 都重算過。

常見誤解 9 條：每一條都有正文依據（依序對應第 93 與 142、197、244、409 與 425、544、540、622–626、644、681 與 685 行）。第 8 條的措辭見 S4。

### 契約符合度

- 學習目標：第 40–47 行六條，各自在正文有對應段落與例子。
- 完整例子：13 個，都有條件、推理、結果、意義；自編的都標了「本文自編」或「計算是本文做的」，出自助教的標了出處。
- 常見誤解 9 條、自我檢查 14 題附答案。
- 查核歷程：正文沒有逐頁核對或登入測試的流水帳。第 741 行的 404 日期與第 673、681 行的口述與文件不一致屬讀者需要的限制與來源衝突，位置恰當。
- 影片狀態行（第 863 行）寫的是語音辨識逐字稿，符合契約。
- 區塊順序：檢查器 0 issue。

### 中英對照

- 結構：H2 18／18、H3 30／30、表格列 81／81、程式碼區塊 14／14、自我檢查 14／14。
- 數字：逐行比對，差異都是單位換算（70 億對 7 billion、26.2 億對 2.62 billion、1,750 億對 175-billion）或數字寫成英文字，沒有不一致。
- 指令與程式碼：三支腳本、yaml、`accelerate launch` 逐字相同；行內程式碼只有第 236 行英文多寫成 `device=-1`、`device=0`，意思相同。
- 站內連結：英文版 20 個，除了指回中文版的那一個以外全部是 `-en`，對應檔案都存在。
- 漏譯：沒有發現。英文版第 38 行多一句授課語言說明，屬合理的在地化。
- 誤譯與用詞：見 S15。

### 其他格式

- 粗體 `**詞（說明）**` 後面直接接中文字的寫法：全文 0 處。
- 中國用語：指定清單 0 處，另見 S12。

### 來源外、未驗證的內容（僅標示）

第 34 行 Course Logistics 第 6 頁；第 53–59 行影片長度與同週講課；第 64 行放假日；第 68–71 行 YouTube 說明欄與錄製日期；第 463 行 HW2 題目與說明影片；第 654 行第 9 堂的指標；第 673、681 行 vLLM 原始碼；第 722–729 行作業對照表；第 741 行 404 測試；第 843 行播放清單對照；所有外部連結。
