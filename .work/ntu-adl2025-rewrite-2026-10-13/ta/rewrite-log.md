# ADL Fall 2025 助教課導讀重寫紀錄（2026-10-13）

文章：

- `src/content/posts/ai/2026-09-30-ntu-adl2025-ta-recitations.md`（sha256 開頭 1b4c8c8596c6611b）
- `src/content/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en.md`（sha256 開頭 254c229ce14f928d）

狀態：待獨立審稿。本紀錄是作者自述，不算教學驗收。未 commit。

## 0. 先記一件事：任務書與逐字稿檔頭的影片對照是錯的

> 後續更新（2026-10-13 14:39）：十個 `.txt` 的檔頭已改成正確的主題，並加註「轉錄時給模型的提示詞用了錯的主題名稱」。`cf_transcribe_ta.mjs` 裡的清單仍是錯的，檔頭有註記，重跑前要先改。以下是重寫當時的狀況。

任務書與 `.txt` 第一行的標題把七支影片的主題標錯了。依逐字稿實際內容核對，文章原本的對照表是對的，沒有改：

| 影片 ID | 檔頭／任務書寫的 | 實際內容 |
|---|---|---|
| BBw-ki4_06o | NLP Project Lifecycle 1 | LLM Basics（scaling law、FLOPs、Chinchilla） |
| TzhCZOILzlI | NLP Project Lifecycle 2 | Transformer Architecture（RMSNorm、RoPE、KV cache、GQA、SwiGLU） |
| AgZuF7lsu-8 | NLP Project Lifecycle 3 | MoE |
| anK1_PK464k | LLM Basics & MoE | NLP 專案的一生（36 分鐘） |
| 255ZzsTTHoU | LLM Inference & Evaluation | NLP 專案的底層邏輯 |
| mulWMLla-AM | LLM Deployment | LLM Inference & Evaluation |
| 4JPJkLxW84w | Underlying Logics of Projects | LLM Deployment（vLLM） |

zuiACAhRUzA、RYkEoCkJWeA、eGQMzbhokg0 三支的標示正確。產生逐字稿檔頭的 `cf_transcribe_ta.mjs` 清單需要修（本次沒有動它）。

## 1. 素材

- 逐字稿：十支全部讀完。
- 講義：五份 PDF 用 curl 從 `f113-adl/doc/` 下載到 scratchpad `ta-slides/`，先用 pdftotext 看文字層，再把程式碼、表格、數字頁轉成 PNG 讀圖。
- Colab：兩份都用 `drive.google.com/uc?id=…&export=download` 下載成 .ipynb 讀過（30 格、68 格），原文的格數與程式碼細節都對得上。
- `f114-adl/doc/` 五個講義路徑 2026-10-13 重試，仍然全部 404。
- vLLM 原始碼 v0.6.4（`entrypoints/llm.py`、`sampling_params.py`）：查 `enforce_eager` 的語意與 `max_tokens` 預設值。

## 2. 各堂用了哪些段落

### 1. Dev Infra & Tooling

- zuiACAhRUzA 00:00–01:50（七堂的安排）、02:00–06:20（Colab、T4、掛載 Drive、pip show、cuda.is_available、nvidia-smi、CUDA 版本不合）、06:20–17:30（tensor 操作、no_grad、view(-1, 6)、transpose 與 permute、為什麼要先知道功能再問 ChatGPT）
- RYkEoCkJWeA 00:00–03:50（錯誤分類、ipdb 指令、五種啟動方式）、03:50–06:20（SimpleMLP 訓練迴圈）、06:20–10:05（模型搬到 GPU、RuntimeError、ipdb 逐步檢查、修正）、10:05–11:20（為什麼推薦 `-c continue`）
- Colab 第 0–28 格：指令、函式名稱、五種啟動方式的寫法、假資料的產生方式都以 Colab 為準。

### 2. NLP 專案的一生

- anK1_PK464k 00:00–02:45（為什麼講這題、資料與 Demo 的輕重）、02:45–05:30（收集、清洗、標注、GPT-4 擴增、doccano、Scale AI）、05:30–09:05（四種任務）、09:05–10:25（Demo、FastAPI、Gradio）、10:25–15:25（舊作業一、HF dataset、三種切分、大模型不照這個框架）、15:25–35:55（Colab 逐格、101 起始 token、77 類、Trainer、4690 步、沒用到 GPU 不會報錯、push_to_hub、pipeline、Gradio、總結）
- 講義 w2 第 2、7–12、16–21、23、27–38、43 頁（文字層）。
- Colab 第 1–66 格。

### 3. NLP 專案的底層邏輯

- 255ZzsTTHoU 00:00–02:55（四大任務、HF 生態系）、02:55–10:45（NER、實習經驗、CoNLL-2003、BIO、2n+1）、10:45–14:45（run_ner.py、-h、gradient_accumulation_steps）、14:45–16:55（pipeline ner、Spaces）、16:55–19:45（摘要、CNN/DailyMail、source_prefix、per_device）、19:45–22:45（SQuAD、answer_start、自我介紹的例子、max_seq_length、doc_stride）、22:45–23:55（結語）
- 講義 w3 讀圖：第 18 頁（標籤對照）、24 頁（examples 資料夾）、25 頁（run_ner 指令）、29、31 頁（Spaces）、34 頁（CNN/DailyMail 欄位）、36 頁（run_summarization 指令）、40 頁（answer_start 515）、42 頁（run_qa 指令）；文字層第 17 頁（tokens 與 ner_tags）。

### 4. LLM LoRA Training

- eGQMzbhokg0 00:00–01:30（當年作業三、跑不跑得動）、02:00–03:15（Can you run it）、03:15–04:35（intrinsic rank 是概念上的）、04:35–07:30（Q/K/V/O、兩條路、d=512 r=4、可插拔、影像社群）、07:30–09:10（加在哪、rank 取多少、PEFT 比較）、09:10–12:10（LoRA 的限制、FP16 的 overflow、BF16、FP8）、12:10–16:05（NF4、paged optimizer、dequantize、absmax 到 127、double quantization、block-wise、效果比較）、16:05–17:55（Axolotl、設定檔、accelerate launch）
- 講義 w5 讀圖：第 6、14、19、20、25、29、30 頁；文字層第 2–4、7、12、13、18 頁。

### 5. LLM Basics、Architecture、MoE

- BBw-ki4_06o 00:00–02:35（三階段）、02:35–06:35（scaling law 的用途、Taiwan-LLM）、06:35–08:25（emergent abilities）、08:25–09:40（6 × 參數 × token）、09:40–12:10（成本與每年 10 倍）、12:10–15:10（Chinchilla、data mixture）、15:10–20:15（Llama 3 的兩張圖、最大的模型只能訓練一次）
- TzhCZOILzlI 00:00–03:00（差異很小、清單）、03:00–05:45（normalization、RMSNorm）、05:45–07:55（絕對與相對位置、RoPE）、07:55–09:15（KV cache）、09:15–10:15（multi-head、multi-query、grouped-query）、10:15–11:10（SwiGLU、LLaMA 是主流）
- AgZuF7lsu-8 00:00–02:15（8x7B、active 與 total）、02:15–05:30（MoE 加在 MLP、專家不是真專家）、05:30–07:35（共享專家）、07:35–09:55（attention 做 MoE）、10:00–12:20（token 先決、W_g）、12:20–14:25（塞車、capacity factor）、14:25–16:40（負載平衡 loss）、16:40–19:50（專家先決與它的問題）、19:50–23:10（Mixture-of-Depths 與 batch）
- 講義 w4 讀圖：第 22、25 頁；文字層第 3、6、8–10、12、16、18、27、28、31 頁。Attention 占一層參數約 18% 是本文用第 22 頁的形狀算的。

### 6. LLM Inference & Evaluation

- mulWMLla-AM 00:00–01:28（大綱、不講 Paged／Flash Attention、vLLM 與 TGI）、01:28–02:50（TheBloke、訓練後量化、GPU 與 CPU）、02:50–05:10（2-bit 手算）、05:10–06:45（AWQ）、06:45–08:50（GPTQ、中文校正資料）、08:50–11:45（評估、MMLU、TruthfulQA）、11:45–15:20（MT-Bench、AlpacaEval）、15:20–16:55（Chatbot Arena、Elo）
- 講義 w6 讀圖：第 8、11、14 頁；文字層第 2、5、7、9、12、13、16–25、32、34 頁。

### 7. LLM Deployment

- 4JPJkLxW84w 00:00–01:20（安裝、CUDA 12.1）、01:28–02:40（兩張 H100、70B × 2 bytes）、02:40–04:57（dtype、enforce_eager、量化）、05:03–06:30（offline 與 online）、06:30–09:40（LLM、SamplingParams、max_tokens、chat、載入）、09:47–11:22（latency 與 throughput、先驗證輸出）、11:22–13:45（tensor parallel、pipeline parallel）、13:45–20:55（web server、OpenAI 相容、vllm serve、not found 的錯誤、Python client）、20:56–22:30（server 端的數字、KV cache、讀原始碼）
- 沒有講義。

## 3. 刪掉或改正的原有句子

| 原文 | 處理 | 理由 |
|---|---|---|
| 「本文依據：…以及 Deployment 影片的 YouTube 自動字幕」「以下依影片的 YouTube 自動字幕整理」 | 改成十支都用音訊轉錄的逐字稿 | 這次的底本是機器轉錄逐字稿 |
| 「這對讀者有兩個實際影響」 | 擴成三點，各附影片口述的依據 | 逐字稿確認了作業一（意圖分類）、作業三（instruction tuning、7B）、「最後一次實習課」「上禮拜講過架構」「去年上過類似的」 |
| 第 1 堂「建議把那個範例當成除錯練習…對一下兩邊的形狀，正好是這堂課想教的 tensor 錯誤」 | 改寫 | 影片示範的是裝置不一致（模型在 cuda:0、資料在 cpu），不是形狀。形狀那個觀察 Colab 上確實成立（輸出 (32,1)、標籤 (32,)），保留但標成「本文自編」的延伸練習，並補上 broadcasting 的推理 |
| 第 1 堂「筆記本用中文整理了 n、c、q、p、l、s 六個常用指令」 | 改成助教說最常用 c、n、q，另列 p、l、s | 依口述的輕重 |
| 第 3 堂「講義裡『怎麼訓練？』的頁面多半是程式碼截圖，文字層抽不出來，細節要看影片」 | 刪掉，換成三支腳本的完整指令 | 已讀圖取得 |
| 第 3 堂表格「分類句中每個詞：第 10–25 頁」 | 改成第 10–31 頁 | 第 27–31 頁是這個任務的 Spaces Demo |
| 第 4 堂「最後一頁『How to use (Q)Lora?』之後的操作示範不在 PDF 裡，要看影片」 | 改正 | 第 29、30 頁就是 Axolotl 與設定檔截圖 |
| 第 4 堂「規格文件沒有公開，但助教在說明影片裡說…」 | 改成「Fall 2025 的助教」 | 避免和錄影的助教混淆 |
| 第 5 堂「Transformer Architecture…只有一頁清單…所以細節都在影片裡」 | 改成逐項整理影片內容 | 已有逐字稿 |
| 第 5 堂 scaling law 段「拿 Taiwan-LLM 和 GPT-4 對照」 | 補上講義的兩組數字並驗算 | 講義第 9 頁 |
| 第 6 堂「實際展開的只有量化，後兩項只出現在大綱頁」 | 保留，補上助教自己說這堂不講 | 口述確認 |
| 第 7 堂「講者常調的只有三個參數」「講者的建議是」「講者也提到」 | 全部改稱「助教」 | 任務要求 |
| 第 7 堂 `enforce_eager`「關掉 CUDA Graph 省一點記憶體」 | 保留結論，加註口述與文件不一致 | 逐字稿說設成 false；vLLM v0.6.4 原始碼寫 True 才關掉 CUDA graph |
| 第 7 堂「`max_tokens` 的預設值很小」 | 保留，補上 v0.6.4 原始碼的預設值 16 | 助教說「32 還是 128」，自己也不確定 |
| 第 7 堂「部署 Llama 3 的 8B 與 70B」 | 改成「實驗室以 Llama 3 為基礎的模型」 | 口述是臺灣版的 Llama 3 |
| 存取與缺口第 5 點「講義裡多數程式碼是截圖，要搭配影片看」 | 改寫並加第 6 點（兩支是現場錄影） | 影片也沒有字幕；現場提問的回答沒錄進去 |
| 影片來源區最後一段「兩支 PyTorch 助教影片…沒有可取得的字幕…其他助教影片這次沒有重新對照」 | 換成指定的「內容核對」句 | 任務要求 |
| tldr「10 支影片全部是林彥廷在 2023 與 2024 年錄的舊片」 | 改稱助教 | 任務要求。姓名只留在引用 YouTube 說明欄的那一句，以及抽取式問答例子裡助教拿自己名字當例句 |

## 4. 逐字稿聽不清楚而略過的地方

- PyTorch Debugging：訓練前後的 loss 數值（聽成「200 多」「991」）；助教信箱。
- NLP Lifecycle：示範句的完整英文（只寫成「請對方代訂機票的句子」）；模型快取資料夾的完整路徑；Demo 裡輸入的幾個測試句與輸出。
- Underlying Logic：Token Classification 底下的資料集數量；助教實習單位的細節。
- LoRA：Can you run it 該看哪一欄的那句（聽成「intflow」）；Meta 那個模型的名稱（只寫 1,750 億參數）；助教說可以改用的 Hugging Face 函式庫名稱；設定檔上 `sequence_len` 箭頭那句更正。
- LLM Basics：提到的兩位公司執行長受訪的說法與研究者主管的姓名；GPT-4 何時訓練完成；圖上灰點差幾個數量級的確切數字。
- Architecture：「很多改動出自同一位作者」那段的人名與比例；RoPE 的數學（尤拉公式那段）與「越遠注意力越低」的保證；multi-query 與硬體相關的那句；沿用 LLaMA 架構的模型名稱。
- MoE：開頭提到的業界分析文章；JetMoE 表現好的真正原因；capacity factor 之外的 loss 名稱（z loss）。
- Inference & Eval：壓到不到 1 bit 的論文；發表模型後有人上傳量化版的軼事人名；TruthfulQA 與 AlpacaEval 的題數；AlpacaEval 基準模型的型號；排行榜上兩個模型名次的觀察。
- Deployment：`max_tokens` 預設值（改用原始碼的數字並註明）；server 端印出的實際數值；範例裡原本的模型名稱。

## 5. 新增內容的出處標示

- 助教在影片裡示範或舉的例子：view(-1, 6)、裝置不一致的除錯、The European Commission 的 BIO 標籤、d=512 r=4、capacity factor、負載平衡 loss、2-bit 量化。
- 本文自編：MSELoss 的 broadcasting 練習、4690 步的驗算、三種實體要 7 類、滑動視窗切兩段、Int8 量化的三個數、7B 的 14 GB 與 3.5 GB、70B 的 140 GB。Attention 占 18% 用的是講義的形狀，計算是本文做的。2-bit 例子裡「除以 0.33 還原再比誤差」那一步是本文補的。
- 自我檢查 14 題、常見誤解 9 條都是本文自擬。

## 6. 檢查結果

- `check-course-titles.mjs`：0 issue
- `check-course-guide-layout.mjs`：0 issue
- `pnpm -s check:lang-parity | grep ta-recitations`：沒有輸出
- `pnpm -s check:tw | grep ta-recitations`：沒有輸出
- 另外跑了 `check:references`、`check:course-videos`，都沒有這兩個檔的輸出；兩篇各 20 個站內連結，對應檔案都存在。
- 新增的兩個外部連結（Axolotl、Can you run it）與一個站內連結（第 8 堂 RAG）已加進內文與參考資料。
- 沒有看實際渲染的頁面。
